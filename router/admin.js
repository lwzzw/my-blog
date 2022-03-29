const router = require("express").Router();
const config = require("../config");
const jwt = require("jsonwebtoken");
const database = require("../database/database");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(config.GOOGLE_API_KEY);
// const bcrypt = require("bcrypt");

router.post("/login", (req, res) => {
    // start login
    console.log(req.body);
    const userName = req.body.userName;
    const password = req.body.password;
    if (!userName || !password) return res.status(401).end();

    // if (userName != config.USERNAME || password != config.PASSWORD)
    //     return res.status(401).end();
    database
        .query(
            "SELECT name, uid FROM b_user WHERE (name = $1 or email = $1) and password = $2",
            [userName, password]
        )
        .then((result) => {
            if (result.rows.length < 1) return res.status(401).end();
            const name = result.rows[0].name;
            const uid = result.rows[0].uid;
            setCookie(res, name, uid);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
});

router.post("/glogin", (req, res) => {
    console.log(req.id);
    const token = req.body.token;
    console.log(token);
    verify(token)
        .then((user) => {
            const uid = user["sub"];
            const name = user["name"] || "anonymous";
            const email = user["email"] || "anonymous";
            const picture = user["picture"];
            database
                .query(
                    "SELECT b_user.uid, name, email, picture FROM u_id join b_user on b_user.uid = u_id.uid where unique_id = $1 and b_user.isdelete = false",
                    [uid]
                )
                .then(async (results) => {
                    if (results?.rowCount == 1) {
                        //if user exists
                        console.log("user exists");
                        const result = results.rows[0];
                        const userid = result.uid;
                        if (
                            name != result.name ||
                            email != result.email ||
                            picture != result.picture
                        ) {
                            //update profile
                            await database
                                .query(
                                    "UPDATE b_user SET name = $1, email = $2, picture = $3 WHERE uid = $4",
                                    [name, email, picture, userid]
                                )
                                .catch(console.log);
                        }
                        //set cookie
                        setCookie(res, name, userid);
                    } else {
                        //if user does not exists
                        //auth_type 1 > google
                        console.log("user not exists");
                        const userid = await database
                            .query(
                                "INSERT INTO public.b_user (name, email, auth_type) VALUES ($1, $2, 1) RETURNING uid;",
                                [name, email]
                            )
                            .then((result) => result.rows[0].uid)
                            .catch((err) => {
                                console.log(err);
                                res.sendStatus(500);
                            });
                        await database
                            .query(
                                "INSERT INTO public.u_id (uid, unique_id) VALUES ($1, $2);",
                                [userid, uid]
                            )
                            .catch((err) => {
                                console.log(err);
                                res.sendStatus(500);
                            });
                        //set cookie
                        setCookie(res, name, userid);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.sendStatus(500);
                });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.GOOGLE_API_KEY, // Specify the CLIENT_ID of the app that accesses the backend
    });
    return ticket.getPayload();
}

function setCookie(res, name, id) {
    //set cookie
    const token = jwt.sign(
        {
            name,
            id,
        },
        config.TOKENSECURE,
        {
            expiresIn:
                30 /*days*/ *
                24 /*hours*/ *
                60 /*minutes*/ *
                60 /*seconds*/ *
                1000,
        }
    );
    res.cookie("token", token, {
        maxAge:
            30 /*days*/ * 24 /*hours*/ * 60 /*minutes*/ * 60 /*seconds*/ * 1000,
        httpOnly: true,
    });
    res.sendStatus(200);
}

module.exports = router;
