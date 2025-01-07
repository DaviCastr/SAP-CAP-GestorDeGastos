using app.entidades as db from '../db/entidades';
using {sap} from '@sap/cds-common-content';

service GestaoGastos @(path: '/Gerenciamento') {

    @cds.redirection.target
    @odata.draft.enabled: true
    entity Pessoa    as projection on db.Pessoa;
    entity Cartao    as projection on db.Cartao;
    @readonly
    entity Fatura    as projection on db.Fatura;
    @readonly
    entity Transacao as projection on db.Transacao;

    @readonly
    entity Languages as projection on sap.common.Languages;

    action simulaPorMesAno(pessoa: UUID, mes: Integer, ano: Integer) returns db.retornoSimulacao;

    action adicionarGasto(pessoa: UUID, descricao: String, valor: Decimal, moeda: db.Moeda, data: Date, parcelas: Integer, cartao: UUID) returns db.retornoBooleano;

    action excluirTransacao(fatura: UUID, transacao: UUID, identificador: UUID, excluirRelacionadas: Boolean) returns db.retornoBooleano;
}
