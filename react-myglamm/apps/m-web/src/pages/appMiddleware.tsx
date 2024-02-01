import React, { ReactElement } from "react";
import { useRouter } from "next/router";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

const AppMiddleware = () => {
  const router = useRouter();
  const { platform, deepLink } = router.query;

  if (deepLink && typeof deepLink === "string" && typeof window !== "undefined") {
    const redirectURL = `${deepLink}${deepLink.includes("?") ? "&" : "?"}closeThisPage=true`;

    if (platform === "android") {
      return (window as any).MobileApp?.redirect(redirectURL);
    }
    // eslint-disable-next-line no-return-assign
    return (window.location.href = redirectURL);
  }
  return <LoadSpinner className="flex m-auto w-24 align-middle h-screen" />;
};

AppMiddleware.getLayout = (children: ReactElement) => children;

export default AppMiddleware;
