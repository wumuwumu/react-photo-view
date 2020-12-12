'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var classNames = _interopDefault(require('classnames'));
var reactDom = require('react-dom');

/*! *****************************************************************************
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
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

var PhotoContext = React.createContext({
    onShow: function () { },
    addItem: function () { },
    removeItem: function () { },
});

function Spinner() {
    return (React.createElement("div", { className: "PhotoView__Spinner" },
        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", width: "36", height: "36", fill: "white" },
            React.createElement("path", { opacity: ".25", d: "M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4" }),
            React.createElement("path", { d: "M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z" }))));
}

/**
 * 获取图片合适的大小
 */
function getSuitableImageSize(naturalWidth, naturalHeight, rotate) {
    var _a;
    var width;
    var height;
    var y = 0;
    var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
    var isVertical = rotate % 180 !== 0;
    // 若图片不是水平则调换宽高
    if (isVertical) {
        _a = [innerWidth, innerHeight], innerHeight = _a[0], innerWidth = _a[1];
    }
    var autoWidth = (naturalWidth / naturalHeight) * innerHeight;
    var autoHeight = (naturalHeight / naturalWidth) * innerWidth;
    if (naturalWidth < innerWidth && naturalHeight < innerHeight) {
        width = naturalWidth;
        height = naturalHeight;
    }
    else if (naturalWidth < innerWidth && naturalHeight >= innerHeight) {
        width = autoWidth;
        height = innerHeight;
    }
    else if (naturalWidth >= innerWidth && naturalHeight < innerHeight) {
        width = innerWidth;
        height = autoHeight;
    }
    else if (naturalWidth / naturalHeight > innerWidth / innerHeight) {
        width = innerWidth;
        height = autoHeight;
    }
    // 长图模式
    else if (naturalHeight / naturalWidth >= 3 && !isVertical) {
        width = innerWidth;
        height = autoHeight;
        // 默认定位到顶部区域
        y = (height - innerHeight) / 2;
    }
    else {
        width = autoWidth;
        height = innerHeight;
    }
    return {
        width: Math.floor(width),
        height: Math.floor(height),
        x: 0,
        y: y,
        scale: 1,
    };
}

function useMountedState() {
    var mountedRef = React.useRef(false);
    React.useEffect(function () {
        mountedRef.current = true;
        return function () {
            mountedRef.current = false;
        };
    });
    return React.useCallback(function () { return mountedRef.current; }, []);
}

var Photo = function (props) {
    var src = props.src, intro = props.intro, loaded = props.loaded, broken = props.broken, width = props.width, height = props.height, rotate = props.rotate, className = props.className, onImageLoad = props.onImageLoad, loadingElement = props.loadingElement, brokenElement = props.brokenElement, restProps = __rest(props, ["src", "intro", "loaded", "broken", "width", "height", "rotate", "className", "onImageLoad", "loadingElement", "brokenElement"]);
    var isMounted = useMountedState();
    function handleImageLoaded(e) {
        var _a = e.target, naturalWidth = _a.naturalWidth, naturalHeight = _a.naturalHeight;
        if (isMounted()) {
            onImageLoad(__assign({ loaded: true, naturalWidth: naturalWidth,
                naturalHeight: naturalHeight }, getSuitableImageSize(naturalWidth, naturalHeight, rotate)));
        }
    }
    function handleImageBroken() {
        if (isMounted()) {
            onImageLoad({
                broken: true,
            });
        }
    }
    React.useEffect(function () {
        var currPhoto = new Image();
        currPhoto.onload = handleImageLoaded;
        currPhoto.onerror = handleImageBroken;
        currPhoto.src = src;
    }, []);
    if (src && !broken) {
        if (loaded) {
            return (React.createElement("img", __assign({ className: classNames('PhotoView__Photo', className), src: src, width: width, height: height, alt: "" }, restProps)));
        }
        return loadingElement || React.createElement(Spinner, null);
    }
    if (brokenElement) {
        if (typeof brokenElement === 'function') {
            return brokenElement({
                src: src,
                intro: intro,
            });
        }
        return brokenElement;
    }
    return null;
};
Photo.displayName = 'Photo';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var lodash_debounce = debounce;

/**
 * throttle
 * @param func
 * @param wait
 */
function throttle(func, wait) {
    return lodash_debounce(func, wait, {
        leading: true,
        maxWait: wait,
        trailing: true,
    });
}

/**
 * 是否支持触摸设备
 */
var isTouchDevice = typeof document !== 'undefined' && 'ontouchstart' in document.documentElement;

/**
 * 从 Touch 事件中获取两个触控中心位置
 */
function getMultipleTouchPosition(evt) {
    var _a = evt.touches[0], clientX = _a.clientX, clientY = _a.clientY;
    if (evt.touches.length >= 2) {
        var _b = evt.touches[1], nextClientX = _b.clientX, nextClientY = _b.clientY;
        return {
            clientX: (clientX + nextClientX) / 2,
            clientY: (clientY + nextClientY) / 2,
            touchLength: Math.sqrt(Math.pow(nextClientX - clientX, 2) + Math.pow(nextClientY - clientY, 2)),
        };
    }
    return { clientX: clientX, clientY: clientY, touchLength: 0 };
}

/**
 * 获取移动或缩放之后的中心点
 */
function getPositionOnMoveOrScale(_a) {
    var x = _a.x, y = _a.y, clientX = _a.clientX, clientY = _a.clientY, _b = _a.offsetX, offsetX = _b === void 0 ? 0 : _b, _c = _a.offsetY, offsetY = _c === void 0 ? 0 : _c, fromScale = _a.fromScale, toScale = _a.toScale;
    var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
    var centerClientX = innerWidth / 2;
    var centerClientY = innerHeight / 2;
    // 坐标偏移
    var lastPositionX = centerClientX + x;
    var lastPositionY = centerClientY + y;
    // 放大偏移量
    var offsetScale = toScale / fromScale;
    // 偏移位置
    var originX = clientX - (clientX - lastPositionX) * offsetScale - centerClientX;
    var originY = clientY - (clientY - lastPositionY) * offsetScale - centerClientY;
    return {
        x: originX + offsetX,
        y: originY + offsetY,
        scale: toScale,
        lastMoveClientX: clientX,
        lastMoveClientY: clientY,
    };
}

/**
 * 最大触摸时间
 */
var maxTouchTime = 200;
/**
 * 最大滑动切换图片距离
 */
var maxMoveOffset = 40;
/**
 * 图片的间隔
 */
var horizontalOffset = 20;
/**
 * 最小初始响应距离
 */
var minStartTouchOffset = 10;
/**
 * 默认背景透明度
 */
var defaultOpacity = 1;
/**
 * 最小缩放度
 */
var minScale = 1;
/**
 * 最大缩放度（若图片足够大，则会超出）
 */
var maxScale = 6;
/**
 * 滑动加速度
 */
var slideAcceleration = 0.005;
/**
 * 缩放弹性缓冲
 */
var scaleBuffer = 0.2;

/**
 * 边缘超出状态
 */
var CloseEdgeEnum;
(function (CloseEdgeEnum) {
    CloseEdgeEnum[CloseEdgeEnum["Normal"] = 0] = "Normal";
    CloseEdgeEnum[CloseEdgeEnum["Small"] = 1] = "Small";
    CloseEdgeEnum[CloseEdgeEnum["Before"] = 2] = "Before";
    CloseEdgeEnum[CloseEdgeEnum["After"] = 3] = "After";
})(CloseEdgeEnum || (CloseEdgeEnum = {}));
/**
 * 边缘触发状态
 */
var ReachTypeEnum;
(function (ReachTypeEnum) {
    ReachTypeEnum[ReachTypeEnum["Normal"] = 0] = "Normal";
    ReachTypeEnum[ReachTypeEnum["XReach"] = 1] = "XReach";
    ReachTypeEnum[ReachTypeEnum["YReach"] = 2] = "YReach";
})(ReachTypeEnum || (ReachTypeEnum = {}));
/**
 * 初始响应状态
 */
var TouchStartEnum;
(function (TouchStartEnum) {
    TouchStartEnum[TouchStartEnum["Normal"] = 0] = "Normal";
    TouchStartEnum[TouchStartEnum["X"] = 1] = "X";
    TouchStartEnum[TouchStartEnum["YPush"] = 2] = "YPush";
    TouchStartEnum[TouchStartEnum["YPull"] = 3] = "YPull";
})(TouchStartEnum || (TouchStartEnum = {}));
/**
 * 动画类型
 */
var ShowAnimateEnum;
(function (ShowAnimateEnum) {
    ShowAnimateEnum[ShowAnimateEnum["None"] = 0] = "None";
    ShowAnimateEnum[ShowAnimateEnum["In"] = 1] = "In";
    ShowAnimateEnum[ShowAnimateEnum["Out"] = 2] = "Out";
})(ShowAnimateEnum || (ShowAnimateEnum = {}));

/**
 * 接触左边/上边 或 右边/下边边缘
 * @param position - x/y
 * @param scale
 * @param size - width/height
 * @param innerSize - innerWidth/innerHeight
 * @return CloseEdgeEnum
 */
function getClosedEdge(position, scale, size, innerSize) {
    var currentWidth = size * scale;
    // 图片超出的宽度
    var outOffsetX = (currentWidth - innerSize) / 2;
    if (currentWidth <= innerSize) {
        return CloseEdgeEnum.Small;
    }
    else if (position > 0 && outOffsetX - position <= 0) {
        return CloseEdgeEnum.Before;
    }
    else if (position < 0 && outOffsetX + position <= 0) {
        return CloseEdgeEnum.After;
    }
    return CloseEdgeEnum.Normal;
}
/**
 * 获取接触边缘类型
 * @param initialTouchState
 * @param horizontalCloseEdge
 * @param verticalCloseEdge
 * @param reachState
 */
function getReachType(_a) {
    var initialTouchState = _a.initialTouchState, horizontalCloseEdge = _a.horizontalCloseEdge, verticalCloseEdge = _a.verticalCloseEdge, reachState = _a.reachState;
    if ((horizontalCloseEdge > 0 && initialTouchState === TouchStartEnum.X) || reachState === ReachTypeEnum.XReach) {
        return ReachTypeEnum.XReach;
    }
    else if ((verticalCloseEdge > 0 &&
        (initialTouchState === TouchStartEnum.YPull || initialTouchState === TouchStartEnum.YPush)) ||
        reachState === ReachTypeEnum.YReach) {
        return ReachTypeEnum.YReach;
    }
    return ReachTypeEnum.Normal;
}

/**
 * 适应到合适的图片偏移量
 */
function slideToPosition(_a) {
    var _b;
    var x = _a.x, y = _a.y, lastX = _a.lastX, lastY = _a.lastY, width = _a.width, height = _a.height, scale = _a.scale, rotate = _a.rotate, touchedTime = _a.touchedTime;
    var moveTime = Date.now() - touchedTime;
    // 初始速度
    var speedX = (x - lastX) / moveTime;
    var speedY = (y - lastY) / moveTime;
    // 停下所消耗时间
    var slideTimeX = Math.abs(speedX / slideAcceleration);
    var slideTimeY = Math.abs(speedY / slideAcceleration);
    // 计划滑动位置
    var planX = Math.floor(x + speedX * slideTimeX);
    var planY = Math.floor(y + speedY * slideTimeY);
    // 若图片不是水平则调换属性
    if (rotate % 180 !== 0) {
        _b = [height, width], width = _b[0], height = _b[1];
    }
    var currentX = planX;
    var currentY = planY;
    var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
    // 图片超出的长度
    var outOffsetX = (width * scale - innerWidth) / 2;
    var outOffsetY = (height * scale - innerHeight) / 2;
    var horizontalCloseEdge = getClosedEdge(planX, scale, width, innerWidth);
    var verticalCloseEdge = getClosedEdge(planY, scale, height, innerHeight);
    // x
    if (horizontalCloseEdge === CloseEdgeEnum.Small) {
        currentX = 0;
    }
    else if (horizontalCloseEdge === CloseEdgeEnum.Before) {
        currentX = outOffsetX;
    }
    else if (horizontalCloseEdge === CloseEdgeEnum.After) {
        currentX = -outOffsetX;
    }
    // y
    if (verticalCloseEdge === CloseEdgeEnum.Small) {
        currentY = 0;
    }
    else if (verticalCloseEdge === CloseEdgeEnum.Before) {
        currentY = outOffsetY;
    }
    else if (verticalCloseEdge === CloseEdgeEnum.After) {
        currentY = -outOffsetY;
    }
    // 时间过长
    if (moveTime >= maxTouchTime &&
        horizontalCloseEdge === CloseEdgeEnum.Normal &&
        verticalCloseEdge === CloseEdgeEnum.Normal) {
        return {
            x: x,
            y: y,
        };
    }
    return {
        x: currentX,
        y: currentY,
    };
}

/**
 * 单击和双击事件处理
 * @param singleTap - 单击事件
 * @param doubleTap - 双击事件
 * @return invokeTap
 */
function withContinuousTap(singleTap, doubleTap) {
    // 当前连续点击次数
    var continuousClick = 0;
    var withDebounceTap = lodash_debounce(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        continuousClick = 0;
        singleTap.apply(void 0, args);
    }, 300);
    return function invokeTap() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        continuousClick += 1;
        withDebounceTap.apply(void 0, args);
        // 双击
        if (continuousClick >= 2) {
            withDebounceTap.cancel();
            continuousClick = 0;
            doubleTap.apply(void 0, args);
        }
    };
}

function getAnimateOrigin(originRect, width, height) {
    if (originRect) {
        var innerWidth_1 = window.innerWidth, innerHeight_1 = window.innerHeight;
        var xOrigin = (width - innerWidth_1) / 2 + originRect.clientX;
        var yOrigin = (height - innerHeight_1) / 2 + originRect.clientY;
        return xOrigin + "px " + yOrigin + "px";
    }
    return undefined;
}

/**
 * 纠正缩放后偏离中心区域位置
 */
function correctSuitablePosition(_a) {
    var x = _a.x, y = _a.y, scale = _a.scale;
    if (scale <= 1) {
        return {
            x: 0,
            y: 0,
        };
    }
    return {
        x: x,
        y: y,
    };
}

var initialState = {
    // 真实宽度
    naturalWidth: 1,
    // 真实高度
    naturalHeight: 1,
    // 宽度
    width: 1,
    // 高度
    height: 1,
    // 加载成功状态
    loaded: false,
    // 破碎状态
    broken: false,
    // 图片 X 偏移量
    x: 0,
    // 图片 y 偏移量
    y: 0,
    // 图片缩放程度
    scale: 1,
    // 图片处于触摸的状态
    touched: false,
    // 背景处于触摸状态
    maskTouched: false,
    // 触摸开始时 x 原始坐标
    clientX: 0,
    // 触摸开始时 y 原始坐标
    clientY: 0,
    // 触摸开始时图片 x 偏移量
    lastX: 0,
    // 触摸开始时图片 y 偏移量
    lastY: 0,
    // 上一个触摸状态 x 原始坐标
    lastMoveClientX: 0,
    // 上一个触摸状态 y 原始坐标
    lastMoveClientY: 0,
    // 触摸开始时时间
    touchedTime: 0,
    // 多指触控间距
    lastTouchLength: 0,
    // 当前边缘触发状态
    reachState: ReachTypeEnum.Normal,
};
var PhotoView = /** @class */ (function (_super) {
    __extends(PhotoView, _super);
    function PhotoView(props) {
        var _this = _super.call(this, props) || this;
        _this.state = initialState;
        // 初始响应状态
        _this.initialTouchState = TouchStartEnum.Normal;
        _this.handleImageLoad = function (imageParams) {
            _this.setState(imageParams);
        };
        _this.handleResize = function () {
            var _a = _this.props, onPhotoResize = _a.onPhotoResize, rotate = _a.rotate;
            var _b = _this.state, loaded = _b.loaded, naturalWidth = _b.naturalWidth, naturalHeight = _b.naturalHeight;
            if (loaded) {
                _this.setState(getSuitableImageSize(naturalWidth, naturalHeight, rotate));
                if (onPhotoResize) {
                    onPhotoResize();
                }
            }
        };
        _this.handleStart = function (clientX, clientY, touchLength) {
            if (touchLength === void 0) { touchLength = 0; }
            _this.setState(function (prevState) { return ({
                touched: true,
                clientX: clientX,
                clientY: clientY,
                lastMoveClientX: clientX,
                lastMoveClientY: clientY,
                lastX: prevState.x,
                lastY: prevState.y,
                lastTouchLength: touchLength,
                touchedTime: Date.now(),
            }); });
        };
        _this.onMove = function (newClientX, newClientY, touchLength) {
            var _a;
            if (touchLength === void 0) { touchLength = 0; }
            var _b = _this.props, onReachMove = _b.onReachMove, isActive = _b.isActive, rotate = _b.rotate;
            var _c = _this.state, naturalWidth = _c.naturalWidth, x = _c.x, y = _c.y, clientX = _c.clientX, clientY = _c.clientY, lastMoveClientX = _c.lastMoveClientX, lastMoveClientY = _c.lastMoveClientY, lastX = _c.lastX, lastY = _c.lastY, scale = _c.scale, lastTouchLength = _c.lastTouchLength, reachState = _c.reachState, touched = _c.touched, maskTouched = _c.maskTouched;
            if ((touched || maskTouched) && isActive) {
                var _d = _this.state, width = _d.width, height = _d.height;
                // 若图片不是水平则调换属性
                if (rotate % 180 !== 0) {
                    _a = [height, width], width = _a[0], height = _a[1];
                }
                // 单指最小缩放下，以初始移动距离来判断意图
                if (touchLength === 0 && _this.initialTouchState === TouchStartEnum.Normal) {
                    var isStillX = Math.abs(newClientX - clientX) <= minStartTouchOffset;
                    var isStillY = Math.abs(newClientY - clientY) <= minStartTouchOffset;
                    // 初始移动距离不足
                    if (isStillX && isStillY) {
                        // 方向记录上次移动距离，以便平滑过渡
                        _this.setState({
                            lastMoveClientX: newClientX,
                            lastMoveClientY: newClientY,
                        });
                        return;
                    }
                    // 设置响应状态
                    _this.initialTouchState = !isStillX
                        ? TouchStartEnum.X
                        : newClientY > clientY
                            ? TouchStartEnum.YPull
                            : TouchStartEnum.YPush;
                }
                var offsetX = newClientX - lastMoveClientX;
                var offsetY = newClientY - lastMoveClientY;
                // 边缘触发状态
                var currentReachState = ReachTypeEnum.Normal;
                if (touchLength === 0) {
                    // 边缘超出状态
                    var horizontalCloseEdge = getClosedEdge(offsetX + lastX, scale, width, window.innerWidth);
                    var verticalCloseEdge = getClosedEdge(offsetY + lastY, scale, height, window.innerHeight);
                    // 边缘触发检测
                    currentReachState = getReachType({
                        initialTouchState: _this.initialTouchState,
                        horizontalCloseEdge: horizontalCloseEdge,
                        verticalCloseEdge: verticalCloseEdge,
                        reachState: reachState,
                    });
                    // 接触边缘
                    if (currentReachState != ReachTypeEnum.Normal) {
                        onReachMove(currentReachState, newClientX, newClientY, scale);
                    }
                }
                // 横向边缘触发、背景触发禁用当前滑动
                if (currentReachState === ReachTypeEnum.XReach || maskTouched) {
                    _this.setState({
                        reachState: ReachTypeEnum.XReach,
                    });
                }
                else {
                    // 目标倍数
                    var endScale = scale + ((touchLength - lastTouchLength) / 100 / 2) * scale;
                    // 限制最大倍数和最小倍数
                    var toScale = Math.max(Math.min(endScale, Math.max(maxScale, naturalWidth / width)), minScale - scaleBuffer);
                    _this.setState(__assign({ lastTouchLength: touchLength, reachState: currentReachState }, getPositionOnMoveOrScale({
                        x: x,
                        y: y,
                        clientX: newClientX,
                        clientY: newClientY,
                        offsetX: offsetX,
                        offsetY: offsetY,
                        fromScale: scale,
                        toScale: toScale,
                    })));
                }
            }
        };
        _this.onPhotoTap = function (clientX, clientY) {
            var onPhotoTap = _this.props.onPhotoTap;
            if (onPhotoTap) {
                onPhotoTap(clientX, clientY);
            }
        };
        _this.onDoubleTap = function (clientX, clientY) {
            var _a = _this.state, width = _a.width, naturalWidth = _a.naturalWidth, x = _a.x, y = _a.y, scale = _a.scale, reachState = _a.reachState;
            if (reachState !== ReachTypeEnum.Normal) {
                return;
            }
            var position = getPositionOnMoveOrScale({
                x: x,
                y: y,
                clientX: clientX,
                clientY: clientY,
                fromScale: scale,
                // 若图片足够大，则放大适应的倍数
                toScale: scale !== 1 ? 1 : Math.max(2, naturalWidth / width),
            });
            _this.setState(__assign(__assign({ clientX: clientX,
                clientY: clientY }, position), correctSuitablePosition(position)));
        };
        _this.handleWheel = function (e) {
            e.stopPropagation();
            var clientX = e.clientX, clientY = e.clientY, deltaY = e.deltaY;
            var _a = _this.state, width = _a.width, naturalWidth = _a.naturalWidth, reachState = _a.reachState;
            if (reachState !== ReachTypeEnum.Normal) {
                return;
            }
            _this.setState(function (_a) {
                var x = _a.x, y = _a.y, scale = _a.scale;
                var endScale = scale - deltaY / 100 / 2;
                // 限制最大倍数和最小倍数
                var toScale = Math.max(Math.min(endScale, Math.max(maxScale, naturalWidth / width)), minScale);
                var position = getPositionOnMoveOrScale({
                    x: x,
                    y: y,
                    clientX: clientX,
                    clientY: clientY,
                    fromScale: scale,
                    toScale: toScale,
                });
                return __assign(__assign({ clientX: clientX,
                    clientY: clientY }, position), correctSuitablePosition(position));
            });
        };
        _this.handleMaskStart = function (clientX, clientY) {
            _this.setState(function (prevState) { return ({
                maskTouched: true,
                clientX: clientX,
                clientY: clientY,
                lastX: prevState.x,
                lastY: prevState.y,
            }); });
        };
        _this.handleMaskMouseDown = function (e) {
            e.stopPropagation();
            _this.handleMaskStart(e.clientX, e.clientY);
        };
        _this.handleMaskTouchStart = function (e) {
            e.stopPropagation();
            var _a = e.touches[0], clientX = _a.clientX, clientY = _a.clientY;
            _this.handleMaskStart(clientX, clientY);
        };
        _this.handleTouchStart = function (e) {
            e.stopPropagation();
            var _a = getMultipleTouchPosition(e), clientX = _a.clientX, clientY = _a.clientY, touchLength = _a.touchLength;
            _this.handleStart(clientX, clientY, touchLength);
        };
        _this.handleMouseDown = function (e) {
            e.preventDefault();
            e.stopPropagation();
            _this.handleStart(e.clientX, e.clientY, 0);
        };
        _this.handleTouchMove = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var _a = getMultipleTouchPosition(e), clientX = _a.clientX, clientY = _a.clientY, touchLength = _a.touchLength;
            _this.onMove(clientX, clientY, touchLength);
        };
        _this.handleMouseMove = function (e) {
            e.preventDefault();
            e.stopPropagation();
            _this.onMove(e.clientX, e.clientY);
        };
        _this.handleUp = function (newClientX, newClientY) {
            // 重置响应状态
            _this.initialTouchState = TouchStartEnum.Normal;
            var _a = _this.props, onReachUp = _a.onReachUp, onPhotoTap = _a.onPhotoTap, onMaskTap = _a.onMaskTap, isActive = _a.isActive, rotate = _a.rotate;
            var _b = _this.state, width = _b.width, height = _b.height, naturalWidth = _b.naturalWidth, x = _b.x, y = _b.y, lastX = _b.lastX, lastY = _b.lastY, scale = _b.scale, touchedTime = _b.touchedTime, clientX = _b.clientX, clientY = _b.clientY, touched = _b.touched, maskTouched = _b.maskTouched;
            if ((touched || maskTouched) && isActive) {
                var hasMove_1 = clientX !== newClientX || clientY !== newClientY;
                _this.setState(__assign({ touched: false, maskTouched: false, 
                    // 限制缩放
                    scale: Math.max(Math.min(scale, Math.max(maxScale, naturalWidth / width)), minScale), reachState: ReachTypeEnum.Normal }, (hasMove_1
                    ? slideToPosition({
                        x: x,
                        y: y,
                        lastX: lastX,
                        lastY: lastY,
                        width: width,
                        height: height,
                        scale: scale,
                        rotate: rotate,
                        touchedTime: touchedTime,
                    })
                    : {
                        x: x,
                        y: y,
                    })), function () {
                    if (onReachUp) {
                        onReachUp(newClientX, newClientY);
                    }
                    // 触发 Tap 事件
                    if (!hasMove_1) {
                        if (touched && onPhotoTap) {
                            _this.handlePhotoTap(newClientX, newClientY);
                        }
                        else if (maskTouched && onMaskTap) {
                            onMaskTap(newClientX, newClientY);
                        }
                    }
                });
            }
        };
        _this.handleTouchEnd = function (e) {
            var _a = e.changedTouches[0], clientX = _a.clientX, clientY = _a.clientY;
            _this.handleUp(clientX, clientY);
        };
        _this.handleMouseUp = function (e) {
            var clientX = e.clientX, clientY = e.clientY;
            _this.handleUp(clientX, clientY);
        };
        _this.onMove = throttle(_this.onMove, 8);
        _this.handleResize = throttle(_this.handleResize, 8);
        // 单击与双击事件处理
        _this.handlePhotoTap = withContinuousTap(_this.onPhotoTap, _this.onDoubleTap);
        return _this;
    }
    PhotoView.prototype.componentDidMount = function () {
        if (isTouchDevice) {
            window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
            window.addEventListener('touchend', this.handleTouchEnd, { passive: false });
        }
        else {
            window.addEventListener('mousemove', this.handleMouseMove);
            window.addEventListener('mouseup', this.handleMouseUp);
        }
        window.addEventListener('resize', this.handleResize);
    };
    PhotoView.prototype.componentDidUpdate = function (prevProps) {
        var rotate = this.props.rotate;
        if (rotate !== prevProps.rotate) {
            var _a = this.state, naturalWidth = _a.naturalWidth, naturalHeight = _a.naturalHeight;
            this.setState(getSuitableImageSize(naturalWidth, naturalHeight, rotate));
        }
    };
    PhotoView.prototype.componentWillUnmount = function () {
        window.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('touchend', this.handleTouchEnd);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('resize', this.handleResize);
    };
    PhotoView.prototype.render = function () {
        var _a = this.props, src = _a.src, intro = _a.intro, viewClassName = _a.viewClassName, className = _a.className, style = _a.style, rotate = _a.rotate, loadingElement = _a.loadingElement, brokenElement = _a.brokenElement, isActive = _a.isActive, showAnimateType = _a.showAnimateType, originRect = _a.originRect;
        var _b = this.state, width = _b.width, height = _b.height, loaded = _b.loaded, x = _b.x, y = _b.y, scale = _b.scale, touched = _b.touched, broken = _b.broken;
        var transform = "translate3d(" + x + "px, " + y + "px, 0) scale(" + scale + ") rotate(" + rotate + "deg)";
        return (React.createElement("div", { className: classNames('PhotoView__PhotoWrap', viewClassName), style: style },
            React.createElement("div", { className: "PhotoView__PhotoMask", onMouseDown: !isTouchDevice && isActive ? this.handleMaskMouseDown : undefined, onTouchStart: isTouchDevice && isActive ? this.handleMaskTouchStart : undefined }),
            React.createElement("div", { className: classNames('PhotoView__PhotoBox', {
                    PhotoView__animateIn: loaded && showAnimateType === ShowAnimateEnum.In,
                    PhotoView__animateOut: loaded && showAnimateType === ShowAnimateEnum.Out,
                }), style: {
                    transformOrigin: loaded ? getAnimateOrigin(originRect, 0, 0) : undefined,
                } },
                React.createElement(Photo, { className: className, src: src, intro: intro, width: width, height: height, loaded: loaded, broken: broken, rotate: rotate, onMouseDown: isTouchDevice ? undefined : this.handleMouseDown, onTouchStart: isTouchDevice ? this.handleTouchStart : undefined, onWheel: this.handleWheel, style: {
                        WebkitTransform: transform,
                        transform: transform,
                        transition: touched ? undefined : 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    }, onImageLoad: this.handleImageLoad, loadingElement: loadingElement, brokenElement: brokenElement }))));
    };
    PhotoView.displayName = 'PhotoView';
    return PhotoView;
}(React.Component));

var SlideWrap = function (_a) {
    var className = _a.className, children = _a.children, restProps = __rest(_a, ["className", "children"]);
    var dialogNode = React.useRef(document.createElement('section'));
    var originalOverflowCallback = React.useRef('');
    React.useEffect(function () {
        document.body.appendChild(dialogNode.current);
        var style = document.body.style;
        originalOverflowCallback.current = style.overflow;
        style.overflow = 'hidden';
        return function () {
            style.overflow = originalOverflowCallback.current;
            // 清除容器
            document.body.removeChild(dialogNode.current);
        };
    }, []);
    return reactDom.createPortal(React.createElement("div", __assign({ className: classNames('PhotoView-SlideWrap', className) }, restProps), children), dialogNode.current);
};
SlideWrap.displayName = 'SlideWrap';

function VisibleAnimationHandle(_a) {
    var visible = _a.visible, currentImage = _a.currentImage, children = _a.children;
    var _b = React.useState(visible), photoVisible = _b[0], updatePhotoVisible = _b[1];
    var _c = React.useState(ShowAnimateEnum.None), showAnimateType = _c[0], updateAnimateStatus = _c[1];
    var _d = React.useState(), originRect = _d[0], updateOriginRect = _d[1];
    function onShowAnimateEnd() {
        updateAnimateStatus(ShowAnimateEnum.None);
        // Close
        if (showAnimateType === ShowAnimateEnum.Out) {
            updatePhotoVisible(false);
        }
    }
    React.useEffect(function () {
        var originRef = (currentImage || {}).originRef;
        if (originRef && originRef.nodeType === 1) {
            // 获取触发时节点位置
            var _a = originRef.getBoundingClientRect(), top_1 = _a.top, left = _a.left, width = _a.width, height = _a.height;
            updateOriginRect({
                clientX: left + width / 2,
                clientY: top_1 + height / 2,
            });
        }
        else if (originRect && !originRef) {
            updateOriginRect(undefined);
        }
        if (visible) {
            updateAnimateStatus(ShowAnimateEnum.In);
            updatePhotoVisible(true);
        }
        else {
            updateAnimateStatus(ShowAnimateEnum.Out);
        }
    }, [visible]);
    return children({
        photoVisible: photoVisible,
        showAnimateType: showAnimateType,
        originRect: originRect,
        onShowAnimateEnd: onShowAnimateEnd,
    });
}

function Close(props) {
    return (React.createElement("svg", __assign({ version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "44", height: "44", viewBox: "0 0 768 768" }, props),
        React.createElement("path", { fill: "#FFF", d: "M607.5 205.5l-178.5 178.5 178.5 178.5-45 45-178.5-178.5-178.5 178.5-45-45 178.5-178.5-178.5-178.5 45-45 178.5 178.5 178.5-178.5z" })));
}

function ArrowLeft(props) {
    return (React.createElement("svg", __assign({ version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "44", height: "44", viewBox: "0 0 768 768" }, props),
        React.createElement("path", { d: "M640.5 352.5v63h-390l178.5 180-45 45-256.5-256.5 256.5-256.5 45 45-178.5 180h390z" })));
}

function ArrowRight(props) {
    return (React.createElement("svg", __assign({ version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "44", height: "44", viewBox: "0 0 768 768" }, props),
        React.createElement("path", { d: "M384 127.5l256.5 256.5-256.5 256.5-45-45 178.5-180h-390v-63h390l-178.5-180z" })));
}

var PhotoSlider = /** @class */ (function (_super) {
    __extends(PhotoSlider, _super);
    function PhotoSlider(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClose = function (evt) {
            var onClose = _this.props.onClose;
            var backdropOpacity = _this.state.backdropOpacity;
            onClose(evt);
            _this.setState({
                overlayVisible: true,
                // 记录当前关闭时的透明度
                lastBackdropOpacity: backdropOpacity,
            });
        };
        _this.handlePhotoTap = function () {
            var photoClosable = _this.props.photoClosable;
            if (photoClosable) {
                _this.handleClose();
            }
            else {
                _this.setState(function (prevState) { return ({
                    overlayVisible: !prevState.overlayVisible,
                }); });
            }
        };
        _this.handlePhotoMaskTap = function () {
            var maskClosable = _this.props.maskClosable;
            if (maskClosable) {
                _this.handleClose();
            }
        };
        _this.handleResize = function () {
            var innerWidth = window.innerWidth;
            _this.setState(function (_a) {
                var photoIndex = _a.photoIndex;
                return {
                    translateX: -(innerWidth + horizontalOffset) * photoIndex,
                    lastClientX: undefined,
                    lastClientY: undefined,
                    shouldTransition: false,
                };
            });
        };
        _this.handleRotate = function (rotating) {
            var _a = _this.state, photoIndex = _a.photoIndex, rotatingMap = _a.rotatingMap;
            rotatingMap.set(photoIndex, rotating);
            _this.setState({
                rotatingMap: rotatingMap,
            });
        };
        _this.handleKeyDown = function (evt) {
            var visible = _this.props.visible;
            if (visible) {
                switch (evt.key) {
                    case 'ArrowLeft':
                        _this.handlePrevious(false);
                        break;
                    case 'ArrowRight':
                        _this.handleNext(false);
                        break;
                    case 'Escape':
                        _this.handleClose();
                        break;
                }
            }
        };
        _this.handleBack = function (evt) {
            evt.stopPropagation();
            console.log("范湖一");
        };
        _this.handleReachVerticalMove = function (clientY, scale) {
            _this.setState(function (_a) {
                var lastClientY = _a.lastClientY, backdropOpacity = _a.backdropOpacity;
                if (lastClientY === undefined) {
                    return {
                        touched: true,
                        lastClientY: clientY,
                        backdropOpacity: backdropOpacity,
                        canPullClose: true,
                    };
                }
                var offsetClientY = Math.abs(clientY - lastClientY);
                var opacity = Math.max(Math.min(defaultOpacity, defaultOpacity - offsetClientY / 100 / 4), 0);
                return {
                    touched: true,
                    lastClientY: lastClientY,
                    backdropOpacity: scale === 1 ? opacity : defaultOpacity,
                    canPullClose: scale === 1,
                };
            });
        };
        _this.handleReachHorizontalMove = function (clientX) {
            var innerWidth = window.innerWidth;
            var images = _this.props.images;
            _this.setState(function (_a) {
                var lastClientX = _a.lastClientX, translateX = _a.translateX, photoIndex = _a.photoIndex;
                if (lastClientX === undefined) {
                    return {
                        touched: true,
                        lastClientX: clientX,
                        translateX: translateX,
                        shouldTransition: true,
                    };
                }
                var originOffsetClientX = clientX - lastClientX;
                var offsetClientX = originOffsetClientX;
                // 第一张和最后一张超出距离减半
                if ((photoIndex === 0 && originOffsetClientX > 0) ||
                    (photoIndex === images.length - 1 && originOffsetClientX < 0)) {
                    offsetClientX = originOffsetClientX / 2;
                }
                return {
                    touched: true,
                    lastClientX: lastClientX,
                    translateX: -(innerWidth + horizontalOffset) * photoIndex + offsetClientX,
                    shouldTransition: true,
                };
            });
        };
        _this.handleIndexChange = function (photoIndex, shouldTransition) {
            if (shouldTransition === void 0) { shouldTransition = true; }
            var singlePageWidth = window.innerWidth + horizontalOffset;
            var translateX = -singlePageWidth * photoIndex;
            _this.setState({
                touched: false,
                lastClientX: undefined,
                lastClientY: undefined,
                translateX: translateX,
                photoIndex: photoIndex,
                shouldTransition: shouldTransition,
            });
            var onIndexChange = _this.props.onIndexChange;
            if (onIndexChange) {
                onIndexChange(photoIndex);
            }
        };
        _this.handlePrevious = function (shouldTransition) {
            var photoIndex = _this.state.photoIndex;
            if (photoIndex > 0) {
                _this.handleIndexChange(photoIndex - 1, shouldTransition);
            }
        };
        _this.handleNext = function (shouldTransition) {
            var images = _this.props.images;
            var photoIndex = _this.state.photoIndex;
            if (photoIndex < images.length - 1) {
                _this.handleIndexChange(photoIndex + 1, shouldTransition);
            }
        };
        _this.handleReachMove = function (reachState, clientX, clientY, scale) {
            if (reachState === ReachTypeEnum.XReach) {
                _this.handleReachHorizontalMove(clientX);
            }
            else if (reachState === ReachTypeEnum.YReach) {
                _this.handleReachVerticalMove(clientY, scale);
            }
        };
        _this.handleReachUp = function (clientX, clientY) {
            var images = _this.props.images;
            var _a = _this.state, _b = _a.lastClientX, lastClientX = _b === void 0 ? clientX : _b, _c = _a.lastClientY, lastClientY = _c === void 0 ? clientY : _c, photoIndex = _a.photoIndex, overlayVisible = _a.overlayVisible, canPullClose = _a.canPullClose;
            var offsetClientX = clientX - lastClientX;
            var offsetClientY = clientY - lastClientY;
            var willClose = false;
            // 下一张
            if (offsetClientX < -maxMoveOffset && photoIndex < images.length - 1) {
                _this.handleIndexChange(photoIndex + 1);
                return;
            }
            // 上一张
            if (offsetClientX > maxMoveOffset && photoIndex > 0) {
                _this.handleIndexChange(photoIndex - 1);
                return;
            }
            var singlePageWidth = window.innerWidth + horizontalOffset;
            // 当前偏移
            var currentTranslateX = -singlePageWidth * photoIndex;
            var currentPhotoIndex = photoIndex;
            if (Math.abs(offsetClientY) > window.innerHeight * 0.14 && canPullClose) {
                willClose = true;
                _this.handleClose();
            }
            _this.setState({
                touched: false,
                translateX: currentTranslateX,
                photoIndex: currentPhotoIndex,
                lastClientX: undefined,
                lastClientY: undefined,
                backdropOpacity: defaultOpacity,
                overlayVisible: willClose ? true : overlayVisible,
            });
        };
        _this.state = {
            translateX: 0,
            photoIndex: 0,
            touched: false,
            shouldTransition: true,
            lastClientX: undefined,
            lastClientY: undefined,
            backdropOpacity: defaultOpacity,
            lastBackdropOpacity: defaultOpacity,
            overlayVisible: true,
            canPullClose: true,
            rotatingMap: new Map(),
        };
        return _this;
    }
    PhotoSlider.getDerivedStateFromProps = function (nextProps, prevState) {
        if (nextProps.index !== undefined && nextProps.index !== prevState.photoIndex) {
            return {
                photoIndex: nextProps.index,
                translateX: -(window.innerWidth + horizontalOffset) * nextProps.index,
            };
        }
        return null;
    };
    PhotoSlider.prototype.componentDidMount = function () {
        var _a = this.props.index, index = _a === void 0 ? 0 : _a;
        this.setState({
            translateX: index * -(window.innerWidth + horizontalOffset),
            photoIndex: index,
        });
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('popstate', this.handleBack);
    };
    PhotoSlider.prototype.componentWillUnmount = function () {
        window.removeEventListener('keydown', this.handleKeyDown);
    };
    PhotoSlider.prototype.render = function () {
        var _this = this;
        var _a = this.props, images = _a.images, visible = _a.visible, className = _a.className, maskClassName = _a.maskClassName, viewClassName = _a.viewClassName, imageClassName = _a.imageClassName, bannerVisible = _a.bannerVisible, introVisible = _a.introVisible, overlayRender = _a.overlayRender, toolbarRender = _a.toolbarRender, loadingElement = _a.loadingElement, brokenElement = _a.brokenElement;
        var _b = this.state, translateX = _b.translateX, touched = _b.touched, photoIndex = _b.photoIndex, backdropOpacity = _b.backdropOpacity, lastBackdropOpacity = _b.lastBackdropOpacity, overlayVisible = _b.overlayVisible, rotatingMap = _b.rotatingMap, shouldTransition = _b.shouldTransition;
        var imageLength = images.length;
        var currentImage = images.length ? images[photoIndex] : undefined;
        var transform = "translate3d(" + translateX + "px, 0px, 0)";
        // Overlay
        var overlayIntro = currentImage && currentImage.intro;
        return (React.createElement(VisibleAnimationHandle, { visible: visible, currentImage: currentImage }, function (_a) {
            var photoVisible = _a.photoVisible, showAnimateType = _a.showAnimateType, originRect = _a.originRect, onShowAnimateEnd = _a.onShowAnimateEnd;
            if (photoVisible) {
                var innerWidth_1 = window.innerWidth;
                var currentOverlayVisible = overlayVisible && showAnimateType === ShowAnimateEnum.None;
                // 关闭过程中使用下拉保存的透明度
                var currentOpacity = visible ? backdropOpacity : lastBackdropOpacity;
                // 覆盖物参数
                var overlayParams = {
                    images: images,
                    index: photoIndex,
                    visible: visible,
                    onClose: _this.handleClose,
                    onIndexChange: _this.handleIndexChange,
                    overlayVisible: currentOverlayVisible,
                    onRotate: _this.handleRotate,
                    rotate: rotatingMap.get(photoIndex) || 0,
                };
                return (React.createElement(SlideWrap, { className: classNames({
                        'PhotoView-PhotoSlider__clean': !currentOverlayVisible,
                        'PhotoView-PhotoSlider__willClose': !visible,
                    }, className), role: "dialog", id: "PhotoView_Slider", onClick: function (e) { return e.stopPropagation(); } },
                    React.createElement("div", { className: classNames('PhotoView-PhotoSlider__Backdrop', maskClassName, {
                            'PhotoView-PhotoSlider__fadeIn': showAnimateType === ShowAnimateEnum.In,
                            'PhotoView-PhotoSlider__fadeOut': showAnimateType === ShowAnimateEnum.Out,
                        }), style: {
                            background: "rgba(0, 0, 0, " + currentOpacity + ")",
                        }, onAnimationEnd: onShowAnimateEnd }),
                    bannerVisible && (React.createElement("div", { className: "PhotoView-PhotoSlider__BannerWrap" },
                        React.createElement("div", { className: "PhotoView-PhotoSlider__Counter" },
                            photoIndex + 1,
                            " / ",
                            imageLength),
                        React.createElement("div", { className: "PhotoView-PhotoSlider__BannerRight" },
                            toolbarRender && toolbarRender(overlayParams),
                            React.createElement(Close, { className: "PhotoView-PhotoSlider__toolbarIcon", onClick: _this.handleClose })))),
                    images
                        .slice(
                    // 加载相邻三张
                    Math.max(photoIndex - 1, 0), Math.min(photoIndex + 2, imageLength + 1))
                        .map(function (item, index) {
                        // 截取之前的索引位置
                        var realIndex = photoIndex === 0 ? photoIndex + index : photoIndex - 1 + index;
                        return (React.createElement(PhotoView, { key: item.key || realIndex, src: item.src, intro: item.intro, onReachMove: _this.handleReachMove, onReachUp: _this.handleReachUp, onPhotoTap: _this.handlePhotoTap, onMaskTap: _this.handlePhotoMaskTap, viewClassName: viewClassName, className: imageClassName, style: {
                                left: (innerWidth_1 + horizontalOffset) * realIndex + "px",
                                WebkitTransform: transform,
                                transform: transform,
                                transition: touched || !shouldTransition
                                    ? undefined
                                    : 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
                            }, loadingElement: loadingElement, brokenElement: brokenElement, onPhotoResize: _this.handleResize, isActive: photoIndex === realIndex, showAnimateType: showAnimateType, originRect: originRect, rotate: rotatingMap.get(realIndex) || 0 }));
                    }),
                    !isTouchDevice && bannerVisible && (React.createElement(React.Fragment, null,
                        photoIndex !== 0 && (React.createElement("div", { className: "PhotoView-PhotoSlider__ArrowLeft", onClick: function () { return _this.handlePrevious(false); } },
                            React.createElement(ArrowLeft, null))),
                        photoIndex + 1 < imageLength && (React.createElement("div", { className: "PhotoView-PhotoSlider__ArrowRight", onClick: function () { return _this.handleNext(false); } },
                            React.createElement(ArrowRight, null))))),
                    Boolean(introVisible && overlayIntro) && (React.createElement("div", { className: "PhotoView-PhotoSlider__FooterWrap" }, overlayIntro)),
                    overlayRender && overlayRender(overlayParams)));
            }
            return null;
        }));
    };
    PhotoSlider.displayName = 'PhotoSlider';
    PhotoSlider.defaultProps = {
        maskClosable: true,
        photoClosable: false,
        bannerVisible: true,
        introVisible: true,
    };
    return PhotoSlider;
}(React.Component));

var PhotoProvider = /** @class */ (function (_super) {
    __extends(PhotoProvider, _super);
    function PhotoProvider(props) {
        var _this = _super.call(this, props) || this;
        _this.handleAddItem = function (imageItem) {
            _this.setState(function (prev) { return ({
                images: prev.images.concat(imageItem),
            }); });
        };
        _this.handleRemoveItem = function (key) {
            _this.setState(function (_a) {
                var images = _a.images, index = _a.index;
                var nextImages = images.filter(function (item) { return item.key !== key; });
                var nextEndIndex = nextImages.length - 1;
                return {
                    images: nextImages,
                    index: Math.min(nextEndIndex, index),
                };
            });
        };
        _this.handleShow = function (key) {
            var images = _this.state.images;
            _this.setState({
                visible: true,
                index: images.findIndex(function (item) { return item.key === key; }),
            });
        };
        _this.handleClose = function () {
            _this.setState({
                visible: false,
            });
        };
        _this.handleIndexChange = function (index) {
            _this.setState({
                index: index,
            });
        };
        _this.state = {
            images: [],
            visible: false,
            index: 0,
            addItem: _this.handleAddItem,
            removeItem: _this.handleRemoveItem,
            onShow: _this.handleShow,
        };
        return _this;
    }
    PhotoProvider.prototype.render = function () {
        var _a = this.props, children = _a.children, restProps = __rest(_a, ["children"]);
        var _b = this.state, images = _b.images, visible = _b.visible, index = _b.index;
        return (React.createElement(PhotoContext.Provider, { value: this.state },
            children,
            React.createElement(PhotoSlider, __assign({ images: images, visible: visible, index: index, onIndexChange: this.handleIndexChange, onClose: this.handleClose }, restProps))));
    };
    return PhotoProvider;
}(React.Component));

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag$1 = '[object Symbol]';

/** Detect free variable `global` from Node.js. */
var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf$1 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal$1 || freeSelf$1 || Function('return this')();

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$1 = objectProto$1.toString;

/** Built-in value references. */
var Symbol = root$1.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol$1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$1(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$1(value) {
  return typeof value == 'symbol' ||
    (isObjectLike$1(value) && objectToString$1.call(value) == symbolTag$1);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}

var lodash_uniqueid = uniqueId;

var PhotoConsumer = function (_a) {
    var src = _a.src, intro = _a.intro, children = _a.children;
    var photoContext = React.useContext(PhotoContext);
    var key = React.useMemo(function () { return lodash_uniqueid(); }, []);
    var _b = React.useState({
        clientX: undefined,
        clientY: undefined,
    }), position = _b[0], updatePosition = _b[1];
    var photoTriggerRef = React.useRef(null);
    React.useEffect(function () {
        photoContext.addItem({
            key: key,
            src: src,
            originRef: photoTriggerRef.current,
            intro: intro,
        });
        return function () {
            photoContext.removeItem(key);
        };
    }, []);
    function handleTouchStart(e) {
        var _a = e.touches[0], clientX = _a.clientX, clientY = _a.clientY;
        updatePosition({
            clientX: clientX,
            clientY: clientY,
        });
        if (children) {
            var onTouchStart = children.props.onTouchStart;
            if (onTouchStart) {
                onTouchStart(e);
            }
        }
    }
    function handleTouchEnd(e) {
        var _a = e.changedTouches[0], clientX = _a.clientX, clientY = _a.clientY;
        if (position.clientX === clientX && position.clientY === clientY) {
            photoContext.onShow(key);
        }
        if (children) {
            var onTouchEnd = children.props.onTouchEnd;
            if (onTouchEnd) {
                onTouchEnd(e);
            }
        }
    }
    function handleClick(e) {
        photoContext.onShow(key);
        if (children) {
            var onClick = children.props.onClick;
            if (onClick) {
                onClick(e);
            }
        }
    }
    if (children) {
        return React.Children.only(React.cloneElement(children, isTouchDevice
            ? {
                onTouchStart: handleTouchStart,
                onTouchEnd: handleTouchEnd,
                ref: photoTriggerRef,
            }
            : { onClick: handleClick, ref: photoTriggerRef }));
    }
    return null;
};

exports.PhotoConsumer = PhotoConsumer;
exports.PhotoProvider = PhotoProvider;
exports.PhotoSlider = PhotoSlider;
//# sourceMappingURL=index.js.map
