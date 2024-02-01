import React from "react";
import clsx from "clsx";

import TagsFlag from "@libComponents/TagsFlag";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import LoadSpinner from "@libComponents/Common/LoadSpinner";

import useTranslation from "@libHooks/useTranslation";

import { formatPrice } from "@libUtils/format/formatPrice";

import { ICartUpsellProduct, WidgetProduct } from "@typesLib/Cart";

import StarIcon from "../../../../public/svg/star-filled.svg";
import AddToBag from "../../../../public/svg/AddToBag.svg";

const ProductRatings = ({ product }: { product: WidgetProduct }) => {
  return (
    <div
      className={clsx(
        "border border-gray-200 font-semibold text-10 mb-1  flex justify-between items-center rounded-full w-9 px-1 ",
        (product?.rating?.avgRating as number) > 0 ? "" : "opacity-0"
      )}
    >
      {product?.rating?.avgRating?.toFixed(1)}
      <StarIcon width={10} height={10} className="-mt-0.5 ml-1" role="img" aria-labelledby="product rating" />
    </div>
  );
};

const ProductPrice = ({ product }: { product: WidgetProduct }) => {
  const { t } = useTranslation();
  if (product.offerPrice < product.price) {
    return (
      <div className="flex items-center">
        <span className="text-xs font-bold">{formatPrice(product.offerPrice, true)}</span>
        <del className="text-left text-gray-600 opacity-60 text-xs ml-1">{formatPrice(product.price, true)}</del>
        {/* <span className="text-xs font-bold text-green-600 lowercase ml-1">
            {t("priceOffPercentage", [Math.round(((product.price - product.offerPrice) / product.price) * 100).toString()])}
          </span> */}
      </div>
    );
  }

  return <div className="font-semibold text-xs">{formatPrice(product.price, true)}</div>;
};

const DisplayUpsellProductDetailsWithTwoRows = ({ product }: { product: WidgetProduct }) => {
  return (
    <React.Fragment>
      <ProductRatings product={product} />
      <p className="capitalize leading-tight text-xs h-8  line-clamp-2 overflow-hidden text-10 p-1">
        {product.cms[0]?.content.name}
      </p>

      {/* Price PlaceHolder */}
      <div className="px-1 mt-2">
        <ProductPrice product={product} />
      </div>
    </React.Fragment>
  );
};

const CartUpsellProductV1 = ({
  product,
  loader,
  handleAddToBag,
  openMiniPdpModal,
  variantTagsFlag,
  isScrollTogether,
}: ICartUpsellProduct) => {
  return (
    <div
      className={`bg-white shadow  rounded-lg p-1  border relative border-themeGray  ${
        isScrollTogether ? "my-2" : "flex-sliderChild w-1/3 m-1 "
      } `}
      onClick={() => {
        openMiniPdpModal(product);
      }}
    >
      <TagsFlag variant={variantTagsFlag} tagName={product?.productMeta?.tags?.[0]?.name} cls="top-1 left-1 w-16" />
      <ImageComponent
        alt={product?.assets?.[0]?.name}
        className="h-110px w-110px mx-auto"
        src={product?.assets?.[0]?.imageUrl?.["200x200"]}
      />
      <DisplayUpsellProductDetailsWithTwoRows product={product} />

      <button
        type="button"
        disabled={loader === product.id}
        onClick={e => {
          e.stopPropagation();
          handleAddToBag(product);
        }}
        className="flex uppercase items-center text-11 w-full justify-center relative  rounded text-color1 p-1 font-bold mt-2 text-white"
      >
        {<AddToBag />}

        {loader === product.id && <LoadSpinner className="absolute inset-0 m-auto w-6" />}
      </button>
    </div>
  );
};

export default CartUpsellProductV1;
