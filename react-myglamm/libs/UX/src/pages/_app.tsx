// import "axios-debug-log"; // after pnpm install this package and uncomment this line, terminal will start showing SSR calls
// needs DEBUG=axios to activate from terminal

declare global {
  var apiCache: {
    [char in langLocale]?: {
      countryConstants?: CountryConfig[];
      topBanner?: any;
      footer?: any;
      configV3?: any;
      timestamp?: number;
      headerMenu?: any;
    };
  };
  /* To-do add types */
  var pcCache: any;
  var awCache: any;
  var COMMUNITY_BASE_URL: string | undefined;
}
globalThis.COMMUNITY_BASE_URL = process.env.NEXT_PUBLIC_APIV2_URL;
globalThis.apiCache = {};
globalThis.pcCache = {};
globalThis.awCache = {};

initPolyfills();
// @ts-ignore
import { initCat } from "@libUtils/insightCat";
if (isClient()) {
  initCat();
}
loadAdobe();

import App from "next/app";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { AppProps } from "next/dist/shared/lib/router/router";
import React, { ReactElement, ReactNode, useEffect, useMemo, useState } from "react";

import withReduxStore from "@libStore/with-redux";

import { isClient } from "@libUtils/isClient";
import { isWebview } from "@libUtils/isWebview";
import { setInitConstants } from "@libUtils/withReduxUtils";
import { initPolyfills, loadAdobe, setAPIOptions } from "@libUtils/_apputils";
import { REGEX } from "@libConstants/REGEX.constant";
import SEOMain from "@libComponents/LayoutComponents/SEOMain";

import { CountryConfig } from "@typesLib/Redux";
import { langLocale } from "@typesLib/APIFilters";

import { SHOP } from "@libConstants/SHOP.constant";
import { getGBCFont } from "@libConstants/FONTS.constant";
import { BLACKLIST_URLS } from "@libConstants/BLACKLIST.constant";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const Layout = dynamic(() => import("@libLayouts/Layout" /* webpackChunkName: "DefaultLayout" */));
const LocalStorageFallback = dynamic(() => import("@libComponents/LayoutComponents/LocalStorageFallback"), { ssr: false });
const UseApp = dynamic(() => import("@libComponents/LayoutComponents/UseApp" /* webpackChunkName: "UseApp" */), { ssr: false });
const GlobalComponent = dynamic(
  () => import("@libComponents/LayoutComponents/GlobalComponent") /* webpackChunkName: "GlobalComponent" */,
  { ssr: false }
);

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function isLocalStorageAvailable() {
  var test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
function MyApp(props: AppPropsWithLayout) {
  if (isClient()) {
    if (!isLocalStorageAvailable()) {
      return <LocalStorageFallback />;
    }
  }

  const { Component, pageProps, store, router, headers, productCatalogCache } = props;

  useMemo(() => {
    globalThis.pcCache[`${router.locale}-${headers?.vendor || store.vendor}`] = productCatalogCache;
    setInitConstants(store, headers);
    setAPIOptions(store.constantReducer.countryConstants, router.query?.bustCache as string);
  }, []);

  /* Use the layout defined at the page level, if available */
  const DEFAULT_LAYOUT = (page: ReactElement) => <Layout>{page}</Layout>;

  const [onMount, setOnMount] = useState(false);

  // Exception for BBC Webview
  useEffect(() => {
    if (router.query.request_source !== "mobile_app" && "WV" in sessionStorage) {
      setOnMount(true);
    }
  }, []);

  const getLayout =
    (onMount && isWebview()) || router.query.request_source === "mobile_app"
      ? (page: ReactElement) => page
      : Component.getLayout ?? DEFAULT_LAYOUT ?? (page => page);

  const isBBCAmp = router.asPath.includes("amp.html") && SHOP.SITE_CODE === "bbc";
  const hasOwnSEO = router.pathname.match(REGEX.OWN_SEO_PAGES);

  return (
    <div className={getGBCFont(headers?.vendor)}>
      <SEOMain />

      {/* Custom Hook For App Functions need to initiated on mount - inside component to lazload */}
      <UseApp store={store} />
      {getLayout(<Component {...pageProps} />)}

      {/* Contains All Logic that is runned globally */}
      {!isBBCAmp && <GlobalComponent />}
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
