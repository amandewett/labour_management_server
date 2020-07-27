let express = require("express");
let router = express.Router();
let auth = require("../middleware/auth");

router.post("/add", auth.hasRole(), async function (req, res) {
  let userId = req.user.user_id;
  let workerName = req.body.name;
  let workerWage = req.body.wage;

  try {
    let workerPayload = {
      user_id: userId,
      worker_name: workerName,
      worker_wage: workerWage,
    };
    let addNewWorker = `INSERT INTO workers SET ?`;
    db.query(addNewWorker, workerPayload, async function (err, result) {
      if (err) {
        console.log(err);
        res.json({
          status: false,
          error: err,
        });
      } else {
        res.json({
          status: true,
          message: "Success",
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
      error: e,
    });
  }
});

router.get("/list", auth.hasRole(), async function (req, res) {
  let userId = req.user.user_id;
  try {
    let getWorkersList = `SELECT * FROM workers WHERE user_id = ${userId}`;
    db.query(getWorkersList, (err, workersList) => {
      if (err) {
        console.log(err);
        res.json({
          status: false,
          error: err,
        });
      } else {
        res.json({
          status: true,
          result: workersList,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
      error: e,
    });
  }
});

router.get("/counters", auth.hasRole(), async function (req, res) {
  let userId = req.user.user_id;
  try {
    let getWorkersList = `SELECT * FROM workers WHERE user_id = ${userId}`;
    db.query(getWorkersList, (err, workersList) => {
      if (err) {
        console.log(err);
        res.json({
          status: false,
          error: err,
        });
      } else {
        res.json({
          status: true,
          labour: workersList.length,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: false,
      error: e,
    });
  }
});

router.post("/markAttendance", auth.hasRole(), async function (req, res) {
  let userId = req.user.user_id;
  let workerId = req.body.workerId;
  let attendance = req.body.attendance;
  let date = req.body.date;

  try {
    let workerAttendance = {
      user_id: userId,
      worker_id: workerId,
      attendance: attendance,
      date: formatDate(date),
    };
    let markAttendance = `REPLACE INTO attendance SET ?`;
    db.query(markAttendance, workerAttendance, async function (
      err,
      attendanceMarked
    ) {
      if (err) {
        console.log("1", err);
        res.json({
          status: false,
          error: err,
        });
      } else {
        res.json({
          status: true,
          message: "Success",
        });
      }
    });
  } catch (e) {
    console.log("catch", e);
    res.json({
      status: false,
      error: e,
    });
  }
});

function formatDate(unixTimestamp) {
  let timestamp = new Date(unixTimestamp);
  let date = timestamp.getDate();
  let month = timestamp.getMonth() + 1;
  let year = timestamp.getFullYear();
  return `${year}-${month}-${date}`;
}

module.exports = router;
