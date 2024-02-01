import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import AdSlots from "@libComponents/CommonBBC/ads/AdSlots";
import BreadCrumb from "@libComponents/CommonBBC/BreadCrumb";
import BabyNameSelector from "@libComponents/BabyNames/BabyNameSelector";
import ArticleCardSection from "@libComponents/CommonBBC/ArticleCardSection";
import TwoColumnListBlock from "@libComponents/BabyNames/TwoColumnListBlock";
import WrapperForOptimization from "@libComponents/BabyNames/WrapperForOptimization";
import BabyNameMeaningWrapper from "@libComponents/BabyNames/BabyNameMeaningWrapper";
import ChatGroupCards from "@libComponents/CommonBBC/ChatGroupCard";
import Widgets from "@libComponents/HomeWidgets/Widgets";
import ModuleCategoryListCard from "@libComponents/BabyNames/ModuleCategoryListCard";

import { generateBreadCrumbSchema, makeBreadCrumbSchemaList } from "@libUtils/seoHelper";

// import { crudMsBabyNames } from "@api/common";

import { breadcrumbType } from "@typesLib/seoTypes";
import { BabyNamesObject, BabyNamesResponse, PageTypeTypes, QuestionResponse } from "@typesLib/babyNamesTypes";

import TestimonialData from "@libUtils/jsondata/home-static.json";
import { BABY_NAMES_CATEGORIES } from "@libConstants/BabyNamesConstants";
import { HOME_ATF, HOME_BTF, HOME_PAGE_ADS } from "@libConstants/AdsConstants";

import {
  getAlphabetRelatedAlphabets,
  getBabyNamesFilter,
  getGenderAlphabetCombination,
  getGenderOriginRegionalCombination,
  getPageData,
  getReligionAndGenderCombo,
  isValidPage,
  parseNamesList,
  removeDuplicateBabyName,
  trimGender,
} from "@libUtils/babynames";
import { getNumberOfPages } from "@libUtils/helper";

import GenderSelector from "@libComponents/BabyNames/GenderSelector";
import CommonPagination from "@libComponents/CommonBBC/CommonPagination";
import AlphabetSelector from "@libComponents/BabyNames/AlphabetSelector";
import { GAdispatchTagManagerEvents } from "@libUtils/analytics/gtm";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import WpArticleApi from "@libAPI/apis/WpArticleApi";
import BabyNamesApi from "@libAPI/apis/BBCBabyNamesAPI";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const TestimonialSection = dynamic(() => import("@libComponents/CommonBBC/TestimonialSection"));
const Custom404 = dynamic(() => import("@libPages/_error"), { ssr: false });

type PageData = {
  pageType: PageTypeTypes;
  seoData: {
    title: string;
    description: string;
    pageTitle: string;
    breadCrumbList: breadcrumbType[];
    pageContent: string | undefined;
    canonial: string;
  };
};
type PropTypes = {
  pageData: PageData;
  totalNames?: number;
  articleList: any;
  pageNo: number;
  ssrWidgets: any;
  babyNamesData: BabyNamesResponse;
  dynamicCategoryList: BabyNamesResponse;
  trendingQuestions: QuestionResponse[];
};

const breadCrumbStatic: breadcrumbType[] = [
  { to: "/", label: "Home", schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}` },
  {
    to: "/baby-names-finder",
    label: "Baby Names",
    schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names-finder`,
  },
];

const BabyNameComplete = ({
  pageData,
  totalNames,
  articleList,
  pageNo,
  ssrWidgets,
  babyNamesData,
  dynamicCategoryList,
  trendingQuestions,
}: // filter,
PropTypes) => {
  const {
    pageType,
    seoData,
    seoData: { pageTitle, breadCrumbList: dyBreadcrumb, pageContent, canonial },
  } = pageData;
  const router = useRouter();
  const [schemaState, setSchemaState] = useState(null);
  const [mostSearchedList, setMostSearchedList] = useState([]);
  const totalPage = getNumberOfPages(totalNames as number, 10);
  const [breadCrumbState, setBreadCrumbState] = useState(breadCrumbStatic);
  const dynamicCategoryFiltered = removeDuplicateBabyName(dynamicCategoryList?.data, "name", babyNamesData?.data?.[0]?.name);
  let dynamicCategoryListParsed = parseNamesList(dynamicCategoryFiltered as BabyNamesObject[]);
  dynamicCategoryListParsed = getGenderAlphabetCombination(dynamicCategoryListParsed);
  const originNamesByGender = pageType === "GENDER" ? getReligionAndGenderCombo(router?.query?.slug?.[0] as string) : [];
  const otherPopularCategory = pageType === "ALPHABET" ? getAlphabetRelatedAlphabets(router?.query?.slug?.[0] as string) : [];
  // eslint-disable-next-line consistent-return
  const makeNewBreadCrumb = () => {
    if (dyBreadcrumb?.length > 1) {
      const newObj = [...breadCrumbState, dyBreadcrumb[0]];
      setBreadCrumbState(newObj);
      const itemListElement = makeBreadCrumbSchemaList(newObj);
      return generateBreadCrumbSchema(itemListElement, JSON.parse(JSON.stringify(dyBreadcrumb[1])));
    }
    setBreadCrumbState(breadCrumbStatic);
    const itemListElement = makeBreadCrumbSchemaList(breadCrumbStatic);
    return generateBreadCrumbSchema(itemListElement, JSON.parse(JSON.stringify(dyBreadcrumb[0])));
  };

  useEffect(() => {
    GAdispatchTagManagerEvents("Home Ads Loader", {});
  }, []);

  useEffect(() => {
    if (pageType) {
      setSchemaState(makeNewBreadCrumb() as any);
    }
    const copyArr = [...BABY_NAMES_CATEGORIES.dynamic.list];
    const dynamicCategoryListOriginRegional =
      (["ORIGIN", "REGIONAL"].includes(pageType as string) &&
        getGenderOriginRegionalCombination(copyArr, router?.query.slug)) ||
      [];
    setMostSearchedList(dynamicCategoryListOriginRegional as any);
  }, [router?.query?.slug?.[0], router?.query?.slug?.[1]]);

  return (
    <>
      <Head>
        <title>{seoData?.title}</title>
        <meta name="title" key="title" content={seoData?.title} />
        <meta name="description" key="description" content={seoData?.description} />
        {pageNo !== 1 ? (
          <>
            <link
              rel="canonical"
              key="canonical"
              href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${canonial}?page=${pageNo}`}
            />
            <meta
              property="og:url"
              key="og:url"
              content={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${canonial}?page=${pageNo}`}
            />
          </>
        ) : (
          <>
            <link rel="canonical" key="canonical" href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${canonial}`} />
            <meta property="og:url" key="og:url" content={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${canonial}`} />
          </>
        )}
        {pageNo > 1 && (
          <link
            rel="prev"
            href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${canonial}${pageNo > 2 ? `?page=${pageNo - 1}` : ""}`}
          />
        )}
        {(pageNo < totalPage || pageNo === 1) && (
          <link rel="next" href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${canonial}?page=${pageNo + 1}`} />
        )}
        <meta property="og:title" key="og:title" content={seoData?.title} />
        <meta property="og:description" key="og:description" content={seoData?.description} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaState) }} />
      </Head>
      {pageType !== undefined ? (
        <div>
          <div className=" ">
            {breadCrumbState && (
              <div className=" mx-auto">
                <BreadCrumb
                  breadCrumbList={breadCrumbState}
                  currentPath={(dyBreadcrumb[dyBreadcrumb.length - 1] as any)?.name}
                  customClassname="px-2.5 py-1 lg:w-[75%] mx-auto"
                />
              </div>
            )}
            {pageType === "MEANING" && (
              <div className=" ">
                <div className="bg-white p-4 lg:py-4 lg:px-0">
                  <div className="lg:w-[75%] lg:mx-auto">
                    <div className="flex items-center space-x-3 ">
                      <h1 className="capitalize font-semibold lg:text-lg">{pageTitle}</h1>
                    </div>
                  </div>
                  <BabyNameMeaningWrapper babyNameData={babyNamesData?.data?.[0]} />
                </div>
                <AdSlots id="div-gpt-ad-babyname-atf" className="py-4 mx-auto md:hidden" adSlotData={HOME_ATF} />
                <div className="bg-white lg:py-8">
                  <ModuleCategoryListCard
                    image={BABY_NAMES_CATEGORIES.dynamic.image}
                    title="Other Useful Links"
                    mainCardThemeClass={BABY_NAMES_CATEGORIES.dynamic.class.card}
                    cardThemeClass={BABY_NAMES_CATEGORIES.dynamic.class.strip}
                    categoryList={dynamicCategoryListParsed}
                  />
                </div>
                <div className="bg-white">
                  <div className="lg:w-[75%] lg:mx-auto p-4 lg:py-4 lg:px-0">
                    <BabyNameSelector />
                  </div>
                </div>
              </div>
            )}

            {[
              "GENDER",
              "ALPHABET",
              "GENDER_AND_ALPHABET",
              "ORIGIN",
              "ORIGIN_AND_GENDER",
              "REGIONAL_AND_GENDER",
              "REGIONAL",
            ].includes(pageType) && (
              <div className=" bg-white ">
                <div className="lg:w-[75%] lg:mx-auto p-4 lg:py-4 lg:px-0">
                  <div className="flex items-center space-x-3 ">
                    <h1 className="capitalize font-semibold">{pageTitle}</h1>
                  </div>
                  <p className="py-4 text-gray-600">{pageContent}</p>
                  {["ORIGIN", "REGIONAL", "ALPHABET"].includes(pageType) && <GenderSelector pageType={pageType} />}
                  {["GENDER"].includes(pageType) && <AlphabetSelector />}
                  {["GENDER", "GENDER_AND_ALPHABET", "ALPHABET"].includes(pageType) ? (
                    <TwoColumnListBlock
                      titles={["name", "meaning"]}
                      list={babyNamesData?.data}
                      headingClass="bg-gradient-to-r from-blue-200  to-rose-300"
                      bodyClass="bg-gradient-to-r from-blue-100  to-rose-200"
                    />
                  ) : (
                    <TwoColumnListBlock
                      titles={["name", "meaning"]}
                      list={babyNamesData?.data}
                      headingClass="bg-cyan-200"
                      bodyClass="bg-cyan-100"
                    />
                  )}

                  <CommonPagination totalItems={totalNames || 10} pageNo={pageNo} noOfSlots={5} pageTitle={pageTitle} />
                </div>
                <AdSlots id="div-gpt-ad-baby-atf-sec-2" className="my-4 mx-auto md:hidden " adSlotData={HOME_ATF} />
                <div className="lg:py-8">
                  {["ORIGIN", "REGIONAL"].includes(pageType) && (
                    <ModuleCategoryListCard
                      image={BABY_NAMES_CATEGORIES.dynamic.image}
                      title={BABY_NAMES_CATEGORIES.dynamic.title}
                      mainCardThemeClass={BABY_NAMES_CATEGORIES.dynamic.class.card}
                      cardThemeClass={BABY_NAMES_CATEGORIES.dynamic.class.strip}
                      categoryList={mostSearchedList}
                    />
                  )}
                  {/* do you need to hide on gender */}
                  {["ORIGIN_AND_GENDER", "REGIONAL_AND_GENDER", "GENDER_AND_ALPHABET"].includes(pageType) && (
                    <ModuleCategoryListCard
                      image={BABY_NAMES_CATEGORIES.dynamic.image}
                      title={BABY_NAMES_CATEGORIES.dynamic.title}
                      mainCardThemeClass={BABY_NAMES_CATEGORIES.dynamic.class.card}
                      cardThemeClass={BABY_NAMES_CATEGORIES.dynamic.class.strip}
                      categoryList={BABY_NAMES_CATEGORIES.dynamic.list}
                    />
                  )}
                  {["ORIGIN", "REGIONAL"].includes(pageType) &&
                    ["ORIGIN_AND_GENDER", "REGIONAL_AND_GENDER", "GENDER_AND_ALPHABET"].includes(pageType) && (
                      <AdSlots id="div-gpt-ad-baby-between" className="my-4 mx-auto md:hidden " adSlotData={HOME_PAGE_ADS} />
                    )}
                  {["ALPHABET"].includes(pageType) && (
                    <ModuleCategoryListCard
                      image={BABY_NAMES_CATEGORIES.dynamic.image}
                      title={BABY_NAMES_CATEGORIES.dynamic.title}
                      mainCardThemeClass={BABY_NAMES_CATEGORIES.dynamic.class.card}
                      cardThemeClass={BABY_NAMES_CATEGORIES.dynamic.class.strip}
                      categoryList={otherPopularCategory}
                    />
                  )}
                  {["GENDER"].includes(pageType) && (
                    <ModuleCategoryListCard
                      image={BABY_NAMES_CATEGORIES.dynamic.image}
                      title="Explore More Origin Names"
                      mainCardThemeClass={BABY_NAMES_CATEGORIES.dynamic.class.card}
                      cardThemeClass={BABY_NAMES_CATEGORIES.dynamic.class.strip}
                      categoryList={originNamesByGender}
                    />
                  )}
                  {/* check if you need to hide */}
                  {["GENDER", "ORIGIN", "REGIONAL"].includes(pageType) && (
                    <ModuleCategoryListCard
                      image={BABY_NAMES_CATEGORIES.origin.image}
                      title={BABY_NAMES_CATEGORIES.origin.title}
                      mainCardThemeClass={BABY_NAMES_CATEGORIES.origin.class.card}
                      cardThemeClass={BABY_NAMES_CATEGORIES.origin.class.strip}
                      categoryList={BABY_NAMES_CATEGORIES.origin.list}
                    />
                  )}
                  {/* check if you need to hide */}
                  {["GENDER", "ORIGIN", "REGIONAL"].includes(pageType) && (
                    <ModuleCategoryListCard
                      image={BABY_NAMES_CATEGORIES.regional.image}
                      title={BABY_NAMES_CATEGORIES.regional.title}
                      mainCardThemeClass={BABY_NAMES_CATEGORIES.regional.class.card}
                      cardThemeClass={BABY_NAMES_CATEGORIES.regional.class.strip}
                      categoryList={BABY_NAMES_CATEGORIES.regional.list}
                    />
                  )}
                </div>
              </div>
            )}
            {/* Widgets */}
            <AdSlots id="div-gpt-ad-baby-mid-1" className="my-4 mx-auto md:hidden " adSlotData={HOME_PAGE_ADS} />

            <div className="bg-white">
              <div className="my-4 mx-auto lg:w-[75%] py-2 lg:py-4">
                {articleList?.length > 0 && (
                  <ArticleCardSection articleDetails={articleList} title="Baby Names Articles" isSSR />
                )}
              </div>
              <div className="lg:w-[75%] lg:mx-auto">
                <Widgets widgets={ssrWidgets} />
              </div>
            </div>
            {/* Static */}
            <div className="md:grid md:grid-cols-2 md:gap-20 lg:w-[75%]  item-center lg:mx-auto py-4  ">
              <WrapperForOptimization trendingQuestions={trendingQuestions} />
              <ChatGroupCards
                title="Explore our groups"
                chatRoomList={[
                  {
                    name: "Mar 2013 Birth Club",
                    followers: 83,
                    images: "https://files.babychakra.com/site-images/original/march-birth-club.png",
                  },
                  {
                    name: "Mumbai Mothers",
                    followers: 239,
                    images: "https://files.babychakra.com/site-images/original/mumbai-moms.png",
                  },
                  {
                    name: "Aug 2017 Birth Club",
                    followers: 156,
                    images: "https://files.babychakra.com/site-images/original/august-birth-club.png",
                  },
                ]}
              />
            </div>
            <AdSlots id="div-gpt-ad-babynames-finder-btf" className="my-3 mx-auto md:hidden" adSlotData={HOME_BTF} />
            <TestimonialSection
              testimonialData={TestimonialData?.baby_name?.testimonials}
              customClassTitle="uppercase text-lg  px-4 text-base font-medium capitalize lg:text-center lg:text-xl "
            />
          </div>
        </div>
      ) : (
        <Custom404 />
      )}
    </>
  );
};

BabyNameComplete.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  const babynameSlug = {
    slug: "baby-names",
  };
  const articlesAPI = new WpArticleApi();
  const widgetApi = new WidgetAPI();
  const babyNameApi = new BabyNamesApi();

  let articleList: any[] = [];
  let ssrWidgets: any[] = [];
  let trendingQuestions = [];
  let dynamicCategoryList = [];

  if (isValidPage(query?.slug)) {
    const apiForBabyPage = [];
    const filter = getBabyNamesFilter(query.slug, parseInt(query.page, 10) || 1, 10);
    if (filter.where.gender) {
      filter.where.gender = trimGender(filter?.where?.gender);
    }
    apiForBabyPage.push(
      articlesAPI.getArticleListByPostSlug(babynameSlug),
      widgetApi.getWidgets({ where: { slugOrId: "mobile-site-baby-names" } }),
      babyNameApi.getBabyNamesData(filter),
      babyNameApi.getTrendingQuestion()
    );
    if (filter.where.slug) {
      const filter2 = getBabyNamesFilter([`starting-with-${query?.slug?.[0]?.charAt()}`], parseInt(query.page, 10) || 1, 5);
      apiForBabyPage.push(babyNameApi.getBabyNamesData(filter2));
    }

    let babyNamesData = {};
    const response = await Promise.allSettled(apiForBabyPage);
    if (response?.[0]?.status === "fulfilled") {
      articleList = response?.[0]?.value?.data || [];
    }
    if (response?.[1]?.status === "fulfilled") {
      ssrWidgets = response?.[1]?.value?.data?.data?.data.widget || [];
    }
    if (response?.[2]?.status === "fulfilled" && response?.[2]?.value?.data?.data?.count > 0) {
      babyNamesData = response?.[2]?.value?.data?.data;
    } else {
      if (ctx.res) {
        ctx.res.statusCode = 404;
      }
      return {
        pageData: {
          pageType: undefined,
          seoData: {
            title: "",
            description: "",
            pageTitle: "",
            breadCrumbList: [],
            pageContent: "",
          },
        },
        notFound: true,
        ssrWidgets,
        articleList,
        pageNo: parseInt(query.page || 1, 10),
        totalNames: 0,
      };
    }
    if (response?.[4]?.status === "fulfilled") {
      dynamicCategoryList = response?.[4]?.value?.data?.data;
    }
    if (response?.[3]?.status === "fulfilled") {
      trendingQuestions = response?.[3]?.value?.data?.data?.data?.items?.splice(0, 5);
    }
    const totalNames = (babyNamesData as any)?.count;
    const pageData = getPageData(query.slug, totalNames, parseInt(query.page || 1, 10));
    return {
      pageData,
      totalNames,
      articleList,
      pageNo: parseInt(query.page || 1, 10),
      ssrWidgets,
      babyNamesData,
      dynamicCategoryList,
      trendingQuestions,
    };
  }
  if (ctx.res) {
    ctx.res.statusCode = 404;
  }
  return {
    pageData: {
      pageType: undefined,
      seoData: {
        title: "",
        description: "",
        pageTitle: "",
        breadCrumbList: [],
        pageContent: "",
      },
    },
    notFound: true,
    ssrWidgets,
    articleList,
    pageNo: parseInt(query.page || 1, 10),
    totalNames: 0,
  };
};

BabyNameComplete.defaultProps = {
  totalNames: undefined,
};

export default BabyNameComplete;
