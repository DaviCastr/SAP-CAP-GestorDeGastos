sap.ui.define(['sap/ui/core/mvc/ControllerExtension', "sap/ui/core/message/Message", "sap/ui/core/MessageType",
	"sap/ui/model/json/JSONModel"], function (ControllerExtension, Message, MessageType, JSONModel) {
		'use strict';

		return ControllerExtension.extend('apps.dflc.gestaogastos.ext.controller.PessoaObjeto', {
			// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
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
						//Pesquisa tabelas da tela para manipulação
						let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
							return oControl.isA("sap.m.Table") && oControl.getId().includes("innerTable");
						});

						let oTabela = oTabelas[0];

						let oPessoa = await oBindingContext.requestObject(oBindingContext.getPath());

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

							});

						}

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
						});

					}
				}
			}
		});
	});
