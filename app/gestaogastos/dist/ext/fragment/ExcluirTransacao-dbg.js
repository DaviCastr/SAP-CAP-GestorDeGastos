sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (MessageToast, JSONModel) {
    'use strict';

    return {

        excluirTransacao: function (oEvent) {

            var oDialog = oEvent.getSource().getParent();
            var oView = this.getParent().getParent();
            var oIdTransacao = oView.byId("idTransacao").getValue();
            var oIdentificador = oView.byId("identificadorTransacao").getValue();
            var oExcluirRelacionadas = oView.byId("excluirTransacoesRelacionadas").getSelected();

            //Pesquisa tabelas da tela para manipulação
            let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.Table") && oControl.getId().includes("i18nTransaescompras-innerTable");
            });

            let oTabela = oTabelas[0];
            let oFatura = this.getBindingContext().getValue();

            if (sap.ui.getCore().oFatura) {
                oFatura = sap.ui.getCore().oFatura
            }

            // Lógica de envio dos dados para exclusão
            var oPayload = {
                fatura: oFatura.ID,
                transacao: oIdTransacao,
                identificador: oIdentificador,
                excluirRelacionadas: oExcluirRelacionadas
            };

            oDialog.setBusy(true);

            var securedExecution = () => {

                return new Promise((resolve, reject) => {

                    fetch("/Gerenciamento", {
                        method: "GET",
                        headers: {
                            "X-CSRF-Token": "Fetch"
                        }
                    })
                        .then(function (response) {
                            if (!response.ok) {
                                throw new Error("Erro ao obter CSRF Token");
                            }
                            return response;
                        }.bind(this))
                        .then(function (response) {
                            const csrfToken = response.headers.get("X-CSRF-Token");
                            return csrfToken;
                        }.bind(this)).then(function (csrfToken) {

                            fetch("/Gerenciamento/excluirTransacao", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "X-CSRF-Token": csrfToken
                                },
                                body: JSON.stringify(oPayload)
                            }).then(function (response) {
                                if (!response.ok) {
                                    throw new Error("Erro ao excluir transação.");
                                }
                                return response.json();
                            }).then(function (data) {

                                //Pesquisa tabelas da tela para manipulação
                                let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                                    return oControl.isA("sap.m.Table") && oControl.getId().includes("innerTable");
                                });

                                if (oTabelas.length) {
                                    let oTransacoesTabela = oTabelas[0];
                                    oTransacoesTabela.refreshItems()
                                    const oFaturaObjeto = this.getBindingContext();
                                    oFaturaObjeto.refresh();
                                }

                                // let oFormularios = sap.ui.core.Element.registry.filter(function (oControl) {
                                //     return oControl.isA("sap.ui.layout.form.SimpleForm") && oControl.getId().includes("idFaturaForm")
                                // });

                                // if (oFormularios.length) {

                                //     let oFormularioFatura = oFormularios[0];

                                //     oFormularioFatura.getBindingContext().refresh();

                                // }

                                // //Pesquisa tabelas da tela para manipulação
                                // let oTabelasTransacoes = sap.ui.core.Element.registry.filter(function (oControl) {
                                //     return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsTable");
                                // });


                                // if (oTabelasTransacoes.length) {

                                //     let oTabelaTransacoes = oTabelasTransacoes[0];

                                //     oTabelaTransacoes.getModel().refresh();

                                // }

                                let oVBoxsFaturaAtual = sap.ui.core.Element.registry.filter(function (oControl) {
                                    return oControl.isA("sap.m.VBox") && oControl.getId().includes("FaturaAtualVBox");
                                });                    

                                if (oVBoxsFaturaAtual.length) {

                                    let oVBoxFaturaAtual = oVBoxsFaturaAtual[0];

                                    oVBoxFaturaAtual.getBindingContext().refresh();

                                }

                                oView.byId("excluirTransacoesRelacionadas").setSelected(false);

                                sap.m.MessageToast.show("Transação excluída com sucesso.");
                                oDialog.setBusy(false);
                                oDialog.close();
                                resolve();
                            }.bind(this)).catch(function (error) {
                                oDialog.setBusy(false);
                                sap.m.MessageToast.show("Erro: " + error.message);
                                reject();
                            });

                        }.bind(this)).catch(function (error) {
                            sap.m.MessageToast.show("Erro ao obter csrf token: " + error);
                            reject();

                        });

                })
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

            let editFlow = this.getParent().getParent().getController().getExtensionAPI().getEditFlow();

            editFlow.securedExecution(securedExecution, oParameters).finally((final) => {
                console.log(final)
            });

        },

        cancelarExclusao: function (oEvent) {

            this.getParent().close();

        }

    }

});