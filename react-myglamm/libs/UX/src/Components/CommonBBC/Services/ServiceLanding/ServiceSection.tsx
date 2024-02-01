import React from "react";
import Image from "next/legacy/image";
import Link from "next/link";

import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const ServiceCards = ({ service, relationalData }) => {
  const subCatId = service?.subCatId?.[0];
  const isWithCity = (service?.slug?.match(/\//g) || []).length > 1 ? true : false;
  return (
    <Link
      href={isWithCity ? service?.slug : `/online/${service?.slug}`}
      className="hover:shadow-xl shadow-md"
      aria-label={service?.name}
    >
      <div className="bg-white p-3 hover:shadow-xl shadow-md">
        <span>
          <h2 className="font-medium ">{service?.name}</h2>
        </span>
        <p className="text-sm text-cyan-400">
          Online{service?.location || service?.cityName ? `, Delivers in ${service?.location}` || `${service?.cityName}` : ""}
        </p>
        <div className="image-wrapper grid grid-cols-3 grid-flow-col gap-4 mt-4">
          {service?.images?.slice(0, 3).map((i, index) => {
            return (
              <div className="relative">
                <div className="relative">
                  <img alt="service" src={i || DEFAULT_IMG_PATH} width={106} height={72} className="object-contain" />
                  {index === 2 && (
                    <div className="absolute top-0 left-0 bg-black opacity-70">
                      <Image
                        alt={service?.name}
                        src="https://files.babychakra.com/site-images/original/transparent-img-ratio-3-2-v1.png"
                        objectFit="contain"
                        width={106}
                        height={72}
                        layout="fixed"
                      />
                    </div>
                  )}
                </div>

                {index === 2 && (
                  <div className="absolute text-white font-medium inset-x-5 inset-y-6 left text-xs">
                    +{service?.images.length - 3} photos
                  </div>
                )}
              </div>
            );
          })}
          {service?.images === undefined && (
            <div className="relative">
              <div className="relative">
                <div className=" bg-black opacity-70">
                  <Image
                    alt={service?.name}
                    src="https://files.babychakra.com/site-images/original/transparent-img-ratio-3-2-v1.png"
                    objectFit="contain"
                    width={106}
                    height={72}
                    layout="fixed"
                  />
                </div>
              </div>

              <div className="absolute text-white font-medium inset-x-5 inset-y-6 left text-xs">Coming Soon</div>
            </div>
          )}
        </div>
        <h3 className="font-medium ">{relationalData?.service_category?.[subCatId]?.name}</h3>
        <p className="text-gray-500 text-right my-1">{`${service?.reviewCount ?? "0"}  Reviews`}</p>
        <hr className="pb-2 mt-2" />
        <div className="text-right">
          <button className="bg-color1 py-2 px-6 rounded-lg text-white font-bold ">See More</button>
        </div>
      </div>
    </Link>
  );
};

const ServiceSection = ({ services, relationalData }) => {
  return (
    <div className="flex flex-col space-y-4">
      {services?.map(service => {
        return <ServiceCards service={service} relationalData={relationalData} />;
      })}
    </div>
  );
};

export default ServiceSection;
