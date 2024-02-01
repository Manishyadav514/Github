import React from "react";
import Image from "next/image";
interface ChipProps {
  query: string;
  onClick: (query: string) => void;
}
interface ChipPropsV2 extends ChipProps {
  imgSRC: string;
}

const SearchChip = ({ query, onClick }: ChipProps) => (
  <button
    key={query}
    type="button"
    onClick={() => onClick(query)}
    style={{ fontSize: "13.5px" }}
    className="capitalize outline-none inline-block text-12 py-2 px-4 rounded-full mr-2 mb-2 text-gray-800 bg-color2 shadow-sm"
  >
    {query}
  </button>
);

export const SearchChipV2 = ({ query, imgSRC, onClick }: ChipPropsV2) => (
  <button
    type="button"
    key={query}
    onClick={() => onClick(query)}
    role="presentation"
    className="flex-sliderChild w-12 h-auto mr-3 flex flex-col items-center gap-1"
    aria-label={"multimedia.sliderText"}
  >
    <Image className="h-10 w-10 rounded-full border-[0.5px] border-gray-100" src={imgSRC} alt={imgSRC} height={40} width={40} />
    <p className="capitalize text-center text-xxs font-normal text-black line-clamp-2">{query}</p>
  </button>
);

export default SearchChip;
