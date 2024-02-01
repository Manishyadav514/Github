import React from "react";
import Head from "next/head";
import { useAmp } from "next/amp";

import { useRouter } from "next/router";

import { SHOP } from "@libConstants/SHOP.constant";
import { SEO_PROPS } from "@libConstants/SEO.constant";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { BASE_URL, IS_DESKTOP } from "@libConstants/COMMON.constant";

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  site_name: string;
  noIndexing: boolean;
}

const SEOMain = () => {
  const isAmp = useAmp();

  const { locales, locale, asPath } = useRouter();

  const { title, description, keywords, site_name, noIndexing } =
    (SEO_PROPS[SHOP.SITE_CODE as keyof typeof SEO_PROPS] as SEOProps) || {};

  return (
    <Head>
      <meta name="theme-color" content={SHOP.PRIMARY_COLOR || "#fff"} />

      {!isAmp && (
        <React.Fragment>
          {IS_DESKTOP ? (
            <meta
              name="viewport"
              content="width=device-width, maximum-scale=1, minimum-scale=1, initial-scale=1, user-scalable=no, shrink-to-fit=no"
            />
          ) : (
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          )}
          <meta httpEquiv="ScreenOrientation" content="autoRotate:disabled" />
          <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
          <meta httpEquiv="Pragma" content="no-cache" />
          <meta httpEquiv="Expires" content="0" />
        </React.Fragment>
      )}

      {noIndexing && <meta name="robots" key="robots" content="noindex, nofollow" />}

      <link id="favicon" rel="icon" href={SHOP.FAVICON} />
      <link rel="canonical" key="canonical" href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${asPath.split("?")[0]}`} />
      <title key="title">{title}</title>
      <meta key="og:title" property="og:title" content={title} />

      {description && (
        <>
          <meta key="description" name="description" content={description} />
          <meta key="og:description" property="og:description" content={description} />
        </>
      )}

      {keywords && <meta key="keywords" name="keywords" content={keywords} />}

      <meta key="og:type" property="og:type" content="website" />

      {site_name && <meta key="og:site_name" property="og:site_name" content={site_name} />}

      <meta key="og:url" property="og:url" content={BASE_URL()} />

      <meta key="og:image" property="og:image" content={SHOP.LOGO} />

      {locales
        /* Filter out the active website */
        ?.filter(x => x !== locale)
        .map(loc => (
          <link
            key={loc}
            hrefLang={loc}
            rel="alternate"
            href={`${GBC_ENV.NEXT_PUBLIC_BASE_URL}${`/${loc}`.replace("/en-in", "")}`}
          />
        ))}
    </Head>
  );
};

export default SEOMain;
