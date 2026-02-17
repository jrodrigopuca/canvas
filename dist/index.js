import m, { useMemo as G, useContext as ye, createContext as ge, useReducer as we, useCallback as c, useState as ne, useRef as oe, useEffect as fe, forwardRef as re, useImperativeHandle as ht } from "react";
import { jsx as ie, jsxs as pt } from "react/jsx-runtime";
const ve = () => typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`, xe = (...e) => {
  const t = [];
  for (const n of e)
    if (n) {
      if (typeof n == "string" || typeof n == "number")
        t.push(String(n));
      else if (Array.isArray(n)) {
        const s = xe(...n);
        s && t.push(s);
      } else if (typeof n == "object")
        for (const [s, o] of Object.entries(n))
          o && t.push(s);
    }
  return t.join(" ");
};
function Ae(e, t) {
  const n = { ...e };
  for (const s in t)
    if (Object.prototype.hasOwnProperty.call(t, s)) {
      const o = t[s], r = e[s];
      o !== null && typeof o == "object" && !Array.isArray(o) && r !== null && typeof r == "object" && !Array.isArray(r) ? n[s] = Ae(
        r,
        o
      ) : o !== void 0 && (n[s] = o);
    }
  return n;
}
const nn = (e, t) => {
  const n = t.x - e.x, s = t.y - e.y;
  return Math.sqrt(n * n + s * s);
}, on = (e, t) => e.x >= t.x && e.x <= t.x + t.width && e.y >= t.y && e.y <= t.y + t.height, sn = (e, t) => !(e.x + e.width < t.x || t.x + t.width < e.x || e.y + e.height < t.y || t.y + t.height < e.y), rn = (e, t) => Math.round(e / t) * t, mt = (e, t) => {
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
}, De = (e) => [...e].sort((t, n) => t.zIndex - n.zIndex), yt = (e) => e.length === 0 ? 0 : Math.max(...e.map((t) => t.zIndex)), gt = (e) => e.length === 0 ? 0 : Math.min(...e.map((t) => t.zIndex)), ft = (e, t) => {
  const n = yt(e);
  return e.map(
    (s) => s.id === t ? { ...s, zIndex: n + 1 } : s
  );
}, xt = (e, t) => {
  const n = gt(e);
  return e.map(
    (s) => s.id === t ? { ...s, zIndex: n - 1 } : s
  );
}, Et = (e, t) => {
  const n = De(e), s = n.findIndex((a) => a.id === t);
  if (s === -1 || s === n.length - 1) return e;
  const o = n[s], r = n[s + 1];
  return e.map((a) => a.id === o.id ? { ...a, zIndex: r.zIndex + 1 } : a);
}, vt = (e, t) => {
  const n = De(e), s = n.findIndex((a) => a.id === t);
  if (s <= 0) return e;
  const o = n[s], r = n[s - 1];
  return e.map((a) => a.id === o.id ? { ...a, zIndex: r.zIndex - 1 } : a);
}, wt = (e) => {
  const t = [];
  if (!e || typeof e != "object")
    return { valid: !1, errors: ["Data must be an object"] };
  const n = e;
  return typeof n.version != "string" && t.push("Missing or invalid version field"), Array.isArray(n.elements) ? n.elements.forEach((s, o) => {
    const r = St(s, o);
    t.push(...r);
  }) : t.push("Elements must be an array"), Array.isArray(n.connections) ? n.connections.forEach((s, o) => {
    const r = kt(s, o);
    t.push(...r);
  }) : t.push("Connections must be an array"), {
    valid: t.length === 0,
    errors: t
  };
}, St = (e, t) => {
  const n = [], s = `Element[${t}]`;
  if (!e || typeof e != "object")
    return [`${s}: Must be an object`];
  const o = e;
  return (typeof o.id != "string" || o.id.length === 0) && n.push(`${s}: Missing or invalid id`), (typeof o.type != "string" || o.type.length === 0) && n.push(`${s}: Missing or invalid type`), (typeof o.x != "number" || isNaN(o.x)) && n.push(`${s}: Missing or invalid x coordinate`), (typeof o.y != "number" || isNaN(o.y)) && n.push(`${s}: Missing or invalid y coordinate`), (typeof o.width != "number" || isNaN(o.width) || o.width < 0) && n.push(`${s}: Missing or invalid width`), (typeof o.height != "number" || isNaN(o.height) || o.height < 0) && n.push(`${s}: Missing or invalid height`), (typeof o.zIndex != "number" || isNaN(o.zIndex)) && n.push(`${s}: Missing or invalid zIndex`), n;
}, kt = (e, t) => {
  const n = [], s = `Connection[${t}]`;
  if (!e || typeof e != "object")
    return [`${s}: Must be an object`];
  const o = e;
  return (typeof o.id != "string" || o.id.length === 0) && n.push(`${s}: Missing or invalid id`), (typeof o.fromId != "string" || o.fromId.length === 0) && n.push(`${s}: Missing or invalid fromId`), (typeof o.toId != "string" || o.toId.length === 0) && n.push(`${s}: Missing or invalid toId`), n;
}, bt = "1.0.0", an = (e, t, n) => JSON.stringify({
  version: bt,
  elements: e,
  connections: t,
  metadata: n
}, null, 2), Rt = (e) => {
  const t = JSON.parse(e), n = wt(t);
  if (!n.valid)
    throw new Error(`Invalid canvas data: ${n.errors.join(", ")}`);
  return t;
}, cn = (e, t) => {
  const n = e.cloneNode(!0);
  if (n.getAttribute("xmlns") || n.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t?.includeStyles) {
    const o = document.createElement("style");
    o.textContent = Le(e), n.insertBefore(o, n.firstChild);
  }
  return new XMLSerializer().serializeToString(n);
}, Le = (e) => {
  const t = /* @__PURE__ */ new Set();
  return e.querySelectorAll("*").forEach((n) => t.add(n.tagName.toLowerCase())), `
    svg { font-family: system-ui, sans-serif; }
    text { user-select: none; }
  `;
}, ln = (e, t, n) => {
  const s = new Blob([e], { type: n }), o = URL.createObjectURL(s), r = document.createElement("a");
  r.href = o, r.download = t, document.body.appendChild(r), r.click(), document.body.removeChild(r), URL.revokeObjectURL(o);
}, Oe = async (e, t = {}) => {
  const {
    format: n = "png",
    quality: s = 0.92,
    backgroundColor: o,
    scale: r = 1
  } = t, a = e.getBoundingClientRect(), b = a.width * r, x = a.height * r, I = e.cloneNode(!0);
  I.setAttribute("xmlns", "http://www.w3.org/2000/svg"), I.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  const E = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "style"
  );
  E.textContent = Le(e), I.insertBefore(E, I.firstChild);
  const k = new XMLSerializer().serializeToString(I), f = new Blob([k], {
    type: "image/svg+xml;charset=utf-8"
  }), y = URL.createObjectURL(f);
  return new Promise((u, w) => {
    const g = new Image();
    g.onload = () => {
      const i = document.createElement("canvas");
      i.width = b, i.height = x;
      const v = i.getContext("2d");
      if (!v) {
        URL.revokeObjectURL(y), w(new Error("Failed to get canvas context"));
        return;
      }
      const l = o ?? (n === "jpeg" ? "#ffffff" : "transparent");
      l !== "transparent" && (v.fillStyle = l, v.fillRect(0, 0, b, x)), v.scale(r, r), v.drawImage(g, 0, 0), i.toBlob(
        (h) => {
          URL.revokeObjectURL(y), h ? u(h) : w(new Error("Failed to create image blob"));
        },
        n === "jpeg" ? "image/jpeg" : "image/png",
        n === "jpeg" ? s : void 0
      );
    }, g.onerror = () => {
      URL.revokeObjectURL(y), w(new Error("Failed to load SVG as image"));
    }, g.src = y;
  });
}, dn = async (e, t, n = {}) => {
  const { format: s = "png" } = n, o = await Oe(e, n), r = URL.createObjectURL(o), a = document.createElement("a");
  a.href = r, a.download = `${t}.${s}`, document.body.appendChild(a), a.click(), document.body.removeChild(a), URL.revokeObjectURL(r);
}, de = {
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
}, It = {
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
  spacing: de.spacing,
  borderRadius: de.borderRadius,
  fontSize: de.fontSize,
  strokeWidth: de.strokeWidth,
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.3)",
    md: "0 4px 6px rgba(0,0,0,0.4)",
    lg: "0 10px 15px rgba(0,0,0,0.5)",
    element: "0 2px 4px rgba(0,0,0,0.3)",
    handle: "0 1px 2px rgba(0,0,0,0.3)"
  }
}, _e = ge({
  theme: de,
  themeName: "light"
}), se = () => {
  const e = ye(_e);
  if (!e)
    throw new Error("useTheme must be used within a ThemeProvider");
  return e;
}, zt = ({ children: e, theme: t = "light" }) => {
  const n = G(() => t === "light" ? { theme: de, themeName: "light" } : t === "dark" ? { theme: It, themeName: "dark" } : {
    theme: Ae(de, t),
    themeName: "custom"
  }, [t]);
  return m.createElement(_e.Provider, { value: n }, e);
}, un = (e) => ({
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
}), Pe = {
  zoom: 1,
  pan: { x: 0, y: 0 },
  minZoom: 0.1,
  maxZoom: 5
}, Dt = (e, t) => {
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
      return { ...Pe, minZoom: e.minZoom, maxZoom: e.maxZoom };
    case "SET_CONSTRAINTS":
      return {
        ...e,
        minZoom: t.payload.minZoom ?? e.minZoom,
        maxZoom: t.payload.maxZoom ?? e.maxZoom
      };
    default:
      return e;
  }
}, $e = ge(null), he = () => {
  const e = ye($e);
  if (!e)
    throw new Error("useViewport must be used within a ViewportProvider");
  return e;
}, Ct = ({
  children: e,
  initialViewport: t
}) => {
  const [n, s] = we(Dt, {
    ...Pe,
    ...t
  }), o = c((u) => {
    s({ type: "SET_ZOOM", payload: u });
  }, []), r = c(() => {
    s({ type: "ZOOM_IN" });
  }, []), a = c(() => {
    s({ type: "ZOOM_OUT" });
  }, []), b = c((u, w) => {
    s({ type: "ZOOM_TO_FIT", payload: { bounds: u, padding: w } });
  }, []), x = c((u) => {
    s({ type: "SET_PAN", payload: u });
  }, []), I = c((u) => {
    s({ type: "PAN_BY", payload: u });
  }, []), E = c(() => {
    s({ type: "RESET" });
  }, []), S = c(
    (u) => {
      s({ type: "SET_CONSTRAINTS", payload: u });
    },
    []
  ), k = c(
    (u) => ({
      x: (u.x - n.pan.x) / n.zoom,
      y: (u.y - n.pan.y) / n.zoom
    }),
    [n.zoom, n.pan]
  ), f = c(
    (u) => ({
      x: u.x * n.zoom + n.pan.x,
      y: u.y * n.zoom + n.pan.y
    }),
    [n.zoom, n.pan]
  ), y = G(
    () => ({
      viewport: n,
      setZoom: o,
      zoomIn: r,
      zoomOut: a,
      zoomToFit: b,
      setPan: x,
      panBy: I,
      resetViewport: E,
      setConstraints: S,
      screenToCanvas: k,
      canvasToScreen: f
    }),
    [
      n,
      o,
      r,
      a,
      b,
      x,
      I,
      E,
      S,
      k,
      f
    ]
  );
  return m.createElement($e.Provider, { value: y }, e);
}, Tt = {
  selectedIds: /* @__PURE__ */ new Set(),
  lastSelectedId: null
}, Mt = (e, t) => {
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
      return Tt;
    case "SELECT_ALL":
      return {
        selectedIds: new Set(t.payload),
        lastSelectedId: t.payload.length > 0 ? t.payload[t.payload.length - 1] : null
      };
    default:
      return e;
  }
}, Be = ge(null), Se = () => {
  const e = ye(Be);
  if (!e)
    throw new Error("useSelection must be used within a SelectionProvider");
  return e;
}, Nt = ({
  children: e,
  initialSelection: t,
  onSelectionChange: n
}) => {
  const [s, o] = we(Mt, {
    selectedIds: new Set(t ?? []),
    lastSelectedId: t?.[t.length - 1] ?? null
  }), r = G(() => Array.from(s.selectedIds), [s.selectedIds]);
  m.useEffect(() => {
    n?.(r);
  }, [r, n]);
  const a = c(
    (u) => s.selectedIds.has(u),
    [s.selectedIds]
  ), b = c((u) => {
    o({ type: "SELECT", payload: u });
  }, []), x = c((u) => {
    o({ type: "SELECT_MULTIPLE", payload: u });
  }, []), I = c((u) => {
    o({ type: "ADD_TO_SELECTION", payload: u });
  }, []), E = c((u) => {
    o({ type: "REMOVE_FROM_SELECTION", payload: u });
  }, []), S = c((u) => {
    o({ type: "TOGGLE_SELECTION", payload: u });
  }, []), k = c(() => {
    o({ type: "CLEAR_SELECTION" });
  }, []), f = c((u) => {
    o({ type: "SELECT_ALL", payload: u });
  }, []), y = G(
    () => ({
      selectedIds: r,
      lastSelectedId: s.lastSelectedId,
      selectionCount: s.selectedIds.size,
      hasSelection: s.selectedIds.size > 0,
      isSelected: a,
      select: b,
      selectMultiple: x,
      addToSelection: I,
      removeFromSelection: E,
      toggleSelection: S,
      clearSelection: k,
      selectAll: f
    }),
    [
      r,
      s.lastSelectedId,
      s.selectedIds.size,
      a,
      b,
      x,
      I,
      E,
      S,
      k,
      f
    ]
  );
  return m.createElement(Be.Provider, { value: y }, e);
}, At = (e, t) => {
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
}, We = ge(null), Lt = () => {
  const e = ye(We);
  if (!e)
    throw new Error("useHistory must be used within a HistoryProvider");
  return e;
}, Ot = ({
  children: e,
  initialElements: t = [],
  initialConnections: n = [],
  maxHistorySize: s = 50,
  onStateChange: o
}) => {
  const [r, a] = we(At, {
    past: [],
    present: {
      elements: t,
      connections: n,
      timestamp: Date.now()
    },
    future: [],
    maxHistorySize: s
  });
  m.useEffect(() => {
    o?.(r.present.elements, r.present.connections);
  }, [r.present, o]);
  const b = c((y, u) => {
    a({
      type: "PUSH",
      payload: {
        elements: y,
        connections: u,
        timestamp: Date.now()
      }
    });
  }, []), x = c(() => {
    a({ type: "UNDO" });
  }, []), I = c(() => {
    a({ type: "REDO" });
  }, []), E = c(() => {
    a({ type: "CLEAR" });
  }, []), S = c((y, u) => {
    a({
      type: "SET_PRESENT",
      payload: {
        elements: y,
        connections: u,
        timestamp: Date.now()
      }
    });
  }, []), k = c((y) => {
    a({ type: "SET_MAX_SIZE", payload: y });
  }, []), f = G(
    () => ({
      canUndo: r.past.length > 0,
      canRedo: r.future.length > 0,
      historySize: r.past.length,
      futureSize: r.future.length,
      present: r.present,
      pushState: b,
      undo: x,
      redo: I,
      clearHistory: E,
      setPresent: S,
      setMaxHistorySize: k
    }),
    [r.past.length, r.future.length, r.present, b, x, I, E, S, k]
  );
  return m.createElement(We.Provider, { value: f }, e);
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
}, Pt = (e, t) => {
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
        elements: ft(e.elements, t.payload)
      };
    case "SEND_TO_BACK":
      return {
        ...e,
        elements: xt(e.elements, t.payload)
      };
    case "MOVE_UP":
      return {
        ...e,
        elements: Et(e.elements, t.payload)
      };
    case "MOVE_DOWN":
      return {
        ...e,
        elements: vt(e.elements, t.payload)
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
}, Ue = ge(null), ce = () => {
  const e = ye(Ue);
  if (!e)
    throw new Error("useCanvas must be used within a CanvasProvider");
  return e;
}, $t = ({
  children: e,
  initialElements: t = [],
  initialConnections: n = [],
  config: s,
  onChange: o
}) => {
  const [r, a] = we(Pt, {
    elements: t,
    connections: n,
    config: { ..._t, ...s }
  });
  m.useEffect(() => {
    o?.(r.elements, r.connections);
  }, [r.elements, r.connections, o]);
  const b = c(
    (d) => r.elements.find((M) => M.id === d),
    [r.elements]
  ), x = c(
    (d) => r.elements.filter((M) => M.type === d),
    [r.elements]
  ), I = c(
    (d) => {
      const M = d.id ?? ve(), P = r.elements.length > 0 ? Math.max(...r.elements.map((X) => X.zIndex)) : 0;
      return a({
        type: "ADD_ELEMENT",
        payload: { ...d, id: M, zIndex: d.zIndex ?? P + 1 }
      }), M;
    },
    [r.elements]
  ), E = c(
    (d) => {
      const M = r.elements.length > 0 ? Math.max(...r.elements.map((X) => X.zIndex)) : 0, P = d.map((X, V) => ({
        ...X,
        id: X.id ?? ve(),
        zIndex: X.zIndex ?? M + 1 + V
      }));
      return a({ type: "ADD_ELEMENTS", payload: P }), P.map((X) => X.id);
    },
    [r.elements]
  ), S = c((d, M) => {
    a({ type: "UPDATE_ELEMENT", payload: { id: d, updates: M } });
  }, []), k = c((d, M) => {
    a({ type: "UPDATE_ELEMENTS", payload: { ids: d, updates: M } });
  }, []), f = c((d) => {
    a({ type: "REMOVE_ELEMENT", payload: d });
  }, []), y = c((d) => {
    a({ type: "REMOVE_ELEMENTS", payload: d });
  }, []), u = c((d, M, P) => {
    a({ type: "MOVE_ELEMENT", payload: { id: d, x: M, y: P } });
  }, []), w = c((d, M, P) => {
    a({ type: "MOVE_ELEMENTS", payload: { ids: d, deltaX: M, deltaY: P } });
  }, []), g = c(
    (d, M, P, X, V) => {
      a({ type: "RESIZE_ELEMENT", payload: { id: d, width: M, height: P, x: X, y: V } });
    },
    []
  ), i = c((d) => {
    a({ type: "BRING_TO_FRONT", payload: d });
  }, []), v = c((d) => {
    a({ type: "SEND_TO_BACK", payload: d });
  }, []), l = c((d) => {
    a({ type: "MOVE_UP", payload: d });
  }, []), h = c((d) => {
    a({ type: "MOVE_DOWN", payload: d });
  }, []), p = c((d) => {
    a({ type: "SET_ELEMENTS", payload: d });
  }, []), z = c(
    (d) => r.connections.find((M) => M.id === d),
    [r.connections]
  ), T = c(
    (d) => r.connections.filter(
      (M) => M.fromId === d || M.toId === d
    ),
    [r.connections]
  ), R = c(
    (d) => {
      const M = d.id ?? ve();
      return a({
        type: "ADD_CONNECTION",
        payload: { ...d, id: M }
      }), M;
    },
    []
  ), $ = c((d, M) => {
    a({ type: "UPDATE_CONNECTION", payload: { id: d, updates: M } });
  }, []), _ = c((d) => {
    a({ type: "REMOVE_CONNECTION", payload: d });
  }, []), D = c((d) => {
    a({ type: "SET_CONNECTIONS", payload: d });
  }, []), L = c((d) => {
    a({ type: "UPDATE_CONFIG", payload: d });
  }, []), O = c(() => {
    a({ type: "CLEAR_CANVAS" });
  }, []), F = c((d, M) => {
    a({ type: "LOAD_STATE", payload: { elements: d, connections: M } });
  }, []), U = G(
    () => ({
      elements: r.elements,
      connections: r.connections,
      config: r.config,
      getElementById: b,
      getElementsByType: x,
      addElement: I,
      addElements: E,
      updateElement: S,
      updateElements: k,
      removeElement: f,
      removeElements: y,
      moveElement: u,
      moveElements: w,
      resizeElement: g,
      bringToFront: i,
      sendToBack: v,
      moveUp: l,
      moveDown: h,
      setElements: p,
      getConnectionById: z,
      getConnectionsForElement: T,
      addConnection: R,
      updateConnection: $,
      removeConnection: _,
      setConnections: D,
      updateConfig: L,
      clearCanvas: O,
      loadState: F
    }),
    [
      r.elements,
      r.connections,
      r.config,
      b,
      x,
      I,
      E,
      S,
      k,
      f,
      y,
      u,
      w,
      g,
      i,
      v,
      l,
      h,
      p,
      z,
      T,
      R,
      $,
      _,
      D,
      L,
      O,
      F
    ]
  );
  return m.createElement(Ue.Provider, { value: U }, e);
}, Bt = ({
  children: e,
  initialElements: t = [],
  initialConnections: n = [],
  config: s,
  theme: o = "light",
  initialViewport: r,
  maxHistorySize: a = 50,
  onElementsChange: b,
  onSelectionChange: x,
  elements: I,
  connections: E,
  selectedIds: S
}) => {
  const k = I ?? t, f = E ?? n;
  return /* @__PURE__ */ ie(zt, { theme: o, children: /* @__PURE__ */ ie(Ct, { initialViewport: r, children: /* @__PURE__ */ ie(
    Nt,
    {
      initialSelection: S,
      onSelectionChange: x,
      children: /* @__PURE__ */ ie(
        Ot,
        {
          initialElements: k,
          initialConnections: f,
          maxHistorySize: a,
          children: /* @__PURE__ */ ie(
            $t,
            {
              initialElements: k,
              initialConnections: f,
              config: s,
              onChange: b,
              children: e
            }
          )
        }
      )
    }
  ) }) });
}, Ze = (e = {}) => {
  const {
    onDragStart: t,
    onDrag: n,
    onDragEnd: s,
    disabled: o = !1,
    threshold: r = 3
  } = e, [a, b] = ne({
    isDragging: !1,
    startPosition: null,
    currentPosition: null,
    delta: { x: 0, y: 0 }
  }), x = oe(null), I = oe(!1), { screenToCanvas: E } = he(), S = c(
    (g) => {
      if ("touches" in g) {
        const i = g.touches[0] || g.changedTouches[0];
        return E({ x: i.clientX, y: i.clientY });
      }
      return E({ x: g.clientX, y: g.clientY });
    },
    [E]
  ), k = c(
    (g) => {
      if (!x.current) return;
      const i = S(g), v = {
        x: i.x - x.current.x,
        y: i.y - x.current.y
      };
      if (!I.current) {
        if (Math.sqrt(v.x ** 2 + v.y ** 2) < r) return;
        I.current = !0, t?.(x.current);
      }
      b({
        isDragging: !0,
        startPosition: x.current,
        currentPosition: i,
        delta: v
      }), n?.(i, v);
    },
    [S, r, t, n]
  ), f = c(
    (g) => {
      if (!x.current) return;
      const i = S(g), v = {
        x: i.x - x.current.x,
        y: i.y - x.current.y
      };
      I.current && s?.(i, v), b({
        isDragging: !1,
        startPosition: null,
        currentPosition: null,
        delta: { x: 0, y: 0 }
      }), x.current = null, I.current = !1, document.removeEventListener("mousemove", k), document.removeEventListener("mouseup", f), document.removeEventListener("touchmove", k), document.removeEventListener("touchend", f);
    },
    [S, k, s]
  ), y = c(
    (g, i) => {
      if (o) return;
      const v = E({ x: g, y: i });
      x.current = v, I.current = !1, b({
        isDragging: !1,
        startPosition: v,
        currentPosition: v,
        delta: { x: 0, y: 0 }
      }), document.addEventListener("mousemove", k), document.addEventListener("mouseup", f), document.addEventListener("touchmove", k, { passive: !1 }), document.addEventListener("touchend", f);
    },
    [o, E, k, f]
  ), u = c(
    (g) => {
      g.button === 0 && (g.preventDefault(), g.stopPropagation(), y(g.clientX, g.clientY));
    },
    [y]
  ), w = c(
    (g) => {
      if (g.touches.length !== 1) return;
      const i = g.touches[0];
      y(i.clientX, i.clientY);
    },
    [y]
  );
  return {
    dragState: a,
    handlers: {
      onMouseDown: u,
      onTouchStart: w
    },
    isDragging: a.isDragging
  };
}, Wt = (e = {}) => {
  const {
    onResizeStart: t,
    onResize: n,
    onResizeEnd: s,
    disabled: o = !1,
    minWidth: r = 20,
    minHeight: a = 20,
    maxWidth: b = 1 / 0,
    maxHeight: x = 1 / 0,
    maintainAspectRatio: I = !1,
    aspectRatio: E
  } = e, [S, k] = ne({
    isResizing: !1,
    handle: null,
    startBounds: null,
    currentBounds: null
  }), f = oe(null), { screenToCanvas: y } = he(), u = c(
    (l) => {
      if ("touches" in l) {
        const h = l.touches[0] || l.changedTouches[0];
        return y({ x: h.clientX, y: h.clientY });
      }
      return y({ x: l.clientX, y: l.clientY });
    },
    [y]
  ), w = c(
    (l) => {
      if (!f.current)
        return { x: 0, y: 0, width: 0, height: 0 };
      const { position: h, bounds: p, handle: z } = f.current, T = l.x - h.x, R = l.y - h.y;
      let $ = p.x, _ = p.y, D = p.width, L = p.height;
      switch (z) {
        case "nw":
          $ = p.x + T, _ = p.y + R, D = p.width - T, L = p.height - R;
          break;
        case "n":
          _ = p.y + R, L = p.height - R;
          break;
        case "ne":
          _ = p.y + R, D = p.width + T, L = p.height - R;
          break;
        case "e":
          D = p.width + T;
          break;
        case "se":
          D = p.width + T, L = p.height + R;
          break;
        case "s":
          L = p.height + R;
          break;
        case "sw":
          $ = p.x + T, D = p.width - T, L = p.height + R;
          break;
        case "w":
          $ = p.x + T, D = p.width - T;
          break;
      }
      if (D < r && (z.includes("w") && ($ = p.x + p.width - r), D = r), L < a && (z.includes("n") && (_ = p.y + p.height - a), L = a), D > b && (D = b), L > x && (L = x), I && f.current.aspectRatio) {
        const O = f.current.aspectRatio;
        D / L > O ? D = L * O : L = D / O;
      }
      return { x: $, y: _, width: D, height: L };
    },
    [r, a, b, x, I]
  ), g = c(
    (l) => {
      if (!f.current) return;
      const h = u(l), p = w(h);
      k((z) => ({
        ...z,
        currentBounds: p
      })), n?.(p);
    },
    [u, w, n]
  ), i = c(
    (l) => {
      if (!f.current) return;
      const h = u(l), p = w(h);
      s?.(p), k({
        isResizing: !1,
        handle: null,
        startBounds: null,
        currentBounds: null
      }), f.current = null, document.removeEventListener("mousemove", g), document.removeEventListener("mouseup", i), document.removeEventListener("touchmove", g), document.removeEventListener("touchend", i);
    },
    [u, w, g, s]
  ), v = c(
    (l, h, p) => {
      if (o) return;
      p.preventDefault(), p.stopPropagation();
      const z = "touches" in p ? p.touches[0].clientX : p.clientX, T = "touches" in p ? p.touches[0].clientY : p.clientY, R = y({ x: z, y: T });
      f.current = {
        position: R,
        bounds: h,
        handle: l,
        aspectRatio: E ?? h.width / h.height
      }, k({
        isResizing: !0,
        handle: l,
        startBounds: h,
        currentBounds: h
      }), t?.(l), document.addEventListener("mousemove", g), document.addEventListener("mouseup", i), document.addEventListener("touchmove", g, { passive: !1 }), document.addEventListener("touchend", i);
    },
    [
      o,
      y,
      E,
      t,
      g,
      i
    ]
  );
  return {
    resizeState: S,
    startResize: v,
    isResizing: S.isResizing
  };
}, He = (e = {}) => {
  const {
    onRotateStart: t,
    onRotate: n,
    onRotateEnd: s,
    disabled: o = !1,
    snapAngle: r
  } = e, [a, b] = ne({
    isRotating: !1,
    startAngle: null,
    currentAngle: null,
    deltaAngle: 0
  }), x = oe(null), { screenToCanvas: I } = he(), E = c(
    (w) => {
      if ("touches" in w) {
        const g = w.touches[0] || w.changedTouches[0];
        return I({ x: g.clientX, y: g.clientY });
      }
      return I({ x: w.clientX, y: w.clientY });
    },
    [I]
  ), S = c((w, g) => {
    const i = g.x - w.x, v = g.y - w.y;
    return Math.atan2(v, i) * (180 / Math.PI);
  }, []), k = c(
    (w) => r ? Math.round(w / r) * r : w,
    [r]
  ), f = c(
    (w) => {
      if (!x.current || o) return;
      const g = E(w), { center: i, startMouseAngle: v, initialRotation: l } = x.current;
      let p = S(i, g) - v, z = l + p;
      z = (z % 360 + 360) % 360, w.shiftKey && r && (z = k(z)), b({
        isRotating: !0,
        startAngle: l,
        currentAngle: z,
        deltaAngle: z - l
      }), n?.(z, z - l);
    },
    [o, E, S, r, k, n]
  ), y = c(
    (w) => {
      if (!x.current) return;
      const g = E(w), { center: i, startMouseAngle: v, initialRotation: l } = x.current;
      let p = S(i, g) - v, z = l + p;
      z = (z % 360 + 360) % 360, w.shiftKey && r && (z = k(z)), s?.(z), b({
        isRotating: !1,
        startAngle: null,
        currentAngle: null,
        deltaAngle: 0
      }), x.current = null, document.removeEventListener("mousemove", f), document.removeEventListener("mouseup", y), document.removeEventListener("touchmove", f), document.removeEventListener("touchend", y);
    },
    [
      E,
      S,
      r,
      k,
      s,
      f
    ]
  ), u = c(
    (w, g, i) => {
      if (o) return;
      i.stopPropagation(), i.preventDefault();
      const v = E(
        i.nativeEvent
      ), l = S(w, v);
      x.current = {
        center: w,
        startMouseAngle: l,
        initialRotation: g
      }, b({
        isRotating: !0,
        startAngle: g,
        currentAngle: g,
        deltaAngle: 0
      }), t?.(g), document.addEventListener("mousemove", f), document.addEventListener("mouseup", y), document.addEventListener("touchmove", f), document.addEventListener("touchend", y);
    },
    [
      o,
      E,
      S,
      t,
      f,
      y
    ]
  );
  return {
    rotateState: a,
    startRotate: u,
    isRotating: a.isRotating
  };
}, Fe = (e) => {
  const { id: t, disabled: n = !1, onSelect: s } = e, {
    isSelected: o,
    select: r,
    addToSelection: a,
    removeFromSelection: b,
    toggleSelection: x,
    clearSelection: I
  } = Se(), E = o(t), S = c(() => {
    n || (r(t), s?.(!0));
  }, [n, t, r, s]), k = c(() => {
    n || (b(t), s?.(!1));
  }, [n, t, b, s]), f = c(() => {
    if (n) return;
    const u = !E;
    x(t), s?.(u);
  }, [n, t, E, x, s]), y = c(
    (u) => {
      n || (u.stopPropagation(), u.ctrlKey || u.metaKey ? (x(t), s?.(!E)) : u.shiftKey ? (a(t), s?.(!0)) : (r(t), s?.(!0)));
    },
    [
      n,
      t,
      E,
      x,
      a,
      r,
      s
    ]
  );
  return {
    isSelected: E,
    handlers: {
      onClick: y
    },
    select: S,
    deselect: k,
    toggle: f
  };
}, Ut = (e, t) => {
  const n = e.key.toLowerCase() === t.key.toLowerCase();
  t.ctrl ? e.ctrlKey : !e.ctrlKey || t.meta, t.meta ? e.metaKey : !e.metaKey || t.ctrl;
  const s = t.shift ? e.shiftKey : !e.shiftKey, o = t.alt ? e.altKey : !e.altKey, r = t.ctrl || t.meta ? !!(t.ctrl && (e.ctrlKey || e.metaKey)) || !!(t.meta && e.metaKey) : !e.ctrlKey && !e.metaKey;
  return n && r && s && o;
}, Zt = (e = {}) => {
  const { shortcuts: t = [], enabled: n = !0, targetRef: s } = e, o = oe(t);
  o.current = t;
  const r = c(
    (a) => {
      if (n) {
        for (const b of o.current)
          if (Ut(a, b)) {
            b.preventDefault !== !1 && a.preventDefault(), b.action();
            return;
          }
      }
    },
    [n]
  );
  fe(() => {
    const a = s?.current ?? document;
    return a.addEventListener("keydown", r), () => {
      a.removeEventListener("keydown", r);
    };
  }, [r, s]);
}, Ht = (e) => {
  const t = [];
  e.undo && t.push({ key: "z", ctrl: !0, action: e.undo }), e.redo && (t.push({ key: "z", ctrl: !0, shift: !0, action: e.redo }), t.push({ key: "y", ctrl: !0, action: e.redo })), e.delete && (t.push({ key: "Delete", action: e.delete }), t.push({ key: "Backspace", action: e.delete })), e.selectAll && t.push({ key: "a", ctrl: !0, action: e.selectAll }), e.copy && t.push({ key: "c", ctrl: !0, action: e.copy }), e.paste && t.push({ key: "v", ctrl: !0, action: e.paste }), e.cut && t.push({ key: "x", ctrl: !0, action: e.cut }), e.escape && t.push({ key: "Escape", action: e.escape }), e.zoomIn && (t.push({ key: "+", ctrl: !0, action: e.zoomIn }), t.push({ key: "=", ctrl: !0, action: e.zoomIn })), e.zoomOut && t.push({ key: "-", ctrl: !0, action: e.zoomOut }), e.resetZoom && t.push({ key: "0", ctrl: !0, action: e.resetZoom }), Zt({ shortcuts: t });
}, Ft = () => {
  const e = ce(), t = Se(), n = Lt(), s = oe(null), o = c(() => {
    n.pushState(e.elements, e.connections);
  }, [n, e.elements, e.connections]), r = c(
    (i) => (o(), e.addElement(i)),
    [e, o]
  ), a = c(
    (i, v) => {
      o(), e.updateElement(i, v);
    },
    [e, o]
  ), b = c(
    (i) => {
      o(), e.removeElement(i);
    },
    [e, o]
  ), x = c(() => {
    t.selectedIds.length !== 0 && (o(), e.removeElements(t.selectedIds), t.clearSelection());
  }, [e, t, o]), I = c(
    (i, v) => {
      t.selectedIds.length !== 0 && (o(), e.moveElements(t.selectedIds, i, v));
    },
    [e, t, o]
  ), E = c(() => {
    if (t.selectedIds.length === 0) return [];
    o();
    const v = e.elements.filter(
      (h) => t.selectedIds.includes(h.id)
    ).map((h) => ({
      ...h,
      id: void 0,
      // Will be auto-generated
      x: h.x + 20,
      y: h.y + 20
    })), l = e.addElements(v);
    return t.selectMultiple(l), l;
  }, [e, t, o]), S = c(
    (i) => (o(), e.addConnection(i)),
    [e, o]
  ), k = c(
    (i) => {
      o(), e.removeConnection(i);
    },
    [e, o]
  ), f = c(() => {
    if (t.selectedIds.length === 0) return;
    const i = e.elements.filter(
      (h) => t.selectedIds.includes(h.id)
    ), v = new Set(t.selectedIds), l = e.connections.filter(
      (h) => v.has(h.fromId) && v.has(h.toId)
    );
    s.current = {
      elements: i,
      connections: l
    };
  }, [e.elements, e.connections, t.selectedIds]), y = c(() => {
    f(), x();
  }, [f, x]), u = c(() => {
    if (!s.current) return;
    o();
    const i = /* @__PURE__ */ new Map(), v = s.current.elements.map((h) => ({
      ...h,
      id: void 0,
      x: h.x + 20,
      y: h.y + 20
    })), l = e.addElements(v);
    s.current.elements.forEach((h, p) => {
      i.set(h.id, l[p]);
    }), s.current.connections.forEach((h) => {
      const p = i.get(h.fromId), z = i.get(h.toId);
      p && z && e.addConnection({
        ...h,
        id: void 0,
        fromId: p,
        toId: z
      });
    }), t.selectMultiple(l);
  }, [e, t, o]), w = c(() => {
    n.canUndo && (n.undo(), e.loadState(n.present.elements, n.present.connections));
  }, [n, e]), g = c(() => {
    n.canRedo && (n.redo(), e.loadState(n.present.elements, n.present.connections));
  }, [n, e]);
  return {
    addElement: r,
    updateElement: a,
    removeElement: b,
    removeSelected: x,
    moveSelected: I,
    duplicateSelected: E,
    addConnection: S,
    removeConnection: k,
    copy: f,
    cut: y,
    paste: u,
    hasCopied: s.current !== null,
    undo: w,
    redo: g,
    canUndo: n.canUndo,
    canRedo: n.canRedo
  };
}, Ee = 8, pe = re(
  ({
    element: e,
    children: t,
    className: n,
    style: s,
    disabled: o = !1,
    showHandles: r = !0,
    enableRotation: a = !0,
    onSelect: b,
    onDragStart: x,
    onDrag: I,
    onDragEnd: E,
    onResizeStart: S,
    onResize: k,
    onResizeEnd: f,
    onRotateStart: y,
    onRotate: u,
    onRotateEnd: w
  }, g) => {
    const { updateElement: i } = ce(), { theme: v } = se(), l = e.locked || o, { isSelected: h, handlers: p } = Fe({
      id: e.id,
      disabled: l,
      onSelect: b
    }), { isDragging: z, dragState: T, handlers: R } = Ze({
      disabled: l || !h,
      onDragStart: () => {
        x?.();
      },
      onDrag: (N, C) => {
        const A = e.x + C.x, B = e.y + C.y;
        I?.(A, B);
      },
      onDragEnd: (N, C) => {
        const A = e.x + C.x, B = e.y + C.y;
        i(e.id, { x: A, y: B }), E?.(A, B);
      }
    }), { isResizing: $, resizeState: _, startResize: D } = Wt({
      disabled: l || !h,
      minWidth: e.minWidth ?? 20,
      minHeight: e.minHeight ?? 20,
      maxWidth: e.maxWidth,
      maxHeight: e.maxHeight,
      onResizeStart: () => {
        S?.();
      },
      onResize: (N) => {
        k?.(N.width, N.height, N.x, N.y);
      },
      onResizeEnd: (N) => {
        i(e.id, {
          x: N.x,
          y: N.y,
          width: N.width,
          height: N.height
        }), f?.(N.width, N.height, N.x, N.y);
      }
    }), { isRotating: L, rotateState: O, startRotate: F } = He({
      disabled: l || !h || !a,
      snapAngle: 15,
      onRotateStart: () => {
        y?.();
      },
      onRotate: (N) => {
        u?.(N);
      },
      onRotateEnd: (N) => {
        i(e.id, { rotation: N }), w?.(N);
      }
    }), U = G(() => L && O.currentAngle !== null ? O.currentAngle : e.rotation ?? 0, [L, O.currentAngle, e.rotation]), d = G(() => $ && _.currentBounds ? _.currentBounds : z ? {
      x: e.x + T.delta.x,
      y: e.y + T.delta.y,
      width: e.width,
      height: e.height
    } : {
      x: e.x,
      y: e.y,
      width: e.width,
      height: e.height
    }, [$, _.currentBounds, z, T.delta, e.x, e.y, e.width, e.height]), M = G(() => !$ || !_.currentBounds ? { x: 1, y: 1 } : {
      x: _.currentBounds.width / e.width,
      y: _.currentBounds.height / e.height
    }, [$, _.currentBounds, e.width, e.height]), P = G(() => !h || !r || l ? [] : mt(
      { x: 0, y: 0, width: d.width, height: d.height },
      Ee
    ), [h, r, l, d.width, d.height]), X = c(
      (N, C) => {
        D(
          N,
          { x: e.x, y: e.y, width: e.width, height: e.height },
          C
        );
      },
      [D, e]
    ), V = c(
      (N) => {
        const C = d.x + d.width / 2, A = d.y + d.height / 2;
        F(
          { x: C, y: A },
          e.rotation ?? 0,
          N
        );
      },
      [F, d, e.rotation]
    ), Z = c(
      (N) => {
        p.onClick(N), h && R.onMouseDown(N);
      },
      [p, R, h]
    ), j = {
      cursor: z ? "grabbing" : h ? "grab" : "pointer",
      opacity: e.visible === !1 ? 0.5 : 1,
      ...s
    };
    return m.createElement(
      "g",
      {
        ref: g,
        className: xe("canvas-element", n, {
          "canvas-element--selected": h,
          "canvas-element--dragging": z,
          "canvas-element--resizing": $,
          "canvas-element--rotating": L,
          "canvas-element--locked": e.locked
        }),
        transform: `translate(${d.x}, ${d.y})${U ? ` rotate(${U}, ${d.width / 2}, ${d.height / 2})` : ""}`,
        style: j,
        onMouseDown: Z,
        onTouchStart: R.onTouchStart,
        "data-element-id": e.id,
        "data-element-type": e.type
      },
      // Element content - scale during resize for visual feedback
      $ ? m.createElement(
        "g",
        { transform: `scale(${M.x}, ${M.y})` },
        t
      ) : t,
      // Selection outline - use display bounds for accurate sizing
      h && m.createElement("rect", {
        className: "canvas-element__selection",
        x: -2,
        y: -2,
        width: d.width + 4,
        height: d.height + 4,
        fill: "none",
        stroke: v.colors.selection.stroke,
        strokeWidth: 1,
        strokeDasharray: "4 2",
        pointerEvents: "none"
      }),
      // Resize handles
      P.map(
        (N) => m.createElement("rect", {
          key: N.position,
          className: `canvas-element__handle canvas-element__handle--${N.position}`,
          x: N.x,
          y: N.y,
          width: Ee,
          height: Ee,
          fill: v.colors.handle.fill,
          stroke: v.colors.handle.stroke,
          strokeWidth: 1,
          cursor: Xt(N.position),
          onMouseDown: (C) => X(N.position, C)
        })
      ),
      // Rotation handle (circular, above the element)
      h && r && a && !l && m.createElement(
        "g",
        {
          key: "rotation-handle",
          className: "canvas-element__rotation-handle"
        },
        // Line connecting to element
        m.createElement("line", {
          x1: d.width / 2,
          y1: 0,
          x2: d.width / 2,
          y2: -25,
          stroke: v.colors.selection.stroke,
          strokeWidth: 1,
          pointerEvents: "none"
        }),
        // Rotation handle circle
        m.createElement("circle", {
          cx: d.width / 2,
          cy: -25,
          r: Ee / 2 + 2,
          fill: v.colors.handle.fill,
          stroke: v.colors.handle.stroke,
          strokeWidth: 1,
          cursor: "grab",
          onMouseDown: V
        })
      )
    );
  }
);
pe.displayName = "ElementBase";
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
function ke(e) {
  const t = re((n, s) => {
    const o = n, r = o.element, a = o.disabled, b = o.showHandles, x = o.enableRotation, I = o.onSelect, E = o.onDragStart, S = o.onDrag, k = o.onDragEnd, f = o.onResizeStart, y = o.onResize, u = o.onResizeEnd, w = o.onRotateStart, g = o.onRotate, i = o.onRotateEnd, v = o.className, l = o.style, {
      element: h,
      disabled: p,
      showHandles: z,
      enableRotation: T,
      onSelect: R,
      onDragStart: $,
      onDrag: _,
      onDragEnd: D,
      onResizeStart: L,
      onResize: O,
      onResizeEnd: F,
      onRotateStart: U,
      onRotate: d,
      onRotateEnd: M,
      className: P,
      style: X,
      ...V
    } = o, [Z, j] = m.useState({
      isSelected: !1,
      isDragging: !1,
      isResizing: !1,
      isRotating: !1
    }), N = m.useCallback((H) => {
      j((K) => ({ ...K, isSelected: H })), I?.(H);
    }, [I]), C = m.useCallback(() => {
      j((H) => ({ ...H, isDragging: !0 })), E?.();
    }, [E]), A = m.useCallback((H, K) => {
      j((ee) => ({ ...ee, isDragging: !1 })), k?.(H, K);
    }, [k]), B = m.useCallback(() => {
      j((H) => ({ ...H, isResizing: !0 })), f?.();
    }, [f]), W = m.useCallback((H, K, ee, te) => {
      j((J) => ({ ...J, isResizing: !1 })), u?.(H, K, ee, te);
    }, [u]), Y = m.useCallback(() => {
      j((H) => ({ ...H, isRotating: !0 })), w?.();
    }, [w]), Q = m.useCallback((H) => {
      j((K) => ({ ...K, isRotating: !1 })), i?.(H);
    }, [i]), q = {
      element: r,
      ...Z
    };
    return /* @__PURE__ */ ie(
      pe,
      {
        ref: s,
        element: r,
        disabled: a,
        showHandles: b,
        enableRotation: x,
        className: v,
        style: l,
        onSelect: N,
        onDragStart: C,
        onDrag: S,
        onDragEnd: A,
        onResizeStart: B,
        onResize: y,
        onResizeEnd: W,
        onRotateStart: Y,
        onRotate: g,
        onRotateEnd: Q,
        children: /* @__PURE__ */ ie(e, { ...q, ...V })
      }
    );
  });
  return t.displayName = `withElementBehavior(${e.displayName || e.name || "Component"})`, t;
}
const Vt = ({ element: e }) => {
  const { theme: t } = se(), { width: n, height: s, style: o } = e;
  return m.createElement("rect", {
    width: n,
    height: s,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal,
    rx: o?.cornerRadius ?? 0,
    ry: o?.cornerRadius ?? 0,
    opacity: o?.opacity ?? 1
  });
}, ze = ke(Vt);
ze.displayName = "Rectangle";
const jt = ({ element: e }) => {
  const { theme: t } = se(), { width: n, height: s, style: o } = e, r = n / 2, a = s / 2, b = n / 2, x = s / 2;
  return m.createElement("ellipse", {
    cx: r,
    cy: a,
    rx: b,
    ry: x,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal,
    opacity: o?.opacity ?? 1
  });
}, me = ke(jt);
me.displayName = "Ellipse";
const Yt = me;
Yt.displayName = "Circle";
const Kt = me;
Kt.displayName = "Oval";
const Gt = ({ element: e }) => {
  const { theme: t } = se(), { width: n, height: s, style: o } = e, r = [
    `${n / 2},0`,
    `${n},${s / 2}`,
    `${n / 2},${s}`,
    `0,${s / 2}`
  ].join(" ");
  return m.createElement("polygon", {
    points: r,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal,
    opacity: o?.opacity ?? 1
  });
}, Xe = ke(Gt);
Xe.displayName = "Diamond";
const Ve = re(
  ({
    element: e,
    disabled: t,
    showHandles: n,
    enableRotation: s,
    onSelect: o,
    onDragStart: r,
    onDrag: a,
    onDragEnd: b,
    onResizeStart: x,
    onResize: I,
    onResizeEnd: E,
    onRotateStart: S,
    onRotate: k,
    onRotateEnd: f,
    onTextChange: y,
    className: u,
    style: w
  }, g) => {
    const { theme: i } = se(), { updateElement: v } = ce(), [l, h] = ne(!1), [p, z] = ne(e.text ?? ""), T = oe(null), { width: R, height: $, style: _, text: D = "", fontSize: L, fontFamily: O, fontWeight: F, textAlign: U } = e, d = c((C) => {
      const A = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      A.style.position = "absolute", A.style.visibility = "hidden", A.style.pointerEvents = "none", document.body.appendChild(A);
      const B = document.createElementNS("http://www.w3.org/2000/svg", "text");
      B.setAttribute("font-size", String(L ?? i.fontSize.md)), B.setAttribute("font-family", O ?? "sans-serif"), B.setAttribute("font-weight", F ?? "normal");
      const W = C.split(`
`), Y = (L ?? i.fontSize.md) * 1.2;
      let Q = 0;
      W.forEach((ee, te) => {
        const J = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        J.textContent = ee || " ", J.setAttribute("x", "0"), J.setAttribute("dy", te === 0 ? "0" : String(Y)), B.appendChild(J);
      }), A.appendChild(B), Q = B.getBBox().width;
      const H = W.length * Y;
      document.body.removeChild(A);
      const K = 16;
      return {
        width: Math.max(Q + K, 40),
        // Minimum width
        height: Math.max(H + K, 24)
        // Minimum height
      };
    }, [L, O, F, i.fontSize.md]), M = c(() => {
      switch (U) {
        case "right":
          return "end";
        case "center":
          return "middle";
        default:
          return "start";
      }
    }, [U]), P = c(() => {
      switch (U) {
        case "right":
          return R;
        case "center":
          return R / 2;
        default:
          return 0;
      }
    }, [U, R]), X = c((C) => {
      e.locked || t || (C.stopPropagation(), C.preventDefault(), z(D), h(!0));
    }, [e.locked, t, D]), V = c(() => {
      const C = p.trim();
      if (C !== D || C !== "") {
        const A = d(C);
        v(e.id, {
          text: C,
          width: A.width,
          height: A.height
        }), y?.(C);
      }
      h(!1);
    }, [p, D, d, v, e.id, y]), Z = c(() => {
      z(D), h(!1);
    }, [D]), j = c((C) => {
      C.key === "Escape" ? (C.preventDefault(), Z()) : C.key === "Enter" && !C.shiftKey && (C.preventDefault(), V()), C.stopPropagation();
    }, [Z, V]);
    fe(() => {
      l && T.current && (T.current.focus(), T.current.select());
    }, [l]);
    const N = () => l ? m.createElement(
      "foreignObject",
      {
        x: 0,
        y: 0,
        width: R,
        height: $
      },
      m.createElement(
        "div",
        {
          xmlns: "http://www.w3.org/1999/xhtml",
          style: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: U === "center" ? "center" : U === "right" ? "flex-end" : "flex-start"
          }
        },
        m.createElement("textarea", {
          ref: T,
          value: p,
          onChange: (C) => z(C.target.value),
          onBlur: V,
          onKeyDown: j,
          style: {
            width: "100%",
            height: "100%",
            padding: "4px",
            border: `2px solid ${i.colors.selection.stroke}`,
            borderRadius: "2px",
            outline: "none",
            resize: "none",
            backgroundColor: i.colors.background,
            color: _?.fill ?? i.colors.text.primary,
            fontSize: L ?? i.fontSize.md,
            fontFamily: O ?? "sans-serif",
            fontWeight: F ?? "normal",
            textAlign: U ?? "left",
            boxSizing: "border-box"
          }
        })
      )
    ) : m.createElement(
      "g",
      { onDoubleClick: X },
      // Background (for selection area)
      m.createElement("rect", {
        width: R,
        height: $,
        fill: "transparent"
      }),
      // Text
      m.createElement(
        "text",
        {
          x: P(),
          y: $ / 2,
          dominantBaseline: "central",
          textAnchor: M(),
          fill: _?.fill ?? i.colors.text.primary,
          fontSize: L ?? i.fontSize.md,
          fontFamily: O ?? "sans-serif",
          fontWeight: F ?? "normal",
          opacity: _?.opacity ?? 1,
          style: { pointerEvents: "none" }
        },
        D
      )
    );
    return m.createElement(
      pe,
      {
        ref: g,
        element: e,
        children: N(),
        disabled: t || l,
        // Disable drag/resize while editing
        showHandles: n && !l,
        enableRotation: s,
        className: u,
        style: w,
        onSelect: o,
        onDragStart: r,
        onDrag: a,
        onDragEnd: b,
        onResizeStart: x,
        onResize: I,
        onResizeEnd: E,
        onRotateStart: S,
        onRotate: k,
        onRotateEnd: f
      }
    );
  }
);
Ve.displayName = "TextElement";
const Ce = 8, Te = 25, je = re(
  ({
    element: e,
    children: t,
    renderLine: n,
    className: s,
    style: o,
    disabled: r = !1,
    showHandles: a = !0,
    enableRotation: b = !0,
    onSelect: x,
    onDragStart: I,
    onDrag: E,
    onDragEnd: S,
    onPointsChange: k,
    onRotateStart: f,
    onRotate: y,
    onRotateEnd: u
  }, w) => {
    const { updateElement: g } = ce(), { theme: i } = se(), { screenToCanvas: v } = he(), l = e.locked || r, [h, p] = ne({
      isDragging: !1,
      endpointIndex: null,
      startPosition: null,
      currentPoints: null
    }), z = oe(null), T = G(() => e.points ?? [
      { x: 0, y: e.height / 2 },
      { x: e.width, y: e.height / 2 }
    ], [e.points, e.width, e.height]), { isSelected: R, handlers: $ } = Fe({
      id: e.id,
      disabled: l,
      onSelect: x
    }), { isDragging: _, dragState: D, handlers: L } = Ze({
      disabled: l || !R || h.isDragging,
      onDragStart: () => {
        I?.();
      },
      onDrag: (A, B) => {
        const W = e.x + B.x, Y = e.y + B.y;
        E?.(W, Y);
      },
      onDragEnd: (A, B) => {
        const W = e.x + B.x, Y = e.y + B.y;
        g(e.id, { x: W, y: Y }), S?.(W, Y);
      }
    }), { isRotating: O, rotateState: F, startRotate: U } = He({
      disabled: l || !R || !b,
      snapAngle: 15,
      onRotateStart: () => {
        f?.();
      },
      onRotate: (A) => {
        y?.(A);
      },
      onRotateEnd: (A) => {
        g(e.id, { rotation: A }), u?.(A);
      }
    }), d = G(() => O && F.currentAngle !== null ? F.currentAngle : e.rotation ?? 0, [O, F.currentAngle, e.rotation]), M = G(() => _ ? {
      x: e.x + D.delta.x,
      y: e.y + D.delta.y,
      width: e.width,
      height: e.height
    } : {
      x: e.x,
      y: e.y,
      width: e.width,
      height: e.height
    }, [_, D.delta, e.x, e.y, e.width, e.height]), P = G(() => h.isDragging && h.currentPoints ? h.currentPoints : T, [h.isDragging, h.currentPoints, T]), X = c(
      (A, B) => {
        if (l || !R) return;
        B.stopPropagation(), B.preventDefault();
        const W = v({ x: B.clientX, y: B.clientY });
        z.current = {
          endpointIndex: A,
          startMousePos: W,
          originalPoints: [...T]
        }, p({
          isDragging: !0,
          endpointIndex: A,
          startPosition: W,
          currentPoints: [...T]
        });
        const Y = (q) => {
          if (!z.current) return;
          const H = v({ x: q.clientX, y: q.clientY }), { endpointIndex: K, startMousePos: ee, originalPoints: te } = z.current, J = H.x - ee.x, be = H.y - ee.y, Re = te.map((le, Ie) => Ie === K ? { x: le.x + J, y: le.y + be } : { ...le });
          p((le) => ({
            ...le,
            currentPoints: Re
          }));
        }, Q = () => {
          z.current && (z.current, p((q) => {
            if (q.currentPoints) {
              const H = q.currentPoints, K = H.map((ue) => ue.x), ee = H.map((ue) => ue.y), te = Math.min(...K), J = Math.min(...ee), be = Math.max(...K), Re = Math.max(...ee), le = H.map((ue) => ({
                x: ue.x - te,
                y: ue.y - J
              })), Ie = Math.max(be - te, 1), ut = Math.max(Re - J, 1);
              g(e.id, {
                x: e.x + te,
                y: e.y + J,
                width: Ie,
                height: ut,
                points: le
              }), k?.(le);
            }
            return {
              isDragging: !1,
              endpointIndex: null,
              startPosition: null,
              currentPoints: null
            };
          }), z.current = null, document.removeEventListener("mousemove", Y), document.removeEventListener("mouseup", Q));
        };
        document.addEventListener("mousemove", Y), document.addEventListener("mouseup", Q);
      },
      [l, R, T, v, g, e.id, e.x, e.y, k]
    ), V = c(
      (A) => {
        const B = P[0], W = P[P.length - 1], Y = (B.x + W.x) / 2, Q = (B.y + W.y) / 2, q = M.x + Y, H = M.y + Q;
        U(
          { x: q, y: H },
          e.rotation ?? 0,
          A
        );
      },
      [U, M, P, e.rotation]
    ), Z = c(
      (A) => {
        $.onClick(A), R && !h.isDragging && L.onMouseDown(A);
      },
      [$, L, R, h.isDragging]
    ), j = {
      cursor: _ ? "grabbing" : R ? "grab" : "pointer",
      opacity: e.visible === !1 ? 0.5 : 1,
      ...o
    }, N = G(() => P.map((A) => ({ x: A.x, y: A.y })), [P]), C = G(() => {
      if (P.length < 2) return { cx: 0, cy: 0, x1: 0, y1: 0, x2: 0, y2: 0 };
      const A = P[0], B = P[P.length - 1], W = (A.x + B.x) / 2, Y = (A.y + B.y) / 2, Q = B.x - A.x, q = B.y - A.y, H = Math.sqrt(Q * Q + q * q) || 1, K = -q / H, ee = Q / H, te = W + K * Te, J = Y + ee * Te;
      return {
        cx: te,
        cy: J,
        x1: W,
        y1: Y,
        x2: te,
        y2: J
      };
    }, [P]);
    return m.createElement(
      "g",
      {
        ref: w,
        className: xe("canvas-element canvas-line", s, {
          "canvas-element--selected": R,
          "canvas-element--dragging": _,
          "canvas-element--endpoint-dragging": h.isDragging,
          "canvas-element--rotating": O,
          "canvas-element--locked": e.locked
        }),
        transform: `translate(${M.x}, ${M.y})${d ? ` rotate(${d}, ${M.width / 2}, ${M.height / 2})` : ""}`,
        style: j,
        onMouseDown: Z,
        onTouchStart: L.onTouchStart,
        "data-element-id": e.id,
        "data-element-type": e.type
      },
      // Render line with current points
      n(P, h.isDragging),
      // Endpoint handles (only when selected)
      R && a && !l && N.map(
        (A, B) => m.createElement("circle", {
          key: `endpoint-handle-${B}`,
          className: "canvas-line__endpoint-handle",
          cx: A.x,
          cy: A.y,
          r: Ce / 2 + 2,
          fill: i.colors.handle.fill,
          stroke: i.colors.handle.stroke,
          strokeWidth: 1.5,
          cursor: "move",
          onMouseDown: (W) => X(B, W)
        })
      ),
      // Rotation handle (perpendicular to line direction)
      R && a && b && !l && m.createElement(
        "g",
        {
          key: "rotation-handle",
          className: "canvas-line__rotation-handle"
        },
        // Line connecting to element center
        m.createElement("line", {
          x1: C.x1,
          y1: C.y1,
          x2: C.x2,
          y2: C.y2,
          stroke: i.colors.selection.stroke,
          strokeWidth: 1,
          pointerEvents: "none"
        }),
        // Rotation handle circle
        m.createElement("circle", {
          cx: C.cx,
          cy: C.cy,
          r: Ce / 2 + 2,
          fill: i.colors.handle.fill,
          stroke: i.colors.handle.stroke,
          strokeWidth: 1,
          cursor: "grab",
          onMouseDown: V
        })
      )
    );
  }
);
je.displayName = "LineBase";
const Ye = re(
  ({
    element: e,
    disabled: t,
    showHandles: n,
    enableRotation: s,
    onSelect: o,
    onDragStart: r,
    onDrag: a,
    onDragEnd: b,
    onPointsChange: x,
    onRotateStart: I,
    onRotate: E,
    onRotateEnd: S,
    className: k,
    style: f
  }, y) => {
    const { theme: u } = se(), { style: w, lineType: g = "solid" } = e, i = c(() => {
      switch (g) {
        case "dashed":
          return "8 4";
        case "dotted":
          return "2 2";
        default:
          return;
      }
    }, [g]), v = w?.stroke ?? u.colors.element.stroke, l = w?.strokeWidth ?? u.strokeWidth.normal, h = c((p, z) => {
      const T = p.map((R, $) => $ === 0 ? `M ${R.x} ${R.y}` : `L ${R.x} ${R.y}`).join(" ");
      return m.createElement(
        "g",
        null,
        // Invisible wider path for easier selection (follows the line shape)
        m.createElement("path", {
          d: T,
          fill: "none",
          stroke: "transparent",
          strokeWidth: 20,
          // Wide hit area
          strokeLinecap: "round"
        }),
        // Visible line
        m.createElement("path", {
          d: T,
          fill: "none",
          stroke: v,
          strokeWidth: l,
          strokeDasharray: i(),
          strokeLinecap: "round",
          strokeLinejoin: "round",
          opacity: w?.opacity ?? 1
        })
      );
    }, [v, l, i, w?.opacity]);
    return m.createElement(je, {
      ref: y,
      element: e,
      disabled: t,
      showHandles: n,
      enableRotation: s,
      className: k,
      style: f,
      onSelect: o,
      onDragStart: r,
      onDrag: a,
      onDragEnd: b,
      onPointsChange: x,
      onRotateStart: I,
      onRotate: E,
      onRotateEnd: S,
      renderLine: h
    });
  }
);
Ye.displayName = "Line";
const Ke = re(
  ({
    element: e,
    disabled: t,
    showHandles: n,
    enableRotation: s,
    onSelect: o,
    onDragStart: r,
    onDrag: a,
    onDragEnd: b,
    onResizeStart: x,
    onResize: I,
    onResizeEnd: E,
    onRotateStart: S,
    onRotate: k,
    onRotateEnd: f,
    onLabelChange: y,
    className: u,
    style: w
  }, g) => {
    const { theme: i } = se(), { updateElement: v } = ce(), [l, h] = ne(!1), [p, z] = ne(e.label ?? ""), T = oe(null), { width: R, height: $, style: _, label: D } = e, L = Math.min(R, $) * 0.15, O = R / 2, F = L * 2 + 4, U = $ * 0.6, d = F + (U - F) * 0.3, M = R * 0.4, P = R * 0.35, X = $ - 4, V = _?.stroke ?? i.colors.element.stroke, Z = _?.strokeWidth ?? i.strokeWidth.normal, j = c((W) => {
      e.locked || t || (W.stopPropagation(), W.preventDefault(), z(D ?? ""), h(!0));
    }, [e.locked, t, D]), N = c(() => {
      const W = p.trim();
      W !== D && (v(e.id, { label: W }), y?.(W)), h(!1);
    }, [p, D, v, e.id, y]), C = c(() => {
      z(D ?? ""), h(!1);
    }, [D]), A = c((W) => {
      W.key === "Escape" ? (W.preventDefault(), C()) : W.key === "Enter" && (W.preventDefault(), N()), W.stopPropagation();
    }, [C, N]);
    fe(() => {
      l && T.current && (T.current.focus(), T.current.select());
    }, [l]);
    const B = () => m.createElement(
      "g",
      { onDoubleClick: j },
      // Invisible background for selection
      m.createElement("rect", {
        width: R,
        height: $,
        fill: "transparent"
      }),
      // Head (circle)
      m.createElement("circle", {
        cx: O,
        cy: L + 2,
        r: L,
        fill: _?.fill ?? "none",
        stroke: V,
        strokeWidth: Z
      }),
      // Body (vertical line)
      m.createElement("line", {
        x1: O,
        y1: F,
        x2: O,
        y2: U,
        stroke: V,
        strokeWidth: Z
      }),
      // Arms (horizontal line)
      m.createElement("line", {
        x1: O - M,
        y1: d,
        x2: O + M,
        y2: d,
        stroke: V,
        strokeWidth: Z
      }),
      // Left leg
      m.createElement("line", {
        x1: O,
        y1: U,
        x2: O - P,
        y2: $ * 0.85,
        stroke: V,
        strokeWidth: Z
      }),
      // Right leg
      m.createElement("line", {
        x1: O,
        y1: U,
        x2: O + P,
        y2: $ * 0.85,
        stroke: V,
        strokeWidth: Z
      }),
      // Label - either input or text
      l ? m.createElement(
        "foreignObject",
        {
          x: 0,
          y: X - 16,
          width: R,
          height: 24
        },
        m.createElement("input", {
          ref: T,
          type: "text",
          value: p,
          onChange: (W) => z(W.target.value),
          onBlur: N,
          onKeyDown: A,
          style: {
            width: "100%",
            height: "100%",
            padding: "2px 4px",
            border: `2px solid ${i.colors.selection.stroke}`,
            borderRadius: "2px",
            outline: "none",
            backgroundColor: i.colors.background,
            color: i.colors.text.primary,
            fontSize: i.fontSize.sm,
            fontFamily: "sans-serif",
            textAlign: "center",
            boxSizing: "border-box"
          }
        })
      ) : D && m.createElement(
        "text",
        {
          x: O,
          y: X,
          textAnchor: "middle",
          dominantBaseline: "text-bottom",
          fill: _?.fill ?? i.colors.text.primary,
          fontSize: i.fontSize.sm,
          fontFamily: "sans-serif",
          style: { pointerEvents: "none" }
        },
        D
      )
    );
    return m.createElement(
      pe,
      {
        ref: g,
        element: e,
        children: B(),
        disabled: t || l,
        showHandles: n && !l,
        enableRotation: s,
        className: u,
        style: w,
        onSelect: o,
        onDragStart: r,
        onDrag: a,
        onDragEnd: b,
        onResizeStart: x,
        onResize: I,
        onResizeEnd: E,
        onRotateStart: S,
        onRotate: k,
        onRotateEnd: f
      }
    );
  }
);
Ke.displayName = "Actor";
const Ge = re(
  ({
    element: e,
    disabled: t,
    showHandles: n,
    enableRotation: s,
    onSelect: o,
    onDragStart: r,
    onDrag: a,
    onDragEnd: b,
    onResizeStart: x,
    onResize: I,
    onResizeEnd: E,
    onRotateStart: S,
    onRotate: k,
    onRotateEnd: f,
    onLabelChange: y,
    className: u,
    style: w
  }, g) => {
    const { theme: i } = se(), { updateElement: v } = ce(), [l, h] = ne(!1), [p, z] = ne(e.label ?? ""), T = oe(null), { width: R, height: $, style: _, label: D } = e, L = R / 2, O = 40, F = _?.stroke ?? i.colors.element.stroke, U = _?.strokeWidth ?? i.strokeWidth.normal, d = c((Z) => {
      e.locked || t || (Z.stopPropagation(), Z.preventDefault(), z(D ?? ""), h(!0));
    }, [e.locked, t, D]), M = c(() => {
      const Z = p.trim();
      Z !== D && (v(e.id, { label: Z }), y?.(Z)), h(!1);
    }, [p, D, v, e.id, y]), P = c(() => {
      z(D ?? ""), h(!1);
    }, [D]), X = c((Z) => {
      Z.key === "Escape" ? (Z.preventDefault(), P()) : Z.key === "Enter" && (Z.preventDefault(), M()), Z.stopPropagation();
    }, [P, M]);
    fe(() => {
      l && T.current && (T.current.focus(), T.current.select());
    }, [l]);
    const V = () => m.createElement(
      "g",
      { onDoubleClick: d },
      // Header box
      m.createElement("rect", {
        x: 0,
        y: 0,
        width: R,
        height: O,
        fill: _?.fill ?? i.colors.element.fill,
        stroke: F,
        strokeWidth: U
      }),
      // Label - either input or text
      l ? m.createElement(
        "foreignObject",
        {
          x: 4,
          y: (O - 24) / 2,
          width: R - 8,
          height: 24
        },
        m.createElement("input", {
          ref: T,
          type: "text",
          value: p,
          onChange: (Z) => z(Z.target.value),
          onBlur: M,
          onKeyDown: X,
          style: {
            width: "100%",
            height: "100%",
            padding: "2px 4px",
            border: `2px solid ${i.colors.selection.stroke}`,
            borderRadius: "2px",
            outline: "none",
            backgroundColor: i.colors.background,
            color: i.colors.text.primary,
            fontSize: i.fontSize.sm,
            fontFamily: "sans-serif",
            textAlign: "center",
            boxSizing: "border-box"
          }
        })
      ) : D && m.createElement(
        "text",
        {
          x: L,
          y: O / 2,
          textAnchor: "middle",
          dominantBaseline: "central",
          fill: i.colors.text.primary,
          fontSize: i.fontSize.sm,
          fontFamily: "sans-serif",
          style: { pointerEvents: "none" }
        },
        D
      ),
      // Dashed lifeline
      m.createElement("line", {
        x1: L,
        y1: O,
        x2: L,
        y2: $,
        stroke: F,
        strokeWidth: U,
        strokeDasharray: "8 4"
      })
    );
    return m.createElement(
      pe,
      {
        ref: g,
        element: e,
        children: V(),
        disabled: t || l,
        showHandles: n && !l,
        enableRotation: s,
        className: u,
        style: w,
        onSelect: o,
        onDragStart: r,
        onDrag: a,
        onDragEnd: b,
        onResizeStart: x,
        onResize: I,
        onResizeEnd: E,
        onRotateStart: S,
        onRotate: k,
        onRotateEnd: f
      }
    );
  }
);
Ge.displayName = "Lifeline";
const Je = re(
  ({
    element: e,
    disabled: t,
    showHandles: n,
    enableRotation: s,
    onSelect: o,
    onDragStart: r,
    onDrag: a,
    onDragEnd: b,
    onResizeStart: x,
    onResize: I,
    onResizeEnd: E,
    onRotateStart: S,
    onRotate: k,
    onRotateEnd: f,
    onLabelChange: y,
    className: u,
    style: w
  }, g) => {
    const { theme: i } = se(), { updateElement: v } = ce(), [l, h] = ne(!1), [p, z] = ne(e.label ?? ""), T = oe(null), { width: R, height: $, style: _, label: D, messageType: L = "sync" } = e, O = _?.stroke ?? i.colors.connection.line, F = _?.strokeWidth ?? i.strokeWidth.normal, U = 10, d = $ / 2, M = c((C) => {
      e.locked || t || (C.stopPropagation(), C.preventDefault(), z(D ?? ""), h(!0));
    }, [e.locked, t, D]), P = c(() => {
      const C = p.trim();
      C !== D && (v(e.id, { label: C }), y?.(C)), h(!1);
    }, [p, D, v, e.id, y]), X = c(() => {
      z(D ?? ""), h(!1);
    }, [D]), V = c((C) => {
      C.key === "Escape" ? (C.preventDefault(), X()) : C.key === "Enter" && (C.preventDefault(), P()), C.stopPropagation();
    }, [X, P]);
    fe(() => {
      l && T.current && (T.current.focus(), T.current.select());
    }, [l]);
    const Z = () => {
      switch (L) {
        case "return":
          return "8 4";
        case "create":
          return "4 2";
        default:
          return;
      }
    }, j = () => L === "async" ? m.createElement("polyline", {
      points: `${R - U},${d - U / 2} ${R},${d} ${R - U},${d + U / 2}`,
      fill: "none",
      stroke: O,
      strokeWidth: F
    }) : m.createElement("polygon", {
      points: `${R},${d} ${R - U},${d - U / 2} ${R - U},${d + U / 2}`,
      fill: O,
      stroke: O,
      strokeWidth: 1
    }), N = () => m.createElement(
      "g",
      { onDoubleClick: M },
      // Invisible background for selection
      m.createElement("rect", {
        width: R,
        height: $,
        fill: "transparent"
      }),
      // Main line
      m.createElement("line", {
        x1: 0,
        y1: d,
        x2: R - (L === "async" ? 0 : U / 2),
        y2: d,
        stroke: O,
        strokeWidth: F,
        strokeDasharray: Z()
      }),
      // Arrow head
      j(),
      // Label - either input or text
      l ? m.createElement(
        "foreignObject",
        {
          x: R / 4,
          y: d - 24,
          width: R / 2,
          height: 20
        },
        m.createElement("input", {
          ref: T,
          type: "text",
          value: p,
          onChange: (C) => z(C.target.value),
          onBlur: P,
          onKeyDown: V,
          style: {
            width: "100%",
            height: "100%",
            padding: "2px 4px",
            border: `2px solid ${i.colors.selection.stroke}`,
            borderRadius: "2px",
            outline: "none",
            backgroundColor: i.colors.background,
            color: i.colors.text.primary,
            fontSize: i.fontSize.sm,
            fontFamily: "sans-serif",
            textAlign: "center",
            boxSizing: "border-box"
          }
        })
      ) : D && m.createElement(
        "text",
        {
          x: R / 2,
          y: d - 8,
          textAnchor: "middle",
          dominantBaseline: "text-bottom",
          fill: i.colors.text.primary,
          fontSize: i.fontSize.sm,
          fontFamily: "sans-serif",
          style: { pointerEvents: "none" }
        },
        D
      )
    );
    return m.createElement(
      pe,
      {
        ref: g,
        element: e,
        children: N(),
        disabled: t || l,
        showHandles: n && !l,
        enableRotation: s,
        className: u,
        style: w,
        onSelect: o,
        onDragStart: r,
        onDrag: a,
        onDragEnd: b,
        onResizeStart: x,
        onResize: I,
        onResizeEnd: E,
        onRotateStart: S,
        onRotate: k,
        onRotateEnd: f
      }
    );
  }
);
Je.displayName = "Message";
const Jt = ({ element: e }) => {
  const { theme: t } = se(), { width: n, height: s, style: o } = e;
  return m.createElement("rect", {
    width: n || 12,
    // Default narrow width
    height: s,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal
  });
}, qe = ke(Jt);
qe.displayName = "ActivationBar";
const Me = {
  rectangle: ze,
  ellipse: me,
  circle: me,
  diamond: Xe,
  text: Ve,
  line: Ye,
  actor: Ke,
  lifeline: Ge,
  message: Je,
  activationBar: qe,
  // Default fallback for custom types
  custom: ze
}, Qe = re(
  ({
    width: e,
    height: t,
    className: n,
    style: s,
    showGrid: o,
    gridSize: r,
    onCanvasClick: a,
    onCanvasDoubleClick: b,
    children: x
  }, I) => {
    const { elements: E, config: S } = ce(), { clearSelection: k } = Se(), { viewport: f } = he(), { theme: y } = se(), u = e ?? S.width, w = t ?? S.height, g = o ?? S.grid?.visible, i = r ?? S.grid?.size ?? 20, v = G(() => De(E), [E]), l = c(
      (T) => {
        k(), a?.(T);
      },
      [k, a]
    ), h = () => {
      if (!g) return null;
      const T = "canvas-grid-pattern";
      return m.createElement(
        m.Fragment,
        null,
        m.createElement(
          "defs",
          null,
          m.createElement(
            "pattern",
            {
              id: T,
              width: i,
              height: i,
              patternUnits: "userSpaceOnUse"
            },
            m.createElement("path", {
              d: `M ${i} 0 L 0 0 0 ${i}`,
              fill: "none",
              stroke: y.colors.grid.line,
              strokeWidth: 0.5
            })
          )
        ),
        m.createElement("rect", {
          width: "100%",
          height: "100%",
          fill: `url(#${T})`,
          pointerEvents: "none"
          // Let clicks pass through to background
        })
      );
    }, p = () => m.createElement("rect", {
      className: "canvas-background",
      width: "100%",
      height: "100%",
      fill: "transparent",
      onMouseDown: l
    }), z = (T) => {
      const R = Me[T.type] ?? Me.custom;
      return m.createElement(R, {
        key: T.id,
        element: T
      });
    };
    return m.createElement(
      "svg",
      {
        ref: I,
        className: xe("canvas-drawing", n),
        width: u,
        height: w,
        viewBox: `0 0 ${u} ${w}`,
        style: {
          backgroundColor: y.colors.background,
          cursor: "default",
          userSelect: "none",
          ...s
        },
        onDoubleClick: b
      },
      // Transform group for zoom and pan
      m.createElement(
        "g",
        {
          transform: `translate(${f.pan.x}, ${f.pan.y}) scale(${f.zoom})`
        },
        // Background rect for capturing clicks on empty areas
        p(),
        // Grid (pointer-events: none, so clicks pass through)
        h(),
        // Elements
        v.map(z),
        // Additional children (e.g., selection boxes, connection handles)
        x
      )
    );
  }
);
Qe.displayName = "DrawingCanvas";
const et = re(
  ({
    width: e,
    height: t,
    readonly: n = !1,
    showGrid: s,
    gridSize: o,
    enableKeyboardShortcuts: r = !0,
    className: a,
    style: b,
    children: x
  }, I) => {
    const E = oe(null), S = ce(), k = Se(), f = he(), y = Ft();
    return Ht(
      r ? {
        undo: y.undo,
        redo: y.redo,
        delete: y.removeSelected,
        selectAll: () => k.selectAll(S.elements.map((u) => u.id)),
        copy: y.copy,
        paste: y.paste,
        cut: y.cut,
        escape: k.clearSelection,
        zoomIn: f.zoomIn,
        zoomOut: f.zoomOut,
        resetZoom: f.resetViewport
      } : {}
    ), ht(
      I,
      () => ({
        addElement: y.addElement,
        updateElement: y.updateElement,
        removeElement: y.removeElement,
        getElement: S.getElementById,
        getElementsByType: S.getElementsByType,
        select: k.select,
        selectMultiple: k.selectMultiple,
        clearSelection: k.clearSelection,
        getSelectedIds: () => k.selectedIds,
        zoomIn: f.zoomIn,
        zoomOut: f.zoomOut,
        setZoom: f.setZoom,
        resetViewport: f.resetViewport,
        undo: y.undo,
        redo: y.redo,
        canUndo: y.canUndo,
        canRedo: y.canRedo,
        toJSON: () => ({
          elements: S.elements,
          connections: S.connections
        }),
        toSVG: () => E.current?.outerHTML ?? "",
        toImage: async (u) => {
          if (!E.current)
            throw new Error("SVG element not available");
          return Oe(E.current, u);
        },
        fromJSON: (u) => {
          const w = Rt(u);
          return S.setElements(w.elements), S.setConnections(w.connections), k.clearSelection(), w;
        }
      }),
      [S, k, f, y]
    ), /* @__PURE__ */ pt(
      "div",
      {
        className: xe("canvas-container", a, {
          "canvas-container--readonly": n
        }),
        style: {
          position: "relative",
          overflow: "hidden",
          ...b
        },
        tabIndex: 0,
        children: [
          /* @__PURE__ */ ie(
            Qe,
            {
              ref: E,
              width: e,
              height: t,
              showGrid: s,
              gridSize: o
            }
          ),
          x
        ]
      }
    );
  }
);
et.displayName = "CanvasInner";
const qt = re(
  ({
    elements: e,
    connections: t,
    selectedIds: n,
    defaultElements: s = [],
    defaultConnections: o = [],
    config: r,
    theme: a = "light",
    initialViewport: b,
    maxHistorySize: x,
    onChange: I,
    onSelectionChange: E,
    ...S
  }, k) => /* @__PURE__ */ ie(
    Bt,
    {
      initialElements: s,
      initialConnections: o,
      elements: e,
      connections: t,
      selectedIds: n,
      config: r,
      theme: a,
      initialViewport: b,
      maxHistorySize: x,
      onElementsChange: I,
      onSelectionChange: E,
      children: /* @__PURE__ */ ie(et, { ...S, ref: k })
    }
  )
);
qt.displayName = "Canvas";
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
}, ae = (e, t = {}) => {
  const n = Ne[e] ?? Ne.custom;
  return {
    id: t.id ?? ve(),
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
}, tt = (e = {}) => ae("rectangle", e), nt = (e = {}) => ae("ellipse", e), ot = (e = {}) => {
  const t = e.width ?? e.height ?? 80;
  return ae("circle", { ...e, width: t, height: t });
}, st = (e = {}) => ae("diamond", e), rt = (e = {}) => {
  const { text: t, fontSize: n, fontFamily: s, fontWeight: o, textAlign: r, ...a } = e;
  return {
    ...ae("text", a),
    type: "text",
    text: t ?? "",
    fontSize: n,
    fontFamily: s,
    fontWeight: o,
    textAlign: r
  };
}, at = (e = {}) => {
  const { points: t, lineType: n, x: s, y: o, ...r } = e, a = r.width ?? 100;
  let b = t ?? [
    { x: s ?? 0, y: o ?? 0 },
    { x: (s ?? 0) + a, y: o ?? 0 }
  ];
  const x = b.map((l) => l.x), I = b.map((l) => l.y), E = Math.min(...x), S = Math.min(...I), k = Math.max(...x), f = Math.max(...I), y = b.map((l) => ({
    x: l.x - E,
    y: l.y - S
  })), u = k - E, w = f - S, g = Math.max(u, 10), i = Math.max(w, 10), v = y.map((l) => ({
    x: u < 10 ? l.x + (10 - u) / 2 : l.x,
    y: w < 10 ? l.y + (10 - w) / 2 : l.y
  }));
  return {
    ...ae("line", {
      ...r,
      x: u < 10 ? E - (10 - u) / 2 : E,
      y: w < 10 ? S - (10 - w) / 2 : S,
      width: g,
      height: i
    }),
    type: "line",
    points: v,
    lineType: n ?? "solid"
  };
}, it = (e = {}) => {
  const { label: t, ...n } = e;
  return {
    ...ae("actor", n),
    type: "actor",
    label: t
  };
}, ct = (e = {}) => {
  const { label: t, ...n } = e;
  return {
    ...ae("lifeline", n),
    type: "lifeline",
    label: t
  };
}, lt = (e = {}) => {
  const { label: t, messageType: n, fromId: s, toId: o, ...r } = e;
  return {
    ...ae("message", r),
    type: "message",
    label: t,
    messageType: n ?? "sync",
    fromId: s,
    toId: o
  };
}, dt = (e = {}) => ae("activationBar", e), Qt = (e, t = {}) => {
  switch (e) {
    case "rectangle":
      return tt(t);
    case "ellipse":
      return nt(t);
    case "circle":
      return ot(t);
    case "diamond":
      return st(t);
    case "text":
      return rt(t);
    case "line":
      return at(t);
    case "actor":
      return it(t);
    case "lifeline":
      return ct(t);
    case "message":
      return lt(t);
    case "activationBar":
      return dt(t);
    default:
      return ae(e, t);
  }
}, hn = {
  create: Qt,
  rectangle: tt,
  ellipse: nt,
  circle: ot,
  diamond: st,
  text: rt,
  line: at,
  actor: it,
  lifeline: ct,
  message: lt,
  activationBar: dt
};
export {
  qe as ActivationBar,
  Ke as Actor,
  qt as Canvas,
  $t as CanvasProvider,
  Yt as Circle,
  Bt as CombinedCanvasProvider,
  Xe as Diamond,
  Qe as DrawingCanvas,
  pe as ElementBase,
  hn as ElementFactory,
  me as Ellipse,
  Ot as HistoryProvider,
  Ge as Lifeline,
  Ye as Line,
  Je as Message,
  Kt as Oval,
  ze as Rectangle,
  Nt as SelectionProvider,
  Ve as TextElement,
  zt as ThemeProvider,
  Ct as ViewportProvider,
  sn as boundsIntersect,
  ft as bringToFront,
  dt as createActivationBar,
  it as createActor,
  ot as createCircle,
  st as createDiamond,
  Qt as createElement,
  nt as createEllipse,
  ct as createLifeline,
  at as createLine,
  lt as createMessage,
  tt as createRectangle,
  rt as createText,
  xe as cx,
  It as darkTheme,
  Ae as deepMerge,
  Rt as deserializeFromJSON,
  nn as distance,
  ln as downloadAsFile,
  dn as downloadAsImage,
  Oe as exportToImage,
  cn as exportToSVG,
  ve as generateId,
  mt as getResizeHandles,
  un as getThemeCSSVariables,
  on as isPointInBounds,
  de as lightTheme,
  xt as sendToBack,
  an as serializeToJSON,
  rn as snapToGrid,
  De as sortByZIndex,
  ce as useCanvas,
  Ft as useCanvasActions,
  Ht as useCanvasKeyboardShortcuts,
  Ze as useDraggable,
  Lt as useHistory,
  Zt as useKeyboard,
  Wt as useResizable,
  He as useRotatable,
  Fe as useSelectable,
  Se as useSelection,
  se as useTheme,
  he as useViewport,
  wt as validateCanvasData,
  ke as withElementBehavior
};
//# sourceMappingURL=index.js.map
