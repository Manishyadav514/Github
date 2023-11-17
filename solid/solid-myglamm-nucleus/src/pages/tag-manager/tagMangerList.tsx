import { PageTitlebar } from "@components/PageTitlebar";
import { TagManagerBreadcrumb } from "@/constants/BreadcrumbConstant";
import { useNavigate } from "@solidjs/router";
export default function TagManger() {
    const navigate = useNavigate();
    const breadcrumb = TagManagerBreadcrumb.listing
    return (
        <div>
            <PageTitlebar 
                breadcrumb={breadcrumb} 
                pageTitle="Tag Manager" 
                btnText="Add New Tag"
                addBtnTrigger={() => navigate(`/tag-manager/add`, { replace: false })}
            >
            </PageTitlebar>
        </div>
    );
}