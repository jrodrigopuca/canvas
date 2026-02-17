// useSelectable hook
// Provides selection functionality for elements

import { useCallback } from "react";
import { useSelection } from "@/core/context";

export interface UseSelectableOptions {
	id: string;
	disabled?: boolean;
	onSelect?: (selected: boolean) => void;
}

export interface UseSelectableReturn {
	isSelected: boolean;
	handlers: {
		onClick: (e: React.MouseEvent) => void;
	};
	select: () => void;
	deselect: () => void;
	toggle: () => void;
}

export const useSelectable = (
	options: UseSelectableOptions,
): UseSelectableReturn => {
	const { id, disabled = false, onSelect } = options;
	const {
		isSelected: checkSelected,
		select: selectElement,
		addToSelection,
		removeFromSelection,
		toggleSelection,
		clearSelection,
	} = useSelection();

	const isSelected = checkSelected(id);

	const select = useCallback(() => {
		if (disabled) return;
		selectElement(id);
		onSelect?.(true);
	}, [disabled, id, selectElement, onSelect]);

	const deselect = useCallback(() => {
		if (disabled) return;
		removeFromSelection(id);
		onSelect?.(false);
	}, [disabled, id, removeFromSelection, onSelect]);

	const toggle = useCallback(() => {
		if (disabled) return;
		const willBeSelected = !isSelected;
		toggleSelection(id);
		onSelect?.(willBeSelected);
	}, [disabled, id, isSelected, toggleSelection, onSelect]);

	const onClick = useCallback(
		(e: React.MouseEvent) => {
			if (disabled) return;

			e.stopPropagation();

			// Multi-select with Ctrl/Cmd or Shift
			if (e.ctrlKey || e.metaKey) {
				toggleSelection(id);
				onSelect?.(!isSelected);
			} else if (e.shiftKey) {
				// Add to selection
				addToSelection(id);
				onSelect?.(true);
			} else {
				// Single select - clear others and select this
				selectElement(id);
				onSelect?.(true);
			}
		},
		[
			disabled,
			id,
			isSelected,
			toggleSelection,
			addToSelection,
			selectElement,
			onSelect,
		],
	);

	return {
		isSelected,
		handlers: {
			onClick,
		},
		select,
		deselect,
		toggle,
	};
};

export default useSelectable;
