import React, { ReactElement, useEffect, useState } from "react";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import StarIcon from "../../../public/svg/star-filled.svg";
import { formatPrice } from "@libUtils/format/formatPrice";
import PLPWishlistButton from "@libComponents/PLP/PLPWishlistButton";
import Layout from "@layout/TVCLayout";
import useAddtoBag from "@libHooks/useAddToBag";
import useTranslation from "@libHooks/useTranslation";
import { showSuccess } from "@libUtils/showToaster";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { LOCALSTORAGE, SESSIONSTORAGE } from "@libConstants/Storage.constant";
import CartMiniPDPDetails from "@libComponents/PopupModal/CartMiniPDPDetails";
import { ADOBE } from "@libConstants/Analytics.constant";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { useRouter } from "next/router";
import { isClient } from "@libUtils/isClient";
import OfflineStoreLayout from "@libLayouts/OfflineStoreLayout";
import { getSessionStorageValue } from "@libUtils/sessionStorage";

const ShowRecommendedProducts = () => {
  const { t } = useTranslation();
  const SkinAnalysisData = getSessionStorageValue(LOCALSTORAGE.SKIN_ANALYSER_RESULTS, true);
  const skinProblems = t("skinProblems");

  const { addProductToCart } = useAddtoBag();

  const [products, setProducts] = useState<any>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [offlineStoreName, setofflineStoreName] = useState("");

  const offlineStoreId = isClient() ? sessionStorage.getItem(SESSIONSTORAGE.OFFLINE_STORE_NAME) : null;

  useEffect(() => {
    if (offlineStoreId) setofflineStoreName(offlineStoreId);
    fetchOfflineStoreProducts();
  }, [offlineStoreId]);

  const fetchOfflineStoreProducts = async () => {
    const widgetApi = new WidgetAPI();
    let skinProblemsList: any = [];

    setLoader(true);

    skinProblems.forEach((problem: string) => {
      skinProblemsList.push({
        where: {
          productType: 1,
          skinProblems: [{ problem: SkinAnalysisData?.[problem]?.name, score: SkinAnalysisData?.[problem]?.score }],
          ...(offlineStoreId && { meta: { storeLocatorId: offlineStoreId } }),
        },
      });
    });

    const [...products] = await Promise.allSettled(widgetApi.getSkinProblemProducts(skinProblemsList));
    setProducts(getProductList(products, skinProblems));

    setLoader(false);
  };

  useEffect(() => {
    /* Adobe events */
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|skin analyser|Recommended Product Page",
        newPageName: "Skin Analyser Recommended Product Page",
        subSection: "Skin Analyser Recommended Product Page",
        assetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        newAssetType: ADOBE.ASSET_TYPE.SKIN_ANALYSER,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  const getProductList = (products: any, problems: any) => {
    let _products: any = [];

    products.forEach((product: any, index: number) => {
      _products.push({ ...product.value?.data?.data, problems: problems?.[index] });
    });

    return _products;
  };

  const handleAddToBag = async (product: any) => {
    const isPreProduct = product?.meta?.isPreProduct;

    return await addProductToCart(product, isPreProduct ? 3 : 1)
      .then(res => {
        if (res) showSuccess(t("addedToCart") || "Added To Cart", 2500);
      })
      .catch(error => console.error(error));
  };

  if (loader) {
    return (
      <div className="h-screen">
        <LoadSpinner />
      </div>
    );
  }

  return (
    <div className="p-2">
      {products?.map((product: any, index: number) => {
        return (
          <React.Fragment key={index}>
            {product?.data?.length > 0 && <p className="p-2 font-bold">{product.problems}</p>}
            <div className="flex items-center overflow-x-scroll mb-3 mt-3">
              {product.data?.map((productDetails: any) => (
                <div key={productDetails.productId} className="p-2 bg-white ml-2 mb-2 h-full rounded-sm py-3 shrink-0 w-5/12">
                  <ProductCard
                    productDetails={productDetails}
                    handleAddToBag={handleAddToBag}
                    offlineStoreName={offlineStoreName}
                  />
                </div>
              ))}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const ProductCard = ({ productDetails, handleAddToBag, offlineStoreName }: any) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [showMiniPDPDetail, setShowMiniPDPDetail] = useState(false);
  const [activeProduct, setActiveProduct] = useState();

  return (
    <React.Fragment>
      <div
        onClick={() => {
          if (offlineStoreName) {
            router.push(`${productDetails.URL}?store=${offlineStoreName}`);
          } else {
            setActiveProduct(productDetails);
            setShowMiniPDPDetail(true);
          }
        }}
      >
        <div className="flex justify-center">
          <img src={productDetails.imageURL} className="w-24 h-28" />
        </div>
        <div className="border border-gray-200 font-semibold text-10  flex justify-between items-center rounded w-10 my-2 p-1 ">
          {productDetails?.rating?.avgRating?.toFixed(1)}

          <StarIcon width={10} height={10} className="-mt-0.5 ml-1" />
        </div>
        <h3 className="capitalize leading-tight text-xs  truncate  line-clamp-2 text-10">{productDetails.productTitle}</h3>
        <h3 className="text-xxs leading-tight text-xs  truncate  line-clamp-2  mt-1 text-gray-400">
          {productDetails.productSubtitle}
        </h3>
        <div className="flex flex-wrap items-center mt-2 mb-2">
          <p className="font-semibold mr-1.5 text-10">{formatPrice(productDetails.priceOffer, true)}</p>
          {productDetails.priceOffer !== productDetails.priceMRP && (
            // change text color text-gray-400 to text-gray-500 for sufficient color contrast
            <del className="text-xs text-gray-500 mr-2 text-10">{formatPrice(productDetails.priceMRP, true)}</del>
          )}
        </div>

        {offlineStoreName ? (
          <button
            onClick={e => {
              e.stopPropagation();
              router.push(`${productDetails.URL}?store=${offlineStoreName}`);
            }}
            className="bg-color1 w-full text-xxs rounded text-white font-semibold py-2"
          >
            {t("viewDetails")}
          </button>
        ) : (
          <div className="flex items-center mt-2">
            <div onClick={e => e.stopPropagation()}>
              <PLPWishlistButton
                product={productDetails}
                TLstyle={{
                  btn: "relative right-1 top-1 mx-1 px-1 rounded border border-gray-200",
                  svg: "h-7 w-5",
                }}
              />
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                handleAddToBag(productDetails);
              }}
              className="bg-color1 w-full text-xxs rounded text-white font-semibold py-2"
            >
              {t("addToBag")}
            </button>
          </div>
        )}
      </div>

      {activeProduct && (
        <CartMiniPDPDetails
          show={showMiniPDPDetail}
          mainProd={activeProduct}
          hide={() => {
            handleAddToBag(productDetails);
            setShowMiniPDPDetail(false);
          }}
          ctaTitle={t("viewDetails")}
        />
      )}
    </React.Fragment>
  );
};

const GetLayout = ({ children }: { children: ReactElement }) => {
  const offlineStoreName = isClient() ? sessionStorage.getItem(SESSIONSTORAGE.OFFLINE_STORE_NAME) : false;
  if (offlineStoreName) {
    return <OfflineStoreLayout>{children}</OfflineStoreLayout>;
  }
  return <Layout>{children}</Layout>;
};

ShowRecommendedProducts.getLayout = (children: ReactElement) => <GetLayout children={children} />;
export default ShowRecommendedProducts;
