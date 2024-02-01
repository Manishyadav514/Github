import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { CBWidgetsProps } from "@typesLib/Widgets";

import { checkCBPopupLocally } from "@productLib/pdp/HelperFunc";

import PopupModal from "./PopupModal";

import CrossIcon from "../../../public/svg/crossIconBlack.svg";

const VideoContentModal = ({ show, hide, widget }: CBWidgetsProps) => {
  const videoRef = useRef(null);

  const [playVideo, setPlayVideo] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const { CTA, CTAUrl, videoSrc, imgSrc, backgroundColor } = JSON.parse(widget.meta.widgetMeta || "{}");

  const handlePlayBtn = () => {
    setPlayVideo(true);
    // as ref gets attached only when playvideo is true so need to wait for sometime
    setTimeout(() => (videoRef.current as unknown as HTMLVideoElement).play(), 0);
  };

  /* Hide Logic for Popup incase have seen already */
  useEffect(() => {
    setShowPopup(checkCBPopupLocally("videoBanner"));
  }, []);

  if (showPopup) {
    return (
      <PopupModal show={show} onRequestClose={hide} additionClass="w-full" type="center-modal">
        <section className="rounded-xl mx-4 relative">
          <button
            onClick={hide}
            type="button"
            className="bg-white rounded-full w-max absolute -right-2 -top-2 aspect-square z-10"
          >
            <CrossIcon width={18} height={18} className="w-5" />
          </button>

          {playVideo ? (
            <video loop controls ref={videoRef} src={videoSrc} className="w-full aspect-video rounded-t-xl">
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : (
            <div className="relative" onClick={handlePlayBtn}>
              <img src={imgSrc} alt="Poster Image" className="w-full aspect-video rounded-t-xl" />
              <img
                alt="play icon"
                className="absolute inset-0 m-auto"
                src="https://files.myglamm.com/site-images/original/PlayCircle.png"
              />
            </div>
          )}

          <div style={{ background: backgroundColor }} className="text-center p-4 rounded-b-xl">
            <div dangerouslySetInnerHTML={{ __html: widget.commonDetails.description }} />

            {CTA && (
              <Link
                href={CTAUrl}
                className="uppercase bg-ctaImg rounded tracking-wide w-full h-10 font-bold text-white flex justify-center items-center mt-4"
              >
                {CTA}
              </Link>
            )}
          </div>
        </section>
      </PopupModal>
    );
  }

  return null;
};

export default VideoContentModal;
