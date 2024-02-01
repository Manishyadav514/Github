import React from "react";
import PLPAPI from "@libAPI/apis/PLPAPI";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import { logURI } from "@libUtils/debug";
import {
  addWidgetDataInBetween,
  extractFilterDataFromQuery,
  generateWhereForProductV2,
} from "@libServices/PLP/filterHelperFunc";
import { FilterRow } from "@typesLib/PLP";
import { patchDsCollectionRes } from "@PLPLib/collection/patchProductRes";

import { handlePartnershipData } from "@libUtils/getDiscountPartnership";
import DsCollection from "@libComponents/Collection/DsCollection";
import CollectionPage from "@libComponents/Collection/CollectionPage";

function Collection(props: any) {
  if (props?.dsProducts?.length) {
    return <DsCollection {...props} />;
  }
  return <CollectionPage {...props} />;
}

Collection.getInitialProps = async (ctx: any): Promise<any> => {
  const plpAPI = new PLPAPI();
  const widgetApi = new WidgetAPI();

  const { collection: collectionName, discountCode, sort, ds, identifier } = ctx.query;

  const configValue: any = ctx?.configV3?.dsCollection || {};

  const dsValue = configValue[ds] || {};

  if (ds && dsValue?.service) {
    const { key, service, details } = dsValue;
    const res = await plpAPI.getDsCollection(service, key, identifier);
    const dsProducts = patchDsCollectionRes(res?.data?.data?.[0]?.value?.products || []);
    if (dsProducts?.length) {
      return {
        dsProducts,
        identifier,
        collectionDetails: details || configValue["default"],
        dsValue,
      };
    }
  }

  const CTPSlugs = ctx?.configV3?.ctpSlugs || ["cut-the-price-collection"];
  const { appliedFilters } = extractFilterDataFromQuery(ctx.query);
  const brandsApply: FilterRow[] | string[] = appliedFilters?.brandsApplied;
  const pricesApply: Array<{ priceOffer: { between: Array<number> } }> = appliedFilters?.pricesApplied;
  const categoriesApply: Array<string> = appliedFilters?.categoriesApplied;
  const filterWhere = generateWhereForProductV2({
    slug: "",
    brandsApply,
    pricesApply,
    categoriesApply,
    isCollection: true,
  });

  try {
    // COMMENTING OUT PREVIOUS COLLECTION PRODUCT ID API CALL
    // const { data: collectionData } = await plpAPI.getCollection(collectionName);

    const { data: collectionDataV2 } = await plpAPI.getCollectionV2(
      {
        "urlShortner.slug": `/collection/${collectionName}`,
        ...(CTPSlugs?.includes(collectionName) && { inStock: true }),
        ...filterWhere?.where,
      },
      0,
      true,
      "",
      10,
      sort
    );

    if (collectionDataV2?.data.count === 0) {
      logURI(ctx.asPath);

      if (ctx.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Collection Not Found");
      }
      return { errorCode: 404 };
    }

    /* Defining Collection, Products and Grid Format to be sent to Client */
    // const collection = collectionData.data.data?.[0];
    const collectionV2 = collectionDataV2.data.data;

    // const productIds = collection?.products;
    const productIds = collectionV2?.products;

    const [/*productres,*/ widgetData, categories, widgetPLPdata, partnerShipData] = await Promise.allSettled([
      // COMMENTING OUT PREVIOUS COLLECTION PRODUCT API CALL
      // plpAPI.getCollectionProduct({
      //   id: { inq: collection?.products?.slice(0, 10) },
      // }),
      widgetApi.getWidgets({
        where: {
          slugOrId: "mobile-site-collection-widgets",
          name: "collection",
          items: collectionV2?.id,
        },
      }),
      plpAPI.getCollectionCategories({
        category: "subchild",
        id: {
          inq: productIds,
        },
      }),
      widgetApi.getWidgets({
        where: {
          slugOrId: "mobile-site-widget-between-collection",
        },
      }),
      discountCode ? handlePartnershipData({ products: productIds, discountCode, skip: 0 }) : Promise.resolve(),
    ]);

    const productsResV2 = collectionDataV2?.data?.products;
    //@ts-ignore
    const widgetPLPData = widgetPLPdata?.value?.data.data?.data?.widget;
    // @ts-ignore
    const productWithWidget = addWidgetDataInBetween(productsResV2, widgetPLPData);

    return {
      // collection,
      collection: collectionV2,
      // @ts-ignore
      productsRes: productWithWidget,
      // @ts-ignore
      widgets: widgetData?.value?.data.data?.data?.widget,
      // @ts-ignore
      collectionCategories: categories?.value?.data?.data?.data,
      //@ts-ignore
      widgetPLPData,
      //@ts-ignore
      productIds,
      //@ts-ignore
      plpTagsFlag: productsResV2[0]?.meta?.tags.name ? true : false,
      //@ts-ignore
      partnerShipData: partnerShipData?.value,
      appliedFilters,
      sort,
    };
  } catch (error: any) {
    logURI(ctx.asPath);

    if (ctx.res) {
      console.error(error, collectionName);
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }
    return {
      errorCode: 404,
    };
  }
};

export default Collection;
