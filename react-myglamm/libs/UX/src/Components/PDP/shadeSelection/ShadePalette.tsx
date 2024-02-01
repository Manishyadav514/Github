import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useSelector } from "@libHooks/useValtioSelector";

import ProductAPI from "@libAPI/apis/ProductAPI";

import { formatPrice } from "@libUtils/format/formatPrice";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { ValtioStore } from "@typesLib/ValtioStore";

import ColorTabHeaders from "./ColorTabHeaders";

import Check from "../../../../public/svg/check.svg";
import Heart from "../../../../public/svg/transparentHeart.svg";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import { isClient } from "@libUtils/isClient";
import { getSessionStorageValue } from "@libUtils/sessionStorage";

export interface ShadePaletteProps {
  productTag: string;
  shades: any;
  shadeLabel: string;
  currentProductId: string;
  setActiveShade?: any;
  isMiniShadeSelection?: boolean;
  isFreeProduct?: boolean;
  alignShadesLeft?: boolean;
  colorFamily: any;
  setActiveProduct?: any;
}

function ShadePalette({
  productTag,
  shadeLabel,
  shades,
  currentProductId,
  setActiveShade,
  isMiniShadeSelection,
  isFreeProduct,
  colorFamily,
  setActiveProduct,
}: ShadePaletteProps) {
  const router = useRouter();

  const { userWishlist } = useSelector((store: ValtioStore) => store.userReducer);
  const [id, setId] = useState(currentProductId);
  const [keyName, setKeyName] = useState("ALL");
  const [colorShades, setColorShades] = useState<any>({ ["ALL"]: shades });
  const discountData = isClient() && JSON.parse(sessionStorage.getItem(SESSIONSTORAGE.AB_DYNAMIC_DISCOUNT_PRICE) || "{}");
  const productData = getSessionStorageValue(LOCALSTORAGE.PARTNERSHIP_PRODUCT_TAG, true);
  const abProductTag = discountData?.discountProductTag || "";
  const abDiscountPrice = discountData?.discountPrice * 100 || 0;
  const selectedShadeRef: any = React.useRef<any>([]);

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setId(currentProductId);
  }, [shades?.[0]?.productTag]);

  useEffect(() => {
    setColorShades({ ["ALL"]: shades });
  }, [shades]);

  React.useEffect(() => {
    if (selectedShadeRef.current[id]) {
      selectedShadeRef.current[id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedShadeRef, shades, id]);

  const onClick = (selectedShade: any) => {
    setActiveProduct(selectedShade);
    setId(selectedShade?.id);
  };

  /* Check if selected tab color family has the same shade as of previous tab ,if not then keep the first shade selected */
  const selectShadeOnTabChange = (shadesSelected: any) => {
    const prevSlectedIndex = shadesSelected.findIndex((x: any) => x.id === id);

    if (prevSlectedIndex === -1) {
      onClick(shadesSelected[0]);
    } else {
      onClick(shadesSelected[prevSlectedIndex]);
    }
  };

  /* TAB CHANGE  */
  const onTabChange = (index: number, color: any) => {
    setTabIndex(index);
    setKeyName(color.name);

    if (colorShades[color.name]) {
      selectShadeOnTabChange(colorShades[color.name]);
    }

    if (!colorShades[color.name]) {
      const field = colorFamily.field;

      let where: { [char: string]: any };
      const productApi = new ProductAPI();

      where = {
        productTag: encodeURIComponent(shades?.[0]?.productTag),
        [colorFamily.field]: color.name,
      };

      const include = ["price", "productTag", "type", "cms", "assets", "inStock", "offerPrice", "urlManager"];
      productApi.getProductShades("IND", where, 0, include).then(({ data: prod }) => {
        if (prod.data.data.length > 0) {
          setColorShades({
            ...colorShades,
            [color.name]: prod.data.data,
          });
          selectShadeOnTabChange(prod.data.data);
        }
      });
    }
  };

  return (
    <React.Fragment>
      {colorFamily.data?.length > 0 && (
        <ColorTabHeaders
          colorFamily={colorFamily}
          activeTab={0}
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
          onTabChange={onTabChange}
        />
      )}
      {/* Shade Grid Component */}

      <div className="w-full p-4 bg-white flex-1 overflow-auto min-h-0">
        <div className="pl-4 relative ">
          {colorShades[keyName]?.map((shade: any, index: number) => {
            const shadeDetails = shade.cms[0]?.attributes;
            const { shadeImage, shadeLabel } = shadeDetails || {};

            return (
              <div
                className="w-1/2 py-3 inline-block "
                key={shade.id}
                ref={el => {
                  selectedShadeRef.current[shade.id] = el;
                }}
              >
                <div className="flex justify-start items-center  w-full">
                  <div className="flex items-center rounded-lg justify-center">
                    <a
                      role="presentation"
                      style={{ width: "36px", height: "36px" }}
                      className="rounded-lg"
                      onClick={() => {
                        onClick(shade);
                      }}
                      aria-label="shade"
                    >
                      <div
                        role="button"
                        aria-hidden="true"
                        className="flex items-center justify-center relative"
                        onClick={() => (isMiniShadeSelection || isFreeProduct ? setActiveShade(shade, index) : "")}
                      >
                        {id !== shade.id && (
                          <>
                            {!shade?.productMeta?.isPreOrder && !shade.inStock && (
                              <div
                                className="flex overflow-hidden rounded-lg absolute z-20 w-full h-full bg-no-repeat bg-center"
                                style={{
                                  backgroundImage: "url(https://files.myglamm.com/site-images/original/ico-no-shade.png)",
                                }}
                              />
                            )}
                            {userWishlist?.find((x: any) => x === shade.id) && (
                              <Heart className="absolute m-auto z-10 top-0 left-0 right-0 bottom-0" />
                            )}
                          </>
                        )}

                        {id === shade.id && (
                          <Check
                            className="absolute m-auto z-30 top-0 left-0 right-0 bottom-0"
                            role="img"
                            aria-labelledby="check"
                          />
                        )}

                        <ImageComponent className="w-full h-full rounded-lg" src={shadeImage} />
                      </div>
                    </a>
                  </div>

                  <div className="ml-2">
                    <p className="text-sm">{shadeLabel}</p>
                    {/* Price PlaceHolder */}
                    {abDiscountPrice && shade.offerPrice && abDiscountPrice <= shade.price && productTag === abProductTag ? (
                      <div className="flex">
                        <span className="text-xxs opacity-50">
                          {shade.price - abDiscountPrice === 0 ? "FREE" : formatPrice(shade.price - abDiscountPrice, true)}
                        </span>
                      </div>
                    ) : productData ? (
                      <div className="flex">
                        <span className="text-xxs opacity-50">
                          {productData?.[0]?.payableAmount === 0 ? "FREE" : formatPrice(productData?.[0]?.payableAmount, true)}
                        </span>
                      </div>
                    ) : shade.offerPrice && shade.offerPrice < shade.price ? (
                      <div className="flex">
                        <span className="text-xxs opacity-50">{formatPrice(shade.offerPrice, true)}</span>
                      </div>
                    ) : (
                      <div className="flex">
                        <span className="text-xxs opacity-50">{formatPrice(shade.price, true)}</span>
                      </div>
                    )}
                  </div>
                  {/* Price PlaceHolder */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
}

export default ShadePalette;
