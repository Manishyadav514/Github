import React, { forwardRef } from "react";

import { DeepRequired, FieldErrorsImpl, UseFormReturn } from "react-hook-form";

import { addressInitialValues } from "@typesLib/Consumer";

import DownArrow from "../../../public/svg/down-arrow.svg";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";

/* @ts-ignore */
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
  form?: UseFormReturn<addressInitialValues, any>;
}

const FormSelect = forwardRef<HTMLInputElement, FormInputProps<addressInitialValues>>((props, ref) => {
  const { touched, errors, label, isRequired, disabled, name, children, form } = props;

  if (IS_DESKTOP) {
    return (
      <div className="relative w-full border rounded p-3">
        <label
          htmlFor={name as string}
          className="capitalize text-11 bg-white rounded absolute left-3 -top-2 px-1 z-10 text-stone-500 font-normal"
        >
          {label}
          {isRequired && <sup>* </sup>}
        </label>

        <DownArrow className="z-10 absolute right-4 inset-y-0 my-auto" />

        <select
          ref={ref as any}
          disabled={disabled}
          name={name as string}
          className="truncate pr-5 w-full bg-transparent outline-none"
        >
          {children}
        </select>

        {errors[name] && touched[name] && <span className="block text-sm text-red-600">{errors[name]?.message}</span>}
      </div>
    );
  }

  return (
    <div className="input-element-wrapper relative w-full mb-6">
      <label htmlFor={name} className="capitalize text-11 bg-white rounded absolute left-1 -top-2 px-1 z-10 text-stone-500">
        {label}
        {isRequired && <sup>* </sup>}
      </label>

      <DownArrow className="z-10 absolute right-4 inset-y-0 my-auto" />

      <select
        disabled={disabled}
        /* @ts-ignore */
        ref={ref}
        name={name}
        className="truncate pr-5"
        onChange={e => form?.setValue(name, e.target.value, { shouldValidate: true })}
      >
        {children}
      </select>

      {errors[name] && touched[name] && <span className="block text-sm text-red-600">{errors[name]?.message}</span>}
    </div>
  );
});

export default FormSelect;
