import React, { useEffect, useState } from "react";

import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { getImage } from "@libUtils/homeUtils";

const RelatedLooks = ({ looksData }: { looksData: any }) => {
  const { t } = useTranslation();

  const [recommendedLooks, setRecommendedLooks] = useState<any>();

  useEffect(() => {
    const widgetApi = new WidgetAPI();
    widgetApi.getRecommendedLooks(looksData.id, looksData.categoryId).then(({ data: res }) => {
      setRecommendedLooks(res?.data?.data?.slice(0, 5));
    });
  }, []);

  if (recommendedLooks?.length > 0) {
    return (
      <section className="bg-themeGray w-full py-6">
        <h2 className="mb-4 uppercase text-2xl text-center">{t("looksYouCanTry") || "looks you can try"}</h2>

        <div className="mx-auto max-w-screen-xl px-16 flex">
          {recommendedLooks.map((look: any) => (
            <Link href={look.urlManager.url} className="w-1/5 px-5 hover:text-themeGolden">
              <ImageComponent src={getImage(look, "200x200")} className="rounded-sm" />

              <p className="pt-3 text-center px-4">{look?.cms?.[0]?.content?.name}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return null;
};

export default RelatedLooks;
