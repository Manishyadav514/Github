import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "@libHooks/useValtioSelector";

import CartAPI from "@libAPI/apis/CartAPI";

import useWislist from "@libHooks/useWishlist";
import useTranslation from "@libHooks/useTranslation";

import { addToBag } from "@libStore/actions/cartActions";

import Adobe from "@libUtils/analytics/adobe";

import { ADOBE } from "@libConstants/Analytics.constant";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { ValtioStore } from "@typesLib/ValtioStore";
import { GAAddProduct } from "@checkoutLib/Cart/Analytics";
import { GAaddToCart } from "@libUtils/analytics/gtm";
import { showError } from "@libUtils/showToaster";
import { formatPrice } from "@libUtils/format/formatPrice";

export interface Button {
  product: any;
  type: number;
}

const MoveToBag = ({ product, type }: Button) => {
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));
  const router = useRouter();
  const { t } = useTranslation();

  const { removeProduct } = useWislist();

  const cartApi = new CartAPI();

  const [loader, setLoader] = useState(false);

  const handleMoveToBag = () => {
    setLoader(true);
    cartApi
      .addToBag({
        identifier: localStorage.getItem("memberId"),
        isGuest: false,
        products: [
          {
            productId: product.productId,
            quantity: 1,
            type,
            subProductType: product.type || 1,
          },
        ],
      })
      .then(({ data: res }: any) => {
        adobeAddToCart(product);
        addToBagGAEvent(product);
        addToBag(res);
        setLoader(false);
        removeProduct(product.productId);
        router.push("/shopping-bag");
      })
      .catch((err: any) => {
        setLoader(false);
        const { message } = err.response?.data?.error || {};
        console.error("Move to bag error ", err);
        if (message) {
          showError(message);
        }
      });
  };

  // Adobe Analytics(83) - On Click - WishList - Add To Bag
  const adobeAddToCart = (addedProduct: any) => {
    let ddlStockStatus = "";
    let ddlIsPreOrder = "";
    const prepareDatalayer = async () => {
      ddlStockStatus = addedProduct.inStock ? `in stock` : `out of stock`;
      ddlIsPreOrder = addedProduct.isPreOrder ? `yes` : `no`;
    };
    prepareDatalayer();

    (window as any).digitalData = {
      common: {
        linkName: `wishlist summary page|my wishlist|move to bag`,
        linkPageName: `web|wishlist summary page|my wishlist`,
        newLinkPageName: "my wishlist",
        assetType: "wishlist",
        newAssetType: "wishlist",
        subSection: `wishlist`,
        platform: ADOBE.PLATFORM,
        ctaName: "move to bag",
      },
      user: Adobe.getUserDetails(profile),
      product: [
        {
          productSKU: addedProduct.sku,
          productQuantity: 1,
          productOfferPrice: formatPrice(addedProduct.priceOffer),
          productPrice: formatPrice(addedProduct.priceMRP),
          productDiscountedPrice: formatPrice(addedProduct.priceMRP - addedProduct.priceOffer),
          productRating: "",
          productTotalRating: "",
          stockStatus: `${ddlStockStatus}`,
          isPreOrder: `${ddlIsPreOrder}`,
          PWP: "",
          hasTryOn: "no",
        },
      ],
    };
    Adobe.Click();
  };

  // #region // *WebEngage [16] - Product Add To Cart - Wishlist Page : GA Function
  const addToBagGAEvent = (product: any) => {
    const productData = {
      id: product.productId,
      sku: product.sku,
      type: product.type,
      inStock: product.inStock,
      offerPrice: product.priceOffer,
      price: product.priceMRP,
      productTag: "",
      urlManager: { url: product.slug },
      assets: [{ imageUrl: { ["200x200"]: product.imageURL }, name: "" }],

      cms: [
        {
          content: {
            name: product.productName,
            subtitle: product.productSubTitle,
          },
          attributes: {
            shadeLabel: product.shadeLabel,
          },
        },
      ],

      productMeta: {
        isPreOrder: product?.isPreOrder,
        showInParty: false,
        tryItOn: false,
        allowShadeSelection: false,
      },

      products: [],
    };

    GAaddToCart(GAAddProduct(productData, ""), "");
  };

  return (
    <button
      type="button"
      disabled={loader}
      onClick={handleMoveToBag}
      className={`text-white uppercase font-semibold py-2 text-xs w-2/5 rounded relative ${
        loader ? "opacity-50" : "opacity-100"
      }`}
      style={{
        backgroundImage: "linear-gradient(to left, #000000, #454545)",
      }}
    >
      {t("addToBag")}
      {loader && <LoadSpinner className="absolute w-6 right-0 top-0 left-0 bottom-0 m-auto" />}
    </button>
  );
};

export default MoveToBag;
