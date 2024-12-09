"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _context;
// let sum = (a, b = 0) => a + b;

(0, _includes["default"])(_context = [1, 2, 3]).call(_context, 1);
var A = /*#__PURE__*/(0, _createClass2["default"])(function A() {
  (0, _classCallCheck2["default"])(this, A);
});
var p = new Proxy({
  a: 1
}, {
  get: function get(target, prop, receiver) {
    console.log('get', prop);
    return target[prop];
  },
  set: function set(target, prop, value, receiver) {
    console.log('set', prop, value);
    target[prop] = value;
    return true;
  }
});
p.a = 2;