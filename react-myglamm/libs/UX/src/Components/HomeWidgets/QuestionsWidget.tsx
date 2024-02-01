import React from "react";
import Link from "next/link";
import WidgetLabel from "./WidgetLabel";
import { getStaticUrl } from "@libUtils/getStaticUrl";

interface QuestionResponse {
  id: number;
  text: string;
  slug: string;
}

type QuestionProp = {
  question: QuestionResponse;
};

const QuestionCard = ({ question }: QuestionProp) => {
  const { slug, text } = question;
  return (
    <Link href={`/community/questions/${slug}`} passHref aria-label="questions">
      <div className="bg-white py-4 border-b border-b-gray-200 cursor-pointer">
        <span className="flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <img src={getStaticUrl("/svg/q-ico.svg")} alt="question-icon" className=" transition" />
            <p className="" dangerouslySetInnerHTML={{ __html: text?.slice(0, 120) + (text?.length > 120 ? "..." : "") }} />
          </div>
          <img src={getStaticUrl("/svg/arrow-faq-ico.svg")} alt="arrow" className="rotate-90  transition" />
        </span>
      </div>
    </Link>
  );
};

type QuestionWidgetProps = {
  title: string;
  subtitle: string;
  questionList: QuestionResponse[];
};

const QuestionWidget = ({ title, subtitle, questionList }: QuestionWidgetProps) => {
  return (
    <div className="bg-white pt-4  lg:py-5 lg:rounded-lg lg:border lg:border-grey1 hover:drop-shadow-xl">
      <WidgetLabel title={title || "Trending Questions"} />
      <p className="text-grey4 text-sm px-4 lg:px-6">{subtitle}</p>
      <div className="pt-4">
        {questionList?.length > 0 ? (
          questionList.map(question => <QuestionCard question={question} key={question.id} />)
        ) : (
          <span />
        )}
      </div>
    </div>
  );
};

export default QuestionWidget;
