import ProductAPI from "@libAPI/apis/ProductAPI";
import BackBtn from "@libComponents/LayoutComponents/BackBtn";
import QuestionListV2 from "@libComponents/PDP/PDPWidgetComponents/QuestionListv2";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import useTranslation from "@libHooks/useTranslation";
import Layout from "@libLayouts/Layout";
import OfflineStoreLayout from "@libLayouts/OfflineStoreLayout";
import { isClient } from "@libUtils/isClient";
import Head from "next/head";
import React, { ReactElement, useState } from "react";

const AllQuestion = ({ questionData, productTag }: any) => {
  const { t } = useTranslation();

  const [questionsState, setQuestionsState] = useState({
    totalCount: questionData?.count || 0,
    skip: 10,
    data: questionData?.data,
  });

  const onLoadMoreQuestions = () => {
    const where = {
      postType: "productQuestion",
      statusId: 1,
      productTag,
    };

    const api = new ProductAPI();
    api.getQuestions(where, 10, questionsState.skip).then((res: any) => {
      const questionsStateTemp = { ...questionsState };
      questionsStateTemp.totalCount = res?.data?.data?.count;
      questionsStateTemp.data = [...questionsState?.data, ...res?.data?.data?.data];
      questionsStateTemp.skip = questionsState.skip + 10;
      setQuestionsState(questionsStateTemp);
    });
  };

  return (
    <>
      <header className="sticky w-full top-0 outline-none z-50 border-4 border-l-0 border-r-0 border-t-0">
        <div className="flex flex-row items-center h-12 bg-white">
          <BackBtn />
          <p className="text-lg font-medium"> {t("customerQuestion") || "Customer Questions"}</p>
        </div>
      </header>
      <div className="pb-4 bg-white">
        <div className="px-4 pt-2 pb-6 border-b border-themeGray bg-white">
          {questionsState?.data?.length ? (
            <>
              <QuestionListV2
                Questions={questionsState?.data}
                QuestionsTotalCount={questionsState?.totalCount}
                enableReadMore={questionsState?.totalCount > questionsState?.data.length}
                ctaText={t("loadMore") || "Load More"}
                onClick={onLoadMoreQuestions}
              />
            </>
          ) : (
            <p className="text-13 text-center p-5" style={{ color: "#717171" }}>
              {t("pdpNoQuestions") || `No questions found`}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

const GetLayout = ({ children }: { children: ReactElement }) => {
  return <Layout header={false}>{children}</Layout>;
};

AllQuestion.getLayout = (children: ReactElement) => <GetLayout children={children} />;
AllQuestion.getInitialProps = async (ctx: any) => {
  try {
    const { slug } = ctx.query;
    const where = {
      postType: "productQuestion",
      statusId: 1,
      productTag: slug,
    };

    const api = new ProductAPI();
    const questionData = await api.getQuestions(where, 10, 0);

    if (!questionData?.data?.data?.data?.length) {
      if (ctx.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Question Not Found");
      }
      return { errorCode: 404 };
    }

    return { questionData: questionData?.data?.data, productTag: slug };
  } catch (error) {
    if (ctx.res) {
      console.log(error);
      console.error(error, ctx.asPath);
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }

    return {
      errorCode: 404,
    };
  }
};

export default AllQuestion;
