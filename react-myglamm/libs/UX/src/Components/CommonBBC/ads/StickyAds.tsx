import React, { useEffect, useState } from "react";

const StickyAds = () => {
  const [stickyContainerVisibility, setStickyContainerVisibility] = useState(false);
  const handleScroll = () => {
    if ((window as any)?.oldScroll > window?.scrollY) {
      setStickyContainerVisibility(false);
    } else {
      setStickyContainerVisibility(true);
    }
    (window as any).oldScroll = window.scrollY;
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <div
        className={`left-0 top-0  w-full m-auto text-center ${stickyContainerVisibility ? "fixed md:hidden" : "hidden"}`}
        style={{ zIndex: "999" }}
      >
        <div id="top-sticky" className=" w-[320px] h-[50px] mx-auto" style={{ zIndex: "999" }} />
      </div>
      <div
        className={`left-0 bottom-0  w-full m-auto text-center ${stickyContainerVisibility ? "fixed md:hidden" : "hidden"}`}
        style={{ zIndex: "999" }}
      >
        <div id="bottom-sticky" className=" w-[320px] h-[50px] mx-auto" style={{ zIndex: "999" }} />
      </div>
    </>
  );
};

export default React.memo(StickyAds);
