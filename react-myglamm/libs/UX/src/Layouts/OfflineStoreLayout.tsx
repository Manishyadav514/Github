import React, { ReactElement } from "react";
import WebsiteNameIcon from "@libComponents/Header/WebsiteNameIcon";
import BackBtn from "@libComponents/LayoutComponents/BackBtn";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { isClient } from "@libUtils/isClient";
import { useRouter } from "next/router";

const OfflineStoreLayout = ({ children }: { children: ReactElement }) => {
  const router = useRouter();
  const store = isClient() ? sessionStorage.getItem(SESSIONSTORAGE.OFFLINE_STORE_NAME) : false;

  return (
    <>
      <header className="sticky w-full top-0 outline-0 z-50">
        <div className="flex flex-row items-center h-12 bg-white">
          <BackBtn handleBack={() => router.push(`/skin-analyser/${store}`)} />
          <WebsiteNameIcon />
        </div>
      </header>
      {children}
    </>
  );
};
export default OfflineStoreLayout;
