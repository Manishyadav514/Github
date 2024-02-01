import { VENDOR_CODE } from "./GLOBAL_SHOP.constant";

export const BLOG_SEO = {
  mgp: {
    title: "Best Beauty Tips, Makeup Tutorials, Tips & Trends Online - MyGlamm",
    description:
      "Revitalize yourself with best makeup tips, makeup tutorials alongwith tips &amp; trends related to beauty, fashion, lifestyle and much more at MyGlamm.",
    keywords:
      "makeup tips, makeup tutorials, beauty guides, makeup trends, online makeup tips, best makeup tips, best makeup tutorials, makeup articles, latest makeup trends, MyGlamm",
  },
  stb: {
    title:
      "Get Hair, Skin, Bath & Body and Wellness Care Tips, Guide, Information, Product Reviews, Articles at One Place - St.Botanica Blog",
    description:
      "St.Botanica Blog: Find tips & information for all your beauty concerns from hair care, skin care to beauty products that are most suitable for you. Visit now & get the best advice!",
    keywords: "",
  },
};

export const BLOG_TYPE = VENDOR_CODE() === "mgp" ? "glammstudio" : "blog";

export const BLOG_SHARE = [
  {
    label: "Facebook",
    bgColor: "#507cc0",
    shareUrl: "https://www.facebook.com/sharer/sharer.php?quote={name}&u={shortUrl}",
    icon: "https://files.myglamm.com/site-images/original/pngfindcom-thomas-the-dank-engine-6738833.png",
  },
  {
    label: "Twitter",
    bgColor: "#64ccf1",
    icon: "https://files.myglamm.com/site-images/original/twitter-48.png",
    shareUrl: "https://twitter.com/intent/tweet?url={shortUrl}&text={name}",
  },
  {
    label: "Pinterest",
    bgColor: "#d02b40",
    icon: "https://files.myglamm.com/site-images/original/pinterest-5-48.png",
    shareUrl: "http://pinterest.com/pin/create/button/?url={shortUrl}&media={image}&description={shortDescription}",
  },
  { label: "Copylink", bgColor: "#000", icon: "https://files.myglamm.com/site-images/original/icons8-link-52.png" },
];
