import { useRouter } from "next/router";
import React from "react";
import Cross from "../../../public/svg/crossRed.svg";

const orderFailedForSimpl = () => {
  const router = useRouter();
  return (
    <React.Fragment>
      <div className="flex flex-col text-center bg-darkpink pt-8 mb-4">
        <div className="bg-white rounded-full mx-auto mb-3 p-4">
          <Cross />
        </div>
        <h2 className="font-bold text-xl mb-4">Payment Failed !</h2>
        <p className="mb-6 text-sm">Sorry but your transaction couldn&apos;t go through :(</p>
        <div className="flex justify-center">
          <button
            className="uppercase w-1/2 bg-ctaImg py-2 px-10 rounded-lg text-white mb-5 "
            onClick={() => router.push("/payment")}
          >
            Retry Payment
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default orderFailedForSimpl;
