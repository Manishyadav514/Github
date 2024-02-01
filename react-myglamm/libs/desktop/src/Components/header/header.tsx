import React, { useState } from "react";
import dynamic from "next/dynamic";

import { SHOP } from "@libConstants/SHOP.constant";

import Logo from "./Logo";
import SearchBox from "./SearchBox";
import HeaderMenu from "./HeaderMenu";
import HeaderBanner from "./header-banner";
import ShoppingBagButton from "./ShoppingBagButton";
import CountryLanguageSelection from "./CountryLanguageSelection";

const LoginDropDownBtn = dynamic(() => import("../header/LoginDropDownBtn"), { ssr: false });

const Header = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <>
      {showOverlay && <div className="inset-0 fixed bg-black/50 z-20" />}

      <header className="header bg-white sticky top-0 w-full shadow z-20">
        <HeaderBanner />
        <div className="w-full max-w-screen-xl pt-2.5 mx-auto px-2">
          <div className="responsiveHeader flex justify-between">
            <div className="w-2/3 flex">
              <Logo />

              <SearchBox />
            </div>

            <div className="right-head w-1/3 mt-3.5 relative flex justify-end items-center">
              {SHOP.REGION === "MIDDLE_EAST" && <CountryLanguageSelection />}

              <ShoppingBagButton />

              <div className="border-r h-8 border-gray-300 mx-5" />

              <LoginDropDownBtn />
            </div>
          </div>

          <HeaderMenu setShowOverlay={setShowOverlay} />
        </div>
      </header>
    </>
  );
};

export default Header;
