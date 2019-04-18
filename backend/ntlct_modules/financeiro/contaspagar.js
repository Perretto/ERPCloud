const server = require('../../config/server')
const express = require('express')
const router = express.Router();
const sql = require("mssql");
const general = require('../../api/general')
const funcoesFinanceiro = require("./financeiro");
const prefixoModulo = "ContasPagar_";

server.use('/ntlct_modules/financeiro/contaspagar', router);

exports.cancelarConta = cancelarConta;

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
        dados = "broker";  //"homologa"; //"foodtown";
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
        dados = "broker";  //"homologa"; //"foodtown";
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


/*-------------------------------------------------------------------------------
Retorna as listas dos itens para cadastrar parcelas: bancos, formas de pagamento,
configuração de cnab e contas financeiras.
---------------------------------------------------------------------------------
*/
router.route('/listacomplementoparcelas').post(function(req, res) {
    var query = "";
    var resposta = null;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    try{
        resposta = {
            status: 0,
            mensagem: [],
            bancos: [],
            formasPagamento: [],
            configuracoesCNAB: [],
            contasFinanceiras: []
        }

        query += "select id,nm_apelido descricao,nm_agencia agencia,nm_conta conta from banco where id_empresa = @idempresa";
        query += " order by descricao,agencia,conta; ";
        query += "select id,nm_descricao descricao,nm_nomeclasse classe from dsg_forma_pagamento";
        query += " order by descricao; ";
        query += "select id,nm_descricao descricao from configuracao_cnab where id_empresa = @idempresa";
        query += " order by descricao; ";
        query += "select id,nm_descricao descricao,nm_codigo codigo from plano_contas_financeiro where id_empresa = @idempresa";
        query += " order by codigo,descricao;";

        sql.close();
        sql.connect(config, function (err) {
            if (err){
                resposta = {
                    status: -2,
                    mensagem: ["" + err],
                    bancos: [],
                    formasPagamento: [],
                    configuracoesCNAB: [],
                    contasFinanceiras: []
                }
                res.json(resposta);
            }
            else{
                var request = new sql.Request();
                request.input("idempresa",EnterpriseID);
                request.query(query, function (err, recordset) {
                    if (err){
                        resposta = {
                            status: -3,
                            mensagem: ["" + err],
                            bancos: [],
                            formasPagamento: [],
                            configuracoesCNAB: [],
                            contasFinanceiras: []
                        }
                        res.json(resposta);
                    }
                    else{
                        resposta.bancos = recordset.recordsets[0];
                        resposta.formasPagamento = recordset.recordsets[1];
                        resposta.configuracoesCNAB = recordset.recordsets[2];
                        resposta.contasFinanceiras = recordset.recordsets[3];
                        resposta.status = 1;
                        resposta.mensagem = ["ok"];
                        res.json(resposta);
                    }
                })
            }
        })
    }
    catch(erro){
        resposta = {
            status: -1,
            mensagem: ["" + erro],
            bancos: [],
            formasPagamento: [],
            configuracoesCNAB: [],
            contasFinanceiras: []
        }
        sql.close();
        res.json(resposta);
    }
})

/*------------------------------------------------------------------------------
Cria uma relação das contas a pagar (parcelas)
--------------------------------------------------------------------------------
*/
router.route('/listarcontas').post(function(req, res) {
    var query = "";
    var resposta = null;
    var titulo = null;
    var baixa = null;
    var parametros = null;
    var idParcela = null;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    resposta = {
        status: 0,
        mensagem: [],
        titulos: [],
    }

    try{
        parametros = req.body.parametros;

        resposta = {
            status: 0,
            mensagem: [],
            titulos: [],
        }

        query += "select ";
        query += "ent.id idEntidade,ent.nm_razaosocial razaoSocial,";
        query += "cp.id idTitulo,cp.nm_documento titulo,cp.vl_valor valorTitulo,cp.dt_emissao emissao,cp.id_compra idCompra,cp.id_notafiscal idNota,cp.sn_dre dre,";
        query += "cp.nm_competencia,cp.dt_cancelamento cancelamentoDocumento,";
        query += "cpp.id idParcela,cpp.nm_documento docParcela,cpp.nr_parcela parcela,cpp.dt_data_vencimento vencimentoParcela,cpp.vl_valor valorParcela,cpp.id_banco idBanco,";
        query += "cpp.id_plano_contas_financeiro idContaFinanceira,cpp.id_forma_pagamento idFormaPagamento,cpp.sn_fluxocaixa fluxoCaixa,cpp.dt_cancelamento cancelamentoParcela,";
        query += "baixas.id idBaixa,baixas.dt_data dataBaixa,baixas.vl_valor valorBaixa,";
        query += "formas.nm_documento documentoPag,";
        query += "(select nr_pedido from compra where compra.id = cp.id_compra and compra.id_empresa = @idempresa) nrPedido,";
        query += "(select nm_numeronotafiscal from notafiscal where notafiscal.id = cp.id_notafiscal and notafiscal.id_empresa = @idempresa) nrNotaFiscal";
        query += " from contas_pagar cp";
        query += " left join entidade ent on ent.id = cp.id_entidade";
        query += " left join contas_pagar_parcelas cpp on cpp.id_contas_pagar = cp.id and cpp.id_empresa = @idempresa";
        query += " left join contas_pagar_baixas baixas on baixas.id_contas_pagar_parcela = cpp.id and baixas.id_empresa = @idempresa";
        query += " left join contas_pagar_baixas_formaspagamento formas on formas.id_contas_pagar_baixas = baixas.id and formas.id_empresa = @idempresa";
        query += " where cp.id_empresa = @idempresa";
		
		if(parametros.titulosPagos == 0){
			query += " and baixas.id is null";
		}
		if(parametros.hasOwnProperty("titulosCancelados")){
			if(parametros.titulosCancelados == 0){
				query += " and (cp.dt_cancelamento is null or cp.dt_cancelamento = '')"
			}
		}
        query += " and (@pedido is null or cp.id_compra in (select id from compra where compra.nr_pedido = @pedido))";
        query += " and (@notaFiscal is null or cp.id_notafiscal in (select id from notafiscal nota where nota.nm_numeronotafiscal = @notafiscal))";
        query += " and (@identidade is null or cp.id_entidade = @identidade)";
        query += " and ent.id = cp.id_entidade";
        query += " and cpp.id_contas_pagar = cp.id";
        query += " and (@vencimentoinicial is null or (convert(varchar(8),cpp.dt_data_vencimento,112)) >= @vencimentoinicial)";
        query += " and (@vencimentofinal is null or (convert(varchar(8),cpp.dt_data_vencimento,112)) <= @vencimentofinal)";
        query += " order by cpp.dt_data_vencimento,cpp.vl_valor desc,cpp.nm_documento,cpp.nr_parcela";
		
        sql.close();
        sql.connect(config, function (err) {    
            if (err){
                resposta.status = -2;
                resposta.mensagem = [];
                resposta.mensagem.push("" + err);
                resposta.titulos = [];
                res.json(resposta);
            }
            else{
                var request = new sql.Request();
                request.input("idempresa",EnterpriseID);
                request.input("identidade",(parametros.idEntidade == "" || parametros.idEntidade == "undefined") ? null : parametros.idEntidade);
                request.input("pedido",(parametros.pedido == "" || parametros.pedido == "undefined") ? null : parametros.pedido);
                request.input("notafiscal",(parametros.notaFiscal == "" || parametros.notaFiscal == "undefined") ? null : parametros.notaFiscal);
                request.input("vencimentoinicial",(parametros.vencimentoInicial == "" || parametros.vencimentoInicial == "undefined") ? null : parametros.vencimentoInicial.substring(6,10) + parametros.vencimentoInicial.substring(3,5)  + parametros.vencimentoInicial.substring(0,2));
                request.input("vencimentofinal",(parametros.vencimentoFinal == "" || parametros.vencimentoFinal == "undefined") ? null : parametros.vencimentoFinal.substring(6,10) + parametros.vencimentoFinal.substring(3,5)  + parametros.vencimentoFinal.substring(0,2));
                
				request.query(query, function (err, recordset) {
                    if (err){
                        resposta.status = -3;
                        resposta.mensagem = ["" + err];
                        resposta.titulos = [];
                        res.json(resposta);
                    }
                    else{
                        resposta.titulos = recordset.recordsets[0];
                        resposta.status = 1;
                        resposta.mensagem = ["ok"];
                        res.json(resposta);
                    }
                })
            }
        })
    }
    catch(erro){
        resposta.status = -1;
        resposta.mensagem = ["" + erro];
        resposta.titulos = [];
        sql.close();
        res.json(resposta);
    }
})

/*------------------------------------------------------------------------------
Cria uma relação das contas a pagar (parcelas)
--------------------------------------------------------------------------------
*/
router.route('/listarcontasdetalhepagamento').post(function(req, res) {
    var query = "";
    var resposta = null;
    var titulo = null;
    var baixa = null;
    var parametros = null;
    var idParcela = null;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    resposta = {
        status: 0,
        mensagem: [],
        titulos: [],
    }

    try{
        parametros = JSON.parse(req.body.parametros);    

        resposta = {
            status: 0,
            mensagem: [],
            titulos: [],
        }

        query += "select ";
        query += "ent.id identidade,ent.nm_razaosocial razaosocial,";
        query += "cp.id idtitulo,cp.nm_documento titulo,cp.vl_valor valortitulo,cp.dt_emissao emissao,cp.id_compra idcompra,cp.id_notafiscal idnota,cp.sn_dre dre,";
        query += "cp.nm_competencia,cp.id_plano_contas_financeiro idcontafinanceira,cp.dt_cancelamento cancelamentoDocumento,";
        query += "cpp.id idparcela,cpp.nm_documento docparcela,cpp.nr_parcela parcela,cpp.dt_data_vencimento vencimento,cpp.vl_valor valorparcela,cpp.id_banco idbanco,";
        query += "cpp.id_plano_contas_financeiro idcontafinanceiraparc,cpp.id_forma_pagamento idformaparc,cpp.sn_fluxocaixa fluxocaixa,cpp.dt_cancelamento cancelamentoParcela,";
        query += "baixas.id idbaixa,baixas.dt_data databaixa,baixas.vl_valor valorbaixa,";
        query += "formas.id_banco idbancorec,formas.id_formapagamento idformarec,formas.nm_documento documentorec,formas.vl_valor valorrec,formas.nm_conta contacli,";
        query += "formas.nm_agencia agenciacli,";
        query += "(select nr_pedido from compra where compra.id = cp.id_compra and compra.id_empresa = @idempresa) nrpedido,";
        query += "(select nm_numeronotafiscal from notafiscal where notafiscal.id = cp.id_notafiscal and notafiscal.id_empresa = @idempresa) nrnota";
        query += " from entidade ent,contas_pagar cp,contas_pagar_parcelas cpp";
        query += " left join contas_pagar_baixas baixas on baixas.id_contas_pagar_parcela = cpp.id and baixas.id_empresa = @idempresa";
        query += " left join contas_pagar_baixas_formaspagamento formas on formas.id_contas_pagar_baixas = baixas.id and formas.id_empresa = @idempresa";
        query += " where cp.id_empresa = @idempresa";
        query += " and (@pedido is null or cp.id_compra in (select id from compra where compra.nr_pedido = @pedido))";
        query += " and (@notaFiscal is null or cp.id_notafiscal in (select id from notafiscal nota where nota.nm_numeronotafiscal = @notafiscal))";
        query += " and (@identidade is null or cp.id_entidade = @identidade)";
        query += " and ent.id = cp.id_entidade";
        query += " and cpp.id_contas_pagar = cp.id";
        query += " and (@vencimentoinicial is null or (convert(varchar(8),cpp.dt_data_vencimento,112)) >= @vencimentoinicial)";
        query += " and (@vencimentofinal is null or (convert(varchar(8),cpp.dt_data_vencimento,112)) <= @vencimentofinal)";
        query += " order by cpp.dt_data_vencimento,cpp.vl_valor desc,cpp.nm_documento,cpp.nr_parcela";

        sql.close();
        sql.connect(config, function (err) {    
            if (err){
                resposta.status = -2;
                resposta.mensagem = [];
                resposta.mensagem.push("" + err);
                resposta.titulos = [];
                res.json(resposta);
            }
            else{
                var request = new sql.Request();
                request.input("idempresa",EnterpriseID);
                request.input("identidade",(parametros.idEntidade == "" || parametros.idEntidade == "undefined") ? null : parametros.idEntidade);
                request.input("pedido",(parametros.pedido == "" || parametros.pedido == "undefined") ? null : parametros.pedido);
                request.input("notafiscal",(parametros.notaFiscal == "" || parametros.notaFiscal == "undefined") ? null : parametros.notaFiscal);
                request.input("vencimentoinicial",(parametros.vencimentoInicial == "" || parametros.vencimentoInicial == "undefined") ? null : parametros.vencimentoInicial.substring(6,10) + parametros.vencimentoInicial.substring(3,5)  + parametros.vencimentoInicial.substring(0,2));
                request.input("vencimentofinal",(parametros.vencimentoFinal == "" || parametros.vencimentoFinal == "undefined") ? null : parametros.vencimentoFinal.substring(6,10) + parametros.vencimentoFinal.substring(3,5)  + parametros.vencimentoFinal.substring(0,2));
                request.query(query, function (err, recordset) {
                    if (err){
                        resposta.status = -3;
                        resposta.mensagem = [];
                        resposta.mensagem.push("" + err);
                        resposta.titulos = [];
                        res.json(resposta);
                    }
                    else{
                        var element = recordset.recordsets[0];
                        var i = 0;
                        while(i < element.length){
                            idParcela = element[i].idparcela;
                            titulo = {
                                idEntidade : (element[i].identidade == null ? "" : element[i].identidade),
                                razaoSocial : element[i].razaosocial,
                                idTitulo : (element[i].idtitulo == null ? "" : element[i].idtitulo),
                                titulo : element[i].titulo,
                                valorTitulo: element[i].valortitulo,
                                emissaoTitulo : element[i].emissao,
								cancelamentoTitulo : (element[i].cancelamentoDocumento ? element[i].cancelamentoDocumento : ""),
                                idParcela : (element[i].idparcela == null ? "" : element[i].idparcela),
                                parcela : element[i].parcela,
                                docParcela : element[i].docparcela,
                                valorParcela : element[i].valorparcela,
                                vencimentoParcela : element[i].vencimento,
								cancelamentoParcela : (element[i].cancelamentoParcela ? element[i].cancelamentoParcela : ""),
                                idPedido : (element[i].idcompra == null ? "" : element[i].idcompra),
                                nrPedido : element[i].nrpedido,
                                idNotaFiscal : (element[i].idnota == null ? "" : element[i].idnota),
                                nrNotaFiscal : element[i].nrnota,
                                idBanco : element[i].idbanco,
                                idConfCNAB : (element[i].idconfcnab == null ? "" : element[i].idconfcnab),
                                idContaFinanceira : (element[i].idcontafinanceiraparc == null ? "" : element[i].idcontafinanceiraparc),
                                idFormaPagamento : (element[i].idformaparc == null ? "" : element[i].idformaparc),
                                dre : (element[i].dre ? 1 : 0),
                                fluxoCaixa : (element[i].fluxocaixa ? 1 : 0),
                                valorBaixas : 0,
                                baixas : []
                            }
                            if(element[i].idbaixa != null){
                                while (i < element.length && element[i].idparcela == idParcela){
                                    baixa = {
                                        idBaixa : element[i].idbaixa,
                                        dataBaixa : element[i].databaixa,
                                        valorBaixa : element[i].valorbaixa,
                                        idBancoRec : (element[i].idbancorec == null ? "" : element[i].idbancorec),
                                        idFormaRec : (element[i].idformarec == null ? "" : element[i].idbancorec),
                                        documentoRec : element[i].documentorec,
                                        idBancoCli : (element[i].idbcocli == null ? "" : element[i].idbcocli),
                                        agenciaCli : element[i].agenciacli,
                                        contaCli : element[i].contacli
                                    }
                                    titulo.valorBaixas += element[i].valorbaixa;
                                    titulo.baixas.push(baixa);
                                    i++
                                }
                            }
                            else{
                                i++;
                            }
                            
                            if((parametros.titulosPagos == 1) || (titulo.valorBaixas < titulo.valorParcela))
                                resposta.titulos.push(titulo);
                        }
                        resposta.status = 1;
                        resposta.mensagem = [];
                        resposta.mensagem.push("Ok");
                        res.json(resposta);
                    }
                })
            }
        })
    }
    catch(erro){
        resposta.status = -1;
        resposta.mensagem = [];
        resposta.mensagem.push("" + erro);
        resposta.titulos = [];
        sql.close();
        res.json(resposta);
    }
})


/*------------------------------------------------------------------------------
Recupera os dados de um documento, com todas as parcelas ou com somente uma
específica. Recupera também os dados das baixas, quando houver.
--------------------------------------------------------------------------------
*/
router.route('/dadostitulo').post(function(req, res) {
    var query = "";
    var resposta = null;
    var parcela = null;
    var baixa = null;
    var formaRec = null;
    var parametros = null;
    var idParcela = null;
    var idBaixa = null;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    try{
        parametros = req.body.parametros;    

        resposta = {
            status: 0,
            mensagem: [],
            dadosTitulo: [],
        }
        
        query += "select ";
        query += "cp.id idtitulo,cp.id_entidade identidade,cp.id_compra idcompra,cp.id_notafiscal idnotafiscal,cp.id_parcelamento idparcelamento,";
        query += "cp.id_plano_contas_financeiro idcontafinanceira,cp.nm_documento titulo,cp.nm_competencia competencia,cp.dt_emissao emissao,";
        query += "cp.vl_valor valortitulo,cp.sn_dre dre,cp.nm_observacao observacao,cp.dt_cancelamento cancelamentoDocumento,";
        query += "cpp.id idparcela,cpp.nm_documento documentoparc,cpp.id_banco idbanco,cpp.id_forma_pagamento idformapagamentoparc,cpp.id_plano_contas_financeiro idcontafinanceiraparc,";
        query += "cpp.nr_parcela parcela,cpp.dt_data_vencimento vencimento,cpp.vl_valor valorparcela,cpp.id_dsg_status_titulo idstatus,cpp.sn_fluxocaixa fluxocaixa,cpp.dt_cancelamento cancelamentoParcela,";
        query += "ent.nm_razaosocial razaosocial,";        
        query += "(select compra.nr_pedido from compra where compra.id = cp.id_compra and compra.id_empresa = @idempresa) pedido,";
        query += "(select nm_numeronotafiscal from notafiscal where notafiscal.id = cp.id_notafiscal and notafiscal.id_empresa = @idempresa) notafiscal,";        
        query += "baixas.id idbaixa,baixas.id_processo_pagamento idprocesso,baixas.dt_data databaixa,baixas.vl_valor valorbaixa,";        
        query += "formas.id idformapagamento,formas.id_banco idbancopagamento,formas.nm_documento documentopagamento,formas.id_dsg_banco idbancopagador,";
        query += "formas.nm_conta contapagador,formas.nm_agencia agenciapagador,formas.vl_valor valorpagamento";
        query += " from entidade ent,contas_pagar cp,contas_pagar_parcelas cpp";
        query += " left join contas_pagar_baixas baixas on baixas.id_contas_pagar_parcela = cpp.id and baixas.id_empresa = @idempresa";
        query += " left join contas_pagar_baixas_formaspagamento formas on formas.id_contas_pagar_baixas = baixas.id and formas.id_empresa = @idempresa";
        query += " where cp.id_empresa = @idempresa";
        query += " and (@idtitulo is null or cp.id = @idtitulo)";
        query += " and cpp.id_empresa = @idempresa and cpp.id_contas_pagar = cp.id";
        query += " and (@idparcela is null or cpp.id = @idparcela)";
        query += " and ent.id = cp.id_entidade ";
        query += " order by replicate(' ',10 - len(cpp.nr_parcela)) + rtrim(cpp.nr_parcela),baixas.dt_data";

        sql.close();
        sql.connect(config, function (err) {    
            if (err){
                resposta = {
                    status: -2,
                    mensagem: ["" + err],
                    dadosTitulo: null
                }
                res.json(resposta);
            }
            else{
                var request = new sql.Request();
                request.input("idempresa",EnterpriseID);
                request.input("idtitulo",parametros.idTitulo == "" ? null : parametros.idTitulo);
                request.input("idparcela",parametros.idParcela == "" ? null : parametros.idParcela);
                console.log(query)
                request.query(query, function (err, recordset) {
                    try{
                        if (err){
                            resposta = {
                                status: -3,
                                mensagem: ["" + err],
                                dadosTitulo: null
                            }
                            res.json(resposta);
                        }
                        else{
                            var element = recordset.recordsets[0];
                            var i = 0;
                            if(element.length == 0){
                                resposta = {
                                    status: 0,
                                    mensagem: ["Não forma encontrados os dados para o título/parcela."],
                                    dadosTitulo: null
                                }
                                res.json(resposta);
                            }
                            else{
                                resposta = {
                                    status: 0,
                                    mensagem: [],
                                    dadosTitulo: null
                                }
                                resposta.dadosTitulo = {
                                    idTitulo : element[i].idtitulo,
                                    idEntidade : element[i].identidade,
                                    razaoSocial : element[i].razaosocial,
                                    titulo : element[i].titulo,
                                    valor: element[i].valortitulo,
                                    emissao : element[i].emissao,
									cancelamentoTitulo : (element[i].cancelamentoDocumento ? element[i].cancelamentoDocumento : ""),
                                    competencia : element[i].competencia,
                                    idPedido : (element[i].idcompra == null ? "" : element[i].idcompra),
                                    pedido : (element[i].pedido == null ? "" : element[i].pedido),
                                    idNotaFiscal : (element[i].idnotafiscal == null ? "" : element[i].idnotafiscal),
                                    notaFiscal : (element[i].notafiscal == null ? "" : element[i].notafiscal),
                                    idParcelamento: (element[i].idparcelamento == null ? "" : element[i].idparcelamento),
                                    idContaFinanceira : (element[i].idcontafinanceira == null ? "" : element[i].idcontafinanceira),
                                    dre : (element[i].dre ? 1 : 0),
                                    observacao : element[i].observacao,
                                    valorBaixas : 0,
                                    parcelas : []
                                }
                                while(i < element.length){
                                    idParcela = element[i].idparcela;
                                    parcela = {
                                        idParcela : element[i].idparcela,
                                        idBanco : (element[i].idbanco == null ? "" : element[i].idbanco),
                                        idFormaPagamento : (element[i].idformapagamentoparc == null ? "" : element[i].idformapagamentoparc),
                                        idConfCNAB : (element[i].idconfcnab == null ? "" : element[i].idconfcnab),
                                        idContaFinanceira : (element[i].idcontafinanceiraparc == null ? "" : element[i].idcontafinanceiraparc),
                                        documento : element[i].documentoparc,
                                        parcela : element[i].parcela,
                                        vencimento : element[i].vencimento,
										cancelamentoParcela : (element[i].cancelamentoParcela ? element[i].cancelamentoParcela : ""),
                                        valor : element[i].valorparcela,
                                        idStatus : (element[i].idstatus == null ? "" : element[i].idstatus),
                                        fluxoCaixa : (element[i].fluxocaixa ? 1 : 0),
                                        valorBaixas : 0,
                                        baixas : []
                                    }
                                    if(element[i].idbaixa != null){
                                        while (i < element.length && element[i].idparcela == idParcela){
                                            idBaixa = element[i].idbaixa;
                                            baixa = {
                                                idBaixa : element[i].idbaixa,
                                                idProcessopagamento : element[i].idprocesso,
                                                dataBaixa : element[i].databaixa,
                                                valorBaixa : element[i].valorbaixa,
                                                formasPagamento : []
                                            }
                                            parcela.valorBaixas += element[i].valorbaixa;
                                            resposta.dadosTitulo.valorBaixas += element[i].valorbaixa;

                                            if(element[i].idformapagamento != null){
                                                while(i < element.length && element[i].idbaixa == idBaixa){
                                                    formaRec = {
                                                        idFormapagamento : element[i].idformapagamento,
                                                        idBanco : element[i].idbancopagamento,
                                                        documento : element[i].documentopagamento,
                                                        idDsgBanco : (element[i].idbancopagador == null ? "" : element[i].idbancopagador),
                                                        contaPag: element[i].contapagador,
                                                        agenciaPag: element[i].agenciapagador,
                                                        valor : element[i].valorpagamento
                                                    }
                                                    baixa.formasPagamento.push(formaRec);
                                                    i++
                                                }
                                            }
                                            else{
                                                i++;
                                            }
                                            parcela.baixas.push(baixa);
                                        }
                                    }
                                    else{
                                        i++;
                                    }

                                    resposta.dadosTitulo.parcelas.push(parcela);
                                }
                                resposta.status = 1
                                resposta.mensagem = [];
                                resposta.mensagem.push("Ok");
                                res.json(resposta);
                            }
                        }
                    }
                    catch(err){
                        resposta = {
                            status: -4,
                            mensagem: ["" + err],
                            dadosTitulo: null
                        }
                        res.json(resposta);
                    }
                })
            }
        })
    }
    catch(erro){
        resposta = {
            status: -1,
            mensagem: ["" + erro],
            dadosTitulo: null
        }
        sql.close();
        res.json(resposta);
    }
})





/*------------------------------------------------------------------------------
Criar as parcelas a partir do pedido de compras.
--------------------------------------------------------------------------------
*/
router.route('/gerarparcelascompra').post(function(req, res) {
    var query = "";
    var nrParcela = 0;
    var total = 0;
    var origem = null;
    var parcela = null;
    var resposta = null;
    var parametros = null;
    var titulo = null;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    parametros = req.body.parametros;

    origem = funcoesFinanceiro.buscaOrigemNome("compras");    

    try{
        query += "select id,id_entidade,nr_pedido,dt_emissao,id_parcelamento,id_formapagamento,id_notafiscal,vl_totalprodutos,vl_totalservicos from compra";
        query += " where id_empresa = '" + EnterpriseID + "'";
        query += " and id = '" + parametros.idCompra + "'; ";

        sql.close();
        sql.connect(config, function (err) {
            if (err){
                resposta = {
                    status: -2,
                    mensagem: ["" + err],
                    titulo: null
                }
                res.json(resposta);
            }
            else{
                var request = new sql.Request();
                request.query(query, function (err, recordset) {
                    if (err){
                        resposta = {
                            status: -3,
                            mensagem: ["" + err],
                            titulo: null
                        }
                        res.json(resposta);
                    }
                    else{
                        var compra = recordset.recordsets[0][0];
                        var i = 0;

                        funcoesFinanceiro.gerarparcelas(config,EnterpriseID,compra.id_parcelamento,compra.vl_totalprodutos + compra.vl_totalservicos,new Date(compra.dt_emissao),(function(respostaParcelas){
                            try{
                                if(respostaParcelas.status > 0){
                                    titulo = {
                                        idEmpresa: EnterpriseID,
                                        idUsuario: parametros.idUsuario,
                                        idTitulo: "",
                                        idEntidade: compra.id_entidade,
                                        idPedido: parametros.idCompra,
                                        idNotaFiscal: compra.id_notafiscal,
                                        nrTitulo: compra.nr_pedido,
                                        emissao: new Date(compra.dt_emissao).toISOString(),
                                        competencia: "",
                                        valor: compra.vl_totalprodutos + compra.vl_totalservicos,
                                        idContaFinanceira: "",
                                        idParcelamento: compra.id_parcelamento,
                                        observacao: "",
                                        dre: 0,
                                        idOrigem: origem.id,
                                        parcelas: []
                                    };
                        
                                    for(i = 0; i < respostaParcelas.parcelas.length; i++){
                                        nrParcela++;
                                        parcela = {
                                            idParcela: "",
                                            documento: compra.nr_pedido,
                                            parcela: respostaParcelas.parcelas[i].parcela,
                                            vencimento: new Date(respostaParcelas.parcelas[i].vencimento).toISOString(),
                                            valor: respostaParcelas.parcelas[i].valor,
                                            idBanco: "",
                                            idFormaPagamento: compra.id_formapagamento,
                                            idContaFinanceira: "",
                                            fluxoCaixa: "1"
                                        };
                                        total += parseFloat(respostaParcelas.parcelas[i].valor);
                                        titulo.parcelas.push(parcela);
                                    }                        
                                    titulo.valor = total;

                                    if(total > 0){
                                        funAtualizarConta(titulo,(function(repostacallback){
                                            res.json(repostacallback);
                                        }));
                                    }
                                    else{
                                        resposta = {
                                            status: 0,
                                            mensagem: ["Não foram geradas parcelas para esta compra"],
                                            titulo: null
                                        }
                                        res.json(reposta);
                                    }
                                }
                                else{                                    
                                    sql.close();
                                    res.json(respostaParcelas);
                                }
                            }
                            catch(erro){
                                resposta.status = -4;
                                resposta.mensagem = [];
                                resposta.mensagem.push("criarparcelas: " + erro);
                                resposta.parcelas = [];
                                sql.close();
                                res.json(resposta);
                            }
                        }));
                    }
                })
            }
        })
    }
    catch(erro){
        resposta = {
            status: -1,
            mensagem: [],
            titulo: null
        }
        resposta.mensagem.push("" + erro);
        res.json(resposta);
    }
})


/*------------------------------------------------------------------------------
Inclui ou atualiza uma conta com suas parcelas.
--------------------------------------------------------------------------------
*/
router.route('/atualizarconta').post(function(req, res) {
    var query = "";
    var queryItens = "";
    var parcela = 0;
    var resposta = null;
    var parametros = null;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    resposta = {
        status: 0,
        mensagem: [],
        titulo: null
    }

    try{
        parametros = req.body.parametros;

        parametros.idOrigem = null;

        funAtualizarConta(parametros,(function(repostacallback){
            res.json(repostacallback);
        }));
    }
    catch(erro){
        resposta.status = -1;
        resposta.mensagem = [];
        resposta.mensagem.push("" + erro);
        resposta.titulo = null;
        res.json(resposta);
    }
})


/*------------------------------------------------------------------------------
Inclui ou atualiza uma conta com suas parcelas.
--------------------------------------------------------------------------------
*/
function funAtualizarConta(parametros,callbackf) {
    var query = "";
    var queryItens = "";
    var parcela = 0;
	var totalParcelas = 0;
    var resposta = null;
	var conexao = null;
	var dataEmissao = null;
	var dataVencimento = null;

    resposta = {
        status: 1,
        mensagem: [],
        titulo: null
    }

    try{
        if(!parametros.idEntidade){
            resposta.status = 0;
            resposta.mensagem.push("O fornecedor não foi informado.");
        }

        if(!parametros.nrTitulo){
            resposta.status = 0;
            resposta.mensagem.push("O documento não foi informado.");
        }

        if(!parametros.idParcelamento){
            resposta.status = 0;
            resposta.mensagem.push("A forma de parcelamento não foi informada.");
        }

        if(!parametros.emissao || parametros.emissao.indexOf("undefined") >= 0){
            resposta.status = 0;
            resposta.mensagem.push("A data de emissão não foi informada.");
        }

        if(!parametros.valor || parametros.valor == "undefined" || isNaN(parametros.valor)){
            resposta.status = 0;
            resposta.mensagem.push("Valor do documento é inválido ou não foi informado.");
        }

        if(!(parametros.hasOwnProperty("parcelas")) || parametros.parcelas.length == 0){
            resposta.status = 0;
            resposta.mensagem.push("As parcelas não foram informadas.");
        }
        else{
            dataEmissao = new Date(parametros.emissao.substring(0,4),parseInt(parametros.emissao.substring(5,7)) - 1,parametros.emissao.substring(8,10));
            for(parcela = 0; parcela < parametros.parcelas.length; parcela++){
                if(parametros.parcelas[parcela].documento == "" || parametros.parcelas[parcela].documento == "undefined"){
                    resposta.status = 0;
                    resposta.mensagem.push("A parcela " + (parcela + 1).toString().trim() + " não possui o documento.");
                }
                if(parametros.parcelas[parcela].parcela == "" || parametros.parcelas[parcela].parcela == "undefined"){
                    resposta.status = 0;
                    resposta.mensagem.push("A parcela " + (parcela + 1).toString().trim() + " não possui o número informado.");
                }
                if(parametros.parcelas[parcela].vencimento == "" || parametros.parcelas[parcela].vencimento == "undefined"){
                    resposta.status = 0;
                    resposta.mensagem.push("A parcela " + (parcela + 1).toString().trim() + " não possui a data de vencimento.");
                }
				else{
					dataVencimento = new Date(parametros.parcelas[parcela].vencimento.substring(0,4),parseInt(parametros.parcelas[parcela].vencimento.substring(5,7)) - 1,parametros.parcelas[parcela].vencimento.substring(8,10));
					if(dataVencimento.getTime() < dataEmissao.getTime()){
						resposta.status = 0;
						resposta.mensagem.push("A data de vencimento da parcela " + (parcela + 1).toString().trim() + " é anterior à data de emissão do documento.");
					}
				}
                if(parametros.parcelas[parcela].valor == "" || parametros.parcelas[parcela].valor == "undefined" || isNaN(parametros.parcelas[parcela].valor)){
                    resposta.status = 0;
                    resposta.mensagem.push("A parcela " + (parcela + 1).toString().trim() + " não possui valor.");
                }
				else{
					totalParcelas += parseFloat(parametros.parcelas[parcela].valor);
				}
            }
			if(resposta.status == 1){
				if(parseFloat(parametros.valor) != totalParcelas){
					resposta.status = 0;
					resposta.mensagem.push("A soma dos valores das parcelas difere do total do documento.")
				}
			}
        }

        if(resposta.status == 1){
            if(parametros.idTitulo == ""){
                parametros.idTitulo = general.guid();
                query = "insert into contas_pagar (id,id_empresa,id_entidade,id_compra,id_notafiscal,id_parcelamento,id_plano_contas_financeiro,id_origem,nm_documento,dt_emissao,nm_competencia,vl_valor,nm_observacao) values("
                query += "'" + parametros.idTitulo + "',";
                query += "'" + EnterpriseID + "',";
                query += "'" + parametros.idEntidade + "',";
                query += (!parametros.idPedido ? "null" : "'" + parametros.idPedido + "'") + ",";
                query += (!parametros.idNotaFiscal ? "null" : "'" + parametros.idNotaFiscal + "'") + ",";
                query += "'" + parametros.idParcelamento + "',";
                query += (!parametros.idContaFinanceira ? "null" : "'" + parametros.idContaFinanceira + "'") + ",";
                query += (!parametros.idOrigem ? "null" : "'" + parametros.idOrigem + "'") + ",";
                query += "'" + parametros.nrTitulo + "',";
                query += "'" + parametros.emissao + "',";
                query += "'" + parametros.competencia  + "',";
                query += parametros.valor.toString().trim() + ",";
                query += "'" + parametros.observacao + "'";
                query += "); ";
				
				query += "insert into contas_pagar_parcelas (id,id_empresa,id_contas_pagar,id_Banco,id_forma_pagamento,id_plano_contas_financeiro,nr_parcela,nm_documento,sn_fluxocaixa,dt_data_vencimento,vl_valor)";
				query += " values ";
				for(parcela = 0; parcela < parametros.parcelas.length; parcela++){
					if(parcela > 0)
						query += ",";
					
					parametros.parcelas[parcela].idParcela = general.guid();
					query += "(";
					query += "'" + parametros.parcelas[parcela].idParcela + "',";
					query += "'" + EnterpriseID + "',";
					query += "'" + parametros.idTitulo + "',";
					query += (!parametros.parcelas[parcela].idBanco ? "null" : "'" + parametros.parcelas[parcela].idBanco + "'") + ",";
					query += (!parametros.parcelas[parcela].idFormaPagamento ? "null" : "'" + parametros.parcelas[parcela].idFormaPagamento + "'") + ",";
					query += (!parametros.parcelas[parcela].idContaFinanceira ? "null" : "'" + parametros.parcelas[parcela].idContaFinanceira + "'") + ",";
					query += "'" + parametros.parcelas[parcela].parcela + "',";
					query += "'" + parametros.parcelas[parcela].documento + "',";
					query +=  parametros.parcelas[parcela].fluxoCaixa + ",";
					query += "'" + parametros.parcelas[parcela].vencimento + "',";
					query += parametros.parcelas[parcela].valor.toString().trim()
					query += ")";
				}
				
				conexao = new sql.ConnectionPool(config,function (err) {
					if (err){
						resposta.status = -2;
						resposta.mensagem = [];
						resposta.mensagem.push("" + err);
						respsota.titulo = null;
						callbackf(resposta);
					}
					else{
						try{
							var transacao = conexao.transaction();
							transacao.begin(err =>{
								var request = transacao.request();
								
								request.query(query, function (err, recordset) {
									if(err){
										resposta.status = -3;
										resposta.mensagem = ["" + err];
										resposta.titulo =  null;
										transacao.rollback();
										conexao.close();
										callbackf(resposta);
									}
									else{
										resposta.status =  1;
										resposta.mensagem = ["ok"];
										resposta.titulo = parametros;
										transacao.commit();
										conexao.close();
										callbackf(resposta);
									}
								});
							})
						}
						catch(err){
							resposta.status = -4;
							respsosta.mensagem = ["ok"];
							resposta.titulo = null;
							conexao.close();
							callbackf(resposta);
						}
					}
				});
            }
            else{
				query = "select sum(vl_valor) totalbaixas from contas_pagar_baixas where id_empresa = '" + EnterpriseID + "' and id_contas_pagar_parcela in (select id from contas_pagar_parcelas where id_contas_pagar = ";
				query += "(select id from contas_pagar where id_empresa = '" + EnterpriseID + "' and id = '" + parametros.idTitulo + "'))";
				
				conexao = new sql.ConnectionPool(config,function (err) {
					if (err){
						resposta.status = -5;
						resposta.mensagem = ["" + err];
						resposta.titulo = null;
						callbackf(resposta);
					}
					else{
						try{
							var request = conexao.request();
							request.query(query, function (err, recordset) {
								try{
									if(err){
										resposta.status = -6;
										resposta.mensagem = ["" + err];
										resposta.titulo = null;
										conexao.close();
										callbackf(resposta);
									}
									else{
										if(recordset.recordsets[0][0].totalbaixas == null){
											queryItens = "delete contas_pagar_parcelas where id_empresa = '" + EnterpriseID + "' and id_contas_pagar = '" + parametros.idTitulo + "'; "
											
											queryItens += "update contas_pagar set "
											queryItens += "id_parcelamento = '" + parametros.idParcelamento + "',";
											queryItens += "id_plano_contas_financeiro = " + (!parametros.idContaFinanceira ? "null" : "'" + parametros.idContaFinanceira + "'") + ",";
											queryItens += "nm_competencia = '" + parametros.competencia + "',"
											queryItens += "nm_observacao = '" + parametros.observacao + "'";
											queryItens += " where id = '" + parametros.idTitulo + "'";
											queryItens += " and id_empresa = '" + EnterpriseID + "'; ";
										
											queryItens += "insert into contas_pagar_parcelas (id,id_empresa,id_contas_pagar,id_Banco,id_forma_pagamento,id_plano_contas_financeiro,nr_parcela,nm_documento,sn_fluxocaixa,dt_data_vencimento,vl_valor)";
											queryItens += " values ";
											for(parcela = 0; parcela < parametros.parcelas.length; parcela++){
												if(parcela > 0)
													queryItens += ",";
												
												parametros.parcelas[parcela].idParcela = general.guid();
												queryItens += "(";
												queryItens += "'" + parametros.parcelas[parcela].idParcela + "',";
												queryItens += "'" + EnterpriseID + "',";
												queryItens += "'" + parametros.idTitulo + "',";
												queryItens += (!parametros.parcelas[parcela].idBanco ? "null" : "'" + parametros.parcelas[parcela].idBanco + "'") + ",";
												queryItens += (!parametros.parcelas[parcela].idFormaPagamento ? "null" : "'" + parametros.parcelas[parcela].idFormaPagamento + "'") + ",";
												queryItens += (!parametros.parcelas[parcela].idContaFinanceira ? "null" : "'" + parametros.parcelas[parcela].idContaFinanceira + "'") + ",";
												queryItens += "'" + parametros.parcelas[parcela].parcela + "',";
												queryItens += "'" + parametros.parcelas[parcela].documento + "',";
												queryItens +=  parametros.parcelas[parcela].fluxoCaixa + ",";
												queryItens += "'" + parametros.parcelas[parcela].vencimento + "',";
												queryItens += parametros.parcelas[parcela].valor.toString().trim();
												queryItens += ")";
											}
										}
										else{
											queryItens = "update contas_pagar set "
											queryItens += "id_plano_contas_financeiro = " + (!parametros.idContaFinanceira ? "null" : "'" + parametros.idContaFinanceira + "'") + ",";
											queryItens += "nm_competencia = '" + parametros.competencia + "',"
											queryItens += "nm_observacao = '" + parametros.observacao + "'";
											queryItens += " where id = '" + parametros.idTitulo + "'";
											queryItens += " and id_empresa = '" + EnterpriseID + "'";
																					
											for(parcela = 0; parcela < parametros.parcelas.length; parcela++){
												queryItens += "; ";
												queryItens += "update contas_pagar_parcelas set ";
												queryItens += "id_banco = " + (!parametros.parcelas[parcela].idBanco ? "null" : "'" + parametros.parcelas[parcela].idBanco + "'") + ",";
												queryItens += "id_forma_pagamento = " + (!parametros.parcelas[parcela].idFormaPagamento ? "null" : "'" + parametros.parcelas[parcela].idFormaPagamento + "'") + ",";
												queryItens += "id_plano_contas_financeiro = " + (!parametros.parcelas[parcela].idContaFinanceira ? "null" : "'" + parametros.parcelas[parcela].idContaFinanceira + "'") + ",";
												queryItens += "nm_documento = '" + parametros.parcelas[parcela].documento + "',";
												queryItens += "sn_fluxocaixa = " + parametros.parcelas[parcela].fluxoCaixa + ",";
												queryItens += "dt_data_vencimento = '" + parametros.parcelas[parcela].vencimento + "',";
												queryItens += "vl_valor = " + parametros.parcelas[parcela].valor.toString().trim();
												queryItens += " where id_empresa = '" + EnterpriseID + "'";
												queryItens += " and id = '" + parametros.parcelas[parcela].idParcela + "'";
											}
										}
										
										var transacao = conexao.transaction();
										transacao.begin(err =>{
											var request = transacao.request();
											
											request.query(queryItens, function (err, recordset) {
												if(err){
													resposta.status = -7;
													resposta.mensagem = ["" + err];
													resposta.titulo =  null;
													transacao.rollback();
													conexao.close();
													callbackf(resposta);
												}
												else{
													resposta.status =  1;
													resposta.mensagem = ["ok"];
													resposta.titulo = parametros;
													transacao.commit();
													conexao.close();
													callbackf(resposta);
												}
											});
										});
									}
								}
								catch(err){
									resposta.status = -8;
									resposta.mensagem = ["" + err];
									resposta.titulo = null;
									callbackf(resposta);
								}
							});
						}
						catch(err){
							resposta.status = -9;
							resposta.mensagem = ["" + err];
							resposta.titulo = null;
							callbackf(resposta);
						}
					}
				});
			}
        }
        else{
            resposta.titulo == null;
            callbackf(resposta);
        }
    }
    catch(erro){
        resposta.status = -1;
        resposta.mensagem = [];
        resposta.mensagem.push("" + erro);
        resposta.titulo = null;
        callbackf(resposta);
    }
}



/*------------------------------------------------------------------------------
Registra o pagamento de uma conta
--------------------------------------------------------------------------------
*/
router.route('/realizarpagamento').post(function(req, res) {
    var query = "";
    var queryBaixa = "";
    var resposta = null;
    var parametros = null;
    var formasPagamento = require("./formaspagamento");

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    resposta = {
        status: 1,
        mensagem: [],
        titulo: null
    }
    try{
        parametros = req.body.parametros;

        parametros.data = parametros.dataPagamento;
        parametros.tipoMovimento = "D";
        
        /* Validando os dados */        
        resposta = formasPagamento.validarDados(parametros);

        if(resposta.status <= 0){
            resposta.titulo = null;
            res.json(resposta);
        }
        else{
            query += "select cp.id idconta,parc.nm_documento documento,parc.nr_parcela parcela,ent.nm_razaosocial razaosocial"
            query += " from contas_pagar_parcelas parc,contas_pagar cp,entidade ent"
            query += " where parc.id = '" + parametros.idTitulo + "'";
            query += " and parc.id_empresa = '" + EnterpriseID + "'";
            query += " and cp.id = parc.id_contas_pagar and cp.id_empresa = '" + EnterpriseID + "'";
            query += " and ent.id = cp.id_entidade and ent.id_empresa = '" + EnterpriseID + "'";

            sql.close();
            sql.connect(config, function (err) {    
                if (err){
                    resposta.status = -2;
                    resposta.mensagem = [];
                    resposta.mensagem.push("" + err);
                    resposta.titulo = null;
                    res.json(resposta);
                }
                else{
                    try{
                        var request = new sql.Request();
                        request.query(query, function (err, recordset) {
                            if (err){
                                resposta.status = -3;
                                resposta.mensagem = [];
                                resposta.mensagem.push("" + err);
                                resposta.titulo = null;
                                res.json(resposta);
                            }
                            else{
                                try{
                                    var element = recordset.recordsets[0];
                                    var descricao = "";

                                    descricao = "Pagamento do documento " + element[0].documento.trim() + "/" + element[0].parcela;
                                    descricao += " (" + element[0].razaosocial.trim() + ")";

                                    parametros.idBaixa = general.guid();
                                    parametros.idBaixaProcesso = general.guid();
                                    parametros.idBaixaForma = general.guid();
                                    parametros.idMovimento = general.guid();
                        
                                    queryBaixa += " update contas_pagar_parcelas set ";
                                    queryBaixa += " id_banco = '" + parametros.idBanco + "',";
                                    queryBaixa += " id_forma_pagamento = '" + parametros.idFormaPagamento + "'"
                                    queryBaixa += " where id = '" + parametros.idTitulo + "'"
                                    queryBaixa += " and id_empresa = '" + EnterpriseID + "'";
                                    queryBaixa += "; ";
                                    
                                    queryBaixa += "insert into contas_pagar_baixas (id,id_empresa,id_contas_pagar_parcela,id_processo_pagamento,dt_data,vl_valor) values (";
                                    queryBaixa += "'" + parametros.idBaixa + "',";
                                    queryBaixa += "'" + EnterpriseID + "',";
                                    queryBaixa += "'" + parametros.idTitulo + "',";
                                    queryBaixa += "'" + parametros.idBaixaProcesso + "',";
                                    queryBaixa += "'" + parametros.dataPagamento + "',";
                                    queryBaixa += parametros.valor;
                                    queryBaixa += "); ";
                        
                                    queryBaixa += "insert into contas_pagar_baixas_formaspagamento (id,id_empresa,id_processo_pagamento,id_contas_pagar_baixas,id_formapagamento,id_banco,id_movimento,nm_documento,id_dsg_banco,nm_conta,nm_agencia,vl_valor) values (";
                                    queryBaixa += "'" + parametros.idBaixaForma + "',";
                                    queryBaixa += "'" + EnterpriseID + "',";
                                    queryBaixa += "'" + parametros.idBaixaProcesso + "',";
                                    queryBaixa += "'" + parametros.idBaixa + "',";
                                    queryBaixa += "'" + parametros.idFormaPagamento + "',";
                                    queryBaixa += "'" + parametros.idBanco + "',";
                                    queryBaixa += "'" + parametros.idMovimento + "',";
                                    queryBaixa += "'" + parametros.documento + "',";
                                    queryBaixa += (parametros.idBancoOper == "" ? "null" : "'" + parametros.idBancoOper + "'") + ",";
                                    queryBaixa += "'" + parametros.contaOper + "',";
                                    queryBaixa += "'" + parametros.agenciaOper + "',";
                                    queryBaixa += parametros.valor;
                                    queryBaixa += "); ";
                                    
                                    queryBaixa += "insert into movimentacao_bancaria (id,id_empresa,id_processo_pagamento,id_dsg_banco,nm_agencia,nm_conta,id_banco,dt_data,vl_valor,nm_tipo_movimentacao,nm_descricao,nm_documento,sn_conciliado) values ("
                                    queryBaixa += "'" + parametros.idMovimento + "',";
                                    queryBaixa += "'" + EnterpriseID + "',";
                                    queryBaixa += "'" + parametros.idBaixaProcesso + "',";
                                    queryBaixa += (parametros.idBancoOper == "" ? "null" : "'" + parametros.idBancoOper + "'") + ",";
                                    queryBaixa += "'" + parametros.agenciaOper + "',";
                                    queryBaixa += "'" + parametros.contaOper + "',";
                                    queryBaixa += "'" + parametros.idBanco + "',";
                                    queryBaixa += "'" + parametros.dataPagamento + "',";
                                    queryBaixa += "-" + parametros.valor + ",";
                                    queryBaixa += "'D',";
                                    queryBaixa += "'" + descricao + "',";
                                    queryBaixa += "'" + parametros.documento + "',";
                                    queryBaixa += "0";
                                    queryBaixa += "); ";

                                    var transacao = new sql.Transaction();
                                    transacao.begin(err =>{
                                        try{
                                            var request = new sql.Request(transacao);
                                            request.query(queryBaixa, function (err, recordset) {
                                                if (err){
                                                    resposta.status = -4;
                                                    resposta.mensagem = [];
                                                    resposta.mensagem.push("" + err);
                                                    resposta.titulo = null;
                                                    transacao.rollback();
                                                    res.json(resposta);
                                                }
                                                else{
                                                    resposta.status = 1;
                                                    resposta.mensagem = ["ok"];
                                                    resposta.titulo =  parametros;
                                                    transacao.commit();
                                                    res.json(resposta);
                                                }
                                            })
                                        }
                                        catch(err){
                                            resposta.status = -5;
                                            resposta.mensagem = [];
                                            resposta.mensagem.push("" + err);
                                            resposta.titulo = null;
                                            res.json(resposta);                                    
                                        }
                                    })
                                }
                                catch(err){
                                    resposta.status = -6;
                                    resposta.mensagem = [];
                                    resposta.mensagem.push("" + err);
                                    resposta.titulo = null;
                                    res.json(resposta);                                    
                                }
                            }
                        })
                    }
                    catch(err){
                        resposta.status = -7;
                        resposta.mensagem = [];
                        resposta.mensagem.push("" + err);
                        resposta.titulo = null;
                        res.json(resposta);                                    
                    }
                }
            })
        }
    }
    catch(err){
        resposta.status = -1;
        resposta.mensagem = [];
        resposta.mensagem.push("" + err);
        resposta.titulo = null;
        res.json(resposta);
    }
})


/*------------------------------------------------------------------------------
Cancela o pagamento de uma conta
--------------------------------------------------------------------------------
*/
router.route('/cancelarpagamento').post(function(req, res) {
    var query = "";
    var queryBaixa = "";
    var resposta = null;
    var parametros = null;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    resposta = {
        status: 0,
        mensagem: [],
        baixa: null
    }

    try{
        parametros = req.body.parametros;

        query = "select id,id_contas_pagar_parcela,id_processo_pagamento,dt_data,vl_valor from contas_pagar_baixas"
        query += " where id = @idbaixa and id_empresa = @idempresa"

        sql.close();
        sql.connect(config, function (err) {    
            if (err){
                resposta.status = -2;
                resposta.mensagem = [];
                resposta.mensagem.push("" + err);
                resposta.baixa = null;
                res.json(resposta);
            }
            else{
                try{
                    var request = new sql.Request();
                    request.input("idempresa",EnterpriseID);
                    request.input("idbaixa",parametros.idBaixa);
                    request.query(query, function (err, recordset) {
                        if (err){
                            resposta.status = -3;
                            resposta.mensagem = [];
                            resposta.mensagem.push("" + err);
                            resposta.baixa = null;
                            res.json(resposta);
                        }
                        else{
                            try{
                                var element = recordset.recordsets[0];
                                resposta.baixa = {
                                    idBaixa: element[0].id,
                                    idParcela: element[0].id_contas_pagar_parcela,
                                    idProcesso: element[0].id_processo_pagamento,
                                    data: element[0].dt_data,
                                    valor: element[0].vl_valor
                                }
                                query += " delete movimentacao_bancaria where id in (select id_movimento from contas_pagar_baixas_formaspagamento where id_contas_pagar_baixas = @idbaixa and id_empresa = @idempresa); ";
                                query += "delete contas_pagar_baixas_formaspagamento where id_contas_pagar_baixas = @idbaixa and id_empresa = @idempresa; ";
                                query += " delete contas_pagar_baixas where id = @idbaixa and id_empresa = @idempresa;";            
                                var transacao = new sql.Transaction();
                                transacao.begin(err =>{
                                    try{
                                        var request = new sql.Request(transacao);
                                        request.input("idempresa",EnterpriseID);
                                        request.input("idbaixa",parametros.idBaixa);
                                        request.query(query, function (err, recordset) {
                                            if (err){
                                                resposta.status = -4;
                                                resposta.mensagem = [];
                                                resposta.mensagem.push("" + err);
                                                resposta.baixa = null;
                                                transacao.rollback();
                                                res.json(resposta);
                                            }
                                            else{
                                                resposta.status = 1;
                                                resposta.mensagem = ["ok"];
                                                transacao.commit();
                                                res.json(resposta);           
                                            }
                                        })
                                    }
                                    catch(err){
                                        resposta.status = -5;
                                        resposta.mensagem = [];
                                        resposta.mensagem.push("" + err);
                                        resposta.baixa = null;
                                        res.json(resposta);                                    
                                    }
                                })
                            }
                            catch(err){
                                resposta.status = -7;
                                resposta.mensagem = [];
                                resposta.mensagem.push("" + err);
                                resposta.baixa = null;
                                res.json(resposta);                                    
                            }
                        }
                    })
                }
                catch(err){
                    resposta.status = -6;
                    resposta.mensagem = [];
                    resposta.mensagem.push("" + err);
                    resposta.baixa = null;
                    res.json(resposta);                                    
                }
            }
        })
    }
    catch(erro){
        resposta.status = -1;
        resposta.mensagem = [];
        resposta.mensagem.push("" + erro);
        baixa = null;
        res.json(resposta);
    }
})

/*------------------------------------------------------------------------------
Registra o pagamento de várias contas
--------------------------------------------------------------------------------
*/
router.route('/realizarmultipagamento').post(function(req, res) {
    var query = "";
    var resposta = null;
    var validacaoForma = null;
    var tituloBaixado = null;
    var tituloRecusado = null;
    var parametros = null;
    var parcela = 0;
    var mensagem = 0;
    var dadosFormaPagamento = null;    
    var formasPagamento = require("./formaspagamento");

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    resposta = {
        status: 0,
        mensagem: [],
        titulosBaixados: [],
        titulosRecusados: []
    }
    try{
        parametros = req.body.parametros;

        for(parcela = 0; parcela < parametros.listaParcelas.length; parcela++){
            query += "select cp.id idconta,parc.id idparcela,parc.nm_documento documento,parc.nr_parcela parcela,parc.id_banco idbanco,parc.id_forma_pagamento idformapagamento,parc.vl_valor valorparcela,ent.nm_razaosocial razaosocial,"
            query += "(select sum(baixas.vl_valor) from contas_pagar_baixas baixas where baixas.id_contas_pagar_parcela = parc.id and baixas.id_empresa = '" + EnterpriseID + "')  totalbaixas";
            query += " from contas_pagar_parcelas parc,contas_pagar cp,entidade ent"
            query += " where parc.id = '" + parametros.listaParcelas[parcela] + "'";
            query += " and parc.id_empresa = '" + EnterpriseID + "'";
            query += " and cp.id = parc.id_contas_pagar and cp.id_empresa = '" + EnterpriseID + "'";
            query += " and ent.id = cp.id_entidade and ent.id_empresa = '" + EnterpriseID + "'; ";
        }
        sql.close();
        sql.connect(config, function (err) {    
            if (err){
                resposta.status = -2;
                resposta.mensagem = [];
                resposta.mensagem.push("" + err);
                resposta.titulosBaixados = [];
                resposta.titulosRecusados = [];
                res.json(resposta);
            }
            else{
                try{
                    var request = new sql.Request();
                    request.query(query, function (err, recordset) {
                        if (err){
                            resposta.status = -3;
                            resposta.mensagem = [];
                            resposta.mensagem.push("" + err);
                            resposta.titulosBaixados = [];
                            resposta.titulosRecusados = [];
                            res.json(resposta);
                        }
                        else{
                            try{
                                var elementos = 0;
                                var element = null;
                                var descricao = "";
                                var queryParcela = "";
                                var queryBaixa = "";
                                var idBaixa = null;
                                var idBaixaProcesso = null;
                                var idBaixaForma = null;
                                var idBanco = null;
                                var idMovimento = null;
                                var dataPagamento = null;
                                var transacao = null;

                                for(elementos = 0; elementos < recordset.recordsets.length; elementos++){
                                    element = recordset.recordsets[elementos];

                                    tituloRecusado = {
                                        clifor: element[0].razaosocial,
                                        titulo: element[0].documento.trim() + "/" + element[0].parcela,
                                        mensagem: []
                                    }

                                    queryParcela = "";
                                    
                                    descricao = "Pagamento do documento " + element[0].documento.trim() + "/" + element[0].parcela;
                                    descricao += " (" + element[0].razaosocial.trim() + ")";

                                    idBaixa = general.guid();
                                    idBaixaProcesso = general.guid();
                                    idBaixaForma = general.guid();
                                    idMovimento = general.guid();
                                    idBanco = parametros.idBanco;
                                    idFormaPagamento = parametros.idFormaPagamento;

                                    if(parametros.dataPagamento == "")
                                        dataPagamento = new Date();
                                    else
                                        dataPagamento = new Date(parametros.dataPagamento);
                                    
                                    if(parametros.idBanco != ""){
                                        idBanco = parametros.idBanco;
                                        queryParcela += " id_banco = '" + idBanco + "'";
                                    }
                                    else{
                                        idBanco = element[0].idbanco == null ? "" : element[0].idbanco;
                                    }
                                    
                                    if(parametros.idFormaPagamento != ""){
                                        idFormaPagamento = parametros.idFormaPagamento;
                                        if(queryParcela != "")
                                            queryParcela += ",";
                                        queryParcela += " id_forma_pagamento = '" + idFormaPagamento + "'";
                                    }
                                    else{
                                        idFormaPagamento = element[0].idformapagamento == null ? "" : element[0].idformapagamento;
                                    }

                                    if(queryParcela != ""){
                                        queryBaixa += " update contas_pagar_parcelas set ";
                                        queryBaixa += queryParcela;
                                        queryBaixa += " where id = '" + element[0].idparcela + "'"
                                        queryBaixa += " and id_empresa = '" + EnterpriseID + "'";
                                        queryBaixa += "; ";
                                    }

                                    if(element[0].totalbaixas != null && parseFloat(element[0].totalbaixas) != 0)
                                        tituloRecusado.mensagem.push("Este título já foi recebido.");
                                    else{
                                        dadosFormaPagamento = {
                                            idBanco: idBanco,
                                            data: dataPagamento.toISOString(),
                                            documento: parametros.documento,
                                            idFormaPagamento: idFormaPagamento,
                                            valor: parametros.valor,
                                            idBancoOper: parametros.idBancoOper,
                                            agenciaOper: parametros.agenciaOper,
                                            contaOper: parametros.contaOper,
                                            tipoMovimento: "D"
                                        }
                                        validacaoForma = formasPagamento.validarDados(dadosFormaPagamento);
                                        if(validacaoForma.status <= 0){
                                            for(mensagem = 0; mensagem < validacaoForma.mensagem.length; mensagem++){
                                                tituloRecusado.mensagem.push(validacaoForma.mensagem[mensagem]);
                                            }
                                        }
                                    }

                                    if(tituloRecusado.mensagem.length == 0){                                    
                                        queryBaixa += "insert into contas_pagar_baixas (id,id_empresa,id_contas_pagar_parcela,id_processo_pagamento,dt_data,vl_valor) values (";
                                        queryBaixa += "'" + idBaixa + "',";
                                        queryBaixa += "'" + EnterpriseID + "',";
                                        queryBaixa += "'" + element[0].idparcela + "',";
                                        queryBaixa += "'" + idBaixaProcesso + "',";
                                        queryBaixa += "'" + dataPagamento.toISOString() + "',";
                                        queryBaixa += element[0].valorparcela;
                                        queryBaixa += "); ";
                            
                                        queryBaixa += "insert into contas_pagar_baixas_formaspagamento (id,id_empresa,id_processo_pagamento,id_contas_pagar_baixas,id_formapagamento,id_banco,id_movimento,nm_documento,id_dsg_banco,nm_conta,nm_agencia,vl_valor) values (";
                                        queryBaixa += "'" + idBaixaForma + "',";
                                        queryBaixa += "'" + EnterpriseID + "',";
                                        queryBaixa += "'" + idBaixaProcesso + "',";
                                        queryBaixa += "'" + idBaixa + "',";
                                        queryBaixa += "'" + idFormaPagamento + "',";
                                        queryBaixa += "'" + idBanco + "',";
                                        queryBaixa += "'" + idMovimento + "',";
                                        queryBaixa += "'" + parametros.documento + "',";
                                        queryBaixa += (parametros.idBancoOper == "" ? "null" : "'" + parametros.idBancoOper + "'") + ",";
                                        queryBaixa += "'" + parametros.contaOper + "',";
                                        queryBaixa += "'" + parametros.agenciaOper + "',";
                                        queryBaixa += element[0].valorparcela;
                                        queryBaixa += "); ";
                                        
                                        queryBaixa += "insert into movimentacao_bancaria (id,id_empresa,id_processo_pagamento,id_dsg_banco,nm_agencia,nm_conta,id_banco,dt_data,vl_valor,nm_tipo_movimentacao,nm_descricao,nm_documento,sn_conciliado) values ("
                                        queryBaixa += "'" + idMovimento + "',";
                                        queryBaixa += "'" + EnterpriseID + "',";
                                        queryBaixa += "'" + idBaixaProcesso + "',";
                                        queryBaixa += (parametros.idBancoOper == "" ? "null" : "'" + parametros.idBancoOper + "'") + ",";
                                        queryBaixa += "'" + parametros.agenciaOper + "',";
                                        queryBaixa += "'" + parametros.contaOper + "',";
                                        queryBaixa += "'" + idBanco + "',";
                                        queryBaixa += "'" + dataPagamento.toISOString() + "',";
                                        queryBaixa += "-" + element[0].valorparcela + ",";
                                        queryBaixa += "'D',";
                                        queryBaixa += "'" + descricao + "',";
                                        queryBaixa += "'" + parametros.documento + "',";
                                        queryBaixa += "0";
                                        queryBaixa += "); ";

                                        tituloBaixado = {
                                            idParcela: element[0].idparcela,
                                            valorBaixa: element[0].valorparcela,
                                            documento: parametros.documento,
                                            dataBaixa: dataPagamento.toISOString(),
                                            idBanco: idBanco,
                                            idFormaPagamento: idFormaPagamento
                                        }
                                        resposta.titulosBaixados.push(tituloBaixado);
                                    }
                                    else{
                                        resposta.titulosRecusados.push(tituloRecusado);
                                    }
                                }
                                transacao = new sql.Transaction();
                                transacao.begin(err =>{
                                    try{
                                        var request = new sql.Request(transacao);
                                        request.query(queryBaixa, function (err, recordset) {
                                            if (err){
                                                resposta.status = -4;
                                                resposta.mensagem = [];
                                                resposta.mensagem.push("" + err);
                                                resposta.titulosRecusados = [];
                                                resposta.titulosBaixados = [];
                                                transacao.rollback();
                                                res.json(resposta);
                                            }
                                            else{
                                                resposta.status = 1;
                                                if(resposta.titulosRecusados.length > 0){
                                                    resposta.mensagem = ["Alguns títulos não puderam ser baixados."];
                                                }
                                                else{
                                                    resposta.mensagem = ["ok"];
                                                }
                                                transacao.commit();
                                                res.json(resposta);
                                            }
                                        })
                                    }
                                    catch(err){
                                        resposta.status = -5;
                                        resposta.mensagem = [];
                                        resposta.mensagem.push("" + err);
                                        resposta.titulosBaixados = [];
                                        resposta.titulosRecusados = [];
                                        res.json(resposta);                                    
                                    }
                                })
                            }
                            catch(err){
                                resposta.status = -7;
                                resposta.mensagem = [];
                                resposta.mensagem.push("" + err);
                                resposta.titulosBaixados = [];
                                resposta.titulosRecusados = [];
                                res.json(resposta);                                    
                            }
                        }
                    })
                }
                catch(err){
                    resposta.status = -6;
                    resposta.mensagem = [];
                    resposta.mensagem.push("" + err);
                    resposta.titulosBaixados = [];
                    resposta.titulosRecusados = [];
                    res.json(resposta);                                    
                }
            }
        })
    }
    catch(err){
        resposta.status = -1;
        resposta.mensagem = [];
        resposta.mensagem.push("" + err);
        resposta.titulosBaixados = [];
        resposta.titulosRecusados = [];
        res.json(resposta);
    }
})



/*------------------------------------------------------------------------------
Cancela o pagamento de várias contas
--------------------------------------------------------------------------------
*/
router.route('/cancelarmultipagamento').post(function(req, res) {
    var query = "";
    var resposta = null;
    var pagamentoCancelado = null;
    var tituloRecusado = null;
    var parametros = null;
    var parcela = 0;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    resposta = {
        status: 0,
        mensagem: [],
        pagamentoCancelado: [],
        titulosRecusados: []
    }
    try{
        parametros = req.body.parametros;
        for(parcela = 0; parcela < parametros.listaParcelas.length; parcela++){
            query += "select cp.id idconta,parc.id idparcela,parc.nm_documento documento,parc.nr_parcela parcela,parc.vl_valor valorparcela,ent.nm_razaosocial razaosocial,"
            query += "(select sum(baixas.vl_valor) from contas_pagar_baixas baixas where baixas.id_contas_pagar_parcela = parc.id and baixas.id_empresa = '" + EnterpriseID + "')  totalbaixas";
            query += " from contas_pagar_parcelas parc,contas_pagar cp,entidade ent"
            query += " where parc.id = '" + parametros.listaParcelas[parcela] + "'";
            query += " and parc.id_empresa = '" + EnterpriseID + "'";
            query += " and cp.id = parc.id_contas_pagar and cp.id_empresa = '" + EnterpriseID + "'";
            query += " and ent.id = cp.id_entidade and ent.id_empresa = '" + EnterpriseID + "'; ";
        }
        sql.close();
        sql.connect(config, function (err) {    
            if (err){
                resposta.status = -2;
                resposta.mensagem = [];
                resposta.mensagem.push("" + err);
                resposta.pagamentoCancelado = [];
                resposta.titulosRecusados = [];
                res.json(resposta);
            }
            else{
                try{
                    var request = new sql.Request();
                    request.query(query, function (err, recordset) {
                        if (err){
                            resposta.status = -3;
                            resposta.mensagem = [];
                            resposta.mensagem.push("" + err);
                            resposta.pagamentoCancelado = [];
                            resposta.titulosRecusados = [];
                            res.json(resposta);
                        }
                        else{
                            try{
                                var elementos = 0;
                                var element = null;
                                var queryBaixa = "";
                                var transacao = null;

                                for(elementos = 0; elementos < recordset.recordsets.length; elementos++){
                                    element = recordset.recordsets[elementos];

                                    tituloRecusado = {
                                        clifor: element[0].razaosocial,
                                        titulo: element[0].documento.trim() + "/" + element[0].parcela,
                                        mensagem: []
                                    }                                    

                                    if(element[0].totalbaixas == null)
                                        tituloRecusado.mensagem.push("Parcela não possui pagamento registrado.");

                                    if(tituloRecusado.mensagem.length == 0){
                                        queryBaixa += "delete movimentacao_bancaria where id_empresa = @idempresa and  id_processo_pagamento = (select id_processo_pagamento from contas_pagar_baixas where id_empresa = @idempresa and id_contas_pagar_parcela = '" + element[0].idparcela + "'); ";
                                        queryBaixa += "delete contas_pagar_baixas_formaspagamento where id_empresa = @idempresa and id_processo_pagamento = (select id_processo_pagamento from contas_pagar_baixas where id_empresa = @idempresa and id_contas_pagar_parcela =  '" + element[0].idparcela + "'); ";
                                        queryBaixa += "delete contas_pagar_baixas where id_empresa = @idempresa and id_contas_pagar_parcela =  '" + element[0].idparcela + "'; ";

                                        pagamentoCancelado = {
                                            idParcela: element[0].idparcela,
                                            valorBaixa: element[0].valorparcela,
                                        }

                                        resposta.pagamentoCancelado.push(pagamentoCancelado);
                                    }
                                    else{
                                        resposta.titulosRecusados.push(tituloRecusado);
                                    }
                                }
                                transacao = new sql.Transaction();
                                transacao.begin(err =>{
                                    try{
                                        var request = new sql.Request(transacao);
                                        request.input("idempresa",EnterpriseID);
                                        request.query(queryBaixa, function (err, recordset) {
                                            if (err){
                                                resposta.status = -4;
                                                resposta.mensagem = [];
                                                resposta.mensagem.push("" + err);
                                                resposta.titulosRecusados = [];
                                                resposta.pagamentoCancelado = [];
                                                transacao.rollback();
                                                res.json(resposta);
                                            }
                                            else{
                                                resposta.status = 1;
                                                if(resposta.titulosRecusados.length > 0){
                                                    resposta.mensagem = ["Alguns pagamento não puderam ser cancelados."];
                                                }
                                                else{
                                                    resposta.mensagem = ["ok"];
                                                }
                                                transacao.commit();
                                                res.json(resposta);
                                            }
                                        })
                                    }
                                    catch(err){
                                        resposta.status = -5;
                                        resposta.mensagem = [];
                                        resposta.mensagem.push("" + err);
                                        resposta.pagamentoCancelado = [];
                                        resposta.titulosRecusados = [];
                                        res.json(resposta);                                    
                                    }
                                })
                            }
                            catch(err){
                                resposta.status = -7;
                                resposta.mensagem = [];
                                resposta.mensagem.push("" + err);
                                resposta.pagamentoCancelado = [];
                                resposta.titulosRecusados = [];
                                res.json(resposta);                                    
                            }
                        }
                    })
                }
                catch(err){
                    resposta.status = -6;
                    resposta.mensagem = [];
                    resposta.mensagem.push("" + err);
                    resposta.pagamentoCancelado = [];
                    resposta.titulosRecusados = [];
                    res.json(resposta);                                    
                }
            }
        })
    }
    catch(err){
        resposta.status = -1;
        resposta.mensagem = [];
        resposta.mensagem.push("" + err);
        resposta.pagamentoCancelado = [];
        resposta.titulosRecusados = [];
        res.json(resposta);
    }
})


/*------------------------------------------------------------------------------
Verifica se uma conta pode ser excluída.
--------------------------------------------------------------------------------
*/
router.route('/verificarexclusaoconta').post(function(req, res) {
    var query = "";
    var parcela = 0;
    var baixa = false;
    var origem = null;
    var resposta = null;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
   
    try{
        query += "select id_origem from contas_pagar where id = '" + req.body.parametros.idTitulo + "'";
        query += " and id_empresa = '" + EnterpriseID + "'; ";

        query += "select cpp.id,baixa.vl_valor from contas_pagar_parcelas cpp"
        query += " left join contas_pagar_baixas baixa on baixa.id_contas_pagar_parcela = cpp.id and baixa.id_empresa = '" + EnterpriseID + "'";
        query += " where cpp.id_contas_pagar = '" + req.body.parametros.idTitulo + "' and cpp.id_empresa = '" + EnterpriseID + "'";

        sql.close();
        sql.connect(config, function (err) {
            if (err){
                resposta = {
                    status: -2,
                    mensagem: ["" + err],
                }
                res.json(resposta);
            }
            else{
                var request = new sql.Request();
                request.query(query, function (err, recordset) {
                    if (err){
                        resposta = {
                            status: -3,
                            mensagem: ["" + err]
                        }
                        res.json(resposta);
                    }
                    else{
                        if(recordset.recordsets[0][0].id_origem){
                            origem = funcoesFinanceiro.buscaOrigemId(recordset.recordsets[0][0].id_origem);
                            resposta = {
                                status: 0,
                                mensagem: ["Este documento foi gerado por " + origem.nome + ". Sua exclusão deve ser feita pela exclusão do documento original."]
                            }
                        }
                        else{
                            baixa = false;
                            parcela = 0;
                            while(parcela < recordset.recordsets[1].length && !baixa){
                                if(recordset.recordsets[1][parcela].vl_valor){
                                    baixa = true;
                                }
                                parcela++;
                            }
                            if(baixa){
                                resposta = {
                                    status: 0,
                                    mensagem: ["Este documento possui parcelas que foram pagas. Para excluí-lo, os pagamentos devem ser cancelados."]
                                }
                            }
                            else{
                                resposta = {
                                    status: 1,
                                    mensagem: ["ok"]
                                }
                            }
                        }
                        res.json(resposta);
                    }
                })
            }
        })
    }
    catch(err){
        resposta = {
            status: -1,
            mensagem: ["" + err],
        }
        res.json(resposta);
    }
})


/*------------------------------------------------------------------------------
Exclui uma conta com suas parcelas.
--------------------------------------------------------------------------------
*/
router.route('/excluirconta').post(function(req, res) {
    var query = ""
    var resposta = null;
    var parametros = null;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    resposta = {
        status: 0,
        mensagem: [],
        documento: null
    }

    try{
        parametros = req.body.parametros;

        query += "select cp.id,cp.nm_documento,cp.id_origem,ent.nm_razaosocial from contas_pagar cp,entidade ent";
        query += " where cp.id_empresa = '" + EnterpriseID + "'";
        query += " and cp.id = '" + parametros.idTitulo + "'";      
        query += " and ent.id = cp.id_entidade; ";

        query += "delete contas_pagar_parcelas where id_empresa = '" + EnterpriseID + "'";
        query += " and id_contas_pagar = '" + parametros.idTitulo + "'; ";
        
        query += "delete contas_pagar where id_empresa = '" + EnterpriseID + "'";
        query += " and id = '" + parametros.idTitulo + "'";

        sql.close();
        sql.connect(config, function (err) {    
            if (err){
                resposta.status = -1;
                resposta.mensagem = [];
                resposta.mensagem.push("" + err);
                resposta.documento = null;
                sql.close();
                res.json(resposta);
            }
            else{
                try{
                    var transacao = new sql.Transaction();
                    transacao.begin(err =>{
                        var request = new sql.Request(transacao);
                        request.query(query, function (err, recordset) {
                            if (err){
                                resposta.status = -2;
                                resposta.mensagem = [];
                                resposta.mensagem.push("" + err);
                                resposta.documento = null;
                                transacao.rollback();
                                res.json(resposta);
                            }
                            else{
                                try{
                                    var element = recordset.recordsets[0];
                                    resposta.status = 1
                                    resposta.mensagem = ["ok"];
                                    resposta.documento = {
                                        idTitulo: element[0].id,
                                        documento: element[0].nm_documento,
                                        entidade: element[0].nm_razaosocial
                                    }
                                    transacao.commit();
                                    res.json(resposta);
                                }
                                catch(err){
                                    resposta.status = -3;
                                    resposta.mensagem = [];
                                    resposta.mensagem.push("" + err);
                                    resposta.documento = null;
                                    transacao.rollback();
                                    res.json(resposta);                
                                }
                            }
                        })
                    })
                }
                catch(err){
                    resposta.status = -4;
                    resposta.mensagem = [];
                    resposta.mensagem.push("" + err);
                    resposta.documento = null;
                    transacao.rollback();
                    res.json(resposta);
                }
            }
        });
    }
    catch(erro){
        resposta.status = -1;
        resposta.mensagem = [];
        resposta.documento = null;
        resposta.mensagem.push("" + erro);
        res.json(resposta);
    }
})



/*------------------------------------------------------------------------------
Atualiza uma parcela em particular
--------------------------------------------------------------------------------
*/
router.route('/atualizarparcela').post(function(req, res) {
	var queryDoc = "";
    var queryItens = "";
    var parcela = 0;
    var resposta = null;
    var parametros = null;
	var conexao = null;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    resposta = {
        status: 0,
        mensagem: [],
        parcela: null,
		alteracoes: []
    }

    try{
        parametros = req.body.parametros;
		
		queryDoc += "select cp.dt_emissao emissaodocumento,cp.vl_valor valordocumento,",
		queryDoc += "cpp.id idparcela,cpp.dt_data_vencimento vencimentoparcela,cpp.vl_valor valorparcela,";
		queryDoc += " baixas.vl_valor valorbaixa"
		queryDoc += " from contas_pagar cp,contas_pagar_parcelas cpp";
		queryDoc += " left join contas_pagar_baixas baixas on baixas.id_contas_pagar_parcela = cpp.id"
		queryDoc += " where";
		queryDoc += " cp.id_empresa = '" + EnterpriseID + "'";
		queryDoc += " and cp.id = '" + parametros.idTitulo + "'";
		queryDoc += " and cpp.id_empresa = '" + EnterpriseID + "'";
		queryDoc += " and cpp.id_contas_pagar = '" + parametros.idTitulo + "'";
		queryDoc += " order by cpp.dt_data_vencimento";
	
		conexao = new sql.ConnectionPool(config,function (err) {
			if (err){
                resposta.status = -2;
                resposta.mensagem = [];
                resposta.mensagem.push("" + err);
                parcela = null;
                res.json(resposta);
			}
            else{
                try{
					var request = conexao.request();

					request.query(queryDoc,function(err,recordset){
						var dataAux = null;
						var data = null;
						var emissao = null;
						var vencimento = null;
						var parcelasEmAberto = [];
						var totalParcelasEmAberto = 0;
						var totalParcelas = 0;
						var parcela = 0;
						var diferenca = 0;
						var cota = 0;
						var sinal = 0;
						var query = "";
						
						if (err){
							resposta.status = -5;
							resposta.mensagem = ["" + err];
							parcela = null;
							conexao.close();
							res.json(resposta);
						}
						else{
							try{
								resposta.status = 1;
								data = recordset.recordsets[0][0].emissaodocumento.toISOString().split("T");
								dataAux = new Date(data);
								emissao = dataAux.getTime();
								dataAux = new Date(parametros.vencimento);
								vencimento = dataAux.getTime();
								if(emissao > vencimento){
									resposta.status = 0;
									resposta.mensagem = ["A data de vencimento da parcela é anterior à data de emissão do documento."];
									parcela = null;
									conexao.close();
									res.json(resposta);
								}
								else{
									query += "update contas_pagar_parcelas set "
									query += "id_banco = " + (parametros.idBanco == "" ? "null" : "'" + parametros.idBanco + "'") + ",";
									query += "id_forma_pagamento = " + (parametros.idFormaPagamento == "" ? "null" : "'" + parametros.idFormaPagamento + "'") + ",";
									query += "id_plano_contas_financeiro = " + (parametros.idContaFinanceira == "" ? "null" : "'" + parametros.idContaFinanceira + "'") + ",";
									query += "nr_parcela = '" + parametros.parcela + "',";
									query += "dt_data_vencimento = '" + parametros.vencimento + "',";
									query += "vl_valor = " + parametros.valor + ",";
									query += "nm_documento = '" + parametros.documento + "',";
									query += "sn_fluxocaixa = " + parametros.fluxoCaixa;
									query += " where id = '" + parametros.idParcela + "'"
									query += " and id_empresa = '" + EnterpriseID + "'; ";
									
									for(parcela = 0; parcela < recordset.recordsets[0].length; parcela++){
										if(!recordset.recordsets[0][parcela].valorbaixa){
											totalParcelasEmAberto += recordset.recordsets[0][parcela].valorparcela;
											if(recordset.recordsets[0][parcela].idparcela.toLowerCase() != parametros.idParcela.toLowerCase()){
												parcelasEmAberto.push(recordset.recordsets[0][parcela]);
												totalParcelas +=  parseFloat(recordset.recordsets[0][parcela].valorparcela);
											}
											else
												totalParcelas += parseFloat(parametros.valor);
										}
									}
									if((parametros.valor > totalParcelasEmAberto) || (parametros.valor = totalParcelasEmAberto && recordset.recordsets[0].length > 1)){
										resposta.status = 0;
										resposta.mensagem = ["O valor da parcela é maior ou igual ao saldo do documento."];
										resposta.parcela =  null;
										conexao.close();
										res.json(resposta);
									}
									else{
										diferenca = totalParcelasEmAberto - totalParcelas;
										if(diferenca != 0){
											if(parcelasEmAberto.length == 0){
												resposta.status = 0;
												if(totalParcelasEmAberto > recordset.recordsets[0][0].valordocumento)
													resposta.mensagem = ["O valor total das parcelas é superior ao do documento."];
												else
													resposta.mensagem = ["O valor total das parcelas é inferior ao do documento."];
												resposta.parcela =  null;
												conexao.close();
												res.json(resposta);
											}
											else{
												sinal = 1
												if(diferenca < 0){
													sinal = -1;
													diferenca = Math.abs(diferenca);
												}
												cota = Math.trunc(((diferenca * 100) / parcelasEmAberto.length));
												cota /= 100;
												while(diferenca > 0){
													parcela = 0;
													while(parcela < parcelasEmAberto.length && diferenca > 0){
														parcelasEmAberto[parcela]["valorparcela"] += (cota * sinal);
														parcela++
														diferenca -= cota;
														if(cota > diferenca)
															cota = diferenca;
													}
												}
												for(parcela = 0; parcela < parcelasEmAberto.length; parcela++){
													query += "update contas_pagar_parcelas set vl_valor = " + parcelasEmAberto[parcela]["valorparcela"];
													query += " where id = '" + parcelasEmAberto[parcela]["idparcela"] + "'";
													query += " and id_empresa = '" + EnterpriseID + "'; ";
													resposta.alteracoes.push({"idParcela" : parcelasEmAberto[parcela]["idparcela"],"valorParcela" : parcelasEmAberto[parcela]["valorparcela"]});
												}
												resposta.status = 1;
											}
										}
										else{
											resposta.status = 1;
										}
									}
								}
								
								if(resposta.status == 1){
									transacao = conexao.transaction(); //sql.Transaction(conexao);
									transacao.begin(err =>{
										var request = transacao.request(); //conexao.request(transacao);
										request.query(query, function (err, recordset) {
											if (err){
												resposta.status = -3;
												resposta.mensagem = ["" + err];
												parcela = null;
												alteracoes = [];
												transacao.rollback();
												conexao.close();
												res.json(resposta);
											}
											else{
												resposta.status = 1;
												resposta.mensagem = ["ok"];
												resposta.parcela =  parametros;
												transacao.commit();
												conexao.close();
												res.json(resposta);
											}
										})
									})
								}
							}
							catch(err){
								resposta.status = -6;
								resposta.mensagem = ["" + err];
								parcela = null;
								alteracoes = [];
								conexao.close();
								res.json(resposta);
							}
						}
					})
                }
                catch(err){
                    resposta.status = -4;
                    resposta.mensagem = [];
                    resposta.mensagem.push("" + err);
                    parcela = null;
					alteracoes = [];
					conexao.close();
                    res.json(resposta);
                }
            }
        });
    }
    catch(erro){
        resposta.status = -1;
        resposta.mensagem = [];
        resposta.mensagem.push("" + erro);
		parcela = null;
		alteracoes = [];
        res.json(resposta);
    }
})




/*------------------------------------------------------------------------------
Cria as parcelas conforme o tipo de parcelamento.
--------------------------------------------------------------------------------
*/
router.route('/criarparcelas').post(function(req, res) {
    var parcela = 0;
    var resposta = null;
    var parametros = null;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    resposta = {
        status: 0,
        mensagem: [],
        parcelas: [],
    }

    try{
        parametros = req.body.parametros;
        if(parametros.emissao == null || parametros.emissao == "" || parametros.emissao.indexOf("undefined") >= 0){
            throw "Data de emissão inválida."
        }
        else{
            if(parametros.idParcelamento == null || parametros.idParcelamento == ""){
                throw "Parcelamento não definido."
            }
        }

        funcoesFinanceiro.gerarparcelas(config,EnterpriseID,parametros.idParcelamento,parametros.valor,new Date(parametros.emissao),(function(resposta){
            try{
                if(resposta.status > 0){
                    for(parcela = 0; parcela < resposta.parcelas.length; parcela++){
                        resposta.parcelas[parcela].documento = parametros.documento;
                        resposta.parcelas[parcela].idContaFinanceira = parametros.idContaFinanceira;
                        resposta.parcelas[parcela].fluxoCaixa = "Sim";
                    }
                }
               res.json(resposta);
            }
            catch(erro){
                resposta.status = -2;
                resposta.mensagem = [];
                resposta.mensagem.push("criarparcelas: " + erro);
                resposta.parcelas = [];
                sql.close();
                res.json(resposta);
            }
        }));
    }
    catch(erro){
        resposta.status = -1;
        resposta.mensagem = [];
        resposta.mensagem.push("criarparcelas: " + erro);
        resposta.parcelas = [];
        res.json(resposta);
    }
})

/*-------------------------------------------------------------------------------
Realiza o cancelamento de um documento (todas as parcelas).
---------------------------------------------------------------------------------
*/
function cancelarConta(parametros,conexao,callbackf){
	var query = "";
	var resposta = null;
	var request = null;
	var transacao = null;
	var dataCancelamento = null
	var prefixoFuncao = "cancelamentocontaF: "
	
	try{
		dataCancelamento = new Date().toISOString()
	
		query += "update contas_pagar set dt_cancelamento = '" + dataCancelamento + "'"
		query += " where id_compra = '" + parametros.idCompra + "'";
		query += " and id_empresa = '" + parametros.idEmpresa + "'; ";
		
		query += "update contas_pagar_parcelas set dt_cancelamento = '" + dataCancelamento + "'";
		query += " where id_contas_pagar in (select id from contas_pagar where id_compra = '" + parametros.idCompra + "')";
		query += " and id_empresa = '" + parametros.idEmpresa + "'; ";
		
		if(conexao.transacao){
			request = conexao.transacao.request();
			request.query(query, function (err, recordset) {
				if (err){
					resposta = {
						status: -2,
						mensagem: [prefixoModulo + prefixoFuncao + err],
					}
					callbackf(resposta);
				}
				else{
					resposta = {
						status: 1,
						mensagem: ["ok"],
					}
					callbackf(resposta);
				}
			})
		}
		else{
			conexao = new sql.ConnectionPool(configEx,function (err) {
				if (err){
					resposta = {
						status: -2,
						mensagem: [prefixoModulo + prefixoFuncao + err],
					}
					callbackf(resposta);
				}
				else{
					try{
						transacao = new sql.Transaction(conexao);
						transacao.begin(err =>{
							try{
								var request = transacao.request();
								request.query(query, function (err, recordset) {
									if (err){
										resposta = {
											status: -4,
											mensagem: [prefixoModulo + prefixoFuncao + err],
										}
										transacao.rollback();
										conexao.close();
										callbackf(resposta);
									}
									else{
										resposta = {
											status: 1,
											mensagem: ["ok"],
										}
										transacao.commit();
										conexao.close();
										callbackf(resposta);
									}
								})
							}
							catch(err){
								resposta = {
									status: -5,
									mensagem: [prefixoModulo + prefixoFuncao + err],
								}
								transacao.rollback();
								conexao.close();
								callbackf(resposta);
							}
						})
					}
					catch(err){
						resposta = {
							status: -3,
							mensagem: [prefixoModulo + prefixoFuncao + err]
						}
						conexao.close();
						callbackf(resposta);
					}
				}
			})
		}
	}
	catch(err){
		resposta = {
			status: -1,
			mensagem: [prefixoModulo + prefixoFuncao + err]
		}
		callbackf(resposta);
	}
}



router.route('/gerarpagamentosperiodicos').post(function(req, res) {
    var parcela = 0;
    var resposta = null;
    var parametros = null;
    var ins = "";

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    resposta = {
        status: 0,
        mensagem: [],
        parcelas: [],
    }

    
    parametros = req.body.parametros;
    var ind = parseInt(parametros.recorrencia);

    parametros.valor = parametros.valor.replace(".","").replace(",",".");

    var emissao = parametros.emissao.split("/");
    parametros.emissao = emissao[1] + "/" + emissao[0] + "/" +  emissao[2]

    for (let index = 0; index < ind; index++) {   
        var guid = general.guid();      
        ins += "INSERT INTO contas_pagar ";
        ins += " (id, id_empresa, id_entidade, id_parcelamento, id_plano_contas_financeiro, nm_documento, ";
        ins += "dt_emissao, vl_valor, nm_observacao, nm_competencia) ";
        ins += " VALUES('" + guid + "', '" + parametros.idempresa + "', '" + parametros.fornecedor + "', '" + parametros.parcelamento + "', "
        ins += "'" + parametros.contafinanceira + "','" + parametros.documento + "','" + parametros.emissao + "'";
        ins += "," + parametros.valor + ",'" + parametros.obs + "','');"   
        
              
        var guid2 = general.guid();      
        ins += "INSERT INTO contas_pagar_parcelas ";
        ins += " (id, id_empresa, id_contas_pagar,  id_plano_contas_financeiro, nm_documento ";
        ins += " ,vl_valor, dt_data_vencimento, nr_parcela) ";
        ins += " VALUES('" + guid2 + "', '" + parametros.idempresa + "', '" + guid + "',  "
        ins += "'" + parametros.contafinanceira + "','" + parametros.documento + "',";
        ins += "" + parametros.valor + ",'" + parametros.emissao + "', 1);";
        
    }

   
    
    sql.close();
    sql.connect(config, function (err) {  
        var transacao = new sql.Transaction();
        transacao.begin(err =>{
            var request = new sql.Request(transacao);
            request.query(ins, function (err, recordset) {
                if (err){
                    console.log(err)
                    resposta.status = -2;
                    resposta.mensagem = [];
                    resposta.mensagem.push("" + err);
                    resposta.documento = null;
                    transacao.rollback();
                    res.json(resposta);
                }
                else{
                    try{
                        resposta.status = 1
                        resposta.mensagem = ["ok"];
                        
                        transacao.commit();
                        console.log(ins)
                        res.json(resposta);
                    }
                    catch(err){
                        resposta.status = -3;
                        resposta.mensagem = [];
                        resposta.mensagem.push("" + err);
                        resposta.documento = null;
                        transacao.rollback();
                        res.json(resposta);                
                    }
                }
            })
        })
        
    })
})