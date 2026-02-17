// useRotatable hook
// Provides rotation functionality for elements

import { useCallback, useRef, useState } from "react";
import type { Point } from "@/types/elements";
import { useViewport } from "@/core/context";

export interface RotateState {
	isRotating: boolean;
	startAngle: number | null;
	currentAngle: number | null;
	deltaAngle: number;
}

export interface UseRotatableOptions {
	onRotateStart?: (angle: number) => void;
	onRotate?: (angle: number, deltaAngle: number) => void;
	onRotateEnd?: (angle: number) => void;
	disabled?: boolean;
	snapAngle?: number; // Snap to multiples of this angle (e.g., 15 for 15° increments)
	center?: Point; // Center point for rotation
}

export interface UseRotatableReturn {
	rotateState: RotateState;
	startRotate: (
		center: Point,
		initialRotation: number,
		e: React.MouseEvent | React.TouchEvent,
	) => void;
	isRotating: boolean;
}

export const useRotatable = (
	options: UseRotatableOptions = {},
): UseRotatableReturn => {
	const {
		onRotateStart,
		onRotate,
		onRotateEnd,
		disabled = false,
		snapAngle,
	} = options;

	const [rotateState, setRotateState] = useState<RotateState>({
		isRotating: false,
		startAngle: null,
		currentAngle: null,
		deltaAngle: 0,
	});

	const startRef = useRef<{
		center: Point;
		startMouseAngle: number;
		initialRotation: number;
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

	// Calculate angle from center to point
	const getAngle = useCallback((center: Point, point: Point): number => {
		const dx = point.x - center.x;
		const dy = point.y - center.y;
		return Math.atan2(dy, dx) * (180 / Math.PI);
	}, []);

	// Snap angle to nearest multiple
	const snapToAngle = useCallback(
		(angle: number): number => {
			if (!snapAngle) return angle;
			return Math.round(angle / snapAngle) * snapAngle;
		},
		[snapAngle],
	);

	const handleMove = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!startRef.current || disabled) return;

			const currentPos = getEventPosition(e);
			const { center, startMouseAngle, initialRotation } = startRef.current;

			const currentMouseAngle = getAngle(center, currentPos);
			let deltaAngle = currentMouseAngle - startMouseAngle;
			let newAngle = initialRotation + deltaAngle;

			// Normalize to 0-360
			newAngle = ((newAngle % 360) + 360) % 360;

			// Apply snapping if shift is held
			if ((e as MouseEvent).shiftKey && snapAngle) {
				newAngle = snapToAngle(newAngle);
			}

			setRotateState({
				isRotating: true,
				startAngle: initialRotation,
				currentAngle: newAngle,
				deltaAngle: newAngle - initialRotation,
			});

			onRotate?.(newAngle, newAngle - initialRotation);
		},
		[disabled, getEventPosition, getAngle, snapAngle, snapToAngle, onRotate],
	);

	const handleEnd = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!startRef.current) return;

			const currentPos = getEventPosition(e);
			const { center, startMouseAngle, initialRotation } = startRef.current;

			const currentMouseAngle = getAngle(center, currentPos);
			let deltaAngle = currentMouseAngle - startMouseAngle;
			let finalAngle = initialRotation + deltaAngle;

			// Normalize to 0-360
			finalAngle = ((finalAngle % 360) + 360) % 360;

			// Apply snapping
			if ((e as MouseEvent).shiftKey && snapAngle) {
				finalAngle = snapToAngle(finalAngle);
			}

			onRotateEnd?.(finalAngle);

			setRotateState({
				isRotating: false,
				startAngle: null,
				currentAngle: null,
				deltaAngle: 0,
			});

			startRef.current = null;

			// Cleanup listeners
			document.removeEventListener("mousemove", handleMove);
			document.removeEventListener("mouseup", handleEnd);
			document.removeEventListener("touchmove", handleMove);
			document.removeEventListener("touchend", handleEnd);
		},
		[
			getEventPosition,
			getAngle,
			snapAngle,
			snapToAngle,
			onRotateEnd,
			handleMove,
		],
	);

	const startRotate = useCallback(
		(
			center: Point,
			initialRotation: number,
			e: React.MouseEvent | React.TouchEvent,
		) => {
			if (disabled) return;

			e.stopPropagation();
			e.preventDefault();

			const startPos = getEventPosition(
				e.nativeEvent as MouseEvent | TouchEvent,
			);
			const startMouseAngle = getAngle(center, startPos);

			startRef.current = {
				center,
				startMouseAngle,
				initialRotation,
			};

			setRotateState({
				isRotating: true,
				startAngle: initialRotation,
				currentAngle: initialRotation,
				deltaAngle: 0,
			});

			onRotateStart?.(initialRotation);

			// Add listeners
			document.addEventListener("mousemove", handleMove);
			document.addEventListener("mouseup", handleEnd);
			document.addEventListener("touchmove", handleMove);
			document.addEventListener("touchend", handleEnd);
		},
		[
			disabled,
			getEventPosition,
			getAngle,
			onRotateStart,
			handleMove,
			handleEnd,
		],
	);

	return {
		rotateState,
		startRotate,
		isRotating: rotateState.isRotating,
	};
};

export default useRotatable;
