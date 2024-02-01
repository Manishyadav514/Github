import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { useTimer } from "react-timer-hook";

const customTimer = ({ expiryTimestamp }: { expiryTimestamp: Date }) => {
  const router = useRouter();

  const { seconds, minutes, start, pause } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      return router.push("/order-summary?status=failed");
    },
  });

  useEffect(() => {
    start();
  }, [expiryTimestamp]);

  useEffect(() => () => pause(), []);
  return (
    <div className="ml-3">
      <span
        style={{
          borderRadius: "2.4px",
          color: "#ff6666",
          backgroundColor: "#fff",
        }}
        className="float-left text-center font-semibold text-sm"
      >
        {minutes < 10 ? `0${minutes}:` : minutes}
      </span>

      <span
        style={{
          borderRadius: "2.4px",
          color: "#ff6666",
          backgroundColor: "#fff",
        }}
        className="float-left text-center font-semibold text-sm"
      >
        {seconds < 10 ? `0${seconds}` : seconds}
      </span>
    </div>
  );
};

export default customTimer;
