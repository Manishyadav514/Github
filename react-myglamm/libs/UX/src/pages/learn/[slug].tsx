import React, { useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useSelector } from "@libHooks/useValtioSelector";
import Image from "next/legacy/image";
import { useInView } from "react-intersection-observer";
import { LazyLoadComponent } from "react-lazy-load-image-component";

import AdSlots from "@libComponents/CommonBBC/ads/AdSlots";
import OpenInApp from "@libComponents/CommonBBC/OpenInApp";
import BreadCrumb from "@libComponents/CommonBBC/BreadCrumb";
import Widgets from "@libComponents/HomeWidgets/Widgets";
import MetaTags from "@libComponents/BBCArticle/MetaTags";
import MediaSection from "@libComponents/article-details/MediaSection";
import ArticleSection from "@libComponents/article-details/ArticleSection";
import BannerContentSection from "@libComponents/article-details/BannerContentSection";

import BBCArticlesAPI from "@libAPI/apis/BBCArticlesAPI";
import WpArticleApi from "@libAPI/apis/WpArticleApi";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { LEARN_DETAIL_ATF, LEARN_DETAIL_MID, LEARN_DETAIL_BTF } from "@libConstants/AdsConstants";

import { generateBreadCrumbSchema, makeBreadCrumbSchemaList } from "@libUtils/seoHelper";

import { ValtioStore } from "@typesLib/ValtioStore";

import Custom404 from "../_error";
import { isWebview } from "@libUtils/isWebview";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const DisclaimerSection = dynamic(() => import("@libComponents/article-details/DisclaimerSection"));
const RelatedTopicsSection = dynamic(() => import("@libComponents/article-details/RelatedTopicsSection"));

interface PropTypes {
  articleDetails: any;
  query: any;
  isError?: boolean;
}

export const ArticleDetailsContext = React.createContext(null);

const breadCrumbList: {
  to: string;
  label: string;
  schemaTo: string;
}[] = [
  { to: "/", label: "Home", schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}` },
  { to: "/learn", label: "Learn", schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/learn` },
];

const itemListElement = makeBreadCrumbSchemaList(breadCrumbList);

const ArticleDetails = (props: PropTypes) => {
  const { articleDetails, isError } = props;
  const consumerApi = new ConsumerAPI();
  const [widgetsData, setWidgetsData] = React.useState([]);
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));
  const articleTitle = articleDetails?.title.rendered || "";
  const featuredMedia = articleDetails?._embedded?.["wp:featuredmedia"]?.[0];
  const IMGDATA = featuredMedia?.media_details?.sizes?.full;
  const { ref, inView } = useInView({ threshold: 0, triggerOnce: true });
  const structuredData = {
    "@context": "http://schema.org",
    "@type": articleDetails?.reviewer?.user_slug !== articleDetails?.coauthors?.[0]?.user_slug ? "Webpage" : "Article",
    mainEntityOfPage: {
      "@type": articleDetails?.reviewer?.user_slug !== articleDetails?.coauthors?.[0]?.user_slug ? "Article" : "WebPage",
      "@id": articleDetails?.link,
    },
    headline: articleTitle.replace(/"/g, "'"),
    description:
      articleDetails?.seo_data?.filter((seoTag: any) => seoTag?.attributes?.name === "description")?.[0]?.attributes?.content ||
      "",
    image: IMGDATA?.source_url || featuredMedia?.source_url,
    author: {
      "@type": "Person",
      name: articleDetails?.coauthors?.[0]?.display_name,
      url: articleDetails?.coauthors?.[0]?.user_link,
    },
    publisher: {
      "@type": "Organization",
      name: "BabyChakra.com",
      logo: {
        "@type": "ImageObject",
        url: "https://files.babychakra.com/site-images/original/new-bbc-logo.png",
      },
    },
    datePublished: articleDetails?.date,
    ...(articleDetails?.reviewer?.user_slug &&
      articleDetails?.reviewer?.user_slug !== articleDetails?.coauthors[0].user_slug && {
        lastReviewed: articleDetails?.date,
        reviewedBy: {
          "@type": "Person",
          name: articleDetails?.reviewer?.display_name,
        },
      }),
  };

  const breadcrumbSchema = generateBreadCrumbSchema(itemListElement, {
    name: articleDetails?.title?.rendered,
    url: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/learn/${articleDetails?.slug}`,
  });

  const onComponentClear = () => {
    localStorage.removeItem("user_ggp");
  };

  const callGoodGlammPointsAPI = async () => {
    if (userProfile?.id) {
      consumerApi.freeGlammPoint({
        module: "page",
        type: "glammPoints",
        platform: "facebook-read",
        identifier: userProfile?.id,
        vendorCode: "bbc",
      });
    }
  };

  useEffect(() => {
    if (inView) {
      callGoodGlammPointsAPI();
    }
  }, [inView]);

  useEffect(() => {
    window.dataLayer.push({
      event: "Article Detail Ads Loader",
    });
    window.addEventListener("beforeunload", onComponentClear);
    return () => {
      onComponentClear();
      window.addEventListener("beforeunload", onComponentClear);
    };
  }, []);

  const getWidgetResponse = async () => {
    try {
      const bbcarticlesAPI = new BBCArticlesAPI();
      const response = await bbcarticlesAPI.getArticleWidgets();
      const widget = response?.data || [];
      const widgetItems = widget?.data?.data?.widget;
      if (widgetItems?.length) {
        const newWidgets = widgetItems?.map((data: any) => {
          data.meta.article_id = articleDetails?.id;
          return data;
        });
        widget.data.data.widget = newWidgets;
        setWidgetsData(newWidgets);
      }
    } catch (err) {
      console.error(err, "promise all");
    }
  };

  React.useEffect(() => {
    getWidgetResponse();
  }, [articleDetails?.id]);

  if (isError) {
    return <Custom404 />;
  }
  return (
    <>
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </Head>
      <MetaTags
        seoData={articleDetails.seo_data}
        title={articleTitle}
        canonicalUrl={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/learn/${articleDetails?.slug}`}
      />

      {!isWebview() ? (
        <OpenInApp
          appLink={articleDetails?.bbc_share_links?.Mweb2App_open_in_app_link || "https://rw29h.app.goo.gl/nfiVP"}
          id={articleDetails?.id}
        />
      ) : null}

      <div
        className="article-details-wrapper"
        style={{
          backgroundColor: "#f9f9f7",
        }}
      >
        <ArticleDetailsContext.Provider value={articleDetails}>
          <div className="px-3 py-5 bg-zinc-100 ">
            <BreadCrumb breadCrumbList={breadCrumbList} currentPath={articleDetails?.title?.rendered} />
          </div>

          <BannerContentSection />
          <AdSlots id="div-gpt-ad-1648720809992-0" className=" mt-2 mx-auto md:hidden" adSlotData={LEARN_DETAIL_ATF} />
          <ArticleSection />
          <AdSlots id="div-gpt-ad-1648720854509-0" className=" my-4 mx-auto md:hidden" adSlotData={LEARN_DETAIL_MID} />
          <MediaSection />
          <RelatedTopicsSection />
          {!isWebview() ? (
            <div className="py-4  px-4 text-center">
              <div className="bg-cyan-100 pb-6 rounded-lg">
                <a href="http://babyc.in/l/UBneX" aria-label="pregnacy app">
                  <Image
                    src="https://files.babychakra.com/site-images/original/img-pregnacy-app-download-1.png"
                    alt="app download"
                    layout="intrinsic"
                    width={660}
                    height={300}
                  />
                  <p className="py-4">
                    Read from 10000+ Articles, <br /> topics verified by Babychakra
                  </p>
                  <p className="bg-color1 p-2.5 mx-10 rounded-lg text-white">Download BabyChakra App Today!</p>
                </a>
              </div>
            </div>
          ) : null}

          <LazyLoadComponent>
            <DisclaimerSection />
          </LazyLoadComponent>
        </ArticleDetailsContext.Provider>
        {widgetsData?.length ? <Widgets widgets={widgetsData || []} /> : null}
        <div ref={ref} />
        <AdSlots id="div-gpt-ad-1648720881106-0" className=" my-4 mx-auto md:hidden" adSlotData={LEARN_DETAIL_BTF} />
      </div>
    </>
  );
};

ArticleDetails.getInitialProps = async (context: any) => {
  const { query } = context;
  if (!query?.slug) {
    return {
      isError: true,
    };
  }

  try {
    const articlesAPI = new WpArticleApi();

    const response: any = await articlesAPI.getArticleDetails(query?.slug);
    let articleDetailsResponse = response?.data || [];
    if (!articleDetailsResponse?.length) {
      if (context?.res) {
        context.res.statusCode = 404;
        return context.res.end("Not Found");
      }
    }

    return {
      articleDetails: articleDetailsResponse?.[0],
      query,
    };
  } catch (err) {
    console.warn(err, "promise all");
  }
  if (context?.res) {
    context.res.statusCode = 404;
    return context.res.end("Not Found");
  }
  return {
    isError: true,
  };
};

export default ArticleDetails;

// pending
// follow func - will do it while doing profile integration
// recommended article
