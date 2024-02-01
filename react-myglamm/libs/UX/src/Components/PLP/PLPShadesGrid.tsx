import React, { Fragment, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { ValtioStore } from "@typesLib/ValtioStore";

import Heart from "../../../public/svg/transparentHeart.svg";
import ArrowIcon from "../../../public/svg/group-3-copy-2.svg";

interface shadesProps {
  shades: Array<{
    shadeLabel: string;
    slug: string;
    shadeImage: string;
    inStock: boolean;
    productId: string;
  }>;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const PLPShadesGrid = ({ shades, activeIndex, setActiveIndex }: shadesProps) => {
  const { t } = useTranslation();
  const [shadeList, setShadeList] = useState(() => {
    const newShadeList = [...shades];
    newShadeList.splice(0, 0, newShadeList.splice(activeIndex, 1)[0]);
    return [...newShadeList];
  });
  const { userWishlist } = useSelector((store: ValtioStore) => store.userReducer);

  const [showAllShades, setShowAllShades] = useState(false);
  if (shades.length > 1) {
    return (
      <Fragment>
        <svg width="10" height="10" viewBox="0 0 10 10">
          <clipPath id="squircleClip" clipPathUnits="objectBoundingBox">
            <path fill="red" stroke="none" d="M .5,0 C .1,0 0,.1 0,.5 0,.9 .1,1 .5,1 .9,1 1,.9 1,.5 1,.1 .9,0 .5,0 Z" />
          </clipPath>
        </svg>

        <span className="text-xs text-gray-500 mr-2">{t("shade")}</span>
        <span className="text-xs font-semibold text-red-900">{shades[activeIndex]?.shadeLabel}</span>
        <br />

        <div
          className="w-full grid justify-center"
          style={{
            gridGap: "1px",
            gridTemplateColumns: "repeat(auto-fit, minmax(48px, max-content))",
          }}
        >
          {shadeList.slice(0, showAllShades || shades.length < 13 ? shades.length : 11).map((shade, index) => (
            <div
              className={`squircle flex items-center justify-center w-12 h-12 my-0.5 ${
                shades[activeIndex]?.slug === shade.slug ? "bg-gray-800" : "bg-white"
              }`}
              key={shade.productId}
            >
              <div className="squircle bg-white flex items-center justify-center w-11 h-11">
                <div
                  role="presentation"
                  onClick={() => setActiveIndex(shades.findIndex(s => s.productId === shade.productId))}
                  className="squircle flex items-center relative w-10 h-10"
                >
                  {!shade.inStock && (
                    <div
                      className="flex overflow-hidden absolute z-30 w-full h-full bg-no-repeat bg-center"
                      style={{
                        backgroundImage: "url(https://files.myglamm.com/site-images/original/ico-no-shade.png)",
                      }}
                    />
                  )}

                  {userWishlist.find((x: any) => x === shade.productId) && <Heart className="absolute m-auto z-20 inset-0" />}

                  <ImageComponent alt={shade.shadeLabel} src={shade.shadeImage} className="w-full h-full" />
                </div>
              </div>
            </div>
          ))}

          {!showAllShades && shades.length > 12 && (
            <div role="presentation" className="flex items-center justify-center" onClick={() => setShowAllShades(true)}>
              <div
                className="text-xxs font-semibold flex justify-center flex-col items-center rounded-xl leading-tight pt-1"
                style={{
                  width: "37px",
                  height: "37px",
                  boxShadow: "rgb(0 0 0 / 12%) 0px 0px 10px",
                }}
              >
                +{shades.length - 11}
                <ArrowIcon className="w-3.5 h-3.5 transform rotate-90" />
              </div>
            </div>
          )}
        </div>
      </Fragment>
    );
  }
  return null;
};

export default PLPShadesGrid;
