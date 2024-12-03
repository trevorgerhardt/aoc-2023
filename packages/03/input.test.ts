import { describe, expect, test } from "bun:test"
import { calculateValue } from "."
import { getInput } from "../utils"

const DAY = 3

const exampleInput = ` 
xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
`

describe(`2024-${DAY}`, () => {
	test("example", () => {
		expect(calculateValue(exampleInput)).toBe(48)
	})

	test("input", async () => {
		const input = await getInput(DAY)
		expect(calculateValue(input)).toBe(84893551)
	})
})
