using app.entidades as db from '../db/entidades';
using {sap} from '@sap/cds-common-content';

service GestaoGastos @(path: '/Gerenciamento') {

    @cds.redirection.target
    @odata.draft.enabled: true
    @odata.draft.bypass
    entity Pessoa    as projection on db.Pessoa;

    @odata.draft.bypass
    entity Categoria as projection on db.Categoria;

    @odata.draft.bypass
    entity Cartao    as projection on db.Cartao;

    @readonly
    entity Fatura    as projection on db.Fatura;

    @readonly
    entity Transacao as projection on db.Transacao;

    @odata.draft.enabled: false
    entity Backup    as projection on db.Backup;

    @readonly
    entity Languages as projection on sap.common.Languages;

    //Ações utilizadas no fiori/ui5
    action   simulaPorMesAno(pessoa : UUID, mes : Integer, ano : Integer)                                                                                                                  returns db.retornoSimulacao;
    action   adicionarGasto(pessoa : UUID, descricao : String, valor : Decimal, moeda : db.Moeda, data : Date, parcelas : Integer, gastofixo : Boolean, categoria : UUID, cartao : UUID)   returns db.retornoBooleano;
    action   excluirTransacao(fatura : UUID, transacao : UUID, identificador : UUID, excluirRelacionadas : Boolean)                                                                        returns db.retornoBooleano;
    action   exportarBackup(ID : UUID)                                                                                                                                                     returns String;
    action   enviarAviso();
    action   mudarCategoriaTransacao(identificador : UUID, categoria : UUID);
    //Ações utilizadas no sapbuildapps
    function simulaPorMesAnoSB(pessoa : UUID, mes : Integer, ano : Integer)                                                                                                                returns db.retornoSimulacao;
    function adicionarGastoSB(pessoa : UUID, descricao : String, valor : Decimal, moeda : db.Moeda, data : Date, parcelas : Integer, gastofixo : Boolean, categoria : UUID, cartao : UUID) returns db.retornoBooleano;
    function excluirTransacaoSB(fatura : UUID, transacao : UUID, identificador : UUID, excluirRelacionadas : Boolean)                                                                      returns db.retornoBooleano;
    function exportarBackupSB(ID : UUID)                                                                                                                                                   returns String;
    function enviarAvisoSB()                                                                                                                                                               returns db.retornoBooleano;
    function mudarCategoriaTransacaoSB(identificador : UUID, categoria : UUID)                                                                                                             returns db.retornoBooleano;
    function inserirCategoria(ID : UUID, Pessoa_ID : UUID, Nome : String, Usuario : String)                                                                                                returns db.retornoBooleano;
    function modificarCategoria(ID : UUID, Nome : String, Usuario : String)                                                                                                                returns db.retornoBooleano;
    function inserirCartao(ID : UUID, Pessoa_ID : UUID, NomeCartao : String, Limite : Decimal, Moeda : String, DiaVencimento : Integer, DiaFechamento : Integer, Usuario : String)         returns db.retornoBooleano;
    function modificarCartao(ID : UUID, Pessoa_ID : UUID, NomeCartao : String, Limite : Decimal, Moeda : String, DiaVencimento : Integer, DiaFechamento : Integer, Usuario : String)       returns db.retornoBooleano;
    //Ações utilizadas em ambos
    function recuperaCategoriasParaGastoTotal(pessoa : UUID)                                                                                                                               returns db.retornoCategorias;
    function recuperaCategorias(pessoa : UUID, cartao : UUID, fatura : UUID, mes : Integer, ano : Integer)                                                                                 returns db.retornoCategorias;
    function recuperaTransacoesPorCategoria(pessoa : UUID, categoria : UUID, total : Boolean, mes : Integer, ano : Integer)                                                                returns db.retornoTransacoes;


}

annotate GestaoGastos with @requires: [
    'authenticated-user',
    'any'
];
