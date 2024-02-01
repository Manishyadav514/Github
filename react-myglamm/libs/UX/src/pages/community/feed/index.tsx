import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/legacy/image";

import { Feed, DesktopCommunityTab } from "community/components";
import { getPostsByTab } from "community/api";

import useFeedPost, { listingPageSEOTitle, listingPageSEOdescription } from "@libComponents/Community/useFeedPost";
import UpcomingEventsCard from "@libComponents/Community/UpcomingEventsCards";
import ManagersCard from "@libComponents/Community/ManagerCards";
import PreviousEventCards from "@libComponents/Community/PreviousEventsCards";
import CommunityBannerCards from "@libComponents/Community/CommunityBannerCards";
import Widgets from "@libComponents/HomeWidgets/Widgets";
import PopupModal from "@libComponents/PopupModal/PopupModal";

import GlammClub from "@libPages/glammclub/index";

import SuccessNotification from "@libDesktop/Components/community/SuccessNotification";
import MultipleBannerCarousel from "@libDesktop/Components/home/MultipleBannerCarousel";
import TestimonialCarousel from "@libDesktop/Components/community/TestimonialCarousel";

import { useSelector } from "@libHooks/useValtioSelector";
import useTranslation from "@libHooks/useTranslation";

import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { getConfig, transformCommunityData } from "@libUtils/getCommunityConfig";

import ErrorComponent from "@libPages/_error";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { FEATURES } from "@libStore/valtio/FEATURES.store";

import { ADOBE } from "@libConstants/Analytics.constant";
import { WEBSITE_NAME } from "@libConstants/SITE_NAME.constant";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

import {
  setCommunityLiveVideoPosts,
  setCommunityPolls,
  setCommunityQuestionPosts,
  setCommunityWallPosts,
} from "@libStore/actions/communityActions";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { SLUG } from "@libConstants/Slug.constant";
import { getSessionStorageValue, removeSessionStorageValue, setSessionStorageValue } from "@libUtils/sessionStorage";
import { getGlammClubWidgets } from "@libUtils/glammClubUtils";

const CommunitySharePlatforms = dynamic(() => import("@libComponents/Community/CommunitySharePlatforms"), {
  ssr: false,
});

const ImageCarousel = dynamic(
  () => import("@libComponents/HomeWidgets/ImageCarousel-homewidget" /* webpackChunkName: "18-homewidget" */)
);

const DownloadAppModal = dynamic(() => import("@libComponents/Community/DownloadAppModal"));

type Ttabs = "wall" | "questions" | "live_videos" | "polls" | "events" | "glamm_club";

const Community = ({ postState, eventsData, widgetsData, glammClubWidget }: any) => {
  const config = getConfig();

  const router = useRouter();
  const { feedData, widgetWallData } = useSelector((store: any) => ({
    feedData: store.communityReducer.feedData,
    widgetWallData: store.communityReducer.widgetWallData,
  }));
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState<Ttabs>((router?.query?.type as Ttabs) || "wall");
  const transformedData = transformCommunityData((router?.query?.type as Ttabs) || "wall", postState);
  const [events, setEvents] = useState(eventsData);
  const [onboardingPopup, setOnboardingPopup] = useState(false);
  const {
    activeModal,
    showShareModal,
    referenceCode,
    shareContent,
    shareData,
    onUserActionTrigger,
    onPageNavigate,
    setActiveModal,
    setShowShareModal,
    showCopiedSuccessMsg,
  } = useFeedPost();

  useEffect(() => {
    const digitalData = {
      common: {
        pageName: "web|community|community feed",
        newPageName: "community feed",
        subSection: "community",
        assetType: "community",
        newAssetType: "community",
        platform: IS_DESKTOP ? "desktop website" : ADOBE.PLATFORM,
        pageLocation: "community feed",
        technology: ADOBE.TECHNOLOGY,
      },
    };
    ADOBE_REDUCER.adobePageLoadData = digitalData;

    const data = { ...postState };
    data.isFreshReload = true;
    data.skip = postState?.posts?.length;
    if (postState?.posts?.length) {
      if (activeTab === "wall" && !feedData.wallPosts?.posts?.length) {
        setCommunityWallPosts(data, IS_DESKTOP ? widgetsData : null);
      } else if (activeTab === "questions" && !feedData.questionPosts?.posts?.length) {
        setCommunityQuestionPosts(data);
      } else if (activeTab === "live_videos" && !feedData.liveVideoPosts?.posts?.length) {
        setCommunityLiveVideoPosts(data);
      } else if (activeTab === "polls" && !feedData.polls?.posts?.length) {
        setCommunityPolls(data);
      }
    }

    if (IS_DESKTOP) {
      if (feedData) {
        const scrollPos = sessionStorage.getItem("feedScrollPos");
        if (scrollPos) {
          window.scrollTo(0, Number(scrollPos));
          sessionStorage.removeItem("feedScrollPos");
        } else {
          window.scrollTo(0, 0);
        }
      }
    } else {
      if (feedData) {
        // to be optimized
        // testPos gets set to 0 on navigation to different page from community cards
        // but when nagivating via widget its working properly
        const scrollPos = sessionStorage.getItem(SESSIONSTORAGE.COMMUNITY_SCROLL_POS_Y);
        const testPos = sessionStorage.getItem("widgetPos");
        if (scrollPos || testPos) {
          setTimeout(() => {
            window.scrollTo(0, Number(scrollPos || testPos));
            sessionStorage.removeItem(SESSIONSTORAGE.COMMUNITY_SCROLL_POS_Y);
            sessionStorage.removeItem("widgetPos");
          }, 400);
        } else {
          window.scrollTo(0, 0);
        }
      }
      setTimeout(() => {
        window.addEventListener("scroll", handleScroll);
      }, 800);
      return () => {
        window?.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (
      FEATURES.enableCommunityOnBoardingPopup &&
      !IS_DESKTOP &&
      activeTab === "wall" &&
      (!getSessionStorageValue(SESSIONSTORAGE.USER_LANDED_ON_OTHER_PAGES) ||
        getSessionStorageValue(SESSIONSTORAGE.COMMUNITY_TAB_CLICK))
    ) {
      const countOfPopupShowed = Number(getLocalStorageValue(LOCALSTORAGE.ONBOARD_COMMUNITY_POPUP_COUNT));
      if (countOfPopupShowed < 2 && !getSessionStorageValue(SESSIONSTORAGE.ONBOARD_COMMUNITY_POPUP)) {
        setLocalStorageValue(
          LOCALSTORAGE.ONBOARD_COMMUNITY_POPUP_COUNT,
          (countOfPopupShowed ? countOfPopupShowed + 1 : 1).toString()
        );
        setSessionStorageValue(SESSIONSTORAGE.ONBOARD_COMMUNITY_POPUP, "1");
        removeSessionStorageValue(SESSIONSTORAGE.COMMUNITY_TAB_CLICK);
        setTimeout(() => {
          setOnboardingPopup(true);
        }, 1000);
      }
    }
  }, [activeTab]);

  const handleScroll = () => {
    sessionStorage.setItem("widgetPos", window.scrollY.toString());
  };

  const generateWidgets = () => {
    return (widgetsData || widgetWallData)?.data?.widget?.map((item: any) => {
      if (item?.customParam) {
        return <Widgets widgets={[item]} />;
      }
      return item;
    });
  };

  useEffect(() => {
    if (
      (router.query.path !== activeTab &&
        ["wall", "polls", "questions", "live_videos"].includes(router.query.type as string)) ||
      (!router.query.path && activeTab !== "wall")
    ) {
      setActiveTab((router.query.type as Ttabs) || "wall");
    }
  }, [router]);

  const onSetActiveTab = (activeTabParam: Ttabs) => {
    router.push({ pathname: router.pathname, query: { type: activeTabParam } }, undefined, { shallow: true });
    setActiveTab(activeTabParam);
  };

  const dispatchHandler = (type: Ttabs, data: any) => {
    if (type === "wall") {
      setCommunityWallPosts(data);
    } else if (type === "questions") {
      setCommunityQuestionPosts(data);
    } else if (type === "live_videos") {
      setCommunityLiveVideoPosts(data);
    } else if (type === "polls") {
      setCommunityPolls(data);
    }
  };

  const getEventsApi = async () => {
    const widgetApi = new WidgetAPI();
    const where = { slugOrId: SLUG().COMMUNITY_EVENTS };
    const { data } = await widgetApi.getHomeWidgets({ where }, 15, 0, false);
    setEvents(data?.data?.data?.widget || []);
  };

  const generateDesktopEventsWidgets = () => {
    const eventJSX = events?.map((item: any, index: number) => {
      const icid = `home_homepage_${item?.customParam.toLowerCase()}_${item?.label.toLowerCase()}_${index + 1}`;
      switch (item?.customParam) {
        case "multimedia-carousel-4": {
          return <MultipleBannerCarousel data={item} icid={icid} key={item.id} cssClass="" />;
        }
        case "multimedia-carousel-10": {
          return <PreviousEventCards key={item?.id} item={item} icid={icid} widgetIndex={index} size={130} />;
        }
        case "image-carousel": {
          return <TestimonialCarousel data={item} key={item?.id} />;
        }
        case "multimedia-carousel-3": {
          return <UpcomingEventsCard key={item.id} item={item} icid={icid} widgetIndex={index} />;
        }
      }
    });
    if (eventJSX?.length > 0) {
      eventJSX.splice(eventJSX.length - 1, 0, <ManagersCard />);
      return eventJSX;
    }
    return <></>;
  };

  const glammPointsWidget = () => {
    return <GlammClub widgets={glammClubWidget || []} />;
  };

  const generateMobileEventsWidgets = () => {
    const eventJSX = events?.map((item: any, index: number) => {
      const icid = `home_homepage_${item?.customParam.toLowerCase()}_${item?.label.toLowerCase()}_${index + 1}`;
      switch (item?.customParam) {
        case "multimedia-carousel-4": {
          return <CommunityBannerCards key={item?.id} item={item} icid={icid} widgetIndex={index} />;
        }
        case "multimedia-carousel-10": {
          return <PreviousEventCards key={item?.id} item={item} icid={icid} widgetIndex={index} size={130} />;
        }
        case "image-carousel": {
          return <ImageCarousel key={item?.id} item={item} icid={icid} />;
        }
        case "multimedia-carousel-3": {
          return <UpcomingEventsCard key={item.id} item={item} icid={icid} widgetIndex={index} />;
        }
      }
    });
    if (eventJSX?.length > 0) {
      eventJSX.splice(eventJSX.length - 1, 0, <ManagersCard />);
      return eventJSX;
    }
    return <></>;
  };
  return (
    <div>
      <Head>
        <title key="title">{listingPageSEOTitle?.[config?.sourceVendorCode] || `${WEBSITE_NAME} Community Wall`}</title>
        <meta
          key="og:title"
          property="og:title"
          content={listingPageSEOTitle?.[config?.sourceVendorCode] || `${WEBSITE_NAME} Community Wall`}
        />
        <meta
          key="description"
          name="description"
          content={listingPageSEOdescription?.[config?.sourceVendorCode] || `${WEBSITE_NAME} Community Wall`}
        />
        <meta
          key="og:description"
          property="og:description"
          content={listingPageSEOdescription?.[config?.sourceVendorCode] || `${WEBSITE_NAME} Community Wall`}
        />
      </Head>
      {IS_DESKTOP ? (
        <div className="community-section">
          <div className="community-section__content">
            <div className={`community-section__left w-[280px]`}>
              <div className={`community-section__left-sub w-[280px]`}>
                <DesktopCommunityTab
                  config={config}
                  className="mr-5 w-full"
                  setActiveTab={onSetActiveTab}
                  activeTab={activeTab}
                  showEventsTab={true}
                />
              </div>
            </div>
            <div className={`community-section__right w-[500px]`}>
              <div className="community-section__component">
                <Feed
                  prevState={
                    feedData.wallPosts.posts.length ||
                    feedData.questionPosts.posts.length ||
                    feedData.polls.posts.length ||
                    feedData.liveVideoPosts.posts.length
                      ? feedData
                      : transformedData
                  }
                  makeDsCall={!feedData.wallPosts.posts.length}
                  onPageNavigate={onPageNavigate}
                  config={config}
                  feedByTagsPath={`${config.baseUrl}/community/tags/{tagName}`}
                  tabClassName=""
                  ErrorComponent={ErrorComponent}
                  onUserActionTrigger={onUserActionTrigger}
                  onSetActiveTabCallback={onSetActiveTab}
                  activeTab={activeTab}
                  showDesktopTabView
                  dispatchHandler={dispatchHandler}
                  getEventsData={getEventsApi}
                  eventsWidgets={generateDesktopEventsWidgets()}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Feed
          prevState={
            feedData.wallPosts.posts.length ||
            feedData.questionPosts.posts.length ||
            feedData.polls.posts.length ||
            feedData.liveVideoPosts.posts.length
              ? feedData
              : transformedData
          }
          makeDsCall={!feedData.wallPosts.posts.length}
          onPageNavigate={onPageNavigate}
          config={config}
          feedByTagsPath={`${config.baseUrl}/community/tags/{tagName}`}
          tabClassName="sticky top-12 w-full z-30"
          ErrorComponent={ErrorComponent}
          onUserActionTrigger={onUserActionTrigger}
          activeTab={activeTab}
          onSetActiveTabCallback={onSetActiveTab}
          dispatchHandler={dispatchHandler}
          getEventsData={getEventsApi}
          eventsWidgets={generateMobileEventsWidgets()}
          childrenJSX={generateWidgets()}
          // @ts-ignore
          glammPointsWidget={glammPointsWidget()}
        />
      )}

      <DownloadAppModal activeModal={activeModal} setActiveModal={setActiveModal} />
      {IS_DESKTOP ? (
        <SuccessNotification showNotification={showCopiedSuccessMsg} />
      ) : (
        <PopupModal
          show={showShareModal}
          onRequestClose={() => {
            setShowShareModal(prevState => !prevState);
          }}
        >
          <CommunitySharePlatforms
            referenceCode={referenceCode}
            shareData={shareData}
            shareContent={shareContent}
            config={config}
          />
        </PopupModal>
      )}
      <PopupModal
        show={onboardingPopup}
        onRequestClose={() => setOnboardingPopup(prevState => !prevState)}
        type={"center-modal"}
      >
        <div className="relative">
          <Image
            alt="Community Onboarding"
            src={
              t("communityOnboardPopupImageURL") ||
              "https://s3.ap-south-1.amazonaws.com/pubfiles.babychakra.net/bbc-alpha/original/Organic-Squad-Splash-Screen.jpg"
            }
            priority
            width={300}
            height={450}
          />
          <button
            className="absolute bottom-6 bg-color1 py-2 rounded-lg w-8/12 text-white mx-auto font-bold left-0 right-0"
            onClick={() => setOnboardingPopup(prevState => !prevState)}
          >
            GET STARTED
          </button>
        </div>
      </PopupModal>
    </div>
  );
};

Community.getInitialProps = async (ctx: any) => {
  const widgetApi = new WidgetAPI();
  try {
    if (ctx?.query?.type === "events") {
      const widgetApi = new WidgetAPI();
      const { data } = await widgetApi.getHomeWidgets({ where: { slugOrId: SLUG().COMMUNITY_EVENTS } }, 20, 0, false);
      return {
        eventsData: data?.data?.data?.widget || [],
        postState: null,
        widgetsData: null,
        glammClubWidget: [],
      };
    }

    if (ctx?.query?.type === "glamm_club") {
      const data = await getGlammClubWidgets();
      return {
        eventsData: [],
        postState: null,
        widgetsData: null,
        glammClubWidget: data,
      };
    }
    // Change slug to SLUG().HOME_WIDGETS
    const where = { slugOrId: SLUG().COMMUNITY_WALL_WIDGET };
    const [feedRes, widget] = await Promise.allSettled([
      getPostsByTab(getConfig(), ctx?.query?.type),
      widgetApi.getHomeWidgets({ where }, 20, 0, false),
    ]);
    if (feedRes.status === "fulfilled") {
      return {
        postState: feedRes.value.data,
        eventsData: [],
        widgetsData: (widget as any).value?.data?.data || null,
      };
    } else {
      if (ctx?.res) {
        ctx.res.statusCode = 500;
        return ctx.res.end("Something went wrong");
      }
      return {
        postState: [],
        eventsData: [],
        widgetsData: null,
        glammClubWidget: [],
      };
    }
  } catch (error) {
    console.error(`Error in Community ${ctx?.req?.url}`, error);
    if (ctx?.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end("Something went wrong");
    }

    return {
      postState: null,
      eventsData: [],
      widgetsData: null,
      glammClubWidget: [],
    };
  }
};

export default Community;
