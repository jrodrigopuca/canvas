import React, { useRef, useState, useEffect, useCallback } from "react";
import ElementFactory from "./ElementFactory";
import TextElement from "./TextElement";
import TextForm from "./TextForm";
import Toolbar from "./Toolbar";
import InfoBox from "./InfoBox";
import "./DrawingCanvas.css";

const DrawingCanvas = () => {
	const canvasRef = useRef(null);
	const gridCanvasRef = useRef(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [elements, setElements] = useState([]);
	const [currentElement, setCurrentElement] = useState(null);
	const [selectedTool, setSelectedTool] = useState("line");
	const [selectedElementIndex, setSelectedElementIndex] = useState(null);
	const [focusedElementIndex, setFocusedElementIndex] = useState(null);
	const [hoveredElementIndex, setHoveredElementIndex] = useState(null);
	const [clickOffset, setClickOffset] = useState({ x: 0, y: 0 });
	const [resizeDirection, setResizeDirection] = useState(null);
	const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
	const [position, setPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const canvas = canvasRef.current;
		const gridCanvas = gridCanvasRef.current;
		const ctx = canvas.getContext("2d");
		const gridCtx = gridCanvas.getContext("2d");

		gridCanvas.width = canvas.width;
		gridCanvas.height = canvas.height;
		drawGrid(gridCtx, gridCanvas.width, gridCanvas.height);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(gridCanvas, 0, 0);

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

	const handleMouseDown = useCallback(
		(e) => {
			const { offsetX, offsetY } = e.nativeEvent;
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			const index = getElementAtPosition(offsetX, offsetY, ctx);
			if (index !== null && selectedTool === "select") {
				setSelectedElementIndex(index);
				setFocusedElementIndex(index);
				const element = elements[index];
				const resizeDir = getResizeDirection(element, offsetX, offsetY);
				setResizeDirection(resizeDir);
				if (resizeDir) {
					element.isResizing = true;
					setElements([...elements]);
				} else {
					setClickOffset({
						x: offsetX - element.startX,
						y: offsetY - element.startY,
					});
					element.isMoving = true;
					setElements([...elements]);
				}
				setDimensions(element.getDimensions(ctx));
				setPosition({ x: element.startX, y: element.startY });
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
		},
		[elements, selectedTool]
	);

	const handleMouseMove = useCallback(
		(e) => {
			const { offsetX, offsetY } = e.nativeEvent;
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
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
				if (element.isResizing) {
					element.resize(offsetX, offsetY, resizeDirection);
					setDimensions(element.getDimensions(ctx));
				} else if (element.isMoving) {
					const deltaX = offsetX - (element.startX + clickOffset.x);
					const deltaY = offsetY - (element.startY + clickOffset.y);
					element.move(deltaX, deltaY);
					setClickOffset({
						x: offsetX - element.startX,
						y: offsetY - element.startY,
					});
					setPosition({ x: offsetX, y: offsetY });
					setDimensions(element.getDimensions(ctx));
				}
				setElements([...elements]);
			} else {
				const index = getElementAtPosition(offsetX, offsetY, ctx);
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
		},
		[
			isDrawing,
			currentElement,
			selectedElementIndex,
			elements,
			clickOffset,
			selectedTool,
			resizeDirection,
		]
	);

	const handleMouseUp = useCallback(() => {
		if (isDrawing) {
			setIsDrawing(false);
			setElements((prevElements) => [...prevElements, currentElement]);
			setCurrentElement(null);
		} else if (selectedElementIndex !== null) {
			elements[selectedElementIndex].isMoving = false;
			elements[selectedElementIndex].isResizing = false;
			setElements([...elements]);
		}
		setSelectedElementIndex(null);
		setHoveredElementIndex(null);
		setResizeDirection(null);
	}, [isDrawing, currentElement, selectedElementIndex, elements]);

	const getElementAtPosition = (x, y, ctx) => {
		const index = elements.findIndex((element) =>
			element.isPointInside(x, y, ctx)
		);
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

	const selectTool = useCallback((tool) => {
		setSelectedTool(tool);
	}, []);

	const addText = useCallback((text) => {
		const canvas = canvasRef.current;
		const newTextElement = new TextElement(
			text,
			canvas.width / 2,
			canvas.height / 2
		);
		setElements((prevElements) => [...prevElements, newTextElement]);
	}, []);

	const drawGrid = (ctx, width, height) => {
		const gridSize = 20;
		ctx.strokeStyle = "#e0e0e0";
		ctx.lineWidth = 0.5;
		for (let x = gridSize; x < width; x += gridSize) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
			ctx.stroke();
		}
		for (let y = gridSize; y < height; y += gridSize) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(width, y);
			ctx.stroke();
		}
	};

	return (
		<div className="drawing-container">
			<Toolbar selectedTool={selectedTool} selectTool={selectTool} />
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
				<canvas ref={gridCanvasRef} style={{ display: "none" }} />
				{selectedElementIndex !== null && (
					<InfoBox dimensions={dimensions} position={position} />
				)}
				{selectedTool === "text" && <TextForm addText={addText} />}
			</div>
		</div>
	);
};

export default DrawingCanvas;
