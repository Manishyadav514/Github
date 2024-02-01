import React from "react";

import { SHOP } from "@libConstants/SHOP.constant";

import FooterSRN from "./footerSRN";
import FooterSRNME from "./FooterSRNME";

const FooterSirona = () => {
  if (SHOP.REGION === "MIDDLE_EAST") {
    return <FooterSRNME />;
  }

  return <FooterSRN />;
};

export default FooterSirona;
