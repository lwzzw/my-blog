const router = require("express").Router();
const config = require("../config");
const database = require("../database/database");
const jwt = require("jsonwebtoken");

router.post("/blog", (req, res) => {
    jwt.verify(req.cookies.token, config.TOKENSECURE, (err, decoded) => {
        if (err) return res.status(401);
        const blog = req.body;
        console.log(req.body);
        database
            .query(
                "INSERT INTO public.blog VALUES ($1, $2, $3, $4, $5, false);",
                [
                    blog.blog_id,
                    blog.title,
                    blog.article,
                    blog.bannerImage,
                    blog.publishedAt,
                ]
            )
            .then(() => {
                res.status(201).end();
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
    });
});

router.post("/hide/:blogname", (req, res) => {
    jwt.verify(req.cookie.token, config.TOKENSECURE, (err, decoded) => {
        if (err) return res.status(401);
    });
});

router.post("/show/:blogname", (req, res) => {
    jwt.verify(req.cookie.token, config.TOKENSECURE, (err, decoded) => {
        if (err) return res.status(401);
    });
});

router.get("/allblog", (req, res) => {
    database
        .query(
            `select blog_id id, title, article, bannerImage, publishedAt from blog where hide != true`
        )
        .then((data) => {
            // console.log(data.rows.length);
            res.json(data.rows);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

router.get("/:blogname", (req, res) => {
    const blogname = req.params.blogname;
    database
        .query(
            `select blog_id id, title, article, bannerImage, publishedAt from blog where blog_id = $1 and hide != true`,
            [blogname]
        )
        .then((data) => {
            // console.log(data.rows);
            if (data.rows.length < 1) return res.sendStatus(400);
            res.json(data.rows[0]);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

module.exports = router;
