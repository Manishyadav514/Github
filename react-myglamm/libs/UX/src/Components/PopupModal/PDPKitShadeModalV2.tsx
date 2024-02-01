import MiniPDPHeader from "@libComponents/MiniPDP/MiniPDPHeader";
import React, { useEffect, useState } from "react";
import PopupModal from "./PopupModal";
// @ts-ignore
import { ShadesContainer, ModalContainer } from "@libStyles/css/miniPDP.module.css";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import { getStaticUrl } from "@libUtils/getStaticUrl";
import VideoModal from "./VideoModal";
import PDPShadeGrid from "@libComponents/PDP/PDPShadeGrid";
import { onAdobeChangeShade } from "@productLib/pdp/AnalyticsHelper";
import { GLAMMCLUB_CONFIG } from "@libUtils/glammClubUtils";

const PDPKitShadeModalV2 = ({
  shades,
  showModal,
  setShowModal,
  changeProductShade,
  variant = "Shades",
  parentProduct,
  shadeObject,
  setSelectedShadeObject,
}: {
  shades: any;
  showModal: boolean;
  setShowModal: any;
  changeProductShade?: any;
  variant: string;
  parentProduct?: any;
  shadeObject?: boolean;
  setSelectedShadeObject?: any;
}) => {
  const [activeShade, setActiveShade] = useState(shades[0]);
  const [videoId, setVideoId] = useState<string>();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeShadeIndex, setActiveShadeIndex] = useState<number>(0);
  const glammClubConfig = GLAMMCLUB_CONFIG() || {};
  let activeImgs = activeShade?.assets.filter((x: any) => x.type === "image");
  const activeVideo = activeShade?.assets.find((x: any) => x.type === "video");

  if (activeVideo) {
    activeImgs = [...activeImgs, activeVideo];
  }

  const handleActiveShade = (product: any, index: number) => {
    onAdobeChangeShade(product);
    setActiveShade(product);
    setActiveShadeIndex(index);
  };

  useEffect(() => {
    if (showModal) {
      setActiveShade(shades[0]);
      onAdobeChangeShade(shades[0]);
    }
  }, [showModal]);

  const videoStyle = {
    backgroundPosition: " 0 -285px",
    backgroundImage: `url(${getStaticUrl("/global/images/ico-pdp-sprite.png")})`,
    backgroundRepeat: "no-repeat",
    height: "35px",
    width: "35px",
    top: "45%",
    marginLeft: "1rem",
  } as React.CSSProperties;
  return (
    <>
      <PopupModal show={showModal} type="bottom-modal" onRequestClose={() => setShowModal(false)}>
        <section className={ModalContainer}>
          <div className="w-full pb-2 border-b border-gray-200 mb-3">
            <MiniPDPHeader title={`Select ${variant} ${variant === "New Shade" ? "" : "Before Add to Bag"}`} />
          </div>
          <GoodGlammSlider dots="dots">
            {activeImgs?.map((img: any, index: number) => (
              <div
                key={img.id}
                role="presentation"
                className="flex justify-center relative"
                onClick={() => {
                  if (img.type === "video") {
                    setShowVideoModal(true);
                    setVideoId(img.properties?.videoId);
                  }
                }}
              >
                {activeShade?.productMeta?.isTrial && index === 0 && glammClubConfig?.PDPTrialIconV2 && (
                  <img
                    className="absolute m-auto left-2 top-2 z-30 w-16"
                    src={glammClubConfig?.PDPTrialIconV2}
                    alt="Glamm Club Trial Product"
                  />
                )}
                <ImageComponent
                  alt={img.name}
                  style={{ height: "200px" }}
                  src={img.imageUrl ? img.imageUrl["200x200"] : img.properties?.thumbnailUrl}
                />
                {img.type === "video" && <div style={videoStyle} className="absolute m-auto" />}
              </div>
            ))}
          </GoodGlammSlider>
          <p className="font-semibold  my-1 pl-1 mt-3">{activeShade?.cms[0].content.name}</p>
          <p className=" text-sm text-gray-700 pl-1 opacity-75">{activeShade?.cms[0].content.subtitle}</p>
          <div className="flex items-center mt-2.5">
            <p className=" text-sm text-gray-700 pl-1 opacity-75 pr-1">{variant}</p>
            <p className="text-sm font-bold"> {activeShade?.cms?.[0]?.attributes?.shadeLabel} </p>
          </div>
          <section className={ShadesContainer}>
            <div className="h-1.5 w-full bg-gradient-to-b from-white to-white/10 sticky top-0 z-20" />

            {/* Shade Listing */}
            {shades?.length > 1 && (
              <PDPShadeGrid
                shadeLabel={activeShade.cms[0]?.attributes?.shadeLabel}
                currentProductId={activeShade?.id}
                shades={shades}
                isMiniShadeSelection={true}
                setActiveShade={(activeShade: any, index: number) => handleActiveShade(activeShade, index)}
              />
            )}

            <div className="h-1.5 w-full bg-gradient-to-t from-white to-white/0 sticky bottom-0 z-20" />
          </section>
          <div className="flex justify-between bg-white p-2" style={{ height: "3.5rem" }}>
            <div className="flex flex-1 items-center content-center">
              <button
                type="button"
                className="flex rounded-sm uppercase items-center text-white text-sm font-semibold w-full h-full justify-center relative bg-ctaImg whitespace-nowrap"
                onClick={() => {
                  /* use case for edit order (change shade) where we need full shade object instead of index */
                  shadeObject ? setSelectedShadeObject(activeShade) : changeProductShade(activeShadeIndex);
                  setShowModal(false);
                }}
              >
                Select {variant?.toLowerCase().replace("shades", "shade")}
              </button>
            </div>
          </div>
        </section>
      </PopupModal>
      {videoId && <VideoModal videoId={videoId} isOpen={showVideoModal} onRequestClose={() => setShowVideoModal(false)} />}
    </>
  );
};

export default PDPKitShadeModalV2;
