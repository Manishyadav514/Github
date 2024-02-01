import { v4 as uuidv4 } from "uuid";

import SurveyAPI from "@libAPI/apis/SurveyAPI";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { getVendorCode } from "@libUtils/getAPIParams";
import { getLocalStorageValue } from "@libUtils/localStorage";

import { SurveyState } from "@typesLib/Survey";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

export async function getSurveyData(
  surveyPhase: string,
  SURVEY_RESPONSE_ID?: string,
  loadCustomSurvey?: boolean,
  customSurveyId?: string
): Promise<SurveyState | null> {
  const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);
  const responseSurveyId = sessionStorage.getItem(SURVEY_RESPONSE_ID || LOCALSTORAGE.RESPONSE_SURVEY_ID);
  /**
   * Get the Survey Completion Data stored in localstorage or Dump
   */
  try {
    if (memberId || responseSurveyId) {
      const consumerApi = new ConsumerAPI();
      const surveyApi = new SurveyAPI();

      const surveyTracks = JSON.parse(sessionStorage.getItem(surveyPhase) || "{}");

      if (loadCustomSurvey && customSurveyId) {
        const { data } = await surveyApi.getCustomSurveyData((memberId || responseSurveyId) as string, customSurveyId);
        const customSurveySessionKey = `custom-survey${customSurveyId ? `-${customSurveyId}` : ""}`;
        const customSurveySessionData = JSON.parse(sessionStorage.getItem(customSurveySessionKey) as string);
        return data?.data?.value?.customSurveyData || customSurveySessionData;
      }

      const { data: getDumpData } = await consumerApi.getDump(surveyPhase, (memberId || responseSurveyId) as string);

      let surveyData: SurveyState | undefined;
      if (getDumpData?.data?.[0]?.value) {
        surveyData = getDumpData?.data[0]?.value;
      } else {
        surveyData = surveyTracks;
      }

      /* Update Surveys Filled Data if present in LocalSorage or Dump */
      if (surveyData?.hasOwnProperty("pointsEarned")) return surveyData;

      return null;
    }
    return null;
  } catch {
    return null;
  }
}

export const customSurveySubmit = async (
  data: any,
  customSurveyId: string,
  additionalParams?: any,
  callback?: (arg1: string) => void
) => {
  const survetApi = new SurveyAPI();
  /* used to check if user has filled custom survey */
  const customSurveySessionKey = `custom-survey${customSurveyId ? `-${customSurveyId}` : ""}`;
  const customSurveySessionData = { customSurveyId, pointsEarned: 150 };

  sessionStorage.setItem(customSurveySessionKey, JSON.stringify(customSurveySessionData));

  /* For custom survey make a separate post call to save user response*/
  try {
    if (data) {
      /* Guest user identifier */
      const guestUserIdentifier = uuidv4().replaceAll("-", "");
      await survetApi.postCustomSurveyData({
        value: { customSurveyData: data },
        surveyId: customSurveyId,
        vendorCode: getVendorCode(),
        identifier: checkUserLoginStatus()?.memberId || guestUserIdentifier,
        additionalParams: additionalParams || {},
      });

      callback?.(guestUserIdentifier);
      // handleSubmitSurvey(guestUserIdentifier, skipSurvey, data);
    }
  } catch (error: any) {
    console.error(error);

    (window as any).evars.evar35 = error?.response?.data?.error?.message.concat(" ", "native survey");
  }
};
