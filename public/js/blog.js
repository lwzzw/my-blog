let blogId = decodeURI(location.pathname.split("/").pop());

getBlog(blogId).then((blog) => {
    console.log(blog);
    setupBlog(blog);
});

const setupBlog = (data) => {
    const banner = document.querySelector(".banner");
    const blogTitle = document.querySelector(".title");
    const titleTag = document.querySelector("title");
    const publish = document.querySelector("#publishedat");
    const publishby = document.querySelector("#publishedby");

    banner.style.backgroundImage = `url(${data.bannerimage}), url('/img/no_img.png')`;
    banner.classList.remove("loader")

    titleTag.innerHTML += blogTitle.innerHTML = data.title;
    publish.textContent = "published at - " + data.publishedat;
    publishby.textContent = "published by - " + data.publishedby;

    const article = document.querySelector(".article");
    addArticle(article, data.article);
};

const addArticle = (ele, data) => {
    ele.textContent = "";
    data = data.split("\n").filter((item) => item.length);
    // console.log(data);

    data.forEach((item) => {
        // check for heading
        if (item[0] == "#") {
            let hCount = 0;
            let i = 0;
            while (item[i] == "#") {
                hCount++;
                i++;
            }
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}>${item.slice(
                hCount,
                item.length
            )}</${tag}>`;
        }
        //checking for image format
        else if (item[0] == "!" && item[1] == "[") {
            let seperator;

            for (let i = 0; i <= item.length; i++) {
                if (
                    item[i] == "]" &&
                    item[i + 1] == "(" &&
                    item[item.length - 1] == ")"
                ) {
                    seperator = i;
                }
            }

            let alt = item.slice(2, seperator);
            let src = item.slice(seperator + 2, item.length - 1);
            ele.innerHTML += `
            <img src="${src}" alt="${alt}" class="article-image" onerror="this.onerror=null;this.src='/img/no_img.png';">
            `;
        } else {
            ele.innerHTML += `<p>${item}</p>`;
        }
    });
};
