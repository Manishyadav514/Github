import React from "react";
import Link from "next/link";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

import NextArrow from "../../../../../libs/UX/public/svg/next.svg";

const ModuleCarousel10 = ({ item, icid }: any) => {
  const widgetMeta = item?.meta?.widgetMeta ? JSON.parse(item?.meta?.widgetMeta) : "";

  return (
    <ErrorBoundary>
      <div
        className="w-full"
        style={{
          background: widgetMeta.bgColor || `url(${widgetMeta.bgImageUrl}) no-repeat`,
          backgroundSize: "100% 100%",
        }}
      >
        <div className="bestsellers px-6 py-8">
          <div>
            <div dir="ltr" className="overflow-x-auto mx-3 justify-between flex list-none">
              {item.commonDetails.descriptionData[0]?.value?.map((product: any, index: any) => (
                <React.Fragment key={product.id}>
                  <Link
                    href={
                      !icid
                        ? product.urlManager?.url
                        : `${product.urlManager?.url}?icid=${icid}_${product.cms[0]?.content.name.toLowerCase()}_${index + 1}`
                    }
                    role="presentation"
                    className="relative"
                    aria-label="carousel link"
                  >
                    <div className="flex justify-center mr-3 w-24 h-24">
                      <ImageComponent
                        src={product?.assets[0]?.imageUrl?.["400x400"]}
                        className="w-24 h-24 rounded-md !object-cover"
                      />
                    </div>
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center flex  justify-center items-center pb-4">
          <Link
            prefetch={false}
            href={widgetMeta?.ctaClick}
            className="text-white  uppercase flex  justify-center items-center rounded-3xl py-3  outline-none  px-6 w-44 text-11"
            style={{
              backgroundColor: widgetMeta?.btnBgColor,
              letterSpacing: "4px",
            }}
            aria-label={widgetMeta?.ctaName}
          >
            {widgetMeta?.ctaName}
            <NextArrow className="ml-auto  h-3" />
          </Link>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ModuleCarousel10;
