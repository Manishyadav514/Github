import { useCustomFormContext } from "./context/SurveyContextProvider";
import { useEffect, useState } from "react";

const ProgressBar = () => {
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const { answerCount, questionCount, surveyStyles } = useCustomFormContext();

  useEffect(() => {
    setProgressBarWidth(answerCount * (100 / questionCount));
  }, [answerCount]);

  return (
    <>
      <div
        className={`w-screen h-1 opacity-50 fixed top-0 left-0`}
        style={{ backgroundColor: `rgba(${surveyStyles?.primaryColor})` }}
      ></div>
      <div
        className={`h-1 fixed top-0 left-0 transition-all ease-in-out duration-500`}
        style={{
          width: `${progressBarWidth}%`,
          backgroundColor: `rgba(${surveyStyles?.primaryColor})`,
        }}
      ></div>
    </>
  );
};
export default ProgressBar;
