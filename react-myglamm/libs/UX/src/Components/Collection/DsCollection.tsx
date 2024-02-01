import React, { useEffect, useState } from "react";
import PLPAPI from "@libAPI/apis/PLPAPI";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import PLPProdCell from "@libComponents/ProductGrid/PLPProdCell";
import { patchDsCollectionRes } from "@PLPLib/collection/patchProductRes";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { ADOBE } from "@libConstants/Analytics.constant";

const DsCollection = ({ dsProducts, collectionDetails, identifier, dsValue }: any) => {
  const [products, setProducts] = useState<any[]>(dsProducts);
  const { imageUrl, title, subTitle } = collectionDetails || {};
  const { key, service } = dsValue;

  const getDsCollection = async () => {
    const plpAPI = new PLPAPI();
    const res = await plpAPI.getDsCollection(service, key, checkUserLoginStatus()?.memberId);
    const dsProducts = patchDsCollectionRes(res?.data?.data?.[0]?.value?.products || []);
    if (dsProducts?.length > 0) {
      setProducts(dsProducts);
    }
  };

  useEffect(() => {
    if (!identifier && checkUserLoginStatus()) {
      getDsCollection();
    }
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|${title}|product listing page`,
        newPageName: "product listing ds",
        subSection: title,
        assetType: "ds collection",
        newAssetType: "ds collection",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      collection: {
        numberOfProducts: products?.length || 0,
        collection: title,
      },
    };
  }, []);

  return (
    <>
      {imageUrl && <ImageComponent forceLoad className="w-full px-3 bg-white pb-2" src={imageUrl} alt={title} />}
      {subTitle && (
        <p className="px-4 text-sm py-2 opacity-70 bg-white border-gray-200 shadow border-b italic mb-5">{subTitle}</p>
      )}
      <div className="py-b pl-2 flex flex-wrap" role="list">
        {products?.map((product: any, index: number) => {
          return (
            <div className="w-1/2 pr-2 pt-2" role="listitem" key={product.id}>
              <PLPProdCell
                showTags={false}
                product={product}
                ctpData={{}}
                forceload={false}
                productRef={null}
                indexProd={index}
                variantPLPTag={""}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default DsCollection;
