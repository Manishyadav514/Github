import { useEffect, useRef } from "react";

import { useSnapshot } from "valtio";
import { useSelector } from "@libHooks/useValtioSelector";

import PaymentAPI from "@libAPI/apis/PaymentAPI";

import { updatePyblAmount } from "@libStore/actions/cartActions";
import { UPDATE_GIFTCARDS, GIFT_CARDS } from "@libStore/valtioStore";

import { ValtioStore } from "@typesLib/ValtioStore";
import { GiftCard, GiftCardFormValues } from "@typesLib/Payment";

import { formatPrice } from "@libUtils/format/formatPrice";

export function useGiftCard() {
  const { netAmount, shippingCharges, appliedGlammPoints, couponData, subscriptionDiscountValue } = useSelector(
    (store: ValtioStore) => store.cartReducer.cart
  );

  const giftCards = useSnapshot(GIFT_CARDS).cards;

  /* The Static Amount without any changes affected by Giftcards */
  const mainPayableAmt = useRef(
    netAmount + shippingCharges - (appliedGlammPoints || 0) - (couponData.userDiscount || 0) - (subscriptionDiscountValue || 0)
  );

  useEffect(() => {
    if (giftCards?.length) {
      validateAllGiftCards().then(cards => processGiftCard(cards));
    }
  }, []);

  /* Validating All Applied Cards on Mount Payment Page */
  const validateAllGiftCards = async () => {
    const paymentApi = new PaymentAPI();

    try {
      const giftCardsList = await Promise.all(
        giftCards.map(card => paymentApi.giftCardBalance({ cardNumber: card.cardNumber, cardPin: card.cardPin }))
      );

      const updatedCards: Array<GiftCard> = [];

      giftCardsList.forEach((cards, index) => {
        if (cards.data.data.amount) {
          updatedCards.push({ ...giftCards[index], balance: formatPrice(cards.data.data.amount) as number });
        }
      });

      return updatedCards;
    } catch {
      return [];
    }
  };

  const addGiftCard = (giftCardVal: GiftCardFormValues, balance: number) => {
    processGiftCard([
      ...giftCards,
      {
        used: 0,
        cardNumber: giftCardVal.cardNumber,
        balance: formatPrice(balance) as number,
        cardPin: giftCardVal.cardPin,
      },
    ]);
  };

  const removeGiftCard = (cardNumber: string) => {
    processGiftCard(giftCards.filter(card => card.cardNumber !== cardNumber));
  };

  /* Patching Giftcards Array based on payable amount and applied */
  function processGiftCard(giftcards: Array<GiftCard>) {
    let PAYABLE_AMT = mainPayableAmt.current;
    const updatedCards = giftcards.map(card => {
      const { balance, used } = card;

      if (PAYABLE_AMT === 0) {
        return { ...card, used: used };
      }
      if (balance >= PAYABLE_AMT) {
        const updatedCard = { ...card, used: PAYABLE_AMT };
        PAYABLE_AMT = 0;
        return updatedCard;
      }
      PAYABLE_AMT -= balance;
      return { ...card, used: balance };
    });

    UPDATE_GIFTCARDS(updatedCards);

    updatePyblAmount(PAYABLE_AMT);
  }

  return { addGiftCard, removeGiftCard };
}
