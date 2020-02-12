const server = require('../../config/server')
const express = require('express')
const router = express.Router();
const sql = require("mssql");
const general = require('../../api/general')
const prefixoModulo = "Financeiro_";

server.use('/ntlct_modules/financeiro/bancoscaixas', router);

exports.listarBancosCaixas = listarBancosCaixas;
exports.saldosBancos = saldosBancos;

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
    dados = "broker"; //"broker";

    if(full.indexOf("localhost") > -1){
        serverWindows = "http://localhost:2444";        
        configEnvironment = {user: 'sa', password: 'IntSql2015@', server: '127.0.0.1',  database: 'Environment'};
        local = true;
    }else{
        serverWindows = "http://localhost:2444";        
        configEnvironment = {user: 'sa', password: 'IntSql2015@', server: '127.0.0.1',  database: 'Environment'};        
        local = false;
    }
/*
    if(full.indexOf("localhost") > -1){
        serverWindows = "http://localhost:2444";
        dados = "intelecta10";  //"homologa"; //"foodtown";
        configEnvironment = {user: 'sa', password: '12345678', server: '127.0.0.1',  database: 'Environment'};
    }else{
        serverWindows = "http://" + dados + ".empresariocloud.com.br"; //"http://localhost:2444";
        configEnvironment = {user: 'sa', password: 'IntSql2015@', server: '172.31.8.216',  database: 'Environment'};
    }
*/
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
Lista as caixas e bancos cadastradas.
---------------------------------------------------------------------------------
*/
router.route('/listarcaixasbancos').post(function(req, res) {
    var query = "";
    var resposta = null;
    var prefixoFuncao = "lista: ";
    var parametros = null;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    try{
        parametros = req.body.parametros;
        parametros.idEmpresa = EnterpriseID;

        listarBancosCaixas(config,parametros,(function(resposta){
            try{
                res.json(resposta);
            }
            catch(err){
                resposta = {
                    status: -1,
                    mensagem: [prefixoFuncao + err],
                    bancos: [],
                }
                res.json(resposta);
            }
        }));
    }
    catch(err){
        resposta = {
            status: -1,
            mensagem: [prefixoFuncao + err],
            bancos: [],
        }
        res.json(resposta);
    }
})

/*-------------------------------------------------------------------------------
Lista as caixas e bancos cadastradas.
---------------------------------------------------------------------------------
*/
function listarBancosCaixas(configEx,parametros,callbackf){
    var query = "";
    var resposta= null;
    var conexao = null;
    var prefixoFuncao = "listaF: ";

    try{
        resposta = {
            status: 0,
            mensagem: [],
            bancos: [],
        }

        query = "select bco.id,bco.nm_agencia agencia,bco.nm_conta conta,bco.nm_apelido apelido,bco.id_dsg_banco idDsg,bco.vl_saldoinicial saldoInicial,bco.sn_caixa_financeiro caixa,bco.nm_responsavel responsavel,bco.nm_informacoes informacoes,";
        query += "dsg.nm_descricao descricao,dsg.nm_imagem imagem,";
        query += "0 saldoAtual"
        query += " from banco bco";
        query += " left join dsg_banco dsg on dsg.id = bco.id_dsg_banco";
        query += " where bco.id_empresa = @idEmpresa";
        if (parametros.tipo == "B")
            query += " and (bco.sn_caixa_financeiro is null or bco.sn_caixa_financeiro = '0')";
        else
        {
            if (parametros.tipo == "C")
                query += " and bco.sn_caixa_financeiro = '1'";
        }
        query += " order by bco.nm_apelido,bco.nm_conta";

        conexao = new sql.ConnectionPool(configEx,function (err) {
            if (err){
                resposta = {
                    status: -2,
                    mensagem: [prefixoFuncao + err],
                    bancos: [],
                }
                conexao.close();
                callbackf(resposta);
            }
            else{
                var request = conexao.request();
                request.input("idempresa",parametros.idEmpresa);
                request.query(query, function (err, recordset) {
                    var banco = 0;
                    var parametrosSaldo = null;
                    var saldosBancos = null;
                    var posBco = 0;
                    var bancoscaixa = require("./bancoscaixas");;

                    if (err){
                        resposta = {
                            status: -3,
                            mensagem: [prefixoFuncao + err],
                            bancos: [],
                        }
                        conexao.close();
                        callbackf(resposta);
                    }
                    else{
                        try{
                            parametrosSaldo = {};
                            parametrosSaldo.data = null;
                            parametrosSaldo.bancos = [];
                            parametrosSaldo.idEmpresa = parametros.idEmpresa;
                            resposta.bancos = recordset.recordsets[0];
                            for(banco = 0; banco < resposta.bancos.length; banco++){
                                if(!resposta.bancos[banco].imagem){
                                    resposta.bancos[banco].imagem = "padrao.png"
                                }
                                parametrosSaldo.bancos.push(resposta.bancos[banco].id);                            
                            }
                            bancoscaixa.saldosBancos(configEx,parametrosSaldo,(function(resposta1){
                                try{
                                    conexao.close();
                                    for(banco = 0; banco < resposta1.saldos.length; banco++){
                                        posBco = resposta.bancos.findIndex(function(value,index,array){return value["id"] == resposta1.saldos[banco].idBanco});
                                        if(posBco >= 0){
                                            resposta.bancos[posBco].saldoAtual = resposta1.saldos[banco].saldoAtual;
                                        }
                                    }
                                    
                                    resposta.status = 1;
                                    callbackf(resposta);
                                }
                                catch(err){
                                    resposta = {
                                        status: -4,
                                        mensagem: [prefixoFuncao + err],
                                        bancos: [],
                                    }
                                    conexao.close();
                                    callbackf(resposta);
                                }
                            }));
                        }
                        catch(err){                            
                            resposta = {
                                status: -5,
                                mensagem: [prefixoFuncao + err],
                                bancos: [],
                            }
                            conexao.close();
                            callbackf(resposta);                            
                        }
                    }
                })
            }
        })
    }
    catch(err){
        resposta = {
            status: -1,
            mensagem: [prefixoFuncao + err],
            bancos: [],
        }
        callbackf(resposta);
    }
}

/*---------------------------------------------------------------------------------------------------------------------
Calcula os saldos dos bancos/caixas
parametros
    bancos: lista com id's dos bancos (tabela banco)
    data: (opcional) - verifica o saldo (anterior) na data informada, não considerando os movimentos feitos nesse dia
-----------------------------------------------------------------------------------------------------------------------
*/
function saldosBancos(configEx,parametros,callbackf){
    var query = "";
    var resposta= null;
    var conexao = null;
    var bancos = ""
    var contador = 0;
    var prefixoFuncao = "saldobancoF: ";

    try{
        resposta = {
            status: 0,
            mensagem: [],
            saldos: []
        }
        if (parametros.bancos.length > 0){
            bancos += "(";
            for (contador = 0; contador < parametros.bancos.length; contador++)
            {
                if (contador > 0)
                    bancos += ",";
                bancos += "'" + parametros.bancos[contador] + "'";
            }
            bancos += ")";
        }

        query = "select idbanco,sum(vlsaldoinicial) saldoinicial,sum(vlsaldodata) saldodata,sum(vlmovimento) movimento from (";
        /*-*/
        query += "select bco.id idbanco,bco.vl_saldoinicial vlsaldoinicial,0 vlsaldodata,0 vlmovimento from banco bco";
        query += " where bco.id_Empresa = @idempresa";
        if (parametros.bancos.length > 0)
        {
            query += " and bco.id in " + bancos;
        }

        if (parametros.data)
        {
            query += " union all ";
            query += "select mov.id_banco idbanco,0 vlsaldoinicial,mov.vl_valor vlsaldodata,0 vlmovimento from movimentacao_bancaria mov where mov.id_empresa = @idempresa";
            query += " and convert(varchar(8),mov.dt_data,112) < @movData";
            if (parametros.bancos.length > 0)
                query += " and mov.id_banco in " + bancos;
        }

        query += " union all ";
        query += "select mov.id_banco idbanco,0 vlsaldoinicial,0 vlsaldodata,mov.vl_valor vlmovimento from movimentacao_bancaria mov where mov.id_empresa = @idempresa";
        if (parametros.bancos.length > 0)
            query += " and mov.id_banco in " + bancos;

        query += ") valores";
        query += " group by idbanco";

        conexao = new sql.ConnectionPool(configEx,function (err) {
            if (err){
                resposta = {
                    status: -2,
                    mensagem: [prefixoFuncao + err],
                    saldos: []
                }
                conexao.close();
                callbackf(resposta);
            }
            else{
                var request = conexao.request();
                request.input("idempresa",parametros.idEmpresa);
                request.input("movData",parametros.data ? parametros.data.substring(6,10) + parametros.data.substring(3,5)  + parametros.data.substring(0,2) : null);
                request.query(query, function (err, recordset) {
                    var saldo = null;
                    var banco = 0;

                    if (err){
                        resposta = {
                            status: -3,
                            mensagem: [prefixoFuncao + err],
                            saldos: []
                        }
                        conexao.close();
                        callbackf(resposta);
                    }
                    else{
                        try{
                            for(banco = 0; banco < recordset.recordsets[0].length; banco++){
                                saldo = {};

                                saldo.idBanco = recordset.recordsets[0][banco].idbanco;
                                saldo.saldoInicial = recordset.recordsets[0][banco].saldoinicial;
                                saldo.saldoData = saldo.saldoInicial;
                                if (parametros.data)
                                {
                                    if (recordset.recordsets[0][banco].saldodata){
                                        saldo.saldoData =  saldo.saldoInicial;
                                        saldo.saldoData += recordset.recordsets[0][banco].saldodata;
                                    }
                                }
                                saldo.saldoAtual = saldo.saldoInicial + recordset.recordsets[0][banco].movimento;

                                resposta.saldos.push(saldo);
                            }
                            resposta.status = 1;
                            resposta.mensagem = ["ok"];
                            conexao.close();
                            callbackf(resposta);
                        }
                        catch(err){
                            resposta = {
                                status: -4,
                                mensagem: [prefixoFuncao + err],
                                saldos: []
                            }
                            conexao.close();
                            callbackf(resposta);
                        }
                    }
                })
            }
        })
    }
    catch(err){
        resposta = {
            status: -1,
            mensagem: [prefixoFuncao + err],
            saldos: []
        }
        callbackf(resposta);
    }
}