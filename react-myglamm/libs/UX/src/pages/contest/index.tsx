import React from "react";
import Head from "next/head";

import ContestDisplay from "@libComponents/Contest/ContestDisplay";
import ErrorComponent from "@libPages/_error";

import ContestApi from "@libAPI/apis/ContestAPI";

import { IContest } from "@typesLib/Contest";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

interface ContestPropTypes {
  currentContest: IContest;
  isError?: boolean;
}

const ContestLanding = ({ currentContest, isError }: ContestPropTypes) => {
  if (isError) {
    return <ErrorComponent statusCode={404} />;
  }
  return (
    <main>
      <Head>
        <title>{currentContest?.contestName}</title>
        <meta name="title" key="title" content={`${currentContest?.contestName} |  Contest`} />
        <meta name="description" key="description" content={`${currentContest?.contestName} |  Contest, Participate Now`} />
        <meta
          property="og:description"
          key="og:description"
          content={`${currentContest?.contestName} |  Contest, Participate Now`}
        />
        <meta property="og:title" key="og:title" content={`${currentContest?.contestName} |  Contest`} />
        <link
          rel="canonical"
          key="canonical"
          href={`${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}/contest/${currentContest?.contestUrl}`}
        />
      </Head>
      <ContestDisplay currentContest={currentContest} />
    </main>
  );
};

ContestLanding.getInitialProps = async (ctx: any) => {
  const contestApi = new ContestApi();
  try {
    const { data } = await contestApi.getLastestContest();
    if (data?.data?.data?.length > 0) {
      const contestData = data?.data?.data?.[0];
      return {
        currentContest: contestData,
      };
    }
    return { isError: true };
  } catch (error: any) {
    return { currentContest: null, isError: true };
  }
};

export default ContestLanding;
