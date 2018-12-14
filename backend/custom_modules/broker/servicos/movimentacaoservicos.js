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
    var select = "SELECT newID() AS 'id', "; 
    select += " entidade.nm_cnpj AS 'cnpj', "; 
    select += " entidade.nm_razaosocial AS 'razaosocial', "; 
    select += " FORMAT(SUM(movimentacao_servicos.vl_valor), 'c', 'pt-BR' )  AS 'dt_faturamento', "; 
    select += " FORMAT(movimentacao_servicos.dt_faturamento, 'd', 'pt-BR' )  AS 'valor', "; 
    select += " movimentacao_servicos.nm_numero_nfes AS 'numero_nfes', "; 
    select += " movimentacao_servicos.nm_numero_boleto AS 'numero_boleto',  cliente_servicos.sn_notaunica AS 'notaunica', movimentacao_servicos.id_contas_receber AS 'idcontasreceber' "; 
    select += " FROM movimentacao_servicos "; 
    //select += " INNER JOIN produtos sub ON sub.id=movimentacao_servicos.id_subservicos "; 
    //select += " INNER JOIN produtos prod ON prod.id=movimentacao_servicos.id_produtos "; 
    select += " INNER JOIN entidade ON entidade.id=movimentacao_servicos.id_entidade ";
    select += " LEFT JOIN cliente_servicos ON cliente_servicos.id_produtos=movimentacao_servicos.id_subservicos AND  cliente_servicos.id_entidade= movimentacao_servicos.id_entidade ";  
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
                where += " WHERE movimentacao_servicos.nm_numero_boleto  IS NOT NULL "; 
            }else{ 
                where += " AND  movimentacao_servicos.nm_numero_boleto  IS NOT NULL "; 
            } 
        } 
    } else{
        if(bol == "true"){ 
            if(!where){ 
                where += " WHERE movimentacao_servicos.nm_numero_boleto  IS  NULL "; 
            }else{ 
                where += " AND  movimentacao_servicos.nm_numero_boleto  IS  NULL "; 
            } 
        } 

    }

    select = select + where; 
    select = select + "  GROUP BY entidade.nm_cnpj, entidade.nm_razaosocial,  movimentacao_servicos.dt_faturamento,  movimentacao_servicos.nm_numero_nfes,  movimentacao_servicos.nm_numero_boleto,  movimentacao_servicos.nm_numero_boleto, cliente_servicos.sn_notaunica, movimentacao_servicos.id_contas_receber";
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
    select += " CAST((SELECT TOP 1 vl_comissaooperador FROM vendedor_servicos WHERE vendedor_servicos.id_vendedor=comiss.id_vendedor AND vendedor_servicos.id_produtos = movimentacao_servicos.id_subservicos) AS varchar(200)) as'percentualcomiss', ";
    select += " FORMAT ((comiss.vl_comissao - ((SELECT vl_tributoservicos FROM empresa WHERE empresa.id='9F39BDCF-6B98-45DE-A819-24B7F3EE2560')) * movimentacao_servicos.vl_valor / 100 ), 'c', 'pt-BR' ) AS 'valorliquido' ";
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
    select += "    AND comissao_apuracao.id_equipe  IS NULL) IS NULL, '0', '1') as 'insup',  ";

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
                    //sqlstring += " DELETE FROM comissao_apuracao WHERE nm_datade='" + dataDe + "' AND nm_dataate='" + dataAte + "' AND id_equipe " + campoequipe + "; ";
                    
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

router.route('/gravarControleComissaoPagarDesconto/:descricao/:desconto/:idcomissaoapuracao/:id').get(function(req, res) { 
    var id = req.param('id');   
    var descricao = req.param('descricao'); 
    var desconto = req.param('desconto'); 
    var idcomissaoapuracao = req.param('idcomissaoapuracao'); 

    var insertupdate = ""; 

    if(desconto.indexOf(',') >= 0){
        desconto = desconto.replace(".", "").replace(",", ".");
    }

    if(id == "*"){
        insertupdate = "INSERT INTO comissao_desconto (id, nm_descricao, id_contas_pagar, vl_desconto) ";
        insertupdate += " VALUES(newID(), '" + descricao + "', '" + idcomissaoapuracao + "', '" + desconto + "')";
    }else{
        
        insertupdate = "UPDATE comissao_desconto SET nm_descricao='" + descricao + "', vl_desconto=" + desconto + " WHERE id='" + id + "'";
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

    var select = " SELECT  ";
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
    var select = "SELECT id AS 'id', nm_descricao AS 'descricao' , vl_desconto AS 'desconto'"; 
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
    var select = "SELECT id AS 'id', nm_descricao AS 'descricao' , vl_desconto AS 'desconto'"; 
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



router.route('/carregaControleComissaoPagarEquipe/:id/:equipe').get(function(req, res) {
    var id = req.param('id'); 
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

router.route('/filtrarImportacaoBySisco/:dataDe/:dataAte/:cliente/:servico').get(function(req, res) {

    var dataDe = req.param('dataDe');
    var dataAte = req.param('dataAte');


    var cliente = req.param('cliente');
    var servico = req.param('servico');
    var where = "";
    var query = "";

    const { Pool } = require('pg');
    const pool = new Pool({
        user: 'Intelecta',
        host: 'Brokerbrasil.dyndns.org',
        database: 'BySisco',
        password: 'Broker2018',
        port: 5432,
    })

    query += " SELECT venda.idvenda AS id,venda.codigo AS codigo, ";
    query += " TO_CHAR(venda.datacadastro, 'DD/MM/YYYY') AS datacadastro , ";
    query += " pessoa.nome AS nomepessoa, ('RVS') AS nomeservico, vendaoperacao.valor AS valortotal ";
    query += " FROM venda ";
    query += " INNER JOIN pessoa ON pessoa.idpessoa = venda.idpessoaadquirente  ";
    query += " INNER JOIN vendaoperacao ON vendaoperacao.idvenda = venda.idvenda ";
    if(dataDe){ 
        if(dataDe != "*"){ 
            query += " WHERE venda.datacadastro >= '" + dataDe + " 00:00:00' "; 
            if(dataAte){ 
                if(dataAte != "*"){ 
                    query += " AND venda.datacadastro <= '" + dataAte + " 23:59:59' ";         
                } 
            } 
        } 
    } 
    query += " UNION ALL ";
    query += " SELECT aquisicao.idaquisicao AS id,aquisicao.codigo AS codigo, ";
    query += " TO_CHAR(aquisicao.datacadastro, 'DD/MM/YYYY') AS datacadastro , ";
    query += " pessoa.nome AS nomepessoa, ('RAS') AS nomeservico, aquisicaooperacao.valor AS valortotal ";
    query += " FROM aquisicao ";
    query += " INNER JOIN pessoa ON pessoa.idpessoa = aquisicao.idpessoaadquirente ";
    query += " INNER JOIN aquisicaooperacao ON aquisicaooperacao.idaquisicao = aquisicao.idaquisicao ";
    if(dataDe){ 
        if(dataDe != "*"){ 
            query += " WHERE aquisicao.datacadastro >= '" + dataDe + " 00:00:00' "; 
            if(dataAte){ 
                if(dataAte != "*"){ 
                    query += " AND aquisicao.datacadastro <= '" + dataAte + " 23:59:59' ";         
                } 
            } 
        } 
    }    
    
    query += " UNION ALL ";
    query += " SELECT faturamento.idfaturamento AS id,faturamento.codigo AS codigo, ";
    query += " TO_CHAR(faturamento.datacadastro, 'DD/MM/YYYY') AS datacadastro , ";
    query += " pessoa.nome AS nomepessoa, ('RF') AS nomeservico, faturamentooperacao.valorfaturado AS valortotal ";
    query += " FROM faturamento ";
    query += " INNER JOIN venda ON venda.idvenda = faturamento.idvenda ";
    query += " INNER JOIN pessoa ON pessoa.idpessoa = venda.idpessoaadquirente ";
    query += " INNER JOIN faturamentooperacao ON faturamentooperacao.idfaturamento = faturamento.idfaturamento ";
    if(dataDe){ 
        if(dataDe != "*"){ 
            query += " WHERE faturamento.datacadastro >= '" + dataDe + " 00:00:00' "; 
            if(dataAte){ 
                if(dataAte != "*"){ 
                    query += " AND faturamento.datacadastro <= '" + dataAte + " 23:59:59' ";         
                } 
            } 
        } 
    } 

    query += " UNION ALL ";
    query += " SELECT pagamento.idpagamento AS id,pagamento.codigo AS codigo, ";
    query += " TO_CHAR(pagamento.datacadastro, 'DD/MM/YYYY') AS datacadastro , ";
    query += " pessoa.nome AS nomepessoa, ('RP') AS nomeservico, pagamentooperacao.valorpago AS valortotal ";
    query += " FROM pagamento ";
    query += " INNER JOIN aquisicao ON aquisicao.idaquisicao = pagamento.idaquisicao ";
    query += " INNER JOIN pessoa ON pessoa.idpessoa = aquisicao.idpessoaadquirente ";
    query += " INNER JOIN pagamentooperacao ON pagamentooperacao.idpagamento = pagamento.idpagamento ";
    if(dataDe){ 
        if(dataDe != "*"){ 
            query += " WHERE pagamento.datacadastro >= '" + dataDe + " 00:00:00' "; 
            if(dataAte){ 
                if(dataAte != "*"){ 
                    query += " AND pagamento.datacadastro <= '" + dataAte + " 23:59:59' ";         
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


    pool.query(query, (err, rest) => {
        console.log(err, rest)
        pool.end()
        console.log(query)
        res.send(rest);
    })
     
});

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
    
    select += " FROM produtos WHERE id_tipoproduto='5F1FCE95-1AAC-43D8-BB0C-689ECEE69574'; ";

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
            query += " (SELECT id FROM comissao_apuracao WHERE  comissao_apuracao.nm_status IS NULL  AND  comissao_apuracao.id_entidade=op.id   ";
            query += " AND comissao_apuracao.id_entidade=op.id )) IS NULL, ";
            query += " 0,(SELECT SUM(vl_desconto) FROM comissao_desconto WHERE id_contas_pagar= ";
            query += " (SELECT id FROM comissao_apuracao WHERE  comissao_apuracao.nm_status IS NULL  AND comissao_apuracao.id_entidade=op.id   ";
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

            console.log("**********************************************************")
            console.log(query)

            

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