import { Routes, Route } from "@solidjs/router";
import { lazy, onMount } from "solid-js";
import { ProtectedRoute, VendorRoute } from "./guard/authGuard";

const Configuration = lazy(() => import("./pages/configuration"));
const dashboard = lazy(() => import("./pages/dashboard"));
const Home = lazy(() => import("./pages/home"));
const Order = lazy(() => import("./pages/order/order"));
const OrderAdd = lazy(() => import("./pages/order/order-add"));
const OrderEdit = lazy(() => import("./pages/order/order-edit"));
const OrderInvoice = lazy(() => import("./pages/order/order-invoice"));
const CustomerReview = lazy(() => import("./pages/customerreview"));
const LookbookList = lazy(() => import("./pages/look"));
const LookbookCategory = lazy(() => import("./pages/look-category"));
const GoodPoints = lazy(() => import("./pages/goodpoints"));
const LinkBuilder = lazy(() => import("./pages/link-builder/link-builder-list"));
const LinkBuildAdd = lazy(() => import("./pages/link-builder/link-builder-add"));
const LinkBuildEdit = lazy(() => import("./pages/link-builder/link-builder-edit"));
const Login = lazy(() => import("./pages/login"));
const SelectVendorCode = lazy(() => import("./pages/select-vendorcode"));
const Members = lazy(() => import("./pages/members/members"));
const MemberDetails = lazy(() => import("./pages/members/member-details"));
const PartyTheme = lazy(() => import("./pages/party-theme/party-theme"));
const MailTemplate = lazy(() => import("./pages/mail-template/mail-template"));
const MailTemplateAdd = lazy(() => import("./pages/mail-template/mail-template-add"));
const MailTemplateEdit = lazy(() => import("./pages/mail-template/mail-template-edit"));
const TagManger = lazy(() => import("./pages/tag-manager/tagMangerList"));
const AddTagManger = lazy(() => import("./pages/tag-manager/addTagManager"));


import "./global.scss";
import { getLocalStorageValue } from "./utils/localStorage";
import { LOCALSTORAGE } from "./constants/Storage.constant";
import { themeConfig } from "./constants/Theme.constant";

function App() {
  const selectedVendor = getLocalStorageValue(LOCALSTORAGE.SELECTED_VENDORCODE) || "mgp";
  const theme: any = themeConfig;
  const setTheme = () => {
    document.documentElement.style.setProperty("--primary-color", theme?.[selectedVendor]?.primaryColor);
    document.documentElement.style.setProperty("--primary-light-color", theme?.[selectedVendor]?.primaryLight);
  };

  onMount(() => {
    setTheme();
  });

  return (
    <>
      <Routes>
        <ProtectedRoute>
          <Route path="/dashboard" component={dashboard} />
          <Route path="/order" component={Order} />
          <Route path="/order/add" component={OrderAdd} />
          <Route path="/order/edit/:id" component={OrderEdit} />
          <Route path="/order/invoice/:id" component={OrderInvoice} />
          <Route path="/members" component={Members} />
          <Route path="/members/view/:id" component={MemberDetails} />
          <Route path="/party-theme" component={PartyTheme} />
          <Route path="/goodpoints" component={GoodPoints} />
          <Route path="/goodpoints/add" component={GoodPoints} />
          <Route path="/link-builder" component={LinkBuilder} />
          <Route path="/link-builder/add" component={LinkBuildAdd} />
          <Route path="/link-builder/edit/:id" component={LinkBuildEdit} />
          <Route path="/look" component={LookbookList} />
          <Route path="/look-categories" component={LookbookCategory} />
          <Route path="/customer-reviews" component={CustomerReview} />
          <Route path="/configuration" component={Configuration} />
          <Route path="/configuration/:id" component={Configuration} />
          <Route path="/mail-templates" component={MailTemplate} />
          <Route path="/mail-templates/add" component={MailTemplateAdd} />
          <Route path="/mail-templates/edit/:id" component={MailTemplateEdit} />
          <Route path="/" component={Home} />
          <Route path="/tag-manager" component={TagManger} />
          <Route path="/tag-manager/add" component={AddTagManger} />
        </ProtectedRoute>
        <VendorRoute>
          <Route path="/select-vendorcode" component={SelectVendorCode} />
        </VendorRoute>

        <Route path="/auth/login" component={Login} />
      </Routes>
    </>
  );
}

export default App;
