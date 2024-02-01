import React from "react";
import { Form as FinalForm } from "react-final-form";

const Form = (props: any) => (
  <FinalForm {...props}>
    {({ form: finalformapi, handleSubmit }) => (
      <form
        finalformapi={finalformapi}
        {...props}
        onSubmit={event => {
          const invalidField = finalformapi
            .getRegisteredFields()
            .findIndex(field => finalformapi?.getFieldState(field)?.invalid);

          //  Scroll to error
          if (invalidField !== -1) {
            setTimeout(() => {
              props.eref?.current?.scrollTo({
                top: window.innerHeight * invalidField,
                left: 0,
                behavior: "smooth",
              });
            }, 200);
          }
          handleSubmit(event);
        }}
      >
        {props.children}
      </form>
    )}
  </FinalForm>
);

export default Form;
