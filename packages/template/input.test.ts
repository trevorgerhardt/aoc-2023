import { describe, expect, test } from "bun:test"
import { calculateValue } from "."
import { getInput } from "../utils"

const DAY = 3

const exampleInput = ` 

`

describe(`2024-${DAY}`, () => {
	test("example", () => {
		expect(calculateValue(exampleInput)).toBe(0)
	})

	test("input", async () => {
		const input = await getInput(DAY)
		expect(calculateValue(input)).toBe(0)
	})
})
