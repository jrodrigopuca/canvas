import React, { useState, useCallback } from "react";
import "./TextForm.css";

const TextForm = React.memo(({ addText }) => {
	const [text, setText] = useState("");

	const handleSubmit = useCallback(
		(e) => {
			e.preventDefault();
			if (text.trim()) {
				addText(text);
				setText("");
			}
		},
		[text, addText]
	);

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
});

export default TextForm;
