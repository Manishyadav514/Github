import React from "react";
import format from "date-fns/format";

import useTranslation from "@libHooks/useTranslation";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { getStaticUrl } from "@libUtils/getStaticUrl";

const QuestionList = ({ Questions, QuestionsTotalCount, onLoadMoreQuestions }: any) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="border-gray-200 mt-2">
        {Array.isArray(Questions) && Questions.length > 0 ? (
          <div className="p-1 text-transparent font-semibold hidden">
            {QuestionsTotalCount}
            {QuestionsTotalCount > 1 ? t("question") || "Question" : t("questions") || "Questions"}
          </div>
        ) : (
          <p className="text-xs text-center p-5" style={{ color: "#717171" }}>
            {t("pdpNoQuestions") || `No questions found`}
          </p>
        )}

        {Array.isArray(Questions) &&
          Questions.map((question: any, index: any) => {
            const Qdate = format(new Date(question.createdAt), "dd MMM, yyyy");
            const Qtime = format(new Date(question.createdAt), "hh:mm a");

            const Adate = question.answer && format(new Date(question.answer.createdAt), "dd MMM, yyyy");
            const Atime = question.answer && format(new Date(question.answer.createdAt), "hh:mm a");

            return (
              <div key={question.id}>
                {index !== 0 && <div className="h-2.5 w-full bg-themeGray mb-2.5" />}
                <div className="mb-4 pl-5 pr-5">
                  <div className="w-full flex">
                    <div className="mr-2 w-12 h-12 rounded-full">
                      <img src={question.userInfo.userImage} alt="User Img" />
                    </div>
                    <div>
                      <span className="text-lg font-extrabold text-gray-700">{question.userInfo.userName}</span>
                      <div className="text-sm text-gray-500">
                        {Qdate} <span>at</span> {Qtime}
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-2 text-lgfont-thin">{question.post}</div>
                  <hr className="mt-2 text-gray-200" />
                  <div className="text-base font-bold mt-2 mb-2">{t("answer") || `Answer`}</div>
                  <div className="w-full flex">
                    <div className="mr-2 bg-white border-2 border-color1 rounded-full w-12 h-12">
                      <ImageComponent
                        alt="Touch Icon"
                        className="rounded-full"
                        src={getStaticUrl("/apple_icons/apple-touch-icon.png")}
                      />
                    </div>
                    <div>
                      <span className="text-lg font-extrabold text-gray-700">{question.answer?.userName}</span>
                      <div className="text-sm font-thin text-gray-500">
                        {Adate} <span>at</span> {Atime}
                      </div>
                    </div>
                  </div>
                  <div className="w-full mt-2 text-lgfont-thin">{question.answer?.text}</div>
                </div>
              </div>
            );
          })}
      </div>
      {QuestionsTotalCount > Questions?.length && (
        <div
          className="text-center p-4 m-auto"
          style={{
            borderTop: "3px solid #f5f5f6",
          }}
        >
          <p role="presentation" onClick={onLoadMoreQuestions} className="font-semibold text-sm">
            {t("showMore") || `Show More`}
          </p>
        </div>
      )}
    </>
  );
};

export default QuestionList;
