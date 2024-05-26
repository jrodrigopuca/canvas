import ElementBase from "./ElementBase";

class Message extends ElementBase {
	draw(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.startX, this.startY);
		ctx.lineTo(this.endX, this.endY);
		ctx.strokeStyle = this.isFocused ? "green" : "black";
		ctx.stroke();

		// Dibujar la punta de la flecha
		const headlen = 10; // Tamaño de la cabeza de la flecha
		const angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);
		ctx.beginPath();
		ctx.moveTo(this.endX, this.endY);
		ctx.lineTo(
			this.endX - headlen * Math.cos(angle - Math.PI / 6),
			this.endY - headlen * Math.sin(angle - Math.PI / 6)
		);
		ctx.moveTo(this.endX, this.endY);
		ctx.lineTo(
			this.endX - headlen * Math.cos(angle + Math.PI / 6),
			this.endY - headlen * Math.sin(angle + Math.PI / 6)
		);
		ctx.strokeStyle = this.isFocused ? "green" : "black";
		ctx.stroke();
	}

	isPointInside(x, y) {
		const threshold = 5;
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

export default Message;
