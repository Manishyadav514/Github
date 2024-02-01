import React from "react";
import Link from "next/link";

interface PropTypes {
  buttonName: string;
  buttonOnClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
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

const RawBtn = (props: PropTypes) => {
  const { buttonName, buttonOnClick, customClassName, isButtonDisabled, isNavigation, navigationUrl } = props;
  return (
    <>
      {isNavigation ? (
        <button type="button" className={`${customClassName}`} onClick={buttonOnClick} disabled={isButtonDisabled}>
          <Link href={navigationUrl as string} className="w-full block">
            {buttonName}
          </Link>
        </button>
      ) : (
        <button type="button" className={`${customClassName}`} onClick={buttonOnClick} disabled={isButtonDisabled}>
          {buttonName}
        </button>
      )}
    </>
  );
};
RawBtn.defaultProps = defaultProps;

export default React.memo(RawBtn);
