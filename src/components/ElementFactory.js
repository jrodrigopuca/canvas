import Line from "./Line";
import Rectangle from "./Rectangle";
import DotLine from "./DotLine";
import Actor from "./Actor";
import Lifeline from "./Lifeline";
import Message from "./Message";
import ActivationBar from "./ActivationBar";
import Circle from "./Circle";

class ElementFactory {
	static createElement(type, startX, startY, endX, endY) {
		switch (type) {
			case "line":
				return new Line(startX, startY, endX, endY);
			case "rectangle":
				return new Rectangle(startX, startY, endX, endY);
			case "dotline":
				return new DotLine(startX, startY, endX, endY);
			case "actor":
				return new Actor(startX, startY, endX, endY);
			case "lifeline":
				return new Lifeline(startX, startY, endX, endY);
			case "message":
				return new Message(startX, startY, endX, endY);
			case "activationbar":
				return new ActivationBar(startX, startY, endX, endY);
			case "circle":
				return new Circle(startX, startY, endX, endY);
			default:
				throw new Error(`Unknown element type: ${type}`);
		}
	}
}

export default ElementFactory;
