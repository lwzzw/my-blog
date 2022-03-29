const router = require("express").Router();
const config = require("../config");
const database = require("../database/database");
const jwt = require("jsonwebtoken");
const { decode } = require("../middleware/islogin");

router.post("/blog", decode, (req, res) => {
    // jwt.verify(req.cookies.token, config.TOKENSECURE, (err, decoded) => {
    //     if (err) return res.status(401);

    // });
    if (!req.id) return res.status(401);
    const blog = req.body;
    console.log(req.body);
    database
        .query(
            "INSERT INTO public.blog (blog_id, title, article, bannerImage, publishedAt, hide, publishedBy) VALUES ($1, $2, $3, $4, $5, false, $6);",
            [
                blog.blog_id,
                blog.title,
                blog.article,
                blog.bannerImage,
                blog.publishedAt,
                req.id,
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

router.post("/hide/:blogname", decode, (req, res) => {
    res.sendStatus(400);
});

router.post("/show/:blogname", decode, (req, res) => {
    res.sendStatus(400);
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
            `select b.blog_id as id, b.title, b.article, b.bannerImage, b.publishedAt, u.name as publishedBy from blog as b join b_user as u on b.publishedBy = u.uid where b.blog_id = $1 and b.hide != true`,
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
