import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";

import SurveyAPI from "@libAPI/apis/SurveyAPI";

import useTranslation from "@libHooks/useTranslation";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { customSurveySubmit, getSurveyData } from "@libComponents/MyGlammXO/getSurveyData";

import PopupModal from "./PopupModal";

import CrossIcon from "../../../public/svg/crossIconBlack.svg";

const SurveyModal = ({ show, hide, surveyId }: { show: boolean; hide: () => void; surveyId: string }) => {
  const { t } = useTranslation();

  const [surveyData, setSurveyData] = useState<any>();
  const [selectedChoice, setSelectedChoice] = useState<any>();
  const [activeState, setActiveState] = useState<"INIT" | "SUBMITING" | "SUBMITTED">("INIT");

  const { meta, questionnaires } = surveyData || {};
  const { backgroundImage, surveyStartTitle, surveyFinishedMsg, surveyCongratsImg, CTA, CTAUrl } = JSON.parse(
    meta?.surveyMeta || "{}"
  );

  const handleSubmitSurvey = () => {
    const payload = [{ q_ans: selectedChoice.label, q_id: questionnaires?.[0]?.questionId }];

    setActiveState("SUBMITING");

    customSurveySubmit(payload, surveyId, null, () => setActiveState("SUBMITTED"));
  };

  useEffect(() => {
    /* Check Survey State */
    getSurveyData("", `custom-survey-${surveyId}`, true, surveyId).then(data => data && setActiveState("SUBMITTED"));

    /* Get Survey Data */
    const surveyApi = new SurveyAPI();
    surveyApi.getCustomSurveyForm(surveyId).then(({ data }) => setSurveyData(data?.data));
  }, []);

  if (surveyData) {
    return (
      <PopupModal show={show} onRequestClose={hide} additionClass="w-full" type="center-modal">
        <form
          style={{ height: "85vh", backgroundImage }}
          className="mx-4 p-4 rounded-xl relative bg-no-repeat bg-bottom bg-contain"
        >
          <img src={meta.logoUrl} alt="Logo" className="w-1/3 mx-auto" />

          <CrossIcon width={32} height={32} className="absolute inset-x-0 mx-auto -top-10 opacity-75" onClick={hide} />

          {activeState === "SUBMITTED" ? (
            <div className="text-center px-2 pt-4">
              <section className="rounded-md pt-2 pb-3">
                {surveyCongratsImg && <img src={surveyCongratsImg} alt="Congrats" className="w-full" />}
                <p className="capitalize text-lg pb-1 font-bold">{t("congratulation") || "congratulation!"}</p>
                <div dangerouslySetInnerHTML={{ __html: surveyFinishedMsg }} />

                <Link
                  href={CTAUrl}
                  onClick={hide}
                  className="flex justify-center items-center text-white font-bold bg-black h-10 rounded-sm w-11/12 mx-auto"
                >
                  {CTA}
                </Link>
              </section>
            </div>
          ) : (
            <Fragment>
              <div className="text-white pt-1 pb-2 text-center" dangerouslySetInnerHTML={{ __html: surveyStartTitle }} />

              <p className="text-white font-bold pt-1 pb-5">Q : {questionnaires[0]?.question}</p>

              {questionnaires[0].choices.map((choice: any) => (
                <button
                  type="button"
                  key={choice.label}
                  onClick={() => setSelectedChoice(choice)}
                  className={` font-bold rounded-sm text-sm h-10 w-full flex justify-center items-center truncate mb-4 transition-all ease-in-out duration-500 ${
                    selectedChoice?.label === choice.label ? "text-white bg-black" : "bg-white"
                  }`}
                >
                  {choice.label}
                </button>
              ))}

              <button
                type="button"
                onClick={handleSubmitSurvey}
                disabled={!selectedChoice || activeState !== "INIT"}
                className="text-white bg-black font-bold relative rounded-sm w-full flex justify-center items-center uppercase text-sm h-10 transition-opacity"
              >
                {activeState === "SUBMITING" && <LoadSpinner className="w-8 inset-0 m-auto absolute" />}
                {t("submit") || "submit"}
              </button>
            </Fragment>
          )}
        </form>
      </PopupModal>
    );
  }

  return null;
};

export default SurveyModal;
