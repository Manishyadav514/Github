import * as React from "react";

import Link from "next/link";
import Ripples from "@libUtils/Ripples";

import useTranslation from "@libHooks/useTranslation";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { formatPrice } from "@libUtils/format/formatPrice";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const decode = require("unescape");

const ProductGrid = ({
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
}: any) => {
  const { t } = useTranslation();

  const subTitle = decode(sub_title);

  return (
    <div className="px-2 border relative py-4 border-themeGray">
      <Ripples>
        <Link
          href={!icid ? `${product_slug}` : `${product_slug}?icid=${icid}_${title.toLowerCase()}_${productPosition}`}
          prefetch={false}
          aria-label={title?.substring(0, 50)}
        >
          <div className="flex justify-center" style={{ minWidth: "170px" }}>
            <ImageComponent src={image} alt={image_alt_tag} className="h-110px w-110px" forceLoad={forceload} />
          </div>
          <h2 className="font-semibold capitalize h-8 leading-tight mt-2 text-xs opacity-80">{title?.substring(0, 50)}</h2>
          <p className="capitalize h-8 text-11 mt-1 text-gray-600">{subTitle?.substring(0, 45)}</p>
          {/* Shades PlaceHolder */}
          <div className="h-5 items-center">
            {product_count === 1 ? (
              <div>
                <span className="font-bold items-center uppercase text-10 opacity-80 text-gray-600">{shadeLabel}</span>
              </div>
            ) : (
              product_count && (
                <div className="flex items-center">
                  <img
                    alt="more-shade"
                    src="https://files.myglamm.com/site-images/original/more-shade.png"
                    className="w-4 h-4"
                  />
                  <div className="ml-1.5">
                    <span className="font-bold items-center uppercase text-10 text-gray-600">
                      {product_count}&nbsp;{t("shades")}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
          {/* Price PlaceHolder */}
          {product_offer_price && product_offer_price < product_price ? (
            <div className="flex py-4">
              <span className="flex items-center text-base font-semibold mr-2">
                {formatPrice(product_offer_price, true, false)}
              </span>
              <del className="flex items-center text-sm font-light text-left text-gray-600 opacity-60">
                {formatPrice(product_price, true, false)}
              </del>
            </div>
          ) : (
            <div className="flex py-4">
              <span className="flex items-center text-base font-semibold">{formatPrice(product_price, true, false)}</span>
            </div>
          )}
          {/* FreeProduct Tag */}
          <div className="flex h-4">
            {isFreeProduct && (
              <>
                <div className="w-1/9">
                  <img alt="giftbox" className="w-4 h-4" src="https://files.myglamm.com/site-images/original/gwp.png" />
                </div>
                <div className="text-xs font-bold ml-2 text-red-500">{t("freeGiftPLP")}</div>
              </>
            )}
          </div>
        </Link>
      </Ripples>
    </div>
  );
};

export default ProductGrid;
