import React from "react";

import WebContentWrapper from "../../Components/common/wrappers/WebContentWrapper";
import WebSectionWrapper from "../../Components/common/wrappers/WebSectionWrapper";

const DisclaimerSection = () => {
  return (
    <>
      <WebSectionWrapper applyBorder>
        <WebContentWrapper className="px-3.5 py-5">
          <p className="text-sm text-gray-400 border-solid border border-grey3 rounded-md p-4 mb-0">
            Suggestions offered by doctors on BabyChakra are of advisory nature i.e., for educational and informational purposes
            only. Content posted on, created for, or compiled by BabyChakra is not intended or designed to replace your
            doctor&apos;s independent judgment about any symptom, condition, or the appropriateness or risks of a procedure or
            treatment for a given person.
          </p>
        </WebContentWrapper>
      </WebSectionWrapper>
    </>
  );
};

export default React.memo(DisclaimerSection);
