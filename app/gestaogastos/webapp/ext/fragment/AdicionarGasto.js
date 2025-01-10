sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (MessageToast, ValueHelpDialog, Filter, FilterOperator) {
    'use strict';

    return {

        onInit: function (oEvent) {
            console.log(oEvent);
        },

        onCancelarGasto: function (oEvent) {

            this.getParent().close();

        },

        onAdicionarGasto: async function (oEvent) {
            const oView = this.getParent().getParent();
            const oDialog = this.getParent();

            oDialog.setBusy(true);

            var oDescricaoGastoInput = oView.byId("descricaoGastoInput");
            var oValorGastoInput = oView.byId("valorGastoInput");
            var oMoedaGastoInput = oView.byId("moedaGastoInput");
            var oDataGastoPicker = oView.byId("dataGastoPicker");
            var oGastoFixoCheckBox = oView.byId("gastoFixoCheckBox");
            var oTotalParcelasInput = oView.byId("totalParcelasInput");
            var oCartaoSelect = oView.byId("cartaoSelect");

            // Verificar se todos os campos obrigatórios estão preenchidos
            var oValido = true; 

            //Campo de descrição
            if (!oDescricaoGastoInput.getValue()) {
                oDescricaoGastoInput.setValueState("Error");
                oValido = false;

            } else if (oDescricaoGastoInput.getValue() == ' ') {
                oDescricaoGastoInput.setValueState("Error");
                oValido = false;

            } else {
                oDescricaoGastoInput.setValueState("None");
            }

            // Validando o valor do gasto (Input)
            if (!oValorGastoInput.getValue()) {
                oValorGastoInput.setValueState("Error");
                oValido = false;

            } else if (oValorGastoInput.getValue() == 0) {
                oValorGastoInput.setValueState("Error");
                oValido = false;

            } else if (oValorGastoInput.getValue() < 0) {
                oValorGastoInput.setValueState("Error");
                oValido = false;

            } else {
                oValorGastoInput.setValueState("None");
            }

            // Validando a moeda
            if (!oMoedaGastoInput.getValue()) {
                oMoedaGastoInput.setValueState("Error");
                oValido = false;
            } else {

                let oMoedaCheck = oView.getModel("Moedas").getData().filter(item => [oMoedaGastoInput.getValue()].includes(item.code));

                if (oMoedaCheck.length == 0) {
                    oMoedaGastoInput.setValueState("Error");
                    oValido = false;
                } else {
                    oMoedaGastoInput.setValueState("None");
                }
            }

            // Validando a data (DatePicker)
            if (!oDataGastoPicker.getValue()) {
                oDataGastoPicker.setValueState("Error");
                oValido = false;
            } else {
                oDataGastoPicker.setValueState("None");
            }

            // Validando o total de parcelas (Input)
            if (!oTotalParcelasInput.getValue()) {
                oTotalParcelasInput.setValueState("Error");
                oValido = false;

            } else if (oTotalParcelasInput.getValue() == 0) {
                oTotalParcelasInput.setValueState("Error");
                oValido = false;

            } else {
                oTotalParcelasInput.setValueState("None");
            }

            // Validando o cartão (Select)
            if (!oCartaoSelect.getSelectedKey()) {
                oCartaoSelect.setValueState("Error");
                oValido = false;
            } else {
                oCartaoSelect.setValueState("None");
            }

            // Caso todos os campos estejam válidos, prosseguir com a lógica
            if (!oValido) {
                sap.m.MessageToast.show("Por favor, preencha todos os campos obrigatórios.");
                oDialog.setBusy(false);
                return;
            }

            if (oGastoFixoCheckBox.getSelected() && oTotalParcelasInput.getValue() > 1) {
                sap.m.MessageToast.show("Quando o gasto é fixo a parcela deve ser igual a 1");
                oDialog.setBusy(false);
                return;
            }

            // Obter os valores do diálogo
            const oDescricao = oView.byId("descricaoGastoInput").getValue();
            const oValor = oView.byId("valorGastoInput").getValue();
            const oMoeda = oView.byId("moedaGastoInput").getValue();
            const sData = oView.byId("dataGastoPicker").getValue();
            const oParcelas = oView.byId("totalParcelasInput").getValue();
            const oGastoFixo = oView.byId("gastoFixoCheckBox").getSelected();
            const oCartao = oView.byId("cartaoSelect").getSelectedKey();

            // Converter a data de DD/MM/YYYY para YYYY-MM-DD
            const partesData = sData.split("/"); // Dividir a data em partes (dia, mês, ano)
            const dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`; // Formatar para YYYY-MM-DD

            var oDate = new Date(sData.split("/").reverse().join("-"));

            // Validar se a data é válida
            if (isNaN(oDate.getTime())) {
                oDataGastoPicker.setValueState("Error");
                sap.m.MessageToast.show("Data inválida. Por favor, insira uma data válida.");
                oDialog.setBusy(false);
                return;
            }

            // Montar o payload para envio
            const oPayload = {
                pessoa: this.getBindingContext().getValue().ID,
                descricao: oDescricao,
                valor: parseFloat(oValor),
                moeda: oMoeda,
                data: dataFormatada,
                parcelas: parseInt(oParcelas, 10),
                gastofixo: oGastoFixo,
                cartao: oCartao,
            };

            let oFunctionName = "adicionarGasto";
            const oFunction = oView.getModel().bindContext(`/${oFunctionName}(...)`);

            oFunction.setParameter("pessoa", oPayload.pessoa);
            oFunction.setParameter("descricao", oPayload.descricao);
            oFunction.setParameter("valor", oPayload.valor);
            oFunction.setParameter("moeda", oPayload.moeda);
            oFunction.setParameter("data", oPayload.data);
            oFunction.setParameter("parcelas", oPayload.parcelas);
            oFunction.setParameter("gastofixo", oPayload.gastofixo);
            oFunction.setParameter("cartao", oPayload.cartao);

            await oFunction.execute()

            oDialog.setBusy(false);
            const oContext = oFunction.getBoundContext();

            let sucesso = oContext.getProperty("sucesso")

            if (sucesso) {

                oDescricaoGastoInput.setValue("");
                oValorGastoInput.setValue(0.00);

                oDataGastoPicker.setValue("");

                oTotalParcelasInput.setValue(1);
                oGastoFixoCheckBox.setSelected(false);

                let oTabelas = sap.ui.core.Element.registry.filter(function (oControl) {
                    return oControl.isA("sap.m.Table") && oControl.getId().includes("innerTable");
                });

                let oCartoes = oTabelas[0];
                oCartoes.refreshItems()
                const oPessoa = this.getBindingContext();
                oPessoa.refresh()

                let oVBoxsFaturaAtual = sap.ui.core.Element.registry.filter(function (oControl) {
                    return oControl.isA("sap.m.VBox") && oControl.getId().includes("FaturaAtualVBox");
                });                    

                if (oVBoxsFaturaAtual.length) {

                    let oVBoxFaturaAtual = oVBoxsFaturaAtual[0];

                    oVBoxFaturaAtual.getBindingContext().refresh();

                }

                oDialog.close();

                sap.m.MessageToast.show("Gasto adicionado com sucesso!");

            }

        },

        onValueHelpRequest: function (oEvent) {
            var oView = this.getParent().getParent().getParent().getParent()

            // Criar o ValueHelpDialog, se ainda não existir
            if (!this._oValueHelpDialog) {
                this._oValueHelpDialog = new ValueHelpDialog({
                    title: "Selecione a Moeda",
                    supportMultiselect: false, // Permitir apenas uma seleção
                    key: "code", // Chave principal
                    width: "200px",
                    descriptionKey: "descr", // Chave para descrição
                    supportRanges: false, // Desativa a seleção por intervalos
                    filterMode: true, // Habilita o modo de filtro
                    basicSearchText: "", // Texto de busca inicial vazio
                    ok: function (oEvent) {
                        // Obter o item selecionado
                        var aTokens = oEvent.getParameter("tokens");
                        if (aTokens.length > 0) {
                            var sSelectedKey = aTokens[0].getKey();
                            // Atualizar o campo Input com o valor selecionado
                            oView.byId("moedaGastoInput").setValue(sSelectedKey);
                        }
                        this._oValueHelpDialog.close();
                    }.bind(this),
                    cancel: function () {
                        this._oValueHelpDialog.close();
                    }.bind(this)
                });

                // Configurar o campo de busca
                this._oValueHelpDialog.setFilterBar(
                    new sap.ui.comp.filterbar.FilterBar({
                        basicSearch: new sap.m.SearchField({
                            placeholder: "Buscar...",
                            liveChange: function (oEvent) {
                                var sQuery = oEvent.getParameter("newValue");

                                // Criar filtros baseados na busca
                                var oFilter = new Filter({
                                    filters: [
                                        new Filter("code", FilterOperator.Contains, sQuery),
                                        new Filter("name", FilterOperator.Contains, sQuery)
                                    ],
                                    and: false
                                });

                                // Aplicar o filtro na tabela
                                oTable.getBinding("rows").filter(oFilter);
                            }
                        })
                    })
                );

                // Configurar o modelo no ValueHelpDialog
                var oTable = this._oValueHelpDialog.getTable();
                oTable.setModel(oView.getModel("Moedas"));
                oTable.bindRows("Moedas>/"); // Vincular dados ao diálogo

                // Adicionar colunas ao ValueHelpDialog
                oTable.addColumn(
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "Código" }),
                        template: new sap.m.Text({ text: "{Moedas>code}" })
                    })
                );
                oTable.addColumn(
                    new sap.ui.table.Column({
                        label: new sap.m.Label({ text: "Descrição" }),
                        template: new sap.m.Text({ text: "{Moedas>descr}" })
                    })
                );

                // Adicionar o ValueHelpDialog como dependente da View
                oView.addDependent(this._oValueHelpDialog);
            }

            // Abrir o ValueHelpDialog
            this._oValueHelpDialog.open();
        }
    };
});
