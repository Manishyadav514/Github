import { useEffect } from "react";
import PDPKitShadeModalV2 from "./PDPKitShadeModalV2";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { ADOBE } from "@libConstants/Analytics.constant";

const EditOrderChangeShade = ({
  shades,
  showModal,
  setShowModal,
  variant,
  shadeObject,
  setSelectedShadeObject,
}: {
  shades: any;
  showModal: boolean;
  setShowModal: any;
  variant: string;
  shadeObject?: boolean;
  setSelectedShadeObject?: any;
}) => {
  useEffect(() => {
    /* Adobe Page Load Event - Post Order - Shade Edit Modal */
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|shade edit`,
        newPageName: `post order shade edit`,
        subSection: "shade edit",
        assetType: "shade edit",
        newAssetType: "shade edit",
        platform: ADOBE.PLATFORM,
        pageLocation: "order details",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  return (
    <PDPKitShadeModalV2
      shades={shades}
      showModal={showModal}
      setShowModal={setShowModal}
      variant={variant}
      shadeObject={shadeObject}
      setSelectedShadeObject={setSelectedShadeObject}
    />
  );
};

export default EditOrderChangeShade;
