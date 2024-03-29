let express = require("express");
let router = express.Router();
let auth = require("../middleware/auth");
let async = require('async');

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
  let totalAmount = 0;
  try {
    let getWorkersList = `SELECT * FROM workers WHERE user_id = ${userId}`;
    let getTotalAmountPaid = `SELECT * FROM payments WHERE user_id = ${userId}`;
    let getTodayAttendance = `SELECT * FROM attendance WHERE attendance = 'Present' AND DATE(date) = CURDATE()`;
    //get total workers
    db.query(getWorkersList, (err, workersList) => {
      if (err) {
        console.log(err);
        res.json({
          status: false,
          error: err,
        });
      } else {
        //Get total amount paid
        db.query(getTotalAmountPaid, (err, totalPayments) => {
          if (err) {
            console.log(err);
            res.json({
              status: false,
              error: err,
            });
          } else {
            async.each(totalPayments, (payment, callback) => {
              totalAmount = totalAmount + payment.amount;
              callback();
            }, (err) => {
              if (err) {
                console.log(err);
                res.json({
                  status: false,
                  error: err,
                });
              } else {
                //get total present today
                db.query(getTodayAttendance, (err, result) => {
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
                      amount: totalAmount,
                      attendance: result.length,
                    });
                  }
                });
              }
            });
          }
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



module.exports = router;