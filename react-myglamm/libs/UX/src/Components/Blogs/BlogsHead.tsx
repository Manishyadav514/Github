import React, { useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { ADOBE } from "@libConstants/Analytics.constant";
import { BASE_URL } from "@libConstants/COMMON.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { SHOP } from "@libConstants/SHOP.constant";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import { formatPrice } from "@libUtils/format/formatPrice";

import BlogSchema from "./BlogSchema";

interface BlogHeadProps {
  content: any;
  products: any[];
  category?: string;
  academyMeta?: string;
  header: string;
}

const BlogsHead = ({ content, category, academyMeta, products, header }: BlogHeadProps) => {
  const { asPath } = useRouter();

  const image = content?.assets?.find((a: any) => a.type === "image")?.url;

  // Adobe Analytics[38] - Page Load - glammstudio/blog category
  useEffect(() => {
    const ddlProducts: any[] = [];
    if (products?.length > 0) {
      const prepareProductsDatalayer = async () => {
        products.forEach((product: any) => {
          let ddlPWP = "";
          let ddlProductOfferPrice = 0;
          let ddlProductPrice = 0;
          let ddlProductDiscountedPrice = 0;

          if (product.freeProducts) {
            // prepare PWP string.
            product.freeProducts.forEach((freeProduct: any) => {
              if (product.freeProducts.length === 1) {
                ddlPWP = freeProduct.productTag;
              } else {
                ddlPWP = "{< category name of the product>}";
              }
            });
          }

          // prepare product price & offer price x quantity
          ddlProductOfferPrice = formatPrice(product.offerPrice) as number;
          ddlProductPrice = formatPrice(product.price) as number;
          ddlProductDiscountedPrice = parseFloat((ddlProductPrice - ddlProductOfferPrice).toString());

          //
          ddlProducts.push({
            productQuantity: 1,
            productSKU: product.sku,
            productOfferPrice: ddlProductOfferPrice,
            productPrice: ddlProductPrice,
            productDiscountedPrice: ddlProductDiscountedPrice,
            productRating: "",
            productTotalRating: "",
            stockStatus: product.inStock ? "in stock" : "out of stock",
            isPreOrder: product.productMeta.isPreOrder ? "yes" : "no",
            PWP: ddlPWP,
            hasTryOn: "no",
          });
        });
      };
      prepareProductsDatalayer();
    }
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|glammstudio|${content?.cms[0]?.content?.name.toLowerCase()}`,
        newPageName: "blog detail",
        subSection: header,
        assetType: "blog",
        newAssetType: "content",
        platform: ADOBE.PLATFORM,
        technology: ADOBE.TECHNOLOGY,
      },
      blog: {
        blogName: `${content?.cms[0]?.content?.name.toLowerCase()}`,
        blogCategory: `${header}`,
      },
      product: ddlProducts,
    };
  }, []);

  return (
    <>
      <Head>
        <title key="title">
          {category === "myglamm-academy"
            ? `GlammAcademy Course - ${academyMeta}`
            : content?.cms[0]?.metadata?.title || content?.cms[0]?.content?.title}
        </title>
        <meta key="description" name="description" content={content?.cms[0]?.metadata?.description} />
        <meta key="keywords" name="keywords" content={content?.cms[0]?.metadata?.keywords} />
        <link
          key="canonical"
          rel="canonical"
          href={content?.cms[0]?.metadata?.canonicalTag || `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${asPath.split("?")[0]}`}
        />

        <meta
          key="og:title"
          property="og:title"
          content={category === "myglamm-academy" ? `GlammAcademy Course - ${academyMeta}` : content?.cms[0]?.metadata?.title}
        />
        <meta key="og:description" property="og:description" content={content?.cms[0]?.metadata?.description} />
        <meta key="og:url" property="og:url" content={`${BASE_URL()}${asPath}`} />
        <meta key="og:image" property="og:image" content={image || SHOP.LOGO} />
        <link rel="amphtml" href={`${BASE_URL()}/amp${asPath.split("?")[0]}`} />

        {content?.cms[0]?.metadata?.noIndex && <meta name="robots" content="noindex" />}
      </Head>

      <BlogSchema content={content} />
    </>
  );
};

export default BlogsHead;
