/* eslint-disable no-nested-ternary */
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";
import Head from "next/head";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import React, { useEffect, ReactElement, useState } from "react";
import Layout from "@libLayouts/Layout";
import { useRouter } from "next/router";
import useAppRedirection from "@libHooks/useAppRedirection";
import useTranslation from "@libHooks/useTranslation";
import { ADOBE } from "@libConstants/Analytics.constant";

import { deleteCookie } from "@libUtils/cookies";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { BASE_URL } from "@libConstants/COMMON.constant";

function SpinTheWheel() {
  const router = useRouter();
  const { t } = useTranslation();

  const { redirect } = useAppRedirection();
  const redir = () => {
    redirect(t("stwRedir") || "/collection/master-the-good-life-festival");
  };
  const [showMessage, setShowMessage] = useState(false);

  /* ADOBE EVENT - PAGELOAD - Good Points Landing Page */

  useEffect(() => {
    // user landed on spin the wheel page
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|spin-the-wheel|landing",
        newPageName: "spin-the-wheel",
        subSection: "spin-the-wheel",
        assetType: "spin-the-wheel",
        newAssetType: "spin-the-wheel",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
    // if the close button appears in dom, assume the widget opened and user saw it
    const close_interval = setInterval(() => {
      const close_button = document.getElementById("wlo-close");
      if (close_button) {
        // handle a bug in wheelio script where the wheel goes above the viewport
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
        ADOBE_REDUCER.adobePageLoadData = {
          common: {
            pageName: "web|spin-the-wheel|opened",
            newPageName: "spin-the-wheel",
            subSection: "spin-the-wheel",
            assetType: "spin-the-wheel",
            newAssetType: "spin-the-wheel",
            platform: ADOBE.PLATFORM,
            pageLocation: "",
            technology: ADOBE.TECHNOLOGY,
          },
        };
        clearInterval(close_interval);
      }
    }, 800);
  }, []);
  useEffect(() => {
    try {
      const wheelioCookies = document.cookie
        .split(";")
        .map(c => c.split("=").map(x => x.trim()))
        .filter(pair => pair[0].startsWith("Wheelio2"));
      if (wheelioCookies.length > 0) {
        deleteCookie(wheelioCookies[0][0]);
      }
    } catch (e) {
      // no-op
    }

    window.eval(`
      var shopID = "42961a53-b204-4a48-dd81-08d93594af20"; var url = "https://wheelioapp.azureedge.net/app/index.min.js?v=" + new Date().getTime(); var wheelio_script = document.createElement("script"); wheelio_script.setAttribute("src", url); document.body.appendChild(wheelio_script); 
    `);
    const trigger_interval = setInterval(() => {
      const trigger_button = document.getElementById("wlo-trigger-button");
      if (trigger_button) {
        trigger_button.click();
        clearInterval(trigger_interval);
      }
    }, 200);
    const continue_interval = setInterval(() => {
      const continue_button = document.getElementById("wlo-continue-btn");
      if (continue_button) {
        continue_button.addEventListener("click", () => {
          redir();
        });
        clearInterval(continue_interval);
      }
    }, 200);
    const close_interval = setInterval(() => {
      const close_button = document.getElementById("wlo-close");
      if (close_button) {
        close_button.addEventListener("click", () => {
          redir();
        });
        clearInterval(close_interval);
      }
    }, 200);
    const message_interval = setInterval(() => {
      setShowMessage(true);
      clearInterval(message_interval);
    }, 14000);

    return () => {
      clearInterval(trigger_interval);
      clearInterval(continue_interval);
      clearInterval(close_interval);
      clearInterval(message_interval);
    };
  }, []);
  return (
    <main className="min-h-screen flex justify-center items-center">
      <Head>
        <title key="title">{"Spin the wheel"}</title>
        <meta key="og:title" property="og:title" content={"Spin the wheel"} />

        <>
          <meta key="description" name="description" content={"Spin the wheel"} />
          <meta key="og:description" property="og:description" content={"Spin the wheel"} />
        </>

        <meta key="og:site_name" property="og:site_name" content={`${WEBSITE_NAME || ""} Survey`} />
        <meta key="og:url" property="og:url" content={`${BASE_URL()}${router.pathname}`} />
      </Head>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            #wlo-trigger-button {
                display: none;
            }
            #wheelio2-app-cointainer, #wheelio2-app-container {
              height: 100vh;
            }
          `,
        }}
      />
      {!showMessage && <LoadSpinner className="absolute inset-0 w-8 m-auto" />}
    </main>
  );
}

SpinTheWheel.getLayout = (children: ReactElement) => <Layout footer={false}>{children}</Layout>;

export default SpinTheWheel;
