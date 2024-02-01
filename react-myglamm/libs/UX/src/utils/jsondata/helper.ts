export function getNumberOfPages(totalElements: number, pageSplitBy: number): number {
  const noOfPage =
    totalElements % pageSplitBy !== 0 ? Math.floor(totalElements / pageSplitBy) + 1 : totalElements / pageSplitBy;
  return noOfPage;
}
export function getPageSlots(selectedPage, noOfSlots, maxPages) {
  let pageSlot = [];
  if (selectedPage % noOfSlots === 0) {
    const temp = [];
    for (let i = selectedPage; i > selectedPage - noOfSlots; i--) {
      if (i <= maxPages) temp.push(i);
    }
    pageSlot = temp.sort((a, b) => a - b);
  } else {
    let temp;
    for (let i = 1; i < noOfSlots; i++) {
      if ((selectedPage + i) % noOfSlots === 0) {
        temp = selectedPage + i;
      }
    }
    for (let i = temp - noOfSlots + 1; i <= temp; i++) {
      if (i <= maxPages) pageSlot.push(i);
    }
  }
  return pageSlot;
}

export function validateLifeStage(lifestage: string) {
  const lifeStageArr = ["new-parents", "toddler", "expecting-a-baby", "all"];
  if (lifeStageArr.includes(lifestage)) {
    return lifestage;
  }
  // Threat
  return "all";
}

export const constructNewPath = (currentSearch: object, additionalSearchParam) => {
  // const query = queryStringToJSON(currentSearch);
  const query = currentSearch;
  Object.keys(additionalSearchParam).forEach(key => {
    query[key] = additionalSearchParam[key];
  });
  return query;
  // const search = jsonToQueryString(query);
};

export const lifestageMapper = (slug: string) => {
  const lifestageMap = {
    toddler: 5,
    "new-parents": 4,
    "expecting-a-baby": 6,
  };
  return lifestageMap?.[slug] || 8;
};

export function validateLanguage(lang: string) {
  const langArr = ["en", "ta", "kn", "hi", "bn"];
  if (langArr.includes(lang)) {
    return lang;
  }
  // Threat
  return "en";
}

export function lifestageSlugMapper(lifestageId: number) {
  const lifestageMap = {
    5: "toddler",
    4: "new-parents",
    6: "expecting-a-baby",
  };
  return lifestageMap?.[lifestageId] || "all";
}

export function getAssociatedSlugForArticles(pathname) {
  if (pathname === "/baby") {
    return "new-parents";
  }
  if (pathname === "/pregnancy" || pathname === "/getting-pregnant") {
    return "expecting-a-baby";
  }
  return "toddler";
}

export function getAssociatedLifestageSEOContent(pathname) {
  if (pathname === "/baby") {
    return {
      headingText: "Information, Tips, Advice on Baby Growth & Developmental Milestones",
      content:
        "Baby development and baby care are a priority for every parent! From how to take care of a newborn baby to newborn breastfeeding and baby development milestones, there are several questions that a parent is seeking answers to. Use BabyChakra's baby weight growth chart and baby care tips to raise a healthy child! Do you have questions about baby health and baby development by week? BabyChakra is the place to get all your answers!",
      title: "Baby Care, Diet, Growth & Week by Week Development Milestones| BabyChakra",
      description:
        "Baby care, Baby development milestones & growth are a priority for every parent! Learn tips on how to take care of a newborn baby, breastfeeding on BabyChakra.",
      canonical: pathname,
    };
  }
  if (pathname === "/pregnancy") {
    return {
      headingText: "Pregnancy & Birth - Pregnancy Care & Week by Week Stages",
      content:
        "Pregnancy is an exciting phase! Right from early pregnancy symptoms to reading pregnancy books and tracking your pregnancy week by week! You will find everything from fetal development week by week to advice on what to eat during pregnancy to pregnancy stages and pregnancy labour pain information right here. BabyChakra is your personal pregnancy guide for all your pregnancy care needs! Nutrition is an important aspect of pregnancy. If you are looking for pregnancy diet recommendations including a pregnancy food chart or perhaps a diet chart for pregnant women, you have come to the right place!",
      title: "All About Pregnancy, Fetal Development Week by Week | BabyChakra",
      description:
        "Pregnancy is an exciting phase! A complete guide on pregnancy week by week stages, pregnancy care, labour pains, healthy diet & fitness on BabyChakra.",
      canonical: pathname,
    };
  }
  return {
    headingText: "Tips on Toddler Health, Food and Behaviour",
    content:
      "Understanding toddlers, toddler behaviour and toddler discipline are foremost on the minds of parents! Toddler safety, toddler eating and toddler development are also among frequently discussed toddler care topics. Toddler food, especially healthy food for toddlers are top toddler health questions that parents are concerned about! All of this and more answered for you only here on BabyChakra, your toddler guide!",
    title: "Understand Toddler Behaviour, Toddler Food, Toddler Health Tips & Advice| BabyChakra",
    description:
      "Understanding toddlers, toddler behaviour, discipline, toddler safety, their eating habbits & growth development are foremost on the minds of parents! Find every topic on toddler care discussed on BabyChakra.",
    canonical: pathname,
  };
}

export default function decodeEntities(encodedString) {
  const translateRe = /&(nbsp|amp|quot|lt|gt);/g;
  const translate = {
    nbsp: " ",
    amp: "&",
    quot: `"`,
    lt: "<",
    gt: ">",
  };
  return encodedString
    ?.replace(translateRe, (_, entity) => translate[entity])
    ?.replace(/&#(\d+);/gi, (_, numStr) => {
      const num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
}
