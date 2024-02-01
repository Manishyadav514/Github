import React from "react";

import VideoCarousel from "./VideoCarousel";
import TVCMultimediaCarouse5 from "./TVCMultimediaCarousel5";

const MultimediaCarousel5 = ({ data, isTVC }: { data: any; isTVC: boolean }) => {
  if (isTVC) {
    return <TVCMultimediaCarouse5 data={data} />;
  }

  return <VideoCarousel data={data} />;
};

export default MultimediaCarousel5;
