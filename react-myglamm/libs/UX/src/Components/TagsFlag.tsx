import useTranslation from "@libHooks/useTranslation";
import React from "react";

type tagFlag = { variant?: string; tagName?: string; cls?: string };

const TagsFlag = ({ variant = "no-variant", tagName = "", cls = "top-1 left-1 w-20" }: tagFlag) => {
  const { t } = useTranslation();
  const tagImage = t("productOfferTag")?.[tagName]?.imageUrl;

  return (
    <>
      {variant === "1" && tagImage && (
        <div className={`absolute ${cls}`} style={{ zIndex: "5" }}>
          <img src={tagImage} alt="tags" />
        </div>
      )}
    </>
  );
};

export default TagsFlag;
