let express = require('express');
let router = express.Router();
let bCrypt = require('bcrypt');
let jwt = require("jsonwebtoken");
let auth = require('../middleware/auth');

router.post('/signup', async function (req, res) {
    let userName = req.body.name;
    let userEmail = req.body.email;
    let userPassword = req.body.password;

    try {
        let checkUser = `SELECT user_email FROM users WHERE user_email = '${userEmail}'`;
        db.query(checkUser, function (err, userFound) {
            if (err) {
                console.log(err);
                res.json({
                    status: false,
                    error: err,
                });
            } else {
                if (userFound.length == 0) {
                    bCrypt.hash(userPassword, 10, async function (err, encryptedPassword) {
                        if (err) {
                            console.log(err);
                            res.json({
                                status: false,
                                error: err,
                            });
                        } else {
                            const newUserPayload = {
                                user_name: userName,
                                user_email: userEmail,
                                user_password: encryptedPassword,
                            };
                            let saveNewUSer = `INSERT INTO users SET ?`;
                            db.query(saveNewUSer, newUserPayload, function (err, savedNewUser) {
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
                        }
                    });
                } else {
                    res.json({
                        status: false,
                        message: `User already exists.`,
                    });
                }
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

router.post('/login', async function (req, res) {
    let userEmail = req.body.email;
    let userPassword = req.body.password;

    try {
        let findEmail = `SELECT * FROM users WHERE user_email = '${userEmail}'`;
        db.query(findEmail, (err, emailFound) => {
            if (err) {
                console.log(err);
                res.json({
                    status: false,
                    error: err,
                });
            } else {
                if (emailFound.length == 0) {
                    res.json({
                        status: false,
                        message: "Invalid credentials"
                    });
                } else {
                    bCrypt.compare(userPassword, emailFound[0].user_password, async function (err, isPasswordVerified) {
                        if (err) {
                            res.json({
                                status: false,
                                message: "Invalid credentials"
                            });
                        } else {
                            if (isPasswordVerified) {
                                let jwtToken = jwt.sign({
                                    user_id: emailFound[0].user_id,
                                }, process.env.JWT_SECRET, {
                                    expiresIn: "365 days",
                                });
                                let result = {
                                    user_id: emailFound[0].user_id,
                                    user_name: emailFound[0].user_name,
                                    user_email: emailFound[0].user_email,
                                    token: jwtToken,
                                };
                                res.json({
                                    status: true,
                                    result: result,
                                });

                            } else {
                                res.json({
                                    status: false,
                                    message: "Invalid credentials"
                                });
                            }
                        }
                    });
                }
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