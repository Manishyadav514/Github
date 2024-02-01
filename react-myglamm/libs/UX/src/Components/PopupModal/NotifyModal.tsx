import React, { useEffect, useState } from "react";

import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";

import { ValtioStore } from "@typesLib/ValtioStore";

import PopupModal from "./PopupModal";
import SearchLabel from "@libComponents/Search/SearchLabel";


const NotifyModal = ({ show, onRequestClose, productId }: any) => {
  const [email, setEmail] = useState("");
  const [ErrorMsg, setErrorMsg] = useState(true);
  const { t } = useTranslation();
  const profile = useSelector((store: ValtioStore) => store.userReducer.userProfile);
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (re.test(event.target.value) || email === "") {
      setErrorMsg(false);
    } else {
      setErrorMsg(true);
    }
    setEmail(event.target.value);
  };

  const notifySubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const payload = {
      consumer_email: email,
      consumer_id: profile?.id,
      source: "product_attribute_set",
      source_id: JSON.stringify(productId),
      type: "OUTOFSTOCK",
    };
    if (re.test(e.target.value) || email === "") {
      setErrorMsg(true);
    } else {
      setErrorMsg(false);
    }
    setEmail(e.target.value);
    onRequestClose();
  };

  return (
    <PopupModal show={show} onRequestClose={onRequestClose} type="bottom-modal">
      <div className="bg-white w-full rounded-t-3xl">
        <div className="pt-5 pl-3 mb-4">
          <SearchLabel label={t("notifyMe") || "Notify Me"} color="color1" textSize="text-base capitalize" />
          <p className="text-xs px-3 -mt-3" > {t("emailDescription") || "Enter your email to be first notified when it’s back in stock again."} </p>
        </div>
        <div className="pb-1">
          <form id="form" className="mb-2">
            <div className="mx-6 border-b border-gray-300">
              <input type="email" placeholder={t("emailAddress") || "Email Address"} className="outline-none w-full" value={email} onChange={handleOnChange} />
            </div>

            {ErrorMsg && email && <p className="text-sm mx-6 text-red-500">{t("validationValidEmailId")}</p>}

            <div className="flex justify-end px-4 mt-4 text-sm outline-none">
              <button
                type="submit"
                disabled={ErrorMsg}
                onClick={notifySubmit}
                className="flex rounded-sm uppercase items-center text-white text-sm font-semibold w-full justify-center relative bg-ctaImg whitespace-nowrap h-10"
              >
                {t("submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PopupModal>
  );
};

export default NotifyModal;
