import React from "react";
import { PDPProd } from "@typesLib/PDP";

import InsightIcon from "../../../public/svg/insight.svg";

const ColoredText = ({ text, colors }: any) => {
  let parts = [];
  let lastIndex = 0;

  colors.forEach((colorData: any) => {
    const { startIndex, endIndex, color } = colorData;

    // Add the part without background color
    parts.push(text.substring(lastIndex, startIndex));

    // Add the part with background color
    parts.push(
      <span key={`${startIndex}-${endIndex}`} style={{ color: color }}>
        {text.substring(startIndex, endIndex)}
      </span>
    );

    lastIndex = endIndex;
  });

  // Add the remaining part without background color
  parts.push(text.substring(lastIndex));
  return <>{parts}</>;
};

const PDPInsight = ({ product }: { product: PDPProd }) => {
  const { productInsightData } = product?.productMeta || {};

  if (!productInsightData?.length) {
    return null;
  }


  return (
    <section className="relative mt-2" >
      <div className="flex overflow-hidden gap-3 relative bg-color2 h-7 pt-1" style={{ userSelect: "none" }}>
        <div className="flex flex-shrink-0 gap-3 justify-around min-w-full marquee-content">
          {productInsightData?.map((insight: any, index: number) => {
            return (
              <p key={index} className="rounded-2xl px-2 py-1 text-xxs font-bold flex items-center bg-white h-5">
                <ColoredText text={insight.text} colors={insight.colors} />
              </p>
            );
          })}
        </div>
        <div className="flex flex-shrink-0  gap-3 justify-around min-w-full marquee-content">
          {productInsightData?.map((insight: any, index: number) => {
            return (
              <p key={index} className="rounded-2xl px-2 py-1 text-xxs font-bold flex items-center bg-white h-5">
                <ColoredText text={insight.text} colors={insight.colors} />
              </p>
            );
          })}
        </div>
      </div>
         <div className="absolute top-0 left-0" >
         <InsightIcon className="h-7 w-7 relative z-10" />
       </div>
      <style jsx>
        {`
          .marquee-content {
            animation: marqueeAnimation 12s linear infinite;
          }

          @keyframes marqueeAnimation {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(calc(-100% - 0.75rem));
            }
          }
        `}
      </style>
    </section>
  );
};

export default PDPInsight;
