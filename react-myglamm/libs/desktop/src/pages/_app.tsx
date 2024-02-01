declare global {
  var apiCache: {
    [char in langLocale]?: {
      countryConstants?: CountryConfig[];
      topBanner?: any;
      footer?: any;
      headerMenu?: any;
      configV3?: any;
      timestamp?: number;
    };
  };
  var pcCache: any;
  var awCache: any;
  var COMMUNITY_BASE_URL: string | undefined;
}
globalThis.COMMUNITY_BASE_URL = process.env.NEXT_PUBLIC_APIV2_URL;
globalThis.apiCache = {};
globalThis.pcCache = {};
globalThis.awCache = {};

// @ts-ignore
import { initCat } from "@libUtils/insightCat";
if (isClient()) {
  initCat();
}

import App from "next/app";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { AppProps } from "next/dist/shared/lib/router/router";
import React, { ReactElement, ReactNode, useMemo } from "react";

import withReduxStore from "@libStore/with-redux";

import { isClient } from "@libUtils/isClient";
import { setInitConstants } from "@libUtils/withReduxUtils";
import { initPolyfills, loadAdobe, setAPIOptions } from "@libUtils/_apputils";

import { getGBCFont } from "@libConstants/FONTS.constant";
import { BLACKLIST_URLS } from "@libConstants/BLACKLIST.constant";

import SEOMain from "@libComponents/LayoutComponents/SEOMain";

import { CountryConfig } from "@typesLib/Redux";
import { langLocale } from "@typesLib/APIFilters";

const Layout = dynamic(() => import(/* webpackChunkName: "LayoutDesktop" */ "../Components/layout/layout"));

const UseApp = dynamic(() => import("@libComponents/LayoutComponents/UseApp" /* webpackChunkName: "UseApp" */), { ssr: false });

const GlobalComponent = dynamic(
  () => import(/* webpackChunkName: "GlobalComponent" */ "../Components/layout/GlobalComponent"),
  { ssr: false }
);

initPolyfills();
loadAdobe();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp(props: AppPropsWithLayout) {
  const { Component, pageProps, store, router, headers } = props;

  useMemo(() => {
    setAPIOptions(store.constantReducer.countryConstants, router.query?.bustCache as string);

    setInitConstants(store, headers);
  }, []);

  const getLayout = Component.getLayout ?? (page => <Layout>{page}</Layout>);

  return (
    <div className={getGBCFont(headers?.vendor)}>
      <SEOMain />

      {/* Custom Hook For App Functions need to initiated on mount - inside component to lazload */}
      <UseApp store={store} />

      {getLayout(<Component {...pageProps} />)}

      {/* Contains All Logic that is runned globally */}
      <GlobalComponent />
    </div>
  );
}

MyApp.getInitialProps = async (ctx: any) => {
  const blockedPages = (ctx.ctx.configV3?.blacklistUrls || []).find((x: string) =>
    x.startsWith("/")
      ? ctx.router.pathname.startsWith(x)
      : BLACKLIST_URLS[x]?.find((y: string) => ctx.router.pathname.startsWith(y))
  );
  if (blockedPages) {
    ctx.ctx.res.statusCode = 404;
    return ctx.ctx.res.end("Page Not Found");
  }

  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(ctx);

  return { ...appProps };
};

export default withReduxStore(MyApp);
