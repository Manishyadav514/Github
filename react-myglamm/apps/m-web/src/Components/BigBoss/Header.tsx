import React from "react";
import BackBtn from "@libComponents/LayoutComponents/BackBtn";
import ShareIcon from "../../../public/mgp/svg/share-black.svg";

function Header({ label, showShare = false, handleShare = null }) {
  return (
    <React.Fragment>
      <header className="sticky w-full top-0 outline-0 z-50">
        <div className="flex flex-row items-center justify-between h-12 bg-white">
          <div className="flex flex-row items-center">
            <BackBtn />
            <p className="text-sm font-bold tracking-wide text-black">{label}</p>
          </div>
          {showShare && (
            <div onClick={() => handleShare()} className="flex justify-center items-center h-full w-12">
              <ShareIcon className="w-10 h-5 mr-3" />
            </div>
          )}
        </div>
        <hr className="text-gray-800" />
      </header>
    </React.Fragment>
  );
}

Header.whyDidYouRender = true;

export default Header;
