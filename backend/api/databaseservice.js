const _ = require('lodash')
const database = require('./database')
const server = require('../config/server')
const express = require('express')
const dados = require('./connections')
var sql = require("mssql");
const general = require('./general')

const router = express.Router()
server.use('/api', router)
// config for your database
//var config = {user: 'sa', password: 'IntSql2015@', server: '52.89.63.119',  database: 'eCloud-homologa'};
var config = {user: 'sa', password: '1nt3l3ct@', server: '54.149.163.193',  database: 'eCloud-roadmap'};

router.route('/listall/:id').get(function(req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/erpcloud";
    var id = "d82d11c8-ea16-47c7-be04-10423467f04e"; //req.param('id');
    var select = ""; //'select Id, nm_razaosocial, nr_codigo, dt_cadastro, nm_nomefantasia, sn_pessoafisica, nm_cpf, nm_cnpj FROM entidade'

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("layouts").find({"layoutID": id}, { _id: false }).toArray(function(err, result) {
        if (err) throw err;
        if (result) {
            if (result.length > 0) {
                select = result[0].listall;
            }
        }
        
        db.close();
      });
    });

    sql.close()
    // connect to your database
    sql.connect(config, function (err) {    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();       

        // query to the database and get the records
        request.query(select, function (err, recordset) {            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset)            
        });
    });    

});

router.route('/findid/:id').get(function(req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/erpcloud";
    var id = "d82d11c8-ea16-47c7-be04-10423467f04e"; //req.param('id');
    var select = ""; //'select Id, nm_razaosocial, nr_codigo, dt_cadastro, nm_nomefantasia, sn_pessoafisica, nm_cpf, nm_cnpj FROM entidade'

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("layouts").find({"layoutID": id}, { _id: false }).toArray(function(err, result) {
        if (err) throw err;
        if (result) {
            if (result.length > 0) {
                select = result[0].finddata;                                
            }
        }
        
        db.close();
      });
    });

    sql.close()

    // connect to your database
    sql.connect(config, function (err) {    
        if (err) console.log(err);
        
        var id = req.param('id');

        // create Request object
        var request = new sql.Request();
        
        select = select.replace("{{id}}", id)
         // query to the database and get the records
        request.query(select, function (err, recordset) {            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset)            
        });
    });    
});

router.route('/editGridLine/:id/:filtro').get(function(req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/erpcloud";
    var id = req.param('id');
    var filtro = req.param('filtro');
    var select = ""; //'select Id, nm_razaosocial, nr_codigo, dt_cadastro, nm_nomefantasia, sn_pessoafisica, nm_cpf, nm_cnpj FROM entidade'

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("containers").find({"containerID": id}, { _id: false }).toArray(function(err, result) {
        if (err) throw err;
        if (result) {
            if (result.length > 0) {
                select = result[0].findgriddata;                                
            }
        }
        
        db.close();
      });
    });

    sql.close()

    // connect to your database
    sql.connect(config, function (err) {    
        if (err) console.log(err);
        
        // create Request object
        var request = new sql.Request();
        
        select = select.replace("{{id}}", filtro)
         // query to the database and get the records
        request.query(select, function (err, recordset) {            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset)            
        });
    });    
});



router.route('/save').post(function(req, res) {   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    var update = "";
    var retorno = "0"
    var setrecord;
    var error = "";

    var submit = req.body;
    var insertOrUpdate = ""
    var request = new sql.Request();
    sql.close()

    var guid = general.guid(); 
    
    for (var index = 0; index < submit.length; index++) {
        if (submit[index]["id"] == "") {
            insertOrUpdate = createInsert(submit, index, guid)
        }else{
            guid = submit[index]["id"];
            insertOrUpdate = createUpdate(submit, index)
        }
    }

    console.log(insertOrUpdate)
        sql.close()

        sql.connect(config).then(function() {
                request = new sql.Request();
                request.query(insertOrUpdate).then(function(recordset) {
                console.log('Recordset: ' + recordset);
                console.log('Affected: ' + request.rowsAffected);
                var retorno = '{ "status": "success", "id": "' + guid + '" }'
                var obj = JSON.parse(retorno)
                res.send(obj)
            }).catch(function(err) {
                console.log('Request error: ' + err);
                var retorno = '{ "status": "error", "message": "' + err + '" }'
                var obj = JSON.parse(retorno)
                res.send(obj)
            });
        }).catch(function(err) {
            if (err) {
            console.log('SQL Connection Error: ' + err);
            var retorno = '{ "status": "error", "message": "' + err + '" }'
            var obj = JSON.parse(retorno)
            res.send(obj)
            }
        }); 
    
});

function createInsert(submit, index, guid){
    var insertOrUpdate = ""
    var ind = 0;
    var table = "";    
    
    var sqlfields = ""
    var sqlvalues = ""         
        
    ind = 0;
        
    sqlfields = "( "
    sqlvalues = " VALUES( "

    for (var key in submit[index]) {            
        if (key === "TABLE") {
            table = submit[index][key]
        }else{
            if (key == "id" && submit[index][key] == "") {
                submit[index][key] = "" + guid + ""
            }
            
            var prefixo = key[0] + key[1];

            switch (prefixo) {
                case "id":
                    if (submit[index][key] == "") {
                        submit[index][key] = "NULL"
                    }else{
                        submit[index][key] = "'" + submit[index][key] + "'"
                    }
                    break;
                case "sn":
                    if (submit[index][key] == "" || submit[index][key] == "false") {
                        submit[index][key] = "0"
                    }else{
                        submit[index][key] = "1"
                    }
                    break;
                case "nm":
                    submit[index][key] = "'" + submit[index][key] + "'"                   
                    break;
                case "dt":
                    if (submit[index][key] == "" || submit[index][key] == "01/01/1900") {
                        submit[index][key] = "NULL"
                    }else{
                        submit[index][key] = "'" + submit[index][key] + "'"
                    }                     
                    break;
                default:
                    break;
            }


            if (ind == 0) {
                sqlfields += key                    
                sqlvalues += "" + submit[index][key] + " "
            }else{
                sqlfields = sqlfields + ", " + key
                sqlvalues = sqlvalues + ", " + submit[index][key] + " "
            }

            ind += 1
        }      
        
    }
    
    
    sqlfields += ") "
    sqlvalues += ") "

    insertOrUpdate += " INSERT INTO " + table
    insertOrUpdate +=  sqlfields + " " + sqlvalues

    //}

    return insertOrUpdate;
}

function createUpdate(submit, index){
    var update = "OK";
    var ind = 0;
    var table = "";        
    var id = "";
    var sqlvalues = ""

    for (var key in submit[index]) {            
        if (key === "TABLE" || key === "id") {
            if (key === "TABLE") {
                table = submit[index][key]
            }else{
                id = "'" + submit[index][key] + "'"
            }            
        }else{            
            var prefixo = key[0] + key[1];
            console.log(prefixo)
            switch (prefixo) {
                case "id":
                    if (submit[index][key] == "" || submit[index][key] == undefined || submit[index][key] == "undefined") {
                        submit[index][key] = "NULL"
                    }else{
                        submit[index][key] = "'" + submit[index][key] + "'"
                    }
                    break;
                case "sn":
                    if (submit[index][key] == "" || submit[index][key] == "false") {
                        submit[index][key] = "0"
                    }else{
                        submit[index][key] = "1"
                    }
                    break;
                case "nm":
                    submit[index][key] = "'" + submit[index][key] + "'"                   
                    break;
                case "dt":
                    if (submit[index][key] == "" || submit[index][key] == "01/01/1900") {
                        submit[index][key] = "NULL"
                    }else{
                        submit[index][key] = "'" + submit[index][key] + "'"
                    }                  
                    break;
                default:
                    break;
            }


            if (ind == 0) {                  
                sqlvalues += key + "=" + submit[index][key] + " "
            }else{
                sqlvalues += ", " + key + "=" + submit[index][key] + " "
            }

            ind += 1
        }      
        
    }
    
    update = "UPDATE " + table + " SET " + sqlvalues + " WHERE id=" + id;
    
    return update;

}


router.route('/teste').get(function(req, res) {
    var Client = require('node-rest-client').Client;
    
   // direct way 
   var client = new Client();
    
   var args = {
       path: { "id": 120, "arg1": "hello", "arg2": "world" },	
       headers: { "test-header": "client-api" }
   };
    
   client.get("http://localhost:2444/api/compiler/CsharpCompiler?EnterpriseID=f1495bcf-9258-4245-8edf-d0fac225412d&Class=CadCliente&Function=ConsultaCNPJ&ValueParameters[0]=07.361.429/0001-53",
       function (data, response) {
           // parsed response body as js object 
           res.send(data)
           // raw response 
           console.log(response);
       });
});

module.exports = database






