using GestaoGastos as service from '../../srv/gestao_gastos_srv';
<<<<<<< HEAD
using from '../../db/entidades';

=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a

annotate service.Pessoa with @(
    UI.LineItem                    : [
        {
            $Type: 'UI.DataField',
            Value: Imagem,
            Label: ' ',
            ![@UI.Importance] : #High,
<<<<<<< HEAD
            ![@UI.Hidden],
=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
        },
        {
            $Type: 'UI.DataField',
            Value: Nome,
            Label: '{i18n>Nome}',
            ![@UI.Importance] : #High,
        },
        {
            $Type: 'UI.DataField',
            Value: Renda,
            Label: '{i18n>Renda}',
        },
        {
            $Type: 'UI.DataField',
            Value: TotalDeGastos,
            Label: '{i18n>TotalDeGastos}',
        },
        {
            $Type: 'UI.DataField',
            Value: TotalDoMes,
            Label: '{i18n>TotalDoMes}',
            Criticality : CriticidadeDoMes,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : TotalDoMesEmAberto,
<<<<<<< HEAD
            Label : 'Total Em Aberto',
=======
            Label : 'TotalDoMesEmAberto',
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
            Criticality : CriticidadeEmAberto,
        },
        {
            $Type: 'UI.DataField',
            Value: ObjetivoDeGasto,
            Label: '{i18n>ObjetivoDeGasto}',
        },
        {
            $Type: 'UI.DataField',
            Value: ValorAEconomizar,
            Label: '{i18n>ValorEconomizar}',
        },
    ],
    UI.Facets                      : [
        {
            $Type : 'UI.CollectionFacet',
<<<<<<< HEAD
=======
            Label : 'Dados',
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
            ID    : 'Dados',
            Facets: [
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Dados Gerais',
                    ID    : 'DadosGerais1',
                    Target: '@UI.FieldGroup#DadosGerais1',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Dados Financeiros',
                    ID    : 'DadosFinanceiros',
                    Target: '@UI.FieldGroup#DadosFinanceiros',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : '{i18n>Estatisticas}',
                    ID    : 'i18nEstatisticas',
                    Target: '@UI.FieldGroup#i18nEstatisticas',
                },
            ],
        },
        {
            $Type : 'UI.ReferenceFacet',
<<<<<<< HEAD
            Label : 'Categorias',
            ID : 'Categorias1',
            Target : 'Categoria/@UI.LineItem#Categorias1',
        },
        {
            $Type : 'UI.ReferenceFacet',
=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
            Label : '{i18n>Cartes}',
            ID    : 'i18nCartes',
            Target: 'Cartao/@UI.LineItem#i18nCartes',
        },
    ],
    UI.FieldGroup #DadosGerais     : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: Email,
                Label: 'Email',
            },
            {
                $Type: 'UI.DataField',
                Value: Telefone,
                Label: 'Telefone',
            },
        ],
    },
    UI.FieldGroup #DadosGerais1    : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: Imagem,
                Label: '{i18n>Imagem}',
<<<<<<< HEAD
                ![@UI.Hidden],
=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
            },
            {
                $Type: 'UI.DataField',
                Value: Nome,
                Label: '{i18n>Nome}',
            },
            {
                $Type: 'UI.DataField',
                Value: Email,
                Label: '{i18n>Email}',
            },
            {
                $Type: 'UI.DataField',
                Value: Telefone,
                Label: '{i18n>Telefone}',
            },
        ],
    },
    UI.FieldGroup #DadosFinanceiros: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: Renda,
                Label: '{i18n>Renda}',
                Criticality : 3,
            },
            {
                $Type: 'UI.DataField',
                Value: TotalDoMes,
                Label: '{i18n>TotalDoMes}',
                Criticality : CriticidadeDoMes,
            },
            {
                $Type: 'UI.DataField',
                Value: TotalDeGastos,
                Label: '{i18n>TotalDeGastos}',
            },
            {
                $Type: 'UI.DataField',
                Value: ObjetivoDeGasto,
                Label: '{i18n>ObjetivoDeGasto}',
            },
            {
                $Type: 'UI.DataField',
                Value: ValorAEconomizar,
                Label: '{i18n>ValorEconomizar}',
                Criticality : CriticidadeDoMes,
            },
        ],
    },
    UI.DataPoint #Imagem           : {
        $Type: 'UI.DataPointType',
        Value: Imagem,
        Title: 'Imagem',
    },
    UI.HeaderFacets                : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'Nome',
        Target: '@UI.DataPoint#Nome2',
    },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'TotalDeGastos',
            Target : '@UI.Chart#TotalDeGastos',
        }, ],
    UI.DataPoint #Nome             : {
        $Type: 'UI.DataPointType',
        Value: Nome,
        Title: 'Nome',
    },
    UI.DataPoint #Imagem1          : {
        $Type: 'UI.DataPointType',
        Value: Imagem,
        Title: 'Imagem',
    },
    UI.DataPoint #Nome1            : {
        $Type: 'UI.DataPointType',
        Value: Nome,
        Title: 'Nome',
    },
    UI.DataPoint #Imagem2          : {
        $Type: 'UI.DataPointType',
        Value: Imagem,
        Title: 'Imagem',
    },
    UI.DataPoint #Nome2            : {
        $Type: 'UI.DataPointType',
        Value: Nome,
        Title: 'Nome',
    },
    UI.HeaderInfo                  : {
<<<<<<< HEAD
        TypeName      : 'Pessoa',
        TypeNamePlural: 'Pessoas',
        Title : {
            $Type : 'UI.DataField',
            Value : Nome,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : Email,
        },
        TypeImageUrl : 'sap-icon://account',
=======
        ImageUrl      : Imagem,
        TypeName      : '',
        TypeNamePlural: '',
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
    },
    UI.FieldGroup #i18nEstatisticas: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: TotalDoMesEmAberto,
                Label: '{i18n>TotalDoMsEm}',
                Criticality : CriticidadeEmAberto,
            },
            {
                $Type: 'UI.DataField',
                Value: TotalDoMesFechado,
                Label: '{i18n>TotalDoMesFechado}',
            },
            {
                $Type: 'UI.DataField',
                Value: TotalDoMesPago,
                Label: '{i18n>TotalDoMesPago}',
            },
        ],
    },
    UI.DataPoint #TotalDeGastos : {
        Value : TotalDoMes,
        TargetValue : TotalDeGastos,
    },
    UI.Chart #TotalDeGastos : {
        ChartType : #Donut,
        Title : 'Progresso de pagamento',
        Measures : [
            TotalDeGastos,
        ],
        MeasureAttributes : [
            {
                DataPoint : '@UI.DataPoint#TotalDeGastos',
                Role : #Axis1,
                Measure : TotalDeGastos,
            },
        ],
    },
);

annotate service.Cartao with @(
    UI.LineItem #i18nCartes           : [
        {
            $Type: 'UI.DataField',
            Value: Imagem,
            Label: ' ',
            ![@UI.Importance] : #High,
<<<<<<< HEAD
            ![@UI.Hidden],
=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
        },
        {
            $Type: 'UI.DataField',
            Value: NomeCartao,
            Label: '{i18n>NomeDoCartao}',
            ![@UI.Importance] : #High,
        },
        {
            $Type: 'UI.DataField',
            Value: Limite,
            Label: '{i18n>Limite}',
        },
        {
            $Type: 'UI.DataField',
            Value: LimiteDisponivel,
            Label: '{i18n>LimiteDisponivel}',
        },
        {
            $Type: 'UI.DataField',
            Value: DiaFechamento,
            Label: '{i18n>DiaDeFechamento}',
        },
        {
            $Type: 'UI.DataField',
            Value: DiaVencimento,
            Label: '{i18n>DiaDeVencimento}',
        },
        {
            $Type: 'UI.DataField',
            Value: ValorFaturaEmAberto,
            Label: '{i18n>ValorFaturaEmAberto}',
            ![@UI.Importance] : #High,
        },
        {
            $Type: 'UI.DataField',
            Value: ValorFaturaParaPagamento,
            Label: '{i18n>ValorFaturaParaPagamento}',
            ![@UI.Importance] : #High,
        },
    ],
    UI.DataPoint #Imagem              : {
        $Type: 'UI.DataPointType',
        Value: Imagem,
        Title: '{i18n>Imagem}',
    },
    UI.HeaderFacets                   : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'NomeCartao',
        Target: '@UI.DataPoint#NomeCartao',
    }, ],
    UI.DataPoint #NomeCartao          : {
        $Type: 'UI.DataPointType',
        Value: NomeCartao,
        Title: '{i18n>NomeDoCartao}',
    },
    UI.Facets                         : [
        {
            $Type : 'UI.CollectionFacet',
            Label : '{i18n>Dados}',
            ID    : 'i18nDados',
            Facets: [
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Gerais',
                    ID    : 'Gerais',
                    Target: '@UI.FieldGroup#Gerais',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : '{i18n>Limites}',
                    ID    : 'i18nLimites',
                    Target: '@UI.FieldGroup#i18nLimites',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : '{i18n>Valores}',
                    ID    : 'i18nValores',
                    Target: '@UI.FieldGroup#i18nValores',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : '{i18n>DadosDeControle}',
                    ID    : 'i18nDadosDeControle',
                    Target: '@UI.FieldGroup#i18nDadosDeControle',
                },
            ],
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Faturas}',
            ID    : 'i18nFaturas',
            Target: 'Fatura/@UI.SelectionPresentationVariant#i18nFaturas',
        },
    ],
    UI.FieldGroup #i18nLimites        : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: Limite,
                Label: 'Limite',
            },
            {
                $Type: 'UI.DataField',
                Value: LimiteDisponivel,
                Label: 'LimiteDisponivel',
            },
        ],
    },
    UI.FieldGroup #i18nValores        : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: ValorFaturaEmAberto,
                Label: '{i18n>ValorFaturaEmAberto}',
            },
            {
                $Type: 'UI.DataField',
                Value: ValorFaturaParaPagamento,
                Label: '{i18n>ValorFaturaParaPagamento}',
            },
        ],
    },
    UI.FieldGroup #i18nDadosDeControle: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: createdBy,
            },
            {
                $Type: 'UI.DataField',
                Value: createdAt,
            },
            {
                $Type: 'UI.DataField',
                Value: modifiedBy,
            },
            {
                $Type: 'UI.DataField',
                Value: modifiedAt,
            },
        ],
    },
    UI.FieldGroup #Gerais             : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: Imagem,
                Label: '{i18n>Imagem}',
<<<<<<< HEAD
                ![@UI.Hidden],
=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
            },
            {
                $Type: 'UI.DataField',
                Value: NomeCartao,
                Label: '{i18n>NomeDoCartao}',
            },
            {
                $Type: 'UI.DataField',
                Value: DiaFechamento,
                Label: '{i18n>DiaDeFechamento}',
            },
            {
                $Type: 'UI.DataField',
                Value: DiaVencimento,
                Label: '{i18n>DiaDeVencimento}',
            },
        ],
    },
    UI.HeaderInfo                     : {
<<<<<<< HEAD
        TypeName      : 'Cartão',
        TypeNamePlural: 'Cartões',
        Title : {
            $Type : 'UI.DataField',
            Value : NomeCartao,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : Pessoa.Nome,
        },
        TypeImageUrl : 'sap-icon://credit-card',
    },
);

annotate service.Fatura with @(
    UI: {
        SelectionVariant #atual   : {
            $Type           : 'UI.SelectionVariantType',
            ID              : 'atual',
            Text            : 'Atual',
            Parameters      : [
    
            ],
            FilterExpression: '',
            SelectOptions   : [
                {
                    $Type       : 'UI.SelectOptionType',
                    PropertyName: Ano,
                    Ranges      : [{
                        $Type : 'UI.SelectionRangeType',
                        Sign  : #I,
                        Option: #EQ,
                        Low   : '{i18n>Ano}',
                    }, ],
                },
                {
                    $Type       : 'UI.SelectOptionType',
                    PropertyName: Mes,
                    Ranges      : [{
                        $Type : 'UI.SelectionRangeType',
                        Sign  : #I,
                        Option: #EQ,
                        Low   : '{DiaFechamento}',
                    }, ],
                }
            ],
        },
        SelectionVariant #futuras : {
            $Type           : 'UI.SelectionVariantType',
            ID              : 'futuras',
            Text            : 'Futuras',
            Parameters      : [
    
            ],
            FilterExpression: '',
            SelectOptions   : [{
=======
        ImageUrl      : Imagem,
        TypeName      : '',
        TypeNamePlural: '',
    },
);

annotate service.Fatura with @UI: {
    SelectionVariant #atual   : {
        $Type           : 'UI.SelectionVariantType',
        ID              : 'atual',
        Text            : 'Atual',
        Parameters      : [

        ],
        FilterExpression: '',
        SelectOptions   : [
            {
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
                $Type       : 'UI.SelectOptionType',
                PropertyName: Ano,
                Ranges      : [{
                    $Type : 'UI.SelectionRangeType',
                    Sign  : #I,
                    Option: #EQ,
<<<<<<< HEAD
                    Low   : '2025',
                }, ],
            }, ],
        },
        SelectionVariant #passadas: {
            $Type           : 'UI.SelectionVariantType',
            ID              : 'passadas',
            Text            : 'Passadas',
            Parameters      : [
    
            ],
            FilterExpression: '',
            SelectOptions   : [{
                $Type       : 'UI.SelectOptionType',
                PropertyName: Ano,
=======
                    Low   : '{i18n>Ano}',
                }, ],
            },
            {
                $Type       : 'UI.SelectOptionType',
                PropertyName: Mes,
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
                Ranges      : [{
                    $Type : 'UI.SelectionRangeType',
                    Sign  : #I,
                    Option: #EQ,
<<<<<<< HEAD
                    Low   : '2024',
                }, ],
            }, ],
        }
    },
    UI.HeaderInfo : {
        TypeName : 'Fatura',
        TypeNamePlural : 'Faturas',
        Title : {
            $Type : 'UI.DataField',
            Value : Ano,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : Mes,
        },
        TypeImageUrl : 'sap-icon://customer-financial-fact-sheet',
    },
);
=======
                    Low   : '{DiaFechamento}',
                }, ],
            }
        ],
    },
    SelectionVariant #futuras : {
        $Type           : 'UI.SelectionVariantType',
        ID              : 'futuras',
        Text            : 'Futuras',
        Parameters      : [

        ],
        FilterExpression: '',
        SelectOptions   : [{
            $Type       : 'UI.SelectOptionType',
            PropertyName: Ano,
            Ranges      : [{
                $Type : 'UI.SelectionRangeType',
                Sign  : #I,
                Option: #EQ,
                Low   : '2025',
            }, ],
        }, ],
    },
    SelectionVariant #passadas: {
        $Type           : 'UI.SelectionVariantType',
        ID              : 'passadas',
        Text            : 'Passadas',
        Parameters      : [

        ],
        FilterExpression: '',
        SelectOptions   : [{
            $Type       : 'UI.SelectOptionType',
            PropertyName: Ano,
            Ranges      : [{
                $Type : 'UI.SelectionRangeType',
                Sign  : #I,
                Option: #EQ,
                Low   : '2024',
            }, ],
        }, ],
    }
};
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a

annotate service.Cartao with {
    LimiteDisponivel @Measures.ISOCurrency: Moeda_code
};

annotate service.Cartao with {
    ValorFaturaEmAberto @Measures.ISOCurrency: Moeda_code
};

annotate service.Cartao with {
    ValorFaturaParaPagamento @Measures.ISOCurrency: Moeda_code
};

annotate service.Fatura with @(
    UI.LineItem #i18nFaturas                    : [
        {
            $Type: 'UI.DataField',
            Value: Ano,
            Label: '{i18n>Ano}',
            ![@UI.Importance] : #High,
        },
        {
            $Type: 'UI.DataField',
            Value: Mes,
            Label: '{i18n>Mes}',
            ![@UI.Importance] : #High,
        },
        {
            $Type: 'UI.DataField',
            Value: ValorTotal,
            Label: '{i18n>ValorTotal}',
            ![@UI.Importance] : #High,
        },
    ],
    UI.DataPoint #Ano                           : {
        $Type: 'UI.DataPointType',
        Value: Ano,
        Title: '{i18n>Ano}',
    },
    UI.DataPoint #Mes                           : {
        $Type: 'UI.DataPointType',
        Value: Mes,
        Title: '{i18n>Mes}',
    },
    UI.HeaderFacets                             : [
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'Ano',
            Target: '@UI.DataPoint#Ano',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID    : 'Mes',
            Target: '@UI.DataPoint#Mes',
        },
    ],
    UI.Facets                                   : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Valores}',
            ID    : 'i18nValores',
            Target: '@UI.FieldGroup#i18nValores',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>DadosDeControle}',
            ID    : 'i18nDadosDeControle1',
            Target: '@UI.FieldGroup#i18nDadosDeControle1',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Transaescompras}',
            ID    : 'i18nTransaescompras',
            Target: 'Transacoes/@UI.LineItem#i18nTransaescompras',
        },
    ],
    UI.FieldGroup #i18nValores                  : {
        $Type: 'UI.FieldGroupType',
        Data : [{
            $Type: 'UI.DataField',
            Value: ValorTotal,
            Label: '{i18n>ValorTotal}',
        }, ],
    },
    UI.FieldGroup #i18nDadosDeControle1         : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: createdBy,
            },
            {
                $Type: 'UI.DataField',
                Value: createdAt,
            },
            {
                $Type: 'UI.DataField',
                Value: modifiedBy,
            },
            {
                $Type: 'UI.DataField',
                Value: modifiedAt,
            },
        ],
    },
    UI.FieldGroup #i18nGerais                   : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: Ano,
                Label: '{i18n>Ano}',
            },
            {
                $Type: 'UI.DataField',
                Value: Mes,
                Label: '{i18n>Mes}',
            },
        ],
    },
    UI.SelectionPresentationVariant #i18nFaturas: {
        $Type              : 'UI.SelectionPresentationVariantType',
        PresentationVariant: {
            $Type         : 'UI.PresentationVariantType',
            Visualizations: ['@UI.LineItem#i18nFaturas', ],
            SortOrder     : [
                {
                    $Type     : 'Common.SortOrderType',
                    Property  : Ano,
                    Descending: true,
                },
                {
                    $Type     : 'Common.SortOrderType',
                    Property  : Mes,
                    Descending: true,
                },
            ],
        },
        SelectionVariant   : {
            $Type        : 'UI.SelectionVariantType',
            SelectOptions: [
            ],
        },
    },
    UI.UpdateHidden                             : true,
    UI.DeleteHidden                             : true,
);

annotate service.Transacao with @(
    UI.LineItem #i18nTransaescompras  : [
        {
<<<<<<< HEAD
            $Type : 'UI.DataField',
            Value : Categoria.Imagem,
            Label : ' ',
        },
        {
            $Type : 'UI.DataField',
            Value : Categoria.Nome,
            Label : 'Categoria',
        },
        {
            $Type : 'UI.DataField',
            Value : ValorTotal,
            Label : 'Total',
        },
        {
=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
            $Type: 'UI.DataField',
            Value: Valor,
            Label: '{i18n>Valor}',
            ![@UI.Importance] : #High,
        },
        {
            $Type: 'UI.DataField',
            Value: Descricao,
            Label: '{i18n>Descricao}',
            ![@UI.Importance] : #High,
        },
        {
            $Type: 'UI.DataField',
            Value: Data,
            Label: '{i18n>Data}',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : Parcela,
            Label : 'Parcela',
            ![@UI.Importance] : #High,
        },
        {
            $Type: 'UI.DataField',
            Value: ParcelasTotais,
            Label: '{i18n>ParcelasTotais}',
            ![@UI.Importance] : #High,
        },
    ],
    UI.DataPoint #Valor_Valor         : {
        $Type: 'UI.DataPointType',
        Value: Valor,
        Title: '{i18n>Valor}',
    },
    UI.DataPoint #Descricao           : {
        $Type: 'UI.DataPointType',
        Value: Descricao,
        Title: '{i18n>Descricao}',
    },
    UI.DataPoint #Data                : {
        $Type: 'UI.DataPointType',
        Value: Data,
        Title: '{i18n>Data}',
    },
    UI.HeaderFacets                   : [

    ],
    UI.Facets                         : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>DadosGerais}',
            ID    : 'i18nDadosGerais',
            Target: '@UI.FieldGroup#i18nDadosGerais',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>DadosDeControle}',
            ID    : 'i18nDadosDeControle',
            Target: '@UI.FieldGroup#i18nDadosDeControle',
        },
<<<<<<< HEAD
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Categoria',
            ID : 'Categoria',
            Target : '@UI.FieldGroup#Categoria',
        },
=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
    ],
    UI.FieldGroup #i18nDadosGerais    : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: Valor,
                Label: '{i18n>Valor}',
            },
            {
                $Type: 'UI.DataField',
                Value: Descricao,
                Label: '{i18n>Descricao}',
            },
            {
                $Type: 'UI.DataField',
                Value: Data,
                Label: '{i18n>Data}',
            },
            {
                $Type: 'UI.DataField',
                Value: ParcelasTotais,
                Label: '{i18n>ParcelasTotais}',
            },
        ],
    },
    UI.FieldGroup #i18nDadosDeControle: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: createdBy,
            },
            {
                $Type: 'UI.DataField',
                Value: createdAt,
            },
            {
                $Type: 'UI.DataField',
                Value: modifiedBy,
            },
            {
                $Type: 'UI.DataField',
                Value: modifiedAt,
            },
        ],
    },
    UI.UpdateHidden                   : true,
    UI.DeleteHidden                   : true,
<<<<<<< HEAD
    UI.HeaderInfo : {
        TypeName : 'Trasação',
        TypeNamePlural : 'Transações',
        Title : {
            $Type : 'UI.DataField',
            Value : Descricao,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : Data,
        },
        TypeImageUrl : 'sap-icon://customer-financial-fact-sheet',
    },
    UI.FieldGroup #Categoria : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : Categoria.Imagem,
                Label : 'Imagem',
            },
            {
                $Type : 'UI.DataField',
                Value : Categoria.Nome,
                Label : 'Nome',
            },
        ],
    },
=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
);

annotate service.Transacao with {
    Valor @Measures.ISOCurrency: Moeda_code
};


annotate service.Fatura with {
    ValorTotal @Measures.ISOCurrency: Moeda_code
};

annotate service.Pessoa with {
    TotalDoMes @Measures.ISOCurrency: Moeda_code
};

annotate service.Pessoa with {
    TotalDeGastos @Measures.ISOCurrency: Moeda_code
};

annotate service.Pessoa with {
    ObjetivoDeGasto @Measures.ISOCurrency: Moeda_code
};

annotate service.Pessoa with {
    ValorAEconomizar @Measures.ISOCurrency: Moeda_code
};

annotate service.Pessoa with {
    Renda @Measures.ISOCurrency: Moeda_code
};

annotate service.Cartao with {
    Limite @Measures.ISOCurrency: Moeda_code
};

annotate service.Pessoa with {
    TotalDoMesEmAberto @Measures.ISOCurrency: Moeda_code
};

annotate service.Pessoa with {
    TotalDoMesFechado @Measures.ISOCurrency: Moeda_code
};

annotate service.Pessoa with {
    TotalDoMesPago @Measures.ISOCurrency: Moeda_code
};

annotate service.Fatura @(Common.SideEffects #ReactonItemCreationOrDeletion: {
    SourceEntities  : [Transacoes],
    TargetProperties: ['ValorTotal']
});

annotate service.Fatura with {
    Mes @Common.Text: Descricao
};
<<<<<<< HEAD
annotate service.Categoria with @(
    UI.LineItem #Categorias : [
        {
            $Type : 'UI.DataField',
            Value : Imagem,
            Label : 'Imagem',
        },
        {
            $Type : 'UI.DataField',
            Value : Nome,
            Label : 'Nome',
        },
    ],
    UI.LineItem #Categorias1 : [
        {
            $Type : 'UI.DataField',
            Value : Imagem,
            Label : 'Imagem',
        },
        {
            $Type : 'UI.DataField',
            Value : Nome,
            Label : 'Nome',
        },
    ],
);

annotate service.Transacao with {
    ValorTotal @Measures.ISOCurrency : Moeda_code
};

=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
