namespace app.entidades;

using {
    Currency,
    cuid,
    managed
} from '@sap/cds/common';

entity Pessoa : cuid, managed {
<<<<<<< HEAD
    Nome                        : String(100)  @mandatory;

    @Core.MediaType               : TipoImagem
    Imagem                      : LargeBinary  @UI: {IsImage: true}  @stream;

    @Core.IsMediaType             : true
    TipoImagem                  : String;

    @Semantics.amount.currencyCode: 'Moeda'
    Renda                       : Decimal      @mandatory;
    Moeda                       : Currency     @mandatory;
    Email                       : String(100)  @mandatory;
    Telefone                    : String(20);

    @Semantics.amount.currencyCode: 'Moeda'
    ObjetivoDeGasto             : Decimal      @mandatory;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual ValorAEconomizar    : Decimal;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual TotalDeGastos       : Decimal;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual TotalDoMes          : Decimal;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual TotalDoMesPago      : Decimal;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual TotalDoMesEmAberto  : Decimal;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual TotalDoMesFechado   : Decimal;

    virtual CriticidadeDoMes    : Integer;
    virtual CriticidadeEmAberto : Integer;

    Categoria                   : Composition of many Categoria
                                      on Categoria.Pessoa = $self;

    Cartao                      : Composition of many Cartao
                                      on Cartao.Pessoa = $self;
}

entity Categoria : cuid, managed {
    Nome       : String(20)            @mandatory;

    @Core.MediaType  : TipoImagem
    Imagem     : LargeBinary           @UI: {IsImage: true}  @stream;

    @Core.IsMediaType: true
    TipoImagem : String;

    Pessoa     : Association to Pessoa @mandatory; // @assert.target

    Transacoes : Association to many Transacao
                     on Transacoes.Categoria = $self;
=======
    Nome                       : String(100)  @mandatory;

    @Core.MediaType               : TipoImagem
    Imagem                     : LargeBinary @UI: {IsImage: true}  @mandatory;

    @Core.IsMediaType             : true
    TipoImagem                 : String;

    @Semantics.amount.currencyCode: 'Moeda'
    Renda                      : Decimal  @mandatory;
    Moeda                      : Currency  @mandatory;
    Email                      : String(100) @mandatory;
    Telefone                   : String(20) @mandatory;

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
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
}

entity Cartao : cuid, managed {

<<<<<<< HEAD
    NomeCartao                       : String(50)            @mandatory;
=======
    NomeCartao                       : String(50) @mandatory;
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a

    @Core.MediaType               : TipoImagem
    @UI                           : {IsImage: true}
    Imagem                           : LargeBinary;

    @Core.IsMediaType             : true
    TipoImagem                       : String;

    @Semantics.amount.currencyCode: 'Moeda'
<<<<<<< HEAD
    Limite                           : Decimal               @mandatory;
    Moeda                            : Currency              @mandatory;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual LimiteDisponivel         : Decimal;
    DiaVencimento                    : Integer               @mandatory; // Dia do vencimento
    DiaFechamento                    : Integer               @mandatory; // Dia do fechamento da fatura
=======
    Limite                           : Decimal  @mandatory;
    Moeda                            : Currency  @mandatory;

    @Semantics.amount.currencyCode: 'Moeda'
    virtual LimiteDisponivel         : Decimal;
    DiaVencimento                    : Integer  @mandatory; // Dia do vencimento
    DiaFechamento                    : Integer  @mandatory; // Dia do fechamento da fatura
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a

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
<<<<<<< HEAD
    Ano          : Integer;
    Mes          : Integer;
    Descricao    : String(255);

    @Semantics.amount.currencyCode: 'Moeda'
    ValorTotal   : Decimal;
    Moeda        : Currency;
    AvisoEnviado : Boolean;
    Cartao       : Association to Cartao @mandatory; //@assert.target
    Transacoes   : Composition of many Transacao
                       on Transacoes.Fatura = $self
=======
    Ano        : Integer;
    Mes        : Integer;
    Descricao  : String(255);

    @Semantics.amount.currencyCode: 'Moeda'
    ValorTotal : Decimal;
    Moeda      : Currency;
    AvisoEnviado: Boolean;
    Cartao     : Association to Cartao @mandatory; //@assert.target
    Transacoes : Composition of many Transacao
                     on Transacoes.Fatura = $self
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
}


entity Transacao : cuid, managed {
<<<<<<< HEAD
    Identificador  : UUID;
    Data           : Date;
    @Semantics.amount.currencyCode: 'Moeda'
    ValorTotal     : Decimal;
    @Semantics.amount.currencyCode: 'Moeda'
    Valor          : Decimal;
    Moeda          : Currency;
    ParcelasTotais : Integer;
    Parcela        : Integer;
    Descricao      : String(255);
    Fatura         : Association to Fatura @mandatory; //@assert.target
    Categoria      : Association to Categoria
}

entity Backup : cuid, managed {
    @Core.MediaType  : TipoBackup
    Backup     : LargeBinary @stream;

    @Core.IsMediaType: true
    TipoBackup : String;
=======
    Identificador                : UUID;
    Data                         : Date;

    @Semantics.amount.currencyCode: 'Moeda'
    Valor                        : Decimal;
    Moeda                        : Currency;
    ParcelasTotais               : Integer;
    Parcela                      : Integer;
    Descricao                    : String(255);

    Fatura                       : Association to Fatura @mandatory; //@assert.target
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
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

<<<<<<< HEAD
annotate Backup with {
    modifiedAt @odata.etag
}

=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
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
<<<<<<< HEAD

type recuperaCategorias {
    pessoa : UUID;
    cartao : UUID;
    fatura : UUID;
    mes    : Integer;
    ano    : Integer;
}

type retornoCategorias {
    Total      :      Decimal;
    Moeda      :      String(3);
    Categorias : many CategoriasTipo;
}

type CategoriasTipo {
    ID             : UUID;
    Nome           : String(20);
    Imagem         : LargeBinary;
    TotalCategoria : Decimal;
}

type retornoTransacoes {
    ID      :      UUID;
    Moeda   :      String;
    Cartoes : many CartoesTipo;
}


type CartoesTipo {
    ID         :      UUID;
    NomeCartao :      String;
    Imagem     :      LargeBinary;
    Faturas    : many FaturasTipo;
}

type FaturasTipo {
    ID         :      UUID;
    Ano        :      Integer;
    Mes        :      Integer;
    Descricao  :      String(255);
    ValorTotal :      Decimal;
    Transacoes : many TransacoesTipo;
}

type TransacoesTipo {
    ID             : UUID;
    Data           : Date;
    ValorTotal     : Decimal;
    Valor          : Decimal;
    ParcelasTotais : Integer;
    Parcela        : Integer;
    Descricao      : String(255);
}
=======
>>>>>>> 7f01fe1936688df1011ce89337a57e281209142a
