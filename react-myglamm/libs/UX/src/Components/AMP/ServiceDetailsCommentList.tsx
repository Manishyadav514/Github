import React from "react";
import ServiceDetailsComment from "./ServiceDetailsComment";

export default function ServiceDetailsCommentList({ comments }: any) {
  const list = comments?.data?.map((data: any) => (
    <ServiceDetailsComment key={data.id} relationalData={comments.relationalData} data={data} />
  ));

  return list;
}
