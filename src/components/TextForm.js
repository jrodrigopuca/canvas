import React, { useState } from "react";
import "./TextForm.css";

const TextForm = ({ addText }) => {
	const [text, setText] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (text.trim()) {
			addText(text);
			setText("");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="text-form">
			<input
				type="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="Enter text"
				required
			/>
			<button type="submit">Add Text</button>
		</form>
	);
};

export default TextForm;
