import React, { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ADOBE } from "@libConstants/Analytics.constant";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

import Adobe from "@libUtils/analytics/adobe";
import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";
import { GA4Event, GAProductRemovedFromCart } from "@libUtils/analytics/gtm";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { GAaddToCart } from "@libUtils/analytics/gtm";
import { getClientQueryParam } from "@libUtils/_apputils";
import { updateProducts } from "@checkoutLib/Cart/HelperFunc";
import { GARemoveProduct, getCartAdobeProduct, promoCodeFailedAdobeEvent } from "@checkoutLib/Cart/Analytics";

import { ValtioStore } from "@typesLib/ValtioStore";
import { cartProduct, FPOtherData, freeProductData } from "@typesLib/Cart";
import PlusIcon from "../../../public/svg/plus.svg";
import MinusIcon from "../../../public/svg/min.svg";
import GiftWrap from "../../../public/svg/giftwrap.svg";
import DeleteIcon from "../../../public/svg/delete.svg";
import DownArrow from "../../../public/svg/downArrow.svg";

import { GAOfferAppliedFailed } from "@libUtils/analytics/gtm";
import { getLocalStorageValue, removeLocalStorageValue } from "@libUtils/localStorage";
import { cartCustomRepsonseLayer } from "@checkoutLib/Cart/HelperFunc";
import clsx from "clsx";

import { addToBag, updateCartLoader } from "@libStore/actions/cartActions";
import { getCTPData } from "@productLib/pdp/HelperFunc";
import CTPCountDownTimer from "@libComponents/CTPCountDownTimer";
import CartNewComboProductUI from "./CartNewComboUI";
import { FEATURES } from "@libStore/valtio/FEATURES.store";
import { GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";

const CartMiniPDPDetails = dynamic(
  () => import(/* webpackChunkName: "CartMiniPDPDetails" */ "@libComponents/PopupModal/CartMiniPDPDetails"),
  { ssr: false }
);

const CartMiniPDP = dynamic(() => import(/* webpackChunkName: "CartMiniPDP" */ "@libComponents/PopupModal/CartMiniPDP"), {
  ssr: false,
});
const RemoveProductWislistModal = dynamic(
  () => import(/* webpackChunkName: "RemoveProductWishlistModal" */ "@libComponents/PopupModal/RemoveProductWislistModal"),
  { ssr: false }
);

interface cartProdListing {
  showFPModal?: (productParms: freeProductData, otherData: FPOtherData) => void;
  updateCheckout?: () => void;
  isOrderSummary?: boolean;
}

const CartProduct = ({ showFPModal, updateCheckout, isOrderSummary = false }: cartProdListing) => {
  const { t } = useTranslation();

  const experimentIds = t("abTestExperimentIds");
  const displayPriceAfterPromotion = t("displayPriceAfterPromotion");
  const profileId = useSelector((store: ValtioStore) => store.userReducer.userProfile?.id);
  const { couponCodes, productTags } = displayPriceAfterPromotion;
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};
  const { products, missingProductFreeProducts, couponData, userWishlist, userProfile } = useSelector((store: ValtioStore) => ({
    products: store.cartReducer.cart.products,
    missingProductFreeProducts: store.cartReducer.cart.missingProductFreeProducts,
    couponData: store.cartReducer.cart.couponData,
    userWishlist: store.userReducer.userWishlist,
    userProfile: store.userReducer.userProfile,
  }));
  const [activeProduct, setActiveProduct] = useState<any>();
  const [removeProduct, setRemoveProduct] = useState<cartProduct>();
  const [showChildProductsList, setShowChildProductsList] = useState(false);

  const [showMiniPDP, setShowMiniPDP] = useState(false);
  const [showMiniPDPDetail, setShowMiniPDPDetail] = useState(false);
  const [removeWishlistModal, setRemoveWishlistModal] = useState(false);

  const [ctpData, setCTPData] = useState<any>({});

  const DELIVERY_FREQUENCY: any = { QUARTERLY: "once in 3 months", MONTHLY: "once every month", ONE_TIME: "once" };

  const enableCartComboUI = FEATURES.enableCartComboUI;

  useEffect(() => {
    if (enableCartComboUI) {
      dispatchEvent(new CustomEvent("showNewComboUI"));
    }
  }, [enableCartComboUI]);

  useEffect(() => {
    if (FEATURES.enableCTP) {
      const skus = products?.filter(prd => prd?.productMeta?.cutThePrice)?.map(prd => prd.sku);
      if (skus?.length > 0 && userProfile?.id) {
        getCTPData(skus.join(), userProfile?.id)
          .then(data => {
            setCTPData(data?.data?.data?.data);
          })
          .catch();
      }
    }
  }, [products]);

  /* API Call to Manipulate the Products in Cart Regular/Pre-order */
  const updateProdInBag = (prod: cartProduct, qnty: number, remove = false) => {
    if (!removeWishlistModal && remove) {
      /* Open Remove Product Wishlist Modal in case the product is not already in user's wishlist */
      if (userProfile?.id) {
        setRemoveProduct(prod);
        setRemoveWishlistModal(true);
        return;
      }

      /* Prompt alert before removing a product from cart */
      if (!window.confirm("Are you sure you want to remove this product from the shopping bag?")) {
        return;
      }
    }

    updateCartLoader(true);
    // remove the DS Tag key when user updates the quantity
    const hideDSTag = true;
    updateProducts(prod, qnty, hideDSTag).then((res: any) => {
      if (res) {
        if ("couponErrorDetails" in localStorage) {
          const couponErrorDetails = getLocalStorageValue("couponErrorDetails", true);
          GAOfferAppliedFailed(
            cartCustomRepsonseLayer(res.data),
            couponErrorDetails?.errorMessage,
            couponErrorDetails?.couponName,
            true
          );
          removeLocalStorageValue("couponErrorDetails");
          promoCodeFailedAdobeEvent();
        }

        /* Adobe Click Event Initiate Remove/Update */
        if (remove || qnty == -1) {
          adobeInitEvent(prod, "remove", "product remove");
          const productGaObj = GARemoveProduct(prod);
          GAProductRemovedFromCart(productGaObj);
          GA4Event([
            {
              event: "remove_from_cart",
              ecommerce: {
                currency: getCurrency(),
                value: productGaObj.price,
                items: [
                  {
                    item_id: productGaObj.id,
                    item_name: productGaObj.productName,
                    price: productGaObj.price,
                    quantity: 1,
                  },
                ],
              },
            },
          ]);
        } else {
          gaAddtoCart(prod, false);
          adobeInitEvent(prod, `change quantity-${qnty + prod.quantity}`, "quantity change");
        }

        /* Exception Condition - Incase applicable points changes after product updation */
        // const { appliedGlammPoints, applicableGlammPoints } = res.data || {};
        // if (appliedGlammPoints && appliedGlammPoints !== applicableGlammPoints && updateCheckout) {
        //   setLocalStorageValue(LOCALSTORAGE.GLAMMPOINTS, applicableGlammPoints, true);
        return updateCheckout && updateCheckout();
        // }

        // addToBag(res);
      }
      updateCartLoader(false);
    });
  };

  /* Open Shade Selection MiniPDP if product has Shades Available */
  const checkForShades = (product: any) => {
    if (product.hasShade) {
      setActiveProduct(product);
      setShowMiniPDP(true);
    } else {
      setActiveProduct(product);
      setShowMiniPDPDetail(true);
    }
  };
  /**
   * ADOBE - ANALYTICS - CLICK EVENT - REMOVE
   */
  const adobeInitEvent = (product: cartProduct, name: string, cta: string) => {
    (window as any).digitalData = {
      common: {
        linkName: `web|cart summary page|${name}`,
        linkPageName: "web|cart summary page|shopping bag",
        assetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        newAssetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        newLinkPageName: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        subSection: "",
        platform: ADOBE.PLATFORM,
        ctaName: cta,
      },
      user: Adobe.getUserDetails(userProfile),
      product: getCartAdobeProduct([product]).product,
    };
    Adobe.Click();
  };

  // #region // *WebEngage [16] - Product Add To Cart - Shopping Bag Qty Change : GA Function
  const gaAddtoCart = ({ ...addedProduct }: any, isFreeProduct: boolean) => {
    let category = "";

    if (addedProduct?.productCategory) {
      const categoryIndex = addedProduct?.productCategory?.findIndex((x: any) => x.type === "child");
      category = addedProduct?.productCategory[categoryIndex]?.name;
    }

    let strBundleName = "";
    let strProductName = "";

    if (addedProduct.type === 2) {
      strBundleName = addedProduct?.name;
    } else {
      strProductName = addedProduct?.name;
    }

    const product = addedProduct;

    product.webengage = {
      bundleName: strBundleName || "",
      currency: getCurrency(),
      freeGiftWithProduct: false,
      inviteCode: "",
      preOrder: addedProduct?.productMeta?.isPreOrder,
      price: formatPrice(addedProduct.price),
      productName: strProductName || "",
      productSKU: addedProduct.sku,
      productSubCategoryName: addedProduct.productTag,
      shade: addedProduct?.shadeLabel || "",
      type: addedProduct?.productMeta?.showInParty ? "Party" : "Normal",
      userType: userProfile ? "Member" : "Guest",
      isFreeProduct: addedProduct.cartType !== 1 && addedProduct.cartType !== 3,
      offerPrice: formatPrice(addedProduct.offerPrice),
      productType: addedProduct.type,
      productImageURL: addedProduct?.imageUrl,
      productURL: addedProduct.slug || "",
      primaryCategory: category,
      isTrial: addedProduct?.productMeta?.isTrial || "",
    };

    const fbEventId = sessionStorage.getItem(SESSIONSTORAGE.FB_EVENT_ID);
    if (fbEventId) {
      product.webengage["eventID"] = fbEventId;
    }

    // #endregion // WebEngage [16] - Product Add To Cart -  Shopping Bag Qty Change : Function Call

    GAaddToCart(product, category || "");
  };

  const adobeClickEventRemoveSubscription = (ctaName: string) => {
    // On Click -  Removing Subscription From Cart
    (window as any).digitalData = {
      common: {
        linkName: `web|Cart page|remove`,
        linkPageName: `Subscription`,
        newLinkPageName: "Subscription",
        assetType: "Subscription removed",
        newAssetType: "Subscription removed",
        subSection: "Subscription removed",
        platform: ADOBE.PLATFORM,
        ctaName,
        pageLocation: "Cart",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  const displayChildProduct = (childProducts: cartProduct[]) => {
    return (
      childProducts.length >= 1 && (
        <Fragment>
          <p className="text-xs text-gray-600 text-left pb-2 pl-3 font-semibold">
            {childProducts.length > 2 ? t("productsListKit") : t("productsListCombo")}
          </p>

          {childProducts.map((child: cartProduct) => (
            <div key={child.productId} className="w-full flex pr-3 pl-6 py-2 border-t border-gray-100">
              <div className="mr-2">
                {/* <ImageComponent alt={child.name} src={child.imageUrl} className="h-9 w-9 m-auto" /> */}
                <Image alt={child.name} src={child.imageUrl} className="m-auto" width={36} height={36} />
              </div>
              <div className="flex flex-col justify-around w-4/5">
                <p className="text-xs truncate">{child.productTag}</p>
                <p className="text-10 font-semibold opacity-50">{child.shadeLabel || ""}</p>
              </div>
            </div>
          ))}
        </Fragment>
      )
    );
  };

  const displayProductImage = (product: cartProduct) => {
    return (
      <div className="pr-2 relative ">
        {product?.productMeta?.isTrial && glammClubConfig?.PDPTrialIconV2 && (
          <img
            className="absolute left-1 z-10"
            src={glammClubConfig?.PDPTrialIconV2}
            alt="Glamm Club Trial Product"
            width={33}
          />
        )}
        <div role="presentation" className="h-28 w-28 my-auto" onClick={() => checkForShades(product)}>
          {/* <ImageComponent alt={product.name} src={product.imageUrl} className="h-28 w-28 my-auto" /> */}
          <Image alt={product.name} src={product.imageUrl} width={112} height={112} />
        </div>
      </div>
    );
  };

  const displayProductName = (product: cartProduct) => {
    const { isDecoyPricedProduct, isSubscriptionProduct, isVirtualProduct, recurringSubscriptionDetails } =
      product.productMeta || {};

    const errorStyle = product.errorFlag ? "text-gray-400" : "";

    const hasCTP =
      profileId &&
      ctpData[product.sku] !== undefined &&
      ctpData[product.sku]?.statusId > 0 &&
      ctpData[product.sku]?.statusId < 4;
    const ctpProduct = ctpData[product.sku];

    const showChangeShade = getClientQueryParam("changeShade");

    return (
      <React.Fragment>
        <div onClick={() => checkForShades(product)}>
          <h6 className={`${errorStyle} text-sm pb-1`}>{product.name}</h6>

          {isVirtualProduct && product.type === 1 && <p className={`${"text-10"} font-bold`}>({product.subtitle})</p>}

          {(isDecoyPricedProduct || product.shadeLabel || showChangeShade) && (
            <div className={clsx("flex justify-between", showChangeShade && "items-center mb-5")}>
              <div className="flex items-start items-center">
                <img src={product.shadeImage} className="w-3 h-3 rounded-sm" />
                <p
                  className={clsx(
                    `${errorStyle} text-xs ml-2`,
                    showChangeShade ? "h-3 uppercase" : "font-semibold opacity-50 h-4 mb-0.5 uppercase"
                  )}
                >
                  {showChangeShade && "- "}
                  {isDecoyPricedProduct
                    ? `Pack of ${product.quantity} ${
                        isSubscriptionProduct ? `Delivered ${DELIVERY_FREQUENCY[recurringSubscriptionDetails?.frequency!]}` : ""
                      }`
                    : product.shadeLabel}
                </p>
              </div>
              {showChangeShade && (
                <button
                  onClick={() => checkForShades(product)}
                  className="border-color1 text-color1 text-xs border-b leading-tight"
                >
                  Change Shade
                </button>
              )}
            </div>
          )}

          {hasCTP && (ctpProduct?.statusId === 1 || ctpProduct?.statusId === 2) && ctpProduct?.ctpExpiryTime && (
            <div className="flex flex-row items-center justify-start pt-3">
              <span className="mr-1 text-xs">{t("inviteFriendsIn") || "Invite Friends in"}</span>
              <span className="text-xs text-color1 font-bold">
                <CTPCountDownTimer expiryTimestamp={new Date(ctpProduct?.ctpExpiryTime)} />
              </span>
            </div>
          )}
          {hasCTP && ctpProduct?.statusId === 3 && ctpProduct?.gameExpiryTime && (
            <div className="flex flex-row items-center justify-start pt-3">
              <span className="mr-1 text-xs">{t("orderBeforeIn") || "Order Before in"}</span>
              <span className="text-xs text-color1 font-bold">
                <CTPCountDownTimer expiryTimestamp={new Date(ctpProduct?.gameExpiryTime)} />
              </span>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  };

  const displayProductPrice = (product: cartProduct) => {
    const errorStyle = product.errorFlag ? "text-gray-400" : "";

    const isPromoProduct = couponCodes?.includes(couponData.couponCode) && productTags?.includes(product.productTag.trim());

    const hasCTP =
      profileId &&
      ctpData[product.sku] !== undefined &&
      ctpData[product.sku]?.statusId > 0 &&
      ctpData[product.sku]?.statusId < 4;
    const ctpProduct = ctpData[product.sku];

    return (
      <p onClick={() => checkForShades(product)} className={`${errorStyle}`}>
        {hasCTP ? (
          <>
            <span className="font-bold text-xs uppercase">{formatPrice(product?.totalPrice - ctpProduct?.point, true)}</span>
            <del className="text-gray-400 text-xs ml-1">{formatPrice(product?.totalPrice, true)}</del>
            <span className="text-color1 text-green-700 ml-2">
              {`${t("youHaveCut") || "You’ve Cut"} ${formatPrice(ctpProduct?.point, true)}`}
            </span>
          </>
        ) : (
          <>
            {displayPriceAfterPromotion && product.priceAfterCouponCode !== 0 && isPromoProduct && (
              <>
                <span className="font-bold text-xs uppercase">{formatPrice(product.priceAfterCouponCode, true)}</span>
                <span className="line-through px-1 opacity-50 text-xs">{formatPrice(product.price, true)}</span>
              </>
            )}
            {product.priceAfterCouponCode === 0 && (
              <>
                <span className="font-bold text-xs uppercase">{t("free")}</span>
                <span className="line-through px-1 opacity-50 text-xs">{formatPrice(product.totalPrice, true)}</span>
              </>
            )}
            {product.priceAfterCouponCode !== 0 &&
              !isPromoProduct &&
              (product.totalPrice > product.price ? (
                <>
                  <span className="font-semibold mr-1.5 text-sm">{formatPrice(product.price, true)}</span>
                  <del className="text-gray-400 text-xs">{formatPrice(product.totalPrice, true)}</del>
                </>
              ) : (
                <span className="font-semibold mr-1 text-sm">{formatPrice(product.totalPrice, true)}</span>
              ))}
          </>
        )}
      </p>
    );
  };

  const displayCartCta = (product: cartProduct) => {
    const { isVirtualProduct, isDecoyPricedProduct, isSubscriptionProduct, giftCardSku } = product.productMeta;
    const hasCTP =
      profileId &&
      ctpData[product.sku] !== undefined &&
      ctpData[product.sku]?.statusId > 0 &&
      ctpData[product.sku]?.statusId < 4;

    if (product.errorFlag) {
      return (
        <div className="flex items-center">
          <span className="text-red-500 text-xs font-semibold capitalize">{product.errorMessage}</span>
          <DeleteIcon
            width={20}
            height={20}
            onClick={(e: any) => {
              e.stopPropagation();
              updateProdInBag(product, -product.quantity, true);
            }}
            className="shrink-0"
          />
        </div>
      );
    }

    if ((isVirtualProduct && giftCardSku?.length === 0 && product.type === 1) || isDecoyPricedProduct || hasCTP) {
      return (
        <button
          type="button"
          className={`p-1.5 ${isSubscriptionProduct ? "underline" : "bg-color2 text-color1"}`}
          onClick={() => {
            updateProdInBag(product, -product?.quantity);
            isSubscriptionProduct && adobeClickEventRemoveSubscription("Remove");
          }}
        >
          Remove
        </button>
      );
    }

    return (
      <div className="flex text-xs items-center border rounded border-gray-200 py-1">
        <MinusIcon
          className="mx-1 p-0.5 w-4 h-4"
          onClick={() => updateProdInBag(product, -1, product.quantity === 1)}
          role="img"
          aria-labelledby="minus"
        />
        <span className="w-5 text-center font-semibold ">{product.quantity}</span>
        <PlusIcon
          className="mx-1 p-0.5 w-4 h-4"
          onClick={() => updateProdInBag(product, 1)}
          role="img"
          aria-labelledby="plus"
        />
      </div>
    );
  };

  const displayMissingFreeProducts = (product: cartProduct) =>
    missingProductFreeProducts.map(missingPWP => {
      if (missingPWP.parentProductId === product.productId && couponData.action !== "removeFreeProduct") {
        return (
          <div className="p-0.5" key={missingPWP.parentProductId}>
            <button
              type="button"
              key={missingPWP.parentProductId}
              className="text-color1 bg-red-100 text-xs font-semibold mx-auto w-full flex justify-center py-1.5 rounded-sm"
              onClick={() =>
                showFPModal &&
                showFPModal(missingPWP.freeProduct, {
                  cartType: product.productMeta.isPreOrder ? 4 : 2,
                  parentId: missingPWP.parentProductId,
                })
              }
            >
              <GiftWrap height="13" width="13" className="mr-2" role="img" aria-labelledby="select free gift" />
              {t("selectFreeGift")}
            </button>
          </div>
        );
      }
      return null;
    });

  const displayListOfComboProducts = (childProducts: cartProduct[]) => {
    const childProductWithNoShades = childProducts.every((childProduct: cartProduct) => !childProduct.shadeLabel);

    if (childProductWithNoShades) {
      return (
        <div className="mb-5">
          <div className="flex items-center pb-2" onClick={() => setShowChildProductsList(!showChildProductsList)}>
            <span className="text-xs font-bold text-gray-600">{`${childProducts.length} Items in this combo`} </span>
            <DownArrow className={`ml-1 text-gray-400 transition ${showChildProductsList ? "" : "rotate-180"}`} />
          </div>
          {showChildProductsList &&
            childProducts.map((childProduct: cartProduct) => (
              <div key={childProduct.productId} className="mb-2">
                <span className="text-xs text-gray-500 ">{`${childProduct.quantity}x ${childProduct.name}`}</span>
              </div>
            ))}
        </div>
      );
    }

    return null;
  };

  return (
    <Fragment>
      {products.map((product: cartProduct, index: number) => {
        const childProducts = product.childProducts?.filter(x => x.sku !== t("upSellSkipProductInCombo"));

        /* check if any child products has a shade or not */
        const childProductHasShade = childProducts?.some(
          (product: cartProduct) => product.shadeLabel || (product.shadeLabel && product.shadeLabel.length)
        );

        // New combo products UI
        if (childProducts && childProducts.length > 0 && childProductHasShade && (enableCartComboUI || isOrderSummary)) {
          return (
            <CartNewComboProductUI
              childProducts={childProducts}
              product={product}
              displayCartCta={displayCartCta}
              displayProductPrice={displayProductPrice}
              isOrderSummary={isOrderSummary}
              key={product.productId}
            />
          );
        }

        return (
          <div key={product.productId} className="relative w-full bg-white mb-2 rounded">
            <div
              className={clsx(
                "w-full flex",
                isOrderSummary && index < products.length - 1 ? "border-dashed p-3 border-b-2 border-color2" : "p-2"
              )}
            >
              {displayProductImage(product)}

              <div className="flex-grow flex flex-col justify-between w-3/5 ml-2">
                {displayProductName(product)}

                {/* Show New UI for combo product */}
                {(enableCartComboUI || isOrderSummary) &&
                  product.childProducts.length > 0 &&
                  displayListOfComboProducts(childProducts)}

                <div className="flex items-center justify-between text-xs">
                  {displayProductPrice(product)}

                  <div className={clsx("", !product.errorFlag ? "flex justify-between" : "")}>
                    {!isOrderSummary && displayCartCta(product)}
                  </div>
                </div>
              </div>
            </div>
            {/* show if free product for this product is not added to cart
                  can be found in cart.missingProductFreeProducts */}
            {!isOrderSummary && displayMissingFreeProducts(product)}

            {/* Old combo chiild product UI*/}
            {!enableCartComboUI && displayChildProduct(childProducts)}
          </div>
        );
      })}

      {/* CART PRODUCT MINIPDP SHADE SELECTION MODAL */}
      {activeProduct && <CartMiniPDP show={showMiniPDP} mainProd={activeProduct} hide={() => setShowMiniPDP(false)} />}

      {/* CART PRODUCT MINIPDP PRODUCT DETAILS */}
      {activeProduct && (
        <CartMiniPDPDetails show={showMiniPDPDetail} mainProd={activeProduct} hide={() => setShowMiniPDPDetail(false)} />
      )}

      {/* REMOVE PRODUCT WISHLIST MODAL */}
      {removeProduct && (
        <RemoveProductWislistModal
          product={removeProduct}
          show={removeWishlistModal}
          remove={updateProdInBag}
          hide={() => setRemoveWishlistModal(false)}
        />
      )}
    </Fragment>
  );
};

export default CartProduct;
