import { makeAPI } from "../api";
import Fuse from "fuse.js";
import { createStore } from "solid-js/store";
import { createSignal, For, createEffect, onMount } from "solid-js";
import clsx from "clsx";
const highlightMatches = (inputText, regions = []) => {
  if (!regions.length > 0) {
    return inputText;
  }
  try {
    const children = [];
    let nextUnhighlightedRegionStartingIndex = 0;

    regions.forEach((region, i) => {
      const lastRegionNextIndex = region[1] + 1;

      children.push(
        ...[
          inputText
            .substring(nextUnhighlightedRegionStartingIndex, region[0])
            .replace(" ", "\u00A0"),
          <span key={region + " " + i} class="fuse-highlight">
            {inputText
              .substring(region[0], lastRegionNextIndex)
              .replace(" ", "\u00A0")}
          </span>,
        ]
      );

      nextUnhighlightedRegionStartingIndex = lastRegionNextIndex;
    });

    children.push(
      inputText
        .substring(nextUnhighlightedRegionStartingIndex)
        .replace(" ", "\u00A0")
    );

    return <>{children}</>;
  } catch (e) {
    return null;
  }
};

const host = "https://acl.mgapis.com";
// const host = "https://mag.myglamm.net";
const patch = (id, value) => {
  makeAPI(host)
    .patch(`/configuration-ms/configuration/v2/${id}`, value)
    .then((r) => {
      console.log("patched", { r });
    });
};

export default function Configuration() {
  return (
    <div class="p-4">
      <div class="flex mb-2 border-pink-500 border">
        <input
          class=" p-2 w-full outline-none"
          value={searchText()}
          onKeyUp={(e) => {
            console.log({ e });
          }}
          onInput={(e) => {
            setSearchText(e.target.value);
          }}
        />
        <button
          class="bg-pink-500 p-2 text-white font-bold"
          onClick={() => {
            search();
          }}
        >
          Search
        </button>
      </div>
      <div class="w-full flex mb-2">
        <div class="mr-2 p-2 bg-pink-50">
          <h2 class="text-xs uppercase mb-1 font-medium">Vendor</h2>
          <div class="inline-flex mb-2">
            {vendors.map((i) => {
              return (
                <FilterButton
                  isSelected={i == vendor()}
                  text={i}
                  onClick={() => {
                    setVendor(i);
                    search();
                  }}
                />
              );
            })}
          </div>
        </div>
        <div class="mr-2 p-2 bg-pink-50">
          <h2 class="text-xs uppercase mb-1 font-medium">Country</h2>
          <div class="inline-flex mb-2">
            {countries.map((i) => {
              return (
                <FilterButton
                  isSelected={i == country()}
                  text={i}
                  onClick={() => {
                    setCountry(i);
                    search();
                  }}
                />
              );
            })}
          </div>
        </div>
        <div class="mr-2 p-2 bg-pink-50">
          <h2 class="text-xs uppercase mb-1 font-medium">Platform</h2>
          <div class="inline-flex mb-2">
            {platforms.map((i) => {
              return (
                <FilterButton
                  isSelected={i == platform()}
                  text={i}
                  onClick={() => {
                    setPlatform(i);
                    search();
                  }}
                />
              );
            })}
          </div>
        </div>
        <div class="p-2 bg-pink-50">
          <h2 class="text-xs uppercase mb-1 font-medium">Language</h2>
          <div class="inline-flex mb-2">
            <For each={languages}>
              {(item) => {
                return (
                  <FilterButton
                    isSelected={item == language()}
                    text={item}
                    onClick={() => {
                      setLanguage(item);
                      search();
                    }}
                  />
                );
              }}
            </For>
          </div>
        </div>
      </div>
      <div class="w-full">
        {results().map((result) => {
          return <Result result={result} />;
        })}
      </div>
    </div>
  );
}
const Result = (props) => {
  console.log({ props });
  const [collapsed, setCollapsed] = createSignal(false);
  const v = props.result.item.data.value;
  const [val, setVal] = createSignal(
    typeof v == "object" ? JSON.stringify(v) : v
  );
  return (
    <div class="hover:bg-pink-50">
      <div
        class=" border p-2 flex justify-between items-center cursor-pointer"
        onClick={() => {
          setCollapsed(!collapsed());
        }}
      >
        <div>
          <div>
            key:
            {highlightMatches(
              props.result.item.data.key,
              props.result.matches[0].indices
            )}
          </div>
          <div>
            value:
            {highlightMatches(
              props.result.item.data.value,
              props.result.matches[1]?.indices
            )}
          </div>
        </div>
        <div>
          <FilterLabel small text={props.result.item.vendorCode} isSelected />
          <FilterLabel small text={props.result.item.country} isSelected />
          <FilterLabel small text={props.result.item.platform} isSelected />
          <FilterLabel small text={props.result.item.language} isSelected />
        </div>
      </div>
      {collapsed() && (
        <div class="flex flex-col items-center justify-center">
          <textarea
            value={val()}
            onInput={(e) => {
              try {
                setVal(e.target.value);
              } catch (err) {
                //setVal(null);
              }
            }}
            data-gramm="false"
            class="outline-none border p-2 w-96 h-96"
          />
          <div>
            <button
              class="bg-pink-500 p-2 text-white font-bold my-2 mr-2"
              onClick={() => {
                setVal(JSON.stringify(props.result.item.data.value, null, 2));
              }}
            >
              Reset
            </button>
            <button
              class="bg-pink-500 p-2 text-white font-bold my-2"
              onClick={() => {
                const item = props.result.item;
                const v = val();

                const isArray = (v) => {
                  return v.startsWith("[") && v.endsWith("]");
                };
                const isString = (v) => {
                  return v.startsWith('"') && v.endsWith('"');
                };
                const isObject = (v) => {
                  if (!v.startsWith("{") && !v.endsWith("}")) {
                    return false;
                  }
                  try {
                    JSON.parse(v);
                    return true;
                  } catch (err) {
                    return false;
                  }
                };

                const isNumber = (v) => {
                  return !isNaN(v);
                };

                const isBool = (v) => {
                  return v === "true" || v === "false";
                };
                console.log(JSON.parse(v));
                return;

                if (typeof v !== typeof item.data.value) {
                  alert(
                    `Cannot change ${typeof item.data.value} to ${typeof v}`
                  );
                  return;
                }
                if (v) {
                  console.log(v, props);
                  patch(item.id, {
                    data: {
                      key: item.data.key,
                      value: v,
                      type: item.data.type,
                    },
                  });
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
const FilterLabel = (props) => {
  return (
    <div
      class={clsx(
        "inline-block shadow-sm p-1 px-2 mr-1 bg-gray-300",
        props.small ? "text-xs" : "text-sm"
      )}
    >
      {props.text}
    </div>
  );
};
const FilterButton = (props) => {
  return (
    <button
      class={clsx(
        "shadow-sm p-1 px-2 mr-1",
        props.isSelected ? "bg-pink-600 text-white" : "bg-pink-200",
        props.small ? "text-xs" : "text-sm"
      )}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};
