// Runtime validation coverage for the user and Admin application entries.
import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("user entry renders sign-in without an Admin Portal", async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { default: App } = await vite.ssrLoadModule("/src/App.tsx");
    const markup = renderToStaticMarkup(React.createElement(App));

    assert.match(markup, /Welcome back/);
    assert.match(markup, /Sign In/);
    assert.doesNotMatch(markup, /Admin Portal/);
  } finally {
    await vite.close();
  }
});
