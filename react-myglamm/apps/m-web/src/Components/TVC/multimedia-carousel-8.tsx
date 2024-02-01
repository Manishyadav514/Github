import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useTranslation from "@libHooks/useTranslation";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import { makePopup } from "@typeform/embed";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import Adobe from "@libUtils/analytics/adobe";
import { getVendorCode } from "@libUtils/getAPIParams";
import { ADOBE } from "@libConstants/Analytics.constant";
import { isWebview } from "@libUtils/isWebview";
import useAppRedirection from "@libHooks/useAppRedirection";

import { ValtioStore } from "@typesLib/ValtioStore";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";
import { useSelector } from "@libHooks/useValtioSelector";

const LoginModal = dynamic(() => import(/* webpackChunkName: "LoginModal" */ "@libComponents/Auth/Login.Modal"), {
  ssr: false,
});

const MultimediaCarousel8 = ({ item }: any) => {
  const router = useRouter();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);
  const [logined, setLogined] = useState(false);
  const [loginFirstcall, setLoginFirstCall] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [limit, setLimit] = useState(3);
  // const [productsData, setProductsData] = useState(item.multimediaDetails);
  const [productsData, setProductsData] = useState(item?.multimediaDetails);
  const [formUrl, setFormUrl] = useState();
  const [isFormSubmitted, setFormSumitted] = useState(false);

  const { redirect } = useAppRedirection();

  //const router = useRouter();

  // useEffect(() => {
  //   setProductsData(item?.multimediaDetails);
  // }, []);
  const { t } = useTranslation();

  const widgetMeta = item?.meta?.widgetMeta ? JSON.parse(item?.meta?.widgetMeta) : "";

  const viewMoreProducts = () => {
    const newLimit = limit + 3;
    if (newLimit > productsData.length) {
      setLimit(productsData.length);
    } else {
      setLimit(newLimit);
    }
  };

  /* On Load User Quiz Status Check */
  useEffect(() => {
    if (userProfile && logined) {
      openTypeForm(formUrl);
    }
  }, [userProfile, logined]);

  const surveyClickAdobeEvent = () => {
    (window as any).digitalData = {
      common: {
        linkName: "web|focusgroup survey",
        linkPageName: "web|focusgroup survey",
        newLinkPageName: ADOBE.ASSET_TYPE.FOCUS_GROUP_SURVEY,
        assetType: ADOBE.ASSET_TYPE.FOCUS_GROUP_SURVEY,
        newAssetType: ADOBE.ASSET_TYPE.FOCUS_GROUP_SURVEY,
        subSection: ADOBE.ASSET_TYPE.FOCUS_GROUP_SURVEY,
        platform: ADOBE.PLATFORM,
        ctaName: "Take Survey",
        pageLocation: "",
      },
      user: Adobe.getUserDetails(userProfile),
    };
    Adobe.Click();
  };

  const openTypeForm = async (typeFormURL: any) => {
    const key = typeFormURL?.split("key=")[1];
    setFormUrl(typeFormURL);
    surveyClickAdobeEvent();

    if (userProfile) {
      const consumerApi = new ConsumerAPI();
      const { data: dumpData } = await consumerApi.getDump(key, userProfile.id);
      if (dumpData?.data[0]?.value || getLocalStorageValue(key)) {
        alert("You have already submitted the form");
      } else {
        const url = `${typeFormURL}#id=${userProfile.id}&name=${userProfile.firstName}&email=${userProfile.email}`;
        makePopup(url, {
          mode: "popover",
          hideScrollbars: true,
          hideHeaders: false,
          hideFooter: false,
          opacity: 1,
          buttonText: "Let's Go",
          autoOpen: false,
          autoClose: 0,
          delay: 100,

          onSubmit: async () => {
            submitQuiz(typeFormURL);
          },
        }).open();
      }
    } else {
      handleRedirection("/login");
    }
  };

  /* For Webview and Normal Web Redirection */
  const handleRedirection = (url: string) => {
    // eslint-disable-next-line no-shadow
    if (isWebview()) {
      redirect(url);
    } else if (url === "/login") {
      setLoginFirstCall(true);
      setShowLoginModal(true);
    } else {
      router.push(url);
    }
  };

  const submitQuiz = (url: any) => {
    const typeFormKey = url.split("key=")[1];
    const { id, firstName, phoneNumber } = userProfile || {};

    const consumerApi = new ConsumerAPI();
    consumerApi
      .postDump([
        {
          vendorCode: getVendorCode(),
          identifier: id,
          key: typeFormKey,
          value: { [typeFormKey]: "true" },
        },
      ])
      .then(data => {
        setLocalStorageValue(typeFormKey, "true");
        alert("Thanks for participating");
      })
      .catch(() =>
        // eslint-disable-next-line no-alert
        alert("Oops!!! Something Went Wrong. Can you please refresh and try again")
      );
  };
  if (productsData.length === 0) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="MultipleVerticalBanner bg-white mx-auto">
        <div className="h-auto">
          {productsData?.slice(0, limit)?.map((media: any, index: number) => (
            <React.Fragment key={media.assetDetails?.url}>
              {media?.url === "NoRedirection" ? (
                <img src={media.assetDetails?.url} alt={media.assetDetails?.name} className="w-full" />
              ) : (
                <a
                  role="presentation"
                  onClick={() => {
                    openTypeForm(media?.url);
                  }}
                  aria-label={media.assetDetails?.name}
                >
                  <img src={media.assetDetails?.url} alt={media.assetDetails?.name} className="w-full" />
                </a>
              )}
            </React.Fragment>
          ))}
          {productsData && limit < productsData?.length && (
            <div
              className="text-center pt-4 pb-2"
              style={{
                background: widgetMeta.bgColor ? widgetMeta.bgColor : `url(${widgetMeta.bgImageUrl})`,
              }}
            >
              {" "}
              <p className="block text-xs tracking-widest font-thin text-center text-black">{t("viewMore")}</p>
              <img
                alt="down arrow"
                role="presentation"
                onClick={viewMoreProducts}
                className="inline-block w-3.5"
                src="https://files.myglamm.com/site-images/original/down-chevron.png"
              />
            </div>
          )}
        </div>
        {loginFirstcall && (
          <LoginModal
            show={showLoginModal}
            hasGuestCheckout={false}
            onSuccess={() => setLogined(true)}
            onRequestClose={() => setShowLoginModal(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MultimediaCarousel8;
