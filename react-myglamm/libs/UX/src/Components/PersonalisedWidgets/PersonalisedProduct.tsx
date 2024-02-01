import React from "react";
import Link from "next/link";

import { formatPrice } from "@libUtils/format/formatPrice";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

const PersonalisedProduct = ({ product, width, icid, index }: any) => (
  <Link
    href={
      !icid
        ? `${product.urlManager.url}`
        : `${product.urlManager.url}?icid=${icid}_${product.cms[0].content.name.toLowerCase()}_${index + 1}`
    }
    className="mb-2"
    style={{
      width,
      marginRight: "2%",
      flex: "0 0 auto",
      boxShadow: "0 0 7px 0 rgba(0, 0, 0, 0.2)",
    }}
    aria-label={product.cms[0]?.content.name.substring(0, 45)}
  >
    <ImageComponent
      className="p-2"
      src={product.assets[0]?.imageUrl["400x400"]}
      alt={product.assets[0]?.properties?.imageAltTag || product.assets[0]?.name}
    />
    <div className="font-semibold p-2">
      <p className="text-xs h-8">
        {product.cms[0]?.content.name.substring(0, 45)}
        {product.cms[0]?.content.name.length > 46 && ".."}
      </p>
      <p className="text-xxs opacity-50 mt-1 h-8">
        {product.cms[0]?.content.subtitle.substring(0, 65)}
        {product.cms[0]?.content.subtitle.length > 66 && ".."}
      </p>
      <div className="flex">
        <span className="mr-2">{formatPrice(product.offerPrice, true)}</span>
        {product.offerPrice < product.price && (
          <del className="opacity-75 text-gray-600">{formatPrice(product.price, true)}</del>
        )}
      </div>
    </div>
  </Link>
);

export default PersonalisedProduct;
