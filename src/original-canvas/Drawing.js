import React, { useRef, useState, useEffect } from "react";
import "./DrawingCanvas.css"; // Asegúrate de tener este archivo CSS para los estilos

const DrawingCanvas = () => {
	const canvasRef = useRef(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [elements, setElements] = useState([]);
	const [currentElement, setCurrentElement] = useState(null);
	const [selectedTool, setSelectedTool] = useState("line");
	const [selectedElementIndex, setSelectedElementIndex] = useState(null);
	const [focusedElementIndex, setFocusedElementIndex] = useState(null);
	const [isResizing, setIsResizing] = useState(false);
	const [hoveredElementIndex, setHoveredElementIndex] = useState(null);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [resizeDirection, setResizeDirection] = useState(null);
	const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
	const [position, setPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		elements.forEach(
			({ type, startX, startY, endX, endY, isMoving }, index) => {
				const isHovered = index === hoveredElementIndex;
				const isFocused = index === focusedElementIndex;
				const color = isMoving
					? "red"
					: isFocused
					? "green"
					: isHovered
					? "blue"
					: "black";
				if (type === "line") {
					drawLine(ctx, startX, startY, endX, endY, color);
				} else if (type === "rectangle") {
					drawRectangle(ctx, startX, startY, endX, endY, color);
				}
			}
		);

		if (isDrawing && currentElement) {
			const { type, startX, startY, endX, endY } = currentElement;
			const color = "red";
			if (type === "line") {
				drawLine(ctx, startX, startY, endX, endY, color);
			} else if (type === "rectangle") {
				drawRectangle(ctx, startX, startY, endX, endY, color);
			}
		}
	}, [
		elements,
		isDrawing,
		currentElement,
		hoveredElementIndex,
		focusedElementIndex,
	]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (
				focusedElementIndex !== null &&
				(e.key === "Backspace" || e.key === "Delete")
			) {
				setElements((prevElements) =>
					prevElements.filter((_, index) => index !== focusedElementIndex)
				);
				setFocusedElementIndex(null);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [focusedElementIndex]);

	const drawLine = (ctx, x1, y1, x2, y2, color) => {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.strokeStyle = color;
		ctx.stroke();
	};

	const drawRectangle = (ctx, x1, y1, x2, y2, color) => {
		ctx.beginPath();
		ctx.rect(x1, y1, x2 - x1, y2 - y1);
		ctx.strokeStyle = color;
		ctx.stroke();
	};

	const handleMouseDown = (e) => {
		const { offsetX, offsetY } = e.nativeEvent;
		const index = getElementAtPosition(offsetX, offsetY);
		if (index !== null && selectedTool === "select") {
			setSelectedElementIndex(index);
			setFocusedElementIndex(index);
			const element = elements[index];
			const resizeDir = getResizeDirection(element, offsetX, offsetY);
			setResizeDirection(resizeDir);
			setIsResizing(!!resizeDir);
			if (!resizeDir) {
				setOffset({ x: offsetX - element.startX, y: offsetY - element.startY });
				const updatedElements = elements.map((el, idx) =>
					idx === index ? { ...el, isMoving: true } : el
				);
				setElements(updatedElements);
			}
		} else if (selectedTool !== "select") {
			setIsDrawing(true);
			setCurrentElement({
				type: selectedTool,
				startX: offsetX,
				startY: offsetY,
				endX: offsetX,
				endY: offsetY,
			});
		} else {
			// Clicked on an empty space, lose focus
			setFocusedElementIndex(null);
		}
	};

	const handleMouseMove = (e) => {
		const { offsetX, offsetY } = e.nativeEvent;
		const canvas = canvasRef.current;
		if (isDrawing) {
			setCurrentElement((prevElement) => ({
				...prevElement,
				endX: offsetX,
				endY: offsetY,
			}));
			setDimensions({
				w: Math.abs(currentElement.startX - offsetX),
				h: Math.abs(currentElement.startY - offsetY),
			});
			setPosition({ x: currentElement.startX, y: currentElement.startY });
		} else if (selectedElementIndex !== null) {
			const element = elements[selectedElementIndex];
			if (isResizing) {
				const updatedElements = elements.map((el, index) => {
					if (index === selectedElementIndex) {
						const newElement = { ...el };
						if (resizeDirection.includes("top")) {
							newElement.startY = offsetY;
						}
						if (resizeDirection.includes("bottom")) {
							newElement.endY = offsetY;
						}
						if (resizeDirection.includes("left")) {
							newElement.startX = offsetX;
						}
						if (resizeDirection.includes("right")) {
							newElement.endX = offsetX;
						}
						setDimensions({
							w: Math.abs(newElement.startX - newElement.endX),
							h: Math.abs(newElement.startY - newElement.endY),
						});
						return newElement;
					}
					return el;
				});
				setElements(updatedElements);
				canvas.style.cursor = getCursorForDirection(resizeDirection);
			} else {
				const updatedElements = elements.map((el, index) =>
					index === selectedElementIndex
						? {
								...el,
								startX: offsetX - offset.x,
								startY: offsetY - offset.y,
								endX: el.endX - el.startX + offsetX - offset.x,
								endY: el.endY - el.startY + offsetY - offset.y,
								isMoving: true,
						  }
						: el
				);
				setElements(updatedElements);
				setPosition({ x: offsetX - offset.x, y: offsetY - offset.y });
				setDimensions({
					w: Math.abs(element.startX - element.endX),
					h: Math.abs(element.startY - element.endY),
				});
				canvas.style.cursor = "move";
			}
		} else {
			const index = getElementAtPosition(offsetX, offsetY);
			if (index !== null && selectedTool === "select") {
				setHoveredElementIndex(index);
				const element = elements[index];
				const resizeDir = getResizeDirection(element, offsetX, offsetY);
				canvas.style.cursor = resizeDir
					? getCursorForDirection(resizeDir)
					: "move";
			} else {
				setHoveredElementIndex(null);
				canvas.style.cursor = "default";
			}
		}
	};

	const handleMouseUp = () => {
		if (isDrawing) {
			setIsDrawing(false);
			setElements((prevElements) => [...prevElements, currentElement]);
			setCurrentElement(null);
		} else if (selectedElementIndex !== null) {
			const updatedElements = elements.map((el, index) =>
				index === selectedElementIndex ? { ...el, isMoving: false } : el
			);
			setElements(updatedElements);
		}
		setSelectedElementIndex(null);
		setHoveredElementIndex(null);
		setIsResizing(false);
		setResizeDirection(null);
		canvasRef.current.style.cursor = "default";
	};

	const getElementAtPosition = (x, y) => {
		const threshold = 5; // Distance threshold for detecting a click near the line
		const index = elements.findIndex(({ type, startX, startY, endX, endY }) => {
			if (type === "rectangle") {
				return (
					x >= Math.min(startX, endX) - threshold &&
					x <= Math.max(startX, endX) + threshold &&
					y >= Math.min(startY, endY) - threshold &&
					y <= Math.max(startY, endY) + threshold
				);
			} else if (type === "line") {
				const distance =
					Math.abs(
						(endY - startY) * x -
							(endX - startX) * y +
							endX * startY -
							endY * startX
					) / Math.sqrt((endY - startY) ** 2 + (endX - startX) ** 2);
				return distance <= threshold;
			}
			return false;
		});
		return index !== -1 ? index : null;
	};

	const getResizeDirection = (element, x, y) => {
		const { startX, startY, endX, endY } = element;
		const handleSize = 10;
		let direction = "";
		if (y >= startY - handleSize && y <= startY + handleSize)
			direction += "top";
		if (y >= endY - handleSize && y <= endY + handleSize) direction += "bottom";
		if (x >= startX - handleSize && x <= startX + handleSize)
			direction += "left";
		if (x >= endX - handleSize && x <= endX + handleSize) direction += "right";
		return direction;
	};

	const getCursorForDirection = (direction) => {
		switch (direction) {
			case "top":
			case "bottom":
				return "ns-resize";
			case "left":
			case "right":
				return "ew-resize";
			case "topleft":
			case "bottomright":
				return "nwse-resize";
			case "topright":
			case "bottomleft":
				return "nesw-resize";
			default:
				return "default";
		}
	};

	const selectTool = (tool) => {
		setSelectedTool(tool);
	};

	return (
		<div className="drawing-container">
			<div className="toolbar">
				<button
					className={`tool-button ${selectedTool === "line" ? "active" : ""}`}
					onClick={() => selectTool("line")}
				>
					Línea
				</button>
				<button
					className={`tool-button ${
						selectedTool === "rectangle" ? "active" : ""
					}`}
					onClick={() => selectTool("rectangle")}
				>
					Rectángulo
				</button>
				<button
					className={`tool-button ${selectedTool === "select" ? "active" : ""}`}
					onClick={() => selectTool("select")}
				>
					Seleccionar
				</button>
			</div>
			<div className="canvas-wrapper">
				<canvas
					ref={canvasRef}
					width={800}
					height={600}
					className="drawing-canvas"
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
				/>
				{selectedElementIndex !== null && (
					<div className="info-box">
						<div>W: {dimensions.w}px</div>
						<div>H: {dimensions.h}px</div>
						<div>X: {position.x}px</div>
						<div>Y: {position.y}px</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default DrawingCanvas;
