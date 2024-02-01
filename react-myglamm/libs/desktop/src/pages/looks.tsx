import React, { useEffect, useState } from "react";

import LooksHead from "@libComponents/Looks/LooksHead";

import { getImage } from "@libUtils/homeUtils";
import { check_webp_feature } from "@libUtils/webp";
import { getLooksInitialProps } from "@libUtils/looksUtils";

import useTranslation from "@libHooks/useTranslation";

import { NextImage } from "@libComponents/NextImage";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import Breadcrumbs from "../Components/breadcrumb";
import { LOOKS_SHARE } from "../Constants/Looks.constant";
import RelatedLooks from "../Components/looks/RelatedLooks";
import LooksProductsList from "../Components/looks/LooksProductsList";
import { SHOP } from "@libConstants/SHOP.constant";

const Looks = ({ looks }: { looks: any }) => {
  const { t } = useTranslation();

  const [looksData] = looks?.data;
  const looksContent = looksData?.cms?.[0]?.content;
  console.log({ looksData });

  const [disableImageComponent, setDisableImageComponent] = useState(false);

  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render
        setDisableImageComponent(true);
      }
    });
  }, []);

  return (
    <main className="bg-white">
      <LooksHead looks={looks} />

      <div className="max-w-screen-xl mx-auto px-16">
        <Breadcrumbs navData={looksData?.navigation} />

        <div className="flex justify-between px-4 py-6">
          <section className="w-2/5">
            {disableImageComponent ? (
              <ImageComponent src={getImage(looksData, "600x600")} width={450} height={450} className="rounded-sm" />
            ) : (
              <NextImage priority src={getImage(looksData, "600x600")} width={450} height={450} className="rounded-sm" />
            )}

            <ul className="list-none flex items-center py-3 pl-1">
              <li className="uppercase mr-3">{t("shareThisLook") || "share this look"}</li>
              <li className="mx-3 border-r border-black h-7" />
              {LOOKS_SHARE.map(share => (
                <li key={share.name} className="mx-3">
                  <a
                    target="_blank"
                    href={share.shareUrl
                      .replace("{name}", looksContent?.name)
                      .replace("{shortUrl}", looksData?.urlShortner?.shortUrl)
                      .replace("{shortDescription}", looksContent.shortDescription)
                      .replace("{image}", getImage(looksData, "400x400") || SHOP.LOGO)}
                  >
                    <img src={share.icon} width={22} />
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="uppercase py-5 text-4xl pr-6">{looksContent.name}</h2>

            <p className="text-18 text-gray-500 pr-6">{looksContent.shortDescription}</p>
          </section>

          <LooksProductsList products={looks?.relationalData?.products && Object.values(looks.relationalData.products)} />
        </div>
      </div>

      <RelatedLooks looksData={looksData} />
    </main>
  );
};

Looks.getInitialProps = getLooksInitialProps;

export default Looks;
