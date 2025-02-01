sap.ui.define([
    "apps/dflc/gestaogastos/ext/fragment/AtualizaInformacoesDaTela",
    "sap/ui/core/Fragment",
], function (AtualizaInformacoesDaTela, Fragment) {
    'use strict';

    return {

        formatter: {

            formatDate: function (sDate) {

                if (!sDate) {
                    return "";
                }
                const oDate = new Date(`${sDate}T00:00:00`);
                const dd = String(oDate.getDate()).padStart(2, '0');
                const mm = String(oDate.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
                const yyyy = oDate.getFullYear();

                return `${dd}/${mm}/${yyyy}`; // Ou use '-' em vez de '/'

            }
        },

        mudarCategoria: async function (oEvent) {

            try {

                var oDialog = oEvent.getSource().getParent();
                var oView = this.getParent().getParent();
                var oModel = oView.getModel();
                var oIdentificador = Fragment.byId("MudarCategoria", "identificadorTransacaoParaMudanca").getValue();
                var oSelectNovaCategoria = Fragment.byId("MudarCategoria", "categoriaNovaSelect").getSelectedKey();

                let oFatura = {};

                if (sap.ui.getCore().oFatura) {
                    oFatura = sap.ui.getCore().oFatura
                }else{
                    oFatura = this.getBindingContext()?.getValue() || null;
                }

                if(!oFatura){
                    sap.m.MessageToast.show("Erro ao receuperar informações");
                    return;
                }

                oDialog.setBusy(true)

                let oFunctionName = 'mudarCategoriaTransacao';
                let oFuncao = oModel.bindContext(`/${oFunctionName}(...)`);
                oFuncao.setParameter("identificador", oIdentificador);
                oFuncao.setParameter("categoria", oSelectNovaCategoria);

                await oFuncao.execute();

                let oContext = oFuncao.getBoundContext();

                if (oContext.getValue("sucesso")) {

                    AtualizaInformacoesDaTela.AtualizaInformacoes(oView);
                    
                    sap.m.MessageToast.show("Categoria ajustada com sucesso.");
                    oDialog.setBusy(false);
                    oDialog.close();

                } else {
                    sap.m.MessageToast.show("Erro ao atualizar categoria.");
                    oDialog.setBusy(false);
                }

            } catch (erro) {
                sap.m.MessageToast.show("Erro ao atualizar categoria.");
                oDialog.setBusy(false);
            }

        },

        cancelarMudanca: function (oEvent) {

            this.getParent().close();

        }

    }

});