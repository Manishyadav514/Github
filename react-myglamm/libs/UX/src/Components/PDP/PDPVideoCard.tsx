import * as React from "react";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

const PDPVideoCard = ({ content, handleModal }: any) => (
  <div className="p-1 shadow" aria-hidden="true" onClick={() => handleModal(content?.properties?.videoId)}>
    <div className="w-full">
      <ImageComponent src={content?.properties?.thumbnailUrl} alt={content?.properties?.title} className="w-full" />
    </div>
    <div className="flex">
      <div className="px-3 py-2 w-3/4">
        <p className="text-smfont-thin h-16">{content?.properties?.title?.substring(0, 40)}|MYGLAMM</p>
      </div>
      <div className="w-24 -ml-4">
        <ImageComponent
          alt="playbutton"
          className="h-20 w-20 rounded-full flex items-center justify-center ml-2 -mt-3 bg-white p-4"
          src="https://files.myglamm.com/site-images/original/ico-play-with-curve.png"
        />
      </div>
    </div>
  </div>
);

export default PDPVideoCard;
