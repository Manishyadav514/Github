import React, { useState } from "react";
import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";
import useEffectAfterRender from "@libHooks/useEffectAfterRender";

import { PDPProd } from "@typesLib/PDP";
import { adobeCallOnCTAClick } from "@productLib/pdp/AnalyticsHelper";
import QuestionListV2 from "@libComponents/PDP/PDPWidgetComponents/QuestionListv2";

const WriteQuestionModal = dynamic(
  () => import(/* webpackChunkName: "WriteQuestionModal" */ "@libComponents/PopupModal/WriteQuestionModal"),
  { ssr: false }
);

interface QuestionsProps {
  product: PDPProd;
}

const CustomerQuestionV2 = ({ product }: QuestionsProps) => {
  const { ratings, categories, questions, id, productTag, questionsCount } = product;

  const { t } = useTranslation();

  const [show, setShow] = useState<boolean | undefined>();
  const [questionsState, setQuestionsState] = useState({
    totalCount: questionsCount || 0,
    skip: 5,
    data: questions,
  });

  /* Reset Questions on CSR */
  useEffectAfterRender(() => {
    setQuestionsState({ ...questionsState, data: questions });
  }, [id]);

  return (
    <>
      <div
        className={`ReviewAccordion bg-white pt-5 px-4 border-b-4 border-themeGray ${
          !(questionsState?.totalCount > 2) && "pb-5"
        }`}
        id="review"
      >
        <p className="font-bold text-15 m-0"> {t("customerQuestion") || "Customer Questions"} </p>
        <div>
          <div>
            <div>
              {/* Show Review Form / Question Form Buttons */}
              <div className="mt-3 w-full justify-between">
                {/* Question Button */}
                <button
                  type="button"
                  className="text-color1 text-13 font-bold border border-color1 h-10 w-full rounded-3 uppercase"
                  onClick={() => {
                    setShow(true);
                    adobeCallOnCTAClick(product, "ask a question");
                  }}
                >
                  {t("pdpCTAAskQuestions") || `Ask a question`}
                </button>
              </div>
              {/* Question List */}
              {questionsState?.data && (
                <QuestionListV2
                  Questions={questionsState?.data.slice(0, 3)}
                  QuestionsTotalCount={questionsState?.totalCount}
                  link={`/all-question/${product?.productTag}`}
                  enableReadMore={questionsState?.totalCount > 3}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {typeof show === "boolean" && (
        <WriteQuestionModal
          show={show}
          onRequestClose={() => setShow(false)}
          ratings={ratings}
          subRatingHeaders={[]}
          product={product}
          category={categories.childCategoryName}
        />
      )}
    </>
  );
};

export default CustomerQuestionV2;
