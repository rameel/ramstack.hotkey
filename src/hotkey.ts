const aliases: Record<string, string> = {
    "esc": "escape",
    "ins": "insert",
    "del": "delete",
    "up": "arrowup",
    "down": "arrowdown",
    "right": "arrowright",
    "left": "arrowleft",
    "pgup": "pageup",
    "pgdn": "pagedown",
    "break": "pause",
    "scroll": "scrolllock",
    "scrlk": "scrolllock",
    "prtscr": "printscreen",
    "win": "meta",
    "windows": "meta",
    "cmd": "meta",
    "command": "meta",
    "comma": ",",
    "period": ".",
    "quote": "\"",
    "singlequote": "'",
    "colon": ":",
    "semicolon": ";",
    "plus": "+",
    "minus": "-",
    "tilde": "~",
    "equal": "=",
    "slash": "/"
};

const control_keys: string[] = [
    "ctrlKey",
    "altKey",
    "shiftKey",
    "metaKey"
];

interface Hotkey {
    code: string;
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    metaKey: boolean;
}

/**
 * Registers a hotkey on the specified target element.
 *
 * @param {EventTarget | string} target - The target element on which the hotkey will be registered.
 * @param {string} hotkey - The combination of keys for the hotkey, e.g., "Ctrl+Alt+Delete".
 * @param {(e: KeyboardEvent) => void} handler - The function to be called when the hotkey is triggered.
 * @param {string} [eventName="keydown"] - The name of the event to listen for (default is "keydown").
 * @param {AddEventListenerOptions | boolean | undefined} [options] - Additional options for the event listener.
 *
 * @returns {() => void} - A function to unregister the hotkey.
 */
export function registerHotkey(
    target: EventTarget | string,
    hotkey: string,
    handler: (e: KeyboardEvent) => void,
    eventName: string = "keydown",
    options?: AddEventListenerOptions | boolean | undefined): () => void {

    const info = describe(hotkey);

    if (typeof target === "string") {
        target = document.querySelector(target) ?? error(`No element found for selector '${target}'`);
    }

    return listen(target, eventName, function (this: EventTarget, e: KeyboardEvent) {
        if (!(e.target as HTMLElement)?.closest("[data-hotkey-ignore]")) {
            if (info.code === e.code.toUpperCase()) {
                if (control_keys.every(n => info[n as keyof Hotkey] === e[n as keyof KeyboardEvent])) {
                    handler.call(this, e);
                }
            }
        }
    } as EventListener, options);
}

function describe(hotkey: string): Hotkey {
    const keys = hotkey.replace(/\s+/g, "").toLowerCase().split("+");
    const info = keys.reduce((data, k) => {
        k = aliases[k] ?? k;
        switch (k) {
            case "ctrl":
            case "alt":
            case "shift":
            case "meta":
                data[`${k}Key`] = true;
                break;

            default:
                k.length || error_invalid_key(hotkey);
                k = k.toUpperCase();

                data.code = k.length === 1 && k >= 'A' && k <= 'Z' ? `KEY${k}` : k;
                break;
        }
        return data;
    }, {
        code: "",
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false
    });

    info.code || error_invalid_key(hotkey);
    return info;
}

function listen(target: EventTarget, type: string, callback: EventListener | null, options?: AddEventListenerOptions | boolean | undefined): () => void {
    target.addEventListener(type, callback, options);
    return () => target.removeEventListener(type, callback, options);
}

function error_invalid_key(hotkey: string): never {
    error(`Invalid hotkey: '${hotkey}'`);
}

function error(message: string): never {
    throw new Error(message);
}
