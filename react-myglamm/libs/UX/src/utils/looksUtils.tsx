import { NextPageContext } from "next";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { logURI } from "./debug";

export async function getLookBookIntialProps(ctx: NextPageContext) {
  try {
    const widgetApi = new WidgetAPI();
    const categoryData = await widgetApi.getLooksCategories();

    const parentCategories = categoryData.data.data?.data?.map((cat: any) => ({
      ...cat,
      isSelected: cat.urlManager.url === `/lookbook/${ctx.query.looks}`,
    }));

    return {
      parentCategory: { ...categoryData.data.data, data: parentCategories },
    };
  } catch (error: any) {
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

export async function getLooksInitialProps(ctx: NextPageContext) {
  // log URI for help with debugging using cloudwatch logs
  // not able to get source-maps to work with console.log on the server
  // ideally we should we using something like Sentry
  // or use newrelic to log with proper tracebacks etc.

  try {
    const widgetApi = new WidgetAPI();
    const { data } = await widgetApi.getLooksBySlug(`/looks/${ctx.query.slug}`);

    if (data.data.data.length === 0) {
      logURI(ctx.asPath);

      if (ctx.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Not Found");
      }

      return {
        errorCode: 404,
      };
    }

    return { looks: data.data };
  } catch (error: any) {
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
