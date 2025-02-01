sap.ui.define([
<<<<<<< HEAD
	"sap/ui/core/Fragment"
], function (Fragment) {
=======
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function (MessageToast, Fragment, JSONModel) {
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
	'use strict';

	return {

		backup: function () {	

			const oView = this.editFlow.getView();

			if (!this._backupDialog) {
				this._backupDialog = Fragment.load({
					id: "Backup",
					name: "apps.dflc.gestaogastos.ext.fragment.Backup",
					//controller: this
				}).then(function (dialog) {
					oView.addDependent(dialog);
					return dialog;
				}.bind(this));
			}
			this._backupDialog.then(function (dialog) {
				dialog.open();
			});
		}

	};
});
