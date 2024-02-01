import React from "react";

const NoPromoCodesAvailable = () => {
  return (
    <div className="bg-white flex flex-col mt-8" style={{ minHeight: "calc(100vh - 15rem)" }}>
      <div className="relative mx-auto my-1">
        <figure>
          <img className="p-2 w-80" alt="Empty Promo Codes" src="https://files.myglamm.com/site-images/original/empty@3x.png" />
        </figure>
      </div>

      <p className="text-center text-xl font-bold">No Promo Codes Available</p>
    </div>
  );
};

export default NoPromoCodesAvailable;
