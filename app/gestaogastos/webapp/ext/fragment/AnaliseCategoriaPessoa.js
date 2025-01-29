sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (MessageToast, Fragment) {
    'use strict';

    return {

        defineGraficoCategoriasTotalGastos: async function (PessoaObjetoController, oBindingContext) {

            let oPaineis = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.FlexBox") && oControl.getId().includes("TotalGastosCharts")
            });

            oPaineis.forEach(painel => { painel.setBusy(true); painel.removeAllItems() })

            setTimeout(async function () {

                try {

                    if (PessoaObjetoController) {
                        this.PessoaObjetoController = PessoaObjetoController;
                        this.oBindingContext = oBindingContext;
                    }

                    if(!this.PessoaObjetoController){
                        return;
                    }

                    if (this.PessoaObjetoController.getView().getModel('ui').getData().isEditable == false) {

                        if(!this.oBindingContext?.requestObject){
                            return;
                        }

                        let oPessoa = await this.oBindingContext.requestObject(this.oBindingContext.getPath());

                        if (!oPessoa.ID) {

                            do {

                                await this.PessoaObjetoController.wait();

                                oPessoa = await this.oBindingContext.requestObject(this.oBindingContext.getPath());

                            } while (!oPessoa.ID);

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
                                            id: `Total::${categoria.ID}::${crypto.randomUUID()}`,
                                            headerImage: categoria.Imagem,
                                            header: categoria.Nome,
                                            subheader: `${totalCategoria} ${oRetorno.Moeda}`,
                                            press: this.onPressTotal,
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


                        let oExtensionAPI = this.PessoaObjetoController.base.getExtensionAPI();
                        let oModel = oExtensionAPI.getModel();

                        let oFunctionName = "recuperaCategoriasParaGastoTotal";
                        let oFunction = oModel.bindContext(`/${oFunctionName}(...)`);
                        oFunction.setParameter("pessoa", oPessoa.ID);
                        await oFunction.execute();
                        const oRetorno = oFunction.getBoundContext().getValue();

                        oAdicionaCategorias("TotalGastosCharts", oRetorno);

                    }

                } catch (erro) {
                    console.log("Erro:" + erro);
                }

            }.bind(this), 2000);
        },

        defineGraficoMensalCategorias: async function (PessoaObjetoController, oBindingContext) {

            try {

                let oPaineis = sap.ui.core.Element.registry.filter(function (oControl) {
                    return oControl.isA("sap.m.FlexBox") && oControl.getId().includes("MensalCharts")
                });

                oPaineis.forEach(painel => { painel.setBusy(true); painel.removeAllItems() })

                setTimeout(async function () {

                    if (PessoaObjetoController) {
                        this.PessoaObjetoController = PessoaObjetoController;
                        this.oBindingContext = oBindingContext;
                    }

                    if(!this.PessoaObjetoController){
                        return;
                    }

                    if (this.PessoaObjetoController.getView().getModel('ui').getData().isEditable == false) {

                        if(!this.oBindingContext?.requestObject){
                            return;
                        }
                        
                        let oPessoa = await this.oBindingContext.requestObject(this.oBindingContext.getPath());

                        if (!oPessoa.ID) {

                            do {

                                await this.PessoaObjetoController.wait();

                                oPessoa = await this.oBindingContext.requestObject(this.oBindingContext.getPath());

                            } while (!oPessoa.ID);

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
                                            id: `Total::${categoria.ID}::${crypto.randomUUID()}`,
                                            headerImage: categoria.Imagem,
                                            header: categoria.Nome,
                                            subheader: `${totalCategoria} ${oRetorno.Moeda}`,
                                            press: this.onPressMensal,
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

                        let oExtensionAPI = this.PessoaObjetoController.base.getExtensionAPI();
                        let oModel = oExtensionAPI.getModel();

                        let oFunctionName = "recuperaCategorias";
                        let oFunction = oModel.bindContext(`/${oFunctionName}(...)`);
                        oFunction.setParameter("pessoa", oPessoa.ID);
                        await oFunction.execute();
                        const oRetorno = oFunction.getBoundContext().getValue();

                        oAdicionaCategorias("MensalCharts", oRetorno);

                    }

                }.bind(this), 2000);

            } catch (erro) {
                console.log("Erro:" + erro);
            }

        },

        onPressMensal: async function (oEvent) {

            try {

                const
                    oView = this.getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent(),
                    oModel = this.getModel(),
                    oContexto = this.getBindingContext(),
                    oPessoa = oContexto.getObject(),
                    oIdCategoria = oEvent.getSource().getId().split('::')[1];

                sap.ui.core.BusyIndicator.show();

                let oAdicionaDetalhamento = function (flix, oRetorno) {

                    const oPaineis = [];
                    oRetorno.Cartoes.forEach((cartao, index) => {

                        let oPainelCartao = new sap.m.Panel({
                            expandable: true,
                            expanded: index == 0 ? true : false,
                            headerText: cartao.NomeCartao,
                            width: "auto",
                        })

                        let oAVatar = new sap.m.Avatar({ src: cartao.Imagem })

                        oPainelCartao.addContent(oAVatar);

                        let oFlixFaturas = new sap.ui.layout.FixFlex();

                        cartao.Faturas.sort((a, b) => {
                            const anoCompare = Number(a.Ano) - Number(b.Ano);
                            if (anoCompare !== 0) {
                                return anoCompare; // Se os anos forem diferentes, retorna a comparação por Ano
                            }
                            return Number(a.Mes) - Number(b.Mes); // Se os anos forem iguais, compara pelos meses
                        });

                        cartao.Faturas.forEach((fatura, index) => {

                            let oPainelFatura = new sap.m.Panel({
                                expandable: true,
                                expanded: index == 0 ? true : false,
                                headerText: `${fatura.Descricao}(${fatura.Mes}) de ${fatura.Ano}`,
                                width: "auto",
                            });

                            oPainelFatura.addContent(new sap.m.Label({ text: `Valor Total: ${fatura.ValorTotal} ${oRetorno.Moeda}` }));

                            let oFlixTransacoes = new sap.ui.layout.FixFlex();

                            fatura.Transacoes.sort((a, b) => new Date(a.Data) - new Date(b.Data));

                            for (const transacao of fatura.Transacoes) {

                                const oData = new Date(`${transacao.Data}T00:00:00`);
                                const oAno = oData.getFullYear();       // Retorna 2025
                                const oMes = String(oData.getMonth() + 1).padStart(2, "0"); // Retorna 01 (mês é zero-based)
                                const oDia = String(oData.getDate()).padStart(2, "0");

                                let oPainelTransacao = new sap.m.Panel({
                                    expandable: true,
                                    expanded: false,
                                    headerText: `${transacao.Descricao}`,
                                    width: "auto",
                                });

                                let oValorTotal = transacao?.ValorTotal || Number(transacao.Valor) * Number(transacao.ParcelasTotais);

                                let oVBox = new sap.m.VBox({
                                    items: [
                                        new sap.m.Label({ text: `Data: ${oDia}/${oMes}/${oAno}` }),
                                        new sap.m.Label({ text: `Total: ${oValorTotal} ${oRetorno.Moeda}` }),
                                        new sap.m.Label({ text: `Valor: ${transacao.Valor} ${oRetorno.Moeda}` }),
                                        new sap.m.Label({ text: `Parcela: ${transacao.Parcela} de ${transacao.ParcelasTotais}` })
                                    ]
                                })

                                oPainelTransacao.addContent(oVBox);

                                oFlixTransacoes.addFixContent(oPainelTransacao);

                            }

                            oPainelFatura.addContent(oFlixTransacoes);

                            oFlixFaturas.addFixContent(oPainelFatura);

                        });

                        oPainelCartao.addContent(oFlixFaturas)

                        oPaineis.push(oPainelCartao);

                    });

                    flix.removeAllFixContent();
                    oPaineis.forEach((oPainel, index) => {
                        flix.addFixContent(oPainel);
                    });


                }

                let oFunctionName = "recuperaTransacoesPorCategoria",
                    oFunction = oModel.bindContext(`/${oFunctionName}(...)`);

                oFunction.setParameter("pessoa", oPessoa.ID);
                oFunction.setParameter("categoria", oIdCategoria);
                await oFunction.execute();
                const oRetorno = oFunction.getBoundContext().getValue();

                if (oRetorno?.Cartoes) {
                    if (!Fragment.byId("DetalhamentoCategoria", "dialogTransacoesPorCategoria")) {
                        this._detalhamentoDialog = Fragment.load({
                            id: "DetalhamentoCategoria",
                            name: "apps.dflc.gestaogastos.ext.fragment.TransacoesDaCategoria",
                            //controller: this
                        }).then(function (dialog) {
                            oView.addDependent(dialog);
                            let oFlix = Fragment.byId("DetalhamentoCategoria", "DetalhamentoCartoesCategoria")
                            oAdicionaDetalhamento(oFlix, oRetorno);
                            dialog.open();
                            return dialog;
                        }.bind(this));
                    } else {
                        let oDialog = Fragment.byId("DetalhamentoCategoria", "dialogTransacoesPorCategoria")
                        let oFlix = Fragment.byId("DetalhamentoCategoria", "DetalhamentoCartoesCategoria")
                        oAdicionaDetalhamento(oFlix, oRetorno);
                        oDialog.open();
                    }

                } else {
                    MessageToast.show("Erro ao buscar informação:" + oRetorno)
                }

                sap.ui.core.BusyIndicator.hide();

            } catch (erro) {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("Erro ao buscar informações:" + erro)
            }

        },

        onPressTotal: async function (oEvent) {

            try {

                const
                    oView = this.getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent(),
                    oModel = this.getModel(),
                    oContexto = this.getBindingContext(),
                    oPessoa = oContexto.getObject(),
                    oIdCategoria = oEvent.getSource().getId().split('::')[1];

                sap.ui.core.BusyIndicator.show();

                let oAdicionaDetalhamento = function (flix, oRetorno) {

                    const oPaineis = [];
                    oRetorno.Cartoes.forEach((cartao, index) => {

                        let oPainelCartao = new sap.m.Panel({
                            expandable: true,
                            expanded: index == 0 ? true : false,
                            headerText: cartao.NomeCartao,
                            width: "auto",
                        })

                        let oAVatar = new sap.m.Avatar({ src: cartao.Imagem })

                        oPainelCartao.addContent(oAVatar);

                        let oFlixFaturas = new sap.ui.layout.FixFlex();

                        cartao.Faturas.sort((a, b) => {
                            const anoCompare = Number(a.Ano) - Number(b.Ano);
                            if (anoCompare !== 0) {
                                return anoCompare; // Se os anos forem diferentes, retorna a comparação por Ano
                            }
                            return Number(a.Mes) - Number(b.Mes); // Se os anos forem iguais, compara pelos meses
                        });

                        cartao.Faturas.forEach((fatura, index) => {

                            let oPainelFatura = new sap.m.Panel({
                                expandable: true,
                                expanded: index == 0 ? true : false,
                                headerText: `${fatura.Descricao}(${fatura.Mes}) de ${fatura.Ano}`,
                                width: "auto",
                            });

                            oPainelFatura.addContent(new sap.m.Label({ text: `Valor Total: ${fatura.ValorTotal} ${oRetorno.Moeda}` }));

                            let oFlixTransacoes = new sap.ui.layout.FixFlex();

                            fatura.Transacoes.sort((a, b) => new Date(a.Data) - new Date(b.Data));

                            for (const transacao of fatura.Transacoes) {

                                const oData = new Date(`${transacao.Data}T00:00:00`);
                                const oAno = oData.getFullYear();       // Retorna 2025
                                const oMes = String(oData.getMonth() + 1).padStart(2, "0"); // Retorna 01 (mês é zero-based)
                                const oDia = String(oData.getDate()).padStart(2, "0");

                                let oPainelTransacao = new sap.m.Panel({
                                    expandable: true,
                                    expanded: false,
                                    headerText: `${transacao.Descricao}`,
                                    width: "auto",
                                })

                                let oValorTotal = transacao?.ValorTotal || Number(transacao.Valor) * Number(transacao.ParcelasTotais);

                                let oVBox = new sap.m.VBox({
                                    items: [
                                        new sap.m.Label({ text: `Data: ${oDia}/${oMes}/${oAno}` }),
                                        new sap.m.Label({ text: `Total: ${oValorTotal} ${oRetorno.Moeda}` }),
                                        new sap.m.Label({ text: `Valor: ${transacao.Valor} ${oRetorno.Moeda}` }),
                                        new sap.m.Label({ text: `Parcela: ${transacao.Parcela} de ${transacao.ParcelasTotais}` })
                                    ]
                                })

                                oPainelTransacao.addContent(oVBox);

                                oFlixTransacoes.addFixContent(oPainelTransacao);

                            }

                            oPainelFatura.addContent(oFlixTransacoes);

                            oFlixFaturas.addFixContent(oPainelFatura);

                        });

                        oPainelCartao.addContent(oFlixFaturas)

                        oPaineis.push(oPainelCartao);

                    });

                    flix.removeAllFixContent();
                    oPaineis.forEach((oPainel, index) => {
                        flix.addFixContent(oPainel);
                    });

                }

                let oFunctionName = "recuperaTransacoesPorCategoria",
                    oFunction = oModel.bindContext(`/${oFunctionName}(...)`);

                oFunction.setParameter("pessoa", oPessoa.ID);
                oFunction.setParameter("categoria", oIdCategoria);
                oFunction.setParameter("total", true);
                await oFunction.execute();
                const oRetorno = oFunction.getBoundContext().getValue();

                if (oRetorno?.Cartoes) {
                    if (!Fragment.byId("DetalhamentoCategoria", "dialogTransacoesPorCategoria")) {
                        this._detalhamentoDialog = Fragment.load({
                            id: "DetalhamentoCategoria",
                            name: "apps.dflc.gestaogastos.ext.fragment.TransacoesDaCategoria",
                            //controller: this
                        }).then(function (dialog) {
                            oView.addDependent(dialog);
                            let oFlix = Fragment.byId("DetalhamentoCategoria", "DetalhamentoCartoesCategoria")
                            oAdicionaDetalhamento(oFlix, oRetorno);
                            dialog.open();
                            return dialog;
                        }.bind(this));
                    } else {
                        let oDialog = Fragment.byId("DetalhamentoCategoria", "dialogTransacoesPorCategoria")
                        let oFlix = Fragment.byId("DetalhamentoCategoria", "DetalhamentoCartoesCategoria")
                        oAdicionaDetalhamento(oFlix, oRetorno);
                        oDialog.open();
                    }

                } else {
                    MessageToast.show("Erro ao buscar informação:" + oRetorno)
                }

                sap.ui.core.BusyIndicator.hide();

            } catch (erro) {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("Erro ao buscar informações:" + erro)
            }

        },

        onPressPrevisao: async function (oEvent, oAno, oMes) {

            try {

                const
                    oView = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent(),
                    oModel = oEvent.getSource().getModel(),
                    oContexto = oEvent.getSource().getBindingContext(),
                    oPessoa = oContexto.getObject(),
                    oIdCategoria = oEvent.getSource().getId().split('::')[1];

                sap.ui.core.BusyIndicator.show();

                let oAdicionaDetalhamento = function (flix, oRetorno) {

                    const oPaineis = [];
                    oRetorno.Cartoes.forEach((cartao, index) => {

                        let oPainelCartao = new sap.m.Panel({
                            expandable: true,
                            expanded: index == 0 ? true : false,
                            headerText: cartao.NomeCartao,
                            width: "auto",
                        })

                        let oAVatar = new sap.m.Avatar({ src: cartao.Imagem })

                        oPainelCartao.addContent(oAVatar);

                        let oFlixFaturas = new sap.ui.layout.FixFlex();

                        cartao.Faturas.sort((a, b) => {
                            const anoCompare = Number(a.Ano) - Number(b.Ano);
                            if (anoCompare !== 0) {
                                return anoCompare; // Se os anos forem diferentes, retorna a comparação por Ano
                            }
                            return Number(a.Mes) - Number(b.Mes); // Se os anos forem iguais, compara pelos meses
                        });

                        cartao.Faturas.forEach((fatura, index) => {

                            let oPainelFatura = new sap.m.Panel({
                                expandable: true,
                                expanded: index == 0 ? true : false,
                                headerText: `${fatura.Descricao}(${fatura.Mes}) de ${fatura.Ano}`,
                                width: "auto",
                            });

                            oPainelFatura.addContent(new sap.m.Label({ text: `Valor Total: ${fatura.ValorTotal} ${oRetorno.Moeda}` }));

                            let oFlixTransacoes = new sap.ui.layout.FixFlex();

                            fatura.Transacoes.sort((a, b) => new Date(a.Data) - new Date(b.Data));

                            for (const transacao of fatura.Transacoes) {

                                const oData = new Date(`${transacao.Data}T00:00:00`);
                                const oAno = oData.getFullYear();       // Retorna 2025
                                const oMes = String(oData.getMonth() + 1).padStart(2, "0"); // Retorna 01 (mês é zero-based)
                                const oDia = String(oData.getDate()).padStart(2, "0");

                                let oPainelTransacao = new sap.m.Panel({
                                    expandable: true,
                                    expanded: false,
                                    headerText: `${transacao.Descricao}`,
                                    width: "auto",
                                })

                                let oValorTotal = transacao?.ValorTotal || Number(transacao.Valor) * Number(transacao.ParcelasTotais);

                                let oVBox = new sap.m.VBox({
                                    items: [
                                        new sap.m.Label({ text: `Data: ${oDia}/${oMes}/${oAno}` }),
                                        new sap.m.Label({ text: `Total: ${oValorTotal} ${oRetorno.Moeda}` }),
                                        new sap.m.Label({ text: `Valor: ${transacao.Valor} ${oRetorno.Moeda}` }),
                                        new sap.m.Label({ text: `Parcela: ${transacao.Parcela} de ${transacao.ParcelasTotais}` })
                                    ]
                                })

                                oPainelTransacao.addContent(oVBox);

                                oFlixTransacoes.addFixContent(oPainelTransacao);

                            }

                            oPainelFatura.addContent(oFlixTransacoes);

                            oFlixFaturas.addFixContent(oPainelFatura);

                        });

                        oPainelCartao.addContent(oFlixFaturas)

                        oPaineis.push(oPainelCartao);

                    });

                    flix.removeAllFixContent();
                    oPaineis.forEach((oPainel, index) => {
                        flix.addFixContent(oPainel);
                    });

                }

                let oFunctionName = "recuperaTransacoesPorCategoria",
                    oFunction = oModel.bindContext(`/${oFunctionName}(...)`);

                oFunction.setParameter("pessoa", oPessoa.ID);
                oFunction.setParameter("categoria", oIdCategoria);
                oFunction.setParameter("ano", oAno);
                oFunction.setParameter("mes", oMes);
                await oFunction.execute();
                const oRetorno = oFunction.getBoundContext().getValue();

                if (oRetorno?.Cartoes) {
                    if (!Fragment.byId("DetalhamentoCategoria", "dialogTransacoesPorCategoria")) {
                        this._detalhamentoDialog = Fragment.load({
                            id: "DetalhamentoCategoria",
                            name: "apps.dflc.gestaogastos.ext.fragment.TransacoesDaCategoria",
                            //controller: this
                        }).then(function (dialog) {
                            oView.addDependent(dialog);
                            let oFlix = Fragment.byId("DetalhamentoCategoria", "DetalhamentoCartoesCategoria")
                            oAdicionaDetalhamento(oFlix, oRetorno);
                            dialog.open();
                            return dialog;
                        }.bind(this));
                    } else {
                        let oDialog = Fragment.byId("DetalhamentoCategoria", "dialogTransacoesPorCategoria")
                        let oFlix = Fragment.byId("DetalhamentoCategoria", "DetalhamentoCartoesCategoria")
                        oAdicionaDetalhamento(oFlix, oRetorno);
                        oDialog.open();
                    }

                } else {
                    MessageToast.show("Erro ao buscar informação:" + oRetorno)
                }

                sap.ui.core.BusyIndicator.hide();

            } catch (erro) {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("Erro ao buscar informações:" + erro)
            }

        },

        onPressPrevisaoTotal: async function (oEvent, oAno, oMes) {

            try {

                const
                    oView = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent(),
                    oModel = oEvent.getSource().getModel(),
                    oContexto = oEvent.getSource().getBindingContext(),
                    oPessoa = oContexto.getObject(),
                    oIdCategoria = oEvent.getSource().getId().split('::')[1];

                sap.ui.core.BusyIndicator.show();

                let oAdicionaDetalhamento = function (flix, oRetorno) {

                    const oPaineis = [];
                    oRetorno.Cartoes.forEach((cartao, index) => {

                        let oPainelCartao = new sap.m.Panel({
                            expandable: true,
                            expanded: index == 0 ? true : false,
                            headerText: cartao.NomeCartao,
                            width: "auto",
                        })

                        let oAVatar = new sap.m.Avatar({ src: cartao.Imagem })

                        oPainelCartao.addContent(oAVatar);

                        let oFlixFaturas = new sap.ui.layout.FixFlex();

                        cartao.Faturas.sort((a, b) => {
                            const anoCompare = Number(a.Ano) - Number(b.Ano);
                            if (anoCompare !== 0) {
                                return anoCompare; // Se os anos forem diferentes, retorna a comparação por Ano
                            }
                            return Number(a.Mes) - Number(b.Mes); // Se os anos forem iguais, compara pelos meses
                        });

                        cartao.Faturas.forEach((fatura, index) => {

                            let oPainelFatura = new sap.m.Panel({
                                expandable: true,
                                expanded: index == 0 ? true : false,
                                headerText: `${fatura.Descricao}(${fatura.Mes}) de ${fatura.Ano}`,
                                width: "auto",
                            });

                            oPainelFatura.addContent(new sap.m.Label({ text: `Valor Total: ${fatura.ValorTotal} ${oRetorno.Moeda}` }));

                            let oFlixTransacoes = new sap.ui.layout.FixFlex();

                            fatura.Transacoes.sort((a, b) => new Date(a.Data) - new Date(b.Data));

                            for (const transacao of fatura.Transacoes) {

                                const oData = new Date(`${transacao.Data}T00:00:00`);
                                const oAno = oData.getFullYear();       // Retorna 2025
                                const oMes = String(oData.getMonth() + 1).padStart(2, "0"); // Retorna 01 (mês é zero-based)
                                const oDia = String(oData.getDate()).padStart(2, "0");

                                let oPainelTransacao = new sap.m.Panel({
                                    expandable: true,
                                    expanded: false,
                                    headerText: `${transacao.Descricao}`,
                                    width: "auto",
                                })

                                let oValorTotal = transacao?.ValorTotal || Number(transacao.Valor) * Number(transacao.ParcelasTotais);

                                let oVBox = new sap.m.VBox({
                                    items: [
                                        new sap.m.Label({ text: `Data: ${oDia}/${oMes}/${oAno}` }),
                                        new sap.m.Label({ text: `Total: ${oValorTotal} ${oRetorno.Moeda}` }),
                                        new sap.m.Label({ text: `Valor: ${transacao.Valor} ${oRetorno.Moeda}` }),
                                        new sap.m.Label({ text: `Parcela: ${transacao.Parcela} de ${transacao.ParcelasTotais}` })
                                    ]
                                })

                                oPainelTransacao.addContent(oVBox);

                                oFlixTransacoes.addFixContent(oPainelTransacao);

                            }

                            oPainelFatura.addContent(oFlixTransacoes);

                            oFlixFaturas.addFixContent(oPainelFatura);

                        });

                        oPainelCartao.addContent(oFlixFaturas)

                        oPaineis.push(oPainelCartao);

                    });

                    flix.removeAllFixContent();
                    oPaineis.forEach((oPainel, index) => {
                        flix.addFixContent(oPainel);
                    });

                }

                let oFunctionName = "recuperaTransacoesPorCategoria",
                    oFunction = oModel.bindContext(`/${oFunctionName}(...)`);

                oFunction.setParameter("pessoa", oPessoa.ID);
                oFunction.setParameter("categoria", oIdCategoria);
                oFunction.setParameter("total", true);
                oFunction.setParameter("ano", oAno);
                oFunction.setParameter("mes", oMes);
                await oFunction.execute();
                const oRetorno = oFunction.getBoundContext().getValue();

                if (oRetorno?.Cartoes) {
                    if (!Fragment.byId("DetalhamentoCategoria", "dialogTransacoesPorCategoria")) {
                        this._detalhamentoDialog = Fragment.load({
                            id: "DetalhamentoCategoria",
                            name: "apps.dflc.gestaogastos.ext.fragment.TransacoesDaCategoria",
                            //controller: this
                        }).then(function (dialog) {
                            oView.addDependent(dialog);
                            let oFlix = Fragment.byId("DetalhamentoCategoria", "DetalhamentoCartoesCategoria")
                            oAdicionaDetalhamento(oFlix, oRetorno);
                            dialog.open();
                            return dialog;
                        }.bind(this));
                    } else {
                        let oDialog = Fragment.byId("DetalhamentoCategoria", "dialogTransacoesPorCategoria")
                        let oFlix = Fragment.byId("DetalhamentoCategoria", "DetalhamentoCartoesCategoria")
                        oAdicionaDetalhamento(oFlix, oRetorno);
                        oDialog.open();
                    }

                } else {
                    MessageToast.show("Erro ao buscar informação:" + oRetorno)
                }

                sap.ui.core.BusyIndicator.hide();

            } catch (erro) {
                sap.ui.core.BusyIndicator.hide();
                MessageToast.show("Erro ao buscar informações:" + erro)
            }

        }

    };
});
