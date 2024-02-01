import React from "react";
import Link from "next/link";

import { ValtioStore } from "@typesLib/ValtioStore";
import { useSelector } from "@libHooks/useValtioSelector";

import { SHOP } from "@libConstants/SHOP.constant";

import GiftIcon from "../../../public/svg/gift.svg";
import ShopIcon from "../../../public/svg/shop.svg";

const HeaderBanner = () => {
  const { topBanner } = useSelector((store: ValtioStore) => store.navReducer);

  if (topBanner?.multimediaDetails.length > 0) {
    return (
      <div className="w-full bg-color2 px-2">
        <div className="w-full max-w-screen-xl flex justify-between leading-loose my-0 mx-auto py-2">
          <div className="offerContent flex items-center w-10/12 pt-0.5">
            <GiftIcon className="mr-2 w-4 h-4" />
            <Link href={topBanner.multimediaDetails?.[0].targetLink} className="offerText text-xs	text-black">
              {topBanner.multimediaDetails?.[0].sliderText}
              <span className="refer text-xs pt-0.5	px-8 font-semibold text-color1">
                {topBanner.multimediaDetails?.[0].footerText}
              </span>
            </Link>
          </div>

          {SHOP.IS_MYGLAMM && (
            <Link href="/store-locator" className="shop items-center flex w-1/6 pt-0.5 justify-end text-black text-sm">
              <ShopIcon className="mr-2" />
              MyGlamm Store
            </Link>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default HeaderBanner;
