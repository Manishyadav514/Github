import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import useAddtoBag from "@libHooks/useAddToBag";
import useTranslation from "@libHooks/useTranslation";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import MiniPDPHeader from "@libComponents/MiniPDP/MiniPDPHeader";
import MiniPDPShadeSelection from "@libComponents/MiniPDP/MiniPDPShadeSelection";

// @ts-ignore
import { ButtonContianer, ModalContainer } from "@libStyles/css/miniPDP.module.css";

import PopupModal from "./PopupModal";

interface miniPDPPRops {
  productSlug: string;
  show: boolean;
  hide: () => void;
}

const SignupMiniPDPModal = ({ productSlug, show, hide }: miniPDPPRops) => {
  const router = useRouter();

  const { t } = useTranslation();
  const { addProductToCart } = useAddtoBag();

  const [loader, setLoader] = useState(false);
  const [activeProduct, setActiveProduct] = useState<any>();

  const claimFreeLipstick = () => {
    setLoader(true);

    addProductToCart(activeProduct, activeProduct.productMeta?.isPreOrder ? 3 : 1).then(() => {
      router.push("/shopping-bag?utm_content=login");
      setLoader(false);
    });
  };

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section className={ModalContainer}>
        <MiniPDPHeader title="Select Shade Before Payment" />
        <MiniPDPShadeSelection
          slug={productSlug}
          setActiveProd={activeProd => setActiveProduct(activeProd)}
          activeProduct={activeProduct}
        />
      </section>

      <div className={`flex justify-between bg-white px-3 py-4 relative ${ButtonContianer}`}>
        <Link
          href={activeProduct?.urlManager.url || "/"}
          onClick={hide}
          role="presentation"
          className="uppercase font-semibold w-1/2 opacity-25 text-center py-2 text-sm"
          aria-label={t("miniPDPMoreDetails") || `MORE DETAILS`}
        >
          {t("miniPDPMoreDetails") || `MORE DETAILS`}
        </Link>

        <button
          type="button"
          disabled={loader}
          onClick={claimFreeLipstick}
          className="uppercase text-white font-semibold w-1/2 relative bg-ctaImg rounded py-2 text-sm"
        >
          {loader && <LoadSpinner className="absolute w-10 inset-0 m-auto" />}
          {t("exchangeCtaStep2Positive")}
        </button>
      </div>
    </PopupModal>
  );
};

export default SignupMiniPDPModal;
