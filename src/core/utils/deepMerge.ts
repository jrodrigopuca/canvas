// Deep merge utility
// Used for merging theme objects

export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
	const output = { ...target };

	for (const key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			const sourceVal = source[key];
			const targetVal = target[key];

			if (
				sourceVal !== null &&
				typeof sourceVal === "object" &&
				!Array.isArray(sourceVal) &&
				targetVal !== null &&
				typeof targetVal === "object" &&
				!Array.isArray(targetVal)
			) {
				output[key] = deepMerge(
					targetVal as object,
					sourceVal as object,
				) as T[typeof key];
			} else if (sourceVal !== undefined) {
				output[key] = sourceVal as T[typeof key];
			}
		}
	}

	return output;
}
