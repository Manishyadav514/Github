import React from "react";

import { SHOP } from "@libConstants/SHOP.constant";

import BagButton from "@libComponents/Header/BagButton";
import OffersIcon from "@libComponents/Header/OffersIcon";
import WishlistButton from "@libComponents/Header/WislistButton";

import BackIcon from "../../../public/svg/backicon.svg";
import SearchIcon from "../../../public/svg/searchicon.svg";

const AmpHeader = () => (
  <header className="sticky w-full top-0 outline-none">
    <div className="flex flex-row items-center h-12 bg-white">
      <a className="p-3 h-12 w-12 outline-none" href="/" aria-label="back">
        <BackIcon />
      </a>

      <a
        className="flex-1 text-gray-700 text-lg outline-none focus-visible:outline"
        aria-label="Home Page"
        href="/"
        aria-labelledby="home page"
      >
        <amp-img width="123" height="32" title="MyGlamm" className="h-8 amp-logo" alt="MyGlamm" src={SHOP.LOGO} />
      </a>

      <OffersIcon />

      <WishlistButton />

      <a
        id="searchIco"
        aria-hidden="true"
        href="/search?sourcepage=glammstudio"
        className="p-2 flex-end outline-none text-gray-700 cursor-pointer text-2xl text-center"
        aria-label="search"
        tabIndex={-1}
      >
        <SearchIcon />
      </a>

      <BagButton />
    </div>
  </header>
);

export default AmpHeader;
