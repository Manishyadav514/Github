import React from "react";
import dynamic from "next/dynamic";

import { ArticleDetailsContext } from "../../pages/learn/[slug]";

import BBCArticlesAPI from "@libAPI/apis/BBCArticlesAPI";

import { ValtioStore } from "@typesLib/ValtioStore";

import { GAgenericEvent } from "@libUtils/analytics/gtm";
import { showError } from "@libUtils/showToaster";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import WebContentWrapper from "../../Components/common/wrappers/WebContentWrapper";
import WebSectionWrapper from "../../Components/common/wrappers/WebSectionWrapper";

import { useSelector } from "@libHooks/useValtioSelector";

const CommentGreyCard = dynamic(() => import("../../Components/common/CommentGreyCard"));

const CommentInput = dynamic(() => import("../../Components/Article/CommentInput"));

const ActionBar = dynamic(() => import("../../Components/Article/ActionBar"), {
  ssr: false,
});

const MediaSection = () => {
  const { userProfile } = useSelector((store: ValtioStore) => ({
    userProfile: store.userReducer.userProfile,
  }));
  const articleDetailsInfo: any = React.useContext(ArticleDetailsContext);
  const initialMgComments = {
    baseLimit: 2,
    baseSkip: 0,
    data: [],
    limit: 0,
    skip: 0,
    totalCount: 0,
    hasMore: undefined,
    isNewCall: true,
  };

  const articlesAPI = new BBCArticlesAPI();
  const { userData }: any = useSelector((store: any) => store.userReducer);
  const [mgArticleComments, setMgArticleComments] = React.useState(initialMgComments);

  const mgLikeDislikeArticleCommentsAPI = async (id: string) => {
    try {
      const body = {
        entityId: id,
        entityType: "comment",
      };
      const formData = new FormData();
      formData.append("item_type", "comment");
      formData.append("item_id", id);
      const res = await articlesAPI.mgLikeDislikeArticleComments(body);
      if (res?.status === 200) {
        const dataCpy = JSON.parse(JSON.stringify(mgArticleComments));
        const activeDataIndex = dataCpy.data.findIndex((d: any) => d.id === id);
        if (activeDataIndex !== -1) {
          if (dataCpy.data[activeDataIndex].liked) {
            dataCpy.data[activeDataIndex].liked = false;
            dataCpy.data[activeDataIndex].likeCount -= 1;
          } else {
            GAgenericEvent("engagement", "BBC Liked Comment", "");
            dataCpy.data[activeDataIndex].liked = true;
            dataCpy.data[activeDataIndex].likeCount += 1;
          }
          setMgArticleComments(dataCpy);
        }
      } else {
        throw res;
      }
    } catch (error) {
      // error handling
    }
  };

  const onLikeComments = (activeComment: any) => {
    if (!userProfile?.id) {
      SHOW_LOGIN_MODAL({ show: true });
      return;
    }
    if (activeComment?.id) {
      mgLikeDislikeArticleCommentsAPI(activeComment.id);
    }
  };

  const getMgArticleCommentsResponse = async (limit: any, skip: any) => {
    try {
      const res = await articlesAPI.getMgArticleComments(articleDetailsInfo?.id, limit, skip);
      if (res?.status === 200) {
        const stateData = JSON.parse(JSON.stringify(mgArticleComments.data));
        const comments = [...stateData, ...res.data.data.data];
        const totalCount = res?.data?.data?.count;
        const hasMore = comments.length !== totalCount;
        const newLimit = mgArticleComments.limit + limit;
        setMgArticleComments({
          baseLimit: 2,
          baseSkip: 0,
          data: comments as any,
          limit: newLimit,
          skip,
          totalCount,
          hasMore: hasMore as any,
          isNewCall: false,
        });
        if (!hasMore) {
          //
        }
      }
      throw res;
    } catch (error) {
      // error handling
    }
  };

  React.useEffect(() => {
    setMgArticleComments(initialMgComments);
  }, [articleDetailsInfo?.id]);

  React.useEffect(() => {
    if (mgArticleComments.isNewCall) {
      getMgArticleCommentsResponse(mgArticleComments.baseLimit, mgArticleComments.baseSkip);
    }
  }, [mgArticleComments]);

  const loadMoreComments = async () => {
    const limit = 4;
    const skip = mgArticleComments.limit;
    getMgArticleCommentsResponse(limit, skip);
  };

  const postArticleCommentsAPI = async (data: any, nestedMeta?: any) => {
    let meta = {};
    if (nestedMeta) {
      meta = {
        ...nestedMeta,
      };
    }

    const body = {
      country: "IND",
      entityId: data.articleId,
      entityType: "article",
      answerText: data.answer,
      isAnonymous: false,
      meta,
      vendorCode: "bbc",
    };

    try {
      const res = await articlesAPI.postArticleComments(body);
      if (res?.status === 200) {
        if (res?.data?.data?.error && res?.data?.data?.message) {
          showError(res?.data?.data?.message, 3000);
        } else {
          const mgArticleCommentsCpy = JSON.parse(JSON.stringify(mgArticleComments));
          const comments = JSON.parse(JSON.stringify(mgArticleComments.data));
          comments.unshift(res?.data?.data);
          GAgenericEvent("engagement", "BBC Write A Comment", data.answer);
          setMgArticleComments({
            ...mgArticleCommentsCpy,
            data: comments,
            totalCount: mgArticleCommentsCpy.totalCount + 1,
            limit: mgArticleCommentsCpy.limit + 1,
          });
        }
      }
      throw res;
    } catch (error) {
      // error handling
    }
  };

  return (
    <div>
      <WebSectionWrapper applyBorder>
        <WebContentWrapper className="media-section-wrapper px-3.5 py-5 sm:py-8 sm:mb-0">
          {/* @ts-ignore */}
          <ActionBar
            authorDetails={articleDetailsInfo?.coauthors[0]}
            likesCount={articleDetailsInfo?.bbc_like_count}
            shareCount={articleDetailsInfo?.bbc_save_count}
            bookmarkCount={articleDetailsInfo?.bbc_share_count}
          />
          {/* @ts-ignore */}
          <CommentInput articleId={articleDetailsInfo?.id} postArticleComments={postArticleCommentsAPI} />
          {mgArticleComments?.hasMore ? (
            <div
              className="cursor-pointer text-xs font-bold text-blue-700 uppercase mb-3 hidden sm:block"
              onClick={loadMoreComments}
            >
              {` view more comments`}
            </div>
          ) : null}

          {mgArticleComments?.data?.map((comment: any) => {
            const id = comment?.id || comment?.comment_id;

            return (
              <>
                {/* @ts-ignore */}
                <CommentGreyCard key={`comment_${id}`} comment={comment} onLikeComments={() => onLikeComments(comment)} />
              </>
            );
          })}

          {mgArticleComments?.hasMore ? (
            <div
              className="cursor-pointer text-xs font-bold text-blue-700 uppercase text-right sm:hidden"
              onClick={loadMoreComments}
            >
              view more comments
            </div>
          ) : (
            false
          )}
        </WebContentWrapper>
      </WebSectionWrapper>
    </div>
  );
};

export default React.memo(MediaSection);
