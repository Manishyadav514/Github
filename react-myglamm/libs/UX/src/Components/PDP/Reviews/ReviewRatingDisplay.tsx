import React from "react";

import useTranslation from "@libHooks/useTranslation";

import CircularRating from "@libComponents/PDP/Reviews/CirularRating";

const ReviewRatingDisplay = ({ ratings, subRating }: any) => {
  const { t } = useTranslation();

  return (
    <div className="flex">
      <style jsx>
        {`
          #progressContianer {
            grid-template-columns: repeat(auto-fit, minmax(58px, max-content));
          }
        `}
      </style>
      <div className="w-full">
        <div className="flex ml-5">
          <p className="text-center mr-5  text-5xl font-semibold leading-relaxed">
            {ratings?.avgRating === 0 ? 0 : ratings?.avgRating.toFixed(1)}
          </p>
          <div
            className="text-center text-6xl mt-1"
            dangerouslySetInnerHTML={{
              __html: `
          <div class="Stars" style= "--rating: ${ratings?.avgRating}"></div>
          `,
            }}
          />
        </div>
        <p className="pb-2 text-smfont-thin m-0 px-5 text-gray-400">
          {t("pdpBasedOnRating", [ratings?.totalCount?.toString()])}
        </p>
        <p className="px-5 font-semibold py-3">{t("customersThinksTitle")}</p>
        {/* Cirular Rating - Progress Bars */}
        {subRating.length > 0 && (
          <>
            {/* <p className="text-center text-lg font-bold pb-1 px-5 mt-4">
          {t("pdpWhatCustomersThink") || `What Customers Think !`}
        </p> */}
            <div id="progressContianer" className="mt-2 mb-7 w-full grid justify-between px-5 gap-1">
              {subRating.map((innerRating: any) => {
                const value = (ratings.subRating[innerRating] / 5) * 100; // its the progressbar %
                const text = ratings.subRating[innerRating]; // The value displayed

                if (value) {
                  return (
                    <React.Fragment key={innerRating}>
                      {ratings.subRating[innerRating] && <CircularRating title={innerRating} value={value} text={text} />}
                    </React.Fragment>
                  );
                }

                return null;
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewRatingDisplay;
