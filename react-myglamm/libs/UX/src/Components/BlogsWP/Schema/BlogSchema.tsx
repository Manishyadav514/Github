import React from "react";

import { ORGANIZATION_SCHEMA } from "@libConstants/Schema.constant";

import { convertHTMLToStr } from "@libUtils/BlogUtils";

import { getVendorCode } from "@libUtils/getAPIParams";
import { SHOP } from "@libConstants/SHOP.constant";
import { BASE_URL } from "@libConstants/COMMON.constant";

const BlogSchema = ({ blogDetails }: any) => {

  const orgSchema = ORGANIZATION_SCHEMA[getVendorCode()];
  const schema: any = {
    "@context": "https://schema.org/",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL()}/blog/${blogDetails.slug}`,
    },

    headline: convertHTMLToStr(blogDetails?.title?.rendered),
    description: convertHTMLToStr(blogDetails?.excerpt?.rendered),
    image: blogDetails?._embedded?.["wp:featuredmedia"]?.[0]?.source_url,

    author: {
      "@type": "Person",
      name: orgSchema?.name || "MyGlamm",
    },

    publisher: {
      "@type": "Organization",
      name: orgSchema?.name || "MyGlamm",
      logo: {
        "@type": "ImageObject",
        url: `${SHOP.LOGO}`,
      },
    },

    datePublished: blogDetails.date,
    dateModified: blogDetails.modified,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
};

export default BlogSchema;
