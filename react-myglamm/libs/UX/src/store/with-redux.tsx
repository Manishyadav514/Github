import React, { Component } from "react";

import { isClient, isServer } from "@libUtils/isClient";
import { setAPIOptions } from "@libUtils/_apputils";
import {
  getG3CountrySelections,
  initalServerCalls as getCommonData,
  getOrCreateStore,
  setVendorAPI,
  setInitConstants,
} from "@libUtils/withReduxUtils";

import { langLocale } from "@typesLib/APIFilters";

export default function withReduxStore(App: any) {
  return class AppWithRedux extends Component {
    static async getInitialProps(appContext: any) {
      appContext.ctx.isServer = isServer();

      let store = getOrCreateStore({});

      /* G3 ENV setup */
      if (isServer()) {
        const { bustCache, vendorcode } = appContext.router?.query || {};

        const vendor = appContext.ctx.req?.headers?.vendor || process.env.NEXT_PUBLIC_VENDOR_CODE || vendorcode;
        const LOCALE: langLocale = appContext.router.locale || "en-in";
        // @ts-ignore
        const LOCALE_CACHE = globalThis.apiCache[`${LOCALE}-${vendor}`]; // Config Cache Data

        // @ts-ignore
        const PC_CACHE = globalThis.pcCache?.[`${LOCALE}-${vendor}`]; // Glamm Club Product Catalog Cache Data

        // @ts-ignore
        const AW_CACHE = globalThis.awCache?.[`${LOCALE}-${vendor}`]; // Active Widget Group Slug Cache Data

        if (!process.env.NEXT_PUBLIC_VENDOR_CODE && !vendor?.match(/mgp|stb|tmc|srn|popxo|twk|bbc|orh|lit|blu|mnm|orb/)) {
          console.error({ headerVendor: vendor });
        }

        if (
          !LOCALE_CACHE?.timestamp ||
          (Date.now() - LOCALE_CACHE?.timestamp || 0) / 1000 > (LOCALE_CACHE?.configV3?.ssrCacheTTL || 180)
        ) {
          try {
            setVendorAPI(vendor);

            /* Calling Country Config API and constants to decide at server what API params should be(LANG / VENDOR / COUNTRY) */
            const countryConstants = await getG3CountrySelections(LOCALE, true);
            /* Setting all the filters based on above api */
            setAPIOptions(countryConstants, bustCache as string);

            /* Intial API calls to populate data in redux store after all filters are set */

            const serverData = await getCommonData(PC_CACHE, AW_CACHE);
            if (serverData.glammTrailCatalog && globalThis.pcCache) {
              // @ts-ignore
              globalThis.pcCache[`${LOCALE}-${vendor}`] = {
                version: serverData?.configV3?.productCatalogVersion || 0.1, // make it dynamic from configv3
                ...(serverData.glammTrailCatalog || {}),
              };
            }
            delete serverData.glammTrailCatalog;

            if (serverData.activeWidgetGroups) {
              // @ts-ignore
              globalThis.awCache[`${LOCALE}-${vendor}`] = {
                timestamp: Date.now(),
                activeWidgetGroups: serverData.activeWidgetGroups || [],
              };
            }
            delete serverData.activeWidgetGroups;

            // @ts-ignore
            globalThis.apiCache[`${LOCALE}-${vendor}`] = {
              timestamp: Date.now(),
              countryConstants,
              ...serverData,
            };

            //@ts-ignore
            store = getOrCreateStore({ countryConstants, ...serverData });
          } catch (e) {
            console.error("SSR init calls failure", {
              countryConstants: Object.keys(LOCALE_CACHE?.countryConstants || {})?.length,
              configV3: Object.keys(LOCALE_CACHE?.configV3 || {})?.length,
              e,
            });

            if (LOCALE_CACHE?.configV3 && LOCALE_CACHE?.countryConstants) {
              store = getOrCreateStore(LOCALE_CACHE);
              setAPIOptions(LOCALE_CACHE?.countryConstants, bustCache as string);
            } else {
              throw new Error("500 Something Went Wrong");
            }
          }
        } else {
          store = getOrCreateStore(LOCALE_CACHE);
          setAPIOptions(LOCALE_CACHE?.countryConstants, bustCache as string);
        }

        appContext.ctx.configV3 = store.configReducer?.configV3;

        appContext.ctx.vendor = vendor;

        setInitConstants(store, appContext.ctx.req?.headers);
        return {
          ...(App.getInitialProps ? await App.getInitialProps(appContext) : {}),
          store,
          headers: appContext.ctx.req?.headers,
          productCatalogCache: globalThis.pcCache?.[`${LOCALE}-${vendor}`],
        };
      }

      /* onclient reassign this variable like redux is done */
      if (isClient()) appContext.ctx.configV3 = store.configReducer?.configV3;

      return {
        ...(App.getInitialProps ? await App.getInitialProps(appContext) : {}),
        store,
        headers: appContext.ctx.req?.headers,
      };
    }

    render() {
      return <App {...this.props} />;
    }
  };
}
