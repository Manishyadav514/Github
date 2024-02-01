import React from "react";

import ConfigText from "@libComponents/Common/ConfigText";

import { SHOP } from "@libConstants/SHOP.constant";

import { PDPProd } from "@typesLib/PDP";

import { CONFIG_REDUCER } from "@libStore/valtio/REDUX.store";

import PDPAvgRating from "./PDPAvgRating";

import ShareIcon from "../../../public/svg/Share.svg";

export default function PDPRatingsandShare({ product, showShare = true }: { product: PDPProd; showShare?: boolean }) {
  const { ratings, inStock, productMeta } = product;

  const openShareModal = () =>
    (CONFIG_REDUCER.shareModalConfig = {
      shareUrl: product?.urlShortner?.shortUrl,
      productName: product?.cms[0]?.content?.name,
      slug: product?.urlShortner?.slug,
      module: "product",
      image: product?.assets?.[0]?.imageUrl?.["200x200"],
    });

  const isTryOnActive = inStock && productMeta?.tryItOn;

  return (
    <div
      className={`RatingsandShareNEarn bg-white relative flex items-center justify-between px-3 ${
        !SHOP.ENABLE_SHARE || !showShare ? "h-20" : ""
      } ${isTryOnActive ? "pt-4" : ""}`}
    >
      {ratings?.avgRating > 0 ? (
        <PDPAvgRating
          avgRating={ratings?.avgRating % 1 != 0 ? ratings?.avgRating.toFixed(1) : ratings?.avgRating + ".0"}
          totalCount={ratings?.totalCount}
        />
      ) : (
        <div />
      )}

      {SHOP.ENABLE_SHARE &&
        showShare &&
        (SHOP.SITE_CODE === "bbc" ? (
          <img
            alt="share"
            className="w-20"
            role="presentation"
            onClick={openShareModal}
            src="https://files.myglamm.com/site-images/original/whatsapp-share.png"
          />
        ) : (
          <div className="text-left uppercase font-semibold z-10 right-4">
            <ShareIcon onClick={openShareModal} className="m-auto" role="img" aria-labelledby="share" title="share" />
            <div className="text-center mx-auto font-semibold text-gray-600 tracking-wide" style={{ fontSize: "8px" }}>
              <ConfigText configKey="shareAnd" fallback={"..."} />
              <ConfigText configKey="earn" />
            </div>
          </div>
        ))}
    </div>
  );
}
