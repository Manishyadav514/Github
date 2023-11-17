import { For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { CommonIcon } from "@/components/CommonIcon";

interface MailTemplateI{
    _id:string
    name:string,
    slug:string,
    language:string,
    type:string,
    status:number,
    
}
const MailTemplateTableRow = (props: MailTemplateI) =>{
    const navigate = useNavigate();
    const handleStatus = (e: any) => {
        e.preventDefault, alert(`mail template is ${e.target.value}`);
    };
    return(
        <>
            <tr class="border-bottom" >
                <td class="align-middle p-3 border-b capitalize leading-12 pl-3">{props?.name}</td>
                <td class="align-middle p-3 border-b capitalize leading-12">{props?.slug}</td>
                <td class="align-middle p-3 border-b capitalize leading-12">{props?.language}</td>
                <td class="align-middle p-3 border-b capitalize leading-12">{props?.type}</td>
                <td class="align-middle p-3 border-b capitalize leading-12">
                <select
                    id="couponStatus"
                    class="block w-24 px-2  bg-white text-base text-gray-900"
                    onChange={e => {
                        handleStatus(e);
                    }}
                    >
                    <option value="active" selected class={`${"bg-secondary"} w-8 hover:bg-slate-400 text-primary cursor-pointer p-3`}>
                        Active
                    </option>
                    <option value="inactive">Inactive</option>
                </select>
                </td>
                <td class="align-middle p-3 border-b text-primary cursor-pointer text-right"> 
                    <CommonIcon icon="ph:pencil-thin" click={() => navigate(`/mail-templates/edit/${props._id}`, { replace: false })} />
                </td>
            </tr>
        </>
    )
}
const MailTemplateList = (props: any) => {
    return (
        <>
        <div class="row">
            <div class="col-lg-12">
                <div class="row">
                    <div class="col-lg-12">
                        <table class="w-full">
                            <thead>
                            <tr class="border-top border-bottom">
                                <th class="font-normal p-3 align-middle text-[#808593] text-left border-y">Template Name</th>
                                <th class="font-normal p-3 align-middle text-[#808593] text-left border-y">Slug</th>
                                <th class="font-normal p-3 align-middle text-[#808593] text-left border-y">Language</th>
                                <th class="font-normal p-3 align-middle text-[#808593] text-left border-y">Source Type</th>
                                <th class="font-normal p-3 align-middle text-[#808593] pl-4 text-left border-y">Status</th>
                                <th class="font-normal p-3 align-middle text-[#808593] text-right pr-4 border-y">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                                {props?.data?.length > 0 && (
                                    <For each={props?.data}>
                                    {(item: any, i) => (
                                        <MailTemplateTableRow
                                        name={item.name || "-"}
                                        slug={item.slug || "-"}
                                        language={item.language || "-"}
                                        type={item.type || "-"}
                                        status={item.status || "-"}
                                        _id={item._id || "-"}
                                        />
                                    )}
                                    </For>
                                )}
                                {props?.data?.length === 0 &&
                                    <tr>
                                        <td colSpan={6} class=" p-5 text-center text-primary w-full ">
                                            No Records Found
                                        </td>
                                    </tr>
                                }
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
         </div>
        </>
    )
}

export default MailTemplateList