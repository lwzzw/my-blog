const router = require("express").Router();
const config = require("../config");
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
    // start login
    console.log(req.body);
    const userName = req.body.userName;
    const password = req.body.password;
    if (!userName || !password) return res.status(401).end();

    if (userName != config.USERNAME || password != config.PASSWORD)
        return res.status(401).end();
    //if successful login
    const token = jwt.sign(
        {
            login: "ADMIN",
        },
        config.TOKENSECURE,
        {
            expiresIn: 86400,
        }
    );
    res.cookie("token", token, {
        maxAge:
            30 /*days*/ * 24 /*hours*/ * 60 /*minutes*/ * 60 /*seconds*/ * 1000,
        httpOnly: true,
    });
    res.sendStatus(200);
});

module.exports = router;
