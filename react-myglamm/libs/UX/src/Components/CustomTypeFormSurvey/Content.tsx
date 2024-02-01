import { useEffect, useRef } from "react";
import ProgressBar from "./ProgressBar";
import Navigation from "./Navigation";
import Question from "./Question";
import Form from "./Form";
import { FormSpy } from "react-final-form";
import styles from "@libStyles/css/customSurvey.module.scss";
import Checkmark from "./svg/Checkmark";
import Close from "./svg/Close";
import { useCustomFormContext } from "./context/SurveyContextProvider";
import useActiveTab from "./hooks/useActiveTab";
import useTranslation from "@libHooks/useTranslation";
import { getClientQueryParam } from "@libUtils/_apputils";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import LoadSpinner from "@libComponents/Common/LoadSpinner";

type CustomSurveyProps = {
  handleCloseButtonClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleSubmitCustomSurvey: (values?: any, additionalParams?: any) => Promise<void>;
};

const Content = ({ handleCloseButtonClick, handleSubmitCustomSurvey }: CustomSurveyProps) => {
  const questionsRef = useRef<HTMLDivElement | null>(null);
  const {
    setCurrentTab,
    changeTab,
    containerRef,
    customSurveyData,
    questionCount,
    setAnswerCount,
    surveyStyles,
    additionalParamKeys,
    showNativeSurveyError,
  } = useCustomFormContext();

  const activeTab = useActiveTab(questionsRef);
  const { t } = useTranslation();

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  const buildAdditionalParamsObject = (additionalParamKeys: any) => {
    let additonalParams: any = {};
    if (additionalParamKeys?.length > 0) {
      additionalParamKeys.forEach((key: any) => {
        const value = getClientQueryParam(key);
        if (value) {
          additonalParams[key] = value;
        }
      });
    }
    return additonalParams;
  };

  const onSubmit = async (values: any) => {
    /* transform object to q_id, q_ans format for post API */
    const qId = Object.keys(values);
    const postValues: any = [];
    qId.forEach(id => {
      const newElement = {
        q_id: id,
        q_ans: values[id],
      };
      postValues.push(newElement);
    });
    const additionalParams = buildAdditionalParamsObject(additionalParamKeys);
    handleSubmitCustomSurvey(postValues, additionalParams);
  };

  if (showNativeSurveyError) {
    return (
      <div className="bg-white">
        <div className="min-h-screen flex flex-col justify-center items-center text-xl">
          <div className="text-center">
            {t("surveyErrorText") || "Something is wrong with the customSurveyId, please check widget meta."}
          </div>
        </div>
      </div>
    );
  }

  if (customSurveyData) {
    return (
      <div
        style={{
          background: `${surveyStyles?.backgroundUrl ? `url(${surveyStyles?.backgroundUrl})` : "white"}`,
        }}
        className="bg-center bg-top bg-repeat"
      >
        <div
          className={`h-screen p-4 pt-5 flex flex-col snap-y snap-mandatory overflow-y-auto ${
            IS_DESKTOP ? "items-center" : ""
          }`}
          ref={containerRef}
        >
          <ProgressBar />

          <div className="flex items-center justify-between fixed top-5 left-4 right-4">
            <div className="w-36 h-auto">
              {surveyStyles?.logoUrl && <img src={surveyStyles?.logoUrl} alt="logo" className="object-contain" />}
            </div>
            <div className="h-4 w-4" onClick={handleCloseButtonClick}>
              <Close width="14" height="14" color={`${styles.close}`} />
            </div>
          </div>

          <Form onSubmit={onSubmit} eref={containerRef}>
            <div className="questions" ref={questionsRef}>
              {customSurveyData &&
                customSurveyData?.questionnaires?.map((item: any, qindex: any) => (
                  <div id={`${qindex}`} key={qindex} className="min-h-screen flex flex-col justify-center">
                    {qindex === questionCount - 1 && surveyStyles?.endScreenDescription && (
                      <p className="text-center font-semibold mb-10">{surveyStyles?.endScreenDescription}</p>
                    )}
                    <div className="pl-6 pr-2 md:px-0 min-h-full snap-center">
                      <div className="w-full max-w-2xl relative">
                        <Question
                          title={item?.question}
                          description={item?.description}
                          questionNumber={qindex + 1}
                          question={item}
                          qindex={qindex}
                          questionId={item?.questionId}
                        />
                        {qindex < questionCount - 1 ? (
                          <div className="flex mt-2">
                            <button
                              className="rounded px-3.5 py-2 font-bold flex items-center space-x-1 outline-none"
                              style={{
                                backgroundColor: `rgba(${surveyStyles?.primaryColor})`,
                                color: `rgba(${surveyStyles?.secondaryColor})`,
                                minWidth: "76px",
                              }}
                              onClick={event => {
                                event.preventDefault();
                                changeTab(qindex + 1);
                              }}
                            >
                              <span className="pr-1">{t("ok")}</span>
                              <span>
                                <Checkmark width="13" height="16" color={`rgba(${surveyStyles?.secondaryColor}, 1)`} />
                              </span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex mt-3">
                            <button
                              name="submit"
                              className="w-full rounded px-4 py-2 text-base font-medium outline-none"
                              style={{
                                backgroundColor: `rgba(${surveyStyles?.primaryColor})`,
                                color: `rgba(${surveyStyles?.secondaryColor})`,
                              }}
                              type="submit"
                            >
                              {t("submit")}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <FormSpy
              // @ts-ignore
              subscription={{ values: [] }}
              onChange={v => {
                const validFieldCount = Object.values(v.values).filter(x => x.length !== 0).length;
                validFieldCount && setAnswerCount(validFieldCount);
              }}
            />
          </Form>
          <Navigation />
        </div>
      </div>
    );
  } else {
    return <LoadSpinner className="inset-0 absolute m-auto w-16" />;
  }
};

export default Content;
