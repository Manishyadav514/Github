import { PageTitlebar } from "@components/PageTitlebar";
import { MailTemplateForm } from "@components/mail-template/mail-template-form";

// Services
import { hideLoader, showLoader } from "@/services/loader.service";
import MailTemplatesHttpService  from "./mail-templates-https/mail-templates-http.service"
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
    name: "Add Mail Template",
    routerLink: ["/mail-templates/add"],
  },
];

export default function MailTemplateAdd() {
  const _mailTemplateHttp = new MailTemplatesHttpService()
  const createMailtemplate = async (data) =>{
    showLoader('Fetching Mail Templates...')
    try{
      const res = await _mailTemplateHttp.createMailTemplate(data)
    }catch(err){

    }finally{
      hideLoader()
    }
  }
  return (
    <div>
      <PageTitlebar breadcrumb={CRBreadcrumb} pageTitle="Add Mail Template" />
      <div class="bg-white pt-4">
      {/* <MailTempForm/> */}
        <MailTemplateForm onSubmit={createMailtemplate}/>
      </div>
    </div>
  );
}
