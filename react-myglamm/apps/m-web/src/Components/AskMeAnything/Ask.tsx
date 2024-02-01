import React, { useState, useRef } from "react";

import clsx from "clsx";
import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

const Ask = ({ className }: any) => {
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef<any>();
  const handleQuestions = (e: any) => {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      // Add new message in Firestore
      const docData = {
        question: trimmedMessage,
        userName: profile?.firstName,
      };

      const consumerApi = new ConsumerAPI();
      consumerApi.postQuestionsToFirebase(docData, profile?.id).then(res => {});
      // Clear input field
      setNewMessage("");
      // Scroll down to the bottom of the list
    }
  };

  const handleOnChange = (e: any) => {
    setNewMessage(e.target.value);
  };
  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, [inputRef]);
  const handleKeyPress = (e: any) => {
    if (e.key !== "Enter") return;
    handleQuestions(e);
  };

  return (
    <div className={clsx(className || "", "")}>
      <div className="w-full bg-gray-200 rounded flex justify-between items-center">
        <input
          className="flex-grow m-2 outline-none py-2 px-2 bg-gray-200 resize-none"
          placeholder="Type question here"
          onChange={handleOnChange}
          ref={inputRef}
          value={newMessage}
          onKeyPress={handleKeyPress}
        />
        {/* {newMessage && ( */}
        <button onClick={handleQuestions} className="mr-4" type="button">
          <img src="https://files.myglamm.com/site-images/original/send-ico.png" className="w-7 py-2 " alt="send-ico" />
        </button>
        {/* )} */}
      </div>
    </div>
  );
};
export default Ask;
