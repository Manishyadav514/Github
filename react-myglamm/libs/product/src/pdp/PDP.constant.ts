import { SHOP } from "@libConstants/SHOP.constant";
import { SLUG } from "@libConstants/Slug.constant";

export const PDP_API_INCLUDES = [
  "price",
  "sku",
  "brand",
  "categories",
  "products",
  "productMeta",
  "offerPrice",
  "productTag",
  "type",
  "cms",
  "assets",
  "urlShortner",
  "inStock",
  "tag",
];

export const PDP_FREE_PRODUCT_INCLUDES = [...PDP_API_INCLUDES, "urlManager"];

export const PDP_SHADES_API_INCLUDES = [
  "type",
  "urlManager.url",
  "cms.languages",
  "cms.attributes.shadeImage",
  "cms.attributes.shadeLabel",
  "productTag",
  "inStock",
  "sku",
  "productMeta.isPreOrder",
  "productMeta.tryItOn",
  "price",
  "offerPrice",
];

export const PDP_WIDGETS = [
  { name: "products", slugOrId: SLUG().PDP_OFFER_TEXT },
  { name: "products", slugOrId: SLUG().PDP_FLASH_SALE },
  { slugOrId: SLUG().PDP_EXPLORE_MORE },
];

export const PDP_ALL_VARIANTS_NAMES = [
  "dynamicOfferVariant",
  "frequentlyBroughtVariant",
  "pdpRecurringSubscriptionVariant",
  "customerAlsoViewedVariant",
  "pdpMultiWidgetPopupVariant",
  "similarProductsVariant",
  "pdpTagsFlagVariant",
  "PDPConcernIngredientVariant",
  "addOnProductVariant",
  "downloadCtaVariant",
  "widgetonAddtocart",
];

export const PDP_ICID = "product_product description";

export const PDP_INFO_TABS = (t: any, checkSeoFaq: boolean) => [
  { key: "whatIsIt", label: t("whatItIs") },
  { key: "howToUse", label: t("howToUse") },
  { key: "expertTip", label: t("whatElseYouNeed") },
  { key: "ingredients", label: t("whatsInIt") },
  { key: "whatWeKeepOut", label: t("whatWeKeepOut") },
  { key: "allIngredients", label: t("allIngredients") },
  { key: SHOP.SITE_CODE === "tmc" ? "moreDetails" : "insight", label: t("insight") },
  { key: "moreDetails", label: t("moreDetails") },
  { key: "coCreate", label: t("coCreate") },
  { key: checkSeoFaq ? "seoFaq" : "faq", label: t("faq") },
  { key: "info", label: t("info") || "info" },
];
