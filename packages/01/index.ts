function parseInput(input: string) {
	const c1 = []
	const c2: Record<number, number> = {}
	const lines = input.trim().split("\n")
	for (const line of lines) {
		const [v1, v2] = line.split(/\s+/).map(Number)
		c1.push(v1)
		c2[v2] = (c2[v2] ?? 0) + 1
	}
	return { c1, c2 }
}

export function calculateValue(input: string) {
	const { c1, c2 } = parseInput(input)
	console.log(c2)
	let score = 0
	for (let i = 0; i < c1.length; i++) {
		score += c1[i] * (c2[c1[i]] ?? 0)
	}
	return score
}
