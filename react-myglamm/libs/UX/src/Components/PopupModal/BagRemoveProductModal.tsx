import React, { useEffect } from "react";

import useWislist from "@libHooks/useWishlist";
import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

import Adobe from "@libUtils/analytics/adobe";
import { formatPrice } from "@libUtils/format/formatPrice";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import PopupModal from "./PopupModal";

import Heart from "../../../public/svg/pinkHeart.svg";

const BagRemoveProductModal = ({ view, hide, product, remove }: any) => {
  const { t } = useTranslation();

  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));
  const { addProduct } = useWislist();

  const handleRemoveProduct = (addToWishlist?: boolean) => {
    remove(product.productId, product.type, product);
    if (addToWishlist) {
      addProduct(product.productId);
      adobeAddToWishlistClick(product);
      hide();
    }
  };

  const adobeAddToWishlistClick = (wishedProduct: any) => {
    const adobeProduct = {
      PWP: "",
      hasTryOn: !!wishedProduct?.productMeta?.tryItOn,
      isPreOrder: wishedProduct?.productMeta?.isPreOrder,
      productDiscountedPrice: formatPrice(wishedProduct?.price - wishedProduct?.offerPrice),
      productOfferPrice: formatPrice(wishedProduct?.offerPrice),
      productPrice: formatPrice(wishedProduct?.price),
      productQuantity: wishedProduct?.quantity,
      productRating: 0,
      productSKU: wishedProduct?.sku,
      productTotalRating: 0,
      stockStatus: product.errorFlag && product.errorMessage.includes("Product out of stock") ? "out of stock" : "in stock",
    };

    (window as any).digitalData = {
      common: {
        linkName: `web|shopping bag|add to wishlist`,
        linkPageName: `web|remove product`,
        newLinkPageName: `remove product`,
        assetType: "shopping bag",
        newAssetType: "shopping bag",
        subSection: "shopping bag",
        platform: ADOBE.PLATFORM,
        ctaName: "add to wishlist",
        pageLocation: "shopping bag",
      },
      user: Adobe.getUserDetails(profile),
      product: [adobeProduct] || [{}],
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
      product: [
        {
          productSKU: product?.sku,
          productQuantity: product?.quantity,
          productOfferPrice: formatPrice(product?.offerPrice),
          productPrice: formatPrice(product?.price),
          productDiscountedPrice: formatPrice(product?.price - product?.offerPrice),
          productRating: "", //Ratings.avgRating,
          productTotalRating: "", //Ratings.totalCount,
          stockStatus: `${!product?.errorFlag ? "in stock" : "out of stock"}`,
          isPreOrder: `${product?.productMeta?.isPreOrder ? "yes" : "no"}`,
          // eslint-disable-next-line no-nested-ternary
          PWP: product?.freeProducts?.length === 1 ? product?.freeProducts[0]?.productTag : "",
          hasTryOn: "no",
        },
      ],
    };

    ADOBE_REDUCER.adobePageLoadData = pageload;
  }, []);

  return (
    <PopupModal show={view} onRequestClose={hide}>
      <section className="pt-4" style={{ borderRadius: "10px 10px 0 0" }}>
        <h3 className="px-4 text-sm font-semibold">{t("removeProduct")}</h3>
        <p className="px-4">{t("sureRemoveProduct")}</p>

        <div className="flex mt-5 border-t border-gray-200 pt-4 px-4">
          <ImageComponent
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: "74px",
              height: "74px",
              margin: "0 1rem 1rem 0",
            }}
          />
          <div className="w-4/5 font-semibold pl-2">
            <p className="text-xs truncate">{product.name}</p>
            <p className="font-light opacity-50 text-xs truncate my-2">{product.subtitle}</p>
            <span className="uppercase text-xxs text-gray-600 truncate">{product.shadeLabel}</span>

            <div className="flex my-3">
              <span className="font-semibold mr-1">{formatPrice(product.offerPrice, true)}</span>
              {product.offerPrice === product.price && (
                <del className="text-xxs opacity-75 text-gray-600 my-auto font-light">{formatPrice(product.price, true)}</del>
              )}
            </div>
          </div>
        </div>

        <div className="flex border-t border-gray-200 px-4">
          <button
            type="button"
            style={{ outline: "none" }}
            className="w-1/2 bg-transparent py-4"
            onClick={() => handleRemoveProduct()}
          >
            {t("remove")}
          </button>
          <button
            type="button"
            style={{ outline: "none" }}
            className="w-1/2 flex bg-transparent py-4 justify-center items-center font-semibold uppercase"
            onClick={() => handleRemoveProduct(true)}
          >
            {t("addToWishlist")} <Heart className="ml-3" />
          </button>
        </div>
      </section>
    </PopupModal>
  );
};

export default BagRemoveProductModal;
