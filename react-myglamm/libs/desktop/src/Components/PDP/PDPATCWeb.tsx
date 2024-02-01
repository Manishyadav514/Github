import React, { Fragment, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSnapshot } from "valtio";

import { PDPProd, ProductData } from "@typesLib/PDP";

import useAddtoBag from "@libHooks/useAddToBag";
import useTranslation from "@libHooks/useTranslation";

import { adobeTriggerNotifyMe } from "@libAnalytics/AddToBag.Analytics";

import { PDP_STATES } from "@libStore/valtio/PDP.store";
import { SET_FREE_PRODUCT_MODAL, SET_MINI_CART_MODAL, SET_NOTIFY_MODAL } from "@libStore/valtio/MODALS.store";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { getFreeProductPromise } from "@productLib/pdp/HelperFunc";

import PDPATCBottomWeb from "./PDPATCBottomWeb";

import CartIcon from "../../../../UX/public/svg/carticon-white.svg";

const PDPATCWeb = ({ product }: { product: PDPProd }) => {
  const { t } = useTranslation();
  const { inView, ref } = useInView();

  const { addProductToCart } = useAddtoBag();

  const { selectedChildProducts, PDPFreeProductData } = useSnapshot(PDP_STATES) || {};

  const { productMeta, inStock } = product;

  const [loader, setLoader] = useState(false);
  const [showFixedATC, setShowFixedATC] = useState(false);

  const freeProducts = PDPFreeProductData?.data?.data; // freeproduct data

  const CTA = productMeta.isPreOrder
    ? t("preOrder")
    : inStock || (selectedChildProducts?.length && selectedChildProducts?.every(x => x.inStock))
    ? t("addToBag")
    : t("notifyMe");

  const handleAddToBag = () => {
    setLoader(true);

    let type: number | undefined;
    if (productMeta.isPreOrder) type = 3;
    else if (inStock) type = 1;

    if (type) {
      addProductToCart(
        product,
        type,
        undefined,
        selectedChildProducts?.map(x => x.id) // incase bundle product selected
      ).then(result => {
        if (result) {
          if (freeProducts?.length) {
            SET_FREE_PRODUCT_MODAL({
              show: true,
              products: freeProducts as any[],
              onSubmit: () => SET_MINI_CART_MODAL({ show: true }),
            });
          } else {
            SET_MINI_CART_MODAL({ show: true });
          }
        }
        setLoader(false);
      });
    } else {
      setLoader(false);
      SET_NOTIFY_MODAL({ show: true });

      adobeTriggerNotifyMe(product?.cms?.[0]?.content?.name.toLowerCase() || "", product.categories.childCategoryName);
    }
  };

  /* Hide Show Fixed bottom Based on on the Main ATC CTA */
  useEffect(() => {
    if (inView) setShowFixedATC(false);
    else setShowFixedATC(true);
  }, [inView]);

  /* CAll for PDP PWP if applicable */
  useEffect(() => {
    if (product.freeProducts) {
      getFreeProductPromise(product.freeProducts, 2, product.id);
    }
  }, [product.id]);

  /* Extracted Common CTA wiht logic */
  const ATCButton = (mainCTA = true) => (
    <div className="flex items-center">
      <button
        type="button"
        disabled={loader}
        onClick={handleAddToBag}
        ref={mainCTA ? ref : null}
        className={`bg-ctaImg text-white font-bold h-12 w-40 flex items-center justify-center relative rounded-sm ${
          mainCTA ? "mt-2.5 mb-4" : "ml-8"
        }`}
      >
        <CartIcon height={30} width={30} className="mr-2" /> {CTA}
        {loader && <LoadSpinner className="absolute inset-0 m-auto w-10" />}
      </button>

      {(freeProducts as ProductData[])?.length > 0 && (
        <span className="text-sm opacity-75 ml-6 font-bold tracking-wide">
          {t("freeGiftPurchase") || "FREE GIFT ON PURCHASE!"}
        </span>
      )}
    </div>
  );

  return (
    <Fragment>
      {ATCButton()}

      <PDPATCBottomWeb ATCButton={ATCButton} show={showFixedATC} product={product} />
    </Fragment>
  );
};

export default PDPATCWeb;
