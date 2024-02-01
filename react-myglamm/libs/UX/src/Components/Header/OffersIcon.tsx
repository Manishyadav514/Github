import React from "react";
import Link from "next/link";
import { useAmp } from "next/amp";

// import { useSelector } from "@libHooks/useValtioSelector";

import { SHOP } from "@libConstants/SHOP.constant";

// import { ValtioStore } from "@typesLib/ValtioStore"

import OfferIcon from "../../../public/svg/offersIcon.svg";

const OffersIcon = ({ children }: { children?: any }) => {
  if (!SHOP.ENABLE_OFFERS) {
    return null;
  }
  const isAmp = useAmp();

  return (
    <Link href="/offers" prefetch={false} className="p-2 ml-1 cursor-pointer focus-visible:outline" aria-label="my offers">
      {isAmp ? (
        <div className="i-amphtml-sizer-intrinsic mt-1">
          <amp-img
            src="https://files.myglamm.com/site-images/original/726476-copy-3-6_5.svg"
            alt="Offers"
            width="20"
            height="20"
          />
        </div>
      ) : (
        children || <OfferIcon role="img" aria-labelledby="offer" title="offer" />
      )}
    </Link>
  );
};

export default OffersIcon;
