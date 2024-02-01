import React from "react";
import Head from "next/head";
import LazyHydrate from "react-lazy-hydration";

import { PDPProd } from "@typesLib/PDP";

import { BASE_URL } from "@libConstants/COMMON.constant";
import { WEBSITE_URL } from "@libConstants/WEBSITE_URL.constant";

import ProductSchema from "./ProductSchema";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const PDPHead = ({ product }: { product: PDPProd }) => {
  const { urlShortner, cms: CMS, assets, productMeta } = product;

  const [cms] = CMS;

  const ogImage = (assets?.find(x => x.type === "ogImage") || assets?.find(x => x.type === "image"))?.url;

  const THIRD_VENDOR_URL = WEBSITE_URL[process.env.NEXT_PUBLIC_PRODUCT_ENV || "ALPHA"]?.[productMeta?.sellerId];

  return (
    <>
      <Head>
        <title>{cms?.metadata?.title}</title>
        <meta key="description" name="description" content={cms?.metadata?.description} />
        <meta name="keywords" content={cms?.metadata?.keywords} />
        <link
          key="canonical"
          rel="canonical"
          href={
            (THIRD_VENDOR_URL && `${THIRD_VENDOR_URL}${urlShortner.slug}`) ||
            cms?.metadata?.canonicalTag ||
            `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${urlShortner.slug}`
          }
        />
        <meta key="og:title" property="og:title" content={cms?.metadata?.ogTitle || cms?.metadata?.title} />
        <meta
          key="og:description"
          property="og:description"
          content={cms?.metadata?.ogDescription || cms?.metadata?.description}
        />
        <meta key="og:url" property="og:url" content={`${BASE_URL()}${urlShortner.slug}`} />
        {ogImage && <meta key="og:image" property="og:image" content={ogImage} />}
        {cms?.metadata?.noIndex && <meta name="robots" content="noindex" />}
      </Head>

      <LazyHydrate ssrOnly>
        <ProductSchema productData={product} />
      </LazyHydrate>
    </>
  );
};

export default PDPHead;
