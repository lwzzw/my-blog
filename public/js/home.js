const blogSection = document.querySelector(".blogs-section");

getAllBlog().then((blogs) => {
    blogs.forEach((blog) => {
        if (blog.id != decodeURI(location.pathname.split("/").pop())) {
            createBlog(blog);
        }
    });
});

const createBlog = (data) => {
    console.log(data.article);
    data.article = data.article.replace(/\!\[.+\.{1}\w{3}\]\(.+\.\w{3}\)/, "");
    console.log(data.article);
    blogSection.innerHTML += `
    <div class="blog-card">
        <img src="${
            data.bannerimage
        }" class="blog-image" alt="" onerror="this.onerror=null;this.src='/img/no_img.png';">
        <h1 class="blog-title">${data.title.substring(0, 100) + "..."}</h1>
        <p class="blog-overview">${data.article.substring(0, 200) + "..."}</p>
        <a href="/${data.id}" class="btn dark">read</a>
    </div>
    `;
};
