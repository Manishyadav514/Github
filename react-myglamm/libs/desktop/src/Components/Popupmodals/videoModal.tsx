import React from "react";

import PopupModal from "@libComponents/PopupModal/PopupModal";

const VideoModal = ({ show, hide, videoId }: any) => {
  return (
    <PopupModal show={show} onRequestClose={hide} type="center-modal">
      <iframe
        title="homepageVideo"
        width="1095"
        height="616"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </PopupModal>
  );
};

export default VideoModal;
