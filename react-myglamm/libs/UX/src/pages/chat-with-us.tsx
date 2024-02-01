import React, { useEffect, useState, ReactElement } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { SHOP } from "@libConstants/SHOP.constant";
import useTranslation from "@libHooks/useTranslation";

import { isClient } from "@libUtils/isClient";
import { ADOBE } from "@libConstants/Analytics.constant";
import { getStaticUrl } from "@libUtils/getStaticUrl";
import { getClientQueryParam } from "@libUtils/_apputils";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";

const LoginModal = dynamic(() => import(/* webpackChunkName: "LoginModal" */ "@libComponents/Auth/Login.Modal"), {
  ssr: false,
});

const Chat = () => {
  const [initiated, setInitiated] = useState(false);
  const [loginModal, setLoginModal] = useState(() => isClient() && !localStorage.getItem("memberId"));
  const profile = useSelector((store: ValtioStore) => store.userReducer.userProfile);
  const router = useRouter();

  // Use variables from config to activate verloop
  const { t, isConfigLoaded } = useTranslation();
  const verloopConfig = t("verloop");

  const loadChatScript = (chatVendorJSFileName: string) => {
    // check if script is not already loaded
    if (document.querySelector(`script#${chatVendorJSFileName}`) === null) {
      const jsFile = document.createElement("script");
      jsFile.setAttribute("type", "text/javascript");
      jsFile.setAttribute("src", getStaticUrl(`/global/scripts/${chatVendorJSFileName}.js`));
      jsFile.setAttribute("id", `${chatVendorJSFileName}`);
      jsFile.setAttribute("data-verloop-base-url", `${verloopConfig?.baseURL}`);
      document.getElementsByTagName("head")[0].appendChild(jsFile);
    }
  };

  /* ADOBE EVENT - PAGELOAD - Good Points Landing Page */
  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|chat-with-us",
        newPageName: "chat-with-us",
        subSection: getClientQueryParam("flow") || "",
        assetType: "chat-with-us",
        newAssetType: "chat-with-us",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  useEffect(() => {
    // activate messenger only if user is logged in
    if (profile && isConfigLoaded) {
      const botName = getClientQueryParam("botName");
      const flow = getClientQueryParam("flow");
      const orderNumber = getClientQueryParam("orderNumber");
      if (verloopConfig?.activated || botName === "verloop") {
        loadChatScript("verloop");
        const vlInterval = setInterval(() => {
          if ((window as any).Verloop) {
            (window as any).Verloop(function (this: any) {
              // set a particular verloop recipe
              this.setRecipe(verloopConfig?.recipeID);

              // pass params to verloop to capture user details, flow & platform
              this.setCustomField("memberId", profile?.id, { scope: "user" });
              flow && this.setCustomField("flow", flow, { scope: "user" });
              orderNumber && this.setCustomField("orderNumber", orderNumber, { scope: "user" });
              this.setCustomField("platform", "msite", { scope: "user" });
              this.openWidget();
            });
            setInitiated(true);
            setTimeout(() => {
              const verloopContainer = document.getElementsByClassName("verloop-widget")[0];
              const verloopChatButton = document.getElementsByClassName("verloop-button")[0] as HTMLElement;
              const verloopCloseInterval = setInterval(() => {
                if (verloopContainer?.getAttribute("data-state") === "closed") {
                  if (verloopChatButton) {
                    verloopChatButton.style.display = "none";
                  }
                  router.push("/");
                  clearInterval(verloopCloseInterval);
                }
              }, 200);
            }, 2000);
            clearInterval(vlInterval);
          }
        }, 200);
      } else {
        // For now yellow messenger is setup as a fallback only for MGP
        if (SHOP.SITE_CODE === "mgp") {
          // Config & load Yellow Messenger
          window.ymConfig = {
            bot: process.env.NEXT_PUBLIC_YELLOW_ID,
            userId: localStorage.getItem("memberId"),
            persistentNotification: false,
            noNotification: true,
          };
          loadChatScript("ym");
          const ymInterval = setInterval(() => {
            if (window.YellowMessengerPlugin) {
              // wait till yellow messenger plugin is loaded and then open it
              window.YellowMessengerPlugin.toggleChat();
              // hide the spinner once chat is active
              setInitiated(true);
              setTimeout(() => {
                const ymFrameHolder = document.getElementById("ymFrameHolder");
                const ymDivCircle = document.getElementById("ymDivCircle");
                const ymCloseInterval = setInterval(() => {
                  if (ymFrameHolder?.style.display === "none") {
                    // hide the floating icon
                    if (ymDivCircle) {
                      ymDivCircle.style.display = "none";
                    }
                    // redirect to home after the user closes the popup
                    router.push("/");
                    clearInterval(ymCloseInterval);
                  }
                }, 200);
              }, 1000);
              clearInterval(ymInterval);
            }
          }, 200);
        }

        if (SHOP.SITE_CODE === "tmc") {
          setInitiated(true);
          // FreshChat old fallback code
          eval(`
              function initFreshChat() {
                  window.fcWidget.init({
                      "config": {
                          "cssNames": {
                              "widget": "custom_fc_frame"
                          },
                           "headerProperty": {
                               "hideChatButton": "true",
                           },
                      },
                      token: "0cc95868-db28-4bfb-92b9-81cac49d9259",
                      host: "https://wchat.freshchat.com",
                      open: true,
                  });
                  window.fcWidget.on("widget:closed", function (resp) {
                      window.history.back();
                  });
              }
              function initialize(i, t) {
                  var e; i.getElementById(t) ? initFreshChat() : ((e = i.createElement("script")).id = t, e.async = !0, e.src = "https://wchat.freshchat.com/js/widget.js", e.onload = initFreshChat, i.head.appendChild(e))
              }
              function initiateCall() {
                  initialize(document, "freshchat-js-sdk")
              }
              initiateCall();
                    `);
          return () => {
            eval(`window.fcWidget.destroy()`);
          };
        }
      }
    }
  }, [profile]);

  return (
    <div className="h-64 w-full flex justify-center items-center">
      {profile && (
        <>{!initiated ? <img className="w-12 h-12" src={getStaticUrl("/svg/spinner.svg")} alt="Loading..." /> : <></>}</>
      )}
      <LoginModal show={loginModal} onRequestClose={() => {}} hasGuestCheckout={false} />
    </div>
  );
};

Chat.getLayout = (children: ReactElement) => children;

export default Chat;
