import React, { useState } from "react";

import useTranslation from "@libHooks/useTranslation";

import { REGEX } from "@libConstants/REGEX.constant";

import PopupModal from "@libComponents/PopupModal/PopupModal";

import { SET_NOTIFY_MODAL } from "@libStore/valtio/MODALS.store";

const NotifyModal = ({ show }: { show: boolean }) => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  const hideModal = () => SET_NOTIFY_MODAL({ show: false });

  const onSubmitEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.toLowerCase().match(REGEX.EMAIL)) {
      hideModal();
      alert(t("notifyMeAlert") || "Email Verified");
      setEmail("");
    } else {
      setError(true);
    }
  };

  const onChangeEmailVal = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(false);
  };

  return (
    <PopupModal type="center-modal" additionClass="top-40" show={show} onRequestClose={hideModal}>
      <section className="rounded-md px-12 py-8 bg-white">
        <p className="uppercase font-bold tracking-wide text-center">{t("notifyMe")}</p>

        <form className="flex text-sm pt-6" onSubmit={onSubmitEmail}>
          <input
            type="text"
            value={email}
            style={{ width: "400px" }}
            onChange={onChangeEmailVal}
            className="px-4 h-12 shadow-inner border border-gray-300 rounded-l"
            placeholder={t("notifyInputPlaceHolder") || "Enter email to get notified"}
          />
          <button disabled={email.length < 4} type="submit" className="h-12 font-bold bg-ctaImg text-white rounded-r w-24">
            {t("submit")}
          </button>
        </form>

        <p className="text-red-500 text-xs pt-1 pl-4 h-4">{error && t("validationValidEmailId")}</p>
      </section>
    </PopupModal>
  );
};

export default NotifyModal;
