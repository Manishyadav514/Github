import React from "react";
import PopupModal from "@libComponents/PopupModal/PopupModal";

const ExchangeOfferModal = ({ showExchangeContent, setShowExchangeContent }: any) => (
  <PopupModal show={showExchangeContent} onRequestClose={() => setShowExchangeContent(false)}>
    <section className="p-8 pb-4 rounded-t-lg">
      <p className="pb-2 font-semibold">
        You can exchange the Treat Love Care foundation purchased for a different shade of the Treat Love Care foundation within
        7 (seven) days of date of delivery of the product to the customer. Exchange request can be placed through myglamm app,
        myglamm website or through our customer service. MyGlamm reserves the right to withdraw or modify this exchange policy
        at any time.
      </p>

      <h3 className="py-1 text-left font-semibold">Exclusions:</h3>

      <ul className="list-disc text-sm pl-4">
        <li>Product purchased should not be part of any other offer (Free product)</li>
        <li>No Refund or discount code is applicable on this product</li>
        <li>Product packaging is tampered</li>
        <li>Product is used</li>
        <li>Product is broken</li>
      </ul>
    </section>
  </PopupModal>
);

export default ExchangeOfferModal;
