import ImageComponent from "@libComponents/Common/LazyLoadImage";
import useDsAdobe from "@libHooks/useDsAdobe";
import useTranslation from "@libHooks/useTranslation";
import { formatPrice } from "@libUtils/format/formatPrice";
import recommendationHelper from "@libUtils/recommendationHelper";
import React, { useEffect, useState } from "react";
import AddIcon from "../../../public/svg/fbtAdd.svg";
import ShippingIcon from "../../../public/svg/freeShipping.svg";
import BagIconWhite from "../../../public/svg/carticon-white.svg";
import SelectIcon from "../../../public/svg/selectIcon.svg";
import useAddtoBag from "@libHooks/useAddToBag";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";
import { useRouter } from "next/router";
import PDPRatingV2 from "@libComponents/PDPWidgets/PDPRatingV2";

const PDPFrequentlyBroughtV2 = ({ product, item }: any) => {
  const [widgetData, setWidgetData] = useState<any>();
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const router = useRouter();
  const { addProductToCart } = useAddtoBag();
  const { t } = useTranslation();

  useEffect(() => {
    recommendationHelper(item.meta?.widgetMeta, item.commonDetails, product.sku || "").then((res: any) => {
      setWidgetData(res);
      setSelectedProducts([...(res.products || []), product]);
    });
  }, []);

  const handleProductSelection = (productData: any) => {
    const productIndex = selectedProducts.indexOf(productData);
    if (productIndex === -1) {
      // product is not selected, add to selected products
      setSelectedProducts([...selectedProducts, productData]);
    } else {
      // product is already selected, remove from selected products
      if (selectedProducts.length === 1) return;
      const updatedSelectedProducts = [...selectedProducts];
      updatedSelectedProducts.splice(productIndex, 1);
      setSelectedProducts(updatedSelectedProducts);
    }
  };

  const sumOfPrice = (value: string, prefix: boolean = true) => {
    return formatPrice(
      selectedProducts.reduce((partialSum, a) => partialSum + (a?.[value] ?? 0), 0),
      prefix
    );
  };

  const handleAddToBag = () => {
    SOURCE_STATE.pdpSource = t("frequentlyBought");
    SOURCE_STATE.addToBagSource = t("frequentlyBought");
    /**Just for safe side pass type value as 1 if check complete func addProductToCart you can see type is getting picked from product type itself not value we have passed */
    addProductToCart(selectedProducts, 1)
      .then(res => {
        if (res) {
          router.push("/shopping-bag");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const { dsWidgetRef } = useDsAdobe({
    title: item.commonDetails?.title,
    dsWidgetType: widgetData?.dsWidgetType,
    products: widgetData?.products,
    variantValue: widgetData?.variantValue,
  });

  if (widgetData?.products?.length === 0) {
    return <div />;
  }

  return (
    <div className="bg-white py-5 border-b-4 border-themeGray">
      <p className="text-15 font-bold pb-4 px-4 capitalize">
        {widgetData?.dsTitle || item?.commonDetails?.title || t("frequentlyBroughtTogether") || "Frequently Brought Together"}
      </p>
      <div className="flex pb-4 px-4  relative border-b border-dashed border-color1">
        <div
          className="absolute -top-1 left-3 bg-white"
          onClick={() => {
            handleProductSelection(product);
          }}
        >
          {selectedProducts.includes(product) ? (
            <SelectIcon width={16} height={16} role="img" aria-labelledby="select product" />
          ) : (
            <span className="border border-gray-400 rounded-3 flex justify-center items-center h-4 w-4 leading-4 text-lg text-gray-400 pt-0.5">
              +
            </span>
          )}
        </div>
        <ImageComponent
          style={{ width: "76px", height: "76px" }}
          src={product?.assets[0]?.imageUrl?.["400x400"]}
          alt={product.cms[0]?.content.name || product?.assets[0]?.title || product?.assets[0]?.name}
        />
        <div className="pl-4 overflow-hidden">
          <p className="text-xs font-bold line-clamp-1 uppercase leading-4"> {t("thisProduct") || "This Product"} </p>
          <p className="text-sm leading-4 line-clamp-2"> {product?.cms[0]?.content.name} </p>
          <div className="flex flex-wrap items-center pt-1.5">
            <p className="font-bold mr-1.5 text-sm leading-4">{formatPrice(product.offerPrice, true)}</p>
            {product.offerPrice < product.price && (
              <>
                <del className="text-11 text-gray-500 mr-1">{formatPrice(product.price, true)}</del>
                <span className="text-11 font-bold text-green-600 lowercase">
                  {t("priceOffPercentage", [
                    Math.round(((product.price - product.offerPrice) / product.price) * 100).toString(),
                  ])}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <span className="flex items-center justify-center -mt-2">
        <span className="w-4 h-4 bg-white relative z-10">
          <AddIcon />
        </span>
      </span>
      <ul
        className="overflow-x-auto flex list-none mb-0.5 px-4 mt-6"
        dir="ltr"
        style={{
          scrollSnapType: "x mandatory",
        }}
        ref={dsWidgetRef}
      >
        {widgetData?.products?.map((product: any, index: number) => (
          <li
            key={product.id}
            className="mr-2 mb-5 h-full rounded-3 bg-white relative"
            style={{
              width: "125px",
              minWidth: "125px",
              boxShadow: "0 0 1px 0 rgba(0,0,0,.12)",
              border: "0.745px solid #EFEFEF",
            }}
          >
            <div
              className="absolute top-2 left-2 bg-white rounded-3"
              onClick={() => {
                handleProductSelection(product);
              }}
            >
              {selectedProducts.includes(product) ? (
                <SelectIcon width={16} height={16} role="img" aria-labelledby="select product" />
              ) : (
                <span className="border border-gray-400 rounded-3 flex justify-center items-center h-4 w-4 leading-4 text-lg text-gray-400 pt-0.5">
                  +
                </span>
              )}
            </div>
            <div className="flex justify-center">
              <ImageComponent
                style={{ width: "124px", height: "124px" }}
                src={product?.assets[0]?.imageUrl?.["400x400"]}
                alt={product.cms[0]?.content.name || product?.assets[0]?.title || product?.assets[0]?.name}
              />
            </div>
            <div className="p-1.5">
              <div className=" h-5 -mt-4">
                <PDPRatingV2 avgRating={product?.rating?.avgRating} fontSize={10} svgSize={9} />
              </div>
              <p className="text-11 line-clamp-2 leading-tight mb-2 mt-1 h-6">{product.cms[0]?.content.name}</p>
              <div className="flex line-clamp-1 h-4 overflow-hidden ">
                <p className="font-semibold text-13 mr-1.5">{formatPrice(product.offerPrice, true)}</p>
                {product.offerPrice < product.price && (
                  // change text color text-gray-400 to text-gray-500 for sufficient color contrast
                  <>
                    <del className="text-11 text-gray-500 mr-1 mt-0.5">{formatPrice(product.price, true)}</del>
                    <span className="text-11 font-bold text-green-600 lowercase mt-0.5">
                      {t("priceOffPercentage", [
                        Math.round(((product.price - product.offerPrice) / product.price) * 100).toString(),
                      ])}
                    </span>
                  </>
                )}
              </div>
              {!!product?.isFreeShipping && (
                <div className="flex items-center justify-center mt-1">
                  <ShippingIcon />
                  <p className="text-11 text-color1 px-1"> {t("freeShip")} </p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex px-4">
        <div className="w-5/12">
          <p className="text-xs">{`Total Price( ${selectedProducts.length} Items)`}</p>
          <span className="flex items-center">
            <p className="font-semibold text-base mr-1.5">{sumOfPrice("offerPrice")}</p>
            {sumOfPrice("offerPrice", false) < sumOfPrice("price", false) && (
              // change text color text-gray-400 to text-gray-500 for sufficient color contrast
              <>
                <del className="text-xs text-gray-500 mr-1">{sumOfPrice("price")}</del>
                <span className="text-xs font-bold text-green-600 lowercase">
                  {t("priceOffPercentage", [
                    Math.round(
                      (((sumOfPrice("price", false) as number) - (sumOfPrice("offerPrice", false) as number)) /
                        (sumOfPrice("price", false) as number)) *
                        100
                    ).toString(),
                  ])}
                </span>
              </>
            )}
          </span>
        </div>
        <div className="w-7/12 ml-1">
          <button
            type="button"
            onClick={handleAddToBag}
            className="bg-ctaImg w-full flex gap-1 rounded items-center justify-center h-10"
          >
            <BagIconWhite role="img" aria-labelledby="add to cart" />
            <div className="flex justify-center mr-3">
              <span className="text-sm uppercase text-white font-bold">Add {selectedProducts.length} Items to Bag</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDPFrequentlyBroughtV2;
