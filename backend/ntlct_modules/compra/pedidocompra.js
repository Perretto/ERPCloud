const server = require('../../config/server')
const express = require('express')
const router = express.Router();
const sql = require("mssql");
const general = require('../../api/general')
const prefixoModulo = "Compra_";

server.use('/ntlct_modules/compra/pedidocompra', router);

var serverWindows = "";
var configEnvironment = {};
var EnterpriseID = "";
var EnterpriseName = "";
var UserID = "";var base = ""; 
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
Executa o concelamento de um pedido de compras já finalizado, gerando movimento
de estono no estoque e cancelando os documentos gerados no financeiro.
---------------------------------------------------------------------------------
*/
function cancelarPedidos(configEx,parametros,callbackf){
    var query = "";
    var resposta = null;
    var conexao = null;
    var prefixoFuncao = "cancelamentopedidoF: ";
	var contasPagar = require("../financeiro/contaspagar");
	var objConexao = null;
	
	try{
		query += "select mov.id_dsg_unidade_medida,mov.id_armazens,mov.nm_numero_documento,mov.id_produtos,mov.id_dsg_status_movimentacao_estoque,mov.vl_custo_medio,mov.id_dsg_origem_estoque,"
		query += "mov.vl_valor_movimentacao,mov.vl_quantidade,mov.vl_quantidade_previsao_entrada,mov.vl_quantidade_empenhada"
		query += " from movimentacao_estoque mov where"
		query += " mov.id_origem_movimento = '" + parametros.idCompra + "' and mov.id_empresa = '" + EnterpriseID + "'; ";
		query += "select compra.id_status status from compra where"
		query += " compra.id = '" + parametros.idCompra + "' and compra.id_empresa = '" + EnterpriseID + "'";
	
		conexao = new sql.ConnectionPool(configEx,function (err) {
            if (err){
                resposta = {
                    status: -2,
                    mensagem: [prefixoModulo + prefixoFuncao + err],
                    bancos: [],
                }
                conexao.close();
                callbackf(resposta);
            }
            else{
				var queryAlteracao = "";
				var queryItens = "";
				var dataMovimento = "";
				var transacao = null;
                var request = null;
				
                request = conexao.request();
                request.query(query, function (err, recordset) {
					var itens = 0;
					var itensCompra = null;
					
                    if (err){
                        resposta = {
                            status: -2,
                            mensagem: [prefixoModulo + prefixoFuncao + err],
                            bancos: [],
                        }
                        conexao.close();
                        callbackf(resposta);
                    }
                    else{
                        try{
							resposta = {
								status: 1
							}
							switch(recordset.recordsets[1][0].status){
								case "03B60526-8138-4370-876D-8F57858BAD5B":		//cancelado
									resposta.mensagem = ["Pedido já cancelado."];
									resposta.status = 0;
									break;
								case "48F27FF0-87BD-49AF-8D1D-6663CB2D8F7F":		//não finalizado (pedido)
									resposta.mensagem = ["Pedido não finalizado."];
									resposta.status = 0;
									break;
							}
							if(resposta.status == 0){
								conexao.close();
								callbackf(resposta);  
							}
							else{
								itensCompra = recordset.recordsets[0];
								dataMovimento = new Date().toISOString();
								/*
								Alterando o status do pedido de compra para "cancelada" */
								queryAlteracao += "update compra set id_status = '03B60526-8138-4370-876D-8F57858BAD5B'";
								queryAlteracao += " where id = '" + parametros.idCompra + "'";
								queryAlteracao += " and id_empresa = '" + EnterpriseID + "'; ";
								/*
								gerando lançamentos de estorno na movimentação do estoque */
								if(itensCompra.length > 0){
									queryAlteracao += "insert into movimentacao_estoque (nm_observacao,dt_movimentacao,id_dsg_unidade_medida,id_dsg_origem_movimento_estoque,id_usuario,id_armazens,nm_numero_documento,id,id_empresa,vl_quantidade,sn_movimentacao_saida,id_produtos,id_dsg_tipo_movimentacao_estoque,id_dsg_status_movimentacao_estoque,vl_custo_medio,id_origem_movimento,id_dsg_origem_estoque,vl_valor_movimentacao,vl_quantidade_previsao_entrada,vl_quantidade_empenhada)"
									queryAlteracao += " values ";
									for(itens = 0; itens < itensCompra.length; itens++){
										if(itens > 0)
											queryItens += ","
										queryItens = "(";
										queryItens += "'Estorno referente ao cancelamento do pedido de compras " + itensCompra[itens].nm_numero_documento.trim() + "',"
										queryItens += "'" + dataMovimento + "',";
										queryItens += "'" + itensCompra[itens].id_dsg_unidade_medida + "',";
										queryItens += "'9181D542-086B-4A62-8CA5-581064D7A5C8',"			//estorno entrada
										queryItens += "'" + parametros.idUsuario + "',";
										queryItens += "'" + itensCompra[itens].id_armazens + "',";
										queryItens += "'" + itensCompra[itens].nm_numero_documento + "',";
										queryItens += "'" + general.guid() + "',";
										queryItens += "'" + EnterpriseID + "',";
										if(itensCompra[itens].vl_quantidade > 0)
											queryItens += "-";
										queryItens += itensCompra[itens].vl_quantidade + ","
										queryItens += "'1',";;
										queryItens += "'" + itensCompra[itens].id_produtos + "',"
										queryItens += "'B403138C-6B29-4C2C-98E4-13356207EA67',";		//automática
										queryItens += "'" + itensCompra[itens].id_dsg_status_movimentacao_estoque + "',";
										queryItens += itensCompra[itens].vl_custo_medio + ",";
										queryItens += "'" + parametros.idCompra + "',";
										queryItens += "'" + itensCompra[itens].id_dsg_origem_estoque + "',";
										queryItens += itensCompra[itens].vl_valor_movimentacao + ",";
										if(itensCompra[itens].vl_quantidade_previsao_entrada > 0)
											queryItens += "-";
										queryItens += itensCompra[itens].vl_quantidade_previsao_entrada + ","
										if(itensCompra[itens].vl_quantidade_empenhada > 0)
											queryItens += "-";
										queryItens += itensCompra[itens].vl_quantidade_empenhada;
										queryItens += ");";
									}
									queryAlteracao += queryItens
								}
								transacao = new sql.Transaction(conexao); //   new sql.Transaction();
								transacao.begin(err =>{
									try{
										var request = transacao.request(); //   new sql.Request(transacao);
										request.query(queryAlteracao, function (err, recordset) {
											if (err){
												resposta = {
													status: -3,
													mensagem: [prefixoModulo + prefixoFuncao + err],
												}
												transacao.rollback();
												conexao.close();
												callbackf(resposta);
											}
											else{
												objConexao = {
													config: configEx,
													transacao: transacao
												}
												console.log(objConexao);
												contasPagar.cancelarConta(parametros,objConexao,function(respostaretorno){
													if(respostaretorno.status < 1){
														resposta = respostaretorno;
														transacao.rollback();
													}
													else{
														resposta = {
															status: 1,
															mensagem: ["ok"],
														}
														transacao.commit();
													}
													conexao.close();
													callbackf(resposta);
												})
											}
										})
									}
									catch(err){
										resposta = {
											status: -4,
											mensagem: [prefixoModulo + prefixoFuncao + err],
										}
										conexao.close();
										callbackf(resposta);
									}
								})
							}
                        }
                        catch(err){
                            resposta = {
                                status: -5,
                                mensagem: [prefixoModulo + prefixoFuncao + err],
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
            mensagem: [prefixoModulo + prefixoFuncao + err],
            bancos: [],
        }
        callbackf(resposta);
    }
}

router.route('/cancelarpedido').post(function(req, res) {
    var query = "";
	var resposta = null;
    var prefixoFuncao = "cancelamentopedido: ";

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    try{
        parametros = req.body.parametros;
        parametros.idEmpresa = EnterpriseID;

        cancelarPedidos(config,parametros,(function(resposta){
            try{
                res.json(resposta);
            }
            catch(err){
                resposta = {
                    status: -1,
                    mensagem: [prefixoModulo + prefixoFuncao + err],
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