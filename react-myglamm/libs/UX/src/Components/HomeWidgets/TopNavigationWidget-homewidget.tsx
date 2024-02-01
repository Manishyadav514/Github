import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { urlJoin } from "@libUtils/urlJoin";
import { useSplit } from "@libHooks/useSplit";
import Image from "next/legacy/image";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

const BannerWidget = dynamic(/* webpackChunkName: "BannerWidget" */ () => import("@libComponents/BannerWidget"), {
  ssr: false,
});

const TopNavigationWidget = ({ item, icid, size }: any) => {
  
  const [showWidget, setShowWidget] = useState<boolean | undefined>();
  const [bannerDetails, setBannerDetails] = useState<{ slug: string; header: string }>({ slug: "", header: "" });

  const { bannerWidgetIdTopNav } = useSplit({ experimentsList: [{ id: "bannerWidgetIdTopNav" }], deps: [] }) || {};

  if (item.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="w-full pl-4 py-3 overflow-x-auto flex">
        {item?.multimediaDetails
          ?.sort((a: any, b: any) => a.position - b.position)
          .map((multimedia: any, index: any) => (
            <Link
              href={
                !icid
                  ? `${multimedia.url}`
                  : `${urlJoin(multimedia.url)}icid=${icid}_${multimedia.headerText.toLowerCase()}_${index + 1}`
              }
              key={multimedia.assetDetails.url}
              prefetch={false}
              role="presentation"
              className="flex-sliderChild mr-3 text-center"
              aria-label={multimedia.sliderText}
              onClick={e => {
                if (bannerWidgetIdTopNav === "1") {
                  e.preventDefault();
                  setBannerDetails({
                    slug: multimedia?.targetLink,
                    header: multimedia?.headerText,
                  });
                  setShowWidget(true);
                }
              }}
            >
              <Image
                className="w-full h-full"
                src={multimedia.assetDetails.url}
                alt={multimedia.imageAltTitle || multimedia.sliderText || multimedia.assetDetails.name}
                height={55}
                width={55}
              />
              <p className="text-center text-xxs text-gray-500">{multimedia.sliderText}</p>
            </Link>
          ))}
      </div>
      {typeof showWidget === "boolean" && bannerDetails?.slug && (
        <BannerWidget icid={icid} showWidget={showWidget} bannerDetails={bannerDetails} setShowWidget={setShowWidget} />
      )}
    </ErrorBoundary>
  );
};

export default TopNavigationWidget;
