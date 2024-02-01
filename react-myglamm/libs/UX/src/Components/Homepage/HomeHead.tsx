import React from "react";
import Head from "next/head";

import { getVendorCode } from "@libUtils/getAPIParams";

import { ORGANIZATION_SCHEMA, SEARCHBOX_SCHEMA, WEBSITE_SCHEMA } from "@libConstants/Schema.constant";

const HomeHead = () => (
  <Head>
    {ORGANIZATION_SCHEMA[getVendorCode()] && (
      <script
        type="application/ld+json"
        id="organizationSchema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ORGANIZATION_SCHEMA[getVendorCode()]),
        }}
      />
    )}
    {WEBSITE_SCHEMA[getVendorCode()] && (
      <script
        type="application/ld+json"
        id="websiteSchema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(WEBSITE_SCHEMA[getVendorCode()]),
        }}
      />
    )}
    {SEARCHBOX_SCHEMA[getVendorCode()] && (
      <script
        type="application/ld+json"
        id="sitelinksSearchboxSchema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(SEARCHBOX_SCHEMA[getVendorCode()]),
        }}
      />
    )}
  </Head>
);

export default HomeHead;
