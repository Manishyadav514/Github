import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/legacy/image";

import BreadCrumb from "@libComponents/CommonBBC/BreadCrumb";

import ArticleCard from "@libComponents/BBCArticle/ArticleCard";

import { LEARN_PAGES_ADS, LEARN_PAGE_ATF, LEARN_PAGE_BTF } from "@libConstants/AdsConstants";
import AdSlots from "@libComponents/CommonBBC/ads/AdSlots";
import MetaTags from "@libComponents/BBCArticle/MetaTags";
import CommonPagination from "@libComponents/CommonBBC/CommonPagination";

import Custom404 from "../../_error";

import { generateBreadCrumbSchema, makeBreadCrumbSchemaList } from "@libUtils/seoHelper";

import useEffectAfterRender from "@libHooks/useEffectAfterRender";

import WpArticleApi from "@libAPI/apis/WpArticleApi";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const breadCrumbList: {
  to: string;
  label: string;
  schemaTo: string;
}[] = [
  { to: "/", label: "Home", schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}` },
  { to: "/learn", label: "Learn", schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/learn` },
];
const itemListElement = makeBreadCrumbSchemaList(breadCrumbList);

interface PropTypes {
  [x: string]: string;
  initialArticleResponse: any;
  latestArticleAPIResponse: any;
  categoryResponse: any;
  ssrPageNumber: any;
  isError?: any;
}
const perPage = 12;
const CategoryScreen = (props: PropTypes) => {
  const { initialArticleResponse, latestArticleAPIResponse, categoryResponse, ssrPageNumber, isError } = props;
  const [initialArticleData, setInitialArticleData] = useState(initialArticleResponse);
  const [currentPageNumber, setCurrentPageNumber] = React.useState(Number(ssrPageNumber) || 1);
  const [articleDetails, setArticlesDetails] = React.useState({
    per_page: perPage,
    data: [],
    hasMore: true,
  });
  const router = useRouter();
  const isGettingPregnantPage = router.pathname === "/getting-pregnant";
  const breadcrumbSchema = generateBreadCrumbSchema(itemListElement, {
    name: categoryResponse?.name || "",
    url: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/learn/${categoryResponse?.slug}`,
  });

  const onChangePageLoadData = async (page: number = 1) => {
    const pageNumber = page;
    try {
      const articlesAPI = new WpArticleApi();
      const response = await articlesAPI.getArticlesByCategoryApi(
        isGettingPregnantPage ? "planning-a-baby" : categoryResponse?.slug,
        perPage,
        pageNumber
      );

      if (response?.status === 200 && response?.data?.length) {
        response.data[0].routerId = `category_set_${pageNumber}`;
        const combinedArticlesData = [...response.data];
        setInitialArticleData([]);
        setCurrentPageNumber(pageNumber);
        const newData = {
          per_page: perPage,
          data: combinedArticlesData,
          hasMore: response?.data?.length === perPage,
        };
        setArticlesDetails(newData as any);
      } else {
        setArticlesDetails(prevState => ({
          ...prevState,
          hasMore: false,
        }));
      }
    } catch (err) {
      console.error(err);
      setArticlesDetails(prevState => ({
        ...prevState,
        hasMore: false,
      }));
      // error handling
      console.warn(err);
    }
  };

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

  /* After first render only & on page change */
  useEffectAfterRender(() => {
    onChangePageLoadData(Number(router?.query?.page || "1"));
  }, [router.asPath]);

  const getArticleCard = (data: any, dataIndex: number, name: string) => {
    return (
      <div
        className={`${data.routerId} category_section sm:px-3 py-3  cursor-pointer w-full sm:w-1/2 float-left`}
        key={`category_${data.id}`}
      >
        {dataIndex !== 0 && dataIndex % 8 === 0 ? (
          <AdSlots
            key={`ads-${dataIndex}`}
            id={`div-gpt-ad-1648721024118-0${dataIndex}-${name}`}
            className=" my-4 mx-auto md:hidden"
            adSlotData={LEARN_PAGES_ADS?.[0]}
          />
        ) : dataIndex !== 0 && dataIndex % 4 === 0 ? (
          <AdSlots
            key={`ads-${dataIndex}`}
            id={`div-gpt-ad-1648721003195-0${dataIndex}-${name}`}
            className=" my-4 mx-auto md:hidden"
            adSlotData={LEARN_PAGES_ADS?.[1]}
          />
        ) : null}
        <div className="float-left w-full ">
          <ArticleCard
            bannerImage={data?._embedded?.["wp:featuredmedia"]?.[0].media_details?.sizes?.medium?.source_url}
            description={data?.title?.rendered}
            authorName={data?.coauthors?.[0]?.display_name}
            likeCount={data?.bbc_like_count}
            routePath={`/learn/${data.slug}`}
            index={dataIndex}
            createdAt={data?.date}
            readTime={data?.read_time}
          />
        </div>
      </div>
    );
  };
  if (!categoryResponse) {
    return <Custom404 />;
  }
  return (
    <>
      <Head>
        {currentPageNumber > 1 && (
          <link
            rel="prev"
            href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${
              isGettingPregnantPage ? "/getting-pregnant" : `/learn/category/${categoryResponse?.slug}`
            }${getExtraPageParams()}${
              getExtraPageParams().length ? `&page=${currentPageNumber - 1}` : `?page=${currentPageNumber - 1}`
            }`}
          />
        )}
        {currentPageNumber < categoryResponse?.count / 10 && (
          <link
            rel="next"
            href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${
              isGettingPregnantPage ? "/getting-pregnant" : `/learn/category/${categoryResponse?.slug}`
            }${getExtraPageParams()}${
              getExtraPageParams().length ? `&page=${currentPageNumber + 1}` : `?page=${currentPageNumber + 1}`
            }`}
          />
        )}
        ;
        {!isGettingPregnantPage && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        )}
      </Head>
      <MetaTags
        title={categoryResponse.name}
        seoData={categoryResponse.seo_data}
        canonicalUrl={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${
          isGettingPregnantPage ? "/getting-pregnant" : `/learn/category/${categoryResponse?.slug}`
        }${getExtraPageParams()}${
          currentPageNumber && currentPageNumber > 1
            ? getExtraPageParams().length
              ? `&page=${currentPageNumber}`
              : `?page=${currentPageNumber}`
            : ``
        }`}
        pageNumber={currentPageNumber}
      />
      <div className="px-3.5 pb-8 my-3">
        {categoryResponse && currentPageNumber <= 1 ? (
          <div className="relative mb-3">
            <Image
              layout="responsive"
              objectFit="cover"
              alt=""
              src={categoryResponse?.bbc_category_featured_image || DEFAULT_IMG_PATH()}
              width={500}
              height={230}
              priority
            />
            <div className="absolute left-[20px] bottom-[20px]">
              <h1
                className="mb-2 text-lg tracking-wider text-white"
                dangerouslySetInnerHTML={{ __html: categoryResponse.name }}
              ></h1>
              <p className="mb-2 text-sm tracking-wide text-white opacity-70">{categoryResponse?.count} Articles</p>
            </div>
          </div>
        ) : null}
        {latestArticleAPIResponse && currentPageNumber <= 1 ? (
          <div className="clearfix clear-both">
            <h3 className={`mb-4 text-base font-medium capitalize`} dangerouslySetInnerHTML={{ __html: "New article" }} />
            <AdSlots id="div-gpt-ad-1648720977785-0" className="mx-auto md:hidden my-4" adSlotData={LEARN_PAGE_ATF} />
            <div className="w-full sm:w-1/2 ">
              <ArticleCard
                bannerImage={
                  latestArticleAPIResponse?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.full?.source_url
                }
                description={latestArticleAPIResponse?.title?.rendered}
                authorName={latestArticleAPIResponse?.coauthors?.[0]?.display_name}
                likeCount={latestArticleAPIResponse?.bbc_like_count}
                routePath={`/learn/${latestArticleAPIResponse?.slug}`}
                index={0}
                createdAt={latestArticleAPIResponse?.date}
                readTime={latestArticleAPIResponse?.read_time}
              />
            </div>
          </div>
        ) : null}
        {!isGettingPregnantPage ? (
          <BreadCrumb
            breadCrumbList={breadCrumbList}
            currentPath={categoryResponse?.name || ""}
            customClassname="px-2.5 mb-2 mt-4"
          />
        ) : (
          <span />
        )}

        <div className="clearfix clear-both">
          {initialArticleData?.map((data: any, dataIndex: number) => {
            return <div key={`category_${data.id}`}>{getArticleCard(data, dataIndex, "server")}</div>;
          })}
        </div>
        {articleDetails?.data ? (
          <>
            <div className="clearfix clear-both">
              {articleDetails?.data?.map((data, dataIndex: number) => {
                return getArticleCard(data, dataIndex, "client");
              })}
            </div>
            <AdSlots id="div-gpt-ad-1648721046694-0" className="mx-auto md:hidden my-4" adSlotData={LEARN_PAGE_BTF} />
          </>
        ) : (
          <>
            <p className="mt-10 text-center">No articles available</p>
          </>
        )}
        {articleDetails.data ? (
          <CommonPagination
            totalItems={categoryResponse?.count}
            pageNo={currentPageNumber}
            noOfSlots={5}
            additionalParams={getExtraPageParams()}
            position="pre"
            pageLimit={12}
            pageTitle={categoryResponse?.slug}
          />
        ) : (
          <span />
        )}
      </div>
    </>
  );
};

CategoryScreen.getInitialProps = async (ctx: any) => {
  const { query, asPath } = ctx;
  const isGettingPregnantPage = asPath.split("?")?.[0] === "/getting-pregnant";
  if (!query.slug && !isGettingPregnantPage && ctx.res) {
    ctx.res.statusCode = 404;
    return {
      isError: true,
    };
  }

  const ssrPageNumber = query.page ? Number(query.page) : 1;
  const articlesAPI = new WpArticleApi();
  const response = await Promise.allSettled([
    articlesAPI.getArticlesByCategoryApi(isGettingPregnantPage ? "planning-a-baby" : query.slug, perPage, ssrPageNumber),
    articlesAPI.getCategoryDetailsApi(isGettingPregnantPage ? "planning-a-baby" : query.slug),
    articlesAPI.getLatestArticleByCategoryApi(isGettingPregnantPage ? "planning-a-baby" : query.slug),
  ]);
  let ssrArticleResponse = [];
  let ssrLatestArticleAPIResponse = null;
  let ssrCategoryResponse = null;
  if (response[0]?.status === "fulfilled" && response?.[0]?.value?.data) {
    const dataCpy = response?.[0]?.value?.data;
    if (dataCpy?.length) {
      dataCpy[0].routerId = `category_set_${ssrPageNumber}`;
      ssrArticleResponse = dataCpy || [];
    }
  }
  if (response[1]?.status === "fulfilled") {
    ssrCategoryResponse = response?.[1]?.value?.data?.[0] || null;
  }
  if (response[2]?.status === "fulfilled") {
    ssrLatestArticleAPIResponse = response?.[2]?.value?.data[0] || [];
  }
  if (!ssrCategoryResponse && ctx?.res) {
    ctx.res.statusCode = 404;
    return ctx.res.end("Not Found");
  }
  return {
    initialArticleResponse: ssrArticleResponse || [],
    latestArticleAPIResponse: ssrLatestArticleAPIResponse || null,
    categoryResponse: ssrCategoryResponse || null,
    ssrPageNumber,
  };
};
export default CategoryScreen;
