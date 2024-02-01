import React from "react";
import Head from "next/head";

import { BASE_URL } from "@libConstants/COMMON.constant";

import { decodeEntities } from "@libUtils/BlogUtils";

const BlogCategoryHead = ({ seoTags, slug }: any) => {
  return (
    <Head>
      {seoTags?.map((seo: any) => {
        const { tag, attributes } = seo || {};

        switch (tag) {
          case "title":
            return <title key="title">{decodeEntities(seo?.content)}</title>;

          case "meta":
            const { name, property, content } = attributes || {};

            if (name === "description") {
              return <meta key="description" name="description" content={decodeEntities(content)} />;
            }

            if (property === "robots") {
              const { noindex } = content || {};
              if (noindex) {
                return <meta name="robots" content="noindex" />;
              }
              return null;
            }

            if (property) {
              return <meta key={property} property={property} content={decodeEntities(content)} />;
            }

            break;

          default:
            return null;
        }
      })}
      <link key="canonical" rel="canonical" href={`${BASE_URL()}/blog/${slug}`} />
    </Head>
  );
};

export default BlogCategoryHead;
