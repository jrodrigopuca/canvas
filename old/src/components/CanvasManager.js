import React, { useState, useCallback } from "react";
import DrawingCanvas from "./DrawingCanvas";
import ElementFactory from "./ElementFactory";
import "./CanvasManager.css";

const CanvasManager = () => {
	const [elements, setElements] = useState([]);

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

	const updateElements = useCallback((newElements) => {
		setElements(newElements);
	}, []);

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
			<DrawingCanvas elements={elements} setElements={updateElements} />
		</div>
	);
};

export default CanvasManager;
