import { useEffect, useState } from "react";
import { SavedCardList } from "@typesLib/Payment";
import PaymentAPI from "@libAPI/apis/PaymentAPI";
import { removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

export const useFetchSavedCards = () => {
  const paymentApi = new PaymentAPI();
  const [savedCardsList, setSavedCardsList] = useState<SavedCardList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    checkUserLoginStatus() && fetchSavedCards();
  }, []);

  const fetchSavedCards = async () => {
    setIsLoading(true);
    await paymentApi
      .getSavedCardsList()
      .then((data: any) => {
        const { cards } = data.data.data.data;

        setSavedCardsList(cards);

        if (cards.length) {
          setLocalStorageValue(LOCALSTORAGE.IS_SAVED_CARDS_PRESENT, true, true);
        } else {
          removeLocalStorageValue(LOCALSTORAGE.IS_SAVED_CARDS_PRESENT);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return { savedCardsList, isLoading, fetchSavedCards };
};
