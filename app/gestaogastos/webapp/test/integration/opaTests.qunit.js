sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'apps/dflc/gestaogastos/test/integration/FirstJourney',
		'apps/dflc/gestaogastos/test/integration/pages/PessoaList',
		'apps/dflc/gestaogastos/test/integration/pages/PessoaObjectPage',
		'apps/dflc/gestaogastos/test/integration/pages/CartaoObjectPage'
    ],
    function(JourneyRunner, opaJourney, PessoaList, PessoaObjectPage, CartaoObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('apps/dflc/gestaogastos') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThePessoaList: PessoaList,
					onThePessoaObjectPage: PessoaObjectPage,
					onTheCartaoObjectPage: CartaoObjectPage
                }
            },
            opaJourney.run
        );
    }
);