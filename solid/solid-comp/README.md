## Life Cycle
### onMount
We've found that developers doing basic tasks don't often think this way, so to make things a little easier we've made an alias, onMount. onMount is just a createEffect call that is non-tracking, which means it never re-runs. It is just an Effect call but you can use it with confidence that it will run only once for your component, once all initial rendering is done.
```javascript
import { render } from "solid-js/web";
import { createSignal, onMount, For } from "solid-js";
import "./styles.css";

function App() {
  const [photos, setPhotos] = createSignal([]);

  onMount(async () => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
    setPhotos(await res.json());
  });

  return <>
    <h1>Photo album</h1>

    <div class="photos">
      <For each={photos()} fallback={<p>Loading...</p>}>{ photo =>
        <figure>
          <img src={photo.thumbnailUrl} alt={photo.title} />
          <figcaption>{photo.title}</figcaption>
        </figure>
      }</For>
    </div>
  </>;
}

render(() => <App />, document.getElementById('app'));
```

### onCleanup
```javascript
```


### onMount
```javascript
```