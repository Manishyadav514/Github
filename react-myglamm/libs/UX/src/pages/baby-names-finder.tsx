import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import AdSlots from "@libComponents/CommonBBC/ads/AdSlots";
import BreadCrumb from "@libComponents/CommonBBC/BreadCrumb";
import ChatGroupCards from "@libComponents/CommonBBC/ChatGroupCard";
import BabyNameSelector from "@libComponents/BabyNames/BabyNameSelector";
import ArticleCardSection from "@libComponents/CommonBBC/ArticleCardSection";
import WrapperForOptimization from "@libComponents/BabyNames/WrapperForOptimization";
import Widgets from "@libComponents/HomeWidgets/Widgets";
import ModuleCategoryListCard from "@libComponents/BabyNames/ModuleCategoryListCard";

import { generateBreadCrumbSchema, makeBreadCrumbSchemaList } from "@libUtils/seoHelper";

import WidgetAPI from "@libAPI/apis/WidgetAPI";
import WpArticleApi from "@libAPI/apis/WpArticleApi";
import BabyNamesApi from "@libAPI/apis/BBCBabyNamesAPI";

import { breadcrumbType } from "@typesLib/seoTypes";
import { QuestionResponse } from "@typesLib/babyNamesTypes";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import TestimonialData from "@libUtils/jsondata/home-static.json";
import { BABY_NAMES_CATEGORIES } from "@libConstants/BabyNamesConstants";
import { HOME_ATF, HOME_BTF, HOME_PAGE_ADS } from "@libConstants/AdsConstants";

type PropTypes = {
  articleList: any;
  ssrWidgets: any;
  trendingQuestions: QuestionResponse[];
};

const breadCrumbList: breadcrumbType[] = [{ to: "/", label: "Home", schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}` }];
const itemListElement = makeBreadCrumbSchemaList(breadCrumbList);

const breadcrumbSchema = generateBreadCrumbSchema(itemListElement, {
  name: "Baby Names",
  url: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names-finder`,
});

const TestimonialSection = dynamic(() => import("@libComponents/CommonBBC/TestimonialSection"));

const BabyNamesFinderView = ({ articleList, ssrWidgets, trendingQuestions }: PropTypes) => {
  return (
    <>
      <Head>
        <title>Baby Names Finder | BabyChakra</title>
        <meta
          name="description"
          key="description"
          content="Naming your baby, find latest  20000+ Baby Names ideas and suggestions. Search from a wide list of Origin, Religion and Initials to find perfect name for your baby at BabyChakra."
        />
        <meta name="title" key="title" content="Baby Names Finder | BabyChakra" />
        <meta property="og:title" key="og:title" content="Baby Names Finder | BabyChakra" />
        <meta
          property="og:description"
          key="og:description"
          content="Naming your baby, find latest 20000+ Baby Names ideas and suggestions. Search from a wide list of Origin, Religion and Initials to find perfect name for your baby at BabyChakra."
        />
        <link rel="canonical" key="canonical" href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names-finder`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </Head>
      <div className="">
        <div className=" mx-auto">
          <BreadCrumb breadCrumbList={breadCrumbList} currentPath="Baby Names" customClassname="px-2.5  py-1  mx-auto" />
        </div>
        <BabyNameSelector />
        <AdSlots id="div-gpt-ad-babyname-finder-atf" className="py-4 mx-auto md:hidden" adSlotData={HOME_ATF} />
        <ModuleCategoryListCard
          image={BABY_NAMES_CATEGORIES.origin.image}
          title={BABY_NAMES_CATEGORIES.origin.title}
          mainCardThemeClass={BABY_NAMES_CATEGORIES.origin.class.card}
          cardThemeClass={BABY_NAMES_CATEGORIES.origin.class.strip}
          categoryList={BABY_NAMES_CATEGORIES.origin.list}
        />

        <ModuleCategoryListCard
          image={BABY_NAMES_CATEGORIES.regional.image}
          title={BABY_NAMES_CATEGORIES.regional.title}
          mainCardThemeClass={BABY_NAMES_CATEGORIES.regional.class.card}
          cardThemeClass={BABY_NAMES_CATEGORIES.regional.class.strip}
          categoryList={BABY_NAMES_CATEGORIES.regional.list}
        />
        <AdSlots id="div-gpt-ad-babynames-mid-1" className="my-4 mx-auto md:hidden " adSlotData={HOME_PAGE_ADS} />

        <ModuleCategoryListCard
          image={BABY_NAMES_CATEGORIES.dynamic2.image}
          title={BABY_NAMES_CATEGORIES.dynamic2.title}
          mainCardThemeClass={BABY_NAMES_CATEGORIES.dynamic2.class.card}
          cardThemeClass={BABY_NAMES_CATEGORIES.dynamic2.class.strip}
          categoryList={BABY_NAMES_CATEGORIES.dynamic2.list}
        />
        <div className="bg-white">
          <div className="my-4 mx-auto p-4 lg:w-[75%] lg:py-4">
            {articleList?.length > 0 && <ArticleCardSection title="Baby Names Articles" articleDetails={articleList} isSSR />}
          </div>
          <div className="px-2 lg:w-[75%] lg:mx-auto">
            <Widgets widgets={ssrWidgets} />
          </div>
        </div>
        <AdSlots id="div-gpt-ad-babynames-mid-2" className="my-4 mx-auto md:hidden" adSlotData={HOME_PAGE_ADS} />
        <div className="md:grid md:grid-cols-2 md:gap-20 lg:w-[75%] item-center py-4 lg:mx-auto">
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
        <div className="my-4">
          <TestimonialSection
            testimonialData={TestimonialData?.baby_name?.testimonials}
            customClassTitle="uppercase text-lg  px-4 text-base font-medium capitalize"
          />
        </div>
      </div>
    </>
  );
};

BabyNamesFinderView.getInitialProps = async (ctx: any) => {
  const babynameSlug = {
    slug: "baby-names",
  };
  let articleList = [];
  let ssrWidgets = [];
  let trendingQuestions = [];
  const widgetApi = new WidgetAPI();
  const wpArticleApi = new WpArticleApi();
  const babyNameApi = new BabyNamesApi();

  try {
    const response = await Promise.allSettled([
      wpArticleApi.getArticleListByPostSlug(babynameSlug),
      widgetApi.getWidgets({ where: { slugOrId: "mobile-site-baby-names" } }),
      babyNameApi.getTrendingQuestion(),
    ]);
    if (response?.[0]?.status === "fulfilled") {
      articleList = response?.[0]?.value?.data || [];
    }
    if (response?.[1].status === "fulfilled") {
      ssrWidgets = response?.[1].value?.data?.data?.data.widget || [];
    }
    if (response?.[2]?.status === "fulfilled") {
      trendingQuestions = response?.[2]?.value?.data?.data?.data?.items?.splice(0, 5);
    }
  } catch (error) {
    // console.log(error, "article api failed")
  }

  return {
    articleList,
    ssrWidgets,
    trendingQuestions,
  };
};

export default BabyNamesFinderView;
