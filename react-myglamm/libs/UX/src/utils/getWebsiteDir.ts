import { langLocale } from "@typesLib/APIFilters";

export function getWebsiteDir(locale: langLocale) {
  if (locale?.startsWith("ar-")) {
    return "rtl";
  }

  return "ltr";
}
