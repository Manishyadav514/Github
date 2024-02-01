import React from "react";

import { ORGANIZATION_SCHEMA } from "@libConstants/Schema.constant";

import { getVendorCode } from "@libUtils/getAPIParams";
import { SHOP } from "@libConstants/SHOP.constant";
import { BASE_URL } from "@libConstants/COMMON.constant";

const orgSchema = ORGANIZATION_SCHEMA[getVendorCode()];

const BlogSchema = ({ content }: any) => {
  const schema: any = {
    "@context": "https://schema.org/",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL()}${content.urlManager.url}`,
    },

    headline: content.cms[0].content.title,
    description: content.cms[0]?.metadata?.description,
    image: content.assets[0]?.imageUrl?.url,

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

    datePublished: content.publishDate,
    dateModified: content.updatedAt,
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
