import ElementBase from "./ElementBase";

class Line extends ElementBase {
	draw(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.startX, this.startY);
		ctx.lineTo(this.endX, this.endY);
		ctx.strokeStyle = this.isFocused ? "green" : "black";
		ctx.stroke();
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

export default Line;
