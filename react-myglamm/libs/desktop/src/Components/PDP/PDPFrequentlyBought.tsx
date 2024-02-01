import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

import { PDPProd, ProductData } from "@typesLib/PDP";

import useAddtoBag from "@libHooks/useAddToBag";
import useTranslation from "@libHooks/useTranslation";

import { PDP_STATES } from "@libStore/valtio/PDP.store";
import { SET_MINI_CART_MODAL } from "@libStore/valtio/MODALS.store";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { getImage } from "@libUtils/homeUtils";
import { formatPrice } from "@libUtils/format/formatPrice";

import { getProductBoughtTogether } from "@productLib/pdp/HelperFunc";
import Link from "next/link";
import GoodGlammSlider from "../GoodGlammSlider";
import BagIcon from "../../../../UX/public/svg/carticon.svg";

const PDPFrequentlyBought = ({ product }: { product: PDPProd }) => {
  const { t } = useTranslation();

  const { data: fbtData, relationalData } = useSnapshot(PDP_STATES).frequentlyBoughtData || {};
  const { addProductToCart } = useAddtoBag();

  const [loadingProdId, setLoadingProdId] = useState("");

  const handleAddToBag = (product: ProductData) => {
    setLoadingProdId(product.id);

    let type = 1;
    if (product.productMeta.isPreOrder) type = 3;

    addProductToCart(product, type).then(result => {
      if (result) {
        console.log({ result });

        SET_MINI_CART_MODAL({ show: true });
      }

      setLoadingProdId("");
    });
  };

  useEffect(() => {
    getProductBoughtTogether(product);
  }, [product.id]);

  console.log({ fbtData });

  if (fbtData?.length > 0) {
    return (
      <section>
        <h2 className="text-3xl text-center pb-2 pt-8 uppercase">{t("frequentlyBought") || "FREQUENTLY BOUGHT TOGETHER"}</h2>

        <GoodGlammSlider slidesPerView={3}>
          {fbtData.map((bundleProduct: ProductData) => {
            const secondProductId = bundleProduct.products.find(x => x !== product.id);
            const secondProduct = relationalData?.products[secondProductId as string] as ProductData;

            return (
              <div className="p-8">
                <div className="px-2.5 rounded-md pt-12 pb-6" style={{ boxShadow: "0 0 8px 0 rgba(0,0,0,.28)" }}>
                  <ul className="list-none flex justify-center items-center mb-2 px-1">
                    <li className="pr-1">
                      <ImageComponent src={getImage(product, "200x200")} alt={product?.cms?.[0]?.content?.name} />
                    </li>
                    <span className="font-bold text-3xl">+</span>
                    <li className="pl-1 cursor-pointer">
                      <Link href={secondProduct?.urlManager?.url} passHref legacyBehavior>
                        <ImageComponent src={getImage(secondProduct, "200x200")} alt={secondProduct?.cms?.[0]?.content?.name} />
                      </Link>
                    </li>
                  </ul>

                  <p className="h-20 line-clamp-3 text-center px-1">{bundleProduct?.cms?.[0]?.content?.name}</p>

                  <div className="flex items-center justify-center pb-2 border-b border-gray-200 font-bold text-xl mb-2">
                    <span>{formatPrice(bundleProduct.offerPrice, true)}</span>
                    <del className="ml-2 text-gray-500">{formatPrice(bundleProduct.price, true)}</del>
                  </div>

                  <div className="text-sm flex justify-between">
                    <p className="h-11 line-clamp-2 py-1 w-3/4">{product.cms?.[0]?.content?.name}</p>
                    <strong className="pt-1">{formatPrice(product.price, true)}</strong>
                  </div>

                  <div className="text-sm flex justify-between mb-3">
                    <Link href={secondProduct?.urlManager?.url} passHref legacyBehavior>
                      <a className="h-11 line-clamp-2 py-1 w-3/4 cursor-pointer">{secondProduct.cms[0]?.content?.name}</a>
                    </Link>
                    <strong className="pt-1">{formatPrice(secondProduct.price, true)}</strong>
                  </div>

                  <button
                    type="button"
                    disabled={loadingProdId === bundleProduct.id}
                    onClick={() => handleAddToBag(bundleProduct)}
                    className="bg-white border border-black font-bold relative text-15 h-10 hover:bg-black hover:text-white rounded-sm w-36 mx-auto flex justify-center items-center"
                  >
                    <BagIcon height={20} width={20} className="mr-1" />
                    {bundleProduct.productMeta?.isPreOrder ? t("preOrderCheckout") : t("addToBag")}

                    {loadingProdId === bundleProduct.id && <LoadSpinner className="w-8 absolute inset-0 m-auto" />}
                  </button>
                </div>
              </div>
            );
          })}
        </GoodGlammSlider>
      </section>
    );
  }

  return null;
};

export default PDPFrequentlyBought;
