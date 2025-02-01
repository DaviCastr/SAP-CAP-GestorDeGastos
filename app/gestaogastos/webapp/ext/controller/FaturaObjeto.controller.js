sap.ui.define(['sap/ui/core/mvc/ControllerExtension', "apps/dflc/gestaogastos/ext/fragment/AnaliseCategoriaFatura"], function (ControllerExtension, AnaliseCategoriaFatura) {
	'use strict';

	return ControllerExtension.extend('apps.dflc.gestaogastos.ext.controller.FaturaObjeto', {

		defineGraficoCategorias: async function (oBindingContext) {

			AnaliseCategoriaFatura.defineGraficoCategorias(this, oBindingContext);

			// setTimeout(async function () {

			// 	if (this.getView().getModel('ui').getData().isEditable == false) {

			// 		let oFatura = await oBindingContext.requestObject(oBindingContext.getPath());

			// 		if (!oFatura.ID) {

			// 			do {

			// 				await this.wait();

			// 				oFatura = await oBindingContext.requestObject(oBindingContext.getPath());

			// 			} while (!oFatura.ID);

			// 		}

			// 		let oExtensionAPI = this.base.getExtensionAPI(),
			// 			oModel = oExtensionAPI.getModel(),
			// 			oFunctionName = "recuperaCategorias",
			// 			oFunction = oModel.bindContext(`/${oFunctionName}(...)`);

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
			// 							id: `Fatura::${categoria.ID}::${crypto.randomUUID()}`,
			// 							headerImage: categoria.Imagem,
			// 							header: categoria.Nome,
			// 							subheader: `${totalCategoria} ${oRetorno.Moeda}`,
			// 							//press: AnaliseCategoriaPessoa.onPress,
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

			// 		oFunction.setParameter("fatura", oFatura.ID);
			// 		await oFunction.execute();
			// 		const oRetorno = oFunction.getBoundContext().getValue();

			// 		oAdicionaCategorias("categoryFatura", oRetorno);

			// 	}


			// }.bind(this), 5000);
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
