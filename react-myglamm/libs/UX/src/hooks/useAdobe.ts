import { useEffect } from "react";

import Adobe from "@libUtils/analytics/adobe";

import { ValtioStore } from "@typesLib/ValtioStore";

import { useSelector } from "./useValtioSelector";

function useAdobe() {
  const { adobePageLoadData } = useSelector((store: ValtioStore) => ({
    adobePageLoadData: store.adobeReducer.adobePageLoadData,
  }));

  useEffect(() => {
    if (adobePageLoadData) {
      window.digitalData = JSON.parse(
        JSON.stringify({
          user: Adobe.getUserDetails(),
          ...adobePageLoadData,
        })
      );
      Adobe.PageLoad();
    }
  }, [adobePageLoadData]);
}

export default useAdobe;
