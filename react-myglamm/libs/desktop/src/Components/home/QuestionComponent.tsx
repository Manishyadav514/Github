import React from "react";
import Link from "next/link";

import { getStaticUrl } from "@libUtils/getStaticUrl";

import HomeWidgetLabel from "./HomeWidgetLabel";

type QuestionProp = {
  question: any;
};

const QuestionCard = ({ question }: QuestionProp) => {
  const { slug, text } = question;
  return (
    <Link href={`/community/questions/${slug}`} passHref>
      <div className="bg-white py-3 border-b border-b-gray-200 cursor-pointer">
        <span className="flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <img src={getStaticUrl("/svg/q-ico.svg")} alt="question-icon" className=" transition" />
            <span
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: text?.slice(0, 120) + (text?.length > 120 ? "..." : "") }}
            />
          </div>
          <img src={getStaticUrl("/images/bbc-g3/arrow-faq-ico.svg")} alt="arrow" className="rotate-90  transition" />
        </span>
      </div>
    </Link>
  );
};

type QuestionComponentWrapperProps = {
  title: string;
  subtitle: string;
  questionList: any;
};

const QuestionComponentWrapper = ({ title, subtitle, questionList }: QuestionComponentWrapperProps) => {
  return (
    <div className="bg-white  py-5 rounded-lg border  hover:drop-shadow-xl">
      <HomeWidgetLabel title={title || "Trending Questions"} />
      <p className="text-grey4 text-sm px-6">{subtitle}</p>
      <div className="">
        {questionList?.length > 0 ? (
          questionList.map((question: any) => <QuestionCard question={question} key={question.id} />)
        ) : (
          <span />
        )}
      </div>
    </div>
  );
};

export default QuestionComponentWrapper;
