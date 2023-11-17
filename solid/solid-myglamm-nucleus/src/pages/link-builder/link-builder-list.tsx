import { LinkBuilderTable } from "@components/LinkBuilderTable";
import { LinkBuilderBreadcrumb } from "@/constants/BreadcrumbConstant";
import { PageTitlebar } from "@components/PageTitlebar";
import { Pagination } from "@components/Pagination";
import { useNavigate } from "@solidjs/router";
import LinkBuilderAPI from "@/services/link-builder.service";
import { API_CONFIG } from "@/constants/api.constant";
import { getLocalStorageValue } from "@/utils/localStorage";
import { LOCALSTORAGE } from "@/constants/Storage.constant";
import { showError } from "@/utils/showToaster";
import { hideLoader, showLoader } from "@/services/loader.service";
import { createSignal, onMount } from "solid-js";

export default function LinkBuilder() {
  const [currentPageNo, setCurrentPageNo] = createSignal(1); // current active page
  const [SortOrder, setSortOrder] = createSignal("desc");
  const [linkBuildData, setLinkBuildData] = createSignal<any>([]);
  const [dataCount, setDataCount] = createSignal(0); // no. of members
  const navigate = useNavigate();
  const vendorCode = getLocalStorageValue(LOCALSTORAGE.SELECTED_VENDORCODE);
  const pageSize = API_CONFIG.pageSize;
  const linkBuilderAPI = new LinkBuilderAPI();

  onMount(() => {
    getLinkBuilderData();
  });

  const getLinkBuilderData = async () => {
    showLoader("Loading...");
    try {
      const res: any = await linkBuilderAPI.fetchAllLinks(vendorCode, currentPageNo(), pageSize, SortOrder());
      setLinkBuildData(res?.data?.data?.data?.data);
      setDataCount(res?.data?.data?.data?.totalRecords);
    } catch (err: any) {
      showError((err && err?.message) || (err && err.error && err.error.message) || "Member List");
    } finally {
      hideLoader();
    }
  };

  // handle page change
  const handlePageChange = (page: any) => {
    setCurrentPageNo(page);
    getLinkBuilderData();
  };

  return (
    <div>
      <PageTitlebar
        breadcrumb={LinkBuilderBreadcrumb}
        pageTitle="Link Builder"
        ItemCount={44023}
        btnText={"Add New Link"}
        addBtnTrigger={() => navigate("/link-builder/add")}
      />
      <div class="bg-white pt-4">
        <LinkBuilderTable data={linkBuildData()} />
        <Pagination
          onPageChange={handlePageChange}
          totalItems={dataCount()}
          currentPageNo={currentPageNo()}
          noOfPageSlots={5}
          recordsPerPage={pageSize}
        />
      </div>
    </div>
  );
}
