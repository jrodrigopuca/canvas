// Validation utilities
// Schema validation for imported data

import type { CanvasElement, Connection } from "@/types/elements";
import type { CanvasData } from "./serialization";

export interface ValidationResult {
	valid: boolean;
	errors: string[];
}

/**
 * Validate canvas data structure
 */
export const validateCanvasData = (data: unknown): ValidationResult => {
	const errors: string[] = [];

	if (!data || typeof data !== "object") {
		return { valid: false, errors: ["Data must be an object"] };
	}

	const obj = data as Record<string, unknown>;

	// Check version
	if (typeof obj.version !== "string") {
		errors.push("Missing or invalid version field");
	}

	// Check elements array
	if (!Array.isArray(obj.elements)) {
		errors.push("Elements must be an array");
	} else {
		obj.elements.forEach((element, index) => {
			const elementErrors = validateElement(element, index);
			errors.push(...elementErrors);
		});
	}

	// Check connections array
	if (!Array.isArray(obj.connections)) {
		errors.push("Connections must be an array");
	} else {
		obj.connections.forEach((connection, index) => {
			const connectionErrors = validateConnection(connection, index);
			errors.push(...connectionErrors);
		});
	}

	return {
		valid: errors.length === 0,
		errors,
	};
};

/**
 * Validate a single element
 */
export const validateElement = (element: unknown, index: number): string[] => {
	const errors: string[] = [];
	const prefix = `Element[${index}]`;

	if (!element || typeof element !== "object") {
		return [`${prefix}: Must be an object`];
	}

	const el = element as Record<string, unknown>;

	// Required fields
	if (typeof el.id !== "string" || el.id.length === 0) {
		errors.push(`${prefix}: Missing or invalid id`);
	}

	if (typeof el.type !== "string" || el.type.length === 0) {
		errors.push(`${prefix}: Missing or invalid type`);
	}

	if (typeof el.x !== "number" || isNaN(el.x)) {
		errors.push(`${prefix}: Missing or invalid x coordinate`);
	}

	if (typeof el.y !== "number" || isNaN(el.y)) {
		errors.push(`${prefix}: Missing or invalid y coordinate`);
	}

	if (typeof el.width !== "number" || isNaN(el.width) || el.width < 0) {
		errors.push(`${prefix}: Missing or invalid width`);
	}

	if (typeof el.height !== "number" || isNaN(el.height) || el.height < 0) {
		errors.push(`${prefix}: Missing or invalid height`);
	}

	if (typeof el.zIndex !== "number" || isNaN(el.zIndex)) {
		errors.push(`${prefix}: Missing or invalid zIndex`);
	}

	return errors;
};

/**
 * Validate a single connection
 */
export const validateConnection = (
	connection: unknown,
	index: number,
): string[] => {
	const errors: string[] = [];
	const prefix = `Connection[${index}]`;

	if (!connection || typeof connection !== "object") {
		return [`${prefix}: Must be an object`];
	}

	const conn = connection as Record<string, unknown>;

	if (typeof conn.id !== "string" || conn.id.length === 0) {
		errors.push(`${prefix}: Missing or invalid id`);
	}

	if (typeof conn.fromId !== "string" || conn.fromId.length === 0) {
		errors.push(`${prefix}: Missing or invalid fromId`);
	}

	if (typeof conn.toId !== "string" || conn.toId.length === 0) {
		errors.push(`${prefix}: Missing or invalid toId`);
	}

	return errors;
};

/**
 * Check if all connection references exist
 */
export const validateConnectionReferences = (
	elements: CanvasElement[],
	connections: Connection[],
): ValidationResult => {
	const errors: string[] = [];
	const elementIds = new Set(elements.map((el) => el.id));

	connections.forEach((conn, index) => {
		if (!elementIds.has(conn.fromId)) {
			errors.push(
				`Connection[${index}]: fromId '${conn.fromId}' does not exist`,
			);
		}
		if (!elementIds.has(conn.toId)) {
			errors.push(`Connection[${index}]: toId '${conn.toId}' does not exist`);
		}
	});

	return {
		valid: errors.length === 0,
		errors,
	};
};
