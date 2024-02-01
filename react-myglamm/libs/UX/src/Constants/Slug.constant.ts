import { SITE_CODE } from "./GLOBAL_SHOP.constant";

const COMMON_SLUGS = () => ({
  FOOTER: "footer",

  GLAMM_STUDIO: SITE_CODE() === "mgp" ? "glamm-studio" : "mobile-site-blogs",
  RELATED_BLOGS: "mobile-site-blog-related",

  /* PDP - Product Detail Page */
  PDP_OFFER_TEXT: "mobile-site-offer-text",

  // BBC Article Details
  BBC_ARTICLE_DETAILS: "mobile-site-bbc-article-details",

  // BBC Community
  BBC_COMMUNITY: "mobile-site-bbc-community",
  COMMUNITY_WALL_WIDGET: "mobile-site-community-wall-widgets",
  COMMUNITY_EVENTS: "mobile-site-community-events",
});

const SLUGS = () => ({
  "m-web": {
    /* Home Page */
    test: SITE_CODE(),
    HOME_WIDGETS: "mobile-site-homegroup",
    DUMMY_HOME_WIDGETS: `mobile-site-homegroup-${SITE_CODE()}`,
    HEADER_OFFER: "mobile-site-mobile-web-offer-text",
    NO_SEARCH_EN: "mobile-site-no-search-result",
    BLOG_NO_SEARCH_EN: "mobile-site-blog-no-search-result",
    BLOG_SEARCH_WIDGETS_EN: "mobile-site-glammstudio-search-suggestion",
    TOP_SELLING_SEARCH_EN: "mobile-site-top-selling-search-widgets",
    TVC_WIDGETS: "mobile-site-tvc-landing-page",

    /* Navigation */
    SIDE_MENU: "mobilesite-side-nav-v2",
    SIDE_MENU_V2: "new-mweb-side-nav",
    DUMMY_SIDE_MENU: `mobile-site-side-nav-${SITE_CODE()}`,
    SIDE_MENU_WIDGETS: "mobile-site-side-menu-widgets",
    DUMMY_SIDE_MENU_WIDGETS: `mobile-site-side-menu-${SITE_CODE()}`,
    BOTTOM_NAV: "mweb-bottom-nav",
    DUMMY_BOTTOM_NAV: `${SITE_CODE()}-bottom-nav`,

    /* PDP - Product Detail Page */
    PDP_PHOTOSLURP_EN: "mobile-site-pdp-photoslurp",
    PDP_PRODUCT_RECOMMENDATION_EN: "mobile-site-pdp-recommendation",
    PDP_EXPLORE_MORE: "mobile-site-pdp-explore-more",
    PDP_SOCIAL_PROOFING: "mobile-site-pdp-social-proofing",
    PDP_CUSTOMER_ALSO_VIEWED: "mobile-site-customer-also-viewed-brought",
    PDP_FLASH_SALE: "mobile-site-flash-sale-stickers",
    PDP_BUNDLE_PRODUCT: "mobile-site-pdp-bundle-product",
    PDP_FREQUENTLY_BROUGHT: "mobile-site-frequently-brought-v2",
    PDP_CUSTOM_BRANDING: "mobile-site-pdp-custom-branding",
    PDP_EXPLORE_PRODUCT: "mobile-site-pdp-explore-product",
    PDP_CB_WIDGET: "mobile-site-pdp-cb-widget",
    PDP_V2: "mobile-site-pdp-widgetsv2",
    PDP_VIEW_SIMILAR_ICON: "mobile-site-view-similar-icon",
    PDP_MULTI_WIDGET_ICON: "mobile-site-view-similar-multiple-widget",

    /* GlammAcademy -Blogs Page */
    MYGLAMM_ACADEMY_LANDING: "mobile-site-myglamm-academy-landing",

    /* Banner */
    ORDER_SUMMARY_GAMIFICATION_BANNER: "mobile-site-order-confirmation-banner",

    /* Glamm Club */
    G3_GLAMM_CLUB_WIDGETS: "mobile-site-glammclub",
    G3_GLAMM_CLUB_TRIAL_CATALOGUE_WIDGETS: "mobile-site-glammclub-trial-catalogue",

    ...COMMON_SLUGS(),
  },

  web: {
    HOME_WIDGETS: "website-home-page",
    DUMMY_HOME_WIDGETS: `website-home-page-${SITE_CODE()}`,
    SHOPXO_WIDGETS: "website-home-page-shopxo",
    TVC_WIDGETS: "website-desktop-tvc-landing",

    /* NAVIGATION -------- */
    HEADER: "desktop-new-header",
    HEADER_OFFER: "website-header-offer",

    ...COMMON_SLUGS(),
  },
});

export const SLUG = () => SLUGS()[(process.env.NEXT_PUBLIC_ROOT || "m-web") as keyof typeof SLUGS] as WEB_SLUGS;

type WEB_SLUGS = {
  HOME_WIDGETS: string;
  SHOPXO_WIDGETS: string;
  HEADER: string;
  OFFER_TEXT_EN: string;
  HEADER_OFFER: string;
  NO_SEARCH_EN: string;
  BLOG_NO_SEARCH_EN: string;
  BLOG_SEARCH_WIDGETS_EN: string;
  TOP_SELLING_SEARCH_EN: string;
  TVC_WIDGETS: string;
  SIDE_MENU: string;
  SIDE_MENU_V2: string;
  DUMMY_SIDE_MENU: string;
  DUMMY_SIDE_MENU_WIDGETS: string;
  DUMMY_HOME_WIDGETS: string;
  SIDE_MENU_POPXO: string;
  SIDE_MENU_WIDGETS: string;
  BOTTOM_NAV: string;
  DUMMY_BOTTOM_NAV: string;
  POPXO_BOTTOM_NAV: string;
  PDP_OFFER_TEXT: string;
  PDP_PHOTOSLURP_EN: string;
  PDP_PRODUCT_RECOMMENDATION_EN: string;
  PDP_EXPLORE_MORE: string;
  PDP_SOCIAL_PROOFING: string;
  PDP_CUSTOMER_ALSO_VIEWED: string;
  PDP_FLASH_SALE: string;
  PDP_BUNDLE_PRODUCT: string;
  PDP_CUSTOM_BRANDING: string;
  PDP_FREQUENTLY_BROUGHT: string;
  PDP_EXPLORE_PRODUCT: string;
  PDP_CB_WIDGET: string;
  PDP_V2: string;
  PDP_VIEW_SIMILAR_ICON: string;
  PDP_MULTI_WIDGET_ICON: string;
  MYGLAMM_ACADEMY_LANDING: string;
  G3_HOME_WIDGETS: string;
  G3_EARN_CATALOG_WIDGETS: string;
  G3_REWARD_CATALOG_WIDGETS: string;
  G3_LOGIN_WIDGETS: string;
  G3_REWARD_SUCCESS_WIDGETS: string;
  G3_REWARD_ABOUT_US: string;
  ORDER_SUMMARY_GAMIFICATION_BANNER: string;
  FOOTER: string;
  BBC_ARTICLE_DETAILS: string;
  BBC_COMMUNITY: string;
  GLAMM_STUDIO: string;
  RELATED_BLOGS: string;
  COMMUNITY_WALL_WIDGET: string;
  COMMUNITY_EVENTS: string;
  G3_GLAMM_CLUB_WIDGETS: string;
  G3_GLAMM_CLUB_TRIAL_CATALOGUE_WIDGETS: string;
};
