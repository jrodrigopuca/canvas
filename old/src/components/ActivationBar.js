import ElementBase from "./ElementBase";

class ActivationBar extends ElementBase {
	constructor(startX, startY, endX, endY) {
		super("activationbar", startX, startY, endX, endY);
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.rect(this.startX - 2.5, this.startY, 5, this.endY - this.startY);
		ctx.strokeStyle = this.isFocused ? "green" : "black";
		ctx.stroke();
	}

	isPointInside(x, y) {
		return (
			x >= this.startX - 2.5 &&
			x <= this.startX + 2.5 &&
			y >= this.startY &&
			y <= this.endY
		);
	}
}

export default ActivationBar;
