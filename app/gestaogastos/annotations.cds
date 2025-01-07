using GestaoGastos as service from '../../srv/gestao_gastos_srv';

annotate service.Pessoa with @(
    UI.LineItem                    : [
        {
            $Type: 'UI.DataField',
            Value: Imagem,
            Label: 'Imagem',
        },
        {
            $Type: 'UI.DataField',
            Value: Nome,
            Label: '{i18n>Nome}',
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
            Label : 'Dados',
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
                ![@UI.Hidden],
            },
            {
                $Type: 'UI.DataField',
                Value: Telefone,
                Label: '{i18n>Telefone}',
                ![@UI.Hidden],
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
        ImageUrl      : Imagem,
        TypeName      : '',
        TypeNamePlural: '',
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
            Label: '{i18n>Imagem}',
        },
        {
            $Type: 'UI.DataField',
            Value: NomeCartao,
            Label: '{i18n>NomeDoCartao}',
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
        },
        {
            $Type: 'UI.DataField',
            Value: ValorFaturaParaPagamento,
            Label: '{i18n>ValorFaturaParaPagamento}',
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
        },
        {
            $Type: 'UI.DataField',
            Value: Mes,
            Label: '{i18n>Mes}',
        },
        {
            $Type: 'UI.DataField',
            Value: ValorTotal,
            Label: '{i18n>ValorTotal}',
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
            $Type : 'UI.DataField',
            Value : Parcela,
            Label : 'Parcela',
        },
        {
            $Type: 'UI.DataField',
            Value: ParcelasTotais,
            Label: '{i18n>ParcelasTotais}',
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
                Value: ParcelaParaPagamento,
                Label: '{i18n>ParcelaParaPagamento}',
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
