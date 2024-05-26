import React, { useRef, useState, useEffect } from "react";
import ElementFactory from "./ElementFactory";
import "./DrawingCanvas.css";

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
	const [clickOffset, setClickOffset] = useState({ x: 0, y: 0 });
	const [resizeDirection, setResizeDirection] = useState(null);
	const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
	const [position, setPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		elements.forEach((element, index) => {
			element.draw(ctx);
			if (index === hoveredElementIndex) {
				element.focus();
			} else {
				element.blur();
			}
		});

		if (isDrawing && currentElement) {
			currentElement.draw(ctx);
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
				setClickOffset({
					x: offsetX - element.startX,
					y: offsetY - element.startY,
				});
				elements[index].isMoving = true;
				setElements([...elements]);
			}
		} else if (selectedTool !== "select") {
			setIsDrawing(true);
			const newElement = ElementFactory.createElement(
				selectedTool,
				offsetX,
				offsetY,
				offsetX,
				offsetY
			);
			setCurrentElement(newElement);
		} else {
			setFocusedElementIndex(null);
		}
	};

	const handleMouseMove = (e) => {
		const { offsetX, offsetY } = e.nativeEvent;
		const canvas = canvasRef.current;
		if (isDrawing) {
			currentElement.endX = offsetX;
			currentElement.endY = offsetY;
			setCurrentElement(
				Object.assign(
					Object.create(Object.getPrototypeOf(currentElement)),
					currentElement
				)
			);
			setDimensions({
				w: Math.abs(currentElement.startX - offsetX),
				h: Math.abs(currentElement.startY - offsetY),
			});
			setPosition({ x: currentElement.startX, y: currentElement.startY });
		} else if (selectedElementIndex !== null) {
			const element = elements[selectedElementIndex];
			if (isResizing) {
				element.resize(offsetX, offsetY, resizeDirection);
				setDimensions(element.getDimensions());
				canvas.style.cursor = getCursorForDirection(resizeDirection);
			} else {
				const deltaX = offsetX - (element.startX + clickOffset.x);
				const deltaY = offsetY - (element.startY + clickOffset.y);
				element.move(deltaX, deltaY);
				setClickOffset({
					x: offsetX - element.startX,
					y: offsetY - element.startY,
				});
				setPosition({ x: offsetX, y: offsetY });
				setDimensions(element.getDimensions());
				canvas.style.cursor = "move";
			}
			setElements([...elements]);
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
			elements[selectedElementIndex].isMoving = false;
			setElements([...elements]);
		}
		setSelectedElementIndex(null);
		setHoveredElementIndex(null);
		setIsResizing(false);
		setResizeDirection(null);
		canvasRef.current.style.cursor = "default";
	};

	const getElementAtPosition = (x, y) => {
		const index = elements.findIndex((element) => element.isPointInside(x, y));
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
					className={`tool-button ${
						selectedTool === "dotline" ? "active" : ""
					}`}
					onClick={() => selectTool("dotline")}
				>
					Línea Punteada
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
