import { style } from "solid-js/web";
import { createSignal, Show } from "solid-js";
interface selectI {
    label:string,
    values:string[],
    onChange: (term: any) => any;
  }
const Select = ({ label, values, onChange }:selectI) => {
    const [currentValue, setCurrentValue] = createSignal('');
    const [open, setOpen] = createSignal(false);
    const handleOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };
      const handleValueChange = (value:any) => {
        setCurrentValue(value);
      };
      const handleChange = (value:any) => {
        handleValueChange(value);
        // call method, if it exists
        if (onChange) onChange(value);
        // close, after all tasks are finished
        handleClose();
      };
    return (
        <div class="relative m-0">
            <div class="py-1.5 px-2 font-bold background-white border-0 rounded" onClick={handleOpen}>
                {label}
            </div>
            <div class="absolute">
            {/* {values.map((value, index) => (
                // <DropdownItem
                // onClick={() => handleChange(value)}
                // active={value === currentValue}
                // key={index}
                // >
                // {value}
                // </DropdownItem>
            ))} */}
            </div>
        </div>
    );
};

export default Select