import React, { useState } from "react";
import dynamic from "next/dynamic";

import ShowUpsellProductsTitle from "./ShopUpsellProductsTitle";
import CartUpsellProduct from "./CartUpsellProduct";
import CartUpsell from "./CartUpsellNucleus";
import CartUpsellSkeleton from "@libComponents/Skeleton/CartUpsellSkeleton";
import DisplayListOfCategories from "./DisplayListOfCategories";
import UpsellMiniPDPV2 from "@libComponents/PopupModal/UpsellMiniPDPV2";

import useDsAdobe from "@libHooks/useDsAdobe";
import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import { useFetchUpsellCartProduct } from "@libHooks/useFetchUpsellCartProducts";

import { addToBag, updateCartLoader } from "@libStore/actions/cartActions";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";

import { ValtioStore } from "@typesLib/ValtioStore";
import { MiniPDPProd } from "@typesLib/Cart";

import {
  getAnalyticsOfTheUpsellProductClicked,
  getCustomDataToDisplayUpsellProduct,
  updateProducts,
} from "@checkoutLib/Cart/HelperFunc";
import { GAaddToCart } from "@libUtils/analytics/gtm";
import { GAAddProduct, upsellAddToBagClickEvent, upsellClickV2Event } from "@checkoutLib/Cart/Analytics";

const UpsellComboProductsModal = dynamic(
  () => import(/* webpackChunkName: "UpsellComboProductsModal" */ "../../PopupModal/UpsellComboProductsModal"),
  {
    ssr: false,
  }
);

const CartUpsellPersonalized = ({ couponFreeProductData, variants }: any) => {
  const { t } = useTranslation();
  const [miniPDPProduct, setMiniPDPProduct] = useState<MiniPDPProd>();
  const [showMiniPDP, setShowMiniPDP] = useState<boolean | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState();
  const [showUpsellComboModal, setShowUpsellComboModal] = useState<boolean | undefined>();

  const { cart, userProfile } = useSelector((store: ValtioStore) => ({
    cart: store.cartReducer.cart,
    userProfile: store.userReducer,
  }));

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
  } = useFetchUpsellCartProduct({ upsellType: "personalizedUpsell", couponFreeProductData });

  /* Trigger Ds load Adobe Event */
  const { dsWidgetRef } = useDsAdobe({
    title: "Personalised picks For you",
    dsWidgetType: "true",
    products: upsellData?.products,
    variantValue: upsellData?.variantValue || "",
    evarName: "evar136",
  });

  const handleAddToBag = (product: any) => {
    SOURCE_STATE.addToBagSource = upsellData?.cartTitle || "other";
    SOURCE_STATE.pdpSource = upsellData?.cartTitle || "other";
    upsellClickV2Event(userProfile, cart);

    if (product.subProductType === 2) {
      /* In-case upsell product has combo */
      setSelectedProduct({
        ...product,
        upsellKey: upsellData?.key,
        childProductIds: product.childProductIds,
        variantValue: upsellData?.variantValue,
      });

      setShowUpsellComboModal(true);
    } else if (product.productTag && product.shadeCount > 1) {
      /* In-Case of  Multiple Shades Show MiniPDP */
      openMiniPdpModal(product);
      updateCartLoader(false);
    } else {
      updateCartLoader(true);
      const type = product.subProductType;
      const variantValue = upsellData.variantValue;
      const childProductIds = product.childProductIds;
      const upsellKey = upsellData?.key;
      const upsellTitle = "Personalised picks For you";

      return updateProducts({ ...product, type, variantValue, childProductIds, upsellKey }, 1).then((res: any) => {
        if (res) {
          addToBag(res);
          upsellAddToBagClickEvent(product, upsellTitle, upsellKey);
          GAaddToCart(GAAddProduct(product, undefined, false, upsellData.cartTitle), "");
        }

        updateCartLoader(false);
      });
    }
  };

  const openMiniPdpModal = (product: any) => {
    SOURCE_STATE.addToBagSource = upsellData?.cartTitle || "other";

    getAnalyticsOfTheUpsellProductClicked(
      product,
      upsellProducts,
      cart.shippingCharges,
      cart.payableAmount * 100, // send payable amount in paise
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
  };

  /* Skeleton Loader */
  if (showSkeleton) {
    return <CartUpsellSkeleton />;
  }

  if (showNucleusUpsellProducts) {
    return <CartUpsell showCallbackPersonalisedUpsell={showNucleusUpsellProducts} showSingleRow={true} variants={variants} />;
  }

  if (upsellData) {
    return (
      <div
        className={`w-full py-2  rounded mb-2 mt-2 ${variants?.glammClubUpsell === "1" ? "bg-pink-50" : "bg-color2"}`}
        ref={dsWidgetRef}
      >
        <ShowUpsellProductsTitle cartTitle={upsellData.cartTitle} cartSubTitle={upsellData.cartSubTitle} />
        <div className="flex items-center overflow-x-scroll">
          <DisplayListOfCategories
            showPersonalizedDsTags={showPersonalizedDsTags}
            globalDsTags={globalDsTags}
            categories={categories}
            getCategoryProducts={getCategoryProducts}
            tabIndex={tabIndex}
          />
        </div>
        <div className="w-full flex overflow-x-scroll px-1">
          {upsellProducts?.map((product: any) => {
            /* customizing the response for using CartUpsellProduct component */
            const _upsellProduct = getCustomDataToDisplayUpsellProduct(product);
            return (
              <CartUpsellProduct
                product={_upsellProduct}
                handleAddToBag={handleAddToBag}
                key={_upsellProduct?.id}
                openMiniPdpModal={openMiniPdpModal}
                variants={variants}
              />
            );
          })}
        </div>
        {miniPDPProduct && typeof showMiniPDP === "boolean" && (
          <UpsellMiniPDPV2
            show={showMiniPDP}
            miniPDPProduct={miniPDPProduct}
            hide={() => setShowMiniPDP(false)}
            upsellTitle="Personalised picks For you"
            upsellHeading={upsellData.cartTitle}
          />
        )}

        {selectedProduct && typeof showUpsellComboModal === "boolean" && (
          <UpsellComboProductsModal
            show={showUpsellComboModal}
            close={() => setShowUpsellComboModal(false)}
            product={selectedProduct}
            upsellTitle="Personalised picks For you"
          />
        )}
      </div>
    );
  }
  return null;
};

export default CartUpsellPersonalized;
