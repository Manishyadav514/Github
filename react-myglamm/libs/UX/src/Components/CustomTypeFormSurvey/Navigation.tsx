import ArrowDown from "./svg/ArrowDown";
import ArrowUp from "./svg/ArrowUp";
import { useCustomFormContext } from "./context/SurveyContextProvider";

const Navigation = () => {
  const { changeTab, currentTab, questionCount, surveyStyles } = useCustomFormContext();

  const next = () => {
    changeTab(currentTab + 1);
  };

  const previous = () => {
    changeTab(currentTab - 1);
  };

  return (
    <div className="flex fixed bottom-0 left-0 pt-4 pb-2 pl-4 bg-white w-full">
      <div className={"flex items-center"}>
        <button
          className={`flex items-center justify-center w-9 h-9 disabled:opacity-80 rounded-l`}
          style={{
            backgroundColor: `rgba(${surveyStyles?.primaryColor})`,
          }}
          onClick={previous}
          disabled={currentTab === 0}
          title="go to top"
        >
          <span>
            <ArrowUp width="14" height="9" color={`rgba(${surveyStyles?.secondaryColor}, 1)`} />
          </span>
        </button>
        <div
          className={`w-px h-full flex justify-center items-center`}
          style={{ backgroundColor: `rgba(${surveyStyles?.primaryColor}, 0.75)` }}
        ></div>
        <button
          className={`flex items-center justify-center w-9 h-9 disabled:opacity-80 rounded-r`}
          style={{
            backgroundColor: `rgba(${surveyStyles?.primaryColor})`,
          }}
          onClick={next}
          disabled={currentTab === questionCount - 1}
          title="go to bottom"
        >
          <span>
            <ArrowDown width="14" height="9" color={`rgba(${surveyStyles?.secondaryColor}, 1)`} />
          </span>
        </button>
      </div>
    </div>
  );
};
export default Navigation;
