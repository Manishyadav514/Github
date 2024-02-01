import React, { useState } from "react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";

import Link from "next/link";
import RawBtn from "@libComponents/CommonBBC/RawBtn";

type GenderType = {
  title: "BOY" | "GIRL" | "UNISEX";
  image: string;
  id: number;
  link: string;
};

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
];

const lastTwoAlpha = ["Y", "Z"];

const BabyNameSelector = () => {
  const [selectedAlphabet, setSelectedAlphabet] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const router = useRouter();

  const handleAlphabetClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): boolean => {
    if (selectedGender) {
      e.preventDefault();
      return false;
    }
    return true;
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 p-4 my-2 to-rose-200  lg:text-center lg:py-16">
      <div className="flex flex-col  items-center justify-center lg:space-x-8 lg:flex-row ">
        {!router?.query?.slug?.[0].includes("-meaning") ? (
          <div className="pl-12 ">
            <Image
              width={130}
              height={130}
              layout="intrinsic"
              objectFit="contain"
              alt="baby elephant"
              title="baby elephant"
              src="https://files.babychakra.com/site-images/original/baby-elephant.png"
              priority
            />
          </div>
        ) : (
          <span />
        )}
        {!router?.query?.slug?.[0].includes("-meaning") ? (
          <>
            <div className="text-center lg:text-left">
              <h1 className="text-amber-800  text-2xl font-semibold">Baby Names & Meanings</h1>
              <p className="text-lg my-4 hidden lg:block">
                Finding a perfect name for your baby might be a daunting task! But worry not because
                <br /> we have got you covered with a list of 20000+ unique
                <br />
                yet meaningful Baby Boy Names and Baby Girl names for your little one.
                <br /> So, ladies and gentlemen, if you’ve been looking for a perfect name for your baby
                <br /> then you’ve come to the right place!
              </p>
              <p className="text-md my-4 lg:hidden">
                Finding a perfect name for your baby might be a daunting task! But worry not because we have got you covered
                with a list of 20000+ unique yet meaningful Baby Boy Names and Baby Girl names for your little one. So, ladies
                and gentlemen, if you’ve been looking for a perfect name for your baby then you’ve come to the right place!
              </p>
            </div>
          </>
        ) : (
          <span />
        )}
      </div>
      <div className="px-8 py-6 rounded-lg bg-white lg:w-[94%] lg:mx-auto">
        <p className="text-grey4 pb-4 text-center">Select Baby Gender</p>
        <div className="flex items-center space-x-3 justify-center lg:justify-center">
          {[
            { title: "Boy", image: "https://files.babychakra.com/site-images/original/boy-img.png", id: 1, link: "boys" },
            { title: "Girl", image: " https://files.babychakra.com/site-images/original/girl-img.png", id: 2, link: "girls" },
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
              } w-[75px] cursor-pointer h-[90px] relative text-center border rounded-md lg:flex lg:space-x-6 lg:w-[170px] lg:h-[60px] lg:justify-center lg:items-center`}
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
              <p className={gender.title === selectedGender ? "text-rose-300 pt-2" : "pt-2"}> {gender.title}</p>
            </button>
          ))}
        </div>

        <p className="text-grey4 pt-8 pb-4">Baby Names Starting With Alphabet</p>
        <div className=" lg:flex items-center  lg:flex-col  ">
          <div className="grid  grid-cols-6  gap-3 lg:justify-center lg:grid-cols-12 ">
            {alphabet.map(alpha => (
              <Link
                href={`/baby-names/${
                  selectedGender ? `${selectedGender.toLocaleLowerCase()}/` : ""
                }starting-with-${alpha.toLocaleLowerCase()}`}
                key={alpha}
                onClick={e => handleAlphabetClick(e)}
                className={`${
                  alpha === selectedAlphabet ? " bg-rose-300 text-white" : "bg-rose-100"
                }  w-[37px] h-[37px] text-center py-2.5 rounded-md cursor-pointer`}
                aria-label={alpha}
              >
                <span
                  className={`${alpha === selectedAlphabet ? " bg-rose-300 text-white" : "bg-rose-100"}`}
                  onClick={() => {
                    if (alpha === selectedAlphabet) {
                      setSelectedAlphabet("");
                    } else {
                      setSelectedAlphabet(alpha);
                    }
                  }}
                >
                  {alpha}
                </span>
              </Link>
            ))}
          </div>
          <div className="flex justify-center mx-auto  py-3 space-x-4 lg:space-x-3">
            {lastTwoAlpha.map(alpha => (
              <Link
                href={`/baby-names/${
                  selectedGender ? `${selectedGender.toLocaleLowerCase()}/` : ""
                }starting-with-${alpha.toLocaleLowerCase()}`}
                key={alpha}
                className={`${
                  alpha === selectedAlphabet ? " bg-rose-300 text-white" : "bg-rose-100"
                }  w-[37px] h-[37px] text-center py-2.5 rounded-md cursor-pointer`}
                onClick={e => handleAlphabetClick(e)}
                aria-label={alpha}
              >
                <span
                  key={alpha}
                  className={`${alpha === selectedAlphabet ? " bg-rose-300 text-white" : "bg-rose-100"}`}
                  onClick={() => setSelectedAlphabet(alpha)}
                >
                  {alpha}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mx-auto text-center py-8">
          <RawBtn
            buttonName="Find Names"
            isNavigation
            customClassName={`${
              !(selectedAlphabet || selectedGender) ? "bg-gray-300 pointer-events-none" : "bg-themePink"
            } text-base font-bold  uppercase font-bold  py-2  rounded text-white w-full lg:w-[350px] mx-auto`}
            isButtonDisabled={!(selectedAlphabet || selectedGender)}
            navigationUrl={`/baby-names${selectedGender ? `/${selectedGender.toLocaleLowerCase()}` : ""}${
              selectedAlphabet ? `/starting-with-${selectedAlphabet.toLocaleLowerCase()}` : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default BabyNameSelector;
