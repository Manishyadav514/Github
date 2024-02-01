import React from "react";

const GlammExclusives = ({ data }: any) => (
  <div
    dangerouslySetInnerHTML={{
      __html: data.commonDetails?.description,
    }}
  />
);

export default GlammExclusives;
