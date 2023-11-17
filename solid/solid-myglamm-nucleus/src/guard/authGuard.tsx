import { Route, Navigate, Outlet } from "@solidjs/router";
import clsx from "clsx";
import { createSignal, Show } from "solid-js";
import { Header } from "../components/Header";
import { NavSideBar } from "../components/NavSideBar";
import { checkUserLoginStatus } from "../utils/checkUserLogin";
import { Spinner } from "@components/Spinner";

function Protected({ redirect }: any) {
  const isLoggedIn = checkUserLoginStatus();
  const [showMenu, setShowMenu] = createSignal(true);
  const removeMargin = (e: any) => {
    setShowMenu(e);
  };
  // Show the outlet when logged in
  return (
    <Show when={isLoggedIn} fallback={<Navigate href={redirect} />}>
      <Spinner />
      <Header />
      <NavSideBar width={removeMargin} />
      <div
        class={clsx(
          "mx-auto mt-[78px] mb-4 ml-[220px] pt-[15px] pr-[26px] pb-[26px] pl-[15px]",
          showMenu() ? "ml-[220px]" : "ml-[64px]"
        )}
      >
        <Outlet />
      </div>
    </Show>
  );
}

function VendorPage({ redirect }: any) {
  const isLoggedIn = checkUserLoginStatus();
  return (
    <Show when={isLoggedIn} fallback={<Navigate href={redirect} />}>
      <Spinner />
      <Outlet />
    </Show>
  );
}

interface ProtectedRouteProps {
  path?: string;
  redirect?: string;
  children: any;
}

function ProtectedRoute(props: ProtectedRouteProps) {
  return (
    <Route path={props.path || "/"} element={<Protected redirect={props.redirect || "/auth/login"} />}>
      {props.children}
    </Route>
  );
}

function VendorRoute(props: ProtectedRouteProps) {
  return (
    <Route path={props.path || "/"} element={<VendorPage redirect={props.redirect || "/auth/login"} />}>
      {props.children}
    </Route>
  );
}

export { ProtectedRoute, VendorRoute };
