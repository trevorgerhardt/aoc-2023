import { describe, expect, test } from "bun:test"
import { calculateValue } from "."
import { getInput } from "../utils"

const exampleInput = `
3   4
4   3
2   5
1   3
3   9
3   3
`
describe("2024-01", () => {
	test("example", () => {
		expect(calculateValue(exampleInput)).toBe(31)
	})

	test("pt2", async () => {
		const input = await getInput(1)
		expect(calculateValue(input)).toBe(1_882_714)
	})
})
