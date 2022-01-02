const { json } = require("body-parser");
const queryPromise = require("./../queryPromise");

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

exports.getRideInfo = async (req, res) => {
  try {
    const { ComprideID, EventName } = req.body;

    var sql = `SELECT * FROM completedride WHERE CompRideID = '${ComprideID}'`;
    const result = await queryPromise.asyncQuery(sql, {});
    const CaptainName = result[0].DriverName;
    const Price = result[0].Price;
    var eventData;
    if (EventName == "Captain Offer Price") {
      sql = `SELECT * FROM completedrideinfo WHERE EventName = '${EventName}' AND RideInfoID=${result[0].CompRideID}`;
      eventData = await queryPromise.asyncQuery(sql, {});
      eventTime = eventData[0].EventTime;
      eventData = { EventName, eventTime, CaptainName, Price };
    } else if (EventName == "User accepts Price") {
    } else if (EventName == "Captains arrival") {
    } else if (EventName == "Destination Arrival") {
    } else {
      return res.status(400).json({ message: "wrong event name" });
    }
    res.status(200).json({ eventData });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
