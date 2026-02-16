import ElementBase from "./ElementBase";

class TextElement extends ElementBase {
	constructor(text, startX, startY) {
		super("text", startX, startY, startX, startY);
		this.text = text;
	}

	draw(ctx) {
		ctx.font = "16px Arial";
		ctx.fillStyle = this.isFocused ? "green" : "black";
		ctx.fillText(this.text, this.startX, this.startY);
	}

	move(deltaX, deltaY) {
		this.startX += deltaX;
		this.startY += deltaY;
	}

	isPointInside(x, y, ctx) {
		ctx.font = "16px Arial"; // Asegúrate de que el font está definido
		const width = ctx.measureText(this.text).width;
		const height = 16; // Approximate height based on font size
		return (
			x >= this.startX &&
			x <= this.startX + width &&
			y >= this.startY - height &&
			y <= this.startY
		);
	}

	getDimensions(ctx) {
		ctx.font = "16px Arial"; // Asegúrate de que el font está definido
		const width = ctx.measureText(this.text).width;
		const height = 16; // Approximate height based on font size
		return {
			w: width,
			h: height,
		};
	}

	toJSON() {
		return {
			...super.toJSON(),
			text: this.text,
		};
	}
}

export default TextElement;
