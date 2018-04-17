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
  },

  isKeyPad: function () {
    if (window.cordova && ['android', 'ios'].indexof(window.cordova.platformId) >= 0) {
      return false;
    }
    return true;
  },
  
  isMouse: function () {
    if (window.cordova && 'browser' === window.cordova.platformId) {
      return true;
    }
    return false;
  }
};

export default utils;
