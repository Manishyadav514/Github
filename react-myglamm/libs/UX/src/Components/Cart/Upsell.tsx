import React from "react";
import ProductCard from "./ProductCard";
import { formatPrice } from "@libUtils/format/formatPrice";

const calcUpSellText = (discounts: any) => {
  const nextDiscount = discounts.nextCartDiscount;

  if (nextDiscount?.cms) {
    const amount = nextDiscount.systemRules.netAmount - discounts.netAmountCartDiscounts;

    let text = nextDiscount.cms[0]?.content?.cartTextBeforeOfferEligibility;

    text = text?.replace("[Amount]", formatPrice(amount) || 0);

    return text;
  }

  return "";
};

const Upsell = ({ spendMoreProducts, discounts, handleAddToBag, upsellWidgetData, clickedUpsellProductId, loader }: any) => (
  <div
    className="w-full py-2"
    style={{
      backgroundColor: "#fff3f3",
    }}
  >
    <div className="flex w-full mb-1 px-3">
      {upsellWidgetData ? (
        <div>
          <div>
            <span
              style={{
                backgroundImage: "linear-gradient(transparent 77%, rgb(255, 151, 151) 0px)",
                fontSize: "18px",
                backgroundSize: "100% 86%",
                backgroundRepeat: "no-repeat",
                transition: "background-size 0.4s ease 0s",
                padding: "0px 2px",
                fontWeight: 600,
              }}
              dangerouslySetInnerHTML={{
                __html: upsellWidgetData.commonDetails.title,
              }}
            />
          </div>
          {upsellWidgetData.commonDetails.subTitle && (
            <span className="text-13"> {upsellWidgetData.commonDetails.subTitle}</span>
          )}
        </div>
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: calcUpSellText(discounts),
          }}
        />
      )}
      {/* <div className="ml-auto">
        <Discount className="h-12 w-12" />
      </div> */}
    </div>
    <div className="w-full flex overflow-y-scroll">
      {spendMoreProducts.length > 0 &&
        spendMoreProducts.map((product: any, index: number) => {
          const images = product?.assets.find((asset: any) => asset.type === "image");

          return (
            <ProductCard
              key={product.id}
              product={product}
              productId={product.id}
              tryOn={product.productMeta.tryItOn}
              preOrder={product.productMeta.isPreOrder}
              stockStatus={product.inStock}
              productSKU={product.sku}
              title={product.cms[0]?.content?.name || product.productTag}
              product_slug={product?.urlManager?.url}
              product_offer_price={formatPrice(product.offerPrice)}
              product_price={formatPrice(product.price)}
              image={images?.imageUrl["400x400"]}
              image_alt_tag="product"
              shadeLabel={product?.cms[0]?.attributes?.shadeLabel}
              layoutClass=""
              addToBag={handleAddToBag}
              loader={loader}
              clickedUpsellProductId={clickedUpsellProductId}
            />
          );
        })}
    </div>
  </div>
);

export default Upsell;
