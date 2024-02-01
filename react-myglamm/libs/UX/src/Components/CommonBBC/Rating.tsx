import React from "react";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { getStaticUrl } from "@libUtils/getStaticUrl";

interface PropTypes {
  rating?: number;
}
const defaultProps = {
  rating: 0,
};

const Rating = (props: PropTypes) => {
  const { rating } = props;
  return (
    <span className="text-black rounded-lg bg-white text-xs py-0.5 px-2 border-solid border border-gray-300">
      <span className="mr-1">{rating || "--"}</span>
      <i aria-label="icon:star" className="inline-block" style={{ verticalAlign: "0" }}>
        <ImageComponent src={getStaticUrl("/images/bbc-g3/yellow-star.svg")} alt="star" width="10px" height="10px" />
      </i>
    </span>
  );
};
Rating.defaultProps = defaultProps;

export default React.memo(Rating);
