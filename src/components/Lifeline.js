import ElementBase from "./ElementBase";

class Lifeline extends ElementBase {
	draw(ctx) {
		ctx.beginPath();
		ctx.setLineDash([5, 5]);
		ctx.moveTo(this.startX, this.startY);
		ctx.lineTo(this.startX, this.endY);
		ctx.strokeStyle = this.isFocused ? "green" : "black";
		ctx.stroke();
		ctx.setLineDash([]);
	}

	isPointInside(x, y) {
		const threshold = 5;
		return (
			Math.abs(x - this.startX) <= threshold &&
			y >= this.startY &&
			y <= this.endY
		);
	}
}

export default Lifeline;
