import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import MobileServiceDetailUI from "@libComponents/CommonBBC/Services/ServiceDetail/ServiceDetailUI";

import DesktopServiceDetailUI from "@libDesktop/Components/common/bbc/services/ServiceDetail/ServiceDetailUI";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";

import ErrorComponent from "@libPages/_error";

import BBCServiceDetail from "@libAPI/apis/BBCServiceDetail";

const ServiceDetail = ({ isError, serviceDetailResponse }: any) => {
  const router = useRouter();
  const [similarServices, setSimilarServices] = useState(null);
  const [reviews, setReviews] = useState<any>(null);

  const getReviews = async () => {
    try {
      const bbcServiceDetail = new BBCServiceDetail();
      const response = await bbcServiceDetail.getReviews(serviceDetailResponse.id);
      const reviewData = response?.data?.data?.data;
      const identifiers = response?.data?.data?.relationalData?.identifiers;
      const identifierKeys = Object.keys(identifiers);
      if (response) {
        response.data.data.data = reviewData?.map((review: any) => {
          if (identifierKeys?.includes(review?.identifier)) {
            return {
              ...review,
              authorDetails: identifiers[review?.identifier],
            };
          }
          return review;
        });
        setReviews(response.data.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      setReviews([]);
    }
  };

  const getSimilarServices = async () => {
    try {
      const bbcServiceDetail = new BBCServiceDetail();
      const response = await bbcServiceDetail.getSimilarServices(serviceDetailResponse?.subCatId?.[0] || "");

      const serviceResp = response?.data?.data?.data;
      const serviceCategories = response?.data?.data?.relationalData?.service_category;
      const serviceCategoriesKeys = Object.keys(serviceCategories);

      response.data.data.data = serviceResp?.map((service: any) => {
        const categories = service?.subCatId?.map((catId: any) => {
          if (serviceCategoriesKeys.includes(catId)) {
            const serviceCategoryData = serviceCategories[catId];

            return {
              ...serviceCategoryData,
              id: catId,
            };
          }
          return {};
        });
        return {
          ...service,
          categories,
        };
      });

      setSimilarServices(response.data.data);
    } catch (err) {}
  };

  useEffect(() => {
    getSimilarServices();
    getReviews();
  }, [serviceDetailResponse?.id]);

  if (isError) {
    return <ErrorComponent statusCode={404} />;
  }

  const getSEOTitle = () => {
    let resultStr =
      serviceDetailResponse?.meta_title ||
      serviceDetailResponse?.categories?.[0].defaultServiceMetaTitle ||
      serviceDetailResponse?.name;
    resultStr = resultStr?.replace(/\[NAME]/g, serviceDetailResponse?.name);
    resultStr = resultStr?.replace(/\[LOCALITY]/g, serviceDetailResponse?.location);
    resultStr = resultStr?.replace(/\[CITY]/g, serviceDetailResponse?.cityName);
    resultStr = resultStr?.replace(/\[CAT]/g, serviceDetailResponse?.categories?.[0]?.name);
    return resultStr;
  };
  const getSEODescription = () => {
    let resultStr =
      serviceDetailResponse?.meta_description ||
      serviceDetailResponse?.categories?.[0].defaultServiceMetaDescription ||
      serviceDetailResponse?.about;
    resultStr = resultStr?.replace(/\[NAME]/g, serviceDetailResponse?.name);
    resultStr = resultStr?.replace(/\[LOCALITY]/g, serviceDetailResponse?.location);
    resultStr = resultStr?.replace(/\[CITY]/g, serviceDetailResponse?.cityName);
    resultStr = resultStr?.replace(/\[CAT]/g, serviceDetailResponse?.categories?.[0]?.name);
    return resultStr;
  };

  return (
    <main>
      <Head>
        <title>{getSEOTitle()}</title>
        <meta name="title" key="title" content={getSEOTitle()} />
        <meta property="og:title" key="og:title" content={getSEOTitle()} />
        <meta name="description" key="description" content={getSEODescription()} />
        <meta property="og:description" key="og:description" content={getSEODescription()} />
        {serviceDetailResponse?.keyword ? (
          <meta name="keywords" key="keywords" content={serviceDetailResponse?.keyword} />
        ) : null}
      </Head>
      {IS_DESKTOP ? (
        <DesktopServiceDetailUI
          serviceDetails={serviceDetailResponse || null}
          firstquerySlug={router?.query?.slug?.[0]}
          reviews={reviews}
          similarServices={similarServices}
        />
      ) : (
        <MobileServiceDetailUI
          serviceDetails={serviceDetailResponse || null}
          firstquerySlug={router?.query?.slug?.[0]}
          reviews={reviews}
          similarServices={similarServices}
        />
      )}
    </main>
  );
};

export default ServiceDetail;
