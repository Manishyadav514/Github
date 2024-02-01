import React from "react";

import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import GlammStudioHead from "@libComponents/Blogs/GlammStudioHead";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import { SHOP } from "@libConstants/SHOP.constant";

import { getGlammStudioInitialProps } from "@libUtils/glammStudioUtils";

import MultipleBannerCarousel from "../../Components/home/MultipleBannerCarousel";

const Glammstudio = ({ widgets }: { widgets: any }) => {
  const { t } = useTranslation();

  const headBanner = widgets?.find((x: any) => x.label === "Banner");
  const widgetData = widgets?.filter((x: any) => x.label !== "Banner" && x.label !== "Mobile-banner");

  return (
    <main className="bg-white">
      <GlammStudioHead />

      {headBanner?.multimediaDetails.length > 0 && <MultipleBannerCarousel data={headBanner} />}

      <section className="max-w-screen-xl px-16 mx-auto">
        {widgetData?.map((data: any) => {
          const sliderData = data.commonDetails.descriptionData[0]?.value;

          if (sliderData?.length) {
            return (
              <figure className="px-8">
                <div className="px-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-300 text-lg tracking-widest">
                    <h3 className="font-bold uppercase">{data.commonDetails.title}</h3>

                    <Link
                      className="hover:text-themeGolden"
                      href={`${SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}/${data.label?.toLowerCase()}`}
                    >
                      {t("viewAll")}
                    </Link>
                  </div>
                </div>

                <GoodGlammSlider slidesPerView={3} arrowClass={{ left: "-left-16", right: "-right-16" }}>
                  {sliderData.map((slide: any) => (
                    <Link href={slide.urlManager.url} className="p-3">
                      <ImageComponent
                        alt={slide?.cms?.[0]?.content?.name}
                        className="w-full mx-auto max-h-48"
                        style={{ boxShadow: "0 8px 11px 0 rgba(0,0,0,.3)" }}
                        src={slide?.assets?.[0]?.properties.thumbnailUrl || slide?.assets?.[0]?.imageUrl["768x432"]}
                      />

                      <figcaption className="py-5">{slide?.cms?.[0]?.content?.name}</figcaption>
                    </Link>
                  ))}
                </GoodGlammSlider>
              </figure>
            );
          }

          return null;
        })}
      </section>
    </main>
  );
};

Glammstudio.getInitialProps = getGlammStudioInitialProps;

export default Glammstudio;
