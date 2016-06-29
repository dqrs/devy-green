// Function.prototype.clone = function() {
//     var cloneObj = this;
//     if(this.__isClone) {
//       cloneObj = this.__clonedFrom;
//     }

//     var temp = function() { return cloneObj.apply(this, arguments); };
//     for(var key in this) {
//         temp[key] = this[key];
//     }

//     temp.__isClone = true;
//     temp.__clonedFrom = cloneObj;

//     return temp;
// };
// If DOM tree is available (browser, IronNode) then render
// results to DOM. Otherwise, do nothing.
window.tape = require('tape')