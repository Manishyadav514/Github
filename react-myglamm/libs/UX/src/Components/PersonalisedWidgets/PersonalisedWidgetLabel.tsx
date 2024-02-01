import React from "react";

import Star from "../../../public/svg/whiteStar.svg";

const PersonalisedWidgetLabel = ({ title }: any) => (
  <h3
    className="p-1 flex font-semibold text-sm pr-4 pl-0 capitalize"
    style={{
      width: "max-content",
      background: "linear-gradient(to left, #f0dbaa 0%, #cfa251 100%)",
      borderRadius: "0 7px 7px 0",
    }}
  >
    <Star className="mt-1 mx-3" /> {title}
  </h3>
);

export default PersonalisedWidgetLabel;
