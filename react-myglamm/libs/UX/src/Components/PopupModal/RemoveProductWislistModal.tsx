import React, { useEffect } from "react";
import clsx from "clsx";

import useWislist from "@libHooks/useWishlist";
import useTranslation from "@libHooks/useTranslation";

import { ADOBE } from "@libConstants/Analytics.constant";

import Adobe from "@libUtils/analytics/adobe";
import { showSuccess } from "@libUtils/showToaster";

import { useSelector } from "@libHooks/useValtioSelector";

import { getCartAdobeProduct } from "@checkoutLib/Cart/Analytics";

import { cartProduct } from "@typesLib/Cart";
import { ValtioStore } from "@typesLib/ValtioStore";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import PopupModal from "./PopupModal";

import Heart from "../../../public/svg/pinkHeart.svg";
import ProductUI from "@libComponents/Cart/CartProductUIForProductRemoval";

interface removeModalProps {
  show: boolean;
  product: cartProduct;
  hide: () => void;
  remove: (prod: cartProduct, qnty: number, remove: boolean) => void;
}

const RemoveProductWislistModal = ({ show, product, hide, remove }: removeModalProps) => {
  const { t } = useTranslation();

  const { addProduct, gaAddtoWishlist } = useWislist();

  const { userProfile, upsellOfferProducts, products, userWishlist } = useSelector((store: ValtioStore) => ({
    products: store.cartReducer.cart.products,
    userProfile: store.userReducer.userProfile,
    upsellOfferProducts: store.cartReducer.cart.upsellOfferProducts,
    userWishlist: store.userReducer.userWishlist,
  }));

  const isProductAlreadyWishListed = userWishlist?.find((x: string) => x === product.productId);
  const productThatWillAlsoBeRemoved = products?.filter(
    x => upsellOfferProducts?.includes(x?.productId) && !upsellOfferProducts?.includes(product?.productId)
  );

  /* REMOVE PRODUCT FROM CART */
  const handleRemoveProduct = (addToWishlist = false) => {
    /* Remove product from cart in an case */
    remove(product, -product.quantity, true);

    /* Add Product to Wishlst too in case Add to Wishlist Click */
    if (addToWishlist) {
      addProduct(product.productId);
      adobeAddToWishlistClick();
      addToWishlistGAEvent(product);
    }
    hide();
  };

  /* ANALYTICS */
  const adobeProduct = getCartAdobeProduct([product]).product;

  const adobeAddToWishlistClick = () => {
    (window as any).digitalData = {
      common: {
        linkName: "web|shopping bag|add to wishlist",
        linkPageName: "web|remove product",
        newLinkPageName: "remove product",
        assetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        newAssetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        subSection: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        platform: ADOBE.PLATFORM,
        ctaName: "add to wishlist",
        pageLocation: ADOBE.ASSET_TYPE.SHOPPING_BAG,
      },
      user: Adobe.getUserDetails(userProfile),
      product: adobeProduct,
    };
    Adobe.Click();
  };

  // Adobe Analytics[60] - Page Load - Home
  useEffect(() => {
    const pageload = {
      common: {
        pageName: `web|${ADOBE.ASSET_TYPE.REMOVE_PRODUCT}`,
        newPageName: `${ADOBE.ASSET_TYPE.REMOVE_PRODUCT}`,
        subSection: ADOBE.ASSET_TYPE.REMOVE_PRODUCT,
        assetType: ADOBE.ASSET_TYPE.REMOVE_PRODUCT,
        newAssetType: ADOBE.ASSET_TYPE.REMOVE_PRODUCT,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      product: adobeProduct,
    };

    ADOBE_REDUCER.adobePageLoadData = pageload;
  }, []);

  const addToWishlistGAEvent = (product: any) => {
    let category = "";

    if (product?.productCategory) {
      const categoryIndex = product?.productCategory?.findIndex((x: any) => x.type === "parent");
      category = product?.productCategory[categoryIndex]?.name;
    }
    const productName = product?.name || product.productTag;
    gaAddtoWishlist({ ...product, productName }, category);
  };

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section className="pt-4 rounded-t-lg">
        <h3 className="px-4 text-sm font-semibold">{t("removeProduct")}</h3>
        <p className="px-4 text-sm pb-2">{t("sureRemoveProduct")}</p>
        <div className="overflow-y-auto  max-h-75vh">
          <div className="flex mt-5 border-t border-gray-200 pt-4 px-4 ">
            <ProductUI product={product} />
          </div>

          {productThatWillAlsoBeRemoved?.length ? (
            <div className="bg-color2 pt-4 px-4">
              <div className="text-sm">{t("upsellProductRemoval") || "Offered Products will also be removed"}</div>
              {productThatWillAlsoBeRemoved?.map(item => {
                return (
                  <div className="flex border-b border-gray-200 pt-2 ">
                    <ProductUI product={item} />
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="flex border-t border-gray-200">
          <button type="button" onClick={() => handleRemoveProduct()} className="w-1/2 py-4 outline-none uppercase">
            {t("remove")}
          </button>
          <button
            type="button"
            // disabled={!!isProductAlreadyWishListed}
            onClick={() => {
              if (isProductAlreadyWishListed) {
                showSuccess(t("itemAlreadyWishlisted") || "Item already wishlisted ");
                return;
              }
              handleRemoveProduct(true);
            }}
            className={clsx(
              "w-1/2 flex py-4 justify-center items-center font-semibold outline-none uppercase",
              isProductAlreadyWishListed && "text-gray-300"
            )}
          >
            {t("addToWishlist")} <Heart className="mx-1" />
          </button>
        </div>
      </section>
    </PopupModal>
  );
};

export default RemoveProductWislistModal;
