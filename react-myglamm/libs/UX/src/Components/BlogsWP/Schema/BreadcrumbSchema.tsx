import React from "react";

import { SHOP } from "@libConstants/SHOP.constant";

import { BASE_URL } from "@libConstants/COMMON.constant";

const BlogSchema = ({ slug }: any) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}`,
        item: `${BASE_URL()}${SHOP.IS_MYGLAMM ? "/glammstudio" : "/blog"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: slug,
        item: `${BASE_URL()}${SHOP.IS_MYGLAMM ? "/glammstudio" : "/blog"}/${slug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema),
      }}
    />
  );
};

export default BlogSchema;
