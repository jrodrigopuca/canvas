import ElementBase from "./ElementBase";

class Rectangle extends ElementBase {
	constructor(startX, startY, endX, endY) {
		super("rectangle", startX, startY, endX, endY);
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.rect(
			this.startX,
			this.startY,
			this.endX - this.startX,
			this.endY - this.startY
		);
		ctx.strokeStyle = this.isFocused ? "green" : "black";
		ctx.stroke();
	}

	isPointInside(x, y) {
		return (
			x >= this.startX && x <= this.endX && y >= this.startY && y <= this.endY
		);
	}
}

export default Rectangle;
