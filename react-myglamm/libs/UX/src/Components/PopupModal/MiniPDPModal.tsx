import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAddtoBag from "@libHooks/useAddToBag";
import useTranslation from "@libHooks/useTranslation";
import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import MiniPDPShadeSelection from "@libComponents/MiniPDP/MiniPDPShadeSelection";

import { GA4Event, GAaddToCart, GAPageView } from "@libUtils/analytics/gtm";
import { GAAddProduct } from "@checkoutLib/Cart/Analytics";

import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";

// @ts-ignore
import { ButtonContianer, ModalContainer } from "@libStyles/css/miniPDP.module.css";

import PopupModal from "./PopupModal";
import { format } from "date-fns";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import CartAPI from "@libAPI/apis/CartAPI";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { setTrialProductCouponFromConfig, GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";
import useAppRedirection from "@libHooks/useAppRedirection";
import BagIconWhite from "../../../public/svg/carticon-white.svg";

interface miniPDP {
  show: boolean;
  hide: () => void;
  productSlug: {
    slug: string;
    couponCode?: string;
    discountedPriceLabel?: string;
    ctaName?: string;
    catalogueType?: string;
    CTA?: string;
  };
  discount?: number;
  isSurvey?: boolean;
  bestSelling?: boolean;
  source?: string;
}

const MiniPDPModal = ({ show, hide, productSlug, discount, isSurvey = true, bestSelling, source }: miniPDP) => {
  const router = useRouter();

  const { t } = useTranslation();
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));

  const { addProductToCart } = useAddtoBag();

  const [loader, setLoader] = useState(false);
  const [CTA, setCTA] = useState<string>("");

  const [activeProduct, setActiveProduct] = useState<any>();
  const [relationalData, setRelationalData] = useState<any>();
  const { products, productCount } = useSelector((store: ValtioStore) => store.cartReducer.cart);
  const productLength =
    products?.length || productCount > 0 || getLocalStorageValue("webengageCartDetails", true)?.cart?.numberOfItems > 0;
  /* Adobe Modal Load Event - Mini PDP */
  let categoryId = "";
  let category = "";
  let subCategory = "";
  if (relationalData?.categories && activeProduct) {
    categoryId = activeProduct?.categories?.find((x: any) => x.type === "child")?.id;
    category =
      relationalData?.categories[activeProduct?.categories?.find((x: any) => x.type === "child")?.id]?.cms[0]?.content.name;
    subCategory =
      relationalData?.categories[activeProduct?.categories?.find((x: any) => x.type === "subChild")?.id]?.cms[0]?.content.name;
  }

  // Changes the CTA text to Pre-Order || Add To Bag According to Product Meta
  useEffect(() => {
    async function checkProductStatus() {
      if (activeProduct?.productMeta.isPreOrder) {
        setCTA(t("preOrderNow") || `PRE-ORDER`); // 3
      } else if (!activeProduct?.inStock) {
        setCTA(t("notifyMe"));
      } else {
        setCTA(t("addToBag") || `ADD TO BAG`); // 1
      }
    }
    checkProductStatus();
  }, [activeProduct]);

  useEffect(() => {
    if (show && activeProduct && relationalData) {
      const miniPDPLoad = {
        common: {
          pageName: `web|${activeProduct.productTag}|minipdp`,
          newPageName: "mini pdp",
          subSection: `${category} - ${subCategory}`,
          assetType: "product",
          newAssetType: "product",
          platform: ADOBE.PLATFORM,
          pageLocation: "",
          technology: ADOBE.TECHNOLOGY,
        },
        product: [
          {
            productSKU: activeProduct.sku,
            productQuantity: 1,
            productOfferPrice: formatPrice(activeProduct.offerPrice),
            productPrice: formatPrice(activeProduct.price),
            productDiscountedPrice: formatPrice(activeProduct.price - activeProduct.offerPrice),
            productRating: "",
            productTotalRating: "",
            stockStatus: activeProduct?.inStock ? "in stock" : "out of stock",
            isPreOrder: "no",
            PWP: "",
            hasTryOn: "no",
          },
        ],
        widgetName: "surveythankyoupage",
      };
      ADOBE_REDUCER.adobePageLoadData = miniPDPLoad;
      productViewGAEvent();
    }
  }, [show, relationalData, activeProduct]);

  const productViewGAEvent = () => {
    // #region // *WebEngage [19] - Product View
    let strProductName = "";
    let strBundleName = "";
    if (activeProduct?.type === 2) {
      strBundleName = activeProduct?.cms[0]?.content?.name;
    } else {
      strProductName = activeProduct?.cms[0]?.content?.name;
    }

    let tags: any = [];
    const { list } = activeProduct?.tag || [];

    if (list.length > 0) {
      list.map((tag: any) => {
        tags.push(tag.name);
        tags.push(`${tag.name}-${format(new Date(), "ddMMyy")}`);
      });
    }

    // GA : GTM , FBPixel Object required for Page Load Event & AddToBag Event
    const GAobj: any = {
      name: activeProduct?.cms[0]?.content?.name || "",
      id: activeProduct?.sku,
      price: parseFloat((activeProduct?.price / 100).toString()),
      brand: "myglamm",
      category,
      variant: "",
      "Logged in": 0,
      "Product ID": activeProduct?.sku,
      "Stock Status": `${activeProduct?.inStock ? 1 : 0}`,
      "Selling Price": parseFloat((activeProduct?.offerPrice / 100).toString()),
      "Product category ID": categoryId,
      "Product SKU": activeProduct?.sku,
      "Entry Location": window?.location?.href,
      MRP: parseFloat((activeProduct?.price / 100).toString()),
    };

    // GA : WebEngage object required for Page Load Event.
    const WebEngageObj: any = {
      bundleName: strBundleName || "",
      outOfStock: !activeProduct?.inStock,
      preOrder: activeProduct?.productMeta?.isPreOrder,
      currency: "INR",
      discounted: activeProduct?.offerPrice < activeProduct?.price,
      inStock: activeProduct?.inStock,
      price: parseFloat((activeProduct?.price / 100).toString()),
      offerPrice: parseFloat((activeProduct?.offerPrice / 100).toString()),
      productName: strProductName || "",
      productSubCategoryName: activeProduct?.productTag,
      productSKU: activeProduct?.sku,
      starRating: "",
      userType: localStorage.getItem("memberId") ? "Member" : "Guest",
      virtualTryOn: false,
      productURL: activeProduct.urlManager?.url,
      productImageURL: activeProduct?.assets?.find((x: any) => x.type === "image")?.imageUrl?.["200x200"] || "",
      productId: activeProduct.id,
      primaryCategory: category,
      tags,
    };
    const pageViewobject = {
      product: GAobj,
      webengage: WebEngageObj,
    };
    GAPageView("/", pageViewobject, "product");
    GA4Event([
      {
        event: "view_item",
        ecommerce: {
          currency: getCurrency(),
          value: pageViewobject.product.MRP,
          items: [
            {
              id: pageViewobject.product.id,
              item_id: pageViewobject.product.id,
              item_name: pageViewobject.product.name,
              discount: pageViewobject.product.MRP - pageViewobject.product.price,
              item_brand: pageViewobject.product.brand,
              item_category: pageViewobject.product.category,
              price: pageViewobject.product.price,
              quantity: 1,
            },
          ],
        },
      },
    ]);
  };

  /* Adobe Event to be Called After Free Product added to Cart  */

  const AdobeEventATB = () => {
    (window as any).digitalData = {
      common: {
        linkName: `web|${category} - ${subCategory}|product description page|Claim Your Reward`,
        linkPageName: `web|${subCategory}|${activeProduct.productTag}|product description page`,
        newLinkPageName: window.digitalData?.common?.pageName,
        assetType: "product",
        newAssetType: "product",
        subSection: "",
        platform: ADOBE.PLATFORM,
        ctaName: "claim free lipstick",
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
      product: [
        {
          productSKU: activeProduct.sku,
          productQuantity: 1,
          productOfferPrice: formatPrice(activeProduct.offerPrice),
          productPrice: formatPrice(activeProduct.price),
          productDiscountedPrice: formatPrice(activeProduct.price - activeProduct.offerPrice),
          productRating: "",
          productTotalRating: "",
          stockStatus: activeProduct?.inStock ? "in stock" : "out of stock",
          isPreOrder: "no",
          PWP: "",
          hasTryOn: "no",
        },
      ],
    };
    Adobe.Click();
  };

  const { redirect } = useAppRedirection();

  /* OnClick Handler - Add Product to Bag */
  const claimFreeLipstick = () => {
    setLoader(true);
    /*  */
    if (SESSIONSTORAGE.FREE_XO_PRODUCT in sessionStorage && productLength) {
      const FreeProductDetails = JSON.parse(sessionStorage.getItem(SESSIONSTORAGE.FREE_XO_PRODUCT) || "{}");
      const cartApi = new CartAPI();
      cartApi
        .replaceProductInCart({ oldSKU: FreeProductDetails.sku, newSKU: activeProduct.sku })
        .then(({ data: result }) => {
          AdobeEventATB();
          setLoader(false);
          if (isSurvey) {
            sessionStorage.setItem(SESSIONSTORAGE.FREE_XO_PRODUCT, JSON.stringify(activeProduct));
          }
          hide();
          redirect("/shopping-bag");
        })
        .catch((err: any) => {
          console.error(err.response?.data?.message || "Cart minipdp error");
        });
      return;
    }
    /* Adobe.send('click') Event - Claim Free Lipstick */
    addProductToCart(activeProduct, 1, undefined, undefined, false).then(res => {
      if (res) {
        AdobeEventATB();
        GAaddToCart(GAAddProduct(activeProduct, category), category);
        if (isSurvey) {
          sessionStorage.setItem(SESSIONSTORAGE.FREE_XO_PRODUCT, JSON.stringify(activeProduct));
        }
        hide();
        redirect("/shopping-bag");
      }

      setLoader(false);
    });

    /* Glamm trial product set coupon from config */
    const glammClubConfig = GLAMMCLUB_CONFIG() || {};
    const userMemberShipLevel =
      userProfile && userProfile?.memberType?.typeName === "ambassador" ? userProfile?.memberType?.levelName : "Glamm Star";

    const membershipLevelIndex = glammClubConfig?.glammClubMemberShipLevels?.findIndex(
      (membership: string) => membership === userMemberShipLevel
    );

    setTrialProductCouponFromConfig(
      activeProduct,
      userProfile || source === "glamm-club-widget",
      glammClubConfig,
      membershipLevelIndex
    );
  };

  const isFree = !discount && !productSlug.discountedPriceLabel;

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section className={ModalContainer}>
        {activeProduct && (
          <div className="py-2">
            <div className="flex flex-row justify-between items-start">
              <div className="flex flex-col justify-center">
                {productSlug?.catalogueType ? (
                  <h3
                    className="text-18 font-semibold inline pr-1 bg-no-repeat"
                    style={{
                      backgroundImage: `linear-gradient(transparent 74%, var(--color2) 0px)`,
                      backgroundSize: "100% 85%",
                    }}
                  >
                    {activeProduct?.productMeta?.isTrial
                      ? glammClubConfig?.miniPDPTitleText || "Here’s what you’re Getting"
                      : t("HomeMiniPDPHeader") || `Select ${t("shade")} Before Add to Bag`}
                  </h3>
                ) : (
                  <>
                    <h3 className="font-semibold text-xs uppercase">
                      {isFree && !productSlug.discountedPriceLabel
                        ? t("miniPDPHeader")
                        : t("miniPDPHeader")?.replace("FREE!", "")}
                    </h3>
                    <p className="text-11 opacity-80">
                      {activeProduct?.productTag} {t("worth", [formatPrice(activeProduct?.price, true).toString()])}
                    </p>
                  </>
                )}
              </div>
              {!activeProduct?.productMeta?.isTrial && source !== "glamm-club-widget" && (
                <img src="https://files.myglamm.com/site-images/original/surveyGiftIcon.png" alt="gift" />
              )}
            </div>
          </div>
        )}

        <MiniPDPShadeSelection
          isFree={isFree}
          discountAmount={discount}
          slug={productSlug.slug}
          activeProduct={activeProduct}
          setActiveProd={product => setActiveProduct(product)}
          setRelationalData={RData => setRelationalData(RData)}
          discountedPriceLabel={productSlug.discountedPriceLabel}
          bestSelling={bestSelling}
          source={source}
        />
      </section>

      {activeProduct && (
        <div className={`flex justify-between bg-white px-3 py-2 relative ${ButtonContianer}`}>
          {productSlug?.catalogueType && productSlug?.catalogueType !== "glamm-trial" ? (
            <>
              <a
                role="presentation"
                onClick={() => {
                  router.push(activeProduct?.urlManager?.url);
                }}
                className="bg-gray-300 mr-1 rounded-sm py-2 flex uppercase items-center text-gray-600 text-sm font-semibold w-full h-full justify-center relative"
                aria-label={t("miniPDPMoreDetails") || `MORE DETAILS`}
              >
                {t("miniPDPMoreDetails") || `MORE DETAILS`}
              </a>

              <button
                type="button"
                disabled={loader}
                onClick={claimFreeLipstick}
                className="flex uppercase items-center text-white text-sm font-semibold w-full justify-center relative rounded ml-1 bg-ctaImg outline-none"
              >
                {CTA ? (
                  <>
                    {CTA}
                    <div className="ml-3">
                      <BagIconWhite role="img" aria-labelledby="add to cart" />
                    </div>
                    {loader && <LoadSpinner className="absolute inset-0 w-8 mx-auto" />}
                  </>
                ) : (
                  "\u00A0"
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={loader}
              onClick={claimFreeLipstick}
              className={`relative uppercase font-semibold text-sm text-white w-full ${
                productSlug?.catalogueType === "glamm-trial" ? "bg-gray-900" : "bg-themePink"
              } py-2 rounded-md`}
            >
              {productSlug?.CTA ||
                (productSlug?.catalogueType === "glamm-trial" && activeProduct?.productMeta?.isTrial
                  ? glammClubConfig?.miniPDPCTA
                  : isFree
                  ? t("miniPDPCTA")
                  : t("miniPDPCTA")?.replace(" Free", ""))}
              {loader && <LoadSpinner className="w-8 inset-0 absolute m-auto" />}
            </button>
          )}
        </div>
      )}
    </PopupModal>
  );
};

export default MiniPDPModal;
