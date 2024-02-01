import axios from "axios";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { SLUG } from "@libConstants/Slug.constant";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";
import { IS_DUMMY_VENDOR_CODE } from "@libConstants/DUMMY_VENDOR.constant";

import { urlJoin } from "./urlJoin";
import { isClient } from "./isClient";
import { SHOP } from "@libConstants/SHOP.constant";
import SearchAPI from "@libAPI/apis/SearchAPI";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

export async function getHomeInitialProps(ctx: any) {
  if (!isClient()) {
    if (ctx.req.method !== "HEAD" && GBC_ENV.NEXT_PUBLIC_ENABLE_HIT_LOGS) {
      console.error("HIT:", ctx.req.method, ctx.req.url);
    }
  }
  const slug = IS_DUMMY_VENDOR_CODE() ? SLUG().DUMMY_HOME_WIDGETS : SLUG().HOME_WIDGETS;
  const widgetApi = new WidgetAPI();

  try {
    const where = { slugOrId: slug };
    const { data } = await widgetApi.getHomeWidgets({ where }, 15, 0, false);

    return {
      homeWidgets: data?.data?.data?.widget || [],
      slug,
    };
  } catch (error: any) {
    // console.error(error);
    return { homeWidgets: [], slug };
  }
}

/**
 *
 * @param {*} data
 * @param {* Pixel Size of Image} imageSize
 */
export function getImage(data: any, imageSize: string) {
  const typeImage = data?.assets?.find((x: any) => x.type === "image");
  if (typeImage?.imageUrl?.[imageSize]) {
    return typeImage.imageUrl[imageSize];
  }
  if (data?.imageUrl && !data.imageUrl.includes("youtube")) {
    return data.imageUrl;
  }
  return DEFAULT_IMG_PATH();
}

/**
 *
 * @param {Content Route} url
 * @param {ICID For Particular Widget} icid
 * @param {Params for Particular Content} params
 */
export function generateICIDlink(url: string, icid: string, params: string) {
  if (icid) {
    return `${urlJoin(url)}icid=${icid}_${params}`.toLowerCase();
  }
  return url;
}

export async function getTVCInitialProps() {
  const widgetApi = new WidgetAPI();

  const { data } = await widgetApi.getWidgets({ where: { slugOrId: SLUG().TVC_WIDGETS } });

  return { widgets: data?.data?.data?.widget };
}

export async function getSearchData(searchVal: string, limit = 5, skip = 0) {
  const searchApi = new SearchAPI();

  const page = skip / 10 + 1;

  let data;
  if (SHOP.SITE_CODE === "tmc") {
    data = await searchApi.searchItems(searchVal, page, "products");
  } else {
    data = await searchApi.oldSearchItems(searchVal, limit, skip);
  }

  return data;
}

export function bannerClickEvent(url: string, meta: any, e: any) {
  if (url.includes("noRedirect")) {
    e.preventDefault();

    return dispatchEvent(new CustomEvent(meta.eventName, { detail: meta.surveyId }));
  }
}
