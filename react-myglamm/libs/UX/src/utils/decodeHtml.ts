import decode from "unescape";

export function stripSlashes(str: string): string {
  return str
    ?.replace(/^\/+/, "")
    .replace(/\/+(\?|$)/, "")
    .replace(/\\/g, "");
}

export function transform(ctr: any, args: number): string {
  let ct = ctr.replace(/\\/g, "");
  if (args > 0) {
    if (ct.length > args) {
      ct = `${ct.substring(0, args)}...`;
      return ct.trim();
    }
    return ct.trim();
  }
  return ct.trim();
}

export function decodeHtml(
  str: string,
  config?: { stripSlash?: boolean; transform?: boolean; transformArgs?: number }
): string {
  let string = str;
  if (config && config.stripSlash) {
    return decode(stripSlashes(string));
  }
  if (config && config.transform && config.transformArgs) {
    string = transform(string, config.transformArgs);
  }
  return decode(string);
}
