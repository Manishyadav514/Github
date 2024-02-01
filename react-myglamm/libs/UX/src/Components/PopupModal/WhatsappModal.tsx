import * as React from "react";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { addLoggedInUser } from "@libStore/actions/userActions";

import PopupModal from "./PopupModal";

function WhatsappModal({ show, onRequestClose }: any) {
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));
  const { t } = useTranslation();

  const handleEnableWhatsapp = async () => {
    if (profile?.id) {
      try {
        const consumerApi = new ConsumerAPI();
        await consumerApi.communicationPrefernce(
          {
            ...profile.communicationPreference,
            whatsApp: true,
          },
          profile.id
        );

        const { data } = await consumerApi.getProfile(profile.id);

        addLoggedInUser(data.data);
        onRequestClose();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <PopupModal show={show} onRequestClose={onRequestClose}>
      <div
        style={{
          textAlign: "center",
          backgroundColor: "white",
          borderTopRightRadius: "20px",
          borderTopLeftRadius: "20px",
          padding: "30px 20px 20px",
        }}
      >
        <img
          src="https://files.myglamm.com/site-images/original/icon-whatsapp.png"
          alt="Whatsapp"
          style={{
            width: "100px",
            height: "100px",
            margin: "1rem auto",
          }}
        />
        <h1 style={{ fontSize: "16px", fontWeight: "bold" }}>{t("whatsAppUpdate")}</h1>
        <h6 style={{ fontSize: "12px" }}>{t("whatsAppTransaction")}</h6>
        <p
          style={{
            fontSize: "11px",
            color: "#D3D3D3",
            lineHeight: "1.4",
            padding: "1rem 0",
          }}
        >
          {t("turfOffFeature")}
          <br />
          {t("notificationSettings")} &gt; {t("whatsappUpdates")}
        </p>
        <div className="flex justify-center items-center">
          <button
            type="button"
            style={{
              color: "#D3D3D3",
              padding: "10px 50px",
              fontWeight: "bold",
            }}
            onClick={onRequestClose}
          >
            {t("later")}
          </button>
          <button
            type="button"
            className="bg-black text-white font-bold"
            style={{
              padding: "10px 50px",
              borderRadius: "4px",
            }}
            onClick={handleEnableWhatsapp}
          >
            {t("enable")}
          </button>
        </div>
      </div>
    </PopupModal>
  );
}

export default WhatsappModal;
