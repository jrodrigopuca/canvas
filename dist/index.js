import v, { useMemo as Z, useContext as me, createContext as ye, useReducer as xe, useCallback as c, useState as ve, useRef as re, useEffect as lt, forwardRef as ie, useImperativeHandle as dt } from "react";
import { jsx as te, jsxs as ut } from "react/jsx-runtime";
const Ee = () => typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`, pe = (...e) => {
  const t = [];
  for (const n of e)
    if (n) {
      if (typeof n == "string" || typeof n == "number")
        t.push(String(n));
      else if (Array.isArray(n)) {
        const s = pe(...n);
        s && t.push(s);
      } else if (typeof n == "object")
        for (const [s, o] of Object.entries(n))
          o && t.push(s);
    }
  return t.join(" ");
};
function De(e, t) {
  const n = { ...e };
  for (const s in t)
    if (Object.prototype.hasOwnProperty.call(t, s)) {
      const o = t[s], r = e[s];
      o !== null && typeof o == "object" && !Array.isArray(o) && r !== null && typeof r == "object" && !Array.isArray(r) ? n[s] = De(
        r,
        o
      ) : o !== void 0 && (n[s] = o);
    }
  return n;
}
const sn = (e, t) => {
  const n = t.x - e.x, s = t.y - e.y;
  return Math.sqrt(n * n + s * s);
}, rn = (e, t) => e.x >= t.x && e.x <= t.x + t.width && e.y >= t.y && e.y <= t.y + t.height, an = (e, t) => !(e.x + e.width < t.x || t.x + t.width < e.x || e.y + e.height < t.y || t.y + t.height < e.y), cn = (e, t) => Math.round(e / t) * t, ht = (e, t) => {
  const { x: n, y: s, width: o, height: r } = e, a = t / 2;
  return [
    { position: "nw", x: n - a, y: s - a },
    { position: "n", x: n + o / 2 - a, y: s - a },
    { position: "ne", x: n + o - a, y: s - a },
    {
      position: "e",
      x: n + o - a,
      y: s + r / 2 - a
    },
    { position: "se", x: n + o - a, y: s + r - a },
    {
      position: "s",
      x: n + o / 2 - a,
      y: s + r - a
    },
    { position: "sw", x: n - a, y: s + r - a },
    { position: "w", x: n - a, y: s + r / 2 - a }
  ];
}, Te = (e) => [...e].sort((t, n) => t.zIndex - n.zIndex), mt = (e) => e.length === 0 ? 0 : Math.max(...e.map((t) => t.zIndex)), yt = (e) => e.length === 0 ? 0 : Math.min(...e.map((t) => t.zIndex)), pt = (e, t) => {
  const n = mt(e);
  return e.map(
    (s) => s.id === t ? { ...s, zIndex: n + 1 } : s
  );
}, gt = (e, t) => {
  const n = yt(e);
  return e.map(
    (s) => s.id === t ? { ...s, zIndex: n - 1 } : s
  );
}, ft = (e, t) => {
  const n = Te(e), s = n.findIndex((a) => a.id === t);
  if (s === -1 || s === n.length - 1) return e;
  const o = n[s], r = n[s + 1];
  return e.map((a) => a.id === o.id ? { ...a, zIndex: r.zIndex + 1 } : a);
}, Et = (e, t) => {
  const n = Te(e), s = n.findIndex((a) => a.id === t);
  if (s <= 0) return e;
  const o = n[s], r = n[s - 1];
  return e.map((a) => a.id === o.id ? { ...a, zIndex: r.zIndex - 1 } : a);
}, xt = (e) => {
  const t = [];
  if (!e || typeof e != "object")
    return { valid: !1, errors: ["Data must be an object"] };
  const n = e;
  return typeof n.version != "string" && t.push("Missing or invalid version field"), Array.isArray(n.elements) ? n.elements.forEach((s, o) => {
    const r = vt(s, o);
    t.push(...r);
  }) : t.push("Elements must be an array"), Array.isArray(n.connections) ? n.connections.forEach((s, o) => {
    const r = wt(s, o);
    t.push(...r);
  }) : t.push("Connections must be an array"), {
    valid: t.length === 0,
    errors: t
  };
}, vt = (e, t) => {
  const n = [], s = `Element[${t}]`;
  if (!e || typeof e != "object")
    return [`${s}: Must be an object`];
  const o = e;
  return (typeof o.id != "string" || o.id.length === 0) && n.push(`${s}: Missing or invalid id`), (typeof o.type != "string" || o.type.length === 0) && n.push(`${s}: Missing or invalid type`), (typeof o.x != "number" || isNaN(o.x)) && n.push(`${s}: Missing or invalid x coordinate`), (typeof o.y != "number" || isNaN(o.y)) && n.push(`${s}: Missing or invalid y coordinate`), (typeof o.width != "number" || isNaN(o.width) || o.width < 0) && n.push(`${s}: Missing or invalid width`), (typeof o.height != "number" || isNaN(o.height) || o.height < 0) && n.push(`${s}: Missing or invalid height`), (typeof o.zIndex != "number" || isNaN(o.zIndex)) && n.push(`${s}: Missing or invalid zIndex`), n;
}, wt = (e, t) => {
  const n = [], s = `Connection[${t}]`;
  if (!e || typeof e != "object")
    return [`${s}: Must be an object`];
  const o = e;
  return (typeof o.id != "string" || o.id.length === 0) && n.push(`${s}: Missing or invalid id`), (typeof o.fromId != "string" || o.fromId.length === 0) && n.push(`${s}: Missing or invalid fromId`), (typeof o.toId != "string" || o.toId.length === 0) && n.push(`${s}: Missing or invalid toId`), n;
}, St = "1.0.0", ln = (e, t, n) => JSON.stringify({
  version: St,
  elements: e,
  connections: t,
  metadata: n
}, null, 2), dn = (e) => {
  const t = JSON.parse(e), n = xt(t);
  if (!n.valid)
    throw new Error(`Invalid canvas data: ${n.errors.join(", ")}`);
  return t;
}, un = (e, t) => {
  const n = e.cloneNode(!0);
  if (n.getAttribute("xmlns") || n.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t?.includeStyles) {
    const o = document.createElement("style");
    o.textContent = kt(e), n.insertBefore(o, n.firstChild);
  }
  return new XMLSerializer().serializeToString(n);
}, kt = (e) => {
  const t = /* @__PURE__ */ new Set();
  return e.querySelectorAll("*").forEach((n) => t.add(n.tagName.toLowerCase())), `
    svg { font-family: system-ui, sans-serif; }
    text { user-select: none; }
  `;
}, hn = (e, t, n) => {
  const s = new Blob([e], { type: n }), o = URL.createObjectURL(s), r = document.createElement("a");
  r.href = o, r.download = t, document.body.appendChild(r), r.click(), document.body.removeChild(r), URL.revokeObjectURL(o);
}, ce = {
  name: "light",
  colors: {
    background: "#ffffff",
    surface: "#f8f9fa",
    border: "#dee2e6",
    text: {
      primary: "#212529",
      secondary: "#6c757d",
      disabled: "#adb5bd"
    },
    selection: {
      fill: "rgba(59, 130, 246, 0.1)",
      stroke: "#3b82f6"
    },
    element: {
      fill: "#ffffff",
      stroke: "#212529",
      hover: "#f1f5f9",
      active: "#e2e8f0"
    },
    handle: {
      fill: "#ffffff",
      stroke: "#3b82f6"
    },
    grid: {
      line: "#e5e7eb",
      dot: "#d1d5db"
    },
    connection: {
      line: "#64748b",
      arrow: "#64748b"
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  borderRadius: {
    sm: 2,
    md: 4,
    lg: 8
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20
  },
  strokeWidth: {
    thin: 1,
    normal: 2,
    thick: 3
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.1)",
    element: "0 2px 4px rgba(0,0,0,0.1)",
    handle: "0 1px 2px rgba(0,0,0,0.1)"
  }
}, Rt = {
  name: "dark",
  colors: {
    background: "#1e1e1e",
    surface: "#252526",
    border: "#3c3c3c",
    text: {
      primary: "#ffffff",
      secondary: "#a0a0a0",
      disabled: "#5a5a5a"
    },
    selection: {
      fill: "rgba(59, 130, 246, 0.2)",
      stroke: "#60a5fa"
    },
    element: {
      fill: "#2d2d2d",
      stroke: "#ffffff",
      hover: "#383838",
      active: "#454545"
    },
    handle: {
      fill: "#2d2d2d",
      stroke: "#60a5fa"
    },
    grid: {
      line: "#333333",
      dot: "#444444"
    },
    connection: {
      line: "#94a3b8",
      arrow: "#94a3b8"
    }
  },
  spacing: ce.spacing,
  borderRadius: ce.borderRadius,
  fontSize: ce.fontSize,
  strokeWidth: ce.strokeWidth,
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.3)",
    md: "0 4px 6px rgba(0,0,0,0.4)",
    lg: "0 10px 15px rgba(0,0,0,0.5)",
    element: "0 2px 4px rgba(0,0,0,0.3)",
    handle: "0 1px 2px rgba(0,0,0,0.3)"
  }
}, Ce = ye({
  theme: ce,
  themeName: "light"
}), F = () => {
  const e = me(Ce);
  if (!e)
    throw new Error("useTheme must be used within a ThemeProvider");
  return e;
}, It = ({ children: e, theme: t = "light" }) => {
  const n = Z(() => t === "light" ? { theme: ce, themeName: "light" } : t === "dark" ? { theme: Rt, themeName: "dark" } : {
    theme: De(ce, t),
    themeName: "custom"
  }, [t]);
  return v.createElement(Ce.Provider, { value: n }, e);
}, mn = (e) => ({
  "--canvas-bg": e.colors.background,
  "--canvas-surface": e.colors.surface,
  "--canvas-border": e.colors.border,
  "--canvas-text-primary": e.colors.text.primary,
  "--canvas-text-secondary": e.colors.text.secondary,
  "--canvas-text-disabled": e.colors.text.disabled,
  "--canvas-selection-fill": e.colors.selection.fill,
  "--canvas-selection-stroke": e.colors.selection.stroke,
  "--canvas-element-fill": e.colors.element.fill,
  "--canvas-element-stroke": e.colors.element.stroke,
  "--canvas-element-hover": e.colors.element.hover,
  "--canvas-element-active": e.colors.element.active,
  "--canvas-handle-fill": e.colors.handle.fill,
  "--canvas-handle-stroke": e.colors.handle.stroke,
  "--canvas-grid-line": e.colors.grid.line,
  "--canvas-grid-dot": e.colors.grid.dot,
  "--canvas-connection-line": e.colors.connection.line,
  "--canvas-connection-arrow": e.colors.connection.arrow,
  "--canvas-spacing-xs": `${e.spacing.xs}px`,
  "--canvas-spacing-sm": `${e.spacing.sm}px`,
  "--canvas-spacing-md": `${e.spacing.md}px`,
  "--canvas-spacing-lg": `${e.spacing.lg}px`,
  "--canvas-spacing-xl": `${e.spacing.xl}px`,
  "--canvas-radius-sm": `${e.borderRadius.sm}px`,
  "--canvas-radius-md": `${e.borderRadius.md}px`,
  "--canvas-radius-lg": `${e.borderRadius.lg}px`,
  "--canvas-font-xs": `${e.fontSize.xs}px`,
  "--canvas-font-sm": `${e.fontSize.sm}px`,
  "--canvas-font-md": `${e.fontSize.md}px`,
  "--canvas-font-lg": `${e.fontSize.lg}px`,
  "--canvas-font-xl": `${e.fontSize.xl}px`,
  "--canvas-stroke-thin": `${e.strokeWidth.thin}px`,
  "--canvas-stroke-normal": `${e.strokeWidth.normal}px`,
  "--canvas-stroke-thick": `${e.strokeWidth.thick}px`,
  "--canvas-shadow-sm": e.shadows.sm,
  "--canvas-shadow-md": e.shadows.md,
  "--canvas-shadow-lg": e.shadows.lg,
  "--canvas-shadow-element": e.shadows.element,
  "--canvas-shadow-handle": e.shadows.handle
}), Ae = {
  zoom: 1,
  pan: { x: 0, y: 0 },
  minZoom: 0.1,
  maxZoom: 5
}, Tt = (e, t) => {
  switch (t.type) {
    case "SET_ZOOM": {
      const n = Math.max(e.minZoom, Math.min(e.maxZoom, t.payload));
      return { ...e, zoom: n };
    }
    case "ZOOM_IN": {
      const n = Math.min(e.maxZoom, e.zoom * 1.2);
      return { ...e, zoom: n };
    }
    case "ZOOM_OUT": {
      const n = Math.max(e.minZoom, e.zoom / 1.2);
      return { ...e, zoom: n };
    }
    case "ZOOM_TO_FIT": {
      const { bounds: n, padding: s = 50 } = t.payload, o = Math.max(e.minZoom, Math.min(e.maxZoom, 1)), r = {
        x: -(n.x - s),
        y: -(n.y - s)
      };
      return { ...e, zoom: o, pan: r };
    }
    case "SET_PAN":
      return { ...e, pan: t.payload };
    case "PAN_BY":
      return {
        ...e,
        pan: {
          x: e.pan.x + t.payload.x,
          y: e.pan.y + t.payload.y
        }
      };
    case "RESET":
      return { ...Ae, minZoom: e.minZoom, maxZoom: e.maxZoom };
    case "SET_CONSTRAINTS":
      return {
        ...e,
        minZoom: t.payload.minZoom ?? e.minZoom,
        maxZoom: t.payload.maxZoom ?? e.maxZoom
      };
    default:
      return e;
  }
}, _e = ye(null), de = () => {
  const e = me(_e);
  if (!e)
    throw new Error("useViewport must be used within a ViewportProvider");
  return e;
}, Mt = ({
  children: e,
  initialViewport: t
}) => {
  const [n, s] = xe(Tt, {
    ...Ae,
    ...t
  }), o = c((i) => {
    s({ type: "SET_ZOOM", payload: i });
  }, []), r = c(() => {
    s({ type: "ZOOM_IN" });
  }, []), a = c(() => {
    s({ type: "ZOOM_OUT" });
  }, []), l = c((i, R) => {
    s({ type: "ZOOM_TO_FIT", payload: { bounds: i, padding: R } });
  }, []), u = c((i) => {
    s({ type: "SET_PAN", payload: i });
  }, []), g = c((i) => {
    s({ type: "PAN_BY", payload: i });
  }, []), h = c(() => {
    s({ type: "RESET" });
  }, []), x = c(
    (i) => {
      s({ type: "SET_CONSTRAINTS", payload: i });
    },
    []
  ), w = c(
    (i) => ({
      x: (i.x - n.pan.x) / n.zoom,
      y: (i.y - n.pan.y) / n.zoom
    }),
    [n.zoom, n.pan]
  ), f = c(
    (i) => ({
      x: i.x * n.zoom + n.pan.x,
      y: i.y * n.zoom + n.pan.y
    }),
    [n.zoom, n.pan]
  ), E = Z(
    () => ({
      viewport: n,
      setZoom: o,
      zoomIn: r,
      zoomOut: a,
      zoomToFit: l,
      setPan: u,
      panBy: g,
      resetViewport: h,
      setConstraints: x,
      screenToCanvas: w,
      canvasToScreen: f
    }),
    [
      n,
      o,
      r,
      a,
      l,
      u,
      g,
      h,
      x,
      w,
      f
    ]
  );
  return v.createElement(_e.Provider, { value: E }, e);
}, zt = {
  selectedIds: /* @__PURE__ */ new Set(),
  lastSelectedId: null
}, bt = (e, t) => {
  switch (t.type) {
    case "SELECT":
      return {
        selectedIds: /* @__PURE__ */ new Set([t.payload]),
        lastSelectedId: t.payload
      };
    case "SELECT_MULTIPLE":
      return {
        selectedIds: new Set(t.payload),
        lastSelectedId: t.payload.length > 0 ? t.payload[t.payload.length - 1] : null
      };
    case "ADD_TO_SELECTION": {
      const n = new Set(e.selectedIds);
      return n.add(t.payload), {
        selectedIds: n,
        lastSelectedId: t.payload
      };
    }
    case "REMOVE_FROM_SELECTION": {
      const n = new Set(e.selectedIds);
      return n.delete(t.payload), {
        selectedIds: n,
        lastSelectedId: n.size > 0 ? Array.from(n).pop() : null
      };
    }
    case "TOGGLE_SELECTION": {
      const n = new Set(e.selectedIds);
      return n.has(t.payload) ? (n.delete(t.payload), {
        selectedIds: n,
        lastSelectedId: n.size > 0 ? Array.from(n).pop() : null
      }) : (n.add(t.payload), {
        selectedIds: n,
        lastSelectedId: t.payload
      });
    }
    case "CLEAR_SELECTION":
      return zt;
    case "SELECT_ALL":
      return {
        selectedIds: new Set(t.payload),
        lastSelectedId: t.payload.length > 0 ? t.payload[t.payload.length - 1] : null
      };
    default:
      return e;
  }
}, Oe = ye(null), we = () => {
  const e = me(Oe);
  if (!e)
    throw new Error("useSelection must be used within a SelectionProvider");
  return e;
}, Nt = ({
  children: e,
  initialSelection: t,
  onSelectionChange: n
}) => {
  const [s, o] = xe(bt, {
    selectedIds: new Set(t ?? []),
    lastSelectedId: t?.[t.length - 1] ?? null
  }), r = Z(() => Array.from(s.selectedIds), [s.selectedIds]);
  v.useEffect(() => {
    n?.(r);
  }, [r, n]);
  const a = c(
    (i) => s.selectedIds.has(i),
    [s.selectedIds]
  ), l = c((i) => {
    o({ type: "SELECT", payload: i });
  }, []), u = c((i) => {
    o({ type: "SELECT_MULTIPLE", payload: i });
  }, []), g = c((i) => {
    o({ type: "ADD_TO_SELECTION", payload: i });
  }, []), h = c((i) => {
    o({ type: "REMOVE_FROM_SELECTION", payload: i });
  }, []), x = c((i) => {
    o({ type: "TOGGLE_SELECTION", payload: i });
  }, []), w = c(() => {
    o({ type: "CLEAR_SELECTION" });
  }, []), f = c((i) => {
    o({ type: "SELECT_ALL", payload: i });
  }, []), E = Z(
    () => ({
      selectedIds: r,
      lastSelectedId: s.lastSelectedId,
      selectionCount: s.selectedIds.size,
      hasSelection: s.selectedIds.size > 0,
      isSelected: a,
      select: l,
      selectMultiple: u,
      addToSelection: g,
      removeFromSelection: h,
      toggleSelection: x,
      clearSelection: w,
      selectAll: f
    }),
    [
      r,
      s.lastSelectedId,
      s.selectedIds.size,
      a,
      l,
      u,
      g,
      h,
      x,
      w,
      f
    ]
  );
  return v.createElement(Oe.Provider, { value: E }, e);
}, Dt = (e, t) => {
  switch (t.type) {
    case "PUSH": {
      const n = [...e.past, e.present];
      return n.length > e.maxHistorySize && n.shift(), {
        ...e,
        past: n,
        present: t.payload,
        future: []
        // Clear future on new action
      };
    }
    case "UNDO": {
      if (e.past.length === 0) return e;
      const n = e.past[e.past.length - 1], s = e.past.slice(0, -1);
      return {
        ...e,
        past: s,
        present: n,
        future: [e.present, ...e.future]
      };
    }
    case "REDO": {
      if (e.future.length === 0) return e;
      const n = e.future[0], s = e.future.slice(1);
      return {
        ...e,
        past: [...e.past, e.present],
        present: n,
        future: s
      };
    }
    case "CLEAR":
      return {
        ...e,
        past: [],
        present: e.present,
        future: []
      };
    case "SET_PRESENT":
      return {
        ...e,
        present: t.payload
      };
    case "SET_MAX_SIZE":
      return {
        ...e,
        maxHistorySize: t.payload
      };
    default:
      return e;
  }
}, Le = ye(null), Ct = () => {
  const e = me(Le);
  if (!e)
    throw new Error("useHistory must be used within a HistoryProvider");
  return e;
}, At = ({
  children: e,
  initialElements: t = [],
  initialConnections: n = [],
  maxHistorySize: s = 50,
  onStateChange: o
}) => {
  const [r, a] = xe(Dt, {
    past: [],
    present: {
      elements: t,
      connections: n,
      timestamp: Date.now()
    },
    future: [],
    maxHistorySize: s
  });
  v.useEffect(() => {
    o?.(r.present.elements, r.present.connections);
  }, [r.present, o]);
  const l = c((E, i) => {
    a({
      type: "PUSH",
      payload: {
        elements: E,
        connections: i,
        timestamp: Date.now()
      }
    });
  }, []), u = c(() => {
    a({ type: "UNDO" });
  }, []), g = c(() => {
    a({ type: "REDO" });
  }, []), h = c(() => {
    a({ type: "CLEAR" });
  }, []), x = c((E, i) => {
    a({
      type: "SET_PRESENT",
      payload: {
        elements: E,
        connections: i,
        timestamp: Date.now()
      }
    });
  }, []), w = c((E) => {
    a({ type: "SET_MAX_SIZE", payload: E });
  }, []), f = Z(
    () => ({
      canUndo: r.past.length > 0,
      canRedo: r.future.length > 0,
      historySize: r.past.length,
      futureSize: r.future.length,
      present: r.present,
      pushState: l,
      undo: u,
      redo: g,
      clearHistory: h,
      setPresent: x,
      setMaxHistorySize: w
    }),
    [r.past.length, r.future.length, r.present, l, u, g, h, x, w]
  );
  return v.createElement(Le.Provider, { value: f }, e);
}, _t = {
  width: 800,
  height: 600,
  grid: {
    enabled: !1,
    size: 20,
    snap: !1,
    visible: !1
  },
  readonly: !1
}, Ot = (e, t) => {
  switch (t.type) {
    // Element actions
    case "ADD_ELEMENT":
      return {
        ...e,
        elements: [...e.elements, t.payload]
      };
    case "ADD_ELEMENTS":
      return {
        ...e,
        elements: [...e.elements, ...t.payload]
      };
    case "UPDATE_ELEMENT":
      return {
        ...e,
        elements: e.elements.map(
          (n) => n.id === t.payload.id ? { ...n, ...t.payload.updates } : n
        )
      };
    case "UPDATE_ELEMENTS":
      return {
        ...e,
        elements: e.elements.map(
          (n) => t.payload.ids.includes(n.id) ? { ...n, ...t.payload.updates } : n
        )
      };
    case "REMOVE_ELEMENT": {
      const n = t.payload;
      return {
        ...e,
        elements: e.elements.filter((s) => s.id !== n),
        // Also remove connections involving this element
        connections: e.connections.filter(
          (s) => s.fromId !== n && s.toId !== n
        )
      };
    }
    case "REMOVE_ELEMENTS": {
      const n = new Set(t.payload);
      return {
        ...e,
        elements: e.elements.filter((s) => !n.has(s.id)),
        connections: e.connections.filter(
          (s) => !n.has(s.fromId) && !n.has(s.toId)
        )
      };
    }
    case "MOVE_ELEMENT":
      return {
        ...e,
        elements: e.elements.map(
          (n) => n.id === t.payload.id ? { ...n, x: t.payload.x, y: t.payload.y } : n
        )
      };
    case "MOVE_ELEMENTS":
      return {
        ...e,
        elements: e.elements.map(
          (n) => t.payload.ids.includes(n.id) ? { ...n, x: n.x + t.payload.deltaX, y: n.y + t.payload.deltaY } : n
        )
      };
    case "RESIZE_ELEMENT":
      return {
        ...e,
        elements: e.elements.map(
          (n) => n.id === t.payload.id ? {
            ...n,
            width: t.payload.width,
            height: t.payload.height,
            ...t.payload.x !== void 0 && { x: t.payload.x },
            ...t.payload.y !== void 0 && { y: t.payload.y }
          } : n
        )
      };
    case "BRING_TO_FRONT":
      return {
        ...e,
        elements: pt(e.elements, t.payload)
      };
    case "SEND_TO_BACK":
      return {
        ...e,
        elements: gt(e.elements, t.payload)
      };
    case "MOVE_UP":
      return {
        ...e,
        elements: ft(e.elements, t.payload)
      };
    case "MOVE_DOWN":
      return {
        ...e,
        elements: Et(e.elements, t.payload)
      };
    case "SET_ELEMENTS":
      return {
        ...e,
        elements: t.payload
      };
    // Connection actions
    case "ADD_CONNECTION":
      return {
        ...e,
        connections: [...e.connections, t.payload]
      };
    case "UPDATE_CONNECTION":
      return {
        ...e,
        connections: e.connections.map(
          (n) => n.id === t.payload.id ? { ...n, ...t.payload.updates } : n
        )
      };
    case "REMOVE_CONNECTION":
      return {
        ...e,
        connections: e.connections.filter((n) => n.id !== t.payload)
      };
    case "SET_CONNECTIONS":
      return {
        ...e,
        connections: t.payload
      };
    // Config actions
    case "UPDATE_CONFIG":
      return {
        ...e,
        config: { ...e.config, ...t.payload }
      };
    // Bulk actions
    case "CLEAR_CANVAS":
      return {
        ...e,
        elements: [],
        connections: []
      };
    case "LOAD_STATE":
      return {
        ...e,
        elements: t.payload.elements,
        connections: t.payload.connections
      };
    default:
      return e;
  }
}, Pe = ye(null), ge = () => {
  const e = me(Pe);
  if (!e)
    throw new Error("useCanvas must be used within a CanvasProvider");
  return e;
}, Lt = ({
  children: e,
  initialElements: t = [],
  initialConnections: n = [],
  config: s,
  onChange: o
}) => {
  const [r, a] = xe(Ot, {
    elements: t,
    connections: n,
    config: { ..._t, ...s }
  });
  v.useEffect(() => {
    o?.(r.elements, r.connections);
  }, [r.elements, r.connections, o]);
  const l = c(
    (m) => r.elements.find((M) => M.id === m),
    [r.elements]
  ), u = c(
    (m) => r.elements.filter((M) => M.type === m),
    [r.elements]
  ), g = c(
    (m) => {
      const M = m.id ?? Ee(), _ = r.elements.length > 0 ? Math.max(...r.elements.map((U) => U.zIndex)) : 0;
      return a({
        type: "ADD_ELEMENT",
        payload: { ...m, id: M, zIndex: m.zIndex ?? _ + 1 }
      }), M;
    },
    [r.elements]
  ), h = c(
    (m) => {
      const M = r.elements.length > 0 ? Math.max(...r.elements.map((U) => U.zIndex)) : 0, _ = m.map((U, ne) => ({
        ...U,
        id: U.id ?? Ee(),
        zIndex: U.zIndex ?? M + 1 + ne
      }));
      return a({ type: "ADD_ELEMENTS", payload: _ }), _.map((U) => U.id);
    },
    [r.elements]
  ), x = c((m, M) => {
    a({ type: "UPDATE_ELEMENT", payload: { id: m, updates: M } });
  }, []), w = c((m, M) => {
    a({ type: "UPDATE_ELEMENTS", payload: { ids: m, updates: M } });
  }, []), f = c((m) => {
    a({ type: "REMOVE_ELEMENT", payload: m });
  }, []), E = c((m) => {
    a({ type: "REMOVE_ELEMENTS", payload: m });
  }, []), i = c((m, M, _) => {
    a({ type: "MOVE_ELEMENT", payload: { id: m, x: M, y: _ } });
  }, []), R = c((m, M, _) => {
    a({ type: "MOVE_ELEMENTS", payload: { ids: m, deltaX: M, deltaY: _ } });
  }, []), k = c(
    (m, M, _, U, ne) => {
      a({ type: "RESIZE_ELEMENT", payload: { id: m, width: M, height: _, x: U, y: ne } });
    },
    []
  ), d = c((m) => {
    a({ type: "BRING_TO_FRONT", payload: m });
  }, []), I = c((m) => {
    a({ type: "SEND_TO_BACK", payload: m });
  }, []), y = c((m) => {
    a({ type: "MOVE_UP", payload: m });
  }, []), p = c((m) => {
    a({ type: "MOVE_DOWN", payload: m });
  }, []), S = c((m) => {
    a({ type: "SET_ELEMENTS", payload: m });
  }, []), T = c(
    (m) => r.connections.find((M) => M.id === m),
    [r.connections]
  ), D = c(
    (m) => r.connections.filter(
      (M) => M.fromId === m || M.toId === m
    ),
    [r.connections]
  ), b = c(
    (m) => {
      const M = m.id ?? Ee();
      return a({
        type: "ADD_CONNECTION",
        payload: { ...m, id: M }
      }), M;
    },
    []
  ), $ = c((m, M) => {
    a({ type: "UPDATE_CONNECTION", payload: { id: m, updates: M } });
  }, []), P = c((m) => {
    a({ type: "REMOVE_CONNECTION", payload: m });
  }, []), L = c((m) => {
    a({ type: "SET_CONNECTIONS", payload: m });
  }, []), A = c((m) => {
    a({ type: "UPDATE_CONFIG", payload: m });
  }, []), X = c(() => {
    a({ type: "CLEAR_CANVAS" });
  }, []), K = c((m, M) => {
    a({ type: "LOAD_STATE", payload: { elements: m, connections: M } });
  }, []), oe = Z(
    () => ({
      elements: r.elements,
      connections: r.connections,
      config: r.config,
      getElementById: l,
      getElementsByType: u,
      addElement: g,
      addElements: h,
      updateElement: x,
      updateElements: w,
      removeElement: f,
      removeElements: E,
      moveElement: i,
      moveElements: R,
      resizeElement: k,
      bringToFront: d,
      sendToBack: I,
      moveUp: y,
      moveDown: p,
      setElements: S,
      getConnectionById: T,
      getConnectionsForElement: D,
      addConnection: b,
      updateConnection: $,
      removeConnection: P,
      setConnections: L,
      updateConfig: A,
      clearCanvas: X,
      loadState: K
    }),
    [
      r.elements,
      r.connections,
      r.config,
      l,
      u,
      g,
      h,
      x,
      w,
      f,
      E,
      i,
      R,
      k,
      d,
      I,
      y,
      p,
      S,
      T,
      D,
      b,
      $,
      P,
      L,
      A,
      X,
      K
    ]
  );
  return v.createElement(Pe.Provider, { value: oe }, e);
}, Pt = ({
  children: e,
  initialElements: t = [],
  initialConnections: n = [],
  config: s,
  theme: o = "light",
  initialViewport: r,
  maxHistorySize: a = 50,
  onElementsChange: l,
  onSelectionChange: u,
  elements: g,
  connections: h,
  selectedIds: x
}) => {
  const w = g ?? t, f = h ?? n;
  return /* @__PURE__ */ te(It, { theme: o, children: /* @__PURE__ */ te(Mt, { initialViewport: r, children: /* @__PURE__ */ te(
    Nt,
    {
      initialSelection: x,
      onSelectionChange: u,
      children: /* @__PURE__ */ te(
        At,
        {
          initialElements: w,
          initialConnections: f,
          maxHistorySize: a,
          children: /* @__PURE__ */ te(
            Lt,
            {
              initialElements: w,
              initialConnections: f,
              config: s,
              onChange: l,
              children: e
            }
          )
        }
      )
    }
  ) }) });
}, $e = (e = {}) => {
  const {
    onDragStart: t,
    onDrag: n,
    onDragEnd: s,
    disabled: o = !1,
    threshold: r = 3
  } = e, [a, l] = ve({
    isDragging: !1,
    startPosition: null,
    currentPosition: null,
    delta: { x: 0, y: 0 }
  }), u = re(null), g = re(!1), { screenToCanvas: h } = de(), x = c(
    (k) => {
      if ("touches" in k) {
        const d = k.touches[0] || k.changedTouches[0];
        return h({ x: d.clientX, y: d.clientY });
      }
      return h({ x: k.clientX, y: k.clientY });
    },
    [h]
  ), w = c(
    (k) => {
      if (!u.current) return;
      const d = x(k), I = {
        x: d.x - u.current.x,
        y: d.y - u.current.y
      };
      if (!g.current) {
        if (Math.sqrt(I.x ** 2 + I.y ** 2) < r) return;
        g.current = !0, t?.(u.current);
      }
      l({
        isDragging: !0,
        startPosition: u.current,
        currentPosition: d,
        delta: I
      }), n?.(d, I);
    },
    [x, r, t, n]
  ), f = c(
    (k) => {
      if (!u.current) return;
      const d = x(k), I = {
        x: d.x - u.current.x,
        y: d.y - u.current.y
      };
      g.current && s?.(d, I), l({
        isDragging: !1,
        startPosition: null,
        currentPosition: null,
        delta: { x: 0, y: 0 }
      }), u.current = null, g.current = !1, document.removeEventListener("mousemove", w), document.removeEventListener("mouseup", f), document.removeEventListener("touchmove", w), document.removeEventListener("touchend", f);
    },
    [x, w, s]
  ), E = c(
    (k, d) => {
      if (o) return;
      const I = h({ x: k, y: d });
      u.current = I, g.current = !1, l({
        isDragging: !1,
        startPosition: I,
        currentPosition: I,
        delta: { x: 0, y: 0 }
      }), document.addEventListener("mousemove", w), document.addEventListener("mouseup", f), document.addEventListener("touchmove", w, { passive: !1 }), document.addEventListener("touchend", f);
    },
    [o, h, w, f]
  ), i = c(
    (k) => {
      k.button === 0 && (k.preventDefault(), k.stopPropagation(), E(k.clientX, k.clientY));
    },
    [E]
  ), R = c(
    (k) => {
      if (k.touches.length !== 1) return;
      const d = k.touches[0];
      E(d.clientX, d.clientY);
    },
    [E]
  );
  return {
    dragState: a,
    handlers: {
      onMouseDown: i,
      onTouchStart: R
    },
    isDragging: a.isDragging
  };
}, $t = (e = {}) => {
  const {
    onResizeStart: t,
    onResize: n,
    onResizeEnd: s,
    disabled: o = !1,
    minWidth: r = 20,
    minHeight: a = 20,
    maxWidth: l = 1 / 0,
    maxHeight: u = 1 / 0,
    maintainAspectRatio: g = !1,
    aspectRatio: h
  } = e, [x, w] = ve({
    isResizing: !1,
    handle: null,
    startBounds: null,
    currentBounds: null
  }), f = re(null), { screenToCanvas: E } = de(), i = c(
    (y) => {
      if ("touches" in y) {
        const p = y.touches[0] || y.changedTouches[0];
        return E({ x: p.clientX, y: p.clientY });
      }
      return E({ x: y.clientX, y: y.clientY });
    },
    [E]
  ), R = c(
    (y) => {
      if (!f.current)
        return { x: 0, y: 0, width: 0, height: 0 };
      const { position: p, bounds: S, handle: T } = f.current, D = y.x - p.x, b = y.y - p.y;
      let $ = S.x, P = S.y, L = S.width, A = S.height;
      switch (T) {
        case "nw":
          $ = S.x + D, P = S.y + b, L = S.width - D, A = S.height - b;
          break;
        case "n":
          P = S.y + b, A = S.height - b;
          break;
        case "ne":
          P = S.y + b, L = S.width + D, A = S.height - b;
          break;
        case "e":
          L = S.width + D;
          break;
        case "se":
          L = S.width + D, A = S.height + b;
          break;
        case "s":
          A = S.height + b;
          break;
        case "sw":
          $ = S.x + D, L = S.width - D, A = S.height + b;
          break;
        case "w":
          $ = S.x + D, L = S.width - D;
          break;
      }
      if (L < r && (T.includes("w") && ($ = S.x + S.width - r), L = r), A < a && (T.includes("n") && (P = S.y + S.height - a), A = a), L > l && (L = l), A > u && (A = u), g && f.current.aspectRatio) {
        const X = f.current.aspectRatio;
        L / A > X ? L = A * X : A = L / X;
      }
      return { x: $, y: P, width: L, height: A };
    },
    [r, a, l, u, g]
  ), k = c(
    (y) => {
      if (!f.current) return;
      const p = i(y), S = R(p);
      w((T) => ({
        ...T,
        currentBounds: S
      })), n?.(S);
    },
    [i, R, n]
  ), d = c(
    (y) => {
      if (!f.current) return;
      const p = i(y), S = R(p);
      s?.(S), w({
        isResizing: !1,
        handle: null,
        startBounds: null,
        currentBounds: null
      }), f.current = null, document.removeEventListener("mousemove", k), document.removeEventListener("mouseup", d), document.removeEventListener("touchmove", k), document.removeEventListener("touchend", d);
    },
    [i, R, k, s]
  ), I = c(
    (y, p, S) => {
      if (o) return;
      S.preventDefault(), S.stopPropagation();
      const T = "touches" in S ? S.touches[0].clientX : S.clientX, D = "touches" in S ? S.touches[0].clientY : S.clientY, b = E({ x: T, y: D });
      f.current = {
        position: b,
        bounds: p,
        handle: y,
        aspectRatio: h ?? p.width / p.height
      }, w({
        isResizing: !0,
        handle: y,
        startBounds: p,
        currentBounds: p
      }), t?.(y), document.addEventListener("mousemove", k), document.addEventListener("mouseup", d), document.addEventListener("touchmove", k, { passive: !1 }), document.addEventListener("touchend", d);
    },
    [
      o,
      E,
      h,
      t,
      k,
      d
    ]
  );
  return {
    resizeState: x,
    startResize: I,
    isResizing: x.isResizing
  };
}, Be = (e = {}) => {
  const {
    onRotateStart: t,
    onRotate: n,
    onRotateEnd: s,
    disabled: o = !1,
    snapAngle: r
  } = e, [a, l] = ve({
    isRotating: !1,
    startAngle: null,
    currentAngle: null,
    deltaAngle: 0
  }), u = re(null), { screenToCanvas: g } = de(), h = c(
    (R) => {
      if ("touches" in R) {
        const k = R.touches[0] || R.changedTouches[0];
        return g({ x: k.clientX, y: k.clientY });
      }
      return g({ x: R.clientX, y: R.clientY });
    },
    [g]
  ), x = c((R, k) => {
    const d = k.x - R.x, I = k.y - R.y;
    return Math.atan2(I, d) * (180 / Math.PI);
  }, []), w = c(
    (R) => r ? Math.round(R / r) * r : R,
    [r]
  ), f = c(
    (R) => {
      if (!u.current || o) return;
      const k = h(R), { center: d, startMouseAngle: I, initialRotation: y } = u.current;
      let S = x(d, k) - I, T = y + S;
      T = (T % 360 + 360) % 360, R.shiftKey && r && (T = w(T)), l({
        isRotating: !0,
        startAngle: y,
        currentAngle: T,
        deltaAngle: T - y
      }), n?.(T, T - y);
    },
    [o, h, x, r, w, n]
  ), E = c(
    (R) => {
      if (!u.current) return;
      const k = h(R), { center: d, startMouseAngle: I, initialRotation: y } = u.current;
      let S = x(d, k) - I, T = y + S;
      T = (T % 360 + 360) % 360, R.shiftKey && r && (T = w(T)), s?.(T), l({
        isRotating: !1,
        startAngle: null,
        currentAngle: null,
        deltaAngle: 0
      }), u.current = null, document.removeEventListener("mousemove", f), document.removeEventListener("mouseup", E), document.removeEventListener("touchmove", f), document.removeEventListener("touchend", E);
    },
    [
      h,
      x,
      r,
      w,
      s,
      f
    ]
  ), i = c(
    (R, k, d) => {
      if (o) return;
      d.stopPropagation(), d.preventDefault();
      const I = h(
        d.nativeEvent
      ), y = x(R, I);
      u.current = {
        center: R,
        startMouseAngle: y,
        initialRotation: k
      }, l({
        isRotating: !0,
        startAngle: k,
        currentAngle: k,
        deltaAngle: 0
      }), t?.(k), document.addEventListener("mousemove", f), document.addEventListener("mouseup", E), document.addEventListener("touchmove", f), document.addEventListener("touchend", E);
    },
    [
      o,
      h,
      x,
      t,
      f,
      E
    ]
  );
  return {
    rotateState: a,
    startRotate: i,
    isRotating: a.isRotating
  };
}, We = (e) => {
  const { id: t, disabled: n = !1, onSelect: s } = e, {
    isSelected: o,
    select: r,
    addToSelection: a,
    removeFromSelection: l,
    toggleSelection: u,
    clearSelection: g
  } = we(), h = o(t), x = c(() => {
    n || (r(t), s?.(!0));
  }, [n, t, r, s]), w = c(() => {
    n || (l(t), s?.(!1));
  }, [n, t, l, s]), f = c(() => {
    if (n) return;
    const i = !h;
    u(t), s?.(i);
  }, [n, t, h, u, s]), E = c(
    (i) => {
      n || (i.stopPropagation(), i.ctrlKey || i.metaKey ? (u(t), s?.(!h)) : i.shiftKey ? (a(t), s?.(!0)) : (r(t), s?.(!0)));
    },
    [
      n,
      t,
      h,
      u,
      a,
      r,
      s
    ]
  );
  return {
    isSelected: h,
    handlers: {
      onClick: E
    },
    select: x,
    deselect: w,
    toggle: f
  };
}, Bt = (e, t) => {
  const n = e.key.toLowerCase() === t.key.toLowerCase();
  t.ctrl ? e.ctrlKey : !e.ctrlKey || t.meta, t.meta ? e.metaKey : !e.metaKey || t.ctrl;
  const s = t.shift ? e.shiftKey : !e.shiftKey, o = t.alt ? e.altKey : !e.altKey, r = t.ctrl || t.meta ? !!(t.ctrl && (e.ctrlKey || e.metaKey)) || !!(t.meta && e.metaKey) : !e.ctrlKey && !e.metaKey;
  return n && r && s && o;
}, Wt = (e = {}) => {
  const { shortcuts: t = [], enabled: n = !0, targetRef: s } = e, o = re(t);
  o.current = t;
  const r = c(
    (a) => {
      if (n) {
        for (const l of o.current)
          if (Bt(a, l)) {
            l.preventDefault !== !1 && a.preventDefault(), l.action();
            return;
          }
      }
    },
    [n]
  );
  lt(() => {
    const a = s?.current ?? document;
    return a.addEventListener("keydown", r), () => {
      a.removeEventListener("keydown", r);
    };
  }, [r, s]);
}, Zt = (e) => {
  const t = [];
  e.undo && t.push({ key: "z", ctrl: !0, action: e.undo }), e.redo && (t.push({ key: "z", ctrl: !0, shift: !0, action: e.redo }), t.push({ key: "y", ctrl: !0, action: e.redo })), e.delete && (t.push({ key: "Delete", action: e.delete }), t.push({ key: "Backspace", action: e.delete })), e.selectAll && t.push({ key: "a", ctrl: !0, action: e.selectAll }), e.copy && t.push({ key: "c", ctrl: !0, action: e.copy }), e.paste && t.push({ key: "v", ctrl: !0, action: e.paste }), e.cut && t.push({ key: "x", ctrl: !0, action: e.cut }), e.escape && t.push({ key: "Escape", action: e.escape }), e.zoomIn && (t.push({ key: "+", ctrl: !0, action: e.zoomIn }), t.push({ key: "=", ctrl: !0, action: e.zoomIn })), e.zoomOut && t.push({ key: "-", ctrl: !0, action: e.zoomOut }), e.resetZoom && t.push({ key: "0", ctrl: !0, action: e.resetZoom }), Wt({ shortcuts: t });
}, Ut = () => {
  const e = ge(), t = we(), n = Ct(), s = re(null), o = c(() => {
    n.pushState(e.elements, e.connections);
  }, [n, e.elements, e.connections]), r = c(
    (d) => (o(), e.addElement(d)),
    [e, o]
  ), a = c(
    (d, I) => {
      o(), e.updateElement(d, I);
    },
    [e, o]
  ), l = c(
    (d) => {
      o(), e.removeElement(d);
    },
    [e, o]
  ), u = c(() => {
    t.selectedIds.length !== 0 && (o(), e.removeElements(t.selectedIds), t.clearSelection());
  }, [e, t, o]), g = c(
    (d, I) => {
      t.selectedIds.length !== 0 && (o(), e.moveElements(t.selectedIds, d, I));
    },
    [e, t, o]
  ), h = c(() => {
    if (t.selectedIds.length === 0) return [];
    o();
    const I = e.elements.filter(
      (p) => t.selectedIds.includes(p.id)
    ).map((p) => ({
      ...p,
      id: void 0,
      // Will be auto-generated
      x: p.x + 20,
      y: p.y + 20
    })), y = e.addElements(I);
    return t.selectMultiple(y), y;
  }, [e, t, o]), x = c(
    (d) => (o(), e.addConnection(d)),
    [e, o]
  ), w = c(
    (d) => {
      o(), e.removeConnection(d);
    },
    [e, o]
  ), f = c(() => {
    if (t.selectedIds.length === 0) return;
    const d = e.elements.filter(
      (p) => t.selectedIds.includes(p.id)
    ), I = new Set(t.selectedIds), y = e.connections.filter(
      (p) => I.has(p.fromId) && I.has(p.toId)
    );
    s.current = {
      elements: d,
      connections: y
    };
  }, [e.elements, e.connections, t.selectedIds]), E = c(() => {
    f(), u();
  }, [f, u]), i = c(() => {
    if (!s.current) return;
    o();
    const d = /* @__PURE__ */ new Map(), I = s.current.elements.map((p) => ({
      ...p,
      id: void 0,
      x: p.x + 20,
      y: p.y + 20
    })), y = e.addElements(I);
    s.current.elements.forEach((p, S) => {
      d.set(p.id, y[S]);
    }), s.current.connections.forEach((p) => {
      const S = d.get(p.fromId), T = d.get(p.toId);
      S && T && e.addConnection({
        ...p,
        id: void 0,
        fromId: S,
        toId: T
      });
    }), t.selectMultiple(y);
  }, [e, t, o]), R = c(() => {
    n.canUndo && (n.undo(), e.loadState(n.present.elements, n.present.connections));
  }, [n, e]), k = c(() => {
    n.canRedo && (n.redo(), e.loadState(n.present.elements, n.present.connections));
  }, [n, e]);
  return {
    addElement: r,
    updateElement: a,
    removeElement: l,
    removeSelected: u,
    moveSelected: g,
    duplicateSelected: h,
    addConnection: x,
    removeConnection: w,
    copy: f,
    cut: E,
    paste: i,
    hasCopied: s.current !== null,
    undo: R,
    redo: k,
    canUndo: n.canUndo,
    canRedo: n.canRedo
  };
}, fe = 8, Ze = ie(
  ({
    element: e,
    children: t,
    className: n,
    style: s,
    disabled: o = !1,
    showHandles: r = !0,
    enableRotation: a = !0,
    onSelect: l,
    onDragStart: u,
    onDrag: g,
    onDragEnd: h,
    onResizeStart: x,
    onResize: w,
    onResizeEnd: f,
    onRotateStart: E,
    onRotate: i,
    onRotateEnd: R
  }, k) => {
    const { updateElement: d } = ge(), { theme: I } = F(), y = e.locked || o, { isSelected: p, handlers: S } = We({
      id: e.id,
      disabled: y,
      onSelect: l
    }), { isDragging: T, dragState: D, handlers: b } = $e({
      disabled: y || !p,
      onDragStart: () => {
        u?.();
      },
      onDrag: (z, B) => {
        const N = e.x + B.x, C = e.y + B.y;
        g?.(N, C);
      },
      onDragEnd: (z, B) => {
        const N = e.x + B.x, C = e.y + B.y;
        d(e.id, { x: N, y: C }), h?.(N, C);
      }
    }), { isResizing: $, resizeState: P, startResize: L } = $t({
      disabled: y || !p,
      minWidth: e.minWidth ?? 20,
      minHeight: e.minHeight ?? 20,
      maxWidth: e.maxWidth,
      maxHeight: e.maxHeight,
      onResizeStart: () => {
        x?.();
      },
      onResize: (z) => {
        w?.(z.width, z.height, z.x, z.y);
      },
      onResizeEnd: (z) => {
        d(e.id, {
          x: z.x,
          y: z.y,
          width: z.width,
          height: z.height
        }), f?.(z.width, z.height, z.x, z.y);
      }
    }), { isRotating: A, rotateState: X, startRotate: K } = Be({
      disabled: y || !p || !a,
      snapAngle: 15,
      onRotateStart: () => {
        E?.();
      },
      onRotate: (z) => {
        i?.(z);
      },
      onRotateEnd: (z) => {
        d(e.id, { rotation: z }), R?.(z);
      }
    }), oe = Z(() => A && X.currentAngle !== null ? X.currentAngle : e.rotation ?? 0, [A, X.currentAngle, e.rotation]), m = Z(() => $ && P.currentBounds ? P.currentBounds : T ? {
      x: e.x + D.delta.x,
      y: e.y + D.delta.y,
      width: e.width,
      height: e.height
    } : {
      x: e.x,
      y: e.y,
      width: e.width,
      height: e.height
    }, [$, P.currentBounds, T, D.delta, e.x, e.y, e.width, e.height]), M = Z(() => !$ || !P.currentBounds ? { x: 1, y: 1 } : {
      x: P.currentBounds.width / e.width,
      y: P.currentBounds.height / e.height
    }, [$, P.currentBounds, e.width, e.height]), _ = Z(() => !p || !r || y ? [] : ht(
      { x: 0, y: 0, width: m.width, height: m.height },
      fe
    ), [p, r, y, m.width, m.height]), U = c(
      (z, B) => {
        L(
          z,
          { x: e.x, y: e.y, width: e.width, height: e.height },
          B
        );
      },
      [L, e]
    ), ne = c(
      (z) => {
        const B = m.x + m.width / 2, N = m.y + m.height / 2;
        K(
          { x: B, y: N },
          e.rotation ?? 0,
          z
        );
      },
      [K, m, e.rotation]
    ), ue = c(
      (z) => {
        S.onClick(z), p && b.onMouseDown(z);
      },
      [S, b, p]
    ), j = {
      cursor: T ? "grabbing" : p ? "grab" : "pointer",
      opacity: e.visible === !1 ? 0.5 : 1,
      ...s
    };
    return v.createElement(
      "g",
      {
        ref: k,
        className: pe("canvas-element", n, {
          "canvas-element--selected": p,
          "canvas-element--dragging": T,
          "canvas-element--resizing": $,
          "canvas-element--rotating": A,
          "canvas-element--locked": e.locked
        }),
        transform: `translate(${m.x}, ${m.y})${oe ? ` rotate(${oe}, ${m.width / 2}, ${m.height / 2})` : ""}`,
        style: j,
        onMouseDown: ue,
        onTouchStart: b.onTouchStart,
        "data-element-id": e.id,
        "data-element-type": e.type
      },
      // Element content - scale during resize for visual feedback
      $ ? v.createElement(
        "g",
        { transform: `scale(${M.x}, ${M.y})` },
        t
      ) : t,
      // Selection outline - use display bounds for accurate sizing
      p && v.createElement("rect", {
        className: "canvas-element__selection",
        x: -2,
        y: -2,
        width: m.width + 4,
        height: m.height + 4,
        fill: "none",
        stroke: I.colors.selection.stroke,
        strokeWidth: 1,
        strokeDasharray: "4 2",
        pointerEvents: "none"
      }),
      // Resize handles
      _.map(
        (z) => v.createElement("rect", {
          key: z.position,
          className: `canvas-element__handle canvas-element__handle--${z.position}`,
          x: z.x,
          y: z.y,
          width: fe,
          height: fe,
          fill: I.colors.handle.fill,
          stroke: I.colors.handle.stroke,
          strokeWidth: 1,
          cursor: Xt(z.position),
          onMouseDown: (B) => U(z.position, B)
        })
      ),
      // Rotation handle (circular, above the element)
      p && r && a && !y && v.createElement(
        "g",
        {
          key: "rotation-handle",
          className: "canvas-element__rotation-handle"
        },
        // Line connecting to element
        v.createElement("line", {
          x1: m.width / 2,
          y1: 0,
          x2: m.width / 2,
          y2: -25,
          stroke: I.colors.selection.stroke,
          strokeWidth: 1,
          pointerEvents: "none"
        }),
        // Rotation handle circle
        v.createElement("circle", {
          cx: m.width / 2,
          cy: -25,
          r: fe / 2 + 2,
          fill: I.colors.handle.fill,
          stroke: I.colors.handle.stroke,
          strokeWidth: 1,
          cursor: "grab",
          onMouseDown: ne
        })
      )
    );
  }
);
Ze.displayName = "ElementBase";
function Xt(e) {
  return {
    nw: "nwse-resize",
    n: "ns-resize",
    ne: "nesw-resize",
    e: "ew-resize",
    se: "nwse-resize",
    s: "ns-resize",
    sw: "nesw-resize",
    w: "ew-resize"
  }[e];
}
function ae(e) {
  const t = ie((n, s) => {
    const o = n, r = o.element, a = o.disabled, l = o.showHandles, u = o.enableRotation, g = o.onSelect, h = o.onDragStart, x = o.onDrag, w = o.onDragEnd, f = o.onResizeStart, E = o.onResize, i = o.onResizeEnd, R = o.onRotateStart, k = o.onRotate, d = o.onRotateEnd, I = o.className, y = o.style, {
      element: p,
      disabled: S,
      showHandles: T,
      enableRotation: D,
      onSelect: b,
      onDragStart: $,
      onDrag: P,
      onDragEnd: L,
      onResizeStart: A,
      onResize: X,
      onResizeEnd: K,
      onRotateStart: oe,
      onRotate: m,
      onRotateEnd: M,
      className: _,
      style: U,
      ...ne
    } = o, [ue, j] = v.useState({
      isSelected: !1,
      isDragging: !1,
      isResizing: !1,
      isRotating: !1
    }), z = v.useCallback((O) => {
      j((H) => ({ ...H, isSelected: O })), g?.(O);
    }, [g]), B = v.useCallback(() => {
      j((O) => ({ ...O, isDragging: !0 })), h?.();
    }, [h]), N = v.useCallback((O, H) => {
      j((G) => ({ ...G, isDragging: !1 })), w?.(O, H);
    }, [w]), C = v.useCallback(() => {
      j((O) => ({ ...O, isResizing: !0 })), f?.();
    }, [f]), W = v.useCallback((O, H, G, Q) => {
      j((ee) => ({ ...ee, isResizing: !1 })), i?.(O, H, G, Q);
    }, [i]), Y = v.useCallback(() => {
      j((O) => ({ ...O, isRotating: !0 })), R?.();
    }, [R]), q = v.useCallback((O) => {
      j((H) => ({ ...H, isRotating: !1 })), d?.(O);
    }, [d]), V = {
      element: r,
      ...ue
    };
    return /* @__PURE__ */ te(
      Ze,
      {
        ref: s,
        element: r,
        disabled: a,
        showHandles: l,
        enableRotation: u,
        className: I,
        style: y,
        onSelect: z,
        onDragStart: B,
        onDrag: x,
        onDragEnd: N,
        onResizeStart: C,
        onResize: E,
        onResizeEnd: W,
        onRotateStart: Y,
        onRotate: k,
        onRotateEnd: q,
        children: /* @__PURE__ */ te(e, { ...V, ...ne })
      }
    );
  });
  return t.displayName = `withElementBehavior(${e.displayName || e.name || "Component"})`, t;
}
const Yt = ({ element: e }) => {
  const { theme: t } = F(), { width: n, height: s, style: o } = e;
  return v.createElement("rect", {
    width: n,
    height: s,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal,
    rx: o?.cornerRadius ?? 0,
    ry: o?.cornerRadius ?? 0,
    opacity: o?.opacity ?? 1
  });
}, Ie = ae(Yt);
Ie.displayName = "Rectangle";
const Ht = ({ element: e }) => {
  const { theme: t } = F(), { width: n, height: s, style: o } = e, r = n / 2, a = s / 2, l = n / 2, u = s / 2;
  return v.createElement("ellipse", {
    cx: r,
    cy: a,
    rx: l,
    ry: u,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal,
    opacity: o?.opacity ?? 1
  });
}, he = ae(Ht);
he.displayName = "Ellipse";
const Vt = he;
Vt.displayName = "Circle";
const Ft = he;
Ft.displayName = "Oval";
const Kt = ({ element: e }) => {
  const { theme: t } = F(), { width: n, height: s, style: o } = e, r = [
    `${n / 2},0`,
    `${n},${s / 2}`,
    `${n / 2},${s}`,
    `0,${s / 2}`
  ].join(" ");
  return v.createElement("polygon", {
    points: r,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal,
    opacity: o?.opacity ?? 1
  });
}, Ue = ae(Kt);
Ue.displayName = "Diamond";
const jt = ({ element: e }) => {
  const { theme: t } = F(), { width: n, height: s, style: o, text: r = "", fontSize: a, fontFamily: l, fontWeight: u, textAlign: g } = e, h = () => {
    switch (g) {
      case "right":
        return "end";
      case "center":
        return "middle";
      default:
        return "start";
    }
  }, x = () => {
    switch (g) {
      case "right":
        return n;
      case "center":
        return n / 2;
      default:
        return 0;
    }
  };
  return v.createElement(
    "g",
    null,
    // Background (optional, for selection area)
    v.createElement("rect", {
      width: n,
      height: s,
      fill: "transparent"
    }),
    // Text
    v.createElement(
      "text",
      {
        x: x(),
        y: s / 2,
        dominantBaseline: "central",
        textAnchor: h(),
        fill: o?.fill ?? t.colors.text.primary,
        fontSize: a ?? t.fontSize.md,
        fontFamily: l ?? "sans-serif",
        fontWeight: u ?? "normal",
        opacity: o?.opacity ?? 1
      },
      r
    )
  );
}, Xe = ae(jt);
Xe.displayName = "TextElement";
const Me = 8, ze = 25, Ye = ie(
  ({
    element: e,
    children: t,
    renderLine: n,
    className: s,
    style: o,
    disabled: r = !1,
    showHandles: a = !0,
    enableRotation: l = !0,
    onSelect: u,
    onDragStart: g,
    onDrag: h,
    onDragEnd: x,
    onPointsChange: w,
    onRotateStart: f,
    onRotate: E,
    onRotateEnd: i
  }, R) => {
    const { updateElement: k } = ge(), { theme: d } = F(), { screenToCanvas: I } = de(), y = e.locked || r, [p, S] = ve({
      isDragging: !1,
      endpointIndex: null,
      startPosition: null,
      currentPoints: null
    }), T = re(null), D = Z(() => e.points ?? [
      { x: 0, y: e.height / 2 },
      { x: e.width, y: e.height / 2 }
    ], [e.points, e.width, e.height]), { isSelected: b, handlers: $ } = We({
      id: e.id,
      disabled: y,
      onSelect: u
    }), { isDragging: P, dragState: L, handlers: A } = $e({
      disabled: y || !b || p.isDragging,
      onDragStart: () => {
        g?.();
      },
      onDrag: (N, C) => {
        const W = e.x + C.x, Y = e.y + C.y;
        h?.(W, Y);
      },
      onDragEnd: (N, C) => {
        const W = e.x + C.x, Y = e.y + C.y;
        k(e.id, { x: W, y: Y }), x?.(W, Y);
      }
    }), { isRotating: X, rotateState: K, startRotate: oe } = Be({
      disabled: y || !b || !l,
      snapAngle: 15,
      onRotateStart: () => {
        f?.();
      },
      onRotate: (N) => {
        E?.(N);
      },
      onRotateEnd: (N) => {
        k(e.id, { rotation: N }), i?.(N);
      }
    }), m = Z(() => X && K.currentAngle !== null ? K.currentAngle : e.rotation ?? 0, [X, K.currentAngle, e.rotation]), M = Z(() => P ? {
      x: e.x + L.delta.x,
      y: e.y + L.delta.y,
      width: e.width,
      height: e.height
    } : {
      x: e.x,
      y: e.y,
      width: e.width,
      height: e.height
    }, [P, L.delta, e.x, e.y, e.width, e.height]), _ = Z(() => p.isDragging && p.currentPoints ? p.currentPoints : D, [p.isDragging, p.currentPoints, D]), U = c(
      (N, C) => {
        if (y || !b) return;
        C.stopPropagation(), C.preventDefault();
        const W = I({ x: C.clientX, y: C.clientY });
        T.current = {
          endpointIndex: N,
          startMousePos: W,
          originalPoints: [...D]
        }, S({
          isDragging: !0,
          endpointIndex: N,
          startPosition: W,
          currentPoints: [...D]
        });
        const Y = (V) => {
          if (!T.current) return;
          const O = I({ x: V.clientX, y: V.clientY }), { endpointIndex: H, startMousePos: G, originalPoints: Q } = T.current, ee = O.x - G.x, Se = O.y - G.y, ke = Q.map((se, Re) => Re === H ? { x: se.x + ee, y: se.y + Se } : { ...se });
          S((se) => ({
            ...se,
            currentPoints: ke
          }));
        }, q = () => {
          T.current && (T.current, S((V) => {
            if (V.currentPoints) {
              const O = V.currentPoints, H = O.map((le) => le.x), G = O.map((le) => le.y), Q = Math.min(...H), ee = Math.min(...G), Se = Math.max(...H), ke = Math.max(...G), se = O.map((le) => ({
                x: le.x - Q,
                y: le.y - ee
              })), Re = Math.max(Se - Q, 1), it = Math.max(ke - ee, 1);
              k(e.id, {
                x: e.x + Q,
                y: e.y + ee,
                width: Re,
                height: it,
                points: se
              }), w?.(se);
            }
            return {
              isDragging: !1,
              endpointIndex: null,
              startPosition: null,
              currentPoints: null
            };
          }), T.current = null, document.removeEventListener("mousemove", Y), document.removeEventListener("mouseup", q));
        };
        document.addEventListener("mousemove", Y), document.addEventListener("mouseup", q);
      },
      [y, b, D, I, k, e.id, e.x, e.y, w]
    ), ne = c(
      (N) => {
        const C = _[0], W = _[_.length - 1], Y = (C.x + W.x) / 2, q = (C.y + W.y) / 2, V = M.x + Y, O = M.y + q;
        oe(
          { x: V, y: O },
          e.rotation ?? 0,
          N
        );
      },
      [oe, M, _, e.rotation]
    ), ue = c(
      (N) => {
        $.onClick(N), b && !p.isDragging && A.onMouseDown(N);
      },
      [$, A, b, p.isDragging]
    ), j = {
      cursor: P ? "grabbing" : b ? "grab" : "pointer",
      opacity: e.visible === !1 ? 0.5 : 1,
      ...o
    }, z = Z(() => _.map((N) => ({ x: N.x, y: N.y })), [_]), B = Z(() => {
      if (_.length < 2) return { cx: 0, cy: 0, x1: 0, y1: 0, x2: 0, y2: 0 };
      const N = _[0], C = _[_.length - 1], W = (N.x + C.x) / 2, Y = (N.y + C.y) / 2, q = C.x - N.x, V = C.y - N.y, O = Math.sqrt(q * q + V * V) || 1, H = -V / O, G = q / O, Q = W + H * ze, ee = Y + G * ze;
      return {
        cx: Q,
        cy: ee,
        x1: W,
        y1: Y,
        x2: Q,
        y2: ee
      };
    }, [_]);
    return v.createElement(
      "g",
      {
        ref: R,
        className: pe("canvas-element canvas-line", s, {
          "canvas-element--selected": b,
          "canvas-element--dragging": P,
          "canvas-element--endpoint-dragging": p.isDragging,
          "canvas-element--rotating": X,
          "canvas-element--locked": e.locked
        }),
        transform: `translate(${M.x}, ${M.y})${m ? ` rotate(${m}, ${M.width / 2}, ${M.height / 2})` : ""}`,
        style: j,
        onMouseDown: ue,
        onTouchStart: A.onTouchStart,
        "data-element-id": e.id,
        "data-element-type": e.type
      },
      // Render line with current points
      n(_, p.isDragging),
      // Endpoint handles (only when selected)
      b && a && !y && z.map(
        (N, C) => v.createElement("circle", {
          key: `endpoint-handle-${C}`,
          className: "canvas-line__endpoint-handle",
          cx: N.x,
          cy: N.y,
          r: Me / 2 + 2,
          fill: d.colors.handle.fill,
          stroke: d.colors.handle.stroke,
          strokeWidth: 1.5,
          cursor: "move",
          onMouseDown: (W) => U(C, W)
        })
      ),
      // Rotation handle (perpendicular to line direction)
      b && a && l && !y && v.createElement(
        "g",
        {
          key: "rotation-handle",
          className: "canvas-line__rotation-handle"
        },
        // Line connecting to element center
        v.createElement("line", {
          x1: B.x1,
          y1: B.y1,
          x2: B.x2,
          y2: B.y2,
          stroke: d.colors.selection.stroke,
          strokeWidth: 1,
          pointerEvents: "none"
        }),
        // Rotation handle circle
        v.createElement("circle", {
          cx: B.cx,
          cy: B.cy,
          r: Me / 2 + 2,
          fill: d.colors.handle.fill,
          stroke: d.colors.handle.stroke,
          strokeWidth: 1,
          cursor: "grab",
          onMouseDown: ne
        })
      )
    );
  }
);
Ye.displayName = "LineBase";
const He = ie(
  ({
    element: e,
    disabled: t,
    showHandles: n,
    enableRotation: s,
    onSelect: o,
    onDragStart: r,
    onDrag: a,
    onDragEnd: l,
    onPointsChange: u,
    onRotateStart: g,
    onRotate: h,
    onRotateEnd: x,
    className: w,
    style: f
  }, E) => {
    const { theme: i } = F(), { style: R, lineType: k = "solid" } = e, d = c(() => {
      switch (k) {
        case "dashed":
          return "8 4";
        case "dotted":
          return "2 2";
        default:
          return;
      }
    }, [k]), I = R?.stroke ?? i.colors.element.stroke, y = R?.strokeWidth ?? i.strokeWidth.normal, p = c((S, T) => {
      const D = S.map((b, $) => $ === 0 ? `M ${b.x} ${b.y}` : `L ${b.x} ${b.y}`).join(" ");
      return v.createElement(
        "g",
        null,
        // Invisible wider path for easier selection (follows the line shape)
        v.createElement("path", {
          d: D,
          fill: "none",
          stroke: "transparent",
          strokeWidth: 20,
          // Wide hit area
          strokeLinecap: "round"
        }),
        // Visible line
        v.createElement("path", {
          d: D,
          fill: "none",
          stroke: I,
          strokeWidth: y,
          strokeDasharray: d(),
          strokeLinecap: "round",
          strokeLinejoin: "round",
          opacity: R?.opacity ?? 1
        })
      );
    }, [I, y, d, R?.opacity]);
    return v.createElement(Ye, {
      ref: E,
      element: e,
      disabled: t,
      showHandles: n,
      enableRotation: s,
      className: w,
      style: f,
      onSelect: o,
      onDragStart: r,
      onDrag: a,
      onDragEnd: l,
      onPointsChange: u,
      onRotateStart: g,
      onRotate: h,
      onRotateEnd: x,
      renderLine: p
    });
  }
);
He.displayName = "Line";
const Gt = ({ element: e }) => {
  const { theme: t } = F(), { width: n, height: s, style: o, label: r } = e, a = Math.min(n, s) * 0.15, l = n / 2, u = a * 2 + 4, g = s * 0.6, h = u + (g - u) * 0.3, x = n * 0.4, w = n * 0.35, f = s - 4, E = o?.stroke ?? t.colors.element.stroke, i = o?.strokeWidth ?? t.strokeWidth.normal;
  return v.createElement(
    "g",
    null,
    // Invisible background for selection
    v.createElement("rect", {
      width: n,
      height: s,
      fill: "transparent"
    }),
    // Head (circle)
    v.createElement("circle", {
      cx: l,
      cy: a + 2,
      r: a,
      fill: o?.fill ?? "none",
      stroke: E,
      strokeWidth: i
    }),
    // Body (vertical line)
    v.createElement("line", {
      x1: l,
      y1: u,
      x2: l,
      y2: g,
      stroke: E,
      strokeWidth: i
    }),
    // Arms (horizontal line)
    v.createElement("line", {
      x1: l - x,
      y1: h,
      x2: l + x,
      y2: h,
      stroke: E,
      strokeWidth: i
    }),
    // Left leg
    v.createElement("line", {
      x1: l,
      y1: g,
      x2: l - w,
      y2: s * 0.85,
      stroke: E,
      strokeWidth: i
    }),
    // Right leg
    v.createElement("line", {
      x1: l,
      y1: g,
      x2: l + w,
      y2: s * 0.85,
      stroke: E,
      strokeWidth: i
    }),
    // Label
    r && v.createElement(
      "text",
      {
        x: l,
        y: f,
        textAnchor: "middle",
        dominantBaseline: "text-bottom",
        fill: o?.fill ?? t.colors.text.primary,
        fontSize: t.fontSize.sm,
        fontFamily: "sans-serif"
      },
      r
    )
  );
}, Ve = ae(Gt);
Ve.displayName = "Actor";
const Jt = ({ element: e }) => {
  const { theme: t } = F(), { width: n, height: s, style: o, label: r } = e, a = n / 2, l = 40, u = o?.stroke ?? t.colors.element.stroke, g = o?.strokeWidth ?? t.strokeWidth.normal;
  return v.createElement(
    "g",
    null,
    // Header box
    v.createElement("rect", {
      x: 0,
      y: 0,
      width: n,
      height: l,
      fill: o?.fill ?? t.colors.element.fill,
      stroke: u,
      strokeWidth: g
    }),
    // Label in header
    r && v.createElement(
      "text",
      {
        x: a,
        y: l / 2,
        textAnchor: "middle",
        dominantBaseline: "central",
        fill: t.colors.text.primary,
        fontSize: t.fontSize.sm,
        fontFamily: "sans-serif"
      },
      r
    ),
    // Dashed lifeline
    v.createElement("line", {
      x1: a,
      y1: l,
      x2: a,
      y2: s,
      stroke: u,
      strokeWidth: g,
      strokeDasharray: "8 4"
    })
  );
}, Fe = ae(Jt);
Fe.displayName = "Lifeline";
const qt = ({ element: e }) => {
  const { theme: t } = F(), { width: n, height: s, style: o, label: r, messageType: a = "sync" } = e, l = o?.stroke ?? t.colors.connection.line, u = o?.strokeWidth ?? t.strokeWidth.normal, g = 10, h = s / 2, x = () => {
    switch (a) {
      case "return":
        return "8 4";
      case "create":
        return "4 2";
      default:
        return;
    }
  }, w = () => a === "async" ? v.createElement("polyline", {
    points: `${n - g},${h - g / 2} ${n},${h} ${n - g},${h + g / 2}`,
    fill: "none",
    stroke: l,
    strokeWidth: u
  }) : v.createElement("polygon", {
    points: `${n},${h} ${n - g},${h - g / 2} ${n - g},${h + g / 2}`,
    fill: l,
    stroke: l,
    strokeWidth: 1
  });
  return v.createElement(
    "g",
    null,
    // Invisible background for selection
    v.createElement("rect", {
      width: n,
      height: s,
      fill: "transparent"
    }),
    // Main line
    v.createElement("line", {
      x1: 0,
      y1: h,
      x2: n - (a === "async" ? 0 : g / 2),
      y2: h,
      stroke: l,
      strokeWidth: u,
      strokeDasharray: x()
    }),
    // Arrow head
    w(),
    // Label above the line
    r && v.createElement(
      "text",
      {
        x: n / 2,
        y: h - 8,
        textAnchor: "middle",
        dominantBaseline: "text-bottom",
        fill: t.colors.text.primary,
        fontSize: t.fontSize.sm,
        fontFamily: "sans-serif"
      },
      r
    )
  );
}, Ke = ae(qt);
Ke.displayName = "Message";
const Qt = ({ element: e }) => {
  const { theme: t } = F(), { width: n, height: s, style: o } = e;
  return v.createElement("rect", {
    width: n || 12,
    // Default narrow width
    height: s,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal
  });
}, je = ae(Qt);
je.displayName = "ActivationBar";
const be = {
  rectangle: Ie,
  ellipse: he,
  circle: he,
  diamond: Ue,
  text: Xe,
  line: He,
  actor: Ve,
  lifeline: Fe,
  message: Ke,
  activationBar: je,
  // Default fallback for custom types
  custom: Ie
}, Ge = ie(
  ({
    width: e,
    height: t,
    className: n,
    style: s,
    showGrid: o,
    gridSize: r,
    onCanvasClick: a,
    onCanvasDoubleClick: l,
    children: u
  }, g) => {
    const { elements: h, config: x } = ge(), { clearSelection: w } = we(), { viewport: f } = de(), { theme: E } = F(), i = e ?? x.width, R = t ?? x.height, k = o ?? x.grid?.visible, d = r ?? x.grid?.size ?? 20, I = Z(() => Te(h), [h]), y = c(
      (T) => {
        T.target === T.currentTarget && (w(), a?.(T));
      },
      [w, a]
    ), p = () => {
      if (!k) return null;
      const T = "canvas-grid-pattern";
      return v.createElement(
        v.Fragment,
        null,
        v.createElement(
          "defs",
          null,
          v.createElement(
            "pattern",
            {
              id: T,
              width: d,
              height: d,
              patternUnits: "userSpaceOnUse"
            },
            v.createElement("path", {
              d: `M ${d} 0 L 0 0 0 ${d}`,
              fill: "none",
              stroke: E.colors.grid.line,
              strokeWidth: 0.5
            })
          )
        ),
        v.createElement("rect", {
          width: "100%",
          height: "100%",
          fill: `url(#${T})`
        })
      );
    }, S = (T) => {
      const D = be[T.type] ?? be.custom;
      return v.createElement(D, {
        key: T.id,
        element: T
      });
    };
    return v.createElement(
      "svg",
      {
        ref: g,
        className: pe("canvas-drawing", n),
        width: i,
        height: R,
        viewBox: `0 0 ${i} ${R}`,
        style: {
          backgroundColor: E.colors.background,
          cursor: "default",
          userSelect: "none",
          ...s
        },
        onClick: y,
        onDoubleClick: l
      },
      // Transform group for zoom and pan
      v.createElement(
        "g",
        {
          transform: `translate(${f.pan.x}, ${f.pan.y}) scale(${f.zoom})`
        },
        // Grid
        p(),
        // Elements
        I.map(S),
        // Additional children (e.g., selection boxes, connection handles)
        u
      )
    );
  }
);
Ge.displayName = "DrawingCanvas";
const Je = ie(
  ({
    width: e,
    height: t,
    readonly: n = !1,
    showGrid: s,
    gridSize: o,
    enableKeyboardShortcuts: r = !0,
    className: a,
    style: l,
    children: u
  }, g) => {
    const h = re(null), x = ge(), w = we(), f = de(), E = Ut();
    return Zt(
      r ? {
        undo: E.undo,
        redo: E.redo,
        delete: E.removeSelected,
        selectAll: () => w.selectAll(x.elements.map((i) => i.id)),
        copy: E.copy,
        paste: E.paste,
        cut: E.cut,
        escape: w.clearSelection,
        zoomIn: f.zoomIn,
        zoomOut: f.zoomOut,
        resetZoom: f.resetViewport
      } : {}
    ), dt(
      g,
      () => ({
        addElement: E.addElement,
        updateElement: E.updateElement,
        removeElement: E.removeElement,
        getElement: x.getElementById,
        getElementsByType: x.getElementsByType,
        select: w.select,
        selectMultiple: w.selectMultiple,
        clearSelection: w.clearSelection,
        getSelectedIds: () => w.selectedIds,
        zoomIn: f.zoomIn,
        zoomOut: f.zoomOut,
        setZoom: f.setZoom,
        resetViewport: f.resetViewport,
        undo: E.undo,
        redo: E.redo,
        canUndo: E.canUndo,
        canRedo: E.canRedo,
        toJSON: () => ({
          elements: x.elements,
          connections: x.connections
        }),
        toSVG: () => h.current?.outerHTML ?? ""
      }),
      [x, w, f, E]
    ), /* @__PURE__ */ ut(
      "div",
      {
        className: pe("canvas-container", a, {
          "canvas-container--readonly": n
        }),
        style: {
          position: "relative",
          overflow: "hidden",
          ...l
        },
        tabIndex: 0,
        children: [
          /* @__PURE__ */ te(
            Ge,
            {
              ref: h,
              width: e,
              height: t,
              showGrid: s,
              gridSize: o
            }
          ),
          u
        ]
      }
    );
  }
);
Je.displayName = "CanvasInner";
const en = ie(
  ({
    elements: e,
    connections: t,
    selectedIds: n,
    defaultElements: s = [],
    defaultConnections: o = [],
    config: r,
    theme: a = "light",
    initialViewport: l,
    maxHistorySize: u,
    onChange: g,
    onSelectionChange: h,
    ...x
  }, w) => /* @__PURE__ */ te(
    Pt,
    {
      initialElements: s,
      initialConnections: o,
      elements: e,
      connections: t,
      selectedIds: n,
      config: r,
      theme: a,
      initialViewport: l,
      maxHistorySize: u,
      onElementsChange: g,
      onSelectionChange: h,
      children: /* @__PURE__ */ te(Je, { ...x, ref: w })
    }
  )
);
en.displayName = "Canvas";
const Ne = {
  rectangle: { width: 120, height: 80 },
  ellipse: { width: 120, height: 80 },
  circle: { width: 80, height: 80 },
  diamond: { width: 100, height: 100 },
  text: { width: 100, height: 30 },
  line: { width: 100, height: 2 },
  actor: { width: 60, height: 100 },
  lifeline: { width: 100, height: 300 },
  message: { width: 150, height: 30 },
  activationBar: { width: 12, height: 60 },
  custom: { width: 100, height: 100 }
}, J = (e, t = {}) => {
  const n = Ne[e] ?? Ne.custom;
  return {
    id: t.id ?? Ee(),
    type: e,
    x: t.x ?? 0,
    y: t.y ?? 0,
    width: t.width ?? n.width,
    height: t.height ?? n.height,
    zIndex: t.zIndex ?? 0,
    style: t.style,
    locked: t.locked ?? !1,
    visible: t.visible ?? !0,
    data: t.data
  };
}, qe = (e = {}) => J("rectangle", e), Qe = (e = {}) => J("ellipse", e), et = (e = {}) => {
  const t = e.width ?? e.height ?? 80;
  return J("circle", { ...e, width: t, height: t });
}, tt = (e = {}) => J("diamond", e), nt = (e = {}) => {
  const { text: t, fontSize: n, fontFamily: s, fontWeight: o, textAlign: r, ...a } = e;
  return {
    ...J("text", a),
    type: "text",
    text: t ?? "",
    fontSize: n,
    fontFamily: s,
    fontWeight: o,
    textAlign: r
  };
}, ot = (e = {}) => {
  const { points: t, lineType: n, x: s, y: o, ...r } = e, a = r.width ?? 100;
  let l = t ?? [
    { x: s ?? 0, y: o ?? 0 },
    { x: (s ?? 0) + a, y: o ?? 0 }
  ];
  const u = l.map((y) => y.x), g = l.map((y) => y.y), h = Math.min(...u), x = Math.min(...g), w = Math.max(...u), f = Math.max(...g), E = l.map((y) => ({
    x: y.x - h,
    y: y.y - x
  })), i = w - h, R = f - x, k = Math.max(i, 10), d = Math.max(R, 10), I = E.map((y) => ({
    x: i < 10 ? y.x + (10 - i) / 2 : y.x,
    y: R < 10 ? y.y + (10 - R) / 2 : y.y
  }));
  return {
    ...J("line", {
      ...r,
      x: i < 10 ? h - (10 - i) / 2 : h,
      y: R < 10 ? x - (10 - R) / 2 : x,
      width: k,
      height: d
    }),
    type: "line",
    points: I,
    lineType: n ?? "solid"
  };
}, st = (e = {}) => {
  const { label: t, ...n } = e;
  return {
    ...J("actor", n),
    type: "actor",
    label: t
  };
}, rt = (e = {}) => {
  const { label: t, ...n } = e;
  return {
    ...J("lifeline", n),
    type: "lifeline",
    label: t
  };
}, at = (e = {}) => {
  const { label: t, messageType: n, fromId: s, toId: o, ...r } = e;
  return {
    ...J("message", r),
    type: "message",
    label: t,
    messageType: n ?? "sync",
    fromId: s,
    toId: o
  };
}, ct = (e = {}) => J("activationBar", e), tn = (e, t = {}) => {
  switch (e) {
    case "rectangle":
      return qe(t);
    case "ellipse":
      return Qe(t);
    case "circle":
      return et(t);
    case "diamond":
      return tt(t);
    case "text":
      return nt(t);
    case "line":
      return ot(t);
    case "actor":
      return st(t);
    case "lifeline":
      return rt(t);
    case "message":
      return at(t);
    case "activationBar":
      return ct(t);
    default:
      return J(e, t);
  }
}, yn = {
  create: tn,
  rectangle: qe,
  ellipse: Qe,
  circle: et,
  diamond: tt,
  text: nt,
  line: ot,
  actor: st,
  lifeline: rt,
  message: at,
  activationBar: ct
};
export {
  je as ActivationBar,
  Ve as Actor,
  en as Canvas,
  Lt as CanvasProvider,
  Vt as Circle,
  Pt as CombinedCanvasProvider,
  Ue as Diamond,
  Ge as DrawingCanvas,
  Ze as ElementBase,
  yn as ElementFactory,
  he as Ellipse,
  At as HistoryProvider,
  Fe as Lifeline,
  He as Line,
  Ke as Message,
  Ft as Oval,
  Ie as Rectangle,
  Nt as SelectionProvider,
  Xe as TextElement,
  It as ThemeProvider,
  Mt as ViewportProvider,
  an as boundsIntersect,
  pt as bringToFront,
  ct as createActivationBar,
  st as createActor,
  et as createCircle,
  tt as createDiamond,
  tn as createElement,
  Qe as createEllipse,
  rt as createLifeline,
  ot as createLine,
  at as createMessage,
  qe as createRectangle,
  nt as createText,
  pe as cx,
  Rt as darkTheme,
  De as deepMerge,
  dn as deserializeFromJSON,
  sn as distance,
  hn as downloadAsFile,
  un as exportToSVG,
  Ee as generateId,
  ht as getResizeHandles,
  mn as getThemeCSSVariables,
  rn as isPointInBounds,
  ce as lightTheme,
  gt as sendToBack,
  ln as serializeToJSON,
  cn as snapToGrid,
  Te as sortByZIndex,
  ge as useCanvas,
  Ut as useCanvasActions,
  Zt as useCanvasKeyboardShortcuts,
  $e as useDraggable,
  Ct as useHistory,
  Wt as useKeyboard,
  $t as useResizable,
  Be as useRotatable,
  We as useSelectable,
  we as useSelection,
  F as useTheme,
  de as useViewport,
  xt as validateCanvasData,
  ae as withElementBehavior
};
//# sourceMappingURL=index.js.map
