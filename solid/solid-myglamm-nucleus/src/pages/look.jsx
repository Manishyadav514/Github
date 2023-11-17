import { createSignal } from "solid-js";
import { PageTitlebar } from "../components/PageTitlebar";
import { Pagination } from "../components/Pagination";
import { SearchBar } from "../components/common/SearchBar";
import { Tab } from "../components/Tab";
import { LBListCard } from "../components/LBListCard";

export const CRBreadcrumb = [
  {
    name: "Home",
    routerLink: "/",
  },
  {
    name: "Lookbook",
    routerLink: ["/look"],
  },
];

export default function LookbookList() {
  const [showMenu, setShowMenu] = createSignal(true);
  const removeMargin = (e) => {
    setShowMenu(e);
  };

  return (
    <div>
        <PageTitlebar
          breadcrumb={CRBreadcrumb}
          pageTitle="Lookbook"
          ItemCount={521}
          btnText={"Add Lookbook"}
          country={true}
        />
        <Tab country={true} />
        <div class="bg-white">
          <SearchBar placeholder="Search by Product Name, Customer Name" />
          <div class="px-6 py-4 flex flex-wrap gap-6">
            {[...Array(5).keys()].map(() => (
              <LBListCard
                title="Myglamm LIT -PH LIP balm"
                tag="makeup"
                date={"14 Oct 2022"}
                price={690}
                language="EN, HI"
                productAvailable={10}
              />
            ))}
          </div>
          <Pagination
            totalItems={500}
            currentPageNo={5}
            noOfPageSlots={5}
            recordsPerPage={10}
          />
        </div>
      </div>
  );
}
