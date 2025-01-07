sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
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

            // Lógica de envio dos dados para exclusão
            var oPayload = {
                fatura: this.getBindingContext().getValue().ID,
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
                        }.bind(this)).then( function (csrfToken) {

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

                                let oTransacoesTabela = oTabelas[0];
                                oTransacoesTabela.refreshItems()
                                const oFaturaObjeto = this.getBindingContext();
                                oFaturaObjeto.refresh()

                                sap.m.MessageToast.show("Transação excluída com sucesso.");
                                oDialog.setBusy(false);
                                oDialog.close();
                                oTabela.getModel().refresh();
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