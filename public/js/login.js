const btn = document.getElementById("login");
const userName = document.getElementById("username");
const psd = document.getElementById("psd");
var url = new URL(location.href);
url = url.searchParams.get("redirectURL")||'/';
btn.addEventListener("click", function (e) {
    let un = userName.value,
        pass = psd.value;
    if (!un || !pass) return;
    login(un, pass, url);
});
