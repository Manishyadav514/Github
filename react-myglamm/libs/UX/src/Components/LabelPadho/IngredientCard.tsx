import React from "react";
import Image from "next/legacy/image";
import Link from "next/link";

import { GAgenericEvent } from "@libUtils/analytics/gtm";

type IngredientCardsProps = {
  title: string;
  description: string;
  effect: string;
  foundIn: string;
  category: string;
  image: string;
  productName: string;
  ctaLink: string;
};

const IngredientCards = ({
  title,
  description,
  effect,
  foundIn,
  category,
  image,
  productName,
  ctaLink,
}: IngredientCardsProps) => {
  const onIngredientCtaClick = (title: string) => {
    GAgenericEvent("engagement", "BBC Ingredient Click", title);
  };

  return (
    <div className="my-5">
      <div className="px-5 flex items-center space-x-6 bg-rose-100 py-4 h-24">
        <Image
          width={70}
          height={70}
          layout="intrinsic"
          objectFit="contain"
          alt={title}
          title={title}
          src={image}
          priority
          className="min-h-full z-0"
        />
        <div>
          <p className="text-base font-semibold"> {title}</p>
          <p dangerouslySetInnerHTML={{ __html: category }} />
        </div>
      </div>
      <div className="px-5 bg-rose-50 py-4  h-68 lg:h-60">
        <p className="text-sm mb-4 " dangerouslySetInnerHTML={{ __html: description }} />

        <div className="my-4">
          <p className="text-base font-semibold">Side Effects</p>
          <p className="text-sm" dangerouslySetInnerHTML={{ __html: effect }} />
        </div>
        <div>
          <p className="text-base font-semibold">Commonly Found In</p>
          <p className="text-sm" dangerouslySetInnerHTML={{ __html: foundIn }} />
        </div>
      </div>
      <div
        className="px-5 flex items-center justify-between bg-rose-100 py-6 font-semibold"
        onClick={() => onIngredientCtaClick(title)}
      >
        <p dangerouslySetInnerHTML={{ __html: productName }} />
        <button type="button" className={"bg-themePink text-sm font-semibold  uppercase  p-2  rounded text-white w-[120px]"}>
          <Link href={ctaLink} className="w-full block" aria-label="Shop Now">
            Shop Now
          </Link>
        </button>
      </div>
    </div>
  );
};

export default IngredientCards;
