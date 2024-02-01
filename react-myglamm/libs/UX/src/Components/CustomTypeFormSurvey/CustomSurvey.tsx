import SurveyContextProvider from "./context/SurveyContextProvider";
import Content from "./Content";

type CustomSurveyProps = {
  handleCloseButtonClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  customSurveyId?: string;
  handleSubmitCustomSurvey: (values?: any, additionalParams?: any) => Promise<void>;
  type?: string;
};

const CustomSurvey = ({ handleCloseButtonClick, customSurveyId, handleSubmitCustomSurvey, type }: CustomSurveyProps) => {
  return (
    <SurveyContextProvider customSurveyId={customSurveyId} type={type}>
      <Content handleCloseButtonClick={handleCloseButtonClick} handleSubmitCustomSurvey={handleSubmitCustomSurvey} />
    </SurveyContextProvider>
  );
};

export default CustomSurvey;
