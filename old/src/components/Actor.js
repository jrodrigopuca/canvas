import ElementBase from "./ElementBase";

class Actor extends ElementBase {
	constructor(startX, startY, endX, endY) {
		super("actor", startX, startY, endX, endY);
	}
	draw(ctx) {
		ctx.beginPath();
		// Dibujar un círculo para la cabeza del actor
		ctx.arc(this.startX, this.startY, 10, 0, Math.PI * 2, true);
		ctx.moveTo(this.startX, this.startY + 10);
		// Dibujar el cuerpo del actor
		ctx.lineTo(this.startX, this.startY + 30);
		ctx.moveTo(this.startX - 10, this.startY + 20);
		// Dibujar los brazos
		ctx.lineTo(this.startX + 10, this.startY + 20);
		ctx.moveTo(this.startX, this.startY + 30);
		// Dibujar las piernas
		ctx.lineTo(this.startX - 10, this.startY + 40);
		ctx.moveTo(this.startX, this.startY + 30);
		ctx.lineTo(this.startX + 10, this.startY + 40);
		ctx.strokeStyle = this.isFocused ? "green" : "black";
		ctx.stroke();
	}

	isPointInside(x, y) {
		return Math.abs(x - this.startX) <= 10 && Math.abs(y - this.startY) <= 40;
	}
}

export default Actor;
