sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'apps.dflc.gestaogastos',
            componentId: 'CartaoObjectPage',
            contextPath: '/Pessoa/Cartao'
        },
        CustomPageDefinitions
    );
});