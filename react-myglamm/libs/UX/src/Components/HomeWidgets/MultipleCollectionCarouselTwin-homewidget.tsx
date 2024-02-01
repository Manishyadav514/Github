import React, { useState, memo, useEffect, useRef } from "react";
import Ripples from "@libUtils/Ripples";

import Link from "next/link";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import useTranslation from "@libHooks/useTranslation";
import recommendationHelper from "@libUtils/recommendationHelper";
import useDsAdobe from "@libHooks/useDsAdobe";
import WidgetLabel from "./WidgetLabel";
import PDPAvgRating from "@libComponents/PDP/PDPAvgRating";
import { useRouter } from "next/router";
import { formatPrice } from "@libUtils/format/formatPrice";

import BackIcon from "../../../public/svg/backicon.svg";
import { useSplit } from "@libHooks/useSplit";

const TwinCarouselCard = memo(({ product, productPosition, icid }: any) => {
  const { assets } = product;

  const Index = (i: any) => i.type === "image";
  return (
    <div>
      <Ripples>
        <Link
          href={
            !icid
              ? `${product.urlManager.url}`
              : `${product.urlManager.url}?icid=${icid}_${product.cms[0]?.content.name.toLowerCase()}_${productPosition}`
          }
          prefetch={false}
          className="flex justify-center flex-col p-3 ml-2 border-r"
          style={{
            width: "190px",
            height: "300px",
          }}
          aria-label={product.cms[0]?.content.name || product.cms[0]?.content.subtitle}
        >
          <ImageComponent
            className="self-center my-2 pt-2"
            style={{ width: "110px", height: "110px" }}
            alt={product.cms[0]?.content.name || product.cms[0]?.content.subtitle}
            src={assets?.[assets?.findIndex(Index)]?.imageUrl["400x400"]}
          />
          <div className=" relative flex  my-1 items-center justify-between h-5">
            {product?.rating?.avgRating > 0 && (
              <PDPAvgRating
                avgRating={
                  product?.rating?.avgRating % 1 != 0
                    ? product?.rating?.avgRating.toFixed(1)
                    : product?.rating?.avgRating + ".0"
                }
                totalCount={product?.rating?.totalCount}
                size={10}
              />
            )}
          </div>
          <div className="px-2 h-24">
            <h1 className="text-xs text-black font-bold" style={{ color: "#212529" }}>
              {product.cms[0]?.content.name.substring(0, 40)}...
            </h1>
            <p className="text-xs font-light my-1" style={{ color: "#212529" }}>
              {product.cms[0]?.content.subtitle?.substring(0, 40)}...
            </p>
          </div>
          <div className="flex items-center px-2 ">
            {product.offerPrice < product.price ? (
              <div className="flex">
                <h1 className="text-lg  font-bold" style={{ color: "#212529" }}>
                  {formatPrice(product.offerPrice, true)}
                </h1>
                <h1 className="text-sm pl-1 text-gray-600 line-through" style={{ marginTop: "4px" }}>
                  {formatPrice(product.price, true)}
                </h1>
              </div>
            ) : (
              <h1 className="text-lg font-bold" style={{ color: "#212529" }}>
                {formatPrice(product.price, true)}
              </h1>
            )}
          </div>
        </Link>
      </Ripples>
    </div>
  );
});

function MultipleCollectionCarouselTwin({ item, icid }: any) {
  const router = useRouter();
  const [progressWidth, setprogressWidth] = useState(0);
  const [products, setProducts] = useState([]);
  const ContainerRef = useRef<HTMLDivElement>(null);
  const [showDSBestSeller, setShowDSBestSeller] = useState(!!router.query.layout);
  const [experimentIsSet, setExperimentIsSet] = useState(false);
  const [dsWidgetData, setDsWidgetData] = useState<any>();
  const { t } = useTranslation();

  //const data = Object.values(item.commonDetails.descriptionData[0].relationalData.products);

  //A/B test for DS BestSeller
  const splitVariants =
    useSplit({
      experimentsList: [{ id: "bestSellerHomeExperimentID" }],
      deps: [],
    }) || {};

  const { bestSellerHomeExperimentID: variant } = splitVariants || {};

  /* Hide only in case A/B is running and gave 0 as variant */
  useEffect(() => {
    if (variant) {
      setShowDSBestSeller(variant !== "0");
    }
  }, [variant]);

  useEffect(() => {
    recommendationHelper(item.meta?.widgetMeta, item.commonDetails, "", showDSBestSeller).then((res: any) => {
      setProducts(res.products);
      setDsWidgetData({ dsWidgetType: res.dsWidgetType, variantValue: res?.variantValue });
    });
  }, [showDSBestSeller]);

  const { dsWidgetRef } = useDsAdobe({
    title: item.commonDetails.title,
    dsWidgetType: dsWidgetData?.dsWidgetType,
    variantValue: dsWidgetData?.variantValue,
    products: products,
    evarName: "evar92",
  });

  useEffect(() => {
    if (ContainerRef.current) {
      const { clientWidth, scrollWidth } = ContainerRef.current;
      const scrolled = Math.round((clientWidth / scrollWidth) * 100);

      setprogressWidth(scrolled);
      ContainerRef.current.addEventListener("scroll", scrollProgress);
    }
    return () => {
      if (ContainerRef.current) {
        ContainerRef.current.removeEventListener("scroll", scrollProgress);
      }
    };
  }, [ContainerRef]);

  const scrollProgress = () => {
    if (ContainerRef.current) {
      const { clientWidth, scrollWidth } = ContainerRef.current;

      const MIN_SCROLL = Math.round((clientWidth / scrollWidth) * 100);

      const scrollPx = ContainerRef.current.scrollLeft;

      const winWidthPx = scrollWidth - clientWidth;
      const scrolled = Math.round((scrollPx / winWidthPx) * 100);

      setprogressWidth(prevScroll => {
        if (scrolled > MIN_SCROLL) {
          return scrolled;
        }
        return prevScroll;
      });
    }
  };

  return (
    <ErrorBoundary>
      {products.length > 0 && (
        <section className="MultiCollectionTwin mt-5 mb-1" ref={dsWidgetRef} role="banner">
          <WidgetLabel title={item.commonDetails.title} />

          <div className="flex overflow-x-auto px-1" ref={ContainerRef}>
            {products.map((product: any, index: number) => (
              <TwinCarouselCard key={product.id} product={product} icid={icid} productPosition={index + 1} />
            ))}
          </div>
          <div
            className="slider-progress"
            style={{
              background: "rgb(252, 203, 203)",
              height: "4px",
              borderRadius: "2px",
              transition: ".3s",
              marginTop: "10px",
              width: `${progressWidth}%`,
            }}
          />
          <div className="flex p-4">
            <Link
              href={item?.commonDetails?.descriptionData[0]?.value[0]?.urlManager?.url}
              className="flex items-center justify-center w-full text-center py-2 font-bold"
              style={{ letterSpacing: ".8px" }}
              aria-label={t("viewMore") || "View More"}
            >
              <h1 className="justify-center">{t("viewMore") || "View More"}</h1>
              <BackIcon className="rotate-180 rtl:rotate-0" role="img" aria-labelledby="view more" title="view more" />
            </Link>
          </div>
        </section>
      )}
    </ErrorBoundary>
  );
}

export default MultipleCollectionCarouselTwin;
