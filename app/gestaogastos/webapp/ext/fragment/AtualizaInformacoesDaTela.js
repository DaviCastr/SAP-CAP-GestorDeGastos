sap.ui.define([
    "apps/dflc/gestaogastos/ext/fragment/AnaliseCategoriaPessoa",
    "apps/dflc/gestaogastos/ext/fragment/AnaliseCategoriaCartao",
    "apps/dflc/gestaogastos/ext/fragment/AnaliseCategoriaFatura",
], function (AnaliseCategoriaPessoa, AnaliseCategoriaCartao, AnaliseCategoriaFatura) {
    'use strict';

    return {

        AtualizaInformacoes: async function (oView) {

            try {

                try {

                    //Dados da tela que chamou
                    let oModel = oView?.getModel() || null;

                    if (oModel) {
                        oModel.refresh();
                    }

                } catch (erro) { }

                //Tabelas da tela

                setTimeout(() => {

                    let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                        return oControl.isA("sap.m.Table") && oControl.getId().includes("innerTable");
                    });

                    if (oTabelas.length > 0) {

                        try {

                            oTabelas.forEach(oTabela => {
                                oTabela?.refreshItems();
                            });

                        } catch (error) {
                            console.log(error)
                        }
                    }

                }, 1000);


                let oVBoxsFaturaAtual = sap.ui.core.Element.registry.filter(function (oControl) {
                    return oControl.isA("sap.m.VBox") && oControl.getId().includes("FaturaAtualVBox");
                });

                if (oVBoxsFaturaAtual.length > 0) {

                    try {
                        let oVBoxFaturaAtual = oVBoxsFaturaAtual[0];

                        let oModel = oVBoxFaturaAtual?.getModel() || null;
                        
                        if (oModel) {
                            oModel.refresh();
                        }

                    } catch (error) {
                        console.log(error)
                    }

                }

                try {

                    setTimeout(() => {

                        AnaliseCategoriaPessoa.defineGraficoCategoriasTotalGastos();
                        AnaliseCategoriaPessoa.defineGraficoMensalCategorias();
                        AnaliseCategoriaCartao.defineCategoriasFaturaAtual();
                        AnaliseCategoriaFatura.defineGraficoCategorias();

                    }, 1000);

                    let oPainelSemFatura = sap.ui.core.Element.registry.filter(function (oControl) {
                        return oControl.isA("sap.m.Panel") && oControl.getId().includes("PainelSemFatura");
                    });

                    if (oPainelSemFatura.length > 0) {
                        if (oPainelSemFatura[0].getVisible()) {
                            if (AnaliseCategoriaCartao.oCartaoController) {
                                setTimeout(() => {

                                    AnaliseCategoriaCartao?.oCartaoController.defineModeloFaturaAtual();

                                }, 1500);
                            }
                        }
                    }

                } catch (erro) {
                    console.log(erro);
                }


            } catch (erro) {
                console.log("Erro:" + erro);
            }

        }

    };
});
