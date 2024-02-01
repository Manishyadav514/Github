import React from "react";

import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";

import { GiForwardIco } from "@libComponents/GlammIcons";
import { BASE_URL } from "@libConstants/COMMON.constant";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

export interface XOHeader {
  pageURL: string;
  header?: string;
}

const MyGlammXOHeader = ({ pageURL, header }: XOHeader) => {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 w-full h-12 flex justify-between items-center bg-white z-50 shadow-md">
      <Link href="/" prefetch={false} className="p-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 25">
          <path
            fill="none"
            strokeWidth="2"
            stroke="#000"
            d="M34.143 50L34.143 42.588 39.857 42.588 39.857 50 47 50 47 40.118 37 29 27 40.118 27 50z"
            transform="translate(-26 -29)"
          />
        </svg>
      </Link>

      <h3 className="font-semibold">{t(header as string) || header}</h3>

      <button
        type="button"
        className="m-2.5 outline-none w-7 h-7"
        onClick={() =>
          (CONFIG_REDUCER.shareModalConfig = {
            shareUrl: `${BASE_URL()}/${pageURL}`,
            productName: "",
            slug: `/${pageURL}`,
            module: "page",
          })
        }
      >
        <GiForwardIco width="40" height="40" fill="#000" />
      </button>
    </div>
  );
};

export default MyGlammXOHeader;
