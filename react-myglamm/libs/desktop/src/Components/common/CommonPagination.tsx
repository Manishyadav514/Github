import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { getNumberOfPages, getPageSlots } from "@libUtils/helper";

type PropTypes = {
  totalItems: number;
  pageNo: number;
  noOfSlots: number;
  position?: "pre" | "post" | undefined;
  additionalParams?: string;
  pageLimit?: number;
  pageTitle: string;
};

// to be optimized -> url, text, active , class active , class deactive
const PaginationComponent = ({
  totalItems,
  pageNo,
  noOfSlots,
  additionalParams,
  position,
  pageTitle,
  pageLimit = 10,
}: PropTypes) => {
  const router = useRouter();
  if (!totalItems || totalItems === 0) {
    return <span />;
  }

  // 10 is the list size -> how many to skip
  const totalPage = getNumberOfPages(totalItems, pageLimit);
  const pages = getPageSlots(pageNo, noOfSlots, totalPage);

  const getLink = (page: any) => {
    const params = additionalParams?.replace("?", "");
    if (!additionalParams) {
      return `${router.asPath.split("?")[0]}?page=${page}`;
    }
    if (position === "pre") {
      return `${router.asPath.split("?")[0]}?${params}&page=${page}`;
    }
    return `${router.asPath.split("?")[0]}?page=${page}&${params}`;
  };

  return (
    <div className="flex items-center justify-between mx-auto max-w-[500px] my-8">
      <Link
        href={
          router.asPath.includes("page")
            ? `${router.asPath.split("?")[0]}?page=${pageNo > 1 ? pageNo - 1 : 1}`
            : `${router.asPath.split("?")[0]}`
        }
        legacyBehavior
      >
        <a title={`${pageTitle} ${pageNo > 1 ? pageNo - 1 : 1}`}>
          <span
            className={`${
              pageNo !== 1 ? "pointer-events-auto text-color1" : " pointer-events-none text-gray-400"
            } uppercase text-[11px] font-semibold `}
          >
            Previous
          </span>
        </a>
      </Link>
      {!pages.includes(1) && (
        <Link href={getLink(1)} legacyBehavior>
          <a title={pageTitle}>
            <span className={`${pages.includes(totalPage) ? "" : ""} uppercase font-semibold text-[11px] `}>{1}</span>
          </a>
        </Link>
      )}
      {pages[0] > 5 && (
        <Link href={getLink(pages[0] - 1)} legacyBehavior>
          <a title={`${pageTitle} page ${pages[0] - 1}`}>
            <span className={`${pages.includes(totalPage) ? "" : ""} uppercase font-semibold text-[11px] `}>...</span>
          </a>
        </Link>
      )}

      <span className="flex space-x-2 items-center justify-center">
        {pages.map(page => (
          <Link key={page} href={getLink(page)} legacyBehavior>
            <a title={`${pageTitle} page ${page}`}>
              <span
                className={`${
                  page === pageNo ? "bg-color1 rounded-full text-white text-center" : " rounded-full text-black text-center"
                } w-[25px] h-[25px] inline-block py-1.5 text-[11px] font-semibold `}
              >
                {page}
              </span>
            </a>
          </Link>
        ))}
      </span>
      {!pages.includes(totalPage) && (
        <Link href={getLink(pages[pages.length - 1] + 1)} legacyBehavior>
          <a title={`Learn page ${pages[pages.length - 1] + 1}`}>
            <span className={`${pages.includes(totalPage) ? "" : ""} uppercase font-semibold text-[11px]`}>...</span>
          </a>
        </Link>
      )}
      {!pages.includes(totalPage) && (
        <Link href={getLink(totalPage)} legacyBehavior>
          <a title={`Learn page ${totalPage}`}>
            <span className={`${pages.includes(totalPage) ? "" : ""} uppercase font-semibold text-[11px] `}>{totalPage}</span>
          </a>
        </Link>
      )}
      <Link href={totalPage !== pageNo ? getLink((pageNo + 1).toString()) : getLink(pageNo.toString())} legacyBehavior>
        <a title={`Learn page ${totalPage !== pageNo ? getLink((pageNo + 1).toString()) : getLink(pageNo.toString())}`}>
          <span
            className={`${
              totalPage !== pageNo ? "pointer-events-auto text-color1" : " pointer-events-none text-gray-400"
            } uppercase font-semibold text-[11px] `}
          >
            Next
          </span>
        </a>
      </Link>
    </div>
  );
};

PaginationComponent.defaultProps = {
  position: "null",
  additionalParams: "",
  pageLimit: 10,
};

export default PaginationComponent;
