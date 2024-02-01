import React from "react";

import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

import WidgetLabel from "./WidgetLabel";
import VideoCard from "../CardComponents/VideoCard";

const RectangleVideoBanner = ({ item }: any) => {
  if (item.multimediaDetails.length === 0) {
    return null;
  }
  return (
    <ErrorBoundary>
      <section className="RectangleVideoBanner my-5 mx-auto" role="banner">
        <WidgetLabel title={item.commonDetails.title} />
        <p className="text-sm -mt-3 mb-3 px-3" style={{ color: "#9b9b9b" }}>
          {item.commonDetails.shortDescription}
        </p>

        <div
          className="px-3 flex overflow-x-auto overflow-y-hidden"
          style={{
            scrollSnapType: "x mandatory",
          }}
        >
          {item.multimediaDetails.map((video: any) => (
            <div
              key={video.sliderText}
              className="outline-none"
              style={{
                scrollSnapAlign: "center",
              }}
            >
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default RectangleVideoBanner;
