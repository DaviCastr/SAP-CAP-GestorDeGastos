<<<<<<< HEAD
sap.ui.define(['sap/ui/core/mvc/ControllerExtension',
	"sap/ui/core/message/Message",
	"sap/ui/core/MessageType",
	"apps/dflc/gestaogastos/ext/fragment/AnaliseCategoriaPessoa"
], function (ControllerExtension, Message, MessageType, AnaliseCategoriaPessoa) {
	'use strict';

	return ControllerExtension.extend('apps.dflc.gestaogastos.ext.controller.PessoaObjeto', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements

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

					// var securedExecution = () => {

					// 	return new Promise((resolve, reject) => {

					// 		try {

					// 			//Serviço de cartões
					// 			const oPayload = {
					// 				Pessoa_ID: oPessoa.ID
					// 			};

					// 			fetch(`/Gerenciamento/Cartao?$filter=Pessoa_ID eq ${oPayload.Pessoa_ID}`, {
					// 				method: "GET",
					// 				headers: {
					// 					"Content-Type": "application/json",
					// 					"Accept": "application/json",
					// 				}
					// 			}).then(async function (data) {

					// 				let oData = await data.json();

					// 				// Modelo para alimentar os cartões
					// 				let oCartoes;

					// 				if (Array.isArray(oData.value))
					// 					oCartoes = oData.value
					// 				else
					// 					oCartoes = [oData.value]

					// 				let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
					// 				oDate = oDate.replaceAll(",", " ");
					// 				let [oDay, oMes, oAno] = oDate.split(" ")[0].split("/");

					// 				oCartoes.forEach(cartao => {

					// 					if (cartao.DiaVencimento - oDay >= 0 && cartao.DiaVencimento - oDay < 2) {

					// 						if (oMessages.length == 0) {
					// 							oMessages.push(new Message({
					// 								type: MessageType.Warning,
					// 								message: `A fatura do cartão ${cartao.NomeCartao} está vencendo`
					// 							}));
					// 						}

					// 					}

					// 				});

					// 				if (oPessoa.TotalDoMes > oPessoa.ObjetivoDeGasto && oMessages.length == 0) {
					// 					oMessages.push(new Message({
					// 						type: MessageType.Warning,
					// 						message: "Seu gasto está acima do seu objetivo de gasto mensal"
					// 					}));
					// 				}

					// 				if (oPessoa.TotalDoMes > oPessoa.Renda && oMessages.length == 0) {
					// 					oMessages.push(new Message({
					// 						type: MessageType.Warning,
					// 						message: "Seu gasto está acima mensal está superior a sua renda, fique de olho e reduza seus gastos!"
					// 					}));
					// 				}

					// 				oExtensionAPI.showMessages(oMessages);

					// 				resolve();

					// 			}.bind(this)).catch(function (error) {
					// 				sap.m.MessageToast.show("Erro:" + error);
					// 				reject();

					// 			});

					// 		} catch (oError) {
					// 			sap.m.MessageToast.show("Erro ao chamar serviço: " + oError.message);
					// 		}

					// 	});

					// }

					// let oParameters = {
					// 	busy: {
					// 		set: true,
					// 		check: true
					// 	},
					// 	dataloss: {
					// 		popup: true,
					// 		navigation: false
					// 	}
					// }

					// this.base.getExtensionAPI().editFlow.securedExecution(securedExecution, oParameters).finally((final) => {
					// 	console.log(final)
					// });

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
=======
sap.ui.define(['sap/ui/core/mvc/ControllerExtension', "sap/ui/core/message/Message", "sap/ui/core/MessageType",
	"sap/ui/model/json/JSONModel"], function (ControllerExtension, Message, MessageType, JSONModel) {
		'use strict';

		return ControllerExtension.extend('apps.dflc.gestaogastos.ext.controller.PessoaObjeto', {
			// this section allows to extend lifecycle hooks or hooks provided by Fiori elements

			defineAvisos: async function (oBindingContext) {

				let oPessoa = await oBindingContext.requestObject(oBindingContext.getPath());

				if (!oPessoa.ID) {

					do {

						await this.wait();

						oPessoa = await oBindingContext.requestObject(oBindingContext.getPath());

					} while (!oPessoa.ID);

				}

				const oExtensionAPI = this.base.getExtensionAPI();

				const oMessages = []

				var securedExecution = () => {

					return new Promise((resolve, reject) => {

						try {

							//Serviço de cartões
							const oPayload = {
								Pessoa_ID: oPessoa.ID
							};

							fetch(`/Gerenciamento/Cartao?$filter=Pessoa_ID eq ${oPayload.Pessoa_ID}`, {
								method: "GET",
								headers: {
									"Content-Type": "application/json",
									"Accept": "application/json",
								}
							}).then(async function (data) {

								let oData = await data.json();

								// Modelo para alimentar os cartões
								let oCartoes;

								if (Array.isArray(oData.value))
									oCartoes = oData.value
								else
									oCartoes = [oData.value]

								let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
								oDate = oDate.replaceAll(",", " ");
								let [oDay, oMes, oAno] = oDate.split(" ")[0].split("/");

								oCartoes.forEach(cartao => {

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

								resolve();

							}.bind(this)).catch(function (error) {
								sap.m.MessageToast.show("Erro:" + error);
								reject();

							});

						} catch (oError) {
							sap.m.MessageToast.show("Erro ao chamar serviço: " + oError.message);
						}

>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
					});

				}

<<<<<<< HEAD
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

			// let oPaineis = sap.ui.core.Element.registry.filter(function (oControl) {
			// 	return oControl.isA("sap.m.FlexBox") && oControl.getId().includes("TotalGastosCharts")
			// });

			// oPaineis.forEach(painel=> { painel.setBusy(true); painel.removeAllItems() })

			// setTimeout(async function () {

			// 	if (this.getView().getModel('ui').getData().isEditable == false) {

			// 		let oPessoa = await oBindingContext.requestObject(oBindingContext.getPath());

			// 		if (!oPessoa.ID) {

			// 			do {

			// 				await this.wait();

			// 				oPessoa = await oBindingContext.requestObject(oBindingContext.getPath());

			// 			} while (!oPessoa.ID);

			// 		}

			// 		let oAdicionaCategorias = function (idFlexBox, oRetorno) {

			// 			// Criação de MicroCharts para cada categoria
			// 			let oCategoryCharts = sap.ui.core.Element.registry.filter(function (oControl) {
			// 				return oControl.isA("sap.m.FlexBox") && oControl.getId().includes(`${idFlexBox}`);
			// 			});

			// 			if (oCategoryCharts.length > 0) {

			// 				if (oRetorno?.Categorias) {

			// 					oCategoryCharts = oCategoryCharts[0];

			// 					const aTiles = [];
			// 					oRetorno.Categorias.forEach(categoria => {
			// 						const totalCategoria = categoria.TotalCategoria || 0;
			// 						const porcentagem = categoria.Porcentagem

			// 						const oTile = new sap.m.GenericTile({
			// 							id: `Total::${categoria.ID}::${crypto.randomUUID()}`,
			// 							headerImage: categoria.Imagem,
			// 							header: categoria.Nome,
			// 							subheader: `${totalCategoria} ${oRetorno.Moeda}`,
			// 							press: AnaliseCategoriaPessoa.onPressTotal,
			// 							frameType: "OneByOne",
			// 							tileContent: 
			// 								new sap.m.TileContent({
			// 									footer: `Gasto: ${porcentagem.toFixed(2)}%`,
			// 									content: new sap.suite.ui.microchart.RadialMicroChart({
			// 										size: "Responsive",
			// 										percentage: porcentagem,
			// 										valueColor: porcentagem > 20 ? "Error" : "Good",
			// 										alignContent: "Center"
			// 									}),
			// 								})
			// 						});

			// 						aTiles.push(oTile);
			// 					});

			// 					oCategoryCharts.removeAllItems();
			// 					if (aTiles.length == 0) {
			// 						oCategoryCharts.addItem(new sap.m.Label({ text: 'Não há categorias com gastos nesse Mês' }));
			// 					} else {
			// 						aTiles.forEach((oTile, index) => {
			// 							oCategoryCharts.addItem(oTile);
			// 							if (index < aTiles.length - 1) {
			// 								oCategoryCharts.addItem(new sap.m.Label({ text: '  --  ' }));
			// 							}
			// 						});
			// 					}

			// 					oCategoryCharts.setBusy(false);

			// 				} else {
			// 					oCategoryCharts[0].removeAllItems();
			// 					oCategoryCharts[0].addItem(new sap.m.Label({ text: 'Não há categorias com gastos nesse Mês' }));
			// 				}

			// 			}

			// 		}

			// 		let oExtensionAPI = this.base.getExtensionAPI(),
			// 			oModel = oExtensionAPI.getModel(),
			// 			oFunctionName = "recuperaCategoriasParaGastoTotal",
			// 			oFunction = oModel.bindContext(`/${oFunctionName}(...)`);

			// 		oFunction.setParameter("pessoa", oPessoa.ID);
			// 		await oFunction.execute();
			// 		const oRetorno = oFunction.getBoundContext().getValue();

			// 		oAdicionaCategorias("TotalGastosCharts", oRetorno);

			// 	}


			// }.bind(this), 2000);
		},

		defineGraficoMensalCategorias: async function (oBindingContext) {

			AnaliseCategoriaPessoa.defineGraficoMensalCategorias(this, oBindingContext);

			// let oPaineis = sap.ui.core.Element.registry.filter(function (oControl) {
			// 	return oControl.isA("sap.m.FlexBox") && oControl.getId().includes("MensalCharts")
			// });

			// oPaineis.forEach(painel=> { painel.setBusy(true); painel.removeAllItems() })

			// setTimeout(async function () {

			// 	if (this.getView().getModel('ui').getData().isEditable == false) {

			// 		let oPessoa = await oBindingContext.requestObject(oBindingContext.getPath());

			// 		if (!oPessoa.ID) {

			// 			do {

			// 				await this.wait();

			// 				oPessoa = await oBindingContext.requestObject(oBindingContext.getPath());

			// 			} while (!oPessoa.ID);

			// 		}

			// 		let oAdicionaCategorias = function (idFlexBox, oRetorno) {

			// 			// Criação de MicroCharts para cada categoria
			// 			let oCategoryCharts = sap.ui.core.Element.registry.filter(function (oControl) {
			// 				return oControl.isA("sap.m.FlexBox") && oControl.getId().includes(`${idFlexBox}`);
			// 			});

			// 			if (oCategoryCharts.length > 0) {

			// 				if (oRetorno?.Categorias) {

			// 					oCategoryCharts = oCategoryCharts[0];

			// 					const aTiles = [];
			// 					oRetorno.Categorias.forEach(categoria => {
			// 						const totalCategoria = categoria.TotalCategoria || 0;
			// 						const porcentagem = categoria.Porcentagem

			// 						const oTile = new sap.m.GenericTile({
			// 							id: `Mensal::${categoria.ID}::${crypto.randomUUID()}`,
			// 							headerImage: categoria.Imagem,
			// 							header: categoria.Nome,
			// 							subheader: `${totalCategoria} ${oRetorno.Moeda}`,
			// 							press: AnaliseCategoriaPessoa.onPressMensal,
			// 							frameType: "OneByOne",
			// 							tileContent: 
			// 								new sap.m.TileContent({
			// 									footer: `Gasto: ${porcentagem.toFixed(2)}%`,
			// 									content: new sap.suite.ui.microchart.RadialMicroChart({
			// 										size: "Responsive",
			// 										percentage: porcentagem,
			// 										valueColor: porcentagem > 20 ? "Error" : "Good",
			// 										alignContent: "Center"
			// 									}),
			// 								})
			// 						});

			// 						aTiles.push(oTile);
			// 					});

			// 					oCategoryCharts.removeAllItems();
			// 					if (aTiles.length == 0) {
			// 						oCategoryCharts.addItem(new sap.m.Label({ text: 'Não há categorias com gastos nesse Mês' }));
			// 					} else {
			// 						aTiles.forEach((oTile, index) => {
			// 							oCategoryCharts.addItem(oTile);
			// 							if (index < aTiles.length - 1) {
			// 								oCategoryCharts.addItem(new sap.m.Label({ text: '  --  ' }));
			// 							}
			// 						});
			// 					}

			// 					oCategoryCharts.setBusy(false);

			// 				} else {
			// 					oCategoryCharts[0].removeAllItems();
			// 					oCategoryCharts[0].addItem(new sap.m.Label({ text: 'Não há categorias com gastos nesse Mês' }));
			// 				}

			// 			}

			// 		}

			// 		let oExtensionAPI = this.base.getExtensionAPI(),
			// 			oModel = oExtensionAPI.getModel(),
			// 			oFunctionName = "recuperaCategorias",
			// 			oFunction = oModel.bindContext(`/${oFunctionName}(...)`);

			// 		oFunction.setParameter("pessoa", oPessoa.ID);
			// 		await oFunction.execute();
			// 		const oRetorno = oFunction.getBoundContext().getValue();

			// 		let oCategoryCharts = sap.ui.core.Element.registry.filter(function (oControl) {
			// 			return oControl.isA("sap.m.FlexBox") && oControl.getId().includes(`MensalCharts`);
			// 		});

			// 		if (oCategoryCharts.length > 0) {
			// 			oCategoryCharts[0].bindElement(`/recuperaCategorias(pessoa=${oPessoa.ID})`);
			// 			oCategoryCharts[0].setBusy(false);
			// 		}

			// 		//oAdicionaCategorias("MensalCharts", oRetorno);

			// 	}


			// }.bind(this), 2000);
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

=======
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

				this.base.getExtensionAPI().editFlow.securedExecution(securedExecution, oParameters).finally((final) => {
					console.log(final)
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
				});

			},

<<<<<<< HEAD
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
=======
			sleep: function (ms) {
				return new Promise(resolve => setTimeout(resolve, ms));
			},

			wait: async function () {
				await this.sleep(500);
			},

			override: {
				/**
				 * Called when a controller is instantiated and its View controls (if available) are already created.
				 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
				 * @memberOf apps.dflc.gestaogastos.ext.controller.PessoaObjeto
				 */
				onInit: function () {
					// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
					var oModel = this.base.getExtensionAPI().getModel();
				},
				onAfterRendering: function (oEvent) {

					let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
						return oControl.isA("sap.ui.layout.form.FormElement") && oControl.getId().includes("Imagem");
					});

					let oTabela = oTabelas[0];


				},

				routing: {

					onAfterBinding: async function (oBindingContext) {

						this.defineAvisos(oBindingContext);

					}
				}
			}
		});
	});
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
