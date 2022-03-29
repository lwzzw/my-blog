const blogTitleField = document.querySelector(".title");
const articleFeild = document.querySelector(".article");

// banner
const bannerImage = document.querySelector("#banner-upload");
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector(".publish-btn");
const uploadInput = document.querySelector("#image-upload");

bannerImage.addEventListener("change", () => {
    uploadImage(bannerImage, "banner");
});

uploadInput.addEventListener("change", () => {
    uploadImage(uploadInput, "image");
});

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        const imgbase64 = reader.result;
        if (imgbase64 && imgbase64.includes("data:image")) {
            upload(imgbase64).then((data) => {
                if (uploadType == "image") {
                    addImage(data.url, file.name);
                } else {
                    bannerPath = data.url;
                    banner.style.backgroundImage = `url("${bannerPath}")`;
                }
            });
        } else {
            alert("upload image only");
        }
    };
};

const addImage = (imagepath, alt) => {
    let curPos = articleFeild.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleFeild.value =
        articleFeild.value.slice(0, curPos) +
        textToInsert +
        articleFeild.value.slice(curPos);
};

let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

publishBtn.addEventListener("click", () => {
    if (articleFeild.value.length && blogTitleField.value.length) {
        // generating id
        let letters = "abcdefghijklmnopqrstuvwxyz";
        let blogTitle = blogTitleField.value.split(" ").join("-");
        let id = "";
        for (let i = 0; i < 4; i++) {
            id += letters[Math.floor(Math.random() * letters.length)];
        }

        // setting up docName
        let docName = `${blogTitle}-${id}`;
        let date = new Date(); // for published at info

        postBlog({
            id: docName,
            title: blogTitleField.value,
            article: articleFeild.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${
                months[date.getMonth()]
            } ${date.getFullYear()}, ${("0" + date.getHours()).slice(-2)}:${(
                "0" + date.getMinutes()
            ).slice(-2)}:${("0" + date.getSeconds()).slice(-2)} `,
        })
            .then(() => {
                location.href = `/${docName}`;
            })
            .catch((err) => {
                console.error(err);
            });
    }
});
