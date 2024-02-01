import React, { useEffect, useState } from "react";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ADOBE } from "@libConstants/Analytics.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { addToBag } from "@libStore/actions/cartActions";

import Adobe from "@libUtils/analytics/adobe";
import { GAaddToCart } from "@libUtils/analytics/gtm";
import { formatPrice } from "@libUtils/format/formatPrice";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import { getProductData, updateProducts } from "@checkoutLib/Cart/HelperFunc";
import { getAdobeProduct } from "@checkoutLib/Cart/Analytics";

import { GAAddProduct } from "@checkoutLib/Cart/Analytics";

import { ValtioStore } from "@typesLib/ValtioStore";
import { cartFreeProduct, eventInfo } from "@typesLib/Cart";

import PDPShadeGrid from "./PDP/PDPShadeGrid";
import LoadSpinner from "./Common/LoadSpinner";
import PopupModal from "./PopupModal/PopupModal";
import ImageComponent from "./Common/LazyLoadImage";
import { showError } from "@libUtils/showToaster";

interface FreeProdModal {
  show: boolean;
  hide: () => void;
  productData: any;
  setCouponProductData?: (product: cartFreeProduct) => void;
  updateCheckout: (initiateLoader: boolean, eventInfo: eventInfo) => void;
}

const FreeProductModal = ({ show, productData, hide, updateCheckout, setCouponProductData }: FreeProdModal) => {
  const { t } = useTranslation();

  const { couponData } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const [loader, setLoader] = useState(false);
  const [activeProduct, setActiveProduct] = useState(productData.shades[0]);

  const [numberOfFreeProduct, setNumberOfFreeProduct] = useState(0);
  const [listOfFreeProduct, setListOfFreeProduct] = useState<any>([]);
  const [shadesList, setShadesList] = useState(productData.shades);

  const activeImg = activeProduct?.assets?.find((x: any) => x.type === "image");

  /**
   * ANALYTICS - ADOBE -----------------------------------------
   */

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const prepareDatalayer = () => {
    const ddlCategoriesContent: any[] = [];
    if (productData?.categories) {
      Object.values(productData?.categories).forEach((categoryId: any) => {
        ddlCategoriesContent.push(productData?.categories[categoryId.id].cms[0]?.content?.name);
      });

      const ddlProductSubCategory = ddlCategoriesContent[0];
      const ddlProductCategory = ddlCategoriesContent[1];

      return {
        ddlProductSubCategory,
        ddlProductCategory,
      };
    }
  };

  /* Adding Free Product To Bag and updating redux Data */
  const addProductToBag = (freeList: any) => {
    if (activeProduct.cartType) {
      /* For PWP and GWP */
      setLoader(true);

      updateProducts(freeList, 1).then(res => {
        setLoader(false);
        if (res) {
          addToBag(res);
          const categories = prepareDatalayer();
          FreeModalAddToBagClickEvent(activeProduct, categories);
          const productData: any = {
            ...activeProduct,
          };

          GAaddToCart(GAAddProduct(productData, categories?.ddlProductCategory, true), categories?.ddlProductCategory);
          hide();
        }
      });
    } else if (setCouponProductData) {
      /* For Coupon Free Product - it's stored locally and does not have cartType - SHOPPING BAG */
      setLocalStorageValue(LOCALSTORAGE.DISCOUNT_PRODUCT_ID, activeProduct.id);
      setCouponProductData(activeProduct);
      hide();
    }
  };

  // Adobe Analytics[8] - Page Load - Free Product Selection on Shopping Bag
  useEffect(() => {
    if (show) {
      setActiveProduct(productData.shades[0]);
      setShadesList(productData.shades);
      setNumberOfFreeProduct(0);
      prepareDatalayer();
      const categories = prepareDatalayer();

      const pageLoad = {
        common: {
          pageName: `web|${categories?.ddlProductCategory}|cart summary page|${ADOBE.ASSET_TYPE.CHOOSE_GIFT}`,
          newPageName: "free product selection",
          subSection: `${categories?.ddlProductCategory} - ${categories?.ddlProductSubCategory}`,
          assetType: ADOBE.ASSET_TYPE.CHOOSE_GIFT,
          newAssetType: ADOBE.ASSET_TYPE.CHOOSE_GIFT,
          platform: ADOBE.PLATFORM,
          pageLocation: "shopping bag",
          technology: ADOBE.TECHNOLOGY,
        },
        product: getAdobeProduct(productData.shades),
      };
      ADOBE_REDUCER.adobePageLoadData = pageLoad;
    }
  }, [show]);

  const FreeModalAddToBagClickEvent = (product: cartFreeProduct, categories: any) => {
    prepareDatalayer();
    (window as any).digitalData = {
      common: {
        linkName: `web|${categories?.ddlProductCategory} - ${categories?.ddlProductSubCategory}|${ADOBE.ASSET_TYPE.CHOOSE_GIFT}|ADD TO BAG`,
        linkPageName: `web|${categories?.ddlProductCategory}|${product.productTag}|shopping bag`,
        ctaName: "add to bag",
        newLinkPageName: "free product selection",
        subSection: `${categories?.ddlProductCategory} - ${categories?.ddlProductSubCategory}`,
        assetType: ADOBE.ASSET_TYPE.CHOOSE_GIFT,
        newAssetType: ADOBE.ASSET_TYPE.CHOOSE_GIFT,
        pageLocation: "",
        platform: ADOBE.PLATFORM,
      },
      user: Adobe.getUserDetails(userProfile),
      product: getAdobeProduct([product]),
    };
    Adobe.Click();
  };

  const addFreeProducts = (freeProducts: any) => {
    // add all the free products to the cart

    const freeList = [...listOfFreeProduct, freeProducts];
    // only filter products which are in stock
    const filterInStockProducts = freeList.filter((freeProduct: any) => freeProduct?.inStock === true);

    if (filterInStockProducts.length > 0) addProductToBag(filterInStockProducts);
    else showError("Product out of stock", 3000);
  };

  const handleNext = (nextProductCount: number, activeProduct: any) => {
    getProductData(productData.freeProductData, productData.otherData, nextProductCount).then((res: any) => {
      if (res) {
        setActiveProduct(res.shades[0]);
        setShadesList(res.shades);
      }
    });

    setNumberOfFreeProduct(nextProductCount);
    setListOfFreeProduct([...listOfFreeProduct, activeProduct]);
  };

  /* Remove Coupon From Cart in case user closes the free product popup without selecting any */
  const handleCouponProductModalClose = () => {
    hide();

    /* cartType indicates whether coupon product or not */
    if (!activeProduct?.cartType) {
      removeLocalStorageValue(LOCALSTORAGE.COUPON);

      /* In case of autoapply add coupon in ignore discountCodes */
      if (couponData.autoApply) {
        const ignoreCoupons = JSON.parse(getLocalStorageValue(LOCALSTORAGE.IGNORE_DISCOUNT) || "[]");
        setLocalStorageValue(LOCALSTORAGE.IGNORE_DISCOUNT, [...ignoreCoupons, couponData.couponCode], true);
      }

      updateCheckout(true, "promocode remove");
    }
  };

  return (
    <PopupModal show={show} onRequestClose={handleCouponProductModalClose}>
      <div
        className="bg-white rounded-t-xl bg-no-repeat bg-top bg-contain pt-10 relative"
        style={{
          backgroundImage: `url(${t("pdpOverideOffer")?.offerImageUrl})`,
        }}
      >
        <span onClick={handleCouponProductModalClose} role="presentation" className="absolute top-5 right-3 text-2xl">
          &#10005;
        </span>

        <div className="relative px-2">
          <div className="pl-2">
            <h5
              className="text-xl font-semibold text-18 bg-no-repeat inline-block pr-4 rounded-lg"
              style={{
                backgroundImage: "linear-gradient(180deg,transparent 72%,rgb(255, 180, 180) 0)",
                backgroundSize: "100% 82%",
              }}
            >
              {t("miniPDPHeader")}
            </h5>
            <p className="pr-2 text-sm">
              <strong>{t("worthAmount", [formatPrice(activeProduct?.price, true) as string])}&nbsp;</strong>
              {t("withPurchase")}
            </p>
          </div>

          {t("pdpOverideOffer")?.smallIconUrl && (
            <img alt="offer" className="w-14 absolute right-6 top-0" src={t("pdpOverideOffer").smallIconUrl} />
          )}
        </div>

        <div className="flex my-4 border-dashed border-2 mx-2 p-3 border-red-300">
          <div className="w-1/3 flex justify-center items-center mr-2">
            <ImageComponent alt={activeImg?.name} src={activeImg?.imageUrl?.["200x200"]} />
          </div>
          <div className="w-3/4 m-auto">
            <h2 className="h-12 font-semibold line-clamp-2">{activeProduct?.cms[0]?.content?.name}</h2>
            <p className="text-sm text-gray-500 truncate mb-1">{activeProduct?.cms[0]?.content?.subtitle}</p>
            <span className="text-lg text-red-600 font-semibold mr-1">{t("free")}</span>
            <del className="text-lg text-gray-600 opacity-75 mx-1">{formatPrice(activeProduct?.price, true)}</del>
          </div>
        </div>

        {/* Shade Listing */}
        {shadesList.length > 1 && (
          <PDPShadeGrid
            shadeLabel={activeProduct?.cms[0]?.attributes?.shadeLabel}
            currentProductId={activeProduct?.id}
            shades={shadesList}
            isFreeProduct
            setActiveShade={(activeShade: any) => setActiveProduct(activeShade)}
          />
        )}

        <div className="border-t border-gray-400 p-2 w-full">
          {productData.freeProductData?.ids.length - 1 === numberOfFreeProduct ? (
            <button
              type="button"
              disabled={loader}
              onClick={() => addFreeProducts(activeProduct)}
              className="w-full uppercase text-white text-sm font-semibold rounded py-4 bg-ctaImg relative"
            >
              {t("proceedToCart") || "Proceed To Cart"}
              {loader && <LoadSpinner className="absolute inset-0 m-auto w-8" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                handleNext(numberOfFreeProduct + 1, activeProduct);
              }}
              className="w-full uppercase text-white text-sm font-semibold rounded py-4 bg-ctaImg relative"
            >
              {t("next")}
            </button>
          )}
        </div>
      </div>
    </PopupModal>
  );
};

export default FreeProductModal;
