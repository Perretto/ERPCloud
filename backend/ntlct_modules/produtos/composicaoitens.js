const server = require('../../config/server')
const express = require('express')
const router = express.Router()
const sql = require('mssql')
const general = require('../../api/general')

server.use('/ntlct_modules/produtos/composicaoitens', router);

var serverWindows = "";
var configEnvironment = {};
var EnterpriseID = "";
var UserID = "";
var base = "";
var url = "";
var host = "";
var config = {};

router.route('/*').get(function(req, res, next){
    var full = req.host;
    var parts = full.split('.');
    var dados = "";
    if(parts.length > 3) {
        dados = parts[0];
    }
    host = dados;
    dados = dados.replace("http://", "");
    
    if(full.indexOf("localhost") > -1) {
        serverWindows = "http://localhost:2444";
        dados = "hidrobombas";
        configEnvironment = {user: 'sa', password: '123', server: '127.0.0.1',  database: 'Environment'};
    }else{
        serverWindows = "http://" + dados + ".empresariocloud.com.br"; //"http://localhost:2444";
        configEnvironment = {user: 'sa', password: 'IntSql2015@', server: '172.31.8.216',  database: 'Environment'};
    }
    
    var database = "";
    var server = "";
    var password = "";
    var user = "";

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
})

router.route('/*').post(function(req, res, next) {
    var full = req.host;
    var parts = full.split('.');
    var dados = "";
    if(parts.length > 3) {
        dados = parts[0];
    }
    host = dados;
    dados = dados.replace("http://", "");
    
    if(full.indexOf("localhost") > -1) {
        serverWindows = "http://localhost:2444";
        dados = "hidrobombas";
        configEnvironment = {user: 'sa', password: '123', server: '127.0.0.1',  database: 'Environment'};
    }else{
        serverWindows = "http://" + dados + ".empresariocloud.com.br"; //"http://localhost:2444";
        configEnvironment = {user: 'sa', password: 'IntSql2015@', server: '172.31.8.216',  database: 'Environment'};
    }
    
    var database = "";
    var server = "";
    var password = "";
    var user = "";

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
})

router.route('/gravagrupo').post(function(req, res) {
    var query = "";
    var prod = null;
    var tamanhoSequencia = "";

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    try {
        resposta = {
            status: 0,
            mensagem: [],
            sequenciaproduto: null
        }

        sql.close();

        sql.connect(config, function(err) {
            if (err){
                resposta = {
                    status: -2,
                    mensagem: ["" + err],
                    sequenciaproduto: null
                }
                res.json(resposta);
            }
            else {
            /* Produtos */
            var request = new sql.Request();
            var idgru = general.guid();
           

            var query = "";
            
            //request.query("select nr_sequencia from produtos where id_empresa = @idempresa and nr_tipoitem = @tipoitem and nr_grupoitem = @grupoitem and nr_marcaitem = @marcaitem and nr_segmentoitem = @segmentoitem and nr_sequencia is not null order by nr_sequencia", function (err, recordset) {
            if(!req.body.parametros.idPrincipal) {
                query = "insert into grupoitens (id, nm_codgruitem, nm_grupoitem, id_campopai, nr_sequencial) Values('" + idgru + "', '" + req.body.parametros.codigogrupo + "', '" + req.body.parametros.nomegrupo + "', " + (!req.body.parametros.idpai ? null : "'" + req.body.parametros.idpai + "'") + ",iif((Select top 1 nr_sequencial from grupoitens order by nr_sequencial desc) is null, 1, (Select top 1 nr_sequencial from grupoitens order by nr_sequencial desc) + 1))"
            }
            else {
                query = "update grupoitens set nm_grupoitem = '" + req.body.parametros.nomegrupo + "', nm_codgruitem = '" + req.body.parametros.codigogrupo + "' Where id = '" + req.body.parametros.idpai + "'"
            }
            
                request.query(query, function (err, recordset) 
            
                {
                    if (err) {
                        resposta = {
                            status: -3,
                            mensagem: ["" + err]
                        
                    }
                    res.json(resposta);
                }
                else {
                    resposta = {
                        status: 1,
                        mensagem: ["OK"],
                        idgru: idgru
                    }
                    res.json(resposta);
                }

            })
            }

        })


    }
    catch(erro) {
        resposta = {
        status: -1,
        mensagem: ["" + erro],
        sequenciaproduto: null
    }
    sql.close();
    res.json(resposta);
    }

})