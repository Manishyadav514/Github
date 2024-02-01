import React from "react";
import Head from "next/head";

import decodeEntities from "@libUtils/helper";

interface MetaTagProps {
  seoData: any[];
  title: string;
  canonicalUrl: string;
  pageNumber?: number;
}

const MetaTags = ({ seoData, title, canonicalUrl, pageNumber }: MetaTagProps) => {
  const tags = seoData?.map((item: any) => {
    let content = decodeEntities(item?.attributes?.content || "");

    if (["og:title", "twitter:title"].includes(item?.attributes?.property) && !item?.attributes?.content) {
      return React.createElement(item?.tag, {
        key: item?.attributes?.property,
        ...(item?.attributes || {}),
        content: decodeEntities(title),
        property: item?.attributes?.property || item?.attributes?.name,
        name: item?.attributes?.name || item?.attributes?.property,
      });
    }

    if (["og:url", "twitter:url"].includes(item?.attributes?.property)) {
      return React.createElement(item?.tag, {
        key: item?.attributes?.property,
        ...(item?.attributes || {}),
        content: canonicalUrl,
        property: item?.attributes?.property || item?.attributes?.name,
        name: item?.attributes?.name || item?.attributes?.property,
      });
    }

    if (item?.attributes?.rel === "canonical") {
      return React.createElement(item?.tag, {
        key: item?.attributes?.property,
        content,
        rel: "canonical",
        href: decodeEntities(item?.attributes?.href) || canonicalUrl,
      });
    }
    if (item?.attributes?.name === "description") {
      return React.createElement(item?.tag, {
        key: item?.attributes?.property || item?.attributes?.name,
        ...(item?.attributes || {}),
        // ...(item?.tag === "meta" && { property: item?.attributes?.property || item?.attributes?.name }),
        ...(item?.tag === "meta" && { name: item?.attributes?.name || item?.attributes?.property }),
        content: `${content} ${pageNumber && pageNumber > 1 ? `- Page ${pageNumber}` : ""}`,
      });
    }
    if (item?.tag === "title") {
      return React.createElement(
        item?.tag,
        {
          key: "title",
        },
        decodeEntities(`${item?.attributes?.content || title} ${pageNumber && pageNumber > 1 ? `- Page ${pageNumber}` : ""}`)
      );
    }
    return React.createElement(item?.tag, {
      key: item?.attributes?.property || item?.attributes?.name,
      ...(item?.attributes || {}),
      ...(item?.tag === "meta" && { property: item?.attributes?.property }),
      ...(item?.tag === "meta" && { name: item?.attributes?.name || item?.attributes?.property }),
      content,
    });
  });

  return <Head>{tags}</Head>;
};

export default MetaTags;
