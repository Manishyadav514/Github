import React, { Fragment } from "react";

import { useRouter } from "next/router";

import useTranslation from "@libHooks/useTranslation";

const CheckoutSteps = () => {
  const { t } = useTranslation();

  const { pathname } = useRouter();

  const STEPS = [
    { label: t("shoppingBag"), position: 0, active: pathname === "/shopping-bag" },
    {
      position: 33.33,
      label: t("selectAddress") || "select address",
      active: pathname.match(/\/select-address|\/add-shipping-address/),
    },
    { label: t("checkout") || "checkout", position: 66.66, active: pathname === "/checkout" },
    { label: t("payment"), position: 98, active: pathname === "/payment" },
  ];

  return (
    <div className="py-4 pt-8 w-1/2">
      <div className="w-full flex items-center relative">
        {STEPS.map(({ label, position, active }, index) => (
          <Fragment key={label}>
            <span
              style={{ left: `${position - (label.length > 8 ? 3.9 : 2.5)}%` }}
              className={`text-11 uppercase absolute bottom-5 ${active ? "" : "text-gray-400"}`}
            >
              {label}
            </span>

            <div
              key={label}
              style={{ boxShadow: "0 0 4px 0 rgba(0,0,0,.5)", left: `${position}%`, borderWidth: "5px" }}
              className={`rounded-full bg-white absolute inset-y-0 my-auto ${
                active
                  ? "border-black h-8 w-8"
                  : STEPS.findIndex(x => x.active) > index
                  ? "border-black h-5 w-5"
                  : "border-gray-300 h-5 w-5"
              }`}
            />
          </Fragment>
        ))}

        <div
          className="w-full rounded-full overflow-hidden h-2 shadow-inner"
          style={{ background: "linear-gradient(180deg,#ebebeb 0,#f5f5f5)" }}
        >
          <div
            style={{ width: `${STEPS.find(x => x.active)?.position}%` }}
            className="bg-black w-full h-2 transition-all duration-500"
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
