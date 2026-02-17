# Plan: React Canvas Component Library para npm

**TL;DR** — Crear una librería React en TypeScript que provee un canvas interactivo basado en SVG para dibujar y manipular elementos UML. La arquitectura usa composición de componentes (`Canvas` → `CanvasManager` + `DrawingCanvas` + `ElementFactory`) con Context API para estado compartido. Los elementos (Actor, Message, etc.) serán componentes independientes exportables con soporte para drag, resize, selección y conexiones. Se publicará via npm usando Vite en modo librería.

---

## Steps

### 1. Inicializar proyecto con Vite library mode

- Crear proyecto nuevo con `npm create vite@latest @canvas-uml/react --template react-ts`
- Configurar `vite.config.ts` con `build.lib` para generar ESM y CJS
- Configurar `package.json` con `exports`, `main`, `module`, `types`, `peerDependencies` (React 18+)
- Agregar `tsconfig.json` con configuración estricta y `declaration: true`

### 2. Definir estructura de carpetas

```
src/
├── index.ts                        # Public exports
├── Canvas.tsx                      # Compound component root
│
├── core/                           # Core functionality
│   ├── context/
│   │   ├── CanvasContext.tsx       # Elements CRUD only
│   │   ├── SelectionContext.tsx    # Selection state (selectedIds)
│   │   ├── ViewportContext.tsx     # Zoom, pan, viewport state
│   │   ├── HistoryContext.tsx      # Undo/Redo state
│   │   ├── ThemeContext.tsx        # Theming provider
│   │   └── CanvasProvider.tsx      # Composes all providers
│   ├── components/
│   │   ├── CanvasManager.tsx       # Import/export data
│   │   ├── DrawingCanvas.tsx       # SVG container + interactions
│   │   ├── ElementRenderer.tsx     # Renders element by type from registry
│   │   ├── Grid.tsx                # Grid overlay + snap logic
│   │   ├── SelectionBox.tsx        # Multi-selection rectangle
│   │   └── CanvasErrorBoundary.tsx # Catch errors in elements
│   ├── hooks/
│   │   ├── useDraggable.ts         # Drag behavior (dependency injected)
│   │   ├── useResizable.ts         # Resize behavior (dependency injected)
│   │   ├── useSelectable.ts        # Selection behavior
│   │   ├── useMultiSelect.ts       # Multi-selection (shift+click, area)
│   │   ├── useConnections.ts       # Connection management
│   │   ├── useHistory.ts           # Undo/Redo hook
│   │   ├── useKeyboard.ts          # Keyboard shortcuts
│   │   ├── useGrid.ts              # Grid/Snap behavior
│   │   ├── useCanvasRef.ts         # Imperative handle for ref
│   │   └── useMemoizedElements.ts  # Memoize elements by id
│   ├── factories/
│   │   └── elementFactory.ts       # Pure function factory (no JSX)
│   └── utils/
│       ├── id.ts                   # generateId() - crypto.randomUUID fallback
│       ├── classnames.ts           # cx() - className concatenation
│       ├── deepMerge.ts            # deepMerge() - for theme merging
│       ├── serialization.ts        # JSON serialize/deserialize
│       ├── geometry.ts             # Position/size calculations
│       ├── layers.ts               # Z-index management
│       └── validation.ts           # Schema validation for import
│
├── elements/                       # All elements (flat structure)
│   ├── base/
│   │   ├── ElementBase.tsx         # Base component with behaviors
│   │   ├── ElementText.tsx         # Text handling (inner/attached)
│   │   ├── withElementBehavior.tsx # HOC for common behavior (drag/resize/select)
│   │   ├── types.ts                # Shared interfaces
│   │   └── registry.ts             # Element type registry
│   ├── Rectangle.tsx               # React.memo wrapped
│   ├── Ellipse.tsx
│   ├── Diamond.tsx
│   ├── Line.tsx
│   ├── Actor.tsx
│   ├── Lifeline.tsx
│   ├── Message.tsx
│   ├── ActivationBar.tsx
│   └── connectors/
│       ├── ConnectionLine.tsx      # Lines between elements
│       └── Arrow.tsx               # Arrow heads
│
├── theme/                          # Theming system
│   ├── lightTheme.ts               # Light theme (default)
│   ├── darkTheme.ts                # Dark theme
│   ├── types.ts                    # Theme interface
│   └── createTheme.ts              # Theme factory/merge utility
│
└── types/                          # Shared TypeScript types
    ├── canvas.ts                   # Canvas-related types
    ├── elements.ts                 # Element-related types
    ├── theme.ts                    # Theme-related types
    ├── events.ts                   # Event-related types
    └── public.ts                   # Exported public types only
```

**Principios de la estructura (SOLID):**

- **SRP**: Cada contexto tiene una sola responsabilidad (elements, selection, viewport, history, theme)
- **OCP**: Registry pattern permite agregar elementos sin modificar código existente
- **LSP**: Todos los elementos extienden `ElementBase` con contrato consistente
- **ISP**: Hooks reciben solo las dependencias que necesitan via parámetros
- **DIP**: Hooks desacoplados de contextos específicos, reciben callbacks como dependencias

### 3. Implementar Contexts (separación de responsabilidades)

**3.1 CanvasContext** — Solo manejo de elementos (SRP)

```typescript
interface CanvasContextValue {
	elements: CanvasElement[];
	connections: Connection[];
	addElement: (element: CanvasElement) => void;
	updateElement: (id: string, updates: Partial<CanvasElement>) => void;
	removeElement: (id: string) => void;
	connect: (from: string, to: string) => void;
	disconnect: (connectionId: string) => void;
}
```

**3.2 SelectionContext** — Solo estado de selección

```typescript
interface SelectionContextValue {
	selectedIds: string[];
	select: (id: string, additive?: boolean) => void;
	selectMultiple: (ids: string[]) => void;
	deselect: (id: string) => void;
	deselectAll: () => void;
	isSelected: (id: string) => boolean;
}
```

**3.3 ViewportContext** — Solo zoom/pan

```typescript
interface ViewportContextValue {
	zoom: number;
	pan: { x: number; y: number };
	setZoom: (zoom: number) => void;
	setPan: (pan: { x: number; y: number }) => void;
	zoomIn: () => void;
	zoomOut: () => void;
	fitToContent: () => void;
}
```

**3.4 CanvasProvider** — Compone todos los providers

```tsx
export const CanvasProvider: FC<{
	children: ReactNode;
	config: CanvasConfig;
}> = ({ children, config }) => (
	<ThemeProvider theme={config.theme}>
		<CanvasContextProvider initialElements={config.elements}>
			<SelectionProvider>
				<ViewportProvider>
					<HistoryProvider maxHistory={config.maxHistory}>
						{children}
					</HistoryProvider>
				</ViewportProvider>
			</SelectionProvider>
		</CanvasContextProvider>
	</ThemeProvider>
);
```

**Interface CanvasElement:**

```typescript
interface CanvasElement {
	id: string;
	type: string;
	category?: string; // 'uml' | 'flowchart' | 'basic' | custom
	x: number;
	y: number;
	width: number;
	height: number;
	zIndex: number;
	color?: string;
	text?: string;
	textPosition?: "inside" | "above" | "below" | "left" | "right";
	props?: Record<string, unknown>;
}
```

### 4. Implementar ElementBase y withElementBehavior (HOC)

**ElementBase** — Componente SVG `<g>` base:

- Renderiza handles de resize cuando está seleccionado
- Puntos de conexión (anchors) en los bordes
- Usa `React.memo` para evitar re-renders innecesarios

**withElementBehavior** — HOC que inyecta comportamientos:

```typescript
type ElementBehaviorConfig = {
  draggable?: boolean;
  resizable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
};

export function withElementBehavior<P extends ElementBaseProps>(
  Component: React.ComponentType<P>,
  config: ElementBehaviorConfig = { draggable: true, resizable: true, selectable: true }
) {
  return React.memo(function EnhancedElement(props: P) {
    const dragHandlers = config.draggable ? useDraggable({ onDrag: props.onUpdate }) : {};
    const resizeHandlers = config.resizable ? useResizable({ onResize: props.onUpdate }) : {};
    const selectHandlers = config.selectable ? useSelectable({ id: props.id }) : {};

    return (
      <ElementBase {...props} {...dragHandlers} {...resizeHandlers} {...selectHandlers}>
        <Component {...props} />
      </ElementBase>
    );
  });
}
```

**Uso en elementos:**

```typescript
// elements/Rectangle.tsx
const RectangleShape: FC<RectangleProps> = ({ width, height, fill, stroke }) => (
  <rect width={width} height={height} fill={fill} stroke={stroke} />
);

export const Rectangle = withElementBehavior(RectangleShape);
```

### 5. Implementar soporte de texto en elementos

Componente `ElementText` que maneja texto dentro o cerca de elementos:

```typescript
interface TextConfig {
	content: string;
	position: "inside" | "above" | "below" | "left" | "right";
	offset?: { x: number; y: number }; // Ajuste fino de posición
	style?: {
		fontSize?: number;
		fontFamily?: string;
		fill?: string;
		textAnchor?: "start" | "middle" | "end";
	};
	editable?: boolean; // Permite edición inline
}
```

**Comportamiento:**

- Texto `inside`: centrado dentro del bounding box del elemento
- Texto `above/below/left/right`: posicionado fuera del elemento con offset configurable
- Al mover/redimensionar el elemento, el texto mantiene su posición relativa
- Doble-click para editar texto inline (si `editable: true`)

### 6. Implementar elementos

Todos los elementos extienden `ElementBase` y pueden incluir texto:

| Elemento        | Descripción             | SVG                       | Texto por defecto |
| --------------- | ----------------------- | ------------------------- | ----------------- |
| `Rectangle`     | Rectángulo              | `<rect>`                  | inside            |
| `Ellipse`       | Óvalo/círculo           | `<ellipse>`               | inside            |
| `Diamond`       | Rombo                   | `<polygon>`               | inside            |
| `Line`          | Línea simple            | `<line>`                  | above             |
| `Actor`         | Figura stick-man        | `<circle>` + `<line>`     | below             |
| `Lifeline`      | Línea vertical punteada | `<line stroke-dasharray>` | above             |
| `Message`       | Flecha con texto        | `<line>` + `<polygon>`    | above             |
| `ActivationBar` | Barra de activación     | `<rect>`                  | none              |

Cada elemento tiene una propiedad `category` opcional para filtrarlo/agruparlo en la UI.

Todos los elementos usan `React.memo` y `withElementBehavior` HOC para optimización.

### 7. Implementar Hooks desacoplados (DIP)

Los hooks reciben dependencias como parámetros en lugar de acceder directamente a contextos:

```typescript
// ❌ Acoplado a contexto específico
const useDraggable = () => {
	const { updateElement } = useCanvasContext(); // Dependencia directa
	// ...
};

// ✅ Desacoplado - recibe dependencias (DIP)
interface DraggableOptions {
	onDragStart?: () => void;
	onDrag: (delta: { dx: number; dy: number }) => void;
	onDragEnd?: () => void;
	snapTo?: (point: Point) => Point; // Inyección de snap behavior
	disabled?: boolean;
}

export function useDraggable(options: DraggableOptions) {
	const { onDrag, onDragEnd, snapTo, disabled } = options;

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			const delta = calculateDelta(e);
			const snappedDelta = snapTo ? snapTo(delta) : delta;
			onDrag(snappedDelta);
		},
		[onDrag, snapTo],
	);

	// Retorna handlers para el elemento
	return { onMouseDown /* ... */ };
}
```

**Beneficios:**

- Testeable sin mocks de contexto
- Reutilizable fuera del Canvas
- Componible con otros behaviors

**Patrón de uso en componentes:**

```typescript
// El HOC withElementBehavior conecta hooks con contextos
const dragHandlers = useDraggable({
	onDrag: (delta) => updateElement(id, { x: x + delta.dx, y: y + delta.dy }),
	snapTo: gridEnabled ? snapToGrid : undefined,
});
```

### 8. Implementar CanvasErrorBoundary

Componente que atrapa errores en elementos sin crashear todo el canvas:

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, elementId?: string) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class CanvasErrorBoundary extends Component<ErrorBoundaryProps, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Wrapper para elementos individuales
export const ElementErrorBoundary: FC<{ elementId: string; children: ReactNode }> = ({
  elementId,
  children
}) => (
  <CanvasErrorBoundary
    fallback={<ElementErrorPlaceholder id={elementId} />}
    onError={(error) => console.error(`Error in element ${elementId}:`, error)}
  >
    {children}
  </CanvasErrorBoundary>
);
```

### 9. Implementar Undo/Redo

- `HistoryContext` mantiene stack de estados: `past[]`, `present`, `future[]`
- Hook `useHistory()` expone: `undo()`, `redo()`, `canUndo`, `canRedo`
- Cada acción que modifica elementos crea snapshot en el historial
- Límite configurable de historial (default: 50 estados)

```typescript
interface HistoryState {
	elements: CanvasElement[];
	connections: Connection[];
	selectedIds: string[];
}
```

### 10. Implementar Multi-selección

- **Shift+click**: agregar/quitar elemento de la selección
- **Drag en área vacía**: dibujar rectángulo de selección (`SelectionBox`)
- Elementos dentro del rectángulo quedan seleccionados
- Acciones (mover, borrar) aplican a todos los seleccionados
- `useMultiSelect()` hook maneja la lógica

### 11. Implementar Keyboard shortcuts

Hook `useKeyboard()` registra atajos globales:

| Atajo                     | Acción                                    |
| ------------------------- | ----------------------------------------- |
| `Delete` / `Backspace`    | Eliminar seleccionados                    |
| `Ctrl+Z`                  | Undo                                      |
| `Ctrl+Shift+Z` / `Ctrl+Y` | Redo                                      |
| `Ctrl+A`                  | Seleccionar todo                          |
| `Escape`                  | Deseleccionar todo                        |
| `Arrow keys`              | Mover seleccionados (1px, 10px con Shift) |
| `Ctrl+D`                  | Duplicar seleccionados                    |
| `[` / `]`                 | Enviar atrás / traer adelante             |

### 12. Implementar Layers/Z-index

- Cada elemento tiene `zIndex: number`
- Utilidades en `utils/layers.ts`:
  - `bringToFront(id)` — máximo z-index + 1
  - `sendToBack(id)` — mínimo z-index - 1
  - `bringForward(id)` — +1 respecto a elemento superior
  - `sendBackward(id)` — -1 respecto a elemento inferior
- Renderizado ordena elementos por z-index

### 13. Implementar Grid/Snap

- Componente `Grid` renderiza líneas de rejilla en el SVG
- Props: `gridSize`, `showGrid`, `snapToGrid`
- Hook `useGrid()` ajusta coordenadas al snap más cercano
- Snap durante drag y resize

```typescript
interface GridConfig {
	size: number; // Tamaño de celda (default: 10)
	visible: boolean; // Mostrar rejilla
	snap: boolean; // Activar snap
	color?: string; // Color de líneas
	opacity?: number; // Opacidad
}
```

### 14. Implementar Theming

Themes predefinidos (`lightTheme`, `darkTheme`) + soporte para tema personalizado vía prop.

**Themes incluidos:**

```typescript
// theme/lightTheme.ts
export const lightTheme: CanvasTheme = {
	colors: {
		background: "#ffffff",
		grid: "#e0e0e0",
		selection: "#2196f3",
		handle: "#1976d2",
		connection: "#666666",
	},
	element: {
		defaultFill: "#f5f5f5",
		defaultStroke: "#333333",
		strokeWidth: 1,
	},
	text: {
		fontFamily: "system-ui, sans-serif",
		fontSize: 14,
		color: "#333333",
	},
	selection: {
		strokeColor: "#2196f3",
		strokeWidth: 1,
		handleSize: 8,
	},
};

// theme/darkTheme.ts
export const darkTheme: CanvasTheme = {
	colors: {
		background: "#1a1a2e",
		grid: "#2d2d44",
		selection: "#00d9ff",
		handle: "#00a8cc",
		connection: "#888888",
	},
	element: {
		defaultFill: "#16213e",
		defaultStroke: "#0f3460",
		strokeWidth: 1,
	},
	text: {
		fontFamily: "system-ui, sans-serif",
		fontSize: 14,
		color: "#e0e0e0",
	},
	selection: {
		strokeColor: "#00d9ff",
		strokeWidth: 1,
		handleSize: 8,
	},
};
```

**Interface del tema:**

```typescript
interface CanvasTheme {
	colors: {
		background: string;
		grid: string;
		selection: string;
		handle: string;
		connection: string;
	};
	element: {
		defaultFill: string;
		defaultStroke: string;
		strokeWidth: number;
	};
	text: {
		fontFamily: string;
		fontSize: number;
		color: string;
	};
	selection: {
		strokeColor: string;
		strokeWidth: number;
		handleSize: number;
	};
}
```

**Uso:**

```tsx
// Usar tema light (default)
<Canvas theme="light" />

// Usar tema dark
<Canvas theme="dark" />

// Detectar preferencia del sistema
<Canvas theme="system" />

// Tema personalizado completo
<Canvas theme={myCustomTheme} />

// Extender tema existente
import { lightTheme, createTheme } from '@canvas-uml/react';
const customTheme = createTheme(lightTheme, {
  colors: { selection: '#ff5722' },
});
<Canvas theme={customTheme} />
```

### 15. Implementar DrawingCanvas

- Container SVG con viewBox dinámico (zoom/pan)
- Renderizar Grid si está activo
- Renderizar elementos ordenados por z-index
- Manejar eventos: click (selección), drag background (pan/selección área), wheel (zoom)
- Renderizar ConnectionLines entre elementos conectados
- Renderizar SelectionBox durante multi-selección

### 16. Implementar CanvasManager

- `exportToJSON()`: serializa `elements` y `connections` a JSON
- `importFromJSON(data)`: valida y carga estado
- `exportToSVG()`: genera SVG string descargable
- Opcional: `exportToPNG()` usando canvas.toDataURL

### 17. Implementar ElementFactory (función pura)

Factory como función pura en `core/factories/elementFactory.ts` (sin JSX):

```typescript
// Registry de tipos de elementos
const elementRegistry = new Map<string, ElementDefinition>();

export interface ElementDefinition {
	type: string;
	component: React.ComponentType<ElementProps>;
	defaultProps: Partial<ElementProps>;
	category?: string;
}

// Registrar elemento
export function registerElement(definition: ElementDefinition): void {
	elementRegistry.set(definition.type, definition);
}

// Crear instancia de elemento (datos, no JSX)
export function createElement(
	type: string,
	props: Partial<CanvasElement>,
): CanvasElement {
	const definition = elementRegistry.get(type);
	if (!definition) throw new Error(`Unknown element type: ${type}`);

	return {
		id: props.id ?? generateId(),
		type,
		category: definition.category,
		x: props.x ?? 0,
		y: props.y ?? 0,
		width: props.width ?? definition.defaultProps.width ?? 100,
		height: props.height ?? definition.defaultProps.height ?? 100,
		zIndex: props.zIndex ?? 0,
		...props,
	};
}

// Obtener componente para renderizar
export function getElementComponent(
	type: string,
): React.ComponentType<ElementProps> | null {
	return elementRegistry.get(type)?.component ?? null;
}
```

**ElementRenderer** usa el registry:

```typescript
// core/components/ElementRenderer.tsx
export const ElementRenderer: FC<{ element: CanvasElement }> = ({ element }) => {
  const Component = getElementComponent(element.type);
  if (!Component) return null;
  return <Component {...element} />;
};
```

### 18. Implementar Canvas (Compound Component + Controlled/Uncontrolled)

**Soporte Controlled y Uncontrolled:**

```typescript
interface CanvasProps {
	// Uncontrolled mode (internal state)
	defaultElements?: CanvasElement[];

	// Controlled mode (external state)
	elements?: CanvasElement[];
	onElementsChange?: (elements: CanvasElement[]) => void;

	// Callbacks
	onSelectionChange?: (selectedIds: string[]) => void;
	onViewportChange?: (viewport: ViewportState) => void;

	// Config
	theme?: "light" | "dark" | "system" | CanvasTheme;
	grid?: GridConfig;
	readOnly?: boolean;

	// Ref handle
	ref?: React.Ref<CanvasHandle>;
	children?: React.ReactNode; // Para compound components
}

interface CanvasHandle {
	// Imperative API
	export: (format: "json" | "svg" | "png") => Promise<string>;
	import: (data: string) => void;
	addElement: (type: string, props?: Partial<CanvasElement>) => string;
	removeElement: (id: string) => void;
	getSelectedElements: () => CanvasElement[];
	undo: () => void;
	redo: () => void;
	zoomTo: (zoom: number) => void;
	fitToContent: () => void;
}
```

**Compound Components (opcional):**

```tsx
// Uso flexible con compound components
<Canvas theme="dark" defaultElements={initialElements}>
  <Canvas.Toolbar position="top" />
  <Canvas.DrawingArea />
  <Canvas.Minimap position="bottom-right" />
</Canvas>

// O uso simple
<Canvas theme="light" elements={myElements} onElementsChange={setMyElements} />
```

**Composición interna:**

```tsx
export const Canvas = forwardRef<CanvasHandle, CanvasProps>((props, ref) => {
	return (
		<CanvasProvider config={props}>
			<CanvasErrorBoundary fallback={<CanvasErrorFallback />}>
				{props.children ?? (
					<>
						<DrawingCanvas />
						<CanvasManager />
					</>
				)}
			</CanvasErrorBoundary>
		</CanvasProvider>
	);
});

// Compound components como propiedades estáticas
Canvas.Toolbar = CanvasToolbar;
Canvas.DrawingArea = DrawingCanvas;
Canvas.Minimap = CanvasMinimap;
```

### 19. Configurar exports y build

- `src/index.ts`: exportar Canvas, todos los elementos, tipos, hooks
- Configurar Vite para generar:
  - `dist/index.js` (ESM)
  - `dist/index.cjs` (CJS)
  - `dist/index.d.ts` (Types)
- Agregar CSS como módulos importables

### 20. Documentación y demo

- README con instalación, uso básico, API
- Storybook o demo app en `/demo` para showcase
- Ejemplos: diagrama de casos de uso, diagrama de secuencia

### 21. Preparar publicación npm

- Configurar `.npmignore` o `files` en package.json
- Agregar keywords, repository, license (MIT)
- Publicar con `npm publish --access public`

---

## Verification

1. **Unit tests (hooks)**: Probar hooks desacoplados (`useDraggable`, `useResizable`, etc.) sin contextos - solo con mocks de callbacks
2. **Unit tests (factories)**: Probar `createElement`, `registerElement`, validación de schemas
3. **Component tests**: Renderizar elementos con `withElementBehavior` y verificar SVG output
4. **Context tests**: Probar cada contexto aisladamente (CanvasContext, SelectionContext, ViewportContext)
5. **Integration test**: Crear canvas, agregar elementos, exportar/importar JSON
6. **Controlled/Uncontrolled test**: Verificar ambos modos de operación
7. **Undo/Redo test**: Verificar que acciones son reversibles correctamente
8. **Multi-selección test**: Shift+click y área de selección funcionan
9. **Keyboard test**: Todos los atajos responden correctamente
10. **ErrorBoundary test**: Verificar que errores en elementos no crashean el canvas
11. **Theming test**: Tema light, dark, y custom aplican estilos correctamente
12. **Memoization test**: Verificar que elementos no re-renderizan innecesariamente
13. **Manual**: Ejecutar demo, verificar todas las interacciones
14. **Build**: `npm run build` genera dist/ sin errores, types incluidos
15. **Publish dry-run**: `npm publish --dry-run` verifica contenido del paquete

---

## Zero Dependencies

La librería no tiene dependencias runtime. Solo peer dependencies de React.

```json
{
	"name": "@canvas-uml/react",
	"dependencies": {},
	"peerDependencies": {
		"react": ">=18.0.0",
		"react-dom": ">=18.0.0"
	},
	"devDependencies": {
		"typescript": "^5.x",
		"vite": "^5.x",
		"vitest": "^2.x",
		"@testing-library/react": "^16.x",
		"@types/react": "^18.x"
	}
}
```

### Librerías evitadas con implementación propia

| Funcionalidad | Librería evitada        | Implementación propia                          |
| ------------- | ----------------------- | ---------------------------------------------- |
| Drag & Drop   | `react-dnd`, `@dnd-kit` | `useDraggable.ts` - mouse/touch events nativos |
| Resize        | `re-resizable`          | `useResizable.ts` - handles SVG propios        |
| Estado global | `zustand`, `redux`      | React Context + useReducer nativo              |
| Undo/Redo     | `redux-undo`            | Patrón command history en `useHistory.ts`      |
| ID generation | `uuid`, `nanoid`        | `crypto.randomUUID()` con fallback             |
| Deep merge    | `lodash.merge`          | `deepMerge.ts` (~20 líneas)                    |
| Classnames    | `clsx`, `classnames`    | `cx()` - 1 línea                               |
| Keyboard      | `react-hotkeys-hook`    | `useKeyboard.ts` - addEventListener nativo     |
| Validación    | `zod`, `yup`            | Validación manual con TypeScript               |
| Animaciones   | `framer-motion`         | CSS transitions / SMIL SVG nativo              |

### Utilidades propias

```typescript
// utils/id.ts
export const generateId = (): string =>
	typeof crypto !== "undefined" && crypto.randomUUID
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

// utils/classnames.ts
export const cx = (...classes: (string | false | null | undefined)[]): string =>
	classes.filter(Boolean).join(" ");

// utils/deepMerge.ts
export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
	const output = { ...target };
	for (const key in source) {
		const sourceVal = source[key];
		if (
			sourceVal &&
			typeof sourceVal === "object" &&
			!Array.isArray(sourceVal)
		) {
			output[key] = deepMerge(
				target[key] as object,
				sourceVal as object,
			) as T[typeof key];
		} else if (sourceVal !== undefined) {
			output[key] = sourceVal as T[typeof key];
		}
	}
	return output;
}
```

---

## Decisions

| Decisión     | Elegido                       | Razón                                                            | SOLID   |
| ------------ | ----------------------------- | ---------------------------------------------------------------- | ------- |
| Renderizado  | SVG                           | Mejor soporte de interacciones DOM, escalabilidad, accesibilidad |         |
| Lenguaje     | TypeScript                    | Mejor DX para consumidores, autocompletado                       |         |
| Bundler      | Vite library mode             | Build rápido, tree-shaking, zero-config                          |         |
| Contexts     | Separados por responsabilidad | Canvas, Selection, Viewport, History, Theme independientes       | **SRP** |
| Hooks        | Dependency injection          | Reciben callbacks, no dependen de contextos específicos          | **DIP** |
| Elementos    | HOC + React.memo              | Comportamiento inyectado, memoización para performance           | **OCP** |
| Registry     | Map + registerElement         | Agregar elementos sin modificar código existente                 | **OCP** |
| Factory      | Función pura                  | Sin JSX, crea datos que ElementRenderer consume                  | **SRP** |
| Canvas       | Controlled + Uncontrolled     | Flexibilidad para el consumidor                                  | **ISP** |
| Error        | ErrorBoundary                 | Atrapa errores en elementos sin crashear todo el canvas          | **SRP** |
| Undo/Redo    | Context + Stack               | Patrón command history, límite configurable                      |         |
| Multi-select | Shift + Area                  | Estándar en editores gráficos                                    |         |
| Shortcuts    | Hook global                   | Mejora productividad, customizable                               |         |
| Layers       | Z-index numérico              | Simple, permite reordenamiento arbitrario                        |         |
| Grid/Snap    | Configurable                  | Alineación precisa, opcional                                     |         |
| Theming      | light/dark + custom           | Themes predefinidos, personalizable vía prop                     |         |
| Dependencies | Zero runtime deps             | Solo peerDeps (React), utils propias, bundle mínimo              |         |

---

## Extensibilidad: Agregar nuevos elementos

Para agregar un nuevo elemento:

1. Crear archivo en `elements/NuevoElemento.tsx`
2. Extender `ElementBase` y definir el SVG
3. Configurar texto por defecto (posición, editable)
4. Registrar en `elements/base/registry.ts`
5. Exportar en `src/index.ts`

```typescript
// elements/Process.tsx
export const Process = createElement({
  type: 'process',
  category: 'flowchart',  // opcional, para agrupación
  defaultText: { position: 'inside', editable: true },
  render: ({ width, height, fill }) => (
    <rect rx={8} ry={8} width={width} height={height} fill={fill} />
  ),
});
```

---

## API Preview

### Modo Uncontrolled (estado interno)

```tsx
import { Canvas, Rectangle, Actor } from "@canvas-uml/react";

function App() {
	const canvasRef = useRef<CanvasHandle>(null);

	return (
		<Canvas
			ref={canvasRef}
			theme="light"
			grid={{ size: 20, visible: true, snap: true }}
			defaultElements={[
				// defaultElements = uncontrolled
				{
					id: "1",
					type: "actor",
					x: 50,
					y: 50,
					zIndex: 1,
					props: { label: "User" },
				},
				{
					id: "2",
					type: "rectangle",
					x: 200,
					y: 50,
					width: 100,
					height: 60,
					zIndex: 0,
				},
			]}
			onElementsChange={(elements) => console.log("Changed:", elements)}
		/>
	);
}
```

### Modo Controlled (estado externo)

```tsx
import { Canvas, CanvasElement } from "@canvas-uml/react";
import { useState } from "react";

function App() {
	const [elements, setElements] = useState<CanvasElement[]>([]);

	return (
		<Canvas
			elements={elements} // estado controlado externamente
			onElementsChange={setElements} // actualiza tu estado
			theme="dark"
		/>
	);
}
```

### Compound Components

```tsx
import { Canvas } from "@canvas-uml/react";

function App() {
	return (
		<Canvas theme="light" defaultElements={initialElements}>
			<Canvas.Toolbar position="top">
				<Canvas.ToolButton tool="select" />
				<Canvas.ToolButton tool="rectangle" />
				<Canvas.ToolButton tool="actor" />
			</Canvas.Toolbar>
			<Canvas.DrawingArea />
			<Canvas.Minimap position="bottom-right" />
		</Canvas>
	);
}
```

### Tema personalizado

```tsx
import { Canvas, lightTheme, createTheme } from "@canvas-uml/react";

// Extender tema existente
const customTheme = createTheme(lightTheme, {
	colors: { selection: "#ff5722", background: "#fafafa" },
	element: { defaultStroke: "#1976d2" },
});

<Canvas theme={customTheme} />;
```

### Elemento standalone

```tsx
import { Actor, Rectangle } from "@canvas-uml/react";

// Con texto debajo (por defecto para Actor)
<Actor label="User" width={60} height={100} />

// Con texto dentro
<Rectangle
  width={100}
  height={60}
  text="Login"
  textPosition="inside"
/>

// Con texto arriba
<Rectangle
  width={100}
  height={60}
  text="Step 1"
  textPosition="above"
/>
```
