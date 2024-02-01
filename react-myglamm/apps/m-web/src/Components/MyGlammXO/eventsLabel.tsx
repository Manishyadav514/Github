import React from "react";

const EventsLabel = ({ title }: any) => (
  <div className="py-8">
    <h3
      className="bg-white font-semibold uppercase mx-auto px-8 leading-snug"
      style={{
        fontSize: "18px",
        width: "max-content",
        textAlign: "center",
        letterSpacing: "2.45px",
      }}
    >
      {title}
    </h3>
  </div>
);

export default EventsLabel;
