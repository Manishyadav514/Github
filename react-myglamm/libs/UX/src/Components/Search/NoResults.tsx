import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useTranslation from "@libHooks/useTranslation";
import { useSnapshot } from "valtio";
import SearchLabel from "./SearchLabel";
import { SEARCH_STATE } from "@libStore/valtio/SEARCH.store";
import { SLUG } from "@libConstants/Slug.constant";
import { ADOBE } from "@libConstants/Analytics.constant";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { formatPrice } from "@libUtils/format/formatPrice";
import Adobe from "@libUtils/analytics/adobe";
import Image from "next/image";

// No results section
const NoResults = () => {
  const { t } = useTranslation();
  const snap = useSnapshot(SEARCH_STATE);
  const router = useRouter();

  useEffect(() => {
    if (!snap.noResults.banner?.assetDetails?.url) {
      getWidgetsHttp(SLUG().NO_SEARCH_EN);
    }
  }, []);

  const getWidgetsHttp = (slug: any) => {
    const widgetApi = new WidgetAPI();
    widgetApi
      .getWidgets({
        where: {
          slugOrId: slug,
        },
      })
      .then((res: any) => {
        SEARCH_STATE.noResults.banner = res?.data?.data?.data?.widget[0].multimediaDetails[0];
        SEARCH_STATE.noResults.products = Object.values(
          res?.data?.data?.data?.widget[1].commonDetails.descriptionData[0].relationalData.products || {}
        );
      })
      .catch((error: any) => console.error(error.message));
  };

  // Adobe Analytics[33] - Page Load - No Search Result
  useEffect(() => {
    (window as any).digitalData = {
      common: {
        pageName: "web|search|search suggestion|no results found",
        newPageName: "No results found",
        subSection: "search",
        assetType: "search",
        newAssetType: "search",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      search: {
        searchTerm: snap.input.value,
        searchResult: `product-${0}`,
        searchType: SEARCH_STATE.searchType,
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.PageLoad();
  }, []);

  return (
    <div className="bg-white pt-8">
      <div className="no-results-above-fold text-center text-black mb-7">
        <div className="mx-auto flex place-content-center">
          <Image
            className="mx-auto"
            alt="no-result-found"
            src={t("searchConfig")?.noResultImage || "https://files.myglamm.com/site-images/original/no-results-found.png"}
            title="no-result-found"
            height={100}
            width={100}
          />
        </div>
        <h1 className="font-semibold">
          {t("noResultsearch")} &quot;{snap.input.value}&quot;
        </h1>
        <h6 className="text-13">{t("tryAnotherSearch")}</h6>
      </div>
      {snap.noResults.banner?.assetDetails?.url && (
        <button
          type="button"
          className="lipstick-banner w-full pb-8"
          onClick={() => {
            router.push(
              `${
                snap.noResults.banner?.targetLink
              }?icid = search_empty search page_small - banner_${snap.noResults.banner?.headerText.toLowerCase()}_1_${snap.noResults.banner?.headerText.toLowerCase()} _1`
            );
          }}
        >
          <ImageComponent
            className="img-responsive w-full"
            src={snap.noResults.banner?.assetDetails?.url}
            alt={snap.noResults.banner?.assetDetails?.name}
          />
        </button>
      )}

      {/* RECOMMENDED PRODUCTS */}
      {snap.noResults.products?.length > 0 && (
        <section>
          <div className="bestsellers px-5 pb-8">
            <SearchLabel label="Recommended Products" />
            <div dir="ltr" className="overflow-x-auto flex list-none">
              {snap.noResults.products.map((product: any, index: number) => (
                <React.Fragment key={product.id}>
                  <Link
                    href={`${
                      product.urlManager?.url
                    }?icid = search_empty search page_multiple - collection - carousel_recommended products_1_${product.cms[0]?.content.name.toLowerCase()}_${
                      index + 1
                    } `}
                    prefetch={false}
                    aria-hidden
                    aria-label={product.cms[0]?.content.name}
                  >
                    <div className="w-36 h-48 rounded-md bg-white p-2 mr-3.5  border gray-200 shadow-sm">
                      <div className="flex justify-center">
                        <ImageComponent
                          className="img-responsive text-center w-24 h-24"
                          src={product?.assets[0]?.imageUrl?.["400x400"]}
                          alt={product?.assets[0]?.name}
                        />
                      </div>
                      <h2 className="text-xs font-bold mt-2 mb-0.5 truncate">{product.cms[0]?.content.name}</h2>
                      <h3 className="text-xs truncate mb-3 text-gray-600">{product?.cms[0]?.content?.subtitle}</h3>
                      <span className="text-lg mr-1">{formatPrice(product.offerPrice, true)}</span>

                      {product.offerPrice < product.price && (
                        <del className="text-base opacity-50 ml-1">{formatPrice(product.price, true)}</del>
                      )}
                    </div>
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
      )}
      <div className="text-center pb-8">
        <Link
          href={t("viewAllUrl") || "/buy/brands"}
          prefetch={false}
          aria-hidden
          className="text-sm rounded-3xl py-4 px-6 bg-color2"
          aria-label={t("viewAllProducts")}
        >
          {t("viewAllProducts")}
        </Link>
      </div>
    </div>
  );
};

export default NoResults;
