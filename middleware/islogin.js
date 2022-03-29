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
                // console.log(decoded);
                req.name = decoded.name;
                req.id = decoded.id;
                next();
            }
        });
    }
}

function decode(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        next()
    } else {
        jwt.verify(token, config.TOKENSECURE, function (err, decoded) {
            if (err) {
                next()
            } else {
                // console.log(decoded);
                req.name = decoded.name;
                req.id = decoded.id;
                next();
            }
        });
    }
}

module.exports = {verifyToken, decode};
