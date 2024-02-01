import React from 'react'
import StarFilledGreen from "../../../public/svg/star-filled-green.svg";
import { nFormatter } from "@productLib/pdp/HelperFunc";
import {  G3_WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";
import useTranslation from '@libHooks/useTranslation';

const RatingReview = ({ratings,reviews}:any) => {
  const { t } = useTranslation();

  return (
   <>
    <div className="border-b border-themeGray mb-4">
        <div className="flex gap-2 items-center">
          <span className="flex items-center">
            <p className="font-bold text-ratingGreen text-3xl leading-tight"> {ratings?.avgRating} </p>
            <p className=" text-gray-400 text-3xl leading-tight"> /5 </p>
            <StarFilledGreen
              height={24}
              width={24}
              className="-mt-1.5 ml-1"
              role="img"
              aria-labelledby="product rating"
              title="product rating"
            />
          </span>
          <span>
            <p className="text-xs">
              {nFormatter(ratings?.totalCount, 1)} {t("ratings") || "Ratings"}
            </p>
            <p className="text-xs">
              {nFormatter(reviews?.totalCount, 1)} {t("reviews") || "Reviews"}
            </p>
          </span>
        </div>
        {/* todo replace myglamm with brand name  */}
        <p className="text-xs text-gray-400 pb-3">
          {t("reviewDisclaimer") || `Weighted average based on user credibility on ${G3_WEBSITE_NAME()}`}
        </p>
      </div>
   </>
  )
}

export default RatingReview