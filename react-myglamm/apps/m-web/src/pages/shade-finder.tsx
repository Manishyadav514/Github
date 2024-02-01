import React, { useState, useEffect } from "react";

import ShadesGrid from "@components/Shades/ShadesGrid";
import ShadesDropdown from "@components/Shades/ShadesDropdown";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import Adobe from "@libUtils/analytics/adobe";
import { check_webp_feature } from "@libUtils/webp";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import { ADOBE } from "@libConstants/Analytics.constant";

import { NextImage } from "@libComponents/NextImage";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import ErrorComponent from "@libPages/_error";

import { ValtioStore } from "@typesLib/ValtioStore";

function FindYourLipstick({ lipsData: lipsProps, errorCode }: any) {
  const [disableImageComponent, setDisableImageComponent] = useState(false);
  useEffect(() => {
    check_webp_feature("lossy", (_: any, result: boolean) => {
      if (!result) {
        // only change set if webp is not supported to prevent component re-render
        setDisableImageComponent(true);
      }
    });
  }, []);
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  const lipsData = {
    data: lipsProps.data,
  };
  const [selectedColor, setSelectedColor] = useState<any>();
  const [selectedFinish, setFinish] = useState<any>();
  const [reset, setreset] = useState(false);
  const [dropDownA, setdropA] = useState(false);
  const [dropDownB, setdropB] = useState(false);
  const { t } = useTranslation();

  const getDropdownData = (event: any) => {
    const selectedFin = lipsData.data[1].finish.findIndex((obj: any) => obj.name === event.target.innerText);
    const selectedShade = lipsData.data.findIndex((obj: any) => obj.colour === event.target.innerText);
    if (selectedShade !== -1) {
      colorSelectedAdobeClickEvent(lipsData.data[selectedShade].colour.toLowerCase());
      setSelectedColor(selectedShade);
    }
    if (selectedFin !== -1) {
      setFinish(selectedFin);
    }
  };

  const handleReset = () => {
    setreset(false);
  };

  const handleDropDown = (event: any) => {
    if (event.target.dataset.value === t("selectColor")) {
      setdropA(!dropDownA);
      setdropB(false);
    } else if (event.target.dataset.value === t("selectFinish")) {
      setdropA(false);
      setdropB(!dropDownB);
    }
  };

  const closeDropDown = () => {
    setdropA(false);
    setdropB(false);
  };

  const resetFilters = () => {
    setSelectedColor(undefined);
    setFinish(undefined);
    setdropA(false);
    setdropB(false);
    setreset(true);
  };

  useEffect(() => {
    const digitalData = {
      common: {
        assetType: ADOBE.ASSET_TYPE.SHADE_FINDER,
        newAssetType: ADOBE.ASSET_TYPE.SHADE_FINDER,
        newPageName: ADOBE.ASSET_TYPE.SHADE_FINDER,
        pageLocation: "",
        pageName: "web|shade finder",
        platform: ADOBE.PLATFORM,
        subSection: ADOBE.ASSET_TYPE.SHADE_FINDER,
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = digitalData;
  }, []);

  const colorSelectedAdobeClickEvent = (colorName: string) => {
    (window as any).digitalData = {
      common: {
        assetType: ADOBE.ASSET_TYPE.SHADE_FINDER,
        ctaName: `shade: ${colorName}`,
        linkName: `web|shade finder|${colorName}`,
        linkPageName: "web|shade finder",
        newAssetType: ADOBE.ASSET_TYPE.SHADE_FINDER,
        newLinkPageName: ADOBE.ASSET_TYPE.SHADE_FINDER,
        pageLocation: "",
        platform: ADOBE.PLATFORM,
        subSection: ADOBE.ASSET_TYPE.SHADE_FINDER,
      },
      user: Adobe.getUserDetails(profile),
    };
    Adobe.Click();
  };

  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }

  return (
    <React.Fragment>
      <div className="pb-4">
        {!disableImageComponent ? (
          <NextImage
            priority
            width={720}
            height={410}
            alt="Shade Finder Lips Banner"
            src="https://files.myglamm.com/site-images/original/shadeFinder-banner.jpg"
          />
        ) : (
          <ImageComponent
            className="w-full h-full"
            src="https://files.myglamm.com/site-images/original/shadeFinder-banner.jpg"
            alt="Shade Finder Lips Banner"
          />
        )}
        <div className="mt-4 w-full flex px-2">
          <ShadesDropdown
            data={lipsData.data}
            defaultValue={t("selectColor")}
            getDropdownData={getDropdownData}
            reset={reset}
            handleReset={handleReset}
            dropDownA={dropDownA}
            dropDownB={dropDownB}
            handleDropDown={handleDropDown}
            closeDropDown={closeDropDown}
          />
          <ShadesDropdown
            data={lipsData.data[selectedColor || 0].finish}
            defaultValue={t("selectFinish")}
            getDropdownData={getDropdownData}
            reset={reset}
            handleReset={handleReset}
            dropDownA={dropDownA}
            dropDownB={dropDownB}
            handleDropDown={handleDropDown}
            closeDropDown={closeDropDown}
          />
        </div>
        <div className="mt-4 w-full flex justify-center">
          <button
            className="p-3 opacity-75 border-black border text-xs uppercase rounded font-semibold "
            onClick={resetFilters}
            style={{ outline: "none", borderRadius: "2px" }}
            type="button"
          >
            Reset Filters
          </button>
        </div>
      </div>
      <ShadesGrid lipsData={lipsData.data} color={selectedColor} finish={selectedFinish} />
    </React.Fragment>
  );
}

FindYourLipstick.getInitialProps = async () => {
  try {
    const widgetApi = new WidgetAPI();
    const { data } = await widgetApi.getLipStickShades();

    return {
      lipsData: data.data,
    };
  } catch (error: any) {
    return {
      errorCode: 404,
    };
  }
};

export default FindYourLipstick;
