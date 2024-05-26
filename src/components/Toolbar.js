import React from "react";
import "./Toolbar.css";

const Toolbar = React.memo(({ selectedTool, selectTool }) => {
	return (
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
				className={`tool-button ${selectedTool === "dotline" ? "active" : ""}`}
				onClick={() => selectTool("dotline")}
			>
				Línea Punteada
			</button>
			<button
				className={`tool-button ${selectedTool === "actor" ? "active" : ""}`}
				onClick={() => selectTool("actor")}
			>
				Actor
			</button>
			<button
				className={`tool-button ${selectedTool === "lifeline" ? "active" : ""}`}
				onClick={() => selectTool("lifeline")}
			>
				Lifeline
			</button>
			<button
				className={`tool-button ${selectedTool === "message" ? "active" : ""}`}
				onClick={() => selectTool("message")}
			>
				Mensaje
			</button>
			<button
				className={`tool-button ${
					selectedTool === "activationbar" ? "active" : ""
				}`}
				onClick={() => selectTool("activationbar")}
			>
				Barra de Activación
			</button>
			<button
				className={`tool-button ${selectedTool === "select" ? "active" : ""}`}
				onClick={() => selectTool("select")}
			>
				Seleccionar
			</button>
			<button
				className={`tool-button ${selectedTool === "text" ? "active" : ""}`}
				onClick={() => selectTool("text")}
			>
				Texto
			</button>
		</div>
	);
});

export default Toolbar;
