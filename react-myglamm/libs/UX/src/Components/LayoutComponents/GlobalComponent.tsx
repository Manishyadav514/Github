import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useAmp } from "next/amp";
import { useSnapshot } from "valtio";

import { isWebview } from "@libUtils/isWebview";
import { getClientQueryParam } from "@libUtils/_apputils";
import { loadThirdPartyScripts } from "@libUtils/loadThirdPartyScripts";

import ShareAndEarnSwitch from "@libComponents/Common/ShareAndEarnSwitch";
import PortraitOverlay from "@libComponents/LayoutComponents/PortraitOverlay";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import { LOGIN_MODAL_CONSTANT, SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import { REGEX } from "@libConstants/REGEX.constant";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { SITE_CODE } from "@libConstants/GLOBAL_SHOP.constant";

import useTranslation from "@libHooks/useTranslation";

import useAdobe from "@libHooks/useAdobe";

const SurveyModal = dynamic(() => import(/* webpackChunkName: "SurveyPopup" */ "@libComponents/PopupModal/SurveyModal"), {
  ssr: false,
});
const SSOInit = dynamic(() => import(/* webpackChunkName: "SSO" */ "./SSOInit"), { ssr: false });
const LoginModalsSwitch = dynamic(
  () => import(/* webpackChunkName: "LoginLoaded" */ "@libComponents/PopupModal/LoginModalsSwitch"),
  { ssr: false }
);
const AppLoginReqModal = dynamic(
  () => import(/* webpackChunkName: "AppLoginModal" */ "@libComponents/PopupModal/AppLoginReqModal"),
  { ssr: false }
);
const Floater = dynamic(() => import(/* webpackChunkName: "Floater" */ "@libComponents/LayoutComponents/Floater"), {
  ssr: false,
});
const BottomNav = dynamic(() => import(/* webpackChunkName: "BottomNav" */ "@libComponents/Footer/BottomNav"), { ssr: false });

const GlobalComponent = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const isAmp = useAmp();
  useAdobe();
  const LOGIN_MODAL = useSnapshot(LOGIN_MODAL_CONSTANT).state;

  const SURVEY_PAGE = t("surveyUrl") && t("surveyUrl").find((x: string) => router.asPath.startsWith(x));

  const [showAppLoginModal, setShowAppLoginModal] = useState(false);
  const [surveyInfo, setSurveyInfo] = useState({ show: false, surveyId: "" });

  useEffect(() => {
    loadThirdPartyScripts();
  }, []);

  // show login modal if url contain #signup
  // this is used in marketing campaigns to get users to signup
  // v1 used to redirect tp /login
  // v2 has a login modal to no redirection is necessary
  useEffect(() => {
    if (
      (router.asPath.includes("#signup") || getClientQueryParam("authenticate")) &&
      !checkUserLoginStatus() &&
      !router.pathname.includes("/login")
    ) {
      SHOW_LOGIN_MODAL({
        show: true,
        type: "onlyMobile",
        hasSocialLogin: false,
        hasGuestCheckout: false,
        closeOnlyOnLoginned: true,
        onSuccess: () => location.reload(),
      });
    }
  }, [router.asPath]);

  useEffect(() => {
    const loginRequired = getClientQueryParam("loginRequired");
    if (loginRequired && isWebview() && !checkUserLoginStatus()) {
      setShowAppLoginModal(true);
    } else {
      setShowAppLoginModal(false);
    }

    /* Survey Popup Listner */
    addEventListener("surveyPopup", (e: any) => setSurveyInfo({ show: true, surveyId: e.detail }));

    return () => {
      removeEventListener("surveyPopup", (e: any) => setSurveyInfo({ show: true, surveyId: e.detail }));
    };
  }, []);

  return (
    <div>
      {/* TAILWIND SAFE-LIST */}
      <div hidden className="text-pink-500 px-16" />

      {/* Login Modals */}
      {typeof LOGIN_MODAL.show === "boolean" && <LoginModalsSwitch />}

      {/* SHARE - MODAL */}
      <ShareAndEarnSwitch />

      {/* APP Specific Login Prompt callback through Webview */}
      {showAppLoginModal && <AppLoginReqModal />}

      {/* Horizontal View Overlay */}
      <PortraitOverlay />

      {!isAmp && !SURVEY_PAGE && !router.pathname.match(REGEX.FLOATER_HIDE) && <Floater />}

      {!isAmp && !router.pathname.match(REGEX.HIDE_BOTTOM_NAV) && <BottomNav themed={SITE_CODE() === "mnm"} />}

      {GBC_ENV.NEXT_PUBLIC_SSO_URL && <SSOInit />}

      {surveyInfo.surveyId?.length > 0 && (
        <SurveyModal
          show={surveyInfo.show}
          surveyId={surveyInfo.surveyId}
          hide={() => setSurveyInfo({ show: false, surveyId: "" })}
        />
      )}
    </div>
  );
};

export default GlobalComponent;
