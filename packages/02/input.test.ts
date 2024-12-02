import { describe, expect, test } from "bun:test"
import { calculateValue } from "."
import { getInput } from "../utils"

const DAY = 2

const exampleInput = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`
describe(`2024-${DAY}`, () => {
	test("example", () => {
		expect(calculateValue(exampleInput)).toBe(4)
	})

	test("input", async () => {
		const input = await getInput(DAY)
		expect(calculateValue(input)).toBe(343)
	})
})
