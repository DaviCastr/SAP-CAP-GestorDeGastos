sap.ui.define([
<<<<<<< HEAD
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
], function (Fragment, JSONModel) {
=======
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (MessageToast, Fragment, JSONModel) {
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
    'use strict';

    return {

        adicionarGasto: function (oEvent) {

<<<<<<< HEAD
            try{

            const oView = this.editFlow.getView();
            const oModel = oView.getModel();

            var securedExecution = function () {

                return new Promise(function(resolve, reject)  {
=======
            const oView = this.editFlow.getView();
            const oModel = oView.getModel();

            var securedExecution = () => {

                return new Promise((resolve, reject) => {
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a

                    try {

                        //Busca Moedas
<<<<<<< HEAD
                        fetch(`${oModel.getServiceUrl()}Currencies`, {
=======
                        fetch(`/Gerenciamento/Currencies`, {
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                            }
                        }).then( async function (data) {

                            console.log(data)

                            let oData = await data.json(); 

                            const oMoedasModel = new JSONModel(oData.value.flat());

                            oView.setModel(oMoedasModel, "Moedas");

                            resolve();
    
                        }.bind(this)).catch(function (error) {
                            sap.m.MessageToast.show("Erro ao chamar serviço de Moedas: " + error);
                            reject();
    
                        });

                        //Serviço de cartões
                        const oPayload = {
                            Pessoa_ID: this.getBindingContext().getObject().ID
                        };
        
<<<<<<< HEAD
                        fetch(`${oModel.getServiceUrl()}Cartao?$filter=Pessoa_ID eq ${oPayload.Pessoa_ID}`, {
=======
                        fetch(`/Gerenciamento/Cartao?$filter=Pessoa_ID eq ${oPayload.Pessoa_ID}`, {
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                            }
                        }).then( async function (data) {

                            console.log(data)

                            let oData = await data.json(); 

                            // Modelo para alimentar os cartões
                            let oCartoes;

                            if(Array.isArray(oData.value))
                                oCartoes = oData.value
                            else 
                                oCartoes = [oData.value]

                            const oCartoesModel = new JSONModel(oCartoes);

                            oView.setModel(oCartoesModel, "Cartoes");

                            // Carregar o fragmento do diálogo
                            if (!this.pDialog) {
                                this.pDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "apps.dflc.gestaogastos.ext.fragment.AdicionarGasto",
                                    //controller: this
                                }).then(function (oDialog) {
                                    oView.addDependent(oDialog);
                                    return oDialog;
                                });
                            }

                            this.pDialog.then(function (oDialog) {
                                oDialog.open();
                            });

                            resolve();
    
                        }.bind(this)).catch(function (error) {
                            sap.m.MessageToast.show("Erro ao chamar serviço: " + error);
                            reject();
    
                        });

                    } catch (oError) {
                        sap.m.MessageToast.show("Erro ao chamar serviço: " + oError.message);
                    }

<<<<<<< HEAD
                }.bind(this));

            }.bind(this)
=======
                });

            }
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a

            let oParameters = {
                busy: {
                    set: true,
                    check: true
                },
                dataloss: {
                    popup: true,
                    navigation: false
                }
            }

            this.editFlow.securedExecution(securedExecution, oParameters).finally((final) => {
                console.log(final)
            });

<<<<<<< HEAD
        } catch (erro) {
            sap.m.MessageToast.show("Erro:" + erro);
        }

=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
        },

    };
});
