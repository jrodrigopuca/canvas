// useKeyboard hook
// Provides keyboard shortcut handling for canvas

import { useEffect, useCallback, useRef } from "react";

export type KeyboardShortcut = {
	key: string;
	ctrl?: boolean;
	meta?: boolean;
	shift?: boolean;
	alt?: boolean;
	action: () => void;
	preventDefault?: boolean;
};

export interface UseKeyboardOptions {
	shortcuts?: KeyboardShortcut[];
	enabled?: boolean;
	targetRef?: React.RefObject<HTMLElement>;
}

/**
 * Matches a keyboard event against a shortcut definition
 */
const matchesShortcut = (
	e: KeyboardEvent,
	shortcut: KeyboardShortcut,
): boolean => {
	const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
	const ctrlMatches = shortcut.ctrl
		? e.ctrlKey
		: !e.ctrlKey || Boolean(shortcut.meta);
	const metaMatches = shortcut.meta
		? e.metaKey
		: !e.metaKey || Boolean(shortcut.ctrl);
	const shiftMatches = shortcut.shift ? e.shiftKey : !e.shiftKey;
	const altMatches = shortcut.alt ? e.altKey : !e.altKey;

	// For Ctrl/Meta, allow either on macOS
	const modifierMatches =
		shortcut.ctrl || shortcut.meta
			? Boolean(shortcut.ctrl && (e.ctrlKey || e.metaKey)) ||
				Boolean(shortcut.meta && e.metaKey)
			: !e.ctrlKey && !e.metaKey;

	return keyMatches && modifierMatches && shiftMatches && altMatches;
};

export const useKeyboard = (options: UseKeyboardOptions = {}): void => {
	const { shortcuts = [], enabled = true, targetRef } = options;
	const shortcutsRef = useRef(shortcuts);
	shortcutsRef.current = shortcuts;

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (!enabled) return;

			for (const shortcut of shortcutsRef.current) {
				if (matchesShortcut(e, shortcut)) {
					if (shortcut.preventDefault !== false) {
						e.preventDefault();
					}
					shortcut.action();
					return;
				}
			}
		},
		[enabled],
	);

	useEffect(() => {
		const target = targetRef?.current ?? document;
		target.addEventListener("keydown", handleKeyDown as EventListener);
		return () => {
			target.removeEventListener("keydown", handleKeyDown as EventListener);
		};
	}, [handleKeyDown, targetRef]);
};

/**
 * Common canvas shortcuts preset
 */
export const useCanvasKeyboardShortcuts = (actions: {
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
}): void => {
	const shortcuts: KeyboardShortcut[] = [];

	if (actions.undo) {
		shortcuts.push({ key: "z", ctrl: true, action: actions.undo });
	}
	if (actions.redo) {
		shortcuts.push({ key: "z", ctrl: true, shift: true, action: actions.redo });
		shortcuts.push({ key: "y", ctrl: true, action: actions.redo });
	}
	if (actions.delete) {
		shortcuts.push({ key: "Delete", action: actions.delete });
		shortcuts.push({ key: "Backspace", action: actions.delete });
	}
	if (actions.selectAll) {
		shortcuts.push({ key: "a", ctrl: true, action: actions.selectAll });
	}
	if (actions.copy) {
		shortcuts.push({ key: "c", ctrl: true, action: actions.copy });
	}
	if (actions.paste) {
		shortcuts.push({ key: "v", ctrl: true, action: actions.paste });
	}
	if (actions.cut) {
		shortcuts.push({ key: "x", ctrl: true, action: actions.cut });
	}
	if (actions.escape) {
		shortcuts.push({ key: "Escape", action: actions.escape });
	}
	if (actions.zoomIn) {
		shortcuts.push({ key: "+", ctrl: true, action: actions.zoomIn });
		shortcuts.push({ key: "=", ctrl: true, action: actions.zoomIn });
	}
	if (actions.zoomOut) {
		shortcuts.push({ key: "-", ctrl: true, action: actions.zoomOut });
	}
	if (actions.resetZoom) {
		shortcuts.push({ key: "0", ctrl: true, action: actions.resetZoom });
	}

	useKeyboard({ shortcuts });
};

export default useKeyboard;
