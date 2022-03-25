const jwt = require("jsonwebtoken");
const config = require("../config");

function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login?redirectURL=" + req.url);
    } else {
        jwt.verify(token, config.TOKENSECURE, function (err, decoded) {
            if (err) {
                res.redirect("/login?redirectURL=" + req.url);
            } else {
                next();
            }
        });
    }
}

module.exports = verifyToken;
