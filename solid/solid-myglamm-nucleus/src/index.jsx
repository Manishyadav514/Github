/* @refresh reload */
import {render} from "solid-js/web";
import {Router} from "@solidjs/router";
import {Toaster} from "solid-toast";

import App from "./App";

render(
  () => (
    <Router>
      <App />
      <Toaster />
    </Router>
  ),
  document.getElementById("root")
);
