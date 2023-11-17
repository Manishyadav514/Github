import { For, createSignal } from "solid-js";
import { CommonIcon } from "../CommonIcon.js";
import { EditorTinyMCE } from "../Editor";
import { CommonButton } from "../CommonButton"
import { TAG_TYPE_LIST,COLOR_LIST } from "@/constants/tagManagerConstant.jsx";
import { createStore } from "solid-js/store";
type GliderInputEvent = InputEvent & {
    currentTarget: HTMLInputElement;
    target: Element;
}
type GliderSelectEvent = Event & {
    currentTarget: HTMLSelectElement;
    target: Element;
}
type tagMangerForm = {
    name: string,
    tagType: string,
    color: string,
}
function TagManagerForm() {
    const[form, setForm] = createStore<tagMangerForm>({
        name: "",
        tagType: "",
        color: "",
    });
    
    const handleInput = (event:GliderInputEvent) => {
        const {name,value} = event.currentTarget
        setForm(name as keyof tagMangerForm, value)
        console.log(JSON.stringify(form))
    }
    const handleSelect = (event:GliderSelectEvent) => {
        const {name,value} = event.currentTarget
        setForm(name as keyof tagMangerForm, value)
        console.log(JSON.stringify(form))
    }
  return (
    <div class="p-5 bg-white">
        <form>
            <div class="grid grid-cols-3 gap-7 mt-6">
                <div class="relative mb-6">
                    <label class="text-[#808593] mb-2 block after:content-['*'] after:ml-2 after:text-red-500">Tag Type</label>
                    <div class="w-full relative inline-flex self-center">
                        <select 
                            class="w-full h-[36px] py-[6px] rounded-md px-3 
                            text-sm font-medium text-[#808593] capitalize 
                            border border-[#e8e9ec] bg-white 
                            focus:outline-none appearance-none"
                            id="tagType" 
                            name="tagType"
                            onChange={handleSelect}
                        >
                            <option disabled selected>select an option </option>
                            {TAG_TYPE_LIST.map((option: string, i: number) => (
                                <option>{option}</option>
                            ))}
                        </select>
                        <span class="h-full flex align-middle items-center justify-center text-black absolute top-0 right-0 pointer-events-none">
                            <CommonIcon icon="material-symbols:arrow-drop-down" />
                        </span>
                    </div>
                </div>
                <div class="relative mb-6">
                    <label class="text-[#808593] mb-2 block">Name</label>
                    <input 
                        class="peer 
                        w-full h-[36px] py-2 
                        pr-3 pl-3 text-sm font-light 
                        border border-[#e8e9ec] rounded-md 
                        bg-white outline-0  focus:text-gray-400 
                        focus:border focus:border-primary 
                        focus:outline-none " 
                        onInput={handleInput}
                        type="text" 
                        id="name" 
                        name="name"
                    />
                </div>
            </div>
            
            <div class="grid grid-cols-3 gap-7">
                <div class="relative mb-6">
                    <label class="text-[#808593] mb-2 block after:content-['*'] after:ml-2 after:text-red-500">Color</label>
                    <div class="w-full relative inline-flex self-center">
                        <select 
                        class="w-full h-[36px] py-[6px] rounded-md px-3 
                        text-sm font-medium text-[#808593] capitalize 
                        border border-[#e8e9ec] bg-white 
                        focus:outline-none appearance-none"
                        id="color" name="color"
                        onChange={handleSelect}
                        >
                            <option disabled selected>select an option </option>
                            {COLOR_LIST.map((option, i: number) => (
                                <option>
                                    <span class="h-[20px] w-[20px] inline-block align-bottom rounded-full mr-2" style={{'background-color':option.hexCode}}></span>
                                    <span class="text-[50px]">{option.name}</span>
                                </option>
                            ))}
                        </select>
                        <span class="h-full flex align-middle items-center justify-center text-black absolute top-0 right-0 pointer-events-none">
                        <CommonIcon icon="material-symbols:arrow-drop-down" />
                        </span>
                    </div>
                </div>
            </div>
            <div class="w-full gap-4 mt-4">
                <CommonButton
                  labelText="Cancel"
                  bgWhite={true}
                  clicked={e => {
                    console.log(e);
                  }}
                />
                <CommonButton
                  labelText="Submit"
                  clicked={e => {
                    console.log(e);
                  }}
                  customClass="float-right "
                />
            </div>
        </form>
    </div>
  );
};

export { TagManagerForm };