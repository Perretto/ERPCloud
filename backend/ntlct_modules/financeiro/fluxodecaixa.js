const server = require('../../config/server')
const express = require('express')
const router = express.Router();
const sql = require("mssql");
const funcoesBanco = require("./bancoscaixas");
const general = require('../../api/general')
const prefixoModulo = "Financeiro_";

server.use('/ntlct_modules/financeiro/fluxodecaixa', router);

var serverWindows = "";
var configEnvironment = {};
var EnterpriseID = "";
var EnterpriseName = "";
var UserID = "";
var base = ""; 
var url = "";
var host = "";
var config = {};

router.route('/*').get(function(req, res, next) {

    var full = req.host; //"http://homologa.empresarioerpcloud.com.br"; //
    var parts = full.split('.');
    var dados = "";
    if (parts.length > 3) {
        dados = parts[0];
    }
    host = dados;
    dados = dados.replace("http://","");

    if(full.indexOf("localhost") > -1){
        serverWindows = "http://localhost:2444";
        dados = "intelecta10";  //"homologa"; //"foodtown";
        configEnvironment = {user: 'sa', password: '12345678', server: '127.0.0.1',  database: 'Environment'};
    }else{
        serverWindows = "http://" + dados + ".empresariocloud.com.br"; //"http://localhost:2444";
        configEnvironment = {user: 'sa', password: 'IntSql2015@', server: '172.31.8.216',  database: 'Environment'};
    }

    var database = ""; //"eCloud-homologa";
    var server = ""; //"127.0.0.1";
    var password = ""; //"1234567890";
    var user = ""; //"sa";

    var select = "SELECT id AS idempresa,nm_CompanyName nome,nm_DatabaseName_Aplication AS 'database',  ";
    select += " nm_ServerIP_Aplication AS 'server', ";
    select += " password_Aplication AS 'password', ";
    select += " nm_User_Aplication AS 'user', ";
    select += " nm_mongodb AS mongodb ";
    select += " FROM Enterprise WHERE domainName='" + dados + "' ";

    sql.close();
    sql.connect(configEnvironment, function (err) {    
        if (err) console.log(err);
        var request = new sql.Request();
        request.query(select, function (err, recordset) {            
            if (err) console.log(err)
            if(recordset.recordsets[0].length > 0){
                const element = recordset.recordsets[0][0];
                database = element.database;
                server = element.server;
                password = element.password;
                user = element.user;
                EnterpriseID = element.idempresa;
                EnterpriseName = element.nome;
                base = element.mongodb;
                url = "mongodb://localhost:27017/" + base;
                                
                config = {user: user, password: password, server: server,  database: database};

                next();
            }
        });
    });    
});

router.route('/*').post(function(req, res, next) {

    var full = req.host; //"http://homologa.empresarioerpcloud.com.br"; //
    var parts = full.split('.');
    var dados = "";
    if (parts.length > 3) {
        dados = parts[0];
    }
    host = dados;
    dados = dados.replace("http://","");

    if(full.indexOf("localhost") > -1){
        serverWindows = "http://localhost:2444";
        dados = "intelecta10";  //"homologa"; //"foodtown";
        configEnvironment = {user: 'sa', password: '12345678', server: '127.0.0.1',  database: 'Environment'};
    }else{
        serverWindows = "http://" + dados + ".empresariocloud.com.br"; //"http://localhost:2444";
        configEnvironment = {user: 'sa', password: 'IntSql2015@', server: '172.31.8.216',  database: 'Environment'};
    }

    var database = ""; //"eCloud-homologa";
    var server = ""; //"127.0.0.1";
    var password = ""; //"1234567890";
    var user = ""; //"sa";

    var select = "SELECT id AS idempresa,nm_CompanyName nome,nm_DatabaseName_Aplication AS 'database',  ";
    select += " nm_ServerIP_Aplication AS 'server', ";
    select += " password_Aplication AS 'password', ";
    select += " nm_User_Aplication AS 'user', ";
    select += " nm_mongodb AS mongodb ";
    select += " FROM Enterprise WHERE domainName='" + dados + "' ";

    sql.close();
    sql.connect(configEnvironment, function (err) {    
        if (err) console.log(err);
        var request = new sql.Request();
        request.query(select, function (err, recordset) {            
            if (err) console.log(err)
            if(recordset.recordsets[0].length > 0){
                const element = recordset.recordsets[0][0];
                database = element.database;
                server = element.server;
                password = element.password;
                user = element.user;
                EnterpriseID = element.idempresa;
                EnterpriseName = element.nome;
                base = element.mongodb;
                url = "mongodb://localhost:27017/" + base;
                                
                config = {user: user, password: password, server: server,  database: database};

                next();
            }
        });
    });    
});


/*-------------------------------------------------------------------------------
Consulta o fluxo de caixa
---------------------------------------------------------------------------------
*/
router.route('/consultarfluxocaixa').post(function(req, res) {
    var resposta = null;
    var prefixoFuncao = prefixoModulo + "consultafluxo: ";
    var parametros = null;
    var funcao = "";
    var geraFluxo = null;
    var _eval = require("eval");

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    try{
        parametros = req.body.parametros;
        parametros.idEmpresa = EnterpriseID;
        if(!parametros.bancos || parametros.bancos.length == 0){
            resposta = {
                status: 0,
                mensagem: ["Os bancos/caixas para o fluxo não foram informados."],
                fluxo: null
            }
            res.json(resposta);
        }
        else{
            switch (parametros.tipoFluxo)
            {
                case "sintetico":
                    fluxoSintetico(parametros,function(resposta){
                        try{
                            res.json(resposta);
                        }
                        catch(erro){
                            resposta = {
                                status: -2,
                                mensagem: [prefixoFuncao + err],
                                fluxo: null
                            }
                            res.json(resposta);
                        }
                    });
                    break;
                case "sinteticobancos":
                    fluxoSintetico(parametros,function(resposta){
                        try{
                            res.json(resposta);
                        }
                        catch(erro){
                            resposta = {
                                status: -3,
                                mensagem: [prefixoFuncao + err],
                                fluxo: null
                            }
                            res.json(resposta);
                        }
                    });
                    break;
                case "analitico":
                    fluxoAnalitico(parametros,function(resposta){
                        try{
                            res.json(resposta);
                        }
                        catch(erro){
                            resposta = {
                                status: -4,
                                mensagem: [prefixoFuncao + err],
                                fluxo: null
                            }
                            res.json(resposta);
                        }
                    });
                    break;
                case "analiticobancos":
                    fluxoAnalitico(parametros,function(resposta){
                        try{
                            res.json(resposta);
                        }
                        catch(erro){
                            resposta = {
                                status: -5,
                                mensagem: [prefixoFuncao + err],
                                fluxo: null
                            }
                            res.json(resposta);
                        }
                    });
                    break;
                default:
                    resposta = {
                        status: 0,
                        mensagem: ["Tipo de fluxo selecionado inválido."],
                        fluxo: null
                    }
                    res.json(resposta);
                    break;
            }            
        }
    }
    catch(err){
        resposta = {
            status: -1,
            mensagem: [prefixoFuncao + err],
            fluxo: null
        }
        res.json(resposta);
    }
})

 
function fluxoSintetico(parametros,callbackf){
    var resposta = null;
    var prefixoFuncao = prefixoModulo + "fluxosintetico: ";
    var banco = "";

    try{
        if (parametros.bancos.length > 0)
        {
            bancos = "(";
            for (i = 0; i < parametros.bancos.length; i++)
            {
                if (i > 0)
                    bancos += ",";
                bancos += "'" + parametros.bancos[i] + "'";
            }
            bancos += ")";
        }

        saldosIniciais(parametros,function(saldos){
            var i = 0;
            var query = "";
            var subQuery = ""
            var conexao = null;

            try{
                if(saldos.status == 1){
                    resposta = {
                        status: 1,
                        mensagem: ["ok"],
                        fluxo: {
                            saldoAcumulado: 0,
                            saldosBancos: [],
                            fluxo: []
                        }
                    }
                    resposta.fluxo.saldosBancos = saldos.saldosBancos;
                    for (i = 0; i < saldos.saldosBancos.length; i++)
                        resposta.fluxo.saldoAcumulado += saldos.saldosBancos[i].saldo;

                    query = "select datamov,";
                    if (parametros.tipoFluxo == "sinteticobancos")
                        query += "idbanco,";
                    query += "sum(entrada) entradamov,sum(saida) saidamov from (";
                    /*
                     * realizado */
                    if (parametros.tipoMovimento == "realizado" || parametros.tipoMovimento == "ambos")
                    {
                        subQuery += "select 'R' tipomov,mov.id_banco idbanco,mov.dt_data datamov,lower(mov.nm_descricao) descricao,";
                        subQuery += " (case when mov.vl_valor >= 0 then mov.vl_valor else 0 end) entrada,";
                        subQuery += " (case when mov.vl_valor < 0 then mov.vl_valor else 0 end) saida";
                        subQuery += " from movimentacao_bancaria mov";
                        subQuery += " where id_empresa = @idempresa";

                        if (parametros.dataInicial) 
                            subQuery += " and (convert(varchar(8),mov.dt_data,112) >= @dtinicial)";

                        if (parametros.dataFinal)
                            subQuery += " and (convert(varchar(8),mov.dt_data,112) <= @dtfinal)";

                        if (parametros.bancos.length > 0)
                            subQuery += " and mov.id_banco in " + bancos;                            
                    }
                    /*
                     * A realizar */
                    if (parametros.tipoMovimento == "arealizar" || parametros.tipoMovimento == "ambos")
                    {
                        {
                            if (!(subQuery == ""))
                                subQuery += " union all ";
                            /* 
                             * contas a receber */
                            subQuery += "select 'A' tipomov,";
                            subQuery += "cr.id_banco idbanco, cr.dt_data_vencimento datamov,";
                            subQuery += "lower(concat('Recebimento título/parcela ', cr.nm_documento, '/', cr.nr_parcela, ' (', ent.nm_razaosocial, ')')) descricao,";
                            subQuery += "cr.vl_valor entrada,0 saida";
                            subQuery += " from contas_receber crc,contas_receber_parcelas cr,entidade ent";
                            subQuery += " where cr.id_empresa = @idempresa";
                            subQuery += " and (select sum(baixa.vl_valor) from contas_receber_baixas baixa where baixa.id_contas_receber_parcela = cr.id) is null";

                            if (parametros.dataInicial)
                                subQuery += " and (convert(varchar(8),cr.dt_data_vencimento,112) >= @dtinicial)";

                            if (parametros.dataFinal)
                                subQuery += " and (convert(varchar(8),cr.dt_data_vencimento,112) <= @dtfinal)";

                            if (parametros.bancos.length > 0)
                            {
                                subQuery += " and (cr.id_banco in " + bancos;
                                subQuery += " or cr.id_banco is null or cr.id_banco = '00000000-0000-0000-0000-000000000000')";
                            }

                            subQuery += " and crc.id = cr.id_contas_receber and crc.id_empresa = @idempresa";
                            subQuery += " and ent.id = crc.id_entidade and ent.id_empresa = @idempresa";

                            /* 
                             * contas a pagar */
                            subQuery += " union all ";
                            subQuery += "select 'A' tipomov,";
                            subQuery += "cp.id_banco idbanco, cp.dt_data_vencimento datamov,";
                            subQuery += "lower(concat('Pagamento título/parcela ', cp.nm_documento, '/', cp.nr_parcela, ' (', ent.nm_razaosocial, ')')) descricao,";
                            subQuery += "0 entrada, -cp.vl_valor saida";
                            subQuery += " from contas_pagar cpc,contas_pagar_parcelas cp,entidade ent";
                            subQuery += " where cp.id_empresa = @idempresa";
							subQuery += " and (cp.dt_cancelamento is null or cp.dt_cancelamento = '')";
                            subQuery += " and (select sum(baixa.vl_valor) from contas_pagar_baixas baixa where baixa.id_contas_pagar_parcela = cp.id) is null";

                            if (parametros.dataInicial)
                                subQuery += " and (convert(varchar(8),cp.dt_data_vencimento,112) >= @dtinicial)";

                            if (parametros.dataFinal)
                                subQuery += " and (convert(varchar(8),cp.dt_data_vencimento,112) <= @dtfinal)";

                            if (parametros.bancos.length > 0)
                            {
                                subQuery += " and (cp.id_banco in " + bancos;
                                subQuery += " or cp.id_banco is null or cp.id_banco = '00000000-0000-0000-0000-000000000000')";
                            }

                            subQuery += " and cpc.id = cp.id_contas_pagar and cpc.id_empresa = @idempresa";
                            subQuery += " and ent.id = cpc.id_entidade and ent.id_empresa = @idempresa";
                        }
                    }

                    query += subQuery;
                    query += ") movimento ";

                    if (parametros.tipoFluxo == "sinteticobancos")
                    {
                        query += " group by datamov,idbanco";
                        query += " order by datamov,idbanco";
                    }
                    else
                    {
                        query += " group by  datamov";
                        query += " order by datamov";
                    }

                    conexao = new sql.ConnectionPool(config,function (err) {
                        if (err){
                            resposta = {
                                status: -3,
                                mensagem: [prefixoFuncao + err],
                                fluxo: {
                                    saldoAcumulado: 0,
                                    saldosBancos: [],
                                    fluxo: []
                                }
                            }
                            conexao.close();
                            callbackf(resposta);
                        }
                        else{
                            try{
                                var request = conexao.request();                
                                request.input("idempresa",parametros.idEmpresa);
                                request.input("dtinicial",parametros.dataInicial ? parametros.dataInicial : null);
                                request.input("dtfinal",parametros.dataInicial ? parametros.dataInicial : null);
                                request.query(query, function (err, recordset) {
                                    var movimento = null;
                                    var data = null; 
                                    var banco = null;
                                    var contMovimento = 0;

                                    try{
                                        conexao.close();
                                        if(recordset.recordsets[0].length == 0){
                                            resposta = {
                                                status: 0,
                                                mensagem: ["Não há fluxo de caixa para os parâmetros informados."],
                                                fluxo: {
                                                    saldoAcumulado: 0,
                                                    saldosBancos: [],
                                                    fluxo: []
                                                }
                                            }
                                        }
                                        else{
                                            if (parametros.tipoFluxo == "sinteticobancos"){
                                                while(contMovimento < recordset.recordsets[0].length){
                                                    movimento = {
                                                        datamov: recordset.recordsets[0][contMovimento].datamov,
                                                        entrada: 0,
                                                        saida: 0,
                                                        bancos: []
                                                    }
                                                    while(contMovimento < recordset.recordsets[0].length && recordset.recordsets[0][contMovimento].datamov == movimento.datamov){
                                                        movimento.entrada += recordset.recordsets[0][contMovimento].entradamov;
                                                        movimento.saida += recordset.recordsets[0][contMovimento].saidamov;
                                                        banco = {
                                                            idBanco: (recordset.recordsets[0][contMovimento].idbanco ? recordset.recordsets[0][contMovimento].idbanco : "00000000-0000-0000-0000-000000000000"),
                                                            entrada: recordset.recordsets[0][contMovimento].entradamov,
                                                            saida: recordset.recordsets[0][contMovimento].saidamov
                                                        }
                                                        movimento.bancos.push(banco);

                                                        contMovimento++;
                                                    }
                                                    resposta.fluxo.fluxo.push(movimento);
                                                }
                                            }
                                            else{
                                                resposta.fluxo.fluxo = recordset.recordsets[0];
                                            }
                                        }
                                        callbackf(resposta);
                                    }
                                    catch(err){
                                        resposta = {
                                            status: -4,
                                            mensagem: [prefixoFuncao + err],
                                            fluxo: null
                                        }
                                        callbackf(resposta);
                                    }
                                })
                            }
                            catch(err){
                                conexao.close();
                                resposta = {
                                    status: -3,
                                    mensagem: [prefixoFuncao + err],
                                    fluxo: null
                                }
                                callbackf(resposta);
                            }
                        }
                    });
                }
                else{
                    callbackf(saldos)
                }
            }
            catch(err){
                resposta = {
                    status: -2,
                    mensagem: [prefixoFuncao + err],
                    fluxo: null
                }
                callbackf(resposta);
            }
        });
    }
    catch(err){
        resposta = {
            status: -1,
            mensagem: [prefixoFuncao + err],
            fluxo: null
        }
        callbackf(resposta);
    }
}

function fluxoAnalitico(parametros,callbackf){
    var resposta = null;
    var prefixoFuncao = prefixoModulo + "fluxoanalitico: ";
    var banco = "";

    try{
        if (parametros.bancos.length > 0)
        {
            bancos = "(";
            for (i = 0; i < parametros.bancos.length; i++)
            {
                if (i > 0)
                    bancos += ",";
                bancos += "'" + parametros.bancos[i] + "'";
            }
            bancos += ")";
        }

        saldosIniciais(parametros,function(saldos){
            var i = 0;
            var query = "";
            var subQuery = ""
            var conexao = null;

            try{
                if(saldos.status == 1){
                    resposta = {
                        status: 1,
                        mensagem: ["ok"],
                        fluxo: {
                            saldoAcumulado: 0,
                            saldosBancos: [],
                            fluxo: []
                        }
                    }
                    resposta.fluxo.saldosBancos = saldos.saldosBancos;
                    for (i = 0; i < saldos.saldosBancos.length; i++)
                        resposta.fluxo.saldoAcumulado += saldos.saldosBancos[i].saldo;                    
                    /*
                     * realizado */
                    if (parametros.tipoMovimento == "realizado" || parametros.tipoMovimento == "ambos")
                    {
                        query += "select 'R' tipomov,mov.id_banco idbanco,mov.dt_data datamov,lower(mov.nm_descricao) descricao,";
                        query += " (case when mov.vl_valor >= 0 then mov.vl_valor else 0 end) entrada,";
                        query += " (case when mov.vl_valor < 0 then mov.vl_valor else 0 end) saida";
                        query += " from movimentacao_bancaria mov";
                        query += " where id_empresa = @idEmpresa";

                        if (parametros.dataInicial)
                            query += " and (convert(varchar(8),mov.dt_data,112) >= @dtInicial)";

                        if (parametros.dataFinal)
                            query += " and (convert(varchar(8),mov.dt_data,112) <= @dtFinal)";

                        if (parametros.bancos.length > 0)
                            query += " and mov.id_banco in " + bancos;
                    }
                    /*
                     * A realizar */
                    if (parametros.tipoMovimento == "arealizar" || parametros.tipoMovimento == "ambos")
                    {
                        {
                            if (query != "")
                                query += " union all ";
                            /* 
                             * contas a recebe */
                            query += "select 'A' tipomov,";
                            query += "cr.id_banco idbanco, cr.dt_data_vencimento datamov,";
                            query += "lower(concat('Recebimento título/parcela ', cr.nm_documento, '/', cr.nr_parcela, ' (', ent.nm_razaosocial, ')')) descricao,";
                            query += "cr.vl_valor entrada,0 saida";
                            query += " from contas_receber crc,contas_receber_parcelas cr,entidade ent";
                            query += " where cr.id_empresa = @idEmpresa";
                            query += " and (select sum(baixa.vl_valor) from contas_receber_baixas baixa where baixa.id_contas_receber_parcela = cr.id) is null";

                            if (parametros.dataInicial)
                                query += " and (convert(varchar(8),cr.dt_data_vencimento,112) >= @dtInicial)";

                            if (parametros.dataFinal)
                                query += " and (convert(varchar(8),cr.dt_data_vencimento,112) <= @dtFinal)";

                            if (parametros.bancos.length > 0){
                                query += " and (cr.id_banco in " + bancos;
                                query += " or cr.id_banco is null or cr.id_banco = '00000000-0000-0000-0000-000000000000')";
                            }

                            query += " and crc.id = cr.id_contas_receber and crc.id_empresa = @idEmpresa";
                            query += " and ent.id = crc.id_entidade and ent.id_empresa = @idEmpresa";

                            /* 
                             * contas a pagar */
                            query += " union all ";
                            query += "select 'A' tipomov,";
                            query += "cp.id_banco idbanco, cp.dt_data_vencimento datamov,";
                            query += "lower(concat('Pagamento título/parcela ', cp.nm_documento, '/', cp.nr_parcela, ' (', ent.nm_razaosocial, ')')) descricao,";
                            query += "0 entrada, -cp.vl_valor saida";
                            query += " from contas_pagar cpc,contas_pagar_parcelas cp,entidade ent";
                            query += " where cp.id_empresa = @idEmpresa";
							query += " and (cp.dt_cancelamento is null or cp.dt_cancelamento = '')";
                            query += " and (select sum(baixa.vl_valor) from contas_pagar_baixas baixa where baixa.id_contas_pagar_parcela = cp.id) is null";

                            if (parametros.dataInicial)
                                query += " and (convert(varchar(8),cp.dt_data_vencimento,112) >= @dtInicial)";

                            if (parametros.dataFinal)
                                query += " and (convert(varchar(8),cp.dt_data_vencimento,112) <= @dtFinal)";

                            if (parametros.bancos.length > 0){
                                query += " and (cp.id_banco in " + bancos;
                                query += " or cp.id_banco is null or cp.id_banco = '00000000-0000-0000-0000-000000000000')";
                            }

                            query += " and cpc.id = cp.id_contas_pagar and cpc.id_empresa = @idEmpresa";
                            query += " and ent.id = cpc.id_entidade and ent.id_empresa = @idEmpresa";
                        }
                    }
                    query += " order by datamov";

                    conexao = new sql.ConnectionPool(config,function (err) {
                        if (err){
                            resposta = {
                                status: -3,
                                mensagem: [prefixoFuncao + err],
                                fluxo: {
                                    saldoAcumulado: 0,
                                    saldosBancos: [],
                                    fluxo: []
                                }
                            }
                            conexao.close();
                            callbackf(resposta);
                        }
                        else{
                            try{
                                var request = conexao.request();                
                                request.input("idempresa",parametros.idEmpresa);
                                request.input("dtinicial",parametros.dataInicial ? parametros.dataInicial : null);
                                request.input("dtfinal",parametros.dataInicial ? parametros.dataInicial : null);
                                request.query(query, function (err, recordset) {
                                    var movimento = null;
                                    var banco = null;
                                    var contMovimento = 0;

                                    try{
                                        conexao.close();
                                        if(recordset.recordsets[0].length == 0){
                                            resposta = {
                                                status: 0,
                                                mensagem: ["Não há fluxo de caixa para os parâmetros informados."],
                                                fluxo: {
                                                    saldoAcumulado: 0,
                                                    saldosBancos: [],
                                                    fluxo: []
                                                }
                                            }
                                        }
                                        else{
                                            while(contMovimento < recordset.recordsets[0].length){
                                                movimento = {
                                                    datamov: recordset.recordsets[0][contMovimento].datamov,
                                                    movimentacao: []
                                                }
                                                while(contMovimento < recordset.recordsets[0].length && recordset.recordsets[0][contMovimento].datamov == movimento.datamov){
                                                    movimento.entrada += recordset.recordsets[0][contMovimento].entrada;
                                                    movimento.saida += recordset.recordsets[0][contMovimento].saida;
                                                    banco = {
                                                        idBanco: (recordset.recordsets[0][contMovimento].idbanco ? recordset.recordsets[0][contMovimento].idbanco : "00000000-0000-0000-0000-000000000000"),
                                                        tipomov: recordset.recordsets[0][contMovimento].tipomov,
                                                        descricao: recordset.recordsets[0][contMovimento].descricao,
                                                        entrada: recordset.recordsets[0][contMovimento].entrada,
                                                        saida: recordset.recordsets[0][contMovimento].saida
                                                    }
                                                    movimento.movimentacao.push(banco);

                                                    contMovimento++;
                                                }
                                                resposta.fluxo.fluxo.push(movimento);
                                            }
                                        }
                                        callbackf(resposta);
                                    }
                                    catch(err){
                                        resposta = {
                                            status: -4,
                                            mensagem: [prefixoFuncao + err],
                                            fluxo: null
                                        }
                                        callbackf(resposta);
                                    }
                                })
                            }
                            catch(err){
                                conexao.close();
                                resposta = {
                                    status: -3,
                                    mensagem: [prefixoFuncao + err],
                                    fluxo: null
                                }
                                callbackf(resposta);
                            }
                        }
                    });
                }
                else{
                    callbackf(saldos)
                }
            }
            catch(err){
                resposta = {
                    status: -2,
                    mensagem: [prefixoFuncao + err],
                    fluxo: null
                }
                callbackf(resposta);
            }
        });
    }
    catch(err){
        resposta = {
            status: -1,
            mensagem: [prefixoFuncao + err],
            fluxo: null
        }
        callbackf(resposta);
    }
}

function saldosIniciais(parametros,callbackf){
    var resposta = null;
    var paramBancos = null;
    var bancos = "";
    var prefixoFuncao = prefixoModulo + "saldoinicial: ";

    try{ 
        paramBancos = {};
        paramBancos.bancos = parametros.bancos;
        paramBancos.data = parametros.dataInicial;
        paramBancos.idEmpresa = parametros.idEmpresa;

        if (parametros.bancos.length > 0)
        {
            bancos = "(";
            for (i = 0; i < parametros.bancos.length; i++)
            {
                if (i > 0)
                    bancos += ",";
                bancos += "'" + parametros.bancos[i] + "'";
            }
            bancos += ")";
        }

        funcoesBanco.saldosBancos(config,paramBancos,function(saldos){
            var i = 0;
            var saldoBanco = null;
            var resposta = null;
            var query = "";

            try{
                if(saldos.status > 0){
                    resposta = {
                        status: 1,
                        mensagem: ["ok"],
                        saldosBancos: []
                    }
                    for (i = 0; i < saldos.saldos.length; i++){
                        saldoBanco = {
                            idBanco: saldos.saldos[i].idBanco,
                            saldo: saldos.saldos[i].saldoData
                        }
                        resposta.saldosBancos.push(saldoBanco);
                    }
                    /*
                    * Acrescenta os saldos dos títulos em atraso aos saldos dos bancos */
                    if (parametros.saldoTituloAtrasados == "1")
                    {
                        if (parametros.dataInicial)      /* data inicial */
                        {
                            query = "select idbanco,sum(entrada) entradasaldo,sum(saida) saidasaldo from (";
                            /* contas a receber */
                            query += " select mov.id_banco idbanco,mov.vl_valor entrada,0 saida from contas_receber_parcelas mov";
                            query += " where mov.id_empresa = @idempresa";
                            if(bancos)
                                query += " and mov.id_banco in " + bancos;
                            query += " and (@dtinicial is null or (convert(varchar(8),mov.dt_data_vencimento,112) < @dtinicial))";
                            query += " and ((select sum(baixa.vl_valor) from contas_receber_baixas baixa where baixa.id_contas_receber_parcela = mov.id) is null)"
                            /* contas a pagar */
                            query += " union all";
                            query += " select mov.id_banco idbanco,0 entrada,-mov.vl_valor saida from contas_pagar_parcelas mov";
                            query += " where mov.id_empresa = @idempresa";
                            if(bancos)
                                query += " and mov.id_banco in " + bancos;
                            query += " and (@dtinicial is null or (convert(varchar(8),mov.dt_data_vencimento,112) < @dtinicial))";
                            query += " and ((select sum(baixa.vl_valor) from contas_pagar_baixas baixa where baixa.id_contas_pagar_parcela = mov.id) is null)"
                            /*-*/
                            query += ") saldo ";
                            query += " group by idbanco";

                            conexao = new sql.ConnectionPool(config,function (err) {
                                if (err){
                                    resposta = {
                                        status: -2,
                                        mensagem: [prefixoFuncao + err],
                                        saldosBancos: []
                                    }
                                    conexao.close();
                                    callbackf(resposta);
                                }
                                else{
                                    var request = conexao.request();                
                                    request.input("idempresa",EnterpriseID);
                                    request.input("dtinicial",parametros.dataInicial ? parametros.dataInicial : null);
                                    request.query(query, function (err, recordset) {
                                        var banco = 0;
                                        var posBanco = 0;
                    
                                        if (err){
                                            resposta = {
                                                status: -3,
                                                mensagem: [prefixoFuncao + err],
                                                saldosBancos: []
                                            }
                                            conexao.close();
                                            callbackf(resposta);
                                        }
                                        else{
                                            try{
                                                for(banco = 0; banco < recordset.recordsets[0].length; banco++){
                                                    posBco = resposta.saldosBancos.findIndex(function(value,index,array){return value["idBanco"] == recordset.recordsets[0][banco].idbanco});
                                                    if(posBco >= 0){
                                                        resposta.saldosBancos[posBco].saldo += recordset.recordsets[0][banco].entradasaldo;
                                                        resposta.saldosBancos[posBco].saldo += recordset.recordsets[0][banco].saidasaldo;
                                                    }
                                                }
                                                conexao.close();
                                                callbackf(resposta);
                                            }
                                            catch(err){
                                                resposta = {
                                                    status: -5,
                                                    mensagem: [prefixoFuncao + err],
                                                    saldosBancos: []
                                                }
                                                conexao.close();
                                                callbackf(resposta);
                                            }
                                        }
                                    })
                                }
                            })
                        }
                        else{
                            callbackf(resposta);
                        }
                    }
                    else{
                        callbackf(resposta);
                    }
                }
                else{
                    callbackf(saldos);
                }
            }
            catch(err){
                resposta = {
                    status: -4,
                    mensagem: [prefixoFuncao + err],
                    saldosBancos: []
                }
                callbackf(resposta);
            }
        });
    }
    catch(err){
        resposta = {
            status: -1,
            mensagem: [prefixoFuncao + err],
            saldosBancos: []
        }
        callbackf(resposta);
    }
}