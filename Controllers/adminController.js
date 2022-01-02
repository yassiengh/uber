const queryPromise = require("./../queryPromise");
exports.AddDiscountForArea = (req, res, next) => {
  const area = req.body.area;
};

exports.GetAllForms = async (req, res) => {
  try {
    const sql = "SELECT * FROM registrationform";
    const response = await queryPromise.asyncQuery(sql, {});
    res.status(200).json({
      response,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.ApproveForm = async (req, res) => {
  try {
    const formID = req.body.formID;
    var sql = `SELECT * FROM registrationform WHERE userID = ${formID}`;
    const formData = await queryPromise.asyncQuery(sql, {});
    if (!formData[0] || !formID) {
      return res.status(400).json({ message: "invalid data" });
    }
    sql = `DELETE FROM registrationform WHERE userID = ${formID}`;
    await queryPromise.asyncQuery(sql, {});
    // sql = `SELECT * FROM user WHERE userID = ${formID}`;
    // const userData = await queryPromise.asyncQuery(sql, {});
    sql =
      `INSERT INTO driver (driverID,favouriteArea,license)` +
      `VALUES ('${formID}','${formData[0].favouriteArea}',${formData[0].license})`;
    await queryPromise.asyncQuery(sql, {});
    res.status(200).json({
      message: "driver approved",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
