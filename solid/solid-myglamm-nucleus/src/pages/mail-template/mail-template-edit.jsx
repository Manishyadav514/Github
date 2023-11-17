import { createSignal, onMount } from "solid-js";
import {
    useParams,
} from "@solidjs/router";
import { PageTitlebar } from "@components/PageTitlebar";
import { MailTemplateForm } from "@components/mail-template/mail-template-form";
// Services
import { hideLoader, showLoader } from "@/services/loader.service";
import MailTemplatesHttpService  from "./mail-templates-https/mail-templates-http.service"
import { MailTempFormTwo } from "@components/mail-template/mail-temp-for"
// import { useParams } from "solid-start";
export const CRBreadcrumb = [
  {
    name: "Home",
    routerLink: "/",
  },
  {
    name: "Mail Template",
    routerLink: ["/mail-templates"],
  },
  {
    name: "Edit Mail Template",
  },
];

export default function MailTemplateEdit() {
    
    const params = useParams();
    let id = params.id;
    const [getMailTemplateData, setMailTemplateData] = createSignal([]);
    const _mailTemplateHttp = new MailTemplatesHttpService()
    onMount(()=>{
        getMailTemplates()
    })
    /**
        * @description fetching mail template
        *
        * @memberof MailTemplateEdit
    */
    const getMailTemplates = async () =>{
        showLoader('Fetching Mail Templates...')
        try{
            const res = await _mailTemplateHttp.getMailTemplateById(id)
            setMailTemplateData(res?.data?.data?.responseData)
        }catch(err){

        }finally{
            hideLoader();
        }
    }
    return (
        <div>
        <PageTitlebar breadcrumb={CRBreadcrumb} pageTitle="Edit Mail Template" />
        <div class="bg-white pt-4">
            {/* <MailTemplateForm data={getMailTemplateData}/> */}
            <MailTempFormTwo></MailTempFormTwo>
        </div>
        </div>
    );
}
