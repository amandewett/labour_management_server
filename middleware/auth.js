let jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "";

module.exports = {
    hasRole: function (role) {
        return function (req, res, next) {
            let token = req.headers["authorization"];
            if (!token) {
                return res.status(401).send("Not Authorised!");
            }
            token = token.replace("Bearer ", "");
            try {
                let jwtPayload = jwt.verify(token, jwtSecret);
                let query = `SELECT * FROM users WHERE user_id = ${jwtPayload.user_id}`;
                db.query(query, (err, result) => {
                    if (result.length != 0) {
                        req.user = result[0];
                        next();
                    } else {
                        return res.status(401).send("Not Authorised!");
                    }
                });
            } catch (e) {
                return res.status(401).send("Not Authorised!");
            }
        }
    }
};