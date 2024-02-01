import { GA4Event } from "@libUtils/analytics/gtm";
import { formatPrice } from "@libUtils/format/formatPrice";
import { useRef, useEffect } from "react";

// https://www.developerway.com/posts/implementing-advanced-use-previous-hook
// WARN: only works for primitives like strings, not objects
// const usePreviousPersistent = (value: any) => {
//   // initialise the ref with previous and current values
//   const ref = useRef({
//     value: value,
//     prev: null,
//   });

//   const current = ref.current.value;

//   // if the value passed into hook doesn't match what we store as "current"
//   // move the "current" to the "previous"
//   // and store the passed value as "current"
//   if (value !== current) {
//     ref.current = {
//       value: value,
//       prev: current,
//     };
//   }

//   // return the previous value only
//   return ref.current.prev;
// };

const usePreviousPersistent = (value: any) => {
  const ref = useRef();
  const prev = ref.current;

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return prev;
};

export const useInfiniteScrollGA4Event = (products: any[], categoryDetails: any = {}) => {
  // the skuKey param is required because its all caps on PLP and camelcase on collection
  //  ¯\_(ツ)_/¯
  const prevProducts: any = usePreviousPersistent(products);

  useEffect(() => {
    // this runs only on the first render after SSR
    GA4Event([
      {
        event: "view_item_list",
        ecommerce: {
          item_list_id: `${categoryDetails?.type ? `${categoryDetails?.type}_` : ""}${
            categoryDetails?.id || products?.[0]?.parentCategoryId
          }`,
          item_list_name: categoryDetails?.name || products?.[0]?.parentCategory,
          items: products?.map((product: any, index: number) => {
            return {
              item_id: product?.productId || product?.id,
              item_name: product?.productName || product?.productTag,
              discount: formatPrice((product?.priceMRP || product?.price) - (product?.priceOffer || product?.offerPrice)),
              item_category: product?.parentCategory,
              item_category_2: product?.category,
              item_category_3: product?.subCategory,
              price: formatPrice(product?.priceMRP || product?.price),
              quantity: 1,
              ...((product?.shadeLabel || product?.shades?.length) && {
                item_variant: product?.shadeLabel || product?.cms?.[0]?.attributes?.shadeLabel || null,
              }),
              index: index,
              inventory_status: product?.inStock || product?.meta?.inStock ? "in stock" : "out of stock",
            };
          }),
        },
      },
    ]);
  }, []);

  useEffect(() => {
    // this runs only when the list mutates
    if (!!prevProducts && prevProducts?.length > 0) {
      // @ts-ignore
      let difference = products?.filter(x => !prevProducts?.find(y => x?.SKU === y?.SKU));

      if (difference.length > 0) {
        GA4Event([
          {
            event: "view_item_list",
            ecommerce: {
              item_list_id: products?.[0]?.parentCategoryId,
              item_list_name: products?.[0]?.parentCategory,
              items: products?.map((product: any, index: number) => {
                return {
                  item_id: product?.productId || product?.id,
                  item_name: product?.productName || product?.productTag,
                  discount: formatPrice((product?.priceMRP || product?.price) - (product?.priceOffer || product?.offerPrice)),
                  item_category: product?.parentCategory,
                  item_category_2: product?.category,
                  item_category_3: product?.subCategory,
                  price: formatPrice(product?.priceMRP || product?.price),
                  quantity: 1,
                  ...((product?.shadeLabel || product?.shades?.length) && {
                    item_variant: product?.shadeLabel || product?.cms?.[0]?.attributes?.shadeLabel || null,
                  }),
                  index: index + prevProducts?.length,
                };
              }),
            },
          },
        ]);
      }
    }
  }, [products]);
};
