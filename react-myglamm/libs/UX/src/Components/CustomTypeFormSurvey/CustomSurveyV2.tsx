import SurveyContextProvider from "./context/SurveyContextProvider";
import ContentV2 from "./ContentV2";

type CustomSurveyProps = {
  customSurveyId?: string;
  handleSubmitCustomSurvey: (values?: any, additionalParams?: any) => Promise<void>;
  type?: string;
  skipSurveyLandingBanner?: string;
};

const CustomSurveyV2 = ({ customSurveyId, handleSubmitCustomSurvey, type, skipSurveyLandingBanner }: CustomSurveyProps) => {
  return (
    <SurveyContextProvider customSurveyId={customSurveyId} type={type}>
      <ContentV2 handleSubmitCustomSurvey={handleSubmitCustomSurvey} skipSurveyLandingBanner={skipSurveyLandingBanner} />
    </SurveyContextProvider>
  );
};

export default CustomSurveyV2;
