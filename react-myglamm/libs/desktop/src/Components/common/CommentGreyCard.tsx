import React from "react";
import Link from "next/link";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ProfilePlaceholder from "@libComponents/CommonBBC/ProfilePlaceholder";

interface PropTypes {
  comment: any;
  onLikeComments: any;
}

const CommentGreyCard = (props: PropTypes) => {
  const { comment, onLikeComments } = props;
  const commentDate = comment?.createdAt || comment?.updated_at || comment?.created_at;
  const isLiked = comment?.is_liked || comment?.liked;

  const getIntervalValue = (value: any) => {
    const nearestValue = Math.floor(value);
    const positiveValue = Math.abs(nearestValue);
    return positiveValue;
  };

  const timeSince = (date: any) => {
    const seconds = Math.floor((new Date().valueOf() - new Date(date).valueOf()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
      return `${getIntervalValue(interval)} years`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return `${getIntervalValue(interval)} months`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return `${getIntervalValue(interval)} days`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return `${getIntervalValue(interval)} hours`;
    }
    interval = seconds / 60;
    if (interval > 1) {
      return `${getIntervalValue(interval)} minutes`;
    }
    return `${getIntervalValue(seconds)} seconds`;
  };
  return (
    <div className="mb-5 shadow-2 bg-zinc-100 rounded-md p-3">
      <div className="flex items-start">
        {comment?.userInfo?.userImage || comment?.user?.avatar ? (
          <>
            <Link href="/community/feed" passHref legacyBehavior>
              <a>
                <img
                  src={comment?.userInfo?.userImage || comment?.user?.avatar}
                  alt=""
                  className="rounded-full w-10 h-10 object-cover"
                />
              </a>
            </Link>
          </>
        ) : (
          <ProfilePlaceholder />
        )}
        <div
          className="ml-4 break-all"
          style={{
            width: "calc(100% - 40px)",
          }}
        >
          <Link href="/community/feed" passHref legacyBehavior>
            <a>
              <p className="text-xs font-medium mb-2">{comment?.userInfo?.userName || comment?.user?.name || "Anonymous"}</p>
            </a>
          </Link>

          <div
            className="text-sm font-normal text-grey4"
            dangerouslySetInnerHTML={{ __html: comment?.answerText || comment?.comment || "" }}
          />
          <div className="flex justify-between items-center mt-5 ">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                onLikeComments();
              }}
            >
              {isLiked ? (
                <ImageComponent alt="like" src="/images/bbc-g3/heart-selected.svg" width="22.4px" height="22.4px" />
              ) : (
                <ImageComponent alt="unlike" src="/images/bbc-g3/heart.svg" width="22.4px" height="22.4px" />
              )}

              <span className={`ml-0.5 text-xs font-normal mr-1 ${isLiked ? "text-red-400" : "text-grey4"}`}>Like</span>
              <span className={`text-xs font-normal ${isLiked ? "text-red-400" : "text-grey4"}`}>
                ({comment.likeCount || comment.likes_count || 0})
              </span>
            </div>
            {commentDate ? <p className="text-xs font-normal text-grey4">{timeSince(commentDate)} ago</p> : null}
          </div>
          {comment?.meta?.image?.original ? (
            <div className=" mt-4">
              <img src={comment?.meta?.image?.original} alt="selected-img" width="100" height="100" />
              {/* <p className="text-xs mt-2">{comment?.meta?.image?.assetName}</p> */}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CommentGreyCard);
