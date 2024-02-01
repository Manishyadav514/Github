import PopupModal from "@libComponents/PopupModal/PopupModal";
import { PDP_STATES } from "@libStore/valtio/PDP.store";
import { getClientQueryParam } from "@libUtils/_apputils";
import React, { useState } from "react";
import { useSnapshot } from "valtio";
import Close from "../../../../public/svg/ic-close.svg";

const PDPPopupVideoModal = () => {
  const { modalStates } = useSnapshot(PDP_STATES);
  const [loading, setLoading] = useState(true);

  const handleModalState = (value: boolean) => (PDP_STATES.modalStates.videoPopupModal = value);

  const videoID = getClientQueryParam("videoid");
  const videoSource = getClientQueryParam("videotype");

  //Condition to open popup is written in onPDPOnMOunt file pls check that to understand logic

  return (
    <PopupModal show={modalStates.videoPopupModal || false} onRequestClose={() => {}} type="center-modal">
      <div className="flex items-center bg-black" style={{ height: "100vh", width: "100vw" }}>
        <span
          className="absolute top-10 right-4 z-50 w-5 h-5 p-1 bg-white rounded-full flex items-center"
          onClick={() => {
            handleModalState(false);
          }}
        >
          <Close />
        </span>
        {videoSource === "yt" ? (
          <>
            <iframe
              title="videoId"
              frameBorder="0"
              allow="autoplay"
              allowFullScreen
              className={`${loading ? "hidden" : "block"} h-auto aspect-video`}
              style={{ width: "100vw" }}
              onLoad={() => setLoading(false)}
              onError={() => {
                handleModalState(false);
              }}
              src={`https://www.youtube.com/embed/${videoID}?autoplay=1&mute=1&enablejsapi=1`}
            />
          </>
        ) : videoSource === "ps" ? (
          <>
            <video
              muted
              src={`https://m.photoslurp.com/pslurpmedia.s3.amazonaws.com/manual/pk${videoID}_0.mp4`}
              id="popup-video-player"
              preload="metadata"
              className={`h-full w-full`}
              playsInline
              controls
              autoPlay={/iPad|iPhone|iPod/.test(navigator.userAgent) ? false : true}
              onError={() => {
                handleModalState(false);
              }}
            />
          </>
        ) : (
          <></>
        )}
        <div className={`${!loading ? "hidden" : "block"}`} style={{ width: "100vw" }}>
          <p className="text-center text-white mx-auto"> Loading... </p>
        </div>
      </div>
    </PopupModal>
  );
};

export default PDPPopupVideoModal;
