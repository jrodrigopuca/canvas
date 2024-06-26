import Line from "./Line";
import Rectangle from "./Rectangle";
import DotLine from "./DotLine";
import Actor from "./Actor";
import Lifeline from "./Lifeline";
import Message from "./Message";
import ActivationBar from "./ActivationBar";
import Oval from "./Oval";
import Diamond from "./Diamond";
import TextElement from "./TextElement";

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
			case "oval":
				return new Oval(startX, startY, endX, endY);
			case "diamond":
				return new Diamond(startX, startY, endX, endY);
			case "text":
				return new TextElement("", startX, startY); // TextElement necesita un texto inicial
			default:
				throw new Error(`Unknown element type: ${type}`);
		}
	}

	static fromJSON(element) {
		const { type, startX, startY, endX, endY, text } = element;
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
			case "oval":
				return new Oval(startX, startY, endX, endY);
			case "diamond":
				return new Diamond(startX, startY, endX, endY);
			case "text":
				return new TextElement(text, startX, startY);
			default:
				throw new Error(`Unknown element type: ${type}`);
		}
	}
}
export default ElementFactory;
