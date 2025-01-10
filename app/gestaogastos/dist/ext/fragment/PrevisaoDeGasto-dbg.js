sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';

    return {

        onInit: function (oEvent) {
            console.log(oEvent);
        },

        onBuscarSimulação: function (oEvent) {

            let oModel = this.getModel();

            var securedExecution = () => {

                return new Promise((resolve, reject) => {

                    let oAno = this.byId("ListaAno").getSelectedItem().getText();
                    let oMes = this.byId("ListaMes").getSelectedItem().getText()

                    const oPayload = {
                        pessoa: this.getBindingContext().getObject().ID,
                        mes: oMes,
                        ano: oAno
                    };

                    try {

                        fetch("/Gerenciamento", {
                            method: "GET",
                            headers: {
                                "X-CSRF-Token": "Fetch" }
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

                                fetch("/Gerenciamento/simulaPorMesAno", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                        "X-CSRF-Token": csrfToken
                                    },
                                    body: JSON.stringify(oPayload)
                                }).then(async function (data) {
                                    console.log(data)

                                    let oData = await data.json();

                                    let oTotalDoMes = this.byId("TotalDoMes");
                                    let oTotalDeGastos = this.byId("TotalDeGastos");
                                    let oValorAEconomizar = this.byId("ValorAEconomizar");

                                    oTotalDoMes.setNumber(oData.TotalDoMes)
                                    oTotalDoMes.setUnit(oData.Moeda_code)
                                    oTotalDeGastos.setNumber(oData.TotalDeGastos)
                                    oTotalDeGastos.setUnit(oData.Moeda_code)
                                    oValorAEconomizar.setNumber(oData.ValorAEconomizar)
                                    oValorAEconomizar.setUnit(oData.Moeda_code)

                                    resolve();

                                }.bind(this)).catch(function (error) {
                                    sap.m.MessageToast.show("Erro ao chamar serviço: " + error);
                                    reject();

                                });

                            }.bind(this)).catch(function (error) {
                                sap.m.MessageToast.show("Erro ao obter csrf token: " + error);
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

        }
    };
});
