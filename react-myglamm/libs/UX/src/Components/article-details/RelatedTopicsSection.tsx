import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import { ArticleDetailsContext } from "@libPages/learn/[slug]";

import { GAgenericEvent } from "@libUtils/analytics/gtm";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const SmallGreyRect = dynamic(() => import("@libComponents/CommonBBC/SmallGreyRect"));

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
    <div>
      <div className="py-4 px-3.5 mb-3">
        <h3 className={`mb-2 text-sm font-medium capitalize`} dangerouslySetInnerHTML={{ __html: "Related Topics for you" }} />
        <div className="flex flex-wrap items-center pt-2">
          {embeddedRelatedTags?.map((tag: any) => {
            return (
              <Link
                href={`${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}/community/hashtags/${tag.slug}`}
                key={`related_topic_${tag.id}`}
                onClick={() => {
                  GAgenericEvent("Content & Community", "BBC Clicked Related Topic", "");
                }}
                aria-label={tag.name}
              >
                <p className="text-slate-600 bg-white text-sm font-normal border-solid border border-color2 px-3.5 py-2 m-1 cursor-pointer rounded-full ">
                  {tag.name}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
      <SmallGreyRect />
    </div>
  );
};

export default React.memo(RelatedTopicTag);
