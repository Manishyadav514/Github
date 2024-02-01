import React, { useEffect, useRef, useState } from "react";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import MiniPDPHeader from "@libComponents/MiniPDP/MiniPDPHeader";
import MiniPDPShadeSelection from "@libComponents/MiniPDP/MiniPDPShadeSelection";

import useTranslation from "@libHooks/useTranslation";

import { ADOBE } from "@libConstants/Analytics.constant";

import { GAaddToCart, GAPageView } from "@libUtils/analytics/gtm";

import { updateProducts } from "@checkoutLib/Cart/HelperFunc";
import { GAAddProduct, getAdobeProduct, GAUpsellMiniDPDLoad, upsellAddToBagClickEvent } from "@checkoutLib/Cart/Analytics";

import { MiniPDPProd } from "@typesLib/Cart";

import BagIconWhite from "../../../public/svg/carticon-white.svg";

import { addToBag } from "@libStore/actions/cartActions";
import { CONFIG_REDUCER, ADOBE_REDUCER, PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";

// @ts-ignore
import styles from "@libStyles/css/miniPDP.module.css";
import { formatPrice } from "@libUtils/format/formatPrice";
import Router from "next/router";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { setSessionStorageValue } from "@libUtils/sessionStorage";

interface UpsellMiniV2props {
  show: boolean;
  hide: () => void;
  miniPDPProduct: MiniPDPProd;
  upsellTitle: string;
  isUpsellOnPayment?: boolean;
  upsellHeading: string;
}
const UpsellMiniPDPV2 = ({ show, miniPDPProduct, hide, upsellTitle, isUpsellOnPayment, upsellHeading }: UpsellMiniV2props) => {
  const { t } = useTranslation();

  const loadAdobeOnceRef = useRef(true);

  const [loader, setLoader] = useState(false);
  const [activeProduct, setActiveProduct] = useState<any>();
  const [relationalData, setRelationalData] = useState<any>();

  const handleAddToBag = () => {
    const { category } = GAUpsellMiniDPDLoad(activeProduct, relationalData);
    if (activeProduct) {
      /* Creating payload to for AddToBag Call */

      const product = {
        ...activeProduct,
        type: activeProduct.type,
        id: activeProduct.id,
        cartType: activeProduct.productMeta.isPreOrder ? 3 : 1,
        offerID: miniPDPProduct.offerID,
        variantValue: miniPDPProduct.variantValue,
        childProductIds: miniPDPProduct.childProductIds,
        upsellKey: miniPDPProduct.upsellKey,
      };

      setLoader(true);
      updateProducts(product, 1).then((res: any) => {
        if (res) {
          upsellAddToBagClickEvent(
            activeProduct,
            upsellTitle,
            isUpsellOnPayment ? "cartupsellPayment" : miniPDPProduct.upsellKey
          );

          GAaddToCart(GAAddProduct(activeProduct, category, false, upsellHeading));
          addToBag(res);
          hide();
        }
        setLoader(false);
        if (Router.pathname === "/payment") PAYMENT_REDUCER.hasUserAddedProductFromUpsellPayment = true;
      });
    }
  };

  /* Adobe Modal Load Event - Mini PDP */
  useEffect(() => {
    if (show && activeProduct && loadAdobeOnceRef.current) {
      loadAdobeOnceRef.current = false;

      /** GA Pageview Event */
      const { GAPageViewObject, category, subCategory } = GAUpsellMiniDPDLoad(activeProduct, relationalData);

      GAPageView("/", GAPageViewObject, "product");
      const miniPDPLoad = {
        common: {
          pageName: `web|${activeProduct.productTag}|minipdp`,
          newPageName: "mini pdp",
          subSection: `${category} - ${subCategory}`,
          assetType: "product",
          newAssetType: "product",
          platform: ADOBE.PLATFORM,
          pageLocation: "",
          technology: ADOBE.TECHNOLOGY,
          source: SOURCE_STATE.pdpSource || "other",
          upsellProductPosition: (window as any).evars.evar156,
        },
        product: getAdobeProduct([activeProduct]),
        widgetName: "upsell",
        dsRecommendationWidget: {
          title: Router.pathname === "/payment" ? "cartupsellPayment" : "upsell",
        },
      };
      ADOBE_REDUCER.adobePageLoadData = JSON.parse(JSON.stringify(miniPDPLoad));
    }

    /* ActiveProduct Changes on evershade selection that's why using ref to load view event once */
    if (!show) {
      loadAdobeOnceRef.current = true;
      setActiveProduct(undefined);
    }
  }, [show, activeProduct]);

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section className={styles.ModalContainer}>
        <MiniPDPHeader title={t("FBMiniPDPHeader")} />

        <MiniPDPShadeSelection
          productId={miniPDPProduct.id}
          isFree={false}
          productTag={miniPDPProduct.productTag}
          setActiveProd={product => setActiveProduct(product)}
          setRelationalData={RData => setRelationalData(RData)}
          discountAmount={formatPrice(activeProduct?.price - miniPDPProduct.mainComboProdOfferPrice) as number}
          upsellDSPrice={formatPrice(miniPDPProduct.mainComboProdOfferPrice) as number}
          activeProduct={activeProduct}
        />
      </section>
      {activeProduct && (
        <div className={styles.ButtonContianer}>
          <button
            type="button"
            disabled={loader}
            onClick={handleAddToBag}
            className="flex justify-center items-center bg-ctaImg capitalize text-sm text-white font-semibold w-full py-4 rounded-sm outline-none relative"
          >
            {t("addToBag")}
            <BagIconWhite className="ml-2" role="img" aria-labelledby="add to cart" />
            {loader && <LoadSpinner className="absolute inset-0 m-auto w-8" />}
          </button>
        </div>
      )}
    </PopupModal>
  );
};

export default UpsellMiniPDPV2;
