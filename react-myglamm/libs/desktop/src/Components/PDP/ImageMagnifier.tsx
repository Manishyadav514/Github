import React, { RefObject, memo, useEffect, useRef, useState } from "react";

import { NextImage } from "@libComponents/NextImage";

import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

import { check_webp_feature } from "@libUtils/webp";

interface MagnifierProps {
  src: string;
  width?: number;
  height?: number;
  magnifierHeight?: number;
  magnifierWidth?: number;
  zoomLevel?: number;
  alt?: string;
  callback: () => void;
}

const ImageMagnifier = ({
  src = DEFAULT_IMG_PATH(),
  width = 361,
  height = 361,
  magnifierHeight = 100,
  magnifierWidth = 100,
  zoomLevel = 1.5,
  alt = "img",
  callback,
}: MagnifierProps) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [disableImageComponent, setDisableImageComponent] = useState(false);

  const lensRef: RefObject<HTMLDivElement> = useRef(null);

  const commonStyle: React.CSSProperties = {
    display: showMagnifier ? "" : "none",
    position: "absolute",
    backgroundColor: "white",
    backgroundImage: `url('${src}')`,
    backgroundRepeat: "no-repeat",
    backgroundPositionX: `${-x}px`,
    backgroundPositionY: `${-y}px`,
  };

  // update image size and turn on magnifier
  const onMouseEnterImage = (e: React.MouseEvent<HTMLImageElement>) => {
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const onMouseMoveImage = (e: React.MouseEvent<HTMLImageElement>) => {
    // update cursor position
    const elem = e.currentTarget;
    const { top, left, width: imgWidth, height: imgHeight } = elem.getBoundingClientRect();
    const { width: lensWidth, height: lensHeight } = (lensRef.current as HTMLElement).getBoundingClientRect();

    // calculate cursor position on the image
    const Cx = e.pageX - left - window.pageXOffset;
    const Cy = e.pageY - top - window.pageYOffset;

    let positionLeft = Cx - lensWidth / 2;
    let positionTop = Cy - lensHeight / 2;

    if (positionLeft < 0) {
      positionLeft = 0;
    }

    if (positionTop < 0) {
      positionTop = 0;
    }

    if (positionLeft > imgWidth - lensWidth) {
      positionLeft = imgWidth - lensWidth;
    }

    if (positionTop > imgHeight - lensHeight) {
      positionTop = imgHeight - lensHeight;
    }

    setXY([positionLeft, positionTop]);
  };

  const onMouseLeaveImage = () => setShowMagnifier(false);

  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render

        setDisableImageComponent(true);
      }
    });
  }, []);

  return (
    <div className="relative">
      {!disableImageComponent ? (
        <NextImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          onClick={callback}
          onMouseMove={onMouseMoveImage}
          onMouseEnter={onMouseEnterImage}
          onMouseLeave={onMouseLeaveImage}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          onClick={callback}
          onMouseMove={onMouseMoveImage}
          onMouseEnter={onMouseEnterImage}
          onMouseLeave={onMouseLeaveImage}
          style={{ height, width, objectFit: "cover" }}
        />
      )}

      <div
        ref={lensRef}
        style={{
          // prevent maginier blocks the mousemove event of img
          pointerEvents: "none",
          // set size of magnifier size
          height: `${magnifierHeight}px`,
          width: `${magnifierWidth}px`,
          // move element center to cursor pos
          top: `${y}px`,
          left: `${x}px`,
          border: "1px solid gray",
          // calculate image size
          backgroundSize: `${imgWidth}px ${imgHeight}px`,
          ...commonStyle,
        }}
      />
      <div
        style={{
          top: "0",
          left: width,
          zIndex: "40",
          height: `${width}px`,
          width: `${height}px`,
          border: "1px solid lightgray",
          // calculate zoomed image size with magnifier size
          backgroundSize: `${imgWidth * zoomLevel + magnifierWidth}px ${imgHeight * zoomLevel + magnifierHeight}px`,
          ...commonStyle,
        }}
      />
    </div>
  );
};

export default memo(ImageMagnifier);
