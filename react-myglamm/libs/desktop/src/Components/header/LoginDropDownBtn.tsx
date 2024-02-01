import React from "react";

import { ValtioStore } from "@typesLib/ValtioStore";

import { useSelector } from "@libHooks/useValtioSelector";

import UserDropDown from "./UserDropDown";
import SignInSignUp from "./SignInSignUp";

const LoginDropDownBtn = ({ themed }: { themed?: boolean }) => {
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  if (userProfile?.id) {
    return <UserDropDown />;
  }

  return <SignInSignUp themed={themed} />;
};

export default LoginDropDownBtn;
