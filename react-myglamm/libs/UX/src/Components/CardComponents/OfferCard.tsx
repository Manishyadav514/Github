import * as React from "react";

import Widgets from "@libComponents/HomeWidgets/Widgets";

const OfferCard = ({ offers }: any) => (
  <>
    {offers.widget?.length && (
      <div className="border-l-4 py-4" style={{ borderColor: "var(--color1)" }}>
        <div className=" px-4 pb-4">
          <h2 className="text-sm font-extrabold text-black uppercase">EXCLUSIVE OFFERS</h2>
        </div>
        {offers.widget && <Widgets widgets={offers.widget} />}
      </div>
    )}
  </>
);

export default OfferCard;
