import React, { useEffect, useState } from "react";

import useTranslation from "@libHooks/useTranslation";

import MiniPDPHeader from "@libComponents/MiniPDP/MiniPDPHeader";
import MiniPDPShadeSelection from "@libComponents/MiniPDP/MiniPDPShadeSelection";

import PopupModal from "./PopupModal";
// @ts-ignore
import { ButtonContianer, ModalContainer } from "@libStyles/css/miniPDP.module.css";

interface FBMiniprops {
  show: boolean;
  hide: () => void;
  slugs: Array<string>;
  addToBag: (arg: Array<string>) => void;
  activeProduct: any;
}

const FrequentlyBoughMiniPDP = ({ show, hide, slugs, addToBag, activeProduct }: FBMiniprops) => {
  const { t } = useTranslation();

  const [activeState, setActiveState] = useState(0);
  const [activeProducts, setActiveProducts] = useState<Array<any>>([]);

  const setActiveProd = (product: any) => {
    const updateActiveProd = activeProducts;
    activeProducts.splice(activeState, 1, product);
    setActiveProducts([...updateActiveProd]);
  };

  useEffect(() => {
    if (show) {
      setActiveState(0);
    }
  }, [show]);

  const handleBtnOne = () => {
    if (activeState) {
      setActiveState(0);
    } else {
      hide();
    }
  };

  const handleBtnTwo = () => {
    if (activeState) {
      addToBag(activeProducts);
    } else {
      setActiveState(1);
    }
  };

  const stepIndicator = {
    background: activeState ? "var(--color1)" : "linear-gradient(to right, var(--color1) 50%, var(--color2) 50%)",
    height: "3px",
  } as React.CSSProperties;

  console.log({ activeProducts });

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section className={ModalContainer}>
        <MiniPDPHeader title={t("FBMiniPDPHeader")} />
        <span className="absolute right-3 top-6 font-semibold text-2xl opacity-25">{activeState + 1}/2</span>
        <div style={stepIndicator} className="w-full my-3" />

        <MiniPDPShadeSelection
          isFree={false}
          nin={activeProducts}
          slug={slugs[activeState]}
          setActiveProd={product => product && setActiveProd(product?.id)}
          activeProduct={activeProduct?.[activeState]}
        />
      </section>

      <div className={ButtonContianer}>
        <button type="button" onClick={handleBtnOne} className="w-1/2 capitalize bg-white text-gray-300 text-sm outline-none">
          {activeState ? t("back") : t("cancel")}
        </button>
        <button
          type="button"
          onClick={handleBtnTwo}
          className="bg-ctaImg capitalize text-sm text-white font-semibold w-1/2 py-2 outline-none"
        >
          {activeState ? t("exchangeCtaStep2Positive") : t("next")}
        </button>
      </div>
    </PopupModal>
  );
};

export default FrequentlyBoughMiniPDP;
