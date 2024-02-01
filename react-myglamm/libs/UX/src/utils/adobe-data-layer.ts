export function getDataLayer() {
  return (window as any).digitalData;
}

export function setDataLayer(payload: any) {
  (window as any).digitalData = {
    common: {
      assetType: "home",
      channel: "web|home",
      pageName: "web|home|homepage",
      subSection1: "web|home|homepage",
      subSection2: "web|home|homepage",
      flowName: "",
      platform: "mobile website",
      technology: "react",
    },
    user: {
      customerID: "",
      email: "",
      loginStatus: "guest",
      membershipLevel: "",
      mobileNo: "",
      firstName: "",
      lastName: "",
      countryCode: "",
    },
    ...payload,
  };
}
