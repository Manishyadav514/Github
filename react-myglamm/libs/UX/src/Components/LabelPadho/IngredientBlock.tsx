import React, { useEffect, useState, useRef, LegacyRef } from "react";
import Image from "next/legacy/image";

import IngredientCards from "./IngredientCard";
import WidgetLabel from "@libComponents/HomeWidgets/WidgetLabel";
import CustomTabWithSwipe from "@libComponents/CommonBBC/CustomTabSwiper";

import CommonData from "@libUtils/jsondata/home-static.json";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

const ingredientInitials = ["A", "B", "C", "D", "E", "F", "H", "L", "M", "N", "P", "S", "T"];

const IngredientBlock = () => {
  const [currentSelectedAlphabet, setCurrentSelectedAlphabet] = useState("A");
  const ingredientOuter: LegacyRef<HTMLDivElement> = useRef(null);
  const [ingredients, setIngredients] = useState(
    CommonData?.ingredients?.list.cards.filter(item => item.initial === currentSelectedAlphabet)
  );

  const handleClick = (element: any) => {
    setCurrentSelectedAlphabet(element);

    const scrollPositionY = (ingredientOuter?.current as HTMLDivElement)?.getBoundingClientRect().top + window.scrollY - 90;
    window.scroll({
      top: scrollPositionY,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setIngredients(CommonData?.ingredients?.list.cards.filter(item => item.initial === currentSelectedAlphabet));
  }, [currentSelectedAlphabet]);

  return !IS_DESKTOP ? (
    <div className="relative">
      <div className="lg:px-28">
        <div className="text-center bg-yellow-50  py-10 relative">
          <div className="absolute left-1/3 top-0">
            <Image
              alt="Label Padho Moms Babychakra"
              src={
                IS_DESKTOP
                  ? "https://files.babychakra.com/site-images/original/img-desktop-bg-tab.png"
                  : "https://files.babychakra.com/site-images/original/tab-right-element.png"
              }
              priority
              width={IS_DESKTOP ? 1440 : 438}
              height={IS_DESKTOP ? 810 : 192}
              layout="intrinsic"
              objectFit="cover"
              title="Label Padho Moms Babychakra"
            />
          </div>
          <WidgetLabel
            title=" List of Harmful Ingredients"
            className="font-500
            text-center
            mt-10
            text-2xl"
          />
        </div>
      </div>

      <div className="px-6 pt-6 lg:absolute lg:top-5 lg:px-28 ">
        <div className="sticky top-[47px] bg-white " style={{ zIndex: 8 }}>
          <CustomTabWithSwipe
            allElements={ingredientInitials}
            noOfactiveElementsAtOneTime={5}
            showArrows
            activeElement={currentSelectedAlphabet}
            callBackOnClickOfTab={handleClick}
          />
        </div>
        <div
          ref={ingredientOuter}
          className="lg:grid lg:w-full lg:grid-cols-3 lg:gap-6 bg-white lg:px-8 lg:max-h-[400px] overflow-y-scroll"
        >
          {ingredients.map(item => (
            <IngredientCards
              key={item.name}
              title={item.name}
              description={item.description}
              effect={item.effect}
              foundIn={item.foundIn}
              category={item.category}
              productName={item.productName}
              ctaLink={item.cta}
              image={item.image}
            />
          ))}
        </div>
      </div>

      {!IS_DESKTOP ? (
        <div className="bg-yellow-50">
          <Image
            alt="Label Padho Moms BabyChakra"
            src={"https://files.babychakra.com/site-images/original/tab-bottom-element.png"}
            priority
            width={720}
            height={360}
            className=""
            layout="responsive"
            objectFit="cover"
            title="Label Padho Moms Babychakra"
          />
        </div>
      ) : (
        <span />
      )}
    </div>
  ) : (
    <div className="relative">
      <div className="block">
        <Image
          alt="Label Padho Moms Babychakra"
          src="https://files.babychakra.com/site-images/original/img-desktop-bg-tab.png"
          priority
          width="1440"
          height="810"
          layout="responsive"
          objectFit="cover"
          title="Label Padho Moms Babychakra"
          className=""
        />
      </div>
      <div className=" pt-6 absolute top-5 px-28 ">
        <WidgetLabel
          title=" List of Harmful Ingredients"
          className="font-500
            text-center
            mt-10
            text-4xl mx-auto"
        />
        <div className="flex justify-between bg-white px-8 py-4">
          {ingredientInitials.map(elem => {
            return (
              <div
                key={elem}
                className={`${
                  elem === currentSelectedAlphabet ? "border-b-4 border-color1 text-color1 " : "text-gray-400"
                } text-xl cursor-pointer font-semibold px-4 py-2`}
                onClick={() => setCurrentSelectedAlphabet(elem)}
              >
                {elem}
              </div>
            );
          })}
        </div>
        <div ref={ingredientOuter} className="grid w-full grid-cols-3 gap-6 bg-white px-8 max-h-[500px] overflow-y-scroll">
          {ingredients.map(item => (
            <IngredientCards
              key={item.name}
              title={item.name}
              description={item.description}
              effect={item.effect}
              foundIn={item.foundIn}
              category={item.category}
              productName={item.productName}
              ctaLink={item.cta}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IngredientBlock;
