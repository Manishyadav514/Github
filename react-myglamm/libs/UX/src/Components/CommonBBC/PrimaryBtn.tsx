import React from "react";
import Link from "next/link";

interface PropTypes {
  buttonName: string;
  buttonOnClick?: () => void;
  customClassName?: string;
  isNavigation?: boolean;
  navigationUrl?: string;
  isDisabled?: boolean;
}
const defaultProps = {
  buttonOnClick: () => {
    // do nothing.
  },
  customClassName: "",
  isNavigation: false,
  navigationUrl: "",
  isDisabled: false,
};
const PrimaryBtn = (props: PropTypes) => {
  const { buttonName, buttonOnClick, customClassName, isNavigation, navigationUrl, isDisabled } = props;
  const btnCss = isDisabled ? "cursor-default bg-neutral-100 text-slate-400" : "text-color1 border-color1 bg-white";
  return (
    <>
      {isNavigation ? (
        <Link href={navigationUrl as string}>
          <button
            type="button"
            className={`${btnCss} uppercase text-xs font-bold border-solid border pt-2 pb-2 px-2.5 rounded whitespace-nowrap ${customClassName} `}
          >
            {buttonName}
          </button>
        </Link>
      ) : (
        <button
          type="button"
          className={`${btnCss} uppercase text-xs font-bold border-solid border pt-2 pb-2 px-2.5 rounded whitespace-nowrap ${customClassName} `}
          onClick={buttonOnClick}
        >
          {buttonName}
        </button>
      )}
    </>
  );
};
PrimaryBtn.defaultProps = defaultProps;

export default React.memo(PrimaryBtn);
