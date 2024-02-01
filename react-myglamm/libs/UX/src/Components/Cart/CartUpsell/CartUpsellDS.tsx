import React, { useEffect, useState } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import clsx from "clsx";

import DisplayListOfCategories from "./DisplayListOfCategories";
import CartUpsellSkeleton from "@libComponents/Skeleton/CartUpsellSkeleton";
import CartUpsellProduct from "./CartUpsellProduct";
import GiftCardDetails from "@libComponents/PopupModal/GiftCardDetails";
import CartUpsellNucleus from "./CartUpsellNucleus";
import ShowUpsellProductsTitle from "./ShopUpsellProductsTitle";
import { showSuccess } from "@libUtils/showToaster";
import CartUpsellScrollTogether from "./CartUpsellScrollTogether";

import useDsAdobe from "@libHooks/useDsAdobe";
import { useSplit } from "@libHooks/useSplit";
import { useSelector } from "@libHooks/useValtioSelector";
import useTranslation from "@libHooks/useTranslation";
import { useFetchUpsellCartProduct } from "@libHooks/useFetchUpsellCartProducts";

import {
  addToBagUpsellAnalytics,
  customizeUpsellDataBasedOnExpVariant,
  getAnalyticsOfTheUpsellProductClicked,
  getCustomDataToDisplayUpsellProduct,
  getUpsellTitleForAdobe,
  updateProducts,
} from "@checkoutLib/Cart/HelperFunc";
import { GAAddProduct, upsellClickV2Event } from "@checkoutLib/Cart/Analytics";

import { ValtioStore } from "@typesLib/ValtioStore";
import { MiniPDPProd } from "@typesLib/Cart";

import { setValueForAdobe } from "@libUtils/widgetUtils";
import { GAaddToCart } from "@libUtils/analytics/gtm";

import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import { addToBag } from "@libStore/actions/cartActions";
import { CART_REDUCER, PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";

const UpsellMiniPDPV2 = dynamic(() => import(/* webpackChunkName: "UpsellMiniPDPV2" */ "../../PopupModal/UpsellMiniPDPV2"), {
  ssr: false,
});

const UpsellComboProductsModal = dynamic(
  () => import(/* webpackChunkName: "UpsellComboProductsModal" */ "../../PopupModal/UpsellComboProductsModal"),
  {
    ssr: false,
  }
);

const GlammClubUpsellLayout = ({ children, dsWidgetRef }: any) => {
  return (
    <div
      className={"w-full p-2 mb-2  pb-4"}
      ref={dsWidgetRef}
      style={{ backgroundImage: " linear-gradient(to right bottom, rgb(231, 34, 70), rgb(231, 34, 70), rgb(244, 59, 39))" }}
    >
      {children}
    </div>
  );
};

const CartUpsellDSLayout = ({ children, dsWidgetRef, isUpsellOnPayment, cartTitle, cartSubTitle }: any) => {
  return (
    <div
      className={clsx("w-full p-2 py-5 bg-color2 mb-2 rounded", isUpsellOnPayment ? "bg-white " : "bg-color2")}
      ref={dsWidgetRef}
    >
      <ShowUpsellProductsTitle cartTitle={cartTitle} cartSubTitle={cartSubTitle} />
      {children}
    </div>
  );
};

const CartUpsellV2 = ({
  couponFreeProductData,
  variantTagsFlag,
  showSingleRow = false,
  variant,
  progressbarMilestoneUpsellLabel,
  progressbarNextMilestone,
  isUpsellOnPayment = false,
  closePaymentUpsellModal,
  variants: experiments,
}: any) => {
  const { t } = useTranslation();
  const router = useRouter();

  const cart = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const payableAmount = cart.payableAmount * 100;
  const upsellTitle = getUpsellTitleForAdobe(variant);

  const [loader, setLoader] = useState<string>();
  const [showMiniPDP, setShowMiniPDP] = useState<boolean | undefined>(undefined);
  const [showGiftCardTermsAndConditions, setShowGiftCardTermsAndConditions] = useState<boolean>(false);
  const [miniPDPProduct, setMiniPDPProduct] = useState<MiniPDPProd>();
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const [showUpsellComboModal, setShowUpsellComboModal] = useState<boolean | undefined>();

  const variants = useSplit({
    experimentsList: [
      {
        id: "lowerCorgs",
        condition: t("xoCouponLowerCogs")?.includes(cart?.couponData?.couponCode),
      },

      {
        id: "warehouseVariant",
        condition: Router.pathname === "/shopping-bag",
      },
      {
        id: "upsellComboVariant",
      },
    ],
    deps: [cart?.couponData?.couponCode],
  });

  const {
    globalDsTags,
    upsellData,
    upsellProducts,
    showNucleusUpsellProducts,
    showPersonalizedDsTags,
    categories,
    tabIndex,
    showSkeleton,
    getCategoryProducts,
  } = useFetchUpsellCartProduct({
    upsellType: progressbarNextMilestone ? "progressBarUpsell" : "upsell",
    couponFreeProductData,
    variant: variants?.lowerCorgs,
    progressbarNextMilestone,
    progressbarMilestoneUpsellLabel,
    giftCardUpsellVariant: experiments?.giftCardUpsellVariant,
    warehouseVariant: variants?.warehouseVariant,
    upsellComboVariant: variants?.upsellComboVariant,
  });

  /* Trigger Ds load Adobe Event */
  const { dsWidgetRef } = useDsAdobe({
    title: upsellTitle,
    dsWidgetType: "true",
    products: upsellData?.products,
    variantValue: upsellData?.variantValue || "",
    evarName: "evar87",
  });

  useEffect(() => {
    setValueForAdobe(variantTagsFlag, upsellProducts?.[0]?.meta?.tags?.[0]?.name);
  }, [variantTagsFlag, upsellProducts]);

  const openMiniPdpModal = (product: any) => {
    if (product.subProductType === 2) {
      /* In-case upsell product has combo */
      displayComboProductsModal(product);
    } else if (product.isGiftCard) {
      router.replace({ pathname: "/shopping-bag", query: { aov: product.minimumBillAmount } });
      setSelectedProduct(product);
      setShowGiftCardTermsAndConditions(true);
    } else {
      SOURCE_STATE.addToBagSource = upsellData?.cartTitle || "other";
      SOURCE_STATE.pdpSource = upsellData?.cartTitle || "other";

      getAnalyticsOfTheUpsellProductClicked(
        product,
        upsellProducts,
        cart.shippingCharges,
        payableAmount,
        upsellData?.variantValue,
        t("dsUpsellBuckets")
      );

      setMiniPDPProduct({
        id: product.id,
        sku: product.sku,
        productTag: product.productTag,
        mainComboProductId: product.id,
        mainComboProdOfferPrice: product.offerPrice,
        offerID: product.offerID,
        variantValue: upsellData?.variantValue,
        childProductIds: product.childProductIds,
        upsellKey: upsellData?.key,
      });

      setShowMiniPDP(true);
    }
  };

  const handleAddProductToBag = (product: any) => {
    SOURCE_STATE.addToBagSource = upsellData?.cartTitle || "other";
    upsellClickV2Event(userProfile, cart, progressbarMilestoneUpsellLabel);

    if (product.subProductType === 2) {
      /* In-case upsell product has combo */
      displayComboProductsModal(product);
    } else if (product.productTag && product.shadeCount > 1) {
      /* In-Case of  Multiple Shades Show MiniPDP */
      openMiniPdpModal(product);
    } else {
      setLoader(product.id);
      const type = product.subProductType;
      const variantValue = upsellData.variantValue;
      const upsellKey = upsellData?.key;
      const upsellOnPaymentsKey = "cartupsellPayment";

      CART_REDUCER.cart.cartUpsellKey = upsellData?.key;

      return updateProducts({ ...product, type, variantValue, upsellKey }, 1).then((res: any) => {
        if (res) {
          addToBag(res);
          addToBagUpsellAnalytics(product, upsellTitle, isUpsellOnPayment ? upsellOnPaymentsKey : upsellKey);
          GAaddToCart(GAAddProduct(product, undefined, false, upsellData.cartTitle), "");
        }
        setLoader(undefined);
        closePaymentUpsellModal && closePaymentUpsellModal();
        showSuccess("Product Added Successfully", 3000);

        if (Router.pathname === "/payment") PAYMENT_REDUCER.hasUserAddedProductFromUpsellPayment = true;
      });
    }
  };

  const handleAddToBag = (product: any) => {
    if (product.isGiftCard) {
      setSelectedProduct(product);
      setShowGiftCardTermsAndConditions(true);
    } else {
      handleAddProductToBag(product);
    }
  };

  const displayComboProductsModal = (product: any) => {
    setSelectedProduct({
      ...product,
      upsellKey: upsellData?.key,
      childProductIds: product.childProductIds,
      variantValue: upsellData?.variantValue,
    });

    setShowUpsellComboModal(true);
  };

  const getChildrenForTwoRowUpsell = () => {
    return (
      <>
        <div className="flex items-center overflow-x-scroll">
          <DisplayListOfCategories
            categories={categories}
            tabIndex={tabIndex}
            getCategoryProducts={getCategoryProducts}
            globalDsTags={globalDsTags}
            showPersonalizedDsTags={showPersonalizedDsTags}
          />
        </div>
        {experiments?.scrollUpsellRowsTogether === "1" ? (
          <div className="w-full flex overflow-x-scroll px-1">
            <CartUpsellScrollTogether
              upsellData={customisedUpsellProducts}
              handleAddToBag={handleAddToBag}
              openMiniPdpModal={openMiniPdpModal}
              loader={loader}
              withCustomData
              variants={experiments}
            />
          </div>
        ) : (
          <>
            <div className="w-full flex overflow-x-scroll px-1">
              {customisedUpsellProducts?.firstHalfProducts?.map((product: any) => {
                /* customizing the response for using CartUpsellProduct component */
                const _upsellProduct = getCustomDataToDisplayUpsellProduct(product);
                return (
                  <CartUpsellProduct
                    product={_upsellProduct}
                    loader={loader}
                    handleAddToBag={handleAddToBag}
                    key={_upsellProduct?.id}
                    openMiniPdpModal={openMiniPdpModal}
                    variants={experiments}
                  />
                );
              })}
            </div>

            <div className="w-full flex overflow-x-scroll px-1 mb-2">
              {customisedUpsellProducts?.secondHalfProducts?.map((product: any) => {
                /* customizing the response for using CartUpsellProduct component */
                const _upsellProduct = getCustomDataToDisplayUpsellProduct(product);
                return (
                  <CartUpsellProduct
                    product={_upsellProduct}
                    loader={loader}
                    handleAddToBag={handleAddToBag}
                    key={_upsellProduct?.id}
                    openMiniPdpModal={openMiniPdpModal}
                    variants={experiments}
                  />
                );
              })}
            </div>
          </>
        )}
      </>
    );
  };

  const getChildrenForSingleRowUpsell = () => {
    return (
      <div className="w-full flex overflow-x-scroll px-1">
        {upsellProducts?.map((product: any) => {
          /* customizing the response for using CartUpsellProduct component */
          const _upsellProduct = getCustomDataToDisplayUpsellProduct(product);
          return (
            <CartUpsellProduct
              product={_upsellProduct}
              loader={loader}
              handleAddToBag={handleAddToBag}
              key={_upsellProduct?.id}
              openMiniPdpModal={openMiniPdpModal}
              variants={experiments}
            />
          );
        })}
      </div>
    );
  };

  if (progressbarMilestoneUpsellLabel) {
    (window as any).digitalData.common.pageName = `web|shopping bag|progress bar popup`;
  }
  const customisedUpsellProducts = customizeUpsellDataBasedOnExpVariant(upsellProducts, showSingleRow);
  if (showNucleusUpsellProducts) {
    /* If DS cart upsell fails then display nucleus cart upsell */
    return <CartUpsellNucleus variantTagsFlag={variantTagsFlag} variants={experiments} />;
  }

  /* Skeleton Loader */
  if (showSkeleton) {
    return (
      <div className={clsx("", progressbarMilestoneUpsellLabel || isUpsellOnPayment ? "bg-color2" : "")}>
        <CartUpsellSkeleton variants={experiments?.glammClubUpsell} />
      </div>
    );
  }

  if (upsellData) {
    return (
      <React.Fragment>
        {showSingleRow || upsellProducts?.length < 6 ? (
          experiments?.glammClubUpsell === "1" ? (
            <GlammClubUpsellLayout dsWidgetRef={dsWidgetRef}>{getChildrenForSingleRowUpsell()}</GlammClubUpsellLayout>
          ) : (
            <CartUpsellDSLayout
              dsWidgetRef={dsWidgetRef}
              isUpsellOnPayment={isUpsellOnPayment}
              cartTitle={progressbarMilestoneUpsellLabel ? progressbarMilestoneUpsellLabel?.heading : upsellData?.cartTitle}
              cartSubTitle={progressbarMilestoneUpsellLabel ? progressbarMilestoneUpsellLabel?.title : upsellData?.cartSubTitle}
            >
              {getChildrenForSingleRowUpsell()}
            </CartUpsellDSLayout>
          )
        ) : (
          <React.Fragment>
            {experiments?.glammClubUpsell === "1" ? (
              <GlammClubUpsellLayout dsWidgetRef={dsWidgetRef}>{getChildrenForTwoRowUpsell()}</GlammClubUpsellLayout>
            ) : (
              <CartUpsellDSLayout
                dsWidgetRef={dsWidgetRef}
                isUpsellOnPayment={isUpsellOnPayment}
                cartTitle={progressbarMilestoneUpsellLabel ? progressbarMilestoneUpsellLabel?.heading : upsellData?.cartTitle}
                cartSubTitle={
                  progressbarMilestoneUpsellLabel ? progressbarMilestoneUpsellLabel?.title : upsellData?.cartSubTitle
                }
              >
                {getChildrenForTwoRowUpsell()}
              </CartUpsellDSLayout>
            )}
          </React.Fragment>
        )}

        {showGiftCardTermsAndConditions && (
          <GiftCardDetails
            show={showGiftCardTermsAndConditions}
            onClose={() => setShowGiftCardTermsAndConditions(false)}
            selectedProduct={selectedProduct}
            handleAddToBag={handleAddProductToBag}
            minBillAmount={selectedProduct?.minimumBillAmount}
          />
        )}

        {miniPDPProduct && typeof showMiniPDP === "boolean" && (
          <UpsellMiniPDPV2
            show={showMiniPDP}
            miniPDPProduct={miniPDPProduct}
            hide={() => setShowMiniPDP(false)}
            upsellTitle={upsellTitle}
            isUpsellOnPayment={isUpsellOnPayment}
            upsellHeading={upsellData.cartTitle}
          />
        )}

        {selectedProduct && typeof showUpsellComboModal === "boolean" && (
          <UpsellComboProductsModal
            show={showUpsellComboModal}
            close={() => setShowUpsellComboModal(false)}
            product={selectedProduct}
            isUpsellOnPayment={isUpsellOnPayment}
            upsellTitle={upsellTitle}
          />
        )}
      </React.Fragment>
    );
  }

  return null;
};

export default CartUpsellV2;
