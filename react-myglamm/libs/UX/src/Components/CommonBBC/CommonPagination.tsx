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
    <div className="flex items-center justify-between mx-auto lg:max-w-[500px] my-4 lg:my-8">
      <Link
        href={
          router.asPath.includes("page")
            ? `${router.asPath.split("?")[0]}?page=${pageNo > 1 ? pageNo - 1 : 1}`
            : `${router.asPath.split("?")[0]}`
        }
        title={`${pageTitle} ${pageNo > 1 ? pageNo - 1 : 1}`}
        aria-label="previous"
      >
        <span
          className={`${
            pageNo !== 1 ? "pointer-events-auto text-color1" : " pointer-events-none text-zinc-400"
          } uppercase text-11 font-semibold `}
        >
          Previous
        </span>
      </Link>
      {!pages.includes(1) && (
        <Link href={getLink(1)} title={pageTitle} aria-label="1">
          <span className={`${pages.includes(totalPage) ? "" : ""} uppercase font-semibold text-10 `}>{1}</span>
        </Link>
      )}
      {pages[0] > 5 && (
        <Link href={getLink(pages[0] - 1)} title={`${pageTitle} page ${pages[0] - 1}`} aria-label="...">
          <span className={`${pages.includes(totalPage) ? "" : ""} uppercase font-semibold text-10 `}>...</span>
        </Link>
      )}

      <span className="flex space-x-2 items-center justify-center">
        {pages.map((page: any) => (
          <Link key={page} href={getLink(page)} title={`${pageTitle} page ${page}`} aria-label={page}>
            <span
              className={`${
                page === pageNo ? "bg-color1 rounded-full text-white text-center" : " rounded-full text-black text-center"
              } w-[25px] h-[25px] inline-block py-1.5 text-10 font-semibold `}
            >
              {page}
            </span>
          </Link>
        ))}
      </span>
      {!pages.includes(totalPage) && (
        <Link
          href={getLink(pages[pages.length - 1] + 1)}
          title={`${pageTitle} page ${pages[pages.length - 1] + 1}`}
          aria-label="..."
        >
          <span className={`${pages.includes(totalPage) ? "" : ""} uppercase font-semibold text-10`}>...</span>
        </Link>
      )}
      {!pages.includes(totalPage) && (
        <Link href={getLink(totalPage)} title={`${pageTitle} page ${totalPage}`} aria-label={`${pageTitle} page ${totalPage}`}>
          <span className={`${pages.includes(totalPage) ? "" : ""} uppercase font-semibold text-10 `}>{totalPage}</span>
        </Link>
      )}
      <Link
        href={totalPage !== pageNo ? getLink((pageNo + 1)?.toString()) : getLink(pageNo?.toString())}
        title={`${pageTitle} page ${totalPage !== pageNo ? getLink((pageNo + 1)?.toString()) : getLink(pageNo?.toString())}`}
        aria-label="Next"
      >
        <span
          className={`${
            totalPage !== pageNo ? "pointer-events-auto text-color1" : " pointer-events-none text-zinc-400"
          } uppercase font-semibold text-11 `}
        >
          Next
        </span>
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
