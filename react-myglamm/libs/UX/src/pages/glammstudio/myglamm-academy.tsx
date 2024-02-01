import React, { useState, useEffect } from "react";
import Link from "next/link";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { SLUG } from "@libConstants/Slug.constant";
import { ADOBE } from "@libConstants/Analytics.constant";

import WidgetAPI from "@libAPI/apis/WidgetAPI";
import useWebp from "@libHooks/useWebPP";

import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

function MyglammAcademy() {
  const [loading, setLoading] = useState(true);

  const [banners, setBanners] = useState<any>();

  const { WebPImage } = useWebp();

  useEffect(() => {
    const widgetApi = new WidgetAPI();
    widgetApi
      .getWidgets({
        where: {
          slugOrId: SLUG().MYGLAMM_ACADEMY_LANDING,
        },
      })
      .then(({ data }) => {
        if (data?.data?.data?.widget?.length > 0) {
          setBanners(data.data.data.widget[0]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  // #region // Adobe Analytics[53]-Page Load-Glamm Academy Home Page
  useEffect(() => {
    const digitalData = {
      common: {
        pageName: "web|glammstudio|glammacademy",
        newPageName: "glammacademy",
        subSection: "glammacademy",
        assetType: "glammstudio",
        newAssetType: "content",
        platform: ADOBE.PLATFORM,
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = digitalData;
  }, []);
  // #endregion

  if (loading) {
    return (
      <div className="min-h-screen relative flex justify-center items-center">
        <LoadSpinner />
      </div>
    );
  }

  if (banners.multimediaDetails.length === 0) {
    return null;
  }
  return (
    <section className="py-3">
      <h1 className="text-center uppercase" style={{ fontSize: "20px" }}>
        {banners?.label}
      </h1>
      <div className="px-3">
        {banners?.multimediaDetails?.map((banner: any) => (
          <div className="my-3" key={banner.targetLink}>
            <Link href={banner.targetLink} aria-label={banner.headerText}>
              <WebPImage width={351} height={161} className="rounded" src={banner.assetDetails.url} alt={banner.headerText} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MyglammAcademy;
