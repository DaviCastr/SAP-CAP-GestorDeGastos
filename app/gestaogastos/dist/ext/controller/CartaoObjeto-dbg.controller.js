sap.ui.define(['sap/ui/core/mvc/ControllerExtension', "sap/ui/model/json/JSONModel", "sap/ui/core/Fragment",], function (ControllerExtension, JSONModel, Fragment) {
	'use strict';

	return ControllerExtension.extend('apps.dflc.gestaogastos.ext.controller.CartaoObjeto', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements

		defineModeloFaturaAtual: async function (oBindingContext) {

			// //Pesquisa formulário da fatura
			// let oFormularios = sap.ui.core.Element.registry.filter(function (oControl) {
			// 	return oControl.isA("sap.ui.layout.form.SimpleForm") && oControl.getId().includes("idFaturaForm");
			// });

			// // let oFormularioFatura = oFormularios[0];

			// // if (oFormularioFatura) {
			// // 	oFormularioFatura.unbindElement();
			// // }

			// //Pesquisa tabelas da tela para manipulação
			// let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
			// 	return oControl.isA("sap.m.Table") && oControl.getId().includes("transactionsTable");
			// });

			// let oTabelaTransacoes = oTabelas[0];

			// if (oTabelaTransacoes) {
			// 	oTabelaTransacoes.unbindItems();
			// }

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
			//let oCartao = await this.getView().getBindingContext().requestObject(oBindingContext.getPath());

			if (!oCartao.ID) {

				do {

					await this.wait();

					oCartao = await oBindingContext.requestObject(oBindingContext.getPath());

				} while (!oCartao.ID);

			}

			const oView = this.getView();
			const oFunctionName = "Fatura"; // Nome da função para consulta
			const oCartaoId = oCartao.ID;  // ID do cartão
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
					// Obtendo o primeiro resultado
					const oContext = aContexts[0];

					//oFormularioFatura.bindElement(oContext.getPath());
					oVBoxFaturaAtual.bindElement(oContext.getPath())
		
					if (Array.isArray(oPaineis)) {
						oPaineis.forEach(painel => {
							painel.setVisible(true);
						});
					}		

					// if (!oTabelaTransacoes.getBindingInfo("items")?.template) {
					// 	oTabelaTransacoes.addColumn(new sap.m.Column({
					// 		header: new sap.m.Label({ text: "Data" }) // Nome da coluna
					// 	}));
					// 	oTabelaTransacoes.addColumn(new sap.m.Column({
					// 		header: new sap.m.Label({ text: "Valor" }) // Nome da coluna
					// 	}));
					// 	oTabelaTransacoes.addColumn(new sap.m.Column({
					// 		header: new sap.m.Label({ text: "Parcelas" }) // Nome da coluna
					// 	}));
					// 	oTabelaTransacoes.addColumn(new sap.m.Column({
					// 		header: new sap.m.Label({ text: "Descrição" }) // Nome da coluna
					// 	}));

					// 	// Defina o template para as linhas da tabela
					// 	var oTemplate = new sap.m.ColumnListItem({
					// 		cells: [
					// 			new sap.m.Text({ text: "{Data}" }), // Mapeia o campo Data
					// 			new sap.m.ObjectNumber({ number: "{Valor}", unit: "{Moeda_code}" }), // Mapeia Valor e Moeda
					// 			new sap.m.Text({ text: "{Parcela} de {ParcelasTotais}" }),
					// 			new sap.m.Text({ text: "{Descricao}" }),
					// 			new sap.m.Text({ text: "{Identificador}" }),
					// 		]
					// 	});

					// } else {
					// 	var oTemplate = oTabelaTransacoes.getBindingInfo("items").template;
					// }

					// // Agora faça o binding usando esse template
					// oTabelaTransacoes.bindItems({
					// 	path: `${oContext.getPath()}/Transacoes`,
					// 	template: oTemplate
					// });

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
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
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
