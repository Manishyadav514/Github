import React, { useState } from "react";

import { ProductData } from "@typesLib/PDP";

import useAddtoBag from "@libHooks/useAddToBag";
import useTranslation from "@libHooks/useTranslation";
import useEffectAfterRender from "@libHooks/useEffectAfterRender";

import { getImage } from "@libUtils/homeUtils";
import { formatPrice } from "@libUtils/format/formatPrice";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { SET_MINI_CART_MODAL } from "@libStore/valtio/MODALS.store";

import CrossIcon from "../../../../UX/public/svg/ic-close.svg";
import DownArrow from "../../../../UX/public/svg/down-arrow.svg";
import CartIcon from "../../../../UX/public/svg/carticon-white.svg";

type looksProductData = ProductData & { quantity: number; isSelected: boolean };

const LooksProductsList = ({ products }: { products: looksProductData[] }) => {
  const { t } = useTranslation();

  const [loader, setLoader] = useState(false);
  const [looksProducts, setLooksProducts] = useState(patchOnLoad());

  function patchOnLoad() {
    return products.map(x => ({ ...x, quantity: 1, isSelected: x.inStock }));
  }

  useEffectAfterRender(() => {
    setLooksProducts(patchOnLoad);
  }, [products]);

  const handleCheckBox = (index: number) => {
    let temp = looksProducts;
    temp[index].isSelected = !temp[index].isSelected;

    setLooksProducts([...temp]);
  };

  const updateQuantity = (index: number, quantity: number) => {
    let temp = looksProducts;
    temp[index].quantity += quantity;

    setLooksProducts([...temp]);
  };

  const { addProductToCart } = useAddtoBag();

  const handleAddToBag = () => {
    setLoader(true);

    addProductToCart(
      looksProducts.filter(x => x.isSelected),
      1
    ).then(res => {
      if (res) SET_MINI_CART_MODAL({ show: true });
      setLoader(false);
    });
  };

  return (
    <section className="w-3/5 pl-12">
      <h1 className="uppercase text-2xl mb-9">{t("getThisLook") || "get this look"}</h1>

      {looksProducts.map((product, index) => {
        const { isSelected, inStock } = product;

        return (
          <div className="flex items-center justify-between mb-5" key={product.id}>
            <ImageComponent src={getImage(product, "200x200")} width={100} height={100} className="shrink-0" />

            <div className="text-18 grow pl-8">
              <p>{product?.cms?.[0]?.content?.name}</p>

              <div className={`flex py-2 relative ${inStock ? "items-center" : "flex-col"}`}>
                {inStock ? (
                  <div className="bg-themeGray rounded p-2 flex justify-between items-center h-16 mr-5">
                    <span className="w-14 text-center">{product.quantity}</span>
                    <div className="flex flex-col justify-between items-stretch h-full">
                      <button
                        type="button"
                        className="opacity-75"
                        onClick={() => updateQuantity(index, 1)}
                        disabled={product.quantity === 10 || !isSelected}
                      >
                        <DownArrow height={13} width={13} className="rotate-180" />
                      </button>
                      <button
                        type="button"
                        className="opacity-75"
                        disabled={(product.quantity || 1) < 2 || !isSelected}
                        onClick={() => updateQuantity(index, -1)}
                      >
                        <DownArrow width={13} height={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="uppercase mb-4 text-sm flex items-center">
                    <CrossIcon width={11} className="opacity-75 mb-0.5 mr-2" />
                    {t("outOfStock") || "out of stock"}
                  </p>
                )}

                <span>{formatPrice(product.offerPrice, true)}</span>

                <div className="absolute inset-y-0 my-auto right-4 flex items-center">
                  <button
                    disabled={!inStock}
                    onClick={() => handleCheckBox(index)}
                    style={
                      isSelected
                        ? {
                            background:
                              "url(https://files.myglamm.com/site-images/original/ico-chk-black.png) no-repeat center",
                          }
                        : {}
                    }
                    className={`rounded border border-gray-400 h-8 w-8 ${inStock ? "" : "bg-themeGray"}`}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={handleAddToBag}
        disabled={loader || !looksProducts.find(x => x.isSelected)}
        className="bg-ctaImg text-white flex justify-center items-center h-14 font-bold w-44 relative rounded-sm ml-8"
      >
        {loader && <LoadSpinner className="absolute inset-0 m-auto w-8" />}
        <CartIcon width={30} height={30} className="mr-2" />
        {t("addToBag")}
      </button>
    </section>
  );
};

export default LooksProductsList;
