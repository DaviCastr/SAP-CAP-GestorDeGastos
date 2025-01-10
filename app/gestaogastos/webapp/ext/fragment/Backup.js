sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/util/File",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (MessageToast, File, Fragment, JSONModel) {
    'use strict';

    return {

        exportarBackup: async function () {

            var oDialogBackup = this.getParent(); 
            var oView = this.getParent().getParent();

            oDialogBackup.close();

            var oDialog = new sap.m.Dialog({
                title: "Exportar Backup",
                type: "Message",
                content: new sap.m.Text({ text: "Gerando backup, aguarde..." })
            });

            oDialog.setBusy(true);
            oDialog.open();

            let oNomeFuncao = 'exportarBackup';
            let oFuncao = oView.getModel().bindContext(`/${oNomeFuncao}(...)`);
            await oFuncao.execute();

            let oContext = oFuncao.getBoundContext();
            let oFile = oContext.getValue("value")

            oDialog.close();

            if (oFile) {

                const fileContent = new Uint8Array(oFile.body.data);
                File.save(fileContent, "backup-gestor-de-gastos", "xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                MessageToast.show("Backup exportado com sucesso!");

            } else {
                MessageToast.show("Erro ao exportar backup!");
            }

        },

        importarBackup: async function () {

            const oView = this.getParent().getParent();
            const oDialog = this.getParent();
            const oFileUploader = Fragment.byId("Backup", "fileUploader");
            const aFiles = oFileUploader.oFileUpload.files;

            sap.ui.core.BusyIndicator.show()

            if (!aFiles || aFiles.length === 0) {
                MessageToast.show("Por favor, selecione um arquivo.");
                sap.ui.core.BusyIndicator.hide()
                return;
            }

            const oFile = aFiles[0];
            const oReader = new FileReader();

            oReader.onload = async (oEvent) => {
                const oBase64File = oEvent.target.result.split(",")[1]; // Captura o conteúdo base64 do arquivo

                try {

                    let oNomeFuncao = 'importarBackup';
                    let oFuncao = oView.getModel().bindContext(`/${oNomeFuncao}(...)`);
                    oFuncao.setParameter("file", oBase64File);
                    await oFuncao.execute();

                    sap.ui.core.BusyIndicator.hide()

                    oDialog.setBusy(false);

                    let oContext = oFuncao.getBoundContext();
                    let oRetorno = oContext.getValue("value")

                    oDialog.close();

                    if (oRetorno) {

                        const oModel = oView.getModel();
                        oModel.refresh();

                        let oTabelasCartoes = sap.ui.core.Element.registry.filter(function (oControl) {
                            return oControl.isA("sap.m.Table") && oControl.getId().includes("innerTable");
                        });

                        let oCartoes = oTabelasCartoes[0];
                        oCartoes.refreshItems()

                        let oVBoxsFaturaAtual = sap.ui.core.Element.registry.filter(function (oControl) {
                            return oControl.isA("sap.m.VBox") && oControl.getId().includes("FaturaAtualVBox");
                        });

                        if (oVBoxsFaturaAtual.length) {

                            let oVBoxFaturaAtual = oVBoxsFaturaAtual[0];

                            oVBoxFaturaAtual.getBindingContext().refresh();

                        }

                        MessageToast.show(oRetorno);

                    } else {
                        MessageToast.show("Erro ao importar backup!");
                    }

                } catch (oError) {
                    MessageToast.show("Erro ao importar o arquivo: " + oError.message);
                }
            };

            oReader.readAsDataURL(oFile); // Lê o arquivo em Base64
        },

        cancelarBackup: function (oEvent) {

            this.getParent().close();

        }
    }

});