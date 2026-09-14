import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement matchMedia; components like GlitchText read
// prefers-reduced-motion through it, so tests need a stub.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// The root page fetches live status feeds on mount, and tests must never
// reach the real network. By default fetch returns a request that never
// settles — so nothing updates state after a test has finished — and tests
// that care about fetched data stub it with vi.stubGlobal.
globalThis.fetch = (() => new Promise<Response>(() => {})) as typeof fetch;
