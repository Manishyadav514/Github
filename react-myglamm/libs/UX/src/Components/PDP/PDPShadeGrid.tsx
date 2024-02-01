import React, { useState, useEffect } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import { useRouter } from "next/router";
import Image from "next/legacy/image";
import clsx from "clsx";

import { ValtioStore } from "@typesLib/ValtioStore";

import Heart from "../../../public/svg/transparentHeart.svg";

export interface PDPShadeGridProps {
  shades: any;
  shadeLabel: string;
  currentProductId: string;
  setActiveShade?: any;
  isMiniShadeSelection?: boolean;
  isFreeProduct?: boolean;
  alignShadesLeft?: boolean;
}

function PDPShadeGrid({
  shadeLabel,
  shades,
  currentProductId,
  setActiveShade,
  isMiniShadeSelection,
  isFreeProduct,
}: PDPShadeGridProps) {
  const router = useRouter();

  const userWishlist = useSelector((store: ValtioStore) => store.userReducer.userWishlist);

  const [id, setId] = useState(currentProductId);
  const [shadesList, setShadesList] = useState<any[]>(shades);
  const [showShadeGrid, setShowShadeGrid] = useState(true);

  const shadeGridStyle = {
    gridGap: "4px",
    gridTemplateColumns: "repeat(auto-fit, minmax(51px, max-content))",
    justifyContent: "flex-center",
  };

  const horizontalShadeStyle = {
    gridGap: "2px",
    gridTemplateColumns: "repeat(auto-fit, minmax(51px, max-content))",
    gridAutoFlow: "column",
    overflowX: "scroll",
    justifyContent: "flex-start",
  };

  const onClick = React.useCallback((i: any) => {
    try {
      if (!isMiniShadeSelection && !isFreeProduct) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch {
      /* NO Response on Failure */
    }
    setId(i);
    return false;
  }, []);

  useEffect(() => {
    setShadesList(shades);
    setId(currentProductId);
  }, [shades?.[0]?.productTag]);

  const onLinkClick = (url: string) => {
    if (!isMiniShadeSelection && !isFreeProduct) {
      if (router.asPath.includes("/product") && !isFreeProduct) {
        router.replace(url);
      }
    }
  };

  return (
    <React.Fragment>
      <svg width="10" height="10" viewBox="0 0 10 10" className="absolute">
        <clipPath id="squircleClip" clipPathUnits="objectBoundingBox">
          <path
            fill="red"
            stroke="none"
            d="M0.046,0.172 C0.062,0.11,0.11,0.062,0.172,0.045 C0.253,0.024,0.374,0,0.499,0 C0.623,0,0.747,0.024,0.831,0.045 C0.898,0.061,0.948,0.113,0.963,0.181 C0.98,0.262,1,0.381,1,0.502 C1,0.62,0.981,0.739,0.964,0.822 C0.949,0.894,0.894,0.949,0.822,0.963 C0.738,0.981,0.618,1,0.501,1 C0.382,1,0.264,0.98,0.182,0.963 C0.114,0.948,0.061,0.897,0.044,0.83 C0.024,0.746,0,0.623,0,0.502 C0,0.378,0.025,0.255,0.046,0.172"
          />
        </clipPath>
      </svg>

      {/* Shade Grid Component */}
      <div className="p-2  grid justify-center px-1" style={showShadeGrid ? shadeGridStyle : horizontalShadeStyle}>
        {Array.isArray(shadesList) &&
          shadesList.map((shade: any, index: number) => {
            const shadeDetails = shade?.cms[0]?.attributes;
            const { shadeImage } = shadeDetails || {};

            return (
              <div
                key={shade.id}
                style={{ width: "49px", height: "49px" }}
                className={clsx("squircle flex items-center justify-center", id === shade.id ? "bg-black" : "")}
              >
                <div style={{ width: "47px", height: "47px" }} className="squircle flex items-center justify-center ">
                  <a
                    key={shade.id}
                    role="presentation"
                    style={{ width: "45px", height: "45px" }}
                    className="squircle"
                    onClick={() => {
                      onClick(shade.id);
                      onLinkClick(shade.urlManager?.url);
                    }}
                    aria-label={shade?.cms[0]?.attributes?.shadeLabel}
                  >
                    <div
                      role="button"
                      aria-hidden="true"
                      className="flex items-center justify-center relative"
                      onClick={() => (isMiniShadeSelection || isFreeProduct ? setActiveShade(shade, index) : "")}
                    >
                      {!shade.inStock && (
                        <div
                          className="flex overflow-hidden absolute z-20 w-full h-full bg-no-repeat bg-center"
                          style={{
                            backgroundImage: "url(https://files.myglamm.com/site-images/original/ico-no-shade.png)",
                          }}
                        />
                      )}
                      {userWishlist?.find((x: any) => x === shade.id) && (
                        <Heart
                          className="absolute m-auto z-10 top-0 left-0 right-0 bottom-0"
                          role="img"
                          aria-labelledby="wishlist"
                        />
                      )}
                      {shadeImage && (
                        <Image
                          className="w-full h-full"
                          width={45}
                          height={45}
                          src={shadeImage}
                          alt={shadeDetails?.shadeLabel || "shade label"}
                        />
                      )}
                    </div>
                  </a>
                </div>
              </div>
            );
          })}
      </div>
    </React.Fragment>
  );
}

export default PDPShadeGrid;
