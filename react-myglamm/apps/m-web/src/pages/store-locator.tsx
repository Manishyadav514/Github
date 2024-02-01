import React, { Fragment, useState, useEffect, useRef } from "react";

import ConstantAPI from "@libAPI/apis/ConstantsAPI";

import { ADOBE } from "@libConstants/Analytics.constant";

import useTranslation from "@libHooks/useTranslation";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

const StoreLocator = () => {
  const [city, setCity] = useState<any>();
  const [address, bindAddress] = useState<any>();
  const [cityHead, setCityHead] = useState("");
  const addRef = useRef<null | HTMLUListElement>(null);

  const { t } = useTranslation();

  const constant = new ConstantAPI();
  useEffect(() => {
    constant.getstoreLocator().then(data => setCity(data.data.data));
  }, []);

  const filterStore = (e: any) => {
    const city_name = e.target.value;
    setCityHead(city_name);
    constant.getFilterStoreLocator(city_name).then(data => {
      bindAddress(data.data.data);
    });
  };

  useEffect(() => {
    const digitalData = {
      common: {
        assetType: ADOBE.ASSET_TYPE.STORE_LOCATOR,
        newAssetType: ADOBE.ASSET_TYPE.STORE_LOCATOR,
        newPageName: ADOBE.ASSET_TYPE.STORE_LOCATOR,
        pageLocation: "",
        pageName: "web|hamburger|store locator",
        platform: ADOBE.PLATFORM,
        subSection: ADOBE.ASSET_TYPE.STORE_LOCATOR,
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = digitalData;
  }, []);

  return (
    <Fragment>
      <div className="w-full relative">
        <div className="absolute bg-black opacity-50 w-full h-64 z-10" />
        <img
          src="https://files.myglamm.com/site-images/original/storelocator-mobile.jpg"
          className="relative h-64"
          alt={t("storeLocator")}
        />
        <div className="searchMain absolute float-none w-full z-10 my-0 mx-auto left-0" style={{ top: "40%" }}>
          <h1 className="text-center text-white font-bold" style={{ fontSize: "24px" }}>
            {t("locateStore")}
          </h1>
          <div className="searchBox w-full flex justify-center mt-3">
            <select
              onChange={filterStore}
              className="py-0 px-4 text-xl h-10 bg-white rounded outline-none"
              style={{
                width: "96%",
              }}
            >
              <option value="" disabled selected>
                {t("selectHere")}
              </option>
              {city?.map((c: any) => (
                <option key={c._id} value={c.cityName}>
                  {c.cityName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="p-0">
        <div className="col-md-12 col-sm-12 col-xs-12 mt-4">
          <img
            className=""
            src="https://files.myglamm.com/site-images/original/return-reward-mobilebanner.jpg"
            alt={t("storeLocator")}
          />
        </div>
      </div>
      <div className="mt-2 p-0">
        <div className="w-full bg-white">
          <div className="col-md-12 mob-no-padder">
            <h3 className="text-center text-black uppercase font-bold text-2xl pt-3 pb-3">{cityHead}</h3>
          </div>
          <ul className="list-none p-0" id="addressList" ref={addRef}>
            {address?.map((add: any) => (
              <li className="border-b-2 border-gray-200 w-full" key={add.storeId}>
                <div className="py-6 px-3">
                  <span className="text-black text-base block text-base font-bold">{add.storeName}</span>
                  <p className="mb-2 text-sm">{add.storeAddress.address}</p>
                  {/* <a
                        target="_blank"
                        className="text-sm text-red-400"
                        rel="noopener noreferrer"
                        href={`https://www.google.com/maps/@${add.latitude},${add.longitude},17.25z`}
                      >
                        Driving Directions &amp; Map
                      </a> */}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default StoreLocator;
