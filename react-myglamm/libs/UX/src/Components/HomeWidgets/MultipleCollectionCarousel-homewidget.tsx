import React, { useState, useEffect, useCallback, useRef } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import Ripples from "@libUtils/Ripples";
import useDsAdobe from "@libHooks/useDsAdobe";

import { GiForwardIco } from "@libComponents/GlammIcons";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import PersonalisedWidgetLabel from "@libComponents/PersonalisedWidgets/PersonalisedWidgetLabel";

import useTranslation from "@libHooks/useTranslation";

import { SHOP } from "@libConstants/SHOP.constant";

import { formatPrice } from "@libUtils/format/formatPrice";
import recommendationHelper from "@libUtils/recommendationHelper";

import WidgetLabel from "./WidgetLabel";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

const Index = (i: any) => i.type === "image";

const SingleProductCard = ({ product: { assets }, product, productPosition, icid, index, productArrayLength }: any) => (
  <Ripples>
    <Link
      href={
        !icid
          ? `${product.urlManager.url}`
          : `${product.urlManager.url}?icid=${icid}_${product.cms[0]?.content.name.toLowerCase()}_${productPosition}`
      }
      prefetch={false}
      className="w-full"
      id={`carousel-item-${index + 1}`}
      role="tabpanel"
      aria-roledescription="slide"
      aria-label={product.cms[0]?.content.name}
    >
      <ImageComponent
        className="flex w-full justify-center py-2 mx-auto"
        style={{
          height: "250px",
          width: "250px",
        }}
        alt={product.cms[0]?.content.name}
        src={assets[assets.findIndex(Index)]?.imageUrl["400x400"]}
      />
      <div className="px-2">
        <h1 className="text-base text-black font-bold" style={{ color: "#212529" }}>
          {product.cms[0]?.content.name}
        </h1>
        <p className="text-xs font-light my-1 opacity-75" style={{ color: "#212529" }}>
          {product.cms[0]?.content.subtitle}
        </p>
      </div>
      <div className="flex items-center p-2">
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
);

function MultipleCollectionCarousel({ item, icid }: any) {
  const router = useRouter();
  const { t } = useTranslation();

  const [productArr, setProductArr] = useState([]);
  const isDashboard = router.asPath.match("your-recommendations");
  const experimentID = JSON.parse(item.meta.widgetMeta || "{}").showMiniPDPExperimentId || "";
  //const [currentShareImage, setCurrentShareImage] = useState<any>([]);
  const [dsWidgetType, setDsWidgetType] = useState("");

  const currentIndexRef = useRef<any>({
    index: 0,
  });

  useEffect(() => {
    recommendationHelper(item.meta?.widgetMeta, item.commonDetails).then((res: any) => {
      setProductArr(res.products);
      setDsWidgetType(res.dsWidgetType);
    });
  }, []);

  const { dsWidgetRef } = useDsAdobe({
    title: item.commonDetails.title,
    dsWidgetType: dsWidgetType,
    products: productArr,
  });

  const onShareClick = useCallback(() => {
    const currentShareImage: any = productArr[currentIndexRef.current.index];

    if (currentShareImage) {
      CONFIG_REDUCER.shareModalConfig = {
        shareUrl: currentShareImage?.urlShortner?.shortUrl || currentShareImage?.urlManager?.url,
        productName: currentShareImage?.cms[0]?.content?.name,
        slug: currentShareImage?.urlManager.url,
        module: "product",
        image: currentShareImage?.assets[0]?.imageUrl["200x200"] || currentShareImage?.assets[0]?.imageUrl["400x400"],
        overrideRouterPath: "product",
      };
    }
  }, [productArr, currentIndexRef]);

  const slideChanged = (newIndex: number) => {
    // setCurrentShareImage(productArr[newIndex]);
    currentIndexRef.current.index = newIndex;
  };

  return (
    <>
      {Array.isArray(productArr) && productArr.length > 0 && (
        <section
          className={`MultipleCollectionWidget ${isDashboard ? "mb-8 pb-2" : "px-3 mt-5 mb-1"}`}
          ref={dsWidgetRef}
          role="banner"
          aria-roledescription="carousel"
          aria-label={item?.commonDetails?.title || item?.commonDetails?.subTitle}
        >
          {isDashboard ? (
            <PersonalisedWidgetLabel title={item.commonDetails.title} />
          ) : (
            <WidgetLabel title={item.commonDetails.title} />
          )}

          <GoodGlammSlider dots="full" slideChanged={slideChanged}>
            {productArr.map((product: any, index: number) => (
              <SingleProductCard
                key={product.id}
                product={product}
                icid={icid}
                productPosition={index + 1}
                index={index}
                productArrayLength={productArr.length}
              />
            ))}
          </GoodGlammSlider>

          {!isDashboard && SHOP.ENABLE_SHARE && (
            <div className="flex p-4">
              <button
                type="button"
                onClick={onShareClick}
                className="flex items-center justify-center w-full text-center p-3 font-bold"
                style={{
                  border: "1px solid #000",
                  borderRadius: "2px",
                  letterSpacing: ".8px",
                }}
              >
                <span className="self-center text-sm">
                  {t("shareEarn")?.toUpperCase()} {t("CUSTOMER_PREF_GLAMMPOINTS")?.toUpperCase()}
                </span>
                <GiForwardIco
                  className="absolute"
                  style={{ right: "25px" }}
                  width="27"
                  height="27"
                  viewBox="0 -50 1000 1000"
                  role="img"
                  aria-labelledby="share & earn"
                />
              </button>
            </div>
          )}
        </section>
      )}
    </>
  );
}

export default MultipleCollectionCarousel;
