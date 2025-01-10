sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (MessageToast, Fragment, JSONModel) {
    'use strict';

    return {
        onPress: function (oEvent) {
            MessageToast.show("Custom handler invoked.");
        },

        formatter: {

            formatDate: function (sDate) {

                if (!sDate) {
                    return "";
                }
                const oDate = new Date(`${sDate}T00:00:00`);
                const dd = String(oDate.getDate()).padStart(2, '0');
                const mm = String(oDate.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
                const yyyy = oDate.getFullYear();

                return `${dd}/${mm}/${yyyy}`; // Ou use '-' em vez de '/'

            }
        },

        excluirTransacao: async function (oEvent) {

            //Pesquisa formulário da fatura
            let oFormularios = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.ui.layout.form.SimpleForm") && oControl.getId().includes("idFaturaForm");
            });

            let oFormularioFatura = oFormularios[0];

            //Pesquisa tabelas da tela para manipulação
            let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsTable");
            });

            let oTabelaTransacoes = oTabelas[0];

            // Obtém os itens selecionados
            const oSelectedItems = oTabelaTransacoes.getSelectedItems();

            if (oSelectedItems.length === 0) {
                // Mostra uma mensagem caso nenhuma linha esteja selecionada
                sap.m.MessageToast.show("Selecione uma transação para excluir.");
                return;
            }

            let oFaturaAtual = oFormularioFatura.getBindingContext().getValue();//oSelectedItems[0].getModel("FaturaAtual").getData();
            //let oPath = oSelectedItems[0].getBindingContextPath().split('/');

            let oTransacao = oSelectedItems[0].getBindingContext().getValue(); //oFaturaAtual.Transacoes[`${oPath[2]}`];

            const oView = this._view;

            sap.ui.getCore().oFatura = oFaturaAtual;

            if (oTransacao.ParcelasTotais > 1) {

                var securedExecution = () => {

                    return new Promise((resolve, reject) => {

                        try {

                            fetch(`/Gerenciamento/Transacao?$filter=Identificador eq ${oTransacao.Identificador} and ID ne ${oTransacao.ID}`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Accept": "application/json",
                                }
                            }).then(async function (data) {

                                console.log(data)

                                let oData = await data.json();

                                let oRelacionadas = Array.isArray(oData.value) ? oData.value : [oData.value];

                                oRelacionadas = oRelacionadas.sort(function (a, b) {
                                    return b.Parcela - a.Parcela;
                                });

                                let oModelJson = {
                                    Dados: oTransacao,
                                    Relacionadas: oRelacionadas
                                }

                                const oTransacoesRelacionadas = new JSONModel(oModelJson);

                                oView.setModel(oTransacoesRelacionadas, "Transacao");

                                // Carregar o fragmento do diálogo
                                if (!this.pDialog) {
                                    this.pDialog = Fragment.load({
                                        id: oView.getId(),
                                        name: "apps.dflc.gestaogastos.ext.fragment.ExcluirTransacao",
                                        //controller: this
                                    }).then(function (oDialog) {
                                        oView.addDependent(oDialog);
                                        return oDialog;
                                    });
                                }

                                this.pDialog.then(function (oDialog) {
                                    oDialog.open();
                                });

                                resolve();

                            }.bind(this)).catch(function (error) {
                                sap.m.MessageToast.show("Erro ao chamar serviço de Transações: " + error);
                                reject();

                            });


                        } catch (oError) {
                            sap.m.MessageToast.show("Erro ao chamar serviço: " + oError.message);
                        }

                    });

                }

                let oParameters = {
                    busy: {
                        set: true,
                        check: true
                    },
                    dataloss: {
                        popup: true,
                        navigation: false
                    }
                }

                this.editFlow.securedExecution(securedExecution, oParameters).finally((final) => {
                    console.log(final)
                });

            } else {

                let oModelJson = {
                    Dados: oTransacao,
                    Relacionadas: []
                }

                const oTransacoesRelacionadas = new JSONModel(oModelJson);

                oView.setModel(oTransacoesRelacionadas, "Transacao");

                // Carregar o fragmento do diálogo
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        id: oView.getId(),
                        name: "apps.dflc.gestaogastos.ext.fragment.ExcluirTransacao",
                        //controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }

                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                });

            }

        },

        pesquisarTransacao: function (oEvent) {
            var oTableSearchState = [],
                sQuery = oEvent.getParameter("query");

            if (sQuery && sQuery.length > 0) {
                oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
            }

            const oView = this._view.byId("transactionsTable").getBinding("items").filter(oTableSearchState, "Application");
        }
    };
});
