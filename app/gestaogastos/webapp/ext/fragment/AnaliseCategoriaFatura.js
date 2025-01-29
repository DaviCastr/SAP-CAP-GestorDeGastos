sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';

    return {
        defineGraficoCategorias: async function (oFaturaController, oBindingContext) {

            try {

                let oPaineis = sap.ui.core.Element.registry.filter(function (oControl) {
                    return oControl.isA("sap.m.FlexBox") && oControl.getId().includes("categoryFatura");
                });

                if (Array.isArray(oPaineis)) {
                    oPaineis.forEach(painel => {
                        painel.setBusy(true);
                        painel.removeAllItems();
                    });
                }

                setTimeout(async function () {

                    if (oFaturaController) {
                        this.oFaturaController = oFaturaController;
                        this.oBindingContext = oBindingContext;
                    }

                    if(!this.oFaturaController){
                        return;
                    }

                    if (this.oFaturaController.getView().getModel('ui').getData().isEditable == false) {

                        if(!this.oBindingContext?.requestObject){
                            return;
                        }
                        
                        let oFatura = await this.oBindingContext.requestObject(this.oBindingContext.getPath());

                        if (!oFatura.ID) {

                            do {

                                await this.oFaturaController.wait();

                                oFatura = await this.oBindingContext.requestObject(this.oBindingContext.getPath());

                            } while (!oFatura.ID);

                        }

                        let oAdicionaCategorias = function (idFlexBox, oRetorno) {

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
                                            id: `Fatura::${categoria.ID}::${crypto.randomUUID()}`,
                                            headerImage: categoria.Imagem,
                                            header: categoria.Nome,
                                            subheader: `${totalCategoria} ${oRetorno.Moeda}`,
                                            //press: AnaliseCategoriaPessoa.onPress,
                                            frameType: "OneByOne",
                                            tileContent:
                                                new sap.m.TileContent({
                                                    footer: `Gasto: ${porcentagem.toFixed(2)}%`,
                                                    content: new sap.suite.ui.microchart.RadialMicroChart({
                                                        size: "Responsive",
                                                        percentage: porcentagem,
                                                        valueColor: porcentagem > 20 ? "Error" : "Good",
                                                        alignContent: "Center"
                                                    }),
                                                })
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

                        }.bind(this);

                        let oExtensionAPI = this.oFaturaController.base.getExtensionAPI(),
                            oModel = oExtensionAPI.getModel(),
                            oFunctionName = "recuperaCategorias",
                            oFunction = oModel.bindContext(`/${oFunctionName}(...)`);

                        oFunction.setParameter("fatura", oFatura.ID);
                        await oFunction.execute();
                        const oRetorno = oFunction.getBoundContext().getValue();

                        oAdicionaCategorias("categoryFatura", oRetorno);

                    }


                }.bind(this), 2000);

            } catch (erro) {
                console.log("Erro:" + erro);
            }

        }

    };
});
