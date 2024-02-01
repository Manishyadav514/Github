import React, { useState } from "react";

import { cartProduct } from "@typesLib/Cart";
import { ValtioStore } from "@typesLib/ValtioStore";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { formatPrice } from "@libUtils/format/formatPrice";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { updateProducts } from "@checkoutLib/Cart/HelperFunc";

import { addToBag } from "@libStore/actions/cartActions";

import DownArrow from "../../../../UX/public/svg/down-arrow.svg";

const ShoppingBagProduct = () => {
  const { t } = useTranslation();

  const { allProducts } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const cartProducts = allProducts.filter(x => x.cartType !== 2); // Leaving PWP as they join below main product

  const [loader, setLoader] = useState(false);

  const updateProdInBag = (product: cartProduct, qty: number) => {
    setLoader(true);
    updateProducts(product, qty).then(result => {
      if (result) addToBag(result);
      setLoader(false);
    });
  };
  return (
    <section className="relative ">
      {cartProducts.map((product, index) => (
        <div
          key={product.productId}
          className={`pt-5 pb-2.5 px-8 ${cartProducts.length - 1 === index ? "" : "border-b border-gray-200"}`}
        >
          <div key={product.productId} className="flex justify-between items-center">
            <ImageComponent src={product.imageUrl} alt={product?.name} width={98} height={98} className="mx-4" />

            <p className="mb-1 uppercase w-1/3">{product?.name}</p>

            <span className="text-18 w-1/6 text-center">{formatPrice(product?.price, true)}</span>

            <div className="bg-themeGray rounded p-2 flex justify-between items-center h-16">
              <span className="w-14 text-center">{product?.quantity}</span>
              <div className="flex flex-col justify-between items-stretch h-full">
                <button
                  type="button"
                  className="opacity-75"
                  onClick={() => updateProdInBag(product, 1)}
                  disabled={product.quantity === product.productMeta.maxAllowedQuantityInCart}
                >
                  <DownArrow height={13} width={13} className="rotate-180" />
                </button>
                <button
                  type="button"
                  className="opacity-75"
                  disabled={product.quantity < 2}
                  onClick={() => updateProdInBag(product, -1)}
                >
                  <DownArrow width={13} height={13} />
                </button>
              </div>
            </div>

            <span className="text-18 w-1/6 text-center">{formatPrice(product.totalPrice, true)}</span>

            <button
              type="button"
              className="text-xl font-bold px-2 opacity-75"
              onClick={() => updateProdInBag(product, -product.quantity)}
            >
              &#10005;
            </button>
          </div>

          {product.freeProducts?.map(freeProduct => (
            <div key={freeProduct.productId} className="flex justify-between items-center pl-36">
              <ImageComponent src={freeProduct.imageUrl} alt={freeProduct?.name} width={98} height={98} className="mx-4" />

              <p className="mb-1 uppercase w-1/4 line-clamp-3">{freeProduct?.name}</p>

              <del className="text-18 w-1/6 text-center text-gray-400">{formatPrice(freeProduct.price, true)}</del>

              <div className="w-24" />

              <span className="text-18 w-1/6 text-center uppercase">{t("free")}</span>

              <button
                type="button"
                className="text-xl font-bold px-2 opacity-75"
                onClick={() => updateProdInBag(freeProduct, -freeProduct.quantity)}
              >
                &#10005;
              </button>
            </div>
          ))}
        </div>
      ))}

      {loader && (
        <div className="inset-0 z-20 m-auto fixed bg-[#00000063]">
          <LoadSpinner />
        </div>
      )}
    </section>
  );
};

export default ShoppingBagProduct;
