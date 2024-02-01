import React, { useEffect, useState } from "react";

import uniqBy from "lodash.uniqby";
import format from "date-fns/format";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

import PLPAPI from "@libAPI/apis/PLPAPI";

import { PLPProduct, PlpProductWhere } from "@typesLib/PLP";

import useTranslation from "@libHooks/useTranslation";
import { useInfiniteScrollGA4Event } from "@libHooks/useInfiniteScrollGA4Event";

import { generateWhereForProduct } from "@libServices/PLP/filterHelperFunc";

import { logURI } from "@libUtils/debug";
import { getUpdatedDate } from "@libUtils/getUpdatedDate";
import { GACategoryPageViewed } from "@libUtils/analytics/gtm";

import PLPSeo from "@libComponents/PLP/PLPSeo";
import PLPSchema from "@libComponents/PLP/PLPSchema";

import { patchBreadCrumb } from "@PLPLib/buy/patchBreadCrumb";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import { adobePageLoadEvent } from "@libAnalytics/PLP.Analytics";

import Breadcrumbs from "../Components/breadcrumb";
import ProductTile from "../Components/PLP/ProductTile";

interface BuyProps {
  serverSkip: number;
  categorySlug: string;
  productsData: { data: PLPProduct[]; count: number };
  tags?: string[];
  category: any;
}

const BuyShop = ({ serverSkip, categorySlug, productsData, tags, category }: BuyProps) => {
  const { t } = useTranslation();
  const { inView, ref } = useInView();
  const { asPath, query } = useRouter();

  const categoryName = asPath.includes("/buy/brands") ? t("allProductstitle") : category?.cms?.[0]?.content?.name || "";

  const [skip, setSkip] = useState(serverSkip + 10);
  const [products, setProducts] = useState(uniqBy(productsData.data, "productId") || []);

  const setProductsData = (data: PLPProduct[]) => setProducts(uniqBy(data, "productId") || []);

  const getMoreProducts = async () => {
    const plpAPI = new PLPAPI();
    const { data: plpData } = await plpAPI.getPLPProducts(
      generateWhereForProduct({}, categorySlug, (query.brandNames as string)?.split(",")),
      10,
      skip
    );

    setProductsData([...products, ...(plpData?.data?.data || [])]);
    setSkip(skip + 10);
  };

  useInfiniteScrollGA4Event(
    products.filter(p => !!p.SKU) // skip widgets
  );

  useEffect(() => {
    setSkip(serverSkip + 10);
    setProductsData(productsData.data);

    //  Adobe Analytics [3] Page Load - PLP Collection
    (window as any).digitalData = {
      category: {
        numberOfProducts: productsData?.count,
        category: categoryName,
      },
    };
    adobePageLoadEvent("Product Listing Page", categoryName);

    try {
      const tagsArray: string[] = [];
      const categoryTags = tags || [];

      if (categoryTags.length > 0) {
        categoryTags.map(tag => {
          tagsArray.push(`${tag}-${format(new Date(), "ddMMyy")}`);
        });
      }

      const webengageDataLayer = {
        categoryName: categoryName || "",
        userType: checkUserLoginStatus() ? "Member" : "Guest",
        tags: [...tagsArray, ...categoryTags],
      };
      GACategoryPageViewed(webengageDataLayer);
    } catch (e) {
      console.error("CategoryPageViewed");
    }
  }, [categorySlug]);

  useEffect(() => {
    if (inView && skip < productsData?.count) {
      getMoreProducts();
    }
  }, [inView]);

  return (
    <main className="bg-white">
      <PLPSchema products={products} />

      <section className="max-w-screen-xl mx-auto">
        <Breadcrumbs navData={patchBreadCrumb(categorySlug, categoryName)} />

        <h1 className="text-5xl font-bold bg-title-pattern w-max mx-auto uppercase mt-12">{categoryName}</h1>

        <div className="grid grid-cols-3 gap-8 py-12 px-16">
          {products?.map((product, index: number) => (
            <ProductTile product={product} prodRef={index === products.length - 5 ? ref : null} key={product.productId} />
          ))}
        </div>

        {skip < productsData?.count && (
          <div className="flex justify-center mt-3 mb-1">
            <a href={`${categorySlug}?page=${skip / 10 + 1}`}>{t("next") || "Next"}</a>
          </div>
        )}
      </section>

      <div className="border-b w-full border-gray-300" />

      <div className="w-full max-w-screen-xl py-12 mx-auto">
        <PLPSeo pageNo={skip / 10} showMetaFooter productCount={productsData?.count} catMetaData={category} />
      </div>
    </main>
  );
};

BuyShop.getInitialProps = async (ctx: any) => {
  try {
    const plpApi = new PLPAPI();
    const { Slug: slug, brandNames, page } = ctx.query;

    /* API calls for Category Products and it's Content (metadata, name) */
    const categorySlug = `/buy/${slug?.join("/")}`;

    const selectedBrands = brandNames?.split(",");
    const where: PlpProductWhere = generateWhereForProduct({}, categorySlug, selectedBrands);

    const serverSkip = ((+page || 1) - 1) * 10;
    const [catProductsData, catContentData]: any = await Promise.allSettled([
      plpApi.getPLPProducts(where, 10, serverSkip),
      plpApi.getCategories(undefined, categorySlug),
    ]);

    const catProducts = catProductsData?.value?.data;
    const [catContent] = catContentData?.value?.data?.data?.data || [];

    if (catProducts.data?.data?.length === 0 && ctx.res) {
      ctx.res.statusCode = 404;
      return ctx.res.end();
    }

    const newCategory = getUpdatedDate(catContent);

    return {
      serverSkip,
      categorySlug,
      category: newCategory,
      productsData: {
        ...catProducts.data,
        data: catProducts.data?.data?.map((prod: any) => ({
          ...prod,
          page: page || 1,
        })),
      },
      tags: catContent?.meta?.tag,
    };
  } catch (err) {
    // log URI for help with debugging using cloudwatch logs
    // not able to get source-maps to work with console.log on the server
    // ideally we should we using something like Sentry
    // or use newrelic to log with proper tracebacks etc.
    logURI(ctx.asPath);
    if (ctx.res) {
      console.error(err, ctx.asPath);
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }

    return {
      errorCode: 404,
    };
  }
};

export default BuyShop;
