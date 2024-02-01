import React from "react";

import Link from "next/link";
import { format } from "date-fns";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import { formatPlusCode } from "@libUtils/format/formatPlusCode";

import { getFormattedAddress } from "@checkoutLib/Payment/HelperFunc";

import TruckIcon from "../../../public/svg/truck.svg";

const ChkoutShippingAddress = () => {
  const { t } = useTranslation();

  const { shippingAddress } = useSelector((store: ValtioStore) => store.userReducer);
  const { expectedDeliveryDate } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  if (shippingAddress) {
    return (
      <div>
        <h6 className="font-bold uppercase border-b border-gray-300 mt-2.5 mb-5 pb-4">{t("shippingAddress")}</h6>

        <h5 className="font-semibold mb-2">{shippingAddress?.name}</h5>

        <address
          className="h-12 text-sm line-clamp-2"
          dangerouslySetInnerHTML={{ __html: getFormattedAddress(shippingAddress) }}
        />

        <div className="flex mb-2 items-center text-sm">
          <img width={17} alt="phone" height={17} src="https://files.myglamm.com/site-images/original/icons8-call-24.png" />

          <span className="pl-2">
            <bdi>
              {formatPlusCode(shippingAddress.countryCode || "91")}
              &nbsp;{shippingAddress.phoneNumber}
            </bdi>
          </span>
        </div>
        <div className="flex mb-4 items-center text-sm">
          <img width={18} alt="email" height={18} src="https://files.myglamm.com/site-images/original/icons8-email-64.png" />
          <span className="pl-2">{shippingAddress.email}</span>
        </div>

        <Link
          href="/select-address"
          className="flex uppercase justify-center items-center rounded-sm font-bold text-sm h-10 w-28 bg-ctaImg text-white mb-6"
        >
          {t("change")}
        </Link>

        <div className="flex items-center pb-4">
          <TruckIcon />

          <strong className="text-sm pl-2 pr-3">{t("expectedDeliveryDate")}</strong>
          <span className="">{format(new Date(expectedDeliveryDate), "d-MMM-yyyy")}</span>
        </div>
      </div>
    );
  }

  return null;
};

export default ChkoutShippingAddress;
