import React, { Fragment } from "react";

import { useAmp } from "next/amp";
import { Main, NextScript } from "next/document";

import { BodyStyles } from "@libStyles/TSStyles/body";

import { getStaticUrl } from "@libUtils/getStaticUrl";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import DocFooterScripts from "./_documentFooterScripts";

const DocumentCommon = ({ __NEXT_DATA__ }: { __NEXT_DATA__: any }) => {
  const { NOTP } = __NEXT_DATA__.query;
  const isAmp = useAmp();

  const GTM_KEY = GBC_ENV.NEXT_PUBLIC_GTM_KEY;

  return (
    <Fragment>
      {!NOTP && process.env.PRODUCT_ENV !== "DEV" && GTM_KEY && (
        <noscript>
          <iframe
            title="GTM"
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_KEY}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}

      <div id="smart-banner-container" />

      <Main />
      <NextScript />

      <div id="modal-root" />

      <div id="confetti-root" className="hidden w-full h-full absolute top-0" style={{ zIndex: 1001 }} />

      {!NOTP && GBC_ENV.NEXT_PUBLIC_ADOBE_REPORT_SUITE && !isAmp && (
        // @ts-ignore
        <script src={getStaticUrl("/global/scripts/AppMeasurement.js")} importance="low" fetchpriority="low" async />
      )}

      {!NOTP && !isAmp && BodyStyles}

      <div id="bottom-nav" />

      {!NOTP && !isAmp && <DocFooterScripts __NEXT_DATA__={__NEXT_DATA__} />}
    </Fragment>
  );
};

export default DocumentCommon;
