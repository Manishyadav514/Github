import React, { useState } from "react";

type CollapseType = {
  minHeight: string;
  ctaText: string;
  ctaCustomClass: string;
  ctaReverseText: string;
  children: React.ReactNode;
};

const CollapsableBlock = (props: CollapseType) => {
  const [isBlockOpen, setIsBlockOpen] = useState<boolean>(false);
  const { minHeight, ctaText, ctaCustomClass, ctaReverseText, children } = props;
  return (
    <div className="relative">
      <div className={`${!isBlockOpen ? `${minHeight} overflow-hidden mb-10` : ""}`}> {children}</div>
      {!isBlockOpen ? (
        <button type="button" className={ctaCustomClass} onClick={() => setIsBlockOpen(true)}>
          {ctaText}
        </button>
      ) : (
        <button
          type="button"
          className={`${ctaCustomClass} ${isBlockOpen && "-bottom-4"}`}
          onClick={() => setIsBlockOpen(false)}
        >
          {ctaReverseText}
        </button>
      )}
    </div>
  );
};

export default CollapsableBlock;
