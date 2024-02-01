import React, { useState } from "react";

import Adobe from "@libUtils/analytics/adobe";

import { ADOBE } from "@libConstants/Analytics.constant";
import PDPShadeGrid from "@libComponents/PDP/PDPShadeGrid";

import PopupModal from "../PopupModal/PopupModal";
import { formatPrice } from "@libUtils/format/formatPrice";

const ProductShadeModal = ({ show, onRequestClose, currentProduct, shades, handleShadeProduct, orderId, t }: any) => {
  const [shadeChangedProduct, setShadeChangedProduct] = useState<any>();
  const getShadeChangedProduct = (product: any) => {
    const prod = {
      quantity: currentProduct.quantity,
      type: currentProduct.type,
      isFree: currentProduct.isFree,
      isPreProductFree: currentProduct.isPreProductFree,
      isProductFree: currentProduct.isProductFree,
      parentId: currentProduct.parentId,
      replaceProductType: currentProduct.replaceProductType,
    };
    setShadeChangedProduct({ ...product, ...prod });
  };

  const handleReturnShadeProduct = () => {
    const productSKU =
      shadeChangedProduct && currentProduct.productId !== shadeChangedProduct.id ? shadeChangedProduct.sku : "";
    handleShadeProduct(currentProduct.productId, shadeChangedProduct || currentProduct, orderId, productSKU);
    onRequestClose();
    setShadeChangedProduct(undefined);

    selectExchangeShadeProductAdobeClick(currentProduct);
  };

  // Adobe Analytics(122) - Add trigger when user clicks Replace  on My Order Page : Replace Shade
  const selectExchangeShadeProductAdobeClick = (productSelected: any) => {
    (window as any).digitalData = {
      common: {
        assetType: "my order",
        ctaName: "replace select shade",
        linkName: "web|hamburger|account|my account|my orders",
        linkPageName: "web|hamburger|account|my account|my orders",
        newAssetType: "my account",
        newLinkPageName: "my order",
        pageLocation: "",
        platform: ADOBE.PLATFORM,
        subSection: "my order",
      },
      product: [
        {
          PWP: "",
          hasTryOn: "no",
          isPreOrder: "no",
          productDiscountedPrice: formatPrice(productSelected.unitPrice - productSelected.offerPrice),
          productOfferPrice: formatPrice(productSelected.offerPrice),
          productPrice: formatPrice(productSelected.unitPrice),
          productQuantity: 1,
          productRating: 0,
          productSKU: productSelected.sku,
          productTotalRating: 0,
          stockStatus: "in stock",
        },
      ],
      user: window.digitalData.user || {},
    };
    Adobe.Click();
  };

  return (
    <PopupModal show={show} onRequestClose={onRequestClose}>
      <div className="rounded-xl bg-white pt-8">
        <div className="pb-5 px-3 border-b border-gray-200">
          <h4
            style={{
              backgroundSize: "100% 75%",
              backgroundImage: "linear-gradient(transparent 74%, #f3caca 0px)",
            }}
            className="font-semibold inline px-0.5 bg-no-repeat text-18"
          >
            {t("exchangeTitleStep2")}
          </h4>
        </div>

        <PDPShadeGrid
          shades={shades}
          shadeLabel={currentProduct?.shadeLabel}
          currentProductId={currentProduct?.productId}
          setActiveShade={(shade: any) => getShadeChangedProduct(shade)}
          isMiniShadeSelection
        />
      </div>
      <div className="flex items center bg-white z-40 pb-2" style={{ boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.19)" }}>
        <div
          aria-hidden="true"
          onClick={onRequestClose}
          className="w-1/2 flex items-center justify-center text-sm ml-2 mt-2 opacity-50 font-semibold"
        >
          {t("noThanks")}
        </div>
        <div
          aria-hidden="true"
          className="w-1/2 text-center flex items-center justify-center bg-ctaImg content-center mr-2 text-white text-sm font-semibold rounded mt-2 h-10"
          onClick={handleReturnShadeProduct}
        >
          {t("exchangeCtaStep2Positive")}
        </div>
      </div>
    </PopupModal>
  );
};

export default ProductShadeModal;
