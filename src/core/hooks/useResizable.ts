// useResizable hook
// Provides resize functionality for elements

import { useCallback, useRef, useState } from "react";
import type { Point } from "@/types/elements";
import type { ResizeHandle } from "@/core/utils/geometry";
import { useViewport } from "@/core/context";

export interface ResizeState {
	isResizing: boolean;
	handle: ResizeHandle | null;
	startBounds: { x: number; y: number; width: number; height: number } | null;
	currentBounds: { x: number; y: number; width: number; height: number } | null;
}

export interface UseResizableOptions {
	onResizeStart?: (handle: ResizeHandle) => void;
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

export interface UseResizableReturn {
	resizeState: ResizeState;
	startResize: (
		handle: ResizeHandle,
		bounds: { x: number; y: number; width: number; height: number },
		e: React.MouseEvent | React.TouchEvent,
	) => void;
	isResizing: boolean;
}

export const useResizable = (
	options: UseResizableOptions = {},
): UseResizableReturn => {
	const {
		onResizeStart,
		onResize,
		onResizeEnd,
		disabled = false,
		minWidth = 20,
		minHeight = 20,
		maxWidth = Infinity,
		maxHeight = Infinity,
		maintainAspectRatio = false,
		aspectRatio,
	} = options;

	const [resizeState, setResizeState] = useState<ResizeState>({
		isResizing: false,
		handle: null,
		startBounds: null,
		currentBounds: null,
	});

	const startRef = useRef<{
		position: Point;
		bounds: { x: number; y: number; width: number; height: number };
		handle: ResizeHandle;
		aspectRatio: number;
	} | null>(null);

	const { screenToCanvas } = useViewport();

	const getEventPosition = useCallback(
		(e: MouseEvent | TouchEvent): Point => {
			if ("touches" in e) {
				const touch = e.touches[0] || e.changedTouches[0];
				return screenToCanvas({ x: touch.clientX, y: touch.clientY });
			}
			return screenToCanvas({ x: e.clientX, y: e.clientY });
		},
		[screenToCanvas],
	);

	const calculateNewBounds = useCallback(
		(
			currentPos: Point,
		): { x: number; y: number; width: number; height: number } => {
			if (!startRef.current) {
				return { x: 0, y: 0, width: 0, height: 0 };
			}

			const { position: startPos, bounds, handle } = startRef.current;
			const deltaX = currentPos.x - startPos.x;
			const deltaY = currentPos.y - startPos.y;

			let newX = bounds.x;
			let newY = bounds.y;
			let newWidth = bounds.width;
			let newHeight = bounds.height;

			// Calculate based on handle position
			switch (handle) {
				case "nw":
					newX = bounds.x + deltaX;
					newY = bounds.y + deltaY;
					newWidth = bounds.width - deltaX;
					newHeight = bounds.height - deltaY;
					break;
				case "n":
					newY = bounds.y + deltaY;
					newHeight = bounds.height - deltaY;
					break;
				case "ne":
					newY = bounds.y + deltaY;
					newWidth = bounds.width + deltaX;
					newHeight = bounds.height - deltaY;
					break;
				case "e":
					newWidth = bounds.width + deltaX;
					break;
				case "se":
					newWidth = bounds.width + deltaX;
					newHeight = bounds.height + deltaY;
					break;
				case "s":
					newHeight = bounds.height + deltaY;
					break;
				case "sw":
					newX = bounds.x + deltaX;
					newWidth = bounds.width - deltaX;
					newHeight = bounds.height + deltaY;
					break;
				case "w":
					newX = bounds.x + deltaX;
					newWidth = bounds.width - deltaX;
					break;
			}

			// Apply constraints
			if (newWidth < minWidth) {
				if (handle.includes("w")) {
					newX = bounds.x + bounds.width - minWidth;
				}
				newWidth = minWidth;
			}
			if (newHeight < minHeight) {
				if (handle.includes("n")) {
					newY = bounds.y + bounds.height - minHeight;
				}
				newHeight = minHeight;
			}
			if (newWidth > maxWidth) {
				newWidth = maxWidth;
			}
			if (newHeight > maxHeight) {
				newHeight = maxHeight;
			}

			// Maintain aspect ratio if needed
			if (maintainAspectRatio && startRef.current.aspectRatio) {
				const targetRatio = startRef.current.aspectRatio;
				const currentRatio = newWidth / newHeight;

				if (currentRatio > targetRatio) {
					newWidth = newHeight * targetRatio;
				} else {
					newHeight = newWidth / targetRatio;
				}
			}

			return { x: newX, y: newY, width: newWidth, height: newHeight };
		},
		[minWidth, minHeight, maxWidth, maxHeight, maintainAspectRatio],
	);

	const handleMove = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!startRef.current) return;

			const currentPos = getEventPosition(e);
			const newBounds = calculateNewBounds(currentPos);

			setResizeState((prev) => ({
				...prev,
				currentBounds: newBounds,
			}));

			onResize?.(newBounds);
		},
		[getEventPosition, calculateNewBounds, onResize],
	);

	const handleEnd = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!startRef.current) return;

			const endPos = getEventPosition(e);
			const finalBounds = calculateNewBounds(endPos);

			onResizeEnd?.(finalBounds);

			setResizeState({
				isResizing: false,
				handle: null,
				startBounds: null,
				currentBounds: null,
			});

			startRef.current = null;

			// Cleanup listeners
			document.removeEventListener("mousemove", handleMove);
			document.removeEventListener("mouseup", handleEnd);
			document.removeEventListener("touchmove", handleMove);
			document.removeEventListener("touchend", handleEnd);
		},
		[getEventPosition, calculateNewBounds, handleMove, onResizeEnd],
	);

	const startResize = useCallback(
		(
			handle: ResizeHandle,
			bounds: { x: number; y: number; width: number; height: number },
			e: React.MouseEvent | React.TouchEvent,
		) => {
			if (disabled) return;

			e.preventDefault();
			e.stopPropagation();

			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			const startPos = screenToCanvas({ x: clientX, y: clientY });

			startRef.current = {
				position: startPos,
				bounds,
				handle,
				aspectRatio: aspectRatio ?? bounds.width / bounds.height,
			};

			setResizeState({
				isResizing: true,
				handle,
				startBounds: bounds,
				currentBounds: bounds,
			});

			onResizeStart?.(handle);

			// Add listeners
			document.addEventListener("mousemove", handleMove);
			document.addEventListener("mouseup", handleEnd);
			document.addEventListener("touchmove", handleMove, { passive: false });
			document.addEventListener("touchend", handleEnd);
		},
		[
			disabled,
			screenToCanvas,
			aspectRatio,
			onResizeStart,
			handleMove,
			handleEnd,
		],
	);

	return {
		resizeState,
		startResize,
		isResizing: resizeState.isResizing,
	};
};

export default useResizable;
