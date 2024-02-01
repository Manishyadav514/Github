import React, { useEffect, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";

import CartAPI from "@libAPI/apis/CartAPI";
import useTranslation from "@libHooks/useTranslation";

import { formatPrice } from "@libUtils/format/formatPrice";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { ValtioStore } from "@typesLib/ValtioStore";
import { cartFreeProduct } from "@typesLib/Cart";

import Checkbox from "../../../public/svg/checkbox.svg";
import DeleteIcon from "../../../public/svg/dustbinIcon.svg";

interface couponProdProps {
  productData?: cartFreeProduct;
  updateCheckout: () => void;
  setCouponFreeProductData: any;
}

const CouponFreeProduct = ({ productData, updateCheckout, setCouponFreeProductData }: couponProdProps) => {
  const { t } = useTranslation();

  const { couponData } = useSelector((store: ValtioStore) => store.cartReducer.cart);
  const [couponProduct, setCouponProduct] = useState<cartFreeProduct>();

  useEffect(() => {
    const couponProductId = getLocalStorageValue(LOCALSTORAGE.DISCOUNT_PRODUCT_ID);

    if (!couponData?.freeProduct?.id) {
      /* Coupon Changed or Removed from cart */
      setCouponProduct(undefined);
    } else if (productData) {
      /* Coupon Free Product Added in Parent Component */
      setCouponProduct(productData);
    } else if (couponProductId) {
      /* In Case Coupon Product Data Stored in Localstorage make a product Call and render it */
      const cartApi = new CartAPI();

      cartApi
        .getProductCustom([couponProductId], ["cms", "assets", "offerPrice", "inStock", "type", "sku"])
        .then(({ data: res }) => {
          setCouponProduct(res.data.data[0]);
          setCouponFreeProductData(res.data.data[0]);
        });
    }
  }, [productData, couponData?.freeProduct]);

  /* Prompt alert for user before removing Coupon Free Product */
  const removeFreeProduct = () => {
    if (
      // eslint-disable-next-line no-alert
      !window.confirm("Are you sure you want to remove this product from the shopping bag?")
    ) {
      return;
    }

    setCouponProduct(undefined);
    removeLocalStorageValue(LOCALSTORAGE.DISCOUNT_PRODUCT_ID);
    removeLocalStorageValue(LOCALSTORAGE.COUPON);

    /* In case of autoapply add coupon in ignore discountCodes */
    if (couponData.autoApply) {
      const ignoreCoupons = JSON.parse(getLocalStorageValue(LOCALSTORAGE.IGNORE_DISCOUNT) || "[]");
      setLocalStorageValue(LOCALSTORAGE.IGNORE_DISCOUNT, [...ignoreCoupons, couponData.couponCode], true);
    }

    updateCheckout();
  };

  if (couponProduct?.inStock) {
    return (
      <div
        key={couponProduct.id}
        style={{
          background: "url(https://files.myglamm.com/site-images/original/backgift.png) right bottom no-repeat #ffebeb",
          backgroundPositionX: "100%",
          backgroundPositionY: "100%",
          backgroundSize: "3rem 3rem",
        }}
        className="p-3 mb-2 bg-white relative rounded"
      >
        {/* DELETE/REMOVE FREE PRODUCT */}
        <DeleteIcon
          onClick={removeFreeProduct}
          className="absolute right-2 top-2"
          role="img"
          aria-labelledby="remove free products"
        />

        <div className="w-full flex items-center">
          <div className="pr-5 mr-0.5 pl-2.5 h-5">
            <Checkbox className="m-auto w-5 h-5" />
          </div>

          <div className="flex items-center">
            <ImageComponent
              alt={couponProduct.cms[0]?.content.name}
              src={couponProduct.assets[0]?.imageUrl?.["200x200"]}
              className="w-12 h-12 mr-2"
            />

            <div className="flex flex-col justify-around w-4/5">
              <h6 className="text-xs line-clamp-2 mb-1 mr-1">{couponProduct.cms[0]?.content.name}</h6>
              <p className="uppercase opacity-50 text-10 font-semibold mb-1">{couponProduct.cms[0]?.attributes?.shadeLabel}</p>
              <div className="flex items-center">
                <span className="font-semibold text-xs uppercase">{t("free")}</span>
                <del className="pl-2 opacity-50 text-10">{formatPrice(couponProduct.offerPrice, true)}</del>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CouponFreeProduct;
