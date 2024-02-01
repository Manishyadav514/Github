import React from "react";

import { logURI } from "@libUtils/debug";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import Home from "@libPages/home";
import ErrorComponent from "@libPages/_error";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";

import HomeWeb from "@libDesktop/pages/home";

interface widgetProps {
  slug: string;
  errorCode: number;
  homeWidgets: Array<any>;
}

const BrandName = (props: widgetProps) => {
  if (props.errorCode) {
    return <ErrorComponent statusCode={props.errorCode} />;
  }

  if (IS_DESKTOP) {
    return <HomeWeb {...props} />;
  }

  return <Home {...props} />;
};

BrandName.getInitialProps = async (ctx: any) => {
  const { slug } = ctx.query || {};

  const widgetApi = new WidgetAPI();

  const slugOrId = `${IS_DESKTOP ? "website" : "mobile-site"}-brand-${slug}`;

  try {
    const where = { slugOrId };

    const { data } = await widgetApi.getHomeWidgets({ where }, 15, 0, false).catch(e => {
      return { data: {} };
    });
    const homeWidgets = data?.data?.data?.widget || [];

    if (homeWidgets.length === 0) {
      // log URI for help with debugging using cloudwatch logs
      // not able to get source-maps to work with console.log on the server
      // ideally we should we using something like Sentry
      // or use newrelic to log with proper tracebacks etc.
      logURI(ctx.asPath);
      if (ctx.res) {
        ctx.res.statusCode = 404;
        return { errorCode: 404 };
      }
    }

    return {
      slug: slugOrId,
      homeWidgets,
    };
  } catch (error: any) {
    console.error(error);

    // log URI for help with debugging using cloudwatch logs
    // not able to get source-maps to work with console.log on the server
    // ideally we should we using something like Sentry
    // or use newrelic to log with proper tracebacks etc.
    logURI(ctx.asPath);
    if (ctx.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }

    return {};
  }
};

export default BrandName;
