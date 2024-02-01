import Router from "next/router";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { PAGE_CONSTANT } from "@libStore/valtio/PAGE_DATA.store";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { CONFIG_REDUCER } from "@libStore/valtio/REDUX.store";

export function getWidgetAPIData(APIUrl: string, widgetIndex: number) {
  if (!APIUrl) {
    return Promise.resolve();
  }

  try {
    const widgetApi = new WidgetAPI();
    const isConsumerAPI = APIUrl.includes("{{memberId}}");

    if ((isConsumerAPI && checkUserLoginStatus()) || !isConsumerAPI) {
      return widgetApi.dynamicG3Call(APIUrl).then(({ data: res }) => {
        const temp = PAGE_CONSTANT.state;
        if (temp[Router.asPath.split("?")[0]]?.widgets) {
          temp[Router.asPath.split("?")[0]].widgets[widgetIndex].apiData = res.data;
        } else if (temp[Router.asPath.split("?")[0]]) {
          temp[Router.asPath.split("?")[0]][widgetIndex].apiData = res.data;
        }
        PAGE_CONSTANT.state = temp;

        return res.data;
      });
    }

    return Promise.resolve();
  } catch {
    return Promise.resolve();
  }
}

export function ParseJSON(data: string) {
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export function setValueForAdobe(variant: string = "no-variant", flag: string) {
  if (variant !== "no-variant") {
    (window as any).evars.evar143 = variant === "1" ? `true|${flag ? "visible" : "not visible"}` : "false";
  }
}

export const filterProductsOnTag = (products: any[], tag: string) => {
  return products.filter(product => product?.dsProductTags?.includes(tag));
};

export const checkBlackListWidgetSlug = (slug: string) => {
  const whitelistedSlugs: string[] = CONFIG_REDUCER?.configV3?.blacklistedSlugs || [];

  return whitelistedSlugs?.some(value => value === slug);
};

export const checkIfWidgetGroupIsActive = (slug: string) => {
  const activeSlugs: string[] = CONFIG_REDUCER?.configV3?.activeWidgetGroupSlugs?.activeWidgetGroups || [];
  if (activeSlugs?.length > 0) {
    return activeSlugs?.includes(slug);
  } else {
    return true; // if we don't get the list of active slugs fallback to default method
  }
};

type ParsedLink = {
  slug: string;
  discountCode: string | null;
  limit: any;
};

export const parseLink = (value: string): ParsedLink => {
  const [slug, query] = value.split("?");
  let discountCode = null;
  let limit: any = 6;
  if (query) {
    const params = new URLSearchParams(query);
    discountCode = params.get("discountCode") || null;
    limit = params.get("limit") || 6;
  }

  return {
    slug,
    discountCode,
    limit,
  };
};
