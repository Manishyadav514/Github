import * as React from "react";

import PopupModal from "./PopupModal";
import CrossIcon from "../../../public/svg/ic_close.svg";

const VideoModal = ({ isOpen, onRequestClose, videoId }: any) => (
  <PopupModal show={isOpen} type="center-modal" onRequestClose={onRequestClose}>
    <div className="VideoModal w-full">
      <div className="flex justify-end w-full">
        <button type="button" onClick={onRequestClose} className="bg-slate-200 rounded-full w-5 h-5 flex justify-center items-center">
          <CrossIcon />
        </button>
      </div>
      <iframe
        title="videoId"
        frameBorder="0"
        allow="autoplay"
        allowFullScreen
        className="w-full h-64 aspect-video"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1`}
      />
    </div>
  </PopupModal>
);

export default VideoModal;
