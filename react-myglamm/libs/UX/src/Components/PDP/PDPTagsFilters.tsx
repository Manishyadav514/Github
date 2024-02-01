import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import clsx from "clsx";
import React, { useState } from "react";

const PDPTagsFilters = ({ tags, handleFilterProduct, dsKey }: { tags: any[]; handleFilterProduct: any; dsKey: string }) => {
  const [activeTag, setActiveTag] = useState<string>(tags[0]);
  if (!tags.length) return <></>;

  const tagCLickEvent = (tag: string) => {
    (window as any).digitalData = {
      common: {
        linkName: `web | ${dsKey}`,
        linkPageName: `web | ${dsKey}`,
        ctaName: `${tag} | tag filter`,
        newLinkPageName: dsKey,
        newAssetType: "mobile website",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
    };
    Adobe.Click();
  };
  
  return (
    <ul
      className="overflow-x-auto flex items-center list-none  px-4 mb-2 gap-2"
      style={{
        scrollSnapType: "x mandatory",
      }}
    >
      {tags.map(tag => {
        return (
          <span
            className={clsx(
              "border border-color1 rounded-2xl text-xs px-2 leading-6 capitalize min-w-fit",
              activeTag === tag ? "text-white bg-color1" : "text-black bg-white"
            )}
            key={tag}
            onClick={() => {
              setActiveTag(tag);
              handleFilterProduct(tag);
              tagCLickEvent(tag);
            }}
          >
            {tag}
          </span>
        );
      })}
    </ul>
  );
};

export default PDPTagsFilters;
