import * as React from "react";

type LabelProp = {
  label: string;
  className?: string;
};

const Label = ({ label, className }: LabelProp) => (
  <h1 className={className || "text-xl text-center text-black font-bold mb-4"}>{label}</h1>
);

export default Label;
