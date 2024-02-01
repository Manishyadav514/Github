import React, { useState, ReactElement } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { isClient } from "@libUtils/isClient";

import { useSelector } from "@libHooks/useValtioSelector";

import TryonLayout from "@libLayouts/TryonLayout";

import { PDPPage } from "@typesLib/PDP";

import { ValtioStore } from "@typesLib/ValtioStore";
import { getPDPIntialProps } from "@productLib/pdp/HelperFunc";
import {
  adobeUploadImageonTryon,
  adobeTryonDownloadClick,
  adobeTryonSplitViewClick,
  adobeTryonPageLoad,
  adobeOnTryonError,
  adobeTriggerOnShadeChange,
} from "@productLib/pdp/PDPTryonAnalytics";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import PDPATCBottom from "@libComponents/PDP/PDPATCBottom";
import PDPOutOfStockBottom from "@libComponents/PDP/PDPOutOfStockBottom";
import PDPShadeGrid from "@libComponents/PDP/PDPShadeHorizontal-pdpwidget";

import { setTryonActiveState, setTryonLocalImage } from "@libStore/actions/tryonActions";

import CompareIcon from "../../../../../public/svg/compare.svg";
import DownloadIcon from "../../../../../public/svg/Download.svg";

const ErrorComponent = dynamic(() => import("../../../_error"), { ssr: true });

function Tryon({ PDPProduct, PDPWidgets, errorCode }: PDPPage) {
  const { page: pageLocation } = useRouter().query;

  const [isTryonLoaded, setIsTryonLoaded] = useState(false);
  const [isTryonCompareEnabled, setIsTryonCompareEnabled] = useState(false);

  const [heightValues, setHeightValues] = useState({
    bottomCTA: 0,
    header: 0,
    ymk: 0,
    shades: 0,
  });

  const isProductsOOS =
    !PDPProduct.inStock && PDPProduct.shades.every((shade: any) => !shade.inStock && !shade?.productMeta?.isPreOrder);

  const { selectedImage, tryonActiveState } = useSelector((store: ValtioStore) => ({
    selectedImage: store.tryonReducer.selectedImage,
    tryonActiveState: store.tryonReducer.tryonActiveState,
  }));

  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }

  // if (!product) {
  //   return null;
  // }

  const { cms, urlManager, categories } = PDPProduct;
  // const categoryDetails = getCategoryDetails(categories, relationalData);

  // const freeProductListIds = discountDetails?.[product.id]?.discountValue?.freeProducts?.ids;

  const applyMakeupBySku = (itemGuidOrSkuId: any) => {
    if ((window as any)?.YMK?.isLoaded()) {
      (window as any)?.YMK?.applyMakeupBySku(
        itemGuidOrSkuId,
        () => {},
        () => {}
      );
    }
  };

  function downloadBlob(blob: any) {
    const productTag = PDPProduct?.productTag;
    const extension = blob?.type?.slice(6, blob?.type?.length);
    const filename = `${productTag}.${extension}`;
    const binaryData = [];
    binaryData.push(blob);
    const blobUrl = window.URL.createObjectURL(new Blob(binaryData, { type: blob.type }));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );
    document.body.removeChild(link);
  }

  const getTryonHeight = () => {
    const headerElem: any = document?.querySelector("header");
    const bottomPriceCTAElem: any = document?.querySelector("#price_wrapper");
    const shadesElem: any = document?.querySelector("#shades");

    const headerRect = headerElem?.getBoundingClientRect();
    const ctaReact = bottomPriceCTAElem?.getBoundingClientRect();
    const shadesRect = shadesElem?.getBoundingClientRect();

    const ymkHeight = window?.innerHeight - headerRect?.height - ctaReact?.height - shadesRect?.height;

    return {
      header: headerRect?.height,
      bottomCTA: ctaReact?.height,
      ymk: ymkHeight,
      shades: shadesRect?.height,
    };
  };

  const onTryonOpened = () => {
    if (!isTryonLoaded) {
      setIsTryonLoaded(true);
    }
  };

  const onTryonLoaded = () => {
    applyMakeupBySku(PDPProduct.sku);
  };

  const onTryonClose = () => {
    if (isTryonLoaded) {
      setIsTryonLoaded(false);
    }
  };

  const onTryonCompare = () => {
    setIsTryonCompareEnabled(prevState => !prevState);
  };

  const onNoFaceDetected = () => {
    setTimeout(() => {
      setTryonLocalImage("");
      setTryonActiveState("camera");
    }, 1000);
  };
  const onUnsupportedResolution = () => {
    adobeOnTryonError(categories?.childCategoryName, categories?.subChildCategoryName, pageLocation as string);
  };

  const registerEvents = () => {
    (window as any)?.YMK?.addEventListener("opened", onTryonOpened); // This event is fired when the YMK module showed.
    (window as any)?.YMK?.addEventListener("loaded", onTryonLoaded); // This event is fired when a given photo loaded or a live stream loaded on canvas.
    (window as any)?.YMK?.addEventListener("closed", onTryonClose);
    (window as any)?.YMK?.addEventListener("compare", onTryonCompare);
    (window as any)?.YMK?.addEventListener("compareDisabled", onTryonCompare);
    (window as any)?.YMK?.addEventListener("noFaceDetected", onNoFaceDetected);
    (window as any)?.YMK?.addEventListener("unsupportedResolution", onUnsupportedResolution);
  };

  const unregisterEvents = () => {
    (window as any)?.YMK?.removeEventListener("opened", onTryonOpened);
    (window as any)?.YMK?.removeEventListener("loaded", onTryonLoaded);
    (window as any)?.YMK?.removeEventListener("closed", onTryonClose);
    (window as any)?.YMK?.removeEventListener("compare", onTryonCompare);
    (window as any)?.YMK?.removeEventListener("compareDisabled", onTryonCompare);
    (window as any)?.YMK?.removeEventListener("noFaceDetected", onNoFaceDetected);
    (window as any)?.YMK?.removeEventListener("unsupportedResolution", onUnsupportedResolution);
  };

  const openView = (mode: string) => {
    setIsTryonLoaded(false);
    const { header, bottomCTA, ymk, shades } = getTryonHeight();
    setHeightValues({
      header,
      bottomCTA,
      ymk,
      shades,
    });
    (window as any)?.YMK?.init({
      skinSmoothStrength: 50,
      showCompareCaption: true,
      hideButtonsOnResultPage: true,
      height: ymk,
    });
    if (mode === "camera") {
      (window as any)?.YMK?.open(true);
    } else if (mode === "image") {
      (window as any)?.YMK?.open(false, selectedImage);
      adobeUploadImageonTryon(pageLocation as string);
    }
  };

  const LoadPerfectScript = (d: any, perfectCorpKey: any) => {
    const perfectCorpSrc = `https://plugins-media.makeupar.com/c42901/sdk.js?apiKey=${perfectCorpKey}`;
    const isScriptLoaded = Boolean(document.querySelector('script[src="' + perfectCorpSrc + '"]'));
    if (!(window as any)?.YMK?.isLoaded() && !isScriptLoaded) {
      var s = d.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = perfectCorpSrc;
      var x = d.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(s, x);
      (window as any).ymkAsyncInit = function () {
        openView("camera");
        registerEvents();
      };
    } else {
      openView("camera");
      registerEvents();
    }
  };

  React.useEffect(() => {
    if (tryonActiveState === "image" && selectedImage) {
      openView("image");
    } else if (tryonActiveState === "camera") {
      openView("camera");
    }
  }, [selectedImage, tryonActiveState]);

  React.useEffect(() => {
    if (isClient()) {
      LoadPerfectScript(document, GBC_ENV.NEXT_PUBLIC_TRYON_KEY);
    }

    adobeTryonPageLoad(categories?.childCategoryName, categories?.subChildCategoryName, pageLocation as string);
    return () => {
      unregisterEvents();
      setTryonActiveState("");
      setTryonLocalImage(undefined);
      (window as any)?.YMK?.close();
      (window as any)?.YMK?.closeEngine();
    };
  }, []);

  return (
    <>
      <main className="PDPPage relative">
        <div>
          <div
            id="YMK-module"
            className="w-screen flex flex-col justify-center items-center top-0 left-0 fixed bg-black mt-12"
          ></div>
          {isTryonLoaded ? (
            <div
              className="mb-3 flex justify-between fixed left-4 right-4"
              style={{ bottom: `${heightValues.bottomCTA + heightValues.shades}px` }}
            >
              <DownloadIcon
                role="img"
                onClick={() => {
                  adobeTryonDownloadClick(pageLocation as string);
                  const contentType = ["base64"];
                  (window as any)?.YMK?.snapshot(contentType, (param1: any) => {
                    downloadBlob(param1);
                  });
                }}
              />
              <CompareIcon
                role="img"
                onClick={() => {
                  if (isTryonCompareEnabled) {
                    (window as any)?.YMK?.disableCompare();
                  } else {
                    (window as any)?.YMK?.enableCompare();
                    adobeTryonSplitViewClick(pageLocation as string);
                  }
                }}
              />
            </div>
          ) : null}
        </div>

        <div className="fixed w-full " style={{ bottom: `${heightValues.bottomCTA}px` }} id="shades">
          <PDPShadeGrid
            isTryon
            product={PDPProduct}
            notifyOnShadeClick={(shade: any) => {
              adobeTriggerOnShadeChange(pageLocation as string);
              applyMakeupBySku(shade.sku);
            }}
          />
        </div>
        <div id="price_wrapper" className="fixed bottom-0 w-full">
          {isProductsOOS ? (
            <PDPOutOfStockBottom product={PDPProduct} />
          ) : (
            <PDPATCBottom
              product={PDPProduct}
              flashSaleWidgetData={PDPWidgets.flashSale}
              showPrice
              isTryon
              showWishlist={false}
            />
          )}
        </div>
      </main>
    </>
  );
}

Tryon.getLayout = (children: ReactElement) => <TryonLayout>{children}</TryonLayout>;

Tryon.getInitialProps = getPDPIntialProps;

export default Tryon;
