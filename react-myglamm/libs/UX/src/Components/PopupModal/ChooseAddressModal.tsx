import React from "react";
import Link from "next/link";
import Router from "next/router";

import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";
import { useManageAddress } from "@libHooks/useManageAddress";

import { setLocalStorageValue } from "@libUtils/localStorage";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { GiEnvelopeIco, GiPhoneIco } from "@libComponents/GlammIcons";

import { getFormattedAddress } from "@checkoutLib/Payment/HelperFunc";

import { ValtioStore } from "@typesLib/ValtioStore";
import { UserAddress } from "@typesLib/Consumer";

import PopupModal from "./PopupModal";

import DownArrow from "../../../public/svg/down-arrow.svg";

interface AddressModal {
  show: boolean;
  hide: () => void;
}

const ChooseAddressModal = ({ show, hide }: AddressModal) => {
  const { t } = useTranslation();

  const { ref, storeShippingAddress } = useManageAddress();

  const { shippingAddress, userAddress } = useSelector((store: ValtioStore) => store.userReducer);

  /* Shipping Address(Selected) should be at the top of the List with other Addresses */
  const addressList: Array<UserAddress> = [
    shippingAddress as UserAddress,
    ...userAddress.filter(x => x.id !== shippingAddress?.id),
  ];

  const handleAddressSelect = (address: UserAddress) => {
    storeShippingAddress(address);
    hide();
  };

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section className="p-4 rounded-t-lg">
        <div className="flex justify-between items-center pb-4">
          <p className="text-lg font-semibold">{t("selectAnAddress") || "Select an Address"}</p>

          <DownArrow onClick={hide} role="img" aria-labelledby="select a delivery address" />
        </div>

        {/* List of User Saved Addresses */}
        <div className="overflow-y-auto overflow-x-hidden h-72 w-full relative mb-2">
          {addressList.length > 0 ? (
            addressList.map((address, index) => (
              <button
                type="button"
                key={address.id}
                className="pb-4 text-sm text-left"
                onClick={() => handleAddressSelect(address)}
                ref={addressList.length - 5 === index ? ref : null}
              >
                <div className="flex items-center pb-2">
                  <h5 className="font-semibold">{address.name}</h5>

                  {address.defaultFlag === "true" && <span className="text-xs text-color1 font-semibold ml-4">Default</span>}
                  {address.id === shippingAddress?.id && (
                    <span className="text-xs ml-4 p-1 px-2 bg-gray-200 rounded">
                      {t("selectedAddress") || "Selected Address"}
                    </span>
                  )}
                </div>

                <p className="mb-3 w-4/5" dangerouslySetInnerHTML={{ __html: getFormattedAddress(address) }} />

                <div className="flex items-center mb-1">
                  <GiPhoneIco
                    name="phone-ico"
                    width="25"
                    height="19"
                    viewBox="10 400 1000 50"
                    fill="#000000"
                    role="img"
                    aria-labelledby="phone"
                  />
                  <p>{address.phoneNumber}</p>
                </div>
                <div className="flex items-center mb-1">
                  <GiEnvelopeIco
                    name="envelope-ico"
                    width="25"
                    height="19"
                    viewBox="10 400 1000 50"
                    fill="#000"
                    role="img"
                    aria-labelledby="email"
                  />
                  <p>{address.email}</p>
                </div>
              </button>
            ))
          ) : (
            <LoadSpinner className="w-12 absolute inset-0 m-auto" />
          )}
        </div>
      </section>

      {/* Redirection to Add Address Page */}
      <Link
        href="/addAddress"
        role="presentation"
        className="flex items-center font-semibold text-lg text-color1 capitalize shadow-checkout bg-white p-3"
        onClick={() =>
          setLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM, Router.pathname === "/shopping-bag" ? "shopping-bag" : "payment")
        }
        aria-label={t("addNew")?.toLowerCase()}
      >
        <span className="mr-6">&#65291;</span>
        {t("addNew")?.toLowerCase()}
      </Link>
    </PopupModal>
  );
};

export default ChooseAddressModal;
