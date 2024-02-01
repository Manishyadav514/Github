import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSnapshot } from "valtio";
import { v4 as uuid4 } from "uuid";
import dynamic from "next/dynamic";

import { useSplit } from "@libHooks/useSplit";
import useWislist from "@libHooks/useWishlist";
import useAddToBag from "@libHooks/useAddToBag";
import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import ProductAPI from "@libAPI/apis/ProductAPI";

import Adobe from "@libUtils/analytics/adobe";
import { gaEventFunc } from "@libUtils/analytics/gtm";
import { formatPrice } from "@libUtils/format/formatPrice";
import { setLocalStorageValue } from "@libUtils/localStorage";

import { ADOBE } from "@libConstants/Analytics.constant";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";

import Spinner from "@libComponents/Common/LoadSpinner";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import CTPCountDownTimer from "@libComponents/CTPCountDownTimer";

import { CTPData, PDPProd } from "@typesLib/PDP";
import { ValtioStore } from "@typesLib/ValtioStore";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { PDP_STATES, PDP_VARIANTS } from "@libStore/valtio/PDP.store";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import { triggeCTPAdobeClickEvent } from "@productLib/pdp/AnalyticsHelper";

import EmptyHeart from "../../../public/svg/headerHeart.svg";
import EmptyHeartPink from "../../../public/svg/headerHeartPink.svg";

import PinkHeart from "../../../public/svg/filledPinkHeart.svg";
import BagIconWhite from "../../../public/svg/carticon-white.svg";
import CTPBanner from "../../../public/svg/ctp-price.svg";
import CTPClock from "../../../public/svg/clock-ctp.svg";

import PDPPrice from "./PDPPrice";
import CTPProgressBar from "./CTPProgressBar";
import { isClient } from "@libUtils/isClient";
import { setTrialProductCouponFromConfig, GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";
import { getSessionStorageValue } from "@libUtils/sessionStorage";
import { getClientQueryParam } from "@libUtils/_apputils";

const PDPChangeShadeSelection = dynamic(() => import("./PDPChangeShadeSelection"), { ssr: false });
const CutMyCuttingsModal = dynamic(() => import("@libComponents/PopupModal/CutMyCuttingsModal"), { ssr: false });
const CutThePriceInviteModal = dynamic(() => import("@libComponents/PopupModal/CutThePriceInviteModal"), { ssr: false });

const FreeProductModal2 = dynamic(
  () => import(/* webpackChunkName: "FreeProductModal2" */ "@libComponents/PopupModal/FreeProductModal2"),
  { ssr: false }
);
const CannotOrderModal = dynamic(
  () => import(/* webpackChunkName: "CannotOrderModal" */ "@libComponents/PopupModal/CannotOrderModal"),
  { ssr: false }
);
const NotifyModal = dynamic(() => import(/* webpackChunkName: "NotifyModal" */ "@libComponents/PopupModal/NotifyModal"), {
  ssr: false,
});
const PreOrderModal = dynamic(() => import(/* webpackChunkName: "PreOrderModal" */ "@libComponents/PopupModal/PreOrderModal"), {
  ssr: false,
});

interface pdpAtcprops {
  product: PDPProd;
  showPrice?: boolean;
  showWishlist?: boolean;
  isTryon?: boolean;
  flashSaleWidgetData: any;
  addOnData?: any;
  isNewPDP?: boolean;
}

const PDPATCBottom = ({
  product,
  flashSaleWidgetData,
  showPrice = false,
  showWishlist = true,
  isTryon = false,
  addOnData = {},
  isNewPDP = false,
}: pdpAtcprops) => {
  const { addOnExp, addOnMethod, showMiniPDPModal, addOnProduct } = addOnData;
  const router = useRouter();
  const { t } = useTranslation();
  const userWishlist = useSelector((store: ValtioStore) => store.userReducer.userWishlist);
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));

  const { selectedChildProducts, selectedRecurringSubscription, showBestOffer, PDPFreeProductData, pdpOffers, CTP } =
    useSnapshot(PDP_STATES);

  const { ctpProductData, userLogs } = CTP as CTPData;

  const { addProduct, removeProduct, wishlistAdobeOnClick, gaAddtoWishlist } = useWislist(false);

  const [showNotifyModal, setNotifyModal] = useState(false);
  const [showFreeProductModal, setFreeProductModal] = useState(false);
  const [selectFreeProduct, setSelectedFreeProduct] = useState(0);
  const [preOrderModal, setPreOrderModal] = useState<boolean | undefined>();
  const [CannotOrder, setCannotOrder] = useState<boolean | undefined>();
  const [ctpInviteModal, setCTPInviteModal] = useState<boolean | undefined>();
  const [isWebengageFired, setWebengageFired] = useState(false);
  const [isSpinnerOn, setisSpinnerOn] = useState(false);
  const { isPreOrder, preOrderDetails, cutThePrice } = product.productMeta;
  const isAddable =
    FEATURES.enableComboV2 && selectedChildProducts?.length
      ? selectedChildProducts.every(x => x?.inStock)
      : !isPreOrder && product.inStock;

  const CTA = isAddable
    ? addOnMethod === "AddOnSelected"
      ? "Add Product with Gift Card"
      : t("addToBag")
    : isPreOrder
    ? t("preOrder")
    : t("notifyMe");
  const addToCartType = isAddable ? 1 : isPreOrder ? 3 : 0;
  const [ctpMyCuttingsModal, setCTPMyCuttingsModal] = useState<boolean>(false);
  const ctpEarnedMsg = t("ctpEarnedMsg") || "You’ve earned a discount of <strong>{{point}}</strong> by referring these";
  let ctpPercent = ctpProductData !== undefined && Math.round((ctpProductData?.point / product?.price) * 100);
  if ((ctpPercent || 0) < 6) {
    ctpPercent = 6;
  }
  const hasCTP =
    cutThePrice && ctpProductData?.statusId > 0 && ctpProductData?.statusId < 4 && !router.pathname.includes("/tryon/");

  const variants = useSplit({
    experimentsList: [{ id: "changeShadeSelectionId", condition: product.type === 2 }],
    deps: [product.id],
  });

  const isChangeShade = variants?.changeShadeSelectionId === "c" && product.type === 2 && selectedChildProducts?.length;

  const { addProductToCart } = useAddToBag();

  const isUserInOfflineStore = isClient() ? sessionStorage.getItem(SESSIONSTORAGE.OFFLINE_STORE_NAME) : false;

  const addToCart = () => onAddToCart(addToCartType);

  useEffect(() => {
    addEventListener("PDPATC", addToCart);
    return () => {
      removeEventListener("PDPATC", addToCart);
    };
  }, [product.id]);

  const onAddToCart = (type: number) => {
    setisSpinnerOn(true);
    const productToBeAdded: any = product;

    if (isPreOrder && preOrderDetails.maxOrderQty === preOrderDetails.quantityUsed) {
      return setPreOrderModal(true);
    }

    /* Passing Child Products Id inCase of Shade Change in Makeup-Kits */
    let childProductsId: Array<string> | undefined;
    if (selectedChildProducts?.length) {
      childProductsId = selectedChildProducts.map(x => x.id);
    }

    // send array of products if addOnProduct is selected else single product
    let addableProduct: any;
    if (addOnExp && addOnMethod === "AddOnSelected") {
      addableProduct = [{ ...product, ...(selectedRecurringSubscription || {}) }, { ...addOnProduct }];
    } else {
      addableProduct = { ...product, ...(selectedRecurringSubscription || {}) };
    }

    /* If it's a recurring subscription then add pack quantity, decoyPriceId & subscriptionId */
    return addProductToCart(addableProduct, type, undefined, childProductsId).then(isProductAdded => {
      /* After Product is Added to Cart */
      if (isProductAdded) {
        setisSpinnerOn(false);

        if (PDPFreeProductData?.data?.data?.length) {
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
    if (
      showBestOffer &&
      !FEATURES.disableATCBestPriceAP &&
      getSessionStorageValue(SESSIONSTORAGE.TRIAL_PRODUCT_SKU) !== product?.sku
    ) {
      /* Apply best offer when recurring subscription doesn't exist (normal flow), or if it exists use it's show best price offers flag */
      setLocalStorageValue(
        LOCALSTORAGE.COUPON,
        (pdpOffers.couponList?.find(x => x.selected) || pdpOffers.couponList?.[0])?.couponCode
      );
    }
    setFreeProductModal(false);
    if (PDP_STATES.prodWidgetData.widgetVarint === "1" && PDP_STATES.prodWidgetData.widgetLogic === "show") {
      PDP_STATES.prodWidgetData.widgetShow = true;
    } else {
      router.push("/shopping-bag");
    }
  };

  const handleButton = (wishlistState: string, callWishlist: any, productAdded = false) => {
    const { childCategoryName, subChildCategoryName } = product?.categories;
    if (checkUserLoginStatus()) {
      sessionStorage.setItem(SESSIONSTORAGE.FB_EVENT_ID, uuid4());
      callWishlist(product.id).then(() => {
        wishlistAdobeOnClick(wishlistState, (window as any).digitalData.product, "", childCategoryName, subChildCategoryName);
        if (productAdded) {
          addToWishlistGAEvent();
        }
      });
    } else {
      SHOW_LOGIN_MODAL({ type: "onlyMobile", show: true, onSuccess: () => handleButton("add to wishlist", addProduct) });
    }
  };

  const addToWishlistGAEvent = () => {
    const productData = {
      productId: product.id,
      sku: product.sku,
      productName: product.cms?.[0]?.content?.name || product.productTag,
      shadeLabel: product.cms?.[0]?.attributes?.shadeLabel,
      productTag: product.productTag,
      slug: product?.urlShortner?.slug,
      imageUrl: product.assets?.[0]?.imageUrl?.["200x200"],
      price: product.price,
      offerPrice: product.offerPrice,
      brandName: product.brand.name,

      productMeta: {
        isPreOrder: product.productMeta?.isPreOrder,
        showInParty: product.productMeta?.showInParty,
      },
      type: product.type,
    };
    gaAddtoWishlist(productData, product.categories.childCategoryName);
  };

  useEffect(() => {
    const [freeProdData]: any = PDPFreeProductData?.data?.data || [];
    if (
      !isWebengageFired &&
      showFreeProductModal &&
      freeProdData?.categories.length > 1 &&
      PDPFreeProductData?.data?.relationalData
    ) {
      const api = new ProductAPI();
      api.getavgRatings(freeProdData.id, "product").then(({ data: res }) => {
        let ddlProductCategory = "";
        let ddlProductSubCategory = "";
        const { data: Ratings } = res || {};

        const ddlCategoriesContent: Array<string> = [];

        freeProdData.categories.forEach((categoryId: any) => {
          ddlCategoriesContent.push(PDPFreeProductData.data.relationalData?.categories[categoryId.id]?.cms[0]?.content?.name);
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

  const handleAddToCartClick = () => {
    /* Glamm trial product set coupon from config */
    const glammClubConfig = GLAMMCLUB_CONFIG() || {};

    const userMemberShipLevel =
      userProfile && userProfile?.memberType?.typeName === "ambassador" ? userProfile?.memberType?.levelName : "Glamm Star";

    const membershipLevelIndex = glammClubConfig?.glammClubMemberShipLevels?.findIndex(
      (membership: string) => membership === userMemberShipLevel
    );

    /* for guest user if he lands on PDP from cross brand trial catalog */
    const isCrossBrandTrial = getClientQueryParam("isCrossBrandTrial") === "true";
    setTrialProductCouponFromConfig(product, userProfile || isCrossBrandTrial, glammClubConfig, membershipLevelIndex);

    if (addOnExp && addOnMethod === "AddOnSelect") {
      PDP_STATES.addOnData = { ...addOnData, showMiniPDPModal: !showMiniPDPModal };
    } else {
      const eventObject: any = {};
      eventObject.eventname = "pdp-cta-click";
      gaEventFunc(eventObject);
      const addToCartType = isAddable ? 1 : isPreOrder ? 3 : 0;
      if (addToCartType) {
        onAddToCart(addToCartType);
      } else {
        setNotifyModal(true);
      }
    }
  };

  return (
    <div
      className={`PriceBtn bg-white ${isTryon ? "" : "my-2"}  ${hasCTP ? "fixed w-full -bottom-2" : "sticky bottom-0"} z-20`}
      style={{
        boxShadow: "0 -4px 4px 0 rgba(0,0,0,.07)",
      }}
    >
      {hasCTP ? (
        <div className="flex flex-col bg-white h-auto">
          {(ctpProductData?.statusId === 1 || ctpProductData?.statusId === 2) && (
            <div className="bg-offerPDP pb-1">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row justify-start items-center	bg-white p-0.5 px-2 rounded-full border border-color1 ml-2">
                  <CTPClock className="h-3 w-3 mr-1" />
                  <span className="mr-1 text-xs">{t("inviteFriendsIn") || "Invite Friends in"}</span>
                  {ctpProductData?.ctpExpiryTime && (
                    <span className="text-xs text-color1 font-bold">
                      <CTPCountDownTimer expiryTimestamp={new Date(ctpProductData?.ctpExpiryTime)} />
                    </span>
                  )}
                </div>
                <div className="bg-no-repeat flex flex-col justify-center items-center mr-3 relative">
                  <CTPBanner />
                  <div className="text-center absolute top-0 ">
                    <div className="text-xs text-white">{t("youhavecut") || "You’ve Cut"}</div>
                    <div className="text-base font-bold text-white">{formatPrice(ctpProductData?.point, true)}</div>
                  </div>
                </div>
              </div>
              <CTPProgressBar
                duration={100}
                percentage={ctpPercent || 0}
                label={`-${formatPrice(ctpProductData?.point, true)}`}
              />
            </div>
          )}
          {ctpProductData?.statusId === 3 && (
            <div className="bg-offerPDP py-2">
              <div className="flex flex-col justify-start items-start">
                <div
                  className="flex justify-start items-center bg-white p-0.5 px-2 rounded-full border ml-2"
                  style={{ borderColor: "#3D7CC9" }}
                >
                  <ImageComponent
                    alt="close button"
                    src="https://s3.ap-south-1.amazonaws.com/pubfiles.themomsco.net/tmc-alpha/original/Rectangle3x.png"
                    width="20"
                    height="20"
                  />
                  <span className="mr-1 text-xs">{t("orderBeforeIn") || "Order Before in"}</span>
                  {ctpProductData?.gameExpiryTime && (
                    <span className="text-xs text-color1 font-bold">
                      <CTPCountDownTimer expiryTimestamp={new Date(ctpProductData?.gameExpiryTime)} />
                    </span>
                  )}
                </div>
                <span className="flex flex-row justify-start items-center px-2 pt-3 ml-1">
                  <span
                    className="text-xs"
                    dangerouslySetInnerHTML={{
                      __html: ctpEarnedMsg.replace("{{point}}", formatPrice(ctpProductData?.point, true)),
                    }}
                  ></span>
                  <span className="text-xs ml-1 text-blue-600 underline" onClick={() => setCTPMyCuttingsModal(true)}>
                    {userLogs?.length} {t("friends") || "Order Before in"}
                  </span>
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-wrap p-2 w-auto">
            {(ctpProductData?.statusId === 1 || ctpProductData?.statusId === 2) && (
              <>
                <button
                  type="button"
                  className={`flex rounded-md uppercase items-center  text-sm font-semibold w-[49%] h-10 justify-center relative  mr-1 ${
                    !((formatPrice(product?.price - ctpProductData?.point) as number) <= 0)
                      ? "bg-ctaImg text-white"
                      : "bg-white text-color1 border border-color1 "
                  }`}
                  onClick={() => {
                    setCTPInviteModal(true);
                    triggeCTPAdobeClickEvent("Refer friends");
                  }}
                >
                  {t("inviteFriends")}
                </button>
                <button
                  type="button"
                  className={`flex rounded-md uppercase items-center text-color1 text-sm font-semibold w-[49%] h-10 justify-center relative outline-none border  ${
                    (formatPrice(product?.price - ctpProductData?.point) as number) <= 0
                      ? "bg-ctaImg text-white "
                      : "bg-white text-color1 border border-color1"
                  }`}
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
                  {t("buyNowAt") || "BUY NOW AT"} {formatPrice(product?.price - ctpProductData?.point, true)}
                  {isSpinnerOn && <Spinner className="absolute w-6 mx-auto" />}
                </button>
              </>
            )}
            {ctpProductData?.statusId === 3 && (
              <button
                type="button"
                className="flex rounded-md uppercase items-center text-white text-sm font-semibold w-full h-10 justify-center relative bg-ctaImg"
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
                {t("buyNowAt") || "BUY NOW AT"} {formatPrice(product?.price - ctpProductData?.point, true)}
                {isSpinnerOn && <Spinner className="absolute w-6 mx-auto" />}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-between bg-white p-2 w-full" style={{ height: "3.5rem" }}>
          {showPrice ? <PDPPrice product={product} flashSaleWidgetData={flashSaleWidgetData} isTryon /> : null}

          {!isUserInOfflineStore && showWishlist ? (
            <>
              {isChangeShade ? (
                <PDPChangeShadeSelection childProducts={selectedChildProducts} product={product} />
              ) : (
                <div
                  className={`mr-2 w-14 h-full flex justify-center items-center rounded-sm text-center ${
                    isNewPDP && "border border-themeGray rounded-3"
                  }`}
                  style={{ background: isNewPDP ? "#ffffff" : "#f6f6f6" }}
                >
                  {userWishlist?.find((x: any) => x === product.id) ? (
                    <button onClick={() => handleButton("remove to wishlist", removeProduct)} aria-label="Remove From Wishlist">
                      <PinkHeart role="img" aria-labelledby="wishlist" />
                    </button>
                  ) : (
                    <button onClick={() => handleButton("add to wishlist", addProduct, true)} aria-label="Add To Wishlist">
                      {isNewPDP ? (
                        <EmptyHeartPink role="img" aria-labelledby="wishlist" />
                      ) : (
                        <EmptyHeart role="img" aria-labelledby="wishlist" />
                      )}
                    </button>
                  )}
                </div>
              )}
            </>
          ) : null}

          {/* Wishlist Button  */}

          {/* Add Button */}
          {!isUserInOfflineStore && (
            <div className={`flex flex-1 items-center content-center ${isChangeShade && "w-8/12"}`}>
              <button
                type="button"
                className="flex rounded-sm uppercase items-center text-white text-sm font-semibold w-full h-full justify-center relative bg-ctaImg whitespace-nowrap line-clamp-1 px-1"
                disabled={isSpinnerOn}
                onClick={handleAddToCartClick}
              >
                {isNewPDP ? (
                  <>
                    <div className="mr-3">
                      <BagIconWhite role="img" aria-labelledby="add to cart" />
                    </div>
                    {CTA}
                  </>
                ) : (
                  <>
                    {CTA}
                    <div className="ml-3">
                      <BagIconWhite role="img" aria-labelledby="add to cart" />
                    </div>
                  </>
                )}
                {isSpinnerOn && <Spinner className="absolute w-6 mx-auto" />}
              </button>
            </div>
          )}
        </div>
      )}
      {/* Notify Me Modal */}
      {showNotifyModal && (
        <NotifyModal show={showNotifyModal} onRequestClose={() => setNotifyModal(false)} productId={product?.id} />
      )}

      {ctpMyCuttingsModal && (
        <CutMyCuttingsModal
          product={product}
          userLogs={userLogs}
          show={ctpMyCuttingsModal}
          showButton={false}
          onRequestClose={() => setCTPMyCuttingsModal(false)}
        />
      )}

      {/* FreeProduct Modal */}
      {typeof showFreeProductModal === "boolean" && PDPFreeProductData?.data && (
        <FreeProductModal2
          showFreeProductModal={showFreeProductModal}
          setFreeProductModal={setFreeProductModal}
          selectFreeProduct={selectFreeProduct}
          setSelectedFreeProduct={setSelectedFreeProduct}
          isPreOrder={isPreOrder}
          freeProduct={PDPFreeProductData}
          product={product}
          noThanks={noThanks}
          addProductToCart={addProductToCart}
          freeProductsListIds={product.freeProducts?.ids}
        />
      )}

      {/* Cannot Order Modal */}
      {typeof CannotOrder === "boolean" && <CannotOrderModal isOpen={CannotOrder} setCannotOrder={setCannotOrder} />}

      {/* PreOrder Ended Modal */}
      {typeof preOrderModal === "boolean" && (
        <PreOrderModal show={preOrderModal} onRequestClose={() => setPreOrderModal(false)} productId={product?.id} />
      )}

      {typeof ctpInviteModal === "boolean" && (
        <CutThePriceInviteModal show={ctpInviteModal} product={product} onRequestClose={() => setCTPInviteModal(false)} />
      )}
    </div>
  );
};

export default PDPATCBottom;
