import React, { useCallback } from "react";
import { useRouter } from "next/router";

import BackIcon from "../../../public/svg/backicon.svg";

const BackBtn = ({ children, handleBack }: { handleBack?: () => void; children?: any }) => {
  const router = useRouter();

  const goBack = useCallback(() => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  }, []);

  return (
    <button
      type="button"
      aria-label="Previous Page"
      onClick={handleBack || goBack}
      className="flex items-center justify-center w-12 outline-none"
    >
      {children || <BackIcon role="img" aria-labelledby="back" title="back" />}
    </button>
  );
};

export default BackBtn;
