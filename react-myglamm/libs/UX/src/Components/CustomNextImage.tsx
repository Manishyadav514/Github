import React from "react";
import Image from "next/legacy/image";
import { getStaticUrl } from "@libUtils/getStaticUrl";

interface ImageProp {
  src?: string;
  style?: React.CSSProperties;
  alt?: string;
  className?: string;
  placeHolderImage?: string;
  width?: any;
  height?: any;
  priority?: boolean;
  unoptimized?: boolean;
}

const expiredDomains = ["img-static.popxo.com", "cdn-sp.babychakra.com"];

const ImageComponent: React.FC<ImageProp> = ({
  style,
  src = getStaticUrl("/images/default-bg.png"),
  alt = "",
  className,
  placeHolderImage = getStaticUrl("/images/default-bg.png"),
  width = null,
  height = null,
  priority = true,
  unoptimized = false,
}) => {
  const shouldOptimize = src?.includes(expiredDomains[0]) || src?.includes(expiredDomains[1]) || unoptimized;
  return (
    <Image
      width={width}
      height={height}
      src={src || placeHolderImage}
      alt={alt}
      priority={priority}
      unoptimized={shouldOptimize}
      className={className}
      style={style}
      onError={(e: any) => {
        e.target.src = placeHolderImage;
      }}
    />
  );
};
export default ImageComponent;
