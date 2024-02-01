const baseURL = document.getElementById("verloop")?.getAttribute("data-verloop-base-url");

!(function (w, d, s, u) {
  (w.Verloop = function (c) {
    w.Verloop._.push(c);
  }),
    (w.Verloop._ = []),
    (w.Verloop.url = u);
  var h = d.getElementsByTagName(s)[0],
    j = d.createElement(s);
  (j.async = !0), (j.src = baseURL + "/livechat/script.min.js"), h.parentNode.insertBefore(j, h);
})(window, document, "script", baseURL + "/livechat");
