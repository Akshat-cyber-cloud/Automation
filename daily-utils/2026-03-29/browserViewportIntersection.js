// Returns a map of element IDs to their intersection states (true = inside viewport)
function createViewportObserver(options = {}) {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0.1,
    onChange = () => {}
  } = options;

  const state = new Map();
  let observer = null;

  const callback = (entries) => {
    const changes = [];
    for (const entry of entries) {
      const prev = state.get(entry.target.id);
      const curr = entry.isIntersecting;
      if (prev !== curr) {
        state.set(entry.target.id, curr);
        changes.push({ id: entry.target.id, intersecting: curr });
      }
    }
    if (changes.length) {
      onChange(changes);
    }
  };

  function observe(id, element) {
    if (!observer) {
      observer = new IntersectionObserver(callback, { root, rootMargin, threshold });
    }
    state.set(id, false);
    observer.observe(element);
  }

  function unobserve(id) {
    const element = document.getElementById(id);
    if (element && observer) {
      observer.unobserve(element);
      state.delete(id);
    }
  }

  function disconnect() {
    if (observer) {
      observer.disconnect();
      state.clear();
      observer = null;
    }
  }

  return { observe, unobserve, disconnect, state };
}