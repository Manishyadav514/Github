import React from "react";
import Link from "next/link";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import useTranslation from "@libHooks/useTranslation";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { formatPrice } from "@libUtils/format/formatPrice";

function CartCarousel({ item, icid }: any) {
  const { t } = useTranslation();

  const { allProducts } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  if (allProducts?.length > 0) {
    return (
      <div className="CartCarousel my-5">
        <div className="MultipleLooks flex overflow-x-auto overflow-y-hidden py-5 bg-pink-50">
          <div className="flex items-center pl-5">
            <div>
              <h2
                className="text-22 font-semibold mb-2.5 pr-5 leading-snug underline"
                style={{ textDecorationColor: "#ff9797" }}
              >
                {item?.commonDetails?.title || t("shoppingBag")}
              </h2>
              <Link
                href="/shopping-bag"
                prefetch={false}
                className="bag-btn text-xs font-semibold text-white rounded p-2.5 bg-darkpink"
                aria-label={item?.commonDetails?.subTitle || t("goToBag")}
              >
                {item?.commonDetails?.subTitle || t("goToBag")}
              </Link>
            </div>
          </div>

          {allProducts.map((product, index: any) => (
            <Link
              href={!icid ? `/shopping-bag` : `/shopping-bag?icid=${icid}_${item.label.toLowerCase()}_${index + 1}`}
              prefetch={false}
              key={product.productId}
              aria-label={product.name}
            >
              <div className="bg-white rounded mr-2.5 px-2 py-2.5 w-[165px] h-48">
                <ImageComponent alt="product sample" src={product.imageUrl} className="mx-auto mb-2.5 w-24" />
                <h2 className="text-xs font-semibold mb-2.5 truncate">{product.name}</h2>
                <div className="flex items-center mt-2.5">
                  {product.totalPrice > product.price ? (
                    <React.Fragment>
                      <span className="font-semibold mr-1">{formatPrice(product.price, true)}</span>
                      <span className=" line-through opacity-50 mt-1 text-xs">{formatPrice(product.totalPrice, true)}</span>
                    </React.Fragment>
                  ) : (
                    <span className="font-semibold mr-1">
                      {product.cartType === 1 || product.cartType === 3 ? formatPrice(product.totalPrice, true) : t("free")}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default CartCarousel;
