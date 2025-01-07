const cds = require('@sap/cds');
const axios = require('axios');
const { cache } = require('@sap/cds/lib/compile/resolve');
const { fetch } = require('@sap/cds/lib/plugins');
const { IdentityService } = require('@sap/xssec');

class GestaoGastos extends cds.ApplicationService {

    init() {

        const { Pessoa, Cartao, Transacao } = this.entities;

        this.after("READ", Pessoa, this.afterReadPessoa);

        this.before("UPDATE", Pessoa.drafts, this.beforeUpdatePessoa);

        this.after("READ", Cartao, this.afterReadCartao);

        this.before("CREATE", Transacao, this.beforeCreateUpdateDeleteTransacao);

        this.on("DELETE", Transacao.drafts, this.beforeCreateUpdateDeleteTransacao);

        this.after("UPDATE", Transacao.drafts, this.beforeCreateUpdateDeleteTransacao);

        this.on("simulaPorMesAno", this.simulaPorMesAno);

        this.on("adicionarGasto", this.adicionarGasto);

        this.on("excluirTransacao", this.excluirTransacao);

        return super.init();
    }

    async afterReadPessoa(data) {

        const pessoas = Array.isArray(data) ? data : [data];

        for (const pessoa of pessoas) {

            const oGastos = await this.selecionaGastosPorPessoa(pessoa.ID);

            pessoa.TotalDeGastos = oGastos.totalDeGastos;
            pessoa.TotalDeGastos = parseFloat(pessoa.TotalDeGastos.toFixed(2));
            pessoa.TotalDoMes = oGastos.totalDoMes;
            pessoa.TotalDoMes = parseFloat(pessoa.TotalDoMes.toFixed(2));
            pessoa.ValorAEconomizar = pessoa.TotalDoMes - pessoa.ObjetivoDeGasto;
            pessoa.ValorAEconomizar = parseFloat(pessoa.ValorAEconomizar.toFixed(2));
            pessoa.TotalDoMesEmAberto = oGastos.totalDoMesEmAberto;
            pessoa.TotalDoMesEmAberto = parseFloat(pessoa.TotalDoMesEmAberto.toFixed(2));
            pessoa.TotalDoMesFechado = oGastos.totalDoMesFechado;
            pessoa.TotalDoMesFechado = parseFloat(pessoa.TotalDoMesFechado.toFixed(2));
            pessoa.TotalDoMesPago = oGastos.totalDoMesPago;
            pessoa.TotalDoMesPago = parseFloat(pessoa.TotalDoMesPago.toFixed(2));

            if(pessoa.TotalDoMes > pessoa.ObjetivoDeGasto){
                pessoa.CriticidadeDoMes = 1;
            }else{
                pessoa.CriticidadeDoMes = 3;
            }

            if(pessoa.TotalDoMesEmAberto > pessoa.ObjetivoDeGasto){
                pessoa.CriticidadeEmAberto = 1;
            }else{
                pessoa.CriticidadeEmAberto = 3;
            }
        }
    }


    async beforeUpdatePessoa(req) {

        const { Pessoa } = this.entities

        let oPessoa = await SELECT.one.from(Pessoa).where({ ID: req.data.ID });

        if (oPessoa && req.data.Moeda_code) {

            if (oPessoa.Moeda_code != req.data.Moeda_code) {
               req.reject(400, `O valor do campo Moeda não pode ser mudado, pois o mesmo é usado para converter valores de gastos`, 'Moeda_code')
            }
        }

    }

    async selecionaGastosPorPessoa(ID) {

        const { Cartao } = this.entities;

        let oTotalDeGastos = 0.0;
        let oTotalDoMes = 0.0;
        let oTotalDoMesEmAberto = 0.0;
        let oTotalDoMesFechado = 0.0;
        let oTotalDoMesPago = 0.0;

        const dadosCartoes = await SELECT.from(Cartao).where({ Pessoa_ID: ID });

        let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        oDate = oDate.replaceAll(",", " ");
        let [oDay, oMes, oAno] = oDate.split(" ")[0].split("/");

        oDay = Number(oDay);
        oMes = Number(oMes);
        oAno = Number(oAno);

        let oMesSeguinte = oMes;
        let oAnoSeguinte = oAno;

        if (oMes < 12) {
            oMesSeguinte += 1;
        } else {
            oMesSeguinte = 1
            oAnoSeguinte += 1
        }

        for (const cartao of dadosCartoes) {

            const faturas = await this.selecionaFaturasPorCartao(cartao.ID, oAno);

            faturas.forEach(fatura => {

                if (fatura.Ano == oAno && fatura.Mes >= oMes || fatura.Ano > oAno) {
                    oTotalDeGastos += Number(fatura.ValorTotal)
                    if (fatura.Mes == oMes && fatura.Ano == oAno) {
                        oTotalDoMes += Number(fatura.ValorTotal);
                        if (cartao.DiaFechamento > oDay)
                            oTotalDoMesEmAberto += Number(fatura.ValorTotal)
                        else if (cartao.DiaFechamento <= oDay && cartao.DiaVencimento >= oDay)
                            oTotalDoMesFechado += Number(fatura.ValorTotal)
                        else
                            oTotalDoMesPago += Number(fatura.ValorTotal)
                    } else if (fatura.Ano == oAnoSeguinte && fatura.Mes == oMesSeguinte && cartao.DiaFechamento <= oDay) {
                        oTotalDoMesEmAberto += Number(fatura.ValorTotal)
                    }
                }

            });

        };

        return {
            totalDeGastos: oTotalDeGastos,
            totalDoMes: oTotalDoMes,
            totalDoMesEmAberto: oTotalDoMesEmAberto,
            totalDoMesFechado: oTotalDoMesFechado,
            totalDoMesPago: oTotalDoMesPago
        };

    }

    async selecionaFaturasPorCartao(ID, Ano) {

        const { Fatura } = this.entities;

        const faturas = await SELECT.from(Fatura).where({
            Cartao_ID: ID,
            Ano: { '>=': Ano }
        });

        return faturas;

    }

    async afterReadCartao(data) {

        const cartoes = Array.isArray(data) ? data : [data];

        let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        oDate = oDate.replaceAll(",", " ");
        let [oDay, oMes, oAno] = oDate.split(" ")[0].split("/");

        oDay = Number(oDay);
        oMes = Number(oMes);
        oAno = Number(oAno);

        let oMesSeguinte = oMes;
        let oAnoSeguinte = oAno;

        if (oMes < 12) {
            oMesSeguinte += 1;
        } else {
            oMesSeguinte = 1
            oAnoSeguinte += 1
        }

        for (const cartao of cartoes) {

            let oTotalDeGastos = 0.0;
            let oTotalDoMes = 0.0;
            let oTotalDoMesEmAberto = 0.0;
            let oTotalDoMesFechado = 0.0;

            const faturas = await this.selecionaFaturasPorCartao(cartao.ID, oAno);

            faturas.forEach(fatura => {

                if (fatura.Ano == oAno && fatura.Mes >= oMes || fatura.Ano > oAno) {
                    oTotalDeGastos += Number(fatura.ValorTotal)
                    if (fatura.Mes == oMes && fatura.Ano == oAno) {
                        oTotalDoMes += Number(fatura.ValorTotal);
                        if (cartao.DiaFechamento > oDay)
                            oTotalDoMesEmAberto += Number(fatura.ValorTotal)
                        else
                            oTotalDoMesFechado += Number(fatura.ValorTotal)
                    } else if (fatura.Ano == oAnoSeguinte && fatura.Mes == oMesSeguinte && cartao.DiaFechamento <= oDay) {
                        oTotalDoMesEmAberto += Number(fatura.ValorTotal)
                    }
                }

            });

            cartao.LimiteDisponivel = cartao.Limite - oTotalDeGastos;
            cartao.ValorFaturaEmAberto = oTotalDoMesEmAberto;
            if (cartao.DiaFechamento > oDay)
                cartao.ValorFaturaParaPagamento = cartao.ValorFaturaEmAberto
            else
                cartao.ValorFaturaParaPagamento = oTotalDoMesFechado

        }

    }

    async beforeCreateUpdateDeleteTransacao(data, req) {

        const transacoes = Array.isArray(data) ? data : [data];

        const { Fatura, Transacao } = this.entities;

        for (const transacao of transacoes) {

            if (req.event == 'UPDATE' && 'Valor' in transacao) {

                const transacao_old = await SELECT.one.from(Transacao).where({ ID: transacao.ID });

                if (transacao_old) {
                    const oSoma = await SELECT.one`coalesce (sum (Valor),0) as Valor`.from(Transacao.drafts).where({ Fatura_ID: transacao_created.Fatura_ID });
                    const oValorTotal = oSoma

                    await UPDATE(Fatura.drafts, transacao_old.Fatura_ID).with({ ValorTotal: oValorTotal })
                } else {

                    const transacao_created = await SELECT.one.from(Transacao.drafts).where({ ID: transacao.ID });

                    const oSoma = await SELECT.one`coalesce (sum (Valor),0) as Valor`.from(Transacao.drafts).where({ Fatura_ID: transacao_created.Fatura_ID });

                    const oValorTotal = oSoma.Valor;

                    await UPDATE(Fatura.drafts, transacao_created.Fatura_ID).with({ ValorTotal: oValorTotal })

                }

            } else if (data.event) {
                const transacao_old = await SELECT.one.from(Transacao.drafts).where({ ID: transacao.data.ID });

                const oSoma = await SELECT.one`coalesce (sum (Valor),0) as Valor`.from(Transacao.drafts).where({ Fatura_ID: transacao_old.Fatura_ID });

                const oValorTotal = oSoma.Valor - transacao_old.Valor;

                await UPDATE(Fatura.drafts, transacao_old.Fatura_ID).with({ ValorTotal: oValorTotal })

                const res = await req();//Avança próxima exclusão caso haja

                return res

            } else if (req.event == 'CREATE' && 'Valor' in transacao) {
                const fatura = await SELECT.one.from(Fatura.drafts).where({ ID: transacao.Fatura_ID });

                if (fatura) {
                    const oValorTotal = 0.0;
                    if (fatura.ValorTotal)
                        oValorTotal = fatura.ValorTotal + transacao.Valor;
                    else
                        oValorTotal = transacao.Valor

                    await UPDATE(Fatura.drafts, fatura.ID).with({ ValorTotal: oValorTotal })
                }
            }

        }

        return true;

    }

    async simulaPorMesAno(IDPessoa, Mes, Ano) {

        const { Cartao, Pessoa } = this.entities;

        let oTotalDeGastos = 0.0;
        let oTotalDoMes = 0.0;

        const dadosCartoes = await SELECT.from(Cartao).where({ Pessoa_ID: IDPessoa });

        for (const cartao of dadosCartoes) {

            const faturas = await this.selecionaFaturasPorCartao(cartao.ID, Ano);

            faturas.forEach(fatura => {

                if (fatura.Ano == Ano && fatura.Mes >= Mes || fatura.Ano > Ano) {
                    oTotalDeGastos += Number(fatura.ValorTotal)
                    if (fatura.Mes == Mes && fatura.Ano == Ano) {
                        oTotalDoMes += Number(fatura.ValorTotal);
                    }
                }

            });

        };

        let oPessoa = await SELECT.one`coalesce (ObjetivoDeGasto,0) as ObjetivoDeGasto, Moeda_code`.from(Pessoa).where({ ID: IDPessoa });

        let oObjetivoDeGasto = 0.0;
        let oMoeda = 'BRL';
        if (oPessoa) {

            oObjetivoDeGasto = oPessoa.ObjetivoDeGasto;
            oMoeda = oPessoa.Moeda_code;

        }

        return {
            TotalDeGastos: oTotalDeGastos,
            TotalDoMes: oTotalDoMes,
            ValorAEconomizar: oTotalDoMes - oObjetivoDeGasto,
            Moeda_code: oMoeda
        }
    }

    async adicionarGasto(pessoa, descricao, valor, moeda, data, parcelas, cartao) {

        const { Pessoa, Fatura, Transacao, Cartao } = this.entities

        const oDataGasto = new Date(data);
        const oAnoGasto = oDataGasto.getFullYear();       // Retorna 2025
        const oMesGasto = Number(String(oDataGasto.getMonth() + 1).padStart(2, "0")); // Retorna 01 (mês é zero-based)
        const oDiaGasto = Number(String(oDataGasto.getDate()).padStart(2, "0"));

        let oAnoFatura = oAnoGasto;
        let oMesFatura = oMesGasto;
        let oCartao = await SELECT.one.from(Cartao).where({ ID: cartao });
        let oPessoa = await SELECT.one.from(Pessoa).where({ ID: pessoa });

        if (!oPessoa) {
            return;
        }

        //Realiza cálculo de cotação se necessário
        if (moeda != oPessoa.Moeda_code) {

            try {
                const response = await axios.get(`https://economia.awesomeapi.com.br/json/last/${moeda}-${oPessoa.Moeda_code}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                let oCotacao = response.data[`${moeda}${oPessoa.Moeda_code}`];

                valor = valor * oCotacao.bid;

            } catch (err) {
                let a = err
            }

        }

        if (oCartao.DiaFechamento <= oDiaGasto) {

            if (oMesFatura == 12) {
                oMesFatura = 1;
                oAnoFatura += 1;
            } else {
                oMesFatura += 1;
            }

        }

        try {

            let oParcela = 0;
            let oValor = Math.round(((valor / parcelas) + Number.EPSILON) * 100) / 100;
            let oIdentificadorGasto = this.generateUUID();
            let oFatura = await this.recuperaFatura(oAnoFatura, oMesFatura, oValor, oPessoa.Moeda_code, cartao);
            do {

                oParcela += 1;

                if (oParcela > 1) {

                    if (oMesFatura == 12) {
                        oMesFatura = 1;
                        oAnoFatura += 1;
                    } else {
                        oMesFatura += 1;
                    }

                    oFatura = await this.recuperaFatura(oAnoFatura, oMesFatura, oValor, oPessoa.Moeda_code, cartao);
                }

                let oNovaTransacao = {
                    Identificador: oIdentificadorGasto,
                    Data: data,
                    Valor: oValor,
                    Moeda_code: oPessoa.Moeda_code,
                    ParcelasTotais: parcelas,
                    Parcela: oParcela,
                    Descricao: descricao,
                    //ParcelaParaPagamento: ,
                    Fatura_ID: oFatura.ID,
                }

                let oTransacao = await this.criaTransacao(oNovaTransacao);

                await this.atualizaValorFatura(oFatura.ID);

            } while (oParcela < parcelas);

            return {
                sucesso: true
            }

        } catch (err) {

        }

    }

    async recuperaFatura(Ano, Mes, ValorTotal, Moeda_code, Cartao_ID) {

        const { Fatura } = this.entities

        let oFatura = await SELECT.one.from(Fatura).where({
            Ano: Ano,
            Mes: Mes,
            Cartao_ID: Cartao_ID
        });

        if (!oFatura) {

            oFatura = await this.criaFatura(Ano, Mes, ValorTotal, Moeda_code, Cartao_ID);

        }

        return oFatura;

    }

    async criaFatura(Ano, Mes, ValorTotal, Moeda, Cartao_ID) {

        const { Fatura } = this.entities;

        let oDescription = '';

        switch (Mes) {
            case 1:
                oDescription = `Janeiro`
                break;
            case 2:
                oDescription = `Fevereiro`
                break;
            case 3:
                oDescription = `Março`
                break;
            case 4:
                oDescription = `Abril`
                break;
            case 5:
                oDescription = `Maio`
                break;
            case 6:
                oDescription = `Junho`
                break;
            case 7:
                oDescription = `Julho`
                break;
            case 8:
                oDescription = `Agosto`
                break;
            case 9:
                oDescription = `Setembro`
                break;
            case 10:
                oDescription = `Outubro`
                break;
            case 11:
                oDescription = `Novembro`
                break;
            case 12:
                oDescription = `Dezembro`
                break;
            default:
                break;
        }

        let novaFatura = {
            Ano: Ano,
            Mes: Mes,
            Descricao: oDescription,
            ValorTotal: ValorTotal,
            Moeda_code: Moeda,
            Cartao_ID: Cartao_ID
        }

        const oFaturaCreate = await INSERT.into(Fatura).entries([novaFatura]);

        // Recupera o ID da fatura recém-criada
        const oFatura = await SELECT.one.from(Fatura).where({ Ano: Ano, Mes: Mes, Cartao_ID: Cartao_ID });

        return oFatura;
    }

    async criaTransacao(transacao) {

        const { Transacao } = this.entities;

        const oTransacaoCreate = await INSERT.into(Transacao).entries([transacao]);

        const oTransacao = await SELECT.one.from(Transacao).orderBy({ createdAt: "desc" }).limit(1)

        return oTransacao;
    }

    async atualizaValorFatura(Fatura_ID) {

        const { Fatura, Transacao } = this.entities;

        const oSoma = await SELECT.one`coalesce (sum (Valor),0) as Valor`.from(Transacao).where({ Fatura_ID: Fatura_ID });

        const oValorTotal = parseFloat(oSoma.Valor.toFixed(2));//Math.round((oSoma + Number.EPSILON) * 100) / 100;

        await UPDATE(Fatura, Fatura_ID).with({ ValorTotal: oValorTotal })

    }

    async excluirTransacao(fatura, transacao, identificador, excluirRelacionadas) {

        const { Transacao, Fatura } = this.entities

        try {

            if (!excluirRelacionadas) {

                await DELETE.from(Transacao).where({ ID: transacao });
                await this.atualizaValorFatura(fatura);

            } else {

                let oFaturas = await SELECT`Fatura_ID`.from(Transacao).where({ Identificador: identificador });

                await DELETE.from(Transacao).where({ Identificador: identificador });

                for (const fatura of oFaturas) {

                    await this.atualizaValorFatura(fatura.Fatura_ID);

                }

            }

            return {
                sucesso: true
            }

        } catch (err) {

        }

    }

    generateUUID() {
        return cds.utils.uuid();
    }
}


module.exports = GestaoGastos
