const _ = require('lodash')
const database = require('./database')
const server = require('../config/server')
const express = require('express')
const dados = require('./connections')
var sql = require("mssql");
const general = require('./general')
const ObjectID = require('mongodb').ObjectID
const router = express.Router()
server.use('/api', router)
// config for your database
var config = {user: 'sa', password: 'IntSql2015@', server: '52.89.63.119',  database: 'eCloud-homologa'};
//var config = {user: 'sa', password: 'IntSql2015@', server: '172.31.8.216',  database: 'eCloud-homologa'};


router.route('/listall/:id').get(function(req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/erpcloud";
    var id = req.param('id');
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


router.route('/findid2/:id/:layoutid').get(function(req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/erpcloud";
    var id = req.param('id');
    var layoutid = req.param('layoutid');
    var select = ""; //'select Id, nm_razaosocial, nr_codigo, dt_cadastro, nm_nomefantasia, sn_pessoafisica, nm_cpf, nm_cnpj FROM entidade'

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("layouts").find({"layoutID": layoutid}, { _id: false }).toArray(function(err, result) {
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
            var retorno = [];
            var retornoFinal = {};
            var arraydataJSON = [];
            var tableorder = [];
            var table;
            var field;
            if (recordset.recordsets) {
                if (recordset.recordsets.length > 0) {
                    var array = recordset.recordsets[0];
                    
                    var arrayindex = [];
                    row = null;
                    var j = 0;
                    for (let i = 0; i < array.length; i++) {
                        var arraytable = [];
                        
                        var row = null;
                        for (var key in array[i]) {
                            var keyvalue = "";
                            
                            var keyfield = key.split('.')
                            table = keyfield[0];
                            field = keyfield[1];
                            keyvalue = key + ":" + array[i][key];

                            if (arraytable.indexOf(table) == -1 ) { 
                                if(j == 0){
                                    tableorder.push(table);
                                }

                                if (row) {
                                    if(arraydataJSON.indexOf(JSON.stringify(row)) == -1){
                                        var arrayRow = [];
                                        arrayRow.push(row);
                                        retorno.push(row)
                                        arraydataJSON.push(JSON.stringify(row));
                                    }                                    
                                }

                                arraytable.push(table);                     
                                row = {};
                                row[key] = array[i][key];
                            }else{
                                row[key] = array[i][key];
                            }

                            j++
                        }
                        if (row) {
                            if(arraydataJSON.indexOf(JSON.stringify(row)) == -1){
                                var arrayRow = [];
                                arrayRow.push(row);
                                retorno.push(row)
                                arraydataJSON.push(JSON.stringify(row));
                            }                                    
                        }
                    }                    
                }
            }
           

            retorno.sort(compare);
            //retorno = [];
            //retorno.push(retornoFinal);
            // send records as a response
            res.send(retorno)            
        });
    });    
});
function compare(a,b) {
    var c;
    var d;

    for (var keya in a) {
        for (var keyb in b) {
            console.log(keya)
            break;
        }
        break;
    }
    
    
    if (keya < keyb)
       return -1;
    if (keya > keyb)
      return 1;
    return 0;
  }
router.route('/editGridLine/:id/:filtro').get(function(req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/erpcloud";
    var id = req.param('id');
    var filtro = req.param('filtro');
    var select = ""; //'select Id, nm_razaosocial, nr_codigo, dt_cadastro, nm_nomefantasia, sn_pessoafisica, nm_cpf, nm_cnpj FROM entidade'

    id = id.toUpperCase();
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

        console.log(select)
         // query to the database and get the records
        request.query(select, function (err, recordset) {            
            if (err) {
                console.log(err)
                res.send(err)
            }
            // send records as a response 
            res.send(recordset)            
        });
    });    
});

function incremento(submit, callback){
	var arrayRetorno = [];
    var countFor = 0;

    sql.close();
    sql.connect(config, function (err) {  
        for (var index = 0; index < submit.length; index++) {
            var table;
            var field;
            var indexIncrement = -1;
            var fieldincrement = "";

            for (var key in submit[index]) {
                indexIncrement = key.indexOf("_INCREMENT");
                
                if (indexIncrement >= 0) {
                    console.log(key)
                    fieldincrement = key;
                    break;
                }
            }
            
            field = fieldincrement.replace("_INCREMENT","");
            table = submit[index]["TABLE"];
      
            var select = "SELECT nr_incremento, nm_campo FROM incremento WHERE nm_tabela = '" + table + "' AND nm_campo='" + field + "'"
            console.log(select)
        
            console.log("for = " + index);

            request = new sql.Request();

            console.log("Ok" + table)
            console.log("OKKK " +  field)
            
            request.query(select, function (err, recordset) {	
                if (err) console.log(err)
                
                console.log("recordSET - ")
                console.log(recordset)
                if (recordset) {
                    if (recordset.recordset) {
                        arrayRetorno.push(recordset.recordset[0]);
                    }else{
                        arrayRetorno.push(null);
                    } 
                }else{
                    arrayRetorno.push(null);
                }
                countFor += 1;
                
                if(submit.length == countFor){
                    callback(arrayRetorno, submit); 						
                }             
            
            });     
        }
    });
}

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

    var guid = general.guid(); 
    var countfor = 0;
    var arrayretorno = [];
    var retorno = "["
    incremento(submit, function(resultado, submit){
        sql.close()
        sql.connect(config).then(function() {
        for (var index = 0; index < submit.length; index++) {
            
            if (submit[index]["id"] == "" || !submit[index]["id"]) {
                    
                var numberincrement;
                var updateincrement = ""

                console.log("retorno ------  ")
                console.log(resultado)

                if(resultado){
                    if (resultado.length > 0) {
                        if (resultado[index] != null) {
                            if(resultado[index].nr_incremento){ 
                                                                            
                                submit[index][resultado[index].nm_campo + "_INCREMENT"] = parseInt(resultado[index].nr_incremento) + 1
                                numberincrement = parseInt(resultado[index].nr_incremento) + 1 
                                updateincrement = "UPDATE incremento SET nr_incremento=" + numberincrement + " WHERE nm_tabela='" + submit[index]["TABLE"] + "' AND nm_campo='" + resultado[index].nm_campo + "'"
                            }
                        }                        
                    }                    
                }
                
                insertOrUpdate = createInsert(submit, index, guid)
                insertOrUpdate += updateincrement;
                console.log(insertOrUpdate)
                
                    request = new sql.Request();
                    request.query(insertOrUpdate).then(function(recordset) {
                        console.log('Recordset: ' + recordset);
                        console.log('Affected: ' + request.rowsAffected);

                        //retorno = '{ "status": "success", "id": "' + guid + '" }'
                        if (countfor > 0) {
                            retorno += ",";
                        }

                        if (resultado[countfor]) {
                            retorno += '{ "status": "success", "id": "' + guid + '", "increment": "' + numberincrement + '", "incrementfield": "' + submit[countfor]["TABLE"] + "." + resultado[countfor].nm_campo.replace("_INCREMENT","") + '"}'
                        }else{
                            retorno += '{ "status": "success", "id": "' + guid + '" }'
                        }

                        //arrayretorno.push(retorno);
                        countfor +=1;
                        console.log("countfor == " + countfor + " --- submit.length==" + submit.length)
                        console.log(submit.length == countfor);
                        if (submit.length == (countfor)) {
                            retorno += "]"
                            var obj = JSON.parse(retorno)
                            //console.log("arrayretorno" + obj)
                            res.send(obj)
                        }
                        
                    }).catch(function(err) {
                        console.log('Request error: ' + err);
                        var retorno = '{ "status": "error", "message": "' + err + '" }'
                        
                        arrayretorno.push(retorno);
                        countfor +=1;
                        console.log("countfor == " + countfor + " --- submit.length==" + submit.length)
                        if (submit.length == countfor) {
                            var obj = JSON.parse(retorno)
                            res.send(obj)
                        }
                    });
                
                
            }else{
                guid = submit[index]["id"];
                insertOrUpdate = createUpdate(submit, index)             
           
                request = new sql.Request();
                request.query(insertOrUpdate).then(function(recordset) {
                    console.log('Recordset: ' + recordset);
                    console.log('Affected: ' + request.rowsAffected);
                    var retorno = '{ "status": "success", "id": "' + guid + '" }'                    
                    arrayretorno.push(retorno);
                    countfor +=1;
                    console.log("countfor == " + countfor + " --- submit.length==" + submit.length)
                    
                    if (submit.length == countfor) {
                        
                        var obj = JSON.parse(arrayretorno)
                        res.send(obj)
                    }
                }).catch(function(err) {
                    console.log('Request error: ' + err);
                    var retorno = '{ "status": "error", "message": "' + err + '" }'
                    arrayretorno.push(retorno);
                    arrayretorno.push(arrayretorno);
                    countfor +=1;
                    console.log("countfor == " + countfor + " --- submit.length==" + submit.length)
                    if (submit.length == countfor) {
                        var obj = JSON.parse(arrayretorno)
                        res.send(obj)
                    }
                });
                
            }
        }  
      
    }).catch(function(err) {
        if (err) {
            console.log('SQL Connection Error: ' + err);
            var retorno = '{ "status": "error", "message": "' + err + '" }'
            
            arrayretorno.push(retorno);
            countfor +=1;
                console.log("countfor == " + countfor + " --- submit.length==" + submit.length)
            if (submit.length == countfor) {
                var obj = JSON.parse(arrayretorno)
                res.send(obj)
            }
        }
    }); 
})
})

function createInsert(submit, index, guid){
    var insertOrUpdate = ""
    var ind = 0;
    var table = "";    
    
    var sqlfields = ""
    var sqlvalues = ""         
        
    ind = 0;
        
    sqlfields = "( "
    sqlvalues = " VALUES( ";
console.log("teste - " + index) 
    for (var key in submit[index]) { 
        
        if (submit[index][key]) {
            var valor = String(submit[index][key]);
            if (valor.includes("'") >= 0) {
                submit[index][key] = valor.replace("'","")
            }
        }
        
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
                        var dts = submit[index][key].split('/');
                        if (dts.length > 0) {
                            submit[index][key] = dts[1] + "/" + dts[0] + "/" + dts[2];
                        }
                        submit[index][key] = "'" + submit[index][key] + "'"
                    }

                    break;
                case "vl":
                    if (submit[index][key] == "") {
                        submit[index][key] = "0"
                    }
                    
                    var decimal = submit[index][key].indexOf(','); //1.000,00  ou 1,000.00
                    var unidade = submit[index][key].indexOf('.');
                    
                    if (unidade < decimal) {
                        submit[index][key] = submit[index][key].replace(".","").replace(",",".");
                    }else{
                        submit[index][key] = submit[index][key].replace(",","");
                    }

                    break;
                default:
                    break;
            }


            if (ind == 0) {
                sqlvalues += "" + submit[index][key] + " "
                if (key.includes("_INCREMENT")) {
                    key = key.replace("_INCREMENT","")
                 }
                sqlfields += key                    
            }else{
                sqlvalues = sqlvalues + ", " + submit[index][key] + " "
                if (key.includes("_INCREMENT")) {
                    key = key.replace("_INCREMENT","")
                }
                sqlfields = sqlfields + ", " + key
            }

            ind += 1
        }      
        
    }
    
    
    sqlfields += ") "
    sqlvalues += ") "

    insertOrUpdate += " INSERT INTO " + table + " ";
    insertOrUpdate +=  sqlfields + " " + sqlvalues

    //}
console.log(insertOrUpdate)
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
                        //if (submit[index][key].length == 10) {
                        //    submit[index][key] = submit[index][key] + " 00:00:00"
                        //}
                        var dtsplit = submit[index][key].split("/")
                        submit[index][key] = dtsplit[1] + "/" + dtsplit[0] + "/" + dtsplit[2]

                        submit[index][key] = "'" + submit[index][key] + "'"
                    }                  
                    break;
                case "vl":
                    if (submit[index][key] == "") {
                        submit[index][key] = "0"
                    }
                    
                    var decimal = submit[index][key].indexOf(','); //1.000,00  ou 1,000.00
                    var unidade = submit[index][key].indexOf('.');
                    
                    if (unidade < decimal) {
                        submit[index][key] = submit[index][key].replace(".","").replace(",",".");
                    }else{
                        submit[index][key] = submit[index][key].replace(",","");
                    }
            
                    break;
                default:
                    break;
            }


            if (ind == 0) {                                
                sqlvalues += key.replace("_INCREMENT","") + "=" + submit[index][key] + " "
            }else{
                sqlvalues += ", " + key.replace("_INCREMENT","") + "=" + submit[index][key] + " "
            }

            ind += 1
        }      
        
    }
    
    update = "UPDATE " + table + " SET " + sqlvalues + " WHERE id=" + id;
    console.log(update)
    return update;

}

router.route('/RenderAutoComplete/:filter/:controlid').get(function(req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/erpcloud";
    var id = req.param('filter');
    var controlid = req.param('controlid');
    var select = ""; //'select Id, nm_razaosocial, nr_codigo, dt_cadastro, nm_nomefantasia, sn_pessoafisica, nm_cpf, nm_cnpj FROM entidade'

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      
      db.collection("controls").find({"controlID": controlid}, { _id: false }).toArray(function(err, result) {
       
        if (err) throw err;
        if (result) {
            if (result.length > 0) {
                select = result[0].autocompleteChange;
            }
        }
       
        db.close();
      });
    });

    if (sql) {
        sql.close()
        // connect to your database
        sql.connect(config, function (err) {    
            if (err) console.log(err);

            // create Request object
            var request = new sql.Request();  
            if (select) {            
                select = select.replace("{{id}}", id)
            }    
            console.log(select)
            // query to the database and get the records
            request.query(select, function (err, recordset) {            
                if (err) console.log(err)
            
                if (recordset) {
                    if (recordset.recordsets) {
                        if (recordset.recordsets.length > 0) {
                            // send records as a response
                            res.send(recordset.recordsets[0]);
                        }
                    }
                }           
            });
        });    
    }

    

});


router.route('/DeleteData/:containerID/:id').get(function(req, res) {
    var id = req.param('id');
    var containerID = req.param('containerID');

    containerID = containerID.toUpperCase();
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/erpcloud";

    var deletedata = "";
    
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("containers").find({"containerID": containerID}, { _id: false }).toArray(function(err, result) {
        if (err) throw err;
        if (result) {            
            if (result.length > 0) {
                deletedata = result[0].deletedata;              

        if (deletedata) {            
            deletedata = deletedata.split("{{id}}").join(id)
        } 
        console.log(deletedata)
        
        if (deletedata == "") {
            var ret = '{ "status": "err", "message": "Script para deletar não foi inserido no banco"}'
            var obje = JSON.parse(ret)
            res.send(obje)
        }

        sql.close()
        
        sql.connect(config).then(function() {
                request = new sql.Request();
                request.query(deletedata).then(function(recordset) {
                    var retorno = '{ "status": "success", "id": "' + id + '" }'
                    var obj = JSON.parse(retorno)
                    res.send(obj)
                }).catch(function(err) {                    
                    //var retorno = "{ 'status': 'error', 'message': '" + err + "'}"
                    res.send(err)
                });
        }).catch(function(err) {
            if (err) {
            console.log('SQL Connection Error: ' + err);
            var obj = JSON.parse(err)
            res.send(obj)
            }
        });
        
    }
    }

    db.close();
    });
    });

});


router.route('/containergrid/:id/:filtro').get(function(req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/erpcloud";
    var id = req.param('id');
    var filtro = req.param('filtro');
    var select = ""; //'select Id, nm_razaosocial, nr_codigo, dt_cadastro, nm_nomefantasia, sn_pessoafisica, nm_cpf, nm_cnpj FROM entidade'
    id = id.toUpperCase();

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("containers").find({"containerID": id}, { _id: false }).toArray(function(err, result) {
        if (err) throw err;
        if (result) {
            if (result.length > 0) {
                select = result[0].fillgrid;                                
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
        console.log(select)
         // query to the database and get the records
        request.query(select, function (err, recordset) {            
            if (err) {
                console.log(err)
                res.send(err)
            }
            // send records as a response 
            res.send(recordset)            
        });
    });    
});


function refreshIncrement(table, field){
    sql = "SELECT nr_incremento FROM incremento WHERE nm_tabela = '" + table + "' AND nm_campo='" + field + "'"
    var retorno = select(sql);
    if (retorno) {
        if (retorno.recordsets.length > 0) {
            return retorno.recordsets[0]
        }
    }
    return retorno;
}

function select(select){
      
        
        return null;
}

router.route('/teste').get(function(req, res) {
    var Client = require('node-rest-client').Client;
    
   // direct way 
   var client = new Client();
    
    
   //client.get("http://localhost:2444/api/compiler/CsharpCompiler?EnterpriseID=f1495bcf-9258-4245-8edf-d0fac225412d&Class=CadCliente&Function=ConsultaCNPJ&ValueParameters[0]=07.361.429/0001-53",
   //    function (data, response) {
        var objectId = new ObjectID();
        console.log(objectId)
           // parsed response body as js object 
           res.send(objectId)
           // raw response 
   //        console.log(response);
   //    });
});



router.route('/layout/:id').get(function(req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/erpcloud";
    var id = req.param('id');

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("layouts").find({"layoutID": id}, { _id: false }).toArray(function(err, result) {
        if (err) throw err;
        
        db.close();
        res.send(result)  
      });
    });

});

module.exports = database






