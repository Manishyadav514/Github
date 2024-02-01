import QuestionV2 from "./QuestionV2";
import Form from "./Form";
import { useCustomFormContext } from "./context/SurveyContextProvider";
import { getClientQueryParam } from "@libUtils/_apputils";
import useTranslation from "@libHooks/useTranslation";
import Image from "next/legacy/image";
import { FormSpy } from "react-final-form";

type CustomSurveyProps = {
  handleSubmitCustomSurvey: (values?: any, additionalParams?: any) => Promise<void>;
  skipSurveyLandingBanner?: string;
};

const ContentV2 = ({ handleSubmitCustomSurvey, skipSurveyLandingBanner }: CustomSurveyProps) => {
  const { customSurveyData, additionalParamKeys, surveyStyles, answerCount, setAnswerCount } = useCustomFormContext();
  const { t } = useTranslation();

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

  return (
    <>
      {skipSurveyLandingBanner && (
        <Image
          priority
          width={375}
          height={333}
          src={skipSurveyLandingBanner}
          alt={t("theGreatGlammSurvey") || "The Great Glamm Survey"}
          layout="responsive"
          quality={80}
        />
      )}
      <Form onSubmit={onSubmit}>
        <div className="questions bg-[#DF2B62] pt-8">
          {customSurveyData &&
            customSurveyData?.questionnaires?.slice(0, 1).map((item: any, qindex: any) => (
              <div id={`${qindex}`} key={qindex} className="flex flex-col justify-center">
                <div className="pl-6 pr-2 md:px-0 min-h-full">
                  <div className="w-full max-w-2xl relative">
                    <QuestionV2
                      title={item?.question}
                      description={item?.description}
                      questionNumber={qindex + 1}
                      question={item}
                      qindex={qindex}
                      questionId={item?.questionId}
                    />
                  </div>
                </div>
              </div>
            ))}

          <div className="flex py-4 pl-1 pr-4 space-x-2">
            <div className="flex">
              <p className="transform rotate-180 text-center text-[10px] text-white" style={{ writingMode: "vertical-rl" }}>
                *T&C Apply
              </p>
            </div>
            <button
              name="submit"
              className="w-full text-gray-800 rounded px-4 py-3 text-base uppercase font-bold outline-none"
              style={{
                backgroundColor: `rgba(${surveyStyles?.secondaryColor})`,
              }}
              type="submit"
              disabled={answerCount === 0}
            >
              {t("claimYourFreeProduct") || "Claim your Free Product"}
            </button>
          </div>
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
    </>
  );
};

export default ContentV2;
