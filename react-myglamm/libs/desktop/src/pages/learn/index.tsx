import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { validateLifeStage, lifestageMapper, validateLanguage, lifestageSlugMapper } from "@libUtils/helper";

import WpArticleApi from "@libAPI/apis/WpArticleApi";

import { useSelector } from "@libHooks/useValtioSelector";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import { LearnPageServerInterface } from "@typesLib/articleUtilTypes";

import CommonPagination from "../../Components/common/CommonPagination";
import ArticleCardSection from "../../Components/Article/ArticleCardSection";
import LifeStageSelectionDropDown from "../../Components/Article/LifeStageSelectionDropDown";
import ArticleCardSectionV2 from "../../Components/Article/ArticleCardSectionV2";

import { ValtioStore } from "@typesLib/ValtioStore";

const ArticleLandingPage = (props: LearnPageServerInterface) => {
  const {
    trendingReads,
    freshReads,
    serverLang,
    serverSlug,
    serverLifestageId,
    defaultFilterUsed,
    articlesList,
    pageNo,
    totalItems,
  } = props;

  const [trendingReadsArticle, setTrendingReadsArticle] = useState(trendingReads);
  const [freshReadsArticle, setFreshReadsArticle] = useState(freshReads);
  const [filteredArticles, setFilteredArticle] = useState(articlesList || []);

  // this is the dropdown variable
  const [selectedLifeStage, setSelectedLifeStage] = useState();
  const router = useRouter();

  // const [collection, setCollection] = useState([]);
  const routerLang = router?.query?.language || router.query?.language?.[0];
  const [pageLoaded, setPageLoaded] = useState(pageNo);
  const [myFilters, setMyFilters] = useState({
    lifestage: serverLifestageId,
    language: serverLang,
    slug: serverSlug,
  });

  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));

  const getPriorityLifestage = () => {
    let lifestageId = 8; // 8 is lifestage id of all
    // @ts-ignore
    if (selectedLifeStage?.id) {
      // @ts-ignore
      lifestageId = selectedLifeStage?.id;
    } else if (router?.query?.lifestage) {
      lifestageId = lifestageMapper(JSON.parse(JSON.stringify(router?.query?.lifestage)));
    } else if (userProfile?.meta?.babyDetails?.lifestage?.type) {
      lifestageId = userProfile?.meta?.babyDetails?.lifestage?.type;
    }
    return lifestageId;
  };

  const getPriorityLifestageSlug = () => {
    let lifestageSlug = "all"; // 8 is lifestage id of all
    // @ts-ignore
    if (selectedLifeStage?.id) {
      // @ts-ignore
      lifestageSlug = selectedLifeStage?.slug;
    } else if (router?.query?.lifestage || router.query?.lifestage?.[0]) {
      lifestageSlug = JSON.parse(JSON.stringify(router?.query?.lifestage || router.query?.lifestage?.[0]));
    } else if (userProfile?.meta?.babyDetails?.lifestage?.type) {
      lifestageSlug = lifestageSlugMapper(userProfile?.meta?.babyDetails?.lifestage?.type);
    }
    return lifestageSlug;
  };

  const getData = async (filter = myFilters) => {
    const articlesAPI = new WpArticleApi();
    const apiForLearnPage = [articlesAPI.getArticleListingApi(filter.slug, filter.language, pageNo)];
    if (pageNo === 1) {
      apiForLearnPage.push(articlesAPI.getTrendingReads(filter), articlesAPI.getFreshReads(filter));
    }
    const response = await Promise.allSettled(apiForLearnPage);
    if (response?.[0]?.status === "fulfilled") {
      const newArticlesList = response?.[0]?.value?.data.data || [];
      if (newArticlesList.length > 0) {
        setFilteredArticle(newArticlesList);
      } else {
        setFilteredArticle([]);
      }
    }
    if (response?.[1]?.status === "fulfilled") {
      const trendingReadsResult = response?.[1]?.value?.data || [];
      setTrendingReadsArticle(trendingReadsResult);
    }
    if (response?.[2]?.status === "fulfilled") {
      const freshReadsResult = response?.[2]?.value?.data || [];
      setFreshReadsArticle(freshReadsResult);
    }
    if (pageNo > 1) {
      setTrendingReadsArticle([]);
      setFreshReadsArticle([]);
    }
  };

  const onFilterUpdate = (filter: any) => {
    getData(filter);
    setMyFilters(filter);
  };

  useEffect(() => {
    if (!userProfile?.id) {
      setFilteredArticle(articlesList);
    }
  }, [userProfile?.id, pageNo]);

  useEffect(() => {
    // @ts-ignore
    if (selectedLifeStage?.id && selectedLifeStage?.id !== myFilters.lifestage) {
      const filterForTrendingandFreshReads = {
        slug: getPriorityLifestageSlug(),
        language: routerLang || "en",
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getData(filterForTrendingandFreshReads);
      setPageLoaded(1);
    } // @ts-ignore
  }, [selectedLifeStage?.id]);

  useEffect(() => {
    if (
      (defaultFilterUsed &&
        userProfile?.id &&
        userProfile?.meta?.vendorLanguage?.bbc !== myFilters?.language?.toLocaleUpperCase()) ||
      userProfile?.meta?.babyDetails?.lifestage?.type !== myFilters.lifestage ||
      (typeof routerLang !== "undefined" && routerLang !== myFilters.language) ||
      pageLoaded !== pageNo
    ) {
      const filter = {
        lifestage: getPriorityLifestage(),
        language: routerLang || localStorage.getItem("language_next") || "en",
        slug: getPriorityLifestageSlug(),
      };

      onFilterUpdate(filter);
      setPageLoaded(pageNo);
    }
  }, [userProfile?.id, routerLang, pageNo]);

  const getExtraPageParams = () => {
    let paramString = "";
    if (router?.query?.lifestage) {
      paramString += `?lifestage=${router?.query?.lifestage}`;
    }
    if (router?.query?.language) {
      paramString += paramString.length === 0 ? `?language=${router?.query?.language}` : `&language=${router?.query?.language}`;
    }
    return paramString;
  };

  return (
    <main className="px-48 py-12">
      <Head>
        <title>{`Blogs Articles on Pregnancy Diet, Fitness, Parenting Baby Growth ${
          pageNo > 1 ? `Page ${pageNo}` : ""
        } | BabyChakra `}</title>
        <meta
          name="description"
          key="descriptions"
          content={`See which articles are trending on BabyChakra  ${
            pageNo > 1 ? `Page ${pageNo}` : ""
          }  . Find interesting blog articles on Pregnancy, Pre and Post pregnancy care, fitness, diet etc. Get valuable information from experts in Parenting and how to nurture your baby and toddler. Track your pregnancy week by week with personalized content for our users. `}
        />
        <meta
          name="keywords"
          key="keywords"
          content="pregnancy articles, parenting articles, pregnancy food, pregnancy diet, BabyChakra, India"
        />
        <meta
          name="title"
          key="title"
          content="Blogs Articles on Pregnancy Diet, Fitness, Parenting Baby Growth | BabyChakra"
        />
        <meta
          property="og:title"
          key="og:title"
          content="Blogs Articles on Pregnancy Diet, Fitness, Parenting Baby Growth | BabyChakra"
        />
        <meta
          property="og:description"
          key="og:description"
          content="See which articles are trending on BabyChakra. Find interesting blog articles on Pregnancy, Pre and Post pregnancy care, fitness, diet etc. Get valuable information from experts in Parenting and how to nurture your baby and toddler. Track your pregnancy week by week with personalized content for our users."
        />

        {pageNo > 1 && (
          <link
            rel="prev"
            href={`${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}/learn${getExtraPageParams()}${
              getExtraPageParams().length ? `&page=${pageNo - 1}` : `${pageNo > 2 ? `?page=${pageNo - 1}` : ""} `
            }`}
          />
        )}
        {/* show only when there is next page */}
        {pageNo < totalItems / 10 && (
          <link
            rel="next"
            href={`${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}/learn${getExtraPageParams()}${
              getExtraPageParams().length ? `&page=${pageNo + 1}` : `?page=${pageNo + 1}`
            }`}
          />
        )}
        <link
          rel="canonical"
          key="canonical"
          href={`${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}/learn${getExtraPageParams()}${
            pageNo && pageNo > 1 ? (getExtraPageParams().length ? `&page=${pageNo}` : `?page=${pageNo}`) : ``
          }`}
        />
      </Head>
      <LifeStageSelectionDropDown selectedLifeStage={selectedLifeStage} setSelectedLifeStage={setSelectedLifeStage} />
      <div>
        {trendingReadsArticle?.length > 0 && (
          <ArticleCardSection title="Trending Reads" articleDetails={trendingReadsArticle} isSSR />
        )}

        <div id="fresh_read_container">
          {freshReadsArticle?.length > 0 && <ArticleCardSection title="Fresh Reads" articleDetails={freshReadsArticle} isSSR />}
        </div>

        {filteredArticles?.length > 0 && (
          <div className="ovulation-calculator-banner my-6">
            <Link href="/ovulation-calculator" passHref legacyBehavior>
              <a title="ovulation calculator">
                <Image
                  src="https://files.babychakra.com/site-images/original/web-pregnancy-ovulation-banner.jpg"
                  alt="ovulation calculator"
                  layout="intrinsic"
                  width="2440"
                  height="280"
                />
              </a>
            </Link>
          </div>
        )}
        <ArticleCardSectionV2 articleDetails={filteredArticles} isSSR />

        {filteredArticles.length > 0 ? (
          <CommonPagination
            totalItems={totalItems || 10}
            pageNo={pageNo}
            noOfSlots={5}
            additionalParams={getExtraPageParams()}
            position="pre"
            pageTitle="Learn"
          />
        ) : (
          <span />
        )}
      </div>
    </main>
  );
};

ArticleLandingPage.getInitialProps = async (ctx: any) => {
  const routerLifestage = ctx?.query?.lifestage;
  const routerLang = ctx?.query?.language;
  const defaultFilterUsed = !(routerLang && routerLifestage);
  const pageNo = parseInt(ctx?.query?.page, 10) || 1;
  let totalItems = 0;
  const filter = {
    slug: validateLifeStage(routerLifestage || "all"),
    lifestageId: lifestageMapper(routerLifestage),
    language: validateLanguage(routerLang || "en"),
  };
  try {
    // for page 1 call all three apis (have to pass a variable to tell check if page 1 or 2) -> done
    // for page 2 call only getCollection api and call wordpress api -> done
    // add pagination calculate page slots -> done
    // canonicals should be added based on page -> done
    // add rel next add prev with additional params -> done
    const articlesAPI = new WpArticleApi();

    const apiForLearnPage = [articlesAPI.getArticleListingApi(filter.slug, routerLang, pageNo)];
    if (pageNo === 1) {
      apiForLearnPage.push(articlesAPI.getTrendingReads(filter), articlesAPI.getFreshReads(filter));
    }
    const response = await Promise.allSettled(apiForLearnPage);
    let trendingReads = [];
    let freshReads = [];
    let articlesList = [];
    if (response?.[0]?.status === "fulfilled") {
      articlesList = response?.[0]?.value?.data.data || [];
      totalItems = response?.[0]?.value?.data?.count;
    }
    if (pageNo === 1 && response?.[1]?.status === "fulfilled") {
      trendingReads = response?.[1]?.value?.data || [];
    }
    if (pageNo === 1 && response?.[2]?.status === "fulfilled") {
      freshReads = response?.[2]?.value?.data || [];
    }

    return {
      trendingReads,
      freshReads,
      serverLang: filter.language,
      serverSlug: filter.slug,
      serverLifestageId: filter.lifestageId,
      defaultFilterUsed,
      articlesList,
      pageNo,
      totalItems,
    };
  } catch (error) {
    return {
      trendingReads: [],
      freshReads: [],
      articlesList: [],
      serverLang: filter.language,
      serverSlug: filter.slug,
      serverLifestageId: filter.lifestageId,
      defaultFilterUsed,
    };
  }
};

export default ArticleLandingPage;
