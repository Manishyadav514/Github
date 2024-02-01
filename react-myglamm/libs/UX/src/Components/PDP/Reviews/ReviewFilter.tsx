import React, { Fragment, useState } from "react";

import useTranslation from "@libHooks/useTranslation";
import RatingStar from "./Ratings";

type filterProps = {
  toggleFilter: () => void;
  onRequestClose: () => void;
  filterData: { rating: string; reviews: string };
};

function ReviewFilter(props: filterProps) {
  const { toggleFilter, onRequestClose, filterData } = props;
  const { t } = useTranslation();
  const [selectedRating, setSelectedRating] = useState(filterData.rating);
  const [selectedReview, setSelectedReview] = useState(filterData.reviews);

  const handleRating = (e: any) => {
    filterData.rating = e.target.value;
    setSelectedRating(e.target.value);
  };
  const handleReview = (e: any) => {
    filterData.reviews = e.target.value;
    setSelectedReview(e.target.value);
  };

  return (
    <Fragment>
      <div className="h-screen text-md p-5 text-gray-700 bg-white">
        <style>
          {`
            input[type="radio"] {
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
              position: absolute;
              right: 15px;
              background-clip: content-box;
              border-radius: 50%;
              width: 16px;
              height: 16px;
              margin: 0 5px 0 0;
              padding: 2px;
              border: solid 1px #dfe2ea;
            }
            input[type="radio"]:checked {
              border: solid 1px var(--color1);
              background-color: var(--color1);
            }
          `}
        </style>

        <button
          className="flex items-center text-sm font-semibold h-8 uppercase outline-none"
          type="button"
          onClick={toggleFilter}
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40px" height="30px" viewBox="0 0 1000 1000">
            <path
              transform="scale(1,-1) translate(0, -650)"
              fill="#000"
              d="M434 35c13 0 24 3 33 11 9 8 14 17 14 27 0 8-3 15-10 22l-159 174 149 163c6 7 9 14 9 21 0 9-4 17-13 24-8 7-18 11-29 11-13 0-24-6-33-16l-134-148-134 146c-11 12-23 18-37 18-13 0-24-4-33-12-9-8-13-17-13-28 0-8 3-15 9-22l146-159-163-177c-6-6-8-12-8-19 0-10 4-18 13-25 9-8 19-11 31-11 12 0 22 5 31 15l147 162 148-161c9-11 22-16 36-16z"
            />
          </svg>
          {t("filters") || `Filters`}
        </button>
        <p className="text-sm font-semibold my-8">Rating</p>
        <div className="mx-auto input-element-wrapper my-2 mt-2 text-base cursor-pointer">
          <div className=" mt-2 input-radio">
            <div className="flex items-center mr-4 mb-4">
              <span className="flex items-center"> All</span>
              <input
                id="radio1"
                type="radio"
                name="rating"
                className="mr-1 w-4 h-4 outline-none"
                value="all"
                checked={selectedRating === "all"}
                onChange={handleRating}
              />
            </div>
            {["5", "4", "3", "2", "1"]?.map((rating: string) => (
              <div className="flex items-center mr-4 mb-4">
                <span className="flex items-center">
                  <span className="mr-2">{rating}&nbsp;Star</span>{" "}
                  <RatingStar star={parseInt(rating, 10)} width={19} height={17} />
                </span>
                <input
                  id={rating}
                  type="radio"
                  name="rating"
                  className="mr-1 w-4 h-4 outline-none"
                  value={rating}
                  checked={selectedRating === rating}
                  onChange={handleRating}
                />
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm font-semibold my-8">Reviews</p>
        <div className="mx-auto input-element-wrapper my-2 mt-2 text-base">
          <div className=" mt-2 input-radio">
            <div className="flex items-center mr-4 mb-4">
              <span className="flex items-center "> All</span>
              <input
                id="radio7"
                type="radio"
                name="review"
                className="mr-1 w-4 h-4 outline-none"
                value="all"
                checked={selectedReview === "all"}
                onChange={handleReview}
              />
            </div>
            <div className="flex items-center mr-4 mb-4">
              <span className="flex items-center ">With Images</span>
              <input
                id="radio8"
                type="radio"
                name="review"
                className="mr-1 w-4 h-4 outline-none"
                value="containImage"
                checked={selectedReview === "containImage"}
                onChange={handleReview}
              />
            </div>
          </div>
        </div>

        <div className="p-2 flex absolute bottom-0 inset-x-0 w-full h-14">
          <button className="w-1/2 bg-white border border-black-600 mr-2" type="button" onClick={toggleFilter}>
            {t("cancel")}
          </button>
          <button className="bg-ctaImg w-1/2 text-white font-semibold text-sm" type="button" onClick={onRequestClose}>
            {t("apply")}
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default ReviewFilter;
