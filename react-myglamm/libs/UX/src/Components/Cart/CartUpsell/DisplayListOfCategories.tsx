import React from "react";

const DisplayListOfCategories = ({
  showPersonalizedDsTags,
  globalDsTags,
  categories,
  tabIndex,
  getCategoryProducts,
}: {
  showPersonalizedDsTags: boolean;
  globalDsTags: string[];
  categories: any;
  tabIndex: number;
  getCategoryProducts: (category: any, index: number) => void;
}) => {
  const listOfTagsToDisplay = showPersonalizedDsTags ? globalDsTags : categories;

  return listOfTagsToDisplay?.map((category: any, index: number) => (
    <button
      key={index}
      type="button"
      className={` ${
        tabIndex === index ? "bg-color1 text-white font-semibold" : "bg-white text-black"
      } border border-color1 outline-none inline-block   rounded-full   text-sm m-2  px-3 py-1   relative  flex-sliderChild`}
      onClick={() => {
        getCategoryProducts(category, index);
      }}
    >
      {category.name || category}
    </button>
  ));
};

export default DisplayListOfCategories;
