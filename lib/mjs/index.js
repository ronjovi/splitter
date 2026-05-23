import React, { useEffect, Children, isValidElement, cloneElement, useReducer, useRef } from 'react';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "/* === Main Container === */\n.__dbk__container {\n  height: 100%;\n  width: 100%;\n\n  display: flex;\n  overflow: hidden;\n}\n\n.__dbk__container.Horizontal {\n  flex-direction: row;\n}\n\n.__dbk__container.Vertical {\n  flex-direction: column;\n}\n/* ====== */\n\n/* === Wrapper for each child element === */\n.__dbk__child-wrapper {\n  height: 100%;\n  width: 100%;\n}\n/* ====== */\n\n/* === Gutter === */\n.__dbk__gutter {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n/* .__dbk__gutter > div {\n  background: red;\n} */\n.__dbk__gutter.Horizontal {\n  height: 100%;\n  padding: 0 2px;\n  flex-direction: column;\n}\n.__dbk__gutter.Horizontal:hover {\n  cursor: col-resize;\n}\n\n.__dbk__gutter.Vertical {\n  width: 100%;\n  padding: 2px 0;\n  flex-direction: row;\n}\n.__dbk__gutter.Vertical:hover {\n  cursor: row-resize;\n}\n\n.__dbk__gutter.Light {\n  background: #EDF0EF;\n}\n.__dbk__gutter.Light:hover > .__dbk__dragger {\n  background: #76747B;\n}\n\n.__dbk__gutter.Dark {\n  background: #020203;\n}\n.__dbk__gutter.Dark:hover > .__dbk__dragger {\n  background: #9995A3;\n}\n/* ====== */\n\n/* === Gutter's Dragger === */\n.__dbk__dragger {\n  border-radius: 2px;\n}\n\n.__dbk__dragger.Horizontal {\n  width: 4px;\n  height: 24px;  \n}\n\n.__dbk__dragger.Vertical {\n  width: 24px;\n  height: 4px;  \n}\n\n.__dbk__dragger.Light {\n  background: #A6ACB5;\n}\n\n.__dbk__dragger.Dark {\n  background: #434252;\n}\n/* ====== */";
styleInject(css_248z);

function getInnerSize(direction, element) {
    // Returns undefined if parent element has no layout yet.
    // Or if the parent has no size.
    const computedStyle = getComputedStyle(element);
    if (!computedStyle)
        return;
    let size = direction === SplitDirection.Horizontal ? element.clientWidth : element.clientHeight;
    if (size === 0)
        return;
    if (direction === SplitDirection.Horizontal) {
        size -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
    }
    else {
        size -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
    }
    return size;
}

/******************************************************************************
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

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function useEventListener(event, handler, deps = [], useAddEventListenerOptions = { condition: true }) {
    const { condition } = useAddEventListenerOptions, addEventListenerOptions = __rest(useAddEventListenerOptions, ["condition"]);
    useEffect(() => {
        if (condition) {
            window.addEventListener(event, handler, addEventListenerOptions);
        }
        return () => {
            if (condition) {
                window.removeEventListener(event, handler);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [event, handler, condition, ...deps]);
}

const Gutter = React.forwardRef(({ className, theme, draggerClassName, direction = SplitDirection.Vertical, onDragging, }, ref) => {
    const containerClass = `__dbk__gutter ${direction} ${className || theme}`;
    const draggerClass = `__dbk__dragger ${direction} ${draggerClassName || theme}`;
    return (React.createElement("div", { className: containerClass, ref: ref, dir: direction, onMouseDown: onDragging, onTouchStart: isTouchDevice ? onDragging : undefined },
        React.createElement("div", { className: draggerClass })));
});

var ActionType;
(function (ActionType) {
    ActionType[ActionType["SetIsReadyToCompute"] = 0] = "SetIsReadyToCompute";
    ActionType[ActionType["CreatePairs"] = 1] = "CreatePairs";
    ActionType[ActionType["CalculateSizes"] = 2] = "CalculateSizes";
    ActionType[ActionType["StartDragging"] = 3] = "StartDragging";
    ActionType[ActionType["StopDragging"] = 4] = "StopDragging";
})(ActionType || (ActionType = {}));

function getGutterSizes(gutterSize, isFirst, isLast) {
    let aGutterSize;
    let bGutterSize;
    if (isFirst && isLast) {
        aGutterSize = gutterSize / 2;
        bGutterSize = gutterSize / 2;
    }
    else if (isFirst) {
        aGutterSize = gutterSize / 2;
        bGutterSize = gutterSize;
    }
    else if (isLast) {
        aGutterSize = gutterSize;
        bGutterSize = gutterSize / 2;
    }
    else {
        aGutterSize = gutterSize;
        bGutterSize = gutterSize;
    }
    return { aGutterSize, bGutterSize };
}

function reducer(state, action) {
    switch (action.type) {
        case ActionType.SetIsReadyToCompute: {
            return Object.assign(Object.assign({}, state), { isReady: action.payload.isReady });
        }
        // -----------------------------------------------------------------------
        // |     i=0     |         i=1         |        i=2       |      i=3     |
        // |             |                     |                  |              |
        // |           pair 0                pair 1             pair 2           |
        // |             |                     |                  |              |
        // -----------------------------------------------------------------------
        case ActionType.CreatePairs: {
            const { direction, children, gutters } = action.payload;
            // All children must have common parent.
            const parent = children[0].parentNode;
            if (!parent)
                throw new Error(`Cannot create pairs - parent is undefined.`);
            const parentSize = getInnerSize(direction, parent);
            if (parentSize === undefined)
                throw new Error(`Cannot create pairs - parent has undefined or zero size: ${parentSize}.`);
            const pairs = [];
            children.forEach((_, idx) => {
                if (idx > 0) {
                    const a = children[idx - 1];
                    const b = children[idx];
                    const gutter = gutters[idx - 1];
                    const start = direction === SplitDirection.Horizontal
                        ? a.getBoundingClientRect().left
                        : a.getBoundingClientRect().top;
                    const end = direction === SplitDirection.Horizontal
                        ? b.getBoundingClientRect().right
                        : b.getBoundingClientRect().bottom;
                    const size = direction === SplitDirection.Horizontal
                        ? a.getBoundingClientRect().width + gutter.getBoundingClientRect().width + b.getBoundingClientRect().width
                        : a.getBoundingClientRect().height + gutter.getBoundingClientRect().height + b.getBoundingClientRect().height;
                    const gutterSize = direction === SplitDirection.Horizontal
                        ? gutter.getBoundingClientRect().width
                        : gutter.getBoundingClientRect().height;
                    const pair = {
                        idx: idx - 1,
                        // TODO: Do we need to have a reference to the whole elements? Aren't indexes enough?
                        a,
                        b,
                        gutter,
                        parent: parent,
                        start,
                        end,
                        size,
                        gutterSize,
                        // At the start, all elements has the same width.
                        aSizePct: 100 / children.length,
                        bSizePct: 100 / children.length,
                    };
                    pairs.push(pair);
                }
            });
            return Object.assign(Object.assign({}, state), { pairs });
        }
        case ActionType.StartDragging: {
            const { gutterIdx } = action.payload;
            return Object.assign(Object.assign({}, state), { isDragging: true, draggingIdx: gutterIdx });
        }
        case ActionType.StopDragging: {
            return Object.assign(Object.assign({}, state), { isDragging: false });
        }
        // Recalculates the stored sizes based on the actual elements' sizes.
        case ActionType.CalculateSizes: {
            // We need to calculate sizes only for the pair
            // that has the moved gutter.
            const { direction, gutterIdx } = action.payload;
            const pair = state.pairs[gutterIdx];
            const parentSize = getInnerSize(direction, pair.parent);
            if (!parentSize)
                throw new Error(`Cannot calculate sizes - 'pair.parent' has undefined or zero size.`);
            const gutterSize = pair.gutter[direction === SplitDirection.Horizontal ? 'clientWidth' : 'clientHeight'];
            const isFirst = gutterIdx === 0;
            const isLast = gutterIdx === state.pairs.length - 1;
            const { aGutterSize, bGutterSize } = getGutterSizes(gutterSize, isFirst, isLast);
            let start;
            let end;
            let size;
            let aSizePct;
            let bSizePct;
            if (direction === SplitDirection.Horizontal) {
                start = pair.a.getBoundingClientRect().left;
                end = pair.b.getBoundingClientRect().right;
                aSizePct = ((pair.a.getBoundingClientRect().width + aGutterSize) / parentSize) * 100;
                bSizePct = ((pair.b.getBoundingClientRect().width + bGutterSize) / parentSize) * 100;
                size =
                    pair.a.getBoundingClientRect().width +
                        aGutterSize +
                        bGutterSize +
                        pair.b.getBoundingClientRect().width;
            }
            else {
                start = pair.a.getBoundingClientRect().top;
                end = pair.b.getBoundingClientRect().bottom;
                aSizePct = ((pair.a.getBoundingClientRect().height + aGutterSize) / parentSize) * 100;
                bSizePct = ((pair.b.getBoundingClientRect().height + bGutterSize) / parentSize) * 100;
                size =
                    pair.a.getBoundingClientRect().height +
                        aGutterSize +
                        bGutterSize +
                        pair.b.getBoundingClientRect().height;
            }
            state.pairs[gutterIdx] = Object.assign(Object.assign({}, pair), { start,
                end,
                size,
                aSizePct,
                bSizePct,
                gutterSize });
            return Object.assign({}, state);
        }
        default:
            return state;
    }
}

var reactIs = {exports: {}};

var reactIs_production_min = {};

/** @license React v17.0.2
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactIs_production_min;

function requireReactIs_production_min () {
	if (hasRequiredReactIs_production_min) return reactIs_production_min;
	hasRequiredReactIs_production_min = 1;
var b=60103,c=60106,d=60107,e=60108,f=60114,g=60109,h=60110,k=60112,l=60113,m=60120,n=60115,p=60116,q=60121,r=60122,u=60117,v=60129,w=60131;
	if("function"===typeof Symbol&&Symbol.for){var x=Symbol.for;b=x("react.element");c=x("react.portal");d=x("react.fragment");e=x("react.strict_mode");f=x("react.profiler");g=x("react.provider");h=x("react.context");k=x("react.forward_ref");l=x("react.suspense");m=x("react.suspense_list");n=x("react.memo");p=x("react.lazy");q=x("react.block");r=x("react.server.block");u=x("react.fundamental");v=x("react.debug_trace_mode");w=x("react.legacy_hidden");}
	function y(a){if("object"===typeof a&&null!==a){var t=a.$$typeof;switch(t){case b:switch(a=a.type,a){case d:case f:case e:case l:case m:return a;default:switch(a=a&&a.$$typeof,a){case h:case k:case p:case n:case g:return a;default:return t}}case c:return t}}}var z=g,A=b,B=k,C=d,D=p,E=n,F=c,G=f,H=e,I=l;reactIs_production_min.ContextConsumer=h;reactIs_production_min.ContextProvider=z;reactIs_production_min.Element=A;reactIs_production_min.ForwardRef=B;reactIs_production_min.Fragment=C;reactIs_production_min.Lazy=D;reactIs_production_min.Memo=E;reactIs_production_min.Portal=F;reactIs_production_min.Profiler=G;reactIs_production_min.StrictMode=H;
	reactIs_production_min.Suspense=I;reactIs_production_min.isAsyncMode=function(){return !1};reactIs_production_min.isConcurrentMode=function(){return !1};reactIs_production_min.isContextConsumer=function(a){return y(a)===h};reactIs_production_min.isContextProvider=function(a){return y(a)===g};reactIs_production_min.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===b};reactIs_production_min.isForwardRef=function(a){return y(a)===k};reactIs_production_min.isFragment=function(a){return y(a)===d};reactIs_production_min.isLazy=function(a){return y(a)===p};reactIs_production_min.isMemo=function(a){return y(a)===n};
	reactIs_production_min.isPortal=function(a){return y(a)===c};reactIs_production_min.isProfiler=function(a){return y(a)===f};reactIs_production_min.isStrictMode=function(a){return y(a)===e};reactIs_production_min.isSuspense=function(a){return y(a)===l};reactIs_production_min.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===d||a===f||a===v||a===e||a===l||a===m||a===w||"object"===typeof a&&null!==a&&(a.$$typeof===p||a.$$typeof===n||a.$$typeof===g||a.$$typeof===h||a.$$typeof===k||a.$$typeof===u||a.$$typeof===q||a[0]===r)?!0:!1};
	reactIs_production_min.typeOf=y;
	return reactIs_production_min;
}

var reactIs_development = {};

/** @license React v17.0.2
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactIs_development;

function requireReactIs_development () {
	if (hasRequiredReactIs_development) return reactIs_development;
	hasRequiredReactIs_development = 1;

	if (process.env.NODE_ENV !== "production") {
	  (function() {

	// ATTENTION
	// When adding new symbols to this file,
	// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
	// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
	// nor polyfill, then a plain number is used for performance.
	var REACT_ELEMENT_TYPE = 0xeac7;
	var REACT_PORTAL_TYPE = 0xeaca;
	var REACT_FRAGMENT_TYPE = 0xeacb;
	var REACT_STRICT_MODE_TYPE = 0xeacc;
	var REACT_PROFILER_TYPE = 0xead2;
	var REACT_PROVIDER_TYPE = 0xeacd;
	var REACT_CONTEXT_TYPE = 0xeace;
	var REACT_FORWARD_REF_TYPE = 0xead0;
	var REACT_SUSPENSE_TYPE = 0xead1;
	var REACT_SUSPENSE_LIST_TYPE = 0xead8;
	var REACT_MEMO_TYPE = 0xead3;
	var REACT_LAZY_TYPE = 0xead4;
	var REACT_BLOCK_TYPE = 0xead9;
	var REACT_SERVER_BLOCK_TYPE = 0xeada;
	var REACT_FUNDAMENTAL_TYPE = 0xead5;
	var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
	var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;

	if (typeof Symbol === 'function' && Symbol.for) {
	  var symbolFor = Symbol.for;
	  REACT_ELEMENT_TYPE = symbolFor('react.element');
	  REACT_PORTAL_TYPE = symbolFor('react.portal');
	  REACT_FRAGMENT_TYPE = symbolFor('react.fragment');
	  REACT_STRICT_MODE_TYPE = symbolFor('react.strict_mode');
	  REACT_PROFILER_TYPE = symbolFor('react.profiler');
	  REACT_PROVIDER_TYPE = symbolFor('react.provider');
	  REACT_CONTEXT_TYPE = symbolFor('react.context');
	  REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
	  REACT_SUSPENSE_TYPE = symbolFor('react.suspense');
	  REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
	  REACT_MEMO_TYPE = symbolFor('react.memo');
	  REACT_LAZY_TYPE = symbolFor('react.lazy');
	  REACT_BLOCK_TYPE = symbolFor('react.block');
	  REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
	  REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
	  symbolFor('react.scope');
	  symbolFor('react.opaque.id');
	  REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
	  symbolFor('react.offscreen');
	  REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
	}

	// Filter certain DOM attributes (e.g. src, href) if their values are empty strings.

	var enableScopeAPI = false; // Experimental Create Event Handle API.

	function isValidElementType(type) {
	  if (typeof type === 'string' || typeof type === 'function') {
	    return true;
	  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


	  if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_DEBUG_TRACING_MODE_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI ) {
	    return true;
	  }

	  if (typeof type === 'object' && type !== null) {
	    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE) {
	      return true;
	    }
	  }

	  return false;
	}

	function typeOf(object) {
	  if (typeof object === 'object' && object !== null) {
	    var $$typeof = object.$$typeof;

	    switch ($$typeof) {
	      case REACT_ELEMENT_TYPE:
	        var type = object.type;

	        switch (type) {
	          case REACT_FRAGMENT_TYPE:
	          case REACT_PROFILER_TYPE:
	          case REACT_STRICT_MODE_TYPE:
	          case REACT_SUSPENSE_TYPE:
	          case REACT_SUSPENSE_LIST_TYPE:
	            return type;

	          default:
	            var $$typeofType = type && type.$$typeof;

	            switch ($$typeofType) {
	              case REACT_CONTEXT_TYPE:
	              case REACT_FORWARD_REF_TYPE:
	              case REACT_LAZY_TYPE:
	              case REACT_MEMO_TYPE:
	              case REACT_PROVIDER_TYPE:
	                return $$typeofType;

	              default:
	                return $$typeof;
	            }

	        }

	      case REACT_PORTAL_TYPE:
	        return $$typeof;
	    }
	  }

	  return undefined;
	}
	var ContextConsumer = REACT_CONTEXT_TYPE;
	var ContextProvider = REACT_PROVIDER_TYPE;
	var Element = REACT_ELEMENT_TYPE;
	var ForwardRef = REACT_FORWARD_REF_TYPE;
	var Fragment = REACT_FRAGMENT_TYPE;
	var Lazy = REACT_LAZY_TYPE;
	var Memo = REACT_MEMO_TYPE;
	var Portal = REACT_PORTAL_TYPE;
	var Profiler = REACT_PROFILER_TYPE;
	var StrictMode = REACT_STRICT_MODE_TYPE;
	var Suspense = REACT_SUSPENSE_TYPE;
	var hasWarnedAboutDeprecatedIsAsyncMode = false;
	var hasWarnedAboutDeprecatedIsConcurrentMode = false; // AsyncMode should be deprecated

	function isAsyncMode(object) {
	  {
	    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
	      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

	      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
	    }
	  }

	  return false;
	}
	function isConcurrentMode(object) {
	  {
	    if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
	      hasWarnedAboutDeprecatedIsConcurrentMode = true; // Using console['warn'] to evade Babel and ESLint

	      console['warn']('The ReactIs.isConcurrentMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
	    }
	  }

	  return false;
	}
	function isContextConsumer(object) {
	  return typeOf(object) === REACT_CONTEXT_TYPE;
	}
	function isContextProvider(object) {
	  return typeOf(object) === REACT_PROVIDER_TYPE;
	}
	function isElement(object) {
	  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function isForwardRef(object) {
	  return typeOf(object) === REACT_FORWARD_REF_TYPE;
	}
	function isFragment(object) {
	  return typeOf(object) === REACT_FRAGMENT_TYPE;
	}
	function isLazy(object) {
	  return typeOf(object) === REACT_LAZY_TYPE;
	}
	function isMemo(object) {
	  return typeOf(object) === REACT_MEMO_TYPE;
	}
	function isPortal(object) {
	  return typeOf(object) === REACT_PORTAL_TYPE;
	}
	function isProfiler(object) {
	  return typeOf(object) === REACT_PROFILER_TYPE;
	}
	function isStrictMode(object) {
	  return typeOf(object) === REACT_STRICT_MODE_TYPE;
	}
	function isSuspense(object) {
	  return typeOf(object) === REACT_SUSPENSE_TYPE;
	}

	reactIs_development.ContextConsumer = ContextConsumer;
	reactIs_development.ContextProvider = ContextProvider;
	reactIs_development.Element = Element;
	reactIs_development.ForwardRef = ForwardRef;
	reactIs_development.Fragment = Fragment;
	reactIs_development.Lazy = Lazy;
	reactIs_development.Memo = Memo;
	reactIs_development.Portal = Portal;
	reactIs_development.Profiler = Profiler;
	reactIs_development.StrictMode = StrictMode;
	reactIs_development.Suspense = Suspense;
	reactIs_development.isAsyncMode = isAsyncMode;
	reactIs_development.isConcurrentMode = isConcurrentMode;
	reactIs_development.isContextConsumer = isContextConsumer;
	reactIs_development.isContextProvider = isContextProvider;
	reactIs_development.isElement = isElement;
	reactIs_development.isForwardRef = isForwardRef;
	reactIs_development.isFragment = isFragment;
	reactIs_development.isLazy = isLazy;
	reactIs_development.isMemo = isMemo;
	reactIs_development.isPortal = isPortal;
	reactIs_development.isProfiler = isProfiler;
	reactIs_development.isStrictMode = isStrictMode;
	reactIs_development.isSuspense = isSuspense;
	reactIs_development.isValidElementType = isValidElementType;
	reactIs_development.typeOf = typeOf;
	  })();
	}
	return reactIs_development;
}

var hasRequiredReactIs;

function requireReactIs () {
	if (hasRequiredReactIs) return reactIs.exports;
	hasRequiredReactIs = 1;

	if (process.env.NODE_ENV === 'production') {
	  reactIs.exports = requireReactIs_production_min();
	} else {
	  reactIs.exports = requireReactIs_development();
	}
	return reactIs.exports;
}

var reactIsExports = requireReactIs();

// Taken from https://github.com/grrowl/react-keyed-flatten-children
function flattenChildren(children, depth = 0, keys = []) {
    return Children.toArray(children).reduce((acc, node, nodeIndex) => {
        if (reactIsExports.isFragment(node)) {
            acc.push.apply(acc, flattenChildren(node.props.children, depth + 1, keys.concat(node.key || nodeIndex)));
        }
        else {
            if (isValidElement(node)) {
                acc.push(cloneElement(node, {
                    key: keys.concat(String(node.key)).join('.')
                }));
            }
            else if (typeof node === 'string' || typeof node === 'number') {
                acc.push(node);
            }
        }
        return acc;
    }, []);
}

const isTouchEvent = (e) => {
    return 'changedTouches' in e;
};

var SplitDirection;
(function (SplitDirection) {
    SplitDirection["Horizontal"] = "Horizontal";
    SplitDirection["Vertical"] = "Vertical";
})(SplitDirection || (SplitDirection = {}));
var GutterTheme;
(function (GutterTheme) {
    GutterTheme["Light"] = "Light";
    GutterTheme["Dark"] = "Dark";
})(GutterTheme || (GutterTheme = {}));
const DefaultMinSize = 16;
const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;
// users touch or mouse position
function getPosition(dir, e) {
    const targetsValueRef = isTouchEvent(e) ? e.changedTouches[0] : e;
    if (dir === SplitDirection.Horizontal)
        return targetsValueRef.clientX;
    return targetsValueRef.clientY;
}
function getCursorIcon(dir) {
    if (dir === SplitDirection.Horizontal)
        return 'col-resize';
    return 'row-resize';
}
/*
const stateInit: State = (direction: SplitDirection = SplitDirection.Horizontal) => ({
  direction,
  isDragging: false,
  pairs: [],
});
*/
const initialState = {
    isReady: false,
    isDragging: false,
    pairs: [],
};
function Split({ direction = SplitDirection.Horizontal, minWidths = [], minHeights = [], initialSizes, gutterTheme = GutterTheme.Dark, gutterClassName, draggerClassName, children: reactChildren, onResizeStarted, onResizeFinished, classes = [], }) {
    const children = flattenChildren(reactChildren);
    const [state, dispatch] = useReducer(reducer, initialState);
    const containerRef = useRef(null);
    const childRefs = useRef([]);
    const gutterRefs = useRef([]);
    // We want to reset refs on each re-render so they don't contain old references.
    childRefs.current = [];
    gutterRefs.current = [];
    // Helper dispatch functions.
    const setIsReadyToCompute = React.useCallback((isReady) => {
        dispatch({
            type: ActionType.SetIsReadyToCompute,
            payload: { isReady },
        });
    }, []);
    const startDragging = React.useCallback((direction, gutterIdx) => {
        dispatch({
            type: ActionType.StartDragging,
            payload: { gutterIdx },
        });
        const pair = state.pairs[gutterIdx];
        onResizeStarted === null || onResizeStarted === void 0 ? void 0 : onResizeStarted(pair.idx);
        // Disable selection.
        pair.a.style.userSelect = 'none';
        pair.b.style.userSelect = 'none';
        // Set the mouse cursor.
        // Must be done at multiple levels, nut just for a gutter.
        // The mouse cursor might move outside of the gutter element.
        pair.gutter.style.cursor = getCursorIcon(direction);
        pair.parent.style.cursor = getCursorIcon(direction);
        document.body.style.cursor = getCursorIcon(direction);
    }, [state.pairs]);
    const stopDragging = React.useCallback(() => {
        dispatch({
            type: ActionType.StopDragging,
        });
        // The callback receives an index of the resized pair and new sizes of all child elements.
        const allSizes = [];
        for (let idx = 0; idx < state.pairs.length; idx++) {
            const pair = state.pairs[idx];
            const parentSize = getInnerSize(direction, pair.parent);
            if (parentSize === undefined)
                throw new Error(`Cannot call the 'onResizeFinished' callback - parentSize is undefined`);
            if (pair.gutterSize === undefined)
                throw new Error(`Cannot call 'onResizeFinished' callback - gutterSize is undefined`);
            const isFirst = idx === 0;
            const isLast = idx === state.pairs.length - 1;
            const aSize = pair.a.getBoundingClientRect()[direction === SplitDirection.Horizontal ? 'width' : 'height'];
            const { aGutterSize, bGutterSize } = getGutterSizes(pair.gutterSize, isFirst, isLast);
            const aSizePct = ((aSize + aGutterSize) / parentSize) * 100;
            allSizes.push(aSizePct);
            if (isLast) {
                const bSize = pair.b.getBoundingClientRect()[direction === SplitDirection.Horizontal ? 'width' : 'height'];
                const bSizePct = ((bSize + bGutterSize) / parentSize) * 100;
                allSizes.push(bSizePct);
            }
        }
        if (state.draggingIdx === undefined)
            throw new Error(`Could not reset cursor and user-select because 'state.draggingIdx' is undefined`);
        const pair = state.pairs[state.draggingIdx];
        onResizeFinished === null || onResizeFinished === void 0 ? void 0 : onResizeFinished(pair.idx, allSizes);
        // Disable selection.
        pair.a.style.userSelect = '';
        pair.b.style.userSelect = '';
        // Set the mouse cursor.
        // Must be done at multiple levels, not just for a gutter.
        // The mouse cursor might move outside of the gutter element.
        pair.gutter.style.cursor = '';
        pair.parent.style.cursor = '';
        document.body.style.cursor = '';
    }, [state.draggingIdx, state.pairs, direction]);
    const calculateSizes = React.useCallback((direction, gutterIdx) => {
        dispatch({
            type: ActionType.CalculateSizes,
            payload: { direction, gutterIdx },
        });
    }, []);
    const createPairs = React.useCallback((direction, children, gutters) => {
        dispatch({
            type: ActionType.CreatePairs,
            payload: { direction, children, gutters },
        });
    }, []);
    /////////
    // This method is called on the initial render.
    // It iterates through the all children sets their initial sizes.
    const setInitialSizes = React.useCallback((direction, children, gutters, initialSizes) => {
        // All children must have common parent.
        const parent = children[0].parentNode;
        if (!parent)
            throw new Error(`Cannot set initial sizes - parent is undefined`);
        const parentSize = getInnerSize(direction, parent);
        if (parentSize === undefined)
            throw new Error(`Cannot set initial sizes - parent has undefined size`);
        children.forEach((c, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === children.length - 1;
            let gutterSize = 0;
            if (children.length > 1) {
                const gutter = gutters[isLast ? idx - 1 : idx];
                gutterSize = gutter.getBoundingClientRect()[direction === SplitDirection.Horizontal ? 'width' : 'height'];
                gutterSize = isFirst || isLast ? gutterSize / 2 : gutterSize;
            }
            let calc;
            if (initialSizes && idx < initialSizes.length) {
                calc = `calc(${initialSizes[idx]}% - ${gutterSize}px)`;
            }
            else {
                // '100 / children.length' makes all the children same wide.
                calc = `calc(${100 / children.length}% - ${gutterSize}px)`;
            }
            if (direction === SplitDirection.Horizontal) {
                c.style.width = calc;
                // Reset the child wrapper's height because the direction could have changed.
                c.style.height = '100%';
            }
            else {
                c.style.height = calc;
                // Reset the child wrapper's width because the direction could have changed.
                c.style.width = '100%';
            }
        });
    }, []);
    // Here we actually change the width of children.
    // We convert the element's sizes into percentage
    // and let the CSS 'calc' function do the heavy lifting.
    // Size of 'pair.a' is same as 'offset'.
    //
    // For just 2 children total, the percentage adds up always to 100.
    // For >2 children total, the percentage adds to less than 100.
    // That's because a single gutter changes sizes of only the given pair of children.
    // Each gutter changes size only of the two adjacent elements.
    // -----------------------------------------------------------------------
    // |                     |||                     |||                     |
    // |       33.3%         |||        33.3%        |||       33.3%         |
    // |                     |||                     |||                     |
    // |                     |||                     |||                     |
    // -----------------------------------------------------------------------
    const adjustSize = React.useCallback((direction, offset) => {
        if (state.draggingIdx === undefined)
            throw new Error(`Cannot adjust size - 'draggingIdx' is undefined`);
        const pair = state.pairs[state.draggingIdx];
        if (pair.size === undefined)
            throw new Error(`Cannot adjust size - 'pair.size' is undefined`);
        if (pair.gutterSize === undefined)
            throw new Error(`Cannot adjust size - 'pair.gutterSize' is undefined`);
        const percentage = pair.aSizePct + pair.bSizePct;
        const aSizePct = (offset / pair.size) * percentage;
        const bSizePct = percentage - (offset / pair.size) * percentage;
        const isFirst = state.draggingIdx === 0;
        const isLast = state.draggingIdx === state.pairs.length - 1;
        const { aGutterSize, bGutterSize } = getGutterSizes(pair.gutterSize, isFirst, isLast);
        const aCalc = `calc(${aSizePct}% - ${aGutterSize}px)`;
        const bCalc = `calc(${bSizePct}% - ${bGutterSize}px)`;
        if (direction === SplitDirection.Horizontal) {
            pair.a.style.width = aCalc;
            pair.b.style.width = bCalc;
        }
        else {
            pair.a.style.height = aCalc;
            pair.b.style.height = bCalc;
        }
    }, [state.draggingIdx, state.pairs, direction]);
    const drag = React.useCallback((e, direction, minSizes) => {
        if (!state.isDragging)
            return;
        if (state.draggingIdx === undefined)
            throw new Error(`Cannot drag - 'draggingIdx' is undefined`);
        const pair = state.pairs[state.draggingIdx];
        if (pair.start === undefined)
            throw new Error(`Cannot drag - 'pair.start' is undefined`);
        if (pair.size === undefined)
            throw new Error(`Cannot drag - 'pair.size' is undefined`);
        if (pair.gutterSize === undefined)
            throw new Error(`Cannot drag - 'pair.gutterSize' is undefined`);
        // 'offset' is the width of the 'a' element in a pair.
        let offset = getPosition(direction, e) - pair.start;
        // Limit the maximum size and the minimum size of resized children.
        let aMinSize = DefaultMinSize;
        let bMinSize = DefaultMinSize;
        if (minSizes.length > state.draggingIdx) {
            aMinSize = minSizes[state.draggingIdx];
        }
        if (minSizes.length >= state.draggingIdx + 1) {
            bMinSize = minSizes[state.draggingIdx + 1];
        }
        // TODO: We should check whether the parent is big enough
        // to support these min sizes.
        if (offset < pair.gutterSize + aMinSize) {
            offset = pair.gutterSize + aMinSize;
        }
        if (offset >= pair.size - (pair.gutterSize + bMinSize)) {
            offset = pair.size - (pair.gutterSize + bMinSize);
        }
        adjustSize(direction, offset);
    }, [state.isDragging, state.draggingIdx, state.pairs, adjustSize]);
    function handleStartDragging(gutterIdx) {
        calculateSizes(direction, gutterIdx);
        startDragging(direction, gutterIdx);
    }
    const onStopDragging = () => {
        if (!state.isDragging)
            return;
        if (state.draggingIdx === undefined)
            throw new Error(`Cannot calculate sizes after dragging = 'state.draggingIdx' is undefined`);
        calculateSizes(direction, state.draggingIdx);
        stopDragging();
    };
    const onMove = (e) => {
        if (!state.isDragging)
            return;
        if (isTouchEvent(e)) {
            // touch event also scrolls the page, so we need to prevent that
            e.preventDefault();
        }
        drag(e, direction, direction === SplitDirection.Horizontal ? minWidths : minHeights);
    };
    useEventListener("mouseup", onStopDragging, [state.isDragging, stopDragging]);
    useEventListener("mousemove", onMove, [direction, state.isDragging, drag, minWidths, minHeights]);
    useEventListener("touchend", onStopDragging, [state.isDragging, stopDragging], { condition: isTouchDevice });
    useEventListener("touchmove", onMove, [direction, state.isDragging, drag, minWidths, minHeights], { condition: isTouchDevice, passive: !isTouchDevice });
    // This makes sure that Splitter properly re-renders if parent's size changes dynamically.
    useEffect(function watchParentSize() {
        if (!containerRef.current)
            return;
        const el = containerRef.current.parentElement;
        // Splitter must have a parent element. In the most trivial example it's either <body> or <html>.
        if (!el)
            return;
        // TODO: Potential performance issue!
        // When nesting Splitters the `observer` is registered for each nesting "level".
        // Splitter's parent element is another Splitter in the nesting use case.
        const observer = new ResizeObserver(() => {
            const style = getComputedStyle(el);
            const size = direction === SplitDirection.Horizontal ? el.clientWidth : el.clientHeight;
            const isReady = !!style && !!size;
            setIsReadyToCompute(isReady);
        });
        observer.observe(el);
        return () => {
            observer.disconnect();
        };
    }, [
        containerRef.current,
        direction,
    ]);
    // Initial setup, runs every time the child views change.
    useEffect(function initialSetup() {
        if (!state.isReady)
            return;
        if (childRefs.current && !childRefs.current[0].offsetParent)
            return;
        // By the time first useEffect runs refs should be already set, unless something really bad happened.
        if (!childRefs.current || !gutterRefs.current) {
            throw new Error(`Cannot create pairs - either variable 'childRefs' or 'gutterRefs' is undefined`);
        }
        // Don't create pairs if there's only one child.
        if (children.length <= 1) {
            setInitialSizes(direction, childRefs.current, gutterRefs.current, initialSizes);
        }
        else {
            setInitialSizes(direction, childRefs.current, gutterRefs.current, initialSizes);
            createPairs(direction, childRefs.current, gutterRefs.current);
        }
    }, [
        reactChildren,
        state.isReady,
        direction,
        setInitialSizes,
        createPairs,
        initialSizes,
    ]);
    function addRef(refs, el) {
        if (!refs.current)
            throw new Error(`Can't add element to ref object - ref isn't initialized`);
        if (el && !refs.current.includes(el)) {
            refs.current.push(el);
        }
    }
    return (React.createElement("div", { className: '__dbk__container ' + `${direction}`, ref: containerRef }, state.isReady && children.map((c, idx) => (React.createElement(React.Fragment, { key: idx },
        React.createElement("div", { ref: el => addRef(childRefs, el), className: '__dbk__child-wrapper ' + (idx < classes.length ? classes[idx] : '') }, c),
        idx < children.length - 1 &&
            React.createElement(Gutter, { ref: el => addRef(gutterRefs, el), className: gutterClassName, theme: gutterTheme, draggerClassName: draggerClassName, direction: direction, onDragging: () => handleStartDragging(idx) }))))));
}

export { GutterTheme, SplitDirection, Split as default, isTouchDevice };
//# sourceMappingURL=index.js.map
