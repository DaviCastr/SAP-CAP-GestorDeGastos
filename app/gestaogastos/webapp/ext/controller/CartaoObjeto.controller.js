sap.ui.define(['sap/ui/core/mvc/ControllerExtension', "sap/ui/model/json/JSONModel"], function (ControllerExtension, JSONModel) {
	'use strict';

	return ControllerExtension.extend('apps.dflc.gestaogastos.ext.controller.CartaoObjeto', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf apps.dflc.gestaogastos.ext.controller.CartaoObjeto
			 */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
				var oJsonVariantes = {

					Ano: 2025,
					Mes: 1
				
			}

				const oVariantes = new JSONModel(oJsonVariantes);

				this.getView().setModel(oVariantes, "Variantes");
			},

			onBeforeRendering: function (oEvent) {

				//Pesquisa tabelas da tela para manipulação
				let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
					return oControl.isA("sap.m.Table") && oControl.getId().includes("Fatura");
				});
	
				let oTabela = oTabelas[0];

				var oJsonVariantes = {

						Ano: 2025,
						Mes: 1
					
				}

				const oVariantes = new JSONModel(oJsonVariantes);

				this.getView().setModel(oVariantes, "Variantes");
			},

			onAfterRendering: function (oEvent) {
				var oJsonVariantes = {

					Ano: 2025,
					Mes: 1
				
			}

				const oVariantes = new JSONModel(oJsonVariantes);

				this.getView().setModel(oVariantes, "Variantes");
			},

			routing: {

				onAfterBinding: async function (oBindingContext) {

					var oJsonVariantes = {

						Ano: 2025,
						Mes: 1
					
				}
	
					const oVariantes = new JSONModel(oJsonVariantes);
	
					this.getView().setModel(oVariantes, "Variantes");

				},

				onBeforeBinding: async function (oBindingContext) {

					var oJsonVariantes = {

						Ano: 2025,
						Mes: 1
					
				}
	
					const oVariantes = new JSONModel(oJsonVariantes);
	
					this.getView().setModel(oVariantes, "Variantes");

				}
			}
		}
	});
});
