/**
 * retrieving ID of Adobe from cookies
 * @returns string MCVID adobe
 */
export const getMCVID = () => {
  try {
    var midCookie = document.cookie
      .split(";")
      .map(function (c) {
        return c.trim().split("=");
      })
      .filter(function (x) {
        return x[0].startsWith("AMCV_");
      });
    if (midCookie) {
      var regex = new RegExp("MCMID\\|\\d+", "gm");
      var m = regex.exec(decodeURI(midCookie[0][1]));
      return m?.[0].split("|")[1];
    }
  } catch (e) {
    return "";
  }
};
