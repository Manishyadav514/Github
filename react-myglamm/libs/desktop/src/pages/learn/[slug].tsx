import React, { useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";

import { ValtioStore } from "@typesLib/ValtioStore";

import { useSelector } from "@libHooks/useValtioSelector";

import BreadCrumb from "../../Components/common/BreadCrumb";
import WebContentWrapper from "../../Components/common/wrappers/WebContentWrapper";
import ArticleSection from "../../Components/Article/ArticleSection";
import MediaSection from "../../Components/Article/MediaSection";
import BannerContentSection from "../../Components/Article/BannerContentSection";
import Widgets from "../../Components/home/Widgets";
import MetaTags from "@libComponents/BBCArticle/MetaTags";

import BBCArticlesAPI from "@libAPI/apis/BBCArticlesAPI";
import WpArticleApi from "@libAPI/apis/WpArticleApi";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import Custom404 from "@libPages/_error";

import { generateBreadCrumbSchema, makeBreadCrumbSchemaList } from "@libUtils/seoHelper";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const DisclaimerSection = dynamic(() => import("../../Components/Article/DisclaimerSection"));
const RelatedTopicsSection = dynamic(() => import("../../Components/Article/RelatedTopicsSection"));
interface PropTypes {
  articleDetails: any;
  isError?: any;
}

export const ArticleDetailsContext = React.createContext(null);

const breadCrumbList: {
  to: string;
  label: string;
  schemaTo: string;
}[] = [
  { to: "/", label: "Home", schemaTo: `${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}` },
  { to: "/learn", label: "Learn", schemaTo: `${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}/learn` },
];

const itemListElement = makeBreadCrumbSchemaList(breadCrumbList);

const ArticleDetails = (props: PropTypes) => {
  const { articleDetails, isError } = props;
  const consumerApi = new ConsumerAPI();

  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));

  const [widgetsData, setWidgetsData] = React.useState([]);
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
    url: `${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}/learn/${articleDetails?.slug}`,
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
      <div
        className="article-details-wrapper"
        style={{
          backgroundColor: "#f9f9f7",
        }}
      >
        <ArticleDetailsContext.Provider value={articleDetails}>
          <WebContentWrapper className="h-14 px-3 py-5 sm:px-0 bg-zinc-200 sm:bg-transparent">
            <BreadCrumb breadCrumbList={breadCrumbList} currentPath={articleDetails?.title?.rendered} />
          </WebContentWrapper>
          <BannerContentSection />
          <ArticleSection />
          <MediaSection />
          <RelatedTopicsSection />
          <DisclaimerSection />
        </ArticleDetailsContext.Provider>
        {widgetsData?.length ? <Widgets widgets={widgetsData || []} /> : null}

        <div ref={ref} />
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
    const response = await articlesAPI.getArticleDetails(query?.slug);
    const articleDetailsResponse = response?.data || [];

    if (!articleDetailsResponse?.length) {
      if (context?.res) {
        context.res.statusCode = 404;
        return context.res.end("Not Found");
      }
    }

    return {
      articleDetails: articleDetailsResponse?.[0],
      query,
      widgetsData: [],
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
// ad is coming in desktop - arun
