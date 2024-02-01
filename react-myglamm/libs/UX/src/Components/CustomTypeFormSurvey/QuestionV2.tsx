import ChoiceV2 from "./ChoiceV2";
import { useState } from "react";

const Choices = ({ question, qindex, questionId }: any) => {
  const [selected, setSelected] = useState<any>([]);
  return (
    question.choices &&
    question.choices.map((choice: any, index: any) => (
      <ChoiceV2
        question={question}
        qindex={qindex}
        label={choice.label}
        index={index}
        key={index}
        selected={selected}
        setSelected={setSelected}
        id={"Q" + qindex + "C" + index}
        questionId={questionId}
      />
    ))
  );
};

const QuestionV2 = ({ title, description, question, qindex, questionId }: any) => {
  return (
    <>
      <div className="">
        <div className="flex items-start">
          <span className="text-xl leading-6 text-white font-semibold">
            {title}
            {question.required ? "*" : ""}
          </span>
        </div>
        {/* Description */}
        <p className="text-sm opacity-70 md:text-xl ml-5">{description}</p>
      </div>

      <div className="inline-block mt-8 max-w-full">
        <div className="pb-4 space-y-5 flex flex-col">
          <Choices question={question} qindex={qindex} questionId={questionId} />
        </div>
      </div>
    </>
  );
};
export default QuestionV2;
