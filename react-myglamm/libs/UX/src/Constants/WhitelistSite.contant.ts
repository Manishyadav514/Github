const ALPHA_WEBSITES = [
  "https://alpha-mr.myglamm.net",
  "https://shop.staging.stbotanica.net",
  "https://release.babychakra.net",
  "https://shop.staging.babychakra.net",
  "https://shop.alpha.popxo.com",
  "https://www.popxo.net",
  "https://shop.staging.themomsco.net",
  "https://shop.staging.organicsharvest.net",
  "https://shop.staging.thesirona.net",
  "https://mr.myglamm.net",
];

const PROD_WEBSITES = [
  "https://www.myglamm.com",
  "https://www.stbotanica.com",
  "https://www.babychakra.com",
  "https://themomsco.com",
  "https://shop.popxo.com",
  "https://www.popxo.com",
  "https://www.organicharvest.in",
];

export const WHITELISTED_WEBSITES = () => {
  if (process.env.NEXT_PUBLIC_PRODUCT_ENV === "ALPHA") {
    return ALPHA_WEBSITES;
  }
  return PROD_WEBSITES;
};
