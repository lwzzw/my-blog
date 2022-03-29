function login(userName, password, url) {
    fetch("/api-admin/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userName,
            password,
        }),
    }).then(function (response) {
        if (response.status == 200) {
            location.href = url;
        } else {
            alert("login failed");
        }
    });
}

function getAllBlog() {
    return fetch("/api-blog/allblog", {
        method: "get",
    }).then((response) => {
        if (response.status == 200) {
            return response.json();
        } else {
            return [];
        }
    });
}

function getBlog(blogId) {
    return fetch(`/api-blog/${blogId}`, {
        method: "get",
    })
        .then((response) => {
            if (response.status == 200) {
                return response.json();
            } else {
                location.href = "/";
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function upload(img) {
    return fetch("/upload", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            img,
        }),
    })
        .then((response) => {
            if (response.status == 200) {
                return response.json();
            } else {
                throw new Error("Upload failed");
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function postBlog(blog) {
    return fetch("/api-blog/blog", {
        headers: { "Content-Type": "application/json" },
        method: "post",
        body: JSON.stringify({
            blog_id: blog.id,
            title: blog.title,
            article: blog.article,
            bannerImage: blog.bannerImage,
            publishedAt: blog.publishedAt,
        }),
    }).then((response) => {
        if (response.status == 201) {
            return
        } else {
            throw new Error("Post failed");
        }
    });
}

function glogin(user){
    fetch("/api-admin/glogin", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token: user.credential,
        }),
    }).then(function (response) {
        if (response.status == 200) {
            location.href = url;
        } else {
            alert("login failed");
        }
    });
}