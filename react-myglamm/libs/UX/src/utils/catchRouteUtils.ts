import Router from "next/router";

import PageAPI from "@libAPI/apis/PageAPI";
import SurveyAPI from "@libAPI/apis/SurveyAPI";
import ProductAPI from "@libAPI/apis/ProductAPI";

import { SHOP } from "@libConstants/SHOP.constant";
import { IS_DUMMY_VENDOR_CODE } from "@libConstants/DUMMY_VENDOR.constant";

import { logURI } from "./debug";
import { isClient } from "./isClient";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

export async function getIntialPropsSurvey(ctx: any) {
  if (!isClient()) {
    if (ctx.req.method !== "HEAD" && GBC_ENV.NEXT_PUBLIC_ENABLE_HIT_LOGS) {
      console.error("HIT:", ctx.req.method, ctx.req.url);
    }
  }
  const survetApi = new SurveyAPI();
  const slugOrId = `mobile-site-survey${IS_DUMMY_VENDOR_CODE() ? `-${SHOP.SITE_CODE}` : ""}${
    ctx.query.mb ? `-${ctx.query.mb}` : ""
  }`;

  const type = "survey";
  try {
    const { data } = await survetApi.getWidgets({ where: { slugOrId } });

    return { widgets: data?.data?.data?.widget, type };
  } catch (err: any) {
    console.log({ err });

    if (!ctx.query.mb && ctx.res) {
      ctx.res.statusCode = 404;
      return ctx.res.end("Not Found");
    }

    if (ctx.res) {
      if (SHOP.REGION === "MIDDLE_EAST")
        console.error(`SUREVEY_LOG`, { slugOrId, err }, err.response?.data?.message, "---URL-----", ctx.req?.url);

      ctx.res.writeHead(302, { Location: ctx.pathname });
      ctx.res.end();
    } else {
      return Router.replace(Router.pathname);
    }

    return {};
  }
}

export async function getIntialPropsSurveyThankyou(ctx: any) {
  const surveyApi = new SurveyAPI();
  const productApi = new ProductAPI();
  const url = ctx.pathname.includes("/play-and-win") ? "mobile-site-slot-machine-thankyou" : "mobile-site-survey-thankyou";
  const slugOrId = `${url}${IS_DUMMY_VENDOR_CODE() ? `-${SHOP.SITE_CODE}` : ""}${ctx.query.mb ? `-${ctx.query.mb}` : ""}`;

  const type = "survey-thankyou";
  try {
    const { data } = await surveyApi.getWidgets({ where: { slugOrId } });
    const widgetMeta = JSON.parse(data?.data?.data?.widget[0]?.meta?.widgetMeta);
    if (widgetMeta?.productIds?.length > 1) {
      const ratings: any = {};
      const include = ["id", "price", "offerPrice", "productTag", "type", "urlManager", "cms", "assets", "urlShortner"];
      const promiseArray = [productApi.getProduct({ id: { inq: widgetMeta.productIds }, inStock: true }, 0, include)];
      widgetMeta.productIds.map((id: any) => {
        promiseArray.push(productApi.getavgRatings(id, "product"));
      });
      const [productsData, ...ratingsData] = await Promise.allSettled(promiseArray);
      // @ts-ignore
      const products = productsData?.value?.data?.data || {};
      ratingsData.map((avgRat, index) => {
        // @ts-ignore
        const ratingsAPIData = avgRat?.value?.data?.data;
        ratings[widgetMeta.productIds[index]] = ratingsAPIData;
      });
      return { widgets: data.data?.data?.widget, products, ratings, type };
    } else {
      return { widgets: data.data?.data?.widget, type };
    }
  } catch {
    if (ctx.res) {
      ctx.res.statusCode = 404;
      return ctx.res.end("Not Found");
    }

    return {};
  }
}

export async function getIntialPropsStaticPage(ctx: any) {
  const slug = ctx.query.category;

  try {
    const where = {
      "urlShortner.slug": encodeURIComponent(`/${slug}`),
    };

    const pageApi = new PageAPI();
    const cat = await pageApi.getPage(0, where);
    if (cat.data.data.count === 0) {
      // log URI for help with debugging using cloudwatch logs
      // not able to get source-maps to work with console.log on the server
      // ideally we should we using something like Sentry
      // or use newrelic to log with proper tracebacks etc.
      logURI(ctx.asPath);
      if (ctx.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Not Found");
      }
      return { errorCode: 404 };
    }

    return { cat: cat.data.data.data[0] };
  } catch (error: any) {
    // log URI for help with debugging using cloudwatch logs
    // not able to get source-maps to work with console.log on the server
    // ideally we should we using something like Sentry
    // or use newrelic to log with proper tracebacks etc.
    logURI(ctx.asPath);
    if (ctx.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }
    return {
      errorCode: 404,
    };
  }
}
