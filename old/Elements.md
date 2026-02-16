# Documentación para Crear Nuevos Elementos en DrawingCanvas.js

## Introducción

Esta guía proporciona los pasos necesarios para crear nuevos elementos en el componente DrawingCanvas. Siguiendo estos pasos, cualquier desarrollador en React podrá extender la funcionalidad del lienzo añadiendo sus propios tipos de elementos personalizados.

# Pasos para Crear Nuevos Elementos

## 1. Crear una Nueva Clase de Elemento

Cada nuevo elemento debe ser una clase que herede de ElementBase. Esto asegura que el nuevo elemento tenga todas las funcionalidades básicas necesarias, como dibujar, mover y redimensionar.

Ejemplo: Crear un Elipse
Crear el archivo Ellipse.js:

```js
import ElementBase from "./ElementBase";

class Ellipse extends ElementBase {
	constructor(startX, startY, endX, endY) {
		super("ellipse", startX, startY, endX, endY);
	}

	draw(ctx) {
		const radiusX = (this.endX - this.startX) / 2;
		const radiusY = (this.endY - this.startY) / 2;
		const centerX = this.startX + radiusX;
		const centerY = this.startY + radiusY;

		ctx.beginPath();
		ctx.ellipse(
			centerX,
			centerY,
			Math.abs(radiusX),
			Math.abs(radiusY),
			0,
			0,
			2 * Math.PI
		);
		ctx.strokeStyle = this.isFocused ? "green" : "black";
		ctx.stroke();
	}

	isPointInside(x, y) {
		const radiusX = (this.endX - this.startX) / 2;
		const radiusY = (this.endY - this.startY) / 2;
		const centerX = this.startX + radiusX;
		const centerY = this.startY + radiusY;

		const normalizedX = x - centerX;
		const normalizedY = y - centerY;

		return (
			(normalizedX * normalizedX) / (radiusX * radiusX) +
				(normalizedY * normalizedY) / (radiusY * radiusY) <=
			1
		);
	}
}

export default Ellipse;
```

Decisiones de diseño:

- Heredar de ElementBase asegura que todas las funcionalidades básicas están presentes.
- Implementar el método draw para definir cómo se dibuja el elemento.
- Implementar el método isPointInside para la detección de clics dentro del elemento.

## 2. Registrar el Nuevo Elemento en ElementFactory

ElementFactory es responsable de crear instancias de elementos. Debes registrar tu nuevo elemento aquí para que pueda ser utilizado por el lienzo.

Modificar el archivo ElementFactory.js

```js
import Line from "./Line";
import Rectangle from "./Rectangle";
import DotLine from "./DotLine";
import Ellipse from "./Ellipse"; // Importar la nueva clase

class ElementFactory {
	static createElement(type, startX, startY, endX, endY) {
		switch (type) {
			case "line":
				return new Line(startX, startY, endX, endY);
			case "rectangle":
				return new Rectangle(startX, startY, endX, endY);
			case "dotline":
				return new DotLine(startX, startY, endX, endY);
			case "ellipse":
				return new Ellipse(startX, startY, endX, endY); // Registrar la nueva clase
			default:
				throw new Error(`Unknown element type: ${type}`);
		}
	}

	static fromJSON(element) {
		const { type, startX, startY, endX, endY } = element;
		switch (type) {
			case "line":
				return new Line(startX, startY, endX, endY);
			case "rectangle":
				return new Rectangle(startX, startY, endX, endY);
			case "dotline":
				return new DotLine(startX, startY, endX, endY);
			case "ellipse":
				return new Ellipse(startX, startY, endX, endY); // Registrar la nueva clase
			default:
				throw new Error(`Unknown element type: ${type}`);
		}
	}
}

export default ElementFactory;
```

Decisiones de diseño:

- Registrar el nuevo elemento en ElementFactory permite crear instancias de este elemento dinámicamente en base a su tipo.

## 3. Agregar la Nueva Herramienta al Toolbar

Para que los usuarios puedan seleccionar y utilizar el nuevo elemento, debes agregar un botón para esta herramienta en el toolbar.

Modificar el archivo Toolbar.js:

import React from 'react';

```js
const Toolbar = ({ selectedTool, selectTool }) => (
	<div className="toolbar">
		<button
			onClick={() => selectTool("line")}
			className={selectedTool === "line" ? "active" : ""}
		>
			Línea
		</button>
		<button
			onClick={() => selectTool("rectangle")}
			className={selectedTool === "rectangle" ? "active" : ""}
		>
			Rectángulo
		</button>
		<button
			onClick={() => selectTool("dotline")}
			className={selectedTool === "dotline" ? "active" : ""}
		>
			Línea Punteada
		</button>
		<button
			onClick={() => selectTool("ellipse")}
			className={selectedTool === "ellipse" ? "active" : ""}
		>
			Elipse
		</button> {/* Agregar botón para la nueva herramienta */}
	</div>
);

export default Toolbar;
```

## Resumen

Para crear un nuevo elemento en el componente DrawingCanvas, sigue estos pasos:

1. Crear una nueva clase de elemento que herede de ElementBase.
2. Registrar la nueva clase en ElementFactory.
3. Agregar un botón para la nueva herramienta en el toolbar.
4. Asegurarse de que DrawingCanvas pueda manejar el nuevo tipo de elemento.

Siguiendo estos pasos, puedes extender fácilmente la funcionalidad del lienzo añadiendo nuevos tipos de elementos personalizados.
