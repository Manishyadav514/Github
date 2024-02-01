import uniqBy from "lodash.uniqby";

import { PLPProduct, PLPProductShades } from "@typesLib/PLP";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";

export const patchCollectionProductRes = (productRes: any, partnershipData?: any, productUrl?: string): PLPProduct => {
  const productShade = productRes?.cms?.[0].attributes?.shadeLabel || productRes.shades?.[0]?.shadeLabel || "";

  return {
    SKU: productRes.sku,
    productId: productRes.id,
    productName: productRes.productTag,
    priceOffer: productRes.offerPrice,
    productTag: productRes.productTag,
    productSubtitle: productRes.cms?.[0]?.content?.name?.replace(`${productShade && "-"} ${productShade}`, ""),
    priceMRP: productRes.price,
    shadeLabel: productShade,
    imageAltTag: productRes.assets?.[0]?.name || productRes.productTag,
    imageURL: productRes.assets?.[0]?.imageUrl?.[IS_DESKTOP ? "400x400" : "200x200"],
    URL: productUrl || productRes.urlManager?.url,
    urlManager: productRes.urlManager,
    category: productRes.category,
    subCategory: productRes.subCategory,
    parentCategory: productRes.parentCategory,
    productType: productRes.type,
    partnershipPayableAmount: partnershipData?.payableAmount,
    partnershipDiscountAmount: partnershipData?.discountAmount,
    meta: {
      isPreProduct: productRes.productMeta?.isPreOrder,
      shadeCount: productRes.shades?.length || 0,
      inStock: productRes.inStock,
      discountPercentage: Math.round(((productRes.price - productRes.offerPrice) / productRes.price) * 100),
      tryItOn: productRes.productMeta?.tryItOn,
      preOrderDetails: productRes.productMeta?.preOrderDetails,
      isFreeProduct: productRes.productMeta?.isFreeProduct,
      isOfferAvailable: productRes.productMeta?.isOfferAvailable,
      cutThePrice: productRes.productMeta?.cutThePrice || false,
      memberTypeLevel: productRes.productMeta?.memberTypeLevel,
    },
    shades: (uniqBy(productRes.shades, "productId") as unknown as PLPProductShades) || [],
    rating: productRes.rating,
    subscription: productRes.subscription || {},
  };
};

export const patchDsCollectionRes = (products: any[]) => {
  return products.map(product => {
    return {
      SKU: product.id || product.sku,
      productId: product.id || product.sku,
      productName: product?.productTitle,
      priceOffer: product.priceOffer * 100,
      productTag: product?.productTag,
      productSubtitle: product?.productSubTitle,
      priceMRP: product?.priceMRP * 100,
      shadeLabel: product?.shadeLabel,
      imageAltTag: product?.productTag,
      imageURL: product?.imageURL,
      URL: product?.slug,
      urlManager: {
        url: product.slug,
      },
      category: product.category,
      subCategory: product?.subCategory || "",
      parentCategory: product?.parentCategory || "",
      productType: product?.type,
      meta: {
        shadeCount: product?.shadeCount || 0,
        inStock: true,
      },
      shades: [],
      rating: product.rating,
      subscription: {},
    };
  });
};
