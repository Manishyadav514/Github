import { FilterRow } from "@typesLib/PLP";

export function isArrayEqual(arr1: string[], arr2: string[]) {
  if (arr1 === undefined || arr2 === undefined) {
    return true;
  }
  if (arr1?.length !== arr2?.length) {
    return false;
  }

  const sortedArr1 = arr1?.slice()?.sort();
  const sortedArr2 = arr2?.slice()?.sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

export function arePriceObjectsEqual(arr1: any, arr2: any) {
  if (arr1?.length === 0 && arr2?.length === 0) {
    return true;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  const obj1 = arr1.sort((a: any, b: any) => a.priceOffer?.between[0] - b.priceOffer?.between[0]);
  const obj2 = arr2.sort((a: any, b: any) => a.priceOffer?.between[0] - b.priceOffer?.between[0]);

  for (let i = 1; i < obj1.length; i++) {
    if (obj1?.priceOffer?.between[0] === obj2?.priceOffer?.between[0]) {
      return false;
    }
  }

  return true;
}

export const combinePriceArrays = (selectedPrices: any[], priceBuckets: any[]) => {
  const updatedPriceSet = new Set();
  const combinedArray: any = [];

  // function to add items to combinedArray
  const addItem = (min: string, max: string) => {
    if (!updatedPriceSet.has(min)) {
      combinedArray.push({ min, max });
      updatedPriceSet.add(min);
    }
  };
  selectedPrices?.forEach(price => {
    const min = price?.priceOffer?.between?.[0];
    const max = price?.priceOffer?.between?.[1];
    if (min !== undefined) {
      addItem(min, max);
    }
  });

  priceBuckets?.forEach(bucket => {
    const min = bucket?.min;
    const max = bucket?.max;
    if (min !== undefined) {
      addItem(min, max);
    }
  });

  return combinedArray;
};
