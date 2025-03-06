import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto(`file://${process.cwd()}/tests/generic.html`);
    await page.evaluate(() => {
        window.hotkeyTriggered = false;
    });
});

test("should trigger when Ctrl+Up is pressed on document", async ({ page }) => {
    await page.evaluate(() => {
        window.registerHotkey(document, "Ctrl + Up", () => {
            window.hotkeyTriggered = true;
        });
    });

    await page.keyboard.down("Control");
    await page.keyboard.press("ArrowUp");

    const triggered = await page.evaluate(() => window.hotkeyTriggered);
    expect(triggered).toBe(true);
});

test("should trigger when Ctrl+Up is pressed on window", async ({ page }) => {
    await page.evaluate(() => {
        window.registerHotkey(window, "Ctrl + Up", () => {
            window.hotkeyTriggered = true;
        });
    });

    await page.keyboard.down("Control");
    await page.keyboard.press("ArrowUp");

    const triggered = await page.evaluate(() => window.hotkeyTriggered);
    expect(triggered).toBe(true);
});

test("should trigger when Ctrl+K is pressed on a specific element", async ({ page }) => {
    await page.evaluate(() => {
        const el = document.getElementById("text");

        window.registerHotkey(el, "Ctrl + K", () => {
            window.hotkeyTriggered = true;
        });
    });

    await page.locator("#text").focus();

    await page.keyboard.down("Control");
    await page.keyboard.press("K");

    const triggered = await page.evaluate(() => window.hotkeyTriggered);
    expect(triggered).toBe(true);
});

test("should trigger when Shift+K is pressed on an element matching the selector", async ({ page }) => {
    await page.evaluate(() => {
        window.registerHotkey("#text", "Shift + K", () => {
            window.hotkeyTriggered = true;
        });
    });

    await page.locator("#text").focus();

    await page.keyboard.down("Shift");
    await page.keyboard.press("K");

    const triggered = await page.evaluate(() => window.hotkeyTriggered);
    expect(triggered).toBe(true);
});

test("should trigger when Ctrl+Alt+Shift+K is pressed", async ({ page }) => {
    await page.evaluate(() => {
        window.registerHotkey("#text", "Ctrl+Alt+Shift+K", () => {
            window.hotkeyTriggered = true;
        });
    });

    await page.locator("#text").focus();

    await page.keyboard.down("Control");
    await page.keyboard.down("Alt");
    await page.keyboard.down("Shift");
    await page.keyboard.press("K");

    const triggered = await page.evaluate(() => window.hotkeyTriggered);
    expect(triggered).toBe(true);
});

test("should trigger when Alt+Shift+K is pressed", async ({ page }) => {
    await page.evaluate(() => {
        window.registerHotkey("#text", "Alt+Shift+K", () => {
            window.hotkeyTriggered = true;
        });
    });

    await page.locator("#text").focus();

    await page.keyboard.down("Alt");
    await page.keyboard.down("Shift");
    await page.keyboard.press("K");

    const triggered = await page.evaluate(() => window.hotkeyTriggered);
    expect(triggered).toBe(true);
});

test("should trigger when Alt+K is pressed", async ({ page }) => {
    await page.evaluate(() => {
        window.registerHotkey("#text", "Alt+K", () => {
            window.hotkeyTriggered = true;
        });
    });

    await page.locator("#text").focus();

    await page.keyboard.down("Alt");
    await page.keyboard.press("K");

    const triggered = await page.evaluate(() => window.hotkeyTriggered);
    expect(triggered).toBe(true);
});

test("should trigger when K is pressed without modifiers", async ({ page }) => {
    await page.evaluate(() => {
        window.registerHotkey("#text", "K", () => {
            window.hotkeyTriggered = true;
        });
    });

    await page.locator("#text").focus();
    await page.keyboard.press("K");

    const triggered = await page.evaluate(() => window.hotkeyTriggered);
    expect(triggered).toBe(true);
});

test("should not trigger hotkey when additional modifier keys are pressed", async ({ page }) => {
    await page.evaluate(() => {
        window.registerHotkey("#text", "Alt+K", () => {
            window.hotkeyTriggered = true;
        });
    });

    await page.locator("#text").focus();

    await page.keyboard.down("Shift");
    await page.keyboard.down("Alt");
    await page.keyboard.press("K");

    const triggered = await page.evaluate(() => window.hotkeyTriggered);
    expect(triggered).toBe(false);
});

test("should not trigger on elements with [data-hotkey-ignore]", async ({ page }) => {
    await page.evaluate(() => {
        const el = document.getElementById("ignored");

        window.registerHotkey(el, "Ctrl + K", () => {
            window.hotkeyTriggered = true;
        });
    });

    await page.locator("#ignored").focus();

    await page.keyboard.down("Control");
    await page.keyboard.press("K");

    const triggered = await page.evaluate(() => window.hotkeyTriggered);
    expect(triggered).toBe(false);
});

test("should not trigger when parent has [data-hotkey-ignore]", async ({ page }) => {
    await page.evaluate(() => {
        const el = document.getElementById("ignored-via-parent");

        window.registerHotkey(el, "Ctrl + K", () => {
            window.hotkeyTriggered = true;
        });
    });

    await page.locator("#ignored-via-parent").focus();

    await page.keyboard.down("Control");
    await page.keyboard.press("K");

    const triggered = await page.evaluate(() => window.hotkeyTriggered);
    expect(triggered).toBe(false);
});

test("should trigger on 'keydown'", async ({ page }) => {
    await page.evaluate(() => {
        const el = document.getElementById("text");

        window.registerHotkey(el, "Ctrl + K", () => {
            window.hotkeyTriggered = true;
        });
    });

    await page.locator("#text").focus();

    await page.keyboard.down("Control");
    await page.keyboard.down("K");

    const triggered = await page.evaluate(() => window.hotkeyTriggered);
    expect(triggered).toBe(true);
});

test("should trigger on 'keyup'", async ({ page }) => {
    await page.evaluate(() => {
        const el = document.getElementById("text");

        window.registerHotkey(el, "Ctrl + K", () => {
            window.hotkeyTriggered = true;
        }, "keyup");
    });

    await page.locator("#text").focus();

    await page.keyboard.down("Control");
    await page.keyboard.down("K");
    await page.keyboard.up("K");

    const triggered = await page.evaluate(() => window.hotkeyTriggered);
    expect(triggered).toBe(true);
});

test("should trigger on 'keyup' when using keyboard.press()", async ({ page }) => {
    await page.evaluate(() => {
        const el = document.getElementById("text");

        window.registerHotkey(el, "Ctrl + K", () => {
            window.hotkeyTriggered = true;
        }, "keyup");
    });

    await page.locator("#text").focus();

    await page.keyboard.down("Control");
    await page.keyboard.press("K");

    const triggered = await page.evaluate(() => window.hotkeyTriggered);
    expect(triggered).toBe(true);
});
