import React, { useState, useEffect, ReactElement } from "react";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import LazyHydrate from "react-lazy-hydration";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";
import { getSurveyData } from "@libComponents/MyGlammXO/getSurveyData";
import { SHOP } from "@libConstants/SHOP.constant";
import useTranslation from "@libHooks/useTranslation";
import MyglammXOWidgets from "@libComponents/MyGlammXO/MyglammXOWidgets";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { getVendorCode } from "@libUtils/getAPIParams";
import { v4 as uuid4 } from "uuid";
import dynamic from "next/dynamic";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { options, playSound, getSlotItems, vibrate, blurElement, buildThankYouURL } from "@libUtils/slotSounds";
import SpinButton from "@libComponents/SlotMachine/SpinButton";
import { BASE_URL } from "@libConstants/COMMON.constant";
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";
import Slot from "@libComponents/SlotMachine/Slot";
import { NextImage } from "@libComponents/NextImage";
import {
  slotMachineWinAdobeClickEvent,
  userSpinAttemptsAdobeEvent,
  slotMachineAdobeOnPageLoad,
} from "@libAnalytics/SlotMachine.Analytics";
import { isWebview } from "@libUtils/isWebview";
import useAppRedirection from "@libHooks/useAppRedirection";
import { IS_DUMMY_VENDOR_CODE } from "@libConstants/DUMMY_VENDOR.constant";
import { gaEventFunc } from "@libUtils/analytics/gtm";

const HTMLContent = dynamic(
  () => import(/* webpackChunkName: "20-homewidget" */ "@libComponents/HomeWidgets/HTMLContent-homewidget")
);

const SlotMachine = ({ widgets }: { widgets: any[] }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { redirect } = useAppRedirection();

  const { phase, title, description, platform, grantPoints, slotMachineData, backgroundColor } = JSON.parse(
    widgets?.[0]?.meta.widgetMeta || "{}"
  );

  const [freeGiftBanner, setFreeGiftBanner] = useState(false);
  const [keepGoing, setKeepGoing] = useState<any>(false);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<any>([]);
  const [shouldWin, setShouldWin] = useState(!!Math.round(Math.random()));
  const [spinActive, setSpinActive] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const SURVEY_VERSION = router.query.mb;

  useEffect(() => {
    if (keepGoing) {
      setTimeout(() => {
        setSpinActive(false);
      }, 500);
    }
  }, [keepGoing]);

  /* Check if the user already spinned the slot machine and claimed the lipstick */
  useEffect(() => {
    if (!router.query.layout) {
      const responseSlotMachineId = `${LOCALSTORAGE.SLOT_MACHINE_RESPONSE_ID}${SURVEY_VERSION ? `-${SURVEY_VERSION}` : ""}`;

      getSurveyData(phase, responseSlotMachineId).then(data => {
        if (data) {
          /* Redirecting User on load if data present */
          setLoading(true);
          if (isWebview()) {
            redirect(buildThankYouURL(router.pathname, router.query, SURVEY_VERSION));
          } else {
            router.replace(buildThankYouURL(router.pathname, router.query, SURVEY_VERSION));
          }
        }
      });
    }

    // lazy prefetch the thank you page so that it loads quickly
    setTimeout(() => {
      router.prefetch(`${router.pathname}-thankyou`);
    }, 7000);
  }, []);

  /* Post Slot Machine Winning Data */
  const postSlotWinningData = async (slotMachineID: string) => {
    const consumerApi = new ConsumerAPI();
    setLoading(true);
    try {
      const dumpValue: any = { slotMachineID, pointsEarned: 150, slotMachineStatus: { platform, status: true }, key: phase };

      /* POST Dump Call with the active slot machine data */

      if (!router.query.layout) {
        const slotMachinePromise = [
          consumerApi.postDump([
            {
              key: phase,
              value: dumpValue,
              vendorCode: getVendorCode(),
              identifier: getLocalStorageValue(LOCALSTORAGE.MEMBER_ID) || slotMachineID,
            },
          ]),
        ];

        /* Updating and Storing Data at session level - Mandatory for Apps Webview */
        const SURVEY_RESPONSE_ID = `${LOCALSTORAGE.SLOT_MACHINE_RESPONSE_ID}${SURVEY_VERSION ? `-${SURVEY_VERSION}` : ""}`;
        sessionStorage.setItem(phase, JSON.stringify(dumpValue));
        sessionStorage.setItem(SURVEY_RESPONSE_ID, slotMachineID);
        slotMachineWinAdobeClickEvent();

        /* Hit Glammpoints Credit API only incase of registered users */
        // if (userProfile && grantPoints && SHOP.ENABLE_GLAMMPOINTS) {
        //   surveyPromise.push(
        //     consumerApi.freeGlammPoint({
        //       module,
        //       platform,
        //       slug: url,
        //       type: "glammPoints",
        //       identifier: userProfile.id,
        //       vendorCode: getVendorCode(),
        //     })
        //   );
        // }

        /* Commenting api for now */
        await Promise.allSettled(slotMachinePromise);
        if (isWebview()) {
          redirect(buildThankYouURL(router.pathname, router.query, SURVEY_VERSION));
        } else {
          router.replace(buildThankYouURL(router.pathname, router.query, SURVEY_VERSION));
        }
      }
    } catch (err: any) {
      setLoading(false);
      console.error(err.response?.data?.message || err);
    }
  };

  /* Trigger Adobe on load of slot machine */
  useEffect(() => {
    slotMachineAdobeOnPageLoad();
  }, []);

  const triggerSlotSpinClick = () => {
    if (spinActive) return;

    gaEventFunc({
      eventobject: {
        webengage: {
          shareDetails: `Slot attempt ${attempt + 1}`,
        },
      },
      eventname: "Slot Machine",
    });

    if (attempt > 0) {
      setSlots(getSlotItems(slotMachineData?.slotImages, true));
    }

    userSpinAttemptsAdobeEvent(attempt + 1);
    setKeepGoing(false);
    setSpinActive(true);
    setAttempt(attempt + 1);

    playSound(options.sound.spin, "play");

    const slotElements = Array.from(document.querySelectorAll(".slot"));
    const slotContainers = Array.from(document.querySelectorAll(".slotItemsContainer"));
    slotContainers.map((element: any) => {
      element.style.transitionDuration = `0s`;
      element.style.transform = `translateY(0px)`;
    });

    setTimeout(() => {
      slotElements.map((element: any) => blurElement(element, 2));
    }, 500);

    setTimeout(() => {
      slotElements.map((element: any) => blurElement(element, 0));
    }, 3000);

    slotContainers[2].addEventListener(
      "transitionend",
      () => {
        if (!shouldWin) {
          setTimeout(() => {
            setKeepGoing(true);
            setShouldWin(true);
          }, 500);
        } else {
          vibrate(1000);
          setTimeout(() => {
            playSound(options.sound.win, "play");
            setFreeGiftBanner(true);
            setTimeout(() => {
              postSlotWinningData(uuid4());
            }, 1000);
          }, 300);
        }
      },
      { once: false }
    );
    slotContainers.map((element: any, idx: any) => {
      element.style.transitionDuration = `0s`;
      element.style.transform = `translateY(0px)`;
      setTimeout(() => {
        const duration = `4${idx > 0 ? `${idx * 100}` : "000"}`;
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = `translateY(-${225 * (50 - 1)}px)`;
      }, 100 * (idx + 1));
    });
  };

  useEffect(() => {
    console.log({ shouldWin, attempt });
    setSlots(getSlotItems(slotMachineData?.slotImages, shouldWin));
    gaEventFunc({
      eventobject: {
        webengage:{
          shareDetails: "Slot Machine Landing Page",
         }
      },
      eventname: "Page View",
    });
  }, []);

  return (
    <main
      className="min-h-screen flex items-center slotSection"
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <style>
        {`
            .spinButton {
              transform: rotateX(20deg);
              background: ${slotMachineData?.btnBgColor};
              width: 260px;
              height: 60px;
              -webkit-transition: all 0.1s;
              -moz-transition: all 0.1s;
              transition: all 0.1s;
              -webkit-box-shadow: 0px 6px 0px ${slotMachineData?.btnShadowColor};
              -moz-box-shadow: 0px 6px 0px ${slotMachineData?.btnShadowColor};
              box-shadow: 0px 8px 0px ${slotMachineData?.btnShadowColor};
            }
            
            .spinButton:active{
                -webkit-box-shadow: 0px 2px 0px ${slotMachineData?.btnShadowColor};
                -moz-box-shadow: 0px 2px 0px ${slotMachineData?.btnShadowColor};
                box-shadow: 0px 2px 0px ${slotMachineData?.btnShadowColor};
                position:relative;
                top:4px;
            } 
        `}
      </style>
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

        <meta key="og:image" property="og:image" content={widgets?.[0]?.multimediaDetails[0].assetDetails.url} />
      </Head>
      <audio src={options.sound.spin} />
      <audio src={options.sound.win} />

      <div className="hidden">
        {slotMachineData?.slotImages?.map((i: any) => {
          <NextImage src={i.image} layout="responsive" priority />;
        })}
      </div>

      <div className="w-full">
        {widgets[0] && <MyglammXOWidgets widget={widgets[0]} type="survey" />}

        <div>
          <div className="slotContainer px-2 relative flex justify-between mx-auto pointer-events-none">
            <div
              className={`absolute w-full h-full top-0 left-0 z-[51] fade-in-image ${
                freeGiftBanner || keepGoing ? "opacity-1" : "opacity-0"
              }`}
            >
              {freeGiftBanner ? (
                <img className="w-full py-2 px-0.5 rounded-sm h-full" src={slotMachineData?.CongratsImage} />
              ) : (
                <>
                  {keepGoing && <img className="w-full py-2 px-0.5 rounded-sm h-full" src={slotMachineData?.keepGoingImage} />}
                </>
              )}
            </div>
            <div className="w-full flex items-center slotItemContainer overflow-hidden my-2.5 relative">
              <LazyHydrate whenIdle>
                <>
                  <Slot index={1} items={slots[0]} />
                  <Slot index={2} items={slots[1]} />
                  <Slot index={3} items={slots[2]} />
                </>
              </LazyHydrate>
            </div>
          </div>

          {widgets[1] && (
            <LazyHydrate whenIdle>
              <HTMLContent item={widgets[1]} />
            </LazyHydrate>
          )}

          <div className={`${freeGiftBanner ? "opacity-0" : "opacity-1"}`}>
            <SpinButton
              spins={3 - attempt}
              triggerSlotSpinClick={triggerSlotSpinClick}
              spinActive={spinActive}
              slotMachineData={slotMachineData}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

SlotMachine.getInitialProps = async (ctx: any) => {
  const widgetApi = new WidgetAPI();
  const slugOrId = `mobile-site-slot-machine-widgets${IS_DUMMY_VENDOR_CODE() ? `-${SHOP.SITE_CODE}` : ""}${
    ctx.query.mb ? `-${ctx.query.mb}` : ""
  }`;

  try {
    const { data } = await widgetApi.getWidgets({ where: { slugOrId } });

    return { widgets: data?.data?.data?.widget };
  } catch {
    if (!ctx.query.mb && ctx.res) {
      ctx.res.statusCode = 404;
      return ctx.res.end("Page Not Found");
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

SlotMachine.getLayout = (children: ReactElement) => children;

export default SlotMachine;
