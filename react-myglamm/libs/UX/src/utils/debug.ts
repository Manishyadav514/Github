export function logURI(urlPath?: string) {
  if (!process.browser && urlPath) {
    // console.error("[Info] Page Visit: ", urlPath);
  }
}
