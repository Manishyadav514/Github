import React from "react";

import { SkeletonStyle } from "@libComponents/Skeleton/SkeletonStyle";

interface loaderProps {
  noOfGrids?: number;
}

const TrendingSearchSimmer = ({ noOfGrids = 10 }: loaderProps) => (
  <div className="w-full">
    <div className="ml-3 h-5 w-1/2 rounded my-3" style={SkeletonStyle} />
    <div className="overflow-hidden pl-3 grid item-center grid-cols-5">
      {[...Array(noOfGrids)].map((_: any, i: number) => (
        <div key={i} className="w-1/12 pr-2 pt-2">
          <div className="bg-white rounded p-2">
            <div className="mx-auto bg-white h-10 w-10 rounded-full" style={SkeletonStyle} />
            <div className="h-5 w-10 rounded my-3" style={SkeletonStyle} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TrendingSearchSimmer;
