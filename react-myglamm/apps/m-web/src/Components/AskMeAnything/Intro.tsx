import React from "react";
import Link from "next/link";

import clsx from "clsx";

import useTranslation from "@libHooks/useTranslation";

const Intro = ({ className }: any) => {
  const { t } = useTranslation();

  const AMA_CONFIG = t("amaConfig");

  if (AMA_CONFIG?.bannerImg) {
    return (
      <div className={clsx(className || "")}>
        <Link href={AMA_CONFIG?.bannerImgSlug} className="bg-color2" aria-label="Ask me anything">
          <img
            // @ts-ignore
            importance="high"
            id="webengage_2"
            alt="Ask me anything"
            src={AMA_CONFIG?.bannerImg}
            className="w-full rounded-b-3xl"
          />
        </Link>
        <h2 className="text-center bg-color2 tracking-widest text-xs uppercase pt-4 pb-1 text-gray-600">
          All Questions &amp; Answers
        </h2>
      </div>
    );
  }

  return null;
};

export default Intro;
