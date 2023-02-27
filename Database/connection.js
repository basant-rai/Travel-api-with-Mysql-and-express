const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    // db_port : process.env.DB_PORT

})

connection.getConnection(function(err) {  
    if (err) throw err;  
    console.log("Database Connected");  
  });  

module.exports = connection.promise();

