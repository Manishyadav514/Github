import React, { ReactElement, useEffect, useState } from "react";

import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import dynamic from "next/dynamic";

import { PDPProd, ProductData } from "@typesLib/PDP";

import WidgetAPI from "@libAPI/apis/WidgetAPI";
import ProductAPI from "@libAPI/apis/ProductAPI";

import { SLUG } from "@libConstants/Slug.constant";

import { PDP_API_INCLUDES } from "@productLib/pdp/PDP.constant";

import { formatPrice } from "@libUtils/format/formatPrice";

import useAddtoBag from "@libHooks/useAddToBag";
import useTranslation from "@libHooks/useTranslation";

import Widgets from "@libComponents/HomeWidgets/Widgets";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

const SubmitReview = dynamic(() => import("@libComponents/PDP/Reviews/SubmitReview"), { ssr: false });

const ExploreProduct = ({ productData, widgetData }: { productData: ProductData; widgetData: any }) => {
  const { t } = useTranslation();
  const { addProductToCart } = useAddtoBag();

  const [loader, setLoader] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean | undefined>();

  const { backgroundImage } = JSON.parse(widgetData?.[0]?.meta?.widgetMeta || "{}");
  const { assets, productTag, cms, price, offerPrice, urlShortner, productMeta } = productData;

  const handleAddToBag = () => {
    setLoader(true);

    addProductToCart(productData, productMeta.isPreOrder ? 3 : 1).then(res => {
      if (res) Router.push("/shopping-bag");

      setLoader(false);
    });
  };

  useEffect(() => {
    addEventListener("reviewPopup", () => setShowReviewModal(true));

    return () => {
      removeEventListener("reviewPopup", () => setShowReviewModal(true));
    };
  }, []);

  return (
    <main style={{ backgroundImage }} className="bg-cover bg-no-repeat bg-center">
      <Head>
        <title>Explore Product | {productTag}</title>
      </Head>

      <style jsx global>
        {`
          .MultimediaCarousel4 {
            background-color: transparent;
          }
        `}
      </style>

      <Widgets widgets={widgetData} />

      <div className="px-3 py-6">
        <Link href={urlShortner.slug} className="w-full rounded-lg flex p-4 bg-white mb-5">
          <div className="w-1/4">
            <ImageComponent
              forceLoad
              className="w-full"
              src={assets[0]?.imageUrl["200x200"]}
              alt={assets[0]?.properties?.imageAltTag}
            />
          </div>

          <div className="w-3/4 pl-2">
            <p className="h-8 text-xs line-clamp-2 mb-4">{cms[0].content.name}</p>

            <div className="flex items-center mb-2">
              <div className="relative mr-1">
                <ImageComponent
                  className="rounded w-3 h-3"
                  src={cms[0].attributes.shadeImage}
                  alt={cms[0].attributes.shadeLabel}
                />
                <div className="bg-white rounded-full h-1 w-1 absolute m-auto inset-0" />
              </div>

              <p className="uppercase pt-0.5 text-gray-400 font-bold text-10">{cms[0].attributes.shadeLabel}</p>
            </div>

            <div className="flex items-center">
              <span className="font-bold text-lg">{formatPrice(offerPrice, true)}</span>
              {offerPrice < price && <del className="text-xs opacity-50 ml-1">{formatPrice(price, true)}</del>}
            </div>
          </div>
        </Link>

        <button
          type="button"
          disabled={loader}
          onClick={handleAddToBag}
          className="bg-black text-white font-bold w-full rounded h-12 relative"
        >
          {loader && <LoadSpinner className="absolute inset-0 m-auto w-8" />}
          {productMeta.isPreOrder ? t("preOrder") : t("addToBag")}
        </button>
      </div>

      {typeof showReviewModal === "boolean" && (
        <SubmitReview
          product={productData as PDPProd}
          reviewFormModal={showReviewModal}
          hideReviewFormModal={() => setShowReviewModal(false)}
        />
      )}
    </main>
  );
};

ExploreProduct.getLayout = (page: ReactElement) => page;

ExploreProduct.getInitialProps = async (ctx: any) => {
  const { slug } = ctx.query;

  const widgetApi = new WidgetAPI();
  const productApi = new ProductAPI();

  const [product, widget]: any = await Promise.allSettled([
    productApi.getProduct({ "urlManager.url": `/product/${slug.split("?")[0]}` }, 0, PDP_API_INCLUDES),
    widgetApi.getHomeWidgets({ where: { slugOrId: SLUG().PDP_EXPLORE_PRODUCT } }, 5, 0, false),
  ]);

  const [productData] = product.value.data?.data?.data || [];

  if (ctx.res && !productData?.id) {
    ctx.res.statusCode = 404;
    return ctx.res.end("Not Found");
  }

  // @ts-ignore
  globalThis.htmlReplaceArray = [productData?.productTag];

  return { productData: product.value.data?.data?.data?.[0], widgetData: widget.value?.data?.data?.data?.widget };
};

export default ExploreProduct;
