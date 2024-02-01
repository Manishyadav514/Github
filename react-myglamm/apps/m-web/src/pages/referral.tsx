import React from "react";

import PLPAPI from "@libAPI/apis/PLPAPI";
import PageAPI from "@libAPI/apis/PageAPI";

import { logURI } from "@libUtils/debug";

import CollectionUI from "@libPages/collection/[collection]";

type CollectionProps = {
  collection?: any;
  productsRes?: Array<any>;
  errorCode?: number;
  widgets?: any;
};

const Referral = (props: CollectionProps) => <CollectionUI {...props} />;

Referral.getInitialProps = async (ctx: any): Promise<any> => {
  const plpAPI = new PLPAPI();
  const pageApi = new PageAPI();

  try {
    const { data: res } = await pageApi.getPage(0, {
      "urlShortner.slug": "/referral",
      statusId: { inq: [1] },
    });

    const collections = res.data.data[0].editorData.cms[0][0];

    /* Checking if any Collection is maped to the Referral url or not */
    if (!collections || collections?.itemIds?.length === 0) {
      logURI("/referral");

      if (ctx.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Referral Collection Not Found");
      }
      return {
        errorCode: 404,
      };
    }

    /* Monkey Patching - To create a suitable response to used by Collection Component */
    let productIds: Array<string> = [];
    collections.descriptionData[0]?.value.forEach((ele: any) => {
      productIds = [...productIds, ...ele.products];
    });

    /* Defining Collection, Products to be sent to Client */
    const { data: productres } = await plpAPI.getCollectionProduct({
      id: { inq: productIds },
      inStock: true,
    });

    if (collections?.itemIds?.length > 1) {
      return {
        collection: { products: productIds },
        productsRes: productres?.data?.data,
        isSingleGrid: false,
      };
    }
    return {
      collection: collections.descriptionData[0]?.value[0],
      productsRes: productres?.data?.data,
      isSingleGrid: false,
    };
  } catch (error: any) {
    logURI("/referral");

    if (ctx.res) {
      console.error(error);
      ctx.res.statusCode = 500;
      return ctx.res.end("Something went Wrong");
    }
    return {
      errorCode: 404,
    };
  }
};

export default Referral;
