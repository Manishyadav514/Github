import { PageTitlebar } from "../components/PageTitlebar";
import { Pagination } from "../components/Pagination";
import { SearchBar } from "../components/common/SearchBar";
import { Tab } from "../components/Tab";
import { LBCategoryCard } from "../components/LBCategoryCard";

export const CRBreadcrumb = [
  {
    name: "Home",
    routerLink: "/",
  },
  {
    name: "Lookbook Category",
    routerLink: ["/loook-categories"],
  },
];

export default function LookbookList() {
  return (
    <div>
      <PageTitlebar
        breadcrumb={CRBreadcrumb}
        pageTitle="Lookbook Category"
        ItemCount={521}
        btnText={"Add Lookbook Category"}
        country={true}
      />
      <Tab country={true} />
      <div class="bg-white">
        <SearchBar placeholder="Search by Product Name, Customer Name" />
        <div class="px-6 py-4 flex flex-wrap gap-4">
          {[...Array(5).keys()].map(() => (
            <LBCategoryCard title="Myglamm LIT -PH LIP balm" categoryAvailable={10} />
          ))}
        </div>
        {/* <Pagination totalItems={500} currentPageNo={5} noOfPageSlots={5} recordsPerPage={10} /> */}
      </div>
    </div>
  );
}
