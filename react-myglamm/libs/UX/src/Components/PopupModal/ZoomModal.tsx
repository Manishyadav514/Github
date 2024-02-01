import React, { useState, useEffect } from "react";

import { useSelector } from "@libHooks/useValtioSelector";

import Adobe from "@libUtils/analytics/adobe";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import PopupModal from "./PopupModal";

// @ts-ignore
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ZoomModal = ({ isOpen, onRequestClose, assets, title, category, subCategory, index }: any) => {
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  const [disablePan, setDisablePan] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      (window as any).digitalData = {
        common: {
          assetType: "product",
          newAssetType: "product",
          newPageName: "zoom page",
          pageLocation: "",
          pageName: `web|${category} - ${subCategory}|product description page|zoompage`,
          platform: ADOBE.PLATFORM,
          subSection: "product description page",
          technology: ADOBE.TECHNOLOGY,
        },
        user: Adobe.getUserDetails(profile),
      };
      Adobe.PageLoad();
    }
  }, [isOpen]);

  return (
    <PopupModal show={isOpen} onRequestClose={onRequestClose} type="center-modal">
      <div className="bg-white h-screen ZoomModal w-full">
        {/* Header */}
        <div className="flex w-full items-center p-4 pt-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="35px"
            height="35px"
            viewBox="0 -100 1000 1000"
            onClick={onRequestClose}
            role="img"
            aria-labelledby="close modal"
          >
            <path
              transform="scale(1,-1) translate(0, -650)"
              fill="#000"
              d="M434 35c13 0 24 3 33 11 9 8 14 17 14 27 0 8-3 15-10 22l-159 174 149 163c6 7 9 14 9 21 0 9-4 17-13 24-8 7-18 11-29 11-13 0-24-6-33-16l-134-148-134 146c-11 12-23 18-37 18-13 0-24-4-33-12-9-8-13-17-13-28 0-8 3-15 9-22l146-159-163-177c-6-6-8-12-8-19 0-10 4-18 13-25 9-8 19-11 31-11 12 0 22 5 31 15l147 162 148-161c9-11 22-16 36-16z"
            />
          </svg>
          <h1 className="font-bold text-sm">{title}</h1>
        </div>

        {/* Zoom Image */}
        {Array.isArray(assets) && (
          // @ts-ignore
          <GoodGlammSlider initSlide={index} dots={assets}>
            {assets.map((img: any) => (
              <div key={img?.id} className="flex justify-center p-1">
                {img?.type === "image" && (
                  <TransformWrapper
                    panning={{
                      disabled: disablePan,
                    }}
                    onPanningStart={(e: any) => {
                      if (e.state.scale <= 1) {
                        setDisablePan(true);
                      } else {
                        setDisablePan(false);
                      }
                    }}
                    doubleClick={{
                      step: 0.4,
                    }}
                  >
                    <TransformComponent>
                      <ImageComponent forceLoad src={img?.url} alt={img?.name} style={{ maxHeight: "400px" }} />
                    </TransformComponent>
                  </TransformWrapper>
                )}

                {img?.type === "video" && (
                  <iframe
                    height="300"
                    title="test"
                    id="pro-video"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay"
                    style={{ width: "95%", display: "flex", top: "20%" }}
                    src={`https://www.youtube.com/embed/${img?.properties?.videoId}?autoplay=1&mute=1&enablejsapi=1`}
                  />
                )}
              </div>
            ))}
          </GoodGlammSlider>
        )}
      </div>
    </PopupModal>
  );
};

export default ZoomModal;
