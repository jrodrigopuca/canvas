import React from "react";
import "./InfoBox.css";

const InfoBox = ({ dimensions, position }) => {
	return (
		<div className="info-box">
			<div>W: {dimensions.w}px</div>
			<div>H: {dimensions.h}px</div>
			<div>X: {position.x}px</div>
			<div>Y: {position.y}px</div>
		</div>
	);
};

export default InfoBox;
