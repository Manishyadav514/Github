import Link from "next/link";
import React from "react";

import { UserType } from "@typesLib/articleUtilTypes";

interface PropTypes {
  authorDetails: UserType;
  reviewerDetail?: UserType;
}

const OtherReviewer = ({ authorDetails, reviewerDetail }: PropTypes) => {
  return reviewerDetail?.user_slug && authorDetails?.user_slug !== reviewerDetail?.user_slug ? (
    <Link href={reviewerDetail?.user_link} aria-label="Medically reviewed">
      <div className="md:flex md:space-x-1 px-14 pb-2">
        <p className="text-[12px] font-medium text-green-600">Medically reviewed by</p>
        <p className="text-[12px] font-medium text-green-600">{reviewerDetail?.display_name}</p>
      </div>
    </Link>
  ) : (
    <span />
  );
};

OtherReviewer.defaultProps = {
  reviewerDetail: null,
};

export default React.memo(OtherReviewer);
