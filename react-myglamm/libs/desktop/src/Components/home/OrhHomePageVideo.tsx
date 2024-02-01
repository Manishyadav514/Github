import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const OrhHomePageVideo = (props: any) => {
  const { data } = props;
  const [playVideo, setPlayVideo] = useState(false);

  if (!data?.thumbnailURL || !data?.videoURL) {
    return null;
  }

  return (
    <div className="w-full mx-auto max-w-screen-xl mb-8">
      <figure className="relative bg-black">
        <div>
          {playVideo ? (
            <iframe
              src={`https://www.youtube.com/embed/${data.videoURL}?autoplay=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              width="100%"
              height="500"
              title={data.videoURL}
            />
          ) : (
            <>
              <LazyLoadImage className="w-auto block mx-auto" src={data.thumbnailURL} style={{ height: "500px" }} />
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

export default OrhHomePageVideo;
