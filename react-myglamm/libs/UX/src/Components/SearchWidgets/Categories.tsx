import Link from "next/link";
import * as React from "react";
import SearchLabel from "@libComponents/Search/SearchLabel";

const Categories = ({ item }: any) => {
  if (item.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <div className="pb-8">
      <SearchLabel label={item.commonDetails.title} />
      <div style={{ whiteSpace: "nowrap" }}>
        {item?.multimediaDetails?.map((multimedia: any, index: number) => (
          <Link href={multimedia.targetLink} key={index} legacyBehavior>
            <a aria-hidden="true" aria-label={multimedia.imageAltTitle}>
              <figure className="inline-block mr-3">
                <img style={{ width: "90px" }} src={multimedia?.assetDetails?.url} alt={multimedia.imageAltTitle} />
              </figure>
            </a>
          </Link>
        ))}
      </div>
      <style jsx>
        {`
          .mt-12 {
            margin-top: 3rem;
          }
        `}
      </style>
    </div>
  );
};

export default Categories;
