import ElementBase from "./ElementBase";

class Diamond extends ElementBase {
	constructor(startX, startY, endX, endY) {
		super("diamond", startX, startY, endX, endY);
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.moveTo((this.startX + this.endX) / 2, this.startY);
		ctx.lineTo(this.endX, (this.startY + this.endY) / 2);
		ctx.lineTo((this.startX + this.endX) / 2, this.endY);
		ctx.lineTo(this.startX, (this.startY + this.endY) / 2);
		ctx.closePath();
		ctx.strokeStyle = this.isFocused ? "green" : "black";
		ctx.stroke();
	}

	isPointInside(x, y) {
		const cx = (this.startX + this.endX) / 2;
		const cy = (this.startY + this.endY) / 2;
		const dx = Math.abs(x - cx);
		const dy = Math.abs(y - cy);
		return dx / (this.endX - this.startX) + dy / (this.endY - this.startY) <= 1;
	}
}

export default Diamond;
