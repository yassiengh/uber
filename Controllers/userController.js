const queryPromise = require("./../queryPromise");

exports.signup = async (req, res) => {
  try {
    const { userName, email, password, PN, type, license, FavArea } = req.body;

    var sql = `INSERT INTO user (userName, email, password, phoneNumber, type) VALUES ('${userName}','${email}', '${password}','${PN}','${type}')`;

    await queryPromise.asyncQuery(sql, {});

    if (type === "driver") {
      sql = `SELECT * FROM user Where email='${email}'`;
      const response = await queryPromise.asyncQuery(sql, {});
      const userID = response[0].userID;
      sql =
        `INSERT INTO registrationform (userID,license,favouriteArea)` +
        `VALUES ('${userID}','${license}','${FavArea}')`;
      await queryPromise.asyncQuery(sql, {});
    }

    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({ err });
  }
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

exports.betengana = (req, res) => {
  const ID = req.body.formID;
  res.status(200).json({
    ID,
  });
};
