let express = require("express");
let router = express.Router();
let auth = require("../middleware/auth");
let async = require('async');

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
        db.query(markAttendance, workerAttendance, async function (err, attendanceMarked) {
            if (err) {
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

router.post("/myAttendance", auth.hasRole(), async (req, res) => {
    let userId = req.user.user_id;
    let workerId = req.body.workerId;

    try {
        let getAttendance = `SELECT * FROM attendance WHERE user_id = ${userId} AND worker_id = ${workerId} ORDER BY date DESC`;
        db.query(getAttendance, async (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    status: false,
                    error: err,
                });
            } else {
                async.each(result, (attendance, callback) => {
                    attendance.unixDate = new Date(attendance.date).getTime();
                    callback();
                }, (err) => {
                    res.json({
                        status: true,
                        result: result,
                    });
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

function formatDate(dateStamp) {
    let timestamp = new Date(dateStamp);
    let date = timestamp.getDate();
    let month = timestamp.getMonth() + 1;
    let year = timestamp.getFullYear();
    return `${year}-${month}-${date}`;
}

module.exports = router;