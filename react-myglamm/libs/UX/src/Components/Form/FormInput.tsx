import React, { forwardRef } from "react";
import { DeepRequired, FieldErrorsImpl } from "react-hook-form";

import { addressInitialValues } from "@typesLib/Consumer";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

interface FormInputProps<T> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: keyof addressInitialValues;
  labelClassName?: string;
  labelStyle?: React.CSSProperties;
  value?: any;
  handleBlur?: any;
  handleChange?: any;
  errors: FieldErrorsImpl<DeepRequired<addressInitialValues>>;
  touched: any;
  label: string;
  isRequired: boolean;
  disabled?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps<addressInitialValues>>((props, ref) => {
  const { touched, errors, label, isRequired, disabled, name, labelClassName, labelStyle, ...inputProps } = props;

  if (IS_DESKTOP) {
    return (
      <div className={`relative w-full border rounded p-3 ${disabled ? "bg-gray-100" : ""}`}>
        <label
          style={labelStyle}
          htmlFor={name as string}
          className="capitalize text-sm bg-white absolute left-3 -top-2 px-1 z-10 text-stone-500 font-normal"
        >
          {label}
          {isRequired && <sup>* </sup>}
        </label>
        <input
          {...props}
          type="text"
          ref={ref}
          id={name}
          name={name}
          disabled={false}
          onKeyPress={e => {
            if (disabled) e.preventDefault();
          }}
          className="w-full outline-none bg-transparent"
        />
        {errors?.[name] && touched[name] && <span className="block text-sm text-red-600">{errors[name]?.message}</span>}
      </div>
    );
  }

  return (
    <div className="input-element-wrapper relative w-full pb-6">
      <label
        htmlFor={name}
        style={labelStyle}
        className="capitalize text-11 bg-white rounded absolute left-1 -top-2 px-1 z-10 text-stone-500"
      >
        {label}
        {isRequired && <sup>* </sup>}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        disabled={disabled}
        ref={ref}
        {...inputProps}
        role="textbox"
        aria-label="edit user address"
      />
      {errors[name] && touched[name] && <span className="block text-sm text-red-600">{errors[name]?.message}</span>}
    </div>
  );
});

export default FormInput;
