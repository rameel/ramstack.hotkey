# Hotkey
[![NPM](https://img.shields.io/npm/v/@ramstack/hotkey)](https://www.npmjs.com/package/@ramstack/hotkey)
[![MIT](https://img.shields.io/github/license/rameel/ramstack.hotkey.js)](https://github.com/rameel/ramstack.hotkey.js/blob/main/LICENSE)

The `@ramstack/hotkey` package is a very small and lightweight library for handling hotkeys.
The library weighs around 1.3KB and approximately 750 bytes when gzipped.

## Installation

### Using via NPM
```sh
npm install --save @ramstack/hotkey
```

### Using via CDN
```html
<script src="https://cdn.jsdelivr.net/npm/@ramstack/hotkey@1/dist/hotkey.min.js"></script>
```

### Using ES module build

```html
<script type="module">
  import { registerHotkey } from "https://cdn.jsdelivr.net/npm/@ramstack/hotkey@1/dist/hotkey.esm.min.js";
</script>
```

## Quick start
You can specify either the element itself or its selector as the target for key events.
For global listening across the entire page, use `window` or `document`.

```js
registerHotkey("#app", "Ctrl + K", e => {
  e.preventDefault();
  console.log("Search...");
});
```
The function returns a cleanup function that allows you to unsubscribe from event listening.

```js
const cleanup = registerHotkey(...);
...

// Unregister the hotkey when they are no longer needed
cleanup();
```

### Exclude elements from hotkey handling

If you wish to prevent hotkey handling on certain elements, add the `data-hotkey-ignore` attribute
to the respective element.
```html
<div id="app">
    ...
    <!-- Ignoring hotkeys on the input element -->
    <input type="text" data-hotkey-ignore>
</div>
```

Alternatively, apply it to the parent if you want to exclude
an entire group of elements at once.
```html
<div id="app">
    ...
    <!-- Ignoring hotkeys on form elements -->
    <form data-hotkey-ignore>
        ...
    </form>
</div>
```

## API

```ts
/**
 * Registers a hotkey on the specified target element.
 *
 * @param {EventTarget | string} target - The target element on which the hotkey will be registered.
 * @param {string} hotkey - The combination of keys for the hotkey, e.g., "Ctrl+Alt+Delete".
 * @param {(e: KeyboardEvent) => void} handler - The function to be called when the hotkey is triggered.
 * @param {string} [eventName="keydown"] - The name of the event to listen for (default is "keydown").
 * @param {HotkeyEventListenerOptions | boolean | undefined} [options] - Additional options for the event listener.
 *
 * @returns {() => void} - A function to unregister the hotkey.
 */
function registerHotkey(
    target: EventTarget | string,
    hotkey: string,
    handler: (e: KeyboardEvent) => void,
    eventName?: string,
    options?: HotkeyEventListenerOptions | boolean | undefined): () => void;
```
**Parameters**

#### target (required)
The target element on which the hotkey will be registered. Use `window` or `document` for global hotkeys.
```js
registerHotkey(window, "Win + PgUp", e => {
    console.log("Do something");
});
```

#### hotkey (required)
The combination of keys for the hotkey, e.g., `Ctrl + Alt + Delete`
The hotkey description is a case-insensitive. Spaces are not important. Standard key names are used.
You can find them here [Key values for keyboard events](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values)

In addition, there are also aliases for some key names:

```js
const aliases: Record<string, string> = {
    "esc"         : "escape",
    "ins"         : "insert",
    "del"         : "delete",
    "up"          : "arrowup",
    "down"        : "arrowdown",
    "right"       : "arrowright",
    "left"        : "arrowleft",
    "pgup"        : "pageup",
    "pgdn"        : "pagedown",
    "break"       : "pause",
    "scroll"      : "scrolllock",
    "scrlk"       : "scrolllock",
    "prtscr"      : "printscreen",
    "win"         : "meta",
    "windows"     : "meta",
    "cmd"         : "meta",
    "command"     : "meta",
    "comma"       : ",",
    "period"      : ".",
    "quote"       : "\"",
    "singlequote" : "'",
    "colon"       : ":",
    "semicolon"   : ";",
    "plus"        : "+",
    "minus"       : "-",
    "tilde"       : "~",
    "equal"       : "=",
    "slash"       : "/"
};
```

#### handler (required)
The function to be called when the hotkey is triggered.

The value of `this` inside the handler will be a reference to the element.
It will be the same as the value of the `currentTarget` property of the event argument that is passed to the handler.

```js
registerHotkey("#el", "Ctrl + K", function(e) {
    console.log(e.currentTarget === this); // logs true
});
```
As a reminder, arrow functions do not have their own this context.
```js
registerHotkey("#el", "Ctrl + K", e => {
    console.log(e.currentTarget === this); // logs false
});
```

#### eventName (optional, default: 'keydown')
The name of the event to listen for.
You can subscribe to events on `keydown` (used by default) or `keyup`.

```js
registerHotkey(window, "Ctrl + Up", e => {
    e.preventDefault();
    ...
}, "keyup");
```

#### options (optional)
Additional options for the event listener. See [Options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options).

```ts
/**
 * Extended options for hotkey event listeners.
 */
export interface HotkeyEventListenerOptions extends AddEventListenerOptions {
    /**
     * If specified, ensures that only trusted events are handled.
     */
    trusted?: boolean;
}
```
The `trusted` option ensures that only events marked as trusted are handled.
This can help prevent synthetic or untrusted events from triggering hotkeys.

```js
registerHotkey(window, "Ctrl + S", e => {
    e.preventDefault();
    console.log("Saving...");
}, "keydown", { trusted: true });
```
In this example, the hotkey will only trigger for events that are marked as trusted, preventing manually dispatched or synthetic events from interfering.

#### Returns
A function that, when called, unregisters the hotkey.

```js
const cleanup = registerHotkey(...);
...

// Unregister the hotkey when they are no longer needed
cleanup();
```

## Contributions
Bug reports and contributions are welcome.

## License
This package is released as open source under the **MIT License**.
See the [LICENSE](https://github.com/rameel/ramstack.hotkey.js/blob/main/LICENSE) file for more details.
