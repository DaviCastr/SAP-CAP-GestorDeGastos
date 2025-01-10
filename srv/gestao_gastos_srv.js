const cds = require('@sap/cds');
const excel = require('exceljs');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const nodemailer = require("nodemailer");

class GestaoGastos extends cds.ApplicationService {

    init() {

        const { Pessoa, Cartao, Transacao } = this.entities;

        this.after("READ", Pessoa, this.afterReadPessoa);

        this.before("UPDATE", Pessoa.drafts, this.beforeUpdatePessoa);

        this.before("UPDATE", Cartao.drafts, this.beforeUpdateCartao);

        this.after("READ", Cartao, this.afterReadCartao);

        this.before("CREATE", Transacao, this.beforeCreateUpdateDeleteTransacao);

        this.on("DELETE", Transacao.drafts, this.beforeCreateUpdateDeleteTransacao);

        this.after("UPDATE", Transacao.drafts, this.beforeCreateUpdateDeleteTransacao);

        this.on("simulaPorMesAno", this.simulaPorMesAno);

        this.on("adicionarGasto", this.adicionarGasto);

        this.on("excluirTransacao", this.excluirTransacao);

        this.on("exportarBackup", this.exportarBackup);

        // Importar Backup
        this.on("importarBackup", this.importarBackup);

        return super.init();
    }

    async afterReadPessoa(data) {

        const pessoas = Array.isArray(data) ? data : [data];

        for (const pessoa of pessoas) {

            const oGastos = await this.selecionaGastosPorPessoa(pessoa.ID);

            pessoa.TotalDeGastos = oGastos.totalDeGastos;
            pessoa.TotalDeGastos = parseFloat((Math.round((pessoa.TotalDeGastos + Number.EPSILON) * 100) / 100));
            pessoa.TotalDoMes = oGastos.totalDoMes;
            pessoa.TotalDoMes = parseFloat((Math.round((pessoa.TotalDoMes + Number.EPSILON) * 100) / 100));
            pessoa.ValorAEconomizar = pessoa.TotalDoMes - pessoa.ObjetivoDeGasto;
            pessoa.ValorAEconomizar = parseFloat((Math.round((pessoa.ValorAEconomizar + Number.EPSILON) * 100) / 100));
            pessoa.TotalDoMesEmAberto = oGastos.totalDoMesEmAberto;
            pessoa.TotalDoMesEmAberto = parseFloat((Math.round((pessoa.TotalDoMesEmAberto + Number.EPSILON) * 100) / 100));
            pessoa.TotalDoMesFechado = oGastos.totalDoMesFechado;
            pessoa.TotalDoMesFechado = parseFloat((Math.round((pessoa.TotalDoMesFechado + Number.EPSILON) * 100) / 100));
            pessoa.TotalDoMesPago = oGastos.totalDoMesPago;
            pessoa.TotalDoMesPago = parseFloat((Math.round((pessoa.TotalDoMesPago + Number.EPSILON) * 100) / 100));

            if (pessoa.TotalDoMes > pessoa.ObjetivoDeGasto) {
                pessoa.CriticidadeDoMes = 1;
            } else {
                pessoa.CriticidadeDoMes = 3;
            }

            if (pessoa.TotalDoMesEmAberto > pessoa.ObjetivoDeGasto) {
                pessoa.CriticidadeEmAberto = 1;
            } else {
                pessoa.CriticidadeEmAberto = 3;
            }

            this.enviarAviso(pessoa);
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

        if (req.data.Renda) {
            if (req.data.Renda < 0) {
                req.reject(400, `O valor da renda não pode ser negativo.`, 'Renda')
            }
        }

        if (req.data.ObjetivoDeGasto) {
            if (req.data.ObjetivoDeGasto < 0) {
                req.reject(400, `O valor do objetivo não pode ser negativo.`, 'ObjetivoDeGasto')
            }
        }

    }

    async beforeUpdateCartao(req) {

        const { Pessoa, Cartao } = this.entities

        let oCartao = await SELECT.one.from(Cartao).where({ ID: req.data.ID });

        if (oCartao) {
            let oPessoa = await SELECT.one.from(Pessoa).where({ ID: oCartao.Pessoa_ID });

            if (oPessoa && req.data.Moeda_code) {

                if (oPessoa.Moeda_code != req.data.Moeda_code) {
                    req.reject(400, `O valor do campo Moeda não pode ser mudado/diferente da moeda da pessoa.`, 'Moeda_code')
                }
            }
        }

        if (req.data.Limite) {
            if (req.data.Limite < 0) {
                req.reject(400, `O valor da renda não pode ser negativo.`, 'Limite')
            }
        }

        if (req.data.DiaFechamento && req.data.DiaVencimento) {
            if (req.data.DiaVencimento - req.data.DiaVencimento < 2) {
                req.reject(400, `O valor do dia de vencimento tem que ter diferença maior de 1 dia da fatura.`, 'DiaVencimento');
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
        let [oDia, oMes, oAno] = oDate.split(" ")[0].split("/");

        oDia = Number(oDia);
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
                        if (cartao.DiaFechamento > oDia)
                            oTotalDoMesEmAberto += Number(fatura.ValorTotal)
                        else if (cartao.DiaFechamento <= oDia && cartao.DiaVencimento >= oDia)
                            oTotalDoMesFechado += Number(fatura.ValorTotal)
                        else
                            oTotalDoMesPago += Number(fatura.ValorTotal)
                    } else if (fatura.Ano == oAnoSeguinte && fatura.Mes == oMesSeguinte && cartao.DiaFechamento <= oDia) {
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
        let [oDia, oMes, oAno] = oDate.split(" ")[0].split("/");

        oDia = Number(oDia);
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
                        if (cartao.DiaFechamento > oDia) {
                            oTotalDoMesEmAberto += Number(fatura.ValorTotal)
                        } else if (cartao.DiaVencimento >= oDia) {
                            oTotalDoMesFechado += Number(fatura.ValorTotal)
                        }
                    } else if (fatura.Ano == oAnoSeguinte && fatura.Mes == oMesSeguinte && cartao.DiaFechamento <= oDia) {
                        oTotalDoMesEmAberto += Number(fatura.ValorTotal)
                    }
                }

            });

            cartao.LimiteDisponivel = (Math.round(((cartao.Limite - oTotalDeGastos) + Number.EPSILON) * 100) / 100);
            cartao.ValorFaturaEmAberto = oTotalDoMesEmAberto;
            if (cartao.DiaFechamento > oDia)
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
            TotalDeGastos: (Math.round((oTotalDeGastos + Number.EPSILON) * 100) / 100),
            TotalDoMes: (Math.round((oTotalDoMes + Number.EPSILON) * 100) / 100),
            ValorAEconomizar: (Math.round(((oTotalDoMes - oObjetivoDeGasto) + Number.EPSILON) * 100) / 100),
            Moeda_code: oMoeda
        }
    }

    async adicionarGasto(pessoa, descricao, valor, moeda, data, parcelas, gastofixo, cartao) {

        const { Pessoa, Fatura, Transacao, Cartao } = this.entities

        const oDataGasto = new Date(`${data}T00:00:00`);
        const oAnoGasto = oDataGasto.getFullYear();      
        const oMesGasto = Number(String(oDataGasto.getMonth() + 1).padStart(2, "0")); 
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

        let oParcelaGastoFixo = 1;

        if (oCartao.DiaFechamento <= oDiaGasto) {

            if (oMesFatura == 12) {
                oMesFatura = 1;
                oAnoFatura += 1;
            } else {
                oMesFatura += 1;
            }

        }

        if (gastofixo) {

            oParcelaGastoFixo = (12 - oMesFatura) + 1;

        }

        try {

            let oParcela = 0;
            let oValor = (Math.round(((valor / parcelas) + Number.EPSILON) * 100) / 100);
            let oDiferenca = (oValor * parcelas) - valor;
            let oValorPrimeiraParcela = (Math.round(((oValor - oDiferenca) + Number.EPSILON) * 100) / 100);
            let oIdentificadorGasto = this.generateUUID();
            let oFatura = await this.recuperaFatura(oAnoFatura, oMesFatura, oValorPrimeiraParcela, oPessoa.Moeda_code, cartao);

            do {
                let oValorParcela = oValorPrimeiraParcela;
                oParcela += 1;

                if (oParcela > 1) {

                    oValorParcela = oValor;

                    if (oMesFatura == 12) {
                        oMesFatura = 1;
                        oAnoFatura += 1;
                    } else {
                        oMesFatura += 1;
                    }

                    oFatura = await this.recuperaFatura(oAnoFatura, oMesFatura, oValorParcela, oPessoa.Moeda_code, cartao);
                }

                let oParcelaTransacao = oParcela;

                if (gastofixo) {
                    oParcelaTransacao = 1
                }

                let oNovaTransacao = {
                    Identificador: oIdentificadorGasto,
                    Data: data,
                    Valor: oValorParcela,
                    Moeda_code: oPessoa.Moeda_code,
                    ParcelasTotais: parcelas,
                    Parcela: oParcelaTransacao,
                    Descricao: descricao,
                    Fatura_ID: oFatura.ID,
                }

                let oTransacao = await this.criaTransacao(oNovaTransacao);

                await this.atualizaValorFatura(oFatura.ID);

            } while (oParcela < parcelas || oParcela < oParcelaGastoFixo);

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

        const oValorTotal = parseFloat((Math.round((oSoma.Valor + Number.EPSILON) * 100) / 100));

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

    async exportarBackup(req) {

        const tx = cds.transaction(req);
        const workbook = new excel.Workbook();

        // Adicionar tabelas no Excel
        const tables = ['Pessoa', 'Cartao', 'Fatura', 'Transacao'];
        for (const table of tables) {
            const sheet = workbook.addWorksheet(table);

            // Usar SELECT direto com CDS
            const data = await tx.run(SELECT.from(`app.entidades.${table}`));

            if (data.length > 0) {
                sheet.columns = Object.keys(data[0]).map((key) => ({ header: key, key }));
                sheet.addRows(data);
            }
        }

        // Salvar arquivo temporário
        const filePath = path.join(__dirname, 'backup.xlsx');
        await workbook.xlsx.writeFile(filePath);
        const fileContent = fs.readFileSync(filePath);
        fs.unlinkSync(filePath); 

        return {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=backup.xlsx'
            },
            body: fileContent
        };
    }

    async importarBackup(req) {

        const tx = cds.transaction(req); // Usar transação
        const fileBuffer = req;

        const workbook = new excel.Workbook();
        await workbook.xlsx.load(fileBuffer);

        let oFaturas = [];
        let oTransacoesTotais = []
        let oTransacoesInseridas = []

        const tables = ['Pessoa', 'Cartao', 'Fatura', 'Transacao'];
        for (const table of tables) {
            const sheet = workbook.getWorksheet(table);
            if (!sheet) continue;

            const rows = [];
            let rowHeader = {};
            sheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) { rowHeader = row; return }; // Ignorar cabeçalhos
                const rowData = {};
                sheet.columns.forEach((col, i) => {
                    rowData[rowHeader.getCell(i + 1).value] = row.getCell(i + 1).value;
                });
                rows.push(rowData);
            });

            // Processar cada linha da tabela
            for (const row of rows) {
                const exists = await tx.run(
                    SELECT.from(`app.entidades.${table}`).where({ ID: row.ID })
                );

                if (table == 'Transacao') {
                    oTransacoesTotais.push(row.ID)
                }

                if (exists.length === 0) {
                    // Inserir se não existir
                    await tx.run(
                        INSERT.into(`app.entidades.${table}`).entries(row)
                    );

                    if (table == 'Transacao') {
                        oTransacoesInseridas.push(row.ID);
                        oFaturas.push(row.Fatura_ID);
                    }

                } 
            }
        }

        await tx.commit();

        if (oTransacoesTotais.length > oTransacoesInseridas.length) {
            let oFaturasParaAtualizarValor = [...new Set(oFaturas)];

            for (const oFatura of oFaturasParaAtualizarValor) {

                await this.atualizaValorFatura(oFatura)

            }
        }

        return 'Backup importado com sucesso!';
    }

    async atualizaAvisoEnviadoFatura(Fatura_ID) {

        const { Fatura } = this.entities;

        await UPDATE(Fatura, Fatura_ID).with({ AvisoEnviado: true })

    }

    async enviarAviso(pessoa) {

        let oDate = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        oDate = oDate.replaceAll(",", " ");
        let [oDia, oMes, oAno] = oDate.split(" ")[0].split("/");

        oDia = Number(oDia);
        oMes = Number(oMes);
        oAno = Number(oAno);

        const { Pessoa, Cartao, Fatura } = this.entities

        const oPessoa = await SELECT.one.from(Pessoa).where({ ID: pessoa.ID });

        if (oPessoa.Email == null) {
            return;
        }

        const oCartoes = await SELECT.from(Cartao).where({ Pessoa_ID: oPessoa.ID });

        if (!oCartoes) {
            return;
        }

        const oFaturas = await SELECT.from(Fatura).where({
            Ano: oAno,
            Mes: oMes
        });

        if (!oFaturas) {
            return;
        }

        for (const oCartao of oCartoes) {

            let oFatura = oFaturas.filter(fatura => fatura.Cartao_ID === oCartao.ID);

            if (oFatura.length > 0) {

                oFatura = oFatura[0];

                if (oFatura.AvisoEnviado == false || oFatura.AvisoEnviado == null) {

                    if (oCartao.DiaVencimento - oDia >= 0) {

                        try {
                            // Configuração do transporte
                            let oEmail = nodemailer.createTransport({
                                host: process.env.SMTPHost,
                                port: 587, // TLS
                                secure: false, // Use false para TLS
                                auth: {
                                    user: process.env.SMTPAddres,
                                    pass: process.env.SMTPKey
                                }
                            });

                            // Detalhes do e-mail
                            let oOpcoesEmail = {
                                from: '"Gestor de gastos" <no.reply@gmail.com>',
                                to: `${oPessoa.Email}`,
                                subject: `Olá ${oPessoa.Nome}, Sua Fatura do Cartão ${oCartao.NomeCartao} está prestes a vencer.`,
                                text: `Olá ${oPessoa.Nome}! Este é um aviso para que você lembre-se da data de pagamento da sua fatura do cartão ${oCartao.NomeCartao}.
                                   Competência do mês ${oFatura.Mes}, valor total da fatura <b>${oFatura.ValorTotal} ${oFatura.Moeda_code}</b>.
                                   Este e-mail é somente um aviso, caso já tenha pago desconsiderar.`,
                                html: `<b>Olá ${oPessoa.Nome}!</b><br />Olá! Este é um aviso para que você lembre-se da data de pagamento da sua fatura do cartão ${oCartao.NomeCartao}.
                                     <br /> Competência do mês ${oFatura.Mes}, valor total da fatura ${oFatura.ValorTotal} ${oFatura.Moeda_code}.
                                     <i>Este e-mail é somente um aviso, caso já tenha pago desconsiderar.</i>`
                            };

                            if (process.env.SMTPHost) {

                                await this.atualizaAvisoEnviadoFatura(oFatura.ID);

                                await this.enviarEmail(oEmail, oOpcoesEmail);

                            }

                            console.log("E-mail enviado com sucesso");
                        } catch (error) {
                            console.error("Erro ao enviar o e-mail:", error);
                        }

                    }

                }

            }

        }

    }

    async enviarEmail(oEmail, oOpcoesEmail) {

        try {
            // Envia o e-mail
            await oEmail.sendMail(oOpcoesEmail);
            console.log("E-mail enviado com sucesso:", info.messageId);

        } catch (error) {
            console.error("Erro ao enviar o e-mail:", error);
        }

    }

    generateUUID() {
        return cds.utils.uuid();
    }
}

module.exports = GestaoGastos