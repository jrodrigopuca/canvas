import y, { useMemo as V, useContext as Y, createContext as G, useReducer as Q, useCallback as c, useState as ue, useRef as H, useEffect as Ze, forwardRef as J, useImperativeHandle as Ue } from "react";
import { jsx as W, jsxs as Ve } from "react/jsx-runtime";
const q = () => typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`, ee = (...e) => {
  const t = [];
  for (const n of e)
    if (n) {
      if (typeof n == "string" || typeof n == "number")
        t.push(String(n));
      else if (Array.isArray(n)) {
        const s = ee(...n);
        s && t.push(s);
      } else if (typeof n == "object")
        for (const [s, o] of Object.entries(n))
          o && t.push(s);
    }
  return t.join(" ");
};
function me(e, t) {
  const n = { ...e };
  for (const s in t)
    if (Object.prototype.hasOwnProperty.call(t, s)) {
      const o = t[s], r = e[s];
      o !== null && typeof o == "object" && !Array.isArray(o) && r !== null && typeof r == "object" && !Array.isArray(r) ? n[s] = me(
        r,
        o
      ) : o !== void 0 && (n[s] = o);
    }
  return n;
}
const Bt = (e, t) => {
  const n = t.x - e.x, s = t.y - e.y;
  return Math.sqrt(n * n + s * s);
}, Wt = (e, t) => e.x >= t.x && e.x <= t.x + t.width && e.y >= t.y && e.y <= t.y + t.height, Zt = (e, t) => !(e.x + e.width < t.x || t.x + t.width < e.x || e.y + e.height < t.y || t.y + t.height < e.y), Ut = (e, t) => Math.round(e / t) * t, Fe = (e, t) => {
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
}, ie = (e) => [...e].sort((t, n) => t.zIndex - n.zIndex), He = (e) => e.length === 0 ? 0 : Math.max(...e.map((t) => t.zIndex)), je = (e) => e.length === 0 ? 0 : Math.min(...e.map((t) => t.zIndex)), Ke = (e, t) => {
  const n = He(e);
  return e.map(
    (s) => s.id === t ? { ...s, zIndex: n + 1 } : s
  );
}, Xe = (e, t) => {
  const n = je(e);
  return e.map(
    (s) => s.id === t ? { ...s, zIndex: n - 1 } : s
  );
}, Ye = (e, t) => {
  const n = ie(e), s = n.findIndex((a) => a.id === t);
  if (s === -1 || s === n.length - 1) return e;
  const o = n[s], r = n[s + 1];
  return e.map((a) => a.id === o.id ? { ...a, zIndex: r.zIndex + 1 } : a);
}, Ge = (e, t) => {
  const n = ie(e), s = n.findIndex((a) => a.id === t);
  if (s <= 0) return e;
  const o = n[s], r = n[s - 1];
  return e.map((a) => a.id === o.id ? { ...a, zIndex: r.zIndex - 1 } : a);
}, Je = (e) => {
  const t = [];
  if (!e || typeof e != "object")
    return { valid: !1, errors: ["Data must be an object"] };
  const n = e;
  return typeof n.version != "string" && t.push("Missing or invalid version field"), Array.isArray(n.elements) ? n.elements.forEach((s, o) => {
    const r = qe(s, o);
    t.push(...r);
  }) : t.push("Elements must be an array"), Array.isArray(n.connections) ? n.connections.forEach((s, o) => {
    const r = Qe(s, o);
    t.push(...r);
  }) : t.push("Connections must be an array"), {
    valid: t.length === 0,
    errors: t
  };
}, qe = (e, t) => {
  const n = [], s = `Element[${t}]`;
  if (!e || typeof e != "object")
    return [`${s}: Must be an object`];
  const o = e;
  return (typeof o.id != "string" || o.id.length === 0) && n.push(`${s}: Missing or invalid id`), (typeof o.type != "string" || o.type.length === 0) && n.push(`${s}: Missing or invalid type`), (typeof o.x != "number" || isNaN(o.x)) && n.push(`${s}: Missing or invalid x coordinate`), (typeof o.y != "number" || isNaN(o.y)) && n.push(`${s}: Missing or invalid y coordinate`), (typeof o.width != "number" || isNaN(o.width) || o.width < 0) && n.push(`${s}: Missing or invalid width`), (typeof o.height != "number" || isNaN(o.height) || o.height < 0) && n.push(`${s}: Missing or invalid height`), (typeof o.zIndex != "number" || isNaN(o.zIndex)) && n.push(`${s}: Missing or invalid zIndex`), n;
}, Qe = (e, t) => {
  const n = [], s = `Connection[${t}]`;
  if (!e || typeof e != "object")
    return [`${s}: Must be an object`];
  const o = e;
  return (typeof o.id != "string" || o.id.length === 0) && n.push(`${s}: Missing or invalid id`), (typeof o.fromId != "string" || o.fromId.length === 0) && n.push(`${s}: Missing or invalid fromId`), (typeof o.toId != "string" || o.toId.length === 0) && n.push(`${s}: Missing or invalid toId`), n;
}, et = "1.0.0", Vt = (e, t, n) => JSON.stringify({
  version: et,
  elements: e,
  connections: t,
  metadata: n
}, null, 2), Ft = (e) => {
  const t = JSON.parse(e), n = Je(t);
  if (!n.valid)
    throw new Error(`Invalid canvas data: ${n.errors.join(", ")}`);
  return t;
}, Ht = (e, t) => {
  const n = e.cloneNode(!0);
  if (n.getAttribute("xmlns") || n.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t?.includeStyles) {
    const o = document.createElement("style");
    o.textContent = tt(e), n.insertBefore(o, n.firstChild);
  }
  return new XMLSerializer().serializeToString(n);
}, tt = (e) => {
  const t = /* @__PURE__ */ new Set();
  return e.querySelectorAll("*").forEach((n) => t.add(n.tagName.toLowerCase())), `
    svg { font-family: system-ui, sans-serif; }
    text { user-select: none; }
  `;
}, jt = (e, t, n) => {
  const s = new Blob([e], { type: n }), o = URL.createObjectURL(s), r = document.createElement("a");
  r.href = o, r.download = t, document.body.appendChild(r), r.click(), document.body.removeChild(r), URL.revokeObjectURL(o);
}, F = {
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
}, nt = {
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
  spacing: F.spacing,
  borderRadius: F.borderRadius,
  fontSize: F.fontSize,
  strokeWidth: F.strokeWidth,
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.3)",
    md: "0 4px 6px rgba(0,0,0,0.4)",
    lg: "0 10px 15px rgba(0,0,0,0.5)",
    element: "0 2px 4px rgba(0,0,0,0.3)",
    handle: "0 1px 2px rgba(0,0,0,0.3)"
  }
}, pe = G({
  theme: F,
  themeName: "light"
}), $ = () => {
  const e = Y(pe);
  if (!e)
    throw new Error("useTheme must be used within a ThemeProvider");
  return e;
}, st = ({ children: e, theme: t = "light" }) => {
  const n = V(() => t === "light" ? { theme: F, themeName: "light" } : t === "dark" ? { theme: nt, themeName: "dark" } : {
    theme: me(F, t),
    themeName: "custom"
  }, [t]);
  return y.createElement(pe.Provider, { value: n }, e);
}, Kt = (e) => ({
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
}), he = {
  zoom: 1,
  pan: { x: 0, y: 0 },
  minZoom: 0.1,
  maxZoom: 5
}, ot = (e, t) => {
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
      return { ...he, minZoom: e.minZoom, maxZoom: e.maxZoom };
    case "SET_CONSTRAINTS":
      return {
        ...e,
        minZoom: t.payload.minZoom ?? e.minZoom,
        maxZoom: t.payload.maxZoom ?? e.maxZoom
      };
    default:
      return e;
  }
}, ye = G(null), te = () => {
  const e = Y(ye);
  if (!e)
    throw new Error("useViewport must be used within a ViewportProvider");
  return e;
}, rt = ({
  children: e,
  initialViewport: t
}) => {
  const [n, s] = Q(ot, {
    ...he,
    ...t
  }), o = c((i) => {
    s({ type: "SET_ZOOM", payload: i });
  }, []), r = c(() => {
    s({ type: "ZOOM_IN" });
  }, []), a = c(() => {
    s({ type: "ZOOM_OUT" });
  }, []), l = c((i, C) => {
    s({ type: "ZOOM_TO_FIT", payload: { bounds: i, padding: C } });
  }, []), d = c((i) => {
    s({ type: "SET_PAN", payload: i });
  }, []), m = c((i) => {
    s({ type: "PAN_BY", payload: i });
  }, []), u = c(() => {
    s({ type: "RESET" });
  }, []), f = c(
    (i) => {
      s({ type: "SET_CONSTRAINTS", payload: i });
    },
    []
  ), v = c(
    (i) => ({
      x: (i.x - n.pan.x) / n.zoom,
      y: (i.y - n.pan.y) / n.zoom
    }),
    [n.zoom, n.pan]
  ), g = c(
    (i) => ({
      x: i.x * n.zoom + n.pan.x,
      y: i.y * n.zoom + n.pan.y
    }),
    [n.zoom, n.pan]
  ), p = V(
    () => ({
      viewport: n,
      setZoom: o,
      zoomIn: r,
      zoomOut: a,
      zoomToFit: l,
      setPan: d,
      panBy: m,
      resetViewport: u,
      setConstraints: f,
      screenToCanvas: v,
      canvasToScreen: g
    }),
    [
      n,
      o,
      r,
      a,
      l,
      d,
      m,
      u,
      f,
      v,
      g
    ]
  );
  return y.createElement(ye.Provider, { value: p }, e);
}, at = {
  selectedIds: /* @__PURE__ */ new Set(),
  lastSelectedId: null
}, ct = (e, t) => {
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
      return at;
    case "SELECT_ALL":
      return {
        selectedIds: new Set(t.payload),
        lastSelectedId: t.payload.length > 0 ? t.payload[t.payload.length - 1] : null
      };
    default:
      return e;
  }
}, fe = G(null), ne = () => {
  const e = Y(fe);
  if (!e)
    throw new Error("useSelection must be used within a SelectionProvider");
  return e;
}, it = ({
  children: e,
  initialSelection: t,
  onSelectionChange: n
}) => {
  const [s, o] = Q(ct, {
    selectedIds: new Set(t ?? []),
    lastSelectedId: t?.[t.length - 1] ?? null
  }), r = V(() => Array.from(s.selectedIds), [s.selectedIds]);
  y.useEffect(() => {
    n?.(r);
  }, [r, n]);
  const a = c(
    (i) => s.selectedIds.has(i),
    [s.selectedIds]
  ), l = c((i) => {
    o({ type: "SELECT", payload: i });
  }, []), d = c((i) => {
    o({ type: "SELECT_MULTIPLE", payload: i });
  }, []), m = c((i) => {
    o({ type: "ADD_TO_SELECTION", payload: i });
  }, []), u = c((i) => {
    o({ type: "REMOVE_FROM_SELECTION", payload: i });
  }, []), f = c((i) => {
    o({ type: "TOGGLE_SELECTION", payload: i });
  }, []), v = c(() => {
    o({ type: "CLEAR_SELECTION" });
  }, []), g = c((i) => {
    o({ type: "SELECT_ALL", payload: i });
  }, []), p = V(
    () => ({
      selectedIds: r,
      lastSelectedId: s.lastSelectedId,
      selectionCount: s.selectedIds.size,
      hasSelection: s.selectedIds.size > 0,
      isSelected: a,
      select: l,
      selectMultiple: d,
      addToSelection: m,
      removeFromSelection: u,
      toggleSelection: f,
      clearSelection: v,
      selectAll: g
    }),
    [
      r,
      s.lastSelectedId,
      s.selectedIds.size,
      a,
      l,
      d,
      m,
      u,
      f,
      v,
      g
    ]
  );
  return y.createElement(fe.Provider, { value: p }, e);
}, lt = (e, t) => {
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
}, ge = G(null), dt = () => {
  const e = Y(ge);
  if (!e)
    throw new Error("useHistory must be used within a HistoryProvider");
  return e;
}, ut = ({
  children: e,
  initialElements: t = [],
  initialConnections: n = [],
  maxHistorySize: s = 50,
  onStateChange: o
}) => {
  const [r, a] = Q(lt, {
    past: [],
    present: {
      elements: t,
      connections: n,
      timestamp: Date.now()
    },
    future: [],
    maxHistorySize: s
  });
  y.useEffect(() => {
    o?.(r.present.elements, r.present.connections);
  }, [r.present, o]);
  const l = c((p, i) => {
    a({
      type: "PUSH",
      payload: {
        elements: p,
        connections: i,
        timestamp: Date.now()
      }
    });
  }, []), d = c(() => {
    a({ type: "UNDO" });
  }, []), m = c(() => {
    a({ type: "REDO" });
  }, []), u = c(() => {
    a({ type: "CLEAR" });
  }, []), f = c((p, i) => {
    a({
      type: "SET_PRESENT",
      payload: {
        elements: p,
        connections: i,
        timestamp: Date.now()
      }
    });
  }, []), v = c((p) => {
    a({ type: "SET_MAX_SIZE", payload: p });
  }, []), g = V(
    () => ({
      canUndo: r.past.length > 0,
      canRedo: r.future.length > 0,
      historySize: r.past.length,
      futureSize: r.future.length,
      present: r.present,
      pushState: l,
      undo: d,
      redo: m,
      clearHistory: u,
      setPresent: f,
      setMaxHistorySize: v
    }),
    [r.past.length, r.future.length, r.present, l, d, m, u, f, v]
  );
  return y.createElement(ge.Provider, { value: g }, e);
}, mt = {
  width: 800,
  height: 600,
  grid: {
    enabled: !1,
    size: 20,
    snap: !1,
    visible: !1
  },
  readonly: !1
}, pt = (e, t) => {
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
        elements: Ke(e.elements, t.payload)
      };
    case "SEND_TO_BACK":
      return {
        ...e,
        elements: Xe(e.elements, t.payload)
      };
    case "MOVE_UP":
      return {
        ...e,
        elements: Ye(e.elements, t.payload)
      };
    case "MOVE_DOWN":
      return {
        ...e,
        elements: Ge(e.elements, t.payload)
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
}, Ee = G(null), se = () => {
  const e = Y(Ee);
  if (!e)
    throw new Error("useCanvas must be used within a CanvasProvider");
  return e;
}, ht = ({
  children: e,
  initialElements: t = [],
  initialConnections: n = [],
  config: s,
  onChange: o
}) => {
  const [r, a] = Q(pt, {
    elements: t,
    connections: n,
    config: { ...mt, ...s }
  });
  y.useEffect(() => {
    o?.(r.elements, r.connections);
  }, [r.elements, r.connections, o]);
  const l = c(
    (x) => r.elements.find((z) => z.id === x),
    [r.elements]
  ), d = c(
    (x) => r.elements.filter((z) => z.type === x),
    [r.elements]
  ), m = c(
    (x) => {
      const z = x.id ?? q(), L = r.elements.length > 0 ? Math.max(...r.elements.map((D) => D.zIndex)) : 0;
      return a({
        type: "ADD_ELEMENT",
        payload: { ...x, id: z, zIndex: x.zIndex ?? L + 1 }
      }), z;
    },
    [r.elements]
  ), u = c(
    (x) => {
      const z = r.elements.length > 0 ? Math.max(...r.elements.map((D) => D.zIndex)) : 0, L = x.map((D, j) => ({
        ...D,
        id: D.id ?? q(),
        zIndex: D.zIndex ?? z + 1 + j
      }));
      return a({ type: "ADD_ELEMENTS", payload: L }), L.map((D) => D.id);
    },
    [r.elements]
  ), f = c((x, z) => {
    a({ type: "UPDATE_ELEMENT", payload: { id: x, updates: z } });
  }, []), v = c((x, z) => {
    a({ type: "UPDATE_ELEMENTS", payload: { ids: x, updates: z } });
  }, []), g = c((x) => {
    a({ type: "REMOVE_ELEMENT", payload: x });
  }, []), p = c((x) => {
    a({ type: "REMOVE_ELEMENTS", payload: x });
  }, []), i = c((x, z, L) => {
    a({ type: "MOVE_ELEMENT", payload: { id: x, x: z, y: L } });
  }, []), C = c((x, z, L) => {
    a({ type: "MOVE_ELEMENTS", payload: { ids: x, deltaX: z, deltaY: L } });
  }, []), w = c(
    (x, z, L, D, j) => {
      a({ type: "RESIZE_ELEMENT", payload: { id: x, width: z, height: L, x: D, y: j } });
    },
    []
  ), E = c((x) => {
    a({ type: "BRING_TO_FRONT", payload: x });
  }, []), T = c((x) => {
    a({ type: "SEND_TO_BACK", payload: x });
  }, []), I = c((x) => {
    a({ type: "MOVE_UP", payload: x });
  }, []), S = c((x) => {
    a({ type: "MOVE_DOWN", payload: x });
  }, []), h = c((x) => {
    a({ type: "SET_ELEMENTS", payload: x });
  }, []), b = c(
    (x) => r.connections.find((z) => z.id === x),
    [r.connections]
  ), O = c(
    (x) => r.connections.filter(
      (z) => z.fromId === x || z.toId === x
    ),
    [r.connections]
  ), M = c(
    (x) => {
      const z = x.id ?? q();
      return a({
        type: "ADD_CONNECTION",
        payload: { ...x, id: z }
      }), z;
    },
    []
  ), A = c((x, z) => {
    a({ type: "UPDATE_CONNECTION", payload: { id: x, updates: z } });
  }, []), k = c((x) => {
    a({ type: "REMOVE_CONNECTION", payload: x });
  }, []), N = c((x) => {
    a({ type: "SET_CONNECTIONS", payload: x });
  }, []), R = c((x) => {
    a({ type: "UPDATE_CONFIG", payload: x });
  }, []), _ = c(() => {
    a({ type: "CLEAR_CANVAS" });
  }, []), Z = c((x, z) => {
    a({ type: "LOAD_STATE", payload: { elements: x, connections: z } });
  }, []), oe = V(
    () => ({
      elements: r.elements,
      connections: r.connections,
      config: r.config,
      getElementById: l,
      getElementsByType: d,
      addElement: m,
      addElements: u,
      updateElement: f,
      updateElements: v,
      removeElement: g,
      removeElements: p,
      moveElement: i,
      moveElements: C,
      resizeElement: w,
      bringToFront: E,
      sendToBack: T,
      moveUp: I,
      moveDown: S,
      setElements: h,
      getConnectionById: b,
      getConnectionsForElement: O,
      addConnection: M,
      updateConnection: A,
      removeConnection: k,
      setConnections: N,
      updateConfig: R,
      clearCanvas: _,
      loadState: Z
    }),
    [
      r.elements,
      r.connections,
      r.config,
      l,
      d,
      m,
      u,
      f,
      v,
      g,
      p,
      i,
      C,
      w,
      E,
      T,
      I,
      S,
      h,
      b,
      O,
      M,
      A,
      k,
      N,
      R,
      _,
      Z
    ]
  );
  return y.createElement(Ee.Provider, { value: oe }, e);
}, yt = ({
  children: e,
  initialElements: t = [],
  initialConnections: n = [],
  config: s,
  theme: o = "light",
  initialViewport: r,
  maxHistorySize: a = 50,
  onElementsChange: l,
  onSelectionChange: d,
  elements: m,
  connections: u,
  selectedIds: f
}) => {
  const v = m ?? t, g = u ?? n;
  return /* @__PURE__ */ W(st, { theme: o, children: /* @__PURE__ */ W(rt, { initialViewport: r, children: /* @__PURE__ */ W(
    it,
    {
      initialSelection: f,
      onSelectionChange: d,
      children: /* @__PURE__ */ W(
        ut,
        {
          initialElements: v,
          initialConnections: g,
          maxHistorySize: a,
          children: /* @__PURE__ */ W(
            ht,
            {
              initialElements: v,
              initialConnections: g,
              config: s,
              onChange: l,
              children: e
            }
          )
        }
      )
    }
  ) }) });
}, ft = (e = {}) => {
  const {
    onDragStart: t,
    onDrag: n,
    onDragEnd: s,
    disabled: o = !1,
    threshold: r = 3
  } = e, [a, l] = ue({
    isDragging: !1,
    startPosition: null,
    currentPosition: null,
    delta: { x: 0, y: 0 }
  }), d = H(null), m = H(!1), { screenToCanvas: u } = te(), f = c(
    (w) => {
      if ("touches" in w) {
        const E = w.touches[0] || w.changedTouches[0];
        return u({ x: E.clientX, y: E.clientY });
      }
      return u({ x: w.clientX, y: w.clientY });
    },
    [u]
  ), v = c(
    (w) => {
      if (!d.current) return;
      const E = f(w), T = {
        x: E.x - d.current.x,
        y: E.y - d.current.y
      };
      if (!m.current) {
        if (Math.sqrt(T.x ** 2 + T.y ** 2) < r) return;
        m.current = !0, t?.(d.current);
      }
      l({
        isDragging: !0,
        startPosition: d.current,
        currentPosition: E,
        delta: T
      }), n?.(E, T);
    },
    [f, r, t, n]
  ), g = c(
    (w) => {
      if (!d.current) return;
      const E = f(w), T = {
        x: E.x - d.current.x,
        y: E.y - d.current.y
      };
      m.current && s?.(E, T), l({
        isDragging: !1,
        startPosition: null,
        currentPosition: null,
        delta: { x: 0, y: 0 }
      }), d.current = null, m.current = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g), document.removeEventListener("touchmove", v), document.removeEventListener("touchend", g);
    },
    [f, v, s]
  ), p = c(
    (w, E) => {
      if (o) return;
      const T = u({ x: w, y: E });
      d.current = T, m.current = !1, l({
        isDragging: !1,
        startPosition: T,
        currentPosition: T,
        delta: { x: 0, y: 0 }
      }), document.addEventListener("mousemove", v), document.addEventListener("mouseup", g), document.addEventListener("touchmove", v, { passive: !1 }), document.addEventListener("touchend", g);
    },
    [o, u, v, g]
  ), i = c(
    (w) => {
      w.button === 0 && (w.preventDefault(), w.stopPropagation(), p(w.clientX, w.clientY));
    },
    [p]
  ), C = c(
    (w) => {
      if (w.touches.length !== 1) return;
      const E = w.touches[0];
      p(E.clientX, E.clientY);
    },
    [p]
  );
  return {
    dragState: a,
    handlers: {
      onMouseDown: i,
      onTouchStart: C
    },
    isDragging: a.isDragging
  };
}, gt = (e = {}) => {
  const {
    onResizeStart: t,
    onResize: n,
    onResizeEnd: s,
    disabled: o = !1,
    minWidth: r = 20,
    minHeight: a = 20,
    maxWidth: l = 1 / 0,
    maxHeight: d = 1 / 0,
    maintainAspectRatio: m = !1,
    aspectRatio: u
  } = e, [f, v] = ue({
    isResizing: !1,
    handle: null,
    startBounds: null,
    currentBounds: null
  }), g = H(null), { screenToCanvas: p } = te(), i = c(
    (I) => {
      if ("touches" in I) {
        const S = I.touches[0] || I.changedTouches[0];
        return p({ x: S.clientX, y: S.clientY });
      }
      return p({ x: I.clientX, y: I.clientY });
    },
    [p]
  ), C = c(
    (I) => {
      if (!g.current)
        return { x: 0, y: 0, width: 0, height: 0 };
      const { position: S, bounds: h, handle: b } = g.current, O = I.x - S.x, M = I.y - S.y;
      let A = h.x, k = h.y, N = h.width, R = h.height;
      switch (b) {
        case "nw":
          A = h.x + O, k = h.y + M, N = h.width - O, R = h.height - M;
          break;
        case "n":
          k = h.y + M, R = h.height - M;
          break;
        case "ne":
          k = h.y + M, N = h.width + O, R = h.height - M;
          break;
        case "e":
          N = h.width + O;
          break;
        case "se":
          N = h.width + O, R = h.height + M;
          break;
        case "s":
          R = h.height + M;
          break;
        case "sw":
          A = h.x + O, N = h.width - O, R = h.height + M;
          break;
        case "w":
          A = h.x + O, N = h.width - O;
          break;
      }
      if (N < r && (b.includes("w") && (A = h.x + h.width - r), N = r), R < a && (b.includes("n") && (k = h.y + h.height - a), R = a), N > l && (N = l), R > d && (R = d), m && g.current.aspectRatio) {
        const _ = g.current.aspectRatio;
        N / R > _ ? N = R * _ : R = N / _;
      }
      return { x: A, y: k, width: N, height: R };
    },
    [r, a, l, d, m]
  ), w = c(
    (I) => {
      if (!g.current) return;
      const S = i(I), h = C(S);
      v((b) => ({
        ...b,
        currentBounds: h
      })), n?.(h);
    },
    [i, C, n]
  ), E = c(
    (I) => {
      if (!g.current) return;
      const S = i(I), h = C(S);
      s?.(h), v({
        isResizing: !1,
        handle: null,
        startBounds: null,
        currentBounds: null
      }), g.current = null, document.removeEventListener("mousemove", w), document.removeEventListener("mouseup", E), document.removeEventListener("touchmove", w), document.removeEventListener("touchend", E);
    },
    [i, C, w, s]
  ), T = c(
    (I, S, h) => {
      if (o) return;
      h.preventDefault(), h.stopPropagation();
      const b = "touches" in h ? h.touches[0].clientX : h.clientX, O = "touches" in h ? h.touches[0].clientY : h.clientY, M = p({ x: b, y: O });
      g.current = {
        position: M,
        bounds: S,
        handle: I,
        aspectRatio: u ?? S.width / S.height
      }, v({
        isResizing: !0,
        handle: I,
        startBounds: S,
        currentBounds: S
      }), t?.(I), document.addEventListener("mousemove", w), document.addEventListener("mouseup", E), document.addEventListener("touchmove", w, { passive: !1 }), document.addEventListener("touchend", E);
    },
    [
      o,
      p,
      u,
      t,
      w,
      E
    ]
  );
  return {
    resizeState: f,
    startResize: T,
    isResizing: f.isResizing
  };
}, Et = (e) => {
  const { id: t, disabled: n = !1, onSelect: s } = e, {
    isSelected: o,
    select: r,
    addToSelection: a,
    removeFromSelection: l,
    toggleSelection: d,
    clearSelection: m
  } = ne(), u = o(t), f = c(() => {
    n || (r(t), s?.(!0));
  }, [n, t, r, s]), v = c(() => {
    n || (l(t), s?.(!1));
  }, [n, t, l, s]), g = c(() => {
    if (n) return;
    const i = !u;
    d(t), s?.(i);
  }, [n, t, u, d, s]), p = c(
    (i) => {
      n || (i.stopPropagation(), i.ctrlKey || i.metaKey ? (d(t), s?.(!u)) : i.shiftKey ? (a(t), s?.(!0)) : (r(t), s?.(!0)));
    },
    [
      n,
      t,
      u,
      d,
      a,
      r,
      s
    ]
  );
  return {
    isSelected: u,
    handlers: {
      onClick: p
    },
    select: f,
    deselect: v,
    toggle: g
  };
}, xt = (e, t) => {
  const n = e.key.toLowerCase() === t.key.toLowerCase();
  t.ctrl ? e.ctrlKey : !e.ctrlKey || t.meta, t.meta ? e.metaKey : !e.metaKey || t.ctrl;
  const s = t.shift ? e.shiftKey : !e.shiftKey, o = t.alt ? e.altKey : !e.altKey, r = t.ctrl || t.meta ? !!(t.ctrl && (e.ctrlKey || e.metaKey)) || !!(t.meta && e.metaKey) : !e.ctrlKey && !e.metaKey;
  return n && r && s && o;
}, vt = (e = {}) => {
  const { shortcuts: t = [], enabled: n = !0, targetRef: s } = e, o = H(t);
  o.current = t;
  const r = c(
    (a) => {
      if (n) {
        for (const l of o.current)
          if (xt(a, l)) {
            l.preventDefault !== !1 && a.preventDefault(), l.action();
            return;
          }
      }
    },
    [n]
  );
  Ze(() => {
    const a = s?.current ?? document;
    return a.addEventListener("keydown", r), () => {
      a.removeEventListener("keydown", r);
    };
  }, [r, s]);
}, wt = (e) => {
  const t = [];
  e.undo && t.push({ key: "z", ctrl: !0, action: e.undo }), e.redo && (t.push({ key: "z", ctrl: !0, shift: !0, action: e.redo }), t.push({ key: "y", ctrl: !0, action: e.redo })), e.delete && (t.push({ key: "Delete", action: e.delete }), t.push({ key: "Backspace", action: e.delete })), e.selectAll && t.push({ key: "a", ctrl: !0, action: e.selectAll }), e.copy && t.push({ key: "c", ctrl: !0, action: e.copy }), e.paste && t.push({ key: "v", ctrl: !0, action: e.paste }), e.cut && t.push({ key: "x", ctrl: !0, action: e.cut }), e.escape && t.push({ key: "Escape", action: e.escape }), e.zoomIn && (t.push({ key: "+", ctrl: !0, action: e.zoomIn }), t.push({ key: "=", ctrl: !0, action: e.zoomIn })), e.zoomOut && t.push({ key: "-", ctrl: !0, action: e.zoomOut }), e.resetZoom && t.push({ key: "0", ctrl: !0, action: e.resetZoom }), vt({ shortcuts: t });
}, St = () => {
  const e = se(), t = ne(), n = dt(), s = H(null), o = c(() => {
    n.pushState(e.elements, e.connections);
  }, [n, e.elements, e.connections]), r = c(
    (E) => (o(), e.addElement(E)),
    [e, o]
  ), a = c(
    (E, T) => {
      o(), e.updateElement(E, T);
    },
    [e, o]
  ), l = c(
    (E) => {
      o(), e.removeElement(E);
    },
    [e, o]
  ), d = c(() => {
    t.selectedIds.length !== 0 && (o(), e.removeElements(t.selectedIds), t.clearSelection());
  }, [e, t, o]), m = c(
    (E, T) => {
      t.selectedIds.length !== 0 && (o(), e.moveElements(t.selectedIds, E, T));
    },
    [e, t, o]
  ), u = c(() => {
    if (t.selectedIds.length === 0) return [];
    o();
    const T = e.elements.filter(
      (S) => t.selectedIds.includes(S.id)
    ).map((S) => ({
      ...S,
      id: void 0,
      // Will be auto-generated
      x: S.x + 20,
      y: S.y + 20
    })), I = e.addElements(T);
    return t.selectMultiple(I), I;
  }, [e, t, o]), f = c(
    (E) => (o(), e.addConnection(E)),
    [e, o]
  ), v = c(
    (E) => {
      o(), e.removeConnection(E);
    },
    [e, o]
  ), g = c(() => {
    if (t.selectedIds.length === 0) return;
    const E = e.elements.filter(
      (S) => t.selectedIds.includes(S.id)
    ), T = new Set(t.selectedIds), I = e.connections.filter(
      (S) => T.has(S.fromId) && T.has(S.toId)
    );
    s.current = {
      elements: E,
      connections: I
    };
  }, [e.elements, e.connections, t.selectedIds]), p = c(() => {
    g(), d();
  }, [g, d]), i = c(() => {
    if (!s.current) return;
    o();
    const E = /* @__PURE__ */ new Map(), T = s.current.elements.map((S) => ({
      ...S,
      id: void 0,
      x: S.x + 20,
      y: S.y + 20
    })), I = e.addElements(T);
    s.current.elements.forEach((S, h) => {
      E.set(S.id, I[h]);
    }), s.current.connections.forEach((S) => {
      const h = E.get(S.fromId), b = E.get(S.toId);
      h && b && e.addConnection({
        ...S,
        id: void 0,
        fromId: h,
        toId: b
      });
    }), t.selectMultiple(I);
  }, [e, t, o]), C = c(() => {
    n.canUndo && (n.undo(), e.loadState(n.present.elements, n.present.connections));
  }, [n, e]), w = c(() => {
    n.canRedo && (n.redo(), e.loadState(n.present.elements, n.present.connections));
  }, [n, e]);
  return {
    addElement: r,
    updateElement: a,
    removeElement: l,
    removeSelected: d,
    moveSelected: m,
    duplicateSelected: u,
    addConnection: f,
    removeConnection: v,
    copy: g,
    cut: p,
    paste: i,
    hasCopied: s.current !== null,
    undo: C,
    redo: w,
    canUndo: n.canUndo,
    canRedo: n.canRedo
  };
}, ae = 8, xe = J(
  ({
    element: e,
    children: t,
    className: n,
    style: s,
    disabled: o = !1,
    showHandles: r = !0,
    onSelect: a,
    onDragStart: l,
    onDrag: d,
    onDragEnd: m,
    onResizeStart: u,
    onResize: f,
    onResizeEnd: v
  }, g) => {
    const { updateElement: p } = se(), { theme: i } = $(), C = e.locked || o, { isSelected: w, handlers: E } = Et({
      id: e.id,
      disabled: C,
      onSelect: a
    }), { isDragging: T, handlers: I } = ft({
      disabled: C || !w,
      onDragStart: () => {
        l?.();
      },
      onDrag: (k, N) => {
        const R = e.x + N.x, _ = e.y + N.y;
        d?.(R, _);
      },
      onDragEnd: (k, N) => {
        const R = e.x + N.x, _ = e.y + N.y;
        p(e.id, { x: R, y: _ }), m?.(R, _);
      }
    }), { isResizing: S, startResize: h } = gt({
      disabled: C || !w,
      minWidth: e.minWidth ?? 20,
      minHeight: e.minHeight ?? 20,
      maxWidth: e.maxWidth,
      maxHeight: e.maxHeight,
      onResizeStart: () => {
        u?.();
      },
      onResize: (k) => {
        f?.(k.width, k.height, k.x, k.y);
      },
      onResizeEnd: (k) => {
        p(e.id, {
          x: k.x,
          y: k.y,
          width: k.width,
          height: k.height
        }), v?.(k.width, k.height, k.x, k.y);
      }
    }), b = V(() => !w || !r || C ? [] : Fe(
      { x: 0, y: 0, width: e.width, height: e.height },
      ae
    ), [w, r, C, e.width, e.height]), O = c(
      (k, N) => {
        h(
          k,
          { x: e.x, y: e.y, width: e.width, height: e.height },
          N
        );
      },
      [h, e]
    ), M = c(
      (k) => {
        E.onClick(k), w && I.onMouseDown(k);
      },
      [E, I, w]
    ), A = {
      cursor: T ? "grabbing" : w ? "grab" : "pointer",
      opacity: e.visible === !1 ? 0.5 : 1,
      ...s
    };
    return y.createElement(
      "g",
      {
        ref: g,
        className: ee("canvas-element", n, {
          "canvas-element--selected": w,
          "canvas-element--dragging": T,
          "canvas-element--resizing": S,
          "canvas-element--locked": e.locked
        }),
        transform: `translate(${e.x}, ${e.y})${e.rotation ? ` rotate(${e.rotation}, ${e.width / 2}, ${e.height / 2})` : ""}`,
        style: A,
        onMouseDown: M,
        onTouchStart: I.onTouchStart,
        "data-element-id": e.id,
        "data-element-type": e.type
      },
      // Element content
      t,
      // Selection outline
      w && y.createElement("rect", {
        className: "canvas-element__selection",
        x: -2,
        y: -2,
        width: e.width + 4,
        height: e.height + 4,
        fill: "none",
        stroke: i.colors.selection.stroke,
        strokeWidth: 1,
        strokeDasharray: "4 2",
        pointerEvents: "none"
      }),
      // Resize handles
      b.map(
        (k) => y.createElement("rect", {
          key: k.position,
          className: `canvas-element__handle canvas-element__handle--${k.position}`,
          x: k.x,
          y: k.y,
          width: ae,
          height: ae,
          fill: i.colors.handle.fill,
          stroke: i.colors.handle.stroke,
          strokeWidth: 1,
          cursor: kt(k.position),
          onMouseDown: (N) => O(k.position, N)
        })
      )
    );
  }
);
xe.displayName = "ElementBase";
function kt(e) {
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
function U(e) {
  const t = J((n, s) => {
    const o = n, r = o.element, a = o.disabled, l = o.showHandles, d = o.onSelect, m = o.onDragStart, u = o.onDrag, f = o.onDragEnd, v = o.onResizeStart, g = o.onResize, p = o.onResizeEnd, i = o.className, C = o.style, {
      element: w,
      disabled: E,
      showHandles: T,
      onSelect: I,
      onDragStart: S,
      onDrag: h,
      onDragEnd: b,
      onResizeStart: O,
      onResize: M,
      onResizeEnd: A,
      className: k,
      style: N,
      ...R
    } = o, [_, Z] = y.useState({
      isSelected: !1,
      isDragging: !1,
      isResizing: !1
    }), oe = y.useCallback((B) => {
      Z((K) => ({ ...K, isSelected: B })), d?.(B);
    }, [d]), x = y.useCallback(() => {
      Z((B) => ({ ...B, isDragging: !0 })), m?.();
    }, [m]), z = y.useCallback((B, K) => {
      Z((re) => ({ ...re, isDragging: !1 })), f?.(B, K);
    }, [f]), L = y.useCallback(() => {
      Z((B) => ({ ...B, isResizing: !0 })), v?.();
    }, [v]), D = y.useCallback((B, K, re, Be) => {
      Z((We) => ({ ...We, isResizing: !1 })), p?.(B, K, re, Be);
    }, [p]), j = {
      element: r,
      ..._
    };
    return /* @__PURE__ */ W(
      xe,
      {
        ref: s,
        element: r,
        disabled: a,
        showHandles: l,
        className: i,
        style: C,
        onSelect: oe,
        onDragStart: x,
        onDrag: u,
        onDragEnd: z,
        onResizeStart: L,
        onResize: g,
        onResizeEnd: D,
        children: /* @__PURE__ */ W(e, { ...j, ...R })
      }
    );
  });
  return t.displayName = `withElementBehavior(${e.displayName || e.name || "Component"})`, t;
}
const It = ({ element: e }) => {
  const { theme: t } = $(), { width: n, height: s, style: o } = e;
  return y.createElement("rect", {
    width: n,
    height: s,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal,
    rx: o?.cornerRadius ?? 0,
    ry: o?.cornerRadius ?? 0,
    opacity: o?.opacity ?? 1
  });
}, ce = U(It);
ce.displayName = "Rectangle";
const Tt = ({ element: e }) => {
  const { theme: t } = $(), { width: n, height: s, style: o } = e, r = n / 2, a = s / 2, l = n / 2, d = s / 2;
  return y.createElement("ellipse", {
    cx: r,
    cy: a,
    rx: l,
    ry: d,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal,
    opacity: o?.opacity ?? 1
  });
}, X = U(Tt);
X.displayName = "Ellipse";
const zt = X;
zt.displayName = "Circle";
const Nt = X;
Nt.displayName = "Oval";
const bt = ({ element: e }) => {
  const { theme: t } = $(), { width: n, height: s, style: o } = e, r = [
    `${n / 2},0`,
    `${n},${s / 2}`,
    `${n / 2},${s}`,
    `0,${s / 2}`
  ].join(" ");
  return y.createElement("polygon", {
    points: r,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal,
    opacity: o?.opacity ?? 1
  });
}, ve = U(bt);
ve.displayName = "Diamond";
const Ct = ({ element: e }) => {
  const { theme: t } = $(), { width: n, height: s, style: o, text: r = "", fontSize: a, fontFamily: l, fontWeight: d, textAlign: m } = e, u = () => {
    switch (m) {
      case "right":
        return "end";
      case "center":
        return "middle";
      default:
        return "start";
    }
  }, f = () => {
    switch (m) {
      case "right":
        return n;
      case "center":
        return n / 2;
      default:
        return 0;
    }
  };
  return y.createElement(
    "g",
    null,
    // Background (optional, for selection area)
    y.createElement("rect", {
      width: n,
      height: s,
      fill: "transparent"
    }),
    // Text
    y.createElement(
      "text",
      {
        x: f(),
        y: s / 2,
        dominantBaseline: "central",
        textAnchor: u(),
        fill: o?.fill ?? t.colors.text.primary,
        fontSize: a ?? t.fontSize.md,
        fontFamily: l ?? "sans-serif",
        fontWeight: d ?? "normal",
        opacity: o?.opacity ?? 1
      },
      r
    )
  );
}, we = U(Ct);
we.displayName = "TextElement";
const Rt = ({ element: e }) => {
  const { theme: t } = $(), { width: n, height: s, style: o, points: r, lineType: a = "solid" } = e, d = (r ?? [
    { x: 0, y: 0 },
    { x: n, y: s }
  ]).map((u, f) => f === 0 ? `M ${u.x} ${u.y}` : `L ${u.x} ${u.y}`).join(" "), m = () => {
    switch (a) {
      case "dashed":
        return "8 4";
      case "dotted":
        return "2 2";
      default:
        return;
    }
  };
  return y.createElement(
    "g",
    null,
    // Invisible wider path for easier selection
    y.createElement("path", {
      d,
      fill: "none",
      stroke: "transparent",
      strokeWidth: 10
    }),
    // Visible line
    y.createElement("path", {
      d,
      fill: "none",
      stroke: o?.stroke ?? t.colors.element.stroke,
      strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal,
      strokeDasharray: m(),
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: o?.opacity ?? 1
    })
  );
}, Se = U(Rt);
Se.displayName = "Line";
const Ot = ({ element: e }) => {
  const { theme: t } = $(), { width: n, height: s, style: o, label: r } = e, a = Math.min(n, s) * 0.15, l = n / 2, d = a * 2 + 4, m = s * 0.6, u = d + (m - d) * 0.3, f = n * 0.4, v = n * 0.35, g = s - 4, p = o?.stroke ?? t.colors.element.stroke, i = o?.strokeWidth ?? t.strokeWidth.normal;
  return y.createElement(
    "g",
    null,
    // Invisible background for selection
    y.createElement("rect", {
      width: n,
      height: s,
      fill: "transparent"
    }),
    // Head (circle)
    y.createElement("circle", {
      cx: l,
      cy: a + 2,
      r: a,
      fill: o?.fill ?? "none",
      stroke: p,
      strokeWidth: i
    }),
    // Body (vertical line)
    y.createElement("line", {
      x1: l,
      y1: d,
      x2: l,
      y2: m,
      stroke: p,
      strokeWidth: i
    }),
    // Arms (horizontal line)
    y.createElement("line", {
      x1: l - f,
      y1: u,
      x2: l + f,
      y2: u,
      stroke: p,
      strokeWidth: i
    }),
    // Left leg
    y.createElement("line", {
      x1: l,
      y1: m,
      x2: l - v,
      y2: s * 0.85,
      stroke: p,
      strokeWidth: i
    }),
    // Right leg
    y.createElement("line", {
      x1: l,
      y1: m,
      x2: l + v,
      y2: s * 0.85,
      stroke: p,
      strokeWidth: i
    }),
    // Label
    r && y.createElement(
      "text",
      {
        x: l,
        y: g,
        textAnchor: "middle",
        dominantBaseline: "text-bottom",
        fill: o?.fill ?? t.colors.text.primary,
        fontSize: t.fontSize.sm,
        fontFamily: "sans-serif"
      },
      r
    )
  );
}, ke = U(Ot);
ke.displayName = "Actor";
const Mt = ({ element: e }) => {
  const { theme: t } = $(), { width: n, height: s, style: o, label: r } = e, a = n / 2, l = 40, d = o?.stroke ?? t.colors.element.stroke, m = o?.strokeWidth ?? t.strokeWidth.normal;
  return y.createElement(
    "g",
    null,
    // Header box
    y.createElement("rect", {
      x: 0,
      y: 0,
      width: n,
      height: l,
      fill: o?.fill ?? t.colors.element.fill,
      stroke: d,
      strokeWidth: m
    }),
    // Label in header
    r && y.createElement(
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
    y.createElement("line", {
      x1: a,
      y1: l,
      x2: a,
      y2: s,
      stroke: d,
      strokeWidth: m,
      strokeDasharray: "8 4"
    })
  );
}, Ie = U(Mt);
Ie.displayName = "Lifeline";
const _t = ({ element: e }) => {
  const { theme: t } = $(), { width: n, height: s, style: o, label: r, messageType: a = "sync" } = e, l = o?.stroke ?? t.colors.connection.line, d = o?.strokeWidth ?? t.strokeWidth.normal, m = 10, u = s / 2, f = () => {
    switch (a) {
      case "return":
        return "8 4";
      case "create":
        return "4 2";
      default:
        return;
    }
  }, v = () => a === "async" ? y.createElement("polyline", {
    points: `${n - m},${u - m / 2} ${n},${u} ${n - m},${u + m / 2}`,
    fill: "none",
    stroke: l,
    strokeWidth: d
  }) : y.createElement("polygon", {
    points: `${n},${u} ${n - m},${u - m / 2} ${n - m},${u + m / 2}`,
    fill: l,
    stroke: l,
    strokeWidth: 1
  });
  return y.createElement(
    "g",
    null,
    // Invisible background for selection
    y.createElement("rect", {
      width: n,
      height: s,
      fill: "transparent"
    }),
    // Main line
    y.createElement("line", {
      x1: 0,
      y1: u,
      x2: n - (a === "async" ? 0 : m / 2),
      y2: u,
      stroke: l,
      strokeWidth: d,
      strokeDasharray: f()
    }),
    // Arrow head
    v(),
    // Label above the line
    r && y.createElement(
      "text",
      {
        x: n / 2,
        y: u - 8,
        textAnchor: "middle",
        dominantBaseline: "text-bottom",
        fill: t.colors.text.primary,
        fontSize: t.fontSize.sm,
        fontFamily: "sans-serif"
      },
      r
    )
  );
}, Te = U(_t);
Te.displayName = "Message";
const Dt = ({ element: e }) => {
  const { theme: t } = $(), { width: n, height: s, style: o } = e;
  return y.createElement("rect", {
    width: n || 12,
    // Default narrow width
    height: s,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal
  });
}, ze = U(Dt);
ze.displayName = "ActivationBar";
const le = {
  rectangle: ce,
  ellipse: X,
  circle: X,
  diamond: ve,
  text: we,
  line: Se,
  actor: ke,
  lifeline: Ie,
  message: Te,
  activationBar: ze,
  // Default fallback for custom types
  custom: ce
}, Ne = J(
  ({
    width: e,
    height: t,
    className: n,
    style: s,
    showGrid: o,
    gridSize: r,
    onCanvasClick: a,
    onCanvasDoubleClick: l,
    children: d
  }, m) => {
    const { elements: u, config: f } = se(), { clearSelection: v } = ne(), { viewport: g } = te(), { theme: p } = $(), i = e ?? f.width, C = t ?? f.height, w = o ?? f.grid?.visible, E = r ?? f.grid?.size ?? 20, T = V(() => ie(u), [u]), I = c(
      (b) => {
        b.target === b.currentTarget && (v(), a?.(b));
      },
      [v, a]
    ), S = () => {
      if (!w) return null;
      const b = "canvas-grid-pattern";
      return y.createElement(
        y.Fragment,
        null,
        y.createElement(
          "defs",
          null,
          y.createElement(
            "pattern",
            {
              id: b,
              width: E,
              height: E,
              patternUnits: "userSpaceOnUse"
            },
            y.createElement("path", {
              d: `M ${E} 0 L 0 0 0 ${E}`,
              fill: "none",
              stroke: p.colors.grid.line,
              strokeWidth: 0.5
            })
          )
        ),
        y.createElement("rect", {
          width: "100%",
          height: "100%",
          fill: `url(#${b})`
        })
      );
    }, h = (b) => {
      const O = le[b.type] ?? le.custom;
      return y.createElement(O, {
        key: b.id,
        element: b
      });
    };
    return y.createElement(
      "svg",
      {
        ref: m,
        className: ee("canvas-drawing", n),
        width: i,
        height: C,
        viewBox: `0 0 ${i} ${C}`,
        style: {
          backgroundColor: p.colors.background,
          cursor: "default",
          userSelect: "none",
          ...s
        },
        onClick: I,
        onDoubleClick: l
      },
      // Transform group for zoom and pan
      y.createElement(
        "g",
        {
          transform: `translate(${g.pan.x}, ${g.pan.y}) scale(${g.zoom})`
        },
        // Grid
        S(),
        // Elements
        T.map(h),
        // Additional children (e.g., selection boxes, connection handles)
        d
      )
    );
  }
);
Ne.displayName = "DrawingCanvas";
const be = J(
  ({
    width: e,
    height: t,
    readonly: n = !1,
    showGrid: s,
    gridSize: o,
    enableKeyboardShortcuts: r = !0,
    className: a,
    style: l,
    children: d
  }, m) => {
    const u = H(null), f = se(), v = ne(), g = te(), p = St();
    return wt(
      r ? {
        undo: p.undo,
        redo: p.redo,
        delete: p.removeSelected,
        selectAll: () => v.selectAll(f.elements.map((i) => i.id)),
        copy: p.copy,
        paste: p.paste,
        cut: p.cut,
        escape: v.clearSelection,
        zoomIn: g.zoomIn,
        zoomOut: g.zoomOut,
        resetZoom: g.resetViewport
      } : {}
    ), Ue(
      m,
      () => ({
        addElement: p.addElement,
        updateElement: p.updateElement,
        removeElement: p.removeElement,
        getElement: f.getElementById,
        getElementsByType: f.getElementsByType,
        select: v.select,
        selectMultiple: v.selectMultiple,
        clearSelection: v.clearSelection,
        getSelectedIds: () => v.selectedIds,
        zoomIn: g.zoomIn,
        zoomOut: g.zoomOut,
        setZoom: g.setZoom,
        resetViewport: g.resetViewport,
        undo: p.undo,
        redo: p.redo,
        canUndo: p.canUndo,
        canRedo: p.canRedo,
        toJSON: () => ({
          elements: f.elements,
          connections: f.connections
        }),
        toSVG: () => u.current?.outerHTML ?? ""
      }),
      [f, v, g, p]
    ), /* @__PURE__ */ Ve(
      "div",
      {
        className: ee("canvas-container", a, {
          "canvas-container--readonly": n
        }),
        style: {
          position: "relative",
          overflow: "hidden",
          ...l
        },
        tabIndex: 0,
        children: [
          /* @__PURE__ */ W(
            Ne,
            {
              ref: u,
              width: e,
              height: t,
              showGrid: s,
              gridSize: o
            }
          ),
          d
        ]
      }
    );
  }
);
be.displayName = "CanvasInner";
const Lt = J(
  ({
    elements: e,
    connections: t,
    selectedIds: n,
    defaultElements: s = [],
    defaultConnections: o = [],
    config: r,
    theme: a = "light",
    initialViewport: l,
    maxHistorySize: d,
    onChange: m,
    onSelectionChange: u,
    ...f
  }, v) => /* @__PURE__ */ W(
    yt,
    {
      initialElements: s,
      initialConnections: o,
      elements: e,
      connections: t,
      selectedIds: n,
      config: r,
      theme: a,
      initialViewport: l,
      maxHistorySize: d,
      onElementsChange: m,
      onSelectionChange: u,
      children: /* @__PURE__ */ W(be, { ...f, ref: v })
    }
  )
);
Lt.displayName = "Canvas";
const de = {
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
}, P = (e, t = {}) => {
  const n = de[e] ?? de.custom;
  return {
    id: t.id ?? q(),
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
}, Ce = (e = {}) => P("rectangle", e), Re = (e = {}) => P("ellipse", e), Oe = (e = {}) => {
  const t = e.width ?? e.height ?? 80;
  return P("circle", { ...e, width: t, height: t });
}, Me = (e = {}) => P("diamond", e), _e = (e = {}) => {
  const { text: t, fontSize: n, fontFamily: s, fontWeight: o, textAlign: r, ...a } = e;
  return {
    ...P("text", a),
    type: "text",
    text: t ?? "",
    fontSize: n,
    fontFamily: s,
    fontWeight: o,
    textAlign: r
  };
}, De = (e = {}) => {
  const { points: t, lineType: n, ...s } = e;
  return {
    ...P("line", s),
    type: "line",
    points: t,
    lineType: n ?? "solid"
  };
}, Le = (e = {}) => {
  const { label: t, ...n } = e;
  return {
    ...P("actor", n),
    type: "actor",
    label: t
  };
}, Ae = (e = {}) => {
  const { label: t, ...n } = e;
  return {
    ...P("lifeline", n),
    type: "lifeline",
    label: t
  };
}, $e = (e = {}) => {
  const { label: t, messageType: n, fromId: s, toId: o, ...r } = e;
  return {
    ...P("message", r),
    type: "message",
    label: t,
    messageType: n ?? "sync",
    fromId: s,
    toId: o
  };
}, Pe = (e = {}) => P("activationBar", e), At = (e, t = {}) => {
  switch (e) {
    case "rectangle":
      return Ce(t);
    case "ellipse":
      return Re(t);
    case "circle":
      return Oe(t);
    case "diamond":
      return Me(t);
    case "text":
      return _e(t);
    case "line":
      return De(t);
    case "actor":
      return Le(t);
    case "lifeline":
      return Ae(t);
    case "message":
      return $e(t);
    case "activationBar":
      return Pe(t);
    default:
      return P(e, t);
  }
}, Xt = {
  create: At,
  rectangle: Ce,
  ellipse: Re,
  circle: Oe,
  diamond: Me,
  text: _e,
  line: De,
  actor: Le,
  lifeline: Ae,
  message: $e,
  activationBar: Pe
};
export {
  ze as ActivationBar,
  ke as Actor,
  Lt as Canvas,
  ht as CanvasProvider,
  zt as Circle,
  yt as CombinedCanvasProvider,
  ve as Diamond,
  Ne as DrawingCanvas,
  xe as ElementBase,
  Xt as ElementFactory,
  X as Ellipse,
  ut as HistoryProvider,
  Ie as Lifeline,
  Se as Line,
  Te as Message,
  Nt as Oval,
  ce as Rectangle,
  it as SelectionProvider,
  we as TextElement,
  st as ThemeProvider,
  rt as ViewportProvider,
  Zt as boundsIntersect,
  Ke as bringToFront,
  Pe as createActivationBar,
  Le as createActor,
  Oe as createCircle,
  Me as createDiamond,
  At as createElement,
  Re as createEllipse,
  Ae as createLifeline,
  De as createLine,
  $e as createMessage,
  Ce as createRectangle,
  _e as createText,
  ee as cx,
  nt as darkTheme,
  me as deepMerge,
  Ft as deserializeFromJSON,
  Bt as distance,
  jt as downloadAsFile,
  Ht as exportToSVG,
  q as generateId,
  Fe as getResizeHandles,
  Kt as getThemeCSSVariables,
  Wt as isPointInBounds,
  F as lightTheme,
  Xe as sendToBack,
  Vt as serializeToJSON,
  Ut as snapToGrid,
  ie as sortByZIndex,
  se as useCanvas,
  St as useCanvasActions,
  wt as useCanvasKeyboardShortcuts,
  ft as useDraggable,
  dt as useHistory,
  vt as useKeyboard,
  gt as useResizable,
  Et as useSelectable,
  ne as useSelection,
  $ as useTheme,
  te as useViewport,
  Je as validateCanvasData,
  U as withElementBehavior
};
//# sourceMappingURL=index.js.map
