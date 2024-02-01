import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSelector } from "@libHooks/useValtioSelector";
import { useRouter } from "next/router";
import Head from "next/head";

import { ValtioStore } from "@typesLib/ValtioStore";

import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";
import PopupModal from "@libComponents/PopupModal/PopupModal";

import Reviews from "@libComponents/CommonBBC/Services/ServiceDetail/Reviews";
import SimilarServicesUI from "@libComponents/CommonBBC/Services/ServiceDetail/SimilarServicesUI";
import { generateBreadCrumbSchema, makeBreadCrumbSchemaList } from "@libUtils/seoHelper";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const BBCSharePlatforms = dynamic(() => import("@libComponents/Common/BBCSharePlatforms"), {
  ssr: false,
});

const ServiceDetailUI = ({ serviceDetails, firstquerySlug, reviews, similarServices }: any) => {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [showShareModal, setShowShareModal] = React.useState(false);
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));
  const [shareContent, setShareContent] = React.useState({
    url: "",
    message: "",
  });
  const router = useRouter();

  let referenceCode = "";
  if (userProfile) {
    referenceCode = `?rc=${userProfile.referenceCode}`;
    if (userProfile.memberType?.typeName === "influencer") {
      referenceCode = referenceCode.concat("&utm_term=INF");
    }
  }
  if (!serviceDetails) {
    return null;
  }

  const breadcrumbSchema = generateBreadCrumbSchema(makeBreadCrumbSchemaList(serviceDetails?.breadCrumbData), {
    name: serviceDetails.name,
    url: `${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}/${router.asPath}`,
  });

  return (
    <div>
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </Head>
      <div className="relative">
        <GoodGlammSlider slidesPerView={1} dots="dots">
          {serviceDetails?.images?.map((img: any) => (
            <div
              style={{
                backgroundColor: "rgba(0,0,0,.1);",
              }}
            >
              <img src={img} alt="" className="mt-3 w-full h-60 object-contain" />
            </div>
          ))}
        </GoodGlammSlider>
      </div>
      <div className="bg-white border-solid border border-gray-200 border-b-0 m-2 p-2">
        <div className="text-gray-900 text-center">
          {serviceDetails?.name}
          {serviceDetails?.verified ? (
            <span
              className="ml-2 w-[15px] h-[15px] inline-block text-lg align-middle cursor-pointer bg-no-repeat bg-cover"
              style={{
                backgroundImage: "url(https://files.babychakra.com/site-images/original/verified.png)",
              }}
            ></span>
          ) : null}
          <div
            className="inline-block w-[20px] h-[20px] bg-cover ml-2 align-middle bg-no-repeat"
            style={{
              backgroundImage: "url(https://files.babychakra.com/site-images/original/share.png) ",
            }}
            onClick={() => {
              setShowShareModal(true);
              const url = `${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}/${router.asPath}`.replace("#modal", "");
              setShareContent({
                url,
                message: "Checkout this link " + url,
              });
            }}
          />
        </div>

        <p className="text-center text-gray-500 text-sm my-2">
          {serviceDetails?.onlineFlag ? "Online" : "Offline"}, {serviceDetails.cityName}
        </p>
        <div className="flex justify-center  mt-2">
          <p className="text-center mr-3 text-gray-500">
            {serviceDetails?.reviewCount || 0}
            <br /> Reviews
          </p>
          {/* <p className="text-center text-gray-500">
            {serviceDetails?.recommendationCount || 0}
            <br /> Recommends
          </p> */}
        </div>
        <div className="mt-3 text-center">
          {serviceDetails?.categories?.map((category: any) => (
            <Link href={`/${firstquerySlug}/${category.slug}`} legacyBehavior aria-label={category.name}>
              <p className="inline-block text-gray-500 border-0 border-b-[1px] border-dashed border-gray-300 mr-3 mb-2 text-xs">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
      <div
        className=" mb-5 bg-white flex h-[48px] justify-center"
        style={{
          boxShadow: "0 1px 1px 0 rgb(0 0 0 / 15%)",
        }}
      >
        <div className="bbc items-center cursor-pointer flex relative mr-5" onClick={() => setActiveTab("overview")}>
          <p
            className={activeTab === "overview" ? `text-sm font-semibold !text-[#000]` : `text-sm font-semibold text-[#b2b2b2]`}
          >
            Overview
          </p>
          <div
            className={
              activeTab === "overview"
                ? ` bottom-[1px] h-[3px] absolute w-full bg-transparent !bg-color1`
                : `bottom-[1px] h-[3px] absolute w-full bg-transparent`
            }
          />
        </div>
        <div className="bbc items-center cursor-pointer flex relative" onClick={() => setActiveTab("review")}>
          <p
            className={activeTab === "review" ? `text-sm font-semibold !text-[#000]` : ` text-sm font-semibold text-[#b2b2b2]`}
          >
            Reviews
          </p>
          <div
            className={
              activeTab === "review"
                ? ` bottom-[1px] h-[3px] absolute w-full bg-transparent !bg-color1`
                : `bottom-[1px] h-[3px] absolute w-full bg-transparent`
            }
          />
        </div>
      </div>
      {activeTab === "overview" ? (
        <>
          <div className="bg-white border-solid border border-gray-200 border-b-0 m-2 p-2 about-service-content">
            <div className="mb-4">
              <p className="text-sm mb-2">About {serviceDetails?.name}</p>
              {serviceDetails?.about ? (
                <div className="text-gray-500" dangerouslySetInnerHTML={{ __html: serviceDetails?.about }} />
              ) : null}
            </div>
            <div className="mb-4">
              <p className="text-sm mb-2">Address</p>
              <div>
                <p className="text-gray-500 text-sm">{serviceDetails.addressHouseNumber}</p>
                <p className="text-gray-500 text-sm">{serviceDetails.addressStreetName}</p>
                <p className="text-gray-500 text-sm">{serviceDetails.cityName}</p>
                <p className="text-gray-500 text-sm">Pincode: {serviceDetails.pincode}</p>
              </div>
            </div>
            <div>
              <p className="text-sm">Business hours</p>
              {serviceDetails.businessDays?.map((businessDaysData: any) => (
                <div className="mt-2 ">
                  <p className="day text-sm inline-block text-gray-500 capitalize w-[80px]">{businessDaysData.day}</p>
                  <p className="day-time text-sm inline-block text-gray-500 ml-4">
                    {businessDaysData.startTime} - {businessDaysData.endTime}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <SimilarServicesUI similarServices={similarServices} firstquerySlug={firstquerySlug} />
          <Reviews reviews={reviews} serviceDetails={serviceDetails || null} />
        </>
      ) : null}
      {activeTab === "review" ? <Reviews reviews={reviews} serviceDetails={serviceDetails || null} /> : null}
      <PopupModal
        show={showShareModal}
        onRequestClose={() => {
          setShowShareModal(prevState => !prevState);
        }}
      >
        <BBCSharePlatforms referenceCode={referenceCode} shareContent={shareContent} />
      </PopupModal>
    </div>
  );
};

export default ServiceDetailUI;
