import React from "react";
import Link from "next/link";

interface PropTypes {
  buttonName: string;
  buttonOnClick?: () => void;
  customClassName?: string;
  isButtonDisabled?: boolean;
  isNavigation?: boolean;
  navigationUrl?: string;
}

const defaultProps = {
  buttonOnClick: () => {
    // do nothing.
  },
  customClassName: "",
  isButtonDisabled: false,
  isNavigation: false,
  navigationUrl: "",
};

const SecondaryBtn = (props: PropTypes) => {
  const { buttonName, buttonOnClick, customClassName, isButtonDisabled, isNavigation, navigationUrl } = props;
  return (
    <>
      {isNavigation ? (
        <button
          type="button"
          className={`${customClassName} text-sm font-black text-white rounded bg-color1 uppercase pl-8 pr-8 pt-2 pb-2 `}
          onClick={buttonOnClick}
          disabled={isButtonDisabled}
        >
          <Link href={navigationUrl as string}>{buttonName}</Link>
        </button>
      ) : (
        <button
          type="button"
          className={`${customClassName} text-xs font-black text-white rounded bg-color1 uppercase pl-5 pr-5 pt-2 pb-2 `}
          onClick={buttonOnClick}
          disabled={isButtonDisabled}
        >
          {buttonName}
        </button>
      )}
    </>
  );
};
SecondaryBtn.defaultProps = defaultProps;

export default React.memo(SecondaryBtn);
