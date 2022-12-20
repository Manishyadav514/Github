import { AutoComplete } from "./components/AutoComplete";
import { StatusSelector } from "./components/StatusSelector";
import {
  CFShow,
  CFFor,
  CFIndex,
  CFSwitch,
  CFDynamic,
  CFPortal,
  CFErrorBoundary,
} from "./components/ControlFLow";
import { CouponCode } from "./components/CouponCode";

// import { LCOnMount, LCOnCleanup } from "./components/LifeCycle";
import "./global.css";
function App() {
  return (
    <>
      {/* <StatusSelector />
      <CFShow />
      <CFFor />
      <CFIndex />
      <CFSwitch />
      <CFDynamic />
      <CFPortal />
      <CFErrorBoundary /> */}
      {/* <LCOnMount /> */}
      {/* <LCOnCleanup /> */}

      {/* <AutoComplete /> */}
      <CouponCode
        code={"50LCOUPONS5A97C37F78"}
        generated={"14 Oct 2022"}
        validTill={"15 Oct 2022"}
        usage={"0"}
        discountAmount={1000}
      />
    </>
  );
}

export default App;
