import React, { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

const TVCMultimediaCarouse5 = (props: any) => {
  const { data } = props;

  const [playVideo, setPlayVideo] = useState(false);

  // Adobe Analytics[1] - Page Load - Video
  useEffect(() => {
    if (playVideo) {
      ADOBE_REDUCER.adobePageLoadData = {
        common: {
          pageName: "web|ShraddhaKapoor|video",
          newPageName: "Shraddha Kapoor Video",
          subSection: "Shraddha Kapoor video",
          assetType: "Shraddha Kapoor video",
          newAssetType: "Shraddha Kapoor video",
          platform: "desktop website",
          pageLocation: "",
          technology: "react",
        },
      };
    }
  }, [playVideo]);

  if (data.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <div className="w-full mx-auto max-w-screen-xl mb-8">
      <figure className="relative bg-black">
        <div>
          {playVideo ? (
            /* eslint-disable-next-line jsx-a11y/media-has-caption */
            <iframe
              src={`https://www.youtube.com/embed/${data.multimediaDetails?.[0]?.assetDetails.properties.videoId}?autoplay=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              width="100%"
              height="600"
              title={data.multimediaDetails?.[0]?.assetDetails.properties.videoId}
            />
          ) : (
            <>
              <LazyLoadImage
                className="w-auto block mx-auto"
                src={data.multimediaDetails?.[0]?.assetDetails.properties.thumbnailUrl}
                style={{ height: "600px" }}
              />
            </>
          )}
        </div>

        {/* Play Button - VIDEO */}
        {!playVideo && (
          <img
            alt="Play Button"
            role="presentation"
            onClick={() => setPlayVideo(true)}
            className="absolute inset-0 cursor-pointer m-auto w-28 h-28"
            src="https://files.myglamm.com/site-images/original/videoPlay_1.png"
          />
        )}
      </figure>
    </div>
  );
};

export default TVCMultimediaCarouse5;
