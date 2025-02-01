sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
<<<<<<< HEAD
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (MessageToast, Fragment, JSONModel, Filter, FilterOperator) {
=======
    "sap/ui/model/json/JSONModel"
], function (MessageToast, Fragment, JSONModel) {
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
    'use strict';

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
<<<<<<< HEAD
                const mm = String(oDate.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
=======
                const mm = String(oDate.getMonth() + 1).padStart(2, '0');
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
                const yyyy = oDate.getFullYear();

                return `${dd}/${mm}/${yyyy}`; // Ou use '-' em vez de '/'

            }
        },

        excluirTransacao: async function (oEvent) {

            //Pesquisa formulário da fatura
            let oFormularios = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.ui.layout.form.SimpleForm") && oControl.getId().includes("idFaturaForm");
            });

            let oFormularioFatura = oFormularios[0];

            //Pesquisa tabelas da tela para manipulação
            let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsTable");
            });

            let oTabelaTransacoes = oTabelas[0];

            // Obtém os itens selecionados
            const oSelectedItems = oTabelaTransacoes.getSelectedItems();

            if (oSelectedItems.length === 0) {
                // Mostra uma mensagem caso nenhuma linha esteja selecionada
                sap.m.MessageToast.show("Selecione uma transação para excluir.");
                return;
            }

            let oFaturaAtual = oFormularioFatura.getBindingContext().getValue();

<<<<<<< HEAD
            let oTransacao = oSelectedItems[0].getBindingContext().getValue();

            const oView = this._view;
            const oModel = this._view.getModel();

            sap.ui.getCore().oFatura = oFaturaAtual;

            if (oTransacao.ID){

                var securedExecution = function (){

                    return new Promise(function (resolve, reject) {

                        try {

                            fetch(`${oModel.getServiceUrl()}Transacao?$filter=Identificador eq ${oTransacao.Identificador} and ID ne ${oTransacao.ID}`, {
=======
            let oTransacao = oSelectedItems[0].getBindingContext().getValue(); 

            const oView = this._view;

            sap.ui.getCore().oFatura = oFaturaAtual;

            if (oTransacao.ParcelasTotais > 1) {

                var securedExecution = () => {

                    return new Promise((resolve, reject) => {

                        try {

                            fetch(`/Gerenciamento/Transacao?$filter=Identificador eq ${oTransacao.Identificador} and ID ne ${oTransacao.ID}`, {
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
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
<<<<<<< HEAD
                                    Fixo: oTransacao.ParcelasTotais == 1 && oRelacionadas.length > 0 ? true : false,
=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
                                    Relacionadas: oRelacionadas
                                }

                                const oTransacoesRelacionadas = new JSONModel(oModelJson);

<<<<<<< HEAD
                                // Carregar o fragmento do diálogo
                                if (!sap.ui.getCore().pDialogExcluir) {
                                    sap.ui.getCore().pDialogExcluir = Fragment.load({
                                        id: "ExcluirTransacaoFragment",
                                        name: "apps.dflc.gestaogastos.ext.fragment.ExcluirTransacao",
                                        //controller: this
=======
                                oView.setModel(oTransacoesRelacionadas, "Transacao");

                                // Carregar o fragmento do diálogo
                                if (!this.pDialog) {
                                    this.pDialog = Fragment.load({
                                        id: oView.getId(),
                                        name: "apps.dflc.gestaogastos.ext.fragment.ExcluirTransacao"
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
                                    }).then(function (oDialog) {
                                        oView.addDependent(oDialog);
                                        return oDialog;
                                    });
                                }

<<<<<<< HEAD
                                sap.ui.getCore().pDialogExcluir.then(function (oDialog) {
                                    oDialog.open();
                                    oDialog.setModel(oTransacoesRelacionadas, "Transacao");
                                }.bind(this));
=======
                                this.pDialog.then(function (oDialog) {
                                    oDialog.open();
                                });
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a

                                resolve();

                            }.bind(this)).catch(function (error) {
                                sap.m.MessageToast.show("Erro ao chamar serviço de Transações: " + error);
                                reject();

                            });


                        } catch (oError) {
                            sap.m.MessageToast.show("Erro ao chamar serviço: " + oError.message);
                        }

<<<<<<< HEAD
                    }.bind(this));

                }.bind(this)
=======
                    });

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

                this.editFlow.securedExecution(securedExecution, oParameters).finally((final) => {
                    console.log(final)
                });

<<<<<<< HEAD
            } 
        
        },

        mudarCategoria: async function (oEvent) {

            try {

                //Pesquisa formulário da fatura
                let oFormularios = sap.ui.core.Element.registry.filter(function (oControl) {
                    return oControl.isA("sap.ui.layout.form.SimpleForm") && oControl.getId().includes("idFaturaForm");
                });

                let oFormularioFatura = oFormularios[0];

                //Pesquisa tabelas da tela para manipulação
                let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                    return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsTable");
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

                let oTransacao = oSelectedItems[0].getBindingContext().getValue(); 

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
=======
            } else {

                let oModelJson = {
                    Dados: oTransacao,
                    Relacionadas: []
                }

                const oTransacoesRelacionadas = new JSONModel(oModelJson);

                oView.setModel(oTransacoesRelacionadas, "Transacao");

                // Carregar o fragmento do diálogo
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        id: oView.getId(),
                        name: "apps.dflc.gestaogastos.ext.fragment.ExcluirTransacao"
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }

                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                });

>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
            }

        },

        pesquisarTransacao: function (oEvent) {
            var oPesquisaTabela = [],
                oPesquisa = oEvent.getParameter("query");

            if (oPesquisa && oPesquisa.length > 0) {
<<<<<<< HEAD
                oPesquisaTabela = [new Filter({ filters: [new Filter("Descricao", FilterOperator.Contains, oPesquisa)] })];
=======
                oPesquisaTabela = [new Filter({ filters: [new Filter("Descricao", FilterOperator.Contains, oPesquisa)]})];
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
            }

            //Pesquisa tabelas da tela para manipulação
            let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsTable");
            });

            let oTabelaTransacoes = oTabelas[0];

            if (oTabelaTransacoes) {
                oTabelaTransacoes.getBinding("items").filter(oPesquisaTabela, "Application");
            }
<<<<<<< HEAD

=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
        }
    };
});
