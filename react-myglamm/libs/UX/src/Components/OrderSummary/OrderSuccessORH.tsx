import React from "react";
import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";

import CrossIcon from "../../../public/svg/crossSTB.svg";

interface successProps {
  orderDetails: any;
  orderStatus?: string;
}

const OrderSuccessORH = ({ orderDetails }: successProps) => {
  const { t } = useTranslation();

  const orderSuccessObj = t("orderSuccessObj");

  return (
    <section className="h-screen bg-no-repeat bg-contain relative bg-color2">
      <div className="w-full h-screen flex flex-col text-center justify-center">
        <div className="px-8">
          <Link href="/" legacyBehavior aria-label="close">
            <CrossIcon width={32} height={32} className="fixed top-4 right-4" />
          </Link>
          <img src={orderSuccessObj.bgImage} className="w-full mb-8 px-8" alt="Success" />
          <h4 className="font-semibold tracking-wide">Order Placed</h4>
          <img src={orderSuccessObj.successImg} className="w-full mb-8 px-8" alt="Success" />
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: orderSuccessObj.orderPlacedMsg
                ?.replace("{{orderNumber}}", orderDetails?.orderNumber || "0000")
                .replace("{{email}}", orderDetails?.userInfo?.email || "yourname@email.com"),
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default OrderSuccessORH;
