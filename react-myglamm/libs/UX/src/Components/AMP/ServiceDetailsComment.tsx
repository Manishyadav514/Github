/* eslint-disable prefer-const */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/function-component-definition */
import { format } from "date-fns";
import parse from "html-react-parser";

export default function ServiceDetailsComment({ relationalData, data }: any) {
  let { commentText, createdAt, id, identifier } = data;
  const isLongComment = commentText.length > 100;
  commentText = commentText.slice(0, 100);
  const commentSlug = commentText
    ?.substr(0, 101)
    ?.replace(/ /g, "-")
    ?.replace(/\W+(?!$)/g, "-")
    ?.replace(/\W$/g, "")
    ?.toLowerCase();

  const { profileUrl, username } = relationalData?.identifiers?.[identifier] || {};

  return (
    <div>
      <div className="thumb">
        <div className="profile">
          <amp-img src={profileUrl} height="48" width="48" layout="fixed" />
        </div>
        <div className="body">
          <div className="author">{username}</div>
          <div className="data review">
            <p>
              {parse(commentText)}
              {isLongComment && (
                <span>
                  ...
                  <a href={`/community/review/${id}/${commentSlug}`} aria-label="see more">
                    see more
                  </a>
                </span>
              )}
              <br />
              {/* <small>0 likes 0 comments</small> */}
              <br />
              <small> on {format(new Date(createdAt), "MMM do, yyyy")}</small>
            </p>
            <div className="v-center">
              <span>Share on</span>
              <a
                href={`http://www.facebook.com/sharer.php?u=https://www.babychakra.com/review/${id}`}
                target="_blank"
                rel="nofollow noreferrer"
                className="share-icon-wrapper"
                aria-label="share on"
              >
                <amp-img
                  src="https://files.babychakra.com/site-images/original/facebook-icon.png"
                  width="22"
                  height="22"
                  alt="Facebook Icon"
                  layout="fixed"
                />
              </a>
              <a
                target="_blank"
                href={`https://twitter.com/intent/tweet?url=https://www.babychakra.com/review/${id}`}
                rel="nofollow noreferrer"
                className="share-icon-wrapper"
                aria-label="twitter"
              >
                <amp-img
                  src="https://files.babychakra.com/site-images/original/twitter.png"
                  width="22"
                  height="22"
                  alt="Twitter Icon"
                  layout="fixed"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
