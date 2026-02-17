import E, { useMemo as V, useContext as ye, createContext as ge, useReducer as ve, useCallback as i, useState as ue, useRef as se, useEffect as De, forwardRef as ie, useImperativeHandle as ht } from "react";
import { jsx as oe, jsxs as mt } from "react/jsx-runtime";
const Ee = () => typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`, fe = (...e) => {
  const t = [];
  for (const n of e)
    if (n) {
      if (typeof n == "string" || typeof n == "number")
        t.push(String(n));
      else if (Array.isArray(n)) {
        const s = fe(...n);
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
const rn = (e, t) => {
  const n = t.x - e.x, s = t.y - e.y;
  return Math.sqrt(n * n + s * s);
}, an = (e, t) => e.x >= t.x && e.x <= t.x + t.width && e.y >= t.y && e.y <= t.y + t.height, cn = (e, t) => !(e.x + e.width < t.x || t.x + t.width < e.x || e.y + e.height < t.y || t.y + t.height < e.y), ln = (e, t) => Math.round(e / t) * t, pt = (e, t) => {
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
}, Ie = (e) => [...e].sort((t, n) => t.zIndex - n.zIndex), yt = (e) => e.length === 0 ? 0 : Math.max(...e.map((t) => t.zIndex)), gt = (e) => e.length === 0 ? 0 : Math.min(...e.map((t) => t.zIndex)), ft = (e, t) => {
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
  const n = Ie(e), s = n.findIndex((a) => a.id === t);
  if (s === -1 || s === n.length - 1) return e;
  const o = n[s], r = n[s + 1];
  return e.map((a) => a.id === o.id ? { ...a, zIndex: r.zIndex + 1 } : a);
}, vt = (e, t) => {
  const n = Ie(e), s = n.findIndex((a) => a.id === t);
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
}, Rt = "1.0.0", dn = (e, t, n) => JSON.stringify({
  version: Rt,
  elements: e,
  connections: t,
  metadata: n
}, null, 2), bt = (e) => {
  const t = JSON.parse(e), n = wt(t);
  if (!n.valid)
    throw new Error(`Invalid canvas data: ${n.errors.join(", ")}`);
  return t;
}, un = (e, t) => {
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
}, hn = (e, t, n) => {
  const s = new Blob([e], { type: n }), o = URL.createObjectURL(s), r = document.createElement("a");
  r.href = o, r.download = t, document.body.appendChild(r), r.click(), document.body.removeChild(r), URL.revokeObjectURL(o);
}, Oe = async (e, t = {}) => {
  const { format: n = "png", quality: s = 0.92, backgroundColor: o, scale: r = 1 } = t, a = e.getBoundingClientRect(), u = a.width * r, m = a.height * r, f = e.cloneNode(!0);
  f.setAttribute("xmlns", "http://www.w3.org/2000/svg"), f.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  const h = document.createElementNS("http://www.w3.org/2000/svg", "style");
  h.textContent = Le(e), f.insertBefore(h, f.firstChild);
  const S = new XMLSerializer().serializeToString(f), x = new Blob([S], { type: "image/svg+xml;charset=utf-8" }), g = URL.createObjectURL(x);
  return new Promise((l, R) => {
    const v = new Image();
    v.onload = () => {
      const c = document.createElement("canvas");
      c.width = u, c.height = m;
      const b = c.getContext("2d");
      if (!b) {
        URL.revokeObjectURL(g), R(new Error("Failed to get canvas context"));
        return;
      }
      const d = o ?? (n === "jpeg" ? "#ffffff" : "transparent");
      d !== "transparent" && (b.fillStyle = d, b.fillRect(0, 0, u, m)), b.scale(r, r), b.drawImage(v, 0, 0), c.toBlob(
        (y) => {
          URL.revokeObjectURL(g), y ? l(y) : R(new Error("Failed to create image blob"));
        },
        n === "jpeg" ? "image/jpeg" : "image/png",
        n === "jpeg" ? s : void 0
      );
    }, v.onerror = () => {
      URL.revokeObjectURL(g), R(new Error("Failed to load SVG as image"));
    }, v.src = g;
  });
}, mn = async (e, t, n = {}) => {
  const { format: s = "png" } = n, o = await Oe(e, n), r = URL.createObjectURL(o), a = document.createElement("a");
  a.href = r, a.download = `${t}.${s}`, document.body.appendChild(a), a.click(), document.body.removeChild(a), URL.revokeObjectURL(r);
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
}, _e = ge({
  theme: ce,
  themeName: "light"
}), te = () => {
  const e = ye(_e);
  if (!e)
    throw new Error("useTheme must be used within a ThemeProvider");
  return e;
}, Tt = ({ children: e, theme: t = "light" }) => {
  const n = V(() => t === "light" ? { theme: ce, themeName: "light" } : t === "dark" ? { theme: It, themeName: "dark" } : {
    theme: Ae(ce, t),
    themeName: "custom"
  }, [t]);
  return E.createElement(_e.Provider, { value: n }, e);
}, pn = (e) => ({
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
}, zt = (e, t) => {
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
}, Mt = ({
  children: e,
  initialViewport: t
}) => {
  const [n, s] = ve(zt, {
    ...Pe,
    ...t
  }), o = i((l) => {
    s({ type: "SET_ZOOM", payload: l });
  }, []), r = i(() => {
    s({ type: "ZOOM_IN" });
  }, []), a = i(() => {
    s({ type: "ZOOM_OUT" });
  }, []), u = i((l, R) => {
    s({ type: "ZOOM_TO_FIT", payload: { bounds: l, padding: R } });
  }, []), m = i((l) => {
    s({ type: "SET_PAN", payload: l });
  }, []), f = i((l) => {
    s({ type: "PAN_BY", payload: l });
  }, []), h = i(() => {
    s({ type: "RESET" });
  }, []), w = i(
    (l) => {
      s({ type: "SET_CONSTRAINTS", payload: l });
    },
    []
  ), S = i(
    (l) => ({
      x: (l.x - n.pan.x) / n.zoom,
      y: (l.y - n.pan.y) / n.zoom
    }),
    [n.zoom, n.pan]
  ), x = i(
    (l) => ({
      x: l.x * n.zoom + n.pan.x,
      y: l.y * n.zoom + n.pan.y
    }),
    [n.zoom, n.pan]
  ), g = V(
    () => ({
      viewport: n,
      setZoom: o,
      zoomIn: r,
      zoomOut: a,
      zoomToFit: u,
      setPan: m,
      panBy: f,
      resetViewport: h,
      setConstraints: w,
      screenToCanvas: S,
      canvasToScreen: x
    }),
    [
      n,
      o,
      r,
      a,
      u,
      m,
      f,
      h,
      w,
      S,
      x
    ]
  );
  return E.createElement($e.Provider, { value: g }, e);
}, Ct = {
  selectedIds: /* @__PURE__ */ new Set(),
  lastSelectedId: null
}, Nt = (e, t) => {
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
      return Ct;
    case "SELECT_ALL":
      return {
        selectedIds: new Set(t.payload),
        lastSelectedId: t.payload.length > 0 ? t.payload[t.payload.length - 1] : null
      };
    default:
      return e;
  }
}, Be = ge(null), we = () => {
  const e = ye(Be);
  if (!e)
    throw new Error("useSelection must be used within a SelectionProvider");
  return e;
}, Dt = ({
  children: e,
  initialSelection: t,
  onSelectionChange: n
}) => {
  const [s, o] = ve(Nt, {
    selectedIds: new Set(t ?? []),
    lastSelectedId: t?.[t.length - 1] ?? null
  }), r = V(() => Array.from(s.selectedIds), [s.selectedIds]);
  E.useEffect(() => {
    n?.(r);
  }, [r, n]);
  const a = i(
    (l) => s.selectedIds.has(l),
    [s.selectedIds]
  ), u = i((l) => {
    o({ type: "SELECT", payload: l });
  }, []), m = i((l) => {
    o({ type: "SELECT_MULTIPLE", payload: l });
  }, []), f = i((l) => {
    o({ type: "ADD_TO_SELECTION", payload: l });
  }, []), h = i((l) => {
    o({ type: "REMOVE_FROM_SELECTION", payload: l });
  }, []), w = i((l) => {
    o({ type: "TOGGLE_SELECTION", payload: l });
  }, []), S = i(() => {
    o({ type: "CLEAR_SELECTION" });
  }, []), x = i((l) => {
    o({ type: "SELECT_ALL", payload: l });
  }, []), g = V(
    () => ({
      selectedIds: r,
      lastSelectedId: s.lastSelectedId,
      selectionCount: s.selectedIds.size,
      hasSelection: s.selectedIds.size > 0,
      isSelected: a,
      select: u,
      selectMultiple: m,
      addToSelection: f,
      removeFromSelection: h,
      toggleSelection: w,
      clearSelection: S,
      selectAll: x
    }),
    [
      r,
      s.lastSelectedId,
      s.selectedIds.size,
      a,
      u,
      m,
      f,
      h,
      w,
      S,
      x
    ]
  );
  return E.createElement(Be.Provider, { value: g }, e);
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
  const [r, a] = ve(At, {
    past: [],
    present: {
      elements: t,
      connections: n,
      timestamp: Date.now()
    },
    future: [],
    maxHistorySize: s
  });
  E.useEffect(() => {
    o?.(r.present.elements, r.present.connections);
  }, [r.present, o]);
  const u = i((g, l) => {
    a({
      type: "PUSH",
      payload: {
        elements: g,
        connections: l,
        timestamp: Date.now()
      }
    });
  }, []), m = i(() => {
    a({ type: "UNDO" });
  }, []), f = i(() => {
    a({ type: "REDO" });
  }, []), h = i(() => {
    a({ type: "CLEAR" });
  }, []), w = i((g, l) => {
    a({
      type: "SET_PRESENT",
      payload: {
        elements: g,
        connections: l,
        timestamp: Date.now()
      }
    });
  }, []), S = i((g) => {
    a({ type: "SET_MAX_SIZE", payload: g });
  }, []), x = V(
    () => ({
      canUndo: r.past.length > 0,
      canRedo: r.future.length > 0,
      historySize: r.past.length,
      futureSize: r.future.length,
      present: r.present,
      pushState: u,
      undo: m,
      redo: f,
      clearHistory: h,
      setPresent: w,
      setMaxHistorySize: S
    }),
    [r.past.length, r.future.length, r.present, u, m, f, h, w, S]
  );
  return E.createElement(We.Provider, { value: x }, e);
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
}, Ue = ge(null), me = () => {
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
  const [r, a] = ve(Pt, {
    elements: t,
    connections: n,
    config: { ..._t, ...s }
  });
  E.useEffect(() => {
    o?.(r.elements, r.connections);
  }, [r.elements, r.connections, o]);
  const u = i(
    (p) => r.elements.find((T) => T.id === p),
    [r.elements]
  ), m = i(
    (p) => r.elements.filter((T) => T.type === p),
    [r.elements]
  ), f = i(
    (p) => {
      const T = p.id ?? Ee(), _ = r.elements.length > 0 ? Math.max(...r.elements.map((Z) => Z.zIndex)) : 0;
      return a({
        type: "ADD_ELEMENT",
        payload: { ...p, id: T, zIndex: p.zIndex ?? _ + 1 }
      }), T;
    },
    [r.elements]
  ), h = i(
    (p) => {
      const T = r.elements.length > 0 ? Math.max(...r.elements.map((Z) => Z.zIndex)) : 0, _ = p.map((Z, G) => ({
        ...Z,
        id: Z.id ?? Ee(),
        zIndex: Z.zIndex ?? T + 1 + G
      }));
      return a({ type: "ADD_ELEMENTS", payload: _ }), _.map((Z) => Z.id);
    },
    [r.elements]
  ), w = i((p, T) => {
    a({ type: "UPDATE_ELEMENT", payload: { id: p, updates: T } });
  }, []), S = i((p, T) => {
    a({ type: "UPDATE_ELEMENTS", payload: { ids: p, updates: T } });
  }, []), x = i((p) => {
    a({ type: "REMOVE_ELEMENT", payload: p });
  }, []), g = i((p) => {
    a({ type: "REMOVE_ELEMENTS", payload: p });
  }, []), l = i((p, T, _) => {
    a({ type: "MOVE_ELEMENT", payload: { id: p, x: T, y: _ } });
  }, []), R = i((p, T, _) => {
    a({ type: "MOVE_ELEMENTS", payload: { ids: p, deltaX: T, deltaY: _ } });
  }, []), v = i(
    (p, T, _, Z, G) => {
      a({ type: "RESIZE_ELEMENT", payload: { id: p, width: T, height: _, x: Z, y: G } });
    },
    []
  ), c = i((p) => {
    a({ type: "BRING_TO_FRONT", payload: p });
  }, []), b = i((p) => {
    a({ type: "SEND_TO_BACK", payload: p });
  }, []), d = i((p) => {
    a({ type: "MOVE_UP", payload: p });
  }, []), y = i((p) => {
    a({ type: "MOVE_DOWN", payload: p });
  }, []), k = i((p) => {
    a({ type: "SET_ELEMENTS", payload: p });
  }, []), I = i(
    (p) => r.connections.find((T) => T.id === p),
    [r.connections]
  ), C = i(
    (p) => r.connections.filter(
      (T) => T.fromId === p || T.toId === p
    ),
    [r.connections]
  ), M = i(
    (p) => {
      const T = p.id ?? Ee();
      return a({
        type: "ADD_CONNECTION",
        payload: { ...p, id: T }
      }), T;
    },
    []
  ), B = i((p, T) => {
    a({ type: "UPDATE_CONNECTION", payload: { id: p, updates: T } });
  }, []), $ = i((p) => {
    a({ type: "REMOVE_CONNECTION", payload: p });
  }, []), L = i((p) => {
    a({ type: "SET_CONNECTIONS", payload: p });
  }, []), O = i((p) => {
    a({ type: "UPDATE_CONFIG", payload: p });
  }, []), W = i(() => {
    a({ type: "CLEAR_CANVAS" });
  }, []), F = i((p, T) => {
    a({ type: "LOAD_STATE", payload: { elements: p, connections: T } });
  }, []), Y = V(
    () => ({
      elements: r.elements,
      connections: r.connections,
      config: r.config,
      getElementById: u,
      getElementsByType: m,
      addElement: f,
      addElements: h,
      updateElement: w,
      updateElements: S,
      removeElement: x,
      removeElements: g,
      moveElement: l,
      moveElements: R,
      resizeElement: v,
      bringToFront: c,
      sendToBack: b,
      moveUp: d,
      moveDown: y,
      setElements: k,
      getConnectionById: I,
      getConnectionsForElement: C,
      addConnection: M,
      updateConnection: B,
      removeConnection: $,
      setConnections: L,
      updateConfig: O,
      clearCanvas: W,
      loadState: F
    }),
    [
      r.elements,
      r.connections,
      r.config,
      u,
      m,
      f,
      h,
      w,
      S,
      x,
      g,
      l,
      R,
      v,
      c,
      b,
      d,
      y,
      k,
      I,
      C,
      M,
      B,
      $,
      L,
      O,
      W,
      F
    ]
  );
  return E.createElement(Ue.Provider, { value: Y }, e);
}, Bt = ({
  children: e,
  initialElements: t = [],
  initialConnections: n = [],
  config: s,
  theme: o = "light",
  initialViewport: r,
  maxHistorySize: a = 50,
  onElementsChange: u,
  onSelectionChange: m,
  elements: f,
  connections: h,
  selectedIds: w
}) => {
  const S = f ?? t, x = h ?? n;
  return /* @__PURE__ */ oe(Tt, { theme: o, children: /* @__PURE__ */ oe(Mt, { initialViewport: r, children: /* @__PURE__ */ oe(
    Dt,
    {
      initialSelection: w,
      onSelectionChange: m,
      children: /* @__PURE__ */ oe(
        Ot,
        {
          initialElements: S,
          initialConnections: x,
          maxHistorySize: a,
          children: /* @__PURE__ */ oe(
            $t,
            {
              initialElements: S,
              initialConnections: x,
              config: s,
              onChange: u,
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
  } = e, [a, u] = ue({
    isDragging: !1,
    startPosition: null,
    currentPosition: null,
    delta: { x: 0, y: 0 }
  }), m = se(null), f = se(!1), { screenToCanvas: h } = he(), w = i(
    (v) => {
      if ("touches" in v) {
        const c = v.touches[0] || v.changedTouches[0];
        return h({ x: c.clientX, y: c.clientY });
      }
      return h({ x: v.clientX, y: v.clientY });
    },
    [h]
  ), S = i(
    (v) => {
      if (!m.current) return;
      const c = w(v), b = {
        x: c.x - m.current.x,
        y: c.y - m.current.y
      };
      if (!f.current) {
        if (Math.sqrt(b.x ** 2 + b.y ** 2) < r) return;
        f.current = !0, t?.(m.current);
      }
      u({
        isDragging: !0,
        startPosition: m.current,
        currentPosition: c,
        delta: b
      }), n?.(c, b);
    },
    [w, r, t, n]
  ), x = i(
    (v) => {
      if (!m.current) return;
      const c = w(v), b = {
        x: c.x - m.current.x,
        y: c.y - m.current.y
      };
      f.current && s?.(c, b), u({
        isDragging: !1,
        startPosition: null,
        currentPosition: null,
        delta: { x: 0, y: 0 }
      }), m.current = null, f.current = !1, document.removeEventListener("mousemove", S), document.removeEventListener("mouseup", x), document.removeEventListener("touchmove", S), document.removeEventListener("touchend", x);
    },
    [w, S, s]
  ), g = i(
    (v, c) => {
      if (o) return;
      const b = h({ x: v, y: c });
      m.current = b, f.current = !1, u({
        isDragging: !1,
        startPosition: b,
        currentPosition: b,
        delta: { x: 0, y: 0 }
      }), document.addEventListener("mousemove", S), document.addEventListener("mouseup", x), document.addEventListener("touchmove", S, { passive: !1 }), document.addEventListener("touchend", x);
    },
    [o, h, S, x]
  ), l = i(
    (v) => {
      v.button === 0 && (v.preventDefault(), v.stopPropagation(), g(v.clientX, v.clientY));
    },
    [g]
  ), R = i(
    (v) => {
      if (v.touches.length !== 1) return;
      const c = v.touches[0];
      g(c.clientX, c.clientY);
    },
    [g]
  );
  return {
    dragState: a,
    handlers: {
      onMouseDown: l,
      onTouchStart: R
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
    maxWidth: u = 1 / 0,
    maxHeight: m = 1 / 0,
    maintainAspectRatio: f = !1,
    aspectRatio: h
  } = e, [w, S] = ue({
    isResizing: !1,
    handle: null,
    startBounds: null,
    currentBounds: null
  }), x = se(null), { screenToCanvas: g } = he(), l = i(
    (d) => {
      if ("touches" in d) {
        const y = d.touches[0] || d.changedTouches[0];
        return g({ x: y.clientX, y: y.clientY });
      }
      return g({ x: d.clientX, y: d.clientY });
    },
    [g]
  ), R = i(
    (d) => {
      if (!x.current)
        return { x: 0, y: 0, width: 0, height: 0 };
      const { position: y, bounds: k, handle: I } = x.current, C = d.x - y.x, M = d.y - y.y;
      let B = k.x, $ = k.y, L = k.width, O = k.height;
      switch (I) {
        case "nw":
          B = k.x + C, $ = k.y + M, L = k.width - C, O = k.height - M;
          break;
        case "n":
          $ = k.y + M, O = k.height - M;
          break;
        case "ne":
          $ = k.y + M, L = k.width + C, O = k.height - M;
          break;
        case "e":
          L = k.width + C;
          break;
        case "se":
          L = k.width + C, O = k.height + M;
          break;
        case "s":
          O = k.height + M;
          break;
        case "sw":
          B = k.x + C, L = k.width - C, O = k.height + M;
          break;
        case "w":
          B = k.x + C, L = k.width - C;
          break;
      }
      if (L < r && (I.includes("w") && (B = k.x + k.width - r), L = r), O < a && (I.includes("n") && ($ = k.y + k.height - a), O = a), L > u && (L = u), O > m && (O = m), f && x.current.aspectRatio) {
        const W = x.current.aspectRatio;
        L / O > W ? L = O * W : O = L / W;
      }
      return { x: B, y: $, width: L, height: O };
    },
    [r, a, u, m, f]
  ), v = i(
    (d) => {
      if (!x.current) return;
      const y = l(d), k = R(y);
      S((I) => ({
        ...I,
        currentBounds: k
      })), n?.(k);
    },
    [l, R, n]
  ), c = i(
    (d) => {
      if (!x.current) return;
      const y = l(d), k = R(y);
      s?.(k), S({
        isResizing: !1,
        handle: null,
        startBounds: null,
        currentBounds: null
      }), x.current = null, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", c), document.removeEventListener("touchmove", v), document.removeEventListener("touchend", c);
    },
    [l, R, v, s]
  ), b = i(
    (d, y, k) => {
      if (o) return;
      k.preventDefault(), k.stopPropagation();
      const I = "touches" in k ? k.touches[0].clientX : k.clientX, C = "touches" in k ? k.touches[0].clientY : k.clientY, M = g({ x: I, y: C });
      x.current = {
        position: M,
        bounds: y,
        handle: d,
        aspectRatio: h ?? y.width / y.height
      }, S({
        isResizing: !0,
        handle: d,
        startBounds: y,
        currentBounds: y
      }), t?.(d), document.addEventListener("mousemove", v), document.addEventListener("mouseup", c), document.addEventListener("touchmove", v, { passive: !1 }), document.addEventListener("touchend", c);
    },
    [
      o,
      g,
      h,
      t,
      v,
      c
    ]
  );
  return {
    resizeState: w,
    startResize: b,
    isResizing: w.isResizing
  };
}, Xe = (e = {}) => {
  const {
    onRotateStart: t,
    onRotate: n,
    onRotateEnd: s,
    disabled: o = !1,
    snapAngle: r
  } = e, [a, u] = ue({
    isRotating: !1,
    startAngle: null,
    currentAngle: null,
    deltaAngle: 0
  }), m = se(null), { screenToCanvas: f } = he(), h = i(
    (R) => {
      if ("touches" in R) {
        const v = R.touches[0] || R.changedTouches[0];
        return f({ x: v.clientX, y: v.clientY });
      }
      return f({ x: R.clientX, y: R.clientY });
    },
    [f]
  ), w = i((R, v) => {
    const c = v.x - R.x, b = v.y - R.y;
    return Math.atan2(b, c) * (180 / Math.PI);
  }, []), S = i(
    (R) => r ? Math.round(R / r) * r : R,
    [r]
  ), x = i(
    (R) => {
      if (!m.current || o) return;
      const v = h(R), { center: c, startMouseAngle: b, initialRotation: d } = m.current;
      let k = w(c, v) - b, I = d + k;
      I = (I % 360 + 360) % 360, R.shiftKey && r && (I = S(I)), u({
        isRotating: !0,
        startAngle: d,
        currentAngle: I,
        deltaAngle: I - d
      }), n?.(I, I - d);
    },
    [o, h, w, r, S, n]
  ), g = i(
    (R) => {
      if (!m.current) return;
      const v = h(R), { center: c, startMouseAngle: b, initialRotation: d } = m.current;
      let k = w(c, v) - b, I = d + k;
      I = (I % 360 + 360) % 360, R.shiftKey && r && (I = S(I)), s?.(I), u({
        isRotating: !1,
        startAngle: null,
        currentAngle: null,
        deltaAngle: 0
      }), m.current = null, document.removeEventListener("mousemove", x), document.removeEventListener("mouseup", g), document.removeEventListener("touchmove", x), document.removeEventListener("touchend", g);
    },
    [
      h,
      w,
      r,
      S,
      s,
      x
    ]
  ), l = i(
    (R, v, c) => {
      if (o) return;
      c.stopPropagation(), c.preventDefault();
      const b = h(
        c.nativeEvent
      ), d = w(R, b);
      m.current = {
        center: R,
        startMouseAngle: d,
        initialRotation: v
      }, u({
        isRotating: !0,
        startAngle: v,
        currentAngle: v,
        deltaAngle: 0
      }), t?.(v), document.addEventListener("mousemove", x), document.addEventListener("mouseup", g), document.addEventListener("touchmove", x), document.addEventListener("touchend", g);
    },
    [
      o,
      h,
      w,
      t,
      x,
      g
    ]
  );
  return {
    rotateState: a,
    startRotate: l,
    isRotating: a.isRotating
  };
}, He = (e) => {
  const { id: t, disabled: n = !1, onSelect: s } = e, {
    isSelected: o,
    select: r,
    addToSelection: a,
    removeFromSelection: u,
    toggleSelection: m,
    clearSelection: f
  } = we(), h = o(t), w = i(() => {
    n || (r(t), s?.(!0));
  }, [n, t, r, s]), S = i(() => {
    n || (u(t), s?.(!1));
  }, [n, t, u, s]), x = i(() => {
    if (n) return;
    const l = !h;
    m(t), s?.(l);
  }, [n, t, h, m, s]), g = i(
    (l) => {
      n || (l.stopPropagation(), l.ctrlKey || l.metaKey ? (m(t), s?.(!h)) : l.shiftKey ? (a(t), s?.(!0)) : (r(t), s?.(!0)));
    },
    [
      n,
      t,
      h,
      m,
      a,
      r,
      s
    ]
  );
  return {
    isSelected: h,
    handlers: {
      onClick: g
    },
    select: w,
    deselect: S,
    toggle: x
  };
}, Ut = (e, t) => {
  const n = e.key.toLowerCase() === t.key.toLowerCase();
  t.ctrl ? e.ctrlKey : !e.ctrlKey || t.meta, t.meta ? e.metaKey : !e.metaKey || t.ctrl;
  const s = t.shift ? e.shiftKey : !e.shiftKey, o = t.alt ? e.altKey : !e.altKey, r = t.ctrl || t.meta ? !!(t.ctrl && (e.ctrlKey || e.metaKey)) || !!(t.meta && e.metaKey) : !e.ctrlKey && !e.metaKey;
  return n && r && s && o;
}, Zt = (e = {}) => {
  const { shortcuts: t = [], enabled: n = !0, targetRef: s } = e, o = se(t);
  o.current = t;
  const r = i(
    (a) => {
      if (n) {
        for (const u of o.current)
          if (Ut(a, u)) {
            u.preventDefault !== !1 && a.preventDefault(), u.action();
            return;
          }
      }
    },
    [n]
  );
  De(() => {
    const a = s?.current ?? document;
    return a.addEventListener("keydown", r), () => {
      a.removeEventListener("keydown", r);
    };
  }, [r, s]);
}, Xt = (e) => {
  const t = [];
  e.undo && t.push({ key: "z", ctrl: !0, action: e.undo }), e.redo && (t.push({ key: "z", ctrl: !0, shift: !0, action: e.redo }), t.push({ key: "y", ctrl: !0, action: e.redo })), e.delete && (t.push({ key: "Delete", action: e.delete }), t.push({ key: "Backspace", action: e.delete })), e.selectAll && t.push({ key: "a", ctrl: !0, action: e.selectAll }), e.copy && t.push({ key: "c", ctrl: !0, action: e.copy }), e.paste && t.push({ key: "v", ctrl: !0, action: e.paste }), e.cut && t.push({ key: "x", ctrl: !0, action: e.cut }), e.escape && t.push({ key: "Escape", action: e.escape }), e.zoomIn && (t.push({ key: "+", ctrl: !0, action: e.zoomIn }), t.push({ key: "=", ctrl: !0, action: e.zoomIn })), e.zoomOut && t.push({ key: "-", ctrl: !0, action: e.zoomOut }), e.resetZoom && t.push({ key: "0", ctrl: !0, action: e.resetZoom }), Zt({ shortcuts: t });
}, Ht = () => {
  const e = me(), t = we(), n = Lt(), s = se(null), o = i(() => {
    n.pushState(e.elements, e.connections);
  }, [n, e.elements, e.connections]), r = i(
    (c) => (o(), e.addElement(c)),
    [e, o]
  ), a = i(
    (c, b) => {
      o(), e.updateElement(c, b);
    },
    [e, o]
  ), u = i(
    (c) => {
      o(), e.removeElement(c);
    },
    [e, o]
  ), m = i(() => {
    t.selectedIds.length !== 0 && (o(), e.removeElements(t.selectedIds), t.clearSelection());
  }, [e, t, o]), f = i(
    (c, b) => {
      t.selectedIds.length !== 0 && (o(), e.moveElements(t.selectedIds, c, b));
    },
    [e, t, o]
  ), h = i(() => {
    if (t.selectedIds.length === 0) return [];
    o();
    const b = e.elements.filter(
      (y) => t.selectedIds.includes(y.id)
    ).map((y) => ({
      ...y,
      id: void 0,
      // Will be auto-generated
      x: y.x + 20,
      y: y.y + 20
    })), d = e.addElements(b);
    return t.selectMultiple(d), d;
  }, [e, t, o]), w = i(
    (c) => (o(), e.addConnection(c)),
    [e, o]
  ), S = i(
    (c) => {
      o(), e.removeConnection(c);
    },
    [e, o]
  ), x = i(() => {
    if (t.selectedIds.length === 0) return;
    const c = e.elements.filter(
      (y) => t.selectedIds.includes(y.id)
    ), b = new Set(t.selectedIds), d = e.connections.filter(
      (y) => b.has(y.fromId) && b.has(y.toId)
    );
    s.current = {
      elements: c,
      connections: d
    };
  }, [e.elements, e.connections, t.selectedIds]), g = i(() => {
    x(), m();
  }, [x, m]), l = i(() => {
    if (!s.current) return;
    o();
    const c = /* @__PURE__ */ new Map(), b = s.current.elements.map((y) => ({
      ...y,
      id: void 0,
      x: y.x + 20,
      y: y.y + 20
    })), d = e.addElements(b);
    s.current.elements.forEach((y, k) => {
      c.set(y.id, d[k]);
    }), s.current.connections.forEach((y) => {
      const k = c.get(y.fromId), I = c.get(y.toId);
      k && I && e.addConnection({
        ...y,
        id: void 0,
        fromId: k,
        toId: I
      });
    }), t.selectMultiple(d);
  }, [e, t, o]), R = i(() => {
    n.canUndo && (n.undo(), e.loadState(n.present.elements, n.present.connections));
  }, [n, e]), v = i(() => {
    n.canRedo && (n.redo(), e.loadState(n.present.elements, n.present.connections));
  }, [n, e]);
  return {
    addElement: r,
    updateElement: a,
    removeElement: u,
    removeSelected: m,
    moveSelected: f,
    duplicateSelected: h,
    addConnection: w,
    removeConnection: S,
    copy: x,
    cut: g,
    paste: l,
    hasCopied: s.current !== null,
    undo: R,
    redo: v,
    canUndo: n.canUndo,
    canRedo: n.canRedo
  };
}, xe = 8, Te = ie(
  ({
    element: e,
    children: t,
    className: n,
    style: s,
    disabled: o = !1,
    showHandles: r = !0,
    enableRotation: a = !0,
    onSelect: u,
    onDragStart: m,
    onDrag: f,
    onDragEnd: h,
    onResizeStart: w,
    onResize: S,
    onResizeEnd: x,
    onRotateStart: g,
    onRotate: l,
    onRotateEnd: R
  }, v) => {
    const { updateElement: c } = me(), { theme: b } = te(), d = e.locked || o, { isSelected: y, handlers: k } = He({
      id: e.id,
      disabled: d,
      onSelect: u
    }), { isDragging: I, dragState: C, handlers: M } = Ze({
      disabled: d || !y,
      onDragStart: () => {
        m?.();
      },
      onDrag: (N, D) => {
        const z = e.x + D.x, A = e.y + D.y;
        f?.(z, A);
      },
      onDragEnd: (N, D) => {
        const z = e.x + D.x, A = e.y + D.y;
        c(e.id, { x: z, y: A }), h?.(z, A);
      }
    }), { isResizing: B, resizeState: $, startResize: L } = Wt({
      disabled: d || !y,
      minWidth: e.minWidth ?? 20,
      minHeight: e.minHeight ?? 20,
      maxWidth: e.maxWidth,
      maxHeight: e.maxHeight,
      onResizeStart: () => {
        w?.();
      },
      onResize: (N) => {
        S?.(N.width, N.height, N.x, N.y);
      },
      onResizeEnd: (N) => {
        c(e.id, {
          x: N.x,
          y: N.y,
          width: N.width,
          height: N.height
        }), x?.(N.width, N.height, N.x, N.y);
      }
    }), { isRotating: O, rotateState: W, startRotate: F } = Xe({
      disabled: d || !y || !a,
      snapAngle: 15,
      onRotateStart: () => {
        g?.();
      },
      onRotate: (N) => {
        l?.(N);
      },
      onRotateEnd: (N) => {
        c(e.id, { rotation: N }), R?.(N);
      }
    }), Y = V(() => O && W.currentAngle !== null ? W.currentAngle : e.rotation ?? 0, [O, W.currentAngle, e.rotation]), p = V(() => B && $.currentBounds ? $.currentBounds : I ? {
      x: e.x + C.delta.x,
      y: e.y + C.delta.y,
      width: e.width,
      height: e.height
    } : {
      x: e.x,
      y: e.y,
      width: e.width,
      height: e.height
    }, [B, $.currentBounds, I, C.delta, e.x, e.y, e.width, e.height]), T = V(() => !B || !$.currentBounds ? { x: 1, y: 1 } : {
      x: $.currentBounds.width / e.width,
      y: $.currentBounds.height / e.height
    }, [B, $.currentBounds, e.width, e.height]), _ = V(() => !y || !r || d ? [] : pt(
      { x: 0, y: 0, width: p.width, height: p.height },
      xe
    ), [y, r, d, p.width, p.height]), Z = i(
      (N, D) => {
        L(
          N,
          { x: e.x, y: e.y, width: e.width, height: e.height },
          D
        );
      },
      [L, e]
    ), G = i(
      (N) => {
        const D = p.x + p.width / 2, z = p.y + p.height / 2;
        F(
          { x: D, y: z },
          e.rotation ?? 0,
          N
        );
      },
      [F, p, e.rotation]
    ), re = i(
      (N) => {
        k.onClick(N), y && M.onMouseDown(N);
      },
      [k, M, y]
    ), J = {
      cursor: I ? "grabbing" : y ? "grab" : "pointer",
      opacity: e.visible === !1 ? 0.5 : 1,
      ...s
    };
    return E.createElement(
      "g",
      {
        ref: v,
        className: fe("canvas-element", n, {
          "canvas-element--selected": y,
          "canvas-element--dragging": I,
          "canvas-element--resizing": B,
          "canvas-element--rotating": O,
          "canvas-element--locked": e.locked
        }),
        transform: `translate(${p.x}, ${p.y})${Y ? ` rotate(${Y}, ${p.width / 2}, ${p.height / 2})` : ""}`,
        style: J,
        onMouseDown: re,
        onTouchStart: M.onTouchStart,
        "data-element-id": e.id,
        "data-element-type": e.type
      },
      // Element content - scale during resize for visual feedback
      B ? E.createElement(
        "g",
        { transform: `scale(${T.x}, ${T.y})` },
        t
      ) : t,
      // Selection outline - use display bounds for accurate sizing
      y && E.createElement("rect", {
        className: "canvas-element__selection",
        x: -2,
        y: -2,
        width: p.width + 4,
        height: p.height + 4,
        fill: "none",
        stroke: b.colors.selection.stroke,
        strokeWidth: 1,
        strokeDasharray: "4 2",
        pointerEvents: "none"
      }),
      // Resize handles
      _.map(
        (N) => E.createElement("rect", {
          key: N.position,
          className: `canvas-element__handle canvas-element__handle--${N.position}`,
          x: N.x,
          y: N.y,
          width: xe,
          height: xe,
          fill: b.colors.handle.fill,
          stroke: b.colors.handle.stroke,
          strokeWidth: 1,
          cursor: Vt(N.position),
          onMouseDown: (D) => Z(N.position, D)
        })
      ),
      // Rotation handle (circular, above the element)
      y && r && a && !d && E.createElement(
        "g",
        {
          key: "rotation-handle",
          className: "canvas-element__rotation-handle"
        },
        // Line connecting to element
        E.createElement("line", {
          x1: p.width / 2,
          y1: 0,
          x2: p.width / 2,
          y2: -25,
          stroke: b.colors.selection.stroke,
          strokeWidth: 1,
          pointerEvents: "none"
        }),
        // Rotation handle circle
        E.createElement("circle", {
          cx: p.width / 2,
          cy: -25,
          r: xe / 2 + 2,
          fill: b.colors.handle.fill,
          stroke: b.colors.handle.stroke,
          strokeWidth: 1,
          cursor: "grab",
          onMouseDown: G
        })
      )
    );
  }
);
Te.displayName = "ElementBase";
function Vt(e) {
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
function le(e) {
  const t = ie((n, s) => {
    const o = n, r = o.element, a = o.disabled, u = o.showHandles, m = o.enableRotation, f = o.onSelect, h = o.onDragStart, w = o.onDrag, S = o.onDragEnd, x = o.onResizeStart, g = o.onResize, l = o.onResizeEnd, R = o.onRotateStart, v = o.onRotate, c = o.onRotateEnd, b = o.className, d = o.style, {
      element: y,
      disabled: k,
      showHandles: I,
      enableRotation: C,
      onSelect: M,
      onDragStart: B,
      onDrag: $,
      onDragEnd: L,
      onResizeStart: O,
      onResize: W,
      onResizeEnd: F,
      onRotateStart: Y,
      onRotate: p,
      onRotateEnd: T,
      className: _,
      style: Z,
      ...G
    } = o, [re, J] = E.useState({
      isSelected: !1,
      isDragging: !1,
      isResizing: !1,
      isRotating: !1
    }), N = E.useCallback((P) => {
      J((H) => ({ ...H, isSelected: P })), f?.(P);
    }, [f]), D = E.useCallback(() => {
      J((P) => ({ ...P, isDragging: !0 })), h?.();
    }, [h]), z = E.useCallback((P, H) => {
      J((Q) => ({ ...Q, isDragging: !1 })), S?.(P, H);
    }, [S]), A = E.useCallback(() => {
      J((P) => ({ ...P, isResizing: !0 })), x?.();
    }, [x]), U = E.useCallback((P, H, Q, ee) => {
      J((j) => ({ ...j, isResizing: !1 })), l?.(P, H, Q, ee);
    }, [l]), X = E.useCallback(() => {
      J((P) => ({ ...P, isRotating: !0 })), R?.();
    }, [R]), q = E.useCallback((P) => {
      J((H) => ({ ...H, isRotating: !1 })), c?.(P);
    }, [c]), K = {
      element: r,
      ...re
    };
    return /* @__PURE__ */ oe(
      Te,
      {
        ref: s,
        element: r,
        disabled: a,
        showHandles: u,
        enableRotation: m,
        className: b,
        style: d,
        onSelect: N,
        onDragStart: D,
        onDrag: w,
        onDragEnd: z,
        onResizeStart: A,
        onResize: g,
        onResizeEnd: U,
        onRotateStart: X,
        onRotate: v,
        onRotateEnd: q,
        children: /* @__PURE__ */ oe(e, { ...K, ...G })
      }
    );
  });
  return t.displayName = `withElementBehavior(${e.displayName || e.name || "Component"})`, t;
}
const Ft = ({ element: e }) => {
  const { theme: t } = te(), { width: n, height: s, style: o } = e;
  return E.createElement("rect", {
    width: n,
    height: s,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal,
    rx: o?.cornerRadius ?? 0,
    ry: o?.cornerRadius ?? 0,
    opacity: o?.opacity ?? 1
  });
}, be = le(Ft);
be.displayName = "Rectangle";
const Yt = ({ element: e }) => {
  const { theme: t } = te(), { width: n, height: s, style: o } = e, r = n / 2, a = s / 2, u = n / 2, m = s / 2;
  return E.createElement("ellipse", {
    cx: r,
    cy: a,
    rx: u,
    ry: m,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal,
    opacity: o?.opacity ?? 1
  });
}, pe = le(Yt);
pe.displayName = "Ellipse";
const jt = pe;
jt.displayName = "Circle";
const Kt = pe;
Kt.displayName = "Oval";
const Gt = ({ element: e }) => {
  const { theme: t } = te(), { width: n, height: s, style: o } = e, r = [
    `${n / 2},0`,
    `${n},${s / 2}`,
    `${n / 2},${s}`,
    `0,${s / 2}`
  ].join(" ");
  return E.createElement("polygon", {
    points: r,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal,
    opacity: o?.opacity ?? 1
  });
}, Ve = le(Gt);
Ve.displayName = "Diamond";
const Fe = ie(
  ({
    element: e,
    disabled: t,
    showHandles: n,
    enableRotation: s,
    onSelect: o,
    onDragStart: r,
    onDrag: a,
    onDragEnd: u,
    onResizeStart: m,
    onResize: f,
    onResizeEnd: h,
    onRotateStart: w,
    onRotate: S,
    onRotateEnd: x,
    onTextChange: g,
    className: l,
    style: R
  }, v) => {
    const { theme: c } = te(), { updateElement: b } = me(), [d, y] = ue(!1), [k, I] = ue(e.text ?? ""), C = se(null), { width: M, height: B, style: $, text: L = "", fontSize: O, fontFamily: W, fontWeight: F, textAlign: Y } = e, p = i((D) => {
      const z = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      z.style.position = "absolute", z.style.visibility = "hidden", z.style.pointerEvents = "none", document.body.appendChild(z);
      const A = document.createElementNS("http://www.w3.org/2000/svg", "text");
      A.setAttribute("font-size", String(O ?? c.fontSize.md)), A.setAttribute("font-family", W ?? "sans-serif"), A.setAttribute("font-weight", F ?? "normal");
      const U = D.split(`
`), X = (O ?? c.fontSize.md) * 1.2;
      let q = 0;
      U.forEach((Q, ee) => {
        const j = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        j.textContent = Q || " ", j.setAttribute("x", "0"), j.setAttribute("dy", ee === 0 ? "0" : String(X)), A.appendChild(j);
      }), z.appendChild(A), q = A.getBBox().width;
      const P = U.length * X;
      document.body.removeChild(z);
      const H = 16;
      return {
        width: Math.max(q + H, 40),
        // Minimum width
        height: Math.max(P + H, 24)
        // Minimum height
      };
    }, [O, W, F, c.fontSize.md]), T = i(() => {
      switch (Y) {
        case "right":
          return "end";
        case "center":
          return "middle";
        default:
          return "start";
      }
    }, [Y]), _ = i(() => {
      switch (Y) {
        case "right":
          return M;
        case "center":
          return M / 2;
        default:
          return 0;
      }
    }, [Y, M]), Z = i((D) => {
      e.locked || t || (D.stopPropagation(), D.preventDefault(), I(L), y(!0));
    }, [e.locked, t, L]), G = i(() => {
      const D = k.trim();
      if (D !== L || D !== "") {
        const z = p(D);
        b(e.id, {
          text: D,
          width: z.width,
          height: z.height
        }), g?.(D);
      }
      y(!1);
    }, [k, L, p, b, e.id, g]), re = i(() => {
      I(L), y(!1);
    }, [L]), J = i((D) => {
      D.key === "Escape" ? (D.preventDefault(), re()) : D.key === "Enter" && !D.shiftKey && (D.preventDefault(), G()), D.stopPropagation();
    }, [re, G]);
    De(() => {
      d && C.current && (C.current.focus(), C.current.select());
    }, [d]);
    const N = () => d ? E.createElement(
      "foreignObject",
      {
        x: 0,
        y: 0,
        width: M,
        height: B
      },
      E.createElement(
        "div",
        {
          xmlns: "http://www.w3.org/1999/xhtml",
          style: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: Y === "center" ? "center" : Y === "right" ? "flex-end" : "flex-start"
          }
        },
        E.createElement("textarea", {
          ref: C,
          value: k,
          onChange: (D) => I(D.target.value),
          onBlur: G,
          onKeyDown: J,
          style: {
            width: "100%",
            height: "100%",
            padding: "4px",
            border: `2px solid ${c.colors.selection.stroke}`,
            borderRadius: "2px",
            outline: "none",
            resize: "none",
            backgroundColor: c.colors.background,
            color: $?.fill ?? c.colors.text.primary,
            fontSize: O ?? c.fontSize.md,
            fontFamily: W ?? "sans-serif",
            fontWeight: F ?? "normal",
            textAlign: Y ?? "left",
            boxSizing: "border-box"
          }
        })
      )
    ) : E.createElement(
      "g",
      { onDoubleClick: Z },
      // Background (for selection area)
      E.createElement("rect", {
        width: M,
        height: B,
        fill: "transparent"
      }),
      // Text
      E.createElement(
        "text",
        {
          x: _(),
          y: B / 2,
          dominantBaseline: "central",
          textAnchor: T(),
          fill: $?.fill ?? c.colors.text.primary,
          fontSize: O ?? c.fontSize.md,
          fontFamily: W ?? "sans-serif",
          fontWeight: F ?? "normal",
          opacity: $?.opacity ?? 1,
          style: { pointerEvents: "none" }
        },
        L
      )
    );
    return E.createElement(
      Te,
      {
        ref: v,
        element: e,
        children: N(),
        disabled: t || d,
        // Disable drag/resize while editing
        showHandles: n && !d,
        enableRotation: s,
        className: l,
        style: R,
        onSelect: o,
        onDragStart: r,
        onDrag: a,
        onDragEnd: u,
        onResizeStart: m,
        onResize: f,
        onResizeEnd: h,
        onRotateStart: w,
        onRotate: S,
        onRotateEnd: x
      }
    );
  }
);
Fe.displayName = "TextElement";
const ze = 8, Me = 25, Ye = ie(
  ({
    element: e,
    children: t,
    renderLine: n,
    className: s,
    style: o,
    disabled: r = !1,
    showHandles: a = !0,
    enableRotation: u = !0,
    onSelect: m,
    onDragStart: f,
    onDrag: h,
    onDragEnd: w,
    onPointsChange: S,
    onRotateStart: x,
    onRotate: g,
    onRotateEnd: l
  }, R) => {
    const { updateElement: v } = me(), { theme: c } = te(), { screenToCanvas: b } = he(), d = e.locked || r, [y, k] = ue({
      isDragging: !1,
      endpointIndex: null,
      startPosition: null,
      currentPoints: null
    }), I = se(null), C = V(() => e.points ?? [
      { x: 0, y: e.height / 2 },
      { x: e.width, y: e.height / 2 }
    ], [e.points, e.width, e.height]), { isSelected: M, handlers: B } = He({
      id: e.id,
      disabled: d,
      onSelect: m
    }), { isDragging: $, dragState: L, handlers: O } = Ze({
      disabled: d || !M || y.isDragging,
      onDragStart: () => {
        f?.();
      },
      onDrag: (z, A) => {
        const U = e.x + A.x, X = e.y + A.y;
        h?.(U, X);
      },
      onDragEnd: (z, A) => {
        const U = e.x + A.x, X = e.y + A.y;
        v(e.id, { x: U, y: X }), w?.(U, X);
      }
    }), { isRotating: W, rotateState: F, startRotate: Y } = Xe({
      disabled: d || !M || !u,
      snapAngle: 15,
      onRotateStart: () => {
        x?.();
      },
      onRotate: (z) => {
        g?.(z);
      },
      onRotateEnd: (z) => {
        v(e.id, { rotation: z }), l?.(z);
      }
    }), p = V(() => W && F.currentAngle !== null ? F.currentAngle : e.rotation ?? 0, [W, F.currentAngle, e.rotation]), T = V(() => $ ? {
      x: e.x + L.delta.x,
      y: e.y + L.delta.y,
      width: e.width,
      height: e.height
    } : {
      x: e.x,
      y: e.y,
      width: e.width,
      height: e.height
    }, [$, L.delta, e.x, e.y, e.width, e.height]), _ = V(() => y.isDragging && y.currentPoints ? y.currentPoints : C, [y.isDragging, y.currentPoints, C]), Z = i(
      (z, A) => {
        if (d || !M) return;
        A.stopPropagation(), A.preventDefault();
        const U = b({ x: A.clientX, y: A.clientY });
        I.current = {
          endpointIndex: z,
          startMousePos: U,
          originalPoints: [...C]
        }, k({
          isDragging: !0,
          endpointIndex: z,
          startPosition: U,
          currentPoints: [...C]
        });
        const X = (K) => {
          if (!I.current) return;
          const P = b({ x: K.clientX, y: K.clientY }), { endpointIndex: H, startMousePos: Q, originalPoints: ee } = I.current, j = P.x - Q.x, Se = P.y - Q.y, ke = ee.map((ae, Re) => Re === H ? { x: ae.x + j, y: ae.y + Se } : { ...ae });
          k((ae) => ({
            ...ae,
            currentPoints: ke
          }));
        }, q = () => {
          I.current && (I.current, k((K) => {
            if (K.currentPoints) {
              const P = K.currentPoints, H = P.map((de) => de.x), Q = P.map((de) => de.y), ee = Math.min(...H), j = Math.min(...Q), Se = Math.max(...H), ke = Math.max(...Q), ae = P.map((de) => ({
                x: de.x - ee,
                y: de.y - j
              })), Re = Math.max(Se - ee, 1), ut = Math.max(ke - j, 1);
              v(e.id, {
                x: e.x + ee,
                y: e.y + j,
                width: Re,
                height: ut,
                points: ae
              }), S?.(ae);
            }
            return {
              isDragging: !1,
              endpointIndex: null,
              startPosition: null,
              currentPoints: null
            };
          }), I.current = null, document.removeEventListener("mousemove", X), document.removeEventListener("mouseup", q));
        };
        document.addEventListener("mousemove", X), document.addEventListener("mouseup", q);
      },
      [d, M, C, b, v, e.id, e.x, e.y, S]
    ), G = i(
      (z) => {
        const A = _[0], U = _[_.length - 1], X = (A.x + U.x) / 2, q = (A.y + U.y) / 2, K = T.x + X, P = T.y + q;
        Y(
          { x: K, y: P },
          e.rotation ?? 0,
          z
        );
      },
      [Y, T, _, e.rotation]
    ), re = i(
      (z) => {
        B.onClick(z), M && !y.isDragging && O.onMouseDown(z);
      },
      [B, O, M, y.isDragging]
    ), J = {
      cursor: $ ? "grabbing" : M ? "grab" : "pointer",
      opacity: e.visible === !1 ? 0.5 : 1,
      ...o
    }, N = V(() => _.map((z) => ({ x: z.x, y: z.y })), [_]), D = V(() => {
      if (_.length < 2) return { cx: 0, cy: 0, x1: 0, y1: 0, x2: 0, y2: 0 };
      const z = _[0], A = _[_.length - 1], U = (z.x + A.x) / 2, X = (z.y + A.y) / 2, q = A.x - z.x, K = A.y - z.y, P = Math.sqrt(q * q + K * K) || 1, H = -K / P, Q = q / P, ee = U + H * Me, j = X + Q * Me;
      return {
        cx: ee,
        cy: j,
        x1: U,
        y1: X,
        x2: ee,
        y2: j
      };
    }, [_]);
    return E.createElement(
      "g",
      {
        ref: R,
        className: fe("canvas-element canvas-line", s, {
          "canvas-element--selected": M,
          "canvas-element--dragging": $,
          "canvas-element--endpoint-dragging": y.isDragging,
          "canvas-element--rotating": W,
          "canvas-element--locked": e.locked
        }),
        transform: `translate(${T.x}, ${T.y})${p ? ` rotate(${p}, ${T.width / 2}, ${T.height / 2})` : ""}`,
        style: J,
        onMouseDown: re,
        onTouchStart: O.onTouchStart,
        "data-element-id": e.id,
        "data-element-type": e.type
      },
      // Render line with current points
      n(_, y.isDragging),
      // Endpoint handles (only when selected)
      M && a && !d && N.map(
        (z, A) => E.createElement("circle", {
          key: `endpoint-handle-${A}`,
          className: "canvas-line__endpoint-handle",
          cx: z.x,
          cy: z.y,
          r: ze / 2 + 2,
          fill: c.colors.handle.fill,
          stroke: c.colors.handle.stroke,
          strokeWidth: 1.5,
          cursor: "move",
          onMouseDown: (U) => Z(A, U)
        })
      ),
      // Rotation handle (perpendicular to line direction)
      M && a && u && !d && E.createElement(
        "g",
        {
          key: "rotation-handle",
          className: "canvas-line__rotation-handle"
        },
        // Line connecting to element center
        E.createElement("line", {
          x1: D.x1,
          y1: D.y1,
          x2: D.x2,
          y2: D.y2,
          stroke: c.colors.selection.stroke,
          strokeWidth: 1,
          pointerEvents: "none"
        }),
        // Rotation handle circle
        E.createElement("circle", {
          cx: D.cx,
          cy: D.cy,
          r: ze / 2 + 2,
          fill: c.colors.handle.fill,
          stroke: c.colors.handle.stroke,
          strokeWidth: 1,
          cursor: "grab",
          onMouseDown: G
        })
      )
    );
  }
);
Ye.displayName = "LineBase";
const je = ie(
  ({
    element: e,
    disabled: t,
    showHandles: n,
    enableRotation: s,
    onSelect: o,
    onDragStart: r,
    onDrag: a,
    onDragEnd: u,
    onPointsChange: m,
    onRotateStart: f,
    onRotate: h,
    onRotateEnd: w,
    className: S,
    style: x
  }, g) => {
    const { theme: l } = te(), { style: R, lineType: v = "solid" } = e, c = i(() => {
      switch (v) {
        case "dashed":
          return "8 4";
        case "dotted":
          return "2 2";
        default:
          return;
      }
    }, [v]), b = R?.stroke ?? l.colors.element.stroke, d = R?.strokeWidth ?? l.strokeWidth.normal, y = i((k, I) => {
      const C = k.map((M, B) => B === 0 ? `M ${M.x} ${M.y}` : `L ${M.x} ${M.y}`).join(" ");
      return E.createElement(
        "g",
        null,
        // Invisible wider path for easier selection (follows the line shape)
        E.createElement("path", {
          d: C,
          fill: "none",
          stroke: "transparent",
          strokeWidth: 20,
          // Wide hit area
          strokeLinecap: "round"
        }),
        // Visible line
        E.createElement("path", {
          d: C,
          fill: "none",
          stroke: b,
          strokeWidth: d,
          strokeDasharray: c(),
          strokeLinecap: "round",
          strokeLinejoin: "round",
          opacity: R?.opacity ?? 1
        })
      );
    }, [b, d, c, R?.opacity]);
    return E.createElement(Ye, {
      ref: g,
      element: e,
      disabled: t,
      showHandles: n,
      enableRotation: s,
      className: S,
      style: x,
      onSelect: o,
      onDragStart: r,
      onDrag: a,
      onDragEnd: u,
      onPointsChange: m,
      onRotateStart: f,
      onRotate: h,
      onRotateEnd: w,
      renderLine: y
    });
  }
);
je.displayName = "Line";
const Jt = ({ element: e }) => {
  const { theme: t } = te(), { width: n, height: s, style: o, label: r } = e, a = Math.min(n, s) * 0.15, u = n / 2, m = a * 2 + 4, f = s * 0.6, h = m + (f - m) * 0.3, w = n * 0.4, S = n * 0.35, x = s - 4, g = o?.stroke ?? t.colors.element.stroke, l = o?.strokeWidth ?? t.strokeWidth.normal;
  return E.createElement(
    "g",
    null,
    // Invisible background for selection
    E.createElement("rect", {
      width: n,
      height: s,
      fill: "transparent"
    }),
    // Head (circle)
    E.createElement("circle", {
      cx: u,
      cy: a + 2,
      r: a,
      fill: o?.fill ?? "none",
      stroke: g,
      strokeWidth: l
    }),
    // Body (vertical line)
    E.createElement("line", {
      x1: u,
      y1: m,
      x2: u,
      y2: f,
      stroke: g,
      strokeWidth: l
    }),
    // Arms (horizontal line)
    E.createElement("line", {
      x1: u - w,
      y1: h,
      x2: u + w,
      y2: h,
      stroke: g,
      strokeWidth: l
    }),
    // Left leg
    E.createElement("line", {
      x1: u,
      y1: f,
      x2: u - S,
      y2: s * 0.85,
      stroke: g,
      strokeWidth: l
    }),
    // Right leg
    E.createElement("line", {
      x1: u,
      y1: f,
      x2: u + S,
      y2: s * 0.85,
      stroke: g,
      strokeWidth: l
    }),
    // Label
    r && E.createElement(
      "text",
      {
        x: u,
        y: x,
        textAnchor: "middle",
        dominantBaseline: "text-bottom",
        fill: o?.fill ?? t.colors.text.primary,
        fontSize: t.fontSize.sm,
        fontFamily: "sans-serif"
      },
      r
    )
  );
}, Ke = le(Jt);
Ke.displayName = "Actor";
const qt = ({ element: e }) => {
  const { theme: t } = te(), { width: n, height: s, style: o, label: r } = e, a = n / 2, u = 40, m = o?.stroke ?? t.colors.element.stroke, f = o?.strokeWidth ?? t.strokeWidth.normal;
  return E.createElement(
    "g",
    null,
    // Header box
    E.createElement("rect", {
      x: 0,
      y: 0,
      width: n,
      height: u,
      fill: o?.fill ?? t.colors.element.fill,
      stroke: m,
      strokeWidth: f
    }),
    // Label in header
    r && E.createElement(
      "text",
      {
        x: a,
        y: u / 2,
        textAnchor: "middle",
        dominantBaseline: "central",
        fill: t.colors.text.primary,
        fontSize: t.fontSize.sm,
        fontFamily: "sans-serif"
      },
      r
    ),
    // Dashed lifeline
    E.createElement("line", {
      x1: a,
      y1: u,
      x2: a,
      y2: s,
      stroke: m,
      strokeWidth: f,
      strokeDasharray: "8 4"
    })
  );
}, Ge = le(qt);
Ge.displayName = "Lifeline";
const Qt = ({ element: e }) => {
  const { theme: t } = te(), { width: n, height: s, style: o, label: r, messageType: a = "sync" } = e, u = o?.stroke ?? t.colors.connection.line, m = o?.strokeWidth ?? t.strokeWidth.normal, f = 10, h = s / 2, w = () => {
    switch (a) {
      case "return":
        return "8 4";
      case "create":
        return "4 2";
      default:
        return;
    }
  }, S = () => a === "async" ? E.createElement("polyline", {
    points: `${n - f},${h - f / 2} ${n},${h} ${n - f},${h + f / 2}`,
    fill: "none",
    stroke: u,
    strokeWidth: m
  }) : E.createElement("polygon", {
    points: `${n},${h} ${n - f},${h - f / 2} ${n - f},${h + f / 2}`,
    fill: u,
    stroke: u,
    strokeWidth: 1
  });
  return E.createElement(
    "g",
    null,
    // Invisible background for selection
    E.createElement("rect", {
      width: n,
      height: s,
      fill: "transparent"
    }),
    // Main line
    E.createElement("line", {
      x1: 0,
      y1: h,
      x2: n - (a === "async" ? 0 : f / 2),
      y2: h,
      stroke: u,
      strokeWidth: m,
      strokeDasharray: w()
    }),
    // Arrow head
    S(),
    // Label above the line
    r && E.createElement(
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
}, Je = le(Qt);
Je.displayName = "Message";
const en = ({ element: e }) => {
  const { theme: t } = te(), { width: n, height: s, style: o } = e;
  return E.createElement("rect", {
    width: n || 12,
    // Default narrow width
    height: s,
    fill: o?.fill ?? t.colors.element.fill,
    stroke: o?.stroke ?? t.colors.element.stroke,
    strokeWidth: o?.strokeWidth ?? t.strokeWidth.normal
  });
}, qe = le(en);
qe.displayName = "ActivationBar";
const Ce = {
  rectangle: be,
  ellipse: pe,
  circle: pe,
  diamond: Ve,
  text: Fe,
  line: je,
  actor: Ke,
  lifeline: Ge,
  message: Je,
  activationBar: qe,
  // Default fallback for custom types
  custom: be
}, Qe = ie(
  ({
    width: e,
    height: t,
    className: n,
    style: s,
    showGrid: o,
    gridSize: r,
    onCanvasClick: a,
    onCanvasDoubleClick: u,
    children: m
  }, f) => {
    const { elements: h, config: w } = me(), { clearSelection: S } = we(), { viewport: x } = he(), { theme: g } = te(), l = e ?? w.width, R = t ?? w.height, v = o ?? w.grid?.visible, c = r ?? w.grid?.size ?? 20, b = V(() => Ie(h), [h]), d = i(
      (C) => {
        S(), a?.(C);
      },
      [S, a]
    ), y = () => {
      if (!v) return null;
      const C = "canvas-grid-pattern";
      return E.createElement(
        E.Fragment,
        null,
        E.createElement(
          "defs",
          null,
          E.createElement(
            "pattern",
            {
              id: C,
              width: c,
              height: c,
              patternUnits: "userSpaceOnUse"
            },
            E.createElement("path", {
              d: `M ${c} 0 L 0 0 0 ${c}`,
              fill: "none",
              stroke: g.colors.grid.line,
              strokeWidth: 0.5
            })
          )
        ),
        E.createElement("rect", {
          width: "100%",
          height: "100%",
          fill: `url(#${C})`,
          pointerEvents: "none"
          // Let clicks pass through to background
        })
      );
    }, k = () => E.createElement("rect", {
      className: "canvas-background",
      width: "100%",
      height: "100%",
      fill: "transparent",
      onMouseDown: d
    }), I = (C) => {
      const M = Ce[C.type] ?? Ce.custom;
      return E.createElement(M, {
        key: C.id,
        element: C
      });
    };
    return E.createElement(
      "svg",
      {
        ref: f,
        className: fe("canvas-drawing", n),
        width: l,
        height: R,
        viewBox: `0 0 ${l} ${R}`,
        style: {
          backgroundColor: g.colors.background,
          cursor: "default",
          userSelect: "none",
          ...s
        },
        onDoubleClick: u
      },
      // Transform group for zoom and pan
      E.createElement(
        "g",
        {
          transform: `translate(${x.pan.x}, ${x.pan.y}) scale(${x.zoom})`
        },
        // Background rect for capturing clicks on empty areas
        k(),
        // Grid (pointer-events: none, so clicks pass through)
        y(),
        // Elements
        b.map(I),
        // Additional children (e.g., selection boxes, connection handles)
        m
      )
    );
  }
);
Qe.displayName = "DrawingCanvas";
const et = ie(
  ({
    width: e,
    height: t,
    readonly: n = !1,
    showGrid: s,
    gridSize: o,
    enableKeyboardShortcuts: r = !0,
    className: a,
    style: u,
    children: m
  }, f) => {
    const h = se(null), w = me(), S = we(), x = he(), g = Ht();
    return Xt(
      r ? {
        undo: g.undo,
        redo: g.redo,
        delete: g.removeSelected,
        selectAll: () => S.selectAll(w.elements.map((l) => l.id)),
        copy: g.copy,
        paste: g.paste,
        cut: g.cut,
        escape: S.clearSelection,
        zoomIn: x.zoomIn,
        zoomOut: x.zoomOut,
        resetZoom: x.resetViewport
      } : {}
    ), ht(
      f,
      () => ({
        addElement: g.addElement,
        updateElement: g.updateElement,
        removeElement: g.removeElement,
        getElement: w.getElementById,
        getElementsByType: w.getElementsByType,
        select: S.select,
        selectMultiple: S.selectMultiple,
        clearSelection: S.clearSelection,
        getSelectedIds: () => S.selectedIds,
        zoomIn: x.zoomIn,
        zoomOut: x.zoomOut,
        setZoom: x.setZoom,
        resetViewport: x.resetViewport,
        undo: g.undo,
        redo: g.redo,
        canUndo: g.canUndo,
        canRedo: g.canRedo,
        toJSON: () => ({
          elements: w.elements,
          connections: w.connections
        }),
        toSVG: () => h.current?.outerHTML ?? "",
        toImage: async (l) => {
          if (!h.current)
            throw new Error("SVG element not available");
          return Oe(h.current, l);
        },
        fromJSON: (l) => {
          const R = bt(l);
          return w.setElements(R.elements), w.setConnections(R.connections), S.clearSelection(), R;
        }
      }),
      [w, S, x, g]
    ), /* @__PURE__ */ mt(
      "div",
      {
        className: fe("canvas-container", a, {
          "canvas-container--readonly": n
        }),
        style: {
          position: "relative",
          overflow: "hidden",
          ...u
        },
        tabIndex: 0,
        children: [
          /* @__PURE__ */ oe(
            Qe,
            {
              ref: h,
              width: e,
              height: t,
              showGrid: s,
              gridSize: o
            }
          ),
          m
        ]
      }
    );
  }
);
et.displayName = "CanvasInner";
const tn = ie(
  ({
    elements: e,
    connections: t,
    selectedIds: n,
    defaultElements: s = [],
    defaultConnections: o = [],
    config: r,
    theme: a = "light",
    initialViewport: u,
    maxHistorySize: m,
    onChange: f,
    onSelectionChange: h,
    ...w
  }, S) => /* @__PURE__ */ oe(
    Bt,
    {
      initialElements: s,
      initialConnections: o,
      elements: e,
      connections: t,
      selectedIds: n,
      config: r,
      theme: a,
      initialViewport: u,
      maxHistorySize: m,
      onElementsChange: f,
      onSelectionChange: h,
      children: /* @__PURE__ */ oe(et, { ...w, ref: S })
    }
  )
);
tn.displayName = "Canvas";
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
}, ne = (e, t = {}) => {
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
}, tt = (e = {}) => ne("rectangle", e), nt = (e = {}) => ne("ellipse", e), ot = (e = {}) => {
  const t = e.width ?? e.height ?? 80;
  return ne("circle", { ...e, width: t, height: t });
}, st = (e = {}) => ne("diamond", e), rt = (e = {}) => {
  const { text: t, fontSize: n, fontFamily: s, fontWeight: o, textAlign: r, ...a } = e;
  return {
    ...ne("text", a),
    type: "text",
    text: t ?? "",
    fontSize: n,
    fontFamily: s,
    fontWeight: o,
    textAlign: r
  };
}, at = (e = {}) => {
  const { points: t, lineType: n, x: s, y: o, ...r } = e, a = r.width ?? 100;
  let u = t ?? [
    { x: s ?? 0, y: o ?? 0 },
    { x: (s ?? 0) + a, y: o ?? 0 }
  ];
  const m = u.map((d) => d.x), f = u.map((d) => d.y), h = Math.min(...m), w = Math.min(...f), S = Math.max(...m), x = Math.max(...f), g = u.map((d) => ({
    x: d.x - h,
    y: d.y - w
  })), l = S - h, R = x - w, v = Math.max(l, 10), c = Math.max(R, 10), b = g.map((d) => ({
    x: l < 10 ? d.x + (10 - l) / 2 : d.x,
    y: R < 10 ? d.y + (10 - R) / 2 : d.y
  }));
  return {
    ...ne("line", {
      ...r,
      x: l < 10 ? h - (10 - l) / 2 : h,
      y: R < 10 ? w - (10 - R) / 2 : w,
      width: v,
      height: c
    }),
    type: "line",
    points: b,
    lineType: n ?? "solid"
  };
}, it = (e = {}) => {
  const { label: t, ...n } = e;
  return {
    ...ne("actor", n),
    type: "actor",
    label: t
  };
}, ct = (e = {}) => {
  const { label: t, ...n } = e;
  return {
    ...ne("lifeline", n),
    type: "lifeline",
    label: t
  };
}, lt = (e = {}) => {
  const { label: t, messageType: n, fromId: s, toId: o, ...r } = e;
  return {
    ...ne("message", r),
    type: "message",
    label: t,
    messageType: n ?? "sync",
    fromId: s,
    toId: o
  };
}, dt = (e = {}) => ne("activationBar", e), nn = (e, t = {}) => {
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
      return ne(e, t);
  }
}, yn = {
  create: nn,
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
  tn as Canvas,
  $t as CanvasProvider,
  jt as Circle,
  Bt as CombinedCanvasProvider,
  Ve as Diamond,
  Qe as DrawingCanvas,
  Te as ElementBase,
  yn as ElementFactory,
  pe as Ellipse,
  Ot as HistoryProvider,
  Ge as Lifeline,
  je as Line,
  Je as Message,
  Kt as Oval,
  be as Rectangle,
  Dt as SelectionProvider,
  Fe as TextElement,
  Tt as ThemeProvider,
  Mt as ViewportProvider,
  cn as boundsIntersect,
  ft as bringToFront,
  dt as createActivationBar,
  it as createActor,
  ot as createCircle,
  st as createDiamond,
  nn as createElement,
  nt as createEllipse,
  ct as createLifeline,
  at as createLine,
  lt as createMessage,
  tt as createRectangle,
  rt as createText,
  fe as cx,
  It as darkTheme,
  Ae as deepMerge,
  bt as deserializeFromJSON,
  rn as distance,
  hn as downloadAsFile,
  mn as downloadAsImage,
  Oe as exportToImage,
  un as exportToSVG,
  Ee as generateId,
  pt as getResizeHandles,
  pn as getThemeCSSVariables,
  an as isPointInBounds,
  ce as lightTheme,
  xt as sendToBack,
  dn as serializeToJSON,
  ln as snapToGrid,
  Ie as sortByZIndex,
  me as useCanvas,
  Ht as useCanvasActions,
  Xt as useCanvasKeyboardShortcuts,
  Ze as useDraggable,
  Lt as useHistory,
  Zt as useKeyboard,
  Wt as useResizable,
  Xe as useRotatable,
  He as useSelectable,
  we as useSelection,
  te as useTheme,
  he as useViewport,
  wt as validateCanvasData,
  le as withElementBehavior
};
//# sourceMappingURL=index.js.map
