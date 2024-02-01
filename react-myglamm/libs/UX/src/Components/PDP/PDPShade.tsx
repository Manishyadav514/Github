import React from "react";
import clsx from "clsx";

import Heart from "../../../public/svg/transparentHeart.svg";

const PDPShade = ({
  shade,
  id,
  index,
  onClick,
  isMiniShadeSelection,
  isFreeProduct,
  setActiveShade,
  userWishlist,
  shadeImage,
  isPreOrder,
  comboShades = false,
  isTryon = false,
}: any) => {
  return (
    <div
      key={shade.id}
      style={comboShades ? { width: "38px", height: "38px" } : { width: "48px", height: "48px" }}
      className={clsx(
        "squircle shrink-0 mr-0.5 flex items-center justify-center",
        id === shade.id ? "bg-color1" : "bg-white"
      )}
    >
      <div className={clsx("squircle   flex items-center justify-center bg-white", comboShades ? "h-9 w-9" : "h-11 w-11")}>
        <a
          key={shade.id}
          role="presentation"
          className={clsx("squircle", comboShades ? "h-8 w-8" : "h-10 w-10")}
          onClick={() => {
            onClick(shade);
          }}
        >
          <div
            role="button"
            aria-hidden="true"
            className="flex items-center justify-center relative"
            onClick={() => (isMiniShadeSelection || isFreeProduct ? setActiveShade(shade, index) : "")}
          >
            {!isPreOrder && !shade.inStock && (
              <div
                className="flex overflow-hidden absolute z-20 w-full h-full bg-no-repeat bg-center"
                style={{
                  backgroundImage: "url(https://files.myglamm.com/site-images/original/ico-no-shade.png)",
                }}
              />
            )}
            {userWishlist?.find((x: any) => x === shade.id) && (
              <Heart className="absolute m-auto z-10 top-0 left-0 right-0 bottom-0" />
            )}
            {shadeImage && <img className="w-full h-full" src={shadeImage} />}
          </div>
        </a>
      </div>
    </div>
  );
};

export default PDPShade;

// onLinkClick && onLinkClick(shade.urlManager?.url);
