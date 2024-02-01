import React, { useState } from "react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import RawBtn from "@libComponents/CommonBBC/RawBtn";

type GenderType = {
  title: "BOY" | "GIRL" | "UNISEX";
  image: string;
  id: number;
  link: string;
};

const GenderSelector = ({ pageType }: any) => {
  const [selectedGender, setSelectedGender] = useState<string>("");
  const router = useRouter();
  const filterName = router?.query?.slug?.[0]?.split("-")?.[0];
  return (
    <div className="bg-gradient-to-r from-blue-100 p-4 my-4 to-rose-200 ">
      <div className="px-8 py-6 rounded-lg bg-white  ">
        <p className="text-grey4 pb-4 text-center">Select Baby Gender</p>
        <div className="flex items-center space-x-3 justify-center">
          {[
            { title: "Boy", image: "https://files.babychakra.com/site-images/original/boy-img.png ", id: 1, link: "boys" },
            { title: "Girl", image: "https://files.babychakra.com/site-images/original/girl-img.png", id: 2, link: "girls" },
          ].map((gender: any) => (
            <button
              key={gender.id}
              type="button"
              onClick={() => {
                if (gender.link === selectedGender) {
                  setSelectedGender("");
                } else {
                  setSelectedGender(gender.link);
                }
              }}
              className={`${
                gender.link === selectedGender && " border-rose-300"
              } w-[75px] cursor-pointer h-[90px] relative text-center border rounded-md `}
            >
              <Image
                width="39"
                height="39"
                layout="intrinsic"
                objectFit="contain"
                alt={gender.title}
                title={gender.title}
                src={gender.image}
                priority
              />
              <p className={gender.title === selectedGender ? "text-rose-300 pt-2 " : "pt-2 "}> {gender.title}</p>
            </button>
          ))}
        </div>
        <div className="mx-auto text-center pt-8">
          <RawBtn
            buttonName="Find Names"
            isNavigation
            customClassName={`${
              !selectedGender ? "bg-gray-300 pointer-events-none" : "bg-themePink"
            } text-base font-bold  uppercase font-bold  py-2 px-8 rounded text-white w-full  mx-auto`}
            isButtonDisabled={!selectedGender}
            navigationUrl={`${
              pageType === "ALPHABET"
                ? `/baby-names${
                    selectedGender.toLocaleLowerCase()
                      ? `/${selectedGender.toLocaleLowerCase()}${selectedGender !== "unisex" ? "" : ""}`
                      : ""
                  }/${router?.query?.slug?.[0]}`
                : filterName === "south"
                ? `/baby-names/south-indian/${selectedGender.toLocaleLowerCase()}`
                : `/baby-names/${filterName}/${selectedGender.toLocaleLowerCase()}`
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default GenderSelector;
