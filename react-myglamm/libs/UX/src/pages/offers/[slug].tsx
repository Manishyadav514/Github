import React, { useState, useEffect } from "react";
import Head from "next/head";

import PageAPI from "@libAPI/apis/PageAPI";
import WidgetAPI from "@libAPI/apis/WidgetAPI";

import Widgets from "@libComponents/HomeWidgets/Widgets";

interface OfferPageProps {
  homeWidgets: Array<any>;
  slug: string;
  pageData: any;
}

const OfferPage = ({ homeWidgets, slug, pageData }: OfferPageProps) => {
  const [widgets, setWidgets] = useState<any[]>(homeWidgets);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreWidgets = React.useCallback(async () => {
    const where = { where: { slugOrId: slug } };

    try {
      const widgetApi = new WidgetAPI();
      const { data } = await widgetApi.getWidgets(where, 10, widgets.length);

      if (data.data.data.widget.length === 0) {
        setHasMore(false);
      } else {
        setWidgets((widget: any) => [...widget, ...data.data.data.widget]);
      }
    } catch (error) {
      // console.error(`Failed to fetch Widgets`, error);
    }
  }, [widgets, slug]);

  useEffect(() => {
    if (widgets && widgets.length === 0) {
      const where = {
        where: {
          slugOrId: slug,
        },
      };
      const widgetApi = new WidgetAPI();
      widgetApi
        .getWidgets(where)
        .then((data: any) => {
          setWidgets(data?.data?.data?.data?.widget);
        })
        .catch((error: any) => {
          // console.error(error.message)
        });
    }
  }, [widgets, slug]);
  return (
    <>
      <Head>
        <title key="title">{pageData?.data[0]?.cms[0]?.content?.title || pageData?.data[0]?.cms[0]?.metadata?.title}</title>
        <meta key="description" name="description" content={pageData?.data[0]?.cms[0]?.metadata?.description} />
        <meta key="keywords" name="keywords" content={pageData?.data[0]?.cms[0]?.metadata?.keywords} />
      </Head>
      <main className="min-h-screen bg-white pt-1">
        {/* {widgets?.length > 0 && (
          <InfiniteScroll hasMore={hasMore} dataLength={widgets.length} loader scrollThreshold="1000px" next={fetchMoreWidgets}>
          </InfiniteScroll>
        )} */}
        <Widgets widgets={widgets} slugOrId={slug} />
      </main>
    </>
  );
};

OfferPage.getInitialProps = async (ctx: any): Promise<any> => {
  const { query } = ctx;

  const pageApi = new PageAPI();
  const pageSlug = ctx.query.slug;
  const pWhere = {
    "urlShortner.slug": `/${pageSlug}`,
  };
  let slug = "";
  const pageData = await pageApi.getPage(0, pWhere);
  if (!pageData.data.data.count) {
    ctx.res.statusCode = 404;
    return ctx.res.end("Not Found");
  }
  try {
    const regex_result = /"(?<widgetGroup>.*)"/.exec(pageData.data.data.data[0].cms[0].content.shortDescription);
    slug = regex_result?.groups?.widgetGroup || "";
  } catch (NotFoundError) {
    ctx.res.statusCode = 404;
    return ctx.res.end("Not Found");
  }

  if (query.NOSSR) {
    return { homeWidgets: undefined, slug, pageData: pageData?.data.data || {} };
  }

  const widgetApi = new WidgetAPI();

  try {
    const where = { slugOrId: slug };

    const { data } = await widgetApi.getWidgets({ where }, 15, 0);

    return {
      homeWidgets: data?.data?.data?.widget || [],
      slug,
      pageData: pageData?.data.data || {},
    };
  } catch (error: any) {
    console.error(error);

    return { homeWidgets: [], slug, pageData: pageData?.data.data || {} };
  }
};

export default OfferPage;
