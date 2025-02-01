sap.ui.define([
<<<<<<< HEAD
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

=======
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (MessageToast, JSONModel) {
    'use strict';

    return {

>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
        excluirTransacao: function (oEvent) {

            var oDialog = oEvent.getSource().getParent();
            var oView = this.getParent().getParent();
<<<<<<< HEAD
            var oModel = oView.getModel();
            var oIdTransacao = Fragment.byId("ExcluirTransacaoFragment", "idTransacao").getValue();
            var oIdentificador = Fragment.byId("ExcluirTransacaoFragment", "identificadorTransacao").getValue();
            var oExcluirRelacionadas = Fragment.byId("ExcluirTransacaoFragment", "excluirTransacoesRelacionadas").getSelected();

            let oFatura = this.getBindingContext()?.getValue() || null;
=======
            var oIdTransacao = oView.byId("idTransacao").getValue();
            var oIdentificador = oView.byId("identificadorTransacao").getValue();
            var oExcluirRelacionadas = oView.byId("excluirTransacoesRelacionadas").getSelected();

            //Pesquisa tabelas da tela para manipulação
            let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.Table") && oControl.getId().includes("i18nTransaescompras-innerTable");
            });

            let oTabela = oTabelas[0];
            let oFatura = this.getBindingContext().getValue();
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a

            if (sap.ui.getCore().oFatura) {
                oFatura = sap.ui.getCore().oFatura
            }

<<<<<<< HEAD
            if(!oFatura){
                sap.m.MessageToast.show("Erro ao obter dados");
                return;
            }

=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
            // Lógica de envio dos dados para exclusão
            var oPayload = {
                fatura: oFatura.ID,
                transacao: oIdTransacao,
                identificador: oIdentificador,
                excluirRelacionadas: oExcluirRelacionadas
            };

            oDialog.setBusy(true);

<<<<<<< HEAD
            var securedExecution = function () {

                return new Promise(function (resolve, reject) {

                    fetch(oModel.getServiceUrl(), {
=======
            var securedExecution = () => {

                return new Promise((resolve, reject) => {

                    fetch("/Gerenciamento", {
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
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

<<<<<<< HEAD
                            fetch(`${oModel.getServiceUrl()}excluirTransacao`, {
=======
                            fetch("/Gerenciamento/excluirTransacao", {
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
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
<<<<<<< HEAD
                            }).then(async function (data) {

                                AtualizaInformacoesDaTela.AtualizaInformacoes(oView);

                                Fragment.byId("ExcluirTransacaoFragment", "excluirTransacoesRelacionadas").setSelected(false);
=======
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

                                let oVBoxsFaturaAtual = sap.ui.core.Element.registry.filter(function (oControl) {
                                    return oControl.isA("sap.m.VBox") && oControl.getId().includes("FaturaAtualVBox");
                                });                    

                                if (oVBoxsFaturaAtual.length) {

                                    let oVBoxFaturaAtual = oVBoxsFaturaAtual[0];

                                    oVBoxFaturaAtual.getBindingContext().refresh();

                                }

                                oView.byId("excluirTransacoesRelacionadas").setSelected(false);
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a

                                sap.m.MessageToast.show("Transação excluída com sucesso.");
                                oDialog.setBusy(false);
                                oDialog.close();
<<<<<<< HEAD

=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
                                resolve();
                            }.bind(this)).catch(function (error) {
                                oDialog.setBusy(false);
                                sap.m.MessageToast.show("Erro: " + error.message);
                                reject();
                            });

                        }.bind(this)).catch(function (error) {
<<<<<<< HEAD
                            oDialog.setBusy(false);
=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
                            sap.m.MessageToast.show("Erro ao obter csrf token: " + error);
                            reject();

                        });

<<<<<<< HEAD
                }.bind(this))
            }.bind(this)
=======
                })
            }
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a

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