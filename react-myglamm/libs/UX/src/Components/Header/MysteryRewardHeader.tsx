import { isWebview } from "@libUtils/isWebview";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import BackIcon from "../../../public/svg/back-white.svg";

const MysteryRewardHeader = ({ headerLogo, vendorCode }: { headerLogo: string; vendorCode: string }) => {
  const router = useRouter();

  const goBack = useCallback(() => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  }, []);
  return (
    <>
      <header className="sticky w-full top-0 outline-none z-50 pt-3 mb-4">
        <div className="flex justify-between items-center">
          {isWebview() ? (
            <img className={`${vendorCode === "stb" ? "h-9" : "h-6"} block mx-auto`} alt="logo" src={headerLogo} />
          ) : (
            <>
              <span className="flex-1">
                <button
                  type="button"
                  aria-label="Previous Page"
                  onClick={goBack}
                  className="flex items-center justify-center w-12 outline-none"
                >
                  <BackIcon role="img" aria-labelledby="back" />
                </button>
              </span>
              <img className={`${vendorCode === "stb" ? "h-9" : "h-6"}`} alt="logo" src={headerLogo} />
              <span className="invisible flex-1"></span>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default MysteryRewardHeader;
