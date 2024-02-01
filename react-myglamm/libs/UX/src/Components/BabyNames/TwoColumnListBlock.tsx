import Link from "next/link";
import React, { Fragment } from "react";
import { BabyNamesObject } from "@typesLib/babyNamesTypes";

type PropTypes = {
  titles: [string, string];
  list: BabyNamesObject[];
  headingClass: string;
  bodyClass: string;
};

const TwoColumnListBlock = ({ titles, list, headingClass, bodyClass }: PropTypes) => {
  if (!list || list?.length === 0) {
    return <div className={`text-center py-4 rounded-lg ${bodyClass}`}> No Names Are Available</div>;
  }
  return (
    <div className="my-4  rounded-lg">
      <div className={`grid grid-cols-3 py-3  font-medium rounded-t-lg ${headingClass}`}>
        {titles.map((title, index) => (
          <p key={title} className={`${index === 1 && "col-span-2"} text-black px-4 capitalize`}>
            {title}
          </p>
        ))}
      </div>
      <div className={`grid grid-cols-3  rounded-b-lg pb-2 ${bodyClass}`}>
        {list?.map(elem => (
          <Fragment key={elem?.name}>
            <Link
              href={`/baby-names/${elem.slug.toLocaleLowerCase()}-meaning`}
              passHref
              className="col-span-1 px-4 py-2.5  underline"
              aria-label={elem.name}
            >
              <p className="font-semibold capitalize truncate" key={elem.name}>
                {elem.name}
              </p>
            </Link>
            <p className="col-span-2 px-4 py-2.5" key={elem.name}>
              {elem.meaning}
            </p>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default TwoColumnListBlock;
