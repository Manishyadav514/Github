/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Link from "next/link";
import Image from "next/image";

import { numFormatter } from "@libUtils/format/formatNumber";

import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ArticleDownloadAppModal from "@libComponents/BBCArticle/ArticleDownloadAppModal";

interface PropTypes {
  bannerImage: any;
  description: string;
  authorName: string;
  likeCount?: number;
  routePath?: string;
  index: number;
  onPageNavigation?: any;
  createdAt: any;
  readTime?: any;
}

const ArticleCard = (props: PropTypes) => {
  const { bannerImage, description, authorName, likeCount, routePath, index, onPageNavigation, createdAt, readTime } = props;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [activeDownloadModal, setActiveDownloadModal] = React.useState("");
  const hanldeLikeClick = (e: any) => {
    e.preventDefault();
    setActiveDownloadModal("like");
  };

  const handleBookmarkClick = (e: any) => {
    e.preventDefault();
    setActiveDownloadModal("bookmark");
  };
  return (
    <>
      <Link href={routePath || "/"} passHref legacyBehavior>
        <div className="bg-white pb-4 rounded-sm border-solid border border-grey3 w-full " onClick={() => onPageNavigation()}>
          {index < 10 ? (
            <div className="w-full relative h-[200px]">
              <Image alt={description} src={bannerImage || DEFAULT_IMG_PATH()} layout="fill" priority />
            </div>
          ) : (
            <ImageComponent src={bannerImage || DEFAULT_IMG_PATH()} alt={description} className="w-full h-[200px]" />
          )}

          <div className="px-4">
            <p
              className="text-sm font-normal mt-2 min-h-[40px] line-clamp-2 max-w-full "
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <p className=" mt-2 text-[13px] font-normal line-clamp-1 max-w-full text-gray-400">By {authorName}</p>
            {createdAt ? (
              <div className="h-5 flex items-center">
                <p className="text-[13px] font-normal text-gray-400">
                  {new Date(createdAt).getDate()}&nbsp;{months[new Date(createdAt).getMonth()]}&nbsp;
                  {new Date(createdAt).getFullYear()}
                </p>
                {readTime ? <p className="w-[4px] h-[4px] bg-stone-400 rounded mx-3" /> : null}
                {readTime ? <p className="text-[12px] font-normal text-gray-400">{`${readTime} min Read`}</p> : null}
              </div>
            ) : null}

            <div className="flex items-center mt-4  justify-between">
              <div
                className="flex items-center space-x-2"
                onClick={e => {
                  e.stopPropagation();
                  hanldeLikeClick(e);
                }}
              >
                <ImageComponent
                  src="https://files.babychakra.com/site-images/original/ico-like.png"
                  alt="like"
                  forceLoad
                  width="20px"
                  height="20px"
                />
                <p className="mb-0">{numFormatter(likeCount)}</p>
              </div>
              <div
                className="flex items-center"
                onClick={e => {
                  e.stopPropagation();
                  handleBookmarkClick(e);
                }}
              >
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

ArticleCard.defaultProps = {
  likeCount: 1,
  readTime: 0,
  routePath: "/learn/8025-assisted-baby-workout-exercises-for-the-first-6-months",
  onPageNavigation: () => {
    // empty function
  },
};

export default React.memo(ArticleCard);
