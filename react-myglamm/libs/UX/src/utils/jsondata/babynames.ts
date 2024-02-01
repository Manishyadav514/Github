import { ALL_ALPHABETS, GENDER, ORIGIN_LIST, RandomAlphabets, REGIONAL_LIST } from "@constants/BabyNamesConstants";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { BabyNamesObject, filterType } from "src/@types/babyNamesTypes";

export const trimGender = (gender: string): string => {
  if (gender.toLocaleLowerCase() === "boys" || gender.toLocaleLowerCase() === "girls") {
    return gender.slice(0, -1);
  }
  return gender;
};

export const getBabyNamesFilter = (pagePath, pageNumber: number, limit: number): filterType => {
  const slug1 = pagePath?.[0];
  const slug2 = pagePath?.[1];
  const filter = {
    limit,
    skip: 0,
    where: {},
    sort: {
      name: 1,
    },
  };

  // page number filter
  if (!pageNumber || pageNumber > 1) {
    filter.skip = (pageNumber - 1) * 10;
  }
  // filter on meaning
  if (slug1?.includes("-meaning")) {
    // make first character capital;
    filter.where = {
      ...filter?.where,
      slug: slug1.split("-meaning")[0].toLocaleLowerCase(),
    };
    return filter;
  }
  // filter on gender
  // alphabet + gender
  if (GENDER.includes(slug1?.toLocaleUpperCase())) {
    if (slug2?.startsWith("starting-with-")) {
      filter.where = {
        ...filter?.where,
        start_alphabet: slug2?.split("with-")[1].toLocaleLowerCase(),
        gender: slug1.toLocaleLowerCase(),
      };
      return filter;
    }

    filter.where = {
      ...filter?.where,
      gender: slug1?.toLocaleLowerCase(),
    };
    return filter;
  }
  // alphabet
  if (slug1?.startsWith("starting-with-")) {
    filter.where = {
      ...filter?.where,
      start_alphabet: slug1?.split("with-")[1].toLocaleLowerCase(),
    };
    return filter;
  }

  // filter on origin
  // origin + gender
  if (ORIGIN_LIST.includes(slug1?.toLocaleUpperCase()?.split("-N")?.[0])) {
    if (GENDER.includes(slug2?.toLocaleUpperCase())) {
      filter.where = {
        ...filter?.where,
        gender: slug2?.toLocaleLowerCase(),
        origin: slug1?.toLocaleLowerCase(),
      };
      return filter;
    }
    filter.where = {
      ...filter?.where,
      origin: slug1?.toLocaleLowerCase()?.split("-n")?.[0],
    };
    return filter;
  }

  // filter on religion
  // religion + gender
  if (REGIONAL_LIST.includes(slug1?.toLocaleUpperCase()?.split("-")?.[0])) {
    if (GENDER.includes(slug2?.toLocaleUpperCase())) {
      filter.where = {
        ...filter?.where,
        gender: slug2?.toLocaleLowerCase(),
        region: slug1?.toLocaleLowerCase()?.split("-")?.[0],
      };
      return filter;
    }
    filter.where = {
      ...filter?.where,
      region: slug1?.toLocaleLowerCase()?.split("-")?.[0],
    };
    return filter;
  }
  return filter;
};

export const getPageData = (pagePath, totalNames: number, pageNumber: number) => {
  const slug1 = pagePath?.[0];
  const slug2 = pagePath?.[1];
  if (slug1?.includes("-meaning")) {
    const nameMeaning = slug1?.split("-meaning")[0];
    return {
      pageType: "MEANING",
      seoData: {
        title: `${nameMeaning.toLocaleLowerCase()} Meaning, Origin & more | BabyChakra Baby Names Finder`,
        description: `Find meaning of name ${nameMeaning.toLocaleLowerCase()}, its synonyms, origin , numerology, similar names and other details with BabyChakra Baby name finder.`,
        pageTitle: `Meaning of ${nameMeaning.toLocaleLowerCase()}`,
        pageContent: "",
        canonial: `/baby-names/${nameMeaning}`,
        breadCrumbList: [
          {
            name: `${nameMeaning}`,
            url: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names/${nameMeaning}-meaning`,
          },
        ],
      },
    };
  }
  if (GENDER.includes(slug1?.toLocaleUpperCase())) {
    if (slug2?.startsWith("starting-with-")) {
      const alphabet = slug2?.split("with-")[1];
      const gender = slug1;
      return {
        seoData: {
          title: `${totalNames} Baby ${trimGender(gender)} Names Starting with ${alphabet.toLocaleUpperCase()} ${
            pageNumber > 1 ? `Page ${pageNumber}` : ""
          } | BabyChakra`,
          description: `Baby ${trimGender(
            gender
          )} Starting with ${alphabet.toLocaleUpperCase()}. Here is the list of ${totalNames} latest and popular names for babies starting with ${alphabet.toLocaleUpperCase()} at BabyChakra.`,
          pageTitle: `Baby ${gender.toLocaleLowerCase()} Names starting with ${alphabet.toLocaleLowerCase()}`,
          // missing gender + alphabet
          pageContent: `Having trouble finding the best name for your baby ${gender.toLocaleUpperCase()}? Need assistance choosing the right one based on the alphabet? We will make your life a little easier here! We have got you covered with the stunning and interesting ${totalNames} ${slug1.toLocaleUpperCase()} names starting with alphabet ${alphabet.toLocaleLowerCase()} and meanings. Browse our unique list of names now!
          `,
          canonial: `/baby-names/${gender}/${slug2}`,
          breadCrumbList: [
            {
              to: `/baby-names/${gender}`,
              label: `${gender}`,
              schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names/${gender}`,
            },
            {
              name: `Starting With ${alphabet}`,
              url: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names/${gender}/${alphabet}`,
            },
          ],
        },
        pageType: "GENDER_AND_ALPHABET",
      };
    }
    const gender = slug1;
    return {
      pageType: "GENDER",
      seoData: {
        title: `${totalNames} Latest Baby ${trimGender(gender?.toLocaleLowerCase())} Names with Meaning ${
          pageNumber > 1 ? `Page ${pageNumber}` : ""
        } | BabyChakra  `,
        description: `Looking for Baby ${trimGender(
          gender?.toLocaleLowerCase()
        )} Names, check from the vast list of Latest and Popular baby ${gender?.toLocaleLowerCase()} Names with Meaning at BabyChakra.`,
        pageTitle: `Baby ${gender.toLocaleLowerCase()} Names`,
        pageContent: `Searching for the perfect name for your little one? Here are some of our favourite list of ${totalNames} ${gender.toLocaleLowerCase()} names which you can’t go wrong while selecting any of these! So, without looking any further, explore our unique list of ${totalNames} ${gender.toLocaleLowerCase()} names and give your newborn the sweetest name he deserves! `,
        canonial: `/baby-names/${gender}`,
        breadCrumbList: [
          {
            name: `${gender}`,
            url: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names/${gender}`,
          },
        ],
      },
    };
  }
  if (slug1?.startsWith("starting-with-")) {
    const alphabet = slug1?.split("with-")[1];
    return {
      pageType: "ALPHABET",
      seoData: {
        title: `${totalNames}  Baby Names Starting with ${alphabet.toLocaleUpperCase()} ${
          pageNumber > 1 ? `Page ${pageNumber}` : ""
        }  | BabyChakra`,
        description: `Baby Names Starting with ${alphabet.toLocaleUpperCase()}. Here is the list of ${totalNames} latest and popular names for Babies starting with ${alphabet.toLocaleUpperCase()} at BabyChakra.`,
        pageTitle: `Baby Names starting with ${alphabet.toLocaleLowerCase()}`,
        pageContent: `Thinking about your child’s name for a long time? Still haven’t found the perfect match? We’ve got your back! Now check out our alphabetical list of ${totalNames} Baby Names Starting with 
        ${alphabet.toLocaleUpperCase()} alphabet along with their meaning and select the most appropriate one for your newborn! `,
        canonial: `/baby-names/${slug1}`,
        breadCrumbList: [
          {
            name: `Starting With  ${alphabet}`,
            url: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names/${alphabet}`,
          },
        ],
      },
    };
  }
  if (
    (ORIGIN_LIST.includes(slug1.toLocaleUpperCase()?.split("-NAMES")?.[0]) && slug1.endsWith("-names")) ||
    (ORIGIN_LIST.includes(slug1.toLocaleUpperCase()) && GENDER?.includes(slug2?.toLocaleUpperCase()))
  ) {
    const origin = slug1;
    if (GENDER.includes(slug2?.toLocaleUpperCase())) {
      const gender = slug2;
      return {
        pageType: "ORIGIN_AND_GENDER",
        seoData: {
          title: `${totalNames}  ${origin?.toLocaleLowerCase()} Baby ${trimGender(
            gender?.toLocaleLowerCase()
          )} Names BabyChakra ${pageNumber > 1 ? `Page ${pageNumber}` : ""} `,
          description: ` Find Latest  ${origin?.toLocaleLowerCase()} names for baby ${gender?.toLocaleLowerCase()}?, Check out here to get the modern, unique and latest baby boy names with meaning at BabyChakra`,
          pageTitle: `${origin.toLocaleLowerCase()} Baby ${trimGender(gender?.toLocaleLowerCase())}  Names`,
          pageContent: `Choose the best baby name for your little one from our list of ${totalNames} ${origin.toLocaleLowerCase()} Baby ${trimGender(
            gender.toLocaleLowerCase()
          )} Names along with their true meaning. So, what are you waiting for? Start exploring the Baby Name Finder on BabyChakra and get your newborn a perfect and blessed name right away! `,
          canonial: `/baby-names/${origin?.toLocaleLowerCase()}/${gender?.toLocaleLowerCase()}`,
          breadCrumbList: [
            {
              to: `/baby-names/${origin}-names`,
              label: `${origin}`,
              schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names/${origin}-names`,
            },
            {
              name: `${gender}`,
              url: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names//${origin}/${gender}`,
            },
          ],
        },
      };
    }
    if (origin?.toLocaleUpperCase()?.split("-N")?.[0] === "SOUTH-INDIAN") {
      return {
        pageType: "ORIGIN",
        seoData: {
          title: `${totalNames} South Indian Baby Names BabyChakra ${pageNumber > 1 ? `Page ${pageNumber}` : ""} `,
          description: `Find Latest South Indian names for baby,  Check out here to get the modern, unique and latest ${
            origin?.toLocaleLowerCase()?.split("-n")?.[0]
          } baby names with meaning at BabyChakra`,
          pageTitle: `South Indian Baby Names`,
          pageContent: `Now, look no further than our list of popular ${totalNames} South Indian Baby Names with their original meanings that will convince you to look no further. Explore our list of best baby names according to your religion & origin and make a perfect choice for your baby. `,
          canonial: `/baby-names/${origin?.toLocaleLowerCase()}`,
          breadCrumbList: [
            {
              name: "South Indian",
              url: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names/${origin}`,
            },
          ],
        },
      };
    }
    return {
      pageType: "ORIGIN",
      seoData: {
        title: `${totalNames} ${origin?.toLocaleUpperCase()?.split("-N")?.[0]} Baby Names BabyChakra ${
          pageNumber > 1 ? `Page ${pageNumber}` : ""
        } `,
        description: `Find Latest  ${
          origin?.toLocaleLowerCase()?.split("-n")?.[0]
        } names for baby,  Check out here to get the modern, unique and latest ${
          origin?.toLocaleLowerCase()?.split("-n")?.[0]
        } baby names with meaning at BabyChakra`,
        pageTitle: `${origin?.toLocaleLowerCase()?.split("-n")?.[0]} Baby Names`,
        pageContent: `Now, look no further than our list of popular ${totalNames} ${
          origin?.toLocaleLowerCase()?.split("-n")?.[0]
        } Baby Names with their original meanings that will convince you to look no further. Explore our list of best baby names according to your religion & origin and make a perfect choice for your baby. `,
        canonial: `/baby-names/${origin?.toLocaleLowerCase()}`,
        breadCrumbList: [
          {
            name: `${origin?.split("-n")?.[0]}`,
            url: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names/${origin}`,
          },
        ],
      },
    };
  }
  if (
    REGIONAL_LIST.includes(slug1.toLocaleUpperCase()?.split("-NAMES")?.[0]) ||
    (REGIONAL_LIST.includes(slug1.toLocaleUpperCase()) && GENDER?.includes(slug2?.toLocaleUpperCase()))
  ) {
    const regional = slug1;
    if (GENDER.includes(slug2?.toLocaleUpperCase())) {
      const gender = slug2;
      return {
        pageType: "REGIONAL_AND_GENDER",
        seoData: {
          title: `${totalNames}  ${regional?.toLocaleLowerCase()} Baby ${trimGender(
            gender.toLocaleLowerCase()
          )} Names BabyChakra ${pageNumber > 1 ? `Page ${pageNumber}` : ""} `,
          description: ` Find Latest  ${regional?.toLocaleLowerCase()} names for baby ${gender.toLocaleLowerCase()}?, Check out here to get the modern, unique and latest baby boy names with meaning at BabyChakra`,
          pageTitle: `${regional.toLocaleLowerCase()} Baby ${trimGender(gender.toLocaleLowerCase())}  Names`,
          pageContent: `Choose the best baby name for your little one from our list of ${totalNames} ${regional.toLocaleLowerCase()} Baby ${trimGender(
            gender.toLocaleLowerCase()
          )} Names along with their true meaning. So, what are you waiting for? Start exploring the Baby Name Finder on BabyChakra and get your newborn a perfect and blessed name right away! `,
          breadCrumbList: [
            {
              to: `/baby-names/${regional}-names`,
              label: `${regional}`,
              schemaTo: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names/${regional}-names`,
            },
            {
              name: `${gender}`,
              url: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names/${regional}/${gender}`,
            },
          ],
          canonial: `/baby-names/${regional?.toLocaleLowerCase()}/${gender.toLocaleLowerCase()} `,
        },
      };
    }

    return {
      pageType: "REGIONAL",
      seoData: {
        title: `${totalNames} ${regional?.toLocaleUpperCase()?.split("-")?.[0]} Baby Names BabyChakra ${
          pageNumber > 1 ? `Page ${pageNumber}` : ""
        } `,
        description: `Find Latest  ${
          regional?.toLocaleLowerCase()?.split("-")?.[0]
        } names for baby,  Check out here to get the modern, unique and latest ${
          regional?.toLocaleLowerCase()?.split("-")?.[0]
        } baby names with meaning at BabyChakra`,
        pageTitle: `${regional?.toLocaleLowerCase()?.split("-")?.[0]} Baby Names`,
        pageContent: `Now, look no further than our list of popular ${totalNames} ${
          regional?.toLocaleLowerCase()?.split("-")?.[0]
        } Baby Names with their original meanings that will convince you to look no further. Explore our list of best baby names according to your religion & origin and make a perfect choice for your baby. `,
        breadCrumbList: [
          {
            name: `${regional?.split("-")?.[0]}`,
            url: `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}/baby-names/${regional}`,
          },
        ],
        canonial: `/baby-names/${regional?.toLocaleLowerCase()}`,
      },
    };
  }

  return {
    pageType: undefined,
    seoData: {
      title: "Error",
      description: "Error",
      pageTitle: "Page Not Found",
      breadCrumbList: [],
    },
  };
};

export const parseNamesList = (list: BabyNamesObject[]) => {
  return list?.map(item => {
    return {
      text: `${item?.name} Meaning`,
      link: `/baby-names/${item?.slug}-meaning`,
    };
  });
};

export const removeDuplicateBabyName = (list: BabyNamesObject[], matchKey: string, value: string) => {
  if (list?.length) {
    return list?.filter(item => item?.[matchKey] !== value);
  }
};

export const getGenderAlphabetCombination = (list: { text: string; link: string }[]) => {
  if (list?.length) {
    const alphabet = list?.[0]?.text?.charAt(0)?.toLocaleLowerCase();
    list?.push({
      text: `Baby Boy Names: Starting with ${alphabet.toLocaleUpperCase()}`,
      link: `/baby-names/boys/starting-with-${alphabet}`,
    });
    list?.push({
      text: `Baby Girl Names: Starting with ${alphabet.toLocaleUpperCase()}`,
      link: `/baby-names/girls/starting-with-${alphabet}`,
    });
  }

  return list;
};

export const getGenderOriginRegionalCombination = (list: { text: string; link: string }[], originOrRegional: any) => {
  const trimmedOriginOrRegional = originOrRegional?.[0]?.split("-")?.[0];
  if (list?.length) {
    list?.push({
      text: `${trimmedOriginOrRegional} Boy Names`,
      link: `/baby-names/${trimmedOriginOrRegional}/boys`,
    });
    list?.push({
      text: `${trimmedOriginOrRegional} Girl Names`,
      link: `/baby-names/${trimmedOriginOrRegional}/girls`,
    });
  }

  return list;
};

export const getAlphabetRelatedAlphabets = (alphabet: string) => {
  const alphabetsArray = RandomAlphabets[alphabet.split("starting-with-")[1].toLocaleUpperCase()];
  const generatedLinks = alphabetsArray?.map(item => {
    return { text: `Baby Names Starting with ${item}`, link: `/baby-names/starting-with-${item.toLocaleLowerCase()}` };
  });

  return generatedLinks;
};

export const getReligionAndGenderCombo = (gender: string) => {
  const generatedLinks = ORIGIN_LIST.map(item => {
    return {
      text: `${item.toLocaleLowerCase()} Baby ${trimGender(gender.toLocaleLowerCase())} Names`,
      link: `/baby-names/${item.toLocaleLowerCase()}-names/${gender.toLocaleLowerCase()}`,
    };
  });
  return generatedLinks;
};

export const isValidPage = (pagePath: string[]): boolean => {
  if (pagePath?.length <= 2) {
    const slug1 = pagePath?.[0];
    const slug2 = pagePath?.[1];
    // Meaning page should not have anything after meaning (change before meaning should be to be calculated and sent)
    if (slug1?.endsWith("-meaning") && !slug2) return true;
    if (GENDER?.includes(slug1?.toLocaleUpperCase())) {
      // gender + alphabet i.e starting with nothing after starting with or
      const alphabet = slug2?.split("starting-with-")?.[1];
      if (
        slug2?.startsWith("starting-with-") &&
        alphabet?.length === 1 &&
        ALL_ALPHABETS?.includes(alphabet?.toLocaleUpperCase())
      ) {
        return true;
      }
      // Gender only page there should not be second parameter
      if (!slug2) return true;
    }

    if (slug1?.startsWith("starting-with-") && !slug2) {
      // Exactly equal to alphabet no extra thing and should have starting with
      const alphabet = slug1?.split("starting-with-")?.[1];
      return alphabet?.length === 1 && ALL_ALPHABETS?.includes(alphabet?.toLocaleUpperCase());
    }

    // Regional Check
    if (
      (REGIONAL_LIST?.includes(slug1?.toLocaleUpperCase().split("-NAMES")?.[0]) &&
        slug1?.endsWith("names") &&
        !slug2 &&
        !slug1?.toLocaleUpperCase().includes("NAMES-NAMES")) ||
      (REGIONAL_LIST.includes(slug1.toLocaleUpperCase()) && GENDER?.includes(slug2?.toLocaleUpperCase()))
    ) {
      // should be from regional and should also have gender match nothing else
      if (GENDER?.includes(slug2?.toLocaleUpperCase())) return GENDER?.includes(slug2?.toLocaleUpperCase());
      // should not have second param and exactly equal to regional
      return !slug2;
    }
    // Origin Check
    if (
      (ORIGIN_LIST.includes(slug1.toLocaleUpperCase()?.split("-NAMES")?.[0]) &&
        slug1.endsWith("names") &&
        !slug2 &&
        !slug1?.toLocaleUpperCase().includes("NAMES-NAMES")) ||
      (ORIGIN_LIST.includes(slug1.toLocaleUpperCase()) && GENDER?.includes(slug2?.toLocaleUpperCase()))
    ) {
      // should be from origin and should have a gender match nothing else
      if (GENDER?.includes(slug2?.toLocaleUpperCase())) {
        return GENDER?.includes(slug2?.toLocaleUpperCase());
      }
      if (slug1?.toLocaleUpperCase()?.split("-NAMES")?.[0] === "SOUTH-INDIAN" && GENDER?.includes(slug2?.toLocaleUpperCase())) {
        return true;
      }
      if (slug1?.toLocaleUpperCase()?.split("-NAMES")?.[0] === "SOUTH-INDIAN" && !slug2) return true;
      return !slug2;
    }
    return false;
  }
  return false;
};
