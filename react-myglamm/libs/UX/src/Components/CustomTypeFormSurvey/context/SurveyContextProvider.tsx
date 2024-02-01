import { createContext, ReactElement, useContext, useState, useRef, useEffect } from "react";
import SurveyAPI from "@libAPI/apis/SurveyAPI";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { ADOBE } from "@libConstants/Analytics.constant";
import convertHexToRGB from "@libUtils/color/surveyColor";

interface ProviderProps {
  customSurveyId?: string;
  type?: string;
  children: ReactElement;
}

interface ContextProps {
  currentTab: number;
  setCurrentTab: (value?: number) => void;
  changeTab: (value: number) => void;
  containerRef: any;
  customSurveyData: any;
  questionCount: number;
  answerCount: number;
  setAnswerCount: (value?: number) => void;
  surveyStyles: any;
  additionalParamKeys: any;
  showNativeSurveyError: any;
}

const SurveyContext = createContext<ContextProps | {}>({});

const SurveyContextProvider = ({ customSurveyId, type, children }: ProviderProps) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [customSurveyData, setCustomSurveyData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [answerCount, setAnswerCount] = useState(0);
  const [surveyStyles, setSurveyStyles] = useState<any>();
  const [additionalParamKeys, setAdditionalParamKeys] = useState([]);
  const [showNativeSurveyError, setShowNativeSurveyError] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const adobeCustomSurveyFormLoaded = () => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|mbtypeformloaded",
        newPageName: "mbtypeformloaded",
        subSection: "mbtypeformloaded",
        assetType: "typeform",
        newAssetType: "typeform",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  };

  const changeTab = (index: number) => {
    setTimeout(() => {
      const scrollOffset = Math.round(
        (containerRef.current?.scrollHeight && containerRef.current?.scrollHeight / questionCount) || innerHeight
      );
      containerRef?.current?.scrollTo({
        top: scrollOffset * index,
        left: 0,
        behavior: "smooth",
      });
    }, 800);
  };

  /* set fallback colors */
  const primaryThemeColor = "#808080";
  const secondaryThemeColor = "#ffffff";
  const processStyles = (style: any) => {
    style["primaryColor"] = style["primaryColor"] || convertHexToRGB(primaryThemeColor);
    style["secondaryColor"] = style["secondaryColor"] || convertHexToRGB(secondaryThemeColor);
    return style;
  };

  useEffect(() => {
    if (customSurveyId) {
      setLoading(true);
      const surveyApi = new SurveyAPI();
      surveyApi
        .getCustomSurveyForm(customSurveyId)
        .then(({ data: res }) => {
          setCustomSurveyData(res.data);
          setSurveyStyles(processStyles(res?.data?.meta));
          setQuestionCount(res.data?.questionnaires?.length);
          setAdditionalParamKeys(res.data?.additionalParams);
          setLoading(false);
          type === "embedded" && adobeCustomSurveyFormLoaded();
        })
        .catch(err => {
          setLoading(false);
          setShowNativeSurveyError(true);
          console.error(err.response?.data?.message || err);
        });
    }
  }, []);

  return loading ? (
    <LoadSpinner className="inset-0 absolute m-auto w-16" />
  ) : (
    <SurveyContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        changeTab,
        containerRef,
        customSurveyData,
        questionCount,
        answerCount,
        setAnswerCount,
        surveyStyles,
        additionalParamKeys,
        showNativeSurveyError,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export default SurveyContextProvider;
export const useCustomFormContext = () => useContext(SurveyContext) as ContextProps;
