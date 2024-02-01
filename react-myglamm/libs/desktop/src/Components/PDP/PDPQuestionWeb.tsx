import React, { Fragment } from "react";
import format from "date-fns/format";

import { PDPProd } from "@typesLib/PDP";

import useTranslation from "@libHooks/useTranslation";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

const PDPQuestionWeb = ({ product }: { product: PDPProd }) => {
  const { t } = useTranslation();

  return (
    <section>
      <h3 className="font-bold mb-7 uppercase text-center pt-5">{t("customerQuestions") || "CUSTOMER QUESTIONS"}</h3>

      {(!product?.questions || product?.questions?.length === 0) && (
        <p className="text-sm text-center opacity-60 py-8"> {t("pdpNoQuestions") || `No questions found`}</p>
      )}

      {product?.questions?.map((question, index) => (
        <Fragment key={question.id}>
          <div className="border-b border-gray-200 mb-4">
            <div className="flex items-center pb-2">
              <ImageComponent src={question.userInfo?.userImage} alt="user img" className="rounded-full mr-1 h-16 w-16" />

              <div>
                <p className="font-bold mb-1">{question.userInfo?.userName}</p>
                {question.createdAt && (
                  <p className="text-gray-500 text-xs mt-1">
                    {format(new Date(question.createdAt), "dd MMM, yyyy")}&nbsp;at&nbsp;
                    {format(new Date(question.createdAt), "hh:mm a")}
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm mt-1 pb-4 pl-1">{question.post}</p>
          </div>

          <div className={`mb-4 ${index === product?.questions?.length - 1 ? "" : "border-b border-gray-200"}`}>
            <p className="capatalize font-bold mt-1 mb-2 text-sm">{t("answer") || "answer"}</p>

            <div className="flex items-center pb-2">
              <ImageComponent
                alt="answered user img"
                src={question.answer?.userImage}
                className="rounded-full mr-1 border-2 border-color1 h-16 w-16 object-contain"
              />

              <div>
                <p className="font-bold mb-1">{question.answer?.userName}</p>
                {question.answer?.createdAt && (
                  <p className="text-gray-500 text-xs mt-1">
                    {format(new Date(question.answer?.createdAt), "dd MMM, yyyy")}&nbsp;at&nbsp;
                    {format(new Date(question.answer?.createdAt), "hh:mm a")}
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm mt-1 pb-4 pl-1">{question.answer?.text}</p>
          </div>
        </Fragment>
      ))}
    </section>
  );
};

export default PDPQuestionWeb;
