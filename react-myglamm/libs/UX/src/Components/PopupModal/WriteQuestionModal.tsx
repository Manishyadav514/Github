import React, { useState } from "react";
import PopupModal from "./PopupModal";
import Close from "../../../public/svg/ic-close.svg";
import useTranslation from "@libHooks/useTranslation";
import { getCountryCode, getLanguageCode, getVendorCode } from "@libUtils/getAPIParams";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import ProductAPI from "@libAPI/apis/ProductAPI";
import { adobeSubmitQuestion } from "@productLib/pdp/AnalyticsHelper";
import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

const WriteQuestionModal = ({ show, onRequestClose, product, ratings, category }: any) => {
  const { t } = useTranslation();
  const [text, setText] = useState<string>("");
  const [showModal, setShowModal] = useState(true);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const profile = useSelector((store: ValtioStore) => store.userReducer.userProfile);

  const handleSubmitQuestion = () => {
    if (text !== "") {
      const payload = {
        post: text,
        imageUrl: [],
        videoUrl: [],
        languages: [getLanguageCode()],
        isAnonymous: false,
        sku: product?.sku,
        vendorCode: getVendorCode(),
        country: getCountryCode(),
      };
      const api = new ProductAPI();
      api
        .createQuestion(payload)
        .then(() => {
          setIsSubmit(true);
          adobeSubmitQuestion(product, ratings, category);
        })
        .catch((error: any) => {
          alert(error);
        });
    } else {
      alert(t("pdpInvalidQuestion") || `Please enter valid text to ask a question.`);
    }
  };

  const onSubmitQuestion = () => {
    if (profile) {
      handleSubmitQuestion();
    } else {
      setShowModal(false);
      SHOW_LOGIN_MODAL({
        type: "onlyMobile",
        show: true,
        onSuccess: () => {
          handleSubmitQuestion();
          setShowModal(true);
          setTimeout(() => {
            onRequestClose();
          }, 3000);
        },
      });
    }
  };

  return (
    <PopupModal show={show} onRequestClose={onRequestClose} type="bottom-modal">
      <div className={`bg-white w-full rounded-t-3xl pb-5 ${showModal ? "block" : "hidden"}`} style={{ minHeight: "350px" }}>
        {isSubmit ? (
          <>
            <div className="p-4 text-right">
              <button onClick={onRequestClose}>
                <Close />
              </button>
            </div>
            <div>
              <h5 className="text-center font-semibold text-xl mb-2 w-2/3 m-auto">
                {t("pdpQuestionThankYouTitle") || `THANKYOU!`}
              </h5>
              <p className="text-center mb-4 text-lg font-thin w-2/3 m-auto">
                {t("pdpQuestionThankYouMsg") ||
                  `The team typically replies in few hours. You'll receive
            notification, stay tuned`}
              </p>
            </div>
          </>
        ) : (
          <>
            <span className="flex justify-between items-center p-4 border-b border-themeGray">
              <p className="text-sm font-bold"> {t("askAQuestion") || "Ask a Question"} </p>
              <button onClick={onRequestClose}>
                <Close />
              </button>
            </span>
            <div className="pt-5 px-4">
              <p className="text-sm capitalize pb-4"> {t("writeQuestionForProduct") || "Write a Question for This Product"} </p>
              <textarea
                rows={6}
                maxLength={1000}
                onChange={(event: any) => setText(event?.target.value)}
                placeholder={t("pdpHintQuestion") || `What would you like to ask ?`}
                className="review border border-gray-300 w-full px-2 py-1 rounded-3 outline-none  placeholder-gray-400  resize-none"
              />
              <p className="text-xs font-thin w-full text-right text-gray-500 pb-5 pt-1">
                {t("pdpQuestionCounter") || `1000 Characters limit`}
              </p>
              <button
                type="button"
                onClick={() => onSubmitQuestion()}
                className="px-4 py-2 text-white bg-ctaImg uppercase font-semibold w-full rounded-3 outline-none"
              >
                <span className="text-sm">{t("pdpCTASubmitQuestion") || `Submit`}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </PopupModal>
  );
};

export default WriteQuestionModal;
