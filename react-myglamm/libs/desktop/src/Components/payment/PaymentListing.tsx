import React, { ReactElement, useEffect } from "react";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import { PaymentOrder } from "@typesLib/Payment";
import { ValtioStore } from "@typesLib/ValtioStore";

import { GiBankIco, GiCard1Ico, GiCash2Ico1, GiWalletIco } from "@libComponents/GlammIcons";

import UPILogo from "../../../../UX/public/svg/UPI-Logo.svg";

interface PayListProps {
  setActivePayment: (data: PaymentOrder) => void;
  activePayment: PaymentOrder;
}

const PaymentListing = ({ activePayment, setActivePayment }: PayListProps) => {
  const { t } = useTranslation();

  const { paymentOrder, CRED, TWID, isCodEnable } = useSelector((store: ValtioStore) => store.paymentReducer);
  const { binSeriesData } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  const isBinSeries = binSeriesData?.paymentMethods?.value?.length;

  return (
    <section className="w-1/5">
      <h6 className="font-bold uppercase text-sm mt-2.5 mb-4">{t("paymentMethod") || "payment method"}</h6>

      <ul className="list-none">
        {(isBinSeries ? paymentOrder?.filter(x => x.name.match(/CARD|creditCard/)) : paymentOrder)?.map(payment => {
          const active = payment.name === activePayment.name;

          if (payment.active) {
            switch (payment.name) {
              case "COD":
              case "CASH":
                return (
                  <PaymentBtn
                    active={active}
                    label={t("cod")}
                    key={payment.name}
                    isCodEnable={isCodEnable}
                    callback={() => setActivePayment(payment)}
                    svg={
                      <GiCash2Ico1
                        className="inline mr-4"
                        width="30px"
                        height="30px"
                        fill="#01c717"
                        viewBox="0 50 500 700"
                        role="img"
                        aria-labelledby="Cash On Delivery"
                      />
                    }
                  />
                );

              case "CARD":
              case "creditCard":
                return (
                  <PaymentBtn
                    key={payment.name}
                    label={t("creditOrDebitCard")}
                    active={active || !!isBinSeries}
                    callback={() => setActivePayment(payment)}
                    svg={
                      <GiCard1Ico width="30px" height="30px" fill="#d65274" viewBox="0 50 500 700" className="inline mr-4" />
                    }
                  />
                );

              case "NB":
                return (
                  <PaymentBtn
                    active={active}
                    key={payment.name}
                    label={t("netBanking")}
                    callback={() => setActivePayment(payment)}
                    svg={
                      <GiBankIco
                        width="30px"
                        height="30px"
                        fill="#13abdf"
                        viewBox="0 50 500 700"
                        className="inline mr-4"
                        role="img"
                        aria-labelledby="Net Banking"
                      />
                    }
                  />
                );

              case "UPI":
                return (
                  <PaymentBtn
                    active={active}
                    label={t("upi")}
                    key={payment.name}
                    callback={() => setActivePayment(payment)}
                    svg={
                      <UPILogo
                        role="img"
                        width="35px"
                        height="30px"
                        className="inline mr-4"
                        aria-labelledby="Google Pay / PhonePe / UPI"
                      />
                    }
                  />
                );

              case "wallets":
              case "WALLET":
                return (
                  <PaymentBtn
                    active={active}
                    key={payment.name}
                    label={t("wallets")}
                    callback={() => setActivePayment(payment)}
                    svg={
                      <GiWalletIco
                        className="inline mr-4"
                        width="30px"
                        height="30px"
                        fill="#13abdf"
                        viewBox="0 50 500 700"
                        role="img"
                        aria-labelledby="wallet"
                      />
                    }
                  />
                );

              case "CRED":
                if (CRED?.isEligible) {
                  return (
                    <PaymentBtn
                      active={active}
                      key={payment.name}
                      icon={CRED.layout.icon}
                      label={CRED.layout.title}
                      callback={() => setActivePayment(payment)}
                    />
                  );
                }

              case "Pay with Rewards":
                if (TWID?.isEligible) {
                  return (
                    <PaymentBtn
                      active={active}
                      key={payment.name}
                      icon={payment.icon.TWID}
                      callback={() => setActivePayment(payment)}
                      label={t("twidRewards") || "Pay with Rewards"}
                    />
                  );
                }

              default:
                return null;
            }
          }

          return null;
        })}
      </ul>
    </section>
  );
};

interface PayListBtnProps {
  icon?: string;
  label: string;
  active: boolean;
  svg?: ReactElement;
  isCodEnable?: boolean;
  callback: () => void;
}

const PaymentBtn = ({ icon, label, active, callback, svg, isCodEnable = true }: PayListBtnProps) => (
  <li className="py-0.5">
    <button
      type="button"
      onClick={callback}
      disabled={!isCodEnable}
      className={`rounded tracking-wide flex items-center text-left text-sm p-4 w-full hover:bg-paymentBg hover:border-black ${
        active ? "border border-black bg-paymentBg" : "border border-transparent"
      }`}
    >
      {icon ? <img src={icon} alt={label} height={30} width={30} className="mr-3" /> : svg}
      {label}
    </button>
  </li>
);

export default PaymentListing;
