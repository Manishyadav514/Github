import { isClient } from "@libUtils/isClient";

export function formatPlusCode(code: string, dirChange = false) {
  if (!code) {
    return "";
  }

  let CODE = code;

  const plusIndex = code.startsWith("+");
  if (plusIndex) {
    CODE = code.substring(1);
  }

  if (dirChange) {
    if (isClient() && document.dir === "rtl") {
      return `${CODE}+`;
    }
  }

  return `+${CODE}`;
}
