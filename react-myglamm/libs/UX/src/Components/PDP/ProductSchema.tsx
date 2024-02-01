import React from "react";

import { PDPProd } from "@typesLib/PDP";

import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";

const ProductSchema = ({ productData }: { productData: PDPProd }) => {
  const { ratings, reviews } = productData;

  const schema: any = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: productData.cms[0]?.content?.name,
    description: productData.cms[0]?.metadata?.title,
    sku: productData.sku,
    image: Array.from({ length: 4 }, (_, i) => productData?.assets?.[i]?.imageUrl?.["800x800"]),
    brand: {
      "@type": "Brand",
      name: productData.brand.name,
    },
    offers: {
      "@type": "Offer",
      price: formatPrice(productData.offerPrice),
      priceCurrency: getCurrency(),
      availability: `${productData.inStock ? "InStock" : "OutOfStock"}`,
      url: productData?.urlShortner?.url,
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "IN",
      returnPolicyCategory: "MerchantReturnFiniteReturnWindow",
      merchantReturnDays: "7",
      returnMethod: "ReturnByMail",
      returnFees: "FreeReturn",
    },
  };

  if (ratings?.avgRating > 0 && ratings?.totalCount > 0) {
    schema["aggregateRating"] = {
      "@type": "AggregateRating",
      ratingValue: ratings?.avgRating,
      reviewCount: ratings?.totalCount,
    };
  }

  if (reviews?.reviewsList?.length > 0) {
    schema["review"] = reviews.reviewsList.map((review: any) => ({
      "@type": "Review",
      name: review.reviewTitle?.replace(/<[^>]+>/g, ""),
      reviewBody: review.reviewContent?.replace(/<[^>]+>/g, ""),
      datePublished: review.createdAt,
      author: {
        "@type": "Person",
        name: review.reviewerInfo?.firstName?.replace(/<[^>]+>/g, ""),
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating >= 1 && review.rating <= 5 ? review.rating : 1,
        bestRating: "5",
      },
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
};

export default ProductSchema;
