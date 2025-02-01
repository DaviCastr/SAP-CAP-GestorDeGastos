sap.ui.define([
	"sap/ui/core/Fragment"
], function (Fragment) {
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
