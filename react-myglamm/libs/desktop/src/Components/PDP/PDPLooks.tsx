import React, { useEffect, useState } from "react";
import Link from "next/link";

import { getLooksData } from "@productLib/pdp/HelperFunc";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import useTranslation from "@libHooks/useTranslation";

import { getImage } from "@libUtils/homeUtils";

const PDPLooks = ({ productId }: { productId: string }) => {
  const { t } = useTranslation();

  const [looksData, setLooksData] = useState<any[]>([]);

  useEffect(() => {
    getLooksData(productId).then(data => setLooksData(data));
  }, [productId]);

  if (looksData?.length > 0) {
    return (
      <section>
        <h2 className="font-bold text-3xl text-center pb-6 pt-8 capitalize">{t("getTheLook") || "Get the Look"}</h2>

        <GoodGlammSlider slidesPerView={3}>
          {looksData.map(look => (
            <Link href={look.urlManager.url} prefetch={false} className="hover:text-themeGolden text-white">
              <figure className="relative w-max mx-auto">
                <ImageComponent
                  width={331}
                  height={331}
                  className="rounded-sm"
                  src={getImage(look, "400x400")}
                  alt={look.assets?.[0].properties?.imageAltTag || "look"}
                />
                <figcaption className="uppercase tracking-wider font-bold text-18 absolute bottom-4 inset-x-0 mx-auto text-center">
                  {look.cms?.[0]?.content?.name}
                </figcaption>
              </figure>
            </Link>
          ))}
        </GoodGlammSlider>
      </section>
    );
  }

  return null;
};

export default PDPLooks;
