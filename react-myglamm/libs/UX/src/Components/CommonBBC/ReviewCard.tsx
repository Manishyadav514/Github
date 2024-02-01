import React from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import { useRouter } from "next/router";

import ProfilePlaceholder from "@libComponents/CommonBBC/ProfilePlaceholder";

import BBCServiceDetail from "@libAPI/apis/BBCServiceDetail";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import { ValtioStore } from "@typesLib/ValtioStore";
import { GAgenericEvent } from "@libUtils/analytics/gtm";

import { ratingColor } from "@libConstants/RatingConstants";
import { getStaticUrl } from "@libUtils/getStaticUrl";

const ReviewCard = ({ review, isDetailsScreen = false }: any) => {
  const inputRef: any = React.useRef();
  const [comments, setComments] = React.useState<any>({
    data: [],
    count: undefined,
  });
  const router = useRouter();
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));

  const onLikeReview = async () => {
    if (!userProfile?.id) {
      SHOW_LOGIN_MODAL({ show: true, hasGuestCheckout: false, onSuccess: () => {} });
      return;
    }
    try {
      const payload = {
        vendorCode: "bbc",
        country: "IND",
        sourceVendorCode: "bbc",
        entityId: review.id,
        entityType: "comment",
        reactionType: "like",
        parentEntityId: review.entityId,
        parentEntityType: "bbcservice",
      };
      const bbcServiceDetail = new BBCServiceDetail();
      const response = await bbcServiceDetail.likeReview(payload);
    } catch (err) {}
  };
  const onCommentReview = async () => {
    if (!userProfile?.id) {
      SHOW_LOGIN_MODAL({ show: true, hasGuestCheckout: false, onSuccess: () => {} });
      return;
    }
    if (!inputRef?.current?.value) {
      return;
    }
    try {
      const payload = {
        vendorCode: "bbc",
        country: "IND",
        sourceVendorCode: "bbc",
        entityId: review.id,
        entityType: "comment",
        commentText: inputRef?.current?.value,
        isAnonymous: false,
      };
      const bbcServiceDetail = new BBCServiceDetail();
      const response = await bbcServiceDetail.createCommentForReview(payload);
      GAgenericEvent("engagement", "BBC Write A Comment", payload.commentText);
      if (response?.data?.data?.data?.id) {
        inputRef.current.value = "";
        const commentsCpy = JSON.parse(JSON.stringify(comments.data));
        commentsCpy.push(response.data.data.data);
        setComments({
          ...comments,
          data: commentsCpy,
        });
      }
    } catch (err) {}
  };

  const onFetchComments = async (nextLimit = 3, nextSkip = 0) => {
    try {
      const bbcServiceDetail = new BBCServiceDetail();
      const response = await bbcServiceDetail.onFetchComments(review.id, nextLimit, nextSkip);
      const identifiers = response?.data?.data?.relationalData?.identifiers;
      const identifierKeys = Object.keys(identifiers);
      response.data.data.data = response.data.data.data?.map((comment: any) => {
        if (identifierKeys?.includes(comment.identifier)) {
          return {
            ...comment,
            authorDetails: identifiers[comment.identifier],
          };
        }
        return comment;
      });
      const result = {
        data: [...comments.data, ...response.data.data.data],
        count: response?.data?.data?.count,
      };
      setComments(
        result || {
          data: [],
          count: undefined,
        }
      );
    } catch (err) {
      setComments({
        data: [],
        count: undefined,
      });
    }
  };

  const viewMoreComments = () => {
    onFetchComments(20, 3);
  };
  let newContent = review?.commentText;
  if (newContent?.length > 200 && !isDetailsScreen) {
    newContent = `${newContent.slice(0, 200)}...<span class="feed-content__read-more" >see more</span>`;
  }

  return (
    <div className="border-solid border border-gray-100 mb-3">
      {review?.authorDetails ? (
        <div className="flex items-center p-3">
          <img
            width="45"
            height="45"
            src={review?.authorDetails?.profileUrl || "/svg/profile-placeholder.svg"}
            alt=""
            className="u-rounded-full u-h-45 u-cursor-pointer"
            onError={(e: any) => {
              e.currentTarget.src = "/svg/profile-placeholder.svg";
            }}
          />

          <div className="flex justify-between items-center w-10/12">
            <div className="ml-3 text-sm w-8/12 truncate">{review?.authorDetails?.username}</div>
            {review?.meta?.rating ? (
              <div>
                <div
                  className="h-6 w-6 mx-auto rounded-sm text-white text-center text-xs flex items-center justify-center"
                  style={{
                    backgroundColor: (ratingColor as any)[Number(review?.meta?.rating)],
                  }}
                >
                  {review?.meta?.rating}
                </div>
                <p className="text-xs text-gray-500 mt-1">Rating</p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      <div
        className="mt-2 px-3  text-xs"
        onClick={() => {
          router.push({
            pathname: `/community/review/${review.id}/${review?.commentText
              ?.substr(0, 100)
              .replaceAll(" ", "-")
              .replaceAll(/\W+(?!$)/g, "-")
              .replaceAll(/\W$/g, "")
              .toLowerCase()}`,
          });
        }}
        dangerouslySetInnerHTML={{
          __html: newContent,
        }}
      />
      <div className="mt-5 u-flex  u-items-center mb-3 px-3">
        <div className="u-flex u-items-center u-cursor-pointer mr-8 " onClick={onLikeReview}>
          <img src={getStaticUrl("/svg/like.svg")} alt="" className="mr-3 w-[23px] h-[20px]" />
          <div>
            <p>{review?.reactions?.types?.[0]?.count || 0}</p>
            <p className="text-xs text-gray-500">Likes</p>
          </div>
        </div>
        <div
          className="u-flex u-items-center u-cursor-pointer"
          onClick={() => {
            if (!comments?.data?.length) {
              onFetchComments();
            }
          }}
        >
          <img src={getStaticUrl("/svg/comment.svg")} alt="" className="mr-3 w-[20px] h-[19px]" />
          <div>
            <p>{review.replyCount || 0}</p>
            <p className="text-xs text-gray-500">Comments</p>
          </div>
        </div>
      </div>

      <div className="">
        {comments?.data?.map((curcomment: any) => (
          <div className="mx-2 comment-details u-flex u-items-start ">
            <img
              width="36"
              className="u-rounded-full u-h-36 u-cursor-pointer"
              height=""
              src={curcomment?.authorDetails?.profileUrl || "/svg/profile-placeholder.svg"}
              onError={(e: any) => {
                e.currentTarget.src = "/svg/profile-placeholder.svg";
              }}
            />
            <div className="u-ml-12  comment-details__right-elem">
              <p className="comment-details__author-title mgp">{curcomment?.authorDetails?.username}</p>
              <p className="comment-details__comment-text bbc">{curcomment?.commentText}</p>
            </div>
          </div>
        ))}
      </div>
      {comments?.count > 3 && comments?.data?.length < comments?.count ? (
        <div
          className="cursor-pointer uppercase latest-comments__txt  bbc-primary-color1 text-right mt-2 mr-2"
          onClick={viewMoreComments}
        >
          See more comments
        </div>
      ) : null}
      <div className="flex items-center mt-4 px-3 pb-3">
        <ProfilePlaceholder letter={userProfile?.firstName?.charAt(0)} />
        <div
          className="u-relative u-ml-12"
          style={{
            width: "calc(100% - 48px)",
          }}
        >
          <input
            type="text"
            placeholder="Write comment here…"
            className="w-full outline-0 rounded text-sm h-[39px] bg-[#fafafa]"
            style={{
              paddingLeft: "15px",
              paddingRight: "58px",
            }}
            ref={inputRef}
          />

          <div className="absolute flex top-1/2 -translate-y-1/2 right-3" onClick={() => onCommentReview()}>
            <img src={getStaticUrl("/svg/send-filled.svg")} alt="send" width="27" className="h-[27px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReviewCard;
