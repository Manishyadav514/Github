import React, { useState } from "react";
import Image from "next/legacy/image";

import { useRouter } from "next/router";
import { constructNewPath } from "@libUtils/helper";
import { getStaticUrl } from "@libUtils/getStaticUrl";

const LIFESTAGES = [
  {
    id: 6,
    name: "Pregnant",
    pinkIcon: getStaticUrl("/svg/lifestage-icons/pregnant-pink-icon.svg"),
    whiteIcon: getStaticUrl("/svg/lifestage-icons/pregnant-white-icon.svg"),
    title: "Pregnant",
    dateInput: "My Due Date is",
    slug: "expecting-a-baby",
    options: "expecting, pregnant",
    text: "Enter your due date to help us serve you better experience",
  },
  {
    id: 4,
    name: "Parent of 0-2 years",
    pinkIcon: getStaticUrl("/svg/lifestage-icons/parent-pink-icon.svg"),
    whiteIcon: getStaticUrl("/svg/lifestage-icons/parent-white-icon.svg"),
    title: "New Parent",
    dateInput: "My Child's Date of Birth",
    slug: "new-parents",
    options: "new parent",
    text: "Enter your child's date of birth to help us serve you better experience",
  },
  {
    id: 5,
    name: "Parent of 2+ years",
    pinkIcon: getStaticUrl("/svg/lifestage-icons/child-pink-icon.svg"),
    whiteIcon: getStaticUrl("/svg/lifestage-icons/child-white-icon.svg"),
    title: "Toddler",
    dateInput: "My Child's Date of Birth",
    slug: "toddler",
    options: "toddler",
    text: "Enter your child's date of birth to help us serve you better experience",
  },
];

const LifeStageSelectionDropDown = (props: any) => {
  const { selectedLifeStage, setSelectedLifeStage } = props;
  const [isLifeStageDropDownOpen, setIsLifeStageDropDownOpen] = useState(false);
  const router = useRouter();

  const getLifestageTranslation = (lifestageSlug: any) => {
    if (lifestageSlug === "expecting-a-baby") {
      return "Pregnant";
    }
    if (lifestageSlug === "new-parents") {
      return "New Parent";
    }
    return "Toddler";
  };

  const handleLifeStageSelection = (lifeStage: any) => {
    setSelectedLifeStage(lifeStage);
    setIsLifeStageDropDownOpen(false);
    const newQuery = constructNewPath(router?.query, { lifestage: lifeStage?.slug, page: 1 });
    router.push(
      {
        query: {
          ...newQuery,
        },
      }
      // { shallow: true }
    );
  };
  return (
    <div className="md:w-4/12 lg:w-4/12 text-center mx-auto pb-4 ">
      <div className="" role="button" tabIndex={0} onClick={() => setIsLifeStageDropDownOpen(prev => !prev)}>
        {!selectedLifeStage?.name ? (
          <div className="flex justify-between bg-themePink px-6 py-4 text-white font-bold rounded">
            <div> Select your LifeStage</div>
            <Image
              alt="arrow"
              className={`${isLifeStageDropDownOpen ? "rotate-180" : ""} transform`}
              src={getStaticUrl("/svg/small-white-arrow.svg")}
              objectFit="contain"
              height="8"
              width="15"
            />
          </div>
        ) : (
          <div role="button" tabIndex={0} className="flex py-3 px-6 bg-themePink items-center justify-between rounded">
            <div className="flex  items-center">
              <Image
                alt={selectedLifeStage?.name}
                className=""
                src={selectedLifeStage?.whiteIcon}
                objectFit="contain"
                height="30"
                width="30"
              />
              <p className="pl-8 text-white font-bold text-base"> {getLifestageTranslation(selectedLifeStage.slug)} </p>
            </div>
            <Image
              alt="arrow"
              className={`${isLifeStageDropDownOpen ? "rotate-180" : ""} transform`}
              src={getStaticUrl("/svg/small-white-arrow.svg")}
              objectFit="contain"
              height="8"
              width="15"
            />
          </div>
        )}
      </div>
      {isLifeStageDropDownOpen ? (
        <div className="border absolute w-11/12 bg-white md:w-3/12 lg:w-3/12" style={{ zIndex: "5" }}>
          {LIFESTAGES.map(lifestage => (
            <div
              role="button"
              tabIndex={lifestage.id}
              key={`lifestage_${lifestage.id}`}
              className="flex py-4 px-6 border-b border-grey-700 items-center hover:border hover:border-pink-400"
              onClick={() => handleLifeStageSelection(lifestage)}
            >
              <Image alt={lifestage.name} className="" src={lifestage.pinkIcon} objectFit="contain" height="30" width="30" />
              <div className="pl-8 text-black font-base"> {getLifestageTranslation(lifestage?.slug)} </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
export default React.memo(LifeStageSelectionDropDown);
