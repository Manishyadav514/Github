import React, { useEffect, useState } from "react";
import { fetchOffersForCard, getCardInfo, isSavedCardEnabled } from "@checkoutLib/Payment/HelperFunc";
import { useFetchSavedCards } from "@libHooks/useFetchSavedCards";
import useTranslation from "@libHooks/useTranslation";
import { getCurrency } from "@libUtils/format/formatPrice";
import { PaymentType, PaymentData, SavedCardList } from "@typesLib/Payment";
import { ValtioStore } from "@typesLib/ValtioStore";
import { useSelector } from "@libHooks/useValtioSelector";
import dynamic from "next/dynamic";
import { SHOP } from "@libConstants/SHOP.constant";

const SavedCardsCVVInput = dynamic(() => import("./SavedCardsCVVInput"), { ssr: false });

const SavedCards = ({ handleCreateOrder }: { handleCreateOrder: (arg1: PaymentType, arg2: PaymentData) => any }) => {
  const { t } = useTranslation();
  const { savedCardsList } = useFetchSavedCards();

  const { profile, payableAmount, vendorMerchantId, clientAuthDetails, paymentOrder } = useSelector((store: ValtioStore) => ({
    payableAmount: store.cartReducer.cart.payableAmount,
    profile: store.userReducer.userProfile,
    vendorMerchantId: store.paymentReducer.vendorMerchantId,
    clientAuthDetails: store.paymentReducer.clientAuthDetails,
    paymentOrder: store.paymentReducer.paymentOrder,
  }));

  const [finalPayableAmount, setFinalPayableAmount] = useState<number>();
  const [selectedCardToken, setSelectedCardToken] = useState<string>("");
  const [cardOffers, setCardOffers] = useState<any[]>([]);
  const [offerId, setOfferId] = useState<string>("");

  /* Fetch offers for saved cards */
  useEffect(() => {
    const fetchOffers = async () => {
      const payload = {
        customer: {
          id: clientAuthDetails?.customerId ?? "",
          email: profile?.email,
          phone: profile?.phoneNumber,
        },
        order: {
          amount: `${payableAmount}`,
          currency: getCurrency(),
          merchant_id: vendorMerchantId,
          payment_channel: "mweb",
        },
        payment_method_info: getCardInfo(savedCardsList),
      };

      const offers = await fetchOffersForCard({ clientAuthToken: clientAuthDetails?.clientAuthToken ?? "", payload });

      setCardOffers(offers?.best_offer_combinations);
    };

    if (savedCardsList.length && profile && clientAuthDetails) {
      /* Make the first save card enabled by default */
      setSelectedCardToken(savedCardsList?.[0]?.card_token);

      fetchOffers();
    }
  }, [savedCardsList, payableAmount]);

  /* Get offers details like final amount after discount, offer Id */
  useEffect(() => {
    if (cardOffers?.length && selectedCardToken) {
      getOfferDetails();
    }
  }, [cardOffers]);

  /* Get final payable amount based on offer */
  const getOfferDetails = () => {
    return cardOffers.map((offer: any) => {
      if (selectedCardToken === offer.payment_method_reference) {
        setFinalPayableAmount(+offer?.order_breakup?.final_order_amount);
        setOfferId(offer.offers?.[0]?.offer_id);
      }
    });
  };

  /* Display card offers */
  const displayCardOffers = (cardToken: string) => {
    return cardOffers.map((offer: any, index: number) => {
      if (cardToken === offer.payment_method_reference) {
        return (
          <div className="px-2 py-1 ml-3 bg-green-50 rounded-lg" key={index}>
            <span className="text-green-700 font-semibold text-sm ">
              Save ₹{Math.round(parseInt(offer?.order_breakup?.discount_amount))}
            </span>
          </div>
        );
      }
    });
  };

  /* Render list of saved cards */
  if (savedCardsList.length && SHOP.ENABLE_JUSPAY && paymentOrder && isSavedCardEnabled(paymentOrder)) {
    return (
      <div>
        <h2 className="py-2 text-left text-sm">{t("savedCards") || "Saved Cards"}</h2>
        {savedCardsList.map((card: SavedCardList) => (
          <div key={card.card_token} className="bg-white p-3 border-b border-gray-200 rounded-sm">
            <label>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={card.imageUrl} alt={card.card_brand} className="h-7 w-12" />
                  <span className="text-sm ml-2" style={{ maxWidth: "128px" }}>
                    {card.short_label}
                  </span>
                  {cardOffers?.length > 0 && displayCardOffers(card.card_token)}
                </div>

                <div className="customradioinput radioChecked">
                  <input
                    type="radio"
                    checked={selectedCardToken === card.card_token}
                    value={card.card_token}
                    onChange={e => setSelectedCardToken(e.target.value)}
                  />
                </div>
              </div>
            </label>
            {selectedCardToken === card.card_token && (
              <SavedCardsCVVInput
                selectedCardToken={selectedCardToken}
                handleCreateOrder={handleCreateOrder}
                cardBinNumber={card.card_isin}
                finalPayableAmount={finalPayableAmount || payableAmount}
                offerId={offerId}
              />
            )}
          </div>
        ))}

        <style jsx>
          {`
            input[type="radio"] {
              /* remove standard background appearance */
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
              /* create custom radiobutton appearance */
              display: inline-block;
              width: 20px;
              height: 20px;
              padding: 0px;
              /* background-color only for content */
              background-clip: content-box;
              border: 1px solid #bbbbbb;
              background-color: white;
              border-radius: 50%;
            }

            /* appearance for checked radiobutton */
            input[type="radio"]:checked {
              background-color: var(--color1);
              border: 1px solid var(--color1);
            }

            input[type="radio"]:disabled {
              background-color: #ffffff;
              border: 1px solid #bbbbbb;
            }

            .customradioinput {
              position: relative;
            }
            .customradioinput:before {
              content: "";
              width: 6px;
              height: 10px;
              border: solid #fff;
              border-width: 0px 2px 2px 0px;
              transform: rotate(45deg);
              position: absolute;
              top: 4px;
              left: 7px;
              display: block;
              transition-duration: 0.3s;
              opacity: 0;
            }

            .customradioinput.radioChecked:before {
              opacity: 1;
            }
          `}
        </style>
      </div>
    );
  }

  return null;
};

export default SavedCards;
