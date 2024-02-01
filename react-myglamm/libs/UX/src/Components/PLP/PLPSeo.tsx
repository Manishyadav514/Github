import React, { Fragment } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { metaSEO } from "@typesLib/PLP";

import PLPSeoDescritpion from "./PLPSEODescription";
import { BASE_URL } from "@libConstants/COMMON.constant";

interface SEOProps {
  catMetaData: metaSEO | undefined;
  showMetaFooter: boolean;
  pageNo?: number;
  productCount: number;
}

const PLPSeo = ({ catMetaData, showMetaFooter, productCount, pageNo = 1 }: SEOProps) => {
  const router = useRouter();

  const { metadata, content } = catMetaData?.cms[0] || {};
  const checkSeoFaq = content?.seoFaq?.[0]?.question;
  const param = router.query.page ? router.asPath : router.asPath.split("?")[0];

  return (
    <Fragment>
      {/* PLP - HEADERS */}
      <Head>
        {router.asPath.includes("/buy/brands") ? (
          <title>Brands</title>
        ) : (
          <Fragment>
            {(metadata?.title || content?.name) && (
              <title key="title">{`${metadata?.title || content?.name}${pageNo > 1 ? " | Page " + pageNo : ""}`}</title>
            )}
            <meta key="description" name="description" content={metadata?.description} />
            <meta key="keywords" name="keywords" content={metadata?.keywords} />
          </Fragment>
        )}

        <link rel="canonical" key="canonical" href={metadata?.canonicalTag || `${BASE_URL()}${param}`} />

        {pageNo - 1 > 0 && (
          <link rel="prev" href={`${BASE_URL()}${router.asPath.split("?")[0]}${pageNo - 1 > 1 ? `?page=${pageNo - 1}` : ""}`} />
        )}
        {pageNo * 10 <= productCount && (
          <link rel="next" href={`${BASE_URL()}${router.asPath.split("?")[0]}?page=${pageNo + 1}`} />
        )}

        {metadata?.noIndex && <meta name="robots" content="noindex" />}
      </Head>

      {/* PLP - FOOTER */}
      {showMetaFooter && (
        <Fragment>
          {/* PAGE DESCRIPTION */}
          <PLPSeoDescritpion desc={metadata?.pageDescription} />
          {/* FAQ and SeoFaq */}
          <PLPSeoDescritpion desc={checkSeoFaq ? content?.seoFaq : content?.faq} faq={true} type={checkSeoFaq && "seoFaq"} />
        </Fragment>
      )}
    </Fragment>
  );
};

export default PLPSeo;
