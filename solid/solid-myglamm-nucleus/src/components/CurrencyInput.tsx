interface ICurrencyInputProps {
  labelName: string;
  labelText: string;
  value: number;
  handleChange: (e: number) => void;
}

function CurrencyInput({
  labelName,
  labelText,
  value,
  handleChange,
}: ICurrencyInputProps) {
  return (
    <div>
      <label for={labelName}>{labelText}</label>
      <div class="my-2">
        <span class="py-3 px-3 bg-gray-200 rounded-tl-lg rounded-bl-lg">₹</span>
        <input
          type="number"
          class="px-4 py-2 w-80 rounded-tr-lg rounded-br-lg bg-white   border-2 focus:border-blue-300 focus:border-3 focus:outline-none"
          name={labelName}
          id={labelName}
          value={value}
          title={labelName}
          onKeyPress={(e) => {
            const key = e.key || e.code;
            if (["e", "+", "-", ".", "E"].includes(key)) {
              e.preventDefault();
            }
          }}
          onInput={(e) => {
            handleChange(parseInt((e?.target as HTMLInputElement).value, 10));
          }}
        />
      </div>
    </div>
  );
}

export { CurrencyInput };
