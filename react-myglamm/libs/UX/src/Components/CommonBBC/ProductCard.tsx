import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Link from "next/link";

import SecondaryBtn from "@libComponents/CommonBBC/SecondaryBtn";
import Rating from "@libComponents/CommonBBC/Rating";

import { GAgenericEvent } from "@libUtils/analytics/gtm";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

interface PropTypes {
  productImage: string;
  rating: number;
  productTitle: string;
  offerPrice: number;
  price: number;
  navigationLink: string;
}
const defaultProps = {};

const ProductCard = (props: PropTypes) => {
  const { productImage, rating, productTitle, offerPrice, price, navigationLink } = props;

  return (
    <Link href={navigationLink} aria-label={productTitle?.substring(0, 40)}>
      <div className="h-60 w-[160px] rounded-md text-center relative mb-4 border-solid border border-gray-300 bg-white mr-3">
        <LazyLoadImage
          src={productImage || DEFAULT_IMG_PATH()}
          style={{ width: "121px", height: "180px" }}
          className="mx-auto object-cover display-block"
        />
        <div className="absolute left-3.5 bottom-3">
          <Rating rating={rating} />
        </div>
      </div>
      <p className="text-xs font-normal w-36 h-8">{productTitle?.substring(0, 40)}...</p>
      <div className="mt-3 mb-6 flex items-center">
        <span className="text-base font-medium mr-1.5">₹{offerPrice < price ? offerPrice / 100 : price / 100}</span>
      </div>
      <SecondaryBtn
        buttonName="view more"
        buttonOnClick={() => {
          GAgenericEvent("Content & Community", "BBC Clicked Product", "");
        }}
      />
    </Link>
  );
};
ProductCard.defaultProps = defaultProps;

export default React.memo(ProductCard);
