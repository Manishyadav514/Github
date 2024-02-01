import React from "react";

import Link from "next/link";
import RawBtn from "@libComponents/CommonBBC/RawBtn";
import WidgetLabel from "@libComponents/HomeWidgets/WidgetLabel";

type PropTypes = {
  chatRoomList: {
    name: string;
    followers: number;
    images: string;
  }[];
  title: string;
};

const ChatCard = ({ groupDetails }: any) => {
  return (
    <Link href="http://app.babychakra.com/chat-suggestions" aria-label={groupDetails.name}>
      <div className="text-center w-[124px] min-w-[124px] mt-4">
        <img src={groupDetails?.images} alt="chat groups" className="w-[124px] h-[124px]" />
        <div className="pt-3">
          <p className="text-11 font-medium">{groupDetails.name}</p>
          <p className="text-gray-500 text-11">{groupDetails.followers} Followers</p>
        </div>
      </div>
    </Link>
  );
};

const ChatGroupCards = ({ title, chatRoomList }: PropTypes) => {
  return (
    <div className="chat-group-wrapper bg-white mt-4 lg:mt-0 py-4 lg:px-5 lg:py-5 lg:rounded-lg lg:border lg:border-grey1 hover:drop-shadow-xl ">
      <WidgetLabel title={title || "Explore our groups"} />
      <p className="px-4">share your concerns with other moms</p>
      <div className="flex space-x-4 overflow-x-auto items-center hide-scrollbar-css px-4">
        {chatRoomList.map(group => (
          <ChatCard key={group.name} groupDetails={group} />
        ))}
      </div>
      <div className="mx-auto text-center pt-4 px-8 ">
        <RawBtn
          buttonName="Explore More Groups"
          isNavigation
          customClassName="
               bg-color1
             text-base font-bold  uppercase font-bold  py-2  rounded text-white w-full lg:w-[350px] mx-auto"
          navigationUrl="http://app.babychakra.com/chat-suggestions"
        />
      </div>
    </div>
  );
};

export default ChatGroupCards;
