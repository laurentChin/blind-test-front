const listeners = new Map();

function on(name, cb) {
  if (!listeners.has(name)) {
    listeners.set(name, [cb]);
  } else {
    listeners.get(name).push(cb);
  }
}

function emit(name, data) {
  if (!listeners.has(name)) return;
  listeners.get(name).forEach((listener) => listener(data));
}

function io() {
  return {
    on,
    emit,
  };
}

export default io;
