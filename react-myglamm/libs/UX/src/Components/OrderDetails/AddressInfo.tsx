import React from "react";
import { GiPhoneIco, GiEnvelopeIco } from "@libComponents/GlammIcons";

const AddressInfo = ({ orderInfo, t }: any) => {
  const address = orderInfo?.address?.shippingAddress;
  return (
    <div>
      <div className="text-sm" style={{ padding: "12px 0 17px" }}>
        <h5 className="mb-2 text-sm font-semibold" style={{ color: "#494949" }}>
          {t("shippingAddress")}
        </h5>
        <p className="text-sm break-all" style={{ marginBottom: "10px" }}>
          <span className="font-semibold block">{address.consumerName},</span>
          {address.location},{address.landmark}
          <br /> {address.cityName},{address.stateName}, {address.zipcode}, {address.countryName}
        </p>
        <div className="flex items-end" style={{ marginBottom: "10px" }}>
          <GiPhoneIco width="25" height="19" viewBox="10 400 700 50" fill="#000" role="img" aria-labelledby="phone" />
          <p className="text-sm break-all">{address.phoneNumber}</p>
        </div>
        <div className="flex items-end" style={{ marginBottom: "10px" }}>
          <GiEnvelopeIco width="25" height="19" viewBox="10 400 700 50" fill="#000" role="img" aria-labelledby="email" />
          <p className="text-sm break-all">{orderInfo && address.email}</p>
        </div>
      </div>
    </div>
  );
};

export default AddressInfo;
