// Runtime validation coverage for the direct Admin workspace entry.
import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("Admin entry opens the original Team dashboard directly", async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { default: App } = await vite.ssrLoadModule("/src/App.tsx");
    const markup = renderToStaticMarkup(React.createElement(App));

    assert.match(markup, /Total Projects/);
    assert.match(markup, /aria-label="Team Board"/);
    assert.doesNotMatch(markup, /Admin Login/);
  } finally {
    await vite.close();
  }
});
