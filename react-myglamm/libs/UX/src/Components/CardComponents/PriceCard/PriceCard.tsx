/* eslint-disable no-nested-ternary */
import { gaEventFunc } from "@libUtils/analytics/gtm";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "@libHooks/useValtioSelector";
import { useRouter } from "next/router";

import useAddToBag from "@libHooks/useAddToBag";

import ProductAPI from "@libAPI/apis/ProductAPI";

import Adobe from "@libUtils/analytics/adobe";
import { formatPrice } from "@libUtils/format/formatPrice";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

import Spinner from "../../Common/LoadSpinner";

import BagIconWhite from "../../../../public/svg/carticon-white.svg";
import useTranslation from "@libHooks/useTranslation";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { isClient } from "@libUtils/isClient";
import { getSessionStorageValue } from "@libUtils/sessionStorage";

const FreeProductModal2 = dynamic(
  () => import(/* webpackChunkName: "FreeProductModal2" */ "@libComponents/PopupModal/FreeProductModal2"),
  { ssr: false }
);
const CannotOrderModal = dynamic(
  () => import(/* webpackChunkName: "CannotOrderModal" */ "@libComponents/PopupModal/CannotOrderModal"),
  { ssr: false }
);
const GlammInfoModal = dynamic(
  () => import(/* webpackChunkName: "GlammInfoModal" */ "@libComponents/PopupModal/GlammInfoModal"),
  {
    ssr: false,
  }
);
const NotifyModal = dynamic(() => import(/* webpackChunkName: "NotifyModal" */ "@libComponents/PopupModal/NotifyModal"), {
  ssr: false,
});
const PreOrderModal = dynamic(() => import(/* webpackChunkName: "PreOrderModal" */ "@libComponents/PopupModal/PreOrderModal"), {
  ssr: false,
});

function PriceCard({
  priceCardStyle,
  product,
  preOrder,
  freeProduct,
  relationalData,
  childProducts,
  flashSaleWidgetData,
  freeProductsListIds,
}: any) {
  const router = useRouter();

  const { t } = useTranslation();

  const [showNotifyModal, setNotifyModal] = useState(false);
  const [showFreeProductModal, setFreeProductModal] = useState(false);
  const [glammModal, setGlammModal] = useState(false);
  const [selectFreeProduct, setSelectedFreeProduct] = useState(0);
  const [preOrderModal, setPreOrderModal] = useState(false);
  const [CannotOrder, setCannotOrder] = useState(false);
  const [isWebengageFired, setWebengageFired] = useState(false);
  const discountData = isClient() && JSON.parse(sessionStorage.getItem(SESSIONSTORAGE.AB_DYNAMIC_DISCOUNT_PRICE) || "{}");
  const productData = getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_PRODUCT_TAG, true);
  const abProductTag = discountData?.discountProductTag || "";
  const abDiscountPrice = discountData?.discountPrice || 0;

  const profileId = useSelector((store: ValtioStore) => store.userReducer.userProfile?.id);

  const price = formatPrice(product?.price) as number;
  const offerPrice = formatPrice(product?.offerPrice) as number;
  const actualPrice = offerPrice || price;
  const firstOrderAmountGP = 800; //TODO: take this from environment
  const socialGlammPoints = 150; //TODO: take this from environment
  const showBestPrice = firstOrderAmountGP + socialGlammPoints <= actualPrice && socialGlammPoints > 0;

  const [isSpinnerOn, setisSpinnerOn] = useState(false);
  const [flashSaleWidgetMeta, setFlashSaleWidgetMeta] = useState<any>(null);

  const [mounted, setMounted] = useState(false);

  const { isPreOrder, preOrderDetails } = preOrder || {};

  const isAddable = (childProducts?.length && childProducts.every((x: any) => x.inStock)) || (!isPreOrder && product.inStock);

  const CTA = isAddable ? t("addToBag") : isPreOrder ? t("preOrder") : t("notifyMe");

  const { addProductToCart } = useAddToBag(relationalData, {
    freeProduct: freeProduct?.data?.data,
  });

  useEffect(() => {
    if (flashSaleWidgetData) {
      const { meta } = flashSaleWidgetData;
      setFlashSaleWidgetMeta(meta.widgetMeta && JSON.parse(meta.widgetMeta));
    }
  }, [flashSaleWidgetData]);

  const onAddToCart = (type: number) => {
    setisSpinnerOn(true);

    if (isPreOrder && preOrderDetails.maxOrderQty === preOrderDetails.quantityUsed) {
      return setPreOrderModal(true);
    }

    /* Passing Child Products Id inCase of Shade Change in Makeup-Kits */
    let childProductsId: Array<string> | undefined;
    if (childProducts?.length) {
      childProductsId = childProducts.map((x: any) => x.id);
    }

    return addProductToCart(product, type, undefined, childProductsId).then(isProductAdded => {
      /* After Product is Added to Cart */

      if (isProductAdded) {
        setisSpinnerOn(false);

        if (freeProduct?.data.data.length) {
          return setFreeProductModal(true);
        }
        return noThanks();
      }
      /* In-Case Add to Cart API fails */
      if (isPreOrder) {
        setCannotOrder(true);
      }
      return setisSpinnerOn(false);
    });
  };

  const noThanks = () => {
    setFreeProductModal(false);
    router.push("/shopping-bag");
  };

  useEffect(() => {
    const [freeProdData] = freeProduct?.data?.data || [];
    if (!isWebengageFired && showFreeProductModal && freeProdData?.categories.length > 1 && freeProduct?.data?.relationalData) {
      const api = new ProductAPI();
      api.getavgRatings(freeProdData.id, "product").then(({ data: res }) => {
        let ddlProductCategory = "";
        let ddlProductSubCategory = "";
        const { data: Ratings } = res || {};

        const ddlCategoriesContent: Array<string> = [];

        freeProdData.categories.forEach((categoryId: any) => {
          ddlCategoriesContent.push(freeProduct?.data?.relationalData?.categories[categoryId.id]?.cms[0]?.content?.name);
        });
        [ddlProductSubCategory, ddlProductCategory] = ddlCategoriesContent;

        (window as any).digitalData = {
          common: {
            pageName: `web|${ddlProductCategory}|product description page|choose your gift`,
            newPageName: "free product selection",
            subSection: `${ddlProductCategory} - ${ddlProductSubCategory}`,
            assetType: "product",
            newAssetType: "choose your gift",
            platform: ADOBE.PLATFORM,
            pageLocation: "",
            technology: ADOBE.TECHNOLOGY,
          },
          user: Adobe.getUserDetails(),
          product: [
            {
              productSKU: freeProdData.sku,
              productQuantity: 1,
              productOfferPrice: 0,
              productPrice: formatPrice(freeProdData.price),
              productDiscountedPrice: 0,
              productRating: Ratings?.avgRating,
              productTotalRating: Ratings?.totalCount,
              stockStatus: freeProdData.inStock ? "in stock" : "out of stock",
              isPreOrder: freeProdData.productMeta.isPreOrder ? "yes" : "no",
              PWP: "",
              hasTryOn: "no",
            },
          ],
        };
        Adobe.PageLoad();
        setWebengageFired(true);
      });
    }
  }, [showFreeProductModal]);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return (
    <div className="PriceBtn bg-white my-2 sticky bottom-0 z-50" style={priceCardStyle}>
      <div className="flex justify-between bg-white px-3 py-4" style={{ height: "4.5rem" }}>
        {/* Price  */}
        <div className="flex flex-start flex-wrap items-center w-1/2">
          {flashSaleWidgetMeta ? (
            price > flashSaleWidgetMeta.instantDiscountedPrice ? (
              <div className="flex w-full mt-1">
                <h2 className="font-bold text-lg mr-2">{formatPrice(flashSaleWidgetMeta.instantDiscountedPrice, true)}</h2>
                <h2 className="font-thin line-through mr-2" style={{ color: "#9b9b9b", marginTop: "2px" }}>
                  {formatPrice(price, true, false)}
                </h2>
                {flashSaleWidgetMeta?.OfferText && (
                  <div className="flex flex-col">
                    <span className="font-semibold text-white text-xs pointer-badge">{flashSaleWidgetMeta?.OfferText}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-start items-center w-full">
                <h2 className="font-bold text-lg leading-none ">{formatPrice(offerPrice, true, false)}</h2>
              </div>
            )
          ) : abDiscountPrice && offerPrice && abDiscountPrice <= price && product?.productTag === abProductTag ? (
            <div className="flex w-full">
              <h2 className="font-bold text-lg mr-2">
                {price - abDiscountPrice === 0 ? "FREE" : formatPrice(price - abDiscountPrice, true, false)}
              </h2>
              <h2 className="font-thin line-through mr-2" style={{ color: "#9b9b9b", marginTop: "2px" }}>
                {formatPrice(price, true, false)}
              </h2>
            </div>
          ) : productData?.[0]?.payableAmount || productData?.[0]?.payableAmount === 0 ? (
            <div className="flex w-full">
              <h2 className="font-bold text-lg mr-2">
                {productData?.[0]?.payableAmount === 0 ? "FREE" : formatPrice(productData?.[0]?.payableAmount, true)}
              </h2>
              <h2 className="font-thin line-through mr-2" style={{ color: "#9b9b9b", marginTop: "2px" }}>
                {formatPrice(price, true, false)}
              </h2>
            </div>
          ) : (profileId || !showBestPrice) && price > offerPrice ? (
            <div className="flex w-full">
              <h2 className="font-bold text-lg mr-2">{formatPrice(offerPrice, true, false)}</h2>
              <h2 className="font-thin line-through mr-2" style={{ color: "#9b9b9b", marginTop: "2px" }}>
                {formatPrice(price, true, false)}
              </h2>
            </div>
          ) : (
            <div className="flex flex-start items-center w-full">
              <h2 className="font-bold text-lg leading-none ">{formatPrice(offerPrice, true, false)}</h2>
            </div>
          )}
          <p className="font-thin" style={{ fontSize: "10px", lineHeight: "10px", color: "#a8a8a8" }}>
            MRP incl. of all taxes
          </p>
        </div>

        {/* Discount Flag */}
        {/* {SHOP.ENABLE_GLAMMPOINTS && showBestPrice && mounted && !profileId && !checkUserLoginStatus() && (
          <button
            type="button"
            className="flex flex-1 flex-start items-center flex-wrap -mt-4"
            style={{
              marginLeft: "-7rem",
            }}
            onClick={() => setGlammModal(true)}
          >
            <span className="border-l border-gray-400 mr-2 inline h-6" />
            <div className="relative text-left inline-block bg-red-500 px-1" style={{ width: "60px" }}>
              <p className="text-white font-semibold" style={{ fontSize: "13px" }}>
                <span className="font-sans">&#8377;</span> {actualPrice - socialGlammPoints}
              </p>
              <div
                className="w-4 h-4 bg-white absolute right-0 top-0"
                style={{
                  transform: "rotate(45deg)",
                  right: "-6px",
                  top: "1px",
                }}
              />
            </div>
            <div className="flex z-40 bg-white">
              <p className="font-thin flex items-center leading-none text-xxs text-gray-500">
                <span className="text-left w-10">Get this best price</span>
                <I className="ml-1" />
              </p>
            </div>
          </button>
        )} */}

        {/* Add Button */}
        <div
          className="flex flex-1 items-center content-center"
          style={{
            maxWidth: "190px",
          }}
        >
          <button
            type="button"
            className="flex rounded uppercase items-center text-white text-sm font-semibold w-full h-full justify-center relative bg-ctaImg"
            disabled={isSpinnerOn}
            onClick={() => {
              const eventObject: any = {};
              eventObject.eventname = "pdp-cta-click";
              gaEventFunc(eventObject);
              const addToCartType = isAddable ? 1 : isPreOrder ? 3 : 0;
              if (addToCartType) {
                onAddToCart(addToCartType);
              } else {
                setNotifyModal(true);
              }
            }}
          >
            {CTA}
            <div className="ml-3">
              <BagIconWhite role="img" aria-labelledby="add to cart" />
            </div>
            {isSpinnerOn && <Spinner className="absolute w-6 mx-auto" />}
          </button>
        </div>
      </div>

      {/* Notify Me Modal */}
      {showNotifyModal && (
        <NotifyModal show={showNotifyModal} onRequestClose={() => setNotifyModal(false)} productId={product?.id} />
      )}

      {/* FreeProduct Modal */}
      {showFreeProductModal && freeProduct?.data && (
        <FreeProductModal2
          show={!!freeProduct}
          showFreeProductModal={showFreeProductModal}
          setFreeProductModal={setFreeProductModal}
          selectFreeProduct={selectFreeProduct}
          setSelectedFreeProduct={setSelectedFreeProduct}
          isPreOrder={isPreOrder}
          freeProduct={freeProduct}
          product={product}
          noThanks={noThanks}
          addProductToCart={addProductToCart}
          freeProductsListIds={freeProductsListIds}
        />
      )}

      {/* Cannot Order Modal */}
      {CannotOrder && <CannotOrderModal isOpen={CannotOrder} setCannotOrder={setCannotOrder} />}

      {/* GlammModal */}
      {glammModal && <GlammInfoModal show={glammModal} onRequestClose={() => setGlammModal(false)} showBtn />}

      {/* PreOrder Ended Modal */}
      {preOrderModal && (
        <PreOrderModal show={preOrderModal} onRequestClose={() => setPreOrderModal(false)} productId={product?.id} />
      )}
    </div>
  );
}

export default PriceCard;
