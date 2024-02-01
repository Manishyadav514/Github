export const REGEX = {
  /**
   * Show Back Button on these routes
   */
  SHOW_BACK: /buy|looks|lookbook|dashboard|collection|my-profile|product|order-details|community|notification/gi,

  /**
   * RegEx for Validating Mobile Number
   */
  MOBILE_NUMBER: /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,

  /**
   * Email Validation RegEx picked from yup
   * https://github.com/jquense/yup/blob/master/src/string.js
   *
   * ?DO NOT TRY TO FORMAT THIS REGEX UNLESSS YOU KNOW WHAT YOU'RE DOING
   */
  // eslint-disable-next-line no-control-regex, no-useless-escape
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  /**
   * Hide Header
   */
  SHOW_NEW_SHARE_MODAL:
    /refer|\/myglammxo|\/thegoodlifefestival|myglammxo-rewards|\/glamm-insider|\/dashboard|\/track-myrewards|\/my-rewards|\/order-summary|\/bigg-boss/g,

  /* Hide Bottom Nav */
  HIDE_BOTTOM_NAV:
    /\/product\/|shopping-bag|payment|survey|address|Address|order-summary|koffee-with-karan|mystery-reward|bigg-boss|form/,

  FLOATER_HIDE:
    /shopping-bag|unlock-coupon|payment|myglammxo|survey|order-summary|product|promocode|address|Address|my-rewards|koffee-with-karan|play-and-win|shade-selection|mystery-reward|bigg-boss|skin-analyser|capture-face|results|form|glammclub|login/,

  VALID_NAME: /[^a-zA-Z0-9]/g,

  OWN_SEO_PAGES: /\/glammstudio|\/blog|\/buy|\/blog|\/skin-analyser|\/online-cosmetics-shopping-app|\/collection|\/product/g,
};
