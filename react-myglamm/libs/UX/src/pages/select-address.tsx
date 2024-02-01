import React, { ReactElement, useEffect, useState } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import Router from "next/router";
import Head from "next/head";
import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";
import { useManageAddress } from "@libHooks/useManageAddress";
import useAttachCountryAddressFilter from "@libHooks/useAttachCountryAddressFilter";

import CustomLayout from "@libLayouts/CustomLayout";

import { useFetchCart } from "@libHooks/useFetchCart";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import DutyChargesModal from "@libComponents/PopupModal/DutyChargesModal";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { GA4Event } from "@libUtils/analytics/gtm";
import { getCurrency } from "@libUtils/format/formatPrice";
import { setLocalStorageValue } from "@libUtils/localStorage";
import { formatPlusCode } from "@libUtils/format/formatPlusCode";

import { ValtioStore } from "@typesLib/ValtioStore";
import { UserAddress } from "@typesLib/Consumer";
import { DutyModalProps } from "@typesLib/Payment";

import { checkDutyChanges, getFormattedAddress } from "@checkoutLib/Payment/HelperFunc";

const SelectAddress = () => {
  useFetchCart();
  useAttachCountryAddressFilter();

  const { t } = useTranslation();

  const { userAddress, ref, handleDeleteAddress, storeShippingAddress } = useManageAddress();

  const cart = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const [loader, setLoader] = useState(false);
  const [showDutyModal, setShowDutyModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress>(userAddress?.[0]);

  const [dutyData, setDutyData] = useState<DutyModalProps>();

  /* Check For Duty Chnages and if nothing then proceed to payment page */
  const handleProceed = async () => {
    if (selectedAddress) {
      setLoader(true);

      let dutyChange;
      // only check in case of ARE
      if (selectedAddress.uiTemplate === "template_are") {
        dutyChange = await checkDutyChanges(cart.totalDutyCharges, selectedAddress);
      }

      if (dutyChange) {
        setShowDutyModal(true);
        setDutyData(dutyChange);
      } else {
        storeShippingAddress(selectedAddress);
        GA4Event([
          {
            event: "add_shipping_info",
            ecommerce: {
              currency: getCurrency(),
              value: cart?.netAmount,
              coupon: cart?.couponData?.couponCode,
              items: cart?.allProducts.map((p: any) => {
                return {
                  item_id: p.sku,
                  item_name: p.name,
                  price: p.price,
                  quantity: p.quantity,
                };
              }),
            },
          },
        ]);
        Router.push("/payment");
      }
    }
  };

  useEffect(() => {
    if (userAddress?.[0]) setSelectedAddress(userAddress?.[0]);
  }, [userAddress]);

  return (
    <main className="pb-16">
      <Head>
        <title>{t("selectAddress")}</title>
      </Head>

      {userAddress?.length > 0 ? (
        <>
          {userAddress.map((address, index) => (
            <section
              key={address.id}
              className="pl-4 pr-6 py-4 mt-3 flex"
              onClick={() => setSelectedAddress(address)}
              ref={userAddress.length - 5 === index ? ref : null}
            >
              <div className="border border-color1 rounded-full w-5 h-5 flex items-center justify-center mt-1 shrink-0">
                {selectedAddress?.id === address.id && <div className="h-3 w-3 rounded-3 bg-color1 rounded-full" />}
              </div>

              <div className="grow pl-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center font-semibold">
                    <p className="flex">{address.name}</p>
                    <span className="text-10 text-color1 bg-color2 rounded ml-3 px-1">
                      {t(address.addressNickName?.toLocaleLowerCase()) || address.addressNickName}
                    </span>
                  </div>
                  {address.defaultFlag === "true" && (
                    <span className="text-10 px-1.5 rounded bg-themeGray text-gray-600">
                      {t("defaultAddress") || "Default Address"}
                    </span>
                  )}
                </div>

                <address className="text-xs pt-3 pb-5 text-gray-500">{getFormattedAddress(address)}</address>

                <p className="text-xs pb-5 text-gray-500">
                  <bdi>
                    {formatPlusCode(address.countryCode)}&nbsp;{address.phoneNumber}
                  </bdi>
                </p>

                <div className="flex text-xs text-color1 font-semibold">
                  <Link
                    href={`/editAddress/${address.id}`}
                    onClick={e => {
                      e.stopPropagation();
                      setLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM, "select-address");
                    }}
                    aria-label={t("edit") || "Edit"}
                  >
                    {t("edit") || "Edit"}
                  </Link>

                  <button
                    type="button"
                    className="ml-8 font-semibold"
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteAddress(address.id);
                    }}
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </section>
          ))}

          <section className="p-2 mt-4" style={{ boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.188689)" }}>
            <Link
              href="/addAddress"
              prefetch={false}
              onClick={() => setLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM, "payment")}
              className="text-color1 border border-color1 rounded text-sm h-10 font-semibold uppercase w-full flex items-center justify-center tracking-wide"
              aria-label={t("addNew") || "add new address"}
            >
              <span className="text-2xl font-normal mr-1.5">&#x2B;</span>
              {t("addNew") || "add new address"}
            </Link>
          </section>

          <div className="p-2 fixed bottom-0 inset-x-0 bg-white" style={{ boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.188689)" }}>
            <button
              type="button"
              disabled={loader}
              onClick={handleProceed}
              className="w-full text-sm tracking-wide rounded flex items-center justify-center h-10 bg-color1 text-white font-semibold uppercase relative"
            >
              {loader ? <LoadSpinner className="w-8 absolute inset-0 m-auto" /> : t("proceed") || "proceed"}
            </button>
          </div>

          {dutyData && (
            <DutyChargesModal
              show={showDutyModal}
              dutyData={dutyData}
              hide={() => {
                setShowDutyModal(false);
                setLoader(false);
              }}
            />
          )}
        </>
      ) : (
        <div className="h-screen w-screen">
          <LoadSpinner />
        </div>
      )}
    </main>
  );
};

SelectAddress.getLayout = (page: ReactElement) => (
  <CustomLayout fallback="Select Address" header="selectAddress">
    {page}
  </CustomLayout>
);

export default SelectAddress;
