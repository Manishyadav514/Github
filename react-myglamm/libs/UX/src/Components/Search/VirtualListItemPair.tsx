import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { useInView } from "react-intersection-observer";

import PLPProdCell from "@libComponents/ProductGrid/PLPProdCell";

const VirtualListItemPair = React.memo(({ chunk, index, announceInView }: any) => {
  const { ref, inView } = useInView({ threshold: 0, triggerOnce: true });
  const animationRef = useRef(null);

  useEffect(() => {
    if (inView) {
      announceInView(index);
    }
  }, [inView]);

  return (
    <div className="flex w-full" ref={ref} role="list">
      {chunk.map((item: any, chunkIndex: number) => {
        return (
          <div
            ref={animationRef}
            data-id={item.productId}
            key={`${item.productId}-${index}-${chunkIndex}`}
            className={clsx(
              "w-1/2 transition-all duration-1000",
              animationRef.current ? "opacity-100 translate-y-0 " : "opacity-0 -translate-y-1.5",
              chunkIndex === 0 && "pr-1",
              index !== 0 && "pt-1"
            )}
            style={{
              transitionDelay: `${(inView ? 0.1 : 0.02) * index}s`,
            }}
            role="listitem"
          >
            {!item.placeholder ? (
              <PLPProdCell product={item} forceload={chunkIndex < 4} />
            ) : (
              <div
                className="flex items-center justify-center"
                style={{
                  width: "100%",
                  height: "290px",
                  backgroundColor: "#FEFEFE",
                  contentVisibility: inView ? "visible" : "hidden",
                }}
              >
                <span className="animate-ping absolute h-3 w-3 inline-flex rounded-full bg-color1" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default VirtualListItemPair;
