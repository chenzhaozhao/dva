import 'core-js'
import '@babel/polyfill'
import 'fetch-detector'
import 'fetch-ie8'
import { setPrototype } from '../utils/setprototypeof'

require('es6-promise').polyfill()

global.requestAnimationFrame = global.requestAnimationFrame || function(callback) {
    setTimeout(callback, 0)
};

Object.setPrototypeOf = setPrototype;
window.console = window.console || (function () {
    var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () { };
    return c;
})();

document.msCapsLockWarningOff = true;