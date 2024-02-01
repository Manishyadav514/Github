import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { BASE_URL } from "@libConstants/COMMON.constant";

import { decodeEntities } from "@libUtils/BlogUtils";

const BlogDetailHead = ({ seoTags, slug, isAmp = false }: any) => {
  const router = useRouter();

  return (
    <Head>
      {seoTags?.map((seo: any) => {
        if (seo?.tag === "title") {
          return <title key="title">{decodeEntities(seo.content)}</title>;
        }
        if (seo?.tag === "meta") {
          if (seo?.attributes?.name === "description") {
            return <meta key="description" name="description" content={decodeEntities(seo?.attributes?.content)} />;
          }
          if (seo?.attributes?.property === "robots" && seo?.attributes?.content.hasOwnProperty("noindex")) {
            if (seo?.attributes?.content?.noindex) {
              return <meta name="robots" content="noindex" />;
            }
            return null;
          }

          if (seo?.attributes?.property) {
            return (
              <meta
                key={seo?.attributes?.property}
                property={seo?.attributes?.property}
                content={decodeEntities(seo?.attributes?.content)}
              />
            );
          }
        }
        return null;
      })}
      <link rel="canonical" key="canonical" href={`${BASE_URL()}/blog/${slug}`} />
      {isAmp ? (
        <>
          <script
            async
            key="amp-analytics"
            custom-element="amp-analytics"
            src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
          />

          <script async key="amp-iframe" custom-element="amp-iframe" src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js" />
          <script async custom-element="amp-youtube" src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js" />

          <script async custom-element="amp-instagram" src="https://cdn.ampproject.org/v0/amp-instagram-0.1.js" />

          <script async custom-element="amp-twitter" src="https://cdn.ampproject.org/v0/amp-twitter-0.1.js" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />

          <link rel="amphtml" href={`${BASE_URL()}${router.asPath.split("?")[0]}`} />
        </>
      ) : (
        <link rel="amphtml" href={`${BASE_URL()}/amp${router.asPath.split("?")[0]}`} />
      )}
    </Head>
  );
};

export default BlogDetailHead;
