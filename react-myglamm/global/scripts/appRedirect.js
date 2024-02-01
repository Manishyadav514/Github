var anchorTags = document.querySelectorAll("a");
var path = location.href;
var anchors = [];
var url;

window.appObj = function APPClass() {};
appObj.sendMessagae = function (message) {
  if (url !== message || !url) {
    url = message;

    const platform = sessionStorage.getItem("WV");
    if (path.includes("platform=android") || platform === "android") {
      MobileApp.redirect(message);
    } else if (path.includes("platform=ios") || platform === "ios") {
      location.href = message;
    }
  }

  setTimeout(() => (url = undefined), 200);
};

setInterval(() => {
  anchorTags = document.querySelectorAll("a");
  if (anchorTags.length !== anchors.length) {
    anchors = anchorTags;

    anchorTags.forEach(url => {
      url.addEventListener("click", function (e) {
        e.preventDefault();

        appObj.sendMessagae(url.href);
      });
    });
  }
}, 800);
