import React from "react";

interface PropTypes {
  children: React.ReactNode;
  applyBorder?: boolean;
  className?: string;
}
const defaultProps = {
  applyBorder: false,
  className: "",
};
const WebSectionWrapper = (props: PropTypes) => {
  const { children, applyBorder, className } = props;
  let classNameList = applyBorder ? "sm:border-solid sm:border-b sm:border-grey8" : "";
  classNameList = `${classNameList} ${className || ""}`;
  return <section className={classNameList}>{children}</section>;
};

WebSectionWrapper.defaultProps = defaultProps;

export default React.memo(WebSectionWrapper);
