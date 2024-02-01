import React, { useState, useEffect } from "react";
import Link from "next/link";
import Ripples from "@libUtils/Ripples";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import useTranslation from "@libHooks/useTranslation";
import WidgetLabel from "./WidgetLabel";
import recommendationHelper from "@libUtils/recommendationHelper";
import useDsAdobe from "@libHooks/useDsAdobe";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import { formatPrice } from "@libUtils/format/formatPrice";

const SingleProductCard = ({ product, productPosition, icid, index, productArrayLength }: any) => {
  const { assets } = product;
  const { t } = useTranslation();
  const Index = (i: any) => i.type === "image";
  const commonICID = !icid
    ? product.urlManager.url
    : `${product.urlManager.url}?icid=${icid}_${product.cms[0]?.content.name.toLowerCase()}_${productPosition}`;

  return (
    <Ripples>
      <Link
        href={commonICID}
        prefetch={false}
        id={`carousel-item-${index + 1}`}
        role="tabpanel"
        aria-roledescription="slide"
        aria-label={product.cms[0]?.content.name}
      >
        <div className="flex justify-center p-8">
          <ImageComponent
            className="w-full h-full"
            alt={product.cms[0]?.content.name}
            src={assets[assets.findIndex(Index)]?.imageUrl?.["400x400"]}
          />
        </div>
        <div className="px-6">
          <h2 className="text-base text-black font-bold text-center mb-2" style={{ color: "#212529" }}>
            {product.cms[0]?.content.name}
          </h2>
          <p className="text-xs font-light text-center opacity-75" style={{ color: "#212529" }}>
            {product.cms[0]?.content.subtitle}
          </p>
        </div>
        <div className="flex justify-center items-center text-center">
          {product.offerPrice < product.price ? (
            <div className="flex">
              <h2 className="text-lg text-center font-bold" style={{ color: "#212529" }}>
                {formatPrice(product.offerPrice, true)}
              </h2>
              <h2 className="text-sm pl-2 text-gray-600 pt-1 line-through">{formatPrice(product.offerPrice, true)}</h2>
            </div>
          ) : (
            <h2 className="text-lg font-bold" style={{ color: "#212529" }}>
              {formatPrice(product.offerPrice, true)}
            </h2>
          )}
        </div>
        <div className="flex justify-center items-center my-4">
          <a
            className="text-center text-sm tracking-wider text-gray-900 border border-black font-semibold outline-none px-4 py-1 rounded-sm"
            style={{
              width: "159px",
              boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.19)",
            }}
            aria-label={t("shopNow")?.toUpperCase()}
          >
            {t("shopNow")?.toUpperCase()}
          </a>
        </div>
      </Link>
    </Ripples>
  );
};

function MultipleProductCarousel({ item, icid }: any) {
  const [dsWidgetType, setDsWidgetType] = useState("");
  const [widgetData, setWidgetData] = useState<any>();

  useEffect(() => {
    recommendationHelper(item.meta?.widgetMeta, item.commonDetails).then((res: any) =>
      setWidgetData({
        products: res.products,
        dsWidgetType: res.dsWidgetType,
      })
    );
  }, []);

  const { dsWidgetRef } = useDsAdobe({
    title: item.commonDetails?.title,
    dsWidgetType: widgetData?.dsWidgetType,
    products: widgetData?.products,
  });

  return (
    <ErrorBoundary>
      <section
        className="MultipleCollectionWidget mt-5 mb-2 px-3"
        ref={dsWidgetRef}
        role="banner"
        aria-roledescription="carousel"
        aria-label={item?.commonDetails?.title || item?.commonDetails?.subTitle}
      >
        <WidgetLabel title={item.commonDetails.title} />
        <GoodGlammSlider dots="full">
          {widgetData?.products?.map((product: any, index: number) => (
            <SingleProductCard
              key={product.id}
              product={product}
              icid={icid}
              productPosition={index + 1}
              index={index}
              productArrayLength={widgetData?.products?.length}
            />
          ))}
        </GoodGlammSlider>
      </section>
    </ErrorBoundary>
  );
}

export default MultipleProductCarousel;
