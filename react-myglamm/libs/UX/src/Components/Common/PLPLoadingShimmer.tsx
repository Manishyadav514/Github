import React from "react";

import { SkeletonStyle } from "@libComponents/Skeleton/SkeletonStyle";

interface loaderProps {
  noOfGrids?: number;
}

const Loader = ({ noOfGrids = 6 }: loaderProps) => (
  <div className="flex flex-wrap">
    {[...Array(noOfGrids)].map((_: any, i: number) => (
      <div key={i} className="w-1/2 pr-2 pt-2">
        <div className="bg-white rounded p-2">
          <div className="mx-auto h-28 w-28 bg-white rounded" style={SkeletonStyle} />

          <div className="h-5 w-10 rounded my-3" style={SkeletonStyle} />

          <p className="my-2 h-4 rounded-md" style={SkeletonStyle} />
          <p className="my-2 h-4 rounded-md" style={SkeletonStyle} />

          <div className="mt-3 flex">
            <div className="h-4 w-4 rounded mr-2" style={SkeletonStyle} />
            <div className="h-4 w-4 rounded" style={SkeletonStyle} />
          </div>

          <p className="mt-3 mb-2 h-4 rounded-md w-16" style={SkeletonStyle} />
        </div>
      </div>
    ))}
  </div>
);

export default Loader;
