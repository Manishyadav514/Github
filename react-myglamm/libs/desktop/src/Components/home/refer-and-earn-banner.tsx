import React from "react";
import Link from "next/link";

import { LazyLoadImage } from "react-lazy-load-image-component";

const ReferBanner = ({ data }: any) => {
  if (data.multimediaDetails.length === 0) {
    return null;
  }
  return (
    <section className="fullwidth pull-left  hide-for-mob">
      <div className="home-referral-earn fullwidth pull-left">
        <div className="row">
          <figure>
            <Link href={data?.multimediaDetails?.[0]?.targetLink} target="_blank">
              <LazyLoadImage
                src={data?.multimediaDetails?.[0]?.assetDetails?.url}
                alt={data?.multimediaDetails?.[0]?.headerText}
              />
            </Link>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default ReferBanner;
