const mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient;
const  ObjectId  = mongodb.ObjectId;

let database;

async  function connectToDatabase(url) {
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017');
    database=client.db("shop");

    if(database){
        console.log("Connected to Database")
    }else{
        console.error("Failed to Connect to Database");
    }
    return  database;
}

module.exports={
    connectToDatabase,
    ObjectId
    
}