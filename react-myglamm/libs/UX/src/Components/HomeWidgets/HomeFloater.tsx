import React from "react";
import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";

type floater = {
  imgSrc: string;
  imgSrcV2: string;
  slug: string;
  active: boolean;
  floaterV2: boolean;
  floaterTextSrc: string;
  floaterText: string;
};

const HomeFloater = ({ adobeTriggerClickEvent }: { adobeTriggerClickEvent: () => void }) => {
  const { t } = useTranslation();

  const { imgSrcV2, slug, active, floaterV2, floaterTextSrc, floaterText }: floater = t("floaterConfig") || {};

  if (active && slug && imgSrcV2 && floaterV2 && (floaterTextSrc || floaterText)) {
    return (
      <Link
        href={slug}
        aria-hidden
        prefetch={false}
        style={{ boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.25)", zIndex: 55 }}
        className={`right-0 fixed bg-color1 text-white text-xs font-bold flex items-center rounded-l-full p-0.5 bottom-24`}
        aria-label="skin analyser floater"
        onClick={adobeTriggerClickEvent}
      >
        <img className="pl-0.5" src={imgSrcV2} alt="floater" height={42} width={42} />
        <div className="flex flex-col flex-wrap justify-center items-start text-start w-16 px-1">
          {floaterText && !floaterTextSrc && (
            <p
              className="text-xs leading-1 overflow-hidden break-words"
              dangerouslySetInnerHTML={{ __html: floaterText || "Skin Analyser" }}
            ></p>
          )}
          {!floaterText && floaterTextSrc && <img src={floaterTextSrc} alt="floater text image" height={45} width={45} />}
        </div>
      </Link>
    );
  }

  return null;
};

export default HomeFloater;
