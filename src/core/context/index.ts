// Core context barrel export

export {
	ThemeContext,
	ThemeProvider,
	useTheme,
	lightTheme,
	darkTheme,
	getThemeCSSVariables,
} from "./ThemeContext";
export {
	ViewportContext,
	ViewportProvider,
	useViewport,
} from "./ViewportContext";
export {
	SelectionContext,
	SelectionProvider,
	useSelection,
} from "./SelectionContext";
export { HistoryContext, HistoryProvider, useHistory } from "./HistoryContext";
export type { CanvasSnapshot } from "./HistoryContext";
export { CanvasContext, CanvasProvider, useCanvas } from "./CanvasContext";
export { CombinedCanvasProvider } from "./CombinedCanvasProvider";
export type { CombinedCanvasProviderProps } from "./CombinedCanvasProvider";
