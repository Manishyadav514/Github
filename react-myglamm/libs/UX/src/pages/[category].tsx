import React from "react";

import dynamic from "next/dynamic";

import { getIntialPropsStaticPage, getIntialPropsSurvey, getIntialPropsSurveyThankyou } from "@libUtils/catchRouteUtils";

const Survey = dynamic(() => import("./survey"));
const SurveyThankYou = dynamic(() => import("./survey-thankyou"));
const CategoryStatic = dynamic(() => import("@libComponents/CatchRoute/categoryStatic"));

function Category(props: any) {
  switch (props.type) {
    case "survey":
      return <Survey {...props} />;

    case "survey-thankyou":
      return <SurveyThankYou {...props} />;

    default:
      return <CategoryStatic {...props} />;
  }
}

Category.getInitialProps = async (ctx: any) => {
  const slug = ctx?.query?.category;

  if (ctx?.configV3?.surveyUrl.includes(`/${slug}`)) {
    return getIntialPropsSurvey(ctx);
  }
  if (ctx?.configV3?.surveyUrl?.map((x: string) => `${x}-thankyou`).includes(`/${slug}`)) {
    return getIntialPropsSurveyThankyou(ctx);
  }
  return getIntialPropsStaticPage(ctx);
};

export default Category;
