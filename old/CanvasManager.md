# Canvas Manager

## Introducción

CanvasManager.js es un componente de React que actúa como contenedor principal para el componente DrawingCanvas. Su función principal es gestionar la importación y exportación de datos del lienzo, permitiendo a los usuarios guardar y cargar elementos del lienzo en formato JSON. Este componente proporciona una interfaz de usuario para interactuar con el lienzo y administrar los elementos dibujados.

# Componentes y Funciones Principales

## Importaciones

En primer lugar, importamos las dependencias necesarias, incluyendo React, hooks y otros componentes necesarios para el funcionamiento de la aplicación.

```js
import React, { useState, useCallback } from "react";
import DrawingCanvas from "./DrawingCanvas";
import ElementFactory from "./ElementFactory";
import "./CanvasManager.css";
```

## Estado del Componente

Utilizamos el hook useState de React para manejar el estado interno del componente, específicamente los elementos que se dibujan en el lienzo.

```js
const [elements, setElements] = useState([]);
```

## Funciones de Importación y Exportación

### `handleImport`

Esta función se activa cuando el usuario selecciona un archivo JSON para importar. Utiliza la API de FileReader para leer el contenido del archivo y convertirlo en elementos del lienzo utilizando ElementFactory.fromJSON.

```js
const handleImport = useCallback((event) => {
	const file = event.target.files[0];
	const reader = new FileReader();
	reader.onload = (e) => {
		const importedElements = JSON.parse(e.target.result).map((element) =>
			ElementFactory.fromJSON(element)
		);
		setElements(importedElements);
	};
	reader.readAsText(file);
}, []);
```

Decisiones de diseño:

- Utilizar FileReader permite manejar archivos locales de manera eficiente.
- Convertir el JSON importado en instancias de elementos asegura que el lienzo pueda renderizar y manipular los elementos correctamente.

### `handleExport`

Esta función se activa cuando el usuario quiere exportar los elementos del lienzo a un archivo JSON. Convierte los elementos actuales a un string JSON y crea un enlace de descarga.

```js
const handleExport = useCallback(() => {
	const dataStr = JSON.stringify(
		elements.map((element) => element.toJSON()),
		null,
		2
	);
	const dataUri =
		"data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

	const exportFileDefaultName = "canvas-elements.json";
	const linkElement = document.createElement("a");
	linkElement.setAttribute("href", dataUri);
	linkElement.setAttribute("download", exportFileDefaultName);
	linkElement.click();
}, [elements]);
```

Decisiones de diseño:

- Serializar los elementos a JSON permite guardar y compartir el estado del lienzo de manera fácil y estandarizada.
- Crear un enlace de descarga dinámicamente proporciona una experiencia de usuario fluida para exportar datos.

## Actualización de Elementos

Utilizamos un callback updateElements para actualizar el estado de los elementos en el lienzo. Este callback se pasa como prop al componente DrawingCanvas.

```js
const updateElements = useCallback((newElements) => {
	setElements(newElements);
}, []);
```

## Exportar como Imagen

Esta función se utiliza para exportar el contenido del lienzo como una imagen JPG. Se crea un nuevo lienzo en blanco, se dibujan todos los elementos en él y luego se convierte a un formato de imagen.

```js
const exportAsImage = useCallback(() => {
	const canvas = document.createElement("canvas");
	canvas.width = 800;
	canvas.height = 600;
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

- Exportar el lienzo como imagen permite a los usuarios guardar su trabajo de manera visual y conveniente.
- Crear un nuevo lienzo para la exportación asegura que se capture el estado actual del lienzo sin interferencias.

## Renderizado del Componente

El método render del componente define cómo se estructura la interfaz de usuario. Incluye botones para importar y exportar elementos del lienzo y el componente DrawingCanvas para la manipulación gráfica.

```js
return (
	<div className="canvas-manager">
		<div className="toolbar-buttons">
			<input
				type="file"
				accept=".json"
				onChange={handleImport}
				className="import-button"
			/>
			<button onClick={handleExport} className="export-button">
				Exportar JSON
			</button>
		</div>
		<DrawingCanvas
			elements={elements}
			setElements={updateElements}
			exportAsImage={exportAsImage}
		/>
	</div>
);
```

Decisiones de diseño:

- Separar las funcionalidades de importación y exportación en componentes independientes mejora la claridad y la mantenibilidad del código.
- Pasar las funciones y estados relevantes como props a DrawingCanvas asegura una buena separación de preocupaciones y facilita la comunicación entre componentes.

## Conclusión

El componente CanvasManager actúa como un contenedor eficiente para el componente DrawingCanvas, proporcionando funcionalidad adicional para importar y exportar datos del lienzo. La separación clara de responsabilidades entre importación, exportación y manipulación de elementos facilita el mantenimiento y la extensibilidad del código. Este documento debe proporcionar una guía clara sobre cómo funciona el componente y cómo mantenerlo o extenderlo en el futuro.
