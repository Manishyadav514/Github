import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/legacy/image";
import { useRouter } from "next/router";

import {
  lifestageMapper,
  validateLanguage,
  getAssociatedLifestageSEOContent,
  getAssociatedSlugForArticles,
} from "@libUtils/helper";

import WpArticleApi from "@libAPI/apis/WpArticleApi";

import AdSlots from "@libComponents/CommonBBC/ads/AdSlots";
import { LEARN_PAGES_ADS, LEARN_PAGE_ATF, LEARN_PAGE_BTF } from "@libConstants/AdsConstants";

import CommonPagination from "@libComponents/CommonBBC/CommonPagination";
import ArticleCardSection from "@libComponents/CommonBBC/ArticleCardSection";
import ArticleCardSectionV2 from "@libComponents/CommonBBC/ArticleCardSectionV2";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const enableAds = true;

const ArticleLandingPage = (props: any) => {
  const {
    trendingReads,
    freshReads,
    seoData,
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

  const router = useRouter();

  const routerLang = router?.query?.language || router.query?.language?.[0] || "";
  const [pageLoaded, setPageLoaded] = useState(pageNo);
  const [myFilters, setMyFilters] = useState({
    lifestage: serverLifestageId,
    language: routerLang || "en",
    slug: serverSlug,
  });

  const getData = async (filter = myFilters) => {
    const articlesAPI = new WpArticleApi();
    // @ts-ignore
    const apiForLearnPage = [articlesAPI.getArticleListingApi(filter.slug, filter?.language, pageNo)];
    if (pageNo === 1) {
      // @ts-ignore
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
    setFilteredArticle(articlesList);
  }, [pageNo]);

  useEffect(() => {
    if (
      defaultFilterUsed ||
      (typeof routerLang !== "undefined" && routerLang !== myFilters.language) ||
      pageLoaded !== pageNo
    ) {
      onFilterUpdate(myFilters);
      setPageLoaded(pageNo);
    }
  }, [routerLang, pageNo]);

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
    <main className="px-4 py-8">
      <Head>
        <title>{`${seoData.title} ${pageNo > 1 ? `Page ${pageNo}` : ""} | BabyChakra `}</title>
        <meta
          name="description"
          key="description"
          content={`${seoData?.description}  ${pageNo > 1 ? `Page ${pageNo}` : ""}  `}
        />
        <meta name="keywords" key="keywords" content="" />
        <meta name="title" key="title" content={`${seoData.title}`} />
        <meta property="og:title" key="og:title" content={`${seoData.title}`} />
        <meta property="og:description" key="og:description" content={`${seoData?.description}`} />

        {pageNo > 1 && (
          <link
            rel="prev"
            href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${seoData?.canonical}${getExtraPageParams()}${
              getExtraPageParams().length ? `&page=${pageNo - 1}` : `${pageNo > 2 ? `?page=${pageNo - 1}` : ""} `
            }`}
          />
        )}
        {/* show only when there is next page */}
        {pageNo < totalItems / 10 && (
          <link
            rel="next"
            href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${seoData?.canonical}${getExtraPageParams()}${
              getExtraPageParams().length ? `&page=${pageNo + 1}` : `?page=${pageNo + 1}`
            }`}
          />
        )}
        <link
          rel="canonical"
          key="canonical"
          href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${seoData?.canonical}${getExtraPageParams()}${
            pageNo && pageNo > 1 ? (getExtraPageParams().length ? `&page=${pageNo}` : `?page=${pageNo}`) : ``
          }`}
        />
      </Head>
      <div>
        {pageNo === 1 ? (
          <>
            <h1 className=" mb-3  font-semibold  uppercase px-1.5">{seoData.headingText}</h1>
            <p className=" border-indigo-300 rounded-sm border-8 p-4 mb-8">{seoData.content}</p>
          </>
        ) : (
          <span />
        )}
        {trendingReadsArticle?.length > 0 && (
          <ArticleCardSection title="Trending Reads" articleDetails={trendingReadsArticle} isSSR />
        )}

        {enableAds && pageNo === 1 && (
          <AdSlots id="div-gpt-ad-1648720977785-0" className="mx-auto md:hidden my-4" adSlotData={LEARN_PAGE_ATF} />
        )}

        <div id="fresh_read_container">
          {freshReadsArticle?.length > 0 && <ArticleCardSection title="Fresh Reads" articleDetails={freshReadsArticle} isSSR />}
        </div>

        {filteredArticles?.length > 0 && (
          <div className="ovulation-calculator-banner my-6">
            <Link href="/ovulation-calculator" passHref title="ovulation calculator" aria-label="ovulation calculator">
              <Image
                src="https://files.babychakra.com/site-images/original/pregnancy-ovulation-banner.png"
                alt="ovulation calculator"
                layout="intrinsic"
                width="660"
                height="300"
              />
            </Link>
          </div>
        )}
        <ArticleCardSectionV2 articleDetails={filteredArticles} enableAds={enableAds} adSlotData={LEARN_PAGES_ADS} isSSR />

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

        {enableAds && (
          <AdSlots id="div-gpt-ad-1648721046694-0" className="mx-auto md:hidden my-4" adSlotData={LEARN_PAGE_BTF} />
        )}
      </div>
    </main>
  );
};

ArticleLandingPage.getInitialProps = async (ctx: any) => {
  const routerLifestage = ctx?.req?.url;
  const routerLang = ctx?.query?.language || "en";
  const pageNo = parseInt(ctx?.query?.page, 10) || 1;
  let totalItems = 0;
  const lifestageSlug = getAssociatedSlugForArticles(routerLifestage);
  const filter = {
    slug: lifestageSlug,
    lifestageId: lifestageMapper(lifestageSlug),
    language: validateLanguage(routerLang),
  };
  const seoData = getAssociatedLifestageSEOContent(routerLifestage);
  try {
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
      totalItems = response?.[0]?.value?.data.count;
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
      serverSlug: filter.slug,
      serverLifestageId: filter.lifestageId,
      articlesList,
      pageNo,
      totalItems,
      seoData,
    };
  } catch (error) {
    return {
      trendingReads: [],
      freshReads: [],
      articlesList: [],
      serverSlug: filter.slug,
      serverLifestageId: filter.lifestageId,
    };
  }
};

export default ArticleLandingPage;
