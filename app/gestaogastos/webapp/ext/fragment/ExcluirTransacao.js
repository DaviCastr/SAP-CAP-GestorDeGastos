sap.ui.define([
    "apps/dflc/gestaogastos/ext/fragment/AtualizaInformacoesDaTela",
    "sap/ui/core/Fragment",
], function (AtualizaInformacoesDaTela, Fragment) {
    //'use strict';

    return {

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

        excluirTransacao: function (oEvent) {

            var oDialog = oEvent.getSource().getParent();
            var oView = this.getParent().getParent();
            var oModel = oView.getModel();
            var oIdTransacao = Fragment.byId("ExcluirTransacaoFragment", "idTransacao").getValue();
            var oIdentificador = Fragment.byId("ExcluirTransacaoFragment", "identificadorTransacao").getValue();
            var oExcluirRelacionadas = Fragment.byId("ExcluirTransacaoFragment", "excluirTransacoesRelacionadas").getSelected();

            let oFatura = this.getBindingContext()?.getValue() || null;

            if (sap.ui.getCore().oFatura) {
                oFatura = sap.ui.getCore().oFatura
            }

            if(!oFatura){
                sap.m.MessageToast.show("Erro ao obter dados");
                return;
            }

            // Lógica de envio dos dados para exclusão
            var oPayload = {
                fatura: oFatura.ID,
                transacao: oIdTransacao,
                identificador: oIdentificador,
                excluirRelacionadas: oExcluirRelacionadas
            };

            oDialog.setBusy(true);

            var securedExecution = function () {

                return new Promise(function (resolve, reject) {

                    fetch(oModel.getServiceUrl(), {
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

                            fetch(`${oModel.getServiceUrl()}excluirTransacao`, {
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
                            }).then(async function (data) {

                                AtualizaInformacoesDaTela.AtualizaInformacoes(oView);

                                Fragment.byId("ExcluirTransacaoFragment", "excluirTransacoesRelacionadas").setSelected(false);

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
                            oDialog.setBusy(false);
                            sap.m.MessageToast.show("Erro ao obter csrf token: " + error);
                            reject();

                        });

                }.bind(this))
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