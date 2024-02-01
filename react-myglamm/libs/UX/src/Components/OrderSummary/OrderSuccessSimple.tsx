import React from "react";
import Link from "next/link";

import useTranslation from "@libHooks/useTranslation";

import CrossIcon from "../../../public/svg/crossSTB.svg";

interface successProps {
  orderDetails: any;
  orderStatus?: string;
}

const OrderSuccessSimple = ({ orderDetails }: successProps) => {
  const { t } = useTranslation();

  const orderSuccessObj = t("orderSuccessObj");

  return (
    <section
      style={{ backgroundImage: `url(${orderSuccessObj.bgImage})` }}
      className="h-screen bg-no-repeat bg-contain relative bg-color2"
    >
      <div className="w-full h-screen  flex flex-col text-center  justify-center">
        <div className="px-8">
          <Link href="/" legacyBehavior aria-label="close">
            <CrossIcon width={32} height={32} className="fixed top-4 right-4" />
          </Link>

          <h4 className="font-semibold tracking-wide">{t("orderSuccess")}</h4>
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

        {orderSuccessObj.slickBanner && (
          <Link href={orderSuccessObj.slickBannerUrl} className="w-full absolute bottom-12" aria-label="order success">
            <img src={orderSuccessObj.slickBanner} alt="stbotanica products" className="w-full" />
          </Link>
        )}
      </div>
    </section>
  );
};

export default OrderSuccessSimple;
