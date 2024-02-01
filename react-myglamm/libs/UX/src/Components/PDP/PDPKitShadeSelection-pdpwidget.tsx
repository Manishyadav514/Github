import React, { useEffect } from "react";
import dynamic from "next/dynamic";

import ConfigText from "@libComponents/Common/ConfigText";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { formatPrice } from "@libUtils/format/formatPrice";

import { PDPProd, ProductData } from "@typesLib/PDP";

import useTranslation from "@libHooks/useTranslation";
import useComboProdShadeSelection from "@libHooks/useComboProdShadeSelection";
import { PDP_STATES } from "@libStore/valtio/PDP.store";
import { FEATURES } from "@libStore/valtio/FEATURES.store";

const KitsShadeModal = dynamic(
  () => import(/* webpackChunkName: "KitsShadeModal" */ "@libComponents/PopupModal/KitsShadeModal")
);

const PDPKitShadeSelectionV3 = dynamic(
  () => import(/* webpackChunkName: "PDPKitShadeSelectionV3" */ "./PDPKitShadeSelectionV3")
);

interface KitProps {
  product: PDPProd;
}

const PDPKitShadeSelection = ({ product }: KitProps) => {
  const { t } = useTranslation();
  const comboShadeVariant: any = FEATURES.comboShadeVariant;

  const setChildProducts = (data: ProductData[]) => (PDP_STATES.selectedChildProducts = data);

  const {
    selectedProdShades,
    showShadesModal,
    comboShades,
    comboShadesV3,
    enableComboV2,
    setShowShadesModal,
    handleSelectShade,
    changeProductShade,
    selectProductShade,
    setActiveKitProductIndex,
    activeKitProductIndex,
  } = useComboProdShadeSelection(product, setChildProducts);

  const typeCheckWithQuantity = product.type === 2 && comboShades?.length > 0;
  const allowShadeSelection = product.productMeta?.allowShadeSelection && typeCheckWithQuantity;

  if (!(enableComboV2 ? typeCheckWithQuantity : allowShadeSelection)) return null;

  if (enableComboV2 && comboShadeVariant) {
    return (
      <PDPKitShadeSelectionV3 comboShadesV3={comboShadesV3} comboShades={comboShades} selectProductShade={selectProductShade} />
    );
  }

  return (
    <div className="Kit-Shade-Selection my-2 bg-white">
      <p className="font-semibold uppercase text-sm px-4 pt-4 pb-2">
        <ConfigText configKey="custimizeKit" />
      </p>
      <p className="text-sm px-4 pb-5 text-gray-600">
        <ConfigText configKey="customizeKitDesc1" />
        <br />
        <ConfigText configKey="customizeKitDesc2" />
      </p>

      {/* Products List */}
      {comboShades.map((products: any, index: number) => {
        const product = enableComboV2 ? products?.productDetails?.[0] : products;
        const prodImg = product?.assets?.find((x: any) => x.type === "image") || {};
        if (product?.productTag?.toLowerCase().includes("shipping") || !product) {
          return <></>;
        }
        if (product?.sku === t("upSellSkipProductInCombo")) return <></>;
        return (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="w-full flex px-4 py-3 border-t border-gray-200 relative"
          >
            {/* Product Image */}
            <div className="pr-2 w-1/4">
              <ImageComponent alt={prodImg?.name} style={{ width: "74px" }} src={prodImg?.imageUrl?.["200x200"]} />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between w-3/4">
              <p className="text-xs font-semibold truncate">{product?.productTag}</p>
              <p className="text-gray-500 text-10">{product?.cms?.[0]?.attributes?.shadeLabel}</p>
              <span className="font-semibold tracking-wide">{formatPrice(product?.price, true)}</span>
            </div>

            {/* Product Shade Selection Button */}
            <div className="absolute right-4 top-0 bottom-0 my-auto flex items-center">
              {product.inStock === false && (
                <p className="uppercase font-semibold pr-2 text-red-400 text-xs">
                  <ConfigText configKey="outOfStock" />
                </p>
              )}
              {(!enableComboV2 || products?.productDetails?.length > 1) && (
                <button
                  type="button"
                  disabled={false}
                  style={{ outline: "none" }}
                  onClick={() => handleSelectShade(product, index)}
                  className="text-10 text-color1 p-1 font-semibold border border-color1 rounded h-6"
                >
                  <ConfigText configKey="selectShade" />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {showShadesModal && typeof showShadesModal === "boolean" && (
        <KitsShadeModal
          show={showShadesModal}
          shades={selectedProdShades}
          selectShade={changeProductShade}
          hide={() => setShowShadesModal(false)}
        />
      )}
    </div>
  );
};

export default PDPKitShadeSelection;
