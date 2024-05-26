import ElementBase from "./ElementBase";

class Rectangle extends ElementBase {
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
			x >= Math.min(this.startX, this.endX) &&
			x <= Math.max(this.startX, this.endX) &&
			y >= Math.min(this.startY, this.endY) &&
			y <= Math.max(this.startY, this.endY)
		);
	}
}

export default Rectangle;
