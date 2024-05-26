import Line from "./Line";
import Rectangle from "./Rectangle";
import DotLine from "./DotLine";

class ElementFactory {
	static createElement(type, startX, startY, endX, endY) {
		switch (type) {
			case "line":
				return new Line(startX, startY, endX, endY);
			case "rectangle":
				return new Rectangle(startX, startY, endX, endY);
			case "dotline":
				return new DotLine(startX, startY, endX, endY);
			default:
				throw new Error(`Unknown element type: ${type}`);
		}
	}
}

export default ElementFactory;
