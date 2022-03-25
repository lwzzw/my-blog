const express = require("express");
const path = require("path");
const PORT = require("./config").PORT;
const API = require("./router/api");
const cookieParser = require("cookie-parser");
const verifyToken = require("./middleware/islogin");
const db = require("./database/database");
const { cloudinary } = require("./cloudinary/cloudinary");

db.connect().then(function () {
    db.query(
        `
    DROP TABLE IF EXISTS blog;
    CREATE TABLE IF NOT EXISTS blog (
        blog_id text primary key,
        title text not null,
        article text not null,
        bannerImage varchar(255) null,
        publishedAt varchar(255) not null,
        hide boolean not null DEFAULT false
    );
    `
    ).catch((err) => {
        console.log(err);
    });
});
let initial_path = path.join(__dirname, "public");

const app = express();
app.use(
    express.json({
        limit: "50mb",
    })
);
app.use(
    express.urlencoded({
        limit: "50mb",
        extended: true,
    })
);
app.use(express.static(initial_path));
app.use(cookieParser());

app.use(API);

app.get("/", (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
});

app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.join(initial_path, "/img/logo.png"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(initial_path, "login.html"));
});

app.get("/editor", verifyToken, (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
});

// upload link
app.post("/upload", verifyToken, async (req, res) => {
    const img = req.body.img;
    try {
        const uploadResponse = await cloudinary.uploader.upload(img, {
            upload_preset: "blog",
        });
        console.log(uploadResponse);
        res.json({ url: uploadResponse.secure_url });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
});

app.use((req, res) => {
    res.json("404");
});

app.listen(PORT, () => {
    console.log("listening on port " + PORT);
});
