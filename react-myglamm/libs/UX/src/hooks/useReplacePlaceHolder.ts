/**
 * @description - Replace placeholder from string
 * @param str  - string with place holder e.g. developer name is {{developerName}}
 * @param replacementObj - replacement Object consist value with key e.g. {developerName:'salman'}
 * @returns
 */
const useReplacePlaceHolder = (str: string, replacementObj: any) =>
  (typeof replacementObj === "object" &&
    str.replace(/\{{(.*?)\}}/gi, (all: any) => {
      all = all.replace(/[{}]/g, "");
      return replacementObj[all] || all;
    })) ||
  str;

export default useReplacePlaceHolder;
