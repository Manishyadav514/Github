import React, { useEffect, useState, ReactElement } from "react";
import router from "next/router";

import { addLoggedInUser } from "@libStore/actions/userActions";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { SHOP } from "@libConstants/SHOP.constant";
import { ADOBE } from "@libConstants/Analytics.constant";

import { ValtioStore } from "@typesLib/ValtioStore";

import Layout from "@libLayouts/Layout";
import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

function Notification() {
  const { t } = useTranslation();

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const [communicationPrefs, setCommunicationPrefs] = useState<any>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;

    const consumerApi = new ConsumerAPI();

    const updatedCommunicationPerfs = {
      ...communicationPrefs,
      [name]: !communicationPrefs[name],
    };

    setCommunicationPrefs(updatedCommunicationPerfs);

    if (userProfile?.id) {
      consumerApi
        .communicationPrefernce(updatedCommunicationPerfs, userProfile.id)
        .then(() => consumerApi.getProfile(userProfile.id).then(({ data: res }) => addLoggedInUser(res.data)));
    }
  };

  useEffect(() => {
    if (userProfile) {
      setCommunicationPrefs(userProfile.communicationPreference);
    } else if (!checkUserLoginStatus()) {
      router.replace("/");
    }
  }, [userProfile]);

  // Adobe Analytics[46] - Page Load - Notification Settings.
  useEffect(() => {
    const digitalData = {
      common: {
        pageName: "web|hamburger|account|notification",
        newPageName: "account notification",
        subSection: "my profile",
        assetType: "account",
        newAssetType: "my account",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = digitalData;
  }, []);

  console.log({ communicationPrefs });

  if (communicationPrefs) {
    return (
      <div className="notification-setting-page">
        <style jsx>
          {`
            li {
              padding: 1rem 1.2rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #c5d0de;
            }
            li:last-child {
              border: none;
            }
            h5 {
              font-size: 0.9rem;
              color: rgb(33, 37, 41);
            }
            p {
              font-size: 0.8rem;
              color: rgb(155, 155, 155);
            }
            .i-switch .switch:before {
              width: 16px;
              height: 16px;
              left: 2px;
              bottom: 2px;
            }
            .i-switch input:checked + .switch:before {
              transform: translateX(16px);
            }
            .i-switch input:checked + .switch {
              background: #39b54a;
            }

            input:checked + .switch {
              box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, 0.5);
            }
            input:checked + .switch:before {
              -webkit-transform: translateX(26px);
              -ms-transform: translateX(26px);
              transform: translateX(26px);
            }
            .switch:before {
              position: absolute;
              content: "";
              left: 0;
              bottom: 0;
              width: 28px;
              height: 28px;
              background-color: #ffffff;
              box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
              border: solid 0 #ffb900;
              -webkit-transition: 0.4s;
              transition: 0.4s;
            }
            .switch.round:before {
              border-radius: 50%;
            }
          `}
        </style>

        <h6 className="font-semibold pl-4 text-13 my-4">{t("manageNotifications")}</h6>

        <section>
          <ul role="list">
            {communicationPrefs && (
              <React.Fragment>
                <li role="listitem">
                  <div className="content">
                    <h5>{t("sms")}</h5>
                    <p> {t("sentRegisterdNumber")} </p>
                  </div>
                  <div className="checkbox-wrapper">
                    <label className="i-switch h-5 w-9 my-2.5 relative inline-block rounded-full">
                      <input
                        name="sms"
                        type="checkbox"
                        className="hidden"
                        onChange={handleChange}
                        checked={communicationPrefs.sms}
                      />
                      <div className="switch round rounded-full absolute inset-0 duration-300 bg-gray-300" />
                    </label>
                  </div>
                </li>

                {/* EMAIL */}
                <li role="listitem">
                  <div className="content">
                    <h5>{t("email")}</h5>
                    <p> {t("sentRegisterdMail")} </p>
                  </div>
                  <div className="checkbox-wrapper">
                    <label className="i-switch h-5 w-9 my-2.5 relative inline-block rounded-full">
                      <input
                        type="checkbox"
                        name="email"
                        className="hidden"
                        onChange={handleChange}
                        checked={communicationPrefs.email}
                      />
                      <div className="switch round rounded-full absolute inset-0 duration-300 bg-gray-300" />
                    </label>
                  </div>
                </li>

                {SHOP.ENABLE_WHATSAPP && (
                  <li role="listitem">
                    <div className="content">
                      <h5>{t("whatsAppUpdate")}</h5>
                      <p>{t("whatsAppTransaction")}</p>
                    </div>
                    <div className="checkbox-wrapper">
                      <label className="i-switch h-5 w-9 my-2.5 relative inline-block rounded-full">
                        <input
                          type="checkbox"
                          name="whatsApp"
                          className="hidden"
                          onChange={handleChange}
                          checked={communicationPrefs.whatsApp}
                        />
                        <div className="switch round rounded-full absolute inset-0 duration-300 bg-gray-300" />
                      </label>
                    </div>
                  </li>
                )}

                {/* Push Notification */}
                {t("pushNotification") && (
                  <li role="listitem">
                    <div className="content">
                      <h5>{t("pushNotification")}</h5>
                      <p>{t("sentPushNotification")}</p>
                    </div>
                    <div className="checkbox-wrapper">
                      <label className="i-switch h-5 w-9 my-2.5 relative inline-block rounded-full">
                        <input
                          name="pushNotification"
                          type="checkbox"
                          className="hidden"
                          onChange={handleChange}
                          checked={communicationPrefs.pushNotification}
                        />
                        <div className="switch round rounded-full absolute inset-0 duration-300 bg-gray-300" />
                      </label>
                    </div>
                  </li>
                )}
              </React.Fragment>
            )}
          </ul>
        </section>

        <p className="p-6 text-sm text-gray-500 opacity-75">
          {t("note")}:
          <br />
          {t("noteText")}
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <LoadSpinner className="w-16 absolute inset-0 m-auto" />
    </div>
  );
}

Notification.getLayout = (children: ReactElement) => <Layout footer={false}>{children}</Layout>;

export default Notification;
