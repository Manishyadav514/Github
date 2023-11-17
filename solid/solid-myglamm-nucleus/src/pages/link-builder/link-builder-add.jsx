import { PageTitlebar } from "@components/PageTitlebar";
import { LinkGenerator } from "@components/LinkGenerator";

export const CRBreadcrumb = [
  {
    name: "Home",
    routerLink: "/",
  },
  {
    name: "Link Builder",
    routerLink: ["/link-builder"],
  },
  {
    name: "Add New Link",
    routerLink: ["/link-builder/add"],
  },
];

export default function LinkBuilder() {
  return (
    <div>
      <PageTitlebar breadcrumb={CRBreadcrumb} pageTitle="Add New Link" />
      <div class="bg-white pt-4">
        <LinkGenerator />
      </div>
    </div>
  );
}
