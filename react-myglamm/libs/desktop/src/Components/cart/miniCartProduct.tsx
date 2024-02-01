import React, { Fragment, useState } from "react";

import { cartProduct } from "@typesLib/Cart";
import { ValtioStore } from "@typesLib/ValtioStore";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { formatPrice } from "@libUtils/format/formatPrice";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { addToBag } from "@libStore/actions/cartActions";

import { updateProducts } from "@checkoutLib/Cart/HelperFunc";

const MiniCartProduct = () => {
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
    <ul className="list-none p-5 w-full h-full overflow-auto">
      {loader && (
        <div className="h-full absolute inset-0 bg-[#00000063]">
          <LoadSpinner />
        </div>
      )}

      {cartProducts?.map(product => (
        <li key={product.productId} className="p-5 border border-gray-200 rounded-sm mb-6">
          <div className="flex justify-between">
            <ImageComponent src={product.imageUrl} alt={product.name} width={63} height={63} />

            <p className="mb-2.5 px-1 line-clamp-2 h-12">{product.name}</p>

            <button
              type="button"
              onClick={() => updateProdInBag(product, -product.quantity)}
              className="text-gray-300 text-xl h-min hover:text-black"
            >
              &#x2715;
            </button>
          </div>

          <div className="flex justify-between items-center pt-6 mb-2">
            <div className="flex items-center text-17">
              <span>{formatPrice(product.price, true)}</span>
              {product.totalPrice > product.price && (
                <del className="text-gray-400 ml-1.5">{formatPrice(product.totalPrice, true)}</del>
              )}
            </div>

            <div className="flex items-center">
              <span className="font-bold text-stone-400 uppercase mr-2">{t("qty")}</span>

              <div className="flex items-center">
                <button
                  type="button"
                  disabled={product.quantity === 1}
                  onClick={() => updateProdInBag(product, -1)}
                  className="rounded-full border border-black h-6 w-6 flex items-center justify-center text-lg pb-0.5"
                >
                  &#8722;
                </button>
                <span className="px-3">{product.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateProdInBag(product, +1)}
                  disabled={product.quantity === product.productMeta.maxAllowedQuantityInCart}
                  className="rounded-full border border-black h-6 w-6 flex items-center justify-center text-lg pb-0.5"
                >
                  &#43;
                </button>
              </div>
            </div>
          </div>

          {product.freeProducts?.map(prod => (
            <Fragment>
              <div className="w-full border-b border-gray-300 my-4" />

              <div className="flex justify-between">
                <ImageComponent src={prod.imageUrl} alt={prod.name} width={63} height={63} />

                <p className="mb-2.5 px-1 line-clamp-2 h-12">{prod.name}</p>

                <button
                  type="button"
                  onClick={() => updateProdInBag(prod, -prod.quantity)}
                  className="text-gray-300 text-xl h-min hover:text-black"
                >
                  &#x2715;
                </button>
              </div>

              <p className="uppercase pt-2">{t("free")}</p>
            </Fragment>
          ))}
        </li>
      ))}
    </ul>
  );
};

export default MiniCartProduct;
