import React, { ReactElement, useState } from "react";
import CustomLayout from "@libLayouts/CustomLayout";
import PaymentAPI from "@libAPI/apis/PaymentAPI";
import { SavedCardList } from "@typesLib/Payment";
import useTranslation from "@libHooks/useTranslation";
import DeleteIcon from "../../public/svg/DeleteIcon.svg";
import EditIcon from "../../public/svg/editIcon.svg";
import { GiCloseIco } from "@libComponents/GlammIcons";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import NoCardIcon from "../../public/svg/no-credit-card.svg";
import clsx from "clsx";
import { useFetchSavedCards } from "@libHooks/useFetchSavedCards";
import dynamic from "next/dynamic";
import { showSuccess } from "@libUtils/showToaster";

const PromptModal = dynamic(() => import("@libComponents/PopupModal/PromptModal"));
const PopupModal = dynamic(() => import("@libComponents/PopupModal/PopupModal"));

const ManagePaymentMethods = () => {
  const { t } = useTranslation();
  const paymentApi = new PaymentAPI();

  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<SavedCardList>();

  const [cardForm, setCardForm] = useState<{ title: string; name: string }>({
    title: "",
    name: "",
  });

  /* hook for fetching saved cards */
  const { savedCardsList, isLoading, fetchSavedCards } = useFetchSavedCards();

  const handleEditCard = (card: SavedCardList) => {
    setCardForm({
      name: card.name_on_card,
      title: card.nickname,
    });

    setSelectedCard(card);
    setShowEditModal(true);
  };

  const handleChange = (e: any) => {
    setCardForm({ ...cardForm, [e.target.name]: e.target.value });
  };

  const handleUpdateCardDetails = async () => {
    try {
      const payload = {
        nickName: cardForm.title,
        nameOnCard: cardForm.name,
        card_reference: selectedCard?.card_reference ?? "",
      };
      const response = await paymentApi.updateCardDetails(payload);

      if (response?.status) {
        /* refetch the card list for updated results */
        fetchSavedCards();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShowEditModal(false);
      showSuccess(t("cardUpdatedSuccessfully") || "Card Updated Successfully");
    }
  };

  const handleDeleteCard = async () => {
    try {
      const response = await paymentApi.deleteCard({ card_reference: selectedCard?.card_reference ?? "" });
      if (response?.status) {
        /* refetch the card list for updated results */
        fetchSavedCards();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      showSuccess(t("cardDeletedSuccessfully") || "Card Deleted Successfully");
    }
  };

  /* rendering list of cards */
  const displayCardsList = savedCardsList?.map((card: SavedCardList) => (
    <div key={card.card_token} className="bg-white p-3 mt-3 rounded-sm">
      <span className="font-bold">{card.long_label}</span>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm">{card.name_on_card}</span>
        <img src={card.imageUrl} alt={card.card_brand} className="w-9 h-7" />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className={clsx("text-xs  font-bold", card.expired ? "text-red-500" : "text-gray-400")}>
          {t("expires ") || "Expires "}
          {card.card_exp_month}/{card.card_exp_year}
        </span>
        <div className="flex items-center">
          <EditIcon className="mr-3" onClick={() => handleEditCard(card)} />
          <DeleteIcon
            onClick={() => {
              setSelectedCard(card);
              setShowDeleteModal(true);
            }}
          />
        </div>
      </div>
    </div>
  ));

  /* form for editing the card details */
  const editCardForm = (
    <>
      <div className="flex items-center justify-between rounded-t-lg bg-white p-4">
        <span className="font-bold">{t("editPaymentMethod") || "Edit Payment Method"}</span>
        <GiCloseIco height="25" width="25" fill="#000000" onClick={() => setShowEditModal(false)} />
      </div>
      <div className="p-2 bg-gray-100">
        <div className="p-4 bg-white ">
          <p className="font-bold text-sm pb-2">
            {selectedCard?.card_issuer} {selectedCard?.card_number}
          </p>
          <div className=" relative mt-3">
            <span className="text-xs ml-2 absolute font-bold -top-2 px-1 left-0.5 bg-white">
              {t("cardTitle") || "Card Title"}
            </span>
            <input
              type="text"
              name="title"
              aria-label="Card Number"
              value={cardForm.title}
              onChange={handleChange}
              className="h-12 border border-black rounded-sm w-full mb-5  outline-none px-4 font-semibold tracking-widest"
              role="textbox"
            />
          </div>
          <div className="relative mt-3">
            <span className="text-xs ml-2 absolute font-bold -top-2 px-1 left-0.5 bg-white">
              {t("nameOnCard") || "Name On Card"}
            </span>
            <input
              type="text"
              name="name"
              aria-label="Card Number"
              value={cardForm.name}
              onChange={handleChange}
              className="h-12  border border-black rounded-sm w-full mb-5  outline-none px-4 font-semibold tracking-widest"
              role="textbox"
            />
          </div>

          <button
            disabled={!cardForm.name.length}
            className="rounded-sm w-full bg-ctaImg py-2 text-white font-bold"
            onClick={handleUpdateCardDetails}
          >
            {t("save")}
          </button>
        </div>
      </div>
    </>
  );

  const displayEditCardModal = (
    <PopupModal show={showEditModal} onRequestClose={() => setShowEditModal(false)}>
      {editCardForm}
    </PopupModal>
  );

  if (isLoading) {
    return <LoadSpinner />;
  }

  if (savedCardsList?.length) {
    return (
      <div className="m-3">
        <p className="text-sm">{t("yourSavedCards") || "Your Saved Cards"}</p>

        {/* List of Cards */}
        {displayCardsList}

        {/* Modal to Edit card */}
        {showEditModal && displayEditCardModal}

        {/* Modal to Delete Card */}
        {showDeleteModal && (
          <PromptModal
            title="Delete This Card"
            subTitle="Are you sure you want to delete this card ?"
            onOk={handleDeleteCard}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <NoCardIcon role="img" aria-labelledby={t("noCardAvailable") || "No payment methods available."} />
      <p className="font-bold text-22 mt-5">{t("noCardAvailable") || "No payment methods available."}</p>
    </div>
  );
};

ManagePaymentMethods.getLayout = (children: ReactElement) => (
  <CustomLayout header="managePaymentMethod" fallback="Manage Payment Methods">
    {children}
  </CustomLayout>
);

export default ManagePaymentMethods;
