export function parseInput(input: string) {
	// Define the regex pattern to match 'mul(x,y)' where x and y are numbers, or do(), or don't()
	const pattern = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g
	const matches: [number, number][] = []
	let match: RegExpExecArray | null = pattern.exec(input)
	let enabled = true

	// Use RegExp.exec to extract all matches
	while (match !== null) {
		if (match[0] === "do()") enabled = true
		else if (match[0] === "don't()") enabled = false
		else if (enabled) {
			const x = Number.parseInt(match[1], 10)
			const y = Number.parseInt(match[2], 10)
			matches.push([x, y])
		}
		match = pattern.exec(input)
	}

	return matches
}

export function calculateValue(input: string) {
	const values = parseInput(input)
	return values.reduce((acc, [x, y]) => acc + x * y, 0)
}
