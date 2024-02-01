import React from "react";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

const SignInSignUp = ({ themed }: { themed?: boolean }) => (
  <div className="cursor-pointer relative text-right" onClick={() => SHOW_LOGIN_MODAL({ show: true })}>
    <img
      src={
        themed
          ? "https://files.myglamm.com/site-images/original/user_1.png"
          : "https://files.myglamm.com/site-images/original/icons8-customer-64.png"
      }
      height={34}
      width={34}
    />
  </div>
);

export default SignInSignUp;
