import React from "react";
import dynamic from "next/dynamic";

import { useSnapshot } from "valtio";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import { useSSO } from "@libHooks/useSSO";

import { SHOP } from "@libConstants/SHOP.constant";

import { getVendorCode } from "@libUtils/getAPIParams";

import { handleSSOEvents } from "@libAnalytics/Auth.Analytics";

import { EVENT_TYPES } from "@typesLib/Analytics";

import MyGlammAPI from "@libAPI/MyGlammAPI";

import { LOGIN_MODAL_CONSTANT, SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

const LoginModal = dynamic(() => import(/* webpackChunkName: "LoginModal" */ "@libComponents/Auth/Login.Modal"), {
  ssr: false,
});

const OnlyMobileLogin = dynamic(
  () => import(/* webpackChunkName: "OnlyMobileLoginModal" */ "@libComponents/Auth/OnlyMobileLogin.Modal"),
  { ssr: false }
);

const LoginModalsSwitch = () => {
  const LOGIN_MODAL = useSnapshot(LOGIN_MODAL_CONSTANT).state;

  function closeModal() {
    if ((LOGIN_MODAL.closeOnlyOnLoginned && checkUserLoginStatus()) || !LOGIN_MODAL.closeOnlyOnLoginned) {
      SHOW_LOGIN_MODAL({ ...LOGIN_MODAL, show: false });
    }
  }

  const { onSuccess } = useSSO();

  const MINI_LOGIN = LOGIN_MODAL.type === "onlyMobile";

  const SHOW_LOGIN = LOGIN_MODAL.show as unknown as boolean;

  if (SHOP.ENABLE_SSO && LOGIN_MODAL.show) {
    (window as any).g3Login({
      vendorCode: getVendorCode(),
      templateType: MINI_LOGIN ? "MINI" : "",
      apikey: MyGlammAPI.API_KEY,
      config: {
        onSuccess,
        eventCallbacks: (e: EVENT_TYPES, data: any) => handleSSOEvents(e, data, MINI_LOGIN),
        onClose: () => SHOW_LOGIN_MODAL({ ...LOGIN_MODAL, show: false }),
      },
    });

    return null;
  }

  if (MINI_LOGIN) {
    return (
      <OnlyMobileLogin
        show={SHOW_LOGIN}
        hide={closeModal}
        updateCart={LOGIN_MODAL.onSuccess as () => void}
        analyticsData={LOGIN_MODAL.analyticsData}
        memberTag={LOGIN_MODAL.memberTag}
        mergeCart
      />
    );
  }

  return (
    <LoginModal
      show={SHOW_LOGIN}
      onRequestClose={closeModal}
      onSuccess={LOGIN_MODAL.onSuccess}
      memberTag={LOGIN_MODAL.memberTag}
      mergeCart={LOGIN_MODAL.mergeCart}
      analyticsData={LOGIN_MODAL.analyticsData}
      hasSocialLogin={LOGIN_MODAL.hasSocialLogin}
      hasGuestCheckout={LOGIN_MODAL.hasGuestCheckout}
      overrideCheckoutURL={LOGIN_MODAL.overrideCheckoutURL}
    />
  );
};

export default LoginModalsSwitch;
