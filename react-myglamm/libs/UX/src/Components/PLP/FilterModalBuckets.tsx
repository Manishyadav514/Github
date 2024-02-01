import { formatPrice } from "@libUtils/format/formatPrice";
import { DownArrowIcon } from "@libComponents/GlammIcons";
import { combinePriceArrays } from "@libUtils/filterUtils";

// keeping this comp in case required for search filter
export const BrandBucket = ({ setSeletedBrands, brandBuckets, selectedBrands }: brandBucket) => {
  const brandsUpdated = [...new Set([...(selectedBrands || []), ...brandBuckets])]; // merged selectedBrandIds with unique items from brandBuckets.

  function checkIsSeclected(brand: string) {
    if (selectedBrands?.length) {
      return selectedBrands.includes(brand);
    }
    return false;
  }

  const selectBrand = (brand: string) => {
    if (checkIsSeclected(brand)) {
      setSeletedBrands(selectedBrands?.filter((x: any) => x !== brand));
    } else {
      setSeletedBrands([...(selectedBrands || []), brand]);
    }
  };
  return (
    <div>
      {brandsUpdated?.map((brand: any) => {
        let isBrandActive = checkIsSeclected(brand);
        return (
          <button
            type="button"
            key={brand}
            onClick={() => selectBrand(brand)}
            className="cursor-pointer w-full px-3 py-4 border-b border-gray-200 flex justify-between outline-none"
          >
            <p className={`text-[13px] capitalize text-start line-clamp-1 ${isBrandActive ? "font-semibold" : ""}`}>{brand}</p>
            <div className="mr-1 inline-flex items-center">
              <div
                className={
                  " w-5 h-5 border border-solid border-slate-300 rounded relative before:w-1.5 before:h-3 before:border-2 before:border-solid before:border-white before:border-t-0 before:border-l-0 before:absolute before:top-0.5 before:left-1.5 before:block before:rotate-45" +
                  (isBrandActive && ` bg-black`)
                }
              ></div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export const CommonFilterRows = ({ data, handleSelect, selectedFilter }: any) => {
  const updatedData = [...new Set([...(selectedFilter || []), ...(data?.map((item: { key: any }) => item.key) || [])])];

  function checkIsSeclected(brand: string) {
    if (selectedFilter?.length) {
      return selectedFilter.includes(brand);
    }
    return false;
  }

  const onFilterClickHandle = (brand: string) => {
    if (checkIsSeclected(brand)) {
      handleSelect(selectedFilter?.filter((x: any) => x !== brand));
    } else {
      handleSelect([...(selectedFilter || []), brand]);
    }
  };

  return (
    <div>
      {updatedData?.map((item: any) => {
        let isBrandActive = checkIsSeclected(item);
        return (
          <button
            type="button"
            key={item}
            onClick={() => onFilterClickHandle(item)}
            className="cursor-pointer w-full px-3 py-4 border-b border-gray-200 flex justify-between outline-none"
          >
            <p className={`text-[13px] capitalize text-start line-clamp-1`}>{item}</p>
            <div className="mr-1 inline-flex items-center">
              <div
                className={
                  " w-5 h-5 border border-solid border-slate-300 rounded relative before:w-1.5 before:h-3 before:border-2 before:border-solid before:border-white before:border-t-0 before:border-l-0 before:absolute before:top-0.5 before:left-1.5 before:block before:rotate-45" +
                  (isBrandActive && ` bg-black`)
                }
              ></div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export const PriceBucket = ({ selectedPrices, setSelectedPrices, priceBuckets }: priceBucket) => {
  function checkIsSeclected(price: any) {
    return selectedPrices?.find(
      (x: any) =>
        x.priceOffer?.between[0] === price.min &&
        (x.priceOffer?.between[1] === price.max || x.priceOffer?.between[1] === 1000000)
    );
  }
  // selected price on top of the list
  const combinedArray = combinePriceArrays(selectedPrices, priceBuckets);
  const selectPriceRange = (price: any) => {
    if (checkIsSeclected(price)) {
      setSelectedPrices(selectedPrices.filter((x: any) => x.priceOffer?.between[0] !== price.min));
    } else {
      setSelectedPrices([
        ...(selectedPrices || []),
        {
          priceOffer: {
            between: [price.min, price.max || 1000000],
          },
        },
      ]);
    }
  };

  return (
    <div>
      {combinedArray?.map((price: any) => {
        const isSelected = checkIsSeclected(price);
        return (
          <button
            type="button"
            key={price.min}
            onClick={() => selectPriceRange(price)}
            className="cursor-pointer w-full px-3 py-4 border-b border-gray-200 flex justify-between outline-none"
          >
            <p className={`text-[13px] text-start line-clamp-1 ${isSelected ? "font-semibold" : ""}`}>
              {formatPrice(price.min, true)} - {price.max ? formatPrice(price.max, true) : "✚"}
            </p>
            <div className="mr-1 inline-flex items-center">
              <div
                className={
                  " w-5 h-5 border border-solid border-slate-300 rounded relative before:w-1.5 before:h-3 before:border-2 before:border-solid before:border-white before:border-t-0 before:border-l-0 before:absolute before:top-0.5 before:left-1.5 before:block before:rotate-45" +
                  (isSelected && ` bg-black`)
                }
              ></div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export const FilterRows = ({ data, activeID, selectedCats, handleSelect, includeCheckBox = false }: FilterRow) => {
  const openChildCat = activeID === data.id;
  const chilSelected = includeCheckBox && selectedCats?.find((x: any) => x === data.slug);
  return (
    <button
      type="button"
      className="cursor-pointer border-b border-gray-200 flex w-full items-center px-3 py-4"
      key={data.id}
      onClick={(e: any) => {
        handleSelect(data);
        e.stopPropagation();
      }}
    >
      <div
        className={`flex items-center w-11/12 outline-none text-left uppercase text-[13px] ${
          openChildCat || chilSelected ? "font-semibold" : ""
        }`}
      >
        {data.tagName}
      </div>
      {includeCheckBox ? (
        <div
          className={
            " w-5 h-5 mr-1 border border-solid border-slate-300 rounded relative before:w-1.5 before:h-3 before:border-2 before:border-solid before:border-white before:border-t-0 before:border-l-0 before:absolute before:top-0.5 before:left-1.5 before:block before:rotate-45" +
            (chilSelected && ` bg-black`)
          }
        ></div>
      ) : (
        <div className="inline-flex items-center text-black mr-1">
          <DownArrowIcon
            width="6px"
            height="10px"
            fill="black"
            transform={openChildCat ? "rotate(90)" : "rotate(270)"}
            role="img"
            aria-labelledby="down arrow"
          />
        </div>
      )}
    </button>
  );
};

export interface FilterRow {
  data: any;
  activeID: any;
  handleSelect: any;
  selectedCats?: Array<string>;
  includeCheckBox?: boolean;
  includeArrow?: boolean;
}

export interface brandBucket {
  setSeletedBrands: any;
  brandBuckets: Array<string>;
  selectedBrands: any;
}

export interface priceBucket {
  selectedPrices: Array<{ priceOffer: { between: Array<number> } }>;
  setSelectedPrices: (arg1: Array<{ priceOffer: { between: Array<number> } }>) => void;
  priceBuckets: any;
}