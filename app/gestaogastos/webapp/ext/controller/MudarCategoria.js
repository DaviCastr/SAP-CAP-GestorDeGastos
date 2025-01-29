sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (MessageToast, JSONModel, Fragment) {
    'use strict';

    return {
        mudarCategoria: async function (oEvent) {

            try {

                //Pesquisa tabelas da tela para manipulação
                let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                    return oControl.isA("sap.m.Table") && oControl.getId().includes("i18nTransaescompras-innerTable");
                });

                let oTabela = oTabelas[0];
                let oTransacao = oTabela.getSelectedItems()[0].getBindingContext().getValue();

                const oView = this.editFlow.getView();
                const oModel = oView.getModel();
                let oFaturaAtual = oView.getBindingContext().getValue();

                sap.ui.getCore().oFatura = oFaturaAtual; 

                sap.ui.core.BusyIndicator.show();

                if (!oFaturaAtual.Cartao_ID) {

                    let oFiltros = [
                        new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, oFaturaAtual.ID)
                    ];

                    let oFatura = await oModel.bindList(`/Fatura`, null, null, oFiltros).requestContexts();

                    if (oFatura.length > 0) {

                        oFaturaAtual = oFatura[0].getObject();
                        sap.ui.getCore().oFatura = oFaturaAtual;

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
            }

        }
    };
});
