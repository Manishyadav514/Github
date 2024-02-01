type breadcrumbLastValue = {
  name: string;
  url: string;
};

type breadcrumbListType = {
  "@type": string;
  position: number;
  name: string;
  item: string;
};

type faqTypes = {
  name: string;
  answer: string;
};

export const makeBreadCrumbSchemaList = breadCrumbList => {
  return breadCrumbList?.map((bc, bcIndex) => {
    return {
      "@type": "ListItem",
      position: bcIndex + 1,
      name: bc.label,
      item: bc.schemaTo,
    };
  });
};

export const generateBreadCrumbSchema = (item: breadcrumbListType[], currentValue: breadcrumbLastValue) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      ...item,
      {
        "@type": "ListItem",
        position: item.length + 1,
        name: currentValue.name,
        item: currentValue?.url,
      },
    ],
  };
};

export const generateFaqSchema = (faqs: faqTypes[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs?.map(item => {
      return {
        "@type": "Question",
        name: item?.name,
        acceptedAnswer: {
          "@type": "Answer",
          text: item?.answer,
        },
      };
    }),
  };
};
