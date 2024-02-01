import React, { useState, ReactElement } from "react";

import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import { useManageAddress } from "@libHooks/useManageAddress";
import useAttachCountryAddressFilter from "@libHooks/useAttachCountryAddressFilter";

import { UserAddress } from "@typesLib/Consumer";
import { DutyModalProps } from "@typesLib/Payment";
import { ValtioStore } from "@typesLib/ValtioStore";

import { USER_REDUCER } from "@libStore/valtio/REDUX.store";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import { formatPlusCode } from "@libUtils/format/formatPlusCode";

import { getSelectAddressBreadcrumb } from "@checkoutLib/Address/Helperfunc";
import { adobeAddressSelectedClick } from "@checkoutLib/Address/AnalyticsHelperFunc";
import { checkDutyChanges, getFormattedAddress } from "@checkoutLib/Payment/HelperFunc";

import Breadcrumbs from "../Components/breadcrumb";
import LowerFunnelLayout from "../Components/layout/LowerFunnelLayout";

import PencilIcon from "../../../UX/public/svg/edit.svg";

const AddressModal = dynamic(() => import("../Components/Popupmodals/addressModal"), { ssr: false });

const DutyChargesModalWeb = dynamic(() => import("../Components/Popupmodals/DutyChargesModalWeb"), { ssr: false });

const SelectAddress = () => {
  const router = useRouter();
  const { t } = useTranslation();

  useManageAddress();
  useAttachCountryAddressFilter();

  const { userAddress, userCart } = useSelector((store: ValtioStore) => ({
    userAddress: store.userReducer.userAddress,
    userCart: store.cartReducer.cart,
  }));

  const [loader, setLoader] = useState(false);

  const [modalPopup, setModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<UserAddress>();

  const [showDutyModal, setShowDutyModal] = useState(false);
  const [dutyData, setDutyData] = useState<DutyModalProps>();

  const handleselctedAddress = async (addressData: UserAddress) => {
    adobeAddressSelectedClick();

    /* Showing Duty Modal in case of duty changes for Middle-East Countries */
    if (addressData.uiTemplate === "template_are") {
      setLoader(true);
      const dutyInfo = await checkDutyChanges(userCart?.totalDutyCharges, addressData);

      setLoader(false);
      if (dutyInfo) {
        setShowDutyModal(true);
        setDutyData(dutyInfo);
        return;
      }
    }

    USER_REDUCER.shippingAddress = addressData;

    router.push("/checkout");
  };

  const handleEdit = (addressData: UserAddress) => {
    setModal(true);
    setShippingAddress(addressData);
  };

  return (
    <main className="bg-white">
      <Head>
        <title>{t("selectAddress")}</title>
        <meta property="og:title" content={t("selectAddress")} />
      </Head>

      {/* Breadcrumbs */}
      <div className="max-w-screen-xl mx-auto pb-6">
        <Breadcrumbs navData={getSelectAddressBreadcrumb()} />

        <div className="relative rounded p-5 mt-6 min-h-" style={{ boxShadow: "0 0 4px 0 rgba(0,0,0,.25)" }}>
          {(loader || userAddress?.length < 1) && <LoadSpinner className="w-20 inset-0 m-auto absolute" />}

          <h4 className="text-center uppercase font-bold">{t("chooseAddress")}</h4>
          <GoodGlammSlider slidesPerView={3} arrowClass={{ left: "-left-10", right: "-right-10" }}>
            {userAddress?.map(addressData => {
              const selected = addressData.id === shippingAddress?.id;

              return (
                <div className="px-4" key={addressData.id}>
                  <div key={addressData.id} className="shadow p-5 border rounded-sm">
                    <div className="flex w-full pb-2 border-b mb-8 justify-between items-center">
                      <h3 className="flex items-center font-bold text-base mt-1 justify-between">
                        {addressData.addressNickName}{" "}
                        {addressData.defaultFlag === "true" && (
                          <img
                            alt="Tick Icon"
                            className="ml-2.5"
                            src="https://files.myglamm.com/site-images/original/addressDefaultIcon.png"
                          />
                        )}
                      </h3>

                      <PencilIcon onClick={() => handleEdit(addressData)} className="cursor-pointer" />
                    </div>

                    <h5 className="font-semibold text-sm mb-3">{addressData?.name}</h5>

                    <address
                      className="h-16 text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: getFormattedAddress(addressData) }}
                    />

                    <div className="flex mb-2 items-center">
                      <img
                        width={17}
                        alt="phone"
                        height={17}
                        src="https://files.myglamm.com/site-images/original/icons8-call-24.png"
                      />

                      <span className="pl-2">
                        <bdi>
                          {formatPlusCode(addressData.countryCode || "91")}
                          &nbsp;{addressData.phoneNumber}
                        </bdi>
                      </span>
                    </div>
                    <div className="flex mb-2 items-center">
                      <img
                        width={18}
                        alt="email"
                        height={18}
                        src="https://files.myglamm.com/site-images/original/icons8-email-64.png"
                      />
                      <span className="pl-2">{addressData.email}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleselctedAddress(addressData)}
                      className="text-color1 border border-solid border-color1 w-full rounded h-10 uppercase font-semibold tracking-wider text-sm hover:text-white hover:bg-color1"
                    >
                      {selected ? t("selected") || "selected" : t("select") || "select"}
                    </button>
                  </div>
                </div>
              );
            })}
          </GoodGlammSlider>

          <div className="flex justify-between items-center px-16 pt-4">
            <Link
              type="button"
              href="/add-shipping-address"
              onClick={() => router.push("/add-shipping-address")}
              className="bg-ctaImg h-12 uppercase font-semibold text-white rounded-sm px-6 flex items-center justify-center hover:text-white"
            >
              {t("addNew")}
            </Link>

            <button
              type="button"
              onClick={() => router.back()}
              className="h-12 border border-solid border-color1 w-28 text-color1 rounded-sm"
            >
              {t("back")}
            </button>
          </div>
        </div>
      </div>

      {/* Duty Charges Popup */}
      {dutyData && <DutyChargesModalWeb show={showDutyModal} hide={() => setShowDutyModal(false)} dutyData={dutyData} />}

      {/* Edit Address Modal */}
      <AddressModal
        show={modalPopup}
        hide={() => {
          setModal(false);
          setShippingAddress(undefined);
        }}
        selectedAddress={shippingAddress}
      />
    </main>
  );
};

SelectAddress.getLayout = (page: ReactElement) => <LowerFunnelLayout>{page}</LowerFunnelLayout>;

export default SelectAddress;
