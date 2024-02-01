import React from "react";
import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";
import useComboProdShadeSelection from "@libHooks/useComboProdShadeSelection";

import { PDP_STATES } from "@libStore/valtio/PDP.store";

import { PDPNewChildProduct } from "@typesLib/PDP";
import { PDPProd, ProductData } from "@typesLib/PDP";

import { formatPrice } from "@libUtils/format/formatPrice";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

const PDPKitsShadeModal = dynamic(() => import("../Popupmodals/PDPKitsShadeModal"), { ssr: false });

const PDPKitsVariantSelector = ({ product }: { product: PDPProd }) => {
  const { t } = useTranslation();

  const setChildProducts = (data: ProductData[]) => (PDP_STATES.selectedChildProducts = data);

  const {
    selectedProdShades,
    showShadesModal,
    comboShades,
    enableComboV2,
    setShowShadesModal,
    handleSelectShade,
    changeProductShade,
  } = useComboProdShadeSelection(product, setChildProducts);

  if (comboShades?.length > 0) {
    return (
      <section>
        {comboShades.map((products, index: number) => {
          const productData = (enableComboV2 ? (products as PDPNewChildProduct)?.productDetails?.[0] : products) as ProductData;
          const prodName = productData?.cms?.[0]?.content?.name;
          const prodImg = productData?.assets?.find((x: any) => x.type === "image");

          if (productData?.sku === t("upSellSkipProductInCombo") || !productData) return null;

          return (
            <div
              key={`${product.sku}_${index}`}
              className="p-4 flex shadow rounded-lg justify-between hover:border-black border-transparent border-b-2 cursor-pointer items-center mb-2 w-full"
            >
              <div className="flex">
                <div className="pr-4">
                  <ImageComponent
                    alt={prodImg?.name}
                    style={{ width: "74px" }}
                    src={prodImg?.imageUrl?.["200x200"]}
                    className="mr-4"
                  />
                </div>
                <div className="">
                  <p className="font-semibold truncate">{productData?.productTag}</p>
                  <p className="text-gray-500 text-10">{productData?.cms?.[0].attributes?.shadeLabel || ""}</p>
                  <span className="font-semibold tracking-wide text-2xl">{formatPrice(productData?.price, true)}</span>
                </div>
              </div>

              {/* Product Shade Selection Button */}
              <div className="text-md text-gray-500 font-semibold">
                {productData.inStock === false && <p>OUT OF STOCK</p>}
                {(!enableComboV2 || (products as PDPNewChildProduct)?.productDetails?.length > 1) && (
                  <div className="border-2 border-color1 px-3 py-1 rounded">
                    <button
                      type="button"
                      onClick={() => handleSelectShade(productData, index)}
                      className="text-md text-color1 font-semibold  rounded"
                    >
                      {t("selectShade")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {typeof showShadesModal === "boolean" && (
          <PDPKitsShadeModal
            show={showShadesModal}
            shades={selectedProdShades}
            selectShade={changeProductShade}
            hide={() => setShowShadesModal(false)}
          />
        )}
      </section>
    );
  }

  return null;
};

export default PDPKitsVariantSelector;
