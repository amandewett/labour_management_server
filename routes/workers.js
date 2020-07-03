let express = require('express');
let router = express.Router();
let auth = require('../middleware/auth');

router.post('/add', auth.hasRole(), async function (req, res) {
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

module.exports = router;