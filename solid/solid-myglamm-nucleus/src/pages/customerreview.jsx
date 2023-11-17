import { createSignal } from "solid-js";
import { PageTitlebar } from "../components/PageTitlebar";
import { Tab } from "../components/Tab";
import { SearchBar } from "../components/common/SearchBar";
import { CustomerReviewTable } from "../components/CustomerReviewTable";

export const CRBreadcrumb = [
  {
    name: "Home",
    routerLink: "/",
  },
  {
    name: "Customer Reviews",
    routerLink: ["/customer-reviews"],
  },
];

export default function CustomerReview() {
  const [showMenu, setShowMenu] = createSignal(true);
  const removeMargin = e => {
    setShowMenu(e);
  };
  const createOrder = e => {
    e.preventDefault();
    alert("Create Order");
  };
  const titles = [
    { label: "pending", id: 1 },
    { label: "approved", id: 2 },
    { label: "disapproved", id: 3 },
    { label: "report abuse", id: 4 },
  ];
  // track active tab in parent
  const [activeTab, setActiveTab] = createSignal(titles[0]);
  const onTabChange = e => {
    setActiveTab(e);
  };

  return (
    <div>
      <PageTitlebar breadcrumb={CRBreadcrumb} pageTitle="Customer Reviews" ItemCount={5551} />
      <Tab titles={titles} activeTab={activeTab} changeTab={onTabChange} />
      <div class="bg-white">
        <SearchBar placeholder="Search by Product Name, Customer Name" />
        <CustomerReviewTable />
        {/* <Pagination totalItems={500} currentPageNo={5} noOfPageSlots={5} recordsPerPage={10} /> */}
      </div>
    </div>
  );
}
