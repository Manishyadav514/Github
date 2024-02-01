import React from "react";
import Link from "next/link";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { formatPrice } from "@libUtils/format/formatPrice";

const PersonalisedTwinProduct = ({ product, icid, index }: any) => (
  <Link
    href={
      !icid
        ? `${product.urlManager.url}`
        : `${product.urlManager.url}?icid=${icid}_${product.cms[0].content.name.toLowerCase()}_${index + 1}`
    }
    className="flex mr-2 my-1 w-full"
    style={{
      width: "250px",
      height: "6.25rem",
      boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.12)",
      flex: "0 0 auto",
    }}
    aria-label={product.cms[0]?.content.name.substring(0, 35)}
  >
    <div className="w-1/3 p-2">
      <ImageComponent
        src={product.assets[0]?.imageUrl["400x400"]}
        alt={product.assets[0]?.properties?.imageAltTag || product.assets[0]?.name}
      />
    </div>
    <div className="w-2/3 p-4 font-semibold">
      <p className="text-xs mb-1 h-8">
        {product.cms[0]?.content.name.substring(0, 35)}
        {product.cms[0]?.content.name.length > 36 && ".."}
      </p>
      <p className="text-xxs opacity-50  h-4">
        {product.cms[0]?.content.subtitle.substring(0, 25)}
        {product.cms[0]?.content.subtitle.length > 26 && ".."}
      </p>
      <div className="flex">
        <span className="mr-1 text-xs">{formatPrice(product.offerPrice, true)}</span>
        {product.offerPrice < product.price && (
          <del className="opacity-75 text-gray-600 text-xxs" style={{ marginTop: "0.15rem" }}>
            {formatPrice(product.price, true)}
          </del>
        )}
      </div>
    </div>
  </Link>
);

export default PersonalisedTwinProduct;
