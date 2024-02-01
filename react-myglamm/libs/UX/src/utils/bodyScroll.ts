import { isClient } from "./isClient";

export function enableBodyScroll() {
  if (isClient()) document.body.classList.remove("no-scroll");
}

export function disableBodyScroll() {
  if (isClient()) document.body.classList.add("no-scroll");
}
