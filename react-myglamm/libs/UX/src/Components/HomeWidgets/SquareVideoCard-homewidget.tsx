import * as React from "react";

import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import VideoCard from "@libComponents/CardComponents/VideoCard";
import WidgetLabel from "./WidgetLabel";

const SquareVideoCard = ({ item }: any) => {
  if (item.multimediaDetails.length === 0) {
    return null;
  }

  return (
    <ErrorBoundary>
      <section className="SquareVideoBanner my-5" role="banner">
        <WidgetLabel title={item.commonDetails.title} />
        <p className="text-sm -mt-3 mb-3 px-3" style={{ color: "#9b9b9b" }}>
          {item.commonDetails.shortDescription}
        </p>
        <div className="w-full outline-none px-3">
          {item && item.multimediaDetails && <VideoCard video={item?.multimediaDetails[0]} isSingleVideo />}
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default SquareVideoCard;
