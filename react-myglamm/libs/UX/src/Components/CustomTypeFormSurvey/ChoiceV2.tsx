import { Field } from "react-final-form";
import styles from "@libStyles/css/customSurvey.module.scss";
import Checkmark from "./svg/Checkmark";
import { useCustomFormContext } from "./context/SurveyContextProvider";
const ChoiceV2 = ({ id, question, qindex, label, index, selected, setSelected, questionId }: any) => {
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
        <div className={`rounded px-2 py-2 ${selected?.includes(id) ? `${styles.animateBlink} duration-[100ms]` : ""}`}>
          <label className="" key={index} htmlFor={`Q${qindex}C${index}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="flex items-center mr-4 border rounded-full w-6 h-6"
                  style={{
                    borderColor: `rgba(${surveyStyles?.primaryColor}, 0.6)`,
                    backgroundColor: `${selected?.includes(id) ? `rgba(${surveyStyles?.secondaryColor})` : "#950B29"}`,
                    fontWeight: `${selected?.includes(id) ? "bold" : ""}`,
                  }}
                >
                  <span
                    className="py-1 px-[7px] text-xs"
                    style={{
                      color: `${selected?.includes(id) ? `#950B29` : "white"}`,
                    }}
                  >
                    {String.fromCharCode(index + "A".charCodeAt(0))}
                  </span>
                </div>

                <div className="text-base text-white">
                  <div key={index} className={`${selected?.includes(id) ? "font-bold" : ""}`}>
                    {label}
                  </div>
                </div>
              </div>
              <div className={`pr-1 pl-5 shrink-0 ${selected?.includes(id) ? "opacity-100" : "opacity-0"}`}>
                <Checkmark width="13" height="16" color={`rgba(${surveyStyles?.secondaryColor}, 1)`} />
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ChoiceV2;
