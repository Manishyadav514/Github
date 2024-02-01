import { getStaticUrl } from "@libUtils/getStaticUrl";
import Link from "next/link";
import React from "react";

type categoryListType = {
  link: string;
  text: string;
};

type UISectionType = {
  title: string;
  mainCardThemeClass: string;
  cardThemeClass: string;
  categoryList: categoryListType[];
};

// Extends UI Section Type
type ModuleCategoryListProps = UISectionType & {
  image: string;
};

type CategoryProp = {
  category: categoryListType;
  cardThemeClass: string;
};

const CategoryCards = ({ category, cardThemeClass }: CategoryProp) => {
  const { link, text } = category;
  return (
    <Link href={link} passHref className="cursor-pointer " aria-label={text}>
      <div className={`space-x-3 py-4 lg:py-2 ${cardThemeClass}`}>
        <div className="flex justify-between space-x-3 lg:justify-start  lg:pr-2">
          <p className="lg:text-sm  capitalize">{text}</p>
          <img src={getStaticUrl("/svg/arrow-faq-ico.svg")} alt="arrow" className="rotate-90  transition" />
        </div>
      </div>
    </Link>
  );
};

const UISection = ({ title, mainCardThemeClass, cardThemeClass, categoryList }: UISectionType) => {
  return (
    <div className="list-card rounded-lg  w-[90%]  mx-[5%] lg:py-6 lg:rounded-none lg:w-full  lg:mx-0 lg:px-8 lg:mr-6 lg:flex lg:flex-col lg:flex-wrap ">
      <p dangerouslySetInnerHTML={{ __html: title }} className="font-medium text-xl hidden" />
      <div className={`p-6 lg:p-0  lg:flex  lg:flex-wrap rounded-lg  ${mainCardThemeClass}`}>
        {categoryList?.map(category => (
          <CategoryCards category={category} key={category.link} cardThemeClass={cardThemeClass} />
        ))}
      </div>
    </div>
  );
};

const ModuleCategoryListCard = (props: ModuleCategoryListProps) => {
  const { image, title, mainCardThemeClass, categoryList, cardThemeClass } = props;
  return (
    <div className={`module-category-card bg-white my-4 pb-4 lg:pb-0 lg:flex lg:w-[75%] lg:mx-auto  `}>
      <div className="absolute lg:relative">
        <img src={image} alt={title} className="lg:w-[450px]" />
        <div className="absolute top-1/3 left-3 ">
          <p dangerouslySetInnerHTML={{ __html: title }} className="pl-8 font-medium text-xl  lg:hidden" />
        </div>
      </div>
      <div className="relative w-full pt-32 md:p-0 lg:hidden">
        <UISection
          title={title}
          mainCardThemeClass={mainCardThemeClass}
          cardThemeClass={cardThemeClass}
          categoryList={categoryList}
        />
      </div>
      <div className={`relative w-full pt-32 md:p-0 hidden lg:block ${mainCardThemeClass}`}>
        <UISection
          title={title}
          mainCardThemeClass={mainCardThemeClass}
          cardThemeClass={cardThemeClass}
          categoryList={categoryList}
        />
      </div>
    </div>
  );
};

export default ModuleCategoryListCard;
