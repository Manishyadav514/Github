import React, { useEffect, useState } from "react";

import Router from "next/router";
import uniqBy from "lodash.uniqby";
import { useInView } from "react-intersection-observer";

import PLPAPI from "@libAPI/apis/PLPAPI";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import CollectionHead from "@libComponents/Collection/CollectionHead";

import { logURI } from "@libUtils/debug";
import { decodeHtml } from "@libUtils/decodeHtml";
import { handlePartnershipData } from "@libUtils/getDiscountPartnership";

import useTranslation from "@libHooks/useTranslation";

import { patchCollectionProductRes } from "@PLPLib/collection/patchProductRes";

import PLPFaq from "../Components/PLP/PLPFaq";
import PLPDesc from "../Components/PLP/PLPDesc";
import ProductTile from "../Components/PLP/ProductTile";
import { urlJoin } from "@libUtils/urlJoin";
import { isClient } from "@libUtils/isClient";
import useDiscountPartnership from "@libHooks/useDiscountPartnership";

interface CollectionProps {
  collectionData: any;
  productsData: any;
  count: number;
  partnerShipData: any;
}

const Collection = ({ collectionData, productsData, count, partnerShipData }: CollectionProps) => {
  const { t } = useTranslation();
  const { inView, ref } = useInView();

  const { content } = collectionData?.cms?.[0] || {};
  const checkSeoFaq = content?.seoFaq?.[0]?.question;

  const [skip, setSkip] = useState(10);
  const [products, setProducts] = useState(uniqBy(productsData, "id") || []);

  const setProductsData = (data: any) => setProducts(uniqBy(data, "id") || []);

  const { partnershipData: getLocalPartnershipData } = useDiscountPartnership({
    products: collectionData.products,
    SSRPartnerShipData: partnerShipData,
  });

  const getMoreProducts = async () => {
    const plpAPI = new PLPAPI();
    const { data: collectionDataV2 } = await plpAPI.getCollectionV2(
      { "urlShortner.slug": `/collection/${Router.query.collection}` },
      skip
    );

    setProductsData([...products, ...(collectionDataV2?.data?.products || [])]);
    setSkip(skip + 10);
  };

  useEffect(() => {
    const handleScrollPartnerShip = async () => {
      await handlePartnershipData({ products: collectionData.products, skip });
    };
    handleScrollPartnerShip();
  }, [skip]);

  useEffect(() => {
    setProductsData(productsData);
  }, [collectionData]);

  useEffect(() => {
    if (inView && skip < count) {
      getMoreProducts();
    }
  }, [inView]);

  return (
    <main className="bg-white py-2">
      <CollectionHead collection={collectionData} products={products} />

      <section className="max-w-screen-xl px-24 mx-auto">
        <div className="text-center relative w-max mx-auto">
          <ImageComponent
            alt={content?.name}
            className="mx-auto"
            src={collectionData?.assets[0]?.url}
            style={{ maxWidth: "400px", maxHeight: "400px" }}
          />

          <div
            style={{ boxShadow: "0 0 5px 0 #e8e8e8", left: "85%" }}
            className="p-2.5 pb-6 pl-12 absolute inset-y-0 my-auto h-max w-max max-w-lg bg-white text-left"
          >
            <div className="pt-2 pb-10">
              <h1
                className="font-bold text-5xl"
                style={{ background: "linear-gradient(180deg,transparent 72%,var(--color1) 0)" }}
              >
                {content?.name}
              </h1>
            </div>

            {content.shortDescription ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: decodeHtml(content.shortDescription),
                }}
              />
            ) : (
              t("makeupStayText")
            )}
          </div>
        </div>

        <h3 className="text-5xl bg-title-pattern font-bold text-center my-12 w-max mx-auto">{t("products")}</h3>

        <div className="grid grid-cols-3 gap-8">
          {products.map((product: any, index: number) => {
            const partnershipData = (isClient() ? getLocalPartnershipData?.couponList : partnerShipData?.couponList)?.find(
              (data: any) => data.productId === product.id
            );

            const productURL = partnershipData?.payableAmount
              ? `${urlJoin(product.urlManager?.url)}discountCode=${
                  getLocalPartnershipData?.partnershipCoupon || partnerShipData?.partnershipCoupon
                }`
              : product.urlManager?.url;

            return (
              <ProductTile
                key={(product as any).id}
                prodRef={index === products.length - 5 ? ref : null}
                product={patchCollectionProductRes(product, partnershipData, productURL)}
              />
            );
          })}
        </div>

        <PLPDesc pageDescription={content.longDescription} />
        <PLPFaq faq={checkSeoFaq ? content?.seoFaq : content?.faq} type={checkSeoFaq && "seoFaq"} />
      </section>
    </main>
  );
};

Collection.getInitialProps = async (ctx: any) => {
  const { collection, discountCode } = ctx.query;

  try {
    const plpAPI = new PLPAPI();
    const { data: collectionDataV2 } = await plpAPI.getCollectionV2(
      { "urlShortner.slug": `/collection/${collection}` },
      0,
      true
    );

    if (collectionDataV2?.data?.count === 0) {
      logURI(ctx.asPath);

      if (ctx.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Collection Not Found");
      }
      return { errorCode: 404 };
    }

    const partnerShipData = discountCode
      ? await handlePartnershipData({ products: collectionDataV2?.data?.data?.products, discountCode, skip: 0 })
      : {};

    return {
      collectionData: collectionDataV2?.data?.data,
      productsData: collectionDataV2?.data?.products,
      count: collectionDataV2?.data?.count,
      partnerShipData,
    };
  } catch (error) {
    logURI(ctx.asPath);

    if (ctx.res) {
      console.error(error, collection);
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }
    return {
      errorCode: 404,
    };
  }
};

export default Collection;
