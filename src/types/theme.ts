// Theme-related types

/**
 * Theme color definitions
 */
export interface ThemeColors {
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

/**
 * Spacing values
 */
export interface ThemeSpacing {
	xs: number;
	sm: number;
	md: number;
	lg: number;
	xl: number;
}

/**
 * Border radius values
 */
export interface ThemeBorderRadius {
	sm: number;
	md: number;
	lg: number;
}

/**
 * Font size values
 */
export interface ThemeFontSize {
	xs: number;
	sm: number;
	md: number;
	lg: number;
	xl: number;
}

/**
 * Stroke width values
 */
export interface ThemeStrokeWidth {
	thin: number;
	normal: number;
	thick: number;
}

/**
 * Shadow values
 */
export interface ThemeShadows {
	sm: string;
	md: string;
	lg: string;
	element: string;
	handle: string;
}

/**
 * Complete theme definition
 */
export interface Theme {
	name: string;
	colors: ThemeColors;
	spacing: ThemeSpacing;
	borderRadius: ThemeBorderRadius;
	fontSize: ThemeFontSize;
	strokeWidth: ThemeStrokeWidth;
	shadows: ThemeShadows;
}
