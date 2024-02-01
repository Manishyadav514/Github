import React, { Fragment } from "react";

import { useRouter } from "next/router";
import { BASE_URL } from "@libConstants/COMMON.constant";

const PLPSchema = ({ products }: any) => {
  const router = useRouter();

  /* Converting 2D Array to 1D */
  const productData = [].concat(...products);

  /**PLP Schema */
  const schema = {
    "@context": "https://schema.org/",
    "@type": "ItemList",
    itemListElement: productData
      .filter((items: any) => items?.URL && items?.productName) // widget handling
      .map((items: any, key: number) => ({
        "@type": "ListItem",
        position: key,
        url: items.URL,
        name: items.productName,
      })),
  };

  /** Breadcrumb Schema */
  let pathname = BASE_URL();
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: pathname,
      },
    ],
  };
 

  if (router?.asPath) {
    router.asPath.split("/").map((path, key) => {
      if (path === "") return;
      pathname += "/" + path.split("?")[0];
      if (path.endsWith("buy")) return;
      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        position: key,
        name: path.split("?")[0],
        item: pathname,
      });
    });
  }

  if (productData.length > 0) {
    return (
      <Fragment>
        {/* PLP - SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />

        {/* Breadcrumb - SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      </Fragment>
    );
  }

  return null;
};

export default PLPSchema;
