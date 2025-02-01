<<<<<<< HEAD
sap.ui.define(["sap/ui/core/Fragment"],function(t){"use strict";return{backup:function(){const i=this.editFlow.getView();if(!this._backupDialog){this._backupDialog=t.load({id:"Backup",name:"apps.dflc.gestaogastos.ext.fragment.Backup"}).then(function(t){i.addDependent(t);return t}.bind(this))}this._backupDialog.then(function(t){t.open()})}}});
=======
sap.ui.define(["sap/m/MessageToast","sap/ui/core/Fragment","sap/ui/model/json/JSONModel"],function(t,e,a){"use strict";return{backup:function(){const t=this.editFlow.getView();if(!this._backupDialog){this._backupDialog=e.load({id:"Backup",name:"apps.dflc.gestaogastos.ext.fragment.Backup"}).then(function(e){t.addDependent(e);return e}.bind(this))}this._backupDialog.then(function(t){t.open()})}}});
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
//# sourceMappingURL=Backup.js.map