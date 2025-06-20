var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
(function(React$1, ReactDOM2) {
  "use strict";
  var _focused, _cleanup, _setup, _a, _online, _cleanup2, _setup2, _b, _gcTimeout, _c, _initialState, _revertState, _cache, _client, _retryer, _defaultOptions, _abortSignalConsumed, _Query_instances, dispatch_fn, _d, _queries, _e, _observers, _mutationCache, _retryer2, _Mutation_instances, dispatch_fn2, _f, _mutations, _scopes, _mutationId, _g, _queryCache, _mutationCache2, _defaultOptions2, _queryDefaults, _mutationDefaults, _mountCount, _unsubscribeFocus, _unsubscribeOnline, _h;
  function _interopNamespaceDefault(e) {
    const n2 = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
    if (e) {
      for (const k2 in e) {
        if (k2 !== "default") {
          const d = Object.getOwnPropertyDescriptor(e, k2);
          Object.defineProperty(n2, k2, d.get ? d : {
            enumerable: true,
            get: () => e[k2]
          });
        }
      }
    }
    n2.default = e;
    return Object.freeze(n2);
  }
  const React__namespace = /* @__PURE__ */ _interopNamespaceDefault(React$1);
  const ReactDOM__namespace = /* @__PURE__ */ _interopNamespaceDefault(ReactDOM2);
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = React$1, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  var createRoot;
  var m = ReactDOM2;
  {
    createRoot = m.createRoot;
    m.hydrateRoot;
  }
  const TOAST_LIMIT = 1;
  const TOAST_REMOVE_DELAY = 1e6;
  let count$2 = 0;
  function genId() {
    count$2 = (count$2 + 1) % Number.MAX_SAFE_INTEGER;
    return count$2.toString();
  }
  const toastTimeouts = /* @__PURE__ */ new Map();
  const addToRemoveQueue = (toastId) => {
    if (toastTimeouts.has(toastId)) {
      return;
    }
    const timeout = setTimeout(() => {
      toastTimeouts.delete(toastId);
      dispatch({
        type: "REMOVE_TOAST",
        toastId
      });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD_TOAST":
        return {
          ...state,
          toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
        };
      case "UPDATE_TOAST":
        return {
          ...state,
          toasts: state.toasts.map(
            (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
          )
        };
      case "DISMISS_TOAST": {
        const { toastId } = action;
        if (toastId) {
          addToRemoveQueue(toastId);
        } else {
          state.toasts.forEach((toast2) => {
            addToRemoveQueue(toast2.id);
          });
        }
        return {
          ...state,
          toasts: state.toasts.map(
            (t) => t.id === toastId || toastId === void 0 ? {
              ...t,
              open: false
            } : t
          )
        };
      }
      case "REMOVE_TOAST":
        if (action.toastId === void 0) {
          return {
            ...state,
            toasts: []
          };
        }
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== action.toastId)
        };
    }
  };
  const listeners = [];
  let memoryState = { toasts: [] };
  function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
      listener(memoryState);
    });
  }
  function toast({ ...props }) {
    const id = genId();
    const update = (props2) => dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props2, id }
    });
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) dismiss();
        }
      }
    });
    return {
      id,
      dismiss,
      update
    };
  }
  function useToast() {
    const [state, setState] = React__namespace.useState(memoryState);
    React__namespace.useEffect(() => {
      listeners.push(setState);
      return () => {
        const index2 = listeners.indexOf(setState);
        if (index2 > -1) {
          listeners.splice(index2, 1);
        }
      };
    }, [state]);
    return {
      ...state,
      toast,
      dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
    };
  }
  function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
    return function handleEvent(event) {
      originalEventHandler == null ? void 0 : originalEventHandler(event);
      if (checkForDefaultPrevented === false || !event.defaultPrevented) {
        return ourEventHandler == null ? void 0 : ourEventHandler(event);
      }
    };
  }
  function setRef(ref, value) {
    if (typeof ref === "function") {
      return ref(value);
    } else if (ref !== null && ref !== void 0) {
      ref.current = value;
    }
  }
  function composeRefs(...refs) {
    return (node) => {
      let hasCleanup = false;
      const cleanups = refs.map((ref) => {
        const cleanup = setRef(ref, node);
        if (!hasCleanup && typeof cleanup == "function") {
          hasCleanup = true;
        }
        return cleanup;
      });
      if (hasCleanup) {
        return () => {
          for (let i = 0; i < cleanups.length; i++) {
            const cleanup = cleanups[i];
            if (typeof cleanup == "function") {
              cleanup();
            } else {
              setRef(refs[i], null);
            }
          }
        };
      }
    };
  }
  function useComposedRefs(...refs) {
    return React__namespace.useCallback(composeRefs(...refs), refs);
  }
  function createContextScope(scopeName, createContextScopeDeps = []) {
    let defaultContexts = [];
    function createContext3(rootComponentName, defaultContext) {
      const BaseContext = React__namespace.createContext(defaultContext);
      const index2 = defaultContexts.length;
      defaultContexts = [...defaultContexts, defaultContext];
      const Provider2 = (props) => {
        var _a2;
        const { scope, children, ...context } = props;
        const Context = ((_a2 = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a2[index2]) || BaseContext;
        const value = React__namespace.useMemo(() => context, Object.values(context));
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
      };
      Provider2.displayName = rootComponentName + "Provider";
      function useContext2(consumerName, scope) {
        var _a2;
        const Context = ((_a2 = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a2[index2]) || BaseContext;
        const context = React__namespace.useContext(Context);
        if (context) return context;
        if (defaultContext !== void 0) return defaultContext;
        throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
      }
      return [Provider2, useContext2];
    }
    const createScope = () => {
      const scopeContexts = defaultContexts.map((defaultContext) => {
        return React__namespace.createContext(defaultContext);
      });
      return function useScope(scope) {
        const contexts = (scope == null ? void 0 : scope[scopeName]) || scopeContexts;
        return React__namespace.useMemo(
          () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
          [scope, contexts]
        );
      };
    };
    createScope.scopeName = scopeName;
    return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
  }
  function composeContextScopes(...scopes) {
    const baseScope = scopes[0];
    if (scopes.length === 1) return baseScope;
    const createScope = () => {
      const scopeHooks = scopes.map((createScope2) => ({
        useScope: createScope2(),
        scopeName: createScope2.scopeName
      }));
      return function useComposedScopes(overrideScopes) {
        const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
          const scopeProps = useScope(overrideScopes);
          const currentScope = scopeProps[`__scope${scopeName}`];
          return { ...nextScopes2, ...currentScope };
        }, {});
        return React__namespace.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
      };
    };
    createScope.scopeName = baseScope.scopeName;
    return createScope;
  }
  // @__NO_SIDE_EFFECTS__
  function createSlot(ownerName) {
    const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
    const Slot2 = React__namespace.forwardRef((props, forwardedRef) => {
      const { children, ...slotProps } = props;
      const childrenArray = React__namespace.Children.toArray(children);
      const slottable = childrenArray.find(isSlottable);
      if (slottable) {
        const newElement = slottable.props.children;
        const newChildren = childrenArray.map((child) => {
          if (child === slottable) {
            if (React__namespace.Children.count(newElement) > 1) return React__namespace.Children.only(null);
            return React__namespace.isValidElement(newElement) ? newElement.props.children : null;
          } else {
            return child;
          }
        });
        return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: React__namespace.isValidElement(newElement) ? React__namespace.cloneElement(newElement, void 0, newChildren) : null });
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
    });
    Slot2.displayName = `${ownerName}.Slot`;
    return Slot2;
  }
  var Slot$1 = /* @__PURE__ */ createSlot("Slot");
  // @__NO_SIDE_EFFECTS__
  function createSlotClone(ownerName) {
    const SlotClone = React__namespace.forwardRef((props, forwardedRef) => {
      const { children, ...slotProps } = props;
      if (React__namespace.isValidElement(children)) {
        const childrenRef = getElementRef$1(children);
        const props2 = mergeProps(slotProps, children.props);
        if (children.type !== React__namespace.Fragment) {
          props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
        }
        return React__namespace.cloneElement(children, props2);
      }
      return React__namespace.Children.count(children) > 1 ? React__namespace.Children.only(null) : null;
    });
    SlotClone.displayName = `${ownerName}.SlotClone`;
    return SlotClone;
  }
  var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
  // @__NO_SIDE_EFFECTS__
  function createSlottable(ownerName) {
    const Slottable2 = ({ children }) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
    };
    Slottable2.displayName = `${ownerName}.Slottable`;
    Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
    return Slottable2;
  }
  function isSlottable(child) {
    return React__namespace.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
  }
  function mergeProps(slotProps, childProps) {
    const overrideProps = { ...childProps };
    for (const propName in childProps) {
      const slotPropValue = slotProps[propName];
      const childPropValue = childProps[propName];
      const isHandler = /^on[A-Z]/.test(propName);
      if (isHandler) {
        if (slotPropValue && childPropValue) {
          overrideProps[propName] = (...args) => {
            const result = childPropValue(...args);
            slotPropValue(...args);
            return result;
          };
        } else if (slotPropValue) {
          overrideProps[propName] = slotPropValue;
        }
      } else if (propName === "style") {
        overrideProps[propName] = { ...slotPropValue, ...childPropValue };
      } else if (propName === "className") {
        overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
      }
    }
    return { ...slotProps, ...overrideProps };
  }
  function getElementRef$1(element) {
    var _a2, _b2;
    let getter = (_a2 = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a2.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.ref;
    }
    getter = (_b2 = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b2.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.props.ref;
    }
    return element.props.ref || element.ref;
  }
  function createCollection(name) {
    const PROVIDER_NAME2 = name + "CollectionProvider";
    const [createCollectionContext, createCollectionScope2] = createContextScope(PROVIDER_NAME2);
    const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(
      PROVIDER_NAME2,
      { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
    );
    const CollectionProvider = (props) => {
      const { scope, children } = props;
      const ref = React$1.useRef(null);
      const itemMap = React$1.useRef(/* @__PURE__ */ new Map()).current;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children });
    };
    CollectionProvider.displayName = PROVIDER_NAME2;
    const COLLECTION_SLOT_NAME = name + "CollectionSlot";
    const CollectionSlotImpl = /* @__PURE__ */ createSlot(COLLECTION_SLOT_NAME);
    const CollectionSlot = React$1.forwardRef(
      (props, forwardedRef) => {
        const { scope, children } = props;
        const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
        const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionSlotImpl, { ref: composedRefs, children });
      }
    );
    CollectionSlot.displayName = COLLECTION_SLOT_NAME;
    const ITEM_SLOT_NAME = name + "CollectionItemSlot";
    const ITEM_DATA_ATTR = "data-radix-collection-item";
    const CollectionItemSlotImpl = /* @__PURE__ */ createSlot(ITEM_SLOT_NAME);
    const CollectionItemSlot = React$1.forwardRef(
      (props, forwardedRef) => {
        const { scope, children, ...itemData } = props;
        const ref = React$1.useRef(null);
        const composedRefs = useComposedRefs(forwardedRef, ref);
        const context = useCollectionContext(ITEM_SLOT_NAME, scope);
        React$1.useEffect(() => {
          context.itemMap.set(ref, { ref, ...itemData });
          return () => void context.itemMap.delete(ref);
        });
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
      }
    );
    CollectionItemSlot.displayName = ITEM_SLOT_NAME;
    function useCollection2(scope) {
      const context = useCollectionContext(name + "CollectionConsumer", scope);
      const getItems = React$1.useCallback(() => {
        const collectionNode = context.collectionRef.current;
        if (!collectionNode) return [];
        const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
        const items = Array.from(context.itemMap.values());
        const orderedItems = items.sort(
          (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
        );
        return orderedItems;
      }, [context.collectionRef, context.itemMap]);
      return getItems;
    }
    return [
      { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
      useCollection2,
      createCollectionScope2
    ];
  }
  var NODES = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul"
  ];
  var Primitive = NODES.reduce((primitive, node) => {
    const Slot2 = /* @__PURE__ */ createSlot(`Primitive.${node}`);
    const Node2 = React__namespace.forwardRef((props, forwardedRef) => {
      const { asChild, ...primitiveProps } = props;
      const Comp = asChild ? Slot2 : node;
      if (typeof window !== "undefined") {
        window[Symbol.for("radix-ui")] = true;
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
    });
    Node2.displayName = `Primitive.${node}`;
    return { ...primitive, [node]: Node2 };
  }, {});
  function dispatchDiscreteCustomEvent(target, event) {
    if (target) ReactDOM__namespace.flushSync(() => target.dispatchEvent(event));
  }
  function useCallbackRef$1(callback) {
    const callbackRef = React__namespace.useRef(callback);
    React__namespace.useEffect(() => {
      callbackRef.current = callback;
    });
    return React__namespace.useMemo(() => (...args) => {
      var _a2;
      return (_a2 = callbackRef.current) == null ? void 0 : _a2.call(callbackRef, ...args);
    }, []);
  }
  function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument = globalThis == null ? void 0 : globalThis.document) {
    const onEscapeKeyDown = useCallbackRef$1(onEscapeKeyDownProp);
    React__namespace.useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          onEscapeKeyDown(event);
        }
      };
      ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
      return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
    }, [onEscapeKeyDown, ownerDocument]);
  }
  var DISMISSABLE_LAYER_NAME = "DismissableLayer";
  var CONTEXT_UPDATE = "dismissableLayer.update";
  var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
  var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
  var originalBodyPointerEvents;
  var DismissableLayerContext = React__namespace.createContext({
    layers: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    branches: /* @__PURE__ */ new Set()
  });
  var DismissableLayer = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        disableOutsidePointerEvents = false,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside,
        onInteractOutside,
        onDismiss,
        ...layerProps
      } = props;
      const context = React__namespace.useContext(DismissableLayerContext);
      const [node, setNode] = React__namespace.useState(null);
      const ownerDocument = (node == null ? void 0 : node.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document);
      const [, force] = React__namespace.useState({});
      const composedRefs = useComposedRefs(forwardedRef, (node2) => setNode(node2));
      const layers = Array.from(context.layers);
      const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
      const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
      const index2 = node ? layers.indexOf(node) : -1;
      const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
      const isPointerEventsEnabled = index2 >= highestLayerWithOutsidePointerEventsDisabledIndex;
      const pointerDownOutside = usePointerDownOutside((event) => {
        const target = event.target;
        const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
        if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
        onPointerDownOutside == null ? void 0 : onPointerDownOutside(event);
        onInteractOutside == null ? void 0 : onInteractOutside(event);
        if (!event.defaultPrevented) onDismiss == null ? void 0 : onDismiss();
      }, ownerDocument);
      const focusOutside = useFocusOutside((event) => {
        const target = event.target;
        const isFocusInBranch = [...context.branches].some((branch) => branch.contains(target));
        if (isFocusInBranch) return;
        onFocusOutside == null ? void 0 : onFocusOutside(event);
        onInteractOutside == null ? void 0 : onInteractOutside(event);
        if (!event.defaultPrevented) onDismiss == null ? void 0 : onDismiss();
      }, ownerDocument);
      useEscapeKeydown((event) => {
        const isHighestLayer = index2 === context.layers.size - 1;
        if (!isHighestLayer) return;
        onEscapeKeyDown == null ? void 0 : onEscapeKeyDown(event);
        if (!event.defaultPrevented && onDismiss) {
          event.preventDefault();
          onDismiss();
        }
      }, ownerDocument);
      React__namespace.useEffect(() => {
        if (!node) return;
        if (disableOutsidePointerEvents) {
          if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
            originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
            ownerDocument.body.style.pointerEvents = "none";
          }
          context.layersWithOutsidePointerEventsDisabled.add(node);
        }
        context.layers.add(node);
        dispatchUpdate();
        return () => {
          if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) {
            ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
          }
        };
      }, [node, ownerDocument, disableOutsidePointerEvents, context]);
      React__namespace.useEffect(() => {
        return () => {
          if (!node) return;
          context.layers.delete(node);
          context.layersWithOutsidePointerEventsDisabled.delete(node);
          dispatchUpdate();
        };
      }, [node, context]);
      React__namespace.useEffect(() => {
        const handleUpdate = () => force({});
        document.addEventListener(CONTEXT_UPDATE, handleUpdate);
        return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
      }, []);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          ...layerProps,
          ref: composedRefs,
          style: {
            pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
            ...props.style
          },
          onFocusCapture: composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture),
          onBlurCapture: composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture),
          onPointerDownCapture: composeEventHandlers(
            props.onPointerDownCapture,
            pointerDownOutside.onPointerDownCapture
          )
        }
      );
    }
  );
  DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
  var BRANCH_NAME = "DismissableLayerBranch";
  var DismissableLayerBranch = React__namespace.forwardRef((props, forwardedRef) => {
    const context = React__namespace.useContext(DismissableLayerContext);
    const ref = React__namespace.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    React__namespace.useEffect(() => {
      const node = ref.current;
      if (node) {
        context.branches.add(node);
        return () => {
          context.branches.delete(node);
        };
      }
    }, [context.branches]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...props, ref: composedRefs });
  });
  DismissableLayerBranch.displayName = BRANCH_NAME;
  function usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis == null ? void 0 : globalThis.document) {
    const handlePointerDownOutside = useCallbackRef$1(onPointerDownOutside);
    const isPointerInsideReactTreeRef = React__namespace.useRef(false);
    const handleClickRef = React__namespace.useRef(() => {
    });
    React__namespace.useEffect(() => {
      const handlePointerDown = (event) => {
        if (event.target && !isPointerInsideReactTreeRef.current) {
          let handleAndDispatchPointerDownOutsideEvent2 = function() {
            handleAndDispatchCustomEvent$1(
              POINTER_DOWN_OUTSIDE,
              handlePointerDownOutside,
              eventDetail,
              { discrete: true }
            );
          };
          const eventDetail = { originalEvent: event };
          if (event.pointerType === "touch") {
            ownerDocument.removeEventListener("click", handleClickRef.current);
            handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
            ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
          } else {
            handleAndDispatchPointerDownOutsideEvent2();
          }
        } else {
          ownerDocument.removeEventListener("click", handleClickRef.current);
        }
        isPointerInsideReactTreeRef.current = false;
      };
      const timerId = window.setTimeout(() => {
        ownerDocument.addEventListener("pointerdown", handlePointerDown);
      }, 0);
      return () => {
        window.clearTimeout(timerId);
        ownerDocument.removeEventListener("pointerdown", handlePointerDown);
        ownerDocument.removeEventListener("click", handleClickRef.current);
      };
    }, [ownerDocument, handlePointerDownOutside]);
    return {
      // ensures we check React component tree (not just DOM tree)
      onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true
    };
  }
  function useFocusOutside(onFocusOutside, ownerDocument = globalThis == null ? void 0 : globalThis.document) {
    const handleFocusOutside = useCallbackRef$1(onFocusOutside);
    const isFocusInsideReactTreeRef = React__namespace.useRef(false);
    React__namespace.useEffect(() => {
      const handleFocus = (event) => {
        if (event.target && !isFocusInsideReactTreeRef.current) {
          const eventDetail = { originalEvent: event };
          handleAndDispatchCustomEvent$1(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
            discrete: false
          });
        }
      };
      ownerDocument.addEventListener("focusin", handleFocus);
      return () => ownerDocument.removeEventListener("focusin", handleFocus);
    }, [ownerDocument, handleFocusOutside]);
    return {
      onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
      onBlurCapture: () => isFocusInsideReactTreeRef.current = false
    };
  }
  function dispatchUpdate() {
    const event = new CustomEvent(CONTEXT_UPDATE);
    document.dispatchEvent(event);
  }
  function handleAndDispatchCustomEvent$1(name, handler, detail, { discrete }) {
    const target = detail.originalEvent.target;
    const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail });
    if (handler) target.addEventListener(name, handler, { once: true });
    if (discrete) {
      dispatchDiscreteCustomEvent(target, event);
    } else {
      target.dispatchEvent(event);
    }
  }
  var Root$a = DismissableLayer;
  var Branch = DismissableLayerBranch;
  var useLayoutEffect2 = (globalThis == null ? void 0 : globalThis.document) ? React__namespace.useLayoutEffect : () => {
  };
  var PORTAL_NAME$2 = "Portal";
  var Portal$1 = React__namespace.forwardRef((props, forwardedRef) => {
    var _a2;
    const { container: containerProp, ...portalProps } = props;
    const [mounted, setMounted] = React__namespace.useState(false);
    useLayoutEffect2(() => setMounted(true), []);
    const container = containerProp || mounted && ((_a2 = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : _a2.body);
    return container ? ReactDOM2.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...portalProps, ref: forwardedRef }), container) : null;
  });
  Portal$1.displayName = PORTAL_NAME$2;
  function useStateMachine$1(initialState, machine) {
    return React__namespace.useReducer((state, event) => {
      const nextState = machine[state][event];
      return nextState ?? state;
    }, initialState);
  }
  var Presence = (props) => {
    const { present, children } = props;
    const presence = usePresence(present);
    const child = typeof children === "function" ? children({ present: presence.isPresent }) : React__namespace.Children.only(children);
    const ref = useComposedRefs(presence.ref, getElementRef(child));
    const forceMount = typeof children === "function";
    return forceMount || presence.isPresent ? React__namespace.cloneElement(child, { ref }) : null;
  };
  Presence.displayName = "Presence";
  function usePresence(present) {
    const [node, setNode] = React__namespace.useState();
    const stylesRef = React__namespace.useRef(null);
    const prevPresentRef = React__namespace.useRef(present);
    const prevAnimationNameRef = React__namespace.useRef("none");
    const initialState = present ? "mounted" : "unmounted";
    const [state, send] = useStateMachine$1(initialState, {
      mounted: {
        UNMOUNT: "unmounted",
        ANIMATION_OUT: "unmountSuspended"
      },
      unmountSuspended: {
        MOUNT: "mounted",
        ANIMATION_END: "unmounted"
      },
      unmounted: {
        MOUNT: "mounted"
      }
    });
    React__namespace.useEffect(() => {
      const currentAnimationName = getAnimationName(stylesRef.current);
      prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
    }, [state]);
    useLayoutEffect2(() => {
      const styles = stylesRef.current;
      const wasPresent = prevPresentRef.current;
      const hasPresentChanged = wasPresent !== present;
      if (hasPresentChanged) {
        const prevAnimationName = prevAnimationNameRef.current;
        const currentAnimationName = getAnimationName(styles);
        if (present) {
          send("MOUNT");
        } else if (currentAnimationName === "none" || (styles == null ? void 0 : styles.display) === "none") {
          send("UNMOUNT");
        } else {
          const isAnimating = prevAnimationName !== currentAnimationName;
          if (wasPresent && isAnimating) {
            send("ANIMATION_OUT");
          } else {
            send("UNMOUNT");
          }
        }
        prevPresentRef.current = present;
      }
    }, [present, send]);
    useLayoutEffect2(() => {
      if (node) {
        let timeoutId;
        const ownerWindow = node.ownerDocument.defaultView ?? window;
        const handleAnimationEnd = (event) => {
          const currentAnimationName = getAnimationName(stylesRef.current);
          const isCurrentAnimation = currentAnimationName.includes(event.animationName);
          if (event.target === node && isCurrentAnimation) {
            send("ANIMATION_END");
            if (!prevPresentRef.current) {
              const currentFillMode = node.style.animationFillMode;
              node.style.animationFillMode = "forwards";
              timeoutId = ownerWindow.setTimeout(() => {
                if (node.style.animationFillMode === "forwards") {
                  node.style.animationFillMode = currentFillMode;
                }
              });
            }
          }
        };
        const handleAnimationStart = (event) => {
          if (event.target === node) {
            prevAnimationNameRef.current = getAnimationName(stylesRef.current);
          }
        };
        node.addEventListener("animationstart", handleAnimationStart);
        node.addEventListener("animationcancel", handleAnimationEnd);
        node.addEventListener("animationend", handleAnimationEnd);
        return () => {
          ownerWindow.clearTimeout(timeoutId);
          node.removeEventListener("animationstart", handleAnimationStart);
          node.removeEventListener("animationcancel", handleAnimationEnd);
          node.removeEventListener("animationend", handleAnimationEnd);
        };
      } else {
        send("ANIMATION_END");
      }
    }, [node, send]);
    return {
      isPresent: ["mounted", "unmountSuspended"].includes(state),
      ref: React__namespace.useCallback((node2) => {
        stylesRef.current = node2 ? getComputedStyle(node2) : null;
        setNode(node2);
      }, [])
    };
  }
  function getAnimationName(styles) {
    return (styles == null ? void 0 : styles.animationName) || "none";
  }
  function getElementRef(element) {
    var _a2, _b2;
    let getter = (_a2 = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a2.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.ref;
    }
    getter = (_b2 = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b2.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.props.ref;
    }
    return element.props.ref || element.ref;
  }
  var useInsertionEffect = React__namespace[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
  function useControllableState({
    prop,
    defaultProp,
    onChange = () => {
    },
    caller
  }) {
    const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
      defaultProp,
      onChange
    });
    const isControlled = prop !== void 0;
    const value = isControlled ? prop : uncontrolledProp;
    {
      const isControlledRef = React__namespace.useRef(prop !== void 0);
      React__namespace.useEffect(() => {
        const wasControlled = isControlledRef.current;
        if (wasControlled !== isControlled) {
          const from = wasControlled ? "controlled" : "uncontrolled";
          const to = isControlled ? "controlled" : "uncontrolled";
          console.warn(
            `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
          );
        }
        isControlledRef.current = isControlled;
      }, [isControlled, caller]);
    }
    const setValue = React__namespace.useCallback(
      (nextValue) => {
        var _a2;
        if (isControlled) {
          const value2 = isFunction$1(nextValue) ? nextValue(prop) : nextValue;
          if (value2 !== prop) {
            (_a2 = onChangeRef.current) == null ? void 0 : _a2.call(onChangeRef, value2);
          }
        } else {
          setUncontrolledProp(nextValue);
        }
      },
      [isControlled, prop, setUncontrolledProp, onChangeRef]
    );
    return [value, setValue];
  }
  function useUncontrolledState({
    defaultProp,
    onChange
  }) {
    const [value, setValue] = React__namespace.useState(defaultProp);
    const prevValueRef = React__namespace.useRef(value);
    const onChangeRef = React__namespace.useRef(onChange);
    useInsertionEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);
    React__namespace.useEffect(() => {
      var _a2;
      if (prevValueRef.current !== value) {
        (_a2 = onChangeRef.current) == null ? void 0 : _a2.call(onChangeRef, value);
        prevValueRef.current = value;
      }
    }, [value, prevValueRef]);
    return [value, setValue, onChangeRef];
  }
  function isFunction$1(value) {
    return typeof value === "function";
  }
  var VISUALLY_HIDDEN_STYLES = Object.freeze({
    // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
    position: "absolute",
    border: 0,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    wordWrap: "normal"
  });
  var NAME$3 = "VisuallyHidden";
  var VisuallyHidden = React__namespace.forwardRef(
    (props, forwardedRef) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.span,
        {
          ...props,
          ref: forwardedRef,
          style: { ...VISUALLY_HIDDEN_STYLES, ...props.style }
        }
      );
    }
  );
  VisuallyHidden.displayName = NAME$3;
  var Root$9 = VisuallyHidden;
  var PROVIDER_NAME$1 = "ToastProvider";
  var [Collection$3, useCollection$3, createCollectionScope$3] = createCollection("Toast");
  var [createToastContext, createToastScope] = createContextScope("Toast", [createCollectionScope$3]);
  var [ToastProviderProvider, useToastProviderContext] = createToastContext(PROVIDER_NAME$1);
  var ToastProvider$1 = (props) => {
    const {
      __scopeToast,
      label = "Notification",
      duration = 5e3,
      swipeDirection = "right",
      swipeThreshold = 50,
      children
    } = props;
    const [viewport, setViewport] = React__namespace.useState(null);
    const [toastCount, setToastCount] = React__namespace.useState(0);
    const isFocusedToastEscapeKeyDownRef = React__namespace.useRef(false);
    const isClosePausedRef = React__namespace.useRef(false);
    if (!label.trim()) {
      console.error(
        `Invalid prop \`label\` supplied to \`${PROVIDER_NAME$1}\`. Expected non-empty \`string\`.`
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$3.Provider, { scope: __scopeToast, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ToastProviderProvider,
      {
        scope: __scopeToast,
        label,
        duration,
        swipeDirection,
        swipeThreshold,
        toastCount,
        viewport,
        onViewportChange: setViewport,
        onToastAdd: React__namespace.useCallback(() => setToastCount((prevCount) => prevCount + 1), []),
        onToastRemove: React__namespace.useCallback(() => setToastCount((prevCount) => prevCount - 1), []),
        isFocusedToastEscapeKeyDownRef,
        isClosePausedRef,
        children
      }
    ) });
  };
  ToastProvider$1.displayName = PROVIDER_NAME$1;
  var VIEWPORT_NAME$2 = "ToastViewport";
  var VIEWPORT_DEFAULT_HOTKEY = ["F8"];
  var VIEWPORT_PAUSE = "toast.viewportPause";
  var VIEWPORT_RESUME = "toast.viewportResume";
  var ToastViewport$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeToast,
        hotkey = VIEWPORT_DEFAULT_HOTKEY,
        label = "Notifications ({hotkey})",
        ...viewportProps
      } = props;
      const context = useToastProviderContext(VIEWPORT_NAME$2, __scopeToast);
      const getItems = useCollection$3(__scopeToast);
      const wrapperRef = React__namespace.useRef(null);
      const headFocusProxyRef = React__namespace.useRef(null);
      const tailFocusProxyRef = React__namespace.useRef(null);
      const ref = React__namespace.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
      const hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
      const hasToasts = context.toastCount > 0;
      React__namespace.useEffect(() => {
        const handleKeyDown = (event) => {
          var _a2;
          const isHotkeyPressed = hotkey.length !== 0 && hotkey.every((key) => event[key] || event.code === key);
          if (isHotkeyPressed) (_a2 = ref.current) == null ? void 0 : _a2.focus();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
      }, [hotkey]);
      React__namespace.useEffect(() => {
        const wrapper = wrapperRef.current;
        const viewport = ref.current;
        if (hasToasts && wrapper && viewport) {
          const handlePause = () => {
            if (!context.isClosePausedRef.current) {
              const pauseEvent = new CustomEvent(VIEWPORT_PAUSE);
              viewport.dispatchEvent(pauseEvent);
              context.isClosePausedRef.current = true;
            }
          };
          const handleResume = () => {
            if (context.isClosePausedRef.current) {
              const resumeEvent = new CustomEvent(VIEWPORT_RESUME);
              viewport.dispatchEvent(resumeEvent);
              context.isClosePausedRef.current = false;
            }
          };
          const handleFocusOutResume = (event) => {
            const isFocusMovingOutside = !wrapper.contains(event.relatedTarget);
            if (isFocusMovingOutside) handleResume();
          };
          const handlePointerLeaveResume = () => {
            const isFocusInside = wrapper.contains(document.activeElement);
            if (!isFocusInside) handleResume();
          };
          wrapper.addEventListener("focusin", handlePause);
          wrapper.addEventListener("focusout", handleFocusOutResume);
          wrapper.addEventListener("pointermove", handlePause);
          wrapper.addEventListener("pointerleave", handlePointerLeaveResume);
          window.addEventListener("blur", handlePause);
          window.addEventListener("focus", handleResume);
          return () => {
            wrapper.removeEventListener("focusin", handlePause);
            wrapper.removeEventListener("focusout", handleFocusOutResume);
            wrapper.removeEventListener("pointermove", handlePause);
            wrapper.removeEventListener("pointerleave", handlePointerLeaveResume);
            window.removeEventListener("blur", handlePause);
            window.removeEventListener("focus", handleResume);
          };
        }
      }, [hasToasts, context.isClosePausedRef]);
      const getSortedTabbableCandidates = React__namespace.useCallback(
        ({ tabbingDirection }) => {
          const toastItems = getItems();
          const tabbableCandidates = toastItems.map((toastItem) => {
            const toastNode = toastItem.ref.current;
            const toastTabbableCandidates = [toastNode, ...getTabbableCandidates$1(toastNode)];
            return tabbingDirection === "forwards" ? toastTabbableCandidates : toastTabbableCandidates.reverse();
          });
          return (tabbingDirection === "forwards" ? tabbableCandidates.reverse() : tabbableCandidates).flat();
        },
        [getItems]
      );
      React__namespace.useEffect(() => {
        const viewport = ref.current;
        if (viewport) {
          const handleKeyDown = (event) => {
            var _a2, _b2, _c2;
            const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
            const isTabKey = event.key === "Tab" && !isMetaKey;
            if (isTabKey) {
              const focusedElement = document.activeElement;
              const isTabbingBackwards = event.shiftKey;
              const targetIsViewport = event.target === viewport;
              if (targetIsViewport && isTabbingBackwards) {
                (_a2 = headFocusProxyRef.current) == null ? void 0 : _a2.focus();
                return;
              }
              const tabbingDirection = isTabbingBackwards ? "backwards" : "forwards";
              const sortedCandidates = getSortedTabbableCandidates({ tabbingDirection });
              const index2 = sortedCandidates.findIndex((candidate) => candidate === focusedElement);
              if (focusFirst$2(sortedCandidates.slice(index2 + 1))) {
                event.preventDefault();
              } else {
                isTabbingBackwards ? (_b2 = headFocusProxyRef.current) == null ? void 0 : _b2.focus() : (_c2 = tailFocusProxyRef.current) == null ? void 0 : _c2.focus();
              }
            }
          };
          viewport.addEventListener("keydown", handleKeyDown);
          return () => viewport.removeEventListener("keydown", handleKeyDown);
        }
      }, [getItems, getSortedTabbableCandidates]);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Branch,
        {
          ref: wrapperRef,
          role: "region",
          "aria-label": label.replace("{hotkey}", hotkeyLabel),
          tabIndex: -1,
          style: { pointerEvents: hasToasts ? void 0 : "none" },
          children: [
            hasToasts && /* @__PURE__ */ jsxRuntimeExports.jsx(
              FocusProxy,
              {
                ref: headFocusProxyRef,
                onFocusFromOutsideViewport: () => {
                  const tabbableCandidates = getSortedTabbableCandidates({
                    tabbingDirection: "forwards"
                  });
                  focusFirst$2(tabbableCandidates);
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$3.Slot, { scope: __scopeToast, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.ol, { tabIndex: -1, ...viewportProps, ref: composedRefs }) }),
            hasToasts && /* @__PURE__ */ jsxRuntimeExports.jsx(
              FocusProxy,
              {
                ref: tailFocusProxyRef,
                onFocusFromOutsideViewport: () => {
                  const tabbableCandidates = getSortedTabbableCandidates({
                    tabbingDirection: "backwards"
                  });
                  focusFirst$2(tabbableCandidates);
                }
              }
            )
          ]
        }
      );
    }
  );
  ToastViewport$1.displayName = VIEWPORT_NAME$2;
  var FOCUS_PROXY_NAME = "ToastFocusProxy";
  var FocusProxy = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeToast, onFocusFromOutsideViewport, ...proxyProps } = props;
      const context = useToastProviderContext(FOCUS_PROXY_NAME, __scopeToast);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        VisuallyHidden,
        {
          "aria-hidden": true,
          tabIndex: 0,
          ...proxyProps,
          ref: forwardedRef,
          style: { position: "fixed" },
          onFocus: (event) => {
            var _a2;
            const prevFocusedElement = event.relatedTarget;
            const isFocusFromOutsideViewport = !((_a2 = context.viewport) == null ? void 0 : _a2.contains(prevFocusedElement));
            if (isFocusFromOutsideViewport) onFocusFromOutsideViewport();
          }
        }
      );
    }
  );
  FocusProxy.displayName = FOCUS_PROXY_NAME;
  var TOAST_NAME = "Toast";
  var TOAST_SWIPE_START = "toast.swipeStart";
  var TOAST_SWIPE_MOVE = "toast.swipeMove";
  var TOAST_SWIPE_CANCEL = "toast.swipeCancel";
  var TOAST_SWIPE_END = "toast.swipeEnd";
  var Toast$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { forceMount, open: openProp, defaultOpen, onOpenChange, ...toastProps } = props;
      const [open, setOpen] = useControllableState({
        prop: openProp,
        defaultProp: defaultOpen ?? true,
        onChange: onOpenChange,
        caller: TOAST_NAME
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToastImpl,
        {
          open,
          ...toastProps,
          ref: forwardedRef,
          onClose: () => setOpen(false),
          onPause: useCallbackRef$1(props.onPause),
          onResume: useCallbackRef$1(props.onResume),
          onSwipeStart: composeEventHandlers(props.onSwipeStart, (event) => {
            event.currentTarget.setAttribute("data-swipe", "start");
          }),
          onSwipeMove: composeEventHandlers(props.onSwipeMove, (event) => {
            const { x, y } = event.detail.delta;
            event.currentTarget.setAttribute("data-swipe", "move");
            event.currentTarget.style.setProperty("--radix-toast-swipe-move-x", `${x}px`);
            event.currentTarget.style.setProperty("--radix-toast-swipe-move-y", `${y}px`);
          }),
          onSwipeCancel: composeEventHandlers(props.onSwipeCancel, (event) => {
            event.currentTarget.setAttribute("data-swipe", "cancel");
            event.currentTarget.style.removeProperty("--radix-toast-swipe-move-x");
            event.currentTarget.style.removeProperty("--radix-toast-swipe-move-y");
            event.currentTarget.style.removeProperty("--radix-toast-swipe-end-x");
            event.currentTarget.style.removeProperty("--radix-toast-swipe-end-y");
          }),
          onSwipeEnd: composeEventHandlers(props.onSwipeEnd, (event) => {
            const { x, y } = event.detail.delta;
            event.currentTarget.setAttribute("data-swipe", "end");
            event.currentTarget.style.removeProperty("--radix-toast-swipe-move-x");
            event.currentTarget.style.removeProperty("--radix-toast-swipe-move-y");
            event.currentTarget.style.setProperty("--radix-toast-swipe-end-x", `${x}px`);
            event.currentTarget.style.setProperty("--radix-toast-swipe-end-y", `${y}px`);
            setOpen(false);
          })
        }
      ) });
    }
  );
  Toast$1.displayName = TOAST_NAME;
  var [ToastInteractiveProvider, useToastInteractiveContext] = createToastContext(TOAST_NAME, {
    onClose() {
    }
  });
  var ToastImpl = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeToast,
        type = "foreground",
        duration: durationProp,
        open,
        onClose,
        onEscapeKeyDown,
        onPause,
        onResume,
        onSwipeStart,
        onSwipeMove,
        onSwipeCancel,
        onSwipeEnd,
        ...toastProps
      } = props;
      const context = useToastProviderContext(TOAST_NAME, __scopeToast);
      const [node, setNode] = React__namespace.useState(null);
      const composedRefs = useComposedRefs(forwardedRef, (node2) => setNode(node2));
      const pointerStartRef = React__namespace.useRef(null);
      const swipeDeltaRef = React__namespace.useRef(null);
      const duration = durationProp || context.duration;
      const closeTimerStartTimeRef = React__namespace.useRef(0);
      const closeTimerRemainingTimeRef = React__namespace.useRef(duration);
      const closeTimerRef = React__namespace.useRef(0);
      const { onToastAdd, onToastRemove } = context;
      const handleClose = useCallbackRef$1(() => {
        var _a2;
        const isFocusInToast = node == null ? void 0 : node.contains(document.activeElement);
        if (isFocusInToast) (_a2 = context.viewport) == null ? void 0 : _a2.focus();
        onClose();
      });
      const startTimer = React__namespace.useCallback(
        (duration2) => {
          if (!duration2 || duration2 === Infinity) return;
          window.clearTimeout(closeTimerRef.current);
          closeTimerStartTimeRef.current = (/* @__PURE__ */ new Date()).getTime();
          closeTimerRef.current = window.setTimeout(handleClose, duration2);
        },
        [handleClose]
      );
      React__namespace.useEffect(() => {
        const viewport = context.viewport;
        if (viewport) {
          const handleResume = () => {
            startTimer(closeTimerRemainingTimeRef.current);
            onResume == null ? void 0 : onResume();
          };
          const handlePause = () => {
            const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef.current;
            closeTimerRemainingTimeRef.current = closeTimerRemainingTimeRef.current - elapsedTime;
            window.clearTimeout(closeTimerRef.current);
            onPause == null ? void 0 : onPause();
          };
          viewport.addEventListener(VIEWPORT_PAUSE, handlePause);
          viewport.addEventListener(VIEWPORT_RESUME, handleResume);
          return () => {
            viewport.removeEventListener(VIEWPORT_PAUSE, handlePause);
            viewport.removeEventListener(VIEWPORT_RESUME, handleResume);
          };
        }
      }, [context.viewport, duration, onPause, onResume, startTimer]);
      React__namespace.useEffect(() => {
        if (open && !context.isClosePausedRef.current) startTimer(duration);
      }, [open, duration, context.isClosePausedRef, startTimer]);
      React__namespace.useEffect(() => {
        onToastAdd();
        return () => onToastRemove();
      }, [onToastAdd, onToastRemove]);
      const announceTextContent = React__namespace.useMemo(() => {
        return node ? getAnnounceTextContent(node) : null;
      }, [node]);
      if (!context.viewport) return null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        announceTextContent && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToastAnnounce,
          {
            __scopeToast,
            role: "status",
            "aria-live": type === "foreground" ? "assertive" : "polite",
            "aria-atomic": true,
            children: announceTextContent
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToastInteractiveProvider, { scope: __scopeToast, onClose: handleClose, children: ReactDOM__namespace.createPortal(
          /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$3.ItemSlot, { scope: __scopeToast, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Root$a,
            {
              asChild: true,
              onEscapeKeyDown: composeEventHandlers(onEscapeKeyDown, () => {
                if (!context.isFocusedToastEscapeKeyDownRef.current) handleClose();
                context.isFocusedToastEscapeKeyDownRef.current = false;
              }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Primitive.li,
                {
                  role: "status",
                  "aria-live": "off",
                  "aria-atomic": true,
                  tabIndex: 0,
                  "data-state": open ? "open" : "closed",
                  "data-swipe-direction": context.swipeDirection,
                  ...toastProps,
                  ref: composedRefs,
                  style: { userSelect: "none", touchAction: "none", ...props.style },
                  onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
                    if (event.key !== "Escape") return;
                    onEscapeKeyDown == null ? void 0 : onEscapeKeyDown(event.nativeEvent);
                    if (!event.nativeEvent.defaultPrevented) {
                      context.isFocusedToastEscapeKeyDownRef.current = true;
                      handleClose();
                    }
                  }),
                  onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
                    if (event.button !== 0) return;
                    pointerStartRef.current = { x: event.clientX, y: event.clientY };
                  }),
                  onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
                    if (!pointerStartRef.current) return;
                    const x = event.clientX - pointerStartRef.current.x;
                    const y = event.clientY - pointerStartRef.current.y;
                    const hasSwipeMoveStarted = Boolean(swipeDeltaRef.current);
                    const isHorizontalSwipe = ["left", "right"].includes(context.swipeDirection);
                    const clamp2 = ["left", "up"].includes(context.swipeDirection) ? Math.min : Math.max;
                    const clampedX = isHorizontalSwipe ? clamp2(0, x) : 0;
                    const clampedY = !isHorizontalSwipe ? clamp2(0, y) : 0;
                    const moveStartBuffer = event.pointerType === "touch" ? 10 : 2;
                    const delta = { x: clampedX, y: clampedY };
                    const eventDetail = { originalEvent: event, delta };
                    if (hasSwipeMoveStarted) {
                      swipeDeltaRef.current = delta;
                      handleAndDispatchCustomEvent(TOAST_SWIPE_MOVE, onSwipeMove, eventDetail, {
                        discrete: false
                      });
                    } else if (isDeltaInDirection(delta, context.swipeDirection, moveStartBuffer)) {
                      swipeDeltaRef.current = delta;
                      handleAndDispatchCustomEvent(TOAST_SWIPE_START, onSwipeStart, eventDetail, {
                        discrete: false
                      });
                      event.target.setPointerCapture(event.pointerId);
                    } else if (Math.abs(x) > moveStartBuffer || Math.abs(y) > moveStartBuffer) {
                      pointerStartRef.current = null;
                    }
                  }),
                  onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
                    const delta = swipeDeltaRef.current;
                    const target = event.target;
                    if (target.hasPointerCapture(event.pointerId)) {
                      target.releasePointerCapture(event.pointerId);
                    }
                    swipeDeltaRef.current = null;
                    pointerStartRef.current = null;
                    if (delta) {
                      const toast2 = event.currentTarget;
                      const eventDetail = { originalEvent: event, delta };
                      if (isDeltaInDirection(delta, context.swipeDirection, context.swipeThreshold)) {
                        handleAndDispatchCustomEvent(TOAST_SWIPE_END, onSwipeEnd, eventDetail, {
                          discrete: true
                        });
                      } else {
                        handleAndDispatchCustomEvent(
                          TOAST_SWIPE_CANCEL,
                          onSwipeCancel,
                          eventDetail,
                          {
                            discrete: true
                          }
                        );
                      }
                      toast2.addEventListener("click", (event2) => event2.preventDefault(), {
                        once: true
                      });
                    }
                  })
                }
              )
            }
          ) }),
          context.viewport
        ) })
      ] });
    }
  );
  var ToastAnnounce = (props) => {
    const { __scopeToast, children, ...announceProps } = props;
    const context = useToastProviderContext(TOAST_NAME, __scopeToast);
    const [renderAnnounceText, setRenderAnnounceText] = React__namespace.useState(false);
    const [isAnnounced, setIsAnnounced] = React__namespace.useState(false);
    useNextFrame(() => setRenderAnnounceText(true));
    React__namespace.useEffect(() => {
      const timer = window.setTimeout(() => setIsAnnounced(true), 1e3);
      return () => window.clearTimeout(timer);
    }, []);
    return isAnnounced ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(VisuallyHidden, { ...announceProps, children: renderAnnounceText && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      context.label,
      " ",
      children
    ] }) }) });
  };
  var TITLE_NAME = "ToastTitle";
  var ToastTitle$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeToast, ...titleProps } = props;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...titleProps, ref: forwardedRef });
    }
  );
  ToastTitle$1.displayName = TITLE_NAME;
  var DESCRIPTION_NAME = "ToastDescription";
  var ToastDescription$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeToast, ...descriptionProps } = props;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...descriptionProps, ref: forwardedRef });
    }
  );
  ToastDescription$1.displayName = DESCRIPTION_NAME;
  var ACTION_NAME = "ToastAction";
  var ToastAction$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { altText, ...actionProps } = props;
      if (!altText.trim()) {
        console.error(
          `Invalid prop \`altText\` supplied to \`${ACTION_NAME}\`. Expected non-empty \`string\`.`
        );
        return null;
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ToastAnnounceExclude, { altText, asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ToastClose$1, { ...actionProps, ref: forwardedRef }) });
    }
  );
  ToastAction$1.displayName = ACTION_NAME;
  var CLOSE_NAME = "ToastClose";
  var ToastClose$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeToast, ...closeProps } = props;
      const interactiveContext = useToastInteractiveContext(CLOSE_NAME, __scopeToast);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ToastAnnounceExclude, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          ...closeProps,
          ref: forwardedRef,
          onClick: composeEventHandlers(props.onClick, interactiveContext.onClose)
        }
      ) });
    }
  );
  ToastClose$1.displayName = CLOSE_NAME;
  var ToastAnnounceExclude = React__namespace.forwardRef((props, forwardedRef) => {
    const { __scopeToast, altText, ...announceExcludeProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-radix-toast-announce-exclude": "",
        "data-radix-toast-announce-alt": altText || void 0,
        ...announceExcludeProps,
        ref: forwardedRef
      }
    );
  });
  function getAnnounceTextContent(container) {
    const textContent = [];
    const childNodes = Array.from(container.childNodes);
    childNodes.forEach((node) => {
      if (node.nodeType === node.TEXT_NODE && node.textContent) textContent.push(node.textContent);
      if (isHTMLElement$1(node)) {
        const isHidden2 = node.ariaHidden || node.hidden || node.style.display === "none";
        const isExcluded = node.dataset.radixToastAnnounceExclude === "";
        if (!isHidden2) {
          if (isExcluded) {
            const altText = node.dataset.radixToastAnnounceAlt;
            if (altText) textContent.push(altText);
          } else {
            textContent.push(...getAnnounceTextContent(node));
          }
        }
      }
    });
    return textContent;
  }
  function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
    const currentTarget = detail.originalEvent.currentTarget;
    const event = new CustomEvent(name, { bubbles: true, cancelable: true, detail });
    if (handler) currentTarget.addEventListener(name, handler, { once: true });
    if (discrete) {
      dispatchDiscreteCustomEvent(currentTarget, event);
    } else {
      currentTarget.dispatchEvent(event);
    }
  }
  var isDeltaInDirection = (delta, direction, threshold = 0) => {
    const deltaX = Math.abs(delta.x);
    const deltaY = Math.abs(delta.y);
    const isDeltaX = deltaX > deltaY;
    if (direction === "left" || direction === "right") {
      return isDeltaX && deltaX > threshold;
    } else {
      return !isDeltaX && deltaY > threshold;
    }
  };
  function useNextFrame(callback = () => {
  }) {
    const fn = useCallbackRef$1(callback);
    useLayoutEffect2(() => {
      let raf1 = 0;
      let raf2 = 0;
      raf1 = window.requestAnimationFrame(() => raf2 = window.requestAnimationFrame(fn));
      return () => {
        window.cancelAnimationFrame(raf1);
        window.cancelAnimationFrame(raf2);
      };
    }, [fn]);
  }
  function isHTMLElement$1(node) {
    return node.nodeType === node.ELEMENT_NODE;
  }
  function getTabbableCandidates$1(container) {
    const nodes = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
        if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
        return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }
  function focusFirst$2(candidates) {
    const previouslyFocusedElement = document.activeElement;
    return candidates.some((candidate) => {
      if (candidate === previouslyFocusedElement) return true;
      candidate.focus();
      return document.activeElement !== previouslyFocusedElement;
    });
  }
  var Provider$1 = ToastProvider$1;
  var Viewport$2 = ToastViewport$1;
  var Root2$4 = Toast$1;
  var Title = ToastTitle$1;
  var Description = ToastDescription$1;
  var Action = ToastAction$1;
  var Close = ToastClose$1;
  function r(e) {
    var t, f2, n2 = "";
    if ("string" == typeof e || "number" == typeof e) n2 += e;
    else if ("object" == typeof e) if (Array.isArray(e)) {
      var o = e.length;
      for (t = 0; t < o; t++) e[t] && (f2 = r(e[t])) && (n2 && (n2 += " "), n2 += f2);
    } else for (f2 in e) e[f2] && (n2 && (n2 += " "), n2 += f2);
    return n2;
  }
  function clsx() {
    for (var e, t, f2 = 0, n2 = "", o = arguments.length; f2 < o; f2++) (e = arguments[f2]) && (t = r(e)) && (n2 && (n2 += " "), n2 += t);
    return n2;
  }
  const falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
  const cx = clsx;
  const cva = (base, config) => (props) => {
    var _config_compoundVariants;
    if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
    const { variants, defaultVariants } = config;
    const getVariantClassNames = Object.keys(variants).map((variant) => {
      const variantProp = props === null || props === void 0 ? void 0 : props[variant];
      const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
      if (variantProp === null) return null;
      const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
      return variants[variant][variantKey];
    });
    const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
      let [key, value] = param;
      if (value === void 0) {
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {});
    const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
      let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
      return Object.entries(compoundVariantOptions).every((param2) => {
        let [key, value] = param2;
        return Array.isArray(value) ? value.includes({
          ...defaultVariants,
          ...propsWithoutUndefined
        }[key]) : {
          ...defaultVariants,
          ...propsWithoutUndefined
        }[key] === value;
      }) ? [
        ...acc,
        cvClass,
        cvClassName
      ] : acc;
    }, []);
    return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  };
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  const mergeClasses = (...classes) => classes.filter((className, index2, array) => {
    return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index2;
  }).join(" ").trim();
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Icon$1 = React$1.forwardRef(
    ({
      color = "currentColor",
      size: size2 = 24,
      strokeWidth = 2,
      absoluteStrokeWidth,
      className = "",
      children,
      iconNode,
      ...rest
    }, ref) => {
      return React$1.createElement(
        "svg",
        {
          ref,
          ...defaultAttributes,
          width: size2,
          height: size2,
          stroke: color,
          strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size2) : strokeWidth,
          className: mergeClasses("lucide", className),
          ...rest
        },
        [
          ...iconNode.map(([tag, attrs]) => React$1.createElement(tag, attrs)),
          ...Array.isArray(children) ? children : [children]
        ]
      );
    }
  );
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const createLucideIcon = (iconName, iconNode) => {
    const Component = React$1.forwardRef(
      ({ className, ...props }, ref) => React$1.createElement(Icon$1, {
        ref,
        iconNode,
        className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
        ...props
      })
    );
    Component.displayName = `${iconName}`;
    return Component;
  };
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Award = createLucideIcon("Award", [
    [
      "path",
      {
        d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
        key: "1yiouv"
      }
    ],
    ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Bot = createLucideIcon("Bot", [
    ["path", { d: "M12 8V4H8", key: "hb8ula" }],
    ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
    ["path", { d: "M2 14h2", key: "vft8re" }],
    ["path", { d: "M20 14h2", key: "4cs60a" }],
    ["path", { d: "M15 13v2", key: "1xurst" }],
    ["path", { d: "M9 13v2", key: "rq6x2g" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Brain = createLucideIcon("Brain", [
    [
      "path",
      {
        d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
        key: "l5xja"
      }
    ],
    [
      "path",
      {
        d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",
        key: "ep3f8r"
      }
    ],
    ["path", { d: "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4", key: "1p4c4q" }],
    ["path", { d: "M17.599 6.5a3 3 0 0 0 .399-1.375", key: "tmeiqw" }],
    ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5", key: "105sqy" }],
    ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396", key: "ql3yin" }],
    ["path", { d: "M19.938 10.5a4 4 0 0 1 .585.396", key: "1qfode" }],
    ["path", { d: "M6 18a4 4 0 0 1-1.967-.516", key: "2e4loj" }],
    ["path", { d: "M19.967 17.484A4 4 0 0 1 18 18", key: "159ez6" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Calendar = createLucideIcon("Calendar", [
    ["path", { d: "M8 2v4", key: "1cmpym" }],
    ["path", { d: "M16 2v4", key: "4m81vk" }],
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
    ["path", { d: "M3 10h18", key: "8toen8" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const ChartColumn = createLucideIcon("ChartColumn", [
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
    ["path", { d: "M18 17V9", key: "2bz60n" }],
    ["path", { d: "M13 17V5", key: "1frdt8" }],
    ["path", { d: "M8 17v-3", key: "17ska0" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const ChartNoAxesColumnIncreasing = createLucideIcon("ChartNoAxesColumnIncreasing", [
    ["line", { x1: "12", x2: "12", y1: "20", y2: "10", key: "1vz5eb" }],
    ["line", { x1: "18", x2: "18", y1: "20", y2: "4", key: "cun8e5" }],
    ["line", { x1: "6", x2: "6", y1: "20", y2: "16", key: "hq0ia6" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const ChevronDown = createLucideIcon("ChevronDown", [
    ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const ChevronUp = createLucideIcon("ChevronUp", [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const CircleAlert = createLucideIcon("CircleAlert", [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
    ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const CircleCheckBig = createLucideIcon("CircleCheckBig", [
    ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
    ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const CircleX = createLucideIcon("CircleX", [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
    ["path", { d: "m9 9 6 6", key: "z0biqf" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Clock = createLucideIcon("Clock", [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Code = createLucideIcon("Code", [
    ["polyline", { points: "16 18 22 12 16 6", key: "z7tu5w" }],
    ["polyline", { points: "8 6 2 12 8 18", key: "1eg1df" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Copy = createLucideIcon("Copy", [
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Download = createLucideIcon("Download", [
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
    ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
    ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const EyeOff = createLucideIcon("EyeOff", [
    [
      "path",
      {
        d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
        key: "ct8e1f"
      }
    ],
    ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
    [
      "path",
      {
        d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
        key: "13bj9a"
      }
    ],
    ["path", { d: "m2 2 20 20", key: "1ooewy" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Eye = createLucideIcon("Eye", [
    [
      "path",
      {
        d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
        key: "1nclc0"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const FileText = createLucideIcon("FileText", [
    ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
    ["path", { d: "M10 9H8", key: "b1mrlr" }],
    ["path", { d: "M16 13H8", key: "t4e002" }],
    ["path", { d: "M16 17H8", key: "z1uh3a" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Globe = createLucideIcon("Globe", [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
    ["path", { d: "M2 12h20", key: "9i4pu4" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Image$1 = createLucideIcon("Image", [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
    ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
    ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const KeyRound = createLucideIcon("KeyRound", [
    [
      "path",
      {
        d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
        key: "1s6t7t"
      }
    ],
    ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Lightbulb = createLucideIcon("Lightbulb", [
    [
      "path",
      {
        d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
        key: "1gvzjb"
      }
    ],
    ["path", { d: "M9 18h6", key: "x1upvd" }],
    ["path", { d: "M10 22h4", key: "ceow96" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const MessageCircle = createLucideIcon("MessageCircle", [
    ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Pause = createLucideIcon("Pause", [
    ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
    ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Play = createLucideIcon("Play", [
    ["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const RefreshCw = createLucideIcon("RefreshCw", [
    ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
    ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
    ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
    ["path", { d: "M8 16H3v5", key: "1cv678" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Search = createLucideIcon("Search", [
    ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
    ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const SendHorizontal = createLucideIcon("SendHorizontal", [
    [
      "path",
      {
        d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z",
        key: "117uat"
      }
    ],
    ["path", { d: "M6 12h16", key: "s4cdu5" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Settings = createLucideIcon("Settings", [
    [
      "path",
      {
        d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
        key: "1qme2f"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Sparkles = createLucideIcon("Sparkles", [
    [
      "path",
      {
        d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
        key: "4pj2yx"
      }
    ],
    ["path", { d: "M20 3v4", key: "1olli1" }],
    ["path", { d: "M22 5h-4", key: "1gvqau" }],
    ["path", { d: "M4 17v2", key: "vumght" }],
    ["path", { d: "M5 18H3", key: "zchphs" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Target = createLucideIcon("Target", [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
    ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Trash2 = createLucideIcon("Trash2", [
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
    ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
    ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
    ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const TrendingUp = createLucideIcon("TrendingUp", [
    ["polyline", { points: "22 7 13.5 15.5 8.5 10.5 2 17", key: "126l90" }],
    ["polyline", { points: "16 7 22 7 22 13", key: "kwv8wd" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const TriangleAlert = createLucideIcon("TriangleAlert", [
    [
      "path",
      {
        d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
        key: "wmoenq"
      }
    ],
    ["path", { d: "M12 9v4", key: "juzpu7" }],
    ["path", { d: "M12 17h.01", key: "p32p05" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const User = createLucideIcon("User", [
    ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
    ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const WandSparkles = createLucideIcon("WandSparkles", [
    [
      "path",
      {
        d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
        key: "ul74o6"
      }
    ],
    ["path", { d: "m14 7 3 3", key: "1r5n42" }],
    ["path", { d: "M5 6v4", key: "ilb8ba" }],
    ["path", { d: "M19 14v4", key: "blhpug" }],
    ["path", { d: "M10 2v2", key: "7u0qdc" }],
    ["path", { d: "M7 8H3", key: "zfb6yr" }],
    ["path", { d: "M21 16h-4", key: "1cnmox" }],
    ["path", { d: "M11 3H9", key: "1obp7u" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const X = createLucideIcon("X", [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
  ]);
  /**
   * @license lucide-react v0.462.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Zap = createLucideIcon("Zap", [
    [
      "path",
      {
        d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
        key: "1xq2db"
      }
    ]
  ]);
  const CLASS_PART_SEPARATOR = "-";
  const createClassGroupUtils = (config) => {
    const classMap = createClassMap(config);
    const {
      conflictingClassGroups,
      conflictingClassGroupModifiers
    } = config;
    const getClassGroupId = (className) => {
      const classParts = className.split(CLASS_PART_SEPARATOR);
      if (classParts[0] === "" && classParts.length !== 1) {
        classParts.shift();
      }
      return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
    };
    const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
      const conflicts = conflictingClassGroups[classGroupId] || [];
      if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
        return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
      }
      return conflicts;
    };
    return {
      getClassGroupId,
      getConflictingClassGroupIds
    };
  };
  const getGroupRecursive = (classParts, classPartObject) => {
    var _a2;
    if (classParts.length === 0) {
      return classPartObject.classGroupId;
    }
    const currentClassPart = classParts[0];
    const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
    const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : void 0;
    if (classGroupFromNextClassPart) {
      return classGroupFromNextClassPart;
    }
    if (classPartObject.validators.length === 0) {
      return void 0;
    }
    const classRest = classParts.join(CLASS_PART_SEPARATOR);
    return (_a2 = classPartObject.validators.find(({
      validator
    }) => validator(classRest))) == null ? void 0 : _a2.classGroupId;
  };
  const arbitraryPropertyRegex = /^\[(.+)\]$/;
  const getGroupIdForArbitraryProperty = (className) => {
    if (arbitraryPropertyRegex.test(className)) {
      const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
      const property = arbitraryPropertyClassName == null ? void 0 : arbitraryPropertyClassName.substring(0, arbitraryPropertyClassName.indexOf(":"));
      if (property) {
        return "arbitrary.." + property;
      }
    }
  };
  const createClassMap = (config) => {
    const {
      theme,
      prefix
    } = config;
    const classMap = {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    };
    const prefixedClassGroupEntries = getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix);
    prefixedClassGroupEntries.forEach(([classGroupId, classGroup]) => {
      processClassesRecursively(classGroup, classMap, classGroupId, theme);
    });
    return classMap;
  };
  const processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
    classGroup.forEach((classDefinition) => {
      if (typeof classDefinition === "string") {
        const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
        classPartObjectToEdit.classGroupId = classGroupId;
        return;
      }
      if (typeof classDefinition === "function") {
        if (isThemeGetter(classDefinition)) {
          processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
          return;
        }
        classPartObject.validators.push({
          validator: classDefinition,
          classGroupId
        });
        return;
      }
      Object.entries(classDefinition).forEach(([key, classGroup2]) => {
        processClassesRecursively(classGroup2, getPart(classPartObject, key), classGroupId, theme);
      });
    });
  };
  const getPart = (classPartObject, path) => {
    let currentClassPartObject = classPartObject;
    path.split(CLASS_PART_SEPARATOR).forEach((pathPart) => {
      if (!currentClassPartObject.nextPart.has(pathPart)) {
        currentClassPartObject.nextPart.set(pathPart, {
          nextPart: /* @__PURE__ */ new Map(),
          validators: []
        });
      }
      currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
    });
    return currentClassPartObject;
  };
  const isThemeGetter = (func) => func.isThemeGetter;
  const getPrefixedClassGroupEntries = (classGroupEntries, prefix) => {
    if (!prefix) {
      return classGroupEntries;
    }
    return classGroupEntries.map(([classGroupId, classGroup]) => {
      const prefixedClassGroup = classGroup.map((classDefinition) => {
        if (typeof classDefinition === "string") {
          return prefix + classDefinition;
        }
        if (typeof classDefinition === "object") {
          return Object.fromEntries(Object.entries(classDefinition).map(([key, value]) => [prefix + key, value]));
        }
        return classDefinition;
      });
      return [classGroupId, prefixedClassGroup];
    });
  };
  const createLruCache = (maxCacheSize) => {
    if (maxCacheSize < 1) {
      return {
        get: () => void 0,
        set: () => {
        }
      };
    }
    let cacheSize = 0;
    let cache = /* @__PURE__ */ new Map();
    let previousCache = /* @__PURE__ */ new Map();
    const update = (key, value) => {
      cache.set(key, value);
      cacheSize++;
      if (cacheSize > maxCacheSize) {
        cacheSize = 0;
        previousCache = cache;
        cache = /* @__PURE__ */ new Map();
      }
    };
    return {
      get(key) {
        let value = cache.get(key);
        if (value !== void 0) {
          return value;
        }
        if ((value = previousCache.get(key)) !== void 0) {
          update(key, value);
          return value;
        }
      },
      set(key, value) {
        if (cache.has(key)) {
          cache.set(key, value);
        } else {
          update(key, value);
        }
      }
    };
  };
  const IMPORTANT_MODIFIER = "!";
  const createParseClassName = (config) => {
    const {
      separator,
      experimentalParseClassName
    } = config;
    const isSeparatorSingleCharacter = separator.length === 1;
    const firstSeparatorCharacter = separator[0];
    const separatorLength = separator.length;
    const parseClassName = (className) => {
      const modifiers = [];
      let bracketDepth = 0;
      let modifierStart = 0;
      let postfixModifierPosition;
      for (let index2 = 0; index2 < className.length; index2++) {
        let currentCharacter = className[index2];
        if (bracketDepth === 0) {
          if (currentCharacter === firstSeparatorCharacter && (isSeparatorSingleCharacter || className.slice(index2, index2 + separatorLength) === separator)) {
            modifiers.push(className.slice(modifierStart, index2));
            modifierStart = index2 + separatorLength;
            continue;
          }
          if (currentCharacter === "/") {
            postfixModifierPosition = index2;
            continue;
          }
        }
        if (currentCharacter === "[") {
          bracketDepth++;
        } else if (currentCharacter === "]") {
          bracketDepth--;
        }
      }
      const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
      const hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
      const baseClassName = hasImportantModifier ? baseClassNameWithImportantModifier.substring(1) : baseClassNameWithImportantModifier;
      const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
      return {
        modifiers,
        hasImportantModifier,
        baseClassName,
        maybePostfixModifierPosition
      };
    };
    if (experimentalParseClassName) {
      return (className) => experimentalParseClassName({
        className,
        parseClassName
      });
    }
    return parseClassName;
  };
  const sortModifiers = (modifiers) => {
    if (modifiers.length <= 1) {
      return modifiers;
    }
    const sortedModifiers = [];
    let unsortedModifiers = [];
    modifiers.forEach((modifier) => {
      const isArbitraryVariant = modifier[0] === "[";
      if (isArbitraryVariant) {
        sortedModifiers.push(...unsortedModifiers.sort(), modifier);
        unsortedModifiers = [];
      } else {
        unsortedModifiers.push(modifier);
      }
    });
    sortedModifiers.push(...unsortedModifiers.sort());
    return sortedModifiers;
  };
  const createConfigUtils = (config) => ({
    cache: createLruCache(config.cacheSize),
    parseClassName: createParseClassName(config),
    ...createClassGroupUtils(config)
  });
  const SPLIT_CLASSES_REGEX = /\s+/;
  const mergeClassList = (classList, configUtils) => {
    const {
      parseClassName,
      getClassGroupId,
      getConflictingClassGroupIds
    } = configUtils;
    const classGroupsInConflict = [];
    const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
    let result = "";
    for (let index2 = classNames.length - 1; index2 >= 0; index2 -= 1) {
      const originalClassName = classNames[index2];
      const {
        modifiers,
        hasImportantModifier,
        baseClassName,
        maybePostfixModifierPosition
      } = parseClassName(originalClassName);
      let hasPostfixModifier = Boolean(maybePostfixModifierPosition);
      let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
      if (!classGroupId) {
        if (!hasPostfixModifier) {
          result = originalClassName + (result.length > 0 ? " " + result : result);
          continue;
        }
        classGroupId = getClassGroupId(baseClassName);
        if (!classGroupId) {
          result = originalClassName + (result.length > 0 ? " " + result : result);
          continue;
        }
        hasPostfixModifier = false;
      }
      const variantModifier = sortModifiers(modifiers).join(":");
      const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
      const classId = modifierId + classGroupId;
      if (classGroupsInConflict.includes(classId)) {
        continue;
      }
      classGroupsInConflict.push(classId);
      const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
      for (let i = 0; i < conflictGroups.length; ++i) {
        const group = conflictGroups[i];
        classGroupsInConflict.push(modifierId + group);
      }
      result = originalClassName + (result.length > 0 ? " " + result : result);
    }
    return result;
  };
  function twJoin() {
    let index2 = 0;
    let argument;
    let resolvedValue;
    let string = "";
    while (index2 < arguments.length) {
      if (argument = arguments[index2++]) {
        if (resolvedValue = toValue(argument)) {
          string && (string += " ");
          string += resolvedValue;
        }
      }
    }
    return string;
  }
  const toValue = (mix) => {
    if (typeof mix === "string") {
      return mix;
    }
    let resolvedValue;
    let string = "";
    for (let k2 = 0; k2 < mix.length; k2++) {
      if (mix[k2]) {
        if (resolvedValue = toValue(mix[k2])) {
          string && (string += " ");
          string += resolvedValue;
        }
      }
    }
    return string;
  };
  function createTailwindMerge(createConfigFirst, ...createConfigRest) {
    let configUtils;
    let cacheGet;
    let cacheSet;
    let functionToCall = initTailwindMerge;
    function initTailwindMerge(classList) {
      const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
      configUtils = createConfigUtils(config);
      cacheGet = configUtils.cache.get;
      cacheSet = configUtils.cache.set;
      functionToCall = tailwindMerge;
      return tailwindMerge(classList);
    }
    function tailwindMerge(classList) {
      const cachedResult = cacheGet(classList);
      if (cachedResult) {
        return cachedResult;
      }
      const result = mergeClassList(classList, configUtils);
      cacheSet(classList, result);
      return result;
    }
    return function callTailwindMerge() {
      return functionToCall(twJoin.apply(null, arguments));
    };
  }
  const fromTheme = (key) => {
    const themeGetter = (theme) => theme[key] || [];
    themeGetter.isThemeGetter = true;
    return themeGetter;
  };
  const arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i;
  const fractionRegex = /^\d+\/\d+$/;
  const stringLengths = /* @__PURE__ */ new Set(["px", "full", "screen"]);
  const tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
  const lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
  const colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/;
  const shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
  const imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
  const isLength = (value) => isNumber$1(value) || stringLengths.has(value) || fractionRegex.test(value);
  const isArbitraryLength = (value) => getIsArbitraryValue(value, "length", isLengthOnly);
  const isNumber$1 = (value) => Boolean(value) && !Number.isNaN(Number(value));
  const isArbitraryNumber = (value) => getIsArbitraryValue(value, "number", isNumber$1);
  const isInteger = (value) => Boolean(value) && Number.isInteger(Number(value));
  const isPercent = (value) => value.endsWith("%") && isNumber$1(value.slice(0, -1));
  const isArbitraryValue = (value) => arbitraryValueRegex.test(value);
  const isTshirtSize = (value) => tshirtUnitRegex.test(value);
  const sizeLabels = /* @__PURE__ */ new Set(["length", "size", "percentage"]);
  const isArbitrarySize = (value) => getIsArbitraryValue(value, sizeLabels, isNever);
  const isArbitraryPosition = (value) => getIsArbitraryValue(value, "position", isNever);
  const imageLabels = /* @__PURE__ */ new Set(["image", "url"]);
  const isArbitraryImage = (value) => getIsArbitraryValue(value, imageLabels, isImage);
  const isArbitraryShadow = (value) => getIsArbitraryValue(value, "", isShadow);
  const isAny = () => true;
  const getIsArbitraryValue = (value, label, testValue) => {
    const result = arbitraryValueRegex.exec(value);
    if (result) {
      if (result[1]) {
        return typeof label === "string" ? result[1] === label : label.has(result[1]);
      }
      return testValue(result[2]);
    }
    return false;
  };
  const isLengthOnly = (value) => (
    // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
    // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
    // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
    lengthUnitRegex.test(value) && !colorFunctionRegex.test(value)
  );
  const isNever = () => false;
  const isShadow = (value) => shadowRegex.test(value);
  const isImage = (value) => imageRegex.test(value);
  const getDefaultConfig = () => {
    const colors = fromTheme("colors");
    const spacing = fromTheme("spacing");
    const blur = fromTheme("blur");
    const brightness = fromTheme("brightness");
    const borderColor = fromTheme("borderColor");
    const borderRadius = fromTheme("borderRadius");
    const borderSpacing = fromTheme("borderSpacing");
    const borderWidth = fromTheme("borderWidth");
    const contrast = fromTheme("contrast");
    const grayscale = fromTheme("grayscale");
    const hueRotate = fromTheme("hueRotate");
    const invert = fromTheme("invert");
    const gap = fromTheme("gap");
    const gradientColorStops = fromTheme("gradientColorStops");
    const gradientColorStopPositions = fromTheme("gradientColorStopPositions");
    const inset = fromTheme("inset");
    const margin = fromTheme("margin");
    const opacity = fromTheme("opacity");
    const padding = fromTheme("padding");
    const saturate = fromTheme("saturate");
    const scale = fromTheme("scale");
    const sepia = fromTheme("sepia");
    const skew = fromTheme("skew");
    const space = fromTheme("space");
    const translate = fromTheme("translate");
    const getOverscroll = () => ["auto", "contain", "none"];
    const getOverflow = () => ["auto", "hidden", "clip", "visible", "scroll"];
    const getSpacingWithAutoAndArbitrary = () => ["auto", isArbitraryValue, spacing];
    const getSpacingWithArbitrary = () => [isArbitraryValue, spacing];
    const getLengthWithEmptyAndArbitrary = () => ["", isLength, isArbitraryLength];
    const getNumberWithAutoAndArbitrary = () => ["auto", isNumber$1, isArbitraryValue];
    const getPositions = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"];
    const getLineStyles = () => ["solid", "dashed", "dotted", "double", "none"];
    const getBlendModes = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
    const getAlign = () => ["start", "end", "center", "between", "around", "evenly", "stretch"];
    const getZeroAndEmpty = () => ["", "0", isArbitraryValue];
    const getBreaks = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"];
    const getNumberAndArbitrary = () => [isNumber$1, isArbitraryValue];
    return {
      cacheSize: 500,
      separator: ":",
      theme: {
        colors: [isAny],
        spacing: [isLength, isArbitraryLength],
        blur: ["none", "", isTshirtSize, isArbitraryValue],
        brightness: getNumberAndArbitrary(),
        borderColor: [colors],
        borderRadius: ["none", "", "full", isTshirtSize, isArbitraryValue],
        borderSpacing: getSpacingWithArbitrary(),
        borderWidth: getLengthWithEmptyAndArbitrary(),
        contrast: getNumberAndArbitrary(),
        grayscale: getZeroAndEmpty(),
        hueRotate: getNumberAndArbitrary(),
        invert: getZeroAndEmpty(),
        gap: getSpacingWithArbitrary(),
        gradientColorStops: [colors],
        gradientColorStopPositions: [isPercent, isArbitraryLength],
        inset: getSpacingWithAutoAndArbitrary(),
        margin: getSpacingWithAutoAndArbitrary(),
        opacity: getNumberAndArbitrary(),
        padding: getSpacingWithArbitrary(),
        saturate: getNumberAndArbitrary(),
        scale: getNumberAndArbitrary(),
        sepia: getZeroAndEmpty(),
        skew: getNumberAndArbitrary(),
        space: getSpacingWithArbitrary(),
        translate: getSpacingWithArbitrary()
      },
      classGroups: {
        // Layout
        /**
         * Aspect Ratio
         * @see https://tailwindcss.com/docs/aspect-ratio
         */
        aspect: [{
          aspect: ["auto", "square", "video", isArbitraryValue]
        }],
        /**
         * Container
         * @see https://tailwindcss.com/docs/container
         */
        container: ["container"],
        /**
         * Columns
         * @see https://tailwindcss.com/docs/columns
         */
        columns: [{
          columns: [isTshirtSize]
        }],
        /**
         * Break After
         * @see https://tailwindcss.com/docs/break-after
         */
        "break-after": [{
          "break-after": getBreaks()
        }],
        /**
         * Break Before
         * @see https://tailwindcss.com/docs/break-before
         */
        "break-before": [{
          "break-before": getBreaks()
        }],
        /**
         * Break Inside
         * @see https://tailwindcss.com/docs/break-inside
         */
        "break-inside": [{
          "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
        }],
        /**
         * Box Decoration Break
         * @see https://tailwindcss.com/docs/box-decoration-break
         */
        "box-decoration": [{
          "box-decoration": ["slice", "clone"]
        }],
        /**
         * Box Sizing
         * @see https://tailwindcss.com/docs/box-sizing
         */
        box: [{
          box: ["border", "content"]
        }],
        /**
         * Display
         * @see https://tailwindcss.com/docs/display
         */
        display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
        /**
         * Floats
         * @see https://tailwindcss.com/docs/float
         */
        float: [{
          float: ["right", "left", "none", "start", "end"]
        }],
        /**
         * Clear
         * @see https://tailwindcss.com/docs/clear
         */
        clear: [{
          clear: ["left", "right", "both", "none", "start", "end"]
        }],
        /**
         * Isolation
         * @see https://tailwindcss.com/docs/isolation
         */
        isolation: ["isolate", "isolation-auto"],
        /**
         * Object Fit
         * @see https://tailwindcss.com/docs/object-fit
         */
        "object-fit": [{
          object: ["contain", "cover", "fill", "none", "scale-down"]
        }],
        /**
         * Object Position
         * @see https://tailwindcss.com/docs/object-position
         */
        "object-position": [{
          object: [...getPositions(), isArbitraryValue]
        }],
        /**
         * Overflow
         * @see https://tailwindcss.com/docs/overflow
         */
        overflow: [{
          overflow: getOverflow()
        }],
        /**
         * Overflow X
         * @see https://tailwindcss.com/docs/overflow
         */
        "overflow-x": [{
          "overflow-x": getOverflow()
        }],
        /**
         * Overflow Y
         * @see https://tailwindcss.com/docs/overflow
         */
        "overflow-y": [{
          "overflow-y": getOverflow()
        }],
        /**
         * Overscroll Behavior
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        overscroll: [{
          overscroll: getOverscroll()
        }],
        /**
         * Overscroll Behavior X
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        "overscroll-x": [{
          "overscroll-x": getOverscroll()
        }],
        /**
         * Overscroll Behavior Y
         * @see https://tailwindcss.com/docs/overscroll-behavior
         */
        "overscroll-y": [{
          "overscroll-y": getOverscroll()
        }],
        /**
         * Position
         * @see https://tailwindcss.com/docs/position
         */
        position: ["static", "fixed", "absolute", "relative", "sticky"],
        /**
         * Top / Right / Bottom / Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        inset: [{
          inset: [inset]
        }],
        /**
         * Right / Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        "inset-x": [{
          "inset-x": [inset]
        }],
        /**
         * Top / Bottom
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        "inset-y": [{
          "inset-y": [inset]
        }],
        /**
         * Start
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        start: [{
          start: [inset]
        }],
        /**
         * End
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        end: [{
          end: [inset]
        }],
        /**
         * Top
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        top: [{
          top: [inset]
        }],
        /**
         * Right
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        right: [{
          right: [inset]
        }],
        /**
         * Bottom
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        bottom: [{
          bottom: [inset]
        }],
        /**
         * Left
         * @see https://tailwindcss.com/docs/top-right-bottom-left
         */
        left: [{
          left: [inset]
        }],
        /**
         * Visibility
         * @see https://tailwindcss.com/docs/visibility
         */
        visibility: ["visible", "invisible", "collapse"],
        /**
         * Z-Index
         * @see https://tailwindcss.com/docs/z-index
         */
        z: [{
          z: ["auto", isInteger, isArbitraryValue]
        }],
        // Flexbox and Grid
        /**
         * Flex Basis
         * @see https://tailwindcss.com/docs/flex-basis
         */
        basis: [{
          basis: getSpacingWithAutoAndArbitrary()
        }],
        /**
         * Flex Direction
         * @see https://tailwindcss.com/docs/flex-direction
         */
        "flex-direction": [{
          flex: ["row", "row-reverse", "col", "col-reverse"]
        }],
        /**
         * Flex Wrap
         * @see https://tailwindcss.com/docs/flex-wrap
         */
        "flex-wrap": [{
          flex: ["wrap", "wrap-reverse", "nowrap"]
        }],
        /**
         * Flex
         * @see https://tailwindcss.com/docs/flex
         */
        flex: [{
          flex: ["1", "auto", "initial", "none", isArbitraryValue]
        }],
        /**
         * Flex Grow
         * @see https://tailwindcss.com/docs/flex-grow
         */
        grow: [{
          grow: getZeroAndEmpty()
        }],
        /**
         * Flex Shrink
         * @see https://tailwindcss.com/docs/flex-shrink
         */
        shrink: [{
          shrink: getZeroAndEmpty()
        }],
        /**
         * Order
         * @see https://tailwindcss.com/docs/order
         */
        order: [{
          order: ["first", "last", "none", isInteger, isArbitraryValue]
        }],
        /**
         * Grid Template Columns
         * @see https://tailwindcss.com/docs/grid-template-columns
         */
        "grid-cols": [{
          "grid-cols": [isAny]
        }],
        /**
         * Grid Column Start / End
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-start-end": [{
          col: ["auto", {
            span: ["full", isInteger, isArbitraryValue]
          }, isArbitraryValue]
        }],
        /**
         * Grid Column Start
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-start": [{
          "col-start": getNumberWithAutoAndArbitrary()
        }],
        /**
         * Grid Column End
         * @see https://tailwindcss.com/docs/grid-column
         */
        "col-end": [{
          "col-end": getNumberWithAutoAndArbitrary()
        }],
        /**
         * Grid Template Rows
         * @see https://tailwindcss.com/docs/grid-template-rows
         */
        "grid-rows": [{
          "grid-rows": [isAny]
        }],
        /**
         * Grid Row Start / End
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-start-end": [{
          row: ["auto", {
            span: [isInteger, isArbitraryValue]
          }, isArbitraryValue]
        }],
        /**
         * Grid Row Start
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-start": [{
          "row-start": getNumberWithAutoAndArbitrary()
        }],
        /**
         * Grid Row End
         * @see https://tailwindcss.com/docs/grid-row
         */
        "row-end": [{
          "row-end": getNumberWithAutoAndArbitrary()
        }],
        /**
         * Grid Auto Flow
         * @see https://tailwindcss.com/docs/grid-auto-flow
         */
        "grid-flow": [{
          "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
        }],
        /**
         * Grid Auto Columns
         * @see https://tailwindcss.com/docs/grid-auto-columns
         */
        "auto-cols": [{
          "auto-cols": ["auto", "min", "max", "fr", isArbitraryValue]
        }],
        /**
         * Grid Auto Rows
         * @see https://tailwindcss.com/docs/grid-auto-rows
         */
        "auto-rows": [{
          "auto-rows": ["auto", "min", "max", "fr", isArbitraryValue]
        }],
        /**
         * Gap
         * @see https://tailwindcss.com/docs/gap
         */
        gap: [{
          gap: [gap]
        }],
        /**
         * Gap X
         * @see https://tailwindcss.com/docs/gap
         */
        "gap-x": [{
          "gap-x": [gap]
        }],
        /**
         * Gap Y
         * @see https://tailwindcss.com/docs/gap
         */
        "gap-y": [{
          "gap-y": [gap]
        }],
        /**
         * Justify Content
         * @see https://tailwindcss.com/docs/justify-content
         */
        "justify-content": [{
          justify: ["normal", ...getAlign()]
        }],
        /**
         * Justify Items
         * @see https://tailwindcss.com/docs/justify-items
         */
        "justify-items": [{
          "justify-items": ["start", "end", "center", "stretch"]
        }],
        /**
         * Justify Self
         * @see https://tailwindcss.com/docs/justify-self
         */
        "justify-self": [{
          "justify-self": ["auto", "start", "end", "center", "stretch"]
        }],
        /**
         * Align Content
         * @see https://tailwindcss.com/docs/align-content
         */
        "align-content": [{
          content: ["normal", ...getAlign(), "baseline"]
        }],
        /**
         * Align Items
         * @see https://tailwindcss.com/docs/align-items
         */
        "align-items": [{
          items: ["start", "end", "center", "baseline", "stretch"]
        }],
        /**
         * Align Self
         * @see https://tailwindcss.com/docs/align-self
         */
        "align-self": [{
          self: ["auto", "start", "end", "center", "stretch", "baseline"]
        }],
        /**
         * Place Content
         * @see https://tailwindcss.com/docs/place-content
         */
        "place-content": [{
          "place-content": [...getAlign(), "baseline"]
        }],
        /**
         * Place Items
         * @see https://tailwindcss.com/docs/place-items
         */
        "place-items": [{
          "place-items": ["start", "end", "center", "baseline", "stretch"]
        }],
        /**
         * Place Self
         * @see https://tailwindcss.com/docs/place-self
         */
        "place-self": [{
          "place-self": ["auto", "start", "end", "center", "stretch"]
        }],
        // Spacing
        /**
         * Padding
         * @see https://tailwindcss.com/docs/padding
         */
        p: [{
          p: [padding]
        }],
        /**
         * Padding X
         * @see https://tailwindcss.com/docs/padding
         */
        px: [{
          px: [padding]
        }],
        /**
         * Padding Y
         * @see https://tailwindcss.com/docs/padding
         */
        py: [{
          py: [padding]
        }],
        /**
         * Padding Start
         * @see https://tailwindcss.com/docs/padding
         */
        ps: [{
          ps: [padding]
        }],
        /**
         * Padding End
         * @see https://tailwindcss.com/docs/padding
         */
        pe: [{
          pe: [padding]
        }],
        /**
         * Padding Top
         * @see https://tailwindcss.com/docs/padding
         */
        pt: [{
          pt: [padding]
        }],
        /**
         * Padding Right
         * @see https://tailwindcss.com/docs/padding
         */
        pr: [{
          pr: [padding]
        }],
        /**
         * Padding Bottom
         * @see https://tailwindcss.com/docs/padding
         */
        pb: [{
          pb: [padding]
        }],
        /**
         * Padding Left
         * @see https://tailwindcss.com/docs/padding
         */
        pl: [{
          pl: [padding]
        }],
        /**
         * Margin
         * @see https://tailwindcss.com/docs/margin
         */
        m: [{
          m: [margin]
        }],
        /**
         * Margin X
         * @see https://tailwindcss.com/docs/margin
         */
        mx: [{
          mx: [margin]
        }],
        /**
         * Margin Y
         * @see https://tailwindcss.com/docs/margin
         */
        my: [{
          my: [margin]
        }],
        /**
         * Margin Start
         * @see https://tailwindcss.com/docs/margin
         */
        ms: [{
          ms: [margin]
        }],
        /**
         * Margin End
         * @see https://tailwindcss.com/docs/margin
         */
        me: [{
          me: [margin]
        }],
        /**
         * Margin Top
         * @see https://tailwindcss.com/docs/margin
         */
        mt: [{
          mt: [margin]
        }],
        /**
         * Margin Right
         * @see https://tailwindcss.com/docs/margin
         */
        mr: [{
          mr: [margin]
        }],
        /**
         * Margin Bottom
         * @see https://tailwindcss.com/docs/margin
         */
        mb: [{
          mb: [margin]
        }],
        /**
         * Margin Left
         * @see https://tailwindcss.com/docs/margin
         */
        ml: [{
          ml: [margin]
        }],
        /**
         * Space Between X
         * @see https://tailwindcss.com/docs/space
         */
        "space-x": [{
          "space-x": [space]
        }],
        /**
         * Space Between X Reverse
         * @see https://tailwindcss.com/docs/space
         */
        "space-x-reverse": ["space-x-reverse"],
        /**
         * Space Between Y
         * @see https://tailwindcss.com/docs/space
         */
        "space-y": [{
          "space-y": [space]
        }],
        /**
         * Space Between Y Reverse
         * @see https://tailwindcss.com/docs/space
         */
        "space-y-reverse": ["space-y-reverse"],
        // Sizing
        /**
         * Width
         * @see https://tailwindcss.com/docs/width
         */
        w: [{
          w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", isArbitraryValue, spacing]
        }],
        /**
         * Min-Width
         * @see https://tailwindcss.com/docs/min-width
         */
        "min-w": [{
          "min-w": [isArbitraryValue, spacing, "min", "max", "fit"]
        }],
        /**
         * Max-Width
         * @see https://tailwindcss.com/docs/max-width
         */
        "max-w": [{
          "max-w": [isArbitraryValue, spacing, "none", "full", "min", "max", "fit", "prose", {
            screen: [isTshirtSize]
          }, isTshirtSize]
        }],
        /**
         * Height
         * @see https://tailwindcss.com/docs/height
         */
        h: [{
          h: [isArbitraryValue, spacing, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
        }],
        /**
         * Min-Height
         * @see https://tailwindcss.com/docs/min-height
         */
        "min-h": [{
          "min-h": [isArbitraryValue, spacing, "min", "max", "fit", "svh", "lvh", "dvh"]
        }],
        /**
         * Max-Height
         * @see https://tailwindcss.com/docs/max-height
         */
        "max-h": [{
          "max-h": [isArbitraryValue, spacing, "min", "max", "fit", "svh", "lvh", "dvh"]
        }],
        /**
         * Size
         * @see https://tailwindcss.com/docs/size
         */
        size: [{
          size: [isArbitraryValue, spacing, "auto", "min", "max", "fit"]
        }],
        // Typography
        /**
         * Font Size
         * @see https://tailwindcss.com/docs/font-size
         */
        "font-size": [{
          text: ["base", isTshirtSize, isArbitraryLength]
        }],
        /**
         * Font Smoothing
         * @see https://tailwindcss.com/docs/font-smoothing
         */
        "font-smoothing": ["antialiased", "subpixel-antialiased"],
        /**
         * Font Style
         * @see https://tailwindcss.com/docs/font-style
         */
        "font-style": ["italic", "not-italic"],
        /**
         * Font Weight
         * @see https://tailwindcss.com/docs/font-weight
         */
        "font-weight": [{
          font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", isArbitraryNumber]
        }],
        /**
         * Font Family
         * @see https://tailwindcss.com/docs/font-family
         */
        "font-family": [{
          font: [isAny]
        }],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-normal": ["normal-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-ordinal": ["ordinal"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-slashed-zero": ["slashed-zero"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-figure": ["lining-nums", "oldstyle-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-spacing": ["proportional-nums", "tabular-nums"],
        /**
         * Font Variant Numeric
         * @see https://tailwindcss.com/docs/font-variant-numeric
         */
        "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
        /**
         * Letter Spacing
         * @see https://tailwindcss.com/docs/letter-spacing
         */
        tracking: [{
          tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", isArbitraryValue]
        }],
        /**
         * Line Clamp
         * @see https://tailwindcss.com/docs/line-clamp
         */
        "line-clamp": [{
          "line-clamp": ["none", isNumber$1, isArbitraryNumber]
        }],
        /**
         * Line Height
         * @see https://tailwindcss.com/docs/line-height
         */
        leading: [{
          leading: ["none", "tight", "snug", "normal", "relaxed", "loose", isLength, isArbitraryValue]
        }],
        /**
         * List Style Image
         * @see https://tailwindcss.com/docs/list-style-image
         */
        "list-image": [{
          "list-image": ["none", isArbitraryValue]
        }],
        /**
         * List Style Type
         * @see https://tailwindcss.com/docs/list-style-type
         */
        "list-style-type": [{
          list: ["none", "disc", "decimal", isArbitraryValue]
        }],
        /**
         * List Style Position
         * @see https://tailwindcss.com/docs/list-style-position
         */
        "list-style-position": [{
          list: ["inside", "outside"]
        }],
        /**
         * Placeholder Color
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://tailwindcss.com/docs/placeholder-color
         */
        "placeholder-color": [{
          placeholder: [colors]
        }],
        /**
         * Placeholder Opacity
         * @see https://tailwindcss.com/docs/placeholder-opacity
         */
        "placeholder-opacity": [{
          "placeholder-opacity": [opacity]
        }],
        /**
         * Text Alignment
         * @see https://tailwindcss.com/docs/text-align
         */
        "text-alignment": [{
          text: ["left", "center", "right", "justify", "start", "end"]
        }],
        /**
         * Text Color
         * @see https://tailwindcss.com/docs/text-color
         */
        "text-color": [{
          text: [colors]
        }],
        /**
         * Text Opacity
         * @see https://tailwindcss.com/docs/text-opacity
         */
        "text-opacity": [{
          "text-opacity": [opacity]
        }],
        /**
         * Text Decoration
         * @see https://tailwindcss.com/docs/text-decoration
         */
        "text-decoration": ["underline", "overline", "line-through", "no-underline"],
        /**
         * Text Decoration Style
         * @see https://tailwindcss.com/docs/text-decoration-style
         */
        "text-decoration-style": [{
          decoration: [...getLineStyles(), "wavy"]
        }],
        /**
         * Text Decoration Thickness
         * @see https://tailwindcss.com/docs/text-decoration-thickness
         */
        "text-decoration-thickness": [{
          decoration: ["auto", "from-font", isLength, isArbitraryLength]
        }],
        /**
         * Text Underline Offset
         * @see https://tailwindcss.com/docs/text-underline-offset
         */
        "underline-offset": [{
          "underline-offset": ["auto", isLength, isArbitraryValue]
        }],
        /**
         * Text Decoration Color
         * @see https://tailwindcss.com/docs/text-decoration-color
         */
        "text-decoration-color": [{
          decoration: [colors]
        }],
        /**
         * Text Transform
         * @see https://tailwindcss.com/docs/text-transform
         */
        "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
        /**
         * Text Overflow
         * @see https://tailwindcss.com/docs/text-overflow
         */
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        /**
         * Text Wrap
         * @see https://tailwindcss.com/docs/text-wrap
         */
        "text-wrap": [{
          text: ["wrap", "nowrap", "balance", "pretty"]
        }],
        /**
         * Text Indent
         * @see https://tailwindcss.com/docs/text-indent
         */
        indent: [{
          indent: getSpacingWithArbitrary()
        }],
        /**
         * Vertical Alignment
         * @see https://tailwindcss.com/docs/vertical-align
         */
        "vertical-align": [{
          align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryValue]
        }],
        /**
         * Whitespace
         * @see https://tailwindcss.com/docs/whitespace
         */
        whitespace: [{
          whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
        }],
        /**
         * Word Break
         * @see https://tailwindcss.com/docs/word-break
         */
        break: [{
          break: ["normal", "words", "all", "keep"]
        }],
        /**
         * Hyphens
         * @see https://tailwindcss.com/docs/hyphens
         */
        hyphens: [{
          hyphens: ["none", "manual", "auto"]
        }],
        /**
         * Content
         * @see https://tailwindcss.com/docs/content
         */
        content: [{
          content: ["none", isArbitraryValue]
        }],
        // Backgrounds
        /**
         * Background Attachment
         * @see https://tailwindcss.com/docs/background-attachment
         */
        "bg-attachment": [{
          bg: ["fixed", "local", "scroll"]
        }],
        /**
         * Background Clip
         * @see https://tailwindcss.com/docs/background-clip
         */
        "bg-clip": [{
          "bg-clip": ["border", "padding", "content", "text"]
        }],
        /**
         * Background Opacity
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://tailwindcss.com/docs/background-opacity
         */
        "bg-opacity": [{
          "bg-opacity": [opacity]
        }],
        /**
         * Background Origin
         * @see https://tailwindcss.com/docs/background-origin
         */
        "bg-origin": [{
          "bg-origin": ["border", "padding", "content"]
        }],
        /**
         * Background Position
         * @see https://tailwindcss.com/docs/background-position
         */
        "bg-position": [{
          bg: [...getPositions(), isArbitraryPosition]
        }],
        /**
         * Background Repeat
         * @see https://tailwindcss.com/docs/background-repeat
         */
        "bg-repeat": [{
          bg: ["no-repeat", {
            repeat: ["", "x", "y", "round", "space"]
          }]
        }],
        /**
         * Background Size
         * @see https://tailwindcss.com/docs/background-size
         */
        "bg-size": [{
          bg: ["auto", "cover", "contain", isArbitrarySize]
        }],
        /**
         * Background Image
         * @see https://tailwindcss.com/docs/background-image
         */
        "bg-image": [{
          bg: ["none", {
            "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, isArbitraryImage]
        }],
        /**
         * Background Color
         * @see https://tailwindcss.com/docs/background-color
         */
        "bg-color": [{
          bg: [colors]
        }],
        /**
         * Gradient Color Stops From Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-from-pos": [{
          from: [gradientColorStopPositions]
        }],
        /**
         * Gradient Color Stops Via Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-via-pos": [{
          via: [gradientColorStopPositions]
        }],
        /**
         * Gradient Color Stops To Position
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-to-pos": [{
          to: [gradientColorStopPositions]
        }],
        /**
         * Gradient Color Stops From
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-from": [{
          from: [gradientColorStops]
        }],
        /**
         * Gradient Color Stops Via
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-via": [{
          via: [gradientColorStops]
        }],
        /**
         * Gradient Color Stops To
         * @see https://tailwindcss.com/docs/gradient-color-stops
         */
        "gradient-to": [{
          to: [gradientColorStops]
        }],
        // Borders
        /**
         * Border Radius
         * @see https://tailwindcss.com/docs/border-radius
         */
        rounded: [{
          rounded: [borderRadius]
        }],
        /**
         * Border Radius Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-s": [{
          "rounded-s": [borderRadius]
        }],
        /**
         * Border Radius End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-e": [{
          "rounded-e": [borderRadius]
        }],
        /**
         * Border Radius Top
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-t": [{
          "rounded-t": [borderRadius]
        }],
        /**
         * Border Radius Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-r": [{
          "rounded-r": [borderRadius]
        }],
        /**
         * Border Radius Bottom
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-b": [{
          "rounded-b": [borderRadius]
        }],
        /**
         * Border Radius Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-l": [{
          "rounded-l": [borderRadius]
        }],
        /**
         * Border Radius Start Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-ss": [{
          "rounded-ss": [borderRadius]
        }],
        /**
         * Border Radius Start End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-se": [{
          "rounded-se": [borderRadius]
        }],
        /**
         * Border Radius End End
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-ee": [{
          "rounded-ee": [borderRadius]
        }],
        /**
         * Border Radius End Start
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-es": [{
          "rounded-es": [borderRadius]
        }],
        /**
         * Border Radius Top Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-tl": [{
          "rounded-tl": [borderRadius]
        }],
        /**
         * Border Radius Top Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-tr": [{
          "rounded-tr": [borderRadius]
        }],
        /**
         * Border Radius Bottom Right
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-br": [{
          "rounded-br": [borderRadius]
        }],
        /**
         * Border Radius Bottom Left
         * @see https://tailwindcss.com/docs/border-radius
         */
        "rounded-bl": [{
          "rounded-bl": [borderRadius]
        }],
        /**
         * Border Width
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w": [{
          border: [borderWidth]
        }],
        /**
         * Border Width X
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-x": [{
          "border-x": [borderWidth]
        }],
        /**
         * Border Width Y
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-y": [{
          "border-y": [borderWidth]
        }],
        /**
         * Border Width Start
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-s": [{
          "border-s": [borderWidth]
        }],
        /**
         * Border Width End
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-e": [{
          "border-e": [borderWidth]
        }],
        /**
         * Border Width Top
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-t": [{
          "border-t": [borderWidth]
        }],
        /**
         * Border Width Right
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-r": [{
          "border-r": [borderWidth]
        }],
        /**
         * Border Width Bottom
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-b": [{
          "border-b": [borderWidth]
        }],
        /**
         * Border Width Left
         * @see https://tailwindcss.com/docs/border-width
         */
        "border-w-l": [{
          "border-l": [borderWidth]
        }],
        /**
         * Border Opacity
         * @see https://tailwindcss.com/docs/border-opacity
         */
        "border-opacity": [{
          "border-opacity": [opacity]
        }],
        /**
         * Border Style
         * @see https://tailwindcss.com/docs/border-style
         */
        "border-style": [{
          border: [...getLineStyles(), "hidden"]
        }],
        /**
         * Divide Width X
         * @see https://tailwindcss.com/docs/divide-width
         */
        "divide-x": [{
          "divide-x": [borderWidth]
        }],
        /**
         * Divide Width X Reverse
         * @see https://tailwindcss.com/docs/divide-width
         */
        "divide-x-reverse": ["divide-x-reverse"],
        /**
         * Divide Width Y
         * @see https://tailwindcss.com/docs/divide-width
         */
        "divide-y": [{
          "divide-y": [borderWidth]
        }],
        /**
         * Divide Width Y Reverse
         * @see https://tailwindcss.com/docs/divide-width
         */
        "divide-y-reverse": ["divide-y-reverse"],
        /**
         * Divide Opacity
         * @see https://tailwindcss.com/docs/divide-opacity
         */
        "divide-opacity": [{
          "divide-opacity": [opacity]
        }],
        /**
         * Divide Style
         * @see https://tailwindcss.com/docs/divide-style
         */
        "divide-style": [{
          divide: getLineStyles()
        }],
        /**
         * Border Color
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color": [{
          border: [borderColor]
        }],
        /**
         * Border Color X
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-x": [{
          "border-x": [borderColor]
        }],
        /**
         * Border Color Y
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-y": [{
          "border-y": [borderColor]
        }],
        /**
         * Border Color S
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-s": [{
          "border-s": [borderColor]
        }],
        /**
         * Border Color E
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-e": [{
          "border-e": [borderColor]
        }],
        /**
         * Border Color Top
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-t": [{
          "border-t": [borderColor]
        }],
        /**
         * Border Color Right
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-r": [{
          "border-r": [borderColor]
        }],
        /**
         * Border Color Bottom
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-b": [{
          "border-b": [borderColor]
        }],
        /**
         * Border Color Left
         * @see https://tailwindcss.com/docs/border-color
         */
        "border-color-l": [{
          "border-l": [borderColor]
        }],
        /**
         * Divide Color
         * @see https://tailwindcss.com/docs/divide-color
         */
        "divide-color": [{
          divide: [borderColor]
        }],
        /**
         * Outline Style
         * @see https://tailwindcss.com/docs/outline-style
         */
        "outline-style": [{
          outline: ["", ...getLineStyles()]
        }],
        /**
         * Outline Offset
         * @see https://tailwindcss.com/docs/outline-offset
         */
        "outline-offset": [{
          "outline-offset": [isLength, isArbitraryValue]
        }],
        /**
         * Outline Width
         * @see https://tailwindcss.com/docs/outline-width
         */
        "outline-w": [{
          outline: [isLength, isArbitraryLength]
        }],
        /**
         * Outline Color
         * @see https://tailwindcss.com/docs/outline-color
         */
        "outline-color": [{
          outline: [colors]
        }],
        /**
         * Ring Width
         * @see https://tailwindcss.com/docs/ring-width
         */
        "ring-w": [{
          ring: getLengthWithEmptyAndArbitrary()
        }],
        /**
         * Ring Width Inset
         * @see https://tailwindcss.com/docs/ring-width
         */
        "ring-w-inset": ["ring-inset"],
        /**
         * Ring Color
         * @see https://tailwindcss.com/docs/ring-color
         */
        "ring-color": [{
          ring: [colors]
        }],
        /**
         * Ring Opacity
         * @see https://tailwindcss.com/docs/ring-opacity
         */
        "ring-opacity": [{
          "ring-opacity": [opacity]
        }],
        /**
         * Ring Offset Width
         * @see https://tailwindcss.com/docs/ring-offset-width
         */
        "ring-offset-w": [{
          "ring-offset": [isLength, isArbitraryLength]
        }],
        /**
         * Ring Offset Color
         * @see https://tailwindcss.com/docs/ring-offset-color
         */
        "ring-offset-color": [{
          "ring-offset": [colors]
        }],
        // Effects
        /**
         * Box Shadow
         * @see https://tailwindcss.com/docs/box-shadow
         */
        shadow: [{
          shadow: ["", "inner", "none", isTshirtSize, isArbitraryShadow]
        }],
        /**
         * Box Shadow Color
         * @see https://tailwindcss.com/docs/box-shadow-color
         */
        "shadow-color": [{
          shadow: [isAny]
        }],
        /**
         * Opacity
         * @see https://tailwindcss.com/docs/opacity
         */
        opacity: [{
          opacity: [opacity]
        }],
        /**
         * Mix Blend Mode
         * @see https://tailwindcss.com/docs/mix-blend-mode
         */
        "mix-blend": [{
          "mix-blend": [...getBlendModes(), "plus-lighter", "plus-darker"]
        }],
        /**
         * Background Blend Mode
         * @see https://tailwindcss.com/docs/background-blend-mode
         */
        "bg-blend": [{
          "bg-blend": getBlendModes()
        }],
        // Filters
        /**
         * Filter
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://tailwindcss.com/docs/filter
         */
        filter: [{
          filter: ["", "none"]
        }],
        /**
         * Blur
         * @see https://tailwindcss.com/docs/blur
         */
        blur: [{
          blur: [blur]
        }],
        /**
         * Brightness
         * @see https://tailwindcss.com/docs/brightness
         */
        brightness: [{
          brightness: [brightness]
        }],
        /**
         * Contrast
         * @see https://tailwindcss.com/docs/contrast
         */
        contrast: [{
          contrast: [contrast]
        }],
        /**
         * Drop Shadow
         * @see https://tailwindcss.com/docs/drop-shadow
         */
        "drop-shadow": [{
          "drop-shadow": ["", "none", isTshirtSize, isArbitraryValue]
        }],
        /**
         * Grayscale
         * @see https://tailwindcss.com/docs/grayscale
         */
        grayscale: [{
          grayscale: [grayscale]
        }],
        /**
         * Hue Rotate
         * @see https://tailwindcss.com/docs/hue-rotate
         */
        "hue-rotate": [{
          "hue-rotate": [hueRotate]
        }],
        /**
         * Invert
         * @see https://tailwindcss.com/docs/invert
         */
        invert: [{
          invert: [invert]
        }],
        /**
         * Saturate
         * @see https://tailwindcss.com/docs/saturate
         */
        saturate: [{
          saturate: [saturate]
        }],
        /**
         * Sepia
         * @see https://tailwindcss.com/docs/sepia
         */
        sepia: [{
          sepia: [sepia]
        }],
        /**
         * Backdrop Filter
         * @deprecated since Tailwind CSS v3.0.0
         * @see https://tailwindcss.com/docs/backdrop-filter
         */
        "backdrop-filter": [{
          "backdrop-filter": ["", "none"]
        }],
        /**
         * Backdrop Blur
         * @see https://tailwindcss.com/docs/backdrop-blur
         */
        "backdrop-blur": [{
          "backdrop-blur": [blur]
        }],
        /**
         * Backdrop Brightness
         * @see https://tailwindcss.com/docs/backdrop-brightness
         */
        "backdrop-brightness": [{
          "backdrop-brightness": [brightness]
        }],
        /**
         * Backdrop Contrast
         * @see https://tailwindcss.com/docs/backdrop-contrast
         */
        "backdrop-contrast": [{
          "backdrop-contrast": [contrast]
        }],
        /**
         * Backdrop Grayscale
         * @see https://tailwindcss.com/docs/backdrop-grayscale
         */
        "backdrop-grayscale": [{
          "backdrop-grayscale": [grayscale]
        }],
        /**
         * Backdrop Hue Rotate
         * @see https://tailwindcss.com/docs/backdrop-hue-rotate
         */
        "backdrop-hue-rotate": [{
          "backdrop-hue-rotate": [hueRotate]
        }],
        /**
         * Backdrop Invert
         * @see https://tailwindcss.com/docs/backdrop-invert
         */
        "backdrop-invert": [{
          "backdrop-invert": [invert]
        }],
        /**
         * Backdrop Opacity
         * @see https://tailwindcss.com/docs/backdrop-opacity
         */
        "backdrop-opacity": [{
          "backdrop-opacity": [opacity]
        }],
        /**
         * Backdrop Saturate
         * @see https://tailwindcss.com/docs/backdrop-saturate
         */
        "backdrop-saturate": [{
          "backdrop-saturate": [saturate]
        }],
        /**
         * Backdrop Sepia
         * @see https://tailwindcss.com/docs/backdrop-sepia
         */
        "backdrop-sepia": [{
          "backdrop-sepia": [sepia]
        }],
        // Tables
        /**
         * Border Collapse
         * @see https://tailwindcss.com/docs/border-collapse
         */
        "border-collapse": [{
          border: ["collapse", "separate"]
        }],
        /**
         * Border Spacing
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing": [{
          "border-spacing": [borderSpacing]
        }],
        /**
         * Border Spacing X
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing-x": [{
          "border-spacing-x": [borderSpacing]
        }],
        /**
         * Border Spacing Y
         * @see https://tailwindcss.com/docs/border-spacing
         */
        "border-spacing-y": [{
          "border-spacing-y": [borderSpacing]
        }],
        /**
         * Table Layout
         * @see https://tailwindcss.com/docs/table-layout
         */
        "table-layout": [{
          table: ["auto", "fixed"]
        }],
        /**
         * Caption Side
         * @see https://tailwindcss.com/docs/caption-side
         */
        caption: [{
          caption: ["top", "bottom"]
        }],
        // Transitions and Animation
        /**
         * Tranisition Property
         * @see https://tailwindcss.com/docs/transition-property
         */
        transition: [{
          transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", isArbitraryValue]
        }],
        /**
         * Transition Duration
         * @see https://tailwindcss.com/docs/transition-duration
         */
        duration: [{
          duration: getNumberAndArbitrary()
        }],
        /**
         * Transition Timing Function
         * @see https://tailwindcss.com/docs/transition-timing-function
         */
        ease: [{
          ease: ["linear", "in", "out", "in-out", isArbitraryValue]
        }],
        /**
         * Transition Delay
         * @see https://tailwindcss.com/docs/transition-delay
         */
        delay: [{
          delay: getNumberAndArbitrary()
        }],
        /**
         * Animation
         * @see https://tailwindcss.com/docs/animation
         */
        animate: [{
          animate: ["none", "spin", "ping", "pulse", "bounce", isArbitraryValue]
        }],
        // Transforms
        /**
         * Transform
         * @see https://tailwindcss.com/docs/transform
         */
        transform: [{
          transform: ["", "gpu", "none"]
        }],
        /**
         * Scale
         * @see https://tailwindcss.com/docs/scale
         */
        scale: [{
          scale: [scale]
        }],
        /**
         * Scale X
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-x": [{
          "scale-x": [scale]
        }],
        /**
         * Scale Y
         * @see https://tailwindcss.com/docs/scale
         */
        "scale-y": [{
          "scale-y": [scale]
        }],
        /**
         * Rotate
         * @see https://tailwindcss.com/docs/rotate
         */
        rotate: [{
          rotate: [isInteger, isArbitraryValue]
        }],
        /**
         * Translate X
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-x": [{
          "translate-x": [translate]
        }],
        /**
         * Translate Y
         * @see https://tailwindcss.com/docs/translate
         */
        "translate-y": [{
          "translate-y": [translate]
        }],
        /**
         * Skew X
         * @see https://tailwindcss.com/docs/skew
         */
        "skew-x": [{
          "skew-x": [skew]
        }],
        /**
         * Skew Y
         * @see https://tailwindcss.com/docs/skew
         */
        "skew-y": [{
          "skew-y": [skew]
        }],
        /**
         * Transform Origin
         * @see https://tailwindcss.com/docs/transform-origin
         */
        "transform-origin": [{
          origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", isArbitraryValue]
        }],
        // Interactivity
        /**
         * Accent Color
         * @see https://tailwindcss.com/docs/accent-color
         */
        accent: [{
          accent: ["auto", colors]
        }],
        /**
         * Appearance
         * @see https://tailwindcss.com/docs/appearance
         */
        appearance: [{
          appearance: ["none", "auto"]
        }],
        /**
         * Cursor
         * @see https://tailwindcss.com/docs/cursor
         */
        cursor: [{
          cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryValue]
        }],
        /**
         * Caret Color
         * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
         */
        "caret-color": [{
          caret: [colors]
        }],
        /**
         * Pointer Events
         * @see https://tailwindcss.com/docs/pointer-events
         */
        "pointer-events": [{
          "pointer-events": ["none", "auto"]
        }],
        /**
         * Resize
         * @see https://tailwindcss.com/docs/resize
         */
        resize: [{
          resize: ["none", "y", "x", ""]
        }],
        /**
         * Scroll Behavior
         * @see https://tailwindcss.com/docs/scroll-behavior
         */
        "scroll-behavior": [{
          scroll: ["auto", "smooth"]
        }],
        /**
         * Scroll Margin
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-m": [{
          "scroll-m": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin X
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mx": [{
          "scroll-mx": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Y
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-my": [{
          "scroll-my": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Start
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-ms": [{
          "scroll-ms": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin End
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-me": [{
          "scroll-me": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Top
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mt": [{
          "scroll-mt": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Right
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mr": [{
          "scroll-mr": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Bottom
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-mb": [{
          "scroll-mb": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Margin Left
         * @see https://tailwindcss.com/docs/scroll-margin
         */
        "scroll-ml": [{
          "scroll-ml": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-p": [{
          "scroll-p": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding X
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-px": [{
          "scroll-px": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Y
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-py": [{
          "scroll-py": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Start
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-ps": [{
          "scroll-ps": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding End
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pe": [{
          "scroll-pe": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Top
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pt": [{
          "scroll-pt": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Right
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pr": [{
          "scroll-pr": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Bottom
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pb": [{
          "scroll-pb": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Padding Left
         * @see https://tailwindcss.com/docs/scroll-padding
         */
        "scroll-pl": [{
          "scroll-pl": getSpacingWithArbitrary()
        }],
        /**
         * Scroll Snap Align
         * @see https://tailwindcss.com/docs/scroll-snap-align
         */
        "snap-align": [{
          snap: ["start", "end", "center", "align-none"]
        }],
        /**
         * Scroll Snap Stop
         * @see https://tailwindcss.com/docs/scroll-snap-stop
         */
        "snap-stop": [{
          snap: ["normal", "always"]
        }],
        /**
         * Scroll Snap Type
         * @see https://tailwindcss.com/docs/scroll-snap-type
         */
        "snap-type": [{
          snap: ["none", "x", "y", "both"]
        }],
        /**
         * Scroll Snap Type Strictness
         * @see https://tailwindcss.com/docs/scroll-snap-type
         */
        "snap-strictness": [{
          snap: ["mandatory", "proximity"]
        }],
        /**
         * Touch Action
         * @see https://tailwindcss.com/docs/touch-action
         */
        touch: [{
          touch: ["auto", "none", "manipulation"]
        }],
        /**
         * Touch Action X
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-x": [{
          "touch-pan": ["x", "left", "right"]
        }],
        /**
         * Touch Action Y
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-y": [{
          "touch-pan": ["y", "up", "down"]
        }],
        /**
         * Touch Action Pinch Zoom
         * @see https://tailwindcss.com/docs/touch-action
         */
        "touch-pz": ["touch-pinch-zoom"],
        /**
         * User Select
         * @see https://tailwindcss.com/docs/user-select
         */
        select: [{
          select: ["none", "text", "all", "auto"]
        }],
        /**
         * Will Change
         * @see https://tailwindcss.com/docs/will-change
         */
        "will-change": [{
          "will-change": ["auto", "scroll", "contents", "transform", isArbitraryValue]
        }],
        // SVG
        /**
         * Fill
         * @see https://tailwindcss.com/docs/fill
         */
        fill: [{
          fill: [colors, "none"]
        }],
        /**
         * Stroke Width
         * @see https://tailwindcss.com/docs/stroke-width
         */
        "stroke-w": [{
          stroke: [isLength, isArbitraryLength, isArbitraryNumber]
        }],
        /**
         * Stroke
         * @see https://tailwindcss.com/docs/stroke
         */
        stroke: [{
          stroke: [colors, "none"]
        }],
        // Accessibility
        /**
         * Screen Readers
         * @see https://tailwindcss.com/docs/screen-readers
         */
        sr: ["sr-only", "not-sr-only"],
        /**
         * Forced Color Adjust
         * @see https://tailwindcss.com/docs/forced-color-adjust
         */
        "forced-color-adjust": [{
          "forced-color-adjust": ["auto", "none"]
        }]
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        size: ["w", "h"],
        "font-size": ["leading"],
        "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        "line-clamp": ["display", "overflow"],
        rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"],
        touch: ["touch-x", "touch-y", "touch-pz"],
        "touch-x": ["touch"],
        "touch-y": ["touch"],
        "touch-pz": ["touch"]
      },
      conflictingClassGroupModifiers: {
        "font-size": ["leading"]
      }
    };
  };
  const twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig);
  function cn(...inputs) {
    return twMerge(clsx(inputs));
  }
  const ToastProvider = Provider$1;
  const ToastViewport = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Viewport$2,
    {
      ref,
      className: cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className
      ),
      ...props
    }
  ));
  ToastViewport.displayName = Viewport$2.displayName;
  const toastVariants = cva(
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
    {
      variants: {
        variant: {
          default: "border bg-background text-foreground",
          destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
        }
      },
      defaultVariants: {
        variant: "default"
      }
    }
  );
  const Toast = React__namespace.forwardRef(({ className, variant, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root2$4,
      {
        ref,
        className: cn(toastVariants({ variant }), className),
        ...props
      }
    );
  });
  Toast.displayName = Root2$4.displayName;
  const ToastAction = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Action,
    {
      ref,
      className: cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
        className
      ),
      ...props
    }
  ));
  ToastAction.displayName = Action.displayName;
  const ToastClose = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Close,
    {
      ref,
      className: cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
        className
      ),
      "toast-close": "",
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
    }
  ));
  ToastClose.displayName = Close.displayName;
  const ToastTitle = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      ref,
      className: cn("text-sm font-semibold", className),
      ...props
    }
  ));
  ToastTitle.displayName = Title.displayName;
  const ToastDescription = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description,
    {
      ref,
      className: cn("text-sm opacity-90", className),
      ...props
    }
  ));
  ToastDescription.displayName = Description.displayName;
  function Toaster$1() {
    const { toasts } = useToast();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(ToastProvider, { children: [
      toasts.map(function({ id, title, description, action, ...props }) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Toast, { ...props, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1", children: [
            title && /* @__PURE__ */ jsxRuntimeExports.jsx(ToastTitle, { children: title }),
            description && /* @__PURE__ */ jsxRuntimeExports.jsx(ToastDescription, { children: description })
          ] }),
          action,
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToastClose, {})
        ] }, id);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ToastViewport, {})
    ] });
  }
  var P = ["light", "dark"], E = "(prefers-color-scheme: dark)", L = React__namespace.createContext(void 0), D = { setTheme: (e) => {
  }, themes: [] }, j = () => {
    var e;
    return (e = React__namespace.useContext(L)) != null ? e : D;
  };
  React__namespace.memo(({ forcedTheme: e, storageKey: a, attribute: n2, enableSystem: g, enableColorScheme: m2, defaultTheme: c, value: o, attrs: y, nonce: h }) => {
    let k2 = c === "system", w = n2 === "class" ? `var d=document.documentElement,c=d.classList;${`c.remove(${y.map((u) => `'${u}'`).join(",")})`};` : `var d=document.documentElement,n='${n2}',s='setAttribute';`, i = m2 ? (P.includes(c) ? c : null) ? `if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'${c}'` : "if(e==='light'||e==='dark')d.style.colorScheme=e" : "", d = (l2, u = false, R = true) => {
      let f2 = o ? o[l2] : l2, p2 = u ? l2 + "|| ''" : `'${f2}'`, $ = "";
      return m2 && R && !u && P.includes(l2) && ($ += `d.style.colorScheme = '${l2}';`), n2 === "class" ? u || f2 ? $ += `c.add(${p2})` : $ += "null" : f2 && ($ += `d[s](n,${p2})`), $;
    }, S = e ? `!function(){${w}${d(e)}}()` : g ? `!function(){try{${w}var e=localStorage.getItem('${a}');if('system'===e||(!e&&${k2})){var t='${E}',m=window.matchMedia(t);if(m.media!==t||m.matches){${d("dark")}}else{${d("light")}}}else if(e){${o ? `var x=${JSON.stringify(o)};` : ""}${d(o ? "x[e]" : "e", true)}}${k2 ? "" : "else{" + d(c, false, false) + "}"}${i}}catch(e){}}()` : `!function(){try{${w}var e=localStorage.getItem('${a}');if(e){${o ? `var x=${JSON.stringify(o)};` : ""}${d(o ? "x[e]" : "e", true)}}else{${d(c, false, false)};}${i}}catch(t){}}();`;
    return React__namespace.createElement("script", { nonce: h, dangerouslySetInnerHTML: { __html: S } });
  });
  var jt = (n2) => {
    switch (n2) {
      case "success":
        return ee;
      case "info":
        return ae;
      case "warning":
        return oe;
      case "error":
        return se;
      default:
        return null;
    }
  }, te = Array(12).fill(0), Yt = ({ visible: n2, className: e }) => React$1.createElement("div", { className: ["sonner-loading-wrapper", e].filter(Boolean).join(" "), "data-visible": n2 }, React$1.createElement("div", { className: "sonner-spinner" }, te.map((t, a) => React$1.createElement("div", { className: "sonner-loading-bar", key: `spinner-bar-${a}` })))), ee = React$1.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, React$1.createElement("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z", clipRule: "evenodd" })), oe = React$1.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", height: "20", width: "20" }, React$1.createElement("path", { fillRule: "evenodd", d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z", clipRule: "evenodd" })), ae = React$1.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, React$1.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z", clipRule: "evenodd" })), se = React$1.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, React$1.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z", clipRule: "evenodd" })), Ot = React$1.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }, React$1.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), React$1.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }));
  var Ft = () => {
    let [n2, e] = React$1.useState(document.hidden);
    return React$1.useEffect(() => {
      let t = () => {
        e(document.hidden);
      };
      return document.addEventListener("visibilitychange", t), () => window.removeEventListener("visibilitychange", t);
    }, []), n2;
  };
  var bt = 1, yt = class {
    constructor() {
      this.subscribe = (e) => (this.subscribers.push(e), () => {
        let t = this.subscribers.indexOf(e);
        this.subscribers.splice(t, 1);
      });
      this.publish = (e) => {
        this.subscribers.forEach((t) => t(e));
      };
      this.addToast = (e) => {
        this.publish(e), this.toasts = [...this.toasts, e];
      };
      this.create = (e) => {
        var S;
        let { message: t, ...a } = e, u = typeof (e == null ? void 0 : e.id) == "number" || ((S = e.id) == null ? void 0 : S.length) > 0 ? e.id : bt++, f2 = this.toasts.find((g) => g.id === u), w = e.dismissible === void 0 ? true : e.dismissible;
        return this.dismissedToasts.has(u) && this.dismissedToasts.delete(u), f2 ? this.toasts = this.toasts.map((g) => g.id === u ? (this.publish({ ...g, ...e, id: u, title: t }), { ...g, ...e, id: u, dismissible: w, title: t }) : g) : this.addToast({ title: t, ...a, dismissible: w, id: u }), u;
      };
      this.dismiss = (e) => (this.dismissedToasts.add(e), e || this.toasts.forEach((t) => {
        this.subscribers.forEach((a) => a({ id: t.id, dismiss: true }));
      }), this.subscribers.forEach((t) => t({ id: e, dismiss: true })), e);
      this.message = (e, t) => this.create({ ...t, message: e });
      this.error = (e, t) => this.create({ ...t, message: e, type: "error" });
      this.success = (e, t) => this.create({ ...t, type: "success", message: e });
      this.info = (e, t) => this.create({ ...t, type: "info", message: e });
      this.warning = (e, t) => this.create({ ...t, type: "warning", message: e });
      this.loading = (e, t) => this.create({ ...t, type: "loading", message: e });
      this.promise = (e, t) => {
        if (!t) return;
        let a;
        t.loading !== void 0 && (a = this.create({ ...t, promise: e, type: "loading", message: t.loading, description: typeof t.description != "function" ? t.description : void 0 }));
        let u = e instanceof Promise ? e : e(), f2 = a !== void 0, w, S = u.then(async (i) => {
          if (w = ["resolve", i], React$1.isValidElement(i)) f2 = false, this.create({ id: a, type: "default", message: i });
          else if (ie(i) && !i.ok) {
            f2 = false;
            let T = typeof t.error == "function" ? await t.error(`HTTP error! status: ${i.status}`) : t.error, F = typeof t.description == "function" ? await t.description(`HTTP error! status: ${i.status}`) : t.description;
            this.create({ id: a, type: "error", message: T, description: F });
          } else if (t.success !== void 0) {
            f2 = false;
            let T = typeof t.success == "function" ? await t.success(i) : t.success, F = typeof t.description == "function" ? await t.description(i) : t.description;
            this.create({ id: a, type: "success", message: T, description: F });
          }
        }).catch(async (i) => {
          if (w = ["reject", i], t.error !== void 0) {
            f2 = false;
            let D2 = typeof t.error == "function" ? await t.error(i) : t.error, T = typeof t.description == "function" ? await t.description(i) : t.description;
            this.create({ id: a, type: "error", message: D2, description: T });
          }
        }).finally(() => {
          var i;
          f2 && (this.dismiss(a), a = void 0), (i = t.finally) == null || i.call(t);
        }), g = () => new Promise((i, D2) => S.then(() => w[0] === "reject" ? D2(w[1]) : i(w[1])).catch(D2));
        return typeof a != "string" && typeof a != "number" ? { unwrap: g } : Object.assign(a, { unwrap: g });
      };
      this.custom = (e, t) => {
        let a = (t == null ? void 0 : t.id) || bt++;
        return this.create({ jsx: e(a), id: a, ...t }), a;
      };
      this.getActiveToasts = () => this.toasts.filter((e) => !this.dismissedToasts.has(e.id));
      this.subscribers = [], this.toasts = [], this.dismissedToasts = /* @__PURE__ */ new Set();
    }
  }, v = new yt(), ne = (n2, e) => {
    let t = (e == null ? void 0 : e.id) || bt++;
    return v.addToast({ title: n2, ...e, id: t }), t;
  }, ie = (n2) => n2 && typeof n2 == "object" && "ok" in n2 && typeof n2.ok == "boolean" && "status" in n2 && typeof n2.status == "number", le = ne, ce = () => v.toasts, de = () => v.getActiveToasts();
  Object.assign(le, { success: v.success, info: v.info, warning: v.warning, error: v.error, custom: v.custom, message: v.message, promise: v.promise, dismiss: v.dismiss, loading: v.loading }, { getHistory: ce, getToasts: de });
  function wt(n2, { insertAt: e } = {}) {
    if (typeof document == "undefined") return;
    let t = document.head || document.getElementsByTagName("head")[0], a = document.createElement("style");
    a.type = "text/css", e === "top" && t.firstChild ? t.insertBefore(a, t.firstChild) : t.appendChild(a), a.styleSheet ? a.styleSheet.cssText = n2 : a.appendChild(document.createTextNode(n2));
  }
  wt(`:where(html[dir="ltr"]),:where([data-sonner-toaster][dir="ltr"]){--toast-icon-margin-start: -3px;--toast-icon-margin-end: 4px;--toast-svg-margin-start: -1px;--toast-svg-margin-end: 0px;--toast-button-margin-start: auto;--toast-button-margin-end: 0;--toast-close-button-start: 0;--toast-close-button-end: unset;--toast-close-button-transform: translate(-35%, -35%)}:where(html[dir="rtl"]),:where([data-sonner-toaster][dir="rtl"]){--toast-icon-margin-start: 4px;--toast-icon-margin-end: -3px;--toast-svg-margin-start: 0px;--toast-svg-margin-end: -1px;--toast-button-margin-start: 0;--toast-button-margin-end: auto;--toast-close-button-start: unset;--toast-close-button-end: 0;--toast-close-button-transform: translate(35%, -35%)}:where([data-sonner-toaster]){position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1: hsl(0, 0%, 99%);--gray2: hsl(0, 0%, 97.3%);--gray3: hsl(0, 0%, 95.1%);--gray4: hsl(0, 0%, 93%);--gray5: hsl(0, 0%, 90.9%);--gray6: hsl(0, 0%, 88.7%);--gray7: hsl(0, 0%, 85.8%);--gray8: hsl(0, 0%, 78%);--gray9: hsl(0, 0%, 56.1%);--gray10: hsl(0, 0%, 52.3%);--gray11: hsl(0, 0%, 43.5%);--gray12: hsl(0, 0%, 9%);--border-radius: 8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:none;z-index:999999999;transition:transform .4s ease}:where([data-sonner-toaster][data-lifted="true"]){transform:translateY(-10px)}@media (hover: none) and (pointer: coarse){:where([data-sonner-toaster][data-lifted="true"]){transform:none}}:where([data-sonner-toaster][data-x-position="right"]){right:var(--offset-right)}:where([data-sonner-toaster][data-x-position="left"]){left:var(--offset-left)}:where([data-sonner-toaster][data-x-position="center"]){left:50%;transform:translate(-50%)}:where([data-sonner-toaster][data-y-position="top"]){top:var(--offset-top)}:where([data-sonner-toaster][data-y-position="bottom"]){bottom:var(--offset-bottom)}:where([data-sonner-toast]){--y: translateY(100%);--lift-amount: calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);filter:blur(0);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:none;overflow-wrap:anywhere}:where([data-sonner-toast][data-styled="true"]){padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px #0000001a;width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}:where([data-sonner-toast]:focus-visible){box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast][data-y-position="top"]){top:0;--y: translateY(-100%);--lift: 1;--lift-amount: calc(1 * var(--gap))}:where([data-sonner-toast][data-y-position="bottom"]){bottom:0;--y: translateY(100%);--lift: -1;--lift-amount: calc(var(--lift) * var(--gap))}:where([data-sonner-toast]) :where([data-description]){font-weight:400;line-height:1.4;color:inherit}:where([data-sonner-toast]) :where([data-title]){font-weight:500;line-height:1.5;color:inherit}:where([data-sonner-toast]) :where([data-icon]){display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}:where([data-sonner-toast][data-promise="true"]) :where([data-icon])>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}:where([data-sonner-toast]) :where([data-icon])>*{flex-shrink:0}:where([data-sonner-toast]) :where([data-icon]) svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}:where([data-sonner-toast]) :where([data-content]){display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;cursor:pointer;outline:none;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}:where([data-sonner-toast]) :where([data-button]):focus-visible{box-shadow:0 0 0 2px #0006}:where([data-sonner-toast]) :where([data-button]):first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}:where([data-sonner-toast]) :where([data-cancel]){color:var(--normal-text);background:rgba(0,0,0,.08)}:where([data-sonner-toast][data-theme="dark"]) :where([data-cancel]){background:rgba(255,255,255,.3)}:where([data-sonner-toast]) :where([data-close-button]){position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast] [data-close-button]{background:var(--gray1)}:where([data-sonner-toast]) :where([data-close-button]):focus-visible{box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast]) :where([data-disabled="true"]){cursor:not-allowed}:where([data-sonner-toast]):hover :where([data-close-button]):hover{background:var(--gray2);border-color:var(--gray5)}:where([data-sonner-toast][data-swiping="true"]):before{content:"";position:absolute;left:-50%;right:-50%;height:100%;z-index:-1}:where([data-sonner-toast][data-y-position="top"][data-swiping="true"]):before{bottom:50%;transform:scaleY(3) translateY(50%)}:where([data-sonner-toast][data-y-position="bottom"][data-swiping="true"]):before{top:50%;transform:scaleY(3) translateY(-50%)}:where([data-sonner-toast][data-swiping="false"][data-removed="true"]):before{content:"";position:absolute;inset:0;transform:scaleY(2)}:where([data-sonner-toast]):after{content:"";position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}:where([data-sonner-toast][data-mounted="true"]){--y: translateY(0);opacity:1}:where([data-sonner-toast][data-expanded="false"][data-front="false"]){--scale: var(--toasts-before) * .05 + 1;--y: translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}:where([data-sonner-toast])>*{transition:opacity .4s}:where([data-sonner-toast][data-expanded="false"][data-front="false"][data-styled="true"])>*{opacity:0}:where([data-sonner-toast][data-visible="false"]){opacity:0;pointer-events:none}:where([data-sonner-toast][data-mounted="true"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}:where([data-sonner-toast][data-removed="true"][data-front="true"][data-swipe-out="false"]){--y: translateY(calc(var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="false"]){--y: translateY(40%);opacity:0;transition:transform .5s,opacity .2s}:where([data-sonner-toast][data-removed="true"][data-front="false"]):before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y, 0px)) translate(var(--swipe-amount-x, 0px));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{0%{transform:var(--y) translate(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translate(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{0%{transform:var(--y) translate(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translate(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{0%{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{0%{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width: 600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-theme=light]{--normal-bg: #fff;--normal-border: var(--gray4);--normal-text: var(--gray12);--success-bg: hsl(143, 85%, 96%);--success-border: hsl(145, 92%, 91%);--success-text: hsl(140, 100%, 27%);--info-bg: hsl(208, 100%, 97%);--info-border: hsl(221, 91%, 91%);--info-text: hsl(210, 92%, 45%);--warning-bg: hsl(49, 100%, 97%);--warning-border: hsl(49, 91%, 91%);--warning-text: hsl(31, 92%, 45%);--error-bg: hsl(359, 100%, 97%);--error-border: hsl(359, 100%, 94%);--error-text: hsl(360, 100%, 45%)}[data-sonner-toaster][data-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg: #000;--normal-border: hsl(0, 0%, 20%);--normal-text: var(--gray1)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg: #fff;--normal-border: var(--gray3);--normal-text: var(--gray12)}[data-sonner-toaster][data-theme=dark]{--normal-bg: #000;--normal-bg-hover: hsl(0, 0%, 12%);--normal-border: hsl(0, 0%, 20%);--normal-border-hover: hsl(0, 0%, 25%);--normal-text: var(--gray1);--success-bg: hsl(150, 100%, 6%);--success-border: hsl(147, 100%, 12%);--success-text: hsl(150, 86%, 65%);--info-bg: hsl(215, 100%, 6%);--info-border: hsl(223, 100%, 12%);--info-text: hsl(216, 87%, 65%);--warning-bg: hsl(64, 100%, 6%);--warning-border: hsl(60, 100%, 12%);--warning-text: hsl(46, 87%, 65%);--error-bg: hsl(358, 76%, 10%);--error-border: hsl(357, 89%, 16%);--error-text: hsl(358, 100%, 81%)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success],[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info],[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning],[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error],[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size: 16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:nth-child(1){animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}to{opacity:.15}}@media (prefers-reduced-motion){[data-sonner-toast],[data-sonner-toast]>*,.sonner-loading-bar{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}
`);
  function tt(n2) {
    return n2.label !== void 0;
  }
  var pe = 3, me = "32px", ge = "16px", Wt = 4e3, he = 356, be = 14, ye = 20, we = 200;
  function M(...n2) {
    return n2.filter(Boolean).join(" ");
  }
  function xe(n2) {
    let [e, t] = n2.split("-"), a = [];
    return e && a.push(e), t && a.push(t), a;
  }
  var ve = (n2) => {
    var Dt, Pt, Nt, Bt, Ct, kt, It, Mt, Ht, At, Lt;
    let { invert: e, toast: t, unstyled: a, interacting: u, setHeights: f2, visibleToasts: w, heights: S, index: g, toasts: i, expanded: D2, removeToast: T, defaultRichColors: F, closeButton: et, style: ut, cancelButtonStyle: ft, actionButtonStyle: l2, className: ot = "", descriptionClassName: at = "", duration: X2, position: st, gap: pt, loadingIcon: rt, expandByDefault: B, classNames: s, icons: P2, closeButtonAriaLabel: nt = "Close toast", pauseWhenPageIsHidden: it } = n2, [Y, C] = React$1.useState(null), [lt, J] = React$1.useState(null), [W, H] = React$1.useState(false), [A, mt] = React$1.useState(false), [L2, z] = React$1.useState(false), [ct, d] = React$1.useState(false), [h, y] = React$1.useState(false), [R, j2] = React$1.useState(0), [p2, _] = React$1.useState(0), O = React$1.useRef(t.duration || X2 || Wt), G = React$1.useRef(null), k2 = React$1.useRef(null), Vt = g === 0, Ut = g + 1 <= w, N = t.type, V = t.dismissible !== false, Kt = t.className || "", Xt = t.descriptionClassName || "", dt = React$1.useMemo(() => S.findIndex((r2) => r2.toastId === t.id) || 0, [S, t.id]), Jt = React$1.useMemo(() => {
      var r2;
      return (r2 = t.closeButton) != null ? r2 : et;
    }, [t.closeButton, et]), Tt = React$1.useMemo(() => t.duration || X2 || Wt, [t.duration, X2]), gt = React$1.useRef(0), U = React$1.useRef(0), St = React$1.useRef(0), K = React$1.useRef(null), [Gt, Qt] = st.split("-"), Rt = React$1.useMemo(() => S.reduce((r2, m2, c) => c >= dt ? r2 : r2 + m2.height, 0), [S, dt]), Et = Ft(), qt = t.invert || e, ht = N === "loading";
    U.current = React$1.useMemo(() => dt * pt + Rt, [dt, Rt]), React$1.useEffect(() => {
      O.current = Tt;
    }, [Tt]), React$1.useEffect(() => {
      H(true);
    }, []), React$1.useEffect(() => {
      let r2 = k2.current;
      if (r2) {
        let m2 = r2.getBoundingClientRect().height;
        return _(m2), f2((c) => [{ toastId: t.id, height: m2, position: t.position }, ...c]), () => f2((c) => c.filter((b) => b.toastId !== t.id));
      }
    }, [f2, t.id]), React$1.useLayoutEffect(() => {
      if (!W) return;
      let r2 = k2.current, m2 = r2.style.height;
      r2.style.height = "auto";
      let c = r2.getBoundingClientRect().height;
      r2.style.height = m2, _(c), f2((b) => b.find((x) => x.toastId === t.id) ? b.map((x) => x.toastId === t.id ? { ...x, height: c } : x) : [{ toastId: t.id, height: c, position: t.position }, ...b]);
    }, [W, t.title, t.description, f2, t.id]);
    let $ = React$1.useCallback(() => {
      mt(true), j2(U.current), f2((r2) => r2.filter((m2) => m2.toastId !== t.id)), setTimeout(() => {
        T(t);
      }, we);
    }, [t, T, f2, U]);
    React$1.useEffect(() => {
      if (t.promise && N === "loading" || t.duration === 1 / 0 || t.type === "loading") return;
      let r2;
      return D2 || u || it && Et ? (() => {
        if (St.current < gt.current) {
          let b = (/* @__PURE__ */ new Date()).getTime() - gt.current;
          O.current = O.current - b;
        }
        St.current = (/* @__PURE__ */ new Date()).getTime();
      })() : (() => {
        O.current !== 1 / 0 && (gt.current = (/* @__PURE__ */ new Date()).getTime(), r2 = setTimeout(() => {
          var b;
          (b = t.onAutoClose) == null || b.call(t, t), $();
        }, O.current));
      })(), () => clearTimeout(r2);
    }, [D2, u, t, N, it, Et, $]), React$1.useEffect(() => {
      t.delete && $();
    }, [$, t.delete]);
    function Zt() {
      var r2, m2, c;
      return P2 != null && P2.loading ? React$1.createElement("div", { className: M(s == null ? void 0 : s.loader, (r2 = t == null ? void 0 : t.classNames) == null ? void 0 : r2.loader, "sonner-loader"), "data-visible": N === "loading" }, P2.loading) : rt ? React$1.createElement("div", { className: M(s == null ? void 0 : s.loader, (m2 = t == null ? void 0 : t.classNames) == null ? void 0 : m2.loader, "sonner-loader"), "data-visible": N === "loading" }, rt) : React$1.createElement(Yt, { className: M(s == null ? void 0 : s.loader, (c = t == null ? void 0 : t.classNames) == null ? void 0 : c.loader), visible: N === "loading" });
    }
    return React$1.createElement("li", { tabIndex: 0, ref: k2, className: M(ot, Kt, s == null ? void 0 : s.toast, (Dt = t == null ? void 0 : t.classNames) == null ? void 0 : Dt.toast, s == null ? void 0 : s.default, s == null ? void 0 : s[N], (Pt = t == null ? void 0 : t.classNames) == null ? void 0 : Pt[N]), "data-sonner-toast": "", "data-rich-colors": (Nt = t.richColors) != null ? Nt : F, "data-styled": !(t.jsx || t.unstyled || a), "data-mounted": W, "data-promise": !!t.promise, "data-swiped": h, "data-removed": A, "data-visible": Ut, "data-y-position": Gt, "data-x-position": Qt, "data-index": g, "data-front": Vt, "data-swiping": L2, "data-dismissible": V, "data-type": N, "data-invert": qt, "data-swipe-out": ct, "data-swipe-direction": lt, "data-expanded": !!(D2 || B && W), style: { "--index": g, "--toasts-before": g, "--z-index": i.length - g, "--offset": `${A ? R : U.current}px`, "--initial-height": B ? "auto" : `${p2}px`, ...ut, ...t.style }, onDragEnd: () => {
      z(false), C(null), K.current = null;
    }, onPointerDown: (r2) => {
      ht || !V || (G.current = /* @__PURE__ */ new Date(), j2(U.current), r2.target.setPointerCapture(r2.pointerId), r2.target.tagName !== "BUTTON" && (z(true), K.current = { x: r2.clientX, y: r2.clientY }));
    }, onPointerUp: () => {
      var x, Q, q2, Z;
      if (ct || !V) return;
      K.current = null;
      let r2 = Number(((x = k2.current) == null ? void 0 : x.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0), m2 = Number(((Q = k2.current) == null ? void 0 : Q.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0), c = (/* @__PURE__ */ new Date()).getTime() - ((q2 = G.current) == null ? void 0 : q2.getTime()), b = Y === "x" ? r2 : m2, I = Math.abs(b) / c;
      if (Math.abs(b) >= ye || I > 0.11) {
        j2(U.current), (Z = t.onDismiss) == null || Z.call(t, t), J(Y === "x" ? r2 > 0 ? "right" : "left" : m2 > 0 ? "down" : "up"), $(), d(true), y(false);
        return;
      }
      z(false), C(null);
    }, onPointerMove: (r2) => {
      var Q, q2, Z, zt;
      if (!K.current || !V || ((Q = window.getSelection()) == null ? void 0 : Q.toString().length) > 0) return;
      let c = r2.clientY - K.current.y, b = r2.clientX - K.current.x, I = (q2 = n2.swipeDirections) != null ? q2 : xe(st);
      !Y && (Math.abs(b) > 1 || Math.abs(c) > 1) && C(Math.abs(b) > Math.abs(c) ? "x" : "y");
      let x = { x: 0, y: 0 };
      Y === "y" ? (I.includes("top") || I.includes("bottom")) && (I.includes("top") && c < 0 || I.includes("bottom") && c > 0) && (x.y = c) : Y === "x" && (I.includes("left") || I.includes("right")) && (I.includes("left") && b < 0 || I.includes("right") && b > 0) && (x.x = b), (Math.abs(x.x) > 0 || Math.abs(x.y) > 0) && y(true), (Z = k2.current) == null || Z.style.setProperty("--swipe-amount-x", `${x.x}px`), (zt = k2.current) == null || zt.style.setProperty("--swipe-amount-y", `${x.y}px`);
    } }, Jt && !t.jsx ? React$1.createElement("button", { "aria-label": nt, "data-disabled": ht, "data-close-button": true, onClick: ht || !V ? () => {
    } : () => {
      var r2;
      $(), (r2 = t.onDismiss) == null || r2.call(t, t);
    }, className: M(s == null ? void 0 : s.closeButton, (Bt = t == null ? void 0 : t.classNames) == null ? void 0 : Bt.closeButton) }, (Ct = P2 == null ? void 0 : P2.close) != null ? Ct : Ot) : null, t.jsx || React$1.isValidElement(t.title) ? t.jsx ? t.jsx : typeof t.title == "function" ? t.title() : t.title : React$1.createElement(React$1.Fragment, null, N || t.icon || t.promise ? React$1.createElement("div", { "data-icon": "", className: M(s == null ? void 0 : s.icon, (kt = t == null ? void 0 : t.classNames) == null ? void 0 : kt.icon) }, t.promise || t.type === "loading" && !t.icon ? t.icon || Zt() : null, t.type !== "loading" ? t.icon || (P2 == null ? void 0 : P2[N]) || jt(N) : null) : null, React$1.createElement("div", { "data-content": "", className: M(s == null ? void 0 : s.content, (It = t == null ? void 0 : t.classNames) == null ? void 0 : It.content) }, React$1.createElement("div", { "data-title": "", className: M(s == null ? void 0 : s.title, (Mt = t == null ? void 0 : t.classNames) == null ? void 0 : Mt.title) }, typeof t.title == "function" ? t.title() : t.title), t.description ? React$1.createElement("div", { "data-description": "", className: M(at, Xt, s == null ? void 0 : s.description, (Ht = t == null ? void 0 : t.classNames) == null ? void 0 : Ht.description) }, typeof t.description == "function" ? t.description() : t.description) : null), React$1.isValidElement(t.cancel) ? t.cancel : t.cancel && tt(t.cancel) ? React$1.createElement("button", { "data-button": true, "data-cancel": true, style: t.cancelButtonStyle || ft, onClick: (r2) => {
      var m2, c;
      tt(t.cancel) && V && ((c = (m2 = t.cancel).onClick) == null || c.call(m2, r2), $());
    }, className: M(s == null ? void 0 : s.cancelButton, (At = t == null ? void 0 : t.classNames) == null ? void 0 : At.cancelButton) }, t.cancel.label) : null, React$1.isValidElement(t.action) ? t.action : t.action && tt(t.action) ? React$1.createElement("button", { "data-button": true, "data-action": true, style: t.actionButtonStyle || l2, onClick: (r2) => {
      var m2, c;
      tt(t.action) && ((c = (m2 = t.action).onClick) == null || c.call(m2, r2), !r2.defaultPrevented && $());
    }, className: M(s == null ? void 0 : s.actionButton, (Lt = t == null ? void 0 : t.classNames) == null ? void 0 : Lt.actionButton) }, t.action.label) : null));
  };
  function _t() {
    if (typeof window == "undefined" || typeof document == "undefined") return "ltr";
    let n2 = document.documentElement.getAttribute("dir");
    return n2 === "auto" || !n2 ? window.getComputedStyle(document.documentElement).direction : n2;
  }
  function Te(n2, e) {
    let t = {};
    return [n2, e].forEach((a, u) => {
      let f2 = u === 1, w = f2 ? "--mobile-offset" : "--offset", S = f2 ? ge : me;
      function g(i) {
        ["top", "right", "bottom", "left"].forEach((D2) => {
          t[`${w}-${D2}`] = typeof i == "number" ? `${i}px` : i;
        });
      }
      typeof a == "number" || typeof a == "string" ? g(a) : typeof a == "object" ? ["top", "right", "bottom", "left"].forEach((i) => {
        a[i] === void 0 ? t[`${w}-${i}`] = S : t[`${w}-${i}`] = typeof a[i] == "number" ? `${a[i]}px` : a[i];
      }) : g(S);
    }), t;
  }
  var $e = React$1.forwardRef(function(e, t) {
    let { invert: a, position: u = "bottom-right", hotkey: f2 = ["altKey", "KeyT"], expand: w, closeButton: S, className: g, offset: i, mobileOffset: D2, theme: T = "light", richColors: F, duration: et, style: ut, visibleToasts: ft = pe, toastOptions: l2, dir: ot = _t(), gap: at = be, loadingIcon: X2, icons: st, containerAriaLabel: pt = "Notifications", pauseWhenPageIsHidden: rt } = e, [B, s] = React$1.useState([]), P2 = React$1.useMemo(() => Array.from(new Set([u].concat(B.filter((d) => d.position).map((d) => d.position)))), [B, u]), [nt, it] = React$1.useState([]), [Y, C] = React$1.useState(false), [lt, J] = React$1.useState(false), [W, H] = React$1.useState(T !== "system" ? T : typeof window != "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), A = React$1.useRef(null), mt = f2.join("+").replace(/Key/g, "").replace(/Digit/g, ""), L2 = React$1.useRef(null), z = React$1.useRef(false), ct = React$1.useCallback((d) => {
      s((h) => {
        var y;
        return (y = h.find((R) => R.id === d.id)) != null && y.delete || v.dismiss(d.id), h.filter(({ id: R }) => R !== d.id);
      });
    }, []);
    return React$1.useEffect(() => v.subscribe((d) => {
      if (d.dismiss) {
        s((h) => h.map((y) => y.id === d.id ? { ...y, delete: true } : y));
        return;
      }
      setTimeout(() => {
        ReactDOM2.flushSync(() => {
          s((h) => {
            let y = h.findIndex((R) => R.id === d.id);
            return y !== -1 ? [...h.slice(0, y), { ...h[y], ...d }, ...h.slice(y + 1)] : [d, ...h];
          });
        });
      });
    }), []), React$1.useEffect(() => {
      if (T !== "system") {
        H(T);
        return;
      }
      if (T === "system" && (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? H("dark") : H("light")), typeof window == "undefined") return;
      let d = window.matchMedia("(prefers-color-scheme: dark)");
      try {
        d.addEventListener("change", ({ matches: h }) => {
          H(h ? "dark" : "light");
        });
      } catch (h) {
        d.addListener(({ matches: y }) => {
          try {
            H(y ? "dark" : "light");
          } catch (R) {
            console.error(R);
          }
        });
      }
    }, [T]), React$1.useEffect(() => {
      B.length <= 1 && C(false);
    }, [B]), React$1.useEffect(() => {
      let d = (h) => {
        var R, j2;
        f2.every((p2) => h[p2] || h.code === p2) && (C(true), (R = A.current) == null || R.focus()), h.code === "Escape" && (document.activeElement === A.current || (j2 = A.current) != null && j2.contains(document.activeElement)) && C(false);
      };
      return document.addEventListener("keydown", d), () => document.removeEventListener("keydown", d);
    }, [f2]), React$1.useEffect(() => {
      if (A.current) return () => {
        L2.current && (L2.current.focus({ preventScroll: true }), L2.current = null, z.current = false);
      };
    }, [A.current]), React$1.createElement("section", { ref: t, "aria-label": `${pt} ${mt}`, tabIndex: -1, "aria-live": "polite", "aria-relevant": "additions text", "aria-atomic": "false", suppressHydrationWarning: true }, P2.map((d, h) => {
      var j2;
      let [y, R] = d.split("-");
      return B.length ? React$1.createElement("ol", { key: d, dir: ot === "auto" ? _t() : ot, tabIndex: -1, ref: A, className: g, "data-sonner-toaster": true, "data-theme": W, "data-y-position": y, "data-lifted": Y && B.length > 1 && !w, "data-x-position": R, style: { "--front-toast-height": `${((j2 = nt[0]) == null ? void 0 : j2.height) || 0}px`, "--width": `${he}px`, "--gap": `${at}px`, ...ut, ...Te(i, D2) }, onBlur: (p2) => {
        z.current && !p2.currentTarget.contains(p2.relatedTarget) && (z.current = false, L2.current && (L2.current.focus({ preventScroll: true }), L2.current = null));
      }, onFocus: (p2) => {
        p2.target instanceof HTMLElement && p2.target.dataset.dismissible === "false" || z.current || (z.current = true, L2.current = p2.relatedTarget);
      }, onMouseEnter: () => C(true), onMouseMove: () => C(true), onMouseLeave: () => {
        lt || C(false);
      }, onDragEnd: () => C(false), onPointerDown: (p2) => {
        p2.target instanceof HTMLElement && p2.target.dataset.dismissible === "false" || J(true);
      }, onPointerUp: () => J(false) }, B.filter((p2) => !p2.position && h === 0 || p2.position === d).map((p2, _) => {
        var O, G;
        return React$1.createElement(ve, { key: p2.id, icons: st, index: _, toast: p2, defaultRichColors: F, duration: (O = l2 == null ? void 0 : l2.duration) != null ? O : et, className: l2 == null ? void 0 : l2.className, descriptionClassName: l2 == null ? void 0 : l2.descriptionClassName, invert: a, visibleToasts: ft, closeButton: (G = l2 == null ? void 0 : l2.closeButton) != null ? G : S, interacting: lt, position: d, style: l2 == null ? void 0 : l2.style, unstyled: l2 == null ? void 0 : l2.unstyled, classNames: l2 == null ? void 0 : l2.classNames, cancelButtonStyle: l2 == null ? void 0 : l2.cancelButtonStyle, actionButtonStyle: l2 == null ? void 0 : l2.actionButtonStyle, removeToast: ct, toasts: B.filter((k2) => k2.position == p2.position), heights: nt.filter((k2) => k2.position == p2.position), setHeights: it, expandByDefault: w, gap: at, loadingIcon: X2, expanded: Y, pauseWhenPageIsHidden: rt, swipeDirections: e.swipeDirections });
      })) : null;
    }));
  });
  const Toaster = ({ ...props }) => {
    const { theme = "system" } = j();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      $e,
      {
        theme,
        className: "toaster group",
        toastOptions: {
          classNames: {
            toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
          }
        },
        ...props
      }
    );
  };
  var useReactId = React__namespace[" useId ".trim().toString()] || (() => void 0);
  var count$1 = 0;
  function useId(deterministicId) {
    const [id, setId] = React__namespace.useState(useReactId());
    useLayoutEffect2(() => {
      setId((reactId) => reactId ?? String(count$1++));
    }, [deterministicId]);
    return id ? `radix-${id}` : "";
  }
  const sides = ["top", "right", "bottom", "left"];
  const min = Math.min;
  const max = Math.max;
  const round = Math.round;
  const floor = Math.floor;
  const createCoords = (v2) => ({
    x: v2,
    y: v2
  });
  const oppositeSideMap = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  const oppositeAlignmentMap = {
    start: "end",
    end: "start"
  };
  function clamp$1(start, value, end) {
    return max(start, min(value, end));
  }
  function evaluate(value, param) {
    return typeof value === "function" ? value(param) : value;
  }
  function getSide(placement) {
    return placement.split("-")[0];
  }
  function getAlignment(placement) {
    return placement.split("-")[1];
  }
  function getOppositeAxis(axis) {
    return axis === "x" ? "y" : "x";
  }
  function getAxisLength(axis) {
    return axis === "y" ? "height" : "width";
  }
  function getSideAxis(placement) {
    return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
  }
  function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
  }
  function getAlignmentSides(placement, rects, rtl) {
    if (rtl === void 0) {
      rtl = false;
    }
    const alignment = getAlignment(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const length = getAxisLength(alignmentAxis);
    let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
    if (rects.reference[length] > rects.floating[length]) {
      mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
    }
    return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
  }
  function getExpandedPlacements(placement) {
    const oppositePlacement = getOppositePlacement(placement);
    return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
  }
  function getOppositeAlignmentPlacement(placement) {
    return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
  }
  function getSideList(side, isStart, rtl) {
    const lr = ["left", "right"];
    const rl = ["right", "left"];
    const tb = ["top", "bottom"];
    const bt2 = ["bottom", "top"];
    switch (side) {
      case "top":
      case "bottom":
        if (rtl) return isStart ? rl : lr;
        return isStart ? lr : rl;
      case "left":
      case "right":
        return isStart ? tb : bt2;
      default:
        return [];
    }
  }
  function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
    const alignment = getAlignment(placement);
    let list = getSideList(getSide(placement), direction === "start", rtl);
    if (alignment) {
      list = list.map((side) => side + "-" + alignment);
      if (flipAlignment) {
        list = list.concat(list.map(getOppositeAlignmentPlacement));
      }
    }
    return list;
  }
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
  }
  function expandPaddingObject(padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...padding
    };
  }
  function getPaddingObject(padding) {
    return typeof padding !== "number" ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  function rectToClientRect(rect) {
    const {
      x,
      y,
      width,
      height
    } = rect;
    return {
      width,
      height,
      top: y,
      left: x,
      right: x + width,
      bottom: y + height,
      x,
      y
    };
  }
  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {
      reference,
      floating
    } = _ref;
    const sideAxis = getSideAxis(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const alignLength = getAxisLength(alignmentAxis);
    const side = getSide(placement);
    const isVertical = sideAxis === "y";
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch (side) {
      case "top":
        coords = {
          x: commonX,
          y: reference.y - floating.height
        };
        break;
      case "bottom":
        coords = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case "right":
        coords = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case "left":
        coords = {
          x: reference.x - floating.width,
          y: commonY
        };
        break;
      default:
        coords = {
          x: reference.x,
          y: reference.y
        };
    }
    switch (getAlignment(placement)) {
      case "start":
        coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      case "end":
        coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
    }
    return coords;
  }
  const computePosition$1 = async (reference, floating, config) => {
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware = [],
      platform: platform2
    } = config;
    const validMiddleware = middleware.filter(Boolean);
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
    let rects = await platform2.getElementRects({
      reference,
      floating,
      strategy
    });
    let {
      x,
      y
    } = computeCoordsFromPlacement(rects, placement, rtl);
    let statefulPlacement = placement;
    let middlewareData = {};
    let resetCount = 0;
    for (let i = 0; i < validMiddleware.length; i++) {
      const {
        name,
        fn
      } = validMiddleware[i];
      const {
        x: nextX,
        y: nextY,
        data,
        reset
      } = await fn({
        x,
        y,
        initialPlacement: placement,
        placement: statefulPlacement,
        strategy,
        middlewareData,
        rects,
        platform: platform2,
        elements: {
          reference,
          floating
        }
      });
      x = nextX != null ? nextX : x;
      y = nextY != null ? nextY : y;
      middlewareData = {
        ...middlewareData,
        [name]: {
          ...middlewareData[name],
          ...data
        }
      };
      if (reset && resetCount <= 50) {
        resetCount++;
        if (typeof reset === "object") {
          if (reset.placement) {
            statefulPlacement = reset.placement;
          }
          if (reset.rects) {
            rects = reset.rects === true ? await platform2.getElementRects({
              reference,
              floating,
              strategy
            }) : reset.rects;
          }
          ({
            x,
            y
          } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
        }
        i = -1;
      }
    }
    return {
      x,
      y,
      placement: statefulPlacement,
      strategy,
      middlewareData
    };
  };
  async function detectOverflow(state, options2) {
    var _await$platform$isEle;
    if (options2 === void 0) {
      options2 = {};
    }
    const {
      x,
      y,
      platform: platform2,
      rects,
      elements,
      strategy
    } = state;
    const {
      boundary = "clippingAncestors",
      rootBoundary = "viewport",
      elementContext = "floating",
      altBoundary = false,
      padding = 0
    } = evaluate(options2, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === "floating" ? "reference" : "floating";
    const element = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
      element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
      boundary,
      rootBoundary,
      strategy
    }));
    const rect = elementContext === "floating" ? {
      x,
      y,
      width: rects.floating.width,
      height: rects.floating.height
    } : rects.reference;
    const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
    const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements,
      rect,
      offsetParent,
      strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  }
  const arrow$3 = (options2) => ({
    name: "arrow",
    options: options2,
    async fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        platform: platform2,
        elements,
        middlewareData
      } = state;
      const {
        element,
        padding = 0
      } = evaluate(options2, state) || {};
      if (element == null) {
        return {};
      }
      const paddingObject = getPaddingObject(padding);
      const coords = {
        x,
        y
      };
      const axis = getAlignmentAxis(placement);
      const length = getAxisLength(axis);
      const arrowDimensions = await platform2.getDimensions(element);
      const isYAxis = axis === "y";
      const minProp = isYAxis ? "top" : "left";
      const maxProp = isYAxis ? "bottom" : "right";
      const clientProp = isYAxis ? "clientHeight" : "clientWidth";
      const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
      const startDiff = coords[axis] - rects.reference[axis];
      const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
      let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
      if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
        clientSize = elements.floating[clientProp] || rects.floating[length];
      }
      const centerToReference = endDiff / 2 - startDiff / 2;
      const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
      const minPadding = min(paddingObject[minProp], largestPossiblePadding);
      const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
      const min$1 = minPadding;
      const max2 = clientSize - arrowDimensions[length] - maxPadding;
      const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
      const offset2 = clamp$1(min$1, center, max2);
      const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
      const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
      return {
        [axis]: coords[axis] + alignmentOffset,
        data: {
          [axis]: offset2,
          centerOffset: center - offset2 - alignmentOffset,
          ...shouldAddOffset && {
            alignmentOffset
          }
        },
        reset: shouldAddOffset
      };
    }
  });
  const flip$2 = function(options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    return {
      name: "flip",
      options: options2,
      async fn(state) {
        var _middlewareData$arrow, _middlewareData$flip;
        const {
          placement,
          middlewareData,
          rects,
          initialPlacement,
          platform: platform2,
          elements
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true,
          fallbackPlacements: specifiedFallbackPlacements,
          fallbackStrategy = "bestFit",
          fallbackAxisSideDirection = "none",
          flipAlignment = true,
          ...detectOverflowOptions
        } = evaluate(options2, state);
        if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        const side = getSide(placement);
        const initialSideAxis = getSideAxis(initialPlacement);
        const isBasePlacement = getSide(initialPlacement) === initialPlacement;
        const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
        const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
        const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
        if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
          fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
        }
        const placements = [initialPlacement, ...fallbackPlacements];
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const overflows = [];
        let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
        if (checkMainAxis) {
          overflows.push(overflow[side]);
        }
        if (checkCrossAxis) {
          const sides2 = getAlignmentSides(placement, rects, rtl);
          overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
        }
        overflowsData = [...overflowsData, {
          placement,
          overflows
        }];
        if (!overflows.every((side2) => side2 <= 0)) {
          var _middlewareData$flip2, _overflowsData$filter;
          const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
          const nextPlacement = placements[nextIndex];
          if (nextPlacement) {
            const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
            if (!ignoreCrossAxisOverflow || // We leave the current main axis only if every placement on that axis
            // overflows the main axis.
            overflowsData.every((d) => d.overflows[0] > 0 && getSideAxis(d.placement) === initialSideAxis)) {
              return {
                data: {
                  index: nextIndex,
                  overflows: overflowsData
                },
                reset: {
                  placement: nextPlacement
                }
              };
            }
          }
          let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
          if (!resetPlacement) {
            switch (fallbackStrategy) {
              case "bestFit": {
                var _overflowsData$filter2;
                const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = getSideAxis(d.placement);
                    return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === "y";
                  }
                  return true;
                }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement2) {
                  resetPlacement = placement2;
                }
                break;
              }
              case "initialPlacement":
                resetPlacement = initialPlacement;
                break;
            }
          }
          if (placement !== resetPlacement) {
            return {
              reset: {
                placement: resetPlacement
              }
            };
          }
        }
        return {};
      }
    };
  };
  function getSideOffsets(overflow, rect) {
    return {
      top: overflow.top - rect.height,
      right: overflow.right - rect.width,
      bottom: overflow.bottom - rect.height,
      left: overflow.left - rect.width
    };
  }
  function isAnySideFullyClipped(overflow) {
    return sides.some((side) => overflow[side] >= 0);
  }
  const hide$2 = function(options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    return {
      name: "hide",
      options: options2,
      async fn(state) {
        const {
          rects
        } = state;
        const {
          strategy = "referenceHidden",
          ...detectOverflowOptions
        } = evaluate(options2, state);
        switch (strategy) {
          case "referenceHidden": {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: "reference"
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
          case "escaped": {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
          default: {
            return {};
          }
        }
      }
    };
  };
  async function convertValueToCoords(state, options2) {
    const {
      placement,
      platform: platform2,
      elements
    } = state;
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getSideAxis(placement) === "y";
    const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = evaluate(options2, state);
    let {
      mainAxis,
      crossAxis,
      alignmentAxis
    } = typeof rawValue === "number" ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: rawValue.mainAxis || 0,
      crossAxis: rawValue.crossAxis || 0,
      alignmentAxis: rawValue.alignmentAxis
    };
    if (alignment && typeof alignmentAxis === "number") {
      crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  }
  const offset$2 = function(options2) {
    if (options2 === void 0) {
      options2 = 0;
    }
    return {
      name: "offset",
      options: options2,
      async fn(state) {
        var _middlewareData$offse, _middlewareData$arrow;
        const {
          x,
          y,
          placement,
          middlewareData
        } = state;
        const diffCoords = await convertValueToCoords(state, options2);
        if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        return {
          x: x + diffCoords.x,
          y: y + diffCoords.y,
          data: {
            ...diffCoords,
            placement
          }
        };
      }
    };
  };
  const shift$2 = function(options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    return {
      name: "shift",
      options: options2,
      async fn(state) {
        const {
          x,
          y,
          placement
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = false,
          limiter = {
            fn: (_ref) => {
              let {
                x: x2,
                y: y2
              } = _ref;
              return {
                x: x2,
                y: y2
              };
            }
          },
          ...detectOverflowOptions
        } = evaluate(options2, state);
        const coords = {
          x,
          y
        };
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const crossAxis = getSideAxis(getSide(placement));
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        if (checkMainAxis) {
          const minSide = mainAxis === "y" ? "top" : "left";
          const maxSide = mainAxis === "y" ? "bottom" : "right";
          const min2 = mainAxisCoord + overflow[minSide];
          const max2 = mainAxisCoord - overflow[maxSide];
          mainAxisCoord = clamp$1(min2, mainAxisCoord, max2);
        }
        if (checkCrossAxis) {
          const minSide = crossAxis === "y" ? "top" : "left";
          const maxSide = crossAxis === "y" ? "bottom" : "right";
          const min2 = crossAxisCoord + overflow[minSide];
          const max2 = crossAxisCoord - overflow[maxSide];
          crossAxisCoord = clamp$1(min2, crossAxisCoord, max2);
        }
        const limitedCoords = limiter.fn({
          ...state,
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        });
        return {
          ...limitedCoords,
          data: {
            x: limitedCoords.x - x,
            y: limitedCoords.y - y,
            enabled: {
              [mainAxis]: checkMainAxis,
              [crossAxis]: checkCrossAxis
            }
          }
        };
      }
    };
  };
  const limitShift$2 = function(options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    return {
      options: options2,
      fn(state) {
        const {
          x,
          y,
          placement,
          rects,
          middlewareData
        } = state;
        const {
          offset: offset2 = 0,
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true
        } = evaluate(options2, state);
        const coords = {
          x,
          y
        };
        const crossAxis = getSideAxis(placement);
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        const rawOffset = evaluate(offset2, state);
        const computedOffset = typeof rawOffset === "number" ? {
          mainAxis: rawOffset,
          crossAxis: 0
        } : {
          mainAxis: 0,
          crossAxis: 0,
          ...rawOffset
        };
        if (checkMainAxis) {
          const len = mainAxis === "y" ? "height" : "width";
          const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
          const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
          if (mainAxisCoord < limitMin) {
            mainAxisCoord = limitMin;
          } else if (mainAxisCoord > limitMax) {
            mainAxisCoord = limitMax;
          }
        }
        if (checkCrossAxis) {
          var _middlewareData$offse, _middlewareData$offse2;
          const len = mainAxis === "y" ? "width" : "height";
          const isOriginSide = ["top", "left"].includes(getSide(placement));
          const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
          const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
          if (crossAxisCoord < limitMin) {
            crossAxisCoord = limitMin;
          } else if (crossAxisCoord > limitMax) {
            crossAxisCoord = limitMax;
          }
        }
        return {
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        };
      }
    };
  };
  const size$2 = function(options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    return {
      name: "size",
      options: options2,
      async fn(state) {
        var _state$middlewareData, _state$middlewareData2;
        const {
          placement,
          rects,
          platform: platform2,
          elements
        } = state;
        const {
          apply = () => {
          },
          ...detectOverflowOptions
        } = evaluate(options2, state);
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const side = getSide(placement);
        const alignment = getAlignment(placement);
        const isYAxis = getSideAxis(placement) === "y";
        const {
          width,
          height
        } = rects.floating;
        let heightSide;
        let widthSide;
        if (side === "top" || side === "bottom") {
          heightSide = side;
          widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
        } else {
          widthSide = side;
          heightSide = alignment === "end" ? "top" : "bottom";
        }
        const maximumClippingHeight = height - overflow.top - overflow.bottom;
        const maximumClippingWidth = width - overflow.left - overflow.right;
        const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
        const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
        const noShift = !state.middlewareData.shift;
        let availableHeight = overflowAvailableHeight;
        let availableWidth = overflowAvailableWidth;
        if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
          availableWidth = maximumClippingWidth;
        }
        if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
          availableHeight = maximumClippingHeight;
        }
        if (noShift && !alignment) {
          const xMin = max(overflow.left, 0);
          const xMax = max(overflow.right, 0);
          const yMin = max(overflow.top, 0);
          const yMax = max(overflow.bottom, 0);
          if (isYAxis) {
            availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
          } else {
            availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
          }
        }
        await apply({
          ...state,
          availableWidth,
          availableHeight
        });
        const nextDimensions = await platform2.getDimensions(elements.floating);
        if (width !== nextDimensions.width || height !== nextDimensions.height) {
          return {
            reset: {
              rects: true
            }
          };
        }
        return {};
      }
    };
  };
  function hasWindow() {
    return typeof window !== "undefined";
  }
  function getNodeName(node) {
    if (isNode(node)) {
      return (node.nodeName || "").toLowerCase();
    }
    return "#document";
  }
  function getWindow(node) {
    var _node$ownerDocument;
    return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
  }
  function getDocumentElement(node) {
    var _ref;
    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
  }
  function isNode(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Node || value instanceof getWindow(value).Node;
  }
  function isElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Element || value instanceof getWindow(value).Element;
  }
  function isHTMLElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
  }
  function isShadowRoot(value) {
    if (!hasWindow() || typeof ShadowRoot === "undefined") {
      return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
  }
  function isOverflowElement(element) {
    const {
      overflow,
      overflowX,
      overflowY,
      display
    } = getComputedStyle$1(element);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
  }
  function isTableElement(element) {
    return ["table", "td", "th"].includes(getNodeName(element));
  }
  function isTopLayer(element) {
    return [":popover-open", ":modal"].some((selector) => {
      try {
        return element.matches(selector);
      } catch (e) {
        return false;
      }
    });
  }
  function isContainingBlock(elementOrCss) {
    const webkit = isWebKit();
    const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
    return ["transform", "translate", "scale", "rotate", "perspective"].some((value) => css[value] ? css[value] !== "none" : false) || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
  }
  function getContainingBlock(element) {
    let currentNode = getParentNode(element);
    while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else if (isTopLayer(currentNode)) {
        return null;
      }
      currentNode = getParentNode(currentNode);
    }
    return null;
  }
  function isWebKit() {
    if (typeof CSS === "undefined" || !CSS.supports) return false;
    return CSS.supports("-webkit-backdrop-filter", "none");
  }
  function isLastTraversableNode(node) {
    return ["html", "body", "#document"].includes(getNodeName(node));
  }
  function getComputedStyle$1(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function getNodeScroll(element) {
    if (isElement(element)) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }
    return {
      scrollLeft: element.scrollX,
      scrollTop: element.scrollY
    };
  }
  function getParentNode(node) {
    if (getNodeName(node) === "html") {
      return node;
    }
    const result = (
      // Step into the shadow DOM of the parent of a slotted node.
      node.assignedSlot || // DOM Element detected.
      node.parentNode || // ShadowRoot detected.
      isShadowRoot(node) && node.host || // Fallback.
      getDocumentElement(node)
    );
    return isShadowRoot(result) ? result.host : result;
  }
  function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);
    if (isLastTraversableNode(parentNode)) {
      return node.ownerDocument ? node.ownerDocument.body : node.body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
  }
  function getOverflowAncestors(node, list, traverseIframes) {
    var _node$ownerDocument2;
    if (list === void 0) {
      list = [];
    }
    if (traverseIframes === void 0) {
      traverseIframes = true;
    }
    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
      const frameElement = getFrameElement(win);
      return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
    }
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
  function getFrameElement(win) {
    return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
  }
  function getCssDimensions(element) {
    const css = getComputedStyle$1(element);
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = isHTMLElement(element);
    const offsetWidth = hasOffset ? element.offsetWidth : width;
    const offsetHeight = hasOffset ? element.offsetHeight : height;
    const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
    if (shouldFallback) {
      width = offsetWidth;
      height = offsetHeight;
    }
    return {
      width,
      height,
      $: shouldFallback
    };
  }
  function unwrapElement(element) {
    return !isElement(element) ? element.contextElement : element;
  }
  function getScale(element) {
    const domElement = unwrapElement(element);
    if (!isHTMLElement(domElement)) {
      return createCoords(1);
    }
    const rect = domElement.getBoundingClientRect();
    const {
      width,
      height,
      $
    } = getCssDimensions(domElement);
    let x = ($ ? round(rect.width) : rect.width) / width;
    let y = ($ ? round(rect.height) : rect.height) / height;
    if (!x || !Number.isFinite(x)) {
      x = 1;
    }
    if (!y || !Number.isFinite(y)) {
      y = 1;
    }
    return {
      x,
      y
    };
  }
  const noOffsets = /* @__PURE__ */ createCoords(0);
  function getVisualOffsets(element) {
    const win = getWindow(element);
    if (!isWebKit() || !win.visualViewport) {
      return noOffsets;
    }
    return {
      x: win.visualViewport.offsetLeft,
      y: win.visualViewport.offsetTop
    };
  }
  function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
      return false;
    }
    return isFixed;
  }
  function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    const clientRect = element.getBoundingClientRect();
    const domElement = unwrapElement(element);
    let scale = createCoords(1);
    if (includeScale) {
      if (offsetParent) {
        if (isElement(offsetParent)) {
          scale = getScale(offsetParent);
        }
      } else {
        scale = getScale(element);
      }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
    let x = (clientRect.left + visualOffsets.x) / scale.x;
    let y = (clientRect.top + visualOffsets.y) / scale.y;
    let width = clientRect.width / scale.x;
    let height = clientRect.height / scale.y;
    if (domElement) {
      const win = getWindow(domElement);
      const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
      let currentWin = win;
      let currentIFrame = getFrameElement(currentWin);
      while (currentIFrame && offsetParent && offsetWin !== currentWin) {
        const iframeScale = getScale(currentIFrame);
        const iframeRect = currentIFrame.getBoundingClientRect();
        const css = getComputedStyle$1(currentIFrame);
        const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
        const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
        x *= iframeScale.x;
        y *= iframeScale.y;
        width *= iframeScale.x;
        height *= iframeScale.y;
        x += left;
        y += top;
        currentWin = getWindow(currentIFrame);
        currentIFrame = getFrameElement(currentWin);
      }
    }
    return rectToClientRect({
      width,
      height,
      x,
      y
    });
  }
  function getWindowScrollBarX(element, rect) {
    const leftScroll = getNodeScroll(element).scrollLeft;
    if (!rect) {
      return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
    }
    return rect.left + leftScroll;
  }
  function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
    if (ignoreScrollbarX === void 0) {
      ignoreScrollbarX = false;
    }
    const htmlRect = documentElement.getBoundingClientRect();
    const x = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 : (
      // RTL <body> scrollbar.
      getWindowScrollBarX(documentElement, htmlRect)
    ));
    const y = htmlRect.top + scroll.scrollTop;
    return {
      x,
      y
    };
  }
  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {
      elements,
      rect,
      offsetParent,
      strategy
    } = _ref;
    const isFixed = strategy === "fixed";
    const documentElement = getDocumentElement(offsetParent);
    const topLayer = elements ? isTopLayer(elements.floating) : false;
    if (offsetParent === documentElement || topLayer && isFixed) {
      return rect;
    }
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    let scale = createCoords(1);
    const offsets = createCoords(0);
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        const offsetRect = getBoundingClientRect(offsetParent);
        scale = getScale(offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : createCoords(0);
    return {
      width: rect.width * scale.x,
      height: rect.height * scale.y,
      x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
      y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
    };
  }
  function getClientRects(element) {
    return Array.from(element.getClientRects());
  }
  function getDocumentRect(element) {
    const html = getDocumentElement(element);
    const scroll = getNodeScroll(element);
    const body = element.ownerDocument.body;
    const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
    const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
    let x = -scroll.scrollLeft + getWindowScrollBarX(element);
    const y = -scroll.scrollTop;
    if (getComputedStyle$1(body).direction === "rtl") {
      x += max(html.clientWidth, body.clientWidth) - width;
    }
    return {
      width,
      height,
      x,
      y
    };
  }
  function getViewportRect(element, strategy) {
    const win = getWindow(element);
    const html = getDocumentElement(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x = 0;
    let y = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      const visualViewportBased = isWebKit();
      if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
    return {
      width,
      height,
      x,
      y
    };
  }
  function getInnerBoundingClientRect(element, strategy) {
    const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
    const width = element.clientWidth * scale.x;
    const height = element.clientHeight * scale.y;
    const x = left * scale.x;
    const y = top * scale.y;
    return {
      width,
      height,
      x,
      y
    };
  }
  function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === "viewport") {
      rect = getViewportRect(element, strategy);
    } else if (clippingAncestor === "document") {
      rect = getDocumentRect(getDocumentElement(element));
    } else if (isElement(clippingAncestor)) {
      rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
      const visualOffsets = getVisualOffsets(element);
      rect = {
        x: clippingAncestor.x - visualOffsets.x,
        y: clippingAncestor.y - visualOffsets.y,
        width: clippingAncestor.width,
        height: clippingAncestor.height
      };
    }
    return rectToClientRect(rect);
  }
  function hasFixedPositionAncestor(element, stopNode) {
    const parentNode = getParentNode(element);
    if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
      return false;
    }
    return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
  }
  function getClippingElementAncestors(element, cache) {
    const cachedResult = cache.get(element);
    if (cachedResult) {
      return cachedResult;
    }
    let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
    let currentContainingBlockComputedStyle = null;
    const elementIsFixed = getComputedStyle$1(element).position === "fixed";
    let currentNode = elementIsFixed ? getParentNode(element) : element;
    while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
      const computedStyle = getComputedStyle$1(currentNode);
      const currentNodeIsContaining = isContainingBlock(currentNode);
      if (!currentNodeIsContaining && computedStyle.position === "fixed") {
        currentContainingBlockComputedStyle = null;
      }
      const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
      if (shouldDropCurrentNode) {
        result = result.filter((ancestor) => ancestor !== currentNode);
      } else {
        currentContainingBlockComputedStyle = computedStyle;
      }
      currentNode = getParentNode(currentNode);
    }
    cache.set(element, result);
    return result;
  }
  function getClippingRect(_ref) {
    let {
      element,
      boundary,
      rootBoundary,
      strategy
    } = _ref;
    const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
    const clippingAncestors = [...elementClippingAncestors, rootBoundary];
    const firstClippingAncestor = clippingAncestors[0];
    const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
      const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
    return {
      width: clippingRect.right - clippingRect.left,
      height: clippingRect.bottom - clippingRect.top,
      x: clippingRect.left,
      y: clippingRect.top
    };
  }
  function getDimensions(element) {
    const {
      width,
      height
    } = getCssDimensions(element);
    return {
      width,
      height
    };
  }
  function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const isFixed = strategy === "fixed";
    const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = createCoords(0);
    function setLeftRTLScrollbarOffset() {
      offsets.x = getWindowScrollBarX(documentElement);
    }
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } else if (documentElement) {
        setLeftRTLScrollbarOffset();
      }
    }
    if (isFixed && !isOffsetParentAnElement && documentElement) {
      setLeftRTLScrollbarOffset();
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
    const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
    return {
      x,
      y,
      width: rect.width,
      height: rect.height
    };
  }
  function isStaticPositioned(element) {
    return getComputedStyle$1(element).position === "static";
  }
  function getTrueOffsetParent(element, polyfill) {
    if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
      return null;
    }
    if (polyfill) {
      return polyfill(element);
    }
    let rawOffsetParent = element.offsetParent;
    if (getDocumentElement(element) === rawOffsetParent) {
      rawOffsetParent = rawOffsetParent.ownerDocument.body;
    }
    return rawOffsetParent;
  }
  function getOffsetParent(element, polyfill) {
    const win = getWindow(element);
    if (isTopLayer(element)) {
      return win;
    }
    if (!isHTMLElement(element)) {
      let svgOffsetParent = getParentNode(element);
      while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
        if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
          return svgOffsetParent;
        }
        svgOffsetParent = getParentNode(svgOffsetParent);
      }
      return win;
    }
    let offsetParent = getTrueOffsetParent(element, polyfill);
    while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
      offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
      return win;
    }
    return offsetParent || getContainingBlock(element) || win;
  }
  const getElementRects = async function(data) {
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    const floatingDimensions = await getDimensionsFn(data.floating);
    return {
      reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
      floating: {
        x: 0,
        y: 0,
        width: floatingDimensions.width,
        height: floatingDimensions.height
      }
    };
  };
  function isRTL(element) {
    return getComputedStyle$1(element).direction === "rtl";
  }
  const platform = {
    convertOffsetParentRelativeRectToViewportRelativeRect,
    getDocumentElement,
    getClippingRect,
    getOffsetParent,
    getElementRects,
    getClientRects,
    getDimensions,
    getScale,
    isElement,
    isRTL
  };
  function rectsAreEqual(a, b) {
    return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
  }
  function observeMove(element, onMove) {
    let io = null;
    let timeoutId;
    const root = getDocumentElement(element);
    function cleanup() {
      var _io;
      clearTimeout(timeoutId);
      (_io = io) == null || _io.disconnect();
      io = null;
    }
    function refresh(skip, threshold) {
      if (skip === void 0) {
        skip = false;
      }
      if (threshold === void 0) {
        threshold = 1;
      }
      cleanup();
      const elementRectForRootMargin = element.getBoundingClientRect();
      const {
        left,
        top,
        width,
        height
      } = elementRectForRootMargin;
      if (!skip) {
        onMove();
      }
      if (!width || !height) {
        return;
      }
      const insetTop = floor(top);
      const insetRight = floor(root.clientWidth - (left + width));
      const insetBottom = floor(root.clientHeight - (top + height));
      const insetLeft = floor(left);
      const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
      const options2 = {
        rootMargin,
        threshold: max(0, min(1, threshold)) || 1
      };
      let isFirstUpdate = true;
      function handleObserve(entries) {
        const ratio = entries[0].intersectionRatio;
        if (ratio !== threshold) {
          if (!isFirstUpdate) {
            return refresh();
          }
          if (!ratio) {
            timeoutId = setTimeout(() => {
              refresh(false, 1e-7);
            }, 1e3);
          } else {
            refresh(false, ratio);
          }
        }
        if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
          refresh();
        }
        isFirstUpdate = false;
      }
      try {
        io = new IntersectionObserver(handleObserve, {
          ...options2,
          // Handle <iframe>s
          root: root.ownerDocument
        });
      } catch (_e2) {
        io = new IntersectionObserver(handleObserve, options2);
      }
      io.observe(element);
    }
    refresh(true);
    return cleanup;
  }
  function autoUpdate(reference, floating, update, options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    const {
      ancestorScroll = true,
      ancestorResize = true,
      elementResize = typeof ResizeObserver === "function",
      layoutShift = typeof IntersectionObserver === "function",
      animationFrame = false
    } = options2;
    const referenceEl = unwrapElement(reference);
    const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.addEventListener("scroll", update, {
        passive: true
      });
      ancestorResize && ancestor.addEventListener("resize", update);
    });
    const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
    let reobserveFrame = -1;
    let resizeObserver = null;
    if (elementResize) {
      resizeObserver = new ResizeObserver((_ref) => {
        let [firstEntry] = _ref;
        if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
          resizeObserver.unobserve(floating);
          cancelAnimationFrame(reobserveFrame);
          reobserveFrame = requestAnimationFrame(() => {
            var _resizeObserver;
            (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
          });
        }
        update();
      });
      if (referenceEl && !animationFrame) {
        resizeObserver.observe(referenceEl);
      }
      resizeObserver.observe(floating);
    }
    let frameId;
    let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
    if (animationFrame) {
      frameLoop();
    }
    function frameLoop() {
      const nextRefRect = getBoundingClientRect(reference);
      if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
        update();
      }
      prevRefRect = nextRefRect;
      frameId = requestAnimationFrame(frameLoop);
    }
    update();
    return () => {
      var _resizeObserver2;
      ancestors.forEach((ancestor) => {
        ancestorScroll && ancestor.removeEventListener("scroll", update);
        ancestorResize && ancestor.removeEventListener("resize", update);
      });
      cleanupIo == null || cleanupIo();
      (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
      resizeObserver = null;
      if (animationFrame) {
        cancelAnimationFrame(frameId);
      }
    };
  }
  const offset$1 = offset$2;
  const shift$1 = shift$2;
  const flip$1 = flip$2;
  const size$1 = size$2;
  const hide$1 = hide$2;
  const arrow$2 = arrow$3;
  const limitShift$1 = limitShift$2;
  const computePosition = (reference, floating, options2) => {
    const cache = /* @__PURE__ */ new Map();
    const mergedOptions = {
      platform,
      ...options2
    };
    const platformWithCache = {
      ...mergedOptions.platform,
      _c: cache
    };
    return computePosition$1(reference, floating, {
      ...mergedOptions,
      platform: platformWithCache
    });
  };
  var isClient = typeof document !== "undefined";
  var noop$1 = function noop2() {
  };
  var index = isClient ? React$1.useLayoutEffect : noop$1;
  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }
    if (typeof a !== typeof b) {
      return false;
    }
    if (typeof a === "function" && a.toString() === b.toString()) {
      return true;
    }
    let length;
    let i;
    let keys;
    if (a && b && typeof a === "object") {
      if (Array.isArray(a)) {
        length = a.length;
        if (length !== b.length) return false;
        for (i = length; i-- !== 0; ) {
          if (!deepEqual(a[i], b[i])) {
            return false;
          }
        }
        return true;
      }
      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) {
        return false;
      }
      for (i = length; i-- !== 0; ) {
        if (!{}.hasOwnProperty.call(b, keys[i])) {
          return false;
        }
      }
      for (i = length; i-- !== 0; ) {
        const key = keys[i];
        if (key === "_owner" && a.$$typeof) {
          continue;
        }
        if (!deepEqual(a[key], b[key])) {
          return false;
        }
      }
      return true;
    }
    return a !== a && b !== b;
  }
  function getDPR(element) {
    if (typeof window === "undefined") {
      return 1;
    }
    const win = element.ownerDocument.defaultView || window;
    return win.devicePixelRatio || 1;
  }
  function roundByDPR(element, value) {
    const dpr = getDPR(element);
    return Math.round(value * dpr) / dpr;
  }
  function useLatestRef(value) {
    const ref = React__namespace.useRef(value);
    index(() => {
      ref.current = value;
    });
    return ref;
  }
  function useFloating(options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware = [],
      platform: platform2,
      elements: {
        reference: externalReference,
        floating: externalFloating
      } = {},
      transform = true,
      whileElementsMounted,
      open
    } = options2;
    const [data, setData] = React__namespace.useState({
      x: 0,
      y: 0,
      strategy,
      placement,
      middlewareData: {},
      isPositioned: false
    });
    const [latestMiddleware, setLatestMiddleware] = React__namespace.useState(middleware);
    if (!deepEqual(latestMiddleware, middleware)) {
      setLatestMiddleware(middleware);
    }
    const [_reference, _setReference] = React__namespace.useState(null);
    const [_floating, _setFloating] = React__namespace.useState(null);
    const setReference = React__namespace.useCallback((node) => {
      if (node !== referenceRef.current) {
        referenceRef.current = node;
        _setReference(node);
      }
    }, []);
    const setFloating = React__namespace.useCallback((node) => {
      if (node !== floatingRef.current) {
        floatingRef.current = node;
        _setFloating(node);
      }
    }, []);
    const referenceEl = externalReference || _reference;
    const floatingEl = externalFloating || _floating;
    const referenceRef = React__namespace.useRef(null);
    const floatingRef = React__namespace.useRef(null);
    const dataRef = React__namespace.useRef(data);
    const hasWhileElementsMounted = whileElementsMounted != null;
    const whileElementsMountedRef = useLatestRef(whileElementsMounted);
    const platformRef = useLatestRef(platform2);
    const openRef = useLatestRef(open);
    const update = React__namespace.useCallback(() => {
      if (!referenceRef.current || !floatingRef.current) {
        return;
      }
      const config = {
        placement,
        strategy,
        middleware: latestMiddleware
      };
      if (platformRef.current) {
        config.platform = platformRef.current;
      }
      computePosition(referenceRef.current, floatingRef.current, config).then((data2) => {
        const fullData = {
          ...data2,
          // The floating element's position may be recomputed while it's closed
          // but still mounted (such as when transitioning out). To ensure
          // `isPositioned` will be `false` initially on the next open, avoid
          // setting it to `true` when `open === false` (must be specified).
          isPositioned: openRef.current !== false
        };
        if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
          dataRef.current = fullData;
          ReactDOM__namespace.flushSync(() => {
            setData(fullData);
          });
        }
      });
    }, [latestMiddleware, placement, strategy, platformRef, openRef]);
    index(() => {
      if (open === false && dataRef.current.isPositioned) {
        dataRef.current.isPositioned = false;
        setData((data2) => ({
          ...data2,
          isPositioned: false
        }));
      }
    }, [open]);
    const isMountedRef = React__namespace.useRef(false);
    index(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    index(() => {
      if (referenceEl) referenceRef.current = referenceEl;
      if (floatingEl) floatingRef.current = floatingEl;
      if (referenceEl && floatingEl) {
        if (whileElementsMountedRef.current) {
          return whileElementsMountedRef.current(referenceEl, floatingEl, update);
        }
        update();
      }
    }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
    const refs = React__namespace.useMemo(() => ({
      reference: referenceRef,
      floating: floatingRef,
      setReference,
      setFloating
    }), [setReference, setFloating]);
    const elements = React__namespace.useMemo(() => ({
      reference: referenceEl,
      floating: floatingEl
    }), [referenceEl, floatingEl]);
    const floatingStyles = React__namespace.useMemo(() => {
      const initialStyles = {
        position: strategy,
        left: 0,
        top: 0
      };
      if (!elements.floating) {
        return initialStyles;
      }
      const x = roundByDPR(elements.floating, data.x);
      const y = roundByDPR(elements.floating, data.y);
      if (transform) {
        return {
          ...initialStyles,
          transform: "translate(" + x + "px, " + y + "px)",
          ...getDPR(elements.floating) >= 1.5 && {
            willChange: "transform"
          }
        };
      }
      return {
        position: strategy,
        left: x,
        top: y
      };
    }, [strategy, transform, elements.floating, data.x, data.y]);
    return React__namespace.useMemo(() => ({
      ...data,
      update,
      refs,
      elements,
      floatingStyles
    }), [data, update, refs, elements, floatingStyles]);
  }
  const arrow$1 = (options2) => {
    function isRef(value) {
      return {}.hasOwnProperty.call(value, "current");
    }
    return {
      name: "arrow",
      options: options2,
      fn(state) {
        const {
          element,
          padding
        } = typeof options2 === "function" ? options2(state) : options2;
        if (element && isRef(element)) {
          if (element.current != null) {
            return arrow$2({
              element: element.current,
              padding
            }).fn(state);
          }
          return {};
        }
        if (element) {
          return arrow$2({
            element,
            padding
          }).fn(state);
        }
        return {};
      }
    };
  };
  const offset = (options2, deps) => ({
    ...offset$1(options2),
    options: [options2, deps]
  });
  const shift = (options2, deps) => ({
    ...shift$1(options2),
    options: [options2, deps]
  });
  const limitShift = (options2, deps) => ({
    ...limitShift$1(options2),
    options: [options2, deps]
  });
  const flip = (options2, deps) => ({
    ...flip$1(options2),
    options: [options2, deps]
  });
  const size = (options2, deps) => ({
    ...size$1(options2),
    options: [options2, deps]
  });
  const hide = (options2, deps) => ({
    ...hide$1(options2),
    options: [options2, deps]
  });
  const arrow = (options2, deps) => ({
    ...arrow$1(options2),
    options: [options2, deps]
  });
  var NAME$2 = "Arrow";
  var Arrow$1 = React__namespace.forwardRef((props, forwardedRef) => {
    const { children, width = 10, height = 5, ...arrowProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.svg,
      {
        ...arrowProps,
        ref: forwardedRef,
        width,
        height,
        viewBox: "0 0 30 10",
        preserveAspectRatio: "none",
        children: props.asChild ? children : /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "0,0 30,0 15,10" })
      }
    );
  });
  Arrow$1.displayName = NAME$2;
  var Root$8 = Arrow$1;
  function useSize(element) {
    const [size2, setSize] = React__namespace.useState(void 0);
    useLayoutEffect2(() => {
      if (element) {
        setSize({ width: element.offsetWidth, height: element.offsetHeight });
        const resizeObserver = new ResizeObserver((entries) => {
          if (!Array.isArray(entries)) {
            return;
          }
          if (!entries.length) {
            return;
          }
          const entry = entries[0];
          let width;
          let height;
          if ("borderBoxSize" in entry) {
            const borderSizeEntry = entry["borderBoxSize"];
            const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
            width = borderSize["inlineSize"];
            height = borderSize["blockSize"];
          } else {
            width = element.offsetWidth;
            height = element.offsetHeight;
          }
          setSize({ width, height });
        });
        resizeObserver.observe(element, { box: "border-box" });
        return () => resizeObserver.unobserve(element);
      } else {
        setSize(void 0);
      }
    }, [element]);
    return size2;
  }
  var POPPER_NAME = "Popper";
  var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
  var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
  var Popper = (props) => {
    const { __scopePopper, children } = props;
    const [anchor, setAnchor] = React__namespace.useState(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PopperProvider, { scope: __scopePopper, anchor, onAnchorChange: setAnchor, children });
  };
  Popper.displayName = POPPER_NAME;
  var ANCHOR_NAME = "PopperAnchor";
  var PopperAnchor = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopePopper, virtualRef, ...anchorProps } = props;
      const context = usePopperContext(ANCHOR_NAME, __scopePopper);
      const ref = React__namespace.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      React__namespace.useEffect(() => {
        context.onAnchorChange((virtualRef == null ? void 0 : virtualRef.current) || ref.current);
      });
      return virtualRef ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...anchorProps, ref: composedRefs });
    }
  );
  PopperAnchor.displayName = ANCHOR_NAME;
  var CONTENT_NAME$5 = "PopperContent";
  var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME$5);
  var PopperContent = React__namespace.forwardRef(
    (props, forwardedRef) => {
      var _a2, _b2, _c2, _d2, _e2, _f2;
      const {
        __scopePopper,
        side = "bottom",
        sideOffset = 0,
        align = "center",
        alignOffset = 0,
        arrowPadding = 0,
        avoidCollisions = true,
        collisionBoundary = [],
        collisionPadding: collisionPaddingProp = 0,
        sticky = "partial",
        hideWhenDetached = false,
        updatePositionStrategy = "optimized",
        onPlaced,
        ...contentProps
      } = props;
      const context = usePopperContext(CONTENT_NAME$5, __scopePopper);
      const [content, setContent] = React__namespace.useState(null);
      const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
      const [arrow$12, setArrow] = React__namespace.useState(null);
      const arrowSize = useSize(arrow$12);
      const arrowWidth = (arrowSize == null ? void 0 : arrowSize.width) ?? 0;
      const arrowHeight = (arrowSize == null ? void 0 : arrowSize.height) ?? 0;
      const desiredPlacement = side + (align !== "center" ? "-" + align : "");
      const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };
      const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
      const hasExplicitBoundaries = boundary.length > 0;
      const detectOverflowOptions = {
        padding: collisionPadding,
        boundary: boundary.filter(isNotNull),
        // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
        altBoundary: hasExplicitBoundaries
      };
      const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
        // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
        strategy: "fixed",
        placement: desiredPlacement,
        whileElementsMounted: (...args) => {
          const cleanup = autoUpdate(...args, {
            animationFrame: updatePositionStrategy === "always"
          });
          return cleanup;
        },
        elements: {
          reference: context.anchor
        },
        middleware: [
          offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
          avoidCollisions && shift({
            mainAxis: true,
            crossAxis: false,
            limiter: sticky === "partial" ? limitShift() : void 0,
            ...detectOverflowOptions
          }),
          avoidCollisions && flip({ ...detectOverflowOptions }),
          size({
            ...detectOverflowOptions,
            apply: ({ elements, rects, availableWidth, availableHeight }) => {
              const { width: anchorWidth, height: anchorHeight } = rects.reference;
              const contentStyle = elements.floating.style;
              contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
              contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
              contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
              contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
            }
          }),
          arrow$12 && arrow({ element: arrow$12, padding: arrowPadding }),
          transformOrigin({ arrowWidth, arrowHeight }),
          hideWhenDetached && hide({ strategy: "referenceHidden", ...detectOverflowOptions })
        ]
      });
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const handlePlaced = useCallbackRef$1(onPlaced);
      useLayoutEffect2(() => {
        if (isPositioned) {
          handlePlaced == null ? void 0 : handlePlaced();
        }
      }, [isPositioned, handlePlaced]);
      const arrowX = (_a2 = middlewareData.arrow) == null ? void 0 : _a2.x;
      const arrowY = (_b2 = middlewareData.arrow) == null ? void 0 : _b2.y;
      const cannotCenterArrow = ((_c2 = middlewareData.arrow) == null ? void 0 : _c2.centerOffset) !== 0;
      const [contentZIndex, setContentZIndex] = React__namespace.useState();
      useLayoutEffect2(() => {
        if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
      }, [content]);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: refs.setFloating,
          "data-radix-popper-content-wrapper": "",
          style: {
            ...floatingStyles,
            transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
            // keep off the page when measuring
            minWidth: "max-content",
            zIndex: contentZIndex,
            ["--radix-popper-transform-origin"]: [
              (_d2 = middlewareData.transformOrigin) == null ? void 0 : _d2.x,
              (_e2 = middlewareData.transformOrigin) == null ? void 0 : _e2.y
            ].join(" "),
            // hide the content if using the hide middleware and should be hidden
            // set visibility to hidden and disable pointer events so the UI behaves
            // as if the PopperContent isn't there at all
            ...((_f2 = middlewareData.hide) == null ? void 0 : _f2.referenceHidden) && {
              visibility: "hidden",
              pointerEvents: "none"
            }
          },
          dir: props.dir,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            PopperContentProvider,
            {
              scope: __scopePopper,
              placedSide,
              onArrowChange: setArrow,
              arrowX,
              arrowY,
              shouldHideArrow: cannotCenterArrow,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Primitive.div,
                {
                  "data-side": placedSide,
                  "data-align": placedAlign,
                  ...contentProps,
                  ref: composedRefs,
                  style: {
                    ...contentProps.style,
                    // if the PopperContent hasn't been placed yet (not all measurements done)
                    // we prevent animations so that users's animation don't kick in too early referring wrong sides
                    animation: !isPositioned ? "none" : void 0
                  }
                }
              )
            }
          )
        }
      );
    }
  );
  PopperContent.displayName = CONTENT_NAME$5;
  var ARROW_NAME$2 = "PopperArrow";
  var OPPOSITE_SIDE = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
  };
  var PopperArrow = React__namespace.forwardRef(function PopperArrow2(props, forwardedRef) {
    const { __scopePopper, ...arrowProps } = props;
    const contentContext = useContentContext(ARROW_NAME$2, __scopePopper);
    const baseSide = OPPOSITE_SIDE[contentContext.placedSide];
    return (
      // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
      // doesn't report size as we'd expect on SVG elements.
      // it reports their bounding box which is effectively the largest path inside the SVG.
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          ref: contentContext.onArrowChange,
          style: {
            position: "absolute",
            left: contentContext.arrowX,
            top: contentContext.arrowY,
            [baseSide]: 0,
            transformOrigin: {
              top: "",
              right: "0 0",
              bottom: "center 0",
              left: "100% 0"
            }[contentContext.placedSide],
            transform: {
              top: "translateY(100%)",
              right: "translateY(50%) rotate(90deg) translateX(-50%)",
              bottom: `rotate(180deg)`,
              left: "translateY(50%) rotate(-90deg) translateX(50%)"
            }[contentContext.placedSide],
            visibility: contentContext.shouldHideArrow ? "hidden" : void 0
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Root$8,
            {
              ...arrowProps,
              ref: forwardedRef,
              style: {
                ...arrowProps.style,
                // ensures the element can be measured correctly (mostly for if SVG)
                display: "block"
              }
            }
          )
        }
      )
    );
  });
  PopperArrow.displayName = ARROW_NAME$2;
  function isNotNull(value) {
    return value !== null;
  }
  var transformOrigin = (options2) => ({
    name: "transformOrigin",
    options: options2,
    fn(data) {
      var _a2, _b2, _c2;
      const { placement, rects, middlewareData } = data;
      const cannotCenterArrow = ((_a2 = middlewareData.arrow) == null ? void 0 : _a2.centerOffset) !== 0;
      const isArrowHidden = cannotCenterArrow;
      const arrowWidth = isArrowHidden ? 0 : options2.arrowWidth;
      const arrowHeight = isArrowHidden ? 0 : options2.arrowHeight;
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
      const arrowXCenter = (((_b2 = middlewareData.arrow) == null ? void 0 : _b2.x) ?? 0) + arrowWidth / 2;
      const arrowYCenter = (((_c2 = middlewareData.arrow) == null ? void 0 : _c2.y) ?? 0) + arrowHeight / 2;
      let x = "";
      let y = "";
      if (placedSide === "bottom") {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${-arrowHeight}px`;
      } else if (placedSide === "top") {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${rects.floating.height + arrowHeight}px`;
      } else if (placedSide === "right") {
        x = `${-arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      } else if (placedSide === "left") {
        x = `${rects.floating.width + arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      }
      return { data: { x, y } };
    }
  });
  function getSideAndAlignFromPlacement(placement) {
    const [side, align = "center"] = placement.split("-");
    return [side, align];
  }
  var Root2$3 = Popper;
  var Anchor = PopperAnchor;
  var Content$2 = PopperContent;
  var Arrow = PopperArrow;
  var [createTooltipContext, createTooltipScope] = createContextScope("Tooltip", [
    createPopperScope
  ]);
  var usePopperScope$1 = createPopperScope();
  var PROVIDER_NAME = "TooltipProvider";
  var DEFAULT_DELAY_DURATION = 700;
  var TOOLTIP_OPEN = "tooltip.open";
  var [TooltipProviderContextProvider, useTooltipProviderContext] = createTooltipContext(PROVIDER_NAME);
  var TooltipProvider$1 = (props) => {
    const {
      __scopeTooltip,
      delayDuration = DEFAULT_DELAY_DURATION,
      skipDelayDuration = 300,
      disableHoverableContent = false,
      children
    } = props;
    const isOpenDelayedRef = React__namespace.useRef(true);
    const isPointerInTransitRef = React__namespace.useRef(false);
    const skipDelayTimerRef = React__namespace.useRef(0);
    React__namespace.useEffect(() => {
      const skipDelayTimer = skipDelayTimerRef.current;
      return () => window.clearTimeout(skipDelayTimer);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TooltipProviderContextProvider,
      {
        scope: __scopeTooltip,
        isOpenDelayedRef,
        delayDuration,
        onOpen: React__namespace.useCallback(() => {
          window.clearTimeout(skipDelayTimerRef.current);
          isOpenDelayedRef.current = false;
        }, []),
        onClose: React__namespace.useCallback(() => {
          window.clearTimeout(skipDelayTimerRef.current);
          skipDelayTimerRef.current = window.setTimeout(
            () => isOpenDelayedRef.current = true,
            skipDelayDuration
          );
        }, [skipDelayDuration]),
        isPointerInTransitRef,
        onPointerInTransitChange: React__namespace.useCallback((inTransit) => {
          isPointerInTransitRef.current = inTransit;
        }, []),
        disableHoverableContent,
        children
      }
    );
  };
  TooltipProvider$1.displayName = PROVIDER_NAME;
  var TOOLTIP_NAME = "Tooltip";
  var [TooltipContextProvider, useTooltipContext] = createTooltipContext(TOOLTIP_NAME);
  var TRIGGER_NAME$5 = "TooltipTrigger";
  var TooltipTrigger = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeTooltip, ...triggerProps } = props;
      const context = useTooltipContext(TRIGGER_NAME$5, __scopeTooltip);
      const providerContext = useTooltipProviderContext(TRIGGER_NAME$5, __scopeTooltip);
      const popperScope = usePopperScope$1(__scopeTooltip);
      const ref = React__namespace.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref, context.onTriggerChange);
      const isPointerDownRef = React__namespace.useRef(false);
      const hasPointerMoveOpenedRef = React__namespace.useRef(false);
      const handlePointerUp = React__namespace.useCallback(() => isPointerDownRef.current = false, []);
      React__namespace.useEffect(() => {
        return () => document.removeEventListener("pointerup", handlePointerUp);
      }, [handlePointerUp]);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          "aria-describedby": context.open ? context.contentId : void 0,
          "data-state": context.stateAttribute,
          ...triggerProps,
          ref: composedRefs,
          onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
            if (event.pointerType === "touch") return;
            if (!hasPointerMoveOpenedRef.current && !providerContext.isPointerInTransitRef.current) {
              context.onTriggerEnter();
              hasPointerMoveOpenedRef.current = true;
            }
          }),
          onPointerLeave: composeEventHandlers(props.onPointerLeave, () => {
            context.onTriggerLeave();
            hasPointerMoveOpenedRef.current = false;
          }),
          onPointerDown: composeEventHandlers(props.onPointerDown, () => {
            if (context.open) {
              context.onClose();
            }
            isPointerDownRef.current = true;
            document.addEventListener("pointerup", handlePointerUp, { once: true });
          }),
          onFocus: composeEventHandlers(props.onFocus, () => {
            if (!isPointerDownRef.current) context.onOpen();
          }),
          onBlur: composeEventHandlers(props.onBlur, context.onClose),
          onClick: composeEventHandlers(props.onClick, context.onClose)
        }
      ) });
    }
  );
  TooltipTrigger.displayName = TRIGGER_NAME$5;
  var PORTAL_NAME$1 = "TooltipPortal";
  var [PortalProvider, usePortalContext] = createTooltipContext(PORTAL_NAME$1, {
    forceMount: void 0
  });
  var CONTENT_NAME$4 = "TooltipContent";
  var TooltipContent$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const portalContext = usePortalContext(CONTENT_NAME$4, props.__scopeTooltip);
      const { forceMount = portalContext.forceMount, side = "top", ...contentProps } = props;
      const context = useTooltipContext(CONTENT_NAME$4, props.__scopeTooltip);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.disableHoverableContent ? /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentImpl, { side, ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentHoverable, { side, ...contentProps, ref: forwardedRef }) });
    }
  );
  var TooltipContentHoverable = React__namespace.forwardRef((props, forwardedRef) => {
    const context = useTooltipContext(CONTENT_NAME$4, props.__scopeTooltip);
    const providerContext = useTooltipProviderContext(CONTENT_NAME$4, props.__scopeTooltip);
    const ref = React__namespace.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const [pointerGraceArea, setPointerGraceArea] = React__namespace.useState(null);
    const { trigger, onClose } = context;
    const content = ref.current;
    const { onPointerInTransitChange } = providerContext;
    const handleRemoveGraceArea = React__namespace.useCallback(() => {
      setPointerGraceArea(null);
      onPointerInTransitChange(false);
    }, [onPointerInTransitChange]);
    const handleCreateGraceArea = React__namespace.useCallback(
      (event, hoverTarget) => {
        const currentTarget = event.currentTarget;
        const exitPoint = { x: event.clientX, y: event.clientY };
        const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
        const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
        const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
        const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
        setPointerGraceArea(graceArea);
        onPointerInTransitChange(true);
      },
      [onPointerInTransitChange]
    );
    React__namespace.useEffect(() => {
      return () => handleRemoveGraceArea();
    }, [handleRemoveGraceArea]);
    React__namespace.useEffect(() => {
      if (trigger && content) {
        const handleTriggerLeave = (event) => handleCreateGraceArea(event, content);
        const handleContentLeave = (event) => handleCreateGraceArea(event, trigger);
        trigger.addEventListener("pointerleave", handleTriggerLeave);
        content.addEventListener("pointerleave", handleContentLeave);
        return () => {
          trigger.removeEventListener("pointerleave", handleTriggerLeave);
          content.removeEventListener("pointerleave", handleContentLeave);
        };
      }
    }, [trigger, content, handleCreateGraceArea, handleRemoveGraceArea]);
    React__namespace.useEffect(() => {
      if (pointerGraceArea) {
        const handleTrackPointerGrace = (event) => {
          const target = event.target;
          const pointerPosition = { x: event.clientX, y: event.clientY };
          const hasEnteredTarget = (trigger == null ? void 0 : trigger.contains(target)) || (content == null ? void 0 : content.contains(target));
          const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);
          if (hasEnteredTarget) {
            handleRemoveGraceArea();
          } else if (isPointerOutsideGraceArea) {
            handleRemoveGraceArea();
            onClose();
          }
        };
        document.addEventListener("pointermove", handleTrackPointerGrace);
        return () => document.removeEventListener("pointermove", handleTrackPointerGrace);
      }
    }, [trigger, content, pointerGraceArea, onClose, handleRemoveGraceArea]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentImpl, { ...props, ref: composedRefs });
  });
  var [VisuallyHiddenContentContextProvider, useVisuallyHiddenContentContext] = createTooltipContext(TOOLTIP_NAME, { isInside: false });
  var Slottable = /* @__PURE__ */ createSlottable("TooltipContent");
  var TooltipContentImpl = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeTooltip,
        children,
        "aria-label": ariaLabel,
        onEscapeKeyDown,
        onPointerDownOutside,
        ...contentProps
      } = props;
      const context = useTooltipContext(CONTENT_NAME$4, __scopeTooltip);
      const popperScope = usePopperScope$1(__scopeTooltip);
      const { onClose } = context;
      React__namespace.useEffect(() => {
        document.addEventListener(TOOLTIP_OPEN, onClose);
        return () => document.removeEventListener(TOOLTIP_OPEN, onClose);
      }, [onClose]);
      React__namespace.useEffect(() => {
        if (context.trigger) {
          const handleScroll2 = (event) => {
            const target = event.target;
            if (target == null ? void 0 : target.contains(context.trigger)) onClose();
          };
          window.addEventListener("scroll", handleScroll2, { capture: true });
          return () => window.removeEventListener("scroll", handleScroll2, { capture: true });
        }
      }, [context.trigger, onClose]);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        DismissableLayer,
        {
          asChild: true,
          disableOutsidePointerEvents: false,
          onEscapeKeyDown,
          onPointerDownOutside,
          onFocusOutside: (event) => event.preventDefault(),
          onDismiss: onClose,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Content$2,
            {
              "data-state": context.stateAttribute,
              ...popperScope,
              ...contentProps,
              ref: forwardedRef,
              style: {
                ...contentProps.style,
                // re-namespace exposed content custom properties
                ...{
                  "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
                  "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
                  "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
                  "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
                  "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
                }
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(VisuallyHiddenContentContextProvider, { scope: __scopeTooltip, isInside: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Root$9, { id: context.contentId, role: "tooltip", children: ariaLabel || children }) })
              ]
            }
          )
        }
      );
    }
  );
  TooltipContent$1.displayName = CONTENT_NAME$4;
  var ARROW_NAME$1 = "TooltipArrow";
  var TooltipArrow = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeTooltip, ...arrowProps } = props;
      const popperScope = usePopperScope$1(__scopeTooltip);
      const visuallyHiddenContentContext = useVisuallyHiddenContentContext(
        ARROW_NAME$1,
        __scopeTooltip
      );
      return visuallyHiddenContentContext.isInside ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
    }
  );
  TooltipArrow.displayName = ARROW_NAME$1;
  function getExitSideFromRect(point, rect) {
    const top = Math.abs(rect.top - point.y);
    const bottom = Math.abs(rect.bottom - point.y);
    const right = Math.abs(rect.right - point.x);
    const left = Math.abs(rect.left - point.x);
    switch (Math.min(top, bottom, right, left)) {
      case left:
        return "left";
      case right:
        return "right";
      case top:
        return "top";
      case bottom:
        return "bottom";
      default:
        throw new Error("unreachable");
    }
  }
  function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
    const paddedExitPoints = [];
    switch (exitSide) {
      case "top":
        paddedExitPoints.push(
          { x: exitPoint.x - padding, y: exitPoint.y + padding },
          { x: exitPoint.x + padding, y: exitPoint.y + padding }
        );
        break;
      case "bottom":
        paddedExitPoints.push(
          { x: exitPoint.x - padding, y: exitPoint.y - padding },
          { x: exitPoint.x + padding, y: exitPoint.y - padding }
        );
        break;
      case "left":
        paddedExitPoints.push(
          { x: exitPoint.x + padding, y: exitPoint.y - padding },
          { x: exitPoint.x + padding, y: exitPoint.y + padding }
        );
        break;
      case "right":
        paddedExitPoints.push(
          { x: exitPoint.x - padding, y: exitPoint.y - padding },
          { x: exitPoint.x - padding, y: exitPoint.y + padding }
        );
        break;
    }
    return paddedExitPoints;
  }
  function getPointsFromRect(rect) {
    const { top, right, bottom, left } = rect;
    return [
      { x: left, y: top },
      { x: right, y: top },
      { x: right, y: bottom },
      { x: left, y: bottom }
    ];
  }
  function isPointInPolygon(point, polygon) {
    const { x, y } = point;
    let inside = false;
    for (let i = 0, j2 = polygon.length - 1; i < polygon.length; j2 = i++) {
      const ii = polygon[i];
      const jj = polygon[j2];
      const xi = ii.x;
      const yi = ii.y;
      const xj = jj.x;
      const yj = jj.y;
      const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }
  function getHull(points) {
    const newPoints = points.slice();
    newPoints.sort((a, b) => {
      if (a.x < b.x) return -1;
      else if (a.x > b.x) return 1;
      else if (a.y < b.y) return -1;
      else if (a.y > b.y) return 1;
      else return 0;
    });
    return getHullPresorted(newPoints);
  }
  function getHullPresorted(points) {
    if (points.length <= 1) return points.slice();
    const upperHull = [];
    for (let i = 0; i < points.length; i++) {
      const p2 = points[i];
      while (upperHull.length >= 2) {
        const q2 = upperHull[upperHull.length - 1];
        const r2 = upperHull[upperHull.length - 2];
        if ((q2.x - r2.x) * (p2.y - r2.y) >= (q2.y - r2.y) * (p2.x - r2.x)) upperHull.pop();
        else break;
      }
      upperHull.push(p2);
    }
    upperHull.pop();
    const lowerHull = [];
    for (let i = points.length - 1; i >= 0; i--) {
      const p2 = points[i];
      while (lowerHull.length >= 2) {
        const q2 = lowerHull[lowerHull.length - 1];
        const r2 = lowerHull[lowerHull.length - 2];
        if ((q2.x - r2.x) * (p2.y - r2.y) >= (q2.y - r2.y) * (p2.x - r2.x)) lowerHull.pop();
        else break;
      }
      lowerHull.push(p2);
    }
    lowerHull.pop();
    if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) {
      return upperHull;
    } else {
      return upperHull.concat(lowerHull);
    }
  }
  var Provider = TooltipProvider$1;
  var Content2$2 = TooltipContent$1;
  const TooltipProvider = Provider;
  const TooltipContent = React__namespace.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2$2,
    {
      ref,
      sideOffset,
      className: cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      ),
      ...props
    }
  ));
  TooltipContent.displayName = Content2$2.displayName;
  var Subscribable = class {
    constructor() {
      this.listeners = /* @__PURE__ */ new Set();
      this.subscribe = this.subscribe.bind(this);
    }
    subscribe(listener) {
      this.listeners.add(listener);
      this.onSubscribe();
      return () => {
        this.listeners.delete(listener);
        this.onUnsubscribe();
      };
    }
    hasListeners() {
      return this.listeners.size > 0;
    }
    onSubscribe() {
    }
    onUnsubscribe() {
    }
  };
  var isServer = typeof window === "undefined" || "Deno" in globalThis;
  function noop() {
  }
  function functionalUpdate(updater, input) {
    return typeof updater === "function" ? updater(input) : updater;
  }
  function isValidTimeout(value) {
    return typeof value === "number" && value >= 0 && value !== Infinity;
  }
  function timeUntilStale(updatedAt, staleTime) {
    return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
  }
  function resolveStaleTime(staleTime, query) {
    return typeof staleTime === "function" ? staleTime(query) : staleTime;
  }
  function resolveEnabled(enabled, query) {
    return typeof enabled === "function" ? enabled(query) : enabled;
  }
  function matchQuery(filters, query) {
    const {
      type = "all",
      exact,
      fetchStatus,
      predicate,
      queryKey,
      stale
    } = filters;
    if (queryKey) {
      if (exact) {
        if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
          return false;
        }
      } else if (!partialMatchKey(query.queryKey, queryKey)) {
        return false;
      }
    }
    if (type !== "all") {
      const isActive = query.isActive();
      if (type === "active" && !isActive) {
        return false;
      }
      if (type === "inactive" && isActive) {
        return false;
      }
    }
    if (typeof stale === "boolean" && query.isStale() !== stale) {
      return false;
    }
    if (fetchStatus && fetchStatus !== query.state.fetchStatus) {
      return false;
    }
    if (predicate && !predicate(query)) {
      return false;
    }
    return true;
  }
  function matchMutation(filters, mutation) {
    const { exact, status, predicate, mutationKey } = filters;
    if (mutationKey) {
      if (!mutation.options.mutationKey) {
        return false;
      }
      if (exact) {
        if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
          return false;
        }
      } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
        return false;
      }
    }
    if (status && mutation.state.status !== status) {
      return false;
    }
    if (predicate && !predicate(mutation)) {
      return false;
    }
    return true;
  }
  function hashQueryKeyByOptions(queryKey, options2) {
    const hashFn = (options2 == null ? void 0 : options2.queryKeyHashFn) || hashKey;
    return hashFn(queryKey);
  }
  function hashKey(queryKey) {
    return JSON.stringify(
      queryKey,
      (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
        result[key] = val[key];
        return result;
      }, {}) : val
    );
  }
  function partialMatchKey(a, b) {
    if (a === b) {
      return true;
    }
    if (typeof a !== typeof b) {
      return false;
    }
    if (a && b && typeof a === "object" && typeof b === "object") {
      return Object.keys(b).every((key) => partialMatchKey(a[key], b[key]));
    }
    return false;
  }
  function replaceEqualDeep(a, b) {
    if (a === b) {
      return a;
    }
    const array = isPlainArray(a) && isPlainArray(b);
    if (array || isPlainObject(a) && isPlainObject(b)) {
      const aItems = array ? a : Object.keys(a);
      const aSize = aItems.length;
      const bItems = array ? b : Object.keys(b);
      const bSize = bItems.length;
      const copy = array ? [] : {};
      const aItemsSet = new Set(aItems);
      let equalItems = 0;
      for (let i = 0; i < bSize; i++) {
        const key = array ? i : bItems[i];
        if ((!array && aItemsSet.has(key) || array) && a[key] === void 0 && b[key] === void 0) {
          copy[key] = void 0;
          equalItems++;
        } else {
          copy[key] = replaceEqualDeep(a[key], b[key]);
          if (copy[key] === a[key] && a[key] !== void 0) {
            equalItems++;
          }
        }
      }
      return aSize === bSize && equalItems === aSize ? a : copy;
    }
    return b;
  }
  function isPlainArray(value) {
    return Array.isArray(value) && value.length === Object.keys(value).length;
  }
  function isPlainObject(o) {
    if (!hasObjectPrototype(o)) {
      return false;
    }
    const ctor = o.constructor;
    if (ctor === void 0) {
      return true;
    }
    const prot = ctor.prototype;
    if (!hasObjectPrototype(prot)) {
      return false;
    }
    if (!prot.hasOwnProperty("isPrototypeOf")) {
      return false;
    }
    if (Object.getPrototypeOf(o) !== Object.prototype) {
      return false;
    }
    return true;
  }
  function hasObjectPrototype(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
  }
  function sleep(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }
  function replaceData(prevData, data, options2) {
    if (typeof options2.structuralSharing === "function") {
      return options2.structuralSharing(prevData, data);
    } else if (options2.structuralSharing !== false) {
      return replaceEqualDeep(prevData, data);
    }
    return data;
  }
  function addToEnd(items, item, max2 = 0) {
    const newItems = [...items, item];
    return max2 && newItems.length > max2 ? newItems.slice(1) : newItems;
  }
  function addToStart(items, item, max2 = 0) {
    const newItems = [item, ...items];
    return max2 && newItems.length > max2 ? newItems.slice(0, -1) : newItems;
  }
  var skipToken = Symbol();
  function ensureQueryFn(options2, fetchOptions) {
    if (!options2.queryFn && (fetchOptions == null ? void 0 : fetchOptions.initialPromise)) {
      return () => fetchOptions.initialPromise;
    }
    if (!options2.queryFn || options2.queryFn === skipToken) {
      return () => Promise.reject(new Error(`Missing queryFn: '${options2.queryHash}'`));
    }
    return options2.queryFn;
  }
  var FocusManager = (_a = class extends Subscribable {
    constructor() {
      super();
      __privateAdd(this, _focused);
      __privateAdd(this, _cleanup);
      __privateAdd(this, _setup);
      __privateSet(this, _setup, (onFocus) => {
        if (!isServer && window.addEventListener) {
          const listener = () => onFocus();
          window.addEventListener("visibilitychange", listener, false);
          return () => {
            window.removeEventListener("visibilitychange", listener);
          };
        }
        return;
      });
    }
    onSubscribe() {
      if (!__privateGet(this, _cleanup)) {
        this.setEventListener(__privateGet(this, _setup));
      }
    }
    onUnsubscribe() {
      var _a2;
      if (!this.hasListeners()) {
        (_a2 = __privateGet(this, _cleanup)) == null ? void 0 : _a2.call(this);
        __privateSet(this, _cleanup, void 0);
      }
    }
    setEventListener(setup) {
      var _a2;
      __privateSet(this, _setup, setup);
      (_a2 = __privateGet(this, _cleanup)) == null ? void 0 : _a2.call(this);
      __privateSet(this, _cleanup, setup((focused) => {
        if (typeof focused === "boolean") {
          this.setFocused(focused);
        } else {
          this.onFocus();
        }
      }));
    }
    setFocused(focused) {
      const changed = __privateGet(this, _focused) !== focused;
      if (changed) {
        __privateSet(this, _focused, focused);
        this.onFocus();
      }
    }
    onFocus() {
      const isFocused = this.isFocused();
      this.listeners.forEach((listener) => {
        listener(isFocused);
      });
    }
    isFocused() {
      var _a2;
      if (typeof __privateGet(this, _focused) === "boolean") {
        return __privateGet(this, _focused);
      }
      return ((_a2 = globalThis.document) == null ? void 0 : _a2.visibilityState) !== "hidden";
    }
  }, _focused = new WeakMap(), _cleanup = new WeakMap(), _setup = new WeakMap(), _a);
  var focusManager = new FocusManager();
  var OnlineManager = (_b = class extends Subscribable {
    constructor() {
      super();
      __privateAdd(this, _online, true);
      __privateAdd(this, _cleanup2);
      __privateAdd(this, _setup2);
      __privateSet(this, _setup2, (onOnline) => {
        if (!isServer && window.addEventListener) {
          const onlineListener = () => onOnline(true);
          const offlineListener = () => onOnline(false);
          window.addEventListener("online", onlineListener, false);
          window.addEventListener("offline", offlineListener, false);
          return () => {
            window.removeEventListener("online", onlineListener);
            window.removeEventListener("offline", offlineListener);
          };
        }
        return;
      });
    }
    onSubscribe() {
      if (!__privateGet(this, _cleanup2)) {
        this.setEventListener(__privateGet(this, _setup2));
      }
    }
    onUnsubscribe() {
      var _a2;
      if (!this.hasListeners()) {
        (_a2 = __privateGet(this, _cleanup2)) == null ? void 0 : _a2.call(this);
        __privateSet(this, _cleanup2, void 0);
      }
    }
    setEventListener(setup) {
      var _a2;
      __privateSet(this, _setup2, setup);
      (_a2 = __privateGet(this, _cleanup2)) == null ? void 0 : _a2.call(this);
      __privateSet(this, _cleanup2, setup(this.setOnline.bind(this)));
    }
    setOnline(online) {
      const changed = __privateGet(this, _online) !== online;
      if (changed) {
        __privateSet(this, _online, online);
        this.listeners.forEach((listener) => {
          listener(online);
        });
      }
    }
    isOnline() {
      return __privateGet(this, _online);
    }
  }, _online = new WeakMap(), _cleanup2 = new WeakMap(), _setup2 = new WeakMap(), _b);
  var onlineManager = new OnlineManager();
  function pendingThenable() {
    let resolve;
    let reject;
    const thenable = new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });
    thenable.status = "pending";
    thenable.catch(() => {
    });
    function finalize(data) {
      Object.assign(thenable, data);
      delete thenable.resolve;
      delete thenable.reject;
    }
    thenable.resolve = (value) => {
      finalize({
        status: "fulfilled",
        value
      });
      resolve(value);
    };
    thenable.reject = (reason) => {
      finalize({
        status: "rejected",
        reason
      });
      reject(reason);
    };
    return thenable;
  }
  function defaultRetryDelay(failureCount) {
    return Math.min(1e3 * 2 ** failureCount, 3e4);
  }
  function canFetch(networkMode) {
    return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
  }
  var CancelledError = class extends Error {
    constructor(options2) {
      super("CancelledError");
      this.revert = options2 == null ? void 0 : options2.revert;
      this.silent = options2 == null ? void 0 : options2.silent;
    }
  };
  function isCancelledError(value) {
    return value instanceof CancelledError;
  }
  function createRetryer(config) {
    let isRetryCancelled = false;
    let failureCount = 0;
    let isResolved = false;
    let continueFn;
    const thenable = pendingThenable();
    const cancel = (cancelOptions) => {
      var _a2;
      if (!isResolved) {
        reject(new CancelledError(cancelOptions));
        (_a2 = config.abort) == null ? void 0 : _a2.call(config);
      }
    };
    const cancelRetry = () => {
      isRetryCancelled = true;
    };
    const continueRetry = () => {
      isRetryCancelled = false;
    };
    const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
    const canStart = () => canFetch(config.networkMode) && config.canRun();
    const resolve = (value) => {
      var _a2;
      if (!isResolved) {
        isResolved = true;
        (_a2 = config.onSuccess) == null ? void 0 : _a2.call(config, value);
        continueFn == null ? void 0 : continueFn();
        thenable.resolve(value);
      }
    };
    const reject = (value) => {
      var _a2;
      if (!isResolved) {
        isResolved = true;
        (_a2 = config.onError) == null ? void 0 : _a2.call(config, value);
        continueFn == null ? void 0 : continueFn();
        thenable.reject(value);
      }
    };
    const pause = () => {
      return new Promise((continueResolve) => {
        var _a2;
        continueFn = (value) => {
          if (isResolved || canContinue()) {
            continueResolve(value);
          }
        };
        (_a2 = config.onPause) == null ? void 0 : _a2.call(config);
      }).then(() => {
        var _a2;
        continueFn = void 0;
        if (!isResolved) {
          (_a2 = config.onContinue) == null ? void 0 : _a2.call(config);
        }
      });
    };
    const run = () => {
      if (isResolved) {
        return;
      }
      let promiseOrValue;
      const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
      try {
        promiseOrValue = initialPromise ?? config.fn();
      } catch (error) {
        promiseOrValue = Promise.reject(error);
      }
      Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
        var _a2;
        if (isResolved) {
          return;
        }
        const retry = config.retry ?? (isServer ? 0 : 3);
        const retryDelay = config.retryDelay ?? defaultRetryDelay;
        const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
        const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
        if (isRetryCancelled || !shouldRetry) {
          reject(error);
          return;
        }
        failureCount++;
        (_a2 = config.onFail) == null ? void 0 : _a2.call(config, failureCount, error);
        sleep(delay).then(() => {
          return canContinue() ? void 0 : pause();
        }).then(() => {
          if (isRetryCancelled) {
            reject(error);
          } else {
            run();
          }
        });
      });
    };
    return {
      promise: thenable,
      cancel,
      continue: () => {
        continueFn == null ? void 0 : continueFn();
        return thenable;
      },
      cancelRetry,
      continueRetry,
      canStart,
      start: () => {
        if (canStart()) {
          run();
        } else {
          pause().then(run);
        }
        return thenable;
      }
    };
  }
  var defaultScheduler = (cb) => setTimeout(cb, 0);
  function createNotifyManager() {
    let queue = [];
    let transactions = 0;
    let notifyFn = (callback) => {
      callback();
    };
    let batchNotifyFn = (callback) => {
      callback();
    };
    let scheduleFn = defaultScheduler;
    const schedule = (callback) => {
      if (transactions) {
        queue.push(callback);
      } else {
        scheduleFn(() => {
          notifyFn(callback);
        });
      }
    };
    const flush = () => {
      const originalQueue = queue;
      queue = [];
      if (originalQueue.length) {
        scheduleFn(() => {
          batchNotifyFn(() => {
            originalQueue.forEach((callback) => {
              notifyFn(callback);
            });
          });
        });
      }
    };
    return {
      batch: (callback) => {
        let result;
        transactions++;
        try {
          result = callback();
        } finally {
          transactions--;
          if (!transactions) {
            flush();
          }
        }
        return result;
      },
      /**
       * All calls to the wrapped function will be batched.
       */
      batchCalls: (callback) => {
        return (...args) => {
          schedule(() => {
            callback(...args);
          });
        };
      },
      schedule,
      /**
       * Use this method to set a custom notify function.
       * This can be used to for example wrap notifications with `React.act` while running tests.
       */
      setNotifyFunction: (fn) => {
        notifyFn = fn;
      },
      /**
       * Use this method to set a custom function to batch notifications together into a single tick.
       * By default React Query will use the batch function provided by ReactDOM or React Native.
       */
      setBatchNotifyFunction: (fn) => {
        batchNotifyFn = fn;
      },
      setScheduler: (fn) => {
        scheduleFn = fn;
      }
    };
  }
  var notifyManager = createNotifyManager();
  var Removable = (_c = class {
    constructor() {
      __privateAdd(this, _gcTimeout);
    }
    destroy() {
      this.clearGcTimeout();
    }
    scheduleGc() {
      this.clearGcTimeout();
      if (isValidTimeout(this.gcTime)) {
        __privateSet(this, _gcTimeout, setTimeout(() => {
          this.optionalRemove();
        }, this.gcTime));
      }
    }
    updateGcTime(newGcTime) {
      this.gcTime = Math.max(
        this.gcTime || 0,
        newGcTime ?? (isServer ? Infinity : 5 * 60 * 1e3)
      );
    }
    clearGcTimeout() {
      if (__privateGet(this, _gcTimeout)) {
        clearTimeout(__privateGet(this, _gcTimeout));
        __privateSet(this, _gcTimeout, void 0);
      }
    }
  }, _gcTimeout = new WeakMap(), _c);
  var Query = (_d = class extends Removable {
    constructor(config) {
      super();
      __privateAdd(this, _Query_instances);
      __privateAdd(this, _initialState);
      __privateAdd(this, _revertState);
      __privateAdd(this, _cache);
      __privateAdd(this, _client);
      __privateAdd(this, _retryer);
      __privateAdd(this, _defaultOptions);
      __privateAdd(this, _abortSignalConsumed);
      __privateSet(this, _abortSignalConsumed, false);
      __privateSet(this, _defaultOptions, config.defaultOptions);
      this.setOptions(config.options);
      this.observers = [];
      __privateSet(this, _client, config.client);
      __privateSet(this, _cache, __privateGet(this, _client).getQueryCache());
      this.queryKey = config.queryKey;
      this.queryHash = config.queryHash;
      __privateSet(this, _initialState, getDefaultState$1(this.options));
      this.state = config.state ?? __privateGet(this, _initialState);
      this.scheduleGc();
    }
    get meta() {
      return this.options.meta;
    }
    get promise() {
      var _a2;
      return (_a2 = __privateGet(this, _retryer)) == null ? void 0 : _a2.promise;
    }
    setOptions(options2) {
      this.options = { ...__privateGet(this, _defaultOptions), ...options2 };
      this.updateGcTime(this.options.gcTime);
    }
    optionalRemove() {
      if (!this.observers.length && this.state.fetchStatus === "idle") {
        __privateGet(this, _cache).remove(this);
      }
    }
    setData(newData, options2) {
      const data = replaceData(this.state.data, newData, this.options);
      __privateMethod(this, _Query_instances, dispatch_fn).call(this, {
        data,
        type: "success",
        dataUpdatedAt: options2 == null ? void 0 : options2.updatedAt,
        manual: options2 == null ? void 0 : options2.manual
      });
      return data;
    }
    setState(state, setStateOptions) {
      __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "setState", state, setStateOptions });
    }
    cancel(options2) {
      var _a2, _b2;
      const promise = (_a2 = __privateGet(this, _retryer)) == null ? void 0 : _a2.promise;
      (_b2 = __privateGet(this, _retryer)) == null ? void 0 : _b2.cancel(options2);
      return promise ? promise.then(noop).catch(noop) : Promise.resolve();
    }
    destroy() {
      super.destroy();
      this.cancel({ silent: true });
    }
    reset() {
      this.destroy();
      this.setState(__privateGet(this, _initialState));
    }
    isActive() {
      return this.observers.some(
        (observer) => resolveEnabled(observer.options.enabled, this) !== false
      );
    }
    isDisabled() {
      if (this.getObserversCount() > 0) {
        return !this.isActive();
      }
      return this.options.queryFn === skipToken || this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
    }
    isStatic() {
      if (this.getObserversCount() > 0) {
        return this.observers.some(
          (observer) => resolveStaleTime(observer.options.staleTime, this) === "static"
        );
      }
      return false;
    }
    isStale() {
      if (this.getObserversCount() > 0) {
        return this.observers.some(
          (observer) => observer.getCurrentResult().isStale
        );
      }
      return this.state.data === void 0 || this.state.isInvalidated;
    }
    isStaleByTime(staleTime = 0) {
      if (this.state.data === void 0) {
        return true;
      }
      if (staleTime === "static") {
        return false;
      }
      if (this.state.isInvalidated) {
        return true;
      }
      return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
    }
    onFocus() {
      var _a2;
      const observer = this.observers.find((x) => x.shouldFetchOnWindowFocus());
      observer == null ? void 0 : observer.refetch({ cancelRefetch: false });
      (_a2 = __privateGet(this, _retryer)) == null ? void 0 : _a2.continue();
    }
    onOnline() {
      var _a2;
      const observer = this.observers.find((x) => x.shouldFetchOnReconnect());
      observer == null ? void 0 : observer.refetch({ cancelRefetch: false });
      (_a2 = __privateGet(this, _retryer)) == null ? void 0 : _a2.continue();
    }
    addObserver(observer) {
      if (!this.observers.includes(observer)) {
        this.observers.push(observer);
        this.clearGcTimeout();
        __privateGet(this, _cache).notify({ type: "observerAdded", query: this, observer });
      }
    }
    removeObserver(observer) {
      if (this.observers.includes(observer)) {
        this.observers = this.observers.filter((x) => x !== observer);
        if (!this.observers.length) {
          if (__privateGet(this, _retryer)) {
            if (__privateGet(this, _abortSignalConsumed)) {
              __privateGet(this, _retryer).cancel({ revert: true });
            } else {
              __privateGet(this, _retryer).cancelRetry();
            }
          }
          this.scheduleGc();
        }
        __privateGet(this, _cache).notify({ type: "observerRemoved", query: this, observer });
      }
    }
    getObserversCount() {
      return this.observers.length;
    }
    invalidate() {
      if (!this.state.isInvalidated) {
        __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "invalidate" });
      }
    }
    fetch(options2, fetchOptions) {
      var _a2, _b2, _c2;
      if (this.state.fetchStatus !== "idle") {
        if (this.state.data !== void 0 && (fetchOptions == null ? void 0 : fetchOptions.cancelRefetch)) {
          this.cancel({ silent: true });
        } else if (__privateGet(this, _retryer)) {
          __privateGet(this, _retryer).continueRetry();
          return __privateGet(this, _retryer).promise;
        }
      }
      if (options2) {
        this.setOptions(options2);
      }
      if (!this.options.queryFn) {
        const observer = this.observers.find((x) => x.options.queryFn);
        if (observer) {
          this.setOptions(observer.options);
        }
      }
      const abortController = new AbortController();
      const addSignalProperty = (object) => {
        Object.defineProperty(object, "signal", {
          enumerable: true,
          get: () => {
            __privateSet(this, _abortSignalConsumed, true);
            return abortController.signal;
          }
        });
      };
      const fetchFn = () => {
        const queryFn = ensureQueryFn(this.options, fetchOptions);
        const createQueryFnContext = () => {
          const queryFnContext2 = {
            client: __privateGet(this, _client),
            queryKey: this.queryKey,
            meta: this.meta
          };
          addSignalProperty(queryFnContext2);
          return queryFnContext2;
        };
        const queryFnContext = createQueryFnContext();
        __privateSet(this, _abortSignalConsumed, false);
        if (this.options.persister) {
          return this.options.persister(
            queryFn,
            queryFnContext,
            this
          );
        }
        return queryFn(queryFnContext);
      };
      const createFetchContext = () => {
        const context2 = {
          fetchOptions,
          options: this.options,
          queryKey: this.queryKey,
          client: __privateGet(this, _client),
          state: this.state,
          fetchFn
        };
        addSignalProperty(context2);
        return context2;
      };
      const context = createFetchContext();
      (_a2 = this.options.behavior) == null ? void 0 : _a2.onFetch(context, this);
      __privateSet(this, _revertState, this.state);
      if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== ((_b2 = context.fetchOptions) == null ? void 0 : _b2.meta)) {
        __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "fetch", meta: (_c2 = context.fetchOptions) == null ? void 0 : _c2.meta });
      }
      const onError = (error) => {
        var _a3, _b3, _c3, _d2;
        if (!(isCancelledError(error) && error.silent)) {
          __privateMethod(this, _Query_instances, dispatch_fn).call(this, {
            type: "error",
            error
          });
        }
        if (!isCancelledError(error)) {
          (_b3 = (_a3 = __privateGet(this, _cache).config).onError) == null ? void 0 : _b3.call(
            _a3,
            error,
            this
          );
          (_d2 = (_c3 = __privateGet(this, _cache).config).onSettled) == null ? void 0 : _d2.call(
            _c3,
            this.state.data,
            error,
            this
          );
        }
        this.scheduleGc();
      };
      __privateSet(this, _retryer, createRetryer({
        initialPromise: fetchOptions == null ? void 0 : fetchOptions.initialPromise,
        fn: context.fetchFn,
        abort: abortController.abort.bind(abortController),
        onSuccess: (data) => {
          var _a3, _b3, _c3, _d2;
          if (data === void 0) {
            onError(new Error(`${this.queryHash} data is undefined`));
            return;
          }
          try {
            this.setData(data);
          } catch (error) {
            onError(error);
            return;
          }
          (_b3 = (_a3 = __privateGet(this, _cache).config).onSuccess) == null ? void 0 : _b3.call(_a3, data, this);
          (_d2 = (_c3 = __privateGet(this, _cache).config).onSettled) == null ? void 0 : _d2.call(
            _c3,
            data,
            this.state.error,
            this
          );
          this.scheduleGc();
        },
        onError,
        onFail: (failureCount, error) => {
          __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "failed", failureCount, error });
        },
        onPause: () => {
          __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "pause" });
        },
        onContinue: () => {
          __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "continue" });
        },
        retry: context.options.retry,
        retryDelay: context.options.retryDelay,
        networkMode: context.options.networkMode,
        canRun: () => true
      }));
      return __privateGet(this, _retryer).start();
    }
  }, _initialState = new WeakMap(), _revertState = new WeakMap(), _cache = new WeakMap(), _client = new WeakMap(), _retryer = new WeakMap(), _defaultOptions = new WeakMap(), _abortSignalConsumed = new WeakMap(), _Query_instances = new WeakSet(), dispatch_fn = function(action) {
    const reducer2 = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            fetchFailureCount: action.failureCount,
            fetchFailureReason: action.error
          };
        case "pause":
          return {
            ...state,
            fetchStatus: "paused"
          };
        case "continue":
          return {
            ...state,
            fetchStatus: "fetching"
          };
        case "fetch":
          return {
            ...state,
            ...fetchState(state.data, this.options),
            fetchMeta: action.meta ?? null
          };
        case "success":
          __privateSet(this, _revertState, void 0);
          return {
            ...state,
            data: action.data,
            dataUpdateCount: state.dataUpdateCount + 1,
            dataUpdatedAt: action.dataUpdatedAt ?? Date.now(),
            error: null,
            isInvalidated: false,
            status: "success",
            ...!action.manual && {
              fetchStatus: "idle",
              fetchFailureCount: 0,
              fetchFailureReason: null
            }
          };
        case "error":
          const error = action.error;
          if (isCancelledError(error) && error.revert && __privateGet(this, _revertState)) {
            return { ...__privateGet(this, _revertState), fetchStatus: "idle" };
          }
          return {
            ...state,
            error,
            errorUpdateCount: state.errorUpdateCount + 1,
            errorUpdatedAt: Date.now(),
            fetchFailureCount: state.fetchFailureCount + 1,
            fetchFailureReason: error,
            fetchStatus: "idle",
            status: "error"
          };
        case "invalidate":
          return {
            ...state,
            isInvalidated: true
          };
        case "setState":
          return {
            ...state,
            ...action.state
          };
      }
    };
    this.state = reducer2(this.state);
    notifyManager.batch(() => {
      this.observers.forEach((observer) => {
        observer.onQueryUpdate();
      });
      __privateGet(this, _cache).notify({ query: this, type: "updated", action });
    });
  }, _d);
  function fetchState(data, options2) {
    return {
      fetchFailureCount: 0,
      fetchFailureReason: null,
      fetchStatus: canFetch(options2.networkMode) ? "fetching" : "paused",
      ...data === void 0 && {
        error: null,
        status: "pending"
      }
    };
  }
  function getDefaultState$1(options2) {
    const data = typeof options2.initialData === "function" ? options2.initialData() : options2.initialData;
    const hasData = data !== void 0;
    const initialDataUpdatedAt = hasData ? typeof options2.initialDataUpdatedAt === "function" ? options2.initialDataUpdatedAt() : options2.initialDataUpdatedAt : 0;
    return {
      data,
      dataUpdateCount: 0,
      dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
      error: null,
      errorUpdateCount: 0,
      errorUpdatedAt: 0,
      fetchFailureCount: 0,
      fetchFailureReason: null,
      fetchMeta: null,
      isInvalidated: false,
      status: hasData ? "success" : "pending",
      fetchStatus: "idle"
    };
  }
  var QueryCache = (_e = class extends Subscribable {
    constructor(config = {}) {
      super();
      __privateAdd(this, _queries);
      this.config = config;
      __privateSet(this, _queries, /* @__PURE__ */ new Map());
    }
    build(client, options2, state) {
      const queryKey = options2.queryKey;
      const queryHash = options2.queryHash ?? hashQueryKeyByOptions(queryKey, options2);
      let query = this.get(queryHash);
      if (!query) {
        query = new Query({
          client,
          queryKey,
          queryHash,
          options: client.defaultQueryOptions(options2),
          state,
          defaultOptions: client.getQueryDefaults(queryKey)
        });
        this.add(query);
      }
      return query;
    }
    add(query) {
      if (!__privateGet(this, _queries).has(query.queryHash)) {
        __privateGet(this, _queries).set(query.queryHash, query);
        this.notify({
          type: "added",
          query
        });
      }
    }
    remove(query) {
      const queryInMap = __privateGet(this, _queries).get(query.queryHash);
      if (queryInMap) {
        query.destroy();
        if (queryInMap === query) {
          __privateGet(this, _queries).delete(query.queryHash);
        }
        this.notify({ type: "removed", query });
      }
    }
    clear() {
      notifyManager.batch(() => {
        this.getAll().forEach((query) => {
          this.remove(query);
        });
      });
    }
    get(queryHash) {
      return __privateGet(this, _queries).get(queryHash);
    }
    getAll() {
      return [...__privateGet(this, _queries).values()];
    }
    find(filters) {
      const defaultedFilters = { exact: true, ...filters };
      return this.getAll().find(
        (query) => matchQuery(defaultedFilters, query)
      );
    }
    findAll(filters = {}) {
      const queries = this.getAll();
      return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
    }
    notify(event) {
      notifyManager.batch(() => {
        this.listeners.forEach((listener) => {
          listener(event);
        });
      });
    }
    onFocus() {
      notifyManager.batch(() => {
        this.getAll().forEach((query) => {
          query.onFocus();
        });
      });
    }
    onOnline() {
      notifyManager.batch(() => {
        this.getAll().forEach((query) => {
          query.onOnline();
        });
      });
    }
  }, _queries = new WeakMap(), _e);
  var Mutation = (_f = class extends Removable {
    constructor(config) {
      super();
      __privateAdd(this, _Mutation_instances);
      __privateAdd(this, _observers);
      __privateAdd(this, _mutationCache);
      __privateAdd(this, _retryer2);
      this.mutationId = config.mutationId;
      __privateSet(this, _mutationCache, config.mutationCache);
      __privateSet(this, _observers, []);
      this.state = config.state || getDefaultState();
      this.setOptions(config.options);
      this.scheduleGc();
    }
    setOptions(options2) {
      this.options = options2;
      this.updateGcTime(this.options.gcTime);
    }
    get meta() {
      return this.options.meta;
    }
    addObserver(observer) {
      if (!__privateGet(this, _observers).includes(observer)) {
        __privateGet(this, _observers).push(observer);
        this.clearGcTimeout();
        __privateGet(this, _mutationCache).notify({
          type: "observerAdded",
          mutation: this,
          observer
        });
      }
    }
    removeObserver(observer) {
      __privateSet(this, _observers, __privateGet(this, _observers).filter((x) => x !== observer));
      this.scheduleGc();
      __privateGet(this, _mutationCache).notify({
        type: "observerRemoved",
        mutation: this,
        observer
      });
    }
    optionalRemove() {
      if (!__privateGet(this, _observers).length) {
        if (this.state.status === "pending") {
          this.scheduleGc();
        } else {
          __privateGet(this, _mutationCache).remove(this);
        }
      }
    }
    continue() {
      var _a2;
      return ((_a2 = __privateGet(this, _retryer2)) == null ? void 0 : _a2.continue()) ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
      this.execute(this.state.variables);
    }
    async execute(variables) {
      var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t2;
      const onContinue = () => {
        __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "continue" });
      };
      __privateSet(this, _retryer2, createRetryer({
        fn: () => {
          if (!this.options.mutationFn) {
            return Promise.reject(new Error("No mutationFn found"));
          }
          return this.options.mutationFn(variables);
        },
        onFail: (failureCount, error) => {
          __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "failed", failureCount, error });
        },
        onPause: () => {
          __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "pause" });
        },
        onContinue,
        retry: this.options.retry ?? 0,
        retryDelay: this.options.retryDelay,
        networkMode: this.options.networkMode,
        canRun: () => __privateGet(this, _mutationCache).canRun(this)
      }));
      const restored = this.state.status === "pending";
      const isPaused = !__privateGet(this, _retryer2).canStart();
      try {
        if (restored) {
          onContinue();
        } else {
          __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "pending", variables, isPaused });
          await ((_b2 = (_a2 = __privateGet(this, _mutationCache).config).onMutate) == null ? void 0 : _b2.call(
            _a2,
            variables,
            this
          ));
          const context = await ((_d2 = (_c2 = this.options).onMutate) == null ? void 0 : _d2.call(_c2, variables));
          if (context !== this.state.context) {
            __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, {
              type: "pending",
              context,
              variables,
              isPaused
            });
          }
        }
        const data = await __privateGet(this, _retryer2).start();
        await ((_f2 = (_e2 = __privateGet(this, _mutationCache).config).onSuccess) == null ? void 0 : _f2.call(
          _e2,
          data,
          variables,
          this.state.context,
          this
        ));
        await ((_h2 = (_g2 = this.options).onSuccess) == null ? void 0 : _h2.call(_g2, data, variables, this.state.context));
        await ((_j = (_i = __privateGet(this, _mutationCache).config).onSettled) == null ? void 0 : _j.call(
          _i,
          data,
          null,
          this.state.variables,
          this.state.context,
          this
        ));
        await ((_l = (_k = this.options).onSettled) == null ? void 0 : _l.call(_k, data, null, variables, this.state.context));
        __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "success", data });
        return data;
      } catch (error) {
        try {
          await ((_n = (_m = __privateGet(this, _mutationCache).config).onError) == null ? void 0 : _n.call(
            _m,
            error,
            variables,
            this.state.context,
            this
          ));
          await ((_p = (_o = this.options).onError) == null ? void 0 : _p.call(
            _o,
            error,
            variables,
            this.state.context
          ));
          await ((_r = (_q = __privateGet(this, _mutationCache).config).onSettled) == null ? void 0 : _r.call(
            _q,
            void 0,
            error,
            this.state.variables,
            this.state.context,
            this
          ));
          await ((_t2 = (_s = this.options).onSettled) == null ? void 0 : _t2.call(
            _s,
            void 0,
            error,
            variables,
            this.state.context
          ));
          throw error;
        } finally {
          __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "error", error });
        }
      } finally {
        __privateGet(this, _mutationCache).runNext(this);
      }
    }
  }, _observers = new WeakMap(), _mutationCache = new WeakMap(), _retryer2 = new WeakMap(), _Mutation_instances = new WeakSet(), dispatch_fn2 = function(action) {
    const reducer2 = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            failureCount: action.failureCount,
            failureReason: action.error
          };
        case "pause":
          return {
            ...state,
            isPaused: true
          };
        case "continue":
          return {
            ...state,
            isPaused: false
          };
        case "pending":
          return {
            ...state,
            context: action.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: action.isPaused,
            status: "pending",
            variables: action.variables,
            submittedAt: Date.now()
          };
        case "success":
          return {
            ...state,
            data: action.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: "success",
            isPaused: false
          };
        case "error":
          return {
            ...state,
            data: void 0,
            error: action.error,
            failureCount: state.failureCount + 1,
            failureReason: action.error,
            isPaused: false,
            status: "error"
          };
      }
    };
    this.state = reducer2(this.state);
    notifyManager.batch(() => {
      __privateGet(this, _observers).forEach((observer) => {
        observer.onMutationUpdate(action);
      });
      __privateGet(this, _mutationCache).notify({
        mutation: this,
        type: "updated",
        action
      });
    });
  }, _f);
  function getDefaultState() {
    return {
      context: void 0,
      data: void 0,
      error: null,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      status: "idle",
      variables: void 0,
      submittedAt: 0
    };
  }
  var MutationCache = (_g = class extends Subscribable {
    constructor(config = {}) {
      super();
      __privateAdd(this, _mutations);
      __privateAdd(this, _scopes);
      __privateAdd(this, _mutationId);
      this.config = config;
      __privateSet(this, _mutations, /* @__PURE__ */ new Set());
      __privateSet(this, _scopes, /* @__PURE__ */ new Map());
      __privateSet(this, _mutationId, 0);
    }
    build(client, options2, state) {
      const mutation = new Mutation({
        mutationCache: this,
        mutationId: ++__privateWrapper(this, _mutationId)._,
        options: client.defaultMutationOptions(options2),
        state
      });
      this.add(mutation);
      return mutation;
    }
    add(mutation) {
      __privateGet(this, _mutations).add(mutation);
      const scope = scopeFor(mutation);
      if (typeof scope === "string") {
        const scopedMutations = __privateGet(this, _scopes).get(scope);
        if (scopedMutations) {
          scopedMutations.push(mutation);
        } else {
          __privateGet(this, _scopes).set(scope, [mutation]);
        }
      }
      this.notify({ type: "added", mutation });
    }
    remove(mutation) {
      if (__privateGet(this, _mutations).delete(mutation)) {
        const scope = scopeFor(mutation);
        if (typeof scope === "string") {
          const scopedMutations = __privateGet(this, _scopes).get(scope);
          if (scopedMutations) {
            if (scopedMutations.length > 1) {
              const index2 = scopedMutations.indexOf(mutation);
              if (index2 !== -1) {
                scopedMutations.splice(index2, 1);
              }
            } else if (scopedMutations[0] === mutation) {
              __privateGet(this, _scopes).delete(scope);
            }
          }
        }
      }
      this.notify({ type: "removed", mutation });
    }
    canRun(mutation) {
      const scope = scopeFor(mutation);
      if (typeof scope === "string") {
        const mutationsWithSameScope = __privateGet(this, _scopes).get(scope);
        const firstPendingMutation = mutationsWithSameScope == null ? void 0 : mutationsWithSameScope.find(
          (m2) => m2.state.status === "pending"
        );
        return !firstPendingMutation || firstPendingMutation === mutation;
      } else {
        return true;
      }
    }
    runNext(mutation) {
      var _a2;
      const scope = scopeFor(mutation);
      if (typeof scope === "string") {
        const foundMutation = (_a2 = __privateGet(this, _scopes).get(scope)) == null ? void 0 : _a2.find((m2) => m2 !== mutation && m2.state.isPaused);
        return (foundMutation == null ? void 0 : foundMutation.continue()) ?? Promise.resolve();
      } else {
        return Promise.resolve();
      }
    }
    clear() {
      notifyManager.batch(() => {
        __privateGet(this, _mutations).forEach((mutation) => {
          this.notify({ type: "removed", mutation });
        });
        __privateGet(this, _mutations).clear();
        __privateGet(this, _scopes).clear();
      });
    }
    getAll() {
      return Array.from(__privateGet(this, _mutations));
    }
    find(filters) {
      const defaultedFilters = { exact: true, ...filters };
      return this.getAll().find(
        (mutation) => matchMutation(defaultedFilters, mutation)
      );
    }
    findAll(filters = {}) {
      return this.getAll().filter((mutation) => matchMutation(filters, mutation));
    }
    notify(event) {
      notifyManager.batch(() => {
        this.listeners.forEach((listener) => {
          listener(event);
        });
      });
    }
    resumePausedMutations() {
      const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
      return notifyManager.batch(
        () => Promise.all(
          pausedMutations.map((mutation) => mutation.continue().catch(noop))
        )
      );
    }
  }, _mutations = new WeakMap(), _scopes = new WeakMap(), _mutationId = new WeakMap(), _g);
  function scopeFor(mutation) {
    var _a2;
    return (_a2 = mutation.options.scope) == null ? void 0 : _a2.id;
  }
  function infiniteQueryBehavior(pages) {
    return {
      onFetch: (context, query) => {
        var _a2, _b2, _c2, _d2, _e2;
        const options2 = context.options;
        const direction = (_c2 = (_b2 = (_a2 = context.fetchOptions) == null ? void 0 : _a2.meta) == null ? void 0 : _b2.fetchMore) == null ? void 0 : _c2.direction;
        const oldPages = ((_d2 = context.state.data) == null ? void 0 : _d2.pages) || [];
        const oldPageParams = ((_e2 = context.state.data) == null ? void 0 : _e2.pageParams) || [];
        let result = { pages: [], pageParams: [] };
        let currentPage = 0;
        const fetchFn = async () => {
          let cancelled = false;
          const addSignalProperty = (object) => {
            Object.defineProperty(object, "signal", {
              enumerable: true,
              get: () => {
                if (context.signal.aborted) {
                  cancelled = true;
                } else {
                  context.signal.addEventListener("abort", () => {
                    cancelled = true;
                  });
                }
                return context.signal;
              }
            });
          };
          const queryFn = ensureQueryFn(context.options, context.fetchOptions);
          const fetchPage = async (data, param, previous) => {
            if (cancelled) {
              return Promise.reject();
            }
            if (param == null && data.pages.length) {
              return Promise.resolve(data);
            }
            const createQueryFnContext = () => {
              const queryFnContext2 = {
                client: context.client,
                queryKey: context.queryKey,
                pageParam: param,
                direction: previous ? "backward" : "forward",
                meta: context.options.meta
              };
              addSignalProperty(queryFnContext2);
              return queryFnContext2;
            };
            const queryFnContext = createQueryFnContext();
            const page = await queryFn(queryFnContext);
            const { maxPages } = context.options;
            const addTo = previous ? addToStart : addToEnd;
            return {
              pages: addTo(data.pages, page, maxPages),
              pageParams: addTo(data.pageParams, param, maxPages)
            };
          };
          if (direction && oldPages.length) {
            const previous = direction === "backward";
            const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
            const oldData = {
              pages: oldPages,
              pageParams: oldPageParams
            };
            const param = pageParamFn(options2, oldData);
            result = await fetchPage(oldData, param, previous);
          } else {
            const remainingPages = pages ?? oldPages.length;
            do {
              const param = currentPage === 0 ? oldPageParams[0] ?? options2.initialPageParam : getNextPageParam(options2, result);
              if (currentPage > 0 && param == null) {
                break;
              }
              result = await fetchPage(result, param);
              currentPage++;
            } while (currentPage < remainingPages);
          }
          return result;
        };
        if (context.options.persister) {
          context.fetchFn = () => {
            var _a3, _b3;
            return (_b3 = (_a3 = context.options).persister) == null ? void 0 : _b3.call(
              _a3,
              fetchFn,
              {
                client: context.client,
                queryKey: context.queryKey,
                meta: context.options.meta,
                signal: context.signal
              },
              query
            );
          };
        } else {
          context.fetchFn = fetchFn;
        }
      }
    };
  }
  function getNextPageParam(options2, { pages, pageParams }) {
    const lastIndex = pages.length - 1;
    return pages.length > 0 ? options2.getNextPageParam(
      pages[lastIndex],
      pages,
      pageParams[lastIndex],
      pageParams
    ) : void 0;
  }
  function getPreviousPageParam(options2, { pages, pageParams }) {
    var _a2;
    return pages.length > 0 ? (_a2 = options2.getPreviousPageParam) == null ? void 0 : _a2.call(options2, pages[0], pages, pageParams[0], pageParams) : void 0;
  }
  var QueryClient = (_h = class {
    constructor(config = {}) {
      __privateAdd(this, _queryCache);
      __privateAdd(this, _mutationCache2);
      __privateAdd(this, _defaultOptions2);
      __privateAdd(this, _queryDefaults);
      __privateAdd(this, _mutationDefaults);
      __privateAdd(this, _mountCount);
      __privateAdd(this, _unsubscribeFocus);
      __privateAdd(this, _unsubscribeOnline);
      __privateSet(this, _queryCache, config.queryCache || new QueryCache());
      __privateSet(this, _mutationCache2, config.mutationCache || new MutationCache());
      __privateSet(this, _defaultOptions2, config.defaultOptions || {});
      __privateSet(this, _queryDefaults, /* @__PURE__ */ new Map());
      __privateSet(this, _mutationDefaults, /* @__PURE__ */ new Map());
      __privateSet(this, _mountCount, 0);
    }
    mount() {
      __privateWrapper(this, _mountCount)._++;
      if (__privateGet(this, _mountCount) !== 1) return;
      __privateSet(this, _unsubscribeFocus, focusManager.subscribe(async (focused) => {
        if (focused) {
          await this.resumePausedMutations();
          __privateGet(this, _queryCache).onFocus();
        }
      }));
      __privateSet(this, _unsubscribeOnline, onlineManager.subscribe(async (online) => {
        if (online) {
          await this.resumePausedMutations();
          __privateGet(this, _queryCache).onOnline();
        }
      }));
    }
    unmount() {
      var _a2, _b2;
      __privateWrapper(this, _mountCount)._--;
      if (__privateGet(this, _mountCount) !== 0) return;
      (_a2 = __privateGet(this, _unsubscribeFocus)) == null ? void 0 : _a2.call(this);
      __privateSet(this, _unsubscribeFocus, void 0);
      (_b2 = __privateGet(this, _unsubscribeOnline)) == null ? void 0 : _b2.call(this);
      __privateSet(this, _unsubscribeOnline, void 0);
    }
    isFetching(filters) {
      return __privateGet(this, _queryCache).findAll({ ...filters, fetchStatus: "fetching" }).length;
    }
    isMutating(filters) {
      return __privateGet(this, _mutationCache2).findAll({ ...filters, status: "pending" }).length;
    }
    /**
     * Imperative (non-reactive) way to retrieve data for a QueryKey.
     * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
     *
     * Hint: Do not use this function inside a component, because it won't receive updates.
     * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
     */
    getQueryData(queryKey) {
      var _a2;
      const options2 = this.defaultQueryOptions({ queryKey });
      return (_a2 = __privateGet(this, _queryCache).get(options2.queryHash)) == null ? void 0 : _a2.state.data;
    }
    ensureQueryData(options2) {
      const defaultedOptions = this.defaultQueryOptions(options2);
      const query = __privateGet(this, _queryCache).build(this, defaultedOptions);
      const cachedData = query.state.data;
      if (cachedData === void 0) {
        return this.fetchQuery(options2);
      }
      if (options2.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) {
        void this.prefetchQuery(defaultedOptions);
      }
      return Promise.resolve(cachedData);
    }
    getQueriesData(filters) {
      return __privateGet(this, _queryCache).findAll(filters).map(({ queryKey, state }) => {
        const data = state.data;
        return [queryKey, data];
      });
    }
    setQueryData(queryKey, updater, options2) {
      const defaultedOptions = this.defaultQueryOptions({ queryKey });
      const query = __privateGet(this, _queryCache).get(
        defaultedOptions.queryHash
      );
      const prevData = query == null ? void 0 : query.state.data;
      const data = functionalUpdate(updater, prevData);
      if (data === void 0) {
        return void 0;
      }
      return __privateGet(this, _queryCache).build(this, defaultedOptions).setData(data, { ...options2, manual: true });
    }
    setQueriesData(filters, updater, options2) {
      return notifyManager.batch(
        () => __privateGet(this, _queryCache).findAll(filters).map(({ queryKey }) => [
          queryKey,
          this.setQueryData(queryKey, updater, options2)
        ])
      );
    }
    getQueryState(queryKey) {
      var _a2;
      const options2 = this.defaultQueryOptions({ queryKey });
      return (_a2 = __privateGet(this, _queryCache).get(
        options2.queryHash
      )) == null ? void 0 : _a2.state;
    }
    removeQueries(filters) {
      const queryCache = __privateGet(this, _queryCache);
      notifyManager.batch(() => {
        queryCache.findAll(filters).forEach((query) => {
          queryCache.remove(query);
        });
      });
    }
    resetQueries(filters, options2) {
      const queryCache = __privateGet(this, _queryCache);
      return notifyManager.batch(() => {
        queryCache.findAll(filters).forEach((query) => {
          query.reset();
        });
        return this.refetchQueries(
          {
            type: "active",
            ...filters
          },
          options2
        );
      });
    }
    cancelQueries(filters, cancelOptions = {}) {
      const defaultedCancelOptions = { revert: true, ...cancelOptions };
      const promises = notifyManager.batch(
        () => __privateGet(this, _queryCache).findAll(filters).map((query) => query.cancel(defaultedCancelOptions))
      );
      return Promise.all(promises).then(noop).catch(noop);
    }
    invalidateQueries(filters, options2 = {}) {
      return notifyManager.batch(() => {
        __privateGet(this, _queryCache).findAll(filters).forEach((query) => {
          query.invalidate();
        });
        if ((filters == null ? void 0 : filters.refetchType) === "none") {
          return Promise.resolve();
        }
        return this.refetchQueries(
          {
            ...filters,
            type: (filters == null ? void 0 : filters.refetchType) ?? (filters == null ? void 0 : filters.type) ?? "active"
          },
          options2
        );
      });
    }
    refetchQueries(filters, options2 = {}) {
      const fetchOptions = {
        ...options2,
        cancelRefetch: options2.cancelRefetch ?? true
      };
      const promises = notifyManager.batch(
        () => __privateGet(this, _queryCache).findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
          let promise = query.fetch(void 0, fetchOptions);
          if (!fetchOptions.throwOnError) {
            promise = promise.catch(noop);
          }
          return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
        })
      );
      return Promise.all(promises).then(noop);
    }
    fetchQuery(options2) {
      const defaultedOptions = this.defaultQueryOptions(options2);
      if (defaultedOptions.retry === void 0) {
        defaultedOptions.retry = false;
      }
      const query = __privateGet(this, _queryCache).build(this, defaultedOptions);
      return query.isStaleByTime(
        resolveStaleTime(defaultedOptions.staleTime, query)
      ) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
    }
    prefetchQuery(options2) {
      return this.fetchQuery(options2).then(noop).catch(noop);
    }
    fetchInfiniteQuery(options2) {
      options2.behavior = infiniteQueryBehavior(options2.pages);
      return this.fetchQuery(options2);
    }
    prefetchInfiniteQuery(options2) {
      return this.fetchInfiniteQuery(options2).then(noop).catch(noop);
    }
    ensureInfiniteQueryData(options2) {
      options2.behavior = infiniteQueryBehavior(options2.pages);
      return this.ensureQueryData(options2);
    }
    resumePausedMutations() {
      if (onlineManager.isOnline()) {
        return __privateGet(this, _mutationCache2).resumePausedMutations();
      }
      return Promise.resolve();
    }
    getQueryCache() {
      return __privateGet(this, _queryCache);
    }
    getMutationCache() {
      return __privateGet(this, _mutationCache2);
    }
    getDefaultOptions() {
      return __privateGet(this, _defaultOptions2);
    }
    setDefaultOptions(options2) {
      __privateSet(this, _defaultOptions2, options2);
    }
    setQueryDefaults(queryKey, options2) {
      __privateGet(this, _queryDefaults).set(hashKey(queryKey), {
        queryKey,
        defaultOptions: options2
      });
    }
    getQueryDefaults(queryKey) {
      const defaults = [...__privateGet(this, _queryDefaults).values()];
      const result = {};
      defaults.forEach((queryDefault) => {
        if (partialMatchKey(queryKey, queryDefault.queryKey)) {
          Object.assign(result, queryDefault.defaultOptions);
        }
      });
      return result;
    }
    setMutationDefaults(mutationKey, options2) {
      __privateGet(this, _mutationDefaults).set(hashKey(mutationKey), {
        mutationKey,
        defaultOptions: options2
      });
    }
    getMutationDefaults(mutationKey) {
      const defaults = [...__privateGet(this, _mutationDefaults).values()];
      const result = {};
      defaults.forEach((queryDefault) => {
        if (partialMatchKey(mutationKey, queryDefault.mutationKey)) {
          Object.assign(result, queryDefault.defaultOptions);
        }
      });
      return result;
    }
    defaultQueryOptions(options2) {
      if (options2._defaulted) {
        return options2;
      }
      const defaultedOptions = {
        ...__privateGet(this, _defaultOptions2).queries,
        ...this.getQueryDefaults(options2.queryKey),
        ...options2,
        _defaulted: true
      };
      if (!defaultedOptions.queryHash) {
        defaultedOptions.queryHash = hashQueryKeyByOptions(
          defaultedOptions.queryKey,
          defaultedOptions
        );
      }
      if (defaultedOptions.refetchOnReconnect === void 0) {
        defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
      }
      if (defaultedOptions.throwOnError === void 0) {
        defaultedOptions.throwOnError = !!defaultedOptions.suspense;
      }
      if (!defaultedOptions.networkMode && defaultedOptions.persister) {
        defaultedOptions.networkMode = "offlineFirst";
      }
      if (defaultedOptions.queryFn === skipToken) {
        defaultedOptions.enabled = false;
      }
      return defaultedOptions;
    }
    defaultMutationOptions(options2) {
      if (options2 == null ? void 0 : options2._defaulted) {
        return options2;
      }
      return {
        ...__privateGet(this, _defaultOptions2).mutations,
        ...(options2 == null ? void 0 : options2.mutationKey) && this.getMutationDefaults(options2.mutationKey),
        ...options2,
        _defaulted: true
      };
    }
    clear() {
      __privateGet(this, _queryCache).clear();
      __privateGet(this, _mutationCache2).clear();
    }
  }, _queryCache = new WeakMap(), _mutationCache2 = new WeakMap(), _defaultOptions2 = new WeakMap(), _queryDefaults = new WeakMap(), _mutationDefaults = new WeakMap(), _mountCount = new WeakMap(), _unsubscribeFocus = new WeakMap(), _unsubscribeOnline = new WeakMap(), _h);
  var QueryClientContext = React__namespace.createContext(
    void 0
  );
  var QueryClientProvider = ({
    client,
    children
  }) => {
    React__namespace.useEffect(() => {
      client.mount();
      return () => {
        client.unmount();
      };
    }, [client]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientContext.Provider, { value: client, children });
  };
  var DirectionContext = React__namespace.createContext(void 0);
  function useDirection(localDir) {
    const globalDir = React__namespace.useContext(DirectionContext);
    return localDir || globalDir || "ltr";
  }
  var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
  var EVENT_OPTIONS$1 = { bubbles: false, cancelable: true };
  var GROUP_NAME$1 = "RovingFocusGroup";
  var [Collection$2, useCollection$2, createCollectionScope$2] = createCollection(GROUP_NAME$1);
  var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
    GROUP_NAME$1,
    [createCollectionScope$2]
  );
  var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME$1);
  var RovingFocusGroup = React__namespace.forwardRef(
    (props, forwardedRef) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$2.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$2.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
    }
  );
  RovingFocusGroup.displayName = GROUP_NAME$1;
  var RovingFocusGroupImpl = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      orientation,
      loop = false,
      dir,
      currentTabStopId: currentTabStopIdProp,
      defaultCurrentTabStopId,
      onCurrentTabStopIdChange,
      onEntryFocus,
      preventScrollOnEntryFocus = false,
      ...groupProps
    } = props;
    const ref = React__namespace.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const direction = useDirection(dir);
    const [currentTabStopId, setCurrentTabStopId] = useControllableState({
      prop: currentTabStopIdProp,
      defaultProp: defaultCurrentTabStopId ?? null,
      onChange: onCurrentTabStopIdChange,
      caller: GROUP_NAME$1
    });
    const [isTabbingBackOut, setIsTabbingBackOut] = React__namespace.useState(false);
    const handleEntryFocus = useCallbackRef$1(onEntryFocus);
    const getItems = useCollection$2(__scopeRovingFocusGroup);
    const isClickFocusRef = React__namespace.useRef(false);
    const [focusableItemsCount, setFocusableItemsCount] = React__namespace.useState(0);
    React__namespace.useEffect(() => {
      const node = ref.current;
      if (node) {
        node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
        return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
      }
    }, [handleEntryFocus]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      RovingFocusProvider,
      {
        scope: __scopeRovingFocusGroup,
        orientation,
        dir: direction,
        loop,
        currentTabStopId,
        onItemFocus: React__namespace.useCallback(
          (tabStopId) => setCurrentTabStopId(tabStopId),
          [setCurrentTabStopId]
        ),
        onItemShiftTab: React__namespace.useCallback(() => setIsTabbingBackOut(true), []),
        onFocusableItemAdd: React__namespace.useCallback(
          () => setFocusableItemsCount((prevCount) => prevCount + 1),
          []
        ),
        onFocusableItemRemove: React__namespace.useCallback(
          () => setFocusableItemsCount((prevCount) => prevCount - 1),
          []
        ),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
            "data-orientation": orientation,
            ...groupProps,
            ref: composedRefs,
            style: { outline: "none", ...props.style },
            onMouseDown: composeEventHandlers(props.onMouseDown, () => {
              isClickFocusRef.current = true;
            }),
            onFocus: composeEventHandlers(props.onFocus, (event) => {
              const isKeyboardFocus = !isClickFocusRef.current;
              if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
                const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS$1);
                event.currentTarget.dispatchEvent(entryFocusEvent);
                if (!entryFocusEvent.defaultPrevented) {
                  const items = getItems().filter((item) => item.focusable);
                  const activeItem = items.find((item) => item.active);
                  const currentItem = items.find((item) => item.id === currentTabStopId);
                  const candidateItems = [activeItem, currentItem, ...items].filter(
                    Boolean
                  );
                  const candidateNodes = candidateItems.map((item) => item.ref.current);
                  focusFirst$1(candidateNodes, preventScrollOnEntryFocus);
                }
              }
              isClickFocusRef.current = false;
            }),
            onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
          }
        )
      }
    );
  });
  var ITEM_NAME$2 = "RovingFocusGroupItem";
  var RovingFocusGroupItem = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeRovingFocusGroup,
        focusable = true,
        active = false,
        tabStopId,
        children,
        ...itemProps
      } = props;
      const autoId = useId();
      const id = tabStopId || autoId;
      const context = useRovingFocusContext(ITEM_NAME$2, __scopeRovingFocusGroup);
      const isCurrentTabStop = context.currentTabStopId === id;
      const getItems = useCollection$2(__scopeRovingFocusGroup);
      const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
      React__namespace.useEffect(() => {
        if (focusable) {
          onFocusableItemAdd();
          return () => onFocusableItemRemove();
        }
      }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Collection$2.ItemSlot,
        {
          scope: __scopeRovingFocusGroup,
          id,
          focusable,
          active,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.span,
            {
              tabIndex: isCurrentTabStop ? 0 : -1,
              "data-orientation": context.orientation,
              ...itemProps,
              ref: forwardedRef,
              onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
                if (!focusable) event.preventDefault();
                else context.onItemFocus(id);
              }),
              onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
              onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
                if (event.key === "Tab" && event.shiftKey) {
                  context.onItemShiftTab();
                  return;
                }
                if (event.target !== event.currentTarget) return;
                const focusIntent = getFocusIntent(event, context.orientation, context.dir);
                if (focusIntent !== void 0) {
                  if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                  event.preventDefault();
                  const items = getItems().filter((item) => item.focusable);
                  let candidateNodes = items.map((item) => item.ref.current);
                  if (focusIntent === "last") candidateNodes.reverse();
                  else if (focusIntent === "prev" || focusIntent === "next") {
                    if (focusIntent === "prev") candidateNodes.reverse();
                    const currentIndex = candidateNodes.indexOf(event.currentTarget);
                    candidateNodes = context.loop ? wrapArray$1(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                  }
                  setTimeout(() => focusFirst$1(candidateNodes));
                }
              }),
              children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
            }
          )
        }
      );
    }
  );
  RovingFocusGroupItem.displayName = ITEM_NAME$2;
  var MAP_KEY_TO_FOCUS_INTENT = {
    ArrowLeft: "prev",
    ArrowUp: "prev",
    ArrowRight: "next",
    ArrowDown: "next",
    PageUp: "first",
    Home: "first",
    PageDown: "last",
    End: "last"
  };
  function getDirectionAwareKey(key, dir) {
    if (dir !== "rtl") return key;
    return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
  }
  function getFocusIntent(event, orientation, dir) {
    const key = getDirectionAwareKey(event.key, dir);
    if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
    if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
    return MAP_KEY_TO_FOCUS_INTENT[key];
  }
  function focusFirst$1(candidates, preventScroll = false) {
    const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
    for (const candidate of candidates) {
      if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
      candidate.focus({ preventScroll });
      if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
    }
  }
  function wrapArray$1(array, startIndex) {
    return array.map((_, index2) => array[(startIndex + index2) % array.length]);
  }
  var Root$7 = RovingFocusGroup;
  var Item$2 = RovingFocusGroupItem;
  var TABS_NAME = "Tabs";
  var [createTabsContext, createTabsScope] = createContextScope(TABS_NAME, [
    createRovingFocusGroupScope
  ]);
  var useRovingFocusGroupScope = createRovingFocusGroupScope();
  var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
  var Tabs$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeTabs,
        value: valueProp,
        onValueChange,
        defaultValue,
        orientation = "horizontal",
        dir,
        activationMode = "automatic",
        ...tabsProps
      } = props;
      const direction = useDirection(dir);
      const [value, setValue] = useControllableState({
        prop: valueProp,
        onChange: onValueChange,
        defaultProp: defaultValue ?? "",
        caller: TABS_NAME
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabsProvider,
        {
          scope: __scopeTabs,
          baseId: useId(),
          value,
          onValueChange: setValue,
          orientation,
          dir: direction,
          activationMode,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.div,
            {
              dir: direction,
              "data-orientation": orientation,
              ...tabsProps,
              ref: forwardedRef
            }
          )
        }
      );
    }
  );
  Tabs$1.displayName = TABS_NAME;
  var TAB_LIST_NAME = "TabsList";
  var TabsList$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeTabs, loop = true, ...listProps } = props;
      const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
      const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Root$7,
        {
          asChild: true,
          ...rovingFocusGroupScope,
          orientation: context.orientation,
          dir: context.dir,
          loop,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.div,
            {
              role: "tablist",
              "aria-orientation": context.orientation,
              ...listProps,
              ref: forwardedRef
            }
          )
        }
      );
    }
  );
  TabsList$1.displayName = TAB_LIST_NAME;
  var TRIGGER_NAME$4 = "TabsTrigger";
  var TabsTrigger$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
      const context = useTabsContext(TRIGGER_NAME$4, __scopeTabs);
      const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
      const triggerId = makeTriggerId(context.baseId, value);
      const contentId = makeContentId(context.baseId, value);
      const isSelected = value === context.value;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Item$2,
        {
          asChild: true,
          ...rovingFocusGroupScope,
          focusable: !disabled,
          active: isSelected,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.button,
            {
              type: "button",
              role: "tab",
              "aria-selected": isSelected,
              "aria-controls": contentId,
              "data-state": isSelected ? "active" : "inactive",
              "data-disabled": disabled ? "" : void 0,
              disabled,
              id: triggerId,
              ...triggerProps,
              ref: forwardedRef,
              onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
                if (!disabled && event.button === 0 && event.ctrlKey === false) {
                  context.onValueChange(value);
                } else {
                  event.preventDefault();
                }
              }),
              onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
                if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
              }),
              onFocus: composeEventHandlers(props.onFocus, () => {
                const isAutomaticActivation = context.activationMode !== "manual";
                if (!isSelected && !disabled && isAutomaticActivation) {
                  context.onValueChange(value);
                }
              })
            }
          )
        }
      );
    }
  );
  TabsTrigger$1.displayName = TRIGGER_NAME$4;
  var CONTENT_NAME$3 = "TabsContent";
  var TabsContent$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
      const context = useTabsContext(CONTENT_NAME$3, __scopeTabs);
      const triggerId = makeTriggerId(context.baseId, value);
      const contentId = makeContentId(context.baseId, value);
      const isSelected = value === context.value;
      const isMountAnimationPreventedRef = React__namespace.useRef(isSelected);
      React__namespace.useEffect(() => {
        const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
        return () => cancelAnimationFrame(rAF);
      }, []);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-state": isSelected ? "active" : "inactive",
          "data-orientation": context.orientation,
          role: "tabpanel",
          "aria-labelledby": triggerId,
          hidden: !present,
          id: contentId,
          tabIndex: 0,
          ...contentProps,
          ref: forwardedRef,
          style: {
            ...props.style,
            animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
          },
          children: present && children
        }
      ) });
    }
  );
  TabsContent$1.displayName = CONTENT_NAME$3;
  function makeTriggerId(baseId, value) {
    return `${baseId}-trigger-${value}`;
  }
  function makeContentId(baseId, value) {
    return `${baseId}-content-${value}`;
  }
  var Root2$2 = Tabs$1;
  var List = TabsList$1;
  var Trigger$2 = TabsTrigger$1;
  var Content$1 = TabsContent$1;
  const Tabs = Root2$2;
  const TabsList = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      ref,
      className: cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      ),
      ...props
    }
  ));
  TabsList.displayName = List.displayName;
  const TabsTrigger = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger$2,
    {
      ref,
      className: cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className
      ),
      ...props
    }
  ));
  TabsTrigger.displayName = Trigger$2.displayName;
  const TabsContent = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content$1,
    {
      ref,
      className: cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      ),
      ...props
    }
  ));
  TabsContent.displayName = Content$1.displayName;
  const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
      variants: {
        variant: {
          default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
          secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
          destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
          outline: "text-foreground"
        }
      },
      defaultVariants: {
        variant: "default"
      }
    }
  );
  function Badge({ className, variant, ...props }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
  }
  const Card = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      ),
      ...props
    }
  ));
  Card.displayName = "Card";
  const CardHeader = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("flex flex-col space-y-1.5 p-6", className),
      ...props
    }
  ));
  CardHeader.displayName = "CardHeader";
  const CardTitle = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "h3",
    {
      ref,
      className: cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      ),
      ...props
    }
  ));
  CardTitle.displayName = "CardTitle";
  const CardDescription = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "p",
    {
      ref,
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  ));
  CardDescription.displayName = "CardDescription";
  const CardContent = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
  CardContent.displayName = "CardContent";
  const CardFooter = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("flex items-center p-6 pt-0", className),
      ...props
    }
  ));
  CardFooter.displayName = "CardFooter";
  const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
      variants: {
        variant: {
          default: "bg-primary text-primary-foreground hover:bg-primary/90",
          destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
          default: "h-10 px-4 py-2",
          sm: "h-9 rounded-md px-3",
          lg: "h-11 rounded-md px-8",
          icon: "h-10 w-10"
        }
      },
      defaultVariants: {
        variant: "default",
        size: "default"
      }
    }
  );
  const Button = React__namespace.forwardRef(
    ({ className, variant, size: size2, asChild = false, ...props }, ref) => {
      const Comp = asChild ? Slot$1 : "button";
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Comp,
        {
          className: cn(buttonVariants({ variant, size: size2, className })),
          ref,
          ...props
        }
      );
    }
  );
  Button.displayName = "Button";
  const Textarea = React__namespace.forwardRef(
    ({ className, ...props }, ref) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          className: cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          ),
          ref,
          ...props
        }
      );
    }
  );
  Textarea.displayName = "Textarea";
  const Input = React__namespace.forwardRef(
    ({ className, type, ...props }, ref) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type,
          className: cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          ),
          ref,
          ...props
        }
      );
    }
  );
  Input.displayName = "Input";
  var NAME$1 = "Label";
  var Label$2 = React__namespace.forwardRef((props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.label,
      {
        ...props,
        ref: forwardedRef,
        onMouseDown: (event) => {
          var _a2;
          const target = event.target;
          if (target.closest("button, input, select, textarea")) return;
          (_a2 = props.onMouseDown) == null ? void 0 : _a2.call(props, event);
          if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
        }
      }
    );
  });
  Label$2.displayName = NAME$1;
  var Root$6 = Label$2;
  const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  );
  const Label$1 = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root$6,
    {
      ref,
      className: cn(labelVariants(), className),
      ...props
    }
  ));
  Label$1.displayName = Root$6.displayName;
  var PROGRESS_NAME = "Progress";
  var DEFAULT_MAX = 100;
  var [createProgressContext, createProgressScope] = createContextScope(PROGRESS_NAME);
  var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
  var Progress$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeProgress,
        value: valueProp = null,
        max: maxProp,
        getValueLabel = defaultGetValueLabel,
        ...progressProps
      } = props;
      if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
        console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
      }
      const max2 = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
      if (valueProp !== null && !isValidValueNumber(valueProp, max2)) {
        console.error(getInvalidValueError(`${valueProp}`, "Progress"));
      }
      const value = isValidValueNumber(valueProp, max2) ? valueProp : null;
      const valueLabel = isNumber(value) ? getValueLabel(value, max2) : void 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max: max2, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "aria-valuemax": max2,
          "aria-valuemin": 0,
          "aria-valuenow": isNumber(value) ? value : void 0,
          "aria-valuetext": valueLabel,
          role: "progressbar",
          "data-state": getProgressState(value, max2),
          "data-value": value ?? void 0,
          "data-max": max2,
          ...progressProps,
          ref: forwardedRef
        }
      ) });
    }
  );
  Progress$1.displayName = PROGRESS_NAME;
  var INDICATOR_NAME$1 = "ProgressIndicator";
  var ProgressIndicator = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeProgress, ...indicatorProps } = props;
      const context = useProgressContext(INDICATOR_NAME$1, __scopeProgress);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-state": getProgressState(context.value, context.max),
          "data-value": context.value ?? void 0,
          "data-max": context.max,
          ...indicatorProps,
          ref: forwardedRef
        }
      );
    }
  );
  ProgressIndicator.displayName = INDICATOR_NAME$1;
  function defaultGetValueLabel(value, max2) {
    return `${Math.round(value / max2 * 100)}%`;
  }
  function getProgressState(value, maxValue) {
    return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
  }
  function isNumber(value) {
    return typeof value === "number";
  }
  function isValidMaxNumber(max2) {
    return isNumber(max2) && !isNaN(max2) && max2 > 0;
  }
  function isValidValueNumber(value, max2) {
    return isNumber(value) && !isNaN(value) && value <= max2 && value >= 0;
  }
  function getInvalidMaxError(propValue, componentName) {
    return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
  }
  function getInvalidValueError(propValue, componentName) {
    return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
  }
  var Root$5 = Progress$1;
  var Indicator = ProgressIndicator;
  const Progress = React__namespace.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root$5,
    {
      ref,
      className: cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          className: "h-full w-full flex-1 bg-primary transition-all",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    }
  ));
  Progress.displayName = Root$5.displayName;
  var SchemaType;
  (function(SchemaType2) {
    SchemaType2["STRING"] = "string";
    SchemaType2["NUMBER"] = "number";
    SchemaType2["INTEGER"] = "integer";
    SchemaType2["BOOLEAN"] = "boolean";
    SchemaType2["ARRAY"] = "array";
    SchemaType2["OBJECT"] = "object";
  })(SchemaType || (SchemaType = {}));
  /**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var ExecutableCodeLanguage;
  (function(ExecutableCodeLanguage2) {
    ExecutableCodeLanguage2["LANGUAGE_UNSPECIFIED"] = "language_unspecified";
    ExecutableCodeLanguage2["PYTHON"] = "python";
  })(ExecutableCodeLanguage || (ExecutableCodeLanguage = {}));
  var Outcome;
  (function(Outcome2) {
    Outcome2["OUTCOME_UNSPECIFIED"] = "outcome_unspecified";
    Outcome2["OUTCOME_OK"] = "outcome_ok";
    Outcome2["OUTCOME_FAILED"] = "outcome_failed";
    Outcome2["OUTCOME_DEADLINE_EXCEEDED"] = "outcome_deadline_exceeded";
  })(Outcome || (Outcome = {}));
  /**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const POSSIBLE_ROLES = ["user", "model", "function", "system"];
  var HarmCategory;
  (function(HarmCategory2) {
    HarmCategory2["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
    HarmCategory2["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
    HarmCategory2["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
    HarmCategory2["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
    HarmCategory2["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
    HarmCategory2["HARM_CATEGORY_CIVIC_INTEGRITY"] = "HARM_CATEGORY_CIVIC_INTEGRITY";
  })(HarmCategory || (HarmCategory = {}));
  var HarmBlockThreshold;
  (function(HarmBlockThreshold2) {
    HarmBlockThreshold2["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
    HarmBlockThreshold2["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
    HarmBlockThreshold2["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
    HarmBlockThreshold2["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
    HarmBlockThreshold2["BLOCK_NONE"] = "BLOCK_NONE";
  })(HarmBlockThreshold || (HarmBlockThreshold = {}));
  var HarmProbability;
  (function(HarmProbability2) {
    HarmProbability2["HARM_PROBABILITY_UNSPECIFIED"] = "HARM_PROBABILITY_UNSPECIFIED";
    HarmProbability2["NEGLIGIBLE"] = "NEGLIGIBLE";
    HarmProbability2["LOW"] = "LOW";
    HarmProbability2["MEDIUM"] = "MEDIUM";
    HarmProbability2["HIGH"] = "HIGH";
  })(HarmProbability || (HarmProbability = {}));
  var BlockReason;
  (function(BlockReason2) {
    BlockReason2["BLOCKED_REASON_UNSPECIFIED"] = "BLOCKED_REASON_UNSPECIFIED";
    BlockReason2["SAFETY"] = "SAFETY";
    BlockReason2["OTHER"] = "OTHER";
  })(BlockReason || (BlockReason = {}));
  var FinishReason;
  (function(FinishReason2) {
    FinishReason2["FINISH_REASON_UNSPECIFIED"] = "FINISH_REASON_UNSPECIFIED";
    FinishReason2["STOP"] = "STOP";
    FinishReason2["MAX_TOKENS"] = "MAX_TOKENS";
    FinishReason2["SAFETY"] = "SAFETY";
    FinishReason2["RECITATION"] = "RECITATION";
    FinishReason2["LANGUAGE"] = "LANGUAGE";
    FinishReason2["BLOCKLIST"] = "BLOCKLIST";
    FinishReason2["PROHIBITED_CONTENT"] = "PROHIBITED_CONTENT";
    FinishReason2["SPII"] = "SPII";
    FinishReason2["MALFORMED_FUNCTION_CALL"] = "MALFORMED_FUNCTION_CALL";
    FinishReason2["OTHER"] = "OTHER";
  })(FinishReason || (FinishReason = {}));
  var TaskType;
  (function(TaskType2) {
    TaskType2["TASK_TYPE_UNSPECIFIED"] = "TASK_TYPE_UNSPECIFIED";
    TaskType2["RETRIEVAL_QUERY"] = "RETRIEVAL_QUERY";
    TaskType2["RETRIEVAL_DOCUMENT"] = "RETRIEVAL_DOCUMENT";
    TaskType2["SEMANTIC_SIMILARITY"] = "SEMANTIC_SIMILARITY";
    TaskType2["CLASSIFICATION"] = "CLASSIFICATION";
    TaskType2["CLUSTERING"] = "CLUSTERING";
  })(TaskType || (TaskType = {}));
  var FunctionCallingMode;
  (function(FunctionCallingMode2) {
    FunctionCallingMode2["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
    FunctionCallingMode2["AUTO"] = "AUTO";
    FunctionCallingMode2["ANY"] = "ANY";
    FunctionCallingMode2["NONE"] = "NONE";
  })(FunctionCallingMode || (FunctionCallingMode = {}));
  var DynamicRetrievalMode;
  (function(DynamicRetrievalMode2) {
    DynamicRetrievalMode2["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
    DynamicRetrievalMode2["MODE_DYNAMIC"] = "MODE_DYNAMIC";
  })(DynamicRetrievalMode || (DynamicRetrievalMode = {}));
  /**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class GoogleGenerativeAIError extends Error {
    constructor(message) {
      super(`[GoogleGenerativeAI Error]: ${message}`);
    }
  }
  class GoogleGenerativeAIResponseError extends GoogleGenerativeAIError {
    constructor(message, response) {
      super(message);
      this.response = response;
    }
  }
  class GoogleGenerativeAIFetchError extends GoogleGenerativeAIError {
    constructor(message, status, statusText, errorDetails) {
      super(message);
      this.status = status;
      this.statusText = statusText;
      this.errorDetails = errorDetails;
    }
  }
  class GoogleGenerativeAIRequestInputError extends GoogleGenerativeAIError {
  }
  class GoogleGenerativeAIAbortError extends GoogleGenerativeAIError {
  }
  /**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com";
  const DEFAULT_API_VERSION = "v1beta";
  const PACKAGE_VERSION = "0.24.1";
  const PACKAGE_LOG_HEADER = "genai-js";
  var Task;
  (function(Task2) {
    Task2["GENERATE_CONTENT"] = "generateContent";
    Task2["STREAM_GENERATE_CONTENT"] = "streamGenerateContent";
    Task2["COUNT_TOKENS"] = "countTokens";
    Task2["EMBED_CONTENT"] = "embedContent";
    Task2["BATCH_EMBED_CONTENTS"] = "batchEmbedContents";
  })(Task || (Task = {}));
  class RequestUrl {
    constructor(model, task, apiKey, stream, requestOptions) {
      this.model = model;
      this.task = task;
      this.apiKey = apiKey;
      this.stream = stream;
      this.requestOptions = requestOptions;
    }
    toString() {
      var _a2, _b2;
      const apiVersion = ((_a2 = this.requestOptions) === null || _a2 === void 0 ? void 0 : _a2.apiVersion) || DEFAULT_API_VERSION;
      const baseUrl = ((_b2 = this.requestOptions) === null || _b2 === void 0 ? void 0 : _b2.baseUrl) || DEFAULT_BASE_URL;
      let url = `${baseUrl}/${apiVersion}/${this.model}:${this.task}`;
      if (this.stream) {
        url += "?alt=sse";
      }
      return url;
    }
  }
  function getClientHeaders(requestOptions) {
    const clientHeaders = [];
    if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.apiClient) {
      clientHeaders.push(requestOptions.apiClient);
    }
    clientHeaders.push(`${PACKAGE_LOG_HEADER}/${PACKAGE_VERSION}`);
    return clientHeaders.join(" ");
  }
  async function getHeaders(url) {
    var _a2;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("x-goog-api-client", getClientHeaders(url.requestOptions));
    headers.append("x-goog-api-key", url.apiKey);
    let customHeaders = (_a2 = url.requestOptions) === null || _a2 === void 0 ? void 0 : _a2.customHeaders;
    if (customHeaders) {
      if (!(customHeaders instanceof Headers)) {
        try {
          customHeaders = new Headers(customHeaders);
        } catch (e) {
          throw new GoogleGenerativeAIRequestInputError(`unable to convert customHeaders value ${JSON.stringify(customHeaders)} to Headers: ${e.message}`);
        }
      }
      for (const [headerName, headerValue] of customHeaders.entries()) {
        if (headerName === "x-goog-api-key") {
          throw new GoogleGenerativeAIRequestInputError(`Cannot set reserved header name ${headerName}`);
        } else if (headerName === "x-goog-api-client") {
          throw new GoogleGenerativeAIRequestInputError(`Header name ${headerName} can only be set using the apiClient field`);
        }
        headers.append(headerName, headerValue);
      }
    }
    return headers;
  }
  async function constructModelRequest(model, task, apiKey, stream, body, requestOptions) {
    const url = new RequestUrl(model, task, apiKey, stream, requestOptions);
    return {
      url: url.toString(),
      fetchOptions: Object.assign(Object.assign({}, buildFetchOptions(requestOptions)), { method: "POST", headers: await getHeaders(url), body })
    };
  }
  async function makeModelRequest(model, task, apiKey, stream, body, requestOptions = {}, fetchFn = fetch) {
    const { url, fetchOptions } = await constructModelRequest(model, task, apiKey, stream, body, requestOptions);
    return makeRequest(url, fetchOptions, fetchFn);
  }
  async function makeRequest(url, fetchOptions, fetchFn = fetch) {
    let response;
    try {
      response = await fetchFn(url, fetchOptions);
    } catch (e) {
      handleResponseError(e, url);
    }
    if (!response.ok) {
      await handleResponseNotOk(response, url);
    }
    return response;
  }
  function handleResponseError(e, url) {
    let err = e;
    if (err.name === "AbortError") {
      err = new GoogleGenerativeAIAbortError(`Request aborted when fetching ${url.toString()}: ${e.message}`);
      err.stack = e.stack;
    } else if (!(e instanceof GoogleGenerativeAIFetchError || e instanceof GoogleGenerativeAIRequestInputError)) {
      err = new GoogleGenerativeAIError(`Error fetching from ${url.toString()}: ${e.message}`);
      err.stack = e.stack;
    }
    throw err;
  }
  async function handleResponseNotOk(response, url) {
    let message = "";
    let errorDetails;
    try {
      const json = await response.json();
      message = json.error.message;
      if (json.error.details) {
        message += ` ${JSON.stringify(json.error.details)}`;
        errorDetails = json.error.details;
      }
    } catch (e) {
    }
    throw new GoogleGenerativeAIFetchError(`Error fetching from ${url.toString()}: [${response.status} ${response.statusText}] ${message}`, response.status, response.statusText, errorDetails);
  }
  function buildFetchOptions(requestOptions) {
    const fetchOptions = {};
    if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) !== void 0 || (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
      const controller = new AbortController();
      if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
        setTimeout(() => controller.abort(), requestOptions.timeout);
      }
      if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) {
        requestOptions.signal.addEventListener("abort", () => {
          controller.abort();
        });
      }
      fetchOptions.signal = controller.signal;
    }
    return fetchOptions;
  }
  /**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function addHelpers(response) {
    response.text = () => {
      if (response.candidates && response.candidates.length > 0) {
        if (response.candidates.length > 1) {
          console.warn(`This response had ${response.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`);
        }
        if (hadBadFinishReason(response.candidates[0])) {
          throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
        }
        return getText(response);
      } else if (response.promptFeedback) {
        throw new GoogleGenerativeAIResponseError(`Text not available. ${formatBlockErrorMessage(response)}`, response);
      }
      return "";
    };
    response.functionCall = () => {
      if (response.candidates && response.candidates.length > 0) {
        if (response.candidates.length > 1) {
          console.warn(`This response had ${response.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`);
        }
        if (hadBadFinishReason(response.candidates[0])) {
          throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
        }
        console.warn(`response.functionCall() is deprecated. Use response.functionCalls() instead.`);
        return getFunctionCalls(response)[0];
      } else if (response.promptFeedback) {
        throw new GoogleGenerativeAIResponseError(`Function call not available. ${formatBlockErrorMessage(response)}`, response);
      }
      return void 0;
    };
    response.functionCalls = () => {
      if (response.candidates && response.candidates.length > 0) {
        if (response.candidates.length > 1) {
          console.warn(`This response had ${response.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`);
        }
        if (hadBadFinishReason(response.candidates[0])) {
          throw new GoogleGenerativeAIResponseError(`${formatBlockErrorMessage(response)}`, response);
        }
        return getFunctionCalls(response);
      } else if (response.promptFeedback) {
        throw new GoogleGenerativeAIResponseError(`Function call not available. ${formatBlockErrorMessage(response)}`, response);
      }
      return void 0;
    };
    return response;
  }
  function getText(response) {
    var _a2, _b2, _c2, _d2;
    const textStrings = [];
    if ((_b2 = (_a2 = response.candidates) === null || _a2 === void 0 ? void 0 : _a2[0].content) === null || _b2 === void 0 ? void 0 : _b2.parts) {
      for (const part of (_d2 = (_c2 = response.candidates) === null || _c2 === void 0 ? void 0 : _c2[0].content) === null || _d2 === void 0 ? void 0 : _d2.parts) {
        if (part.text) {
          textStrings.push(part.text);
        }
        if (part.executableCode) {
          textStrings.push("\n```" + part.executableCode.language + "\n" + part.executableCode.code + "\n```\n");
        }
        if (part.codeExecutionResult) {
          textStrings.push("\n```\n" + part.codeExecutionResult.output + "\n```\n");
        }
      }
    }
    if (textStrings.length > 0) {
      return textStrings.join("");
    } else {
      return "";
    }
  }
  function getFunctionCalls(response) {
    var _a2, _b2, _c2, _d2;
    const functionCalls = [];
    if ((_b2 = (_a2 = response.candidates) === null || _a2 === void 0 ? void 0 : _a2[0].content) === null || _b2 === void 0 ? void 0 : _b2.parts) {
      for (const part of (_d2 = (_c2 = response.candidates) === null || _c2 === void 0 ? void 0 : _c2[0].content) === null || _d2 === void 0 ? void 0 : _d2.parts) {
        if (part.functionCall) {
          functionCalls.push(part.functionCall);
        }
      }
    }
    if (functionCalls.length > 0) {
      return functionCalls;
    } else {
      return void 0;
    }
  }
  const badFinishReasons = [
    FinishReason.RECITATION,
    FinishReason.SAFETY,
    FinishReason.LANGUAGE
  ];
  function hadBadFinishReason(candidate) {
    return !!candidate.finishReason && badFinishReasons.includes(candidate.finishReason);
  }
  function formatBlockErrorMessage(response) {
    var _a2, _b2, _c2;
    let message = "";
    if ((!response.candidates || response.candidates.length === 0) && response.promptFeedback) {
      message += "Response was blocked";
      if ((_a2 = response.promptFeedback) === null || _a2 === void 0 ? void 0 : _a2.blockReason) {
        message += ` due to ${response.promptFeedback.blockReason}`;
      }
      if ((_b2 = response.promptFeedback) === null || _b2 === void 0 ? void 0 : _b2.blockReasonMessage) {
        message += `: ${response.promptFeedback.blockReasonMessage}`;
      }
    } else if ((_c2 = response.candidates) === null || _c2 === void 0 ? void 0 : _c2[0]) {
      const firstCandidate = response.candidates[0];
      if (hadBadFinishReason(firstCandidate)) {
        message += `Candidate was blocked due to ${firstCandidate.finishReason}`;
        if (firstCandidate.finishMessage) {
          message += `: ${firstCandidate.finishMessage}`;
        }
      }
    }
    return message;
  }
  function __await(v2) {
    return this instanceof __await ? (this.v = v2, this) : new __await(v2);
  }
  function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q2 = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function verb(n2) {
      if (g[n2]) i[n2] = function(v2) {
        return new Promise(function(a, b) {
          q2.push([n2, v2, a, b]) > 1 || resume(n2, v2);
        });
      };
    }
    function resume(n2, v2) {
      try {
        step(g[n2](v2));
      } catch (e) {
        settle(q2[0][3], e);
      }
    }
    function step(r2) {
      r2.value instanceof __await ? Promise.resolve(r2.value.v).then(fulfill, reject) : settle(q2[0][2], r2);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f2, v2) {
      if (f2(v2), q2.shift(), q2.length) resume(q2[0][0], q2[0][1]);
    }
  }
  typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };
  /**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const responseLineRE = /^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
  function processStream(response) {
    const inputStream = response.body.pipeThrough(new TextDecoderStream("utf8", { fatal: true }));
    const responseStream = getResponseStream(inputStream);
    const [stream1, stream2] = responseStream.tee();
    return {
      stream: generateResponseSequence(stream1),
      response: getResponsePromise(stream2)
    };
  }
  async function getResponsePromise(stream) {
    const allResponses = [];
    const reader = stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return addHelpers(aggregateResponses(allResponses));
      }
      allResponses.push(value);
    }
  }
  function generateResponseSequence(stream) {
    return __asyncGenerator(this, arguments, function* generateResponseSequence_1() {
      const reader = stream.getReader();
      while (true) {
        const { value, done } = yield __await(reader.read());
        if (done) {
          break;
        }
        yield yield __await(addHelpers(value));
      }
    });
  }
  function getResponseStream(inputStream) {
    const reader = inputStream.getReader();
    const stream = new ReadableStream({
      start(controller) {
        let currentText = "";
        return pump();
        function pump() {
          return reader.read().then(({ value, done }) => {
            if (done) {
              if (currentText.trim()) {
                controller.error(new GoogleGenerativeAIError("Failed to parse stream"));
                return;
              }
              controller.close();
              return;
            }
            currentText += value;
            let match = currentText.match(responseLineRE);
            let parsedResponse;
            while (match) {
              try {
                parsedResponse = JSON.parse(match[1]);
              } catch (e) {
                controller.error(new GoogleGenerativeAIError(`Error parsing JSON response: "${match[1]}"`));
                return;
              }
              controller.enqueue(parsedResponse);
              currentText = currentText.substring(match[0].length);
              match = currentText.match(responseLineRE);
            }
            return pump();
          }).catch((e) => {
            let err = e;
            err.stack = e.stack;
            if (err.name === "AbortError") {
              err = new GoogleGenerativeAIAbortError("Request aborted when reading from the stream");
            } else {
              err = new GoogleGenerativeAIError("Error reading from the stream");
            }
            throw err;
          });
        }
      }
    });
    return stream;
  }
  function aggregateResponses(responses) {
    const lastResponse = responses[responses.length - 1];
    const aggregatedResponse = {
      promptFeedback: lastResponse === null || lastResponse === void 0 ? void 0 : lastResponse.promptFeedback
    };
    for (const response of responses) {
      if (response.candidates) {
        let candidateIndex = 0;
        for (const candidate of response.candidates) {
          if (!aggregatedResponse.candidates) {
            aggregatedResponse.candidates = [];
          }
          if (!aggregatedResponse.candidates[candidateIndex]) {
            aggregatedResponse.candidates[candidateIndex] = {
              index: candidateIndex
            };
          }
          aggregatedResponse.candidates[candidateIndex].citationMetadata = candidate.citationMetadata;
          aggregatedResponse.candidates[candidateIndex].groundingMetadata = candidate.groundingMetadata;
          aggregatedResponse.candidates[candidateIndex].finishReason = candidate.finishReason;
          aggregatedResponse.candidates[candidateIndex].finishMessage = candidate.finishMessage;
          aggregatedResponse.candidates[candidateIndex].safetyRatings = candidate.safetyRatings;
          if (candidate.content && candidate.content.parts) {
            if (!aggregatedResponse.candidates[candidateIndex].content) {
              aggregatedResponse.candidates[candidateIndex].content = {
                role: candidate.content.role || "user",
                parts: []
              };
            }
            const newPart = {};
            for (const part of candidate.content.parts) {
              if (part.text) {
                newPart.text = part.text;
              }
              if (part.functionCall) {
                newPart.functionCall = part.functionCall;
              }
              if (part.executableCode) {
                newPart.executableCode = part.executableCode;
              }
              if (part.codeExecutionResult) {
                newPart.codeExecutionResult = part.codeExecutionResult;
              }
              if (Object.keys(newPart).length === 0) {
                newPart.text = "";
              }
              aggregatedResponse.candidates[candidateIndex].content.parts.push(newPart);
            }
          }
        }
        candidateIndex++;
      }
      if (response.usageMetadata) {
        aggregatedResponse.usageMetadata = response.usageMetadata;
      }
    }
    return aggregatedResponse;
  }
  /**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function generateContentStream(apiKey, model, params, requestOptions) {
    const response = await makeModelRequest(
      model,
      Task.STREAM_GENERATE_CONTENT,
      apiKey,
      /* stream */
      true,
      JSON.stringify(params),
      requestOptions
    );
    return processStream(response);
  }
  async function generateContent(apiKey, model, params, requestOptions) {
    const response = await makeModelRequest(
      model,
      Task.GENERATE_CONTENT,
      apiKey,
      /* stream */
      false,
      JSON.stringify(params),
      requestOptions
    );
    const responseJson = await response.json();
    const enhancedResponse = addHelpers(responseJson);
    return {
      response: enhancedResponse
    };
  }
  /**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function formatSystemInstruction(input) {
    if (input == null) {
      return void 0;
    } else if (typeof input === "string") {
      return { role: "system", parts: [{ text: input }] };
    } else if (input.text) {
      return { role: "system", parts: [input] };
    } else if (input.parts) {
      if (!input.role) {
        return { role: "system", parts: input.parts };
      } else {
        return input;
      }
    }
  }
  function formatNewContent(request) {
    let newParts = [];
    if (typeof request === "string") {
      newParts = [{ text: request }];
    } else {
      for (const partOrString of request) {
        if (typeof partOrString === "string") {
          newParts.push({ text: partOrString });
        } else {
          newParts.push(partOrString);
        }
      }
    }
    return assignRoleToPartsAndValidateSendMessageRequest(newParts);
  }
  function assignRoleToPartsAndValidateSendMessageRequest(parts) {
    const userContent = { role: "user", parts: [] };
    const functionContent = { role: "function", parts: [] };
    let hasUserContent = false;
    let hasFunctionContent = false;
    for (const part of parts) {
      if ("functionResponse" in part) {
        functionContent.parts.push(part);
        hasFunctionContent = true;
      } else {
        userContent.parts.push(part);
        hasUserContent = true;
      }
    }
    if (hasUserContent && hasFunctionContent) {
      throw new GoogleGenerativeAIError("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");
    }
    if (!hasUserContent && !hasFunctionContent) {
      throw new GoogleGenerativeAIError("No content is provided for sending chat message.");
    }
    if (hasUserContent) {
      return userContent;
    }
    return functionContent;
  }
  function formatCountTokensInput(params, modelParams) {
    var _a2;
    let formattedGenerateContentRequest = {
      model: modelParams === null || modelParams === void 0 ? void 0 : modelParams.model,
      generationConfig: modelParams === null || modelParams === void 0 ? void 0 : modelParams.generationConfig,
      safetySettings: modelParams === null || modelParams === void 0 ? void 0 : modelParams.safetySettings,
      tools: modelParams === null || modelParams === void 0 ? void 0 : modelParams.tools,
      toolConfig: modelParams === null || modelParams === void 0 ? void 0 : modelParams.toolConfig,
      systemInstruction: modelParams === null || modelParams === void 0 ? void 0 : modelParams.systemInstruction,
      cachedContent: (_a2 = modelParams === null || modelParams === void 0 ? void 0 : modelParams.cachedContent) === null || _a2 === void 0 ? void 0 : _a2.name,
      contents: []
    };
    const containsGenerateContentRequest = params.generateContentRequest != null;
    if (params.contents) {
      if (containsGenerateContentRequest) {
        throw new GoogleGenerativeAIRequestInputError("CountTokensRequest must have one of contents or generateContentRequest, not both.");
      }
      formattedGenerateContentRequest.contents = params.contents;
    } else if (containsGenerateContentRequest) {
      formattedGenerateContentRequest = Object.assign(Object.assign({}, formattedGenerateContentRequest), params.generateContentRequest);
    } else {
      const content = formatNewContent(params);
      formattedGenerateContentRequest.contents = [content];
    }
    return { generateContentRequest: formattedGenerateContentRequest };
  }
  function formatGenerateContentInput(params) {
    let formattedRequest;
    if (params.contents) {
      formattedRequest = params;
    } else {
      const content = formatNewContent(params);
      formattedRequest = { contents: [content] };
    }
    if (params.systemInstruction) {
      formattedRequest.systemInstruction = formatSystemInstruction(params.systemInstruction);
    }
    return formattedRequest;
  }
  function formatEmbedContentInput(params) {
    if (typeof params === "string" || Array.isArray(params)) {
      const content = formatNewContent(params);
      return { content };
    }
    return params;
  }
  /**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const VALID_PART_FIELDS = [
    "text",
    "inlineData",
    "functionCall",
    "functionResponse",
    "executableCode",
    "codeExecutionResult"
  ];
  const VALID_PARTS_PER_ROLE = {
    user: ["text", "inlineData"],
    function: ["functionResponse"],
    model: ["text", "functionCall", "executableCode", "codeExecutionResult"],
    // System instructions shouldn't be in history anyway.
    system: ["text"]
  };
  function validateChatHistory(history) {
    let prevContent = false;
    for (const currContent of history) {
      const { role, parts } = currContent;
      if (!prevContent && role !== "user") {
        throw new GoogleGenerativeAIError(`First content should be with role 'user', got ${role}`);
      }
      if (!POSSIBLE_ROLES.includes(role)) {
        throw new GoogleGenerativeAIError(`Each item should include role field. Got ${role} but valid roles are: ${JSON.stringify(POSSIBLE_ROLES)}`);
      }
      if (!Array.isArray(parts)) {
        throw new GoogleGenerativeAIError("Content should have 'parts' property with an array of Parts");
      }
      if (parts.length === 0) {
        throw new GoogleGenerativeAIError("Each Content should have at least one part");
      }
      const countFields = {
        text: 0,
        inlineData: 0,
        functionCall: 0,
        functionResponse: 0,
        fileData: 0,
        executableCode: 0,
        codeExecutionResult: 0
      };
      for (const part of parts) {
        for (const key of VALID_PART_FIELDS) {
          if (key in part) {
            countFields[key] += 1;
          }
        }
      }
      const validParts = VALID_PARTS_PER_ROLE[role];
      for (const key of VALID_PART_FIELDS) {
        if (!validParts.includes(key) && countFields[key] > 0) {
          throw new GoogleGenerativeAIError(`Content with role '${role}' can't contain '${key}' part`);
        }
      }
      prevContent = true;
    }
  }
  function isValidResponse(response) {
    var _a2;
    if (response.candidates === void 0 || response.candidates.length === 0) {
      return false;
    }
    const content = (_a2 = response.candidates[0]) === null || _a2 === void 0 ? void 0 : _a2.content;
    if (content === void 0) {
      return false;
    }
    if (content.parts === void 0 || content.parts.length === 0) {
      return false;
    }
    for (const part of content.parts) {
      if (part === void 0 || Object.keys(part).length === 0) {
        return false;
      }
      if (part.text !== void 0 && part.text === "") {
        return false;
      }
    }
    return true;
  }
  /**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const SILENT_ERROR = "SILENT_ERROR";
  class ChatSession {
    constructor(apiKey, model, params, _requestOptions = {}) {
      this.model = model;
      this.params = params;
      this._requestOptions = _requestOptions;
      this._history = [];
      this._sendPromise = Promise.resolve();
      this._apiKey = apiKey;
      if (params === null || params === void 0 ? void 0 : params.history) {
        validateChatHistory(params.history);
        this._history = params.history;
      }
    }
    /**
     * Gets the chat history so far. Blocked prompts are not added to history.
     * Blocked candidates are not added to history, nor are the prompts that
     * generated them.
     */
    async getHistory() {
      await this._sendPromise;
      return this._history;
    }
    /**
     * Sends a chat message and receives a non-streaming
     * {@link GenerateContentResult}.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */
    async sendMessage(request, requestOptions = {}) {
      var _a2, _b2, _c2, _d2, _e2, _f2;
      await this._sendPromise;
      const newContent = formatNewContent(request);
      const generateContentRequest = {
        safetySettings: (_a2 = this.params) === null || _a2 === void 0 ? void 0 : _a2.safetySettings,
        generationConfig: (_b2 = this.params) === null || _b2 === void 0 ? void 0 : _b2.generationConfig,
        tools: (_c2 = this.params) === null || _c2 === void 0 ? void 0 : _c2.tools,
        toolConfig: (_d2 = this.params) === null || _d2 === void 0 ? void 0 : _d2.toolConfig,
        systemInstruction: (_e2 = this.params) === null || _e2 === void 0 ? void 0 : _e2.systemInstruction,
        cachedContent: (_f2 = this.params) === null || _f2 === void 0 ? void 0 : _f2.cachedContent,
        contents: [...this._history, newContent]
      };
      const chatSessionRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
      let finalResult;
      this._sendPromise = this._sendPromise.then(() => generateContent(this._apiKey, this.model, generateContentRequest, chatSessionRequestOptions)).then((result) => {
        var _a22;
        if (isValidResponse(result.response)) {
          this._history.push(newContent);
          const responseContent = Object.assign({
            parts: [],
            // Response seems to come back without a role set.
            role: "model"
          }, (_a22 = result.response.candidates) === null || _a22 === void 0 ? void 0 : _a22[0].content);
          this._history.push(responseContent);
        } else {
          const blockErrorMessage = formatBlockErrorMessage(result.response);
          if (blockErrorMessage) {
            console.warn(`sendMessage() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
          }
        }
        finalResult = result;
      }).catch((e) => {
        this._sendPromise = Promise.resolve();
        throw e;
      });
      await this._sendPromise;
      return finalResult;
    }
    /**
     * Sends a chat message and receives the response as a
     * {@link GenerateContentStreamResult} containing an iterable stream
     * and a response promise.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */
    async sendMessageStream(request, requestOptions = {}) {
      var _a2, _b2, _c2, _d2, _e2, _f2;
      await this._sendPromise;
      const newContent = formatNewContent(request);
      const generateContentRequest = {
        safetySettings: (_a2 = this.params) === null || _a2 === void 0 ? void 0 : _a2.safetySettings,
        generationConfig: (_b2 = this.params) === null || _b2 === void 0 ? void 0 : _b2.generationConfig,
        tools: (_c2 = this.params) === null || _c2 === void 0 ? void 0 : _c2.tools,
        toolConfig: (_d2 = this.params) === null || _d2 === void 0 ? void 0 : _d2.toolConfig,
        systemInstruction: (_e2 = this.params) === null || _e2 === void 0 ? void 0 : _e2.systemInstruction,
        cachedContent: (_f2 = this.params) === null || _f2 === void 0 ? void 0 : _f2.cachedContent,
        contents: [...this._history, newContent]
      };
      const chatSessionRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
      const streamPromise = generateContentStream(this._apiKey, this.model, generateContentRequest, chatSessionRequestOptions);
      this._sendPromise = this._sendPromise.then(() => streamPromise).catch((_ignored) => {
        throw new Error(SILENT_ERROR);
      }).then((streamResult) => streamResult.response).then((response) => {
        if (isValidResponse(response)) {
          this._history.push(newContent);
          const responseContent = Object.assign({}, response.candidates[0].content);
          if (!responseContent.role) {
            responseContent.role = "model";
          }
          this._history.push(responseContent);
        } else {
          const blockErrorMessage = formatBlockErrorMessage(response);
          if (blockErrorMessage) {
            console.warn(`sendMessageStream() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
          }
        }
      }).catch((e) => {
        if (e.message !== SILENT_ERROR) {
          console.error(e);
        }
      });
      return streamPromise;
    }
  }
  /**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function countTokens(apiKey, model, params, singleRequestOptions) {
    const response = await makeModelRequest(model, Task.COUNT_TOKENS, apiKey, false, JSON.stringify(params), singleRequestOptions);
    return response.json();
  }
  /**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function embedContent(apiKey, model, params, requestOptions) {
    const response = await makeModelRequest(model, Task.EMBED_CONTENT, apiKey, false, JSON.stringify(params), requestOptions);
    return response.json();
  }
  async function batchEmbedContents(apiKey, model, params, requestOptions) {
    const requestsWithModel = params.requests.map((request) => {
      return Object.assign(Object.assign({}, request), { model });
    });
    const response = await makeModelRequest(model, Task.BATCH_EMBED_CONTENTS, apiKey, false, JSON.stringify({ requests: requestsWithModel }), requestOptions);
    return response.json();
  }
  /**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class GenerativeModel {
    constructor(apiKey, modelParams, _requestOptions = {}) {
      this.apiKey = apiKey;
      this._requestOptions = _requestOptions;
      if (modelParams.model.includes("/")) {
        this.model = modelParams.model;
      } else {
        this.model = `models/${modelParams.model}`;
      }
      this.generationConfig = modelParams.generationConfig || {};
      this.safetySettings = modelParams.safetySettings || [];
      this.tools = modelParams.tools;
      this.toolConfig = modelParams.toolConfig;
      this.systemInstruction = formatSystemInstruction(modelParams.systemInstruction);
      this.cachedContent = modelParams.cachedContent;
    }
    /**
     * Makes a single non-streaming call to the model
     * and returns an object containing a single {@link GenerateContentResponse}.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */
    async generateContent(request, requestOptions = {}) {
      var _a2;
      const formattedParams = formatGenerateContentInput(request);
      const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
      return generateContent(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a2 = this.cachedContent) === null || _a2 === void 0 ? void 0 : _a2.name }, formattedParams), generativeModelRequestOptions);
    }
    /**
     * Makes a single streaming call to the model and returns an object
     * containing an iterable stream that iterates over all chunks in the
     * streaming response as well as a promise that returns the final
     * aggregated response.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */
    async generateContentStream(request, requestOptions = {}) {
      var _a2;
      const formattedParams = formatGenerateContentInput(request);
      const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
      return generateContentStream(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a2 = this.cachedContent) === null || _a2 === void 0 ? void 0 : _a2.name }, formattedParams), generativeModelRequestOptions);
    }
    /**
     * Gets a new {@link ChatSession} instance which can be used for
     * multi-turn chats.
     */
    startChat(startChatParams) {
      var _a2;
      return new ChatSession(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (_a2 = this.cachedContent) === null || _a2 === void 0 ? void 0 : _a2.name }, startChatParams), this._requestOptions);
    }
    /**
     * Counts the tokens in the provided request.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */
    async countTokens(request, requestOptions = {}) {
      const formattedParams = formatCountTokensInput(request, {
        model: this.model,
        generationConfig: this.generationConfig,
        safetySettings: this.safetySettings,
        tools: this.tools,
        toolConfig: this.toolConfig,
        systemInstruction: this.systemInstruction,
        cachedContent: this.cachedContent
      });
      const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
      return countTokens(this.apiKey, this.model, formattedParams, generativeModelRequestOptions);
    }
    /**
     * Embeds the provided content.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */
    async embedContent(request, requestOptions = {}) {
      const formattedParams = formatEmbedContentInput(request);
      const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
      return embedContent(this.apiKey, this.model, formattedParams, generativeModelRequestOptions);
    }
    /**
     * Embeds an array of {@link EmbedContentRequest}s.
     *
     * Fields set in the optional {@link SingleRequestOptions} parameter will
     * take precedence over the {@link RequestOptions} values provided to
     * {@link GoogleGenerativeAI.getGenerativeModel }.
     */
    async batchEmbedContents(batchEmbedContentRequest, requestOptions = {}) {
      const generativeModelRequestOptions = Object.assign(Object.assign({}, this._requestOptions), requestOptions);
      return batchEmbedContents(this.apiKey, this.model, batchEmbedContentRequest, generativeModelRequestOptions);
    }
  }
  /**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class GoogleGenerativeAI {
    constructor(apiKey) {
      this.apiKey = apiKey;
    }
    /**
     * Gets a {@link GenerativeModel} instance for the provided model name.
     */
    getGenerativeModel(modelParams, requestOptions) {
      if (!modelParams.model) {
        throw new GoogleGenerativeAIError(`Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })`);
      }
      return new GenerativeModel(this.apiKey, modelParams, requestOptions);
    }
    /**
     * Creates a {@link GenerativeModel} instance from provided content cache.
     */
    getGenerativeModelFromCachedContent(cachedContent, modelParams, requestOptions) {
      if (!cachedContent.name) {
        throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `name` field.");
      }
      if (!cachedContent.model) {
        throw new GoogleGenerativeAIRequestInputError("Cached content must contain a `model` field.");
      }
      const disallowedDuplicates = ["model", "systemInstruction"];
      for (const key of disallowedDuplicates) {
        if ((modelParams === null || modelParams === void 0 ? void 0 : modelParams[key]) && cachedContent[key] && (modelParams === null || modelParams === void 0 ? void 0 : modelParams[key]) !== cachedContent[key]) {
          if (key === "model") {
            const modelParamsComp = modelParams.model.startsWith("models/") ? modelParams.model.replace("models/", "") : modelParams.model;
            const cachedContentComp = cachedContent.model.startsWith("models/") ? cachedContent.model.replace("models/", "") : cachedContent.model;
            if (modelParamsComp === cachedContentComp) {
              continue;
            }
          }
          throw new GoogleGenerativeAIRequestInputError(`Different value for "${key}" specified in modelParams (${modelParams[key]}) and cachedContent (${cachedContent[key]})`);
        }
      }
      const modelParamsFromCache = Object.assign(Object.assign({}, modelParams), { model: cachedContent.model, tools: cachedContent.tools, toolConfig: cachedContent.toolConfig, systemInstruction: cachedContent.systemInstruction, cachedContent });
      return new GenerativeModel(this.apiKey, modelParamsFromCache, requestOptions);
    }
  }
  var define_process_env_default = {};
  const MODEL_NAME = "gemini-pro";
  const API_KEY_STORAGE_KEY$1 = "geminiApiKey";
  function getApiKey() {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY$1);
    if (storedKey) {
      return storedKey;
    }
    const envKey = define_process_env_default.REACT_APP_GEMINI_API_KEY;
    if (envKey) {
      return envKey;
    }
    return null;
  }
  async function generateBlogContent(prompt, apiKeyOverride) {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i;
    const apiKeyToUse = getApiKey();
    if (!apiKeyToUse) {
      const error = new Error("API key is missing. Please set it in Settings or as REACT_APP_GEMINI_API_KEY.");
      error.isApiKeyInvalid = true;
      throw error;
    }
    try {
      const genAI = new GoogleGenerativeAI(apiKeyToUse);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const generationConfig = {
        temperature: 0.9,
        // Controls randomness. Higher is more creative.
        topK: 1,
        // For next-token selection strategy.
        topP: 1,
        // For next-token selection strategy.
        maxOutputTokens: 2048
        // Adjust as needed for blog post length
      };
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }
      ];
      const result = await model.generateContent(
        prompt
        // { // If sending parts instead of a single prompt string
        // generationConfig,
        // safetySettings,
        // }
      );
      if (result.response && typeof result.response.text === "function") {
        const text = result.response.text();
        if (text) {
          return text;
        } else {
          const blockReason = (_a2 = result.response.promptFeedback) == null ? void 0 : _a2.blockReason;
          if (blockReason) {
            throw new Error(`Content generation blocked. Reason: ${blockReason}. Adjust safety settings or prompt if necessary.`);
          }
          const finishReason = (_c2 = (_b2 = result.response.candidates) == null ? void 0 : _b2[0]) == null ? void 0 : _c2.finishReason;
          if (finishReason && finishReason !== "STOP") {
            throw new Error(`Content generation stopped. Reason: ${finishReason}.`);
          }
          throw new Error("Received empty response from Gemini API or content was blocked.");
        }
      } else {
        if ((_i = (_h2 = (_g2 = (_f2 = (_e2 = (_d2 = result.response) == null ? void 0 : _d2.candidates) == null ? void 0 : _e2[0]) == null ? void 0 : _f2.content) == null ? void 0 : _g2.parts) == null ? void 0 : _h2[0]) == null ? void 0 : _i.text) {
          return result.response.candidates[0].content.parts[0].text;
        }
        throw new Error("Could not extract text from Gemini API response. The response structure might be unexpected.");
      }
    } catch (error) {
      console.error("Error calling Gemini API (generateBlogContent):", error);
      const serviceError = new Error(`Gemini API Error: ${error.message || "Unknown error"}`);
      if (error.message && (error.message.includes("API key not valid") || error.message.includes("API key invalid"))) {
        serviceError.isApiKeyInvalid = true;
      }
      throw serviceError;
    }
  }
  async function getChatbotResponse(userPrompt, chatHistory, apiKeyOverride) {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i;
    const apiKeyToUse = getApiKey();
    if (!apiKeyToUse) {
      const error = new Error("API key is missing for chatbot. Please set it in Settings or as REACT_APP_GEMINI_API_KEY.");
      error.isApiKeyInvalid = true;
      throw error;
    }
    try {
      const genAI = new GoogleGenerativeAI(apiKeyToUse);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const chat = model.startChat({
        history: chatHistory,
        // Safety settings can be configured here as well, similar to generateContent
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }
        ],
        generationConfig: {
          maxOutputTokens: 1e3,
          // Adjust as needed for chat response length
          temperature: 0.7
          // Slightly lower temperature for more focused chat responses
        }
      });
      const result = await chat.sendMessage(userPrompt);
      if (result.response && typeof result.response.text === "function") {
        const text = result.response.text();
        if (text) {
          return text;
        } else {
          const blockReason = (_a2 = result.response.promptFeedback) == null ? void 0 : _a2.blockReason;
          if (blockReason) {
            throw new Error(`Chatbot response blocked. Reason: ${blockReason}.`);
          }
          const finishReason = (_c2 = (_b2 = result.response.candidates) == null ? void 0 : _b2[0]) == null ? void 0 : _c2.finishReason;
          if (finishReason && finishReason !== "STOP") {
            throw new Error(`Chatbot response stopped. Reason: ${finishReason}.`);
          }
          throw new Error("Received empty response from Gemini API for chatbot or content was blocked.");
        }
      } else if ((_i = (_h2 = (_g2 = (_f2 = (_e2 = (_d2 = result.response) == null ? void 0 : _d2.candidates) == null ? void 0 : _e2[0]) == null ? void 0 : _f2.content) == null ? void 0 : _g2.parts) == null ? void 0 : _h2[0]) == null ? void 0 : _i.text) {
        return result.response.candidates[0].content.parts[0].text;
      }
      throw new Error("Could not extract text for chatbot response from Gemini API.");
    } catch (error) {
      console.error("Error calling Gemini API (getChatbotResponse):", error);
      const serviceError = new Error(`Gemini Chatbot Error: ${error.message || "Unknown error"}`);
      if (error.message && (error.message.includes("API key not valid") || error.message.includes("API key invalid") || error.message.includes("API key is missing"))) {
        serviceError.isApiKeyInvalid = true;
      }
      throw serviceError;
    }
  }
  const LanguageContext = React$1.createContext(void 0);
  const LanguageProvider = ({ children, defaultLanguage = "en" }) => {
    const [language, setLanguageState] = React$1.useState(() => {
      return defaultLanguage;
    });
    const setLanguage = (lang) => {
      setLanguageState(lang);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageContext.Provider, { value: { language, setLanguage }, children });
  };
  const useLanguage = () => {
    const context = React$1.useContext(LanguageContext);
    if (context === void 0) {
      throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
  };
  const ContentAnalyzer = () => {
    const [content, setContent] = React$1.useState("");
    const [keywords, setKeywords] = React$1.useState("");
    const [title, setTitle] = React$1.useState("");
    const [metaDescription, setMetaDescription] = React$1.useState("");
    const [analysis, setAnalysis] = React$1.useState(null);
    const [isAnalyzing, setIsAnalyzing] = React$1.useState(false);
    const [apiKeyError, setApiKeyError] = React$1.useState(null);
    const { language } = useLanguage();
    const { toast: toast2 } = useToast();
    const parseGeminiResponse = (responseText) => {
      var _a2;
      const results = { suggestions: [] };
      const lines = responseText.split("\n");
      lines.forEach((line) => {
        var _a3;
        if (line.match(/Overall SEO Score: (\d+)/i)) {
          results.seoScore = parseInt(RegExp.$1, 10);
        } else if (line.match(/Justification: (.*)/i)) {
          results.justification = RegExp.$1;
        } else if (line.match(/Readability: (.*)/i)) {
          const readabilityValue = RegExp.$1;
          results.readabilityScore = isNaN(parseFloat(readabilityValue)) ? readabilityValue : parseFloat(readabilityValue);
        } else if (line.match(/Keyword Density: (.*)/i)) {
          results.keywordDensity = RegExp.$1;
        } else if (line.match(/Suggestion \d+: (.*)/i) || line.match(/- (.*)/i) || line.match(/\* (.*)/i)) {
          if (RegExp.$1.trim()) (_a3 = results.suggestions) == null ? void 0 : _a3.push(RegExp.$1.trim());
        }
      });
      if (((_a2 = results.suggestions) == null ? void 0 : _a2.length) === 0) {
        const potentialSuggestions = lines.filter(
          (line) => !line.startsWith("Overall SEO Score:") && !line.startsWith("Justification:") && !line.startsWith("Readability:") && !line.startsWith("Keyword Density:") && line.trim().length > 10
          // Avoid empty or very short lines
        );
        if (potentialSuggestions.length > 0 && potentialSuggestions.length <= 7) {
          results.suggestions = potentialSuggestions;
        }
      }
      if (results.seoScore === void 0) results.seoScore = 0;
      if (results.readabilityScore === void 0) results.readabilityScore = "N/A";
      if (!results.suggestions || results.suggestions.length === 0) {
        results.suggestions = ["No specific suggestions extracted. Review the raw Gemini output if provided."];
      }
      return results;
    };
    const analyzeContent = async () => {
      if (!content.trim()) {
        toast2({
          title: "Content Required",
          description: "Please enter content to analyze.",
          variant: "destructive"
        });
        return;
      }
      setApiKeyError(null);
      setIsAnalyzing(true);
      setAnalysis(null);
      let prompt = `Analyze the following content for SEO quality. Provide the output with clear headings for each section.

Content to Analyze:
---
${content}
---
`;
      if (title) prompt += `
Page Title: "${title}"`;
      if (metaDescription) prompt += `
Meta Description: "${metaDescription}"`;
      if (keywords) prompt += `
Focus Keywords: "${keywords}"`;
      prompt += `

Analysis Required (please provide your entire response in ${language === "th" ? "Thai" : "English"}):
1.  Overall SEO Score: (Provide a score from 0 to 100)
2.  Justification: (Briefly explain the score)
3.  Readability: (Assess readability, e.g., Flesch-Kincaid score, or qualitative like 'Good', 'Difficult to read')
4.  Keyword Density: (Analyze usage of focus keywords if provided, otherwise general keyword cloudiness)
5.  Suggestions: (Provide 3-5 actionable SEO suggestions to improve the content. Each suggestion should start with "Suggestion X:" or be a bullet point like "-" or "*")

Format the response clearly.`;
      try {
        const rawResponse = await generateBlogContent(prompt);
        const parsedAnalysis = parseGeminiResponse(rawResponse);
        setAnalysis({
          wordCount: content.split(/\s+/).filter(Boolean).length,
          // Calculate locally
          readabilityScore: parsedAnalysis.readabilityScore || "N/A",
          seoScore: parsedAnalysis.seoScore || 0,
          suggestions: parsedAnalysis.suggestions && parsedAnalysis.suggestions.length > 0 ? parsedAnalysis.suggestions : ["Gemini did not provide specific suggestions in the expected format."],
          keywordDensity: parsedAnalysis.keywordDensity || "N/A",
          justification: parsedAnalysis.justification || "No justification provided."
        });
      } catch (error) {
        console.error("Error analyzing content with Gemini:", error);
        let errorDesc = "An error occurred during content analysis.";
        if (error.isApiKeyInvalid) {
          errorDesc = "The Gemini API key is invalid or missing. Please go to Settings to add it.";
          setApiKeyError(errorDesc);
        } else if (error.message) {
          errorDesc = error.message;
        }
        toast2({ title: "Analysis Failed", description: errorDesc, variant: "destructive" });
        setAnalysis({
          // Provide some feedback in the analysis area
          wordCount: content.split(/\s+/).filter(Boolean).length,
          readabilityScore: "Error",
          seoScore: 0,
          suggestions: [errorDesc],
          justification: "Analysis failed."
        });
      } finally {
        setIsAnalyzing(false);
      }
    };
    const getScoreColor = (score) => {
      if (score >= 80) return "text-green-600";
      if (score >= 60) return "text-yellow-600";
      return "text-red-600";
    };
    const getScoreBadge = (score) => {
      if (score >= 80) return { variant: "default", className: "bg-green-100 text-green-700", text: "Excellent" };
      if (score >= 60) return { variant: "secondary", className: "bg-yellow-100 text-yellow-700", text: "Good" };
      return { variant: "destructive", className: "bg-red-100 text-red-700", text: "Needs Work" };
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/70 backdrop-blur-sm border-0 shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-5 w-5 text-blue-600" }),
            "Content Input"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Enter your content and SEO parameters for analysis" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "title", children: "Page Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "title",
                placeholder: "Enter your page title...",
                value: title,
                onChange: (e) => setTitle(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "meta", children: "Meta Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "meta",
                placeholder: "Enter meta description...",
                value: metaDescription,
                onChange: (e) => setMetaDescription(e.target.value),
                rows: 2
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "keywords", children: "Target Keywords (comma-separated)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "keywords",
                placeholder: "SEO, optimization, content marketing...",
                value: keywords,
                onChange: (e) => setKeywords(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "content", children: "Content" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "content",
                placeholder: "Paste your content here for analysis...",
                value: content,
                onChange: (e) => setContent(e.target.value),
                rows: 8
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: analyzeContent,
              className: "w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
              disabled: isAnalyzing,
              children: isAnalyzing ? "Analyzing..." : "Analyze Content"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/70 backdrop-blur-sm border-0 shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-green-600" }),
            "Analysis Results"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "SEO optimization insights and recommendations" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: analysis ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-4xl font-bold ${getScoreColor(analysis.seoScore)}`, children: [
              analysis.seoScore,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: getScoreBadge(analysis.seoScore).variant,
                className: getScoreBadge(analysis.seoScore).className,
                children: getScoreBadge(analysis.seoScore).text
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: analysis.seoScore, className: "mt-3" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-blue-50 rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Word Count" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-600", children: analysis.wordCount })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-green-50 rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Readability" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-green-600", children: [
                analysis.readabilityScore,
                "%"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-orange-500" }),
              "Optimization Suggestions"
            ] }),
            analysis.suggestions.map((suggestion, index2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-2 bg-orange-50 rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-700", children: suggestion })
            ] }, index2))
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-gray-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: 'Enter content above and click "Analyze Content" to see results' })
        ] }) })
      ] })
    ] });
  };
  function clamp(value, [min2, max2]) {
    return Math.min(max2, Math.max(min2, value));
  }
  var count = 0;
  function useFocusGuards() {
    React__namespace.useEffect(() => {
      const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
      document.body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
      document.body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
      count++;
      return () => {
        if (count === 1) {
          document.querySelectorAll("[data-radix-focus-guard]").forEach((node) => node.remove());
        }
        count--;
      };
    }, []);
  }
  function createFocusGuard() {
    const element = document.createElement("span");
    element.setAttribute("data-radix-focus-guard", "");
    element.tabIndex = 0;
    element.style.outline = "none";
    element.style.opacity = "0";
    element.style.position = "fixed";
    element.style.pointerEvents = "none";
    return element;
  }
  var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
  var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
  var EVENT_OPTIONS = { bubbles: false, cancelable: true };
  var FOCUS_SCOPE_NAME = "FocusScope";
  var FocusScope = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      loop = false,
      trapped = false,
      onMountAutoFocus: onMountAutoFocusProp,
      onUnmountAutoFocus: onUnmountAutoFocusProp,
      ...scopeProps
    } = props;
    const [container, setContainer] = React__namespace.useState(null);
    const onMountAutoFocus = useCallbackRef$1(onMountAutoFocusProp);
    const onUnmountAutoFocus = useCallbackRef$1(onUnmountAutoFocusProp);
    const lastFocusedElementRef = React__namespace.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContainer(node));
    const focusScope = React__namespace.useRef({
      paused: false,
      pause() {
        this.paused = true;
      },
      resume() {
        this.paused = false;
      }
    }).current;
    React__namespace.useEffect(() => {
      if (trapped) {
        let handleFocusIn2 = function(event) {
          if (focusScope.paused || !container) return;
          const target = event.target;
          if (container.contains(target)) {
            lastFocusedElementRef.current = target;
          } else {
            focus(lastFocusedElementRef.current, { select: true });
          }
        }, handleFocusOut2 = function(event) {
          if (focusScope.paused || !container) return;
          const relatedTarget = event.relatedTarget;
          if (relatedTarget === null) return;
          if (!container.contains(relatedTarget)) {
            focus(lastFocusedElementRef.current, { select: true });
          }
        }, handleMutations2 = function(mutations) {
          const focusedElement = document.activeElement;
          if (focusedElement !== document.body) return;
          for (const mutation of mutations) {
            if (mutation.removedNodes.length > 0) focus(container);
          }
        };
        document.addEventListener("focusin", handleFocusIn2);
        document.addEventListener("focusout", handleFocusOut2);
        const mutationObserver = new MutationObserver(handleMutations2);
        if (container) mutationObserver.observe(container, { childList: true, subtree: true });
        return () => {
          document.removeEventListener("focusin", handleFocusIn2);
          document.removeEventListener("focusout", handleFocusOut2);
          mutationObserver.disconnect();
        };
      }
    }, [trapped, container, focusScope.paused]);
    React__namespace.useEffect(() => {
      if (container) {
        focusScopesStack.add(focusScope);
        const previouslyFocusedElement = document.activeElement;
        const hasFocusedCandidate = container.contains(previouslyFocusedElement);
        if (!hasFocusedCandidate) {
          const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
          container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
          container.dispatchEvent(mountEvent);
          if (!mountEvent.defaultPrevented) {
            focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
            if (document.activeElement === previouslyFocusedElement) {
              focus(container);
            }
          }
        }
        return () => {
          container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
          setTimeout(() => {
            const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
            container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
            container.dispatchEvent(unmountEvent);
            if (!unmountEvent.defaultPrevented) {
              focus(previouslyFocusedElement ?? document.body, { select: true });
            }
            container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
            focusScopesStack.remove(focusScope);
          }, 0);
        };
      }
    }, [container, onMountAutoFocus, onUnmountAutoFocus, focusScope]);
    const handleKeyDown = React__namespace.useCallback(
      (event) => {
        if (!loop && !trapped) return;
        if (focusScope.paused) return;
        const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
        const focusedElement = document.activeElement;
        if (isTabKey && focusedElement) {
          const container2 = event.currentTarget;
          const [first, last] = getTabbableEdges(container2);
          const hasTabbableElementsInside = first && last;
          if (!hasTabbableElementsInside) {
            if (focusedElement === container2) event.preventDefault();
          } else {
            if (!event.shiftKey && focusedElement === last) {
              event.preventDefault();
              if (loop) focus(first, { select: true });
            } else if (event.shiftKey && focusedElement === first) {
              event.preventDefault();
              if (loop) focus(last, { select: true });
            }
          }
        }
      },
      [loop, trapped, focusScope.paused]
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { tabIndex: -1, ...scopeProps, ref: composedRefs, onKeyDown: handleKeyDown });
  });
  FocusScope.displayName = FOCUS_SCOPE_NAME;
  function focusFirst(candidates, { select = false } = {}) {
    const previouslyFocusedElement = document.activeElement;
    for (const candidate of candidates) {
      focus(candidate, { select });
      if (document.activeElement !== previouslyFocusedElement) return;
    }
  }
  function getTabbableEdges(container) {
    const candidates = getTabbableCandidates(container);
    const first = findVisible(candidates, container);
    const last = findVisible(candidates.reverse(), container);
    return [first, last];
  }
  function getTabbableCandidates(container) {
    const nodes = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
        if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
        return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }
  function findVisible(elements, container) {
    for (const element of elements) {
      if (!isHidden(element, { upTo: container })) return element;
    }
  }
  function isHidden(node, { upTo }) {
    if (getComputedStyle(node).visibility === "hidden") return true;
    while (node) {
      if (upTo !== void 0 && node === upTo) return false;
      if (getComputedStyle(node).display === "none") return true;
      node = node.parentElement;
    }
    return false;
  }
  function isSelectableInput(element) {
    return element instanceof HTMLInputElement && "select" in element;
  }
  function focus(element, { select = false } = {}) {
    if (element && element.focus) {
      const previouslyFocusedElement = document.activeElement;
      element.focus({ preventScroll: true });
      if (element !== previouslyFocusedElement && isSelectableInput(element) && select)
        element.select();
    }
  }
  var focusScopesStack = createFocusScopesStack();
  function createFocusScopesStack() {
    let stack = [];
    return {
      add(focusScope) {
        const activeFocusScope = stack[0];
        if (focusScope !== activeFocusScope) {
          activeFocusScope == null ? void 0 : activeFocusScope.pause();
        }
        stack = arrayRemove(stack, focusScope);
        stack.unshift(focusScope);
      },
      remove(focusScope) {
        var _a2;
        stack = arrayRemove(stack, focusScope);
        (_a2 = stack[0]) == null ? void 0 : _a2.resume();
      }
    };
  }
  function arrayRemove(array, item) {
    const updatedArray = [...array];
    const index2 = updatedArray.indexOf(item);
    if (index2 !== -1) {
      updatedArray.splice(index2, 1);
    }
    return updatedArray;
  }
  function removeLinks(items) {
    return items.filter((item) => item.tagName !== "A");
  }
  function usePrevious(value) {
    const ref = React__namespace.useRef({ value, previous: value });
    return React__namespace.useMemo(() => {
      if (ref.current.value !== value) {
        ref.current.previous = ref.current.value;
        ref.current.value = value;
      }
      return ref.current.previous;
    }, [value]);
  }
  var getDefaultParent = function(originalTarget) {
    if (typeof document === "undefined") {
      return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
  };
  var counterMap = /* @__PURE__ */ new WeakMap();
  var uncontrolledNodes = /* @__PURE__ */ new WeakMap();
  var markerMap = {};
  var lockCount = 0;
  var unwrapHost = function(node) {
    return node && (node.host || unwrapHost(node.parentNode));
  };
  var correctTargets = function(parent, targets) {
    return targets.map(function(target) {
      if (parent.contains(target)) {
        return target;
      }
      var correctedTarget = unwrapHost(target);
      if (correctedTarget && parent.contains(correctedTarget)) {
        return correctedTarget;
      }
      console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
      return null;
    }).filter(function(x) {
      return Boolean(x);
    });
  };
  var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
    var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    if (!markerMap[markerName]) {
      markerMap[markerName] = /* @__PURE__ */ new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = /* @__PURE__ */ new Set();
    var elementsToStop = new Set(targets);
    var keep = function(el) {
      if (!el || elementsToKeep.has(el)) {
        return;
      }
      elementsToKeep.add(el);
      keep(el.parentNode);
    };
    targets.forEach(keep);
    var deep = function(parent) {
      if (!parent || elementsToStop.has(parent)) {
        return;
      }
      Array.prototype.forEach.call(parent.children, function(node) {
        if (elementsToKeep.has(node)) {
          deep(node);
        } else {
          try {
            var attr = node.getAttribute(controlAttribute);
            var alreadyHidden = attr !== null && attr !== "false";
            var counterValue = (counterMap.get(node) || 0) + 1;
            var markerValue = (markerCounter.get(node) || 0) + 1;
            counterMap.set(node, counterValue);
            markerCounter.set(node, markerValue);
            hiddenNodes.push(node);
            if (counterValue === 1 && alreadyHidden) {
              uncontrolledNodes.set(node, true);
            }
            if (markerValue === 1) {
              node.setAttribute(markerName, "true");
            }
            if (!alreadyHidden) {
              node.setAttribute(controlAttribute, "true");
            }
          } catch (e) {
            console.error("aria-hidden: cannot operate on ", node, e);
          }
        }
      });
    };
    deep(parentNode);
    elementsToKeep.clear();
    lockCount++;
    return function() {
      hiddenNodes.forEach(function(node) {
        var counterValue = counterMap.get(node) - 1;
        var markerValue = markerCounter.get(node) - 1;
        counterMap.set(node, counterValue);
        markerCounter.set(node, markerValue);
        if (!counterValue) {
          if (!uncontrolledNodes.has(node)) {
            node.removeAttribute(controlAttribute);
          }
          uncontrolledNodes.delete(node);
        }
        if (!markerValue) {
          node.removeAttribute(markerName);
        }
      });
      lockCount--;
      if (!lockCount) {
        counterMap = /* @__PURE__ */ new WeakMap();
        counterMap = /* @__PURE__ */ new WeakMap();
        uncontrolledNodes = /* @__PURE__ */ new WeakMap();
        markerMap = {};
      }
    };
  };
  var hideOthers = function(originalTarget, parentNode, markerName) {
    if (markerName === void 0) {
      markerName = "data-aria-hidden";
    }
    var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    var activeParentNode = getDefaultParent(originalTarget);
    if (!activeParentNode) {
      return function() {
        return null;
      };
    }
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
    return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
  };
  var __assign = function() {
    __assign = Object.assign || function __assign2(t) {
      for (var s, i = 1, n2 = arguments.length; i < n2; i++) {
        s = arguments[i];
        for (var p2 in s) if (Object.prototype.hasOwnProperty.call(s, p2)) t[p2] = s[p2];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  function __rest(s, e) {
    var t = {};
    for (var p2 in s) if (Object.prototype.hasOwnProperty.call(s, p2) && e.indexOf(p2) < 0)
      t[p2] = s[p2];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p2 = Object.getOwnPropertySymbols(s); i < p2.length; i++) {
        if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p2[i]))
          t[p2[i]] = s[p2[i]];
      }
    return t;
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l2 = from.length, ar; i < l2; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };
  var zeroRightClassName = "right-scroll-bar-position";
  var fullWidthClassName = "width-before-scroll-bar";
  var noScrollbarsClassName = "with-scroll-bars-hidden";
  var removedBarSizeVariable = "--removed-body-scroll-bar-size";
  function assignRef(ref, value) {
    if (typeof ref === "function") {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
    return ref;
  }
  function useCallbackRef(initialValue, callback) {
    var ref = React$1.useState(function() {
      return {
        // value
        value: initialValue,
        // last callback
        callback,
        // "memoized" public interface
        facade: {
          get current() {
            return ref.value;
          },
          set current(value) {
            var last = ref.value;
            if (last !== value) {
              ref.value = value;
              ref.callback(value, last);
            }
          }
        }
      };
    })[0];
    ref.callback = callback;
    return ref.facade;
  }
  var useIsomorphicLayoutEffect = typeof window !== "undefined" ? React__namespace.useLayoutEffect : React__namespace.useEffect;
  var currentValues = /* @__PURE__ */ new WeakMap();
  function useMergeRefs(refs, defaultValue) {
    var callbackRef = useCallbackRef(null, function(newValue) {
      return refs.forEach(function(ref) {
        return assignRef(ref, newValue);
      });
    });
    useIsomorphicLayoutEffect(function() {
      var oldValue = currentValues.get(callbackRef);
      if (oldValue) {
        var prevRefs_1 = new Set(oldValue);
        var nextRefs_1 = new Set(refs);
        var current_1 = callbackRef.current;
        prevRefs_1.forEach(function(ref) {
          if (!nextRefs_1.has(ref)) {
            assignRef(ref, null);
          }
        });
        nextRefs_1.forEach(function(ref) {
          if (!prevRefs_1.has(ref)) {
            assignRef(ref, current_1);
          }
        });
      }
      currentValues.set(callbackRef, refs);
    }, [refs]);
    return callbackRef;
  }
  function ItoI(a) {
    return a;
  }
  function innerCreateMedium(defaults, middleware) {
    if (middleware === void 0) {
      middleware = ItoI;
    }
    var buffer = [];
    var assigned = false;
    var medium = {
      read: function() {
        if (assigned) {
          throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
        }
        if (buffer.length) {
          return buffer[buffer.length - 1];
        }
        return defaults;
      },
      useMedium: function(data) {
        var item = middleware(data, assigned);
        buffer.push(item);
        return function() {
          buffer = buffer.filter(function(x) {
            return x !== item;
          });
        };
      },
      assignSyncMedium: function(cb) {
        assigned = true;
        while (buffer.length) {
          var cbs = buffer;
          buffer = [];
          cbs.forEach(cb);
        }
        buffer = {
          push: function(x) {
            return cb(x);
          },
          filter: function() {
            return buffer;
          }
        };
      },
      assignMedium: function(cb) {
        assigned = true;
        var pendingQueue = [];
        if (buffer.length) {
          var cbs = buffer;
          buffer = [];
          cbs.forEach(cb);
          pendingQueue = buffer;
        }
        var executeQueue = function() {
          var cbs2 = pendingQueue;
          pendingQueue = [];
          cbs2.forEach(cb);
        };
        var cycle = function() {
          return Promise.resolve().then(executeQueue);
        };
        cycle();
        buffer = {
          push: function(x) {
            pendingQueue.push(x);
            cycle();
          },
          filter: function(filter) {
            pendingQueue = pendingQueue.filter(filter);
            return buffer;
          }
        };
      }
    };
    return medium;
  }
  function createSidecarMedium(options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    var medium = innerCreateMedium(null);
    medium.options = __assign({ async: true, ssr: false }, options2);
    return medium;
  }
  var SideCar$1 = function(_a2) {
    var sideCar = _a2.sideCar, rest = __rest(_a2, ["sideCar"]);
    if (!sideCar) {
      throw new Error("Sidecar: please provide `sideCar` property to import the right car");
    }
    var Target2 = sideCar.read();
    if (!Target2) {
      throw new Error("Sidecar medium not found");
    }
    return React__namespace.createElement(Target2, __assign({}, rest));
  };
  SideCar$1.isSideCarExport = true;
  function exportSidecar(medium, exported) {
    medium.useMedium(exported);
    return SideCar$1;
  }
  var effectCar = createSidecarMedium();
  var nothing = function() {
    return;
  };
  var RemoveScroll = React__namespace.forwardRef(function(props, parentRef) {
    var ref = React__namespace.useRef(null);
    var _a2 = React__namespace.useState({
      onScrollCapture: nothing,
      onWheelCapture: nothing,
      onTouchMoveCapture: nothing
    }), callbacks = _a2[0], setCallbacks = _a2[1];
    var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b2 = props.as, Container = _b2 === void 0 ? "div" : _b2, gapMode = props.gapMode, rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]);
    var SideCar2 = sideCar;
    var containerRef = useMergeRefs([ref, parentRef]);
    var containerProps = __assign(__assign({}, rest), callbacks);
    return React__namespace.createElement(
      React__namespace.Fragment,
      null,
      enabled && React__namespace.createElement(SideCar2, { sideCar: effectCar, removeScrollBar, shards, noRelative, noIsolation, inert, setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref, gapMode }),
      forwardProps ? React__namespace.cloneElement(React__namespace.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : React__namespace.createElement(Container, __assign({}, containerProps, { className, ref: containerRef }), children)
    );
  });
  RemoveScroll.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
  };
  RemoveScroll.classNames = {
    fullWidth: fullWidthClassName,
    zeroRight: zeroRightClassName
  };
  var getNonce = function() {
    if (typeof __webpack_nonce__ !== "undefined") {
      return __webpack_nonce__;
    }
    return void 0;
  };
  function makeStyleTag() {
    if (!document)
      return null;
    var tag = document.createElement("style");
    tag.type = "text/css";
    var nonce = getNonce();
    if (nonce) {
      tag.setAttribute("nonce", nonce);
    }
    return tag;
  }
  function injectStyles(tag, css) {
    if (tag.styleSheet) {
      tag.styleSheet.cssText = css;
    } else {
      tag.appendChild(document.createTextNode(css));
    }
  }
  function insertStyleTag(tag) {
    var head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(tag);
  }
  var stylesheetSingleton = function() {
    var counter = 0;
    var stylesheet = null;
    return {
      add: function(style) {
        if (counter == 0) {
          if (stylesheet = makeStyleTag()) {
            injectStyles(stylesheet, style);
            insertStyleTag(stylesheet);
          }
        }
        counter++;
      },
      remove: function() {
        counter--;
        if (!counter && stylesheet) {
          stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
          stylesheet = null;
        }
      }
    };
  };
  var styleHookSingleton = function() {
    var sheet = stylesheetSingleton();
    return function(styles, isDynamic) {
      React__namespace.useEffect(function() {
        sheet.add(styles);
        return function() {
          sheet.remove();
        };
      }, [styles && isDynamic]);
    };
  };
  var styleSingleton = function() {
    var useStyle = styleHookSingleton();
    var Sheet = function(_a2) {
      var styles = _a2.styles, dynamic = _a2.dynamic;
      useStyle(styles, dynamic);
      return null;
    };
    return Sheet;
  };
  var zeroGap = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
  };
  var parse = function(x) {
    return parseInt(x || "", 10) || 0;
  };
  var getOffset = function(gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
    var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
    var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
    return [parse(left), parse(top), parse(right)];
  };
  var getGapWidth = function(gapMode) {
    if (gapMode === void 0) {
      gapMode = "margin";
    }
    if (typeof window === "undefined") {
      return zeroGap;
    }
    var offsets = getOffset(gapMode);
    var documentWidth = document.documentElement.clientWidth;
    var windowWidth = window.innerWidth;
    return {
      left: offsets[0],
      top: offsets[1],
      right: offsets[2],
      gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
    };
  };
  var Style = styleSingleton();
  var lockAttribute = "data-scroll-locked";
  var getStyles = function(_a2, allowRelative, gapMode, important) {
    var left = _a2.left, top = _a2.top, right = _a2.right, gap = _a2.gap;
    if (gapMode === void 0) {
      gapMode = "margin";
    }
    return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
      allowRelative && "position: relative ".concat(important, ";"),
      gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
      gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
    ].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
  };
  var getCurrentUseCounter = function() {
    var counter = parseInt(document.body.getAttribute(lockAttribute) || "0", 10);
    return isFinite(counter) ? counter : 0;
  };
  var useLockAttribute = function() {
    React__namespace.useEffect(function() {
      document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
      return function() {
        var newCounter = getCurrentUseCounter() - 1;
        if (newCounter <= 0) {
          document.body.removeAttribute(lockAttribute);
        } else {
          document.body.setAttribute(lockAttribute, newCounter.toString());
        }
      };
    }, []);
  };
  var RemoveScrollBar = function(_a2) {
    var noRelative = _a2.noRelative, noImportant = _a2.noImportant, _b2 = _a2.gapMode, gapMode = _b2 === void 0 ? "margin" : _b2;
    useLockAttribute();
    var gap = React__namespace.useMemo(function() {
      return getGapWidth(gapMode);
    }, [gapMode]);
    return React__namespace.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
  };
  var passiveSupported = false;
  if (typeof window !== "undefined") {
    try {
      var options = Object.defineProperty({}, "passive", {
        get: function() {
          passiveSupported = true;
          return true;
        }
      });
      window.addEventListener("test", options, options);
      window.removeEventListener("test", options, options);
    } catch (err) {
      passiveSupported = false;
    }
  }
  var nonPassive = passiveSupported ? { passive: false } : false;
  var alwaysContainsScroll = function(node) {
    return node.tagName === "TEXTAREA";
  };
  var elementCanBeScrolled = function(node, overflow) {
    if (!(node instanceof Element)) {
      return false;
    }
    var styles = window.getComputedStyle(node);
    return (
      // not-not-scrollable
      styles[overflow] !== "hidden" && // contains scroll inside self
      !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible")
    );
  };
  var elementCouldBeVScrolled = function(node) {
    return elementCanBeScrolled(node, "overflowY");
  };
  var elementCouldBeHScrolled = function(node) {
    return elementCanBeScrolled(node, "overflowX");
  };
  var locationCouldBeScrolled = function(axis, node) {
    var ownerDocument = node.ownerDocument;
    var current = node;
    do {
      if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) {
        current = current.host;
      }
      var isScrollable = elementCouldBeScrolled(axis, current);
      if (isScrollable) {
        var _a2 = getScrollVariables(axis, current), scrollHeight = _a2[1], clientHeight = _a2[2];
        if (scrollHeight > clientHeight) {
          return true;
        }
      }
      current = current.parentNode;
    } while (current && current !== ownerDocument.body);
    return false;
  };
  var getVScrollVariables = function(_a2) {
    var scrollTop = _a2.scrollTop, scrollHeight = _a2.scrollHeight, clientHeight = _a2.clientHeight;
    return [
      scrollTop,
      scrollHeight,
      clientHeight
    ];
  };
  var getHScrollVariables = function(_a2) {
    var scrollLeft = _a2.scrollLeft, scrollWidth = _a2.scrollWidth, clientWidth = _a2.clientWidth;
    return [
      scrollLeft,
      scrollWidth,
      clientWidth
    ];
  };
  var elementCouldBeScrolled = function(axis, node) {
    return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
  };
  var getScrollVariables = function(axis, node) {
    return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
  };
  var getDirectionFactor = function(axis, direction) {
    return axis === "h" && direction === "rtl" ? -1 : 1;
  };
  var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
    var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
    var delta = directionFactor * sourceDelta;
    var target = event.target;
    var targetInLock = endTarget.contains(target);
    var shouldCancelScroll = false;
    var isDeltaPositive = delta > 0;
    var availableScroll = 0;
    var availableScrollTop = 0;
    do {
      if (!target) {
        break;
      }
      var _a2 = getScrollVariables(axis, target), position = _a2[0], scroll_1 = _a2[1], capacity = _a2[2];
      var elementScroll = scroll_1 - capacity - directionFactor * position;
      if (position || elementScroll) {
        if (elementCouldBeScrolled(axis, target)) {
          availableScroll += elementScroll;
          availableScrollTop += position;
        }
      }
      var parent_1 = target.parentNode;
      target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
    } while (
      // portaled content
      !targetInLock && target !== document.body || // self content
      targetInLock && (endTarget.contains(target) || endTarget === target)
    );
    if (isDeltaPositive && (Math.abs(availableScroll) < 1 || false)) {
      shouldCancelScroll = true;
    } else if (!isDeltaPositive && (Math.abs(availableScrollTop) < 1 || false)) {
      shouldCancelScroll = true;
    }
    return shouldCancelScroll;
  };
  var getTouchXY = function(event) {
    return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
  };
  var getDeltaXY = function(event) {
    return [event.deltaX, event.deltaY];
  };
  var extractRef = function(ref) {
    return ref && "current" in ref ? ref.current : ref;
  };
  var deltaCompare = function(x, y) {
    return x[0] === y[0] && x[1] === y[1];
  };
  var generateStyle = function(id) {
    return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
  };
  var idCounter = 0;
  var lockStack = [];
  function RemoveScrollSideCar(props) {
    var shouldPreventQueue = React__namespace.useRef([]);
    var touchStartRef = React__namespace.useRef([0, 0]);
    var activeAxis = React__namespace.useRef();
    var id = React__namespace.useState(idCounter++)[0];
    var Style2 = React__namespace.useState(styleSingleton)[0];
    var lastProps = React__namespace.useRef(props);
    React__namespace.useEffect(function() {
      lastProps.current = props;
    }, [props]);
    React__namespace.useEffect(function() {
      if (props.inert) {
        document.body.classList.add("block-interactivity-".concat(id));
        var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
        allow_1.forEach(function(el) {
          return el.classList.add("allow-interactivity-".concat(id));
        });
        return function() {
          document.body.classList.remove("block-interactivity-".concat(id));
          allow_1.forEach(function(el) {
            return el.classList.remove("allow-interactivity-".concat(id));
          });
        };
      }
      return;
    }, [props.inert, props.lockRef.current, props.shards]);
    var shouldCancelEvent = React__namespace.useCallback(function(event, parent) {
      if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) {
        return !lastProps.current.allowPinchZoom;
      }
      var touch = getTouchXY(event);
      var touchStart = touchStartRef.current;
      var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
      var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
      var currentAxis;
      var target = event.target;
      var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
      if ("touches" in event && moveDirection === "h" && target.type === "range") {
        return false;
      }
      var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
      if (!canBeScrolledInMainDirection) {
        return true;
      }
      if (canBeScrolledInMainDirection) {
        currentAxis = moveDirection;
      } else {
        currentAxis = moveDirection === "v" ? "h" : "v";
        canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
      }
      if (!canBeScrolledInMainDirection) {
        return false;
      }
      if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) {
        activeAxis.current = currentAxis;
      }
      if (!currentAxis) {
        return true;
      }
      var cancelingAxis = activeAxis.current || currentAxis;
      return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY);
    }, []);
    var shouldPrevent = React__namespace.useCallback(function(_event) {
      var event = _event;
      if (!lockStack.length || lockStack[lockStack.length - 1] !== Style2) {
        return;
      }
      var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
      var sourceEvent = shouldPreventQueue.current.filter(function(e) {
        return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
      })[0];
      if (sourceEvent && sourceEvent.should) {
        if (event.cancelable) {
          event.preventDefault();
        }
        return;
      }
      if (!sourceEvent) {
        var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
          return node.contains(event.target);
        });
        var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
        if (shouldStop) {
          if (event.cancelable) {
            event.preventDefault();
          }
        }
      }
    }, []);
    var shouldCancel = React__namespace.useCallback(function(name, delta, target, should) {
      var event = { name, delta, target, should, shadowParent: getOutermostShadowParent(target) };
      shouldPreventQueue.current.push(event);
      setTimeout(function() {
        shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
          return e !== event;
        });
      }, 1);
    }, []);
    var scrollTouchStart = React__namespace.useCallback(function(event) {
      touchStartRef.current = getTouchXY(event);
      activeAxis.current = void 0;
    }, []);
    var scrollWheel = React__namespace.useCallback(function(event) {
      shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    var scrollTouchMove = React__namespace.useCallback(function(event) {
      shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    React__namespace.useEffect(function() {
      lockStack.push(Style2);
      props.setCallbacks({
        onScrollCapture: scrollWheel,
        onWheelCapture: scrollWheel,
        onTouchMoveCapture: scrollTouchMove
      });
      document.addEventListener("wheel", shouldPrevent, nonPassive);
      document.addEventListener("touchmove", shouldPrevent, nonPassive);
      document.addEventListener("touchstart", scrollTouchStart, nonPassive);
      return function() {
        lockStack = lockStack.filter(function(inst) {
          return inst !== Style2;
        });
        document.removeEventListener("wheel", shouldPrevent, nonPassive);
        document.removeEventListener("touchmove", shouldPrevent, nonPassive);
        document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
      };
    }, []);
    var removeScrollBar = props.removeScrollBar, inert = props.inert;
    return React__namespace.createElement(
      React__namespace.Fragment,
      null,
      inert ? React__namespace.createElement(Style2, { styles: generateStyle(id) }) : null,
      removeScrollBar ? React__namespace.createElement(RemoveScrollBar, { noRelative: props.noRelative, gapMode: props.gapMode }) : null
    );
  }
  function getOutermostShadowParent(node) {
    var shadowParent = null;
    while (node !== null) {
      if (node instanceof ShadowRoot) {
        shadowParent = node.host;
        node = node.host;
      }
      node = node.parentNode;
    }
    return shadowParent;
  }
  const SideCar = exportSidecar(effectCar, RemoveScrollSideCar);
  var ReactRemoveScroll = React__namespace.forwardRef(function(props, ref) {
    return React__namespace.createElement(RemoveScroll, __assign({}, props, { ref, sideCar: SideCar }));
  });
  ReactRemoveScroll.classNames = RemoveScroll.classNames;
  var OPEN_KEYS = [" ", "Enter", "ArrowUp", "ArrowDown"];
  var SELECTION_KEYS = [" ", "Enter"];
  var SELECT_NAME = "Select";
  var [Collection$1, useCollection$1, createCollectionScope$1] = createCollection(SELECT_NAME);
  var [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME, [
    createCollectionScope$1,
    createPopperScope
  ]);
  var usePopperScope = createPopperScope();
  var [SelectProvider, useSelectContext] = createSelectContext(SELECT_NAME);
  var [SelectNativeOptionsProvider, useSelectNativeOptionsContext] = createSelectContext(SELECT_NAME);
  var Select$1 = (props) => {
    const {
      __scopeSelect,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      value: valueProp,
      defaultValue,
      onValueChange,
      dir,
      name,
      autoComplete,
      disabled,
      required,
      form
    } = props;
    const popperScope = usePopperScope(__scopeSelect);
    const [trigger, setTrigger] = React__namespace.useState(null);
    const [valueNode, setValueNode] = React__namespace.useState(null);
    const [valueNodeHasChildren, setValueNodeHasChildren] = React__namespace.useState(false);
    const direction = useDirection(dir);
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
      caller: SELECT_NAME
    });
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: onValueChange,
      caller: SELECT_NAME
    });
    const triggerPointerDownPosRef = React__namespace.useRef(null);
    const isFormControl = trigger ? form || !!trigger.closest("form") : true;
    const [nativeOptionsSet, setNativeOptionsSet] = React__namespace.useState(/* @__PURE__ */ new Set());
    const nativeSelectKey = Array.from(nativeOptionsSet).map((option) => option.props.value).join(";");
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$3, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      SelectProvider,
      {
        required,
        scope: __scopeSelect,
        trigger,
        onTriggerChange: setTrigger,
        valueNode,
        onValueNodeChange: setValueNode,
        valueNodeHasChildren,
        onValueNodeHasChildrenChange: setValueNodeHasChildren,
        contentId: useId(),
        value,
        onValueChange: setValue,
        open,
        onOpenChange: setOpen,
        dir: direction,
        triggerPointerDownPosRef,
        disabled,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Provider, { scope: __scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectNativeOptionsProvider,
            {
              scope: props.__scopeSelect,
              onNativeOptionAdd: React__namespace.useCallback((option) => {
                setNativeOptionsSet((prev) => new Set(prev).add(option));
              }, []),
              onNativeOptionRemove: React__namespace.useCallback((option) => {
                setNativeOptionsSet((prev) => {
                  const optionsSet = new Set(prev);
                  optionsSet.delete(option);
                  return optionsSet;
                });
              }, []),
              children
            }
          ) }),
          isFormControl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            SelectBubbleInput,
            {
              "aria-hidden": true,
              required,
              tabIndex: -1,
              name,
              autoComplete,
              value,
              onChange: (event) => setValue(event.target.value),
              disabled,
              form,
              children: [
                value === void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "" }) : null,
                Array.from(nativeOptionsSet)
              ]
            },
            nativeSelectKey
          ) : null
        ]
      }
    ) });
  };
  Select$1.displayName = SELECT_NAME;
  var TRIGGER_NAME$3 = "SelectTrigger";
  var SelectTrigger$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeSelect, disabled = false, ...triggerProps } = props;
      const popperScope = usePopperScope(__scopeSelect);
      const context = useSelectContext(TRIGGER_NAME$3, __scopeSelect);
      const isDisabled = context.disabled || disabled;
      const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange);
      const getItems = useCollection$1(__scopeSelect);
      const pointerTypeRef = React__namespace.useRef("touch");
      const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search) => {
        const enabledItems = getItems().filter((item) => !item.disabled);
        const currentItem = enabledItems.find((item) => item.value === context.value);
        const nextItem = findNextItem(enabledItems, search, currentItem);
        if (nextItem !== void 0) {
          context.onValueChange(nextItem.value);
        }
      });
      const handleOpen = (pointerEvent) => {
        if (!isDisabled) {
          context.onOpenChange(true);
          resetTypeahead();
        }
        if (pointerEvent) {
          context.triggerPointerDownPosRef.current = {
            x: Math.round(pointerEvent.pageX),
            y: Math.round(pointerEvent.pageY)
          };
        }
      };
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "combobox",
          "aria-controls": context.contentId,
          "aria-expanded": context.open,
          "aria-required": context.required,
          "aria-autocomplete": "none",
          dir: context.dir,
          "data-state": context.open ? "open" : "closed",
          disabled: isDisabled,
          "data-disabled": isDisabled ? "" : void 0,
          "data-placeholder": shouldShowPlaceholder(context.value) ? "" : void 0,
          ...triggerProps,
          ref: composedRefs,
          onClick: composeEventHandlers(triggerProps.onClick, (event) => {
            event.currentTarget.focus();
            if (pointerTypeRef.current !== "mouse") {
              handleOpen(event);
            }
          }),
          onPointerDown: composeEventHandlers(triggerProps.onPointerDown, (event) => {
            pointerTypeRef.current = event.pointerType;
            const target = event.target;
            if (target.hasPointerCapture(event.pointerId)) {
              target.releasePointerCapture(event.pointerId);
            }
            if (event.button === 0 && event.ctrlKey === false && event.pointerType === "mouse") {
              handleOpen(event);
              event.preventDefault();
            }
          }),
          onKeyDown: composeEventHandlers(triggerProps.onKeyDown, (event) => {
            const isTypingAhead = searchRef.current !== "";
            const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
            if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
            if (isTypingAhead && event.key === " ") return;
            if (OPEN_KEYS.includes(event.key)) {
              handleOpen();
              event.preventDefault();
            }
          })
        }
      ) });
    }
  );
  SelectTrigger$1.displayName = TRIGGER_NAME$3;
  var VALUE_NAME = "SelectValue";
  var SelectValue$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeSelect, className, style, children, placeholder = "", ...valueProps } = props;
      const context = useSelectContext(VALUE_NAME, __scopeSelect);
      const { onValueNodeHasChildrenChange } = context;
      const hasChildren = children !== void 0;
      const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange);
      useLayoutEffect2(() => {
        onValueNodeHasChildrenChange(hasChildren);
      }, [onValueNodeHasChildrenChange, hasChildren]);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.span,
        {
          ...valueProps,
          ref: composedRefs,
          style: { pointerEvents: "none" },
          children: shouldShowPlaceholder(context.value) ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: placeholder }) : children
        }
      );
    }
  );
  SelectValue$1.displayName = VALUE_NAME;
  var ICON_NAME = "SelectIcon";
  var SelectIcon = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeSelect, children, ...iconProps } = props;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { "aria-hidden": true, ...iconProps, ref: forwardedRef, children: children || "▼" });
    }
  );
  SelectIcon.displayName = ICON_NAME;
  var PORTAL_NAME = "SelectPortal";
  var SelectPortal = (props) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, ...props });
  };
  SelectPortal.displayName = PORTAL_NAME;
  var CONTENT_NAME$2 = "SelectContent";
  var SelectContent$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const context = useSelectContext(CONTENT_NAME$2, props.__scopeSelect);
      const [fragment, setFragment] = React__namespace.useState();
      useLayoutEffect2(() => {
        setFragment(new DocumentFragment());
      }, []);
      if (!context.open) {
        const frag = fragment;
        return frag ? ReactDOM__namespace.createPortal(
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContentProvider, { scope: props.__scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Slot, { scope: props.__scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: props.children }) }) }),
          frag
        ) : null;
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContentImpl, { ...props, ref: forwardedRef });
    }
  );
  SelectContent$1.displayName = CONTENT_NAME$2;
  var CONTENT_MARGIN = 10;
  var [SelectContentProvider, useSelectContentContext] = createSelectContext(CONTENT_NAME$2);
  var CONTENT_IMPL_NAME = "SelectContentImpl";
  var Slot = /* @__PURE__ */ createSlot("SelectContent.RemoveScroll");
  var SelectContentImpl = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeSelect,
        position = "item-aligned",
        onCloseAutoFocus,
        onEscapeKeyDown,
        onPointerDownOutside,
        //
        // PopperContent props
        side,
        sideOffset,
        align,
        alignOffset,
        arrowPadding,
        collisionBoundary,
        collisionPadding,
        sticky,
        hideWhenDetached,
        avoidCollisions,
        //
        ...contentProps
      } = props;
      const context = useSelectContext(CONTENT_NAME$2, __scopeSelect);
      const [content, setContent] = React__namespace.useState(null);
      const [viewport, setViewport] = React__namespace.useState(null);
      const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
      const [selectedItem, setSelectedItem] = React__namespace.useState(null);
      const [selectedItemText, setSelectedItemText] = React__namespace.useState(
        null
      );
      const getItems = useCollection$1(__scopeSelect);
      const [isPositioned, setIsPositioned] = React__namespace.useState(false);
      const firstValidItemFoundRef = React__namespace.useRef(false);
      React__namespace.useEffect(() => {
        if (content) return hideOthers(content);
      }, [content]);
      useFocusGuards();
      const focusFirst2 = React__namespace.useCallback(
        (candidates) => {
          const [firstItem, ...restItems] = getItems().map((item) => item.ref.current);
          const [lastItem] = restItems.slice(-1);
          const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
          for (const candidate of candidates) {
            if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
            candidate == null ? void 0 : candidate.scrollIntoView({ block: "nearest" });
            if (candidate === firstItem && viewport) viewport.scrollTop = 0;
            if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight;
            candidate == null ? void 0 : candidate.focus();
            if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
          }
        },
        [getItems, viewport]
      );
      const focusSelectedItem = React__namespace.useCallback(
        () => focusFirst2([selectedItem, content]),
        [focusFirst2, selectedItem, content]
      );
      React__namespace.useEffect(() => {
        if (isPositioned) {
          focusSelectedItem();
        }
      }, [isPositioned, focusSelectedItem]);
      const { onOpenChange, triggerPointerDownPosRef } = context;
      React__namespace.useEffect(() => {
        if (content) {
          let pointerMoveDelta = { x: 0, y: 0 };
          const handlePointerMove = (event) => {
            var _a2, _b2;
            pointerMoveDelta = {
              x: Math.abs(Math.round(event.pageX) - (((_a2 = triggerPointerDownPosRef.current) == null ? void 0 : _a2.x) ?? 0)),
              y: Math.abs(Math.round(event.pageY) - (((_b2 = triggerPointerDownPosRef.current) == null ? void 0 : _b2.y) ?? 0))
            };
          };
          const handlePointerUp = (event) => {
            if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
              event.preventDefault();
            } else {
              if (!content.contains(event.target)) {
                onOpenChange(false);
              }
            }
            document.removeEventListener("pointermove", handlePointerMove);
            triggerPointerDownPosRef.current = null;
          };
          if (triggerPointerDownPosRef.current !== null) {
            document.addEventListener("pointermove", handlePointerMove);
            document.addEventListener("pointerup", handlePointerUp, { capture: true, once: true });
          }
          return () => {
            document.removeEventListener("pointermove", handlePointerMove);
            document.removeEventListener("pointerup", handlePointerUp, { capture: true });
          };
        }
      }, [content, onOpenChange, triggerPointerDownPosRef]);
      React__namespace.useEffect(() => {
        const close = () => onOpenChange(false);
        window.addEventListener("blur", close);
        window.addEventListener("resize", close);
        return () => {
          window.removeEventListener("blur", close);
          window.removeEventListener("resize", close);
        };
      }, [onOpenChange]);
      const [searchRef, handleTypeaheadSearch] = useTypeaheadSearch((search) => {
        const enabledItems = getItems().filter((item) => !item.disabled);
        const currentItem = enabledItems.find((item) => item.ref.current === document.activeElement);
        const nextItem = findNextItem(enabledItems, search, currentItem);
        if (nextItem) {
          setTimeout(() => nextItem.ref.current.focus());
        }
      });
      const itemRefCallback = React__namespace.useCallback(
        (node, value, disabled) => {
          const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
          const isSelectedItem = context.value !== void 0 && context.value === value;
          if (isSelectedItem || isFirstValidItem) {
            setSelectedItem(node);
            if (isFirstValidItem) firstValidItemFoundRef.current = true;
          }
        },
        [context.value]
      );
      const handleItemLeave = React__namespace.useCallback(() => content == null ? void 0 : content.focus(), [content]);
      const itemTextRefCallback = React__namespace.useCallback(
        (node, value, disabled) => {
          const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
          const isSelectedItem = context.value !== void 0 && context.value === value;
          if (isSelectedItem || isFirstValidItem) {
            setSelectedItemText(node);
          }
        },
        [context.value]
      );
      const SelectPosition = position === "popper" ? SelectPopperPosition : SelectItemAlignedPosition;
      const popperContentProps = SelectPosition === SelectPopperPosition ? {
        side,
        sideOffset,
        align,
        alignOffset,
        arrowPadding,
        collisionBoundary,
        collisionPadding,
        sticky,
        hideWhenDetached,
        avoidCollisions
      } : {};
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        SelectContentProvider,
        {
          scope: __scopeSelect,
          content,
          viewport,
          onViewportChange: setViewport,
          itemRefCallback,
          selectedItem,
          onItemLeave: handleItemLeave,
          itemTextRefCallback,
          focusSelectedItem,
          selectedItemText,
          position,
          isPositioned,
          searchRef,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot, allowPinchZoom: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            FocusScope,
            {
              asChild: true,
              trapped: context.open,
              onMountAutoFocus: (event) => {
                event.preventDefault();
              },
              onUnmountAutoFocus: composeEventHandlers(onCloseAutoFocus, (event) => {
                var _a2;
                (_a2 = context.trigger) == null ? void 0 : _a2.focus({ preventScroll: true });
                event.preventDefault();
              }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                DismissableLayer,
                {
                  asChild: true,
                  disableOutsidePointerEvents: true,
                  onEscapeKeyDown,
                  onPointerDownOutside,
                  onFocusOutside: (event) => event.preventDefault(),
                  onDismiss: () => context.onOpenChange(false),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectPosition,
                    {
                      role: "listbox",
                      id: context.contentId,
                      "data-state": context.open ? "open" : "closed",
                      dir: context.dir,
                      onContextMenu: (event) => event.preventDefault(),
                      ...contentProps,
                      ...popperContentProps,
                      onPlaced: () => setIsPositioned(true),
                      ref: composedRefs,
                      style: {
                        // flex layout so we can place the scroll buttons properly
                        display: "flex",
                        flexDirection: "column",
                        // reset the outline by default as the content MAY get focused
                        outline: "none",
                        ...contentProps.style
                      },
                      onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
                        const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                        if (event.key === "Tab") event.preventDefault();
                        if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
                        if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
                          const items = getItems().filter((item) => !item.disabled);
                          let candidateNodes = items.map((item) => item.ref.current);
                          if (["ArrowUp", "End"].includes(event.key)) {
                            candidateNodes = candidateNodes.slice().reverse();
                          }
                          if (["ArrowUp", "ArrowDown"].includes(event.key)) {
                            const currentElement = event.target;
                            const currentIndex = candidateNodes.indexOf(currentElement);
                            candidateNodes = candidateNodes.slice(currentIndex + 1);
                          }
                          setTimeout(() => focusFirst2(candidateNodes));
                          event.preventDefault();
                        }
                      })
                    }
                  )
                }
              )
            }
          ) })
        }
      );
    }
  );
  SelectContentImpl.displayName = CONTENT_IMPL_NAME;
  var ITEM_ALIGNED_POSITION_NAME = "SelectItemAlignedPosition";
  var SelectItemAlignedPosition = React__namespace.forwardRef((props, forwardedRef) => {
    const { __scopeSelect, onPlaced, ...popperProps } = props;
    const context = useSelectContext(CONTENT_NAME$2, __scopeSelect);
    const contentContext = useSelectContentContext(CONTENT_NAME$2, __scopeSelect);
    const [contentWrapper, setContentWrapper] = React__namespace.useState(null);
    const [content, setContent] = React__namespace.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
    const getItems = useCollection$1(__scopeSelect);
    const shouldExpandOnScrollRef = React__namespace.useRef(false);
    const shouldRepositionRef = React__namespace.useRef(true);
    const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
    const position = React__namespace.useCallback(() => {
      if (context.trigger && context.valueNode && contentWrapper && content && viewport && selectedItem && selectedItemText) {
        const triggerRect = context.trigger.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        const valueNodeRect = context.valueNode.getBoundingClientRect();
        const itemTextRect = selectedItemText.getBoundingClientRect();
        if (context.dir !== "rtl") {
          const itemTextOffset = itemTextRect.left - contentRect.left;
          const left = valueNodeRect.left - itemTextOffset;
          const leftDelta = triggerRect.left - left;
          const minContentWidth = triggerRect.width + leftDelta;
          const contentWidth = Math.max(minContentWidth, contentRect.width);
          const rightEdge = window.innerWidth - CONTENT_MARGIN;
          const clampedLeft = clamp(left, [
            CONTENT_MARGIN,
            // Prevents the content from going off the starting edge of the
            // viewport. It may still go off the ending edge, but this can be
            // controlled by the user since they may want to manage overflow in a
            // specific way.
            // https://github.com/radix-ui/primitives/issues/2049
            Math.max(CONTENT_MARGIN, rightEdge - contentWidth)
          ]);
          contentWrapper.style.minWidth = minContentWidth + "px";
          contentWrapper.style.left = clampedLeft + "px";
        } else {
          const itemTextOffset = contentRect.right - itemTextRect.right;
          const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
          const rightDelta = window.innerWidth - triggerRect.right - right;
          const minContentWidth = triggerRect.width + rightDelta;
          const contentWidth = Math.max(minContentWidth, contentRect.width);
          const leftEdge = window.innerWidth - CONTENT_MARGIN;
          const clampedRight = clamp(right, [
            CONTENT_MARGIN,
            Math.max(CONTENT_MARGIN, leftEdge - contentWidth)
          ]);
          contentWrapper.style.minWidth = minContentWidth + "px";
          contentWrapper.style.right = clampedRight + "px";
        }
        const items = getItems();
        const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
        const itemsHeight = viewport.scrollHeight;
        const contentStyles = window.getComputedStyle(content);
        const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
        const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
        const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
        const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
        const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
        const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);
        const viewportStyles = window.getComputedStyle(viewport);
        const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
        const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);
        const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
        const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
        const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
        const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
        const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
        const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
        const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;
        if (willAlignWithoutTopOverflow) {
          const isLastItem = items.length > 0 && selectedItem === items[items.length - 1].ref.current;
          contentWrapper.style.bottom = "0px";
          const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
          const clampedTriggerMiddleToBottomEdge = Math.max(
            triggerMiddleToBottomEdge,
            selectedItemHalfHeight + // viewport might have padding bottom, include it to avoid a scrollable viewport
            (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth
          );
          const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
          contentWrapper.style.height = height + "px";
        } else {
          const isFirstItem = items.length > 0 && selectedItem === items[0].ref.current;
          contentWrapper.style.top = "0px";
          const clampedTopEdgeToTriggerMiddle = Math.max(
            topEdgeToTriggerMiddle,
            contentBorderTopWidth + viewport.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
            (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight
          );
          const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
          contentWrapper.style.height = height + "px";
          viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
        }
        contentWrapper.style.margin = `${CONTENT_MARGIN}px 0`;
        contentWrapper.style.minHeight = minContentHeight + "px";
        contentWrapper.style.maxHeight = availableHeight + "px";
        onPlaced == null ? void 0 : onPlaced();
        requestAnimationFrame(() => shouldExpandOnScrollRef.current = true);
      }
    }, [
      getItems,
      context.trigger,
      context.valueNode,
      contentWrapper,
      content,
      viewport,
      selectedItem,
      selectedItemText,
      context.dir,
      onPlaced
    ]);
    useLayoutEffect2(() => position(), [position]);
    const [contentZIndex, setContentZIndex] = React__namespace.useState();
    useLayoutEffect2(() => {
      if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
    }, [content]);
    const handleScrollButtonChange = React__namespace.useCallback(
      (node) => {
        if (node && shouldRepositionRef.current === true) {
          position();
          focusSelectedItem == null ? void 0 : focusSelectedItem();
          shouldRepositionRef.current = false;
        }
      },
      [position, focusSelectedItem]
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectViewportProvider,
      {
        scope: __scopeSelect,
        contentWrapper,
        shouldExpandOnScrollRef,
        onScrollButtonChange: handleScrollButtonChange,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: setContentWrapper,
            style: {
              display: "flex",
              flexDirection: "column",
              position: "fixed",
              zIndex: contentZIndex
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                ...popperProps,
                ref: composedRefs,
                style: {
                  // When we get the height of the content, it includes borders. If we were to set
                  // the height without having `boxSizing: 'border-box'` it would be too big.
                  boxSizing: "border-box",
                  // We need to ensure the content doesn't get taller than the wrapper
                  maxHeight: "100%",
                  ...popperProps.style
                }
              }
            )
          }
        )
      }
    );
  });
  SelectItemAlignedPosition.displayName = ITEM_ALIGNED_POSITION_NAME;
  var POPPER_POSITION_NAME = "SelectPopperPosition";
  var SelectPopperPosition = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      __scopeSelect,
      align = "start",
      collisionPadding = CONTENT_MARGIN,
      ...popperProps
    } = props;
    const popperScope = usePopperScope(__scopeSelect);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content$2,
      {
        ...popperScope,
        ...popperProps,
        ref: forwardedRef,
        align,
        collisionPadding,
        style: {
          // Ensure border-box for floating-ui calculations
          boxSizing: "border-box",
          ...popperProps.style,
          // re-namespace exposed content custom properties
          ...{
            "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-select-content-available-width": "var(--radix-popper-available-width)",
            "--radix-select-content-available-height": "var(--radix-popper-available-height)",
            "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
          }
        }
      }
    );
  });
  SelectPopperPosition.displayName = POPPER_POSITION_NAME;
  var [SelectViewportProvider, useSelectViewportContext] = createSelectContext(CONTENT_NAME$2, {});
  var VIEWPORT_NAME$1 = "SelectViewport";
  var SelectViewport = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeSelect, nonce, ...viewportProps } = props;
      const contentContext = useSelectContentContext(VIEWPORT_NAME$1, __scopeSelect);
      const viewportContext = useSelectViewportContext(VIEWPORT_NAME$1, __scopeSelect);
      const composedRefs = useComposedRefs(forwardedRef, contentContext.onViewportChange);
      const prevScrollTopRef = React__namespace.useRef(0);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "style",
          {
            dangerouslySetInnerHTML: {
              __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}`
            },
            nonce
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Slot, { scope: __scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            "data-radix-select-viewport": "",
            role: "presentation",
            ...viewportProps,
            ref: composedRefs,
            style: {
              // we use position: 'relative' here on the `viewport` so that when we call
              // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
              // (independent of the scrollUpButton).
              position: "relative",
              flex: 1,
              // Viewport should only be scrollable in the vertical direction.
              // This won't work in vertical writing modes, so we'll need to
              // revisit this if/when that is supported
              // https://developer.chrome.com/blog/vertical-form-controls
              overflow: "hidden auto",
              ...viewportProps.style
            },
            onScroll: composeEventHandlers(viewportProps.onScroll, (event) => {
              const viewport = event.currentTarget;
              const { contentWrapper, shouldExpandOnScrollRef } = viewportContext;
              if ((shouldExpandOnScrollRef == null ? void 0 : shouldExpandOnScrollRef.current) && contentWrapper) {
                const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop);
                if (scrolledBy > 0) {
                  const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
                  const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
                  const cssHeight = parseFloat(contentWrapper.style.height);
                  const prevHeight = Math.max(cssMinHeight, cssHeight);
                  if (prevHeight < availableHeight) {
                    const nextHeight = prevHeight + scrolledBy;
                    const clampedNextHeight = Math.min(availableHeight, nextHeight);
                    const heightDiff = nextHeight - clampedNextHeight;
                    contentWrapper.style.height = clampedNextHeight + "px";
                    if (contentWrapper.style.bottom === "0px") {
                      viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
                      contentWrapper.style.justifyContent = "flex-end";
                    }
                  }
                }
              }
              prevScrollTopRef.current = viewport.scrollTop;
            })
          }
        ) })
      ] });
    }
  );
  SelectViewport.displayName = VIEWPORT_NAME$1;
  var GROUP_NAME = "SelectGroup";
  var [SelectGroupContextProvider, useSelectGroupContext] = createSelectContext(GROUP_NAME);
  var SelectGroup = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeSelect, ...groupProps } = props;
      const groupId = useId();
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectGroupContextProvider, { scope: __scopeSelect, id: groupId, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { role: "group", "aria-labelledby": groupId, ...groupProps, ref: forwardedRef }) });
    }
  );
  SelectGroup.displayName = GROUP_NAME;
  var LABEL_NAME = "SelectLabel";
  var SelectLabel$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeSelect, ...labelProps } = props;
      const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { id: groupContext.id, ...labelProps, ref: forwardedRef });
    }
  );
  SelectLabel$1.displayName = LABEL_NAME;
  var ITEM_NAME$1 = "SelectItem";
  var [SelectItemContextProvider, useSelectItemContext] = createSelectContext(ITEM_NAME$1);
  var SelectItem$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeSelect,
        value,
        disabled = false,
        textValue: textValueProp,
        ...itemProps
      } = props;
      const context = useSelectContext(ITEM_NAME$1, __scopeSelect);
      const contentContext = useSelectContentContext(ITEM_NAME$1, __scopeSelect);
      const isSelected = context.value === value;
      const [textValue, setTextValue] = React__namespace.useState(textValueProp ?? "");
      const [isFocused, setIsFocused] = React__namespace.useState(false);
      const composedRefs = useComposedRefs(
        forwardedRef,
        (node) => {
          var _a2;
          return (_a2 = contentContext.itemRefCallback) == null ? void 0 : _a2.call(contentContext, node, value, disabled);
        }
      );
      const textId = useId();
      const pointerTypeRef = React__namespace.useRef("touch");
      const handleSelect = () => {
        if (!disabled) {
          context.onValueChange(value);
          context.onOpenChange(false);
        }
      };
      if (value === "") {
        throw new Error(
          "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
        );
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        SelectItemContextProvider,
        {
          scope: __scopeSelect,
          value,
          disabled,
          textId,
          isSelected,
          onItemTextChange: React__namespace.useCallback((node) => {
            setTextValue((prevTextValue) => prevTextValue || ((node == null ? void 0 : node.textContent) ?? "").trim());
          }, []),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Collection$1.ItemSlot,
            {
              scope: __scopeSelect,
              value,
              disabled,
              textValue,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Primitive.div,
                {
                  role: "option",
                  "aria-labelledby": textId,
                  "data-highlighted": isFocused ? "" : void 0,
                  "aria-selected": isSelected && isFocused,
                  "data-state": isSelected ? "checked" : "unchecked",
                  "aria-disabled": disabled || void 0,
                  "data-disabled": disabled ? "" : void 0,
                  tabIndex: disabled ? void 0 : -1,
                  ...itemProps,
                  ref: composedRefs,
                  onFocus: composeEventHandlers(itemProps.onFocus, () => setIsFocused(true)),
                  onBlur: composeEventHandlers(itemProps.onBlur, () => setIsFocused(false)),
                  onClick: composeEventHandlers(itemProps.onClick, () => {
                    if (pointerTypeRef.current !== "mouse") handleSelect();
                  }),
                  onPointerUp: composeEventHandlers(itemProps.onPointerUp, () => {
                    if (pointerTypeRef.current === "mouse") handleSelect();
                  }),
                  onPointerDown: composeEventHandlers(itemProps.onPointerDown, (event) => {
                    pointerTypeRef.current = event.pointerType;
                  }),
                  onPointerMove: composeEventHandlers(itemProps.onPointerMove, (event) => {
                    var _a2;
                    pointerTypeRef.current = event.pointerType;
                    if (disabled) {
                      (_a2 = contentContext.onItemLeave) == null ? void 0 : _a2.call(contentContext);
                    } else if (pointerTypeRef.current === "mouse") {
                      event.currentTarget.focus({ preventScroll: true });
                    }
                  }),
                  onPointerLeave: composeEventHandlers(itemProps.onPointerLeave, (event) => {
                    var _a2;
                    if (event.currentTarget === document.activeElement) {
                      (_a2 = contentContext.onItemLeave) == null ? void 0 : _a2.call(contentContext);
                    }
                  }),
                  onKeyDown: composeEventHandlers(itemProps.onKeyDown, (event) => {
                    var _a2;
                    const isTypingAhead = ((_a2 = contentContext.searchRef) == null ? void 0 : _a2.current) !== "";
                    if (isTypingAhead && event.key === " ") return;
                    if (SELECTION_KEYS.includes(event.key)) handleSelect();
                    if (event.key === " ") event.preventDefault();
                  })
                }
              )
            }
          )
        }
      );
    }
  );
  SelectItem$1.displayName = ITEM_NAME$1;
  var ITEM_TEXT_NAME = "SelectItemText";
  var SelectItemText = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeSelect, className, style, ...itemTextProps } = props;
      const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect);
      const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect);
      const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect);
      const nativeOptionsContext = useSelectNativeOptionsContext(ITEM_TEXT_NAME, __scopeSelect);
      const [itemTextNode, setItemTextNode] = React__namespace.useState(null);
      const composedRefs = useComposedRefs(
        forwardedRef,
        (node) => setItemTextNode(node),
        itemContext.onItemTextChange,
        (node) => {
          var _a2;
          return (_a2 = contentContext.itemTextRefCallback) == null ? void 0 : _a2.call(contentContext, node, itemContext.value, itemContext.disabled);
        }
      );
      const textContent = itemTextNode == null ? void 0 : itemTextNode.textContent;
      const nativeOption = React__namespace.useMemo(
        () => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: itemContext.value, disabled: itemContext.disabled, children: textContent }, itemContext.value),
        [itemContext.disabled, itemContext.value, textContent]
      );
      const { onNativeOptionAdd, onNativeOptionRemove } = nativeOptionsContext;
      useLayoutEffect2(() => {
        onNativeOptionAdd(nativeOption);
        return () => onNativeOptionRemove(nativeOption);
      }, [onNativeOptionAdd, onNativeOptionRemove, nativeOption]);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { id: itemContext.textId, ...itemTextProps, ref: composedRefs }),
        itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? ReactDOM__namespace.createPortal(itemTextProps.children, context.valueNode) : null
      ] });
    }
  );
  SelectItemText.displayName = ITEM_TEXT_NAME;
  var ITEM_INDICATOR_NAME = "SelectItemIndicator";
  var SelectItemIndicator = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeSelect, ...itemIndicatorProps } = props;
      const itemContext = useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect);
      return itemContext.isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { "aria-hidden": true, ...itemIndicatorProps, ref: forwardedRef }) : null;
    }
  );
  SelectItemIndicator.displayName = ITEM_INDICATOR_NAME;
  var SCROLL_UP_BUTTON_NAME = "SelectScrollUpButton";
  var SelectScrollUpButton$1 = React__namespace.forwardRef((props, forwardedRef) => {
    const contentContext = useSelectContentContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
    const viewportContext = useSelectViewportContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
    const [canScrollUp, setCanScrollUp] = React__namespace.useState(false);
    const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
    useLayoutEffect2(() => {
      if (contentContext.viewport && contentContext.isPositioned) {
        let handleScroll2 = function() {
          const canScrollUp2 = viewport.scrollTop > 0;
          setCanScrollUp(canScrollUp2);
        };
        const viewport = contentContext.viewport;
        handleScroll2();
        viewport.addEventListener("scroll", handleScroll2);
        return () => viewport.removeEventListener("scroll", handleScroll2);
      }
    }, [contentContext.viewport, contentContext.isPositioned]);
    return canScrollUp ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectScrollButtonImpl,
      {
        ...props,
        ref: composedRefs,
        onAutoScroll: () => {
          const { viewport, selectedItem } = contentContext;
          if (viewport && selectedItem) {
            viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
          }
        }
      }
    ) : null;
  });
  SelectScrollUpButton$1.displayName = SCROLL_UP_BUTTON_NAME;
  var SCROLL_DOWN_BUTTON_NAME = "SelectScrollDownButton";
  var SelectScrollDownButton$1 = React__namespace.forwardRef((props, forwardedRef) => {
    const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
    const viewportContext = useSelectViewportContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
    const [canScrollDown, setCanScrollDown] = React__namespace.useState(false);
    const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
    useLayoutEffect2(() => {
      if (contentContext.viewport && contentContext.isPositioned) {
        let handleScroll2 = function() {
          const maxScroll = viewport.scrollHeight - viewport.clientHeight;
          const canScrollDown2 = Math.ceil(viewport.scrollTop) < maxScroll;
          setCanScrollDown(canScrollDown2);
        };
        const viewport = contentContext.viewport;
        handleScroll2();
        viewport.addEventListener("scroll", handleScroll2);
        return () => viewport.removeEventListener("scroll", handleScroll2);
      }
    }, [contentContext.viewport, contentContext.isPositioned]);
    return canScrollDown ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectScrollButtonImpl,
      {
        ...props,
        ref: composedRefs,
        onAutoScroll: () => {
          const { viewport, selectedItem } = contentContext;
          if (viewport && selectedItem) {
            viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
          }
        }
      }
    ) : null;
  });
  SelectScrollDownButton$1.displayName = SCROLL_DOWN_BUTTON_NAME;
  var SelectScrollButtonImpl = React__namespace.forwardRef((props, forwardedRef) => {
    const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props;
    const contentContext = useSelectContentContext("SelectScrollButton", __scopeSelect);
    const autoScrollTimerRef = React__namespace.useRef(null);
    const getItems = useCollection$1(__scopeSelect);
    const clearAutoScrollTimer = React__namespace.useCallback(() => {
      if (autoScrollTimerRef.current !== null) {
        window.clearInterval(autoScrollTimerRef.current);
        autoScrollTimerRef.current = null;
      }
    }, []);
    React__namespace.useEffect(() => {
      return () => clearAutoScrollTimer();
    }, [clearAutoScrollTimer]);
    useLayoutEffect2(() => {
      var _a2;
      const activeItem = getItems().find((item) => item.ref.current === document.activeElement);
      (_a2 = activeItem == null ? void 0 : activeItem.ref.current) == null ? void 0 : _a2.scrollIntoView({ block: "nearest" });
    }, [getItems]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "aria-hidden": true,
        ...scrollIndicatorProps,
        ref: forwardedRef,
        style: { flexShrink: 0, ...scrollIndicatorProps.style },
        onPointerDown: composeEventHandlers(scrollIndicatorProps.onPointerDown, () => {
          if (autoScrollTimerRef.current === null) {
            autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
          }
        }),
        onPointerMove: composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
          var _a2;
          (_a2 = contentContext.onItemLeave) == null ? void 0 : _a2.call(contentContext);
          if (autoScrollTimerRef.current === null) {
            autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
          }
        }),
        onPointerLeave: composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
          clearAutoScrollTimer();
        })
      }
    );
  });
  var SEPARATOR_NAME = "SelectSeparator";
  var SelectSeparator$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeSelect, ...separatorProps } = props;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { "aria-hidden": true, ...separatorProps, ref: forwardedRef });
    }
  );
  SelectSeparator$1.displayName = SEPARATOR_NAME;
  var ARROW_NAME = "SelectArrow";
  var SelectArrow = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeSelect, ...arrowProps } = props;
      const popperScope = usePopperScope(__scopeSelect);
      const context = useSelectContext(ARROW_NAME, __scopeSelect);
      const contentContext = useSelectContentContext(ARROW_NAME, __scopeSelect);
      return context.open && contentContext.position === "popper" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef }) : null;
    }
  );
  SelectArrow.displayName = ARROW_NAME;
  var BUBBLE_INPUT_NAME$2 = "SelectBubbleInput";
  var SelectBubbleInput = React__namespace.forwardRef(
    ({ __scopeSelect, value, ...props }, forwardedRef) => {
      const ref = React__namespace.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const prevValue = usePrevious(value);
      React__namespace.useEffect(() => {
        const select = ref.current;
        if (!select) return;
        const selectProto = window.HTMLSelectElement.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(
          selectProto,
          "value"
        );
        const setValue = descriptor.set;
        if (prevValue !== value && setValue) {
          const event = new Event("change", { bubbles: true });
          setValue.call(select, value);
          select.dispatchEvent(event);
        }
      }, [prevValue, value]);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.select,
        {
          ...props,
          style: { ...VISUALLY_HIDDEN_STYLES, ...props.style },
          ref: composedRefs,
          defaultValue: value
        }
      );
    }
  );
  SelectBubbleInput.displayName = BUBBLE_INPUT_NAME$2;
  function shouldShowPlaceholder(value) {
    return value === "" || value === void 0;
  }
  function useTypeaheadSearch(onSearchChange) {
    const handleSearchChange = useCallbackRef$1(onSearchChange);
    const searchRef = React__namespace.useRef("");
    const timerRef = React__namespace.useRef(0);
    const handleTypeaheadSearch = React__namespace.useCallback(
      (key) => {
        const search = searchRef.current + key;
        handleSearchChange(search);
        (function updateSearch(value) {
          searchRef.current = value;
          window.clearTimeout(timerRef.current);
          if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
        })(search);
      },
      [handleSearchChange]
    );
    const resetTypeahead = React__namespace.useCallback(() => {
      searchRef.current = "";
      window.clearTimeout(timerRef.current);
    }, []);
    React__namespace.useEffect(() => {
      return () => window.clearTimeout(timerRef.current);
    }, []);
    return [searchRef, handleTypeaheadSearch, resetTypeahead];
  }
  function findNextItem(items, search, currentItem) {
    const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
    const normalizedSearch = isRepeated ? search[0] : search;
    const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1;
    let wrappedItems = wrapArray(items, Math.max(currentItemIndex, 0));
    const excludeCurrentItem = normalizedSearch.length === 1;
    if (excludeCurrentItem) wrappedItems = wrappedItems.filter((v2) => v2 !== currentItem);
    const nextItem = wrappedItems.find(
      (item) => item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase())
    );
    return nextItem !== currentItem ? nextItem : void 0;
  }
  function wrapArray(array, startIndex) {
    return array.map((_, index2) => array[(startIndex + index2) % array.length]);
  }
  var Root2$1 = Select$1;
  var Trigger$1 = SelectTrigger$1;
  var Value = SelectValue$1;
  var Icon = SelectIcon;
  var Portal = SelectPortal;
  var Content2$1 = SelectContent$1;
  var Viewport$1 = SelectViewport;
  var Label = SelectLabel$1;
  var Item$1 = SelectItem$1;
  var ItemText = SelectItemText;
  var ItemIndicator = SelectItemIndicator;
  var ScrollUpButton = SelectScrollUpButton$1;
  var ScrollDownButton = SelectScrollDownButton$1;
  var Separator$2 = SelectSeparator$1;
  const Select = Root2$1;
  const SelectValue = Value;
  const SelectTrigger = React__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Trigger$1,
    {
      ref,
      className: cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
      ]
    }
  ));
  SelectTrigger.displayName = Trigger$1.displayName;
  const SelectScrollUpButton = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollUpButton,
    {
      ref,
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
    }
  ));
  SelectScrollUpButton.displayName = ScrollUpButton.displayName;
  const SelectScrollDownButton = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollDownButton,
    {
      ref,
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
    }
  ));
  SelectScrollDownButton.displayName = ScrollDownButton.displayName;
  const SelectContent = React__namespace.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content2$1,
    {
      ref,
      className: cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Viewport$1,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
      ]
    }
  ) }));
  SelectContent.displayName = Content2$1.displayName;
  const SelectLabel = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Label,
    {
      ref,
      className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
      ...props
    }
  ));
  SelectLabel.displayName = Label.displayName;
  const SelectItem = React__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Item$1,
    {
      ref,
      className: cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children })
      ]
    }
  ));
  SelectItem.displayName = Item$1.displayName;
  const SelectSeparator = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Separator$2,
    {
      ref,
      className: cn("-mx-1 my-1 h-px bg-muted", className),
      ...props
    }
  ));
  SelectSeparator.displayName = Separator$2.displayName;
  var NAME = "Separator";
  var DEFAULT_ORIENTATION = "horizontal";
  var ORIENTATIONS = ["horizontal", "vertical"];
  var Separator$1 = React__namespace.forwardRef((props, forwardedRef) => {
    const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
    const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
    const ariaOrientation = orientation === "vertical" ? orientation : void 0;
    const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-orientation": orientation,
        ...semanticProps,
        ...domProps,
        ref: forwardedRef
      }
    );
  });
  Separator$1.displayName = NAME;
  function isValidOrientation(orientation) {
    return ORIENTATIONS.includes(orientation);
  }
  var Root$4 = Separator$1;
  const Separator = React__namespace.forwardRef(
    ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root$4,
      {
        ref,
        decorative,
        orientation,
        className: cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        ),
        ...props
      }
    )
  );
  Separator.displayName = Root$4.displayName;
  const ContentGenerationForm = ({
    topic,
    setTopic,
    keywords,
    setKeywords,
    tone,
    setTone,
    wordCount,
    setWordCount,
    contentType,
    setContentType,
    writingStyle,
    setWritingStyle,
    targetAudience,
    setTargetAudience,
    industryFocus,
    setIndustryFocus,
    contentTemplate,
    setContentTemplate,
    isGenerating,
    onGenerate
  }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/70 backdrop-blur-sm border-0 shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "h-5 w-5 text-purple-600" }),
          "Intelligent Content Generator"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "AI-powered content generation with smart field enhancement and auto-completion" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "topic", children: "Blog Topic *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "topic",
              placeholder: "e.g., Digital Marketing Strategies for 2024",
              value: topic,
              onChange: (e) => setTopic(e.target.value)
            }
          ),
          topic && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-blue-600 bg-blue-50 p-2 rounded", children: "💡 AI will automatically suggest keywords, tone, and audience based on your topic" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "keywords", children: "Target Keywords" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "keywords",
              placeholder: "AI will auto-suggest keywords...",
              value: keywords,
              onChange: (e) => setKeywords(e.target.value)
            }
          ),
          !keywords && topic && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-green-600", children: "✨ Keywords will be auto-generated from your topic" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Writing Tone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: tone, onValueChange: setTone, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "AI will auto-detect..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "professional", children: "Professional" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "casual", children: "Casual" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "authoritative", children: "Authoritative" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "conversational", children: "Conversational" })
              ] })
            ] }),
            !tone && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-purple-600", children: "🎯 Tone auto-detected from content" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Word Count" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: wordCount, onValueChange: setWordCount, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select length" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "short", children: "Short (500-800 words)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "medium", children: "Medium (800-1200 words)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "long", children: "Long (1200-2000 words)" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-5 w-5 text-blue-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { className: "text-base font-semibold", children: "Enhanced AI Settings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-purple-100 text-purple-700", children: "Auto-Enhanced" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Content Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: contentType, onValueChange: setContentType, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "AI will detect..." }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "blog", children: "Blog Post" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "how-to", children: "How-To Guide" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "listicle", children: "Listicle" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "comparison", children: "Comparison" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "case-study", children: "Case Study" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Writing Style" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: writingStyle, onValueChange: setWritingStyle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Auto-optimized..." }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "professional", children: "Professional" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "conversational", children: "Conversational" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "authoritative", children: "Authoritative" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "casual", children: "Casual" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "technical", children: "Technical" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Target Audience" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: targetAudience, onValueChange: setTargetAudience, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "AI will identify..." }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "general", children: "General Public" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "beginners", children: "Beginners" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "professionals", children: "Professionals" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "experts", children: "Industry Experts" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "executives", children: "Business Executives" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Industry Focus" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: industryFocus, onValueChange: setIndustryFocus, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Auto-categorized..." }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "general", children: "General Business" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "technology", children: "Technology" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "marketing", children: "Marketing" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "finance", children: "Finance" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "healthcare", children: "Healthcare" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "education", children: "Education" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ecommerce", children: "E-commerce" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Content Template" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: contentTemplate, onValueChange: setContentTemplate, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Smart template selection..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "standard", children: "Standard Article" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "how-to", children: "How-To Guide" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "listicle", children: "List Article" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "comparison", children: "Comparison Guide" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "AI-Powered Features" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-green-100 text-green-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 mr-1" }),
              "Auto-SEO Optimization"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-blue-100 text-blue-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3 mr-1" }),
              "Smart Image Generation"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-purple-100 text-purple-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-3 w-3 mr-1" }),
              "Keyword Auto-Detection"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-orange-100 text-orange-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-3 w-3 mr-1" }),
              "Content Quality Analysis"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-pink-100 text-pink-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3 mr-1" }),
              "Trend Integration"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-indigo-100 text-indigo-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 mr-1" }),
              "One-Click Publishing"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: onGenerate,
            className: "w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3",
            disabled: isGenerating,
            children: isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }),
              "Generating AI-Enhanced Content..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-4 w-4" }),
              "Generate Smart AI Content"
            ] })
          }
        )
      ] })
    ] });
  };
  var SWITCH_NAME = "Switch";
  var [createSwitchContext, createSwitchScope] = createContextScope(SWITCH_NAME);
  var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
  var Switch$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeSwitch,
        name,
        checked: checkedProp,
        defaultChecked,
        required,
        disabled,
        value = "on",
        onCheckedChange,
        form,
        ...switchProps
      } = props;
      const [button, setButton] = React__namespace.useState(null);
      const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
      const hasConsumerStoppedPropagationRef = React__namespace.useRef(false);
      const isFormControl = button ? form || !!button.closest("form") : true;
      const [checked, setChecked] = useControllableState({
        prop: checkedProp,
        defaultProp: defaultChecked ?? false,
        onChange: onCheckedChange,
        caller: SWITCH_NAME
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "switch",
            "aria-checked": checked,
            "aria-required": required,
            "data-state": getState$3(checked),
            "data-disabled": disabled ? "" : void 0,
            disabled,
            value,
            ...switchProps,
            ref: composedRefs,
            onClick: composeEventHandlers(props.onClick, (event) => {
              setChecked((prevChecked) => !prevChecked);
              if (isFormControl) {
                hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
                if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
              }
            })
          }
        ),
        isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
          SwitchBubbleInput,
          {
            control: button,
            bubbles: !hasConsumerStoppedPropagationRef.current,
            name,
            value,
            checked,
            required,
            disabled,
            form,
            style: { transform: "translateX(-100%)" }
          }
        )
      ] });
    }
  );
  Switch$1.displayName = SWITCH_NAME;
  var THUMB_NAME$1 = "SwitchThumb";
  var SwitchThumb = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeSwitch, ...thumbProps } = props;
      const context = useSwitchContext(THUMB_NAME$1, __scopeSwitch);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.span,
        {
          "data-state": getState$3(context.checked),
          "data-disabled": context.disabled ? "" : void 0,
          ...thumbProps,
          ref: forwardedRef
        }
      );
    }
  );
  SwitchThumb.displayName = THUMB_NAME$1;
  var BUBBLE_INPUT_NAME$1 = "SwitchBubbleInput";
  var SwitchBubbleInput = React__namespace.forwardRef(
    ({
      __scopeSwitch,
      control,
      checked,
      bubbles = true,
      ...props
    }, forwardedRef) => {
      const ref = React__namespace.useRef(null);
      const composedRefs = useComposedRefs(ref, forwardedRef);
      const prevChecked = usePrevious(checked);
      const controlSize = useSize(control);
      React__namespace.useEffect(() => {
        const input = ref.current;
        if (!input) return;
        const inputProto = window.HTMLInputElement.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(
          inputProto,
          "checked"
        );
        const setChecked = descriptor.set;
        if (prevChecked !== checked && setChecked) {
          const event = new Event("click", { bubbles });
          setChecked.call(input, checked);
          input.dispatchEvent(event);
        }
      }, [prevChecked, checked, bubbles]);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "checkbox",
          "aria-hidden": true,
          defaultChecked: checked,
          ...props,
          tabIndex: -1,
          ref: composedRefs,
          style: {
            ...props.style,
            ...controlSize,
            position: "absolute",
            pointerEvents: "none",
            opacity: 0,
            margin: 0
          }
        }
      );
    }
  );
  SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME$1;
  function getState$3(checked) {
    return checked ? "checked" : "unchecked";
  }
  var Root$3 = Switch$1;
  var Thumb = SwitchThumb;
  const Switch = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root$3,
    {
      className: cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      ),
      ...props,
      ref,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          className: cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  ));
  Switch.displayName = Root$3.displayName;
  const AutoGenerationSettings = ({
    autoGenEnabled,
    autoGenFrequency,
    setAutoGenFrequency,
    autoGenTime,
    setAutoGenTime,
    autoGenDay,
    setAutoGenDay,
    autoGenTopics,
    setAutoGenTopics,
    autoGenKeywords,
    setAutoGenKeywords,
    nextScheduledRun,
    contentType,
    setContentType,
    writingStyle,
    setWritingStyle,
    targetAudience,
    setTargetAudience,
    industryFocus,
    setIndustryFocus,
    trendingTopics,
    contentSuggestions,
    onToggleAutoGeneration,
    onGenerateAutoContent
  }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/70 backdrop-blur-sm border-0 shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-blue-600" }),
          "Auto Blog Generation"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Set up automatic blog post generation with customizable frequency and topics" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              autoGenEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4 text-green-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-4 w-4 text-gray-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label$1, { className: "text-base font-medium", children: [
                "Auto-Generation ",
                autoGenEnabled ? "Active" : "Inactive"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", children: autoGenEnabled ? `Next generation: ${nextScheduledRun == null ? void 0 : nextScheduledRun.toLocaleDateString()} at ${nextScheduledRun == null ? void 0 : nextScheduledRun.toLocaleTimeString()}` : "Enable to start automatic blog generation" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: autoGenEnabled,
              onCheckedChange: onToggleAutoGeneration
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Generation Frequency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: autoGenFrequency, onValueChange: setAutoGenFrequency, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "daily", children: "Daily" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "weekly", children: "Weekly" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Generation Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "time",
                value: autoGenTime,
                onChange: (e) => setAutoGenTime(e.target.value)
              }
            )
          ] })
        ] }),
        autoGenFrequency === "weekly" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Day of Week" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: autoGenDay, onValueChange: setAutoGenDay, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "monday", children: "Monday" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "tuesday", children: "Tuesday" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "wednesday", children: "Wednesday" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "thursday", children: "Thursday" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "friday", children: "Friday" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "saturday", children: "Saturday" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "sunday", children: "Sunday" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "autoTopics", children: "Topic Pool (comma-separated)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "autoTopics",
                placeholder: "Digital Marketing, SEO Strategies, Content Creation, Social Media Marketing, Email Marketing...",
                value: autoGenTopics,
                onChange: (e) => setAutoGenTopics(e.target.value),
                rows: 3
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Random topics will be selected from this list for auto-generation" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "autoKeywords", children: "Default Keywords" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "autoKeywords",
                placeholder: "SEO, marketing, business, digital...",
                value: autoGenKeywords,
                onChange: (e) => setAutoGenKeywords(e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-5 w-5 text-indigo-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { className: "text-base font-semibold", children: "Smart Auto-Generation" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Auto Content Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: contentType, onValueChange: setContentType, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select type" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "blog", children: "Blog Posts" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "how-to", children: "How-To Guides" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "listicle", children: "List Articles" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "comparison", children: "Comparisons" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Auto Writing Style" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: writingStyle, onValueChange: setWritingStyle, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select style" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "professional", children: "Professional" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "conversational", children: "Conversational" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "authoritative", children: "Authoritative" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "casual", children: "Casual" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Target Audience" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: targetAudience, onValueChange: setTargetAudience, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select audience" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "general", children: "General Public" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "beginners", children: "Beginners" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "professionals", children: "Professionals" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "experts", children: "Industry Experts" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Industry Focus" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: industryFocus, onValueChange: setIndustryFocus, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select industry" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "general", children: "General Business" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "technology", children: "Technology" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "marketing", children: "Marketing" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "finance", children: "Finance" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "healthcare", children: "Healthcare" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "education", children: "Education" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Smart Features" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-green-100 text-green-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3 mr-1" }),
                "Trend Analysis"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-blue-100 text-blue-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-3 w-3 mr-1" }),
                "SEO Optimization"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-purple-100 text-purple-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-3 w-3 mr-1" }),
                "Smart Keywords"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-orange-100 text-orange-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-3 w-3 mr-1" }),
                "Quality Scoring"
              ] })
            ] })
          ] })
        ] }),
        trendingTopics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-orange-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { className: "text-sm font-semibold", children: "Trending Topic Suggestions" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: trendingTopics.map((topic, index2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "cursor-pointer hover:bg-orange-100 text-xs",
              onClick: () => {
                const currentTopics = autoGenTopics ? autoGenTopics + ", " + topic : topic;
                setAutoGenTopics(currentTopics);
              },
              children: [
                "+ ",
                topic
              ]
            },
            index2
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: "Click to add trending topics to your pool" })
        ] }),
        contentSuggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-4 w-4 text-green-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { className: "text-sm font-semibold", children: "AI Content Suggestions" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: contentSuggestions.slice(0, 3).map((suggestion, index2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-600 p-2 bg-white rounded border-l-2 border-green-300", children: [
            "💡 ",
            suggestion
          ] }, index2)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: onGenerateAutoContent,
            variant: "outline",
            className: "w-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-200",
            disabled: !autoGenTopics.trim(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4 mr-2" }),
              "Test Smart Auto-Generation Now"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: autoGenEnabled ? "default" : "secondary", className: "bg-blue-100 text-blue-700", children: autoGenEnabled ? "Active" : "Inactive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-green-100 text-green-700", children: [
            autoGenFrequency === "daily" ? "Daily" : "Weekly",
            " Schedule"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-purple-100 text-purple-700", children: [
            autoGenTopics.split(",").filter((t) => t.trim()).length,
            " Topics"
          ] })
        ] })
      ] })
    ] });
  };
  const GenerationHistory = ({ autoGenHistory }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/70 backdrop-blur-sm border-0 shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-green-600" }),
          "Generation History"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "View your recent auto-generated blog posts" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: autoGenHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-12 w-12 text-gray-300 mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: "No auto-generated content yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-400 mt-2", children: "Enable auto-generation to start building your content history" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: autoGenHistory.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-blue-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-gray-900", children: entry.topic }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600", children: [
            "Keywords: ",
            entry.keywords
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500", children: [
            "Generated: ",
            new Date(entry.generatedAt).toLocaleDateString(),
            " at ",
            new Date(entry.generatedAt).toLocaleTimeString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-green-100 text-green-700", children: entry.status })
      ] }) }, entry.id)) }) })
    ] });
  };
  const ContentQualityAnalysis = ({
    contentQuality,
    seoScore,
    readabilityScore,
    smartKeywords,
    contentInsights
  }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg mt-4 border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5 text-purple-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { className: "text-base font-semibold", children: "AI Quality Analysis" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Content Quality" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-green-600", children: [
              contentQuality,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: contentQuality, className: "h-2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "SEO Score" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-blue-600", children: [
              seoScore,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: seoScore, className: "h-2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Readability" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-purple-600", children: [
              readabilityScore,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: readabilityScore, className: "h-2" })
        ] })
      ] }),
      smartKeywords.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { className: "text-sm font-medium", children: "AI-Generated Keywords" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: smartKeywords.slice(0, 8).map((keyword, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs bg-white", children: keyword }, index2)) })
      ] }),
      Object.keys(contentInsights).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Read Time:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
              contentInsights.estimatedReadTime,
              " min"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Keyword Density:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: contentInsights.targetKeywordDensity })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Headings:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: contentInsights.recommendedHeadings })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Images:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: contentInsights.suggestedImages })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SEO Complexity:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: contentInsights.seoComplexity })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Competition:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: contentInsights.competitiveLevel })
          ] })
        ] })
      ] })
    ] });
  };
  const GeneratedContentDisplay = ({
    generatedContent,
    generatedImages,
    contentQuality,
    seoScore,
    readabilityScore,
    smartKeywords,
    contentInsights,
    onCopyToClipboard,
    onDownloadImage
  }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/70 backdrop-blur-sm border-0 shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5 text-green-600" }),
            "Generated Content"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "SEO-optimized blog post ready for publication" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: onCopyToClipboard,
              className: "flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3 w-3" }),
                "Copy"
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap text-sm text-gray-800", children: generatedContent }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-green-600", children: generatedContent.split(" ").length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Words" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-blue-600", children: generatedContent.split("\n").filter((line) => line.trim().startsWith("#")).length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Headers" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-purple-600", children: Math.ceil(generatedContent.split(" ").length / 200) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Min Read" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ContentQualityAnalysis,
            {
              contentQuality,
              seoScore,
              readabilityScore,
              smartKeywords,
              contentInsights
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/70 backdrop-blur-sm border-0 shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "h-5 w-5 text-pink-600" }),
            "Contextual Images"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "AI-generated images optimized for your content" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4", children: generatedImages.map((image) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video overflow-hidden rounded-lg bg-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: image.url,
              alt: image.alt,
              className: "w-full h-full object-cover transition-transform group-hover:scale-105"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "secondary",
              size: "sm",
              onClick: () => onDownloadImage(image.url, `blog-image-${image.id}.jpg`),
              className: "bg-white/90 hover:bg-white",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-1" }),
                "Download"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-2 line-clamp-2", children: image.prompt })
        ] }, image.id)) }) })
      ] })
    ] });
  };
  const AnalyticsOverview = ({ analyticsData }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-600", children: analyticsData.topPerformingKeywords.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Top Keywords" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-600", children: analyticsData.contentGaps.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Content Gaps" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-purple-600", children: analyticsData.trendingTopics.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Trending Topics" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-orange-600", children: [
            analyticsData.performanceMetrics.avgCTR,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Avg CTR" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" }),
            "Top Performing Keywords"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: analyticsData.topPerformingKeywords.map((keyword, index2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: keyword.keyword }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600", children: [
                "Position ",
                keyword.position,
                " • ",
                keyword.volume.toLocaleString(),
                " volume"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: keyword.trend === "up" ? "bg-green-100 text-green-700" : keyword.trend === "down" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700", children: keyword.trend })
          ] }, index2)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4" }),
            "Content Opportunities"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: analyticsData.contentGaps.map((gap, index2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: gap.topic }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-blue-100 text-blue-700", children: [
                gap.opportunity,
                "% opportunity"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: gap.suggestedAngle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: gap.opportunity, className: "mt-2 h-2" })
          ] }, index2)) })
        ] })
      ] })
    ] });
  };
  const BlogSuggestions = ({ suggestions, isAnalyzing, onGenerateContent }) => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case "high":
          return "bg-red-100 text-red-700 border-red-200";
        case "medium":
          return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case "low":
          return "bg-green-100 text-green-700 border-green-200";
        default:
          return "bg-gray-100 text-gray-700 border-gray-200";
      }
    };
    const getDifficultyColor = (difficulty) => {
      if (difficulty < 40) return "text-green-600";
      if (difficulty < 70) return "text-yellow-600";
      return "text-red-600";
    };
    if (isAnalyzing) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-12 w-12 mx-auto mb-4 text-purple-600 animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Generating AI-powered blog suggestions..." })
      ] }) });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: suggestions.map((suggestion, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg mb-2", children: suggestion.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mb-3", children: suggestion.angle })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: getPriorityColor(suggestion.priority), children: [
          suggestion.priority,
          " priority"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2 bg-gray-50 rounded", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-blue-600", children: suggestion.potentialTraffic.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600", children: "Est. Traffic/Month" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2 bg-gray-50 rounded", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-lg font-bold ${getDifficultyColor(suggestion.estimatedDifficulty)}`, children: suggestion.estimatedDifficulty }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600", children: "Difficulty Score" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2 bg-gray-50 rounded", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-green-600", children: suggestion.wordCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600", children: "Target Words" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2 bg-gray-50 rounded", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-purple-600", children: suggestion.contentType }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-600", children: "Content Type" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
          suggestion.keywords.slice(0, 3).map((keyword, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: keyword }, i)),
          suggestion.keywords.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
            "+",
            suggestion.keywords.length - 3,
            " more"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => onGenerateContent(suggestion),
            className: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 mr-2" }),
              "Generate Content"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-4 w-4 inline mr-1" }),
        suggestion.reasoning
      ] })
    ] }) }, index2)) });
  };
  const ContentGenerator = ({ isGenerating, generatedContent, selectedSuggestion, onReset }) => {
    if (isGenerating) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-12 w-12 mx-auto mb-4 text-green-600 animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Generating SEO-optimized content..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-2", children: "This may take a few moments" })
      ] }) });
    }
    if (generatedContent && selectedSuggestion) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5 text-green-600" }),
            "Generated Blog Content"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
            "AI-generated content based on analytics: ",
            selectedSuggestion.title
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed", children: generatedContent }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => navigator.clipboard.writeText(generatedContent),
                variant: "outline",
                children: "Copy Content"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => {
                  const blob = new Blob([generatedContent], { type: "text/markdown" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${selectedSuggestion.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.md`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                },
                variant: "outline",
                children: "Download"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: onReset,
                className: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
                children: "Generate New Content"
              }
            )
          ] })
        ] })
      ] });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-gray-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Select a blog suggestion to generate optimized content" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-2", children: "Content will be tailored based on your SEO analytics" })
    ] });
  };
  const useAnalyticsData = () => {
    const [analyticsData, setAnalyticsData] = React$1.useState(null);
    const [blogSuggestions, setBlogSuggestions] = React$1.useState([]);
    const [isAnalyzing, setIsAnalyzing] = React$1.useState(false);
    const { toast: toast2 } = useToast();
    const mockAnalyticsData = {
      topPerformingKeywords: [
        { keyword: "digital marketing trends", position: 5, volume: 12e3, difficulty: 65, trend: "up" },
        { keyword: "content strategy 2024", position: 8, volume: 8500, difficulty: 58, trend: "up" },
        { keyword: "seo optimization tips", position: 12, volume: 15e3, difficulty: 72, trend: "stable" },
        { keyword: "social media marketing", position: 15, volume: 25e3, difficulty: 80, trend: "down" }
      ],
      contentGaps: [
        { topic: "AI-powered content creation", opportunity: 92, competition: "medium", suggestedAngle: "Practical implementation guide" },
        { topic: "Voice search optimization", opportunity: 85, competition: "low", suggestedAngle: "Step-by-step optimization process" },
        { topic: "Local SEO for small businesses", opportunity: 78, competition: "medium", suggestedAngle: "Complete beginner's guide" }
      ],
      competitorAnalysis: [
        { competitor: "Industry Leader A", topTopics: ["Content Marketing", "SEO Strategies"], contentType: "How-to Guides", avgWordCount: 2500 },
        { competitor: "Industry Leader B", topTopics: ["Digital Trends", "Marketing Analytics"], contentType: "Data-driven Articles", avgWordCount: 1800 }
      ],
      trendingTopics: [
        { topic: "ChatGPT for marketing", growth: 340, relevance: 95, urgency: "high" },
        { topic: "Zero-click search optimization", growth: 180, relevance: 88, urgency: "medium" },
        { topic: "Sustainable marketing practices", growth: 120, relevance: 82, urgency: "medium" }
      ],
      performanceMetrics: {
        avgCTR: 3.2,
        avgBounceRate: 45,
        topContentTypes: ["How-to Guides", "List Articles", "Case Studies"],
        bestPerformingLength: 2200
      }
    };
    const generateBlogSuggestions = (data) => {
      setIsAnalyzing(true);
      setTimeout(() => {
        const suggestions = [
          // Gap-based suggestions
          ...data.contentGaps.map((gap) => ({
            title: `The Complete Guide to ${gap.topic}: ${gap.suggestedAngle}`,
            angle: gap.suggestedAngle,
            keywords: [gap.topic.toLowerCase(), "guide", "2024"],
            estimatedDifficulty: gap.competition === "low" ? 30 : gap.competition === "medium" ? 55 : 75,
            potentialTraffic: Math.floor(gap.opportunity * 100),
            contentType: "How-to Guide",
            wordCount: data.performanceMetrics.bestPerformingLength,
            priority: gap.opportunity > 85 ? "high" : "medium",
            reasoning: `High opportunity score (${gap.opportunity}) with ${gap.competition} competition`
          })),
          // Trending topic suggestions
          ...data.trendingTopics.filter((t) => t.urgency === "high").map((trend) => ({
            title: `How ${trend.topic} is Revolutionizing Digital Marketing in 2024`,
            angle: "Trend analysis with practical applications",
            keywords: [trend.topic.toLowerCase(), "marketing", "trends", "2024"],
            estimatedDifficulty: 45,
            potentialTraffic: Math.floor(trend.growth * 50),
            contentType: "Trend Analysis",
            wordCount: 1800,
            priority: "high",
            reasoning: `Trending topic with ${trend.growth}% growth and ${trend.relevance}% relevance`
          })),
          // Keyword improvement suggestions
          ...data.topPerformingKeywords.filter((k2) => k2.position > 10).map((keyword) => ({
            title: `Advanced ${keyword.keyword.charAt(0).toUpperCase() + keyword.keyword.slice(1)} Strategies That Actually Work`,
            angle: "Deep-dive strategic guide",
            keywords: keyword.keyword.split(" ").concat(["strategies", "advanced", "guide"]),
            estimatedDifficulty: keyword.difficulty,
            potentialTraffic: Math.floor(keyword.volume * 0.3),
            contentType: "Strategy Guide",
            wordCount: 2500,
            priority: keyword.position > 15 ? "high" : "medium",
            reasoning: `Currently ranking at position ${keyword.position} with potential to improve`
          }))
        ];
        setBlogSuggestions(suggestions.slice(0, 8));
        setIsAnalyzing(false);
        toast2({
          title: "Analytics Analysis Complete!",
          description: `Generated ${suggestions.length} blog suggestions based on your SEO data`
        });
      }, 3e3);
    };
    React$1.useEffect(() => {
      setTimeout(() => {
        setAnalyticsData(mockAnalyticsData);
        generateBlogSuggestions(mockAnalyticsData);
      }, 1e3);
    }, []);
    return {
      analyticsData,
      blogSuggestions,
      isAnalyzing
    };
  };
  const useContentGeneration$1 = () => {
    const [isGenerating, setIsGenerating] = React$1.useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = React$1.useState(null);
    const [generatedContent, setGeneratedContent] = React$1.useState("");
    const { toast: toast2 } = useToast();
    const generateBlogContent2 = (suggestion) => {
      setIsGenerating(true);
      setSelectedSuggestion(suggestion);
      setTimeout(() => {
        const content = `# ${suggestion.title}

## Introduction

Based on our advanced SEO analytics, this topic represents a significant opportunity in your content strategy. Our data shows ${suggestion.reasoning.toLowerCase()}, making this an ideal target for your next blog post.

## Key Insights from Analytics

- **Estimated Traffic Potential**: ${suggestion.potentialTraffic.toLocaleString()} monthly visitors
- **Competition Level**: ${suggestion.estimatedDifficulty}/100 difficulty score
- **Optimal Word Count**: ${suggestion.wordCount} words (based on top-performing content)
- **Content Type**: ${suggestion.contentType} (highest engagement format)

## Strategic Approach: ${suggestion.angle}

### Understanding the Opportunity

Our analytics indicate this topic has significant search volume with manageable competition. The content gap analysis shows your audience is actively seeking information on this subject.

### Target Keywords Integration

Primary keywords to focus on:
${suggestion.keywords.map((k2) => `- ${k2}`).join("\n")}

### Content Structure Recommendations

1. **Hook**: Start with a compelling statistic or question
2. **Problem Definition**: Clearly outline the challenge your audience faces
3. **Solution Framework**: Provide a step-by-step approach
4. **Real Examples**: Include case studies or practical examples
5. **Actionable Takeaways**: End with clear next steps

## SEO Optimization Strategy

### On-Page Elements
- Title Tag: Optimized for primary keyword
- Meta Description: Compelling and within 155 characters
- H1-H6 Structure: Logical hierarchy with keyword integration
- Internal Linking: Connect to related high-performing content

### Content Enhancement
- **Word Count**: Target ${suggestion.wordCount} words for optimal ranking
- **Readability**: Maintain 8th-grade reading level
- **Media Integration**: Include relevant images and infographics
- **Schema Markup**: Implement article structured data

## Performance Expectations

Based on similar content in your analytics:
- **Expected Ranking**: Top 10 within 3-6 months
- **Traffic Projection**: ${Math.floor(suggestion.potentialTraffic * 0.7)}-${suggestion.potentialTraffic} monthly visitors
- **Engagement Metrics**: Above-average time on page and low bounce rate

## Next Steps

1. Create detailed outline based on this framework
2. Research and include latest statistics and examples
3. Optimize for featured snippets opportunities
4. Plan promotion strategy across your channels
5. Monitor performance and iterate based on results

---

*This content strategy is powered by AI analysis of your SEO performance data, ensuring maximum impact and ROI for your content marketing efforts.*`;
        setGeneratedContent(content);
        setIsGenerating(false);
        toast2({
          title: "Blog Content Generated!",
          description: "AI-powered content based on your analytics data is ready"
        });
      }, 4e3);
    };
    const resetGenerator = () => {
      setGeneratedContent("");
      setSelectedSuggestion(null);
    };
    return {
      isGenerating,
      selectedSuggestion,
      generatedContent,
      generateBlogContent: generateBlogContent2,
      resetGenerator
    };
  };
  const AnalyticsBasedGenerator = () => {
    const { analyticsData, blogSuggestions, isAnalyzing } = useAnalyticsData();
    const { isGenerating, selectedSuggestion, generatedContent, generateBlogContent: generateBlogContent2, resetGenerator } = useContentGeneration$1();
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-white/70 backdrop-blur-sm border-0 shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumnIncreasing, { className: "h-5 w-5 text-blue-600" }),
          "Analytics-Powered Blog Generation"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "AI analyzes your SEO data to suggest high-impact blog topics and generate optimized content" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: !analyticsData ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Analyzing your SEO performance data..." })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "suggestions", className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "analytics", children: "Analytics Overview" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "suggestions", children: "Content Suggestions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "generator", children: "Content Generator" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "analytics", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnalyticsOverview, { analyticsData }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "suggestions", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          BlogSuggestions,
          {
            suggestions: blogSuggestions,
            isAnalyzing,
            onGenerateContent: generateBlogContent2
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "generator", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ContentGenerator,
          {
            isGenerating,
            generatedContent,
            selectedSuggestion,
            onReset: resetGenerator
          }
        ) })
      ] }) })
    ] }) });
  };
  const useContentGeneration = () => {
    const [topic, setTopic] = React$1.useState("");
    const [keywords, setKeywords] = React$1.useState("");
    const [tone, setTone] = React$1.useState("");
    const [wordCount, setWordCount] = React$1.useState("");
    const [generatedContent, setGeneratedContent] = React$1.useState("");
    const [generatedImages, setGeneratedImages] = React$1.useState([]);
    const [isGenerating, setIsGenerating] = React$1.useState(false);
    const [autoGenEnabled, setAutoGenEnabled] = React$1.useState(false);
    const [autoGenFrequency, setAutoGenFrequency] = React$1.useState("weekly");
    const [autoGenTime, setAutoGenTime] = React$1.useState("09:00");
    const [autoGenDay, setAutoGenDay] = React$1.useState("monday");
    const [autoGenTopics, setAutoGenTopics] = React$1.useState("");
    const [autoGenKeywords, setAutoGenKeywords] = React$1.useState("");
    const [autoGenHistory, setAutoGenHistory] = React$1.useState([]);
    const [nextScheduledRun, setNextScheduledRun] = React$1.useState(null);
    const [contentQuality, setContentQuality] = React$1.useState(0);
    const [seoScore, setSeoScore] = React$1.useState(0);
    const [readabilityScore, setReadabilityScore] = React$1.useState(0);
    const [trendingTopics, setTrendingTopics] = React$1.useState([]);
    const [contentSuggestions, setContentSuggestions] = React$1.useState([]);
    const [targetAudience, setTargetAudience] = React$1.useState("");
    const [contentType, setContentType] = React$1.useState("");
    const [writingStyle, setWritingStyle] = React$1.useState("");
    const [industryFocus, setIndustryFocus] = React$1.useState("");
    const [contentTemplate, setContentTemplate] = React$1.useState("");
    const [smartKeywords, setSmartKeywords] = React$1.useState([]);
    const [contentInsights, setContentInsights] = React$1.useState([]);
    const [analyticsData, setAnalyticsData] = React$1.useState(null);
    const [blogSuggestions, setBlogSuggestions] = React$1.useState([]);
    const [selectedAnalyticsSuggestion, setSelectedAnalyticsSuggestion] = React$1.useState(null);
    React$1.useEffect(() => {
      setTrendingTopics([
        "AI Content Creation",
        "Voice Search SEO",
        "Local Business Marketing",
        "Content Personalization",
        "Video Marketing Trends"
      ]);
      setContentSuggestions([
        "Create evergreen content that maintains relevance over time",
        "Focus on solving specific problems your audience faces",
        "Include data-driven insights to boost credibility",
        "Optimize for featured snippets with structured content",
        "Add visual elements to improve engagement"
      ]);
    }, []);
    React$1.useEffect(() => {
      if (topic && topic.length > 10) {
        setTimeout(() => {
          if (!keywords) {
            const autoKeywords = extractKeywordsFromTopic(topic);
            setKeywords(autoKeywords.join(", "));
          }
          if (!tone) {
            const detectedTone = detectToneFromTopic(topic);
            setTone(detectedTone);
          }
          if (!targetAudience) {
            const detectedAudience = detectAudienceFromTopic(topic);
            setTargetAudience(detectedAudience);
          }
          if (!contentType) {
            const detectedType = detectContentTypeFromTopic(topic);
            setContentType(detectedType);
          }
        }, 1e3);
      }
    }, [topic]);
    const extractKeywordsFromTopic = (topicText) => {
      const commonWords = ["the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"];
      return topicText.toLowerCase().split(" ").filter((word) => word.length > 3 && !commonWords.includes(word)).slice(0, 5);
    };
    const detectToneFromTopic = (topicText) => {
      if (topicText.includes("guide") || topicText.includes("how to")) return "professional";
      if (topicText.includes("tips") || topicText.includes("tricks")) return "casual";
      if (topicText.includes("strategy") || topicText.includes("analysis")) return "authoritative";
      return "conversational";
    };
    const detectAudienceFromTopic = (topicText) => {
      if (topicText.includes("beginner") || topicText.includes("basic")) return "beginners";
      if (topicText.includes("advanced") || topicText.includes("expert")) return "experts";
      if (topicText.includes("business") || topicText.includes("enterprise")) return "professionals";
      return "general";
    };
    const detectContentTypeFromTopic = (topicText) => {
      if (topicText.includes("how to") || topicText.includes("guide")) return "how-to";
      if (topicText.includes("best") || topicText.includes("top")) return "listicle";
      if (topicText.includes("vs") || topicText.includes("compare")) return "comparison";
      return "blog";
    };
    const generateContent2 = async () => {
      setIsGenerating(true);
      setTimeout(() => {
        const content = `# ${topic}

## Introduction

${generateIntroduction()}

## Key Points

${generateKeyPoints()}

## SEO-Optimized Content

${generateSEOContent()}

## Conclusion

${generateConclusion()}

---

**Content Quality Score**: ${Math.floor(Math.random() * 20 + 80)}%
**SEO Score**: ${Math.floor(Math.random() * 15 + 85)}%
**Readability Score**: ${Math.floor(Math.random() * 10 + 90)}%`;
        setGeneratedContent(content);
        setContentQuality(Math.floor(Math.random() * 20 + 80));
        setSeoScore(Math.floor(Math.random() * 15 + 85));
        setReadabilityScore(Math.floor(Math.random() * 10 + 90));
        setSmartKeywords(extractKeywordsFromTopic(topic));
        setContentInsights([
          "Content is optimized for target keywords",
          "Reading level is appropriate for target audience",
          "Structure follows SEO best practices",
          "Content length is optimal for topic depth"
        ]);
        setIsGenerating(false);
      }, 3e3);
    };
    const generateIntroduction = () => {
      return `In today's digital landscape, understanding ${topic.toLowerCase()} has become increasingly important. This comprehensive guide will explore the key aspects of ${topic.toLowerCase()} and provide you with actionable insights to improve your results.`;
    };
    const generateKeyPoints = () => {
      const points = [
        `Understanding the fundamentals of ${topic.toLowerCase()}`,
        `Best practices and proven strategies`,
        `Common mistakes to avoid`,
        `Tools and resources for success`,
        `Measuring and optimizing performance`
      ];
      return points.map((point, index2) => `${index2 + 1}. ${point}`).join("\n");
    };
    const generateSEOContent = () => {
      return `When implementing ${topic.toLowerCase()}, it's crucial to focus on both quality and search engine optimization. The key is to create content that serves your audience while incorporating relevant keywords naturally.

### Best Practices:
- Focus on user intent and search behavior
- Create comprehensive, valuable content
- Optimize for featured snippets
- Include internal and external links
- Monitor performance and adjust strategies`;
    };
    const generateConclusion = () => {
      return `Mastering ${topic.toLowerCase()} requires a strategic approach, continuous learning, and consistent implementation. By following the guidelines outlined in this article, you'll be well-positioned to achieve your goals and drive meaningful results.`;
    };
    const generateAutoContent = async () => {
      if (!autoGenTopics.trim()) return;
      const topics = autoGenTopics.split(",").map((t) => t.trim());
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      setTopic(randomTopic);
      setTimeout(() => {
        generateContent2();
      }, 1e3);
      const newEntry = {
        id: Date.now(),
        topic: randomTopic,
        date: /* @__PURE__ */ new Date(),
        status: "completed",
        wordCount: Math.floor(Math.random() * 1e3 + 1500),
        seoScore: Math.floor(Math.random() * 20 + 80)
      };
      setAutoGenHistory((prev) => [newEntry, ...prev.slice(0, 9)]);
    };
    const toggleAutoGeneration = () => {
      setAutoGenEnabled(!autoGenEnabled);
      if (!autoGenEnabled) {
        const now = /* @__PURE__ */ new Date();
        const nextRun = new Date(now);
        if (autoGenFrequency === "daily") {
          nextRun.setDate(now.getDate() + 1);
        } else {
          nextRun.setDate(now.getDate() + 7);
        }
        const [hours, minutes] = autoGenTime.split(":");
        nextRun.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        setNextScheduledRun(nextRun);
      } else {
        setNextScheduledRun(null);
      }
    };
    const copyToClipboard = (content) => {
      navigator.clipboard.writeText(content);
    };
    const downloadImage = (imageUrl) => {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "generated-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    return {
      // Form states
      topic,
      setTopic,
      keywords,
      setKeywords,
      tone,
      setTone,
      wordCount,
      setWordCount,
      // Generated content
      generatedContent,
      generatedImages,
      isGenerating,
      // Auto-generation states
      autoGenEnabled,
      autoGenFrequency,
      setAutoGenFrequency,
      autoGenTime,
      setAutoGenTime,
      autoGenDay,
      setAutoGenDay,
      autoGenTopics,
      setAutoGenTopics,
      autoGenKeywords,
      setAutoGenKeywords,
      autoGenHistory,
      nextScheduledRun,
      // Intelligence states
      contentQuality,
      seoScore,
      readabilityScore,
      trendingTopics,
      contentSuggestions,
      targetAudience,
      setTargetAudience,
      contentType,
      setContentType,
      writingStyle,
      setWritingStyle,
      industryFocus,
      setIndustryFocus,
      contentTemplate,
      setContentTemplate,
      smartKeywords,
      contentInsights,
      // Analytics-based states
      analyticsData,
      setAnalyticsData,
      blogSuggestions,
      setBlogSuggestions,
      selectedAnalyticsSuggestion,
      setSelectedAnalyticsSuggestion,
      // Actions
      generateContent: generateContent2,
      generateAutoContent,
      toggleAutoGeneration,
      copyToClipboard,
      downloadImage
    };
  };
  const IntegratedContentGenerator = () => {
    const {
      // Form states
      topic,
      setTopic,
      keywords,
      setKeywords,
      tone,
      setTone,
      wordCount,
      setWordCount,
      generatedContent,
      generatedImages,
      isGenerating,
      autoGenEnabled,
      autoGenFrequency,
      setAutoGenFrequency,
      autoGenTime,
      setAutoGenTime,
      autoGenDay,
      setAutoGenDay,
      autoGenTopics,
      setAutoGenTopics,
      autoGenKeywords,
      setAutoGenKeywords,
      autoGenHistory,
      nextScheduledRun,
      contentQuality,
      seoScore,
      readabilityScore,
      trendingTopics,
      contentSuggestions,
      targetAudience,
      setTargetAudience,
      contentType,
      setContentType,
      writingStyle,
      setWritingStyle,
      industryFocus,
      setIndustryFocus,
      contentTemplate,
      setContentTemplate,
      smartKeywords,
      contentInsights,
      generateContent: generateContent2,
      generateAutoContent,
      toggleAutoGeneration,
      copyToClipboard,
      downloadImage
    } = useContentGeneration();
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "analytics", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "analytics", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumnIncreasing, { className: "h-4 w-4" }),
          "Analytics Generation"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "manual", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "h-4 w-4" }),
          "Manual Generation"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "auto", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
          "Auto Generation"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "history", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
          "Generation History"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "analytics", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnalyticsBasedGenerator, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "manual", className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ContentGenerationForm,
          {
            topic,
            setTopic,
            keywords,
            setKeywords,
            tone,
            setTone,
            wordCount,
            setWordCount,
            contentType,
            setContentType,
            writingStyle,
            setWritingStyle,
            targetAudience,
            setTargetAudience,
            industryFocus,
            setIndustryFocus,
            contentTemplate,
            setContentTemplate,
            isGenerating,
            onGenerate: generateContent2
          }
        ),
        generatedContent && /* @__PURE__ */ jsxRuntimeExports.jsx(
          GeneratedContentDisplay,
          {
            generatedContent,
            generatedImages,
            contentQuality,
            seoScore,
            readabilityScore,
            smartKeywords,
            contentInsights,
            onCopyToClipboard: copyToClipboard,
            onDownloadImage: downloadImage
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "auto", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        AutoGenerationSettings,
        {
          autoGenEnabled,
          setAutoGenEnabled: () => {
          },
          autoGenFrequency,
          setAutoGenFrequency,
          autoGenTime,
          setAutoGenTime,
          autoGenDay,
          setAutoGenDay,
          autoGenTopics,
          setAutoGenTopics,
          autoGenKeywords,
          setAutoGenKeywords,
          nextScheduledRun,
          contentType,
          setContentType,
          writingStyle,
          setWritingStyle,
          targetAudience,
          setTargetAudience,
          industryFocus,
          setIndustryFocus,
          trendingTopics,
          contentSuggestions,
          onToggleAutoGeneration: toggleAutoGeneration,
          onGenerateAutoContent: generateAutoContent
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "history", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GenerationHistory, { autoGenHistory }) })
    ] }) });
  };
  var COLLAPSIBLE_NAME = "Collapsible";
  var [createCollapsibleContext, createCollapsibleScope] = createContextScope(COLLAPSIBLE_NAME);
  var [CollapsibleProvider, useCollapsibleContext] = createCollapsibleContext(COLLAPSIBLE_NAME);
  var Collapsible = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeCollapsible,
        open: openProp,
        defaultOpen,
        disabled,
        onOpenChange,
        ...collapsibleProps
      } = props;
      const [open, setOpen] = useControllableState({
        prop: openProp,
        defaultProp: defaultOpen ?? false,
        onChange: onOpenChange,
        caller: COLLAPSIBLE_NAME
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        CollapsibleProvider,
        {
          scope: __scopeCollapsible,
          disabled,
          contentId: useId(),
          open,
          onOpenToggle: React__namespace.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.div,
            {
              "data-state": getState$2(open),
              "data-disabled": disabled ? "" : void 0,
              ...collapsibleProps,
              ref: forwardedRef
            }
          )
        }
      );
    }
  );
  Collapsible.displayName = COLLAPSIBLE_NAME;
  var TRIGGER_NAME$2 = "CollapsibleTrigger";
  var CollapsibleTrigger = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeCollapsible, ...triggerProps } = props;
      const context = useCollapsibleContext(TRIGGER_NAME$2, __scopeCollapsible);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          "aria-controls": context.contentId,
          "aria-expanded": context.open || false,
          "data-state": getState$2(context.open),
          "data-disabled": context.disabled ? "" : void 0,
          disabled: context.disabled,
          ...triggerProps,
          ref: forwardedRef,
          onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
        }
      );
    }
  );
  CollapsibleTrigger.displayName = TRIGGER_NAME$2;
  var CONTENT_NAME$1 = "CollapsibleContent";
  var CollapsibleContent = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { forceMount, ...contentProps } = props;
      const context = useCollapsibleContext(CONTENT_NAME$1, props.__scopeCollapsible);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContentImpl, { ...contentProps, ref: forwardedRef, present }) });
    }
  );
  CollapsibleContent.displayName = CONTENT_NAME$1;
  var CollapsibleContentImpl = React__namespace.forwardRef((props, forwardedRef) => {
    const { __scopeCollapsible, present, children, ...contentProps } = props;
    const context = useCollapsibleContext(CONTENT_NAME$1, __scopeCollapsible);
    const [isPresent, setIsPresent] = React__namespace.useState(present);
    const ref = React__namespace.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const heightRef = React__namespace.useRef(0);
    const height = heightRef.current;
    const widthRef = React__namespace.useRef(0);
    const width = widthRef.current;
    const isOpen = context.open || isPresent;
    const isMountAnimationPreventedRef = React__namespace.useRef(isOpen);
    const originalStylesRef = React__namespace.useRef(void 0);
    React__namespace.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    useLayoutEffect2(() => {
      const node = ref.current;
      if (node) {
        originalStylesRef.current = originalStylesRef.current || {
          transitionDuration: node.style.transitionDuration,
          animationName: node.style.animationName
        };
        node.style.transitionDuration = "0s";
        node.style.animationName = "none";
        const rect = node.getBoundingClientRect();
        heightRef.current = rect.height;
        widthRef.current = rect.width;
        if (!isMountAnimationPreventedRef.current) {
          node.style.transitionDuration = originalStylesRef.current.transitionDuration;
          node.style.animationName = originalStylesRef.current.animationName;
        }
        setIsPresent(present);
      }
    }, [context.open, present]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": getState$2(context.open),
        "data-disabled": context.disabled ? "" : void 0,
        id: context.contentId,
        hidden: !isOpen,
        ...contentProps,
        ref: composedRefs,
        style: {
          [`--radix-collapsible-content-height`]: height ? `${height}px` : void 0,
          [`--radix-collapsible-content-width`]: width ? `${width}px` : void 0,
          ...props.style
        },
        children: isOpen && children
      }
    );
  });
  function getState$2(open) {
    return open ? "open" : "closed";
  }
  var Root$2 = Collapsible;
  var Trigger = CollapsibleTrigger;
  var Content = CollapsibleContent;
  var ACCORDION_NAME = "Accordion";
  var ACCORDION_KEYS = ["Home", "End", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];
  var [Collection, useCollection, createCollectionScope] = createCollection(ACCORDION_NAME);
  var [createAccordionContext, createAccordionScope] = createContextScope(ACCORDION_NAME, [
    createCollectionScope,
    createCollapsibleScope
  ]);
  var useCollapsibleScope = createCollapsibleScope();
  var Accordion$1 = React$1.forwardRef(
    (props, forwardedRef) => {
      const { type, ...accordionProps } = props;
      const singleProps = accordionProps;
      const multipleProps = accordionProps;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeAccordion, children: type === "multiple" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImplMultiple, { ...multipleProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImplSingle, { ...singleProps, ref: forwardedRef }) });
    }
  );
  Accordion$1.displayName = ACCORDION_NAME;
  var [AccordionValueProvider, useAccordionValueContext] = createAccordionContext(ACCORDION_NAME);
  var [AccordionCollapsibleProvider, useAccordionCollapsibleContext] = createAccordionContext(
    ACCORDION_NAME,
    { collapsible: false }
  );
  var AccordionImplSingle = React$1.forwardRef(
    (props, forwardedRef) => {
      const {
        value: valueProp,
        defaultValue,
        onValueChange = () => {
        },
        collapsible = false,
        ...accordionSingleProps
      } = props;
      const [value, setValue] = useControllableState({
        prop: valueProp,
        defaultProp: defaultValue ?? "",
        onChange: onValueChange,
        caller: ACCORDION_NAME
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        AccordionValueProvider,
        {
          scope: props.__scopeAccordion,
          value: React$1.useMemo(() => value ? [value] : [], [value]),
          onItemOpen: setValue,
          onItemClose: React$1.useCallback(() => collapsible && setValue(""), [collapsible, setValue]),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionCollapsibleProvider, { scope: props.__scopeAccordion, collapsible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImpl, { ...accordionSingleProps, ref: forwardedRef }) })
        }
      );
    }
  );
  var AccordionImplMultiple = React$1.forwardRef((props, forwardedRef) => {
    const {
      value: valueProp,
      defaultValue,
      onValueChange = () => {
      },
      ...accordionMultipleProps
    } = props;
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? [],
      onChange: onValueChange,
      caller: ACCORDION_NAME
    });
    const handleItemOpen = React$1.useCallback(
      (itemValue) => setValue((prevValue = []) => [...prevValue, itemValue]),
      [setValue]
    );
    const handleItemClose = React$1.useCallback(
      (itemValue) => setValue((prevValue = []) => prevValue.filter((value2) => value2 !== itemValue)),
      [setValue]
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccordionValueProvider,
      {
        scope: props.__scopeAccordion,
        value,
        onItemOpen: handleItemOpen,
        onItemClose: handleItemClose,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionCollapsibleProvider, { scope: props.__scopeAccordion, collapsible: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImpl, { ...accordionMultipleProps, ref: forwardedRef }) })
      }
    );
  });
  var [AccordionImplProvider, useAccordionContext] = createAccordionContext(ACCORDION_NAME);
  var AccordionImpl = React$1.forwardRef(
    (props, forwardedRef) => {
      const { __scopeAccordion, disabled, dir, orientation = "vertical", ...accordionProps } = props;
      const accordionRef = React$1.useRef(null);
      const composedRefs = useComposedRefs(accordionRef, forwardedRef);
      const getItems = useCollection(__scopeAccordion);
      const direction = useDirection(dir);
      const isDirectionLTR = direction === "ltr";
      const handleKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
        var _a2;
        if (!ACCORDION_KEYS.includes(event.key)) return;
        const target = event.target;
        const triggerCollection = getItems().filter((item) => {
          var _a3;
          return !((_a3 = item.ref.current) == null ? void 0 : _a3.disabled);
        });
        const triggerIndex = triggerCollection.findIndex((item) => item.ref.current === target);
        const triggerCount = triggerCollection.length;
        if (triggerIndex === -1) return;
        event.preventDefault();
        let nextIndex = triggerIndex;
        const homeIndex = 0;
        const endIndex = triggerCount - 1;
        const moveNext = () => {
          nextIndex = triggerIndex + 1;
          if (nextIndex > endIndex) {
            nextIndex = homeIndex;
          }
        };
        const movePrev = () => {
          nextIndex = triggerIndex - 1;
          if (nextIndex < homeIndex) {
            nextIndex = endIndex;
          }
        };
        switch (event.key) {
          case "Home":
            nextIndex = homeIndex;
            break;
          case "End":
            nextIndex = endIndex;
            break;
          case "ArrowRight":
            if (orientation === "horizontal") {
              if (isDirectionLTR) {
                moveNext();
              } else {
                movePrev();
              }
            }
            break;
          case "ArrowDown":
            if (orientation === "vertical") {
              moveNext();
            }
            break;
          case "ArrowLeft":
            if (orientation === "horizontal") {
              if (isDirectionLTR) {
                movePrev();
              } else {
                moveNext();
              }
            }
            break;
          case "ArrowUp":
            if (orientation === "vertical") {
              movePrev();
            }
            break;
        }
        const clampedIndex = nextIndex % triggerCount;
        (_a2 = triggerCollection[clampedIndex].ref.current) == null ? void 0 : _a2.focus();
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        AccordionImplProvider,
        {
          scope: __scopeAccordion,
          disabled,
          direction: dir,
          orientation,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: __scopeAccordion, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.div,
            {
              ...accordionProps,
              "data-orientation": orientation,
              ref: composedRefs,
              onKeyDown: disabled ? void 0 : handleKeyDown
            }
          ) })
        }
      );
    }
  );
  var ITEM_NAME = "AccordionItem";
  var [AccordionItemProvider, useAccordionItemContext] = createAccordionContext(ITEM_NAME);
  var AccordionItem$1 = React$1.forwardRef(
    (props, forwardedRef) => {
      const { __scopeAccordion, value, ...accordionItemProps } = props;
      const accordionContext = useAccordionContext(ITEM_NAME, __scopeAccordion);
      const valueContext = useAccordionValueContext(ITEM_NAME, __scopeAccordion);
      const collapsibleScope = useCollapsibleScope(__scopeAccordion);
      const triggerId = useId();
      const open = value && valueContext.value.includes(value) || false;
      const disabled = accordionContext.disabled || props.disabled;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        AccordionItemProvider,
        {
          scope: __scopeAccordion,
          open,
          disabled,
          triggerId,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Root$2,
            {
              "data-orientation": accordionContext.orientation,
              "data-state": getState$1(open),
              ...collapsibleScope,
              ...accordionItemProps,
              ref: forwardedRef,
              disabled,
              open,
              onOpenChange: (open2) => {
                if (open2) {
                  valueContext.onItemOpen(value);
                } else {
                  valueContext.onItemClose(value);
                }
              }
            }
          )
        }
      );
    }
  );
  AccordionItem$1.displayName = ITEM_NAME;
  var HEADER_NAME = "AccordionHeader";
  var AccordionHeader = React$1.forwardRef(
    (props, forwardedRef) => {
      const { __scopeAccordion, ...headerProps } = props;
      const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
      const itemContext = useAccordionItemContext(HEADER_NAME, __scopeAccordion);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.h3,
        {
          "data-orientation": accordionContext.orientation,
          "data-state": getState$1(itemContext.open),
          "data-disabled": itemContext.disabled ? "" : void 0,
          ...headerProps,
          ref: forwardedRef
        }
      );
    }
  );
  AccordionHeader.displayName = HEADER_NAME;
  var TRIGGER_NAME$1 = "AccordionTrigger";
  var AccordionTrigger$1 = React$1.forwardRef(
    (props, forwardedRef) => {
      const { __scopeAccordion, ...triggerProps } = props;
      const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
      const itemContext = useAccordionItemContext(TRIGGER_NAME$1, __scopeAccordion);
      const collapsibleContext = useAccordionCollapsibleContext(TRIGGER_NAME$1, __scopeAccordion);
      const collapsibleScope = useCollapsibleScope(__scopeAccordion);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.ItemSlot, { scope: __scopeAccordion, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Trigger,
        {
          "aria-disabled": itemContext.open && !collapsibleContext.collapsible || void 0,
          "data-orientation": accordionContext.orientation,
          id: itemContext.triggerId,
          ...collapsibleScope,
          ...triggerProps,
          ref: forwardedRef
        }
      ) });
    }
  );
  AccordionTrigger$1.displayName = TRIGGER_NAME$1;
  var CONTENT_NAME = "AccordionContent";
  var AccordionContent$1 = React$1.forwardRef(
    (props, forwardedRef) => {
      const { __scopeAccordion, ...contentProps } = props;
      const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
      const itemContext = useAccordionItemContext(CONTENT_NAME, __scopeAccordion);
      const collapsibleScope = useCollapsibleScope(__scopeAccordion);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Content,
        {
          role: "region",
          "aria-labelledby": itemContext.triggerId,
          "data-orientation": accordionContext.orientation,
          ...collapsibleScope,
          ...contentProps,
          ref: forwardedRef,
          style: {
            ["--radix-accordion-content-height"]: "var(--radix-collapsible-content-height)",
            ["--radix-accordion-content-width"]: "var(--radix-collapsible-content-width)",
            ...props.style
          }
        }
      );
    }
  );
  AccordionContent$1.displayName = CONTENT_NAME;
  function getState$1(open) {
    return open ? "open" : "closed";
  }
  var Root2 = Accordion$1;
  var Item = AccordionItem$1;
  var Header = AccordionHeader;
  var Trigger2 = AccordionTrigger$1;
  var Content2 = AccordionContent$1;
  const Accordion = Root2;
  const AccordionItem = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item,
    {
      ref,
      className: cn("border-b", className),
      ...props
    }
  ));
  AccordionItem.displayName = "AccordionItem";
  const AccordionTrigger = React__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { className: "flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Trigger2,
    {
      ref,
      className: cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200" })
      ]
    }
  ) }));
  AccordionTrigger.displayName = Trigger2.displayName;
  const AccordionContent = React__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("pb-4 pt-0", className), children })
    }
  ));
  AccordionContent.displayName = Content2.displayName;
  var CHECKBOX_NAME = "Checkbox";
  var [createCheckboxContext, createCheckboxScope] = createContextScope(CHECKBOX_NAME);
  var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
  function CheckboxProvider(props) {
    const {
      __scopeCheckbox,
      checked: checkedProp,
      children,
      defaultChecked,
      disabled,
      form,
      name,
      onCheckedChange,
      required,
      value = "on",
      // @ts-expect-error
      internal_do_not_use_render
    } = props;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: CHECKBOX_NAME
    });
    const [control, setControl] = React__namespace.useState(null);
    const [bubbleInput, setBubbleInput] = React__namespace.useState(null);
    const hasConsumerStoppedPropagationRef = React__namespace.useRef(false);
    const isFormControl = control ? !!form || !!control.closest("form") : (
      // We set this to true by default so that events bubble to forms without JS (SSR)
      true
    );
    const context = {
      checked,
      disabled,
      setChecked,
      control,
      setControl,
      name,
      form,
      value,
      hasConsumerStoppedPropagationRef,
      required,
      defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
      isFormControl,
      bubbleInput,
      setBubbleInput
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProviderImpl,
      {
        scope: __scopeCheckbox,
        ...context,
        children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
      }
    );
  }
  var TRIGGER_NAME = "CheckboxTrigger";
  var CheckboxTrigger = React__namespace.forwardRef(
    ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
      const {
        control,
        value,
        disabled,
        checked,
        required,
        setControl,
        setChecked,
        hasConsumerStoppedPropagationRef,
        isFormControl,
        bubbleInput
      } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
      const composedRefs = useComposedRefs(forwardedRef, setControl);
      const initialCheckedStateRef = React__namespace.useRef(checked);
      React__namespace.useEffect(() => {
        const form = control == null ? void 0 : control.form;
        if (form) {
          const reset = () => setChecked(initialCheckedStateRef.current);
          form.addEventListener("reset", reset);
          return () => form.removeEventListener("reset", reset);
        }
      }, [control, setChecked]);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "checkbox",
          "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...checkboxProps,
          ref: composedRefs,
          onKeyDown: composeEventHandlers(onKeyDown, (event) => {
            if (event.key === "Enter") event.preventDefault();
          }),
          onClick: composeEventHandlers(onClick, (event) => {
            setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
            if (bubbleInput && isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      );
    }
  );
  CheckboxTrigger.displayName = TRIGGER_NAME;
  var Checkbox$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeCheckbox,
        name,
        checked,
        defaultChecked,
        required,
        disabled,
        value,
        onCheckedChange,
        form,
        ...checkboxProps
      } = props;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckboxProvider,
        {
          __scopeCheckbox,
          checked,
          defaultChecked,
          disabled,
          required,
          onCheckedChange,
          name,
          form,
          value,
          internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CheckboxTrigger,
              {
                ...checkboxProps,
                ref: forwardedRef,
                __scopeCheckbox
              }
            ),
            isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CheckboxBubbleInput,
              {
                __scopeCheckbox
              }
            )
          ] })
        }
      );
    }
  );
  Checkbox$1.displayName = CHECKBOX_NAME;
  var INDICATOR_NAME = "CheckboxIndicator";
  var CheckboxIndicator = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
      const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Presence,
        {
          present: forceMount || isIndeterminate(context.checked) || context.checked === true,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.span,
            {
              "data-state": getState(context.checked),
              "data-disabled": context.disabled ? "" : void 0,
              ...indicatorProps,
              ref: forwardedRef,
              style: { pointerEvents: "none", ...props.style }
            }
          )
        }
      );
    }
  );
  CheckboxIndicator.displayName = INDICATOR_NAME;
  var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
  var CheckboxBubbleInput = React__namespace.forwardRef(
    ({ __scopeCheckbox, ...props }, forwardedRef) => {
      const {
        control,
        hasConsumerStoppedPropagationRef,
        checked,
        defaultChecked,
        required,
        disabled,
        name,
        value,
        form,
        bubbleInput,
        setBubbleInput
      } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
      const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
      const prevChecked = usePrevious(checked);
      const controlSize = useSize(control);
      React__namespace.useEffect(() => {
        const input = bubbleInput;
        if (!input) return;
        const inputProto = window.HTMLInputElement.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(
          inputProto,
          "checked"
        );
        const setChecked = descriptor.set;
        const bubbles = !hasConsumerStoppedPropagationRef.current;
        if (prevChecked !== checked && setChecked) {
          const event = new Event("click", { bubbles });
          input.indeterminate = isIndeterminate(checked);
          setChecked.call(input, isIndeterminate(checked) ? false : checked);
          input.dispatchEvent(event);
        }
      }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
      const defaultCheckedRef = React__namespace.useRef(isIndeterminate(checked) ? false : checked);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.input,
        {
          type: "checkbox",
          "aria-hidden": true,
          defaultChecked: defaultChecked ?? defaultCheckedRef.current,
          required,
          disabled,
          name,
          value,
          form,
          ...props,
          tabIndex: -1,
          ref: composedRefs,
          style: {
            ...props.style,
            ...controlSize,
            position: "absolute",
            pointerEvents: "none",
            opacity: 0,
            margin: 0,
            // We transform because the input is absolutely positioned but we have
            // rendered it **after** the button. This pulls it back to sit on top
            // of the button.
            transform: "translateX(-100%)"
          }
        }
      );
    }
  );
  CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
  function isFunction(value) {
    return typeof value === "function";
  }
  function isIndeterminate(checked) {
    return checked === "indeterminate";
  }
  function getState(checked) {
    return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
  }
  const Checkbox = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Checkbox$1,
    {
      ref,
      className: cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckboxIndicator,
        {
          className: cn("flex items-center justify-center text-current"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" })
        }
      )
    }
  ));
  Checkbox.displayName = Checkbox$1.displayName;
  const Table = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "table",
    {
      ref,
      className: cn("w-full caption-bottom text-sm", className),
      ...props
    }
  ) }));
  Table.displayName = "Table";
  const TableHeader = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
  TableHeader.displayName = "TableHeader";
  const TableBody = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tbody",
    {
      ref,
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  ));
  TableBody.displayName = "TableBody";
  const TableFooter = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tfoot",
    {
      ref,
      className: cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      ),
      ...props
    }
  ));
  TableFooter.displayName = "TableFooter";
  const TableRow = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      ref,
      className: cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      ),
      ...props
    }
  ));
  TableRow.displayName = "TableRow";
  const TableHead = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      ref,
      className: cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      ),
      ...props
    }
  ));
  TableHead.displayName = "TableHead";
  const TableCell = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      ref,
      className: cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className),
      ...props
    }
  ));
  TableCell.displayName = "TableCell";
  const TableCaption = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "caption",
    {
      ref,
      className: cn("mt-4 text-sm text-muted-foreground", className),
      ...props
    }
  ));
  TableCaption.displayName = "TableCaption";
  const AdvancedSEOAnalytics = () => {
    const [goals, setGoals] = React$1.useState({
      campaignObjective: "",
      targetAudience: "",
      businessObjectives: "",
      kpis: [],
      timeline: ""
    });
    const [keywordsInput, setKeywordsInput] = React$1.useState("");
    const [keywordRows, setKeywordRows] = React$1.useState([]);
    const handleGoalInputChange = (e) => {
      const { name, value } = e.target;
      setGoals((prev) => ({ ...prev, [name]: value }));
    };
    const handleKpiChange = (kpi) => {
      setGoals((prev) => ({
        ...prev,
        kpis: prev.kpis.includes(kpi) ? prev.kpis.filter((item) => item !== kpi) : [...prev.kpis, kpi]
      }));
    };
    const availableKpis = ["organic traffic", "keyword rankings", "ctr", "bounce rate", "conversions", "impressions"];
    const handleSaveGoals = () => {
      console.log("Goals Saved:", goals);
      alert("Goals saved! (Check console for data)");
    };
    const calculateKeywordScore = (row) => {
      const sv = parseFloat(String(row.searchVolume)) || 0;
      const kd = parseFloat(String(row.keywordDifficulty)) || 0;
      const rel = (parseFloat(String(row.relevance)) || 0) * 10;
      let rank = parseFloat(String(row.currentRanking)) || 101;
      const normalizedSV = Math.min(sv / 1e3, 100);
      const normalizedRank = Math.max(0, 100 - (rank - 1));
      const score = normalizedSV * 0.3 + (100 - kd) * 0.3 + // Higher KD is worse, so invert
      rel * 0.2 + normalizedRank * 0.2;
      return parseFloat(score.toFixed(2));
    };
    const handleAddKeywordsFromTextarea = () => {
      const newKeywords = keywordsInput.split("\n").map((k2) => k2.trim()).filter((k2) => k2).map((k2) => ({
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        // simple unique id
        keyword: k2,
        searchVolume: "",
        keywordDifficulty: "",
        relevance: "",
        currentRanking: "",
        cpc: "",
        intent: "",
        targetPage: "",
        score: 0
        // Initial score
      }));
      const updatedKeywords = [...keywordRows, ...newKeywords];
      updatedKeywords.forEach((kw) => kw.score = calculateKeywordScore(kw));
      setKeywordRows(updatedKeywords);
      setKeywordsInput("");
    };
    const handleKeywordRowChange = (id, field, value) => {
      setKeywordRows(
        (prevRows) => prevRows.map((row) => {
          if (row.id === id) {
            const updatedRow = { ...row, [field]: value };
            if (["searchVolume", "keywordDifficulty", "relevance", "currentRanking"].includes(field)) {
              updatedRow.score = calculateKeywordScore(updatedRow);
            }
            return updatedRow;
          }
          return row;
        })
      );
    };
    const removeKeywordRow = (id) => {
      setKeywordRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };
    const addNewKeywordRow = () => {
      const newRow = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        keyword: "",
        searchVolume: "",
        keywordDifficulty: "",
        relevance: "",
        currentRanking: "",
        cpc: "",
        intent: "",
        targetPage: "",
        score: 0
      };
      setKeywordRows((prev) => [...prev, newRow]);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "mb-8 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-3xl font-bold text-center text-gray-800", children: "Advanced SEO Analytics & Strategy Hub" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-center text-gray-600", children: "A comprehensive workflow to analyze, strategize, and optimize your SEO performance." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Accordion, { type: "single", collapsible: true, className: "w-full space-y-6", defaultValue: "item-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "item-1", className: "bg-white rounded-lg shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100", children: "1. Define Goals and Scope" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "p-6 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "campaignObjective", className: "text-lg font-medium text-gray-700", children: "SEO Campaign Objective" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "campaignObjective",
                  name: "campaignObjective",
                  value: goals.campaignObjective,
                  onChange: handleGoalInputChange,
                  placeholder: "e.g., Increase organic traffic by 20% in 6 months, achieve top 3 rankings for X keywords.",
                  className: "mt-2 min-h-[100px]"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "targetAudience", className: "text-lg font-medium text-gray-700", children: "Target Audience" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "targetAudience",
                  name: "targetAudience",
                  value: goals.targetAudience,
                  onChange: handleGoalInputChange,
                  placeholder: "Describe your ideal customer personas, their demographics, needs, and online behavior.",
                  className: "mt-2 min-h-[100px]"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "businessObjectives", className: "text-lg font-medium text-gray-700", children: "Broader Business Objectives" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "businessObjectives",
                  name: "businessObjectives",
                  value: goals.businessObjectives,
                  onChange: handleGoalInputChange,
                  placeholder: "e.g., Increase overall sales, improve brand visibility, generate qualified leads.",
                  className: "mt-2 min-h-[100px]"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { className: "text-lg font-medium text-gray-700", children: "Key Performance Indicators (KPIs)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 mt-2", children: availableKpis.map((kpi) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 p-2 bg-slate-50 rounded-md", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Checkbox,
                  {
                    id: `kpi-${kpi}`,
                    checked: goals.kpis.includes(kpi),
                    onCheckedChange: () => handleKpiChange(kpi)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: `kpi-${kpi}`, className: "text-sm font-medium capitalize", children: kpi })
              ] }, kpi)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "timeline", className: "text-lg font-medium text-gray-700", children: "Campaign Timeline" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "timeline",
                  name: "timeline",
                  value: goals.timeline,
                  onChange: handleGoalInputChange,
                  placeholder: "e.g., 3 months, 6 months, 1 year",
                  className: "mt-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSaveGoals, size: "lg", children: "Save Goals & Strategy" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "item-2", className: "bg-white rounded-lg shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100", children: "2. Keyword Research and Scoring" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "p-6 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Keyword Discovery" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "manualKeywords", className: "font-medium", children: "Enter Keywords (one per line)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "manualKeywords",
                      value: keywordsInput,
                      onChange: (e) => setKeywordsInput(e.target.value),
                      placeholder: "e.g.\nbest coffee beans\nhow to make espresso\nlocal coffee shops",
                      className: "mt-2 min-h-[120px]"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleAddKeywordsFromTextarea, className: "mt-2 mr-2", children: "Add Keywords to Table" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Analyze Competitor Keywords (Mock)" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Keyword Scoring & Categorization" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[200px]", children: "Keyword" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Search Vol." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "KD (0-100)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Relevance (1-10)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Rank" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "CPC ($)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Score" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Intent" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Target Page URL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Actions" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: keywordRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: row.keyword,
                        onChange: (e) => handleKeywordRowChange(row.id, "keyword", e.target.value),
                        placeholder: "Enter keyword",
                        className: "min-w-[180px]"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        value: row.searchVolume,
                        onChange: (e) => handleKeywordRowChange(row.id, "searchVolume", e.target.value),
                        placeholder: "e.g. 1500",
                        className: "w-24"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        value: row.keywordDifficulty,
                        onChange: (e) => handleKeywordRowChange(row.id, "keywordDifficulty", e.target.value),
                        placeholder: "e.g. 30",
                        className: "w-20"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        value: row.relevance,
                        onChange: (e) => handleKeywordRowChange(row.id, "relevance", e.target.value),
                        placeholder: "1-10",
                        min: "1",
                        max: "10",
                        className: "w-20"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        value: row.currentRanking,
                        onChange: (e) => handleKeywordRowChange(row.id, "currentRanking", e.target.value),
                        placeholder: "e.g. 5",
                        className: "w-20"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "text",
                        value: row.cpc,
                        onChange: (e) => handleKeywordRowChange(row.id, "cpc", e.target.value),
                        placeholder: "$0.75",
                        className: "w-20"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: row.score }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: row.intent,
                        onValueChange: (value) => handleKeywordRowChange(row.id, "intent", value),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[150px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Intent" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "informational", children: "Informational" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "navigational", children: "Navigational" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "transactional", children: "Transactional" })
                          ] })
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: row.targetPage,
                        onChange: (e) => handleKeywordRowChange(row.id, "targetPage", e.target.value),
                        placeholder: "/blog/my-article",
                        className: "min-w-[180px]"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => removeKeywordRow(row.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-red-500" }) }) })
                  ] }, row.id)) })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: addNewKeywordRow, className: "mt-4", children: "Add New Keyword" })
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "item-3", className: "bg-white rounded-lg shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100", children: "3. Technical SEO Audit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "p-6 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "technicalAuditUrl", children: "Site URL for Audit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "technicalAuditUrl", placeholder: "https://example.com", className: "mt-1" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Run Site Health Check (Mock)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Analyze Core Web Vitals (Mock)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Check Indexability (Mock)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Mock Audit Results:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { readOnly: true, value: "No broken links found. Core Web Vitals: LCP 2.1s, FID 30ms, CLS 0.05. Indexability: 95% pages indexed.", className: "mt-1 min-h-[100px] bg-gray-50" })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "item-4", className: "bg-white rounded-lg shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100", children: "4. On-Page SEO Analysis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "p-6 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "onPageUrl", children: "Page URL to Analyze" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "onPageUrl", placeholder: "https://example.com/my-page", className: "mt-1" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Title Tag" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700", children: "Your Current Title (Mock)" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Meta Description" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700", children: "Your current meta description is here... (Mock)" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Header Tags (H1-H6)" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700", children: "H1: Found, H2: 3 Found (Mock)" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Keyword Density" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700", children: "Primary Keyword: 2.5% (Mock)" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2 mt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Optimize Title/Meta (Mock)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Improve Internal Linking (Mock)" })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "item-5", className: "bg-white rounded-lg shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100", children: "5. Off-Page SEO and Link Analysis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "p-6 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "offPageDomain", children: "Domain for Backlink Audit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "offPageDomain", placeholder: "example.com", className: "mt-1" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Total Backlinks" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: "1,250 (Mock)" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Referring Domains" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: "350 (Mock)" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Toxic Links Found" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-red-600", children: "15 (Mock)" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2 mt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", outline: true, children: "Identify Toxic Links (Mock)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Start Link Building Campaign (Mock)" })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "item-6", className: "bg-white rounded-lg shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100", children: "6. Content Strategy Development" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "p-6 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "contentPlan", children: "Content Plan based on Keyword Clusters" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "contentPlan", placeholder: "Develop pillar pages and topic clusters...", className: "mt-1 min-h-[150px]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "publishingFreq", children: "Publishing Frequency" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "publishingFreq", placeholder: "e.g., 2 articles per week", className: "mt-1" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { children: "Mock Content Calendar:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border rounded-md mt-1 bg-gray-50 min-h-[100px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: 'Mon, Oct 28: Blog Post - "Ultimate Guide to X"' }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: 'Wed, Oct 30: Video - "How to use Y feature"' }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: 'Fri, Nov 1: Case Study - "Success with Z"' })
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "item-7", className: "bg-white rounded-lg shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100", children: "7. Performance Tracking and Reporting" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "p-6 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Keyword Rankings" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-green-600", children: "+5 positions (Mock)" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Organic Traffic" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-blue-600", children: "10.2K/mo (Mock)" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Conversions" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-purple-600", children: "120 (Mock)" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border rounded-md mt-1 bg-gray-50 min-h-[150px] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: "[Mock Chart Area for Performance Trends]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", children: "Generate Monthly Report (Mock)" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "item-8", className: "bg-white rounded-lg shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "text-xl font-semibold hover:no-underline p-6 rounded-t-lg hover:bg-slate-50 transition-colors data-[state=open]:bg-slate-100", children: "8. Continuous Monitoring and Adaptation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "p-6 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "algoLog", children: "Algorithm Update Log & Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "algoLog", placeholder: "Log major algorithm updates and their impact...", className: "mt-1 min-h-[100px]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Check for New SEO Trends (Mock)" })
          ] }) })
        ] })
      ] })
    ] });
  };
  const MetaTagsManager = () => {
    const { language, setLanguage: setGlobalLanguage } = useLanguage();
    const [content, setContent] = React$1.useState("");
    const [title, setTitle] = React$1.useState("");
    const [description, setDescription] = React$1.useState("");
    const [keywords, setKeywords] = React$1.useState("");
    const [isGenerating, setIsGenerating] = React$1.useState(false);
    const [copied, setCopied] = React$1.useState(false);
    const [autoEnhanced, setAutoEnhanced] = React$1.useState(false);
    const [apiKeyError, setApiKeyError] = React$1.useState(null);
    const { toast: toast2 } = useToast();
    React$1.useEffect(() => {
      if (content && content.length > 100 && !autoEnhanced && !isGenerating) {
        generateMetaTags();
      }
    }, [content, autoEnhanced, isGenerating, language]);
    const parseMetaTagResponse = (text) => {
      let genTitle = "";
      let genDescription = "";
      let genKeywords = "";
      const lines = text.split("\n");
      lines.forEach((line) => {
        if (line.toLowerCase().startsWith("title:")) {
          genTitle = line.substring("title:".length).trim();
        } else if (line.toLowerCase().startsWith("description:")) {
          genDescription = line.substring("description:".length).trim();
        } else if (line.toLowerCase().startsWith("keywords:")) {
          genKeywords = line.substring("keywords:".length).trim();
        }
      });
      if (!genTitle && !genDescription && !genKeywords && lines.length >= 3) {
        genTitle = lines[0] || "";
        genDescription = lines[1] || "";
        genKeywords = lines[2] || "";
      } else {
        if (!genTitle) genTitle = "Could not extract title";
        if (!genDescription) genDescription = "Could not extract description";
        if (!genKeywords) genKeywords = "Could not extract keywords";
      }
      return { title: genTitle, description: genDescription, keywords: genKeywords };
    };
    const generateMetaTags = async () => {
      if (!content.trim()) {
        toast2({
          title: language === "th" ? "กรุณาใส่เนื้อหา" : "Please enter content",
          description: language === "th" ? "ใส่เนื้อหาเพื่อสร้าง Meta Tags อัตโนมัติ" : "Enter content to generate meta tags automatically",
          variant: "destructive"
        });
        return;
      }
      setApiKeyError(null);
      setIsGenerating(true);
      setAutoEnhanced(false);
      const langInstruction = language === "th" ? "Thai" : "English";
      const titleCharLimit = language === "th" ? 65 : 60;
      const descCharLimit = language === "th" ? 150 : 160;
      const prompt = `Based on the following content in ${langInstruction}, generate SEO-friendly meta tags.

Content:
---
${content.substring(0, 2e3)}
---

Please generate the following, ensuring each is on a new line and clearly labeled:
1.  Title: An SEO-friendly title, around ${titleCharLimit} characters.
2.  Description: A compelling meta description, around ${descCharLimit} characters.
3.  Keywords: 5-7 relevant keywords, comma-separated.

Output format example:
Title: [Generated Title Here]
Description: [Generated Meta Description Here]
Keywords: [keyword1, keyword2, keyword3, keyword4, keyword5]

Generate the meta tags in ${langInstruction}.`;
      try {
        const response = await generateBlogContent(prompt);
        const { title: genTitle, description: genDescription, keywords: genKeywords } = parseMetaTagResponse(response);
        setTitle(genTitle);
        setDescription(genDescription);
        setKeywords(genKeywords);
        setAutoEnhanced(true);
        toast2({
          title: language === "th" ? "สร้าง Meta Tags สำเร็จ!" : "Smart Meta Tags Generated!",
          description: language === "th" ? "AI สร้าง Meta Tags ที่เหมาะสมแล้ว" : "AI has generated optimized meta tags."
        });
      } catch (error) {
        console.error("Error generating meta tags with Gemini:", error);
        let errorDesc = "An error occurred while generating meta tags.";
        if (error.isApiKeyInvalid) {
          errorDesc = "The Gemini API key is invalid or missing. Please go to Settings to add it.";
          setApiKeyError(errorDesc);
        } else if (error.message) {
          errorDesc = error.message;
        }
        toast2({ title: "Meta Tag Generation Failed", description: errorDesc, variant: "destructive" });
      } finally {
        setIsGenerating(false);
      }
    };
    const copyToClipboard = () => {
      const metaHtml = `<title>${title}</title>
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">`;
      navigator.clipboard.writeText(metaHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
      toast2({
        title: language === "th" ? "คัดลอกแล้ว!" : "Copied!",
        description: language === "th" ? "Meta Tags ถูกคัดลอกไปยังคลิปบอร์ดแล้ว" : "Meta tags copied to clipboard"
      });
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-5 w-5" }),
          language === "th" ? "จัดการ Meta Tags อัจฉริยะ" : "Smart Meta Tags Manager",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-purple-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: language === "th" ? "AI สร้าง Meta Tags อัตโนมัติสำหรับเนื้อหาของคุณ" : "AI automatically generates meta tags for your content." })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: language === "th" ? "เนื้อหาหลัก (AI จะวิเคราะห์อัตโนมัติ)" : "Main Content (AI will auto-analyze)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: language === "th" ? "วางเนื้อหาของคุณที่นี่ AI จะสร้าง Meta Tags ให้อัตโนมัติ..." : "Paste your content here and AI will automatically generate meta tags...",
                value: content,
                onChange: (e) => {
                  setContent(e.target.value);
                  setAutoEnhanced(false);
                },
                rows: 4
              }
            ),
            content && content.length > 50 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-green-600 bg-green-50 p-2 rounded", children: [
              "🤖 ",
              language === "th" ? `AI กำลังวิเคราะห์เนื้อหา ${content.split(" ").length} คำ...` : `AI analyzing ${content.split(" ").length} words of content...`
            ] })
          ] }),
          !autoEnhanced && content && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: generateMetaTags, disabled: isGenerating, className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "h-4 w-4 mr-2" }),
            isGenerating ? language === "th" ? "กำลังสร้าง..." : "Generating..." : language === "th" ? "สร้าง Meta Tags ด้วย AI" : "Generate Meta Tags with AI"
          ] }),
          autoEnhanced && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-purple-50 border border-purple-200 rounded-lg p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-purple-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: language === "th" ? "AI เพิ่มประสิทธิภาพแล้ว!" : "AI Enhanced!" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-purple-600 mt-1", children: language === "th" ? "Meta Tags ถูกสร้างอัตโนมัติจากการวิเคราะห์เนื้อหา" : "Meta tags automatically generated from content analysis" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "basic", className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "basic", children: language === "th" ? "Meta Tags (Auto-Enhanced)" : "Meta Tags (Auto-Enhanced)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "social", children: language === "th" ? "Social Media (Auto-Generated)" : "Social Media (Auto-Generated)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "basic", className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: language === "th" ? "หัวข้อหน้า (Auto-Generated)" : "Page Title (Auto-Generated)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: title,
                  onChange: (e) => setTitle(e.target.value),
                  placeholder: language === "th" ? "AI จะสร้างหัวข้อให้อัตโนมัติ..." : "AI will generate title automatically..."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-gray-500 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  title.length,
                  " ",
                  language === "th" ? "ตัวอักษร" : "characters"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: title.length > 60 ? "destructive" : title.length > 50 ? "secondary" : "default", children: title.length > 60 ? language === "th" ? "ยาวเกินไป" : "Too long" : title.length > 50 ? language === "th" ? "ดี" : "Perfect" : language === "th" ? "สามารถเพิ่มได้" : "Can add more" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: language === "th" ? "คำอธิบาย (Auto-Generated)" : "Meta Description (Auto-Generated)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: description,
                  onChange: (e) => setDescription(e.target.value),
                  placeholder: language === "th" ? "AI จะสร้างคำอธิบายให้อัตโนมัติ..." : "AI will generate description automatically...",
                  rows: 3
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-gray-500 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  description.length,
                  " ",
                  language === "th" ? "ตัวอักษร" : "characters"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: description.length > 160 ? "destructive" : description.length > 150 ? "secondary" : "default", children: description.length > 160 ? language === "th" ? "ยาวเกินไป" : "Too long" : description.length > 150 ? language === "th" ? "ดี" : "Perfect" : language === "th" ? "สามารถเพิ่มได้" : "Can add more" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: language === "th" ? "คำสำคัญ (Auto-Extracted)" : "Keywords (Auto-Extracted)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: keywords,
                  onChange: (e) => setKeywords(e.target.value),
                  placeholder: language === "th" ? "AI จะดึงคำสำคัญให้อัตโนมัติ..." : "AI will extract keywords automatically..."
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "social", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Open Graph (Facebook)" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-600", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "og:title:" }),
                  " ",
                  title || (language === "th" ? "ไม่มีหัวข้อ" : "No title")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-600", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "og:description:" }),
                  " ",
                  description || (language === "th" ? "ไม่มีคำอธิบาย" : "No description")
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Twitter Cards" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-600", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "twitter:title:" }),
                  " ",
                  title || (language === "th" ? "ไม่มีหัวข้อ" : "No title")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-600", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "twitter:description:" }),
                  " ",
                  description || (language === "th" ? "ไม่มีคำอธิบาย" : "No description")
                ] })
              ] })
            ] })
          ] }) })
        ] }),
        (title || description || keywords) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: copyToClipboard, className: "w-full", children: [
          copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4 mr-2" }),
          copied ? language === "th" ? "คัดลอกแล้ว!" : "Copied!" : language === "th" ? "คัดลอก HTML Meta Tags" : "Copy HTML Meta Tags"
        ] }) })
      ] })
    ] });
  };
  const SchemaMarkupGenerator = () => {
    const [language, setLanguage] = React$1.useState("en");
    const [schemaType, setSchemaType] = React$1.useState("");
    const [businessName, setBusinessName] = React$1.useState("");
    const [description, setDescription] = React$1.useState("");
    const [website, setWebsite] = React$1.useState("");
    const [phone, setPhone] = React$1.useState("");
    const [address, setAddress] = React$1.useState("");
    const [generatedSchema, setGeneratedSchema] = React$1.useState("");
    const [copied, setCopied] = React$1.useState(false);
    const { toast: toast2 } = useToast();
    const schemaTypes = [
      { value: "organization", label: language === "th" ? "องค์กร/บริษัท" : "Organization/Company" },
      { value: "local-business", label: language === "th" ? "ธุรกิจท้องถิ่น" : "Local Business" },
      { value: "restaurant", label: language === "th" ? "ร้านอาหาร" : "Restaurant" },
      { value: "article", label: language === "th" ? "บทความ" : "Article" },
      { value: "product", label: language === "th" ? "สินค้า" : "Product" },
      { value: "service", label: language === "th" ? "บริการ" : "Service" },
      { value: "event", label: language === "th" ? "งานอีเวนต์" : "Event" }
    ];
    const generateSchema = () => {
      if (!schemaType || !businessName) {
        toast2({
          title: language === "th" ? "กรุณาใส่ข้อมูลที่จำเป็น" : "Please fill required fields",
          description: language === "th" ? "เลือกประเภท Schema และใส่ชื่อธุรกิจ" : "Select schema type and enter business name",
          variant: "destructive"
        });
        return;
      }
      let schema = {};
      switch (schemaType) {
        case "organization":
          schema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": businessName,
            "description": description,
            "url": website,
            "telephone": phone,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": address
            }
          };
          break;
        case "local-business":
          schema = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": businessName,
            "description": description,
            "url": website,
            "telephone": phone,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": address
            },
            "openingHours": "Mo-Fr 09:00-18:00"
          };
          break;
        case "restaurant":
          schema = {
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "name": businessName,
            "description": description,
            "url": website,
            "telephone": phone,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": address
            },
            "servesCuisine": language === "th" ? "อาหารไทย" : "Thai cuisine",
            "priceRange": "$$"
          };
          break;
        case "article":
          schema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": businessName,
            "description": description,
            "url": website,
            "author": {
              "@type": "Person",
              "name": "Author Name"
            },
            "datePublished": (/* @__PURE__ */ new Date()).toISOString(),
            "publisher": {
              "@type": "Organization",
              "name": "Publisher Name"
            }
          };
          break;
        default:
          schema = {
            "@context": "https://schema.org",
            "@type": "Thing",
            "name": businessName,
            "description": description,
            "url": website
          };
      }
      const cleanSchema = JSON.parse(JSON.stringify(schema, (key, value) => {
        return value === "" ? void 0 : value;
      }));
      setGeneratedSchema(JSON.stringify(cleanSchema, null, 2));
      toast2({
        title: language === "th" ? "สร้าง Schema สำเร็จ!" : "Schema Generated!",
        description: language === "th" ? "Schema Markup ถูกสร้างแล้ว" : "Schema markup has been generated"
      });
    };
    const copySchema = () => {
      const schemaHtml = `<script type="application/ld+json">
${generatedSchema}
<\/script>`;
      navigator.clipboard.writeText(schemaHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
      toast2({
        title: language === "th" ? "คัดลอกแล้ว!" : "Copied!",
        description: language === "th" ? "Schema markup ถูกคัดลอกไปยังคลิปบอร์ดแล้ว" : "Schema markup copied to clipboard"
      });
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-5 w-5" }),
            language === "th" ? "สร้าง Schema Markup อัตโนมัติ" : "Auto Schema Markup Generator"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: language === "th" ? "สร้าง Schema.org markup เพื่อช่วยให้ Google เข้าใจเนื้อหาของคุณได้ดีขึ้น" : "Generate Schema.org markup to help Google better understand your content" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: language === "en" ? "default" : "outline",
              size: "sm",
              onClick: () => setLanguage("en"),
              children: "EN"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: language === "th" ? "default" : "outline",
              size: "sm",
              onClick: () => setLanguage("th"),
              children: "TH"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium mb-2", children: [
              language === "th" ? "ประเภท Schema" : "Schema Type",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: schemaType, onValueChange: setSchemaType, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: language === "th" ? "เลือกประเภท Schema" : "Select schema type" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: schemaTypes.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: type.value, children: type.label }, type.value)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium mb-2", children: [
              language === "th" ? "ชื่อธุรกิจ/หัวข้อ" : "Business Name/Title",
              " *"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: businessName,
                onChange: (e) => setBusinessName(e.target.value),
                placeholder: language === "th" ? "ใส่ชื่อธุรกิจหรือหัวข้อ" : "Enter business name or title"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: language === "th" ? "คำอธิบาย" : "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: description,
              onChange: (e) => setDescription(e.target.value),
              placeholder: language === "th" ? "คำอธิบายเกี่ยวกับธุรกิจหรือเนื้อหา" : "Description about your business or content",
              rows: 3
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: language === "th" ? "เว็บไซต์" : "Website" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: website,
                onChange: (e) => setWebsite(e.target.value),
                placeholder: "https://example.com"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: language === "th" ? "เบอร์โทรศัพท์" : "Phone Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: phone,
                onChange: (e) => setPhone(e.target.value),
                placeholder: language === "th" ? "02-xxx-xxxx" : "+1-xxx-xxx-xxxx"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium mb-2", children: language === "th" ? "ที่อยู่" : "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: address,
              onChange: (e) => setAddress(e.target.value),
              placeholder: language === "th" ? "ที่อยู่ธุรกิจ" : "Business address"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: generateSchema, className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 mr-2" }),
          language === "th" ? "สร้าง Schema Markup" : "Generate Schema Markup"
        ] }),
        generatedSchema && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium", children: language === "th" ? "Schema Markup ที่สร้างขึ้น" : "Generated Schema Markup" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "JSON-LD" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: generatedSchema }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: copySchema, className: "w-full", children: [
            copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4 mr-2" }),
            copied ? language === "th" ? "คัดลอกแล้ว!" : "Copied!" : language === "th" ? "คัดลอก HTML Code" : "Copy HTML Code"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600 bg-blue-50 p-3 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: language === "th" ? "วิธีใช้:" : "How to use:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            language === "th" ? "วาง code นี้ในส่วน <head> ของหน้าเว็บ หรือก่อน </body> tag" : "Paste this code in the <head> section of your webpage or before the </body> tag"
          ] })
        ] })
      ] })
    ] });
  };
  const TechnicalSEOAudit = () => {
    const [language, setLanguage] = React$1.useState("en");
    const [url, setUrl] = React$1.useState("");
    const [isAuditing, setIsAuditing] = React$1.useState(false);
    const [auditResults, setAuditResults] = React$1.useState([]);
    const [overallScore, setOverallScore] = React$1.useState(0);
    const { toast: toast2 } = useToast();
    const runAudit = async () => {
      if (!url.trim()) {
        toast2({
          title: language === "th" ? "กรุณาใส่ URL" : "Please enter URL",
          description: language === "th" ? "ใส่ URL ของเว็บไซต์ที่ต้องการตรวจสอบ" : "Enter the website URL to audit",
          variant: "destructive"
        });
        return;
      }
      setIsAuditing(true);
      setTimeout(() => {
        const mockResults = [
          {
            category: language === "th" ? "ประสิทธิภาพ" : "Performance",
            items: [
              { name: language === "th" ? "ความเร็วในการโหลด" : "Page Load Speed", status: "warning", description: language === "th" ? "หน้าเว็บโหลดใน 3.2 วินาที (ควรน้อยกว่า 3 วินาที)" : "Page loads in 3.2s (should be under 3s)" },
              { name: language === "th" ? "การบีบอัดรูปภาพ" : "Image Optimization", status: "fail", description: language === "th" ? "รูปภาพหลายรูปยังไม่ได้ปรับขนาดที่เหมาะสม" : "Several images are not optimized" },
              { name: language === "th" ? "การบีบอัด CSS/JS" : "CSS/JS Minification", status: "pass", description: language === "th" ? "ไฟล์ถูกบีบอัดแล้ว" : "Files are properly minified" }
            ]
          },
          {
            category: language === "th" ? "โครงสร้าง HTML" : "HTML Structure",
            items: [
              { name: language === "th" ? "Title Tags" : "Title Tags", status: "pass", description: language === "th" ? "ทุกหน้ามี title tag ที่เหมาะสม" : "All pages have proper title tags" },
              { name: language === "th" ? "Meta Descriptions" : "Meta Descriptions", status: "warning", description: language === "th" ? "บางหน้าไม่มี meta description" : "Some pages missing meta descriptions" },
              { name: language === "th" ? "Header Tags (H1-H6)" : "Header Tags (H1-H6)", status: "pass", description: language === "th" ? "มีการใช้ header tags อย่างถูกต้อง" : "Proper header tag structure" }
            ]
          },
          {
            category: language === "th" ? "ความปลอดภัย" : "Security",
            items: [
              { name: "HTTPS", status: "pass", description: language === "th" ? "เว็บไซต์ใช้ HTTPS" : "Website uses HTTPS" },
              { name: "SSL Certificate", status: "pass", description: language === "th" ? "ใบรับรอง SSL ถูกต้อง" : "Valid SSL certificate" },
              { name: language === "th" ? "การเปลี่ยนเส้นทาง" : "Redirects", status: "warning", description: language === "th" ? "พบการเปลี่ยนเส้นทางหลายชั้น" : "Multiple redirect chains found" }
            ]
          },
          {
            category: language === "th" ? "การเข้าถึงได้" : "Accessibility",
            items: [
              { name: language === "th" ? "Alt Text สำหรับรูปภาพ" : "Image Alt Text", status: "warning", description: language === "th" ? "รูปภาพบางรูปไม่มี alt text" : "Some images missing alt text" },
              { name: language === "th" ? "ความตัดกันของสี" : "Color Contrast", status: "pass", description: language === "th" ? "ความตัดกันของสีเพียงพอ" : "Sufficient color contrast" },
              { name: language === "th" ? "การนำทาง" : "Navigation", status: "pass", description: language === "th" ? "เมนูนำทางชัดเจน" : "Clear navigation structure" }
            ]
          }
        ];
        setAuditResults(mockResults);
        const totalItems = mockResults.reduce((acc, category) => acc + category.items.length, 0);
        const passedItems = mockResults.reduce(
          (acc, category) => acc + category.items.filter((item) => item.status === "pass").length,
          0
        );
        const score = Math.round(passedItems / totalItems * 100);
        setOverallScore(score);
        setIsAuditing(false);
        toast2({
          title: language === "th" ? "การตรวจสอบเสร็จสิ้น!" : "Audit Complete!",
          description: language === "th" ? `คะแนน SEO ของคุณคือ ${score}%` : `Your SEO score is ${score}%`
        });
      }, 3e3);
    };
    const getStatusIcon = (status) => {
      switch (status) {
        case "pass":
          return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-500" });
        case "warning":
          return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-yellow-500" });
        case "fail":
          return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-red-500" });
        default:
          return null;
      }
    };
    const getStatusBadge = (status) => {
      switch (status) {
        case "pass":
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-green-100 text-green-700", children: language === "th" ? "ผ่าน" : "Pass" });
        case "warning":
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-yellow-100 text-yellow-700", children: language === "th" ? "คำเตือน" : "Warning" });
        case "fail":
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", children: language === "th" ? "ไม่ผ่าน" : "Fail" });
        default:
          return null;
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5" }),
            language === "th" ? "ตรวจสอบ Technical SEO อัตโนมัติ" : "Automated Technical SEO Audit"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: language === "th" ? "ตรวจสอบปัญหา SEO ทางเทคนิคและรับคำแนะนำเพื่อปรับปรุง" : "Identify technical SEO issues and get recommendations for improvement" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: language === "en" ? "default" : "outline",
              size: "sm",
              onClick: () => setLanguage("en"),
              children: "EN"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: language === "th" ? "default" : "outline",
              size: "sm",
              onClick: () => setLanguage("th"),
              children: "TH"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: url,
              onChange: (e) => setUrl(e.target.value),
              placeholder: language === "th" ? "https://example.com" : "https://example.com",
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: runAudit, disabled: isAuditing, children: [
            isAuditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 mr-2" }),
            isAuditing ? language === "th" ? "กำลังตรวจสอบ..." : "Auditing..." : language === "th" ? "เริ่มตรวจสอบ" : "Start Audit"
          ] })
        ] }),
        isAuditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: language === "th" ? "กำลังวิเคราะห์..." : "Analyzing..." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: language === "th" ? "กรุณารอสักครู่" : "Please wait" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: 66, className: "h-2" })
        ] }),
        auditResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-bold text-blue-600 mb-2", children: [
              overallScore,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-medium mb-2", children: language === "th" ? "คะแนน SEO โดยรวม" : "Overall SEO Score" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: overallScore >= 80 ? "secondary" : overallScore >= 60 ? "default" : "destructive", className: "text-sm", children: overallScore >= 80 ? language === "th" ? "ดีเยี่ยม" : "Excellent" : overallScore >= 60 ? language === "th" ? "ดี" : "Good" : language === "th" ? "ต้องปรับปรุง" : "Needs Improvement" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "all", className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "all", children: language === "th" ? "ทั้งหมด" : "All" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "pass", children: language === "th" ? "ผ่าน" : "Passed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "warning", children: language === "th" ? "คำเตือน" : "Warning" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "fail", children: language === "th" ? "ไม่ผ่าน" : "Failed" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "all", className: "space-y-4 mt-4", children: auditResults.map((category, categoryIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: category.category }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: category.items.map((item, itemIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-lg bg-gray-50", children: [
                getStatusIcon(item.status),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: item.name }),
                    getStatusBadge(item.status)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", children: item.description })
                ] })
              ] }, itemIndex)) }) })
            ] }, categoryIndex)) }),
            ["pass", "warning", "fail"].map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: status, className: "space-y-4 mt-4", children: auditResults.map((category, categoryIndex) => {
              const filteredItems = category.items.filter((item) => item.status === status);
              if (filteredItems.length === 0) return null;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: category.category }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredItems.map((item, itemIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-lg bg-gray-50", children: [
                  getStatusIcon(item.status),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: item.name }),
                      getStatusBadge(item.status)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", children: item.description })
                  ] })
                ] }, itemIndex)) }) })
              ] }, categoryIndex);
            }) }, status))
          ] })
        ] })
      ] })
    ] });
  };
  const SmartKeywordResearch = () => {
    const [language, setLanguage] = React$1.useState("en");
    const [seedKeyword, setSeedKeyword] = React$1.useState("");
    const [isResearching, setIsResearching] = React$1.useState(false);
    const [keywords, setKeywords] = React$1.useState([]);
    const [longTailKeywords, setLongTailKeywords] = React$1.useState([]);
    const [contentIdeas, setContentIdeas] = React$1.useState([]);
    const [autoSuggestions, setAutoSuggestions] = React$1.useState([]);
    const { toast: toast2 } = useToast();
    React$1.useEffect(() => {
      if (seedKeyword && seedKeyword.length > 2) {
        generateAutoSuggestions();
      } else {
        setAutoSuggestions([]);
      }
    }, [seedKeyword]);
    const generateAutoSuggestions = () => {
      const suggestions = [
        `${seedKeyword} guide`,
        `${seedKeyword} tutorial`,
        `${seedKeyword} tips`,
        `${seedKeyword} 2024`,
        `${seedKeyword} benefits`,
        `${seedKeyword} examples`
      ];
      setAutoSuggestions(suggestions);
    };
    const researchKeywords = async () => {
      if (!seedKeyword.trim()) {
        toast2({
          title: language === "th" ? "กรุณาใส่คำสำคัญ" : "Please enter a keyword",
          description: language === "th" ? "ใส่คำสำคัญหลักเพื่อเริ่มการวิจัย" : "Enter a seed keyword to start research",
          variant: "destructive"
        });
        return;
      }
      setIsResearching(true);
      setTimeout(() => {
        const mockKeywords = [
          { keyword: `${seedKeyword}`, volume: Math.floor(Math.random() * 1e4 + 1e3), difficulty: Math.floor(Math.random() * 60 + 20), trend: "up", cpc: Math.random() * 3 + 0.5 },
          { keyword: `${seedKeyword} ${language === "th" ? "คู่มือ" : "guide"}`, volume: Math.floor(Math.random() * 5e3 + 500), difficulty: Math.floor(Math.random() * 50 + 15), trend: "up", cpc: Math.random() * 2 + 0.3 },
          { keyword: `${seedKeyword} ${language === "th" ? "วิธีทำ" : "how to"}`, volume: Math.floor(Math.random() * 3e3 + 300), difficulty: Math.floor(Math.random() * 40 + 10), trend: "stable", cpc: Math.random() * 1.5 + 0.2 },
          { keyword: `${seedKeyword} ${language === "th" ? "ปี 2024" : "2024"}`, volume: Math.floor(Math.random() * 2500 + 250), difficulty: Math.floor(Math.random() * 45 + 20), trend: "up", cpc: Math.random() * 2.5 + 0.4 },
          { keyword: `${seedKeyword} ${language === "th" ? "เทคนิค" : "tips"}`, volume: Math.floor(Math.random() * 2e3 + 200), difficulty: Math.floor(Math.random() * 35 + 15), trend: "up", cpc: Math.random() * 1.8 + 0.3 },
          { keyword: `${seedKeyword} ${language === "th" ? "ข้อดี" : "benefits"}`, volume: Math.floor(Math.random() * 1800 + 180), difficulty: Math.floor(Math.random() * 30 + 10), trend: "stable", cpc: Math.random() * 1.2 + 0.2 },
          { keyword: `${seedKeyword} ${language === "th" ? "ตัวอย่าง" : "examples"}`, volume: Math.floor(Math.random() * 1500 + 150), difficulty: Math.floor(Math.random() * 25 + 5), trend: "up", cpc: Math.random() * 1 + 0.1 },
          { keyword: `${seedKeyword} ${language === "th" ? "เครื่องมือ" : "tools"}`, volume: Math.floor(Math.random() * 1200 + 120), difficulty: Math.floor(Math.random() * 40 + 20), trend: "stable", cpc: Math.random() * 2 + 0.5 }
        ];
        const mockLongTail = [
          `${language === "th" ? "วิธีเลือก" : "how to choose the best"} ${seedKeyword} ${language === "th" ? "ที่ดีที่สุด" : "for beginners"}`,
          `${seedKeyword} ${language === "th" ? "สำหรับมือใหม่ 2024" : "beginner guide 2024"}`,
          `${language === "th" ? "ข้อดีข้อเสียของ" : "pros and cons of"} ${seedKeyword}`,
          `${seedKeyword} ${language === "th" ? "vs คู่แข่ง เปรียบเทียบ" : "vs competitors comparison"}`,
          `${language === "th" ? "ปัญหาที่พบบ่อยกับ" : "common mistakes with"} ${seedKeyword}`,
          `${language === "th" ? "แนวโน้มของ" : "future trends of"} ${seedKeyword} ${language === "th" ? "ในปี 2024" : "in 2024"}`
        ];
        const mockContentIdeas = [
          `${language === "th" ? "คู่มือสมบูรณ์สำหรับ" : "Complete guide to"} ${seedKeyword}`,
          `${language === "th" ? "10 เทคนิคการใช้" : "10 advanced techniques for"} ${seedKeyword}`,
          `${seedKeyword} ${language === "th" ? "vs คู่แข่ง: การเปรียบเทียบแบบละเอียด" : "vs alternatives: detailed comparison"}`,
          `${language === "th" ? "ข้อผิดพลาดที่ควรหลีกเลี่ยงเมื่อใช้" : "Common pitfalls to avoid with"} ${seedKeyword}`,
          `${language === "th" ? "อนาคตของ" : "Future of"} ${seedKeyword} ${language === "th" ? "ในปี 2024-2025" : "in 2024-2025"}`
        ];
        setKeywords(mockKeywords);
        setLongTailKeywords(mockLongTail);
        setContentIdeas(mockContentIdeas);
        setIsResearching(false);
        toast2({
          title: language === "th" ? "วิจัยคำสำคัญเสร็จสิ้น!" : "Smart Keyword Research Complete!",
          description: language === "th" ? `พบคำสำคัญ ${mockKeywords.length} คำ พร้อมข้อมูลเชิงลึก` : `Found ${mockKeywords.length} keywords with deep insights`
        });
      }, 2500);
    };
    const getDifficultyColor = (difficulty) => {
      if (difficulty < 30) return "bg-green-100 text-green-700";
      if (difficulty < 60) return "bg-yellow-100 text-yellow-700";
      return "bg-red-100 text-red-700";
    };
    const getDifficultyText = (difficulty) => {
      if (difficulty < 30) return language === "th" ? "ง่าย" : "Easy";
      if (difficulty < 60) return language === "th" ? "ปานกลาง" : "Medium";
      return language === "th" ? "ยาก" : "Hard";
    };
    const getTrendIcon = (trend) => {
      switch (trend) {
        case "up":
          return /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-green-500" });
        case "down":
          return /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-red-500 rotate-180" });
        default:
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 bg-gray-400 rounded-full" });
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-5 w-5" }),
            language === "th" ? "วิจัยคำสำคัญอัจฉริยะ" : "Intelligent Keyword Research",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-purple-500" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: language === "th" ? "AI วิเคราะห์และแนะนำคำสำคัญอัตโนมัติ - ลดการกรอกข้อมูลด้วยมือ" : "AI analyzes and suggests keywords automatically - minimal manual input required" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: language === "en" ? "default" : "outline",
              size: "sm",
              onClick: () => setLanguage("en"),
              children: "EN"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: language === "th" ? "default" : "outline",
              size: "sm",
              onClick: () => setLanguage("th"),
              children: "TH"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: seedKeyword,
                onChange: (e) => setSeedKeyword(e.target.value),
                placeholder: language === "th" ? 'ใส่คำสำคัญหลัก เช่น "การตลาดออนไลน์"' : 'Enter seed keyword e.g. "digital marketing"',
                className: "flex-1"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: researchKeywords, disabled: isResearching, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 mr-2" }),
              isResearching ? language === "th" ? "กำลังวิจัย..." : "Researching..." : language === "th" ? "วิจัยอัจฉริยะ" : "Smart Research"
            ] })
          ] }),
          autoSuggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 p-3 rounded-lg border border-blue-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-4 w-4 text-blue-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-blue-700", children: language === "th" ? "คำแนะนำอัตโนมัติ" : "Auto Suggestions" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: autoSuggestions.slice(0, 4).map((suggestion, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-xs cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200",
                onClick: () => setSeedKeyword(suggestion),
                children: suggestion
              },
              index2
            )) })
          ] })
        ] }),
        keywords.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "keywords", className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "keywords", children: language === "th" ? "คำสำคัญหลัก" : "Main Keywords" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "longtail", children: language === "th" ? "คำสำคัญยาว" : "Long-tail Keywords" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "content", children: language === "th" ? "ไอเดียเนื้อหา" : "Content Ideas" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "keywords", className: "space-y-4 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: keywords.map((keyword, index2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-lg", children: keyword.keyword }),
                getTrendIcon(keyword.trend)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: getDifficultyColor(keyword.difficulty), children: getDifficultyText(keyword.difficulty) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: language === "th" ? "ปริมาณการค้นหา:" : "Search Volume:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
                  keyword.volume.toLocaleString(),
                  "/month"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: language === "th" ? "ความยาก:" : "Difficulty:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
                  keyword.difficulty,
                  "/100"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "CPC:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
                  "$",
                  keyword.cpc
                ] })
              ] })
            ] })
          ] }, index2)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "longtail", className: "space-y-4 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: longTailKeywords.map((keyword, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: keyword }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-blue-100 text-blue-700", children: language === "th" ? "แนะนำ" : "Recommended" })
          ] }) }, index2)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "content", className: "space-y-4 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: contentIdeas.map((idea, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-5 w-5 text-yellow-500 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: idea }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mt-1", children: language === "th" ? "เนื้อหาที่แนะนำจาก AI สำหรับเพิ่ม organic traffic" : "AI-recommended content to boost organic traffic" })
            ] })
          ] }) }, index2)) }) })
        ] })
      ] })
    ] });
  };
  const API_KEY_STORAGE_KEY = "geminiApiKey";
  const SettingsTab = () => {
    const [apiKey, setApiKey] = React$1.useState("");
    const [showApiKey, setShowApiKey] = React$1.useState(false);
    const { toast: toast2 } = useToast();
    React$1.useEffect(() => {
      const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    }, []);
    const handleSaveApiKey = () => {
      if (!apiKey.trim()) {
        toast2({
          title: "API Key Empty",
          description: "Please enter an API key before saving.",
          variant: "destructive"
        });
        return;
      }
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
      toast2({
        title: "API Key Saved",
        description: "Your Google Gemini API Key has been saved locally."
      });
    };
    const handleClearApiKey = () => {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setApiKey("");
      toast2({
        title: "API Key Cleared",
        description: "Your Google Gemini API Key has been removed from local storage."
      });
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-5 w-5 text-gray-700" }),
          "API Key Management"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Manage your Google Gemini API Key. This key is required for AI features to function." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "gemini-api-key", children: "Google Gemini API Key" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "gemini-api-key",
                type: showApiKey ? "text" : "password",
                placeholder: "Enter your API key here",
                value: apiKey,
                onChange: (e) => setApiKey(e.target.value),
                className: "flex-grow"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                onClick: () => setShowApiKey(!showApiKey),
                "aria-label": showApiKey ? "Hide API key" : "Show API key",
                children: showApiKey ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSaveApiKey, className: "flex-1", children: "Save API Key" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleClearApiKey, variant: "outline", className: "flex-1", children: "Clear API Key" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md text-sm flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Security Note:" }),
            " Your API key is stored locally in your browser's local storage. While convenient, be cautious if using this on a shared computer. For optimal security, consider environment variables for development or server-side key management for production applications."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-500 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Why is an API Key needed?" }),
            " The Gemini API requires an API key to authenticate requests and grant access to its generative AI models."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Where to get an API Key?" }),
            " You can obtain an API key from Google AI Studio after setting up your project."
          ] })
        ] })
      ] })
    ] });
  };
  function useStateMachine(initialState, machine) {
    return React__namespace.useReducer((state, event) => {
      const nextState = machine[state][event];
      return nextState ?? state;
    }, initialState);
  }
  var SCROLL_AREA_NAME = "ScrollArea";
  var [createScrollAreaContext, createScrollAreaScope] = createContextScope(SCROLL_AREA_NAME);
  var [ScrollAreaProvider, useScrollAreaContext] = createScrollAreaContext(SCROLL_AREA_NAME);
  var ScrollArea$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeScrollArea,
        type = "hover",
        dir,
        scrollHideDelay = 600,
        ...scrollAreaProps
      } = props;
      const [scrollArea, setScrollArea] = React__namespace.useState(null);
      const [viewport, setViewport] = React__namespace.useState(null);
      const [content, setContent] = React__namespace.useState(null);
      const [scrollbarX, setScrollbarX] = React__namespace.useState(null);
      const [scrollbarY, setScrollbarY] = React__namespace.useState(null);
      const [cornerWidth, setCornerWidth] = React__namespace.useState(0);
      const [cornerHeight, setCornerHeight] = React__namespace.useState(0);
      const [scrollbarXEnabled, setScrollbarXEnabled] = React__namespace.useState(false);
      const [scrollbarYEnabled, setScrollbarYEnabled] = React__namespace.useState(false);
      const composedRefs = useComposedRefs(forwardedRef, (node) => setScrollArea(node));
      const direction = useDirection(dir);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        ScrollAreaProvider,
        {
          scope: __scopeScrollArea,
          type,
          dir: direction,
          scrollHideDelay,
          scrollArea,
          viewport,
          onViewportChange: setViewport,
          content,
          onContentChange: setContent,
          scrollbarX,
          onScrollbarXChange: setScrollbarX,
          scrollbarXEnabled,
          onScrollbarXEnabledChange: setScrollbarXEnabled,
          scrollbarY,
          onScrollbarYChange: setScrollbarY,
          scrollbarYEnabled,
          onScrollbarYEnabledChange: setScrollbarYEnabled,
          onCornerWidthChange: setCornerWidth,
          onCornerHeightChange: setCornerHeight,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.div,
            {
              dir: direction,
              ...scrollAreaProps,
              ref: composedRefs,
              style: {
                position: "relative",
                // Pass corner sizes as CSS vars to reduce re-renders of context consumers
                ["--radix-scroll-area-corner-width"]: cornerWidth + "px",
                ["--radix-scroll-area-corner-height"]: cornerHeight + "px",
                ...props.style
              }
            }
          )
        }
      );
    }
  );
  ScrollArea$1.displayName = SCROLL_AREA_NAME;
  var VIEWPORT_NAME = "ScrollAreaViewport";
  var ScrollAreaViewport = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeScrollArea, children, nonce, ...viewportProps } = props;
      const context = useScrollAreaContext(VIEWPORT_NAME, __scopeScrollArea);
      const ref = React__namespace.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "style",
          {
            dangerouslySetInnerHTML: {
              __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`
            },
            nonce
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            "data-radix-scroll-area-viewport": "",
            ...viewportProps,
            ref: composedRefs,
            style: {
              /**
               * We don't support `visible` because the intention is to have at least one scrollbar
               * if this component is used and `visible` will behave like `auto` in that case
               * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
               *
               * We don't handle `auto` because the intention is for the native implementation
               * to be hidden if using this component. We just want to ensure the node is scrollable
               * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
               * the browser from having to work out whether to render native scrollbars or not,
               * we tell it to with the intention of hiding them in CSS.
               */
              overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
              overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
              ...props.style
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: context.onContentChange, style: { minWidth: "100%", display: "table" }, children })
          }
        )
      ] });
    }
  );
  ScrollAreaViewport.displayName = VIEWPORT_NAME;
  var SCROLLBAR_NAME = "ScrollAreaScrollbar";
  var ScrollAreaScrollbar = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { forceMount, ...scrollbarProps } = props;
      const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
      const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
      const isHorizontal = props.orientation === "horizontal";
      React__namespace.useEffect(() => {
        isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
        return () => {
          isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
        };
      }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
      return context.type === "hover" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarHover, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "scroll" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarScroll, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "auto" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarAuto, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "always" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaScrollbarVisible, { ...scrollbarProps, ref: forwardedRef }) : null;
    }
  );
  ScrollAreaScrollbar.displayName = SCROLLBAR_NAME;
  var ScrollAreaScrollbarHover = React__namespace.forwardRef((props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const [visible, setVisible] = React__namespace.useState(false);
    React__namespace.useEffect(() => {
      const scrollArea = context.scrollArea;
      let hideTimer = 0;
      if (scrollArea) {
        const handlePointerEnter = () => {
          window.clearTimeout(hideTimer);
          setVisible(true);
        };
        const handlePointerLeave = () => {
          hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
        };
        scrollArea.addEventListener("pointerenter", handlePointerEnter);
        scrollArea.addEventListener("pointerleave", handlePointerLeave);
        return () => {
          window.clearTimeout(hideTimer);
          scrollArea.removeEventListener("pointerenter", handlePointerEnter);
          scrollArea.removeEventListener("pointerleave", handlePointerLeave);
        };
      }
    }, [context.scrollArea, context.scrollHideDelay]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarAuto,
      {
        "data-state": visible ? "visible" : "hidden",
        ...scrollbarProps,
        ref: forwardedRef
      }
    ) });
  });
  var ScrollAreaScrollbarScroll = React__namespace.forwardRef((props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const isHorizontal = props.orientation === "horizontal";
    const debounceScrollEnd = useDebounceCallback(() => send("SCROLL_END"), 100);
    const [state, send] = useStateMachine("hidden", {
      hidden: {
        SCROLL: "scrolling"
      },
      scrolling: {
        SCROLL_END: "idle",
        POINTER_ENTER: "interacting"
      },
      interacting: {
        SCROLL: "interacting",
        POINTER_LEAVE: "idle"
      },
      idle: {
        HIDE: "hidden",
        SCROLL: "scrolling",
        POINTER_ENTER: "interacting"
      }
    });
    React__namespace.useEffect(() => {
      if (state === "idle") {
        const hideTimer = window.setTimeout(() => send("HIDE"), context.scrollHideDelay);
        return () => window.clearTimeout(hideTimer);
      }
    }, [state, context.scrollHideDelay, send]);
    React__namespace.useEffect(() => {
      const viewport = context.viewport;
      const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
      if (viewport) {
        let prevScrollPos = viewport[scrollDirection];
        const handleScroll2 = () => {
          const scrollPos = viewport[scrollDirection];
          const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
          if (hasScrollInDirectionChanged) {
            send("SCROLL");
            debounceScrollEnd();
          }
          prevScrollPos = scrollPos;
        };
        viewport.addEventListener("scroll", handleScroll2);
        return () => viewport.removeEventListener("scroll", handleScroll2);
      }
    }, [context.viewport, isHorizontal, send, debounceScrollEnd]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || state !== "hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarVisible,
      {
        "data-state": state === "hidden" ? "hidden" : "visible",
        ...scrollbarProps,
        ref: forwardedRef,
        onPointerEnter: composeEventHandlers(props.onPointerEnter, () => send("POINTER_ENTER")),
        onPointerLeave: composeEventHandlers(props.onPointerLeave, () => send("POINTER_LEAVE"))
      }
    ) });
  });
  var ScrollAreaScrollbarAuto = React__namespace.forwardRef((props, forwardedRef) => {
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const { forceMount, ...scrollbarProps } = props;
    const [visible, setVisible] = React__namespace.useState(false);
    const isHorizontal = props.orientation === "horizontal";
    const handleResize = useDebounceCallback(() => {
      if (context.viewport) {
        const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
        const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
        setVisible(isHorizontal ? isOverflowX : isOverflowY);
      }
    }, 10);
    useResizeObserver(context.viewport, handleResize);
    useResizeObserver(context.content, handleResize);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarVisible,
      {
        "data-state": visible ? "visible" : "hidden",
        ...scrollbarProps,
        ref: forwardedRef
      }
    ) });
  });
  var ScrollAreaScrollbarVisible = React__namespace.forwardRef((props, forwardedRef) => {
    const { orientation = "vertical", ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const thumbRef = React__namespace.useRef(null);
    const pointerOffsetRef = React__namespace.useRef(0);
    const [sizes, setSizes] = React__namespace.useState({
      content: 0,
      viewport: 0,
      scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
    });
    const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);
    const commonProps = {
      ...scrollbarProps,
      sizes,
      onSizesChange: setSizes,
      hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
      onThumbChange: (thumb) => thumbRef.current = thumb,
      onThumbPointerUp: () => pointerOffsetRef.current = 0,
      onThumbPointerDown: (pointerPos) => pointerOffsetRef.current = pointerPos
    };
    function getScrollPosition(pointerPos, dir) {
      return getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
    }
    if (orientation === "horizontal") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        ScrollAreaScrollbarX,
        {
          ...commonProps,
          ref: forwardedRef,
          onThumbPositionChange: () => {
            if (context.viewport && thumbRef.current) {
              const scrollPos = context.viewport.scrollLeft;
              const offset2 = getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
              thumbRef.current.style.transform = `translate3d(${offset2}px, 0, 0)`;
            }
          },
          onWheelScroll: (scrollPos) => {
            if (context.viewport) context.viewport.scrollLeft = scrollPos;
          },
          onDragScroll: (pointerPos) => {
            if (context.viewport) {
              context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
            }
          }
        }
      );
    }
    if (orientation === "vertical") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        ScrollAreaScrollbarY,
        {
          ...commonProps,
          ref: forwardedRef,
          onThumbPositionChange: () => {
            if (context.viewport && thumbRef.current) {
              const scrollPos = context.viewport.scrollTop;
              const offset2 = getThumbOffsetFromScroll(scrollPos, sizes);
              thumbRef.current.style.transform = `translate3d(0, ${offset2}px, 0)`;
            }
          },
          onWheelScroll: (scrollPos) => {
            if (context.viewport) context.viewport.scrollTop = scrollPos;
          },
          onDragScroll: (pointerPos) => {
            if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
          }
        }
      );
    }
    return null;
  });
  var ScrollAreaScrollbarX = React__namespace.forwardRef((props, forwardedRef) => {
    const { sizes, onSizesChange, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const [computedStyle, setComputedStyle] = React__namespace.useState();
    const ref = React__namespace.useRef(null);
    const composeRefs2 = useComposedRefs(forwardedRef, ref, context.onScrollbarXChange);
    React__namespace.useEffect(() => {
      if (ref.current) setComputedStyle(getComputedStyle(ref.current));
    }, [ref]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarImpl,
      {
        "data-orientation": "horizontal",
        ...scrollbarProps,
        ref: composeRefs2,
        sizes,
        style: {
          bottom: 0,
          left: context.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
          right: context.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
          ["--radix-scroll-area-thumb-width"]: getThumbSize(sizes) + "px",
          ...props.style
        },
        onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
        onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
        onWheelScroll: (event, maxScrollPos) => {
          if (context.viewport) {
            const scrollPos = context.viewport.scrollLeft + event.deltaX;
            props.onWheelScroll(scrollPos);
            if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
              event.preventDefault();
            }
          }
        },
        onResize: () => {
          if (ref.current && context.viewport && computedStyle) {
            onSizesChange({
              content: context.viewport.scrollWidth,
              viewport: context.viewport.offsetWidth,
              scrollbar: {
                size: ref.current.clientWidth,
                paddingStart: toInt(computedStyle.paddingLeft),
                paddingEnd: toInt(computedStyle.paddingRight)
              }
            });
          }
        }
      }
    );
  });
  var ScrollAreaScrollbarY = React__namespace.forwardRef((props, forwardedRef) => {
    const { sizes, onSizesChange, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const [computedStyle, setComputedStyle] = React__namespace.useState();
    const ref = React__namespace.useRef(null);
    const composeRefs2 = useComposedRefs(forwardedRef, ref, context.onScrollbarYChange);
    React__namespace.useEffect(() => {
      if (ref.current) setComputedStyle(getComputedStyle(ref.current));
    }, [ref]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollAreaScrollbarImpl,
      {
        "data-orientation": "vertical",
        ...scrollbarProps,
        ref: composeRefs2,
        sizes,
        style: {
          top: 0,
          right: context.dir === "ltr" ? 0 : void 0,
          left: context.dir === "rtl" ? 0 : void 0,
          bottom: "var(--radix-scroll-area-corner-height)",
          ["--radix-scroll-area-thumb-height"]: getThumbSize(sizes) + "px",
          ...props.style
        },
        onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
        onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
        onWheelScroll: (event, maxScrollPos) => {
          if (context.viewport) {
            const scrollPos = context.viewport.scrollTop + event.deltaY;
            props.onWheelScroll(scrollPos);
            if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
              event.preventDefault();
            }
          }
        },
        onResize: () => {
          if (ref.current && context.viewport && computedStyle) {
            onSizesChange({
              content: context.viewport.scrollHeight,
              viewport: context.viewport.offsetHeight,
              scrollbar: {
                size: ref.current.clientHeight,
                paddingStart: toInt(computedStyle.paddingTop),
                paddingEnd: toInt(computedStyle.paddingBottom)
              }
            });
          }
        }
      }
    );
  });
  var [ScrollbarProvider, useScrollbarContext] = createScrollAreaContext(SCROLLBAR_NAME);
  var ScrollAreaScrollbarImpl = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      __scopeScrollArea,
      sizes,
      hasThumb,
      onThumbChange,
      onThumbPointerUp,
      onThumbPointerDown,
      onThumbPositionChange,
      onDragScroll,
      onWheelScroll,
      onResize,
      ...scrollbarProps
    } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, __scopeScrollArea);
    const [scrollbar, setScrollbar] = React__namespace.useState(null);
    const composeRefs2 = useComposedRefs(forwardedRef, (node) => setScrollbar(node));
    const rectRef = React__namespace.useRef(null);
    const prevWebkitUserSelectRef = React__namespace.useRef("");
    const viewport = context.viewport;
    const maxScrollPos = sizes.content - sizes.viewport;
    const handleWheelScroll = useCallbackRef$1(onWheelScroll);
    const handleThumbPositionChange = useCallbackRef$1(onThumbPositionChange);
    const handleResize = useDebounceCallback(onResize, 10);
    function handleDragScroll(event) {
      if (rectRef.current) {
        const x = event.clientX - rectRef.current.left;
        const y = event.clientY - rectRef.current.top;
        onDragScroll({ x, y });
      }
    }
    React__namespace.useEffect(() => {
      const handleWheel = (event) => {
        const element = event.target;
        const isScrollbarWheel = scrollbar == null ? void 0 : scrollbar.contains(element);
        if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
      };
      document.addEventListener("wheel", handleWheel, { passive: false });
      return () => document.removeEventListener("wheel", handleWheel, { passive: false });
    }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
    React__namespace.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);
    useResizeObserver(scrollbar, handleResize);
    useResizeObserver(context.content, handleResize);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollbarProvider,
      {
        scope: __scopeScrollArea,
        scrollbar,
        hasThumb,
        onThumbChange: useCallbackRef$1(onThumbChange),
        onThumbPointerUp: useCallbackRef$1(onThumbPointerUp),
        onThumbPositionChange: handleThumbPositionChange,
        onThumbPointerDown: useCallbackRef$1(onThumbPointerDown),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            ...scrollbarProps,
            ref: composeRefs2,
            style: { position: "absolute", ...scrollbarProps.style },
            onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
              const mainPointer = 0;
              if (event.button === mainPointer) {
                const element = event.target;
                element.setPointerCapture(event.pointerId);
                rectRef.current = scrollbar.getBoundingClientRect();
                prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
                document.body.style.webkitUserSelect = "none";
                if (context.viewport) context.viewport.style.scrollBehavior = "auto";
                handleDragScroll(event);
              }
            }),
            onPointerMove: composeEventHandlers(props.onPointerMove, handleDragScroll),
            onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
              const element = event.target;
              if (element.hasPointerCapture(event.pointerId)) {
                element.releasePointerCapture(event.pointerId);
              }
              document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
              if (context.viewport) context.viewport.style.scrollBehavior = "";
              rectRef.current = null;
            })
          }
        )
      }
    );
  });
  var THUMB_NAME = "ScrollAreaThumb";
  var ScrollAreaThumb = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { forceMount, ...thumbProps } = props;
      const scrollbarContext = useScrollbarContext(THUMB_NAME, props.__scopeScrollArea);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || scrollbarContext.hasThumb, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumbImpl, { ref: forwardedRef, ...thumbProps }) });
    }
  );
  var ScrollAreaThumbImpl = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeScrollArea, style, ...thumbProps } = props;
      const scrollAreaContext = useScrollAreaContext(THUMB_NAME, __scopeScrollArea);
      const scrollbarContext = useScrollbarContext(THUMB_NAME, __scopeScrollArea);
      const { onThumbPositionChange } = scrollbarContext;
      const composedRef = useComposedRefs(
        forwardedRef,
        (node) => scrollbarContext.onThumbChange(node)
      );
      const removeUnlinkedScrollListenerRef = React__namespace.useRef(void 0);
      const debounceScrollEnd = useDebounceCallback(() => {
        if (removeUnlinkedScrollListenerRef.current) {
          removeUnlinkedScrollListenerRef.current();
          removeUnlinkedScrollListenerRef.current = void 0;
        }
      }, 100);
      React__namespace.useEffect(() => {
        const viewport = scrollAreaContext.viewport;
        if (viewport) {
          const handleScroll2 = () => {
            debounceScrollEnd();
            if (!removeUnlinkedScrollListenerRef.current) {
              const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
              removeUnlinkedScrollListenerRef.current = listener;
              onThumbPositionChange();
            }
          };
          onThumbPositionChange();
          viewport.addEventListener("scroll", handleScroll2);
          return () => viewport.removeEventListener("scroll", handleScroll2);
        }
      }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
          ...thumbProps,
          ref: composedRef,
          style: {
            width: "var(--radix-scroll-area-thumb-width)",
            height: "var(--radix-scroll-area-thumb-height)",
            ...style
          },
          onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, (event) => {
            const thumb = event.target;
            const thumbRect = thumb.getBoundingClientRect();
            const x = event.clientX - thumbRect.left;
            const y = event.clientY - thumbRect.top;
            scrollbarContext.onThumbPointerDown({ x, y });
          }),
          onPointerUp: composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)
        }
      );
    }
  );
  ScrollAreaThumb.displayName = THUMB_NAME;
  var CORNER_NAME = "ScrollAreaCorner";
  var ScrollAreaCorner = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const context = useScrollAreaContext(CORNER_NAME, props.__scopeScrollArea);
      const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
      const hasCorner = context.type !== "scroll" && hasBothScrollbarsVisible;
      return hasCorner ? /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaCornerImpl, { ...props, ref: forwardedRef }) : null;
    }
  );
  ScrollAreaCorner.displayName = CORNER_NAME;
  var ScrollAreaCornerImpl = React__namespace.forwardRef((props, forwardedRef) => {
    const { __scopeScrollArea, ...cornerProps } = props;
    const context = useScrollAreaContext(CORNER_NAME, __scopeScrollArea);
    const [width, setWidth] = React__namespace.useState(0);
    const [height, setHeight] = React__namespace.useState(0);
    const hasSize = Boolean(width && height);
    useResizeObserver(context.scrollbarX, () => {
      var _a2;
      const height2 = ((_a2 = context.scrollbarX) == null ? void 0 : _a2.offsetHeight) || 0;
      context.onCornerHeightChange(height2);
      setHeight(height2);
    });
    useResizeObserver(context.scrollbarY, () => {
      var _a2;
      const width2 = ((_a2 = context.scrollbarY) == null ? void 0 : _a2.offsetWidth) || 0;
      context.onCornerWidthChange(width2);
      setWidth(width2);
    });
    return hasSize ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        ...cornerProps,
        ref: forwardedRef,
        style: {
          width,
          height,
          position: "absolute",
          right: context.dir === "ltr" ? 0 : void 0,
          left: context.dir === "rtl" ? 0 : void 0,
          bottom: 0,
          ...props.style
        }
      }
    ) : null;
  });
  function toInt(value) {
    return value ? parseInt(value, 10) : 0;
  }
  function getThumbRatio(viewportSize, contentSize) {
    const ratio = viewportSize / contentSize;
    return isNaN(ratio) ? 0 : ratio;
  }
  function getThumbSize(sizes) {
    const ratio = getThumbRatio(sizes.viewport, sizes.content);
    const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
    const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
    return Math.max(thumbSize, 18);
  }
  function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = "ltr") {
    const thumbSizePx = getThumbSize(sizes);
    const thumbCenter = thumbSizePx / 2;
    const offset2 = pointerOffset || thumbCenter;
    const thumbOffsetFromEnd = thumbSizePx - offset2;
    const minPointerPos = sizes.scrollbar.paddingStart + offset2;
    const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
    const maxScrollPos = sizes.content - sizes.viewport;
    const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
    const interpolate = linearScale([minPointerPos, maxPointerPos], scrollRange);
    return interpolate(pointerPos);
  }
  function getThumbOffsetFromScroll(scrollPos, sizes, dir = "ltr") {
    const thumbSizePx = getThumbSize(sizes);
    const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
    const scrollbar = sizes.scrollbar.size - scrollbarPadding;
    const maxScrollPos = sizes.content - sizes.viewport;
    const maxThumbPos = scrollbar - thumbSizePx;
    const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
    const scrollWithoutMomentum = clamp(scrollPos, scrollClampRange);
    const interpolate = linearScale([0, maxScrollPos], [0, maxThumbPos]);
    return interpolate(scrollWithoutMomentum);
  }
  function linearScale(input, output) {
    return (value) => {
      if (input[0] === input[1] || output[0] === output[1]) return output[0];
      const ratio = (output[1] - output[0]) / (input[1] - input[0]);
      return output[0] + ratio * (value - input[0]);
    };
  }
  function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
    return scrollPos > 0 && scrollPos < maxScrollPos;
  }
  var addUnlinkedScrollListener = (node, handler = () => {
  }) => {
    let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
    let rAF = 0;
    (function loop() {
      const position = { left: node.scrollLeft, top: node.scrollTop };
      const isHorizontalScroll = prevPosition.left !== position.left;
      const isVerticalScroll = prevPosition.top !== position.top;
      if (isHorizontalScroll || isVerticalScroll) handler();
      prevPosition = position;
      rAF = window.requestAnimationFrame(loop);
    })();
    return () => window.cancelAnimationFrame(rAF);
  };
  function useDebounceCallback(callback, delay) {
    const handleCallback = useCallbackRef$1(callback);
    const debounceTimerRef = React__namespace.useRef(0);
    React__namespace.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
    return React__namespace.useCallback(() => {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = window.setTimeout(handleCallback, delay);
    }, [handleCallback, delay]);
  }
  function useResizeObserver(element, onResize) {
    const handleResize = useCallbackRef$1(onResize);
    useLayoutEffect2(() => {
      let rAF = 0;
      if (element) {
        const resizeObserver = new ResizeObserver(() => {
          cancelAnimationFrame(rAF);
          rAF = window.requestAnimationFrame(handleResize);
        });
        resizeObserver.observe(element);
        return () => {
          window.cancelAnimationFrame(rAF);
          resizeObserver.unobserve(element);
        };
      }
    }, [element, handleResize]);
  }
  var Root$1 = ScrollArea$1;
  var Viewport = ScrollAreaViewport;
  var Corner = ScrollAreaCorner;
  const ScrollArea = React__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Root$1,
    {
      ref,
      className: cn("relative overflow-hidden", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Viewport, { className: "h-full w-full rounded-[inherit]", children }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
      ]
    }
  ));
  ScrollArea.displayName = Root$1.displayName;
  const ScrollBar = React__namespace.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollAreaScrollbar,
    {
      ref,
      orientation,
      className: cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
    }
  ));
  ScrollBar.displayName = ScrollAreaScrollbar.displayName;
  var shim$1 = { exports: {} };
  var useSyncExternalStoreShim_production = {};
  /**
   * @license React
   * use-sync-external-store-shim.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var React2 = React$1;
  function is(x, y) {
    return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is, useState = React2.useState, useEffect = React2.useEffect, useLayoutEffect = React2.useLayoutEffect, useDebugValue = React2.useDebugValue;
  function useSyncExternalStore$2(subscribe2, getSnapshot) {
    var value = getSnapshot(), _useState = useState({ inst: { value, getSnapshot } }), inst = _useState[0].inst, forceUpdate = _useState[1];
    useLayoutEffect(
      function() {
        inst.value = value;
        inst.getSnapshot = getSnapshot;
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      },
      [subscribe2, value, getSnapshot]
    );
    useEffect(
      function() {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        return subscribe2(function() {
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        });
      },
      [subscribe2]
    );
    useDebugValue(value);
    return value;
  }
  function checkIfSnapshotChanged(inst) {
    var latestGetSnapshot = inst.getSnapshot;
    inst = inst.value;
    try {
      var nextValue = latestGetSnapshot();
      return !objectIs(inst, nextValue);
    } catch (error) {
      return true;
    }
  }
  function useSyncExternalStore$1(subscribe2, getSnapshot) {
    return getSnapshot();
  }
  var shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
  useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React2.useSyncExternalStore ? React2.useSyncExternalStore : shim;
  {
    shim$1.exports = useSyncExternalStoreShim_production;
  }
  var shimExports = shim$1.exports;
  function useIsHydrated() {
    return shimExports.useSyncExternalStore(
      subscribe,
      () => true,
      () => false
    );
  }
  function subscribe() {
    return () => {
    };
  }
  var AVATAR_NAME = "Avatar";
  var [createAvatarContext, createAvatarScope] = createContextScope(AVATAR_NAME);
  var [AvatarProvider, useAvatarContext] = createAvatarContext(AVATAR_NAME);
  var Avatar$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeAvatar, ...avatarProps } = props;
      const [imageLoadingStatus, setImageLoadingStatus] = React__namespace.useState("idle");
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        AvatarProvider,
        {
          scope: __scopeAvatar,
          imageLoadingStatus,
          onImageLoadingStatusChange: setImageLoadingStatus,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { ...avatarProps, ref: forwardedRef })
        }
      );
    }
  );
  Avatar$1.displayName = AVATAR_NAME;
  var IMAGE_NAME = "AvatarImage";
  var AvatarImage$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeAvatar, src, onLoadingStatusChange = () => {
      }, ...imageProps } = props;
      const context = useAvatarContext(IMAGE_NAME, __scopeAvatar);
      const imageLoadingStatus = useImageLoadingStatus(src, imageProps);
      const handleLoadingStatusChange = useCallbackRef$1((status) => {
        onLoadingStatusChange(status);
        context.onImageLoadingStatusChange(status);
      });
      useLayoutEffect2(() => {
        if (imageLoadingStatus !== "idle") {
          handleLoadingStatusChange(imageLoadingStatus);
        }
      }, [imageLoadingStatus, handleLoadingStatusChange]);
      return imageLoadingStatus === "loaded" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.img, { ...imageProps, ref: forwardedRef, src }) : null;
    }
  );
  AvatarImage$1.displayName = IMAGE_NAME;
  var FALLBACK_NAME = "AvatarFallback";
  var AvatarFallback$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeAvatar, delayMs, ...fallbackProps } = props;
      const context = useAvatarContext(FALLBACK_NAME, __scopeAvatar);
      const [canRender, setCanRender] = React__namespace.useState(delayMs === void 0);
      React__namespace.useEffect(() => {
        if (delayMs !== void 0) {
          const timerId = window.setTimeout(() => setCanRender(true), delayMs);
          return () => window.clearTimeout(timerId);
        }
      }, [delayMs]);
      return canRender && context.imageLoadingStatus !== "loaded" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { ...fallbackProps, ref: forwardedRef }) : null;
    }
  );
  AvatarFallback$1.displayName = FALLBACK_NAME;
  function resolveLoadingStatus(image, src) {
    if (!image) {
      return "idle";
    }
    if (!src) {
      return "error";
    }
    if (image.src !== src) {
      image.src = src;
    }
    return image.complete && image.naturalWidth > 0 ? "loaded" : "loading";
  }
  function useImageLoadingStatus(src, { referrerPolicy, crossOrigin }) {
    const isHydrated = useIsHydrated();
    const imageRef = React__namespace.useRef(null);
    const image = (() => {
      if (!isHydrated) return null;
      if (!imageRef.current) {
        imageRef.current = new window.Image();
      }
      return imageRef.current;
    })();
    const [loadingStatus, setLoadingStatus] = React__namespace.useState(
      () => resolveLoadingStatus(image, src)
    );
    useLayoutEffect2(() => {
      setLoadingStatus(resolveLoadingStatus(image, src));
    }, [image, src]);
    useLayoutEffect2(() => {
      const updateStatus = (status) => () => {
        setLoadingStatus(status);
      };
      if (!image) return;
      const handleLoad = updateStatus("loaded");
      const handleError = updateStatus("error");
      image.addEventListener("load", handleLoad);
      image.addEventListener("error", handleError);
      if (referrerPolicy) {
        image.referrerPolicy = referrerPolicy;
      }
      if (typeof crossOrigin === "string") {
        image.crossOrigin = crossOrigin;
      }
      return () => {
        image.removeEventListener("load", handleLoad);
        image.removeEventListener("error", handleError);
      };
    }, [image, crossOrigin, referrerPolicy]);
    return loadingStatus;
  }
  var Root = Avatar$1;
  var Image = AvatarImage$1;
  var Fallback = AvatarFallback$1;
  const Avatar = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      ref,
      className: cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      ),
      ...props
    }
  ));
  Avatar.displayName = Root.displayName;
  const AvatarImage = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Image,
    {
      ref,
      className: cn("aspect-square h-full w-full", className),
      ...props
    }
  ));
  AvatarImage.displayName = Image.displayName;
  const AvatarFallback = React__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Fallback,
    {
      ref,
      className: cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      ),
      ...props
    }
  ));
  AvatarFallback.displayName = Fallback.displayName;
  const SEOChatbot = () => {
    const { language } = useLanguage();
    const [messages, setMessages] = React$1.useState([]);
    const [userInput, setUserInput] = React$1.useState("");
    const [isLoading, setIsLoading] = React$1.useState(false);
    const [apiKeyError, setApiKeyError] = React$1.useState(null);
    const scrollAreaRef = React$1.useRef(null);
    const { toast: toast2 } = useToast();
    const formatChatHistory = (msgs) => {
      const recentMessages = msgs.slice(-10);
      return recentMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));
    };
    const handleSendMessage = async () => {
      if (userInput.trim() === "") return;
      const newUserMessage = {
        id: Date.now().toString() + "-user",
        sender: "user",
        text: userInput,
        timestamp: /* @__PURE__ */ new Date()
      };
      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);
      const currentInput = userInput;
      setUserInput("");
      setIsLoading(true);
      setApiKeyError(null);
      const historyForApi = formatChatHistory(messages);
      let promptForApi = currentInput;
      if (messages.length === 0) {
        promptForApi = `${systemInstruction}

My first question is: ${currentInput}`;
      }
      try {
        const botResponseText = await getChatbotResponse(promptForApi, historyForApi);
        const newBotMessage = {
          id: Date.now().toString() + "-bot",
          sender: "bot",
          text: botResponseText,
          timestamp: /* @__PURE__ */ new Date()
        };
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      } catch (error) {
        console.error("Error getting chatbot response:", error);
        let errorText = "Sorry, I encountered an error. Please try again.";
        if (error.isApiKeyInvalid) {
          errorText = "API Key is invalid or missing. Please configure it in Settings.";
          setApiKeyError(errorText);
        } else if (error.message) {
          errorText = error.message;
        }
        const errorBotMessage = {
          id: Date.now().toString() + "-bot-error",
          sender: "bot",
          text: errorText,
          timestamp: /* @__PURE__ */ new Date()
        };
        setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
        toast2({
          title: "Chatbot Error",
          description: errorText,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    const handleKeyPress = (event) => {
      if (event.key === "Enter" && !isLoading) {
        handleSendMessage();
      }
    };
    React$1.useEffect(() => {
      if (scrollAreaRef.current) {
        const scrollViewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
        if (scrollViewport) {
          scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
      }
    }, [messages]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-2xl mx-auto shadow-xl flex flex-col h-[70vh] min-h-[400px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-6 w-6 text-blue-600" }),
        "SEO Assistant Chatbot"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex-grow p-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-full p-4", ref: scrollAreaRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        messages.map((message) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-end gap-2 ${message.sender === "user" ? "justify-end" : ""}`,
            children: [
              message.sender === "bot" && /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-4 w-4" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `max-w-[70%] p-3 rounded-lg shadow ${message.sender === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-slate-100 text-slate-800 rounded-bl-none"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: message.text }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-70 mt-1 text-right", children: message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
                  ]
                }
              ),
              message.sender === "user" && /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }) }) })
            ]
          },
          message.id
        )),
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[70%] p-3 rounded-lg shadow bg-slate-100 text-slate-800 rounded-bl-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse", children: "Typing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse delay-150", children: "." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse delay-300", children: "." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse delay-450", children: "." })
          ] }) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { className: "p-4 border-t", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "text",
              placeholder: "Ask about SEO...",
              value: userInput,
              onChange: (e) => setUserInput(e.target.value),
              onKeyPress: handleKeyPress,
              disabled: isLoading,
              className: "flex-grow"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSendMessage, disabled: isLoading || userInput.trim() === "", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SendHorizontal, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Send" })
          ] })
        ] }),
        apiKeyError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 p-2 text-xs bg-red-100 border border-red-300 text-red-700 rounded-md flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 flex-shrink-0" }),
          apiKeyError
        ] })
      ] })
    ] });
  };
  const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();
    const languages = [
      { code: "en", name: "EN" },
      { code: "th", name: "TH" }
    ];
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-md shadow border", children: languages.map((lang) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: language === lang.code ? "default" : "outline",
        size: "sm",
        onClick: () => setLanguage(lang.code),
        className: `flex items-center gap-1 transition-all duration-150 ease-in-out
                      ${language === lang.code ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ring-2 ring-purple-300" : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"}`,
        children: [
          language === lang.code && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
          lang.name
        ]
      },
      lang.code
    )) });
  };
  const SEODashboard = () => {
    const [activeTab, setActiveTab] = React$1.useState("analyzer");
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8 relative", children: [
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Flux SEO Pro Optimizer" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 right-0 mt-0 mr-0 md:mt-1 md:mr-1", children: [
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSwitcher, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: "Professional SEO optimization suite with AI-powered automation and comprehensive analysis tools" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-center gap-2 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-blue-100 text-blue-700", children: "Content Analysis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-green-100 text-green-700", children: "AI Content Generator" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-purple-100 text-purple-700", children: "Advanced Analytics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-orange-100 text-orange-700", children: "Technical SEO" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-indigo-100 text-indigo-700", children: "Schema Markup" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-pink-100 text-pink-700", children: "Keyword Research" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-teal-100 text-teal-700", children: "Thai/English Support" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full h-auto bg-transparent p-1 gap-1", style: { gridTemplateColumns: "repeat(9, 1fr)" }, children: [
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "analyzer",
              className: "flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline", children: "Analyzer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "md:hidden", children: "Analyze" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "generator",
              className: "flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline", children: "Generator" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "md:hidden", children: "Gen" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "analytics",
              className: "flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline", children: "Analytics" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "md:hidden", children: "Stats" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "keywords",
              className: "flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline", children: "Keywords" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "md:hidden", children: "Keys" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "meta",
              className: "flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline", children: "Meta Tags" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "md:hidden", children: "Meta" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "schema",
              className: "flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline", children: "Schema" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "md:hidden", children: "Schema" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "technical",
              className: "flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline", children: "Technical" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "md:hidden", children: "Tech" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "chatbot",
              className: "flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline", children: "Chatbot" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "md:hidden", children: "Chat" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "settings",
              className: "flex items-center justify-center gap-2 text-sm px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden md:inline", children: "Settings" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "md:hidden", children: "Config" })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "analyzer", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ContentAnalyzer, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "generator", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IntegratedContentGenerator, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "analytics", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdvancedSEOAnalytics, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "keywords", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SmartKeywordResearch, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "meta", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MetaTagsManager, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "schema", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SchemaMarkupGenerator, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "technical", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TechnicalSEOAudit, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "settings", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsTab, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "chatbot", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SEOChatbot, {}) })
        ] })
      ] })
    ] }) });
  };
  console.log("🔧 FluxSEO: Checking for service workers to disable...");
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      if (registrations.length > 0) {
        console.log("🚫 FluxSEO: Found", registrations.length, "service worker(s), unregistering...");
        for (let registration of registrations) {
          console.log("🚫 Unregistering service worker:", registration.scope);
          registration.unregister();
        }
      } else {
        console.log("✅ FluxSEO: No service workers found to unregister");
      }
    });
  } else {
    console.log("ℹ️ FluxSEO: Service workers not supported in this browser");
  }
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        retryDelay: 1e3,
        staleTime: 5 * 60 * 1e3,
        // 5 minutes
        gcTime: 10 * 60 * 1e3,
        // 10 minutes (replaces deprecated cacheTime)
        refetchOnWindowFocus: false
      }
    }
  });
  const WordPressApp = () => /* @__PURE__ */ jsxRuntimeExports.jsxs(LanguageProvider, { children: [
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipProvider, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster$1, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SEODashboard, {}) })
    ] }) })
  ] });
  window.FluxSEOApp = {
    component: WordPressApp,
    render: (containerId = "root") => {
      window.FluxSEOApp.init(containerId);
    },
    init: (containerId = "root") => {
      console.log("🚀 FluxSEOApp.init called with containerId:", containerId);
      console.log("🔍 Current window.FluxSEOApp:", window.FluxSEOApp);
      const container = document.getElementById(containerId);
      if (!container) {
        console.error("❌ FluxSEOApp: Container element not found:", containerId);
        console.log("📋 Available elements with IDs:", Array.from(document.querySelectorAll("[id]")).map((el) => el.id));
        return;
      }
      console.log("✅ FluxSEOApp: Container found:", container);
      if (container.dataset.fluxSeoMounted === "true") {
        console.warn("⚠️ FluxSEOApp: Already mounted on this container");
        return;
      }
      try {
        console.log("🎯 FluxSEOApp: Creating React root and rendering...");
        const root = createRoot(container);
        root.render(React$1.createElement(WordPressApp));
        container.dataset.fluxSeoMounted = "true";
        console.log("🎉 FluxSEOApp: Successfully mounted");
        window.dispatchEvent(new CustomEvent("fluxSeoAppReady", {
          detail: { containerId, timestamp: Date.now() }
        }));
      } catch (error) {
        console.error("💥 FluxSEOApp: Error mounting app:", error);
        console.error("📊 Error stack:", error instanceof Error ? error.stack : "No stack trace");
        container.innerHTML = `
        <div style="padding: 20px; border: 2px solid #dc3545; border-radius: 8px; background: #f8d7da; color: #721c24;">
          <h3>⚠️ Application Error</h3>
          <p>Failed to load the SEO application.</p>
          <p><strong>Error:</strong> ${error instanceof Error ? error.message : "Unknown error"}</p>
          <details style="margin-top: 10px;">
            <summary>Technical Details</summary>
            <pre style="background: #fff; padding: 10px; border-radius: 4px; overflow: auto; font-size: 12px;">${error instanceof Error ? error.stack : "No stack trace available"}</pre>
          </details>
          <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
      }
    }
  };
  console.log("📦 FluxSEOApp script loaded, window.FluxSEOApp available:", !!window.FluxSEOApp);
  document.addEventListener("DOMContentLoaded", () => {
    console.log("FluxSEOApp: DOM ready, checking for root element...");
    const rootElement = document.getElementById("root");
    if (rootElement) {
      window.FluxSEOApp.init();
    }
  });
  window.addEventListener("fluxSeoInit", (event) => {
    var _a2;
    console.log("FluxSEOApp: Custom init event received:", event.detail);
    const containerId = ((_a2 = event.detail) == null ? void 0 : _a2.containerId) || "root";
    window.FluxSEOApp.init(containerId);
  });
})(React, ReactDOM);
