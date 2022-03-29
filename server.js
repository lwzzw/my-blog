const express = require("express");
const path = require("path");
const PORT = require("./config").PORT;
const API = require("./router/api");
const cookieParser = require("cookie-parser");
const { verifyToken } = require("./middleware/islogin");
const db = require("./database/database");
const { cloudinary } = require("./cloudinary/cloudinary");
const clientid = require("./config").GOOGLE_API_KEY;

db.connect().then(function () {
    return;
    db.query(
        `
    --DROP TABLE IF EXISTS blog;
    CREATE TABLE IF NOT EXISTS blog (
        blog_id text primary key,
        title text not null,
        article text not null,
        bannerImage varchar(255) null,
        publishedAt varchar(255) not null,
        hide boolean not null DEFAULT false,
        publishedBy int not null,
        isdelete boolean not null DEFAULT false
    );
    
    --DROP TABLE IF EXISTS u_id;
    CREATE TABLE IF NOT EXISTS u_id (
        id SERIAL primary key,
        uid int not null,
        unique_id varchar(255) not null
    );

    --DROP TABLE IF EXISTS b_user;
    CREATE TABLE IF NOT EXISTS b_user (
        uid SERIAL primary key,
        name varchar(100) not null,
        email varchar(255) not null,
        password varchar(255) null,
        auth_type int not null default 0,
        picture varchar(255) null,
        phone varchar(20) null,
        gender varchar(2) null,
        role int default 0,
        isdelete boolean not null DEFAULT false
    );

    --ALTER TABLE blog
	--    ADD CONSTRAINT fk_userid FOREIGN KEY(publishedBy) REFERENCES b_user(uid);

    --ALTER TABLE u_id
	--    ADD CONSTRAINT fk_uniqueid FOREIGN KEY(uid) REFERENCES b_user(uid);
    `
    ).catch((err) => {
        console.log(err);
    });
});
let initial_path = path.join(__dirname, "public");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/public/views"));
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
    // res.sendFile(path.join(initial_path, "login.html"));
    res.render("login.ejs", { clientid });
});

app.get("/editor", verifyToken, (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
});

// upload link
app.post("/upload", verifyToken, async (req, res) => {
    const img = req.body.img;
    console.log('upload');
    console.log(img.slice(0, 10));
    if (!img.includes("data:image")) return res.sendStatus(400);
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
