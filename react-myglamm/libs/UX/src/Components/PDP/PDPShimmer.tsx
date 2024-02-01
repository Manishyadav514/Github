import React, { useEffect } from "react";
import { SkeletonStyle } from "@libComponents/Skeleton/SkeletonStyle";
import { disableBodyScroll, enableBodyScroll } from "@libUtils/bodyScroll";

const PDPShimmer = ({ visible }: { visible: boolean }) => {
  useEffect(() => {
    if (visible) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "block",
      }}
      className="absolute top-0 left-0  z-30 bg-white overflow-hidden"
      aria-hidden
    >
      <section className="relative mx-4 mt-4">
        <div className="h-80 w-80 mx-auto bg-themeGray rounded-3 mb-1" style={SkeletonStyle}></div>
        <div className="h-3 w-28 mx-auto bg-themeGray  rounded-3 mb-5" style={SkeletonStyle}></div>
        <div className="w-11/12 h-6 bg-themeGray rounded-3 mb-1" style={SkeletonStyle}></div>
        <div className="w-9/12 h-6 bg-themeGray rounded-3 mb-2" style={SkeletonStyle}></div>
        <div className="w-10/12 h-4 bg-themeGray rounded-3 mb-1" style={SkeletonStyle}></div>
        <div className="flex justify-between items-center my-4">
          <div className="w-3/6">
            <div className="w-5/6 h-7 bg-themeGray rounded-3 mb-0.5" style={SkeletonStyle}></div>
            <div className="w-3/6 h-3 bg-themeGray rounded-3 mb-1" style={SkeletonStyle}></div>
          </div>
          <div className="w-3/6">
            <div className="flex flex-col items-end">
              <div className="w-1/6 h-5 bg-themeGray rounded-3 mb-0.5" style={SkeletonStyle}></div>
              <div className="w-3/6 h-5 bg-themeGray rounded-3 mb-1" style={SkeletonStyle}></div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="w-24 h-7 bg-themeGray rounded-3 mb-0.5" style={SkeletonStyle}></div>
          <div className="w-24 h-7 bg-themeGray rounded-3 mb-0.5" style={SkeletonStyle}></div>
          <div className="w-24 h-7 bg-themeGray rounded-3 mb-0.5" style={SkeletonStyle}></div>
        </div>
        <div className="flex justify-between">
          <div className="w-1/6 h-3 bg-themeGray rounded-3 mb-1" style={SkeletonStyle}></div>
          <div className="w-1/6 h-3 bg-themeGray rounded-3 mb-1" style={SkeletonStyle}></div>
        </div>
        <div
          className="overflow-hidden flex gap-2 mb-4 mt-1"
          style={{
            scrollSnapType: "x mandatory",
          }}
        >
          {[...Array(8)].map((_, i) => {
            return <div key={i} className="h-11 w-11 bg-themeGray rounded-lg" style={SkeletonStyle}></div>;
          })}
        </div>

        <div className="w-full h-52 first-line:bg-themeGray rounded-lg" style={SkeletonStyle}></div>
      </section>
    </div>
  );
};

export default PDPShimmer;
{
  /* <>
        <span className="absolute left-4 top-3 h-4 w-14 rounded-3 bg-themeGray " style={SkeletonStyle}></span>

        <span className="absolute right-4 top-2 h-12 w-12 rounded-full bg-themeGray " style={SkeletonStyle}></span>

        <span className="absolute left-4 bottom-2 h-12 w-12 rounded-full bg-themeGray " style={SkeletonStyle}></span>

        <span  className="absolute right-4 bottom-2 h-12 w-12 rounded-full bg-themeGray " style={SkeletonStyle}></span>
      </> */
}
