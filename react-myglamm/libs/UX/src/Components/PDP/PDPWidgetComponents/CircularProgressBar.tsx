import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const CircularProgressBar = ({
  percentage,
  size = 52,
  radiusWidth = 6,
  animation = true,
  animationSpeed = 20,
}: {
  percentage: number;
  size?: number;
  radiusWidth?: number;
  animation?: boolean;
  animationSpeed?: number;
}) => {
  if (!percentage) return null;

  const [progress, setProgress] = useState(0);
  const { ref, inView } = useInView({ threshold: 0, triggerOnce: true, delay: 1 });

  useEffect(() => {
    let progressInterval: any;
    if (inView && animation) {
      let progressStartValue = 0;
      progressInterval = setInterval(() => {
        progressStartValue++;
        setProgress(progressStartValue);
        if (progressStartValue === percentage) {
          clearInterval(progressInterval);
        }
      }, animationSpeed);
    }

    return () => progressInterval && clearInterval(progressInterval);
  }, [percentage, animationSpeed, inView]);

  return (
    <div ref={ref}>
      <div
        className="circular-progress flex justify-center items-center relative rounded-full"
        style={{
          background: `conic-gradient(var(--color1) ${progress * 3.6}deg, var(--color3) 0deg)`,
          height: `${size}px`,
          width: `${size}px`,
        }}
      >
        <span className="relative font-bold">{`${progress}%`}</span>
      </div>
      <style jsx>
        {`
          .circular-progress:before {
            content: "";
            position: absolute;
            height: ${size - radiusWidth}px;
            width: ${size - radiusWidth}px;
            border-radius: 50%;
            background: var(--color2);
          }
        `}
      </style>
    </div>
  );
};

export default CircularProgressBar;
