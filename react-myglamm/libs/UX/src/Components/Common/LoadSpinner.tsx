import { getStaticUrl } from "@libUtils/getStaticUrl";
import * as React from "react";

interface LoadSpinnerProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

const LoadSpinner = (props: LoadSpinnerProps) => {
  const { className = "absolute m-auto left-0 right-0 bottom-0 top-0 w-16", ...ImageProps } = props;

  return (
    <img
      alt="Loading..."
      style={{ opacity: "1" }}
      className={className}
      src={getStaticUrl("/svg/spinner.svg")}
      {...ImageProps}
    />
  );
};

export default LoadSpinner;
