// ID generation utility
// Uses crypto.randomUUID() with fallback for older environments

export const generateId = (): string => {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return crypto.randomUUID();
	}
	// Fallback for environments without crypto.randomUUID
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
};
