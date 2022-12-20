//  onMount is just a createEffect call that is non-tracking, which means it never re-runs. It is just an Effect call but you can use it with confidence that it will run only once for your component, once all initial rendering is done. Lifecycles are only run in the browser, so putting code in onMount has the benefit of not running on the server during SSR.
import { createSignal, onMount, For } from "solid-js";
export const LCOnMount = () => {
  const [photos, setPhotos] = createSignal([]);

  onMount(async () => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/photos?_limit=20`
    );
    setPhotos(await res.json());
  });

  return (
    <>
      <h1>Photo album</h1>

      <div class="photos">
        <For each={photos()} fallback={<p>Loading...</p>}>
          {(photo) => (
            <figure>
              <img src={photo.thumbnailUrl} alt={photo.title} />
              <figcaption>{photo.title}</figcaption>
            </figure>
          )}
        </For>
      </div>
    </>
  );
};

export const LCOnCleanup = () => {
  const [photos, setPhotos] = createSignal([]);

  onMount(async () => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/photos?_limit=20`
    );
    setPhotos(await res.json());
  });

  return (
    <>
      <h1>Photo album</h1>

      <div class="photos">
        <For each={photos()} fallback={<p>Loading...</p>}>
          {(photo) => (
            <figure>
              <img src={photo.thumbnailUrl} alt={photo.title} />
              <figcaption>{photo.title}</figcaption>
            </figure>
          )}
        </For>
      </div>
    </>
  );
};
