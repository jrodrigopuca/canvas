// Classnames utility
// Simple alternative to clsx/classnames libraries

type ClassValue =
	| string
	| number
	| boolean
	| undefined
	| null
	| ClassObject
	| ClassValue[];
type ClassObject = { [key: string]: boolean | undefined | null };

export const cx = (...args: ClassValue[]): string => {
	const classes: string[] = [];

	for (const arg of args) {
		if (!arg) continue;

		if (typeof arg === "string" || typeof arg === "number") {
			classes.push(String(arg));
		} else if (Array.isArray(arg)) {
			const inner = cx(...arg);
			if (inner) classes.push(inner);
		} else if (typeof arg === "object") {
			for (const [key, value] of Object.entries(arg)) {
				if (value) classes.push(key);
			}
		}
	}

	return classes.join(" ");
};
