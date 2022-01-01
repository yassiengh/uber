const con = require("./dbConnection");

exports.asyncQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    con.query(query, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
