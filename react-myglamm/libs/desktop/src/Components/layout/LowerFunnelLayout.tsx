import React, { Fragment, ReactElement } from "react";
import dynamic from "next/dynamic";

import { useFetchCart } from "@libHooks/useFetchCart";

import { SHOP } from "@libConstants/SHOP.constant";

import Logo from "../header/Logo";
import CheckoutSteps from "../header/checkoutSteps";

const LoginDropDownBtn = dynamic(() => import("../header/LoginDropDownBtn"), { ssr: false });

const LFFooter = dynamic(() => import("./LFFooter"), { ssr: false });

interface lowerFunnlProps {
  children: ReactElement;
}

const LowerFunnelLayout = ({ children }: lowerFunnlProps) => {
  /* Get Cart Data if not Available */
  useFetchCart();

  return (
    <Fragment>
      <style>
        {`
          body {
            background: #fff;
          }
        `}
      </style>

      <header className="sticky top-0 bg-white w-full z-30 shadow">
        <div className="flex justify-between items-center max-w-screen-xl py-2.5 mx-auto">
          <Logo />

          <CheckoutSteps />

          <LoginDropDownBtn />
        </div>
      </header>

      {children}

      {SHOP.IS_MYGLAMM && <LFFooter />}
    </Fragment>
  );
};

export default LowerFunnelLayout;
