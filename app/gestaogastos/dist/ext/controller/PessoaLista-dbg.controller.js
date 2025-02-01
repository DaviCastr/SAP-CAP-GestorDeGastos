sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('apps.dflc.gestaogastos.ext.controller.PessoaLista', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements

		enviarAvisos: async function (oModel) {

			setTimeout(async function () {

				let oNomeFuncao = 'enviarAviso';

				let oEnviarAvisos = oModel.bindContext(`/${oNomeFuncao}(...)`);

				await oEnviarAvisos.execute();

				const oContext = oEnviarAvisos.getBoundContext();

				console.log(oContext.getValue());

			}.bind(this), 10000);

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
			 * @memberOf apps.dflc.gestaogastos.ext.controller.PessoaLista
			 */
			onInit: async function (e) {

				let oTabelasPessoas = []

				oTabelasPessoas = sap.ui.core.Element.registry.filter(function (oControl) {
					try {
						return oControl.isA("sap.m.Table") && oControl.getId().includes("Pessoa::LineItem-innerTable");
					} catch (erro) {

					}
				});

				if (oTabelasPessoas.length == 0) {

					do {

						await this.wait();

						oTabelasPessoas = sap.ui.core.Element.registry.filter(function (oControl) {
							try {
								return oControl.isA("sap.m.Table") && oControl.getId().includes("Pessoa::LineItem-innerTable");
							} catch (erro) {

							}
						});

					} while (oTabelasPessoas.length == 0);

				}

				oTabelasPessoas.forEach(oTabelaPessoas => {

					oTabelaPessoas.getColumns().forEach(coluna => {

						if (coluna.getHeader().getLabel().getText() == 'Foto') {
							coluna.setImportance(sap.ui.core.Priority.High);
						}

					});

				});

			},

			routing: {

				onAfterBinding: async function (oBindingContext) {

					if (!this.AvisoEnviado) {
						this.enviarAvisos(this.base.getModel());
						this.AvisoEnviado = true;
					}

				}
			}
		}
	});
});
