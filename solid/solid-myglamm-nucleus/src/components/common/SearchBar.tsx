import { CommonIcon } from "../CommonIcon.js";
import debounce from "lodash.debounce";

interface SearchProps {
  placeholder: string;
  children?: any;
  onInput: (term: any) => any;
}

const SearchBar = (props: SearchProps) => {
  return (
    <div class="w-full flex flex-row  justify-between bg-white pl-[25px] pt-[21px] pb-[10px] pr-[21px]">
      <div class="min-w-[600px] flex">
        <input
          onInput={debounce((e: any) => {
            props?.onInput && props?.onInput(e?.target?.value);
          }, 600)}
          placeholder={props.placeholder}
          type="text"
          class="peer w-full h-[45px] py-2 pr-3 pl-3 text-sm font-light border border-r-0 border-gray-300 rounded-tl-md rounded-bl-md bg-white outline-0  focus:text-gray-400 focus:border focus:border-primary focus:outline-none "
        />
        <span class="peer-focus:text-white text-[#808593] peer-focus:bg-primary  peer-focus:border-primary bg-transparent border border-l-0 pr-2  border-gray-300 rounded-tr-md rounded-br-md flex justify-center align-middle items-center px-2 cursor-pointer transition ease-in-out m-0">
          <CommonIcon icon="ic:baseline-search" width={17} height={17} />
        </span>
      </div>
      <div class="flex flex-row items-center align-middle gap-3">{props.children}</div>
    </div>
  );
};

export { SearchBar };
