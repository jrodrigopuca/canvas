# DrawingCanvas

## Introducción

DrawingCanvas es un componente de React que proporciona una interfaz de usuario para dibujar y manipular diferentes elementos en un lienzo (canvas). Este componente permite crear, mover, redimensionar y eliminar elementos como líneas y rectángulos. Además, incluye una funcionalidad para exportar el contenido del lienzo como una imagen JPG. Esta documentación tiene como objetivo explicar el funcionamiento del componente, las decisiones de diseño tomadas y cómo mantener o extender el código.

# Componentes y Funciones Principales

## Importaciones

En primer lugar, importamos las dependencias necesarias, incluidos los hooks de React y otros componentes necesarios para el funcionamiento del lienzo.

```js
import React, { useRef, useState, useEffect, useCallback } from "react";
import ElementFactory from "./ElementFactory";
import TextElement from "./TextElement";
import TextForm from "./TextForm";
import Toolbar from "./Toolbar";
import InfoBox from "./InfoBox";
import "./DrawingCanvas.css";
```

## Estados y Referencias

Utilizamos hooks de React (useState y useRef) para manejar el estado interno del componente y referencias al canvas y otros elementos DOM. Estos estados controlan aspectos como si el usuario está dibujando, el elemento actual que se está manipulando, y las herramientas seleccionadas.

```js
const canvasRef = useRef(null);
const exportCanvasRef = useRef(null);
const gridCanvasRef = useRef(null);
const [isDrawing, setIsDrawing] = useState(false);
const [currentElement, setCurrentElement] = useState(null);
const [selectedTool, setSelectedTool] = useState("line");
const [selectedElementIndex, setSelectedElementIndex] = useState(null);
const [focusedElementIndex, setFocusedElementIndex] = useState(null);
const [hoveredElementIndex, setHoveredElementIndex] = useState(null);
const [clickOffset, setClickOffset] = useState({ x: 0, y: 0 });
const [resizeDirection, setResizeDirection] = useState(null);
const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
const [position, setPosition] = useState({ x: 0, y: 0 });
```

## Uso de Efectos

### Efecto para Redibujar el Lienzo

Este efecto se ejecuta cada vez que cambian los elementos dibujados, el estado de dibujo, el elemento actual o los índices de elementos enfocados o cuando se pasa el cursor sobre ellos. Se utiliza para redibujar el lienzo, incluyendo una cuadrícula de fondo y todos los elementos actuales.

```js
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
```

Decisiones de diseño:

- Redibujar el lienzo cada vez que cambia algún estado relevante asegura que la interfaz esté siempre actualizada.
- Utilizar un canvas adicional para la cuadrícula permite separar la lógica de dibujo de fondo y los elementos interactivos.

### Efecto para Manejar Teclas de Eliminación

Este efecto se activa cuando se presionan las teclas Backspace o Delete. Si hay un elemento enfocado, se elimina del conjunto de elementos

```js
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
```

Decisiones de diseño:

- Añadir un event listener global permite manejar las acciones de eliminación de manera eficiente, sin necesidad de añadir lógica adicional a cada elemento.

## Manejo de Eventos del Mouse

### `handleMouseDown`

Esta función se activa cuando el usuario presiona el botón del mouse. Dependiendo de la herramienta seleccionada, comienza a dibujar un nuevo elemento o selecciona un elemento existente para moverlo o redimensionarlo.

```js
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
```

Decisiones de diseño:

- Separar las acciones de dibujar y seleccionar en función de la herramienta seleccionada permite un manejo más claro y mantenible de las interacciones del usuario.
- Utilizar getElementAtPosition y getResizeDirection ayuda a determinar si el usuario está intentando mover o redimensionar un elemento existente.

### `handleMouseMove`

Esta función se activa cuando el usuario mueve el mouse. Dependiendo del estado actual (dibujando, moviendo o redimensionando), actualiza las coordenadas del elemento en curso.

```js
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
```

Decisiones de diseño:

- Actualizar las dimensiones y la posición en tiempo real mejora la experiencia del usuario al proporcionar una retroalimentación visual inmediata.
- Utilizar el cursor adecuado para las diferentes acciones (mover, redimensionar) mejora la usabilidad.

### `handleMouseUp`

Esta función se activa cuando el usuario suelta el botón del mouse. Finaliza la acción actual (dibujar, mover o redimensionar) y actualiza el estado de los elementos.

```js
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
```

Decisiones de diseño:

- Restablecer los estados de movimiento y redimensionamiento asegura que las acciones del usuario se gestionen correctamente.

## Funciones Auxiliares

### `getElementAtPosition`

Esta función determina si existe un elemento en una posición específica (x, y) dentro del lienzo. Recorre todos los elementos y utiliza el método isPointInside de cada elemento para verificar si el punto está dentro de sus límites. Devuelve el índice del elemento si existe en esa posición.

```js
const getElementAtPosition = (x, y, ctx) => {
	const index = elements.findIndex((element) =>
		element.isPointInside(x, y, ctx)
	);
	return index !== -1 ? index : null;
};
```

Decisiones de diseño:

- Separar la lógica de detección de elementos permite un código más modular y fácil de mantener.

### `getResizeDirection`

Esta función determina la dirección de redimensionamiento de un elemento basado en la posición del cursor. Si el cursor está cerca de los bordes del elemento, se devuelve la dirección correspondiente (top, bottom, left, right).

```js
const getResizeDirection = (element, x, y) => {
	const { startX, startY, endX, endY } = element;
	const handleSize = 10;
	let direction = "";
	if (y >= startY - handleSize && y <= startY + handleSize) direction += "top";
	if (y >= endY - handleSize && y <= endY + handleSize) direction += "bottom";
	if (x >= startX - handleSize && x <= startX + handleSize) direction += "left";
	if (x >= endX - handleSize && x <= endX + handleSize) direction += "right";
	return direction;
};
```

Decisiones de diseño:

- Permitir redimensionar desde cualquier borde o esquina proporciona una mayor flexibilidad en la manipulación de elementos.

### `getCursorForDirection`

Esta función devuelve el cursor adecuado para la dirección de redimensionamiento. Por ejemplo, ns-resize para redimensionar verticalmente y ew-resize para redimensionar horizontalmente.

```js
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
```

Decisiones de diseño:

- Cambiar el cursor según la acción proporciona una retroalimentación visual clara al usuario sobre lo que puede hacer.

## Exportar como Imagen

La función exportAsImage se utiliza para exportar el contenido del lienzo como una imagen JPG. Crea un nuevo lienzo en blanco, dibuja todos los elementos en él y luego convierte el lienzo a un formato de imagen.

```js
const exportAsImage = useCallback(() => {
	const canvas = exportCanvasRef.current;
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Fondo blanco
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	elements.forEach((element) => {
		element.draw(ctx);
	});

	const dataUrl = canvas.toDataURL("image/jpeg");
	const link = document.createElement("a");
	link.href = dataUrl;
	link.download = "canvas-export.jpg";
	link.click();
}, [elements]);
```

Decisiones de diseño:

- Exportar el lienzo como imagen permite a los usuarios guardar su trabajo de manera fácil y conveniente.

## Renderizado del Componente

El método render del componente define cómo se estructura la interfaz de usuario. Incluye el lienzo para dibujar, un lienzo adicional para la cuadrícula, y botones para herramientas y exportación.

```js
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
			<canvas
				ref={exportCanvasRef}
				width={800}
				height={600}
				style={{ display: "none" }}
			/>
			{selectedElementIndex !== null && (
				<InfoBox dimensions={dimensions} position={position} />
			)}
			{selectedTool === "text" && <TextForm addText={addText} />}
		</div>
		<button onClick={exportAsImage} className="jpg-button">
			jpg
		</button>
	</div>
);
```

Decisiones de diseño:

- Separar los diferentes componentes (lienzo principal, cuadrícula, toolbar) hace que el código sea más modular y fácil de mantener.
- Incluir un botón de exportación de imagen directamente en el componente proporciona una funcionalidad conveniente para el usuario.

## Conclusión

El componente DrawingCanvas ofrece una interfaz completa para dibujar y manipular elementos en un lienzo. Con su diseño basado en estados y hooks, proporciona una funcionalidad rica y reactiva. Además, la capacidad de exportar el contenido como una imagen permite a los usuarios guardar su trabajo fácilmente. Este documento debe proporcionar una guía clara sobre cómo funciona el componente y cómo mantenerlo o extenderlo en el futuro.
