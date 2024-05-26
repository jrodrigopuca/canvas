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
		throw new Error("Method draw() must be implemented in subclasses");
	}

	move(deltaX, deltaY) {
		this.startX += deltaX;
		this.startY += deltaY;
		this.endX += deltaX;
		this.endY += deltaY;
	}

	resize(offsetX, offsetY, direction) {
		if (direction.includes("top")) {
			this.startY = offsetY;
		}
		if (direction.includes("bottom")) {
			this.endY = offsetY;
		}
		if (direction.includes("left")) {
			this.startX = offsetX;
		}
		if (direction.includes("right")) {
			this.endX = offsetX;
		}
	}

	isPointInside(x, y) {
		throw new Error("Method isPointInside() must be implemented in subclasses");
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
			x: this.startX,
			y: this.startY,
		};
	}
}

export default ElementBase;
