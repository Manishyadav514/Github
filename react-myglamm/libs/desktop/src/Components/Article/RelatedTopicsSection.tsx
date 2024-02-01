import React from "react";
import Link from "next/link";

import { GAgenericEvent } from "@libUtils/analytics/gtm";

import { ArticleDetailsContext } from "../../pages/learn/[slug]";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import WebContentWrapper from "../../Components/common/wrappers/WebContentWrapper";
import WebSectionWrapper from "../../Components/common/wrappers/WebSectionWrapper";

const RelatedTopicTag = () => {
  const articleDetailsInfo: any = React.useContext(ArticleDetailsContext);
  const termDetails = articleDetailsInfo?._links?.["wp:term"];
  const postTagIndex = termDetails?.findIndex((d: any) => d.taxonomy === "post_tag");
  let embeddedRelatedTags = [];

  // ! xseo tag slug comes from backend -> It is added specifically for seo articles and it should not be present on
  // ! Related tags on frontend
  if (postTagIndex !== -1) {
    embeddedRelatedTags = articleDetailsInfo?._embedded?.["wp:term"]?.[postTagIndex]?.filter(
      (tag: any) => tag?.slug !== "xseo"
    );
  }
  if (!embeddedRelatedTags?.length) {
    return null;
  }
  return (
    <WebSectionWrapper applyBorder>
      <WebContentWrapper className="py-2 px-3.5 mb-3">
        <h3 className="mb-2 text-sm font-bold capitalize" dangerouslySetInnerHTML={{ __html: "Related Topics for you" }} />
        <div className="flex flex-wrap items-center pt-2">
          {embeddedRelatedTags?.map((tag: any) => {
            return (
              <Link
                href={`${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}/community/hashtags/${tag.slug}`}
                key={`related_topic_${tag.id}`}
                legacyBehavior
              >
                <a
                  onClick={() => {
                    GAgenericEvent("Content & Community", "BBC Clicked Related Topic", "");
                  }}
                >
                  <p className="text-slate-600 bg-white text-sm font-normal border-solid border border-color2 px-3.5 py-2 m-1 cursor-pointer rounded-full ">
                    {tag.name}
                  </p>
                </a>
              </Link>
            );
          })}
        </div>
      </WebContentWrapper>
    </WebSectionWrapper>
  );
};

export default React.memo(RelatedTopicTag);
