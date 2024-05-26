import ElementBase from "./ElementBase";

class Circle extends ElementBase {
	constructor(startX, startY, endX, endY) {
		super("circle", startX, startY, endX, endY);
	}
	draw(ctx) {
		const radius = Math.sqrt(
			Math.pow(this.endX - this.startX, 2) +
				Math.pow(this.endY - this.startY, 2)
		);
		ctx.beginPath();
		ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
		ctx.strokeStyle = this.isFocused ? "green" : "black";
		ctx.stroke();
	}

	isPointInside(x, y) {
		const radius = Math.sqrt(
			Math.pow(this.endX - this.startX, 2) +
				Math.pow(this.endY - this.startY, 2)
		);
		const distance = Math.sqrt(
			Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)
		);
		return distance <= radius;
	}
}

export default Circle;
