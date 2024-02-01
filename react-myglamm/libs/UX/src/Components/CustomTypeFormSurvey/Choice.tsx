import { Field } from "react-final-form";
import styles from "@libStyles/css/customSurvey.module.scss";
import Checkmark from "./svg/Checkmark";
import { useCustomFormContext } from "./context/SurveyContextProvider";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
const Choice = ({ id, question, qindex, required, label, index, selected, setSelected, questionId }: any) => {
  const addOrRemove = (arr: any, item: any) => (arr.includes(item) ? arr.filter((i: any) => i !== item) : [...arr, item]);
  const { changeTab, questionCount, surveyStyles } = useCustomFormContext();
  return (
    <div className="" key={index}>
      <Field
        name={questionId}
        component="input"
        type={question.multiSelect ? "checkbox" : "radio"}
        value={label}
        className="sr-only peer"
        id={id}
        validate={question.required && required}
        onClick={(e: any) => {
          if (e.target.id === id) {
            if (question.multiSelect) {
              setSelected(addOrRemove(selected, e.target.id));
            } else {
              setSelected([e.target.id]);
            }
          }
          if (!question.multiSelect) {
            if (qindex < questionCount - 1) {
              changeTab(qindex + 1);
            }
          }
        }}
      />

      <div className="group">
        <div
          className={`rounded px-2 py-2 ${selected?.includes(id) ? `${styles.animateBlink} duration-[100ms]` : ""}`}
          style={{
            backgroundColor: `rgba(${surveyStyles?.primaryColor}, 0.102)`,
            boxShadow: selected?.includes(id)
              ? `rgba(${surveyStyles?.primaryColor}, 0.8) 0px 0px 0px 2px inset`
              : `rgba(${surveyStyles?.primaryColor}, 0.6) 0px 0px 0px 1px inset`,
          }}
        >
          <label className="" key={index} htmlFor={`Q${qindex}C${index}`}>
            <div className={`flex justify-between items-center ${IS_DESKTOP ? "cursor-pointer" : ""}`}>
              <div className="flex items-center">
                <div
                  className="flex items-center mr-2 bg-white border rounded-sm w-6 h-6"
                  style={{
                    borderColor: `rgba(${surveyStyles?.primaryColor}, 0.6)`,
                    backgroundColor: `${selected?.includes(id) ? `rgba(${surveyStyles?.primaryColor})` : ""}`,
                  }}
                >
                  <span
                    className="py-1 px-[7px] text-xs font-bold"
                    style={{
                      color: `${selected?.includes(id) ? "rgba(255, 255, 255, 1)" : `rgba(${surveyStyles?.primaryColor})`}`,
                    }}
                  >
                    {String.fromCharCode(index + "A".charCodeAt(0))}
                  </span>
                </div>

                <div style={{ color: `rgba(${surveyStyles?.primaryColor})` }} className="text-base">
                  <div key={index} className={`${selected?.includes(id) ? "true" : "false"}`}>
                    {label}
                  </div>
                </div>
              </div>
              <div className={`pr-1 pl-5 shrink-0 ${selected?.includes(id) ? "opacity-100" : "opacity-0"}`}>
                <Checkmark width="13" height="16" color={`rgba(${surveyStyles?.primaryColor}, 1)`} />
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Choice;
