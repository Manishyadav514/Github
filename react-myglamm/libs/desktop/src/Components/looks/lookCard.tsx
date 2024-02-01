import React, { useState } from "react";

import Link from "next/link";

import { getImage } from "@libUtils/homeUtils";

import useTranslation from "@libHooks/useTranslation";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

const LookCard = ({ look, index, lookRef }: { look: any; index: number; lookRef: any }) => {
  const { t } = useTranslation();

  const [showShadow, setShowShadow] = useState(false);

  return (
    <Link
      ref={lookRef}
      href={look.urlManager.url}
      onMouseEnter={() => setShowShadow(true)}
      onMouseLeave={() => setShowShadow(false)}
    >
      <div className="relative">
        <ImageComponent
          forceLoad={index < 4}
          className="rounded-sm w-full"
          src={getImage(look, "400x400")}
          alt={look.cms?.[0]?.content?.name}
        />

        {showShadow && (
          <div className="inset-0 absolute bg-black/40 flex items-center justify-center">
            <button className="capitalize text-white m-auto border-4 h-12 px-8 font-bold text-18 rounded-sm border-white">
              {t("shopThisLook") || "shop this look"}
            </button>
          </div>
        )}
      </div>

      <p className="uppercase text-center text-xl px-10 py-3">{look.cms?.[0]?.content?.name}</p>
    </Link>
  );
};

export default LookCard;
