class TextElement {
	constructor(text, x, y) {
		this.text = text;
		this.x = x;
		this.y = y;
		this.isMoving = false;
		this.isFocused = false;
	}

	draw(ctx) {
		ctx.font = "16px Arial";
		ctx.fillStyle = this.isFocused ? "green" : "black";
		ctx.fillText(this.text, this.x, this.y);
	}

	move(deltaX, deltaY) {
		this.x += deltaX;
		this.y += deltaY;
	}

	isPointInside(x, y, ctx) {
		ctx.font = "16px Arial"; // Asegúrate de que el font está definido
		const width = ctx.measureText(this.text).width;
		const height = 16; // Approximate height based on font size
		return (
			x >= this.x && x <= this.x + width && y >= this.y - height && y <= this.y
		);
	}

	focus() {
		this.isFocused = true;
	}

	blur() {
		this.isFocused = false;
	}
}

export default TextElement;
