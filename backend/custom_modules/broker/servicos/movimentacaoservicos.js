const server = require('../../../config/server');
const express = require('express');
const router = express.Router();
const sql = require("mssql");
const general = require('../../../api/general');
server.use('/custom_modules/broker/servicos/movimentacaoservicos', router);
var serverWindows = "";
var configEnvironment = {};
var EnterpriseID = "";
var EnterpriseName = "";
var UserID = "";
var base = "";
var url = "";
var host = "";
var config = {};
const prefixoModulo = "Financeiro_";
  
var nodemailer = require('nodemailer');

router.route('/*').get(function(req, res, next) {
    var full = req.host;
    var parts = full.split('.');
    var dados = "";
    if (parts.length > 3) {
        dados = parts[0];
    }
    host = dados;
    dados = dados.replace("http://","");   
    if(full.indexOf("localhost") > -1){
        serverWindows = "http://localhost:2444";
        dados = "broker";
        configEnvironment = {user: 'sa', password: 'IntSql2015@', server: '127.0.0.1',  database: 'Environment'};
    }else{
        serverWindows = "http://" + dados + ".empresariocloud.com.br";
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
});    

router.route('/*').post(function(req, res, next) {
    var full = req.host;
    var parts = full.split('.');
    var dados = "";
    if (parts.length > 3) {
        dados = parts[0];
    }
    host = dados;
    dados = dados.replace("http://","");   
    if(full.indexOf("localhost") > -1){
        serverWindows = "http://localhost:2444";
        dados = "broker";
        configEnvironment = {user: 'sa', password: 'IntSql2015@', server: '127.0.0.1',  database: 'Environment'};
    }else{
        serverWindows = "http://" + dados + ".empresariocloud.com.br";
        configEnvironment = {user: 'sa', password: 'IntSql2015@', server: '172.31.8.216',  database: 'Environment'};
    }                    
    var database = "";
    var server = "";
    var password = "";
    var user = "";    var select = "SELECT id AS idempresa,nm_CompanyName nome,nm_DatabaseName_Aplication AS 'database',  ";
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

//% servicos/movimentacaoservicos/carregaSubServico 


//* servicos/movimentacaoservicos/testeconexao 

router.route('/testeconexao').get(function(req, res) {

sql.close(); 
 sql.connect(config, function (err) { 
 var select = "SELECT nm_razaosocial AS 'razao' FROM entidade ";
 var request = new sql.Request(); 
 request.query(select, function (err, recordset){
 if (err) console.log(err) 
 res.send(recordset);
});
});

});
//% servicos/movimentacaoservicos/testeconexao 



//* servicos/movimentacaoservicos/carregaSubServico 

router.route('/carregaSubServico/:idProdutos/:idEntidade/:idMovimentacao').get(function(req, res) {
    var idProdutos = req.param('idProdutos');
    var idEntidade = req.param('idEntidade');
    var idMovimentacao = req.param('idMovimentacao');

    sql.close();
    sql.connect(config, function (err) {
        if (err) console.log(err); 
        var select = "SELECT produtos.id AS 'id', produtos.nm_descricao AS 'desc', (SELECT TOP 1 cliente_servicos.id_dsg_moeda FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' AND id_produtos=produtos.id) AS 'moeda', (SELECT TOP 1 cliente_servicos.vl_valor FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' AND id_produtos=produtos.id) AS 'precovenda'   FROM produtos_subservicos INNER JOIN produtos ON produtos.id=produtos_subservicos.id_subservicos WHERE produtos_subservicos.id_produtos='" + idProdutos + "';";
        select += " SELECT produtos.id AS 'id',  produtos.nm_descricao AS 'desc', (SELECT TOP 1 cliente_servicos.id_dsg_moeda FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' AND id_produtos=produtos.id) AS 'moeda', (SELECT TOP 1 cliente_servicos.vl_valor FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' AND id_produtos=produtos.id) AS 'precovenda'   FROM produtos WHERE produtos.id='" + idProdutos + "' ";
        select += " SELECT subservico.id AS 'id', subservico.nm_descricao AS 'desc', (SELECT TOP 1 cliente_servicos.id_dsg_moeda FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' AND id_produtos=subservico.id) AS 'moeda', (SELECT TOP 1 cliente_servicos.vl_valor FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' AND id_produtos=subservico.id) AS 'precovenda'   FROM produtos_subservicos INNER JOIN subservico ON subservico.id=produtos_subservicos.id_subservicos WHERE produtos_subservicos.id_produtos='" + idProdutos + "';";

        if(idMovimentacao != "*"){
            select += " SELECT id_subservicos FROM movimentacao_servicos WHERE id='" + idMovimentacao + "';";
        }
        

        console.log(select)
        var request = new sql.Request();
        request.query(select, function (err, recordset){ 
            if (err) console.log(err); 


            res.send(recordset);
        });
    });
});
//% servicos/movimentacaoservicos/carregaSubServico 

//* servicos/movimentacaoservicos/testesoma 

router.route('/testesoma/:param1/:param2').get(function(req, res) {
var param1 = req.param('param1');
var param2 = req.param('param2');

 res.send(param1 + ' - ' + param2);
});
//% servicos/movimentacaoservicos/testesoma 

//* servicos/movimentacaoservicos/carregaListaServicos 

router.route('/carregaListaServicos/:idEntidade/:dataDe/:dataAte/:fat/:bol').get(function(req, res) {
var idEntidade = req.param('idEntidade');
var dataDe = req.param('dataDe');
var dataAte = req.param('dataAte');
var fat = req.param('fat');
var bol = req.param('bol');
var arrayData = [];

    var where = ""; 
    var select = "SELECT (IIF(movimentacao_servicos.id_produtos = '8A9F92B6-20DC-6BD3-4C4C-7E6A2875C954','SISCOSERV',NULL)) AS 'siscoserv',  newID() AS 'id', "; 
    select += " entidade.nm_cnpj AS 'cnpj', entidade.id AS 'entidadeid',"; 
    select += " entidade.nm_razaosocial AS 'razaosocial', "; 
    select += " FORMAT(SUM(movimentacao_servicos.vl_valor), 'c', 'pt-BR' )  AS 'dt_faturamento', "; 
    select += " FORMAT(movimentacao_servicos.dt_faturamento, 'd', 'pt-BR' )  AS 'valor', "; 
    select += " movimentacao_servicos.nm_numero_nfes AS 'numero_nfes', "; 
    select += " contas_receber_parcelas.nm_numero_boleto AS 'numero_boleto',  cliente_servicos.sn_notaunica AS 'notaunica', movimentacao_servicos.id_contas_receber AS 'idcontasreceber' "; 
    select += " , contas_receber_parcelas.nm_idprotocoloimpressao AS 'idboleto' "; 
    select += " FROM movimentacao_servicos "; 
    //select += " INNER JOIN produtos sub ON sub.id=movimentacao_servicos.id_subservicos "; 
    //select += " INNER JOIN produtos prod ON prod.id=movimentacao_servicos.id_produtos "; 
    select += " LEFT JOIN contas_receber_parcelas ON contas_receber_parcelas.id=movimentacao_servicos.id_contas_receber ";
    select += " LEFT JOIN contas_receber ON contas_receber.id=contas_receber_parcelas.id_contas_receber ";
    select += " INNER JOIN entidade ON entidade.id=movimentacao_servicos.id_entidade ";
    select += " LEFT JOIN cliente_servicos ON cliente_servicos.id_produtos=movimentacao_servicos.id_subservicos AND  cliente_servicos.id_entidade= movimentacao_servicos.id_entidade ";  
    
    select += " LEFT JOIN  subservico ON subservico.id=movimentacao_servicos.id_subservicos";

    if(idEntidade){ 
        if(idEntidade != "*"){ 
            where = " WHERE movimentacao_servicos.id_entidade='" + idEntidade + "' "; 
        } 
    } 
    if(dataDe){ 
        if(dataDe != "*"){ 
            dataDe = dataDe.replace("-","/"); 
            dataDe = dataDe.replace("-","/"); 

            arrayData = dataDe.split('/');
            dataDe = arrayData[1] + "/" + arrayData[0] + "/" + arrayData[2];

            if(!where){ 
                where += " WHERE movimentacao_servicos.dt_emissao >= '" + dataDe + "' "; 
            }else{ 
                where += " AND movimentacao_servicos.dt_emissao >= '" + dataDe + "' "; 
            } 
        } 
    } 
    if(dataAte){ 
        if(dataAte != "*"){ 
            dataAte = dataAte.replace("-","/"); 
            dataAte = dataAte.replace("-","/"); 
            
            arrayData = dataAte.split('/');
            dataAte = arrayData[1] + "/" + arrayData[0] + "/" + arrayData[2];

            if(!where){ 
                where += " WHERE movimentacao_servicos.dt_emissao <= '" + dataAte + "' "; 
            }else{ 
                where += " AND movimentacao_servicos.dt_emissao <= '" + dataAte + "' "; 
            } 
        } 
    } 
    if(fat){ 
        if(fat == "true"){ 
            if(!where){ 
                where += " WHERE movimentacao_servicos.nm_numero_nfes  IS NOT NULL "; 
            }else{ 
                where += " AND  movimentacao_servicos.nm_numero_nfes  IS NOT NULL "; 
            } 
        }else{
            if(!where){ 
                where += " WHERE movimentacao_servicos.nm_numero_nfes  IS  NULL "; 
            }else{ 
                where += " AND  movimentacao_servicos.nm_numero_nfes  IS  NULL "; 
            } 
        }
    } 
    if(bol){ 
        if(bol == "true"){ 
            if(!where){ 
                where += " WHERE contas_receber_parcelas.nm_numero_boleto  IS NOT NULL "; 
            }else{ 
                where += " AND  contas_receber_parcelas.nm_numero_boleto  IS NOT NULL "; 
            }        
        }else{
            if(!where){ 
                where += " WHERE contas_receber_parcelas.nm_numero_boleto  IS  NULL "; 
            }else{ 
                where += " AND  contas_receber_parcelas.nm_numero_boleto  IS  NULL "; 
            } 
        }
    }

    select = select + where; 
    select = select + "  GROUP BY movimentacao_servicos.id_produtos,   entidade.id, entidade.nm_cnpj, entidade.nm_razaosocial,  movimentacao_servicos.dt_faturamento,  movimentacao_servicos.nm_numero_nfes,  contas_receber_parcelas.nm_numero_boleto,  cliente_servicos.sn_notaunica, movimentacao_servicos.id_contas_receber, contas_receber_parcelas.nm_idprotocoloimpressao";
    console.log("=============================================================");
    console.log(select)
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
//% servicos/movimentacaoservicos/carregaListaServicos 

router.route('/carregaListaComissao/:idEntidade/:dataDe/:dataAte/:equipe/:servico/:status/:mes').get(function(req, res) {
    var idEntidade = req.param('idEntidade');
    var dataDe = req.param('dataDe');
    var dataAte = req.param('dataAte');
    var equipe = req.param('equipe');
    var servico = req.param('servico');
    var status = req.param('status');
    var mes = req.param('mes');

    var where = ""; 
    var select = "";
    select += " SELECT  comiss.id as 'id', FORMAT (comiss.dt_emissao, 'd', 'pt-BR' ) as 'dt_emissao', entidade.nm_razaosocial as 'cliente',  ";
    select += " op.nm_razaosocial as 'operador', produtos.nm_descricao as 'produto', FORMAT (comiss.vl_venda, 'c', 'pt-BR' ) as 'valorvenda', comiss.nm_status as 'status', FORMAT(comiss.vl_comissao, 'c', 'pt-BR' ) as 'valor', ";
    select += " IIF(comiss.vl_percentual_comissao IS NULL, CAST((SELECT TOP 1 vl_comissaooperador FROM vendedor_servicos WHERE vendedor_servicos.id_vendedor=comiss.id_vendedor AND vendedor_servicos.id_produtos = movimentacao_servicos.id_subservicos) AS varchar(200)),comiss.vl_percentual_comissao) as'percentualcomiss', ";
    select += " FORMAT ((comiss.vl_comissao - ((SELECT vl_tributoservicos FROM empresa WHERE empresa.id='9F39BDCF-6B98-45DE-A819-24B7F3EE2560')) * comiss.vl_comissao / 100 ), 'c', 'pt-BR' ) AS 'valorliquido' ";
    select += " , IIF(comiss.vl_percentual_comissao IS NULL, '','true') AS alterado";
    select += " FROM movimentacao_servicos ";
    select += " INNER JOIN comiss ON comiss.id_venda=movimentacao_servicos.id ";
    select += " INNER JOIN entidade ON entidade.id=movimentacao_servicos.id_entidade ";
    select += " INNER JOIN entidade op ON op.id=comiss.id_vendedor ";
    select += " INNER JOIN entidade ind ON ind.id = comiss.id_vendedor   ";
    select += " INNER JOIN produtos ON produtos.id=movimentacao_servicos.id_produtos ";

    if(idEntidade){ 
        if(idEntidade != "*"){ 
            where += " WHERE (op.id='" + idEntidade + "' OR ind.id='" + idEntidade + "') "; 
        } 
    } 
    
    if(dataDe){ 
        if(dataDe != "*"){ 
            dataDe = dataDe.replace("-","/"); 
            dataDe = dataDe.replace("-","/"); 
            if(!where){ 
                where += " WHERE FORMAT(comiss.dt_emissao, 'd', 'pt-BR' ) >= '" + dataDe + "' "; 
            }else{ 
                where += " AND FORMAT(comiss.dt_emissao, 'd', 'pt-BR' ) >= '" + dataDe + "' "; 
            } 
        } 
    } 

    if(dataAte){ 
        if(dataAte != "*"){ 
            dataAte = dataAte.replace("-","/"); 
            dataAte = dataAte.replace("-","/"); 
            if(!where){ 
                where += " WHERE FORMAT(comiss.dt_emissao, 'd', 'pt-BR' ) <= '" + dataAte + "' "; 
            }else{ 
                where += " AND FORMAT(comiss.dt_emissao, 'd', 'pt-BR' ) <= '" + dataAte + "' "; 
            } 
        } 
    } 
    
    if(equipe){ 
        if(equipe != "*"){ 
            if(!where){ 
                where += " WHERE (op.id_equipe = '" + equipe + "' OR ind.id_equipe = '" + equipe + "') "; 
            }else{ 
                where += " AND (op.id_equipe = '" + equipe + "' OR ind.id_equipe = '" + equipe + "')  "; 
            } 
        } 
    } 
    
    if(servico){ 
        if(servico != "*"){ 
            if(!where){ 
                where += " WHERE movimentacao_servicos.id_produtos = '" + servico + "' "; 
            }else{ 
                where += " AND movimentacao_servicos.id_produtos = '" + servico + "' "; 
            } 
        } 
    } 

    if(status){ 
        if(status != "*"){ 
            if(!where){ 
                where += " WHERE (comiss.nm_status = '" + status + "') "; 
            }else{ 
                where += " AND (comiss.nm_status = '" + status + "')  "; 
            } 
        } 
    } 
    
    if(mes){ 
        if(mes != "*"){ 
            var dataFull = new Date();
            var ano4    = dataFull.getFullYear();
            if(mes.length == 1){
                mes = "0" + mes;
            }
            if(!where){ 
                where += " WHERE (SUBSTRING(CONVERT(CHAR(8),comiss.dt_emissao,112),1,6)='" + ano4 + mes + "') "; 
            }else{ 
                where += " AND (SUBSTRING(CONVERT(CHAR(8),comiss.dt_emissao,112),1,6)='" + ano4 + mes + "') "; 
            } 
        } 
    } 

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

router.route('/carregaListaDetalhesServicos/:dataDe/:dataAte/:cliente/:cnpj/:dtfat/:nfse/:bol/:notaunica').get(function(req, res) {
    var cliente = req.param('cliente');
    var dataDe = req.param('dataDe');
    var dataAte = req.param('dataAte');
    var cnpj = req.param('cnpj');
    var dtfat = req.param('dtfat');
    var nfse = req.param('nfse');
    var bol = req.param('bol');
    var notaunica = req.param('notaunica');
    
    cnpj = cnpj.replace("(*_*)","/");
    
    cliente = cliente.replace("(*_*)","/");
    cliente = cliente.replace("(*_*)","/");
    cliente = cliente.replace("(*_*)","/");
    cliente = cliente.replace("(*_*)","/");
    cliente = cliente.replace("(*_*)","/");

    var where = ""; 
    var select = "SELECT newID() AS 'id', "; 
    select += " movimentacao_servicos.nm_documento AS 'doc', "; 
    select += " FORMAT(movimentacao_servicos.dt_emissao, 'd', 'pt-BR' ) AS 'data', "; 
    select += " entidade.nm_razaosocial AS 'razaosocial', "; 
    select += " IIF(sub.nm_descricao IS NULL,(prod.nm_descricao + ' - ' + sub2.nm_descricao),(prod.nm_descricao + ' - ' + sub.nm_descricao)) AS 'prodSub', "; 
    select += " FORMAT(movimentacao_servicos.vl_valor, 'c', 'pt-BR' )  AS 'valor'  "; 
    select += " FROM movimentacao_servicos "; 
    select += " LEFT JOIN produtos sub ON sub.id=movimentacao_servicos.id_subservicos "; 
    select += " LEFT JOIN subservico sub2 ON sub2.id=movimentacao_servicos.id_subservicos "; 
    select += " INNER JOIN produtos prod ON prod.id=movimentacao_servicos.id_produtos "; 
    select += " INNER JOIN entidade ON entidade.id=movimentacao_servicos.id_entidade "; 
    select += " LEFT JOIN cliente_servicos ON cliente_servicos.id_produtos=movimentacao_servicos.id_subservicos  ";
    select += " AND  cliente_servicos.id_entidade= movimentacao_servicos.id_entidade ";

    if(cliente != "-"){ 
        where = " WHERE entidade.nm_razaosocial='" + cliente + "' "; 
    }

    if(cnpj != "-"){ 
        if(!where){ 
            where += " WHERE entidade.nm_cnpj = '" + cnpj + "' "; 
        }else{ 
            where += " AND entidade.nm_cnpj = '" + cnpj + "' "; 
        } 
    }else{
        if(!where){ 
            where += " WHERE entidade.nm_cnpj IS NULL "; 
        }else{ 
            where += " AND entidade.nm_cnpj IS NULL  "; 
        } 
    }

    if(dtfat != "-"){ 

        dtfat = dtfat.replace("-","/"); 
        dtfat = dtfat.replace("-","/"); 
        
        arrayData = dtfat.split('/');
        dtfat = arrayData[1] + "/" + arrayData[0] + "/" + arrayData[2];

        if(!where){ 
            where += " WHERE CONVERT(date, FORMAT(movimentacao_servicos.dt_faturamento, 'd', 'pt-BR' )) = '" + dtfat + "' "; 
        }else{ 
            where += " AND CONVERT(date, FORMAT(movimentacao_servicos.dt_faturamento, 'd', 'pt-BR' )) = '" + dtfat + "' "; 
        } 
    }else{
        if(!where){ 
            where += " WHERE movimentacao_servicos.dt_faturamento IS NULL "; 
        }else{ 
            where += " AND movimentacao_servicos.dt_faturamento IS NULL  "; 
        } 
    }
    
    if(nfse != "-"){ 
        if(!where){ 
            where += " WHERE movimentacao_servicos.nm_numero_nfes = '" + nfse + "' "; 
        }else{ 
            where += " AND movimentacao_servicos.nm_numero_nfes = '" + nfse + "' "; 
        } 
    }else{
        if(!where){ 
            where += " WHERE movimentacao_servicos.nm_numero_nfes IS NULL "; 
        }else{ 
            where += " AND movimentacao_servicos.nm_numero_nfes IS NULL  "; 
        } 
    }
    
    if(bol != "-"){  
        if(!where){ 
            where += " WHERE movimentacao_servicos.nm_numero_boleto = '" + bol + "' "; 
        }else{ 
            where += " AND movimentacao_servicos.nm_numero_boleto = '" + bol + "' "; 
        } 
    }else{
        if(!where){ 
            where += " WHERE movimentacao_servicos.nm_numero_boleto IS NULL "; 
        }else{ 
            where += " AND movimentacao_servicos.nm_numero_boleto IS NULL  "; 
        } 
    }
    if(dataDe){ 
        if(dataDe != "*"){ 
            dataDe = dataDe.replace("-","/"); 
            dataDe = dataDe.replace("-","/"); 
            
            arrayData = dataDe.split('/');
            dataDe = arrayData[1] + "/" + arrayData[0] + "/" + arrayData[2];

            if(!where){ 
                where += " WHERE movimentacao_servicos.dt_emissao >= '" + dataDe + "' "; 
            }else{ 
                where += " AND movimentacao_servicos.dt_emissao >= '" + dataDe + "' "; 
            } 
        } 
    } 
    if(dataAte){ 
        if(dataAte != "*"){  
            dataAte = dataAte.replace("-","/"); 
            dataAte = dataAte.replace("-","/"); 
            
            arrayData = dataAte.split('/');
            dataAte = arrayData[1] + "/" + arrayData[0] + "/" + arrayData[2];

            if(!where){ 
                where += " WHERE movimentacao_servicos.dt_emissao <= '" + dataAte + "' "; 
            }else{ 
                where += " AND movimentacao_servicos.dt_emissao <= '" + dataAte + "' "; 
            } 
        } 
    } 

    if(notaunica == "1"){
        where += " AND cliente_servicos.sn_notaunica = 1 ";
    }else{
        where += " AND cliente_servicos.sn_notaunica IS NULL ";
    }

    select = select + where; 
    
    console.log("==============================================================")
    console.log(select)
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

router.route('/carregaListaComissaoEquipe').get(function(req, res) {
    
    var where = ""; 
    var select = "SELECT newID() AS 'id', "; 
    select += " movimentacao_servicos.nm_documento AS 'doc', "; 
    select += " FORMAT(movimentacao_servicos.dt_emissao, 'd', 'pt-BR' ) AS 'data', "; 
    select += " entidade.nm_razaosocial AS 'razaosocial', "; 
    select += " (prod.nm_descricao + ' - ' + sub.nm_descricao) AS 'prodSub', "; 
    select += " FORMAT(movimentacao_servicos.vl_valor, 'c', 'pt-BR' )  AS 'valor'  "; 
    select += " FROM movimentacao_servicos "; 
    select += " INNER JOIN produtos sub ON sub.id=movimentacao_servicos.id_subservicos "; 
    select += " INNER JOIN produtos prod ON prod.id=movimentacao_servicos.id_produtos "; 
    select += " INNER JOIN entidade ON entidade.id=movimentacao_servicos.id_entidade "; 
    //if(cliente != "-"){ 
    //    where = " WHERE entidade.nm_razaosocial='" + cliente + "' "; 
    //}

    select = select + where; 
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

router.route('/concluirComissao').post(function(req, res) {   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    var full = req.host; 
    var submit = req.body;
    var sqlstring = "";

    for(var i = 0; i < submit.array.length; i++){
        sqlstring += "UPDATE comiss SET nm_status='Em Pagamento' WHERE id='" + submit.array[i] + "'; ";
    }
    
    sql.close()
    sql.connect(config).then(function() {
        var request = new sql.Request();
        request.query(sqlstring).then(function(recordset) {
            res.send(true)
        }).catch(function(err) { 
            console.log(err)                   
            res.send(false)
        });
    })
});

router.route('/carregaControleComissaoPagar/:dataDe/:dataAte/:equipe').get(function(req, res) {
    
    var dataDe = req.param('dataDe');
    var dataAte = req.param('dataAte');
    var equipe = req.param('equipe');

    var where = ""; 
    where += " WHERE comiss.nm_status='Em Pagamento' ";
    var select = "";

    var campoequipe = "";

    if(equipe != "*" && equipe){
        campoequipe = "='" + equipe + "'"
    }else{        
        campoequipe = " IS NULL"
    }

    if(dataDe){ 
        if(dataDe != "*"){ 
            dataDe = dataDe.replace("-","/"); 
            dataDe = dataDe.replace("-","/"); 

            var arrayDataDe = dataDe.split("/");
            if(!where){ 
                where += " WHERE comiss.dt_emissao >= '" + arrayDataDe[2] + "/" + arrayDataDe[1] + "/" + arrayDataDe[0] + "' "; 
            }else{ 
                where += " AND comiss.dt_emissao >= '" + arrayDataDe[2] + "/" + arrayDataDe[1] + "/" + arrayDataDe[0] + "' "; 
            } 
        } 
    } 

    if(dataAte){ 
        if(dataAte != "*"){ 
            dataAte = dataAte.replace("-","/"); 
            dataAte = dataAte.replace("-","/"); 
            var arrayDataAte = dataAte.split("/");
            if(!where){ 
                where += " WHERE comiss.dt_emissao <= '"  + arrayDataAte[2] + "/" + arrayDataAte[1] + "/" + arrayDataAte[0] + "' "; 
            }else{ 
                where += " AND comiss.dt_emissao <= '" + arrayDataAte[2] + "/" + arrayDataAte[1] + "/" + arrayDataAte[0] + "' "; 
            } 
        } 
    } 
    
    
    select += " SELECT ";
    
    select += " (SELECT id FROM comissao_apuracao WHERE comissao_apuracao.id_entidade=op.id  "; 
    select += "     AND comissao_apuracao.nm_status IS NULL    ";   
    select += "     AND comissao_apuracao.nm_datade='*' AND comissao_apuracao.nm_dataate='*'  ";
    select += "     AND comissao_apuracao.id_equipe  IS NULL) AS 'idcomissaoapuracao', ";
    
    select += " IIF((SELECT id FROM comissao_apuracao WHERE comissao_apuracao.id_entidade=op.id AND comissao_apuracao.nm_status IS NULL ";
    select += "     AND comissao_apuracao.nm_datade='" + dataDe + "' AND comissao_apuracao.nm_dataate='" + dataAte + "' AND comissao_apuracao.id_equipe " + campoequipe + ") IS NULL, NEWID(), ";
    select += "     (SELECT id FROM comissao_apuracao WHERE comissao_apuracao.id_entidade=op.id  AND comissao_apuracao.nm_status IS NULL ";
    select += "     AND comissao_apuracao.nm_datade='" + dataDe + "' AND comissao_apuracao.nm_dataate='" + dataAte + "' AND comissao_apuracao.id_equipe " + campoequipe ;
    select += "     )) as 'id',  ";

    select += "IIF((SELECT id FROM comissao_apuracao WHERE comissao_apuracao.id_entidade=op.id  AND comissao_apuracao.nm_status IS NULL  ";
    select += "    AND comissao_apuracao.nm_datade='" + dataDe + "' AND comissao_apuracao.nm_dataate='" + dataAte + "'  ";
    select += "    AND comissao_apuracao.id_equipe " + campoequipe + ") IS NULL, '0', '1') as 'insup',  ";

    select += " op.id as 'idoperador',  ";
    select += " op.nm_razaosocial as 'operador',  FORMAT(SUM(comiss.vl_venda), 'c', 'pt-BR' ) as 'valorvenda', FORMAT(SUM(comiss.vl_comissao), 'c', 'pt-BR' ) as 'valor',  ";
    select += " FORMAT (SUM(comiss.vl_comissao) - IIF((SELECT SUM(vl_desconto) FROM comissao_desconto WHERE id_contas_pagar=(SELECT id FROM comissao_apuracao WHERE  comissao_apuracao.id_entidade=op.id  AND comissao_apuracao.nm_status IS NULL  AND comissao_apuracao.nm_datade='" + dataDe + "' AND comissao_apuracao.nm_dataate='" + dataAte + "' AND comissao_apuracao.id_equipe  " + campoequipe + ")) IS NULL,0,(SELECT SUM(vl_desconto) FROM comissao_desconto WHERE id_contas_pagar=(SELECT id FROM comissao_apuracao WHERE comissao_apuracao.id_entidade=op.id  AND comissao_apuracao.nm_status IS NULL  AND comissao_apuracao.nm_datade='" + dataDe + "' AND comissao_apuracao.nm_dataate='" + dataAte + "' AND comissao_apuracao.id_equipe  " + campoequipe + "))), 'c', 'pt-BR' ) AS 'valorliquido' , ";
    select += " (SELECT FORMAT (SUM(vl_desconto), 'c', 'pt-BR' ) FROM comissao_desconto WHERE id_contas_pagar=(SELECT id FROM comissao_apuracao WHERE comissao_apuracao.id_entidade=op.id  AND comissao_apuracao.nm_status IS NULL  AND comissao_apuracao.nm_datade='" + dataDe + "' AND comissao_apuracao.nm_dataate='" + dataAte + "' AND comissao_apuracao.id_equipe  " + campoequipe + ")) as desconto  ";
    select += " FROM movimentacao_servicos  ";
    select += " INNER JOIN comiss ON comiss.id_venda=movimentacao_servicos.id ";
    select += " INNER JOIN entidade op ON op.id=comiss.id_vendedor   ";
    
    if(equipe){ 
        if(equipe != "*"){ 
            if(!where){ 
                where += " WHERE (op.id_equipe = '" + equipe + "') "; 
            }else{ 
                where += " AND (op.id_equipe = '" + equipe + "')  "; 
            } 
        }else{
            if(!where){ 
                where += " WHERE (op.id_equipe IS NULL) "; 
            }else{ 
                where += " AND (op.id_equipe  IS NULL)  "; 
            } 
        } 
    } 
    
    select = select + where; 
    select += " GROUP BY op.nm_razaosocial, op.id ";
    console.log(select);

    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
         var request = new sql.Request(); 
        request.query(select, function (err, recordset){ 
            if (err) console.log(err); 

            var retorno = recordset;
            var sqlstring = "";
            
                       
            if(equipe == "*"){
                equipe = "NULL";
            }else{
                equipe = "'" + equipe + "'";
            }

            if(retorno){
                if(retorno.recordset){
                    sqlstring += " DELETE FROM comissao_apuracao WHERE nm_datade='" + dataDe + "' AND nm_dataate='" + dataAte + "' AND id_equipe " + campoequipe + "; ";
                    
                    for(var i = 0; i < retorno.recordset.length; i++){
                        if(!retorno.recordset[i].idcomissaoapuracao){
                            sqlstring += " INSERT INTO comissao_apuracao (id, id_entidade, nm_datade, nm_dataate, id_equipe) VALUES('" + retorno.recordset[i].id + "','" + retorno.recordset[i].idoperador + "', '" + dataDe + "', '" + dataAte + "' , " + equipe + "); ";
                            if(retorno.recordset[i].insup == "0"){
                                sqlstring += " INSERT INTO comissao_desconto (id, nm_descricao, id_contas_pagar, vl_desconto) ";
                                sqlstring += " VALUES (NEWID(), 'Dedução referente a PIS, COFINS e ISS.', '" + retorno.recordset[i].id + "',  ";
                                sqlstring += " IIF((SELECT TOP 1 vl_tributoservicos FROM empresa WHERE id='9F39BDCF-6B98-45DE-A819-24B7F3EE2560') IS NULL,0, ";
                                sqlstring += " CAST('" + retorno.recordset[i].valor.replace(".","").replace(",",".").replace("R$ ","") + "' AS decimal) * (CAST((SELECT TOP 1 vl_tributoservicos FROM empresa WHERE id='9F39BDCF-6B98-45DE-A819-24B7F3EE2560') AS decimal) / 100))); ";
                            }
                        }
                        
                    }
                }
            }else{
                res.send(false)
            }
            
            
            sql.close()
            sql.connect(config).then(function() {
                var request = new sql.Request();
                request.query(sqlstring).then(function(recordset) {
                    res.send(retorno); 
                }).catch(function(err) { 
                    console.log(err)                   
                    res.send(false)
                });
            });
           
        }); 
     }); 

});

router.route('/carregaListaEquipe').get(function(req, res) {
    var retorno = "<option value=''>Selecione...</option>";
    var select = "SELECT equipe.id AS 'id', "; 
    select += " equipe.nm_descricao AS 'descricao' "; 
    select += " FROM equipe "; 

    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(select, function (err, recordset){ 
                if (err) console.log(err);
                
                for(var i = 0; i < recordset.recordset.length; i++){
                    retorno += "<option value='" + recordset.recordset[i].id + "'>" + recordset.recordset[i].descricao + "</option>"; 
                }
                
                res.send(retorno); 
        }); 
    }); 
});

router.route('/gravarControleComissaoPagarDesconto/:descricao/:desconto/:idcomissaoapuracao/:id/:idplanocontas').get(function(req, res) { 
    var id = req.param('id');   
    var descricao = req.param('descricao'); 
    var desconto = req.param('desconto'); 
    var idcomissaoapuracao = req.param('idcomissaoapuracao'); 
    var idplanocontas = req.param('idplanocontas');

    var insertupdate = ""; 

    if(desconto.indexOf(',') >= 0){
        desconto = desconto.replace(".", "").replace(",", ".");
    }

    if(id == "*"){
        insertupdate = "INSERT INTO comissao_desconto (id, nm_descricao, id_contas_pagar, vl_desconto, id_plano_contas_financeiro) ";
        insertupdate += " VALUES(newID(), '" + descricao + "', '" + idcomissaoapuracao + "', '" + desconto + "', '" + idplanocontas + "')";
    }else{        
        insertupdate = "UPDATE comissao_desconto SET nm_descricao='" + descricao + "', vl_desconto=" + desconto + ", id_plano_contas_financeiro='" + idplanocontas + "' WHERE id='" + id + "'";
    }

    console.log(insertupdate);

    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(insertupdate, function (err, recordset){ 
            if (err) console.log(err);
                            
            res.send(true); 
        }); 
    });  
});

router.route('/carregaDropdownSubservicosMovimentacao/:id').get(function(req, res) {
   var retorno = "<option value=''>Selecione...</option>";
    var id = req.param('id'); 
    var select = "SELECT produtos.id AS 'id', produtos.nm_descricao AS 'descricao', "; 
    select += " movimentacao_servicos.id_subservicos AS 'index' , produtos.id_dsg_moeda AS 'idmoeda',";
    select += " (SELECT vl_valor FROM cliente_servicos WHERE cliente_servicos.id_dsg_moeda=produtos.id_dsg_moeda AND cliente_servicos.id_produtos=produtos.id AND cliente_servicos.id_entidade=movimentacao_servicos.id_entidade) AS 'valorproduto' ";
    select += " FROM movimentacao_servicos ";
    select += " INNER JOIN produtos_subservicos ON produtos_subservicos.id_produtos=movimentacao_servicos.id_produtos ";
    select += " INNER JOIN produtos ON produtos.id=produtos_subservicos.id_subservicos ";
    select += " WHERE movimentacao_servicos.id='" + id + "' ";
    
    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(select, function (err, recordset){ 
                if (err) console.log(err);
                
                var selected = "";
                console.log(recordset.recordset)
                for(var i = 0; i < recordset.recordset.length; i++){
                    selected = "";
                    if(recordset.recordset[i].id == recordset.recordset[i].index){
                        selected ="selected='selected'";
                    }
                    //retorno += "<option " + selected + " value='" + recordset.recordset[i].id + "'>" + recordset.recordset[i].descricao + "</option>"; 
                    
                    retorno += "<option " + selected + "  data-idoption='" + recordset.recordset[i].id + "' data-valorvenda='" + recordset.recordset[i].valorproduto + "' data-moedavenda='" + recordset.recordset[i].idmoeda + "' value='" + recordset.recordset[i].id + "'>" + recordset.recordset[i].descricao + "</option>";

                }
                
                res.send(retorno); 
        }); 
    }); 
});

router.route('/gerarComissao/:id').get(function(req, res) { 
    var id = req.param('id');   

    var select = " SELECT  IIF((SELECT nr_dias_pagamento_comissao FROM vendedor WHERE id=comiss.id_vendedor) IS NOT NULL , ";
    select += " movimentacao_servicos.dt_emissao + (SELECT nr_dias_pagamento_comissao FROM vendedor WHERE id=comiss.id_vendedor), ";
    select += " movimentacao_servicos.dt_emissao) AS 'dt_emissao', ";
    select += " (SELECT TOP 1 id FROM comiss WHERE id_venda=movimentacao_servicos.id AND comiss.id_vendedor=movimentacao_servicos.id_operador) AS 'idop', ";
    select += " (SELECT TOP 1 id FROM comiss WHERE id_venda=movimentacao_servicos.id AND comiss.id_vendedor=movimentacao_servicos.id_indicador) AS 'idind', ";
    select += " movimentacao_servicos.id_operador AS 'idoperador', ";
    select += " movimentacao_servicos.id_indicador AS 'idindicador',  ";
    select += " (SELECT TOP 1 nm_status FROM comiss WHERE id_venda=movimentacao_servicos.id AND id_operador=movimentacao_servicos.id_operador) AS 'statusop', ";
    select += " (SELECT TOP 1 nm_status FROM comiss WHERE id_venda=movimentacao_servicos.id AND id_operador=movimentacao_servicos.id_indicador) AS 'statusind', ";
    select += " (SELECT TOP 1 vl_comissaooperador FROM vendedor_servicos WHERE vendedor_servicos.id_vendedor=movimentacao_servicos.id_operador AND vendedor_servicos.id_produtos=movimentacao_servicos.id_subservicos) AS 'comissaopercop', ";
    select += " (SELECT TOP 1 vl_comissaooperador FROM vendedor_servicos WHERE vendedor_servicos.id_vendedor=movimentacao_servicos.id_indicador AND vendedor_servicos.id_produtos=movimentacao_servicos.id_subservicos) AS 'comissaopercind'  ";
    select += " , movimentacao_servicos.vl_valor AS 'valormov' ";
 
    select += " FROM movimentacao_servicos ";
    select += " LEFT JOIN comiss ON comiss.id_venda=movimentacao_servicos.id ";

    select += " WHERE movimentacao_servicos.id='" + id + "' ";
    
    console.log("+++++++++++++COMISSAO++++++++++++++++++");
    console.log(select);

    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(select, function (err, recordset){ 
            if (err) console.log(err);
                                 

            if(recordset.recordset.length > 0){
                if(recordset.recordset[0].statusop == "Concluído"){
                    var sucesso = false;
                    var message = "Status Concluído não gera comissão";

                    var resposta = {
                        success: sucesso,
                        message: message
                    }
                    res.json(resposta);
                }
                

                var idcomissop =  recordset.recordset[0].idop;
                var idcomissind =  recordset.recordset[0].idind;
                var idcomiss = recordset.recordset[0].id;
                var id_operador = recordset.recordset[0].idoperador;
                var id_indicador = recordset.recordset[0].idindicador;
                var nm_status = "Pendente";
                var id_empresa = "9F39BDCF-6B98-45DE-A819-24B7F3EE2560";
                var numero_pedido = "";
                var dt_emissao = "";
                var vl_venda =  recordset.recordset[0].valormov;
                var vl_comissaoOp = "";
                var vl_comissaoInd = "";
                var vl_comissaopercOP = recordset.recordset[0].comissaopercop;
                var vl_comissaopercIND = recordset.recordset[0].comissaopercind;
                
                var insertupdate = ""; 

                var today = new Date();

                if(recordset.recordset[0].dt_emissao){
                    today = new Date(recordset.recordset[0].dt_emissao);
                }
                var dd = today.getDate() + 1;
                var mm = today.getMonth() + 1;

                var yyyy = today.getFullYear();
                if(dd<10){
                    dd='0'+dd;
                } 
                if(mm<10){
                    mm='0'+mm;
                } 
                var dt_emissao = mm + '/' + dd + '/' + yyyy;   
                var valorcomiss = 0;

                console.log("idcomissop=" + idcomissop);
                console.log("idcomissind=" + idcomissind);

                if((id_operador != null && id_indicador == null) || (id_operador == id_indicador && id_operador != null && id_indicador != null)){
                   
                    if(vl_comissaopercOP){
                        valorcomiss = (parseFloat(vl_venda) * parseFloat(vl_comissaopercOP).toFixed(2)) / 100;
                        valorcomiss = valorcomiss.toFixed(2);
                        vl_comissaoOp = valorcomiss.toString();
                    }
                    id_indicador = "";
                }else{
                    if(id_operador != id_indicador){
                        if(vl_comissaopercIND){
                            valorcomiss = (parseFloat(vl_venda) * parseFloat(vl_comissaopercIND).toFixed(2)) / 100;
                            valorcomiss = valorcomiss.toFixed(2);                                
                            vl_comissaoInd = valorcomiss.toString();
                            if(vl_comissaopercOP){
                                valorcomiss = ((parseFloat(vl_venda) - parseFloat(vl_comissaoInd)) * parseFloat(vl_comissaopercOP).toFixed(2)) / 100;
                                valorcomiss = valorcomiss.toFixed(2); 
                                vl_comissaoOp = valorcomiss.toString();
                            }
                            
                        }
                    }
                }

                if(vl_comissaoOp == ""){
                    vl_comissaoOp = "0";
                    var sucesso = false;
                    var message = "Não existe configuração para gerar a comissão";

                    var resposta = {
                        success: sucesso,
                        message: message
                    }
                    res.json(resposta);
                }

                if(idcomissop == null){
                    if(id_operador){
                        insertupdate = " INSERT INTO comiss ";
                        insertupdate += " (id, id_vendedor, id_venda, nm_status, id_empresa, numero_pedido, dt_emissao, vl_venda, vl_comissao)";
                        insertupdate += " VALUES(newID(), '" + id_operador + "', '" + id + "', '" + nm_status + "', '" + id_empresa + "', '" + numero_pedido + "', '" + dt_emissao + "', " + vl_venda + ", " + vl_comissaoOp + ");";          
                    }
                }else{
                    if(id_operador){
                        insertupdate += " UPDATE comiss SET id_vendedor='" + id_operador + "',id_venda='" + id + "', nm_status='" + nm_status + "', id_empresa='" + id_empresa + "', numero_pedido='" + numero_pedido + "', dt_emissao='" + dt_emissao + "', vl_venda=" + vl_venda + ", vl_comissao=" + vl_comissaoOp + " WHERE id='" + idcomissop + "' ;";
                    }
                }
                
                if(vl_comissaoInd == ""){
                    vl_comissaoInd = "0";
                }
                
                if(idcomissind == null){
                    if(id_indicador){
                        insertupdate += " INSERT INTO comiss ";
                        insertupdate += " (id, id_vendedor, id_venda, nm_status, id_empresa, numero_pedido, dt_emissao, vl_venda, vl_comissao)";
                        insertupdate += " VALUES(newID(), '" + id_indicador + "', '" + id + "', '" + nm_status + "', '" + id_empresa + "', '" + numero_pedido + "', '" + dt_emissao + "', " + vl_venda + ", " + vl_comissaoInd + ");";          
                    }
                }else{
                    if(id_indicador){
                        insertupdate += " UPDATE comiss SET id_vendedor='" + id_indicador + "',id_venda='" + id + "', nm_status='" + nm_status + "', id_empresa='" + id_empresa + "', numero_pedido='" + numero_pedido + "', dt_emissao='" + dt_emissao + "', vl_venda=" + vl_venda + ", vl_comissao=" + vl_comissaoInd + " WHERE id='" + idcomissind + "' ;";
                    }
                }

                console.log("insertupdate === ")
                console.log(insertupdate)
                sql.close(); 
                sql.connect(config, function (err) { 
                    if (err) console.log(err); 
                    
                    var request = new sql.Request();
                    request.query(insertupdate).then(function(recordset) {
                        var sucesso = true;
                        var message = "Comissão gerada com sucesso!";

                        var resposta = {
                            success: sucesso,
                            message: message
                        }
                        res.json(resposta); 
                    }).catch(function(err) { 
                        console.log(err)
                        var sucesso = false;
                        var message = "Falha ao gerar a comissão";

                        var resposta = {
                            success: sucesso,
                            message: message
                        }
                        res.json(resposta);
                    });
                }); 
            }
        });
    });     
});

router.route('/carregaControleComissaoPagarDesconto/:id').get(function(req, res) {
    var id = req.param('id'); 
    var where = ""; 
    var select = "SELECT id AS 'id', nm_descricao AS 'descricao' , vl_desconto AS 'desconto', (SELECT nm_descricao FROM plano_contas_financeiro WHERE id=comissao_desconto.id_plano_contas_financeiro) AS 'plano_contas'"; 
    select += " FROM comissao_desconto "; 
    select += " WHERE id_contas_pagar='" + id + "'";

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

router.route('/editarControleComissaoPagarDesconto/:id').get(function(req, res) {
    var id = req.param('id'); 
    var where = ""; 
    var select = "SELECT id AS 'id', nm_descricao AS 'descricao' , vl_desconto AS 'desconto', id_plano_contas_financeiro AS 'plano_contas'"; 
    select += " FROM comissao_desconto "; 
    select += " WHERE id='" + id + "'";

    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(select, function (err, recordset){ 
                if (err) console.log(err);

                res.send(recordset.recordset); 
        }); 
    }); 
});

router.route('/deletarControleComissaoPagarDesconto/:id').get(function(req, res) {
    var id = req.param('id'); 
    var where = ""; 
    var select = "DELETE "; 
    select += " FROM comissao_desconto "; 
    select += " WHERE id='" + id + "'";

    var message = { success: false, message: "" };
    
    sql.close();
    sql.connect(config).then(function() {
        var request = new sql.Request();
        request.query(select).then(function(recordset) {
            message.success = true;
            message.message = "Deletado com sucesso";
            res.send(message)
        }).catch(function(err) { 
            console.log(err)  
            message.success = false;
            message.message = "Falha ao deletar";                 
            res.send(message)
        });
    }) 
});

router.route('/carregaControleComissaoPagarEquipe/:equipe').get(function(req, res) {
   
    var equipe = req.param('equipe'); 
    var where = ""; 
    var select = "SELECT entidade.id AS 'id', entidade.nm_razaosocial AS 'descricao', ('0') AS 'valor'  ";
    select += " FROM entidade ";
    select += " INNER JOIN equipe ON equipe.id=entidade.id_equipe ";
    select += " WHERE equipe.id='" +  equipe + "'"; 

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

router.route('/gerarContasReceber/:id').get(function(req, res) {
    var id = req.param('id'); 
    
    var select = "SELECT entidade.id AS 'id', entidade.nm_razaosocial AS 'descricao', ('0') AS 'valor'  ";
    select += " FROM entidade ";
    select += " INNER JOIN equipe ON equipe.id=entidade.id_equipe ";
    select += " WHERE equipe.id='" +  id + "'"; 

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

router.route('/filtrarImportacaoBySisco/:dataDe/:dataAte/:cliente/:servico/:cotacao').get(function(req, res) {

    var dataDe = req.param('dataDe');
    var dataAte = req.param('dataAte');

    var cliente = req.param('cliente');
    var servico = req.param('servico');
    var cotacao = req.param('cotacao');
    var valorcotacao = 0;

    if(cotacao.indexOf(',') >= 0){
        cotacao = cotacao.replace(".","").replace(",",".");
    }

    var where = "";
    var query = "";

    const { Pool } = require('pg');
    const pool = new Pool({
        user: 'Intelecta',
        host: 'Brokerbrasil.dyndns.org',
        database: 'BySisco',
        password: '$T3[K?nH|mxI:M8>zE&T',
        port: 5432,
    })
    
    if(servico == "*" || servico == "RVS"){

        query += " SELECT REPLACE(venda.codigo, '/', '-' ) AS idvenda,venda.codigo AS codigo, ";
        query += " TO_CHAR(venda.datacadastro, 'DD/MM/YYYY') AS datacadastro , ";
        query += " pessoa.nome AS nomepessoa, pex.nome AS nomepessoaextrangeira, pessoa.cpfcnpj AS nomeservico, ('RVS') AS cnpj, ('') AS valortotal, ('0') AS existe ";
        query += " , REPLACE(REPLACE(loread(lo_open(venda.informacoescomplementares, 262144), 1000000)::varchar,'x',''),'\\','')::varchar AS info, vendaoperacao.suareferencia AS referencia , NULL AS obs ";
        query += " , nbs.nome AS nbs, venda.idvenda AS idreferencia  ";
        query += " FROM venda ";
        query += " INNER JOIN pessoa ON pessoa.idpessoa = venda.idpessoavenda  ";
        query += " INNER JOIN pessoa pex ON pex.idpessoa = venda.idpessoaadquirente  ";
        query += " INNER JOIN vendaoperacao ON vendaoperacao.idvenda = venda.idvenda ";
        query += " LEFT JOIN nbs ON vendaoperacao.idnbs = nbs.idnbs ";
        if(dataDe){ 
            if(dataDe != "*"){ 
                query += " WHERE venda.datacadastro >= '" + dataDe + " 00:00:00' "; 
                if(dataAte){ 
                    if(dataAte != "*"){ 
                        query += " AND venda.datacadastro <= '" + dataAte + " 23:59:59' "; 
                        
                        if(cliente != "*"){
                            query += " AND pessoa.cpfcnpj = '" + cliente +  "'";
                        }
                    } 
                } 
            } 
        } 
    }
    if(servico == "*"){
        query += " UNION ALL ";
    }

    
    if(servico == "*" || servico == "RAS"){
        query += " SELECT REPLACE(aquisicao.codigo, '/', '-' ) AS idvenda,aquisicao.codigo AS codigo, ";
        query += " TO_CHAR(aquisicao.datacadastro, 'DD/MM/YYYY') AS datacadastro , ";
        query += " pessoa.nome AS nomepessoa, pex.nome AS nomepessoaextrangeira, pessoa.cpfcnpj AS nomeservico, ('RAS') AS cnpj, ('') AS valortotal, ('0') AS existe ";
        query += " , REPLACE(REPLACE(loread(lo_open(aquisicao.informacoescomplementares, 262144), 1000000)::varchar,'x',''),'\\','')::varchar  AS info, aquisicaooperacao.suareferencia AS referencia , NULL AS obs ";
        query += " , nbs.nome AS nbs, aquisicao.idaquisicao AS idreferencia ";
        query += " FROM aquisicao ";
        query += " INNER JOIN pessoa ON pessoa.idpessoa = aquisicao.idpessoaadquirente ";
        query += " INNER JOIN pessoa pex ON pex.idpessoa = aquisicao.idpessoavenda  ";
        query += " INNER JOIN aquisicaooperacao ON aquisicaooperacao.idaquisicao = aquisicao.idaquisicao ";
        query += " LEFT JOIN nbs  ON aquisicaooperacao.idnbs = nbs.idnbs ";

        if(dataDe){ 
            if(dataDe != "*"){ 
                query += " WHERE aquisicao.datacadastro >= '" + dataDe + " 00:00:00' "; 
                if(dataAte){ 
                    if(dataAte != "*"){ 
                        query += " AND aquisicao.datacadastro <= '" + dataAte + " 23:59:59' ";   
                        
                        if(cliente != "*"){
                            query += " AND pessoa.cpfcnpj = '" + cliente +  "'";
                        }  
                    } 
                } 
            } 
        }    
    }

    if(servico == "*"){
        query += " UNION ALL ";
    }

    
    if(servico == "*" || servico == "RF"){
        query += " SELECT REPLACE(faturamento.codigo, '/', '-' ) AS idvenda,faturamento.codigo AS codigo, ";
        query += " TO_CHAR(faturamento.datacadastro, 'DD/MM/YYYY') AS datacadastro , ";
        query += " pessoa.nome AS nomepessoa, pex.nome AS nomepessoaextrangeira,  pessoa.cpfcnpj AS nomeservico, ('RF') AS cnpj, ('') AS valortotal, ('0') AS existe ";
        query += " , REPLACE(REPLACE(loread(lo_open(faturamento.observacoes, 262144), 1000000)::varchar,'x',''),'\\','')::varchar  AS info, NULL AS referencia , NULL AS obs ";
        query += " , nbs.nome AS nbs, venda.idvenda AS idreferencia ";
        query += " FROM faturamento ";
        query += " INNER JOIN venda ON venda.idvenda = faturamento.idvenda ";
        query += " INNER JOIN pessoa ON pessoa.idpessoa = venda.idpessoavenda ";
        query += " INNER JOIN pessoa pex ON pex.idpessoa = venda.idpessoaadquirente  ";
        query += " INNER JOIN faturamentooperacao ON faturamentooperacao.idfaturamento = faturamento.idfaturamento ";        
        query += " INNER JOIN vendaoperacao ON vendaoperacao.idvenda = venda.idvenda ";
        query += " LEFT JOIN nbs ON vendaoperacao.idnbs = nbs.idnbs ";

        if(dataDe){ 
            if(dataDe != "*"){ 
                query += " WHERE faturamento.datacadastro >= '" + dataDe + " 00:00:00' "; 
                if(dataAte){ 
                    if(dataAte != "*"){ 
                        query += " AND faturamento.datacadastro <= '" + dataAte + " 23:59:59' ";  
                        
                        if(cliente != "*"){
                            query += " AND pessoa.cpfcnpj = '" + cliente +  "'";
                        }       
                    } 
                } 
            } 
        } 
    }

    if(servico == "*"){
        query += " UNION ALL ";
    }
   

    
    if(servico == "*" || servico == "RP"){
        query += " SELECT REPLACE(pagamento.codigo, '/', '-' ) AS idvenda,pagamento.codigo AS codigo, ";
        query += " TO_CHAR(pagamento.datacadastro, 'DD/MM/YYYY') AS datacadastro , ";
        query += " pessoa.nome AS nomepessoa, pex.nome AS nomepessoaextrangeira, pessoa.cpfcnpj AS nomeservico, ('RP') AS cnpj, ('') AS valortotal, ('0') AS existe ";
        query += " , REPLACE(REPLACE(loread(lo_open(pagamento.observacoes, 262144), 1000000)::varchar,'x',''),'\\','')::varchar  AS info, NULL AS referencia , NULL AS obs ";
        query += " , nbs.nome AS nbs, aquisicao.idaquisicao AS idreferencia ";

        query += " FROM pagamento ";
        query += " INNER JOIN aquisicao ON aquisicao.idaquisicao = pagamento.idaquisicao ";
        query += " INNER JOIN pessoa ON pessoa.idpessoa = aquisicao.idpessoaadquirente ";
        query += " INNER JOIN pessoa pex ON pex.idpessoa = aquisicao.idpessoavenda  ";
        query += " INNER JOIN pagamentooperacao ON pagamentooperacao.idpagamento = pagamento.idpagamento ";
        query += " INNER JOIN aquisicaooperacao ON aquisicaooperacao.idaquisicao = aquisicao.idaquisicao ";
        query += " LEFT JOIN nbs ON aquisicaooperacao.idnbs = nbs.idnbs ";
        if(dataDe){ 
            if(dataDe != "*"){ 
                query += " WHERE pagamento.datacadastro >= '" + dataDe + " 00:00:00' "; 
                if(dataAte){ 
                    if(dataAte != "*"){ 
                        query += " AND pagamento.datacadastro <= '" + dataAte + " 23:59:59' "; 
                        
                        if(cliente != "*"){
                            query += " AND pessoa.cpfcnpj = '" + cliente +  "'";
                        }        
                    } 
                } 
            } 
        } 
    }
    

    
    
    /*
    if(cliente){ 
        if(cliente != "*"){ 
            if(!where){ 
                where += " WHERE (op.id_equipe = '" + cliente + "') "; 
            }else{ 
                where += " AND (op.id_equipe = '" + cliente + "')  "; 
            } 
        }else{
            if(!where){ 
                where += " WHERE (op.id_equipe IS NULL) "; 
            }else{ 
                where += " AND (op.id_equipe  IS NULL)  "; 
            } 
        } 
    } 
    */

   //query = query + where; 
    //query += " WHERE venda.datacadastro >= '01/02/2018' AND venda.datacadastro <= '01/03/2018'";

    query += " ORDER BY datacadastro ASC ";
    
    console.log(query)
    pool.query(query,  (err, rest) => {
        //console.log(err, rest)
        pool.end();
        
        /*
        rest = {}
        rest.rows = [];

        rest.rows.push({
            idvenda: 111392,
            codigo: "RA18/00111392",
            datacadastro: "20/12/2018",
            nomepessoa: "VIAVI SOLUTIONS DO BRASIL LTDA. ",
            nomeservico: "31449861000185",
            cnpj: "RAS",
            valortotal: 23.41,
            existe: "1"
            },
            {
            idvenda: 111390,
            codigo: "RA18/00111390",
            datacadastro: "20/12/2018",
            nomepessoa: "VIAVI SOLUTIONS DO BRASIL LTDA. ",
            nomeservico: "31449861000185",
            cnpj: "RAS",
            valortotal: 23.41,
            existe: "1"
            },
            {
                idvenda: 112892,
                codigo: "RA19/00112892",
                datacadastro: "02/01/2019",
                nomepessoa: "VISCOFAN / 65.019.655/0002-38",
                nomeservico: "65019655000238",
                cnpj: "RAS",
                valortotal: 123.45,
                existe: "1"
                },
                {
                idvenda: 112891,
                codigo: "RA19/00112891",
                datacadastro: "02/01/2019",
                nomepessoa: "VISCOFAN / 65.019.655/0002-38",
                nomeservico: "65019655000238",
                cnpj: "RP",
                valortotal: 123.45,
                existe: "1"
                },
                {
                idvenda: 112890,
                codigo: "RA19/00112890",
                datacadastro: "02/01/2019",
                nomepessoa: "VISCOFAN / 65.019.655/0002-38",
                nomeservico: "65019655000238",
                cnpj: "RF",
                valortotal: 123.45,
                existe: "1"
                },
                {
                idvenda: 111000,
                codigo: "RA18/00111000",
                datacadastro: "12/12/2018",
                nomepessoa: "VISCOFAN / 65.019.655/0002-38",
                nomeservico: "65019655000238",
                cnpj: "RAS",
                valortotal: 123.45,
                existe: "1"
                }
            );
            */

        //console.log(rest)
        var select = "SELECT REPLACE(REPLACE(REPLACE(entidade.nm_cnpj, '-', ''), '/', ''), '.', '') AS 'nm_cnpj',";
        select += " REPLACE(REPLACE(REPLACE(cadastro_trading.nm_cnpj, '-', ''), '/', ''), '.', '') AS 'cnpjtranding', ";
        select += " cliente_servicos.vl_valor AS 'valor', sub.nm_tiposervico AS 'tipo', ";
        select += " cliente_servicos.id_dsg_moeda AS idmoeda ";
        select += " FROM entidade ";
        select += " INNER JOIN cliente_servicos ON cliente_servicos.id_entidade=entidade.id ";
        select += " INNER JOIN subservico sub ON sub.id=cliente_servicos.id_produtos ";
        select += " LEFT JOIN operador_trading ON operador_trading.id_entidade=entidade.id   "; 
		select += " LEFT JOIN cadastro_trading ON cadastro_trading.id=operador_trading.id_cadastro_trading ";
        select += " WHERE ";

        var where = "";

        for (let index = 0; index < rest.rows.length; index++) {
            const element = rest.rows[index];
            var cnpj = element.nomeservico;
            var nomeservico = element.cnpj;

            cnpj = cnpj.replace(".","").replace(".","").replace("/","").replace("-","");            
            cnpj = cnpj.substr(0, 2) + "." + cnpj.substr(2, 3) + "." + cnpj.substr(5, 3)+ "/" + cnpj.substr(8, 4)+ "-" + cnpj.substr(12, 2);

            if(index != 0){
                where += " OR ";
            }   

            where += " (cadastro_trading.nm_cnpj='" + cnpj + "' AND sub.nm_tiposervico='" + nomeservico + "') OR  ";
            where += " (entidade.nm_cnpj='" + cnpj + "' ";            
            where += " AND sub.nm_tiposervico='" + nomeservico + "')";            
        }

        select = select + where;
        console.log(select);

        sql.close(); 
        sql.connect(config, function (err) { 
            if (err) console.log(err); 
            var request = new sql.Request(); 
            request.query(select, function (err, recordset){ 
                if (err) console.log(err);
                
                if(recordset){
                    if(recordset.recordsets){
                        for (let index = 0; index < rest.rows.length; index++) {
                            if(rest.rows[index].info){
                                rest.rows[index].info = hexToAscii(rest.rows[index].info)
                            }
                            
                            const element = rest.rows[index];
                            var i = adicionaOuRemove(rest.rows[index].nomeservico,rest.rows[index].cnpj ,recordset.recordsets[0]);
                            if(i >= 0){
                                rest.rows[index].existe = "1";
                                rest.rows[index].nomeservico = recordset.recordsets[0][i].nm_cnpj; 

                                if(recordset.recordsets[0][i].idmoeda == "8E42C4B2-AC2A-4102-AE1F-6CADEEAA5E3B"){
                                    rest.rows[index].valortotal = recordset.recordsets[0][i].valor; 
                                }else{
                                    valorcotacao = parseFloat(recordset.recordsets[0][i].valor) * parseFloat(cotacao);
                                    rest.rows[index].valortotal = valorcotacao;
                                }                                  
                            }    
                            
                            rest.rows[index].obs = "";
                            if(rest.rows[index].info){
                                rest.rows[index].obs = "- Informações complementares: " + rest.rows[index].info;
                            }
                            
                            if(rest.rows[index].referencia){
                                rest.rows[index].obs += " - Referência: " + rest.rows[index].referencia;
                            }
                        }
                    }
                }
                rest.rows.sort(compare);
                res.send(rest); 
            }); 
        }); 

    })
     
});

function hexToAscii(str){
    hexString = str;
    strOut = '';
        for (x = 0; x < hexString.length; x += 2) {
            strOut += String.fromCharCode(parseInt(hexString.substr(x, 2), 16));
        }
    return strOut;    
}

function adicionaOuRemove(id, tipo, obj) {
    let index = obj.findIndex(obj => obj.nm_cnpj == id && obj.tipo == tipo);
    if(index < 0) {
        let index = obj.findIndex(obj => obj.cnpjtranding == id && obj.tipo == tipo);
        if(index < 0) {
            return index;
        } else {
            return index;
        }
    } else {
        return index;
    }
}


  
function compare(a,b) {
    if (a.existe < b.existe)
        return -1;
    if (a.existe > b.existe)
        return 1;
    return 0;
}
  
router.route('/onLoadVendedorServicos/:idVendedor').get(function(req, res) {
    var idVendedor = req.param('idVendedor'); 
    
    var  select = "SELECT produtos.id as 'id', produtos.nm_descricao as 'descricao', ";
    select += " IIF((SELECT vl_comissaooperador FROM vendedor_servicos WHERE id_vendedor='" + idVendedor + "' ";
    select += " AND id_produtos=produtos.id) IS NULL,0,(SELECT vl_comissaooperador FROM vendedor_servicos WHERE id_vendedor='" + idVendedor + "' ";
    select += " AND id_produtos=produtos.id)) AS 'percOP', ";      
    select += " IIF((SELECT vl_comissaoindicador FROM vendedor_servicos WHERE id_vendedor='" + idVendedor + "' ";
    select += " AND id_produtos=produtos.id) IS NULL,0,(SELECT vl_comissaoindicador FROM vendedor_servicos WHERE id_vendedor='" + idVendedor + "' ";
    select += " AND id_produtos=produtos.id)) AS 'percInd' ";    
    select += " FROM produtos WHERE id_tipoproduto='5F1FCE95-1AAC-43D8-BB0C-689ECEE69574'; ";

    select += "SELECT subservico.id as 'id', subservico.nm_descricao as 'descricao', ";
    select += " IIF((SELECT vl_comissaooperador FROM vendedor_servicos WHERE id_vendedor='" + idVendedor + "' ";
    select += " AND id_produtos=subservico.id) IS NULL,0,(SELECT vl_comissaooperador FROM vendedor_servicos WHERE id_vendedor='" + idVendedor + "' ";
    select += " AND id_produtos=subservico.id)) AS 'percOP', ";      
    select += " IIF((SELECT vl_comissaoindicador FROM vendedor_servicos WHERE id_vendedor='" + idVendedor + "' ";
    select += " AND id_produtos=subservico.id) IS NULL,0,(SELECT vl_comissaoindicador FROM vendedor_servicos WHERE id_vendedor='" + idVendedor + "' ";
    select += " AND id_produtos=subservico.id)) AS 'percInd' ";
    
    select += " FROM subservico ";

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

router.route('/carregarClienteServico/:idEntidade').get(function(req, res) {
    var idEntidade = req.param('idEntidade'); 
    
    var  select = "";

    select += " SELECT subservico.id as 'id', subservico.nm_descricao as 'descricao', ";
    select += " IIF((SELECT vl_valor FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=subservico.id) IS NULL,0,(SELECT vl_valor FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=subservico.id)) AS 'valor',";

    select += " IIF((SELECT id_dsg_moeda FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=subservico.id) IS NULL,NULL,(SELECT id_dsg_moeda FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=subservico.id)) AS 'idmoeda',";

    select += " IIF((SELECT nm_descricao FROM cliente_servicos INNER JOIN dsg_moeda ON dsg_moeda.id=cliente_servicos.id_dsg_moeda WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=subservico.id) IS NULL,NULL,(SELECT nm_descricao FROM cliente_servicos INNER JOIN dsg_moeda ON dsg_moeda.id=cliente_servicos.id_dsg_moeda WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=subservico.id)) AS 'moeda', ";

    select += " IIF((SELECT sn_notaunica FROM cliente_servicos WHERE id_entidade='" + idEntidade + "'  ";
    select += " AND id_produtos=subservico.id) IS NULL,0,(SELECT sn_notaunica FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=subservico.id)) AS 'notaunica' ";

    select += " FROM subservico ORDER BY valor DESC";

    select += " SELECT produtos.id as 'id', produtos.nm_descricao as 'descricao', ";
    select += " IIF((SELECT vl_valor FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=produtos.id) IS NULL,0,(SELECT vl_valor FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=produtos.id)) AS 'valor',";

    select += " IIF((SELECT id_dsg_moeda FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=produtos.id) IS NULL,NULL,(SELECT id_dsg_moeda FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=produtos.id)) AS 'idmoeda',";

    select += " IIF((SELECT nm_descricao FROM cliente_servicos INNER JOIN dsg_moeda ON dsg_moeda.id=cliente_servicos.id_dsg_moeda WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=produtos.id) IS NULL,NULL,(SELECT nm_descricao FROM cliente_servicos INNER JOIN dsg_moeda ON dsg_moeda.id=cliente_servicos.id_dsg_moeda WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=produtos.id)) AS 'moeda',";

    select += " IIF((SELECT sn_notaunica FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=produtos.id) IS NULL,0,(SELECT sn_notaunica FROM cliente_servicos WHERE id_entidade='" + idEntidade + "' ";
    select += " AND id_produtos=produtos.id)) AS 'notaunica'";
    
    select += " FROM produtos WHERE id_tipoproduto='5F1FCE95-1AAC-43D8-BB0C-689ECEE69574' ORDER BY valor DESC; ";

    console.log(select)
    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(select, function (err, recordset){ 
            if (err) console.log(err);

            var obj = {};
            obj.recordsets = [[]];

            for (let index = 0; index < recordset.recordsets[0].length; index++) {
                if(recordset.recordsets[0][index].valor > 0){
                    obj.recordsets[0].push(recordset.recordsets[0][index]);
                }
            }
            
            for (let index = 0; index < recordset.recordsets[1].length; index++) {
                if(recordset.recordsets[1][index].valor > 0){
                    obj.recordsets[0].push(recordset.recordsets[1][index]);
                }
            }

            for (let index = 0; index < recordset.recordsets[0].length; index++) {
                if(recordset.recordsets[0][index].valor == 0){
                    obj.recordsets[0].push(recordset.recordsets[0][index]);
                }
            }
            
            for (let index = 0; index < recordset.recordsets[1].length; index++) {
                if(recordset.recordsets[1][index].valor == 0){
                    obj.recordsets[0].push(recordset.recordsets[1][index]);
                }
            }

            res.send(obj); 
        }); 
    }); 
});

router.route('/gravarClienteServico/:idprodutos/:valor/:idmoeda/:unicamoeda/:idEntidade').get(function(req, res) { 
     
    var idprodutos = req.param('idprodutos');
    var valor = req.param('valor');
    var idmoeda = req.param('idmoeda')
    var unicamoeda = req.param('unicamoeda');
    var idEntidade = req.param('idEntidade');

    var insertupdate = ""; 

    if(valor.indexOf(',') >= 0){
        valor = valor.replace(".", "").replace(",", ".");
    }

    if(unicamoeda != "1"){
        unicamoeda = "NULL"
    }

    insertupdate = "DELETE FROM cliente_servicos WHERE id_produtos='" + idprodutos + "' AND id_entidade='" + idEntidade + "';"
    
    insertupdate += "INSERT INTO cliente_servicos (id, id_produtos, vl_valor, id_dsg_moeda, sn_notaunica, id_entidade) ";
    insertupdate += " VALUES(newID(), '" + idprodutos + "', " + valor + ",'" + idmoeda + "'," + unicamoeda + ", '" + idEntidade + "');";
    

    console.log(insertupdate);

    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(insertupdate, function (err, recordset){ 
            if (err) console.log(err);
                            
            res.send(true); 
        }); 
    });  
});

router.route('/gerarContasPagar').post(function(req, res) {     

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    var idMovimentacao = null; //req.param('idMovimentacao'); 
    var EnterpriseID = null; //req.param('EnterpriseID'); 
    var idUsuario = null; //req.param('idUsuario'); 
    var parametros = null;

    var query = "";
    var resposta = {};
    var nrParcela = 0;
    var arrayMovimentacao = null; //idMovimentacao.split(",");
    var j = 0;
    var arrayResposta = [];
    var total = 0;
    var parcela = null;
    var titulo = null;
    var Atitulo = [];

    try{
        parametros = req.body.parametros;
        arrayMovimentacao = parametros.idTitulo;
        EnterpriseID = parametros.idEmpresa;
        idUsuario = parametros.idUsuario;

        sql.close();
        sql.connect(config, function (err) {
            var where = "";
            for (let k = 0; k < arrayMovimentacao.length; k++) {
                if(k == 0){
                    where += " ca.id='" + arrayMovimentacao[k] + "' ";
                }else{
                    where += " OR ca.id='" + arrayMovimentacao[k] + "' ";
                }
                
            }

            query += "SELECT  ca.id AS 'id',  ";
            query += " op.id AS 'id_entidade',   ";
            query += " op.nm_razaosocial AS 'operador',   ";
            query += " SUM(comiss.vl_comissao) AS 'valor',  ";
            
            query += " SUM(comiss.vl_comissao) - IIF((SELECT SUM(vl_desconto) FROM comissao_desconto WHERE id_contas_pagar= ";
            query += " (SELECT  TOP 1 id FROM comissao_apuracao WHERE  comissao_apuracao.nm_status IS NULL  AND  comissao_apuracao.id_entidade=op.id   ";
            query += " AND comissao_apuracao.id_entidade=op.id )) IS NULL, ";
            query += " 0,(SELECT SUM(vl_desconto) FROM comissao_desconto WHERE id_contas_pagar= ";
            query += " (SELECT  TOP 1 id FROM comissao_apuracao WHERE  comissao_apuracao.nm_status IS NULL  AND comissao_apuracao.id_entidade=op.id   ";
            query += " AND comissao_apuracao.id_entidade=op.id ))) AS 'valortotal',  ";
            
            query += " (SELECT TOP 1 id FROM parcelamento WHERE nr_numeroparcelas=1) AS 'id_parcelamento', ";
            
            query += " GETDATE() AS 'dt_emissao', ";
            query += "IIF((SELECT TOP 1 nm_documento FROM contas_pagar ORDER BY nm_documento DESC) IS NULL,0,(SELECT TOP 1 nm_documento FROM contas_pagar ORDER BY nm_documento DESC)) AS 'nr_pedido' ";
            
            query += " FROM movimentacao_servicos   ";
            query += " INNER JOIN comiss ON comiss.id_venda=movimentacao_servicos.id  ";
            query += " INNER JOIN entidade op ON op.id=comiss.id_vendedor  ";
            query += " INNER JOIN comissao_apuracao ca ON ca.id_entidade=op.id ";
            query += " WHERE " + where + " ";
            query += " GROUP BY op.nm_razaosocial, op.id, ca.id ";

            console.log(query);

            //err = "true"
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
                        var movimentacao = recordset.recordsets[0][0];

                        gerarparcelas(config,EnterpriseID,movimentacao.id_parcelamento,movimentacao.valortotal,new Date(movimentacao.dt_emissao),(function(respostaParcelas){
                            
                            try{
                                if(respostaParcelas.status > 0){
                                    for (let h = 0; h < recordset.recordsets[0].length; h++) {
                                        movimentacao = recordset.recordsets[0][h];
                                        total = 0;
                                        parcela = null;
                                        titulo = {
                                            idEmpresa: EnterpriseID,
                                            idUsuario: idUsuario,
                                            idTitulo: "",
                                            idEntidade: movimentacao.id_entidade,
                                            idPedido: movimentacao.id,
                                            //idNotaFiscal: compra.id_notafiscal,
                                            nrTitulo: parseInt(movimentacao.nr_pedido) + (h + 1),
                                            emissao: new Date(movimentacao.dt_emissao).toISOString(),
                                            competencia: "",
                                            valor: movimentacao.valortotal,
                                            idContaFinanceira: "",
                                            idParcelamento: movimentacao.id_parcelamento,
                                            observacao: "",
                                            dre: 0,
                                            idOrigem: movimentacao.id,
                                            parcelas: []
                                        };
                            
                                        for(i = 0; i < respostaParcelas.parcelas.length; i++){
                                            nrParcela++;
                                            parcela = {
                                                idParcela: "",
                                                documento: parseInt(movimentacao.nr_pedido) + (h + 1),
                                                parcela: respostaParcelas.parcelas[i].parcela,
                                                vencimento: new Date(respostaParcelas.parcelas[i].vencimento).toISOString(),
                                                valor: movimentacao.valortotal,
                                                idBanco: "",
                                                idFormaPagamento: movimentacao.id_formapagamento,
                                                idContaFinanceira: "",
                                                fluxoCaixa: "1"
                                            };
                                            total += parseFloat(movimentacao.valortotal);
                                            titulo.parcelas.push(parcela);
                                        }                        
                                        
                                        titulo.valor = total;
                                        Atitulo.push(titulo);
                                    }

                                    //if(total > 0){  
                                        
                                        funAtualizarConta(Atitulo,(function(repostacallback){
                                            j += 1;
                                            arrayResposta.push(repostacallback);  
                                            
                                            query = "SELECT  comiss.id AS 'id', ";
                                            query += " comiss.nm_status AS 'status' ";
                                            query += " FROM movimentacao_servicos   "; 
                                            query += " INNER JOIN comiss ON comiss.id_venda=movimentacao_servicos.id   ";
                                            query += " INNER JOIN entidade op ON op.id=comiss.id_vendedor   ";
                                            query += " INNER JOIN comissao_apuracao ca ON ca.id_entidade=op.id  ";
                                            query += " WHERE " + where + " AND comiss.nm_status='Em Pagamento' ";
                                            sql.close()
                                            sql.connect(config).then(function() {
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
                                                    var comissaoFinal = [];
                                                    comissaoFinal = recordset.recordsets[0];
                                                    var queryComiss = "";
                                                    for(s = 0; s < comissaoFinal.length; s++){
                                                        queryComiss += "UPDATE comiss SET nm_status='Concluído' WHERE id='" + comissaoFinal[s].id + "'; ";
                                                    }

                                                    where = "";
                                                    for (let k = 0; k < arrayMovimentacao.length; k++) {
                                                        if(k == 0){
                                                            where += " comissao_apuracao.id='" + arrayMovimentacao[k] + "' ";
                                                        }else{
                                                            where += " OR comissao_apuracao.id='" + arrayMovimentacao[k] + "' ";
                                                        }                                                        
                                                    }

                                                    queryComiss += " UPDATE comissao_apuracao SET nm_status='Concluído' WHERE " + where + " AND nm_status IS NULL; ";
                                                    console.log(queryComiss);

                                                    sql.close()
                                                    sql.connect(config).then(function() {
                                                        var request = new sql.Request();
                                                        request.query(queryComiss).then(function(recordset) {
                                                            res.json(arrayResposta); 
                                                        }).catch(function(err) { 
                                                            console.log(err)                   
                                                            res.send(false)
                                                        });
                                                    });

                                                    
                                                    }
                                                })
                                            })
                                        }));
                                                                            
                                        
                                    /*}else{
                                        resposta = {
                                            status: 0,
                                            mensagem: ["Não foram geradas parcelas para esta movimentação"],
                                            titulo: null
                                        }
                                        res.json(reposta);
                                    } */                                   
                                }else{                                    
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

});

function funAtualizarConta(Aparametros,callbackf) {
    var query = "";
    var queryItens = "";
    var parcela = 0;
    var resposta = null;
    var parametros;

    resposta = {
        status: 1,
        mensagem: [],
        titulo: null
    }

    try{
        for (let j = 0; j < Aparametros.length; j++) {
            parametros = Aparametros[j];
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
                    if(parametros.parcelas[parcela].valor == "" || parametros.parcelas[parcela].valor == "undefined" || isNaN(parametros.parcelas[parcela].valor)){
                        resposta.status = 0;
                        resposta.mensagem.push("A parcela " + (parcela + 1).toString().trim() + " não possui valor.");
                    }
                }
            }

            if(resposta.status == 1){
                if(parametros.idTitulo == ""){
                    parametros.idTitulo = general.guid();
                    query += "insert into contas_pagar (id,id_empresa,id_entidade,id_compra,id_notafiscal,id_parcelamento,id_plano_contas_financeiro,id_origem,nm_documento,dt_emissao,nm_competencia,vl_valor,nm_observacao) values("
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
                        //queryItens += "'" + parametros.parcelas[parcela].documento + "',";
                        queryItens += "'1',";
                        queryItens +=  parametros.parcelas[parcela].fluxoCaixa + ",";
                        queryItens += "'" + parametros.parcelas[parcela].vencimento + "',";
                        queryItens += parametros.parcelas[parcela].valor.toString().trim()
                        queryItens += "); ";
                    }
                }
                else{
                    queryItens = "";
                    query += "update contas_pagar set " 
                    query += "id_plano_contas_financeiro = " + (!parametros.idContaFinanceira ? "null" : "'" + parametros.idContaFinanceira + "'") + ",";
                    query += "nm_competencia = '" + parametros.competencia + "',"
                    query += "nm_observacao = '" + parametros.observacao + "'";
                    query += "where id = '" + parametros.idTitulo + "'";
                    query += " and id_empresa = '" + EnterpriseID + "'; ";
                }
            }
            else{
                resposta.titulo == null;
                callbackf(resposta);
            }
        }
            
        sql.close();
        sql.connect(config, function (err) {    
            if (err){
                resposta.status = -2;
                resposta.mensagem = [];
                resposta.mensagem.push("" + err);
                resposta.titulo = null;
                callbackf(resposta);
            }
            else{
                try{
                    var transacao = new sql.Transaction();
                    transacao.begin(err =>{
                        var request = new sql.Request(transacao);
                        request.query(query, function (err, recordset) {
                            if (err){
                                resposta.status = -3;
                                resposta.mensagem = [];
                                resposta.mensagem.push("" + err);
                                resposta.titulo = null;
                                transacao.rollback();
                                callbackf(resposta);
                            }
                            else{
                                if(queryItens != ""){
                                    try{
                                        var request = new sql.Request(transacao);
                                        request.query(queryItens, function (err, recordset) {
                                            if (err){
                                                resposta.status = -4;
                                                resposta.mensagem = [];
                                                resposta.mensagem.push("" + err);
                                                resposta.titulo = null;
                                                transacao.rollback();
                                                callbackf(resposta);
                                            }
                                            else{
                                                resposta.status = 1;
                                                resposta.mensagem = ["ok"];
                                                resposta.titulo =  Aparametros;
                                                transacao.commit();
                                                callbackf(resposta);
                                            }
                                        })                                    
                                    }
                                    catch(err){
                                        resposta.status = -5;
                                        resposta.mensagem = [];
                                        resposta.mensagem.push("" + erro);
                                        resposta.titulo = null;
                                        callbackf(resposta);                                
                                    }
                                }
                                else{
                                    resposta.status = 1;
                                    resposta.mensagem = ["ok"];
                                    resposta.titulo =  Aparametros;
                                    transacao.commit();
                                    callbackf(resposta);
                                }
                            }
                        })
                    })
                }
                catch(err){
                    resposta.status = -6;
                    resposta.mensagem = [];
                    resposta.mensagem.push("" + erro);
                    resposta.titulo = null;
                    callbackf(resposta);                
                }
            }
        });
        
    }catch(erro){
        resposta.status = -1;
        resposta.mensagem = [];
        resposta.mensagem.push("" + erro);
        resposta.titulo = null;
        callbackf(resposta);
    }
}

function gerarparcelas(config,idEmpresa,idParcelamento,valor,dataInicial,callbackf){
    var sql = require("mssql");
    var parcelas = [];
    var query = "";
    var prefixoFuncao = prefixoModulo + "geraparcelas: "
    var hoje = null
    var vencimentoReal = null;
    var resposta = null;
    var conexao = null;
    var i = 0;
    var saldo = 0;
    var entrada = 0;
    var nrParcela = 0;
    var valorCheio = 0;
    var valorSobra = 0;
    var numParcelas = 0;
    var percEntrada = 0;
    var dias1aParcela = 0;    
    
    try{
        if(valor != 0){
            query += "select id,nr_numeroparcelas,nr_diavencimento,nm_carencia,nr_intervaloparcelas,vl_percentualentrada,id_mantervencimento,sn_messeguinte,sn_valorfixo from parcelamento";
            query += " where id_empresa = @idempresa and id = @idparcelamento";

            conexao = new sql.ConnectionPool(config,function (err) {
                if (err){
                    resposta = {
                        status: -2,
                        prefixo: prefixoFuncao,
                        mensagem: ["" + err],
                        parcelas: []
                    }
                    conexao.close();
                    callbackf(resposta);
                }
                else{
                    var request = conexao.request();
                    request.input("idempresa",idEmpresa);
                    request.input("idparcelamento",idParcelamento);
                    request.query(query, function (err, recordset) {
                        if (err){
                            resposta = {
                                status: -3,
                                prefixo: prefixoFuncao,
                                mensagem: ["" + err],
                                parcelas: []
                            }
                            conexao.close();
                            callbackf(resposta);
                        }
                        else{
                            try{
                                if(recordset.recordsets.length > 0){
                                    var element = recordset.recordsets[0][0];

                                    hoje = new Date();

                                    numParcelas = (element.nr_numeroparcelas == null || element.nr_numeroparcelas == 0) ? 1 : element.nr_numeroparcelas;

                                    if(dataInicial == null)
                                        dataInicial = new Date();
                                
                                    if (element.nr_diavencimento != null && element.nr_diavencimento != 0){
                                        dataInicial.setDate(element.nr_diavencimento);
                                        if (element.nr_diavencimento > hoje.getDate())
                                            dataInicial.setMonth(dataInicial.getMonth() + 1);
                                        else
                                            dataInicial = element.sn_messeguinte != null || !element.sn_messeguinte ? dataInicial : dataInicial.setMonth(dataInicial.getMonth() + 1);
                                    }
                                    else{
                                        dias1aParcela = parseInt(element.nm_carencia)
                                        if (dias1aParcela > 0)
                                            dataInicial.setDate(dataInicial.getDate() + dias1aParcela);
                                        else
                                            dataInicial.setDate(dataInicial.getDate() + element.nr_intervaloparcelas);
                                    }

                                    percEntrada = parseFloat(element.vl_percentualentrada);
                                
                                    if (percEntrada >= 100){
                                        entrada = valor;
                                        saldo = 0;
                                        numParcelas = 1;
                                        valorCheio = 0;
                                        valorSobra = 0;
                                    }
                                    else{
                                        entrada = Math.round(valor * (element.vl_percentualentrada / 100), 2);
                                        if (entrada > 0)
                                            numParcelas--;
                                        saldo = valor - entrada;
                                        if(element.sn_valorfixo != null && element.sn_valorfixo == 1){
                                            valorCheio = saldo;
                                            valorSobra = 0;
                                        }
                                        else{
                                            valorCheio = truncateDecimal(saldo / numParcelas, 2);
                                            valorSobra = saldo - (valorCheio * numParcelas);
                                        }
                                    }

                                    if (element.id_mantervencimento == "96C915A3-0BBD-424D-8759-5C07FCE2531B")           //dia útil anterior ao vencimento
                                        vencimentoReal = diaUtil(dataInicial,true);
                                    else{
                                        if (element.id_mantervencimento == "E4AB5D8B-7589-4AF5-BBD9-2959BED09762")          //dia útil posterior
                                            vencimentoReal = diaUtil(dataInicial,false);
                                        else                                            
                                            vencimentoReal = dataInicial;
                                    }

                                    if (entrada > 0){
                                        nrParcela = 1;
                                        parcela = {
                                            parcela: 1,
                                            valor: entrada,
                                            saldo: entrada,
                                            emissao: new Date(),
                                            vencimento: new Date(dataInicial),
                                            vencimentoReal: new Date(vencimentoReal)
                                        }
                                        parcelas.push(parcela);

                                        if (element.nr_diavencimento != null && element.nr_diavencimento != 0)
                                            dataInicial.setMonth(dataInicial.getMonth() + 1);
                                        else
                                            dataInicial.setDate(dataInicial.getDate() + element.nr_intervaloparcelas)
                                    }
                                
                                    for (i = 0; i < numParcelas; i++){
                                        if (i == numParcelas - 1)
                                            valorCheio += valorSobra;

                                        nrParcela++;
                                     
                                        if (element.id_mantervencimento == "96C915A3-0BBD-424D-8759-5C07FCE2531B")           //dia útil anterior ao vencimento
                                           vencimentoReal = diaUtil(dataInicial,true);
                                        else{
                                            if (element.id_mantervencimento == "E4AB5D8B-7589-4AF5-BBD9-2959BED09762")          //dia útil posterior
                                                vencimentoReal = diaUtil(dataInicial,false);
                                            else                                            
                                                vencimentoReal = dataInicial;
                                        }

                                        parcelas.push({
                                            parcela: nrParcela,
                                            valor: valorCheio,
                                            saldo: valorCheio,
                                            emissao: new Date(),
                                            vencimento: new Date(dataInicial),
                                            vencimentoReal: new Date(vencimentoReal)
                                        });
                                        
                                        if (element.nr_diavencimento != null && element.nr_diavencimento != 0)
                                            dataInicial.setMonth(dataInicial.getMonth() + 1);
                                        else
                                            dataInicial.setDate(dataInicial.getDate() + element.nr_intervaloparcelas)
                                    }
                                    resposta = {
                                        status: 1,
                                        prefixo: prefixoFuncao,
                                        mensagem: ["ok"],
                                        parcelas: parcelas
                                    }
                                    conexao.close();
                                    callbackf(resposta);
                                }
                                else{
                                    resposta = {
                                        status: 0,
                                        prefixo: prefixoFuncao,
                                        mensagem: ["Não foram encontradas os dados referentes ao parcelamento."],
                                        parcelas: [],
                                    }
                                    conexao.close();
                                    callbackf(resposta);
                                    
                                }
                            }
                            catch(err){
                                resposta = {
                                    status: -4,
                                    prefixo: prefixoFuncao,
                                    mensagem: ["" + err],
                                    parcelas: [],
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
            resposta = {
                status: 0,
                prefixo: prefixoFuncao,
                mensagem: ["valor inválido."],
                parcelas: []
            }
            callbackf(resposta);
        }
    }
    catch(erro){
        resposta = {
            status: -1,
            prefixo: prefixoFuncao,
            mensagem: ["" + erro],
            parcelas: [],
        }
        conexao.close();
        callbackf(resposta);
    }
}

function truncateDecimal(value,precision){
    var step = Math.pow(10, precision);
    var tmp = Math.trunc(step * value);
    return(tmp / step);
}

router.route('/gerarContasReceber').post(function(req, res) {     

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    var idMovimentacao = null; //req.param('idMovimentacao'); 
    var EnterpriseID = null; //req.param('EnterpriseID'); 
    var idUsuario = null; //req.param('idUsuario'); 
    var parametros = null;
    var filtros = null;

    var query = "";
    var resposta = {};
    var nrParcela = 0;
    var arrayMovimentacao = null; //idMovimentacao.split(",");
    var j = 0;
    var arrayResposta = [];
    var total = 0;
    var parcela = null;
    var titulo = null;
    var Atitulo = [];
    var movimentacaoFinal = [];
    var arrayEntidade = [];
    var arrayNotaUnica = [];
    
    try{
        parametros = req.body.parametros;
        arrayMovimentacao = parametros.cnpjs;
        EnterpriseID = parametros.idEmpresa;
        idUsuario = parametros.idUsuario;
        filtros = parametros.filtros;

        sql.close();
        sql.connect(config, function (err) {
            var where = "";
            where += "(";
            for (let k = 0; k < arrayMovimentacao.length; k++) {
                if(k == 0){
                    where += "( entidade.nm_cnpj='" + arrayMovimentacao[k] + "' ";

                    if(parametros.filtros.notaunica[k] == "1"){
                        where += " AND cliente_servicos.sn_notaunica = 1 ) ";
                    }else{
                        where += " AND cliente_servicos.sn_notaunica IS NULL ) ";
                    }
                    
                }else{
                    where += " OR (entidade.nm_cnpj='" + arrayMovimentacao[k] + "' ";
                    if(parametros.filtros.notaunica[k] == "1"){
                        where += " AND cliente_servicos.sn_notaunica = 1 ) ";
                    }else{
                        where += " AND cliente_servicos.sn_notaunica IS NULL ) ";
                    }
                }                
            }

            where += ")";

            var faturamento = parametros.filtros.faturamento;
            var boleto = parametros.filtros.boleto;
            var datade = parametros.filtros.datade;
            var dataate = parametros.filtros.dataate;

            if(faturamento == true){
                faturamento = " NOT ";
            }else{
                faturamento = "";
            }

            if(boleto == true){
                boleto = " NOT ";
            }else{
                boleto = "";
            }

            var arrayDataDe = [];
            var arrayDataAte = [];            

            if(datade){
                arrayDataDe = datade.split('/');
                datade = arrayDataDe[1] + "/" + arrayDataDe[0] + "/" + arrayDataDe[2]; 
                where += " AND movimentacao_servicos.dt_emissao >= '" + datade + "'   ";
            }

            if(dataate){
                arrayDataAte = dataate.split('/');
                dataate = arrayDataAte[1] + "/" + arrayDataAte[0] + "/" + arrayDataAte[2]; 
                where += " AND movimentacao_servicos.dt_emissao <= '" + dataate + "' ";
            }
                        
            where += " AND movimentacao_servicos.id_contas_receber  IS  NULL     "; 
            where += " AND movimentacao_servicos.nm_numero_nfes IS " + faturamento + " NULL    ";
            where += " AND movimentacao_servicos.nm_numero_boleto IS " + boleto + " NULL    ";
                       

            query += " SELECT newID() AS 'id',  ";
            query += " movimentacao_servicos.id_entidade AS 'id_entidade',    ";
            query += " entidade.nm_razaosocial AS 'razaosocial',    ";
            query += " SUM(movimentacao_servicos.vl_valor)  AS 'valortotal',  ";
            query += " (SELECT TOP 1 id FROM parcelamento WHERE nr_numeroparcelas=1) AS 'id_parcelamento',  ";
                            
            query += " GETDATE() AS 'dt_emissao',  ";
            query += " IIF((SELECT TOP 1 nm_documento FROM contas_receber ORDER BY nm_documento DESC) IS NULL,0,  ";
            query += " (SELECT TOP 1 nm_documento FROM contas_receber ORDER BY nm_documento DESC)) AS 'nr_pedido', ";
            query += " cliente_servicos.sn_notaunica AS 'notaunica'  ";

            query += " FROM movimentacao_servicos    ";
            query += " INNER JOIN entidade ON entidade.id=movimentacao_servicos.id_entidade  ";
            query += " LEFT JOIN cliente_servicos ON cliente_servicos.id_produtos=movimentacao_servicos.id_subservicos  ";
            query += " AND  cliente_servicos.id_entidade= movimentacao_servicos.id_entidade  ";
            query += " WHERE " + where + " ";
            
            query += " GROUP BY entidade.nm_cnpj, entidade.nm_razaosocial,    ";
            query += " movimentacao_servicos.dt_faturamento,  movimentacao_servicos.nm_numero_nfes,   "; 
            query += " movimentacao_servicos.nm_numero_boleto, movimentacao_servicos.id_entidade, cliente_servicos.sn_notaunica ";
         

            if (err){
                resposta = {
                    status: -2,
                    mensagem: ["" + err],
                    titulo: null
                }
                arrayResposta.push(resposta);
                res.json(arrayResposta);
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
                        arrayResposta.push(resposta);
                        res.json(arrayResposta);
                    }
                    else{
                        var movimentacao = recordset.recordsets[0][0];

                        if(movimentacao){
                            gerarparcelas(config,EnterpriseID,movimentacao.id_parcelamento,movimentacao.valortotal,new Date(movimentacao.dt_emissao),(function(respostaParcelas){
                                
                                try{
                                    if(respostaParcelas.status > 0){
                                        for (let h = 0; h < recordset.recordsets[0].length; h++) {
                                            movimentacao = recordset.recordsets[0][h];
                                            movimentacaoFinal.push(movimentacao.id);
                                            arrayEntidade.push(movimentacao.id_entidade);
                                            arrayNotaUnica.push(movimentacao.notaunica);

                                            total = 0;
                                            parcela = null;
                                            titulo = {
                                                idEmpresa: EnterpriseID,
                                                idUsuario: idUsuario,
                                                idTitulo: movimentacao.id,
                                                idEntidade: movimentacao.id_entidade,
                                                idPedido: movimentacao.id,
                                                //idNotaFiscal: compra.id_notafiscal,
                                                nrTitulo: parseInt(movimentacao.nr_pedido) + (h + 1),
                                                emissao: new Date(movimentacao.dt_emissao).toISOString(),
                                                competencia: "",
                                                valor: movimentacao.valortotal,
                                                idContaFinanceira: "",
                                                idParcelamento: movimentacao.id_parcelamento,
                                                observacao: "",
                                                dre: 0,
                                                idOrigem: "",
                                                parcelas: [],
                                                id_configuracao_cnab: "087D4399-BB68-E2CF-D912-0A54138D0EBC"
                                            };
                                
                                            for(i = 0; i < respostaParcelas.parcelas.length; i++){
                                                nrParcela++;
                                                parcela = {
                                                    idParcela: "",
                                                    documento: parseInt(movimentacao.nr_pedido) + (h + 1),
                                                    parcela: respostaParcelas.parcelas[i].parcela,
                                                    vencimento: new Date(respostaParcelas.parcelas[i].vencimento).toISOString(),
                                                    valor: movimentacao.valortotal,
                                                    idBanco: "",
                                                    idFormaPagamento: movimentacao.id_formapagamento,
                                                    idContaFinanceira: "",
                                                    fluxoCaixa: "1"
                                                };
                                                total += parseFloat(movimentacao.valortotal);
                                                titulo.parcelas.push(parcela);
                                            }                        
                                            
                                            titulo.valor = total;
                                            Atitulo.push(titulo);
                                        }

                                        //if(total > 0){  
                                            
                                            funAtualizarContaReceber(Atitulo,(function(repostacallback){
                                                j += 1;
                                                arrayResposta.push(repostacallback);  
                                                
                                                query = " SELECT movimentacao_servicos.id AS 'id', movimentacao_servicos.id_entidade AS 'id_entidade', cliente_servicos.sn_notaunica AS 'notaunica' ";
                                                query += " FROM movimentacao_servicos   ";
                                                query += " INNER JOIN entidade ON entidade.id=movimentacao_servicos.id_entidade   ";
                                                query += " LEFT JOIN cliente_servicos ON cliente_servicos.id_produtos=movimentacao_servicos.id_subservicos "
                                                query += " WHERE  " + where + "    ";
                                                
                                                sql.close()
                                                sql.connect(config).then(function() {
                                                var request = new sql.Request();
                                                request.query(query, function (err, recordset) {
                                                    if (err){
                                                        resposta = {
                                                            status: -3,
                                                            mensagem: ["" + err],
                                                            titulo: null
                                                        }
                                                        arrayResposta.push(resposta);
                                                        res.json(arrayResposta);
                                                    }else{
                                                            var movdetalhes = recordset.recordsets[0];
                                                            var queryMov = "";
                                                            for(s = 0; s < movimentacaoFinal.length; s++){
                                                                for(x = 0; x < movdetalhes.length; x++){
                                                                    if(arrayEntidade[s] == movdetalhes[x].id_entidade && arrayNotaUnica[s] == movdetalhes[x].notaunica){
                                                                        queryMov += "UPDATE movimentacao_servicos SET id_contas_receber='" + movimentacaoFinal[s] +"' WHERE id='" + movdetalhes[x].id + "'; ";
                                                                    }
                                                                }
                                                                    
                                                            }

                                                            sql.close()
                                                            sql.connect(config).then(function() {
                                                                var request = new sql.Request();
                                                                request.query(queryMov).then(function(recordset) {
                                                                    res.json(arrayResposta); 
                                                                }).catch(function(err) { 
                                                                    console.log(err)                   
                                                                    res.send(false)
                                                                });
                                                            });                                                        
                                                        }
                                                    })
                                                })
                                            }));
                                                                                
                                            
                                        /*}else{
                                            resposta = {
                                                status: 0,
                                                mensagem: ["Não foram geradas parcelas para esta movimentação"],
                                                titulo: null
                                            }
                                            res.json(reposta);
                                        } */                                   
                                    }else{                                    
                                        sql.close();
                                        
                                        arrayResposta.push(respostaParcelas);
                                        res.json(arrayResposta);
                                    }
                                }
                                catch(erro){
                                    resposta.status = -4;
                                    resposta.mensagem = [];
                                    resposta.mensagem.push("criarparcelas: " + erro);
                                    resposta.parcelas = [];
                                    sql.close();
                                    arrayResposta.push(resposta);
                                    res.json(arrayResposta);
                                }
                            }));
                        }else{
                            //res.json(false);
                            res.send(false)
                        }
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
        
        arrayResposta.push(resposta);
        res.json(arrayResposta);
    }

});

function funAtualizarContaReceber(Aparametros,callbackf) {
    var query = "";
    var queryItens = "";
    var parcela = 0;
    var resposta = null;
    var parametros;

    resposta = {
        status: 1,
        mensagem: [],
        titulo: null
    }

    try{
        for (let j = 0; j < Aparametros.length; j++) {
            parametros = Aparametros[j];
            if(!parametros.idEntidade){
                resposta.status = 0;
                resposta.mensagem.push("O cliente não foi informado.");
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
                    if(parametros.parcelas[parcela].valor == "" || parametros.parcelas[parcela].valor == "undefined" || isNaN(parametros.parcelas[parcela].valor)){
                        resposta.status = 0;
                        resposta.mensagem.push("A parcela " + (parcela + 1).toString().trim() + " não possui valor.");
                    }
                }
            }

            if(resposta.status == 1){
                //parametros.idTitulo = general.guid();
                var idtitulo = general.guid();
                query += "insert into contas_receber (id,id_empresa,id_entidade,id_venda,id_notafiscal,id_parcelamento,id_plano_contas_financeiro,nm_documento,dt_emissao,nm_competencia,vl_valor,nm_observacao, id_configuracao_cnab) values("
                query += "'" + idtitulo + "',";
                query += "'" + EnterpriseID + "',";
                query += "'" + parametros.idEntidade + "',";
                query += (!parametros.idPedido ? "null" : "'" + parametros.idPedido + "'") + ",";
                query += (!parametros.idNotaFiscal ? "null" : "'" + parametros.idNotaFiscal + "'") + ",";
                query += "'" + parametros.idParcelamento + "',";
                query += (!parametros.idContaFinanceira ? "null" : "'" + parametros.idContaFinanceira + "'") + ",";
                query += "'" + parametros.nrTitulo + "',";
                query += "'" + parametros.emissao + "',";
                query += "'" + parametros.competencia  + "',";
                query += parametros.valor.toString().trim() + ",";
                query += "'" + parametros.observacao + "', ";
                query += "'" + parametros.id_configuracao_cnab + "' ";
                query += "); ";

                queryItens += "insert into contas_receber_parcelas (id,id_empresa,id_contas_receber,id_Banco,id_forma_pagamento,id_plano_contas_financeiro,nr_parcela,nm_documento,sn_fluxocaixa,dt_data_vencimento,vl_valor, id_configuracao_cnab)";
                queryItens += " values ";
                for(parcela = 0; parcela < parametros.parcelas.length; parcela++){
                    if(parcela > 0)
                        queryItens += ",";
                    
                    parametros.parcelas[parcela].idParcela = parametros.idTitulo; //general.guid();
                    queryItens += "(";
                    queryItens += "'" + parametros.parcelas[parcela].idParcela + "',";
                    queryItens += "'" + EnterpriseID + "',";
                    queryItens += "'" + idtitulo + "',";
                    queryItens += (!parametros.parcelas[parcela].idBanco ? "null" : "'" + parametros.parcelas[parcela].idBanco + "'") + ",";
                    queryItens += (!parametros.parcelas[parcela].idFormaPagamento ? "null" : "'" + parametros.parcelas[parcela].idFormaPagamento + "'") + ",";
                    queryItens += (!parametros.parcelas[parcela].idContaFinanceira ? "null" : "'" + parametros.parcelas[parcela].idContaFinanceira + "'") + ",";
                    queryItens += "'" + parametros.parcelas[parcela].parcela + "',";
                    //queryItens += "'" + parametros.parcelas[parcela].documento + "',";
                    queryItens += "'1',";
                    queryItens +=  parametros.parcelas[parcela].fluxoCaixa + ",";
                    queryItens += "'" + parametros.parcelas[parcela].vencimento + "',";
                    queryItens += parametros.parcelas[parcela].valor.toString().trim() + ",";
                    queryItens += "'" + parametros.id_configuracao_cnab + "' ";

                    queryItens += "); ";
                }
                
            }
            else{
                resposta.titulo == null;
                callbackf(resposta);
            }
        }
            
        sql.close();
        sql.connect(config, function (err) {    
            if (err){
                resposta.status = -2;
                resposta.mensagem = [];
                resposta.mensagem.push("" + err);
                resposta.titulo = null;
                callbackf(resposta);
            }
            else{
                try{
                    var transacao = new sql.Transaction();
                    transacao.begin(err =>{
                        var request = new sql.Request(transacao);
                        request.query(query, function (err, recordset) {
                            if (err){
                                resposta.status = -3;
                                resposta.mensagem = [];
                                resposta.mensagem.push("" + err);
                                resposta.titulo = null;
                                transacao.rollback();
                                callbackf(resposta);
                            }
                            else{
                                if(queryItens != ""){
                                    try{
                                        var request = new sql.Request(transacao);
                                        request.query(queryItens, function (err, recordset) {
                                            if (err){
                                                resposta.status = -4;
                                                resposta.mensagem = [];
                                                resposta.mensagem.push("" + err);
                                                resposta.titulo = null;
                                                transacao.rollback();
                                                callbackf(resposta);
                                            }
                                            else{
                                                resposta.status = 1;
                                                resposta.mensagem = ["ok"];
                                                resposta.titulo =  Aparametros;
                                                transacao.commit();
                                                callbackf(resposta);
                                            }
                                        })                                    
                                    }
                                    catch(err){
                                        resposta.status = -5;
                                        resposta.mensagem = [];
                                        resposta.mensagem.push("" + erro);
                                        resposta.titulo = null;
                                        callbackf(resposta);                                
                                    }
                                }
                                else{
                                    resposta.status = 1;
                                    resposta.mensagem = ["ok"];
                                    resposta.titulo =  Aparametros;
                                    transacao.commit();
                                    callbackf(resposta);
                                }
                            }
                        })
                    })
                }
                catch(err){
                    resposta.status = -6;
                    resposta.mensagem = [];
                    resposta.mensagem.push("" + erro);
                    resposta.titulo = null;
                    callbackf(resposta);                
                }
            }
        });
        
    }catch(erro){
        resposta.status = -1;
        resposta.mensagem = [];
        resposta.mensagem.push("" + erro);
        resposta.titulo = null;
        callbackf(resposta);
    }
}

router.route('/gerarNFSe').post(function(req, res) {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    var parametros = null;
    var filtros = null;

    var query = "";
    var resposta = {};
    var nrParcela = 0;
    var arrayMovimentacao = null; //idMovimentacao.split(",");
    var j = 0;
    var aResposta = [];
    var total = 0;
    var parcela = null;
    var titulo = null;
    var Atitulo = [];
    var movimentacaoFinal = [];
    var arrayEntidade = [];
    var arrayNotaUnica = [];
    
    try {
        parametros = req.body.parametros;
        filtros = parametros.paramArray;
        var idcontasreceber = "";    
        var idcontasreceber2 = "";    
        
        if(filtros){
            console.log(filtros.length)
            if(filtros.length > 0){
                for (let i = 0; i < filtros.length; i++) {
                    if(i == 0){
                        idcontasreceber += " '" + filtros[i] + "'"
                        idcontasreceber2 += " '" + filtros[i] + "'"
                    }else{
                        idcontasreceber += " OR movimentacao_servicos.id_contas_receber='" + filtros[i] + "'"
                        idcontasreceber2 += " OR id='" + filtros[i] + "'"
                    }                    
                }
            }
        }
        
        var deletar = "";
        var  select = "";

        select += "SELECT IIF(entidade.sn_bancoparceiro=1,'', entidade.nm_descricao_nota_fiscal) AS DescricaoNota, empresa.nm_razaosocial AS RazaoSocialPrestador, empresa.sn_pessoafisica AS PessoaFisicaPrestador, empresa.nm_cpf AS CpfPrestador, "; 
        select += "     empresa.nm_rg AS RgPrestador, empresa.nm_cnpj AS CpfCnpjPrestador, empresa.nm_inscricaomunicipal AS InscricaoMunicipalPrestador,  ";
        select += "     empresa.nm_inscricaoestadual AS IePrestador, empresa.nm_ddd AS DDDPrestador, empresa.nm_telefone AS TelefonePrestador, ";
		select += "	 CddPrestador.nm_codigo AS CodigoCidadePrestador, CddPrestador.nm_descricao AS DescricaoCidadePrestador, entidade.nm_razaosocial AS RazaoSocialTomador,  ";
        select += "     entidade.sn_pessoafisica AS PessoaFisicaTomador, entidade.nm_cpf AS CpfTomador, entidade.nm_rg AS RgTomador,  ";
        select += "     entidade.nm_cnpj AS CnpjTomador, entidade.nm_inscricaomunicipal AS InscricaoMunicipalTomador, entidade.nm_inscricaoestadual AS InscricaoEstadualTomador,  ";
        select += "     contato.nm_ddd AS DDDTomador, contato.nm_Telefone AS TelefoneTomador, contato.nm_email AS EmailTomador,  ";
        select += "     dsg_pais.nm_descricao AS PaisTomador, dsg_tipo_logradouro.nm_apelido AS TipoLogradouroTomador, endereco.nm_logradouro AS EnderecoTomador,  ";
        select += "     endereco.nm_numero AS NumeroTomador, endereco.nm_complemento AS ComplementoTomador, endereco.nm_bairro AS BairroTomador,  ";
        select += "     endereco.nm_cep AS CepTomador, dsg_ibge_cidade.nm_codigo AS CodigoCidadeTomador, dsg_ibge_cidade.nm_descricao AS DescricaoCidadeTomador,  ";
        select += "     dsg_ibge_uf.nm_descricao AS UfTomador, dsg_natureza_tributacao.nm_apelido AS NaturezaTributacao, dsg_codigo_tributario_servico.nm_apelido AS RegimeEspecialTributacao,  ";
        select += "     dsg_rps.nm_apelido AS TipoTributacao, dsg_cnae.nm_apelido AS CodigoCnae, contas_receber_parcelas.nm_documento AS NumeroRpsNew,  ";
        select += "     contas_receber_parcelas.nm_numero_rps AS NumeroRpsEnviado, contas_receber_parcelas.nm_numero_nfse AS NumeroNfseSubstituida, contas_receber_parcelas.nm_protocolo_nfse AS ProtocoloNfse, "; 
             
		select += "	 '' AS JustificativaDeducao,  ";
		select += "	 '0.00' As ValorTotalDeducao,  ";
		select += "	 '0.00' AS ValorTotalDesconto,  ";
        select += "     contas_receber_parcelas.vl_valor AS ValorTotalServicos,  ";
		select += "	 '0.00' AS ValorTotalBaseCalculo,  ";
		select += "	 '0.00' AS ValorIss,  ";
        select += "     NULL AS TipoTrib_OLD,  ";
		select += "	 contas_receber.dt_emissao AS DataInicio,  ";
		select += "	 '0.00' AS ValorIssRetido,  ";

        select += "     produtos_detalhes.sn_reteriss AS TemIssRetido, produtos_detalhes.vl_aliquotaiss AS AliquotaISS, produtos_detalhes.nm_codigoservico AS CodigoItemListaServico,  ";
        select += "     produtos.nm_descricao AS DiscriminacaoServico,  ";
        select += "     subservico.nm_descricao AS DiscriminacaoServico2, ";
		select += "	 COUNT(movimentacao_servicos.id_subservicos) AS QuantidadeServicos,  ";
		select += "	 SUM(movimentacao_servicos.vl_valor) AS ValorUnitarioServico,  ";
        select += "     '0.00' AS ValorDesconto,  ";
		select += "	 '0.00' AS ValorPis,  ";
		select += "	 '0.00' AS ValorCofins,  ";
        select += "     '0.00' AS AliquotaPIS,  ";
		select += "	 '0.00' AS AliquotaCOFINS,  ";
		select += "	 movimentacao_servicos.id_subservicos AS IDProdutos_VendaProdutos, "; 

		select += "	 contas_receber_parcelas.nm_serie_rps AS SerieRpsSubstituido , movimentacao_servicos.id_contas_receber ";

        select += " ,(SELECT  TOP 1 status FROM nfse WHERE id=movimentacao_servicos.id_contas_receber) AS status "

        select += "FROM movimentacao_servicos ";
        select += "INNER JOIN contas_receber_parcelas ON contas_receber_parcelas.id=movimentacao_servicos.id_contas_receber ";
        select += "INNER JOIN contas_receber ON contas_receber.id=contas_receber_parcelas.id_contas_receber ";
        select += "INNER JOIN entidade ON entidade.id=movimentacao_servicos.id_entidade ";
        select += "INNER JOIN empresa ON empresa.id='9F39BDCF-6B98-45DE-A819-24B7F3EE2560' ";
        select += "LEFT OUTER JOIN dsg_ibge_cidade AS CddPrestador ON empresa.id_dsg_ibge_cidade = CddPrestador.id  ";
        select += "LEFT OUTER JOIN dsg_cnae ON dsg_cnae.id = empresa.id_dsg_cnae  ";
        select += "LEFT OUTER JOIN dsg_natureza_tributacao ON dsg_natureza_tributacao.id = empresa.id_dsg_natureza_tributacao  ";
        select += "LEFT OUTER JOIN dsg_codigo_tributario_servico ON empresa.id_dsg_codigo_tributario_servico = dsg_codigo_tributario_servico.id  ";

        select += "LEFT JOIN produtos ON movimentacao_servicos.id_produtos = produtos.id  ";
        select += "LEFT JOIN subservico ON movimentacao_servicos.id_subservicos = subservico.id ";
        select += "LEFT JOIN produtos_detalhes ON produtos.id = produtos_detalhes.id_produtos  ";
        select += "LEFT OUTER JOIN dsg_rps ON '70350CC4-B12F-47D7-88F1-7532A1C20F31' = dsg_rps.id  ";

        select += "LEFT OUTER JOIN contato ON contato.id_entidade = entidade.id  ";
        select += "LEFT OUTER JOIN endereco ON endereco.id_entidade = entidade.id  ";
        select += "LEFT OUTER JOIN dsg_ibge_uf ON endereco.id_dsg_ibge_uf = dsg_ibge_uf.id  ";
        select += "LEFT OUTER JOIN dsg_pais ON dsg_pais.id = endereco.id_dsg_pais  ";
        select += "LEFT OUTER JOIN dsg_ibge_cidade ON endereco.id_dsg_ibge_cidade = dsg_ibge_cidade.id  ";
        select += "LEFT OUTER JOIN dsg_tipo_logradouro ON endereco.id_dsg_tipo_logradouro = dsg_tipo_logradouro.id  ";
        
        select += "WHERE movimentacao_servicos.id_contas_receber=" + idcontasreceber + " ";

        select += "AND nm_numero_nfes IS NULL ";
        select += "GROUP BY entidade.sn_bancoparceiro, entidade.nm_descricao_nota_fiscal, ";
        select += "empresa.nm_razaosocial, empresa.sn_pessoafisica, empresa.nm_cpf, "; 
        select += "empresa.nm_rg, empresa.nm_cnpj, empresa.nm_inscricaomunicipal,  ";
        select += "empresa.nm_inscricaoestadual, empresa.nm_ddd, empresa.nm_telefone, ";
        select += "CddPrestador.nm_codigo, CddPrestador.nm_descricao, entidade.nm_razaosocial,  ";
        select += "entidade.sn_pessoafisica, entidade.nm_cpf, entidade.nm_rg,  ";
        select += "entidade.nm_cnpj, entidade.nm_inscricaomunicipal, entidade.nm_inscricaoestadual,  ";
        select += "contato.nm_ddd, contato.nm_Telefone, contato.nm_email,  ";
        select += "dsg_pais.nm_descricao,  ";
        select += "dsg_tipo_logradouro.nm_apelido, endereco.nm_logradouro,  ";
        select += "endereco.nm_numero,  ";
        select += "endereco.nm_complemento,  ";
        select += "endereco.nm_bairro,  ";
        select += "endereco.nm_cep,  ";
        select += "dsg_ibge_cidade.nm_codigo,  ";
        select += "dsg_ibge_cidade.nm_descricao,  ";
        select += "dsg_ibge_uf.nm_descricao,  ";
        select += "dsg_natureza_tributacao.nm_apelido,  ";
        select += "dsg_codigo_tributario_servico.nm_apelido,  ";
        select += "dsg_rps.nm_apelido,  ";
        select += "dsg_cnae.nm_apelido,  ";
        select += "contas_receber_parcelas.nm_documento,  ";
        select += "contas_receber_parcelas.nm_numero_rps,  ";
        select += "contas_receber_parcelas.nm_numero_nfse, ";
        select += "contas_receber_parcelas.nm_protocolo_nfse,  ";
             
        select += "contas_receber_parcelas.vl_valor,  ";
        select += "contas_receber.dt_emissao,  ";

        select += "produtos_detalhes.sn_reteriss,  ";
        select += "produtos_detalhes.vl_aliquotaiss,  ";
        select += "produtos_detalhes.nm_codigoservico,  ";
        select += "produtos.nm_descricao, ";
        select += "movimentacao_servicos.id_subservicos, ";
        select += "contas_receber_parcelas.nm_serie_rps,  ";
        select += "subservico.nm_descricao, movimentacao_servicos.id_contas_receber ";
        console.log(select)
        sql.close(); 
        sql.connect(config, function (err) { 
            if (err) console.log(err); 
            var request = new sql.Request(); 
            request.query(select, function (err, recordset){ 
                if (err) console.log(err);
                      
                try{
                    var transacao = new sql.Transaction();
                    transacao.begin(err =>{
                        for (let h = 0; h < recordset.recordsets[0].length; h++) {
                            var movimentacao = recordset.recordsets[0][h];

                            var id = movimentacao.id_contas_receber
                            var RazaoSocialPrestador = movimentacao.RazaoSocialPrestador
                            RazaoSocialPrestador = (!RazaoSocialPrestador) ? "" : RazaoSocialPrestador;
                            
                            var PessoaFisicaPrestador = movimentacao.PessoaFisicaPrestador
                            PessoaFisicaPrestador = (!PessoaFisicaPrestador) ? "" : PessoaFisicaPrestador;
                            
                            var CpfPrestador = movimentacao.CpfPrestador
                            CpfPrestador = (!CpfPrestador) ? "" : CpfPrestador;
                            
                            var RgPrestador = movimentacao.RgPrestador
                            RgPrestador = (!RgPrestador) ? "" : RgPrestador;
                            
                            var CpfCnpjPrestador = movimentacao.CpfCnpjPrestador
                            CpfCnpjPrestador = (!CpfCnpjPrestador) ? "" : CpfCnpjPrestador;
                            
                            var InscricaoMunicipalPrestador	= movimentacao.InscricaoMunicipalPrestador
                            InscricaoMunicipalPrestador = (!InscricaoMunicipalPrestador) ? "" : InscricaoMunicipalPrestador;
                            
                            var IePrestador = movimentacao.IePrestador
                            IePrestador = (!IePrestador) ? "" : IePrestador;
                            
                            var DDDPrestador = movimentacao.DDDPrestador
                            DDDPrestador = (!DDDPrestador) ? "" : DDDPrestador;
                            
                            var TelefonePrestador = movimentacao.TelefonePrestador
                            TelefonePrestador = (!TelefonePrestador) ? "" : TelefonePrestador;
                            
                            var CodigoCidadePrestador = movimentacao.CodigoCidadePrestador
                            CodigoCidadePrestador = (!CodigoCidadePrestador) ? "" : CodigoCidadePrestador;
                            
                            var DescricaoCidadePrestador = movimentacao.DescricaoCidadePrestador
                            DescricaoCidadePrestador = (!DescricaoCidadePrestador) ? "" : DescricaoCidadePrestador;
                            
                            var RazaoSocialTomador = movimentacao.RazaoSocialTomador
                            RazaoSocialTomador = (!RazaoSocialTomador) ? "" : RazaoSocialTomador;
                            
                            var PessoaFisicaTomador = movimentacao.PessoaFisicaTomador
                            PessoaFisicaTomador = (!PessoaFisicaTomador) ? "" : PessoaFisicaTomador;
                            
                            var CpfTomador = movimentacao.CpfTomador
                            CpfTomador = (!CpfTomador) ? "" : CpfTomador;
                            
                            var RgTomador = movimentacao.RgTomador
                            RgTomador = (!RgTomador) ? "" : RgTomador;
                            
                            var CnpjTomador = movimentacao.CnpjTomador
                            CnpjTomador = (!CnpjTomador) ? "" : CnpjTomador;
                            
                            var InscricaoMunicipalTomador = movimentacao.InscricaoMunicipalTomador
                            InscricaoMunicipalTomador = (!InscricaoMunicipalTomador) ? "" : InscricaoMunicipalTomador;
                            
                            var InscricaoEstadualTomador = movimentacao.InscricaoEstadualTomador
                            InscricaoEstadualTomador = (!InscricaoEstadualTomador) ? "" : InscricaoEstadualTomador;
                            
                            var DDDTomador = movimentacao.DDDTomador
                            DDDTomador = (!DDDTomador) ? "" : DDDTomador;
                            
                            var TelefoneTomador = movimentacao.TelefoneTomador
                            TelefoneTomador = (!TelefoneTomador) ? "" : TelefoneTomador;
                            
                            var EmailTomador = movimentacao.EmailTomador
                            EmailTomador = (!EmailTomador) ? "" : EmailTomador;
                            
                            var PaisTomador = movimentacao.PaisTomador
                            PaisTomador = (!PaisTomador) ? "" : PaisTomador;
                            
                            var TipoLogradouroTomador = movimentacao.TipoLogradouroTomador
                            TipoLogradouroTomador = (!TipoLogradouroTomador) ? "" : TipoLogradouroTomador;
                            
                            var EnderecoTomador = movimentacao.EnderecoTomador
                            EnderecoTomador = (!EnderecoTomador) ? "" : EnderecoTomador;
                            
                            var NumeroTomador = movimentacao.NumeroTomador
                            NumeroTomador = (!NumeroTomador) ? "" : NumeroTomador;
                            
                            var ComplementoTomador = movimentacao.ComplementoTomador
                            ComplementoTomador = (!ComplementoTomador) ? "" : ComplementoTomador;
                            
                            var BairroTomador = movimentacao.BairroTomador
                            BairroTomador = (!BairroTomador) ? "" : BairroTomador;
                            
                            var CepTomador = movimentacao.CepTomador
                            CepTomador = (!CepTomador) ? "" : CepTomador.replace("-","");
                            
                            var CodigoCidadeTomador = movimentacao.CodigoCidadeTomador
                            CodigoCidadeTomador = (!CodigoCidadeTomador) ? "" : CodigoCidadeTomador;
                            
                            var DescricaoCidadeTomador = movimentacao.DescricaoCidadeTomador
                            DescricaoCidadeTomador = (!DescricaoCidadeTomador) ? "" : DescricaoCidadeTomador;
                            
                            var UfTomador = movimentacao.UfTomador
                            UfTomador = (!UfTomador) ? "" : UfTomador;
                            
                            var NaturezaTributacao = movimentacao.NaturezaTributacao
                            NaturezaTributacao = (!NaturezaTributacao) ? "" : NaturezaTributacao;
                            
                            var RegimeEspecialTributacao = movimentacao.RegimeEspecialTributacao
                            RegimeEspecialTributacao = (!RegimeEspecialTributacao) ? "" : RegimeEspecialTributacao;
                            
                            var TipoTributacao = movimentacao.TipoTributacao
                            TipoTributacao = (!TipoTributacao) ? "" : TipoTributacao;
                            
                            var CodigoCnae = movimentacao.CodigoCnae
                            CodigoCnae = (!CodigoCnae) ? "" : CodigoCnae;
                            
                            var NumeroRpsNew = movimentacao.NumeroRpsNew
                            NumeroRpsNew = (!NumeroRpsNew) ? "" : NumeroRpsNew;
                            
                            var NumeroRpsEnviado = movimentacao.NumeroRpsEnviado
                            NumeroRpsEnviado = (!NumeroRpsEnviado) ? "" : NumeroRpsEnviado;
                            
                            var NumeroNfseSubstituida = movimentacao.NumeroNfseSubstituida
                            NumeroNfseSubstituida = (!NumeroNfseSubstituida) ? "" : NumeroNfseSubstituida;
                            
                            var ProtocoloNfse = movimentacao.ProtocoloNfse
                            ProtocoloNfse = (!ProtocoloNfse) ? "" : ProtocoloNfse;
                            
                            var JustificativaDeducao = movimentacao.JustificativaDeducao
                            JustificativaDeducao = (!JustificativaDeducao) ? "" : JustificativaDeducao;
                            
                            var ValorTotalDeducao = movimentacao.ValorTotalDeducao
                            ValorTotalDeducao = (!ValorTotalDeducao) ? "0.00" : ValorTotalDeducao;
                            
                            if(ValorTotalDeducao.toString().indexOf(',') == -1 && ValorTotalDeducao.toString().indexOf('.') == -1){
                                ValorTotalDeducao = ValorTotalDeducao + ".00";
                            }

                            var ValorTotalDesconto = movimentacao.ValorTotalDesconto
                            ValorTotalDesconto = (!ValorTotalDesconto) ? "0.00" : ValorTotalDesconto;
                            
                            if(ValorTotalDesconto.toString().indexOf(',') == -1 && ValorTotalDesconto.toString().indexOf('.') == -1){
                                ValorTotalDesconto = ValorTotalDesconto + ".00";
                            }

                            var ValorTotalServicos = movimentacao.ValorTotalServicos
                            ValorTotalServicos = (!ValorTotalServicos) ? "0.00" : ValorTotalServicos;
                            
                            if(ValorTotalServicos.toString().toString().indexOf(',') == -1 && ValorTotalServicos.toString().indexOf('.') == -1){
                                ValorTotalServicos = ValorTotalServicos + ".00";
                            }

                            var ValorTotalBaseCalculo = movimentacao.ValorTotalBaseCalculo
                            ValorTotalBaseCalculo = (!ValorTotalBaseCalculo) ? "0.00" : ValorTotalBaseCalculo;
                            
                            var ValorIss = movimentacao.ValorIss
                            ValorIss = (!ValorIss) ? "0.00" : ValorIss;
                            
                            if(ValorIss.toString().indexOf(',') == -1 && ValorIss.toString().indexOf('.') == -1){
                                ValorIss = ValorIss + ".00";
                            }

                            var TipoTrib_OLD = movimentacao.TipoTrib_OLD
                            TipoTrib_OLD = (!TipoTrib_OLD) ? "" : TipoTrib_OLD;
                            
                            var DataInicio = movimentacao.DataInicio
                            DataInicio = (!DataInicio) ? "" : DataInicio;
                            
                            var ValorIssRetido = movimentacao.ValorIssRetido
                            ValorIssRetido = (!ValorIssRetido) ? "0.00" : ValorIssRetido;
                            
                            if(ValorIssRetido.toString().indexOf(',') == -1 && ValorIssRetido.toString().indexOf('.') == -1){
                                ValorIssRetido = ValorIssRetido + ".00";
                            }

                            var TemIssRetido = movimentacao.TemIssRetido
                            TemIssRetido = (!TemIssRetido) ? "" : TemIssRetido;
                            
                            var AliquotaISS = movimentacao.AliquotaISS
                            AliquotaISS = (!AliquotaISS) ? "" : AliquotaISS;
                            
                            if(AliquotaISS.toString().indexOf(',') == -1 && AliquotaISS.toString().indexOf('.') == -1){
                                AliquotaISS = AliquotaISS + ".00";
                            }

                            var CodigoItemListaServico = movimentacao.CodigoItemListaServico
                            CodigoItemListaServico = (!CodigoItemListaServico) ? "" : CodigoItemListaServico;
                            
                            var DiscriminacaoServico = movimentacao.DiscriminacaoServico
                            DiscriminacaoServico = (!DiscriminacaoServico) ? "" : DiscriminacaoServico;
                            
                            var DiscriminacaoServicoSub = movimentacao.DiscriminacaoServico2

                            if(!DiscriminacaoServicoSub){
                                DiscriminacaoServicoSub = DiscriminacaoServico;
                            }

                            var QuantidadeServicos = movimentacao.QuantidadeServicos
                            QuantidadeServicos = (!QuantidadeServicos) ? "0.00" : QuantidadeServicos;

                            if(QuantidadeServicos.toString().indexOf(',') == -1 && QuantidadeServicos.toString().indexOf('.') == -1){
                                QuantidadeServicos = QuantidadeServicos + ".00";
                            }

                            var ValorUnitarioServico = movimentacao.ValorUnitarioServico
                            ValorUnitarioServico = (!ValorUnitarioServico) ? "0.00" : ValorUnitarioServico;

                            if(ValorUnitarioServico.toString().indexOf(',') == -1 && ValorUnitarioServico.toString().indexOf('.') == -1){
                                ValorUnitarioServico = ValorUnitarioServico + ".00";
                            }

                            var ValorDesconto = movimentacao.ValorDesconto
                            ValorDesconto = (!ValorDesconto) ? "0.00" : ValorDesconto;

                            if(ValorDesconto.toString().indexOf(',') == -1 && ValorDesconto.toString().indexOf('.') == -1){
                                ValorDesconto = ValorDesconto + ".00";
                            }

                            var ValorPis = movimentacao.ValorPis
                            ValorPis = (!ValorPis) ? "0.00" : ValorPis;

                            if(ValorPis.toString().indexOf(',') == -1 && ValorPis.toString().indexOf('.') == -1){
                                ValorPis = ValorPis + ".00";
                            }

                            var ValorCofins = movimentacao.ValorCofins
                            ValorCofins = (!ValorCofins) ? "0.00" : ValorCofins;

                            var AliquotaPIS = movimentacao.AliquotaPIS
                            AliquotaPIS = (!AliquotaPIS) ? "0.00" : AliquotaPIS;

                            var AliquotaCOFINS = movimentacao.AliquotaCOFINS
                            AliquotaCOFINS = (!AliquotaCOFINS) ? "0.00" : AliquotaCOFINS;

                            var IDProdutos_VendaProdutos = movimentacao.IDProdutos_VendaProdutos
                            IDProdutos_VendaProdutos = (!IDProdutos_VendaProdutos) ? "" : IDProdutos_VendaProdutos;

                            var SerieRpsSubstituido = movimentacao.SerieRpsSubstituido
                            SerieRpsSubstituido = (!SerieRpsSubstituido) ? "" : SerieRpsSubstituido;

                            var status = movimentacao.status
                            status = (!status) ? "" : status;
                            
                            var DescricaoNota = movimentacao.DescricaoNota
                            DescricaoNota = (!DescricaoNota) ? "" : DescricaoNota;


                            var d = new Date();
                            var da = d.getUTCDate().toString();
                            var m = (d.getMonth() + 1).toString();
                            var y = d.getFullYear().toString();
                            
                            if(da.length == 1){
                                da = "0" + da;
                            }
                            
                            if(m.length == 1){
                                m = "0" + m;
                            }
                            
                            
                            var dataemissao = da + "/" + m + "/" + y;

                            if(status == "Pendente" || !status){

                                deletar += " DELETE FROM nfse WHERE id='" + id + "' AND status='Pendente';  ";

                                query += " INSERT INTO nfse (id, RazaoSocialPrestador, PessoaFisicaPrestador, CpfPrestador, ";
                                query += " RgPrestador, CpfCnpjPrestador, InscricaoMunicipalPrestador, IePrestador, ";
                                query += "DDDPrestador, TelefonePrestador, CodigoCidadePrestador, DescricaoCidadePrestador, ";
                                query += "RazaoSocialTomador, PessoaFisicaTomador, CpfTomador, RgTomador, CnpjTomador, ";
                                query += "InscricaoMunicipalTomador, InscricaoEstadualTomador, DDDTomador, TelefoneTomador, ";
                                query += " EmailTomador, PaisTomador, TipoLogradouroTomador, EnderecoTomador, NumeroTomador, ";
                                query += " ComplementoTomador, BairroTomador, CepTomador, CodigoCidadeTomador, ";
                                query += " DescricaoCidadeTomador, UfTomador, NaturezaTributacao, RegimeEspecialTributacao, ";
                                query += " TipoTributacao, CodigoCnae, NumeroRpsNew, NumeroRpsEnviado, NumeroNfseSubstituida, ";
                                query += " ProtocoloNfse, JustificativaDeducao, ValorTotalDeducao, ValorTotalDesconto, ";
                                query += " ValorTotalServicos, ValorTotalBaseCalculo, ValorIss, TipoTrib_OLD, ";
                                query += " DataInicio, ValorIssRetido, TemIssRetido, AliquotaISS, CodigoItemListaServico, ";
                                query += " DiscriminacaoServico, QuantidadeServicos, ValorUnitarioServico, ";
                                query += " ValorDesconto, ValorPis, ValorCofins, AliquotaPIS, AliquotaCOFINS, ";
                                query += " IDProdutos_VendaProdutos, SerieRpsSubstituido, status, dataemissao, DescricaoNota) ";
    
                                query += " VALUES( '" + id + "', '";
                                query += RazaoSocialPrestador + "', '" + PessoaFisicaPrestador + "', '" + CpfPrestador + "', '";
                                query += RgPrestador + "', '" + CpfCnpjPrestador + "', '" + InscricaoMunicipalPrestador + "', '";
                                query += IePrestador + "', '" + DDDPrestador + "', '" + TelefonePrestador + "', '";
                                query += CodigoCidadePrestador + "', '" + DescricaoCidadePrestador + "', '";
                                query += RazaoSocialTomador + "', '" + PessoaFisicaTomador + "', '" + CpfTomador;
                                query += "', '" + RgTomador + "', '" + CnpjTomador + "', '" + InscricaoMunicipalTomador;
                                query +=  "', '" + InscricaoEstadualTomador + "', '" + DDDTomador + "', '" + TelefoneTomador;
                                query +=  "', '" + EmailTomador + "', '" + PaisTomador + "', '" + TipoLogradouroTomador;
                                query +=  "', '" + EnderecoTomador + "', '" + NumeroTomador + "', '" + ComplementoTomador;
                                query +=  "', '" + BairroTomador + "', '" + CepTomador + "', '" + CodigoCidadeTomador;
                                query +=  "', '" + DescricaoCidadeTomador + "', '" + UfTomador + "', '";
                                query +=  NaturezaTributacao + "', '" + RegimeEspecialTributacao + "', '" + TipoTributacao;
                                query +=  "', '" + CodigoCnae + "', '" + NumeroRpsNew + "', '" + NumeroRpsEnviado;
                                query +=  "', '" + NumeroNfseSubstituida + "', '" + ProtocoloNfse + "', '";
                                query +=  JustificativaDeducao + "', '" + ValorTotalDeducao + "', '" + ValorTotalDesconto;
                                query +=  "', '" + ValorTotalServicos + "', '" + ValorTotalBaseCalculo;
                                query +=  "', '" + ValorIss + "', '" + TipoTrib_OLD + "', '" + DataInicio;
                                query +=  "', '" + ValorIssRetido + "', '" + TemIssRetido + "', '" + AliquotaISS;
                                query +=  "', '" + CodigoItemListaServico + "', '" + DiscriminacaoServicoSub;
                                query +=  "', '" + QuantidadeServicos;
                                query +=  "', '" + ValorUnitarioServico + "', '" + ValorDesconto + "', '" + ValorPis;
                                query +=  "', '" + ValorCofins + "', '" + AliquotaPIS + "', '" + AliquotaCOFINS;
                                query +=  "', '" + IDProdutos_VendaProdutos + "', '" + SerieRpsSubstituido + "', 'Pendente', '" + dataemissao + "', '" + DescricaoNota + "'); ";
                                
                            }else{
                                resposta.status = -4;
                                resposta.mensagem = [];
                                resposta.mensagem.push("Uma ou mais notas já foram enviadas para a prefeitura");
                                resposta.titulo = null;
                                aResposta.push(resposta);
                            }

                        }

                        if(aResposta){
                            if(aResposta.length > 0){
                                res.send(aResposta); 
                            }
                        }

                        query = deletar + query;

                        if(query){
                            
                            var request = new sql.Request(transacao);
                            request.query(query, function (err, recordset) {
                                if (err){
                                    resposta.status = -4;
                                    resposta.mensagem = [];
                                    resposta.mensagem.push("" + err);
                                    resposta.titulo = null;
                                    transacao.rollback();
                                    aResposta.push(resposta);
                                    res.send(aResposta);     
                                }
                                else{
                                    resposta.status = 1;
                                    resposta.mensagem = ["ok"];
                                    resposta.titulo =  "Nota(s) gerada(s) e aguardando envio para a prefeitura";
                                    transacao.commit();
                                    aResposta.push(resposta);
                                    res.send(aResposta);         
                                }
                            }) 
                        }  
                    })                                  
                }
                catch(err){
                    resposta.status = -5;
                    resposta.mensagem = [];
                    resposta.mensagem.push("" + err);
                    resposta.titulo = null;
                    aResposta.push(resposta);
                    res.send(aResposta);                                 
                }

                                        //res.send(recordset); 
            }); 
        }); 
    } catch (error) {
        
    }
    
});

router.route('/carregarNFSe').get(function(req, res) {
    
    var  select = "";
    select += " SELECT cast('false' as bit)  AS 'Marcar', id AS 'id', dataemissao AS 'data',RazaoSocialTomador AS 'razaosocial',  ";
    select += " CnpjTomador AS 'cnpj', ValorTotalServicos AS 'valor',  ";
    select += " status AS 'status' ";
    select += " FROM nfse ";
    select += " WHERE status = 'Pendente' ";
    select += " GROUP BY  id,dataemissao, RazaoSocialTomador, CnpjTomador, ValorTotalServicos, status ";

    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(select, function (err, recordset){ 
            if (err) console.log(err);

            var retorno = recordset;
            if(retorno){
                if(retorno.recordset){
                    retorno = retorno.recordset;
                }
            }
            res.send(retorno); 
        }); 
    }); 
});

router.route('/enviarNFSe').post(function(req, res) {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    var retorno = false;
    var update = "";
    var parametros = req.body;
    var EnterpriseID = "9F39BDCF-6B98-45DE-A819-24B7F3EE2560";
    var urlWindows = "";


        for (let index = 0; index < parametros.length; index++) {
            const element = parametros[index];
            update += "UPDATE nfse SET status='Enviado' WHERE id='" + element + "'; ";
        }
    
        if(!update){
            res.send("");
        }
    
        sql.close(); 
        sql.connect(config, function (err) { 
            if (err) console.log(err); 
       
            try{
                var transacao = new sql.Transaction();
                transacao.begin(err =>{
                    if(update){                        
                        var request = new sql.Request(transacao);
                        request.query(update, function (err, recordset) {
                            if (err){
                                res.send(err);     
                            }
                            else{
                                res.send("Nota(s) enviada(s) com sucesso");         
                            }
                        }) 
                    }  
                })                                  
            }
            catch(err){
                res.send(err);                                 
            }
        });   

})

router.route('/getInfoNFSe').post(function(req, res) {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    var retorno = false;
    var update = "";
    var parametros = req.body;

    var enterpriseID = parametros.enterpriseID;
    
    var select = " SELECT empresa.nm_razaosocial AS 'NomeFantasiaPrestador', empresa.nm_nomefantasia AS 'RazaoSocialPrestador',  ";
    select += " empresa.nm_logradouro AS 'EnderecoPrestador', dsg_ibge_uf.nm_descricao AS 'UfPrestador',  ";
    select += " dsg_ibge_cidade.nm_codigo AS 'CodigoMunicipioPrestador','' AS 'BairroPrestador', '' AS 'CepPrestador', '' AS 'TelefonePrestador', ";
    select += " '' AS 'EmailPrestador', dsg_ibge_cidade.nm_descricao AS 'CidadePrestador',  ";
    select += " empresa.nm_inscricaomunicipal AS 'IncricaoMunicipalPrestador',  ";
    select += " empresa.nm_cnpj AS 'CpfCnpjPrestador' ";
    select += " FROM empresa  ";
    select += " LEFT OUTER JOIN dsg_ibge_cidade ON empresa.id_dsg_ibge_cidade = dsg_ibge_cidade.id  ";
    select += " LEFT OUTER JOIN dsg_ibge_uf ON empresa.id_dsg_ibge_uf = dsg_ibge_uf.id  ";
    select += " WHERE empresa.id = '" + enterpriseID + "'; ";

    select += "SELECT TOP 1 nm_certificado AS 'certificadoDigital', nm_senhacertificadodigital AS 'senhaCertificado',  ";
    select += " sn_ambienteproducao AS 'ambienteGeracaoNFse', id_dsg_tipo_certificado AS 'idTipoCertificado', ";
    select += " nm_serie AS 'serie', nr_numerolote AS 'numeroLote', sn_enviaremail AS 'enviarEmail',  ";
    select += " nm_assuntoemailnfe AS 'assuntoEmailNFe', nm_texto_email AS 'textoEmail', nm_emailcopia AS 'emailCopia', ";
    select += " '' AS 'logoTipo' FROM configuracao_nfe_servico ";
    select += "WHERE id_empresa = '" + enterpriseID + "'; ";


    select += "SELECT nm_email_remetente, nm_porta, nm_senha_email, nm_servidor_smtp, sn_requer_autenticacao, nm_usuario_email ";
    select += " FROM configuracao_email configuracaoemail";
    select += " WHERE id_empresa='" + enterpriseID + "'; ";




    select += "SELECT id, RazaoSocialPrestador, PessoaFisicaPrestador, CpfPrestador, ";
    select += " RgPrestador, CpfCnpjPrestador, InscricaoMunicipalPrestador, ";
    select += " IePrestador, DDDPrestador, TelefonePrestador, ";
    select += " CodigoCidadePrestador, DescricaoCidadePrestador AS DescricaoCidadePrestacao, RazaoSocialTomador, ";
    select += " PessoaFisicaTomador, CpfTomador, RgTomador, ";
    select += " CnpjTomador AS CpfCnpjTomador, InscricaoMunicipalTomador, InscricaoEstadualTomador, ";
    select += " DDDTomador, TelefoneTomador, EmailTomador, ";
    select += " PaisTomador, TipoLogradouroTomador, EnderecoTomador, ";
    select += " NumeroTomador, ComplementoTomador, BairroTomador, ";
    select += " CepTomador, CodigoCidadeTomador, DescricaoCidadeTomador, ";
    select += " UfTomador, NaturezaTributacao, RegimeEspecialTributacao, ";
    select += " TipoTributacao, CodigoCnae, NumeroRpsNew, ";
    select += " NumeroRpsEnviado, NumeroNfseSubstituida, ProtocoloNfse, ";
    select += " JustificativaDeducao, ValorTotalDeducao AS 'ValorTotalDeducoes  ', ValorTotalDesconto, ";
    select += " ValorTotalServicos, ValorTotalBaseCalculo, ValorIss, ";
    select += " TipoTrib_OLD, DataInicio, ValorIssRetido, ";
    select += " TemIssRetido, AliquotaISS, CodigoItemListaServico, ";
    select += " DiscriminacaoServico, QuantidadeServicos, ValorUnitarioServico, ";
    select += " ValorDesconto, ValorPis, ValorCofins, ";
    select += " AliquotaPIS, AliquotaCOFINS, IDProdutos_VendaProdutos, SerieRpsSubstituido , DescricaoNota";
    select += " FROM nfse ";
    select += " WHERE ";

    var where = "";

    for (let index = 0; index < parametros.listID.length; index++) { 
        if(index == 0){
            where += " (nfse.id ='" + parametros.listID[index] + "')";
        }else{
            where += " OR (nfse.id ='" + parametros.listID[index] + "')";
        }        
    }
    
    select = select + where;


    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(select, function (err, recordset){ 
            if (err) console.log(err);

            var retorno = [1];
            var Prestador = {};
            var final = {};
            var configurationNFSe = {};
            var configuracaoemail = {};
            final = {};
            final.Prestador = {};
            final.ConfigurationNFSe = {};
            final.configuracaoemail = {};
            
            if(recordset){
                if(recordset.recordsets){                    
                    for (let index = 0; index < recordset.recordsets.length; index++) {  
                        retorno = [];
                        if(index == 0){
                            Prestador = recordset.recordsets[index][0];
                            retorno.push(Prestador);
                            final.Prestador = retorno;
                        }

                        if(index == 1){
                            configurationNFSe = recordset.recordsets[index][0];
                            retorno.push(configurationNFSe);
                            final.ConfigurationNFSe = retorno;
                        }

                        if(index == 2){
                            configuracaoemail = recordset.recordsets[index][0];
                            retorno.push(configuracaoemail);
                            final.configuracaoemail = retorno;
                        }

                        if(index >= 3){
                            for (let i = 0; i < recordset.recordsets[index].length; i++) {
                                NotaFiscalServico = recordset.recordsets[index][i];
                                retorno.push(NotaFiscalServico);                                                                
                            }
                            final.NotaFiscalServico = retorno;
                        }
                    }
                }
            }

            res.send(final); 
        }); 
    }); 
});

function callWebAPI(dados,url, callback){
    var Client = require('node-rest-client').Client;
    
   // direct way 
   var client = new Client();   

   var args = {
    data: dados,
    headers: { "Content-Type": "application/json" }
    };
    
   client.post(url, args,
       function (data, response) {
           if (callback) {
                callback(data);
           }
            
       }
    );
}

router.route('/importarSiscoserv').post(function(req, res) {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    var retorno = false;
    var parametros = req.body.parametros;
    var  select = "";
    var  where = "";
    var  insert = "";

    console.log(parametros);

    select += " SELECT IIF((SELECT TOP 1 nm_documento FROM movimentacao_servicos ORDER BY nm_documento DESC) > 0 , ";
    select += " (SELECT TOP 1 nm_documento FROM movimentacao_servicos ORDER BY nm_documento DESC) + 1,1 ";
    select += " ) AS 'numdoc',  ";

    select += " (SELECT cliente.id_vendedor FROM cliente WHERE cliente.id=entidade.id) AS idoperador, ";
    select += " (SELECT cliente.id_indicador FROM cliente WHERE cliente.id=entidade.id) AS idindicador, ";

    select += " entidade.id AS 'identidade', ";

    select += " (SELECT produtos.id FROM produtos  ";
    select += " INNER JOIN produtos_subservicos ON produtos.id=produtos_subservicos.id_produtos  ";
    select += " INNER JOIN subservico sub ON sub.id=produtos_subservicos.id_subservicos  ";
    select += " WHERE sub.id=subservico.id) AS idservico, ";

    select += " (subservico.id) AS idsubservico, ";

    select += " (vl_valor) AS valor, REPLACE(REPLACE(REPLACE(REPLACE(entidade.nm_cnpj, '.', ''), '/', ''), '-', ''), '.', '') AS 'nm_cnpj' ";

    select += " FROM entidade  ";
    select += " LEFT JOIN cliente_servicos ON cliente_servicos.id_entidade=entidade.id  ";
    select += " LEFT JOIN subservico ON subservico.id=cliente_servicos.id_produtos WHERE ";

    if(parametros.cnpj){
        for (let index = 0; index < parametros.cnpj.length; index++) {
            const cnpj = parametros.cnpj[index];
            const servico = parametros.servico[index];
            
            if(index == 0){
                where += " ((entidade.nm_cnpj='" + cnpj + "' OR ";
                
                where += " nm_cnpj=(left ('" + cnpj + "',2)+'.'+ ";
                where += "                    right(left ('" + cnpj + "',5),3)+'.'+ ";
                where += "             right(left ('" + cnpj + "',8),3)+'/'+ ";
                where += "             right(left ('" + cnpj + "',12),4)+'-'+ ";
                where += "             right(left ('" + cnpj + "',14),2)))";

                where += " AND nm_tiposervico='" + servico + "' ) ";
            }else{
                where += " OR ((entidade.nm_cnpj='" + cnpj + "' OR ";
                
                where += " nm_cnpj=(left ('" + cnpj + "',2)+'.'+ ";
                where += "                    right(left ('" + cnpj + "',5),3)+'.'+ ";
                where += "             right(left ('" + cnpj + "',8),3)+'/'+ ";
                where += "             right(left ('" + cnpj + "',12),4)+'-'+ ";
                where += "             right(left ('" + cnpj + "',14),2)))";

                where += " AND nm_tiposervico='" + servico + "' ) ";
            }
        }
    }
    
    select = select + where + "; ";
    select += " SELECT nm_codigo AS codigo, nm_status AS status FROM comiss WHERE "
    for (let i = 0; i < parametros.codigo.length; i++) {
        if(i == 0){
            select += " nm_codigo='" + parametros.codigo[i] + "' "
        }else{
            select += " OR nm_codigo='" + parametros.codigo[i] + "' "
        }
        
    }

    select += "; SELECT id AS id, nm_tiposervico AS tiposervico FROM subservico WHERE nm_tiposervico IS NOT NULL ";


    console.log(select);
    console.log("===========================================");

    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(select, function (err, recordset){ 
            if (err) console.log(err);

            var retorno = recordset.recordsets[0];
            var retornoStatus = recordset.recordsets[1];
            var retornoSubservicos = recordset.recordsets[2];
            if(retorno){
                    //for (let index = 0; index < retorno.recordset.length; index++) {
                    for (let i = 0; i < parametros.codigo.length; i++) {
                        var status = "";
                        for (let ind = 0; ind < retornoStatus.length; ind++) {                            
                            if(parametros.codigo[i] == retornoStatus[ind].codigo){
                                status = retornoStatus[ind].status;
                                break;                                
                            }
                        }

                        if(status == "Pendente" || !status){
                            var index = 0;
                            for (let index2 = 0; index2 < retorno.length; index2++) {
                                index = retorno[index2].nm_cnpj.indexOf(parametros.cnpj[i]);
                                if(index > -1){
                                    index = index2;
                                    break;
                                }
                            }
                            
                            const element = retorno[index];
                            element.nm_cnpj = element.nm_cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "");
                            //var i = parametros.cnpj.indexOf(element.nm_cnpj);
    
                            var identidade = element.identidade;
                            var idservico = element.idservico;
                            var numdoc = element.numdoc;
                            var idoperador = element.idoperador
                            var idindicador = element.idindicador
                            var idsubservico = element.idsubservico

                            for (let index3 = 0; index3 < retornoSubservicos.length; index3++) {                                
                                if(retornoSubservicos[index3].tiposervico == parametros.servico[i]){
                                    idsubservico = retornoSubservicos[index3].id;
                                    break;
                                }
                            }


                            var valor = element.valor
    
                            if(!idindicador){
                                idindicador = "NULL";
                            }else{
                                idindicador = "'" + idindicador + "'";
                            }
    
                            var arrayData = parametros.data[i].split('/');
                            parametros.data[i] = arrayData[1] + "/" + arrayData[0] + "/" + arrayData[2];
    
                            insert += " DELETE FROM movimentacao_servicos WHERE nm_numero_operacao='" + parametros.codigo[i] + "'; "; 
                            insert += " INSERT INTO movimentacao_servicos (id, dt_emissao, id_entidade, id_produtos, nm_documento, nm_obs,  ";
                            insert += " vl_valor, id_operador,id_indicador,id_subservicos,vl_cotacao,id_dsg_movimentacao_status, ";
                            insert += " nm_numero_nfes,nm_numero_boleto,dt_faturamento,nm_numero_operacao,nm_status,id_contas_receber, nm_nomepessoaextrangeira, nm_nbs, id_referencia) ";
                            
                            insert += " VALUES (newID(), '" + parametros.data[i] + "', '" + identidade + "', ";
                            insert += "'" + idservico + "', IIF((SELECT TOP 1 nm_documento FROM movimentacao_servicos ORDER BY nm_documento DESC) > 0 ,";
                            insert += "(SELECT TOP 1 nm_documento FROM movimentacao_servicos ORDER BY nm_documento DESC) + 1,1 ";
                            insert += "), '" + parametros.obs[i] + "',";
                            insert += parametros.valor[i] + ", '" + idoperador + "'," + idindicador + ", '" + idsubservico + "', 0, NULL,";
                            insert += " NULL, NULL, NULL, '" + parametros.codigo[i] + "', NULL, NULL, '" + parametros.nomepessoaextrangeira[i] + "', '" + parametros.nbs[i] + "', '" + parametros.idreferencia[i] + "'";
                            insert += "); ";
                        }
                        
                    }


                    console.log(insert)
                    var resposta = {};
                    var transacao = new sql.Transaction();
                    transacao.begin(err =>{
                        var request = new sql.Request(transacao);
                        request.query(insert, function (err, recordset) {
                            if (err){
                                resposta.status = -4;
                                resposta.mensagem = [];
                                resposta.mensagem.push("ops");
                                resposta.titulo = "Falha ao importar os dados, verifique no cadastro de clientes a aba de Subserviços e Operadores ";
                                transacao.rollback();
                                res.send(resposta);     
                            }
                            else{

                                gerarComissaoBloco(parametros.codigo);

                                resposta.status = 1;
                                resposta.mensagem = ["ok"];
                                resposta.titulo =  "Importação realizada com sucesso";
                                transacao.commit();
                                res.send(resposta);         
                            }
                        }) 
                    })
                
            }
            //res.send(insert); 
        }); 
    }); 
});

function gerarComissaoBloco(arrayID) { 
    
    var insertupdate = ""; 
    var select = " SELECT  movimentacao_servicos.id AS idmovimentacao, movimentacao_servicos.nm_numero_operacao AS codigo,";
    select += " (SELECT TOP 1 id FROM comiss WHERE id_venda=movimentacao_servicos.id AND comiss.id_vendedor=movimentacao_servicos.id_operador) AS 'idop', ";
    select += " (SELECT TOP 1 id FROM comiss WHERE id_venda=movimentacao_servicos.id AND comiss.id_vendedor=movimentacao_servicos.id_indicador) AS 'idind', ";
    select += " movimentacao_servicos.id_operador AS 'idoperador', ";
    select += " movimentacao_servicos.id_indicador AS 'idindicador',  ";
    select += " (SELECT TOP 1 nm_status FROM comiss WHERE id_venda=movimentacao_servicos.id AND id_operador=movimentacao_servicos.id_operador) AS 'statusop', ";
    select += " (SELECT TOP 1 nm_status FROM comiss WHERE id_venda=movimentacao_servicos.id AND id_operador=movimentacao_servicos.id_indicador) AS 'statusind', ";
    select += " (SELECT TOP 1 vl_comissaooperador FROM vendedor_servicos WHERE vendedor_servicos.id_vendedor=movimentacao_servicos.id_operador AND vendedor_servicos.id_produtos=movimentacao_servicos.id_subservicos) AS 'comissaopercop', ";
    select += " (SELECT TOP 1 vl_comissaooperador FROM vendedor_servicos WHERE vendedor_servicos.id_vendedor=movimentacao_servicos.id_indicador AND vendedor_servicos.id_produtos=movimentacao_servicos.id_subservicos) AS 'comissaopercind'  ";
    select += " , movimentacao_servicos.vl_valor AS 'valormov' ";
 
    select += " FROM movimentacao_servicos ";
    select += " LEFT JOIN comiss ON comiss.id_venda=movimentacao_servicos.id ";

    select += " WHERE ";

    var where  = "";
    for (let i = 0; i < arrayID.length; i++) {
        if(i == 0){
            where  += " movimentacao_servicos.nm_numero_operacao='" + arrayID[i] + "' ";
        }else{
            where  += " OR movimentacao_servicos.nm_numero_operacao='" + arrayID[i] + "' ";
        }        
    }

    select = select + where;
    console.log("+++++++++++++COMISSAO++++++++++++++++++");
    console.log(select);

    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(select, function (err, recordset){ 
            if (err) console.log(err);
                                 

            if(recordset.recordset.length > 0){
                for (let i = 0; i < recordset.recordset.length; i++) {

                    if(recordset.recordset[i].statusop == "Concluído"){
                        var sucesso = false;
                        var message = "Status Concluído não gera comissão";

                        var resposta = {
                            success: sucesso,
                            message: message
                        }
                        //res.json(resposta);
                    }else{                    

                        var idcomissop =  recordset.recordset[i].idop;
                        var idcomissind =  recordset.recordset[i].idind;
                        var idcomiss = recordset.recordset[i].id;
                        var id_operador = recordset.recordset[i].idoperador;
                        var id_indicador = recordset.recordset[i].idindicador;
                        var nm_status = "Pendente";
                        var id_empresa = "9F39BDCF-6B98-45DE-A819-24B7F3EE2560";
                        var numero_pedido = "";
                        var dt_emissao = "";
                        var vl_venda =  recordset.recordset[i].valormov;
                        var vl_comissaoOp = "";
                        var vl_comissaoInd = "";
                        var vl_comissaopercOP = recordset.recordset[i].comissaopercop;
                        var vl_comissaopercIND = recordset.recordset[i].comissaopercind;
                        var id = recordset.recordset[i].idmovimentacao;
                        var codigo = recordset.recordset[i].codigo;
                        

                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1;

                        var yyyy = today.getFullYear();
                        if(dd<10){
                            dd='0'+dd;
                        } 
                        if(mm<10){
                            mm='0'+mm;
                        } 
                        var dt_emissao = mm + '/' + dd + '/' + yyyy;   
                        var valorcomiss = 0;

                        console.log("idcomissop=" + idcomissop);
                        console.log("idcomissind=" + idcomissind);

                        if((id_operador != null && id_indicador == null) || (id_operador == id_indicador && id_operador != null && id_indicador != null)){
                        
                            if(vl_comissaopercOP){
                                valorcomiss = (parseFloat(vl_venda) * parseFloat(vl_comissaopercOP).toFixed(2)) / 100;
                                valorcomiss = valorcomiss.toFixed(2);
                                vl_comissaoOp = valorcomiss.toString();
                            }
                            id_indicador = "";
                        }else{
                            if(id_operador != id_indicador){
                                if(vl_comissaopercIND){
                                    valorcomiss = (parseFloat(vl_venda) * parseFloat(vl_comissaopercIND).toFixed(2)) / 100;
                                    valorcomiss = valorcomiss.toFixed(2);                                
                                    vl_comissaoInd = valorcomiss.toString();
                                    if(vl_comissaopercOP){
                                        valorcomiss = ((parseFloat(vl_venda) - parseFloat(vl_comissaoInd)) * parseFloat(vl_comissaopercOP).toFixed(2)) / 100;
                                        valorcomiss = valorcomiss.toFixed(2); 
                                        vl_comissaoOp = valorcomiss.toString();
                                    }
                                    
                                }
                            }
                        }

                        if(vl_comissaoOp == ""){
                            vl_comissaoOp = "0";
                            var sucesso = false;
                            var message = "Não existe configuração para gerar a comissão";

                            var resposta = {
                                success: sucesso,
                                message: message
                            }
                            //res.json(resposta);
                        }

                        if(idcomissop == null){
                            if(id_operador){
                                insertupdate += " DELETE FROM comiss WHERE nm_codigo='" + codigo + "'; ";
                                insertupdate += " INSERT INTO comiss ";
                                insertupdate += " (id, id_vendedor, id_venda, nm_status, id_empresa, numero_pedido, dt_emissao, vl_venda, vl_comissao, nm_codigo)";
                                insertupdate += " VALUES(newID(), '" + id_operador + "', '" + id + "', '" + nm_status + "', '" + id_empresa + "', '" + numero_pedido + "', '" + dt_emissao + "', " + vl_venda + ", " + vl_comissaoOp + ", '" + codigo + "');";          
                            }
                        }else{
                            if(id_operador){
                                //insertupdate += " UPDATE comiss SET id_vendedor='" + id_operador + "',id_venda='" + id + "', nm_status='" + nm_status + "', id_empresa='" + id_empresa + "', numero_pedido='" + numero_pedido + "', dt_emissao='" + dt_emissao + "', vl_venda=" + vl_venda + ", vl_comissao=" + vl_comissaoOp + " WHERE id='" + idcomissop + "' ;";
                            }
                        }
                        
                        if(vl_comissaoInd == ""){
                            vl_comissaoInd = "0";
                        }
                        
                        if(idcomissind == null){
                            if(id_indicador){
                                //insertupdate += " DELETE FROM comiss WHERE nm_codigo='" + codigo + "'; ";
                                insertupdate += " INSERT INTO comiss ";
                                insertupdate += " (id, id_vendedor, id_venda, nm_status, id_empresa, numero_pedido, dt_emissao, vl_venda, vl_comissao, nm_codigo)";
                                insertupdate += " VALUES(newID(), '" + id_indicador + "', '" + id + "', '" + nm_status + "', '" + id_empresa + "', '" + numero_pedido + "', '" + dt_emissao + "', " + vl_venda + ", " + vl_comissaoInd  + ", '" + codigo + "');";          
                            }
                        }else{
                            if(id_indicador){
                                //insertupdate += " UPDATE comiss SET id_vendedor='" + id_indicador + "',id_venda='" + id + "', nm_status='" + nm_status + "', id_empresa='" + id_empresa + "', numero_pedido='" + numero_pedido + "', dt_emissao='" + dt_emissao + "', vl_venda=" + vl_venda + ", vl_comissao=" + vl_comissaoInd + " WHERE id='" + idcomissind + "' ;";
                            }
                        }
                    }
                } 

                console.log("insertupdate === ")
                console.log(insertupdate)
                sql.close(); 
                sql.connect(config, function (err) { 
                    if (err) console.log(err); 
                    
                    var request = new sql.Request();
                    request.query(insertupdate).then(function(recordset) {
                        var sucesso = true;
                        var message = "Comissão gerada com sucesso!";

                        var resposta = {
                            success: sucesso,
                            message: message
                        }
                        return resposta;
                        //res.json(resposta); 
                    }).catch(function(err) { 
                        console.log(err)
                        var sucesso = false;
                        var message = "Falha ao gerar a comissão";

                        var resposta = {
                            success: sucesso,
                            message: message
                        }
                        return resposta;
                    });
                });
                   
            }else{
                var sucesso = false;
                var message = "Não existe gerar a comissão";

                var resposta = {
                    success: sucesso,
                    message: message
                }
                return resposta; 
            }
        });
    });     
}

router.route('/alterarComissao/:idcomiss/:percentualcomiss').get(function(req, res) {
    
    var idcomiss = req.param('idcomiss');
    var percentualcomiss = req.param('percentualcomiss');

    var update = "";

    if(percentualcomiss.indexOf(',') >= 0){
        percentualcomiss = percentualcomiss.replace(".", "").replace(",", ".");
    }

    update = "UPDATE comiss SET  vl_comissao=(vl_venda * " + percentualcomiss + " / 100), vl_percentual_comissao=" + percentualcomiss + "  WHERE id='" + idcomiss + "'; ";
       
    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
    
        try{
                              
            var request = new sql.Request();
            request.query(update, function (err, recordset) {
                if (err){
                    //res.send(err);  
                    res.send("");     
                }
                else{
                    res.send("Valores atualizados com sucesso");         
                }
            })                       
        }
        catch(err){
            //res.send(err);  
            res.send("");                                
        }
    });   

})

router.route('/enviarEmailLote').post(function(req, res) {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    var retorno = false;
    var parametros = req.body.parametros;
    var  select = "";
    var  where = "";
    var  insert = "";

    /*
    var arrayDatade = parametros.datade.split('-');
    parametros.datade = arrayDatade[0] + "-" + arrayDatade[2] + "-" + arrayDatade[1];

    var arrayDataate = parametros.dataate.split('-');
    parametros.dataate = arrayDataate[0] + "-" + arrayDataate[2] + "-" + arrayDataate[1];
    console.log(parametros);
*/
    select += " SELECT contato.id_entidade AS 'entidade', contato.nm_email AS 'emaildestinatario',  ";
    select += " cadastro_email.nm_servidor AS 'servidor', ";
    select += " cadastro_email.nm_emailenvio AS 'emailremetente' , ";
    select += " cadastro_email.nm_senha AS 'senha' , ";
    select += " cadastro_email.nm_assunto AS 'assunto' , ";
    select += " cadastro_email.nm_texto AS 'texto',  ";
    select += " contato.id_dsg_tipo_contato AS 'tipocontato' ";
    select += " FROM contato  ";
    select += " INNER JOIN cadastro_email ON cadastro_email.id_dsg_tipo_contato=contato.id_dsg_tipo_contato ";
    
    select += " WHERE ";

    for (let i = 0; i < parametros.entidades.length; i++) {
        var tipo = parametros.tipocontato[i];
        var entidade = parametros.entidades[i];

        switch(tipo) {
            case "0":   
                //Envia todos             
                tipo = "23849113-24f5-45ed-a959-3f953eb2d6cb";
                break;
            case "1":
                //Envia Relatorio Geral           
                tipo = "6537b77b-2229-42fb-995d-0e4ead8af4bc";
                break;
            case "2":
                //Envia Relatorio SiscoServ           
                tipo = "746cb5ec-4f09-4470-9c8e-b47077c92cf9";
                break; 
            case "3":
                //Envia Relatorio Comissao           
                tipo = "3dc8e464-d65b-4149-ae0e-a64828bfbdf5";
                break;              
            default:
                break;
        }

        if(i == 0){
            where += " (contato.id_dsg_tipo_contato='" + tipo + "' AND id_entidade = '" + entidade + "') ";
        }else{
            where += " OR (contato.id_dsg_tipo_contato='" + tipo + "' AND id_entidade = '" + entidade + "') ";
        }
        
    }
    
    select += where;
    console.log(select);

    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
        var request = new sql.Request(); 
        request.query(select, function (err, recordset){ 
            if (err) console.log(err);

            var retorno = recordset;
            if(retorno){
                if(retorno.recordset){
                    for (let i = 0; i < retorno.recordset.length; i++) {
                        var sender = {};
                        var mail = {};

                        sender.service = retorno.recordset[i].servidor ;
                        sender.user = retorno.recordset[i].emailremetente ;
                        sender.pass = retorno.recordset[i].senha ;

                        mail.from = retorno.recordset[i].emailremetente ;
                        mail.to = retorno.recordset[i].emaildestinatario;

                        mail.subject = retorno.recordset[i].assunto ;
                        mail.text = retorno.recordset[i].texto ;

                        switch(retorno.recordset[i].tipocontato.toLowerCase()) {
                            case "":   
                                //Envia todos             
                                 
                                break;
                            case "6537b77b-2229-42fb-995d-0e4ead8af4bc":
                                //Envia Relatorio Geral           
                                mail.path = "http://" + req.host + ":3002/api/r/detalhesservicosgerais";
                                mail.path += "/%7B%22userId%22:%7B%22value%22:%22de5d2469-ae66-4696-9147-004f86f7d0d9%22,";
                                mail.path += "%22text%22:%22de5d2469-ae66-4696-9147-004f86f7d0d9%22%7D,";
                                mail.path += "%22_orientacao_%22:%7B%22value%22:%22landscape%22,%22text%22:%22Retrato%22%7D,";
                                mail.path += "%22_saida_%22:%7B%22value%22:%22pdf%22,%22text%22:%22pdf%22%7D,";
                                mail.path += "%22datainicial%22:%7B%22value%22:%22" + parametros.datade + "%22,%22type%22:%22caracter%22,%22text%22:%22" + parametros.datade + "%22%7D,";
                                mail.path += "%22datafinal%22:%7B%22value%22:%22" + parametros.dataate + "%22,%22type%22:%22caracter%22,%22text%22:%22" + parametros.dataate + "%22%7D,";
                                mail.path += "%22cliente%22:%7B%22value%22:%22" + retorno.recordset[i].entidade + "%22,%22type%22:%22caracter%22,%22text%22:%22" + retorno.recordset[i].entidade + "%22%7D%7D";
                                
                                break;
                            case "746cb5ec-4f09-4470-9c8e-b47077c92cf9":
                                //Envia Relatorio SiscoServ           
                                mail.path = "http://" + req.host + ":3002/api/r/detalhesservicos";
                                mail.path += "/%7B%22userId%22:%7B%22value%22:%22de5d2469-ae66-4696-9147-004f86f7d0d9%22,";
                                mail.path += "%22text%22:%22de5d2469-ae66-4696-9147-004f86f7d0d9%22%7D,";
                                mail.path += "%22_orientacao_%22:%7B%22value%22:%22landscape%22,%22text%22:%22Retrato%22%7D,";
                                mail.path += "%22_saida_%22:%7B%22value%22:%22pdf%22,%22text%22:%22pdf%22%7D,";
                                mail.path += "%22datainicial%22:%7B%22value%22:%22" + parametros.datade + "%22,%22type%22:%22caracter%22,%22text%22:%22" + parametros.datade + "%22%7D,";
                                mail.path += "%22datafinal%22:%7B%22value%22:%22" + parametros.dataate + "%22,%22type%22:%22caracter%22,%22text%22:%22" + parametros.dataate + "%22%7D,";
                                mail.path += "%22cliente%22:%7B%22value%22:%22" + retorno.recordset[i].entidade + "%22,%22type%22:%22caracter%22,%22text%22:%22" + retorno.recordset[i].entidade + "%22%7D%7D";
                                
                                break; 
                            case "3dc8e464-d65b-4149-ae0e-a64828bfbdf5":
                                //Envia Relatorio comissao
                                mail.path = "http://" + req.host + ":3002/api/r/detalhescomissaopagar";
                                mail.path += "/%7B%22userId%22:%7B%22value%22:%22de5d2469-ae66-4696-9147-004f86f7d0d9%22,";
                                mail.path += "%22text%22:%22de5d2469-ae66-4696-9147-004f86f7d0d9%22%7D,%22_orientacao_%22:%7B%22value%22:%22landscape%22,%22text%22:%22Paisagem%22%7D,";
                                mail.path += "%22_saida_%22:%7B%22value%22:%22pdf%22,%22text%22:%22Pdf%22%7D,";
                                mail.path += "%22datainicial%22:%7B%22value%22:%22" + parametros.datade + "%22,%22type%22:%22caracter%22,%22text%22:%22" + parametros.datade + "%22%7D,";
                                mail.path += "%22datafinal%22:%7B%22value%22:%22" + parametros.dataate + "%22,%22type%22:%22caracter%22,%22text%22:%22" + parametros.dataate + "%22%7D,";
                                mail.path += "%22operador%22:%7B%22value%22:%22" + retorno.recordset[i].entidade + "%22,%22type%22:%22caracter%22,%22text%22:%22" + retorno.recordset[i].entidade + "%22%7D%7D";
                                         
                                
                                break;           
                            default:
                                break;
                        }

                        //mail.path = 'http://localhost:3002/api/r/detalhesservicos/%7B%22userId%22:%7B%22value%22:%22de5d2469-ae66-4696-9147-004f86f7d0d9%22,%22text%22:%22de5d2469-ae66-4696-9147-004f86f7d0d9%22%7D,%22_orientacao_%22:%7B%22value%22:%22landscape%22,%22text%22:%22Paisagem%22%7D,%22_saida_%22:%7B%22value%22:%22pdf%22,%22text%22:%22Pdf%22%7D,%22datainicial%22:%7B%22value%22:%222019-01-01%22,%22type%22:%22caracter%22,%22text%22:%2201-01-2019%22%7D,%22datafinal%22:%7B%22value%22:%222019-01-31%22,%22type%22:%22caracter%22,%22text%22:%2231-01-2019%22%7D,%22cliente%22:%7B%22value%22:%2257060C34-9B7B-423C-957C-45E09E970E6A%22,%22type%22:%22caracter%22,%22text%22:%22SIDEL%20DO%20BRASIL%20LTDA%22%7D%7D';
                       
                            enviarEmail(sender, mail, function(error, info){
                                if (error) {
                                    console.log(error.response);
                                    var ret = {};
                                    ret.status = false;
                                    ret.message = error.response;
                                    res.send(ret);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                    var ret = {};
                                    ret.status = true;
                                    ret.message = 'Email sent: ' + info.response;
                                    res.send(ret);
                                }
                                
                            })
                    }
                }
            }
            //res.send(retorno); 
        }); 
    }); 

})

function enviarEmail(sender, mail, callback) { 

    var transporter = nodemailer.createTransport({
    pool: true,
    maxConnections: 1000,
    maxMessages: 1000,
    rateDelta: 5000,
    service: sender.service,
    auth: {
        user: sender.user,
        pass: sender.pass
    }
    });

    var mailOptions = {
    from: mail.from,
    to: mail.to,
    subject: mail.subject,
    text: mail.text,  
    attachments: [  
        {   
            filename: "relatorio.pdf",
            path: mail.path
        }   
    ]   
    };

    transporter.sendMail(mailOptions, function(error, info){
        transporter.close();
        callback(error, info);
        /*
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent: ' + info.response);
        }
        */
    });
}

router.route('/gerarContasPagarRateio').post(function(req, res) {     

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    var aValor = null;
    var idMovimentacao = null; //req.param('idMovimentacao'); 
    var EnterpriseID = null; //req.param('EnterpriseID'); 
    var idUsuario = null; //req.param('idUsuario'); 
    var parametros = null;

    var query = "";
    var resposta = {};
    var nrParcela = 0;
    var arrayMovimentacao = null; //idMovimentacao.split(",");
    var j = 0;
    var arrayResposta = [];
    var total = 0;
    var parcela = null;
    var titulo = null;
    var Atitulo = [];

    try{
        parametros = req.body.parametros;
        arrayMovimentacao = parametros.idTitulo;
        EnterpriseID = parametros.idEmpresa;
        idUsuario = parametros.idUsuario;
        aValor = parametros.aValor;

        sql.close();
        sql.connect(config, function (err) {
            var where = "";
            for (let k = 0; k < arrayMovimentacao.length; k++) {
                if(k == 0){
                    where += " op.id='" + arrayMovimentacao[k] + "' ";
                }else{
                    where += " OR op.id='" + arrayMovimentacao[k] + "' ";
                }
                
            }

            query += "SELECT  newID() AS 'id',    ";
            query += " op.id AS 'id_entidade',     ";
            query += " op.nm_razaosocial AS 'operador',     ";
            query += " (0) AS 'valor',    ";
            query += " (0) AS 'valortotal',    ";
            query += " (SELECT TOP 1 id FROM parcelamento WHERE nr_numeroparcelas=1) AS 'id_parcelamento',  ";
            query += " GETDATE() AS 'dt_emissao',  ";
            query += " IIF((SELECT TOP 1 nm_documento FROM contas_pagar ORDER BY nm_documento DESC) IS NULL,0, ";
            query += " (SELECT TOP 1 nm_documento FROM contas_pagar ORDER BY nm_documento DESC)) AS 'nr_pedido'   ";
            
            query += " FROM entidade op     ";           
            
            query += " WHERE " + where + " ";
            query += " GROUP BY op.nm_razaosocial, op.id ";

            console.log(query);

            
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
                        var movimentacao = recordset.recordsets[0][0];

                        gerarparcelas(config,EnterpriseID,movimentacao.id_parcelamento,1,new Date(movimentacao.dt_emissao),(function(respostaParcelas){
                            
                            try{
                                if(respostaParcelas.status > 0){
                                    for (let h = 0; h < recordset.recordsets[0].length; h++) {
                                        movimentacao = recordset.recordsets[0][h];
                                        var valor;
                                        for (let z = 0; z < arrayMovimentacao.length; z++) {
                                            if(arrayMovimentacao[z] == movimentacao.id_entidade){
                                                valor = aValor[z];
                                                break;
                                            }
                                        }

                                        
                                        total = 0;
                                        parcela = null;
                                        titulo = {
                                            idEmpresa: EnterpriseID,
                                            idUsuario: idUsuario,
                                            idTitulo: "",
                                            idEntidade: movimentacao.id_entidade,
                                            idPedido: movimentacao.id,
                                            //idNotaFiscal: compra.id_notafiscal,
                                            nrTitulo: parseInt(movimentacao.nr_pedido) + (h + 1),
                                            emissao: new Date(movimentacao.dt_emissao).toISOString(),
                                            competencia: "",
                                            valor: valor,
                                            idContaFinanceira: "",
                                            idParcelamento: movimentacao.id_parcelamento,
                                            observacao: "",
                                            dre: 0,
                                            idOrigem: movimentacao.id,
                                            parcelas: []
                                        };
                            
                                        for(i = 0; i < respostaParcelas.parcelas.length; i++){
                                            nrParcela++;
                                            parcela = {
                                                idParcela: "",
                                                documento: parseInt(movimentacao.nr_pedido) + (h + 1),
                                                parcela: respostaParcelas.parcelas[i].parcela,
                                                vencimento: new Date(respostaParcelas.parcelas[i].vencimento).toISOString(),
                                                valor: valor,
                                                idBanco: "",
                                                idFormaPagamento: movimentacao.id_formapagamento,
                                                idContaFinanceira: "",
                                                fluxoCaixa: "1"
                                            };
                                            total += parseFloat(valor);
                                            titulo.parcelas.push(parcela);
                                        }                        
                                        
                                        titulo.valor = total;
                                        Atitulo.push(titulo);
                                    }

                                    //if(total > 0){  
                                        
                                        funAtualizarConta(Atitulo,(function(repostacallback){
                                            j += 1;
                                            arrayResposta.push(repostacallback);  
                                            
                                            query = "SELECT  comiss.id AS 'id', ";
                                            query += " comiss.nm_status AS 'status' ";
                                            query += " FROM movimentacao_servicos   "; 
                                            query += " INNER JOIN comiss ON comiss.id_venda=movimentacao_servicos.id   ";
                                            query += " INNER JOIN entidade op ON op.id=comiss.id_vendedor   ";
                                            query += " INNER JOIN comissao_apuracao ca ON ca.id_entidade=op.id  ";
                                            query += " WHERE " + where + " AND comiss.nm_status='Em Pagamento' ";
                                            sql.close()
                                            sql.connect(config).then(function() {
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
                                                    var comissaoFinal = [];
                                                    comissaoFinal = recordset.recordsets[0];
                                                    var queryComiss = "";
                                                    for(s = 0; s < comissaoFinal.length; s++){
                                                        queryComiss += "UPDATE comiss SET nm_status='Concluído' WHERE id='" + comissaoFinal[s].id + "'; ";
                                                    }

                                                    where = "";
                                                    for (let k = 0; k < arrayMovimentacao.length; k++) {
                                                        if(k == 0){
                                                            where += " comissao_apuracao.id='" + arrayMovimentacao[k] + "' ";
                                                        }else{
                                                            where += " OR comissao_apuracao.id='" + arrayMovimentacao[k] + "' ";
                                                        }                                                        
                                                    }

                                                    queryComiss += " UPDATE comissao_apuracao SET nm_status='Concluído' WHERE " + where + " AND nm_status IS NULL; ";
                                                    console.log(queryComiss);

                                                    sql.close()
                                                    sql.connect(config).then(function() {
                                                        var request = new sql.Request();
                                                        request.query(queryComiss).then(function(recordset) {
                                                            res.json(arrayResposta); 
                                                        }).catch(function(err) { 
                                                            console.log(err)                   
                                                            res.send(false)
                                                        });
                                                    });

                                                    
                                                    }
                                                })
                                            })
                                        }));
                                                                            
                                        
                                    /*}else{
                                        resposta = {
                                            status: 0,
                                            mensagem: ["Não foram geradas parcelas para esta movimentação"],
                                            titulo: null
                                        }
                                        res.json(reposta);
                                    } */                                   
                                }else{                                    
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

});


router.route('/alterarRPS/:id/:nf').get(function(req, res) {
    
    var nf = req.param('nf');
    var id = req.param('id');
    var update = "";

    update = "UPDATE configuracao_nfe_servico SET nr_numerolote=(nr_numerolote + 1); ";
    update += "UPDATE nfse SET status='Concluído' WHERE id='" + id + "'; ";
    update += "UPDATE movimentacao_servicos SET nm_numero_nfes='" + nf + "', dt_faturamento=GETDATE() WHERE  id_contas_receber='" + id + "'; ";
    
    console.log(update)
    sql.close(); 
    sql.connect(config, function (err) { 
        if (err) console.log(err); 
    
        try{                              
            var request = new sql.Request();
            request.query(update, function (err, recordset) {
                if (err){
                    //res.send(err);  
                    res.send("");     
                }
                else{
                    res.send("Valores atualizados com sucesso");         
                }
            })                       
        }
        catch(err){
            //res.send(err);  
            res.send("");                                
        }
    });   

})