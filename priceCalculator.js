const queryPromise = require("./queryPromise");
const customerController = require("./Controllers/customerController");
exports.calcPrice = async (req, res, price) => {
  try {
    const userInfo = req.session.user[0];
    var fair = price;

    // check if it is the user's birthday
    var BD = userInfo.birthday;
    BD = new Date(BD);
    BD = BD.getTime();

    var birthday = new Date(BD);
    var birthdayD = String(birthday.getDate()).padStart(2, "0");
    var birthdayM = String(birthday.getMonth() + 1).padStart(2, "0");

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");

    if (birthdayD === dd && birthdayM === mm) {
      console.log("discount");
      fair = fair * 0.9;
    }

    //check if its users first trip
    var sql = `SELECT * FROM completedrides WHERE userID=${userInfo.userID}`;
    const firstRide = await queryPromise.asyncQuery(sql, {});
    if (!firstRide[0]) {
      fair = fair * 0.9;
    }

    // check discounts for Destinatation

    sql = `SELECT * FROM requestedrides WHERE userID = ${userInfo.userID} ORDER BY RequestRideID DESC LIMIT 1`;
    const requestedRide = await queryPromise.asyncQuery(sql, {});
    const Des = requestedRide[0].des;
    sql = `SELECT * FROM discounts WHERE Area='${Des}'`;
    const Area = await queryPromise.asyncQuery(sql, {});
    if (Area[0]) {
      fair = fair * 0.9;
    }

    // check if ride can have more than 1 passenger
    if (requestedRide[0].NoOfPassengers > 1) {
      fair = fair * 0.95;
    }

    // check if ride on public holiday
    var dates = new Date();
    sql = `SELECT * FROM discounts WHERE StartDate IS NOT NULL`;
    const holidays = await queryPromise.asyncQuery(sql, {});
    for (let i = 0; i < holidays.length; i++) {
      dates = new Date(holidays[i].StartDate);
      var holidayD = String(dates.getDate()).padStart(2, "0");
      var holidayM = String(dates.getMonth() + 1).padStart(2, "0");
      if (holidayD === dd && holidayM === mm) {
        fair = fair * 0.95;
        break;
      }
    }

    customerController.finalizeTripInfo(req, res, fair);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
