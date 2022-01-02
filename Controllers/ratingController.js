const queryPromise = require("./../queryPromise");

exports.rate = async (req, res) => {
  try {
    const userID = req.session.user[0].userID;
    const { ratedID, rating } = req.body;
    var sql = `INSERT INTO ratings (userID,ratedID,rating) VALUES ('${userID}','${ratedID}','${rating}')`;
    await queryPromise.asyncQuery(sql, {});

    sql = `SELECT * from user WHERE userID = '${ratedID}'`;
    const ratedData = await queryPromise.asyncQuery(sql, {});
    const TotalRating = ratedData[0].rating;
    sql = `SELECT COUNT(ratedID) as count FROM ratings WHERE ratedID = '${ratedID}'`;
    var count = await queryPromise.asyncQuery(sql, {});
    count = JSON.parse(JSON.stringify(count));
    count = count[0].count;

    const newRating = ((count - 1) * TotalRating + rating) / count;
    sql = `UPDATE user SET rating ='${newRating}' WHERE userID = '${ratedID}'`;
    console.log(sql);
    await queryPromise.asyncQuery(sql, {});
    res.status(200).json({ message: "thanks for leaving feedback" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
