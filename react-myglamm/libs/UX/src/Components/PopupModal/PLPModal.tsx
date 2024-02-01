import PLPAPI from "@libAPI/apis/PLPAPI";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import ProductCell from "@libComponents/PDP/RecommendForOOSProductTag";
import SearchLabel from "@libComponents/Search/SearchLabel";
import { ADOBE } from "@libConstants/Analytics.constant";
import useTranslation from "@libHooks/useTranslation";
import { generateWhereForProduct } from "@libServices/PLP/filterHelperFunc";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { handlePartnershipData } from "@libUtils/getDiscountPartnership";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PopupModal from "./PopupModal";

const PLPModal = ({ show, setShow, header, slug, discountCode, limit = 4, url }: any) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [productData, setProductData] = useState([]);
  const [partnerShipData, setPartnershipData] = useState<any>();

  const getCollectionData = async () => {
    const plpAPI = new PLPAPI();
    const { data: collectionDataV2 } = await plpAPI.getCollectionV2({ "urlShortner.slug": slug }, 0, true, "", limit);
    if (discountCode) {
      const partnershipData = await handlePartnershipData({
        products: collectionDataV2?.data?.data?.products,
        discountCode,
        skip: 0,
      });
      setPartnershipData(partnershipData);
    }
    setProductData(collectionDataV2?.data?.products);
    triggerEvent38(collectionDataV2?.data);
  };

  const getPLPData = async () => {
    const plpAPI = new PLPAPI();
    const { data } = await plpAPI.getPLPProducts(generateWhereForProduct({}, slug), limit);
    setProductData(data.data.data);
    triggerEvent38(data.data.data, true);
  };

  const triggerEvent38 = (collectionData: any, isPLP = false) => {
    const name = isPLP ? collectionData?.cms?.[0]?.content?.name : collectionData?.data?.cms?.[0]?.content?.name || "";

    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|${name}|product listing page`,
        newPageName: isPLP ? "minicategory" : "minicollection",
        subSection: name,
        assetType: isPLP ? "minicategory" : "minicollection",
        newAssetType: isPLP ? "minicategory" : "minicollection",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      ...(!isPLP && {
        collection: {
          numberOfProducts: collectionData?.products?.length || 0,
          collection: name,
        },
      }),
    };
  };

  useEffect(() => {
    if (slug.includes("/buy/")) {
      getPLPData();
      return;
    }
    getCollectionData();
  }, [slug]);

  return (
    <PopupModal show={show} onRequestClose={() => setShow(false)}>
      <div className="bg-white w-full rounded-t-3xl pt-3 px-1" style={{ minHeight: "500px" }}>
        {productData?.length ? (
          <>
            <div className="flex justify-between">
              <span>
                <SearchLabel label={t("dontMissOut") || "Don’t Miss Out"} color="color1" textSize="text-base capitalize" />
                {header && <p className="text-xs px-3 -mt-3"> {header} </p>}
              </span>
              <button onClick={() => router.push(url)} className="pr-3 pt-1 uppercase text-11 text-color1 font-bold h-4">
                {t("viewAll") || "view all"}
              </button>
            </div>
            <div>
              <ProductCell
                products={productData}
                dsKey={"PLP Popup Modal"}
                isMiniPLP={true}
                partnerShipData={partnerShipData}
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center  w-20 h-20">
            <LoadSpinner />
          </div>
        )}
      </div>
    </PopupModal>
  );
};

export default PLPModal;
