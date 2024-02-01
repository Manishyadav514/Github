import React, { useEffect, useState } from "react";
import useTranslation from "@libHooks/useTranslation";
// @ts-ignore
import { ModalContainer } from "@libStyles/css/miniPDP.module.css";
import PopupModal from "./PopupModal";

interface CollectionFilterProps {
  show: boolean;
  hide: () => void;
  applyFilter: () => void;
  setSelectedCategories: ([]: any) => void;
  collectionCategories: any[];
  selectedCategories: any[];
}

const CollectionFilterModal = ({
  show,
  hide,
  collectionCategories,
  selectedCategories,
  applyFilter,
  setSelectedCategories,
}: CollectionFilterProps) => {
  const { t } = useTranslation();

  const [tempCategories, setTempCategories] = useState<any[]>(selectedCategories);

  useEffect(() => {
    if (selectedCategories?.length) {
      setTempCategories(selectedCategories);
    }
  }, [selectedCategories, show]);

  const handleTempCategorySelection = (id: any) => {
    if (tempCategories.includes(id)) {
      const current = [...tempCategories];
      current.splice(current.indexOf(id), 1);
      setTempCategories(current);
    } else {
      setTempCategories(current => [...current, id]);
    }
  };

  const clearAll = () => {
    setTempCategories([]);
    setSelectedCategories([]);
  };

  const handleApplyFilter = () => {
    setSelectedCategories([...tempCategories]);
    hide();
    applyFilter();
  };

  return (
    <PopupModal show={show} onRequestClose={hide}>
      <section className={ModalContainer}>
        <div className="flex flex-row justify-between mx-2 mb-3">
          <p className="font-bold">{t("applyFilter") || "Apply Filter"}</p>
          <p className="font-bold" style={{ color: "var(--color1)" }} onClick={() => clearAll()}>
            {t("clearAll")}
          </p>
        </div>
        <hr className="bg-black mb-4" />
        <div className="flex flex-wrap mx-2">
          {/**Map for selected categories */}
          {tempCategories?.length > 0 &&
            collectionCategories?.map((category: any, index: React.Key) => {
              if (tempCategories.includes(category.id)) {
                return (
                  <div key={index} className="flex flex-row py-1">
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleTempCategorySelection(category.id)}
                      className="text-sm w-max py-1 px-2 rounded-lg mr-2 mb-2 text-white bg-color1 shadow-sm"
                    >
                      {category?.cms[0]?.content?.name}
                    </button>
                  </div>
                );
              } else {
                return null;
              }
            })}

          {/**Map for default categories */}
          {collectionCategories?.map((category: any, index: React.Key) => {
            return (
              <div key={index} className="flex flex-row py-1">
                {!tempCategories.includes(category.id) && (
                  <button
                    key={index}
                    type="button"
                    className="text-sm w-max py-1 px-2 rounded-lg mr-2 mb-2 text-gray-800 bg-color2 shadow-sm"
                    onClick={() => handleTempCategorySelection(category.id)}
                  >
                    {category?.cms[0]?.content?.name}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <hr className="bg-black mt-2" />
        <div className="flex flex-row justify-between mt-2">
          <button className="font-bold w-48" onClick={() => hide()}>
            {t("close")}
          </button>
          <button
            className="text-white w-48 h-12 bg-ctaImg uppercase rounded-none text-20 font-bold"
            onClick={() => handleApplyFilter()}
          >
            {t("apply")}
          </button>
        </div>
      </section>
    </PopupModal>
  );
};

export default CollectionFilterModal;
