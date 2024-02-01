import React from "react";

import clsx from "clsx";
import ProgressiveImage from "react-progressive-graceful-image";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

interface ImageProp {
  src?: string;
  style?: React.CSSProperties;
  alt?: string;
  className?: string;
  placeHolderImage?: string;
  scrollPosition?: any;
  forceLoad?: boolean;
  delay?: number;
  groupIndex?: number;
  width?: any;
  height?: any;
  onClick?: () => void;
}

// default-myglamm-600px
const ImageComponent: React.FC<ImageProp> = ({
  style,
  src = DEFAULT_IMG_PATH(),
  alt = "",
  className,
  placeHolderImage = DEFAULT_IMG_PATH(),
  forceLoad = false,
  delay = 1,
  groupIndex = 999,
  width = null,
  height = null,
  onClick = () => null,
}) => (
  // @ts-ignore TODO
  <ProgressiveImage
    src={src}
    placeholder={placeHolderImage}
    delay={delay || forceLoad ? 0 : 100}
    rootMargin="0% 0% 0%"
    threshold={[0.1]}
    noLazyLoad={forceLoad}
  >
    {(imgsrc: string, loading: boolean) => {
      const classImg = clsx("ImgComponent", loading && !forceLoad ? "loading-Img" : "ImgFadeIn", className);
      return (
        <img
          decoding="async"
          src={forceLoad ? src : imgsrc}
          className={classImg}
          id={groupIndex === 999 ? "" : `webengage_${groupIndex}`}
          alt={alt}
          width={width}
          height={height}
          style={style}
          onClick={onClick}
        />
      );
    }}
  </ProgressiveImage>
);

export default ImageComponent;
