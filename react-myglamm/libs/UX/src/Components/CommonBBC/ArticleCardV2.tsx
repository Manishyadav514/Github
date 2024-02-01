/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Link from "next/link";
import Image from "next/legacy/image";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ArticleDownloadAppModal from "@libComponents/BBCArticle/ArticleDownloadAppModal";
// import { TOGGLE_BOOKMARK_DOWNLOAD_APP_MODAL, TOGGLE_LIKE_DOWNLOAD_APP_MODAL } from "@redux/types";

import { numFormatter } from "@libUtils/format/formatNumber";
import { GAgenericEvent } from "@libUtils/analytics/gtm";
import { ArticleCardV2Interface } from "@typesLib/articleUtilTypes";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const ArticleCardV2 = (props: ArticleCardV2Interface) => {
  const {
    bannerImage,
    description,
    authorName,
    likeCount,
    routePath,
    isNextImage,
    isSSR,
    createdAt,
    readTime,
    isHomeArticle = false,
  } = props;
  const [activeDownloadModal, setActiveDownloadModal] = React.useState("");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const handleLikeClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setActiveDownloadModal("like");
  };

  const handleBookmarkClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setActiveDownloadModal("bookmark");
  };

  return (
    <>
      <Link href={routePath as string} passHref title={description} aria-label="article">
        <div
          className="bg-white pb-4 rounded-sm border-solid border border-grey-100 mx-2"
          style={{ minWidth: "210px", maxWidth: "210px" }}
          onClick={() => {
            if (isHomeArticle) {
              GAgenericEvent("engagement", "BBC Article Click", "");
            } else {
              GAgenericEvent("Content & Community", "BBC Clicked Feed Details", "");
            }
          }}
        >
          <div className="relative w-full">
            {isSSR && isNextImage ? (
              <Image
                alt={description}
                src={bannerImage || DEFAULT_IMG_PATH()}
                objectFit="contain"
                width={210}
                height={140}
                priority
                layout="fixed"
              />
            ) : (
              <ImageComponent
                src={bannerImage || DEFAULT_IMG_PATH()}
                alt={description}
                width="210px"
                height="140px"
                className="flex w-full justify-center mx-auto"
                style={{ minHeight: "140px", maxHeight: "140px", minWidth: "210px", objectFit: "cover" }}
              />
            )}
          </div>

          <div className="px-4">
            <p
              className="text-base font-normal mt-2 h-12 line-clamp-2 max-w-full  tracking-wide text-ellipsis overflow-hidden"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            <p className="text-12 font-normal  line-clamp-1 mt-1 h-5 max-w-full text-ellipsis overflow-hidden text-gray-500">
              By {authorName}
            </p>
            {createdAt ? (
              <div className=" mt-2  h-5 flex items-center">
                <p className="text-11 font-normal text-gray-500">
                  {new Date(createdAt).getDate()}&nbsp;{months[new Date(createdAt).getMonth()]}&nbsp;
                  {new Date(createdAt).getFullYear()}
                </p>
                {readTime ? <p className="w-[4px] h-[4px] bg-gray-400 rounded mx-3" /> : null}
                {readTime ? <p className="text-11 font-normal text-gray-500">{`${readTime} min Read`}</p> : null}
              </div>
            ) : null}

            <div className="flex items-center mt-4 justify-between">
              <div className="flex items-center space-x-2" onClick={e => handleLikeClick(e)}>
                <ImageComponent
                  src="https://files.babychakra.com/site-images/original/ico-like.png"
                  alt="like"
                  forceLoad
                  width="20px"
                  height="20px"
                />
                <p>{numFormatter(likeCount)}</p>
              </div>
              <div className="flex items-center" onClick={e => handleBookmarkClick(e)}>
                <ImageComponent
                  src="https://files.babychakra.com/site-images/original/ico-save.png"
                  alt="bookmark"
                  forceLoad
                  width="18px"
                  height="18px"
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
      {activeDownloadModal ? (
        <ArticleDownloadAppModal onCloseModal={() => setActiveDownloadModal("")} activeModal={activeDownloadModal} />
      ) : null}
    </>
  );
};

ArticleCardV2.defaultProps = {
  likeCount: 1,
  readTime: 0,
  isNextImage: false,
  isSSR: false,
  routePath: "/learn/8025-assisted-baby-workout-exercises-for-the-first-6-months",
};

export default ArticleCardV2;
