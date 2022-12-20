import { createSignal, Show, For, Index, Switch, ErrorBoundary } from "solid-js";
import { Dynamic, Portal } from "solid-js/web";
import "./common.css";

export const CFShow = () => {
  const [loggedIn, setLoggedIn] = createSignal(false);
  const toggle = () => setLoggedIn(!loggedIn());

  return (
    <>
      <Show
        when={loggedIn()}
        fallback={
          <button
            onClick={toggle}
            className="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Log in
          </button>
        }
      >
        <button
          onClick={toggle}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Log out
        </button>
      </Show>
    </>
  );
};

export const CFFor = () => {
  const [cats, setCats] = createSignal([
    { id: "J---aiyznGQ", name: "Keyboard Cat" },
    { id: "z_AbfPXTKms", name: "Maru" },
    { id: "OUtn3pvWmpg", name: "Henri The Existential Cat" },
  ]);

  return (
    <>
      <h2> FOR</h2>
      <ul>
        <For each={cats()}>
          {(cat, i) => (
            <li>
              <a
                target="_blank"
                href={`https://www.youtube.com/watch?v=${cat.id}`}
              >
                {i() + 1}: {cat.name}
              </a>
            </li>
          )}
        </For>
      </ul>
    </>
  );
};

export const CFIndex = () => {
  const [cats, setCats] = createSignal([
    { id: "J---aiyznGQ", name: "Keyboard Cat" },
    { id: "z_AbfPXTKms", name: "Maru" },
    { id: "OUtn3pvWmpg", name: "Henri The Existential Cat" },
  ]);

  return (
    <ul>
      <Index each={cats()}>
        {(cat, i) => (
          <li>
            <a
              target="_blank"
              href={`https://www.youtube.com/watch?v=${cat().id}`}
            >
              {i + 1}: {cat().name}
            </a>
          </li>
        )}
      </Index>
    </ul>
  );
};

// It will try in order to match each condition, stopping to render the first that evaluates to true. Failing all of them, it will render the the fallback.
export const CFSwitch = () => {
  const [x] = createSignal(7);

  return (
    <Switch fallback={<p>{x()} is between 5 and 10</p>}>
      <Match when={x() > 10}>
        <p>{x()} is greater than 10</p>
      </Match>
      <Match when={5 > x()}>
        <p>{x()} is less than 5</p>
      </Match>
    </Switch>
  );
};

// The <Dynamic> tag is useful when you render from data. It lets you pass either a string for a native element or a component function and it will render that with the rest of the provided props.
const RedThing = () => <strong style="color: red">Red Thing</strong>;
const GreenThing = () => <strong style="color: green">Green Thing</strong>;
const BlueThing = () => <strong style="color: blue">Blue Thing</strong>;
const options = {
  red: RedThing,
  green: GreenThing,
  blue: BlueThing,
};
export const CFDynamic = () => {
  const [selected, setSelected] = createSignal("red");

  return (
    <>
      <select
        value={selected()}
        onInput={(e) => setSelected(e.currentTarget.value)}
      >
        <For each={Object.keys(options)}>
          {(color) => <option value={color}>{color}</option>}
        </For>
      </select>
      <Dynamic component={options[selected()]} />
    </>
  );
};

// Solid has a <Portal> component whose child content will be inserted at the location of your choosing. By default, its elements will be rendered in a <div> in the document.body.
export const CFPortal = () => {
  
  return (
    <div class="app-container">
      <p>Just some text inside a div that has a restricted size.</p>
      <Portal>
        <div class="popup">
          <h1>Popup</h1>
          <p>Some text you might need for something or other.</p>
        </div>
      </Portal>
    </div>
  );
}

// A JavaScript error originating in the UI shouldn’t break the whole app. Error boundaries are components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed.
export const CFErrorBoundary = () => {
  const Broken = (props) => {
    throw new Error("Oh No");
    return <>Never Getting Here</>
  }

  return (
    <>
      <div>Before</div>
      <ErrorBoundary fallback={err => err}>
        <Broken />
      </ErrorBoundary>
      <div>After</div>
    </>
  );
}
