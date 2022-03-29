const pg = require("pg");
const DATABASE_URL = require("../config").DATABASEURL;

let connection;
exports.connect = function () {
  var connectionString = DATABASE_URL;
  connection = new pg.Pool({
    connectionString,
    max: 5,
  });
  if (connection) {
    console.log("Database connected");
  }
  return connection.connect().catch(function (error) {
    connection = null;
    throw error;
  });
};

exports.query = function (text, params) {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error("Not connected to database"));//if connection is undefined reject the query
    }
    const start = Date.now();
    connection.query(text, params, function (error, result) {
      const duration = Date.now() - start;
      console.log("executed query", {
        text,
        duration,
      });
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};