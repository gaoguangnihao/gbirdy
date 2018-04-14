const DEBUG = true;
const TRACE = false;

const utils = {
  centerGameObjects: function (objects) {
    objects.forEach((object) => {
      object.anchor.setTo(0.5);
    });
  },

  debug: function (...args) {
    if (DEBUG) {
      console.log(
        Array.prototype.join.call(args));
      if (TRACE) {
        console.trace();
      }
    }
  }
};

export default utils;
