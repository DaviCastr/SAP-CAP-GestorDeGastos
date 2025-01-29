sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';

    return {

        defineCategoriasFaturaAtual: async function (oCartaoController, oBindingContext) {

            try {

                let oPaineis = sap.ui.core.Element.registry.filter(function (oControl) {
                    return oControl.isA("sap.m.FlexBox") && oControl.getId().includes("categoryCartao");
                });

                if (Array.isArray(oPaineis)) {
                    oPaineis.forEach(painel => {
                        painel.setBusy(true);
                        painel.removeAllItems();
                    });
                }

                setTimeout(async function () {

                    if (oCartaoController) {
                        this.oCartaoController = oCartaoController;
                        this.oBindingContext = oBindingContext;
                    }

                    if(!this.oCartaoController){
                        return;
                    }

                    if (this.oCartaoController.getView().getModel('ui').getData().isEditable == false || null) {

                        if(!this.oBindingContext?.requestObject){
                            return;
                        }

                        let oCartao = await this.oBindingContext.requestObject(this.oBindingContext.getPath());   

                        if (!oCartao.ID) {

                            do {

                                await this.oCartaoController.wait();

                                oCartao = await this.oBindingContext.requestObject(this.oBindingContext.getPath());

                            } while (!oCartao.ID);

                        }

                        sap.ui.getCore().oCartao = oCartao;

                        let oDateAtual = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
                        oDateAtual = oDateAtual.replaceAll(",", " ");
                        let [oDay, oMes, oAno] = oDateAtual.split(" ")[0].split("/");

                        oDay = Number(oDay);
                        oMes = Number(oMes);
                        oAno = Number(oAno);

                        if (oCartao.DiaFechamento > oCartao.DiaVencimento) {

                            if (oMes == 12) {
                                oMes = 1;
                                oAno += 1;
                            } else {
                                oMes += 1;
                            }

                        }

                        if (oCartao.DiaFechamento <= oDay) {

                            if (oMes == 12) {
                                oMes = 1;
                                oAno += 1;
                            } else {
                                oMes += 1;
                            }

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
                                            id: `Cartao::${categoria.ID}::${crypto.randomUUID()}`,
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

                        }.bind(this)

                        const oModel = this.oCartaoController.getView().getModel();

                        let oFunctionName = "recuperaCategorias",
                            oFunction = oModel.bindContext(`/${oFunctionName}(...)`);

                        oFunction.setParameter("cartao", oCartao.ID);
                        oFunction.setParameter("mes", oMes);
                        oFunction.setParameter("ano", oAno);
                        await oFunction.execute();
                        const oRetorno = oFunction.getBoundContext().getValue();

                        oAdicionaCategorias("categoryCartao", oRetorno);

                        if (Array.isArray(oPaineis)) {
                            oPaineis.forEach(painel => {
                                painel.setBusy(false);
                            });
                        }

                    }

                }.bind(this), 3000);

            } catch (erro) {
                console.log("Erro:" + erro);
            }

        }

    };
});
