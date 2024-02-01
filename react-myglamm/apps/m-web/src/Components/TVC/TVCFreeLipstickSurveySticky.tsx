import React from "react";

const TVCFreeLipstickSurveySticky = ({ t }: any) => (
  <div className="sticky bottom-0 pt-4 px-1 pb-1 pinkShadow" style={{ filter: "drop-shadow(0px 0px 11px pink)" }}>
    <a href={t("tvcConfig")?.stickyHeader.slug} aria-label="free lipsticks">
      <img alt="free-lipstick" src={t("tvcConfig")?.stickyHeader.imageUrl} />
    </a>
  </div>
);

export default TVCFreeLipstickSurveySticky;
