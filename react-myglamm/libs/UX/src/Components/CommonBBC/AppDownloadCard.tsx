import React from "react";
import Link from "next/link";

import { APP_STORE, GOOGLE_PLAY } from "@libConstants/BBC_PLAYSTORE.constant";
import { getStaticUrl } from "@libUtils/getStaticUrl";

const AppDownloadCard = () => {
  return (
    <div className="m-4 relative lg:max-w-[400px] lg:mx-auto lg:m-8 lg:hidden">
      <img src={getStaticUrl("/images/bbc-g3/donwloadApp-elephant.png")} alt="app download" width="100%" className="" />
      <div className="absolute top-6 right-4">
        <p className="text-white text-xl font-semibold leading-6">Download BabyChakra App</p>
        <p className="text-white text-xl font-semibold ">and track your baby growth</p>
        <p className="text-white pt-2 pb-3">Download App Now</p>
        <div className="flex items-center space-x-4">
          <Link href={APP_STORE} target="_blank" rel="noopener noreferrer" aria-label="app store">
            <img src={getStaticUrl("/images/bbc-g3/btn-appstore.png")} width="105px" alt="app store" className="" />
          </Link>
          <Link href={GOOGLE_PLAY} target="_blank" rel="noopener noreferrer" aria-label="play store">
            <img src={getStaticUrl("/images/bbc-g3/btn-playstore.png")} width="105px" alt="play store" className="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadCard;
