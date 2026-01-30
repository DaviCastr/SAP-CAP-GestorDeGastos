sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
], function (MessageToast, JSONModel, Filter, FilterOperator, Fragment) {
    'use strict';

    var oThat;

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

            },

            getImagemCategoria: function (sCampoId) {
                if (!sCampoId) {
                    return "";
                }

                return `Categoria(ID=${sCampoId},IsActiveEntity=true)/Imagem`;
            }
        },

        defineFaturaCompleta: async function (oPessoaController, oBindingContext) {

            if (oPessoaController) {
                this.oPessoaController = oPessoaController;
                this.oBindingContext = oBindingContext;
            }

            if (!this.oPessoaController) {
                return;
            }

            //Pesquisa formulário da fatura
            let oPainelSemFatura = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.Panel") && oControl.getId().includes("PainelSemFaturaPessoa");
            });

            //Paineis de fatura atual
            let oPaineis = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.Panel") && oControl.getId().includes("PainelFaturaPessoa")
                    || oControl.isA("sap.m.Panel") && oControl.getId().includes("PainelTransacoesPessoa");
            });

            let oVBoxs = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.VBox") && oControl.getId().includes("FaturaCompletaVBoxPessoa");
            });

            if (Array.isArray(oPainelSemFatura)) {

                oPainelSemFatura[0].setVisible(false);

            }

            if (Array.isArray(oPaineis)) {
                oPaineis.forEach(painel => {
                    painel.setVisible(false);
                });
            }

            let oVBoxFaturaAtual = oVBoxs[0];

            oVBoxFaturaAtual.setBusy(true)

            let oDateAtual = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
            oDateAtual = oDateAtual.replaceAll(",", " ");
            let [oDay, oMes, oAno] = oDateAtual.split(" ")[0].split("/");

            oDay = Number(oDay);
            oMes = Number(oMes);
            oAno = Number(oAno);

            let oTime = 5000;

            if (oBindingContext) {
                this.oMes = oMes;
                this.oAno = oAno;
                oThat = this;
            }else{
                oTime = 0;
            }

            setTimeout(async function () {

                if (this.oPessoaController.getView().getModel('ui').getData().isEditable == false) {

                    let oPessoa = {};

                    if (this.oBindingContext) {

                        oPessoa = await this.oBindingContext.requestObject(this.oBindingContext.getPath());
                        //let oCartao = await this.oPessoaController.getView().getBindingContext().requestObject(oBindingContext.getPath());
                        sap.ui.getCore().oPessoa = oPessoa;

                    } else if (sap.ui.getCore().oPessoa) {

                        oPessoa = sap.ui.getCore().oPessoa;

                    }

                    if (!oPessoa.ID) {

                        do {

                            await this.oPessoaController.wait();

                            oPessoa = await this.oBindingContext.requestObject(this.oBindingContext.getPath());

                        } while (!oPessoa.ID);

                    }

                    const oView = this.oPessoaController.getView();
                    const oFunctionName = "recuperaFaturaCompleta"; // Nome da função para consulta
                    const oPessoaId = oPessoa.ID;  // ID do cartão
                    const oModel = oView.getModel();

                    let oFuncao = oModel.bindContext(`/${oFunctionName}(...)`);
                    oFuncao.setParameter("pessoa", oPessoaId);
                    oFuncao.setParameter("ano", this.oAno);
                    oFuncao.setParameter("mes", this.oMes);

                    // Fazendo a consulta
                    oFuncao.execute().then(async function (oContextos) {

                        let oContext = oFuncao.getBoundContext();

                        if (oContext.getValue("Transacoes")?.length > 0) {

                            const oDetails = new JSONModel(oContext.getValue());

                            oVBoxFaturaAtual.setModel(oDetails);

                            //Pesquisa tabelas da tela para manipulação
                            let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                                return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsDetailsTablePessoa");
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

                            oVBoxFaturaAtual.setBusy(false);

                        } else {

                            if (Array.isArray(oPainelSemFatura)) {

                                oPainelSemFatura[0].setVisible(true);

                            }

                            oVBoxFaturaAtual.setBusy(false);

                            console.warn("Nenhuma fatura encontrada.");
                        }

                    }.bind(this.oPessoaController)).catch((error) => {
                        console.error("Erro ao buscar a fatura:", error);
                    });

                }

            }.bind(this), oTime);

        },

        retrocederFatura: function (e) {

            if (oThat.oMes == 1) {
                oThat.oMes = 12;
                oThat.oAno -= 1;
            } else {
                oThat.oMes -= 1;
            }

            oThat.defineFaturaCompleta();

        },

        avancarFatura: function (e) {

            if (oThat.oMes == 12) {
                oThat.oMes = 1;
                oThat.oAno += 1;
            } else {
                oThat.oMes += 1;
            }

            oThat.defineFaturaCompleta();

        },

        /**
         * Generated event handler.
         *
         * @param oEvent the event object provided by the event provider.
         */
        onPress: function (oEvent) {
            MessageToast.show("Custom handler invoked.");
        },

        excluirTransacao: async function (oEvent) {

            //Pesquisa formulário da fatura
            let oFormularios = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.ui.layout.form.SimpleForm") && oControl.getId().includes("idFaturaFormPessoa");
            });

            let oFormularioFatura = oFormularios[0];

            //Pesquisa tabelas da tela para manipulação
            let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsDetailsTablePessoa");
            });

            let oTabelaTransacoes = oTabelas[0];

            // Obtém os itens selecionados
            const oSelectedItems = oTabelaTransacoes.getSelectedItems();

            if (oSelectedItems.length === 0) {
                // Mostra uma mensagem caso nenhuma linha esteja selecionada
                sap.m.MessageToast.show("Selecione uma transação para excluir.");
                return;
            }

            let oFaturaGeral = oFormularioFatura.getModel().getData();
            //.getBindingContext().getObject();//oSelectedItems[0].getModel("FaturaAtual").getData();
            //let oPath = oSelectedItems[0].getBindingContextPath().split('/');

            let oTransacao = oSelectedItems[0].getBindingContext().getObject(); //oFaturaGeral.Transacoes[`${oPath[2]}`];
            oFaturaGeral.ID = oTransacao?.Fatura_ID;

            const oView = this._view;
            const oModel = this._view.getModel();

            sap.ui.getCore().oFatura = oFaturaGeral;

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
                                        //controller: this.oPessoaController
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
            //             //controller: this.oPessoaController
            //         }).then(function (oDialog) {
            //             oView.addDependent(oDialog);
            //             return oDialog;
            //         });
            //     }

            //     sap.ui.getCore().pDialogExcluir.then(function (oDialog) {
            //         oDialog.open();
            //         oDialog.setModel(oTransacoesRelacionadas, "Transacao");
            //     }.bind(this.oPessoaController));

            // }

        },

        mudarCategoria: async function (oEvent) {

            try {

                //Pesquisa formulário da fatura
                let oFormularios = sap.ui.core.Element.registry.filter(function (oControl) {
                    return oControl.isA("sap.ui.layout.form.SimpleForm") && oControl.getId().includes("idFaturaFormPessoa");
                });

                let oFormularioFatura = oFormularios[0];

                //Pesquisa tabelas da tela para manipulação
                let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                    return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsDetailsTablePessoa");
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

                const oView = this._view,
                    oModel = oView.getModel();

                let oTransacao = oSelectedItems[0].getBindingContext().getObject();

                let oFaturaGeral;

                if (sap.ui.getCore().oFatura) {
                    oFaturaGeral = sap.ui.getCore().oFatura;
                }

                if (!oFaturaGeral?.Cartao_ID) {

                    let oFiltros = [
                        new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, oTransacao.Fatura_ID)
                    ];

                    let oFatura = await oModel.bindList(`/Fatura`, null, null, oFiltros).requestContexts();

                    if (oFatura.length > 0) {

                        oFaturaGeral = oFatura[0].getObject();

                        sap.ui.getCore().oFatura = oFaturaGeral;

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
                                        //controller: this.oPessoaController
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

                    if (oTransacao.Pessoa_ID) {

                        let oCategoria = { ID: "sem", Nome: "Sem categoria" }

                        let oFiltros = [
                            new sap.ui.model.Filter("Pessoa_ID", sap.ui.model.FilterOperator.EQ, oTransacao.Pessoa_ID),
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
                                //controller: this.oPessoaController
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
                return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsDetailsTablePessoa");
            });

            let oTabelaTransacoes = oTabelas[0];

            if (oTabelaTransacoes) {
                oTabelaTransacoes.getBinding("items").filter(oPesquisaTabela, "Application");
            }

        }

    };
});
