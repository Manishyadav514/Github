import React, { useState } from "react";
import dynamic from "next/dynamic";

import { PDPProd } from "@typesLib/PDP";

import useTranslation from "@libHooks/useTranslation";
import useEffectAfterRender from "@libHooks/useEffectAfterRender";

import ProductAPI from "@libAPI/apis/ProductAPI";

import QuestionList from "@libComponents/PDP/Reviews/QuestionList";

const SubmitQuestionForm = dynamic(
  () => import(/* webpackChunkName: "SubmitQuestionForm" */ "@libComponents/PDP/Reviews/SubmitQuestion"),
  {
    ssr: false,
  }
);

interface QuestionsProps {
  showForms: boolean;
  showQuestionForm: boolean;
  product: PDPProd;
  adobeButtonClickEvent: (arg1: string, arg2: string) => void;
}

const CustomerQuestion = ({ showQuestionForm, adobeButtonClickEvent, showForms, product }: QuestionsProps) => {
  const { ratings, categories, questions, id, productTag } = product;

  const { t } = useTranslation();

  const [questionsState, setQuestionsState] = useState({
    totalCount: 0,
    skip: 5,
    data: questions,
  });

  /* Reset Questions on CSR */
  useEffectAfterRender(() => {
    setQuestionsState({ ...questionsState, data: questions });
  }, [id]);

  const onLoadMoreQuestions = () => {
    const where = {
      postType: "productQuestion",
      statusId: 1,
      productTag,
    };

    const api = new ProductAPI();
    api.getQuestions(where, 5, questionsState.skip).then((res: any) => {
      const questionsStateTemp = JSON.parse(JSON.stringify(questionsState));
      questionsStateTemp.totalCount = res?.data?.data?.count;
      questionsStateTemp.data = [...questionsState?.data, ...res?.data?.data?.data];
      questionsStateTemp.skip = questionsState.skip + 5;
      setQuestionsState(questionsStateTemp);
    });
  };

  return (
    <div className="ReviewAccordion bg-white mb-2 mt-1" id="review">
      <div className="flex justify-between items-center text-black outline-none p-5">
        <div className="flex items-center h-4">
          <p className={`relative text-sm text-black font-bold uppercase bg-underline w-max leading-tight to-red-200`}>
            {t("questionHeader") || `Customer Questions`}
          </p>

          <div className="flex flex-1 justify-center items-center" />
        </div>
      </div>
      <div>
        <div>
          <div>
            {/* Show Review Form / Question Form Buttons */}
            <div className="mt-2 w-full justify-between px-6">
              {/* Question Button */}
              <button
                type="button"
                className={`w-full text-base text-center font-semibold rounded-sm uppercase mb-5 px-6 py-3 outline-none border border-color1 ${
                  showQuestionForm ? "bg-color1 text-white" : "bg-white text-color1"
                }`}
                onClick={() => {
                  adobeButtonClickEvent("question", "ask a question");
                }}
                disabled={showQuestionForm}
              >
                {t("pdpCTAAskQuestions") || `Ask a question`}
              </button>
            </div>
            {/* Review Form / Question Form */}
            {showForms && showQuestionForm && (
              <div className="w-full p-5">
                <SubmitQuestionForm
                  ratings={ratings}
                  subRatingHeaders={[]}
                  product={product}
                  category={categories.childCategoryName}
                />
              </div>
            )}
            {/* Question List */}
            {questionsState?.data && (
              <QuestionList
                Questions={questionsState?.data}
                QuestionsTotalCount={questionsState?.totalCount}
                productTag={product?.productTag}
                onLoadMoreQuestions={onLoadMoreQuestions}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerQuestion;
