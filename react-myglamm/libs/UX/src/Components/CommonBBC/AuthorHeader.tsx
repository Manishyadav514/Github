import React from "react";
import Image from "next/legacy/image";
import Link from "next/link";

import PrimaryBtn from "@libComponents/CommonBBC/PrimaryBtn";

import useFollowAuthor from "@libHooks/useFollowAuthor";

import { UserType } from "@typesLib/articleUtilTypes";

interface PropTypes {
  authorDetails: UserType;
  reviewerDetail?: UserType;
}

const AuthorHeader = (props: PropTypes) => {
  const { authorDetails, reviewerDetail } = props;
  const [isFollowing, onFollowAuthor, onUnFollowAuthor]: any = useFollowAuthor(authorDetails);
  return (
    <div className="flex items-center pb-2">
      <div className="mr-4">
        <Image
          priority
          layout="intrinsic"
          src={authorDetails?.avatar || "https://secure.gravatar.com/avatar/e47a9d73cf33670019fef51f71532228?s=48&d=mm&r=g"}
          width={35}
          height={35}
          title=""
          alt=""
          className="rounded-full"
        />
      </div>

      <div>
        <Link href="/community/feed" aria-label="Medically reviewed">
          {authorDetails?.user_slug === reviewerDetail?.user_slug && (
            <p className="text-[12px] font-medium text-green-600 ">Medically reviewed by</p>
          )}
          <p className="text-sm font-medium capitalize">{authorDetails?.display_name}</p>
        </Link>
        <p className="text-xs font-medium text-gray-400">
          {"Author"} | {authorDetails?.article_count} {"Articles"}
        </p>
      </div>

      <PrimaryBtn
        buttonName={isFollowing ? "Unfollow" : "Follow"}
        customClassName="ml-auto"
        buttonOnClick={() => {
          if (isFollowing) {
            onUnFollowAuthor();
          } else {
            onFollowAuthor();
          }
        }}
      />
    </div>
  );
};

AuthorHeader.defaultProps = {
  reviewerDetail: null,
};

export default React.memo(AuthorHeader);
