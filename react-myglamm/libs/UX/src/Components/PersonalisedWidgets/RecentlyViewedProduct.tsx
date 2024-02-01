import React from "react";
import Link from "next/link";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { formatPrice } from "@libUtils/format/formatPrice";

const RecentlyViewedProduct = ({ product, icid, index }: any) => (
  <Link
    href={
      !icid
        ? `${product.urlManager.url}`
        : `${product.urlManager.url}?icid=${icid}_${product.cms[0].content.name.toLowerCase()}_${index + 1}`
    }
    className="mr-2 rounded-sm"
    style={{
      width: "132px",
      boxShadow: "0 0 4px 0 rgba(0,0,0,.12)",
      border: "1px solid #ffffff",
      flex: "0 0 auto",
    }}
    aria-label={product.cms[0]?.content.name.substring(0, 30)}
  >
    <ImageComponent
      className="p-2"
      src={product.assets[0]?.imageUrl["400x400"]}
      alt={product.assets[0]?.properties?.imageAltTag || product.assets[0]?.name}
    />
    <div className="font-semibold p-2">
      <p className="text-xs h-8">
        {product.cms[0]?.content.name.substring(0, 30)}
        {product.cms[0]?.content.name.length > 31 && ".."}
      </p>
      <p className="text-xxs opacity-50 mt-1 h-8">
        {product.cms[0]?.content.subtitle.substring(0, 40)}
        {product.cms[0]?.content.subtitle.length > 41 && ".."}
      </p>
      <div className="flex flex-wrap items-center">
        <span className="mr-1">{formatPrice(product.offerPrice, true)}</span>
        {product.offerPrice < product.price && (
          <del className="opacity-75 text-gray-600 text-xxs">{formatPrice(product.price, true)}</del>
        )}
      </div>
    </div>
  </Link>
);

export default RecentlyViewedProduct;
