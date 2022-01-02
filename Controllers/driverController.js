const queryPromise = require("./../queryPromise");

exports.getAllridesInFavArea = async (req, res) => {
  try {
    const driverID = req.session.user[0].userID;
    var sql = `SELECT favouriteArea from driver where driverID = ${driverID}`;
    const driverData = await queryPromise.asyncQuery(sql, {});
    const favArea = driverData[0].favouriteArea;
    sql = `Select * from requestedrides where Src = '${favArea}'`;
    const rides = await queryPromise.asyncQuery(sql, {});
    if (rides.length == 0) {
      return res
        .status(200)
        .json({ message: "no rides in your favourite area" });
    } else {
      res.status(200).json({ rides });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.offerPrice = async (req, res) => {
  try {
    const { offeredPrice, rideID } = req.body;
    const driverID = req.session.user[0].userID;
    var sql = `SELECT * from driver WHERE driverID = '${driverID}'`;
    const status = await queryPromise.asyncQuery(sql, {});
    if (status[0].Status == "0") {
      return res.status(200).json({
        message:
          "you are in an active trip, please finish your current trip first",
      });
    }
    const time = Date.now();
    sql =
      `INSERT  INTO offers (driverID,offeredPrice,RequestedRideID, offerTime) VALUES` +
      ` ('${req.session.user[0].userID}','${offeredPrice}','${rideID}','${time}')`;
    await queryPromise.asyncQuery(sql, {});
    res.status(200).json({ message: "Price Offered" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.Arrived = async (req, res) => {
  try {
    const driverID = req.session.user[0].userID;
    const time = Date.now();
    var sql = `UPDATE activerides SET SrcarrivalTime = '${time}' WHERE driverID = '${driverID}'`;
    await queryPromise.asyncQuery(sql, {});
    res.status(200).json({
      message: "you can start your trip now",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.finishTrip = async (req, res) => {
  try {
    //get data
    const driverInfo = req.session.user[0];
    var sql = `SELECT * FROM activerides WHERE driverID ='${driverInfo.userID}' ORDER BY ActiveRideID DESC LIMIT 1`;
    const RideInfo = await queryPromise.asyncQuery(sql, {});
    sql = `SELECT * FROM user WHERE userID = '${RideInfo[0].userID}'`;
    const customerInfo = await queryPromise.asyncQuery(sql, {});
    sql = `SELECT * FROM requestedrides WHERE RequestedRideID = '${RideInfo[0].RequestedRideID}'`;
    const response = await queryPromise.asyncQuery(sql, {});
    const Src = response[0].src;
    const Des = response[0].des;

    // write to completed rides
    sql =
      `INSERT INTO completedride (userID,driverID,Price,CustomerName,DriverName,Src,Des) VALUES` +
      ` ('${customerInfo[0].userID}','${driverInfo.userID}','${RideInfo[0].offeredPrice}','${customerInfo[0].userName}'` +
      `,'${driverInfo.userName}','${Src}','${Des}')`;
    await queryPromise.asyncQuery(sql, {});

    // get completed rides
    sql = `SELECT * FROM completedride WHERE userID = '${customerInfo[0].userID}' ORDER BY CompRideID DESC LIMIT 1`;
    const completedRideInfo = await queryPromise.asyncQuery(sql, {});

    //write to ride info
    const completedRideID = completedRideInfo[0].CompRideID;
    const time = Date.now();
    sql =
      `INSERT INTO completedrideinfo (EventName,EventTime,compRideID) VALUES` +
      ` ('Captain Offer Price','${RideInfo[0].offerTime}','${completedRideID}')`;
    await queryPromise.asyncQuery(sql, {});
    sql =
      `INSERT INTO completedrideinfo (EventName,EventTime,compRideID) VALUES` +
      ` ('User accepts Price','${RideInfo[0].acceptTime}','${completedRideID}')`;
    await queryPromise.asyncQuery(sql, {});
    sql =
      `INSERT INTO completedrideinfo (EventName,EventTime,compRideID) VALUES` +
      ` ('Captains arrival','${RideInfo[0].SrcarrivalTime}','${completedRideID}')`;
    await queryPromise.asyncQuery(sql, {});
    sql =
      `INSERT INTO completedrideinfo (EventName,EventTime,compRideID) VALUES` +
      ` ('Destination Arrival','${time}','${completedRideID}')`;
    await queryPromise.asyncQuery(sql, {});

    //update driver status,balance,area
    sql = `SELECT * FROM driver WHERE driverID = '${driverInfo.userID}'`;
    const driverProfile = await queryPromise.asyncQuery(sql);
    const balance = driverProfile[0].Balance + RideInfo[0].offeredPrice;
    sql = `UPDATE driver SET Balance = '${balance}', Status = '1', CurrentArea = '${Des}' WHERE driverID = '${driverInfo.userID}'`;

    if (RideInfo[0].confirm == 0) {
      sql = `UPDATE activerides SET confirm = '1' WHERE ActiveRideID = '${RideInfo[0].ActiveRideID}'`;
      await queryPromise.asyncQuery(sql, {});
    } else {
      sql = `DELETE FROM activerides WHERE ActiveRideID = '${RideInfo[0].ActiveRideID}'`;
      await queryPromise.asyncQuery(sql, {});
    }

    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
