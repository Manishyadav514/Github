import React, { Fragment, useEffect } from "react";
import { useTimer } from "react-timer-hook";

const CTPCountDownTimer = ({ expiryTimestamp, callback }: any) => {
  const { seconds, minutes, hours, days, start, pause } = useTimer({
    expiryTimestamp,
    onExpire: () => {},
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
      <div className="flex items-center">
        {`${hours + days * 24 < 10 ? `0${hours + days * 24}` : hours + days * 24}h : ${
          minutes < 10 ? `0${minutes}` : minutes
        }m : ${seconds < 10 ? `0${seconds}` : seconds}s`}
      </div>
    </Fragment>
  );
};

export default CTPCountDownTimer;
