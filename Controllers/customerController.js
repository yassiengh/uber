const queryPromise = require("./../queryPromise");

exports.requestRide = async (req, res) => {
  try {
    const userID = req.session.user[0].userID;
    const { Src, Des, NumberOfPassengers } = req.body;
    var sql = `SELECT * from requestedrides where userID = ${userID}`;
    const user = await queryPromise.asyncQuery(sql, {});
    if (user[0]) {
      return res.status(200).json({ message: "active ride already requested" });
    }
    sql =
      `INSERT INTO requestedrides (userID, src, des, NoOfPassengers)` +
      `VALUES('${userID}','${Src}','${Des}','${NumberOfPassengers}')`;
    await queryPromise.asyncQuery(sql, {});
    res.status(200).json({
      message: "Ride Requested, please wait for a driver to offer a price",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllOffers = async (req, res, next) => {
  try {
    const userID = req.session.user[0].userID;
    var sql = `SELECT RequestedRideID from requestedrides where userID = '${userID}'`;
    const requestedrideid = await queryPromise.asyncQuery(sql, {});
    sql = `SELECT * from offers where RequestedRideID = '${requestedrideid[0].RequestedRideID}'`;
    const result = await queryPromise.asyncQuery(sql, {});
    res.status(200).json({ result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.AcceptOffer = async (req, res) => {
  try {
    const offerID = req.body.offerID;
    const userID = req.session.user[0].userID;
    var sql = `SELECT * FROM offers WHERE OfferID = '${offerID}'`;
    const offerData = await queryPromise.asyncQuery(sql, {});
    sql = `DELETE FROM offers WHERE OfferID = '${offerID}'`;
    await queryPromise.asyncQuery(sql, {});
    const time = Date.now();
    sql =
      `INSERT INTO activerides (RequestedRideID,driverID,offeredPrice,offerTime,userID,acceptTime) VALUES` +
      `('${offerData[0].RequestedRideID}','${offerData[0].driverID}','${offerData[0].offeredPrice}'` +
      `,'${offerData[0].offerTime}','${userID}','${time}')`;
    await queryPromise.asyncQuery(sql, {});
    sql = `UPDATE driver SET status = 0 WHERE driverID = '${offerData[0].driverID}'`;
    await queryPromise.asyncQuery(sql, {});
    res.status(200).json({ sql });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
