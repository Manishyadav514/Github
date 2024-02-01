import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { useSnapshot } from "valtio";
import { useInView } from "react-intersection-observer";

import useAddtoBag from "@libHooks/useAddToBag";
import useTranslation from "@libHooks/useTranslation";

import Ripples from "@libUtils/Ripples";
import { isWebview } from "@libUtils/isWebview";
import { formatPrice } from "@libUtils/format/formatPrice";
import { showAddedToBagOrWishlist } from "@libUtils/showToaster";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import PLPWishlistButton from "@libComponents/PLP/PLPWishlistButton";

import { PLP_SCROLL_STATE } from "@libStore/valtioStore";

import PDPAvgRating from "@libComponents/PDP/PDPAvgRating";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import TryOnModal from "@libComponents/PopupModal/TryOnModal";

import { PLPProduct } from "@typesLib/PLP";

import { SHOP } from "@libConstants/SHOP.constant";

import CameraIcon from "../../../public/svg/cameraIcon.svg";
import ScissorsIcon from "../../../public/svg/scissors.svg";
import ScissorsBlueIcon from "../../../public/svg/scissorsBlueIcon.svg";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import CTPCountDownTimer from "@libComponents/CTPCountDownTimer";
import { initiateCTP } from "@productLib/pdp/HelperFunc";
import { triggeCTPAdobeClickEvent } from "@productLib/pdp/AnalyticsHelper";
import { FEATURES } from "@libStore/valtio/FEATURES.store";

import { adobeOnTryonBtnClick } from "@productLib/pdp/PDPTryonAnalytics";
import PLPOfferAndFreeGIft from "@libComponents/PLP/PLPOfferAndFreeGIft";
import { useSplit } from "@libHooks/useSplit";
import {
  setTrialProductCouponFromConfig,
  getTrialProductPricing,
  calculateDiscountPercentage,
  GLAMMCLUB_CONFIG,
} from "@libUtils/glammClubUtils";

const NotifyModal = dynamic(() => import(/* webpackChunkName: "NotifyModal" */ "@libComponents/PopupModal/NotifyModal"), {
  ssr: false,
});

const PLPConcernAndIngredients = dynamic(
  () => import(/* webpackChunkName: "PLPConcernAndIngredients" */ "@libComponents/PLP/PLPConcernAndIngredients"),
  {
    ssr: false,
  }
);

const HomeMiniPDPModal = dynamic(
  () => import(/* webpackChunkName: "HomeMiniPDPModal" */ "@libComponents/PopupModal/HomeMiniPDP"),
  { ssr: false }
);

const PDPFreeProductModal = dynamic(
  () => import(/* webpackChunkName: "FreeProductModal" */ "@libComponents/PopupModal/PDPFreeProductModal"),
  { ssr: false }
);

interface ProdCell {
  product: PLPProduct;
  productRef?: any;
  forceload?: boolean;
  miniPDPProductData?: any;
  indexProd?: any;
  url?: any;
  variantPLPTag?: string;
  concernIngExpVariant?: string;
  isPLP?: boolean;
  ctpData?: any;
  showTags?: boolean;
}

const PLPProdCell = ({
  product,
  productRef,
  forceload = false,
  indexProd,
  url,
  variantPLPTag = "no-variant",
  concernIngExpVariant,
  isPLP = false,
  ctpData,
  showTags = true,
}: ProdCell) => {
  const { t } = useTranslation();
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));
  const [showNotifyModal, setNotifyModal] = useState<boolean>(false);
  const [notifyId, setNotifyId] = useState<any>();
  // Variable declaration for miniPDP modal
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);
  const [miniPDPFreeProduct, setMiniPDPFreeProduct] = useState<any>({});
  const [showPDPFreeProductModal, setShowPDPFreeProductModal] = useState(false);
  const [miniPDPProduct, setMiniPDPProduct] = useState<any>({});
  const [productPosition, setProductPosition] = useState();
  const [isTryon, setIsTryon] = useState<boolean | undefined>();
  const { isPreProduct, isFreeProduct, isOfferAvailable, cutThePrice } = product.meta || {};
  const isItCutThePrice = cutThePrice && userProfile?.id && FEATURES.enableCTP;
  const { quantityUsed, maxOrderQty } = product.meta?.preOrderDetails || {};
  const { ref, inView } = useInView({ threshold: 0 });
  const snap = useSnapshot(PLP_SCROLL_STATE);
  const tagName = product.meta?.tags?.[0]?.name;
  const tagImage = t("productOfferTag")?.[tagName]?.imageUrl;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const isBuy = router.pathname.includes("/buy/");
  const isCollection = router.pathname.includes("/collection/") && !product?.partnershipDiscountAmount;

  const { bestPriceAndFreeGiftId, bestPriceAndFreeGiftIdColl, miniPDPId } =
    useSplit({
      experimentsList: [
        { id: "bestPriceAndFreeGiftId", condition: isBuy },
        { id: "bestPriceAndFreeGiftIdColl", condition: isCollection },
        { id: "miniPDPId" },
      ],
      deps: [],
    }) || {};

  const { addProductToCart } = useAddtoBag();
  const sourceValue = isPLP ? "category" : router.pathname.includes("collection") ? "collection" : "search";

  useEffect(() => {
    if (inView) {
      // @ts-ignore
      if (!snap.pending.includes(product.SKU) || !snap.fired.includes(product.SKU)) {
        // @ts-ignore
        PLP_SCROLL_STATE.pending = [...snap.pending, product.SKU];
      }
    }
  }, [inView]);

  const handleAddToCart = (product: any) => {
    addProductToCart(product, isPreProduct ? 3 : 1).then(res => {
      if (isWebview() && SHOP.SITE_CODE === "bbc") {
        router.push("/shopping-bag");
      } else {
        setLoading(false);
      }

      if (res) showToast();

      /* Glamm trial product set coupon from config */
      const glammClubConfig = GLAMMCLUB_CONFIG() || {};
      const userMemberShipLevel =
        userProfile && userProfile?.memberType?.typeName === "ambassador" ? userProfile?.memberType?.levelName : "Glamm Star";

      const membershipLevelIndex = glammClubConfig?.glammClubMemberShipLevels?.findIndex(
        (membership: string) => membership === userMemberShipLevel
      );
      setTrialProductCouponFromConfig(product, userProfile, glammClubConfig, membershipLevelIndex);
    });
  };

  // miniPDPProductModal call method
  const miniPDPProductData = (product: any, position: any, isTileClick: boolean = false) => {
    SOURCE_STATE.addToBagSource = sourceValue;
    if (isPreProduct && !product.meta?.inStock) {
      handleAddToCart(product);
      return;
    }

    if (miniPDPId === "1") {
      SOURCE_STATE.pdpSource = sourceValue;
      setMiniPDPProduct(product);
      setProductPosition(position);
      setShowMiniPDPModal(true);
    } else if (isTileClick) {
      router.push(product.URL);
    } else {
      if (product.meta.shadeCount > 1) {
        SOURCE_STATE.pdpSource = sourceValue;
        setMiniPDPProduct(product);
        setProductPosition(position);
        setShowMiniPDPModal(true);
      } else {
        setLoading(true);
        handleAddToCart(product);
      }
    }

    // if /else condition remove to make miniPDP open every time user click on select shade or ATC or Img
  };

  const showToast = () => {
    showAddedToBagOrWishlist(t("addedToCart") || "Added To Cart", 2500);
  };

  const handleCTP = async (cta: string = "") => {
    triggeCTPAdobeClickEvent(cta);
    await initiateCTP({ identifier: userProfile?.id, sku: product?.SKU });
    router.push({
      pathname: product?.URL,
      ...(cta === "Cut the Price" && { query: { intiateCTP: true } }),
    });
  };

  return (
    <>
      {showTags && variantPLPTag === "1" && tagImage && (
        <div className="absolute z-10 w-20 ml-0.5 mt-0.5">
          <img src={tagImage} alt="tags flag" />
        </div>
      )}
      <div className="p-2 relative bg-white rounded" ref={productRef}>
        {product?.meta?.inStock && product?.meta?.tryItOn && (
          <div
            className="w-7 h-7 absolute z-20 right-1 top-1 rounded"
            aria-hidden
            onClick={() => {
              adobeOnTryonBtnClick(product?.parentCategory as string, product?.category as string, sourceValue);
              router.push(`/tryon/${sourceValue}${product.URL}`);
            }}
          >
            <CameraIcon role="img" aria-labelledby="virtual try on" />
          </div>
        )}
        {isItCutThePrice && ctpData?.statusId > 0 && ctpData?.statusId < 4 && (
          <>
            <div
              className={`h-auto w-full p-2 absolute z-20 left-0 top-0 rounded bg-color2 ${
                !product.meta?.inStock && isItCutThePrice ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                {ctpData?.statusId === 1 || ctpData?.statusId === 2 ? (
                  <span className="text-xxs capitalize">{t("inviteFriendsIn") || "Invite Friends in"}</span>
                ) : ctpData?.statusId === 3 ? (
                  <span className="text-xxs capitalize">{t("orderBeforeIn") || "Order Before in"}</span>
                ) : null}
                <div className="text-xxs capitalize font-semibold text-color1">
                  {ctpData?.statusId === 1 || ctpData?.statusId === 2 ? (
                    <CTPCountDownTimer expiryTimestamp={new Date(ctpData?.ctpExpiryTime)} callback={() => router.reload()} />
                  ) : ctpData?.statusId === 3 ? (
                    <CTPCountDownTimer expiryTimestamp={new Date(ctpData?.gameExpiryTime)} callback={() => router.reload()} />
                  ) : null}
                </div>
              </div>
            </div>
          </>
        )}
        {typeof isTryon === "boolean" && <TryOnModal show={isTryon} onRequestClose={() => setIsTryon(false)} shortUrl={url} />}
        <Ripples className={`!block ${!product.meta?.inStock && isItCutThePrice ? "pointer-events-none opacity-50" : ""}`}>
          <div role="presentation">
            <Tile
              t={t}
              product={product}
              forceload={forceload}
              reference={ref}
              concernIngExpVariant={concernIngExpVariant}
              isPLP={isPLP}
              isItCutThePrice={isItCutThePrice}
              ctpData={ctpData}
              handleCTP={handleCTP}
              triggeCTPAdobeClickEvent={triggeCTPAdobeClickEvent}
              miniPDPProductData={miniPDPProductData}
              indexProd={indexProd}
            />
          </div>

          {ctpData?.statusId !== 1 && ctpData?.statusId !== 2 && ctpData?.statusId !== 3 && (
            <PLPOfferAndFreeGIft
              isFreeProduct={isFreeProduct}
              isOfferAvailable={isOfferAvailable}
              subscription={product?.subscription?.couponList?.[0]}
              variant={isCollection ? bestPriceAndFreeGiftIdColl : isBuy ? bestPriceAndFreeGiftId : ""}
            />
          )}

          <section className="flex">
            {isItCutThePrice ? (
              <>
                {/*CTP Status 1 : In progress */}
                {ctpData?.statusId === 1 || ctpData?.statusId === 2 ? (
                  <div className="flex flex-1 items-center content-center pt-1">
                    <a
                      href={product.URL}
                      role="button"
                      className="flex items-center relative justify-center w-full py-1.5 my-1 rounded-md uppercase  text-xs font-bold border border-color1 bg-white text-color1"
                      onClick={() => triggeCTPAdobeClickEvent("In progress")}
                    >
                      <span className="text-color1 pr-2 tracking-widest font-semibold opacity-100">
                        {t("inProgress") || "IN PROGRESS"}
                      </span>
                      <span
                        className="absolute border-dashed w-4/5	border-color1 top-3 right-5 opacity-30"
                        style={{ borderWidth: 0.5 }}
                      ></span>
                      <span className="absolute right-2 pb-0.5">
                        <ScissorsBlueIcon />
                      </span>
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-1 items-center content-center pt-1">
                    <div
                      onClick={() => handleCTP(ctpData?.statusId === 3 ? "Buy Now" : "Cut the Price")}
                      role="button"
                      className="flex items-center relative justify-center w-full py-1.5 my-1 rounded-md uppercase  text-xs font-bold bg-ctaImg border border-color1"
                    >
                      {ctpData?.statusId === 3 ? (
                        <>
                          <span className="text-white pr-2 tracking-widest font-semibold opacity-100">
                            {t("buyNow") || "Buy Now"}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-white pr-2 tracking-widest font-semibold opacity-100">
                            {t("cutThePrice") || "CUT THE PRICE"}
                          </span>
                          <span
                            className="absolute border-dashed w-4/5	border-white top-3 right-5 opacity-30"
                            style={{ borderWidth: 0.5 }}
                          ></span>
                          <span className="absolute right-2 pb-0.5">
                            <ScissorsIcon />
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div onClick={e => e.stopPropagation()}>
                  <PLPWishlistButton
                    product={product}
                    TLstyle={{
                      btn: "relative right-1 top-1 mx-1 px-1  pb-0.5 rounded border border-gray-200",
                      svg: "h-7 w-7",
                    }}
                  />
                </div>

                {(product.meta?.inStock || isPreProduct) && (quantityUsed || 0) <= (maxOrderQty || 0) ? (
                  <button
                    type="button"
                    className="text-white w-full bg-ctaImg py-2 my-1  uppercase rounded-md text-10 relative font-bold"
                    disabled={loading}
                    onClick={e => {
                      e.stopPropagation();
                      miniPDPProductData(product, indexProd + 1);
                    }}
                  >
                    {isPreProduct ? t("preOrder") : product.meta.shadeCount > 1 ? `Select ${t("shade")}` : t("addToBag")}
                    {loading && <LoadSpinner className="absolute w-6 mx-auto top-0.5" style={{ left: "40%" }} />}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-white w-full bg-ctaImg py-2 my-1 uppercase rounded-md text-10 font-bold"
                    onClick={e => {
                      e.stopPropagation();
                      setNotifyModal(true);
                      setNotifyId(product.productId);
                    }}
                  >
                    {t("notifyMe")}
                  </button>
                )}
              </>
            )}
            {/* Notify Me Modal */}
            {showNotifyModal && (
              <NotifyModal show={showNotifyModal} onRequestClose={() => setNotifyModal(false)} productId={product?.productId} />
            )}

            {/* MiniPDP modal starts */}
            {showMiniPDPModal && (
              <HomeMiniPDPModal
                show={showMiniPDPModal}
                onRequestClose={() => setShowMiniPDPModal(false)}
                product={miniPDPProduct}
                //icid={icid}
                productPosition={productPosition}
                t={t}
                themeColor="#f88d8d" //f88d8d
                setMiniPDPFreeProduct={(freeProd: any) => {
                  setMiniPDPFreeProduct(freeProd);
                  setShowPDPFreeProductModal(true);
                }}
                callback={showToast}
              />
            )}

            {showPDPFreeProductModal && miniPDPFreeProduct && (
              <PDPFreeProductModal
                show={showPDPFreeProductModal}
                hide={() => setShowPDPFreeProductModal(false)}
                freeProduct={miniPDPFreeProduct}
                product={{ id: miniPDPFreeProduct?.parentId || 0 }}
                t={t}
              />
            )}
            {/* MiniPDP modal ends */}
          </section>
        </Ripples>
      </div>
    </>
  );
};

const Tile = ({
  t,
  product,
  reference,
  forceload = false,
  concernIngExpVariant,
  isPLP,
  ctpData,
  isItCutThePrice,
  handleCTP,
  triggeCTPAdobeClickEvent,
  miniPDPProductData,
  indexProd,
}: any) => {
  const route = useRouter();
  const sourceValue = isPLP ? "category" : route.pathname.includes("collection") ? "collection" : "search";
  const handleClick = (e: any, product: any) => {
    e.preventDefault();
    SOURCE_STATE.pdpSource = sourceValue;
    SOURCE_STATE.addToBagSource = sourceValue;
    if (isItCutThePrice && ctpData?.statusId !== 1 && ctpData?.statusId !== 2) {
      handleCTP(ctpData?.statusId === 3 ? "Buy Now" : "Cut the Price");
      return;
    } else if (isItCutThePrice) {
      triggeCTPAdobeClickEvent("In progress");
      route.push(product.URL);
      return;
    }

    miniPDPProductData(product, indexProd + 1, true);
  };

  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));

  const glammClubConfig = GLAMMCLUB_CONFIG() || {};

  const userMemberShipLevel =
    userProfile && userProfile?.memberType?.typeName === "ambassador" ? userProfile?.memberType?.levelName : "Glamm Star";

  const membershipLevelIndex = glammClubConfig?.glammClubMemberShipLevels?.findIndex(
    (membership: string) => membership === userMemberShipLevel
  );

  const configPrice =
    getTrialProductPricing(product, userProfile, glammClubConfig, membershipLevelIndex, true) || product?.priceOffer;

  return (
    <>
      <Link
        href={product.URL}
        prefetch={false}
        ref={reference}
        className="cursor-pointer"
        aria-label={product.productName}
        onClick={e => handleClick(e, product)}
      >
        <ImageComponent
          forceLoad={forceload}
          src={product.imageURL}
          alt={product.productName || product.imageAltTag}
          className="mx-auto"
        />
        <div className="flex items-center justify-between">
          <div
            className={` ${product?.rating?.avgRating > 0 ? "" : "opacity-0"} relative flex  my-1 items-center justify-between`}
          >
            <PDPAvgRating
              avgRating={product?.rating?.avgRating % 1 != 0 ? product?.rating?.avgRating : product?.rating?.avgRating + ".0"}
              totalCount={product?.rating?.totalCount}
              size={10}
            />
          </div>
          <div className="flex h-3.5 mb-1">
            {
              product?.shades?.length > 0 ? (
                <>
                  {product.shades.slice(0, 1).map((shade: any, index: number) => (
                    <div key={index} className="relative mr-0.5">
                      {index === 0 && <div className="h-1 w-1 rounded-full bg-white absolute m-auto inset-0 " />}
                      <img src={shade.shadeImage} alt={shade.shadeLabel} className="w-3.5 h-3.5 rounded" />
                    </div>
                  ))}
                  {product.meta.shadeCount > 1 && (
                    <span className="text-xxs opacity-80 ml-0.5 uppercase">
                      +{product.meta.shadeCount - 1}&nbsp;
                      {product.meta.shadeCount - 1 === 1 ? t("shade") : t("shades")}
                    </span>
                  )}
                </>
              ) : (
                <></>
              )
              // (
              //   <span className="text-xxs opacity-80 uppercase line-clamp-1">
              //     {!product.shadeLabel && product.shadeLabel.trim() === "" ? product.subCategory : product.shadeLabel}
              //   </span>
              // )
            }
          </div>
        </div>

        <p className="text-xs h-8 line-clamp-2 capitalize  mb-1.5">{product.productName}</p>
      </Link>
      {isPLP && <PLPConcernAndIngredients product={product} concernIngExpVariant={concernIngExpVariant} />}
      <Link href={product.URL} prefetch={false} ref={reference} className="cursor-pointer" aria-label="product price">
        <div className={`flex flex-wrap items-center ${SHOP.REGION === "MIDDLE_EAST" ? "text-xs h-8" : ""}`}>
          {ctpData?.statusId > 0 && ctpData?.statusId < 4 ? (
            <>
              <span className="font-semibold mr-1.5">{formatPrice(product?.priceMRP - ctpData?.point, true)}</span>
              <del className="text-xs text-gray-500 mr-1">{formatPrice(product.priceMRP, true)}</del>
              <span className="text-green-700 text-xs tracking-wide h-7">{`${t("youHaveCut") || "You’ve Cut"} ${formatPrice(
                ctpData?.point,
                true
              )}`}</span>
            </>
          ) : (
            <>
              <span className="font-semibold mr-1.5">
                {product?.partnershipPayableAmount || product.partnershipPayableAmount === 0
                  ? product.partnershipPayableAmount === 0
                    ? "FREE"
                    : formatPrice(product?.partnershipPayableAmount, true)
                  : getTrialProductPricing(product, userProfile, glammClubConfig, membershipLevelIndex)}
              </span>
              {(product?.priceMRP > product?.priceOffer || product?.priceMRP > product?.partnershipPayableAmount) && (
                <del className="text-xs text-gray-500 mr-1">{formatPrice(product.priceMRP, true)}</del>
              )}
              {product?.partnershipPayableAmount ? (
                <>
                  <span className="text-xs text-green-700 font-semibold tracking-wider block">
                    <bdi>
                      {t("priceOffPercentage", [
                        Math.round(((product?.priceMRP - product?.partnershipPayableAmount) / product?.priceMRP) * 100),
                      ])}
                    </bdi>
                  </span>
                </>
              ) : (
                product?.priceMRP > product?.priceOffer && (
                  <>
                    <span className="text-xs text-green-600 font-semibold tracking-wider block">
                      <bdi>
                        {t("priceOffPercentage", [calculateDiscountPercentage(product.priceMRP, configPrice).toString()])}
                      </bdi>
                    </span>
                  </>
                )
              )}
            </>
          )}
        </div>
      </Link>
    </>
  );
};

export default PLPProdCell;
