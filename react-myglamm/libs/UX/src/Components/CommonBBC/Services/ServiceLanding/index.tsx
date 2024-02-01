import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/legacy/image";

import ServiceSection from "@libComponents/CommonBBC/Services/ServiceLanding/ServiceSection";
import CommonPagination from "@libComponents/CommonBBC/CommonPagination";
import BreadCrumb from "@libComponents/CommonBBC/BreadCrumb";
import AdSlots from "@libComponents/CommonBBC/ads/AdSlots";

import BBCServiceApi from "@libAPI/apis/BBCServiceAPI";

import { generateBreadCrumbSchema, makeBreadCrumbSchemaList } from "@libUtils/seoHelper";

import { HOME_ATF, HOME_BTF } from "@libConstants/AdsConstants";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import Custom404 from "@libPages/_error";

//  -> Handle Category
//  -> SEO Data

const ServiceLandingPage = ({ serviceList, pageNo, pageType, isError, seoData, categoryData }: any) => {
  const router = useRouter();
  const [typeOfPage, setPageType] = useState(pageType);
  const [services, setServices] = useState(serviceList || []);
  const [subCategorySlug, setSubCategorySlug] = useState(router.asPath.split("/")[2]?.split("?")?.[0]?.split("-services")[0]);
  const parentCatId = categoryData?.data?.[0]?.parentCategoryId;
  const parentCat = categoryData?.relationalData?.category?.[parentCatId];
  const locationSlug = router.asPath.split("/")[1] === "navimumbai" ? "navi-mumbai" : router.asPath.split("/")[1];

  const breadCrumbList =
    typeOfPage === "service" ? [{ to: "/", label: "Home", schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}` }] : [];

  if (parentCat && typeOfPage === "service") {
    breadCrumbList?.push({
      to: `/${router.asPath.split("/")[1]}/${parentCat?.slug}`,
      label: parentCat?.name,
      schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/${locationSlug}/${parentCat?.slug}`,
    });
  }
  typeOfPage === "service" &&
    subCategorySlug.includes("-in-") &&
    breadCrumbList?.push({
      to: `/${router.asPath.split("/")[1]}/${categoryData?.data?.[0]?.slug}`,
      label: categoryData?.data?.[0]?.name,
      schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/${locationSlug}/${categoryData?.data?.[0]?.slug}`,
    });

  const getServiceList = async () => {
    const bbcServiceApi = new BBCServiceApi();
    const filter2 = {
      where: {
        slug: subCategorySlug === "online-maternity-childcare" ? `${subCategorySlug}-services` : subCategorySlug,
      },
      relationalEntity: ["parentcategory"],
    };
    const filter = {
      where: {
        subCatSlug: subCategorySlug?.split("-in-")[0],
        ...(locationSlug !== "online" && { cityName: locationSlug }),
        // ...(subCategorySlug?.includes("-in-") && { location: subCategorySlug?.split("-in-")[1] }),
      },
      relationalEntity: ["service_category"],
    };
    try {
      const categoryResponse = await bbcServiceApi.getCategoryService(10, 0, filter2);
      if (categoryResponse?.data?.data?.data?.[0]) {
        if ("parentCategoryId" in categoryResponse?.data?.data?.data?.[0]) {
          const serviceResponse = await bbcServiceApi.getServices(10, (pageNo - 1) * 10, filter);
          serviceList = serviceResponse.data;
          setPageType("service");
          setServices(serviceList);
        } else {
          const parentFilter = {
            where: {
              parentCatSlug: subCategorySlug?.split("-in-")[0],
              ...(locationSlug !== "online" && { cityName: locationSlug }),
              ...(subCategorySlug?.includes("-in-") && { location: subCategorySlug?.split("-in-")[1] }),
            },
            relationalEntity: ["service_category"],
          };
          const serviceResponse = await bbcServiceApi.getServices(10, (pageNo - 1) * 10, parentFilter);
          serviceList = serviceResponse.data;
          setPageType("category");
          setServices(serviceList);
        }
      } else {
        const serviceResponse = await bbcServiceApi.getServices(10, (pageNo - 1) * 10, filter);
        serviceList = serviceResponse.data;
        setPageType("service");
        setServices(serviceList);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const itemListElement = typeOfPage === "service" && makeBreadCrumbSchemaList(breadCrumbList);

  const breadcrumbSchema =
    typeOfPage === "service" &&
    generateBreadCrumbSchema(itemListElement, {
      name: `${categoryData?.data?.[0]?.name} ${
        subCategorySlug.includes("-in-") ? subCategorySlug.split("-in-")[1].replace("-", " ") : ""
      }`,
      url: `${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}/${locationSlug}/${subCategorySlug}`,
    });

  useEffect(() => {
    if (router.asPath.split("/")[2]?.split("?")?.[0] !== subCategorySlug) {
      setSubCategorySlug(router.asPath.split("/")[2]?.split("?")?.[0]?.split("-services")?.[0]);
    }
  }, [router.asPath]);

  useEffect(() => {
    if (!router.asPath.includes("H9BCMSpId")) {
      getServiceList();
    }
  }, [pageNo, subCategorySlug]);

  if (
    isError ||
    typeOfPage === undefined ||
    ((typeOfPage === "category" || typeOfPage === "service") && services?.data?.data?.length === 0)
  ) {
    return <Custom404 />;
  }

  if (pageType === "service-detail") {
    return <div>service detail page</div>;
  }

  return (
    <main>
      <Head>
        <title>{`${seoData?.title}  ${pageNo > 1 ? `| Page ${pageNo}` : ""}`}</title>
        <meta
          name="description"
          key="description"
          content={`${seoData?.description} ${pageNo > 1 ? `| Page ${pageNo}` : ""}`}
        />
        <meta name="title" content={`${seoData?.title}  ${pageNo > 1 ? `| Page ${pageNo}` : ""}`} />
        <meta property="og:title" key="og:title" content={`${seoData?.title}  ${pageNo > 1 ? `| Page ${pageNo}` : ""}`} />
        <meta
          property="og:description"
          key="og:description"
          content={`${seoData?.description} ${pageNo > 1 ? `| Page ${pageNo}` : ""}`}
        />
        {typeOfPage === "service" && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        )}
        {pageNo === 1 ? (
          <link rel="canonical" href={`${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}${router.asPath.split("?")[0]}`} />
        ) : (
          <link rel="canonical" href={`${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}${router.asPath}`} />
        )}
        {pageNo > 1 && (
          <link
            rel="prev"
            href={`${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}${router.asPath.split("?")[0]}${pageNo > 2 ? `?page=${pageNo - 1}` : ""}`}
          />
        )}
        {pageNo < services.data.count / 10 && (
          <link rel="next" href={`${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}${router.asPath.split("?")[0]}?page=${pageNo + 1}`} />
        )}
      </Head>
      {typeOfPage === "category" && (
        <div>
          <Image
            alt="banner-service"
            src="https://files.babychakra.com/site-images/original/mweb-doctor-image.png"
            width="720"
            height="850"
            className=""
            layout="responsive"
            objectFit="cover"
          />
        </div>
      )}
      <div className="px-4 py-4">
        {typeOfPage === "service" && (
          <BreadCrumb
            breadCrumbList={breadCrumbList}
            currentPath={`${categoryData?.data?.[0]?.name} ${
              subCategorySlug.includes("-in-") ? subCategorySlug.split("-in-")?.[1].replace("-", " ") : ""
            }`}
            customClassname=" py-1  mx-auto mb-3"
          />
        )}

        <div>
          <h1 className="text-xl font-medium mb-3">
            {typeOfPage === "service"
              ? categoryData?.data?.[0]?.name || ""
              : services?.data?.relationalData?.parent_category
              ? /* @ts-ignore */
                Object.values(services?.data?.relationalData?.parent_category)?.[0]?.name
              : ""}
          </h1>
        </div>

        <AdSlots id="div-gpt-ad-service-atf" className="my-4 mx-auto md:hidden" adSlotData={HOME_ATF} />
        <ServiceSection services={services?.data?.data} relationalData={services?.relationalData} />
        {services?.data?.count > 0 ? (
          <CommonPagination totalItems={services?.data?.count || 10} pageNo={pageNo} noOfSlots={5} pageTitle="services" />
        ) : (
          <span />
        )}
        <AdSlots id="div-gpt-ad-service-btf" className="my-4 mx-auto md:hidden" adSlotData={HOME_BTF} />
      </div>
      {typeOfPage === "category" && (
        <div>
          <div className="px-4">
            <Image
              alt="banner-service"
              src=" https://files.babychakra.com/site-images/original/mweb-why-bbc-img.png"
              width="636"
              height="1282"
              className=""
              layout="responsive"
              objectFit="cover"
            />
          </div>
          <div className="py-4">
            <Image
              alt="banner-service"
              src="https://files.babychakra.com/site-images/original/mweb-bbc-app-download.png"
              width="720"
              height="950"
              layout="responsive"
              objectFit="cover"
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default ServiceLandingPage;
