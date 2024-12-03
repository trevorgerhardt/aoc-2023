export function parseInput(input: string) {
	return input.trim().split("\n")
}

export function calculateValue(input: string) {
	const values = parseInput(input)
	return values.length
}
