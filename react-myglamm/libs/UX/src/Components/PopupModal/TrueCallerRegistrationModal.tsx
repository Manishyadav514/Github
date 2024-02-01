import React from "react";
import PopupModal from "./PopupModal";
import { REGEX } from "@libConstants/REGEX.constant";
import useTranslation from "@libHooks/useTranslation";
import LoadSpinner from "@libComponents/Common/LoadSpinner";

export type TrueCallerProps = {
  showModal: boolean;
  trueCallerForm: any;
  handleNewUserTC: any;
};

const TrueCallerRegistrationModal = ({ showModal, trueCallerForm, handleNewUserTC }: TrueCallerProps) => {
  const { t } = useTranslation();
  return (
    <>
      <PopupModal show={showModal} onRequestClose={() => console.log("NO CLOSE !IMPORTANT MODAL")}>
        <section className="rounded-t-xl truecaller-form-wrapper">
          <form onSubmit={trueCallerForm.handleSubmit(handleNewUserTC)}>
            {/* <div  hidden className="input-element-wrapper my-2 mt-6 relative w-full">
              <label>
                Name
                <sup>* </sup>
              </label>
              <div className="mobile-input border-black ">
                <input
                  type="text"
                  name="name"
                  className="inline-block  h-8 outline-none font-bold text-sm w-full"
                  ref={trueCallerForm.register({
                    required: false,
                  })}
                  required
                />
              </div>
            </div> */}
            {/* {trueCallerForm.errors.name?.type === "required" && (
              <span hidden role="alert" className="text-red-600 text-sm">
                {t("validationEnterName")}
              </span>
            )} */}
            {/* <div hidden className="input-element-wrapper my-2 mt-6 ">
              <label>
                Email
                <sup>* </sup>
              </label>
              <div className="mobile-input border-black">
                <input
                  type="text"
                  name="email"
                  className="inline-block h-8  outline-none font-bold text-sm w-full"
                  ref={trueCallerForm.register({
                    required: false,
                    pattern: {
                      value: REGEX.EMAIL,
                      message: t("validationValidEmailId"),
                    },
                  })}
                  required
                />
              </div>
            </div> */}
            {/* {trueCallerForm.errors.email?.type === "required" && (
              <span hidden role="alert" className="text-red-600 text-sm">
                {t("validationValidEmailId")}
              </span>
            )} */}
            <div className="input-element-wrapper my-2 mt-6">
              <label>{t("referralCode")}</label>
              <div className="mobile-input border-black">
                <input
                  type="text"
                  name="referralCode"
                  className="inline-block h-8  outline-none font-bold text-sm uppercase w-full"
                  ref={trueCallerForm.register({ required: false })}
                />
              </div>
            </div>
            <button
              type="submit"
              className="h-12 uppercase my-4 w-full text-center text-sm bg-black text-white py-2 px-4 rounded-sm"
              disabled={trueCallerForm.formState.isSubmitting}
            >
              {trueCallerForm.formState.isSubmitting ? <LoadSpinner className="relative w-4 mx-auto" /> : "Continue"}
            </button>
          </form>
        </section>
      </PopupModal>
      <style jsx>
        {`
          .truecaller-form-wrapper {
            background-color: #ffffff;
            padding: 1rem;
            width: 100vw;
          }
          .input-element-wrapper {
            width: 100%;
            position: relative;
          }
          .input-element-wrapper label {
            font-size: 12px;
            color: #666;
            background: #ffffff;
            position: absolute;
            left: 5px;
            top: -7px;
            padding: 0 3px;
            text-transform: uppercase;
            z-index: 2;
          }
          .mobile-input {
            width: 100%;
            padding: 0.5rem 0.75rem;
            line-height: 1.5;
            background-color: #ffffff;
            background-clip: padding-box;
            border: 1px solid #000;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            outline: none;
            color: black;
          }
          input:disabled {
            background-color: #e2e2e2;
          }
        `}
      </style>
    </>
  );
};
export default TrueCallerRegistrationModal;
