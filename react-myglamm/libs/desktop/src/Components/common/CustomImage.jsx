import * as React from "react";
import ProgressiveImage from "react-progressive-graceful-image";

const ImageComponent = ({
  styleMobile,
  src,
  alt,
  customClass,
  placeHolderImage,
  forceLoad,
  delay,
  groupIndex,
  width,
  height,
  styleDesktop,
}) => (
  <ProgressiveImage
    src={src}
    placeholder={placeHolderImage}
    delay={delay || forceLoad ? 0 : 100}
    rootMargin="0% 0% 0%"
    threshold={[0.1]}
    noLazyLoad={forceLoad}
  >
    {(imgsrc, loading) => {
      return (
        <img
          src={forceLoad ? src : imgsrc}
          className={`ImgComponent ${loading && !forceLoad ? "loading-Img" : "ImgFadeIn"} ${customClass} ${styleDesktop}`}
          id={groupIndex === 999 ? "" : `webengage_${groupIndex}`}
          alt={alt}
          width={width}
          height={height}
          style={styleMobile}
        />
      );
    }}
  </ProgressiveImage>
);

ImageComponent.defaultProps = {
  src: DEFAULT_IMG,
  alt: "",
  styleMobile: null,
  styleDesktop: null,
  customClass: "",
  placeHolderImage: DEFAULT_IMG,
  forceLoad: false,
  delay: 1,
  groupIndex: 999,
  width: null,
  height: null,
};

export default React.memo(ImageComponent);
