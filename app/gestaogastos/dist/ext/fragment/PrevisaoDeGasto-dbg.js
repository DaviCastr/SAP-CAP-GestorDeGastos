sap.ui.define([
<<<<<<< HEAD
    "apps/dflc/gestaogastos/ext/fragment/AnaliseCategoriaPessoa"
], function (AnaliseCategoriaPessoa) {
=======
    "sap/m/MessageToast"
], function (MessageToast) {
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
    'use strict';

    return {

        onInit: function (oEvent) {
            console.log(oEvent);
        },

        onBuscarSimulação: function (oEvent) {

<<<<<<< HEAD
            try {

                let oModel = this.getModel();

                var securedExecution = function () {

                    return new Promise( function (resolve, reject) {

                        let oAno = this.byId("ListaAno").getSelectedItem().getText();
                        let oMes = this.byId("ListaMes").getSelectedItem().getText()

                        const oPayload = {
                            pessoa: this.getBindingContext().getObject().ID,
                            mes: oMes,
                            ano: oAno
                        };

                        try {

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

                                    fetch(`${oModel.getServiceUrl()}simulaPorMesAno`, {
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

                                        let oFunctionName = "recuperaCategorias",
                                            oFunction = oModel.bindContext(`/${oFunctionName}(...)`);

                                        let oAdicionaCategorias = function (idFlexBox, oRetorno, total) {

                                            // Criação de MicroCharts para cada categoria
                                            let oCategoryCharts = sap.ui.core.Element.registry.filter(function (oControl) {
                                                return oControl.isA("sap.m.FlexBox") && oControl.getId().includes(`${idFlexBox}`);
                                            });

                                            if (oCategoryCharts.length > 0) {

                                                if (oRetorno?.Categorias) {

                                                    oCategoryCharts = oCategoryCharts[0];

                                                    const aTiles = [];
                                                    oRetorno.Categorias.forEach(categoria => {
                                                        const totalCategoria = categoria.TotalCategoria || 0;
                                                        const porcentagem = categoria.Porcentagem

                                                        const oTile = new sap.m.GenericTile({
                                                            id: `Previsao::${categoria.ID}::${crypto.randomUUID()}`,
                                                            header: categoria.Nome,
                                                            subheader: `${totalCategoria} ${oRetorno.Moeda}`,
                                                            press: function (oEvent) {

                                                                if (!total) {
                                                                    AnaliseCategoriaPessoa.onPressPrevisao(oEvent, oAno, oMes);
                                                                } else {
                                                                    AnaliseCategoriaPessoa.onPressPrevisaoTotal(oEvent, oAno, oMes);
                                                                }

                                                            }.bind(this),
                                                            frameType: "OneByOne",
                                                            tileContent: [
                                                                new sap.m.TileContent({
                                                                    footer: `Gasto: ${porcentagem.toFixed(2)}%`,
                                                                    content: new sap.m.HBox({
                                                                        items: [new sap.m.Avatar({
                                                                            src: categoria?.Imagem || null,
                                                                            displaySize: "XS"
                                                                        }),
                                                                        new sap.suite.ui.microchart.RadialMicroChart({
                                                                            size: sap.m.Size.S,
                                                                            percentage: porcentagem,
                                                                            valueColor: porcentagem > 20 ? "Error" : "Good",
                                                                            alignContent: "Center"
                                                                        })]
                                                                    }),
                                                                })]
                                                        });

                                                        aTiles.push(oTile);
                                                    });

                                                    oCategoryCharts.removeAllItems();
                                                    if (aTiles.length == 0) {
                                                        oCategoryCharts.addItem(new sap.m.Label({ text: 'Não há categorias com gastos nesse Mês' }));
                                                    } else {
                                                        aTiles.forEach((oTile, index) => {
                                                            oCategoryCharts.addItem(oTile);
                                                            if (index < aTiles.length - 1) {
                                                                oCategoryCharts.addItem(new sap.m.Label({ text: '  --  ' }));
                                                            }
                                                        });
                                                    }

                                                    oCategoryCharts.setBusy(false);

                                                } else {
                                                    oCategoryCharts[0].removeAllItems();
                                                    oCategoryCharts[0].addItem(new sap.m.Label({ text: 'Não há categorias com gastos nesse Mês' }));
                                                }

                                            }

                                        }

                                        oFunction.setParameter("pessoa", oPayload.pessoa);
                                        oFunction.setParameter("mes", oPayload.mes);
                                        oFunction.setParameter("ano", oPayload.ano);
                                        await oFunction.execute();
                                        let oRetorno = oFunction.getBoundContext().getValue();

                                        oAdicionaCategorias("categoryPrevisao", oRetorno);

                                        oFunctionName = "recuperaCategoriasParaGastoTotal",
                                            oFunction = oModel.bindContext(`/${oFunctionName}(...)`);

                                        oFunction.setParameter("pessoa", oPayload.pessoa);
                                        oFunction.setParameter("mes", oPayload.mes);
                                        oFunction.setParameter("ano", oPayload.ano);
                                        await oFunction.execute();
                                        oRetorno = oFunction.getBoundContext().getValue();

                                        oAdicionaCategorias("categoryPrevisaoTotal", oRetorno, true);

                                        resolve();

                                    }.bind(this)).catch(function (error) {
                                        sap.m.MessageToast.show("Erro ao chamar serviço: " + error);
                                        reject();

                                    });

                                }.bind(this)).catch(function (error) {
                                    sap.m.MessageToast.show("Erro ao obter csrf token: " + error);
=======
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
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
                                    reject();

                                });

<<<<<<< HEAD
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

            } catch (erro) {
                sap.m.MessageToast.show("Erro ao buscar dados" + erro);
            }

=======
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

>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
        }
    };
});
