sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';

    return {

        fechar: function (oEvent) {

            this.getParent().close();

        }

    }

});