using MongoDB.Driver;
using System;
using System.Configuration;

namespace Mvc_MongoDB.Models
{
    public class erpcloud
    {
        public MongoDatabase Database;
        public String DataBaseName = "erpcloud";
        string conexaoMongoDB = "";

        public erpcloud()
	    {

            conexaoMongoDB = ConfigurationManager.ConnectionStrings["conexaoMongoDB"].ConnectionString;
            var cliente = new MongoClient(conexaoMongoDB);
            var server = cliente.GetServer();

            Database = server.GetDatabase(DataBaseName);
	    }

        public MongoCollection<layouts> Layout
        {
            get
            {
                var layouts = Database.GetCollection<layouts>("layouts");
                return layouts;
            }
        }
    }
}