!function o(t,l,i){function s(e,r){if(!l[e]){if(!t[e]){var n="function"==typeof require&&require;if(!r&&n)return n(e,!0);if(a)return a(e,!0);throw(r=new Error("Cannot find module '"+e+"'")).code="MODULE_NOT_FOUND",r}n=l[e]={exports:{}},t[e][0].call(n.exports,function(r){return s(t[e][1][r]||r)},n,n.exports,o,t,l,i)}return l[e].exports}for(var a="function"==typeof require&&require,r=0;r<i.length;r++)s(i[r]);return s}({1:[function(r,e,n){"use strict";r("./ocls-clear-display");angular.module("viewCustom",["angularLoad","oclsClearDisplay"])},{"./ocls-clear-display":2}],2:[function(r,e,n){"use strict";angular.module("oclsClearDisplay",[]).controller("oclsClearDisplayController",["$scope",function(r){var t=this;this.$onInit=function(){r.$watch(function(){return angular.isDefined(t.parentCtrl.services)?t.parentCtrl.services:0},function(){if(angular.isDefined(t.parentCtrl.services)){console.log("OCLS CLEAR display start");for(var r=t.parentCtrl.services,e=0;e<r.length;e++){console.log(r[e]);var n,o=r[e].publicNote.match(/href="(.+\.scholarsportal\.info\/licenses\/)([^"]+)\"/);0<o.length&&(n=o[1],console.log(n),n=o[2],console.log(n))}}})}}]).component("prmAlmaViewitItemsAfter",{bindings:{parentCtrl:"<"},controller:"oclsClearDisplayController"})},{}]},{},[1]);
//# sourceMappingURL=custom.js.map