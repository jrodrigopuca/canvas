// useDraggable hook
// Provides drag functionality for elements

import { useCallback, useRef, useState } from "react";
import type { Point } from "@/types/elements";
import { useViewport } from "@/core/context";

export interface DragState {
	isDragging: boolean;
	startPosition: Point | null;
	currentPosition: Point | null;
	delta: Point;
}

export interface UseDraggableOptions {
	onDragStart?: (position: Point) => void;
	onDrag?: (position: Point, delta: Point) => void;
	onDragEnd?: (position: Point, delta: Point) => void;
	disabled?: boolean;
	threshold?: number; // Minimum movement to start dragging
	constrainToParent?: boolean;
}

export interface UseDraggableReturn {
	dragState: DragState;
	handlers: {
		onMouseDown: (e: React.MouseEvent) => void;
		onTouchStart: (e: React.TouchEvent) => void;
	};
	isDragging: boolean;
}

export const useDraggable = (
	options: UseDraggableOptions = {},
): UseDraggableReturn => {
	const {
		onDragStart,
		onDrag,
		onDragEnd,
		disabled = false,
		threshold = 3,
	} = options;

	const [dragState, setDragState] = useState<DragState>({
		isDragging: false,
		startPosition: null,
		currentPosition: null,
		delta: { x: 0, y: 0 },
	});

	const startRef = useRef<Point | null>(null);
	const hasPassedThreshold = useRef(false);
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

	const handleMove = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!startRef.current) return;

			const currentPos = getEventPosition(e);
			const delta = {
				x: currentPos.x - startRef.current.x,
				y: currentPos.y - startRef.current.y,
			};

			// Check threshold
			if (!hasPassedThreshold.current) {
				const distance = Math.sqrt(delta.x ** 2 + delta.y ** 2);
				if (distance < threshold) return;
				hasPassedThreshold.current = true;
				onDragStart?.(startRef.current);
			}

			setDragState({
				isDragging: true,
				startPosition: startRef.current,
				currentPosition: currentPos,
				delta,
			});

			onDrag?.(currentPos, delta);
		},
		[getEventPosition, threshold, onDragStart, onDrag],
	);

	const handleEnd = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!startRef.current) return;

			const endPos = getEventPosition(e);
			const delta = {
				x: endPos.x - startRef.current.x,
				y: endPos.y - startRef.current.y,
			};

			if (hasPassedThreshold.current) {
				onDragEnd?.(endPos, delta);
			}

			setDragState({
				isDragging: false,
				startPosition: null,
				currentPosition: null,
				delta: { x: 0, y: 0 },
			});

			startRef.current = null;
			hasPassedThreshold.current = false;

			// Cleanup listeners
			document.removeEventListener("mousemove", handleMove);
			document.removeEventListener("mouseup", handleEnd);
			document.removeEventListener("touchmove", handleMove);
			document.removeEventListener("touchend", handleEnd);
		},
		[getEventPosition, handleMove, onDragEnd],
	);

	const handleStart = useCallback(
		(clientX: number, clientY: number) => {
			if (disabled) return;

			const startPos = screenToCanvas({ x: clientX, y: clientY });
			startRef.current = startPos;
			hasPassedThreshold.current = false;

			setDragState({
				isDragging: false,
				startPosition: startPos,
				currentPosition: startPos,
				delta: { x: 0, y: 0 },
			});

			// Add listeners
			document.addEventListener("mousemove", handleMove);
			document.addEventListener("mouseup", handleEnd);
			document.addEventListener("touchmove", handleMove, { passive: false });
			document.addEventListener("touchend", handleEnd);
		},
		[disabled, screenToCanvas, handleMove, handleEnd],
	);

	const onMouseDown = useCallback(
		(e: React.MouseEvent) => {
			if (e.button !== 0) return; // Only left click
			e.preventDefault();
			e.stopPropagation();
			handleStart(e.clientX, e.clientY);
		},
		[handleStart],
	);

	const onTouchStart = useCallback(
		(e: React.TouchEvent) => {
			if (e.touches.length !== 1) return; // Single touch only
			const touch = e.touches[0];
			handleStart(touch.clientX, touch.clientY);
		},
		[handleStart],
	);

	return {
		dragState,
		handlers: {
			onMouseDown,
			onTouchStart,
		},
		isDragging: dragState.isDragging,
	};
};

export default useDraggable;
