import React, { ReactElement, useState } from "react";
import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";
import { useManageAddress } from "@libHooks/useManageAddress";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { setLocalStorageValue, removeLocalStorageValue } from "@libUtils/localStorage";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import CustomLayout from "@libLayouts/CustomLayout";

import { getFormattedAddress } from "@checkoutLib/Payment/HelperFunc";
import { formatPlusCode } from "@libUtils/format/formatPlusCode";

function ChooseAddress() {
  const [loader, setLoader] = useState(false);

  const { ref, userAddress, getAddresses, handleDeleteAddress } = useManageAddress();

  const { t } = useTranslation();

  /**
   * Delete / Make Default Address Based on the EDIT object recieved as param
   */
  const editAddress = async (id: string) => {
    try {
      setLoader(true);
      const currentAddress = userAddress.find(address => address.id === id);

      if (currentAddress) {
        const consumerApi = new ConsumerAPI();
        await consumerApi.editAddress({ ...currentAddress, defaultFlag: "true" });

        await getAddresses(true);

        setLoader(false);
      }
    } catch (error: any) {
      setLoader(false);
      console.error(error);
    }
  };

  return (
    <main className="mb-2">
      {/* WRAPPER DIV FOR BODY BACKGROUND COLOR */}
      <div className="font-semibold p-3 relative bg-white shadow-sm">
        <Link
          href="/addAddress"
          role="presentation"
          className="flex items-center text-color1"
          onClick={() => setLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM, "chooseAddress")}
          aria-label={t("addNew")}
        >
          <span className="mr-6 text-xl">&#65291;</span>
          {t("addNew")}
        </Link>
      </div>

      <h1 className="mt-3 px-2 text-sm text-gray-400">{t("savedAddresses")}</h1>

      {/* ADDRESS LISTING - LAZY LOAD */}
      {loader || userAddress.length === 0 ? (
        <LoadSpinner className="m-auto h-96 w-16" />
      ) : (
        userAddress.map((address, index) => (
          <div key={address.id} className="p-4 my-2 bg-white relative" ref={userAddress.length - 5 === index ? ref : null}>
            <div className="pr-6">
              <h3 className="address-head pos-rel capitalize text-lg font-semibold">
                {address.name}
                {address.defaultFlag === "true" && (
                  <span className="text-sm mx-4 p-1 px-2 bg-gray-200 rounded">{t("defaultAddress") || "Default Address"}</span>
                )}
              </h3>

              <p className="text-gray-800 my-2" dangerouslySetInnerHTML={{ __html: getFormattedAddress(address) }} />
              <p className="flex items-center mt-1 text-gray-800 text-sm">
                <bdi>
                  {formatPlusCode(address.countryCode || "91")}&nbsp;{address.phoneNumber}
                </bdi>
              </p>
              <p className="flex items-center mt-1 text-gray-800 text-sm">{address.email}</p>
            </div>

            <div className="outline-none mt-2 flex justify-between items-center">
              <div className="w-1/2">
                <Link
                  href={`/editAddress/${address.id}`}
                  className="outline-none font-bold text-color1"
                  onClick={() => setLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM, "chooseAddress")}
                  aria-label={t("editAddress") || "Edit"}
                >
                  {t("editAddress") || "Edit"}
                </Link>
                {userAddress.length > 1 && (
                  <button
                    type="button"
                    className="outline-none font-bold my-1 ml-4 text-color1"
                    aria-label="Delete Button"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    {t("delete")}
                  </button>
                )}
              </div>

              {address.defaultFlag !== "true" && (
                <button
                  type="button"
                  aria-label="Delete Button"
                  onClick={() => editAddress(address.id)}
                  className="outline-none font-bold my-1 py-1 px-2 rounded-md text-color1 bg-color2 shadow"
                >
                  {t("setDefaultAddress")}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </main>
  );
}

ChooseAddress.getLayout = (page: ReactElement) => <CustomLayout header="chooseAddress">{page}</CustomLayout>;

export default ChooseAddress;
