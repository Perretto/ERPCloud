const server = require('../../config/server')
const express = require('express')
const router = express.Router();
const sql = require("mssql");
const general = require('../../api/general')
//const funcoesFinanceiro = require("./financeiro");
//const prefixoModulo = "ContasReceber_";

server.use('/ntlct_modules/venda/telavendas', router);

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
        dados = "homologa";  
        configEnvironment = {user: 'sa', password: 'IntSql2015@', server: '127.0.0.1',  database: 'Environment'};
    }else{
        serverWindows = "http://" + dados + ".empresariocloud.com.br"; 
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
                //console.log(config);
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
        dados = "homologa";  //"homologa"; //"foodtown";
        configEnvironment = {user: 'sa', password: 'IntSql2015@', server: '127.0.0.1',  database: 'Environment'};
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

router.route('/recarregarValoresListaPreco').post(function(req, res) {
    var parametros = req.body.parametros;
    var where = "";
    
    var idLista = "";
    where = " WHERE  ";

    if(parametros.id){
        idLista = parametros.id;
    }else{
        res.send("");
    }
    
    var Produtos = [];
    if(parametros){
        if(parametros.produtos){
            if(parametros.produtos.length > 0){
                Produtos = parametros.produtos;
            }
        }
    }

    if(!Produtos.length > 0){
        res.send("");
    }

    where += "  ( ";
    for (let index = 0; index < Produtos.length; index++) {
        if(index == 0){
            where += " produtos.id='" + Produtos[index] + "' "
        }else{
            where += " OR produtos.id='" + Produtos[index] + "' "
        }
    }
    where += " )";

    var select = "SELECT produtos.id AS 'id' , ";
    select += " IIF( ";
    select += " (SELECT precos_lista.vl_valor FROM precos_lista WHERE precos_lista.id_dsg_lista_preco='" + idLista + "'   ";
    select += " AND precos_lista.id_produtos=produtos.id) IS NOT NULL,  ";
    select += " (SELECT precos_lista.vl_valor FROM precos_lista WHERE precos_lista.id_dsg_lista_preco='" + idLista + "'   ";
    select += " AND precos_lista.id_produtos=produtos.id), ";
    select += " '0' ";
    select += "  ) AS 'valor' ";
    select += " FROM produtos ";
    select = select + where;
    console.log(select);

    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(select, function (err, recordset){ 
                if (err) console.log(err);
                
                res.send(recordset); 
        }); 
    }); 
});

router.route('/carregarPeso/:idproduto/:quantidade').get(function(req, res) {
    var idproduto = req.param('idproduto');
    var quantidade = req.param('quantidade');
    
    if(!quantidade){
        quantidade = "1";
    }

    var select = "SELECT (vl_pesobruto * " + quantidade + ") AS 'pesobruto', (vl_pesoliquido * " + quantidade + ") AS 'pesoliquido' FROM produtos ";
    select += " WHERE id='" + idproduto + "'";

    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(select, function (err, recordset){ 
                if (err) console.log(err);
                
                res.send(recordset); 
        }); 
    }); 
});


router.route('/LancarEstoqueVenda/:idvenda').get(function(req, res) {
    var idvenda = req.param('idvenda');
    
    var select = "SELECT ('') AS 'nm_observacao', FORMAT(getdate(), 'd', 'en-US') AS 'dt_movimentacao', (venda_produtos.id_dsg_unidade_medida) AS 'id_dsg_unidade_medida', ";
    select += " ('A76A3955-7E11-477D-A3F1-BE1A658DB6A1') AS 'id_dsg_origem_movimento_estoque', (venda.id_usuario) AS 'id_usuario', ";
    select += " (venda_produtos.id_armazens) AS 'id_armazens', (venda.nr_pedido) AS 'nm_numero_documento', (newID()) AS 'id', ";
    select += " (venda.id_empresa) AS 'id_empresa', (venda_produtos.vl_quantidade) AS 'vl_quantidade', ('1') AS 'sn_movimentacao_saida', ";
    select += " (venda_produtos.id_produtos) AS 'id_produtos', ('B403138C-6B29-4C2C-98E4-13356207EA67') AS 'id_dsg_tipo_movimentacao_estoque', ";
    select += " ('2B7BCB91-ADD2-4FB8-8384-0CB9AF5A0CD4') AS 'id_dsg_status_movimentacao_estoque',  ";
    select += " ('') AS 'vl_custo_medio', ('" + idvenda + "') AS 'id_origem_movimento',  ";
    select += " ('86ADE029-99BF-45D6-B864-8E453E7D227B') AS 'id_dsg_origem_estoque', (custo_aquisicao.vl_custoaquisicao) AS 'vl_valor_movimentacao', ";
    select += " ('') AS 'id_armazem_destino', ('') AS 'vl_quantidade_previsao_entrada', (venda_produtos.vl_quantidade) AS 'vl_quantidade_empenhada', ";
    select += " ('') AS 'id_movimentacao_origem', ('') AS 'id_ordem_producao' ";
    select += " FROM venda_produtos ";
    select += " INNER JOIN venda ON venda.id=venda_produtos.id_venda ";
    select += " LEFT JOIN custo_aquisicao ON custo_aquisicao.id_produtos=venda_produtos.id_produtos ";
    select += " WHERE venda_produtos.id_venda='" + idvenda + "'  ";

    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(select, function (err, recordset){ 
            if (err) console.log(err);
            
            var insertquery = "DELETE  FROM movimentacao_estoque WHERE id_origem_movimento='" + idvenda + "'; ";

            for (let i = 0; i < recordset.recordset.length; i++) {
                insertquery += "INSERT INTO movimentacao_estoque ";
                insertquery += " (nm_observacao, dt_movimentacao, id_dsg_unidade_medida, ";
                insertquery += " id_dsg_origem_movimento_estoque, id_usuario, id_armazens, nm_numero_documento, ";
                insertquery += " id, id_empresa, vl_quantidade, sn_movimentacao_saida, id_produtos, ";
                insertquery += " id_dsg_tipo_movimentacao_estoque, id_dsg_status_movimentacao_estoque, ";
                insertquery += " vl_custo_medio, id_origem_movimento, id_dsg_origem_estoque, vl_valor_movimentacao,";
                insertquery += " id_armazem_destino, vl_quantidade_previsao_entrada, vl_quantidade_empenhada, ";
                insertquery += " id_movimentacao_origem, id_ordem_producao) ";

                insertquery += " VALUES(";   

                insertquery += (!recordset.recordset[i].nm_observacao ? "NULL" : "'" + recordset.recordset[i].nm_observacao + "'") + ", ";
                insertquery += (!recordset.recordset[i].dt_movimentacao ? "NULL" : "'" + recordset.recordset[i].dt_movimentacao + "'") + ", ";
                insertquery += (!recordset.recordset[i].id_dsg_unidade_medida ? "NULL" : "'" + recordset.recordset[i].id_dsg_unidade_medida + "'") + ", ";
                insertquery += (!recordset.recordset[i].id_dsg_origem_movimento_estoque ? "NULL" : "'" + recordset.recordset[i].id_dsg_origem_movimento_estoque + "'") + ", ";
                insertquery += (!recordset.recordset[i].id_usuario ? "NULL" : "'" + recordset.recordset[i].id_usuario + "'") + ", ";
                insertquery += (!recordset.recordset[i].id_armazens ? "NULL" : "'" + recordset.recordset[i].id_armazens + "'") + ", ";
                insertquery += (!recordset.recordset[i].nm_numero_documento ? "NULL" : "'" + recordset.recordset[i].nm_numero_documento + "'") + ", ";
                insertquery += (!recordset.recordset[i].id ? "NULL" : "'" + recordset.recordset[i].id + "'") + ", ";
                insertquery += (!recordset.recordset[i].id_empresa ? "NULL" : "'" + recordset.recordset[i].id_empresa + "'") + ", ";
                insertquery += (!recordset.recordset[i].vl_quantidade ? "0" : "-" + recordset.recordset[i].vl_quantidade + "") + ", ";
                insertquery += (!recordset.recordset[i].sn_movimentacao_saida ? "0" : "" + recordset.recordset[i].sn_movimentacao_saida + "") + ", ";
                insertquery += (!recordset.recordset[i].id_produtos ? "NULL" : "'" + recordset.recordset[i].id_produtos + "'") + ", ";
                insertquery += (!recordset.recordset[i].id_dsg_tipo_movimentacao_estoque ? "NULL" : "'" + recordset.recordset[i].id_dsg_tipo_movimentacao_estoque + "'") + ", ";
                insertquery += (!recordset.recordset[i].id_dsg_status_movimentacao_estoque ? "NULL" : "'" + recordset.recordset[i].id_dsg_status_movimentacao_estoque + "'") + ", ";
                insertquery += (!recordset.recordset[i].vl_custo_medio ? "0" : "" + recordset.recordset[i].vl_custo_medio + "") + ", ";
                insertquery += (!recordset.recordset[i].id_origem_movimento ? "NULL" : "'" + recordset.recordset[i].id_origem_movimento + "'") + ", ";
                insertquery += (!recordset.recordset[i].id_dsg_origem_estoque ? "NULL" : "'" + recordset.recordset[i].id_dsg_origem_estoque + "'") + ", ";
                insertquery += (!recordset.recordset[i].vl_valor_movimentacao ? "0" : "" + recordset.recordset[i].vl_valor_movimentacao + "") + ", ";
                insertquery += (!recordset.recordset[i].id_armazem_destino ? "NULL" : "'" + recordset.recordset[i].id_armazem_destino + "'") + ", ";
                insertquery += (!recordset.recordset[i].vl_quantidade_previsao_entrada ? "0" : "" + recordset.recordset[i].vl_quantidade_previsao_entrada + "") + ", ";
                insertquery += (!recordset.recordset[i].vl_quantidade_empenhada ? "0" : "-" + recordset.recordset[i].vl_quantidade_empenhada + "") + ", ";
                insertquery += (!recordset.recordset[i].id_movimentacao_origem ? "NULL" : "'" + recordset.recordset[i].id_movimentacao_origem + "'") + ", ";
                insertquery += (!recordset.recordset[i].id_ordem_producao ? "NULL" : "'" + recordset.recordset[i].id_ordem_producao + "'") + " ";

                insertquery += ");";                
            }

            var retorno = {
                status: "",
                mensagem: ""
            };

            sql.close()
            sql.connect(config).then(function() {
                var request = new sql.Request();
                request.query(insertquery).then(function(recordset) {
                    retorno.status = true;
                    retorno.mensagem = "Estoque lançado com sucesso";
                    res.send(retorno);  
                }).catch(function(err) { 
                    console.log(err)   
                    retorno.status = false;  
                    retorno.mensagem = "Falha ao lançar o estoque";              
                    res.send(retorno);
                });
            }); 
        }); 
    }); 
});