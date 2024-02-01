import React, { useEffect } from "react";
import Link from "next/link";
import ReactDOM from "react-dom";

import { enableBodyScroll, disableBodyScroll } from "@libUtils/bodyScroll";

const AppLoginReqModal = () => {
  useEffect(() => {
    disableBodyScroll();

    return enableBodyScroll;
  });

  return ReactDOM.createPortal(
    <div className="text-center">
      <div className="inset-0 fixed bg-black/50 filter blur z-50" />

      <div className="inset-0 fixed z-50 flex items-center justify-center">
        <Link
          href="/login"
          className="text-white w-52  font-semibold z-50 rounded-lg uppercase shadow-lg p-2 m-auto outline-none bg-color1"
          aria-label="Please Login to Continue"
        >
          Please Login to Continue
        </Link>
      </div>
    </div>,

    document.getElementById("modal-root") as HTMLElement
  );
};

export default AppLoginReqModal;
