import { getVendorCode } from "@libUtils/getAPIParams";

import BBCServiceDetail from "@libAPI/apis/BBCServiceDetail";
import BBCServiceApi from "@libAPI/apis/BBCServiceAPI";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

type pageTypes = "category" | "service" | "service-detail" | "amp";

export const serviceGetInitialProps = async (ctx: any) => {
  if (getVendorCode() === "bbc") {
    const pageNo = parseInt(ctx?.query?.page, 10) || 1;
    const locationSlug = ctx?.query.slug[0] === "navimumbai" ? "navi-mumbai" : ctx?.query.slug[0];
    // const isValidCity = validServicePageLocations.includes(locationSlug);
    let seoData = {};
    let serviceList, pageType: pageTypes;
    const serviceSeoFilterChildLevel = (data: string, subCategorySlug: any) => {
      return data
        ?.replace(/\[LOCALITY]/g, subCategorySlug.split("-in-")[1])
        ?.replace(/\[CITY]/g, locationSlug !== "online" ? locationSlug : "mumbai")
        .split("-")
        .join(" ");
    };
    const serviceSeoFilterParentLevel = (data: string) => {
      return data
        ?.replace(/\[LOCALITY],/g, locationSlug !== "online" ? locationSlug : "mumbai")
        ?.replace(/\[CITY]/g, "")
        ?.replace(/\[LOCALITY]/g, locationSlug !== "online" ? locationSlug : "mumbai")
        .split("-")
        .join(" ");
    };
    const setSeoData = (relationalData: any, categoryRes: any, subCategorySlug: any) => {
      if (relationalData)
        Object.values(relationalData).map(elem => {
          /* @ts-ignore */
          if (elem.slug === subCategorySlug.split("-in-")?.[0]) {
            if (subCategorySlug.includes("-in-")) {
              seoData = {
                title: serviceSeoFilterChildLevel(
                  (elem as any)?.locMetaTitle || categoryRes?.data?.data?.data?.[0]?.metaTitle,
                  subCategorySlug
                ),
                description: serviceSeoFilterChildLevel(
                  (elem as any)?.locMetaDescription || categoryRes?.data?.data?.data?.[0]?.locMetaDescription,
                  subCategorySlug
                ),
              };
            } else {
              seoData = {
                title: serviceSeoFilterParentLevel(
                  (elem as any)?.locMetaTitle || categoryRes?.data?.data?.data?.[0]?.metaTitle
                ),
                description: serviceSeoFilterParentLevel(
                  (elem as any)?.locMetaDescription || categoryRes?.data?.data?.data?.[0]?.locMetaDescription
                ),
              };
            }
          }
        });
    };
    if (ctx?.query?.slug?.[1].includes("H9BCMSpId") && ctx?.query?.slug?.[2] && ctx?.query?.slug?.[2].includes("reviews")) {
      try {
        const bbcServiceDetail = new BBCServiceDetail();
        const slugForDetails = ctx?.asPath?.replace("/reviews", "");
        const response = await bbcServiceDetail.getServiceDetails({ slug: slugForDetails });
        if (response?.data?.data?.data?.[0]) {
          const serviceResp = response?.data?.data?.data?.[0];
          const serviceCategories = response?.data?.data?.relationalData?.service_category;
          const parentCategories = response?.data?.data?.relationalData?.parent_category;
          const serviceCategoriesKeys = serviceCategories ? Object.keys(serviceCategories) : [];
          const parentCategoriesKeys = parentCategories ? Object.keys(parentCategories) : [];
          const categories = serviceResp?.subCatId?.map((catId: any) => {
            if (serviceCategoriesKeys?.includes(catId)) {
              const serviceCategoryData = serviceCategories[catId];
              if (
                serviceCategoryData?.parentCategoryId &&
                parentCategoriesKeys?.includes(serviceCategoryData.parentCategoryId)
              ) {
                serviceCategoryData.parentCategoryData = {
                  ...parentCategories?.[serviceCategoryData?.parentCategoryId],
                  id: serviceCategoryData?.parentCategoryId,
                };
                delete serviceCategoryData?.["parentCategoryId"];
              }
              return {
                ...serviceCategoryData,
                id: catId,
              };
            }
            return {};
          });
          response.data.data.data[0].categories = categories;
          return {
            pageType: "service-reviews",
            isError: false,
            serviceDetailResponse: response.data.data.data[0],
          };
        }
        return {
          pageType: "service-reviews",
          isError: true,
          serviceDetailResponse: null,
        };
      } catch (err) {
        console.error("BBC Service reviews ", err);
        return {
          pageType: "service-reviews",
          isError: true,
          serviceDetailResponse: null,
        };
      }
    } else if (ctx?.query?.slug?.[1].includes("H9BCMSpId")) {
      // service details
      try {
        const bbcServiceDetail = new BBCServiceDetail();
        const response = await bbcServiceDetail.getServiceDetails({ slug: ctx.asPath?.split("?")?.[0] });
        if (response?.data?.data?.data?.[0]) {
          const serviceResp = response?.data?.data?.data?.[0];
          const serviceCategories = response?.data?.data?.relationalData?.service_category;
          const parentCategories = response?.data?.data?.relationalData?.parent_category;
          const serviceCategoriesKeys = serviceCategories ? Object.keys(serviceCategories) : [];
          const parentCategoriesKeys = parentCategories ? Object.keys(parentCategories) : [];
          const categories = serviceResp?.subCatId?.map((catId: any) => {
            if (serviceCategoriesKeys.includes(catId)) {
              const serviceCategoryData = serviceCategories[catId];
              if (
                serviceCategoryData?.parentCategoryId &&
                parentCategoriesKeys?.includes(serviceCategoryData.parentCategoryId)
              ) {
                serviceCategoryData.parentCategoryData = {
                  ...parentCategories[serviceCategoryData.parentCategoryId],
                  id: serviceCategoryData.parentCategoryId,
                };
                delete serviceCategoryData["parentCategoryId"];
              }
              return {
                ...serviceCategoryData,
                id: catId,
              };
            }
            return {};
          });
          response.data.data.data[0].categories = categories;
          const breadCrumbData = [];
          if (categories?.length) {
            breadCrumbData.unshift({
              to: `/${ctx.query.slug[0]}/${categories[0]?.slug}`,
              label: categories[0].name,
              schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/${ctx.query.slug[0]}/${categories[0]?.slug}`,
            });
            if (categories?.[0]?.parentCategoryData?.id) {
              breadCrumbData.unshift({
                to: `/${ctx.query.slug[0]}/${categories[0].parentCategoryData.slug}`,
                label: categories[0].parentCategoryData.name,
                schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/${ctx.query.slug[0]}/${categories[0].parentCategoryData.slug}`,
              });
            }
          }
          breadCrumbData.unshift({
            to: "/",
            label: "BabyChakra",
            schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}`,
          });
          response.data.data.data[0].breadCrumbData = breadCrumbData;
          return {
            pageType: "service-detail",
            isError: false,
            serviceDetailResponse: response.data.data.data[0],
          };
        }
        return {
          pageType: "service-detail",
          isError: true,
          serviceDetailResponse: null,
        };
      } catch (err) {
        console.error("BBC Service detail ", err);
        return {
          pageType: "service-detail",
          isError: true,
          serviceDetailResponse: null,
        };
      }
    } else {
      // service landing
      const subCategorySlug = ctx?.query?.slug[1]?.split("-services")?.[0];
      const bbcServiceApi = new BBCServiceApi();
      let categoryData;
      const filter2 = {
        where: {
          slug: subCategorySlug === "online-maternity-childcare" ? ctx?.query?.slug[1] : subCategorySlug,
        },
        relationalEntity: ["parentcategory"],
      };
      try {
        const filter = {
          where: {
            subCatSlug: subCategorySlug?.split("-in-")[0],
            ...(locationSlug !== "online" && { cityName: locationSlug }),
            // ...(subCategorySlug?.includes("-in-") && { location: subCategorySlug?.split("-in-")[1] }),
          },
          relationalEntity: ["service_category"],
        };
        const categoryResponse = await bbcServiceApi.getCategoryService(10, 0, filter2);
        categoryData = categoryResponse?.data.data
        if (categoryData.data?.data?.[0]) {
          if ("parentCategoryId" in categoryData?.data?.[0]) {
            const serviceResponse = await bbcServiceApi.getServices(10, (pageNo - 1) * 10, filter);
            serviceList = serviceResponse.data;
            pageType = "service";
            const serviceCat = serviceList.data.relationalData.service_category;
            setSeoData(serviceCat, categoryResponse, subCategorySlug);
          } else {
            const parentFilter = {
              where: {
                parentCatSlug: subCategorySlug?.split("-in-")[0],
                ...(locationSlug !== "online" && { cityName: locationSlug }),
                // ...(subCategorySlug?.includes("-in-") && { location: subCategorySlug?.split("-in-")[1] }),
              },
              relationalEntity: ["service_category"],
            };
            const serviceResponse = await bbcServiceApi.getServices(10, (pageNo - 1) * 10, parentFilter);
            serviceList = serviceResponse.data;
            pageType = "category";
            seoData = {
              title: `Book ${categoryResponse?.data?.data?.data?.[0]?.name} services on Babychakra ` || "",
              description:
                `Book ${categoryResponse?.data?.data?.data?.[0]?.name} services trusted by mother on Babychakra` || "",
            };
          }
        } else {
          const serviceResponse = await bbcServiceApi.getServices(10, (pageNo - 1) * 10, filter);
          serviceList = serviceResponse.data;
          pageType = "service";
          const serviceCat = serviceList.data.relationalData.service_category;
          setSeoData(serviceCat, categoryResponse, subCategorySlug);
        }
      } catch (error) {
        console.warn(error);
      }
      return {
        serviceList,
        pageNo,
        /* @ts-ignore */
        pageType,
        categoryData:categoryData,
        seoData,
        isError: false,
      };
    }
  } else {
    if (ctx?.res) ctx.res.statusCode = 404;
    return {
      isError: true,
    };
  }
};
