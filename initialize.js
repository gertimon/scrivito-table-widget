export function initializeTableWidget() {
  function importAll(r) {
    r.keys().forEach(r);
  }

  importAll(require.context("./TableWidget", true, /\.(js|jsx)$/));
};
