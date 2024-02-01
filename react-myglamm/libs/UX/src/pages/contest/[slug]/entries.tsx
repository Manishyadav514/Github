import React, { useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import parse from "html-react-parser";

import { useSelector } from "@libHooks/useValtioSelector";

import ContestEntryCards from "@libComponents/Contest/ContestEntryCards";
import ErrorComponent from "@libPages/_error";

import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { BASE_URL } from "@libConstants/COMMON.constant";

import ContestApi from "@libAPI/apis/ContestAPI";

import { ValtioStore } from "@typesLib/ValtioStore";
import { IContestRelationalData } from "@typesLib/Contest";

import { resetContestFeed, setContestFeed } from "@libStore/actions/contestActions";
import BBCBlogHTMLCss from "@libComponents/CommonBBC/BBCBlogHTMLCss";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const ContestAllEntries = ({ entries, isError }: any) => {
  const contestId = entries?.data?.[0]?.contestId;
  const contestData: IContestRelationalData = entries?.relationalData?.contest?.[contestId];
  const router = useRouter();
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));
  const contestEntriesData: any = useSelector((store: ValtioStore) => store?.contestReducer);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: router?.query?.slug,
        item: `${BASE_URL()}/${router?.query?.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Contest Entries",
        item: `${BASE_URL()}/${router?.query?.slug}/entries`,
      },
    ],
  };

  useEffect(() => {
    if (entries?.data?.length && !contestEntriesData?.data?.length) {
      setContestFeed(entries);
    }
    const scrollPosY = sessionStorage.getItem(SESSIONSTORAGE.CONTEST_SCROLL_POS_Y);
    if (scrollPosY) {
      window.scrollTo(0, Number(scrollPosY));
      sessionStorage.removeItem(SESSIONSTORAGE.CONTEST_SCROLL_POS_Y);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const getContestEntries = async () => {
    const contestApi = new ContestApi();
    try {
      const { data } = await contestApi.getContestEntries(10, 0, "voteCount desc", router?.query?.slug as string);
      if (data.data) {
        data.data.hasMore = data?.data?.count > 10;
        resetContestFeed(data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userProfile?.id) {
      getContestEntries();
    }
  }, [userProfile?.id]);

  if (isError) {
    return <ErrorComponent statusCode={404} />;
  }

  return (
    <main className="">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
        <title>{contestData?.contestName}</title>
        <meta name="title" key="title" content={`${contestData?.contestName} |  Contest Entries`} />
        <meta property="og:title" key="og:title" content={`${contestData?.contestName} |  Contest Entries`} />
        <meta name="description" key="description" content={`${contestData?.contestName} |  Contest Entries`} />
        <meta property="og:description" key="og:description" content={`${contestData?.contestName} |  Contest Entries List`} />
        <link
          rel="canonical"
          key="canonical"
          href={`${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}/contest/${contestData?.contestUrl}/entries`}
        />
      </Head>

      {contestData ? (
        <>
          <div className="flex px-3 w-full pb-2 pt-4">
            <div className="flex text-xs items-center w-11/12 truncate" role="list">
              <Link href="/" role="listitem" aria-label="home">
                <span>HOME</span>
              </Link>
              &nbsp;/&nbsp;
              <Link href={`/contest/${router?.query?.slug}`} role="listitem" aria-label={contestData?.contestName}>
                <span className="uppercase truncate">{contestData?.contestName}</span>
              </Link>
              &nbsp;/&nbsp;
              <Link href={`/contest/${router?.query?.slug}/entries`} role="listitem" aria-label="Entries">
                <span className="uppercase">Entries</span>
              </Link>
            </div>
          </div>
          <p className="font-semibold px-3 text-lg">{contestData?.contestName}</p>
          <img
            src={contestData?.bannerImage}
            alt={contestData?.contestName}
            loading="eager"
            title={contestData?.contestName}
            className="mx-auto"
          />
          <BBCBlogHTMLCss staticHtml={parse(contestData?.contestDescription)} additionalClass="my-2 px-3" />
          {contestData?.statusId ? (
            <Link href={`/contest/post-submission/${contestData?.contestUrl}`} aria-label="APPLY FOR CONTEST">
              <span className="block text-center pb-6">
                <button type="button" className="bg-color1 text-white px-4 py-3 rounded-lg font-medium my-2 w-10/12 mx-auto">
                  APPLY FOR CONTEST
                </button>
              </span>
            </Link>
          ) : null}
          <ContestEntryCards entries={contestEntriesData} contestData={contestData} />
        </>
      ) : (
        <div className="h-1/2  py-10 text-center ">
          <div className="bg-white  py-10">
            Looks like there are no entries posted yet. Be the first to participate
            <Link href={`/contest/post-submission/${router?.query?.slug}`} aria-label="APPLY FOR CONTEST">
              <span className="block mx-auto text-center py-6 ">
                <button type="button" className="bg-color1 text-white px-4 py-3 rounded-lg font-medium my-2 w-10/12 mx-auto">
                  APPLY FOR CONTEST
                </button>
              </span>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
};

ContestAllEntries.getInitialProps = async (ctx: any) => {
  const contestApi = new ContestApi();
  try {
    const { data } = await contestApi.getContestEntries(10, 0, "voteCount desc", ctx?.query?.slug);
    if (data?.data) {
      data.data.hasMore = data?.data?.count > 10;
      return {
        entries: data.data,
      };
    }
  } catch (error: any) {
    return { currentContest: null, isError: true };
  }
};

export default ContestAllEntries;
