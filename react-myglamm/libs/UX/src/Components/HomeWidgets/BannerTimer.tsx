import React, { Fragment, useEffect } from "react";
import { useTimer } from "react-timer-hook";

const BannerTimer = ({ expiryTimestamp, asset, getCurrentDateTime, startDate }: any) => {
  if (!expiryTimestamp || getCurrentDateTime < startDate || getCurrentDateTime > expiryTimestamp) {
    return null;
  }

  const { seconds, minutes, hours, days, start, pause, isRunning } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      console.warn("onExpire called");
    },
  });

  useEffect(() => {
    start();
  }, [expiryTimestamp]);

  useEffect(() => () => pause(), []);

  let cssTimerClass = "top-2 right-2";

  if (asset.assetDetails.properties?.timerPosition) {
    switch (asset.assetDetails.properties.timerPosition) {
      case "LEFT TOP": {
        cssTimerClass = "top-2 left-2";
        break;
      }
      case "LEFT BOTTOM": {
        cssTimerClass = "bottom-4 left-1";
        break;
      }
      case "RIGHT TOP": {
        cssTimerClass = "top-2 right-2";
        break;
      }
      case "RIGHT BOTTOM": {
        cssTimerClass = "bottom-4 right-2";
        break;
      }
      case "MIDDLE TOP": {
        cssTimerClass = "mx-auto top-2 right-0 justify-center left-0  flex";
        break;
      }
      case "MIDDLE BOTTOM": {
        cssTimerClass = "mx-auto bottom-4 right-0 justify-center left-0  flex";
        break;
      }
      case "MIDDLE": {
        cssTimerClass = "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
        break;
      }

      default: {
        throw new Error("Unsupprorted Soical Platform detected");
      }
    }
  }

  return (
    <Fragment>
      {isRunning && (
        <div
          className={`absolute ${cssTimerClass}`}
          // style={{
          //   // margin: "5px 0px 5px 0px",
          //   top: "-5px",
          //   right: "10px",
          // }}
        >
          <div
            className="flex items-center px-2  text-sm rounded-md py-0.5 text-color1 font-semibold"
            style={{
              // change the color #ff6666 to #B30000 for sufficienr color contrast
              color: "#B30000",
              backgroundColor: "#fff",
            }}
          >
            <span className="pr-1">Ends in</span>
            <div className="text-center">
              <span>{hours + days * 24 < 10 ? `0${hours + days * 24}` : hours + days * 24}</span>
              <span>:</span>

              <span>{minutes < 10 ? `0${minutes}` : minutes}</span>
              <span>:</span>
              <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default BannerTimer;
