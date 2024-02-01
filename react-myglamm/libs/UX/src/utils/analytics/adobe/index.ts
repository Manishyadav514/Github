import Router from "next/router";
import { User } from "@typesLib/Consumer";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { isWebview } from "@libUtils/isWebview";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import { SHOP } from "@libConstants/SHOP.constant";
import { IS_DUMMY_VENDOR_CODE } from "@libConstants/DUMMY_VENDOR.constant";
import { LOCALSTORAGE, XTOKEN } from "@libConstants/Storage.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import { CART_REDUCER } from "@libStore/valtio/REDUX.store";

const getPreviousAssetType = () => {
  interface AssetTypes {
    previousAssetType: string;
    currentAssetType: string;
  }
  if (localStorage && localStorage.getItem("lsAdobeAssetTypes")) {
    const strAdobeAsset = localStorage.getItem("lsAdobeAssetTypes");
    const objLSAssetType = JSON.parse(`${strAdobeAsset}`) as AssetTypes;
    return objLSAssetType.previousAssetType;
  }
  return "";
};

class Adobe {
  static Click() {
    Adobe.send("click");
  }
  static PageLoad() {
    Adobe.send("pageview");
  }
  static send(type: string) {
    try {
      const lang = Router.locale;
      const platformQS = Router.query.platform || isWebview();

      setAssetTypesInLocalStorage(window?.digitalData?.common?.newAssetType?.toString());
      if (!window.digitalData.common) {
        // @ts-ignore
        window.digitalData.common = {};
      }
      window.digitalData.common = {
        ...window.digitalData.common,
        ...{ pageLocation: window?.digitalData?.common?.pageLocation?.toLowerCase() || getPreviousAssetType() },
      };
      window.digitalData.common.language = lang || "en-in";

      const globalPlatform = IS_DESKTOP ? "desktop" : "mobile";
      window.digitalData.common.platform = `${globalPlatform} website`; // decide first hand the device adobe running on

      let platform = "web";
      if (IS_DUMMY_VENDOR_CODE()) {
        platform = `${SHOP.SITE_CODE}-${globalPlatform}`;
        window.digitalData.common.platform = platform;
      } else if (platformQS === "android") {
        platform = "and";
        window.digitalData.common.platform = platform;
      } else if (platformQS === "ios") {
        platform = "ios";
        window.digitalData.common.platform = platform;
      }

      window.digitalData.common.pageName = window.digitalData.common.pageName?.replace("web", platform);
      if (type == "click") {
        window.digitalData.common.linkPageName = window.digitalData.common.linkPageName?.replace("web", platform);
        window.digitalData.experimentVariant1 = (window as any).experimentVariant1;
      }

      (window as any)._aaq.push({
        type,
        digitalData: JSON.parse(JSON.stringify(window.digitalData)),
      });
    } catch (error) {
      console.error(error);
    }
  }

  static getUserDetails(userProfileTODORemove?: User | null) {
    const userProfile: User = getLocalStorageValue(LOCALSTORAGE.PROFILE, true);

    return {
      customerID: userProfile?.id || checkUserLoginStatus()?.memberId || "",
      email: userProfile?.email || "",
      loginStatus: checkUserLoginStatus() ? "login" : "guest",
      membershipLevel: userProfile?.memberType?.levelName || "",
      mobileNo: userProfile?.phoneNumber || "",
      gender: userProfile?.meta?.misInfo?.gender || "female",
      webengageId: window.webengage?.user?.getAnonymousId?.() || "",
    };
  }

  static checkUserLoginStatus() {
    const strLSMemberID = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);
    const strLSxtoken = getLocalStorageValue(XTOKEN());
    if (!strLSMemberID && !strLSxtoken) {
      return false;
    }
    if (strLSMemberID && strLSxtoken) {
      return true;
    }

    return false;
  }

  static adobeDSEvent(
    title: string,
    dsWidgetType?: string,
    sku?: string,
    variantValue?: string,
    evarName?: string,
    products?: any[]
  ) {
    const memberID = localStorage.getItem("memberId");
    if (evarName) {
      (window as any).evars[evarName] = variantValue;
    }

    let dsProductSku: any = {};
    let counter = 0;
    products?.forEach((x, i) => {
      if (i === 0)
        dsProductSku.dsProductSKUs =
          getLocalStorageValue(LOCALSTORAGE.COUPON) || CART_REDUCER.cart?.couponData?.couponCode || "NA";

      dsProductSku[`dsProductSKUs${counter || ""}`] = `${
        dsProductSku[`dsProductSKUs${counter || ""}`] ? `${dsProductSku[`dsProductSKUs${counter || ""}`]},` : ""
      }${x.sku}`;

      if (dsProductSku[`dsProductSKUs${counter || ""}`].length > 86) counter++;
    });

    if (window.digitalData) {
      window.digitalData = {
        // @ts-ignore
        common: {
          ...(window.digitalData.common || {}),
          ...dsProductSku,
        },
        user: this.getUserDetails(),
        dsRecommendationWidget: {
          type: (dsWidgetType === "none" && dsWidgetType) || (sku || memberID ? "dynamic" : "default"),
          title: title.toLowerCase(),
        },
      };
      this.send("pageview");
    }
  }
}

function adobeConsole(eventType?: any, serverName?: any) {
  console.groupCollapsed(
    `%cAdobe Analytics|%c${eventType}:%c${serverName}|%c${window.digitalData.common.assetType} - ${
      window.digitalData.common.newPageName
    } %c@${new Date().getTime()}`,
    "font-weight: bold;color:#222;",
    "font-weight: normal;color:#222;",
    "font-weight: bold;color:blue;",
    "font-weight: bold;color:green;",
    "font-weight: normal;color:#bdbbbb;"
  );
  console.log("%cdigitalData", "font-weight: bold;color:blue;", window.digitalData);
  console.groupEnd();
}

function setAssetTypesInLocalStorage(currentAssetType = "") {
  interface AssetTypes {
    previousAssetType: string;
    currentAssetType: string;
  }

  let jstrAdobeAsset = {
    previousAssetType: "",
    currentAssetType,
  };

  if (localStorage && localStorage.getItem("lsAdobeAssetTypes")) {
    const strAdobeAsset = localStorage.getItem("lsAdobeAssetTypes");
    localStorage.removeItem("lsAdobeAssetTypes");

    const objLSAssetType = JSON.parse(`${strAdobeAsset}`) as AssetTypes;

    const strPreviousAssetType = objLSAssetType.currentAssetType;
    const strCurrentAssetType = currentAssetType;

    if (strPreviousAssetType.toLocaleLowerCase() !== strCurrentAssetType.toLocaleLowerCase()) {
      jstrAdobeAsset = {
        previousAssetType: strPreviousAssetType,
        currentAssetType: strCurrentAssetType,
      };
      localStorage.setItem("lsAdobeAssetTypes", JSON.stringify(jstrAdobeAsset));
    } else {
      localStorage.setItem("lsAdobeAssetTypes", `${strAdobeAsset}`);
    }
  } else {
    localStorage.setItem("lsAdobeAssetTypes", JSON.stringify(jstrAdobeAsset));
  }
}

function getQueryString(field: string, url: string) {
  var href = url ? url : window.location.href;
  var reg = new RegExp("[?&]" + field + "=([^&#]*)", "i");
  var string = reg.exec(href);
  return string ? string[1] : "";
}

export default Adobe;
