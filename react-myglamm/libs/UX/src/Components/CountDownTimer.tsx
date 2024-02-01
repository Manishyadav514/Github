import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { useTimer } from "react-timer-hook";

const CountDownTimer = ({ expiryTimestamp, pinkBackgroud, source, callback }: any) => {
  const router = useRouter();

  const { seconds, minutes, hours, days, start, pause } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      if (source === "paymentStatus") {
        return router.push("/order-summary?status=pending");
      }
      console.warn("onExpire called");
    },
  });

  useEffect(() => {
    start();
  }, [expiryTimestamp]);

  useEffect(() => {
    return () => pause();
  }, []);

  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      callback?.();
    }
  }, [minutes, seconds]);

  return (
    <Fragment>
      <div
        style={source !== "product" && source !== "home" ? { marginTop: "-11px", marginRight: "10px" } : {}}
        className={`${source === "product" ? "mt-auto mb-auto ml-auto" : "mt-0"} pl-2`}
      >
        {!["product", "home", "paymentStatus", "cartProduct"].includes(source) && (
          <span
            className="flex w-full text-xs"
            style={{
              color: "#ff6666",
              marginTop: "13px",
            }}
          >
            {" "}
            Ends in
          </span>
        )}
        <div className="flex items-center pr-2">
          {["product", "home", "cartProduct"].includes(source) && (
            <span
              className="text-xs pr-1"
              style={{
                marginRight: source === "home" ? "10px" : "0px",
                color: source === "home" ? "#000" : "#ff6666",
              }}
            >
              Ends in
            </span>
          )}
          {["product", "home"].includes(source) && (
            <React.Fragment>
              <span
                style={{
                  borderRadius: "2.4px",
                  color: source === "home" ? "#fff" : "#ff6666",
                  backgroundColor: source === "home" ? "#ff9797" : "#fff",
                }}
                className={`float-left text-center font-semibold ${source === "home" ? `text-base px-1` : `text-sm`}`}
              >
                {hours + days * 24 < 10 ? `0${hours + days * 24}` : hours + days * 24}
              </span>

              <span
                className={`text-center ${source === "home" ? `text-base px-1` : `text-sm`}`}
                style={{
                  color: source === "home" ? "#000" : "#ff6666",
                }}
              >
                :
              </span>
            </React.Fragment>
          )}

          <span
            style={{
              borderRadius: "2.4px",
              color: source === "home" ? "#fff" : "#ff6666",
              backgroundColor: source === "home" ? "#ff9797" : "#fff",
            }}
            className={`float-left text-center font-semibold  ${source === "home" ? `text-base w-6` : `text-sm`}`}
          >
            {minutes < 10 ? `0${minutes}` : minutes}
            {source === "cartProduct" && "m "}
          </span>
          <span
            className={`text-center ${source === "home" ? `text-base w-3` : `text-sm`}`}
            style={{
              color: source === "home" ? "#000" : "#ff6666",
            }}
          >
            :
          </span>
          <span
            style={{
              borderRadius: "2.4px",
              color: source === "home" ? "#fff" : "#ff6666",
              backgroundColor: source === "home" ? "#ff9797" : "#fff",
            }}
            className={`float-left text-center font-semibold ${source === "home" ? `text-base w-6` : `text-sm`}`}
          >
            {seconds < 10 ? `0${seconds}` : seconds}
            {source === "cartProduct" && "s"}
          </span>
        </div>
      </div>
      {/* )} */}
    </Fragment>
  );
};

export default CountDownTimer;
