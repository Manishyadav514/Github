import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSnapshot } from "valtio";
import dynamic from "next/dynamic";

import { SHOP } from "@libConstants/SHOP.constant";
import { IS_DUMMY_VENDOR_CODE } from "@libConstants/DUMMY_VENDOR.constant";

import useAdobe from "@libHooks/useAdobe";
import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import { getStaticUrl } from "@libUtils/getStaticUrl";
import { loadThirdPartyScripts } from "@libUtils/loadThirdPartyScripts";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import { MODALS } from "@libStore/valtio/MODALS.store";
import { LOGIN_MODAL_CONSTANT, SHOW_LOGIN_MODAL } from "@libStore/valtioStore";
import { getClientQueryParam } from "@libUtils/_apputils";

const NotifyModal = dynamic(() => import(/* webpackChunkName: "NotifyModal" */ "../Popupmodals/NotifyModal"), { ssr: false });

const LoginModal = dynamic(() => import(/* webpackChunkName: "LoginModal" */ "../Popupmodals/LoginModal"), { ssr: false });

const MiniCartModal = dynamic(() => import(/* webpackChunkName: "AddToCartMiniModal" */ "../Popupmodals/MiniCartModal"), {
  ssr: false,
});

const FreeProductModal = dynamic(() => import(/* webpackChunkName: "FreeProductModal" */ "../Popupmodals/FreeProductModal"), {
  ssr: false,
});

const GlobalComponent = () => {
  const { t } = useTranslation();

  const { asPath, pathname } = useRouter();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const LOGIN_MODAL = useSnapshot(LOGIN_MODAL_CONSTANT).state;
  const { NOTIFY, MINI_CART, FREE_PRODUCT_MODAL } = useSnapshot(MODALS);

  useAdobe();

  // show login modal if url contain #signup
  // this is used in marketing campaigns to get users to signup
  // v1 used to redirect tp /login
  // v2 has a login modal to no redirection is necessary
  useEffect(() => {
    if (
      (asPath.includes("#signup") || getClientQueryParam("authenticate")) &&
      !checkUserLoginStatus() &&
      !pathname.includes("/login")
    ) {
      SHOW_LOGIN_MODAL({
        show: true,
        closeOnlyOnLoginned: true,
      });
    }
  }, [asPath]);

  // Use variables from config to activate verloop
  const verloopConfig = t("verloop");

  useEffect(() => {
    const verloopInterval = setInterval(() => {
      if (!(window as any).Verloop && userProfile && verloopConfig?.activated && !IS_DUMMY_VENDOR_CODE()) {
        setTimeout(() => {
          const insertInterval = setInterval(() => {
            const existingScript = document.getElementById("verloop");
            if (!existingScript) {
              const jsFile = document.createElement("script");
              jsFile.setAttribute("type", "text/javascript");
              jsFile.setAttribute("src", getStaticUrl("/global/scripts/verloop.js"));
              jsFile.setAttribute("id", "verloop");
              jsFile.setAttribute("data-profile", `${userProfile.id}`);
              jsFile.setAttribute(
                "data-verloop-base-url",
                `${verloopConfig?.baseURL.endsWith("/") ? verloopConfig?.baseURL.slice(0, -1) : verloopConfig?.baseURL}`
              );
              jsFile.setAttribute("data-verloop-recipe-id", `${verloopConfig?.recipeID}`);
              document.getElementsByTagName("head")[0].appendChild(jsFile);
            }
            clearInterval(insertInterval);
          }, 200);
        }, 1000);
      }
      clearInterval(verloopInterval);
    }, 200);
  }, [userProfile]);

  /* All 3rd Party Script load - GTM Recaptcha */
  useEffect(() => {
    loadThirdPartyScripts();
  }, []);

  return (
    <>
      {/* LOGIN MODAL */}
      {typeof LOGIN_MODAL.show === "boolean" && <LoginModal />}

      {/* NOTIFY MODAL */}
      {typeof NOTIFY.show === "boolean" && <NotifyModal show={NOTIFY.show} />}

      {/* Mini Cart MODAL */}
      {typeof MINI_CART.show === "boolean" && <MiniCartModal show={MINI_CART.show} />}

      {/* Free Product MODAL */}
      {typeof FREE_PRODUCT_MODAL.show === "boolean" && <FreeProductModal />}

      {!userProfile && verloopConfig?.activated && !IS_DUMMY_VENDOR_CODE() && (
        <div className={`verloop-button-f bg-color1`} onClick={() => SHOW_LOGIN_MODAL({ show: true })}>
          <div className="verloop-livechat-logo-f" />
        </div>
      )}

      {SHOP.SITE_CODE === "bbc" && (
        <iframe
          title="bbc"
          frameBorder={0}
          id="login_iframe"
          className="hidden"
          src={`https://${process.env.NEXT_PUBLIC_PRODUCT_ENV === "ALPHA" ? "release" : "www"}.babychakra.com/transfer-token`}
        />
      )}
    </>
  );
};

export default GlobalComponent;
