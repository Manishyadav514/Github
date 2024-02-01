import React, { useState, memo } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import LazyHydrate from "react-lazy-hydration";

import { ValtioStore } from "@typesLib/ValtioStore";

import ShadesProduct from "./ShadesProduct";
import ProductAPI from "@libAPI/apis/ProductAPI";

function ShadesGrid({ lipsData, color, finish }: any) {
  const [Product, setProductData] = useState<any>();

  const getProductData = async (event: any) => {
    try {
      const productApi = new ProductAPI();
      const { data } = await productApi.getProduct({
        "urlManager.url": event.target.dataset.slug,
      });
      setProductData(data.data);
    } catch (error) {
      console.log(`Failed to Fetch Product`, error.message);
    }
  };

  if (color === undefined && finish === undefined) {
    return (
      <div className="flex flex-wrap p-1 relative">
        <LazyHydrate whenVisible>
          {lipsData?.map((shades: any) =>
            shades?.finish?.map((element: any) =>
              element?.thumbnails?.map((content: any, index: number) => (
                <div
                  className="w-1/2 text-white "
                  style={{
                    paddingBottom: Product?.data[0]?.urlManager?.url === content.slug ? "34rem" : "",
                  }}
                  // eslint-disable-next-line
                  key={`${content.slug}${index}`}
                >
                  <LazyLoadComponent>
                    <ShadesProduct productContent={content} Product={Product} getProductData={getProductData} />
                  </LazyLoadComponent>
                </div>
              ))
            )
          )}
        </LazyHydrate>
      </div>
    );
  }

  /* eslint-disable no-nested-ternary */

  return (
    <div className="flex flex-wrap mt-8 p-1">
      {color === undefined && finish > -1 ? (
        lipsData?.map((shades: any) =>
          shades?.finish[finish]?.thumbnails?.map((content: any, index: number) => (
            <div
              className="w-1/2 text-white"
              style={{
                paddingBottom: Product && Product.slug === content.slug ? "34rem" : "",
              }}
              key={`${content.label}${index}`}
            >
              <LazyLoadComponent>
                <ShadesProduct productContent={content} Product={Product} getProductData={getProductData} />
              </LazyLoadComponent>
            </div>
          ))
        )
      ) : finish !== undefined ? (
        lipsData[color].finish[finish] ? (
          lipsData[color]?.finish[finish]?.thumbnails?.map((content: any) => (
            <div
              className="w-1/2 text-white"
              style={{
                paddingBottom: Product?.data[0]?.urlManager?.url === content.slug ? "34rem" : "",
              }}
              key={content.label}
            >
              <LazyLoadComponent>
                <ShadesProduct productContent={content} Product={Product} getProductData={getProductData} />
              </LazyLoadComponent>
            </div>
          ))
        ) : (
          <div className="text-black-600  text-base pb-8 text-center w-full my-6 opacity-75">Sorry! No Products Found</div>
        )
      ) : (
        lipsData[color].finish?.map((element: any) =>
          element.thumbnails?.map((content: any) => (
            <div
              className="w-1/2 text-white"
              style={{
                paddingBottom: Product?.data[0]?.urlManager?.url === content.slug ? "34rem" : "",
              }}
              key={content.label}
            >
              <LazyLoadComponent>
                <ShadesProduct productContent={content} Product={Product} getProductData={getProductData} />
              </LazyLoadComponent>
            </div>
          ))
        )
      )}
    </div>
  );
}

export default memo(ShadesGrid);
