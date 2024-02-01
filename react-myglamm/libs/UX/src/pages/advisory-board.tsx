import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/legacy/image";
import dynamic from "next/dynamic";
import LazyHydrate from "react-lazy-hydration";

import ADVISORY_BOARD_DATA from "@libUtils/jsondata/advisory-board-data.json";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

const AdvisoryCard = dynamic(() => import("@libComponents/AdvisoryBoard/AdvisoryCard"));

type boardCategories = "doctors" | "corporate" | "early_childhood" | "mom_influencers" | "parent_influencers";
type boardCategoryName = "DOCTORS" | "CORPORATE" | "EARLY CHILDHOOD EDUCATORS" | "MOM INFLUENCERS" | "PARENT INFLUENCERS";

interface AdvisoryBoardCategoryTypes {
  id: boardCategories;
  name: boardCategoryName;
}

interface AdvisoryCardInterface {
  id: number;
  name: string;
  work: string;
  image_url: string;
  sub_text: string;
  app_link: string;
  page_link: string;
  path: string;
}

interface AdvisoryListInterface {
  key: string;
  title: string;
  sub_title: string;
  members: AdvisoryCardInterface[];
}

const ADVISORY_BOARD_CATEGORY: AdvisoryBoardCategoryTypes[] = [
  { id: "doctors", name: "DOCTORS" },
  { id: "corporate", name: "CORPORATE" },
  { id: "early_childhood", name: "EARLY CHILDHOOD EDUCATORS" },
  { id: "mom_influencers", name: "MOM INFLUENCERS" },
  { id: "parent_influencers", name: "PARENT INFLUENCERS" },
];

const AdvisoryBoard: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<boardCategories>("doctors");
  const [visibleData, setVisibleData] = useState<AdvisoryListInterface>(ADVISORY_BOARD_DATA?.doctors);

  useEffect(() => {
    setVisibleData(ADVISORY_BOARD_DATA[selectedContent]);
  }, [selectedContent]);

  return (
    <main>
      <Head>
        <title>Advisory Board</title>
        <meta
          name="title"
          key="title"
          content="Bringing the best experts together to make parenting easier | BabyChakra Advisory Board"
        />
        <meta
          name="description"
          key="description"
          content="The BabyChakra Advisory Board provides parents with relevant information and insights to help them better care for themselves and their children."
        />
        <meta
          property="og:title"
          key="og:title"
          content="Bringing the best experts together to make parenting easier | BabyChakra Advisory Board"
        />
        <meta
          property="og:description"
          key="og:description"
          content="The BabyChakra Advisory Board provides parents with relevant information and insights to help them better care for themselves and their children."
        />
        <link rel="canonical" key="canonical" href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/advisory-board`} />
      </Head>
      <div className="advisory-board bg-white">
        <div className="w-full relative block">
          <Image
            alt="advisory board banner"
            src={
              !IS_DESKTOP
                ? "https://files.babychakra.com/site-images/original/mweb-advisory-board.png"
                : "https://files.babychakra.com/site-images/original/Group-16839.png"
            }
            priority
            width={!IS_DESKTOP ? 300 : 1440}
            height={!IS_DESKTOP ? 360 : 360}
            className=""
            layout="responsive"
            objectFit="cover"
          />
        </div>
        <div
          className="overflow-x-auto flex h-16 py-2 bg-white sticky  mb-2 fix-below-top-bar  justify-center text-base"
          style={{ zIndex: "2" }}
        >
          {ADVISORY_BOARD_CATEGORY.map((element: AdvisoryBoardCategoryTypes) => {
            return (
              <button
                type="button"
                onClick={() => {
                  setSelectedContent(element?.id);
                }}
                key={element?.id}
                className={`${
                  element?.id === selectedContent
                    ? "bg-themePink shadow-advisory bg-color1 font-bold text-white  rounded "
                    : "text-gray-500 font-semibold "
                } h-10 px-2  mx-3 hover:border-b hover:border-pink-400 hover:bg-color1`}
                style={{ flex: "0 0 auto" }}
              >
                {element?.name}
              </button>
            );
          })}
        </div>
        <div
          className={`px-5 ${selectedContent} ${
            selectedContent === "mom_influencers" || selectedContent === "corporate" ? "bg-pink-50" : "bg-yellow-50"
          } py-10  `}
        >
          <div className="text-lg text-black font-semibold"> {visibleData?.title}</div>
          <div className="text-base text-black py-2"> {visibleData?.sub_title}</div>
          <div className="lg:grid lg:grid-cols-3 lg:gap-12 lg:my-4">
            {visibleData?.members?.map((elem: AdvisoryCardInterface) => {
              return (
                <LazyHydrate whenVisible key={elem.id}>
                  <AdvisoryCard
                    key={elem.id}
                    title={elem?.name}
                    work={elem?.work}
                    link={elem?.page_link}
                    userImageUrl={elem?.image_url}
                    subtitle={elem?.sub_text}
                  />
                </LazyHydrate>
              );
            })}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media only screen and (max-width: 600px) {
          .fix-below-top-bar {
            top: 47px;
          }
        }
      `}</style>
    </main>
  );
};

export default AdvisoryBoard;
