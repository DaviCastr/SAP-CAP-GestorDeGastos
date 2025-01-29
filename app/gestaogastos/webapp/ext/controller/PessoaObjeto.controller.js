sap.ui.define(['sap/ui/core/mvc/ControllerExtension',
	"sap/ui/core/message/Message",
	"sap/ui/core/MessageType",
	"apps/dflc/gestaogastos/ext/fragment/AnaliseCategoriaPessoa"
], function (ControllerExtension, Message, MessageType, AnaliseCategoriaPessoa) {
	'use strict';

	return ControllerExtension.extend('apps.dflc.gestaogastos.ext.controller.PessoaObjeto', {

		defineAvisos: async function (oBindingContext) {

			setTimeout(async function () {

				if (this.getView().getModel('ui').getData().isEditable == false) {

					let oPessoa = await oBindingContext.requestObject(oBindingContext.getPath());

					if (!oPessoa.ID) {

						do {

							await this.wait();

							oPessoa = await oBindingContext.requestObject(oBindingContext.getPath());

						} while (!oPessoa.ID);

					}

					const oExtensionAPI = this.base.getExtensionAPI();

					const oMessages = []

					let aFilters = [
						new sap.ui.model.Filter("Pessoa_ID", sap.ui.model.FilterOperator.EQ, oPessoa.ID)
					];

					// Fazendo a consulta
					oBindingContext.oModel.bindList("/Cartao", null, null, aFilters).requestContexts().then(async function (oContexts) {
						if (oContexts.length > 0) {

							let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
							oDate = oDate.replaceAll(",", " ");
							let [oDay, oMes, oAno] = oDate.split(" ")[0].split("/");

							oContexts.forEach(cartao => {

								cartao = cartao.getValue();

								if (cartao.DiaVencimento - oDay >= 0 && cartao.DiaVencimento - oDay < 2) {

									if (oMessages.length == 0) {
										oMessages.push(new Message({
											type: MessageType.Warning,
											message: `A fatura do cartão ${cartao.NomeCartao} está vencendo`
										}));
									}

								}

							});

							if (oPessoa.TotalDoMes > oPessoa.ObjetivoDeGasto && oMessages.length == 0) {
								oMessages.push(new Message({
									type: MessageType.Warning,
									message: "Seu gasto está acima do seu objetivo de gasto mensal"
								}));
							}

							if (oPessoa.TotalDoMes > oPessoa.Renda && oMessages.length == 0) {
								oMessages.push(new Message({
									type: MessageType.Warning,
									message: "Seu gasto está acima mensal está superior a sua renda, fique de olho e reduza seus gastos!"
								}));
							}

							oExtensionAPI.showMessages(oMessages);
						}
					});

				}

			}.bind(this), 5000);

		},

		sleep: function (ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},

		wait: async function () {
			await this.sleep(500);
		},

		defineGraficoCategoriasTotalGastos: async function (oBindingContext) {

			AnaliseCategoriaPessoa.defineGraficoCategoriasTotalGastos(this, oBindingContext);

		},

		defineGraficoMensalCategorias: async function (oBindingContext) {

			AnaliseCategoriaPessoa.defineGraficoMensalCategorias(this, oBindingContext);

		},

		limpaPrevisao: async function () {

			let oCampos = sap.ui.core.Element.registry.filter(function (oControl) {
				try {
					return oControl.isA("sap.m.ObjectNumber") && oControl.getId().includes("TotalDoMes")
					 ||    oControl.isA("sap.m.ObjectNumber") && oControl.getId().includes("TotalDeGastos")
					 ||    oControl.isA("sap.m.ObjectNumber") && oControl.getId().includes("ValorAEconomizar");
				} catch (erro) {

				}
			});

			if (oCampos.length == 0) {

				do {
					await this.wait();

					oCampos = sap.ui.core.Element.registry.filter(function (oControl) {
						try {
							return oControl.isA("sap.m.ObjectNumber") && oControl.getId().includes("TotalDoMes")
							 ||    oControl.isA("sap.m.ObjectNumber") && oControl.getId().includes("TotalDeGastos")
							 ||    oControl.isA("sap.m.ObjectNumber") && oControl.getId().includes("ValorAEconomizar");
						} catch (erro) {
		
						}
					});

				} while (oCampos.length == 0);

			}

			let oFlexBoxs = sap.ui.core.Element.registry.filter(function (oControl) {
				try {
					return oControl.isA("sap.m.FlexBox") && oControl.getId().includes("categoryPrevisao")
					 ||    oControl.isA("sap.m.FlexBox") && oControl.getId().includes("categoryPrevisaoTotal");
				} catch (erro) {

				}
			});

			if (oFlexBoxs.length == 0) {

				do {
					await this.wait();

					oFlexBoxs = sap.ui.core.Element.registry.filter(function (oControl) {
						try {
							return oControl.isA("sap.m.FlexBox") && oControl.getId().includes("categoryPrevisao")
							 ||    oControl.isA("sap.m.FlexBox") && oControl.getId().includes("categoryPrevisaoTotal");
						} catch (erro) {
		
						}
					});

				} while (oFlexBoxs.length == 0);

			}

			oCampos.forEach(campo => {

				campo.setNumber("");
				campo.setUnit("");
				
			});

			oFlexBoxs.forEach(flexbox => {

				flexbox.removeAllItems()
				flexbox.addItem(new sap.m.Label({ text: 'Faça a pesquisa inicial' }));
				
			});

		},

		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf apps.dflc.gestaogastos.ext.controller.PessoaObjeto
			 */

			onInit: async function (e) {

				let oTabelaCartoes = []

				oTabelaCartoes = sap.ui.core.Element.registry.filter(function (oControl) {
					try {
						return oControl.isA("sap.m.Table") && oControl.getId().includes("Cartes-innerTable");
					} catch (erro) {

					}
				});

				if (oTabelaCartoes.length == 0) {

					do {
						await this.wait();

						oTabelaCartoes = sap.ui.core.Element.registry.filter(function (oControl) {
							try {
								return oControl.isA("sap.m.Table") && oControl.getId().includes("Cartes-innerTable");
							} catch (erro) {

							}
						});

					} while (oTabelaCartoes.length == 0);

				}

				oTabelaCartoes.forEach(oTabela => {

					oTabela.getColumns().forEach(coluna => {

						if (coluna.getHeader().getLabel().getText() == 'Foto') {
							coluna.setImportance(sap.ui.core.Priority.High);
						}

					});

				});

			},

			routing: {

				onAfterBinding: async function (oBindingContext) {

					this.defineAvisos(oBindingContext);

					this.defineGraficoCategoriasTotalGastos(oBindingContext);

					this.defineGraficoMensalCategorias(oBindingContext);

					this.limpaPrevisao();

				}
			}
		}
	});
});
