import Router from "next/router";

//ref.https://www.joshwcomeau.com/snippets/javascript/range/
export const getNumbersSeriesRange = (start: number, end: number, step = 1) => {
  let output = [];
  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

export const chunkIt = (arr: any[], size: number) => {
  //@ts-ignore
  return arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);
};

export const changeURL = (q: any) => {
  Router.push(
    {
      pathname: "/search",
      query: {
        q,
        tab: "PRODUCTS",
      },
    },
    undefined,
    { shallow: true }
  );
};

export const scrollTop = () =>
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

export function convertPriceRange(data: []) {
  if (!data?.length) return "";
  return data
    ?.map((item: any) => {
      const priceRange = item?.priceOffer?.between;
      return `${priceRange[0] / 100}-${priceRange[1] / 100}`;
    })
    .join(",");
}

export const variantValueGenerator = (variantValue: string) => {
  if (variantValue === "1" || variantValue === "0")
    return "boosting";
  return `boosting-v${variantValue}`;
};
