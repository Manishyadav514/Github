export const RadioButtonPayment = (
  <style>
    {`

          input[type="radio"] {
            /* remove standard background appearance */
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            /* create custom radiobutton appearance */
            display: inline-block;
            width: 20px;
            height: 20px;
            padding: 3px;
            /* background-color only for content */
            background-clip: content-box;
            border: 1px solid #bbbbbb;
            background-color: white;
            border-radius: 50%;
          }

          /* appearance for checked radiobutton */
          input[type="radio"]:checked {
            background-color: var(--color1);
            border: 1px solid var(--color1);
          }

          input[type="radio"]:disabled {
            background-color: #ffffff;
            border: 1px solid #bbbbbb;
          }
`}
  </style>
);
