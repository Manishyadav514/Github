import React from "react";

import useTranslation from "@libHooks/useTranslation";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import StarIcon from "../../../public/svg/star-filled.svg";
import BagIconWhite from "../../../public/svg/carticon-white.svg";
import { formatPrice } from "@libUtils/format/formatPrice";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const decode = require("unescape");

const ProductCard = ({
  contentName = "",
  productId,
  tryOn,
  stockStatus,
  preOrder,
  productSKU,
  title = "",
  image,
  image_alt_tag,
  sub_title,
  isFreeProduct,
  product_count,
  product_offer_price,
  product_price,
  product_slug,
  shadeLabel,
  icid,
  productPosition = 0,
  forceload = false,
  productRef = null,
  product,
  layoutClass,
  addToBag,
  loader,
  clickedUpsellProductId,
}: any) => {
  const { t } = useTranslation();

  const subTitle = decode(sub_title);

  return (
    <div
      ref={productRef}
      className={`bg-white m-2 shadow w-48 rounded-lg p-2 border relative border-themeGray ${layoutClass}`}
      style={{
        opacity: loader && clickedUpsellProductId === productId ? "0.5" : "1",
      }}
    >
      <div className="flex justify-center" style={{ minWidth: "120px" }}>
        <ImageComponent src={image} alt={image_alt_tag} className="h-110px w-110px rounded" forceLoad={forceload} />
      </div>
      <span
        className={`${
          product?.rating?.avgRating > 0 ? "" : "opacity-0"
        } h-5 w-10 border border-gray-200 font-semibold text-10 p-1 flex justify-between items-center rounded my-2`}
      >
        {product?.rating?.avgRating} <StarIcon className="w-2 h-2" />
      </span>
      <h2 className="capitalize h-6 leading-tight text-10 opacity-80 p-1 mb-2">{title?.substring(0, 43)}</h2>

      {/* Shades PlaceHolder */}
      {product_count && (
        <div className="h-5 items-center">
          {product_count === 1 ? (
            <div>
              <span className="font-bold items-center uppercase text-10 opacity-80 text-gray-600">{shadeLabel}</span>
            </div>
          ) : (
            product_count && (
              <div className="flex items-center">
                <img alt="more-shade" src="https://files.myglamm.com/site-images/original/more-shade.png" className="w-4 h-4" />
                <div className="ml-1.5">
                  <span className="font-bold items-center uppercase text-10 text-gray-600">
                    {product_count}&nbsp;{t("shades")}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Price PlaceHolder */}
      {product_offer_price && product_offer_price < product_price ? (
        <div className="flex p-1">
          <span className="flex items-center text-13 font-semibold mr-2">{formatPrice(product_offer_price, true, false)}</span>
          <del className="flex items-center text-11 font-light text-left text-gray-600 opacity-60">
            {formatPrice(product_price, true, false)}
          </del>
        </div>
      ) : (
        <div className="flex p-1">
          <span className="flex items-center text-13 font-semibold">{formatPrice(product_price, true, false)}</span>
        </div>
      )}

      {/* FreeProduct Tag */}
      {isFreeProduct && (
        <div className="flex h-4">
          <div className="w-1/9">
            <img alt="giftbox" className="w-4 h-4" src="https://files.myglamm.com/site-images/original/gwp.png" />
          </div>
          <div className="text-xs font-bold ml-2 text-red-500">{t("freeGiftPLP")}</div>
        </div>
      )}

      {/* Add Button */}
      <div className="flex flex-1 items-center content-center">
        {loader && clickedUpsellProductId === productId && (
          <LoadSpinner className="absolute w-12 right-0 top-0 left-0 bottom-0 m-auto" />
        )}
        <button
          style={{
            backgroundImage: "linear-gradient(to left, #000000, #454545)",
          }}
          type="button"
          className="p-1 rounded flex uppercase items-center text-white text-10 font-semibold w-full h-full justify-center relative"
          onClick={() => addToBag(product)}
        >
          <span className="ml-auto">ADD TO BAG</span>
          <span className="ml-auto">
            <BagIconWhite />
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
