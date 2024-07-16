(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BrowserStarknetkit = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ArgentMobileConnector", {
  enumerable: true,
  get: function () {
    return _index70f373da.A;
  }
});
Object.defineProperty(exports, "isInArgentMobileAppBrowser", {
  enumerable: true,
  get: function () {
    return _index70f373da.i;
  }
});
require("starknet");
var _index70f373da = require("./index-70f373da.js");
require("./lastConnected-b964dc30.js");
require("./publicRcpNodes-be041588.js");

},{"./index-70f373da.js":7,"./lastConnected-b964dc30.js":12,"./publicRcpNodes-be041588.js":14,"starknet":undefined}],3:[function(require,module,exports){
(function (process,global){(function (){
"use strict";var Ru=Object.defineProperty;var Cu=(i,e,t)=>e in i?Ru(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var we=(i,e,t)=>(Cu(i,typeof e!="symbol"?e+"":e,t),t);Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const Qe=require("./lastConnected-080a1315.cjs"),$i=require("starknet"),Au=require("./index-6f5141f0.cjs");require("./publicRcpNodes-77022e83.cjs");var sn={exports:{}},Fi=typeof Reflect=="object"?Reflect:null,Bn=Fi&&typeof Fi.apply=="function"?Fi.apply:function(e,t,s){return Function.prototype.apply.call(e,t,s)},qs;Fi&&typeof Fi.ownKeys=="function"?qs=Fi.ownKeys:Object.getOwnPropertySymbols?qs=function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:qs=function(e){return Object.getOwnPropertyNames(e)};function Tu(i){console&&console.warn&&console.warn(i)}var Ga=Number.isNaN||function(e){return e!==e};function Oe(){Oe.init.call(this)}sn.exports=Oe;sn.exports.once=Lu;Oe.EventEmitter=Oe;Oe.prototype._events=void 0;Oe.prototype._eventsCount=0;Oe.prototype._maxListeners=void 0;var kn=10;function tr(i){if(typeof i!="function")throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof i)}Object.defineProperty(Oe,"defaultMaxListeners",{enumerable:!0,get:function(){return kn},set:function(i){if(typeof i!="number"||i<0||Ga(i))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+i+".");kn=i}});Oe.init=function(){(this._events===void 0||this._events===Object.getPrototypeOf(this)._events)&&(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0};Oe.prototype.setMaxListeners=function(e){if(typeof e!="number"||e<0||Ga(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this};function Wa(i){return i._maxListeners===void 0?Oe.defaultMaxListeners:i._maxListeners}Oe.prototype.getMaxListeners=function(){return Wa(this)};Oe.prototype.emit=function(e){for(var t=[],s=1;s<arguments.length;s++)t.push(arguments[s]);var r=e==="error",n=this._events;if(n!==void 0)r=r&&n.error===void 0;else if(!r)return!1;if(r){var o;if(t.length>0&&(o=t[0]),o instanceof Error)throw o;var c=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw c.context=o,c}var u=n[e];if(u===void 0)return!1;if(typeof u=="function")Bn(u,this,t);else for(var d=u.length,p=Za(u,d),s=0;s<d;++s)Bn(p[s],this,t);return!0};function Ya(i,e,t,s){var r,n,o;if(tr(t),n=i._events,n===void 0?(n=i._events=Object.create(null),i._eventsCount=0):(n.newListener!==void 0&&(i.emit("newListener",e,t.listener?t.listener:t),n=i._events),o=n[e]),o===void 0)o=n[e]=t,++i._eventsCount;else if(typeof o=="function"?o=n[e]=s?[t,o]:[o,t]:s?o.unshift(t):o.push(t),r=Wa(i),r>0&&o.length>r&&!o.warned){o.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=i,c.type=e,c.count=o.length,Tu(c)}return i}Oe.prototype.addListener=function(e,t){return Ya(this,e,t,!1)};Oe.prototype.on=Oe.prototype.addListener;Oe.prototype.prependListener=function(e,t){return Ya(this,e,t,!0)};function $u(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length===0?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function Ja(i,e,t){var s={fired:!1,wrapFn:void 0,target:i,type:e,listener:t},r=$u.bind(s);return r.listener=t,s.wrapFn=r,r}Oe.prototype.once=function(e,t){return tr(t),this.on(e,Ja(this,e,t)),this};Oe.prototype.prependOnceListener=function(e,t){return tr(t),this.prependListener(e,Ja(this,e,t)),this};Oe.prototype.removeListener=function(e,t){var s,r,n,o,c;if(tr(t),r=this._events,r===void 0)return this;if(s=r[e],s===void 0)return this;if(s===t||s.listener===t)--this._eventsCount===0?this._events=Object.create(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,s.listener||t));else if(typeof s!="function"){for(n=-1,o=s.length-1;o>=0;o--)if(s[o]===t||s[o].listener===t){c=s[o].listener,n=o;break}if(n<0)return this;n===0?s.shift():Fu(s,n),s.length===1&&(r[e]=s[0]),r.removeListener!==void 0&&this.emit("removeListener",e,c||t)}return this};Oe.prototype.off=Oe.prototype.removeListener;Oe.prototype.removeAllListeners=function(e){var t,s,r;if(s=this._events,s===void 0)return this;if(s.removeListener===void 0)return arguments.length===0?(this._events=Object.create(null),this._eventsCount=0):s[e]!==void 0&&(--this._eventsCount===0?this._events=Object.create(null):delete s[e]),this;if(arguments.length===0){var n=Object.keys(s),o;for(r=0;r<n.length;++r)o=n[r],o!=="removeListener"&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if(t=s[e],typeof t=="function")this.removeListener(e,t);else if(t!==void 0)for(r=t.length-1;r>=0;r--)this.removeListener(e,t[r]);return this};function Qa(i,e,t){var s=i._events;if(s===void 0)return[];var r=s[e];return r===void 0?[]:typeof r=="function"?t?[r.listener||r]:[r]:t?Uu(r):Za(r,r.length)}Oe.prototype.listeners=function(e){return Qa(this,e,!0)};Oe.prototype.rawListeners=function(e){return Qa(this,e,!1)};Oe.listenerCount=function(i,e){return typeof i.listenerCount=="function"?i.listenerCount(e):Xa.call(i,e)};Oe.prototype.listenerCount=Xa;function Xa(i){var e=this._events;if(e!==void 0){var t=e[i];if(typeof t=="function")return 1;if(t!==void 0)return t.length}return 0}Oe.prototype.eventNames=function(){return this._eventsCount>0?qs(this._events):[]};function Za(i,e){for(var t=new Array(e),s=0;s<e;++s)t[s]=i[s];return t}function Fu(i,e){for(;e+1<i.length;e++)i[e]=i[e+1];i.pop()}function Uu(i){for(var e=new Array(i.length),t=0;t<e.length;++t)e[t]=i[t].listener||i[t];return e}function Lu(i,e){return new Promise(function(t,s){function r(o){i.removeListener(e,n),s(o)}function n(){typeof i.removeListener=="function"&&i.removeListener("error",r),t([].slice.call(arguments))}ec(i,e,n,{once:!0}),e!=="error"&&Mu(i,r,{once:!0})})}function Mu(i,e,t){typeof i.on=="function"&&ec(i,"error",e,t)}function ec(i,e,t,s){if(typeof i.on=="function")s.once?i.once(e,t):i.on(e,t);else if(typeof i.addEventListener=="function")i.addEventListener(e,function r(n){s.once&&i.removeEventListener(e,r),t(n)});else throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof i)}var We=sn.exports;const ir=Qe.getDefaultExportFromCjs(We);var sr={},tc={exports:{}};/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */(function(i){var e,t,s,r,n,o,c,u,d,p,b,x,O,_,C,F,K,I,D,y,w,f,a;(function(l){var L=typeof Qe.commonjsGlobal=="object"?Qe.commonjsGlobal:typeof self=="object"?self:typeof this=="object"?this:{};l(v(L,v(i.exports)));function v(R,$){return R!==L&&(typeof Object.create=="function"?Object.defineProperty(R,"__esModule",{value:!0}):R.__esModule=!0),function(q,m){return R[q]=$?$(q,m):m}}})(function(l){var L=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(v,R){v.__proto__=R}||function(v,R){for(var $ in R)R.hasOwnProperty($)&&(v[$]=R[$])};e=function(v,R){L(v,R);function $(){this.constructor=v}v.prototype=R===null?Object.create(R):($.prototype=R.prototype,new $)},t=Object.assign||function(v){for(var R,$=1,q=arguments.length;$<q;$++){R=arguments[$];for(var m in R)Object.prototype.hasOwnProperty.call(R,m)&&(v[m]=R[m])}return v},s=function(v,R){var $={};for(var q in v)Object.prototype.hasOwnProperty.call(v,q)&&R.indexOf(q)<0&&($[q]=v[q]);if(v!=null&&typeof Object.getOwnPropertySymbols=="function")for(var m=0,q=Object.getOwnPropertySymbols(v);m<q.length;m++)R.indexOf(q[m])<0&&Object.prototype.propertyIsEnumerable.call(v,q[m])&&($[q[m]]=v[q[m]]);return $},r=function(v,R,$,q){var m=arguments.length,E=m<3?R:q===null?q=Object.getOwnPropertyDescriptor(R,$):q,B;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")E=Reflect.decorate(v,R,$,q);else for(var z=v.length-1;z>=0;z--)(B=v[z])&&(E=(m<3?B(E):m>3?B(R,$,E):B(R,$))||E);return m>3&&E&&Object.defineProperty(R,$,E),E},n=function(v,R){return function($,q){R($,q,v)}},o=function(v,R){if(typeof Reflect=="object"&&typeof Reflect.metadata=="function")return Reflect.metadata(v,R)},c=function(v,R,$,q){function m(E){return E instanceof $?E:new $(function(B){B(E)})}return new($||($=Promise))(function(E,B){function z(M){try{U(q.next(M))}catch(H){B(H)}}function j(M){try{U(q.throw(M))}catch(H){B(H)}}function U(M){M.done?E(M.value):m(M.value).then(z,j)}U((q=q.apply(v,R||[])).next())})},u=function(v,R){var $={label:0,sent:function(){if(E[0]&1)throw E[1];return E[1]},trys:[],ops:[]},q,m,E,B;return B={next:z(0),throw:z(1),return:z(2)},typeof Symbol=="function"&&(B[Symbol.iterator]=function(){return this}),B;function z(U){return function(M){return j([U,M])}}function j(U){if(q)throw new TypeError("Generator is already executing.");for(;$;)try{if(q=1,m&&(E=U[0]&2?m.return:U[0]?m.throw||((E=m.return)&&E.call(m),0):m.next)&&!(E=E.call(m,U[1])).done)return E;switch(m=0,E&&(U=[U[0]&2,E.value]),U[0]){case 0:case 1:E=U;break;case 4:return $.label++,{value:U[1],done:!1};case 5:$.label++,m=U[1],U=[0];continue;case 7:U=$.ops.pop(),$.trys.pop();continue;default:if(E=$.trys,!(E=E.length>0&&E[E.length-1])&&(U[0]===6||U[0]===2)){$=0;continue}if(U[0]===3&&(!E||U[1]>E[0]&&U[1]<E[3])){$.label=U[1];break}if(U[0]===6&&$.label<E[1]){$.label=E[1],E=U;break}if(E&&$.label<E[2]){$.label=E[2],$.ops.push(U);break}E[2]&&$.ops.pop(),$.trys.pop();continue}U=R.call(v,$)}catch(M){U=[6,M],m=0}finally{q=E=0}if(U[0]&5)throw U[1];return{value:U[0]?U[1]:void 0,done:!0}}},a=function(v,R,$,q){q===void 0&&(q=$),v[q]=R[$]},d=function(v,R){for(var $ in v)$!=="default"&&!R.hasOwnProperty($)&&(R[$]=v[$])},p=function(v){var R=typeof Symbol=="function"&&Symbol.iterator,$=R&&v[R],q=0;if($)return $.call(v);if(v&&typeof v.length=="number")return{next:function(){return v&&q>=v.length&&(v=void 0),{value:v&&v[q++],done:!v}}};throw new TypeError(R?"Object is not iterable.":"Symbol.iterator is not defined.")},b=function(v,R){var $=typeof Symbol=="function"&&v[Symbol.iterator];if(!$)return v;var q=$.call(v),m,E=[],B;try{for(;(R===void 0||R-- >0)&&!(m=q.next()).done;)E.push(m.value)}catch(z){B={error:z}}finally{try{m&&!m.done&&($=q.return)&&$.call(q)}finally{if(B)throw B.error}}return E},x=function(){for(var v=[],R=0;R<arguments.length;R++)v=v.concat(b(arguments[R]));return v},O=function(){for(var v=0,R=0,$=arguments.length;R<$;R++)v+=arguments[R].length;for(var q=Array(v),m=0,R=0;R<$;R++)for(var E=arguments[R],B=0,z=E.length;B<z;B++,m++)q[m]=E[B];return q},_=function(v){return this instanceof _?(this.v=v,this):new _(v)},C=function(v,R,$){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var q=$.apply(v,R||[]),m,E=[];return m={},B("next"),B("throw"),B("return"),m[Symbol.asyncIterator]=function(){return this},m;function B(te){q[te]&&(m[te]=function(G){return new Promise(function(ie,Q){E.push([te,G,ie,Q])>1||z(te,G)})})}function z(te,G){try{j(q[te](G))}catch(ie){H(E[0][3],ie)}}function j(te){te.value instanceof _?Promise.resolve(te.value.v).then(U,M):H(E[0][2],te)}function U(te){z("next",te)}function M(te){z("throw",te)}function H(te,G){te(G),E.shift(),E.length&&z(E[0][0],E[0][1])}},F=function(v){var R,$;return R={},q("next"),q("throw",function(m){throw m}),q("return"),R[Symbol.iterator]=function(){return this},R;function q(m,E){R[m]=v[m]?function(B){return($=!$)?{value:_(v[m](B)),done:m==="return"}:E?E(B):B}:E}},K=function(v){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var R=v[Symbol.asyncIterator],$;return R?R.call(v):(v=typeof p=="function"?p(v):v[Symbol.iterator](),$={},q("next"),q("throw"),q("return"),$[Symbol.asyncIterator]=function(){return this},$);function q(E){$[E]=v[E]&&function(B){return new Promise(function(z,j){B=v[E](B),m(z,j,B.done,B.value)})}}function m(E,B,z,j){Promise.resolve(j).then(function(U){E({value:U,done:z})},B)}},I=function(v,R){return Object.defineProperty?Object.defineProperty(v,"raw",{value:R}):v.raw=R,v},D=function(v){if(v&&v.__esModule)return v;var R={};if(v!=null)for(var $ in v)Object.hasOwnProperty.call(v,$)&&(R[$]=v[$]);return R.default=v,R},y=function(v){return v&&v.__esModule?v:{default:v}},w=function(v,R){if(!R.has(v))throw new TypeError("attempted to get private field on non-instance");return R.get(v)},f=function(v,R,$){if(!R.has(v))throw new TypeError("attempted to set private field on non-instance");return R.set(v,$),$},l("__extends",e),l("__assign",t),l("__rest",s),l("__decorate",r),l("__param",n),l("__metadata",o),l("__awaiter",c),l("__generator",u),l("__exportStar",d),l("__createBinding",a),l("__values",p),l("__read",b),l("__spread",x),l("__spreadArrays",O),l("__await",_),l("__asyncGenerator",C),l("__asyncDelegator",F),l("__asyncValues",K),l("__makeTemplateObject",I),l("__importStar",D),l("__importDefault",y),l("__classPrivateFieldGet",w),l("__classPrivateFieldSet",f)})})(tc);var Ft=tc.exports,ps={};Object.defineProperty(ps,"__esModule",{value:!0});function qu(i){if(typeof i!="string")throw new Error(`Cannot safe json parse value of type ${typeof i}`);try{return JSON.parse(i)}catch{return i}}ps.safeJsonParse=qu;function ju(i){return typeof i=="string"?i:JSON.stringify(i,(e,t)=>typeof t>"u"?null:t)}ps.safeJsonStringify=ju;var Hi={exports:{}},Hn;function zu(){return Hn||(Hn=1,function(){let i;function e(){}i=e,i.prototype.getItem=function(t){return this.hasOwnProperty(t)?String(this[t]):null},i.prototype.setItem=function(t,s){this[t]=String(s)},i.prototype.removeItem=function(t){delete this[t]},i.prototype.clear=function(){const t=this;Object.keys(t).forEach(function(s){t[s]=void 0,delete t[s]})},i.prototype.key=function(t){return t=t||0,Object.keys(this)[t]},i.prototype.__defineGetter__("length",function(){return Object.keys(this).length}),typeof Qe.commonjsGlobal<"u"&&Qe.commonjsGlobal.localStorage?Hi.exports=Qe.commonjsGlobal.localStorage:typeof window<"u"&&window.localStorage?Hi.exports=window.localStorage:Hi.exports=new e}()),Hi.exports}var yr={},Gi={},Gn;function Ku(){if(Gn)return Gi;Gn=1,Object.defineProperty(Gi,"__esModule",{value:!0}),Gi.IKeyValueStorage=void 0;class i{}return Gi.IKeyValueStorage=i,Gi}var Wi={},Wn;function Vu(){if(Wn)return Wi;Wn=1,Object.defineProperty(Wi,"__esModule",{value:!0}),Wi.parseEntry=void 0;const i=ps;function e(t){var s;return[t[0],i.safeJsonParse((s=t[1])!==null&&s!==void 0?s:"")]}return Wi.parseEntry=e,Wi}var Yn;function Bu(){return Yn||(Yn=1,function(i){Object.defineProperty(i,"__esModule",{value:!0});const e=Ft;e.__exportStar(Ku(),i),e.__exportStar(Vu(),i)}(yr)),yr}Object.defineProperty(sr,"__esModule",{value:!0});sr.KeyValueStorage=void 0;const Ci=Ft,Jn=ps,ku=Ci.__importDefault(zu()),Hu=Bu();class ic{constructor(){this.localStorage=ku.default}getKeys(){return Ci.__awaiter(this,void 0,void 0,function*(){return Object.keys(this.localStorage)})}getEntries(){return Ci.__awaiter(this,void 0,void 0,function*(){return Object.entries(this.localStorage).map(Hu.parseEntry)})}getItem(e){return Ci.__awaiter(this,void 0,void 0,function*(){const t=this.localStorage.getItem(e);if(t!==null)return Jn.safeJsonParse(t)})}setItem(e,t){return Ci.__awaiter(this,void 0,void 0,function*(){this.localStorage.setItem(e,Jn.safeJsonStringify(t))})}removeItem(e){return Ci.__awaiter(this,void 0,void 0,function*(){this.localStorage.removeItem(e)})}}sr.KeyValueStorage=ic;var sc=sr.default=ic,Wt={},Yi={},V={},mr={},Ji={},Qn;function Gu(){if(Qn)return Ji;Qn=1,Object.defineProperty(Ji,"__esModule",{value:!0}),Ji.delay=void 0;function i(e){return new Promise(t=>{setTimeout(()=>{t(!0)},e)})}return Ji.delay=i,Ji}var mi={},br={},bi={},Xn;function Wu(){return Xn||(Xn=1,Object.defineProperty(bi,"__esModule",{value:!0}),bi.ONE_THOUSAND=bi.ONE_HUNDRED=void 0,bi.ONE_HUNDRED=100,bi.ONE_THOUSAND=1e3),bi}var wr={},Zn;function Yu(){return Zn||(Zn=1,function(i){Object.defineProperty(i,"__esModule",{value:!0}),i.ONE_YEAR=i.FOUR_WEEKS=i.THREE_WEEKS=i.TWO_WEEKS=i.ONE_WEEK=i.THIRTY_DAYS=i.SEVEN_DAYS=i.FIVE_DAYS=i.THREE_DAYS=i.ONE_DAY=i.TWENTY_FOUR_HOURS=i.TWELVE_HOURS=i.SIX_HOURS=i.THREE_HOURS=i.ONE_HOUR=i.SIXTY_MINUTES=i.THIRTY_MINUTES=i.TEN_MINUTES=i.FIVE_MINUTES=i.ONE_MINUTE=i.SIXTY_SECONDS=i.THIRTY_SECONDS=i.TEN_SECONDS=i.FIVE_SECONDS=i.ONE_SECOND=void 0,i.ONE_SECOND=1,i.FIVE_SECONDS=5,i.TEN_SECONDS=10,i.THIRTY_SECONDS=30,i.SIXTY_SECONDS=60,i.ONE_MINUTE=i.SIXTY_SECONDS,i.FIVE_MINUTES=i.ONE_MINUTE*5,i.TEN_MINUTES=i.ONE_MINUTE*10,i.THIRTY_MINUTES=i.ONE_MINUTE*30,i.SIXTY_MINUTES=i.ONE_MINUTE*60,i.ONE_HOUR=i.SIXTY_MINUTES,i.THREE_HOURS=i.ONE_HOUR*3,i.SIX_HOURS=i.ONE_HOUR*6,i.TWELVE_HOURS=i.ONE_HOUR*12,i.TWENTY_FOUR_HOURS=i.ONE_HOUR*24,i.ONE_DAY=i.TWENTY_FOUR_HOURS,i.THREE_DAYS=i.ONE_DAY*3,i.FIVE_DAYS=i.ONE_DAY*5,i.SEVEN_DAYS=i.ONE_DAY*7,i.THIRTY_DAYS=i.ONE_DAY*30,i.ONE_WEEK=i.SEVEN_DAYS,i.TWO_WEEKS=i.ONE_WEEK*2,i.THREE_WEEKS=i.ONE_WEEK*3,i.FOUR_WEEKS=i.ONE_WEEK*4,i.ONE_YEAR=i.ONE_DAY*365}(wr)),wr}var eo;function rc(){return eo||(eo=1,function(i){Object.defineProperty(i,"__esModule",{value:!0});const e=Ft;e.__exportStar(Wu(),i),e.__exportStar(Yu(),i)}(br)),br}var to;function Ju(){if(to)return mi;to=1,Object.defineProperty(mi,"__esModule",{value:!0}),mi.fromMiliseconds=mi.toMiliseconds=void 0;const i=rc();function e(s){return s*i.ONE_THOUSAND}mi.toMiliseconds=e;function t(s){return Math.floor(s/i.ONE_THOUSAND)}return mi.fromMiliseconds=t,mi}var io;function Qu(){return io||(io=1,function(i){Object.defineProperty(i,"__esModule",{value:!0});const e=Ft;e.__exportStar(Gu(),i),e.__exportStar(Ju(),i)}(mr)),mr}var Ri={},so;function Xu(){if(so)return Ri;so=1,Object.defineProperty(Ri,"__esModule",{value:!0}),Ri.Watch=void 0;class i{constructor(){this.timestamps=new Map}start(t){if(this.timestamps.has(t))throw new Error(`Watch already started for label: ${t}`);this.timestamps.set(t,{started:Date.now()})}stop(t){const s=this.get(t);if(typeof s.elapsed<"u")throw new Error(`Watch already stopped for label: ${t}`);const r=Date.now()-s.started;this.timestamps.set(t,{started:s.started,elapsed:r})}get(t){const s=this.timestamps.get(t);if(typeof s>"u")throw new Error(`No timestamp found for label: ${t}`);return s}elapsed(t){const s=this.get(t);return s.elapsed||Date.now()-s.started}}return Ri.Watch=i,Ri.default=i,Ri}var vr={},Qi={},ro;function Zu(){if(ro)return Qi;ro=1,Object.defineProperty(Qi,"__esModule",{value:!0}),Qi.IWatch=void 0;class i{}return Qi.IWatch=i,Qi}var no;function el(){return no||(no=1,function(i){Object.defineProperty(i,"__esModule",{value:!0}),Ft.__exportStar(Zu(),i)}(vr)),vr}(function(i){Object.defineProperty(i,"__esModule",{value:!0});const e=Ft;e.__exportStar(Qu(),i),e.__exportStar(Xu(),i),e.__exportStar(el(),i),e.__exportStar(rc(),i)})(V);var _r={},Xi={};let Nt=class{};const tl=Object.freeze(Object.defineProperty({__proto__:null,IEvents:Nt},Symbol.toStringTag,{value:"Module"})),il=Qe.getAugmentedNamespace(tl);var oo;function sl(){if(oo)return Xi;oo=1,Object.defineProperty(Xi,"__esModule",{value:!0}),Xi.IHeartBeat=void 0;const i=il;class e extends i.IEvents{constructor(s){super()}}return Xi.IHeartBeat=e,Xi}var ao;function nc(){return ao||(ao=1,function(i){Object.defineProperty(i,"__esModule",{value:!0}),Ft.__exportStar(sl(),i)}(_r)),_r}var Er={},wi={},co;function rl(){if(co)return wi;co=1,Object.defineProperty(wi,"__esModule",{value:!0}),wi.HEARTBEAT_EVENTS=wi.HEARTBEAT_INTERVAL=void 0;const i=V;return wi.HEARTBEAT_INTERVAL=i.FIVE_SECONDS,wi.HEARTBEAT_EVENTS={pulse:"heartbeat_pulse"},wi}var ho;function oc(){return ho||(ho=1,function(i){Object.defineProperty(i,"__esModule",{value:!0}),Ft.__exportStar(rl(),i)}(Er)),Er}var uo;function nl(){if(uo)return Yi;uo=1,Object.defineProperty(Yi,"__esModule",{value:!0}),Yi.HeartBeat=void 0;const i=Ft,e=We,t=V,s=nc(),r=oc();class n extends s.IHeartBeat{constructor(c){super(c),this.events=new e.EventEmitter,this.interval=r.HEARTBEAT_INTERVAL,this.interval=c?.interval||r.HEARTBEAT_INTERVAL}static init(c){return i.__awaiter(this,void 0,void 0,function*(){const u=new n(c);return yield u.init(),u})}init(){return i.__awaiter(this,void 0,void 0,function*(){yield this.initialize()})}stop(){clearInterval(this.intervalRef)}on(c,u){this.events.on(c,u)}once(c,u){this.events.once(c,u)}off(c,u){this.events.off(c,u)}removeListener(c,u){this.events.removeListener(c,u)}initialize(){return i.__awaiter(this,void 0,void 0,function*(){this.intervalRef=setInterval(()=>this.pulse(),t.toMiliseconds(this.interval))})}pulse(){this.events.emit(r.HEARTBEAT_EVENTS.pulse)}}return Yi.HeartBeat=n,Yi}(function(i){Object.defineProperty(i,"__esModule",{value:!0});const e=Ft;e.__exportStar(nl(),i),e.__exportStar(nc(),i),e.__exportStar(oc(),i)})(Wt);var ee={},Sr,lo;function ol(){if(lo)return Sr;lo=1;function i(t){try{return JSON.stringify(t)}catch{return'"[Circular]"'}}Sr=e;function e(t,s,r){var n=r&&r.stringify||i,o=1;if(typeof t=="object"&&t!==null){var c=s.length+o;if(c===1)return t;var u=new Array(c);u[0]=n(t);for(var d=1;d<c;d++)u[d]=n(s[d]);return u.join(" ")}if(typeof t!="string")return t;var p=s.length;if(p===0)return t;for(var b="",x=1-o,O=-1,_=t&&t.length||0,C=0;C<_;){if(t.charCodeAt(C)===37&&C+1<_){switch(O=O>-1?O:0,t.charCodeAt(C+1)){case 100:case 102:if(x>=p||s[x]==null)break;O<C&&(b+=t.slice(O,C)),b+=Number(s[x]),O=C+2,C++;break;case 105:if(x>=p||s[x]==null)break;O<C&&(b+=t.slice(O,C)),b+=Math.floor(Number(s[x])),O=C+2,C++;break;case 79:case 111:case 106:if(x>=p||s[x]===void 0)break;O<C&&(b+=t.slice(O,C));var F=typeof s[x];if(F==="string"){b+="'"+s[x]+"'",O=C+2,C++;break}if(F==="function"){b+=s[x].name||"<anonymous>",O=C+2,C++;break}b+=n(s[x]),O=C+2,C++;break;case 115:if(x>=p)break;O<C&&(b+=t.slice(O,C)),b+=String(s[x]),O=C+2,C++;break;case 37:O<C&&(b+=t.slice(O,C)),b+="%",O=C+2,C++,x--;break}++x}++C}return O===-1?t:(O<_&&(b+=t.slice(O)),b)}return Sr}var Ir,fo;function al(){if(fo)return Ir;fo=1;const i=ol();Ir=r;const e=w().console||{},t={mapHttpRequest:_,mapHttpResponse:_,wrapRequestSerializer:C,wrapResponseSerializer:C,wrapErrorSerializer:C,req:_,res:_,err:x};function s(f,a){return Array.isArray(f)?f.filter(function(L){return L!=="!stdSerializers.err"}):f===!0?Object.keys(a):!1}function r(f){f=f||{},f.browser=f.browser||{};const a=f.browser.transmit;if(a&&typeof a.send!="function")throw Error("pino: transmit option must have a send function");const l=f.browser.write||e;f.browser.write&&(f.browser.asObject=!0);const L=f.serializers||{},v=s(f.browser.serialize,L);let R=f.browser.serialize;Array.isArray(f.browser.serialize)&&f.browser.serialize.indexOf("!stdSerializers.err")>-1&&(R=!1);const $=["error","fatal","warn","info","debug","trace"];typeof l=="function"&&(l.error=l.fatal=l.warn=l.info=l.debug=l.trace=l),f.enabled===!1&&(f.level="silent");const q=f.level||"info",m=Object.create(l);m.log||(m.log=F),Object.defineProperty(m,"levelVal",{get:B}),Object.defineProperty(m,"level",{get:z,set:j});const E={transmit:a,serialize:v,asObject:f.browser.asObject,levels:$,timestamp:O(f)};m.levels=r.levels,m.level=q,m.setMaxListeners=m.getMaxListeners=m.emit=m.addListener=m.on=m.prependListener=m.once=m.prependOnceListener=m.removeListener=m.removeAllListeners=m.listeners=m.listenerCount=m.eventNames=m.write=m.flush=F,m.serializers=L,m._serialize=v,m._stdErrSerialize=R,m.child=U,a&&(m._logEvent=b());function B(){return this.level==="silent"?1/0:this.levels.values[this.level]}function z(){return this._level}function j(M){if(M!=="silent"&&!this.levels.values[M])throw Error("unknown level "+M);this._level=M,n(E,m,"error","log"),n(E,m,"fatal","error"),n(E,m,"warn","error"),n(E,m,"info","log"),n(E,m,"debug","log"),n(E,m,"trace","log")}function U(M,H){if(!M)throw new Error("missing bindings for child Pino");H=H||{},v&&M.serializers&&(H.serializers=M.serializers);const te=H.serializers;if(v&&te){var G=Object.assign({},L,te),ie=f.browser.serialize===!0?Object.keys(G):v;delete M.serializers,u([M],ie,G,this._stdErrSerialize)}function Q(se){this._childLevel=(se._childLevel|0)+1,this.error=d(se,M,"error"),this.fatal=d(se,M,"fatal"),this.warn=d(se,M,"warn"),this.info=d(se,M,"info"),this.debug=d(se,M,"debug"),this.trace=d(se,M,"trace"),G&&(this.serializers=G,this._serialize=ie),a&&(this._logEvent=b([].concat(se._logEvent.bindings,M)))}return Q.prototype=this,new Q(this)}return m}r.levels={values:{fatal:60,error:50,warn:40,info:30,debug:20,trace:10},labels:{10:"trace",20:"debug",30:"info",40:"warn",50:"error",60:"fatal"}},r.stdSerializers=t,r.stdTimeFunctions=Object.assign({},{nullTime:K,epochTime:I,unixTime:D,isoTime:y});function n(f,a,l,L){const v=Object.getPrototypeOf(a);a[l]=a.levelVal>a.levels.values[l]?F:v[l]?v[l]:e[l]||e[L]||F,o(f,a,l)}function o(f,a,l){!f.transmit&&a[l]===F||(a[l]=function(L){return function(){const R=f.timestamp(),$=new Array(arguments.length),q=Object.getPrototypeOf&&Object.getPrototypeOf(this)===e?e:this;for(var m=0;m<$.length;m++)$[m]=arguments[m];if(f.serialize&&!f.asObject&&u($,this._serialize,this.serializers,this._stdErrSerialize),f.asObject?L.call(q,c(this,l,$,R)):L.apply(q,$),f.transmit){const E=f.transmit.level||a.level,B=r.levels.values[E],z=r.levels.values[l];if(z<B)return;p(this,{ts:R,methodLevel:l,methodValue:z,transmitLevel:E,transmitValue:r.levels.values[f.transmit.level||a.level],send:f.transmit.send,val:a.levelVal},$)}}}(a[l]))}function c(f,a,l,L){f._serialize&&u(l,f._serialize,f.serializers,f._stdErrSerialize);const v=l.slice();let R=v[0];const $={};L&&($.time=L),$.level=r.levels.values[a];let q=(f._childLevel|0)+1;if(q<1&&(q=1),R!==null&&typeof R=="object"){for(;q--&&typeof v[0]=="object";)Object.assign($,v.shift());R=v.length?i(v.shift(),v):void 0}else typeof R=="string"&&(R=i(v.shift(),v));return R!==void 0&&($.msg=R),$}function u(f,a,l,L){for(const v in f)if(L&&f[v]instanceof Error)f[v]=r.stdSerializers.err(f[v]);else if(typeof f[v]=="object"&&!Array.isArray(f[v]))for(const R in f[v])a&&a.indexOf(R)>-1&&R in l&&(f[v][R]=l[R](f[v][R]))}function d(f,a,l){return function(){const L=new Array(1+arguments.length);L[0]=a;for(var v=1;v<L.length;v++)L[v]=arguments[v-1];return f[l].apply(this,L)}}function p(f,a,l){const L=a.send,v=a.ts,R=a.methodLevel,$=a.methodValue,q=a.val,m=f._logEvent.bindings;u(l,f._serialize||Object.keys(f.serializers),f.serializers,f._stdErrSerialize===void 0?!0:f._stdErrSerialize),f._logEvent.ts=v,f._logEvent.messages=l.filter(function(E){return m.indexOf(E)===-1}),f._logEvent.level.label=R,f._logEvent.level.value=$,L(R,f._logEvent,q),f._logEvent=b(m)}function b(f){return{ts:0,messages:[],bindings:f||[],level:{label:"",value:0}}}function x(f){const a={type:f.constructor.name,msg:f.message,stack:f.stack};for(const l in f)a[l]===void 0&&(a[l]=f[l]);return a}function O(f){return typeof f.timestamp=="function"?f.timestamp:f.timestamp===!1?K:I}function _(){return{}}function C(f){return f}function F(){}function K(){return!1}function I(){return Date.now()}function D(){return Math.round(Date.now()/1e3)}function y(){return new Date(Date.now()).toISOString()}function w(){function f(a){return typeof a<"u"&&a}try{return typeof globalThis<"u"||Object.defineProperty(Object.prototype,"globalThis",{get:function(){return delete Object.prototype.globalThis,this.globalThis=this},configurable:!0}),globalThis}catch{return f(self)||f(window)||f(this)||{}}}return Ir}var vi={},po;function ac(){return po||(po=1,Object.defineProperty(vi,"__esModule",{value:!0}),vi.PINO_CUSTOM_CONTEXT_KEY=vi.PINO_LOGGER_DEFAULTS=void 0,vi.PINO_LOGGER_DEFAULTS={level:"info"},vi.PINO_CUSTOM_CONTEXT_KEY="custom_context"),vi}var mt={},go;function cl(){if(go)return mt;go=1,Object.defineProperty(mt,"__esModule",{value:!0}),mt.generateChildLogger=mt.formatChildLoggerContext=mt.getLoggerContext=mt.setBrowserLoggerContext=mt.getBrowserLoggerContext=mt.getDefaultLoggerOptions=void 0;const i=ac();function e(c){return Object.assign(Object.assign({},c),{level:c?.level||i.PINO_LOGGER_DEFAULTS.level})}mt.getDefaultLoggerOptions=e;function t(c,u=i.PINO_CUSTOM_CONTEXT_KEY){return c[u]||""}mt.getBrowserLoggerContext=t;function s(c,u,d=i.PINO_CUSTOM_CONTEXT_KEY){return c[d]=u,c}mt.setBrowserLoggerContext=s;function r(c,u=i.PINO_CUSTOM_CONTEXT_KEY){let d="";return typeof c.bindings>"u"?d=t(c,u):d=c.bindings().context||"",d}mt.getLoggerContext=r;function n(c,u,d=i.PINO_CUSTOM_CONTEXT_KEY){const p=r(c,d);return p.trim()?`${p}/${u}`:u}mt.formatChildLoggerContext=n;function o(c,u,d=i.PINO_CUSTOM_CONTEXT_KEY){const p=n(c,u,d),b=c.child({context:p});return s(b,p,d)}return mt.generateChildLogger=o,mt}(function(i){Object.defineProperty(i,"__esModule",{value:!0}),i.pino=void 0;const e=Ft,t=e.__importDefault(al());Object.defineProperty(i,"pino",{enumerable:!0,get:function(){return t.default}}),e.__exportStar(ac(),i),e.__exportStar(cl(),i)})(ee);let hl=class extends Nt{constructor(e){super(),this.opts=e,this.protocol="wc",this.version=2}},ul=class extends Nt{constructor(e,t){super(),this.core=e,this.logger=t,this.records=new Map}},ll=class{constructor(e,t){this.logger=e,this.core=t}},dl=class extends Nt{constructor(e,t){super(),this.relayer=e,this.logger=t}},fl=class extends Nt{constructor(e){super()}},pl=class{constructor(e,t,s,r){this.core=e,this.logger=t,this.name=s}},gl=class extends Nt{constructor(e,t){super(),this.relayer=e,this.logger=t}},yl=class extends Nt{constructor(e,t){super(),this.core=e,this.logger=t}},ml=class{constructor(e,t){this.projectId=e,this.logger=t}},bl=class{constructor(e){this.opts=e,this.protocol="wc",this.version=2}},wl=class{constructor(e){this.client=e}};const vl=i=>JSON.stringify(i,(e,t)=>typeof t=="bigint"?t.toString()+"n":t),_l=i=>{const e=/([\[:])?(\d{17,}|(?:[9](?:[1-9]07199254740991|0[1-9]7199254740991|00[8-9]199254740991|007[2-9]99254740991|007199[3-9]54740991|0071992[6-9]4740991|00719925[5-9]740991|007199254[8-9]40991|0071992547[5-9]0991|00719925474[1-9]991|00719925474099[2-9])))([,\}\]])/g,t=i.replace(e,'$1"$2n"$3');return JSON.parse(t,(s,r)=>typeof r=="string"&&r.match(/^\d+n$/)?BigInt(r.substring(0,r.length-1)):r)};function rn(i){if(typeof i!="string")throw new Error(`Cannot safe json parse value of type ${typeof i}`);try{return _l(i)}catch{return i}}function rr(i){return typeof i=="string"?i:vl(i)||""}var nn={},li={},nr={},or={};Object.defineProperty(or,"__esModule",{value:!0});or.BrowserRandomSource=void 0;const yo=65536;class El{constructor(){this.isAvailable=!1,this.isInstantiated=!1;const e=typeof self<"u"?self.crypto||self.msCrypto:null;e&&e.getRandomValues!==void 0&&(this._crypto=e,this.isAvailable=!0,this.isInstantiated=!0)}randomBytes(e){if(!this.isAvailable||!this._crypto)throw new Error("Browser random byte generator is not available.");const t=new Uint8Array(e);for(let s=0;s<t.length;s+=yo)this._crypto.getRandomValues(t.subarray(s,s+Math.min(t.length-s,yo)));return t}}or.BrowserRandomSource=El;function Sl(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var ar={},Pt={};Object.defineProperty(Pt,"__esModule",{value:!0});function Il(i){for(var e=0;e<i.length;e++)i[e]=0;return i}Pt.wipe=Il;const Dl={},xl=Object.freeze(Object.defineProperty({__proto__:null,default:Dl},Symbol.toStringTag,{value:"Module"})),Ol=Qe.getAugmentedNamespace(xl);Object.defineProperty(ar,"__esModule",{value:!0});ar.NodeRandomSource=void 0;const Nl=Pt;class Pl{constructor(){if(this.isAvailable=!1,this.isInstantiated=!1,typeof Sl<"u"){const e=Ol;e&&e.randomBytes&&(this._crypto=e,this.isAvailable=!0,this.isInstantiated=!0)}}randomBytes(e){if(!this.isAvailable||!this._crypto)throw new Error("Node.js random byte generator is not available.");let t=this._crypto.randomBytes(e);if(t.length!==e)throw new Error("NodeRandomSource: got fewer bytes than requested");const s=new Uint8Array(e);for(let r=0;r<s.length;r++)s[r]=t[r];return(0,Nl.wipe)(t),s}}ar.NodeRandomSource=Pl;Object.defineProperty(nr,"__esModule",{value:!0});nr.SystemRandomSource=void 0;const Rl=or,Cl=ar;class Al{constructor(){if(this.isAvailable=!1,this.name="",this._source=new Rl.BrowserRandomSource,this._source.isAvailable){this.isAvailable=!0,this.name="Browser";return}if(this._source=new Cl.NodeRandomSource,this._source.isAvailable){this.isAvailable=!0,this.name="Node";return}}randomBytes(e){if(!this.isAvailable)throw new Error("System random byte generator is not available.");return this._source.randomBytes(e)}}nr.SystemRandomSource=Al;var oe={},cc={};(function(i){Object.defineProperty(i,"__esModule",{value:!0});function e(c,u){var d=c>>>16&65535,p=c&65535,b=u>>>16&65535,x=u&65535;return p*x+(d*x+p*b<<16>>>0)|0}i.mul=Math.imul||e;function t(c,u){return c+u|0}i.add=t;function s(c,u){return c-u|0}i.sub=s;function r(c,u){return c<<u|c>>>32-u}i.rotl=r;function n(c,u){return c<<32-u|c>>>u}i.rotr=n;function o(c){return typeof c=="number"&&isFinite(c)&&Math.floor(c)===c}i.isInteger=Number.isInteger||o,i.MAX_SAFE_INTEGER=9007199254740991,i.isSafeInteger=function(c){return i.isInteger(c)&&c>=-i.MAX_SAFE_INTEGER&&c<=i.MAX_SAFE_INTEGER}})(cc);Object.defineProperty(oe,"__esModule",{value:!0});var hc=cc;function Tl(i,e){return e===void 0&&(e=0),(i[e+0]<<8|i[e+1])<<16>>16}oe.readInt16BE=Tl;function $l(i,e){return e===void 0&&(e=0),(i[e+0]<<8|i[e+1])>>>0}oe.readUint16BE=$l;function Fl(i,e){return e===void 0&&(e=0),(i[e+1]<<8|i[e])<<16>>16}oe.readInt16LE=Fl;function Ul(i,e){return e===void 0&&(e=0),(i[e+1]<<8|i[e])>>>0}oe.readUint16LE=Ul;function uc(i,e,t){return e===void 0&&(e=new Uint8Array(2)),t===void 0&&(t=0),e[t+0]=i>>>8,e[t+1]=i>>>0,e}oe.writeUint16BE=uc;oe.writeInt16BE=uc;function lc(i,e,t){return e===void 0&&(e=new Uint8Array(2)),t===void 0&&(t=0),e[t+0]=i>>>0,e[t+1]=i>>>8,e}oe.writeUint16LE=lc;oe.writeInt16LE=lc;function Mr(i,e){return e===void 0&&(e=0),i[e]<<24|i[e+1]<<16|i[e+2]<<8|i[e+3]}oe.readInt32BE=Mr;function qr(i,e){return e===void 0&&(e=0),(i[e]<<24|i[e+1]<<16|i[e+2]<<8|i[e+3])>>>0}oe.readUint32BE=qr;function jr(i,e){return e===void 0&&(e=0),i[e+3]<<24|i[e+2]<<16|i[e+1]<<8|i[e]}oe.readInt32LE=jr;function zr(i,e){return e===void 0&&(e=0),(i[e+3]<<24|i[e+2]<<16|i[e+1]<<8|i[e])>>>0}oe.readUint32LE=zr;function ks(i,e,t){return e===void 0&&(e=new Uint8Array(4)),t===void 0&&(t=0),e[t+0]=i>>>24,e[t+1]=i>>>16,e[t+2]=i>>>8,e[t+3]=i>>>0,e}oe.writeUint32BE=ks;oe.writeInt32BE=ks;function Hs(i,e,t){return e===void 0&&(e=new Uint8Array(4)),t===void 0&&(t=0),e[t+0]=i>>>0,e[t+1]=i>>>8,e[t+2]=i>>>16,e[t+3]=i>>>24,e}oe.writeUint32LE=Hs;oe.writeInt32LE=Hs;function Ll(i,e){e===void 0&&(e=0);var t=Mr(i,e),s=Mr(i,e+4);return t*4294967296+s-(s>>31)*4294967296}oe.readInt64BE=Ll;function Ml(i,e){e===void 0&&(e=0);var t=qr(i,e),s=qr(i,e+4);return t*4294967296+s}oe.readUint64BE=Ml;function ql(i,e){e===void 0&&(e=0);var t=jr(i,e),s=jr(i,e+4);return s*4294967296+t-(t>>31)*4294967296}oe.readInt64LE=ql;function jl(i,e){e===void 0&&(e=0);var t=zr(i,e),s=zr(i,e+4);return s*4294967296+t}oe.readUint64LE=jl;function dc(i,e,t){return e===void 0&&(e=new Uint8Array(8)),t===void 0&&(t=0),ks(i/4294967296>>>0,e,t),ks(i>>>0,e,t+4),e}oe.writeUint64BE=dc;oe.writeInt64BE=dc;function fc(i,e,t){return e===void 0&&(e=new Uint8Array(8)),t===void 0&&(t=0),Hs(i>>>0,e,t),Hs(i/4294967296>>>0,e,t+4),e}oe.writeUint64LE=fc;oe.writeInt64LE=fc;function zl(i,e,t){if(t===void 0&&(t=0),i%8!==0)throw new Error("readUintBE supports only bitLengths divisible by 8");if(i/8>e.length-t)throw new Error("readUintBE: array is too short for the given bitLength");for(var s=0,r=1,n=i/8+t-1;n>=t;n--)s+=e[n]*r,r*=256;return s}oe.readUintBE=zl;function Kl(i,e,t){if(t===void 0&&(t=0),i%8!==0)throw new Error("readUintLE supports only bitLengths divisible by 8");if(i/8>e.length-t)throw new Error("readUintLE: array is too short for the given bitLength");for(var s=0,r=1,n=t;n<t+i/8;n++)s+=e[n]*r,r*=256;return s}oe.readUintLE=Kl;function Vl(i,e,t,s){if(t===void 0&&(t=new Uint8Array(i/8)),s===void 0&&(s=0),i%8!==0)throw new Error("writeUintBE supports only bitLengths divisible by 8");if(!hc.isSafeInteger(e))throw new Error("writeUintBE value must be an integer");for(var r=1,n=i/8+s-1;n>=s;n--)t[n]=e/r&255,r*=256;return t}oe.writeUintBE=Vl;function Bl(i,e,t,s){if(t===void 0&&(t=new Uint8Array(i/8)),s===void 0&&(s=0),i%8!==0)throw new Error("writeUintLE supports only bitLengths divisible by 8");if(!hc.isSafeInteger(e))throw new Error("writeUintLE value must be an integer");for(var r=1,n=s;n<s+i/8;n++)t[n]=e/r&255,r*=256;return t}oe.writeUintLE=Bl;function kl(i,e){e===void 0&&(e=0);var t=new DataView(i.buffer,i.byteOffset,i.byteLength);return t.getFloat32(e)}oe.readFloat32BE=kl;function Hl(i,e){e===void 0&&(e=0);var t=new DataView(i.buffer,i.byteOffset,i.byteLength);return t.getFloat32(e,!0)}oe.readFloat32LE=Hl;function Gl(i,e){e===void 0&&(e=0);var t=new DataView(i.buffer,i.byteOffset,i.byteLength);return t.getFloat64(e)}oe.readFloat64BE=Gl;function Wl(i,e){e===void 0&&(e=0);var t=new DataView(i.buffer,i.byteOffset,i.byteLength);return t.getFloat64(e,!0)}oe.readFloat64LE=Wl;function Yl(i,e,t){e===void 0&&(e=new Uint8Array(4)),t===void 0&&(t=0);var s=new DataView(e.buffer,e.byteOffset,e.byteLength);return s.setFloat32(t,i),e}oe.writeFloat32BE=Yl;function Jl(i,e,t){e===void 0&&(e=new Uint8Array(4)),t===void 0&&(t=0);var s=new DataView(e.buffer,e.byteOffset,e.byteLength);return s.setFloat32(t,i,!0),e}oe.writeFloat32LE=Jl;function Ql(i,e,t){e===void 0&&(e=new Uint8Array(8)),t===void 0&&(t=0);var s=new DataView(e.buffer,e.byteOffset,e.byteLength);return s.setFloat64(t,i),e}oe.writeFloat64BE=Ql;function Xl(i,e,t){e===void 0&&(e=new Uint8Array(8)),t===void 0&&(t=0);var s=new DataView(e.buffer,e.byteOffset,e.byteLength);return s.setFloat64(t,i,!0),e}oe.writeFloat64LE=Xl;(function(i){Object.defineProperty(i,"__esModule",{value:!0}),i.randomStringForEntropy=i.randomString=i.randomUint32=i.randomBytes=i.defaultRandomSource=void 0;const e=nr,t=oe,s=Pt;i.defaultRandomSource=new e.SystemRandomSource;function r(d,p=i.defaultRandomSource){return p.randomBytes(d)}i.randomBytes=r;function n(d=i.defaultRandomSource){const p=r(4,d),b=(0,t.readUint32LE)(p);return(0,s.wipe)(p),b}i.randomUint32=n;const o="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";function c(d,p=o,b=i.defaultRandomSource){if(p.length<2)throw new Error("randomString charset is too short");if(p.length>256)throw new Error("randomString charset is too long");let x="";const O=p.length,_=256-256%O;for(;d>0;){const C=r(Math.ceil(d*256/_),b);for(let F=0;F<C.length&&d>0;F++){const K=C[F];K<_&&(x+=p.charAt(K%O),d--)}(0,s.wipe)(C)}return x}i.randomString=c;function u(d,p=o,b=i.defaultRandomSource){const x=Math.ceil(d/(Math.log(p.length)/Math.LN2));return c(x,p,b)}i.randomStringForEntropy=u})(li);var pc={};(function(i){Object.defineProperty(i,"__esModule",{value:!0});var e=oe,t=Pt;i.DIGEST_LENGTH=64,i.BLOCK_SIZE=128;var s=function(){function c(){this.digestLength=i.DIGEST_LENGTH,this.blockSize=i.BLOCK_SIZE,this._stateHi=new Int32Array(8),this._stateLo=new Int32Array(8),this._tempHi=new Int32Array(16),this._tempLo=new Int32Array(16),this._buffer=new Uint8Array(256),this._bufferLength=0,this._bytesHashed=0,this._finished=!1,this.reset()}return c.prototype._initState=function(){this._stateHi[0]=1779033703,this._stateHi[1]=3144134277,this._stateHi[2]=1013904242,this._stateHi[3]=2773480762,this._stateHi[4]=1359893119,this._stateHi[5]=2600822924,this._stateHi[6]=528734635,this._stateHi[7]=1541459225,this._stateLo[0]=4089235720,this._stateLo[1]=2227873595,this._stateLo[2]=4271175723,this._stateLo[3]=1595750129,this._stateLo[4]=2917565137,this._stateLo[5]=725511199,this._stateLo[6]=4215389547,this._stateLo[7]=327033209},c.prototype.reset=function(){return this._initState(),this._bufferLength=0,this._bytesHashed=0,this._finished=!1,this},c.prototype.clean=function(){t.wipe(this._buffer),t.wipe(this._tempHi),t.wipe(this._tempLo),this.reset()},c.prototype.update=function(u,d){if(d===void 0&&(d=u.length),this._finished)throw new Error("SHA512: can't update because hash was finished.");var p=0;if(this._bytesHashed+=d,this._bufferLength>0){for(;this._bufferLength<i.BLOCK_SIZE&&d>0;)this._buffer[this._bufferLength++]=u[p++],d--;this._bufferLength===this.blockSize&&(n(this._tempHi,this._tempLo,this._stateHi,this._stateLo,this._buffer,0,this.blockSize),this._bufferLength=0)}for(d>=this.blockSize&&(p=n(this._tempHi,this._tempLo,this._stateHi,this._stateLo,u,p,d),d%=this.blockSize);d>0;)this._buffer[this._bufferLength++]=u[p++],d--;return this},c.prototype.finish=function(u){if(!this._finished){var d=this._bytesHashed,p=this._bufferLength,b=d/536870912|0,x=d<<3,O=d%128<112?128:256;this._buffer[p]=128;for(var _=p+1;_<O-8;_++)this._buffer[_]=0;e.writeUint32BE(b,this._buffer,O-8),e.writeUint32BE(x,this._buffer,O-4),n(this._tempHi,this._tempLo,this._stateHi,this._stateLo,this._buffer,0,O),this._finished=!0}for(var _=0;_<this.digestLength/8;_++)e.writeUint32BE(this._stateHi[_],u,_*8),e.writeUint32BE(this._stateLo[_],u,_*8+4);return this},c.prototype.digest=function(){var u=new Uint8Array(this.digestLength);return this.finish(u),u},c.prototype.saveState=function(){if(this._finished)throw new Error("SHA256: cannot save finished state");return{stateHi:new Int32Array(this._stateHi),stateLo:new Int32Array(this._stateLo),buffer:this._bufferLength>0?new Uint8Array(this._buffer):void 0,bufferLength:this._bufferLength,bytesHashed:this._bytesHashed}},c.prototype.restoreState=function(u){return this._stateHi.set(u.stateHi),this._stateLo.set(u.stateLo),this._bufferLength=u.bufferLength,u.buffer&&this._buffer.set(u.buffer),this._bytesHashed=u.bytesHashed,this._finished=!1,this},c.prototype.cleanSavedState=function(u){t.wipe(u.stateHi),t.wipe(u.stateLo),u.buffer&&t.wipe(u.buffer),u.bufferLength=0,u.bytesHashed=0},c}();i.SHA512=s;var r=new Int32Array([1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591]);function n(c,u,d,p,b,x,O){for(var _=d[0],C=d[1],F=d[2],K=d[3],I=d[4],D=d[5],y=d[6],w=d[7],f=p[0],a=p[1],l=p[2],L=p[3],v=p[4],R=p[5],$=p[6],q=p[7],m,E,B,z,j,U,M,H;O>=128;){for(var te=0;te<16;te++){var G=8*te+x;c[te]=e.readUint32BE(b,G),u[te]=e.readUint32BE(b,G+4)}for(var te=0;te<80;te++){var ie=_,Q=C,se=F,T=K,A=I,N=D,h=y,S=w,W=f,X=a,fe=l,ve=L,ge=v,Se=R,Me=$,$e=q;if(m=w,E=q,j=E&65535,U=E>>>16,M=m&65535,H=m>>>16,m=(I>>>14|v<<32-14)^(I>>>18|v<<32-18)^(v>>>41-32|I<<32-(41-32)),E=(v>>>14|I<<32-14)^(v>>>18|I<<32-18)^(I>>>41-32|v<<32-(41-32)),j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,m=I&D^~I&y,E=v&R^~v&$,j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,m=r[te*2],E=r[te*2+1],j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,m=c[te%16],E=u[te%16],j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,U+=j>>>16,M+=U>>>16,H+=M>>>16,B=M&65535|H<<16,z=j&65535|U<<16,m=B,E=z,j=E&65535,U=E>>>16,M=m&65535,H=m>>>16,m=(_>>>28|f<<32-28)^(f>>>34-32|_<<32-(34-32))^(f>>>39-32|_<<32-(39-32)),E=(f>>>28|_<<32-28)^(_>>>34-32|f<<32-(34-32))^(_>>>39-32|f<<32-(39-32)),j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,m=_&C^_&F^C&F,E=f&a^f&l^a&l,j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,U+=j>>>16,M+=U>>>16,H+=M>>>16,S=M&65535|H<<16,$e=j&65535|U<<16,m=T,E=ve,j=E&65535,U=E>>>16,M=m&65535,H=m>>>16,m=B,E=z,j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,U+=j>>>16,M+=U>>>16,H+=M>>>16,T=M&65535|H<<16,ve=j&65535|U<<16,C=ie,F=Q,K=se,I=T,D=A,y=N,w=h,_=S,a=W,l=X,L=fe,v=ve,R=ge,$=Se,q=Me,f=$e,te%16===15)for(var G=0;G<16;G++)m=c[G],E=u[G],j=E&65535,U=E>>>16,M=m&65535,H=m>>>16,m=c[(G+9)%16],E=u[(G+9)%16],j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,B=c[(G+1)%16],z=u[(G+1)%16],m=(B>>>1|z<<32-1)^(B>>>8|z<<32-8)^B>>>7,E=(z>>>1|B<<32-1)^(z>>>8|B<<32-8)^(z>>>7|B<<32-7),j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,B=c[(G+14)%16],z=u[(G+14)%16],m=(B>>>19|z<<32-19)^(z>>>61-32|B<<32-(61-32))^B>>>6,E=(z>>>19|B<<32-19)^(B>>>61-32|z<<32-(61-32))^(z>>>6|B<<32-6),j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,U+=j>>>16,M+=U>>>16,H+=M>>>16,c[G]=M&65535|H<<16,u[G]=j&65535|U<<16}m=_,E=f,j=E&65535,U=E>>>16,M=m&65535,H=m>>>16,m=d[0],E=p[0],j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,U+=j>>>16,M+=U>>>16,H+=M>>>16,d[0]=_=M&65535|H<<16,p[0]=f=j&65535|U<<16,m=C,E=a,j=E&65535,U=E>>>16,M=m&65535,H=m>>>16,m=d[1],E=p[1],j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,U+=j>>>16,M+=U>>>16,H+=M>>>16,d[1]=C=M&65535|H<<16,p[1]=a=j&65535|U<<16,m=F,E=l,j=E&65535,U=E>>>16,M=m&65535,H=m>>>16,m=d[2],E=p[2],j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,U+=j>>>16,M+=U>>>16,H+=M>>>16,d[2]=F=M&65535|H<<16,p[2]=l=j&65535|U<<16,m=K,E=L,j=E&65535,U=E>>>16,M=m&65535,H=m>>>16,m=d[3],E=p[3],j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,U+=j>>>16,M+=U>>>16,H+=M>>>16,d[3]=K=M&65535|H<<16,p[3]=L=j&65535|U<<16,m=I,E=v,j=E&65535,U=E>>>16,M=m&65535,H=m>>>16,m=d[4],E=p[4],j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,U+=j>>>16,M+=U>>>16,H+=M>>>16,d[4]=I=M&65535|H<<16,p[4]=v=j&65535|U<<16,m=D,E=R,j=E&65535,U=E>>>16,M=m&65535,H=m>>>16,m=d[5],E=p[5],j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,U+=j>>>16,M+=U>>>16,H+=M>>>16,d[5]=D=M&65535|H<<16,p[5]=R=j&65535|U<<16,m=y,E=$,j=E&65535,U=E>>>16,M=m&65535,H=m>>>16,m=d[6],E=p[6],j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,U+=j>>>16,M+=U>>>16,H+=M>>>16,d[6]=y=M&65535|H<<16,p[6]=$=j&65535|U<<16,m=w,E=q,j=E&65535,U=E>>>16,M=m&65535,H=m>>>16,m=d[7],E=p[7],j+=E&65535,U+=E>>>16,M+=m&65535,H+=m>>>16,U+=j>>>16,M+=U>>>16,H+=M>>>16,d[7]=w=M&65535|H<<16,p[7]=q=j&65535|U<<16,x+=128,O-=128}return x}function o(c){var u=new s;u.update(c);var d=u.digest();return u.clean(),d}i.hash=o})(pc);(function(i){Object.defineProperty(i,"__esModule",{value:!0}),i.convertSecretKeyToX25519=i.convertPublicKeyToX25519=i.verify=i.sign=i.extractPublicKeyFromSecretKey=i.generateKeyPair=i.generateKeyPairFromSeed=i.SEED_LENGTH=i.SECRET_KEY_LENGTH=i.PUBLIC_KEY_LENGTH=i.SIGNATURE_LENGTH=void 0;const e=li,t=pc,s=Pt;i.SIGNATURE_LENGTH=64,i.PUBLIC_KEY_LENGTH=32,i.SECRET_KEY_LENGTH=64,i.SEED_LENGTH=32;function r(T){const A=new Float64Array(16);if(T)for(let N=0;N<T.length;N++)A[N]=T[N];return A}const n=new Uint8Array(32);n[0]=9;const o=r(),c=r([1]),u=r([30883,4953,19914,30187,55467,16705,2637,112,59544,30585,16505,36039,65139,11119,27886,20995]),d=r([61785,9906,39828,60374,45398,33411,5274,224,53552,61171,33010,6542,64743,22239,55772,9222]),p=r([54554,36645,11616,51542,42930,38181,51040,26924,56412,64982,57905,49316,21502,52590,14035,8553]),b=r([26200,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214]),x=r([41136,18958,6951,50414,58488,44335,6150,12099,55207,15867,153,11085,57099,20417,9344,11139]);function O(T,A){for(let N=0;N<16;N++)T[N]=A[N]|0}function _(T){let A=1;for(let N=0;N<16;N++){let h=T[N]+A+65535;A=Math.floor(h/65536),T[N]=h-A*65536}T[0]+=A-1+37*(A-1)}function C(T,A,N){const h=~(N-1);for(let S=0;S<16;S++){const W=h&(T[S]^A[S]);T[S]^=W,A[S]^=W}}function F(T,A){const N=r(),h=r();for(let S=0;S<16;S++)h[S]=A[S];_(h),_(h),_(h);for(let S=0;S<2;S++){N[0]=h[0]-65517;for(let X=1;X<15;X++)N[X]=h[X]-65535-(N[X-1]>>16&1),N[X-1]&=65535;N[15]=h[15]-32767-(N[14]>>16&1);const W=N[15]>>16&1;N[14]&=65535,C(h,N,1-W)}for(let S=0;S<16;S++)T[2*S]=h[S]&255,T[2*S+1]=h[S]>>8}function K(T,A){let N=0;for(let h=0;h<32;h++)N|=T[h]^A[h];return(1&N-1>>>8)-1}function I(T,A){const N=new Uint8Array(32),h=new Uint8Array(32);return F(N,T),F(h,A),K(N,h)}function D(T){const A=new Uint8Array(32);return F(A,T),A[0]&1}function y(T,A){for(let N=0;N<16;N++)T[N]=A[2*N]+(A[2*N+1]<<8);T[15]&=32767}function w(T,A,N){for(let h=0;h<16;h++)T[h]=A[h]+N[h]}function f(T,A,N){for(let h=0;h<16;h++)T[h]=A[h]-N[h]}function a(T,A,N){let h,S,W=0,X=0,fe=0,ve=0,ge=0,Se=0,Me=0,$e=0,be=0,ye=0,pe=0,le=0,ue=0,he=0,ce=0,re=0,de=0,me=0,ne=0,_e=0,Ee=0,De=0,xe=0,Ie=0,Ut=0,qt=0,si=0,Dt=0,fi=0,Vi=0,Ns=0,qe=N[0],Fe=N[1],je=N[2],ze=N[3],Ke=N[4],Ue=N[5],Xe=N[6],Ze=N[7],et=N[8],tt=N[9],it=N[10],Ye=N[11],Ve=N[12],Ae=N[13],st=N[14],rt=N[15];h=A[0],W+=h*qe,X+=h*Fe,fe+=h*je,ve+=h*ze,ge+=h*Ke,Se+=h*Ue,Me+=h*Xe,$e+=h*Ze,be+=h*et,ye+=h*tt,pe+=h*it,le+=h*Ye,ue+=h*Ve,he+=h*Ae,ce+=h*st,re+=h*rt,h=A[1],X+=h*qe,fe+=h*Fe,ve+=h*je,ge+=h*ze,Se+=h*Ke,Me+=h*Ue,$e+=h*Xe,be+=h*Ze,ye+=h*et,pe+=h*tt,le+=h*it,ue+=h*Ye,he+=h*Ve,ce+=h*Ae,re+=h*st,de+=h*rt,h=A[2],fe+=h*qe,ve+=h*Fe,ge+=h*je,Se+=h*ze,Me+=h*Ke,$e+=h*Ue,be+=h*Xe,ye+=h*Ze,pe+=h*et,le+=h*tt,ue+=h*it,he+=h*Ye,ce+=h*Ve,re+=h*Ae,de+=h*st,me+=h*rt,h=A[3],ve+=h*qe,ge+=h*Fe,Se+=h*je,Me+=h*ze,$e+=h*Ke,be+=h*Ue,ye+=h*Xe,pe+=h*Ze,le+=h*et,ue+=h*tt,he+=h*it,ce+=h*Ye,re+=h*Ve,de+=h*Ae,me+=h*st,ne+=h*rt,h=A[4],ge+=h*qe,Se+=h*Fe,Me+=h*je,$e+=h*ze,be+=h*Ke,ye+=h*Ue,pe+=h*Xe,le+=h*Ze,ue+=h*et,he+=h*tt,ce+=h*it,re+=h*Ye,de+=h*Ve,me+=h*Ae,ne+=h*st,_e+=h*rt,h=A[5],Se+=h*qe,Me+=h*Fe,$e+=h*je,be+=h*ze,ye+=h*Ke,pe+=h*Ue,le+=h*Xe,ue+=h*Ze,he+=h*et,ce+=h*tt,re+=h*it,de+=h*Ye,me+=h*Ve,ne+=h*Ae,_e+=h*st,Ee+=h*rt,h=A[6],Me+=h*qe,$e+=h*Fe,be+=h*je,ye+=h*ze,pe+=h*Ke,le+=h*Ue,ue+=h*Xe,he+=h*Ze,ce+=h*et,re+=h*tt,de+=h*it,me+=h*Ye,ne+=h*Ve,_e+=h*Ae,Ee+=h*st,De+=h*rt,h=A[7],$e+=h*qe,be+=h*Fe,ye+=h*je,pe+=h*ze,le+=h*Ke,ue+=h*Ue,he+=h*Xe,ce+=h*Ze,re+=h*et,de+=h*tt,me+=h*it,ne+=h*Ye,_e+=h*Ve,Ee+=h*Ae,De+=h*st,xe+=h*rt,h=A[8],be+=h*qe,ye+=h*Fe,pe+=h*je,le+=h*ze,ue+=h*Ke,he+=h*Ue,ce+=h*Xe,re+=h*Ze,de+=h*et,me+=h*tt,ne+=h*it,_e+=h*Ye,Ee+=h*Ve,De+=h*Ae,xe+=h*st,Ie+=h*rt,h=A[9],ye+=h*qe,pe+=h*Fe,le+=h*je,ue+=h*ze,he+=h*Ke,ce+=h*Ue,re+=h*Xe,de+=h*Ze,me+=h*et,ne+=h*tt,_e+=h*it,Ee+=h*Ye,De+=h*Ve,xe+=h*Ae,Ie+=h*st,Ut+=h*rt,h=A[10],pe+=h*qe,le+=h*Fe,ue+=h*je,he+=h*ze,ce+=h*Ke,re+=h*Ue,de+=h*Xe,me+=h*Ze,ne+=h*et,_e+=h*tt,Ee+=h*it,De+=h*Ye,xe+=h*Ve,Ie+=h*Ae,Ut+=h*st,qt+=h*rt,h=A[11],le+=h*qe,ue+=h*Fe,he+=h*je,ce+=h*ze,re+=h*Ke,de+=h*Ue,me+=h*Xe,ne+=h*Ze,_e+=h*et,Ee+=h*tt,De+=h*it,xe+=h*Ye,Ie+=h*Ve,Ut+=h*Ae,qt+=h*st,si+=h*rt,h=A[12],ue+=h*qe,he+=h*Fe,ce+=h*je,re+=h*ze,de+=h*Ke,me+=h*Ue,ne+=h*Xe,_e+=h*Ze,Ee+=h*et,De+=h*tt,xe+=h*it,Ie+=h*Ye,Ut+=h*Ve,qt+=h*Ae,si+=h*st,Dt+=h*rt,h=A[13],he+=h*qe,ce+=h*Fe,re+=h*je,de+=h*ze,me+=h*Ke,ne+=h*Ue,_e+=h*Xe,Ee+=h*Ze,De+=h*et,xe+=h*tt,Ie+=h*it,Ut+=h*Ye,qt+=h*Ve,si+=h*Ae,Dt+=h*st,fi+=h*rt,h=A[14],ce+=h*qe,re+=h*Fe,de+=h*je,me+=h*ze,ne+=h*Ke,_e+=h*Ue,Ee+=h*Xe,De+=h*Ze,xe+=h*et,Ie+=h*tt,Ut+=h*it,qt+=h*Ye,si+=h*Ve,Dt+=h*Ae,fi+=h*st,Vi+=h*rt,h=A[15],re+=h*qe,de+=h*Fe,me+=h*je,ne+=h*ze,_e+=h*Ke,Ee+=h*Ue,De+=h*Xe,xe+=h*Ze,Ie+=h*et,Ut+=h*tt,qt+=h*it,si+=h*Ye,Dt+=h*Ve,fi+=h*Ae,Vi+=h*st,Ns+=h*rt,W+=38*de,X+=38*me,fe+=38*ne,ve+=38*_e,ge+=38*Ee,Se+=38*De,Me+=38*xe,$e+=38*Ie,be+=38*Ut,ye+=38*qt,pe+=38*si,le+=38*Dt,ue+=38*fi,he+=38*Vi,ce+=38*Ns,S=1,h=W+S+65535,S=Math.floor(h/65536),W=h-S*65536,h=X+S+65535,S=Math.floor(h/65536),X=h-S*65536,h=fe+S+65535,S=Math.floor(h/65536),fe=h-S*65536,h=ve+S+65535,S=Math.floor(h/65536),ve=h-S*65536,h=ge+S+65535,S=Math.floor(h/65536),ge=h-S*65536,h=Se+S+65535,S=Math.floor(h/65536),Se=h-S*65536,h=Me+S+65535,S=Math.floor(h/65536),Me=h-S*65536,h=$e+S+65535,S=Math.floor(h/65536),$e=h-S*65536,h=be+S+65535,S=Math.floor(h/65536),be=h-S*65536,h=ye+S+65535,S=Math.floor(h/65536),ye=h-S*65536,h=pe+S+65535,S=Math.floor(h/65536),pe=h-S*65536,h=le+S+65535,S=Math.floor(h/65536),le=h-S*65536,h=ue+S+65535,S=Math.floor(h/65536),ue=h-S*65536,h=he+S+65535,S=Math.floor(h/65536),he=h-S*65536,h=ce+S+65535,S=Math.floor(h/65536),ce=h-S*65536,h=re+S+65535,S=Math.floor(h/65536),re=h-S*65536,W+=S-1+37*(S-1),S=1,h=W+S+65535,S=Math.floor(h/65536),W=h-S*65536,h=X+S+65535,S=Math.floor(h/65536),X=h-S*65536,h=fe+S+65535,S=Math.floor(h/65536),fe=h-S*65536,h=ve+S+65535,S=Math.floor(h/65536),ve=h-S*65536,h=ge+S+65535,S=Math.floor(h/65536),ge=h-S*65536,h=Se+S+65535,S=Math.floor(h/65536),Se=h-S*65536,h=Me+S+65535,S=Math.floor(h/65536),Me=h-S*65536,h=$e+S+65535,S=Math.floor(h/65536),$e=h-S*65536,h=be+S+65535,S=Math.floor(h/65536),be=h-S*65536,h=ye+S+65535,S=Math.floor(h/65536),ye=h-S*65536,h=pe+S+65535,S=Math.floor(h/65536),pe=h-S*65536,h=le+S+65535,S=Math.floor(h/65536),le=h-S*65536,h=ue+S+65535,S=Math.floor(h/65536),ue=h-S*65536,h=he+S+65535,S=Math.floor(h/65536),he=h-S*65536,h=ce+S+65535,S=Math.floor(h/65536),ce=h-S*65536,h=re+S+65535,S=Math.floor(h/65536),re=h-S*65536,W+=S-1+37*(S-1),T[0]=W,T[1]=X,T[2]=fe,T[3]=ve,T[4]=ge,T[5]=Se,T[6]=Me,T[7]=$e,T[8]=be,T[9]=ye,T[10]=pe,T[11]=le,T[12]=ue,T[13]=he,T[14]=ce,T[15]=re}function l(T,A){a(T,A,A)}function L(T,A){const N=r();let h;for(h=0;h<16;h++)N[h]=A[h];for(h=253;h>=0;h--)l(N,N),h!==2&&h!==4&&a(N,N,A);for(h=0;h<16;h++)T[h]=N[h]}function v(T,A){const N=r();let h;for(h=0;h<16;h++)N[h]=A[h];for(h=250;h>=0;h--)l(N,N),h!==1&&a(N,N,A);for(h=0;h<16;h++)T[h]=N[h]}function R(T,A){const N=r(),h=r(),S=r(),W=r(),X=r(),fe=r(),ve=r(),ge=r(),Se=r();f(N,T[1],T[0]),f(Se,A[1],A[0]),a(N,N,Se),w(h,T[0],T[1]),w(Se,A[0],A[1]),a(h,h,Se),a(S,T[3],A[3]),a(S,S,d),a(W,T[2],A[2]),w(W,W,W),f(X,h,N),f(fe,W,S),w(ve,W,S),w(ge,h,N),a(T[0],X,fe),a(T[1],ge,ve),a(T[2],ve,fe),a(T[3],X,ge)}function $(T,A,N){for(let h=0;h<4;h++)C(T[h],A[h],N)}function q(T,A){const N=r(),h=r(),S=r();L(S,A[2]),a(N,A[0],S),a(h,A[1],S),F(T,h),T[31]^=D(N)<<7}function m(T,A,N){O(T[0],o),O(T[1],c),O(T[2],c),O(T[3],o);for(let h=255;h>=0;--h){const S=N[h/8|0]>>(h&7)&1;$(T,A,S),R(A,T),R(T,T),$(T,A,S)}}function E(T,A){const N=[r(),r(),r(),r()];O(N[0],p),O(N[1],b),O(N[2],c),a(N[3],p,b),m(T,N,A)}function B(T){if(T.length!==i.SEED_LENGTH)throw new Error(`ed25519: seed must be ${i.SEED_LENGTH} bytes`);const A=(0,t.hash)(T);A[0]&=248,A[31]&=127,A[31]|=64;const N=new Uint8Array(32),h=[r(),r(),r(),r()];E(h,A),q(N,h);const S=new Uint8Array(64);return S.set(T),S.set(N,32),{publicKey:N,secretKey:S}}i.generateKeyPairFromSeed=B;function z(T){const A=(0,e.randomBytes)(32,T),N=B(A);return(0,s.wipe)(A),N}i.generateKeyPair=z;function j(T){if(T.length!==i.SECRET_KEY_LENGTH)throw new Error(`ed25519: secret key must be ${i.SECRET_KEY_LENGTH} bytes`);return new Uint8Array(T.subarray(32))}i.extractPublicKeyFromSecretKey=j;const U=new Float64Array([237,211,245,92,26,99,18,88,214,156,247,162,222,249,222,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16]);function M(T,A){let N,h,S,W;for(h=63;h>=32;--h){for(N=0,S=h-32,W=h-12;S<W;++S)A[S]+=N-16*A[h]*U[S-(h-32)],N=Math.floor((A[S]+128)/256),A[S]-=N*256;A[S]+=N,A[h]=0}for(N=0,S=0;S<32;S++)A[S]+=N-(A[31]>>4)*U[S],N=A[S]>>8,A[S]&=255;for(S=0;S<32;S++)A[S]-=N*U[S];for(h=0;h<32;h++)A[h+1]+=A[h]>>8,T[h]=A[h]&255}function H(T){const A=new Float64Array(64);for(let N=0;N<64;N++)A[N]=T[N];for(let N=0;N<64;N++)T[N]=0;M(T,A)}function te(T,A){const N=new Float64Array(64),h=[r(),r(),r(),r()],S=(0,t.hash)(T.subarray(0,32));S[0]&=248,S[31]&=127,S[31]|=64;const W=new Uint8Array(64);W.set(S.subarray(32),32);const X=new t.SHA512;X.update(W.subarray(32)),X.update(A);const fe=X.digest();X.clean(),H(fe),E(h,fe),q(W,h),X.reset(),X.update(W.subarray(0,32)),X.update(T.subarray(32)),X.update(A);const ve=X.digest();H(ve);for(let ge=0;ge<32;ge++)N[ge]=fe[ge];for(let ge=0;ge<32;ge++)for(let Se=0;Se<32;Se++)N[ge+Se]+=ve[ge]*S[Se];return M(W.subarray(32),N),W}i.sign=te;function G(T,A){const N=r(),h=r(),S=r(),W=r(),X=r(),fe=r(),ve=r();return O(T[2],c),y(T[1],A),l(S,T[1]),a(W,S,u),f(S,S,T[2]),w(W,T[2],W),l(X,W),l(fe,X),a(ve,fe,X),a(N,ve,S),a(N,N,W),v(N,N),a(N,N,S),a(N,N,W),a(N,N,W),a(T[0],N,W),l(h,T[0]),a(h,h,W),I(h,S)&&a(T[0],T[0],x),l(h,T[0]),a(h,h,W),I(h,S)?-1:(D(T[0])===A[31]>>7&&f(T[0],o,T[0]),a(T[3],T[0],T[1]),0)}function ie(T,A,N){const h=new Uint8Array(32),S=[r(),r(),r(),r()],W=[r(),r(),r(),r()];if(N.length!==i.SIGNATURE_LENGTH)throw new Error(`ed25519: signature must be ${i.SIGNATURE_LENGTH} bytes`);if(G(W,T))return!1;const X=new t.SHA512;X.update(N.subarray(0,32)),X.update(T),X.update(A);const fe=X.digest();return H(fe),m(S,W,fe),E(W,N.subarray(32)),R(S,W),q(h,S),!K(N,h)}i.verify=ie;function Q(T){let A=[r(),r(),r(),r()];if(G(A,T))throw new Error("Ed25519: invalid public key");let N=r(),h=r(),S=A[1];w(N,c,S),f(h,c,S),L(h,h),a(N,N,h);let W=new Uint8Array(32);return F(W,N),W}i.convertPublicKeyToX25519=Q;function se(T){const A=(0,t.hash)(T.subarray(0,32));A[0]&=248,A[31]&=127,A[31]|=64;const N=new Uint8Array(A.subarray(0,32));return(0,s.wipe)(A),N}i.convertSecretKeyToX25519=se})(nn);const Zl="EdDSA",ed="JWT",gc=".",yc="base64url",td="utf8",id="utf8",sd=":",rd="did",nd="key",mo="base58btc",od="z",ad="K36",cd=32;function on(i){return globalThis.Buffer!=null?new Uint8Array(i.buffer,i.byteOffset,i.byteLength):i}function mc(i=0){return globalThis.Buffer!=null&&globalThis.Buffer.allocUnsafe!=null?on(globalThis.Buffer.allocUnsafe(i)):new Uint8Array(i)}function ds(i,e){e||(e=i.reduce((r,n)=>r+n.length,0));const t=mc(e);let s=0;for(const r of i)t.set(r,s),s+=r.length;return on(t)}function hd(i,e){if(i.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),s=0;s<t.length;s++)t[s]=255;for(var r=0;r<i.length;r++){var n=i.charAt(r),o=n.charCodeAt(0);if(t[o]!==255)throw new TypeError(n+" is ambiguous");t[o]=r}var c=i.length,u=i.charAt(0),d=Math.log(c)/Math.log(256),p=Math.log(256)/Math.log(c);function b(_){if(_ instanceof Uint8Array||(ArrayBuffer.isView(_)?_=new Uint8Array(_.buffer,_.byteOffset,_.byteLength):Array.isArray(_)&&(_=Uint8Array.from(_))),!(_ instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(_.length===0)return"";for(var C=0,F=0,K=0,I=_.length;K!==I&&_[K]===0;)K++,C++;for(var D=(I-K)*p+1>>>0,y=new Uint8Array(D);K!==I;){for(var w=_[K],f=0,a=D-1;(w!==0||f<F)&&a!==-1;a--,f++)w+=256*y[a]>>>0,y[a]=w%c>>>0,w=w/c>>>0;if(w!==0)throw new Error("Non-zero carry");F=f,K++}for(var l=D-F;l!==D&&y[l]===0;)l++;for(var L=u.repeat(C);l<D;++l)L+=i.charAt(y[l]);return L}function x(_){if(typeof _!="string")throw new TypeError("Expected String");if(_.length===0)return new Uint8Array;var C=0;if(_[C]!==" "){for(var F=0,K=0;_[C]===u;)F++,C++;for(var I=(_.length-C)*d+1>>>0,D=new Uint8Array(I);_[C];){var y=t[_.charCodeAt(C)];if(y===255)return;for(var w=0,f=I-1;(y!==0||w<K)&&f!==-1;f--,w++)y+=c*D[f]>>>0,D[f]=y%256>>>0,y=y/256>>>0;if(y!==0)throw new Error("Non-zero carry");K=w,C++}if(_[C]!==" "){for(var a=I-K;a!==I&&D[a]===0;)a++;for(var l=new Uint8Array(F+(I-a)),L=F;a!==I;)l[L++]=D[a++];return l}}}function O(_){var C=x(_);if(C)return C;throw new Error(`Non-${e} character`)}return{encode:b,decodeUnsafe:x,decode:O}}var ud=hd,ld=ud;const dd=i=>{if(i instanceof Uint8Array&&i.constructor.name==="Uint8Array")return i;if(i instanceof ArrayBuffer)return new Uint8Array(i);if(ArrayBuffer.isView(i))return new Uint8Array(i.buffer,i.byteOffset,i.byteLength);throw new Error("Unknown type, must be binary type")},fd=i=>new TextEncoder().encode(i),pd=i=>new TextDecoder().decode(i);class gd{constructor(e,t,s){this.name=e,this.prefix=t,this.baseEncode=s}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class yd{constructor(e,t,s){if(this.name=e,this.prefix=t,t.codePointAt(0)===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=t.codePointAt(0),this.baseDecode=s}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return bc(this,e)}}class md{constructor(e){this.decoders=e}or(e){return bc(this,e)}decode(e){const t=e[0],s=this.decoders[t];if(s)return s.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}const bc=(i,e)=>new md({...i.decoders||{[i.prefix]:i},...e.decoders||{[e.prefix]:e}});class bd{constructor(e,t,s,r){this.name=e,this.prefix=t,this.baseEncode=s,this.baseDecode=r,this.encoder=new gd(e,t,s),this.decoder=new yd(e,t,r)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}const cr=({name:i,prefix:e,encode:t,decode:s})=>new bd(i,e,t,s),gs=({prefix:i,name:e,alphabet:t})=>{const{encode:s,decode:r}=ld(t,e);return cr({prefix:i,name:e,encode:s,decode:n=>dd(r(n))})},wd=(i,e,t,s)=>{const r={};for(let p=0;p<e.length;++p)r[e[p]]=p;let n=i.length;for(;i[n-1]==="=";)--n;const o=new Uint8Array(n*t/8|0);let c=0,u=0,d=0;for(let p=0;p<n;++p){const b=r[i[p]];if(b===void 0)throw new SyntaxError(`Non-${s} character`);u=u<<t|b,c+=t,c>=8&&(c-=8,o[d++]=255&u>>c)}if(c>=t||255&u<<8-c)throw new SyntaxError("Unexpected end of data");return o},vd=(i,e,t)=>{const s=e[e.length-1]==="=",r=(1<<t)-1;let n="",o=0,c=0;for(let u=0;u<i.length;++u)for(c=c<<8|i[u],o+=8;o>t;)o-=t,n+=e[r&c>>o];if(o&&(n+=e[r&c<<t-o]),s)for(;n.length*t&7;)n+="=";return n},lt=({name:i,prefix:e,bitsPerChar:t,alphabet:s})=>cr({prefix:e,name:i,encode(r){return vd(r,s,t)},decode(r){return wd(r,s,t,i)}}),_d=cr({prefix:"\0",name:"identity",encode:i=>pd(i),decode:i=>fd(i)}),Ed=Object.freeze(Object.defineProperty({__proto__:null,identity:_d},Symbol.toStringTag,{value:"Module"})),Sd=lt({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),Id=Object.freeze(Object.defineProperty({__proto__:null,base2:Sd},Symbol.toStringTag,{value:"Module"})),Dd=lt({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),xd=Object.freeze(Object.defineProperty({__proto__:null,base8:Dd},Symbol.toStringTag,{value:"Module"})),Od=gs({prefix:"9",name:"base10",alphabet:"0123456789"}),Nd=Object.freeze(Object.defineProperty({__proto__:null,base10:Od},Symbol.toStringTag,{value:"Module"})),Pd=lt({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),Rd=lt({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),Cd=Object.freeze(Object.defineProperty({__proto__:null,base16:Pd,base16upper:Rd},Symbol.toStringTag,{value:"Module"})),Ad=lt({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),Td=lt({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),$d=lt({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),Fd=lt({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),Ud=lt({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),Ld=lt({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),Md=lt({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),qd=lt({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),jd=lt({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),zd=Object.freeze(Object.defineProperty({__proto__:null,base32:Ad,base32hex:Ud,base32hexpad:Md,base32hexpadupper:qd,base32hexupper:Ld,base32pad:$d,base32padupper:Fd,base32upper:Td,base32z:jd},Symbol.toStringTag,{value:"Module"})),Kd=gs({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),Vd=gs({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}),Bd=Object.freeze(Object.defineProperty({__proto__:null,base36:Kd,base36upper:Vd},Symbol.toStringTag,{value:"Module"})),kd=gs({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),Hd=gs({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),Gd=Object.freeze(Object.defineProperty({__proto__:null,base58btc:kd,base58flickr:Hd},Symbol.toStringTag,{value:"Module"})),Wd=lt({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),Yd=lt({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),Jd=lt({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),Qd=lt({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),Xd=Object.freeze(Object.defineProperty({__proto__:null,base64:Wd,base64pad:Yd,base64url:Jd,base64urlpad:Qd},Symbol.toStringTag,{value:"Module"})),wc=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),Zd=wc.reduce((i,e,t)=>(i[t]=e,i),[]),ef=wc.reduce((i,e,t)=>(i[e.codePointAt(0)]=t,i),[]);function tf(i){return i.reduce((e,t)=>(e+=Zd[t],e),"")}function sf(i){const e=[];for(const t of i){const s=ef[t.codePointAt(0)];if(s===void 0)throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const rf=cr({prefix:"🚀",name:"base256emoji",encode:tf,decode:sf}),nf=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:rf},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const bo={...Ed,...Id,...xd,...Nd,...Cd,...zd,...Bd,...Gd,...Xd,...nf};function vc(i,e,t,s){return{name:i,prefix:e,encoder:{name:i,prefix:e,encode:t},decoder:{decode:s}}}const wo=vc("utf8","u",i=>"u"+new TextDecoder("utf8").decode(i),i=>new TextEncoder().encode(i.substring(1))),Dr=vc("ascii","a",i=>{let e="a";for(let t=0;t<i.length;t++)e+=String.fromCharCode(i[t]);return e},i=>{i=i.substring(1);const e=mc(i.length);for(let t=0;t<i.length;t++)e[t]=i.charCodeAt(t);return e}),_c={utf8:wo,"utf-8":wo,hex:bo.base16,latin1:Dr,ascii:Dr,binary:Dr,...bo};function Ne(i,e="utf8"){const t=_c[e];if(!t)throw new Error(`Unsupported encoding "${e}"`);return(e==="utf8"||e==="utf-8")&&globalThis.Buffer!=null&&globalThis.Buffer.from!=null?globalThis.Buffer.from(i.buffer,i.byteOffset,i.byteLength).toString("utf8"):t.encoder.encode(i).substring(1)}function Ce(i,e="utf8"){const t=_c[e];if(!t)throw new Error(`Unsupported encoding "${e}"`);return(e==="utf8"||e==="utf-8")&&globalThis.Buffer!=null&&globalThis.Buffer.from!=null?on(globalThis.Buffer.from(i,"utf-8")):t.decoder.decode(`${t.prefix}${i}`)}function Gs(i){return Ne(Ce(rr(i),td),yc)}function an(i){const e=Ce(ad,mo),t=od+Ne(ds([e,i]),mo);return[rd,nd,t].join(sd)}function of(i){return Ne(i,yc)}function af(i){return Ce([Gs(i.header),Gs(i.payload)].join(gc),id)}function cf(i){return[Gs(i.header),Gs(i.payload),of(i.signature)].join(gc)}function Ws(i=li.randomBytes(cd)){return nn.generateKeyPairFromSeed(i)}async function Ec(i,e,t,s,r=V.fromMiliseconds(Date.now())){const n={alg:Zl,typ:ed},o=an(s.publicKey),c=r+t,u={iss:o,sub:i,aud:e,iat:r,exp:c},d=af({header:n,payload:u}),p=nn.sign(s.secretKey,d);return cf({header:n,payload:u,signature:p})}var ys={},hr={};Object.defineProperty(hr,"__esModule",{value:!0});var gt=oe,Kr=Pt,hf=20;function uf(i,e,t){for(var s=1634760805,r=857760878,n=2036477234,o=1797285236,c=t[3]<<24|t[2]<<16|t[1]<<8|t[0],u=t[7]<<24|t[6]<<16|t[5]<<8|t[4],d=t[11]<<24|t[10]<<16|t[9]<<8|t[8],p=t[15]<<24|t[14]<<16|t[13]<<8|t[12],b=t[19]<<24|t[18]<<16|t[17]<<8|t[16],x=t[23]<<24|t[22]<<16|t[21]<<8|t[20],O=t[27]<<24|t[26]<<16|t[25]<<8|t[24],_=t[31]<<24|t[30]<<16|t[29]<<8|t[28],C=e[3]<<24|e[2]<<16|e[1]<<8|e[0],F=e[7]<<24|e[6]<<16|e[5]<<8|e[4],K=e[11]<<24|e[10]<<16|e[9]<<8|e[8],I=e[15]<<24|e[14]<<16|e[13]<<8|e[12],D=s,y=r,w=n,f=o,a=c,l=u,L=d,v=p,R=b,$=x,q=O,m=_,E=C,B=F,z=K,j=I,U=0;U<hf;U+=2)D=D+a|0,E^=D,E=E>>>32-16|E<<16,R=R+E|0,a^=R,a=a>>>32-12|a<<12,y=y+l|0,B^=y,B=B>>>32-16|B<<16,$=$+B|0,l^=$,l=l>>>32-12|l<<12,w=w+L|0,z^=w,z=z>>>32-16|z<<16,q=q+z|0,L^=q,L=L>>>32-12|L<<12,f=f+v|0,j^=f,j=j>>>32-16|j<<16,m=m+j|0,v^=m,v=v>>>32-12|v<<12,w=w+L|0,z^=w,z=z>>>32-8|z<<8,q=q+z|0,L^=q,L=L>>>32-7|L<<7,f=f+v|0,j^=f,j=j>>>32-8|j<<8,m=m+j|0,v^=m,v=v>>>32-7|v<<7,y=y+l|0,B^=y,B=B>>>32-8|B<<8,$=$+B|0,l^=$,l=l>>>32-7|l<<7,D=D+a|0,E^=D,E=E>>>32-8|E<<8,R=R+E|0,a^=R,a=a>>>32-7|a<<7,D=D+l|0,j^=D,j=j>>>32-16|j<<16,q=q+j|0,l^=q,l=l>>>32-12|l<<12,y=y+L|0,E^=y,E=E>>>32-16|E<<16,m=m+E|0,L^=m,L=L>>>32-12|L<<12,w=w+v|0,B^=w,B=B>>>32-16|B<<16,R=R+B|0,v^=R,v=v>>>32-12|v<<12,f=f+a|0,z^=f,z=z>>>32-16|z<<16,$=$+z|0,a^=$,a=a>>>32-12|a<<12,w=w+v|0,B^=w,B=B>>>32-8|B<<8,R=R+B|0,v^=R,v=v>>>32-7|v<<7,f=f+a|0,z^=f,z=z>>>32-8|z<<8,$=$+z|0,a^=$,a=a>>>32-7|a<<7,y=y+L|0,E^=y,E=E>>>32-8|E<<8,m=m+E|0,L^=m,L=L>>>32-7|L<<7,D=D+l|0,j^=D,j=j>>>32-8|j<<8,q=q+j|0,l^=q,l=l>>>32-7|l<<7;gt.writeUint32LE(D+s|0,i,0),gt.writeUint32LE(y+r|0,i,4),gt.writeUint32LE(w+n|0,i,8),gt.writeUint32LE(f+o|0,i,12),gt.writeUint32LE(a+c|0,i,16),gt.writeUint32LE(l+u|0,i,20),gt.writeUint32LE(L+d|0,i,24),gt.writeUint32LE(v+p|0,i,28),gt.writeUint32LE(R+b|0,i,32),gt.writeUint32LE($+x|0,i,36),gt.writeUint32LE(q+O|0,i,40),gt.writeUint32LE(m+_|0,i,44),gt.writeUint32LE(E+C|0,i,48),gt.writeUint32LE(B+F|0,i,52),gt.writeUint32LE(z+K|0,i,56),gt.writeUint32LE(j+I|0,i,60)}function Sc(i,e,t,s,r){if(r===void 0&&(r=0),i.length!==32)throw new Error("ChaCha: key size must be 32 bytes");if(s.length<t.length)throw new Error("ChaCha: destination is shorter than source");var n,o;if(r===0){if(e.length!==8&&e.length!==12)throw new Error("ChaCha nonce must be 8 or 12 bytes");n=new Uint8Array(16),o=n.length-e.length,n.set(e,o)}else{if(e.length!==16)throw new Error("ChaCha nonce with counter must be 16 bytes");n=e,o=r}for(var c=new Uint8Array(64),u=0;u<t.length;u+=64){uf(c,n,i);for(var d=u;d<u+64&&d<t.length;d++)s[d]=t[d]^c[d-u];df(n,0,o)}return Kr.wipe(c),r===0&&Kr.wipe(n),s}hr.streamXOR=Sc;function lf(i,e,t,s){return s===void 0&&(s=0),Kr.wipe(t),Sc(i,e,t,t,s)}hr.stream=lf;function df(i,e,t){for(var s=1;t--;)s=s+(i[e]&255)|0,i[e]=s&255,s>>>=8,e++;if(s>0)throw new Error("ChaCha: counter overflow")}var Ic={},di={};Object.defineProperty(di,"__esModule",{value:!0});function ff(i,e,t){return~(i-1)&e|i-1&t}di.select=ff;function pf(i,e){return(i|0)-(e|0)-1>>>31&1}di.lessOrEqual=pf;function Dc(i,e){if(i.length!==e.length)return 0;for(var t=0,s=0;s<i.length;s++)t|=i[s]^e[s];return 1&t-1>>>8}di.compare=Dc;function gf(i,e){return i.length===0||e.length===0?!1:Dc(i,e)!==0}di.equal=gf;(function(i){Object.defineProperty(i,"__esModule",{value:!0});var e=di,t=Pt;i.DIGEST_LENGTH=16;var s=function(){function o(c){this.digestLength=i.DIGEST_LENGTH,this._buffer=new Uint8Array(16),this._r=new Uint16Array(10),this._h=new Uint16Array(10),this._pad=new Uint16Array(8),this._leftover=0,this._fin=0,this._finished=!1;var u=c[0]|c[1]<<8;this._r[0]=u&8191;var d=c[2]|c[3]<<8;this._r[1]=(u>>>13|d<<3)&8191;var p=c[4]|c[5]<<8;this._r[2]=(d>>>10|p<<6)&7939;var b=c[6]|c[7]<<8;this._r[3]=(p>>>7|b<<9)&8191;var x=c[8]|c[9]<<8;this._r[4]=(b>>>4|x<<12)&255,this._r[5]=x>>>1&8190;var O=c[10]|c[11]<<8;this._r[6]=(x>>>14|O<<2)&8191;var _=c[12]|c[13]<<8;this._r[7]=(O>>>11|_<<5)&8065;var C=c[14]|c[15]<<8;this._r[8]=(_>>>8|C<<8)&8191,this._r[9]=C>>>5&127,this._pad[0]=c[16]|c[17]<<8,this._pad[1]=c[18]|c[19]<<8,this._pad[2]=c[20]|c[21]<<8,this._pad[3]=c[22]|c[23]<<8,this._pad[4]=c[24]|c[25]<<8,this._pad[5]=c[26]|c[27]<<8,this._pad[6]=c[28]|c[29]<<8,this._pad[7]=c[30]|c[31]<<8}return o.prototype._blocks=function(c,u,d){for(var p=this._fin?0:2048,b=this._h[0],x=this._h[1],O=this._h[2],_=this._h[3],C=this._h[4],F=this._h[5],K=this._h[6],I=this._h[7],D=this._h[8],y=this._h[9],w=this._r[0],f=this._r[1],a=this._r[2],l=this._r[3],L=this._r[4],v=this._r[5],R=this._r[6],$=this._r[7],q=this._r[8],m=this._r[9];d>=16;){var E=c[u+0]|c[u+1]<<8;b+=E&8191;var B=c[u+2]|c[u+3]<<8;x+=(E>>>13|B<<3)&8191;var z=c[u+4]|c[u+5]<<8;O+=(B>>>10|z<<6)&8191;var j=c[u+6]|c[u+7]<<8;_+=(z>>>7|j<<9)&8191;var U=c[u+8]|c[u+9]<<8;C+=(j>>>4|U<<12)&8191,F+=U>>>1&8191;var M=c[u+10]|c[u+11]<<8;K+=(U>>>14|M<<2)&8191;var H=c[u+12]|c[u+13]<<8;I+=(M>>>11|H<<5)&8191;var te=c[u+14]|c[u+15]<<8;D+=(H>>>8|te<<8)&8191,y+=te>>>5|p;var G=0,ie=G;ie+=b*w,ie+=x*(5*m),ie+=O*(5*q),ie+=_*(5*$),ie+=C*(5*R),G=ie>>>13,ie&=8191,ie+=F*(5*v),ie+=K*(5*L),ie+=I*(5*l),ie+=D*(5*a),ie+=y*(5*f),G+=ie>>>13,ie&=8191;var Q=G;Q+=b*f,Q+=x*w,Q+=O*(5*m),Q+=_*(5*q),Q+=C*(5*$),G=Q>>>13,Q&=8191,Q+=F*(5*R),Q+=K*(5*v),Q+=I*(5*L),Q+=D*(5*l),Q+=y*(5*a),G+=Q>>>13,Q&=8191;var se=G;se+=b*a,se+=x*f,se+=O*w,se+=_*(5*m),se+=C*(5*q),G=se>>>13,se&=8191,se+=F*(5*$),se+=K*(5*R),se+=I*(5*v),se+=D*(5*L),se+=y*(5*l),G+=se>>>13,se&=8191;var T=G;T+=b*l,T+=x*a,T+=O*f,T+=_*w,T+=C*(5*m),G=T>>>13,T&=8191,T+=F*(5*q),T+=K*(5*$),T+=I*(5*R),T+=D*(5*v),T+=y*(5*L),G+=T>>>13,T&=8191;var A=G;A+=b*L,A+=x*l,A+=O*a,A+=_*f,A+=C*w,G=A>>>13,A&=8191,A+=F*(5*m),A+=K*(5*q),A+=I*(5*$),A+=D*(5*R),A+=y*(5*v),G+=A>>>13,A&=8191;var N=G;N+=b*v,N+=x*L,N+=O*l,N+=_*a,N+=C*f,G=N>>>13,N&=8191,N+=F*w,N+=K*(5*m),N+=I*(5*q),N+=D*(5*$),N+=y*(5*R),G+=N>>>13,N&=8191;var h=G;h+=b*R,h+=x*v,h+=O*L,h+=_*l,h+=C*a,G=h>>>13,h&=8191,h+=F*f,h+=K*w,h+=I*(5*m),h+=D*(5*q),h+=y*(5*$),G+=h>>>13,h&=8191;var S=G;S+=b*$,S+=x*R,S+=O*v,S+=_*L,S+=C*l,G=S>>>13,S&=8191,S+=F*a,S+=K*f,S+=I*w,S+=D*(5*m),S+=y*(5*q),G+=S>>>13,S&=8191;var W=G;W+=b*q,W+=x*$,W+=O*R,W+=_*v,W+=C*L,G=W>>>13,W&=8191,W+=F*l,W+=K*a,W+=I*f,W+=D*w,W+=y*(5*m),G+=W>>>13,W&=8191;var X=G;X+=b*m,X+=x*q,X+=O*$,X+=_*R,X+=C*v,G=X>>>13,X&=8191,X+=F*L,X+=K*l,X+=I*a,X+=D*f,X+=y*w,G+=X>>>13,X&=8191,G=(G<<2)+G|0,G=G+ie|0,ie=G&8191,G=G>>>13,Q+=G,b=ie,x=Q,O=se,_=T,C=A,F=N,K=h,I=S,D=W,y=X,u+=16,d-=16}this._h[0]=b,this._h[1]=x,this._h[2]=O,this._h[3]=_,this._h[4]=C,this._h[5]=F,this._h[6]=K,this._h[7]=I,this._h[8]=D,this._h[9]=y},o.prototype.finish=function(c,u){u===void 0&&(u=0);var d=new Uint16Array(10),p,b,x,O;if(this._leftover){for(O=this._leftover,this._buffer[O++]=1;O<16;O++)this._buffer[O]=0;this._fin=1,this._blocks(this._buffer,0,16)}for(p=this._h[1]>>>13,this._h[1]&=8191,O=2;O<10;O++)this._h[O]+=p,p=this._h[O]>>>13,this._h[O]&=8191;for(this._h[0]+=p*5,p=this._h[0]>>>13,this._h[0]&=8191,this._h[1]+=p,p=this._h[1]>>>13,this._h[1]&=8191,this._h[2]+=p,d[0]=this._h[0]+5,p=d[0]>>>13,d[0]&=8191,O=1;O<10;O++)d[O]=this._h[O]+p,p=d[O]>>>13,d[O]&=8191;for(d[9]-=8192,b=(p^1)-1,O=0;O<10;O++)d[O]&=b;for(b=~b,O=0;O<10;O++)this._h[O]=this._h[O]&b|d[O];for(this._h[0]=(this._h[0]|this._h[1]<<13)&65535,this._h[1]=(this._h[1]>>>3|this._h[2]<<10)&65535,this._h[2]=(this._h[2]>>>6|this._h[3]<<7)&65535,this._h[3]=(this._h[3]>>>9|this._h[4]<<4)&65535,this._h[4]=(this._h[4]>>>12|this._h[5]<<1|this._h[6]<<14)&65535,this._h[5]=(this._h[6]>>>2|this._h[7]<<11)&65535,this._h[6]=(this._h[7]>>>5|this._h[8]<<8)&65535,this._h[7]=(this._h[8]>>>8|this._h[9]<<5)&65535,x=this._h[0]+this._pad[0],this._h[0]=x&65535,O=1;O<8;O++)x=(this._h[O]+this._pad[O]|0)+(x>>>16)|0,this._h[O]=x&65535;return c[u+0]=this._h[0]>>>0,c[u+1]=this._h[0]>>>8,c[u+2]=this._h[1]>>>0,c[u+3]=this._h[1]>>>8,c[u+4]=this._h[2]>>>0,c[u+5]=this._h[2]>>>8,c[u+6]=this._h[3]>>>0,c[u+7]=this._h[3]>>>8,c[u+8]=this._h[4]>>>0,c[u+9]=this._h[4]>>>8,c[u+10]=this._h[5]>>>0,c[u+11]=this._h[5]>>>8,c[u+12]=this._h[6]>>>0,c[u+13]=this._h[6]>>>8,c[u+14]=this._h[7]>>>0,c[u+15]=this._h[7]>>>8,this._finished=!0,this},o.prototype.update=function(c){var u=0,d=c.length,p;if(this._leftover){p=16-this._leftover,p>d&&(p=d);for(var b=0;b<p;b++)this._buffer[this._leftover+b]=c[u+b];if(d-=p,u+=p,this._leftover+=p,this._leftover<16)return this;this._blocks(this._buffer,0,16),this._leftover=0}if(d>=16&&(p=d-d%16,this._blocks(c,u,p),u+=p,d-=p),d){for(var b=0;b<d;b++)this._buffer[this._leftover+b]=c[u+b];this._leftover+=d}return this},o.prototype.digest=function(){if(this._finished)throw new Error("Poly1305 was finished");var c=new Uint8Array(16);return this.finish(c),c},o.prototype.clean=function(){return t.wipe(this._buffer),t.wipe(this._r),t.wipe(this._h),t.wipe(this._pad),this._leftover=0,this._fin=0,this._finished=!0,this},o}();i.Poly1305=s;function r(o,c){var u=new s(o);u.update(c);var d=u.digest();return u.clean(),d}i.oneTimeAuth=r;function n(o,c){return o.length!==i.DIGEST_LENGTH||c.length!==i.DIGEST_LENGTH?!1:e.equal(o,c)}i.equal=n})(Ic);(function(i){Object.defineProperty(i,"__esModule",{value:!0});var e=hr,t=Ic,s=Pt,r=oe,n=di;i.KEY_LENGTH=32,i.NONCE_LENGTH=12,i.TAG_LENGTH=16;var o=new Uint8Array(16),c=function(){function u(d){if(this.nonceLength=i.NONCE_LENGTH,this.tagLength=i.TAG_LENGTH,d.length!==i.KEY_LENGTH)throw new Error("ChaCha20Poly1305 needs 32-byte key");this._key=new Uint8Array(d)}return u.prototype.seal=function(d,p,b,x){if(d.length>16)throw new Error("ChaCha20Poly1305: incorrect nonce length");var O=new Uint8Array(16);O.set(d,O.length-d.length);var _=new Uint8Array(32);e.stream(this._key,O,_,4);var C=p.length+this.tagLength,F;if(x){if(x.length!==C)throw new Error("ChaCha20Poly1305: incorrect destination length");F=x}else F=new Uint8Array(C);return e.streamXOR(this._key,O,p,F,4),this._authenticate(F.subarray(F.length-this.tagLength,F.length),_,F.subarray(0,F.length-this.tagLength),b),s.wipe(O),F},u.prototype.open=function(d,p,b,x){if(d.length>16)throw new Error("ChaCha20Poly1305: incorrect nonce length");if(p.length<this.tagLength)return null;var O=new Uint8Array(16);O.set(d,O.length-d.length);var _=new Uint8Array(32);e.stream(this._key,O,_,4);var C=new Uint8Array(this.tagLength);if(this._authenticate(C,_,p.subarray(0,p.length-this.tagLength),b),!n.equal(C,p.subarray(p.length-this.tagLength,p.length)))return null;var F=p.length-this.tagLength,K;if(x){if(x.length!==F)throw new Error("ChaCha20Poly1305: incorrect destination length");K=x}else K=new Uint8Array(F);return e.streamXOR(this._key,O,p.subarray(0,p.length-this.tagLength),K,4),s.wipe(O),K},u.prototype.clean=function(){return s.wipe(this._key),this},u.prototype._authenticate=function(d,p,b,x){var O=new t.Poly1305(p);x&&(O.update(x),x.length%16>0&&O.update(o.subarray(x.length%16))),O.update(b),b.length%16>0&&O.update(o.subarray(b.length%16));var _=new Uint8Array(8);x&&r.writeUint64LE(x.length,_),O.update(_),r.writeUint64LE(b.length,_),O.update(_);for(var C=O.digest(),F=0;F<C.length;F++)d[F]=C[F];O.clean(),s.wipe(C),s.wipe(_)},u}();i.ChaCha20Poly1305=c})(ys);var xc={},ms={},cn={};Object.defineProperty(cn,"__esModule",{value:!0});function yf(i){return typeof i.saveState<"u"&&typeof i.restoreState<"u"&&typeof i.cleanSavedState<"u"}cn.isSerializableHash=yf;Object.defineProperty(ms,"__esModule",{value:!0});var jt=cn,mf=di,bf=Pt,Oc=function(){function i(e,t){this._finished=!1,this._inner=new e,this._outer=new e,this.blockSize=this._outer.blockSize,this.digestLength=this._outer.digestLength;var s=new Uint8Array(this.blockSize);t.length>this.blockSize?this._inner.update(t).finish(s).clean():s.set(t);for(var r=0;r<s.length;r++)s[r]^=54;this._inner.update(s);for(var r=0;r<s.length;r++)s[r]^=106;this._outer.update(s),jt.isSerializableHash(this._inner)&&jt.isSerializableHash(this._outer)&&(this._innerKeyedState=this._inner.saveState(),this._outerKeyedState=this._outer.saveState()),bf.wipe(s)}return i.prototype.reset=function(){if(!jt.isSerializableHash(this._inner)||!jt.isSerializableHash(this._outer))throw new Error("hmac: can't reset() because hash doesn't implement restoreState()");return this._inner.restoreState(this._innerKeyedState),this._outer.restoreState(this._outerKeyedState),this._finished=!1,this},i.prototype.clean=function(){jt.isSerializableHash(this._inner)&&this._inner.cleanSavedState(this._innerKeyedState),jt.isSerializableHash(this._outer)&&this._outer.cleanSavedState(this._outerKeyedState),this._inner.clean(),this._outer.clean()},i.prototype.update=function(e){return this._inner.update(e),this},i.prototype.finish=function(e){return this._finished?(this._outer.finish(e),this):(this._inner.finish(e),this._outer.update(e.subarray(0,this.digestLength)).finish(e),this._finished=!0,this)},i.prototype.digest=function(){var e=new Uint8Array(this.digestLength);return this.finish(e),e},i.prototype.saveState=function(){if(!jt.isSerializableHash(this._inner))throw new Error("hmac: can't saveState() because hash doesn't implement it");return this._inner.saveState()},i.prototype.restoreState=function(e){if(!jt.isSerializableHash(this._inner)||!jt.isSerializableHash(this._outer))throw new Error("hmac: can't restoreState() because hash doesn't implement it");return this._inner.restoreState(e),this._outer.restoreState(this._outerKeyedState),this._finished=!1,this},i.prototype.cleanSavedState=function(e){if(!jt.isSerializableHash(this._inner))throw new Error("hmac: can't cleanSavedState() because hash doesn't implement it");this._inner.cleanSavedState(e)},i}();ms.HMAC=Oc;function wf(i,e,t){var s=new Oc(i,e);s.update(t);var r=s.digest();return s.clean(),r}ms.hmac=wf;ms.equal=mf.equal;Object.defineProperty(xc,"__esModule",{value:!0});var vo=ms,_o=Pt,vf=function(){function i(e,t,s,r){s===void 0&&(s=new Uint8Array(0)),this._counter=new Uint8Array(1),this._hash=e,this._info=r;var n=vo.hmac(this._hash,s,t);this._hmac=new vo.HMAC(e,n),this._buffer=new Uint8Array(this._hmac.digestLength),this._bufpos=this._buffer.length}return i.prototype._fillBuffer=function(){this._counter[0]++;var e=this._counter[0];if(e===0)throw new Error("hkdf: cannot expand more");this._hmac.reset(),e>1&&this._hmac.update(this._buffer),this._info&&this._hmac.update(this._info),this._hmac.update(this._counter),this._hmac.finish(this._buffer),this._bufpos=0},i.prototype.expand=function(e){for(var t=new Uint8Array(e),s=0;s<t.length;s++)this._bufpos===this._buffer.length&&this._fillBuffer(),t[s]=this._buffer[this._bufpos++];return t},i.prototype.clean=function(){this._hmac.clean(),_o.wipe(this._buffer),_o.wipe(this._counter),this._bufpos=0},i}(),Nc=xc.HKDF=vf,Si={};(function(i){Object.defineProperty(i,"__esModule",{value:!0});var e=oe,t=Pt;i.DIGEST_LENGTH=32,i.BLOCK_SIZE=64;var s=function(){function c(){this.digestLength=i.DIGEST_LENGTH,this.blockSize=i.BLOCK_SIZE,this._state=new Int32Array(8),this._temp=new Int32Array(64),this._buffer=new Uint8Array(128),this._bufferLength=0,this._bytesHashed=0,this._finished=!1,this.reset()}return c.prototype._initState=function(){this._state[0]=1779033703,this._state[1]=3144134277,this._state[2]=1013904242,this._state[3]=2773480762,this._state[4]=1359893119,this._state[5]=2600822924,this._state[6]=528734635,this._state[7]=1541459225},c.prototype.reset=function(){return this._initState(),this._bufferLength=0,this._bytesHashed=0,this._finished=!1,this},c.prototype.clean=function(){t.wipe(this._buffer),t.wipe(this._temp),this.reset()},c.prototype.update=function(u,d){if(d===void 0&&(d=u.length),this._finished)throw new Error("SHA256: can't update because hash was finished.");var p=0;if(this._bytesHashed+=d,this._bufferLength>0){for(;this._bufferLength<this.blockSize&&d>0;)this._buffer[this._bufferLength++]=u[p++],d--;this._bufferLength===this.blockSize&&(n(this._temp,this._state,this._buffer,0,this.blockSize),this._bufferLength=0)}for(d>=this.blockSize&&(p=n(this._temp,this._state,u,p,d),d%=this.blockSize);d>0;)this._buffer[this._bufferLength++]=u[p++],d--;return this},c.prototype.finish=function(u){if(!this._finished){var d=this._bytesHashed,p=this._bufferLength,b=d/536870912|0,x=d<<3,O=d%64<56?64:128;this._buffer[p]=128;for(var _=p+1;_<O-8;_++)this._buffer[_]=0;e.writeUint32BE(b,this._buffer,O-8),e.writeUint32BE(x,this._buffer,O-4),n(this._temp,this._state,this._buffer,0,O),this._finished=!0}for(var _=0;_<this.digestLength/4;_++)e.writeUint32BE(this._state[_],u,_*4);return this},c.prototype.digest=function(){var u=new Uint8Array(this.digestLength);return this.finish(u),u},c.prototype.saveState=function(){if(this._finished)throw new Error("SHA256: cannot save finished state");return{state:new Int32Array(this._state),buffer:this._bufferLength>0?new Uint8Array(this._buffer):void 0,bufferLength:this._bufferLength,bytesHashed:this._bytesHashed}},c.prototype.restoreState=function(u){return this._state.set(u.state),this._bufferLength=u.bufferLength,u.buffer&&this._buffer.set(u.buffer),this._bytesHashed=u.bytesHashed,this._finished=!1,this},c.prototype.cleanSavedState=function(u){t.wipe(u.state),u.buffer&&t.wipe(u.buffer),u.bufferLength=0,u.bytesHashed=0},c}();i.SHA256=s;var r=new Int32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function n(c,u,d,p,b){for(;b>=64;){for(var x=u[0],O=u[1],_=u[2],C=u[3],F=u[4],K=u[5],I=u[6],D=u[7],y=0;y<16;y++){var w=p+y*4;c[y]=e.readUint32BE(d,w)}for(var y=16;y<64;y++){var f=c[y-2],a=(f>>>17|f<<32-17)^(f>>>19|f<<32-19)^f>>>10;f=c[y-15];var l=(f>>>7|f<<32-7)^(f>>>18|f<<32-18)^f>>>3;c[y]=(a+c[y-7]|0)+(l+c[y-16]|0)}for(var y=0;y<64;y++){var a=(((F>>>6|F<<26)^(F>>>11|F<<21)^(F>>>25|F<<7))+(F&K^~F&I)|0)+(D+(r[y]+c[y]|0)|0)|0,l=((x>>>2|x<<32-2)^(x>>>13|x<<32-13)^(x>>>22|x<<32-22))+(x&O^x&_^O&_)|0;D=I,I=K,K=F,F=C+a|0,C=_,_=O,O=x,x=a+l|0}u[0]+=x,u[1]+=O,u[2]+=_,u[3]+=C,u[4]+=F,u[5]+=K,u[6]+=I,u[7]+=D,p+=64,b-=64}return p}function o(c){var u=new s;u.update(c);var d=u.digest();return u.clean(),d}i.hash=o})(Si);var bs={};(function(i){Object.defineProperty(i,"__esModule",{value:!0}),i.sharedKey=i.generateKeyPair=i.generateKeyPairFromSeed=i.scalarMultBase=i.scalarMult=i.SHARED_KEY_LENGTH=i.SECRET_KEY_LENGTH=i.PUBLIC_KEY_LENGTH=void 0;const e=li,t=Pt;i.PUBLIC_KEY_LENGTH=32,i.SECRET_KEY_LENGTH=32,i.SHARED_KEY_LENGTH=32;function s(y){const w=new Float64Array(16);if(y)for(let f=0;f<y.length;f++)w[f]=y[f];return w}const r=new Uint8Array(32);r[0]=9;const n=s([56129,1]);function o(y){let w=1;for(let f=0;f<16;f++){let a=y[f]+w+65535;w=Math.floor(a/65536),y[f]=a-w*65536}y[0]+=w-1+37*(w-1)}function c(y,w,f){const a=~(f-1);for(let l=0;l<16;l++){const L=a&(y[l]^w[l]);y[l]^=L,w[l]^=L}}function u(y,w){const f=s(),a=s();for(let l=0;l<16;l++)a[l]=w[l];o(a),o(a),o(a);for(let l=0;l<2;l++){f[0]=a[0]-65517;for(let v=1;v<15;v++)f[v]=a[v]-65535-(f[v-1]>>16&1),f[v-1]&=65535;f[15]=a[15]-32767-(f[14]>>16&1);const L=f[15]>>16&1;f[14]&=65535,c(a,f,1-L)}for(let l=0;l<16;l++)y[2*l]=a[l]&255,y[2*l+1]=a[l]>>8}function d(y,w){for(let f=0;f<16;f++)y[f]=w[2*f]+(w[2*f+1]<<8);y[15]&=32767}function p(y,w,f){for(let a=0;a<16;a++)y[a]=w[a]+f[a]}function b(y,w,f){for(let a=0;a<16;a++)y[a]=w[a]-f[a]}function x(y,w,f){let a,l,L=0,v=0,R=0,$=0,q=0,m=0,E=0,B=0,z=0,j=0,U=0,M=0,H=0,te=0,G=0,ie=0,Q=0,se=0,T=0,A=0,N=0,h=0,S=0,W=0,X=0,fe=0,ve=0,ge=0,Se=0,Me=0,$e=0,be=f[0],ye=f[1],pe=f[2],le=f[3],ue=f[4],he=f[5],ce=f[6],re=f[7],de=f[8],me=f[9],ne=f[10],_e=f[11],Ee=f[12],De=f[13],xe=f[14],Ie=f[15];a=w[0],L+=a*be,v+=a*ye,R+=a*pe,$+=a*le,q+=a*ue,m+=a*he,E+=a*ce,B+=a*re,z+=a*de,j+=a*me,U+=a*ne,M+=a*_e,H+=a*Ee,te+=a*De,G+=a*xe,ie+=a*Ie,a=w[1],v+=a*be,R+=a*ye,$+=a*pe,q+=a*le,m+=a*ue,E+=a*he,B+=a*ce,z+=a*re,j+=a*de,U+=a*me,M+=a*ne,H+=a*_e,te+=a*Ee,G+=a*De,ie+=a*xe,Q+=a*Ie,a=w[2],R+=a*be,$+=a*ye,q+=a*pe,m+=a*le,E+=a*ue,B+=a*he,z+=a*ce,j+=a*re,U+=a*de,M+=a*me,H+=a*ne,te+=a*_e,G+=a*Ee,ie+=a*De,Q+=a*xe,se+=a*Ie,a=w[3],$+=a*be,q+=a*ye,m+=a*pe,E+=a*le,B+=a*ue,z+=a*he,j+=a*ce,U+=a*re,M+=a*de,H+=a*me,te+=a*ne,G+=a*_e,ie+=a*Ee,Q+=a*De,se+=a*xe,T+=a*Ie,a=w[4],q+=a*be,m+=a*ye,E+=a*pe,B+=a*le,z+=a*ue,j+=a*he,U+=a*ce,M+=a*re,H+=a*de,te+=a*me,G+=a*ne,ie+=a*_e,Q+=a*Ee,se+=a*De,T+=a*xe,A+=a*Ie,a=w[5],m+=a*be,E+=a*ye,B+=a*pe,z+=a*le,j+=a*ue,U+=a*he,M+=a*ce,H+=a*re,te+=a*de,G+=a*me,ie+=a*ne,Q+=a*_e,se+=a*Ee,T+=a*De,A+=a*xe,N+=a*Ie,a=w[6],E+=a*be,B+=a*ye,z+=a*pe,j+=a*le,U+=a*ue,M+=a*he,H+=a*ce,te+=a*re,G+=a*de,ie+=a*me,Q+=a*ne,se+=a*_e,T+=a*Ee,A+=a*De,N+=a*xe,h+=a*Ie,a=w[7],B+=a*be,z+=a*ye,j+=a*pe,U+=a*le,M+=a*ue,H+=a*he,te+=a*ce,G+=a*re,ie+=a*de,Q+=a*me,se+=a*ne,T+=a*_e,A+=a*Ee,N+=a*De,h+=a*xe,S+=a*Ie,a=w[8],z+=a*be,j+=a*ye,U+=a*pe,M+=a*le,H+=a*ue,te+=a*he,G+=a*ce,ie+=a*re,Q+=a*de,se+=a*me,T+=a*ne,A+=a*_e,N+=a*Ee,h+=a*De,S+=a*xe,W+=a*Ie,a=w[9],j+=a*be,U+=a*ye,M+=a*pe,H+=a*le,te+=a*ue,G+=a*he,ie+=a*ce,Q+=a*re,se+=a*de,T+=a*me,A+=a*ne,N+=a*_e,h+=a*Ee,S+=a*De,W+=a*xe,X+=a*Ie,a=w[10],U+=a*be,M+=a*ye,H+=a*pe,te+=a*le,G+=a*ue,ie+=a*he,Q+=a*ce,se+=a*re,T+=a*de,A+=a*me,N+=a*ne,h+=a*_e,S+=a*Ee,W+=a*De,X+=a*xe,fe+=a*Ie,a=w[11],M+=a*be,H+=a*ye,te+=a*pe,G+=a*le,ie+=a*ue,Q+=a*he,se+=a*ce,T+=a*re,A+=a*de,N+=a*me,h+=a*ne,S+=a*_e,W+=a*Ee,X+=a*De,fe+=a*xe,ve+=a*Ie,a=w[12],H+=a*be,te+=a*ye,G+=a*pe,ie+=a*le,Q+=a*ue,se+=a*he,T+=a*ce,A+=a*re,N+=a*de,h+=a*me,S+=a*ne,W+=a*_e,X+=a*Ee,fe+=a*De,ve+=a*xe,ge+=a*Ie,a=w[13],te+=a*be,G+=a*ye,ie+=a*pe,Q+=a*le,se+=a*ue,T+=a*he,A+=a*ce,N+=a*re,h+=a*de,S+=a*me,W+=a*ne,X+=a*_e,fe+=a*Ee,ve+=a*De,ge+=a*xe,Se+=a*Ie,a=w[14],G+=a*be,ie+=a*ye,Q+=a*pe,se+=a*le,T+=a*ue,A+=a*he,N+=a*ce,h+=a*re,S+=a*de,W+=a*me,X+=a*ne,fe+=a*_e,ve+=a*Ee,ge+=a*De,Se+=a*xe,Me+=a*Ie,a=w[15],ie+=a*be,Q+=a*ye,se+=a*pe,T+=a*le,A+=a*ue,N+=a*he,h+=a*ce,S+=a*re,W+=a*de,X+=a*me,fe+=a*ne,ve+=a*_e,ge+=a*Ee,Se+=a*De,Me+=a*xe,$e+=a*Ie,L+=38*Q,v+=38*se,R+=38*T,$+=38*A,q+=38*N,m+=38*h,E+=38*S,B+=38*W,z+=38*X,j+=38*fe,U+=38*ve,M+=38*ge,H+=38*Se,te+=38*Me,G+=38*$e,l=1,a=L+l+65535,l=Math.floor(a/65536),L=a-l*65536,a=v+l+65535,l=Math.floor(a/65536),v=a-l*65536,a=R+l+65535,l=Math.floor(a/65536),R=a-l*65536,a=$+l+65535,l=Math.floor(a/65536),$=a-l*65536,a=q+l+65535,l=Math.floor(a/65536),q=a-l*65536,a=m+l+65535,l=Math.floor(a/65536),m=a-l*65536,a=E+l+65535,l=Math.floor(a/65536),E=a-l*65536,a=B+l+65535,l=Math.floor(a/65536),B=a-l*65536,a=z+l+65535,l=Math.floor(a/65536),z=a-l*65536,a=j+l+65535,l=Math.floor(a/65536),j=a-l*65536,a=U+l+65535,l=Math.floor(a/65536),U=a-l*65536,a=M+l+65535,l=Math.floor(a/65536),M=a-l*65536,a=H+l+65535,l=Math.floor(a/65536),H=a-l*65536,a=te+l+65535,l=Math.floor(a/65536),te=a-l*65536,a=G+l+65535,l=Math.floor(a/65536),G=a-l*65536,a=ie+l+65535,l=Math.floor(a/65536),ie=a-l*65536,L+=l-1+37*(l-1),l=1,a=L+l+65535,l=Math.floor(a/65536),L=a-l*65536,a=v+l+65535,l=Math.floor(a/65536),v=a-l*65536,a=R+l+65535,l=Math.floor(a/65536),R=a-l*65536,a=$+l+65535,l=Math.floor(a/65536),$=a-l*65536,a=q+l+65535,l=Math.floor(a/65536),q=a-l*65536,a=m+l+65535,l=Math.floor(a/65536),m=a-l*65536,a=E+l+65535,l=Math.floor(a/65536),E=a-l*65536,a=B+l+65535,l=Math.floor(a/65536),B=a-l*65536,a=z+l+65535,l=Math.floor(a/65536),z=a-l*65536,a=j+l+65535,l=Math.floor(a/65536),j=a-l*65536,a=U+l+65535,l=Math.floor(a/65536),U=a-l*65536,a=M+l+65535,l=Math.floor(a/65536),M=a-l*65536,a=H+l+65535,l=Math.floor(a/65536),H=a-l*65536,a=te+l+65535,l=Math.floor(a/65536),te=a-l*65536,a=G+l+65535,l=Math.floor(a/65536),G=a-l*65536,a=ie+l+65535,l=Math.floor(a/65536),ie=a-l*65536,L+=l-1+37*(l-1),y[0]=L,y[1]=v,y[2]=R,y[3]=$,y[4]=q,y[5]=m,y[6]=E,y[7]=B,y[8]=z,y[9]=j,y[10]=U,y[11]=M,y[12]=H,y[13]=te,y[14]=G,y[15]=ie}function O(y,w){x(y,w,w)}function _(y,w){const f=s();for(let a=0;a<16;a++)f[a]=w[a];for(let a=253;a>=0;a--)O(f,f),a!==2&&a!==4&&x(f,f,w);for(let a=0;a<16;a++)y[a]=f[a]}function C(y,w){const f=new Uint8Array(32),a=new Float64Array(80),l=s(),L=s(),v=s(),R=s(),$=s(),q=s();for(let z=0;z<31;z++)f[z]=y[z];f[31]=y[31]&127|64,f[0]&=248,d(a,w);for(let z=0;z<16;z++)L[z]=a[z];l[0]=R[0]=1;for(let z=254;z>=0;--z){const j=f[z>>>3]>>>(z&7)&1;c(l,L,j),c(v,R,j),p($,l,v),b(l,l,v),p(v,L,R),b(L,L,R),O(R,$),O(q,l),x(l,v,l),x(v,L,$),p($,l,v),b(l,l,v),O(L,l),b(v,R,q),x(l,v,n),p(l,l,R),x(v,v,l),x(l,R,q),x(R,L,a),O(L,$),c(l,L,j),c(v,R,j)}for(let z=0;z<16;z++)a[z+16]=l[z],a[z+32]=v[z],a[z+48]=L[z],a[z+64]=R[z];const m=a.subarray(32),E=a.subarray(16);_(m,m),x(E,E,m);const B=new Uint8Array(32);return u(B,E),B}i.scalarMult=C;function F(y){return C(y,r)}i.scalarMultBase=F;function K(y){if(y.length!==i.SECRET_KEY_LENGTH)throw new Error(`x25519: seed must be ${i.SECRET_KEY_LENGTH} bytes`);const w=new Uint8Array(y);return{publicKey:F(w),secretKey:w}}i.generateKeyPairFromSeed=K;function I(y){const w=(0,e.randomBytes)(32,y),f=K(w);return(0,t.wipe)(w),f}i.generateKeyPair=I;function D(y,w,f=!1){if(y.length!==i.PUBLIC_KEY_LENGTH)throw new Error("X25519: incorrect secret key length");if(w.length!==i.PUBLIC_KEY_LENGTH)throw new Error("X25519: incorrect public key length");const a=C(y,w);if(f){let l=0;for(let L=0;L<a.length;L++)l|=a[L];if(l===0)throw new Error("X25519: invalid shared key")}return a}i.sharedKey=D})(bs);var Eo=globalThis&&globalThis.__spreadArray||function(i,e,t){if(t||arguments.length===2)for(var s=0,r=e.length,n;s<r;s++)(n||!(s in e))&&(n||(n=Array.prototype.slice.call(e,0,s)),n[s]=e[s]);return i.concat(n||Array.prototype.slice.call(e))},_f=function(){function i(e,t,s){this.name=e,this.version=t,this.os=s,this.type="browser"}return i}(),Ef=function(){function i(e){this.version=e,this.type="node",this.name="node",this.os=process.platform}return i}(),Sf=function(){function i(e,t,s,r){this.name=e,this.version=t,this.os=s,this.bot=r,this.type="bot-device"}return i}(),If=function(){function i(){this.type="bot",this.bot=!0,this.name="bot",this.version=null,this.os=null}return i}(),Df=function(){function i(){this.type="react-native",this.name="react-native",this.version=null,this.os=null}return i}(),xf=/alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/,Of=/(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/,So=3,Nf=[["aol",/AOLShield\/([0-9\._]+)/],["edge",/Edge\/([0-9\._]+)/],["edge-ios",/EdgiOS\/([0-9\._]+)/],["yandexbrowser",/YaBrowser\/([0-9\._]+)/],["kakaotalk",/KAKAOTALK\s([0-9\.]+)/],["samsung",/SamsungBrowser\/([0-9\.]+)/],["silk",/\bSilk\/([0-9._-]+)\b/],["miui",/MiuiBrowser\/([0-9\.]+)$/],["beaker",/BeakerBrowser\/([0-9\.]+)/],["edge-chromium",/EdgA?\/([0-9\.]+)/],["chromium-webview",/(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],["chrome",/(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],["phantomjs",/PhantomJS\/([0-9\.]+)(:?\s|$)/],["crios",/CriOS\/([0-9\.]+)(:?\s|$)/],["firefox",/Firefox\/([0-9\.]+)(?:\s|$)/],["fxios",/FxiOS\/([0-9\.]+)/],["opera-mini",/Opera Mini.*Version\/([0-9\.]+)/],["opera",/Opera\/([0-9\.]+)(?:\s|$)/],["opera",/OPR\/([0-9\.]+)(:?\s|$)/],["pie",/^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],["pie",/^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/],["netfront",/^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],["ie",/Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],["ie",/MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],["ie",/MSIE\s(7\.0)/],["bb10",/BB10;\sTouch.*Version\/([0-9\.]+)/],["android",/Android\s([0-9\.]+)/],["ios",/Version\/([0-9\._]+).*Mobile.*Safari.*/],["safari",/Version\/([0-9\._]+).*Safari/],["facebook",/FB[AS]V\/([0-9\.]+)/],["instagram",/Instagram\s([0-9\.]+)/],["ios-webview",/AppleWebKit\/([0-9\.]+).*Mobile/],["ios-webview",/AppleWebKit\/([0-9\.]+).*Gecko\)$/],["curl",/^curl\/([0-9\.]+)$/],["searchbot",xf]],Io=[["iOS",/iP(hone|od|ad)/],["Android OS",/Android/],["BlackBerry OS",/BlackBerry|BB10/],["Windows Mobile",/IEMobile/],["Amazon OS",/Kindle/],["Windows 3.11",/Win16/],["Windows 95",/(Windows 95)|(Win95)|(Windows_95)/],["Windows 98",/(Windows 98)|(Win98)/],["Windows 2000",/(Windows NT 5.0)|(Windows 2000)/],["Windows XP",/(Windows NT 5.1)|(Windows XP)/],["Windows Server 2003",/(Windows NT 5.2)/],["Windows Vista",/(Windows NT 6.0)/],["Windows 7",/(Windows NT 6.1)/],["Windows 8",/(Windows NT 6.2)/],["Windows 8.1",/(Windows NT 6.3)/],["Windows 10",/(Windows NT 10.0)/],["Windows ME",/Windows ME/],["Windows CE",/Windows CE|WinCE|Microsoft Pocket Internet Explorer/],["Open BSD",/OpenBSD/],["Sun OS",/SunOS/],["Chrome OS",/CrOS/],["Linux",/(Linux)|(X11)/],["Mac OS",/(Mac_PowerPC)|(Macintosh)/],["QNX",/QNX/],["BeOS",/BeOS/],["OS/2",/OS\/2/]];function hn(i){return i?Do(i):typeof document>"u"&&typeof navigator<"u"&&navigator.product==="ReactNative"?new Df:typeof navigator<"u"?Do(navigator.userAgent):Cf()}function Pf(i){return i!==""&&Nf.reduce(function(e,t){var s=t[0],r=t[1];if(e)return e;var n=r.exec(i);return!!n&&[s,n]},!1)}function Do(i){var e=Pf(i);if(!e)return null;var t=e[0],s=e[1];if(t==="searchbot")return new If;var r=s[1]&&s[1].split(".").join("_").split("_").slice(0,3);r?r.length<So&&(r=Eo(Eo([],r,!0),Af(So-r.length),!0)):r=[];var n=r.join("."),o=Rf(i),c=Of.exec(i);return c&&c[1]?new Sf(t,n,o,c[1]):new _f(t,n,o)}function Rf(i){for(var e=0,t=Io.length;e<t;e++){var s=Io[e],r=s[0],n=s[1],o=n.exec(i);if(o)return r}return null}function Cf(){var i=typeof process<"u"&&process.version;return i?new Ef(process.version.slice(1)):null}function Af(i){for(var e=[],t=0;t<i;t++)e.push("0");return e}var Pe={};Object.defineProperty(Pe,"__esModule",{value:!0});Pe.getLocalStorage=Pe.getLocalStorageOrThrow=Pe.getCrypto=Pe.getCryptoOrThrow=ln=Pe.getLocation=Pe.getLocationOrThrow=ws=Pe.getNavigator=Pe.getNavigatorOrThrow=un=Pe.getDocument=Pe.getDocumentOrThrow=Pe.getFromWindowOrThrow=Pe.getFromWindow=void 0;function Ii(i){let e;return typeof window<"u"&&typeof window[i]<"u"&&(e=window[i]),e}Pe.getFromWindow=Ii;function Mi(i){const e=Ii(i);if(!e)throw new Error(`${i} is not defined in Window`);return e}Pe.getFromWindowOrThrow=Mi;function Tf(){return Mi("document")}Pe.getDocumentOrThrow=Tf;function $f(){return Ii("document")}var un=Pe.getDocument=$f;function Ff(){return Mi("navigator")}Pe.getNavigatorOrThrow=Ff;function Uf(){return Ii("navigator")}var ws=Pe.getNavigator=Uf;function Lf(){return Mi("location")}Pe.getLocationOrThrow=Lf;function Mf(){return Ii("location")}var ln=Pe.getLocation=Mf;function qf(){return Mi("crypto")}Pe.getCryptoOrThrow=qf;function jf(){return Ii("crypto")}Pe.getCrypto=jf;function zf(){return Mi("localStorage")}Pe.getLocalStorageOrThrow=zf;function Kf(){return Ii("localStorage")}Pe.getLocalStorage=Kf;var dn={};Object.defineProperty(dn,"__esModule",{value:!0});var fn=dn.getWindowMetadata=void 0;const xo=Pe;function Vf(){let i,e;try{i=xo.getDocumentOrThrow(),e=xo.getLocationOrThrow()}catch{return null}function t(){const b=i.getElementsByTagName("link"),x=[];for(let O=0;O<b.length;O++){const _=b[O],C=_.getAttribute("rel");if(C&&C.toLowerCase().indexOf("icon")>-1){const F=_.getAttribute("href");if(F)if(F.toLowerCase().indexOf("https:")===-1&&F.toLowerCase().indexOf("http:")===-1&&F.indexOf("//")!==0){let K=e.protocol+"//"+e.host;if(F.indexOf("/")===0)K+=F;else{const I=e.pathname.split("/");I.pop();const D=I.join("/");K+=D+"/"+F}x.push(K)}else if(F.indexOf("//")===0){const K=e.protocol+F;x.push(K)}else x.push(F)}}return x}function s(...b){const x=i.getElementsByTagName("meta");for(let O=0;O<x.length;O++){const _=x[O],C=["itemprop","property","name"].map(F=>_.getAttribute(F)).filter(F=>F?b.includes(F):!1);if(C.length&&C){const F=_.getAttribute("content");if(F)return F}}return""}function r(){let b=s("name","og:site_name","og:title","twitter:title");return b||(b=i.title),b}function n(){return s("description","og:description","twitter:description","keywords")}const o=r(),c=n(),u=e.origin,d=t();return{description:c,url:u,icons:d,name:o}}fn=dn.getWindowMetadata=Vf;var ii={},Bf=i=>encodeURIComponent(i).replace(/[!'()*]/g,e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`),Pc="%[a-f0-9]{2}",Oo=new RegExp("("+Pc+")|([^%]+?)","gi"),No=new RegExp("("+Pc+")+","gi");function Vr(i,e){try{return[decodeURIComponent(i.join(""))]}catch{}if(i.length===1)return i;e=e||1;var t=i.slice(0,e),s=i.slice(e);return Array.prototype.concat.call([],Vr(t),Vr(s))}function kf(i){try{return decodeURIComponent(i)}catch{for(var e=i.match(Oo)||[],t=1;t<e.length;t++)i=Vr(e,t).join(""),e=i.match(Oo)||[];return i}}function Hf(i){for(var e={"%FE%FF":"��","%FF%FE":"��"},t=No.exec(i);t;){try{e[t[0]]=decodeURIComponent(t[0])}catch{var s=kf(t[0]);s!==t[0]&&(e[t[0]]=s)}t=No.exec(i)}e["%C2"]="�";for(var r=Object.keys(e),n=0;n<r.length;n++){var o=r[n];i=i.replace(new RegExp(o,"g"),e[o])}return i}var Gf=function(i){if(typeof i!="string")throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof i+"`");try{return i=i.replace(/\+/g," "),decodeURIComponent(i)}catch{return Hf(i)}},Wf=(i,e)=>{if(!(typeof i=="string"&&typeof e=="string"))throw new TypeError("Expected the arguments to be of type `string`");if(e==="")return[i];const t=i.indexOf(e);return t===-1?[i]:[i.slice(0,t),i.slice(t+e.length)]},Yf=function(i,e){for(var t={},s=Object.keys(i),r=Array.isArray(e),n=0;n<s.length;n++){var o=s[n],c=i[o];(r?e.indexOf(o)!==-1:e(o,c,i))&&(t[o]=c)}return t};(function(i){const e=Bf,t=Gf,s=Wf,r=Yf,n=I=>I==null,o=Symbol("encodeFragmentIdentifier");function c(I){switch(I.arrayFormat){case"index":return D=>(y,w)=>{const f=y.length;return w===void 0||I.skipNull&&w===null||I.skipEmptyString&&w===""?y:w===null?[...y,[p(D,I),"[",f,"]"].join("")]:[...y,[p(D,I),"[",p(f,I),"]=",p(w,I)].join("")]};case"bracket":return D=>(y,w)=>w===void 0||I.skipNull&&w===null||I.skipEmptyString&&w===""?y:w===null?[...y,[p(D,I),"[]"].join("")]:[...y,[p(D,I),"[]=",p(w,I)].join("")];case"colon-list-separator":return D=>(y,w)=>w===void 0||I.skipNull&&w===null||I.skipEmptyString&&w===""?y:w===null?[...y,[p(D,I),":list="].join("")]:[...y,[p(D,I),":list=",p(w,I)].join("")];case"comma":case"separator":case"bracket-separator":{const D=I.arrayFormat==="bracket-separator"?"[]=":"=";return y=>(w,f)=>f===void 0||I.skipNull&&f===null||I.skipEmptyString&&f===""?w:(f=f===null?"":f,w.length===0?[[p(y,I),D,p(f,I)].join("")]:[[w,p(f,I)].join(I.arrayFormatSeparator)])}default:return D=>(y,w)=>w===void 0||I.skipNull&&w===null||I.skipEmptyString&&w===""?y:w===null?[...y,p(D,I)]:[...y,[p(D,I),"=",p(w,I)].join("")]}}function u(I){let D;switch(I.arrayFormat){case"index":return(y,w,f)=>{if(D=/\[(\d*)\]$/.exec(y),y=y.replace(/\[\d*\]$/,""),!D){f[y]=w;return}f[y]===void 0&&(f[y]={}),f[y][D[1]]=w};case"bracket":return(y,w,f)=>{if(D=/(\[\])$/.exec(y),y=y.replace(/\[\]$/,""),!D){f[y]=w;return}if(f[y]===void 0){f[y]=[w];return}f[y]=[].concat(f[y],w)};case"colon-list-separator":return(y,w,f)=>{if(D=/(:list)$/.exec(y),y=y.replace(/:list$/,""),!D){f[y]=w;return}if(f[y]===void 0){f[y]=[w];return}f[y]=[].concat(f[y],w)};case"comma":case"separator":return(y,w,f)=>{const a=typeof w=="string"&&w.includes(I.arrayFormatSeparator),l=typeof w=="string"&&!a&&b(w,I).includes(I.arrayFormatSeparator);w=l?b(w,I):w;const L=a||l?w.split(I.arrayFormatSeparator).map(v=>b(v,I)):w===null?w:b(w,I);f[y]=L};case"bracket-separator":return(y,w,f)=>{const a=/(\[\])$/.test(y);if(y=y.replace(/\[\]$/,""),!a){f[y]=w&&b(w,I);return}const l=w===null?[]:w.split(I.arrayFormatSeparator).map(L=>b(L,I));if(f[y]===void 0){f[y]=l;return}f[y]=[].concat(f[y],l)};default:return(y,w,f)=>{if(f[y]===void 0){f[y]=w;return}f[y]=[].concat(f[y],w)}}}function d(I){if(typeof I!="string"||I.length!==1)throw new TypeError("arrayFormatSeparator must be single character string")}function p(I,D){return D.encode?D.strict?e(I):encodeURIComponent(I):I}function b(I,D){return D.decode?t(I):I}function x(I){return Array.isArray(I)?I.sort():typeof I=="object"?x(Object.keys(I)).sort((D,y)=>Number(D)-Number(y)).map(D=>I[D]):I}function O(I){const D=I.indexOf("#");return D!==-1&&(I=I.slice(0,D)),I}function _(I){let D="";const y=I.indexOf("#");return y!==-1&&(D=I.slice(y)),D}function C(I){I=O(I);const D=I.indexOf("?");return D===-1?"":I.slice(D+1)}function F(I,D){return D.parseNumbers&&!Number.isNaN(Number(I))&&typeof I=="string"&&I.trim()!==""?I=Number(I):D.parseBooleans&&I!==null&&(I.toLowerCase()==="true"||I.toLowerCase()==="false")&&(I=I.toLowerCase()==="true"),I}function K(I,D){D=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},D),d(D.arrayFormatSeparator);const y=u(D),w=Object.create(null);if(typeof I!="string"||(I=I.trim().replace(/^[?#&]/,""),!I))return w;for(const f of I.split("&")){if(f==="")continue;let[a,l]=s(D.decode?f.replace(/\+/g," "):f,"=");l=l===void 0?null:["comma","separator","bracket-separator"].includes(D.arrayFormat)?l:b(l,D),y(b(a,D),l,w)}for(const f of Object.keys(w)){const a=w[f];if(typeof a=="object"&&a!==null)for(const l of Object.keys(a))a[l]=F(a[l],D);else w[f]=F(a,D)}return D.sort===!1?w:(D.sort===!0?Object.keys(w).sort():Object.keys(w).sort(D.sort)).reduce((f,a)=>{const l=w[a];return l&&typeof l=="object"&&!Array.isArray(l)?f[a]=x(l):f[a]=l,f},Object.create(null))}i.extract=C,i.parse=K,i.stringify=(I,D)=>{if(!I)return"";D=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},D),d(D.arrayFormatSeparator);const y=l=>D.skipNull&&n(I[l])||D.skipEmptyString&&I[l]==="",w=c(D),f={};for(const l of Object.keys(I))y(l)||(f[l]=I[l]);const a=Object.keys(f);return D.sort!==!1&&a.sort(D.sort),a.map(l=>{const L=I[l];return L===void 0?"":L===null?p(l,D):Array.isArray(L)?L.length===0&&D.arrayFormat==="bracket-separator"?p(l,D)+"[]":L.reduce(w(l),[]).join("&"):p(l,D)+"="+p(L,D)}).filter(l=>l.length>0).join("&")},i.parseUrl=(I,D)=>{D=Object.assign({decode:!0},D);const[y,w]=s(I,"#");return Object.assign({url:y.split("?")[0]||"",query:K(C(I),D)},D&&D.parseFragmentIdentifier&&w?{fragmentIdentifier:b(w,D)}:{})},i.stringifyUrl=(I,D)=>{D=Object.assign({encode:!0,strict:!0,[o]:!0},D);const y=O(I.url).split("?")[0]||"",w=i.extract(I.url),f=i.parse(w,{sort:!1}),a=Object.assign(f,I.query);let l=i.stringify(a,D);l&&(l=`?${l}`);let L=_(I.url);return I.fragmentIdentifier&&(L=`#${D[o]?p(I.fragmentIdentifier,D):I.fragmentIdentifier}`),`${y}${l}${L}`},i.pick=(I,D,y)=>{y=Object.assign({parseFragmentIdentifier:!0,[o]:!1},y);const{url:w,query:f,fragmentIdentifier:a}=i.parseUrl(I,y);return i.stringifyUrl({url:w,query:r(f,D),fragmentIdentifier:a},y)},i.exclude=(I,D,y)=>{const w=Array.isArray(D)?f=>!D.includes(f):(f,a)=>!D(f,a);return i.pick(I,w,y)}})(ii);const Rc={waku:{publish:"waku_publish",batchPublish:"waku_batchPublish",subscribe:"waku_subscribe",batchSubscribe:"waku_batchSubscribe",subscription:"waku_subscription",unsubscribe:"waku_unsubscribe",batchUnsubscribe:"waku_batchUnsubscribe"},irn:{publish:"irn_publish",batchPublish:"irn_batchPublish",subscribe:"irn_subscribe",batchSubscribe:"irn_batchSubscribe",subscription:"irn_subscription",unsubscribe:"irn_unsubscribe",batchUnsubscribe:"irn_batchUnsubscribe"},iridium:{publish:"iridium_publish",batchPublish:"iridium_batchPublish",subscribe:"iridium_subscribe",batchSubscribe:"iridium_batchSubscribe",subscription:"iridium_subscription",unsubscribe:"iridium_unsubscribe",batchUnsubscribe:"iridium_batchUnsubscribe"}};function Cc(i,e){return i.includes(":")?[i]:e.chains||[]}const Ac="base10",vt="base16",Br="base64pad",pn="utf8",Tc=0,Di=1,Jf=0,Po=1,kr=12,gn=32;function Qf(){const i=bs.generateKeyPair();return{privateKey:Ne(i.secretKey,vt),publicKey:Ne(i.publicKey,vt)}}function Hr(){const i=li.randomBytes(gn);return Ne(i,vt)}function Xf(i,e){const t=bs.sharedKey(Ce(i,vt),Ce(e,vt),!0),s=new Nc(Si.SHA256,t).expand(gn);return Ne(s,vt)}function Zf(i){const e=Si.hash(Ce(i,vt));return Ne(e,vt)}function Ui(i){const e=Si.hash(Ce(i,pn));return Ne(e,vt)}function ep(i){return Ce(`${i}`,Ac)}function vs(i){return Number(Ne(i,Ac))}function tp(i){const e=ep(typeof i.type<"u"?i.type:Tc);if(vs(e)===Di&&typeof i.senderPublicKey>"u")throw new Error("Missing sender public key for type 1 envelope");const t=typeof i.senderPublicKey<"u"?Ce(i.senderPublicKey,vt):void 0,s=typeof i.iv<"u"?Ce(i.iv,vt):li.randomBytes(kr),r=new ys.ChaCha20Poly1305(Ce(i.symKey,vt)).seal(s,Ce(i.message,pn));return sp({type:e,sealed:r,iv:s,senderPublicKey:t})}function ip(i){const e=new ys.ChaCha20Poly1305(Ce(i.symKey,vt)),{sealed:t,iv:s}=Ys(i.encoded),r=e.open(s,t);if(r===null)throw new Error("Failed to decrypt");return Ne(r,pn)}function sp(i){if(vs(i.type)===Di){if(typeof i.senderPublicKey>"u")throw new Error("Missing sender public key for type 1 envelope");return Ne(ds([i.type,i.senderPublicKey,i.iv,i.sealed]),Br)}return Ne(ds([i.type,i.iv,i.sealed]),Br)}function Ys(i){const e=Ce(i,Br),t=e.slice(Jf,Po),s=Po;if(vs(t)===Di){const c=s+gn,u=c+kr,d=e.slice(s,c),p=e.slice(c,u),b=e.slice(u);return{type:t,sealed:b,iv:p,senderPublicKey:d}}const r=s+kr,n=e.slice(s,r),o=e.slice(r);return{type:t,sealed:o,iv:n}}function rp(i,e){const t=Ys(i);return $c({type:vs(t.type),senderPublicKey:typeof t.senderPublicKey<"u"?Ne(t.senderPublicKey,vt):void 0,receiverPublicKey:e?.receiverPublicKey})}function $c(i){const e=i?.type||Tc;if(e===Di){if(typeof i?.senderPublicKey>"u")throw new Error("missing sender public key");if(typeof i?.receiverPublicKey>"u")throw new Error("missing receiver public key")}return{type:e,senderPublicKey:i?.senderPublicKey,receiverPublicKey:i?.receiverPublicKey}}function Ro(i){return i.type===Di&&typeof i.senderPublicKey=="string"&&typeof i.receiverPublicKey=="string"}var np=Object.defineProperty,Co=Object.getOwnPropertySymbols,op=Object.prototype.hasOwnProperty,ap=Object.prototype.propertyIsEnumerable,Ao=(i,e,t)=>e in i?np(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,To=(i,e)=>{for(var t in e||(e={}))op.call(e,t)&&Ao(i,t,e[t]);if(Co)for(var t of Co(e))ap.call(e,t)&&Ao(i,t,e[t]);return i};const cp="ReactNative",Ot={reactNative:"react-native",node:"node",browser:"browser",unknown:"unknown"},hp="js";function yn(){return typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u"}function ur(){return!un()&&!!ws()&&navigator.product===cp}function _s(){return!yn()&&!!ws()}function Es(){return ur()?Ot.reactNative:yn()?Ot.node:_s()?Ot.browser:Ot.unknown}function up(i,e){let t=ii.parse(i);return t=To(To({},t),e),i=ii.stringify(t),i}function lp(){return fn()||{name:"",description:"",url:"",icons:[""]}}function dp(){if(Es()===Ot.reactNative&&typeof global<"u"&&typeof(global==null?void 0:global.Platform)<"u"){const{OS:t,Version:s}=global.Platform;return[t,s].join("-")}const i=hn();if(i===null)return"unknown";const e=i.os?i.os.replace(" ","").toLowerCase():"unknown";return i.type==="browser"?[e,i.name,i.version].join("-"):[e,i.version].join("-")}function fp(){var i;const e=Es();return e===Ot.browser?[e,((i=ln())==null?void 0:i.host)||"unknown"].join(":"):e}function pp(i,e,t){const s=dp(),r=fp();return[[i,e].join("-"),[hp,t].join("-"),s,r].join("/")}function gp({protocol:i,version:e,relayUrl:t,sdkVersion:s,auth:r,projectId:n,useOnCloseEvent:o}){const c=t.split("?"),u=pp(i,e,s),d={auth:r,ua:u,projectId:n,useOnCloseEvent:o||void 0},p=up(c[1]||"",d);return c[0]+"?"+p}function _i(i,e){return i.filter(t=>e.includes(t)).length===i.length}function Fc(i){return Object.fromEntries(i.entries())}function Uc(i){return new Map(Object.entries(i))}function Ai(i=V.FIVE_MINUTES,e){const t=V.toMiliseconds(i||V.FIVE_MINUTES);let s,r,n;return{resolve:o=>{n&&s&&(clearTimeout(n),s(o))},reject:o=>{n&&r&&(clearTimeout(n),r(o))},done:()=>new Promise((o,c)=>{n=setTimeout(()=>{c(new Error(e))},t),s=o,r=c})}}function fs(i,e,t){return new Promise(async(s,r)=>{const n=setTimeout(()=>r(new Error(t)),e);try{const o=await i;s(o)}catch(o){r(o)}clearTimeout(n)})}function Lc(i,e){if(typeof e=="string"&&e.startsWith(`${i}:`))return e;if(i.toLowerCase()==="topic"){if(typeof e!="string")throw new Error('Value must be "string" for expirer target type: topic');return`topic:${e}`}else if(i.toLowerCase()==="id"){if(typeof e!="number")throw new Error('Value must be "number" for expirer target type: id');return`id:${e}`}throw new Error(`Unknown expirer target type: ${i}`)}function yp(i){return Lc("topic",i)}function mp(i){return Lc("id",i)}function Mc(i){const[e,t]=i.split(":"),s={id:void 0,topic:void 0};if(e==="topic"&&typeof t=="string")s.topic=t;else if(e==="id"&&Number.isInteger(Number(t)))s.id=Number(t);else throw new Error(`Invalid target, expected id:number or topic:string, got ${e}:${t}`);return s}function Mt(i,e){return V.fromMiliseconds((e||Date.now())+V.toMiliseconds(i))}function ai(i){return Date.now()>=V.toMiliseconds(i)}function Be(i,e){return`${i}${e?`:${e}`:""}`}async function bp({id:i,topic:e,wcDeepLink:t}){try{if(!t)return;let r=(typeof t=="string"?JSON.parse(t):t)?.href;if(typeof r!="string")return;r.endsWith("/")&&(r=r.slice(0,-1));const n=`${r}/wc?requestId=${i}&sessionTopic=${e}`,o=Es();o===Ot.browser?n.startsWith("https://")?window.open(n,"_blank","noreferrer noopener"):window.open(n,"_self","noreferrer noopener"):o===Ot.reactNative&&typeof(global==null?void 0:global.Linking)<"u"&&await global.Linking.openURL(n)}catch(s){console.error(s)}}const wp="irn";function Gr(i){return i?.relay||{protocol:wp}}function js(i){const e=Rc[i];if(typeof e>"u")throw new Error(`Relay Protocol not supported: ${i}`);return e}var vp=Object.defineProperty,$o=Object.getOwnPropertySymbols,_p=Object.prototype.hasOwnProperty,Ep=Object.prototype.propertyIsEnumerable,Fo=(i,e,t)=>e in i?vp(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,Sp=(i,e)=>{for(var t in e||(e={}))_p.call(e,t)&&Fo(i,t,e[t]);if($o)for(var t of $o(e))Ep.call(e,t)&&Fo(i,t,e[t]);return i};function Ip(i,e="-"){const t={},s="relay"+e;return Object.keys(i).forEach(r=>{if(r.startsWith(s)){const n=r.replace(s,""),o=i[r];t[n]=o}}),t}function Dp(i){const e=i.indexOf(":"),t=i.indexOf("?")!==-1?i.indexOf("?"):void 0,s=i.substring(0,e),r=i.substring(e+1,t).split("@"),n=typeof t<"u"?i.substring(t):"",o=ii.parse(n);return{protocol:s,topic:xp(r[0]),version:parseInt(r[1],10),symKey:o.symKey,relay:Ip(o)}}function xp(i){return i.startsWith("//")?i.substring(2):i}function Op(i,e="-"){const t="relay",s={};return Object.keys(i).forEach(r=>{const n=t+e+r;i[r]&&(s[n]=i[r])}),s}function Np(i){return`${i.protocol}:${i.topic}@${i.version}?`+ii.stringify(Sp({symKey:i.symKey},Op(i.relay)))}function qi(i){const e=[];return i.forEach(t=>{const[s,r]=t.split(":");e.push(`${s}:${r}`)}),e}function Pp(i){const e=[];return Object.values(i).forEach(t=>{e.push(...qi(t.accounts))}),e}function Rp(i,e){const t=[];return Object.values(i).forEach(s=>{qi(s.accounts).includes(e)&&t.push(...s.methods)}),t}function Cp(i,e){const t=[];return Object.values(i).forEach(s=>{qi(s.accounts).includes(e)&&t.push(...s.events)}),t}function Ap(i,e){const t=zs(i,e);if(t)throw new Error(t.message);const s={};for(const[r,n]of Object.entries(i))s[r]={methods:n.methods,events:n.events,chains:n.accounts.map(o=>`${o.split(":")[0]}:${o.split(":")[1]}`)};return s}const Tp={INVALID_METHOD:{message:"Invalid method.",code:1001},INVALID_EVENT:{message:"Invalid event.",code:1002},INVALID_UPDATE_REQUEST:{message:"Invalid update request.",code:1003},INVALID_EXTEND_REQUEST:{message:"Invalid extend request.",code:1004},INVALID_SESSION_SETTLE_REQUEST:{message:"Invalid session settle request.",code:1005},UNAUTHORIZED_METHOD:{message:"Unauthorized method.",code:3001},UNAUTHORIZED_EVENT:{message:"Unauthorized event.",code:3002},UNAUTHORIZED_UPDATE_REQUEST:{message:"Unauthorized update request.",code:3003},UNAUTHORIZED_EXTEND_REQUEST:{message:"Unauthorized extend request.",code:3004},USER_REJECTED:{message:"User rejected.",code:5e3},USER_REJECTED_CHAINS:{message:"User rejected chains.",code:5001},USER_REJECTED_METHODS:{message:"User rejected methods.",code:5002},USER_REJECTED_EVENTS:{message:"User rejected events.",code:5003},UNSUPPORTED_CHAINS:{message:"Unsupported chains.",code:5100},UNSUPPORTED_METHODS:{message:"Unsupported methods.",code:5101},UNSUPPORTED_EVENTS:{message:"Unsupported events.",code:5102},UNSUPPORTED_ACCOUNTS:{message:"Unsupported accounts.",code:5103},UNSUPPORTED_NAMESPACE_KEY:{message:"Unsupported namespace key.",code:5104},USER_DISCONNECTED:{message:"User disconnected.",code:6e3},SESSION_SETTLEMENT_FAILED:{message:"Session settlement failed.",code:7e3},WC_METHOD_UNSUPPORTED:{message:"Unsupported wc_ method.",code:10001}},$p={NOT_INITIALIZED:{message:"Not initialized.",code:1},NO_MATCHING_KEY:{message:"No matching key.",code:2},RESTORE_WILL_OVERRIDE:{message:"Restore will override.",code:3},RESUBSCRIBED:{message:"Resubscribed.",code:4},MISSING_OR_INVALID:{message:"Missing or invalid.",code:5},EXPIRED:{message:"Expired.",code:6},UNKNOWN_TYPE:{message:"Unknown type.",code:7},MISMATCHED_TOPIC:{message:"Mismatched topic.",code:8},NON_CONFORMING_NAMESPACES:{message:"Non conforming namespaces.",code:9}};function Y(i,e){const{message:t,code:s}=$p[i];return{message:e?`${t} ${e}`:t,code:s}}function ot(i,e){const{message:t,code:s}=Tp[i];return{message:e?`${t} ${e}`:t,code:s}}function Ss(i,e){return Array.isArray(i)?typeof e<"u"&&i.length?i.every(e):!0:!1}function hs(i){return Object.getPrototypeOf(i)===Object.prototype&&Object.keys(i).length}function bt(i){return typeof i>"u"}function at(i,e){return e&&bt(i)?!0:typeof i=="string"&&!!i.trim().length}function mn(i,e){return e&&bt(i)?!0:typeof i=="number"&&!isNaN(i)}function Fp(i,e){const{requiredNamespaces:t}=e,s=Object.keys(i.namespaces),r=Object.keys(t);let n=!0;return _i(r,s)?(s.forEach(o=>{const{accounts:c,methods:u,events:d}=i.namespaces[o],p=qi(c),b=t[o];(!_i(Cc(o,b),p)||!_i(b.methods,u)||!_i(b.events,d))&&(n=!1)}),n):!1}function Js(i){return at(i,!1)&&i.includes(":")?i.split(":").length===2:!1}function Up(i){if(at(i,!1)&&i.includes(":")){const e=i.split(":");if(e.length===3){const t=e[0]+":"+e[1];return!!e[2]&&Js(t)}}return!1}function Lp(i){if(at(i,!1))try{return typeof new URL(i)<"u"}catch{return!1}return!1}function Mp(i){var e;return(e=i?.proposer)==null?void 0:e.publicKey}function qp(i){return i?.topic}function jp(i,e){let t=null;return at(i?.publicKey,!1)||(t=Y("MISSING_OR_INVALID",`${e} controller public key should be a string`)),t}function Uo(i){let e=!0;return Ss(i)?i.length&&(e=i.every(t=>at(t,!1))):e=!1,e}function zp(i,e,t){let s=null;return Ss(e)&&e.length?e.forEach(r=>{s||Js(r)||(s=ot("UNSUPPORTED_CHAINS",`${t}, chain ${r} should be a string and conform to "namespace:chainId" format`))}):Js(i)||(s=ot("UNSUPPORTED_CHAINS",`${t}, chains must be defined as "namespace:chainId" e.g. "eip155:1": {...} in the namespace key OR as an array of CAIP-2 chainIds e.g. eip155: { chains: ["eip155:1", "eip155:5"] }`)),s}function Kp(i,e,t){let s=null;return Object.entries(i).forEach(([r,n])=>{if(s)return;const o=zp(r,Cc(r,n),`${e} ${t}`);o&&(s=o)}),s}function Vp(i,e){let t=null;return Ss(i)?i.forEach(s=>{t||Up(s)||(t=ot("UNSUPPORTED_ACCOUNTS",`${e}, account ${s} should be a string and conform to "namespace:chainId:address" format`))}):t=ot("UNSUPPORTED_ACCOUNTS",`${e}, accounts should be an array of strings conforming to "namespace:chainId:address" format`),t}function Bp(i,e){let t=null;return Object.values(i).forEach(s=>{if(t)return;const r=Vp(s?.accounts,`${e} namespace`);r&&(t=r)}),t}function kp(i,e){let t=null;return Uo(i?.methods)?Uo(i?.events)||(t=ot("UNSUPPORTED_EVENTS",`${e}, events should be an array of strings or empty array for no events`)):t=ot("UNSUPPORTED_METHODS",`${e}, methods should be an array of strings or empty array for no methods`),t}function qc(i,e){let t=null;return Object.values(i).forEach(s=>{if(t)return;const r=kp(s,`${e}, namespace`);r&&(t=r)}),t}function Hp(i,e,t){let s=null;if(i&&hs(i)){const r=qc(i,e);r&&(s=r);const n=Kp(i,e,t);n&&(s=n)}else s=Y("MISSING_OR_INVALID",`${e}, ${t} should be an object with data`);return s}function zs(i,e){let t=null;if(i&&hs(i)){const s=qc(i,e);s&&(t=s);const r=Bp(i,e);r&&(t=r)}else t=Y("MISSING_OR_INVALID",`${e}, namespaces should be an object with data`);return t}function jc(i){return at(i.protocol,!0)}function Gp(i,e){let t=!1;return e&&!i?t=!0:i&&Ss(i)&&i.length&&i.forEach(s=>{t=jc(s)}),t}function Wp(i){return typeof i=="number"}function St(i){return typeof i<"u"&&typeof i!==null}function Yp(i){return!(!i||typeof i!="object"||!i.code||!mn(i.code,!1)||!i.message||!at(i.message,!1))}function Jp(i){return!(bt(i)||!at(i.method,!1))}function Qp(i){return!(bt(i)||bt(i.result)&&bt(i.error)||!mn(i.id,!1)||!at(i.jsonrpc,!1))}function Xp(i){return!(bt(i)||!at(i.name,!1))}function Lo(i,e){return!(!Js(e)||!Pp(i).includes(e))}function Zp(i,e,t){return at(t,!1)?Rp(i,e).includes(t):!1}function eg(i,e,t){return at(t,!1)?Cp(i,e).includes(t):!1}function Mo(i,e,t){let s=null;const r=tg(i),n=ig(e),o=Object.keys(r),c=Object.keys(n),u=qo(Object.keys(i)),d=qo(Object.keys(e)),p=u.filter(b=>!d.includes(b));return p.length&&(s=Y("NON_CONFORMING_NAMESPACES",`${t} namespaces keys don't satisfy requiredNamespaces.
      Required: ${p.toString()}
      Received: ${Object.keys(e).toString()}`)),_i(o,c)||(s=Y("NON_CONFORMING_NAMESPACES",`${t} namespaces chains don't satisfy required namespaces.
      Required: ${o.toString()}
      Approved: ${c.toString()}`)),Object.keys(e).forEach(b=>{if(!b.includes(":")||s)return;const x=qi(e[b].accounts);x.includes(b)||(s=Y("NON_CONFORMING_NAMESPACES",`${t} namespaces accounts don't satisfy namespace accounts for ${b}
        Required: ${b}
        Approved: ${x.toString()}`))}),o.forEach(b=>{s||(_i(r[b].methods,n[b].methods)?_i(r[b].events,n[b].events)||(s=Y("NON_CONFORMING_NAMESPACES",`${t} namespaces events don't satisfy namespace events for ${b}`)):s=Y("NON_CONFORMING_NAMESPACES",`${t} namespaces methods don't satisfy namespace methods for ${b}`))}),s}function tg(i){const e={};return Object.keys(i).forEach(t=>{var s;t.includes(":")?e[t]=i[t]:(s=i[t].chains)==null||s.forEach(r=>{e[r]={methods:i[t].methods,events:i[t].events}})}),e}function qo(i){return[...new Set(i.map(e=>e.includes(":")?e.split(":")[0]:e))]}function ig(i){const e={};return Object.keys(i).forEach(t=>{t.includes(":")?e[t]=i[t]:qi(i[t].accounts)?.forEach(r=>{e[r]={accounts:i[t].accounts.filter(n=>n.includes(`${r}:`)),methods:i[t].methods,events:i[t].events}})}),e}function sg(i,e){return mn(i,!1)&&i<=e.max&&i>=e.min}function jo(){const i=Es();return new Promise(e=>{switch(i){case Ot.browser:e(rg());break;case Ot.reactNative:e(ng());break;case Ot.node:e(og());break;default:e(!0)}})}function rg(){return _s()&&navigator?.onLine}async function ng(){return ur()&&typeof global<"u"&&global!=null&&global.NetInfo?(await(global==null?void 0:global.NetInfo.fetch()))?.isConnected:!0}function og(){return!0}function ag(i){switch(Es()){case Ot.browser:cg(i);break;case Ot.reactNative:hg(i);break}}function cg(i){_s()&&(window.addEventListener("online",()=>i(!0)),window.addEventListener("offline",()=>i(!1)))}function hg(i){ur()&&typeof global<"u"&&global!=null&&global.NetInfo&&global?.NetInfo.addEventListener(e=>i(e?.isConnected))}const xr={};let Fs=class{static get(e){return xr[e]}static set(e,t){xr[e]=t}static delete(e){delete xr[e]}};const ug="PARSE_ERROR",lg="INVALID_REQUEST",dg="METHOD_NOT_FOUND",fg="INVALID_PARAMS",zc="INTERNAL_ERROR",bn="SERVER_ERROR",pg=[-32700,-32600,-32601,-32602,-32603],us={[ug]:{code:-32700,message:"Parse error"},[lg]:{code:-32600,message:"Invalid Request"},[dg]:{code:-32601,message:"Method not found"},[fg]:{code:-32602,message:"Invalid params"},[zc]:{code:-32603,message:"Internal error"},[bn]:{code:-32e3,message:"Server error"}},Kc=bn;function gg(i){return pg.includes(i)}function zo(i){return Object.keys(us).includes(i)?us[i]:us[Kc]}function yg(i){const e=Object.values(us).find(t=>t.code===i);return e||us[Kc]}function mg(i,e,t){return i.message.includes("getaddrinfo ENOTFOUND")||i.message.includes("connect ECONNREFUSED")?new Error(`Unavailable ${t} RPC url at ${e}`):i}var Vc={},Qt={},Ko;function bg(){if(Ko)return Qt;Ko=1,Object.defineProperty(Qt,"__esModule",{value:!0}),Qt.isBrowserCryptoAvailable=Qt.getSubtleCrypto=Qt.getBrowerCrypto=void 0;function i(){return(Qe.commonjsGlobal===null||Qe.commonjsGlobal===void 0?void 0:Qe.commonjsGlobal.crypto)||(Qe.commonjsGlobal===null||Qe.commonjsGlobal===void 0?void 0:Qe.commonjsGlobal.msCrypto)||{}}Qt.getBrowerCrypto=i;function e(){const s=i();return s.subtle||s.webkitSubtle}Qt.getSubtleCrypto=e;function t(){return!!i()&&!!e()}return Qt.isBrowserCryptoAvailable=t,Qt}var Xt={},Vo;function wg(){if(Vo)return Xt;Vo=1,Object.defineProperty(Xt,"__esModule",{value:!0}),Xt.isBrowser=Xt.isNode=Xt.isReactNative=void 0;function i(){return typeof document>"u"&&typeof navigator<"u"&&navigator.product==="ReactNative"}Xt.isReactNative=i;function e(){return typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u"}Xt.isNode=e;function t(){return!i()&&!e()}return Xt.isBrowser=t,Xt}(function(i){Object.defineProperty(i,"__esModule",{value:!0});const e=Ft;e.__exportStar(bg(),i),e.__exportStar(wg(),i)})(Vc);function wn(i=3){const e=Date.now()*Math.pow(10,i),t=Math.floor(Math.random()*Math.pow(10,i));return e+t}function vn(i=6){return BigInt(wn(i))}function ti(i,e,t){return{id:t||wn(),jsonrpc:"2.0",method:i,params:e}}function xi(i,e){return{id:i,jsonrpc:"2.0",result:e}}function ji(i,e,t){return{id:i,jsonrpc:"2.0",error:vg(e,t)}}function vg(i,e){return typeof i>"u"?zo(zc):(typeof i=="string"&&(i=Object.assign(Object.assign({},zo(bn)),{message:i})),typeof e<"u"&&(i.data=e),gg(i.code)&&(i=yg(i.code)),i)}class Bc{}class _g extends Bc{constructor(e){super()}}class Eg extends Bc{constructor(){super()}}class Sg extends Eg{constructor(e){super()}}const Ig="^wss?:";function Dg(i){const e=i.match(new RegExp(/^\w+:/,"gi"));if(!(!e||!e.length))return e[0]}function xg(i,e){const t=Dg(i);return typeof t>"u"?!1:new RegExp(e).test(t)}function Bo(i){return xg(i,Ig)}function Og(i){return new RegExp("wss?://localhost(:d{2,5})?").test(i)}function kc(i){return typeof i=="object"&&"id"in i&&"jsonrpc"in i&&i.jsonrpc==="2.0"}function zi(i){return kc(i)&&"method"in i}function Oi(i){return kc(i)&&(ut(i)||Ge(i))}function ut(i){return"result"in i}function Ge(i){return"error"in i}class _n extends Sg{constructor(e){super(e),this.events=new We.EventEmitter,this.hasRegisteredEventListeners=!1,this.connection=this.setConnection(e),this.connection.connected&&this.registerEventListeners()}async connect(e=this.connection){await this.open(e)}async disconnect(){await this.close()}on(e,t){this.events.on(e,t)}once(e,t){this.events.once(e,t)}off(e,t){this.events.off(e,t)}removeListener(e,t){this.events.removeListener(e,t)}async request(e,t){return this.requestStrict(ti(e.method,e.params||[],e.id||vn().toString()),t)}async requestStrict(e,t){return new Promise(async(s,r)=>{if(!this.connection.connected)try{await this.open()}catch(n){r(n)}this.events.on(`${e.id}`,n=>{Ge(n)?r(n.error):s(n.result)});try{await this.connection.send(e,t)}catch(n){r(n)}})}setConnection(e=this.connection){return e}onPayload(e){this.events.emit("payload",e),Oi(e)?this.events.emit(`${e.id}`,e):this.events.emit("message",{type:e.method,data:e.params})}onClose(e){e&&e.code===3e3&&this.events.emit("error",new Error(`WebSocket connection closed abnormally with code: ${e.code} ${e.reason?`(${e.reason})`:""}`)),this.events.emit("disconnect")}async open(e=this.connection){this.connection===e&&this.connection.connected||(this.connection.connected&&this.close(),typeof e=="string"&&(await this.connection.open(e),e=this.connection),this.connection=this.setConnection(e),await this.connection.open(),this.registerEventListeners(),this.events.emit("connect"))}async close(){await this.connection.close()}registerEventListeners(){this.hasRegisteredEventListeners||(this.connection.on("payload",e=>this.onPayload(e)),this.connection.on("close",e=>this.onClose(e)),this.connection.on("error",e=>this.events.emit("error",e)),this.connection.on("register_error",e=>this.onClose()),this.hasRegisteredEventListeners=!0)}}const Ng=()=>typeof WebSocket<"u"?WebSocket:typeof global<"u"&&typeof global.WebSocket<"u"?global.WebSocket:typeof window<"u"&&typeof window.WebSocket<"u"?window.WebSocket:typeof self<"u"&&typeof self.WebSocket<"u"?self.WebSocket:require("ws"),Pg=()=>typeof WebSocket<"u"||typeof global<"u"&&typeof global.WebSocket<"u"||typeof window<"u"&&typeof window.WebSocket<"u"||typeof self<"u"&&typeof self.WebSocket<"u",ko=i=>i.split("?")[0],Ho=10,Rg=Ng();class Hc{constructor(e){if(this.url=e,this.events=new We.EventEmitter,this.registering=!1,!Bo(e))throw new Error(`Provided URL is not compatible with WebSocket connection: ${e}`);this.url=e}get connected(){return typeof this.socket<"u"}get connecting(){return this.registering}on(e,t){this.events.on(e,t)}once(e,t){this.events.once(e,t)}off(e,t){this.events.off(e,t)}removeListener(e,t){this.events.removeListener(e,t)}async open(e=this.url){await this.register(e)}async close(){return new Promise((e,t)=>{if(typeof this.socket>"u"){t(new Error("Connection already closed"));return}this.socket.onclose=s=>{this.onClose(s),e()},this.socket.close()})}async send(e,t){typeof this.socket>"u"&&(this.socket=await this.register());try{this.socket.send(rr(e))}catch(s){this.onError(e.id,s)}}register(e=this.url){if(!Bo(e))throw new Error(`Provided URL is not compatible with WebSocket connection: ${e}`);if(this.registering){const t=this.events.getMaxListeners();return(this.events.listenerCount("register_error")>=t||this.events.listenerCount("open")>=t)&&this.events.setMaxListeners(t+1),new Promise((s,r)=>{this.events.once("register_error",n=>{this.resetMaxListeners(),r(n)}),this.events.once("open",()=>{if(this.resetMaxListeners(),typeof this.socket>"u")return r(new Error("WebSocket connection is missing or invalid"));s(this.socket)})})}return this.url=e,this.registering=!0,new Promise((t,s)=>{const r=Vc.isReactNative()?void 0:{rejectUnauthorized:!Og(e)},n=new Rg(e,[],r);Pg()?n.onerror=o=>{const c=o;s(this.emitError(c.error))}:n.on("error",o=>{s(this.emitError(o))}),n.onopen=()=>{this.onOpen(n),t(n)}})}onOpen(e){e.onmessage=t=>this.onPayload(t),e.onclose=t=>this.onClose(t),this.socket=e,this.registering=!1,this.events.emit("open")}onClose(e){this.socket=void 0,this.registering=!1,this.events.emit("close",e)}onPayload(e){if(typeof e.data>"u")return;const t=typeof e.data=="string"?rn(e.data):e.data;this.events.emit("payload",t)}onError(e,t){const s=this.parseError(t),r=s.message||s.toString(),n=ji(e,r);this.events.emit("payload",n)}parseError(e,t=this.url){return mg(e,ko(t),"WS")}resetMaxListeners(){this.events.getMaxListeners()>Ho&&this.events.setMaxListeners(Ho)}emitError(e){const t=this.parseError(new Error(e?.message||`WebSocket connection failed for host: ${ko(this.url)}`));return this.events.emit("register_error",t),t}}var Qs={exports:{}};Qs.exports;(function(i,e){var t=200,s="__lodash_hash_undefined__",r=1,n=2,o=9007199254740991,c="[object Arguments]",u="[object Array]",d="[object AsyncFunction]",p="[object Boolean]",b="[object Date]",x="[object Error]",O="[object Function]",_="[object GeneratorFunction]",C="[object Map]",F="[object Number]",K="[object Null]",I="[object Object]",D="[object Promise]",y="[object Proxy]",w="[object RegExp]",f="[object Set]",a="[object String]",l="[object Symbol]",L="[object Undefined]",v="[object WeakMap]",R="[object ArrayBuffer]",$="[object DataView]",q="[object Float32Array]",m="[object Float64Array]",E="[object Int8Array]",B="[object Int16Array]",z="[object Int32Array]",j="[object Uint8Array]",U="[object Uint8ClampedArray]",M="[object Uint16Array]",H="[object Uint32Array]",te=/[\\^$.*+?()[\]{}|]/g,G=/^\[object .+?Constructor\]$/,ie=/^(?:0|[1-9]\d*)$/,Q={};Q[q]=Q[m]=Q[E]=Q[B]=Q[z]=Q[j]=Q[U]=Q[M]=Q[H]=!0,Q[c]=Q[u]=Q[R]=Q[p]=Q[$]=Q[b]=Q[x]=Q[O]=Q[C]=Q[F]=Q[I]=Q[w]=Q[f]=Q[a]=Q[v]=!1;var se=typeof Qe.commonjsGlobal=="object"&&Qe.commonjsGlobal&&Qe.commonjsGlobal.Object===Object&&Qe.commonjsGlobal,T=typeof self=="object"&&self&&self.Object===Object&&self,A=se||T||Function("return this")(),N=e&&!e.nodeType&&e,h=N&&!0&&i&&!i.nodeType&&i,S=h&&h.exports===N,W=S&&se.process,X=function(){try{return W&&W.binding&&W.binding("util")}catch{}}(),fe=X&&X.isTypedArray;function ve(g,P){for(var k=-1,Z=g==null?0:g.length,Re=0,ae=[];++k<Z;){var Le=g[k];P(Le,k,g)&&(ae[Re++]=Le)}return ae}function ge(g,P){for(var k=-1,Z=P.length,Re=g.length;++k<Z;)g[Re+k]=P[k];return g}function Se(g,P){for(var k=-1,Z=g==null?0:g.length;++k<Z;)if(P(g[k],k,g))return!0;return!1}function Me(g,P){for(var k=-1,Z=Array(g);++k<g;)Z[k]=P(k);return Z}function $e(g){return function(P){return g(P)}}function be(g,P){return g.has(P)}function ye(g,P){return g?.[P]}function pe(g){var P=-1,k=Array(g.size);return g.forEach(function(Z,Re){k[++P]=[Re,Z]}),k}function le(g,P){return function(k){return g(P(k))}}function ue(g){var P=-1,k=Array(g.size);return g.forEach(function(Z){k[++P]=Z}),k}var he=Array.prototype,ce=Function.prototype,re=Object.prototype,de=A["__core-js_shared__"],me=ce.toString,ne=re.hasOwnProperty,_e=function(){var g=/[^.]+$/.exec(de&&de.keys&&de.keys.IE_PROTO||"");return g?"Symbol(src)_1."+g:""}(),Ee=re.toString,De=RegExp("^"+me.call(ne).replace(te,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),xe=S?A.Buffer:void 0,Ie=A.Symbol,Ut=A.Uint8Array,qt=re.propertyIsEnumerable,si=he.splice,Dt=Ie?Ie.toStringTag:void 0,fi=Object.getOwnPropertySymbols,Vi=xe?xe.isBuffer:void 0,Ns=le(Object.keys,Object),qe=Pi(A,"DataView"),Fe=Pi(A,"Map"),je=Pi(A,"Promise"),ze=Pi(A,"Set"),Ke=Pi(A,"WeakMap"),Ue=Pi(Object,"create"),Xe=gi(qe),Ze=gi(Fe),et=gi(je),tt=gi(ze),it=gi(Ke),Ye=Ie?Ie.prototype:void 0,Ve=Ye?Ye.valueOf:void 0;function Ae(g){var P=-1,k=g==null?0:g.length;for(this.clear();++P<k;){var Z=g[P];this.set(Z[0],Z[1])}}function st(){this.__data__=Ue?Ue(null):{},this.size=0}function rt(g){var P=this.has(g)&&delete this.__data__[g];return this.size-=P?1:0,P}function Vh(g){var P=this.__data__;if(Ue){var k=P[g];return k===s?void 0:k}return ne.call(P,g)?P[g]:void 0}function Bh(g){var P=this.__data__;return Ue?P[g]!==void 0:ne.call(P,g)}function kh(g,P){var k=this.__data__;return this.size+=this.has(g)?0:1,k[g]=Ue&&P===void 0?s:P,this}Ae.prototype.clear=st,Ae.prototype.delete=rt,Ae.prototype.get=Vh,Ae.prototype.has=Bh,Ae.prototype.set=kh;function Yt(g){var P=-1,k=g==null?0:g.length;for(this.clear();++P<k;){var Z=g[P];this.set(Z[0],Z[1])}}function Hh(){this.__data__=[],this.size=0}function Gh(g){var P=this.__data__,k=Rs(P,g);if(k<0)return!1;var Z=P.length-1;return k==Z?P.pop():si.call(P,k,1),--this.size,!0}function Wh(g){var P=this.__data__,k=Rs(P,g);return k<0?void 0:P[k][1]}function Yh(g){return Rs(this.__data__,g)>-1}function Jh(g,P){var k=this.__data__,Z=Rs(k,g);return Z<0?(++this.size,k.push([g,P])):k[Z][1]=P,this}Yt.prototype.clear=Hh,Yt.prototype.delete=Gh,Yt.prototype.get=Wh,Yt.prototype.has=Yh,Yt.prototype.set=Jh;function pi(g){var P=-1,k=g==null?0:g.length;for(this.clear();++P<k;){var Z=g[P];this.set(Z[0],Z[1])}}function Qh(){this.size=0,this.__data__={hash:new Ae,map:new(Fe||Yt),string:new Ae}}function Xh(g){var P=Cs(this,g).delete(g);return this.size-=P?1:0,P}function Zh(g){return Cs(this,g).get(g)}function eu(g){return Cs(this,g).has(g)}function tu(g,P){var k=Cs(this,g),Z=k.size;return k.set(g,P),this.size+=k.size==Z?0:1,this}pi.prototype.clear=Qh,pi.prototype.delete=Xh,pi.prototype.get=Zh,pi.prototype.has=eu,pi.prototype.set=tu;function Ps(g){var P=-1,k=g==null?0:g.length;for(this.__data__=new pi;++P<k;)this.add(g[P])}function iu(g){return this.__data__.set(g,s),this}function su(g){return this.__data__.has(g)}Ps.prototype.add=Ps.prototype.push=iu,Ps.prototype.has=su;function ri(g){var P=this.__data__=new Yt(g);this.size=P.size}function ru(){this.__data__=new Yt,this.size=0}function nu(g){var P=this.__data__,k=P.delete(g);return this.size=P.size,k}function ou(g){return this.__data__.get(g)}function au(g){return this.__data__.has(g)}function cu(g,P){var k=this.__data__;if(k instanceof Yt){var Z=k.__data__;if(!Fe||Z.length<t-1)return Z.push([g,P]),this.size=++k.size,this;k=this.__data__=new pi(Z)}return k.set(g,P),this.size=k.size,this}ri.prototype.clear=ru,ri.prototype.delete=nu,ri.prototype.get=ou,ri.prototype.has=au,ri.prototype.set=cu;function hu(g,P){var k=As(g),Z=!k&&Iu(g),Re=!k&&!Z&&gr(g),ae=!k&&!Z&&!Re&&Kn(g),Le=k||Z||Re||ae,nt=Le?Me(g.length,String):[],ht=nt.length;for(var Te in g)(P||ne.call(g,Te))&&!(Le&&(Te=="length"||Re&&(Te=="offset"||Te=="parent")||ae&&(Te=="buffer"||Te=="byteLength"||Te=="byteOffset")||wu(Te,ht)))&&nt.push(Te);return nt}function Rs(g,P){for(var k=g.length;k--;)if(Mn(g[k][0],P))return k;return-1}function uu(g,P,k){var Z=P(g);return As(g)?Z:ge(Z,k(g))}function Bi(g){return g==null?g===void 0?L:K:Dt&&Dt in Object(g)?mu(g):Su(g)}function $n(g){return ki(g)&&Bi(g)==c}function Fn(g,P,k,Z,Re){return g===P?!0:g==null||P==null||!ki(g)&&!ki(P)?g!==g&&P!==P:lu(g,P,k,Z,Fn,Re)}function lu(g,P,k,Z,Re,ae){var Le=As(g),nt=As(P),ht=Le?u:ni(g),Te=nt?u:ni(P);ht=ht==c?I:ht,Te=Te==c?I:Te;var xt=ht==I,Lt=Te==I,pt=ht==Te;if(pt&&gr(g)){if(!gr(P))return!1;Le=!0,xt=!1}if(pt&&!xt)return ae||(ae=new ri),Le||Kn(g)?Un(g,P,k,Z,Re,ae):gu(g,P,ht,k,Z,Re,ae);if(!(k&r)){var Rt=xt&&ne.call(g,"__wrapped__"),Ct=Lt&&ne.call(P,"__wrapped__");if(Rt||Ct){var oi=Rt?g.value():g,Jt=Ct?P.value():P;return ae||(ae=new ri),Re(oi,Jt,k,Z,ae)}}return pt?(ae||(ae=new ri),yu(g,P,k,Z,Re,ae)):!1}function du(g){if(!zn(g)||_u(g))return!1;var P=qn(g)?De:G;return P.test(gi(g))}function fu(g){return ki(g)&&jn(g.length)&&!!Q[Bi(g)]}function pu(g){if(!Eu(g))return Ns(g);var P=[];for(var k in Object(g))ne.call(g,k)&&k!="constructor"&&P.push(k);return P}function Un(g,P,k,Z,Re,ae){var Le=k&r,nt=g.length,ht=P.length;if(nt!=ht&&!(Le&&ht>nt))return!1;var Te=ae.get(g);if(Te&&ae.get(P))return Te==P;var xt=-1,Lt=!0,pt=k&n?new Ps:void 0;for(ae.set(g,P),ae.set(P,g);++xt<nt;){var Rt=g[xt],Ct=P[xt];if(Z)var oi=Le?Z(Ct,Rt,xt,P,g,ae):Z(Rt,Ct,xt,g,P,ae);if(oi!==void 0){if(oi)continue;Lt=!1;break}if(pt){if(!Se(P,function(Jt,yi){if(!be(pt,yi)&&(Rt===Jt||Re(Rt,Jt,k,Z,ae)))return pt.push(yi)})){Lt=!1;break}}else if(!(Rt===Ct||Re(Rt,Ct,k,Z,ae))){Lt=!1;break}}return ae.delete(g),ae.delete(P),Lt}function gu(g,P,k,Z,Re,ae,Le){switch(k){case $:if(g.byteLength!=P.byteLength||g.byteOffset!=P.byteOffset)return!1;g=g.buffer,P=P.buffer;case R:return!(g.byteLength!=P.byteLength||!ae(new Ut(g),new Ut(P)));case p:case b:case F:return Mn(+g,+P);case x:return g.name==P.name&&g.message==P.message;case w:case a:return g==P+"";case C:var nt=pe;case f:var ht=Z&r;if(nt||(nt=ue),g.size!=P.size&&!ht)return!1;var Te=Le.get(g);if(Te)return Te==P;Z|=n,Le.set(g,P);var xt=Un(nt(g),nt(P),Z,Re,ae,Le);return Le.delete(g),xt;case l:if(Ve)return Ve.call(g)==Ve.call(P)}return!1}function yu(g,P,k,Z,Re,ae){var Le=k&r,nt=Ln(g),ht=nt.length,Te=Ln(P),xt=Te.length;if(ht!=xt&&!Le)return!1;for(var Lt=ht;Lt--;){var pt=nt[Lt];if(!(Le?pt in P:ne.call(P,pt)))return!1}var Rt=ae.get(g);if(Rt&&ae.get(P))return Rt==P;var Ct=!0;ae.set(g,P),ae.set(P,g);for(var oi=Le;++Lt<ht;){pt=nt[Lt];var Jt=g[pt],yi=P[pt];if(Z)var Vn=Le?Z(yi,Jt,pt,P,g,ae):Z(Jt,yi,pt,g,P,ae);if(!(Vn===void 0?Jt===yi||Re(Jt,yi,k,Z,ae):Vn)){Ct=!1;break}oi||(oi=pt=="constructor")}if(Ct&&!oi){var Ts=g.constructor,$s=P.constructor;Ts!=$s&&"constructor"in g&&"constructor"in P&&!(typeof Ts=="function"&&Ts instanceof Ts&&typeof $s=="function"&&$s instanceof $s)&&(Ct=!1)}return ae.delete(g),ae.delete(P),Ct}function Ln(g){return uu(g,Ou,bu)}function Cs(g,P){var k=g.__data__;return vu(P)?k[typeof P=="string"?"string":"hash"]:k.map}function Pi(g,P){var k=ye(g,P);return du(k)?k:void 0}function mu(g){var P=ne.call(g,Dt),k=g[Dt];try{g[Dt]=void 0;var Z=!0}catch{}var Re=Ee.call(g);return Z&&(P?g[Dt]=k:delete g[Dt]),Re}var bu=fi?function(g){return g==null?[]:(g=Object(g),ve(fi(g),function(P){return qt.call(g,P)}))}:Nu,ni=Bi;(qe&&ni(new qe(new ArrayBuffer(1)))!=$||Fe&&ni(new Fe)!=C||je&&ni(je.resolve())!=D||ze&&ni(new ze)!=f||Ke&&ni(new Ke)!=v)&&(ni=function(g){var P=Bi(g),k=P==I?g.constructor:void 0,Z=k?gi(k):"";if(Z)switch(Z){case Xe:return $;case Ze:return C;case et:return D;case tt:return f;case it:return v}return P});function wu(g,P){return P=P??o,!!P&&(typeof g=="number"||ie.test(g))&&g>-1&&g%1==0&&g<P}function vu(g){var P=typeof g;return P=="string"||P=="number"||P=="symbol"||P=="boolean"?g!=="__proto__":g===null}function _u(g){return!!_e&&_e in g}function Eu(g){var P=g&&g.constructor,k=typeof P=="function"&&P.prototype||re;return g===k}function Su(g){return Ee.call(g)}function gi(g){if(g!=null){try{return me.call(g)}catch{}try{return g+""}catch{}}return""}function Mn(g,P){return g===P||g!==g&&P!==P}var Iu=$n(function(){return arguments}())?$n:function(g){return ki(g)&&ne.call(g,"callee")&&!qt.call(g,"callee")},As=Array.isArray;function Du(g){return g!=null&&jn(g.length)&&!qn(g)}var gr=Vi||Pu;function xu(g,P){return Fn(g,P)}function qn(g){if(!zn(g))return!1;var P=Bi(g);return P==O||P==_||P==d||P==y}function jn(g){return typeof g=="number"&&g>-1&&g%1==0&&g<=o}function zn(g){var P=typeof g;return g!=null&&(P=="object"||P=="function")}function ki(g){return g!=null&&typeof g=="object"}var Kn=fe?$e(fe):fu;function Ou(g){return Du(g)?hu(g):pu(g)}function Nu(){return[]}function Pu(){return!1}i.exports=xu})(Qs,Qs.exports);var Cg=Qs.exports;const Gc=Qe.getDefaultExportFromCjs(Cg);function Ag(i,e){if(i.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),s=0;s<t.length;s++)t[s]=255;for(var r=0;r<i.length;r++){var n=i.charAt(r),o=n.charCodeAt(0);if(t[o]!==255)throw new TypeError(n+" is ambiguous");t[o]=r}var c=i.length,u=i.charAt(0),d=Math.log(c)/Math.log(256),p=Math.log(256)/Math.log(c);function b(_){if(_ instanceof Uint8Array||(ArrayBuffer.isView(_)?_=new Uint8Array(_.buffer,_.byteOffset,_.byteLength):Array.isArray(_)&&(_=Uint8Array.from(_))),!(_ instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(_.length===0)return"";for(var C=0,F=0,K=0,I=_.length;K!==I&&_[K]===0;)K++,C++;for(var D=(I-K)*p+1>>>0,y=new Uint8Array(D);K!==I;){for(var w=_[K],f=0,a=D-1;(w!==0||f<F)&&a!==-1;a--,f++)w+=256*y[a]>>>0,y[a]=w%c>>>0,w=w/c>>>0;if(w!==0)throw new Error("Non-zero carry");F=f,K++}for(var l=D-F;l!==D&&y[l]===0;)l++;for(var L=u.repeat(C);l<D;++l)L+=i.charAt(y[l]);return L}function x(_){if(typeof _!="string")throw new TypeError("Expected String");if(_.length===0)return new Uint8Array;var C=0;if(_[C]!==" "){for(var F=0,K=0;_[C]===u;)F++,C++;for(var I=(_.length-C)*d+1>>>0,D=new Uint8Array(I);_[C];){var y=t[_.charCodeAt(C)];if(y===255)return;for(var w=0,f=I-1;(y!==0||w<K)&&f!==-1;f--,w++)y+=c*D[f]>>>0,D[f]=y%256>>>0,y=y/256>>>0;if(y!==0)throw new Error("Non-zero carry");K=w,C++}if(_[C]!==" "){for(var a=I-K;a!==I&&D[a]===0;)a++;for(var l=new Uint8Array(F+(I-a)),L=F;a!==I;)l[L++]=D[a++];return l}}}function O(_){var C=x(_);if(C)return C;throw new Error(`Non-${e} character`)}return{encode:b,decodeUnsafe:x,decode:O}}var Tg=Ag,$g=Tg;const Wc=i=>{if(i instanceof Uint8Array&&i.constructor.name==="Uint8Array")return i;if(i instanceof ArrayBuffer)return new Uint8Array(i);if(ArrayBuffer.isView(i))return new Uint8Array(i.buffer,i.byteOffset,i.byteLength);throw new Error("Unknown type, must be binary type")},Fg=i=>new TextEncoder().encode(i),Ug=i=>new TextDecoder().decode(i);let Lg=class{constructor(e,t,s){this.name=e,this.prefix=t,this.baseEncode=s}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},Mg=class{constructor(e,t,s){if(this.name=e,this.prefix=t,t.codePointAt(0)===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=t.codePointAt(0),this.baseDecode=s}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Yc(this,e)}},qg=class{constructor(e){this.decoders=e}or(e){return Yc(this,e)}decode(e){const t=e[0],s=this.decoders[t];if(s)return s.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};const Yc=(i,e)=>new qg({...i.decoders||{[i.prefix]:i},...e.decoders||{[e.prefix]:e}});let jg=class{constructor(e,t,s,r){this.name=e,this.prefix=t,this.baseEncode=s,this.baseDecode=r,this.encoder=new Lg(e,t,s),this.decoder=new Mg(e,t,r)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}};const lr=({name:i,prefix:e,encode:t,decode:s})=>new jg(i,e,t,s),Is=({prefix:i,name:e,alphabet:t})=>{const{encode:s,decode:r}=$g(t,e);return lr({prefix:i,name:e,encode:s,decode:n=>Wc(r(n))})},zg=(i,e,t,s)=>{const r={};for(let p=0;p<e.length;++p)r[e[p]]=p;let n=i.length;for(;i[n-1]==="=";)--n;const o=new Uint8Array(n*t/8|0);let c=0,u=0,d=0;for(let p=0;p<n;++p){const b=r[i[p]];if(b===void 0)throw new SyntaxError(`Non-${s} character`);u=u<<t|b,c+=t,c>=8&&(c-=8,o[d++]=255&u>>c)}if(c>=t||255&u<<8-c)throw new SyntaxError("Unexpected end of data");return o},Kg=(i,e,t)=>{const s=e[e.length-1]==="=",r=(1<<t)-1;let n="",o=0,c=0;for(let u=0;u<i.length;++u)for(c=c<<8|i[u],o+=8;o>t;)o-=t,n+=e[r&c>>o];if(o&&(n+=e[r&c<<t-o]),s)for(;n.length*t&7;)n+="=";return n},dt=({name:i,prefix:e,bitsPerChar:t,alphabet:s})=>lr({prefix:e,name:i,encode(r){return Kg(r,s,t)},decode(r){return zg(r,s,t,i)}}),Vg=lr({prefix:"\0",name:"identity",encode:i=>Ug(i),decode:i=>Fg(i)});var Bg=Object.freeze({__proto__:null,identity:Vg});const kg=dt({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1});var Hg=Object.freeze({__proto__:null,base2:kg});const Gg=dt({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3});var Wg=Object.freeze({__proto__:null,base8:Gg});const Yg=Is({prefix:"9",name:"base10",alphabet:"0123456789"});var Jg=Object.freeze({__proto__:null,base10:Yg});const Qg=dt({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),Xg=dt({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4});var Zg=Object.freeze({__proto__:null,base16:Qg,base16upper:Xg});const ey=dt({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),ty=dt({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),iy=dt({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),sy=dt({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),ry=dt({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),ny=dt({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),oy=dt({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),ay=dt({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),cy=dt({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});var hy=Object.freeze({__proto__:null,base32:ey,base32upper:ty,base32pad:iy,base32padupper:sy,base32hex:ry,base32hexupper:ny,base32hexpad:oy,base32hexpadupper:ay,base32z:cy});const uy=Is({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),ly=Is({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"});var dy=Object.freeze({__proto__:null,base36:uy,base36upper:ly});const fy=Is({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),py=Is({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var gy=Object.freeze({__proto__:null,base58btc:fy,base58flickr:py});const yy=dt({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),my=dt({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),by=dt({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),wy=dt({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});var vy=Object.freeze({__proto__:null,base64:yy,base64pad:my,base64url:by,base64urlpad:wy});const Jc=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),_y=Jc.reduce((i,e,t)=>(i[t]=e,i),[]),Ey=Jc.reduce((i,e,t)=>(i[e.codePointAt(0)]=t,i),[]);function Sy(i){return i.reduce((e,t)=>(e+=_y[t],e),"")}function Iy(i){const e=[];for(const t of i){const s=Ey[t.codePointAt(0)];if(s===void 0)throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const Dy=lr({prefix:"🚀",name:"base256emoji",encode:Sy,decode:Iy});var xy=Object.freeze({__proto__:null,base256emoji:Dy}),Oy=Qc,Go=128,Ny=127,Py=~Ny,Ry=Math.pow(2,31);function Qc(i,e,t){e=e||[],t=t||0;for(var s=t;i>=Ry;)e[t++]=i&255|Go,i/=128;for(;i&Py;)e[t++]=i&255|Go,i>>>=7;return e[t]=i|0,Qc.bytes=t-s+1,e}var Cy=Wr,Ay=128,Wo=127;function Wr(i,s){var t=0,s=s||0,r=0,n=s,o,c=i.length;do{if(n>=c)throw Wr.bytes=0,new RangeError("Could not decode varint");o=i[n++],t+=r<28?(o&Wo)<<r:(o&Wo)*Math.pow(2,r),r+=7}while(o>=Ay);return Wr.bytes=n-s,t}var Ty=Math.pow(2,7),$y=Math.pow(2,14),Fy=Math.pow(2,21),Uy=Math.pow(2,28),Ly=Math.pow(2,35),My=Math.pow(2,42),qy=Math.pow(2,49),jy=Math.pow(2,56),zy=Math.pow(2,63),Ky=function(i){return i<Ty?1:i<$y?2:i<Fy?3:i<Uy?4:i<Ly?5:i<My?6:i<qy?7:i<jy?8:i<zy?9:10},Vy={encode:Oy,decode:Cy,encodingLength:Ky},Xc=Vy;const Yo=(i,e,t=0)=>(Xc.encode(i,e,t),e),Jo=i=>Xc.encodingLength(i),Yr=(i,e)=>{const t=e.byteLength,s=Jo(i),r=s+Jo(t),n=new Uint8Array(r+t);return Yo(i,n,0),Yo(t,n,s),n.set(e,r),new By(i,t,e,n)};let By=class{constructor(e,t,s,r){this.code=e,this.size=t,this.digest=s,this.bytes=r}};const Zc=({name:i,code:e,encode:t})=>new ky(i,e,t);let ky=class{constructor(e,t,s){this.name=e,this.code=t,this.encode=s}digest(e){if(e instanceof Uint8Array){const t=this.encode(e);return t instanceof Uint8Array?Yr(this.code,t):t.then(s=>Yr(this.code,s))}else throw Error("Unknown type, must be binary type")}};const eh=i=>async e=>new Uint8Array(await crypto.subtle.digest(i,e)),Hy=Zc({name:"sha2-256",code:18,encode:eh("SHA-256")}),Gy=Zc({name:"sha2-512",code:19,encode:eh("SHA-512")});var Wy=Object.freeze({__proto__:null,sha256:Hy,sha512:Gy});const th=0,Yy="identity",ih=Wc,Jy=i=>Yr(th,ih(i)),Qy={code:th,name:Yy,encode:ih,digest:Jy};var Xy=Object.freeze({__proto__:null,identity:Qy});new TextEncoder,new TextDecoder;const Qo={...Bg,...Hg,...Wg,...Jg,...Zg,...hy,...dy,...gy,...vy,...xy};({...Wy,...Xy});function sh(i){return globalThis.Buffer!=null?new Uint8Array(i.buffer,i.byteOffset,i.byteLength):i}function Zy(i=0){return globalThis.Buffer!=null&&globalThis.Buffer.allocUnsafe!=null?sh(globalThis.Buffer.allocUnsafe(i)):new Uint8Array(i)}function rh(i,e,t,s){return{name:i,prefix:e,encoder:{name:i,prefix:e,encode:t},decoder:{decode:s}}}const Xo=rh("utf8","u",i=>"u"+new TextDecoder("utf8").decode(i),i=>new TextEncoder().encode(i.substring(1))),Or=rh("ascii","a",i=>{let e="a";for(let t=0;t<i.length;t++)e+=String.fromCharCode(i[t]);return e},i=>{i=i.substring(1);const e=Zy(i.length);for(let t=0;t<i.length;t++)e[t]=i.charCodeAt(t);return e}),e1={utf8:Xo,"utf-8":Xo,hex:Qo.base16,latin1:Or,ascii:Or,binary:Or,...Qo};function t1(i,e="utf8"){const t=e1[e];if(!t)throw new Error(`Unsupported encoding "${e}"`);return(e==="utf8"||e==="utf-8")&&globalThis.Buffer!=null&&globalThis.Buffer.from!=null?sh(globalThis.Buffer.from(i,"utf-8")):t.decoder.decode(`${t.prefix}${i}`)}const nh="wc",i1=2,En="core",hi=`${nh}@2:${En}:`,s1={name:En,logger:"error"},r1={database:":memory:"},n1="crypto",Zo="client_ed25519_seed",o1=V.ONE_DAY,a1="keychain",c1="0.3",h1="messages",u1="0.3",l1=V.SIX_HOURS,d1="publisher",oh="irn",f1="error",ah="wss://relay.walletconnect.com",ea="wss://relay.walletconnect.org",p1="relayer",yt={message:"relayer_message",message_ack:"relayer_message_ack",connect:"relayer_connect",disconnect:"relayer_disconnect",error:"relayer_error",connection_stalled:"relayer_connection_stalled",transport_closed:"relayer_transport_closed",publish:"relayer_publish"},g1="_subscription",Zt={payload:"payload",connect:"connect",disconnect:"disconnect",error:"error"},y1=V.ONE_SECOND,m1="2.10.1",b1=1e4,w1="0.3",v1="WALLETCONNECT_CLIENT_ID",Vt={created:"subscription_created",deleted:"subscription_deleted",expired:"subscription_expired",disabled:"subscription_disabled",sync:"subscription_sync",resubscribed:"subscription_resubscribed"},_1="subscription",E1="0.3",S1=V.FIVE_SECONDS*1e3,I1="pairing",D1="0.3",Zi={wc_pairingDelete:{req:{ttl:V.ONE_DAY,prompt:!1,tag:1e3},res:{ttl:V.ONE_DAY,prompt:!1,tag:1001}},wc_pairingPing:{req:{ttl:V.THIRTY_SECONDS,prompt:!1,tag:1002},res:{ttl:V.THIRTY_SECONDS,prompt:!1,tag:1003}},unregistered_method:{req:{ttl:V.ONE_DAY,prompt:!1,tag:0},res:{ttl:V.ONE_DAY,prompt:!1,tag:0}}},as={create:"pairing_create",expire:"pairing_expire",delete:"pairing_delete",ping:"pairing_ping"},zt={created:"history_created",updated:"history_updated",deleted:"history_deleted",sync:"history_sync"},x1="history",O1="0.3",N1="expirer",Tt={created:"expirer_created",deleted:"expirer_deleted",expired:"expirer_expired",sync:"expirer_sync"},P1="0.3",Nr="verify-api",Ks="https://verify.walletconnect.com",ta="https://verify.walletconnect.org";let R1=class{constructor(e,t){this.core=e,this.logger=t,this.keychain=new Map,this.name=a1,this.version=c1,this.initialized=!1,this.storagePrefix=hi,this.init=async()=>{if(!this.initialized){const s=await this.getKeyChain();typeof s<"u"&&(this.keychain=s),this.initialized=!0}},this.has=s=>(this.isInitialized(),this.keychain.has(s)),this.set=async(s,r)=>{this.isInitialized(),this.keychain.set(s,r),await this.persist()},this.get=s=>{this.isInitialized();const r=this.keychain.get(s);if(typeof r>"u"){const{message:n}=Y("NO_MATCHING_KEY",`${this.name}: ${s}`);throw new Error(n)}return r},this.del=async s=>{this.isInitialized(),this.keychain.delete(s),await this.persist()},this.core=e,this.logger=ee.generateChildLogger(t,this.name)}get context(){return ee.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}async setKeyChain(e){await this.core.storage.setItem(this.storageKey,Fc(e))}async getKeyChain(){const e=await this.core.storage.getItem(this.storageKey);return typeof e<"u"?Uc(e):void 0}async persist(){await this.setKeyChain(this.keychain)}isInitialized(){if(!this.initialized){const{message:e}=Y("NOT_INITIALIZED",this.name);throw new Error(e)}}},C1=class{constructor(e,t,s){this.core=e,this.logger=t,this.name=n1,this.initialized=!1,this.init=async()=>{this.initialized||(await this.keychain.init(),this.initialized=!0)},this.hasKeys=r=>(this.isInitialized(),this.keychain.has(r)),this.getClientId=async()=>{this.isInitialized();const r=await this.getClientSeed(),n=Ws(r);return an(n.publicKey)},this.generateKeyPair=()=>{this.isInitialized();const r=Qf();return this.setPrivateKey(r.publicKey,r.privateKey)},this.signJWT=async r=>{this.isInitialized();const n=await this.getClientSeed(),o=Ws(n),c=Hr();return await Ec(c,r,o1,o)},this.generateSharedKey=(r,n,o)=>{this.isInitialized();const c=this.getPrivateKey(r),u=Xf(c,n);return this.setSymKey(u,o)},this.setSymKey=async(r,n)=>{this.isInitialized();const o=n||Zf(r);return await this.keychain.set(o,r),o},this.deleteKeyPair=async r=>{this.isInitialized(),await this.keychain.del(r)},this.deleteSymKey=async r=>{this.isInitialized(),await this.keychain.del(r)},this.encode=async(r,n,o)=>{this.isInitialized();const c=$c(o),u=rr(n);if(Ro(c)){const x=c.senderPublicKey,O=c.receiverPublicKey;r=await this.generateSharedKey(x,O)}const d=this.getSymKey(r),{type:p,senderPublicKey:b}=c;return tp({type:p,symKey:d,message:u,senderPublicKey:b})},this.decode=async(r,n,o)=>{this.isInitialized();const c=rp(n,o);if(Ro(c)){const u=c.receiverPublicKey,d=c.senderPublicKey;r=await this.generateSharedKey(u,d)}try{const u=this.getSymKey(r),d=ip({symKey:u,encoded:n});return rn(d)}catch(u){this.logger.error(`Failed to decode message from topic: '${r}', clientId: '${await this.getClientId()}'`),this.logger.error(u)}},this.getPayloadType=r=>{const n=Ys(r);return vs(n.type)},this.getPayloadSenderPublicKey=r=>{const n=Ys(r);return n.senderPublicKey?Ne(n.senderPublicKey,vt):void 0},this.core=e,this.logger=ee.generateChildLogger(t,this.name),this.keychain=s||new R1(this.core,this.logger)}get context(){return ee.getLoggerContext(this.logger)}async setPrivateKey(e,t){return await this.keychain.set(e,t),e}getPrivateKey(e){return this.keychain.get(e)}async getClientSeed(){let e="";try{e=this.keychain.get(Zo)}catch{e=Hr(),await this.keychain.set(Zo,e)}return t1(e,"base16")}getSymKey(e){return this.keychain.get(e)}isInitialized(){if(!this.initialized){const{message:e}=Y("NOT_INITIALIZED",this.name);throw new Error(e)}}},A1=class extends ll{constructor(e,t){super(e,t),this.logger=e,this.core=t,this.messages=new Map,this.name=h1,this.version=u1,this.initialized=!1,this.storagePrefix=hi,this.init=async()=>{if(!this.initialized){this.logger.trace("Initialized");try{const s=await this.getRelayerMessages();typeof s<"u"&&(this.messages=s),this.logger.debug(`Successfully Restored records for ${this.name}`),this.logger.trace({type:"method",method:"restore",size:this.messages.size})}catch(s){this.logger.debug(`Failed to Restore records for ${this.name}`),this.logger.error(s)}finally{this.initialized=!0}}},this.set=async(s,r)=>{this.isInitialized();const n=Ui(r);let o=this.messages.get(s);return typeof o>"u"&&(o={}),typeof o[n]<"u"||(o[n]=r,this.messages.set(s,o),await this.persist()),n},this.get=s=>{this.isInitialized();let r=this.messages.get(s);return typeof r>"u"&&(r={}),r},this.has=(s,r)=>{this.isInitialized();const n=this.get(s),o=Ui(r);return typeof n[o]<"u"},this.del=async s=>{this.isInitialized(),this.messages.delete(s),await this.persist()},this.logger=ee.generateChildLogger(e,this.name),this.core=t}get context(){return ee.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}async setRelayerMessages(e){await this.core.storage.setItem(this.storageKey,Fc(e))}async getRelayerMessages(){const e=await this.core.storage.getItem(this.storageKey);return typeof e<"u"?Uc(e):void 0}async persist(){await this.setRelayerMessages(this.messages)}isInitialized(){if(!this.initialized){const{message:e}=Y("NOT_INITIALIZED",this.name);throw new Error(e)}}},T1=class extends dl{constructor(e,t){super(e,t),this.relayer=e,this.logger=t,this.events=new We.EventEmitter,this.name=d1,this.queue=new Map,this.publishTimeout=V.toMiliseconds(V.TEN_SECONDS),this.needsTransportRestart=!1,this.publish=async(s,r,n)=>{var o;this.logger.debug("Publishing Payload"),this.logger.trace({type:"method",method:"publish",params:{topic:s,message:r,opts:n}});try{const c=n?.ttl||l1,u=Gr(n),d=n?.prompt||!1,p=n?.tag||0,b=n?.id||vn().toString(),x={topic:s,message:r,opts:{ttl:c,relay:u,prompt:d,tag:p,id:b}},O=setTimeout(()=>this.queue.set(b,x),this.publishTimeout);try{await await fs(this.rpcPublish(s,r,c,u,d,p,b),this.publishTimeout,"Failed to publish payload, please try again."),this.removeRequestFromQueue(b),this.relayer.events.emit(yt.publish,x)}catch(_){if(this.logger.debug("Publishing Payload stalled"),this.needsTransportRestart=!0,(o=n?.internal)!=null&&o.throwOnFailedPublish)throw this.removeRequestFromQueue(b),_;return}finally{clearTimeout(O)}this.logger.debug("Successfully Published Payload"),this.logger.trace({type:"method",method:"publish",params:{topic:s,message:r,opts:n}})}catch(c){throw this.logger.debug("Failed to Publish Payload"),this.logger.error(c),c}},this.on=(s,r)=>{this.events.on(s,r)},this.once=(s,r)=>{this.events.once(s,r)},this.off=(s,r)=>{this.events.off(s,r)},this.removeListener=(s,r)=>{this.events.removeListener(s,r)},this.relayer=e,this.logger=ee.generateChildLogger(t,this.name),this.registerEventListeners()}get context(){return ee.getLoggerContext(this.logger)}rpcPublish(e,t,s,r,n,o,c){var u,d,p,b;const x={method:js(r.protocol).publish,params:{topic:e,message:t,ttl:s,prompt:n,tag:o},id:c};return bt((u=x.params)==null?void 0:u.prompt)&&((d=x.params)==null||delete d.prompt),bt((p=x.params)==null?void 0:p.tag)&&((b=x.params)==null||delete b.tag),this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"message",direction:"outgoing",request:x}),this.relayer.request(x)}removeRequestFromQueue(e){this.queue.delete(e)}checkQueue(){this.queue.forEach(async e=>{const{topic:t,message:s,opts:r}=e;await this.publish(t,s,r)})}registerEventListeners(){this.relayer.core.heartbeat.on(Wt.HEARTBEAT_EVENTS.pulse,()=>{if(this.needsTransportRestart){this.needsTransportRestart=!1,this.relayer.events.emit(yt.connection_stalled);return}this.checkQueue()}),this.relayer.on(yt.message_ack,e=>{this.removeRequestFromQueue(e.id.toString())})}},$1=class{constructor(){this.map=new Map,this.set=(e,t)=>{const s=this.get(e);this.exists(e,t)||this.map.set(e,[...s,t])},this.get=e=>this.map.get(e)||[],this.exists=(e,t)=>this.get(e).includes(t),this.delete=(e,t)=>{if(typeof t>"u"){this.map.delete(e);return}if(!this.map.has(e))return;const s=this.get(e);if(!this.exists(e,t))return;const r=s.filter(n=>n!==t);if(!r.length){this.map.delete(e);return}this.map.set(e,r)},this.clear=()=>{this.map.clear()}}get topics(){return Array.from(this.map.keys())}};var F1=Object.defineProperty,U1=Object.defineProperties,L1=Object.getOwnPropertyDescriptors,ia=Object.getOwnPropertySymbols,M1=Object.prototype.hasOwnProperty,q1=Object.prototype.propertyIsEnumerable,sa=(i,e,t)=>e in i?F1(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,es=(i,e)=>{for(var t in e||(e={}))M1.call(e,t)&&sa(i,t,e[t]);if(ia)for(var t of ia(e))q1.call(e,t)&&sa(i,t,e[t]);return i},Pr=(i,e)=>U1(i,L1(e));let j1=class extends gl{constructor(e,t){super(e,t),this.relayer=e,this.logger=t,this.subscriptions=new Map,this.topicMap=new $1,this.events=new We.EventEmitter,this.name=_1,this.version=E1,this.pending=new Map,this.cached=[],this.initialized=!1,this.pendingSubscriptionWatchLabel="pending_sub_watch_label",this.pollingInterval=20,this.storagePrefix=hi,this.subscribeTimeout=1e4,this.restartInProgress=!1,this.batchSubscribeTopicsLimit=500,this.init=async()=>{this.initialized||(this.logger.trace("Initialized"),this.registerEventListeners(),this.clientId=await this.relayer.core.crypto.getClientId())},this.subscribe=async(s,r)=>{await this.restartToComplete(),this.isInitialized(),this.logger.debug("Subscribing Topic"),this.logger.trace({type:"method",method:"subscribe",params:{topic:s,opts:r}});try{const n=Gr(r),o={topic:s,relay:n};this.pending.set(s,o);const c=await this.rpcSubscribe(s,n);return this.onSubscribe(c,o),this.logger.debug("Successfully Subscribed Topic"),this.logger.trace({type:"method",method:"subscribe",params:{topic:s,opts:r}}),c}catch(n){throw this.logger.debug("Failed to Subscribe Topic"),this.logger.error(n),n}},this.unsubscribe=async(s,r)=>{await this.restartToComplete(),this.isInitialized(),typeof r?.id<"u"?await this.unsubscribeById(s,r.id,r):await this.unsubscribeByTopic(s,r)},this.isSubscribed=async s=>this.topics.includes(s)?!0:await new Promise((r,n)=>{const o=new V.Watch;o.start(this.pendingSubscriptionWatchLabel);const c=setInterval(()=>{!this.pending.has(s)&&this.topics.includes(s)&&(clearInterval(c),o.stop(this.pendingSubscriptionWatchLabel),r(!0)),o.elapsed(this.pendingSubscriptionWatchLabel)>=S1&&(clearInterval(c),o.stop(this.pendingSubscriptionWatchLabel),n(new Error("Subscription resolution timeout")))},this.pollingInterval)}).catch(()=>!1),this.on=(s,r)=>{this.events.on(s,r)},this.once=(s,r)=>{this.events.once(s,r)},this.off=(s,r)=>{this.events.off(s,r)},this.removeListener=(s,r)=>{this.events.removeListener(s,r)},this.restart=async()=>{this.restartInProgress=!0,await this.restore(),await this.reset(),this.restartInProgress=!1},this.relayer=e,this.logger=ee.generateChildLogger(t,this.name),this.clientId=""}get context(){return ee.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}get length(){return this.subscriptions.size}get ids(){return Array.from(this.subscriptions.keys())}get values(){return Array.from(this.subscriptions.values())}get topics(){return this.topicMap.topics}hasSubscription(e,t){let s=!1;try{s=this.getSubscription(e).topic===t}catch{}return s}onEnable(){this.cached=[],this.initialized=!0}onDisable(){this.cached=this.values,this.subscriptions.clear(),this.topicMap.clear()}async unsubscribeByTopic(e,t){const s=this.topicMap.get(e);await Promise.all(s.map(async r=>await this.unsubscribeById(e,r,t)))}async unsubscribeById(e,t,s){this.logger.debug("Unsubscribing Topic"),this.logger.trace({type:"method",method:"unsubscribe",params:{topic:e,id:t,opts:s}});try{const r=Gr(s);await this.rpcUnsubscribe(e,t,r);const n=ot("USER_DISCONNECTED",`${this.name}, ${e}`);await this.onUnsubscribe(e,t,n),this.logger.debug("Successfully Unsubscribed Topic"),this.logger.trace({type:"method",method:"unsubscribe",params:{topic:e,id:t,opts:s}})}catch(r){throw this.logger.debug("Failed to Unsubscribe Topic"),this.logger.error(r),r}}async rpcSubscribe(e,t){const s={method:js(t.protocol).subscribe,params:{topic:e}};this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"payload",direction:"outgoing",request:s});try{await await fs(this.relayer.request(s),this.subscribeTimeout)}catch{this.logger.debug("Outgoing Relay Subscribe Payload stalled"),this.relayer.events.emit(yt.connection_stalled)}return Ui(e+this.clientId)}async rpcBatchSubscribe(e){if(!e.length)return;const t=e[0].relay,s={method:js(t.protocol).batchSubscribe,params:{topics:e.map(r=>r.topic)}};this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"payload",direction:"outgoing",request:s});try{return await await fs(this.relayer.request(s),this.subscribeTimeout)}catch{this.logger.debug("Outgoing Relay Payload stalled"),this.relayer.events.emit(yt.connection_stalled)}}rpcUnsubscribe(e,t,s){const r={method:js(s.protocol).unsubscribe,params:{topic:e,id:t}};return this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"payload",direction:"outgoing",request:r}),this.relayer.request(r)}onSubscribe(e,t){this.setSubscription(e,Pr(es({},t),{id:e})),this.pending.delete(t.topic)}onBatchSubscribe(e){e.length&&e.forEach(t=>{this.setSubscription(t.id,es({},t)),this.pending.delete(t.topic)})}async onUnsubscribe(e,t,s){this.events.removeAllListeners(t),this.hasSubscription(t,e)&&this.deleteSubscription(t,s),await this.relayer.messages.del(e)}async setRelayerSubscriptions(e){await this.relayer.core.storage.setItem(this.storageKey,e)}async getRelayerSubscriptions(){return await this.relayer.core.storage.getItem(this.storageKey)}setSubscription(e,t){this.subscriptions.has(e)||(this.logger.debug("Setting subscription"),this.logger.trace({type:"method",method:"setSubscription",id:e,subscription:t}),this.addSubscription(e,t))}addSubscription(e,t){this.subscriptions.set(e,es({},t)),this.topicMap.set(t.topic,e),this.events.emit(Vt.created,t)}getSubscription(e){this.logger.debug("Getting subscription"),this.logger.trace({type:"method",method:"getSubscription",id:e});const t=this.subscriptions.get(e);if(!t){const{message:s}=Y("NO_MATCHING_KEY",`${this.name}: ${e}`);throw new Error(s)}return t}deleteSubscription(e,t){this.logger.debug("Deleting subscription"),this.logger.trace({type:"method",method:"deleteSubscription",id:e,reason:t});const s=this.getSubscription(e);this.subscriptions.delete(e),this.topicMap.delete(s.topic,e),this.events.emit(Vt.deleted,Pr(es({},s),{reason:t}))}async persist(){await this.setRelayerSubscriptions(this.values),this.events.emit(Vt.sync)}async reset(){if(this.cached.length){const e=Math.ceil(this.cached.length/this.batchSubscribeTopicsLimit);for(let t=0;t<e;t++){const s=this.cached.splice(0,this.batchSubscribeTopicsLimit);await this.batchSubscribe(s)}}this.events.emit(Vt.resubscribed)}async restore(){try{const e=await this.getRelayerSubscriptions();if(typeof e>"u"||!e.length)return;if(this.subscriptions.size){const{message:t}=Y("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),this.logger.error(`${this.name}: ${JSON.stringify(this.values)}`),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored subscriptions for ${this.name}`),this.logger.trace({type:"method",method:"restore",subscriptions:this.values})}catch(e){this.logger.debug(`Failed to Restore subscriptions for ${this.name}`),this.logger.error(e)}}async batchSubscribe(e){if(!e.length)return;const t=await this.rpcBatchSubscribe(e);Ss(t)&&this.onBatchSubscribe(t.map((s,r)=>Pr(es({},e[r]),{id:s})))}async onConnect(){this.restartInProgress||(await this.restart(),this.onEnable())}onDisconnect(){this.onDisable()}async checkPending(){if(!this.initialized||this.relayer.transportExplicitlyClosed)return;const e=[];this.pending.forEach(t=>{e.push(t)}),await this.batchSubscribe(e)}registerEventListeners(){this.relayer.core.heartbeat.on(Wt.HEARTBEAT_EVENTS.pulse,async()=>{await this.checkPending()}),this.relayer.on(yt.connect,async()=>{await this.onConnect()}),this.relayer.on(yt.disconnect,()=>{this.onDisconnect()}),this.events.on(Vt.created,async e=>{const t=Vt.created;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),await this.persist()}),this.events.on(Vt.deleted,async e=>{const t=Vt.deleted;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),await this.persist()})}isInitialized(){if(!this.initialized){const{message:e}=Y("NOT_INITIALIZED",this.name);throw new Error(e)}}async restartToComplete(){this.restartInProgress&&await new Promise(e=>{const t=setInterval(()=>{this.restartInProgress||(clearInterval(t),e())},this.pollingInterval)})}};var z1=Object.defineProperty,ra=Object.getOwnPropertySymbols,K1=Object.prototype.hasOwnProperty,V1=Object.prototype.propertyIsEnumerable,na=(i,e,t)=>e in i?z1(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,B1=(i,e)=>{for(var t in e||(e={}))K1.call(e,t)&&na(i,t,e[t]);if(ra)for(var t of ra(e))V1.call(e,t)&&na(i,t,e[t]);return i};let k1=class extends fl{constructor(e){super(e),this.protocol="wc",this.version=2,this.events=new We.EventEmitter,this.name=p1,this.transportExplicitlyClosed=!1,this.initialized=!1,this.connectionAttemptInProgress=!1,this.connectionStatusPollingInterval=20,this.staleConnectionErrors=["socket hang up","socket stalled"],this.hasExperiencedNetworkDisruption=!1,this.request=async t=>{this.logger.debug("Publishing Request Payload");try{return await this.toEstablishConnection(),await this.provider.request(t)}catch(s){throw this.logger.debug("Failed to Publish Request"),this.logger.error(s),s}},this.onPayloadHandler=t=>{this.onProviderPayload(t)},this.onConnectHandler=()=>{this.events.emit(yt.connect)},this.onDisconnectHandler=()=>{this.onProviderDisconnect()},this.onProviderErrorHandler=t=>{this.logger.error(t),this.events.emit(yt.error,t),this.logger.info("Fatal socket error received, closing transport"),this.transportClose()},this.registerProviderListeners=()=>{this.provider.on(Zt.payload,this.onPayloadHandler),this.provider.on(Zt.connect,this.onConnectHandler),this.provider.on(Zt.disconnect,this.onDisconnectHandler),this.provider.on(Zt.error,this.onProviderErrorHandler)},this.core=e.core,this.logger=typeof e.logger<"u"&&typeof e.logger!="string"?ee.generateChildLogger(e.logger,this.name):ee.pino(ee.getDefaultLoggerOptions({level:e.logger||f1})),this.messages=new A1(this.logger,e.core),this.subscriber=new j1(this,this.logger),this.publisher=new T1(this,this.logger),this.relayUrl=e?.relayUrl||ah,this.projectId=e.projectId,this.provider={}}async init(){this.logger.trace("Initialized"),this.registerEventListeners(),await this.createProvider(),await Promise.all([this.messages.init(),this.subscriber.init()]);try{await this.transportOpen()}catch{this.logger.warn(`Connection via ${this.relayUrl} failed, attempting to connect via failover domain ${ea}...`),await this.restartTransport(ea)}this.initialized=!0,setTimeout(async()=>{this.subscriber.topics.length===0&&(this.logger.info("No topics subscribed to after init, closing transport"),await this.transportClose(),this.transportExplicitlyClosed=!1)},b1)}get context(){return ee.getLoggerContext(this.logger)}get connected(){return this.provider.connection.connected}get connecting(){return this.provider.connection.connecting}async publish(e,t,s){this.isInitialized(),await this.publisher.publish(e,t,s),await this.recordMessageEvent({topic:e,message:t,publishedAt:Date.now()})}async subscribe(e,t){var s;this.isInitialized();let r=((s=this.subscriber.topicMap.get(e))==null?void 0:s[0])||"";return r||(await Promise.all([new Promise(n=>{this.subscriber.once(Vt.created,o=>{o.topic===e&&n()})}),new Promise(async n=>{r=await this.subscriber.subscribe(e,t),n()})]),r)}async unsubscribe(e,t){this.isInitialized(),await this.subscriber.unsubscribe(e,t)}on(e,t){this.events.on(e,t)}once(e,t){this.events.once(e,t)}off(e,t){this.events.off(e,t)}removeListener(e,t){this.events.removeListener(e,t)}async transportClose(){this.transportExplicitlyClosed=!0,this.hasExperiencedNetworkDisruption&&this.connected?await fs(this.provider.disconnect(),1e3,"provider.disconnect()").catch(()=>this.onProviderDisconnect()):this.connected&&await this.provider.disconnect()}async transportOpen(e){if(this.transportExplicitlyClosed=!1,await this.confirmOnlineStateOrThrow(),!this.connectionAttemptInProgress){e&&e!==this.relayUrl&&(this.relayUrl=e,await this.transportClose(),await this.createProvider()),this.connectionAttemptInProgress=!0;try{await Promise.all([new Promise(t=>{if(!this.initialized)return t();this.subscriber.once(Vt.resubscribed,()=>{t()})}),new Promise(async(t,s)=>{try{await fs(this.provider.connect(),1e4,`Socket stalled when trying to connect to ${this.relayUrl}`)}catch(r){s(r);return}t()})])}catch(t){this.logger.error(t);const s=t;if(!this.isConnectionStalled(s.message))throw t;this.provider.events.emit(Zt.disconnect)}finally{this.connectionAttemptInProgress=!1,this.hasExperiencedNetworkDisruption=!1}}}async restartTransport(e){await this.confirmOnlineStateOrThrow(),!this.connectionAttemptInProgress&&(this.relayUrl=e||this.relayUrl,await this.transportClose(),await this.createProvider(),await this.transportOpen())}async confirmOnlineStateOrThrow(){if(!await jo())throw new Error("No internet connection detected. Please restart your network and try again.")}isConnectionStalled(e){return this.staleConnectionErrors.some(t=>e.includes(t))}async createProvider(){this.provider.connection&&this.unregisterProviderListeners();const e=await this.core.crypto.signJWT(this.relayUrl);this.provider=new _n(new Hc(gp({sdkVersion:m1,protocol:this.protocol,version:this.version,relayUrl:this.relayUrl,projectId:this.projectId,auth:e,useOnCloseEvent:!0}))),this.registerProviderListeners()}async recordMessageEvent(e){const{topic:t,message:s}=e;await this.messages.set(t,s)}async shouldIgnoreMessageEvent(e){const{topic:t,message:s}=e;if(!s||s.length===0)return this.logger.debug(`Ignoring invalid/empty message: ${s}`),!0;if(!await this.subscriber.isSubscribed(t))return this.logger.debug(`Ignoring message for non-subscribed topic ${t}`),!0;const r=this.messages.has(t,s);return r&&this.logger.debug(`Ignoring duplicate message: ${s}`),r}async onProviderPayload(e){if(this.logger.debug("Incoming Relay Payload"),this.logger.trace({type:"payload",direction:"incoming",payload:e}),zi(e)){if(!e.method.endsWith(g1))return;const t=e.params,{topic:s,message:r,publishedAt:n}=t.data,o={topic:s,message:r,publishedAt:n};this.logger.debug("Emitting Relayer Payload"),this.logger.trace(B1({type:"event",event:t.id},o)),this.events.emit(t.id,o),await this.acknowledgePayload(e),await this.onMessageEvent(o)}else Oi(e)&&this.events.emit(yt.message_ack,e)}async onMessageEvent(e){await this.shouldIgnoreMessageEvent(e)||(this.events.emit(yt.message,e),await this.recordMessageEvent(e))}async acknowledgePayload(e){const t=xi(e.id,!0);await this.provider.connection.send(t)}unregisterProviderListeners(){this.provider.off(Zt.payload,this.onPayloadHandler),this.provider.off(Zt.connect,this.onConnectHandler),this.provider.off(Zt.disconnect,this.onDisconnectHandler),this.provider.off(Zt.error,this.onProviderErrorHandler)}async registerEventListeners(){this.events.on(yt.connection_stalled,()=>{this.restartTransport().catch(t=>this.logger.error(t))});let e=await jo();ag(async t=>{this.initialized&&e!==t&&(e=t,t?await this.restartTransport().catch(s=>this.logger.error(s)):(this.hasExperiencedNetworkDisruption=!0,await this.transportClose().catch(s=>this.logger.error(s))))})}onProviderDisconnect(){this.events.emit(yt.disconnect),this.attemptToReconnect()}attemptToReconnect(){this.transportExplicitlyClosed||(this.logger.info("attemptToReconnect called. Connecting..."),setTimeout(async()=>{await this.restartTransport().catch(e=>this.logger.error(e))},V.toMiliseconds(y1)))}isInitialized(){if(!this.initialized){const{message:e}=Y("NOT_INITIALIZED",this.name);throw new Error(e)}}async toEstablishConnection(){if(await this.confirmOnlineStateOrThrow(),!this.connected){if(this.connectionAttemptInProgress)return await new Promise(e=>{const t=setInterval(()=>{this.connected&&(clearInterval(t),e())},this.connectionStatusPollingInterval)});await this.restartTransport()}}};var H1=Object.defineProperty,oa=Object.getOwnPropertySymbols,G1=Object.prototype.hasOwnProperty,W1=Object.prototype.propertyIsEnumerable,aa=(i,e,t)=>e in i?H1(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,ca=(i,e)=>{for(var t in e||(e={}))G1.call(e,t)&&aa(i,t,e[t]);if(oa)for(var t of oa(e))W1.call(e,t)&&aa(i,t,e[t]);return i};let dr=class extends pl{constructor(e,t,s,r=hi,n=void 0){super(e,t,s,r),this.core=e,this.logger=t,this.name=s,this.map=new Map,this.version=w1,this.cached=[],this.initialized=!1,this.storagePrefix=hi,this.init=async()=>{this.initialized||(this.logger.trace("Initialized"),await this.restore(),this.cached.forEach(o=>{this.getKey&&o!==null&&!bt(o)?this.map.set(this.getKey(o),o):Mp(o)?this.map.set(o.id,o):qp(o)&&this.map.set(o.topic,o)}),this.cached=[],this.initialized=!0)},this.set=async(o,c)=>{this.isInitialized(),this.map.has(o)?await this.update(o,c):(this.logger.debug("Setting value"),this.logger.trace({type:"method",method:"set",key:o,value:c}),this.map.set(o,c),await this.persist())},this.get=o=>(this.isInitialized(),this.logger.debug("Getting value"),this.logger.trace({type:"method",method:"get",key:o}),this.getData(o)),this.getAll=o=>(this.isInitialized(),o?this.values.filter(c=>Object.keys(o).every(u=>Gc(c[u],o[u]))):this.values),this.update=async(o,c)=>{this.isInitialized(),this.logger.debug("Updating value"),this.logger.trace({type:"method",method:"update",key:o,update:c});const u=ca(ca({},this.getData(o)),c);this.map.set(o,u),await this.persist()},this.delete=async(o,c)=>{this.isInitialized(),this.map.has(o)&&(this.logger.debug("Deleting value"),this.logger.trace({type:"method",method:"delete",key:o,reason:c}),this.map.delete(o),await this.persist())},this.logger=ee.generateChildLogger(t,this.name),this.storagePrefix=r,this.getKey=n}get context(){return ee.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}get length(){return this.map.size}get keys(){return Array.from(this.map.keys())}get values(){return Array.from(this.map.values())}async setDataStore(e){await this.core.storage.setItem(this.storageKey,e)}async getDataStore(){return await this.core.storage.getItem(this.storageKey)}getData(e){const t=this.map.get(e);if(!t){const{message:s}=Y("NO_MATCHING_KEY",`${this.name}: ${e}`);throw this.logger.error(s),new Error(s)}return t}async persist(){await this.setDataStore(this.values)}async restore(){try{const e=await this.getDataStore();if(typeof e>"u"||!e.length)return;if(this.map.size){const{message:t}=Y("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored value for ${this.name}`),this.logger.trace({type:"method",method:"restore",value:this.values})}catch(e){this.logger.debug(`Failed to Restore value for ${this.name}`),this.logger.error(e)}}isInitialized(){if(!this.initialized){const{message:e}=Y("NOT_INITIALIZED",this.name);throw new Error(e)}}},Y1=class{constructor(e,t){this.core=e,this.logger=t,this.name=I1,this.version=D1,this.events=new ir,this.initialized=!1,this.storagePrefix=hi,this.ignoredPayloadTypes=[Di],this.registeredMethods=[],this.init=async()=>{this.initialized||(await this.pairings.init(),await this.cleanup(),this.registerRelayerEvents(),this.registerExpirerEvents(),this.initialized=!0,this.logger.trace("Initialized"))},this.register=({methods:s})=>{this.isInitialized(),this.registeredMethods=[...new Set([...this.registeredMethods,...s])]},this.create=async()=>{this.isInitialized();const s=Hr(),r=await this.core.crypto.setSymKey(s),n=Mt(V.FIVE_MINUTES),o={protocol:oh},c={topic:r,expiry:n,relay:o,active:!1},u=Np({protocol:this.core.protocol,version:this.core.version,topic:r,symKey:s,relay:o});return await this.pairings.set(r,c),await this.core.relayer.subscribe(r),this.core.expirer.set(r,n),{topic:r,uri:u}},this.pair=async s=>{this.isInitialized(),this.isValidPair(s);const{topic:r,symKey:n,relay:o}=Dp(s.uri);let c;if(this.pairings.keys.includes(r)&&(c=this.pairings.get(r),c.active))throw new Error(`Pairing already exists: ${r}. Please try again with a new connection URI.`);this.core.crypto.keychain.has(r)||(await this.core.crypto.setSymKey(n,r),await this.core.relayer.subscribe(r,{relay:o}));const u=Mt(V.FIVE_MINUTES),d={topic:r,relay:o,expiry:u,active:!1};return await this.pairings.set(r,d),this.core.expirer.set(r,u),s.activatePairing&&await this.activate({topic:r}),this.events.emit(as.create,d),d},this.activate=async({topic:s})=>{this.isInitialized();const r=Mt(V.THIRTY_DAYS);await this.pairings.update(s,{active:!0,expiry:r}),this.core.expirer.set(s,r)},this.ping=async s=>{this.isInitialized(),await this.isValidPing(s);const{topic:r}=s;if(this.pairings.keys.includes(r)){const n=await this.sendRequest(r,"wc_pairingPing",{}),{done:o,resolve:c,reject:u}=Ai();this.events.once(Be("pairing_ping",n),({error:d})=>{d?u(d):c()}),await o()}},this.updateExpiry=async({topic:s,expiry:r})=>{this.isInitialized(),await this.pairings.update(s,{expiry:r})},this.updateMetadata=async({topic:s,metadata:r})=>{this.isInitialized(),await this.pairings.update(s,{peerMetadata:r})},this.getPairings=()=>(this.isInitialized(),this.pairings.values),this.disconnect=async s=>{this.isInitialized(),await this.isValidDisconnect(s);const{topic:r}=s;this.pairings.keys.includes(r)&&(await this.sendRequest(r,"wc_pairingDelete",ot("USER_DISCONNECTED")),await this.deletePairing(r))},this.sendRequest=async(s,r,n)=>{const o=ti(r,n),c=await this.core.crypto.encode(s,o),u=Zi[r].req;return this.core.history.set(s,o),this.core.relayer.publish(s,c,u),o.id},this.sendResult=async(s,r,n)=>{const o=xi(s,n),c=await this.core.crypto.encode(r,o),u=await this.core.history.get(r,s),d=Zi[u.request.method].res;await this.core.relayer.publish(r,c,d),await this.core.history.resolve(o)},this.sendError=async(s,r,n)=>{const o=ji(s,n),c=await this.core.crypto.encode(r,o),u=await this.core.history.get(r,s),d=Zi[u.request.method]?Zi[u.request.method].res:Zi.unregistered_method.res;await this.core.relayer.publish(r,c,d),await this.core.history.resolve(o)},this.deletePairing=async(s,r)=>{await this.core.relayer.unsubscribe(s),await Promise.all([this.pairings.delete(s,ot("USER_DISCONNECTED")),this.core.crypto.deleteSymKey(s),r?Promise.resolve():this.core.expirer.del(s)])},this.cleanup=async()=>{const s=this.pairings.getAll().filter(r=>ai(r.expiry));await Promise.all(s.map(r=>this.deletePairing(r.topic)))},this.onRelayEventRequest=s=>{const{topic:r,payload:n}=s;switch(n.method){case"wc_pairingPing":return this.onPairingPingRequest(r,n);case"wc_pairingDelete":return this.onPairingDeleteRequest(r,n);default:return this.onUnknownRpcMethodRequest(r,n)}},this.onRelayEventResponse=async s=>{const{topic:r,payload:n}=s,o=(await this.core.history.get(r,n.id)).request.method;switch(o){case"wc_pairingPing":return this.onPairingPingResponse(r,n);default:return this.onUnknownRpcMethodResponse(o)}},this.onPairingPingRequest=async(s,r)=>{const{id:n}=r;try{this.isValidPing({topic:s}),await this.sendResult(n,s,!0),this.events.emit(as.ping,{id:n,topic:s})}catch(o){await this.sendError(n,s,o),this.logger.error(o)}},this.onPairingPingResponse=(s,r)=>{const{id:n}=r;setTimeout(()=>{ut(r)?this.events.emit(Be("pairing_ping",n),{}):Ge(r)&&this.events.emit(Be("pairing_ping",n),{error:r.error})},500)},this.onPairingDeleteRequest=async(s,r)=>{const{id:n}=r;try{this.isValidDisconnect({topic:s}),await this.deletePairing(s),this.events.emit(as.delete,{id:n,topic:s})}catch(o){await this.sendError(n,s,o),this.logger.error(o)}},this.onUnknownRpcMethodRequest=async(s,r)=>{const{id:n,method:o}=r;try{if(this.registeredMethods.includes(o))return;const c=ot("WC_METHOD_UNSUPPORTED",o);await this.sendError(n,s,c),this.logger.error(c)}catch(c){await this.sendError(n,s,c),this.logger.error(c)}},this.onUnknownRpcMethodResponse=s=>{this.registeredMethods.includes(s)||this.logger.error(ot("WC_METHOD_UNSUPPORTED",s))},this.isValidPair=s=>{if(!St(s)){const{message:r}=Y("MISSING_OR_INVALID",`pair() params: ${s}`);throw new Error(r)}if(!Lp(s.uri)){const{message:r}=Y("MISSING_OR_INVALID",`pair() uri: ${s.uri}`);throw new Error(r)}},this.isValidPing=async s=>{if(!St(s)){const{message:n}=Y("MISSING_OR_INVALID",`ping() params: ${s}`);throw new Error(n)}const{topic:r}=s;await this.isValidPairingTopic(r)},this.isValidDisconnect=async s=>{if(!St(s)){const{message:n}=Y("MISSING_OR_INVALID",`disconnect() params: ${s}`);throw new Error(n)}const{topic:r}=s;await this.isValidPairingTopic(r)},this.isValidPairingTopic=async s=>{if(!at(s,!1)){const{message:r}=Y("MISSING_OR_INVALID",`pairing topic should be a string: ${s}`);throw new Error(r)}if(!this.pairings.keys.includes(s)){const{message:r}=Y("NO_MATCHING_KEY",`pairing topic doesn't exist: ${s}`);throw new Error(r)}if(ai(this.pairings.get(s).expiry)){await this.deletePairing(s);const{message:r}=Y("EXPIRED",`pairing topic: ${s}`);throw new Error(r)}},this.core=e,this.logger=ee.generateChildLogger(t,this.name),this.pairings=new dr(this.core,this.logger,this.name,this.storagePrefix)}get context(){return ee.getLoggerContext(this.logger)}isInitialized(){if(!this.initialized){const{message:e}=Y("NOT_INITIALIZED",this.name);throw new Error(e)}}registerRelayerEvents(){this.core.relayer.on(yt.message,async e=>{const{topic:t,message:s}=e;if(!this.pairings.keys.includes(t)||this.ignoredPayloadTypes.includes(this.core.crypto.getPayloadType(s)))return;const r=await this.core.crypto.decode(t,s);try{zi(r)?(this.core.history.set(t,r),this.onRelayEventRequest({topic:t,payload:r})):Oi(r)&&(await this.core.history.resolve(r),await this.onRelayEventResponse({topic:t,payload:r}),this.core.history.delete(t,r.id))}catch(n){this.logger.error(n)}})}registerExpirerEvents(){this.core.expirer.on(Tt.expired,async e=>{const{topic:t}=Mc(e.target);t&&this.pairings.keys.includes(t)&&(await this.deletePairing(t,!0),this.events.emit(as.expire,{topic:t}))})}},J1=class extends ul{constructor(e,t){super(e,t),this.core=e,this.logger=t,this.records=new Map,this.events=new We.EventEmitter,this.name=x1,this.version=O1,this.cached=[],this.initialized=!1,this.storagePrefix=hi,this.init=async()=>{this.initialized||(this.logger.trace("Initialized"),await this.restore(),this.cached.forEach(s=>this.records.set(s.id,s)),this.cached=[],this.registerEventListeners(),this.initialized=!0)},this.set=(s,r,n)=>{if(this.isInitialized(),this.logger.debug("Setting JSON-RPC request history record"),this.logger.trace({type:"method",method:"set",topic:s,request:r,chainId:n}),this.records.has(r.id))return;const o={id:r.id,topic:s,request:{method:r.method,params:r.params||null},chainId:n,expiry:Mt(V.THIRTY_DAYS)};this.records.set(o.id,o),this.events.emit(zt.created,o)},this.resolve=async s=>{if(this.isInitialized(),this.logger.debug("Updating JSON-RPC response history record"),this.logger.trace({type:"method",method:"update",response:s}),!this.records.has(s.id))return;const r=await this.getRecord(s.id);typeof r.response>"u"&&(r.response=Ge(s)?{error:s.error}:{result:s.result},this.records.set(r.id,r),this.events.emit(zt.updated,r))},this.get=async(s,r)=>(this.isInitialized(),this.logger.debug("Getting record"),this.logger.trace({type:"method",method:"get",topic:s,id:r}),await this.getRecord(r)),this.delete=(s,r)=>{this.isInitialized(),this.logger.debug("Deleting record"),this.logger.trace({type:"method",method:"delete",id:r}),this.values.forEach(n=>{if(n.topic===s){if(typeof r<"u"&&n.id!==r)return;this.records.delete(n.id),this.events.emit(zt.deleted,n)}})},this.exists=async(s,r)=>(this.isInitialized(),this.records.has(r)?(await this.getRecord(r)).topic===s:!1),this.on=(s,r)=>{this.events.on(s,r)},this.once=(s,r)=>{this.events.once(s,r)},this.off=(s,r)=>{this.events.off(s,r)},this.removeListener=(s,r)=>{this.events.removeListener(s,r)},this.logger=ee.generateChildLogger(t,this.name)}get context(){return ee.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}get size(){return this.records.size}get keys(){return Array.from(this.records.keys())}get values(){return Array.from(this.records.values())}get pending(){const e=[];return this.values.forEach(t=>{if(typeof t.response<"u")return;const s={topic:t.topic,request:ti(t.request.method,t.request.params,t.id),chainId:t.chainId};return e.push(s)}),e}async setJsonRpcRecords(e){await this.core.storage.setItem(this.storageKey,e)}async getJsonRpcRecords(){return await this.core.storage.getItem(this.storageKey)}getRecord(e){this.isInitialized();const t=this.records.get(e);if(!t){const{message:s}=Y("NO_MATCHING_KEY",`${this.name}: ${e}`);throw new Error(s)}return t}async persist(){await this.setJsonRpcRecords(this.values),this.events.emit(zt.sync)}async restore(){try{const e=await this.getJsonRpcRecords();if(typeof e>"u"||!e.length)return;if(this.records.size){const{message:t}=Y("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored records for ${this.name}`),this.logger.trace({type:"method",method:"restore",records:this.values})}catch(e){this.logger.debug(`Failed to Restore records for ${this.name}`),this.logger.error(e)}}registerEventListeners(){this.events.on(zt.created,e=>{const t=zt.created;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,record:e}),this.persist()}),this.events.on(zt.updated,e=>{const t=zt.updated;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,record:e}),this.persist()}),this.events.on(zt.deleted,e=>{const t=zt.deleted;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,record:e}),this.persist()}),this.core.heartbeat.on(Wt.HEARTBEAT_EVENTS.pulse,()=>{this.cleanup()})}cleanup(){try{this.records.forEach(e=>{V.toMiliseconds(e.expiry||0)-Date.now()<=0&&(this.logger.info(`Deleting expired history log: ${e.id}`),this.delete(e.topic,e.id))})}catch(e){this.logger.warn(e)}}isInitialized(){if(!this.initialized){const{message:e}=Y("NOT_INITIALIZED",this.name);throw new Error(e)}}},Q1=class extends yl{constructor(e,t){super(e,t),this.core=e,this.logger=t,this.expirations=new Map,this.events=new We.EventEmitter,this.name=N1,this.version=P1,this.cached=[],this.initialized=!1,this.storagePrefix=hi,this.init=async()=>{this.initialized||(this.logger.trace("Initialized"),await this.restore(),this.cached.forEach(s=>this.expirations.set(s.target,s)),this.cached=[],this.registerEventListeners(),this.initialized=!0)},this.has=s=>{try{const r=this.formatTarget(s);return typeof this.getExpiration(r)<"u"}catch{return!1}},this.set=(s,r)=>{this.isInitialized();const n=this.formatTarget(s),o={target:n,expiry:r};this.expirations.set(n,o),this.checkExpiry(n,o),this.events.emit(Tt.created,{target:n,expiration:o})},this.get=s=>{this.isInitialized();const r=this.formatTarget(s);return this.getExpiration(r)},this.del=s=>{if(this.isInitialized(),this.has(s)){const r=this.formatTarget(s),n=this.getExpiration(r);this.expirations.delete(r),this.events.emit(Tt.deleted,{target:r,expiration:n})}},this.on=(s,r)=>{this.events.on(s,r)},this.once=(s,r)=>{this.events.once(s,r)},this.off=(s,r)=>{this.events.off(s,r)},this.removeListener=(s,r)=>{this.events.removeListener(s,r)},this.logger=ee.generateChildLogger(t,this.name)}get context(){return ee.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}get length(){return this.expirations.size}get keys(){return Array.from(this.expirations.keys())}get values(){return Array.from(this.expirations.values())}formatTarget(e){if(typeof e=="string")return yp(e);if(typeof e=="number")return mp(e);const{message:t}=Y("UNKNOWN_TYPE",`Target type: ${typeof e}`);throw new Error(t)}async setExpirations(e){await this.core.storage.setItem(this.storageKey,e)}async getExpirations(){return await this.core.storage.getItem(this.storageKey)}async persist(){await this.setExpirations(this.values),this.events.emit(Tt.sync)}async restore(){try{const e=await this.getExpirations();if(typeof e>"u"||!e.length)return;if(this.expirations.size){const{message:t}=Y("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored expirations for ${this.name}`),this.logger.trace({type:"method",method:"restore",expirations:this.values})}catch(e){this.logger.debug(`Failed to Restore expirations for ${this.name}`),this.logger.error(e)}}getExpiration(e){const t=this.expirations.get(e);if(!t){const{message:s}=Y("NO_MATCHING_KEY",`${this.name}: ${e}`);throw this.logger.error(s),new Error(s)}return t}checkExpiry(e,t){const{expiry:s}=t;V.toMiliseconds(s)-Date.now()<=0&&this.expire(e,t)}expire(e,t){this.expirations.delete(e),this.events.emit(Tt.expired,{target:e,expiration:t})}checkExpirations(){this.core.relayer.connected&&this.expirations.forEach((e,t)=>this.checkExpiry(t,e))}registerEventListeners(){this.core.heartbeat.on(Wt.HEARTBEAT_EVENTS.pulse,()=>this.checkExpirations()),this.events.on(Tt.created,e=>{const t=Tt.created;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),this.persist()}),this.events.on(Tt.expired,e=>{const t=Tt.expired;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),this.persist()}),this.events.on(Tt.deleted,e=>{const t=Tt.deleted;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),this.persist()})}isInitialized(){if(!this.initialized){const{message:e}=Y("NOT_INITIALIZED",this.name);throw new Error(e)}}},X1=class extends ml{constructor(e,t){super(e,t),this.projectId=e,this.logger=t,this.name=Nr,this.initialized=!1,this.queue=[],this.verifyDisabled=!1,this.init=async s=>{if(this.verifyDisabled||ur()||!_s())return;const r=s?.verifyUrl||Ks;this.verifyUrl!==r&&this.removeIframe(),this.verifyUrl=r;try{await this.createIframe()}catch(n){this.logger.info(`Verify iframe failed to load: ${this.verifyUrl}`),this.logger.info(n)}if(!this.initialized){this.removeIframe(),this.verifyUrl=ta;try{await this.createIframe()}catch(n){this.logger.info(`Verify iframe failed to load: ${this.verifyUrl}`),this.logger.info(n),this.verifyDisabled=!0}}},this.register=async s=>{this.initialized?this.sendPost(s.attestationId):(this.addToQueue(s.attestationId),await this.init())},this.resolve=async s=>{if(this.isDevEnv)return"";const r=s?.verifyUrl||Ks;let n;try{n=await this.fetchAttestation(s.attestationId,r)}catch(o){this.logger.info(`failed to resolve attestation: ${s.attestationId} from url: ${r}`),this.logger.info(o),n=await this.fetchAttestation(s.attestationId,ta)}return n},this.fetchAttestation=async(s,r)=>{this.logger.info(`resolving attestation: ${s} from url: ${r}`);const n=this.startAbortTimer(V.ONE_SECOND*2),o=await fetch(`${r}/attestation/${s}`,{signal:this.abortController.signal});return clearTimeout(n),o.status===200?await o.json():void 0},this.addToQueue=s=>{this.queue.push(s)},this.processQueue=()=>{this.queue.length!==0&&(this.queue.forEach(s=>this.sendPost(s)),this.queue=[])},this.sendPost=s=>{var r;try{if(!this.iframe)return;(r=this.iframe.contentWindow)==null||r.postMessage(s,"*"),this.logger.info(`postMessage sent: ${s} ${this.verifyUrl}`)}catch{}},this.createIframe=async()=>{let s;const r=n=>{n.data==="verify_ready"&&(this.initialized=!0,this.processQueue(),window.removeEventListener("message",r),s())};await Promise.race([new Promise(n=>{if(document.getElementById(Nr))return n();window.addEventListener("message",r);const o=document.createElement("iframe");o.id=Nr,o.src=`${this.verifyUrl}/${this.projectId}`,o.style.display="none",document.body.append(o),this.iframe=o,s=n}),new Promise((n,o)=>setTimeout(()=>{window.removeEventListener("message",r),o("verify iframe load timeout")},V.toMiliseconds(V.FIVE_SECONDS)))])},this.removeIframe=()=>{this.iframe&&(this.iframe.remove(),this.iframe=void 0,this.initialized=!1)},this.logger=ee.generateChildLogger(t,this.name),this.verifyUrl=Ks,this.abortController=new AbortController,this.isDevEnv=yn()&&process.env.IS_VITEST}get context(){return ee.getLoggerContext(this.logger)}startAbortTimer(e){return this.abortController=new AbortController,setTimeout(()=>this.abortController.abort(),V.toMiliseconds(e))}};var Z1=Object.defineProperty,ha=Object.getOwnPropertySymbols,em=Object.prototype.hasOwnProperty,tm=Object.prototype.propertyIsEnumerable,ua=(i,e,t)=>e in i?Z1(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,la=(i,e)=>{for(var t in e||(e={}))em.call(e,t)&&ua(i,t,e[t]);if(ha)for(var t of ha(e))tm.call(e,t)&&ua(i,t,e[t]);return i};let im=class ch extends hl{constructor(e){super(e),this.protocol=nh,this.version=i1,this.name=En,this.events=new We.EventEmitter,this.initialized=!1,this.on=(s,r)=>this.events.on(s,r),this.once=(s,r)=>this.events.once(s,r),this.off=(s,r)=>this.events.off(s,r),this.removeListener=(s,r)=>this.events.removeListener(s,r),this.projectId=e?.projectId,this.relayUrl=e?.relayUrl||ah;const t=typeof e?.logger<"u"&&typeof e?.logger!="string"?e.logger:ee.pino(ee.getDefaultLoggerOptions({level:e?.logger||s1.logger}));this.logger=ee.generateChildLogger(t,this.name),this.heartbeat=new Wt.HeartBeat,this.crypto=new C1(this,this.logger,e?.keychain),this.history=new J1(this,this.logger),this.expirer=new Q1(this,this.logger),this.storage=e!=null&&e.storage?e.storage:new sc(la(la({},r1),e?.storageOptions)),this.relayer=new k1({core:this,logger:this.logger,relayUrl:this.relayUrl,projectId:this.projectId}),this.pairing=new Y1(this,this.logger),this.verify=new X1(this.projectId||"",this.logger)}static async init(e){const t=new ch(e);await t.initialize();const s=await t.crypto.getClientId();return await t.storage.setItem(v1,s),t}get context(){return ee.getLoggerContext(this.logger)}async start(){this.initialized||await this.initialize()}async initialize(){this.logger.trace("Initialized");try{await this.crypto.init(),await this.history.init(),await this.expirer.init(),await this.relayer.init(),await this.heartbeat.init(),await this.pairing.init(),this.initialized=!0,this.logger.info("Core Initialization Success")}catch(e){throw this.logger.warn(`Core Initialization Failure at epoch ${Date.now()}`,e),this.logger.error(e.message),e}}};const sm=im,hh="wc",uh=2,lh="client",Sn=`${hh}@${uh}:${lh}:`,Rr={name:lh,logger:"error",controller:!1,relayUrl:"wss://relay.walletconnect.com"},da="WALLETCONNECT_DEEPLINK_CHOICE",rm="proposal",nm="Proposal expired",om="session",Us=V.SEVEN_DAYS,am="engine",ts={wc_sessionPropose:{req:{ttl:V.FIVE_MINUTES,prompt:!0,tag:1100},res:{ttl:V.FIVE_MINUTES,prompt:!1,tag:1101}},wc_sessionSettle:{req:{ttl:V.FIVE_MINUTES,prompt:!1,tag:1102},res:{ttl:V.FIVE_MINUTES,prompt:!1,tag:1103}},wc_sessionUpdate:{req:{ttl:V.ONE_DAY,prompt:!1,tag:1104},res:{ttl:V.ONE_DAY,prompt:!1,tag:1105}},wc_sessionExtend:{req:{ttl:V.ONE_DAY,prompt:!1,tag:1106},res:{ttl:V.ONE_DAY,prompt:!1,tag:1107}},wc_sessionRequest:{req:{ttl:V.FIVE_MINUTES,prompt:!0,tag:1108},res:{ttl:V.FIVE_MINUTES,prompt:!1,tag:1109}},wc_sessionEvent:{req:{ttl:V.FIVE_MINUTES,prompt:!0,tag:1110},res:{ttl:V.FIVE_MINUTES,prompt:!1,tag:1111}},wc_sessionDelete:{req:{ttl:V.ONE_DAY,prompt:!1,tag:1112},res:{ttl:V.ONE_DAY,prompt:!1,tag:1113}},wc_sessionPing:{req:{ttl:V.THIRTY_SECONDS,prompt:!1,tag:1114},res:{ttl:V.THIRTY_SECONDS,prompt:!1,tag:1115}}},Cr={min:V.FIVE_MINUTES,max:V.SEVEN_DAYS},ei={idle:"IDLE",active:"ACTIVE"},cm="request",hm=["wc_sessionPropose","wc_sessionRequest","wc_authRequest"];var um=Object.defineProperty,lm=Object.defineProperties,dm=Object.getOwnPropertyDescriptors,fa=Object.getOwnPropertySymbols,fm=Object.prototype.hasOwnProperty,pm=Object.prototype.propertyIsEnumerable,pa=(i,e,t)=>e in i?um(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,Et=(i,e)=>{for(var t in e||(e={}))fm.call(e,t)&&pa(i,t,e[t]);if(fa)for(var t of fa(e))pm.call(e,t)&&pa(i,t,e[t]);return i},is=(i,e)=>lm(i,dm(e));let gm=class extends wl{constructor(e){super(e),this.name=am,this.events=new ir,this.initialized=!1,this.ignoredPayloadTypes=[Di],this.requestQueue={state:ei.idle,queue:[]},this.sessionRequestQueue={state:ei.idle,queue:[]},this.requestQueueDelay=V.ONE_SECOND,this.init=async()=>{this.initialized||(await this.cleanup(),this.registerRelayerEvents(),this.registerExpirerEvents(),this.registerPairingEvents(),this.client.core.pairing.register({methods:Object.keys(ts)}),this.initialized=!0,setTimeout(()=>{this.sessionRequestQueue.queue=this.getPendingSessionRequests(),this.processSessionRequestQueue()},V.toMiliseconds(this.requestQueueDelay)))},this.connect=async t=>{await this.isInitialized();const s=is(Et({},t),{requiredNamespaces:t.requiredNamespaces||{},optionalNamespaces:t.optionalNamespaces||{}});await this.isValidConnect(s);const{pairingTopic:r,requiredNamespaces:n,optionalNamespaces:o,sessionProperties:c,relays:u}=s;let d=r,p,b=!1;if(d&&(b=this.client.core.pairing.pairings.get(d).active),!d||!b){const{topic:D,uri:y}=await this.client.core.pairing.create();d=D,p=y}const x=await this.client.core.crypto.generateKeyPair(),O=Et({requiredNamespaces:n,optionalNamespaces:o,relays:u??[{protocol:oh}],proposer:{publicKey:x,metadata:this.client.metadata}},c&&{sessionProperties:c}),{reject:_,resolve:C,done:F}=Ai(V.FIVE_MINUTES,nm);if(this.events.once(Be("session_connect"),async({error:D,session:y})=>{if(D)_(D);else if(y){y.self.publicKey=x;const w=is(Et({},y),{requiredNamespaces:y.requiredNamespaces,optionalNamespaces:y.optionalNamespaces});await this.client.session.set(y.topic,w),await this.setExpiry(y.topic,y.expiry),d&&await this.client.core.pairing.updateMetadata({topic:d,metadata:y.peer.metadata}),C(w)}}),!d){const{message:D}=Y("NO_MATCHING_KEY",`connect() pairing topic: ${d}`);throw new Error(D)}const K=await this.sendRequest({topic:d,method:"wc_sessionPropose",params:O}),I=Mt(V.FIVE_MINUTES);return await this.setProposal(K,Et({id:K,expiry:I},O)),{uri:p,approval:F}},this.pair=async t=>(await this.isInitialized(),await this.client.core.pairing.pair(t)),this.approve=async t=>{await this.isInitialized(),await this.isValidApprove(t);const{id:s,relayProtocol:r,namespaces:n,sessionProperties:o}=t,c=this.client.proposal.get(s);let{pairingTopic:u,proposer:d,requiredNamespaces:p,optionalNamespaces:b}=c;u=u||"",hs(p)||(p=Ap(n,"approve()"));const x=await this.client.core.crypto.generateKeyPair(),O=d.publicKey,_=await this.client.core.crypto.generateSharedKey(x,O);u&&s&&(await this.client.core.pairing.updateMetadata({topic:u,metadata:d.metadata}),await this.sendResult({id:s,topic:u,result:{relay:{protocol:r??"irn"},responderPublicKey:x}}),await this.client.proposal.delete(s,ot("USER_DISCONNECTED")),await this.client.core.pairing.activate({topic:u}));const C=Et({relay:{protocol:r??"irn"},namespaces:n,requiredNamespaces:p,optionalNamespaces:b,pairingTopic:u,controller:{publicKey:x,metadata:this.client.metadata},expiry:Mt(Us)},o&&{sessionProperties:o});await this.client.core.relayer.subscribe(_),await this.sendRequest({topic:_,method:"wc_sessionSettle",params:C,throwOnFailedPublish:!0});const F=is(Et({},C),{topic:_,pairingTopic:u,acknowledged:!1,self:C.controller,peer:{publicKey:d.publicKey,metadata:d.metadata},controller:x});return await this.client.session.set(_,F),await this.setExpiry(_,Mt(Us)),{topic:_,acknowledged:()=>new Promise(K=>setTimeout(()=>K(this.client.session.get(_)),500))}},this.reject=async t=>{await this.isInitialized(),await this.isValidReject(t);const{id:s,reason:r}=t,{pairingTopic:n}=this.client.proposal.get(s);n&&(await this.sendError(s,n,r),await this.client.proposal.delete(s,ot("USER_DISCONNECTED")))},this.update=async t=>{await this.isInitialized(),await this.isValidUpdate(t);const{topic:s,namespaces:r}=t,n=await this.sendRequest({topic:s,method:"wc_sessionUpdate",params:{namespaces:r}}),{done:o,resolve:c,reject:u}=Ai();return this.events.once(Be("session_update",n),({error:d})=>{d?u(d):c()}),await this.client.session.update(s,{namespaces:r}),{acknowledged:o}},this.extend=async t=>{await this.isInitialized(),await this.isValidExtend(t);const{topic:s}=t,r=await this.sendRequest({topic:s,method:"wc_sessionExtend",params:{}}),{done:n,resolve:o,reject:c}=Ai();return this.events.once(Be("session_extend",r),({error:u})=>{u?c(u):o()}),await this.setExpiry(s,Mt(Us)),{acknowledged:n}},this.request=async t=>{await this.isInitialized(),await this.isValidRequest(t);const{chainId:s,request:r,topic:n,expiry:o}=t,c=wn(),{done:u,resolve:d,reject:p}=Ai(o);return this.events.once(Be("session_request",c),({error:b,result:x})=>{b?p(b):d(x)}),await Promise.all([new Promise(async b=>{await this.sendRequest({clientRpcId:c,topic:n,method:"wc_sessionRequest",params:{request:r,chainId:s},expiry:o,throwOnFailedPublish:!0}).catch(x=>p(x)),this.client.events.emit("session_request_sent",{topic:n,request:r,chainId:s,id:c}),b()}),new Promise(async b=>{const x=await this.client.core.storage.getItem(da);bp({id:c,topic:n,wcDeepLink:x}),b()}),u()]).then(b=>b[2])},this.respond=async t=>{await this.isInitialized(),await this.isValidRespond(t);const{topic:s,response:r}=t,{id:n}=r;ut(r)?await this.sendResult({id:n,topic:s,result:r.result,throwOnFailedPublish:!0}):Ge(r)&&await this.sendError(n,s,r.error),this.cleanupAfterResponse(t)},this.ping=async t=>{await this.isInitialized(),await this.isValidPing(t);const{topic:s}=t;if(this.client.session.keys.includes(s)){const r=await this.sendRequest({topic:s,method:"wc_sessionPing",params:{}}),{done:n,resolve:o,reject:c}=Ai();this.events.once(Be("session_ping",r),({error:u})=>{u?c(u):o()}),await n()}else this.client.core.pairing.pairings.keys.includes(s)&&await this.client.core.pairing.ping({topic:s})},this.emit=async t=>{await this.isInitialized(),await this.isValidEmit(t);const{topic:s,event:r,chainId:n}=t;await this.sendRequest({topic:s,method:"wc_sessionEvent",params:{event:r,chainId:n}})},this.disconnect=async t=>{await this.isInitialized(),await this.isValidDisconnect(t);const{topic:s}=t;this.client.session.keys.includes(s)?(await this.sendRequest({topic:s,method:"wc_sessionDelete",params:ot("USER_DISCONNECTED"),throwOnFailedPublish:!0}),await this.deleteSession(s)):await this.client.core.pairing.disconnect({topic:s})},this.find=t=>(this.isInitialized(),this.client.session.getAll().filter(s=>Fp(s,t))),this.getPendingSessionRequests=()=>(this.isInitialized(),this.client.pendingRequest.getAll()),this.cleanupDuplicatePairings=async t=>{if(t.pairingTopic)try{const s=this.client.core.pairing.pairings.get(t.pairingTopic),r=this.client.core.pairing.pairings.getAll().filter(n=>{var o,c;return((o=n.peerMetadata)==null?void 0:o.url)&&((c=n.peerMetadata)==null?void 0:c.url)===t.peer.metadata.url&&n.topic&&n.topic!==s.topic});if(r.length===0)return;this.client.logger.info(`Cleaning up ${r.length} duplicate pairing(s)`),await Promise.all(r.map(n=>this.client.core.pairing.disconnect({topic:n.topic}))),this.client.logger.info("Duplicate pairings clean up finished")}catch(s){this.client.logger.error(s)}},this.deleteSession=async(t,s)=>{const{self:r}=this.client.session.get(t);await this.client.core.relayer.unsubscribe(t),this.client.session.delete(t,ot("USER_DISCONNECTED")),this.client.core.crypto.keychain.has(r.publicKey)&&await this.client.core.crypto.deleteKeyPair(r.publicKey),this.client.core.crypto.keychain.has(t)&&await this.client.core.crypto.deleteSymKey(t),s||this.client.core.expirer.del(t),this.client.core.storage.removeItem(da).catch(n=>this.client.logger.warn(n))},this.deleteProposal=async(t,s)=>{await Promise.all([this.client.proposal.delete(t,ot("USER_DISCONNECTED")),s?Promise.resolve():this.client.core.expirer.del(t)])},this.deletePendingSessionRequest=async(t,s,r=!1)=>{await Promise.all([this.client.pendingRequest.delete(t,s),r?Promise.resolve():this.client.core.expirer.del(t)]),this.sessionRequestQueue.queue=this.sessionRequestQueue.queue.filter(n=>n.id!==t),r&&(this.sessionRequestQueue.state=ei.idle)},this.setExpiry=async(t,s)=>{this.client.session.keys.includes(t)&&await this.client.session.update(t,{expiry:s}),this.client.core.expirer.set(t,s)},this.setProposal=async(t,s)=>{await this.client.proposal.set(t,s),this.client.core.expirer.set(t,s.expiry)},this.setPendingSessionRequest=async t=>{const s=ts.wc_sessionRequest.req.ttl,{id:r,topic:n,params:o,verifyContext:c}=t;await this.client.pendingRequest.set(r,{id:r,topic:n,params:o,verifyContext:c}),s&&this.client.core.expirer.set(r,Mt(s))},this.sendRequest=async t=>{const{topic:s,method:r,params:n,expiry:o,relayRpcId:c,clientRpcId:u,throwOnFailedPublish:d}=t,p=ti(r,n,u);if(_s()&&hm.includes(r)){const O=Ui(JSON.stringify(p));this.client.core.verify.register({attestationId:O})}const b=await this.client.core.crypto.encode(s,p),x=ts[r].req;return o&&(x.ttl=o),c&&(x.id=c),this.client.core.history.set(s,p),d?(x.internal=is(Et({},x.internal),{throwOnFailedPublish:!0}),await this.client.core.relayer.publish(s,b,x)):this.client.core.relayer.publish(s,b,x).catch(O=>this.client.logger.error(O)),p.id},this.sendResult=async t=>{const{id:s,topic:r,result:n,throwOnFailedPublish:o}=t,c=xi(s,n),u=await this.client.core.crypto.encode(r,c),d=await this.client.core.history.get(r,s),p=ts[d.request.method].res;o?(p.internal=is(Et({},p.internal),{throwOnFailedPublish:!0}),await this.client.core.relayer.publish(r,u,p)):this.client.core.relayer.publish(r,u,p).catch(b=>this.client.logger.error(b)),await this.client.core.history.resolve(c)},this.sendError=async(t,s,r)=>{const n=ji(t,r),o=await this.client.core.crypto.encode(s,n),c=await this.client.core.history.get(s,t),u=ts[c.request.method].res;this.client.core.relayer.publish(s,o,u),await this.client.core.history.resolve(n)},this.cleanup=async()=>{const t=[],s=[];this.client.session.getAll().forEach(r=>{ai(r.expiry)&&t.push(r.topic)}),this.client.proposal.getAll().forEach(r=>{ai(r.expiry)&&s.push(r.id)}),await Promise.all([...t.map(r=>this.deleteSession(r)),...s.map(r=>this.deleteProposal(r))])},this.onRelayEventRequest=async t=>{this.requestQueue.queue.push(t),await this.processRequestsQueue()},this.processRequestsQueue=async()=>{if(this.requestQueue.state===ei.active){this.client.logger.info("Request queue already active, skipping...");return}for(this.client.logger.info(`Request queue starting with ${this.requestQueue.queue.length} requests`);this.requestQueue.queue.length>0;){this.requestQueue.state=ei.active;const t=this.requestQueue.queue.shift();if(t)try{this.processRequest(t),await new Promise(s=>setTimeout(s,300))}catch(s){this.client.logger.warn(s)}}this.requestQueue.state=ei.idle},this.processRequest=t=>{const{topic:s,payload:r}=t,n=r.method;switch(n){case"wc_sessionPropose":return this.onSessionProposeRequest(s,r);case"wc_sessionSettle":return this.onSessionSettleRequest(s,r);case"wc_sessionUpdate":return this.onSessionUpdateRequest(s,r);case"wc_sessionExtend":return this.onSessionExtendRequest(s,r);case"wc_sessionPing":return this.onSessionPingRequest(s,r);case"wc_sessionDelete":return this.onSessionDeleteRequest(s,r);case"wc_sessionRequest":return this.onSessionRequest(s,r);case"wc_sessionEvent":return this.onSessionEventRequest(s,r);default:return this.client.logger.info(`Unsupported request method ${n}`)}},this.onRelayEventResponse=async t=>{const{topic:s,payload:r}=t,n=(await this.client.core.history.get(s,r.id)).request.method;switch(n){case"wc_sessionPropose":return this.onSessionProposeResponse(s,r);case"wc_sessionSettle":return this.onSessionSettleResponse(s,r);case"wc_sessionUpdate":return this.onSessionUpdateResponse(s,r);case"wc_sessionExtend":return this.onSessionExtendResponse(s,r);case"wc_sessionPing":return this.onSessionPingResponse(s,r);case"wc_sessionRequest":return this.onSessionRequestResponse(s,r);default:return this.client.logger.info(`Unsupported response method ${n}`)}},this.onRelayEventUnknownPayload=t=>{const{topic:s}=t,{message:r}=Y("MISSING_OR_INVALID",`Decoded payload on topic ${s} is not identifiable as a JSON-RPC request or a response.`);throw new Error(r)},this.onSessionProposeRequest=async(t,s)=>{const{params:r,id:n}=s;try{this.isValidConnect(Et({},s.params));const o=Mt(V.FIVE_MINUTES),c=Et({id:n,pairingTopic:t,expiry:o},r);await this.setProposal(n,c);const u=Ui(JSON.stringify(s)),d=await this.getVerifyContext(u,c.proposer.metadata);this.client.events.emit("session_proposal",{id:n,params:c,verifyContext:d})}catch(o){await this.sendError(n,t,o),this.client.logger.error(o)}},this.onSessionProposeResponse=async(t,s)=>{const{id:r}=s;if(ut(s)){const{result:n}=s;this.client.logger.trace({type:"method",method:"onSessionProposeResponse",result:n});const o=this.client.proposal.get(r);this.client.logger.trace({type:"method",method:"onSessionProposeResponse",proposal:o});const c=o.proposer.publicKey;this.client.logger.trace({type:"method",method:"onSessionProposeResponse",selfPublicKey:c});const u=n.responderPublicKey;this.client.logger.trace({type:"method",method:"onSessionProposeResponse",peerPublicKey:u});const d=await this.client.core.crypto.generateSharedKey(c,u);this.client.logger.trace({type:"method",method:"onSessionProposeResponse",sessionTopic:d});const p=await this.client.core.relayer.subscribe(d);this.client.logger.trace({type:"method",method:"onSessionProposeResponse",subscriptionId:p}),await this.client.core.pairing.activate({topic:t})}else Ge(s)&&(await this.client.proposal.delete(r,ot("USER_DISCONNECTED")),this.events.emit(Be("session_connect"),{error:s.error}))},this.onSessionSettleRequest=async(t,s)=>{const{id:r,params:n}=s;try{this.isValidSessionSettleRequest(n);const{relay:o,controller:c,expiry:u,namespaces:d,requiredNamespaces:p,optionalNamespaces:b,sessionProperties:x,pairingTopic:O}=s.params,_=Et({topic:t,relay:o,expiry:u,namespaces:d,acknowledged:!0,pairingTopic:O,requiredNamespaces:p,optionalNamespaces:b,controller:c.publicKey,self:{publicKey:"",metadata:this.client.metadata},peer:{publicKey:c.publicKey,metadata:c.metadata}},x&&{sessionProperties:x});await this.sendResult({id:s.id,topic:t,result:!0}),this.events.emit(Be("session_connect"),{session:_}),this.cleanupDuplicatePairings(_)}catch(o){await this.sendError(r,t,o),this.client.logger.error(o)}},this.onSessionSettleResponse=async(t,s)=>{const{id:r}=s;ut(s)?(await this.client.session.update(t,{acknowledged:!0}),this.events.emit(Be("session_approve",r),{})):Ge(s)&&(await this.client.session.delete(t,ot("USER_DISCONNECTED")),this.events.emit(Be("session_approve",r),{error:s.error}))},this.onSessionUpdateRequest=async(t,s)=>{const{params:r,id:n}=s;try{const o=`${t}_session_update`,c=Fs.get(o);if(c&&this.isRequestOutOfSync(c,n)){this.client.logger.info(`Discarding out of sync request - ${n}`);return}this.isValidUpdate(Et({topic:t},r)),await this.client.session.update(t,{namespaces:r.namespaces}),await this.sendResult({id:n,topic:t,result:!0}),this.client.events.emit("session_update",{id:n,topic:t,params:r}),Fs.set(o,n)}catch(o){await this.sendError(n,t,o),this.client.logger.error(o)}},this.isRequestOutOfSync=(t,s)=>parseInt(s.toString().slice(0,-3))<=parseInt(t.toString().slice(0,-3)),this.onSessionUpdateResponse=(t,s)=>{const{id:r}=s;ut(s)?this.events.emit(Be("session_update",r),{}):Ge(s)&&this.events.emit(Be("session_update",r),{error:s.error})},this.onSessionExtendRequest=async(t,s)=>{const{id:r}=s;try{this.isValidExtend({topic:t}),await this.setExpiry(t,Mt(Us)),await this.sendResult({id:r,topic:t,result:!0}),this.client.events.emit("session_extend",{id:r,topic:t})}catch(n){await this.sendError(r,t,n),this.client.logger.error(n)}},this.onSessionExtendResponse=(t,s)=>{const{id:r}=s;ut(s)?this.events.emit(Be("session_extend",r),{}):Ge(s)&&this.events.emit(Be("session_extend",r),{error:s.error})},this.onSessionPingRequest=async(t,s)=>{const{id:r}=s;try{this.isValidPing({topic:t}),await this.sendResult({id:r,topic:t,result:!0}),this.client.events.emit("session_ping",{id:r,topic:t})}catch(n){await this.sendError(r,t,n),this.client.logger.error(n)}},this.onSessionPingResponse=(t,s)=>{const{id:r}=s;setTimeout(()=>{ut(s)?this.events.emit(Be("session_ping",r),{}):Ge(s)&&this.events.emit(Be("session_ping",r),{error:s.error})},500)},this.onSessionDeleteRequest=async(t,s)=>{const{id:r}=s;try{this.isValidDisconnect({topic:t,reason:s.params}),await Promise.all([new Promise(n=>{this.client.core.relayer.once(yt.publish,async()=>{n(await this.deleteSession(t))})}),this.sendResult({id:r,topic:t,result:!0})]),this.client.events.emit("session_delete",{id:r,topic:t})}catch(n){this.client.logger.error(n)}},this.onSessionRequest=async(t,s)=>{const{id:r,params:n}=s;try{this.isValidRequest(Et({topic:t},n));const o=Ui(JSON.stringify(ti("wc_sessionRequest",n,r))),c=this.client.session.get(t),u=await this.getVerifyContext(o,c.peer.metadata),d={id:r,topic:t,params:n,verifyContext:u};await this.setPendingSessionRequest(d),this.addSessionRequestToSessionRequestQueue(d),this.processSessionRequestQueue()}catch(o){await this.sendError(r,t,o),this.client.logger.error(o)}},this.onSessionRequestResponse=(t,s)=>{const{id:r}=s;ut(s)?this.events.emit(Be("session_request",r),{result:s.result}):Ge(s)&&this.events.emit(Be("session_request",r),{error:s.error})},this.onSessionEventRequest=async(t,s)=>{const{id:r,params:n}=s;try{const o=`${t}_session_event_${n.event.name}`,c=Fs.get(o);if(c&&this.isRequestOutOfSync(c,r)){this.client.logger.info(`Discarding out of sync request - ${r}`);return}this.isValidEmit(Et({topic:t},n)),this.client.events.emit("session_event",{id:r,topic:t,params:n}),Fs.set(o,r)}catch(o){await this.sendError(r,t,o),this.client.logger.error(o)}},this.addSessionRequestToSessionRequestQueue=t=>{this.sessionRequestQueue.queue.push(t)},this.cleanupAfterResponse=t=>{this.deletePendingSessionRequest(t.response.id,{message:"fulfilled",code:0}),setTimeout(()=>{this.sessionRequestQueue.state=ei.idle,this.processSessionRequestQueue()},V.toMiliseconds(this.requestQueueDelay))},this.processSessionRequestQueue=()=>{if(this.sessionRequestQueue.state===ei.active){this.client.logger.info("session request queue is already active.");return}const t=this.sessionRequestQueue.queue[0];if(!t){this.client.logger.info("session request queue is empty.");return}try{this.sessionRequestQueue.state=ei.active,this.client.events.emit("session_request",t)}catch(s){this.client.logger.error(s)}},this.onPairingCreated=t=>{if(t.active)return;const s=this.client.proposal.getAll().find(r=>r.pairingTopic===t.topic);s&&this.onSessionProposeRequest(t.topic,ti("wc_sessionPropose",{requiredNamespaces:s.requiredNamespaces,optionalNamespaces:s.optionalNamespaces,relays:s.relays,proposer:s.proposer},s.id))},this.isValidConnect=async t=>{if(!St(t)){const{message:u}=Y("MISSING_OR_INVALID",`connect() params: ${JSON.stringify(t)}`);throw new Error(u)}const{pairingTopic:s,requiredNamespaces:r,optionalNamespaces:n,sessionProperties:o,relays:c}=t;if(bt(s)||await this.isValidPairingTopic(s),!Gp(c,!0)){const{message:u}=Y("MISSING_OR_INVALID",`connect() relays: ${c}`);throw new Error(u)}!bt(r)&&hs(r)!==0&&this.validateNamespaces(r,"requiredNamespaces"),!bt(n)&&hs(n)!==0&&this.validateNamespaces(n,"optionalNamespaces"),bt(o)||this.validateSessionProps(o,"sessionProperties")},this.validateNamespaces=(t,s)=>{const r=Hp(t,"connect()",s);if(r)throw new Error(r.message)},this.isValidApprove=async t=>{if(!St(t))throw new Error(Y("MISSING_OR_INVALID",`approve() params: ${t}`).message);const{id:s,namespaces:r,relayProtocol:n,sessionProperties:o}=t;await this.isValidProposalId(s);const c=this.client.proposal.get(s),u=zs(r,"approve()");if(u)throw new Error(u.message);const d=Mo(c.requiredNamespaces,r,"approve()");if(d)throw new Error(d.message);if(!at(n,!0)){const{message:p}=Y("MISSING_OR_INVALID",`approve() relayProtocol: ${n}`);throw new Error(p)}bt(o)||this.validateSessionProps(o,"sessionProperties")},this.isValidReject=async t=>{if(!St(t)){const{message:n}=Y("MISSING_OR_INVALID",`reject() params: ${t}`);throw new Error(n)}const{id:s,reason:r}=t;if(await this.isValidProposalId(s),!Yp(r)){const{message:n}=Y("MISSING_OR_INVALID",`reject() reason: ${JSON.stringify(r)}`);throw new Error(n)}},this.isValidSessionSettleRequest=t=>{if(!St(t)){const{message:d}=Y("MISSING_OR_INVALID",`onSessionSettleRequest() params: ${t}`);throw new Error(d)}const{relay:s,controller:r,namespaces:n,expiry:o}=t;if(!jc(s)){const{message:d}=Y("MISSING_OR_INVALID","onSessionSettleRequest() relay protocol should be a string");throw new Error(d)}const c=jp(r,"onSessionSettleRequest()");if(c)throw new Error(c.message);const u=zs(n,"onSessionSettleRequest()");if(u)throw new Error(u.message);if(ai(o)){const{message:d}=Y("EXPIRED","onSessionSettleRequest()");throw new Error(d)}},this.isValidUpdate=async t=>{if(!St(t)){const{message:u}=Y("MISSING_OR_INVALID",`update() params: ${t}`);throw new Error(u)}const{topic:s,namespaces:r}=t;await this.isValidSessionTopic(s);const n=this.client.session.get(s),o=zs(r,"update()");if(o)throw new Error(o.message);const c=Mo(n.requiredNamespaces,r,"update()");if(c)throw new Error(c.message)},this.isValidExtend=async t=>{if(!St(t)){const{message:r}=Y("MISSING_OR_INVALID",`extend() params: ${t}`);throw new Error(r)}const{topic:s}=t;await this.isValidSessionTopic(s)},this.isValidRequest=async t=>{if(!St(t)){const{message:u}=Y("MISSING_OR_INVALID",`request() params: ${t}`);throw new Error(u)}const{topic:s,request:r,chainId:n,expiry:o}=t;await this.isValidSessionTopic(s);const{namespaces:c}=this.client.session.get(s);if(!Lo(c,n)){const{message:u}=Y("MISSING_OR_INVALID",`request() chainId: ${n}`);throw new Error(u)}if(!Jp(r)){const{message:u}=Y("MISSING_OR_INVALID",`request() ${JSON.stringify(r)}`);throw new Error(u)}if(!Zp(c,n,r.method)){const{message:u}=Y("MISSING_OR_INVALID",`request() method: ${r.method}`);throw new Error(u)}if(o&&!sg(o,Cr)){const{message:u}=Y("MISSING_OR_INVALID",`request() expiry: ${o}. Expiry must be a number (in seconds) between ${Cr.min} and ${Cr.max}`);throw new Error(u)}},this.isValidRespond=async t=>{if(!St(t)){const{message:n}=Y("MISSING_OR_INVALID",`respond() params: ${t}`);throw new Error(n)}const{topic:s,response:r}=t;if(await this.isValidSessionTopic(s),!Qp(r)){const{message:n}=Y("MISSING_OR_INVALID",`respond() response: ${JSON.stringify(r)}`);throw new Error(n)}},this.isValidPing=async t=>{if(!St(t)){const{message:r}=Y("MISSING_OR_INVALID",`ping() params: ${t}`);throw new Error(r)}const{topic:s}=t;await this.isValidSessionOrPairingTopic(s)},this.isValidEmit=async t=>{if(!St(t)){const{message:c}=Y("MISSING_OR_INVALID",`emit() params: ${t}`);throw new Error(c)}const{topic:s,event:r,chainId:n}=t;await this.isValidSessionTopic(s);const{namespaces:o}=this.client.session.get(s);if(!Lo(o,n)){const{message:c}=Y("MISSING_OR_INVALID",`emit() chainId: ${n}`);throw new Error(c)}if(!Xp(r)){const{message:c}=Y("MISSING_OR_INVALID",`emit() event: ${JSON.stringify(r)}`);throw new Error(c)}if(!eg(o,n,r.name)){const{message:c}=Y("MISSING_OR_INVALID",`emit() event: ${JSON.stringify(r)}`);throw new Error(c)}},this.isValidDisconnect=async t=>{if(!St(t)){const{message:r}=Y("MISSING_OR_INVALID",`disconnect() params: ${t}`);throw new Error(r)}const{topic:s}=t;await this.isValidSessionOrPairingTopic(s)},this.getVerifyContext=async(t,s)=>{const r={verified:{verifyUrl:s.verifyUrl||Ks,validation:"UNKNOWN",origin:s.url||""}};try{const n=await this.client.core.verify.resolve({attestationId:t,verifyUrl:s.verifyUrl});n&&(r.verified.origin=n.origin,r.verified.isScam=n.isScam,r.verified.validation=n.origin===new URL(s.url).origin?"VALID":"INVALID")}catch(n){this.client.logger.info(n)}return this.client.logger.info(`Verify context: ${JSON.stringify(r)}`),r},this.validateSessionProps=(t,s)=>{Object.values(t).forEach(r=>{if(!at(r,!1)){const{message:n}=Y("MISSING_OR_INVALID",`${s} must be in Record<string, string> format. Received: ${JSON.stringify(r)}`);throw new Error(n)}})}}async isInitialized(){if(!this.initialized){const{message:e}=Y("NOT_INITIALIZED",this.name);throw new Error(e)}await this.client.core.relayer.confirmOnlineStateOrThrow()}registerRelayerEvents(){this.client.core.relayer.on(yt.message,async e=>{const{topic:t,message:s}=e;if(this.ignoredPayloadTypes.includes(this.client.core.crypto.getPayloadType(s)))return;const r=await this.client.core.crypto.decode(t,s);try{zi(r)?(this.client.core.history.set(t,r),this.onRelayEventRequest({topic:t,payload:r})):Oi(r)?(await this.client.core.history.resolve(r),await this.onRelayEventResponse({topic:t,payload:r}),this.client.core.history.delete(t,r.id)):this.onRelayEventUnknownPayload({topic:t,payload:r})}catch(n){this.client.logger.error(n)}})}registerExpirerEvents(){this.client.core.expirer.on(Tt.expired,async e=>{const{topic:t,id:s}=Mc(e.target);if(s&&this.client.pendingRequest.keys.includes(s))return await this.deletePendingSessionRequest(s,Y("EXPIRED"),!0);t?this.client.session.keys.includes(t)&&(await this.deleteSession(t,!0),this.client.events.emit("session_expire",{topic:t})):s&&(await this.deleteProposal(s,!0),this.client.events.emit("proposal_expire",{id:s}))})}registerPairingEvents(){this.client.core.pairing.events.on(as.create,e=>this.onPairingCreated(e))}isValidPairingTopic(e){if(!at(e,!1)){const{message:t}=Y("MISSING_OR_INVALID",`pairing topic should be a string: ${e}`);throw new Error(t)}if(!this.client.core.pairing.pairings.keys.includes(e)){const{message:t}=Y("NO_MATCHING_KEY",`pairing topic doesn't exist: ${e}`);throw new Error(t)}if(ai(this.client.core.pairing.pairings.get(e).expiry)){const{message:t}=Y("EXPIRED",`pairing topic: ${e}`);throw new Error(t)}}async isValidSessionTopic(e){if(!at(e,!1)){const{message:t}=Y("MISSING_OR_INVALID",`session topic should be a string: ${e}`);throw new Error(t)}if(!this.client.session.keys.includes(e)){const{message:t}=Y("NO_MATCHING_KEY",`session topic doesn't exist: ${e}`);throw new Error(t)}if(ai(this.client.session.get(e).expiry)){await this.deleteSession(e);const{message:t}=Y("EXPIRED",`session topic: ${e}`);throw new Error(t)}}async isValidSessionOrPairingTopic(e){if(this.client.session.keys.includes(e))await this.isValidSessionTopic(e);else if(this.client.core.pairing.pairings.keys.includes(e))this.isValidPairingTopic(e);else if(at(e,!1)){const{message:t}=Y("NO_MATCHING_KEY",`session or pairing topic doesn't exist: ${e}`);throw new Error(t)}else{const{message:t}=Y("MISSING_OR_INVALID",`session or pairing topic should be a string: ${e}`);throw new Error(t)}}async isValidProposalId(e){if(!Wp(e)){const{message:t}=Y("MISSING_OR_INVALID",`proposal id should be a number: ${e}`);throw new Error(t)}if(!this.client.proposal.keys.includes(e)){const{message:t}=Y("NO_MATCHING_KEY",`proposal id doesn't exist: ${e}`);throw new Error(t)}if(ai(this.client.proposal.get(e).expiry)){await this.deleteProposal(e);const{message:t}=Y("EXPIRED",`proposal id: ${e}`);throw new Error(t)}}},ym=class extends dr{constructor(e,t){super(e,t,rm,Sn),this.core=e,this.logger=t}},mm=class extends dr{constructor(e,t){super(e,t,om,Sn),this.core=e,this.logger=t}},bm=class extends dr{constructor(e,t){super(e,t,cm,Sn,s=>s.id),this.core=e,this.logger=t}},wm=class dh extends bl{constructor(e){super(e),this.protocol=hh,this.version=uh,this.name=Rr.name,this.events=new We.EventEmitter,this.on=(s,r)=>this.events.on(s,r),this.once=(s,r)=>this.events.once(s,r),this.off=(s,r)=>this.events.off(s,r),this.removeListener=(s,r)=>this.events.removeListener(s,r),this.removeAllListeners=s=>this.events.removeAllListeners(s),this.connect=async s=>{try{return await this.engine.connect(s)}catch(r){throw this.logger.error(r.message),r}},this.pair=async s=>{try{return await this.engine.pair(s)}catch(r){throw this.logger.error(r.message),r}},this.approve=async s=>{try{return await this.engine.approve(s)}catch(r){throw this.logger.error(r.message),r}},this.reject=async s=>{try{return await this.engine.reject(s)}catch(r){throw this.logger.error(r.message),r}},this.update=async s=>{try{return await this.engine.update(s)}catch(r){throw this.logger.error(r.message),r}},this.extend=async s=>{try{return await this.engine.extend(s)}catch(r){throw this.logger.error(r.message),r}},this.request=async s=>{try{return await this.engine.request(s)}catch(r){throw this.logger.error(r.message),r}},this.respond=async s=>{try{return await this.engine.respond(s)}catch(r){throw this.logger.error(r.message),r}},this.ping=async s=>{try{return await this.engine.ping(s)}catch(r){throw this.logger.error(r.message),r}},this.emit=async s=>{try{return await this.engine.emit(s)}catch(r){throw this.logger.error(r.message),r}},this.disconnect=async s=>{try{return await this.engine.disconnect(s)}catch(r){throw this.logger.error(r.message),r}},this.find=s=>{try{return this.engine.find(s)}catch(r){throw this.logger.error(r.message),r}},this.getPendingSessionRequests=()=>{try{return this.engine.getPendingSessionRequests()}catch(s){throw this.logger.error(s.message),s}},this.name=e?.name||Rr.name,this.metadata=e?.metadata||lp();const t=typeof e?.logger<"u"&&typeof e?.logger!="string"?e.logger:ee.pino(ee.getDefaultLoggerOptions({level:e?.logger||Rr.logger}));this.core=e?.core||new sm(e),this.logger=ee.generateChildLogger(t,this.name),this.session=new mm(this.core,this.logger),this.proposal=new ym(this.core,this.logger),this.pendingRequest=new bm(this.core,this.logger),this.engine=new gm(this)}static async init(e){const t=new dh(e);return await t.initialize(),t}get context(){return ee.getLoggerContext(this.logger)}get pairing(){return this.core.pairing.pairings}async initialize(){this.logger.trace("Initialized");try{await this.core.start(),await this.session.init(),await this.proposal.init(),await this.pendingRequest.init(),await this.engine.init(),this.core.verify.init({verifyUrl:this.metadata.verifyUrl}),this.logger.info("SignClient Initialization Success")}catch(e){throw this.logger.info("SignClient Initialization Failure"),this.logger.error(e.message),e}}};const vm=()=>{const e=hn()?.os?.toLowerCase();return e?.includes("android")?"android":e?.toLowerCase().includes("ios")||e?.toLowerCase().includes("mac")&&navigator.maxTouchPoints>1?"ios":"desktop"},Ls=vm(),_m={position:"fixed",top:"0",left:"0",right:"0",bottom:"0",backgroundColor:"rgba(0,0,0,0.8)",backdropFilter:"blur(10px)",zIndex:"9999",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",color:"white",fontWeight:"500",fontFamily:"'Barlow', sans-serif"},Em={width:"840px",height:"540px",zIndex:"99999",backgroundColor:"white",border:"none",outline:"none",borderRadius:"40px",boxShadow:"0px 4px 40px 0px rgb(0 0 0), 0px 4px 8px 0px rgb(0 0 0 / 25%)",position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)"},Sm=`
  <div id="argent-mobile-modal-container" style="position: relative">
    <iframe class="argent-iframe" allow="clipboard-write"></iframe>
    <div class="argent-close-button" style="position: absolute; top: 24px; right: 24px; cursor: pointer;">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#F5F3F0"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2462 9.75382C22.7018 10.2094 22.7018 10.9481 22.2462 11.4037L17.6499 16L22.2462 20.5963C22.7018 21.0519 22.7018 21.7906 22.2462 22.2462C21.7905 22.7018 21.0519 22.7018 20.5962 22.2462L16 17.6499L11.4039 22.246C10.9482 22.7017 10.2096 22.7017 9.75394 22.246C9.29833 21.7904 9.29833 21.0517 9.75394 20.5961L14.3501 16L9.75394 11.4039C9.29833 10.9483 9.29833 10.2096 9.75394 9.75396C10.2096 9.29835 10.9482 9.29835 11.4039 9.75396L16 14.3501L20.5962 9.75382C21.0519 9.29821 21.7905 9.29821 22.2462 9.75382Z" fill="#333332"/>
      </svg>
    </div>
  </div>
`;class Im{constructor(){we(this,"bridgeUrl","https://login.argent.xyz");we(this,"mobileUrl","argent://");we(this,"type","overlay");we(this,"wcUri");we(this,"overlay");we(this,"popupWindow");we(this,"closingTimeout");we(this,"close",()=>{this.overlay?.remove(),this.popupWindow?.close(),this.overlay=void 0,this.popupWindow=void 0})}showConnectionModal(e){const t=encodeURIComponent(e),s=encodeURIComponent(window.location.href);this.showModal({desktop:`${this.bridgeUrl}?wc=${t}&device=desktop`,ios:`${this.mobileUrl}app/wc?uri=${t}&href=${s}&device=mobile`,android:`${this.mobileUrl}app/wc?uri=${t}&href=${s}&device=mobile`})}showApprovalModal(e){if(Ls==="desktop"){this.showModal({desktop:`${this.bridgeUrl}?action=sign`,ios:"",android:""});return}const t=encodeURIComponent(window.location.href);this.showModal({desktop:`${this.bridgeUrl}?action=sign&device=desktop`,ios:`${this.mobileUrl}app/wc/request?href=${t}&device=mobile`,android:`${this.mobileUrl}app/wc/request?href=${t}&device=mobile`})}closeModal(e){e?(this.overlay?.querySelector("iframe")?.contentWindow?.postMessage("argent-login.success","*"),this.popupWindow?.postMessage("argent-login.success","*"),this.closingTimeout=setTimeout(this.close,3400)):this.close()}showModal(e){if(clearTimeout(this.closingTimeout),(this.overlay||this.popupWindow)&&this.close(),Ls==="android"||Ls==="ios"){const n=document.createElement("button");n.style.display="none",n.addEventListener("click",()=>{window.location.href=e[Ls]}),n.click();return}if(this.type==="window"){const n="menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=840,height=540";this.popupWindow=window.open(e.desktop,"_blank",n)||void 0;return}const t=document.createElement("div");t.innerHTML=Sm,t.id="argent-mobile-modal-overlay";for(const[n,o]of Object.entries(_m))t.style[n]=o;document.body.appendChild(t),t.addEventListener("click",()=>this.closeModal()),this.overlay=t;const s=t.querySelector("iframe");s.setAttribute("src",e.desktop);for(const[n,o]of Object.entries(Em))s.style[n]=o;t.querySelector(".argent-close-button").addEventListener("click",()=>this.closeModal())}}const kt=new Im,Xs=$i.constants.NetworkName,Dm=async({projectId:i,chainId:e,name:t,description:s,rpcUrl:r,bridgeUrl:n=xm(e),mobileUrl:o=Om(e),modalType:c="overlay",url:u,icons:d,walletConnect:p,provider:b},x)=>{if(!n)throw new Error("bridgeUrl is required");if(!o)throw new Error("mobileUrl is required");kt.bridgeUrl=n,kt.mobileUrl=o,kt.type=c;const O={projectId:i,metadata:{name:t??"Unknown dapp",description:s??"Unknown dapp description",url:u??"#",icons:d??[],...p?.metadata}},_=await wm.init(O),C=new x({client:_,chainId:e,rpcUrl:r,provider:b});_.on("session_event",F=>{}),_.on("session_update",({topic:F,params:K})=>{const{namespaces:I}=K,D=_.session.get(F);C.updateSession({...D,namespaces:I})}),_.on("session_delete",()=>{});try{const F=_.session.getAll().find(C.isValidSession);if(F)return C.updateSession(F),C;const K={requiredNamespaces:C.getRequiredNamespaces()};Au.resetWalletConnect(),await new Promise(y=>setTimeout(y,200));const{uri:I,approval:D}=await _.connect(K);if(I){kt.showConnectionModal(I),kt.wcUri=I;const y=await D();C.updateSession(y),kt.closeModal("animateSuccess")}return C}catch{return console.error("@argent/login::error"),kt.closeModal(),null}},xm=i=>{if(!i)throw new Error(`Unknown or unsupported chainId (${i}), either specify a supported chain or set bridgeUrl.`);const e=parseInt(`${i}`);if(String(i).startsWith(Xs.SN_SEPOLIA)||e===11155111)return"https://login.hydrogen.argent47.net";if(String(i).startsWith(Xs.SN_MAIN)||e===1)return"https://login.argent.xyz"},Om=i=>{if(!i)throw new Error(`Unknown or unsupported chainId (${i}), either specify a supported chain or set mobileUrl.`);const e=parseInt(`${i}`);if(String(i).startsWith(Xs.SN_SEPOLIA)||e===11155111)return"argent-dev://";if(String(i).startsWith(Xs.SN_MAIN)||e===1)return"argent://"};class Nm extends Nt{constructor(e){super(),this.opts=e,this.protocol="wc",this.version=2}}class Pm extends Nt{constructor(e,t){super(),this.core=e,this.logger=t,this.records=new Map}}class Rm{constructor(e,t){this.logger=e,this.core=t}}class Cm extends Nt{constructor(e,t){super(),this.relayer=e,this.logger=t}}let Am=class extends Nt{constructor(e){super()}},Tm=class{constructor(e,t,s,r){this.core=e,this.logger=t,this.name=s}};class $m extends Nt{constructor(e,t){super(),this.relayer=e,this.logger=t}}class Fm extends Nt{constructor(e,t){super(),this.core=e,this.logger=t}}class Um{constructor(e,t){this.projectId=e,this.logger=t}}let Lm=class{constructor(e){this.opts=e,this.protocol="wc",this.version=2}},Mm=class{constructor(e){this.client=e}};const fh=":";function qm(i){const{namespace:e,reference:t}=i;return[e,t].join(fh)}function jm(i){const[e,t,s]=i.split(fh);return{namespace:e,reference:t,address:s}}function zm(i,e){const t=[];return i.forEach(s=>{const r=e(s);t.includes(r)||t.push(r)}),t}function Km(i){const{namespace:e,reference:t}=jm(i);return qm({namespace:e,reference:t})}function Vm(i){return zm(i,Km)}function Bm(i,e=[]){const t=[];return Object.keys(i).forEach(s=>{if(e.length&&!e.includes(s))return;const r=i[s];t.push(...r.accounts)}),t}function km(i,e=[]){const t=[];return Object.keys(i).forEach(s=>{if(e.length&&!e.includes(s))return;const r=i[s];t.push(...Vm(r.accounts))}),t}function Hm(i,e=[]){const t=[];return Object.keys(i).forEach(s=>{if(e.length&&!e.includes(s))return;const r=i[s];t.push(...In(s,r))}),t}function In(i,e){return i.includes(":")?[i]:e.chains||[]}const ph="base10",_t="base16",Jr="base64pad",Dn="utf8",gh=0,Ni=1,Gm=0,ga=1,Qr=12,xn=32;function Wm(){const i=bs.generateKeyPair();return{privateKey:Ne(i.secretKey,_t),publicKey:Ne(i.publicKey,_t)}}function Xr(){const i=li.randomBytes(xn);return Ne(i,_t)}function Ym(i,e){const t=bs.sharedKey(Ce(i,_t),Ce(e,_t)),s=new Nc(Si.SHA256,t).expand(xn);return Ne(s,_t)}function Jm(i){const e=Si.hash(Ce(i,_t));return Ne(e,_t)}function Li(i){const e=Si.hash(Ce(i,Dn));return Ne(e,_t)}function Qm(i){return Ce(`${i}`,ph)}function Ds(i){return Number(Ne(i,ph))}function Xm(i){const e=Qm(typeof i.type<"u"?i.type:gh);if(Ds(e)===Ni&&typeof i.senderPublicKey>"u")throw new Error("Missing sender public key for type 1 envelope");const t=typeof i.senderPublicKey<"u"?Ce(i.senderPublicKey,_t):void 0,s=typeof i.iv<"u"?Ce(i.iv,_t):li.randomBytes(Qr),r=new ys.ChaCha20Poly1305(Ce(i.symKey,_t)).seal(s,Ce(i.message,Dn));return eb({type:e,sealed:r,iv:s,senderPublicKey:t})}function Zm(i){const e=new ys.ChaCha20Poly1305(Ce(i.symKey,_t)),{sealed:t,iv:s}=Zs(i.encoded),r=e.open(s,t);if(r===null)throw new Error("Failed to decrypt");return Ne(r,Dn)}function eb(i){if(Ds(i.type)===Ni){if(typeof i.senderPublicKey>"u")throw new Error("Missing sender public key for type 1 envelope");return Ne(ds([i.type,i.senderPublicKey,i.iv,i.sealed]),Jr)}return Ne(ds([i.type,i.iv,i.sealed]),Jr)}function Zs(i){const e=Ce(i,Jr),t=e.slice(Gm,ga),s=ga;if(Ds(t)===Ni){const c=s+xn,u=c+Qr,d=e.slice(s,c),p=e.slice(c,u),b=e.slice(u);return{type:t,sealed:b,iv:p,senderPublicKey:d}}const r=s+Qr,n=e.slice(s,r),o=e.slice(r);return{type:t,sealed:o,iv:n}}function tb(i,e){const t=Zs(i);return yh({type:Ds(t.type),senderPublicKey:typeof t.senderPublicKey<"u"?Ne(t.senderPublicKey,_t):void 0,receiverPublicKey:e?.receiverPublicKey})}function yh(i){const e=i?.type||gh;if(e===Ni){if(typeof i?.senderPublicKey>"u")throw new Error("missing sender public key");if(typeof i?.receiverPublicKey>"u")throw new Error("missing receiver public key")}return{type:e,senderPublicKey:i?.senderPublicKey,receiverPublicKey:i?.receiverPublicKey}}function ya(i){return i.type===Ni&&typeof i.senderPublicKey=="string"&&typeof i.receiverPublicKey=="string"}var ib=Object.defineProperty,ma=Object.getOwnPropertySymbols,sb=Object.prototype.hasOwnProperty,rb=Object.prototype.propertyIsEnumerable,ba=(i,e,t)=>e in i?ib(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,wa=(i,e)=>{for(var t in e||(e={}))sb.call(e,t)&&ba(i,t,e[t]);if(ma)for(var t of ma(e))rb.call(e,t)&&ba(i,t,e[t]);return i};const nb="ReactNative",cs={reactNative:"react-native",node:"node",browser:"browser",unknown:"unknown"},ob="js";function On(){return typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u"}function mh(){return!un()&&!!ws()&&navigator.product===nb}function Nn(){return!On()&&!!ws()}function ab(){return mh()?cs.reactNative:On()?cs.node:Nn()?cs.browser:cs.unknown}function cb(i,e){let t=ii.parse(i);return t=wa(wa({},t),e),i=ii.stringify(t),i}function hb(){return fn()||{name:"",description:"",url:"",icons:[""]}}function ub(){const i=hn();if(i===null)return"unknown";const e=i.os?i.os.replace(" ","").toLowerCase():"unknown";return i.type==="browser"?[e,i.name,i.version].join("-"):[e,i.version].join("-")}function lb(){var i;const e=ab();return e===cs.browser?[e,((i=ln())==null?void 0:i.host)||"unknown"].join(":"):e}function db(i,e,t){const s=ub(),r=lb();return[[i,e].join("-"),[ob,t].join("-"),s,r].join("/")}function fb({protocol:i,version:e,relayUrl:t,sdkVersion:s,auth:r,projectId:n,useOnCloseEvent:o}){const c=t.split("?"),u=db(i,e,s),d={auth:r,ua:u,projectId:n,useOnCloseEvent:o||void 0},p=cb(c[1]||"",d);return c[0]+"?"+p}function Ei(i,e){return i.filter(t=>e.includes(t)).length===i.length}function bh(i){return Object.fromEntries(i.entries())}function wh(i){return new Map(Object.entries(i))}function Ti(i=V.FIVE_MINUTES,e){const t=V.toMiliseconds(i||V.FIVE_MINUTES);let s,r,n;return{resolve:o=>{n&&s&&(clearTimeout(n),s(o))},reject:o=>{n&&r&&(clearTimeout(n),r(o))},done:()=>new Promise((o,c)=>{n=setTimeout(()=>{c(new Error(e))},t),s=o,r=c})}}function er(i,e,t){return new Promise(async(s,r)=>{const n=setTimeout(()=>r(new Error(t)),e);try{const o=await i;s(o)}catch(o){r(o)}clearTimeout(n)})}function vh(i,e){if(typeof e=="string"&&e.startsWith(`${i}:`))return e;if(i.toLowerCase()==="topic"){if(typeof e!="string")throw new Error('Value must be "string" for expirer target type: topic');return`topic:${e}`}else if(i.toLowerCase()==="id"){if(typeof e!="number")throw new Error('Value must be "number" for expirer target type: id');return`id:${e}`}throw new Error(`Unknown expirer target type: ${i}`)}function pb(i){return vh("topic",i)}function gb(i){return vh("id",i)}function _h(i){const[e,t]=i.split(":"),s={id:void 0,topic:void 0};if(e==="topic"&&typeof t=="string")s.topic=t;else if(e==="id"&&Number.isInteger(Number(t)))s.id=Number(t);else throw new Error(`Invalid target, expected id:number or topic:string, got ${e}:${t}`);return s}function Ht(i,e){return V.fromMiliseconds((e||Date.now())+V.toMiliseconds(i))}function ci(i){return Date.now()>=V.toMiliseconds(i)}function ke(i,e){return`${i}${e?`:${e}`:""}`}const yb="irn";function Zr(i){return i?.relay||{protocol:yb}}function Vs(i){const e=Rc[i];if(typeof e>"u")throw new Error(`Relay Protocol not supported: ${i}`);return e}var mb=Object.defineProperty,va=Object.getOwnPropertySymbols,bb=Object.prototype.hasOwnProperty,wb=Object.prototype.propertyIsEnumerable,_a=(i,e,t)=>e in i?mb(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,vb=(i,e)=>{for(var t in e||(e={}))bb.call(e,t)&&_a(i,t,e[t]);if(va)for(var t of va(e))wb.call(e,t)&&_a(i,t,e[t]);return i};function _b(i,e="-"){const t={},s="relay"+e;return Object.keys(i).forEach(r=>{if(r.startsWith(s)){const n=r.replace(s,""),o=i[r];t[n]=o}}),t}function Eb(i){const e=i.indexOf(":"),t=i.indexOf("?")!==-1?i.indexOf("?"):void 0,s=i.substring(0,e),r=i.substring(e+1,t).split("@"),n=typeof t<"u"?i.substring(t):"",o=ii.parse(n);return{protocol:s,topic:Sb(r[0]),version:parseInt(r[1],10),symKey:o.symKey,relay:_b(o)}}function Sb(i){return i.startsWith("//")?i.substring(2):i}function Ib(i,e="-"){const t="relay",s={};return Object.keys(i).forEach(r=>{const n=t+e+r;i[r]&&(s[n]=i[r])}),s}function Db(i){return`${i.protocol}:${i.topic}@${i.version}?`+ii.stringify(vb({symKey:i.symKey},Ib(i.relay)))}function Ki(i){const e=[];return i.forEach(t=>{const[s,r]=t.split(":");e.push(`${s}:${r}`)}),e}function xb(i){const e=[];return Object.values(i).forEach(t=>{e.push(...Ki(t.accounts))}),e}function Ob(i,e){const t=[];return Object.values(i).forEach(s=>{Ki(s.accounts).includes(e)&&t.push(...s.methods)}),t}function Nb(i,e){const t=[];return Object.values(i).forEach(s=>{Ki(s.accounts).includes(e)&&t.push(...s.events)}),t}function Pb(i,e){const t=Bs(i,e);if(t)throw new Error(t.message);const s={};for(const[r,n]of Object.entries(i))s[r]={methods:n.methods,events:n.events,chains:n.accounts.map(o=>`${o.split(":")[0]}:${o.split(":")[1]}`)};return s}const Rb={INVALID_METHOD:{message:"Invalid method.",code:1001},INVALID_EVENT:{message:"Invalid event.",code:1002},INVALID_UPDATE_REQUEST:{message:"Invalid update request.",code:1003},INVALID_EXTEND_REQUEST:{message:"Invalid extend request.",code:1004},INVALID_SESSION_SETTLE_REQUEST:{message:"Invalid session settle request.",code:1005},UNAUTHORIZED_METHOD:{message:"Unauthorized method.",code:3001},UNAUTHORIZED_EVENT:{message:"Unauthorized event.",code:3002},UNAUTHORIZED_UPDATE_REQUEST:{message:"Unauthorized update request.",code:3003},UNAUTHORIZED_EXTEND_REQUEST:{message:"Unauthorized extend request.",code:3004},USER_REJECTED:{message:"User rejected.",code:5e3},USER_REJECTED_CHAINS:{message:"User rejected chains.",code:5001},USER_REJECTED_METHODS:{message:"User rejected methods.",code:5002},USER_REJECTED_EVENTS:{message:"User rejected events.",code:5003},UNSUPPORTED_CHAINS:{message:"Unsupported chains.",code:5100},UNSUPPORTED_METHODS:{message:"Unsupported methods.",code:5101},UNSUPPORTED_EVENTS:{message:"Unsupported events.",code:5102},UNSUPPORTED_ACCOUNTS:{message:"Unsupported accounts.",code:5103},UNSUPPORTED_NAMESPACE_KEY:{message:"Unsupported namespace key.",code:5104},USER_DISCONNECTED:{message:"User disconnected.",code:6e3},SESSION_SETTLEMENT_FAILED:{message:"Session settlement failed.",code:7e3},WC_METHOD_UNSUPPORTED:{message:"Unsupported wc_ method.",code:10001}},Cb={NOT_INITIALIZED:{message:"Not initialized.",code:1},NO_MATCHING_KEY:{message:"No matching key.",code:2},RESTORE_WILL_OVERRIDE:{message:"Restore will override.",code:3},RESUBSCRIBED:{message:"Resubscribed.",code:4},MISSING_OR_INVALID:{message:"Missing or invalid.",code:5},EXPIRED:{message:"Expired.",code:6},UNKNOWN_TYPE:{message:"Unknown type.",code:7},MISMATCHED_TOPIC:{message:"Mismatched topic.",code:8},NON_CONFORMING_NAMESPACES:{message:"Non conforming namespaces.",code:9}};function J(i,e){const{message:t,code:s}=Cb[i];return{message:e?`${t} ${e}`:t,code:s}}function Je(i,e){const{message:t,code:s}=Rb[i];return{message:e?`${t} ${e}`:t,code:s}}function xs(i,e){return Array.isArray(i)?typeof e<"u"&&i.length?i.every(e):!0:!1}function ls(i){return Object.getPrototypeOf(i)===Object.prototype&&Object.keys(i).length}function wt(i){return typeof i>"u"}function ct(i,e){return e&&wt(i)?!0:typeof i=="string"&&!!i.trim().length}function Pn(i,e){return e&&wt(i)?!0:typeof i=="number"&&!isNaN(i)}function Ab(i,e){const{requiredNamespaces:t}=e,s=Object.keys(i.namespaces),r=Object.keys(t);let n=!0;return Ei(r,s)?(s.forEach(o=>{const{accounts:c,methods:u,events:d}=i.namespaces[o],p=Ki(c),b=t[o];(!Ei(In(o,b),p)||!Ei(b.methods,u)||!Ei(b.events,d))&&(n=!1)}),n):!1}function Rn(i){return ct(i,!1)&&i.includes(":")?i.split(":").length===2:!1}function Tb(i){if(ct(i,!1)&&i.includes(":")){const e=i.split(":");if(e.length===3){const t=e[0]+":"+e[1];return!!e[2]&&Rn(t)}}return!1}function $b(i){if(ct(i,!1))try{return typeof new URL(i)<"u"}catch{return!1}return!1}function Fb(i){var e;return(e=i?.proposer)==null?void 0:e.publicKey}function Ub(i){return i?.topic}function Lb(i,e){let t=null;return ct(i?.publicKey,!1)||(t=J("MISSING_OR_INVALID",`${e} controller public key should be a string`)),t}function Ea(i){let e=!0;return xs(i)?i.length&&(e=i.every(t=>ct(t,!1))):e=!1,e}function Mb(i,e,t){let s=null;return xs(e)?e.forEach(r=>{s||(!Rn(r)||!r.includes(i))&&(s=Je("UNSUPPORTED_CHAINS",`${t}, chain ${r} should be a string and conform to "namespace:chainId" format`))}):s=Je("UNSUPPORTED_CHAINS",`${t}, chains ${e} should be an array of strings conforming to "namespace:chainId" format`),s}function qb(i,e){let t=null;return Object.entries(i).forEach(([s,r])=>{if(t)return;const n=Mb(s,In(s,r),`${e} requiredNamespace`);n&&(t=n)}),t}function jb(i,e){let t=null;return xs(i)?i.forEach(s=>{t||Tb(s)||(t=Je("UNSUPPORTED_ACCOUNTS",`${e}, account ${s} should be a string and conform to "namespace:chainId:address" format`))}):t=Je("UNSUPPORTED_ACCOUNTS",`${e}, accounts should be an array of strings conforming to "namespace:chainId:address" format`),t}function zb(i,e){let t=null;return Object.values(i).forEach(s=>{if(t)return;const r=jb(s?.accounts,`${e} namespace`);r&&(t=r)}),t}function Kb(i,e){let t=null;return Ea(i?.methods)?Ea(i?.events)||(t=Je("UNSUPPORTED_EVENTS",`${e}, events should be an array of strings or empty array for no events`)):t=Je("UNSUPPORTED_METHODS",`${e}, methods should be an array of strings or empty array for no methods`),t}function Eh(i,e){let t=null;return Object.values(i).forEach(s=>{if(t)return;const r=Kb(s,`${e}, namespace`);r&&(t=r)}),t}function Vb(i,e,t){let s=null;if(i&&ls(i)){const r=Eh(i,e);r&&(s=r);const n=qb(i,e);n&&(s=n)}else s=J("MISSING_OR_INVALID",`${e}, ${t} should be an object with data`);return s}function Bs(i,e){let t=null;if(i&&ls(i)){const s=Eh(i,e);s&&(t=s);const r=zb(i,e);r&&(t=r)}else t=J("MISSING_OR_INVALID",`${e}, namespaces should be an object with data`);return t}function Sh(i){return ct(i.protocol,!0)}function Bb(i,e){let t=!1;return e&&!i?t=!0:i&&xs(i)&&i.length&&i.forEach(s=>{t=Sh(s)}),t}function kb(i){return typeof i=="number"}function It(i){return typeof i<"u"&&typeof i!==null}function Hb(i){return!(!i||typeof i!="object"||!i.code||!Pn(i.code,!1)||!i.message||!ct(i.message,!1))}function Gb(i){return!(wt(i)||!ct(i.method,!1))}function Wb(i){return!(wt(i)||wt(i.result)&&wt(i.error)||!Pn(i.id,!1)||!ct(i.jsonrpc,!1))}function Yb(i){return!(wt(i)||!ct(i.name,!1))}function Sa(i,e){return!(!Rn(e)||!xb(i).includes(e))}function Jb(i,e,t){return ct(t,!1)?Ob(i,e).includes(t):!1}function Qb(i,e,t){return ct(t,!1)?Nb(i,e).includes(t):!1}function Ia(i,e,t){let s=null;const r=Xb(i),n=Zb(e),o=Object.keys(r),c=Object.keys(n),u=Da(Object.keys(i)),d=Da(Object.keys(e)),p=u.filter(b=>!d.includes(b));return p.length&&(s=J("NON_CONFORMING_NAMESPACES",`${t} namespaces keys don't satisfy requiredNamespaces.
      Required: ${p.toString()}
      Received: ${Object.keys(e).toString()}`)),Ei(o,c)||(s=J("NON_CONFORMING_NAMESPACES",`${t} namespaces chains don't satisfy required namespaces.
      Required: ${o.toString()}
      Approved: ${c.toString()}`)),Object.keys(e).forEach(b=>{if(!b.includes(":")||s)return;const x=Ki(e[b].accounts);x.includes(b)||(s=J("NON_CONFORMING_NAMESPACES",`${t} namespaces accounts don't satisfy namespace accounts for ${b}
        Required: ${b}
        Approved: ${x.toString()}`))}),o.forEach(b=>{s||(Ei(r[b].methods,n[b].methods)?Ei(r[b].events,n[b].events)||(s=J("NON_CONFORMING_NAMESPACES",`${t} namespaces events don't satisfy namespace events for ${b}`)):s=J("NON_CONFORMING_NAMESPACES",`${t} namespaces methods don't satisfy namespace methods for ${b}`))}),s}function Xb(i){const e={};return Object.keys(i).forEach(t=>{var s;t.includes(":")?e[t]=i[t]:(s=i[t].chains)==null||s.forEach(r=>{e[r]={methods:i[t].methods,events:i[t].events}})}),e}function Da(i){return[...new Set(i.map(e=>e.includes(":")?e.split(":")[0]:e))]}function Zb(i){const e={};return Object.keys(i).forEach(t=>{t.includes(":")?e[t]=i[t]:Ki(i[t].accounts)?.forEach(r=>{e[r]={accounts:i[t].accounts.filter(n=>n.includes(`${r}:`)),methods:i[t].methods,events:i[t].events}})}),e}function ew(i,e){return Pn(i,!1)&&i<=e.max&&i>=e.min}function tw(i,e){if(i.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),s=0;s<t.length;s++)t[s]=255;for(var r=0;r<i.length;r++){var n=i.charAt(r),o=n.charCodeAt(0);if(t[o]!==255)throw new TypeError(n+" is ambiguous");t[o]=r}var c=i.length,u=i.charAt(0),d=Math.log(c)/Math.log(256),p=Math.log(256)/Math.log(c);function b(_){if(_ instanceof Uint8Array||(ArrayBuffer.isView(_)?_=new Uint8Array(_.buffer,_.byteOffset,_.byteLength):Array.isArray(_)&&(_=Uint8Array.from(_))),!(_ instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(_.length===0)return"";for(var C=0,F=0,K=0,I=_.length;K!==I&&_[K]===0;)K++,C++;for(var D=(I-K)*p+1>>>0,y=new Uint8Array(D);K!==I;){for(var w=_[K],f=0,a=D-1;(w!==0||f<F)&&a!==-1;a--,f++)w+=256*y[a]>>>0,y[a]=w%c>>>0,w=w/c>>>0;if(w!==0)throw new Error("Non-zero carry");F=f,K++}for(var l=D-F;l!==D&&y[l]===0;)l++;for(var L=u.repeat(C);l<D;++l)L+=i.charAt(y[l]);return L}function x(_){if(typeof _!="string")throw new TypeError("Expected String");if(_.length===0)return new Uint8Array;var C=0;if(_[C]!==" "){for(var F=0,K=0;_[C]===u;)F++,C++;for(var I=(_.length-C)*d+1>>>0,D=new Uint8Array(I);_[C];){var y=t[_.charCodeAt(C)];if(y===255)return;for(var w=0,f=I-1;(y!==0||w<K)&&f!==-1;f--,w++)y+=c*D[f]>>>0,D[f]=y%256>>>0,y=y/256>>>0;if(y!==0)throw new Error("Non-zero carry");K=w,C++}if(_[C]!==" "){for(var a=I-K;a!==I&&D[a]===0;)a++;for(var l=new Uint8Array(F+(I-a)),L=F;a!==I;)l[L++]=D[a++];return l}}}function O(_){var C=x(_);if(C)return C;throw new Error(`Non-${e} character`)}return{encode:b,decodeUnsafe:x,decode:O}}var iw=tw,sw=iw;const Ih=i=>{if(i instanceof Uint8Array&&i.constructor.name==="Uint8Array")return i;if(i instanceof ArrayBuffer)return new Uint8Array(i);if(ArrayBuffer.isView(i))return new Uint8Array(i.buffer,i.byteOffset,i.byteLength);throw new Error("Unknown type, must be binary type")},rw=i=>new TextEncoder().encode(i),nw=i=>new TextDecoder().decode(i);class ow{constructor(e,t,s){this.name=e,this.prefix=t,this.baseEncode=s}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class aw{constructor(e,t,s){if(this.name=e,this.prefix=t,t.codePointAt(0)===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=t.codePointAt(0),this.baseDecode=s}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Dh(this,e)}}class cw{constructor(e){this.decoders=e}or(e){return Dh(this,e)}decode(e){const t=e[0],s=this.decoders[t];if(s)return s.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}const Dh=(i,e)=>new cw({...i.decoders||{[i.prefix]:i},...e.decoders||{[e.prefix]:e}});class hw{constructor(e,t,s,r){this.name=e,this.prefix=t,this.baseEncode=s,this.baseDecode=r,this.encoder=new ow(e,t,s),this.decoder=new aw(e,t,r)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}const fr=({name:i,prefix:e,encode:t,decode:s})=>new hw(i,e,t,s),Os=({prefix:i,name:e,alphabet:t})=>{const{encode:s,decode:r}=sw(t,e);return fr({prefix:i,name:e,encode:s,decode:n=>Ih(r(n))})},uw=(i,e,t,s)=>{const r={};for(let p=0;p<e.length;++p)r[e[p]]=p;let n=i.length;for(;i[n-1]==="=";)--n;const o=new Uint8Array(n*t/8|0);let c=0,u=0,d=0;for(let p=0;p<n;++p){const b=r[i[p]];if(b===void 0)throw new SyntaxError(`Non-${s} character`);u=u<<t|b,c+=t,c>=8&&(c-=8,o[d++]=255&u>>c)}if(c>=t||255&u<<8-c)throw new SyntaxError("Unexpected end of data");return o},lw=(i,e,t)=>{const s=e[e.length-1]==="=",r=(1<<t)-1;let n="",o=0,c=0;for(let u=0;u<i.length;++u)for(c=c<<8|i[u],o+=8;o>t;)o-=t,n+=e[r&c>>o];if(o&&(n+=e[r&c<<t-o]),s)for(;n.length*t&7;)n+="=";return n},ft=({name:i,prefix:e,bitsPerChar:t,alphabet:s})=>fr({prefix:e,name:i,encode(r){return lw(r,s,t)},decode(r){return uw(r,s,t,i)}}),dw=fr({prefix:"\0",name:"identity",encode:i=>nw(i),decode:i=>rw(i)});var fw=Object.freeze({__proto__:null,identity:dw});const pw=ft({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1});var gw=Object.freeze({__proto__:null,base2:pw});const yw=ft({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3});var mw=Object.freeze({__proto__:null,base8:yw});const bw=Os({prefix:"9",name:"base10",alphabet:"0123456789"});var ww=Object.freeze({__proto__:null,base10:bw});const vw=ft({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),_w=ft({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4});var Ew=Object.freeze({__proto__:null,base16:vw,base16upper:_w});const Sw=ft({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),Iw=ft({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),Dw=ft({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),xw=ft({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),Ow=ft({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),Nw=ft({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),Pw=ft({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),Rw=ft({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),Cw=ft({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});var Aw=Object.freeze({__proto__:null,base32:Sw,base32upper:Iw,base32pad:Dw,base32padupper:xw,base32hex:Ow,base32hexupper:Nw,base32hexpad:Pw,base32hexpadupper:Rw,base32z:Cw});const Tw=Os({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),$w=Os({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"});var Fw=Object.freeze({__proto__:null,base36:Tw,base36upper:$w});const Uw=Os({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),Lw=Os({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var Mw=Object.freeze({__proto__:null,base58btc:Uw,base58flickr:Lw});const qw=ft({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),jw=ft({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),zw=ft({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),Kw=ft({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});var Vw=Object.freeze({__proto__:null,base64:qw,base64pad:jw,base64url:zw,base64urlpad:Kw});const xh=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),Bw=xh.reduce((i,e,t)=>(i[t]=e,i),[]),kw=xh.reduce((i,e,t)=>(i[e.codePointAt(0)]=t,i),[]);function Hw(i){return i.reduce((e,t)=>(e+=Bw[t],e),"")}function Gw(i){const e=[];for(const t of i){const s=kw[t.codePointAt(0)];if(s===void 0)throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const Ww=fr({prefix:"🚀",name:"base256emoji",encode:Hw,decode:Gw});var Yw=Object.freeze({__proto__:null,base256emoji:Ww}),Jw=Oh,xa=128,Qw=127,Xw=~Qw,Zw=Math.pow(2,31);function Oh(i,e,t){e=e||[],t=t||0;for(var s=t;i>=Zw;)e[t++]=i&255|xa,i/=128;for(;i&Xw;)e[t++]=i&255|xa,i>>>=7;return e[t]=i|0,Oh.bytes=t-s+1,e}var e0=en,t0=128,Oa=127;function en(i,s){var t=0,s=s||0,r=0,n=s,o,c=i.length;do{if(n>=c)throw en.bytes=0,new RangeError("Could not decode varint");o=i[n++],t+=r<28?(o&Oa)<<r:(o&Oa)*Math.pow(2,r),r+=7}while(o>=t0);return en.bytes=n-s,t}var i0=Math.pow(2,7),s0=Math.pow(2,14),r0=Math.pow(2,21),n0=Math.pow(2,28),o0=Math.pow(2,35),a0=Math.pow(2,42),c0=Math.pow(2,49),h0=Math.pow(2,56),u0=Math.pow(2,63),l0=function(i){return i<i0?1:i<s0?2:i<r0?3:i<n0?4:i<o0?5:i<a0?6:i<c0?7:i<h0?8:i<u0?9:10},d0={encode:Jw,decode:e0,encodingLength:l0},Nh=d0;const Na=(i,e,t=0)=>(Nh.encode(i,e,t),e),Pa=i=>Nh.encodingLength(i),tn=(i,e)=>{const t=e.byteLength,s=Pa(i),r=s+Pa(t),n=new Uint8Array(r+t);return Na(i,n,0),Na(t,n,s),n.set(e,r),new f0(i,t,e,n)};class f0{constructor(e,t,s,r){this.code=e,this.size=t,this.digest=s,this.bytes=r}}const Ph=({name:i,code:e,encode:t})=>new p0(i,e,t);class p0{constructor(e,t,s){this.name=e,this.code=t,this.encode=s}digest(e){if(e instanceof Uint8Array){const t=this.encode(e);return t instanceof Uint8Array?tn(this.code,t):t.then(s=>tn(this.code,s))}else throw Error("Unknown type, must be binary type")}}const Rh=i=>async e=>new Uint8Array(await crypto.subtle.digest(i,e)),g0=Ph({name:"sha2-256",code:18,encode:Rh("SHA-256")}),y0=Ph({name:"sha2-512",code:19,encode:Rh("SHA-512")});var m0=Object.freeze({__proto__:null,sha256:g0,sha512:y0});const Ch=0,b0="identity",Ah=Ih,w0=i=>tn(Ch,Ah(i)),v0={code:Ch,name:b0,encode:Ah,digest:w0};var _0=Object.freeze({__proto__:null,identity:v0});new TextEncoder,new TextDecoder;const Ra={...fw,...gw,...mw,...ww,...Ew,...Aw,...Fw,...Mw,...Vw,...Yw};({...m0,..._0});function Th(i){return globalThis.Buffer!=null?new Uint8Array(i.buffer,i.byteOffset,i.byteLength):i}function E0(i=0){return globalThis.Buffer!=null&&globalThis.Buffer.allocUnsafe!=null?Th(globalThis.Buffer.allocUnsafe(i)):new Uint8Array(i)}function $h(i,e,t,s){return{name:i,prefix:e,encoder:{name:i,prefix:e,encode:t},decoder:{decode:s}}}const Ca=$h("utf8","u",i=>"u"+new TextDecoder("utf8").decode(i),i=>new TextEncoder().encode(i.substring(1))),Ar=$h("ascii","a",i=>{let e="a";for(let t=0;t<i.length;t++)e+=String.fromCharCode(i[t]);return e},i=>{i=i.substring(1);const e=E0(i.length);for(let t=0;t<i.length;t++)e[t]=i.charCodeAt(t);return e}),S0={utf8:Ca,"utf-8":Ca,hex:Ra.base16,latin1:Ar,ascii:Ar,binary:Ar,...Ra};function I0(i,e="utf8"){const t=S0[e];if(!t)throw new Error(`Unsupported encoding "${e}"`);return(e==="utf8"||e==="utf-8")&&globalThis.Buffer!=null&&globalThis.Buffer.from!=null?Th(globalThis.Buffer.from(i,"utf-8")):t.decoder.decode(`${t.prefix}${i}`)}const Fh="wc",D0=2,Cn="core",ui=`${Fh}@2:${Cn}:`,x0={name:Cn,logger:"error"},O0={database:":memory:"},N0="crypto",Aa="client_ed25519_seed",P0=V.ONE_DAY,R0="keychain",C0="0.3",A0="messages",T0="0.3",$0=V.SIX_HOURS,F0="publisher",Uh="irn",U0="error",Lh="wss://relay.walletconnect.com",L0="relayer",He={message:"relayer_message",message_ack:"relayer_message_ack",connect:"relayer_connect",disconnect:"relayer_disconnect",error:"relayer_error",connection_stalled:"relayer_connection_stalled",transport_closed:"relayer_transport_closed",publish:"relayer_publish"},M0="_subscription",ss={payload:"payload",connect:"connect",disconnect:"disconnect",error:"error"},q0=V.ONE_SECOND/2,j0="y",z0=1e4,K0="0.3",Bt={created:"subscription_created",deleted:"subscription_deleted",expired:"subscription_expired",disabled:"subscription_disabled",sync:"subscription_sync",resubscribed:"subscription_resubscribed"},V0="subscription",B0="0.3",k0=V.FIVE_SECONDS*1e3,H0="pairing",G0="0.3",rs={wc_pairingDelete:{req:{ttl:V.ONE_DAY,prompt:!1,tag:1e3},res:{ttl:V.ONE_DAY,prompt:!1,tag:1001}},wc_pairingPing:{req:{ttl:V.THIRTY_SECONDS,prompt:!1,tag:1002},res:{ttl:V.THIRTY_SECONDS,prompt:!1,tag:1003}},unregistered_method:{req:{ttl:V.ONE_DAY,prompt:!1,tag:0},res:{ttl:V.ONE_DAY,prompt:!1,tag:0}}},Kt={created:"history_created",updated:"history_updated",deleted:"history_deleted",sync:"history_sync"},W0="history",Y0="0.3",J0="expirer",$t={created:"expirer_created",deleted:"expirer_deleted",expired:"expirer_expired",sync:"expirer_sync"},Q0="0.3",Tr="verify-api",Ta="https://verify.walletconnect.com";class X0{constructor(e,t){this.core=e,this.logger=t,this.keychain=new Map,this.name=R0,this.version=C0,this.initialized=!1,this.storagePrefix=ui,this.init=async()=>{if(!this.initialized){const s=await this.getKeyChain();typeof s<"u"&&(this.keychain=s),this.initialized=!0}},this.has=s=>(this.isInitialized(),this.keychain.has(s)),this.set=async(s,r)=>{this.isInitialized(),this.keychain.set(s,r),await this.persist()},this.get=s=>{this.isInitialized();const r=this.keychain.get(s);if(typeof r>"u"){const{message:n}=J("NO_MATCHING_KEY",`${this.name}: ${s}`);throw new Error(n)}return r},this.del=async s=>{this.isInitialized(),this.keychain.delete(s),await this.persist()},this.core=e,this.logger=ee.generateChildLogger(t,this.name)}get context(){return ee.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}async setKeyChain(e){await this.core.storage.setItem(this.storageKey,bh(e))}async getKeyChain(){const e=await this.core.storage.getItem(this.storageKey);return typeof e<"u"?wh(e):void 0}async persist(){await this.setKeyChain(this.keychain)}isInitialized(){if(!this.initialized){const{message:e}=J("NOT_INITIALIZED",this.name);throw new Error(e)}}}class Z0{constructor(e,t,s){this.core=e,this.logger=t,this.name=N0,this.initialized=!1,this.init=async()=>{this.initialized||(await this.keychain.init(),this.initialized=!0)},this.hasKeys=r=>(this.isInitialized(),this.keychain.has(r)),this.getClientId=async()=>{this.isInitialized();const r=await this.getClientSeed(),n=Ws(r);return an(n.publicKey)},this.generateKeyPair=()=>{this.isInitialized();const r=Wm();return this.setPrivateKey(r.publicKey,r.privateKey)},this.signJWT=async r=>{this.isInitialized();const n=await this.getClientSeed(),o=Ws(n),c=Xr();return await Ec(c,r,P0,o)},this.generateSharedKey=(r,n,o)=>{this.isInitialized();const c=this.getPrivateKey(r),u=Ym(c,n);return this.setSymKey(u,o)},this.setSymKey=async(r,n)=>{this.isInitialized();const o=n||Jm(r);return await this.keychain.set(o,r),o},this.deleteKeyPair=async r=>{this.isInitialized(),await this.keychain.del(r)},this.deleteSymKey=async r=>{this.isInitialized(),await this.keychain.del(r)},this.encode=async(r,n,o)=>{this.isInitialized();const c=yh(o),u=rr(n);if(ya(c)){const x=c.senderPublicKey,O=c.receiverPublicKey;r=await this.generateSharedKey(x,O)}const d=this.getSymKey(r),{type:p,senderPublicKey:b}=c;return Xm({type:p,symKey:d,message:u,senderPublicKey:b})},this.decode=async(r,n,o)=>{this.isInitialized();const c=tb(n,o);if(ya(c)){const p=c.receiverPublicKey,b=c.senderPublicKey;r=await this.generateSharedKey(p,b)}const u=this.getSymKey(r),d=Zm({symKey:u,encoded:n});return rn(d)},this.getPayloadType=r=>{const n=Zs(r);return Ds(n.type)},this.getPayloadSenderPublicKey=r=>{const n=Zs(r);return n.senderPublicKey?Ne(n.senderPublicKey,_t):void 0},this.core=e,this.logger=ee.generateChildLogger(t,this.name),this.keychain=s||new X0(this.core,this.logger)}get context(){return ee.getLoggerContext(this.logger)}async setPrivateKey(e,t){return await this.keychain.set(e,t),e}getPrivateKey(e){return this.keychain.get(e)}async getClientSeed(){let e="";try{e=this.keychain.get(Aa)}catch{e=Xr(),await this.keychain.set(Aa,e)}return I0(e,"base16")}getSymKey(e){return this.keychain.get(e)}isInitialized(){if(!this.initialized){const{message:e}=J("NOT_INITIALIZED",this.name);throw new Error(e)}}}class ev extends Rm{constructor(e,t){super(e,t),this.logger=e,this.core=t,this.messages=new Map,this.name=A0,this.version=T0,this.initialized=!1,this.storagePrefix=ui,this.init=async()=>{if(!this.initialized){this.logger.trace("Initialized");try{const s=await this.getRelayerMessages();typeof s<"u"&&(this.messages=s),this.logger.debug(`Successfully Restored records for ${this.name}`),this.logger.trace({type:"method",method:"restore",size:this.messages.size})}catch(s){this.logger.debug(`Failed to Restore records for ${this.name}`),this.logger.error(s)}finally{this.initialized=!0}}},this.set=async(s,r)=>{this.isInitialized();const n=Li(r);let o=this.messages.get(s);return typeof o>"u"&&(o={}),typeof o[n]<"u"||(o[n]=r,this.messages.set(s,o),await this.persist()),n},this.get=s=>{this.isInitialized();let r=this.messages.get(s);return typeof r>"u"&&(r={}),r},this.has=(s,r)=>{this.isInitialized();const n=this.get(s),o=Li(r);return typeof n[o]<"u"},this.del=async s=>{this.isInitialized(),this.messages.delete(s),await this.persist()},this.logger=ee.generateChildLogger(e,this.name),this.core=t}get context(){return ee.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}async setRelayerMessages(e){await this.core.storage.setItem(this.storageKey,bh(e))}async getRelayerMessages(){const e=await this.core.storage.getItem(this.storageKey);return typeof e<"u"?wh(e):void 0}async persist(){await this.setRelayerMessages(this.messages)}isInitialized(){if(!this.initialized){const{message:e}=J("NOT_INITIALIZED",this.name);throw new Error(e)}}}class tv extends Cm{constructor(e,t){super(e,t),this.relayer=e,this.logger=t,this.events=new We.EventEmitter,this.name=F0,this.queue=new Map,this.publishTimeout=1e4,this.publish=async(s,r,n)=>{this.logger.debug("Publishing Payload"),this.logger.trace({type:"method",method:"publish",params:{topic:s,message:r,opts:n}});try{const o=n?.ttl||$0,c=Zr(n),u=n?.prompt||!1,d=n?.tag||0,p=n?.id||vn().toString(),b={topic:s,message:r,opts:{ttl:o,relay:c,prompt:u,tag:d,id:p}};this.queue.set(p,b);try{await await er(this.rpcPublish(s,r,o,c,u,d,p),this.publishTimeout),this.relayer.events.emit(He.publish,b)}catch{this.logger.debug("Publishing Payload stalled"),this.relayer.events.emit(He.connection_stalled);return}this.logger.debug("Successfully Published Payload"),this.logger.trace({type:"method",method:"publish",params:{topic:s,message:r,opts:n}})}catch(o){throw this.logger.debug("Failed to Publish Payload"),this.logger.error(o),o}},this.on=(s,r)=>{this.events.on(s,r)},this.once=(s,r)=>{this.events.once(s,r)},this.off=(s,r)=>{this.events.off(s,r)},this.removeListener=(s,r)=>{this.events.removeListener(s,r)},this.relayer=e,this.logger=ee.generateChildLogger(t,this.name),this.registerEventListeners()}get context(){return ee.getLoggerContext(this.logger)}rpcPublish(e,t,s,r,n,o,c){var u,d,p,b;const x={method:Vs(r.protocol).publish,params:{topic:e,message:t,ttl:s,prompt:n,tag:o},id:c};return wt((u=x.params)==null?void 0:u.prompt)&&((d=x.params)==null||delete d.prompt),wt((p=x.params)==null?void 0:p.tag)&&((b=x.params)==null||delete b.tag),this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"message",direction:"outgoing",request:x}),this.relayer.request(x)}onPublish(e){this.queue.delete(e)}checkQueue(){this.queue.forEach(async e=>{const{topic:t,message:s,opts:r}=e;await this.publish(t,s,r)})}registerEventListeners(){this.relayer.core.heartbeat.on(Wt.HEARTBEAT_EVENTS.pulse,()=>{this.checkQueue()}),this.relayer.on(He.message_ack,e=>{this.onPublish(e.id.toString())})}}class iv{constructor(){this.map=new Map,this.set=(e,t)=>{const s=this.get(e);this.exists(e,t)||this.map.set(e,[...s,t])},this.get=e=>this.map.get(e)||[],this.exists=(e,t)=>this.get(e).includes(t),this.delete=(e,t)=>{if(typeof t>"u"){this.map.delete(e);return}if(!this.map.has(e))return;const s=this.get(e);if(!this.exists(e,t))return;const r=s.filter(n=>n!==t);if(!r.length){this.map.delete(e);return}this.map.set(e,r)},this.clear=()=>{this.map.clear()}}get topics(){return Array.from(this.map.keys())}}var sv=Object.defineProperty,rv=Object.defineProperties,nv=Object.getOwnPropertyDescriptors,$a=Object.getOwnPropertySymbols,ov=Object.prototype.hasOwnProperty,av=Object.prototype.propertyIsEnumerable,Fa=(i,e,t)=>e in i?sv(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,ns=(i,e)=>{for(var t in e||(e={}))ov.call(e,t)&&Fa(i,t,e[t]);if($a)for(var t of $a(e))av.call(e,t)&&Fa(i,t,e[t]);return i},$r=(i,e)=>rv(i,nv(e));class cv extends $m{constructor(e,t){super(e,t),this.relayer=e,this.logger=t,this.subscriptions=new Map,this.topicMap=new iv,this.events=new We.EventEmitter,this.name=V0,this.version=B0,this.pending=new Map,this.cached=[],this.initialized=!1,this.pendingSubscriptionWatchLabel="pending_sub_watch_label",this.pollingInterval=20,this.storagePrefix=ui,this.subscribeTimeout=1e4,this.restartInProgress=!1,this.batchSubscribeTopicsLimit=500,this.init=async()=>{this.initialized||(this.logger.trace("Initialized"),await this.restart(),this.registerEventListeners(),this.onEnable(),this.clientId=await this.relayer.core.crypto.getClientId())},this.subscribe=async(s,r)=>{await this.restartToComplete(),this.isInitialized(),this.logger.debug("Subscribing Topic"),this.logger.trace({type:"method",method:"subscribe",params:{topic:s,opts:r}});try{const n=Zr(r),o={topic:s,relay:n};this.pending.set(s,o);const c=await this.rpcSubscribe(s,n);return this.onSubscribe(c,o),this.logger.debug("Successfully Subscribed Topic"),this.logger.trace({type:"method",method:"subscribe",params:{topic:s,opts:r}}),c}catch(n){throw this.logger.debug("Failed to Subscribe Topic"),this.logger.error(n),n}},this.unsubscribe=async(s,r)=>{await this.restartToComplete(),this.isInitialized(),typeof r?.id<"u"?await this.unsubscribeById(s,r.id,r):await this.unsubscribeByTopic(s,r)},this.isSubscribed=async s=>this.topics.includes(s)?!0:await new Promise((r,n)=>{const o=new V.Watch;o.start(this.pendingSubscriptionWatchLabel);const c=setInterval(()=>{!this.pending.has(s)&&this.topics.includes(s)&&(clearInterval(c),o.stop(this.pendingSubscriptionWatchLabel),r(!0)),o.elapsed(this.pendingSubscriptionWatchLabel)>=k0&&(clearInterval(c),o.stop(this.pendingSubscriptionWatchLabel),n(new Error("Subscription resolution timeout")))},this.pollingInterval)}).catch(()=>!1),this.on=(s,r)=>{this.events.on(s,r)},this.once=(s,r)=>{this.events.once(s,r)},this.off=(s,r)=>{this.events.off(s,r)},this.removeListener=(s,r)=>{this.events.removeListener(s,r)},this.restart=async()=>{this.restartInProgress=!0,await this.restore(),await this.reset(),this.restartInProgress=!1},this.relayer=e,this.logger=ee.generateChildLogger(t,this.name),this.clientId=""}get context(){return ee.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}get length(){return this.subscriptions.size}get ids(){return Array.from(this.subscriptions.keys())}get values(){return Array.from(this.subscriptions.values())}get topics(){return this.topicMap.topics}hasSubscription(e,t){let s=!1;try{s=this.getSubscription(e).topic===t}catch{}return s}onEnable(){this.cached=[],this.initialized=!0}onDisable(){this.cached=this.values,this.subscriptions.clear(),this.topicMap.clear()}async unsubscribeByTopic(e,t){const s=this.topicMap.get(e);await Promise.all(s.map(async r=>await this.unsubscribeById(e,r,t)))}async unsubscribeById(e,t,s){this.logger.debug("Unsubscribing Topic"),this.logger.trace({type:"method",method:"unsubscribe",params:{topic:e,id:t,opts:s}});try{const r=Zr(s);await this.rpcUnsubscribe(e,t,r);const n=Je("USER_DISCONNECTED",`${this.name}, ${e}`);await this.onUnsubscribe(e,t,n),this.logger.debug("Successfully Unsubscribed Topic"),this.logger.trace({type:"method",method:"unsubscribe",params:{topic:e,id:t,opts:s}})}catch(r){throw this.logger.debug("Failed to Unsubscribe Topic"),this.logger.error(r),r}}async rpcSubscribe(e,t){const s={method:Vs(t.protocol).subscribe,params:{topic:e}};this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"payload",direction:"outgoing",request:s});try{await await er(this.relayer.request(s),this.subscribeTimeout)}catch{this.logger.debug("Outgoing Relay Subscribe Payload stalled"),this.relayer.events.emit(He.connection_stalled)}return Li(e+this.clientId)}async rpcBatchSubscribe(e){if(!e.length)return;const t=e[0].relay,s={method:Vs(t.protocol).batchSubscribe,params:{topics:e.map(r=>r.topic)}};this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"payload",direction:"outgoing",request:s});try{return await await er(this.relayer.request(s),this.subscribeTimeout)}catch{this.logger.debug("Outgoing Relay Payload stalled"),this.relayer.events.emit(He.connection_stalled)}}rpcUnsubscribe(e,t,s){const r={method:Vs(s.protocol).unsubscribe,params:{topic:e,id:t}};return this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"payload",direction:"outgoing",request:r}),this.relayer.request(r)}onSubscribe(e,t){this.setSubscription(e,$r(ns({},t),{id:e})),this.pending.delete(t.topic)}onBatchSubscribe(e){e.length&&e.forEach(t=>{this.setSubscription(t.id,ns({},t)),this.pending.delete(t.topic)})}async onUnsubscribe(e,t,s){this.events.removeAllListeners(t),this.hasSubscription(t,e)&&this.deleteSubscription(t,s),await this.relayer.messages.del(e)}async setRelayerSubscriptions(e){await this.relayer.core.storage.setItem(this.storageKey,e)}async getRelayerSubscriptions(){return await this.relayer.core.storage.getItem(this.storageKey)}setSubscription(e,t){this.subscriptions.has(e)||(this.logger.debug("Setting subscription"),this.logger.trace({type:"method",method:"setSubscription",id:e,subscription:t}),this.addSubscription(e,t))}addSubscription(e,t){this.subscriptions.set(e,ns({},t)),this.topicMap.set(t.topic,e),this.events.emit(Bt.created,t)}getSubscription(e){this.logger.debug("Getting subscription"),this.logger.trace({type:"method",method:"getSubscription",id:e});const t=this.subscriptions.get(e);if(!t){const{message:s}=J("NO_MATCHING_KEY",`${this.name}: ${e}`);throw new Error(s)}return t}deleteSubscription(e,t){this.logger.debug("Deleting subscription"),this.logger.trace({type:"method",method:"deleteSubscription",id:e,reason:t});const s=this.getSubscription(e);this.subscriptions.delete(e),this.topicMap.delete(s.topic,e),this.events.emit(Bt.deleted,$r(ns({},s),{reason:t}))}async persist(){await this.setRelayerSubscriptions(this.values),this.events.emit(Bt.sync)}async reset(){if(this.cached.length){const e=Math.ceil(this.cached.length/this.batchSubscribeTopicsLimit);for(let t=0;t<e;t++){const s=this.cached.splice(0,this.batchSubscribeTopicsLimit);await this.batchSubscribe(s)}}this.events.emit(Bt.resubscribed)}async restore(){try{const e=await this.getRelayerSubscriptions();if(typeof e>"u"||!e.length)return;if(this.subscriptions.size){const{message:t}=J("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),this.logger.error(`${this.name}: ${JSON.stringify(this.values)}`),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored subscriptions for ${this.name}`),this.logger.trace({type:"method",method:"restore",subscriptions:this.values})}catch(e){this.logger.debug(`Failed to Restore subscriptions for ${this.name}`),this.logger.error(e)}}async batchSubscribe(e){if(!e.length)return;const t=await this.rpcBatchSubscribe(e);xs(t)&&this.onBatchSubscribe(t.map((s,r)=>$r(ns({},e[r]),{id:s})))}async onConnect(){this.restartInProgress||(await this.restart(),this.onEnable())}onDisconnect(){this.onDisable()}async checkPending(){if(this.relayer.transportExplicitlyClosed)return;const e=[];this.pending.forEach(t=>{e.push(t)}),await this.batchSubscribe(e)}registerEventListeners(){this.relayer.core.heartbeat.on(Wt.HEARTBEAT_EVENTS.pulse,async()=>{await this.checkPending()}),this.relayer.on(He.connect,async()=>{await this.onConnect()}),this.relayer.on(He.disconnect,()=>{this.onDisconnect()}),this.events.on(Bt.created,async e=>{const t=Bt.created;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),await this.persist()}),this.events.on(Bt.deleted,async e=>{const t=Bt.deleted;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),await this.persist()})}isInitialized(){if(!this.initialized){const{message:e}=J("NOT_INITIALIZED",this.name);throw new Error(e)}}async restartToComplete(){this.restartInProgress&&await new Promise(e=>{const t=setInterval(()=>{this.restartInProgress||(clearInterval(t),e())},this.pollingInterval)})}}var hv=Object.defineProperty,Ua=Object.getOwnPropertySymbols,uv=Object.prototype.hasOwnProperty,lv=Object.prototype.propertyIsEnumerable,La=(i,e,t)=>e in i?hv(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,dv=(i,e)=>{for(var t in e||(e={}))uv.call(e,t)&&La(i,t,e[t]);if(Ua)for(var t of Ua(e))lv.call(e,t)&&La(i,t,e[t]);return i};class fv extends Am{constructor(e){super(e),this.protocol="wc",this.version=2,this.events=new We.EventEmitter,this.name=L0,this.transportExplicitlyClosed=!1,this.initialized=!1,this.reconnecting=!1,this.connectionStatusPollingInterval=20,this.staleConnectionErrors=["socket hang up","socket stalled"],this.request=async t=>{this.logger.debug("Publishing Request Payload");try{return await this.toEstablishConnection(),await this.provider.request(t)}catch(s){throw this.logger.debug("Failed to Publish Request"),this.logger.error(s),s}},this.core=e.core,this.logger=typeof e.logger<"u"&&typeof e.logger!="string"?ee.generateChildLogger(e.logger,this.name):ee.pino(ee.getDefaultLoggerOptions({level:e.logger||U0})),this.messages=new ev(this.logger,e.core),this.subscriber=new cv(this,this.logger),this.publisher=new tv(this,this.logger),this.relayUrl=e?.relayUrl||Lh,this.projectId=e.projectId,this.provider={}}async init(){this.logger.trace("Initialized"),await this.createProvider(),await Promise.all([this.messages.init(),this.transportOpen(),this.subscriber.init()]),this.registerEventListeners(),this.initialized=!0,setTimeout(async()=>{this.subscriber.topics.length===0&&(this.logger.info("No topics subscribted to after init, closing transport"),await this.transportClose(),this.transportExplicitlyClosed=!1)},z0)}get context(){return ee.getLoggerContext(this.logger)}get connected(){return this.provider.connection.connected}get connecting(){return this.provider.connection.connecting}async publish(e,t,s){this.isInitialized(),await this.publisher.publish(e,t,s),await this.recordMessageEvent({topic:e,message:t,publishedAt:Date.now()})}async subscribe(e,t){this.isInitialized();let s="";return await Promise.all([new Promise(r=>{this.subscriber.once(Bt.created,n=>{n.topic===e&&r()})}),new Promise(async r=>{s=await this.subscriber.subscribe(e,t),r()})]),s}async unsubscribe(e,t){this.isInitialized(),await this.subscriber.unsubscribe(e,t)}on(e,t){this.events.on(e,t)}once(e,t){this.events.once(e,t)}off(e,t){this.events.off(e,t)}removeListener(e,t){this.events.removeListener(e,t)}async transportClose(){this.transportExplicitlyClosed=!0,this.connected&&(await this.provider.disconnect(),this.events.emit(He.transport_closed))}async transportOpen(e){if(this.transportExplicitlyClosed=!1,!this.reconnecting){this.relayUrl=e||this.relayUrl,this.reconnecting=!0;try{await Promise.all([new Promise(t=>{this.initialized||t(),this.subscriber.once(Bt.resubscribed,()=>{t()})}),await Promise.race([new Promise(async(t,s)=>{await er(this.provider.connect(),5e3,"socket stalled").catch(r=>s(r)).then(()=>t()).finally(()=>this.removeListener(He.transport_closed,this.rejectTransportOpen))}),new Promise(t=>this.once(He.transport_closed,this.rejectTransportOpen))])])}catch(t){this.logger.error(t);const s=t;if(!this.isConnectionStalled(s.message))throw t;this.events.emit(He.transport_closed)}finally{this.reconnecting=!1}}}async restartTransport(e){this.transportExplicitlyClosed||(this.relayUrl=e||this.relayUrl,this.connected&&await Promise.all([new Promise(t=>{this.provider.once(ss.disconnect,()=>{t()})}),this.transportClose()]),await this.createProvider(),await this.transportOpen())}isConnectionStalled(e){return this.staleConnectionErrors.some(t=>e.includes(t))}rejectTransportOpen(){throw new Error("closeTransport called before connection was established")}async createProvider(){const e=await this.core.crypto.signJWT(this.relayUrl);this.provider=new _n(new Hc(fb({sdkVersion:j0,protocol:this.protocol,version:this.version,relayUrl:this.relayUrl,projectId:this.projectId,auth:e,useOnCloseEvent:!0}))),this.registerProviderListeners()}async recordMessageEvent(e){const{topic:t,message:s}=e;await this.messages.set(t,s)}async shouldIgnoreMessageEvent(e){const{topic:t,message:s}=e;return await this.subscriber.isSubscribed(t)?this.messages.has(t,s):!0}async onProviderPayload(e){if(this.logger.debug("Incoming Relay Payload"),this.logger.trace({type:"payload",direction:"incoming",payload:e}),zi(e)){if(!e.method.endsWith(M0))return;const t=e.params,{topic:s,message:r,publishedAt:n}=t.data,o={topic:s,message:r,publishedAt:n};this.logger.debug("Emitting Relayer Payload"),this.logger.trace(dv({type:"event",event:t.id},o)),this.events.emit(t.id,o),await this.acknowledgePayload(e),await this.onMessageEvent(o)}else Oi(e)&&this.events.emit(He.message_ack,e)}async onMessageEvent(e){await this.shouldIgnoreMessageEvent(e)||(this.events.emit(He.message,e),await this.recordMessageEvent(e))}async acknowledgePayload(e){const t=xi(e.id,!0);await this.provider.connection.send(t)}registerProviderListeners(){this.provider.on(ss.payload,e=>this.onProviderPayload(e)),this.provider.on(ss.connect,()=>{this.events.emit(He.connect)}),this.provider.on(ss.disconnect,()=>{this.onProviderDisconnect()}),this.provider.on(ss.error,e=>{this.logger.error(e),this.events.emit(He.error,e)})}registerEventListeners(){this.events.on(He.connection_stalled,async()=>{await this.restartTransport()})}onProviderDisconnect(){this.events.emit(He.disconnect),this.attemptToReconnect()}attemptToReconnect(){this.transportExplicitlyClosed||setTimeout(async()=>{await this.restartTransport()},V.toMiliseconds(q0))}isInitialized(){if(!this.initialized){const{message:e}=J("NOT_INITIALIZED",this.name);throw new Error(e)}}async toEstablishConnection(){if(!this.connected){if(this.connecting)return await new Promise(e=>{const t=setInterval(()=>{this.connected&&(clearInterval(t),e())},this.connectionStatusPollingInterval)});await this.restartTransport()}}}var pv=Object.defineProperty,Ma=Object.getOwnPropertySymbols,gv=Object.prototype.hasOwnProperty,yv=Object.prototype.propertyIsEnumerable,qa=(i,e,t)=>e in i?pv(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,ja=(i,e)=>{for(var t in e||(e={}))gv.call(e,t)&&qa(i,t,e[t]);if(Ma)for(var t of Ma(e))yv.call(e,t)&&qa(i,t,e[t]);return i};class pr extends Tm{constructor(e,t,s,r=ui,n=void 0){super(e,t,s,r),this.core=e,this.logger=t,this.name=s,this.map=new Map,this.version=K0,this.cached=[],this.initialized=!1,this.storagePrefix=ui,this.init=async()=>{this.initialized||(this.logger.trace("Initialized"),await this.restore(),this.cached.forEach(o=>{this.getKey&&o!==null&&!wt(o)?this.map.set(this.getKey(o),o):Fb(o)?this.map.set(o.id,o):Ub(o)&&this.map.set(o.topic,o)}),this.cached=[],this.initialized=!0)},this.set=async(o,c)=>{this.isInitialized(),this.map.has(o)?await this.update(o,c):(this.logger.debug("Setting value"),this.logger.trace({type:"method",method:"set",key:o,value:c}),this.map.set(o,c),await this.persist())},this.get=o=>(this.isInitialized(),this.logger.debug("Getting value"),this.logger.trace({type:"method",method:"get",key:o}),this.getData(o)),this.getAll=o=>(this.isInitialized(),o?this.values.filter(c=>Object.keys(o).every(u=>Gc(c[u],o[u]))):this.values),this.update=async(o,c)=>{this.isInitialized(),this.logger.debug("Updating value"),this.logger.trace({type:"method",method:"update",key:o,update:c});const u=ja(ja({},this.getData(o)),c);this.map.set(o,u),await this.persist()},this.delete=async(o,c)=>{this.isInitialized(),this.map.has(o)&&(this.logger.debug("Deleting value"),this.logger.trace({type:"method",method:"delete",key:o,reason:c}),this.map.delete(o),await this.persist())},this.logger=ee.generateChildLogger(t,this.name),this.storagePrefix=r,this.getKey=n}get context(){return ee.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}get length(){return this.map.size}get keys(){return Array.from(this.map.keys())}get values(){return Array.from(this.map.values())}async setDataStore(e){await this.core.storage.setItem(this.storageKey,e)}async getDataStore(){return await this.core.storage.getItem(this.storageKey)}getData(e){const t=this.map.get(e);if(!t){const{message:s}=J("NO_MATCHING_KEY",`${this.name}: ${e}`);throw this.logger.error(s),new Error(s)}return t}async persist(){await this.setDataStore(this.values)}async restore(){try{const e=await this.getDataStore();if(typeof e>"u"||!e.length)return;if(this.map.size){const{message:t}=J("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored value for ${this.name}`),this.logger.trace({type:"method",method:"restore",value:this.values})}catch(e){this.logger.debug(`Failed to Restore value for ${this.name}`),this.logger.error(e)}}isInitialized(){if(!this.initialized){const{message:e}=J("NOT_INITIALIZED",this.name);throw new Error(e)}}}class mv{constructor(e,t){this.core=e,this.logger=t,this.name=H0,this.version=G0,this.events=new ir,this.initialized=!1,this.storagePrefix=ui,this.ignoredPayloadTypes=[Ni],this.registeredMethods=[],this.init=async()=>{this.initialized||(await this.pairings.init(),await this.cleanup(),this.registerRelayerEvents(),this.registerExpirerEvents(),this.initialized=!0,this.logger.trace("Initialized"))},this.register=({methods:s})=>{this.isInitialized(),this.registeredMethods=[...new Set([...this.registeredMethods,...s])]},this.create=async()=>{this.isInitialized();const s=Xr(),r=await this.core.crypto.setSymKey(s),n=Ht(V.FIVE_MINUTES),o={protocol:Uh},c={topic:r,expiry:n,relay:o,active:!1},u=Db({protocol:this.core.protocol,version:this.core.version,topic:r,symKey:s,relay:o});return await this.pairings.set(r,c),await this.core.relayer.subscribe(r),this.core.expirer.set(r,n),{topic:r,uri:u}},this.pair=async s=>{this.isInitialized(),this.isValidPair(s);const{topic:r,symKey:n,relay:o}=Eb(s.uri);if(this.pairings.keys.includes(r))throw new Error(`Pairing already exists: ${r}`);if(this.core.crypto.hasKeys(r))throw new Error(`Keychain already exists: ${r}`);const c=Ht(V.FIVE_MINUTES),u={topic:r,relay:o,expiry:c,active:!1};return await this.pairings.set(r,u),await this.core.crypto.setSymKey(n,r),await this.core.relayer.subscribe(r,{relay:o}),this.core.expirer.set(r,c),s.activatePairing&&await this.activate({topic:r}),u},this.activate=async({topic:s})=>{this.isInitialized();const r=Ht(V.THIRTY_DAYS);await this.pairings.update(s,{active:!0,expiry:r}),this.core.expirer.set(s,r)},this.ping=async s=>{this.isInitialized(),await this.isValidPing(s);const{topic:r}=s;if(this.pairings.keys.includes(r)){const n=await this.sendRequest(r,"wc_pairingPing",{}),{done:o,resolve:c,reject:u}=Ti();this.events.once(ke("pairing_ping",n),({error:d})=>{d?u(d):c()}),await o()}},this.updateExpiry=async({topic:s,expiry:r})=>{this.isInitialized(),await this.pairings.update(s,{expiry:r})},this.updateMetadata=async({topic:s,metadata:r})=>{this.isInitialized(),await this.pairings.update(s,{peerMetadata:r})},this.getPairings=()=>(this.isInitialized(),this.pairings.values),this.disconnect=async s=>{this.isInitialized(),await this.isValidDisconnect(s);const{topic:r}=s;this.pairings.keys.includes(r)&&(await this.sendRequest(r,"wc_pairingDelete",Je("USER_DISCONNECTED")),await this.deletePairing(r))},this.sendRequest=async(s,r,n)=>{const o=ti(r,n),c=await this.core.crypto.encode(s,o),u=rs[r].req;return this.core.history.set(s,o),this.core.relayer.publish(s,c,u),o.id},this.sendResult=async(s,r,n)=>{const o=xi(s,n),c=await this.core.crypto.encode(r,o),u=await this.core.history.get(r,s),d=rs[u.request.method].res;await this.core.relayer.publish(r,c,d),await this.core.history.resolve(o)},this.sendError=async(s,r,n)=>{const o=ji(s,n),c=await this.core.crypto.encode(r,o),u=await this.core.history.get(r,s),d=rs[u.request.method]?rs[u.request.method].res:rs.unregistered_method.res;await this.core.relayer.publish(r,c,d),await this.core.history.resolve(o)},this.deletePairing=async(s,r)=>{await this.core.relayer.unsubscribe(s),await Promise.all([this.pairings.delete(s,Je("USER_DISCONNECTED")),this.core.crypto.deleteSymKey(s),r?Promise.resolve():this.core.expirer.del(s)])},this.cleanup=async()=>{const s=this.pairings.getAll().filter(r=>ci(r.expiry));await Promise.all(s.map(r=>this.deletePairing(r.topic)))},this.onRelayEventRequest=s=>{const{topic:r,payload:n}=s,o=n.method;if(this.pairings.keys.includes(r))switch(o){case"wc_pairingPing":return this.onPairingPingRequest(r,n);case"wc_pairingDelete":return this.onPairingDeleteRequest(r,n);default:return this.onUnknownRpcMethodRequest(r,n)}},this.onRelayEventResponse=async s=>{const{topic:r,payload:n}=s,o=(await this.core.history.get(r,n.id)).request.method;if(this.pairings.keys.includes(r))switch(o){case"wc_pairingPing":return this.onPairingPingResponse(r,n);default:return this.onUnknownRpcMethodResponse(o)}},this.onPairingPingRequest=async(s,r)=>{const{id:n}=r;try{this.isValidPing({topic:s}),await this.sendResult(n,s,!0),this.events.emit("pairing_ping",{id:n,topic:s})}catch(o){await this.sendError(n,s,o),this.logger.error(o)}},this.onPairingPingResponse=(s,r)=>{const{id:n}=r;setTimeout(()=>{ut(r)?this.events.emit(ke("pairing_ping",n),{}):Ge(r)&&this.events.emit(ke("pairing_ping",n),{error:r.error})},500)},this.onPairingDeleteRequest=async(s,r)=>{const{id:n}=r;try{this.isValidDisconnect({topic:s}),await this.deletePairing(s),this.events.emit("pairing_delete",{id:n,topic:s})}catch(o){await this.sendError(n,s,o),this.logger.error(o)}},this.onUnknownRpcMethodRequest=async(s,r)=>{const{id:n,method:o}=r;try{if(this.registeredMethods.includes(o))return;const c=Je("WC_METHOD_UNSUPPORTED",o);await this.sendError(n,s,c),this.logger.error(c)}catch(c){await this.sendError(n,s,c),this.logger.error(c)}},this.onUnknownRpcMethodResponse=s=>{this.registeredMethods.includes(s)||this.logger.error(Je("WC_METHOD_UNSUPPORTED",s))},this.isValidPair=s=>{if(!It(s)){const{message:r}=J("MISSING_OR_INVALID",`pair() params: ${s}`);throw new Error(r)}if(!$b(s.uri)){const{message:r}=J("MISSING_OR_INVALID",`pair() uri: ${s.uri}`);throw new Error(r)}},this.isValidPing=async s=>{if(!It(s)){const{message:n}=J("MISSING_OR_INVALID",`ping() params: ${s}`);throw new Error(n)}const{topic:r}=s;await this.isValidPairingTopic(r)},this.isValidDisconnect=async s=>{if(!It(s)){const{message:n}=J("MISSING_OR_INVALID",`disconnect() params: ${s}`);throw new Error(n)}const{topic:r}=s;await this.isValidPairingTopic(r)},this.isValidPairingTopic=async s=>{if(!ct(s,!1)){const{message:r}=J("MISSING_OR_INVALID",`pairing topic should be a string: ${s}`);throw new Error(r)}if(!this.pairings.keys.includes(s)){const{message:r}=J("NO_MATCHING_KEY",`pairing topic doesn't exist: ${s}`);throw new Error(r)}if(ci(this.pairings.get(s).expiry)){await this.deletePairing(s);const{message:r}=J("EXPIRED",`pairing topic: ${s}`);throw new Error(r)}},this.core=e,this.logger=ee.generateChildLogger(t,this.name),this.pairings=new pr(this.core,this.logger,this.name,this.storagePrefix)}get context(){return ee.getLoggerContext(this.logger)}isInitialized(){if(!this.initialized){const{message:e}=J("NOT_INITIALIZED",this.name);throw new Error(e)}}registerRelayerEvents(){this.core.relayer.on(He.message,async e=>{const{topic:t,message:s}=e;if(this.ignoredPayloadTypes.includes(this.core.crypto.getPayloadType(s)))return;const r=await this.core.crypto.decode(t,s);zi(r)?(this.core.history.set(t,r),this.onRelayEventRequest({topic:t,payload:r})):Oi(r)&&(await this.core.history.resolve(r),this.onRelayEventResponse({topic:t,payload:r}))})}registerExpirerEvents(){this.core.expirer.on($t.expired,async e=>{const{topic:t}=_h(e.target);t&&this.pairings.keys.includes(t)&&(await this.deletePairing(t,!0),this.events.emit("pairing_expire",{topic:t}))})}}class bv extends Pm{constructor(e,t){super(e,t),this.core=e,this.logger=t,this.records=new Map,this.events=new We.EventEmitter,this.name=W0,this.version=Y0,this.cached=[],this.initialized=!1,this.storagePrefix=ui,this.init=async()=>{this.initialized||(this.logger.trace("Initialized"),await this.restore(),this.cached.forEach(s=>this.records.set(s.id,s)),this.cached=[],this.registerEventListeners(),this.initialized=!0)},this.set=(s,r,n)=>{if(this.isInitialized(),this.logger.debug("Setting JSON-RPC request history record"),this.logger.trace({type:"method",method:"set",topic:s,request:r,chainId:n}),this.records.has(r.id))return;const o={id:r.id,topic:s,request:{method:r.method,params:r.params||null},chainId:n};this.records.set(o.id,o),this.events.emit(Kt.created,o)},this.resolve=async s=>{if(this.isInitialized(),this.logger.debug("Updating JSON-RPC response history record"),this.logger.trace({type:"method",method:"update",response:s}),!this.records.has(s.id))return;const r=await this.getRecord(s.id);typeof r.response>"u"&&(r.response=Ge(s)?{error:s.error}:{result:s.result},this.records.set(r.id,r),this.events.emit(Kt.updated,r))},this.get=async(s,r)=>(this.isInitialized(),this.logger.debug("Getting record"),this.logger.trace({type:"method",method:"get",topic:s,id:r}),await this.getRecord(r)),this.delete=(s,r)=>{this.isInitialized(),this.logger.debug("Deleting record"),this.logger.trace({type:"method",method:"delete",id:r}),this.values.forEach(n=>{if(n.topic===s){if(typeof r<"u"&&n.id!==r)return;this.records.delete(n.id),this.events.emit(Kt.deleted,n)}})},this.exists=async(s,r)=>(this.isInitialized(),this.records.has(r)?(await this.getRecord(r)).topic===s:!1),this.on=(s,r)=>{this.events.on(s,r)},this.once=(s,r)=>{this.events.once(s,r)},this.off=(s,r)=>{this.events.off(s,r)},this.removeListener=(s,r)=>{this.events.removeListener(s,r)},this.logger=ee.generateChildLogger(t,this.name)}get context(){return ee.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}get size(){return this.records.size}get keys(){return Array.from(this.records.keys())}get values(){return Array.from(this.records.values())}get pending(){const e=[];return this.values.forEach(t=>{if(typeof t.response<"u")return;const s={topic:t.topic,request:ti(t.request.method,t.request.params,t.id),chainId:t.chainId};return e.push(s)}),e}async setJsonRpcRecords(e){await this.core.storage.setItem(this.storageKey,e)}async getJsonRpcRecords(){return await this.core.storage.getItem(this.storageKey)}getRecord(e){this.isInitialized();const t=this.records.get(e);if(!t){const{message:s}=J("NO_MATCHING_KEY",`${this.name}: ${e}`);throw new Error(s)}return t}async persist(){await this.setJsonRpcRecords(this.values),this.events.emit(Kt.sync)}async restore(){try{const e=await this.getJsonRpcRecords();if(typeof e>"u"||!e.length)return;if(this.records.size){const{message:t}=J("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored records for ${this.name}`),this.logger.trace({type:"method",method:"restore",records:this.values})}catch(e){this.logger.debug(`Failed to Restore records for ${this.name}`),this.logger.error(e)}}registerEventListeners(){this.events.on(Kt.created,e=>{const t=Kt.created;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,record:e}),this.persist()}),this.events.on(Kt.updated,e=>{const t=Kt.updated;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,record:e}),this.persist()}),this.events.on(Kt.deleted,e=>{const t=Kt.deleted;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,record:e}),this.persist()})}isInitialized(){if(!this.initialized){const{message:e}=J("NOT_INITIALIZED",this.name);throw new Error(e)}}}class wv extends Fm{constructor(e,t){super(e,t),this.core=e,this.logger=t,this.expirations=new Map,this.events=new We.EventEmitter,this.name=J0,this.version=Q0,this.cached=[],this.initialized=!1,this.storagePrefix=ui,this.init=async()=>{this.initialized||(this.logger.trace("Initialized"),await this.restore(),this.cached.forEach(s=>this.expirations.set(s.target,s)),this.cached=[],this.registerEventListeners(),this.initialized=!0)},this.has=s=>{try{const r=this.formatTarget(s);return typeof this.getExpiration(r)<"u"}catch{return!1}},this.set=(s,r)=>{this.isInitialized();const n=this.formatTarget(s),o={target:n,expiry:r};this.expirations.set(n,o),this.checkExpiry(n,o),this.events.emit($t.created,{target:n,expiration:o})},this.get=s=>{this.isInitialized();const r=this.formatTarget(s);return this.getExpiration(r)},this.del=s=>{if(this.isInitialized(),this.has(s)){const r=this.formatTarget(s),n=this.getExpiration(r);this.expirations.delete(r),this.events.emit($t.deleted,{target:r,expiration:n})}},this.on=(s,r)=>{this.events.on(s,r)},this.once=(s,r)=>{this.events.once(s,r)},this.off=(s,r)=>{this.events.off(s,r)},this.removeListener=(s,r)=>{this.events.removeListener(s,r)},this.logger=ee.generateChildLogger(t,this.name)}get context(){return ee.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}get length(){return this.expirations.size}get keys(){return Array.from(this.expirations.keys())}get values(){return Array.from(this.expirations.values())}formatTarget(e){if(typeof e=="string")return pb(e);if(typeof e=="number")return gb(e);const{message:t}=J("UNKNOWN_TYPE",`Target type: ${typeof e}`);throw new Error(t)}async setExpirations(e){await this.core.storage.setItem(this.storageKey,e)}async getExpirations(){return await this.core.storage.getItem(this.storageKey)}async persist(){await this.setExpirations(this.values),this.events.emit($t.sync)}async restore(){try{const e=await this.getExpirations();if(typeof e>"u"||!e.length)return;if(this.expirations.size){const{message:t}=J("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored expirations for ${this.name}`),this.logger.trace({type:"method",method:"restore",expirations:this.values})}catch(e){this.logger.debug(`Failed to Restore expirations for ${this.name}`),this.logger.error(e)}}getExpiration(e){const t=this.expirations.get(e);if(!t){const{message:s}=J("NO_MATCHING_KEY",`${this.name}: ${e}`);throw this.logger.error(s),new Error(s)}return t}checkExpiry(e,t){const{expiry:s}=t;V.toMiliseconds(s)-Date.now()<=0&&this.expire(e,t)}expire(e,t){this.expirations.delete(e),this.events.emit($t.expired,{target:e,expiration:t})}checkExpirations(){this.core.relayer.connected&&this.expirations.forEach((e,t)=>this.checkExpiry(t,e))}registerEventListeners(){this.core.heartbeat.on(Wt.HEARTBEAT_EVENTS.pulse,()=>this.checkExpirations()),this.events.on($t.created,e=>{const t=$t.created;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),this.persist()}),this.events.on($t.expired,e=>{const t=$t.expired;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),this.persist()}),this.events.on($t.deleted,e=>{const t=$t.deleted;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),this.persist()})}isInitialized(){if(!this.initialized){const{message:e}=J("NOT_INITIALIZED",this.name);throw new Error(e)}}}class vv extends Um{constructor(e,t){super(e,t),this.projectId=e,this.logger=t,this.name=Tr,this.initialized=!1,this.init=async s=>{mh()||!Nn()||(this.verifyUrl=s?.verifyUrl||Ta,await this.createIframe())},this.register=async s=>{var r;this.initialized||await this.init(),this.iframe&&((r=this.iframe.contentWindow)==null||r.postMessage(s.attestationId,this.verifyUrl),this.logger.info(`postMessage sent: ${s.attestationId} ${this.verifyUrl}`))},this.resolve=async s=>{var r;if(this.isDevEnv)return"";this.logger.info(`resolving attestation: ${s.attestationId}`);const n=this.startAbortTimer(V.FIVE_SECONDS),o=await fetch(`${this.verifyUrl}/attestation/${s.attestationId}`,{signal:this.abortController.signal});return clearTimeout(n),o.status===200?(r=await o.json())==null?void 0:r.origin:""},this.createIframe=async()=>{try{await Promise.race([new Promise((s,r)=>{if(document.getElementById(Tr))return s();const n=document.createElement("iframe");n.setAttribute("id",Tr),n.setAttribute("src",`${this.verifyUrl}/${this.projectId}`),n.style.display="none",n.addEventListener("load",()=>{this.initialized=!0,s()}),n.addEventListener("error",o=>{r(o)}),document.body.append(n),this.iframe=n}),new Promise(s=>{setTimeout(()=>s("iframe load timeout"),V.toMiliseconds(V.ONE_SECOND/2))})])}catch(s){this.logger.error(`Verify iframe failed to load: ${this.verifyUrl}`),this.logger.error(s)}},this.logger=ee.generateChildLogger(t,this.name),this.verifyUrl=Ta,this.abortController=new AbortController,this.isDevEnv=On()&&process.env.IS_VITEST}get context(){return ee.getLoggerContext(this.logger)}startAbortTimer(e){return setTimeout(()=>this.abortController.abort(),V.toMiliseconds(e))}}var _v=Object.defineProperty,za=Object.getOwnPropertySymbols,Ev=Object.prototype.hasOwnProperty,Sv=Object.prototype.propertyIsEnumerable,Ka=(i,e,t)=>e in i?_v(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,Va=(i,e)=>{for(var t in e||(e={}))Ev.call(e,t)&&Ka(i,t,e[t]);if(za)for(var t of za(e))Sv.call(e,t)&&Ka(i,t,e[t]);return i};let Iv=class Mh extends Nm{constructor(e){super(e),this.protocol=Fh,this.version=D0,this.name=Cn,this.events=new We.EventEmitter,this.initialized=!1,this.on=(s,r)=>this.events.on(s,r),this.once=(s,r)=>this.events.once(s,r),this.off=(s,r)=>this.events.off(s,r),this.removeListener=(s,r)=>this.events.removeListener(s,r),this.projectId=e?.projectId,this.relayUrl=e?.relayUrl||Lh;const t=typeof e?.logger<"u"&&typeof e?.logger!="string"?e.logger:ee.pino(ee.getDefaultLoggerOptions({level:e?.logger||x0.logger}));this.logger=ee.generateChildLogger(t,this.name),this.heartbeat=new Wt.HeartBeat,this.crypto=new Z0(this,this.logger,e?.keychain),this.history=new bv(this,this.logger),this.expirer=new wv(this,this.logger),this.storage=e!=null&&e.storage?e.storage:new sc(Va(Va({},O0),e?.storageOptions)),this.relayer=new fv({core:this,logger:this.logger,relayUrl:this.relayUrl,projectId:this.projectId}),this.pairing=new mv(this,this.logger),this.verify=new vv(this.projectId||"",this.logger)}static async init(e){const t=new Mh(e);return await t.initialize(),t}get context(){return ee.getLoggerContext(this.logger)}async start(){this.initialized||await this.initialize()}async initialize(){this.logger.trace("Initialized");try{await this.crypto.init(),await this.history.init(),await this.expirer.init(),await this.relayer.init(),await this.heartbeat.init(),await this.pairing.init(),this.initialized=!0,this.logger.info("Core Initialization Success")}catch(e){throw this.logger.warn(`Core Initialization Failure at epoch ${Date.now()}`,e),this.logger.error(e.message),e}}};const Dv=Iv,qh="wc",jh=2,zh="client",An=`${qh}@${jh}:${zh}:`,Fr={name:zh,logger:"error",controller:!1,relayUrl:"wss://relay.walletconnect.com"},xv="proposal",Ov="Proposal expired",Nv="session",Ms=V.SEVEN_DAYS,Pv="engine",os={wc_sessionPropose:{req:{ttl:V.FIVE_MINUTES,prompt:!0,tag:1100},res:{ttl:V.FIVE_MINUTES,prompt:!1,tag:1101}},wc_sessionSettle:{req:{ttl:V.FIVE_MINUTES,prompt:!1,tag:1102},res:{ttl:V.FIVE_MINUTES,prompt:!1,tag:1103}},wc_sessionUpdate:{req:{ttl:V.ONE_DAY,prompt:!1,tag:1104},res:{ttl:V.ONE_DAY,prompt:!1,tag:1105}},wc_sessionExtend:{req:{ttl:V.ONE_DAY,prompt:!1,tag:1106},res:{ttl:V.ONE_DAY,prompt:!1,tag:1107}},wc_sessionRequest:{req:{ttl:V.FIVE_MINUTES,prompt:!0,tag:1108},res:{ttl:V.FIVE_MINUTES,prompt:!1,tag:1109}},wc_sessionEvent:{req:{ttl:V.FIVE_MINUTES,prompt:!0,tag:1110},res:{ttl:V.FIVE_MINUTES,prompt:!1,tag:1111}},wc_sessionDelete:{req:{ttl:V.ONE_DAY,prompt:!1,tag:1112},res:{ttl:V.ONE_DAY,prompt:!1,tag:1113}},wc_sessionPing:{req:{ttl:V.THIRTY_SECONDS,prompt:!1,tag:1114},res:{ttl:V.THIRTY_SECONDS,prompt:!1,tag:1115}}},Ur={min:V.FIVE_MINUTES,max:V.SEVEN_DAYS},Rv="request",Cv=["wc_sessionPropose","wc_sessionRequest","wc_authRequest"];var Av=Object.defineProperty,Tv=Object.defineProperties,$v=Object.getOwnPropertyDescriptors,Ba=Object.getOwnPropertySymbols,Fv=Object.prototype.hasOwnProperty,Uv=Object.prototype.propertyIsEnumerable,ka=(i,e,t)=>e in i?Av(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,At=(i,e)=>{for(var t in e||(e={}))Fv.call(e,t)&&ka(i,t,e[t]);if(Ba)for(var t of Ba(e))Uv.call(e,t)&&ka(i,t,e[t]);return i},Lr=(i,e)=>Tv(i,$v(e));class Lv extends Mm{constructor(e){super(e),this.name=Pv,this.events=new ir,this.initialized=!1,this.ignoredPayloadTypes=[Ni],this.init=async()=>{this.initialized||(await this.cleanup(),this.registerRelayerEvents(),this.registerExpirerEvents(),this.client.core.pairing.register({methods:Object.keys(os)}),this.initialized=!0)},this.connect=async t=>{this.isInitialized();const s=Lr(At({},t),{requiredNamespaces:t.requiredNamespaces||{},optionalNamespaces:t.optionalNamespaces||{}});await this.isValidConnect(s);const{pairingTopic:r,requiredNamespaces:n,optionalNamespaces:o,sessionProperties:c,relays:u}=s;let d=r,p,b=!1;if(d&&(b=this.client.core.pairing.pairings.get(d).active),!d||!b){const{topic:D,uri:y}=await this.client.core.pairing.create();d=D,p=y}const x=await this.client.core.crypto.generateKeyPair(),O=At({requiredNamespaces:n,optionalNamespaces:o,relays:u??[{protocol:Uh}],proposer:{publicKey:x,metadata:this.client.metadata}},c&&{sessionProperties:c}),{reject:_,resolve:C,done:F}=Ti(V.FIVE_MINUTES,Ov);if(this.events.once(ke("session_connect"),async({error:D,session:y})=>{if(D)_(D);else if(y){y.self.publicKey=x;const w=Lr(At({},y),{requiredNamespaces:y.requiredNamespaces,optionalNamespaces:y.optionalNamespaces});await this.client.session.set(y.topic,w),await this.setExpiry(y.topic,y.expiry),d&&await this.client.core.pairing.updateMetadata({topic:d,metadata:y.peer.metadata}),C(w)}}),!d){const{message:D}=J("NO_MATCHING_KEY",`connect() pairing topic: ${d}`);throw new Error(D)}const K=await this.sendRequest(d,"wc_sessionPropose",O),I=Ht(V.FIVE_MINUTES);return await this.setProposal(K,At({id:K,expiry:I},O)),{uri:p,approval:F}},this.pair=async t=>(this.isInitialized(),await this.client.core.pairing.pair(t)),this.approve=async t=>{this.isInitialized(),await this.isValidApprove(t);const{id:s,relayProtocol:r,namespaces:n,sessionProperties:o}=t,c=this.client.proposal.get(s);let{pairingTopic:u,proposer:d,requiredNamespaces:p,optionalNamespaces:b}=c;u=u||"",ls(p)||(p=Pb(n,"approve()"));const x=await this.client.core.crypto.generateKeyPair(),O=d.publicKey,_=await this.client.core.crypto.generateSharedKey(x,O);u&&s&&(await this.client.core.pairing.updateMetadata({topic:u,metadata:d.metadata}),await this.sendResult(s,u,{relay:{protocol:r??"irn"},responderPublicKey:x}),await this.client.proposal.delete(s,Je("USER_DISCONNECTED")),await this.client.core.pairing.activate({topic:u}));const C=At({relay:{protocol:r??"irn"},namespaces:n,requiredNamespaces:p,optionalNamespaces:b,pairingTopic:u,controller:{publicKey:x,metadata:this.client.metadata},expiry:Ht(Ms)},o&&{sessionProperties:o});await this.client.core.relayer.subscribe(_),await this.sendRequest(_,"wc_sessionSettle",C);const F=Lr(At({},C),{topic:_,pairingTopic:u,acknowledged:!1,self:C.controller,peer:{publicKey:d.publicKey,metadata:d.metadata},controller:x});return await this.client.session.set(_,F),await this.setExpiry(_,Ht(Ms)),{topic:_,acknowledged:()=>new Promise(K=>setTimeout(()=>K(this.client.session.get(_)),500))}},this.reject=async t=>{this.isInitialized(),await this.isValidReject(t);const{id:s,reason:r}=t,{pairingTopic:n}=this.client.proposal.get(s);n&&(await this.sendError(s,n,r),await this.client.proposal.delete(s,Je("USER_DISCONNECTED")))},this.update=async t=>{this.isInitialized(),await this.isValidUpdate(t);const{topic:s,namespaces:r}=t,n=await this.sendRequest(s,"wc_sessionUpdate",{namespaces:r}),{done:o,resolve:c,reject:u}=Ti();return this.events.once(ke("session_update",n),({error:d})=>{d?u(d):c()}),await this.client.session.update(s,{namespaces:r}),{acknowledged:o}},this.extend=async t=>{this.isInitialized(),await this.isValidExtend(t);const{topic:s}=t,r=await this.sendRequest(s,"wc_sessionExtend",{}),{done:n,resolve:o,reject:c}=Ti();return this.events.once(ke("session_extend",r),({error:u})=>{u?c(u):o()}),await this.setExpiry(s,Ht(Ms)),{acknowledged:n}},this.request=async t=>{this.isInitialized(),await this.isValidRequest(t);const{chainId:s,request:r,topic:n,expiry:o}=t,c=await this.sendRequest(n,"wc_sessionRequest",{request:r,chainId:s},o),{done:u,resolve:d,reject:p}=Ti(o);return this.events.once(ke("session_request",c),({error:b,result:x})=>{b?p(b):d(x)}),this.client.events.emit("session_request_sent",{topic:n,request:r,chainId:s,id:c}),await u()},this.respond=async t=>{this.isInitialized(),await this.isValidRespond(t);const{topic:s,response:r}=t,{id:n}=r;ut(r)?await this.sendResult(n,s,r.result):Ge(r)&&await this.sendError(n,s,r.error),this.deletePendingSessionRequest(t.response.id,{message:"fulfilled",code:0})},this.ping=async t=>{this.isInitialized(),await this.isValidPing(t);const{topic:s}=t;if(this.client.session.keys.includes(s)){const r=await this.sendRequest(s,"wc_sessionPing",{}),{done:n,resolve:o,reject:c}=Ti();this.events.once(ke("session_ping",r),({error:u})=>{u?c(u):o()}),await n()}else this.client.core.pairing.pairings.keys.includes(s)&&await this.client.core.pairing.ping({topic:s})},this.emit=async t=>{this.isInitialized(),await this.isValidEmit(t);const{topic:s,event:r,chainId:n}=t;await this.sendRequest(s,"wc_sessionEvent",{event:r,chainId:n})},this.disconnect=async t=>{this.isInitialized(),await this.isValidDisconnect(t);const{topic:s}=t;this.client.session.keys.includes(s)?(await this.sendRequest(s,"wc_sessionDelete",Je("USER_DISCONNECTED")),await this.deleteSession(s)):await this.client.core.pairing.disconnect({topic:s})},this.find=t=>(this.isInitialized(),this.client.session.getAll().filter(s=>Ab(s,t))),this.getPendingSessionRequests=()=>(this.isInitialized(),this.client.pendingRequest.getAll()),this.cleanupDuplicatePairings=async t=>{try{const s=this.client.core.pairing.pairings.get(t.pairingTopic),r=this.client.core.pairing.pairings.getAll().filter(n=>{var o,c;return((o=n.peerMetadata)==null?void 0:o.url)&&((c=n.peerMetadata)==null?void 0:c.url)===t.self.metadata.url&&n.topic!==s.topic});if(r.length===0)return;this.client.logger.info(`Cleaning up ${r.length} duplicate pairing(s)`),await Promise.all(r.map(n=>this.client.core.pairing.disconnect({topic:n.topic}))),this.client.logger.info("Duplicate pairings clean up finished")}catch(s){this.client.logger.error(s)}},this.deleteSession=async(t,s)=>{const{self:r}=this.client.session.get(t);await this.client.core.relayer.unsubscribe(t),await Promise.all([this.client.session.delete(t,Je("USER_DISCONNECTED")),this.client.core.crypto.deleteKeyPair(r.publicKey),this.client.core.crypto.deleteSymKey(t),s?Promise.resolve():this.client.core.expirer.del(t)])},this.deleteProposal=async(t,s)=>{await Promise.all([this.client.proposal.delete(t,Je("USER_DISCONNECTED")),s?Promise.resolve():this.client.core.expirer.del(t)])},this.deletePendingSessionRequest=async(t,s,r=!1)=>{await Promise.all([this.client.pendingRequest.delete(t,s),r?Promise.resolve():this.client.core.expirer.del(t)])},this.setExpiry=async(t,s)=>{this.client.session.keys.includes(t)&&await this.client.session.update(t,{expiry:s}),this.client.core.expirer.set(t,s)},this.setProposal=async(t,s)=>{await this.client.proposal.set(t,s),this.client.core.expirer.set(t,s.expiry)},this.setPendingSessionRequest=async t=>{const s=os.wc_sessionRequest.req.ttl,{id:r,topic:n,params:o}=t;await this.client.pendingRequest.set(r,{id:r,topic:n,params:o}),s&&this.client.core.expirer.set(r,Ht(s))},this.sendRequest=async(t,s,r,n)=>{const o=ti(s,r);if(Nn()&&Cv.includes(s)){const d=Li(JSON.stringify(o));await this.client.core.verify.register({attestationId:d})}const c=await this.client.core.crypto.encode(t,o),u=os[s].req;return n&&(u.ttl=n),this.client.core.history.set(t,o),this.client.core.relayer.publish(t,c,u),o.id},this.sendResult=async(t,s,r)=>{const n=xi(t,r),o=await this.client.core.crypto.encode(s,n),c=await this.client.core.history.get(s,t),u=os[c.request.method].res;this.client.core.relayer.publish(s,o,u),await this.client.core.history.resolve(n)},this.sendError=async(t,s,r)=>{const n=ji(t,r),o=await this.client.core.crypto.encode(s,n),c=await this.client.core.history.get(s,t),u=os[c.request.method].res;this.client.core.relayer.publish(s,o,u),await this.client.core.history.resolve(n)},this.cleanup=async()=>{const t=[],s=[];this.client.session.getAll().forEach(r=>{ci(r.expiry)&&t.push(r.topic)}),this.client.proposal.getAll().forEach(r=>{ci(r.expiry)&&s.push(r.id)}),await Promise.all([...t.map(r=>this.deleteSession(r)),...s.map(r=>this.deleteProposal(r))])},this.onRelayEventRequest=t=>{const{topic:s,payload:r}=t,n=r.method;switch(n){case"wc_sessionPropose":return this.onSessionProposeRequest(s,r);case"wc_sessionSettle":return this.onSessionSettleRequest(s,r);case"wc_sessionUpdate":return this.onSessionUpdateRequest(s,r);case"wc_sessionExtend":return this.onSessionExtendRequest(s,r);case"wc_sessionPing":return this.onSessionPingRequest(s,r);case"wc_sessionDelete":return this.onSessionDeleteRequest(s,r);case"wc_sessionRequest":return this.onSessionRequest(s,r);case"wc_sessionEvent":return this.onSessionEventRequest(s,r);default:return this.client.logger.info(`Unsupported request method ${n}`)}},this.onRelayEventResponse=async t=>{const{topic:s,payload:r}=t,n=(await this.client.core.history.get(s,r.id)).request.method;switch(n){case"wc_sessionPropose":return this.onSessionProposeResponse(s,r);case"wc_sessionSettle":return this.onSessionSettleResponse(s,r);case"wc_sessionUpdate":return this.onSessionUpdateResponse(s,r);case"wc_sessionExtend":return this.onSessionExtendResponse(s,r);case"wc_sessionPing":return this.onSessionPingResponse(s,r);case"wc_sessionRequest":return this.onSessionRequestResponse(s,r);default:return this.client.logger.info(`Unsupported response method ${n}`)}},this.onSessionProposeRequest=async(t,s)=>{const{params:r,id:n}=s;try{this.isValidConnect(At({},s.params));const o=Ht(V.FIVE_MINUTES),c=At({id:n,pairingTopic:t,expiry:o},r);await this.setProposal(n,c);const u=Li(JSON.stringify(s)),d=await this.getVerifyContext(u,c.proposer.metadata);this.client.events.emit("session_proposal",{id:n,params:c,verifyContext:d})}catch(o){await this.sendError(n,t,o),this.client.logger.error(o)}},this.onSessionProposeResponse=async(t,s)=>{const{id:r}=s;if(ut(s)){const{result:n}=s;this.client.logger.trace({type:"method",method:"onSessionProposeResponse",result:n});const o=this.client.proposal.get(r);this.client.logger.trace({type:"method",method:"onSessionProposeResponse",proposal:o});const c=o.proposer.publicKey;this.client.logger.trace({type:"method",method:"onSessionProposeResponse",selfPublicKey:c});const u=n.responderPublicKey;this.client.logger.trace({type:"method",method:"onSessionProposeResponse",peerPublicKey:u});const d=await this.client.core.crypto.generateSharedKey(c,u);this.client.logger.trace({type:"method",method:"onSessionProposeResponse",sessionTopic:d});const p=await this.client.core.relayer.subscribe(d);this.client.logger.trace({type:"method",method:"onSessionProposeResponse",subscriptionId:p}),await this.client.core.pairing.activate({topic:t})}else Ge(s)&&(await this.client.proposal.delete(r,Je("USER_DISCONNECTED")),this.events.emit(ke("session_connect"),{error:s.error}))},this.onSessionSettleRequest=async(t,s)=>{const{id:r,params:n}=s;try{this.isValidSessionSettleRequest(n);const{relay:o,controller:c,expiry:u,namespaces:d,requiredNamespaces:p,optionalNamespaces:b,sessionProperties:x,pairingTopic:O}=s.params,_=At({topic:t,relay:o,expiry:u,namespaces:d,acknowledged:!0,pairingTopic:O,requiredNamespaces:p,optionalNamespaces:b,controller:c.publicKey,self:{publicKey:"",metadata:this.client.metadata},peer:{publicKey:c.publicKey,metadata:c.metadata}},x&&{sessionProperties:x});await this.sendResult(s.id,t,!0),this.events.emit(ke("session_connect"),{session:_}),this.cleanupDuplicatePairings(_)}catch(o){await this.sendError(r,t,o),this.client.logger.error(o)}},this.onSessionSettleResponse=async(t,s)=>{const{id:r}=s;ut(s)?(await this.client.session.update(t,{acknowledged:!0}),this.events.emit(ke("session_approve",r),{})):Ge(s)&&(await this.client.session.delete(t,Je("USER_DISCONNECTED")),this.events.emit(ke("session_approve",r),{error:s.error}))},this.onSessionUpdateRequest=async(t,s)=>{const{params:r,id:n}=s;try{this.isValidUpdate(At({topic:t},r)),await this.client.session.update(t,{namespaces:r.namespaces}),await this.sendResult(n,t,!0),this.client.events.emit("session_update",{id:n,topic:t,params:r})}catch(o){await this.sendError(n,t,o),this.client.logger.error(o)}},this.onSessionUpdateResponse=(t,s)=>{const{id:r}=s;ut(s)?this.events.emit(ke("session_update",r),{}):Ge(s)&&this.events.emit(ke("session_update",r),{error:s.error})},this.onSessionExtendRequest=async(t,s)=>{const{id:r}=s;try{this.isValidExtend({topic:t}),await this.setExpiry(t,Ht(Ms)),await this.sendResult(r,t,!0),this.client.events.emit("session_extend",{id:r,topic:t})}catch(n){await this.sendError(r,t,n),this.client.logger.error(n)}},this.onSessionExtendResponse=(t,s)=>{const{id:r}=s;ut(s)?this.events.emit(ke("session_extend",r),{}):Ge(s)&&this.events.emit(ke("session_extend",r),{error:s.error})},this.onSessionPingRequest=async(t,s)=>{const{id:r}=s;try{this.isValidPing({topic:t}),await this.sendResult(r,t,!0),this.client.events.emit("session_ping",{id:r,topic:t})}catch(n){await this.sendError(r,t,n),this.client.logger.error(n)}},this.onSessionPingResponse=(t,s)=>{const{id:r}=s;setTimeout(()=>{ut(s)?this.events.emit(ke("session_ping",r),{}):Ge(s)&&this.events.emit(ke("session_ping",r),{error:s.error})},500)},this.onSessionDeleteRequest=async(t,s)=>{const{id:r}=s;try{this.isValidDisconnect({topic:t,reason:s.params}),await Promise.all([new Promise(n=>{this.client.core.relayer.once(He.publish,async()=>{n(await this.deleteSession(t))})}),this.sendResult(r,t,!0)]),this.client.events.emit("session_delete",{id:r,topic:t})}catch(n){await this.sendError(r,t,n),this.client.logger.error(n)}},this.onSessionRequest=async(t,s)=>{const{id:r,params:n}=s;try{this.isValidRequest(At({topic:t},n)),await this.setPendingSessionRequest({id:r,topic:t,params:n});const o=Li(JSON.stringify(s)),c=this.client.session.get(t),u=await this.getVerifyContext(o,c.peer.metadata);this.client.events.emit("session_request",{id:r,topic:t,params:n,verifyContext:u})}catch(o){await this.sendError(r,t,o),this.client.logger.error(o)}},this.onSessionRequestResponse=(t,s)=>{const{id:r}=s;ut(s)?this.events.emit(ke("session_request",r),{result:s.result}):Ge(s)&&this.events.emit(ke("session_request",r),{error:s.error})},this.onSessionEventRequest=async(t,s)=>{const{id:r,params:n}=s;try{this.isValidEmit(At({topic:t},n)),this.client.events.emit("session_event",{id:r,topic:t,params:n})}catch(o){await this.sendError(r,t,o),this.client.logger.error(o)}},this.isValidConnect=async t=>{if(!It(t)){const{message:u}=J("MISSING_OR_INVALID",`connect() params: ${JSON.stringify(t)}`);throw new Error(u)}const{pairingTopic:s,requiredNamespaces:r,optionalNamespaces:n,sessionProperties:o,relays:c}=t;if(wt(s)||await this.isValidPairingTopic(s),!Bb(c,!0)){const{message:u}=J("MISSING_OR_INVALID",`connect() relays: ${c}`);throw new Error(u)}!wt(r)&&ls(r)!==0&&this.validateNamespaces(r,"requiredNamespaces"),!wt(n)&&ls(n)!==0&&this.validateNamespaces(n,"optionalNamespaces"),wt(o)||this.validateSessionProps(o,"sessionProperties")},this.validateNamespaces=(t,s)=>{const r=Vb(t,"connect()",s);if(r)throw new Error(r.message)},this.isValidApprove=async t=>{if(!It(t))throw new Error(J("MISSING_OR_INVALID",`approve() params: ${t}`).message);const{id:s,namespaces:r,relayProtocol:n,sessionProperties:o}=t;await this.isValidProposalId(s);const c=this.client.proposal.get(s),u=Bs(r,"approve()");if(u)throw new Error(u.message);const d=Ia(c.requiredNamespaces,r,"approve()");if(d)throw new Error(d.message);if(!ct(n,!0)){const{message:p}=J("MISSING_OR_INVALID",`approve() relayProtocol: ${n}`);throw new Error(p)}wt(o)||this.validateSessionProps(o,"sessionProperties")},this.isValidReject=async t=>{if(!It(t)){const{message:n}=J("MISSING_OR_INVALID",`reject() params: ${t}`);throw new Error(n)}const{id:s,reason:r}=t;if(await this.isValidProposalId(s),!Hb(r)){const{message:n}=J("MISSING_OR_INVALID",`reject() reason: ${JSON.stringify(r)}`);throw new Error(n)}},this.isValidSessionSettleRequest=t=>{if(!It(t)){const{message:d}=J("MISSING_OR_INVALID",`onSessionSettleRequest() params: ${t}`);throw new Error(d)}const{relay:s,controller:r,namespaces:n,expiry:o}=t;if(!Sh(s)){const{message:d}=J("MISSING_OR_INVALID","onSessionSettleRequest() relay protocol should be a string");throw new Error(d)}const c=Lb(r,"onSessionSettleRequest()");if(c)throw new Error(c.message);const u=Bs(n,"onSessionSettleRequest()");if(u)throw new Error(u.message);if(ci(o)){const{message:d}=J("EXPIRED","onSessionSettleRequest()");throw new Error(d)}},this.isValidUpdate=async t=>{if(!It(t)){const{message:u}=J("MISSING_OR_INVALID",`update() params: ${t}`);throw new Error(u)}const{topic:s,namespaces:r}=t;await this.isValidSessionTopic(s);const n=this.client.session.get(s),o=Bs(r,"update()");if(o)throw new Error(o.message);const c=Ia(n.requiredNamespaces,r,"update()");if(c)throw new Error(c.message)},this.isValidExtend=async t=>{if(!It(t)){const{message:r}=J("MISSING_OR_INVALID",`extend() params: ${t}`);throw new Error(r)}const{topic:s}=t;await this.isValidSessionTopic(s)},this.isValidRequest=async t=>{if(!It(t)){const{message:u}=J("MISSING_OR_INVALID",`request() params: ${t}`);throw new Error(u)}const{topic:s,request:r,chainId:n,expiry:o}=t;await this.isValidSessionTopic(s);const{namespaces:c}=this.client.session.get(s);if(!Sa(c,n)){const{message:u}=J("MISSING_OR_INVALID",`request() chainId: ${n}`);throw new Error(u)}if(!Gb(r)){const{message:u}=J("MISSING_OR_INVALID",`request() ${JSON.stringify(r)}`);throw new Error(u)}if(!Jb(c,n,r.method)){const{message:u}=J("MISSING_OR_INVALID",`request() method: ${r.method}`);throw new Error(u)}if(o&&!ew(o,Ur)){const{message:u}=J("MISSING_OR_INVALID",`request() expiry: ${o}. Expiry must be a number (in seconds) between ${Ur.min} and ${Ur.max}`);throw new Error(u)}},this.isValidRespond=async t=>{if(!It(t)){const{message:n}=J("MISSING_OR_INVALID",`respond() params: ${t}`);throw new Error(n)}const{topic:s,response:r}=t;if(await this.isValidSessionTopic(s),!Wb(r)){const{message:n}=J("MISSING_OR_INVALID",`respond() response: ${JSON.stringify(r)}`);throw new Error(n)}},this.isValidPing=async t=>{if(!It(t)){const{message:r}=J("MISSING_OR_INVALID",`ping() params: ${t}`);throw new Error(r)}const{topic:s}=t;await this.isValidSessionOrPairingTopic(s)},this.isValidEmit=async t=>{if(!It(t)){const{message:c}=J("MISSING_OR_INVALID",`emit() params: ${t}`);throw new Error(c)}const{topic:s,event:r,chainId:n}=t;await this.isValidSessionTopic(s);const{namespaces:o}=this.client.session.get(s);if(!Sa(o,n)){const{message:c}=J("MISSING_OR_INVALID",`emit() chainId: ${n}`);throw new Error(c)}if(!Yb(r)){const{message:c}=J("MISSING_OR_INVALID",`emit() event: ${JSON.stringify(r)}`);throw new Error(c)}if(!Qb(o,n,r.name)){const{message:c}=J("MISSING_OR_INVALID",`emit() event: ${JSON.stringify(r)}`);throw new Error(c)}},this.isValidDisconnect=async t=>{if(!It(t)){const{message:r}=J("MISSING_OR_INVALID",`disconnect() params: ${t}`);throw new Error(r)}const{topic:s}=t;await this.isValidSessionOrPairingTopic(s)},this.getVerifyContext=async(t,s)=>{const r={verified:{verifyUrl:s.verifyUrl||"",validation:"UNKNOWN",origin:s.url||""}};try{const n=await this.client.core.verify.resolve({attestationId:t,verifyUrl:s.verifyUrl});n&&(r.verified.origin=n,r.verified.validation=n===s.url?"VALID":"INVALID")}catch(n){this.client.logger.error(n)}return this.client.logger.info(`Verify context: ${JSON.stringify(r)}`),r},this.validateSessionProps=(t,s)=>{Object.values(t).forEach(r=>{if(!ct(r,!1)){const{message:n}=J("MISSING_OR_INVALID",`${s} must be in Record<string, string> format. Received: ${JSON.stringify(r)}`);throw new Error(n)}})}}isInitialized(){if(!this.initialized){const{message:e}=J("NOT_INITIALIZED",this.name);throw new Error(e)}}registerRelayerEvents(){this.client.core.relayer.on(He.message,async e=>{const{topic:t,message:s}=e;if(this.ignoredPayloadTypes.includes(this.client.core.crypto.getPayloadType(s)))return;const r=await this.client.core.crypto.decode(t,s);zi(r)?(this.client.core.history.set(t,r),this.onRelayEventRequest({topic:t,payload:r})):Oi(r)&&(await this.client.core.history.resolve(r),this.onRelayEventResponse({topic:t,payload:r}))})}registerExpirerEvents(){this.client.core.expirer.on($t.expired,async e=>{const{topic:t,id:s}=_h(e.target);if(s&&this.client.pendingRequest.keys.includes(s))return await this.deletePendingSessionRequest(s,J("EXPIRED"),!0);t?this.client.session.keys.includes(t)&&(await this.deleteSession(t,!0),this.client.events.emit("session_expire",{topic:t})):s&&(await this.deleteProposal(s,!0),this.client.events.emit("proposal_expire",{id:s}))})}isValidPairingTopic(e){if(!ct(e,!1)){const{message:t}=J("MISSING_OR_INVALID",`pairing topic should be a string: ${e}`);throw new Error(t)}if(!this.client.core.pairing.pairings.keys.includes(e)){const{message:t}=J("NO_MATCHING_KEY",`pairing topic doesn't exist: ${e}`);throw new Error(t)}if(ci(this.client.core.pairing.pairings.get(e).expiry)){const{message:t}=J("EXPIRED",`pairing topic: ${e}`);throw new Error(t)}}async isValidSessionTopic(e){if(!ct(e,!1)){const{message:t}=J("MISSING_OR_INVALID",`session topic should be a string: ${e}`);throw new Error(t)}if(!this.client.session.keys.includes(e)){const{message:t}=J("NO_MATCHING_KEY",`session topic doesn't exist: ${e}`);throw new Error(t)}if(ci(this.client.session.get(e).expiry)){await this.deleteSession(e);const{message:t}=J("EXPIRED",`session topic: ${e}`);throw new Error(t)}}async isValidSessionOrPairingTopic(e){if(this.client.session.keys.includes(e))await this.isValidSessionTopic(e);else if(this.client.core.pairing.pairings.keys.includes(e))this.isValidPairingTopic(e);else if(ct(e,!1)){const{message:t}=J("NO_MATCHING_KEY",`session or pairing topic doesn't exist: ${e}`);throw new Error(t)}else{const{message:t}=J("MISSING_OR_INVALID",`session or pairing topic should be a string: ${e}`);throw new Error(t)}}async isValidProposalId(e){if(!kb(e)){const{message:t}=J("MISSING_OR_INVALID",`proposal id should be a number: ${e}`);throw new Error(t)}if(!this.client.proposal.keys.includes(e)){const{message:t}=J("NO_MATCHING_KEY",`proposal id doesn't exist: ${e}`);throw new Error(t)}if(ci(this.client.proposal.get(e).expiry)){await this.deleteProposal(e);const{message:t}=J("EXPIRED",`proposal id: ${e}`);throw new Error(t)}}}class Mv extends pr{constructor(e,t){super(e,t,xv,An),this.core=e,this.logger=t}}class qv extends pr{constructor(e,t){super(e,t,Nv,An),this.core=e,this.logger=t}}class jv extends pr{constructor(e,t){super(e,t,Rv,An,s=>s.id),this.core=e,this.logger=t}}class Tn extends Lm{constructor(e){super(e),this.protocol=qh,this.version=jh,this.name=Fr.name,this.events=new We.EventEmitter,this.on=(s,r)=>this.events.on(s,r),this.once=(s,r)=>this.events.once(s,r),this.off=(s,r)=>this.events.off(s,r),this.removeListener=(s,r)=>this.events.removeListener(s,r),this.removeAllListeners=s=>this.events.removeAllListeners(s),this.connect=async s=>{try{return await this.engine.connect(s)}catch(r){throw this.logger.error(r.message),r}},this.pair=async s=>{try{return await this.engine.pair(s)}catch(r){throw this.logger.error(r.message),r}},this.approve=async s=>{try{return await this.engine.approve(s)}catch(r){throw this.logger.error(r.message),r}},this.reject=async s=>{try{return await this.engine.reject(s)}catch(r){throw this.logger.error(r.message),r}},this.update=async s=>{try{return await this.engine.update(s)}catch(r){throw this.logger.error(r.message),r}},this.extend=async s=>{try{return await this.engine.extend(s)}catch(r){throw this.logger.error(r.message),r}},this.request=async s=>{try{return await this.engine.request(s)}catch(r){throw this.logger.error(r.message),r}},this.respond=async s=>{try{return await this.engine.respond(s)}catch(r){throw this.logger.error(r.message),r}},this.ping=async s=>{try{return await this.engine.ping(s)}catch(r){throw this.logger.error(r.message),r}},this.emit=async s=>{try{return await this.engine.emit(s)}catch(r){throw this.logger.error(r.message),r}},this.disconnect=async s=>{try{return await this.engine.disconnect(s)}catch(r){throw this.logger.error(r.message),r}},this.find=s=>{try{return this.engine.find(s)}catch(r){throw this.logger.error(r.message),r}},this.getPendingSessionRequests=()=>{try{return this.engine.getPendingSessionRequests()}catch(s){throw this.logger.error(s.message),s}},this.name=e?.name||Fr.name,this.metadata=e?.metadata||hb();const t=typeof e?.logger<"u"&&typeof e?.logger!="string"?e.logger:ee.pino(ee.getDefaultLoggerOptions({level:e?.logger||Fr.logger}));this.core=e?.core||new Dv(e),this.logger=ee.generateChildLogger(t,this.name),this.session=new qv(this.core,this.logger),this.proposal=new Mv(this.core,this.logger),this.pendingRequest=new jv(this.core,this.logger),this.engine=new Lv(this)}static async init(e){const t=new Tn(e);return await t.initialize(),t}get context(){return ee.getLoggerContext(this.logger)}get pairing(){return this.core.pairing.pairings}async initialize(){this.logger.trace("Initialized");try{await this.core.start(),await this.session.init(),await this.proposal.init(),await this.pendingRequest.init(),await this.engine.init(),this.core.verify.init({verifyUrl:this.metadata.verifyUrl}),this.logger.info("SignClient Initialization Success")}catch(e){throw this.logger.info("SignClient Initialization Failure"),this.logger.error(e.message),e}}}function zv(i){return typeof i<"u"&&typeof i.context<"u"}const Gt={init:"signer_init",uri:"signer_uri",created:"signer_created",updated:"signer_updated",deleted:"signer_deleted",event:"signer_event"};class Kv extends _g{constructor(e){super(),this.events=new We.EventEmitter,this.pending=!1,this.initializing=!1,this.requiredNamespaces=e?.requiredNamespaces||{},this.opts=e?.client}get connected(){return typeof this.session<"u"}get connecting(){return this.pending}get chains(){return this.session?km(this.session.namespaces):Hm(this.requiredNamespaces)}get accounts(){return this.session?Bm(this.session.namespaces):[]}on(e,t){this.events.on(e,t)}once(e,t){this.events.once(e,t)}off(e,t){this.events.off(e,t)}removeListener(e,t){this.events.removeListener(e,t)}async open(){if(this.pending)return new Promise((e,t)=>{this.events.once("open",()=>{if(this.events.once("open_error",s=>{t(s)}),typeof this.client>"u")return t(new Error("Sign Client not initialized"));e()})});try{this.pending=!0;const e=await this.register(),t=e.find({requiredNamespaces:this.requiredNamespaces});if(t.length)return this.onOpen(t[0]);const{uri:s,approval:r}=await e.connect({requiredNamespaces:this.requiredNamespaces});this.events.emit(Gt.uri,{uri:s}),this.session=await r(),this.events.emit(Gt.created,this.session),this.onOpen()}catch(e){throw this.events.emit("open_error",e),e}}async close(){typeof this.session>"u"||(await(await this.register()).disconnect({topic:this.session.topic,reason:Je("USER_DISCONNECTED")}),this.onClose())}async send(e,t){if(typeof this.client>"u"&&(this.client=await this.register(),this.connected||await this.open()),typeof this.session>"u")throw new Error("Signer connection is missing session");this.client.request({topic:this.session.topic,request:e,chainId:t?.chainId}).then(s=>this.events.emit("payload",xi(e.id,s))).catch(s=>this.events.emit("payload",ji(e.id,s.message)))}async register(e=this.opts){if(typeof this.client<"u")return this.client;if(this.initializing)return new Promise((t,s)=>{this.events.once("register_error",r=>{s(r)}),this.events.once(Gt.init,()=>{if(typeof this.client>"u")return s(new Error("Sign Client not initialized"));t(this.client)})});if(zv(e))return this.client=e,this.registerEventListeners(),this.client;try{return this.initializing=!0,this.client=await Tn.init(e),this.initializing=!1,this.registerEventListeners(),this.events.emit(Gt.init),this.client}catch(t){throw this.events.emit("register_error",t),t}}onOpen(e){this.pending=!1,e&&(this.session=e),this.events.emit("open")}onClose(){this.pending=!1,this.client&&(this.client=void 0),this.events.emit("close")}registerEventListeners(){typeof this.client<"u"&&(this.client.on("session_event",e=>{var t;this.session&&((t=this.session)==null?void 0:t.topic)!==e.topic||this.events.emit(Gt.event,e.params)}),this.client.on("session_update",e=>{var t;typeof this.client<"u"&&(this.session&&((t=this.session)==null?void 0:t.topic)!==e.topic||(this.session=this.client.session.get(e.topic),this.events.emit(Gt.updated,this.session)))}),this.client.on("session_delete",e=>{var t;this.session&&(this.session&&((t=this.session)==null?void 0:t.topic)!==e.topic||(this.onClose(),this.events.emit(Gt.deleted,this.session),this.session=void 0))}))}}const Kh=":";function Vv(i){const{namespace:e,reference:t}=i;return[e,t].join(Kh)}function Bv(i){const[e,t,s]=i.split(Kh);return{namespace:e,reference:t,address:s}}function kv(i,e){const t=[];return i.forEach(s=>{const r=e(s);t.includes(r)||t.push(r)}),t}function Hv(i){const{namespace:e,reference:t}=Bv(i);return Vv({namespace:e,reference:t})}function Gv(i){return kv(i,Hv)}function Wv(i,e=[]){const t=[];return Object.keys(i).forEach(s=>{if(e.length&&!e.includes(s))return;const r=i[s];t.push(...r.accounts)}),t}function Yv(i,e=[]){const t=[];return Object.keys(i).forEach(s=>{if(e.length&&!e.includes(s))return;const r=i[s];t.push(...Gv(r.accounts))}),t}class Jv{constructor(){we(this,"accounts",[]);we(this,"eventEmitter",new We.EventEmitter);we(this,"updateSession",e=>{if(!this.isValidSession(e))throw console.warn("updateSession incompatible session",e,"for adapter",this.formatChainId(this.chainId)),new Error("Invalid session");this.session=e;const t=Yv(e.namespaces,[this.namespace]);this.setChainIds(t);const s=Wv(e.namespaces,[this.namespace]);this.setAccounts(s)});we(this,"isValidSession",({namespaces:e,requiredNamespaces:t})=>{const s=this.formatChainId(this.chainId);return t?!!t[this.namespace]?.chains?.includes(s):!!e?.[this.namespace]?.accounts.some(r=>r.startsWith(s))})}getRequiredNamespaces(){const e=[this.formatChainId(this.chainId)];return{[this.namespace]:{chains:e,methods:this.methods,events:this.events}}}isCompatibleChainId(e){return typeof e=="string"?e.startsWith(`${this.namespace}:`):!1}setChainIds(e){const s=e.filter(r=>this.isCompatibleChainId(r)).map(r=>this.parseChainId(r)).filter(r=>r!==this.chainId);s.length&&(this.chainId=s[0],this.eventEmitter.emit("chainChanged",this.chainId))}setChainId(e){if(this.isCompatibleChainId(e)){const t=this.parseChainId(e);this.chainId=t,this.eventEmitter.emit("chainChanged",this.chainId)}}parseAccountId(e){const[t,s,r]=e.split(":");return{chainId:`${t}:${s}`,address:r}}getSignerConnection(e){return new Kv({requiredNamespaces:{[this.namespace]:{chains:this.rpc.chains,methods:this.rpc.methods,events:this.rpc.events}},client:e})}registerEventListeners(){this.rpcProvider.on("connect",()=>{const{chains:e,accounts:t}=this.signerConnection;e?.length&&this.setChainIds(e),t?.length&&this.setAccounts(t)}),this.signerConnection.on(Gt.created,this.updateSession),this.signerConnection.on(Gt.updated,this.updateSession),this.signerConnection.on(Gt.event,e=>{if(!this.rpc.chains.includes(e.chainId))return;const{event:t}=e;t.name==="accountsChanged"?(this.accounts=t.data,this.eventEmitter.emit("accountsChanged",this.accounts)):t.name==="chainChanged"?this.setChainId(t.data):this.eventEmitter.emit(t.name,t.data)}),this.rpcProvider.on("disconnect",()=>{this.eventEmitter.emit("disconnect")})}}class Ha extends $i.Account{constructor(e,t,s,r){super(e,t,s),this.wallet=r}async execute(e,t=void 0,s={}){return e=Array.isArray(e)?e:[e],await this.wallet.starknet_requestAddInvokeTransaction({accountAddress:this.address,executionRequest:{calls:e,abis:t,invocationDetails:s}})}async declare(e,t){throw new Error("Not supported via Argent Login")}async deployAccount(e,t){throw new Error("Not supported via Argent Login")}}class Qv{constructor(e){this.wallet=e}async getPubKey(){throw new Error("Not supported via Argent Login")}async signMessage(e,t){const{signature:s}=await this.wallet.starknet_signTypedData({accountAddress:t,typedData:e});return s}async signTransaction(e,t,s){throw new Error("Not supported via Argent Login")}async signDeployAccountTransaction(e){throw new Error("Not supported via Argent Login")}async signDeclareTransaction(e){throw new Error("Not supported via Argent Login")}}const Xv=i=>i.replace(/^SN_/,"SN"),Zv=i=>i.replace(/^SN/,"SN_");class e_ extends Jv{constructor({client:t,chainId:s,rpcUrl:r,provider:n}){super();we(this,"id","argentMobile");we(this,"name","Argent Mobile");we(this,"version","0.1.0");we(this,"icon","");we(this,"provider");we(this,"signer");we(this,"account");we(this,"selectedAddress","");we(this,"namespace","starknet");we(this,"methods",["starknet_signTypedData","starknet_requestAddInvokeTransaction"]);we(this,"events",["chainChanged","accountsChanged"]);we(this,"remoteSigner");we(this,"signerConnection");we(this,"rpcProvider");we(this,"chainId");we(this,"client");we(this,"session");we(this,"rpc");we(this,"walletRpc");we(this,"on",(t,s)=>{this.eventEmitter.on(t,s)});we(this,"off",(t,s)=>{this.eventEmitter.off(t,s)});this.chainId=String(s??$i.constants.NetworkName.SN_MAIN),this.rpc={chains:s?[this.formatChainId(this.chainId)]:[],methods:this.methods,events:this.events},this.signerConnection=this.getSignerConnection(t),this.rpcProvider=new _n(this.signerConnection),this.client=t,this.registerEventListeners(),this.walletRpc=new Proxy({},{get:(o,c)=>u=>this.requestWallet({method:c,params:u})}),this.remoteSigner=new Qv(this.walletRpc),this.provider=n||new $i.RpcProvider({nodeUrl:r}),this.account=new Ha(this.provider,"",this.remoteSigner,this.walletRpc)}getNetworkName(t){if(t==="SN_SEPOLIA")return $i.constants.NetworkName.SN_SEPOLIA;if(t==="SN_MAIN")return $i.constants.NetworkName.SN_MAIN;throw new Error(`Unknown starknet.js network name for chainId ${t}`)}async request(t){throw new Error("Not implemented: .request()")}async enable(){return await this.rpcProvider.connect(),this.accounts}get isConnected(){return!0}async isPreauthorized(){return!!this.client.session.getAll().find(this.isValidSession)}async requestWallet(t){if(!this.session)throw new Error("No session");try{const{topic:s}=this.session,r=this.formatChainId(this.chainId);kt.showApprovalModal(t);const n=await this.client.request({topic:s,chainId:r,request:t});return kt.closeModal("animateSuccess"),n}catch(s){throw kt.closeModal(),s instanceof Error?new Error(s.message):new Error("Unknow error on requestWallet")}}get isConnecting(){return this.signerConnection.connecting}async disable(){await this.rpcProvider.disconnect()}get isWalletConnect(){return!0}registerEventListeners(){super.registerEventListeners(),this.eventEmitter.on("chainChanged",t=>{throw new Error("Not implemented: chainChanged")})}formatChainId(t){return`${this.namespace}:${Xv(t)}`}parseChainId(t){return Zv(t.split(":")[1])}setAccounts(t){this.accounts=t.filter(n=>this.parseChainId(this.parseAccountId(n).chainId)===this.chainId).map(n=>this.parseAccountId(n).address);const{address:s}=this.parseAccountId(t[0]),r=s.startsWith("0x")?s:`0x${s}`;this.account=new Ha(this.provider,r,this.remoteSigner,this.walletRpc),this.eventEmitter.emit("accountsChanged",this.accounts),this.selectedAddress=r}}const t_=async i=>Dm(i,e_);exports.getStarknetWindowObject=t_;

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./index-6f5141f0.cjs":6,"./lastConnected-080a1315.cjs":11,"./publicRcpNodes-77022e83.cjs":13,"_process":1,"starknet":undefined,"ws":17}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.I = exports.A = void 0;
var _starknet = require("starknet");
var _lastConnectedB964dc = require("./lastConnected-b964dc30.js");
var g = Object.defineProperty;
var o = (M, e, t) => e in M ? g(M, e, {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: t
}) : M[e] = t;
var N = (M, e, t) => (o(M, typeof e != "symbol" ? e + "" : e, t), t);
const d = exports.A = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTE4LjQwMTggNy41NTU1NkgxMy41OTgyQzEzLjQzNzcgNy41NTU1NiAxMy4zMDkxIDcuNjg3NDcgMTMuMzA1NiA3Ljg1MTQzQzEzLjIwODUgMTIuNDYwMyAxMC44NDg0IDE2LjgzNDcgNi43ODYwOCAxOS45MzMxQzYuNjU3MTEgMjAuMDMxNCA2LjYyNzczIDIwLjIxNjIgNi43MjIwMiAyMC4zNDkzTDkuNTMyNTMgMjQuMzE5NkM5LjYyODE1IDI0LjQ1NDggOS44MTQ0NCAyNC40ODUzIDkuOTQ1NTggMjQuMzg2QzEyLjQ4NTYgMjIuNDYxMyAxNC41Mjg3IDIwLjEzOTUgMTYgMTcuNTY2QzE3LjQ3MTMgMjAuMTM5NSAxOS41MTQ1IDIyLjQ2MTMgMjIuMDU0NSAyNC4zODZDMjIuMTg1NiAyNC40ODUzIDIyLjM3MTkgMjQuNDU0OCAyMi40Njc2IDI0LjMxOTZMMjUuMjc4MSAyMC4zNDkzQzI1LjM3MjMgMjAuMjE2MiAyNS4zNDI5IDIwLjAzMTQgMjUuMjE0IDE5LjkzMzFDMjEuMTUxNiAxNi44MzQ3IDE4Ljc5MTUgMTIuNDYwMyAxOC42OTQ2IDcuODUxNDNDMTguNjkxMSA3LjY4NzQ3IDE4LjU2MjMgNy41NTU1NiAxOC40MDE4IDcuNTU1NTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjQuNzIzNiAxMC40OTJMMjQuMjIzMSA4LjkyNDM5QzI0LjEyMTMgOC42MDYxNCAyMy44NzM0IDguMzU4MjQgMjMuNTU3NyA4LjI2MDIzTDIyLjAwMzkgNy43NzU5NUMyMS43ODk1IDcuNzA5MDYgMjEuNzg3MyA3LjQwMTc3IDIyLjAwMTEgNy4zMzIwMUwyMy41NDY5IDYuODI0NjZDMjMuODYwOSA2LjcyMTQ2IDI0LjEwNiA2LjQ2OTUyIDI0LjIwMjcgNi4xNTAxMUwyNC42Nzk4IDQuNTc1MDJDMjQuNzQ1OCA0LjM1NzA5IDI1LjA0ODkgNC4zNTQ3NyAyNS4xMTgzIDQuNTcxNTZMMjUuNjE4OCA2LjEzOTE1QzI1LjcyMDYgNi40NTc0IDI1Ljk2ODYgNi43MDUzMSAyNi4yODQyIDYuODAzOUwyNy44MzggNy4yODc2MUMyOC4wNTI0IDcuMzU0NSAyOC4wNTQ3IDcuNjYxNzkgMjcuODQwOCA3LjczMjEzTDI2LjI5NSA4LjIzOTQ4QzI1Ljk4MTEgOC4zNDIxIDI1LjczNiA4LjU5NDA0IDI1LjYzOTMgOC45MTQwMkwyNS4xNjIxIDEwLjQ4ODVDMjUuMDk2MSAxMC43MDY1IDI0Ljc5MyAxMC43MDg4IDI0LjcyMzYgMTAuNDkyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==",
  l = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0iYmxhY2siPgogIDxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTkuODc5IDcuNTE5YzEuMTcxLTEuMDI1IDMuMDcxLTEuMDI1IDQuMjQyIDAgMS4xNzIgMS4wMjUgMS4xNzIgMi42ODcgMCAzLjcxMi0uMjAzLjE3OS0uNDMuMzI2LS42Ny40NDItLjc0NS4zNjEtMS40NS45OTktMS40NSAxLjgyN3YuNzVNMjEgMTJhOSA5IDAgMTEtMTggMCA5IDkgMCAwMTE4IDB6bS05IDUuMjVoLjAwOHYuMDA4SDEydi0uMDA4eiIgLz4KPC9zdmc+",
  h = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0id2hpdGUiPgogIDxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTkuODc5IDcuNTE5YzEuMTcxLTEuMDI1IDMuMDcxLTEuMDI1IDQuMjQyIDAgMS4xNzIgMS4wMjUgMS4xNzIgMi42ODcgMCAzLjcxMi0uMjAzLjE3OS0uNDMuMzI2LS42Ny40NDItLjc0NS4zNjEtMS40NS45OTktMS40NSAxLjgyN3YuNzVNMjEgMTJhOSA5IDAgMTEtMTggMCA5IDkgMCAwMTE4IDB6bS05IDUuMjVoLjAwOHYuMDA4SDEydi0uMDA4eiIgLz4KPC9zdmc+Cg==";
class L extends _lastConnectedB964dc.C {
  constructor({
    options: t
  }) {
    super();
    N(this, "_wallet");
    N(this, "_options");
    this._options = t;
  }
  available() {
    return this.ensureWallet(), this._wallet !== void 0;
  }
  async ready() {
    return this.ensureWallet(), this._wallet ? await this._wallet.isPreauthorized() : !1;
  }
  async chainId() {
    if (this.ensureWallet(), !this._wallet) throw new _lastConnectedB964dc.a();
    const t = await this._wallet.provider.getChainId();
    return BigInt(t);
  }
  async onAccountsChanged(t) {
    let i;
    if (typeof t == "string" ? i = t : i = t[0], i) {
      const n = await this.chainId();
      this.emit("change", {
        account: i,
        chainId: n
      });
    } else this.emit("disconnect");
  }
  onNetworkChanged(t) {
    switch (t) {
      case "SN_MAIN":
        this.emit("change", {
          chainId: BigInt(_starknet.constants.StarknetChainId.SN_MAIN)
        });
        break;
      case "SN_SEPOLIA":
        this.emit("change", {
          chainId: BigInt(_starknet.constants.StarknetChainId.SN_SEPOLIA)
        });
        break;
      case "mainnet-alpha":
        this.emit("change", {
          chainId: BigInt(_starknet.constants.StarknetChainId.SN_MAIN)
        });
        break;
      case "sepolia-alpha":
        this.emit("change", {
          chainId: BigInt(_starknet.constants.StarknetChainId.SN_SEPOLIA)
        });
        break;
      default:
        this.emit("change", {});
        break;
    }
  }
  async connect() {
    if (this.ensureWallet(), !this._wallet) throw new _lastConnectedB964dc.b();
    let t;
    try {
      t = await this._wallet.enable({
        starknetVersion: "v5"
      });
      const {
        provider: a
      } = this._options;
      a && Object.assign(this._wallet.account, {
        provider: a
      });
    } catch {
      throw new _lastConnectedB964dc.U();
    }
    if (!this._wallet.isConnected || !t) throw new _lastConnectedB964dc.U();
    this._wallet.on("accountsChanged", async a => {
      await this.onAccountsChanged(a);
    }), this._wallet.on("networkChanged", a => {
      this.onNetworkChanged(a);
    }), await this.onAccountsChanged(t);
    const i = this._wallet.account.address,
      n = await this.chainId();
    return this.emit("connect", {
      account: i,
      chainId: n
    }), {
      account: i,
      chainId: n
    };
  }
  async disconnect() {
    if (this.ensureWallet(), (0, _lastConnectedB964dc.r)(), !this.available()) throw new _lastConnectedB964dc.b();
    if (!this._wallet?.isConnected) throw new _lastConnectedB964dc.d();
  }
  async account() {
    if (this.ensureWallet(), !this._wallet || !this._wallet.account) throw new _lastConnectedB964dc.a();
    return this._wallet.account;
  }
  get id() {
    return this._options.id;
  }
  get name() {
    if (!this._wallet) throw new _lastConnectedB964dc.a();
    return this._wallet.name;
  }
  get icon() {
    return this._options.icon ? this._options.icon : this._wallet?.icon ? {
      dark: this._wallet.icon,
      light: this._wallet.icon
    } : {
      dark: h,
      light: l
    };
  }
  get wallet() {
    if (!this._wallet) throw new _lastConnectedB964dc.a();
    return this._wallet;
  }
  ensureWallet() {
    const i = z(globalThis).filter(n => n.id === this._options.id)[0];
    if (i) {
      const {
        provider: n
      } = this._options;
      n && Object.assign(i, {
        provider: n
      }), this._wallet = i;
    }
  }
}
exports.I = L;
function z(M) {
  return Object.values(Object.getOwnPropertyNames(M).reduce((e, t) => {
    if (t.startsWith("starknet")) {
      const i = M[t];
      A(i) && !e[i.id] && (e[i.id] = i);
    }
    return e;
  }, {}));
}
function A(M) {
  try {
    return M && [
    // wallet's must have methods/members, see IStarknetWindowObject
    "request", "isConnected", "provider", "enable", "isPreauthorized", "on", "off", "version", "id", "name", "icon"].every(e => e in M);
  } catch {}
  return !1;
}

},{"./lastConnected-b964dc30.js":12,"starknet":undefined}],5:[function(require,module,exports){
"use strict";var s=Object.defineProperty;var o=(n,i,t)=>i in n?s(n,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[i]=t;var N=(n,i,t)=>(o(n,typeof i!="symbol"?i+"":i,t),t);const a=require("starknet"),M=require("./lastConnected-080a1315.cjs"),r="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTE4LjQwMTggNy41NTU1NkgxMy41OTgyQzEzLjQzNzcgNy41NTU1NiAxMy4zMDkxIDcuNjg3NDcgMTMuMzA1NiA3Ljg1MTQzQzEzLjIwODUgMTIuNDYwMyAxMC44NDg0IDE2LjgzNDcgNi43ODYwOCAxOS45MzMxQzYuNjU3MTEgMjAuMDMxNCA2LjYyNzczIDIwLjIxNjIgNi43MjIwMiAyMC4zNDkzTDkuNTMyNTMgMjQuMzE5NkM5LjYyODE1IDI0LjQ1NDggOS44MTQ0NCAyNC40ODUzIDkuOTQ1NTggMjQuMzg2QzEyLjQ4NTYgMjIuNDYxMyAxNC41Mjg3IDIwLjEzOTUgMTYgMTcuNTY2QzE3LjQ3MTMgMjAuMTM5NSAxOS41MTQ1IDIyLjQ2MTMgMjIuMDU0NSAyNC4zODZDMjIuMTg1NiAyNC40ODUzIDIyLjM3MTkgMjQuNDU0OCAyMi40Njc2IDI0LjMxOTZMMjUuMjc4MSAyMC4zNDkzQzI1LjM3MjMgMjAuMjE2MiAyNS4zNDI5IDIwLjAzMTQgMjUuMjE0IDE5LjkzMzFDMjEuMTUxNiAxNi44MzQ3IDE4Ljc5MTUgMTIuNDYwMyAxOC42OTQ2IDcuODUxNDNDMTguNjkxMSA3LjY4NzQ3IDE4LjU2MjMgNy41NTU1NiAxOC40MDE4IDcuNTU1NTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjQuNzIzNiAxMC40OTJMMjQuMjIzMSA4LjkyNDM5QzI0LjEyMTMgOC42MDYxNCAyMy44NzM0IDguMzU4MjQgMjMuNTU3NyA4LjI2MDIzTDIyLjAwMzkgNy43NzU5NUMyMS43ODk1IDcuNzA5MDYgMjEuNzg3MyA3LjQwMTc3IDIyLjAwMTEgNy4zMzIwMUwyMy41NDY5IDYuODI0NjZDMjMuODYwOSA2LjcyMTQ2IDI0LjEwNiA2LjQ2OTUyIDI0LjIwMjcgNi4xNTAxMUwyNC42Nzk4IDQuNTc1MDJDMjQuNzQ1OCA0LjM1NzA5IDI1LjA0ODkgNC4zNTQ3NyAyNS4xMTgzIDQuNTcxNTZMMjUuNjE4OCA2LjEzOTE1QzI1LjcyMDYgNi40NTc0IDI1Ljk2ODYgNi43MDUzMSAyNi4yODQyIDYuODAzOUwyNy44MzggNy4yODc2MUMyOC4wNTI0IDcuMzU0NSAyOC4wNTQ3IDcuNjYxNzkgMjcuODQwOCA3LjczMjEzTDI2LjI5NSA4LjIzOTQ4QzI1Ljk4MTEgOC4zNDIxIDI1LjczNiA4LjU5NDA0IDI1LjYzOTMgOC45MTQwMkwyNS4xNjIxIDEwLjQ4ODVDMjUuMDk2MSAxMC43MDY1IDI0Ljc5MyAxMC43MDg4IDI0LjcyMzYgMTAuNDkyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==",D="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0iYmxhY2siPgogIDxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTkuODc5IDcuNTE5YzEuMTcxLTEuMDI1IDMuMDcxLTEuMDI1IDQuMjQyIDAgMS4xNzIgMS4wMjUgMS4xNzIgMi42ODcgMCAzLjcxMi0uMjAzLjE3OS0uNDMuMzI2LS42Ny40NDItLjc0NS4zNjEtMS40NS45OTktMS40NSAxLjgyN3YuNzVNMjEgMTJhOSA5IDAgMTEtMTggMCA5IDkgMCAwMTE4IDB6bS05IDUuMjVoLjAwOHYuMDA4SDEydi0uMDA4eiIgLz4KPC9zdmc+",g="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0id2hpdGUiPgogIDxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTkuODc5IDcuNTE5YzEuMTcxLTEuMDI1IDMuMDcxLTEuMDI1IDQuMjQyIDAgMS4xNzIgMS4wMjUgMS4xNzIgMi42ODcgMCAzLjcxMi0uMjAzLjE3OS0uNDMuMzI2LS42Ny40NDItLjc0NS4zNjEtMS40NS45OTktMS40NSAxLjgyN3YuNzVNMjEgMTJhOSA5IDAgMTEtMTggMCA5IDkgMCAwMTE4IDB6bS05IDUuMjVoLjAwOHYuMDA4SDEydi0uMDA4eiIgLz4KPC9zdmc+Cg==";class u extends M.Connector{constructor({options:t}){super();N(this,"_wallet");N(this,"_options");this._options=t}available(){return this.ensureWallet(),this._wallet!==void 0}async ready(){return this.ensureWallet(),this._wallet?await this._wallet.isPreauthorized():!1}async chainId(){if(this.ensureWallet(),!this._wallet)throw new M.ConnectorNotConnectedError;const t=await this._wallet.provider.getChainId();return BigInt(t)}async onAccountsChanged(t){let e;if(typeof t=="string"?e=t:e=t[0],e){const c=await this.chainId();this.emit("change",{account:e,chainId:c})}else this.emit("disconnect")}onNetworkChanged(t){switch(t){case"SN_MAIN":this.emit("change",{chainId:BigInt(a.constants.StarknetChainId.SN_MAIN)});break;case"SN_SEPOLIA":this.emit("change",{chainId:BigInt(a.constants.StarknetChainId.SN_SEPOLIA)});break;case"mainnet-alpha":this.emit("change",{chainId:BigInt(a.constants.StarknetChainId.SN_MAIN)});break;case"sepolia-alpha":this.emit("change",{chainId:BigInt(a.constants.StarknetChainId.SN_SEPOLIA)});break;default:this.emit("change",{});break}}async connect(){if(this.ensureWallet(),!this._wallet)throw new M.ConnectorNotFoundError;let t;try{t=await this._wallet.enable({starknetVersion:"v5"});const{provider:I}=this._options;I&&Object.assign(this._wallet.account,{provider:I})}catch{throw new M.UserRejectedRequestError}if(!this._wallet.isConnected||!t)throw new M.UserRejectedRequestError;this._wallet.on("accountsChanged",async I=>{await this.onAccountsChanged(I)}),this._wallet.on("networkChanged",I=>{this.onNetworkChanged(I)}),await this.onAccountsChanged(t);const e=this._wallet.account.address,c=await this.chainId();return this.emit("connect",{account:e,chainId:c}),{account:e,chainId:c}}async disconnect(){if(this.ensureWallet(),M.removeStarknetLastConnectedWallet(),!this.available())throw new M.ConnectorNotFoundError;if(!this._wallet?.isConnected)throw new M.UserNotConnectedError}async account(){if(this.ensureWallet(),!this._wallet||!this._wallet.account)throw new M.ConnectorNotConnectedError;return this._wallet.account}get id(){return this._options.id}get name(){if(!this._wallet)throw new M.ConnectorNotConnectedError;return this._wallet.name}get icon(){return this._options.icon?this._options.icon:this._wallet?.icon?{dark:this._wallet.icon,light:this._wallet.icon}:{dark:g,light:D}}get wallet(){if(!this._wallet)throw new M.ConnectorNotConnectedError;return this._wallet}ensureWallet(){const e=j(globalThis).filter(c=>c.id===this._options.id)[0];if(e){const{provider:c}=this._options;c&&Object.assign(e,{provider:c}),this._wallet=e}}}function j(n){return Object.values(Object.getOwnPropertyNames(n).reduce((i,t)=>{if(t.startsWith("starknet")){const e=n[t];l(e)&&!i[e.id]&&(i[e.id]=e)}return i},{}))}function l(n){try{return n&&["request","isConnected","provider","enable","isPreauthorized","on","off","version","id","name","icon"].every(i=>i in n)}catch{}return!1}exports.ARGENT_X_ICON=r;exports.InjectedConnector=u;

},{"./lastConnected-080a1315.cjs":11,"starknet":undefined}],6:[function(require,module,exports){
"use strict";var b=Object.defineProperty;var v=(e,o,t)=>o in e?b(e,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[o]=t;var l=(e,o,t)=>(v(e,typeof o!="symbol"?o+"":o,t),t);const h=require("starknet"),n=require("./lastConnected-080a1315.cjs"),m=require("./publicRcpNodes-77022e83.cjs"),d="f2e613881f7a0e811295cdd57999e31b",u=`<svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="8" fill="#FF875B" />
    <path
      d="M18.316 8H13.684C13.5292 8 13.4052 8.1272 13.4018 8.28531C13.3082 12.7296 11.0323 16.9477 7.11513 19.9355C6.99077 20.0303 6.96243 20.2085 7.05335 20.3369L9.76349 24.1654C9.85569 24.2957 10.0353 24.3251 10.1618 24.2294C12.6111 22.3734 14.5812 20.1345 16 17.6529C17.4187 20.1345 19.389 22.3734 21.8383 24.2294C21.9646 24.3251 22.1443 24.2957 22.2366 24.1654L24.9467 20.3369C25.0375 20.2085 25.0092 20.0303 24.885 19.9355C20.9676 16.9477 18.6918 12.7296 18.5983 8.28531C18.5949 8.1272 18.4708 8 18.316 8Z"
      fill="white"
    />
  </svg>`,y=()=>Object.keys(localStorage).some(e=>e==="walletconnect"||e.startsWith("wc@2:")),c=()=>{if(y()){delete localStorage.walletconnect;for(const e in localStorage)e.startsWith("wc@2:")&&delete localStorage[e]}},A=()=>window?.starknet_argentX?window?.starknet_argentX?.isInAppBrowser:!1;class k extends n.Connector{constructor(t={}){super();l(this,"_wallet",null);l(this,"_options");this._options=t}available(){return!0}async ready(){return await this.ensureWallet(),this._wallet?this._wallet.isPreauthorized():!1}get id(){return"argentMobile"}get name(){return"Argent (mobile)"}get icon(){return{dark:u,light:u}}get wallet(){if(!this._wallet)throw new n.ConnectorNotConnectedError;return this._wallet}async connect(){if(await this.ensureWallet(),!this._wallet)throw new n.ConnectorNotFoundError;const t=this._wallet.account,r=await this.chainId();return{account:t.address,chainId:r}}async disconnect(){if(await this._wallet.disable(),c(),!this.available()&&!this._wallet)throw new n.ConnectorNotFoundError;if(!this._wallet?.isConnected)throw new n.UserNotConnectedError;this._wallet=null}async account(){if(!this._wallet||!this._wallet.account)throw new n.ConnectorNotConnectedError;return this._wallet.account}async chainId(){if(!this._wallet||!this.wallet.account||!this._wallet.provider)throw new n.ConnectorNotConnectedError;const t=await this._wallet.provider.getChainId();return BigInt(t)}async initEventListener(t){if(!this._wallet)throw new n.ConnectorNotConnectedError;this._wallet.on("accountsChanged",t)}async removeEventListener(t){if(!this._wallet)throw new n.ConnectorNotConnectedError;this._wallet.off("accountsChanged",t),this._wallet=null}async ensureWallet(){const{getStarknetWindowObject:t}=await Promise.resolve().then(()=>require("./index-03381a57.cjs")),{chainId:r,projectId:a,dappName:C,description:_,url:g,icons:p,provider:f,rpcUrl:I}=this._options,s=m.getRandomPublicRPCNode(),N=I??(!r||r===h.constants.NetworkName.SN_MAIN?s.mainnet:s.testnet),E={chainId:r??h.constants.NetworkName.SN_MAIN,name:C,projectId:a??d,description:_,url:g,icons:p,provider:f,rpcUrl:N};a===d&&(console.log("========= NOTICE ========="),console.log("While your application will continue to function, we highly recommended"),console.log("signing up for your own API keys."),console.log("Go to WalletConnect Cloud (https://cloud.walletconnect.com) and create a new account."),console.log("Once your account is created, create a new project and collect the Project ID"),console.log("=========================="));const i=await t(E);if(!i)throw new n.UserRejectedRequestError;this._wallet=i;const w=this._wallet;await w.enable(),w.client.on("session_delete",()=>{c(),this._wallet=null,n.removeStarknetLastConnectedWallet(),document.dispatchEvent(new Event("wallet_disconnected"))})}}exports.ArgentMobileConnector=k;exports.isInArgentMobileAppBrowser=A;exports.resetWalletConnect=c;

},{"./index-03381a57.cjs":3,"./lastConnected-080a1315.cjs":11,"./publicRcpNodes-77022e83.cjs":13,"starknet":undefined}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.r = exports.i = exports.A = void 0;
var _starknet = require("starknet");
var _lastConnectedB964dc = require("./lastConnected-b964dc30.js");
var _publicRcpNodesBe = require("./publicRcpNodes-be041588.js");
var b = Object.defineProperty;
var y = (e, n, t) => n in e ? b(e, n, {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: t
}) : e[n] = t;
var l = (e, n, t) => (y(e, typeof n != "symbol" ? n + "" : n, t), t);
const d = "f2e613881f7a0e811295cdd57999e31b",
  u = `<svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="8" fill="#FF875B" />
    <path
      d="M18.316 8H13.684C13.5292 8 13.4052 8.1272 13.4018 8.28531C13.3082 12.7296 11.0323 16.9477 7.11513 19.9355C6.99077 20.0303 6.96243 20.2085 7.05335 20.3369L9.76349 24.1654C9.85569 24.2957 10.0353 24.3251 10.1618 24.2294C12.6111 22.3734 14.5812 20.1345 16 17.6529C17.4187 20.1345 19.389 22.3734 21.8383 24.2294C21.9646 24.3251 22.1443 24.2957 22.2366 24.1654L24.9467 20.3369C25.0375 20.2085 25.0092 20.0303 24.885 19.9355C20.9676 16.9477 18.6918 12.7296 18.5983 8.28531C18.5949 8.1272 18.4708 8 18.316 8Z"
      fill="white"
    />
  </svg>`,
  R = () => Object.keys(localStorage).some(e => e === "walletconnect" || e.startsWith("wc@2:")),
  _ = () => {
    if (R()) {
      delete localStorage.walletconnect;
      for (const e in localStorage) e.startsWith("wc@2:") && delete localStorage[e];
    }
  },
  j = () => window?.starknet_argentX ? window?.starknet_argentX?.isInAppBrowser : !1;
exports.i = j;
exports.r = _;
class O extends _lastConnectedB964dc.C {
  constructor(t = {}) {
    super();
    l(this, "_wallet", null);
    l(this, "_options");
    this._options = t;
  }
  available() {
    return !0;
  }
  async ready() {
    return await this.ensureWallet(), this._wallet ? this._wallet.isPreauthorized() : !1;
  }
  get id() {
    return "argentMobile";
  }
  get name() {
    return "Argent (mobile)";
  }
  get icon() {
    return {
      dark: u,
      light: u
    };
  }
  get wallet() {
    if (!this._wallet) throw new _lastConnectedB964dc.a();
    return this._wallet;
  }
  async connect() {
    if (await this.ensureWallet(), !this._wallet) throw new _lastConnectedB964dc.b();
    const t = this._wallet.account,
      o = await this.chainId();
    return {
      account: t.address,
      chainId: o
    };
  }
  async disconnect() {
    if (await this._wallet.disable(), _(), !this.available() && !this._wallet) throw new _lastConnectedB964dc.b();
    if (!this._wallet?.isConnected) throw new _lastConnectedB964dc.d();
    this._wallet = null;
  }
  async account() {
    if (!this._wallet || !this._wallet.account) throw new _lastConnectedB964dc.a();
    return this._wallet.account;
  }
  async chainId() {
    if (!this._wallet || !this.wallet.account || !this._wallet.provider) throw new _lastConnectedB964dc.a();
    const t = await this._wallet.provider.getChainId();
    return BigInt(t);
  }
  // needed, methods required by starknet-react. Otherwise an exception is throwd
  async initEventListener(t) {
    if (!this._wallet) throw new _lastConnectedB964dc.a();
    this._wallet.on("accountsChanged", t);
  }
  // needed, methods required by starknet-react. Otherwise an exception is throwd
  async removeEventListener(t) {
    if (!this._wallet) throw new _lastConnectedB964dc.a();
    this._wallet.off("accountsChanged", t), this._wallet = null;
  }
  async ensureWallet() {
    const {
        getStarknetWindowObject: t
      } = await import("./index-00451f1a.js"),
      {
        chainId: o,
        projectId: r,
        dappName: g,
        description: p,
        url: C,
        icons: f,
        provider: m,
        rpcUrl: I
      } = this._options,
      s = (0, _publicRcpNodesBe.g)(),
      v = I ?? (!o || o === _starknet.constants.NetworkName.SN_MAIN ? s.mainnet : s.testnet),
      N = {
        chainId: o ?? _starknet.constants.NetworkName.SN_MAIN,
        name: g,
        projectId: r ?? d,
        description: p,
        url: C,
        icons: f,
        provider: m,
        rpcUrl: v
      };
    r === d && (console.log("========= NOTICE ========="), console.log("While your application will continue to function, we highly recommended"), console.log("signing up for your own API keys."), console.log("Go to WalletConnect Cloud (https://cloud.walletconnect.com) and create a new account."), console.log("Once your account is created, create a new project and collect the Project ID"), console.log("=========================="));
    const i = await t(N);
    if (!i) throw new _lastConnectedB964dc.U();
    this._wallet = i;
    const c = this._wallet;
    await c.enable(), c.client.on("session_delete", () => {
      _(), this._wallet = null, (0, _lastConnectedB964dc.r)(), document.dispatchEvent(new Event("wallet_disconnected"));
    });
  }
}
exports.A = O;

},{"./lastConnected-b964dc30.js":12,"./publicRcpNodes-be041588.js":14,"starknet":undefined}],8:[function(require,module,exports){
(function (process){(function (){
"use strict";var tn=Object.defineProperty;var rn=(t,e,r)=>e in t?tn(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var ae=(t,e,r)=>(rn(t,typeof e!="symbol"?e+"":e,r),r);const S=require("./lastConnected-080a1315.cjs"),Ye=require("starknet"),nn=require("./publicRcpNodes-77022e83.cjs"),kt="https://web.argent.xyz",Zt=`<svg
    width="32"
    height="28"
    viewBox="0 0 18 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M1.5 0.4375C0.982233 0.4375 0.5625 0.857233 0.5625 1.375V12C0.5625 12.4144 0.72712 12.8118 1.02015 13.1049C1.31317 13.3979 1.7106 13.5625 2.125 13.5625H15.875C16.2894 13.5625 16.6868 13.3979 16.9799 13.1049C17.2729 12.8118 17.4375 12.4144 17.4375 12V1.375C17.4375 0.857233 17.0178 0.4375 16.5 0.4375H1.5ZM2.4375 3.50616V11.6875H15.5625V3.50616L9.63349 8.94108C9.27507 9.26964 8.72493 9.26964 8.36651 8.94108L2.4375 3.50616ZM14.0899 2.3125H3.91013L9 6.97822L14.0899 2.3125Z"
      fill="currentColor"
    />
  </svg>`,sn="https://static.hydrogen.argent47.net/webwallet/iframe_whitelist_testnet.json",on="https://static.argent.net/webwallet/iframe_whitelist_mainnet.json";function an(t){return t}function cn(t){return t.length===0?an:t.length===1?t[0]:function(r){return t.reduce((n,s)=>s(n),r)}}function un(t){return typeof t=="object"&&t!==null&&"subscribe"in t}function Qe(t){const e={subscribe(r){let n=null,s=!1,o=!1,a=!1;function i(){if(n===null){a=!0;return}o||(o=!0,typeof n=="function"?n():n&&n.unsubscribe())}return n=t({next(c){s||r.next?.(c)},error(c){s||(s=!0,r.error?.(c),i())},complete(){s||(s=!0,r.complete?.(),i())}}),a&&i(),{unsubscribe:i}},pipe(...r){return cn(r)(e)}};return e}function or(t){return e=>{let r=0,n=null;const s=[];function o(){n||(n=e.subscribe({next(i){for(const c of s)c.next?.(i)},error(i){for(const c of s)c.error?.(i)},complete(){for(const i of s)i.complete?.()}}))}function a(){if(r===0&&n){const i=n;n=null,i.unsubscribe()}}return{subscribe(i){return r++,s.push(i),o(),{unsubscribe(){r--,a();const c=s.findIndex(u=>u===i);c>-1&&s.splice(c,1)}}}}}}function ln(t){return e=>({subscribe(r){let n=0;return e.subscribe({next(o){r.next?.(t(o,n++))},error(o){r.error?.(o)},complete(){r.complete?.()}})}})}function ar(t){return e=>({subscribe(r){return e.subscribe({next(n){t.next?.(n),r.next?.(n)},error(n){t.error?.(n),r.error?.(n)},complete(){t.complete?.(),r.complete?.()}})}})}let dn=class ir extends Error{constructor(e){super(e),this.name="ObservableAbortError",Object.setPrototypeOf(this,ir.prototype)}};function cr(t){let e;return{promise:new Promise((n,s)=>{let o=!1;function a(){o||(o=!0,s(new dn("This operation was aborted.")),i.unsubscribe())}const i=t.subscribe({next(c){o=!0,n(c),a()},error(c){o=!0,s(c),a()},complete(){o=!0,a()}});e=a}),abort:e}}const fn=Object.freeze(Object.defineProperty({__proto__:null,isObservable:un,map:ln,observable:Qe,observableToPromise:cr,share:or,tap:ar},Symbol.toStringTag,{value:"Module"}));function ur(t){return Qe(e=>{function r(s=0,o=t.op){const a=t.links[s];if(!a)throw new Error("No more links to execute - did you forget to add an ending link?");return a({op:o,next(c){return r(s+1,c)}})}return r().subscribe(e)})}function Ut(t){return Array.isArray(t)?t:[t]}function pn(t){return e=>{const r=Ut(t.true).map(s=>s(e)),n=Ut(t.false).map(s=>s(e));return s=>Qe(o=>{const a=t.condition(s.op)?r:n;return ur({op:s.op,links:a}).subscribe(o)})}}function hn(t){return t instanceof lr||t.name==="TRPCClientError"}let lr=class Me extends Error{static from(e,r={}){return e instanceof Error?hn(e)?(r.meta&&(e.meta={...e.meta,...r.meta}),e):new Me(e.message,{...r,cause:e,result:null}):new Me(e.error.message??"",{...r,cause:void 0,result:e})}constructor(e,r){const n=r?.cause;super(e,{cause:n}),this.meta=r?.meta,this.cause=n,this.shape=r?.result?.error,this.data=r?.result?.error.data,this.name="TRPCClientError",Object.setPrototypeOf(this,Me.prototype)}};function dr(t){const e=Object.create(null);for(const r in t){const n=t[r];e[n]=r}return e}const Xe={PARSE_ERROR:-32700,BAD_REQUEST:-32600,INTERNAL_SERVER_ERROR:-32603,NOT_IMPLEMENTED:-32603,UNAUTHORIZED:-32001,FORBIDDEN:-32003,NOT_FOUND:-32004,METHOD_NOT_SUPPORTED:-32005,TIMEOUT:-32008,CONFLICT:-32009,PRECONDITION_FAILED:-32012,PAYLOAD_TOO_LARGE:-32013,UNPROCESSABLE_CONTENT:-32022,TOO_MANY_REQUESTS:-32029,CLIENT_CLOSED_REQUEST:-32099};dr(Xe);dr(Xe);const mn={PARSE_ERROR:400,BAD_REQUEST:400,UNAUTHORIZED:401,NOT_FOUND:404,FORBIDDEN:403,METHOD_NOT_SUPPORTED:405,TIMEOUT:408,CONFLICT:409,PRECONDITION_FAILED:412,PAYLOAD_TOO_LARGE:413,UNPROCESSABLE_CONTENT:422,TOO_MANY_REQUESTS:429,CLIENT_CLOSED_REQUEST:499,INTERNAL_SERVER_ERROR:500,NOT_IMPLEMENTED:501};function yn(t){return mn[t]??500}function fr(t){return yn(t.code)}const pr=()=>{};function hr(t,e){return new Proxy(pr,{get(n,s){if(!(typeof s!="string"||s==="then"))return hr(t,[...e,s])},apply(n,s,o){const a=e[e.length-1]==="apply";return t({args:a?o.length>=2?o[1]:[]:o,path:a?e.slice(0,-1):e})}})}const Ct=t=>hr(t,[]),Rt=t=>new Proxy(pr,{get(e,r){if(!(typeof r!="string"||r==="then"))return t(r)}});function gn(t){const{path:e,error:r,config:n}=t,{code:s}=t.error,o={message:r.message,code:Xe[s],data:{code:s,httpStatus:fr(r)}};return n.isDev&&typeof t.error.stack=="string"&&(o.data.stack=t.error.stack),typeof e=="string"&&(o.data.path=e),n.errorFormatter({...t,shape:o})}function Wt(t,e){return"error"in e?{...e,error:t.transformer.output.serialize(e.error)}:"data"in e.result?{...e,result:{...e.result,data:t.transformer.output.serialize(e.result.data)}}:e}function bn(t,e){return Array.isArray(e)?e.map(r=>Wt(t,r)):Wt(t,e)}const wn=Object.freeze(Object.defineProperty({__proto__:null,createFlatProxy:Rt,createRecursiveProxy:Ct,getErrorShape:gn,transformTRPCResponse:bn},Symbol.toStringTag,{value:"Module"}));function _n(t){return typeof FormData>"u"?!1:t instanceof FormData}const ut={css:{query:["72e3ff","3fb0d8"],mutation:["c5a3fc","904dfc"],subscription:["ff49e1","d83fbe"]},ansi:{regular:{query:["\x1B[30;46m","\x1B[97;46m"],mutation:["\x1B[30;45m","\x1B[97;45m"],subscription:["\x1B[30;42m","\x1B[97;42m"]},bold:{query:["\x1B[1;30;46m","\x1B[1;97;46m"],mutation:["\x1B[1;30;45m","\x1B[1;97;45m"],subscription:["\x1B[1;30;42m","\x1B[1;97;42m"]}}};function vn(t){const{direction:e,type:r,path:n,id:s,input:o}=t,a=[],i=[];if(t.colorMode==="ansi"){const[f,m]=ut.ansi.regular[r],[v,E]=ut.ansi.bold[r],N="\x1B[0m";return a.push(e==="up"?f:m,e==="up"?">>":"<<",r,e==="up"?v:E,`#${s}`,n,N),e==="up"?i.push({input:t.input}):i.push({input:t.input,result:"result"in t.result?t.result.result:t.result,elapsedMs:t.elapsedMs}),{parts:a,args:i}}const[c,u]=ut.css[r],l=`
    background-color: #${e==="up"?c:u}; 
    color: ${e==="up"?"black":"white"};
    padding: 2px;
  `;return a.push("%c",e==="up"?">>":"<<",r,`#${s}`,`%c${n}%c`,"%O"),i.push(l,`${l}; font-weight: bold;`,`${l}; font-weight: normal;`),e==="up"?i.push({input:o,context:t.context}):i.push({input:o,result:t.result,elapsedMs:t.elapsedMs,context:t.context}),{parts:a,args:i}}const xn=({c:t=console,colorMode:e="css"})=>r=>{const n=r.input,s=_n(n)?Object.fromEntries(n):n,{parts:o,args:a}=vn({...r,colorMode:e,input:s}),i=r.direction==="down"&&r.result&&(r.result instanceof Error||"error"in r.result.result)?"error":"log";t[i].apply(null,[o.join(" ")].concat(a))};function Tn(t={}){const{enabled:e=()=>!0}=t,r=t.colorMode??(typeof window>"u"?"ansi":"css"),{logger:n=xn({c:t.console,colorMode:r})}=t;return()=>({op:s,next:o})=>Qe(a=>{e({...s,direction:"up"})&&n({...s,direction:"up"});const i=Date.now();function c(u){const l=Date.now()-i;e({...s,direction:"down",result:u})&&n({...s,direction:"down",elapsedMs:l,result:u})}return o(s).pipe(ar({next(u){c(u)},error(u){c(u)}})).subscribe(a)})}let En=class{$request({type:e,input:r,path:n,context:s={}}){return ur({links:this.links,op:{id:++this.requestId,type:e,path:n,input:r,context:s}}).pipe(or())}requestAsPromise(e){const r=this.$request(e),{promise:n,abort:s}=cr(r);return new Promise((a,i)=>{e.signal?.addEventListener("abort",s),n.then(c=>{a(c.result.data)}).catch(c=>{i(lr.from(c))})})}query(e,r,n){return this.requestAsPromise({type:"query",path:e,input:r,context:n?.context,signal:n?.signal})}mutation(e,r,n){return this.requestAsPromise({type:"mutation",path:e,input:r,context:n?.context,signal:n?.signal})}subscription(e,r,n){return this.$request({type:"subscription",path:e,input:r,context:n?.context}).subscribe({next(o){o.result.type==="started"?n.onStarted?.():o.result.type==="stopped"?n.onStopped?.():n.onData?.(o.result.data)},error(o){n.onError?.(o)},complete(){n.onComplete?.()}})}constructor(e){this.requestId=0;const r=(()=>{const n=e.transformer;return n?"input"in n?e.transformer:{input:n,output:n}:{input:{serialize:s=>s,deserialize:s=>s},output:{serialize:s=>s,deserialize:s=>s}}})();this.runtime={transformer:{serialize:n=>r.input.serialize(n),deserialize:n=>r.output.deserialize(n)},combinedTransformer:r},this.links=e.links.map(n=>n(this.runtime))}};const kn={query:"query",mutate:"mutation",subscribe:"subscription"},Cn=t=>kn[t];function Rn(t){return Rt(e=>t.hasOwnProperty(e)?t[e]:e==="__untypedClient"?t:Ct(({path:r,args:n})=>{const s=[e,...r],o=Cn(s.pop()),a=s.join(".");return t[o](a,...n)}))}function On(t){const e=new En(t);return Rn(e)}function Pn(t){return!!t&&!Array.isArray(t)&&typeof t=="object"}function Sn(t){if(t instanceof de)return t;const e=new de({code:"INTERNAL_SERVER_ERROR",cause:t});return t instanceof Error&&t.stack&&(e.stack=t.stack),e}class Nn extends Error{}function Ln(t){if(t instanceof Error)return t;const e=typeof t;if(!(e==="undefined"||e==="function"||t===null)){if(e!=="object")return new Error(String(t));if(Pn(t)){const r=new Nn;for(const n in t)r[n]=t[n];return r}}}class de extends Error{constructor(e){const r=Ln(e.cause),n=e.message??r?.message??e.code;super(n,{cause:r}),this.code=e.code,this.name=this.constructor.name}}function In(t){return"input"in t?t:{input:t,output:t}}const ge={_default:!0,input:{serialize:t=>t,deserialize:t=>t},output:{serialize:t=>t,deserialize:t=>t}},be=({shape:t})=>t;function An(t){return Object.assign(Object.create(null),t)}const jn=["query","mutation","subscription"];function Mn(t){return"router"in t._def}const $n={_ctx:null,_errorShape:null,_meta:null,queries:{},mutations:{},subscriptions:{},errorFormatter:be,transformer:ge},Dn=["then"];function mr(t){return function(r){const n=new Set(Object.keys(r).filter(c=>Dn.includes(c)));if(n.size>0)throw new Error("Reserved words used in `router({})` call: "+Array.from(n).join(", "));const s=An({});function o(c,u=""){for(const[l,f]of Object.entries(c??{})){const m=`${u}${l}`;if(Mn(f)){o(f._def.procedures,`${m}.`);continue}if(s[m])throw new Error(`Duplicate key: ${m}`);s[m]=f}}o(r);const a={_config:t,router:!0,procedures:s,...$n,record:r,queries:Object.entries(s).filter(c=>c[1]._def.query).reduce((c,[u,l])=>({...c,[u]:l}),{}),mutations:Object.entries(s).filter(c=>c[1]._def.mutation).reduce((c,[u,l])=>({...c,[u]:l}),{}),subscriptions:Object.entries(s).filter(c=>c[1]._def.subscription).reduce((c,[u,l])=>({...c,[u]:l}),{})};return{...r,_def:a,createCaller(c){return Ct(({path:l,args:f})=>{if(l.length===1&&jn.includes(l[0]))return Zn({procedures:a.procedures,path:f[0],rawInput:f[1],ctx:c,type:l[0]});const m=l.join("."),v=a.procedures[m];let E="query";return v._def.mutation?E="mutation":v._def.subscription&&(E="subscription"),v({path:m,rawInput:f[0],ctx:c,type:E})})},getErrorShape(c){const{path:u,error:l}=c,{code:f}=c.error,m={message:l.message,code:Xe[f],data:{code:f,httpStatus:fr(l)}};return t.isDev&&typeof c.error.stack=="string"&&(m.data.stack=c.error.stack),typeof u=="string"&&(m.data.path=u),this._def._config.errorFormatter({...c,shape:m})}}}}function Zn(t){const{type:e,path:r}=t;if(!(r in t.procedures)||!t.procedures[r]?._def[e])throw new de({code:"NOT_FOUND",message:`No "${e}"-procedure on path "${r}"`});const n=t.procedures[r];return n(t)}const qt=typeof window>"u"||"Deno"in window||globalThis.process?.env?.NODE_ENV==="test"||!!globalThis.process?.env?.JEST_WORKER_ID||!!globalThis.process?.env?.VITEST_WORKER_ID;function zt(t){const e=t;if(typeof e=="function")return e;if(typeof e.parseAsync=="function")return e.parseAsync.bind(e);if(typeof e.parse=="function")return e.parse.bind(e);if(typeof e.validateSync=="function")return e.validateSync.bind(e);if(typeof e.create=="function")return e.create.bind(e);if(typeof e.assert=="function")return r=>(e.assert(r),r);throw new Error("Could not find a validator fn")}function yr(t,...e){const r=Object.assign(Object.create(null),t);for(const n of e)for(const s in n){if(s in r&&r[s]!==n[s])throw new Error(`Duplicate key ${s}`);r[s]=n[s]}return r}function Un(){function t(r){return{_middlewares:r,unstable_pipe(n){const s="_middlewares"in n?n._middlewares:[n];return t([...r,...s])}}}function e(r){return t([r])}return e}function Bt(t){return t&&typeof t=="object"&&!Array.isArray(t)}function Wn(t){const e=async({next:r,rawInput:n,input:s})=>{let o;try{o=await t(n)}catch(i){throw new de({code:"BAD_REQUEST",cause:i})}const a=Bt(s)&&Bt(o)?{...s,...o}:o;return r({input:a})};return e._type="input",e}function qn(t){const e=async({next:r})=>{const n=await r();if(!n.ok)return n;try{const s=await t(n.data);return{...n,data:s}}catch(s){throw new de({message:"Output validation failed",code:"INTERNAL_SERVER_ERROR",cause:s})}};return e._type="output",e}const gr="middlewareMarker";function ie(t,e){const{middlewares:r=[],inputs:n,meta:s,...o}=e;return br({...yr(t,o),inputs:[...t.inputs,...n??[]],middlewares:[...t.middlewares,...r],meta:t.meta&&s?{...t.meta,...s}:s??t.meta})}function br(t={}){const e={inputs:[],middlewares:[],...t};return{_def:e,input(r){const n=zt(r);return ie(e,{inputs:[r],middlewares:[Wn(n)]})},output(r){const n=zt(r);return ie(e,{output:r,middlewares:[qn(n)]})},meta(r){return ie(e,{meta:r})},unstable_concat(r){return ie(e,r._def)},use(r){const n="_middlewares"in r?r._middlewares:[r];return ie(e,{middlewares:n})},query(r){return lt({...e,query:!0},r)},mutation(r){return lt({...e,mutation:!0},r)},subscription(r){return lt({...e,subscription:!0},r)}}}function lt(t,e){const r=ie(t,{resolver:e,middlewares:[async function(s){const o=await e(s);return{marker:gr,ok:!0,data:o,ctx:s.ctx}}]});return Bn(r._def)}const zn=`
If you want to call this function on the server, you do the following:
This is a client-only function.

const caller = appRouter.createCaller({
  /* ... your context */
});

const result = await caller.call('myProcedure', input);
`.trim();function Bn(t){const e=async function(n){if(!n||!("rawInput"in n))throw new Error(zn);const s=async(a={index:0,ctx:n.ctx})=>{try{const i=t.middlewares[a.index];return await i({ctx:a.ctx,type:n.type,path:n.path,rawInput:a.rawInput??n.rawInput,meta:t.meta,input:a.input,next(u){const l=u;return s({index:a.index+1,ctx:l&&"ctx"in l?{...a.ctx,...l.ctx}:a.ctx,input:l&&"input"in l?l.input:a.input,rawInput:l&&"rawInput"in l?l.rawInput:a.rawInput})}})}catch(i){return{ok:!1,error:Sn(i),marker:gr}}},o=await s();if(!o)throw new de({code:"INTERNAL_SERVER_ERROR",message:"No result from middlewares - did you forget to `return next()`?"});if(!o.ok)throw o.error;return o.data};return e._def=t,e.meta=t.meta,e}function Vn(...t){const e=yr({},...t.map(o=>o._def.record)),r=t.reduce((o,a)=>{if(a._def._config.errorFormatter&&a._def._config.errorFormatter!==be){if(o!==be&&o!==a._def._config.errorFormatter)throw new Error("You seem to have several error formatters");return a._def._config.errorFormatter}return o},be),n=t.reduce((o,a)=>{if(a._def._config.transformer&&a._def._config.transformer!==ge){if(o!==ge&&o!==a._def._config.transformer)throw new Error("You seem to have several transformers");return a._def._config.transformer}return o},ge);return mr({errorFormatter:r,transformer:n,isDev:t.some(o=>o._def._config.isDev),allowOutsideOfServer:t.some(o=>o._def._config.allowOutsideOfServer),isServer:t.some(o=>o._def._config.isServer),$types:t[0]?._def._config.$types})(e)}class Ze{context(){return new Ze}meta(){return new Ze}create(e){return Fn()(e)}}const Hn=new Ze;function Fn(){return function(e){const r=e?.errorFormatter??be,s={transformer:In(e?.transformer??ge),isDev:e?.isDev??globalThis.process?.env?.NODE_ENV!=="production",allowOutsideOfServer:e?.allowOutsideOfServer??!1,errorFormatter:r,isServer:e?.isServer??qt,$types:Rt(o=>{throw new Error(`Tried to access "$types.${o}" which is not available at runtime`)})};if(!(e?.isServer??qt)&&e?.allowOutsideOfServer!==!0)throw new Error("You're trying to use @trpc/server in a non-server environment. This is not supported by default.");return{_config:s,procedure:br({meta:e?.defaultMeta}),middleware:Un(),router:mr(s),mergeRouters:Vn}}}var bt={},Ke={},he={},O={};const me=S.getAugmentedNamespace(fn);var Ot={},wr=me;function _r(t){return wr.observable(e=>{function r(s=0,o=t.op){const a=t.links[s];if(!a)throw new Error("No more links to execute - did you forget to add an ending link?");return a({op:o,next(c){return r(s+1,c)}})}return r().subscribe(e)})}function Vt(t){return Array.isArray(t)?t:[t]}function Jn(t){return e=>{const r=Vt(t.true).map(s=>s(e)),n=Vt(t.false).map(s=>s(e));return s=>wr.observable(o=>{const a=t.condition(s.op)?r:n;return _r({op:s.op,links:a}).subscribe(o)})}}Ot.createChain=_r;Ot.splitLink=Jn;var ye={};function Gn(t){return t instanceof vr||t.name==="TRPCClientError"}let vr=class $e extends Error{static from(e,r={}){return e instanceof Error?Gn(e)?(r.meta&&(e.meta={...e.meta,...r.meta}),e):new $e(e.message,{...r,cause:e,result:null}):new $e(e.error.message??"",{...r,cause:void 0,result:e})}constructor(e,r){const n=r?.cause;super(e,{cause:n}),this.meta=r?.meta,this.cause=n,this.shape=r?.result?.error,this.data=r?.result?.error.data,this.name="TRPCClientError",Object.setPrototypeOf(this,$e.prototype)}};ye.TRPCClientError=vr;const Yn=S.getAugmentedNamespace(wn);var z={},Qn=ye;const Ht=t=>typeof t=="function";function xr(t){if(t)return t;if(typeof window<"u"&&Ht(window.fetch))return window.fetch;if(typeof globalThis<"u"&&Ht(globalThis.fetch))return globalThis.fetch;throw new Error("No fetch implementation found")}function Xn(t){return t||(typeof window<"u"&&window.AbortController?window.AbortController:typeof globalThis<"u"&&globalThis.AbortController?globalThis.AbortController:null)}function Kn(t){return{url:t.url,fetch:t.fetch,AbortController:Xn(t.AbortController)}}function es(t){const e={};for(let r=0;r<t.length;r++){const n=t[r];e[r]=n}return e}const ts={query:"GET",mutation:"POST"};function Tr(t){return"input"in t?t.runtime.transformer.serialize(t.input):es(t.inputs.map(e=>t.runtime.transformer.serialize(e)))}const Er=t=>{let e=t.url+"/"+t.path;const r=[];if("inputs"in t&&r.push("batch=1"),t.type==="query"){const n=Tr(t);n!==void 0&&r.push(`input=${encodeURIComponent(JSON.stringify(n))}`)}return r.length&&(e+="?"+r.join("&")),e},kr=t=>{if(t.type==="query")return;const e=Tr(t);return e!==void 0?JSON.stringify(e):void 0},rs=t=>Rr({...t,contentTypeHeader:"application/json",getUrl:Er,getBody:kr});async function Cr(t,e){const r=t.getUrl(t),n=t.getBody(t),{type:s}=t,o=await t.headers();/* istanbul ignore if -- @preserve */if(s==="subscription")throw new Error("Subscriptions should use wsLink");const a={...t.contentTypeHeader?{"content-type":t.contentTypeHeader}:{},...t.batchModeHeader?{"trpc-batch-mode":t.batchModeHeader}:{},...o};return xr(t.fetch)(r,{method:ts[s],signal:e?.signal,body:n,headers:a})}function Rr(t){const e=t.AbortController?new t.AbortController:null,r={};return{promise:new Promise((o,a)=>{Cr(t,e).then(i=>(r.response=i,i.json())).then(i=>{r.responseJSON=i,o({json:i,meta:r})}).catch(i=>{a(Qn.TRPCClientError.from(i,{meta:r}))})}),cancel:()=>{e?.abort()}}}z.fetchHTTPResponse=Cr;z.getBody=kr;z.getFetch=xr;z.getUrl=Er;z.httpRequest=Rr;z.jsonHttpRequester=rs;z.resolveHTTPLinkOptions=Kn;var Pt={},et={};function Ft(t){return!!t&&!Array.isArray(t)&&typeof t=="object"}function ns(t,e){if("error"in t){const n=e.transformer.deserialize(t.error);return{ok:!1,error:{...t,error:n}}}return{ok:!0,result:{...t.result,...(!t.result.type||t.result.type==="data")&&{type:"data",data:e.transformer.deserialize(t.result.data)}}}}class dt extends Error{constructor(){super("Unable to transform response from server")}}function ss(t,e){let r;try{r=ns(t,e)}catch{throw new dt}if(!r.ok&&(!Ft(r.error.error)||typeof r.error.error.code!="number"))throw new dt;if(r.ok&&!Ft(r.result))throw new dt;return r}et.transformResult=ss;var os=me,as=et,Jt=ye,wt=z;const ft=()=>{throw new Error("Something went wrong. Please submit an issue at https://github.com/trpc/trpc/issues/new")};function pt(t){let e=null,r=null;const n=()=>{clearTimeout(r),r=null,e=null};function s(i){const c=[[]];let u=0;for(;;){const l=i[u];if(!l)break;const f=c[c.length-1];if(l.aborted){l.reject?.(new Error("Aborted")),u++;continue}if(t.validate(f.concat(l).map(v=>v.key))){f.push(l),u++;continue}if(f.length===0){l.reject?.(new Error("Input is too big for a single dispatch")),u++;continue}c.push([])}return c}function o(){const i=s(e);n();for(const c of i){if(!c.length)continue;const u={items:c,cancel:ft};for(const v of c)v.batch=u;const l=(v,E)=>{const N=u.items[v];N.resolve?.(E),N.batch=null,N.reject=null,N.resolve=null},{promise:f,cancel:m}=t.fetch(u.items.map(v=>v.key),l);u.cancel=m,f.then(v=>{for(let E=0;E<v.length;E++){const N=v[E];l(E,N)}for(const E of u.items)E.reject?.(new Error("Missing result")),E.batch=null}).catch(v=>{for(const E of u.items)E.reject?.(v),E.batch=null})}}function a(i){const c={aborted:!1,key:i,batch:null,resolve:ft,reject:ft},u=new Promise((f,m)=>{c.reject=m,c.resolve=f,e||(e=[]),e.push(c)});return r||(r=setTimeout(o)),{promise:u,cancel:()=>{c.aborted=!0,c.batch?.items.every(f=>f.aborted)&&(c.batch.cancel(),c.batch=null)}}}return{load:a}}function Or(t){return function(r){const n=wt.resolveHTTPLinkOptions(r),s=r.maxURLLength??1/0;return o=>{const a=f=>{const m=E=>{if(s===1/0)return!0;const N=E.map(B=>B.path).join(","),se=E.map(B=>B.input);return wt.getUrl({...n,runtime:o,type:f,path:N,inputs:se}).length<=s},v=t({...n,runtime:o,type:f,opts:r});return{validate:m,fetch:v}},i=pt(a("query")),c=pt(a("mutation")),u=pt(a("subscription")),l={query:i,subscription:u,mutation:c};return({op:f})=>os.observable(m=>{const v=l[f.type],{promise:E,cancel:N}=v.load(f);let se;return E.then(j=>{se=j;const B=as.transformResult(j.json,o);if(!B.ok){m.error(Jt.TRPCClientError.from(B.error,{meta:j.meta}));return}m.next({context:j.meta,result:B.result}),m.complete()}).catch(j=>{m.error(Jt.TRPCClientError.from(j,{meta:se?.meta}))}),()=>{N()}})}}}const is=t=>e=>{const r=e.map(a=>a.path).join(","),n=e.map(a=>a.input),{promise:s,cancel:o}=wt.jsonHttpRequester({...t,path:r,inputs:n,headers(){return t.opts.headers?typeof t.opts.headers=="function"?t.opts.headers({opList:e}):t.opts.headers:{}}});return{promise:s.then(a=>(Array.isArray(a.json)?a.json:e.map(()=>a.json)).map(u=>({meta:a.meta,json:u}))),cancel:o}},cs=Or(is);Pt.createHTTPBatchLink=Or;Pt.httpBatchLink=cs;var tt={};Object.defineProperty(tt,"__esModule",{value:!0});var us=me,ls=et,Gt=ye,Pr=z;function Sr(t){return e=>{const r=Pr.resolveHTTPLinkOptions(e);return n=>({op:s})=>us.observable(o=>{const{path:a,input:i,type:c}=s,{promise:u,cancel:l}=t.requester({...r,runtime:n,type:c,path:a,input:i,headers(){return e.headers?typeof e.headers=="function"?e.headers({op:s}):e.headers:{}}});let f;return u.then(m=>{f=m.meta;const v=ls.transformResult(m.json,n);if(!v.ok){o.error(Gt.TRPCClientError.from(v.error,{meta:f}));return}o.next({context:m.meta,result:v.result}),o.complete()}).catch(m=>{o.error(Gt.TRPCClientError.from(m,{meta:f}))}),()=>{l()}})}}const ds=Sr({requester:Pr.jsonHttpRequester});tt.httpLink=ds;tt.httpLinkFactory=Sr;var St={};Object.defineProperty(St,"__esModule",{value:!0});var Yt=me;function fs(t){return typeof FormData>"u"?!1:t instanceof FormData}const ht={css:{query:["72e3ff","3fb0d8"],mutation:["c5a3fc","904dfc"],subscription:["ff49e1","d83fbe"]},ansi:{regular:{query:["\x1B[30;46m","\x1B[97;46m"],mutation:["\x1B[30;45m","\x1B[97;45m"],subscription:["\x1B[30;42m","\x1B[97;42m"]},bold:{query:["\x1B[1;30;46m","\x1B[1;97;46m"],mutation:["\x1B[1;30;45m","\x1B[1;97;45m"],subscription:["\x1B[1;30;42m","\x1B[1;97;42m"]}}};function ps(t){const{direction:e,type:r,path:n,id:s,input:o}=t,a=[],i=[];if(t.colorMode==="ansi"){const[f,m]=ht.ansi.regular[r],[v,E]=ht.ansi.bold[r],N="\x1B[0m";return a.push(e==="up"?f:m,e==="up"?">>":"<<",r,e==="up"?v:E,`#${s}`,n,N),e==="up"?i.push({input:t.input}):i.push({input:t.input,result:"result"in t.result?t.result.result:t.result,elapsedMs:t.elapsedMs}),{parts:a,args:i}}const[c,u]=ht.css[r],l=`
    background-color: #${e==="up"?c:u}; 
    color: ${e==="up"?"black":"white"};
    padding: 2px;
  `;return a.push("%c",e==="up"?">>":"<<",r,`#${s}`,`%c${n}%c`,"%O"),i.push(l,`${l}; font-weight: bold;`,`${l}; font-weight: normal;`),e==="up"?i.push({input:o,context:t.context}):i.push({input:o,result:t.result,elapsedMs:t.elapsedMs,context:t.context}),{parts:a,args:i}}const hs=({c:t=console,colorMode:e="css"})=>r=>{const n=r.input,s=fs(n)?Object.fromEntries(n):n,{parts:o,args:a}=ps({...r,colorMode:e,input:s}),i=r.direction==="down"&&r.result&&(r.result instanceof Error||"error"in r.result.result)?"error":"log";t[i].apply(null,[o.join(" ")].concat(a))};function ms(t={}){const{enabled:e=()=>!0}=t,r=t.colorMode??(typeof window>"u"?"ansi":"css"),{logger:n=hs({c:t.console,colorMode:r})}=t;return()=>({op:s,next:o})=>Yt.observable(a=>{e({...s,direction:"up"})&&n({...s,direction:"up"});const i=Date.now();function c(u){const l=Date.now()-i;e({...s,direction:"down",result:u})&&n({...s,direction:"down",elapsedMs:l,result:u})}return o(s).pipe(Yt.tap({next(u){c(u)},error(u){c(u)}})).subscribe(a)})}St.loggerLink=ms;var rt={};Object.defineProperty(rt,"__esModule",{value:!0});var ys=me,gs=et,Nr=ye;/* istanbul ignore next -- @preserve */const bs=t=>t===0?0:Math.min(1e3*2**t,3e4);function ws(t){const{url:e,WebSocket:r=WebSocket,retryDelayMs:n=bs,onOpen:s,onClose:o}=t;/* istanbul ignore next -- @preserve */if(!r)throw new Error("No WebSocket implementation found - you probably don't want to use this on the server, but if you do you need to pass a `WebSocket`-ponyfill");let a=[];const i=Object.create(null);let c=0,u=null,l=null,f=$t(),m="connecting";function v(){m!=="open"||u||(u=setTimeout(()=>{u=null,a.length===1?f.send(JSON.stringify(a.pop())):f.send(JSON.stringify(a)),a=[]}))}function E(){if(l!==null||m==="closed")return;const R=n(c++);se(R)}function N(){m="connecting";const R=f;f=$t(),j(R)}function se(R){l||(m="connecting",l=setTimeout(N,R))}function j(R){Object.values(i).some(oe=>oe.ws===R)||R.close()}function B(){Object.values(i).forEach(R=>{R.type==="subscription"&&R.callbacks.complete()})}function Mt(R){a.some(P=>P.id===R.op.id)||Dt(R.op,R.callbacks)}function $t(){const R=typeof e=="function"?e():e,P=new r(R);clearTimeout(l),l=null,P.addEventListener("open",()=>{/* istanbul ignore next -- @preserve */P===f&&(c=0,m="open",s?.(),v())}),P.addEventListener("error",()=>{P===f&&E()});const oe=A=>{if(A.method==="reconnect"&&P===f){m==="open"&&o?.(),N();for(const k of Object.values(i))k.type==="subscription"&&Mt(k)}},ct=A=>{const k=A.id!==null&&i[A.id];if(k){if(k.callbacks.next?.(A),k.ws!==f&&P===f){const V=k.ws;k.ws=f,j(V)}"result"in A&&A.result.type==="stopped"&&P===f&&k.callbacks.complete()}};return P.addEventListener("message",({data:A})=>{const k=JSON.parse(A);"method"in k?oe(k):ct(k),(P!==f||m==="closed")&&j(P)}),P.addEventListener("close",({code:A})=>{m==="open"&&o?.({code:A}),f===P&&E();for(const[k,V]of Object.entries(i))if(V.ws===P){if(m==="closed"){delete i[k],V.callbacks.complete?.();continue}V.type==="subscription"?Mt(V):(delete i[k],V.callbacks.error?.(Nr.TRPCClientError.from(new Nt("WebSocket closed prematurely"))))}}),P}function Dt(R,P){const{type:oe,input:ct,path:A,id:k}=R,V={id:k,method:oe,params:{input:ct,path:A}};return i[k]={ws:f,type:oe,callbacks:P,op:R},a.push(V),v(),()=>{const Kr=i[k]?.callbacks;delete i[k],a=a.filter(en=>en.id!==k),Kr?.complete?.(),f.readyState===r.OPEN&&R.type==="subscription"&&(a.push({id:k,method:"subscription.stop"}),v())}}return{close:()=>{m="closed",o?.(),B(),j(f),clearTimeout(l),l=null},request:Dt,getConnection(){return f}}}class Nt extends Error{constructor(e){super(e),this.name="TRPCWebSocketClosedError",Object.setPrototypeOf(this,Nt.prototype)}}function _s(t){return e=>{const{client:r}=t;return({op:n})=>ys.observable(s=>{const{type:o,path:a,id:i,context:c}=n,u=e.transformer.serialize(n.input),l=r.request({type:o,path:a,input:u,id:i,context:c},{error(f){s.error(f),l()},complete(){s.complete()},next(f){const m=gs.transformResult(f,e);if(!m.ok){s.error(Nr.TRPCClientError.from(m.error));return}s.next({result:m.result}),n.type!=="subscription"&&(l(),s.complete())}});return()=>{l()}})}}rt.createWSClient=ws;rt.wsLink=_s;Object.defineProperty(O,"__esModule",{value:!0});var Qt=me,Lr=Ot,Ir=ye,Xt=Yn,we=z,Ar=Pt,Lt=tt,vs=St,jr=rt;class nt{$request({type:e,input:r,path:n,context:s={}}){return Lr.createChain({links:this.links,op:{id:++this.requestId,type:e,path:n,input:r,context:s}}).pipe(Qt.share())}requestAsPromise(e){const r=this.$request(e),{promise:n,abort:s}=Qt.observableToPromise(r);return new Promise((a,i)=>{e.signal?.addEventListener("abort",s),n.then(c=>{a(c.result.data)}).catch(c=>{i(Ir.TRPCClientError.from(c))})})}query(e,r,n){return this.requestAsPromise({type:"query",path:e,input:r,context:n?.context,signal:n?.signal})}mutation(e,r,n){return this.requestAsPromise({type:"mutation",path:e,input:r,context:n?.context,signal:n?.signal})}subscription(e,r,n){return this.$request({type:"subscription",path:e,input:r,context:n?.context}).subscribe({next(o){o.result.type==="started"?n.onStarted?.():o.result.type==="stopped"?n.onStopped?.():n.onData?.(o.result.data)},error(o){n.onError?.(o)},complete(){n.onComplete?.()}})}constructor(e){this.requestId=0;const r=(()=>{const n=e.transformer;return n?"input"in n?e.transformer:{input:n,output:n}:{input:{serialize:s=>s,deserialize:s=>s},output:{serialize:s=>s,deserialize:s=>s}}})();this.runtime={transformer:{serialize:n=>r.input.serialize(n),deserialize:n=>r.output.deserialize(n)},combinedTransformer:r},this.links=e.links.map(n=>n(this.runtime))}}function xs(t){return new nt(t)}function Ts(t){return new nt(t)}const Es={query:"query",mutate:"mutation",subscribe:"subscription"},Mr=t=>Es[t];function $r(t){return Xt.createFlatProxy(e=>t.hasOwnProperty(e)?t[e]:e==="__untypedClient"?t:Xt.createRecursiveProxy(({path:r,args:n})=>{const s=[e,...r],o=Mr(s.pop()),a=s.join(".");return t[o](a,...n)}))}function ks(t){const e=new nt(t);return $r(e)}function Cs(t){return t.__untypedClient}function Rs(t){if(t)return t;if(typeof window<"u"&&window.TextDecoder)return new window.TextDecoder;if(typeof globalThis<"u"&&globalThis.TextDecoder)return new globalThis.TextDecoder;throw new Error("No TextDecoder implementation found")}async function Os(t){const e=t.parse??JSON.parse,r=n=>{if(t.signal?.aborted||!n||n==="}")return;const s=n.indexOf(":"),o=n.substring(2,s-1),a=n.substring(s+1);t.onSingle(Number(o),e(a))};await Ps(t.readableStream,r,t.textDecoder)}async function Ps(t,e,r){let n="";const s=o=>{const i=r.decode(o).split(`
`);if(i.length===1)n+=i[0];else if(i.length>1){e(n+i[0]);for(let c=1;c<i.length-1;c++)e(i[c]);n=i[i.length-1]}};"getReader"in t?await Ns(t,s):await Ss(t,s),e(n)}function Ss(t,e){return new Promise(r=>{t.on("data",e),t.on("end",r)})}async function Ns(t,e){const r=t.getReader();let n=await r.read();for(;!n.done;)e(n.value),n=await r.read()}const Ls=(t,e)=>{const r=t.AbortController?new t.AbortController:null,n=we.fetchHTTPResponse({...t,contentTypeHeader:"application/json",batchModeHeader:"stream",getUrl:we.getUrl,getBody:we.getBody},r),s=()=>r?.abort(),o=n.then(async a=>{if(!a.body)throw new Error("Received response without body");const i={response:a};return Os({readableStream:a.body,onSingle:e,parse:c=>({json:JSON.parse(c),meta:i}),signal:r?.signal,textDecoder:t.textDecoder})});return{cancel:s,promise:o}},Is=t=>{const e=Rs(t.opts.textDecoder);return(r,n)=>{const s=r.map(c=>c.path).join(","),o=r.map(c=>c.input),{cancel:a,promise:i}=Ls({...t,textDecoder:e,path:s,inputs:o,headers(){return t.opts.headers?typeof t.opts.headers=="function"?t.opts.headers({opList:r}):t.opts.headers:{}}},(c,u)=>{n(c,u)});return{promise:i.then(()=>[]),cancel:a}}},As=Ar.createHTTPBatchLink(Is),js=t=>{if("input"in t){if(!(t.input instanceof FormData))throw new Error("Input is not FormData");return t.input}},Ms=t=>{if(t.type!=="mutation")throw new Error("We only handle mutations with formdata");return we.httpRequest({...t,getUrl(){return`${t.url}/${t.path}`},getBody:js})},$s=Lt.httpLinkFactory({requester:Ms});O.splitLink=Lr.splitLink;O.TRPCClientError=Ir.TRPCClientError;O.getFetch=we.getFetch;O.httpBatchLink=Ar.httpBatchLink;O.httpLink=Lt.httpLink;O.httpLinkFactory=Lt.httpLinkFactory;O.loggerLink=vs.loggerLink;O.createWSClient=jr.createWSClient;O.wsLink=jr.wsLink;O.TRPCUntypedClient=nt;O.clientCallTypeToProcedureType=Mr;O.createTRPCClient=Ts;O.createTRPCClientProxy=$r;O.createTRPCProxyClient=ks;O.createTRPCUntypedClient=xs;O.experimental_formDataLink=$s;O.getUntypedClient=Cs;O.unstable_httpBatchStreamLink=As;var K={},It={};function Ds(t){return t}function Zs(t){return t.length===0?Ds:t.length===1?t[0]:function(r){return t.reduce((n,s)=>s(n),r)}}function Us(t){return typeof t=="object"&&t!==null&&"subscribe"in t}function Ws(t){const e={subscribe(r){let n=null,s=!1,o=!1,a=!1;function i(){if(n===null){a=!0;return}o||(o=!0,typeof n=="function"?n():n&&n.unsubscribe())}return n=t({next(c){s||r.next?.(c)},error(c){s||(s=!0,r.error?.(c),i())},complete(){s||(s=!0,r.complete?.(),i())}}),a&&i(),{unsubscribe:i}},pipe(...r){return Zs(r)(e)}};return e}It.isObservable=Us;It.observable=Ws;Object.defineProperty(K,"__esModule",{value:!0});var Dr=It;function qs(t){return e=>{let r=0,n=null;const s=[];function o(){n||(n=e.subscribe({next(i){for(const c of s)c.next?.(i)},error(i){for(const c of s)c.error?.(i)},complete(){for(const i of s)i.complete?.()}}))}function a(){if(r===0&&n){const i=n;n=null,i.unsubscribe()}}return{subscribe(i){return r++,s.push(i),o(),{unsubscribe(){r--,a();const c=s.findIndex(u=>u===i);c>-1&&s.splice(c,1)}}}}}}function zs(t){return e=>({subscribe(r){let n=0;return e.subscribe({next(o){r.next?.(t(o,n++))},error(o){r.error?.(o)},complete(){r.complete?.()}})}})}function Bs(t){return e=>({subscribe(r){return e.subscribe({next(n){t.next?.(n),r.next?.(n)},error(n){t.error?.(n),r.error?.(n)},complete(){t.complete?.(),r.complete?.()}})}})}class At extends Error{constructor(e){super(e),this.name="ObservableAbortError",Object.setPrototypeOf(this,At.prototype)}}function Vs(t){let e;return{promise:new Promise((n,s)=>{let o=!1;function a(){o||(o=!0,s(new At("This operation was aborted.")),i.unsubscribe())}const i=t.subscribe({next(c){o=!0,n(c),a()},error(c){o=!0,s(c),a()},complete(){o=!0,a()}});e=a}),abort:e}}K.isObservable=Dr.isObservable;K.observable=Dr.observable;K.map=zs;K.observableToPromise=Vs;K.share=qs;K.tap=Bs;var U={};Object.defineProperty(U,"__esModule",{value:!0});U.isTRPCRequestWithId=U.isTRPCRequest=U.isTRPCResponse=U.isTRPCMessage=void 0;function Kt(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}function Hs(t){return t==null}function Zr(t){return!!(Kt(t)&&"trpc"in t&&Kt(t.trpc))}U.isTRPCMessage=Zr;function jt(t){return Zr(t)&&"id"in t.trpc&&!Hs(t.trpc.id)}function Fs(t){return jt(t)&&("error"in t.trpc||"result"in t.trpc)}U.isTRPCResponse=Fs;function Ur(t){return jt(t)&&"method"in t.trpc}U.isTRPCRequest=Ur;function Js(t){return Ur(t)&&jt(t)}U.isTRPCRequestWithId=Js;Object.defineProperty(he,"__esModule",{value:!0});he.createBaseLink=void 0;const mt=O,Gs=K,Ys=U,Qs=t=>e=>({op:r})=>(0,Gs.observable)(n=>{const s=[],{id:o,type:a,path:i}=r;try{const c=e.transformer.serialize(r.input),u=()=>{n.error(new mt.TRPCClientError("Port disconnected prematurely"))};t.addCloseListener(u),s.push(()=>t.removeCloseListener(u));const l=f=>{if(!(0,Ys.isTRPCResponse)(f))return;const{trpc:m}=f;if(o===m.id){if("error"in m){const v=e.transformer.deserialize(m.error);n.error(mt.TRPCClientError.from(Object.assign(Object.assign({},m),{error:v})));return}n.next({result:Object.assign(Object.assign({},m.result),(!m.result.type||m.result.type==="data")&&{type:"data",data:e.transformer.deserialize(m.result.data)})}),(a!=="subscription"||m.result.type==="stopped")&&n.complete()}};t.addMessageListener(l),s.push(()=>t.removeMessageListener(l)),t.postMessage({trpc:{id:o,jsonrpc:void 0,method:a,params:{path:i,input:c}}})}catch(c){n.error(new mt.TRPCClientError(c instanceof Error?c.message:"Unknown error"))}return()=>{a==="subscription"&&t.postMessage({trpc:{id:o,jsonrpc:void 0,method:"subscription.stop"}}),s.forEach(c=>c())}});he.createBaseLink=Qs;Object.defineProperty(Ke,"__esModule",{value:!0});Ke.chromeLink=void 0;const Xs=he,Ks=t=>(0,Xs.createBaseLink)({postMessage(e){t.port.postMessage(e)},addMessageListener(e){t.port.onMessage.addListener(e)},removeMessageListener(e){t.port.onMessage.removeListener(e)},addCloseListener(e){t.port.onDisconnect.addListener(e)},removeCloseListener(e){t.port.onDisconnect.removeListener(e)}});Ke.chromeLink=Ks;var st={};Object.defineProperty(st,"__esModule",{value:!0});st.windowLink=void 0;const eo=he,to=t=>{var e;const r=new Map,n=t.window,s=(e=t.postWindow)!==null&&e!==void 0?e:n;return(0,eo.createBaseLink)({postMessage(o){s.postMessage(o,{targetOrigin:t.postOrigin})},addMessageListener(o){const a=i=>{o(i.data)};r.set(o,a),n.addEventListener("message",a)},removeMessageListener(o){const a=r.get(o);a&&n.removeEventListener("message",a)},addCloseListener(o){n.addEventListener("beforeunload",o)},removeCloseListener(o){n.removeEventListener("beforeunload",o)}})};st.windowLink=to;var ot={},at={};Object.defineProperty(at,"__esModule",{value:!0});at.TRPC_BROWSER_LOADED_EVENT=void 0;at.TRPC_BROWSER_LOADED_EVENT="TRPC_BROWSER::POPUP_LOADED";Object.defineProperty(ot,"__esModule",{value:!0});ot.popupLink=void 0;const ro=at,no=he,so=t=>{const e=new Map,r=new Set;let n=null;async function s(o){if(!n||n.closed){n=t.createPopup(),await Promise.race([new Promise(a=>{var i;try{(i=n?.addEventListener)===null||i===void 0||i.call(n,"load",a)}catch{}}),new Promise(a=>{o.addEventListener("message",i=>{i.data===ro.TRPC_BROWSER_LOADED_EVENT&&a()})}),new Promise(a=>{console.warn("Could not detect if popup loading succeeded after 15s timeout, continuing anyway"),setTimeout(a,15e3)})]);try{if(!n.addEventListener)throw new Error("popupWindow.addEventListener is not a function");n.addEventListener("beforeunload",()=>{n=null})}catch{const i=setInterval(()=>{n&&n.closed&&(n=null,r.forEach(c=>{c()}),clearInterval(i))},1e3)}}return n}return(0,no.createBaseLink)({async postMessage(o){return(await s(t.listenWindow)).postMessage(o,{targetOrigin:t.postOrigin})},addMessageListener(o){const a=i=>{o(i.data)};e.set(o,a),t.listenWindow.addEventListener("message",a)},removeMessageListener(o){const a=e.get(o);a&&t.listenWindow.removeEventListener("message",a)},addCloseListener(o){t.listenWindow.addEventListener("beforeunload",o),r.add(o)},removeCloseListener(o){t.listenWindow.removeEventListener("beforeunload",o),r.delete(o)}})};ot.popupLink=so;(function(t){var e=S.commonjsGlobal&&S.commonjsGlobal.__createBinding||(Object.create?function(n,s,o,a){a===void 0&&(a=o);var i=Object.getOwnPropertyDescriptor(s,o);(!i||("get"in i?!s.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return s[o]}}),Object.defineProperty(n,a,i)}:function(n,s,o,a){a===void 0&&(a=o),n[a]=s[o]}),r=S.commonjsGlobal&&S.commonjsGlobal.__exportStar||function(n,s){for(var o in n)o!=="default"&&!Object.prototype.hasOwnProperty.call(s,o)&&e(s,n,o)};Object.defineProperty(t,"__esModule",{value:!0}),r(Ke,t),r(st,t),r(ot,t)})(bt);var T;(function(t){t.assertEqual=s=>s;function e(s){}t.assertIs=e;function r(s){throw new Error}t.assertNever=r,t.arrayToEnum=s=>{const o={};for(const a of s)o[a]=a;return o},t.getValidEnumValues=s=>{const o=t.objectKeys(s).filter(i=>typeof s[s[i]]!="number"),a={};for(const i of o)a[i]=s[i];return t.objectValues(a)},t.objectValues=s=>t.objectKeys(s).map(function(o){return s[o]}),t.objectKeys=typeof Object.keys=="function"?s=>Object.keys(s):s=>{const o=[];for(const a in s)Object.prototype.hasOwnProperty.call(s,a)&&o.push(a);return o},t.find=(s,o)=>{for(const a of s)if(o(a))return a},t.isInteger=typeof Number.isInteger=="function"?s=>Number.isInteger(s):s=>typeof s=="number"&&isFinite(s)&&Math.floor(s)===s;function n(s,o=" | "){return s.map(a=>typeof a=="string"?`'${a}'`:a).join(o)}t.joinValues=n,t.jsonStringifyReplacer=(s,o)=>typeof o=="bigint"?o.toString():o})(T||(T={}));const h=T.arrayToEnum(["string","nan","number","integer","float","boolean","date","bigint","symbol","function","undefined","null","array","object","unknown","promise","void","never","map","set"]),Y=t=>{switch(typeof t){case"undefined":return h.undefined;case"string":return h.string;case"number":return isNaN(t)?h.nan:h.number;case"boolean":return h.boolean;case"function":return h.function;case"bigint":return h.bigint;case"symbol":return h.symbol;case"object":return Array.isArray(t)?h.array:t===null?h.null:t.then&&typeof t.then=="function"&&t.catch&&typeof t.catch=="function"?h.promise:typeof Map<"u"&&t instanceof Map?h.map:typeof Set<"u"&&t instanceof Set?h.set:typeof Date<"u"&&t instanceof Date?h.date:h.object;default:return h.unknown}},d=T.arrayToEnum(["invalid_type","invalid_literal","custom","invalid_union","invalid_union_discriminator","invalid_enum_value","unrecognized_keys","invalid_arguments","invalid_return_type","invalid_date","invalid_string","too_small","too_big","invalid_intersection_types","not_multiple_of","not_finite"]),oo=t=>JSON.stringify(t,null,2).replace(/"([^"]+)":/g,"$1:");class H extends Error{constructor(e){super(),this.issues=[],this.addIssue=n=>{this.issues=[...this.issues,n]},this.addIssues=(n=[])=>{this.issues=[...this.issues,...n]};const r=new.target.prototype;Object.setPrototypeOf?Object.setPrototypeOf(this,r):this.__proto__=r,this.name="ZodError",this.issues=e}get errors(){return this.issues}format(e){const r=e||function(o){return o.message},n={_errors:[]},s=o=>{for(const a of o.issues)if(a.code==="invalid_union")a.unionErrors.map(s);else if(a.code==="invalid_return_type")s(a.returnTypeError);else if(a.code==="invalid_arguments")s(a.argumentsError);else if(a.path.length===0)n._errors.push(r(a));else{let i=n,c=0;for(;c<a.path.length;){const u=a.path[c];c===a.path.length-1?(i[u]=i[u]||{_errors:[]},i[u]._errors.push(r(a))):i[u]=i[u]||{_errors:[]},i=i[u],c++}}};return s(this),n}toString(){return this.message}get message(){return JSON.stringify(this.issues,T.jsonStringifyReplacer,2)}get isEmpty(){return this.issues.length===0}flatten(e=r=>r.message){const r={},n=[];for(const s of this.issues)s.path.length>0?(r[s.path[0]]=r[s.path[0]]||[],r[s.path[0]].push(e(s))):n.push(e(s));return{formErrors:n,fieldErrors:r}}get formErrors(){return this.flatten()}}H.create=t=>new H(t);const xe=(t,e)=>{let r;switch(t.code){case d.invalid_type:t.received===h.undefined?r="Required":r=`Expected ${t.expected}, received ${t.received}`;break;case d.invalid_literal:r=`Invalid literal value, expected ${JSON.stringify(t.expected,T.jsonStringifyReplacer)}`;break;case d.unrecognized_keys:r=`Unrecognized key(s) in object: ${T.joinValues(t.keys,", ")}`;break;case d.invalid_union:r="Invalid input";break;case d.invalid_union_discriminator:r=`Invalid discriminator value. Expected ${T.joinValues(t.options)}`;break;case d.invalid_enum_value:r=`Invalid enum value. Expected ${T.joinValues(t.options)}, received '${t.received}'`;break;case d.invalid_arguments:r="Invalid function arguments";break;case d.invalid_return_type:r="Invalid function return type";break;case d.invalid_date:r="Invalid date";break;case d.invalid_string:typeof t.validation=="object"?"startsWith"in t.validation?r=`Invalid input: must start with "${t.validation.startsWith}"`:"endsWith"in t.validation?r=`Invalid input: must end with "${t.validation.endsWith}"`:T.assertNever(t.validation):t.validation!=="regex"?r=`Invalid ${t.validation}`:r="Invalid";break;case d.too_small:t.type==="array"?r=`Array must contain ${t.exact?"exactly":t.inclusive?"at least":"more than"} ${t.minimum} element(s)`:t.type==="string"?r=`String must contain ${t.exact?"exactly":t.inclusive?"at least":"over"} ${t.minimum} character(s)`:t.type==="number"?r=`Number must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than "}${t.minimum}`:t.type==="date"?r=`Date must be ${t.exact?"exactly equal to ":t.inclusive?"greater than or equal to ":"greater than "}${new Date(t.minimum)}`:r="Invalid input";break;case d.too_big:t.type==="array"?r=`Array must contain ${t.exact?"exactly":t.inclusive?"at most":"less than"} ${t.maximum} element(s)`:t.type==="string"?r=`String must contain ${t.exact?"exactly":t.inclusive?"at most":"under"} ${t.maximum} character(s)`:t.type==="number"?r=`Number must be ${t.exact?"exactly":t.inclusive?"less than or equal to":"less than"} ${t.maximum}`:t.type==="date"?r=`Date must be ${t.exact?"exactly":t.inclusive?"smaller than or equal to":"smaller than"} ${new Date(t.maximum)}`:r="Invalid input";break;case d.custom:r="Invalid input";break;case d.invalid_intersection_types:r="Intersection results could not be merged";break;case d.not_multiple_of:r=`Number must be a multiple of ${t.multipleOf}`;break;case d.not_finite:r="Number must be finite";break;default:r=e.defaultError,T.assertNever(t)}return{message:r}};let Wr=xe;function ao(t){Wr=t}function Ue(){return Wr}const We=t=>{const{data:e,path:r,errorMaps:n,issueData:s}=t,o=[...r,...s.path||[]],a={...s,path:o};let i="";const c=n.filter(u=>!!u).slice().reverse();for(const u of c)i=u(a,{data:e,defaultError:i}).message;return{...s,path:o,message:s.message||i}},io=[];function y(t,e){const r=We({issueData:e,data:t.data,path:t.path,errorMaps:[t.common.contextualErrorMap,t.schemaErrorMap,Ue(),xe].filter(n=>!!n)});t.common.issues.push(r)}class I{constructor(){this.value="valid"}dirty(){this.value==="valid"&&(this.value="dirty")}abort(){this.value!=="aborted"&&(this.value="aborted")}static mergeArray(e,r){const n=[];for(const s of r){if(s.status==="aborted")return b;s.status==="dirty"&&e.dirty(),n.push(s.value)}return{status:e.value,value:n}}static async mergeObjectAsync(e,r){const n=[];for(const s of r)n.push({key:await s.key,value:await s.value});return I.mergeObjectSync(e,n)}static mergeObjectSync(e,r){const n={};for(const s of r){const{key:o,value:a}=s;if(o.status==="aborted"||a.status==="aborted")return b;o.status==="dirty"&&e.dirty(),a.status==="dirty"&&e.dirty(),(typeof a.value<"u"||s.alwaysSet)&&(n[o.value]=a.value)}return{status:e.value,value:n}}}const b=Object.freeze({status:"aborted"}),qr=t=>({status:"dirty",value:t}),L=t=>({status:"valid",value:t}),_t=t=>t.status==="aborted",vt=t=>t.status==="dirty",qe=t=>t.status==="valid",ze=t=>typeof Promise<"u"&&t instanceof Promise;var x;(function(t){t.errToObj=e=>typeof e=="string"?{message:e}:e||{},t.toString=e=>typeof e=="string"?e:e?.message})(x||(x={}));class W{constructor(e,r,n,s){this.parent=e,this.data=r,this._path=n,this._key=s}get path(){return this._path.concat(this._key)}}const er=(t,e)=>{if(qe(e))return{success:!0,data:e.value};if(!t.common.issues.length)throw new Error("Validation failed but no issues detected.");return{success:!1,error:new H(t.common.issues)}};function w(t){if(!t)return{};const{errorMap:e,invalid_type_error:r,required_error:n,description:s}=t;if(e&&(r||n))throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);return e?{errorMap:e,description:s}:{errorMap:(a,i)=>a.code!=="invalid_type"?{message:i.defaultError}:typeof i.data>"u"?{message:n??i.defaultError}:{message:r??i.defaultError},description:s}}class _{constructor(e){this.spa=this.safeParseAsync,this._def=e,this.parse=this.parse.bind(this),this.safeParse=this.safeParse.bind(this),this.parseAsync=this.parseAsync.bind(this),this.safeParseAsync=this.safeParseAsync.bind(this),this.spa=this.spa.bind(this),this.refine=this.refine.bind(this),this.refinement=this.refinement.bind(this),this.superRefine=this.superRefine.bind(this),this.optional=this.optional.bind(this),this.nullable=this.nullable.bind(this),this.nullish=this.nullish.bind(this),this.array=this.array.bind(this),this.promise=this.promise.bind(this),this.or=this.or.bind(this),this.and=this.and.bind(this),this.transform=this.transform.bind(this),this.brand=this.brand.bind(this),this.default=this.default.bind(this),this.catch=this.catch.bind(this),this.describe=this.describe.bind(this),this.pipe=this.pipe.bind(this),this.isNullable=this.isNullable.bind(this),this.isOptional=this.isOptional.bind(this)}get description(){return this._def.description}_getType(e){return Y(e.data)}_getOrReturnCtx(e,r){return r||{common:e.parent.common,data:e.data,parsedType:Y(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}_processInputParams(e){return{status:new I,ctx:{common:e.parent.common,data:e.data,parsedType:Y(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}}_parseSync(e){const r=this._parse(e);if(ze(r))throw new Error("Synchronous parse encountered promise.");return r}_parseAsync(e){const r=this._parse(e);return Promise.resolve(r)}parse(e,r){const n=this.safeParse(e,r);if(n.success)return n.data;throw n.error}safeParse(e,r){var n;const s={common:{issues:[],async:(n=r?.async)!==null&&n!==void 0?n:!1,contextualErrorMap:r?.errorMap},path:r?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:Y(e)},o=this._parseSync({data:e,path:s.path,parent:s});return er(s,o)}async parseAsync(e,r){const n=await this.safeParseAsync(e,r);if(n.success)return n.data;throw n.error}async safeParseAsync(e,r){const n={common:{issues:[],contextualErrorMap:r?.errorMap,async:!0},path:r?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:Y(e)},s=this._parse({data:e,path:n.path,parent:n}),o=await(ze(s)?s:Promise.resolve(s));return er(n,o)}refine(e,r){const n=s=>typeof r=="string"||typeof r>"u"?{message:r}:typeof r=="function"?r(s):r;return this._refinement((s,o)=>{const a=e(s),i=()=>o.addIssue({code:d.custom,...n(s)});return typeof Promise<"u"&&a instanceof Promise?a.then(c=>c?!0:(i(),!1)):a?!0:(i(),!1)})}refinement(e,r){return this._refinement((n,s)=>e(n)?!0:(s.addIssue(typeof r=="function"?r(n,s):r),!1))}_refinement(e){return new Z({schema:this,typeName:g.ZodEffects,effect:{type:"refinement",refinement:e}})}superRefine(e){return this._refinement(e)}optional(){return F.create(this,this._def)}nullable(){return ne.create(this,this._def)}nullish(){return this.nullable().optional()}array(){return D.create(this,this._def)}promise(){return pe.create(this,this._def)}or(e){return Re.create([this,e],this._def)}and(e){return Oe.create(this,e,this._def)}transform(e){return new Z({...w(this._def),schema:this,typeName:g.ZodEffects,effect:{type:"transform",transform:e}})}default(e){const r=typeof e=="function"?e:()=>e;return new Ie({...w(this._def),innerType:this,defaultValue:r,typeName:g.ZodDefault})}brand(){return new Br({typeName:g.ZodBranded,type:this,...w(this._def)})}catch(e){const r=typeof e=="function"?e:()=>e;return new Je({...w(this._def),innerType:this,catchValue:r,typeName:g.ZodCatch})}describe(e){const r=this.constructor;return new r({...this._def,description:e})}pipe(e){return Ae.create(this,e)}isOptional(){return this.safeParse(void 0).success}isNullable(){return this.safeParse(null).success}}const co=/^c[^\s-]{8,}$/i,uo=/^[a-z][a-z0-9]*$/,lo=/^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i,fo=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|([^-]([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}))$/,po=t=>t.precision?t.offset?new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${t.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`):new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${t.precision}}Z$`):t.precision===0?t.offset?new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$"):new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$"):t.offset?new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$"):new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$");class J extends _{constructor(){super(...arguments),this._regex=(e,r,n)=>this.refinement(s=>e.test(s),{validation:r,code:d.invalid_string,...x.errToObj(n)}),this.nonempty=e=>this.min(1,x.errToObj(e)),this.trim=()=>new J({...this._def,checks:[...this._def.checks,{kind:"trim"}]})}_parse(e){if(this._def.coerce&&(e.data=String(e.data)),this._getType(e)!==h.string){const o=this._getOrReturnCtx(e);return y(o,{code:d.invalid_type,expected:h.string,received:o.parsedType}),b}const n=new I;let s;for(const o of this._def.checks)if(o.kind==="min")e.data.length<o.value&&(s=this._getOrReturnCtx(e,s),y(s,{code:d.too_small,minimum:o.value,type:"string",inclusive:!0,exact:!1,message:o.message}),n.dirty());else if(o.kind==="max")e.data.length>o.value&&(s=this._getOrReturnCtx(e,s),y(s,{code:d.too_big,maximum:o.value,type:"string",inclusive:!0,exact:!1,message:o.message}),n.dirty());else if(o.kind==="length"){const a=e.data.length>o.value,i=e.data.length<o.value;(a||i)&&(s=this._getOrReturnCtx(e,s),a?y(s,{code:d.too_big,maximum:o.value,type:"string",inclusive:!0,exact:!0,message:o.message}):i&&y(s,{code:d.too_small,minimum:o.value,type:"string",inclusive:!0,exact:!0,message:o.message}),n.dirty())}else if(o.kind==="email")fo.test(e.data)||(s=this._getOrReturnCtx(e,s),y(s,{validation:"email",code:d.invalid_string,message:o.message}),n.dirty());else if(o.kind==="uuid")lo.test(e.data)||(s=this._getOrReturnCtx(e,s),y(s,{validation:"uuid",code:d.invalid_string,message:o.message}),n.dirty());else if(o.kind==="cuid")co.test(e.data)||(s=this._getOrReturnCtx(e,s),y(s,{validation:"cuid",code:d.invalid_string,message:o.message}),n.dirty());else if(o.kind==="cuid2")uo.test(e.data)||(s=this._getOrReturnCtx(e,s),y(s,{validation:"cuid2",code:d.invalid_string,message:o.message}),n.dirty());else if(o.kind==="url")try{new URL(e.data)}catch{s=this._getOrReturnCtx(e,s),y(s,{validation:"url",code:d.invalid_string,message:o.message}),n.dirty()}else o.kind==="regex"?(o.regex.lastIndex=0,o.regex.test(e.data)||(s=this._getOrReturnCtx(e,s),y(s,{validation:"regex",code:d.invalid_string,message:o.message}),n.dirty())):o.kind==="trim"?e.data=e.data.trim():o.kind==="startsWith"?e.data.startsWith(o.value)||(s=this._getOrReturnCtx(e,s),y(s,{code:d.invalid_string,validation:{startsWith:o.value},message:o.message}),n.dirty()):o.kind==="endsWith"?e.data.endsWith(o.value)||(s=this._getOrReturnCtx(e,s),y(s,{code:d.invalid_string,validation:{endsWith:o.value},message:o.message}),n.dirty()):o.kind==="datetime"?po(o).test(e.data)||(s=this._getOrReturnCtx(e,s),y(s,{code:d.invalid_string,validation:"datetime",message:o.message}),n.dirty()):T.assertNever(o);return{status:n.value,value:e.data}}_addCheck(e){return new J({...this._def,checks:[...this._def.checks,e]})}email(e){return this._addCheck({kind:"email",...x.errToObj(e)})}url(e){return this._addCheck({kind:"url",...x.errToObj(e)})}uuid(e){return this._addCheck({kind:"uuid",...x.errToObj(e)})}cuid(e){return this._addCheck({kind:"cuid",...x.errToObj(e)})}cuid2(e){return this._addCheck({kind:"cuid2",...x.errToObj(e)})}datetime(e){var r;return typeof e=="string"?this._addCheck({kind:"datetime",precision:null,offset:!1,message:e}):this._addCheck({kind:"datetime",precision:typeof e?.precision>"u"?null:e?.precision,offset:(r=e?.offset)!==null&&r!==void 0?r:!1,...x.errToObj(e?.message)})}regex(e,r){return this._addCheck({kind:"regex",regex:e,...x.errToObj(r)})}startsWith(e,r){return this._addCheck({kind:"startsWith",value:e,...x.errToObj(r)})}endsWith(e,r){return this._addCheck({kind:"endsWith",value:e,...x.errToObj(r)})}min(e,r){return this._addCheck({kind:"min",value:e,...x.errToObj(r)})}max(e,r){return this._addCheck({kind:"max",value:e,...x.errToObj(r)})}length(e,r){return this._addCheck({kind:"length",value:e,...x.errToObj(r)})}get isDatetime(){return!!this._def.checks.find(e=>e.kind==="datetime")}get isEmail(){return!!this._def.checks.find(e=>e.kind==="email")}get isURL(){return!!this._def.checks.find(e=>e.kind==="url")}get isUUID(){return!!this._def.checks.find(e=>e.kind==="uuid")}get isCUID(){return!!this._def.checks.find(e=>e.kind==="cuid")}get isCUID2(){return!!this._def.checks.find(e=>e.kind==="cuid2")}get minLength(){let e=null;for(const r of this._def.checks)r.kind==="min"&&(e===null||r.value>e)&&(e=r.value);return e}get maxLength(){let e=null;for(const r of this._def.checks)r.kind==="max"&&(e===null||r.value<e)&&(e=r.value);return e}}J.create=t=>{var e;return new J({checks:[],typeName:g.ZodString,coerce:(e=t?.coerce)!==null&&e!==void 0?e:!1,...w(t)})};function ho(t,e){const r=(t.toString().split(".")[1]||"").length,n=(e.toString().split(".")[1]||"").length,s=r>n?r:n,o=parseInt(t.toFixed(s).replace(".","")),a=parseInt(e.toFixed(s).replace(".",""));return o%a/Math.pow(10,s)}class Q extends _{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte,this.step=this.multipleOf}_parse(e){if(this._def.coerce&&(e.data=Number(e.data)),this._getType(e)!==h.number){const o=this._getOrReturnCtx(e);return y(o,{code:d.invalid_type,expected:h.number,received:o.parsedType}),b}let n;const s=new I;for(const o of this._def.checks)o.kind==="int"?T.isInteger(e.data)||(n=this._getOrReturnCtx(e,n),y(n,{code:d.invalid_type,expected:"integer",received:"float",message:o.message}),s.dirty()):o.kind==="min"?(o.inclusive?e.data<o.value:e.data<=o.value)&&(n=this._getOrReturnCtx(e,n),y(n,{code:d.too_small,minimum:o.value,type:"number",inclusive:o.inclusive,exact:!1,message:o.message}),s.dirty()):o.kind==="max"?(o.inclusive?e.data>o.value:e.data>=o.value)&&(n=this._getOrReturnCtx(e,n),y(n,{code:d.too_big,maximum:o.value,type:"number",inclusive:o.inclusive,exact:!1,message:o.message}),s.dirty()):o.kind==="multipleOf"?ho(e.data,o.value)!==0&&(n=this._getOrReturnCtx(e,n),y(n,{code:d.not_multiple_of,multipleOf:o.value,message:o.message}),s.dirty()):o.kind==="finite"?Number.isFinite(e.data)||(n=this._getOrReturnCtx(e,n),y(n,{code:d.not_finite,message:o.message}),s.dirty()):T.assertNever(o);return{status:s.value,value:e.data}}gte(e,r){return this.setLimit("min",e,!0,x.toString(r))}gt(e,r){return this.setLimit("min",e,!1,x.toString(r))}lte(e,r){return this.setLimit("max",e,!0,x.toString(r))}lt(e,r){return this.setLimit("max",e,!1,x.toString(r))}setLimit(e,r,n,s){return new Q({...this._def,checks:[...this._def.checks,{kind:e,value:r,inclusive:n,message:x.toString(s)}]})}_addCheck(e){return new Q({...this._def,checks:[...this._def.checks,e]})}int(e){return this._addCheck({kind:"int",message:x.toString(e)})}positive(e){return this._addCheck({kind:"min",value:0,inclusive:!1,message:x.toString(e)})}negative(e){return this._addCheck({kind:"max",value:0,inclusive:!1,message:x.toString(e)})}nonpositive(e){return this._addCheck({kind:"max",value:0,inclusive:!0,message:x.toString(e)})}nonnegative(e){return this._addCheck({kind:"min",value:0,inclusive:!0,message:x.toString(e)})}multipleOf(e,r){return this._addCheck({kind:"multipleOf",value:e,message:x.toString(r)})}finite(e){return this._addCheck({kind:"finite",message:x.toString(e)})}get minValue(){let e=null;for(const r of this._def.checks)r.kind==="min"&&(e===null||r.value>e)&&(e=r.value);return e}get maxValue(){let e=null;for(const r of this._def.checks)r.kind==="max"&&(e===null||r.value<e)&&(e=r.value);return e}get isInt(){return!!this._def.checks.find(e=>e.kind==="int"||e.kind==="multipleOf"&&T.isInteger(e.value))}get isFinite(){let e=null,r=null;for(const n of this._def.checks){if(n.kind==="finite"||n.kind==="int"||n.kind==="multipleOf")return!0;n.kind==="min"?(r===null||n.value>r)&&(r=n.value):n.kind==="max"&&(e===null||n.value<e)&&(e=n.value)}return Number.isFinite(r)&&Number.isFinite(e)}}Q.create=t=>new Q({checks:[],typeName:g.ZodNumber,coerce:t?.coerce||!1,...w(t)});class Te extends _{_parse(e){if(this._def.coerce&&(e.data=BigInt(e.data)),this._getType(e)!==h.bigint){const n=this._getOrReturnCtx(e);return y(n,{code:d.invalid_type,expected:h.bigint,received:n.parsedType}),b}return L(e.data)}}Te.create=t=>{var e;return new Te({typeName:g.ZodBigInt,coerce:(e=t?.coerce)!==null&&e!==void 0?e:!1,...w(t)})};class Ee extends _{_parse(e){if(this._def.coerce&&(e.data=!!e.data),this._getType(e)!==h.boolean){const n=this._getOrReturnCtx(e);return y(n,{code:d.invalid_type,expected:h.boolean,received:n.parsedType}),b}return L(e.data)}}Ee.create=t=>new Ee({typeName:g.ZodBoolean,coerce:t?.coerce||!1,...w(t)});class te extends _{_parse(e){if(this._def.coerce&&(e.data=new Date(e.data)),this._getType(e)!==h.date){const o=this._getOrReturnCtx(e);return y(o,{code:d.invalid_type,expected:h.date,received:o.parsedType}),b}if(isNaN(e.data.getTime())){const o=this._getOrReturnCtx(e);return y(o,{code:d.invalid_date}),b}const n=new I;let s;for(const o of this._def.checks)o.kind==="min"?e.data.getTime()<o.value&&(s=this._getOrReturnCtx(e,s),y(s,{code:d.too_small,message:o.message,inclusive:!0,exact:!1,minimum:o.value,type:"date"}),n.dirty()):o.kind==="max"?e.data.getTime()>o.value&&(s=this._getOrReturnCtx(e,s),y(s,{code:d.too_big,message:o.message,inclusive:!0,exact:!1,maximum:o.value,type:"date"}),n.dirty()):T.assertNever(o);return{status:n.value,value:new Date(e.data.getTime())}}_addCheck(e){return new te({...this._def,checks:[...this._def.checks,e]})}min(e,r){return this._addCheck({kind:"min",value:e.getTime(),message:x.toString(r)})}max(e,r){return this._addCheck({kind:"max",value:e.getTime(),message:x.toString(r)})}get minDate(){let e=null;for(const r of this._def.checks)r.kind==="min"&&(e===null||r.value>e)&&(e=r.value);return e!=null?new Date(e):null}get maxDate(){let e=null;for(const r of this._def.checks)r.kind==="max"&&(e===null||r.value<e)&&(e=r.value);return e!=null?new Date(e):null}}te.create=t=>new te({checks:[],coerce:t?.coerce||!1,typeName:g.ZodDate,...w(t)});class Be extends _{_parse(e){if(this._getType(e)!==h.symbol){const n=this._getOrReturnCtx(e);return y(n,{code:d.invalid_type,expected:h.symbol,received:n.parsedType}),b}return L(e.data)}}Be.create=t=>new Be({typeName:g.ZodSymbol,...w(t)});class ke extends _{_parse(e){if(this._getType(e)!==h.undefined){const n=this._getOrReturnCtx(e);return y(n,{code:d.invalid_type,expected:h.undefined,received:n.parsedType}),b}return L(e.data)}}ke.create=t=>new ke({typeName:g.ZodUndefined,...w(t)});class Ce extends _{_parse(e){if(this._getType(e)!==h.null){const n=this._getOrReturnCtx(e);return y(n,{code:d.invalid_type,expected:h.null,received:n.parsedType}),b}return L(e.data)}}Ce.create=t=>new Ce({typeName:g.ZodNull,...w(t)});class fe extends _{constructor(){super(...arguments),this._any=!0}_parse(e){return L(e.data)}}fe.create=t=>new fe({typeName:g.ZodAny,...w(t)});class ee extends _{constructor(){super(...arguments),this._unknown=!0}_parse(e){return L(e.data)}}ee.create=t=>new ee({typeName:g.ZodUnknown,...w(t)});class G extends _{_parse(e){const r=this._getOrReturnCtx(e);return y(r,{code:d.invalid_type,expected:h.never,received:r.parsedType}),b}}G.create=t=>new G({typeName:g.ZodNever,...w(t)});class Ve extends _{_parse(e){if(this._getType(e)!==h.undefined){const n=this._getOrReturnCtx(e);return y(n,{code:d.invalid_type,expected:h.void,received:n.parsedType}),b}return L(e.data)}}Ve.create=t=>new Ve({typeName:g.ZodVoid,...w(t)});class D extends _{_parse(e){const{ctx:r,status:n}=this._processInputParams(e),s=this._def;if(r.parsedType!==h.array)return y(r,{code:d.invalid_type,expected:h.array,received:r.parsedType}),b;if(s.exactLength!==null){const a=r.data.length>s.exactLength.value,i=r.data.length<s.exactLength.value;(a||i)&&(y(r,{code:a?d.too_big:d.too_small,minimum:i?s.exactLength.value:void 0,maximum:a?s.exactLength.value:void 0,type:"array",inclusive:!0,exact:!0,message:s.exactLength.message}),n.dirty())}if(s.minLength!==null&&r.data.length<s.minLength.value&&(y(r,{code:d.too_small,minimum:s.minLength.value,type:"array",inclusive:!0,exact:!1,message:s.minLength.message}),n.dirty()),s.maxLength!==null&&r.data.length>s.maxLength.value&&(y(r,{code:d.too_big,maximum:s.maxLength.value,type:"array",inclusive:!0,exact:!1,message:s.maxLength.message}),n.dirty()),r.common.async)return Promise.all([...r.data].map((a,i)=>s.type._parseAsync(new W(r,a,r.path,i)))).then(a=>I.mergeArray(n,a));const o=[...r.data].map((a,i)=>s.type._parseSync(new W(r,a,r.path,i)));return I.mergeArray(n,o)}get element(){return this._def.type}min(e,r){return new D({...this._def,minLength:{value:e,message:x.toString(r)}})}max(e,r){return new D({...this._def,maxLength:{value:e,message:x.toString(r)}})}length(e,r){return new D({...this._def,exactLength:{value:e,message:x.toString(r)}})}nonempty(e){return this.min(1,e)}}D.create=(t,e)=>new D({type:t,minLength:null,maxLength:null,exactLength:null,typeName:g.ZodArray,...w(e)});var He;(function(t){t.mergeShapes=(e,r)=>({...e,...r})})(He||(He={}));function ce(t){if(t instanceof C){const e={};for(const r in t.shape){const n=t.shape[r];e[r]=F.create(ce(n))}return new C({...t._def,shape:()=>e})}else return t instanceof D?D.create(ce(t.element)):t instanceof F?F.create(ce(t.unwrap())):t instanceof ne?ne.create(ce(t.unwrap())):t instanceof q?q.create(t.items.map(e=>ce(e))):t}class C extends _{constructor(){super(...arguments),this._cached=null,this.nonstrict=this.passthrough,this.augment=this.extend}_getCached(){if(this._cached!==null)return this._cached;const e=this._def.shape(),r=T.objectKeys(e);return this._cached={shape:e,keys:r}}_parse(e){if(this._getType(e)!==h.object){const u=this._getOrReturnCtx(e);return y(u,{code:d.invalid_type,expected:h.object,received:u.parsedType}),b}const{status:n,ctx:s}=this._processInputParams(e),{shape:o,keys:a}=this._getCached(),i=[];if(!(this._def.catchall instanceof G&&this._def.unknownKeys==="strip"))for(const u in s.data)a.includes(u)||i.push(u);const c=[];for(const u of a){const l=o[u],f=s.data[u];c.push({key:{status:"valid",value:u},value:l._parse(new W(s,f,s.path,u)),alwaysSet:u in s.data})}if(this._def.catchall instanceof G){const u=this._def.unknownKeys;if(u==="passthrough")for(const l of i)c.push({key:{status:"valid",value:l},value:{status:"valid",value:s.data[l]}});else if(u==="strict")i.length>0&&(y(s,{code:d.unrecognized_keys,keys:i}),n.dirty());else if(u!=="strip")throw new Error("Internal ZodObject error: invalid unknownKeys value.")}else{const u=this._def.catchall;for(const l of i){const f=s.data[l];c.push({key:{status:"valid",value:l},value:u._parse(new W(s,f,s.path,l)),alwaysSet:l in s.data})}}return s.common.async?Promise.resolve().then(async()=>{const u=[];for(const l of c){const f=await l.key;u.push({key:f,value:await l.value,alwaysSet:l.alwaysSet})}return u}).then(u=>I.mergeObjectSync(n,u)):I.mergeObjectSync(n,c)}get shape(){return this._def.shape()}strict(e){return x.errToObj,new C({...this._def,unknownKeys:"strict",...e!==void 0?{errorMap:(r,n)=>{var s,o,a,i;const c=(a=(o=(s=this._def).errorMap)===null||o===void 0?void 0:o.call(s,r,n).message)!==null&&a!==void 0?a:n.defaultError;return r.code==="unrecognized_keys"?{message:(i=x.errToObj(e).message)!==null&&i!==void 0?i:c}:{message:c}}}:{}})}strip(){return new C({...this._def,unknownKeys:"strip"})}passthrough(){return new C({...this._def,unknownKeys:"passthrough"})}extend(e){return new C({...this._def,shape:()=>({...this._def.shape(),...e})})}merge(e){return new C({unknownKeys:e._def.unknownKeys,catchall:e._def.catchall,shape:()=>He.mergeShapes(this._def.shape(),e._def.shape()),typeName:g.ZodObject})}setKey(e,r){return this.augment({[e]:r})}catchall(e){return new C({...this._def,catchall:e})}pick(e){const r={};return T.objectKeys(e).forEach(n=>{e[n]&&this.shape[n]&&(r[n]=this.shape[n])}),new C({...this._def,shape:()=>r})}omit(e){const r={};return T.objectKeys(this.shape).forEach(n=>{e[n]||(r[n]=this.shape[n])}),new C({...this._def,shape:()=>r})}deepPartial(){return ce(this)}partial(e){const r={};return T.objectKeys(this.shape).forEach(n=>{const s=this.shape[n];e&&!e[n]?r[n]=s:r[n]=s.optional()}),new C({...this._def,shape:()=>r})}required(e){const r={};return T.objectKeys(this.shape).forEach(n=>{if(e&&!e[n])r[n]=this.shape[n];else{let o=this.shape[n];for(;o instanceof F;)o=o._def.innerType;r[n]=o}}),new C({...this._def,shape:()=>r})}keyof(){return zr(T.objectKeys(this.shape))}}C.create=(t,e)=>new C({shape:()=>t,unknownKeys:"strip",catchall:G.create(),typeName:g.ZodObject,...w(e)});C.strictCreate=(t,e)=>new C({shape:()=>t,unknownKeys:"strict",catchall:G.create(),typeName:g.ZodObject,...w(e)});C.lazycreate=(t,e)=>new C({shape:t,unknownKeys:"strip",catchall:G.create(),typeName:g.ZodObject,...w(e)});class Re extends _{_parse(e){const{ctx:r}=this._processInputParams(e),n=this._def.options;function s(o){for(const i of o)if(i.result.status==="valid")return i.result;for(const i of o)if(i.result.status==="dirty")return r.common.issues.push(...i.ctx.common.issues),i.result;const a=o.map(i=>new H(i.ctx.common.issues));return y(r,{code:d.invalid_union,unionErrors:a}),b}if(r.common.async)return Promise.all(n.map(async o=>{const a={...r,common:{...r.common,issues:[]},parent:null};return{result:await o._parseAsync({data:r.data,path:r.path,parent:a}),ctx:a}})).then(s);{let o;const a=[];for(const c of n){const u={...r,common:{...r.common,issues:[]},parent:null},l=c._parseSync({data:r.data,path:r.path,parent:u});if(l.status==="valid")return l;l.status==="dirty"&&!o&&(o={result:l,ctx:u}),u.common.issues.length&&a.push(u.common.issues)}if(o)return r.common.issues.push(...o.ctx.common.issues),o.result;const i=a.map(c=>new H(c));return y(r,{code:d.invalid_union,unionErrors:i}),b}}get options(){return this._def.options}}Re.create=(t,e)=>new Re({options:t,typeName:g.ZodUnion,...w(e)});const De=t=>t instanceof Se?De(t.schema):t instanceof Z?De(t.innerType()):t instanceof Ne?[t.value]:t instanceof X?t.options:t instanceof Le?Object.keys(t.enum):t instanceof Ie?De(t._def.innerType):t instanceof ke?[void 0]:t instanceof Ce?[null]:null;class it extends _{_parse(e){const{ctx:r}=this._processInputParams(e);if(r.parsedType!==h.object)return y(r,{code:d.invalid_type,expected:h.object,received:r.parsedType}),b;const n=this.discriminator,s=r.data[n],o=this.optionsMap.get(s);return o?r.common.async?o._parseAsync({data:r.data,path:r.path,parent:r}):o._parseSync({data:r.data,path:r.path,parent:r}):(y(r,{code:d.invalid_union_discriminator,options:Array.from(this.optionsMap.keys()),path:[n]}),b)}get discriminator(){return this._def.discriminator}get options(){return this._def.options}get optionsMap(){return this._def.optionsMap}static create(e,r,n){const s=new Map;for(const o of r){const a=De(o.shape[e]);if(!a)throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);for(const i of a){if(s.has(i))throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(i)}`);s.set(i,o)}}return new it({typeName:g.ZodDiscriminatedUnion,discriminator:e,options:r,optionsMap:s,...w(n)})}}function xt(t,e){const r=Y(t),n=Y(e);if(t===e)return{valid:!0,data:t};if(r===h.object&&n===h.object){const s=T.objectKeys(e),o=T.objectKeys(t).filter(i=>s.indexOf(i)!==-1),a={...t,...e};for(const i of o){const c=xt(t[i],e[i]);if(!c.valid)return{valid:!1};a[i]=c.data}return{valid:!0,data:a}}else if(r===h.array&&n===h.array){if(t.length!==e.length)return{valid:!1};const s=[];for(let o=0;o<t.length;o++){const a=t[o],i=e[o],c=xt(a,i);if(!c.valid)return{valid:!1};s.push(c.data)}return{valid:!0,data:s}}else return r===h.date&&n===h.date&&+t==+e?{valid:!0,data:t}:{valid:!1}}class Oe extends _{_parse(e){const{status:r,ctx:n}=this._processInputParams(e),s=(o,a)=>{if(_t(o)||_t(a))return b;const i=xt(o.value,a.value);return i.valid?((vt(o)||vt(a))&&r.dirty(),{status:r.value,value:i.data}):(y(n,{code:d.invalid_intersection_types}),b)};return n.common.async?Promise.all([this._def.left._parseAsync({data:n.data,path:n.path,parent:n}),this._def.right._parseAsync({data:n.data,path:n.path,parent:n})]).then(([o,a])=>s(o,a)):s(this._def.left._parseSync({data:n.data,path:n.path,parent:n}),this._def.right._parseSync({data:n.data,path:n.path,parent:n}))}}Oe.create=(t,e,r)=>new Oe({left:t,right:e,typeName:g.ZodIntersection,...w(r)});class q extends _{_parse(e){const{status:r,ctx:n}=this._processInputParams(e);if(n.parsedType!==h.array)return y(n,{code:d.invalid_type,expected:h.array,received:n.parsedType}),b;if(n.data.length<this._def.items.length)return y(n,{code:d.too_small,minimum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),b;!this._def.rest&&n.data.length>this._def.items.length&&(y(n,{code:d.too_big,maximum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),r.dirty());const o=[...n.data].map((a,i)=>{const c=this._def.items[i]||this._def.rest;return c?c._parse(new W(n,a,n.path,i)):null}).filter(a=>!!a);return n.common.async?Promise.all(o).then(a=>I.mergeArray(r,a)):I.mergeArray(r,o)}get items(){return this._def.items}rest(e){return new q({...this._def,rest:e})}}q.create=(t,e)=>{if(!Array.isArray(t))throw new Error("You must pass an array of schemas to z.tuple([ ... ])");return new q({items:t,typeName:g.ZodTuple,rest:null,...w(e)})};class Pe extends _{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(e){const{status:r,ctx:n}=this._processInputParams(e);if(n.parsedType!==h.object)return y(n,{code:d.invalid_type,expected:h.object,received:n.parsedType}),b;const s=[],o=this._def.keyType,a=this._def.valueType;for(const i in n.data)s.push({key:o._parse(new W(n,i,n.path,i)),value:a._parse(new W(n,n.data[i],n.path,i))});return n.common.async?I.mergeObjectAsync(r,s):I.mergeObjectSync(r,s)}get element(){return this._def.valueType}static create(e,r,n){return r instanceof _?new Pe({keyType:e,valueType:r,typeName:g.ZodRecord,...w(n)}):new Pe({keyType:J.create(),valueType:e,typeName:g.ZodRecord,...w(r)})}}class Fe extends _{_parse(e){const{status:r,ctx:n}=this._processInputParams(e);if(n.parsedType!==h.map)return y(n,{code:d.invalid_type,expected:h.map,received:n.parsedType}),b;const s=this._def.keyType,o=this._def.valueType,a=[...n.data.entries()].map(([i,c],u)=>({key:s._parse(new W(n,i,n.path,[u,"key"])),value:o._parse(new W(n,c,n.path,[u,"value"]))}));if(n.common.async){const i=new Map;return Promise.resolve().then(async()=>{for(const c of a){const u=await c.key,l=await c.value;if(u.status==="aborted"||l.status==="aborted")return b;(u.status==="dirty"||l.status==="dirty")&&r.dirty(),i.set(u.value,l.value)}return{status:r.value,value:i}})}else{const i=new Map;for(const c of a){const u=c.key,l=c.value;if(u.status==="aborted"||l.status==="aborted")return b;(u.status==="dirty"||l.status==="dirty")&&r.dirty(),i.set(u.value,l.value)}return{status:r.value,value:i}}}}Fe.create=(t,e,r)=>new Fe({valueType:e,keyType:t,typeName:g.ZodMap,...w(r)});class re extends _{_parse(e){const{status:r,ctx:n}=this._processInputParams(e);if(n.parsedType!==h.set)return y(n,{code:d.invalid_type,expected:h.set,received:n.parsedType}),b;const s=this._def;s.minSize!==null&&n.data.size<s.minSize.value&&(y(n,{code:d.too_small,minimum:s.minSize.value,type:"set",inclusive:!0,exact:!1,message:s.minSize.message}),r.dirty()),s.maxSize!==null&&n.data.size>s.maxSize.value&&(y(n,{code:d.too_big,maximum:s.maxSize.value,type:"set",inclusive:!0,exact:!1,message:s.maxSize.message}),r.dirty());const o=this._def.valueType;function a(c){const u=new Set;for(const l of c){if(l.status==="aborted")return b;l.status==="dirty"&&r.dirty(),u.add(l.value)}return{status:r.value,value:u}}const i=[...n.data.values()].map((c,u)=>o._parse(new W(n,c,n.path,u)));return n.common.async?Promise.all(i).then(c=>a(c)):a(i)}min(e,r){return new re({...this._def,minSize:{value:e,message:x.toString(r)}})}max(e,r){return new re({...this._def,maxSize:{value:e,message:x.toString(r)}})}size(e,r){return this.min(e,r).max(e,r)}nonempty(e){return this.min(1,e)}}re.create=(t,e)=>new re({valueType:t,minSize:null,maxSize:null,typeName:g.ZodSet,...w(e)});class le extends _{constructor(){super(...arguments),this.validate=this.implement}_parse(e){const{ctx:r}=this._processInputParams(e);if(r.parsedType!==h.function)return y(r,{code:d.invalid_type,expected:h.function,received:r.parsedType}),b;function n(i,c){return We({data:i,path:r.path,errorMaps:[r.common.contextualErrorMap,r.schemaErrorMap,Ue(),xe].filter(u=>!!u),issueData:{code:d.invalid_arguments,argumentsError:c}})}function s(i,c){return We({data:i,path:r.path,errorMaps:[r.common.contextualErrorMap,r.schemaErrorMap,Ue(),xe].filter(u=>!!u),issueData:{code:d.invalid_return_type,returnTypeError:c}})}const o={errorMap:r.common.contextualErrorMap},a=r.data;return this._def.returns instanceof pe?L(async(...i)=>{const c=new H([]),u=await this._def.args.parseAsync(i,o).catch(m=>{throw c.addIssue(n(i,m)),c}),l=await a(...u);return await this._def.returns._def.type.parseAsync(l,o).catch(m=>{throw c.addIssue(s(l,m)),c})}):L((...i)=>{const c=this._def.args.safeParse(i,o);if(!c.success)throw new H([n(i,c.error)]);const u=a(...c.data),l=this._def.returns.safeParse(u,o);if(!l.success)throw new H([s(u,l.error)]);return l.data})}parameters(){return this._def.args}returnType(){return this._def.returns}args(...e){return new le({...this._def,args:q.create(e).rest(ee.create())})}returns(e){return new le({...this._def,returns:e})}implement(e){return this.parse(e)}strictImplement(e){return this.parse(e)}static create(e,r,n){return new le({args:e||q.create([]).rest(ee.create()),returns:r||ee.create(),typeName:g.ZodFunction,...w(n)})}}class Se extends _{get schema(){return this._def.getter()}_parse(e){const{ctx:r}=this._processInputParams(e);return this._def.getter()._parse({data:r.data,path:r.path,parent:r})}}Se.create=(t,e)=>new Se({getter:t,typeName:g.ZodLazy,...w(e)});class Ne extends _{_parse(e){if(e.data!==this._def.value){const r=this._getOrReturnCtx(e);return y(r,{received:r.data,code:d.invalid_literal,expected:this._def.value}),b}return{status:"valid",value:e.data}}get value(){return this._def.value}}Ne.create=(t,e)=>new Ne({value:t,typeName:g.ZodLiteral,...w(e)});function zr(t,e){return new X({values:t,typeName:g.ZodEnum,...w(e)})}class X extends _{_parse(e){if(typeof e.data!="string"){const r=this._getOrReturnCtx(e),n=this._def.values;return y(r,{expected:T.joinValues(n),received:r.parsedType,code:d.invalid_type}),b}if(this._def.values.indexOf(e.data)===-1){const r=this._getOrReturnCtx(e),n=this._def.values;return y(r,{received:r.data,code:d.invalid_enum_value,options:n}),b}return L(e.data)}get options(){return this._def.values}get enum(){const e={};for(const r of this._def.values)e[r]=r;return e}get Values(){const e={};for(const r of this._def.values)e[r]=r;return e}get Enum(){const e={};for(const r of this._def.values)e[r]=r;return e}extract(e){return X.create(e)}exclude(e){return X.create(this.options.filter(r=>!e.includes(r)))}}X.create=zr;class Le extends _{_parse(e){const r=T.getValidEnumValues(this._def.values),n=this._getOrReturnCtx(e);if(n.parsedType!==h.string&&n.parsedType!==h.number){const s=T.objectValues(r);return y(n,{expected:T.joinValues(s),received:n.parsedType,code:d.invalid_type}),b}if(r.indexOf(e.data)===-1){const s=T.objectValues(r);return y(n,{received:n.data,code:d.invalid_enum_value,options:s}),b}return L(e.data)}get enum(){return this._def.values}}Le.create=(t,e)=>new Le({values:t,typeName:g.ZodNativeEnum,...w(e)});class pe extends _{unwrap(){return this._def.type}_parse(e){const{ctx:r}=this._processInputParams(e);if(r.parsedType!==h.promise&&r.common.async===!1)return y(r,{code:d.invalid_type,expected:h.promise,received:r.parsedType}),b;const n=r.parsedType===h.promise?r.data:Promise.resolve(r.data);return L(n.then(s=>this._def.type.parseAsync(s,{path:r.path,errorMap:r.common.contextualErrorMap})))}}pe.create=(t,e)=>new pe({type:t,typeName:g.ZodPromise,...w(e)});class Z extends _{innerType(){return this._def.schema}sourceType(){return this._def.schema._def.typeName===g.ZodEffects?this._def.schema.sourceType():this._def.schema}_parse(e){const{status:r,ctx:n}=this._processInputParams(e),s=this._def.effect||null;if(s.type==="preprocess"){const a=s.transform(n.data);return n.common.async?Promise.resolve(a).then(i=>this._def.schema._parseAsync({data:i,path:n.path,parent:n})):this._def.schema._parseSync({data:a,path:n.path,parent:n})}const o={addIssue:a=>{y(n,a),a.fatal?r.abort():r.dirty()},get path(){return n.path}};if(o.addIssue=o.addIssue.bind(o),s.type==="refinement"){const a=i=>{const c=s.refinement(i,o);if(n.common.async)return Promise.resolve(c);if(c instanceof Promise)throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");return i};if(n.common.async===!1){const i=this._def.schema._parseSync({data:n.data,path:n.path,parent:n});return i.status==="aborted"?b:(i.status==="dirty"&&r.dirty(),a(i.value),{status:r.value,value:i.value})}else return this._def.schema._parseAsync({data:n.data,path:n.path,parent:n}).then(i=>i.status==="aborted"?b:(i.status==="dirty"&&r.dirty(),a(i.value).then(()=>({status:r.value,value:i.value}))))}if(s.type==="transform")if(n.common.async===!1){const a=this._def.schema._parseSync({data:n.data,path:n.path,parent:n});if(!qe(a))return a;const i=s.transform(a.value,o);if(i instanceof Promise)throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");return{status:r.value,value:i}}else return this._def.schema._parseAsync({data:n.data,path:n.path,parent:n}).then(a=>qe(a)?Promise.resolve(s.transform(a.value,o)).then(i=>({status:r.value,value:i})):a);T.assertNever(s)}}Z.create=(t,e,r)=>new Z({schema:t,typeName:g.ZodEffects,effect:e,...w(r)});Z.createWithPreprocess=(t,e,r)=>new Z({schema:e,effect:{type:"preprocess",transform:t},typeName:g.ZodEffects,...w(r)});class F extends _{_parse(e){return this._getType(e)===h.undefined?L(void 0):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}}F.create=(t,e)=>new F({innerType:t,typeName:g.ZodOptional,...w(e)});class ne extends _{_parse(e){return this._getType(e)===h.null?L(null):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}}ne.create=(t,e)=>new ne({innerType:t,typeName:g.ZodNullable,...w(e)});class Ie extends _{_parse(e){const{ctx:r}=this._processInputParams(e);let n=r.data;return r.parsedType===h.undefined&&(n=this._def.defaultValue()),this._def.innerType._parse({data:n,path:r.path,parent:r})}removeDefault(){return this._def.innerType}}Ie.create=(t,e)=>new Ie({innerType:t,typeName:g.ZodDefault,defaultValue:typeof e.default=="function"?e.default:()=>e.default,...w(e)});class Je extends _{_parse(e){const{ctx:r}=this._processInputParams(e),n=this._def.innerType._parse({data:r.data,path:r.path,parent:{...r,common:{...r.common,issues:[]}}});return ze(n)?n.then(s=>({status:"valid",value:s.status==="valid"?s.value:this._def.catchValue()})):{status:"valid",value:n.status==="valid"?n.value:this._def.catchValue()}}removeCatch(){return this._def.innerType}}Je.create=(t,e)=>new Je({innerType:t,typeName:g.ZodCatch,catchValue:typeof e.catch=="function"?e.catch:()=>e.catch,...w(e)});class Ge extends _{_parse(e){if(this._getType(e)!==h.nan){const n=this._getOrReturnCtx(e);return y(n,{code:d.invalid_type,expected:h.nan,received:n.parsedType}),b}return{status:"valid",value:e.data}}}Ge.create=t=>new Ge({typeName:g.ZodNaN,...w(t)});const mo=Symbol("zod_brand");class Br extends _{_parse(e){const{ctx:r}=this._processInputParams(e),n=r.data;return this._def.type._parse({data:n,path:r.path,parent:r})}unwrap(){return this._def.type}}class Ae extends _{_parse(e){const{status:r,ctx:n}=this._processInputParams(e);if(n.common.async)return(async()=>{const o=await this._def.in._parseAsync({data:n.data,path:n.path,parent:n});return o.status==="aborted"?b:o.status==="dirty"?(r.dirty(),qr(o.value)):this._def.out._parseAsync({data:o.value,path:n.path,parent:n})})();{const s=this._def.in._parseSync({data:n.data,path:n.path,parent:n});return s.status==="aborted"?b:s.status==="dirty"?(r.dirty(),{status:"dirty",value:s.value}):this._def.out._parseSync({data:s.value,path:n.path,parent:n})}}static create(e,r){return new Ae({in:e,out:r,typeName:g.ZodPipeline})}}const Vr=(t,e={},r)=>t?fe.create().superRefine((n,s)=>{if(!t(n)){const o=typeof e=="function"?e(n):e,a=typeof o=="string"?{message:o}:o;s.addIssue({code:"custom",...a,fatal:r})}}):fe.create(),yo={object:C.lazycreate};var g;(function(t){t.ZodString="ZodString",t.ZodNumber="ZodNumber",t.ZodNaN="ZodNaN",t.ZodBigInt="ZodBigInt",t.ZodBoolean="ZodBoolean",t.ZodDate="ZodDate",t.ZodSymbol="ZodSymbol",t.ZodUndefined="ZodUndefined",t.ZodNull="ZodNull",t.ZodAny="ZodAny",t.ZodUnknown="ZodUnknown",t.ZodNever="ZodNever",t.ZodVoid="ZodVoid",t.ZodArray="ZodArray",t.ZodObject="ZodObject",t.ZodUnion="ZodUnion",t.ZodDiscriminatedUnion="ZodDiscriminatedUnion",t.ZodIntersection="ZodIntersection",t.ZodTuple="ZodTuple",t.ZodRecord="ZodRecord",t.ZodMap="ZodMap",t.ZodSet="ZodSet",t.ZodFunction="ZodFunction",t.ZodLazy="ZodLazy",t.ZodLiteral="ZodLiteral",t.ZodEnum="ZodEnum",t.ZodEffects="ZodEffects",t.ZodNativeEnum="ZodNativeEnum",t.ZodOptional="ZodOptional",t.ZodNullable="ZodNullable",t.ZodDefault="ZodDefault",t.ZodCatch="ZodCatch",t.ZodPromise="ZodPromise",t.ZodBranded="ZodBranded",t.ZodPipeline="ZodPipeline"})(g||(g={}));const go=(t,e={message:`Input not instance of ${t.name}`})=>Vr(r=>r instanceof t,e,!0),Hr=J.create,Fr=Q.create,bo=Ge.create,wo=Te.create,Jr=Ee.create,_o=te.create,vo=Be.create,xo=ke.create,To=Ce.create,Eo=fe.create,ko=ee.create,Co=G.create,Ro=Ve.create,Oo=D.create,Po=C.create,So=C.strictCreate,No=Re.create,Lo=it.create,Io=Oe.create,Ao=q.create,jo=Pe.create,Mo=Fe.create,$o=re.create,Do=le.create,Zo=Se.create,Uo=Ne.create,Wo=X.create,qo=Le.create,zo=pe.create,tr=Z.create,Bo=F.create,Vo=ne.create,Ho=Z.createWithPreprocess,Fo=Ae.create,Jo=()=>Hr().optional(),Go=()=>Fr().optional(),Yo=()=>Jr().optional(),Qo={string:t=>J.create({...t,coerce:!0}),number:t=>Q.create({...t,coerce:!0}),boolean:t=>Ee.create({...t,coerce:!0}),bigint:t=>Te.create({...t,coerce:!0}),date:t=>te.create({...t,coerce:!0})},Xo=b;var p=Object.freeze({__proto__:null,defaultErrorMap:xe,setErrorMap:ao,getErrorMap:Ue,makeIssue:We,EMPTY_PATH:io,addIssueToContext:y,ParseStatus:I,INVALID:b,DIRTY:qr,OK:L,isAborted:_t,isDirty:vt,isValid:qe,isAsync:ze,get util(){return T},ZodParsedType:h,getParsedType:Y,ZodType:_,ZodString:J,ZodNumber:Q,ZodBigInt:Te,ZodBoolean:Ee,ZodDate:te,ZodSymbol:Be,ZodUndefined:ke,ZodNull:Ce,ZodAny:fe,ZodUnknown:ee,ZodNever:G,ZodVoid:Ve,ZodArray:D,get objectUtil(){return He},ZodObject:C,ZodUnion:Re,ZodDiscriminatedUnion:it,ZodIntersection:Oe,ZodTuple:q,ZodRecord:Pe,ZodMap:Fe,ZodSet:re,ZodFunction:le,ZodLazy:Se,ZodLiteral:Ne,ZodEnum:X,ZodNativeEnum:Le,ZodPromise:pe,ZodEffects:Z,ZodTransformer:Z,ZodOptional:F,ZodNullable:ne,ZodDefault:Ie,ZodCatch:Je,ZodNaN:Ge,BRAND:mo,ZodBranded:Br,ZodPipeline:Ae,custom:Vr,Schema:_,ZodSchema:_,late:yo,get ZodFirstPartyTypeKind(){return g},coerce:Qo,any:Eo,array:Oo,bigint:wo,boolean:Jr,date:_o,discriminatedUnion:Lo,effect:tr,enum:Wo,function:Do,instanceof:go,intersection:Io,lazy:Zo,literal:Uo,map:Mo,nan:bo,nativeEnum:qo,never:Co,null:To,nullable:Vo,number:Fr,object:Po,oboolean:Yo,onumber:Go,optional:Bo,ostring:Jo,pipeline:Fo,preprocess:Ho,promise:zo,record:jo,set:$o,strictObject:So,string:Hr,symbol:vo,transformer:tr,tuple:Ao,undefined:xo,union:No,unknown:ko,void:Ro,NEVER:Xo,ZodIssueCode:d,quotelessJson:oo,ZodError:H});const Gr=/^0x[0-9a-f]+$/i,Yr=/^\d+$/,Ko=p.string().nonempty("The short string cannot be empty").max(31,"The short string cannot exceed 31 characters").refine(t=>!Gr.test(t),"The shortString should not be a hex string").refine(t=>!Yr.test(t),"The shortString should not be an integer string"),_e=p.union([p.string().regex(Gr,"Only hex, integers and bigint are supported in calldata"),p.string().regex(Yr,"Only hex, integers and bigint are supported in calldata"),Ko,p.number().int("Only hex, integers and bigint are supported in calldata"),p.bigint()]),Qr=p.object({contractAddress:p.string(),entrypoint:p.string(),calldata:p.array(_e.or(p.array(_e))).optional()}),ea=p.array(Qr).nonempty(),ta=p.object({types:p.record(p.array(p.union([p.object({name:p.string(),type:p.string()}),p.object({name:p.string(),type:p.literal("merkletree"),contains:p.string()})]))),primaryType:p.string(),domain:p.record(p.unknown()),message:p.record(p.unknown())}),rr={enable:p.tuple([p.object({starknetVersion:p.union([p.literal("v4"),p.literal("v5")]).optional()}).optional()]).or(p.tuple([])),addStarknetChain:p.tuple([p.object({id:p.string(),chainId:p.string(),chainName:p.string(),rpcUrls:p.array(p.string()).optional(),nativeCurrency:p.object({name:p.string(),symbol:p.string(),decimals:p.number()}).optional(),blockExplorerUrls:p.array(p.string()).optional()})]),switchStarknetChain:p.tuple([p.object({chainId:p.string()})]),watchAsset:p.tuple([p.object({type:p.literal("ERC20"),options:p.object({address:p.string(),symbol:p.string().optional(),decimals:p.number().optional(),image:p.string().optional(),name:p.string().optional()})})]),execute:p.tuple([ea.or(Qr),p.object({nonce:_e.optional(),maxFee:_e.optional(),version:_e.optional()}).optional()]),signMessage:p.tuple([ta])},$=Hn.create({isServer:!1,allowOutsideOfServer:!0});let Tt=kt,Et="",Xr="";const ve=({width:t=775,height:e=385,origin:r,location:n,atLeftBottom:s=!1})=>{const o=window?.outerWidth??window?.innerWidth??window?.screen.width??0,a=window?.outerHeight??window?.innerHeight??window?.screen.height??0,i=window?.screenLeft??window?.screenX??0,c=window?.screenTop??window?.screenY??0,u=s?0:i+o/2-t/2,l=s?window.screen.availHeight+10:c+a/2-e/2;Tt=r??Tt,Et=n??Et,Xr=`width=${t},height=${e},top=${l},left=${u},toolbar=no,menubar=no,scrollbars=no,location=no,status=no,popup=1`};$.router({authorize:$.procedure.output(p.boolean()).mutation(async()=>!0),connect:$.procedure.mutation(async()=>""),enable:$.procedure.output(p.string()).mutation(async()=>""),execute:$.procedure.input(rr.execute).output(p.string()).mutation(async()=>""),signMessage:$.procedure.input(rr.signMessage).output(p.string().array()).mutation(async()=>[]),getLoginStatus:$.procedure.output(p.object({isLoggedIn:p.boolean(),hasSession:p.boolean().optional(),isPreauthorized:p.boolean().optional()})).mutation(async()=>({isLoggedIn:!0})),addStarknetChain:$.procedure.mutation(t=>{throw Error("not implemented")}),switchStarknetChain:$.procedure.mutation(t=>{throw Error("not implemented")}),watchAsset:$.procedure.mutation(t=>{throw Error("not implemented")}),updateModal:$.procedure.subscription(async()=>{})});const yt=({iframe:t})=>On({links:[Tn({enabled:e=>process.env.NODE_ENV==="development"&&typeof window<"u"||process.env.NODE_ENV==="development"&&e.direction==="down"&&e.result instanceof Error}),pn({condition(e){if(!t&&e.type==="subscription")throw new Error("subscription is not supported without an iframe window");return!!t},true:bt.windowLink({window,postWindow:t,postOrigin:"*"}),false:bt.popupLink({listenWindow:window,createPopup:()=>{let e=null;const r=document.createElement("button");if(r.style.display="none",r.addEventListener("click",()=>{e=window.open(`${Tt}${Et}`,"popup",Xr)}),r.click(),(async()=>{for(;!e;)await new Promise(n=>setTimeout(n,100))})(),!e)throw new Error("Could not open popup");return e},postOrigin:"*"})})]}),ra=385,na=775,sa=385,oa=440,aa=886,ia=562;class nr{async getPubKey(){throw new Error("Method not implemented")}async signMessage(){throw new Error("Method not implemented")}async signTransaction(){throw new Error("Method not implemented")}async signDeclareTransaction(){throw new Error("Method not implemented")}async signDeployAccountTransaction(){throw new Error("Method not implemented")}}class ca extends Ye.Account{constructor(r,n,s){super(r,n,new nr);ae(this,"signer",new nr);ae(this,"execute",async(r,n,s={})=>{try{ve({width:ra,height:na,location:"/review"}),Array.isArray(r)&&r[0]&&r[0].entrypoint==="use_offchain_session"&&ve({width:1,height:1,location:"/executeSessionTx",atLeftBottom:!0});const o=n===void 0||Array.isArray(n)?s:n;return{transaction_hash:await this.proxyLink.execute.mutate([r,o])}}catch(o){throw o instanceof Error?new Error(o.message):new Error("Error while execute a transaction")}});ae(this,"signMessage",async r=>{try{return ve({width:sa,height:oa,location:"/signMessage"}),await this.proxyLink.signMessage.mutate([r])}catch(n){throw n instanceof Error?new Error(n.message):new Error("Error while sign a message")}});this.address=n,this.proxyLink=s}}const je=[],ua=(t,e,r)=>{const n={...t,isConnected:!1,provider:e,getLoginStatus:()=>r.getLoginStatus.mutate(),async request(s){switch(s.type){case"wallet_addStarknetChain":return await r.addStarknetChain.mutate();case"wallet_switchStarknetChain":return await r.switchStarknetChain.mutate();case"wallet_watchAsset":return await r.watchAsset.mutate();default:throw new Error("not implemented")}},async enable(s){if(s?.starknetVersion!=="v4")throw Error("not implemented");try{ve({width:aa,height:ia,location:"/interstitialLogin"});const a=await r.enable.mutate();return await la(n,e,r,a),[a]}catch(o){throw o instanceof Error?new Error(o.message):new Error("Unknow error on enable wallet")}},async isPreauthorized(){const{isLoggedIn:s,isPreauthorized:o}=await r.getLoginStatus.mutate();return!!(s&&o)},on:(s,o)=>{if(s==="accountsChanged")je.push({type:s,handler:o});else if(s==="networkChanged")je.push({type:s,handler:o});else throw new Error(`Unknwown event: ${s}`)},off:(s,o)=>{if(s!=="accountsChanged"&&s!=="networkChanged")throw new Error(`Unknwown event: ${s}`);const a=je.findIndex(i=>i.type===s&&i.handler===o);a>=0&&je.splice(a,1)}};return n};async function la(t,e,r,n){if(t.isConnected)return t;const o={isConnected:!0,chainId:await e.getChainId(),selectedAddress:n,account:new ca(e,n,r),provider:e};return Object.assign(t,o)}const da=t=>{t.style.position="fixed",t.style.top="50%",t.style.left="50%",t.style.transform="translate(-50%, -50%)",t.style.width="380px",t.style.height="420px",t.style.border="none",t.style.borderRadius="40px",t.style.boxShadow="0px 4px 20px rgba(0, 0, 0, 0.5)";const e=document.createElement("div");return e.style.display="none",e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.right="0",e.style.bottom="0",e.style.backgroundColor="rgba(0, 0, 0, 0.5)",e.style.zIndex="99999",e.style.backdropFilter="blur(4px)",e.appendChild(t),e},fa=t=>{t.style.display="block"},pa=t=>{t.style.display="none"},ha=(t,e)=>{t.style.height=`min(${e||420}px, 100%)`},ma=async(t,e)=>{const r=new URL(t);r.pathname="/iframes/comms",t=r.toString();const n=document.createElement("iframe");n.src=t,n.loading="eager",n.sandbox.add("allow-scripts","allow-same-origin","allow-forms","allow-top-navigation","allow-popups"),n.allow="clipboard-write",n.id="argent-webwallet-iframe";const s=da(n);return s.style.display=e?"block":"none",s.id="argent-webwallet-modal",window.document.body.appendChild(s),await new Promise((o,a)=>{const i=setTimeout(()=>a(new Error("Timeout while loading an iframe")),2e4);n.addEventListener("load",async()=>{clearTimeout(i),o()})}),{iframe:n,modal:s}};function ya(t){const e=nn.getRandomPublicRPCNode();try{const{origin:r}=new URL(t);if(r.includes("localhost")||r.includes("127.0.0.1")||r.includes("hydrogen"))return e.testnet;if(r.includes("staging")||r.includes("argent.xyz"))return e.mainnet}catch{console.warn("Could not determine rpc nodeUrl from target URL, defaulting to mainnet")}return e.mainnet}const gt=async(t,e,r,n)=>{const s=typeof window<"u"?window:void 0;if(!s)throw new Error("window is not defined");const o=ya(t),a=r??new Ye.RpcProvider({nodeUrl:o}),i=ua({host:s.location.origin,id:"argentWebWallet",icon:"https://www.argent.xyz/favicon.ico",name:"Argent Web Wallet",version:"1.0.0"},a,e);if(n){const{iframe:c,modal:u}=n;e.updateModal.subscribe.apply(null,[void 0,{onData(l){switch(l.action){case"show":fa(u);break;case"hide":pa(u);break;case"updateHeight":ha(c,l.height)}}}])}return i},ue=Ye.constants.NetworkName,ga=ue.SN_SEPOLIA;function ba(t){try{const{origin:e}=new URL(t);if(e.includes("localhost")||e.includes("127.0.0.1"))return ga;if(e.includes("hydrogen"))return ue.SN_SEPOLIA;if(e.includes("staging"))return ue.SN_MAIN;if(e.includes("dev"))return ue.SN_SEPOLIA;if(e.includes("argent.xyz"))return ue.SN_MAIN}catch{console.warn("Could not determine network from target URL, defaulting to mainnet-alpha")}return ue.SN_MAIN}const sr="allowed-dapps",wa=async t=>{const e=t===Ye.constants.NetworkName.SN_MAIN?on:sn;try{const n=await(await caches.open(sr)).match(e);if(n){const u=parseInt(n.headers.get("X-Cache-Timestamp"),10);if((new Date().getTime()-u)/(1e3*60*60)<24)return n.json()}const s=await fetch(e),o=new Headers(s.headers);o.set("X-Cache-Timestamp",new Date().getTime().toString());const a=await s.json(),i=new Response(JSON.stringify(a),{status:s.status,statusText:s.statusText,headers:o});return await(await caches.open(sr)).put(e,i),a}catch(r){throw new Error(r)}},_a=async t=>new Promise(e=>{if(!t)return e(!1);try{navigator.webkitTemporaryStorage.queryUsageAndQuota((n,s)=>{e(Math.round(s/(1024*1024))<Math.round((performance?.memory?.jsHeapSizeLimit??1073741824)/(1024*1024))*2)},()=>e(!1))}catch{e(!1)}}),va=async(t,e)=>{const{userAgent:r}=navigator,n=!!(navigator.vendor&&navigator.vendor.indexOf("Google")===0&&navigator.brave===void 0&&!r.match(/Edg/)&&!r.match(/OPR/)),s=await _a(n);if(!n||s){const i=yt({});return await gt(t,i,e,void 0)}const o=ba(t),{allowedDapps:a}=await wa(o);if(a.includes(window.location.hostname)){const i="argent-webwallet-modal",c="argent-webwallet-iframe",u=document.getElementById(i),l=document.getElementById(c);u&&u&&l&&(u.remove(),l.remove());const{iframe:f,modal:m}=await ma(t,!1),v=yt({iframe:f.contentWindow??void 0});return await v.authorize.mutate(),await gt(t,v,e,{modal:m,iframe:f})}else{const i=yt({});return await gt(t,i,e,void 0)}};let M=null;class xa extends S.Connector{constructor(r={}){super();ae(this,"_wallet",null);ae(this,"_options");this._options=r}available(){return!0}async ready(){return M?(this._wallet=M,this._wallet.isPreauthorized()):(this._wallet=null,!1)}get id(){return this._wallet=M,this._wallet?.id||"argentWebWallet"}get name(){return this._wallet=M,this._wallet?.name||"Argent Web Wallet"}get icon(){return{light:Zt,dark:Zt}}get wallet(){if(!this._wallet)throw new S.ConnectorNotConnectedError;return this._wallet}get title(){return"Email"}get subtitle(){return"Powered by Argent"}async connect(){if(await this.ensureWallet(),!this._wallet)throw new S.ConnectorNotFoundError;try{await this._wallet.enable({starknetVersion:"v4"})}catch(s){throw console.log(s),new S.UserRejectedRequestError}if(!this._wallet.isConnected)throw new S.UserRejectedRequestError;const r=this._wallet.account,n=await this.chainId();return{account:r.address,chainId:n}}async disconnect(){if(!this.available()&&!this._wallet)throw new S.ConnectorNotFoundError;if(!this._wallet?.isConnected)throw new S.UserNotConnectedError;M=null,this._wallet=M,S.removeStarknetLastConnectedWallet()}async account(){if(this._wallet=M,!this._wallet||!this._wallet.account)throw new S.ConnectorNotConnectedError;return this._wallet.account}async chainId(){if(!this._wallet||!this.wallet.account||!this._wallet.provider)throw new S.ConnectorNotConnectedError;const r=await this._wallet.provider.getChainId();return BigInt(r)}async initEventListener(r){if(this._wallet=M,!this._wallet)throw new S.ConnectorNotConnectedError;this._wallet.on("accountsChanged",r)}async removeEventListener(r){if(this._wallet=M,!this._wallet)throw new S.ConnectorNotConnectedError;this._wallet.off("accountsChanged",r),M=null,this._wallet=null}async ensureWallet(){const r=this._options.url||kt,n=this._options.provider;ve({origin:r,location:"/interstitialLogin"}),M=await va(r,n)??null,this._wallet=M}}exports.DEFAULT_WEBWALLET_URL=kt;exports.WebWalletConnector=xa;

}).call(this)}).call(this,require('_process'))
},{"./lastConnected-080a1315.cjs":11,"./publicRcpNodes-77022e83.cjs":13,"_process":1,"starknet":undefined}],9:[function(require,module,exports){
(function (process){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.W = exports.D = void 0;
var _lastConnectedB964dc = require("./lastConnected-b964dc30.js");
var _starknet = require("starknet");
var _publicRcpNodesBe = require("./publicRcpNodes-be041588.js");
var an = Object.defineProperty;
var on = (t, e, r) => e in t ? an(t, e, {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: r
}) : t[e] = r;
var ae = (t, e, r) => (on(t, typeof e != "symbol" ? e + "" : e, r), r);
const cr = exports.D = "https://web.argent.xyz",
  Ut = `<svg
    width="32"
    height="28"
    viewBox="0 0 18 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M1.5 0.4375C0.982233 0.4375 0.5625 0.857233 0.5625 1.375V12C0.5625 12.4144 0.72712 12.8118 1.02015 13.1049C1.31317 13.3979 1.7106 13.5625 2.125 13.5625H15.875C16.2894 13.5625 16.6868 13.3979 16.9799 13.1049C17.2729 12.8118 17.4375 12.4144 17.4375 12V1.375C17.4375 0.857233 17.0178 0.4375 16.5 0.4375H1.5ZM2.4375 3.50616V11.6875H15.5625V3.50616L9.63349 8.94108C9.27507 9.26964 8.72493 9.26964 8.36651 8.94108L2.4375 3.50616ZM14.0899 2.3125H3.91013L9 6.97822L14.0899 2.3125Z"
      fill="currentColor"
    />
  </svg>`,
  hn = "https://static.hydrogen.argent47.net/webwallet/iframe_whitelist_testnet.json",
  mn = "https://static.argent.net/webwallet/iframe_whitelist_mainnet.json";
function yn(t) {
  return t;
}
function gn(t) {
  return t.length === 0 ? yn : t.length === 1 ? t[0] : function (r) {
    return t.reduce((n, s) => s(n), r);
  };
}
function bn(t) {
  return typeof t == "object" && t !== null && "subscribe" in t;
}
function Qe(t) {
  const e = {
    subscribe(r) {
      let n = null,
        s = !1,
        a = !1,
        o = !1;
      function i() {
        if (n === null) {
          o = !0;
          return;
        }
        a || (a = !0, typeof n == "function" ? n() : n && n.unsubscribe());
      }
      return n = t({
        next(c) {
          s || r.next?.(c);
        },
        error(c) {
          s || (s = !0, r.error?.(c), i());
        },
        complete() {
          s || (s = !0, r.complete?.(), i());
        }
      }), o && i(), {
        unsubscribe: i
      };
    },
    pipe(...r) {
      return gn(r)(e);
    }
  };
  return e;
}
function ur(t) {
  return e => {
    let r = 0,
      n = null;
    const s = [];
    function a() {
      n || (n = e.subscribe({
        next(i) {
          for (const c of s) c.next?.(i);
        },
        error(i) {
          for (const c of s) c.error?.(i);
        },
        complete() {
          for (const i of s) i.complete?.();
        }
      }));
    }
    function o() {
      if (r === 0 && n) {
        const i = n;
        n = null, i.unsubscribe();
      }
    }
    return {
      subscribe(i) {
        return r++, s.push(i), a(), {
          unsubscribe() {
            r--, o();
            const c = s.findIndex(u => u === i);
            c > -1 && s.splice(c, 1);
          }
        };
      }
    };
  };
}
function wn(t) {
  return e => ({
    subscribe(r) {
      let n = 0;
      return e.subscribe({
        next(a) {
          r.next?.(t(a, n++));
        },
        error(a) {
          r.error?.(a);
        },
        complete() {
          r.complete?.();
        }
      });
    }
  });
}
function lr(t) {
  return e => ({
    subscribe(r) {
      return e.subscribe({
        next(n) {
          t.next?.(n), r.next?.(n);
        },
        error(n) {
          t.error?.(n), r.error?.(n);
        },
        complete() {
          t.complete?.(), r.complete?.();
        }
      });
    }
  });
}
let _n = class dr extends Error {
  constructor(e) {
    super(e), this.name = "ObservableAbortError", Object.setPrototypeOf(this, dr.prototype);
  }
};
function fr(t) {
  let e;
  return {
    promise: new Promise((n, s) => {
      let a = !1;
      function o() {
        a || (a = !0, s(new _n("This operation was aborted.")), i.unsubscribe());
      }
      const i = t.subscribe({
        next(c) {
          a = !0, n(c), o();
        },
        error(c) {
          a = !0, s(c), o();
        },
        complete() {
          a = !0, o();
        }
      });
      e = o;
    }),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    abort: e
  };
}
const vn = /* @__PURE__ */Object.freeze( /* @__PURE__ */Object.defineProperty({
  __proto__: null,
  isObservable: bn,
  map: wn,
  observable: Qe,
  observableToPromise: fr,
  share: ur,
  tap: lr
}, Symbol.toStringTag, {
  value: "Module"
}));
function pr(t) {
  return Qe(e => {
    function r(s = 0, a = t.op) {
      const o = t.links[s];
      if (!o) throw new Error("No more links to execute - did you forget to add an ending link?");
      return o({
        op: a,
        next(c) {
          return r(s + 1, c);
        }
      });
    }
    return r().subscribe(e);
  });
}
function Wt(t) {
  return Array.isArray(t) ? t : [t];
}
function xn(t) {
  return e => {
    const r = Wt(t.true).map(s => s(e)),
      n = Wt(t.false).map(s => s(e));
    return s => Qe(a => {
      const o = t.condition(s.op) ? r : n;
      return pr({
        op: s.op,
        links: o
      }).subscribe(a);
    });
  };
}
function Tn(t) {
  return t instanceof hr ||
  /**
  * @deprecated
  * Delete in next major
  */
  t.name === "TRPCClientError";
}
let hr = class $e extends Error {
  static from(e, r = {}) {
    return e instanceof Error ? Tn(e) ? (r.meta && (e.meta = {
      ...e.meta,
      ...r.meta
    }), e) : new $e(e.message, {
      ...r,
      cause: e,
      result: null
    }) : new $e(e.error.message ?? "", {
      ...r,
      cause: void 0,
      result: e
    });
  }
  constructor(e, r) {
    const n = r?.cause;
    super(e, {
      cause: n
    }), this.meta = r?.meta, this.cause = n, this.shape = r?.result?.error, this.data = r?.result?.error.data, this.name = "TRPCClientError", Object.setPrototypeOf(this, $e.prototype);
  }
};
function mr(t) {
  const e = /* @__PURE__ */Object.create(null);
  for (const r in t) {
    const n = t[r];
    e[n] = r;
  }
  return e;
}
const Xe = {
  /**
  * Invalid JSON was received by the server.
  * An error occurred on the server while parsing the JSON text.
  */
  PARSE_ERROR: -32700,
  /**
  * The JSON sent is not a valid Request object.
  */
  BAD_REQUEST: -32600,
  // Internal JSON-RPC error
  INTERNAL_SERVER_ERROR: -32603,
  NOT_IMPLEMENTED: -32603,
  // Implementation specific errors
  UNAUTHORIZED: -32001,
  FORBIDDEN: -32003,
  NOT_FOUND: -32004,
  METHOD_NOT_SUPPORTED: -32005,
  TIMEOUT: -32008,
  CONFLICT: -32009,
  PRECONDITION_FAILED: -32012,
  PAYLOAD_TOO_LARGE: -32013,
  UNPROCESSABLE_CONTENT: -32022,
  TOO_MANY_REQUESTS: -32029,
  CLIENT_CLOSED_REQUEST: -32099
};
mr(Xe);
mr(Xe);
const En = {
  PARSE_ERROR: 400,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  METHOD_NOT_SUPPORTED: 405,
  TIMEOUT: 408,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501
};
function kn(t) {
  return En[t] ?? 500;
}
function yr(t) {
  return kn(t.code);
}
const gr = () => {};
function br(t, e) {
  return new Proxy(gr, {
    get(n, s) {
      if (!(typeof s != "string" || s === "then")) return br(t, [...e, s]);
    },
    apply(n, s, a) {
      const o = e[e.length - 1] === "apply";
      return t({
        args: o ? a.length >= 2 ? a[1] : [] : a,
        path: o ? e.slice(0, -1) : e
      });
    }
  });
}
const kt = t => br(t, []),
  Ct = t => new Proxy(gr, {
    get(e, r) {
      if (!(typeof r != "string" || r === "then")) return t(r);
    }
  });
function Cn(t) {
  const {
      path: e,
      error: r,
      config: n
    } = t,
    {
      code: s
    } = t.error,
    a = {
      message: r.message,
      code: Xe[s],
      data: {
        code: s,
        httpStatus: yr(r)
      }
    };
  return n.isDev && typeof t.error.stack == "string" && (a.data.stack = t.error.stack), typeof e == "string" && (a.data.path = e), n.errorFormatter({
    ...t,
    shape: a
  });
}
function zt(t, e) {
  return "error" in e ? {
    ...e,
    error: t.transformer.output.serialize(e.error)
  } : "data" in e.result ? {
    ...e,
    result: {
      ...e.result,
      data: t.transformer.output.serialize(e.result.data)
    }
  } : e;
}
function Rn(t, e) {
  return Array.isArray(e) ? e.map(r => zt(t, r)) : zt(t, e);
}
const On = /* @__PURE__ */Object.freeze( /* @__PURE__ */Object.defineProperty({
  __proto__: null,
  createFlatProxy: Ct,
  createRecursiveProxy: kt,
  getErrorShape: Cn,
  transformTRPCResponse: Rn
}, Symbol.toStringTag, {
  value: "Module"
}));
function Pn(t) {
  return typeof FormData > "u" ? !1 : t instanceof FormData;
}
const ut = {
  css: {
    query: ["72e3ff", "3fb0d8"],
    mutation: ["c5a3fc", "904dfc"],
    subscription: ["ff49e1", "d83fbe"]
  },
  ansi: {
    regular: {
      // Cyan background, black and white text respectively
      query: ["\x1B[30;46m", "\x1B[97;46m"],
      // Magenta background, black and white text respectively
      mutation: ["\x1B[30;45m", "\x1B[97;45m"],
      // Green background, black and white text respectively
      subscription: ["\x1B[30;42m", "\x1B[97;42m"]
    },
    bold: {
      query: ["\x1B[1;30;46m", "\x1B[1;97;46m"],
      mutation: ["\x1B[1;30;45m", "\x1B[1;97;45m"],
      subscription: ["\x1B[1;30;42m", "\x1B[1;97;42m"]
    }
  }
};
function Sn(t) {
  const {
      direction: e,
      type: r,
      path: n,
      id: s,
      input: a
    } = t,
    o = [],
    i = [];
  if (t.colorMode === "ansi") {
    const [f, m] = ut.ansi.regular[r],
      [v, E] = ut.ansi.bold[r],
      S = "\x1B[0m";
    return o.push(e === "up" ? f : m, e === "up" ? ">>" : "<<", r, e === "up" ? v : E, `#${s}`, n, S), e === "up" ? i.push({
      input: t.input
    }) : i.push({
      input: t.input,
      // strip context from result cause it's too noisy in terminal wihtout collapse mode
      result: "result" in t.result ? t.result.result : t.result,
      elapsedMs: t.elapsedMs
    }), {
      parts: o,
      args: i
    };
  }
  const [c, u] = ut.css[r],
    l = `
    background-color: #${e === "up" ? c : u}; 
    color: ${e === "up" ? "black" : "white"};
    padding: 2px;
  `;
  return o.push("%c", e === "up" ? ">>" : "<<", r, `#${s}`, `%c${n}%c`, "%O"), i.push(l, `${l}; font-weight: bold;`, `${l}; font-weight: normal;`), e === "up" ? i.push({
    input: a,
    context: t.context
  }) : i.push({
    input: a,
    result: t.result,
    elapsedMs: t.elapsedMs,
    context: t.context
  }), {
    parts: o,
    args: i
  };
}
const Nn = ({
  c: t = console,
  colorMode: e = "css"
}) => r => {
  const n = r.input,
    s = Pn(n) ? Object.fromEntries(n) : n,
    {
      parts: a,
      args: o
    } = Sn({
      ...r,
      colorMode: e,
      input: s
    }),
    i = r.direction === "down" && r.result && (r.result instanceof Error || "error" in r.result.result) ? "error" : "log";
  t[i].apply(null, [a.join(" ")].concat(o));
};
function In(t = {}) {
  const {
      enabled: e = () => !0
    } = t,
    r = t.colorMode ?? (typeof window > "u" ? "ansi" : "css"),
    {
      logger: n = Nn({
        c: t.console,
        colorMode: r
      })
    } = t;
  return () => ({
    op: s,
    next: a
  }) => Qe(o => {
    e({
      ...s,
      direction: "up"
    }) && n({
      ...s,
      direction: "up"
    });
    const i = Date.now();
    function c(u) {
      const l = Date.now() - i;
      e({
        ...s,
        direction: "down",
        result: u
      }) && n({
        ...s,
        direction: "down",
        elapsedMs: l,
        result: u
      });
    }
    return a(s).pipe(lr({
      next(u) {
        c(u);
      },
      error(u) {
        c(u);
      }
    })).subscribe(o);
  });
}
let Ln = class {
  $request({
    type: e,
    input: r,
    path: n,
    context: s = {}
  }) {
    return pr({
      links: this.links,
      op: {
        id: ++this.requestId,
        type: e,
        path: n,
        input: r,
        context: s
      }
    }).pipe(ur());
  }
  requestAsPromise(e) {
    const r = this.$request(e),
      {
        promise: n,
        abort: s
      } = fr(r);
    return new Promise((o, i) => {
      e.signal?.addEventListener("abort", s), n.then(c => {
        o(c.result.data);
      }).catch(c => {
        i(hr.from(c));
      });
    });
  }
  query(e, r, n) {
    return this.requestAsPromise({
      type: "query",
      path: e,
      input: r,
      context: n?.context,
      signal: n?.signal
    });
  }
  mutation(e, r, n) {
    return this.requestAsPromise({
      type: "mutation",
      path: e,
      input: r,
      context: n?.context,
      signal: n?.signal
    });
  }
  subscription(e, r, n) {
    return this.$request({
      type: "subscription",
      path: e,
      input: r,
      context: n?.context
    }).subscribe({
      next(a) {
        a.result.type === "started" ? n.onStarted?.() : a.result.type === "stopped" ? n.onStopped?.() : n.onData?.(a.result.data);
      },
      error(a) {
        n.onError?.(a);
      },
      complete() {
        n.onComplete?.();
      }
    });
  }
  constructor(e) {
    this.requestId = 0;
    const r = (() => {
      const n = e.transformer;
      return n ? "input" in n ? e.transformer : {
        input: n,
        output: n
      } : {
        input: {
          serialize: s => s,
          deserialize: s => s
        },
        output: {
          serialize: s => s,
          deserialize: s => s
        }
      };
    })();
    this.runtime = {
      transformer: {
        serialize: n => r.input.serialize(n),
        deserialize: n => r.output.deserialize(n)
      },
      combinedTransformer: r
    }, this.links = e.links.map(n => n(this.runtime));
  }
};
const An = {
    query: "query",
    mutate: "mutation",
    subscribe: "subscription"
  },
  Mn = t => An[t];
function jn(t) {
  return Ct(e => t.hasOwnProperty(e) ? t[e] : e === "__untypedClient" ? t : kt(({
    path: r,
    args: n
  }) => {
    const s = [e, ...r],
      a = Mn(s.pop()),
      o = s.join(".");
    return t[a](o, ...n);
  }));
}
function $n(t) {
  const e = new Ln(t);
  return jn(e);
}
function Dn(t) {
  return !!t && !Array.isArray(t) && typeof t == "object";
}
function Zn(t) {
  if (t instanceof le) return t;
  const e = new le({
    code: "INTERNAL_SERVER_ERROR",
    cause: t
  });
  return t instanceof Error && t.stack && (e.stack = t.stack), e;
}
class Un extends Error {}
function Wn(t) {
  if (t instanceof Error) return t;
  const e = typeof t;
  if (!(e === "undefined" || e === "function" || t === null)) {
    if (e !== "object") return new Error(String(t));
    if (Dn(t)) {
      const r = new Un();
      for (const n in t) r[n] = t[n];
      return r;
    }
  }
}
class le extends Error {
  constructor(e) {
    const r = Wn(e.cause),
      n = e.message ?? r?.message ?? e.code;
    super(n, {
      cause: r
    }), this.code = e.code, this.name = this.constructor.name;
  }
}
function zn(t) {
  return "input" in t ? t : {
    input: t,
    output: t
  };
}
const ge = {
    _default: !0,
    input: {
      serialize: t => t,
      deserialize: t => t
    },
    output: {
      serialize: t => t,
      deserialize: t => t
    }
  },
  be = ({
    shape: t
  }) => t;
function qn(t) {
  return Object.assign( /* @__PURE__ */Object.create(null), t);
}
const Bn = ["query", "mutation", "subscription"];
function Vn(t) {
  return "router" in t._def;
}
const Hn = {
    _ctx: null,
    _errorShape: null,
    _meta: null,
    queries: {},
    mutations: {},
    subscriptions: {},
    errorFormatter: be,
    transformer: ge
  },
  Fn = [
  /**
  * Then is a reserved word because otherwise we can't return a promise that returns a Proxy
  * since JS will think that `.then` is something that exists
  */
  "then"];
function wr(t) {
  return function (r) {
    const n = new Set(Object.keys(r).filter(c => Fn.includes(c)));
    if (n.size > 0) throw new Error("Reserved words used in `router({})` call: " + Array.from(n).join(", "));
    const s = qn({});
    function a(c, u = "") {
      for (const [l, f] of Object.entries(c ?? {})) {
        const m = `${u}${l}`;
        if (Vn(f)) {
          a(f._def.procedures, `${m}.`);
          continue;
        }
        if (s[m]) throw new Error(`Duplicate key: ${m}`);
        s[m] = f;
      }
    }
    a(r);
    const o = {
      _config: t,
      router: !0,
      procedures: s,
      ...Hn,
      record: r,
      queries: Object.entries(s).filter(c => c[1]._def.query).reduce((c, [u, l]) => ({
        ...c,
        [u]: l
      }), {}),
      mutations: Object.entries(s).filter(c => c[1]._def.mutation).reduce((c, [u, l]) => ({
        ...c,
        [u]: l
      }), {}),
      subscriptions: Object.entries(s).filter(c => c[1]._def.subscription).reduce((c, [u, l]) => ({
        ...c,
        [u]: l
      }), {})
    };
    return {
      ...r,
      _def: o,
      createCaller(c) {
        return kt(({
          path: l,
          args: f
        }) => {
          if (l.length === 1 && Bn.includes(l[0])) return Jn({
            procedures: o.procedures,
            path: f[0],
            rawInput: f[1],
            ctx: c,
            type: l[0]
          });
          const m = l.join("."),
            v = o.procedures[m];
          let E = "query";
          return v._def.mutation ? E = "mutation" : v._def.subscription && (E = "subscription"), v({
            path: m,
            rawInput: f[0],
            ctx: c,
            type: E
          });
        });
      },
      getErrorShape(c) {
        const {
            path: u,
            error: l
          } = c,
          {
            code: f
          } = c.error,
          m = {
            message: l.message,
            code: Xe[f],
            data: {
              code: f,
              httpStatus: yr(l)
            }
          };
        return t.isDev && typeof c.error.stack == "string" && (m.data.stack = c.error.stack), typeof u == "string" && (m.data.path = u), this._def._config.errorFormatter({
          ...c,
          shape: m
        });
      }
    };
  };
}
function Jn(t) {
  const {
    type: e,
    path: r
  } = t;
  if (!(r in t.procedures) || !t.procedures[r]?._def[e]) throw new le({
    code: "NOT_FOUND",
    message: `No "${e}"-procedure on path "${r}"`
  });
  const n = t.procedures[r];
  return n(t);
}
const qt = typeof window > "u" || "Deno" in window || globalThis.process?.env?.NODE_ENV === "test" || !!globalThis.process?.env?.JEST_WORKER_ID || !!globalThis.process?.env?.VITEST_WORKER_ID;
function Bt(t) {
  const e = t;
  if (typeof e == "function") return e;
  if (typeof e.parseAsync == "function") return e.parseAsync.bind(e);
  if (typeof e.parse == "function") return e.parse.bind(e);
  if (typeof e.validateSync == "function") return e.validateSync.bind(e);
  if (typeof e.create == "function") return e.create.bind(e);
  if (typeof e.assert == "function") return r => (e.assert(r), r);
  throw new Error("Could not find a validator fn");
}
function _r(t, ...e) {
  const r = Object.assign( /* @__PURE__ */Object.create(null), t);
  for (const n of e) for (const s in n) {
    if (s in r && r[s] !== n[s]) throw new Error(`Duplicate key ${s}`);
    r[s] = n[s];
  }
  return r;
}
function Gn() {
  function t(r) {
    return {
      _middlewares: r,
      unstable_pipe(n) {
        const s = "_middlewares" in n ? n._middlewares : [n];
        return t([...r, ...s]);
      }
    };
  }
  function e(r) {
    return t([r]);
  }
  return e;
}
function Vt(t) {
  return t && typeof t == "object" && !Array.isArray(t);
}
function Yn(t) {
  const e = async ({
    next: r,
    rawInput: n,
    input: s
  }) => {
    let a;
    try {
      a = await t(n);
    } catch (i) {
      throw new le({
        code: "BAD_REQUEST",
        cause: i
      });
    }
    const o = Vt(s) && Vt(a) ? {
      ...s,
      ...a
    } : a;
    return r({
      input: o
    });
  };
  return e._type = "input", e;
}
function Qn(t) {
  const e = async ({
    next: r
  }) => {
    const n = await r();
    if (!n.ok) return n;
    try {
      const s = await t(n.data);
      return {
        ...n,
        data: s
      };
    } catch (s) {
      throw new le({
        message: "Output validation failed",
        code: "INTERNAL_SERVER_ERROR",
        cause: s
      });
    }
  };
  return e._type = "output", e;
}
const vr = "middlewareMarker";
function oe(t, e) {
  const {
    middlewares: r = [],
    inputs: n,
    meta: s,
    ...a
  } = e;
  return xr({
    ..._r(t, a),
    inputs: [...t.inputs, ...(n ?? [])],
    middlewares: [...t.middlewares, ...r],
    meta: t.meta && s ? {
      ...t.meta,
      ...s
    } : s ?? t.meta
  });
}
function xr(t = {}) {
  const e = {
    inputs: [],
    middlewares: [],
    ...t
  };
  return {
    _def: e,
    input(r) {
      const n = Bt(r);
      return oe(e, {
        inputs: [r],
        middlewares: [Yn(n)]
      });
    },
    output(r) {
      const n = Bt(r);
      return oe(e, {
        output: r,
        middlewares: [Qn(n)]
      });
    },
    meta(r) {
      return oe(e, {
        meta: r
      });
    },
    /**
    * @deprecated
    * This functionality is deprecated and will be removed in the next major version.
    */
    unstable_concat(r) {
      return oe(e, r._def);
    },
    use(r) {
      const n = "_middlewares" in r ? r._middlewares : [r];
      return oe(e, {
        middlewares: n
      });
    },
    query(r) {
      return lt({
        ...e,
        query: !0
      }, r);
    },
    mutation(r) {
      return lt({
        ...e,
        mutation: !0
      }, r);
    },
    subscription(r) {
      return lt({
        ...e,
        subscription: !0
      }, r);
    }
  };
}
function lt(t, e) {
  const r = oe(t, {
    resolver: e,
    middlewares: [async function (s) {
      const a = await e(s);
      return {
        marker: vr,
        ok: !0,
        data: a,
        ctx: s.ctx
      };
    }]
  });
  return Kn(r._def);
}
const Xn = `
If you want to call this function on the server, you do the following:
This is a client-only function.

const caller = appRouter.createCaller({
  /* ... your context */
});

const result = await caller.call('myProcedure', input);
`.trim();
function Kn(t) {
  const e = async function (n) {
    if (!n || !("rawInput" in n)) throw new Error(Xn);
    const s = async (o = {
        index: 0,
        ctx: n.ctx
      }) => {
        try {
          const i = t.middlewares[o.index];
          return await i({
            ctx: o.ctx,
            type: n.type,
            path: n.path,
            rawInput: o.rawInput ?? n.rawInput,
            meta: t.meta,
            input: o.input,
            next(u) {
              const l = u;
              return s({
                index: o.index + 1,
                ctx: l && "ctx" in l ? {
                  ...o.ctx,
                  ...l.ctx
                } : o.ctx,
                input: l && "input" in l ? l.input : o.input,
                rawInput: l && "rawInput" in l ? l.rawInput : o.rawInput
              });
            }
          });
        } catch (i) {
          return {
            ok: !1,
            error: Zn(i),
            marker: vr
          };
        }
      },
      a = await s();
    if (!a) throw new le({
      code: "INTERNAL_SERVER_ERROR",
      message: "No result from middlewares - did you forget to `return next()`?"
    });
    if (!a.ok) throw a.error;
    return a.data;
  };
  return e._def = t, e.meta = t.meta, e;
}
function es(...t) {
  const e = _r({}, ...t.map(a => a._def.record)),
    r = t.reduce((a, o) => {
      if (o._def._config.errorFormatter && o._def._config.errorFormatter !== be) {
        if (a !== be && a !== o._def._config.errorFormatter) throw new Error("You seem to have several error formatters");
        return o._def._config.errorFormatter;
      }
      return a;
    }, be),
    n = t.reduce((a, o) => {
      if (o._def._config.transformer && o._def._config.transformer !== ge) {
        if (a !== ge && a !== o._def._config.transformer) throw new Error("You seem to have several transformers");
        return o._def._config.transformer;
      }
      return a;
    }, ge);
  return wr({
    errorFormatter: r,
    transformer: n,
    isDev: t.some(a => a._def._config.isDev),
    allowOutsideOfServer: t.some(a => a._def._config.allowOutsideOfServer),
    isServer: t.some(a => a._def._config.isServer),
    $types: t[0]?._def._config.$types
  })(e);
}
class Ue {
  context() {
    return new Ue();
  }
  meta() {
    return new Ue();
  }
  create(e) {
    return rs()(e);
  }
}
const ts = new Ue();
function rs() {
  return function (e) {
    const r = e?.errorFormatter ?? be,
      s = {
        transformer: zn(e?.transformer ?? ge),
        isDev: e?.isDev ?? globalThis.process?.env?.NODE_ENV !== "production",
        allowOutsideOfServer: e?.allowOutsideOfServer ?? !1,
        errorFormatter: r,
        isServer: e?.isServer ?? qt,
        /**
        * @internal
        */
        $types: Ct(a => {
          throw new Error(`Tried to access "$types.${a}" which is not available at runtime`);
        })
      };
    if (!(e?.isServer ?? qt) && e?.allowOutsideOfServer !== !0) throw new Error("You're trying to use @trpc/server in a non-server environment. This is not supported by default.");
    return {
      /**
      * These are just types, they can't be used
      * @internal
      */
      _config: s,
      /**
      * Builder object for creating procedures
      */
      procedure: xr({
        meta: e?.defaultMeta
      }),
      /**
      * Create reusable middlewares
      */
      middleware: Gn(),
      /**
      * Create a router
      */
      router: wr(s),
      /**
      * Merge Routers
      */
      mergeRouters: es
    };
  };
}
var bt = {},
  Ke = {},
  pe = {},
  O = {};
const he = /* @__PURE__ */(0, _lastConnectedB964dc.g)(vn);
var Rt = {},
  Tr = he;
function Er(t) {
  return Tr.observable(e => {
    function r(s = 0, a = t.op) {
      const o = t.links[s];
      if (!o) throw new Error("No more links to execute - did you forget to add an ending link?");
      return o({
        op: a,
        next(c) {
          return r(s + 1, c);
        }
      });
    }
    return r().subscribe(e);
  });
}
function Ht(t) {
  return Array.isArray(t) ? t : [t];
}
function ns(t) {
  return e => {
    const r = Ht(t.true).map(s => s(e)),
      n = Ht(t.false).map(s => s(e));
    return s => Tr.observable(a => {
      const o = t.condition(s.op) ? r : n;
      return Er({
        op: s.op,
        links: o
      }).subscribe(a);
    });
  };
}
Rt.createChain = Er;
Rt.splitLink = ns;
var me = {};
function ss(t) {
  return t instanceof kr ||
  /**
  * @deprecated
  * Delete in next major
  */
  t.name === "TRPCClientError";
}
let kr = class De extends Error {
  static from(e, r = {}) {
    return e instanceof Error ? ss(e) ? (r.meta && (e.meta = {
      ...e.meta,
      ...r.meta
    }), e) : new De(e.message, {
      ...r,
      cause: e,
      result: null
    }) : new De(e.error.message ?? "", {
      ...r,
      cause: void 0,
      result: e
    });
  }
  constructor(e, r) {
    const n = r?.cause;
    super(e, {
      cause: n
    }), this.meta = r?.meta, this.cause = n, this.shape = r?.result?.error, this.data = r?.result?.error.data, this.name = "TRPCClientError", Object.setPrototypeOf(this, De.prototype);
  }
};
me.TRPCClientError = kr;
const as = /* @__PURE__ */(0, _lastConnectedB964dc.g)(On);
var z = {},
  os = me;
const Ft = t => typeof t == "function";
function Cr(t) {
  if (t) return t;
  if (typeof window < "u" && Ft(window.fetch)) return window.fetch;
  if (typeof globalThis < "u" && Ft(globalThis.fetch)) return globalThis.fetch;
  throw new Error("No fetch implementation found");
}
function is(t) {
  return t || (typeof window < "u" && window.AbortController ? window.AbortController : typeof globalThis < "u" && globalThis.AbortController ? globalThis.AbortController : null);
}
function cs(t) {
  return {
    url: t.url,
    fetch: t.fetch,
    AbortController: is(t.AbortController)
  };
}
function us(t) {
  const e = {};
  for (let r = 0; r < t.length; r++) {
    const n = t[r];
    e[r] = n;
  }
  return e;
}
const ls = {
  query: "GET",
  mutation: "POST"
};
function Rr(t) {
  return "input" in t ? t.runtime.transformer.serialize(t.input) : us(t.inputs.map(e => t.runtime.transformer.serialize(e)));
}
const Or = t => {
    let e = t.url + "/" + t.path;
    const r = [];
    if ("inputs" in t && r.push("batch=1"), t.type === "query") {
      const n = Rr(t);
      n !== void 0 && r.push(`input=${encodeURIComponent(JSON.stringify(n))}`);
    }
    return r.length && (e += "?" + r.join("&")), e;
  },
  Pr = t => {
    if (t.type === "query") return;
    const e = Rr(t);
    return e !== void 0 ? JSON.stringify(e) : void 0;
  },
  ds = t => Nr({
    ...t,
    contentTypeHeader: "application/json",
    getUrl: Or,
    getBody: Pr
  });
async function Sr(t, e) {
  const r = t.getUrl(t),
    n = t.getBody(t),
    {
      type: s
    } = t,
    a = await t.headers();
  /* istanbul ignore if -- @preserve */
  if (s === "subscription") throw new Error("Subscriptions should use wsLink");
  const o = {
    ...(t.contentTypeHeader ? {
      "content-type": t.contentTypeHeader
    } : {}),
    ...(t.batchModeHeader ? {
      "trpc-batch-mode": t.batchModeHeader
    } : {}),
    ...a
  };
  return Cr(t.fetch)(r, {
    method: ls[s],
    signal: e?.signal,
    body: n,
    headers: o
  });
}
function Nr(t) {
  const e = t.AbortController ? new t.AbortController() : null,
    r = {};
  return {
    promise: new Promise((a, o) => {
      Sr(t, e).then(i => (r.response = i, i.json())).then(i => {
        r.responseJSON = i, a({
          json: i,
          meta: r
        });
      }).catch(i => {
        o(os.TRPCClientError.from(i, {
          meta: r
        }));
      });
    }),
    cancel: () => {
      e?.abort();
    }
  };
}
z.fetchHTTPResponse = Sr;
z.getBody = Pr;
z.getFetch = Cr;
z.getUrl = Or;
z.httpRequest = Nr;
z.jsonHttpRequester = ds;
z.resolveHTTPLinkOptions = cs;
var Ot = {},
  et = {};
function Jt(t) {
  return !!t && !Array.isArray(t) && typeof t == "object";
}
function fs(t, e) {
  if ("error" in t) {
    const n = e.transformer.deserialize(t.error);
    return {
      ok: !1,
      error: {
        ...t,
        error: n
      }
    };
  }
  return {
    ok: !0,
    result: {
      ...t.result,
      ...((!t.result.type || t.result.type === "data") && {
        type: "data",
        data: e.transformer.deserialize(t.result.data)
      })
    }
  };
}
class dt extends Error {
  constructor() {
    super("Unable to transform response from server");
  }
}
function ps(t, e) {
  let r;
  try {
    r = fs(t, e);
  } catch {
    throw new dt();
  }
  if (!r.ok && (!Jt(r.error.error) || typeof r.error.error.code != "number")) throw new dt();
  if (r.ok && !Jt(r.result)) throw new dt();
  return r;
}
et.transformResult = ps;
var hs = he,
  ms = et,
  Gt = me,
  wt = z;
const ft = () => {
  throw new Error("Something went wrong. Please submit an issue at https://github.com/trpc/trpc/issues/new");
};
function pt(t) {
  let e = null,
    r = null;
  const n = () => {
    clearTimeout(r), r = null, e = null;
  };
  function s(i) {
    const c = [[]];
    let u = 0;
    for (;;) {
      const l = i[u];
      if (!l) break;
      const f = c[c.length - 1];
      if (l.aborted) {
        l.reject?.(new Error("Aborted")), u++;
        continue;
      }
      if (t.validate(f.concat(l).map(v => v.key))) {
        f.push(l), u++;
        continue;
      }
      if (f.length === 0) {
        l.reject?.(new Error("Input is too big for a single dispatch")), u++;
        continue;
      }
      c.push([]);
    }
    return c;
  }
  function a() {
    const i = s(e);
    n();
    for (const c of i) {
      if (!c.length) continue;
      const u = {
        items: c,
        cancel: ft
      };
      for (const v of c) v.batch = u;
      const l = (v, E) => {
          const S = u.items[v];
          S.resolve?.(E), S.batch = null, S.reject = null, S.resolve = null;
        },
        {
          promise: f,
          cancel: m
        } = t.fetch(u.items.map(v => v.key), l);
      u.cancel = m, f.then(v => {
        for (let E = 0; E < v.length; E++) {
          const S = v[E];
          l(E, S);
        }
        for (const E of u.items) E.reject?.(new Error("Missing result")), E.batch = null;
      }).catch(v => {
        for (const E of u.items) E.reject?.(v), E.batch = null;
      });
    }
  }
  function o(i) {
    const c = {
        aborted: !1,
        key: i,
        batch: null,
        resolve: ft,
        reject: ft
      },
      u = new Promise((f, m) => {
        c.reject = m, c.resolve = f, e || (e = []), e.push(c);
      });
    return r || (r = setTimeout(a)), {
      promise: u,
      cancel: () => {
        c.aborted = !0, c.batch?.items.every(f => f.aborted) && (c.batch.cancel(), c.batch = null);
      }
    };
  }
  return {
    load: o
  };
}
function Ir(t) {
  return function (r) {
    const n = wt.resolveHTTPLinkOptions(r),
      s = r.maxURLLength ?? 1 / 0;
    return a => {
      const o = f => {
          const m = E => {
              if (s === 1 / 0) return !0;
              const S = E.map(q => q.path).join(","),
                ne = E.map(q => q.input);
              return wt.getUrl({
                ...n,
                runtime: a,
                type: f,
                path: S,
                inputs: ne
              }).length <= s;
            },
            v = t({
              ...n,
              runtime: a,
              type: f,
              opts: r
            });
          return {
            validate: m,
            fetch: v
          };
        },
        i = pt(o("query")),
        c = pt(o("mutation")),
        u = pt(o("subscription")),
        l = {
          query: i,
          subscription: u,
          mutation: c
        };
      return ({
        op: f
      }) => hs.observable(m => {
        const v = l[f.type],
          {
            promise: E,
            cancel: S
          } = v.load(f);
        let ne;
        return E.then(A => {
          ne = A;
          const q = ms.transformResult(A.json, a);
          if (!q.ok) {
            m.error(Gt.TRPCClientError.from(q.error, {
              meta: A.meta
            }));
            return;
          }
          m.next({
            context: A.meta,
            result: q.result
          }), m.complete();
        }).catch(A => {
          m.error(Gt.TRPCClientError.from(A, {
            meta: ne?.meta
          }));
        }), () => {
          S();
        };
      });
    };
  };
}
const ys = t => e => {
    const r = e.map(o => o.path).join(","),
      n = e.map(o => o.input),
      {
        promise: s,
        cancel: a
      } = wt.jsonHttpRequester({
        ...t,
        path: r,
        inputs: n,
        headers() {
          return t.opts.headers ? typeof t.opts.headers == "function" ? t.opts.headers({
            opList: e
          }) : t.opts.headers : {};
        }
      });
    return {
      promise: s.then(o => (Array.isArray(o.json) ? o.json : e.map(() => o.json)).map(u => ({
        meta: o.meta,
        json: u
      }))),
      cancel: a
    };
  },
  gs = Ir(ys);
Ot.createHTTPBatchLink = Ir;
Ot.httpBatchLink = gs;
var tt = {};
Object.defineProperty(tt, "__esModule", {
  value: !0
});
var bs = he,
  ws = et,
  Yt = me,
  Lr = z;
function Ar(t) {
  return e => {
    const r = Lr.resolveHTTPLinkOptions(e);
    return n => ({
      op: s
    }) => bs.observable(a => {
      const {
          path: o,
          input: i,
          type: c
        } = s,
        {
          promise: u,
          cancel: l
        } = t.requester({
          ...r,
          runtime: n,
          type: c,
          path: o,
          input: i,
          headers() {
            return e.headers ? typeof e.headers == "function" ? e.headers({
              op: s
            }) : e.headers : {};
          }
        });
      let f;
      return u.then(m => {
        f = m.meta;
        const v = ws.transformResult(m.json, n);
        if (!v.ok) {
          a.error(Yt.TRPCClientError.from(v.error, {
            meta: f
          }));
          return;
        }
        a.next({
          context: m.meta,
          result: v.result
        }), a.complete();
      }).catch(m => {
        a.error(Yt.TRPCClientError.from(m, {
          meta: f
        }));
      }), () => {
        l();
      };
    });
  };
}
const _s = Ar({
  requester: Lr.jsonHttpRequester
});
tt.httpLink = _s;
tt.httpLinkFactory = Ar;
var Pt = {};
Object.defineProperty(Pt, "__esModule", {
  value: !0
});
var Qt = he;
function vs(t) {
  return typeof FormData > "u" ? !1 : t instanceof FormData;
}
const ht = {
  css: {
    query: ["72e3ff", "3fb0d8"],
    mutation: ["c5a3fc", "904dfc"],
    subscription: ["ff49e1", "d83fbe"]
  },
  ansi: {
    regular: {
      // Cyan background, black and white text respectively
      query: ["\x1B[30;46m", "\x1B[97;46m"],
      // Magenta background, black and white text respectively
      mutation: ["\x1B[30;45m", "\x1B[97;45m"],
      // Green background, black and white text respectively
      subscription: ["\x1B[30;42m", "\x1B[97;42m"]
    },
    bold: {
      query: ["\x1B[1;30;46m", "\x1B[1;97;46m"],
      mutation: ["\x1B[1;30;45m", "\x1B[1;97;45m"],
      subscription: ["\x1B[1;30;42m", "\x1B[1;97;42m"]
    }
  }
};
function xs(t) {
  const {
      direction: e,
      type: r,
      path: n,
      id: s,
      input: a
    } = t,
    o = [],
    i = [];
  if (t.colorMode === "ansi") {
    const [f, m] = ht.ansi.regular[r],
      [v, E] = ht.ansi.bold[r],
      S = "\x1B[0m";
    return o.push(e === "up" ? f : m, e === "up" ? ">>" : "<<", r, e === "up" ? v : E, `#${s}`, n, S), e === "up" ? i.push({
      input: t.input
    }) : i.push({
      input: t.input,
      // strip context from result cause it's too noisy in terminal wihtout collapse mode
      result: "result" in t.result ? t.result.result : t.result,
      elapsedMs: t.elapsedMs
    }), {
      parts: o,
      args: i
    };
  }
  const [c, u] = ht.css[r],
    l = `
    background-color: #${e === "up" ? c : u}; 
    color: ${e === "up" ? "black" : "white"};
    padding: 2px;
  `;
  return o.push("%c", e === "up" ? ">>" : "<<", r, `#${s}`, `%c${n}%c`, "%O"), i.push(l, `${l}; font-weight: bold;`, `${l}; font-weight: normal;`), e === "up" ? i.push({
    input: a,
    context: t.context
  }) : i.push({
    input: a,
    result: t.result,
    elapsedMs: t.elapsedMs,
    context: t.context
  }), {
    parts: o,
    args: i
  };
}
const Ts = ({
  c: t = console,
  colorMode: e = "css"
}) => r => {
  const n = r.input,
    s = vs(n) ? Object.fromEntries(n) : n,
    {
      parts: a,
      args: o
    } = xs({
      ...r,
      colorMode: e,
      input: s
    }),
    i = r.direction === "down" && r.result && (r.result instanceof Error || "error" in r.result.result) ? "error" : "log";
  t[i].apply(null, [a.join(" ")].concat(o));
};
function Es(t = {}) {
  const {
      enabled: e = () => !0
    } = t,
    r = t.colorMode ?? (typeof window > "u" ? "ansi" : "css"),
    {
      logger: n = Ts({
        c: t.console,
        colorMode: r
      })
    } = t;
  return () => ({
    op: s,
    next: a
  }) => Qt.observable(o => {
    e({
      ...s,
      direction: "up"
    }) && n({
      ...s,
      direction: "up"
    });
    const i = Date.now();
    function c(u) {
      const l = Date.now() - i;
      e({
        ...s,
        direction: "down",
        result: u
      }) && n({
        ...s,
        direction: "down",
        elapsedMs: l,
        result: u
      });
    }
    return a(s).pipe(Qt.tap({
      next(u) {
        c(u);
      },
      error(u) {
        c(u);
      }
    })).subscribe(o);
  });
}
Pt.loggerLink = Es;
var rt = {};
Object.defineProperty(rt, "__esModule", {
  value: !0
});
var ks = he,
  Cs = et,
  Mr = me;
/* istanbul ignore next -- @preserve */
const Rs = t => t === 0 ? 0 : Math.min(1e3 * 2 ** t, 3e4);
function Os(t) {
  const {
    url: e,
    WebSocket: r = WebSocket,
    retryDelayMs: n = Rs,
    onOpen: s,
    onClose: a
  } = t;
  /* istanbul ignore next -- @preserve */
  if (!r) throw new Error("No WebSocket implementation found - you probably don't want to use this on the server, but if you do you need to pass a `WebSocket`-ponyfill");
  let o = [];
  const i = /* @__PURE__ */Object.create(null);
  let c = 0,
    u = null,
    l = null,
    f = jt(),
    m = "connecting";
  function v() {
    m !== "open" || u || (u = setTimeout(() => {
      u = null, o.length === 1 ? f.send(JSON.stringify(o.pop())) : f.send(JSON.stringify(o)), o = [];
    }));
  }
  function E() {
    if (l !== null || m === "closed") return;
    const R = n(c++);
    ne(R);
  }
  function S() {
    m = "connecting";
    const R = f;
    f = jt(), A(R);
  }
  function ne(R) {
    l || (m = "connecting", l = setTimeout(S, R));
  }
  function A(R) {
    Object.values(i).some(se => se.ws === R) || R.close();
  }
  function q() {
    Object.values(i).forEach(R => {
      R.type === "subscription" && R.callbacks.complete();
    });
  }
  function Mt(R) {
    o.some(P => P.id === R.op.id) || $t(R.op, R.callbacks);
  }
  function jt() {
    const R = typeof e == "function" ? e() : e,
      P = new r(R);
    clearTimeout(l), l = null, P.addEventListener("open", () => {
      /* istanbul ignore next -- @preserve */
      P === f && (c = 0, m = "open", s?.(), v());
    }), P.addEventListener("error", () => {
      P === f && E();
    });
    const se = L => {
        if (L.method === "reconnect" && P === f) {
          m === "open" && a?.(), S();
          for (const k of Object.values(i)) k.type === "subscription" && Mt(k);
        }
      },
      ct = L => {
        const k = L.id !== null && i[L.id];
        if (k) {
          if (k.callbacks.next?.(L), k.ws !== f && P === f) {
            const B = k.ws;
            k.ws = f, A(B);
          }
          "result" in L && L.result.type === "stopped" && P === f && k.callbacks.complete();
        }
      };
    return P.addEventListener("message", ({
      data: L
    }) => {
      const k = JSON.parse(L);
      "method" in k ? se(k) : ct(k), (P !== f || m === "closed") && A(P);
    }), P.addEventListener("close", ({
      code: L
    }) => {
      m === "open" && a?.({
        code: L
      }), f === P && E();
      for (const [k, B] of Object.entries(i)) if (B.ws === P) {
        if (m === "closed") {
          delete i[k], B.callbacks.complete?.();
          continue;
        }
        B.type === "subscription" ? Mt(B) : (delete i[k], B.callbacks.error?.(Mr.TRPCClientError.from(new St("WebSocket closed prematurely"))));
      }
    }), P;
  }
  function $t(R, P) {
    const {
        type: se,
        input: ct,
        path: L,
        id: k
      } = R,
      B = {
        id: k,
        method: se,
        params: {
          input: ct,
          path: L
        }
      };
    return i[k] = {
      ws: f,
      type: se,
      callbacks: P,
      op: R
    }, o.push(B), v(), () => {
      const nn = i[k]?.callbacks;
      delete i[k], o = o.filter(sn => sn.id !== k), nn?.complete?.(), f.readyState === r.OPEN && R.type === "subscription" && (o.push({
        id: k,
        method: "subscription.stop"
      }), v());
    };
  }
  return {
    close: () => {
      m = "closed", a?.(), q(), A(f), clearTimeout(l), l = null;
    },
    request: $t,
    getConnection() {
      return f;
    }
  };
}
class St extends Error {
  constructor(e) {
    super(e), this.name = "TRPCWebSocketClosedError", Object.setPrototypeOf(this, St.prototype);
  }
}
function Ps(t) {
  return e => {
    const {
      client: r
    } = t;
    return ({
      op: n
    }) => ks.observable(s => {
      const {
          type: a,
          path: o,
          id: i,
          context: c
        } = n,
        u = e.transformer.serialize(n.input),
        l = r.request({
          type: a,
          path: o,
          input: u,
          id: i,
          context: c
        }, {
          error(f) {
            s.error(f), l();
          },
          complete() {
            s.complete();
          },
          next(f) {
            const m = Cs.transformResult(f, e);
            if (!m.ok) {
              s.error(Mr.TRPCClientError.from(m.error));
              return;
            }
            s.next({
              result: m.result
            }), n.type !== "subscription" && (l(), s.complete());
          }
        });
      return () => {
        l();
      };
    });
  };
}
rt.createWSClient = Os;
rt.wsLink = Ps;
Object.defineProperty(O, "__esModule", {
  value: !0
});
var Xt = he,
  jr = Rt,
  $r = me,
  Kt = as,
  we = z,
  Dr = Ot,
  Nt = tt,
  Ss = Pt,
  Zr = rt;
class nt {
  $request({
    type: e,
    input: r,
    path: n,
    context: s = {}
  }) {
    return jr.createChain({
      links: this.links,
      op: {
        id: ++this.requestId,
        type: e,
        path: n,
        input: r,
        context: s
      }
    }).pipe(Xt.share());
  }
  requestAsPromise(e) {
    const r = this.$request(e),
      {
        promise: n,
        abort: s
      } = Xt.observableToPromise(r);
    return new Promise((o, i) => {
      e.signal?.addEventListener("abort", s), n.then(c => {
        o(c.result.data);
      }).catch(c => {
        i($r.TRPCClientError.from(c));
      });
    });
  }
  query(e, r, n) {
    return this.requestAsPromise({
      type: "query",
      path: e,
      input: r,
      context: n?.context,
      signal: n?.signal
    });
  }
  mutation(e, r, n) {
    return this.requestAsPromise({
      type: "mutation",
      path: e,
      input: r,
      context: n?.context,
      signal: n?.signal
    });
  }
  subscription(e, r, n) {
    return this.$request({
      type: "subscription",
      path: e,
      input: r,
      context: n?.context
    }).subscribe({
      next(a) {
        a.result.type === "started" ? n.onStarted?.() : a.result.type === "stopped" ? n.onStopped?.() : n.onData?.(a.result.data);
      },
      error(a) {
        n.onError?.(a);
      },
      complete() {
        n.onComplete?.();
      }
    });
  }
  constructor(e) {
    this.requestId = 0;
    const r = (() => {
      const n = e.transformer;
      return n ? "input" in n ? e.transformer : {
        input: n,
        output: n
      } : {
        input: {
          serialize: s => s,
          deserialize: s => s
        },
        output: {
          serialize: s => s,
          deserialize: s => s
        }
      };
    })();
    this.runtime = {
      transformer: {
        serialize: n => r.input.serialize(n),
        deserialize: n => r.output.deserialize(n)
      },
      combinedTransformer: r
    }, this.links = e.links.map(n => n(this.runtime));
  }
}
function Ns(t) {
  return new nt(t);
}
function Is(t) {
  return new nt(t);
}
const Ls = {
    query: "query",
    mutate: "mutation",
    subscribe: "subscription"
  },
  Ur = t => Ls[t];
function Wr(t) {
  return Kt.createFlatProxy(e => t.hasOwnProperty(e) ? t[e] : e === "__untypedClient" ? t : Kt.createRecursiveProxy(({
    path: r,
    args: n
  }) => {
    const s = [e, ...r],
      a = Ur(s.pop()),
      o = s.join(".");
    return t[a](o, ...n);
  }));
}
function As(t) {
  const e = new nt(t);
  return Wr(e);
}
function Ms(t) {
  return t.__untypedClient;
}
function js(t) {
  if (t) return t;
  if (typeof window < "u" && window.TextDecoder) return new window.TextDecoder();
  if (typeof globalThis < "u" && globalThis.TextDecoder) return new globalThis.TextDecoder();
  throw new Error("No TextDecoder implementation found");
}
async function $s(t) {
  const e = t.parse ?? JSON.parse,
    r = n => {
      if (t.signal?.aborted || !n || n === "}") return;
      const s = n.indexOf(":"),
        a = n.substring(2, s - 1),
        o = n.substring(s + 1);
      t.onSingle(Number(a), e(o));
    };
  await Ds(t.readableStream, r, t.textDecoder);
}
async function Ds(t, e, r) {
  let n = "";
  const s = a => {
    const i = r.decode(a).split(`
`);
    if (i.length === 1) n += i[0];else if (i.length > 1) {
      e(n + i[0]);
      for (let c = 1; c < i.length - 1; c++) e(i[c]);
      n = i[i.length - 1];
    }
  };
  "getReader" in t ? await Us(t, s) : await Zs(t, s), e(n);
}
function Zs(t, e) {
  return new Promise(r => {
    t.on("data", e), t.on("end", r);
  });
}
async function Us(t, e) {
  const r = t.getReader();
  let n = await r.read();
  for (; !n.done;) e(n.value), n = await r.read();
}
const Ws = (t, e) => {
    const r = t.AbortController ? new t.AbortController() : null,
      n = we.fetchHTTPResponse({
        ...t,
        contentTypeHeader: "application/json",
        batchModeHeader: "stream",
        getUrl: we.getUrl,
        getBody: we.getBody
      }, r),
      s = () => r?.abort(),
      a = n.then(async o => {
        if (!o.body) throw new Error("Received response without body");
        const i = {
          response: o
        };
        return $s({
          readableStream: o.body,
          onSingle: e,
          parse: c => ({
            json: JSON.parse(c),
            meta: i
          }),
          signal: r?.signal,
          textDecoder: t.textDecoder
        });
      });
    return {
      cancel: s,
      promise: a
    };
  },
  zs = t => {
    const e = js(t.opts.textDecoder);
    return (r, n) => {
      const s = r.map(c => c.path).join(","),
        a = r.map(c => c.input),
        {
          cancel: o,
          promise: i
        } = Ws({
          ...t,
          textDecoder: e,
          path: s,
          inputs: a,
          headers() {
            return t.opts.headers ? typeof t.opts.headers == "function" ? t.opts.headers({
              opList: r
            }) : t.opts.headers : {};
          }
        }, (c, u) => {
          n(c, u);
        });
      return {
        /**
        * return an empty array because the batchLoader expects an array of results
        * but we've already called the `unitResolver` for each of them, there's
        * nothing left to do here.
        */
        promise: i.then(() => []),
        cancel: o
      };
    };
  },
  qs = Dr.createHTTPBatchLink(zs),
  Bs = t => {
    if ("input" in t) {
      if (!(t.input instanceof FormData)) throw new Error("Input is not FormData");
      return t.input;
    }
  },
  Vs = t => {
    if (t.type !== "mutation") throw new Error("We only handle mutations with formdata");
    return we.httpRequest({
      ...t,
      getUrl() {
        return `${t.url}/${t.path}`;
      },
      getBody: Bs
    });
  },
  Hs = Nt.httpLinkFactory({
    requester: Vs
  });
O.splitLink = jr.splitLink;
O.TRPCClientError = $r.TRPCClientError;
O.getFetch = we.getFetch;
O.httpBatchLink = Dr.httpBatchLink;
O.httpLink = Nt.httpLink;
O.httpLinkFactory = Nt.httpLinkFactory;
O.loggerLink = Ss.loggerLink;
O.createWSClient = Zr.createWSClient;
O.wsLink = Zr.wsLink;
O.TRPCUntypedClient = nt;
O.clientCallTypeToProcedureType = Ur;
O.createTRPCClient = Is;
O.createTRPCClientProxy = Wr;
O.createTRPCProxyClient = As;
O.createTRPCUntypedClient = Ns;
O.experimental_formDataLink = Hs;
O.getUntypedClient = Ms;
O.unstable_httpBatchStreamLink = qs;
var X = {},
  It = {};
function Fs(t) {
  return t;
}
function Js(t) {
  return t.length === 0 ? Fs : t.length === 1 ? t[0] : function (r) {
    return t.reduce((n, s) => s(n), r);
  };
}
function Gs(t) {
  return typeof t == "object" && t !== null && "subscribe" in t;
}
function Ys(t) {
  const e = {
    subscribe(r) {
      let n = null,
        s = !1,
        a = !1,
        o = !1;
      function i() {
        if (n === null) {
          o = !0;
          return;
        }
        a || (a = !0, typeof n == "function" ? n() : n && n.unsubscribe());
      }
      return n = t({
        next(c) {
          s || r.next?.(c);
        },
        error(c) {
          s || (s = !0, r.error?.(c), i());
        },
        complete() {
          s || (s = !0, r.complete?.(), i());
        }
      }), o && i(), {
        unsubscribe: i
      };
    },
    pipe(...r) {
      return Js(r)(e);
    }
  };
  return e;
}
It.isObservable = Gs;
It.observable = Ys;
Object.defineProperty(X, "__esModule", {
  value: !0
});
var zr = It;
function Qs(t) {
  return e => {
    let r = 0,
      n = null;
    const s = [];
    function a() {
      n || (n = e.subscribe({
        next(i) {
          for (const c of s) c.next?.(i);
        },
        error(i) {
          for (const c of s) c.error?.(i);
        },
        complete() {
          for (const i of s) i.complete?.();
        }
      }));
    }
    function o() {
      if (r === 0 && n) {
        const i = n;
        n = null, i.unsubscribe();
      }
    }
    return {
      subscribe(i) {
        return r++, s.push(i), a(), {
          unsubscribe() {
            r--, o();
            const c = s.findIndex(u => u === i);
            c > -1 && s.splice(c, 1);
          }
        };
      }
    };
  };
}
function Xs(t) {
  return e => ({
    subscribe(r) {
      let n = 0;
      return e.subscribe({
        next(a) {
          r.next?.(t(a, n++));
        },
        error(a) {
          r.error?.(a);
        },
        complete() {
          r.complete?.();
        }
      });
    }
  });
}
function Ks(t) {
  return e => ({
    subscribe(r) {
      return e.subscribe({
        next(n) {
          t.next?.(n), r.next?.(n);
        },
        error(n) {
          t.error?.(n), r.error?.(n);
        },
        complete() {
          t.complete?.(), r.complete?.();
        }
      });
    }
  });
}
class Lt extends Error {
  constructor(e) {
    super(e), this.name = "ObservableAbortError", Object.setPrototypeOf(this, Lt.prototype);
  }
}
function ea(t) {
  let e;
  return {
    promise: new Promise((n, s) => {
      let a = !1;
      function o() {
        a || (a = !0, s(new Lt("This operation was aborted.")), i.unsubscribe());
      }
      const i = t.subscribe({
        next(c) {
          a = !0, n(c), o();
        },
        error(c) {
          a = !0, s(c), o();
        },
        complete() {
          a = !0, o();
        }
      });
      e = o;
    }),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    abort: e
  };
}
X.isObservable = zr.isObservable;
X.observable = zr.observable;
X.map = Xs;
X.observableToPromise = ea;
X.share = Qs;
X.tap = Ks;
var Z = {};
Object.defineProperty(Z, "__esModule", {
  value: !0
});
Z.isTRPCRequestWithId = Z.isTRPCRequest = Z.isTRPCResponse = Z.isTRPCMessage = void 0;
function er(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
function ta(t) {
  return t == null;
}
function qr(t) {
  return !!(er(t) && "trpc" in t && er(t.trpc));
}
Z.isTRPCMessage = qr;
function At(t) {
  return qr(t) && "id" in t.trpc && !ta(t.trpc.id);
}
function ra(t) {
  return At(t) && ("error" in t.trpc || "result" in t.trpc);
}
Z.isTRPCResponse = ra;
function Br(t) {
  return At(t) && "method" in t.trpc;
}
Z.isTRPCRequest = Br;
function na(t) {
  return Br(t) && At(t);
}
Z.isTRPCRequestWithId = na;
Object.defineProperty(pe, "__esModule", {
  value: !0
});
pe.createBaseLink = void 0;
const mt = O,
  sa = X,
  aa = Z,
  oa = t => e => ({
    op: r
  }) => (0, sa.observable)(n => {
    const s = [],
      {
        id: a,
        type: o,
        path: i
      } = r;
    try {
      const c = e.transformer.serialize(r.input),
        u = () => {
          n.error(new mt.TRPCClientError("Port disconnected prematurely"));
        };
      t.addCloseListener(u), s.push(() => t.removeCloseListener(u));
      const l = f => {
        if (!(0, aa.isTRPCResponse)(f)) return;
        const {
          trpc: m
        } = f;
        if (a === m.id) {
          if ("error" in m) {
            const v = e.transformer.deserialize(m.error);
            n.error(mt.TRPCClientError.from(Object.assign(Object.assign({}, m), {
              error: v
            })));
            return;
          }
          n.next({
            result: Object.assign(Object.assign({}, m.result), (!m.result.type || m.result.type === "data") && {
              type: "data",
              data: e.transformer.deserialize(m.result.data)
            })
          }), (o !== "subscription" || m.result.type === "stopped") && n.complete();
        }
      };
      t.addMessageListener(l), s.push(() => t.removeMessageListener(l)), t.postMessage({
        trpc: {
          id: a,
          jsonrpc: void 0,
          method: o,
          params: {
            path: i,
            input: c
          }
        }
      });
    } catch (c) {
      n.error(new mt.TRPCClientError(c instanceof Error ? c.message : "Unknown error"));
    }
    return () => {
      o === "subscription" && t.postMessage({
        trpc: {
          id: a,
          jsonrpc: void 0,
          method: "subscription.stop"
        }
      }), s.forEach(c => c());
    };
  });
pe.createBaseLink = oa;
Object.defineProperty(Ke, "__esModule", {
  value: !0
});
Ke.chromeLink = void 0;
const ia = pe,
  ca = t => (0, ia.createBaseLink)({
    postMessage(e) {
      t.port.postMessage(e);
    },
    addMessageListener(e) {
      t.port.onMessage.addListener(e);
    },
    removeMessageListener(e) {
      t.port.onMessage.removeListener(e);
    },
    addCloseListener(e) {
      t.port.onDisconnect.addListener(e);
    },
    removeCloseListener(e) {
      t.port.onDisconnect.removeListener(e);
    }
  });
Ke.chromeLink = ca;
var st = {};
Object.defineProperty(st, "__esModule", {
  value: !0
});
st.windowLink = void 0;
const ua = pe,
  la = t => {
    var e;
    const r = /* @__PURE__ */new Map(),
      n = t.window,
      s = (e = t.postWindow) !== null && e !== void 0 ? e : n;
    return (0, ua.createBaseLink)({
      postMessage(a) {
        s.postMessage(a, {
          targetOrigin: t.postOrigin
        });
      },
      addMessageListener(a) {
        const o = i => {
          a(i.data);
        };
        r.set(a, o), n.addEventListener("message", o);
      },
      removeMessageListener(a) {
        const o = r.get(a);
        o && n.removeEventListener("message", o);
      },
      addCloseListener(a) {
        n.addEventListener("beforeunload", a);
      },
      removeCloseListener(a) {
        n.removeEventListener("beforeunload", a);
      }
    });
  };
st.windowLink = la;
var at = {},
  ot = {};
Object.defineProperty(ot, "__esModule", {
  value: !0
});
ot.TRPC_BROWSER_LOADED_EVENT = void 0;
ot.TRPC_BROWSER_LOADED_EVENT = "TRPC_BROWSER::POPUP_LOADED";
Object.defineProperty(at, "__esModule", {
  value: !0
});
at.popupLink = void 0;
const da = ot,
  fa = pe,
  pa = t => {
    const e = /* @__PURE__ */new Map(),
      r = /* @__PURE__ */new Set();
    let n = null;
    async function s(a) {
      if (!n || n.closed) {
        n = t.createPopup(), await Promise.race([
        // wait til window is loaded (same origin)
        new Promise(o => {
          var i;
          try {
            (i = n?.addEventListener) === null || i === void 0 || i.call(n, "load", o);
          } catch {}
        }),
        // this is needed for cross-origin popups as they don't have a load event
        new Promise(o => {
          a.addEventListener("message", i => {
            i.data === da.TRPC_BROWSER_LOADED_EVENT && o();
          });
        }),
        // expect the popup to load after 15s max, in case non of the above events fire
        new Promise(o => {
          console.warn("Could not detect if popup loading succeeded after 15s timeout, continuing anyway"), setTimeout(o, 15e3);
        })]);
        try {
          if (!n.addEventListener) throw new Error("popupWindow.addEventListener is not a function");
          n.addEventListener("beforeunload", () => {
            n = null;
          });
        } catch {
          const i = setInterval(() => {
            n && n.closed && (n = null, r.forEach(c => {
              c();
            }), clearInterval(i));
          }, 1e3);
        }
      }
      return n;
    }
    return (0, fa.createBaseLink)({
      async postMessage(a) {
        return (await s(t.listenWindow)).postMessage(a, {
          targetOrigin: t.postOrigin
        });
      },
      addMessageListener(a) {
        const o = i => {
          a(i.data);
        };
        e.set(a, o), t.listenWindow.addEventListener("message", o);
      },
      removeMessageListener(a) {
        const o = e.get(a);
        o && t.listenWindow.removeEventListener("message", o);
      },
      addCloseListener(a) {
        t.listenWindow.addEventListener("beforeunload", a), r.add(a);
      },
      removeCloseListener(a) {
        t.listenWindow.removeEventListener("beforeunload", a), r.delete(a);
      }
    });
  };
at.popupLink = pa;
(function (t) {
  var e = _lastConnectedB964dc.c && _lastConnectedB964dc.c.__createBinding || (Object.create ? function (n, s, a, o) {
      o === void 0 && (o = a);
      var i = Object.getOwnPropertyDescriptor(s, a);
      (!i || ("get" in i ? !s.__esModule : i.writable || i.configurable)) && (i = {
        enumerable: !0,
        get: function () {
          return s[a];
        }
      }), Object.defineProperty(n, o, i);
    } : function (n, s, a, o) {
      o === void 0 && (o = a), n[o] = s[a];
    }),
    r = _lastConnectedB964dc.c && _lastConnectedB964dc.c.__exportStar || function (n, s) {
      for (var a in n) a !== "default" && !Object.prototype.hasOwnProperty.call(s, a) && e(s, n, a);
    };
  Object.defineProperty(t, "__esModule", {
    value: !0
  }), r(Ke, t), r(st, t), r(at, t);
})(bt);
var T;
(function (t) {
  t.assertEqual = s => s;
  function e(s) {}
  t.assertIs = e;
  function r(s) {
    throw new Error();
  }
  t.assertNever = r, t.arrayToEnum = s => {
    const a = {};
    for (const o of s) a[o] = o;
    return a;
  }, t.getValidEnumValues = s => {
    const a = t.objectKeys(s).filter(i => typeof s[s[i]] != "number"),
      o = {};
    for (const i of a) o[i] = s[i];
    return t.objectValues(o);
  }, t.objectValues = s => t.objectKeys(s).map(function (a) {
    return s[a];
  }), t.objectKeys = typeof Object.keys == "function" ? s => Object.keys(s) : s => {
    const a = [];
    for (const o in s) Object.prototype.hasOwnProperty.call(s, o) && a.push(o);
    return a;
  }, t.find = (s, a) => {
    for (const o of s) if (a(o)) return o;
  }, t.isInteger = typeof Number.isInteger == "function" ? s => Number.isInteger(s) : s => typeof s == "number" && isFinite(s) && Math.floor(s) === s;
  function n(s, a = " | ") {
    return s.map(o => typeof o == "string" ? `'${o}'` : o).join(a);
  }
  t.joinValues = n, t.jsonStringifyReplacer = (s, a) => typeof a == "bigint" ? a.toString() : a;
})(T || (T = {}));
const h = T.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]),
  G = t => {
    switch (typeof t) {
      case "undefined":
        return h.undefined;
      case "string":
        return h.string;
      case "number":
        return isNaN(t) ? h.nan : h.number;
      case "boolean":
        return h.boolean;
      case "function":
        return h.function;
      case "bigint":
        return h.bigint;
      case "symbol":
        return h.symbol;
      case "object":
        return Array.isArray(t) ? h.array : t === null ? h.null : t.then && typeof t.then == "function" && t.catch && typeof t.catch == "function" ? h.promise : typeof Map < "u" && t instanceof Map ? h.map : typeof Set < "u" && t instanceof Set ? h.set : typeof Date < "u" && t instanceof Date ? h.date : h.object;
      default:
        return h.unknown;
    }
  },
  d = T.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]),
  ha = t => JSON.stringify(t, null, 2).replace(/"([^"]+)":/g, "$1:");
class V extends Error {
  constructor(e) {
    super(), this.issues = [], this.addIssue = n => {
      this.issues = [...this.issues, n];
    }, this.addIssues = (n = []) => {
      this.issues = [...this.issues, ...n];
    };
    const r = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, r) : this.__proto__ = r, this.name = "ZodError", this.issues = e;
  }
  get errors() {
    return this.issues;
  }
  format(e) {
    const r = e || function (a) {
        return a.message;
      },
      n = {
        _errors: []
      },
      s = a => {
        for (const o of a.issues) if (o.code === "invalid_union") o.unionErrors.map(s);else if (o.code === "invalid_return_type") s(o.returnTypeError);else if (o.code === "invalid_arguments") s(o.argumentsError);else if (o.path.length === 0) n._errors.push(r(o));else {
          let i = n,
            c = 0;
          for (; c < o.path.length;) {
            const u = o.path[c];
            c === o.path.length - 1 ? (i[u] = i[u] || {
              _errors: []
            }, i[u]._errors.push(r(o))) : i[u] = i[u] || {
              _errors: []
            }, i = i[u], c++;
          }
        }
      };
    return s(this), n;
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, T.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = r => r.message) {
    const r = {},
      n = [];
    for (const s of this.issues) s.path.length > 0 ? (r[s.path[0]] = r[s.path[0]] || [], r[s.path[0]].push(e(s))) : n.push(e(s));
    return {
      formErrors: n,
      fieldErrors: r
    };
  }
  get formErrors() {
    return this.flatten();
  }
}
V.create = t => new V(t);
const xe = (t, e) => {
  let r;
  switch (t.code) {
    case d.invalid_type:
      t.received === h.undefined ? r = "Required" : r = `Expected ${t.expected}, received ${t.received}`;
      break;
    case d.invalid_literal:
      r = `Invalid literal value, expected ${JSON.stringify(t.expected, T.jsonStringifyReplacer)}`;
      break;
    case d.unrecognized_keys:
      r = `Unrecognized key(s) in object: ${T.joinValues(t.keys, ", ")}`;
      break;
    case d.invalid_union:
      r = "Invalid input";
      break;
    case d.invalid_union_discriminator:
      r = `Invalid discriminator value. Expected ${T.joinValues(t.options)}`;
      break;
    case d.invalid_enum_value:
      r = `Invalid enum value. Expected ${T.joinValues(t.options)}, received '${t.received}'`;
      break;
    case d.invalid_arguments:
      r = "Invalid function arguments";
      break;
    case d.invalid_return_type:
      r = "Invalid function return type";
      break;
    case d.invalid_date:
      r = "Invalid date";
      break;
    case d.invalid_string:
      typeof t.validation == "object" ? "startsWith" in t.validation ? r = `Invalid input: must start with "${t.validation.startsWith}"` : "endsWith" in t.validation ? r = `Invalid input: must end with "${t.validation.endsWith}"` : T.assertNever(t.validation) : t.validation !== "regex" ? r = `Invalid ${t.validation}` : r = "Invalid";
      break;
    case d.too_small:
      t.type === "array" ? r = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "more than"} ${t.minimum} element(s)` : t.type === "string" ? r = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "over"} ${t.minimum} character(s)` : t.type === "number" ? r = `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}` : t.type === "date" ? r = `Date must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${new Date(t.minimum)}` : r = "Invalid input";
      break;
    case d.too_big:
      t.type === "array" ? r = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "less than"} ${t.maximum} element(s)` : t.type === "string" ? r = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "under"} ${t.maximum} character(s)` : t.type === "number" ? r = `Number must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "date" ? r = `Date must be ${t.exact ? "exactly" : t.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(t.maximum)}` : r = "Invalid input";
      break;
    case d.custom:
      r = "Invalid input";
      break;
    case d.invalid_intersection_types:
      r = "Intersection results could not be merged";
      break;
    case d.not_multiple_of:
      r = `Number must be a multiple of ${t.multipleOf}`;
      break;
    case d.not_finite:
      r = "Number must be finite";
      break;
    default:
      r = e.defaultError, T.assertNever(t);
  }
  return {
    message: r
  };
};
let Vr = xe;
function ma(t) {
  Vr = t;
}
function We() {
  return Vr;
}
const ze = t => {
    const {
        data: e,
        path: r,
        errorMaps: n,
        issueData: s
      } = t,
      a = [...r, ...(s.path || [])],
      o = {
        ...s,
        path: a
      };
    let i = "";
    const c = n.filter(u => !!u).slice().reverse();
    for (const u of c) i = u(o, {
      data: e,
      defaultError: i
    }).message;
    return {
      ...s,
      path: a,
      message: s.message || i
    };
  },
  ya = [];
function y(t, e) {
  const r = ze({
    issueData: e,
    data: t.data,
    path: t.path,
    errorMaps: [t.common.contextualErrorMap, t.schemaErrorMap, We(), xe
    // then global default map
    ].filter(n => !!n)
  });
  t.common.issues.push(r);
}
class I {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, r) {
    const n = [];
    for (const s of r) {
      if (s.status === "aborted") return b;
      s.status === "dirty" && e.dirty(), n.push(s.value);
    }
    return {
      status: e.value,
      value: n
    };
  }
  static async mergeObjectAsync(e, r) {
    const n = [];
    for (const s of r) n.push({
      key: await s.key,
      value: await s.value
    });
    return I.mergeObjectSync(e, n);
  }
  static mergeObjectSync(e, r) {
    const n = {};
    for (const s of r) {
      const {
        key: a,
        value: o
      } = s;
      if (a.status === "aborted" || o.status === "aborted") return b;
      a.status === "dirty" && e.dirty(), o.status === "dirty" && e.dirty(), (typeof o.value < "u" || s.alwaysSet) && (n[a.value] = o.value);
    }
    return {
      status: e.value,
      value: n
    };
  }
}
const b = Object.freeze({
    status: "aborted"
  }),
  Hr = t => ({
    status: "dirty",
    value: t
  }),
  N = t => ({
    status: "valid",
    value: t
  }),
  _t = t => t.status === "aborted",
  vt = t => t.status === "dirty",
  qe = t => t.status === "valid",
  Be = t => typeof Promise < "u" && t instanceof Promise;
var x;
(function (t) {
  t.errToObj = e => typeof e == "string" ? {
    message: e
  } : e || {}, t.toString = e => typeof e == "string" ? e : e?.message;
})(x || (x = {}));
class U {
  constructor(e, r, n, s) {
    this.parent = e, this.data = r, this._path = n, this._key = s;
  }
  get path() {
    return this._path.concat(this._key);
  }
}
const tr = (t, e) => {
  if (qe(e)) return {
    success: !0,
    data: e.value
  };
  if (!t.common.issues.length) throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    error: new V(t.common.issues)
  };
};
function w(t) {
  if (!t) return {};
  const {
    errorMap: e,
    invalid_type_error: r,
    required_error: n,
    description: s
  } = t;
  if (e && (r || n)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? {
    errorMap: e,
    description: s
  } : {
    errorMap: (o, i) => o.code !== "invalid_type" ? {
      message: i.defaultError
    } : typeof i.data > "u" ? {
      message: n ?? i.defaultError
    } : {
      message: r ?? i.defaultError
    },
    description: s
  };
}
class _ {
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return G(e.data);
  }
  _getOrReturnCtx(e, r) {
    return r || {
      common: e.parent.common,
      data: e.data,
      parsedType: G(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new I(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: G(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const r = this._parse(e);
    if (Be(r)) throw new Error("Synchronous parse encountered promise.");
    return r;
  }
  _parseAsync(e) {
    const r = this._parse(e);
    return Promise.resolve(r);
  }
  parse(e, r) {
    const n = this.safeParse(e, r);
    if (n.success) return n.data;
    throw n.error;
  }
  safeParse(e, r) {
    var n;
    const s = {
        common: {
          issues: [],
          async: (n = r?.async) !== null && n !== void 0 ? n : !1,
          contextualErrorMap: r?.errorMap
        },
        path: r?.path || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: e,
        parsedType: G(e)
      },
      a = this._parseSync({
        data: e,
        path: s.path,
        parent: s
      });
    return tr(s, a);
  }
  async parseAsync(e, r) {
    const n = await this.safeParseAsync(e, r);
    if (n.success) return n.data;
    throw n.error;
  }
  async safeParseAsync(e, r) {
    const n = {
        common: {
          issues: [],
          contextualErrorMap: r?.errorMap,
          async: !0
        },
        path: r?.path || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: e,
        parsedType: G(e)
      },
      s = this._parse({
        data: e,
        path: n.path,
        parent: n
      }),
      a = await (Be(s) ? s : Promise.resolve(s));
    return tr(n, a);
  }
  refine(e, r) {
    const n = s => typeof r == "string" || typeof r > "u" ? {
      message: r
    } : typeof r == "function" ? r(s) : r;
    return this._refinement((s, a) => {
      const o = e(s),
        i = () => a.addIssue({
          code: d.custom,
          ...n(s)
        });
      return typeof Promise < "u" && o instanceof Promise ? o.then(c => c ? !0 : (i(), !1)) : o ? !0 : (i(), !1);
    });
  }
  refinement(e, r) {
    return this._refinement((n, s) => e(n) ? !0 : (s.addIssue(typeof r == "function" ? r(n, s) : r), !1));
  }
  _refinement(e) {
    return new D({
      schema: this,
      typeName: g.ZodEffects,
      effect: {
        type: "refinement",
        refinement: e
      }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  optional() {
    return H.create(this, this._def);
  }
  nullable() {
    return re.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return $.create(this, this._def);
  }
  promise() {
    return fe.create(this, this._def);
  }
  or(e) {
    return Re.create([this, e], this._def);
  }
  and(e) {
    return Oe.create(this, e, this._def);
  }
  transform(e) {
    return new D({
      ...w(this._def),
      schema: this,
      typeName: g.ZodEffects,
      effect: {
        type: "transform",
        transform: e
      }
    });
  }
  default(e) {
    const r = typeof e == "function" ? e : () => e;
    return new Le({
      ...w(this._def),
      innerType: this,
      defaultValue: r,
      typeName: g.ZodDefault
    });
  }
  brand() {
    return new Jr({
      typeName: g.ZodBranded,
      type: this,
      ...w(this._def)
    });
  }
  catch(e) {
    const r = typeof e == "function" ? e : () => e;
    return new Ge({
      ...w(this._def),
      innerType: this,
      catchValue: r,
      typeName: g.ZodCatch
    });
  }
  describe(e) {
    const r = this.constructor;
    return new r({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return Ae.create(this, e);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const ga = /^c[^\s-]{8,}$/i,
  ba = /^[a-z][a-z0-9]*$/,
  wa = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i,
  _a = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|([^-]([a-zA-Z0-9-]*\.)+[a-zA-Z]{2,}))$/,
  va = t => t.precision ? t.offset ? new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${t.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`) : new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${t.precision}}Z$`) : t.precision === 0 ? t.offset ? new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$") : new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$") : t.offset ? new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$") : new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$");
class F extends _ {
  constructor() {
    super(...arguments), this._regex = (e, r, n) => this.refinement(s => e.test(s), {
      validation: r,
      code: d.invalid_string,
      ...x.errToObj(n)
    }), this.nonempty = e => this.min(1, x.errToObj(e)), this.trim = () => new F({
      ...this._def,
      checks: [...this._def.checks, {
        kind: "trim"
      }]
    });
  }
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== h.string) {
      const a = this._getOrReturnCtx(e);
      return y(a, {
        code: d.invalid_type,
        expected: h.string,
        received: a.parsedType
      }
      //
      ), b;
    }
    const n = new I();
    let s;
    for (const a of this._def.checks) if (a.kind === "min") e.data.length < a.value && (s = this._getOrReturnCtx(e, s), y(s, {
      code: d.too_small,
      minimum: a.value,
      type: "string",
      inclusive: !0,
      exact: !1,
      message: a.message
    }), n.dirty());else if (a.kind === "max") e.data.length > a.value && (s = this._getOrReturnCtx(e, s), y(s, {
      code: d.too_big,
      maximum: a.value,
      type: "string",
      inclusive: !0,
      exact: !1,
      message: a.message
    }), n.dirty());else if (a.kind === "length") {
      const o = e.data.length > a.value,
        i = e.data.length < a.value;
      (o || i) && (s = this._getOrReturnCtx(e, s), o ? y(s, {
        code: d.too_big,
        maximum: a.value,
        type: "string",
        inclusive: !0,
        exact: !0,
        message: a.message
      }) : i && y(s, {
        code: d.too_small,
        minimum: a.value,
        type: "string",
        inclusive: !0,
        exact: !0,
        message: a.message
      }), n.dirty());
    } else if (a.kind === "email") _a.test(e.data) || (s = this._getOrReturnCtx(e, s), y(s, {
      validation: "email",
      code: d.invalid_string,
      message: a.message
    }), n.dirty());else if (a.kind === "uuid") wa.test(e.data) || (s = this._getOrReturnCtx(e, s), y(s, {
      validation: "uuid",
      code: d.invalid_string,
      message: a.message
    }), n.dirty());else if (a.kind === "cuid") ga.test(e.data) || (s = this._getOrReturnCtx(e, s), y(s, {
      validation: "cuid",
      code: d.invalid_string,
      message: a.message
    }), n.dirty());else if (a.kind === "cuid2") ba.test(e.data) || (s = this._getOrReturnCtx(e, s), y(s, {
      validation: "cuid2",
      code: d.invalid_string,
      message: a.message
    }), n.dirty());else if (a.kind === "url") try {
      new URL(e.data);
    } catch {
      s = this._getOrReturnCtx(e, s), y(s, {
        validation: "url",
        code: d.invalid_string,
        message: a.message
      }), n.dirty();
    } else a.kind === "regex" ? (a.regex.lastIndex = 0, a.regex.test(e.data) || (s = this._getOrReturnCtx(e, s), y(s, {
      validation: "regex",
      code: d.invalid_string,
      message: a.message
    }), n.dirty())) : a.kind === "trim" ? e.data = e.data.trim() : a.kind === "startsWith" ? e.data.startsWith(a.value) || (s = this._getOrReturnCtx(e, s), y(s, {
      code: d.invalid_string,
      validation: {
        startsWith: a.value
      },
      message: a.message
    }), n.dirty()) : a.kind === "endsWith" ? e.data.endsWith(a.value) || (s = this._getOrReturnCtx(e, s), y(s, {
      code: d.invalid_string,
      validation: {
        endsWith: a.value
      },
      message: a.message
    }), n.dirty()) : a.kind === "datetime" ? va(a).test(e.data) || (s = this._getOrReturnCtx(e, s), y(s, {
      code: d.invalid_string,
      validation: "datetime",
      message: a.message
    }), n.dirty()) : T.assertNever(a);
    return {
      status: n.value,
      value: e.data
    };
  }
  _addCheck(e) {
    return new F({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({
      kind: "email",
      ...x.errToObj(e)
    });
  }
  url(e) {
    return this._addCheck({
      kind: "url",
      ...x.errToObj(e)
    });
  }
  uuid(e) {
    return this._addCheck({
      kind: "uuid",
      ...x.errToObj(e)
    });
  }
  cuid(e) {
    return this._addCheck({
      kind: "cuid",
      ...x.errToObj(e)
    });
  }
  cuid2(e) {
    return this._addCheck({
      kind: "cuid2",
      ...x.errToObj(e)
    });
  }
  datetime(e) {
    var r;
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof e?.precision > "u" ? null : e?.precision,
      offset: (r = e?.offset) !== null && r !== void 0 ? r : !1,
      ...x.errToObj(e?.message)
    });
  }
  regex(e, r) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...x.errToObj(r)
    });
  }
  startsWith(e, r) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...x.errToObj(r)
    });
  }
  endsWith(e, r) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...x.errToObj(r)
    });
  }
  min(e, r) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...x.errToObj(r)
    });
  }
  max(e, r) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...x.errToObj(r)
    });
  }
  length(e, r) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...x.errToObj(r)
    });
  }
  get isDatetime() {
    return !!this._def.checks.find(e => e.kind === "datetime");
  }
  get isEmail() {
    return !!this._def.checks.find(e => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find(e => e.kind === "url");
  }
  get isUUID() {
    return !!this._def.checks.find(e => e.kind === "uuid");
  }
  get isCUID() {
    return !!this._def.checks.find(e => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find(e => e.kind === "cuid2");
  }
  get minLength() {
    let e = null;
    for (const r of this._def.checks) r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const r of this._def.checks) r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e;
  }
}
F.create = t => {
  var e;
  return new F({
    checks: [],
    typeName: g.ZodString,
    coerce: (e = t?.coerce) !== null && e !== void 0 ? e : !1,
    ...w(t)
  });
};
function xa(t, e) {
  const r = (t.toString().split(".")[1] || "").length,
    n = (e.toString().split(".")[1] || "").length,
    s = r > n ? r : n,
    a = parseInt(t.toFixed(s).replace(".", "")),
    o = parseInt(e.toFixed(s).replace(".", ""));
  return a % o / Math.pow(10, s);
}
class Y extends _ {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== h.number) {
      const a = this._getOrReturnCtx(e);
      return y(a, {
        code: d.invalid_type,
        expected: h.number,
        received: a.parsedType
      }), b;
    }
    let n;
    const s = new I();
    for (const a of this._def.checks) a.kind === "int" ? T.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), y(n, {
      code: d.invalid_type,
      expected: "integer",
      received: "float",
      message: a.message
    }), s.dirty()) : a.kind === "min" ? (a.inclusive ? e.data < a.value : e.data <= a.value) && (n = this._getOrReturnCtx(e, n), y(n, {
      code: d.too_small,
      minimum: a.value,
      type: "number",
      inclusive: a.inclusive,
      exact: !1,
      message: a.message
    }), s.dirty()) : a.kind === "max" ? (a.inclusive ? e.data > a.value : e.data >= a.value) && (n = this._getOrReturnCtx(e, n), y(n, {
      code: d.too_big,
      maximum: a.value,
      type: "number",
      inclusive: a.inclusive,
      exact: !1,
      message: a.message
    }), s.dirty()) : a.kind === "multipleOf" ? xa(e.data, a.value) !== 0 && (n = this._getOrReturnCtx(e, n), y(n, {
      code: d.not_multiple_of,
      multipleOf: a.value,
      message: a.message
    }), s.dirty()) : a.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), y(n, {
      code: d.not_finite,
      message: a.message
    }), s.dirty()) : T.assertNever(a);
    return {
      status: s.value,
      value: e.data
    };
  }
  gte(e, r) {
    return this.setLimit("min", e, !0, x.toString(r));
  }
  gt(e, r) {
    return this.setLimit("min", e, !1, x.toString(r));
  }
  lte(e, r) {
    return this.setLimit("max", e, !0, x.toString(r));
  }
  lt(e, r) {
    return this.setLimit("max", e, !1, x.toString(r));
  }
  setLimit(e, r, n, s) {
    return new Y({
      ...this._def,
      checks: [...this._def.checks, {
        kind: e,
        value: r,
        inclusive: n,
        message: x.toString(s)
      }]
    });
  }
  _addCheck(e) {
    return new Y({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: x.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: x.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: x.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: x.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: x.toString(e)
    });
  }
  multipleOf(e, r) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: x.toString(r)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: x.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const r of this._def.checks) r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const r of this._def.checks) r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find(e => e.kind === "int" || e.kind === "multipleOf" && T.isInteger(e.value));
  }
  get isFinite() {
    let e = null,
      r = null;
    for (const n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf") return !0;
      n.kind === "min" ? (r === null || n.value > r) && (r = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(r) && Number.isFinite(e);
  }
}
Y.create = t => new Y({
  checks: [],
  typeName: g.ZodNumber,
  coerce: t?.coerce || !1,
  ...w(t)
});
class Te extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = BigInt(e.data)), this._getType(e) !== h.bigint) {
      const n = this._getOrReturnCtx(e);
      return y(n, {
        code: d.invalid_type,
        expected: h.bigint,
        received: n.parsedType
      }), b;
    }
    return N(e.data);
  }
}
Te.create = t => {
  var e;
  return new Te({
    typeName: g.ZodBigInt,
    coerce: (e = t?.coerce) !== null && e !== void 0 ? e : !1,
    ...w(t)
  });
};
class Ee extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== h.boolean) {
      const n = this._getOrReturnCtx(e);
      return y(n, {
        code: d.invalid_type,
        expected: h.boolean,
        received: n.parsedType
      }), b;
    }
    return N(e.data);
  }
}
Ee.create = t => new Ee({
  typeName: g.ZodBoolean,
  coerce: t?.coerce || !1,
  ...w(t)
});
class ee extends _ {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== h.date) {
      const a = this._getOrReturnCtx(e);
      return y(a, {
        code: d.invalid_type,
        expected: h.date,
        received: a.parsedType
      }), b;
    }
    if (isNaN(e.data.getTime())) {
      const a = this._getOrReturnCtx(e);
      return y(a, {
        code: d.invalid_date
      }), b;
    }
    const n = new I();
    let s;
    for (const a of this._def.checks) a.kind === "min" ? e.data.getTime() < a.value && (s = this._getOrReturnCtx(e, s), y(s, {
      code: d.too_small,
      message: a.message,
      inclusive: !0,
      exact: !1,
      minimum: a.value,
      type: "date"
    }), n.dirty()) : a.kind === "max" ? e.data.getTime() > a.value && (s = this._getOrReturnCtx(e, s), y(s, {
      code: d.too_big,
      message: a.message,
      inclusive: !0,
      exact: !1,
      maximum: a.value,
      type: "date"
    }), n.dirty()) : T.assertNever(a);
    return {
      status: n.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new ee({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, r) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: x.toString(r)
    });
  }
  max(e, r) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: x.toString(r)
    });
  }
  get minDate() {
    let e = null;
    for (const r of this._def.checks) r.kind === "min" && (e === null || r.value > e) && (e = r.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const r of this._def.checks) r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    return e != null ? new Date(e) : null;
  }
}
ee.create = t => new ee({
  checks: [],
  coerce: t?.coerce || !1,
  typeName: g.ZodDate,
  ...w(t)
});
class Ve extends _ {
  _parse(e) {
    if (this._getType(e) !== h.symbol) {
      const n = this._getOrReturnCtx(e);
      return y(n, {
        code: d.invalid_type,
        expected: h.symbol,
        received: n.parsedType
      }), b;
    }
    return N(e.data);
  }
}
Ve.create = t => new Ve({
  typeName: g.ZodSymbol,
  ...w(t)
});
class ke extends _ {
  _parse(e) {
    if (this._getType(e) !== h.undefined) {
      const n = this._getOrReturnCtx(e);
      return y(n, {
        code: d.invalid_type,
        expected: h.undefined,
        received: n.parsedType
      }), b;
    }
    return N(e.data);
  }
}
ke.create = t => new ke({
  typeName: g.ZodUndefined,
  ...w(t)
});
class Ce extends _ {
  _parse(e) {
    if (this._getType(e) !== h.null) {
      const n = this._getOrReturnCtx(e);
      return y(n, {
        code: d.invalid_type,
        expected: h.null,
        received: n.parsedType
      }), b;
    }
    return N(e.data);
  }
}
Ce.create = t => new Ce({
  typeName: g.ZodNull,
  ...w(t)
});
class de extends _ {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return N(e.data);
  }
}
de.create = t => new de({
  typeName: g.ZodAny,
  ...w(t)
});
class K extends _ {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return N(e.data);
  }
}
K.create = t => new K({
  typeName: g.ZodUnknown,
  ...w(t)
});
class J extends _ {
  _parse(e) {
    const r = this._getOrReturnCtx(e);
    return y(r, {
      code: d.invalid_type,
      expected: h.never,
      received: r.parsedType
    }), b;
  }
}
J.create = t => new J({
  typeName: g.ZodNever,
  ...w(t)
});
class He extends _ {
  _parse(e) {
    if (this._getType(e) !== h.undefined) {
      const n = this._getOrReturnCtx(e);
      return y(n, {
        code: d.invalid_type,
        expected: h.void,
        received: n.parsedType
      }), b;
    }
    return N(e.data);
  }
}
He.create = t => new He({
  typeName: g.ZodVoid,
  ...w(t)
});
class $ extends _ {
  _parse(e) {
    const {
        ctx: r,
        status: n
      } = this._processInputParams(e),
      s = this._def;
    if (r.parsedType !== h.array) return y(r, {
      code: d.invalid_type,
      expected: h.array,
      received: r.parsedType
    }), b;
    if (s.exactLength !== null) {
      const o = r.data.length > s.exactLength.value,
        i = r.data.length < s.exactLength.value;
      (o || i) && (y(r, {
        code: o ? d.too_big : d.too_small,
        minimum: i ? s.exactLength.value : void 0,
        maximum: o ? s.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: s.exactLength.message
      }), n.dirty());
    }
    if (s.minLength !== null && r.data.length < s.minLength.value && (y(r, {
      code: d.too_small,
      minimum: s.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.minLength.message
    }), n.dirty()), s.maxLength !== null && r.data.length > s.maxLength.value && (y(r, {
      code: d.too_big,
      maximum: s.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.maxLength.message
    }), n.dirty()), r.common.async) return Promise.all([...r.data].map((o, i) => s.type._parseAsync(new U(r, o, r.path, i)))).then(o => I.mergeArray(n, o));
    const a = [...r.data].map((o, i) => s.type._parseSync(new U(r, o, r.path, i)));
    return I.mergeArray(n, a);
  }
  get element() {
    return this._def.type;
  }
  min(e, r) {
    return new $({
      ...this._def,
      minLength: {
        value: e,
        message: x.toString(r)
      }
    });
  }
  max(e, r) {
    return new $({
      ...this._def,
      maxLength: {
        value: e,
        message: x.toString(r)
      }
    });
  }
  length(e, r) {
    return new $({
      ...this._def,
      exactLength: {
        value: e,
        message: x.toString(r)
      }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
$.create = (t, e) => new $({
  type: t,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: g.ZodArray,
  ...w(e)
});
var Fe;
(function (t) {
  t.mergeShapes = (e, r) => ({
    ...e,
    ...r
    // second overwrites first
  });
})(Fe || (Fe = {}));
function ie(t) {
  if (t instanceof C) {
    const e = {};
    for (const r in t.shape) {
      const n = t.shape[r];
      e[r] = H.create(ie(n));
    }
    return new C({
      ...t._def,
      shape: () => e
    });
  } else return t instanceof $ ? $.create(ie(t.element)) : t instanceof H ? H.create(ie(t.unwrap())) : t instanceof re ? re.create(ie(t.unwrap())) : t instanceof W ? W.create(t.items.map(e => ie(e))) : t;
}
class C extends _ {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null) return this._cached;
    const e = this._def.shape(),
      r = T.objectKeys(e);
    return this._cached = {
      shape: e,
      keys: r
    };
  }
  _parse(e) {
    if (this._getType(e) !== h.object) {
      const u = this._getOrReturnCtx(e);
      return y(u, {
        code: d.invalid_type,
        expected: h.object,
        received: u.parsedType
      }), b;
    }
    const {
        status: n,
        ctx: s
      } = this._processInputParams(e),
      {
        shape: a,
        keys: o
      } = this._getCached(),
      i = [];
    if (!(this._def.catchall instanceof J && this._def.unknownKeys === "strip")) for (const u in s.data) o.includes(u) || i.push(u);
    const c = [];
    for (const u of o) {
      const l = a[u],
        f = s.data[u];
      c.push({
        key: {
          status: "valid",
          value: u
        },
        value: l._parse(new U(s, f, s.path, u)),
        alwaysSet: u in s.data
      });
    }
    if (this._def.catchall instanceof J) {
      const u = this._def.unknownKeys;
      if (u === "passthrough") for (const l of i) c.push({
        key: {
          status: "valid",
          value: l
        },
        value: {
          status: "valid",
          value: s.data[l]
        }
      });else if (u === "strict") i.length > 0 && (y(s, {
        code: d.unrecognized_keys,
        keys: i
      }), n.dirty());else if (u !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const u = this._def.catchall;
      for (const l of i) {
        const f = s.data[l];
        c.push({
          key: {
            status: "valid",
            value: l
          },
          value: u._parse(new U(s, f, s.path, l)
          //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: l in s.data
        });
      }
    }
    return s.common.async ? Promise.resolve().then(async () => {
      const u = [];
      for (const l of c) {
        const f = await l.key;
        u.push({
          key: f,
          value: await l.value,
          alwaysSet: l.alwaysSet
        });
      }
      return u;
    }).then(u => I.mergeObjectSync(n, u)) : I.mergeObjectSync(n, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return x.errToObj, new C({
      ...this._def,
      unknownKeys: "strict",
      ...(e !== void 0 ? {
        errorMap: (r, n) => {
          var s, a, o, i;
          const c = (o = (a = (s = this._def).errorMap) === null || a === void 0 ? void 0 : a.call(s, r, n).message) !== null && o !== void 0 ? o : n.defaultError;
          return r.code === "unrecognized_keys" ? {
            message: (i = x.errToObj(e).message) !== null && i !== void 0 ? i : c
          } : {
            message: c
          };
        }
      } : {})
    });
  }
  strip() {
    return new C({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new C({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new C({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new C({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => Fe.mergeShapes(this._def.shape(), e._def.shape()),
      typeName: g.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, r) {
    return this.augment({
      [e]: r
    });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new C({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const r = {};
    return T.objectKeys(e).forEach(n => {
      e[n] && this.shape[n] && (r[n] = this.shape[n]);
    }), new C({
      ...this._def,
      shape: () => r
    });
  }
  omit(e) {
    const r = {};
    return T.objectKeys(this.shape).forEach(n => {
      e[n] || (r[n] = this.shape[n]);
    }), new C({
      ...this._def,
      shape: () => r
    });
  }
  deepPartial() {
    return ie(this);
  }
  partial(e) {
    const r = {};
    return T.objectKeys(this.shape).forEach(n => {
      const s = this.shape[n];
      e && !e[n] ? r[n] = s : r[n] = s.optional();
    }), new C({
      ...this._def,
      shape: () => r
    });
  }
  required(e) {
    const r = {};
    return T.objectKeys(this.shape).forEach(n => {
      if (e && !e[n]) r[n] = this.shape[n];else {
        let a = this.shape[n];
        for (; a instanceof H;) a = a._def.innerType;
        r[n] = a;
      }
    }), new C({
      ...this._def,
      shape: () => r
    });
  }
  keyof() {
    return Fr(T.objectKeys(this.shape));
  }
}
C.create = (t, e) => new C({
  shape: () => t,
  unknownKeys: "strip",
  catchall: J.create(),
  typeName: g.ZodObject,
  ...w(e)
});
C.strictCreate = (t, e) => new C({
  shape: () => t,
  unknownKeys: "strict",
  catchall: J.create(),
  typeName: g.ZodObject,
  ...w(e)
});
C.lazycreate = (t, e) => new C({
  shape: t,
  unknownKeys: "strip",
  catchall: J.create(),
  typeName: g.ZodObject,
  ...w(e)
});
class Re extends _ {
  _parse(e) {
    const {
        ctx: r
      } = this._processInputParams(e),
      n = this._def.options;
    function s(a) {
      for (const i of a) if (i.result.status === "valid") return i.result;
      for (const i of a) if (i.result.status === "dirty") return r.common.issues.push(...i.ctx.common.issues), i.result;
      const o = a.map(i => new V(i.ctx.common.issues));
      return y(r, {
        code: d.invalid_union,
        unionErrors: o
      }), b;
    }
    if (r.common.async) return Promise.all(n.map(async a => {
      const o = {
        ...r,
        common: {
          ...r.common,
          issues: []
        },
        parent: null
      };
      return {
        result: await a._parseAsync({
          data: r.data,
          path: r.path,
          parent: o
        }),
        ctx: o
      };
    })).then(s);
    {
      let a;
      const o = [];
      for (const c of n) {
        const u = {
            ...r,
            common: {
              ...r.common,
              issues: []
            },
            parent: null
          },
          l = c._parseSync({
            data: r.data,
            path: r.path,
            parent: u
          });
        if (l.status === "valid") return l;
        l.status === "dirty" && !a && (a = {
          result: l,
          ctx: u
        }), u.common.issues.length && o.push(u.common.issues);
      }
      if (a) return r.common.issues.push(...a.ctx.common.issues), a.result;
      const i = o.map(c => new V(c));
      return y(r, {
        code: d.invalid_union,
        unionErrors: i
      }), b;
    }
  }
  get options() {
    return this._def.options;
  }
}
Re.create = (t, e) => new Re({
  options: t,
  typeName: g.ZodUnion,
  ...w(e)
});
const Ze = t => t instanceof Se ? Ze(t.schema) : t instanceof D ? Ze(t.innerType()) : t instanceof Ne ? [t.value] : t instanceof Q ? t.options : t instanceof Ie ? Object.keys(t.enum) : t instanceof Le ? Ze(t._def.innerType) : t instanceof ke ? [void 0] : t instanceof Ce ? [null] : null;
class it extends _ {
  _parse(e) {
    const {
      ctx: r
    } = this._processInputParams(e);
    if (r.parsedType !== h.object) return y(r, {
      code: d.invalid_type,
      expected: h.object,
      received: r.parsedType
    }), b;
    const n = this.discriminator,
      s = r.data[n],
      a = this.optionsMap.get(s);
    return a ? r.common.async ? a._parseAsync({
      data: r.data,
      path: r.path,
      parent: r
    }) : a._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }) : (y(r, {
      code: d.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [n]
    }), b);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(e, r, n) {
    const s = /* @__PURE__ */new Map();
    for (const a of r) {
      const o = Ze(a.shape[e]);
      if (!o) throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const i of o) {
        if (s.has(i)) throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(i)}`);
        s.set(i, a);
      }
    }
    return new it({
      typeName: g.ZodDiscriminatedUnion,
      discriminator: e,
      options: r,
      optionsMap: s,
      ...w(n)
    });
  }
}
function xt(t, e) {
  const r = G(t),
    n = G(e);
  if (t === e) return {
    valid: !0,
    data: t
  };
  if (r === h.object && n === h.object) {
    const s = T.objectKeys(e),
      a = T.objectKeys(t).filter(i => s.indexOf(i) !== -1),
      o = {
        ...t,
        ...e
      };
    for (const i of a) {
      const c = xt(t[i], e[i]);
      if (!c.valid) return {
        valid: !1
      };
      o[i] = c.data;
    }
    return {
      valid: !0,
      data: o
    };
  } else if (r === h.array && n === h.array) {
    if (t.length !== e.length) return {
      valid: !1
    };
    const s = [];
    for (let a = 0; a < t.length; a++) {
      const o = t[a],
        i = e[a],
        c = xt(o, i);
      if (!c.valid) return {
        valid: !1
      };
      s.push(c.data);
    }
    return {
      valid: !0,
      data: s
    };
  } else return r === h.date && n === h.date && +t == +e ? {
    valid: !0,
    data: t
  } : {
    valid: !1
  };
}
class Oe extends _ {
  _parse(e) {
    const {
        status: r,
        ctx: n
      } = this._processInputParams(e),
      s = (a, o) => {
        if (_t(a) || _t(o)) return b;
        const i = xt(a.value, o.value);
        return i.valid ? ((vt(a) || vt(o)) && r.dirty(), {
          status: r.value,
          value: i.data
        }) : (y(n, {
          code: d.invalid_intersection_types
        }), b);
      };
    return n.common.async ? Promise.all([this._def.left._parseAsync({
      data: n.data,
      path: n.path,
      parent: n
    }), this._def.right._parseAsync({
      data: n.data,
      path: n.path,
      parent: n
    })]).then(([a, o]) => s(a, o)) : s(this._def.left._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }), this._def.right._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }));
  }
}
Oe.create = (t, e, r) => new Oe({
  left: t,
  right: e,
  typeName: g.ZodIntersection,
  ...w(r)
});
class W extends _ {
  _parse(e) {
    const {
      status: r,
      ctx: n
    } = this._processInputParams(e);
    if (n.parsedType !== h.array) return y(n, {
      code: d.invalid_type,
      expected: h.array,
      received: n.parsedType
    }), b;
    if (n.data.length < this._def.items.length) return y(n, {
      code: d.too_small,
      minimum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), b;
    !this._def.rest && n.data.length > this._def.items.length && (y(n, {
      code: d.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), r.dirty());
    const a = [...n.data].map((o, i) => {
      const c = this._def.items[i] || this._def.rest;
      return c ? c._parse(new U(n, o, n.path, i)) : null;
    }).filter(o => !!o);
    return n.common.async ? Promise.all(a).then(o => I.mergeArray(r, o)) : I.mergeArray(r, a);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new W({
      ...this._def,
      rest: e
    });
  }
}
W.create = (t, e) => {
  if (!Array.isArray(t)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new W({
    items: t,
    typeName: g.ZodTuple,
    rest: null,
    ...w(e)
  });
};
class Pe extends _ {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const {
      status: r,
      ctx: n
    } = this._processInputParams(e);
    if (n.parsedType !== h.object) return y(n, {
      code: d.invalid_type,
      expected: h.object,
      received: n.parsedType
    }), b;
    const s = [],
      a = this._def.keyType,
      o = this._def.valueType;
    for (const i in n.data) s.push({
      key: a._parse(new U(n, i, n.path, i)),
      value: o._parse(new U(n, n.data[i], n.path, i))
    });
    return n.common.async ? I.mergeObjectAsync(r, s) : I.mergeObjectSync(r, s);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, r, n) {
    return r instanceof _ ? new Pe({
      keyType: e,
      valueType: r,
      typeName: g.ZodRecord,
      ...w(n)
    }) : new Pe({
      keyType: F.create(),
      valueType: e,
      typeName: g.ZodRecord,
      ...w(r)
    });
  }
}
class Je extends _ {
  _parse(e) {
    const {
      status: r,
      ctx: n
    } = this._processInputParams(e);
    if (n.parsedType !== h.map) return y(n, {
      code: d.invalid_type,
      expected: h.map,
      received: n.parsedType
    }), b;
    const s = this._def.keyType,
      a = this._def.valueType,
      o = [...n.data.entries()].map(([i, c], u) => ({
        key: s._parse(new U(n, i, n.path, [u, "key"])),
        value: a._parse(new U(n, c, n.path, [u, "value"]))
      }));
    if (n.common.async) {
      const i = /* @__PURE__ */new Map();
      return Promise.resolve().then(async () => {
        for (const c of o) {
          const u = await c.key,
            l = await c.value;
          if (u.status === "aborted" || l.status === "aborted") return b;
          (u.status === "dirty" || l.status === "dirty") && r.dirty(), i.set(u.value, l.value);
        }
        return {
          status: r.value,
          value: i
        };
      });
    } else {
      const i = /* @__PURE__ */new Map();
      for (const c of o) {
        const u = c.key,
          l = c.value;
        if (u.status === "aborted" || l.status === "aborted") return b;
        (u.status === "dirty" || l.status === "dirty") && r.dirty(), i.set(u.value, l.value);
      }
      return {
        status: r.value,
        value: i
      };
    }
  }
}
Je.create = (t, e, r) => new Je({
  valueType: e,
  keyType: t,
  typeName: g.ZodMap,
  ...w(r)
});
class te extends _ {
  _parse(e) {
    const {
      status: r,
      ctx: n
    } = this._processInputParams(e);
    if (n.parsedType !== h.set) return y(n, {
      code: d.invalid_type,
      expected: h.set,
      received: n.parsedType
    }), b;
    const s = this._def;
    s.minSize !== null && n.data.size < s.minSize.value && (y(n, {
      code: d.too_small,
      minimum: s.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.minSize.message
    }), r.dirty()), s.maxSize !== null && n.data.size > s.maxSize.value && (y(n, {
      code: d.too_big,
      maximum: s.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.maxSize.message
    }), r.dirty());
    const a = this._def.valueType;
    function o(c) {
      const u = /* @__PURE__ */new Set();
      for (const l of c) {
        if (l.status === "aborted") return b;
        l.status === "dirty" && r.dirty(), u.add(l.value);
      }
      return {
        status: r.value,
        value: u
      };
    }
    const i = [...n.data.values()].map((c, u) => a._parse(new U(n, c, n.path, u)));
    return n.common.async ? Promise.all(i).then(c => o(c)) : o(i);
  }
  min(e, r) {
    return new te({
      ...this._def,
      minSize: {
        value: e,
        message: x.toString(r)
      }
    });
  }
  max(e, r) {
    return new te({
      ...this._def,
      maxSize: {
        value: e,
        message: x.toString(r)
      }
    });
  }
  size(e, r) {
    return this.min(e, r).max(e, r);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
te.create = (t, e) => new te({
  valueType: t,
  minSize: null,
  maxSize: null,
  typeName: g.ZodSet,
  ...w(e)
});
class ue extends _ {
  constructor() {
    super(...arguments), this.validate = this.implement;
  }
  _parse(e) {
    const {
      ctx: r
    } = this._processInputParams(e);
    if (r.parsedType !== h.function) return y(r, {
      code: d.invalid_type,
      expected: h.function,
      received: r.parsedType
    }), b;
    function n(i, c) {
      return ze({
        data: i,
        path: r.path,
        errorMaps: [r.common.contextualErrorMap, r.schemaErrorMap, We(), xe].filter(u => !!u),
        issueData: {
          code: d.invalid_arguments,
          argumentsError: c
        }
      });
    }
    function s(i, c) {
      return ze({
        data: i,
        path: r.path,
        errorMaps: [r.common.contextualErrorMap, r.schemaErrorMap, We(), xe].filter(u => !!u),
        issueData: {
          code: d.invalid_return_type,
          returnTypeError: c
        }
      });
    }
    const a = {
        errorMap: r.common.contextualErrorMap
      },
      o = r.data;
    return this._def.returns instanceof fe ? N(async (...i) => {
      const c = new V([]),
        u = await this._def.args.parseAsync(i, a).catch(m => {
          throw c.addIssue(n(i, m)), c;
        }),
        l = await o(...u);
      return await this._def.returns._def.type.parseAsync(l, a).catch(m => {
        throw c.addIssue(s(l, m)), c;
      });
    }) : N((...i) => {
      const c = this._def.args.safeParse(i, a);
      if (!c.success) throw new V([n(i, c.error)]);
      const u = o(...c.data),
        l = this._def.returns.safeParse(u, a);
      if (!l.success) throw new V([s(u, l.error)]);
      return l.data;
    });
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...e) {
    return new ue({
      ...this._def,
      args: W.create(e).rest(K.create())
    });
  }
  returns(e) {
    return new ue({
      ...this._def,
      returns: e
    });
  }
  implement(e) {
    return this.parse(e);
  }
  strictImplement(e) {
    return this.parse(e);
  }
  static create(e, r, n) {
    return new ue({
      args: e || W.create([]).rest(K.create()),
      returns: r || K.create(),
      typeName: g.ZodFunction,
      ...w(n)
    });
  }
}
class Se extends _ {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const {
      ctx: r
    } = this._processInputParams(e);
    return this._def.getter()._parse({
      data: r.data,
      path: r.path,
      parent: r
    });
  }
}
Se.create = (t, e) => new Se({
  getter: t,
  typeName: g.ZodLazy,
  ...w(e)
});
class Ne extends _ {
  _parse(e) {
    if (e.data !== this._def.value) {
      const r = this._getOrReturnCtx(e);
      return y(r, {
        received: r.data,
        code: d.invalid_literal,
        expected: this._def.value
      }), b;
    }
    return {
      status: "valid",
      value: e.data
    };
  }
  get value() {
    return this._def.value;
  }
}
Ne.create = (t, e) => new Ne({
  value: t,
  typeName: g.ZodLiteral,
  ...w(e)
});
function Fr(t, e) {
  return new Q({
    values: t,
    typeName: g.ZodEnum,
    ...w(e)
  });
}
class Q extends _ {
  _parse(e) {
    if (typeof e.data != "string") {
      const r = this._getOrReturnCtx(e),
        n = this._def.values;
      return y(r, {
        expected: T.joinValues(n),
        received: r.parsedType,
        code: d.invalid_type
      }), b;
    }
    if (this._def.values.indexOf(e.data) === -1) {
      const r = this._getOrReturnCtx(e),
        n = this._def.values;
      return y(r, {
        received: r.data,
        code: d.invalid_enum_value,
        options: n
      }), b;
    }
    return N(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const r of this._def.values) e[r] = r;
    return e;
  }
  get Values() {
    const e = {};
    for (const r of this._def.values) e[r] = r;
    return e;
  }
  get Enum() {
    const e = {};
    for (const r of this._def.values) e[r] = r;
    return e;
  }
  extract(e) {
    return Q.create(e);
  }
  exclude(e) {
    return Q.create(this.options.filter(r => !e.includes(r)));
  }
}
Q.create = Fr;
class Ie extends _ {
  _parse(e) {
    const r = T.getValidEnumValues(this._def.values),
      n = this._getOrReturnCtx(e);
    if (n.parsedType !== h.string && n.parsedType !== h.number) {
      const s = T.objectValues(r);
      return y(n, {
        expected: T.joinValues(s),
        received: n.parsedType,
        code: d.invalid_type
      }), b;
    }
    if (r.indexOf(e.data) === -1) {
      const s = T.objectValues(r);
      return y(n, {
        received: n.data,
        code: d.invalid_enum_value,
        options: s
      }), b;
    }
    return N(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Ie.create = (t, e) => new Ie({
  values: t,
  typeName: g.ZodNativeEnum,
  ...w(e)
});
class fe extends _ {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const {
      ctx: r
    } = this._processInputParams(e);
    if (r.parsedType !== h.promise && r.common.async === !1) return y(r, {
      code: d.invalid_type,
      expected: h.promise,
      received: r.parsedType
    }), b;
    const n = r.parsedType === h.promise ? r.data : Promise.resolve(r.data);
    return N(n.then(s => this._def.type.parseAsync(s, {
      path: r.path,
      errorMap: r.common.contextualErrorMap
    })));
  }
}
fe.create = (t, e) => new fe({
  type: t,
  typeName: g.ZodPromise,
  ...w(e)
});
class D extends _ {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === g.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const {
        status: r,
        ctx: n
      } = this._processInputParams(e),
      s = this._def.effect || null;
    if (s.type === "preprocess") {
      const o = s.transform(n.data);
      return n.common.async ? Promise.resolve(o).then(i => this._def.schema._parseAsync({
        data: i,
        path: n.path,
        parent: n
      })) : this._def.schema._parseSync({
        data: o,
        path: n.path,
        parent: n
      });
    }
    const a = {
      addIssue: o => {
        y(n, o), o.fatal ? r.abort() : r.dirty();
      },
      get path() {
        return n.path;
      }
    };
    if (a.addIssue = a.addIssue.bind(a), s.type === "refinement") {
      const o = i => {
        const c = s.refinement(i, a);
        if (n.common.async) return Promise.resolve(c);
        if (c instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return i;
      };
      if (n.common.async === !1) {
        const i = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return i.status === "aborted" ? b : (i.status === "dirty" && r.dirty(), o(i.value), {
          status: r.value,
          value: i.value
        });
      } else return this._def.schema._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      }).then(i => i.status === "aborted" ? b : (i.status === "dirty" && r.dirty(), o(i.value).then(() => ({
        status: r.value,
        value: i.value
      }))));
    }
    if (s.type === "transform") if (n.common.async === !1) {
      const o = this._def.schema._parseSync({
        data: n.data,
        path: n.path,
        parent: n
      });
      if (!qe(o)) return o;
      const i = s.transform(o.value, a);
      if (i instanceof Promise) throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
      return {
        status: r.value,
        value: i
      };
    } else return this._def.schema._parseAsync({
      data: n.data,
      path: n.path,
      parent: n
    }).then(o => qe(o) ? Promise.resolve(s.transform(o.value, a)).then(i => ({
      status: r.value,
      value: i
    })) : o);
    T.assertNever(s);
  }
}
D.create = (t, e, r) => new D({
  schema: t,
  typeName: g.ZodEffects,
  effect: e,
  ...w(r)
});
D.createWithPreprocess = (t, e, r) => new D({
  schema: e,
  effect: {
    type: "preprocess",
    transform: t
  },
  typeName: g.ZodEffects,
  ...w(r)
});
class H extends _ {
  _parse(e) {
    return this._getType(e) === h.undefined ? N(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
H.create = (t, e) => new H({
  innerType: t,
  typeName: g.ZodOptional,
  ...w(e)
});
class re extends _ {
  _parse(e) {
    return this._getType(e) === h.null ? N(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
re.create = (t, e) => new re({
  innerType: t,
  typeName: g.ZodNullable,
  ...w(e)
});
class Le extends _ {
  _parse(e) {
    const {
      ctx: r
    } = this._processInputParams(e);
    let n = r.data;
    return r.parsedType === h.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
      data: n,
      path: r.path,
      parent: r
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Le.create = (t, e) => new Le({
  innerType: t,
  typeName: g.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...w(e)
});
class Ge extends _ {
  _parse(e) {
    const {
        ctx: r
      } = this._processInputParams(e),
      n = this._def.innerType._parse({
        data: r.data,
        path: r.path,
        parent: {
          ...r,
          common: {
            ...r.common,
            issues: []
            // don't collect issues from inner type
          }
        }
      });
    return Be(n) ? n.then(s => ({
      status: "valid",
      value: s.status === "valid" ? s.value : this._def.catchValue()
    })) : {
      status: "valid",
      value: n.status === "valid" ? n.value : this._def.catchValue()
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
Ge.create = (t, e) => new Ge({
  innerType: t,
  typeName: g.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...w(e)
});
class Ye extends _ {
  _parse(e) {
    if (this._getType(e) !== h.nan) {
      const n = this._getOrReturnCtx(e);
      return y(n, {
        code: d.invalid_type,
        expected: h.nan,
        received: n.parsedType
      }), b;
    }
    return {
      status: "valid",
      value: e.data
    };
  }
}
Ye.create = t => new Ye({
  typeName: g.ZodNaN,
  ...w(t)
});
const Ta = Symbol("zod_brand");
class Jr extends _ {
  _parse(e) {
    const {
        ctx: r
      } = this._processInputParams(e),
      n = r.data;
    return this._def.type._parse({
      data: n,
      path: r.path,
      parent: r
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class Ae extends _ {
  _parse(e) {
    const {
      status: r,
      ctx: n
    } = this._processInputParams(e);
    if (n.common.async) return (async () => {
      const a = await this._def.in._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      });
      return a.status === "aborted" ? b : a.status === "dirty" ? (r.dirty(), Hr(a.value)) : this._def.out._parseAsync({
        data: a.value,
        path: n.path,
        parent: n
      });
    })();
    {
      const s = this._def.in._parseSync({
        data: n.data,
        path: n.path,
        parent: n
      });
      return s.status === "aborted" ? b : s.status === "dirty" ? (r.dirty(), {
        status: "dirty",
        value: s.value
      }) : this._def.out._parseSync({
        data: s.value,
        path: n.path,
        parent: n
      });
    }
  }
  static create(e, r) {
    return new Ae({
      in: e,
      out: r,
      typeName: g.ZodPipeline
    });
  }
}
const Gr = (t, e = {}, r) => t ? de.create().superRefine((n, s) => {
    if (!t(n)) {
      const a = typeof e == "function" ? e(n) : e,
        o = typeof a == "string" ? {
          message: a
        } : a;
      s.addIssue({
        code: "custom",
        ...o,
        fatal: r
      });
    }
  }) : de.create(),
  Ea = {
    object: C.lazycreate
  };
var g;
(function (t) {
  t.ZodString = "ZodString", t.ZodNumber = "ZodNumber", t.ZodNaN = "ZodNaN", t.ZodBigInt = "ZodBigInt", t.ZodBoolean = "ZodBoolean", t.ZodDate = "ZodDate", t.ZodSymbol = "ZodSymbol", t.ZodUndefined = "ZodUndefined", t.ZodNull = "ZodNull", t.ZodAny = "ZodAny", t.ZodUnknown = "ZodUnknown", t.ZodNever = "ZodNever", t.ZodVoid = "ZodVoid", t.ZodArray = "ZodArray", t.ZodObject = "ZodObject", t.ZodUnion = "ZodUnion", t.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", t.ZodIntersection = "ZodIntersection", t.ZodTuple = "ZodTuple", t.ZodRecord = "ZodRecord", t.ZodMap = "ZodMap", t.ZodSet = "ZodSet", t.ZodFunction = "ZodFunction", t.ZodLazy = "ZodLazy", t.ZodLiteral = "ZodLiteral", t.ZodEnum = "ZodEnum", t.ZodEffects = "ZodEffects", t.ZodNativeEnum = "ZodNativeEnum", t.ZodOptional = "ZodOptional", t.ZodNullable = "ZodNullable", t.ZodDefault = "ZodDefault", t.ZodCatch = "ZodCatch", t.ZodPromise = "ZodPromise", t.ZodBranded = "ZodBranded", t.ZodPipeline = "ZodPipeline";
})(g || (g = {}));
const ka = (t, e = {
    message: `Input not instance of ${t.name}`
  }) => Gr(r => r instanceof t, e, !0),
  Yr = F.create,
  Qr = Y.create,
  Ca = Ye.create,
  Ra = Te.create,
  Xr = Ee.create,
  Oa = ee.create,
  Pa = Ve.create,
  Sa = ke.create,
  Na = Ce.create,
  Ia = de.create,
  La = K.create,
  Aa = J.create,
  Ma = He.create,
  ja = $.create,
  $a = C.create,
  Da = C.strictCreate,
  Za = Re.create,
  Ua = it.create,
  Wa = Oe.create,
  za = W.create,
  qa = Pe.create,
  Ba = Je.create,
  Va = te.create,
  Ha = ue.create,
  Fa = Se.create,
  Ja = Ne.create,
  Ga = Q.create,
  Ya = Ie.create,
  Qa = fe.create,
  rr = D.create,
  Xa = H.create,
  Ka = re.create,
  eo = D.createWithPreprocess,
  to = Ae.create,
  ro = () => Yr().optional(),
  no = () => Qr().optional(),
  so = () => Xr().optional(),
  ao = {
    string: t => F.create({
      ...t,
      coerce: !0
    }),
    number: t => Y.create({
      ...t,
      coerce: !0
    }),
    boolean: t => Ee.create({
      ...t,
      coerce: !0
    }),
    bigint: t => Te.create({
      ...t,
      coerce: !0
    }),
    date: t => ee.create({
      ...t,
      coerce: !0
    })
  },
  oo = b;
var p = /* @__PURE__ */Object.freeze({
  __proto__: null,
  defaultErrorMap: xe,
  setErrorMap: ma,
  getErrorMap: We,
  makeIssue: ze,
  EMPTY_PATH: ya,
  addIssueToContext: y,
  ParseStatus: I,
  INVALID: b,
  DIRTY: Hr,
  OK: N,
  isAborted: _t,
  isDirty: vt,
  isValid: qe,
  isAsync: Be,
  get util() {
    return T;
  },
  ZodParsedType: h,
  getParsedType: G,
  ZodType: _,
  ZodString: F,
  ZodNumber: Y,
  ZodBigInt: Te,
  ZodBoolean: Ee,
  ZodDate: ee,
  ZodSymbol: Ve,
  ZodUndefined: ke,
  ZodNull: Ce,
  ZodAny: de,
  ZodUnknown: K,
  ZodNever: J,
  ZodVoid: He,
  ZodArray: $,
  get objectUtil() {
    return Fe;
  },
  ZodObject: C,
  ZodUnion: Re,
  ZodDiscriminatedUnion: it,
  ZodIntersection: Oe,
  ZodTuple: W,
  ZodRecord: Pe,
  ZodMap: Je,
  ZodSet: te,
  ZodFunction: ue,
  ZodLazy: Se,
  ZodLiteral: Ne,
  ZodEnum: Q,
  ZodNativeEnum: Ie,
  ZodPromise: fe,
  ZodEffects: D,
  ZodTransformer: D,
  ZodOptional: H,
  ZodNullable: re,
  ZodDefault: Le,
  ZodCatch: Ge,
  ZodNaN: Ye,
  BRAND: Ta,
  ZodBranded: Jr,
  ZodPipeline: Ae,
  custom: Gr,
  Schema: _,
  ZodSchema: _,
  late: Ea,
  get ZodFirstPartyTypeKind() {
    return g;
  },
  coerce: ao,
  any: Ia,
  array: ja,
  bigint: Ra,
  boolean: Xr,
  date: Oa,
  discriminatedUnion: Ua,
  effect: rr,
  enum: Ga,
  function: Ha,
  instanceof: ka,
  intersection: Wa,
  lazy: Fa,
  literal: Ja,
  map: Ba,
  nan: Ca,
  nativeEnum: Ya,
  never: Aa,
  null: Na,
  nullable: Ka,
  number: Qr,
  object: $a,
  oboolean: so,
  onumber: no,
  optional: Xa,
  ostring: ro,
  pipeline: to,
  preprocess: eo,
  promise: Qa,
  record: qa,
  set: Va,
  strictObject: Da,
  string: Yr,
  symbol: Pa,
  transformer: rr,
  tuple: za,
  undefined: Sa,
  union: Za,
  unknown: La,
  void: Ma,
  NEVER: oo,
  ZodIssueCode: d,
  quotelessJson: ha,
  ZodError: V
});
const Kr = /^0x[0-9a-f]+$/i,
  en = /^\d+$/,
  io = p.string().nonempty("The short string cannot be empty").max(31, "The short string cannot exceed 31 characters").refine(t => !Kr.test(t), "The shortString should not be a hex string").refine(t => !en.test(t), "The shortString should not be an integer string"),
  _e = p.union([p.string().regex(Kr, "Only hex, integers and bigint are supported in calldata"), p.string().regex(en, "Only hex, integers and bigint are supported in calldata"), io, p.number().int("Only hex, integers and bigint are supported in calldata"), p.bigint()]),
  tn = p.object({
    contractAddress: p.string(),
    entrypoint: p.string(),
    calldata: p.array(_e.or(p.array(_e))).optional()
  }),
  co = p.array(tn).nonempty(),
  uo = p.object({
    types: p.record(p.array(p.union([p.object({
      name: p.string(),
      type: p.string()
    }), p.object({
      name: p.string(),
      type: p.literal("merkletree"),
      contains: p.string()
    })]))),
    primaryType: p.string(),
    domain: p.record(p.unknown()),
    message: p.record(p.unknown())
  }),
  nr = {
    enable: p.tuple([p.object({
      starknetVersion: p.union([p.literal("v4"), p.literal("v5")]).optional()
    }).optional()]).or(p.tuple([])),
    addStarknetChain: p.tuple([p.object({
      id: p.string(),
      chainId: p.string(),
      chainName: p.string(),
      rpcUrls: p.array(p.string()).optional(),
      nativeCurrency: p.object({
        name: p.string(),
        symbol: p.string(),
        decimals: p.number()
      }).optional(),
      blockExplorerUrls: p.array(p.string()).optional()
    })]),
    switchStarknetChain: p.tuple([p.object({
      chainId: p.string()
    })]),
    watchAsset: p.tuple([p.object({
      type: p.literal("ERC20"),
      options: p.object({
        address: p.string(),
        symbol: p.string().optional(),
        decimals: p.number().optional(),
        image: p.string().optional(),
        name: p.string().optional()
      })
    })]),
    execute: p.tuple([co.or(tn), p.object({
      nonce: _e.optional(),
      maxFee: _e.optional(),
      version: _e.optional()
    }).optional()]),
    signMessage: p.tuple([uo])
  },
  j = ts.create({
    isServer: !1,
    allowOutsideOfServer: !0
  });
let Tt = cr,
  Et = "",
  rn = "";
const ve = ({
  width: t = 775,
  height: e = 385,
  origin: r,
  location: n,
  atLeftBottom: s = !1
}) => {
  const a = window?.outerWidth ?? window?.innerWidth ?? window?.screen.width ?? 0,
    o = window?.outerHeight ?? window?.innerHeight ?? window?.screen.height ?? 0,
    i = window?.screenLeft ?? window?.screenX ?? 0,
    c = window?.screenTop ?? window?.screenY ?? 0,
    u = s ? 0 : i + a / 2 - t / 2,
    l = s ? window.screen.availHeight + 10 : c + o / 2 - e / 2;
  Tt = r ?? Tt, Et = n ?? Et, rn = `width=${t},height=${e},top=${l},left=${u},toolbar=no,menubar=no,scrollbars=no,location=no,status=no,popup=1`;
};
j.router({
  authorize: j.procedure.output(p.boolean()).mutation(async () => !0),
  connect: j.procedure.mutation(async () => ""),
  enable: j.procedure.output(p.string()).mutation(async () => ""),
  execute: j.procedure.input(nr.execute).output(p.string()).mutation(async () => ""),
  signMessage: j.procedure.input(nr.signMessage).output(p.string().array()).mutation(async () => []),
  getLoginStatus: j.procedure.output(p.object({
    isLoggedIn: p.boolean(),
    hasSession: p.boolean().optional(),
    isPreauthorized: p.boolean().optional()
  })).mutation(async () => ({
    isLoggedIn: !0
  })),
  addStarknetChain: j.procedure.mutation(t => {
    throw Error("not implemented");
  }),
  switchStarknetChain: j.procedure.mutation(t => {
    throw Error("not implemented");
  }),
  watchAsset: j.procedure.mutation(t => {
    throw Error("not implemented");
  }),
  updateModal: j.procedure.subscription(async () => {})
});
const yt = ({
    iframe: t
  }) => $n({
    links: [In({
      enabled: e => process.env.NODE_ENV === "development" && typeof window < "u" || process.env.NODE_ENV === "development" && e.direction === "down" && e.result instanceof Error
    }), xn({
      condition(e) {
        if (!t && e.type === "subscription") throw new Error("subscription is not supported without an iframe window");
        return !!t;
      },
      true: bt.windowLink({
        window,
        postWindow: t,
        postOrigin: "*"
      }),
      false: bt.popupLink({
        listenWindow: window,
        createPopup: () => {
          let e = null;
          const r = document.createElement("button");
          if (r.style.display = "none", r.addEventListener("click", () => {
            e = window.open(`${Tt}${Et}`, "popup", rn);
          }), r.click(), (async () => {
            for (; !e;) await new Promise(n => setTimeout(n, 100));
          })(), !e) throw new Error("Could not open popup");
          return e;
        },
        postOrigin: "*"
      })
    })]
  }),
  lo = 385,
  fo = 775,
  po = 385,
  ho = 440,
  mo = 886,
  yo = 562;
class sr {
  async getPubKey() {
    throw new Error("Method not implemented");
  }
  async signMessage() {
    throw new Error("Method not implemented");
  }
  async signTransaction() {
    throw new Error("Method not implemented");
  }
  async signDeclareTransaction() {
    throw new Error("Method not implemented");
  }
  async signDeployAccountTransaction() {
    throw new Error("Method not implemented");
  }
}
class go extends _starknet.Account {
  constructor(r, n, s) {
    super(r, n, new sr());
    ae(this, "signer", new sr());
    ae(this, "execute", async (r, n, s = {}) => {
      try {
        ve({
          width: lo,
          height: fo,
          location: "/review"
        }), Array.isArray(r) && r[0] && r[0].entrypoint === "use_offchain_session" && ve({
          width: 1,
          height: 1,
          location: "/executeSessionTx",
          atLeftBottom: !0
        });
        const a = n === void 0 || Array.isArray(n) ? s : n;
        return {
          transaction_hash: await this.proxyLink.execute.mutate([r, a])
        };
      } catch (a) {
        throw a instanceof Error ? new Error(a.message) : new Error("Error while execute a transaction");
      }
    });
    ae(this, "signMessage", async r => {
      try {
        return ve({
          width: po,
          height: ho,
          location: "/signMessage"
        }), await this.proxyLink.signMessage.mutate([r]);
      } catch (n) {
        throw n instanceof Error ? new Error(n.message) : new Error("Error while sign a message");
      }
    });
    this.address = n, this.proxyLink = s;
  }
}
const je = [],
  bo = (t, e, r) => {
    const n = {
      ...t,
      isConnected: !1,
      provider: e,
      getLoginStatus: () => r.getLoginStatus.mutate(),
      async request(s) {
        switch (s.type) {
          case "wallet_addStarknetChain":
            return await r.addStarknetChain.mutate();
          case "wallet_switchStarknetChain":
            return await r.switchStarknetChain.mutate();
          case "wallet_watchAsset":
            return await r.watchAsset.mutate();
          default:
            throw new Error("not implemented");
        }
      },
      async enable(s) {
        if (s?.starknetVersion !== "v4") throw Error("not implemented");
        try {
          ve({
            width: mo,
            height: yo,
            location: "/interstitialLogin"
          });
          const o = await r.enable.mutate();
          return await wo(n, e, r, o), [o];
        } catch (a) {
          throw a instanceof Error ? new Error(a.message) : new Error("Unknow error on enable wallet");
        }
      },
      async isPreauthorized() {
        const {
          isLoggedIn: s,
          isPreauthorized: a
        } = await r.getLoginStatus.mutate();
        return !!(s && a);
      },
      on: (s, a) => {
        if (s === "accountsChanged") je.push({
          type: s,
          handler: a
        });else if (s === "networkChanged") je.push({
          type: s,
          handler: a
        });else throw new Error(`Unknwown event: ${s}`);
      },
      off: (s, a) => {
        if (s !== "accountsChanged" && s !== "networkChanged") throw new Error(`Unknwown event: ${s}`);
        const o = je.findIndex(i => i.type === s && i.handler === a);
        o >= 0 && je.splice(o, 1);
      }
    };
    return n;
  };
async function wo(t, e, r, n) {
  if (t.isConnected) return t;
  const a = {
    isConnected: !0,
    chainId: await e.getChainId(),
    selectedAddress: n,
    account: new go(e, n, r),
    provider: e
  };
  return Object.assign(t, a);
}
const _o = t => {
    t.style.position = "fixed", t.style.top = "50%", t.style.left = "50%", t.style.transform = "translate(-50%, -50%)", t.style.width = "380px", t.style.height = "420px", t.style.border = "none", t.style.borderRadius = "40px", t.style.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.5)";
    const e = document.createElement("div");
    return e.style.display = "none", e.style.position = "fixed", e.style.top = "0", e.style.left = "0", e.style.right = "0", e.style.bottom = "0", e.style.backgroundColor = "rgba(0, 0, 0, 0.5)", e.style.zIndex = "99999", e.style.backdropFilter = "blur(4px)", e.appendChild(t), e;
  },
  vo = t => {
    t.style.display = "block";
  },
  xo = t => {
    t.style.display = "none";
  },
  To = (t, e) => {
    t.style.height = `min(${e || 420}px, 100%)`;
  },
  Eo = async (t, e) => {
    const r = new URL(t);
    r.pathname = "/iframes/comms", t = r.toString();
    const n = document.createElement("iframe");
    n.src = t, n.loading = "eager", n.sandbox.add("allow-scripts", "allow-same-origin", "allow-forms", "allow-top-navigation", "allow-popups"), n.allow = "clipboard-write", n.id = "argent-webwallet-iframe";
    const s = _o(n);
    return s.style.display = e ? "block" : "none", s.id = "argent-webwallet-modal", window.document.body.appendChild(s), await new Promise((a, o) => {
      const i = setTimeout(() => o(new Error("Timeout while loading an iframe")), 2e4);
      n.addEventListener("load", async () => {
        clearTimeout(i), a();
      });
    }), {
      iframe: n,
      modal: s
    };
  };
function ko(t) {
  const e = (0, _publicRcpNodesBe.g)();
  try {
    const {
      origin: r
    } = new URL(t);
    if (r.includes("localhost") || r.includes("127.0.0.1") || r.includes("hydrogen")) return e.testnet;
    if (r.includes("staging") || r.includes("argent.xyz")) return e.mainnet;
  } catch {
    console.warn("Could not determine rpc nodeUrl from target URL, defaulting to mainnet");
  }
  return e.mainnet;
}
const gt = async (t, e, r, n) => {
    const s = typeof window < "u" ? window : void 0;
    if (!s) throw new Error("window is not defined");
    const a = ko(t),
      o = r ?? new _starknet.RpcProvider({
        nodeUrl: a
      }),
      i = bo({
        host: s.location.origin,
        id: "argentWebWallet",
        icon: "https://www.argent.xyz/favicon.ico",
        name: "Argent Web Wallet",
        version: "1.0.0"
      }, o, e);
    if (n) {
      const {
        iframe: c,
        modal: u
      } = n;
      e.updateModal.subscribe.apply(null, [void 0, {
        onData(l) {
          switch (l.action) {
            case "show":
              vo(u);
              break;
            case "hide":
              xo(u);
              break;
            case "updateHeight":
              To(c, l.height);
          }
        }
      }]);
    }
    return i;
  },
  ce = _starknet.constants.NetworkName,
  Co = ce.SN_SEPOLIA;
function Ro(t) {
  try {
    const {
      origin: e
    } = new URL(t);
    if (e.includes("localhost") || e.includes("127.0.0.1")) return Co;
    if (e.includes("hydrogen")) return ce.SN_SEPOLIA;
    if (e.includes("staging")) return ce.SN_MAIN;
    if (e.includes("dev")) return ce.SN_SEPOLIA;
    if (e.includes("argent.xyz")) return ce.SN_MAIN;
  } catch {
    console.warn("Could not determine network from target URL, defaulting to mainnet-alpha");
  }
  return ce.SN_MAIN;
}
const ar = "allowed-dapps",
  Oo = async t => {
    const e = t === _starknet.constants.NetworkName.SN_MAIN ? mn : hn;
    try {
      const n = await (await caches.open(ar)).match(e);
      if (n) {
        const u = parseInt(n.headers.get("X-Cache-Timestamp"), 10);
        if ((( /* @__PURE__ */new Date()).getTime() - u) / (1e3 * 60 * 60) < 24) return n.json();
      }
      const s = await fetch(e),
        a = new Headers(s.headers);
      a.set("X-Cache-Timestamp", ( /* @__PURE__ */new Date()).getTime().toString());
      const o = await s.json(),
        i = new Response(JSON.stringify(o), {
          status: s.status,
          statusText: s.statusText,
          headers: a
        });
      return await (await caches.open(ar)).put(e, i), o;
    } catch (r) {
      throw new Error(r);
    }
  },
  Po = async t => new Promise(e => {
    if (!t) return e(!1);
    try {
      navigator.webkitTemporaryStorage.queryUsageAndQuota((n, s) => {
        e(Math.round(s / (1024 * 1024)) < Math.round((performance?.memory?.jsHeapSizeLimit ?? 1073741824) / (1024 * 1024)) * 2);
      }, () => e(!1));
    } catch {
      e(!1);
    }
  }),
  So = async (t, e) => {
    const {
        userAgent: r
      } = navigator,
      n = !!(navigator.vendor && navigator.vendor.indexOf("Google") === 0 && navigator.brave === void 0 && !r.match(/Edg/) && !r.match(/OPR/)),
      s = await Po(n);
    if (!n || s) {
      const i = yt({});
      return await gt(t, i, e, void 0);
    }
    const a = Ro(t),
      {
        allowedDapps: o
      } = await Oo(a);
    if (o.includes(window.location.hostname)) {
      const i = "argent-webwallet-modal",
        c = "argent-webwallet-iframe",
        u = document.getElementById(i),
        l = document.getElementById(c);
      u && u && l && (u.remove(), l.remove());
      const {
          iframe: f,
          modal: m
        } = await Eo(t, !1),
        v = yt({
          iframe: f.contentWindow ?? void 0
        });
      return await v.authorize.mutate(), await gt(t, v, e, {
        modal: m,
        iframe: f
      });
    } else {
      const i = yt({});
      return await gt(t, i, e, void 0);
    }
  };
let M = null;
class jo extends _lastConnectedB964dc.C {
  constructor(r = {}) {
    super();
    ae(this, "_wallet", null);
    ae(this, "_options");
    this._options = r;
  }
  available() {
    return !0;
  }
  async ready() {
    return M ? (this._wallet = M, this._wallet.isPreauthorized()) : (this._wallet = null, !1);
  }
  get id() {
    return this._wallet = M, this._wallet?.id || "argentWebWallet";
  }
  get name() {
    return this._wallet = M, this._wallet?.name || "Argent Web Wallet";
  }
  get icon() {
    return {
      light: Ut,
      dark: Ut
    };
  }
  get wallet() {
    if (!this._wallet) throw new _lastConnectedB964dc.a();
    return this._wallet;
  }
  get title() {
    return "Email";
  }
  get subtitle() {
    return "Powered by Argent";
  }
  async connect() {
    if (await this.ensureWallet(), !this._wallet) throw new _lastConnectedB964dc.b();
    try {
      await this._wallet.enable({
        starknetVersion: "v4"
      });
    } catch (s) {
      throw console.log(s), new _lastConnectedB964dc.U();
    }
    if (!this._wallet.isConnected) throw new _lastConnectedB964dc.U();
    const r = this._wallet.account,
      n = await this.chainId();
    return {
      account: r.address,
      chainId: n
    };
  }
  async disconnect() {
    if (!this.available() && !this._wallet) throw new _lastConnectedB964dc.b();
    if (!this._wallet?.isConnected) throw new _lastConnectedB964dc.d();
    M = null, this._wallet = M, (0, _lastConnectedB964dc.r)();
  }
  async account() {
    if (this._wallet = M, !this._wallet || !this._wallet.account) throw new _lastConnectedB964dc.a();
    return this._wallet.account;
  }
  async chainId() {
    if (!this._wallet || !this.wallet.account || !this._wallet.provider) throw new _lastConnectedB964dc.a();
    const r = await this._wallet.provider.getChainId();
    return BigInt(r);
  }
  async initEventListener(r) {
    if (this._wallet = M, !this._wallet) throw new _lastConnectedB964dc.a();
    this._wallet.on("accountsChanged", r);
  }
  async removeEventListener(r) {
    if (this._wallet = M, !this._wallet) throw new _lastConnectedB964dc.a();
    this._wallet.off("accountsChanged", r), M = null, this._wallet = null;
  }
  async ensureWallet() {
    const r = this._options.url || cr,
      n = this._options.provider;
    ve({
      origin: r,
      location: "/interstitialLogin"
    }), M = (await So(r, n)) ?? null, this._wallet = M;
  }
}
exports.W = jo;

}).call(this)}).call(this,require('_process'))
},{"./lastConnected-b964dc30.js":12,"./publicRcpNodes-be041588.js":14,"_process":1,"starknet":undefined}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "InjectedConnector", {
  enumerable: true,
  get: function () {
    return _index25202aca.I;
  }
});
require("starknet");
require("./lastConnected-b964dc30.js");
var _index25202aca = require("./index-25202aca.js");

},{"./index-25202aca.js":4,"./lastConnected-b964dc30.js":12,"starknet":undefined}],11:[function(require,module,exports){
(function (global){(function (){
"use strict";var L=Object.defineProperty;var O=(o,i,s)=>i in o?L(o,i,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[i]=s;var h=(o,i,s)=>(O(o,typeof i!="symbol"?i+"":i,s),s);class j extends Error{constructor(){super(...arguments);h(this,"name","ConnectorNotConnectedError");h(this,"message","Connector not connected")}}class N extends Error{constructor(){super(...arguments);h(this,"name","ConnectorNotFoundError");h(this,"message","Connector not found")}}class k extends Error{constructor(){super(...arguments);h(this,"name","UserRejectedRequestError");h(this,"message","User rejected request")}}class S extends Error{constructor(){super(...arguments);h(this,"name","UserNotConnectedError");h(this,"message","User not connected")}}var U=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function b(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}function A(o){if(o.__esModule)return o;var i=o.default;if(typeof i=="function"){var s=function d(){if(this instanceof d){var y=[null];y.push.apply(y,arguments);var C=Function.bind.apply(i,y);return new C}return i.apply(this,arguments)};s.prototype=i.prototype}else s={};return Object.defineProperty(s,"__esModule",{value:!0}),Object.keys(o).forEach(function(d){var y=Object.getOwnPropertyDescriptor(o,d);Object.defineProperty(s,d,y.get?y:{enumerable:!0,get:function(){return o[d]}})}),s}var w={exports:{}};(function(o){var i=Object.prototype.hasOwnProperty,s="~";function d(){}Object.create&&(d.prototype=Object.create(null),new d().__proto__||(s=!1));function y(c,t,n){this.fn=c,this.context=t,this.once=n||!1}function C(c,t,n,r,p){if(typeof n!="function")throw new TypeError("The listener must be a function");var u=new y(n,r||c,p),l=s?s+t:t;return c._events[l]?c._events[l].fn?c._events[l]=[c._events[l],u]:c._events[l].push(u):(c._events[l]=u,c._eventsCount++),c}function E(c,t){--c._eventsCount===0?c._events=new d:delete c._events[t]}function f(){this._events=new d,this._eventsCount=0}f.prototype.eventNames=function(){var t=[],n,r;if(this._eventsCount===0)return t;for(r in n=this._events)i.call(n,r)&&t.push(s?r.slice(1):r);return Object.getOwnPropertySymbols?t.concat(Object.getOwnPropertySymbols(n)):t},f.prototype.listeners=function(t){var n=s?s+t:t,r=this._events[n];if(!r)return[];if(r.fn)return[r.fn];for(var p=0,u=r.length,l=new Array(u);p<u;p++)l[p]=r[p].fn;return l},f.prototype.listenerCount=function(t){var n=s?s+t:t,r=this._events[n];return r?r.fn?1:r.length:0},f.prototype.emit=function(t,n,r,p,u,l){var v=s?s+t:t;if(!this._events[v])return!1;var e=this._events[v],m=arguments.length,_,a;if(e.fn){switch(e.once&&this.removeListener(t,e.fn,void 0,!0),m){case 1:return e.fn.call(e.context),!0;case 2:return e.fn.call(e.context,n),!0;case 3:return e.fn.call(e.context,n,r),!0;case 4:return e.fn.call(e.context,n,r,p),!0;case 5:return e.fn.call(e.context,n,r,p,u),!0;case 6:return e.fn.call(e.context,n,r,p,u,l),!0}for(a=1,_=new Array(m-1);a<m;a++)_[a-1]=arguments[a];e.fn.apply(e.context,_)}else{var x=e.length,g;for(a=0;a<x;a++)switch(e[a].once&&this.removeListener(t,e[a].fn,void 0,!0),m){case 1:e[a].fn.call(e[a].context);break;case 2:e[a].fn.call(e[a].context,n);break;case 3:e[a].fn.call(e[a].context,n,r);break;case 4:e[a].fn.call(e[a].context,n,r,p);break;default:if(!_)for(g=1,_=new Array(m-1);g<m;g++)_[g-1]=arguments[g];e[a].fn.apply(e[a].context,_)}}return!0},f.prototype.on=function(t,n,r){return C(this,t,n,r,!1)},f.prototype.once=function(t,n,r){return C(this,t,n,r,!0)},f.prototype.removeListener=function(t,n,r,p){var u=s?s+t:t;if(!this._events[u])return this;if(!n)return E(this,u),this;var l=this._events[u];if(l.fn)l.fn===n&&(!p||l.once)&&(!r||l.context===r)&&E(this,u);else{for(var v=0,e=[],m=l.length;v<m;v++)(l[v].fn!==n||p&&!l[v].once||r&&l[v].context!==r)&&e.push(l[v]);e.length?this._events[u]=e.length===1?e[0]:e:E(this,u)}return this},f.prototype.removeAllListeners=function(t){var n;return t?(n=s?s+t:t,this._events[n]&&E(this,n)):(this._events=new d,this._eventsCount=0),this},f.prototype.off=f.prototype.removeListener,f.prototype.addListener=f.prototype.on,f.prefixed=s,f.EventEmitter=f,o.exports=f})(w);var P=w.exports;const F=b(P);class R extends F{}const W=o=>{localStorage.setItem("starknetLastConnectedWallet",o)},q=()=>{localStorage.removeItem("starknetLastConnectedWallet")};exports.Connector=R;exports.ConnectorNotConnectedError=j;exports.ConnectorNotFoundError=N;exports.UserNotConnectedError=S;exports.UserRejectedRequestError=k;exports.commonjsGlobal=U;exports.getAugmentedNamespace=A;exports.getDefaultExportFromCjs=b;exports.removeStarknetLastConnectedWallet=q;exports.setStarknetLastConnectedWallet=W;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],12:[function(require,module,exports){
(function (global){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.d = exports.c = exports.b = exports.a = exports.U = exports.C = void 0;
exports.e = L;
exports.g = R;
exports.s = exports.r = void 0;
var x = Object.defineProperty;
var O = (o, f, s) => f in o ? x(o, f, {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: s
}) : o[f] = s;
var h = (o, f, s) => (O(o, typeof f != "symbol" ? f + "" : f, s), s);
class P extends Error {
  constructor() {
    super(...arguments);
    h(this, "name", "ConnectorNotConnectedError");
    h(this, "message", "Connector not connected");
  }
}
exports.a = P;
class U extends Error {
  constructor() {
    super(...arguments);
    h(this, "name", "ConnectorNotFoundError");
    h(this, "message", "Connector not found");
  }
}
exports.b = U;
class A extends Error {
  constructor() {
    super(...arguments);
    h(this, "name", "UserRejectedRequestError");
    h(this, "message", "User rejected request");
  }
}
exports.U = A;
class S extends Error {
  constructor() {
    super(...arguments);
    h(this, "name", "UserNotConnectedError");
    h(this, "message", "User not connected");
  }
}
exports.d = S;
var F = exports.c = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function L(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
function R(o) {
  if (o.__esModule) return o;
  var f = o.default;
  if (typeof f == "function") {
    var s = function v() {
      if (this instanceof v) {
        var y = [null];
        y.push.apply(y, arguments);
        var E = Function.bind.apply(f, y);
        return new E();
      }
      return f.apply(this, arguments);
    };
    s.prototype = f.prototype;
  } else s = {};
  return Object.defineProperty(s, "__esModule", {
    value: !0
  }), Object.keys(o).forEach(function (v) {
    var y = Object.getOwnPropertyDescriptor(o, v);
    Object.defineProperty(s, v, y.get ? y : {
      enumerable: !0,
      get: function () {
        return o[v];
      }
    });
  }), s;
}
var C = {
  exports: {}
};
(function (o) {
  var f = Object.prototype.hasOwnProperty,
    s = "~";
  function v() {}
  Object.create && (v.prototype = /* @__PURE__ */Object.create(null), new v().__proto__ || (s = !1));
  function y(c, t, n) {
    this.fn = c, this.context = t, this.once = n || !1;
  }
  function E(c, t, n, r, p) {
    if (typeof n != "function") throw new TypeError("The listener must be a function");
    var u = new y(n, r || c, p),
      a = s ? s + t : t;
    return c._events[a] ? c._events[a].fn ? c._events[a] = [c._events[a], u] : c._events[a].push(u) : (c._events[a] = u, c._eventsCount++), c;
  }
  function b(c, t) {
    --c._eventsCount === 0 ? c._events = new v() : delete c._events[t];
  }
  function l() {
    this._events = new v(), this._eventsCount = 0;
  }
  l.prototype.eventNames = function () {
    var t = [],
      n,
      r;
    if (this._eventsCount === 0) return t;
    for (r in n = this._events) f.call(n, r) && t.push(s ? r.slice(1) : r);
    return Object.getOwnPropertySymbols ? t.concat(Object.getOwnPropertySymbols(n)) : t;
  }, l.prototype.listeners = function (t) {
    var n = s ? s + t : t,
      r = this._events[n];
    if (!r) return [];
    if (r.fn) return [r.fn];
    for (var p = 0, u = r.length, a = new Array(u); p < u; p++) a[p] = r[p].fn;
    return a;
  }, l.prototype.listenerCount = function (t) {
    var n = s ? s + t : t,
      r = this._events[n];
    return r ? r.fn ? 1 : r.length : 0;
  }, l.prototype.emit = function (t, n, r, p, u, a) {
    var d = s ? s + t : t;
    if (!this._events[d]) return !1;
    var e = this._events[d],
      m = arguments.length,
      _,
      i;
    if (e.fn) {
      switch (e.once && this.removeListener(t, e.fn, void 0, !0), m) {
        case 1:
          return e.fn.call(e.context), !0;
        case 2:
          return e.fn.call(e.context, n), !0;
        case 3:
          return e.fn.call(e.context, n, r), !0;
        case 4:
          return e.fn.call(e.context, n, r, p), !0;
        case 5:
          return e.fn.call(e.context, n, r, p, u), !0;
        case 6:
          return e.fn.call(e.context, n, r, p, u, a), !0;
      }
      for (i = 1, _ = new Array(m - 1); i < m; i++) _[i - 1] = arguments[i];
      e.fn.apply(e.context, _);
    } else {
      var w = e.length,
        g;
      for (i = 0; i < w; i++) switch (e[i].once && this.removeListener(t, e[i].fn, void 0, !0), m) {
        case 1:
          e[i].fn.call(e[i].context);
          break;
        case 2:
          e[i].fn.call(e[i].context, n);
          break;
        case 3:
          e[i].fn.call(e[i].context, n, r);
          break;
        case 4:
          e[i].fn.call(e[i].context, n, r, p);
          break;
        default:
          if (!_) for (g = 1, _ = new Array(m - 1); g < m; g++) _[g - 1] = arguments[g];
          e[i].fn.apply(e[i].context, _);
      }
    }
    return !0;
  }, l.prototype.on = function (t, n, r) {
    return E(this, t, n, r, !1);
  }, l.prototype.once = function (t, n, r) {
    return E(this, t, n, r, !0);
  }, l.prototype.removeListener = function (t, n, r, p) {
    var u = s ? s + t : t;
    if (!this._events[u]) return this;
    if (!n) return b(this, u), this;
    var a = this._events[u];
    if (a.fn) a.fn === n && (!p || a.once) && (!r || a.context === r) && b(this, u);else {
      for (var d = 0, e = [], m = a.length; d < m; d++) (a[d].fn !== n || p && !a[d].once || r && a[d].context !== r) && e.push(a[d]);
      e.length ? this._events[u] = e.length === 1 ? e[0] : e : b(this, u);
    }
    return this;
  }, l.prototype.removeAllListeners = function (t) {
    var n;
    return t ? (n = s ? s + t : t, this._events[n] && b(this, n)) : (this._events = new v(), this._eventsCount = 0), this;
  }, l.prototype.off = l.prototype.removeListener, l.prototype.addListener = l.prototype.on, l.prefixed = s, l.EventEmitter = l, o.exports = l;
})(C);
var j = C.exports;
const N = /* @__PURE__ */L(j);
class T extends N {}
exports.C = T;
const W = o => {
    localStorage.setItem("starknetLastConnectedWallet", o);
  },
  q = () => {
    localStorage.removeItem("starknetLastConnectedWallet");
  };
exports.r = q;
exports.s = W;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(require,module,exports){
"use strict";const a={mainnet:"https://starknet-mainnet.public.blastapi.io",testnet:"https://starknet-sepolia.public.blastapi.io"},e={mainnet:"https://rpc.starknet.lava.build",testnet:"https://rpc.starknet-sepolia.lava.build"},t=[a,e];function s(){const n=Math.floor(Math.random()*t.length);return t[n]}exports.getRandomPublicRPCNode=s;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.g = s;
const a = {
    mainnet: "https://starknet-mainnet.public.blastapi.io",
    testnet: "https://starknet-sepolia.public.blastapi.io"
  },
  e = {
    mainnet: "https://rpc.starknet.lava.build",
    testnet: "https://rpc.starknet-sepolia.lava.build"
  },
  t = [a, e];
function s() {
  const n = Math.floor(Math.random() * t.length);
  return t[n];
}

},{}],15:[function(require,module,exports){
(function (global){(function (){
"use strict";

var Je = Object.defineProperty;
var Ke = (t, e, r) => e in t ? Je(t, e, {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: r
}) : t[e] = r;
var ce = (t, e, r) => (Ke(t, typeof e != "symbol" ? e + "" : e, r), r);
Object.defineProperty(exports, Symbol.toStringTag, {
  value: "Module"
});
const _e = require("./index-a73af6c1.cjs"),
  $e = require("./index-6f5141f0.cjs"),
  J = require("./index-63073fd9.cjs"),
  we = require("./lastConnected-080a1315.cjs");
require("starknet");
require("./publicRcpNodes-77022e83.cjs");
var et = Object.defineProperty,
  tt = (t, e, r) => e in t ? et(t, e, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: r
  }) : t[e] = r,
  rt = (t, e, r) => (tt(t, typeof e != "symbol" ? e + "" : e, r), r),
  me = (t, e, r) => {
    if (!e.has(t)) throw TypeError("Cannot " + r);
  },
  C = (t, e, r) => (me(t, e, "read from private field"), r ? r.call(t) : e.get(t)),
  V = (t, e, r) => {
    if (e.has(t)) throw TypeError("Cannot add the same private member more than once");
    e instanceof WeakSet ? e.add(t) : e.set(t, r);
  },
  oe = (t, e, r, n) => (me(t, e, "write to private field"), n ? n.call(t, r) : e.set(t, r), r),
  ee = (t, e, r) => (me(t, e, "access private method"), r);
const nt = [{
    id: "argentX",
    name: "Argent X",
    icon: "data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjQwIiBoZWlnaHQ9IjM2IiB2aWV3Qm94PSIwIDAgNDAgMzYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNC43NTgyIC0zLjk3MzY0ZS0wN0gxNC42MjM4QzE0LjI4NTEgLTMuOTczNjRlLTA3IDE0LjAxMzggMC4yODExNzggMTQuMDA2NCAwLjYzMDY4M0MxMy44MDE3IDEwLjQ1NDkgOC44MjIzNCAxOS43NzkyIDAuMjUxODkzIDI2LjM4MzdDLTAuMDIwMjA0NiAyNi41OTMzIC0wLjA4MjE5NDYgMjYuOTg3MiAwLjExNjczNCAyNy4yNzA5TDYuMDQ2MjMgMzUuNzM0QzYuMjQ3OTYgMzYuMDIyIDYuNjQwOTkgMzYuMDg3IDYuOTE3NjYgMzUuODc1NEMxMi4yNzY1IDMxLjc3MjggMTYuNTg2OSAyNi44MjM2IDE5LjY5MSAyMS4zMzhDMjIuNzk1MSAyNi44MjM2IDI3LjEwNTcgMzEuNzcyOCAzMi40NjQ2IDM1Ljg3NTRDMzIuNzQxIDM2LjA4NyAzMy4xMzQxIDM2LjAyMiAzMy4zMzYxIDM1LjczNEwzOS4yNjU2IDI3LjI3MDlDMzkuNDY0MiAyNi45ODcyIDM5LjQwMjIgMjYuNTkzMyAzOS4xMzA0IDI2LjM4MzdDMzAuNTU5NyAxOS43NzkyIDI1LjU4MDQgMTAuNDU0OSAyNS4zNzU5IDAuNjMwNjgzQzI1LjM2ODUgMC4yODExNzggMjUuMDk2OSAtMy45NzM2NGUtMDcgMjQuNzU4MiAtMy45NzM2NGUtMDdaIiBmaWxsPSIjRkY4NzVCIi8+Cjwvc3ZnPgo=",
    downloads: {
      chrome: "https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/argent-x"
    }
  }, {
    id: "braavos",
    name: "Braavos",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aAogICAgICAgIGQ9Ik02Mi43MDUgMTMuOTExNkM2Mi44MzU5IDE0LjEzMzMgNjIuNjYyMSAxNC40MDcgNjIuNDAzOSAxNC40MDdDNTcuMTgwNyAxNC40MDcgNTIuOTM0OCAxOC41NDI3IDUyLjgzNTEgMjMuNjgxN0M1MS4wNDY1IDIzLjM0NzcgNDkuMTkzMyAyMy4zMjI2IDQ3LjM2MjYgMjMuNjMxMUM0Ny4yMzYxIDE4LjUxNTYgNDMuMDAwOSAxNC40MDcgMzcuNzk0OCAxNC40MDdDMzcuNTM2NSAxNC40MDcgMzcuMzYyNSAxNC4xMzMxIDM3LjQ5MzUgMTMuOTExMkM0MC4wMjE3IDkuNjI4MDkgNDQuNzIwNCA2Ljc1IDUwLjA5OTEgNi43NUM1NS40NzgxIDYuNzUgNjAuMTc2OSA5LjYyODI2IDYyLjcwNSAxMy45MTE2WiIKICAgICAgICBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMzcyXzQwMjU5KSIgLz4KICAgIDxwYXRoCiAgICAgICAgZD0iTTc4Ljc2MDYgNDUuODcxOEM4MC4yNzI1IDQ2LjMyOTcgODEuNzAyNSA0NS4wMDU1IDgxLjE3MTQgNDMuNTIyMkM3Ni40MTM3IDMwLjIzMzQgNjEuMzkxMSAyNC44MDM5IDUwLjAyNzcgMjQuODAzOUMzOC42NDQyIDI0LjgwMzkgMjMuMjg2OCAzMC40MDcgMTguODc1NCA0My41OTEyQzE4LjM4MjQgNDUuMDY0NSAxOS44MDgzIDQ2LjM0NDYgMjEuMjk3OCA0NS44ODgxTDQ4Ljg3MiAzNy40MzgxQzQ5LjUzMzEgMzcuMjM1NSA1MC4yMzk5IDM3LjIzNDQgNTAuOTAxNyAzNy40MzQ4TDc4Ljc2MDYgNDUuODcxOFoiCiAgICAgICAgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzM3Ml80MDI1OSkiIC8+CiAgICA8cGF0aAogICAgICAgIGQ9Ik0xOC44MTMyIDQ4LjE3MDdMNDguODkzNSAzOS4wNDcyQzQ5LjU1MDYgMzguODQ3OCA1MC4yNTI0IDM4Ljg0NzMgNTAuOTA5OCAzOS4wNDU2TDgxLjE3ODEgNDguMTc1MkM4My42OTEyIDQ4LjkzMzIgODUuNDExIDUxLjI0ODMgODUuNDExIDUzLjg3MzVWODEuMjIzM0M4NS4yOTQ0IDg3Ljg5OTEgNzkuMjk3NyA5My4yNSA3Mi42MjQ1IDkzLjI1SDYxLjU0MDZDNjAuNDQ0OSA5My4yNSA1OS41NTc3IDkyLjM2MzcgNTkuNTU3NyA5MS4yNjhWODEuNjc4OUM1OS41NTc3IDc3LjkwMzEgNjEuNzkyMSA3NC40ODU1IDY1LjI0OTggNzIuOTcyOUM2OS44ODQ5IDcwLjk0NTQgNzUuMzY4MSA2OC4yMDI4IDc2LjM5OTQgNjIuNjk5MkM3Ni43MzIzIDYwLjkyMjkgNzUuNTc0MSA1OS4yMDk0IDczLjgwMjQgNTguODU3M0M2OS4zMjI2IDU3Ljk2NjcgNjQuMzU2MiA1OC4zMTA3IDYwLjE1NjQgNjAuMTg5M0M1NS4zODg3IDYyLjMyMTkgNTQuMTQxNSA2NS44Njk0IDUzLjY3OTcgNzAuNjMzN0w1My4xMjAxIDc1Ljc2NjJDNTIuOTQ5MSA3Ny4zMzQ5IDUxLjQ3ODUgNzguNTM2NiA0OS45MDE0IDc4LjUzNjZDNDguMjY5OSA3OC41MzY2IDQ3LjA0NjUgNzcuMjk0IDQ2Ljg2OTYgNzUuNjcxMkw0Ni4zMjA0IDcwLjYzMzdDNDUuOTI0OSA2Ni41NTI5IDQ1LjIwNzkgNjIuNTg4NyA0MC45ODk1IDYwLjcwMThDMzYuMTc3NiA1OC41NDk0IDMxLjM0MTkgNTcuODM0NyAyNi4xOTc2IDU4Ljg1NzNDMjQuNDI2IDU5LjIwOTQgMjMuMjY3OCA2MC45MjI5IDIzLjYwMDcgNjIuNjk5MkMyNC42NDEgNjguMjUwNyAzMC4wODEyIDcwLjkzMDUgMzQuNzUwMyA3Mi45NzI5QzM4LjIwOCA3NC40ODU1IDQwLjQ0MjQgNzcuOTAzMSA0MC40NDI0IDgxLjY3ODlWOTEuMjY2M0M0MC40NDI0IDkyLjM2MiAzOS41NTU1IDkzLjI1IDM4LjQ1OTkgOTMuMjVIMjcuMzc1NkMyMC43MDI0IDkzLjI1IDE0LjcwNTcgODcuODk5MSAxNC41ODkxIDgxLjIyMzNWNTMuODY2M0MxNC41ODkxIDUxLjI0NDYgMTYuMzA0NSA0OC45MzE2IDE4LjgxMzIgNDguMTcwN1oiCiAgICAgICAgZmlsbD0idXJsKCNwYWludDJfbGluZWFyXzM3Ml80MDI1OSkiIC8+CiAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMzcyXzQwMjU5IiB4MT0iNDkuMzA1NyIgeTE9IjIuMDc5IiB4Mj0iODAuMzYyNyIgeTI9IjkzLjY1OTciCiAgICAgICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0Y1RDQ1RSIgLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY5NjAwIiAvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzM3Ml80MDI1OSIgeDE9IjQ5LjMwNTciIHkxPSIyLjA3OSIgeDI9IjgwLjM2MjciIHkyPSI5My42NTk3IgogICAgICAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGNUQ0NUUiIC8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTYwMCIgLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQyX2xpbmVhcl8zNzJfNDAyNTkiIHgxPSI0OS4zMDU3IiB5MT0iMi4wNzkiIHgyPSI4MC4zNjI3IiB5Mj0iOTMuNjU5NyIKICAgICAgICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjRjVENDVFIiAvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjk2MDAiIC8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KPC9zdmc+",
    downloads: {
      chrome: "https://chrome.google.com/webstore/detail/braavos-wallet/jnlgamecbpmbajjfhmmmlhejkemejdma",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/braavos-wallet",
      edge: "https://microsoftedge.microsoft.com/addons/detail/braavos-wallet/hkkpjehhcnhgefhbdcgfkeegglpjchdc"
    }
  }],
  it = () => `${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`,
  ye = t => {
    for (let e = t.length - 1; e > 0; e--) {
      const r = Math.floor(Math.random() * (e + 1));
      [t[e], t[r]] = [t[r], t[e]];
    }
    return t;
  };
function le(...t) {
  return e => t.reduce((r, n) => r.then(n), Promise.resolve(e));
}
var W, S, H, he, Le, X, re;
class ot {
  constructor(e) {
    V(this, he), V(this, X), V(this, W, !1), V(this, S, void 0), V(this, H, void 0), rt(this, "value"), oe(this, H, e), ee(this, X, re).call(this);
  }
  set(e) {
    return !C(this, W) && !ee(this, X, re).call(this) ? !1 : (this.delete(), this.value = e, e && (oe(this, S, `${C(this, H)}-${it()}`), localStorage.setItem(C(this, S), e)), !0);
  }
  get() {
    return ee(this, he, Le).call(this), this.value;
  }
  delete() {
    return !C(this, W) && !ee(this, X, re).call(this) ? !1 : (this.value = null, C(this, S) && localStorage.removeItem(C(this, S)), !0);
  }
}
W = new WeakMap(), S = new WeakMap(), H = new WeakMap(), he = new WeakSet(), Le = function () {
  this.value && this.set(this.value);
}, X = new WeakSet(), re = function () {
  try {
    !C(this, W) && typeof window < "u" && (oe(this, S, Object.keys(localStorage).find(t => t.startsWith(C(this, H)))), oe(this, W, !0), C(this, S) && this.set(localStorage.getItem(C(this, S))));
  } catch (t) {
    console.warn(t);
  }
  return C(this, W);
};
function de(t, e) {
  var r, n;
  if ((r = e?.include) != null && r.length) {
    const i = new Set(e.include);
    return t.filter(s => i.has(s.id));
  }
  if ((n = e?.exclude) != null && n.length) {
    const i = new Set(e.exclude);
    return t.filter(s => !i.has(s.id));
  }
  return t;
}
const ve = async t => {
    const e = await Promise.all(t.map(r => r.isPreauthorized().catch(() => !1)));
    return t.filter((r, n) => e[n]);
  },
  st = t => {
    try {
      return t && ["request", "isConnected", "provider", "enable", "isPreauthorized", "on", "off", "version", "id", "name", "icon"].every(e => e in t);
    } catch {}
    return !1;
  };
function ue(t, e) {
  return Object.values(Object.getOwnPropertyNames(t).reduce((r, n) => {
    if (n.startsWith("starknet")) {
      const i = t[n];
      e(i) && !r[i.id] && (r[i.id] = i);
    }
    return r;
  }, {}));
}
const ge = (t, e) => {
    if (e && Array.isArray(e)) {
      t.sort((n, i) => e.indexOf(n.id) - e.indexOf(i.id));
      const r = t.length - e.length;
      return [...t.slice(r), ...ye(t.slice(0, r))];
    } else return ye(t);
  },
  at = typeof window < "u" ? window : {},
  ct = {
    windowObject: at,
    isWalletObject: st,
    storageFactoryImplementation: t => new ot(t)
  };
function lt(t = {}) {
  const {
      storageFactoryImplementation: e,
      windowObject: r,
      isWalletObject: n
    } = {
      ...ct,
      ...t
    },
    i = e("gsw-last");
  return {
    getAvailableWallets: async (s = {}) => {
      const l = ue(r, n);
      return le(d => de(d, s), d => ge(d, s.sort))(l);
    },
    getPreAuthorizedWallets: async (s = {}) => {
      const l = ue(r, n);
      return le(d => ve(d), d => de(d, s), d => ge(d, s.sort))(l);
    },
    getDiscoveryWallets: async (s = {}) => le(l => de(l, s), l => ge(l, s.sort))(nt),
    getLastConnectedWallet: async () => {
      const s = i.get(),
        l = ue(r, n).find(f => f.id === s),
        [d] = await ve(l ? [l] : []);
      return d || (i.delete(), null);
    },
    enable: async (s, l) => {
      if (await s.enable(l ?? {
        starknetVersion: "v5"
      }), !s.isConnected) throw new Error("Failed to connect to wallet");
      return i.set(s.id), s;
    },
    disconnect: async ({
      clearLastWallet: s
    } = {}) => {
      s && i.delete();
    }
  };
}
const ne = lt(),
  dt = {
    "Amazon Silk": "amazon_silk",
    "Android Browser": "android",
    Bada: "bada",
    BlackBerry: "blackberry",
    Chrome: "chrome",
    Chromium: "chromium",
    Electron: "electron",
    Epiphany: "epiphany",
    Firefox: "firefox",
    Focus: "focus",
    Generic: "generic",
    "Google Search": "google_search",
    Googlebot: "googlebot",
    "Internet Explorer": "ie",
    "K-Meleon": "k_meleon",
    Maxthon: "maxthon",
    "Microsoft Edge": "edge",
    "MZ Browser": "mz",
    "NAVER Whale Browser": "naver",
    Opera: "opera",
    "Opera Coast": "opera_coast",
    PhantomJS: "phantomjs",
    Puffin: "puffin",
    QupZilla: "qupzilla",
    QQ: "qq",
    QQLite: "qqlite",
    Safari: "safari",
    Sailfish: "sailfish",
    "Samsung Internet for Android": "samsung_internet",
    SeaMonkey: "seamonkey",
    Sleipnir: "sleipnir",
    Swing: "swing",
    Tizen: "tizen",
    "UC Browser": "uc",
    Vivaldi: "vivaldi",
    "WebOS Browser": "webos",
    WeChat: "wechat",
    "Yandex Browser": "yandex",
    Roku: "roku"
  },
  Te = {
    amazon_silk: "Amazon Silk",
    android: "Android Browser",
    bada: "Bada",
    blackberry: "BlackBerry",
    chrome: "Chrome",
    chromium: "Chromium",
    electron: "Electron",
    epiphany: "Epiphany",
    firefox: "Firefox",
    focus: "Focus",
    generic: "Generic",
    googlebot: "Googlebot",
    google_search: "Google Search",
    ie: "Internet Explorer",
    k_meleon: "K-Meleon",
    maxthon: "Maxthon",
    edge: "Microsoft Edge",
    mz: "MZ Browser",
    naver: "NAVER Whale Browser",
    opera: "Opera",
    opera_coast: "Opera Coast",
    phantomjs: "PhantomJS",
    puffin: "Puffin",
    qupzilla: "QupZilla",
    qq: "QQ Browser",
    qqlite: "QQ Browser Lite",
    safari: "Safari",
    sailfish: "Sailfish",
    samsung_internet: "Samsung Internet for Android",
    seamonkey: "SeaMonkey",
    sleipnir: "Sleipnir",
    swing: "Swing",
    tizen: "Tizen",
    uc: "UC Browser",
    vivaldi: "Vivaldi",
    webos: "WebOS Browser",
    wechat: "WeChat",
    yandex: "Yandex Browser"
  },
  N = {
    tablet: "tablet",
    mobile: "mobile",
    desktop: "desktop",
    tv: "tv"
  },
  j = {
    WindowsPhone: "Windows Phone",
    Windows: "Windows",
    MacOS: "macOS",
    iOS: "iOS",
    Android: "Android",
    WebOS: "WebOS",
    BlackBerry: "BlackBerry",
    Bada: "Bada",
    Tizen: "Tizen",
    Linux: "Linux",
    ChromeOS: "Chrome OS",
    PlayStation4: "PlayStation 4",
    Roku: "Roku"
  },
  L = {
    EdgeHTML: "EdgeHTML",
    Blink: "Blink",
    Trident: "Trident",
    Presto: "Presto",
    Gecko: "Gecko",
    WebKit: "WebKit"
  };
class o {
  static getFirstMatch(e, r) {
    const n = r.match(e);
    return n && n.length > 0 && n[1] || "";
  }
  static getSecondMatch(e, r) {
    const n = r.match(e);
    return n && n.length > 1 && n[2] || "";
  }
  static matchAndReturnConst(e, r, n) {
    if (e.test(r)) return n;
  }
  static getWindowsVersionName(e) {
    switch (e) {
      case "NT":
        return "NT";
      case "XP":
        return "XP";
      case "NT 5.0":
        return "2000";
      case "NT 5.1":
        return "XP";
      case "NT 5.2":
        return "2003";
      case "NT 6.0":
        return "Vista";
      case "NT 6.1":
        return "7";
      case "NT 6.2":
        return "8";
      case "NT 6.3":
        return "8.1";
      case "NT 10.0":
        return "10";
      default:
        return;
    }
  }
  static getMacOSVersionName(e) {
    const r = e.split(".").splice(0, 2).map(n => parseInt(n, 10) || 0);
    if (r.push(0), r[0] === 10) switch (r[1]) {
      case 5:
        return "Leopard";
      case 6:
        return "Snow Leopard";
      case 7:
        return "Lion";
      case 8:
        return "Mountain Lion";
      case 9:
        return "Mavericks";
      case 10:
        return "Yosemite";
      case 11:
        return "El Capitan";
      case 12:
        return "Sierra";
      case 13:
        return "High Sierra";
      case 14:
        return "Mojave";
      case 15:
        return "Catalina";
      default:
        return;
    }
  }
  static getAndroidVersionName(e) {
    const r = e.split(".").splice(0, 2).map(n => parseInt(n, 10) || 0);
    if (r.push(0), !(r[0] === 1 && r[1] < 5)) {
      if (r[0] === 1 && r[1] < 6) return "Cupcake";
      if (r[0] === 1 && r[1] >= 6) return "Donut";
      if (r[0] === 2 && r[1] < 2) return "Eclair";
      if (r[0] === 2 && r[1] === 2) return "Froyo";
      if (r[0] === 2 && r[1] > 2) return "Gingerbread";
      if (r[0] === 3) return "Honeycomb";
      if (r[0] === 4 && r[1] < 1) return "Ice Cream Sandwich";
      if (r[0] === 4 && r[1] < 4) return "Jelly Bean";
      if (r[0] === 4 && r[1] >= 4) return "KitKat";
      if (r[0] === 5) return "Lollipop";
      if (r[0] === 6) return "Marshmallow";
      if (r[0] === 7) return "Nougat";
      if (r[0] === 8) return "Oreo";
      if (r[0] === 9) return "Pie";
    }
  }
  static getVersionPrecision(e) {
    return e.split(".").length;
  }
  static compareVersions(e, r, n = !1) {
    const i = o.getVersionPrecision(e),
      s = o.getVersionPrecision(r);
    let l = Math.max(i, s),
      d = 0;
    const f = o.map([e, r], a => {
      const u = l - o.getVersionPrecision(a),
        g = a + new Array(u + 1).join(".0");
      return o.map(g.split("."), b => new Array(20 - b.length).join("0") + b).reverse();
    });
    for (n && (d = l - Math.min(i, s)), l -= 1; l >= d;) {
      if (f[0][l] > f[1][l]) return 1;
      if (f[0][l] === f[1][l]) {
        if (l === d) return 0;
        l -= 1;
      } else if (f[0][l] < f[1][l]) return -1;
    }
  }
  static map(e, r) {
    const n = [];
    let i;
    if (Array.prototype.map) return Array.prototype.map.call(e, r);
    for (i = 0; i < e.length; i += 1) n.push(r(e[i]));
    return n;
  }
  static find(e, r) {
    let n, i;
    if (Array.prototype.find) return Array.prototype.find.call(e, r);
    for (n = 0, i = e.length; n < i; n += 1) {
      const s = e[n];
      if (r(s, n)) return s;
    }
  }
  static assign(e, ...r) {
    const n = e;
    let i, s;
    if (Object.assign) return Object.assign(e, ...r);
    for (i = 0, s = r.length; i < s; i += 1) {
      const l = r[i];
      typeof l == "object" && l !== null && Object.keys(l).forEach(f => {
        n[f] = l[f];
      });
    }
    return e;
  }
  static getBrowserAlias(e) {
    return dt[e];
  }
  static getBrowserTypeByAlias(e) {
    return Te[e] || "";
  }
}
const y = /version\/(\d+(\.?_?\d+)+)/i,
  ut = [{
    test: [/googlebot/i],
    describe(t) {
      const e = {
          name: "Googlebot"
        },
        r = o.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, t) || o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/opera/i],
    describe(t) {
      const e = {
          name: "Opera"
        },
        r = o.getFirstMatch(y, t) || o.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/opr\/|opios/i],
    describe(t) {
      const e = {
          name: "Opera"
        },
        r = o.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, t) || o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/SamsungBrowser/i],
    describe(t) {
      const e = {
          name: "Samsung Internet for Android"
        },
        r = o.getFirstMatch(y, t) || o.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/Whale/i],
    describe(t) {
      const e = {
          name: "NAVER Whale Browser"
        },
        r = o.getFirstMatch(y, t) || o.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/MZBrowser/i],
    describe(t) {
      const e = {
          name: "MZ Browser"
        },
        r = o.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, t) || o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/focus/i],
    describe(t) {
      const e = {
          name: "Focus"
        },
        r = o.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, t) || o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/swing/i],
    describe(t) {
      const e = {
          name: "Swing"
        },
        r = o.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, t) || o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/coast/i],
    describe(t) {
      const e = {
          name: "Opera Coast"
        },
        r = o.getFirstMatch(y, t) || o.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/opt\/\d+(?:.?_?\d+)+/i],
    describe(t) {
      const e = {
          name: "Opera Touch"
        },
        r = o.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, t) || o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/yabrowser/i],
    describe(t) {
      const e = {
          name: "Yandex Browser"
        },
        r = o.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, t) || o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/ucbrowser/i],
    describe(t) {
      const e = {
          name: "UC Browser"
        },
        r = o.getFirstMatch(y, t) || o.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/Maxthon|mxios/i],
    describe(t) {
      const e = {
          name: "Maxthon"
        },
        r = o.getFirstMatch(y, t) || o.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/epiphany/i],
    describe(t) {
      const e = {
          name: "Epiphany"
        },
        r = o.getFirstMatch(y, t) || o.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/puffin/i],
    describe(t) {
      const e = {
          name: "Puffin"
        },
        r = o.getFirstMatch(y, t) || o.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/sleipnir/i],
    describe(t) {
      const e = {
          name: "Sleipnir"
        },
        r = o.getFirstMatch(y, t) || o.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/k-meleon/i],
    describe(t) {
      const e = {
          name: "K-Meleon"
        },
        r = o.getFirstMatch(y, t) || o.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/micromessenger/i],
    describe(t) {
      const e = {
          name: "WeChat"
        },
        r = o.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, t) || o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/qqbrowser/i],
    describe(t) {
      const e = {
          name: /qqbrowserlite/i.test(t) ? "QQ Browser Lite" : "QQ Browser"
        },
        r = o.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, t) || o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/msie|trident/i],
    describe(t) {
      const e = {
          name: "Internet Explorer"
        },
        r = o.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/\sedg\//i],
    describe(t) {
      const e = {
          name: "Microsoft Edge"
        },
        r = o.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/edg([ea]|ios)/i],
    describe(t) {
      const e = {
          name: "Microsoft Edge"
        },
        r = o.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/vivaldi/i],
    describe(t) {
      const e = {
          name: "Vivaldi"
        },
        r = o.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/seamonkey/i],
    describe(t) {
      const e = {
          name: "SeaMonkey"
        },
        r = o.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/sailfish/i],
    describe(t) {
      const e = {
          name: "Sailfish"
        },
        r = o.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/silk/i],
    describe(t) {
      const e = {
          name: "Amazon Silk"
        },
        r = o.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/phantom/i],
    describe(t) {
      const e = {
          name: "PhantomJS"
        },
        r = o.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/slimerjs/i],
    describe(t) {
      const e = {
          name: "SlimerJS"
        },
        r = o.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
    describe(t) {
      const e = {
          name: "BlackBerry"
        },
        r = o.getFirstMatch(y, t) || o.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/(web|hpw)[o0]s/i],
    describe(t) {
      const e = {
          name: "WebOS Browser"
        },
        r = o.getFirstMatch(y, t) || o.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/bada/i],
    describe(t) {
      const e = {
          name: "Bada"
        },
        r = o.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/tizen/i],
    describe(t) {
      const e = {
          name: "Tizen"
        },
        r = o.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, t) || o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/qupzilla/i],
    describe(t) {
      const e = {
          name: "QupZilla"
        },
        r = o.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, t) || o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/firefox|iceweasel|fxios/i],
    describe(t) {
      const e = {
          name: "Firefox"
        },
        r = o.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/electron/i],
    describe(t) {
      const e = {
          name: "Electron"
        },
        r = o.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/MiuiBrowser/i],
    describe(t) {
      const e = {
          name: "Miui"
        },
        r = o.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/chromium/i],
    describe(t) {
      const e = {
          name: "Chromium"
        },
        r = o.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, t) || o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/chrome|crios|crmo/i],
    describe(t) {
      const e = {
          name: "Chrome"
        },
        r = o.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/GSA/i],
    describe(t) {
      const e = {
          name: "Google Search"
        },
        r = o.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test(t) {
      const e = !t.test(/like android/i),
        r = t.test(/android/i);
      return e && r;
    },
    describe(t) {
      const e = {
          name: "Android Browser"
        },
        r = o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/playstation 4/i],
    describe(t) {
      const e = {
          name: "PlayStation 4"
        },
        r = o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/safari|applewebkit/i],
    describe(t) {
      const e = {
          name: "Safari"
        },
        r = o.getFirstMatch(y, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/.*/i],
    describe(t) {
      const e = /^(.*)\/(.*) /,
        r = /^(.*)\/(.*)[ \t]\((.*)/,
        i = t.search("\\(") !== -1 ? r : e;
      return {
        name: o.getFirstMatch(i, t),
        version: o.getSecondMatch(i, t)
      };
    }
  }],
  gt = [{
    test: [/Roku\/DVP/],
    describe(t) {
      const e = o.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, t);
      return {
        name: j.Roku,
        version: e
      };
    }
  }, {
    test: [/windows phone/i],
    describe(t) {
      const e = o.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, t);
      return {
        name: j.WindowsPhone,
        version: e
      };
    }
  }, {
    test: [/windows /i],
    describe(t) {
      const e = o.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, t),
        r = o.getWindowsVersionName(e);
      return {
        name: j.Windows,
        version: e,
        versionName: r
      };
    }
  }, {
    test: [/Macintosh(.*?) FxiOS(.*?)\//],
    describe(t) {
      const e = {
          name: j.iOS
        },
        r = o.getSecondMatch(/(Version\/)(\d[\d.]+)/, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/macintosh/i],
    describe(t) {
      const e = o.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, t).replace(/[_\s]/g, "."),
        r = o.getMacOSVersionName(e),
        n = {
          name: j.MacOS,
          version: e
        };
      return r && (n.versionName = r), n;
    }
  }, {
    test: [/(ipod|iphone|ipad)/i],
    describe(t) {
      const e = o.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, t).replace(/[_\s]/g, ".");
      return {
        name: j.iOS,
        version: e
      };
    }
  }, {
    test(t) {
      const e = !t.test(/like android/i),
        r = t.test(/android/i);
      return e && r;
    },
    describe(t) {
      const e = o.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, t),
        r = o.getAndroidVersionName(e),
        n = {
          name: j.Android,
          version: e
        };
      return r && (n.versionName = r), n;
    }
  }, {
    test: [/(web|hpw)[o0]s/i],
    describe(t) {
      const e = o.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, t),
        r = {
          name: j.WebOS
        };
      return e && e.length && (r.version = e), r;
    }
  }, {
    test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
    describe(t) {
      const e = o.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, t) || o.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, t) || o.getFirstMatch(/\bbb(\d+)/i, t);
      return {
        name: j.BlackBerry,
        version: e
      };
    }
  }, {
    test: [/bada/i],
    describe(t) {
      const e = o.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, t);
      return {
        name: j.Bada,
        version: e
      };
    }
  }, {
    test: [/tizen/i],
    describe(t) {
      const e = o.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, t);
      return {
        name: j.Tizen,
        version: e
      };
    }
  }, {
    test: [/linux/i],
    describe() {
      return {
        name: j.Linux
      };
    }
  }, {
    test: [/CrOS/],
    describe() {
      return {
        name: j.ChromeOS
      };
    }
  }, {
    test: [/PlayStation 4/],
    describe(t) {
      const e = o.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, t);
      return {
        name: j.PlayStation4,
        version: e
      };
    }
  }],
  ft = [{
    test: [/googlebot/i],
    describe() {
      return {
        type: "bot",
        vendor: "Google"
      };
    }
  }, {
    test: [/huawei/i],
    describe(t) {
      const e = o.getFirstMatch(/(can-l01)/i, t) && "Nova",
        r = {
          type: N.mobile,
          vendor: "Huawei"
        };
      return e && (r.model = e), r;
    }
  }, {
    test: [/nexus\s*(?:7|8|9|10).*/i],
    describe() {
      return {
        type: N.tablet,
        vendor: "Nexus"
      };
    }
  }, {
    test: [/ipad/i],
    describe() {
      return {
        type: N.tablet,
        vendor: "Apple",
        model: "iPad"
      };
    }
  }, {
    test: [/Macintosh(.*?) FxiOS(.*?)\//],
    describe() {
      return {
        type: N.tablet,
        vendor: "Apple",
        model: "iPad"
      };
    }
  }, {
    test: [/kftt build/i],
    describe() {
      return {
        type: N.tablet,
        vendor: "Amazon",
        model: "Kindle Fire HD 7"
      };
    }
  }, {
    test: [/silk/i],
    describe() {
      return {
        type: N.tablet,
        vendor: "Amazon"
      };
    }
  }, {
    test: [/tablet(?! pc)/i],
    describe() {
      return {
        type: N.tablet
      };
    }
  }, {
    test(t) {
      const e = t.test(/ipod|iphone/i),
        r = t.test(/like (ipod|iphone)/i);
      return e && !r;
    },
    describe(t) {
      const e = o.getFirstMatch(/(ipod|iphone)/i, t);
      return {
        type: N.mobile,
        vendor: "Apple",
        model: e
      };
    }
  }, {
    test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
    describe() {
      return {
        type: N.mobile,
        vendor: "Nexus"
      };
    }
  }, {
    test: [/[^-]mobi/i],
    describe() {
      return {
        type: N.mobile
      };
    }
  }, {
    test(t) {
      return t.getBrowserName(!0) === "blackberry";
    },
    describe() {
      return {
        type: N.mobile,
        vendor: "BlackBerry"
      };
    }
  }, {
    test(t) {
      return t.getBrowserName(!0) === "bada";
    },
    describe() {
      return {
        type: N.mobile
      };
    }
  }, {
    test(t) {
      return t.getBrowserName() === "windows phone";
    },
    describe() {
      return {
        type: N.mobile,
        vendor: "Microsoft"
      };
    }
  }, {
    test(t) {
      const e = Number(String(t.getOSVersion()).split(".")[0]);
      return t.getOSName(!0) === "android" && e >= 3;
    },
    describe() {
      return {
        type: N.tablet
      };
    }
  }, {
    test(t) {
      return t.getOSName(!0) === "android";
    },
    describe() {
      return {
        type: N.mobile
      };
    }
  }, {
    test(t) {
      return t.getOSName(!0) === "macos";
    },
    describe() {
      return {
        type: N.desktop,
        vendor: "Apple"
      };
    }
  }, {
    test(t) {
      return t.getOSName(!0) === "windows";
    },
    describe() {
      return {
        type: N.desktop
      };
    }
  }, {
    test(t) {
      return t.getOSName(!0) === "linux";
    },
    describe() {
      return {
        type: N.desktop
      };
    }
  }, {
    test(t) {
      return t.getOSName(!0) === "playstation 4";
    },
    describe() {
      return {
        type: N.tv
      };
    }
  }, {
    test(t) {
      return t.getOSName(!0) === "roku";
    },
    describe() {
      return {
        type: N.tv
      };
    }
  }],
  wt = [{
    test(t) {
      return t.getBrowserName(!0) === "microsoft edge";
    },
    describe(t) {
      if (/\sedg\//i.test(t)) return {
        name: L.Blink
      };
      const r = o.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, t);
      return {
        name: L.EdgeHTML,
        version: r
      };
    }
  }, {
    test: [/trident/i],
    describe(t) {
      const e = {
          name: L.Trident
        },
        r = o.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test(t) {
      return t.test(/presto/i);
    },
    describe(t) {
      const e = {
          name: L.Presto
        },
        r = o.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test(t) {
      const e = t.test(/gecko/i),
        r = t.test(/like gecko/i);
      return e && !r;
    },
    describe(t) {
      const e = {
          name: L.Gecko
        },
        r = o.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }, {
    test: [/(apple)?webkit\/537\.36/i],
    describe() {
      return {
        name: L.Blink
      };
    }
  }, {
    test: [/(apple)?webkit/i],
    describe(t) {
      const e = {
          name: L.WebKit
        },
        r = o.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, t);
      return r && (e.version = r), e;
    }
  }];
class ke {
  constructor(e, r = !1) {
    if (e == null || e === "") throw new Error("UserAgent parameter can't be empty");
    this._ua = e, this.parsedResult = {}, r !== !0 && this.parse();
  }
  getUA() {
    return this._ua;
  }
  test(e) {
    return e.test(this._ua);
  }
  parseBrowser() {
    this.parsedResult.browser = {};
    const e = o.find(ut, r => {
      if (typeof r.test == "function") return r.test(this);
      if (r.test instanceof Array) return r.test.some(n => this.test(n));
      throw new Error("Browser's test function is not valid");
    });
    return e && (this.parsedResult.browser = e.describe(this.getUA())), this.parsedResult.browser;
  }
  getBrowser() {
    return this.parsedResult.browser ? this.parsedResult.browser : this.parseBrowser();
  }
  getBrowserName(e) {
    return e ? String(this.getBrowser().name).toLowerCase() || "" : this.getBrowser().name || "";
  }
  getBrowserVersion() {
    return this.getBrowser().version;
  }
  getOS() {
    return this.parsedResult.os ? this.parsedResult.os : this.parseOS();
  }
  parseOS() {
    this.parsedResult.os = {};
    const e = o.find(gt, r => {
      if (typeof r.test == "function") return r.test(this);
      if (r.test instanceof Array) return r.test.some(n => this.test(n));
      throw new Error("Browser's test function is not valid");
    });
    return e && (this.parsedResult.os = e.describe(this.getUA())), this.parsedResult.os;
  }
  getOSName(e) {
    const {
      name: r
    } = this.getOS();
    return e ? String(r).toLowerCase() || "" : r || "";
  }
  getOSVersion() {
    return this.getOS().version;
  }
  getPlatform() {
    return this.parsedResult.platform ? this.parsedResult.platform : this.parsePlatform();
  }
  getPlatformType(e = !1) {
    const {
      type: r
    } = this.getPlatform();
    return e ? String(r).toLowerCase() || "" : r || "";
  }
  parsePlatform() {
    this.parsedResult.platform = {};
    const e = o.find(ft, r => {
      if (typeof r.test == "function") return r.test(this);
      if (r.test instanceof Array) return r.test.some(n => this.test(n));
      throw new Error("Browser's test function is not valid");
    });
    return e && (this.parsedResult.platform = e.describe(this.getUA())), this.parsedResult.platform;
  }
  getEngine() {
    return this.parsedResult.engine ? this.parsedResult.engine : this.parseEngine();
  }
  getEngineName(e) {
    return e ? String(this.getEngine().name).toLowerCase() || "" : this.getEngine().name || "";
  }
  parseEngine() {
    this.parsedResult.engine = {};
    const e = o.find(wt, r => {
      if (typeof r.test == "function") return r.test(this);
      if (r.test instanceof Array) return r.test.some(n => this.test(n));
      throw new Error("Browser's test function is not valid");
    });
    return e && (this.parsedResult.engine = e.describe(this.getUA())), this.parsedResult.engine;
  }
  parse() {
    return this.parseBrowser(), this.parseOS(), this.parsePlatform(), this.parseEngine(), this;
  }
  getResult() {
    return o.assign({}, this.parsedResult);
  }
  satisfies(e) {
    const r = {};
    let n = 0;
    const i = {};
    let s = 0;
    if (Object.keys(e).forEach(d => {
      const f = e[d];
      typeof f == "string" ? (i[d] = f, s += 1) : typeof f == "object" && (r[d] = f, n += 1);
    }), n > 0) {
      const d = Object.keys(r),
        f = o.find(d, u => this.isOS(u));
      if (f) {
        const u = this.satisfies(r[f]);
        if (u !== void 0) return u;
      }
      const a = o.find(d, u => this.isPlatform(u));
      if (a) {
        const u = this.satisfies(r[a]);
        if (u !== void 0) return u;
      }
    }
    if (s > 0) {
      const d = Object.keys(i),
        f = o.find(d, a => this.isBrowser(a, !0));
      if (f !== void 0) return this.compareVersion(i[f]);
    }
  }
  isBrowser(e, r = !1) {
    const n = this.getBrowserName().toLowerCase();
    let i = e.toLowerCase();
    const s = o.getBrowserTypeByAlias(i);
    return r && s && (i = s.toLowerCase()), i === n;
  }
  compareVersion(e) {
    let r = [0],
      n = e,
      i = !1;
    const s = this.getBrowserVersion();
    if (typeof s == "string") return e[0] === ">" || e[0] === "<" ? (n = e.substr(1), e[1] === "=" ? (i = !0, n = e.substr(2)) : r = [], e[0] === ">" ? r.push(1) : r.push(-1)) : e[0] === "=" ? n = e.substr(1) : e[0] === "~" && (i = !0, n = e.substr(1)), r.indexOf(o.compareVersions(s, n, i)) > -1;
  }
  isOS(e) {
    return this.getOSName(!0) === String(e).toLowerCase();
  }
  isPlatform(e) {
    return this.getPlatformType(!0) === String(e).toLowerCase();
  }
  isEngine(e) {
    return this.getEngineName(!0) === String(e).toLowerCase();
  }
  is(e, r = !1) {
    return this.isBrowser(e, r) || this.isOS(e) || this.isPlatform(e);
  }
  some(e = []) {
    return e.some(r => this.is(r));
  }
} /*!
  * Bowser - a browser detector
  * https://github.com/lancedikson/bowser
  * MIT License | (c) Dustin Diaz 2012-2015
  * MIT License | (c) Denis Demchenko 2015-2019
  */
class ht {
  static getParser(e, r = !1) {
    if (typeof e != "string") throw new Error("UserAgent should be a string");
    return new ke(e, r);
  }
  static parse(e) {
    return new ke(e).getResult();
  }
  static get BROWSER_MAP() {
    return Te;
  }
  static get ENGINE_MAP() {
    return L;
  }
  static get OS_MAP() {
    return j;
  }
  static get PLATFORMS_MAP() {
    return N;
  }
}
const Ne = typeof window < "u" ? window : null;
function bt() {
  if (!Ne) return null;
  switch (ht.getParser(Ne.navigator.userAgent).getBrowserName()?.toLowerCase()) {
    case "firefox":
      return "firefox";
    case "microsoft edge":
      return "edge";
    case "android browser":
    case "chrome":
    case "chromium":
    case "electron":
    case "opera":
    case "vivaldi":
      return "chrome";
    default:
      return null;
  }
}
const pt = ({
  argentMobileOptions: t,
  webWalletUrl: e,
  provider: r
}) => {
  const n = typeof window < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1,
    i = [];
  return n || (i.push(new J.InjectedConnector({
    options: {
      id: "argentX",
      provider: r
    }
  })), i.push(new J.InjectedConnector({
    options: {
      id: "braavos",
      provider: r
    }
  }))), i.push(new $e.ArgentMobileConnector({
    ...t,
    provider: r
  })), i.push(new _e.WebWalletConnector({
    url: e,
    provider: r
  })), i;
};
var mt = typeof global == "object" && global && global.Object === Object && global;
const Mt = mt;
var yt = typeof self == "object" && self && self.Object === Object && self,
  vt = Mt || yt || Function("return this")();
const kt = vt;
var Nt = kt.Symbol;
const se = Nt;
var Ee = Object.prototype,
  It = Ee.hasOwnProperty,
  At = Ee.toString,
  Z = se ? se.toStringTag : void 0;
function xt(t) {
  var e = It.call(t, Z),
    r = t[Z];
  try {
    t[Z] = void 0;
    var n = !0;
  } catch {}
  var i = At.call(t);
  return n && (e ? t[Z] = r : delete t[Z]), i;
}
var jt = Object.prototype,
  zt = jt.toString;
function Ct(t) {
  return zt.call(t);
}
var Dt = "[object Null]",
  St = "[object Undefined]",
  Ie = se ? se.toStringTag : void 0;
function Ot(t) {
  return t == null ? t === void 0 ? St : Dt : Ie && Ie in Object(t) ? xt(t) : Ct(t);
}
function _t(t) {
  return t != null && typeof t == "object";
}
var Lt = Array.isArray;
const Tt = Lt;
var Et = "[object String]";
function Ae(t) {
  return typeof t == "string" || !Tt(t) && _t(t) && Ot(t) == Et;
}
const Bt = ({
  availableConnectors: t,
  installedWallets: e,
  discoveryWallets: r,
  storeVersion: n
}) => {
  if (window?.starknet_argentX?.isInAppBrowser) return [];
  const l = e.map(a => t.find(u => u.id === a.id));
  return [...t.filter(a => l.includes(a)), ...t.filter(a => !l.includes(a))].map(a => {
    const u = e.find(b => b.id === a.id);
    if (u) {
      const b = u.id === "argentX" ? J.ARGENT_X_ICON : u.icon;
      return {
        name: u.name,
        id: u.id,
        icon: {
          light: b,
          dark: b
        },
        connector: a
      };
    }
    const g = r.filter(b => !!b.downloads[n]).find(b => b.id === a.id);
    if (g) {
      const {
          downloads: b
        } = g,
        h = g.id === "argentX" ? J.ARGENT_X_ICON : g.icon;
      return {
        name: g.name,
        id: g.id,
        icon: {
          light: h,
          dark: h
        },
        connector: a,
        download: b[n]
      };
    }
    return !a || !a.id || !a.name ? null : {
      name: a.name,
      id: a.id,
      icon: a.icon,
      connector: a,
      title: "title" in a && Ae(a.title) ? a.title : void 0,
      subtitle: "subtitle" in a && Ae(a.subtitle) ? a.subtitle : void 0
    };
  }).filter(a => a !== null);
};
function Q() {}
function Be(t) {
  return t();
}
function xe() {
  return Object.create(null);
}
function B(t) {
  t.forEach(Be);
}
function Fe(t) {
  return typeof t == "function";
}
function We(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
let te;
function Pe(t, e) {
  return te || (te = document.createElement("a")), te.href = e, t === te.href;
}
function Ft(t) {
  return Object.keys(t).length === 0;
}
function v(t, e) {
  t.appendChild(e);
}
function F(t, e, r) {
  t.insertBefore(e, r || null);
}
function _(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function Wt(t, e) {
  for (let r = 0; r < t.length; r += 1) t[r] && t[r].d(e);
}
function A(t) {
  return document.createElement(t);
}
function U(t) {
  return document.createTextNode(t);
}
function T() {
  return U(" ");
}
function Qe() {
  return U("");
}
function D(t, e, r, n) {
  return t.addEventListener(e, r, n), () => t.removeEventListener(e, r, n);
}
function w(t, e, r) {
  r == null ? t.removeAttribute(e) : t.getAttribute(e) !== r && t.setAttribute(e, r);
}
function Pt(t) {
  return Array.from(t.childNodes);
}
function ae(t, e) {
  e = "" + e, t.data !== e && (t.data = e);
}
function Ue(t, e, r, n) {
  r == null ? t.style.removeProperty(e) : t.style.setProperty(e, r, n ? "important" : "");
}
let K;
function q(t) {
  K = t;
}
function Qt() {
  if (!K) throw new Error("Function called outside component initialization");
  return K;
}
function Ut(t) {
  Qt().$$.on_mount.push(t);
}
const R = [],
  je = [];
let G = [];
const ze = [],
  Yt = Promise.resolve();
let be = !1;
function Rt() {
  be || (be = !0, Yt.then(Ye));
}
function pe(t) {
  G.push(t);
}
const fe = new Set();
let Y = 0;
function Ye() {
  if (Y !== 0) return;
  const t = K;
  do {
    try {
      for (; Y < R.length;) {
        const e = R[Y];
        Y++, q(e), Gt(e.$$);
      }
    } catch (e) {
      throw R.length = 0, Y = 0, e;
    }
    for (q(null), R.length = 0, Y = 0; je.length;) je.pop()();
    for (let e = 0; e < G.length; e += 1) {
      const r = G[e];
      fe.has(r) || (fe.add(r), r());
    }
    G.length = 0;
  } while (R.length);
  for (; ze.length;) ze.pop()();
  be = !1, fe.clear(), q(t);
}
function Gt(t) {
  if (t.fragment !== null) {
    t.update(), B(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(pe);
  }
}
function Vt(t) {
  const e = [],
    r = [];
  G.forEach(n => t.indexOf(n) === -1 ? e.push(n) : r.push(n)), r.forEach(n => n()), G = e;
}
const ie = new Set();
let P;
function Re() {
  P = {
    r: 0,
    c: [],
    p: P
  };
}
function Ge() {
  P.r || B(P.c), P = P.p;
}
function E(t, e) {
  t && t.i && (ie.delete(t), t.i(e));
}
function $(t, e, r, n) {
  if (t && t.o) {
    if (ie.has(t)) return;
    ie.add(t), P.c.push(() => {
      ie.delete(t), n && (r && t.d(1), n());
    }), t.o(e);
  } else n && n();
}
function Ce(t) {
  return t?.length !== void 0 ? t : Array.from(t);
}
function Zt(t) {
  t && t.c();
}
function Ve(t, e, r) {
  const {
    fragment: n,
    after_update: i
  } = t.$$;
  n && n.m(e, r), pe(() => {
    const s = t.$$.on_mount.map(Be).filter(Fe);
    t.$$.on_destroy ? t.$$.on_destroy.push(...s) : B(s), t.$$.on_mount = [];
  }), i.forEach(pe);
}
function Ze(t, e) {
  const r = t.$$;
  r.fragment !== null && (Vt(r.after_update), B(r.on_destroy), r.fragment && r.fragment.d(e), r.on_destroy = r.fragment = null, r.ctx = []);
}
function Xt(t, e) {
  t.$$.dirty[0] === -1 && (R.push(t), Rt(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function Xe(t, e, r, n, i, s, l, d = [-1]) {
  const f = K;
  q(t);
  const a = t.$$ = {
    fragment: null,
    ctx: [],
    props: s,
    update: Q,
    not_equal: i,
    bound: xe(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (f ? f.$$.context : [])),
    callbacks: xe(),
    dirty: d,
    skip_bound: !1,
    root: e.target || f.$$.root
  };
  l && l(a.root);
  let u = !1;
  if (a.ctx = r ? r(t, e.props || {}, (g, b, ...h) => {
    const x = h.length ? h[0] : b;
    return a.ctx && i(a.ctx[g], a.ctx[g] = x) && (!a.skip_bound && a.bound[g] && a.bound[g](x), u && Xt(t, g)), b;
  }) : [], a.update(), u = !0, B(a.before_update), a.fragment = n ? n(a.ctx) : !1, e.target) {
    if (e.hydrate) {
      const g = Pt(e.target);
      a.fragment && a.fragment.l(g), g.forEach(_);
    } else a.fragment && a.fragment.c();
    e.intro && E(t.$$.fragment), Ve(t, e.target, e.anchor), Ye();
  }
  q(f);
}
class He {
  constructor() {
    ce(this, "$$");
    ce(this, "$$set");
  }
  $destroy() {
    Ze(this, 1), this.$destroy = Q;
  }
  $on(e, r) {
    if (!Fe(r)) return Q;
    const n = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return n.push(r), () => {
      const i = n.indexOf(r);
      i !== -1 && n.splice(i, 1);
    };
  }
  $set(e) {
    this.$$set && !Ft(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const Ht = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = {
  v: new Set()
})).v.add(Ht);
function qt(t) {
  let e,
    r,
    n,
    i,
    s,
    l = (t[0].title ?? t[0].name) + "",
    d,
    f,
    a,
    u = (t[0].subtitle ?? "") + "",
    g,
    b,
    h,
    x;
  function k(p, m) {
    return p[2] === p[0]?.id ? er : p[4] ? $t : Kt;
  }
  let M = k(t),
    c = M(t);
  return {
    c() {
      e = A("li"), r = A("span"), n = T(), i = A("div"), s = A("p"), d = U(l), f = T(), a = A("p"), g = U(u), b = T(), c.c(), w(r, "class", "w-8 h-8"), w(s, "class", "font-semibold text-base p"), w(a, "class", "l2 p"), Ue(a, "text-align", "center"), w(i, "class", "flex flex-col justify-center items-center"), w(e, "class", `flex flex-row-reverse justify-between items-center 
            p-3 rounded-md cursor-pointer shadow-list-item 
            dark:shadow-none dark:bg-neutral-800 dark:text-white 
          hover:bg-neutral-100 dark:hover:bg-neutral-700 
          focus:outline-none focus:ring-2 
        focus:ring-neutral-200 dark:focus:ring-neutral-700 
          transition-colors`), w(e, "role", "button"), w(e, "tabindex", "0");
    },
    m(p, m) {
      F(p, e, m), v(e, r), v(e, n), v(e, i), v(i, s), v(s, d), v(i, f), v(i, a), v(a, g), v(e, b), c.m(e, null), h || (x = [D(e, "click", t[8]), D(e, "keyup", t[9])], h = !0);
    },
    p(p, m) {
      m & 1 && l !== (l = (p[0].title ?? p[0].name) + "") && ae(d, l), m & 1 && u !== (u = (p[0].subtitle ?? "") + "") && ae(g, u), M === (M = k(p)) && c ? c.p(p, m) : (c.d(1), c = M(p), c && (c.c(), c.m(e, null)));
    },
    d(p) {
      p && _(e), c.d(), h = !1, B(x);
    }
  };
}
function Jt(t) {
  let e,
    r,
    n,
    i,
    s,
    l,
    d = t[0].name + "",
    f,
    a,
    u,
    g,
    b,
    h,
    x,
    k,
    M;
  return {
    c() {
      e = A("a"), r = A("li"), n = A("span"), i = T(), s = A("p"), l = U("Install "), f = U(d), a = T(), u = A("img"), w(n, "class", "w-8 h-8"), w(s, "class", "font-semibold text-base p"), w(u, "alt", g = t[0].name), Pe(u.src, b = t[3]) || w(u, "src", b), w(u, "class", "w-8 h-8 rounded-full"), w(r, "class", `flex flex-row-reverse justify-between items-center 
              p-3 rounded-md cursor-pointer shadow-list-item 
              dark:shadow-none dark:bg-neutral-800 dark:text-white 
            hover:bg-neutral-100 dark:hover:bg-neutral-700`), w(e, "aria-label", h = t[0].name + " download link"), w(e, "href", x = t[0].download), w(e, "target", "_blank"), w(e, "rel", "noopener noreferrer"), w(e, "class", `rounded-md focus:outline-none  focus:ring-2 
    focus:ring-neutral-200  dark:focus:ring-neutral-700 transition-colors`);
    },
    m(c, p) {
      F(c, e, p), v(e, r), v(r, n), v(r, i), v(r, s), v(s, l), v(s, f), v(r, a), v(r, u), k || (M = [D(r, "click", t[6]), D(r, "keyup", t[7])], k = !0);
    },
    p(c, p) {
      p & 1 && d !== (d = c[0].name + "") && ae(f, d), p & 1 && g !== (g = c[0].name) && w(u, "alt", g), p & 1 && h !== (h = c[0].name + " download link") && w(e, "aria-label", h), p & 1 && x !== (x = c[0].download) && w(e, "href", x);
    },
    d(c) {
      c && _(e), k = !1, B(M);
    }
  };
}
function Kt(t) {
  let e, r, n;
  return {
    c() {
      e = A("img"), w(e, "alt", r = t[0]?.name), Pe(e.src, n = t[3]) || w(e, "src", n), w(e, "class", "w-8 h-8 rounded");
    },
    m(i, s) {
      F(i, e, s);
    },
    p(i, s) {
      s & 1 && r !== (r = i[0]?.name) && w(e, "alt", r);
    },
    d(i) {
      i && _(e);
    }
  };
}
function $t(t) {
  let e;
  return {
    c() {
      e = A("div"), Ue(e, "position", "relative");
    },
    m(r, n) {
      F(r, e, n), e.innerHTML = t[3];
    },
    p: Q,
    d(r) {
      r && _(e);
    }
  };
}
function er(t) {
  let e;
  return {
    c() {
      e = A("div"), e.innerHTML = '<svg aria-hidden="true" class="w-8 h-8 text-neutral-300 animate-spin dark:text-neutral-600 fill-neutral-600 dark:fill-neutral-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path></svg> <span class="sr-only">Loading...</span>', w(e, "role", "status");
    },
    m(r, n) {
      F(r, e, n);
    },
    p: Q,
    d(r) {
      r && _(e);
    }
  };
}
function tr(t) {
  let e;
  function r(s, l) {
    return s[0].download ? Jt : qt;
  }
  let n = r(t),
    i = n(t);
  return {
    c() {
      i.c(), e = Qe();
    },
    m(s, l) {
      i.m(s, l), F(s, e, l);
    },
    p(s, [l]) {
      n === (n = r(s)) && i ? i.p(s, l) : (i.d(1), i = n(s), i && (i.c(), i.m(e.parentNode, e)));
    },
    i: Q,
    o: Q,
    d(s) {
      s && _(e), i.d(s);
    }
  };
}
function rr(t, e, r) {
  let {
      wallet: n
    } = e,
    {
      theme: i = null
    } = e,
    {
      cb: s = async () => {}
    } = e,
    {
      loadingItem: l = !1
    } = e;
  const d = i === "dark" ? n.icon.dark : n.icon.light,
    f = d?.startsWith("<svg"),
    a = () => {
      s(null);
    },
    u = h => {
      h.key === "Enter" && s(null);
    },
    g = async () => {
      s(n.connector);
    },
    b = async h => {
      h.key === "Enter" && s(n.connector);
    };
  return t.$$set = h => {
    "wallet" in h && r(0, n = h.wallet), "theme" in h && r(5, i = h.theme), "cb" in h && r(1, s = h.cb), "loadingItem" in h && r(2, l = h.loadingItem);
  }, [n, s, l, d, f, i, a, u, g, b];
}
class nr extends He {
  constructor(e) {
    super(), Xe(this, e, rr, tr, We, {
      wallet: 0,
      theme: 5,
      cb: 1,
      loadingItem: 2
    });
  }
}
function De(t, e, r) {
  const n = t.slice();
  return n[14] = e[r], n;
}
function Se(t) {
  let e,
    r,
    n,
    i,
    s,
    l,
    d,
    f,
    a,
    u,
    g,
    b,
    h,
    x,
    k,
    M = Ce(t[1]),
    c = [];
  for (let m = 0; m < M.length; m += 1) c[m] = Oe(De(t, M, m));
  const p = m => $(c[m], 1, 1, () => {
    c[m] = null;
  });
  return {
    c() {
      e = A("div"), r = A("main"), n = A("header"), i = A("h2"), i.textContent = "Connect to", s = T(), l = A("h1"), d = U(t[0]), f = T(), a = A("span"), a.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.77275 3.02275C9.99242 2.80308 9.99242 2.44692 9.77275 2.22725C9.55308 2.00758 9.19692 2.00758 8.97725 2.22725L6 5.20451L3.02275 2.22725C2.80308 2.00758 2.44692 2.00758 2.22725 2.22725C2.00758 2.44692 2.00758 2.80308 2.22725 3.02275L5.20451 6L2.22725 8.97725C2.00758 9.19692 2.00758 9.55308 2.22725 9.77275C2.44692 9.99242 2.80308 9.99242 3.02275 9.77275L6 6.79549L8.97725 9.77275C9.19692 9.99242 9.55308 9.99242 9.77275 9.77275C9.99242 9.55308 9.99242 9.19692 9.77275 8.97725L6.79549 6L9.77275 3.02275Z" fill="currentColor"></path></svg>', u = T(), g = A("ul");
      for (let m = 0; m < c.length; m += 1) c[m].c();
      w(i, "class", "text-sm text-gray-400 font-semibold"), w(l, "class", `text-xl font-semibold mb-6 
                  max-w-[240px] overflow-hidden 
                  whitespace-nowrap text-ellipsis`), w(a, "class", `absolute top-0 right-0 p-2 cursor-pointer
                  rounded-full bg-neutral-100 dark:bg-neutral-800
                  text-neutral-400 dark:text-white
                  hover:bg-neutral-100 dark:hover:bg-neutral-700
                  focus:outline-none focus:ring-2
                focus:ring-neutral-200 dark:focus:ring-neutral-700
                  transition-colors`), w(a, "role", "button"), w(a, "tabindex", "0"), w(a, "aria-label", "Close"), w(n, "class", "flex items-center justify-center flex-col mb-2 relative"), w(g, "class", "flex flex-col gap-3"), w(r, "role", "dialog"), w(r, "class", `rounded-3xl shadow-modal dark:shadow-none 
              w-full max-w-[380px] z-50 
              mx-6 p-6 pb-8 text-center 
              bg-slate-50 dark:bg-neutral-900 
            text-neutral-900 dark:text-white`), w(e, "part", "starknetkit-modal"), w(e, "class", b = `modal-font backdrop-blur-sm fixed inset-0 flex items-center 
            justify-center bg-black/25 z-[9999] ${t[4]}`);
    },
    m(m, z) {
      F(m, e, z), v(e, r), v(r, n), v(n, i), v(n, s), v(n, l), v(l, d), v(n, f), v(n, a), v(r, u), v(r, g);
      for (let I = 0; I < c.length; I += 1) c[I] && c[I].m(g, null);
      h = !0, x || (k = [D(a, "click", t[8]), D(a, "keyup", t[9]), D(r, "click", or), D(r, "keyup", sr), D(e, "click", t[10]), D(e, "keyup", t[11])], x = !0);
    },
    p(m, z) {
      if ((!h || z & 1) && ae(d, m[0]), z & 78) {
        M = Ce(m[1]);
        let I;
        for (I = 0; I < M.length; I += 1) {
          const Me = De(m, M, I);
          c[I] ? (c[I].p(Me, z), E(c[I], 1)) : (c[I] = Oe(Me), c[I].c(), E(c[I], 1), c[I].m(g, null));
        }
        for (Re(), I = M.length; I < c.length; I += 1) p(I);
        Ge();
      }
      (!h || z & 16 && b !== (b = `modal-font backdrop-blur-sm fixed inset-0 flex items-center 
            justify-center bg-black/25 z-[9999] ${m[4]}`)) && w(e, "class", b);
    },
    i(m) {
      if (!h) {
        for (let z = 0; z < M.length; z += 1) E(c[z]);
        h = !0;
      }
    },
    o(m) {
      c = c.filter(Boolean);
      for (let z = 0; z < c.length; z += 1) $(c[z]);
      h = !1;
    },
    d(m) {
      m && _(e), Wt(c, m), x = !1, B(k);
    }
  };
}
function Oe(t) {
  let e, r;
  return e = new nr({
    props: {
      wallet: t[14],
      loadingItem: t[3],
      cb: t[6],
      theme: t[2]
    }
  }), {
    c() {
      Zt(e.$$.fragment);
    },
    m(n, i) {
      Ve(e, n, i), r = !0;
    },
    p(n, i) {
      const s = {};
      i & 2 && (s.wallet = n[14]), i & 8 && (s.loadingItem = n[3]), i & 4 && (s.theme = n[2]), e.$set(s);
    },
    i(n) {
      r || (E(e.$$.fragment, n), r = !0);
    },
    o(n) {
      $(e.$$.fragment, n), r = !1;
    },
    d(n) {
      Ze(e, n);
    }
  };
}
function ir(t) {
  let e,
    r,
    n = !t[5] && t[1].length > 1 && Se(t);
  return {
    c() {
      n && n.c(), e = Qe();
    },
    m(i, s) {
      n && n.m(i, s), F(i, e, s), r = !0;
    },
    p(i, [s]) {
      !i[5] && i[1].length > 1 ? n ? (n.p(i, s), s & 2 && E(n, 1)) : (n = Se(i), n.c(), E(n, 1), n.m(e.parentNode, e)) : n && (Re(), $(n, 1, 1, () => {
        n = null;
      }), Ge());
    },
    i(i) {
      r || (E(n), r = !0);
    },
    o(i) {
      $(n), r = !1;
    },
    d(i) {
      i && _(e), n && n.d(i);
    }
  };
}
const or = t => t.stopPropagation(),
  sr = t => {
    t.stopPropagation();
  };
function ar(t, e, r) {
  let {
      dappName: n = window?.document.title ?? ""
    } = e,
    {
      modalWallets: i
    } = e,
    {
      callback: s = async () => {}
    } = e,
    {
      theme: l = null
    } = e,
    d = !1,
    a = window?.starknet_argentX?.isInAppBrowser;
  const u = c => {
    r(3, d = c);
  };
  let g = async c => {
      u(c?.id ?? !1);
      try {
        await s(c ?? null);
      } finally {
        u(!1);
      }
    },
    b = l === "dark" ? "dark" : "";
  Ut(async () => {
    if (l === "dark" || l === null && window.matchMedia("(prefers-color-scheme: dark)").matches ? r(4, b = "dark") : r(4, b = ""), a && window?.starknet_argentX) {
      try {
        s(new J.InjectedConnector({
          options: {
            id: "argentX"
          }
        }));
      } catch {}
      return;
    }
    if (i.length === 1) try {
      const [c] = i;
      await s(c.connector);
    } catch (c) {
      console.error(c);
    }
  });
  const h = () => g(null),
    x = c => {
      c.key === "Enter" && g(null);
    },
    k = () => g(null),
    M = c => {
      c.key === "Escape" && g(null);
    };
  return t.$$set = c => {
    "dappName" in c && r(0, n = c.dappName), "modalWallets" in c && r(1, i = c.modalWallets), "callback" in c && r(7, s = c.callback), "theme" in c && r(2, l = c.theme);
  }, [n, i, l, d, b, a, g, s, h, x, k, M];
}
class cr extends He {
  constructor(e) {
    super(), Xe(this, e, ar, ir, We, {
      dappName: 0,
      modalWallets: 1,
      callback: 7,
      theme: 2
    });
  }
}
const lr = `@import"https://fonts.googleapis.com/css2?family=Barlow:wght@500;600&display=swap";.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.visible{visibility:visible}.static{position:static}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-0{inset:0}.top-0{top:0}.right-0{right:0}.z-\\[9999\\]{z-index:9999}.z-50{z-index:50}.mx-6{margin-left:1.5rem;margin-right:1.5rem}.mb-2{margin-bottom:.5rem}.mb-6{margin-bottom:1.5rem}.block{display:block}.inline{display:inline}.flex{display:flex}.h-8{height:2rem}.w-8{width:2rem}.w-full{width:100%}.max-w-\\[380px\\]{max-width:380px}.max-w-\\[240px\\]{max-width:240px}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@keyframes spin{to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}.cursor-pointer{cursor:pointer}.flex-row-reverse{flex-direction:row-reverse}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.overflow-hidden{overflow:hidden}.text-ellipsis{text-overflow:ellipsis}.whitespace-nowrap{white-space:nowrap}.rounded-md{border-radius:.375rem}.rounded-full{border-radius:9999px}.rounded{border-radius:.25rem}.rounded-3xl{border-radius:1.5rem}.border{border-width:1px}.bg-black\\/25{background-color:#00000040}.bg-slate-50{--tw-bg-opacity: 1;background-color:rgb(248 250 252 / var(--tw-bg-opacity))}.bg-neutral-100{--tw-bg-opacity: 1;background-color:rgb(245 245 245 / var(--tw-bg-opacity))}.fill-neutral-600{fill:#525252}.p-3{padding:.75rem}.p-6{padding:1.5rem}.p-2{padding:.5rem}.pb-8{padding-bottom:2rem}.text-center{text-align:center}.text-base{font-size:1rem;line-height:1.5rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.font-semibold{font-weight:600}.text-neutral-300{--tw-text-opacity: 1;color:rgb(212 212 212 / var(--tw-text-opacity))}.text-neutral-900{--tw-text-opacity: 1;color:rgb(23 23 23 / var(--tw-text-opacity))}.text-gray-400{--tw-text-opacity: 1;color:rgb(156 163 175 / var(--tw-text-opacity))}.text-neutral-400{--tw-text-opacity: 1;color:rgb(163 163 163 / var(--tw-text-opacity))}.shadow-list-item{--tw-shadow: 0px 2px 12px rgba(0, 0, 0, .12);--tw-shadow-colored: 0px 2px 12px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-modal{--tw-shadow: 0px 4px 20px rgba(0, 0, 0, .5);--tw-shadow-colored: 0px 4px 20px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.outline{outline-style:solid}.blur{--tw-blur: blur(8px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.backdrop-blur-sm{--tw-backdrop-blur: blur(4px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.transition-colors{transition-property:color,background-color,border-color,fill,stroke,-webkit-text-decoration-color;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,-webkit-text-decoration-color;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.modal-font{font-family:Barlow,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%;text-size-adjust:100%;font-feature-settings:"kern"}.l2{color:#8c8c8c;font-size:12px;font-weight:500;line-height:14px;letter-spacing:0em;text-align:left}.p{margin:0}.hover\\:bg-neutral-100:hover{--tw-bg-opacity: 1;background-color:rgb(245 245 245 / var(--tw-bg-opacity))}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus\\:ring-2:focus{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.focus\\:ring-neutral-200:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(229 229 229 / var(--tw-ring-opacity))}.dark .dark\\:bg-neutral-800{--tw-bg-opacity: 1;background-color:rgb(38 38 38 / var(--tw-bg-opacity))}.dark .dark\\:bg-neutral-900{--tw-bg-opacity: 1;background-color:rgb(23 23 23 / var(--tw-bg-opacity))}.dark .dark\\:fill-neutral-300{fill:#d4d4d4}.dark .dark\\:text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.dark .dark\\:text-neutral-600{--tw-text-opacity: 1;color:rgb(82 82 82 / var(--tw-text-opacity))}.dark .dark\\:shadow-none{--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.dark .dark\\:hover\\:bg-neutral-700:hover{--tw-bg-opacity: 1;background-color:rgb(64 64 64 / var(--tw-bg-opacity))}.dark .dark\\:focus\\:ring-neutral-700:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(64 64 64 / var(--tw-ring-opacity))}
`,
  dr = t => ({
    starknetkitConnectModal: async () => await qe({
      ...t,
      resultType: t.resultType ?? "connector"
    })
  });
let O = null;
const qe = async ({
    modalMode: t = "canAsk",
    storeVersion: e = bt(),
    modalTheme: r,
    dappName: n,
    webWalletUrl: i = _e.DEFAULT_WEBWALLET_URL,
    argentMobileOptions: s,
    connectors: l = [],
    resultType: d = "wallet",
    provider: f,
    ...a
  } = {}) => {
    O = null;
    const u = !l || l.length === 0 ? pt({
        argentMobileOptions: s,
        webWalletUrl: i,
        provider: f
      }) : l,
      g = localStorage.getItem("starknetLastConnectedWallet");
    if (t === "neverAsk") try {
      const k = u.find(M => M.id === g);
      return d === "wallet" && (await k?.connect()), O = k ?? null, {
        connector: k,
        wallet: k?.wallet ?? null
      };
    } catch (k) {
      throw we.removeStarknetLastConnectedWallet(), new Error(k);
    }
    const b = await ne.getAvailableWallets(a);
    if (t === "canAsk" && g && ((await ne.getPreAuthorizedWallets({
      ...a
    })).find(c => c.id === g) ?? b.length === 1 ? b[0] : void 0)) {
      const c = u.find(p => p.id === g);
      return d === "wallet" && (await c?.connect()), c && (O = c), {
        connector: c,
        wallet: c?.wallet ?? null
      };
    }
    const h = Bt({
        availableConnectors: u,
        installedWallets: b,
        discoveryWallets: await ne.getDiscoveryWallets(a),
        storeVersion: e
      }),
      x = () => {
        const k = "starknetkit-modal-container",
          M = document.getElementById(k);
        if (M) {
          if (M.shadowRoot) return M.shadowRoot;
          M.remove();
        }
        const c = document.createElement("div");
        c.id = k, document.body.appendChild(c);
        const p = c.attachShadow({
          mode: "open"
        });
        return p.innerHTML = `<style>${lr}</style>`, p;
      };
    return new Promise((k, M) => {
      const c = new cr({
        target: x(),
        props: {
          dappName: n,
          callback: async p => {
            try {
              O = p, d === "wallet" ? (await p?.connect(), p !== null && p.id !== "argentWebWallet" && we.setStarknetLastConnectedWallet(p.id), k({
                connector: p,
                wallet: p?.wallet ?? null
              })) : k({
                connector: p
              });
            } catch (m) {
              M(m);
            } finally {
              setTimeout(() => c.$destroy());
            }
          },
          theme: r === "system" ? null : r ?? null,
          modalWallets: h
        }
      });
    });
  },
  ur = () => O ? O.wallet : null,
  gr = async (t = {}) => (we.removeStarknetLastConnectedWallet(), O && (await O.disconnect()), O = null, ne.disconnect(t));
exports.connect = qe;
exports.disconnect = gr;
exports.getSelectedConnectorWallet = ur;
exports.useStarknetkitConnectModal = dr;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./index-63073fd9.cjs":5,"./index-6f5141f0.cjs":6,"./index-a73af6c1.cjs":8,"./lastConnected-080a1315.cjs":11,"./publicRcpNodes-77022e83.cjs":13,"starknet":undefined}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "WebWalletConnector", {
  enumerable: true,
  get: function () {
    return _indexC4ef.W;
  }
});
require("./lastConnected-b964dc30.js");
var _indexC4ef = require("./index-c4ef0430.js");
require("starknet");
require("./publicRcpNodes-be041588.js");

},{"./index-c4ef0430.js":9,"./lastConnected-b964dc30.js":12,"./publicRcpNodes-be041588.js":14,"starknet":undefined}],17:[function(require,module,exports){
'use strict';

module.exports = function () {
  throw new Error(
    'ws does not work in the browser. Browser clients must use the native ' +
      'WebSocket object'
  );
};

},{}],18:[function(require,module,exports){
const starknetkit = require("starknetkit");
const starknetkitArgentMobile = require("starknetkit/dist/argentMobile.js");
const starknetkitInjected = require("starknetkit/dist/injectedConnector.js");
const starknetkitWebwallet = require("starknetkit/dist/webwalletConnector.js");
module.exports = {starknetkit,starknetkitArgentMobile,starknetkitInjected,starknetkitWebwallet};
},{"starknetkit":15,"starknetkit/dist/argentMobile.js":2,"starknetkit/dist/injectedConnector.js":10,"starknetkit/dist/webwalletConnector.js":16}]},{},[18])(18)
});
