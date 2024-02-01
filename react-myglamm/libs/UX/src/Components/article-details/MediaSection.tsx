import React from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import dynamic from "next/dynamic";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import { ArticleDetailsContext } from "@libPages/learn/[slug]";

import BBCArticlesAPI from "@libAPI/apis/BBCArticlesAPI";

import { GAgenericEvent } from "@libUtils/analytics/gtm";
import { showError } from "@libUtils/showToaster";

import { ValtioStore } from "@typesLib/ValtioStore";

const SmallGreyRect = dynamic(() => import("@libComponents/CommonBBC/SmallGreyRect"));
const CommentGreyCard = dynamic(() => import("@libComponents/CommonBBC/CommentGreyCard"));

const CommentInput = dynamic(() => import("@libComponents/article-details/CommentInput"));

const ActionBar = dynamic(() => import("@libComponents/article-details/ActionBar"));

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
      SHOW_LOGIN_MODAL({ show: true, hasGuestCheckout: false, onSuccess: () => {} });
      return;
    }
    if (activeComment?.id) {
      mgLikeDislikeArticleCommentsAPI(activeComment.id);
    }
  };

  const getMgArticleCommentsResponse = async (limit: number, skip: number) => {
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
      vendorCode: "bbc",
      country: "IND",
      entityId: data.articleId,
      entityType: "article",
      answerText: data.answer,
      isAnonymous: false,
      meta,
    };

    try {
      const res = await articlesAPI.postArticleComments(body);
      if (res?.status === 200) {
        if (res?.data?.data?.error && res?.data?.data?.message) {
          showError(res.data.data.message, 3000);
        } else {
          const mgArticleCommentsCpy = JSON.parse(JSON.stringify(mgArticleComments));
          const comments = JSON.parse(JSON.stringify(mgArticleComments.data));
          comments.unshift(res?.data?.data);
          GAgenericEvent("engagement", "BBC Write A Comment", data.answer);

          setMgArticleComments({
            ...mgArticleCommentsCpy,
            data: comments,
            totalCount: mgArticleCommentsCpy?.totalCount + 1,
            limit: mgArticleCommentsCpy?.limit + 1,
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
      <div className="media-section-wrapper px-3.5 py-5 sm:py-8 sm:mb-0">
        <ActionBar
          authorDetails={articleDetailsInfo?.coauthors[0]}
          likesCount={articleDetailsInfo?.bbc_like_count}
          shareCount={articleDetailsInfo?.bbc_save_count}
          bookmarkCount={articleDetailsInfo?.bbc_share_count}
        />
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
          return <CommentGreyCard key={`comment_${id}`} comment={comment} onLikeComments={() => onLikeComments(comment)} />;
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
      </div>
      <SmallGreyRect />
    </div>
  );
};

export default React.memo(MediaSection);
