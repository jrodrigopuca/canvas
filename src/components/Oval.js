import ElementBase from "./ElementBase";

class Oval extends ElementBase {
	draw(ctx) {
		ctx.beginPath();
		ctx.ellipse(
			(this.startX + this.endX) / 2,
			(this.startY + this.endY) / 2,
			Math.abs(this.endX - this.startX) / 2,
			Math.abs(this.endY - this.startY) / 2,
			0,
			0,
			2 * Math.PI
		);
		ctx.strokeStyle = this.isFocused ? "green" : "black";
		ctx.stroke();
	}

	isPointInside(x, y) {
		const rx = Math.abs(this.endX - this.startX) / 2;
		const ry = Math.abs(this.endY - this.startY) / 2;
		const cx = (this.startX + this.endX) / 2;
		const cy = (this.startY + this.endY) / 2;
		const dx = x - cx;
		const dy = y - cy;
		return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
	}
}

export default Oval;
