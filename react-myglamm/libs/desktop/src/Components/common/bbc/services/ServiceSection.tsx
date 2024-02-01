import React from "react";
import Image from "next/image";
import Link from "next/link";

const ServiceCards = ({ service, relationalData }: any) => {
  const subCatId = service?.subCatId?.[0];
  const isWithCity = (service?.slug?.match(/\//g) || []).length > 1;
  return (
    <Link href={isWithCity ? service?.slug : `/online/${service?.slug}`} legacyBehavior>
      <a className="hover:shadow-xl shadow-md">
        <div className="bg-white p-3 ">
          <span>
            <h2 className="font-medium text-base m-0 h-12">{service?.name}</h2>
          </span>
          <p className="text-sm text-cyan-400">
            Online{service?.location || service?.cityName ? `, Delivers in ${service?.location}` || `${service?.cityName}` : ""}
          </p>
          <div className="image-wrapper grid grid-cols-3 grid-flow-col gap-4 mt-4">
            {service?.images?.slice(0, 3).map((i: any, index: number) => {
              return (
                <div className="relative">
                  <div className="relative">
                    <img
                      alt="service"
                      src={i}
                      className="object-contain"
                      style={{
                        width: "206px",
                        height: "172px",
                        objectFit: "contain",
                      }}
                    />
                    {index === 2 && (
                      <div className="absolute top-0 left-0 bg-black opacity-70">
                        <img
                          alt={service?.name}
                          src=" https://files.babychakra.com/site-images/original/transparent-img-ratio-3-2-v1.png"
                          style={{
                            width: "106px",
                            height: "72px",
                            objectFit: "contain",
                          }}
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
                    <img
                      alt={service?.name}
                      src="https://files.babychakra.com/site-images/original/transparent-img-ratio-3-2-v1.png"
                      style={{
                        width: "172px",
                        height: "172px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </div>

                <div className="absolute text-white font-medium inset-x-5 inset-y-6 left text-xs top-1/2 -translate-y-1/2">
                  Coming Soon
                </div>
              </div>
            )}
          </div>
          <h3 className="font-medium ">{relationalData?.service_category?.[subCatId]?.name}</h3>
          <p className="text-gray-500 text-right my-1 text-xs">{`${service?.reviewCount ?? "0"}  Reviews`}</p>
          <hr className=" mt-2" />
          <div className="text-right">
            <button className="bg-color1 py-2 px-6 rounded-lg text-white font-bold ">See More</button>
          </div>
        </div>
      </a>
    </Link>
  );
};

const ServiceSection = ({ services, relationalData }: any) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {services?.map((service: any) => {
        return <ServiceCards service={service} relationalData={relationalData} />;
      })}
    </div>
  );
};

export default ServiceSection;
