var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

// Create connection to database
var config = 
   {
     userName: 'sa', // update me
     password: 'IntSql2015@', // update me
     server: '52.89.63.119', // update me
     options: 
        {
           database: 'eCloud-homologa' //update me
           , encrypt: true
        }
   }
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) 
   {
     if (err) 
       {
          console.log(err)
       }
    else
       {
           return queryDatabase()
       }
   }
 );

function queryDatabase()
{ 
    var retorno = "";   
    console.log('Reading rows from the Table...');

    // Read all rows from table
    request = new Request(
        "SELECT TOP 100 * FROM entidade",
            function(err, rowCount, rows) 
            {
                console.log(rowCount + ' row(s) returned');
                process.exit();
            }
        );

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            return column.metadata.colName + "=" + column.value;
            //console.log("%s\t%s", column.metadata.colName, column.value);
        });
        
    });
    connection.execSql(request);
}