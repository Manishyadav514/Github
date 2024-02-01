import React, { useState } from "react";
import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import dynamic from "next/dynamic";
import Adobe from "@libUtils/analytics/adobe";
import { getCountryCode, getLanguageCode, getVendorCode } from "@libUtils/getAPIParams";

import { ValtioStore } from "@typesLib/ValtioStore";
import ProductAPI from "@libAPI/apis/ProductAPI";
import { adobeSubmitQuestion } from "@productLib/pdp/AnalyticsHelper";

const LoginModal = dynamic(() => import(/* webpackChunkName: "LoginModal" */ "@libComponents/Auth/Login.Modal"), {
  ssr: false,
});

const SubmitQuestion = ({ ratings, product, category }: any) => {
  const [text, setText] = useState<string>("");
  const [hasSubmit, setSubmit] = useState<boolean>(false);
  const [loginModalLoaded, setLoginModalLoaded] = useState(false);
  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { t } = useTranslation();
  const profile = useSelector((store: ValtioStore) => store.userReducer.userProfile);

  const onSubmitQuestion = () => {
    if (profile) {
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
            setSubmit(true);
            adobeSubmitQuestion(product);
          })
          .catch((error: any) => {
            alert(error);
          });
      } else {
        alert(t("pdpInvalidQuestion") || `Please enter valid text to ask a question.`);
      }
    } else {
      showModal();
    }
  };

  const showModal = () => {
    if (!profile) {
      if (!loginModalLoaded) {
        setLoginModalLoaded(true);
      }
      setLoginModal(true);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      {loginModalLoaded && (
        <LoginModal
          show={loginModal}
          onSuccess={() => setIsOpen(true)}
          onRequestClose={() => {
            setLoginModal(false);
          }}
          hasGuestCheckout={false}
        />
      )}
      {!hasSubmit ? (
        <>
          <div className="relative text-sm text-black font-bold uppercase bg-underline to-red-200 w-max leading-tight mb-1">
            {t("pdpAskQuestionTitle") || `ask question about this product`}
          </div>

          <textarea
            rows={6}
            maxLength={1000}
            onChange={(event: any) => setText(event?.target.value)}
            placeholder={t("pdpHintQuestion") || `What would you like to ask ?`}
            className="review border w-full px-2 py-1 mt-2.5 rounded outline-none border-color1 placeholder-gray-500 text-sm"
          />
          <div className="text-smfont-thin w-full text-right mb-2 italic" style={{ color: "#949494" }}>
            {t("pdpQuestionCounter") || `1000 Characters limit`}
          </div>
          <button
            type="button"
            onClick={onSubmitQuestion}
            className="px-4 py-2 text-white bg-ctaImg uppercase font-semibold w-full rounded-sm outline-none"
          >
            <span className="text-sm">{t("pdpCTASubmitQuestion") || `Submit`}</span>
          </button>
        </>
      ) : (
        <div>
          <h5 className="text-center font-semibold text-xl mb-2 w-2/3 m-auto">
            {t("pdpQuestionThankYouTitle") || `THANKYOU!`}
          </h5>
          <p className="text-center mb-4 text-lfont-thin w-2/3 m-auto">
            {t("pdpQuestionThankYouMsg") ||
              `The team typically replies in few hours. You'll receive
            notification, stay tuned`}
          </p>
        </div>
      )}
    </>
  );
};

export default SubmitQuestion;
