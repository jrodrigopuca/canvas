// Components barrel export

export { Canvas } from "./Canvas";
export type { CanvasProps, CanvasRef } from "./Canvas";

export { DrawingCanvas } from "./DrawingCanvas";
export type { DrawingCanvasProps } from "./DrawingCanvas";

export { ElementFactory, createElement } from "./ElementFactory";
export {
	createRectangle,
	createEllipse,
	createCircle,
	createDiamond,
	createText,
	createLine,
	createActor,
	createLifeline,
	createMessage,
	createActivationBar,
} from "./ElementFactory";
export type {
	CreateElementOptions,
	CreateTextElementOptions,
	CreateLineElementOptions,
	CreateActorElementOptions,
	CreateLifelineElementOptions,
	CreateMessageElementOptions,
} from "./ElementFactory";
