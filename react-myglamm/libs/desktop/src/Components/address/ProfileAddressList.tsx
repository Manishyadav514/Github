import React, { Fragment, useState } from "react";
import dynamic from "next/dynamic";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";
import { useManageAddress } from "@libHooks/useManageAddress";

import { UserAddress } from "@typesLib/Consumer";
import { ValtioStore } from "@typesLib/ValtioStore";

import { getFormattedAddress } from "@checkoutLib/Payment/HelperFunc";

const AddressModal = dynamic(() => import("../Popupmodals/addressModal"), { ssr: false });

const ProfileAddressList = () => {
  const { t } = useTranslation();

  useManageAddress();

  const { userAddress } = useSelector((store: ValtioStore) => store.userReducer);

  const [showAddressModal, setShowAddressModal] = useState<boolean | undefined>();
  const [editAddress, setEditAddress] = useState<UserAddress>();

  return (
    <Fragment>
      <section className="grid grid-cols-2 gap-4">
        {userAddress?.map(address => (
          <div className="p-4 relative rounded bg-white" style={{ boxShadow: "0 0 4px 0 rgba(0,0,0,.19)" }}>
            {address.defaultFlag === "true" && (
              <img
                width={24}
                height={24}
                className="absolute left-5 top-4"
                src="https://files.myglamm.com/site-images/original/check-mark.png"
              />
            )}
            <h3 className="text-18 uppercase text-center">{address.addressNickName}</h3>
            <h5 className="mb-2 mt-2.5 text-18">{address.name}</h5>

            <address
              className="text-sm mb-5 h-20 line-clamp-4"
              dangerouslySetInnerHTML={{ __html: getFormattedAddress(address) }}
            />

            <div className="text-sm mt-1 mb-6">
              <span>{address.phoneNumber}</span>
              <span className="px-2">|</span>
              <span>{address.email}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditAddress(address);
                setShowAddressModal(true);
              }}
              className="bg-ctaImg text-sm text-white rounded-sm font-bold h-10 w-28"
            >
              {t("editAddress")}
            </button>
          </div>
        ))}

        <div
          onClick={() => setShowAddressModal(true)}
          style={{ height: "288px", boxShadow: "0 0 4px 0 rgba(0,0,0,.19)" }}
          className="flex items-center justify-center rounded bg-white cursor-pointer"
        >
          <div>
            <p className="text-center text-3xl">+</p>
            <p className="font-bold text-18 uppercase">{t("addNewAddress")}</p>
          </div>
        </div>
      </section>

      {typeof showAddressModal === "boolean" && (
        <AddressModal
          show={showAddressModal}
          hide={() => {
            setShowAddressModal(false);
            setEditAddress(undefined);
          }}
          selectedAddress={editAddress}
        />
      )}
    </Fragment>
  );
};

export default ProfileAddressList;
