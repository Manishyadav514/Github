import React, { useEffect, useRef, useState } from "react";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import MiniPDPHeader from "@libComponents/MiniPDP/MiniPDPHeader";
import MiniPDPShadeSelection from "@libComponents/MiniPDP/MiniPDPShadeSelection";

import useTranslation from "@libHooks/useTranslation";

import { addToBag } from "@libStore/actions/cartActions";

import { ADOBE } from "@libConstants/Analytics.constant";

import { GAaddToCart, GAPageView } from "@libUtils/analytics/gtm";

import { updateProducts } from "@checkoutLib/Cart/HelperFunc";
import { GAAddProduct, getAdobeProduct, GAUpsellMiniDPDLoad, upsellAddToBagClickEvent } from "@checkoutLib/Cart/Analytics";

import { MiniPDPProd } from "@typesLib/Cart";

import BagIconWhite from "../../../public/svg/carticon-white.svg";

// @ts-ignore
import styles from "@libStyles/css/miniPDP.module.css";
import { formatPrice } from "@libUtils/format/formatPrice";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

interface UpsellMiniprops {
  show: boolean;
  hide: () => void;
  comboProduct: MiniPDPProd;
  upsellTitle: string;
}
const UpsellMiniPDP = ({ show, comboProduct, hide, upsellTitle }: UpsellMiniprops) => {
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
        type: 2,
        id: comboProduct.mainComboProductId,
        cartType: activeProduct.productMeta.isPreOrder ? 3 : 1,
        childProductIds: [comboProduct.childProductIds, activeProduct.id],
      };

      setLoader(true);
      updateProducts(product, 1).then((res: any) => {
        if (res) {
          upsellAddToBagClickEvent(activeProduct, upsellTitle);
          GAaddToCart(GAAddProduct(activeProduct, category));
          addToBag(res);
          hide();
        }
        setLoader(false);
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
        },
        product: getAdobeProduct([activeProduct]),
        widgetName: "upsell",
        dsRecommendationWidget: {
          title: "upsell",
        },
      };
      ADOBE_REDUCER.adobePageLoadData = miniPDPLoad;
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
          isFree={false}
          productTag={comboProduct.productTag}
          setActiveProd={product => setActiveProduct(product)}
          activeProduct={activeProduct}
          setRelationalData={RData => setRelationalData(RData)}
          discountAmount={formatPrice(activeProduct?.price - comboProduct.mainComboProdOfferPrice) as number}
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

export default UpsellMiniPDP;
