import React from "react";

import Script from "next/script";

import { useSSO } from "@libHooks/useSSO";

import MyGlammAPI from "@libAPI/MyGlammAPI";

import { getVendorCode } from "@libUtils/getAPIParams";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const SSOInit = () => {
  const { onSuccess } = useSSO();

  return (
    <Script
      src={`${GBC_ENV.NEXT_PUBLIC_SSO_URL}/sso-script.js`}
      onLoad={() =>
        (window as any).g3SilentLogin({
          config: { onSuccess },
          vendorCode: getVendorCode(),
          apikey: MyGlammAPI.API_KEY,
        })
      }
    />
  );
};

export default SSOInit;
