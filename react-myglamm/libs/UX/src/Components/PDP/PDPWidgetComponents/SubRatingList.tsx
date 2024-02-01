import useTranslation from "@libHooks/useTranslation";
import React from "react";

const SubRatingList = ({ subRating = {} }: any) => {
  const subRatingArray = Object.keys(subRating);
  const { t } = useTranslation();

  if (!subRatingArray?.length) {
    return null;
  }

  return (
    <section>
      <p className="font-bold text-13 m-0 pb-4"> {t("whatCustomerThink") || "What Customer Think!"} </p>
      {subRatingArray?.map((ratingType: string) => {
        const ratingPercentage = Math.round((subRating[ratingType] * 100) / 5);
        return (
          <div className="flex gap-2 pb-3 justify-between items-center" key={ratingType} >
            <p className="text-xs w-24"> {t(ratingType) || ratingType} </p>
            <div className="h-1 self-center w-40 ">
              <div className="mb-5 h-1 rounded-full bg-gray-200">
                <div className="h-1 rounded-full bg-ratingGreen" style={{ width: `${ratingPercentage}%` }}></div>
              </div>
            </div>
            <p className="text-xs font-bold"> {ratingPercentage}% </p>
          </div>
        );
      })}
    </section>
  );
};

export default SubRatingList;
