const queryPromise = require("./../queryPromise");
const priceCalculator = require("./../priceCalculator");

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
    sql = `DELETE FROM offers WHERE RequestedRideID = '${offerData[0].RequestedRideID}'`;
    await queryPromise.asyncQuery(sql, {});
    const time = Date.now();
    sql =
      `INSERT INTO activerides (RequestedRideID,driverID,offeredPrice,offerTime,userID,acceptTime) VALUES` +
      `('${offerData[0].RequestedRideID}','${offerData[0].driverID}','${offerData[0].offeredPrice}'` +
      `,'${offerData[0].offerTime}','${userID}','${time}')`;
    await queryPromise.asyncQuery(sql, {});
    sql = `UPDATE driver SET status = 0 WHERE driverID = '${offerData[0].driverID}'`;
    await queryPromise.asyncQuery(sql, {});
    res
      .status(200)
      .json({ message: "offer accepted, your driver is on his way" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.finishTrip = async (req, res) => {
  try {
    const userInfo = req.session.user[0];
    var sql = `SELECT * FROM activerides WHERE userID = '${userInfo.userID}' ORDER BY ActiveRideID DESC LIMIT 1`;
    const activeRideInfo = await queryPromise.asyncQuery(sql, {});
    const price = activeRideInfo[0].offeredPrice;

    priceCalculator.calcPrice(req, res, price);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.finalizeTripInfo = async (req, res, fair) => {
  try {
    var sql = `SELECT * FROM activerides WHERE userID ='${req.session.user[0].userID}' ORDER BY ActiveRideID DESC LIMIT 1`;
    const RideInfo = await queryPromise.asyncQuery(sql, {});

    if (RideInfo[0].confirm == 0) {
      sql = `UPDATE activerides SET confirm = '1' WHERE ActiveRideID = '${RideInfo[0].ActiveRideID}'`;
      await queryPromise.asyncQuery(sql, {});
    } else {
      sql = `DELETE FROM activerides WHERE ActiveRideID = '${RideInfo[0].ActiveRideID}'`;
      await queryPromise.asyncQuery(sql, {});
      sql = `DELETE FROM requestedrides WHERE RequestedRideID = '${RideInfo[0].RequestedRideID}'`;
      await queryPromise.asyncQuery(sql, {});
    }

    res.status(200).json({});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
