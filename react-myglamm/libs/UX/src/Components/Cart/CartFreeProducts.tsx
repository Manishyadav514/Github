import React, { Fragment, useEffect } from "react";
import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";

import { ADOBE } from "@libConstants/Analytics.constant";

import Adobe from "@libUtils/analytics/adobe";
import { formatPrice } from "@libUtils/format/formatPrice";
import { GAProductRemovedFromCart } from "@libUtils/analytics/gtm";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { updateProducts, selectFreeGiftAgain } from "@checkoutLib/Cart/HelperFunc";
import { GARemoveProduct, getCartAdobeProduct } from "@checkoutLib/Cart/Analytics";

import { ValtioStore } from "@typesLib/ValtioStore";
import { cartProduct, cartType } from "@typesLib/Cart";

import { addToBag, updateCartLoader } from "@libStore/actions/cartActions";

import Checkbox from "../../../public/svg/checkbox.svg";
import DeleteIcon from "../../../public/svg/dustbinIcon.svg";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

interface CartFreeProdProps {
  updateCheckout: () => void;
  setShowRemoveProductModal: (_: boolean) => void;
}

const CartFreeProducts = ({ updateCheckout, setShowRemoveProductModal }: CartFreeProdProps) => {
  const { t } = useTranslation();

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);
  const { gwpProducts, pwpProducts, couponData, miscellaneousProducts } = useSelector(
    (store: ValtioStore) => store.cartReducer.cart
  );

  const freeProducts = [...pwpProducts, ...gwpProducts];

  const backgroundStyle = (cartType: cartType): React.CSSProperties =>
    cartType === 8
      ? {
          background: "url(https://files.myglamm.com/site-images/original/backgift.png) right bottom no-repeat #ffebeb",
          backgroundPositionX: "100%",
          backgroundPositionY: "100%",
          backgroundSize: "3rem 3rem",
        }
      : {};

  /* Prompt alert for user before removing a product from cart */
  const removeFreeProduct = (product: cartProduct) => {
    if (
      // eslint-disable-next-line no-alert
      !window.confirm("Are you sure you want to remove this product from the shopping bag?")
    ) {
      return;
    }

    updateCartLoader(true);
    updateProducts(product, -product.quantity).then((res: any) => {
      if (res) {
        adobeInitEvent(product);
        GAProductRemovedFromCart(GARemoveProduct(product));
        addToBag(res);
      }
      updateCartLoader(false);
    });
  };

  /**
   * In Case a user wants to reselect the free gift he/she can click on checkbox and based on
   * errorMessage we remove glammpoints/coupon re-enabling the gift in cart
   */
  const reSelectFreeGift = (product: cartProduct) => {
    selectFreeGiftAgain(product, couponData);
    updateCheckout();
  };

  /**
   * ADOBE - ANALYTICS - CLICK EVENT - REMOVE FREE GIFT
   */
  const adobeInitEvent = (product: cartProduct) => {
    (window as any).digitalData = {
      common: {
        linkName: "web|cart summary page|remove",
        linkPageName: "web|cart summary page|shopping bag",
        assetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        newAssetType: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        newLinkPageName: ADOBE.ASSET_TYPE.SHOPPING_BAG,
        subSection: "",
        platform: ADOBE.PLATFORM,
        ctaName: "product remove",
      },
      user: Adobe.getUserDetails(userProfile),
      product: getCartAdobeProduct([product]).product,
    };
    Adobe.Click();
  };

  /* ADOBE EVENT - PAGELOAD - Glamm Club Membershop SKU */
  useEffect(() => {
    if (miscellaneousProducts && miscellaneousProducts.length > 0) {
      const memberShipProduct = miscellaneousProducts.find(miscProduct => miscProduct?.moduleName === 1);
      if (memberShipProduct) {
        ADOBE_REDUCER.adobePageLoadData = {
          common: {
            pageName: `web|Cart Page|Glammclub Membership|${memberShipProduct?.sku}`,
            newPageName: "Shopping Bag",
            subSection: "Glammclub Membership",
            assetType: "Glammclub Membership",
            newAssetType: "Glammclub Membership",
            platform: ADOBE.PLATFORM,
            pageLocation: "",
            technology: ADOBE.TECHNOLOGY,
          },
        };
      }
    }
  }, []);

  return (
    <>
      <Fragment>
        {miscellaneousProducts?.map(
          product =>
            product?.moduleName && (
              <div key={product.productId} className="px-3 py-1 mb-2 bg-white relative rounded border-[1px] border-orange-100">
                <div className="w-full flex items-center">
                  <div className="flex items-center grow">
                    <ImageComponent alt={product?.name} src={product?.imageUrl} className="w-16" />

                    <div className="flex flex-col justify-around w-4/5 pl-4">
                      {/* ERROR MESSAGE */}
                      <p className="text-red-600 pr-2 text-xxs mb-1">{product?.errorMessage}</p>

                      <h6 className="text-sm normal-case text-color1 font-bold mb-1 line-clamp-2">
                        {product?.productTag || product?.name}
                      </h6>
                      <p className="text-xs mb-1">{product?.subtitle || product?.shadeLabel}</p>
                      <div className="flex text-sm">
                        <span className="font-semibold uppercase mr-1">
                          {product?.moduleName === 2
                            ? formatPrice(product?.offerPrice, true, true)
                            : product?.offerPrice === product?.price
                            ? t("free")
                            : product?.price}
                        </span>
                        <del className="pl-2 opacity-50">{formatPrice(product?.totalPrice, true)}</del>
                      </div>
                    </div>

                    {product?.moduleName === 2 ? (
                      <DeleteIcon
                        width={20}
                        height={20}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          setShowRemoveProductModal(true);
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )
        )}
      </Fragment>
      <Fragment>
        {freeProducts?.length > 0 && (
          <div>
            <h4 className="font-semibold mt-2 mb-1 text-xs">{t("cartFreeGifts")}</h4>

            {freeProducts?.map(product => (
              <div
                key={product.productId}
                style={backgroundStyle(product.cartType)}
                className="p-3 mb-2 bg-white relative rounded"
              >
                {/* DELETE/REMOVE FREE PRODUCT */}
                <DeleteIcon
                  className="absolute  right-2 top-3.5"
                  onClick={() => removeFreeProduct(product)}
                  role="img"
                  aria-labelledby="remove free products"
                />

                <div className="w-full flex items-center">
                  <div className="pr-5 mr-0.5 pl-2.5 h-5">
                    {product.errorFlag ? (
                      <button
                        aria-hidden
                        type="button"
                        onClick={() => reSelectFreeGift(product)}
                        disabled={!product.errorMessage.match(/glammPOINTS|promo code/)}
                        className="border border-darkpink w-5 h-5 bg-white my-auto rounded outline-none"
                      />
                    ) : (
                      <Checkbox className="m-auto w-5 h-5" />
                    )}
                  </div>

                  <div className="flex items-center">
                    <ImageComponent alt={product.name} src={product.imageUrl} className="w-12 h-12 mr-2" />

                    <div className="flex flex-col justify-around w-4/5">
                      {/* ERROR MESSAGE */}
                      <p className="text-red-600 pr-2 text-xxs mb-1">{product.errorMessage}</p>

                      <h6 className="text-xs  mb-1 line-clamp-2 ">{product.name}</h6>
                      <p className="uppercase opacity-50 text-10 font-semibold mb-1">{product.shadeLabel}</p>
                      <div className="flex">
                        <span className="font-semibold text-xs uppercase">{t("free")}</span>
                        <del className="pl-2 opacity-50 text-10">{formatPrice(product.offerPrice, true)}</del>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Fragment>
    </>
  );
};

export default CartFreeProducts;
