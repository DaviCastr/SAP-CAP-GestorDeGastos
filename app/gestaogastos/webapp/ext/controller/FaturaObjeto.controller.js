sap.ui.define(['sap/ui/core/mvc/ControllerExtension', "apps/dflc/gestaogastos/ext/fragment/AnaliseCategoriaFatura"], function (ControllerExtension, AnaliseCategoriaFatura) {
	'use strict';

	return ControllerExtension.extend('apps.dflc.gestaogastos.ext.controller.FaturaObjeto', {

		defineGraficoCategorias: async function (oBindingContext) {

			AnaliseCategoriaFatura.defineGraficoCategorias(this, oBindingContext);

		},

		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf apps.dflc.gestaogastos.ext.controller.FaturaObjeto
			 */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},

			routing: {

				onAfterBinding: async function (oBindingContext) {

					this.defineGraficoCategorias(oBindingContext);

				},
			}
		}
	});
});
