import { useRouter } from "next/router";

import { CONFIG_REDUCER } from "@libStore/valtio/REDUX.store";

export function replaceAV(values: string[], str: string) {
  const Matchers = str?.match(/\{\{(.*?)\}\}/gi);

  let newString = str;
  if (Matchers) {
    Matchers.forEach((match, index: number) => {
      if (values[index]) {
        newString = newString.replace(match, values[index]);
      }
    });
  }

  return newString;
}

function useTranslation() {
  const { locale } = useRouter();

  const configV3 = CONFIG_REDUCER.configV3;

  const t = (key: string, values?: string[]): any => {
    const str = configV3[key] || "";
    if (values) {
      return replaceAV(values, str);
    }
    return str;
  };

  return { configV3: configV3 || {}, t, lang: locale, isConfigLoaded: true };
}

export default useTranslation;
