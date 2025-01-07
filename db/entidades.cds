namespace app.entidades;

using {
    Currency,
    cuid,
    managed
} from '@sap/cds/common';

entity Pessoa : cuid, managed {
    Nome                       : String(100)  @mandatory;

    @Core.MediaType               : TipoImagem
    Imagem                     : LargeBinary @UI: {IsImage: true}  @mandatory;

    @Core.IsMediaType             : true
    TipoImagem                 : String;

    @Semantics.amount.currencyCode: 'Moeda'
    Renda                      : Decimal  @mandatory;
    Moeda                      : Currency  @mandatory;
    Email                      : String(100);
    Telefone                   : String(20);

    @Semantics.amount.currencyCode: 'Moeda'
    ObjetivoDeGasto            : Decimal  @mandatory;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual ValorAEconomizar   : Decimal;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual TotalDeGastos      : Decimal;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual TotalDoMes         : Decimal;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual TotalDoMesPago     : Decimal;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual TotalDoMesEmAberto : Decimal;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual TotalDoMesFechado  : Decimal;

    virtual CriticidadeDoMes: Integer;

    virtual CriticidadeEmAberto: Integer;

    Cartao                     : Composition of many Cartao
                                     on Cartao.Pessoa = $self
}

entity Cartao : cuid, managed {

    NomeCartao                       : String(50) @mandatory;

    @Core.MediaType               : TipoImagem
    @UI                           : {IsImage: true}
    Imagem                           : LargeBinary;

    @Core.IsMediaType             : true
    TipoImagem                       : String;

    @Semantics.amount.currencyCode: 'Moeda'
    Limite                           : Decimal  @mandatory;
    Moeda                            : Currency  @mandatory;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual LimiteDisponivel         : Decimal;
    DiaVencimento                    : Integer  @mandatory; // Dia do vencimento
    DiaFechamento                    : Integer  @mandatory; // Dia do fechamento da fatura

    @Semantics.amount.currencyCode: 'Moeda'
    virtual ValorFaturaParaPagamento : Decimal;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual ValorFaturaEmAberto      : Decimal;

    Fatura                           : Composition of many Fatura
                                           on Fatura.Cartao = $self;

    Pessoa                           : Association to Pessoa @mandatory; // @assert.target
}

entity Fatura : cuid, managed {
    @orderby                      : {
        Ano: 'desc',
        Mes: 'desc'
    }
    Ano        : Integer;
    Mes        : Integer;
    Descricao  : String(255);

    @Semantics.amount.currencyCode: 'Moeda'
    ValorTotal : Decimal;
    Moeda      : Currency;
    Cartao     : Association to Cartao @mandatory; //@assert.target
    Transacoes : Composition of many Transacao
                     on Transacoes.Fatura = $self
}


entity Transacao : cuid, managed {
    Identificador                : UUID;
    Data                         : Date;

    @Semantics.amount.currencyCode: 'Moeda'
    Valor                        : Decimal;
    Moeda                        : Currency;
    ParcelasTotais               : Integer;
    Parcela                      : Integer;
    Descricao                    : String(255);

    Fatura                       : Association to Fatura @mandatory; //@assert.target
}

//Anotações
annotate Pessoa with {
    modifiedAt @odata.etag
}


annotate Cartao with {
    modifiedAt @odata.etag
}


annotate Fatura with {
    modifiedAt @odata.etag
}

annotate Transacao with {
    modifiedAt @odata.etag
}

type retornoSimulacao {
    TotalDeGastos    : Decimal;
    TotalDoMes       : Decimal;
    ValorAEconomizar : Decimal;
    Moeda            : Currency
}

type Moeda : String;

type retornoBooleano {
    sucesso : Boolean
}
