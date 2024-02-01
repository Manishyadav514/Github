import React from "react";

type SignInTextProps = {
  t: (value: string) => string;
};
function SignInUsing(props: SignInTextProps) {
  const { t } = props;
  return (
    <p className="text-center py-2 my-8 relative">
      <p
        style={{
          backgroundColor: "#e9e9e9",
          height: "1px",
          margin: "10px",
        }}
      >
        <span
          style={{
            backgroundColor: "#FFFFFF",
            position: "relative",
            padding: "12px",
            top: "-12px",
          }}
        >
          {t("signInUsing")}
        </span>
      </p>
    </p>
  );
}

export default SignInUsing;
