import React from "react";
import format from "date-fns/format";
import clsx from "clsx";
import dynamic from "next/dynamic";
import useTranslation from "@libHooks/useTranslation";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { getStaticUrl } from "@libUtils/getStaticUrl";

const ReadAllButton = dynamic(() => import(/* webpackChunkName: "ReadAllButton" */ "./ReadAllButton"), { ssr: false });

const QuestionListV2 = ({ Questions, QuestionsTotalCount, link, enableReadMore, ctaText,onClick }: any) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
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

            const Adate = question?.answer && format(new Date(question?.answer?.createdAt), "dd MMM, yyyy");
            const Atime = question?.answer && format(new Date(question?.answer?.createdAt), "hh:mm a");

            return (
              <div key={question.id}>
                <div className="pt-4">
                  <div
                    className={clsx(
                      "w-full flex gap-2",
                      index === Questions.length - 1 ? "border-0 mb-3" : "border-b border-themeGray pb-5"
                    )}
                  >
                    <div className="w-7 h-7 overflow-hidden rounded-full -mt-0.5">
                      <img src={question.userInfo.userImage} alt="User Img" />
                    </div>
                    <div className="w-11/12">
                      <p className="text-13 font-bold leading-tight">{question?.userInfo?.userName}</p>
                      <p className="text-11 text-gray-400 leading-tight">
                        {Qdate} <span>at</span> {Qtime}
                      </p>
                      <p className="w-full mt-2 text-13 font-bold line-clamp-2">{question?.post}</p>
                      <div className="w-full flex mt-3">
                        <div className="mt-0.5 mr-2 bg-white border border-color1 rounded-full w-7 h-7 p-0.5">
                          <ImageComponent
                            alt="Touch Icon"
                            className="rounded-full"
                            src={getStaticUrl("/apple_icons/apple-touch-icon.png")}
                          />
                        </div>
                        <div>
                          <p className="text-13 font-bold ">{question?.answer?.userName}</p>
                          <div className="text-11 font-thin text-gray-400">
                            {Adate} <span>at</span> {Atime}
                          </div>
                        </div>
                      </div>
                      <p className="w-full mt-2 text-13 font-thin line-clamp-3">{question?.answer?.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        <ReadAllButton
          ctaText={ctaText || t("readAllQuestions") || "Read All Questions"}
          link={link}
          visible={enableReadMore}
          onClick={onClick}
        />
      </div>
    </>
  );
};

export default QuestionListV2;
