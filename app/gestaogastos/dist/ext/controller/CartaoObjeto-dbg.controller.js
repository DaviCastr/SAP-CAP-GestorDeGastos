sap.ui.define([
	'sap/ui/core/mvc/ControllerExtension',
	"sap/ui/model/json/JSONModel",
	"apps/dflc/gestaogastos/ext/fragment/AnaliseCategoriaCartao",
"apps/dflc/gestaogastos/ext/fragment/FaturaAtual"],
	function (ControllerExtension, JSONModel, AnaliseCategoriaCartao, FaturaAtual) {
		'use strict';

		return ControllerExtension.extend('apps.dflc.gestaogastos.ext.controller.CartaoObjeto', {
			// this section allows to extend lifecycle hooks or hooks provided by Fiori elements

			defineModeloFaturaAtual: async function (oBindingContext) {
				FaturaAtual.defineModeloFaturaAtual(this, oBindingContext);
			},

			defineCategoriasFaturaAtual: async function (oBindingContext) {

				AnaliseCategoriaCartao.defineCategoriasFaturaAtual(this, oBindingContext);

			},

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
				 * @memberOf apps.dflc.gestaogastos.ext.controller.CartaoObjeto
				 */

				onInit: function (oEvent) {

					//Pesquisa formulário da fatura
					let oPainelSemFatura = sap.ui.core.Element.registry.filter(function (oControl) {
						return oControl.isA("sap.m.Panel") && oControl.getId().includes("PainelSemFatura");
					});

					//Paineis de fatura atual
					let oPaineis = sap.ui.core.Element.registry.filter(function (oControl) {
						return oControl.isA("sap.m.Panel") && oControl.getId().includes("PainelFatura") || oControl.getId().includes("PainelTransacoes");
					});

					let oVBoxs = sap.ui.core.Element.registry.filter(function (oControl) {
						return oControl.isA("sap.m.VBox") && oControl.getId().includes("FaturaAtualVBox");
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

					let oJsonFaturaAtual = {
						Ano: '',
						Mes: '',
						Descricao: '',
						ValorTotal: '',
						Moeda_code: '',
						Transacoes: []
					}

					let oJsonModelo = new JSONModel(oJsonFaturaAtual);

					oVBoxFaturaAtual.setModel(oJsonModelo);
					oVBoxFaturaAtual.setBusy(true)

				},

				routing: {

					onAfterBinding: async function (oBindingContext) {

						this.defineModeloFaturaAtual(oBindingContext);


						this.defineCategoriasFaturaAtual(oBindingContext);

					},
				}
			}
		});
	});
