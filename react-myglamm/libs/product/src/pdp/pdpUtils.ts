import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";
import { BreadCrumbData, GlobalAsset, PDPCarouselSlides, PDPCategory } from "@typesLib/PDP";

export function generatePDPBreadBrumdData(category: PDPCategory, productName: string) {
  const breadCrumbArray: BreadCrumbData[] = [];

  const { parentSlug, childSlug, subChildSlug, parentCategoryName, subChildCategoryName, childCategoryName } = category;

  if (parentSlug) breadCrumbArray.push({ name: parentCategoryName, slug: parentSlug });
  if (childSlug) breadCrumbArray.push({ name: childCategoryName, slug: childSlug });
  if (subChildSlug) breadCrumbArray.push({ name: subChildCategoryName, slug: subChildSlug });

  breadCrumbArray.push({ name: productName });
  return breadCrumbArray;
}

export function patchCarouselImages(assets: GlobalAsset[]): PDPCarouselSlides {
  const carouselImages = assets
    .filter(a => a.type === "image")
    .map((item, i: number) => ({
      type: "image",
      item,
      src:
        (i === 0 ? item?.imageUrl?.["1200x1200"] : item?.imageUrl?.["400x400"] || item?.imageUrl?.["400x400"]) ||
        DEFAULT_IMG_PATH(),
      alt: item?.properties?.imageAltTag || item?.name,
    }));
  const carouselVideo = assets.find(a => a.type === "video");

  if (carouselVideo) {
    // @ts-ignore
    carouselImages.splice(1, 0, { type: "video", item: carouselVideo });
  }

  return carouselImages;
}

export function patchCarouselImagesV2(assets: GlobalAsset[]): PDPCarouselSlides {
  const carouselImages = assets.map((item, i: number) => {
    if (item?.type === "image") {
      return {
        type: "image",
        item,
        src:
          (i === 0 ? item?.imageUrl?.["1200x1200"] : item?.imageUrl?.["400x400"] || item?.imageUrl?.["400x400"]) ||
          DEFAULT_IMG_PATH(),
        alt: item?.properties?.imageAltTag || item?.name,
      };
    } else if (item?.type === "video") {
      return { type: "video", item };
    }
    return {}
  });
  //@ts-ignore
  return carouselImages;
}

export function removeKeyFromObject(dataObject: { [char: string]: string | string[] }, keys: string[]) {
  try {
    return Object.keys(dataObject).reduce((acc: any, curr) => {
      if (!keys.includes(curr)) {
        return { ...acc, [curr]: dataObject[curr] };
      }
      return acc;
    }, {});
  } catch {
    console.log("{dwal;mda;lm}");

    return dataObject || {};
  }
}
