import React from "react";

import { SHOP } from "@libConstants/SHOP.constant";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";
import { communicationPreference } from "@typesLib/MyGlammAPI";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { addLoggedInUser } from "@libStore/actions/userActions";

const ProfileNotificationSett = () => {
  const { t } = useTranslation();

  const { id, communicationPreference } = useSelector((store: ValtioStore) => store.userReducer.userProfile) || {};

  const { sms, email, whatsApp } = communicationPreference || {};

  const userSettings = [
    { name: t("sms") || "sms", desc: t("whatsAppTransaction"), checked: sms, type: "sms" },
    { name: t("email"), desc: t("sentRegisterdMail") || "Sent to your registered email", checked: email, type: "email" },
    ...(SHOP.ENABLE_WHATSAPP
      ? [{ name: t("waUpdates"), desc: t("whatsAppTransaction"), checked: whatsApp, type: "whatsApp" }]
      : []),
  ];

  /* SENDS UPDATED NOTIFICATION DATA AND UPDATES THE PROFILE WITH IT */
  const handleCommunicationRefChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    if (name && id) {
      const updatedPreference = {
        ...communicationPreference,
        [name]: !(communicationPreference as communicationPreference)[name as keyof typeof communicationPreference],
      };

      const consumerApi = new ConsumerAPI();
      consumerApi.communicationPrefernce(updatedPreference as communicationPreference, id).then(() => {
        consumerApi.getProfile(id).then(({ data: res }) => addLoggedInUser(res.data));
      });
    }
  };

  return (
    <section className="my-6">
      <style jsx>
        {`
          .notification-box .i-switch {
            height: 20px;
            width: 36px;
          }

          .notification-box .i-switch .switch::before {
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
          }

          .notification-box .i-switch input:checked + .switch {
            background-color: #39b54a;
          }

          .notification-box .i-switch input:checked + .switch::before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(16px);
          }

          .i-switch {
            position: relative;
            display: inline-block;
            width: 51px;
            height: 28px;
            border-radius: 25px;
            box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, 0.5);
          }
          .i-switch input {
            display: none;
          }
          .i-switch input:checked + .switch {
            background-color: #bf9b30;
            box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, 0.5);
          }
          .i-switch input:checked + .switch:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
          }
          .i-switch input:focus + .switch {
            background-color: #bf9b30;
          }
          .i-switch .switch {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: 0.4s;
            transition: 0.4s;
          }
          .i-switch .switch:before {
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
          .i-switch .switch.round {
            border-radius: 34px;
          }
          .i-switch .switch.round:before {
            border-radius: 50%;
          }
        `}
      </style>

      <ul className="list-none">
        {userSettings.map(setting => (
          <li key={setting.name} className="flex items-center justify-between py-6 border-b border-gray-200">
            <div>
              <p className="text-18 uppercase">{setting.name}</p>

              <p className="text-sm text-gray-500">{setting.desc}</p>
            </div>

            <div className="notification-box pull-right">
              <label className="i-switch m-tp-13">
                <input name={setting.type} type="checkbox" onChange={handleCommunicationRefChange} checked={setting.checked} />
                <div className="switch round" />
              </label>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-sm text-gray-500 mt-12">
        <strong>{t("note")}:</strong> {t("noteText")}
      </p>
    </section>
  );
};

export default ProfileNotificationSett;
