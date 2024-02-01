import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

import { getImage } from "@libUtils/homeUtils";
import { formatPrice } from "@libUtils/format/formatPrice";

import useTranslation from "@libHooks/useTranslation";

import { updateProducts } from "@checkoutLib/Cart/HelperFunc";

import { cartFreeProduct } from "@typesLib/Cart";

import { addToBag } from "@libStore/actions/cartActions";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { MODALS, SET_FREE_PRODUCT_MODAL } from "@libStore/valtio/MODALS.store";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { ADOBE } from "@libConstants/Analytics.constant";

import CartIcon from "../../../../UX/public/svg/carticon-white.svg";

const FreeProductModal = () => {
  const { t } = useTranslation();
  const { show, products, onSubmit } = useSnapshot(MODALS).FREE_PRODUCT_MODAL;

  const [loader, setLoader] = useState(false);
  const [activeProduct, setActiveProduct] = useState(products?.[0]);

  const hideModal = () => SET_FREE_PRODUCT_MODAL({ show: false });

  const onAddToBag = () => {
    setLoader(true);

    updateProducts(activeProduct as cartFreeProduct, 1).then(result => {
      if (typeof result === "boolean" || result) {
        if (result) addToBag(result);
        hideModal();
        onSubmit?.();
      }

      setLoader(false);
    });
  };

  useEffect(() => {
    if (show) {
      const firstProduct = products?.[0];
      setActiveProduct(firstProduct);

      /* Page view Event PWP GWP */
      if (firstProduct && firstProduct.cartType) {
        ADOBE_REDUCER.adobePageLoadData = {
          common: {
            pageName: `web|${products?.[0].productTag}|product description page|choose your gift`,
            newPageName: "free product selection",
            subSection: `${products?.[0].productTag}`,
            assetType: "product",
            newAssetType: "choose your gift",
            platform: ADOBE.PLATFORM,
            pageLocation: "",
            technology: ADOBE.TECHNOLOGY,
          },
          product: [
            {
              productSKU: firstProduct.sku,
              productQuantity: 1,
              productOfferPrice: 0,
              productPrice: formatPrice(firstProduct.price),
              productDiscountedPrice: 0,
              productRating: 0,
              productTotalRating: 0,
              stockStatus: firstProduct.inStock ? "in stock" : "out of stock",
              isPreOrder: firstProduct.productMeta.isPreOrder ? "yes" : "no",
              PWP: "",
              hasTryOn: "no",
            },
          ],
        };
      }
    }
  }, [show]);

  return (
    <PopupModal type="center-modal" show={show as boolean} onRequestClose={hideModal}>
      <section className="rounded p-8 bg-white shadow-lg flex justify-between relative">
        <button
          type="button"
          onClick={hideModal}
          style={{ boxShadow: "0 1px 0 #fff" }}
          className="text-4xl font-bold absolute right-4 top-2 opacity-20 text-black hover:opacity-50"
        >
          ×
        </button>

        <ImageComponent forceLoad src={getImage(activeProduct, "400x400")} alt={activeProduct?.cms?.[0]?.content?.name} />

        <div className="pl-8 pt-8" style={{ width: "600px" }}>
          <h2 className="uppercase text-2xl mt-5 mb-2.5">{t("selectFreeGift")}</h2>

          {(products?.length as number) > 1 && (
            <div className="flex flex-wrap">
              {products?.map(prod => (
                <button
                  type="button"
                  onClick={() => setActiveProduct(prod)}
                  className={`p-0.5 mr-4 border ${prod.id === activeProduct?.id ? "border-black" : "border-transparent"}`}
                >
                  <ImageComponent
                    width={49}
                    height={49}
                    src={prod.cms?.[0].attributes?.shadeImage}
                    alt={prod.cms?.[0].attributes?.shadeLabel}
                  />
                </button>
              ))}
            </div>
          )}

          <h3 className="my-6 font-bold text-gray-400">{activeProduct?.cms?.[0]?.content?.name}</h3>

          <p className="text-gray-400 font-bold">{t("price")}</p>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <del className="text-gray-400 text-22 mr-4">{formatPrice(activeProduct?.price as number, true)}</del>
              <span className="uppercase text-2xl">{t("free")}</span>
            </div>

            <button
              type="button"
              disabled={loader}
              onClick={onAddToBag}
              className="bg-ctaImg text-white flex justify-center items-center h-12 w-36 relative rounded-sm"
            >
              {loader && <LoadSpinner className="absolute inset-0 m-auto w-8" />}
              <CartIcon className="mr-1" />
              {t("addToBag")}
            </button>
          </div>
        </div>
      </section>
    </PopupModal>
  );
};

export default FreeProductModal;
