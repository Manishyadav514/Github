import React, { ReactElement } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import ShippingAddress from "../Components/address/shipping-address";
import LowerFunnelLayout from "../Components/layout/LowerFunnelLayout";

import useAttachCountryAddressFilter from "@libHooks/useAttachCountryAddressFilter";

const AddShippingAddress = () => {
  const { back } = useRouter();
  useAttachCountryAddressFilter();
  return (
    <main className="bg-white">
      <Head>
        <title>Add Shipping Address</title>
        <meta property="og:title" content="Add Shipping Address" />
      </Head>

      <div className="pt-0.5">
        <ShippingAddress isAddAddress onBack={() => back()} />
      </div>
    </main>
  );
};

AddShippingAddress.getLayout = (page: ReactElement) => <LowerFunnelLayout>{page}</LowerFunnelLayout>;

export default AddShippingAddress;
