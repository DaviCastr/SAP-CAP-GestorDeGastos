sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (Fragment, JSONModel) {
    'use strict';

    return {

        excluirTransacao: function (oEvent) {

            try {

                //Pesquisa tabelas da tela para manipulação
                let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                    return oControl.isA("sap.m.Table") && oControl.getId().includes("i18nTransaescompras-innerTable");
                });

                let oTabela = oTabelas[0];
                let oTransacao = oTabela.getSelectedItems()[0].getBindingContext().getValue();
                const oFatura = this.getBindingContext().getValue();

                sap.ui.getCore().oFatura = oFatura;

                const oView = this.editFlow.getView();
                const oModel = oView.getModel();

                if (oTransacao.ID){

                    var securedExecution = function ()  {

                        return new Promise(function (resolve, reject) {

                            try {

                                //Busca Moedas
                                fetch(`${oModel.getServiceUrl()}Transacao?$filter=ID eq ${oTransacao.ID}`, {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                    }
                                }).then(async function (data) {

                                    console.log(data)

                                    let oData = await data.json();

                                    let oTransacoes = Array.isArray(oData.value) ? oData.value : [oData.value];

                                    if (!data.ok) {

                                        throw new Error("Erro ao selecionar transações");

                                    }

                                    oTransacao = oTransacoes[0];

                                    fetch(`${oModel.getServiceUrl()}Transacao?$filter=Identificador eq ${oTransacao.Identificador} and ID ne ${oTransacao.ID}`, {
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
                                            Fixo: oTransacao.ParcelasTotais == 1 && oRelacionadas.length > 0 ? true : false,
                                            Relacionadas: oRelacionadas
                                        }

                                        const oTransacoesRelacionadas = new JSONModel(oModelJson);

                                        // Carregar o fragmento do diálogo
                                        if (!sap.ui.getCore().pDialogExcluir) {
                                            sap.ui.getCore().pDialogExcluir = Fragment.load({
                                                id: "ExcluirTransacaoFragment",
                                                name: "apps.dflc.gestaogastos.ext.fragment.ExcluirTransacao",
                                                //controller: this
                                            }).then(function (oDialog) {
                                                oView.addDependent(oDialog);
                                                return oDialog;
                                            });
                                        }

                                        sap.ui.getCore().pDialogExcluir.then(function (oDialog) {
                                            oDialog.open();
                                            oDialog.setModel(oTransacoesRelacionadas, "Transacao");
                                        }.bind(this));

                                        resolve();

                                    }.bind(this)).catch(function (error) {
                                        sap.m.MessageToast.show("Erro ao chamar serviço de Transações: " + error);
                                        reject();

                                    });

                                }.bind(this)).catch(function (error) {
                                    sap.m.MessageToast.show("Erro ao chamar serviço de Transações: " + error);
                                    reject();

                                });

                            } catch (oError) {
                                sap.m.MessageToast.show("Erro ao chamar serviço: " + oError.message);
                            }

                        }.bind(this));

                    }.bind(this)

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

                } 
             
            } catch (erro) {
                sap.m.MessageToast.show("Erro:" + erro);
            }

        }
    };
});