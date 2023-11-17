import { createStore } from "solid-js/store";
import { CommonIcon } from "../CommonIcon.js";
import { EditorTinyMCE } from "../Editor";
import { CommonButton } from "../CommonButton"
import { createSignal } from "solid-js";
import clsx from "clsx";
import { SwitchToggle } from "../../components/SwitchToggle";
import { createFormGroup, formGroup, Validators as V } from 'solar-forms';

// MailTemplate Form Interface
type MailTemplateI = {
    name: string,
    type: string,
    subject?: string,
    template: string,
    slug: string,
    status: number,
    vendorCode: string,
    language:string,
    countryName:string,
    templateName?: string,
    templateId?: string,
}
type tinyMCESelectData =   {
    name: string;
    value: string
}
const MailTempFormTwo = () => {
    const fg = createFormGroup({
        name: ['sagar', { validators: [V.required] }],
        type: ['', { validators: [V.required] }],
        subject: ['', { validators: [V.required] }],
        template: ['', { validators: [V.required] }],
        slug: ['', { validators: [V.required] }],
        status: [false, { validators: [V.is(true)] }],
        vendorCode: ['', { validators: [V.required] }],
        language:['english', { validators: [V.required] }],
        countryName:['', { validators: [V.required] }],
        templateName: ['', { validators: [V.required] }],
        templateId: ['', { validators: [V.required] }],
    });
    const [form, setForm] = fg.value;
    const [current, setCurrent] = createSignal("whatsapp");
    const onSourceSelect =  (source:any) => {
        setCurrent(source)
        // setForm("type",source)
    }
    const onEditorChange = (event:tinyMCESelectData) =>{
        const name = event.name;
        const value = event.value;
        // setForm(name as keyof MailTemplateI, value)
    }
    const submitMailTemplateFormData = () =>{
        console.log(JSON.stringify(form));
    }
    return (
        <div class="p-5">
            <form use:formGroup={fg}>
                <div class="grid grid-cols-2 gap-4 mt-5">
                    <div class="mt-3 flex flex-wrap">
                        <div class={clsx("pointer text-center w-40 h-40 p-5 cursor-pointer relative rounded text-[#808593] rounded-md border ", current() === 'whatsapp' ? " border-pink-500" : "border-transparent")}  onClick={() => onSourceSelect('whatsapp') }>
                            <span class={clsx("absolute w-6 h-6 text-[#ffffff] rounded-full bg-[#eb3b8c] text-primary right-[-5px] top-[-10px] ", current() === 'whatsapp' ? "block" : "hidden" )}><CommonIcon icon="material-symbols:check-small-rounded" width={24} height={24}/></span>
                            <span class={clsx('', current() === 'whatsapp' ? 'text-[#55cd6c]' : '')}><CommonIcon icon="dashicons:whatsapp"  width={60} height={71}/></span>
                            <div>Whatsapp</div>
                        </div>
                        <div class={clsx("pointer text-center w-40 h-40 p-5 relative cursor-pointer mx-3 rounded text-[#808593] rounded-md border ", current() === 'sms' ? " border-pink-500" : "border-transparent")} onClick={() => onSourceSelect('sms') }>
                        <span class={clsx("absolute w-6 h-6 text-[#ffffff] rounded-full bg-[#eb3b8c] text-primary right-[-5px] top-[-10px] ", current() === 'sms' ? "block" : "hidden" )}><CommonIcon icon="material-symbols:check-small-rounded" width={24} height={24}/></span>
                            <span class={clsx("", current() === 'sms' ? 'text-[#2f86eb]' : '')}><CommonIcon icon="material-symbols:sms"  width={60} height={71}/></span>
                            <div>SMS</div>
                        </div>
                        <div class={clsx("pointer text-center w-40 h-40 p-5 relative cursor-pointer  rounded text-[#808593] rounded-md border", current() === 'email' ? " border-pink-500" : "border-transparent")} onClick={() => onSourceSelect('email') }>
                        <span class={clsx("absolute w-6 h-6 text-[#ffffff] rounded-full bg-[#eb3b8c] text-primary right-[-5px] top-[-10px]", current() === 'email' ? "block" : "hidden" )}><CommonIcon icon="material-symbols:check-small-rounded" width={24} height={24}/></span>
                            <span class={clsx("", current() === 'email' ? 'text-[#ffc021]' : '')}><CommonIcon icon="ic:round-email"  width={60} height={71}/></span>
                            <div>Email</div>
                        </div>
                    </div>
                    {/* <div>
                        <div class="float-right">
                            <SwitchToggle
                                isChecked
                             />
                        </div>
                    </div> */}
                </div>
                
                <div class="grid grid-cols-2 gap-4 mt-5">
                    <div class="relative mb-6" use:formGroup={fg}>
                        <label class="text-[#808593] mb-2 block after:content-['*'] after:ml-2 after:text-red-500">Mail Template Name</label>
                        <input 
                        class="peer 
                        w-full h-[36px] py-2 
                        pr-3 pl-3 text-sm font-light 
                        border border-[#e8e9ec] rounded-md 
                        bg-white outline-0  focus:text-gray-400 
                        focus:border focus:border-primary 
                        focus:outline-none " 
                        name="name"
                        id="name" 
                        type="text" 
                        formControlName="name"
                        />
                    </div>
                    <div class="relative mb-6" >
                        <label class="text-[#808593] mb-2 block after:content-['*'] after:ml-2 after:text-red-500">Slug</label>
                        <span class="text-primary"></span>
                    </div>
                </div>
                {/* It's showing when if type is whatsapp */}
                {current() === 'whatsapp' && 
                    <div class="grid grid-cols-2 gap-4" >
                        <div class="relative mb-6">
                            <label class="text-[#808593] mb-2 block">Whatsapp Template Name</label>
                            <input 
                            class="peer 
                            w-full h-[36px] py-2 
                            pr-3 pl-3 text-sm font-light 
                            border border-[#e8e9ec] rounded-md 
                            bg-white outline-0  focus:text-gray-400 
                            focus:border focus:border-primary 
                            focus:outline-none " 
                            name="templateName"
                            id="templateName" 
                            type="text" 
                            formControlName="templateName"
                            />
                        </div>
                        <div class="relative mb-6" >
                            <label class="text-[#808593] mb-2 block">Whatsapp Template ID</label>
                            <input 
                            class="peer 
                            w-full h-[36px] py-2 
                            pr-3 pl-3 text-sm font-light 
                            border border-[#e8e9ec] rounded-md 
                            bg-white outline-0  focus:text-gray-400 
                            focus:border focus:border-primary 
                            focus:outline-none "
                            name="templateId"
                            id="templateId" 
                            type="text" 
                            formControlName="templateId"
                            />
                        </div>
                    </div>
                }
                <div class="grid grid-cols-2 gap-4">
                    <div class="relative mb-6" use:formGroup={fg}>
                        <label class="text-[#808593] mb-2 block after:content-['*'] after:ml-2 after:text-red-500">Select language</label>
                        <div class="w-full relative inline-flex self-center">
                        <select 
                        class="w-full h-[36px] py-[6px] rounded-md px-3 
                        text-sm font-medium text-[#808593] capitalize 
                        border border-[#e8e9ec] bg-white 
                        focus:outline-none appearance-none"
                        id="language" name="language" formControlName="language"
                        >
                            <option  disabled selected>Select language...</option>
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Marathi</option>
                        </select>
                        <span class="h-full flex align-middle items-center justify-center text-black absolute top-0 right-0 pointer-events-none">
                        <CommonIcon icon="material-symbols:arrow-drop-down" />
                        </span>
                    </div>
                    </div>
                    <div class="relative mb-6" >
                        <label class="text-[#808593] mb-2 block">Subject</label>
                        <input 
                        class="peer 
                        w-full h-[36px] py-2 
                        pr-3 pl-3 text-sm font-light 
                        border border-[#e8e9ec] rounded-md 
                        bg-white outline-0  focus:text-gray-400 
                        focus:border focus:border-primary 
                        focus:outline-none "
                        name="subject"
                        id="subject" 
                        type="text" 
                        formControlName="subject"
                        />
                    </div>
                </div>
                <div class="w-full gap-4">
                    <label class="text-[#808593] mb-2 block">Description</label>
                    <EditorTinyMCE selector='description' name="description"  onEditorChange={onEditorChange}/>
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
                    clicked={submitMailTemplateFormData}
                    customClass="float-right "
                    />
                </div>
            </form>
        </div>
    );
};

export { MailTempFormTwo };