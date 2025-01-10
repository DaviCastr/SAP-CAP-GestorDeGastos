sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function (MessageToast, Fragment, JSONModel) {
	'use strict';

	return {

		backup: function () {	

			const oView = this.editFlow.getView();

			if (!this._backupDialog) {
				this._backupDialog = Fragment.load({
					id: "Backup",
					name: "apps.dflc.gestaogastos.ext.fragment.Backup"
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
