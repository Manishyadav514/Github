import { check_webp_feature } from "@libUtils/webp";
import React, { useEffect } from "react";
import { useState } from "react";
import { NextImage } from "@libComponents/NextImage";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

interface useWebp {
  src: string;
  alt: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
  priority?: boolean;
  className?: string;
  forceLoad?: boolean;
}

function useWebp() {
  const [useNextComponent, setNextComponent] = useState(true);

  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render
        setNextComponent(false);
      }
    });
  }, []);

  const WebPImage = (props: useWebp) => {
    if (useNextComponent) {
      return <NextImage {...props} />;
    }
    return <ImageComponent {...props} />;
  };

  return { WebPImage };
}

export default useWebp;
