sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (MessageToast, Fragment, JSONModel) {
    'use strict';

    return {

        excluirTransacao: function (oEvent) {

            //Pesquisa tabelas da tela para manipulação
            let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.Table") && oControl.getId().includes("i18nTransaescompras-innerTable");
            });

            let oTabela = oTabelas[0];
            let oTransacao = oTabela.getSelectedItems()[0].getBindingContext().getValue();
            const oFatura = this.getBindingContext().getValue();

            const oView = this.editFlow.getView();

            if (oTransacao.ParcelasTotais > 1) {

                var securedExecution = () => {

                    return new Promise((resolve, reject) => {

                        try {

                            //Busca Moedas
                            fetch(`/Gerenciamento/Transacao?$filter=ID eq ${oTransacao.ID}`, {
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

                                    //Filtrando os itens que têm um ID dentro da lista de IDs
                                    //oTransacao = oTransacoes.filter(item => [oTransacao.ID].includes(item.ID));

                                    // if (oTransacao) {
                                    //     //Filtrando o array com base nas duas condições
                                    //     oRelacionadas = oTransacoes.filter(item => item.Identificador === oTransacao.Identificador && item.ID !== oTransacao.ID);
                                    // }

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

        }
    };
});