class ElementBase {
	constructor(startX, startY, endX, endY) {
		this.startX = startX;
		this.startY = startY;
		this.endX = endX;
		this.endY = endY;
		this.isMoving = false;
		this.isFocused = false;
	}

	draw(ctx) {
		throw new Error("Draw method not implemented!");
	}

	move(deltaX, deltaY) {
		this.startX += deltaX;
		this.startY += deltaY;
		this.endX += deltaX;
		this.endY += deltaY;
	}

	resize(newX, newY, direction) {
		if (direction.includes("right")) this.endX = newX;
		if (direction.includes("left")) this.startX = newX;
		if (direction.includes("bottom")) this.endY = newY;
		if (direction.includes("top")) this.startY = newY;
	}

	isPointInside(x, y) {
		throw new Error("isPointInside method not implemented!");
	}

	focus() {
		this.isFocused = true;
	}

	blur() {
		this.isFocused = false;
	}

	getDimensions() {
		return {
			w: Math.abs(this.endX - this.startX),
			h: Math.abs(this.endY - this.startY),
		};
	}
}

export default ElementBase;
