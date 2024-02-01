import React, { useRef, useEffect } from "react";

const Questions = ({ questions, className }: any) => {
  const bottomListRef = useRef<any>();
  useEffect(() => {
    if (bottomListRef?.current) {
      bottomListRef.current.scrollTop = bottomListRef.current.scrollHeight;
    }
  }, [bottomListRef, questions]);

  return (
    <div className={`${className} relative `} ref={bottomListRef}>
      <div className="h-8 sticky bg-gradient-to-b from-white  w-full top-0 inset-x-0" />
      <div className="px-4 flex flex-col">
        {questions?.map((message: any) => (
          <div key={message.id} className="mr-auto  pb-3 px-1 flex">
            <span className="font-bold text-xs pr-1">{message?.userName}:</span>
            <span className="italic text-gray-500 text-xs">{message?.question}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
