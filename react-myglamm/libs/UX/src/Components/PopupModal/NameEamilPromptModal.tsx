import React, { useState } from "react";
import { useRouter } from "next/router";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import useTranslation from "@libHooks/useTranslation";

import { addLoggedInUser } from "@libStore/actions/userActions";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { showError } from "@libUtils/showToaster";
import { getLocalStorageValue } from "@libUtils/localStorage";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import PopupModal from "./PopupModal";

import CloseIcon from "../../../public/svg/group-2.svg";
import FaceBanner from "../../../public/svg/hi-face-speech-bubble.svg";

interface modalProps {
  show: boolean;
  hide: () => void;
  onSuccess?: () => void;
}

const NameEamilPromptModal = ({ show, hide, onSuccess }: modalProps) => {
  const { t } = useTranslation();

  const { pathname } = useRouter();

  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const { name, email } = userInfo;

  /* Storing User Input Data */
  const handleUserData = (e: any) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value });

  /* Submiting Profile Update Form */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const [firstName, lastName] = name.split(" ");
      const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);

      const consumerApi = new ConsumerAPI();

      if (!memberId) throw Error("Something Went Wrong!!! Please Refresh");

      /* Updating User Info and Redux Profile in Synchronized Way */
      await consumerApi.updateProfile(memberId, { firstName, lastName, email });
      const { data: profile } = await consumerApi.getProfile(memberId);

      addLoggedInUser(profile.data);
      if (onSuccess) onSuccess();
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      showError(err.response?.data?.message || err);
    }
  };

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section className="rounded-t-lg relative p-5 pt-16">
        <FaceBanner className="absolute inset-x-0 mx-auto -top-16" />
        <h3 className="font-semibold pb-4 text-center">Introduce yourself</h3>

        {pathname !== "/refer" && <CloseIcon height={20} width={20} className="absolute top-4 right-4" />}

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <span className="text-xs bg-white px-1 absolute -top-2 left-2 text-gray-800">What&apos;s your name?</span>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleUserData}
              className="border border-black rounded w-full h-12 p-2 mb-8 outline-none"
            />
          </div>
          <div className="relative">
            <span className="text-xs bg-white px-1 absolute -top-2 left-2 text-gray-800">Email id</span>
            <input
              type="text"
              name="email"
              value={email}
              onChange={handleUserData}
              className="border border-black rounded w-full h-12 p-2 mb-3 outline-none"
            />
          </div>
          <p className="text-center text-xs pb-3 px-4">
            Why we need this? Your name helps us personalise the MyGlamm experience for you.
          </p>
          <button
            type="submit"
            disabled={loading || !(email && name)}
            className="bg-ctaImg text-white font-semibold uppercase rounded text-sm w-full h-12 relative"
          >
            {loading ? <LoadSpinner className="w-10 absolute m-auto inset-0" /> : t("submit")}
          </button>
        </form>
      </section>
    </PopupModal>
  );
};

export default NameEamilPromptModal;
