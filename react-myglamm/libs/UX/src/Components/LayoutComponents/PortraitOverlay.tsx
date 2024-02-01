import React from "react";
import { useAmp } from "next/amp";

const PortraitOverlay = () => {
  const isAmp = useAmp();

  return (
    <div className="bg-black text-center" id="portrait-overlay">
      {isAmp ? (
        <amp-img src="https://files.myglamm.com/site-images/original/img-landscape.png" alt="Rotate Device" layout="fill" />
      ) : (
        <picture className="w-full">
          <source srcSet="https://files.myglamm.com/site-images/original/img-landscape.png" media="(min-width: 780px)" />
          <img
            loading="lazy"
            src="https://files.myglamm.com/site-images/original/img-landscape.png"
            className="mx-auto"
            alt="Rotate Device"
          />
        </picture>
      )}
      <p className="text-white text-lg">Please rotate your device</p>
      <p className="text-white text-sm">
        We don&apos;t support landscape mode yet. Please go back to portrait mode for the best experience
      </p>
    </div>
  );
};

export default PortraitOverlay;
