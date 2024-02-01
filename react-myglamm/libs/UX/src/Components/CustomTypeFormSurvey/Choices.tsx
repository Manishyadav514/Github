import { useState } from "react";
import Choice from "./Choice";

const Choices = ({ question, qindex, required, questionId }: any) => {
  const [selected, setSelected] = useState<any>([]);
  return (
    question.choices &&
    question.choices.map((choice: any, index: any) => (
      <Choice
        question={question}
        qindex={qindex}
        required={required}
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

export default Choices;
