import React from "react";
import useTranslation from "@libHooks/useTranslation";
import PDPRatingV2 from "@libComponents/PDPWidgets/PDPRatingV2";
import { nFormatter } from "@productLib/pdp/HelperFunc";
import { PDPProd } from "@typesLib/PDP";

const PDPTopRating = ({ product }: { product: PDPProd }) => {
  const { ratings, reviews } = product;
  const {t} = useTranslation()


  return (
    <div className="pb-2 flex gap-2 items-center">
      <span>
        <PDPRatingV2 avgRating={ratings?.avgRating} svgSize={10} fontSize={12} />
      </span>
      {ratings?.totalCount > 0 && reviews?.totalCount > 0 ? (
        <p className="text-xs text-right">
          {`${nFormatter(ratings?.totalCount, 1)} ${t("ratings") || "Ratings"} | ${nFormatter(reviews?.totalCount, 1)} ${t("reviews") || "Reviews"}`}
        </p>
      ) : null}
    </div>
  );
}; 

export default PDPTopRating;
