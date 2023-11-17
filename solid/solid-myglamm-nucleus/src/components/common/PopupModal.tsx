import { JSXElement } from "solid-js";
import { Portal, Show } from "solid-js/web";

interface IPopup {
  show: boolean;
  children: JSXElement;
  onRequestClose: () => void;
}

function PopupModal(props: IPopup) {
  return (
    <Show when={props.show}>
      <Portal>
        <div
          aria-hidden="true"
          role="presentation"
          class="z-50 inset-0 fixed"
          style={{
            background: "rgba(0, 0, 0, 0.3)"
          }}
          tabindex="-1"
          onClick={() => props.onRequestClose()}
        >
          <div role="dialog" aria-hidden="true" class="relative" onClick={e => e.stopPropagation()}>
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}

export { PopupModal };
