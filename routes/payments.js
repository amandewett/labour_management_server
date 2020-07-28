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

export default router;