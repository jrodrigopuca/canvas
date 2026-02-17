import { ComponentType } from 'react';
import { default as default_2 } from 'react';

export declare const ActivationBar: default_2.ForwardRefExoticComponent<WithElementBehaviorProps & Omit<ActivationBarProps, keyof ElementRenderProps> & default_2.RefAttributes<SVGGElement>>;

declare interface ActivationBarProps extends ElementRenderProps {
}

export declare const Actor: default_2.ForwardRefExoticComponent<WithElementBehaviorProps & Omit<ActorProps, keyof ElementRenderProps> & default_2.RefAttributes<SVGGElement>>;

/**
 * Actor element (UML stick figure)
 */
export declare interface ActorElement extends CanvasElement {
    type: "actor";
    label?: string;
}

declare interface ActorProps extends ElementRenderProps {
    element: ActorElement;
}

/**
 * Connection anchor position
 */
declare type AnchorPosition = "top" | "right" | "bottom" | "left" | "center";

/**
 * Bounding box (position + size)
 */
export declare interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Check if two bounds intersect
 */
export declare const boundsIntersect: (a: Bounds, b: Bounds) => boolean;

/**
 * Bring element to front (highest z-index)
 */
export declare const bringToFront: (elements: CanvasElement[], elementId: string) => CanvasElement[];

export declare const Canvas: default_2.ForwardRefExoticComponent<CanvasProps & default_2.RefAttributes<CanvasRef>>;

/**
 * Canvas configuration
 */
export declare interface CanvasConfig {
    width: number;
    height: number;
    grid?: Partial<GridConfig>;
    readonly?: boolean;
}

declare interface CanvasContextValue {
    elements: CanvasElement[];
    connections: Connection[];
    config: CanvasConfig;
    getElementById: (id: string) => CanvasElement | undefined;
    getElementsByType: (type: ElementType) => CanvasElement[];
    addElement: (element: Omit<CanvasElement, 'id'> & {
        id?: string;
    }) => string;
    addElements: (elements: Array<Omit<CanvasElement, 'id'> & {
        id?: string;
    }>) => string[];
    updateElement: (id: string, updates: Partial<CanvasElement>) => void;
    updateElements: (ids: string[], updates: Partial<CanvasElement>) => void;
    removeElement: (id: string) => void;
    removeElements: (ids: string[]) => void;
    moveElement: (id: string, x: number, y: number) => void;
    moveElements: (ids: string[], deltaX: number, deltaY: number) => void;
    resizeElement: (id: string, width: number, height: number, x?: number, y?: number) => void;
    bringToFront: (id: string) => void;
    sendToBack: (id: string) => void;
    moveUp: (id: string) => void;
    moveDown: (id: string) => void;
    setElements: (elements: CanvasElement[]) => void;
    getConnectionById: (id: string) => Connection | undefined;
    getConnectionsForElement: (elementId: string) => Connection[];
    addConnection: (connection: Omit<Connection, 'id'> & {
        id?: string;
    }) => string;
    updateConnection: (id: string, updates: Partial<Connection>) => void;
    removeConnection: (id: string) => void;
    setConnections: (connections: Connection[]) => void;
    updateConfig: (config: Partial<CanvasConfig>) => void;
    clearCanvas: () => void;
    loadState: (elements: CanvasElement[], connections: Connection[]) => void;
}

declare interface CanvasData {
    version: string;
    elements: CanvasElement[];
    connections: Connection[];
    metadata?: Record<string, unknown>;
}

/**
 * Base canvas element interface
 */
export declare interface CanvasElement {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    rotation?: number;
    style?: ElementStyle;
    locked?: boolean;
    visible?: boolean;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    data?: Record<string, unknown>;
}

/**
 * Base canvas event
 */
export declare interface CanvasEvent {
    type: string;
    timestamp: number;
}

export declare interface CanvasProps {
    elements?: CanvasElement[];
    connections?: Connection[];
    selectedIds?: string[];
    defaultElements?: CanvasElement[];
    defaultConnections?: Connection[];
    width?: number;
    height?: number;
    config?: Partial<CanvasConfig>;
    theme?: 'light' | 'dark' | Theme;
    readonly?: boolean;
    initialViewport?: Partial<ViewportState>;
    maxHistorySize?: number;
    showGrid?: boolean;
    gridSize?: number;
    enableKeyboardShortcuts?: boolean;
    onChange?: (elements: CanvasElement[], connections: Connection[]) => void;
    onSelectionChange?: (selectedIds: string[]) => void;
    onElementAdd?: (element: CanvasElement) => void;
    onElementUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
    onElementRemove?: (id: string) => void;
    className?: string;
    style?: default_2.CSSProperties;
    children?: default_2.ReactNode;
}

export declare const CanvasProvider: default_2.FC<CanvasProviderProps>;

declare interface CanvasProviderProps {
    children: default_2.ReactNode;
    initialElements?: CanvasElement[];
    initialConnections?: Connection[];
    config?: Partial<CanvasConfig>;
    onChange?: (elements: CanvasElement[], connections: Connection[]) => void;
}

export declare interface CanvasRef {
    addElement: (element: Omit<CanvasElement, 'id'> & {
        id?: string;
    }) => string;
    updateElement: (id: string, updates: Partial<CanvasElement>) => void;
    removeElement: (id: string) => void;
    getElement: (id: string) => CanvasElement | undefined;
    getElementsByType: (type: ElementType) => CanvasElement[];
    select: (id: string) => void;
    selectMultiple: (ids: string[]) => void;
    clearSelection: () => void;
    getSelectedIds: () => string[];
    zoomIn: () => void;
    zoomOut: () => void;
    setZoom: (zoom: number) => void;
    resetViewport: () => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    toJSON: () => {
        elements: CanvasElement[];
        connections: Connection[];
    };
    toSVG: () => string;
}

declare interface CanvasSnapshot {
    elements: CanvasElement[];
    connections: Connection[];
    timestamp: number;
}

/**
 * Canvas state (for controlled mode)
 */
declare interface CanvasState_2 {
    width: number;
    height: number;
    zoom: number;
    pan: Point;
}
export { CanvasState_2 as CanvasState }

/**
 * Circle is an Ellipse with equal width and height
 * Use at component level: <Ellipse element={{ ...element, width: size, height: size }} />
 */
export declare const Circle: default_2.ForwardRefExoticComponent<WithElementBehaviorProps & Omit<EllipseProps, keyof ElementRenderProps> & default_2.RefAttributes<SVGGElement>>;

declare type ClassObject = {
    [key: string]: boolean | undefined | null;
};

declare type ClassValue = string | number | boolean | undefined | null | ClassObject | ClassValue[];

/**
 * Combined provider that composes all canvas contexts
 * Use this for full-featured canvas components
 */
export declare const CombinedCanvasProvider: default_2.FC<CombinedCanvasProviderProps>;

declare interface CombinedCanvasProviderProps {
    children: default_2.ReactNode;
    initialElements?: CanvasElement[];
    initialConnections?: Connection[];
    config?: Partial<CanvasConfig>;
    theme?: 'light' | 'dark' | Theme;
    initialViewport?: Partial<ViewportState>;
    maxHistorySize?: number;
    onElementsChange?: (elements: CanvasElement[], connections: Connection[]) => void;
    onSelectionChange?: (selectedIds: string[]) => void;
    elements?: CanvasElement[];
    connections?: Connection[];
    selectedIds?: string[];
}

/**
 * Connection between elements
 */
export declare interface Connection {
    id: string;
    fromId: string;
    toId: string;
    fromAnchor?: AnchorPosition;
    toAnchor?: AnchorPosition;
    style?: ElementStyle;
    label?: string;
}

/**
 * Create an activation bar element (UML)
 */
export declare const createActivationBar: (options?: CreateElementOptions) => CanvasElement;

/**
 * Create an actor element (UML)
 */
export declare const createActor: (options?: CreateActorElementOptions) => ActorElement;

declare interface CreateActorElementOptions extends CreateElementOptions {
    label?: string;
}

/**
 * Create a circle element (ellipse with equal dimensions)
 */
export declare const createCircle: (options?: CreateElementOptions) => CanvasElement;

/**
 * Create a diamond element
 */
export declare const createDiamond: (options?: CreateElementOptions) => CanvasElement;

/**
 * Factory function to create any element by type
 */
export declare const createElement: (type: ElementType, options?: CreateElementOptions & Record<string, unknown>) => CanvasElement;

export declare interface CreateElementOptions {
    id?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    style?: ElementStyle;
    zIndex?: number;
    locked?: boolean;
    visible?: boolean;
    data?: Record<string, unknown>;
}

/**
 * Create an ellipse element
 */
export declare const createEllipse: (options?: CreateElementOptions) => CanvasElement;

/**
 * Create a lifeline element (UML)
 */
export declare const createLifeline: (options?: CreateLifelineElementOptions) => LifelineElement;

declare interface CreateLifelineElementOptions extends CreateElementOptions {
    label?: string;
}

/**
 * Create a line element
 */
export declare const createLine: (options?: CreateLineElementOptions) => LineElement;

declare interface CreateLineElementOptions extends CreateElementOptions {
    points?: Point[];
    lineType?: "solid" | "dashed" | "dotted";
}

/**
 * Create a message element (UML)
 */
export declare const createMessage: (options?: CreateMessageElementOptions) => MessageElement;

declare interface CreateMessageElementOptions extends CreateElementOptions {
    label?: string;
    messageType?: "sync" | "async" | "return" | "create";
    fromId?: string;
    toId?: string;
}

/**
 * Create a rectangle element
 */
export declare const createRectangle: (options?: CreateElementOptions) => CanvasElement;

/**
 * Create a text element
 */
export declare const createText: (options?: CreateTextElementOptions) => TextElementType;

declare interface CreateTextElementOptions extends CreateElementOptions {
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: "normal" | "bold";
    textAlign?: "left" | "center" | "right";
}

export declare const cx: (...args: ClassValue[]) => string;

export declare const darkTheme: Theme;

export declare function deepMerge<T extends object>(target: T, source: Partial<T>): T;

/**
 * Deserialize JSON string to canvas data
 */
export declare const deserializeFromJSON: (json: string) => CanvasData;

export declare const Diamond: default_2.ForwardRefExoticComponent<WithElementBehaviorProps & Omit<DiamondProps, keyof ElementRenderProps> & default_2.RefAttributes<SVGGElement>>;

declare interface DiamondProps extends ElementRenderProps {
}

/**
 * Calculate distance between two points
 */
export declare const distance: (p1: Point, p2: Point) => number;

/**
 * Download string content as file
 */
export declare const downloadAsFile: (content: string, filename: string, mimeType: string) => void;

/**
 * Drag event
 */
declare interface DragEvent_2 extends CanvasEvent {
    type: "drag:start" | "drag:move" | "drag:end";
    elementId: string;
    startPosition: Point;
    currentPosition: Point;
    delta: Point;
}
export { DragEvent_2 as DragEvent }

declare interface DragState {
    isDragging: boolean;
    startPosition: Point | null;
    currentPosition: Point | null;
    delta: Point;
}

export declare const DrawingCanvas: default_2.ForwardRefExoticComponent<DrawingCanvasProps & default_2.RefAttributes<SVGSVGElement>>;

export declare interface DrawingCanvasProps {
    width?: number;
    height?: number;
    className?: string;
    style?: default_2.CSSProperties;
    showGrid?: boolean;
    gridSize?: number;
    onCanvasClick?: (e: default_2.MouseEvent) => void;
    onCanvasDoubleClick?: (e: default_2.MouseEvent) => void;
    children?: default_2.ReactNode;
}

export declare const ElementBase: default_2.ForwardRefExoticComponent<ElementBaseProps & default_2.RefAttributes<SVGGElement>>;

export declare interface ElementBaseProps {
    element: CanvasElement;
    children: default_2.ReactNode;
    className?: string;
    style?: default_2.CSSProperties;
    disabled?: boolean;
    showHandles?: boolean;
    onSelect?: (selected: boolean) => void;
    onDragStart?: () => void;
    onDrag?: (x: number, y: number) => void;
    onDragEnd?: (x: number, y: number) => void;
    onResizeStart?: () => void;
    onResize?: (width: number, height: number, x: number, y: number) => void;
    onResizeEnd?: (width: number, height: number, x: number, y: number) => void;
}

/**
 * Element-related event
 */
export declare interface ElementEvent extends CanvasEvent {
    elementId: string;
    element: CanvasElement;
}

export declare const ElementFactory: {
    create: (type: ElementType, options?: CreateElementOptions & Record<string, unknown>) => CanvasElement;
    rectangle: (options?: CreateElementOptions) => CanvasElement;
    ellipse: (options?: CreateElementOptions) => CanvasElement;
    circle: (options?: CreateElementOptions) => CanvasElement;
    diamond: (options?: CreateElementOptions) => CanvasElement;
    text: (options?: CreateTextElementOptions) => TextElementType;
    line: (options?: CreateLineElementOptions) => LineElement;
    actor: (options?: CreateActorElementOptions) => ActorElement;
    lifeline: (options?: CreateLifelineElementOptions) => LifelineElement;
    message: (options?: CreateMessageElementOptions) => MessageElement;
    activationBar: (options?: CreateElementOptions) => CanvasElement;
};

/**
 * Props that the wrapped component receives
 */
export declare interface ElementRenderProps {
    element: CanvasElement;
    isSelected: boolean;
    isDragging: boolean;
    isResizing: boolean;
}

/**
 * Element style properties
 */
export declare interface ElementStyle {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    cornerRadius?: number;
}

/**
 * Available element types
 */
export declare type ElementType = "rectangle" | "ellipse" | "circle" | "diamond" | "text" | "line" | "actor" | "lifeline" | "message" | "activationBar" | "custom";

export declare const Ellipse: default_2.ForwardRefExoticComponent<WithElementBehaviorProps & Omit<EllipseProps, keyof ElementRenderProps> & default_2.RefAttributes<SVGGElement>>;

declare interface EllipseProps extends ElementRenderProps {
}

/**
 * Export canvas as SVG string
 */
export declare const exportToSVG: (svgElement: SVGSVGElement, options?: {
    includeStyles?: boolean;
}) => string;

export declare const generateId: () => string;

/**
 * Get resize handle positions for a given bounds
 */
export declare const getResizeHandles: (bounds: Bounds, handleSize: number) => ResizeHandleInfo[];

export declare const getThemeCSSVariables: (theme: Theme) => Record<string, string>;

/**
 * Grid configuration
 */
export declare interface GridConfig {
    enabled: boolean;
    size: number;
    snap: boolean;
    visible: boolean;
    color?: string;
    opacity?: number;
}

declare interface HistoryContextValue {
    canUndo: boolean;
    canRedo: boolean;
    historySize: number;
    futureSize: number;
    present: CanvasSnapshot;
    pushState: (elements: CanvasElement[], connections: Connection[]) => void;
    undo: () => void;
    redo: () => void;
    clearHistory: () => void;
    setPresent: (elements: CanvasElement[], connections: Connection[]) => void;
    setMaxHistorySize: (size: number) => void;
}

export declare const HistoryProvider: default_2.FC<HistoryProviderProps>;

declare interface HistoryProviderProps {
    children: default_2.ReactNode;
    initialElements?: CanvasElement[];
    initialConnections?: Connection[];
    maxHistorySize?: number;
    onStateChange?: (elements: CanvasElement[], connections: Connection[]) => void;
}

/**
 * Check if a point is inside bounds
 */
export declare const isPointInBounds: (point: Point, bounds: Bounds) => boolean;

declare type KeyboardShortcut = {
    key: string;
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: () => void;
    preventDefault?: boolean;
};

export declare const Lifeline: default_2.ForwardRefExoticComponent<WithElementBehaviorProps & Omit<LifelineProps, keyof ElementRenderProps> & default_2.RefAttributes<SVGGElement>>;

/**
 * Lifeline element (UML sequence diagram)
 */
export declare interface LifelineElement extends CanvasElement {
    type: "lifeline";
    label?: string;
}

declare interface LifelineProps extends ElementRenderProps {
    element: LifelineElement;
}

export declare const lightTheme: Theme;

export declare const Line: default_2.ForwardRefExoticComponent<WithElementBehaviorProps & Omit<LineProps, keyof ElementRenderProps> & default_2.RefAttributes<SVGGElement>>;

/**
 * Line element
 */
export declare interface LineElement extends CanvasElement {
    type: "line";
    points?: Point[];
    lineType?: LineType;
}

declare interface LineProps extends ElementRenderProps {
    element: LineElement;
}

/**
 * Line type options
 */
declare type LineType = "solid" | "dashed" | "dotted";

export declare const Message: default_2.ForwardRefExoticComponent<WithElementBehaviorProps & Omit<MessageProps, keyof ElementRenderProps> & default_2.RefAttributes<SVGGElement>>;

/**
 * Message element (UML sequence diagram arrow)
 */
export declare interface MessageElement extends CanvasElement {
    type: "message";
    label?: string;
    messageType?: MessageType;
    fromId?: string;
    toId?: string;
}

declare interface MessageProps extends ElementRenderProps {
    element: MessageElement;
}

/**
 * Message type options
 */
export declare type MessageType = "sync" | "async" | "return" | "create";

/**
 * Oval is an alias for Ellipse
 */
export declare const Oval: default_2.ForwardRefExoticComponent<WithElementBehaviorProps & Omit<EllipseProps, keyof ElementRenderProps> & default_2.RefAttributes<SVGGElement>>;

/**
 * A point in 2D space
 */
export declare interface Point {
    x: number;
    y: number;
}

export declare const Rectangle: default_2.ForwardRefExoticComponent<WithElementBehaviorProps & Omit<RectangleProps, keyof ElementRenderProps> & default_2.RefAttributes<SVGGElement>>;

declare interface RectangleProps extends ElementRenderProps {
}

/**
 * Resize event
 */
export declare interface ResizeEvent extends CanvasEvent {
    type: "resize:start" | "resize:move" | "resize:end";
    elementId: string;
    handle: ResizeHandle;
    startBounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    currentBounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

/**
 * Resize handle positions
 */
declare type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

/**
 * Resize handle positions
 */
declare type ResizeHandle_2 = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

/**
 * Resize handle info
 */
declare interface ResizeHandleInfo {
    position: ResizeHandle_2;
    x: number;
    y: number;
}

declare interface ResizeState {
    isResizing: boolean;
    handle: ResizeHandle_2 | null;
    startBounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    currentBounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
}

declare interface SelectionContextValue {
    selectedIds: string[];
    lastSelectedId: string | null;
    selectionCount: number;
    hasSelection: boolean;
    isSelected: (id: string) => boolean;
    select: (id: string) => void;
    selectMultiple: (ids: string[]) => void;
    addToSelection: (id: string) => void;
    removeFromSelection: (id: string) => void;
    toggleSelection: (id: string) => void;
    clearSelection: () => void;
    selectAll: (ids: string[]) => void;
}

/**
 * Selection change event
 */
export declare interface SelectionEvent extends CanvasEvent {
    type: "selection:change";
    selectedIds: string[];
    previousSelectedIds: string[];
}

export declare const SelectionProvider: default_2.FC<SelectionProviderProps>;

declare interface SelectionProviderProps {
    children: default_2.ReactNode;
    initialSelection?: string[];
    onSelectionChange?: (selectedIds: string[]) => void;
}

/**
 * Send element to back (lowest z-index)
 */
export declare const sendToBack: (elements: CanvasElement[], elementId: string) => CanvasElement[];

/**
 * Serialize canvas data to JSON string
 */
export declare const serializeToJSON: (elements: CanvasElement[], connections: Connection[], metadata?: Record<string, unknown>) => string;

/**
 * Snap a value to a grid
 */
export declare const snapToGrid: (value: number, gridSize: number) => number;

/**
 * Sort elements by z-index for rendering
 */
export declare const sortByZIndex: (elements: CanvasElement[]) => CanvasElement[];

export declare const TextElement: default_2.ForwardRefExoticComponent<WithElementBehaviorProps & Omit<TextProps, keyof ElementRenderProps> & default_2.RefAttributes<SVGGElement>>;

/**
 * Text element
 */
export declare interface TextElementType extends CanvasElement {
    type: "text";
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: "normal" | "bold";
    textAlign?: "left" | "center" | "right";
}

declare interface TextProps extends ElementRenderProps {
    element: TextElementType;
}

/**
 * Complete theme definition
 */
export declare interface Theme {
    name: string;
    colors: ThemeColors;
    spacing: ThemeSpacing;
    borderRadius: ThemeBorderRadius;
    fontSize: ThemeFontSize;
    strokeWidth: ThemeStrokeWidth;
    shadows: ThemeShadows;
}

/**
 * Border radius values
 */
declare interface ThemeBorderRadius {
    sm: number;
    md: number;
    lg: number;
}

/**
 * Theme color definitions
 */
export declare interface ThemeColors {
    background: string;
    surface: string;
    border: string;
    text: {
        primary: string;
        secondary: string;
        disabled: string;
    };
    selection: {
        fill: string;
        stroke: string;
    };
    element: {
        fill: string;
        stroke: string;
        hover: string;
        active: string;
    };
    handle: {
        fill: string;
        stroke: string;
    };
    grid: {
        line: string;
        dot: string;
    };
    connection: {
        line: string;
        arrow: string;
    };
}

declare interface ThemeContextValue {
    theme: Theme;
    themeName: 'light' | 'dark' | 'custom';
}

/**
 * Font size values
 */
declare interface ThemeFontSize {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
}

export declare const ThemeProvider: default_2.FC<ThemeProviderProps>;

declare interface ThemeProviderProps {
    children: default_2.ReactNode;
    theme?: 'light' | 'dark' | Theme;
}

/**
 * Shadow values
 */
declare interface ThemeShadows {
    sm: string;
    md: string;
    lg: string;
    element: string;
    handle: string;
}

/**
 * Spacing values
 */
declare interface ThemeSpacing {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
}

/**
 * Stroke width values
 */
declare interface ThemeStrokeWidth {
    thin: number;
    normal: number;
    thick: number;
}

export declare const useCanvas: () => CanvasContextValue;

export declare const useCanvasActions: () => UseCanvasActionsReturn;

declare interface UseCanvasActionsReturn {
    addElement: (element: Omit<CanvasElement, "id"> & {
        id?: string;
    }) => string;
    updateElement: (id: string, updates: Partial<CanvasElement>) => void;
    removeElement: (id: string) => void;
    removeSelected: () => void;
    moveSelected: (deltaX: number, deltaY: number) => void;
    duplicateSelected: () => string[];
    addConnection: (connection: Omit<Connection, "id"> & {
        id?: string;
    }) => string;
    removeConnection: (id: string) => void;
    copy: () => void;
    cut: () => void;
    paste: () => void;
    hasCopied: boolean;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

/**
 * Common canvas shortcuts preset
 */
export declare const useCanvasKeyboardShortcuts: (actions: {
    undo?: () => void;
    redo?: () => void;
    delete?: () => void;
    selectAll?: () => void;
    copy?: () => void;
    paste?: () => void;
    cut?: () => void;
    escape?: () => void;
    zoomIn?: () => void;
    zoomOut?: () => void;
    resetZoom?: () => void;
}) => void;

export declare const useDraggable: (options?: UseDraggableOptions) => UseDraggableReturn;

declare interface UseDraggableOptions {
    onDragStart?: (position: Point) => void;
    onDrag?: (position: Point, delta: Point) => void;
    onDragEnd?: (position: Point, delta: Point) => void;
    disabled?: boolean;
    threshold?: number;
    constrainToParent?: boolean;
}

declare interface UseDraggableReturn {
    dragState: DragState;
    handlers: {
        onMouseDown: (e: React.MouseEvent) => void;
        onTouchStart: (e: React.TouchEvent) => void;
    };
    isDragging: boolean;
}

export declare const useHistory: () => HistoryContextValue;

export declare const useKeyboard: (options?: UseKeyboardOptions) => void;

declare interface UseKeyboardOptions {
    shortcuts?: KeyboardShortcut[];
    enabled?: boolean;
    targetRef?: React.RefObject<HTMLElement>;
}

export declare const useResizable: (options?: UseResizableOptions) => UseResizableReturn;

declare interface UseResizableOptions {
    onResizeStart?: (handle: ResizeHandle_2) => void;
    onResize?: (bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }) => void;
    onResizeEnd?: (bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }) => void;
    disabled?: boolean;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    maintainAspectRatio?: boolean;
    aspectRatio?: number;
}

declare interface UseResizableReturn {
    resizeState: ResizeState;
    startResize: (handle: ResizeHandle_2, bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }, e: React.MouseEvent | React.TouchEvent) => void;
    isResizing: boolean;
}

export declare const useSelectable: (options: UseSelectableOptions) => UseSelectableReturn;

declare interface UseSelectableOptions {
    id: string;
    disabled?: boolean;
    onSelect?: (selected: boolean) => void;
}

declare interface UseSelectableReturn {
    isSelected: boolean;
    handlers: {
        onClick: (e: React.MouseEvent) => void;
    };
    select: () => void;
    deselect: () => void;
    toggle: () => void;
}

export declare const useSelection: () => SelectionContextValue;

export declare const useTheme: () => ThemeContextValue;

export declare const useViewport: () => ViewportContextValue;

/**
 * Validate canvas data structure
 */
export declare const validateCanvasData: (data: unknown) => ValidationResult;

declare interface ValidationResult {
    valid: boolean;
    errors: string[];
}

declare interface ViewportContextValue {
    viewport: ViewportState;
    setZoom: (zoom: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    zoomToFit: (bounds: Bounds, padding?: number) => void;
    setPan: (pan: Point) => void;
    panBy: (delta: Point) => void;
    resetViewport: () => void;
    setConstraints: (constraints: {
        minZoom?: number;
        maxZoom?: number;
    }) => void;
    screenToCanvas: (point: Point) => Point;
    canvasToScreen: (point: Point) => Point;
}

export declare const ViewportProvider: default_2.FC<ViewportProviderProps>;

declare interface ViewportProviderProps {
    children: default_2.ReactNode;
    initialViewport?: Partial<ViewportState>;
}

/**
 * Viewport state (zoom and pan)
 */
export declare interface ViewportState {
    zoom: number;
    pan: Point;
    minZoom: number;
    maxZoom: number;
}

/**
 * HOC that wraps a render function with element behavior
 *
 * @example
 * const MyElement = withElementBehavior(({ element }) => (
 *   <rect
 *     width={element.width}
 *     height={element.height}
 *     fill={element.style?.fill ?? '#fff'}
 *   />
 * ));
 */
export declare function withElementBehavior<P extends ElementRenderProps>(RenderComponent: ComponentType<P>): default_2.ForwardRefExoticComponent<default_2.PropsWithoutRef<WithElementBehaviorProps & Omit<P, keyof ElementRenderProps>> & default_2.RefAttributes<SVGGElement>>;

/**
 * Props for the wrapped component with element behavior
 */
export declare interface WithElementBehaviorProps {
    element: CanvasElement;
    disabled?: boolean;
    showHandles?: boolean;
    onSelect?: (selected: boolean) => void;
    onDragStart?: () => void;
    onDrag?: (x: number, y: number) => void;
    onDragEnd?: (x: number, y: number) => void;
    onResizeStart?: () => void;
    onResize?: (width: number, height: number, x: number, y: number) => void;
    onResizeEnd?: (width: number, height: number, x: number, y: number) => void;
    className?: string;
    style?: default_2.CSSProperties;
}

export { }
