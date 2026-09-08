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
