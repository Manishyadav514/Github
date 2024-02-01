import React from "react";
import AmpHtml from "./AmpHtml";

export default function ServiceDetailsOverview({ data }: any) {
  const { cityName, about, businessDays, addressStreetName, addressHouseNumber, pincode } = data.data[0];

  return (
    <>
      <AmpHtml html={about} />
      <BusinessHours businessDays={businessDays} />
      <Address
        addressStreetName={addressStreetName}
        addressHouseNumber={addressHouseNumber}
        cityName={cityName}
        pincode={pincode}
      />
    </>
  );
}

function BusinessHours({ businessDays }: any) {
  const days = businessDays?.map(({ day, startTime, endTime }: any) => (
    <li className="businessDay" key={day}>
      <span>{day.slice(0, 3)} &nbsp;</span>
      <span>
        <span>
          {startTime} AM - {endTime} AM
        </span>
      </span>
    </li>
  ));

  return (
    <>
      {businessDays ? (
        <>
          <h3>Business Hour</h3>
          <ul>{days}</ul>
        </>
      ) : null}
    </>
  );
}

function Address({ addressStreetName, addressHouseNumber, pincode, cityName }: any) {
  return (
    <>
      <h3>Address</h3>
      <p className="content-para address">
        {addressHouseNumber}
        <br />
        {addressStreetName}
        <br />
        {cityName}
        <br />
        Pincode: {pincode}
      </p>
    </>
  );
}
