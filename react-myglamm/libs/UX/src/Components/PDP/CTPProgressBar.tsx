import React, { useRef, useEffect } from "react";

type progressBar = { percentage: number; duration: number; label: string };

const CTPProgressBar = ({ percentage, duration, label }: progressBar) => {
  const progressBarRef = useRef<any>(null);

  useEffect(() => {
    if (percentage < 100) {
      const progressBar = progressBarRef.current;
      const progress = progressBar.querySelector(".progress-bar-fill");
      const label = progressBar.querySelector(".progress-bar-label");
      progress.style.animationDuration = `${2000}ms`;
      progress.style.width = `${percentage < 10 ? 10 : percentage}%`;
      setTimeout(() => {
        label.style.display = "flex";
      }, 200);
    }
  }, [percentage, duration]);

  if (percentage >= 100) return <></>;

  return (
    <>
     <div className="mx-2 overflow-x-hidden h-8 " >
     <div
        className="progress-bar w-auto bg-gray-100 rounded-sm h-1.5 dark:bg-white-700 mt-3 relative "
        ref={progressBarRef}
      >
        <div className="progress-bar-fill absolute top-0 left-0 h-full bg-ctaImg transition-width flex justify-end">
          <div
            className="progress-bar-label z-10 absolute top-1/2 transform -translate-y-1/2 bg-ctaImg rounded-full shadow text-white text-11 text-center font-bold h-5 hidden justify-center items-center "
            style={{ minWidth: "39px" }}
          >
            {label}
          </div>
        </div>
      </div>
     </div>
      <style jsx>
        {`
          @keyframes progressBarAnimation {
            0% {
              width: 0;
            }
          }
          .progress-bar-fill {
            animation: progressBarAnimation forwards;
          }
        `}
      </style>
    </>
  );
};
export default CTPProgressBar;
