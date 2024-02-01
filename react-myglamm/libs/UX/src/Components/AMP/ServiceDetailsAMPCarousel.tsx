import React from "react";

export default function ServiceDetailsAMPCarousel({ images }: any) {
  const list = images?.map((img: any) => <amp-img key={img} src={img} width="450" height="300" />);

  return (
    //  @ts-ignore
    <amp-carousel controls width="450" height="300" layout="responsive" type="slides" role="region" aria-label="Basic carousel">
      {list}
      {/* @ts-ignore */}
    </amp-carousel>
  );
}
