import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import useAddtoBag from "@libHooks/useAddToBag";
import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import { decodeHtml } from "@libUtils/decodeHtml";
import { GA4Event } from "@libUtils/analytics/gtm";
import { formatPrice } from "@libUtils/format/formatPrice";

import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";

import PDPLabel from "./PDPLabel";
import PDPAvgRating from "./PDPAvgRating";

import { ValtioStore } from "@typesLib/ValtioStore";

import PlusIcon from "../../../public/svg/ico-lg-plus.svg";
import BagIconWhite from "../../../public/svg/carticon-white.svg";

import { adobeFrequentlyBroughtTogether, gaAddtoCart } from "@productLib/pdp/AnalyticsHelper";
import useDsAdobe from "@libHooks/useDsAdobe";
import Link from "next/link";

const FrequentlyBoughMiniPDP = dynamic(
  () => import(/* webpackChunkName: "FrequentlyBoughtMiniPDP" */ "@libComponents/PopupModal/FrequentlyBoughMiniPDP")
);

function getProductIds(comboProduct: any, parentProduct: any) {
  const ids: any = [];
  if (comboProduct.data.length === 1) {
    comboProduct.data.map((item: any) => ids.push(...item.products, parentProduct.id));
  } else {
    comboProduct.data.map((items: any) => ids.push(...items.products));
  }
  return ids;
}

const BundleProduct = ({ comboProduct, parentProduct }: any) => {
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const router = useRouter();
  const { t } = useTranslation();
  const { addProductToCart } = useAddtoBag();

  const { content } = parentProduct.cms[0];
  const image = parentProduct.assets.filter((a: any) => a.type === "image");
  const description = decodeHtml(content.subtitle);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const childProduct = comboProduct.data[activeSlideIndex];
  const [priceDetails, setPriceDetails] = useState({
    originalPrice: childProduct?.price,
    offerPrice: childProduct?.offerPrice,
  });
  const [showMiniPDP, setShowMiniPDP] = useState(false);
  const [childSlug, setChildSlug] = useState<string>();
  const ids: any = getProductIds(comboProduct, parentProduct);
  const parent = [...new Set(ids.filter((v: any, i: any, a: any) => a.indexOf(v) !== i))];
  const child = [...new Set(ids)];
  const childBundleIds = [child, parent].reduce((a, b) => a.filter(c => !b.includes(c)));

  const childBundleProd = childBundleIds
    ?.map((item: any) => {
      const childProductRelatedInfo = comboProduct?.relationalData?.products[item];
      const mediaAsset = comboProduct?.relationalData?.products[item]?.assets.find((asset: any) => asset.type === "image");
      const info = childProductRelatedInfo?.cms[0];
      const subtitle = decodeHtml(info?.content?.subtitle);

      if (subtitle === t("upSellSkipProductInCombo")) return null;

      return { childProductRelatedInfo, mediaAsset, info, subtitle };
    })
    ?.filter(x => x);

  const slideChanged = (newIndex: number) => {
    if (newIndex >= 0) {
      const newPrice = comboProduct.data[newIndex]?.price;
      const newOfferPrice = comboProduct.data[newIndex]?.offerPrice;
      const priceDetailsTemp = { ...priceDetails };
      priceDetailsTemp.originalPrice = newPrice;
      priceDetailsTemp.offerPrice = newOfferPrice;
      setPriceDetails(priceDetailsTemp);
      setActiveSlideIndex(newIndex);
    }
  };

  const handleAddToBag = () => {
    SOURCE_STATE.pdpSource = t("frequentlyBought");
    SOURCE_STATE.addToBagSource = t("frequentlyBought");
    const childBundleProdRelData = childBundleProd[activeSlideIndex]?.childProductRelatedInfo;
    const secondProduct = comboProduct.relationalData?.products[childBundleProdRelData?.id];
    if (childBundleProdRelData?.productMeta?.allowShadeSelection || childBundleProdRelData?.shades?.length > 0) {
      setChildSlug(secondProduct?.urlManager?.url);
      setShowMiniPDP(true);
    } else {
      addComboToBag([parentProduct.id, secondProduct?.id]);
    }
  };

  const addComboToBag = (childProductIds: Array<string>) => {
    addProductToCart(childProduct, childProduct.productMeta?.isPreorder ? 3 : 1, undefined, childProductIds).then(res => {
      if (res) {
        setShowMiniPDP(false);
        adobeFrequentlyBroughtTogether(childProduct, comboProduct, userProfile);
        gaAddtoCart(childProduct, userProfile, comboProduct);
        router.push("/shopping-bag");
      }
    });
  };

  const { dsWidgetRef } = useDsAdobe({
    title: t("frequentlyBought") || "frequentlyBought",
    dsWidgetType: t("frequentlyBought") || "frequentlyBought",
    products: [],
    variantValue: "",
  });

  if (!childBundleProd.length) return <></>;

  return (
    <section className="PDPBundleProduct mt-2 py-3 mb-2">
      <div className="relative" ref={dsWidgetRef}>
        <PDPLabel label={t("frequentlyBought")} />

        {/* Parent Product */}
        <div className="shadow-combo flex mx-4 p-4">
          <div className="w-1/4" style={{ height: "80px" }}>
            <ImageComponent
              style={{ width: "79px", height: "79px" }}
              src={image[0]?.imageUrl?.["400x400"]}
              alt={parentProduct?.assets[0]?.name}
            />
          </div>
          <div className="w-3/4 pl-3">
            <div className="flex h-5 mb-1">
              {parentProduct?.rating?.avgRating > 0 && (
                <PDPAvgRating
                  size={9}
                  avgRating={
                    parentProduct?.rating?.avgRating % 1 != 0
                      ? parentProduct?.rating?.avgRating.toFixed(1)
                      : parentProduct?.rating?.avgRating + ".0"
                  }
                  totalCount={parentProduct?.rating?.totalCount}
                />
              )}
            </div>
            <p className="text-sm font-semibold line-clamp-2">{content.name}</p>
            <p className="text-xs text-gray-600 font-thin my-2">{description?.substring(0, 35)}</p>
            <p className="text-xs text-gray-500 font-semibold uppercase my-2">{content?.label}</p>
            <p className="text-base font-semibold">{formatPrice(parentProduct.price, true)}</p>
          </div>
        </div>

        {/* Plus Icon */}
        <PlusIcon className="-mt-2.5 right-0 absolute mr-24 z-10 h-8 w-8" role="img" aria-labelledby="plus" />

        {/* ChildProduct Slider */}
        {Array.isArray(childBundleProd) && (
          <GoodGlammSlider dots="dots" slideChanged={slideChanged}>
            {childBundleProd.map((item: any, index: number) => {
              return (
                // Child Product
                <div
                  className="-mt-1 outline-none h-auto"
                  key={index}
                  onClick={() => router.push(item?.childProductRelatedInfo?.urlManager?.url)}
                >
                  <div className="shadow-combo flex m-4 p-4">
                    <div className="w-1/4" style={{ height: "80px" }}>
                      <ImageComponent
                        style={{ width: "79px", height: "79px" }}
                        src={item?.mediaAsset?.imageUrl["400x400"]}
                        alt={item?.mediaAsset?.name}
                      />
                    </div>
                    <div className="w-3/4 pl-3">
                      <div className="flex h-5 mb-1">
                        {item?.childProductRelatedInfo?.rating?.avgRating > 0 && (
                          <PDPAvgRating
                            size={9}
                            avgRating={
                              item?.childProductRelatedInfo?.rating?.avgRating % 1 != 0
                                ? item?.childProductRelatedInfo?.rating?.avgRating.toFixed(1)
                                : item?.childProductRelatedInfo?.rating?.avgRating + ".0"
                            }
                            totalCount={item?.childProductRelatedInfo?.rating?.totalCount}
                          />
                        )}
                      </div>
                      <Link href={item?.childProductRelatedInfo?.urlManager?.url} passHref legacyBehavior>
                        <a className="text-sm font-semibold h-10">{item?.info?.content?.name}</a>
                      </Link>
                      <p className="text-xs text-gray-600 font-thin my-2">{item?.subtitle?.substring(0, 35)}</p>
                      <p className="text-xs text-gray-500 font-semibold uppercase my-2">{item?.info?.attributes?.shadeLabel}</p>
                      <p className="text-base  font-semibold">{formatPrice(item?.childProductRelatedInfo?.price, true)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </GoodGlammSlider>
        )}

        {/* Price & Button */}
        <div className="flex px-4 my-2 items-center">
          <div className="w-1/2 flex items-center flex-wrap">
            <h2 className="text-lg font-semibold">{formatPrice(priceDetails.offerPrice, true)}</h2>
            {priceDetails.offerPrice < priceDetails.originalPrice && (
              <del className="text-sm font-medium mx-1 text-gray-500">{formatPrice(priceDetails.originalPrice, true)}</del>
            )}
          </div>
          <button type="button" onClick={handleAddToBag} className="bg-ctaImg w-3/4 flex rounded items-center h-10">
            <div className="w-3/4 flex justify-center ml-3">
              <span className="text-xs uppercase text-white">{t("add2ProdToBag")}</span>
            </div>
            <BagIconWhite role="img" aria-labelledby="add to cart" title="add to cart" />
          </button>
        </div>

        {childSlug && (
          <FrequentlyBoughMiniPDP
            show={showMiniPDP}
            addToBag={addComboToBag}
            hide={() => setShowMiniPDP(false)}
            slugs={[parentProduct?.urlShortner?.slug || parentProduct?.urlManager?.url, childSlug]}
            activeProduct={[parentProduct, childBundleProd?.[activeSlideIndex]?.childProductRelatedInfo]}
          />
        )}
      </div>
    </section>
  );
};

export default BundleProduct;
