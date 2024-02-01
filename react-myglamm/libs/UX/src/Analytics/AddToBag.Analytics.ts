import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import Router from "next/router";

// Adobe Analytics(5) OnCLick - GlammStudio Blogs
export const adobeTriggerNotifyMe = (name: string, category: string) => {
  const adobePage = Router.asPath.split("/")[1]?.replace("glammstudio", "blog");

  (window as any).digitalData = {
    common: {
      linkName: `web|glammstudio|${adobePage}|${name}|notify me`,
      linkPageName: `web|glammstudio|${adobePage}`,
      ctaName: "notify me",
      newLinkPageName: `${adobePage} details`,
      subSection: category || "",
      assetType: adobePage,
      newAssetType: "content",
      platform: ADOBE.PLATFORM,
    },
    user: Adobe.getUserDetails(),
  };
  Adobe.Click();
};
