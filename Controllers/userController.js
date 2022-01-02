const queryPromise = require("./../queryPromise");

exports.signup = async (req, res) => {
  try {
    const { userName, email, password, PN, type, license, FavArea, birthday } =
      req.body;

    var sql = `INSERT INTO user (userName, email, password, phoneNumber, type, birthday) VALUES ('${userName}','${email}', '${password}','${PN}','${type}','${birthday}')`;

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

    if (!response[0] || response[0].password != password) {
      return res.status(400).json({
        message: "Invalid email or password",
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
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
