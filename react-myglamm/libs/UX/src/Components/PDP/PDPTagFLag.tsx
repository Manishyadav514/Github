import React from "react";
import Router from "next/router";

import { SEARCH_STATE } from "@libStore/valtio/SEARCH.store";

import useTranslation from "@libHooks/useTranslation";

const PDPTagFLag = ({ tags }: any) => {
  const { t } = useTranslation();
  const { color1, color2 } = t("tagFlagColors")?.[tags?.name] || t("tagFlagColors")?.default || {};

  const handleTagClick = () => {
    if (tags.rankingSlug) {
      Router.push(tags?.rankingSlug);
      return;
    }
    handleSearchTagClick(tags.rankingName);
  };

  const handleSearchTagClick = (q: any) => {
    SEARCH_STATE.products = [];
    SEARCH_STATE.input.value = q;
    SEARCH_STATE.searchType = `selection | Search Tags Flag`;
    Router.push(
      {
        pathname: "/search",
        query: {
          q,
          tab: "PRODUCTS",
          source: "PDP",
        },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      <div className="my-2 px-4 ">
        <p className="text-sm flex items-center">
          <span className=" text-white text-xs py-0.5 px-1 rounded-sm tagFlag">
            {tags?.ranking && <span className="font-bold pr-0.5"> #{tags?.ranking} </span>} {tags?.name}
          </span>
          <span className="h-1 w-1 bg-white rounded-full relative z-20 -ml-0.5"></span>
          {tags?.rankingName && (
            <>
              <span className="text-xs text-gray-400 pr-1 pl-2.5">in</span>
              <span className="font-bold" onClick={handleTagClick} style={{ color: color2 ? color2 : "var(--color2)" }}>
                {tags?.rankingName}
              </span>
            </>
          )}
        </p>
      </div>
      <style>
        {`
    .tagFlag{
      height: 18px;
      position: relative;
      display:flex;
      justify-content: center;
      align-items: center;
      background:${color1 ? color1 : "var(--color1)"};
    }
    
    .tagFlag::after{
      content:'';
      position:absolute;
      width:0;
      height:0;
      border-width:7.95px;
      z-index:20;
      border-color: transparent;
      border-style: solid;
      border-left-color: ${color1 ? color1 : "var(--color1)"};
    }
    
    [dir="ltr"] .tagFlag::after{
      right: -15px;
      top:0.07rem;
     }
    
    [dir="rtl"] .tagFlag::after{
      left: -15px;
      top:0.07rem;
      rotate: 180deg;
    }   
    `}
      </style>
    </>
  );
};

export default PDPTagFLag;
