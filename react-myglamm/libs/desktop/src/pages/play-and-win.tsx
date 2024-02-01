import React, { useEffect } from "react";

import Head from "next/head";
import { NextPageContext } from "next";
import Router, { useRouter } from "next/router";

import useTranslation from "@libHooks/useTranslation";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { SHOP } from "@libConstants/SHOP.constant";
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";
import { IS_DUMMY_VENDOR_CODE } from "@libConstants/DUMMY_VENDOR.constant";
import { BASE_URL } from "@libConstants/COMMON.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

const SlotMachine = ({ widgets }: any) => {
  const router = useRouter();
  const { t } = useTranslation();

  const { title, description } = JSON.parse(widgets?.[0]?.meta?.widgetMeta || "{}");

  useEffect(() => {
    // Adobe Analytics [82] - Page Load - myglammxo survey - On load of Thankyou Page.
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|slot_machine|startpage",
        newPageName: "slot_machine startpage",
        subSection: "slot_machine startpage",
        assetType: "slot_machine",
        newAssetType: "slot_machine",
        platform: "desktop website",
        pageLocation: "",
        technology: "react",
      },
    };
  }, []);

  return (
    <main className="bg-color2 pt-8" style={{ minHeight: "calc(100vh - 14rem)" }}>
      {/* SEO Data Comes from server based on where the page is called */}
      <Head>
        <title key="title">{title || "Play & Win"}</title>
        <meta key="og:title" property="og:title" content={title || "Play & Win"} />

        {description && (
          <>
            <meta key="description" name="description" content={description} />
            <meta key="og:description" property="og:description" content={description} />
          </>
        )}

        <meta key="og:site_name" property="og:site_name" content={`${WEBSITE_NAME || ""} Play & Win`} />
        <meta key="og:url" property="og:url" content={`${BASE_URL()}${router.pathname}`} />
      </Head>

      <section className="flex justify-center items-center w-full h-full">
        <div className="flex flex-col items-center relative">
          <img alt="landing banner" className="rounded-md" src={widgets[2]?.multimediaDetails[0].assetDetails.url} />
        </div>
      </section>
    </main>
  );
};

SlotMachine.getInitialProps = async (ctx: NextPageContext) => {
  if (IS_DESKTOP && ctx?.res) {
    ctx.res.statusCode = 404;
    ctx.res.write("Slot Machine Page Not Found");
    return ctx.res.end();
  }
  const layoutApi = new WidgetAPI();
  const slugOrId = `mobile-site-slot-machine-widgets${IS_DUMMY_VENDOR_CODE() ? `-${SHOP.SITE_CODE}` : ""}${
    ctx.query.mb ? `-${ctx.query.mb}` : ""
  }`;

  try {
    const { data } = await layoutApi.getWidgets(slugOrId);

    return { widgets: data?.data?.data?.widget };
  } catch {
    if (!ctx.query.mb && ctx.res) {
      ctx.res.statusCode = 404;
      ctx.res.write("Slot Machine Page Not Found");
      return ctx.res.end();
    }

    if (ctx.res) {
      ctx.res.writeHead(302, { Location: ctx.pathname });
      ctx.res.end();
    } else {
      Router.replace(Router.pathname);
    }

    return {};
  }
};

export default SlotMachine;
