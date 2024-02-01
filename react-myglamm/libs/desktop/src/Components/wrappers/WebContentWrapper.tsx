import React from "react";

interface PropTypes {
  children: React.ReactNode;
  className?: string;
}
const defaultProps = {
  className: "",
};
const WebContentWrapper = (props: PropTypes) => {
  const { children, className } = props;
  return (
    <div className={`sm:w-[600px] sm:block sm:mx-auto lg:w-[900px] lg:block lg:mx-auto ${className || ""}`}>{children}</div>
  );
};

WebContentWrapper.defaultProps = defaultProps;

export default React.memo(WebContentWrapper);
