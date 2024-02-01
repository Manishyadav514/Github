import React, { useEffect, useState } from "react";
import Link from "next/link";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import useTranslation from "@libHooks/useTranslation";

import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

function RecommendedLooks({ looks }: any) {
  const [recommendedLooks, setRecommendedLooks] = useState<any>();
  const [looksData] = looks.data;
  const { t } = useTranslation();

  useEffect(() => {
    if (looksData) {
      const widgetApi = new WidgetAPI();
      widgetApi.getRecommendedLooks(looksData.id, looksData.categoryId).then(res => {
        setRecommendedLooks(res.data.data.data);
      });
    }
  }, [looks]);

  return (
    <>
      {recommendedLooks && (
        <GoodGlammSlider dots="dots">
          {recommendedLooks?.flatMap((data: any) => {
            const image =
              data?.assets[0]?.type === "image" && data?.assets[0].imageUrl
                ? data.assets[0].imageUrl["400x400"]
                : DEFAULT_IMG_PATH();

            return (
              <div key={data.id}>
                <div
                  className="relative demo"
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "contain",
                    backgroundColor: "#FCEEEE",
                    backgroundRepeat: "no-repeat",
                    boxSizing: "border-box",
                    maxWidth: "100%",
                    height: "390px",
                    width: "100%",
                  }}
                >
                  <div
                    className="relative z-10"
                    style={{
                      top: "70%",
                    }}
                  >
                    <h2 className="text-xl font-semibold text-center uppercase tracking-widest text-white">
                      {data.cms[0]?.content?.name || data.urlManager.url.split("/")[2].split(".")[0]}
                    </h2>
                    {data?.cms[0]?.content?.shortDescription && (
                      <p className="text-white ml-3">
                        {data.cms[0]?.content.shortDescription?.replace(/\\/g, "")?.substring(0, 50)}
                        ...
                      </p>
                    )}
                    <div className="flex justify-center">
                      <Link
                        href={data.urlManager.url}
                        className="text-base text-center text-white font-semibold tracking-wider border-b border-white py-1 w-1/4"
                        aria-label={t("readMore")}
                      >
                        {t("readMore")}
                      </Link>
                    </div>
                  </div>
                  <div className="absolute bg-black right-0 top-0 bottom-0 left-0 opacity-50" />
                </div>
              </div>
            );
          })}
        </GoodGlammSlider>
      )}
    </>
  );
}

export default RecommendedLooks;
