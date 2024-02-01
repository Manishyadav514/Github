import * as React from "react";

import PopupModal from "@libComponents/PopupModal/PopupModal";

import ReviewFilter from "./ReviewFilter";

const FilterReviewModal = ({ open, onRequestClose, toggleFilter, filterData }: any) => (
  <PopupModal show={open} onRequestClose={onRequestClose}>
    <ReviewFilter toggleFilter={toggleFilter} onRequestClose={onRequestClose} filterData={filterData} />
  </PopupModal>
);

export default FilterReviewModal;
