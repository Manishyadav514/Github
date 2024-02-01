export function urlJoin(url: string) {
  if (!url) {
    return "";
  }

  if (url.includes("?")) {
    return url.concat("&");
  }

  return url.concat("?");
}
