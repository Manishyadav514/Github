import React, { useEffect, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";

import BabyNamesApi from "@libAPI/apis/BBCBabyNamesAPI";

import QuestionComponentWrapper from "@libComponents/HomeWidgets/QuestionsWidget";

const getLifestageDSNumber = (lifestageId: any) => {
  if (lifestageId === 4) {
    return -1;
  }
  if (lifestageId === 5) {
    return 750;
  }
  if (lifestageId === 6) {
    return 400;
  }
};

const WrapperForOptimization = ({ trendingQuestions }: any) => {
  const [questionList, setQuestionList] = useState(trendingQuestions || []);
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  useEffect(() => {
    if (userProfile?.id && userProfile?.meta?.babyDetails?.lifestage?.type) {
      const babyNameApi = new BabyNamesApi();
      const lifestageId = getLifestageDSNumber(userProfile?.meta?.babyDetails.lifestage.type);

      babyNameApi
        .getTrendingQuestion(lifestageId)
        .then(res => {
          setQuestionList(res?.data?.data?.data?.items?.splice(0, 5));
        })
        .catch(err => {
          console.warn(err);
        });
    }
  }, [userProfile?.id]);
  return (
    <QuestionComponentWrapper
      title="Trending Questions"
      subtitle="Help other moms to answer the questions."
      questionList={questionList}
    />
  );
};

export default WrapperForOptimization;
