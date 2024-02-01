import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";

export const slotMachineWinAdobeClickEvent = () => {
  (window as any).digitalData = {
    common: {
      linkName: `web|slot_machine|win`,
      linkPageName: ADOBE.ASSET_TYPE.SLOT_MACHINE,
      ctaName: "WIN",
      assetType: ADOBE.ASSET_TYPE.SLOT_MACHINE,
      newAssetType: ADOBE.ASSET_TYPE.SLOT_MACHINE,
      newLinkPageName: ADOBE.ASSET_TYPE.SLOT_MACHINE,
      pageLocation: "",
      platform: ADOBE.PLATFORM,
      subSection: ADOBE.ASSET_TYPE.SLOT_MACHINE,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};
export const userSpinAttemptsAdobeEvent = (spin: number) => {
  (window as any).digitalData = {
    common: {
      linkName: `web|slot_machine|spin_attempt ${spin}`,
      linkPageName: ADOBE.ASSET_TYPE.SLOT_MACHINE,
      ctaName: `Spin ${spin}`,
      assetType: ADOBE.ASSET_TYPE.SLOT_MACHINE,
      newAssetType: ADOBE.ASSET_TYPE.SLOT_MACHINE,
      newLinkPageName: ADOBE.ASSET_TYPE.SLOT_MACHINE,
      pageLocation: "",
      platform: ADOBE.PLATFORM,
      subSection: ADOBE.ASSET_TYPE.SLOT_MACHINE,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};
export const slotMachineAdobeOnPageLoad = () => {
  (window as any).digitalData = {
    common: {
      pageName: "web|slot_machine|startpage",
      newPageName: "slot_machine startpage",
      subSection: "slot_machine startpage",
      assetType: ADOBE.ASSET_TYPE.SLOT_MACHINE,
      newAssetType: ADOBE.ASSET_TYPE.SLOT_MACHINE,
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.PageLoad();
};
