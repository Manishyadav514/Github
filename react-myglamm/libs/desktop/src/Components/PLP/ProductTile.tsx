import React, { useState } from "react";
import Link from "next/link";

import { PLPProduct } from "@typesLib/PLP";

import useTranslation from "@libHooks/useTranslation";

import { formatPrice } from "@libUtils/format/formatPrice";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

interface ProductTileProps {
  product: PLPProduct;
  prodRef?: ((node?: Element | null | undefined) => void) | null;
}

const ProductTile = ({ product, prodRef }: ProductTileProps) => {
  const { t } = useTranslation();

  const [hovering, setHovering] = useState(false);

  return (
    <Link
      ref={prodRef}
      href={product.URL}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="p-5 border border-gray-300 mb-2"
    >
      <ImageComponent
        src={product.imageURL}
        alt={product.imageAltTag || product.productName}
        className={`mb-6 mx-auto p-4 transition ease-in-out ${hovering ? "scale-110" : ""}`}
      />

      <p className="line-clamp-2 font-bold text-xl h-15 mb-1">{product.productName}</p>
      <p className="text-xl opacity-70 h-15 line-clamp-2 mb-1">{product.productSubtitle}</p>

      <div className="flex items-center w-full mb-8 h-7">
        {product.shades?.length > 1 && (
          <>
            <ImageComponent src="https://files.myglamm.com/site-images/original/plus-icon.png" alt="shades" />
            <p className="text-lg font-bold opacity-70 pl-2">
              {product?.shades?.length}&nbsp;{t("shade")}
            </p>
          </>
        )}
      </div>

      <div className="flex items-center font-bold text-2xl">
        <span>
          {product?.partnershipPayableAmount
            ? formatPrice(product?.partnershipPayableAmount, true)
            : formatPrice(product?.priceOffer, true)}
        </span>
        {product.priceOffer < product.priceMRP && (
          <del className="opacity-40 ml-1.5">{formatPrice(product.priceMRP, true)}</del>
        )}
      </div>
    </Link>
  );
};

export default ProductTile;
