sap.ui.define(['sap/ui/core/mvc/ControllerExtension', "sap/ui/model/json/JSONModel", "sap/ui/core/Fragment",], function (ControllerExtension, JSONModel, Fragment) {
	'use strict';

	return ControllerExtension.extend('apps.dflc.gestaogastos.ext.controller.CartaoObjeto', {

		defineModeloFaturaAtual: async function (oBindingContext) {

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

			if(Array.isArray(oPainelSemFatura)){

				oPainelSemFatura[0].setVisible(false);

			}

			if (Array.isArray(oPaineis)) {
				oPaineis.forEach(painel => {
					painel.setVisible(false);
				});
			}

			let oVBoxFaturaAtual = oVBoxs[0];

			oVBoxFaturaAtual.setBusy(true)

			let oCartao = await oBindingContext.requestObject(oBindingContext.getPath());

			if (!oCartao.ID) {

				do {

					await this.wait();

					oCartao = await oBindingContext.requestObject(oBindingContext.getPath());

				} while (!oCartao.ID);

			}

			const oView = this.getView();
			const oFunctionName = "Fatura"; 
			const oCartaoId = oCartao.ID;  
			let oDateAtual = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
			oDateAtual = oDateAtual.replaceAll(",", " ");
			let [oDay, oMes, oAno] = oDateAtual.split(" ")[0].split("/");

			oDay = Number(oDay);
			oMes = Number(oMes);
			oAno = Number(oAno);

			const oModel = oView.getModel();

			if (oCartao.DiaFechamento <= oDay) {

				if (oMes < 12) {
					oMes += 1;
				} else {
					oMes = 1
					oAno += 1
				}

			}

			// Configurando os filtros
			let aFilters = [
				new sap.ui.model.Filter("Cartao_ID", sap.ui.model.FilterOperator.EQ, oCartaoId),
				new sap.ui.model.Filter("Ano", sap.ui.model.FilterOperator.EQ, oAno),
				new sap.ui.model.Filter("Mes", sap.ui.model.FilterOperator.EQ, oMes),
			];

			// Fazendo a consulta
			oModel.bindList("/Fatura", null, null, aFilters).requestContexts().then(async function (aContexts) {
				if (aContexts.length > 0) {

					const oContext = aContexts[0];

					oVBoxFaturaAtual.bindElement(oContext.getPath())
		
					if (Array.isArray(oPaineis)) {
						oPaineis.forEach(painel => {
							painel.setVisible(true);
						});
					}		

					oVBoxFaturaAtual.setBusy(false);

				} else {

					if(Array.isArray(oPainelSemFatura)){

						oPainelSemFatura[0].setVisible(true);
		
					}

					oVBoxFaturaAtual.setBusy(false);

					console.warn("Nenhuma fatura encontrada.");
				}

			}.bind(this)).catch((error) => {
				console.error("Erro ao buscar a fatura:", error);
			});

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
			onInit: function () {
				var oModel = this.base.getExtensionAPI().getModel();
			},


			onBeforeRendering: async function (oEvent) {


			},

			onAfterRendering: function (oEvent) {

			},

			routing: {

				onAfterBinding: async function (oBindingContext) {

					this.defineModeloFaturaAtual(oBindingContext);

				},

				onBeforeBinding: async function (oBindingContext) {
				}
			}
		}
	});
});
