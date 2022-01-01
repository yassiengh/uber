const con = require("./../dbConnection");
const queryPromise = require("./../queryPromise");

exports.signup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql = `INSERT INTO user (email, password) VALUES ('${email}', '${password}')`;

  con.query(sql, function (err) {
    if (err) throw err;
    console.log("1 record inserted");
  });

  res.status(200).json({
    status: "success",
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "no email or password entered",
      });
    }

    const sql = `SELECT * FROM user Where email='${email}'`;
    let response = await queryPromise.asyncQuery(sql, {});

    if (!response || response[0].password != password) {
      console.log(response, password);
      return res.status(400).json({
        message: "Invalid password",
      });
    }
    delete req.session.user;
    req.session.user = response;

    res.status(200).json({
      status: "success",
      data: {
        response: response[0],
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.acceptOffer = async (req, res) => {
  const price = req.body.price;
  const eventName = "Accept Offer";
  const userName = req.session.user[0].userName;

  const sql = `INSERT INTO rideData (price,eventName,userName) Values ('${price}','${eventName}',${userName})`;

  let response = await queryPromise.asyncQuery(sql, {});

  res.status(200).json({
    status: "success",
    data: { sql },
  });
};
