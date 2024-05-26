import React, { useRef, useState, useEffect, useCallback } from "react";
import ElementFactory from "./ElementFactory";
import TextElement from "./TextElement";
import TextForm from "./TextForm";
import Toolbar from "./Toolbar";
import InfoBox from "./InfoBox";
import "./DrawingCanvas.css";

const DrawingCanvas = () => {
	const canvasRef = useRef(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [elements, setElements] = useState([]);
	const [currentElement, setCurrentElement] = useState(null);
	const [selectedTool, setSelectedTool] = useState("line");
	const [selectedElementIndex, setSelectedElementIndex] = useState(null);
	const [focusedElementIndex, setFocusedElementIndex] = useState(null);
	const [hoveredElementIndex, setHoveredElementIndex] = useState(null);
	const [clickOffset, setClickOffset] = useState({ x: 0, y: 0 });
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
				if (element instanceof TextElement) {
					setClickOffset({ x: offsetX - element.x, y: offsetY - element.y });
				} else {
					setClickOffset({
						x: offsetX - element.startX,
						y: offsetY - element.startY,
					});
				}
				elements[index].isMoving = true;
				setElements([...elements]);
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
				if (element instanceof TextElement) {
					const deltaX = offsetX - (element.x + clickOffset.x);
					const deltaY = offsetY - (element.y + clickOffset.y);
					element.move(deltaX, deltaY);
					setClickOffset({ x: offsetX - element.x, y: offsetY - element.y });
					setPosition({ x: offsetX, y: offsetY });
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
				}
				setElements([...elements]);
			} else {
				const index = getElementAtPosition(offsetX, offsetY, ctx);
				if (index !== null && selectedTool === "select") {
					setHoveredElementIndex(index);
				} else {
					setHoveredElementIndex(null);
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
		]
	);

	const handleMouseUp = useCallback(() => {
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
	}, [isDrawing, currentElement, selectedElementIndex, elements]);

	const getElementAtPosition = (x, y, ctx) => {
		const index = elements.findIndex((element) =>
			element.isPointInside(x, y, ctx)
		);
		return index !== -1 ? index : null;
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
				{selectedElementIndex !== null && (
					<InfoBox dimensions={dimensions} position={position} />
				)}
				{selectedTool === "text" && <TextForm addText={addText} />}
			</div>
		</div>
	);
};

export default DrawingCanvas;
