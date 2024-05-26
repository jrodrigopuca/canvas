import ElementBase from "./ElementBase";

class DotLine extends ElementBase {
	constructor(startX, startY, endX, endY) {
		super("dotline", startX, startY, endX, endY);
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.setLineDash([5, 5]); // Define el patrón de puntos
		ctx.moveTo(this.startX, this.startY);
		ctx.lineTo(this.endX, this.endY);
		ctx.strokeStyle = this.isFocused ? "green" : "black";
		ctx.stroke();
		ctx.setLineDash([]); // Restablecer a línea sólida
	}

	isPointInside(x, y) {
		const threshold = 5; // Distance threshold for detecting a click near the line
		const distance =
			Math.abs(
				(this.endY - this.startY) * x -
					(this.endX - this.startX) * y +
					this.endX * this.startY -
					this.endY * this.startX
			) /
			Math.sqrt(
				(this.endY - this.startY) ** 2 + (this.endX - this.startX) ** 2
			);
		return distance <= threshold;
	}
}

export default DotLine;
