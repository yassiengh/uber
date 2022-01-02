const { json } = require("body-parser");
const queryPromise = require("./../queryPromise");

exports.AddDiscountForArea = async (req, res, next) => {
  try {
    const area = req.body.area;
    var sql = `INSERT INTO discounts (Area) VALUES ('${area}')`;
    await queryPromise.asyncQuery(sql, {});
    res.status(200).json({
      message: area + " added to discounted areas",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removeDiscountForArea = async (req, res, next) => {
  try {
    const area = req.body.area;
    var sql = `DELETE FROM discounts WHERE Area = '${area}'`;
    await queryPromise.asyncQuery(sql, {});
    res.status(200).json({
      message: area + " removed from discounted areas",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.AddHoliday = async (req, res) => {
  try {
    const date = req.body.date;
    var newdate = date.split("-");
    if (newdate[0] == "30") {
      newdate[0] = "1";
      if (newdate[1] == "12") {
        newdate[1] = "1";
        newdate[2] = parseInt(newdate[2]) + 1;
      } else {
        newdate[1] = parseInt(newdate[1]) + 1;
      }
    } else {
      newdate[0] = parseInt(newdate[0]) + 1;
    }
    newdate = newdate[0] + "-" + newdate[1] + "-" + newdate[2];

    const sql = ` INSERT INTO discounts (StartDate, EndDate) VALUES('${date}','${newdate}')`;
    await queryPromise.asyncQuery(sql, {});
    res.status(200).json({ message: date + " added as a holiday" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removeHoliday = async (req, res) => {
  try {
    const date = req.body.date;
    const sql = `delete from discounts where StartDate = '${date}'`;
    await queryPromise.asyncQuery(sql, {});
    res.status(200).json({
      message: date + " holiday deleted",
    });
  } catch (err) {}
};
