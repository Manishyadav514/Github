import { PageTitlebar } from "@components/PageTitlebar";
import { TagManagerBreadcrumb } from "@/constants/BreadcrumbConstant";
import { TagManagerForm } from "@components/tag-manager/tagManagerForm";
export default function AddTagManger() {
    const breadcrumb = TagManagerBreadcrumb.add
    return (
        <div>
            <PageTitlebar 
                breadcrumb={breadcrumb}
                pageTitle="Add New Tag" 
            >
            </PageTitlebar>
            <TagManagerForm></TagManagerForm>
        </div>
    );
}