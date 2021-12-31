const con = require("./../dbConnection");

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql = `INSERT INTO user (email, password) VALUES ('${email}', '${password}')`;

  con.query(sql, function (err) {
    if (err) throw err;
    console.log("1 record inserted");
  });

  res.status(200).json({
    status: "success",
    data: {
      result: req.body,
    },
  });

  next();
};
