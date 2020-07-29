let express = require("express");
let router = express.Router();
let auth = require("../middleware/auth");
let async = require('async');

router.post('/add', auth.hasRole(), async (req, res) => {
    let userId = req.user.user_id;
    let workerId = req.body.workerId;
    let amount = req.body.amount;
    let date = req.body.date;

    try {
        let payment = {
            user_id: userId,
            worker_id: workerId,
            date: formatDate(date),
            amount: amount,
        };
        let query = `INSERT INTO payments SET ?`;
        db.query(query, payment, async (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    status: false,
                    error: err,
                });
            } else {
                res.json({
                    status: true,
                    message: 'Success',
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

router.post('/list', auth.hasRole(), async (req, res) => {
    let userId = req.user.user_id;
    let workerId = req.body.workerId;

    try {
        let query = `SELECT * FROM payments WHERE user_id = ${userId} AND worker_id = ${workerId} ORDER BY created_at DESC`;
        db.query(query, async (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    status: false,
                    error: err,
                });
            } else {
                async.each(result, (payment, callback) => {
                    payment.unixDate = new Date(payment.date).getTime();
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

router.get('/total/:id', auth.hasRole(), async (req, res) => {
    let userId = req.user.user_id;
    let workerId = req.params.id;
    let totalAmount = 0;

    try {
        let query = `SELECT * FROM payments WHERE user_id = ${userId} AND worker_id = ${workerId} ORDER BY created_at DESC`;
        db.query(query, async (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    status: false,
                    error: err,
                });
            } else {
                async.each(result, (payment, callback) => {
                    totalAmount = totalAmount + payment.amount;
                    callback();
                }, (err) => {
                    res.json({
                        status: true,
                        result: totalAmount,
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