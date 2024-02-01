import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useAddtoBag from "@libHooks/useAddToBag";
import useTranslation from "@libHooks/useTranslation";
import useAppRedirection from "@libHooks/useAppRedirection";

import { isWebview } from "@libUtils/isWebview";
import { adobeTriggerNotifyMe } from "@libAnalytics/AddToBag.Analytics";

const NotifyModal = dynamic(() => import(/* webpackChunkName: "NotifyModal" */ "@libComponents/PopupModal/NotifyModal"), {
  ssr: false,
});

export interface ButtonProps {
  product: any;
  name?: string;
  category?: string;
  relationalData?: any;
  callMiniPDP?: any;
  showMiniPDP?: boolean;
  instoryProduct?: boolean;
}

const AddToBagButton = ({ product, name, category, relationalData, callMiniPDP, showMiniPDP, instoryProduct }: ButtonProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { redirect } = useAppRedirection();

  const { isPreOrder } = product.productMeta || {};

  const adobePage = router.asPath.includes("/glammstudio/") ? "blog" : "looks";

  const [CTA, setCTA] = useState<string>();
  const [showNotifyModal, setNotifyModal] = useState(false);

  const { addProductToCart } = useAddtoBag(relationalData, { name, category });

  useEffect(() => {
    if (!CTA) {
      setCTA(isPreOrder ? t("preOrderNow") : t("addToBag"));
    }
  }, [t]);

  const addToBag = () => {
    /* Webview - Redirection */
    if (isWebview()) {
      redirect(`${product?.urlManager?.url}?clickAction=add-to-bag&showMiniPdp=true`, true);
    } else if (showMiniPDP) {
      callMiniPDP(product);
    } else if (CTA === t("goToBag")) {
      router.push("/shopping-bag");
    } else {
      addProductToCart(product, isPreOrder ? 3 : 1).then(res => {
        if (res) {
          setCTA(t("goToBag"));
        }
      });
    }
  };

  if (product.inStock) {
    return (
      <button
        type="button"
        className={`font-bold inline-block border border-black ${
          instoryProduct ? "w-full py-2 bg-ctaImg mb-2 text-white opacity-80" : "px-8 py-1 rounded"
        }`}
        onClick={addToBag}
      >
        {CTA}
      </button>
    );
  }
  /**
   * Out of Stock - Product
   */
  return (
    <div className="w-full flex flex-col justify-center">
      <div
        aria-hidden
        onClick={() => {
          setNotifyModal(true);
          adobeTriggerNotifyMe(name as string, category as string);
        }}
        className={`font-bold inline-block border mx-auto text-center border-black
        ${instoryProduct ? "w-full py-2 bg-ctaImg text-white opacity-80 mb-2" : "px-8 py-1 rounded"}`}
      >
        {t("notifyMe")}
      </div>

      {/* Notify Modal */}
      <NotifyModal show={showNotifyModal} productId={product.id} onRequestClose={() => setNotifyModal(false)} />
    </div>
  );
};

export default AddToBagButton;
