import Choices from "./Choices";
import { Field } from "react-final-form";
import ArrowRight from "./svg/ArrowRight";
import Warning from "./svg/Warning";
import styles from "@libStyles/css/customSurvey.module.scss";
import useTranslation from "@libHooks/useTranslation";
import { useCustomFormContext } from "./context/SurveyContextProvider";

const Error = ({ name }: any) => (
  <Field
    name={name}
    subscription={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? (
        <div className="flex items-center justify-start text-sm text-[#AF0404] bg-[#AF0404]/10 px-2 py-1 rounded mb-4 font-medium error">
          <Warning width="24" height="24" color={`${styles.warning}`} />
          <span>{error}</span>
        </div>
      ) : null
    }
  />
);

const Question = ({ title, description, questionNumber, question, qindex, questionId }: any) => {
  const { t } = useTranslation();
  const { surveyStyles } = useCustomFormContext();

  const required = (value: any) => {
    if (value === undefined || value?.length === 0) {
      return t("surveyFormValidationErrorText") || "Oops! Please make a selection";
    }
  };

  return (
    <>
      <div className="ml-[-25px]">
        <div className="flex items-start">
          <div className="flex items-center pt-1">
            <span className="text-sm pr-0.5" style={{ color: `rgba(${surveyStyles?.primaryColor})` }}>
              {questionNumber}
            </span>
            <span className="pr-2">
              <ArrowRight width="7" height="8" color={`rgba(${surveyStyles?.primaryColor}, 1)`} />
            </span>
          </div>

          <span className="text-xl leading-6">
            {title} {question.required ? "*" : ""}
          </span>
        </div>
        {/* Description */}
        <p className="text-sm opacity-70 md:text-xl ml-5">{description}</p>
      </div>

      <div
        className="inline-block mt-8 max-w-full"
        style={{
          minWidth: "168px",
        }}
      >
        <div className="pb-4 space-y-2 flex flex-col">
          <Choices question={question} qindex={qindex} required={required} questionId={questionId} />
        </div>
      </div>
      <Error name={questionId} />
    </>
  );
};
export default Question;
