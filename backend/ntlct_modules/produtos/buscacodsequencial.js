const server = require('../../config/server')
const express = require('express')
const router = express.Router()
const sql = require('mssql')
const general = require('../../api/general')

server.use('/ntlct_modules/produtos/buscacodsequencial', router);

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

//Retorna o numero sequencial
router.route('/sequencial').post(function(req, res) {
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

        console.log(config);

        sql.connect(config, function(err) {
            if (err){
                resposta = {
                    status: -2,
                    mensagem: ["" + err],
                    sequenciaproduto: null
                }
                res.json(resposta);
            }
            else{
            /* Produtos */
            var request = new sql.Request();
            request.input("idempresa",EnterpriseID);
            request.input("tipoitem", req.body.parametros.tipo);
            request.input("grupoitem", req.body.parametros.classe);
            request.input("marcaitem", req.body.parametros.marca);
            request.input("segmentoitem", req.body.parametros.segmento);

            request.query("select nr_sequencia from produtos where id_empresa = @idempresa and nr_tipoitem = @tipoitem and nr_grupoitem = @grupoitem and nr_marcaitem = @marcaitem and nr_segmentoitem = @segmentoitem and nr_sequencia is not null order by nr_sequencia", function (err, recordset) {
                if (err) {
                    resposta = {
                        status: -3,
                        mensagem: ["" + err],
                        sequenciaproduto: null
                    }
                    res.json(resposta);
                }
                else{
                    var element = recordset.recordsets[0];
                    var sequencia = 1;
                    

                    var i = 0;
                    while(i < element.length) {
                        if(sequencia != parseInt(element[i].nr_sequencia)){
                            i = element.length;
                        }
                        else
                        {
                            sequencia++;
                            
                        }
                            i++
                        }
                        tamanhoSequencia = sequencia.toString();
                        tamanhoSequencia = ("0").repeat(3 - tamanhoSequencia.length) + tamanhoSequencia;
                        
                        resposta = {
                            status: 1,
                            mensagem: ["OK"],
                            sequenciaproduto: tamanhoSequencia
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

//Verifica se já existe a sequencia informada
router.route('/confirmasequencia').post(function(req, res) {
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

        console.log(config);

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
            request.input("idempresa",EnterpriseID);
            request.input("tipoitem", req.body.parametros.tipo);
            request.input("grupoitem", req.body.parametros.classe);
            request.input("marcaitem", req.body.parametros.marca);
            request.input("segmentoitem", req.body.parametros.segmento);
            request.input("codigoitem", req.body.parametros.nmcodigo);
            
            request.query("select nm_codigo from produtos where id_empresa = @idempresa and nr_tipoitem = @tipoitem and nr_grupoitem = @grupoitem and nr_marcaitem = @marcaitem and nr_segmentoitem = @segmentoitem and nm_codigo = @codigoitem and nr_sequencia is not null order by nr_sequencia", function (err, recordset) {
            //request.query("select nm_codigo from produtos where id_empresa = @idempresa and nr_tipoitem = @tipoitem and nr_grupoitem = @grupoitem and nr_marcaitem = @marcaitem and nr_segmentoitem = @segmentoitem and nm_codigo = @codigoitem and nr_sequencia is not null order by nm_codigo", function (err, recordset) {
            //request.query("select nm_codigo from produtos where id_empresa = @idempresa and nm_codigo = @codigoitem and nr_sequencia is not null order by nm_codigobarras", function (err, recordset) {
                if (err) {
                    resposta = {
                        status: -3,
                        mensagem: ["" + err],
                        sequenciaproduto: null
                    }
                    res.json(resposta);
                }
                else{
                    if(recordset.recordsets[0].length > 0) {
                    
                    var element = recordset.recordsets[0];
                    console.log('001 ' + req.body.parametros.nmcodigo);
                    if(element[0].nm_codigo != req.body.parametros.nmcodigo)
                    {
                        resposta = {
                            status: -5,
                            mensagem: ["Nao achou"],
                            sequenciaproduto: null//element[0].nm_codigo
                        }
                        res.json(resposta);
                    }
                    else{
                        resposta = {
                            status: 1,
                            mensagem: ["OK"],
                            sequenciaproduto: req.body.parametros.nmcodigo//element[0].nm_codigo
                        }
                        res.json(resposta);
                    }
                }
                else {
                    resposta = {
                        status: -5,
                        mensagem: ["Nao achou"],
                        sequenciaproduto: null//element[0].nm_codigo
                    }
                    res.json(resposta);
                }
                }
            });
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

router.route('/grupoitens').get(function(req, res) {
    
    var select = "SELECT grupoitens.id as 'id', grupoitens.nm_grupoitem as 'descricao', grupoitens.nm_codgruitem as 'codigo', grupoitens.id_campopai as 'idpai' FROM grupoitens order by nr_sequencial";
    var resultado;

    sql.close(); 
    sql.connect(config, function (err) { 
    if (err) console.log(err); 
    var request = new sql.Request(); 
    request.query(select, function (err, recordset){ 
    if (err) console.log(err);
    var html = "<div class='easy-tree' id='treehidro'>";
    html+= "<ul>";
    
    for (let index = 0; index < recordset.recordset.length; index++) {
        const element = recordset.recordset[index];
        //+ "</li>";
        
        if(element.idpai == null){
            html+="<li data-elementoli='"+ element.id +"' data-elementcod = '" + element.codigo + "' data-descricao = '" + element.descricao + "' data-id = '" + element.idpai + "' data-nivel='1'>" + element.descricao;
            for (let I = 0; I < recordset.recordset.length; I++) {
                const element1 = recordset.recordset[I];
                if(element.id == element1.idpai){
                    html+= "<ul>";
                    html+="<li data-elementoli='"+ element1.id +"' data-elementcod = '" + element1.codigo +"' data-descricao = '" + element1.descricao + "' data-id = '" + element1.idpai + "' data-nivel='2'>" + element1.descricao;
                    
                    for (let J = 0; J < recordset.recordset.length; J++) {
                        const element2 = recordset.recordset[J];
                        if(element1.id == element2.idpai){
                            html+= "<ul>";
                            html+="<li data-elementoli='"+ element2.id +"' data-elementcod = '" + element2.codigo +"' data-descricao = '" + element2.descricao + "' data-id = '" + element2.idpai + "' data-nivel='3'>" + element2.descricao;
                            
                            for (let L = 0; L < recordset.recordset.length; L++) {
                                const element3 = recordset.recordset[L];
                                if(element2.id == element3.idpai){
                                    html+= "<ul>";
                                    html+="<li data-elementoli='"+ element3.id +"' data-elementcod = '" + element3.codigo + "' data-descricao = '" + element3.descricao + "' data-id = '" + element3.idpai + "' data-nivel='4'>" + element3.descricao;
                                    
                                    html+= "</li>";
                                    html+= "</ul>";
                                    
            
                                }
                            }

                            html+= "</li>";
                            html+= "</ul>";

    
                        }
                    }
                    html+= "</ul>";

    
                }
            }
        }

       
        html += "</li>"
    }

    html+="<ul>";
    html+="</div>";
    console.log(html);
    res.send(html); 
        
            }); 
        }); 
    });