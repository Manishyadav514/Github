import React, { useRef, useEffect, RefObject } from "react";

import useTranslation from "@libHooks/useTranslation";

import Intro from "@components/AskMeAnything/Intro";
import LoadSpinner from "@libComponents/Common/LoadSpinner";

const Answers = ({ answers, className, setExpandAll, expandAll }: any) => {
  const { t } = useTranslation();

  const AMA_CONFIG = t("amaConfig");

  const listRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [listRef.current, answers]);

  const viewAll = () => setExpandAll(!expandAll);

  return (
    <div className={`${className} bg-color2`}>
      <Intro className="" />

      <div className="overflow-y-scroll px-4 h-full" ref={listRef}>
        <div className="h-8 sticky bg-gradient-to-b from-color2 w-full top-0 inset-x-0" />

        {answers.length === 0 ? (
          <LoadSpinner className="fixed inset-0 w-16 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        ) : (
          <ul className="list-none">
            {answers?.map((questionAnswer: any) => (
              <React.Fragment key={questionAnswer.question}>
                <li className="text-left pb-2">
                  <div
                    className="px-4 py-2 inline-block  text-black rounded-tl-full rounded-tr-full rounded-bl-full"
                    style={{ background: "#fbd8da" }}
                  >
                    <div className="mr-2">
                      <span className="block text-10 font-thin italic text-gray-500">{questionAnswer?.userName}</span>
                      <p className="text-xs leading-none">{questionAnswer?.question}</p>
                    </div>
                  </div>
                </li>
                <li className="text-right pb-2">
                  <div className="pl-4 pr-2.5 py-2 inline-block rounded-bl-full text-white bg-color1 rounded-br-full rounded-tl-full">
                    <div className="relative pr-9 flex items-center justify-between w-full">
                      <div className="mr-2">
                        <span className="block text-10 italic">{AMA_CONFIG?.adminName}</span>
                        <p className="font-bold text-xs leading-none">{questionAnswer?.answer}</p>
                      </div>
                      <div>
                        <img
                          alt="Avatar"
                          src={AMA_CONFIG?.adminIcon}
                          className="float-right rounded-full w-9 absolute m-auto right-0 top-0 bottom-0"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              </React.Fragment>
            ))}
          </ul>
        )}

        <div className="h-8 sticky bg-gradient-to-t from-color2  w-full bottom-0 inset-x-0" />
      </div>
      {answers.length > 4 && (
        <a
          onClick={viewAll}
          role="presentation"
          className="text-xs font-bold tracking-widest underline flex pt-3 mx-auto justify-center uppercase pb-4"
          aria-label={!expandAll ? "View All" : "Back to Chat"}
        >
          {!expandAll ? "View All" : "Back to Chat"}
        </a>
      )}
    </div>
  );
};
export default Answers;
