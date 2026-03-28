sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (MessageToast, Fragment, JSONModel, Filter, FilterOperator) {
    'use strict';

    var oThat = this;

    return {
        onPress: function (oEvent) {
            MessageToast.show("Custom handler invoked.");
        },

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

        defineModeloFaturaAtual: async function (oCartaoController, oBindingContext) {

            // //Pesquisa formulário da fatura
            // let oFormularios = sap.ui.core.Element.registry.filter(function (oControl) {
            // 	return oControl.isA("sap.ui.layout.form.SimpleForm") && oControl.getId().includes("idFaturaForm");
            // });

            // // let oFormularioFatura = oFormularios[0];

            // // if (oFormularioFatura) {
            // // 	oFormularioFatura.unbindElement();
            // // }

            // //Pesquisa tabelas da tela para manipulação
            // let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
            // 	return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsTable");
            // });

            // let oTabelaTransacoes = oTabelas[0];

            // if (oTabelaTransacoes) {
            // 	oTabelaTransacoes.unbindItems();
            // }

            if (oCartaoController) {
                this.oCartaoController = oCartaoController;
                this.oBindingContext = oBindingContext;
            }

            if (!this.oCartaoController) {
                return;
            }

            //Pesquisa formulário da fatura
            let oPainelSemFatura = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.Panel") && oControl.getId().includes("PainelSemFaturaCartao");
            });

            //Paineis de fatura atual
            let oPaineis = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.Panel") && oControl.getId().includes("PainelFaturaCartao")
                    || oControl.isA("sap.m.Panel") && oControl.getId().includes("PainelTransacoesCartao");
            });

            let oVBoxs = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.VBox") && oControl.getId().includes("FaturaAtualVBoxCartao");
            });

            if (Array.isArray(oPainelSemFatura)) {

                oPainelSemFatura.forEach(painelSem => {
                    painelSem.setVisible(false);
                });

            }

            if (Array.isArray(oPaineis)) {
                oPaineis.forEach(painel => {
                    painel.setVisible(false);
                });
            }

            let oVBoxFaturaAtual = oVBoxs[0];

            oVBoxFaturaAtual.setBusy(true)

            let oTime = 5000;

            if (!oBindingContext) {
                oTime = 0;
            }

            setTimeout(async function () {

                if (this.oCartaoController.getView().getModel('ui').getData().isEditable == false) {

                    let oCartao = {};

                    if (oBindingContext) {

                        oCartao = await oBindingContext.requestObject(oBindingContext.getPath());
                        //let oCartao = await this.getView().getBindingContext().requestObject(oBindingContext.getPath());
                        sap.ui.getCore().oCartao = oCartao;

                    } else if (sap.ui.getCore().oCartao) {

                        oCartao = sap.ui.getCore().oCartao;

                    }

                    if (!oCartao.ID) {

                        do {

                            await this.wait();

                            oCartao = await this.oBindingContext.requestObject(oBindingContext.getPath());

                        } while (!oCartao.ID);

                    }

                    const oView = this.oCartaoController.getView();
                    const oFunctionName = "Fatura"; // Nome da função para consulta
                    const oCartaoId = oCartao.ID;  // ID do cartão
                    let oDateAtual = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
                    oDateAtual = oDateAtual.replaceAll(",", " ");
                    let [oDay, oMes, oAno] = oDateAtual.split(" ")[0].split("/");

                    oDay = Number(oDay);
                    oMes = Number(oMes);
                    oAno = Number(oAno);

                    if (oBindingContext) {

                        this.oMes = oMes;
                        this.oAno = oAno;
                        oThat = this;

                        if (oCartao.DiaFechamento > oCartao.DiaVencimento) {

                            if (this.oMes == 12) {
                                this.oMes = 1;
                                this.oAno += 1;
                            } else {
                                this.oMes += 1;
                            }

                        }

                        if (oCartao.DiaFechamento <= oDay) {

                            if (this.oMes < 12) {
                                this.oMes += 1;
                            } else {
                                this.oMes = 1
                                this.oAno += 1
                            }

                        }

                    }

                    const oModel = oView.getModel();

                    // Configurando os filtros
                    let oFiltros = [
                        new sap.ui.model.Filter("Cartao_ID", sap.ui.model.FilterOperator.EQ, oCartaoId),
                        new sap.ui.model.Filter("Ano", sap.ui.model.FilterOperator.EQ, this.oAno),
                        new sap.ui.model.Filter("Mes", sap.ui.model.FilterOperator.EQ, this.oMes),
                    ];

                    // Fazendo a consulta
                    oModel.bindList(`/${oFunctionName}`, null, null, oFiltros).requestContexts().then(async function (oContextos) {
                        if (oContextos.length > 0) {
                            // Obtendo o primeiro resultado
                            const oContext = oContextos[0];

                            //oFormularioFatura.bindElement(oContext.getPath());
                            oVBoxFaturaAtual.bindElement(oContext.getPath())
                            oVBoxFaturaAtual.setModel(oContext.oModel);

                            //Pesquisa tabelas da tela para manipulação
                            let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                                return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsTableCartao");
                            });

                            if (oTabelas.length > 0) {

                                var oBinding = oTabelas[0].getBinding("items");

                                if (oBinding) {
                                    // Configura o sorter para o campo "Data" (ordem crescente)
                                    var oSorter = new sap.ui.model.Sorter("Data", false);
                                    oBinding.sort(oSorter);
                                }

                            }

                            if (Array.isArray(oPaineis)) {
                                oPaineis.forEach(painel => {
                                    painel.setVisible(true);
                                });
                            }

                            // if (!oTabelaTransacoes.getBindingInfo("items")?.template) {
                            // 	oTabelaTransacoes.addColumn(new sap.m.Column({
                            // 		header: new sap.m.Label({ text: "Data" }) // Nome da coluna
                            // 	}));
                            // 	oTabelaTransacoes.addColumn(new sap.m.Column({
                            // 		header: new sap.m.Label({ text: "Valor" }) // Nome da coluna
                            // 	}));
                            // 	oTabelaTransacoes.addColumn(new sap.m.Column({
                            // 		header: new sap.m.Label({ text: "Parcelas" }) // Nome da coluna
                            // 	}));
                            // 	oTabelaTransacoes.addColumn(new sap.m.Column({
                            // 		header: new sap.m.Label({ text: "Descrição" }) // Nome da coluna
                            // 	}));

                            // 	// Defina o template para as linhas da tabela
                            // 	var oTemplate = new sap.m.ColumnListItem({
                            // 		cells: [
                            // 			new sap.m.Text({ text: "{Data}" }), // Mapeia o campo Data
                            // 			new sap.m.ObjectNumber({ number: "{Valor}", unit: "{Moeda_code}" }), // Mapeia Valor e Moeda
                            // 			new sap.m.Text({ text: "{Parcela} de {ParcelasTotais}" }),
                            // 			new sap.m.Text({ text: "{Descricao}" }),
                            // 			new sap.m.Text({ text: "{Identificador}" }),
                            // 		]
                            // 	});

                            // } else {
                            // 	var oTemplate = oTabelaTransacoes.getBindingInfo("items").template;
                            // }

                            // // Agora faça o binding usando esse template
                            // oTabelaTransacoes.bindItems({
                            // 	path: `${oContext.getPath()}/Transacoes`,
                            // 	template: oTemplate
                            // });
                            oVBoxFaturaAtual.setBusy(false);

                        } else {

                            if (Array.isArray(oPainelSemFatura)) {

                                oPainelSemFatura.forEach(painelSem => {
                                    painelSem.setVisible(true);
                                });

                            }

                            oVBoxFaturaAtual.setBusy(false);

                            console.warn("Nenhuma fatura encontrada.");
                        }

                    }.bind(this)).catch((error) => {
                        console.error("Erro ao buscar a fatura:", error);
                    });

                }

            }.bind(this), oTime);

        },

        excluirTransacao: async function (oEvent) {

            //Pesquisa formulário da fatura
            let oFormularios = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.ui.layout.form.SimpleForm") && oControl.getId().includes("idFaturaFormCartao");
            });

            let oFormularioFatura = oFormularios[0];

            //Pesquisa tabelas da tela para manipulação
            let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsTableCartao");
            });

            let oTabelaTransacoes = oTabelas[0];

            // Obtém os itens selecionados
            const oSelectedItems = oTabelaTransacoes.getSelectedItems();

            if (oSelectedItems.length === 0) {
                // Mostra uma mensagem caso nenhuma linha esteja selecionada
                sap.m.MessageToast.show("Selecione uma transação para excluir.");
                return;
            }

            let oFaturaAtual = oFormularioFatura.getBindingContext().getValue();//oSelectedItems[0].getModel("FaturaAtual").getData();
            //let oPath = oSelectedItems[0].getBindingContextPath().split('/');

            let oTransacao = oSelectedItems[0].getBindingContext().getValue(); //oFaturaAtual.Transacoes[`${oPath[2]}`];

            const oView = this._view;
            const oModel = this._view.getModel();

            sap.ui.getCore().oFatura = oFaturaAtual;

            if (oTransacao.ID) {
                // oTransacao.ParcelasTotais > 1) {

                var securedExecution = function () {

                    return new Promise(function (resolve, reject) {

                        try {

                            fetch(`${oModel.getServiceUrl()}Transacao?$filter=Identificador eq ${oTransacao.Identificador} and ID ne ${oTransacao.ID}`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Accept": "application/json",
                                }
                            }).then(async function (data) {

                                console.log(data)

                                let oData = await data.json();

                                let oRelacionadas = Array.isArray(oData.value) ? oData.value : [oData.value];

                                oRelacionadas = oRelacionadas.sort(function (a, b) {
                                    return b.Parcela - a.Parcela;
                                });

                                let oModelJson = {
                                    Dados: oTransacao,
                                    Fixo: oTransacao.ParcelasTotais == 1 && oRelacionadas.length > 0 ? true : false,
                                    Relacionadas: oRelacionadas
                                }

                                const oTransacoesRelacionadas = new JSONModel(oModelJson);

                                //oView.setModel(oTransacoesRelacionadas, "Transacao");

                                // Carregar o fragmento do diálogo
                                if (!sap.ui.getCore().pDialogExcluir) {
                                    sap.ui.getCore().pDialogExcluir = Fragment.load({
                                        id: "ExcluirTransacaoFragment",
                                        name: "apps.dflc.gestaogastos.ext.fragment.ExcluirTransacao",
                                        //controller: this
                                    }).then(function (oDialog) {
                                        oView.addDependent(oDialog);
                                        return oDialog;
                                    });
                                }

                                sap.ui.getCore().pDialogExcluir.then(function (oDialog) {
                                    oDialog.open();
                                    oDialog.setModel(oTransacoesRelacionadas, "Transacao");
                                }.bind(this));

                                resolve();

                            }.bind(this)).catch(function (error) {
                                sap.m.MessageToast.show("Erro ao chamar serviço de Transações: " + error);
                                reject();

                            });


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

            }
            // else {

            //     let oModelJson = {
            //         Dados: oTransacao,
            //         Relacionadas: []
            //     }

            //     const oTransacoesRelacionadas = new JSONModel(oModelJson);

            //     //oView.setModel(oTransacoesRelacionadas, "Transacao");

            //     // Carregar o fragmento do diálogo
            //     if (!sap.ui.getCore().pDialogExcluir) {
            //         sap.ui.getCore().pDialogExcluir = Fragment.load({
            //             id: "ExcluirTransacaoFragment",
            //             name: "apps.dflc.gestaogastos.ext.fragment.ExcluirTransacao",
            //             //controller: this
            //         }).then(function (oDialog) {
            //             oView.addDependent(oDialog);
            //             return oDialog;
            //         });
            //     }

            //     sap.ui.getCore().pDialogExcluir.then(function (oDialog) {
            //         oDialog.open();
            //         oDialog.setModel(oTransacoesRelacionadas, "Transacao");
            //     }.bind(this));

            // }

        },

        mudarCategoria: async function (oEvent) {

            try {

                //Pesquisa formulário da fatura
                let oFormularios = sap.ui.core.Element.registry.filter(function (oControl) {
                    return oControl.isA("sap.ui.layout.form.SimpleForm") && oControl.getId().includes("idFaturaFormCartao");
                });

                let oFormularioFatura = oFormularios[0];

                //Pesquisa tabelas da tela para manipulação
                let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                    return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsTableCartao");
                });

                let oTabelaTransacoes = oTabelas[0];

                // Obtém os itens selecionados
                const oSelectedItems = oTabelaTransacoes.getSelectedItems();

                if (oSelectedItems.length === 0) {
                    // Mostra uma mensagem caso nenhuma linha esteja selecionada
                    sap.m.MessageToast.show("Selecione uma transação para mudar.");
                    return;
                }

                sap.ui.core.BusyIndicator.show();

                let oFaturaAtual = oFormularioFatura.getBindingContext().getValue();

                sap.ui.getCore().oFatura = oFaturaAtual;

                let oTransacao = oSelectedItems[0].getBindingContext().getValue(); //oFaturaAtual.Transacoes[`${oPath[2]}`];

                const oView = this._view,
                    oModel = oView.getModel();


                if (!oFaturaAtual.Cartao_ID) {

                    let oFiltros = [
                        new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, oFaturaAtual.ID)
                    ];

                    let oFatura = await oModel.bindList(`/Fatura`, null, null, oFiltros).requestContexts();

                    if (oFatura.length > 0) {

                        oFaturaAtual = oFatura[0].getObject();

                    }

                }

                if (!oTransacao.Categoria_ID) {

                    let oFiltros = [
                        new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, oTransacao.ID)
                    ];

                    let oTransacaoConsulta = await oModel.bindList(`/Transacao`, null, null, oFiltros).requestContexts();

                    if (oTransacaoConsulta.length > 0) {

                        oTransacao = oTransacaoConsulta[0].getObject();

                    }

                }

                if (oTransacao.Categoria_ID) {

                    let oFiltros = [
                        new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, oTransacao.Categoria_ID),
                    ];

                    let oNomeFuncao = `/Categoria`;
                    oModel.bindList(`${oNomeFuncao}`, null, null, oFiltros).requestContexts().then(async function (oContextos) {
                        if (oContextos.length > 0) {
                            for (let oCategoria of oContextos) {

                                oCategoria = oCategoria.getValue();

                                let oFiltros = [
                                    new sap.ui.model.Filter("Pessoa_ID", sap.ui.model.FilterOperator.EQ, oCategoria.Pessoa_ID),
                                ];

                                let oNomeFuncao = `/Categoria`;
                                let oCategorias = await oModel.bindList(`${oNomeFuncao}`, null, null, oFiltros).requestContexts();

                                oTransacao.Categoria = oCategoria;

                                let oModelJson = {
                                    Dados: oTransacao,
                                    Categorias: oCategorias.map(categoria => { return categoria.getObject() })
                                }

                                const oTransacaoModelo = new JSONModel(oModelJson);

                                //oView.setModel(oTransacaoModelo, "TransacaoMudar");

                                // Carregar o fragmento do diálogo
                                if (!sap.ui.getCore().pMudar) {
                                    sap.ui.getCore().pMudar = Fragment.load({
                                        id: "MudarCategoria",
                                        name: "apps.dflc.gestaogastos.ext.fragment.MudarCategoria",
                                        //controller: this
                                    }).then(function (oDialog) {
                                        oView.addDependent(oDialog);
                                        return oDialog;
                                    });
                                }

                                sap.ui.getCore().pMudar.then(function (oDialog) {
                                    oDialog.open();
                                    oDialog.setModel(oTransacaoModelo, "TransacaoMudar");
                                    sap.ui.core.BusyIndicator.hide();
                                }.bind(this));

                            }
                        }
                    }.bind(this));

                } else {

                    let oCartao = {};

                    if (sap.ui.getCore().oCartao?.Pessoa_ID) {
                        oCartao = sap.ui.getCore().oCartao;
                    } else {

                        let oFiltros = [
                            new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, oFaturaAtual.Cartao_ID)
                        ];

                        let oCartoesContextos = await oModel.bindList(`/Cartao`, null, null, oFiltros).requestContexts();

                        if (oCartoesContextos.length > 0) {

                            oCartao = oCartoesContextos[0].getObject();

                        }

                    }

                    if (oCartao.Pessoa_ID) {

                        let oCategoria = { ID: "sem", Nome: "Sem categoria" }

                        let oFiltros = [
                            new sap.ui.model.Filter("Pessoa_ID", sap.ui.model.FilterOperator.EQ, oCartao.Pessoa_ID),
                        ];

                        let oNomeFuncao = `/Categoria`;
                        let oCategorias = await oModel.bindList(`${oNomeFuncao}`, null, null, oFiltros).requestContexts();

                        if (oCategorias.length == 0) {

                            MessageToast.show("Não há categorias cadastradas.");
                            sap.ui.core.BusyIndicator.hide();
                            return;
                        }

                        oTransacao.Categoria = oCategoria;

                        let oModelJson = {
                            Dados: oTransacao,
                            Categorias: oCategorias.map(categoria => { return categoria.getObject() })
                        }

                        const oTransacaoModelo = new JSONModel(oModelJson);

                        //oView.setModel(oTransacaoModelo, "TransacaoMudar");

                        // Carregar o fragmento do diálogo
                        if (!sap.ui.getCore().pMudar) {
                            sap.ui.getCore().pMudar = Fragment.load({
                                id: "MudarCategoria",
                                name: "apps.dflc.gestaogastos.ext.fragment.MudarCategoria",
                                //controller: this
                            }).then(function (oDialog) {
                                oView.addDependent(oDialog);
                                return oDialog;
                            });
                        }

                        sap.ui.getCore().pMudar.then(function (oDialog) {
                            oDialog.open();
                            oDialog.setModel(oTransacaoModelo, "TransacaoMudar");
                            sap.ui.core.BusyIndicator.hide();
                        }.bind(this));

                    } else {
                        MessageToast.show("Erro ao buscar categoria");
                        sap.ui.core.BusyIndicator.hide();
                    }

                }

            } catch (erro) {
                MessageToast.show("Erro ao buscar categoria: " + erro);
                sap.ui.core.BusyIndicator.hide();
            }

        },

        pesquisarTransacao: function (oEvent) {
            var oPesquisaTabela = [],
                oPesquisa = oEvent.getParameter("query");

            if (oPesquisa && oPesquisa.length > 0) {
                oPesquisaTabela = [new Filter({ filters: [new Filter("Descricao", FilterOperator.Contains, oPesquisa)] })];
            }

            //Pesquisa tabelas da tela para manipulação
            let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsTableCartao");
            });

            let oTabelaTransacoes = oTabelas[0];

            if (oTabelaTransacoes) {
                oTabelaTransacoes.getBinding("items").filter(oPesquisaTabela, "Application");
            }

        },

        retrocederFatura: function (e) {

            if (oThat.oMes == 1) {
                oThat.oMes = 12;
                oThat.oAno -= 1;
            } else {
                oThat.oMes -= 1;
            }

            oThat.defineModeloFaturaAtual();

        },

        avancarFatura: function (e) {

            if (oThat.oMes == 12) {
                oThat.oMes = 1;
                oThat.oAno += 1;
            } else {
                oThat.oMes += 1;
            }

            oThat.defineModeloFaturaAtual();

        }

    };
});
