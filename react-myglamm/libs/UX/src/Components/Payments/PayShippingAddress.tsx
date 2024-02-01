import React, { Fragment, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Router, { useRouter } from "next/router";

import { useSelector } from "@libHooks/useValtioSelector";

import useTranslation from "@libHooks/useTranslation";

import { GiEnvelopeIco, GiPhoneIco } from "@libComponents/GlammIcons";

import { getFormattedAddress } from "@checkoutLib/Payment/HelperFunc";

import ExpectedDelivery from "./ExpectedDelivery";

import { GAAddressSet } from "@libUtils/analytics/gtm";
import { setLocalStorageValue } from "@libUtils/localStorage";

import { ValtioStore } from "@typesLib/ValtioStore";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import EditIcon from "../../../public/svg/edit.svg";
import AddressIcon from "../../../public/svg/address.svg";
import ServiceableIcon from "../../../public/svg/serviceable-ico.svg";
import format from "date-fns/format";
import hi from "date-fns/locale/hi";
import clsx from "clsx";

const ChooseAddressModal = dynamic(
  () => import(/* webpackChunkName: "ChooseAddressModal" */ "@libComponents/PopupModal/ChooseAddressModal"),
  { ssr: false }
);

const PayShippingAddress = ({ showExpectedDeliveryStrip = true, displayExpectedDelivery = true }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();

  const [showFullAddress, setShowFullAddress] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean | undefined>();

  const { isPincodeServiceable, userCart, shippingAddress } = useSelector((store: ValtioStore) => ({
    userCart: store.cartReducer.cart,
    isPincodeServiceable: store.userReducer.isPincodeServiceable,
    shippingAddress: store.userReducer.shippingAddress,
  }));

  const handleChangeAddress = (e: any) => {
    e.stopPropagation();

    if (shippingAddress?.uiTemplate === "template_are") {
      setLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM, "payment");
      Router.push("/select-address");
    } else {
      setShowAddressModal(true);
    }
  };

  useEffect(() => {
    shippingAddress && GAAddressSet(userCart);
  }, [shippingAddress]);

  /* Render Only When ShippingAddress is Present */
  if (shippingAddress) {
    return (
      <section
        className={clsx(
          "shadow-checkout mb-2 rounded",
          !isPincodeServiceable ? "bg-color2 border border-red-600 " : "bg-white"
        )}
      >
        <div
          role="presentation"
          className={clsx(" py-2", showExpectedDeliveryStrip ? "px-2" : "px-4")}
          onClick={() => setShowFullAddress(!showFullAddress)}
        >
          <div className="flex justify-between items-center w-full my-2">
            <p className="text-xs font-semibold capitalize">
              {t("shippingAddress")}: {""}
              {t(shippingAddress.addressNickName?.toLocaleLowerCase()) || shippingAddress.addressNickName || ""}
              {/* Show expected delivery date when strip is hidden */}
              {displayExpectedDelivery && (
                <span className="text-xxs bg-color2 p-1 text-black rounded-full ml-2">
                  {"Expected Delivery By "}
                  {format(userCart.expectedDeliveryDate, "dd MMM yyyy", {
                    locale: locale === "hi-in" ? hi : undefined,
                  })}
                </span>
              )}
            </p>

            {/**
             * Only Registered Users have "identifier" key in address and can have
             * change address option
             * INTIATE CHOOSE ADDRESS MODAL
             */}
            {shippingAddress.identifier && (
              <button type="button" onClick={handleChangeAddress} className="flex items-center text-color1 text-xs">
                {showExpectedDeliveryStrip && <EditIcon className="mr-1 w-3" id="noRotate" />}
                <span className="uppercase text-11">{t("change")}</span>
              </button>
            )}
          </div>

          <div className="flex items-start text-sm w-full">
            {/* FULL ADDRESS */}
            {showFullAddress ? (
              <div>
                <h5 className="font-semibold mb-1">{shippingAddress.name}</h5>
                <p className="mb-3" dangerouslySetInnerHTML={{ __html: getFormattedAddress(shippingAddress) }} />
                <div className="flex items-end mb-3">
                  <GiPhoneIco
                    name="phone-ico"
                    width="25"
                    height="19"
                    viewBox="10 400 1000 50"
                    fill="#000000"
                    role="img"
                    aria-labelledby="phone number"
                  />
                  <p>{shippingAddress.phoneNumber}</p>
                </div>
                <div className="flex items-end mb-2.5">
                  <GiEnvelopeIco
                    name="envelope-ico"
                    width="25"
                    height="19"
                    viewBox="10 400 1000 50"
                    fill="#000"
                    role="img"
                    aria-labelledby="email"
                  />
                  <p>{shippingAddress.email}</p>
                </div>
              </div>
            ) : (
              /* SHORT ADDRESS */
              <Fragment>
                <AddressIcon className="mr-2" role="img" aria-labelledby="address" />
                <p
                  className=" line-clamp-2 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: getFormattedAddress(shippingAddress) }}
                />
              </Fragment>
            )}
          </div>
        </div>

        {!isPincodeServiceable ? (
          <div className="flex items-center justify-content p-4">
            <ServiceableIcon />
            <p className="font-bold text-xs ml-2" style={{ color: "#e66060" }}>
              {t("pincodeServiceable") || "This address is currently not serviceable."}
            </p>
          </div>
        ) : (
          showExpectedDeliveryStrip && <ExpectedDelivery />
        )}

        {/* CHOOSE SHIPPING ADDRESS MODAL */}
        {typeof showAddressModal === "boolean" && (
          <ChooseAddressModal show={showAddressModal} hide={() => setShowAddressModal(false)} />
        )}
      </section>
    );
  }

  return null;
};

export default PayShippingAddress;
