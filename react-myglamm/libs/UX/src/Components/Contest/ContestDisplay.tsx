import React from "react";

import { IContest } from "@typesLib/Contest";
import Link from "next/link";
import parse from "html-react-parser";
import BBCBlogHTMLCss from "@libComponents/CommonBBC/BBCBlogHTMLCss";

interface ContestPropTypes {
  currentContest: IContest;
}

const ContestDisplay = ({ currentContest }: ContestPropTypes) => {
  const contestStartDate = currentContest?.startTime ? new Date(currentContest?.startTime).toISOString() : "";
  const currentDate = new Date().toISOString();
  const date = new Date(contestStartDate);
  const formattedDate = date?.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return currentDate < contestStartDate ? (
    <div className="bg-white text-center px-4 h-80 py-10">
      <p>Contest will begin on {formattedDate}</p>
      <Link href={`/`}>
        <span className="block text-center">
          <button type="button" className="bg-color1 text-white px-4 py-3 rounded-lg font-medium my-6 w-6/12 mx-auto">
            Shop
          </button>
        </span>
      </Link>
    </div>
  ) : (
    <div>
      <div className="flex flex-col py-4 bg-white">
        <Link href={`/contest/${currentContest?.contestUrl}/entries`}>
          <span className="block text-center">
            <button type="button" className="bg-color1 text-white px-4 py-3 rounded-lg font-medium my-2 w-10/12 mx-auto">
              SHOW ALL ENTRIES
            </button>
          </span>
        </Link>
        {currentContest?.statusId ? (
          <Link href={`/contest/post-submission/${currentContest?.contestUrl}`}>
            <span className="block text-center">
              <button type="button" className="bg-color1 text-white px-4 py-3 rounded-lg font-medium my-2 w-10/12 mx-auto">
                POST YOUR ENTRY
              </button>
            </span>
          </Link>
        ) : null}
      </div>
      <img
        src={currentContest?.bannerImage}
        alt={currentContest?.contestName}
        loading="eager"
        title={currentContest?.contestName}
      />

      <div className="bg-white p-8 text-xl my-2 font-medium">
        <p className="pb-1">{currentContest?.contestName}</p>
        <BBCBlogHTMLCss staticHtml={parse(currentContest?.contestDescription)} additionalClass="my-2" />
      </div>
    </div>
  );
};

export default ContestDisplay;
