import Link from "next/link";
import * as React from "react";
import SearchLabel from "@libComponents/Search/SearchLabel";
import { SHOP } from "@libConstants/SHOP.constant";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const ModuleCarousal4 = ({ item }: any) => (
  <div className="pb-8">
    <SearchLabel label={item.commonDetails.title} />
    <div style={{ whiteSpace: "nowrap" }}>
      {item?.commonDetails.descriptionData &&
        item?.commonDetails.descriptionData[0]?.value.map((value: any, index: number) => (
          <Link href={value.urlManager.url} key={index} legacyBehavior>
            <figure className="w-2/4 inline-block mr-3" style={{ verticalAlign: "top" }}>
              <a aria-hidden="true" aria-label={value?.cms[0]?.content?.name || value?.assets[0]?.name}>
                <img
                  style={{ height: "85px", width: "200px" }}
                  src={value?.assets[0]?.imageUrl?.["768x432"] || DEFAULT_IMG_PATH()}
                  alt={value?.assets[0]?.name}
                />
                <figcaption
                  // style={{
                  //   wordBreak: "break-all",
                  //   whiteSpace: "normal",
                  // }}
                  className="h-10 truncate text-xs mt-2"
                >
                  {value?.cms[0]?.content?.name}
                </figcaption>
              </a>
            </figure>
          </Link>
        ))}
    </div>
    <style jsx>
      {`
        h3 {
          font-size: 12px;
          margin-left: 10px;
          font-weight: bold;
          line-height: 2;
          color: rgb(105, 105, 105);
        }
        .mt-12 {
          margin-top: 3rem;
        }
      `}
    </style>
  </div>
);

export default ModuleCarousal4;
