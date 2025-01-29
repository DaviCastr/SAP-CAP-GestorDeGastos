sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
], function (MessageToast, JSONModel) {
    'use strict';

    return {
        onUploadImage: async function () {
            const oFileUploader = this.byId("FileUploadDetails");
            const oPath = this._view.getBindingContext().getPath();
            const oPessoa = this._view.getBindingContext().getObject();
            const aFiles = oFileUploader.oFileUpload.files;
            const oFile = aFiles[0];

            let getSecurityToken = async function () {
                return await new Promise((resolve, reject) => {

                    fetch("/Gerenciamento", {
                        method: "GET",
                        headers: {
                            "X-CSRF-Token": "Fetch"
                        }
                    })
                        .then(function (response) {
                            if (!response.ok) {
                                throw new Error("Erro ao obter CSRF Token");
                            }
                            return response;
                        }.bind(this))
                        .then(function (response) {
                            const csrfToken = response.headers.get("X-CSRF-Token");
                            return csrfToken;
                        }.bind(this)).then(function (csrfToken) { resolve(csrfToken) }).catch((erro) => { reject(erro) });
                });
            }

            oFileUploader.removeAllHeaderParameters();

            let oToken = await getSecurityToken();

            oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                name: "x-csrf-token",
                value: oToken
            }));

            var oETagHeader = new sap.ui.unified.FileUploaderParameter({
                name: "If-Match",
                value: oPessoa["@odata.etag"] || "*" // Use "*" para ignorar a validação de ETag (se permitido)
            });

            oFileUploader.insertHeaderParameter(oETagHeader);

            var oContentType = new sap.ui.unified.FileUploaderParameter({
                name: "Content-Type",
                value: oFile.type
            });

            oFileUploader.insertHeaderParameter(oContentType);

            const oUrlBaseUpload = "/Gerenciamento";
            oFileUploader.setUploadUrl(`${oUrlBaseUpload}${oPath}/Imagem`);
            oFileUploader.setSendXHR(true);

            const uploadPromise = new Promise((resolve, reject) => {
                this.uploadPromises = this.uploadPromises || {};
                this.uploadPromises[oFileUploader.getId()] = {
                    resolve: resolve,
                    reject: reject
                };
                oFileUploader.upload();
            });
            this.editFlow.syncTask(uploadPromise);

        },

        onUploadCompleto: async function (oEvent) {

            try {

                const oModel = this.getModel();
                const oResponse = oEvent.getParameter("responseRaw");
                const oStatus = oEvent.getParameter("status");
                const oFileUploader = oEvent.getSource()
                const aFiles = oFileUploader.oFileUpload.files;
                const oFile = aFiles[0];
                const oAvatar = this.byId("avatarImagemPessoa");

                var oProgressBar = this.byId("uploadImagemPessoa");
                oProgressBar.setPercentValue(0);
                oProgressBar.setDisplayValue("0%");
                oProgressBar.setVisible(false);

                if (oStatus != 204) {

                    let oErro = JSON.parse(oResponse)

                    MessageToast.show(`Erro:${oErro.error.message}-${oErro.error.target}`);

                } else {

                    if (oFile) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const oBase64File = e.target.result;//.split(",")[1];
                            oAvatar.setSrc(oBase64File);
                            let oDados = this._view.getBindingContext().getObject().ID;
                            let oAvatarLista = sap.ui.core.Element.registry.filter(function (oControl) {
                                return oControl.isA("sap.m.Avatar") && oControl.getBadgeTooltip().includes(oDados);
                            });

                            if (oAvatarLista.length > 0) {
                                oAvatarLista[0].setSrc(oBase64File);
                            }

                            let oTabelaCartoes = sap.ui.core.Element.registry.filter(function (oControl) {
                                return oControl.isA("sap.m.Table") && oControl.getId().includes("Cartes-innerTable");
                            });

                            if(oTabelaCartoes.lehngth>0){
                                oTabelaCartoes[0].getModel().refreash()
                            }

                            MessageToast.show("Imagem carregada com sucesso.");
                        };
                        reader.readAsDataURL(oFile);
                    }

                }

            } catch (error) {
                MessageToast.show("Erro desconhecido:" + error);
            }

        },

        onUploadProgresso(oEvent) {

            // Obtém os dados do progresso
            var oUploaded = oEvent.getParameter("loaded"); // Bytes já carregados
            var oTotal = oEvent.getParameter("total"); // Tamanho total em bytes

            // Calcula o progresso em porcentagem
            var oProgress = Math.round((oUploaded / oTotal) * 100);

            // Atualiza a barra de progresso
            var oProgressBar = this.byId("uploadImagemPessoa");
            oProgressBar.setVisible(true); // Exibe a barra durante o upload
            oProgressBar.setPercentValue(oProgress);
            oProgressBar.setDisplayValue(oProgress + "%");

        },

        onDeleteImage: function () {
            this._view.getBindingContext().setProperty("/Imagem", null);
            MessageToast.show("Imagem excluída.");
        }
    };
});
