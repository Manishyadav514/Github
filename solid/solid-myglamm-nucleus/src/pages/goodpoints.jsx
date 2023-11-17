import { PageTitlebar } from "../components/PageTitlebar";
import { GoodPointsTable } from "../components/GoodPointsTable";
import { Pagination } from "../components/Pagination";
import { GoodPointsUpload } from "../components/GoodPointsUpload";
import { useMatch, useNavigate } from "@solidjs/router";
import { GoodPointsBreadcrumb, GoodUploadBreadcrumb } from "../constants/BreadcrumbConstant";

// Bulk GlammPoint Upload

export default function GoodPoints() {
  const navigate = useNavigate();
  const goodPoints = useMatch(() => "/goodpoints");
  const goodPointsUpload = useMatch(() => "/goodpoints/add");
  let pageTitle;
  let breadcrumb;
  let btnText;
  let itemCount;
  if (Boolean(goodPointsUpload())) {
    pageTitle = "Bulk GlammPoint Upload";
    breadcrumb = GoodUploadBreadcrumb;
    btnText = "";
    itemCount = 1;
  } else {
    pageTitle = "Bulk glammPOINTS";
    breadcrumb = GoodPointsBreadcrumb;
    btnText = "Bulk glammPOINTS Upload";
    itemCount = 250;
  }

  return (
    <div>
      <PageTitlebar
        breadcrumb={breadcrumb}
        pageTitle={pageTitle}
        ItemCount={itemCount}
        btnText={btnText}
        country={false}
        addBtnTrigger={() => navigate(`/goodpoints/add`, { replace: false })}
      />
      <div class="bg-white pt-4">
        {Boolean(goodPoints()) && <GoodPointsTable />}
        {Boolean(goodPointsUpload()) && <GoodPointsUpload />}

        {/* <GoodPointsUpload /> */}

        {/* <Pagination totalItems={500} currentPageNo={5} noOfPageSlots={5} recordsPerPage={10} /> */}
      </div>
    </div>
  );
}
