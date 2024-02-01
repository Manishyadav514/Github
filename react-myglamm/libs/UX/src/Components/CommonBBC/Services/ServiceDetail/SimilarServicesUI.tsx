import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const SimilarServicesCard = ({ service, firstquerySlug }: any) => {
  const router = useRouter();
  return (
    <div
      className="bg-white rounded-sm p-3 mt-3 border-solid border border-gray-200"
      onClick={() => {
        router.push(service.slug);
      }}
    >
      <div className="flex p-0 mb-2">
        {service?.images?.length ? (
          <img
            className="w-[90px] h-[60px] inline-block bg-contain bg-center bg-no-repeat "
            src={service?.images?.[0] ? service.images[0] : "/svg/profile-placeholder.svg"}
            alt=""
          />
        ) : null}

        <div
          className="ml-3"
          style={{
            width: "calc(100% - 120px)",
          }}
        >
          <p className="font-semibold text-gray-500 text-sm line-clamp-1">{service.name}</p>
          <p className="text-gray-500 text-xs mt-1">
            {service.location}, {service.cityName}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            <span>{service.reviewCount || 0} Reviews</span>
            {/* <span>&nbsp;|&nbsp;</span>
            <span>{service.recommendationCount || 0} Recommends</span> */}
          </p>
        </div>
      </div>
      <div className="mx-3 mb-3">
        {service?.categories?.map((category: any) => (
          <div
            onClick={e => {
              e.stopPropagation();
              router.push(`/${firstquerySlug}/${category.slug}`);
            }}
          >
            <span className="text-gray-500 text-xs bg-white text-center mr-2 border-0 border-b-[1px] border-dashed border-gray-300 cursor-pointer">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
const SimilarServicesUI = ({ similarServices, firstquerySlug }: any) => {
  if (!similarServices?.data?.length) {
    return null;
  }
  return (
    <div className="bg-white border-solid border border-gray-100 border-t-0 mx-3">
      <div className="mt-5 p-4">
        <h3 className="text-base mb-3 text-gray-500 font-normal">Similar Services</h3>
        {similarServices?.data?.map((service: any) => (
          <SimilarServicesCard service={service} firstquerySlug={firstquerySlug} />
        ))}
      </div>
    </div>
  );
};

export default SimilarServicesUI;
