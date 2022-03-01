let readValue = null;
let lastFileCalled = null;
let calledTimes = 0;

export default {
  reset: () => {
    readValue = null;
    lastFileCalled = null;
    calledTimes = 0;
  },
  setReadValue: (value) => {
    readValue = value;
  },
  readFileSync: (filePath) => {
    lastFileCalled = filePath;
    calledTimes += 1;

    return readValue;
  },
  getLastFileCalled: () => lastFileCalled,
  getCalledTimes: () => calledTimes,
};
